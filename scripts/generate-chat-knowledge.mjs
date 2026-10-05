import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const [{ buildKnowledge }, { profile }, about, { projects }, { posts }, { blogPosts }] = await Promise.all([
    vite.ssrLoadModule('/src/chat/knowledge.ts'), vite.ssrLoadModule('/src/data/profile.ts'),
    vite.ssrLoadModule('/src/data/about.ts'), vite.ssrLoadModule('/src/data/projects.ts'),
    vite.ssrLoadModule('/src/data/posts.ts'), vite.ssrLoadModule('/src/data/blog.ts'),
  ]);
  const knowledge = buildKnowledge({ profile, ...about, projects, posts, blogPosts });
  await mkdir('.generated', { recursive: true });
  await writeFile('.generated/assistant-knowledge.json', JSON.stringify(knowledge));
  await writeFile('.generated/assistant-links.json', JSON.stringify(knowledge.links));
  console.log(`Assistant reference generated: ${projects.length} projects, ${posts.filter(p => !p.preview).length} posts, ${blogPosts.length} blogs.`);
} finally {
  await vite.close();
}
