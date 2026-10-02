import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRightIcon, GithubIcon, LinkedinIcon, MessageCircleIcon, SendIcon, SparklesIcon, XIcon } from 'lucide-react';
import { profile } from '../../data/profile';
import { VisitorAvatar } from '../shared/VisitorAvatar';

export function MessagePanel({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<{ text: string; time: string }[]>([]);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ block: 'nearest' });
  }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    setMessages((previous) => [...previous, { text: draft.trim(), time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }]);
    setDraft('');
    input.current?.focus();
  };

  return (
    <motion.dialog
      ref={dialog}
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 32 }}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      aria-labelledby="message-title"
      aria-describedby="message-disclaimer"
      className="fixed inset-0 m-auto h-[660px] max-h-[calc(100dvh-2rem)] w-[860px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-gray-900/25 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full min-h-0">
        <aside aria-label="About Ronan" className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-gray-50/70 p-6 md:flex">
          <span className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500"><MessageCircleIcon aria-hidden="true" className="h-4 w-4" />Messages</span>
          <img src={profile.avatar} alt="" width={64} height={64} className="mb-4 h-16 w-16 rounded-2xl border border-gray-200 object-cover" />
          <h3 className="text-base font-semibold tracking-tight">{profile.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">Projects, stories, and things I learn along the way.</p>
          <div className="mt-6 space-y-2">
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition-colors hover:border-brand hover:text-brand" aria-label="Connect on LinkedIn (opens in a new tab)"><LinkedinIcon aria-hidden="true" className="h-4 w-4" />Connect on LinkedIn<ArrowUpRightIcon aria-hidden="true" className="ml-auto h-3.5 w-3.5" /></a>
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-900" aria-label="View GitHub (opens in a new tab)"><GithubIcon aria-hidden="true" className="h-4 w-4" />View GitHub<ArrowUpRightIcon aria-hidden="true" className="ml-auto h-3.5 w-3.5" /></a>
          </div>
          <div className="mt-auto rounded-xl border border-gray-200 bg-white p-3">
            <p className="flex items-center gap-2 text-xs font-medium text-gray-700"><SparklesIcon aria-hidden="true" className="h-3.5 w-3.5 text-brand" />A little portfolio interaction</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">Try the chat here. For a real conversation, find me on LinkedIn.</p>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <img src={profile.avatar} alt="" width={40} height={40} className="h-10 w-10 rounded-full border border-gray-200 object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white bg-brand-light p-0.5 text-brand"><SparklesIcon aria-hidden="true" className="h-2.5 w-2.5" /></span>
              </div>
              <div className="min-w-0">
                <h2 id="message-title" className="text-sm font-semibold tracking-tight">Ronan's assistant</h2>
                <p className="mt-0.5 text-xs text-gray-500">Portfolio chat <span aria-hidden="true">·</span> Demo</p>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close messages" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"><XIcon aria-hidden="true" className="h-5 w-5" /></button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6">
            <div className="mb-6 flex items-center gap-3" aria-hidden="true"><div className="h-px flex-1 bg-gray-100" /><span className="text-[11px] font-medium text-gray-400">Today</span><div className="h-px flex-1 bg-gray-100" /></div>
            <div role="log" aria-label="Demo messages" className="space-y-5 text-sm leading-relaxed">
              <div className="flex items-start gap-2.5">
                <img src={profile.avatar} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 max-w-[85%]">
                  <p className="mb-1.5 text-[11px] font-medium text-gray-500">Ronan's assistant</p>
                  <p className="rounded-2xl rounded-tl-md bg-gray-100/80 px-4 py-3">Hey, thanks for stopping by! This chat is a little preview of the portfolio. Try sending a message, or reach me on LinkedIn for a real conversation.</p>
                </div>
              </div>
              {messages.map((message, index) => (
                <div key={index} className="space-y-5">
                  <div className="flex items-start justify-end gap-2.5">
                    <div className="min-w-0 max-w-[80%]">
                      <p className="mb-1.5 text-right text-[11px] font-medium text-gray-500">You <span className="ml-1 font-normal text-gray-400">{message.time}</span></p>
                      <p className="whitespace-pre-wrap break-words rounded-2xl rounded-tr-md bg-brand px-4 py-3 text-white">{message.text}</p>
                    </div>
                    <VisitorAvatar />
                  </div>
                  <div className="flex items-start gap-2.5">
                    <img src={profile.avatar} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0 max-w-[85%]">
                      <p className="mb-1.5 text-[11px] font-medium text-gray-500">Ronan's assistant <span className="ml-1 font-normal text-gray-400">{message.time}</span></p>
                      <p className="rounded-2xl rounded-tl-md bg-gray-100/80 px-4 py-3">This message stays in the preview. Want to talk about a project or just say hello? <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-brand underline underline-offset-2" aria-label="Message Ronan on LinkedIn (opens in a new tab)">Message Ronan on LinkedIn.</a></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEnd} />
          </div>

          <form onSubmit={(event) => { event.preventDefault(); send(); }} className="shrink-0 border-t border-gray-100 bg-white px-4 pb-3 pt-3 sm:px-6 sm:pb-4">
            {messages.length === 0 && <div className="mb-3 flex flex-wrap gap-2">{[{ label: 'Say hello', text: 'Hi Ronan! Just stopping by to say hello.' }, { label: 'Talk about a project', text: "Hi Ronan! I'd like to talk about a project." }].map((prompt) => <button key={prompt.label} type="button" onClick={() => { setDraft(prompt.text); input.current?.focus(); }} className="min-h-9 rounded-full border border-gray-200 px-3 text-xs font-medium text-gray-600 transition-colors hover:border-brand hover:bg-brand-light hover:text-brand">{prompt.label}</button>)}</div>}
            <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 transition-colors focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/10">
              <textarea ref={input} autoFocus aria-label="Message" placeholder="Write a message..." value={draft} onChange={(event) => setDraft(event.target.value)} rows={2} className="max-h-28 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-1.5 text-base leading-relaxed outline-none sm:text-sm" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }} />
              <button type="submit" disabled={!draft.trim()} aria-label="Send demo message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-colors hover:bg-brand-hover disabled:bg-gray-200 disabled:text-gray-400"><SendIcon aria-hidden="true" className="h-4 w-4" /></button>
            </div>
            <p id="message-disclaimer" className="mt-2.5 text-center text-[11px] text-gray-500">Preview only. Messages aren't sent and clear when you close.</p>
          </form>
        </div>
      </div>
    </motion.dialog>
  );
}
