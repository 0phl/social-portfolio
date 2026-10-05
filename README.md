# Social Portfolio

My personal portfolio with a social media feel. A place to share my projects, write about my experience, and post things I'm learning. I'm sharing the code so others can build their own version too.

Built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Features

- Profile with an about section, skills, experience, and education.
- Personal and freelance projects with screenshots and detail pages.
- Blog posts written in Markdown.
- A post feed with likes, comments, bookmarks, and sharing.
- Portfolio update notifications and an AI assistant with typing indicators, message sounds, and project links.
- Responsive layouts for desktop and mobile.

Social interactions are browser-side demos and engagement counts are sample data. The AI assistant runs through a Cloudflare Worker and sends messages to the configured AI service, not directly to me. There is no account system.

## Run locally

You'll need Node.js 22 or newer and npm.

```sh
git clone https://github.com/0phl/social-portfolio.git
cd social-portfolio
npm ci
npm run dev
```

Open the local URL shown in the terminal.

This is the frontend-only workflow. Use the local Worker below to test chat.

```sh
npm run build    # Create a production build
npm run preview  # Preview the build locally
```

## Test the AI assistant locally

No Cloudflare deployment is needed. Copy the example secrets file:

```powershell
Copy-Item .dev.vars.example .dev.vars.local
```

Edit `.dev.vars.local` privately and set `DEEPSEEK_API_KEY` to your DeepSeek API key. Keep the included Turnstile testing secret and local salt. This file is ignored by Git. Never put the key in a `VITE_` variable, browser code, or a commit. If the file already exists, edit it rather than copying over it.

```sh
npm run dev:chat
```

Open **http://127.0.0.1:8787**. Wrangler serves the built site and `/api/chat` locally. Real replies still call the configured AI service and use your API quota; verification also needs an internet connection. Without a key, the site works and chat shows a configuration message. Restart this command after changing content or secrets.

The default is `deepseek-flash`, with thinking disabled for shorter response times. Conversations stay in browser memory until reload. Stop and closing the dialog cancel a reply; New chat clears the conversation. Messages are processed under the selected service's data policies, so do not send sensitive information.

The chat shows animated typing dots for 3–5 seconds while a reply loads, then displays the complete message. Slower replies keep the dots visible until ready. Send and receive sounds begin only after interaction; the header's mute button remembers your preference locally. Reduced-motion settings turn the moving dots into a static indicator.

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

Requests are limited to 2,000 characters, six completed exchanges, and five requests per minute per anonymous network identifier. The rate limit is best-effort and location-local, not a global billing cap. There is no automatic retry or paid fallback. No server-side message-history storage or application message logging is configured.

See [Cloudflare local development](https://developers.cloudflare.com/workers/local-development/) and [Turnstile testing keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

## Make it yours

- `src/data/` contains the profile, projects, posts, and blog metadata.
- `src/content/blog/` contains the Markdown blog posts.
- `public/images/` contains profile photos, project screenshots, and blog images.
- `index.html` contains the page title and social sharing metadata.

Replace my personal content, photos, branding, and links with your own. Update `public/social-preview.jpg` and the favicon for your site too.

## License

Licensed under the [MIT License](LICENSE).
