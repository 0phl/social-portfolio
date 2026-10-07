// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TurnstileChallenge } from '../../src/components/chat/TurnstileChallenge';

type Options = Parameters<NonNullable<Window['turnstile']>['render']>[1];
let challenges: Options[];
let widgets: HTMLElement[];

beforeEach(() => {
  challenges = [];
  widgets = [];
  window.turnstile = {
    render: vi.fn((element, options) => {
      challenges.push(options);
      const widget = document.createElement('iframe');
      widget.title = 'Cloudflare verification';
      element.append(widget);
      widgets.push(widget);
      return String(widgets.length - 1);
    }),
    remove: vi.fn((id) => widgets[Number(id)].remove()),
  };
});
afterEach(() => { cleanup(); delete window.turnstile; });

describe('Turnstile visibility and token lifecycle', () => {
  it('collapses a successful widget without unmounting it or discarding its token', async () => {
    const onToken = vi.fn();
    render(<TurnstileChallenge siteKey="test" revision={0} onToken={onToken} />);
    await waitFor(() => expect(challenges).toHaveLength(1));
    act(() => challenges[0].callback('verified-token'));
    expect(onToken).toHaveBeenLastCalledWith('verified-token');
    expect(widgets[0].isConnected).toBe(true);
    expect(widgets[0].closest('[hidden]')).not.toBeNull();
  });

  it('clears expired tokens and allows a fresh challenge to appear', async () => {
    const onToken = vi.fn();
    render(<TurnstileChallenge siteKey="test" revision={0} onToken={onToken} />);
    await waitFor(() => expect(challenges).toHaveLength(1));
    act(() => challenges[0].callback('verified-token'));
    act(() => challenges[0]['expired-callback']());
    await waitFor(() => expect(challenges).toHaveLength(2));
    expect(onToken).toHaveBeenLastCalledWith('');
    expect(widgets[1].closest('[hidden]')).toBeNull();
  });

  it('ignores callbacks from a consumed challenge after the next message or new chat', async () => {
    const onToken = vi.fn();
    const { rerender } = render(<TurnstileChallenge siteKey="test" revision={0} onToken={onToken} />);
    await waitFor(() => expect(challenges).toHaveLength(1));
    act(() => challenges[0].callback('first-token'));
    rerender(<TurnstileChallenge siteKey="test" revision={1} onToken={onToken} />);
    await waitFor(() => expect(challenges).toHaveLength(2));
    act(() => challenges[0].callback('stale-token'));
    expect(onToken).toHaveBeenLastCalledWith('');
    expect(widgets[1].closest('[hidden]')).toBeNull();
    act(() => challenges[1].callback('next-token'));
    expect(widgets[1].closest('[hidden]')).not.toBeNull();
  });

  it('reveals a renewed interactive challenge and clears any previous token', async () => {
    const onToken = vi.fn();
    render(<TurnstileChallenge siteKey="test" revision={0} onToken={onToken} />);
    await waitFor(() => expect(challenges).toHaveLength(1));
    act(() => challenges[0].callback('verified-token'));
    act(() => challenges[0]['before-interactive-callback']());
    expect(onToken).toHaveBeenLastCalledWith('');
    expect(widgets[0].closest('[hidden]')).toBeNull();
  });

  it.each(['error-callback', 'timeout-callback'] as const)('allows recovery after %s and clears errors on success', async (callback) => {
    const onToken = vi.fn();
    render(<TurnstileChallenge siteKey="test" revision={0} onToken={onToken} />);
    await waitFor(() => expect(challenges).toHaveLength(1));
    act(() => challenges[0].callback('verified-token'));
    act(() => challenges[0][callback]());
    expect(onToken).toHaveBeenLastCalledWith('');
    expect(widgets[0].closest('[hidden]')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Reload verification' }));
    await waitFor(() => expect(challenges).toHaveLength(2));
    act(() => challenges[1]['error-callback']());
    act(() => challenges[1].callback('recovered-token'));
    expect(screen.queryByRole('button', { name: 'Reload verification' })).toBeNull();
    expect(widgets[1].closest('[hidden]')).not.toBeNull();
  });
});
