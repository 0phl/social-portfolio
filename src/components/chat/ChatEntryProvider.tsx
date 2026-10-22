import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { ChatEntryContext } from '../../chat/useChatEntry';
import { useChatSounds } from '../../chat/useChatSounds';
import { navigateFromChat } from '../../chat/navigation';
import { profile } from '../../data/profile';
import { MessagePanel } from '../profile/MessagePanel';

const welcomeKey = 'portfolio-chat-welcome';
type WelcomeState = 'new' | 'shown' | 'read';

function focusProfileMessage() {
  const button = document.getElementById('profile-message');
  const target = button && !button.closest('[hidden]') ? button : document.getElementById('main-content');
  target?.focus({ preventScroll: true });
}

export function ChatEntryProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [welcome, setWelcome] = useState<WelcomeState | null>(null);
  const [preview, setPreview] = useState(false);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const destination = useRef<string | null>(null);
  const { prepare, playReceive } = useChatSounds([]);
  const unread = welcome === 'shown';

  const remember = (state: WelcomeState) => {
    setWelcome(state);
    try { sessionStorage.setItem(welcomeKey, state); } catch { /* In-memory state still works. */ }
  };

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(welcomeKey);
      setWelcome(stored === 'shown' || stored === 'read' ? stored : 'new');
    } catch { setWelcome('new'); }
  }, []);

  useEffect(() => {
    if (welcome !== 'new' || open) return;
    // Audio is primed only by a visitor gesture; a blocked chime is simply skipped.
    const prime = () => prepare();
    window.addEventListener('pointerdown', prime, { once: true });
    window.addEventListener('keydown', prime, { once: true });
    let timer: number;
    const schedule = () => {
      clearTimeout(timer);
      if (document.hidden) return;
      timer = window.setTimeout(() => {
        if (document.hidden) return;
        if (document.querySelector('dialog[open]')) { schedule(); return; }
        remember('shown');
        setPreview(true);
        playReceive();
      }, 4000);
    };
    schedule();
    document.addEventListener('visibilitychange', schedule);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', prime);
      window.removeEventListener('keydown', prime);
      document.removeEventListener('visibilitychange', schedule);
    };
  }, [welcome, open, prepare, playReceive]);

  const openChat = (element: HTMLElement) => {
    trigger.current = element;
    remember('read');
    setPreview(false);
    setOpen(true);
  };

  return (
    <ChatEntryContext.Provider value={{ unread, openChat }}>
      {children}
      {!open && preview && <aside aria-label="Chat with Ronan's AI assistant" className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)] sm:bottom-6 sm:right-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="relative w-80 max-w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-lg"
        >
          <button type="button" aria-label="Dismiss welcome" onClick={() => { setPreview(false); focusProfileMessage(); }} className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-700 focus-visible:outline-brand"><XIcon aria-hidden="true" className="h-4 w-4" /></button>
          <div className="flex items-center gap-2.5 pr-5">
            <img src={profile.avatar} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
            <p className="text-sm font-semibold text-gray-900">Ronan’s AI assistant</p>
          </div>
          <p role="status" className="mt-3 text-sm leading-relaxed text-gray-600">Hey! Welcome to Ronan’s portfolio. Want a quick tour of his projects?</p>
          <button type="button" onClick={(event) => openChat(event.currentTarget)} className="mt-3 inline-flex min-h-11 items-center rounded-full bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Open chat</button>
        </motion.div>
      </aside>}
      <AnimatePresence onExitComplete={() => {
        const url = destination.current; destination.current = null;
        if (url) { navigateFromChat(url); return; }
        requestAnimationFrame(() => {
          const previous = trigger.current;
          if (previous?.isConnected && !previous.closest('[hidden]')) previous.focus({ preventScroll: true });
          else focusProfileMessage();
        });
      }}>
        {open && <MessagePanel key="messages" onClose={() => setOpen(false)} onNavigate={(url) => { destination.current = url; setOpen(false); }} />}
      </AnimatePresence>
    </ChatEntryContext.Provider>
  );
}
