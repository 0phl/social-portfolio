export const profileTabs = [
  { id: 'posts', label: 'Posts' },
  { id: 'projects', label: 'Projects' },
  { id: 'articles', label: 'Articles' },
  { id: 'about', label: 'About' },
] as const;

export type ProfileTab = (typeof profileTabs)[number]['id'];
