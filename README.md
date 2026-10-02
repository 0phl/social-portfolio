# Social Portfolio

My personal portfolio with a social media feel. A place to share my projects, write about my experience, and post things I'm learning. I'm sharing the code so others can build their own version too.

Built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Features

- Profile with an about section, skills, experience, and education.
- Personal and freelance projects with screenshots and detail pages.
- Blog posts written in Markdown.
- A post feed with likes, comments, bookmarks, and sharing.
- Portfolio update notifications and a demo chat.
- Responsive layouts for desktop and mobile.

Social interactions are browser-side demos. Engagement counts are sample data, and chat messages aren't sent to me. There is no backend or account system.

## Run locally

You'll need Node.js and npm.

```sh
git clone https://github.com/0phl/social-portfolio.git
cd social-portfolio
npm ci
npm run dev
```

Open the local URL shown in the terminal.

```sh
npm run build    # Create a production build
npm run preview  # Preview the build locally
```

## Make it yours

- `src/data/` contains the profile, projects, posts, and blog metadata.
- `src/content/blog/` contains the Markdown blog posts.
- `public/images/` contains profile photos, project screenshots, and blog images.
- `index.html` contains the page title and social sharing metadata.

Replace my personal content, photos, branding, and links with your own. Update `public/social-preview.jpg` and the favicon for your site too.

## License

Licensed under the [MIT License](LICENSE).
