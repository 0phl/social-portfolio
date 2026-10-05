export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  CHAT_RATE_LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };
  APP_ENV: string;
  ALLOWED_ORIGINS: string;
  AI_PROVIDER: string;
  AI_MODEL: string;
  DEEPSEEK_API_KEY?: string;
  GEMINI_API_KEY?: string;
  AI_BASE_URL?: string;
  AI_API_KEY?: string;
  TURNSTILE_SITE_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  RATE_LIMIT_SALT: string;
}
