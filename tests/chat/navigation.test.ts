// @vitest-environment jsdom
import { afterEach, it, expect, vi } from 'vitest';
import { navigateFromChat } from '../../src/chat/navigation';
afterEach(() => { vi.unstubAllGlobals(); document.body.innerHTML = ''; });
it.each(['projects/pulse', 'blog/starting-before-i-felt-ready'])('preserves destination heading focus for %s', (path) => {
  location.hash = '#posts';
  const frame = vi.fn(); vi.stubGlobal('requestAnimationFrame', frame);
  navigateFromChat(`/#${path}`);
  expect(location.hash).toBe(`#${path}`);
  expect(frame).not.toHaveBeenCalled();
});
it('explicitly focuses and scrolls a repeated post link', () => {
  document.body.innerHTML = '<article id="post-example" tabindex="-1"></article>';
  const post = document.getElementById('post-example');
  if (!post) throw new Error('fixture missing');
  post.scrollIntoView = vi.fn();
  vi.stubGlobal('requestAnimationFrame', (callback: () => void) => { callback(); return 1; });
  location.hash = '#posts/example'; navigateFromChat('/#posts/example');
  expect(document.activeElement).toBe(post); expect(post.scrollIntoView).toHaveBeenCalled();
});
