import type { ChatRequest } from './protocol';
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  status: 'pending' | 'streaming' | 'complete' | 'incomplete' | 'error';
  error?: string;
}
export function buildRequest(messages: Message[], message: string, turnstileToken: string): ChatRequest {
  const pairs: ChatRequest['history'][] = [];
  for (let i = 0; i < messages.length - 1; i++) {
    const user = messages[i]; const assistant = messages[i + 1];
    if (user.role === 'user' && assistant.role === 'assistant' && user.status === 'complete' && assistant.status === 'complete') pairs.push([{ role: 'user', text: user.text }, { role: 'assistant', text: assistant.text }]);
  }
  let history = pairs.slice(-6).flat();
  while (history.length && (history.reduce((sum, item) => sum + item.text.length, 0) > 16000 || new TextEncoder().encode(JSON.stringify({ message, history, turnstileToken })).length > 32768)) history = history.slice(2);
  return { message, history, turnstileToken };
}
