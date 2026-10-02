export interface Post {
  id: string;
  content: string;
  publishedAt: string;
  preview?: boolean;
}

export const posts: Post[] = [
  {
    id: 'building-social-portfolio',
    publishedAt: '2026-10-02',
    content: "I'm building a little home for my projects and the things I learn along the way.\n\nI wanted it to feel like a social profile: a place for quick updates, projects, and longer write-ups, alongside a bit about me.\n\nThis is my personal portfolio, and I'm making the code open source so others can adapt it too. One small step at a time.",
  },
];
