import { createContext, useContext, useSyncExternalStore } from 'react';
import { normalizeLocation } from './paths';

export const InitialPath = createContext('/');
function subscribe(notify: () => void) {
  window.addEventListener('popstate', notify);
  window.addEventListener('hashchange', notify);
  return () => { window.removeEventListener('popstate', notify); window.removeEventListener('hashchange', notify); };
}
export function usePath() {
  const initialPath = useContext(InitialPath);
  return useSyncExternalStore(subscribe, () => normalizeLocation(location.pathname, location.hash), () => initialPath);
}
export function navigate(destination: string, replace = false) {
  const url = new URL(destination, window.location.origin);
  if (url.origin !== window.location.origin) return;
  const next = normalizeLocation(url.pathname, url.hash);
  if (`${location.pathname}${location.hash}` === next && location.search === url.search) return;
  const [path, fragment] = next.split('#');
  window.history[replace ? 'replaceState' : 'pushState'](null, '', `${path}${url.search}${fragment ? `#${fragment}` : ''}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function installNavigation() {
  const migrate = () => {
    const next = normalizeLocation(location.pathname, location.hash);
    if (next !== `${location.pathname}${location.hash}`) {
      const [path, fragment] = next.split('#');
      navigate(`${path}${location.search}${fragment ? `#${fragment}` : ''}`, true);
    }
  };
  migrate();
  window.addEventListener('hashchange', migrate);
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link || link.target || link.hasAttribute('download') || link.getAttribute('href')?.startsWith('#')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || !/^\/(?:$|(?:projects|blog|posts|articles|about)(?:\/|$))/.test(url.pathname)) return;
    event.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  });
}
