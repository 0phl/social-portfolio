import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CheckIcon, GithubIcon, LinkedinIcon, MapPinIcon, MoreHorizontalIcon } from 'lucide-react';
import { profile } from '../../data/profile';
import { MessagePanel } from './MessagePanel';

export function ProfileHeader() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [hoveringFollow, setHoveringFollow] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState('');
  const menu = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const outside = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener('mousedown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!status) return;
    const timeout = window.setTimeout(() => setStatus(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  const copyLink = async () => {
    setMenuOpen(false);
    menuButton.current?.focus();
    try {
      await navigator.clipboard.writeText(`${window.location.href.split('#')[0]}#posts`);
      setStatus('Profile link copied!');
    } catch {
      setStatus('Could not copy the link. Copy it from your address bar.');
    }
  };

  return (
    <>
      <section aria-labelledby="profile-name" className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div role="status" className={status ? 'absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-center text-sm text-white shadow-lg' : 'sr-only'}>{status}</div>
        <img
          src={profile.cover}
          alt=""
          width={2172}
          height={724}
          className="h-32 w-full border-b border-gray-200 bg-gray-100 object-cover object-center sm:h-48"
        />

        <div className="relative px-4 pb-6 sm:px-6">
          <img
            src={profile.avatar}
            alt={profile.name}
            width={128}
            height={128}
            className="absolute -top-12 h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-sm sm:-top-16 sm:h-32 sm:w-32"
          />

          <div className="flex flex-wrap justify-end gap-1 pt-14 sm:gap-2 sm:pl-36 sm:pt-4">
            <div ref={menu} className="relative">
              <button ref={menuButton} type="button" aria-label="More profile options" aria-expanded={menuOpen} aria-controls="profile-options" onClick={() => setMenuOpen(!menuOpen)} className="flex h-11 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus-visible:outline-brand sm:h-[38px] sm:w-[38px]">
                <MoreHorizontalIcon aria-hidden="true" className="h-5 w-5" />
              </button>
              {menuOpen && (
                <div id="profile-options" className="absolute left-0 top-full z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg sm:left-auto sm:right-0">
                  <button type="button" onClick={copyLink} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Copy profile link</button>
                  <button type="button" onClick={() => { setMenuOpen(false); setStatus('Reporting is not connected in this demo.'); menuButton.current?.focus(); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Report</button>
                  <button type="button" onClick={() => { setMenuOpen(false); setStatus('Blocking is not connected in this demo.'); menuButton.current?.focus(); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Block</button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMessageOpen(true)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:min-h-[38px]"
            >
              Message
            </button>
            <button
              type="button"
              aria-pressed={isFollowing}
              aria-label={isFollowing ? 'Unfollow profile' : 'Follow profile'}
              onClick={() => { setIsFollowing(!isFollowing); setHoveringFollow(false); }}
              onMouseEnter={() => setHoveringFollow(true)}
              onMouseLeave={() => setHoveringFollow(false)}
              className={`inline-flex min-h-11 min-w-[100px] items-center justify-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors sm:min-h-[38px] ${isFollowing ? 'border-gray-300 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600' : 'border-transparent bg-brand text-white hover:bg-brand-hover'}`}
            >
              {isFollowing ? hoveringFollow ? 'Unfollow' : <><CheckIcon aria-hidden="true" className="mr-1 hidden h-4 w-4 sm:block" />Following</> : 'Follow'}
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-1.5">
              <h1 id="profile-name" className="text-2xl font-bold sm:text-3xl">{profile.name}</h1>
              <img src={profile.badge} alt="Profile badge (mockup)" title="Mockup badge" width={20} height={20} className="h-5 w-5 shrink-0" />
            </div>
            <p className="mt-1 text-[15px] text-gray-600 sm:text-base">{profile.title}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-800 sm:text-[15px]">
              {profile.bio}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <p className="flex items-center gap-1">
                <MapPinIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                {profile.location}
              </p>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-gray-900 hover:underline">
                <GithubIcon aria-hidden="true" className="h-4 w-4" /> GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-brand hover:underline">
                <LinkedinIcon aria-hidden="true" className="h-4 w-4" /> LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <p><span className="font-semibold tabular-nums">{profile.mockStats.connections.toLocaleString('en-US')}</span> <span className="text-gray-500">Connections</span></p>
              <p><span className="font-semibold tabular-nums">{(profile.mockStats.followers + Number(isFollowing)).toLocaleString('en-US')}</span> <span className="text-gray-500">Followers</span></p>
            </div>
          </div>
        </div>
      </section>
      <AnimatePresence>
        {messageOpen && <MessagePanel key="messages" onClose={() => setMessageOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
