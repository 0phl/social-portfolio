import type { ChatRequest, ChatEvent } from '../../src/chat/protocol';
import type { Env } from '../env';
import { ChatError } from './request';
import { getProvider } from './providers';
import { sseFrames } from './sse';

export async function streamAssistant(input: ChatRequest, env: Env, parentSignal: AbortSignal, fetcher: typeof fetch = fetch, onFinish: () => void = () => undefined): Promise<Response> {
  const provider = getProvider(env);
  const request = provider.request(input);
  const abort = new AbortController();
  const onAbort = () => abort.abort();
  parentSignal.addEventListener('abort', onAbort, { once: true });
  if (parentSignal.aborted) abort.abort();
  const timer = setTimeout(() => abort.abort(), 45000);
  const cleanup = () => { clearTimeout(timer); parentSignal.removeEventListener('abort', onAbort); onFinish(); };
  let upstream: Response;
  try {
    upstream = await fetcher(request.url, {
      method: 'POST', signal: abort.signal, redirect: 'manual',
      headers: request.headers,
      body: JSON.stringify(request.body),
    });
    if (!upstream.ok || !upstream.body) {
      await upstream.body?.cancel();
      throw new ChatError(upstream.status === 429 ? 429 : 503, 'provider', upstream.status === 429 ? 'The assistant is busy. Please try again in a little while.' : 'The assistant is unavailable right now. Please try again later.');
    }
  } catch (error) { cleanup(); abort.abort(); throw error instanceof ChatError ? error : new ChatError(503, 'connection', 'Could not connect to the assistant. Please try again.'); }
  const body = upstream.body;
  if (!body) { cleanup(); throw new ChatError(503, 'empty', 'No response received.'); }
  const frames = sseFrames(body, abort.signal);
  const encoder = new TextEncoder(); let textLength = 0; let finished = false;
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const emit = (event: ChatEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      try {
        let emitted = false;
        while (!emitted && !finished) {
          const { value, done } = await frames.next();
          if (done) throw new Error('incomplete');
          const result = provider.decode(value);
          if (result.text) {
            textLength += result.text.length;
            if (textLength > 32768) throw new Error('too long');
            emit({ type: 'delta', text: result.text });
            emitted = true;
          }
          if (result.finished) {
            if (!textLength) throw new Error('incomplete');
            emit({ type: 'done' }); finished = true; controller.close(); cleanup(); await frames.return();
          }
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
