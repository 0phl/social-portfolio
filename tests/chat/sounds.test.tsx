// @vitest-environment jsdom
import { act, renderHook, cleanup } from '@testing-library/react';
import { afterEach, it, expect, vi } from 'vitest';
import { useChatSounds } from '../../src/chat/useChatSounds';
import type { Message } from '../../src/chat/history';

afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllGlobals(); });
const reply: Message = { id: 'answer', role: 'assistant', text: 'Hello', time: '', status: 'complete' };
function audioMock() {
  const start = vi.fn(); const stop = vi.fn(); const close = vi.fn().mockResolvedValue(undefined);
  const context = { state: 'running', currentTime: 0, destination: {}, close, resume: vi.fn().mockResolvedValue(undefined),
    createOscillator: () => ({ type: '', frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn(), disconnect: vi.fn(), start, stop, onended: null }),
    createGain: () => ({ gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn(), disconnect: vi.fn() }) };
  const constructor = vi.fn(function () { return context; }); vi.stubGlobal('AudioContext', constructor);
  return { start, stop, close, context, constructor };
}
it('starts audio only from interaction, plays once on arrival, and does not replay history', async () => {
  const audio = audioMock();
  const { result, rerender, unmount } = renderHook(({ messages }) => useChatSounds(messages), { initialProps: { messages: [] as Message[] } });
  expect(audio.constructor).not.toHaveBeenCalled();
  await act(async () => result.current.playSend());
  expect(audio.start).toHaveBeenCalledTimes(1);
  rerender({ messages: [reply] });
  expect(audio.start).toHaveBeenCalledTimes(3);
  rerender({ messages: [{ ...reply }] });
  expect(audio.start).toHaveBeenCalledTimes(3);
  unmount(); expect(audio.close).toHaveBeenCalledTimes(1);
  renderHook(() => useChatSounds([reply]));
  expect(audio.start).toHaveBeenCalledTimes(3);
});
it('honors mute on send and receive and keeps the preference across reopening', async () => {
  const audio = audioMock();
  const { result, rerender, unmount } = renderHook(({ messages }) => useChatSounds(messages), { initialProps: { messages: [] as Message[] } });
  act(() => result.current.toggleSounds());
  expect(result.current.soundsEnabled).toBe(false);
  await act(async () => result.current.playSend()); rerender({ messages: [reply] });
  expect(audio.start).not.toHaveBeenCalled();
  unmount();
  const next = renderHook(() => useChatSounds([])); expect(next.result.current.soundsEnabled).toBe(false);
});
it('does not play a late sound after closing during browser audio activation', async () => {
  const audio = audioMock(); audio.context.state = 'suspended';
  let resume = () => undefined;
  audio.context.resume.mockImplementation(() => new Promise<void>(resolve => { resume = resolve; }));
  const { result, unmount } = renderHook(() => useChatSounds([]));
  act(() => result.current.playSend()); unmount();
  await act(async () => { resume(); });
  expect(audio.start).not.toHaveBeenCalled();
});
