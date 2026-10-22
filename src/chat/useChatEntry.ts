import { createContext, useContext } from 'react';

export const ChatEntryContext = createContext<{
  unread: boolean;
  openChat: (trigger: HTMLElement) => void;
} | null>(null);

export function useChatEntry() {
  const value = useContext(ChatEntryContext);
  if (!value) throw new Error('ChatEntryProvider is required.');
  return value;
}
