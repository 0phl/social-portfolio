// @vitest-environment jsdom
import { useEffect, useRef } from 'react';
import { act, render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, it, expect, vi } from 'vitest';
import { ChatProvider } from '../../src/chat/ChatProvider';
import { MessagePanel } from '../../src/components/profile/MessagePanel';
vi.mock('../../src/components/chat/TurnstileChallenge', () => ({ TurnstileChallenge: ({ revision, onToken }: { revision: number; onToken: (t: string) => void }) => {
  const callback = useRef(onToken); callback.current = onToken;
  useEffect(() => callback.current(`token-${revision}`), [revision]);
  return null;
} }));
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it('supports IME, navigation, fresh tokens, close and reopening history', async () => {
  const fetcher = vi.fn().mockImplementation((url) => Promise.resolve(url.endsWith('/config') ? Response.json({ turnstileSiteKey: 'test' }) : new Response('{"type":"delta","text":"[Projects](/#projects)"}\n{"type":"done"}\n')));
  vi.stubGlobal('fetch', fetcher);
  const close = vi.fn(); const navigate = vi.fn();
  const { rerender } = render(<ChatProvider><MessagePanel onClose={close} onNavigate={navigate} /></ChatProvider>);
  expect(screen.getByText(/AI assistant\. Replies can be wrong\./)).toBeTruthy();
  expect(document.body.textContent).not.toMatch(/Google|Gemini|DeepSeek|deepseek-flash/);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Send message' }).hasAttribute('disabled')).toBe(true));
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hi' } });
  fireEvent.keyDown(screen.getByLabelText('Message'), { key: 'Enter', isComposing: true });
  expect(fetcher).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Send message' }).hasAttribute('disabled')).toBe(false));
  await act(async () => fireEvent.keyDown(screen.getByLabelText('Message'), { key: 'Enter' }));
  await screen.findByRole('link', { name: 'Projects' });
  fireEvent.click(screen.getByRole('link', { name: 'Projects' })); expect(navigate).toHaveBeenCalledWith('/#projects');
  rerender(<ChatProvider><div>Other page</div></ChatProvider>);
  rerender(<ChatProvider><MessagePanel onClose={close} onNavigate={navigate} /></ChatProvider>);
  expect(screen.getByRole('link', { name: 'Projects' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Close messages' })); expect(close).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'New chat' }));
  expect(screen.queryByRole('link', { name: 'Projects' })).toBeNull();
});
