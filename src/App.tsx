import type { MouseEvent } from 'react';
import { TopBar } from './components/layout/TopBar';
import { ProfilePage } from './pages/ProfilePage';
import { ChatProvider } from './chat/ChatProvider';
import { Router } from './routing/Router';
import { navigate } from './routing/navigation';

export function App({ path = '/' }: { path?: string }) {
  const focusContent = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const content = document.getElementById('main-content');
    content?.focus({ preventScroll: true });
    content?.scrollIntoView({ block: 'start' });
  };

  return (
    <Router path={path}><ChatProvider>
      <a
        href="#main-content"
        onClick={focusContent}
        className="sr-only left-4 top-2 z-[60] rounded-md bg-white px-4 py-2 font-medium text-brand shadow focus:not-sr-only focus:fixed"
      >
        Skip to content
      </a>
      <TopBar onHomeClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        navigate('/');
        focusContent(event);
      }} />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto min-h-screen max-w-5xl scroll-mt-14 px-4 pb-12 pt-20 focus:outline-none lg:px-0"
      >
        <ProfilePage />
      </main>
    </ChatProvider></Router>
  );
}
