import type { ChatRequest } from '../../src/chat/protocol';
import type { Env } from '../env';
import { instructions } from './instructions';
import { ChatError } from './request';

interface FrameResult { text: string; finished: boolean }
interface Provider {
  request(input: ChatRequest): { url: string; headers: Record<string, string>; body: object };
  decode(frame: unknown): FrameResult;
}
interface CompletionFrame {
  error?: unknown;
  choices?: Array<{ delta?: { content?: string; reasoning_content?: string }; finish_reason?: string | null }>;
}
interface GeminiFrame {
  error?: unknown;
  promptFeedback?: { blockReason?: string };
  candidates?: Array<{ content?: { parts?: Array<{ text?: string; thought?: boolean }> }; finishReason?: string }>;
}
const unavailable = () => new ChatError(503, 'configuration', 'The assistant is not configured yet. You can still reach Ronan on LinkedIn.');

export function getProvider(env: Env): Provider {
  const model = env.AI_MODEL?.trim();
  if (!model || model.length > 128) throw unavailable();
  if (env.AI_PROVIDER === 'gemini') {
    const key = env.GEMINI_API_KEY?.trim();
    if (!key) throw unavailable();
    return {
      request: (input) => ({
        url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`,
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: {
          systemInstruction: { parts: [{ text: instructions }] },
          contents: [...input.history.map(({ role, text }) => ({ role: role === 'assistant' ? 'model' : 'user', parts: [{ text }] })), { role: 'user', parts: [{ text: input.message }] }],
          generationConfig: { maxOutputTokens: 4096, thinkingConfig: { thinkingLevel: 'low' } },
        },
      }),
      decode: (raw) => {
        if (!raw || typeof raw !== 'object') throw new Error('Invalid frame');
        const frame = raw as GeminiFrame;
        if (frame.error || frame.promptFeedback?.blockReason) throw new Error('Generation failed');
        const candidate = frame.candidates?.[0];
        if (candidate?.finishReason && candidate.finishReason !== 'STOP') throw new Error('Incomplete generation');
        return { text: (candidate?.content?.parts ?? []).filter((part) => !part.thought && typeof part.text === 'string').map((part) => part.text).join(''), finished: candidate?.finishReason === 'STOP' };
      },
    };
  }
  if (!['deepseek', 'openai-compatible'].includes(env.AI_PROVIDER)) throw unavailable();
  const deepseek = env.AI_PROVIDER === 'deepseek';
  const key = (deepseek ? env.DEEPSEEK_API_KEY : env.AI_API_KEY)?.trim();
  if (!key) throw unavailable();
  let base: URL;
  try {
    base = new URL(deepseek ? 'https://api.deepseek.com' : env.AI_BASE_URL || '');
    if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) throw new Error();
  } catch { throw unavailable(); }
  const url = `${base.href.replace(/\/+$/, '')}/chat/completions`;
  return {
    request: (input) => ({
      url,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: {
        model, stream: true, max_tokens: 4096,
        ...(deepseek ? { thinking: { type: 'disabled' } } : {}),
        messages: [{ role: 'system', content: instructions }, ...input.history.map(({ role, text }) => ({ role, content: text })), { role: 'user', content: input.message }],
      },
    }),
    decode: (raw) => {
      // A sentinel without a preceding successful finish reason is truncated.
      if (!raw || typeof raw !== 'object') throw new Error('Invalid frame');
      const frame = raw as CompletionFrame;
      if (frame.error) throw new Error('Generation failed');
      const choice = frame.choices?.[0];
      if (choice?.finish_reason && choice.finish_reason !== 'stop') throw new Error('Incomplete generation');
      return { text: typeof choice?.delta?.content === 'string' ? choice.delta.content : '', finished: choice?.finish_reason === 'stop' };
    },
  };
}
