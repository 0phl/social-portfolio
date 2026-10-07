import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BellIcon, CheckCheckIcon } from 'lucide-react';
import { blogPosts, formatBlogDate } from '../../data/blog';
import { posts } from '../../data/posts';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';

const author = profile.name.split(' ')[0];
const notifications = [
  ...blogPosts.map((post) => ({ id: `blog-${post.id}`, title: post.title, activity: `${author} published a blog`, date: post.publishedAt, href: `/blog/${post.id}` })),
  ...posts.filter((post) => !post.preview && !post.blogPostId).map((post) => {
    const project = projects.find((item) => item.id === post.projectId);
    return { id: `post-${post.id}`, title: project?.title ?? post.title ?? post.content.split('\n')[0], activity: `${author} ${project ? 'shared a project' : 'posted an update'}`, date: post.publishedAt, href: project ? `/projects/${project.id}` : `/posts/${post.id}` };
  }),
].sort((a, b) => b.date.localeCompare(a.date));

const readStorageKey = 'social-portfolio:read-notifications';

function parseReadIds(value: string | null): Set<string> {
  try {
    const ids: unknown = JSON.parse(value ?? '[]');
    return new Set(Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : []);
  } catch {
    return new Set();
  }
}

function loadReadIds() {
  try {
    return parseReadIds(window.localStorage.getItem(readStorageKey));
  } catch {
    return new Set<string>();
  }
}

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(() => new Set<string>());
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const unread = notifications.filter((item) => !read.has(item.id)).length;
  const visible = notifications.filter((item) => filter === 'all' || !read.has(item.id));

  const markRead = (ids: string[]) => {
    const next = new Set([...loadReadIds(), ...read, ...ids]);
    setRead(next);
    try {
      window.localStorage.setItem(readStorageKey, JSON.stringify([...next]));
    } catch {
      // Read controls still work for this visit when storage is unavailable.
    }
  };

  useEffect(() => {
    setRead(loadReadIds());
    const syncRead = (event: StorageEvent) => {
      if (event.key === readStorageKey || event.key === null) setRead(loadReadIds());
    };
    window.addEventListener('storage', syncRead);
    return () => window.removeEventListener('storage', syncRead);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: Event) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnNavigation = () => setOpen(false);
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('focusin', closeOutside);
    window.addEventListener('popstate', closeOnNavigation);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('focusin', closeOutside);
      window.removeEventListener('popstate', closeOnNavigation);
    };
  }, [open]);

  return (
    <div ref={container} className="relative" onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        event.stopPropagation();
        setOpen(false);
        trigger.current?.focus();
      }
    }}>
      <button ref={trigger} type="button" aria-label={unread ? `Notifications (${unread} unread)` : 'Notifications'} aria-expanded={open} aria-controls={open ? 'navbar-notifications' : undefined} onClick={() => setOpen(!open)} className={`relative flex h-11 w-11 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 ${open ? 'bg-gray-100 text-gray-900' : ''}`}>
        <BellIcon aria-hidden="true" className="h-5 w-5" />
        {unread > 0 && <span aria-hidden="true" className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border border-white bg-brand" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.section id="navbar-notifications" aria-labelledby="notifications-heading" initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 10, scale: reduceMotion ? 1 : 0.95 }} transition={{ duration: reduceMotion ? 0 : 0.15 }} className="fixed left-4 right-4 top-16 z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
            <div className="flex flex-wrap items-center justify-between gap-x-3 px-4 pt-3">
              <h2 id="notifications-heading" className="text-sm font-semibold text-gray-900">What's new <span className="ml-1.5 rounded bg-brand-light px-1.5 py-0.5 text-[11px] text-brand" aria-label={`${unread} unread`}>{unread}</span></h2>
              <button type="button" disabled={unread === 0} onClick={() => markRead(notifications.map((item) => item.id))} className="min-h-11 text-xs font-medium text-brand hover:underline disabled:text-gray-400 disabled:no-underline">Mark all as read</button>
            </div>
            <div role="group" aria-label="Filter updates" className="flex gap-5 border-b border-gray-200 px-4">
              {(['all', 'unread'] as const).map((value) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`min-h-11 border-b-2 px-1 text-xs font-medium transition-colors ${filter === value ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>{value === 'all' ? 'All' : 'Unread'}</button>)}
            </div>
            <p role="status" className="sr-only">{unread} unread updates</p>
            <ul className="max-h-[min(360px,calc(100dvh-14rem))] overflow-y-auto overscroll-contain">
              {visible.map((item) => {
                const isUnread = !read.has(item.id);
                return (
                  <li key={item.id} className="border-b border-gray-100 last:border-0">
                    <a href={item.href} onClick={() => { markRead([item.id]); setOpen(false); }} className={`flex items-start gap-3 px-4 py-4 transition-colors hover:bg-gray-100/70 focus-visible:-outline-offset-2 ${isUnread ? 'bg-brand-light/30' : ''}`}>
                      <img src={profile.avatar} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm text-gray-900 ${isUnread ? 'font-semibold' : 'font-medium'}`}>{item.activity}</span>
                        <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-gray-600">{item.title}</span>
                        <time dateTime={item.date} className="mt-1.5 block text-xs text-gray-500">{formatBlogDate(item.date)}</time>
                      </span>
                      {isUnread && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"><span className="sr-only">Unread</span></span>}
                    </a>
                  </li>
                );
              })}
              {visible.length === 0 && <li className="px-6 py-10 text-center"><CheckCheckIcon aria-hidden="true" className="mx-auto mb-3 h-6 w-6 text-brand" /><p className="text-sm font-medium text-gray-900">{filter === 'unread' ? "You're all caught up" : 'No updates yet'}</p><p className="mt-1 text-xs text-gray-500">{filter === 'unread' ? 'New updates will appear here.' : 'Check back for new projects and posts.'}</p></li>}
            </ul>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
