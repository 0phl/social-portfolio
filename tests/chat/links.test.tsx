// @vitest-environment jsdom
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { afterEach, it, expect, vi } from 'vitest';
import { AssistantMessage } from '../../src/components/chat/AssistantMessage';
afterEach(cleanup);
it('preserves readable Markdown sections, emphasis, steps, and code', () => {
  const { container } = render(<AssistantMessage text={`A little context first.

## Quick setup

Use **one source of truth** for the content.

### Steps

1. Update the content.
2. Rebuild the site.

Run \`npm run build\`.

\`\`\`sh
npm run build
\`\`\`

> Keep your API key on the server.

Final note.`} onNavigate={vi.fn()} />);
  expect(screen.getByRole('heading', { name: 'Quick setup', level: 2 })).toBeTruthy();
  expect(screen.getByRole('heading', { name: 'Steps', level: 3 })).toBeTruthy();
  expect(container.querySelector('strong')?.textContent).toBe('one source of truth');
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(container.querySelector('pre code')?.textContent).toContain('npm run build');
  expect(container.querySelector('blockquote')?.textContent).toContain('Keep your API key on the server.');
  expect(screen.getByText('Final note.').tagName).toBe('P');
});
it('renders only catalog links and normalizes same-origin links', () => {
  const navigate = vi.fn();
  render(<AssistantMessage text={`[Projects](/#projects) [Blog](${location.origin}/#blog/starting-before-i-felt-ready) [Post](/#posts/building-betterbacoor) [Source](https://github.com/0phl) [Bad](/#projects/not-real) [Other](https://example.com) [Script](javascript:alert(1)) [Relative](//example.com) ![Image](https://example.com/image.png) <script>alert(1)</script>`} onNavigate={navigate} />);
  expect(screen.getAllByRole('link')).toHaveLength(4);
  fireEvent.click(screen.getByRole('link', { name: 'Projects' })); expect(navigate).toHaveBeenCalledWith('/#projects');
  expect(screen.getByRole('link', { name: 'Source' }).getAttribute('rel')).toBe('noopener noreferrer');
  expect(document.querySelector('img')).toBeNull(); expect(document.querySelector('script')).toBeNull();
});
