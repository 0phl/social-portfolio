import { createContext, useContext } from 'react';
import type { Message } from './history';
export interface ChatState {
  messages: Message[];
  pending: boolean;
  send(text: string, token: string): Promise<void>;
  retry(token: string): Promise<void>;
  stop(): void;
  reset(): void;
}
export const ChatContext = createContext<ChatState | null>(null);
export function useChat() {
  const value = useContext(ChatContext);
  if (!value) throw new Error('ChatProvider is required.');
  return value;
}
