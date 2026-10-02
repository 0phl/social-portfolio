import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { profile } from '../../data/profile';
import { posts, type Post } from '../../data/posts';
import { PostCard } from './PostCard';

export function FeedTab({ postId }: { postId?: string }) {
  const [previews, setPreviews] = useState<Post[]>([]);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [sort, setSort] = useState('top');
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState('');
  const editor = useRef<HTMLTextAreaElement>(null);
  const composeButton = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const visible = [...posts, ...previews].sort((a, b) => {
    const score = sort === 'top' ? Number(Boolean(likes[b.id])) - Number(Boolean(likes[a.id])) : 0;
    return score || Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
  });

  useEffect(() => {
    if (composing) editor.current?.focus();
  }, [composing]);

  useEffect(() => {
    if (!postId) return;
    const post = document.getElementById(`post-${postId}`);
    post?.focus({ preventScroll: true });
    post?.scrollIntoView({ block: 'start' });
  }, [postId]);

  const closeComposer = () => {
    setComposing(false);
    composeButton.current?.focus();
  };

  return (
    <>
      <h2 className="sr-only">Posts</h2>
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <img src={profile.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover" />
          <button ref={composeButton} type="button" aria-expanded={composing} aria-controls="post-composer" onClick={() => setComposing(!composing)} className="min-h-11 min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-left text-sm text-gray-500 transition-colors hover:bg-gray-50">Start a post...</button>
        </div>
        <AnimatePresence initial={false}>
          {composing && (
            <motion.form id="post-composer" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="overflow-hidden" onSubmit={(event) => {
              event.preventDefault();
              if (!draft.trim()) return;
              setPreviews((previous) => [{ id: crypto.randomUUID(), content: draft.trim(), publishedAt: new Date().toISOString(), preview: true }, ...previous]);
              setDraft('');
              setSort('recent');
              closeComposer();
            }}>
              <div className="pt-4">
                <textarea ref={editor} aria-label="Write a post" placeholder="What would you like to share?" rows={4} value={draft} onChange={(event) => setDraft(event.target.value)} className="w-full resize-y rounded-lg border border-gray-200 p-3 text-sm focus:outline-brand" />
                <p className="mt-2 text-xs text-gray-500">Try a local preview. It won't be published and will reset when you reload.</p>
                <div className="mt-3 flex justify-end gap-2">
                  <button type="button" onClick={closeComposer} className="min-h-11 rounded-full border border-gray-300 px-4 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={!draft.trim()} className="min-h-11 rounded-full bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-50">Preview post</button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 py-2">
        <div className="h-px flex-1 bg-gray-200" />
        <label htmlFor="post-sort" className="text-xs font-medium text-gray-500">Sort by:</label>
        <select id="post-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-8 rounded bg-transparent text-xs font-medium text-gray-900 focus:outline-brand">
          <option value="top">Top</option>
          <option value="recent">Recent</option>
        </select>
      </div>
      {visible.map((post) => (
        <motion.div key={post.id} initial={reduceMotion || postId ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
          <PostCard post={post} liked={Boolean(likes[post.id])} onLike={() => setLikes((previous) => ({ ...previous, [post.id]: !previous[post.id] }))} />
        </motion.div>
      ))}
    </div>
    </>
  );
}
