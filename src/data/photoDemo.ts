import projectImages from './projectImages.json';
import type { Post } from './posts';

// Opt-in browser preview; not part of the published posts or assistant knowledge.
export function createPhotoDemo(count: 3 | 5 | 10 = 3): Post {
  const images = count === 3 ? projectImages.pulse.slice(1, 4) : count === 5 ? projectImages.pulse : [...projectImages.adjauto, ...projectImages.pulse];
  return {
    id: count === 3 ? 'photo-demo' : `photo-demo-${count}`,
    content: `Photo viewer demo · ${count} photos\n\n${count === 10 ? 'Screens from PULSE and ADJ Automotive, mixing portrait and landscape images.' : 'Screens from PULSE, including community notices, the marketplace, and volunteering.'} Click a photo to explore the gallery.\n\nThis is a local sample, not a published post.`,
    publishedAt: new Date().toISOString(),
    images,
    preview: true,
  };
}
