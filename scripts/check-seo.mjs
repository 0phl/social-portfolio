import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const routes = JSON.parse(await readFile('.generated/site-routes.json', 'utf8'));
assert.equal(new Set(routes).size, routes.length, 'Public paths must be unique');
const sitemap = new JSDOM(await readFile('dist/sitemap.xml', 'utf8'), { contentType: 'text/xml' }).window.document;
assert.deepEqual([...sitemap.querySelectorAll('loc')].map(node => new URL(node.textContent).pathname), routes);
assert.match(await readFile('dist/robots.txt', 'utf8'), /Sitemap: https:\/\/ronandelacruz.com\/sitemap.xml/);
const titles = new Set();
for (const path of routes) {
  const file = path === '/' ? 'dist/index.html' : `dist${path}/index.html`;
  const dom = new JSDOM(await readFile(file, 'utf8'));
  const doc = dom.window.document;
  assert.equal(doc.querySelector('#root').dataset.route, path);
  assert.ok(doc.querySelector('#main-content').textContent.length > 100, `${path}: missing prerendered content`);
  assert.equal(doc.querySelectorAll('title').length, 1);
  assert.ok(!titles.has(doc.title), `${path}: duplicate title`); titles.add(doc.title);
  assert.equal(doc.querySelectorAll('link[rel="canonical"]').length, 1);
  assert.equal(doc.querySelector('link[rel="canonical"]').href, `https://ronandelacruz.com${path}`);
  assert.equal(doc.querySelector('meta[property="og:title"]').content, doc.title);
  assert.ok(doc.querySelector('meta[name="description"]').content.length > 20);
  const schema = JSON.parse(doc.querySelector('#page-schema').textContent);
  assert.ok(schema['@type']);
  assert.ok(!['SocialMediaPosting', 'DiscussionForumPosting'].includes(schema['@type']), `${path}: personal content must not use forum markup`);
  if (path === '/projects') {
    for (const card of doc.querySelectorAll('#project-results > div')) assert.notEqual(card.style.opacity, '0');
  }
  if (path === '/projects/lms-billing') assert.equal(doc.querySelector('h1').textContent, 'LMS Billing');
  if (path === '/blog/starting-before-i-felt-ready') assert.equal(doc.querySelector('h1').textContent, 'Starting before I felt ready');
  if (path.startsWith('/posts/')) {
    assert.equal(doc.querySelectorAll('article[id^="post-"]').length, 1);
    assert.equal(schema['@type'], 'BlogPosting');
    assert.equal(schema.url, `https://ronandelacruz.com${path}`);
    assert.equal(schema.mainEntityOfPage, schema.url);
    assert.ok(schema.articleBody);
    assert.equal(schema.interactionStatistic, undefined, 'Demo engagement must not enter structured data');
    if (schema.datePublished) {
      const visibleDate = doc.querySelector('article[id^="post-"] time');
      assert.equal(schema.datePublished, visibleDate?.getAttribute('datetime'), `${path}: publication date must match visible content`);
    }
  }
  if (path === '/about') {
    const details = doc.querySelectorAll('[id^="details-seaversity-"]');
    assert.ok(details.length > 0);
    for (const role of details) {
      assert.ok(role.textContent.includes('Highlights'), 'Experience details missing from initial HTML');
      assert.equal(role.querySelector('[aria-hidden]')?.getAttribute('aria-hidden'), 'true');
    }
  }
  dom.window.close();
}
const missing = new JSDOM(await readFile('dist/404.html', 'utf8')).window.document;
assert.equal(missing.querySelector('h1').textContent, 'Page not found');
assert.equal(missing.querySelector('meta[name="robots"]').content, 'noindex');
assert.equal(missing.querySelector('link[rel="canonical"]'), null);
console.log(`Verified HTML, metadata, structured data, and sitemap for ${routes.length} pages, plus the 404 page.`);
