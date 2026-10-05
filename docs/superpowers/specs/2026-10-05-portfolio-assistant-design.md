# Portfolio AI assistant

Date: 2026-10-05
Status: Design approved by Ronan on 2026-10-05. Implementation plan awaiting review.

## Purpose and agreed direction

Turn the existing demo chat into a working AI assistant that demonstrates Ronan's development skills and makes the portfolio enjoyable to explore. Visitors should be able to ask about any published portfolio content, open relevant pages directly, and have a relaxed conversation.

Ronan selected Cloudflare Workers with Static Assets and Gemini Developer API using `gemini-3.8-flash`. He accepts the free-tier quotas and occasional unavailability. Keep hosting and API usage on free plans, with no automatic paid fallback.

Preserve the current chat layout, avatars, responsive behavior, and opening/closing animation. The original mockup remains the visual reference; this change adds functionality rather than redesigning the portfolio.

## Personality

Display name: **Ronan's assistant**. Persistent subtitle: **AI assistant**.

- Friendly, relaxed, curious, and lightly playful. Sound like a helpful person showing someone around.
- Use simple English, short paragraphs, and no em dashes. Match the visitor's language, including Filipino or Taglish when they use it.
- Adapt to intent: concise and factual for recruiters, more technical for developers, casual for small talk. Offer detail when asked.
- Occasional jokes and emojis are fine. Avoid forced slang, excessive enthusiasm, corporate language, or inserting a joke into every answer.
- Allow general conversation and ordinary technical questions. Do not redirect every unrelated message back to the portfolio.
- Speak as the assistant. Refer to Ronan in the third person and never claim to be Ronan personally responding.
- Do not invent Ronan's opinions, memories, achievements, availability, rates, or commitments. For missing personal facts, say so and offer his LinkedIn.
- General answers use model knowledge, without claiming current web access or live research.

Suggested opening:

> Hey! I'm Ronan's AI assistant. Ask me about his projects, how he got started, or just say hi. Where should we start?

Illustrative behavior, not canned replies:

- **Show me his capstone.** Explain that PULSE is his college capstone and provide its project link.
- **Did he build LMS Billing himself?** Explain his sole full-stack contribution as part of his role at Seaversity, preserving employer attribution.
- **I'm also scared to start my first job.** Respond naturally and empathetically, then mention his blog if useful. Do not claim personal lived experience.
- **Are you actually Ronan?** "I'm his AI assistant. Ronan built the portfolio; I'm here to help you explore it. For the real Ronan, there's LinkedIn."
- **Tell me a programming joke.** Answer playfully without forcing a project recommendation.

## Portfolio knowledge and links

Generate the assistant's reference material during the build from the same published data used by the website:

- Profile bio, title, location, and public contact links.
- Experience, education, and the complete skills list.
- Every project: descriptions, contributions, features, technologies, category, and published links.
- Published feed posts and their associated projects or blog articles.
- Blog metadata and full text from the existing Markdown content.

Do not read `.local-reference`, private repositories, environment files, unpublished drafts, or visitor-created posts/comments into the assistant. Exclude mock connection, follower, and engagement counts so it does not describe sample numbers as real accomplishments.

Bundle this public reference into the Worker; regenerate it whenever the site is built. No vector database, crawling, embeddings, or separate CMS for version one. Fail the build with a useful message if the reference exceeds a deliberate size ceiling, rather than silently dropping portfolio content.

Give the model a catalog of valid destinations:

- Projects: `/#projects/<existing-id>`.
- Blog articles: `/#blog/<existing-id>`.
- Feed posts: `/#posts/<existing-id>`.
- About sections: `/#about/bio`, `/#about/experience`, `/#about/skills`.
- External destinations: only links already published in the portfolio data, including LinkedIn and GitHub.

Render a small safe subset of Markdown: paragraphs, emphasis, lists, inline code, and links. Escape HTML. Make only catalog-approved URLs clickable; unknown destinations remain plain text. Never execute model output or navigate automatically.

Clicking an internal link closes the chat, opens the destination using the existing hash router, and lets the page focus/scroll behavior run. Keep the conversation in app-level memory so it remains available when chat is reopened. External links open in a new tab with appropriate link attributes. A full reload or a New chat action clears the conversation.

## Architecture

The existing Vite build produces static site files. One Cloudflare Worker serves `POST /api/chat`, with Static Assets serving the portfolio. Explicitly route `/api/*` to the Worker so API failures never return the SPA HTML. Unknown API paths return JSON 404; unsupported methods return 405.

Request flow:

1. The chat sends the current message, bounded recent history, and a Turnstile token to the same-origin endpoint.
2. The Worker validates the request, bot token, origin, and rate allowance.
3. It adds server-owned personality instructions and the public portfolio reference.
4. It calls Gemini's streaming REST endpoint using the encrypted `GEMINI_API_KEY` secret.
5. It forwards only answer text and controlled status events to the browser. Do not return internal thinking, raw provider errors, or configuration.

Use `GEMINI_MODEL` as a server-side setting, initially `gemini-3.8-flash`, so a future model change does not affect the UI. Keep the API key out of client imports, `VITE_` variables, logs, and Git. Document ignored local secrets and production secret setup.

Keep implementation responsibilities separate: public knowledge generation, assistant instructions, request validation/provider streaming, conversation state, and safe message rendering. The existing `MessagePanel` remains responsible for presentation and its animation.

## Chat behavior

- Replace the fixed demo reply with real streamed answers.
- Show a waiting indicator before the first answer chunk and a Stop action during generation.
- Enter sends; Shift+Enter inserts a newline. Preserve IME composition behavior.
- One active request per chat. Closing the dialog or pressing Stop aborts the request; closing retains messages already received.
- Autoscroll only while the visitor is near the bottom. Preserve manual scroll position while they read older messages.
- Provide New chat and explicit Retry for failed answers. Retry does not duplicate the user's message.
- Suggested starters: "Show me a project", "How did Ronan get started?", and "What does he work with?" Populate the composer so visitors can edit before sending.
- Preserve visible partial answers after an interrupted stream and mark them incomplete. Exclude incomplete assistant replies from later model history.
- Use clear labels and a polite completion/status announcement without announcing every streamed token.

## Free-tier limits and reliability

Initial application limits, adjustable server-side:

- 2,000 characters per visitor message.
- At most the last six completed exchanges plus the new message, capped at 16,000 history characters and a 32 KiB request body.
- Target short answers, usually under 200 words; allow longer explanations when asked. Start with a 4,096-token generation budget, including thinking, and low thinking level. Verify useful answer length in the live smoke test; show an incomplete-answer state if the budget cuts a response short.
- 45-second overall request timeout and no automatic retry loops or paid-provider fallback.
- Server-side Cloudflare rate-limit binding, initially five requests per minute per anonymous network identifier. This is best-effort abuse control, not an exact global daily cap; shared networks can share the allowance. Do not use process-local counters as a global limit.
- Validate Turnstile server-side before Gemini calls in production. Local testing uses official test credentials; missing production protection fails closed.

Return useful messages for invalid input, throttling, unavailable quota, timeout, safety-blocked/empty output, and an interrupted stream. Offer existing project and LinkedIn links when chat is unavailable. Static portfolio pages must remain usable independently of the API.

Keep prompt instructions separate from visitor-supplied history; accept only user/assistant message roles. Treat history and model output as untrusted. The assistant has no tools for accessing private data or taking actions for Ronan. Prompt instructions guide factual behavior but are not a security boundary.

## Privacy and deployment

Replace the demo disclaimer with a short persistent notice:

> AI assistant. Messages are sent to Google Gemini. Please don't share sensitive information.

An adjacent details link explains free-tier data processing and that the portfolio does not intentionally store conversations server-side. Do not claim Google saves nothing. Avoid logging message bodies or model answers; operational errors may record status and timing only.

Deployment preparation includes Wrangler configuration, local Worker testing, build scripts, and a short README guide. Start with a Workers preview address before connecting `ronandelacruz.com`. No DNS changes, paid upgrades, remote secrets, or production deployment are part of writing this design. Deployment follows working local verification and access to the required accounts/secrets.

## Validation and acceptance

- Verify complete reference coverage and valid links for every published project, post, and blog article.
- Test request/body/history limits, role validation, bot rejection, throttling, missing secrets, and provider errors without real API calls.
- Test streaming across split network chunks, Unicode, Stop/close cancellation, Retry, and interrupted replies.
- Test unsafe links/HTML are inert, while valid project, blog, post, and external links work.
- Verify internal navigation preserves conversation state and respects existing focus behavior.
- Browser-check desktop/mobile layout, keyboard use, reduced motion, and the previously corrected opening/closing animation.
- Run TypeScript, relevant lint/tests, production build, and Worker deployment dry run; inspect client output for accidental secret inclusion.
- Once a key is configured, use a small live smoke test for portfolio accuracy, links, casual tone, language adaptation, missing facts, and quota failure behavior. Treat model behavior as something to evaluate, not guarantee.

## References

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers rate limiting and its locality limits](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Gemini 3.8 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash)
- [Gemini text generation and streaming](https://ai.google.dev/gemini-api/docs/text-generation)
- [Gemini quotas](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Gemini data terms](https://ai.google.dev/gemini-api/terms)
