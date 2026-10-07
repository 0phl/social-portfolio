import catalog from '../../.generated/assistant-links.json';
import { normalizeLocation, siteOrigin } from '../routing/paths';

export function approvedLink(href: string) {
  if (href.startsWith('//')) return null;
  let key = href;
  try {
    const url = new URL(href, window.location.origin);
    if ([window.location.origin, siteOrigin].includes(url.origin) && !url.search) key = normalizeLocation(url.pathname, url.hash);
  } catch { return null; }
  return Object.prototype.hasOwnProperty.call(catalog, key) ? key : null;
}
