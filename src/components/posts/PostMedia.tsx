import { useRef, useState } from 'react';
import type { Post } from '../../data/posts';
import { PhotoViewer } from './PhotoViewer';

export function PostMedia({ post }: { post: Post }) {
  const [active, setActive] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const images = post.images ?? [];
  if (!images.length) return null;

  return (
    <>
      <div className={`post-media mt-4 ${images.length === 1 ? 'post-media-single' : 'post-media-grid'}`} data-count={Math.min(images.length, 4)}>
        {images.slice(0, 4).map((image, index) => (
          <button key={`${image.src}-${index}`} type="button" aria-label={`Open photo ${index + 1} of ${images.length}`} onClick={(event) => { trigger.current = event.currentTarget; setActive(index); }} className="group relative min-h-0 min-w-0 overflow-hidden bg-gray-100">
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" className={`w-full transition-[filter] group-hover:brightness-90 ${images.length === 1 ? 'h-auto' : 'h-full object-cover object-top'}`} />
            {index === 3 && images.length > 4 && <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/50 text-3xl font-semibold text-white">+{images.length - 4}</span>}
          </button>
        ))}
      </div>
      {active !== null && <PhotoViewer post={post} images={images} initialIndex={active} onClose={() => { setActive(null); trigger.current?.focus({ preventScroll: true }); }} />}
    </>
  );
}
