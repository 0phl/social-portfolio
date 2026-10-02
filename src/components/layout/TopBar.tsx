import type { MouseEventHandler } from 'react';
import { GithubIcon, LinkedinIcon } from 'lucide-react';
import { profile } from '../../data/profile';
import { Notifications } from './Notifications';

interface TopBarProps {
  onHomeClick: MouseEventHandler<HTMLAnchorElement>;
}

export function TopBar({ onHomeClick }: TopBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-4 px-4 lg:px-0">
        <a href="#main-content" onClick={onHomeClick} className="flex h-12 w-12 shrink-0 items-center rounded-md">
          <img src="/logo.png" alt={profile.name} width={48} height={48} className="h-12 w-12 object-contain" />
        </a>

        <nav aria-label="Profile navigation" className="flex shrink-0 items-center gap-1 sm:gap-2">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in a new tab)"
            className="flex h-11 w-11 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <GithubIcon aria-hidden="true" className="h-5 w-5" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in a new tab)"
            className="flex h-11 w-11 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand"
          >
            <LinkedinIcon aria-hidden="true" className="h-5 w-5" />
          </a>
          <Notifications />
          <a href="#posts" onClick={onHomeClick} aria-label="View Ronan's profile" className="flex h-11 w-11 items-center justify-center rounded-full">
            <img src={profile.avatar} alt="" width={32} height={32} className="h-8 w-8 rounded-full border border-gray-300 bg-gray-100 object-cover" />
          </a>
        </nav>
      </div>
    </header>
  );
}
