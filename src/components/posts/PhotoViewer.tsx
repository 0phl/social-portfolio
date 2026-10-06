import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon, XIcon } from 'lucide-react';
import type { Post, PostImage } from '../../data/posts';
import { profile } from '../../data/profile';
import { formatBlogDate } from '../../data/blog';
import { VisitorAvatar } from '../shared/VisitorAvatar';

function FullPhoto({ image }: { image: PostImage }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div role="status" className="p-8 text-center text-sm text-white"><p>This photo could not be loaded.</p><button type="button" onClick={() => setFailed(false)} className="mt-3 min-h-11 rounded-full border border-white/40 px-5 hover:bg-white/10">Try again</button></div>;
  return <img src={image.src} alt={image.alt} width={image.width} height={image.height} onError={() => setFailed(true)} draggable={false} className="h-full w-full object-contain" />;
}

export function PhotoViewer({ post, images, initialIndex, onClose }: { post: Post; images: PostImage[]; initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const dialog = useRef<HTMLDialogElement>(null);
  const thumbnails = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const titleId = useId();
  const image = images[index];
  const move = (direction: number) => setIndex((current) => (current + direction + images.length) % images.length);

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const overflow = document.body.style.overflow;
    const focused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      focused?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const strip = thumbnails.current;
    const selected = strip?.children[index] as HTMLElement | undefined;
    if (strip && selected) strip.scrollLeft = selected.offsetLeft - strip.offsetLeft - strip.clientWidth / 2 + selected.clientWidth / 2;
  }, [index]);

  return createPortal(
    <dialog ref={dialog} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose(); }} onKeyDown={(event) => {
      if (event.key === 'Tab') {
        const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        return;
      }
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
    }} className="photo-viewer">
      <h2 id={titleId} className="sr-only">Post photos</h2>
      <div className="photo-viewer-media">
        <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button type="button" autoFocus aria-label="Close photo viewer" onClick={onClose} className="photo-viewer-control"><XIcon aria-hidden="true" className="h-5 w-5" /></button>
          <p role="status" aria-atomic="true" className="text-sm tabular-nums text-white/80">{index + 1} / {images.length}</p>
          <a href={image.src} target="_blank" rel="noopener noreferrer" aria-label="Open original image in a new tab" title="Open original image" className="photo-viewer-control"><ExpandIcon aria-hidden="true" className="h-5 w-5" /></a>
        </header>
        <div className="relative min-h-0 flex-1 px-3 sm:px-20" onTouchStart={(event) => { const point = event.touches[0]; touch.current = event.touches.length === 1 ? { x: point.clientX, y: point.clientY } : null; }} onTouchEnd={(event) => {
          const start = touch.current;
          touch.current = null;
          if (!start || !event.changedTouches.length) return;
          const end = event.changedTouches[0];
          const dx = end.clientX - start.x;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(end.clientY - start.y) * 1.5) move(dx < 0 ? 1 : -1);
        }} onTouchCancel={() => { touch.current = null; }}>
          <FullPhoto key={`${index}-${image.src}`} image={image} />
          {images.length > 1 && <>
            <button type="button" aria-label="Previous photo" onClick={() => move(-1)} className="photo-viewer-control absolute left-3 top-1/2 -translate-y-1/2 sm:left-5"><ChevronLeftIcon aria-hidden="true" className="h-6 w-6" /></button>
            <button type="button" aria-label="Next photo" onClick={() => move(1)} className="photo-viewer-control absolute right-3 top-1/2 -translate-y-1/2 sm:right-5"><ChevronRightIcon aria-hidden="true" className="h-6 w-6" /></button>
          </>}
        </div>
        {images.length > 1 ? <div ref={thumbnails} aria-label="Choose a photo" className="relative mx-auto flex max-w-full shrink-0 gap-2 overflow-x-auto px-5 py-4">
          {images.map((item, position) => <button key={`${item.src}-${position}`} type="button" aria-label={`Show photo ${position + 1}`} aria-pressed={index === position} onClick={() => setIndex(position)} className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-opacity ${index === position ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}><img src={item.src} alt="" loading="lazy" className="h-full w-full object-cover object-top" /></button>)}
        </div> : <div className="h-5 shrink-0" />}
      </div>
      <aside className="photo-viewer-story">
        <header className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 lg:px-6">
          {post.preview ? <VisitorAvatar size="medium" /> : <img src={profile.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />}
          <div><p className="text-sm font-semibold">{post.preview ? 'You' : profile.name}</p><p className="mt-1 text-xs text-gray-500">{post.preview ? 'Local photo preview' : formatBlogDate(post.publishedAt)}</p></div>
        </header>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-5 lg:px-6">
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">{post.content}</p>
        </div>
      </aside>
    </dialog>, document.body,
  );
}
