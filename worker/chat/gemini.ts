import type { ChatRequest, ChatEvent } from '../../src/chat/protocol';
import type { Env } from '../env';
import { ChatError } from './request';
import { instructions } from './instructions';
import { sseFrames } from './sse';

export async function streamGemini(input: ChatRequest, env: Env, parentSignal: AbortSignal, fetcher: typeof fetch = fetch): Promise<Response> {
  const abort = new AbortController();
  const onAbort = () => abort.abort();
  parentSignal.addEventListener('abort', onAbort, { once: true });
  if (parentSignal.aborted) abort.abort();
  const timer = setTimeout(() => abort.abort(), 45000);
  const cleanup = () => { clearTimeout(timer); parentSignal.removeEventListener('abort', onAbort); };
  let upstream: Response;
  try {
    upstream = await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL)}:streamGenerateContent?alt=sse`, {
      method: 'POST', signal: abort.signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instructions }] },
        contents: [...input.history.map(({ role, text }) => ({ role: role === 'assistant' ? 'model' : 'user', parts: [{ text }] })), { role: 'user', parts: [{ text: input.message }] }],
        generationConfig: { maxOutputTokens: 4096, thinkingConfig: { thinkingLevel: 'low' } },
      }),
    });
    if (!upstream.ok || !upstream.body) {
      await upstream.body?.cancel();
      throw new ChatError(upstream.status === 429 ? 429 : 503, 'provider', upstream.status === 429 ? 'The assistant is busy. Please try again in a little while.' : 'The assistant is unavailable right now. Please try again later.');
    }
  } catch (error) { cleanup(); abort.abort(); throw error instanceof ChatError ? error : new ChatError(503, 'connection', 'Could not connect to the assistant. Please try again.'); }
  const frames = sseFrames(upstream.body!, abort.signal);
  const encoder = new TextEncoder(); let textLength = 0; let finished = false;
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const emit = (event: ChatEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      try {
        const { value, done } = await frames.next();
        if (done) throw new Error('incomplete');
        if (value.promptFeedback?.blockReason || value.error) throw new Error('blocked');
        const candidate = value.candidates?.[0];
        for (const part of candidate?.content?.parts ?? []) {
          if (!part.thought && typeof part.text === 'string' && part.text) {
            textLength += part.text.length;
            if (textLength > 32768) throw new Error('too long');
            emit({ type: 'delta', text: part.text });
          }
        }
        if (candidate?.finishReason) {
          if (candidate.finishReason !== 'STOP' || !textLength) throw new Error('incomplete');
          emit({ type: 'done' }); finished = true; controller.close(); cleanup(); await frames.return();
        }
      } catch {
        if (!finished) {
          finished = true;
          emit({ type: 'error', code: 'incomplete', message: 'The reply was interrupted. You can retry with a fresh verification.' });
          controller.close();
        }
        cleanup(); abort.abort(); await frames.return();
      }
    },
    async cancel() { finished = true; abort.abort(); cleanup(); await frames.return(); },
  });
  return new Response(stream, { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
