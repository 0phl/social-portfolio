import type { Env } from './env';
import { ChatError, jsonError, readChatRequest } from './chat/request';
import { checkConfiguration, protect } from './chat/protection';
import { streamGemini } from './chat/gemini';

export function createHandler(fetcher: typeof fetch) {
  return async (request: Request, env: Env): Promise<Response> => {
    const path = new URL(request.url).pathname;
    if (!path.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (!['/api/chat', '/api/chat/config'].includes(path)) return jsonError(new ChatError(404, 'not_found', 'API endpoint not found.'));
    if (request.method !== (path.endsWith('/config') ? 'GET' : 'POST')) return jsonError(new ChatError(405, 'method', 'Method not allowed.'));
    if (path.endsWith('/config')) return Response.json({ turnstileSiteKey: env.TURNSTILE_SITE_KEY || null }, { headers: { 'Cache-Control': 'no-store' } });
    try {
      checkConfiguration(request, env);
      const input = await readChatRequest(request);
      await protect(request, env, input.turnstileToken, fetcher);
      return await streamGemini(input, env, request.signal, fetcher);
    } catch (error) {
      return jsonError(error instanceof ChatError ? error : new ChatError(503, 'unavailable', 'The assistant is temporarily unavailable. Please try again later.'));
    }
  };
}
export default { fetch: createHandler(fetch) };
