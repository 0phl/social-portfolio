import startingBeforeReady from '../content/blog/starting-before-i-felt-ready.md?raw';
import iKnewTheProblem from '../content/blog/i-knew-the-problem.md?raw';

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

function parseBody(markdown: string): BlogBlock[] {
  return markdown.trim().split(/\r?\n\s*\r?\n/).slice(1).map((block) => {
    const image = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) return { type: 'image', alt: image[1], src: image[2], width: 1200, height: 1800 };
    if (block.startsWith('## ')) return { type: 'heading', text: block.slice(3) };
    return { type: 'paragraph', text: block };
  });
}

function readTime(body: BlogBlock[]) {
  const wordCount = body.reduce((count, block) => count + (block.type === 'image' ? 0 : block.text.split(/\s+/).length), 0);
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

const startingBody = parseBody(startingBeforeReady);
const launcherBody = parseBody(iKnewTheProblem);

export const launcherBlogCover = {
  src: '/images/blog/i-knew-the-problem/claude-code-ronan-launcher.png',
  alt: 'Claude Code logo and name beside Ronan Launcher, with a prompt reading “Here’s how I want it to work…” and an arrow pointing to the app.',
  width: 1672,
  height: 940,
};

export const blogPosts: BlogPost[] = [{
  id: 'i-knew-the-problem',
  title: 'I Knew the Problem. AI Helped Me Build the Solution.',
  excerpt: 'How I used Claude Code to build Ronan Launcher around my own workflow, and what the experience taught me about solving problems with AI.',
  publishedAt: '2026-10-26',
  readTime: readTime(launcherBody),
  cover: launcherBlogCover,
  tags: ['Personal', 'AI', 'Claude Code', 'Ronan Launcher'],
  body: launcherBody,
}, {
  id: 'starting-before-i-felt-ready',
  title: 'Starting before I felt ready',
  excerpt: 'I finished college without feeling completely ready for real work. This is how I started as an IT intern and slowly became a server administrator.',
  publishedAt: '2026-08-18',
  readTime: readTime(startingBody),
  cover: {
    src: '/images/blog/starting-before-i-felt-ready/graduation-1600.jpg',
    alt: 'Ronan in his graduation gown, holding his cap up outside a building.',
    width: 1600,
    height: 1067,
  },
  tags: ['Personal', 'College', 'Career'],
  body: startingBody,
}];

export function formatBlogDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: date.length === 7 ? undefined : 'numeric', year: 'numeric', timeZone: 'UTC' });
}
