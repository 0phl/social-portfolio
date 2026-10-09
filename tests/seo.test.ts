import { describe, expect, it } from 'vitest';
import { normalizeLocation } from '../src/routing/paths';
import { getPage, pages, renderHead, renderSitemap } from '../src/seo/catalog';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AboutTab } from '../src/components/profile/AboutTab';
import { experience } from '../src/data/about';
import { posts } from '../src/data/posts';

describe('public SEO routes', () => {
  it.each(posts.filter(post => !post.preview))('describes $id as a personal blog update with its own URL', (post) => {
    const path = `/posts/${post.id}`;
    const page = getPage(path)!;
    const json = renderHead(page).match(/<script id="page-schema" type="application\/ld\+json">(.*?)<\/script>/s)![1];
    const schema = JSON.parse(json);
    expect(schema['@type']).toBe('BlogPosting');
    expect(schema.url).toBe(`https://ronandelacruz.com${path}`);
    expect(schema.mainEntityOfPage).toBe(schema.url);
    expect(schema.author.url).toBe('https://ronandelacruz.com/');
    expect(schema.articleBody).toBeTruthy();
    if (post.publishedAt.length === 10) {
      expect(schema.datePublished).toBe(post.publishedAt);
    } else {
      expect(schema).not.toHaveProperty('datePublished');
    }
    expect(schema).not.toHaveProperty('interactionStatistic');
    expect(schema).not.toHaveProperty('comment');
  });
  it('includes collapsed experience details in the initial HTML', () => {
    const html = renderToStaticMarkup(createElement(AboutTab, { active: true, bioRequest: 0 }));
    for (const role of experience) {
      expect(html).toContain(role.highlights[0]);
      expect(html).toContain(`id="details-${role.id}"`);
    }
    expect(html).toContain('aria-expanded="false"');
  });
  it.each([
    ['/', '#projects/lms-billing', '/projects/lms-billing'],
    ['/', '#articles/starting-before-i-felt-ready', '/blog/starting-before-i-felt-ready'],
    ['/projects/pulse', '#posts', '/'],
    ['/', '#about/skills', '/about#skills'],
    ['/blog/', '', '/blog'],
    ['/posts', '', '/'],
    ['/blog/starting-before-i-felt-ready', '', '/blog/starting-before-i-felt-ready'],
    ['/', '#main-content', '/#main-content'],
  ])('normalizes %s%s without losing the destination', (path, hash, result) => {
    expect(normalizeLocation(path, hash)).toBe(result);
  });
  it('gives each published item its own canonical, title, and relevant description', () => {
    const blog = getPage('/blog/starting-before-i-felt-ready');
    expect(blog?.title).toBe('Starting before I felt ready | Ronan Dela Cruz');
    expect(blog?.description).toContain('intern');
    expect(blog?.image).toContain('graduation');
    expect(getPage('/projects/lms-billing')?.description).toContain('billing');
    expect(getPage('/posts/building-betterbacoor')?.description).toContain('BetterBacoor');
    expect(getPage('/projects/missing')).toBeUndefined();
  });
  it('publishes crawlable paths without local demos or fake precision and metrics', () => {
    const sitemap = renderSitemap();
    expect(sitemap).toContain('<loc>https://ronandelacruz.com/projects/lms-billing</loc>');
    expect(sitemap).toContain('<loc>https://ronandelacruz.com/blog/starting-before-i-felt-ready</loc>');
    expect(sitemap).not.toMatch(/photo-demo|\/#|<lastmod>/);
    const schema = JSON.stringify(pages.map(p => p.schema));
    expect(schema).not.toMatch(/interactionStatistic|userInteractionCount|2026-03-01/);
  });
  it('escapes HTML attributes and JSON script contents', () => {
    const head = renderHead({ ...pages[0], title: '<unsafe> "title"', description: '" onload="bad', schema: { text: '</script><script>bad()</script>' } });
    expect(head).toContain('&lt;unsafe&gt;');
    expect(head).not.toContain('</script><script>bad');
    expect(head).toContain('\\u003c/script>');
  });
});
