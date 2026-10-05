// @vitest-environment jsdom
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { afterEach, it, expect, vi } from 'vitest';
import { AssistantMessage } from '../../src/components/chat/AssistantMessage';
afterEach(cleanup);
it('renders only catalog links and normalizes same-origin links', () => {
  const navigate = vi.fn();
  render(<AssistantMessage text={`[Projects](/#projects) [Blog](${location.origin}/#blog/starting-before-i-felt-ready) [Post](/#posts/building-betterbacoor) [Source](https://github.com/0phl) [Bad](/#projects/not-real) [Other](https://example.com) [Script](javascript:alert(1)) [Relative](//example.com) ![Image](https://example.com/image.png) <script>alert(1)</script>`} onNavigate={navigate} />);
  expect(screen.getAllByRole('link')).toHaveLength(4);
  fireEvent.click(screen.getByRole('link', { name: 'Projects' })); expect(navigate).toHaveBeenCalledWith('/#projects');
  expect(screen.getByRole('link', { name: 'Source' }).getAttribute('rel')).toBe('noopener noreferrer');
  expect(document.querySelector('img')).toBeNull(); expect(document.querySelector('script')).toBeNull();
});
