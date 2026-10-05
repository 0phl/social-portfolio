// @vitest-environment jsdom
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { afterEach, it, expect, vi } from 'vitest';
import { AssistantMessage } from '../../src/components/chat/AssistantMessage';
afterEach(cleanup);
it('separates plain project labels from adjacent introductions and link rows', () => {
  const { container } = render(<AssistantMessage text={`Here are some projects.
1\\. BetterBacoor

A community guide.

[View project](/#projects/betterbacoor) [Website](https://www.betterbacoor.org/) [Source](https://github.com/0phl/betterbacoor)
2\\. HushMap

A school IoT project.`} onNavigate={vi.fn()} />);
  expect(screen.getByText('Here are some projects.').tagName).toBe('P');
  expect(screen.getByRole('heading', { name: '1. BetterBacoor', level: 3 })).toBeTruthy();
  expect(screen.getByRole('heading', { name: '2. HushMap', level: 3 })).toBeTruthy();
  const row = container.querySelector('.assistant-link-row');
  expect(row?.querySelectorAll('a')).toHaveLength(3);
  expect(row?.nextElementSibling?.textContent).toBe('2. HushMap');
});
it('handles single-item project lists without rewriting quotes, code, or normal steps', () => {
  const { container } = render(<AssistantMessage text={`Intro.

1. BetterBacoor

A guide.

> 2. HushMap

\`\`\`text
3. PULSE
\`\`\`

1. Install dependencies.
2. Start the server.

Read [Projects](/#projects) for more.`} onNavigate={vi.fn()} />);
  expect(screen.getAllByRole('heading')).toHaveLength(1);
  expect(screen.getByRole('heading', { name: '1. BetterBacoor' })).toBeTruthy();
  expect(container.querySelector('blockquote')?.textContent).toContain('HushMap');
  expect(container.querySelector('pre')?.textContent).toContain('3. PULSE');
  expect(container.querySelector('.assistant-link-row')).toBeNull();
  expect(screen.getByText('Install dependencies.').tagName).toBe('LI');
});
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
