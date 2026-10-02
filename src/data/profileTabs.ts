export const profileTabs = [
  { id: 'posts', label: 'Posts' },
  { id: 'projects', label: 'Projects' },
  { id: 'blog', label: 'Blog' },
  { id: 'about', label: 'About' },
] as const;

export type ProfileTab = (typeof profileTabs)[number]['id'];
