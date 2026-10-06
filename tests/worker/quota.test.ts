import { DatabaseSync } from 'node:sqlite';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChatQuota } from '../../worker/chat/quota';

// Real SQLite with the small storage API used by the Durable Object.
const databases: DatabaseSync[] = [];
function storage() {
  const database = new DatabaseSync(':memory:');
  databases.push(database);
  return {
    sql: {
      exec(query: string, ...bindings: (string | number)[]) {
        const rows = database.prepare(query).all(...bindings);
        return { toArray: () => rows, one: () => {
          if (rows.length !== 1) throw new Error('Expected one row');
          return rows[0];
        } };
      },
    },
    transactionSync<T>(callback: () => T): T {
      database.exec('BEGIN IMMEDIATE');
      try { const result = callback(); database.exec('COMMIT'); return result; }
      catch (error) { database.exec('ROLLBACK'); throw error; }
    },
    setAlarm: async () => undefined,
  };
}
const key = (id: number) => id.toString(16).padStart(64, '0');
const request = (id = 1) => new Request('https://quota.internal/reserve', {
  method: 'POST', body: JSON.stringify({ networkKey: key(id) }),
});
function create(perNetwork = '2', site = '3', saved = storage()) {
  return { saved, quota: new ChatQuota({ storage: saved } as unknown as DurableObjectState, {
    CHAT_DAILY_NETWORK_LIMIT: perNetwork, CHAT_DAILY_SITE_LIMIT: site,
  }) };
}
afterEach(() => { vi.restoreAllMocks(); for (const db of databases.splice(0)) db.close(); });

describe('persistent daily chat allowance', () => {
  it('rejects the next request at the network limit without consuming the site allowance', async () => {
    const { quota } = create();
    expect((await quota.fetch(request())).status).toBe(200);
    expect((await quota.fetch(request())).status).toBe(200);
    const denied = await quota.fetch(request());
    expect(denied.status).toBe(429);
    expect((await denied.json()).code).toBe('daily_network_limit');
    expect((await quota.fetch(request(2))).status).toBe(200);
  });

  it('shares the site allowance across different networks and simultaneous requests', async () => {
    const { quota } = create('10', '3');
    const replies = await Promise.all(Array.from({ length: 12 }, (_, i) => quota.fetch(request(i))));
    expect(replies.filter(reply => reply.status === 200)).toHaveLength(3);
    for (const reply of replies.filter(reply => reply.status === 429)) {
      expect((await reply.json()).code).toBe('daily_site_limit');
    }
  });

  it('keeps counters when the object is reconstructed with the same storage', async () => {
    const first = create('1');
    await first.quota.fetch(request());
    const next = create('1', '3', first.saved);
    expect((await next.quota.fetch(request())).status).toBe(429);
  });

  it('resets at midnight in the Philippines and does not erase today when an old alarm runs', async () => {
    const clock = vi.spyOn(Date, 'now').mockReturnValue(Date.parse('2026-10-06T15:59:59Z'));
    const { quota, saved } = create('1');
    await quota.fetch(request());
    const denied = await quota.fetch(request());
    expect(denied.headers.get('Retry-After')).toBe('1');
    clock.mockReturnValue(Date.parse('2026-10-06T16:00:00Z'));
    expect((await quota.fetch(request())).status).toBe(200);
    await quota.alarm();
    expect((await quota.fetch(request())).status).toBe(429);
    const rows = saved.sql.exec('SELECT DISTINCT day FROM chat_usage').toArray();
    expect(rows).toHaveLength(1);
  });

  it('rolls back both counters if a storage write fails', async () => {
    const { quota, saved } = create('1', '1');
    const original = saved.sql.exec.bind(saved.sql);
    const fail = vi.spyOn(saved.sql, 'exec').mockImplementation((query, ...values) => {
      if (query.startsWith('INSERT') && values.includes(key(1))) throw new Error('Storage failure');
      return original(query, ...values);
    });
    await expect(quota.fetch(request())).rejects.toThrow('Storage failure');
    fail.mockRestore();
    expect((await quota.fetch(request())).status).toBe(200);
  });

  it.each(['0', '-1', '1.5', 'oops', 'Infinity', ''])('fails closed with invalid configured limits: %s', async (limit) => {
    const { quota } = create(limit);
    expect((await quota.fetch(request())).status).toBe(503);
  });

  it('rejects malformed internal requests without using the allowance', async () => {
    const { quota } = create('1');
    expect((await quota.fetch(new Request('https://quota.internal/reserve'))).status).toBe(405);
    expect((await quota.fetch(new Request('https://quota.internal/reserve', { method: 'POST', body: '{' }))).status).toBe(400);
    expect((await quota.fetch(new Request('https://quota.internal/reserve', { method: 'POST', body: JSON.stringify({ networkKey: 'client-supplied-ip' }) }))).status).toBe(400);
    expect((await quota.fetch(request())).status).toBe(200);
  });
});
