import type { ChatEvent } from './protocol';

export async function readChatStream(response: Response, onEvent: (event: ChatEvent) => void, signal: AbortSignal) {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(typeof error?.message === 'string' ? error.message : 'The assistant is unavailable. Please try again.');
  }
  const reader = response.body?.getReader(); if (!reader) throw new Error('No response received.');
  const decoder = new TextDecoder(); let buffer = ''; let complete = false; let chars = 0;
  const abort = () => { void reader.cancel(); };
  signal.addEventListener('abort', abort, { once: true });
  try {
    while (!complete) {
      signal.throwIfAborted();
      const { done, value } = await reader.read(); signal.throwIfAborted();
      buffer += decoder.decode(value, { stream: !done });
      let end: number;
      while ((end = buffer.indexOf('\n')) >= 0) {
        if (end > 65536) throw new Error('Response too large.');
        const line = buffer.slice(0, end); buffer = buffer.slice(end + 1);
        if (!line.trim()) continue;
        const event = JSON.parse(line);
        if (event.type === 'error' && typeof event.message === 'string') throw new Error(event.message);
        if (event.type === 'done') { complete = true; onEvent({ type: 'done' }); break; }
        if (event.type !== 'delta' || typeof event.text !== 'string') throw new Error('Invalid assistant response.');
        chars += event.text.length; if (chars > 32768) throw new Error('Response too large.');
        onEvent(event);
      }
      if (buffer.length > 65536) throw new Error('Response too large.');
      if (done) break;
    }
    if (!complete) throw new Error('The reply was interrupted. Please try again.');
  } finally { signal.removeEventListener('abort', abort); await reader.cancel().catch(() => undefined); reader.releaseLock(); }
}
