import { TopBar } from './components/layout/TopBar';
import { ProfileHeader } from './components/profile/ProfileHeader';

export function App() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only left-4 top-2 z-[60] rounded-md bg-white px-4 py-2 font-medium text-brand shadow focus:not-sr-only focus:fixed"
      >
        Skip to content
      </a>
      <TopBar />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto min-h-screen max-w-5xl scroll-mt-14 px-4 pb-12 pt-20 focus:outline-none lg:px-0"
      >
        <ProfileHeader />
      </main>
    </>
  );
}
