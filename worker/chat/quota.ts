import type { Env } from '../env';
import { ChatError } from './request';

type Limits = Pick<Env, 'CHAT_DAILY_NETWORK_LIMIT' | 'CHAT_DAILY_SITE_LIMIT'>;

const dayLength = 86_400_000;
const philippinesOffset = 8 * 60 * 60 * 1000;
const currentDay = () => Math.floor((Date.now() + philippinesOffset) / dayLength);
const positiveLimit = (value: string) => /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : null;

export class ChatQuota {
  constructor(private state: DurableObjectState, private env: Limits) {
    state.storage.sql.exec(`CREATE TABLE IF NOT EXISTS chat_usage (
      day INTEGER NOT NULL, key TEXT NOT NULL, requests INTEGER NOT NULL,
      PRIMARY KEY (day, key)
    )`);
  }

  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return new Response(null, { status: 405 });
    const body = await request.json().catch(() => null) as { networkKey?: unknown } | null;
    if (!body || typeof body.networkKey !== 'string' || !/^[a-f0-9]{64}$/.test(body.networkKey)) {
      return new Response(null, { status: 400 });
    }
    const networkKey = body.networkKey;
    const networkLimit = positiveLimit(this.env.CHAT_DAILY_NETWORK_LIMIT);
    const siteLimit = positiveLimit(this.env.CHAT_DAILY_SITE_LIMIT);
    if (!networkLimit || !siteLimit) return new Response(null, { status: 503 });

    const day = currentDay();
    const resetAt = (day + 1) * dayLength - philippinesOffset;
    const sql = this.state.storage.sql;
    const code = this.state.storage.transactionSync(() => {
      sql.exec('DELETE FROM chat_usage WHERE day < ?', day);
      const count = (key: string) => sql.exec<{ requests: number }>(
        'SELECT requests FROM chat_usage WHERE day = ? AND key = ?', day, key,
      ).toArray()[0]?.requests ?? 0;
      if (count('site') >= siteLimit) return 'daily_site_limit';
      if (count(networkKey) >= networkLimit) return 'daily_network_limit';
      // Reserve both allowances atomically before an AI call can begin.
      for (const key of ['site', networkKey]) {
        sql.exec('INSERT INTO chat_usage (day, key, requests) VALUES (?, ?, 1) ON CONFLICT(day, key) DO UPDATE SET requests = requests + 1', day, key);
      }
      return null;
    });
    await this.state.storage.setAlarm(resetAt);
    if (code) return Response.json({ code }, {
      status: 429, headers: { 'Retry-After': String(Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))) },
    });
    return Response.json({ allowed: true });
  }

  async alarm() {
    // A delayed alarm must never erase the current day's reservations.
    this.state.storage.sql.exec('DELETE FROM chat_usage WHERE day < ?', currentDay());
  }
}

export async function reserveDailyAllowance(env: Env, networkKey: string, signal: AbortSignal) {
  const unavailable = () => new ChatError(503, 'quota_unavailable', 'Chat usage limits are temporarily unavailable. Please try again later.');
  try {
    signal.throwIfAborted();
    const response = await env.CHAT_QUOTA.getByName('portfolio-daily-usage').fetch(new Request('https://quota.internal/reserve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ networkKey }), signal,
    }));
    const result = await response.json() as { allowed?: boolean; code?: string } | null;
    const code = result?.code;
    if (response.status === 429 && (code === 'daily_network_limit' || code === 'daily_site_limit')) {
      const retryAfter = Number(response.headers.get('Retry-After'));
      if (!Number.isInteger(retryAfter) || retryAfter < 1 || retryAfter > 86400) throw unavailable();
      const message = code === 'daily_network_limit'
        ? "Today's chat allowance for this network has been reached. It resets at midnight Philippine time. You can still explore the portfolio."
        : "Today's chat allowance has been reached. Chat returns at midnight Philippine time. You can still explore the portfolio.";
      throw new ChatError(429, code, message, retryAfter);
    }
    if (response.status !== 200 || result?.allowed !== true) throw unavailable();
  } catch (error) {
    if (error instanceof ChatError) throw error;
    throw unavailable();
  }
}
