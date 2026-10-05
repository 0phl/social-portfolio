# Portfolio Assistant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the demo chat with a friendly Gemini assistant that knows the published portfolio, provides safe page links, and runs locally before deployment.

**Architecture:** Vite produces the static site and a generated public-content reference. A Cloudflare Worker validates chat requests and streams Gemini answers. React owns temporary conversation state and renders safe replies inside the existing dialog.

**Tech Stack:** Existing React 18, TypeScript, Vite 5, Tailwind, and Framer Motion; Wrangler 4, Workers Web APIs, Gemini REST streaming, Turnstile, Vitest 3, React Testing Library, jsdom, and react-markdown 9. Resolve compatible patches and commit the lockfile without upgrading unrelated packages.

**Spec:** [Approved design](../specs/2026-10-05-portfolio-assistant-design.md).

**Execution:** Recommend native execution in this chat. Tasks are sequential and share contracts; no subagent delegation is needed. Await written-plan review before product implementation.

## Global Constraints

- Preserve the current dialog layout, responsive styling, avatars, and opening/closing animation.
- Model: `gemini-3.8-flash`; server-owned `GEMINI_MODEL` and encrypted `GEMINI_API_KEY`.
- 2,000 characters per visitor message; six completed exchanges plus current message; 16,000 history characters; 32 KiB body; 4,096 generation tokens including thinking; low thinking; 45-second total timeout.
- Five requests per minute per anonymous network identifier using the Worker rate-limit binding; best-effort, location-local enforcement, not a global billing cap.
- Production Turnstile validation required. Official test keys only for explicit local configuration. No automatic paid fallback or automatic retries.
- Public portfolio content only; no mock engagement, visitor previews, private repositories, or `.local-reference` ingestion.
- Simple English, no em dashes, adaptable casual personality, explicit AI identity, truthful employer/client attribution.
- Automatically commit checked tasks. Do not push, deploy, or change DNS during this local implementation.

## Review Focus

- Multibyte UTF-8 split across stream chunks must remain readable; byte-sized request limits must work without Content-Length (tasks 2 and 3).
- Late chunks from an aborted request must not appear in a new or reopened conversation (task 4).
- Internal links to the current route must still reveal/focus the destination, and dialog focus restoration must not pull focus back to Message (task 4).
- Expired/reused Turnstile tokens must trigger a fresh challenge on retry, with no duplicate user message (tasks 2 and 4).
- A new project/post/blog must appear after rebuilding, and API errors must not be hidden by SPA fallback (tasks 1 and 5).

## Task 1: Automatically refreshed portfolio knowledge

**Files:** Create `src/chat/knowledge.ts`, `scripts/generate-chat-knowledge.mjs`, `tests/chat/knowledge.test.ts`, `vitest.config.ts`; modify `package.json`, `package-lock.json`, `.gitignore`.

**Interfaces:** `buildKnowledge({ profile, experience, education, skillGroups, projects, posts, blogPosts }): { reference: string; links: Record<string, string> }`. Keys in `links` are exact approved URLs; values are display labels. Generated files: `.generated/assistant-knowledge.json` and `.generated/assistant-links.json`.

- [ ] Add the test toolchain. Write `includesEveryPublishedItemAndFullBlogText`, `excludesMockStatsAndPreviewPosts`, `generatesExistingHashDestinations`, and `includesNewContentAfterRegeneration`. Assert public IDs/text and URLs survive; mock stats/engagement and preview-only text do not. Test a newly appended item in each content type.
- [ ] Run `npx vitest run tests/chat/knowledge.test.ts` and verify the expected missing-feature failure.
- [ ] Implement explicit field selection in `buildKnowledge`; retain project contributions/features and blog headings/paragraphs. Deduplicate associated blog-post entries without dropping either navigation destination. Include published external URLs, require HTTPS for external click targets, and reject duplicate IDs. Set a 200 KiB UTF-8 reference ceiling with an actionable build error.
- [ ] Implement the generation script using Vite's `createServer`/`ssrLoadModule` to load the existing TS and `?raw` Markdown imports without maintaining a second content copy. Close the Vite server in `finally`; write ignored generated JSON outside `public`.
- [ ] Add `chat:knowledge` and run it before every production build and local chat startup. Test overflow and duplicate IDs fail generation. Run tests and `npm run build`; inspect reference coverage without printing private data.
- [ ] Review and commit only the knowledge/toolchain files: `feat: add portfolio assistant knowledge`.

## Task 2: Validated local Worker API

**Files:** Create `worker/index.ts`, `worker/chat/request.ts`, `worker/chat/protection.ts`, `worker/env.ts`, `src/chat/protocol.ts`, `wrangler.jsonc`, `tsconfig.worker.json`, `.dev.vars.example`, `tests/worker/chat.test.ts`; modify scripts, lockfile, and ignore rules.

**Interfaces:** `ChatRequest = { message: string; history: Array<{ role: 'user' | 'assistant'; text: string }>; turnstileToken: string }`. `readChatRequest(request: Request): Promise<ChatRequest>` validates bounded UTF-8 input. `createHandler(fetcher: typeof fetch)` exposes an injectable HTTP handler for tests; production exports the handler using real fetch. Env includes `ASSETS`, `CHAT_RATE_LIMITER`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `APP_ENV`, `ALLOWED_ORIGINS`, and `RATE_LIMIT_SALT`.

- [ ] Write tests for empty/overlong messages, unknown/system roles, nonalternating history, excessive history/body, malformed JSON, unsupported content type, untrusted origin, missing configuration, failed/expired Turnstile tokens, and rejected rate allowance. Assert Gemini is never called on rejection. Include a streamed body over 32 KiB without Content-Length.
- [ ] Run `npx vitest run tests/worker/chat.test.ts` and observe expected failures before implementation.
- [ ] Implement `POST /api/chat`, `GET /api/chat/config` returning only `{ turnstileSiteKey }`, and JSON 404/405 for other API paths/methods. Use explicit configured allowed origins; Origin checks supplement bot/rate controls rather than acting as authentication. Return `Cache-Control: no-store`.
- [ ] Validate Turnstile via Siteverify with the token, expected hostname/action, and no response/token logging. Production rejects official dummy keys. Hash the Cloudflare-provided network address with `RATE_LIMIT_SALT` for the limiter; never trust a client-provided IP field. Allow a fixed loopback identity only under explicit local configuration. Missing production limiter or salt fails closed.
- [ ] Configure assets directory `dist`, asset binding `ASSETS`, SPA fallback, and `run_worker_first: ['/api/*']`. Configure `main: worker/index.ts`, compatibility date `2026-10-05`, and an explicit local environment with its own bindings. No remote bindings during local tests.
- [ ] Add `dev:chat` as `npm run build && wrangler dev --env local --ip 127.0.0.1 --port 8787`; add `check:worker` and `deploy:dry-run`. Ignore `.wrangler/`, `.generated/`, `.dev.vars*`, `.env*`, while allowing placeholder examples. The example contains placeholders only, never real API keys.
- [ ] Run request tests and Worker typecheck. Review and commit: `feat: add assistant API and local runtime`.

## Task 3: Gemini streaming and error handling

**Files:** Create `worker/chat/instructions.ts`, `worker/chat/gemini.ts`, `worker/chat/sse.ts`, `src/chat/stream.ts`, `tests/worker/gemini.test.ts`, `tests/chat/stream.test.ts`; update API handler and protocol.

**Interfaces:** `ChatEvent = { type: 'delta'; text: string } | { type: 'done' } | { type: 'error'; code: string; message: string }`. Worker response is NDJSON over `application/x-ndjson`. `streamGemini(input: ChatRequest, env: Env, signal: AbortSignal): Promise<Response>` returns controlled streaming output. `readChatStream(response: Response, onEvent: (event: ChatEvent) => void, signal: AbortSignal): Promise<void>` decodes and validates events. Only `done` marks a completed reply.

- [ ] Write fixtures for Gemini SSE split inside JSON and UTF-8 characters, multiple events per chunk, thought-only parts, empty/safety-blocked responses, MAX_TOKENS, upstream 429/5xx, malformed frames, early EOF, cancellation, and timeout. Assert secrets/raw upstream errors and thought text never reach the client.
- [ ] Run these tests and confirm expected failures.
- [ ] Implement personality/system instructions from the approved spec and append the generated reference and valid link catalog. Convert accepted history to Gemini user/model roles. Call the fixed Google API host with the API key in the header, configured model, `maxOutputTokens: 4096`, and `thinkingLevel: 'low'`.
- [ ] Parse SSE incrementally; forward only answer text. Bound upstream frame buffering. Keep the 45-second deadline active until the stream finishes, combining it with cancellation. Stop reading and cancel upstream when the browser disconnects or aborts; clean up readers/timers.
- [ ] Map pre-stream failures to controlled HTTP errors and mid-stream failures to error events. Never emit `done` after blocked, malformed, truncated, or timed-out generation. No automatic retries. Provide visitor-readable unavailable and retry messages.
- [ ] Implement the browser NDJSON decoder with streaming TextDecoder and bounded buffering; a stream ending without `done` is incomplete. Run both test files and the full test suite.
- [ ] Review and commit: `feat: stream Gemini assistant replies`.

## Task 4: Working chat UI and safe navigation

**Files:** Create `src/chat/ChatProvider.tsx`, `src/chat/useChat.ts`, `src/chat/history.ts`, `src/components/chat/AssistantMessage.tsx`, `src/components/chat/TurnstileChallenge.tsx`, `tests/chat/conversation.test.tsx`, `tests/chat/links.test.tsx`; modify `src/App.tsx`, `src/components/profile/MessagePanel.tsx`, `src/components/profile/ProfileHeader.tsx`, and required test setup/dependencies.

**Interfaces:** Provider state: messages with UUID, role, text, timestamp, and `pending | streaming | complete | incomplete | error` status. `useChat()` exposes `messages`, `pending`, `send(text, token)`, `retry(token)`, `stop()`, and `reset()`. `AssistantMessage({ text, onNavigate })` renders only allowed Markdown and catalog links. `TurnstileChallenge({ siteKey, onToken, onExpire })` exposes fresh challenge state for every request.

- [ ] Write tests for streamed rendering, duplicate-send prevention, IME Enter behavior, Stop/close abort, partial-answer retention, retry without duplicate messages, token reset, New chat, and stale-response suppression after reset. Use controlled HTTP streams; do not add production fake-reply behavior.
- [ ] Add renderer tests for approved project/blog/post/external URLs, same-origin absolute URL normalization, unknown IDs, `javascript:` links, protocol-relative URLs, images, and raw HTML. Unsafe destinations must not be clickable; raw HTML must remain inert.
- [ ] Run tests and verify expected failures. Implement app-level state with a request-generation ID so late events cannot mutate a newer conversation. Send only complete user/assistant pairs within both history limits; drop oldest pairs first. Local history remains memory-only and clears on full reload.
- [ ] Implement Markdown with raw HTML disabled, restricted elements, no remote images, and exact normalized link-catalog lookup. Internal navigation waits for dialog exit before setting/focusing the target; repeated same-route links explicitly focus/scroll the destination. External links use a new tab with `noopener noreferrer`.
- [ ] Update ProfileHeader's dialog close callback to distinguish normal close from navigation. Normal close restores Message-button focus; navigation must not. Keep all existing motion settings and respect reduced motion.
- [ ] Replace demo copy and fixed replies, show waiting/streaming states, Stop/New chat/Retry controls, and the three approved starters. Preserve manual scrolling; autoscroll only near the bottom. Add a separate polite status announcement rather than announcing every token.
- [ ] Load the Turnstile script once, mount/unmount widgets safely under React StrictMode, recover after expiry or failure, and request a new token for retries. Missing challenge configuration leaves the portfolio usable and chat visibly unavailable.
- [ ] Add the approved privacy notice plus expandable details about provider processing and local-only conversation storage. Keep public contact links available on failure.
- [ ] Run full tests, frontend typecheck, relevant lint, and build. Browser-check desktop/mobile and keyboard behavior against current dialog and original reference. Review and commit: `feat: add interactive portfolio assistant`.

## Task 5: Local integration, documentation, and final verification

**Files:** Modify `README.md`, `.dev.vars.example`, package scripts/config only as needed; record validation in this plan. Keep screenshots and temporary outputs ignored in `.local-reference`.

- [ ] Document two levels: deterministic tests with mocked Google/Turnstile fetch responses (no key/quota), and real browser chat using local workerd plus a Gemini key (Google calls still use quota).
- [ ] Document `.dev.vars.local` with `GEMINI_API_KEY`, official Turnstile testing secret, and local-only salt; local Wrangler vars hold the official test site key and loopback origins. Never print or commit the real key. Production uses real Turnstile keys and encrypted Worker secrets, configured separately later.
- [ ] Run `npm run dev:chat` and open `http://127.0.0.1:8787`. Verify static pages load, missing Gemini configuration fails clearly, `/api/unknown` returns JSON 404, and GET `/api/chat` returns 405 rather than HTML. Stop any existing process only if it belongs to this task.
- [ ] When the user has configured the local key, run a small live test: PULSE capstone, Seaversity contribution, blog link, post link, casual joke, Taglish reply, and an unknown personal fact. Do not ask for the key in chat. If unavailable, finish all other work and report the live-model check as unverified.
- [ ] Verify closing/reopening and navigation retain completed conversation; New chat clears it; failed/aborted replies can recover. Capture desktop/mobile proof and check browser errors without recording message bodies in app logs.
- [ ] Verify a temporary test fixture with one added project, post, and blog regenerates knowledge; do not add fake content to the live site. Run `npm test`, frontend and Worker typechecks, relevant lint, `npm run build`, `npm run deploy:dry-run`, and `git diff --check`. Scan client output for an injected test-only secret marker using an isolated test build, never print a real secret.
- [ ] Review all requested changes and report any pre-existing check failures separately. Commit documentation/integration changes: `docs: document local assistant testing`. No push or production deployment.

## Planned local workflow

After implementation adds the scripts and examples:

```powershell
Copy-Item .dev.vars.example .dev.vars.local
# Edit .dev.vars.local privately with the Gemini key and local test values.
npm run dev:chat
```

Open `http://127.0.0.1:8787`. Wrangler runs the Worker and serves the built portfolio locally; no Cloudflare deployment is needed. A real chat still connects to Google and Turnstile over the internet. Repeat `npm run dev:chat` after changing content to rebuild the reference and static site together. Ordinary `npm run dev` remains the frontend-only workflow; it is not the end-to-end chat test.

## Documentation checked

- [Cloudflare local development](https://developers.cloudflare.com/workers/local-development/)
- [Local secrets](https://developers.cloudflare.com/workers/local-development/environment-variables/)
- [Official Turnstile testing keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
- [Static Assets SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)
