import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
try {
  const { pages, notFoundPage, renderHead, renderSitemap, renderPage } = await vite.ssrLoadModule('/src/seo/render.tsx');
  const template = await readFile('dist/index.html', 'utf8');
  for (const page of [...pages, notFoundPage]) {
    const html = template
      .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, () => renderHead(page))
      .replace('<div id="root"></div>', () => `<div id="root" data-route="${page.path}">${renderPage(page.path)}</div>`);
    const file = page.noindex ? 'dist/404.html' : page.path === '/' ? 'dist/index.html' : `dist${page.path}/index.html`;
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
  }
  await writeFile('dist/sitemap.xml', renderSitemap());
  await writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://ronandelacruz.com/sitemap.xml\n');
  console.log(`Prerendered ${pages.length} public pages, a 404 page, robots.txt, and sitemap.xml.`);
} finally { await vite.close(); }
