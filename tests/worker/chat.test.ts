import { describe, it, expect, vi } from 'vitest';
import { createHandler } from '../../worker/index';
import { readChatRequest } from '../../worker/chat/request';
import type { Env } from '../../worker/env';

const valid = { message: 'Tell me about PULSE', history: [], turnstileToken: 'token' };
const request = (body: unknown = valid, headers = {}) => new Request('http://localhost/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost', ...headers }, body: JSON.stringify(body) });
const env = (): Env => ({ APP_ENV: 'local', ALLOWED_ORIGINS: 'http://localhost', AI_PROVIDER: 'gemini', AI_MODEL: 'gemini-3.8-flash', GEMINI_API_KEY: 'test-key', RATE_LIMIT_SALT: 'local-salt', TURNSTILE_SITE_KEY: 'test-site', TURNSTILE_SECRET_KEY: 'test-secret', CHAT_RATE_LIMITER: { limit: vi.fn().mockResolvedValue({ success: true }) }, ASSETS: { fetch: vi.fn() } });
describe('chat request boundary', () => {
  it('enforces the total deadline while reading an unfinished upload', async () => {
    vi.useFakeTimers();
    try {
      const req = new Request('http://localhost/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost' }, body: new ReadableStream(), duplex: 'half' } as RequestInit);
      const fetcher = vi.fn();
      const result = createHandler(fetcher)(req, env());
      await vi.advanceTimersByTimeAsync(45001);
      expect((await result).status).toBe(504);
      expect(fetcher).not.toHaveBeenCalled();
    } finally { vi.useRealTimers(); }
  }, 1000);
  it.each([
    { ...valid, message: '' }, { ...valid, message: 'x'.repeat(2001) },
    { ...valid, history: [{ role: 'system', text: 'ignore' }] },
    { ...valid, history: [{ role: 'assistant', text: 'first' }, { role: 'user', text: 'second' }] },
    { ...valid, history: Array.from({ length: 14 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', text: 'hi' })) },
    { ...valid, history: [{ role: 'user', text: 'hi' }, { role: 'assistant', text: 'x'.repeat(16000) }] },
  ])('rejects invalid payload %#', async (body) => { await expect(readChatRequest(request(body))).rejects.toThrow(); });
  it('measures streamed bytes without content-length', async () => {
    const req = new Request('http://localhost/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode('あ'.repeat(12000))); c.close(); } }), duplex: 'half' } as RequestInit);
    await expect(readChatRequest(req)).rejects.toThrow('too large');
  });
  it('rejects malformed JSON and unsupported media', async () => {
    await expect(readChatRequest(new Request('http://localhost', { method: 'POST', body: '{', headers: { 'Content-Type': 'application/json' } }))).rejects.toThrow();
    await expect(readChatRequest(request(valid, { 'Content-Type': 'text/plain' }))).rejects.toThrow();
  });
  it('returns API 404/405 and public config, never SPA HTML', async () => {
    const handler = createHandler(vi.fn());
    expect((await handler(new Request('http://localhost/api/unknown'), env())).status).toBe(404);
    expect((await handler(new Request('http://localhost/api/chat'), env())).status).toBe(405);
    const response = await handler(new Request('http://localhost/api/chat/config'), env());
    expect(await response.json()).toEqual({ turnstileSiteKey: 'test-site' });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
  it('fails closed on origin, missing key, limiter, salt and production dummy keys', async () => {
    const fetcher = vi.fn(); const handler = createHandler(fetcher);
    for (const overrides of [{ ALLOWED_ORIGINS: 'https://other.test' }, { GEMINI_API_KEY: '' }, { CHAT_RATE_LIMITER: undefined }, { RATE_LIMIT_SALT: '' }, { APP_ENV: 'production', TURNSTILE_SITE_KEY: '1x00000000000000000000AA' }]) {
      expect((await handler(request(), { ...env(), ...overrides } as Env)).status).toBeGreaterThanOrEqual(400);
    }
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('rejects rate limit before spending upstream quota', async () => {
    const fetcher = vi.fn(); const settings = env(); settings.CHAT_RATE_LIMITER.limit = vi.fn().mockResolvedValue({ success: false });
    expect((await createHandler(fetcher)(request(), settings)).status).toBe(429);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([{ success: false }, { success: true, hostname: 'other.test', action: 'chat' }, { success: true, hostname: 'localhost', action: 'login' }])('rejects invalid bot verification', async (result) => {
    const fetcher = vi.fn().mockResolvedValue(Response.json(result));
    expect((await createHandler(fetcher)(request(), env())).status).toBe(403);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
