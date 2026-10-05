import type { ChatRequest } from '../../src/chat/protocol';

export class ChatError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export function jsonError(error: ChatError) {
  return Response.json({ code: error.code, message: error.message }, { status: error.status, headers: { 'Cache-Control': 'no-store' } });
}
export async function readChatRequest(request: Request): Promise<ChatRequest> {
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') throw new ChatError(415, 'media', 'Please send a JSON message.');
  const reader = request.body?.getReader();
  if (!reader) throw new ChatError(400, 'body', 'A message is required.');
  let bytes = 0; let raw = ''; const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: false });
  try {
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      bytes += value.byteLength;
      if (bytes > 32768) throw new ChatError(413, 'size', 'This conversation is too large. Start a new chat.');
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
    const data = JSON.parse(raw);
    if (!data || typeof data.message !== 'string' || !data.message.trim() || data.message.length > 2000 || typeof data.turnstileToken !== 'string' || !data.turnstileToken || data.turnstileToken.length > 2048 || !Array.isArray(data.history) || data.history.length > 12 || data.history.length % 2) throw new Error('invalid');
    let chars = 0;
    for (const [i, entry] of data.history.entries()) {
      if (!entry || entry.role !== (i % 2 ? 'assistant' : 'user') || typeof entry.text !== 'string' || !entry.text.trim() || (entry.role === 'user' && entry.text.length > 2000)) throw new Error('invalid');
      chars += entry.text.length;
    }
    if (chars > 16000) throw new Error('invalid');
    return { message: data.message.trim(), turnstileToken: data.turnstileToken, history: data.history.map(({ role, text }: ChatRequest['history'][number]) => ({ role, text })) };
  } catch (error) {
    if (error instanceof ChatError) throw error;
    throw new ChatError(400, 'invalid', 'Please send a message under 2,000 characters with a valid conversation.');
  } finally { await reader.cancel().catch(() => undefined); reader.releaseLock(); }
}
