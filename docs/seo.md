# Portfolio SEO

Content remains in `src/data` and `src/content`. The build renders the existing React components into static HTML, then React hydrates that HTML to enable the interactive portfolio. The visual design is unchanged.

## Generated pages

- `/`: published post feed and profile.
- `/projects` and `/projects/:id`: project catalog and details.
- `/blog` and `/blog/:id`: blog catalog and complete articles.
- `/posts/:id`: individual published posts.
- `/about`: biography, skills, and experience, with `#bio`, `#skills`, and `#experience` anchors.

`src/seo/catalog.ts` derives titles, descriptions, canonical URLs, social preview images, and structured data from published content. The build generates `robots.txt`, `sitemap.xml`, the public route manifest, and a noindex 404 page. No manual sitemap updates are needed after adding content.

Profile pages use Person/ProfilePage structured data. Articles and personal feed updates use BlogPosting; the social-style layout is not a user-generated forum, so it does not use SocialMediaPosting or DiscussionForumPosting. Each feed update includes its own URL. Mock engagement counts and local photo demos are excluded from structured data. Known calendar dates are retained without invented times; month-only dates stay visible but are omitted from datePublished rather than expanded into invented days.

This follows Google's [forum content guidelines](https://developers.google.com/search/docs/appearance/structured-data/discussion-forum#content-guidelines) and [publication date guidance](https://developers.google.com/search/docs/appearance/publication-dates#best-practices). Article publication dates are recommended, not required; see the [Article reference](https://developers.google.com/search/docs/appearance/structured-data/article).

## Navigation and delivery

The Worker serves each page's generated HTML and returns HTTP 404 for unknown pages. It redirects `www` to `ronandelacruz.com`, normalizes trailing slashes and `/index.html`, and retains legacy aliases. Old hash links migrate in the browser because URL fragments are never sent to the server.

Navigation and chatbot links use clean paths. Client navigation updates the title, canonical URL, metadata, and structured data. Legacy photo-demo query URLs retain an `X-Robots-Tag: noindex` response header and stay out of the sitemap; they no longer load sample posts.

The Worker runs before assets to apply routing and canonical-host redirects; these requests count toward Workers request usage. Public files are still delivered through the Static Assets binding. Chat protections and quotas are unchanged.

## Check locally

```sh
npm test
npm run build
npm run check:seo
npm run dev:chat
```

`check:seo` validates the built HTML, distinct titles, canonical links, metadata, structured data, sitemap, and 404 page. It requires a fresh build. Visit a project or article directly, then try browser Back/Forward and an old hash link. Use the local Worker to test redirects and HTTP status codes; Vite's frontend-only server does not emulate Worker routing.

## After deployment

1. Verify `ronandelacruz.com` in Google Search Console using Ronan's Google account.
2. Submit `https://ronandelacruz.com/sitemap.xml`.
3. Inspect the homepage and a project/article URL to confirm Google can retrieve their HTML and canonical URLs.
4. Review indexing and Core Web Vitals reports as data becomes available.

After deploying a structured-data correction, inspect an affected URL with **Test live URL** and Google's Rich Results Test. Then select **Validate fix** in the relevant Search Console issue report. Reports reflect Google's crawled copy and can remain unchanged until recrawling/validation finishes. Removing inappropriate forum markup means these pages should no longer be counted as discussion-forum items; it does not remove the pages from search.

Search Console verification and submission are separate account setup steps. Prerendering and a sitemap help discovery; they do not guarantee indexing or rankings.
