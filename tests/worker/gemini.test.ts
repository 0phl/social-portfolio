import { describe, it, expect, vi } from 'vitest';
import { streamAssistant } from '../../worker/chat/stream';
import { readChatStream } from '../../src/chat/stream';
import type { Env } from '../../worker/env';
import type { ChatEvent } from '../../src/chat/protocol';
const env = { GEMINI_API_KEY: 'NEVER-EXPOSE', AI_PROVIDER: 'gemini', AI_MODEL: 'gemini-3.8-flash' } as Env;
const input = { message: 'Hi', history: [], turnstileToken: 'secret-token' };
const frame = (parts: unknown[], finishReason?: string) => `data: ${JSON.stringify({ candidates: [{ content: { parts }, finishReason }] })}\n\n`;
function upstream(text: string) { const bytes = new TextEncoder().encode(text); return new Response(new ReadableStream({ start(c) { for (const byte of bytes) c.enqueue(new Uint8Array([byte])); c.close(); } })); }
async function collect(response: Response) { const events: ChatEvent[] = []; await readChatStream(response, (e) => events.push(e), new AbortController().signal); return events; }
describe('Gemini streaming', () => {
  it('continues past several thought-only and metadata-only frames', async () => {
    const raw = frame([{ thought: true, text: 'private' }]).repeat(3) + 'data: {"usageMetadata":{"totalTokenCount":10}}\n\n' + frame([{ text: 'Public answer' }], 'STOP');
    const response = await streamAssistant(input, env, new AbortController().signal, vi.fn().mockResolvedValue(upstream(raw)));
    expect(await collect(response)).toEqual([{ type: 'delta', text: 'Public answer' }, { type: 'done' }]);
  }, 1000);
  it('handles split Unicode and hides thinking, keys and verification tokens', async () => {
    const fetcher = vi.fn().mockResolvedValue(upstream(frame([{ text: 'private thoughts', thought: true }, { text: 'Hi 👋' }]) + frame([{ text: ' kumusta!' }], 'STOP')));
    const response = await streamAssistant(input, env, new AbortController().signal, fetcher);
    expect(await collect(response)).toEqual([{ type: 'delta', text: 'Hi 👋' }, { type: 'delta', text: ' kumusta!' }, { type: 'done' }]);
    const options = fetcher.mock.calls[0][1];
    expect(options.headers['x-goog-api-key']).toBe('NEVER-EXPOSE');
    expect(options.body).not.toContain('secret-token');
    expect(JSON.parse(options.body).generationConfig).toEqual({ maxOutputTokens: 4096, thinkingConfig: { thinkingLevel: 'low' } });
  });
  it.each([frame([{ text: 'partial' }]), frame([{ text: 'partial' }], 'MAX_TOKENS'), frame([], 'STOP'), 'data: {bad}\n\n', 'data: {"promptFeedback":{"blockReason":"SAFETY"}}\n\n'])('does not mark an incomplete answer complete', async (body) => {
    const response = await streamAssistant(input, env, new AbortController().signal, vi.fn().mockResolvedValue(upstream(body)));
    const raw = await response.text();
    expect(raw).toContain('"type":"error"'); expect(raw).not.toContain('"type":"done"'); expect(raw).not.toContain('NEVER-EXPOSE');
  });
  it.each([429, 500])('maps upstream %i without exposing raw errors', async (status) => {
    await expect(streamAssistant(input, env, new AbortController().signal, vi.fn().mockResolvedValue(new Response('NEVER-EXPOSE', { status })))).rejects.toThrow(status === 429 ? 'busy' : 'unavailable');
  });
  it('aborts the upstream when the reader cancels', async () => {
    let signal: AbortSignal | undefined;
    const fetcher = vi.fn(async (_url, options) => { signal = options.signal; return new Response(new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(frame([{ text: 'hi' }]))); } })); });
    const response = await streamAssistant(input, env, new AbortController().signal, fetcher);
    await response.body?.cancel(); expect(signal?.aborted).toBe(true);
  });
  it('times out even after the response headers arrive', async () => {
    vi.useFakeTimers();
    try {
      const response = await streamAssistant(input, env, new AbortController().signal, vi.fn().mockResolvedValue(new Response(new ReadableStream())));
      const result = response.text(); await vi.advanceTimersByTimeAsync(45001);
      expect(await result).toContain('"type":"error"');
    } finally { vi.useRealTimers(); }
  });
});
