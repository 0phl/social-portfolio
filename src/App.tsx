import type { MouseEvent } from 'react';
import { TopBar } from './components/layout/TopBar';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  const focusContent = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const content = document.getElementById('main-content');
    content?.focus({ preventScroll: true });
    content?.scrollIntoView({ block: 'start' });
  };

  return (
    <>
      <a
        href="#main-content"
        onClick={focusContent}
        className="sr-only left-4 top-2 z-[60] rounded-md bg-white px-4 py-2 font-medium text-brand shadow focus:not-sr-only focus:fixed"
      >
        Skip to content
      </a>
      <TopBar onHomeClick={(event) => {
        window.location.hash = 'posts';
        focusContent(event);
      }} />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto min-h-screen max-w-5xl scroll-mt-14 px-4 pb-12 pt-20 focus:outline-none lg:px-0"
      >
        <ProfilePage />
      </main>
    </>
  );
}
