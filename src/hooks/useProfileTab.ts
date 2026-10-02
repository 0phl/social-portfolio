import { useSyncExternalStore } from 'react';
import { profileTabs, type ProfileTab } from '../data/profileTabs';

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

export function useProfileTab() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash.slice(1));
  const [tabId, projectId] = hash.split('/');
  const activeTab = profileTabs.find((tab) => tab.id === tabId)?.id ?? 'posts';

  const selectTab = (tab: ProfileTab) => {
    window.location.hash = tab;
  };

  return { activeTab, selectTab, projectId: activeTab === 'projects' ? projectId : undefined, postId: activeTab === 'posts' ? projectId : undefined };
}
