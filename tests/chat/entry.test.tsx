// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ChatEntryProvider } from '../../src/components/chat/ChatEntryProvider';
import { useChatEntry } from '../../src/chat/useChatEntry';

vi.mock('../../src/components/profile/MessagePanel', () => ({ MessagePanel: ({ onClose }: { onClose: () => void }) => <div role="dialog"><p>Existing conversation</p><button onClick={onClose}>Close messages</button></div> }));
function ProfileButton() {
  const { openChat, unread } = useChatEntry();
  return <button id="profile-message" onClick={(event) => openChat(event.currentTarget)}>Message{unread ? ' (1)' : ''}</button>;
}
function mount() { return render(<ChatEntryProvider><ProfileButton /></ChatEntryProvider>); }
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('fetch', vi.fn()); });
afterEach(() => { cleanup(); sessionStorage.clear(); localStorage.clear(); vi.useRealTimers(); vi.unstubAllGlobals(); });

it('shows a delayed welcome without making any API request and clears unread on opening', () => {
  mount();
  expect(screen.queryByRole('button', { name: /Chat with Ronan's AI assistant/ })).toBeNull();
  expect(screen.queryByRole('button', { name: 'Open chat' })).toBeNull();
  act(() => vi.advanceTimersByTime(4000));
  expect(screen.getByRole('button', { name: 'Message (1)' })).toBeTruthy();
  expect(screen.getByText(/Want a quick tour/)).toBeTruthy();
  expect(fetch).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
  expect(screen.getByRole('dialog')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Message' })).toBeTruthy();
  expect(screen.queryByText(/Want a quick tour/)).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Close messages' }));
  act(() => vi.advanceTimersByTime(20000));
  expect(screen.queryByText(/Want a quick tour/)).toBeNull();
});

it('does not repeat a dismissed welcome after remounting but keeps chat accessible', () => {
  const view = mount();
  act(() => vi.advanceTimersByTime(4000));
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss welcome' }));
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Message (1)' }));
  view.unmount(); mount();
  act(() => vi.advanceTimersByTime(10000));
  expect(screen.queryByText(/Want a quick tour/)).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Message (1)' }));
  expect(screen.getByRole('dialog')).toBeTruthy();
});

it('suppresses the invitation when chat was opened before the delay', () => {
  const view = mount();
  fireEvent.click(screen.getByRole('button', { name: 'Message' }));
  fireEvent.click(screen.getByRole('button', { name: 'Close messages' }));
  view.unmount(); mount();
  act(() => vi.advanceTimersByTime(10000));
  expect(screen.queryByText(/Want a quick tour/)).toBeNull();
  expect(screen.getByRole('button', { name: 'Message' })).toBeTruthy();
});

it('works when session storage is unavailable', () => {
  const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  mount(); act(() => vi.advanceTimersByTime(4000));
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss welcome' }));
  expect(screen.queryByText(/Want a quick tour/)).toBeNull();
  read.mockRestore(); write.mockRestore();
});

it('waits for a visible page before showing the welcome', () => {
  const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  mount(); act(() => vi.advanceTimersByTime(10000));
  expect(screen.queryByText(/Want a quick tour/)).toBeNull();
  hidden.mockReturnValue(false);
  fireEvent(document, new Event('visibilitychange'));
  act(() => vi.advanceTimersByTime(4000));
  expect(screen.getByText(/Want a quick tour/)).toBeTruthy();
  hidden.mockRestore();
});
