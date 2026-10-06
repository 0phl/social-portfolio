import projectImages from './projectImages.json';
import type { Post } from './posts';

// Opt-in browser preview; not part of the published posts or assistant knowledge.
export function createPhotoDemo(): Post {
  return {
    id: 'photo-demo',
    content: 'Photo viewer demo\n\nThree screens from PULSE: community notices, the marketplace, and volunteering. Click a photo to explore the gallery.\n\nThis is a local sample, not a published post.',
    publishedAt: new Date().toISOString(),
    images: projectImages.pulse.slice(1, 4),
    preview: true,
  };
}
