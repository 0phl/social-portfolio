import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { posts } from '../data/posts';
import { blogPosts } from '../data/blog';
import { siteOrigin } from '../routing/paths';

export interface PageMetadata {
  path: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  type: 'website' | 'article';
  schema: object;
  noindex?: boolean;
}
const absolute = (path: string) => new URL(path, siteOrigin).href;
const person = { '@type': 'Person', '@id': `${siteOrigin}/#person`, name: profile.name, url: `${siteOrigin}/`, image: absolute(profile.avatar), jobTitle: profile.title, sameAs: Object.values(profile.links) };
const summary = (text: string) => {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length <= 180 ? flat : `${flat.slice(0, 177).replace(/\s+\S*$/, '')}…`;
};
const base = (path: string, title: string, description: string): PageMetadata => ({ path, title, description: summary(description), image: absolute('/social-preview.jpg'), imageAlt: `${profile.name} — ${profile.title}`, type: 'website', schema: { '@context': 'https://schema.org', '@type': 'WebPage', url: absolute(path), name: title, description: summary(description), about: person } });

export const pages: PageMetadata[] = [
  { ...base('/', `${profile.name} | ${profile.title}`, profile.bio), schema: { '@context': 'https://schema.org', '@type': 'ProfilePage', url: `${siteOrigin}/`, mainEntity: person } },
  base('/projects', `Projects | ${profile.name}`, 'Explore my professional and personal projects, including full-stack applications, Linux infrastructure, Moodle integrations, and AI chatbots.'),
  base('/blog', `Blog | ${profile.name}`, 'My experiences, things I learn, and life outside the code.'),
  { ...base('/about', `About | ${profile.name}`, profile.about.join(' ')), schema: { '@context': 'https://schema.org', '@type': 'ProfilePage', url: `${siteOrigin}/about`, mainEntity: person } },
  ...projects.map((project) => {
    const page = base(`/projects/${project.id}`, `${project.title} | ${profile.name}`, project.description);
    const image = project.images[0];
    return { ...page, ...(image ? { image: absolute(image.src), imageAlt: image.alt } : {}) };
  }),
  ...blogPosts.map((post) => {
    const page = base(`/blog/${post.id}`, `${post.title} | ${profile.name}`, post.excerpt);
    return { ...page, type: 'article' as const, image: absolute(post.cover.src), imageAlt: post.cover.alt, schema: { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt, image: absolute(post.cover.src), datePublished: post.publishedAt, author: person, mainEntityOfPage: absolute(page.path) } };
  }),
  ...posts.filter(post => !post.preview).map((post) => {
    const blog = blogPosts.find(blog => blog.id === post.blogPostId);
    const project = projects.find(project => project.id === post.projectId);
    const title = post.title ?? (post.content.split('\n')[0] || blog?.title || 'Portfolio update');
    const page = base(`/posts/${post.id}`, `${title} — Post | ${profile.name}`, post.content || blog?.excerpt || profile.bio);
    const image = post.images?.[0] ?? project?.images[0] ?? blog?.cover;
    // These are Ronan's own updates, not user-generated forum discussions.
    return { ...page, ...(image ? { image: absolute(image.src), imageAlt: image.alt } : {}), type: 'article' as const, schema: { '@context': 'https://schema.org', '@type': 'BlogPosting', url: absolute(page.path), headline: title, articleBody: post.content || blog?.excerpt, author: person, mainEntityOfPage: absolute(page.path), ...(post.publishedAt.length === 10 ? { datePublished: post.publishedAt } : {}) } };
  }),
];
export const notFoundPage: PageMetadata = { ...base('/404', `Page not found | ${profile.name}`, 'This page could not be found. Explore Ronan’s projects, posts, and blog.'), noindex: true };
export function getPage(path: string) { return pages.find(page => page.path === path.split('#')[0]); }
export const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char);
export function renderHead(page: PageMetadata) {
  const meta = (key: string, content: string, property = false) => `<meta ${property ? 'property' : 'name'}="${key}" content="${escapeHtml(content)}" />`;
  return [
    `<title>${escapeHtml(page.title)}</title>`, meta('description', page.description),
    ...(page.noindex ? [meta('robots', 'noindex')] : [`<link rel="canonical" href="${absolute(page.path)}" />`]),
    meta('og:type', page.type, true), meta('og:site_name', profile.name, true), meta('og:title', page.title, true), meta('og:description', page.description, true), meta('og:url', absolute(page.path), true), meta('og:image', page.image, true), meta('og:image:alt', page.imageAlt, true),
    meta('twitter:card', 'summary_large_image'), meta('twitter:title', page.title), meta('twitter:description', page.description), meta('twitter:image', page.image), meta('twitter:image:alt', page.imageAlt),
    `<script id="page-schema" type="application/ld+json">${JSON.stringify(page.schema).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}
export function renderSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page => `  <url><loc>${escapeHtml(absolute(page.path))}</loc></url>`).join('\n')}\n</urlset>\n`;
}
