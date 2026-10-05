import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChatContext } from './useChat';
import { buildRequest, type Message } from './history';
import { readChatStream } from './stream';

function waitForReply(delay: number, signal: AbortSignal) {
  signal.throwIfAborted();
  if (delay <= 0) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = window.setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, delay);
    signal.addEventListener('abort', abort, { once: true });
  });
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const current = useRef<Message[]>([]);
  const active = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const update = useCallback((change: (old: Message[]) => Message[]) => { current.current = change(current.current); setMessages(current.current); }, []);
  const stop = useCallback(() => {
    generation.current++; active.current?.abort(); active.current = null; setPending(false);
    update((old) => old.map((m) => ['pending', 'streaming'].includes(m.status) ? { ...m, status: 'incomplete', error: 'Reply stopped. Retry whenever you are ready.' } : m));
  }, [update]);
  useEffect(() => () => { generation.current++; active.current?.abort(); }, []);
  const run = async (text: string, token: string, retry = false) => {
    if (active.current || !text.trim() || text.length > 2000 || !token) return;
    const controller = new AbortController(); active.current = controller;
    const id = ++generation.current;
    const before = retry ? current.current.slice(0, -2) : current.current;
    const body = buildRequest(before, text.trim(), token);
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const answerId = crypto.randomUUID();
    const user: Message = retry ? current.current[current.current.length - 2] : { id: crypto.randomUUID(), role: 'user', text: text.trim(), time, status: 'complete' };
    update(() => [...before, user, { id: answerId, role: 'assistant', text: '', time, status: 'pending' }]);
    setPending(true);
    const revealAt = Date.now() + 3000 + Math.random() * 2000;
    const timer = window.setTimeout(() => controller.abort(), 65000);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal });
      if (generation.current !== id) { await response.body?.cancel(); return; }
      let answer = '';
      await readChatStream(response, (event) => { if (event.type === 'delta') answer += event.text; }, controller.signal);
      if (!answer.trim()) throw new Error('No reply received. Please try again.');
      await waitForReply(revealAt - Date.now(), controller.signal);
      if (generation.current !== id) return;
      const receivedAt = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      update((old) => old.map((m) => m.id === answerId ? { ...m, text: answer, time: receivedAt, status: 'complete' } : m));
    } catch (error) {
      if (generation.current === id) update((old) => old.map((m) => m.id !== answerId ? m : { ...m, status: m.text ? 'incomplete' : 'error', error: controller.signal.aborted ? 'The reply took too long. Please try again.' : error instanceof Error ? error.message : 'Something went wrong. Please try again.' }));
    } finally { clearTimeout(timer); if (generation.current === id) { active.current = null; setPending(false); } }
  };
  return <ChatContext.Provider value={{ messages, pending, send: (text, token) => run(text, token), retry: (token) => {
    const last = current.current[current.current.length - 1]; const user = current.current[current.current.length - 2];
    return last && ['error', 'incomplete'].includes(last.status) && user?.role === 'user' ? run(user.text, token, true) : Promise.resolve();
  }, stop, reset: () => { stop(); update(() => []); } }}>{children}</ChatContext.Provider>;
}
