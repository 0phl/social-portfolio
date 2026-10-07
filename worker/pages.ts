import paths from '../.generated/site-routes.json';
import { normalizeLocation } from '../src/routing/paths';
import type { Env } from './env';

const routes = new Set(paths);
export async function servePage(request: Request, env: Env) {
  const url = new URL(request.url);
  const path = normalizeLocation(url.pathname.replace(/\/index\.html$/, '/') || '/');
  const [pathname, hash] = path.split('#');
  if (routes.has(pathname)) {
    if (path !== url.pathname) {
      url.pathname = pathname; url.hash = hash ?? '';
      return Response.redirect(url.href, 308);
    }
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    url.pathname = pathname === '/' ? '/index.html' : `${pathname}/index.html`;
    const response = await env.ASSETS.fetch(new Request(url, request));
    if (url.searchParams.has('photo-demo')) {
      const headers = new Headers(response.headers); headers.set('X-Robots-Tag', 'noindex');
      return new Response(response.body, { status: response.status, headers });
    }
    return response;
  }
  const asset = await env.ASSETS.fetch(request);
  if (asset.status !== 404 || /\.[^/]+$/.test(url.pathname)) return asset;
  url.pathname = '/404.html'; url.search = '';
  const fallback = await env.ASSETS.fetch(new Request(url, { method: 'GET' }));
  const headers = new Headers(fallback.headers);
  headers.set('X-Robots-Tag', 'noindex');
  headers.set('Cache-Control', 'no-cache');
  return new Response(request.method === 'HEAD' ? null : fallback.body, { status: 404, headers });
}
