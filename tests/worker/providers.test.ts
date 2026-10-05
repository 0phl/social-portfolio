import { describe, it, expect, vi } from 'vitest';
import { streamAssistant } from '../../worker/chat/stream';
import { getProvider } from '../../worker/chat/providers';
import { readChatStream } from '../../src/chat/stream';
import type { ChatEvent } from '../../src/chat/protocol';
import type { Env } from '../../worker/env';

const env = { AI_PROVIDER: 'deepseek', AI_MODEL: 'deepseek-flash', DEEPSEEK_API_KEY: 'deepseek-secret', GEMINI_API_KEY: 'gemini-secret' } as Env;
const input = { message: 'Show me PULSE', history: [{ role: 'user' as const, text: 'Hi' }, { role: 'assistant' as const, text: 'Hello' }], turnstileToken: 'private-token' };
const frame = (delta: unknown, finish_reason: string | null = null) => `data: ${JSON.stringify({ choices: [{ index: 0, delta, finish_reason }] })}\r\n\r\n`;
function response(text: string) {
  const bytes = new TextEncoder().encode(text);
  return new Response(new ReadableStream({ start(c) { for (const b of bytes) c.enqueue(new Uint8Array([b])); c.close(); } }));
}
describe('configurable providers', () => {
  it('streams DeepSeek Unicode with neutral events and no reasoning or secrets', async () => {
    const raw = ': keep-alive\r\n\r\n' + frame({ role: 'assistant', content: '' }) + frame({ reasoning_content: 'private reasoning' }).repeat(3) + frame({ content: 'Kumusta 👋' }) + frame({}, 'stop') + 'data: [DONE]\n\n';
    const fetcher = vi.fn().mockResolvedValue(response(raw));
    const result = await streamAssistant(input, env, new AbortController().signal, fetcher);
    const events: ChatEvent[] = [];
    await readChatStream(result, (event) => events.push(event), new AbortController().signal);
    expect(events).toEqual([{ type: 'delta', text: 'Kumusta 👋' }, { type: 'done' }]);
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe('https://api.deepseek.com/chat/completions');
    expect(options.headers.Authorization).toBe('Bearer deepseek-secret');
    expect(options.redirect).toBe('manual');
    const body = JSON.parse(options.body);
    expect(body).toMatchObject({ model: 'deepseek-flash', stream: true, max_tokens: 4096, thinking: { type: 'disabled' } });
    expect(body.messages.map((m: {role: string}) => m.role)).toEqual(['system', 'user', 'assistant', 'user']);
    expect(options.body).not.toContain('private-token'); expect(options.body).not.toContain('gemini-secret');
  });
  it.each([frame({ content: 'Partial' }), frame({ content: 'Partial' }, 'length'), frame({}, 'stop'), 'data: [DONE]\n\n', frame({}, 'content_filter'), 'data: {"error":{"message":"private"}}\n\n'])('does not accept truncated, blocked or empty completion', async (raw) => {
    const result = await streamAssistant(input, env, new AbortController().signal, vi.fn().mockResolvedValue(response(raw)));
    const text = await result.text(); expect(text).toContain('"type":"error"'); expect(text).not.toContain('"type":"done"'); expect(text).not.toContain('private');
  });
  it('supports a configured compatible endpoint without vendor-specific fields', () => {
    const provider = getProvider({ ...env, AI_PROVIDER: 'openai-compatible', AI_BASE_URL: 'https://inference.example/v1/', AI_API_KEY: 'other-secret', AI_MODEL: 'another-model' });
    const request = provider.request(input);
    expect(request.url).toBe('https://inference.example/v1/chat/completions');
    expect(request.headers.Authorization).toBe('Bearer other-secret');
    expect(request.body).toMatchObject({ model: 'another-model', stream: true });
    expect(request.body).not.toHaveProperty('thinking');
  });
  it.each([
    { AI_PROVIDER: 'unknown' }, { AI_MODEL: '' }, { DEEPSEEK_API_KEY: '' },
    { AI_PROVIDER: 'openai-compatible', AI_BASE_URL: 'http://example.com', AI_API_KEY: 'key' },
    { AI_PROVIDER: 'openai-compatible', AI_BASE_URL: 'https://user:pass@example.com', AI_API_KEY: 'key' },
    { AI_PROVIDER: 'openai-compatible', AI_BASE_URL: 'https://example.com?key=value', AI_API_KEY: 'key' },
  ])('fails closed instead of falling back to another key/provider %#', (overrides) => {
    expect(() => getProvider({ ...env, ...overrides })).toThrow();
  });
  it('does not retry or fall back when the paid provider rejects a request', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('secret raw upstream details', { status: 402 }));
    await expect(streamAssistant(input, env, new AbortController().signal, fetcher)).rejects.toThrow('unavailable');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('rejects redirects without forwarding the key or following another URL', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 307, headers: { Location: 'https://other.example/chat' } }));
    await expect(streamAssistant(input, env, new AbortController().signal, fetcher)).rejects.toThrow('unavailable');
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0][1].redirect).toBe('manual');
  });
});
