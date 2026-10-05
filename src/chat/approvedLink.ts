import catalog from '../../.generated/assistant-links.json';

export function approvedLink(href: string) {
  if (href.startsWith('//')) return null;
  let key = href;
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin === window.location.origin && url.pathname === '/' && !url.search) key = `/${url.hash}`;
  } catch { return null; }
  return Object.prototype.hasOwnProperty.call(catalog, key) ? key : null;
}
