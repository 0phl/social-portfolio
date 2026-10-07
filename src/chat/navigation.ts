import { navigate } from '../routing/navigation';
import { normalizeDestination } from '../routing/paths';

export function navigateFromChat(destination: string) {
  const path = normalizeDestination(destination);
  const changed = `${location.pathname}${location.hash}` !== path;
  const [pathname, fragment] = path.split('#');
  const [section = 'posts', itemId] = pathname.slice(1).split('/');
  const id = section === 'about' ? fragment : itemId;
  const detail = Boolean(id && ['projects', 'blog'].includes(section));
  navigate(path);
  // Detail pages already announce their heading when the route changes.
  if (changed && detail) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const target = detail ? document.querySelector<HTMLElement>('#main-content h1[tabindex="-1"]') : document.getElementById(section === 'posts' && id ? `post-${id}` : section === 'about' && id ? `about-${id}` : `panel-${section || 'posts'}`);
    target?.focus({ preventScroll: true }); target?.scrollIntoView({ block: 'start' });
  }));
}
