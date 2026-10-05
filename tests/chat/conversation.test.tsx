// @vitest-environment jsdom
import { act, renderHook, waitFor, cleanup } from '@testing-library/react';
import { afterEach, it, expect, vi } from 'vitest';
import { ChatProvider } from '../../src/chat/ChatProvider';
import { useChat } from '../../src/chat/useChat';
import { buildRequest } from '../../src/chat/history';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const emit = (c: ReadableStreamDefaultController, value: unknown) => c.enqueue(new TextEncoder().encode(JSON.stringify(value) + '\n'));
it('streams, prevents duplicate sends, stops and retries without duplicating the visitor', async () => {
  let controller: ReadableStreamDefaultController;
  const fetcher = vi.fn().mockImplementation(() => Promise.resolve(new Response(new ReadableStream({ start(c) { controller = c; } }))));
  vi.stubGlobal('fetch', fetcher);
  const { result } = renderHook(useChat, { wrapper: ChatProvider });
  act(() => { void result.current.send('Hi', 'token'); void result.current.send('duplicate', 'token'); });
  expect(fetcher).toHaveBeenCalledTimes(1);
  await act(async () => { emit(controller, { type: 'delta', text: 'Hello' }); });
  expect(result.current.messages[1].text).toBe('Hello');
  act(() => result.current.stop());
  expect(result.current.messages[1].status).toBe('incomplete');
  act(() => { void result.current.retry('fresh-token'); });
  await act(async () => { emit(controller, { type: 'delta', text: 'Hello again' }); emit(controller, { type: 'done' }); controller.close(); });
  await waitFor(() => expect(result.current.pending).toBe(false));
  expect(result.current.messages).toHaveLength(2);
  expect(result.current.messages[1].text).toBe('Hello again');
  expect(result.current.messages[1].status).toBe('complete');
});
it('ignores a late response after reset and retains conversation across hook consumers', async () => {
  let resolve: (r: Response) => void = () => undefined;
  vi.stubGlobal('fetch', vi.fn().mockImplementation(() => new Promise<Response>((r) => { resolve = r; })));
  const { result } = renderHook(useChat, { wrapper: ChatProvider });
  act(() => { void result.current.send('Hi', 'token'); result.current.reset(); });
  await act(async () => { resolve(new Response('{"type":"delta","text":"old"}\n{"type":"done"}\n')); });
  expect(result.current.messages).toEqual([]); expect(result.current.pending).toBe(false);
});
it('bounds UTF-8 history and excludes incomplete exchanges', () => {
  const messages = Array.from({ length: 20 }, (_, i) => ({ id: String(i), role: i % 2 ? 'assistant' as const : 'user' as const, text: 'あ'.repeat(1900), time: '', status: 'complete' as const }));
  const request = buildRequest(messages, 'hello', 'token');
  expect(request.history.length).toBeLessThanOrEqual(12);
  expect(new TextEncoder().encode(JSON.stringify(request)).length).toBeLessThanOrEqual(32768);
  expect(buildRequest([{ ...messages[0] }, { ...messages[1], status: 'incomplete' }], 'hello', 'token').history).toEqual([]);
});
