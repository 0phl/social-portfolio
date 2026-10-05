import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GithubIcon, LinkedinIcon, SendIcon, XIcon } from 'lucide-react';
import { profile } from '../../data/profile';
import { VisitorAvatar } from '../shared/VisitorAvatar';
import { useChat } from '../../chat/useChat';
import { AssistantMessage } from '../chat/AssistantMessage';
import { TurnstileChallenge } from '../chat/TurnstileChallenge';

export function MessagePanel({ onClose, onNavigate }: { onClose: () => void; onNavigate: (url: string) => void }) {
  const reduceMotion = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const conversation = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState('');
  const { messages, pending, send: sendMessage, retry, stop, reset } = useChat();
  const [token, setToken] = useState('');
  const [revision, setRevision] = useState(0);
  const [siteKey, setSiteKey] = useState('');
  const [configError, setConfigError] = useState('');
  const [configAttempt, setConfigAttempt] = useState(0);
  const nearBottom = useRef(true);
  const tokenRef = useRef('');
  const acceptToken = (value: string) => { tokenRef.current = value; setToken(value); };
  const close = () => { stop(); onClose(); };
  const navigate = (url: string) => { stop(); onNavigate(url); };

  useEffect(() => {
    const controller = new AbortController();
    setConfigError('');
    void fetch('/api/chat/config', { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error();
      const config = await response.json();
      if (!config.turnstileSiteKey) throw new Error();
      if (!controller.signal.aborted) setSiteKey(config.turnstileSiteKey);
    }).catch(() => { if (!controller.signal.aborted) setConfigError('Chat is unavailable here. You can reach Ronan on LinkedIn.'); });
    return () => { controller.abort(); };
  }, [configAttempt]);
  useEffect(() => () => stop(), [stop]);

  useLayoutEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  useEffect(() => {
    const element = conversation.current;
    if (element && nearBottom.current) element.scrollTop = element.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!draft.trim() || pending || !tokenRef.current) return;
    const freshToken = tokenRef.current; acceptToken('');
    void sendMessage(draft, freshToken); setRevision((value) => value + 1);
    nearBottom.current = true;
    setDraft('');
    input.current?.focus({ preventScroll: true });
  };

  return (
    <dialog
      ref={dialog}
      onCancel={(event) => { event.preventDefault(); close(); }}
      aria-labelledby="message-title"
      aria-describedby="message-disclaimer"
      className="fixed inset-0 !m-0 h-[100dvh] max-h-none w-screen max-w-none grid-cols-1 grid-rows-[minmax(0,1fr)] place-items-center overflow-hidden border-0 bg-transparent p-4 text-gray-900 backdrop:bg-transparent open:grid sm:p-8"
    >
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-0 bg-gray-900/25 backdrop-blur-sm"
      />
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
        className="relative flex h-[640px] max-h-full w-[920px] max-w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      >
        <header className="flex h-20 shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-5 sm:px-8">
          <div>
            <h2 id="message-title" className="text-base font-semibold tracking-tight">Messages</h2>
            <p className="mt-1 text-xs text-gray-500">Ronan's assistant <span aria-hidden="true">·</span> AI</p>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => { reset(); setDraft(''); acceptToken(''); setRevision((value) => value + 1); }} disabled={!messages.length} className="min-h-11 px-2 text-xs text-gray-500 hover:text-brand disabled:opacity-40">New chat</button>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" title="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-full text-gray-500 hover:bg-gray-50 hover:text-brand md:hidden"><LinkedinIcon aria-hidden="true" className="h-4 w-4" /></a>
            <button type="button" onClick={close} aria-label="Close messages" className="flex h-11 w-11 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"><XIcon aria-hidden="true" className="h-5 w-5" /></button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-slate-50/70">
            <div ref={conversation} onScroll={() => { const el = conversation.current; if (el) nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-7 sm:px-8">
              <p className="mb-8 text-center text-[11px] font-medium text-gray-400">Today</p>
              <div role="log" aria-live="off" aria-label="Conversation with Ronan's AI assistant" className="space-y-7 text-sm leading-relaxed">
                <div className="flex items-start gap-3">
                  <img src={profile.avatar} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 max-w-[85%] sm:max-w-[80%]">
                    <p className="mb-2 text-xs font-medium text-gray-600">Ronan's assistant</p>
                    <p className="rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 text-gray-700">Hey! I'm Ronan's AI assistant. Ask me about his projects, how he got started, or just say hi. Where should we start?</p>
                  </div>
                </div>
                {messages.map((message) => (
                  <div key={message.id} className="space-y-7">
                    {message.role === 'user' ? (
                    <div className="flex items-start justify-end gap-3">
                      <div className="min-w-0 max-w-[80%]">
                        <p className="mb-2 text-right text-xs font-medium text-gray-600">You <span className="ml-2 text-[11px] font-normal text-gray-400">{message.time}</span></p>
                        <p className="whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-brand-light px-4 py-3 text-gray-900">{message.text}</p>
                      </div>
                      <VisitorAvatar />
                    </div>
                    ) : (
                    <div className="flex items-start gap-3">
                      <img src={profile.avatar} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                      <div className="min-w-0 max-w-[85%] sm:max-w-[80%]">
                        <p className="mb-2 text-xs font-medium text-gray-600">Ronan's assistant <span className="ml-2 text-[11px] font-normal text-gray-400">{message.time}</span></p>
                        <div className="rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 text-gray-700">
                          {message.text ? <AssistantMessage text={message.text} onNavigate={navigate} /> : message.status === 'pending' ? <span className="text-gray-400">Thinking...</span> : null}
                          {message.error && <p className="mt-2 text-xs text-gray-500">{message.error}</p>}
                          {message.id === messages[messages.length - 1]?.id && ['error', 'incomplete'].includes(message.status) && <button type="button" disabled={!token || pending} onClick={() => { const freshToken = tokenRef.current; acceptToken(''); void retry(freshToken); setRevision((value) => value + 1); nearBottom.current = true; }} className="mt-2 min-h-9 text-xs font-medium text-brand disabled:text-gray-400">Retry reply</button>}
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                ))}
              </div>
              {messages.length === 0 && <div className="ml-11 mt-4 flex flex-wrap gap-2">{['Show me a project', 'How did Ronan get started?', 'What does he work with?'].map((prompt) => <button key={prompt} type="button" onClick={() => { setDraft(prompt); input.current?.focus({ preventScroll: true }); }} className="min-h-9 rounded-full border border-gray-200 bg-white px-3 text-xs text-gray-500 transition-colors hover:border-brand hover:text-brand">{prompt}</button>)}</div>}
            </div>
            <p className="sr-only" role="status">{pending ? 'Assistant is replying.' : messages.length ? messages[messages.length - 1].status === 'complete' ? 'Reply complete.' : 'Reply stopped or unavailable.' : ''}</p>

            <form onSubmit={(event) => { event.preventDefault(); send(); }} className="shrink-0 px-4 pb-4 pt-3 sm:px-8 sm:pb-5">
              <div className="mb-2">{siteKey ? <TurnstileChallenge siteKey={siteKey} revision={revision} onToken={acceptToken} /> : <p className="text-xs text-gray-500">{configError || 'Loading verification...'} {configError && <button type="button" className="text-brand underline" onClick={() => setConfigAttempt((value) => value + 1)}>Try again</button>}</p>}</div>
              <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-colors focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/5">
                <textarea ref={input} maxLength={2000} aria-label="Message" placeholder="Write a message..." value={draft} onChange={(event) => setDraft(event.target.value)} rows={1} className="max-h-28 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-base leading-relaxed outline-none sm:text-sm" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }} />
                {pending ? <button type="button" onClick={stop} className="h-11 shrink-0 rounded-xl bg-gray-900 px-3 text-xs font-medium text-white">Stop</button> : <button type="submit" disabled={!draft.trim() || !token} aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-colors hover:bg-brand-hover disabled:bg-gray-100 disabled:text-gray-400"><SendIcon aria-hidden="true" className="h-4 w-4" /></button>}
              </div>
              <p id="message-disclaimer" className="mt-2 text-center text-[11px] text-gray-500">AI assistant. Messages are sent to Google Gemini. Please don't share sensitive information.</p>
              <details className="mt-1 text-center text-[11px] text-gray-500"><summary className="cursor-pointer">About this chat</summary><p className="mt-1 max-h-20 overflow-y-auto">Replies can be wrong. This site keeps chat only in memory until reload and does not save message history on its server. Google processes your messages and may use free-tier content to improve its products, including human review. Cloudflare verifies requests to help prevent abuse.</p></details>
            </form>
          </div>

          <aside aria-label="About Ronan" className="hidden w-60 shrink-0 flex-col items-center overflow-y-auto border-l border-gray-100 px-6 py-9 md:flex">
            <img src={profile.avatar} alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-full border border-gray-100 object-cover" />
            <h3 className="mt-4 text-sm font-semibold">{profile.name}</h3>
            <p className="mt-1 text-xs text-gray-400">{profile.location}</p>
            <div className="mt-4 flex items-center gap-1">
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn (opens in a new tab)" title="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-50 hover:text-brand"><LinkedinIcon aria-hidden="true" className="h-4 w-4" /></a>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="View GitHub (opens in a new tab)" title="GitHub" className="flex h-11 w-11 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-900"><GithubIcon aria-hidden="true" className="h-4 w-4" /></a>
            </div>
            <div className="mt-6 w-full border-t border-gray-100 pt-6">
              <h4 className="text-xs font-medium text-gray-900">About</h4>
              <p className="mt-3 text-xs leading-relaxed text-gray-500">I work with Linux servers and build web applications.</p>
            </div>
          </aside>
        </div>
      </motion.div>
    </dialog>
  );
}
