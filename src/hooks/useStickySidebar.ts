import { useEffect, useRef } from 'react';

export function useStickySidebar(topOffset: number, bottomOffset = 16) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let lastScroll = window.scrollY;
    let top = topOffset;
    let frame = 0;
    const apply = () => {
      const minTop = window.innerHeight - element.offsetHeight - bottomOffset;
      top = minTop >= topOffset ? topOffset : Math.min(topOffset, Math.max(minTop, top - (window.scrollY - lastScroll)));
      lastScroll = window.scrollY;
      element.style.top = `${top}px`;
    };
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(apply); };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    apply();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [topOffset, bottomOffset]);

  return ref;
}
