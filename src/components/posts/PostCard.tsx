import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon, BookmarkIcon, ClockIcon, HeartIcon, MessageCircleIcon, MoreHorizontalIcon, SendIcon, Share2Icon } from 'lucide-react';
import { profile } from '../../data/profile';
import { blogPosts, formatBlogDate } from '../../data/blog';
import type { Post } from '../../data/posts';
import { projects } from '../../data/projects';
import { ProjectPostPreview } from './ProjectPostPreview';
import { VisitorAvatar } from '../shared/VisitorAvatar';
import { LocalComment } from '../shared/LocalComment';
import { PostMedia } from './PostMedia';

export function PostCard({ post, liked, onLike }: { post: Post; liked: boolean; onLike: () => void }) {
  const [saved, setSaved] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');
  const options = useRef<HTMLDetailsElement>(null);
  const reduceMotion = useReducedMotion();
  const blog = blogPosts.find((item) => item.id === post.blogPostId);
  const project = projects.find((item) => item.id === post.projectId);

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(''), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copyLink = async () => {
    if (options.current) options.current.open = false;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${post.preview ? '/' : `/posts/${post.id}`}`);
      setStatus(post.preview ? 'Feed link copied. This preview stays in your browser.' : 'Post link copied!');
    } catch {
      setStatus('Could not copy the link. Try copying it from your address bar.');
    }
  };

  return (
    <article id={`post-${post.id}`} tabIndex={-1} aria-label={post.preview ? 'Your local post preview' : `Post by ${profile.name}`} className="scroll-mt-36 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 focus:outline-none sm:p-5">
      <header className="relative mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          {post.preview ? <VisitorAvatar size="medium" /> : <img src={profile.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover" />}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <h3 className="text-sm font-semibold">{post.preview ? 'You' : profile.name}</h3>
              {!post.preview && <img src={profile.badge} alt="Profile badge" className="h-3.5 w-3.5" />}
              <span aria-hidden="true" className="text-xs text-gray-500">•</span>
              <a href={post.preview ? '/' : `/posts/${post.id}`} className="text-xs text-gray-500 hover:underline"><time dateTime={post.publishedAt}>{post.publishedAt.length <= 10 ? formatBlogDate(post.publishedAt) : new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time></a>
            </div>
            <p className="line-clamp-1 text-xs text-gray-500">{post.preview ? 'Local preview · visible only to you' : profile.title}</p>
          </div>
        </div>
        <details ref={options} className="relative shrink-0" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }} onKeyDown={(event) => { if (event.key === 'Escape' && options.current) { options.current.open = false; options.current.querySelector('summary')?.focus(); } }}>
          <summary aria-label="Post options" className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 [&::-webkit-details-marker]:hidden"><MoreHorizontalIcon aria-hidden="true" className="h-5 w-5" /></summary>
          <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button type="button" onClick={copyLink} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Copy link to {post.preview ? 'feed' : 'post'}</button>
          </div>
        </details>
      </header>
      {post.content && <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-gray-900">{post.content}</p>}
      <PostMedia post={post} />
      {project && <ProjectPostPreview project={project} />}
      {blog && (
        <a href={`/blog/${blog.id}`} className="group mt-3 flex gap-4 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:bg-gray-50">
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-brand">{blog.title}</h4>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600">{blog.excerpt}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1"><ClockIcon aria-hidden="true" className="h-3.5 w-3.5" />{blog.readTime}</span>
              <span aria-hidden="true">•</span>
              <time dateTime={blog.publishedAt}>{formatBlogDate(blog.publishedAt)}</time>
              <span className="ml-1 flex items-center gap-1 text-brand">Read blog <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" /></span>
            </div>
          </div>
          <img src={blog.cover.src} alt={blog.cover.alt} width={96} height={96} loading="lazy" className="hidden h-24 w-24 shrink-0 rounded border border-gray-200 object-cover sm:block" />
        </a>
      )}
      <div className="relative mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <p role="status" className={status ? 'absolute bottom-full left-0 mb-2 rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow' : 'sr-only'}>{status}</p>
        <div className="flex items-center gap-3 sm:gap-6">
          <motion.button type="button" whileTap={reduceMotion ? undefined : { scale: 0.85 }} aria-label="Like post" aria-pressed={liked} onClick={onLike} className={`flex min-h-11 items-center gap-1.5 text-xs font-medium ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
            <HeartIcon aria-hidden="true" className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />{(post.engagement?.likes ?? 0) + Number(liked)}
          </motion.button>
          <button type="button" aria-label="Comments" aria-expanded={commentsOpen} aria-controls={`comments-${post.id}`} onClick={() => setCommentsOpen(!commentsOpen)} className="flex min-h-11 items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand"><MessageCircleIcon aria-hidden="true" className="h-4 w-4" />{(post.engagement?.comments ?? 0) + comments.length}</button>
          <button type="button" aria-label="Share post" onClick={copyLink} className="flex min-h-11 items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900"><Share2Icon aria-hidden="true" className="h-4 w-4" />{post.engagement?.shares ?? 0}</button>
        </div>
        <motion.button type="button" whileTap={reduceMotion ? undefined : { scale: 0.85 }} aria-label="Save post" aria-pressed={saved} onClick={() => setSaved(!saved)} className={`flex h-11 w-8 items-center justify-center rounded-full ${saved ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}><BookmarkIcon aria-hidden="true" className={`h-4 w-4 ${saved ? 'fill-gray-900' : ''}`} /></motion.button>
      </div>
      <AnimatePresence initial={false}>
        {commentsOpen && (
          <motion.section id={`comments-${post.id}`} aria-label="Comments" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="overflow-hidden">
            <div className="mt-4 border-t border-gray-100 pt-4">
              <form onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; setComments([...comments, draft.trim()]); setDraft(''); }} className="flex items-center gap-2">
                <VisitorAvatar />
                <div className="flex min-w-0 flex-1 items-center rounded-full border border-gray-200 bg-gray-50 pl-4 focus-within:border-brand">
                  <input aria-label="Add a comment" placeholder="Add a comment..." value={draft} onChange={(event) => setDraft(event.target.value)} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" />
                  <button type="submit" aria-label="Add comment" disabled={!draft.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center text-brand disabled:text-gray-300"><SendIcon aria-hidden="true" className="h-4 w-4" /></button>
                </div>
              </form>
              <p className="mt-2 text-xs text-gray-500">Comments are local previews and reset when you reload.</p>
              <div role="log" aria-label="Local comments" className="mt-4 space-y-3">
                {comments.map((comment, index) => <LocalComment key={index} text={comment} />)}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </article>
  );
}
