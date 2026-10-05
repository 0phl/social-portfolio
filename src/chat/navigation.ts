export function navigateFromChat(destination: string) {
  const hash = destination.slice(1);
  const changed = window.location.hash !== hash;
  const [section, id] = hash.slice(1).split('/');
  const detail = Boolean(id && ['projects', 'blog'].includes(section));
  window.location.hash = hash;
  // Detail pages already announce their heading when the route changes.
  if (changed && detail) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const target = detail ? document.querySelector<HTMLElement>('#main-content h1[tabindex="-1"]') : document.getElementById(section === 'posts' && id ? `post-${id}` : section === 'about' && id ? `about-${id}` : `panel-${section}`);
    target?.focus({ preventScroll: true }); target?.scrollIntoView({ block: 'start' });
  }));
}
