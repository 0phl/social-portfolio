import type { Env } from './env';
import { ChatError, jsonError, readChatRequest } from './chat/request';
import { checkConfiguration, protect } from './chat/protection';
import { streamAssistant } from './chat/stream';
import { servePage } from './pages';
export { ChatQuota } from './chat/quota';

export function createHandler(fetcher: typeof fetch) {
  return async (request: Request, env: Env): Promise<Response> => {
    const url = new URL(request.url);
    if (url.hostname === 'www.ronandelacruz.com') {
      url.hostname = 'ronandelacruz.com'; url.protocol = 'https:';
      return Response.redirect(url.href, 308);
    }
    const path = url.pathname;
    if (!path.startsWith('/api/')) return servePage(request, env);
    if (!['/api/chat', '/api/chat/config'].includes(path)) return jsonError(new ChatError(404, 'not_found', 'API endpoint not found.'));
    if (request.method !== (path.endsWith('/config') ? 'GET' : 'POST')) return jsonError(new ChatError(405, 'method', 'Method not allowed.'));
    if (path.endsWith('/config')) return Response.json({ turnstileSiteKey: env.TURNSTILE_SITE_KEY || null }, { headers: { 'Cache-Control': 'no-store' } });
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    request.signal.addEventListener('abort', onAbort, { once: true });
    if (request.signal.aborted) controller.abort();
    const deadline = setTimeout(() => controller.abort(), 45000);
    const cleanup = () => { clearTimeout(deadline); request.signal.removeEventListener('abort', onAbort); };
    try {
      checkConfiguration(request, env);
      const input = await readChatRequest(request, controller.signal);
      await protect(request, env, input.turnstileToken, fetcher, controller.signal);
      controller.signal.throwIfAborted();
      return await streamAssistant(input, env, controller.signal, fetcher, cleanup);
    } catch (error) {
      cleanup();
      if (controller.signal.aborted) return jsonError(new ChatError(504, 'timeout', 'The request took too long. Please try again.'));
      return jsonError(error instanceof ChatError ? error : new ChatError(503, 'unavailable', 'The assistant is temporarily unavailable. Please try again later.'));
    }
  };
}
export default { fetch: createHandler(fetch) };
