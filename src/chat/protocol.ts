export interface ChatRequest {
  message: string;
  history: Array<{ role: 'user' | 'assistant'; text: string }>;
  turnstileToken: string;
}
export type ChatEvent = { type: 'delta'; text: string } | { type: 'done' } | { type: 'error'; code: string; message: string };
