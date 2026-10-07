import { type PageMetadata } from './catalog';
import { siteOrigin } from '../routing/paths';

export function updateMetadata(page: PageMetadata) {
  document.title = page.title;
  const meta = (name: string, content: string, property = false) => {
    const attr = property ? 'property' : 'name';
    let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
    if (!element) { element = document.createElement('meta'); element.setAttribute(attr, name); document.head.append(element); }
    element.content = content;
  };
  meta('description', page.description);
  meta('robots', page.noindex ? 'noindex' : 'index,follow');
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (page.noindex) canonical?.remove();
  else {
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
    canonical.href = siteOrigin + page.path;
  }
  for (const [name, value] of Object.entries({ type: page.type, title: page.title, description: page.description, url: siteOrigin + page.path, image: page.image, 'image:alt': page.imageAlt })) meta(`og:${name}`, value, true);
  for (const [name, value] of Object.entries({ card: 'summary_large_image', title: page.title, description: page.description, image: page.image, 'image:alt': page.imageAlt })) meta(`twitter:${name}`, value);
  let schema = document.getElementById('page-schema');
  if (!schema) { schema = document.createElement('script'); schema.id = 'page-schema'; schema.setAttribute('type', 'application/ld+json'); document.head.append(schema); }
  schema.textContent = JSON.stringify(page.schema);
}
