export const siteOrigin = 'https://ronandelacruz.com';

// Hash content routes were used by the first release. Keep shared links working.
export function normalizeLocation(pathname: string, hash = ''): string {
  const legacy = hash.match(/^#(posts|projects|blog|articles|about)(?:\/([^#?]+))?$/);
  let path = legacy ? `/${legacy[1]}${legacy[2] ? `/${legacy[2]}` : ''}` : pathname;
  let fragment = legacy ? '' : hash;
  path = path.replace(/\/+$/, '') || '/';
  path = path.replace(/^\/articles(?=\/|$)/, '/blog');
  const about = path.match(/^\/about\/(bio|skills|experience)$/);
  if (about) { path = '/about'; fragment = `#${about[1]}`; }
  if (path === '/posts') path = '/';
  return path + fragment;
}

export function normalizeDestination(destination: string, origin = siteOrigin) {
  const url = new URL(destination, origin);
  return normalizeLocation(url.pathname, url.hash);
}
