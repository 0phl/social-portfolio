import { useRef, useState } from 'react';
import type { Post } from '../../data/posts';
import { PhotoViewer } from './PhotoViewer';

export function PostMedia({ post }: { post: Post }) {
  const [active, setActive] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const images = post.images ?? [];
  if (!images.length) return null;
  const layout = images[0].width < images[0].height ? 'columns' : 'rows';

  return (
    <>
      <div className={`post-media mt-4 ${images.length === 1 ? 'post-media-single' : 'post-media-grid -mx-4 sm:-mx-5'}`} data-count={Math.min(images.length, 5)} data-layout={layout} data-wide={images[0].width / images[0].height > 1.35}>
        {images.slice(0, 5).map((image, index) => (
          <button key={`${image.src}-${index}`} type="button" aria-label={`Open photo ${index + 1} of ${images.length}`} onClick={(event) => { trigger.current = event.currentTarget; setActive(index); }} className="group relative min-h-0 min-w-0 overflow-hidden bg-gray-100">
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" className={`w-full transition-[filter] group-hover:brightness-90 ${images.length === 1 ? 'h-auto' : `h-full object-cover ${image.width / image.height < 0.65 ? 'object-[center_20%]' : 'object-center'}`}`} />
            {index === 4 && images.length > 5 && <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/50 text-3xl font-semibold text-white">+{images.length - 4}</span>}
          </button>
        ))}
      </div>
      {active !== null && <PhotoViewer post={post} images={images} initialIndex={active} onClose={() => { setActive(null); trigger.current?.focus({ preventScroll: true }); }} />}
    </>
  );
}
