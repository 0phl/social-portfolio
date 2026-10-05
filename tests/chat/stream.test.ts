import { it, expect } from 'vitest';
import { readChatStream } from '../../src/chat/stream';
it('requires an explicit done event and rejects malformed or oversized events', async () => {
  for (const raw of ['{"type":"delta","text":"hi"}\n', '{oops}\n', '{"type":"unknown"}\n', 'x'.repeat(65537)]) {
    await expect(readChatStream(new Response(raw), () => undefined, new AbortController().signal)).rejects.toThrow();
  }
});
it('reports a controlled error event', async () => {
  await expect(readChatStream(new Response('{"type":"error","code":"busy","message":"Try later"}\n'), () => undefined, new AbortController().signal)).rejects.toThrow('Try later');
});
