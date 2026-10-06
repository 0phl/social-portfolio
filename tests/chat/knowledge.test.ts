import { describe, expect, it } from 'vitest';
import { buildKnowledge } from '../../src/chat/knowledge';
import { profile } from '../../src/data/profile';
import { experience, education, skillGroups } from '../../src/data/about';
import { projects } from '../../src/data/projects';
import { posts } from '../../src/data/posts';
import { blogPosts } from '../../src/data/blog';

const source = { profile, experience, education, skillGroups, projects, posts, blogPosts };
const recencyPosts = posts.filter((post) => ['building-betterbacoor', 'a-portfolio-with-personality', 'automating-lms-provisioning'].includes(post.id));
describe('published portfolio reference', () => {
  it('identifies the latest post by publication date regardless of source order or title', () => {
    for (const ordered of [recencyPosts, [...recencyPosts].reverse()]) {
      const reference = JSON.parse(buildKnowledge({ ...source, posts: ordered }).reference);
      expect(reference.recency.latestPost).toMatchObject({
        id: 'building-betterbacoor', publishedAt: '2026-09-28', url: '/#posts/building-betterbacoor',
      });
      expect(reference.posts[0].id).toBe('building-betterbacoor');
      expect(reference.posts[0].title).toBe(posts.find((post) => post.id === 'building-betterbacoor')?.content.split('\n')[0]);
      expect(reference.posts.at(-1).id).toBe('automating-lms-provisioning');
    }
  });
  it('refreshes recency for new content while keeping previews and blog dates separate', () => {
    const reference = JSON.parse(buildKnowledge({ ...source,
      posts: [
        { id: 'preview', content: 'Not published', publishedAt: '2030-01-01', preview: true },
        { id: 'newest-post', content: 'New update', publishedAt: '2026-10-06' },
        ...recencyPosts,
      ],
      blogPosts: [{ ...blogPosts[0], publishedAt: '2026-08-18' }, { ...blogPosts[0], id: 'newest-blog', title: 'Another blog', publishedAt: '2026-10-07' }],
    }).reference);
    expect(reference.recency.latestPost.id).toBe('newest-post');
    expect(reference.recency.latestBlog.id).toBe('newest-blog');
    expect(reference.blogs[0].id).toBe('newest-blog');
  });
  it('does not invent latest content for empty catalogs and rejects invalid publication dates', () => {
    const reference = JSON.parse(buildKnowledge({ ...source, posts: [], blogPosts: [] }).reference);
    expect(reference.recency.latestPost).toBeNull();
    expect(reference.recency.latestBlog).toBeNull();
    expect(() => buildKnowledge({ ...source, posts: [{ id: 'bad-date', content: 'Invalid', publishedAt: 'unknown' }] })).toThrow(/publication date/i);
  });
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
    expect(result.reference).not.toContain('LOCAL_ONLY');
    const published = JSON.parse(result.reference);
    expect(published.profile).not.toHaveProperty('mockStats');
    expect(published.profile).not.toHaveProperty('followers');
    for (const post of published.posts) expect(post).not.toHaveProperty('engagement');
    expect(result.links['/#posts/private-preview']).toBeUndefined();
  });
  it('includes newly added projects, posts and blogs without separate configuration', () => {
    const result = buildKnowledge({ ...source,
      projects: [...projects, { ...projects[0], id: 'new-project', title: 'New project' }],
      posts: [...posts, { id: 'new-post', content: 'New story', publishedAt: '2026-10-05' }],
      blogPosts: [...blogPosts, { ...blogPosts[0], id: 'new-blog', title: 'New blog' }],
    });
    expect(result.links['/#projects/new-project']).toBe('New project');
    expect(result.projectLinks.find((project) => project.title === 'New project')?.url).toBe('/#projects/new-project');
    expect(result.links['/#posts/new-post']).toBeTruthy();
    expect(result.links['/#blog/new-blog']).toBe('New blog');
  });
  it('publishes separate detail, repository, and website destinations without inventing access', () => {
    const { projectLinks } = buildKnowledge(source);
    for (const project of projects) {
      expect(projectLinks.find((item) => item.url === `/#projects/${project.id}`)).toEqual({
        title: project.title, url: `/#projects/${project.id}`, repository: project.repository, website: project.website,
      });
    }
    expect(projectLinks.find((item) => item.url === '/#projects/lms-billing')?.repository).toBeUndefined();
  });
  it('rejects duplicate routes and oversized references', () => {
    expect(() => buildKnowledge({ ...source, projects: [...projects, projects[0]] })).toThrow(/duplicate/i);
    expect(() => buildKnowledge({ ...source, profile: { ...profile, bio: 'a'.repeat(210_000) } })).toThrow(/too large/i);
  });
});
