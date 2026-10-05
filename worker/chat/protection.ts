import type { Env } from '../env';
import { ChatError } from './request';
import { getProvider } from './providers';

const dummy = /^[123]x0+/;
export function checkConfiguration(request: Request, env: Env) {
  const url = new URL(request.url);
  const local = env.APP_ENV === 'local' && ['localhost', '127.0.0.1'].includes(url.hostname);
  getProvider(env);
  if (!env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY || !env.RATE_LIMIT_SALT || !env.CHAT_RATE_LIMITER || (!local && (dummy.test(env.TURNSTILE_SITE_KEY) || dummy.test(env.TURNSTILE_SECRET_KEY)))) throw new ChatError(503, 'configuration', 'The assistant is not configured yet. You can still reach Ronan on LinkedIn.');
  const origin = request.headers.get('Origin');
  if (!origin || origin !== url.origin || !env.ALLOWED_ORIGINS?.split(',').map((value) => value.trim()).includes(origin)) throw new ChatError(403, 'origin', 'Please open the chat from the portfolio.');
  return local;
}
export async function protect(request: Request, env: Env, token: string, fetcher: typeof fetch, signal = request.signal) {
  const local = checkConfiguration(request, env);
  const address = local ? 'local-loopback' : request.headers.get('CF-Connecting-IP');
  if (!address) throw new ChatError(403, 'network', 'Unable to verify this connection.');
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${env.RATE_LIMIT_SALT}:${address}`));
  const key = Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
  if (!(await env.CHAT_RATE_LIMITER.limit({ key })).success) throw new ChatError(429, 'rate_limit', 'A few too many messages. Please wait a minute and try again.');
  const response = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
    signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]),
  });
  const result = await response.json() as { success?: boolean; hostname?: string; action?: string };
  const testMode = local && dummy.test(env.TURNSTILE_SECRET_KEY);
  if (!response.ok || !result.success || (!testMode && (result.hostname !== new URL(request.url).hostname || result.action !== 'chat'))) throw new ChatError(403, 'verification', 'Please refresh the verification and try again.');
}
