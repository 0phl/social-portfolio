import { describe, expect, it } from 'vitest';
import { buildKnowledge } from '../../src/chat/knowledge';
import { profile } from '../../src/data/profile';
import { experience, education, skillGroups } from '../../src/data/about';
import { projects } from '../../src/data/projects';
import { posts } from '../../src/data/posts';
import { blogPosts } from '../../src/data/blog';

const source = { profile, experience, education, skillGroups, projects, posts, blogPosts };
describe('published portfolio reference', () => {
  it('includes complete content and valid destinations', () => {
    const { reference, links } = buildKnowledge(source);
    expect(reference).toContain('Sole Full-Stack Developer');
    expect(reference).toContain('Hermes Agent');
    for (const project of projects) expect(links[`/#projects/${project.id}`]).toBe(project.title);
    for (const post of posts) expect(links[`/#posts/${post.id}`]).toBeTruthy();
    for (const blog of blogPosts) {
      expect(links[`/#blog/${blog.id}`]).toBe(blog.title);
      const published = JSON.parse(reference).blogs.find((item: { id: string }) => item.id === blog.id);
      for (const block of blog.body) if (block.type !== 'image') expect(published.text).toContain(block.text);
    }
  });
  it('excludes mock engagement and local previews', () => {
    const result = buildKnowledge({ ...source, posts: [...posts, { id: 'private-preview', content: 'LOCAL_ONLY', publishedAt: '2026-10-05', preview: true }] });
    expect(result.reference).not.toMatch(/LOCAL_ONLY|mockStats|engagement|followers/);
    expect(result.links['/#posts/private-preview']).toBeUndefined();
  });
  it('includes newly added projects, posts and blogs without separate configuration', () => {
    const result = buildKnowledge({ ...source,
      projects: [...projects, { ...projects[0], id: 'new-project', title: 'New project' }],
      posts: [...posts, { id: 'new-post', content: 'New story', publishedAt: '2026-10-05' }],
      blogPosts: [...blogPosts, { ...blogPosts[0], id: 'new-blog', title: 'New blog' }],
    });
    expect(result.links['/#projects/new-project']).toBe('New project');
    expect(result.links['/#posts/new-post']).toBeTruthy();
    expect(result.links['/#blog/new-blog']).toBe('New blog');
  });
  it('rejects duplicate routes and oversized references', () => {
    expect(() => buildKnowledge({ ...source, projects: [...projects, projects[0]] })).toThrow(/duplicate/i);
    expect(() => buildKnowledge({ ...source, profile: { ...profile, bio: 'a'.repeat(210_000) } })).toThrow(/too large/i);
  });
});
