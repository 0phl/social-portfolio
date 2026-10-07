import { describe, expect, it } from 'vitest';
import { createHandler } from '../../worker/index';
import type { Env } from '../../worker/env';

const env = { ASSETS: { fetch: async (req: Request) => {
  const path = new URL(req.url).pathname;
  return new Response(path === '/projects/lms-billing/index.html' ? '<h1>LMS Billing</h1>' : path === '/404.html' ? '<h1>Page not found</h1>' : 'missing', { status: ['/projects/lms-billing/index.html', '/404.html'].includes(path) ? 200 : 404, headers: { 'Content-Type': 'text/html' } });
} } } as Env;
const handler = createHandler(fetch);
describe('public page delivery', () => {
  it('serves the requested prerendered content, not the homepage shell', async () => {
    const response = await handler(new Request('https://ronandelacruz.com/projects/lms-billing'), env);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('<h1>LMS Billing</h1>');
  });
  it.each([
    ['https://www.ronandelacruz.com/projects/lms-billing?ref=share', 'https://ronandelacruz.com/projects/lms-billing?ref=share'],
    ['https://ronandelacruz.com/projects/lms-billing/', 'https://ronandelacruz.com/projects/lms-billing'],
    ['https://ronandelacruz.com/projects/lms-billing/index.html', 'https://ronandelacruz.com/projects/lms-billing'],
    ['https://ronandelacruz.com/posts', 'https://ronandelacruz.com/'],
    ['https://ronandelacruz.com/about/skills', 'https://ronandelacruz.com/about#skills'],
  ])('redirects aliases once: %s', async (from, to) => {
    const response = await handler(new Request(from), env);
    expect(response.status).toBe(308);
    expect(response.headers.get('Location')).toBe(to);
  });
  it('returns a real 404 for unknown pages', async () => {
    const response = await handler(new Request('https://ronandelacruz.com/projects/missing'), env);
    expect(response.status).toBe(404);
    expect(await response.text()).toContain('Page not found');
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
  });
  it('does not redirect localhost or turn unknown API requests into HTML', async () => {
    const page = await handler(new Request('http://127.0.0.1:8787/projects/lms-billing'), env);
    expect(page.status).toBe(200);
    const api = await handler(new Request('https://ronandelacruz.com/api/missing'), env);
    expect(api.status).toBe(404);
    expect(api.headers.get('Content-Type')).toContain('application/json');
  });
});
