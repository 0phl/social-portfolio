import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GithubIcon, LinkedinIcon, SendIcon, XIcon } from 'lucide-react';
import { profile } from '../../data/profile';
import { VisitorAvatar } from '../shared/VisitorAvatar';

export function MessagePanel({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const conversation = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<{ text: string; time: string }[]>([]);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  useEffect(() => {
    const element = conversation.current;
    if (element && messages.length) element.scrollTop = element.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    setMessages((previous) => [...previous, { text: draft.trim(), time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }]);
    setDraft('');
    input.current?.focus({ preventScroll: true });
  };

  return (
    <dialog
      ref={dialog}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      aria-labelledby="message-title"
      aria-describedby="message-disclaimer"
      className="fixed inset-0 !m-0 h-[100dvh] max-h-none w-screen max-w-none grid-cols-1 grid-rows-[minmax(0,1fr)] place-items-center overflow-hidden border-0 bg-transparent p-4 text-gray-900 backdrop:bg-gray-900/25 backdrop:backdrop-blur-sm open:grid sm:p-8"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 32 }}
        className="flex h-[640px] max-h-full w-[920px] max-w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      >
        <header className="flex h-20 shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-5 sm:px-8">
          <div>
            <h2 id="message-title" className="text-base font-semibold tracking-tight">Messages</h2>
            <p className="mt-1 text-xs text-gray-500">Ronan's assistant <span aria-hidden="true">·</span> Preview</p>
          </div>
          <div className="flex items-center gap-1">
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" title="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-full text-gray-500 hover:bg-gray-50 hover:text-brand md:hidden"><LinkedinIcon aria-hidden="true" className="h-4 w-4" /></a>
            <button type="button" onClick={onClose} aria-label="Close messages" className="flex h-11 w-11 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"><XIcon aria-hidden="true" className="h-5 w-5" /></button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-slate-50/70">
            <div ref={conversation} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-7 sm:px-8">
              <p className="mb-8 text-center text-[11px] font-medium text-gray-400">Today</p>
              <div role="log" aria-label="Demo messages" className="space-y-7 text-sm leading-relaxed">
                <div className="flex items-start gap-3">
                  <img src={profile.avatar} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 max-w-[85%] sm:max-w-[80%]">
                    <p className="mb-2 text-xs font-medium text-gray-600">Ronan's assistant</p>
                    <p className="rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 text-gray-700">Hi, welcome to my portfolio! What would you like to talk about?</p>
                  </div>
                </div>
                {messages.map((message, index) => (
                  <div key={index} className="space-y-7">
                    <div className="flex items-start justify-end gap-3">
                      <div className="min-w-0 max-w-[80%]">
                        <p className="mb-2 text-right text-xs font-medium text-gray-600">You <span className="ml-2 text-[11px] font-normal text-gray-400">{message.time}</span></p>
                        <p className="whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-brand-light px-4 py-3 text-gray-900">{message.text}</p>
                      </div>
                      <VisitorAvatar />
                    </div>
                    <div className="flex items-start gap-3">
                      <img src={profile.avatar} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                      <div className="min-w-0 max-w-[85%] sm:max-w-[80%]">
                        <p className="mb-2 text-xs font-medium text-gray-600">Ronan's assistant <span className="ml-2 text-[11px] font-normal text-gray-400">{message.time}</span></p>
                        <p className="rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 text-gray-700">This is a demo reply. To continue the conversation, <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-brand underline underline-offset-2" aria-label="Message Ronan on LinkedIn (opens in a new tab)">message Ronan on LinkedIn.</a></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {messages.length === 0 && <div className="ml-11 mt-4 flex flex-wrap gap-2">{[{ label: 'Say hello', text: 'Hi Ronan! Just stopping by to say hello.' }, { label: 'Talk about a project', text: "Hi Ronan! I'd like to talk about a project." }].map((prompt) => <button key={prompt.label} type="button" onClick={() => { setDraft(prompt.text); input.current?.focus({ preventScroll: true }); }} className="min-h-9 rounded-full border border-gray-200 bg-white px-3 text-xs text-gray-500 transition-colors hover:border-brand hover:text-brand">{prompt.label}</button>)}</div>}
            </div>

            <form onSubmit={(event) => { event.preventDefault(); send(); }} className="shrink-0 px-4 pb-4 pt-3 sm:px-8 sm:pb-5">
              <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-colors focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/5">
                <textarea ref={input} aria-label="Message" placeholder="Write a message..." value={draft} onChange={(event) => setDraft(event.target.value)} rows={1} className="max-h-28 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-base leading-relaxed outline-none sm:text-sm" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }} />
                <button type="submit" disabled={!draft.trim()} aria-label="Send demo message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-colors hover:bg-brand-hover disabled:bg-gray-100 disabled:text-gray-400"><SendIcon aria-hidden="true" className="h-4 w-4" /></button>
              </div>
              <p id="message-disclaimer" className="mt-3 text-center text-[11px] text-gray-400">Demo chat · Messages aren't sent or saved</p>
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
