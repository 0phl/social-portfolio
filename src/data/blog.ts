import startingBeforeReady from '../content/blog/starting-before-i-felt-ready.md?raw';

export type BlogBlock =
  | { type: 'heading' | 'paragraph'; text: string }
  | { type: 'image'; src: string; alt: string; width: number; height: number };

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  cover: { src: string; alt: string; width: number; height: number };
  tags: string[];
  body: BlogBlock[];
}

const body: BlogBlock[] = startingBeforeReady.trim().split(/\r?\n\s*\r?\n/).slice(1).map((block) => {
  const image = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (image) return { type: 'image', alt: image[1], src: image[2], width: 1200, height: 1800 };
  if (block.startsWith('## ')) return { type: 'heading', text: block.slice(3) };
  return { type: 'paragraph', text: block };
});
const wordCount = body.reduce((count, block) => count + (block.type === 'image' ? 0 : block.text.split(/\s+/).length), 0);

export const blogPosts: BlogPost[] = [{
  id: 'starting-before-i-felt-ready',
  title: 'Starting before I felt ready',
  excerpt: 'I finished college without feeling completely ready for real work. This is how I started as an IT intern and slowly became a server administrator.',
  publishedAt: '2026-10-02',
  readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
  cover: {
    src: '/images/blog/starting-before-i-felt-ready/graduation-1600.jpg',
    alt: 'Ronan in his graduation gown, holding his cap up outside a building.',
    width: 1600,
    height: 1067,
  },
  tags: ['Personal', 'College', 'Career'],
  body,
}];

export function formatBlogDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
