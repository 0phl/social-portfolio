# AI assistant

Local setup, conversation behavior, providers, and production configuration. See the [README](../README.md) for the project overview.

## Test the AI assistant locally

No Cloudflare deployment is needed. Create the local secrets file if it does not already exist:

```powershell
if (-not (Test-Path .dev.vars.local)) {
  Copy-Item .dev.vars.example .dev.vars.local
}
```

Edit `.dev.vars.local` privately and set `DEEPSEEK_API_KEY` to your DeepSeek API key. Keep the included Turnstile testing secret and local salt. This file is ignored by Git. Never put the key in a `VITE_` variable, browser code, or a commit. If the file already exists, edit it rather than copying over it.

```sh
npm run dev:chat
```

Open **http://127.0.0.1:8787**. Wrangler serves the built site and `/api/chat` locally. Real replies still call the configured AI service and use your API quota; verification also needs an internet connection. Without a key, the site works and chat shows a configuration message. Restart this command after changing content or secrets.

The default is `deepseek-flash`, with thinking disabled for shorter response times. Conversations stay in browser memory until reload. Stop and closing the dialog cancel a reply; New chat clears the conversation. Messages are processed under the selected service's data policies, so do not send sensitive information.

The chat shows animated typing dots for 3–5 seconds while a reply loads, then displays the complete message. Slower replies keep the dots visible until ready. Send and receive sounds begin only after interaction; the header's mute button remembers your preference locally. Reduced-motion settings turn the moving dots into a static indicator.

The assistant focuses on my portfolio but welcomes everyday questions and coding help. It uses warm, playful English or everyday Taglish and talks about me in third person. Replies have room for banter and useful detail, without a fixed sentence limit. The first harmless off-topic request gets a playful reaction; follow-ups can carry the joke forward without repeating that the topic is unrelated. Direct-answer requests, frustration, and serious or sensitive conversations skip the banter. Jokes stay away from personal digs. It stays honest about being an AI assistant. This is intended behavior, not a change to its access or security controls.

### Conversation voice

`worker/chat/voice.ts` contains the voice guide and conversation examples. `worker/chat/style-examples.ts` is a small, editable dataset adapted from my supplied writing examples, with context, visitor messages, and assistant replies. It is included in the prompt to demonstrate phrasing without encouraging automatic agreement or invented context. Replies use no emojis. These are prompt examples, not model-weight fine-tuning. Portfolio facts still come from the generated reference. No scraped comments, usernames, or third-party dialogue datasets are included in the runtime prompt.

Style examples are isolated hypothetical scenes, not chat history. Callbacks and claims about earlier topics must come from the actual supplied conversation; when that context is absent, the assistant should make a fresh joke about the current message instead of inventing a shared memory.

Reply language follows the latest visitor message, including short acknowledgments: “alright thanks” gets English, while “okay sige” gets casual Filipino or Taglish. Earlier conversation language does not override a clear switch. Ambiguous replies such as “haha” use the most recent visitor message with a clear language.

Clearly fictional practice conversations are welcome without repeated identity disclaimers. Questions about capabilities get a short, friendly explanation. Clear override, hidden-prompt extraction, fake-authority, or fabricated-fact requests get one playful acknowledgment in English, Taglish, or casual Filipino, followed by a clear boundary and help with any harmless part. Ordinary detours, quoted security examples, bug reports, and serious topics do not get a gotcha response. Repeated attempts do not escalate into taunting or claims of being unbreakable. These are personality guidelines, not an injection detector or a guarantee against prompt extraction; server-side protections remain separate.

The personality reference also guides reactions: brief situational humor for harmless detours, calm handling of identity-change requests, and honest corrections when wrong. The assistant distinguishes hands-on work from learning or interests and does not guess my personal recommendations.

Longer replies use Markdown headings, selective bold text, spaced paragraphs, lists, and code blocks. Short banter stays conversational. The chat renderer styles these elements while continuing to block raw HTML, images, and links outside the approved catalog.

Multi-item recommendations with descriptions use a separate heading per item, with its explanation and approved links grouped underneath. Short lists can stay compact; quoted source text follows the separate quotation rules below.

The renderer also separates top-level numbered project labels that match the catalog and lays out link-only paragraphs with wrapping gaps. Ordinary inline links, quoted text, and code retain their original structure.

Recognized project sections get verified actions from generated project data: Project details for the portfolio page, Source code only when a repository is published, and Live website only when a website is published. Missing or malformed model action rows are replaced with those destinations. The assistant treats projects without public repositories as case studies, not code the visitor can inspect.

Standalone link actions also use the destination type: Read blog for blog entries, View post for feed posts, and Project details for project pages. The renderer corrects mismatched action labels on approved links while preserving article titles, ordinary prose, and quotations.

Source wording is presented as a complete short quote, a labeled excerpt, or an explicitly introduced summary. Quotes retain their original wording without added bold emphasis; the assistant's commentary and source link stay separate. Bold is reserved for useful emphasis in its own explanations.

References reviewed on October 5, 2026:

| Reference | Use and limits |
| --- | --- |
| [Humanizer](https://github.com/blader/humanizer) (MIT) | Writing reference for cutting filler and preserving voice. No skill or source text is bundled; not a Taglish model or a guarantee of naturalness. |
| [Google conversation design](https://design.google/library/speaking-the-same-language-vui) | Reference for brief, relevant turns and using conversational context. |
| [IBM Carbon writing style](https://github.com/carbon-design-system/carbon-website/blob/main/src/pages/guidelines/content/writing-style.mdx) | Reference for plain wording and contractions. |
| [TweetTaglish research](https://aclanthology.org/2022.lrec-1.225/) | Code-switching research. Its repository distributes tweet IDs and annotations, not a ready-to-use chatbot dialogue set. No tweets imported. |
| [OpenAssistant OASST1](https://huggingface.co/datasets/OpenAssistant/oasst1) (Apache-2.0) | Candidate human-authored conversation dataset if training is explored later; not imported or assumed to match Ronan's voice. |

Public forum discussions were read for context only. Reddit material is not an open training corpus; see its [data access guidance](https://support.reddithelp.com/hc/en-us/articles/14945211791892-Reddit-Developer-Interfaces). Examples here are original, tailored to the requested voice, and keep the project's license.

When changing the voice, check English, Taglish, a request for plain Tagalog, short follow-ups, tone corrections, unknown facts, identity questions, and distress. Check helpfulness and factual accuracy as well as tone; a passing code test cannot prove a model will follow the style on every reply.

`tests/evals/chat-boundaries.json` contains human-reviewed, multi-turn regression cases for prompt reconstruction, legitimate security questions, quoted instructions, private-data questions, and recovery to normal conversation. Run each scenario in a new local chat, in order, and compare actual replies with each turn's criteria. These live checks use API quota and are separate from `npm test`. Boundaries should be brief and friendly without listing internal behavior rules; fictional personal test data should use a fictional person.

### Change the AI provider

Set `AI_PROVIDER` and `AI_MODEL` in `wrangler.jsonc`. Update both the production variables and `env.local.vars` if you want the same setup locally. Keep keys in `.dev.vars.local` for development or encrypted Worker secrets for production.

| `AI_PROVIDER` | API key secret | Endpoint |
| --- | --- | --- |
| `deepseek` | `DEEPSEEK_API_KEY` | DeepSeek API, built in |
| `gemini` | `GEMINI_API_KEY` | Gemini Developer API, built in |
| `openai-compatible` | `AI_API_KEY` | Set `AI_BASE_URL`, including any `/v1` prefix |

The compatible adapter appends `/chat/completions` to the HTTPS base URL. Choose a service/model that supports streaming Chat Completions, system messages, and `max_tokens`. The Gemini adapter uses Gemini 3's low thinking setting. Other API formats or model-specific options may need a change in `worker/chat/providers.ts`; the frontend stays the same. Only the selected provider's key is used, with no automatic fallback. Provider and model names are kept out of the chat UI.

See the [DeepSeek Chat Completions API](https://api-docs.deepseek.com/api/create-chat-completion/) for the default provider's request format.

### How content stays current

Every build generates the assistant reference from `src/data/` and `src/content/blog/`, the same files used by the site. Add or edit a project, post, skill, or blog there, then rebuild. No second knowledge file to maintain. The generated reference stays on the Worker; the browser gets only a public link catalog. Demo engagement counts and visitor posts are excluded. A deployed site needs a new build/deployment to receive your changes.

### Checks without an API key

```sh
npm test                 # Mock AI services and Turnstile; no API quota
npm run typecheck
npm run check:worker
npm run build
npm run deploy:dry-run   # Bundle locally; does not publish
```

Tests cover content generation, request validation, streaming, cancellation, conversation state, and safe links. For a live check, ask about PULSE, Seaversity work, or the first blog, follow a reply link, try a casual question, and test Stop and Retry.

### Production setup, when ready

Hosting uses Workers with Static Assets. Set a real Turnstile site key and allowed public origins in `wrangler.jsonc`, then store the selected provider's API key (`DEEPSEEK_API_KEY` by default), `TURNSTILE_SECRET_KEY`, and a random `RATE_LIMIT_SALT` as encrypted Worker secrets. Production rejects Turnstile testing keys and missing protection. The local environment is only for loopback testing; never deploy it.

After configuring production, authenticate and enter each secret privately at the CLI prompt:

```sh
npx wrangler login
npx wrangler secret put DEEPSEEK_API_KEY --env=""
npx wrangler secret put TURNSTILE_SECRET_KEY --env=""
npx wrangler secret put RATE_LIMIT_SALT --env=""
```

Use the selected provider's secret name if it differs. Generate a fresh random salt for production, rather than using the local example. The empty environment selects the top-level production configuration. These commands update Cloudflare; `.dev.vars.local` remains local.

When ready to publish:

```sh
npm run deploy:dry-run
npx wrangler deploy --env=""
```

Connect the portfolio domain to the Worker, include that hostname in the Turnstile widget configuration, and ensure its origin matches `ALLOWED_ORIGINS`. If testing on a `workers.dev` address, that hostname and origin also need to be configured. The dry run only builds and bundles; it does not verify remote secrets, domain routing, or live Turnstile. Check those on the deployed site.

Requests are limited to 2,000 characters, six completed exchanges in context, and ten requests per minute per salted network identifier. This burst limiter is best-effort and location-local.

### Daily usage limits

The Worker also enforces **50 requests per public IP/network per day** and **1,000 across the whole site per day**, resetting at **midnight Philippine time (UTC+8)**. These limits do not change the assistant's personality, topics, answer length, or provider settings. People sharing a public IP share the network allowance; changing networks can change that allowance, while the site-wide cap still applies.

A single SQLite-backed Durable Object reserves both daily allowances atomically after Turnstile verification and before contacting the AI provider. Rejected requests do not call the provider. Invalid verification does not consume daily allowance. Once reserved, an attempt counts even if it is canceled or the provider fails; retries are new attempts. New chat, reloads, and Worker restarts do not clear the counters. If quota storage is unavailable, chat fails closed while the portfolio stays available.

Only the day, salted network identifiers, and counts are stored for quotas, not raw IP addresses or conversation text. Expired rows are removed by the daily alarm or the next reservation. No server-side message-history storage or application message logging is configured. There is no automatic retry or paid fallback. The daily cap bounds requests, not an exact currency amount; provider token usage and pricing still determine cost.

Configure `CHAT_DAILY_NETWORK_LIMIT` and `CHAT_DAILY_SITE_LIMIT` in `wrangler.jsonc`. Both must be positive integers. The `CHAT_QUOTA` binding and SQLite migration are included for deployment. Local development uses a separate namespace and persisted state under `.wrangler/`; it does not consume production allowance. All loopback visitors share one local network identity. Local quota tests use real SQLite with small limits and never call an AI API.

See [Cloudflare local development](https://developers.cloudflare.com/workers/local-development/) and [Turnstile testing keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).
