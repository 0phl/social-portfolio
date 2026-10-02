import { useEffect, useRef, useState } from 'react';
import { BotIcon, SendIcon, XIcon } from 'lucide-react';
import { profile } from '../../data/profile';

export function MessagePanel({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

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
    setMessages((previous) => [...previous, draft.trim()]);
    setDraft('');
  };

  return (
    <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); onClose(); }} aria-labelledby="message-title" className="fixed bottom-4 left-auto right-4 top-auto m-0 h-[500px] max-h-[calc(100dvh-6rem)] w-[350px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-black/10 sm:bottom-6 sm:right-6">
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand-light p-2 text-brand"><BotIcon aria-hidden="true" className="h-5 w-5" /></span>
            <div>
              <h2 id="message-title" className="text-sm font-semibold">Ronan's Assistant</h2>
              <p className="text-xs text-gray-500">Demo conversation</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close messages" className="flex h-11 w-11 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"><XIcon aria-hidden="true" className="h-4 w-4" /></button>
        </header>
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4">
          <div className="mb-6 text-center">
            <img src={profile.avatar} alt="" className="mx-auto mb-3 h-16 w-16 rounded-full object-cover" />
            <h3 className="text-sm font-semibold">{profile.name}</h3>
            <p className="mt-1 text-xs text-gray-500">{profile.title}</p>
          </div>
          <div role="log" aria-label="Demo messages" className="space-y-4 text-sm leading-relaxed">
            <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-4 py-2">Hi! This is a preview of Ronan's assistant. Messages stay in this demo and aren't sent to Ronan.</p>
            {messages.map((message, index) => (
              <div key={index} className="space-y-4">
                <p className="ml-auto max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-brand px-4 py-2 text-white">{message}</p>
                <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-4 py-2">Messaging isn't connected yet. You can reach Ronan through the LinkedIn link on his profile.</p>
              </div>
            ))}
          </div>
          <div ref={messagesEnd} />
        </div>
        <form onSubmit={(event) => { event.preventDefault(); send(); }} className="border-t border-gray-100 p-3">
          <div className="flex items-end gap-2">
            <textarea autoFocus aria-label="Message" placeholder="Type a message..." value={draft} onChange={(event) => setDraft(event.target.value)} rows={1} className="min-h-11 min-w-0 flex-1 resize-none rounded-xl bg-gray-100 px-3 py-2.5 text-sm focus:outline-brand" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }} />
            <button type="submit" disabled={!draft.trim()} aria-label="Send demo message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white hover:bg-brand-hover disabled:opacity-50"><SendIcon aria-hidden="true" className="h-4 w-4" /></button>
          </div>
          <p className="mt-2 text-center text-[10px] text-gray-500">Preview only · no messages are delivered</p>
        </form>
      </div>
    </dialog>
  );
}
