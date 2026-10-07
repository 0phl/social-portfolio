// @vitest-environment jsdom
import { afterEach, beforeAll, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Router } from '../src/routing/Router';
import { installNavigation, navigate, usePath } from '../src/routing/navigation';
import { approvedLink } from '../src/chat/approvedLink';

beforeAll(installNavigation);
afterEach(cleanup);
function Location() { return <output data-testid="path">{usePath()}</output>; }

it('updates the selected route through links and browser Back/Forward', async () => {
  history.replaceState(null, '', '/');
  render(<Router path="/"><Location /><a href="/projects/lms-billing">Billing</a></Router>);
  fireEvent.click(screen.getByRole('link', { name: 'Billing' }));
  expect(screen.getByTestId('path').textContent).toBe('/projects/lms-billing');
  act(() => history.back());
  await waitFor(() => expect(screen.getByTestId('path').textContent).toBe('/'));
  act(() => history.forward());
  await waitFor(() => expect(screen.getByTestId('path').textContent).toBe('/projects/lms-billing'));
});

it('migrates legacy bookmarks while retaining query parameters and section anchors', () => {
  history.replaceState(null, '', '/?ref=share#about/skills');
  fireEvent(window, new HashChangeEvent('hashchange'));
  expect(location.pathname + location.search + location.hash).toBe('/about?ref=share#skills');
  navigate('https://example.com/projects');
  expect(location.pathname).toBe('/about');
});

it('accepts old approved chatbot destinations without allowing unlisted links', () => {
  expect(approvedLink('/#projects/lms-billing')).toBe('/projects/lms-billing');
  expect(approvedLink('https://ronandelacruz.com/#blog/starting-before-i-felt-ready')).toBe('/blog/starting-before-i-felt-ready');
  expect(approvedLink('/#projects/not-real')).toBeNull();
});
