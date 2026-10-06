// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { PostMedia } from '../src/components/posts/PostMedia';
import type { Post } from '../src/data/posts';

const post: Post = {
  id: 'photos', content: 'A photo story.', publishedAt: '2026-03',
  images: Array.from({ length: 6 }, (_, i) => ({ src: `/photo-${i}.png`, alt: `Scene ${i + 1}`, width: 800, height: 600 })),
};
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});
afterEach(cleanup);

it('opens the clicked photo, reaches hidden photos, and navigates with arrows and thumbnails', () => {
  render(<PostMedia post={post} />);
  expect(screen.getAllByRole('button', { name: /^Open photo/ })).toHaveLength(5);
  expect(screen.getByText('+2')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Open photo 4 of 6' }));
  const viewer = screen.getByRole('dialog', { name: 'Post photos' });
  const current = () => within(viewer).getByRole('img', { name: /^Scene/ }).getAttribute('src');
  expect(current()).toBe('/photo-3.png');
  fireEvent.keyDown(viewer, { key: 'ArrowRight' });
  expect(current()).toBe('/photo-4.png');
  fireEvent.click(within(viewer).getByRole('button', { name: 'Next photo' }));
  expect(current()).toBe('/photo-5.png');
  fireEvent.click(within(viewer).getByRole('button', { name: 'Next photo' }));
  expect(current()).toBe('/photo-0.png');
  fireEvent.keyDown(viewer, { key: 'ArrowLeft' });
  expect(current()).toBe('/photo-5.png');
  fireEvent.click(within(viewer).getByRole('button', { name: 'Show photo 2' }));
  expect(current()).toBe('/photo-1.png');
});

it('shows all five photos without an overflow label, and opens the overflow tile in a larger album', () => {
  const { rerender } = render(<PostMedia post={{ ...post, images: post.images?.slice(0, 5) }} />);
  expect(screen.getAllByRole('button', { name: /^Open photo/ })).toHaveLength(5);
  expect(screen.queryByText(/^\+\d+$/)).toBeNull();
  const images = Array.from({ length: 10 }, (_, i) => ({ src: `/ten-${i}.png`, alt: `Photo ${i + 1}`, width: 600, height: 800 }));
  rerender(<PostMedia post={{ ...post, images }} />);
  expect(screen.getByText('+6')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Open photo 5 of 10' }));
  expect(within(screen.getByRole('dialog')).getByRole('img', { name: 'Photo 5' })).toBeTruthy();
});

it('restores page scrolling and focus on close and starts fresh when reopened', () => {
  document.body.style.overflow = 'auto';
  render(<PostMedia post={post} />);
  const trigger = screen.getByRole('button', { name: 'Open photo 2 of 6' });
  trigger.focus();
  fireEvent.click(trigger);
  expect(document.body.style.overflow).toBe('hidden');
  const close = screen.getByRole('button', { name: 'Close photo viewer' });
  close.focus();
  fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
  const last = screen.getByRole('button', { name: 'Show photo 6' });
  expect(document.activeElement).toBe(last);
  fireEvent.keyDown(last, { key: 'Tab' });
  expect(document.activeElement).toBe(close);
  fireEvent.click(screen.getByRole('button', { name: 'Close photo viewer' }));
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.body.style.overflow).toBe('auto');
  expect(document.activeElement).toBe(trigger);
  fireEvent.click(screen.getByRole('button', { name: 'Open photo 1 of 6' }));
  expect(within(screen.getByRole('dialog')).getByRole('img', { name: 'Scene 1' })).toBeTruthy();
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
  expect(screen.queryByRole('dialog')).toBeNull();
});

it('handles a single image and a failed image without showing unusable navigation', () => {
  render(<PostMedia post={{ ...post, images: post.images?.slice(0, 1) }} />);
  fireEvent.click(screen.getByRole('button', { name: 'Open photo 1 of 1' }));
  expect(screen.queryByRole('button', { name: 'Next photo' })).toBeNull();
  fireEvent.error(within(screen.getByRole('dialog')).getByRole('img', { name: 'Scene 1' }));
  expect(screen.getByText('This photo could not be loaded.')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(within(screen.getByRole('dialog')).getByRole('img', { name: 'Scene 1' })).toBeTruthy();
});

it('swipes between photos while ignoring vertical gestures and canceled touches', () => {
  render(<PostMedia post={post} />);
  fireEvent.click(screen.getByRole('button', { name: 'Open photo 1 of 6' }));
  const viewer = screen.getByRole('dialog');
  const canvas = within(viewer).getByRole('img', { name: 'Scene 1' }).parentElement as HTMLElement;
  fireEvent.touchStart(canvas, { touches: [{ clientX: 250, clientY: 100 }] });
  fireEvent.touchEnd(canvas, { changedTouches: [{ clientX: 50, clientY: 105 }] });
  expect(within(viewer).getByRole('img', { name: 'Scene 2' })).toBeTruthy();
  fireEvent.touchStart(canvas, { touches: [{ clientX: 250, clientY: 100 }] });
  fireEvent.touchEnd(canvas, { changedTouches: [{ clientX: 150, clientY: 400 }] });
  expect(within(viewer).getByRole('img', { name: 'Scene 2' })).toBeTruthy();
  fireEvent.touchStart(canvas, { touches: [{ clientX: 250, clientY: 100 }] });
  fireEvent.touchCancel(canvas);
  fireEvent.touchEnd(canvas, { changedTouches: [{ clientX: 50, clientY: 105 }] });
  expect(within(viewer).getByRole('img', { name: 'Scene 2' })).toBeTruthy();
});
