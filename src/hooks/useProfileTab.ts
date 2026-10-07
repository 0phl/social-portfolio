import { profileTabs, type ProfileTab } from '../data/profileTabs';
import { navigate, usePath } from '../routing/navigation';

export function useProfileTab() {
  const path = usePath();
  const [pathname, fragment] = path.split('#');
  const [route, itemId] = pathname.slice(1).split('/');
  const tabId = route === 'articles' ? 'blog' : route;
  const activeTab = profileTabs.find((tab) => tab.id === tabId)?.id ?? 'posts';

  const selectTab = (tab: ProfileTab) => {
    navigate(tab === 'posts' ? '/' : `/${tab}`);
  };

  return {
    activeTab,
    selectTab,
    projectId: activeTab === 'projects' ? itemId : undefined,
    postId: activeTab === 'posts' ? itemId : undefined,
    aboutSection: activeTab === 'about' ? fragment : undefined,
    blogId: activeTab === 'blog' ? itemId : undefined,
  };
}
