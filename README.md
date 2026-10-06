# Social Portfolio

My personal portfolio with a social media feel. A place to share my projects, write about my experience, and post things I'm learning. I'm sharing the code so others can build their own version too.

Built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion. The AI assistant runs through Cloudflare Workers with Static Assets.

## Features

- Profile, skills, experience, and education.
- Professional, freelance, and personal projects with screenshots and detail pages.
- Markdown blog posts and a social post feed.
- Demo likes, comments, bookmarks, sharing, and portfolio update notifications.
- An AI portfolio assistant with project links, typing indicators, and message sounds.
- Responsive layouts for desktop and mobile.

Social interactions are browser-side demos, and engagement counts are sample data. There is no account system. AI messages go to the configured AI service, not directly to me; chat history stays in browser memory until reload.

## Run locally

Use Node.js 22.13 or newer and npm. Run commands from the repository root.

```sh
git clone https://github.com/0phl/social-portfolio.git
cd social-portfolio
npm ci
```

| Command | What it runs |
| --- | --- |
| `npm run dev` | Frontend development server; the AI chat API is unavailable here. |
| `npm run dev:chat` | Built frontend and local Worker at http://127.0.0.1:8787, including AI chat. |
| `npm run build` | Generates assistant content and builds the frontend. |
| `npm run preview` | Previews the frontend build only; no chat API. |

For chat, create `.dev.vars.local` from `.dev.vars.example` only if it does not already exist, then add your `DEEPSEEK_API_KEY` privately. Keep the supplied local Turnstile testing values. Never commit real keys or put them in a `VITE_` variable.

```sh
npm run dev:chat
```

Open **http://127.0.0.1:8787**. No deployment is needed. Live replies use API quota and require internet. Restart this command after editing frontend content or secrets. See the [AI assistant guide](docs/ai-assistant.md) for setup, provider choices, voice, and limitations.

## Project structure

| Location | Purpose |
| --- | --- |
| `src/components/`, `src/pages/`, `src/hooks/` | Portfolio UI and navigation. |
| `src/data/`, `src/content/blog/` | Profile, projects, posts, and blog content. |
| `src/chat/` | Browser chat state, streaming, safe links, and shared knowledge generation. |
| `worker/` | Chat API, provider adapters, request protection, and assistant instructions. |
| `scripts/` | Generates the assistant reference from published portfolio content. |
| `public/` | Images, branding, favicon, and social preview. |
| `tests/` | Automated tests and human-reviewed live conversation cases. |
| `docs/` | Assistant guide and implementation notes. |

`.generated/`, `dist/`, and `.wrangler/` are generated locally and ignored by Git. The assistant reference is bundled only into the Worker; the browser receives public link catalogs. Updating portfolio content and rebuilding updates the assistant too.

## Checks

```sh
npm run lint
npm test
npm run typecheck
npm run check:worker
npm run deploy:dry-run
```

These checks need no AI key or API quota. The dry run builds both the frontend and Worker without publishing. Live behavior checks are documented in the [assistant guide](docs/ai-assistant.md).

Chat allows 50 messages per public IP/network per day and 1,000 across the site, resetting at midnight Philippine time. Server-side counters survive New chat and reloads. See [daily usage limits](docs/ai-assistant.md#daily-usage-limits) for configuration and shared-network behavior.

## Deploy

Hosted on **Cloudflare Workers with Static Assets** at [ronandelacruz.com](https://ronandelacruz.com). The production configuration connects both the root domain and `www`.

To publish an update after running the checks:

```sh
npm run deploy
```

This rebuilds the site and assistant knowledge before deploying. Pushing to GitHub alone does not deploy the site.

When setting up your own deployment:

1. Set the real Turnstile site key and allowed portfolio origins in the top-level production configuration in `wrangler.jsonc`.
2. Store the selected provider key, `TURNSTILE_SECRET_KEY`, and a random `RATE_LIMIT_SALT` as Cloudflare Worker secrets. Local secrets are not uploaded automatically.
3. Run the checks above, deploy the production Worker, and connect the domain configured in `index.html` and `wrangler.jsonc`.
4. Check a live chat reply, verification, project links, and mobile layout on the deployed domain.

The production Turnstile widget is configured for the portfolio domains. Chat intentionally stays unavailable if required production protection or secrets are missing. Never deploy the `local` environment or use its testing keys in production. See [production setup](docs/ai-assistant.md#production-setup) for commands and limits. If adapting this repository, replace the account ID, domain routes, allowed origins, and public Turnstile site key with your own values.

## Make it yours

Post photos use an `images` array in `src/data/posts.ts`, with `src`, `alt`, `width`, and `height` for each image. The feed shows up to five tiles, arranged by the first image's orientation, with a remaining-photo count on larger albums. Feed previews fill their tiles with crops; portrait collages stay compact (at most 420px tall), and tall screenshots favor the upper content in their crops. Clicking opens the complete image in a viewer with arrows, thumbnails, swipe navigation, and keyboard controls (Left/Right and Escape). Choose **Start a post** for samples with **3, 5, or 10 photos**, or open `/?photo-demo=3#posts/photo-demo`, `/?photo-demo=5#posts/photo-demo-5`, or `/?photo-demo=10#posts/photo-demo-10`. Samples are local previews and are excluded from published posts and chatbot knowledge.

Replace my content in `src/data/` and `src/content/blog/`, and my images and branding in `public/`. Update `index.html`, `public/social-preview.jpg`, the favicon, and the domain settings for your site.

## License

Licensed under the [MIT License](LICENSE).
