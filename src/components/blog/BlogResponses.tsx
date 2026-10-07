import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookmarkIcon, HeartIcon, MessageCircleIcon, SendIcon, Share2Icon } from 'lucide-react';
import { VisitorAvatar } from '../shared/VisitorAvatar';
import { LocalComment } from '../shared/LocalComment';

export function BlogResponses({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(''), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/blog/${postId}`);
      setStatus('Blog link copied!');
    } catch {
      setStatus('Could not copy the link. Try copying it from your address bar.');
    }
  };

  return (
    <>
      <div className="relative mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
        <p role="status" className={status ? 'absolute bottom-full left-0 mb-2 rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow' : 'sr-only'}>{status}</p>
        <div className="flex items-center gap-3 sm:gap-6">
          <motion.button type="button" whileTap={reduceMotion ? undefined : { scale: 0.85 }} aria-label="Like blog post" aria-pressed={liked} onClick={() => setLiked(!liked)} className={`flex min-h-11 items-center gap-1.5 text-xs font-medium ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
            <HeartIcon aria-hidden="true" className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />{Number(liked)}
          </motion.button>
          <button type="button" aria-label="Write a response" onClick={() => input.current?.focus()} className="flex min-h-11 items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand"><MessageCircleIcon aria-hidden="true" className="h-4 w-4" />{comments.length}</button>
          <button type="button" aria-label="Share blog post" onClick={copyLink} className="flex h-11 w-8 items-center justify-center text-gray-500 hover:text-gray-900"><Share2Icon aria-hidden="true" className="h-4 w-4" /></button>
        </div>
        <motion.button type="button" whileTap={reduceMotion ? undefined : { scale: 0.85 }} aria-label="Save blog post" aria-pressed={saved} onClick={() => setSaved(!saved)} className={`flex h-11 w-8 items-center justify-center rounded-full ${saved ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}><BookmarkIcon aria-hidden="true" className={`h-4 w-4 ${saved ? 'fill-gray-900' : ''}`} /></motion.button>
      </div>
      <section className="mb-16 mt-2" aria-labelledby="blog-responses-heading">
        <h2 id="blog-responses-heading" className="mb-4 text-sm font-semibold text-gray-900">Responses ({comments.length})</h2>
        <form onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; setComments([...comments, draft.trim()]); setDraft(''); }} className="flex items-center gap-2">
          <VisitorAvatar />
          <div className="flex min-w-0 flex-1 items-center rounded-full border border-gray-200 bg-gray-50 pl-4 focus-within:border-brand">
            <input ref={input} aria-label="Add a response" placeholder="Add a response..." value={draft} onChange={(event) => setDraft(event.target.value)} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" />
            <button type="submit" aria-label="Add response" disabled={!draft.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center text-brand disabled:text-gray-300"><SendIcon aria-hidden="true" className="h-4 w-4" /></button>
          </div>
        </form>
        <p className="mt-2 text-xs text-gray-500">Likes, saves, and responses are local previews and reset when you leave this page.</p>
        <div role="log" aria-label="Local responses" className="mt-4 space-y-3">
          {comments.map((comment, index) => <LocalComment key={index} text={comment} />)}
        </div>
      </section>
    </>
  );
}
