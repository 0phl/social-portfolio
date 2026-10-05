# Social Portfolio

My personal portfolio with a social media feel. A place to share my projects, write about my experience, and post things I'm learning. I'm sharing the code so others can build their own version too.

Built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Features

- Profile with an about section, skills, experience, and education.
- Personal and freelance projects with screenshots and detail pages.
- Blog posts written in Markdown.
- A post feed with likes, comments, bookmarks, and sharing.
- Portfolio update notifications and a Gemini AI assistant with streamed replies and project links.
- Responsive layouts for desktop and mobile.

Social interactions are browser-side demos and engagement counts are sample data. The AI assistant runs through a Cloudflare Worker. Messages go to Google Gemini, not directly to me. There is no account system.

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

Edit `.dev.vars.local` privately and set `GEMINI_API_KEY` to your Gemini Developer API key. Keep the included Turnstile testing secret and local salt. This file is ignored by Git. Never put the key in a `VITE_` variable, browser code, or a commit.

```sh
npm run dev:chat
```

Open **http://127.0.0.1:8787**. Wrangler serves the built site and `/api/chat` locally. Real replies still call Google and use your API quota; verification also needs an internet connection. Without a key, the site works and chat shows a configuration message. Restart this command after changing content or secrets.

The assistant uses `gemini-3.8-flash`, configured in `wrangler.jsonc`. It keeps conversations in browser memory until reload. Stop and closing the dialog cancel a reply; New chat clears the conversation. Google may use free-tier messages to improve its products, including human review, so do not send sensitive information.

### How content stays current

Every build generates the assistant reference from `src/data/` and `src/content/blog/`, the same files used by the site. Add or edit a project, post, skill, or blog there, then rebuild. No second knowledge file to maintain. The generated reference stays on the Worker; the browser gets only a public link catalog. Demo engagement counts and visitor posts are excluded. A deployed site needs a new build/deployment to receive your changes.

### Checks without an API key

```sh
npm test                 # Mock Google and Turnstile; no API quota
npm run typecheck
npm run check:worker
npm run build
npm run deploy:dry-run   # Bundle locally; does not publish
```

Tests cover content generation, request validation, streaming, cancellation, conversation state, and safe links. For a live check, ask about PULSE, Seaversity work, or the first blog, follow a reply link, try a casual question, and test Stop and Retry.

### Production setup, when ready

Hosting uses Workers with Static Assets. Set a real Turnstile site key and allowed public origins in `wrangler.jsonc`, then store `GEMINI_API_KEY`, `TURNSTILE_SECRET_KEY`, and a random `RATE_LIMIT_SALT` as encrypted Worker secrets. Production rejects Turnstile testing keys and missing protection. The local environment is only for loopback testing; never deploy it.

Requests are limited to 2,000 characters, six completed exchanges, and five requests per minute per anonymous network identifier. The rate limit is best-effort and location-local, not a global billing cap. There is no automatic retry or paid fallback. No server-side message-history storage or application message logging is configured.

See [Cloudflare local development](https://developers.cloudflare.com/workers/local-development/), [Turnstile testing keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/), and [Gemini API data use](https://ai.google.dev/gemini-api/terms).

## Make it yours

- `src/data/` contains the profile, projects, posts, and blog metadata.
- `src/content/blog/` contains the Markdown blog posts.
- `public/images/` contains profile photos, project screenshots, and blog images.
- `index.html` contains the page title and social sharing metadata.

Replace my personal content, photos, branding, and links with your own. Update `public/social-preview.jpg` and the favicon for your site too.

## License

Licensed under the [MIT License](LICENSE).
