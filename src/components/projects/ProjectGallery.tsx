import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon, ImageOffIcon } from 'lucide-react';
import type { ProjectImage } from '../../data/projects';

export function ProjectGallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceMotion = useReducedMotion();

  if (images.length === 0) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 text-center text-gray-500">
        <ImageOffIcon aria-hidden="true" className="mb-2 h-6 w-6" />
        <p className="text-sm font-medium">No images yet</p>
        <p className="mt-0.5 text-xs text-gray-400">Screenshots for this project are coming soon.</p>
      </div>
    );
  }

  const current = images[index];
  const hasMany = images.length > 1;
  const select = (next: number, focus = false) => {
    const nextIndex = (next + images.length) % images.length;
    setIndex(nextIndex);
    const thumbnail = thumbnails.current[nextIndex];
    const strip = thumbnail?.parentElement;
    if (thumbnail && strip) strip.scrollTo({ left: thumbnail.offsetLeft - (strip.clientWidth - thumbnail.clientWidth) / 2, behavior: 'instant' });
    if (focus) thumbnail?.focus({ preventScroll: true });
  };

  return (
    <section aria-label={`${title} screenshots`} aria-roledescription="carousel">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </AnimatePresence>
        {hasMany && (
          <>
            <button type="button" onClick={() => select(index - 1)} aria-label="Previous image" className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 transition-colors hover:bg-white hover:text-gray-900">
              <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => select(index + 1)} aria-label="Next image" className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 transition-colors hover:bg-white hover:text-gray-900">
              <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
            </button>
            <span aria-hidden="true" className="absolute bottom-3 right-3 rounded-full bg-gray-900/80 px-2 py-0.5 text-xs font-medium tabular-nums text-white">{index + 1} / {images.length}</span>
          </>
        )}
      </div>
      <p role="status" className="sr-only">Image {index + 1} of {images.length}</p>
      {hasMany && (
        <div className="relative mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Choose project image">
          {images.map((image, imageIndex) => (
            <button
              key={image.src}
              ref={(element) => { thumbnails.current[imageIndex] = element; }}
              type="button"
              aria-pressed={imageIndex === index}
              aria-label={`Show image ${imageIndex + 1}`}
              onClick={() => select(imageIndex)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  event.preventDefault();
                  select(imageIndex + (event.key === 'ArrowRight' ? 1 : -1), true);
                } else if (event.key === 'Home' || event.key === 'End') {
                  event.preventDefault();
                  select(event.key === 'Home' ? 0 : images.length - 1, true);
                }
              }}
              className={`aspect-video w-24 shrink-0 overflow-hidden rounded-md border-2 bg-gray-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand ${imageIndex === index ? 'border-brand' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" className={`h-full w-full ${image.height > image.width ? 'object-contain' : 'object-cover'}`} />
            </button>
          ))}
        </div>
      )}
      <a href={current.src} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-1 text-xs text-gray-500 hover:text-brand">
        Open full-size image<span className="sr-only"> (opens in a new tab)</span><ArrowUpRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
      </a>
    </section>
  );
}
