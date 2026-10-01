import { useSyncExternalStore } from 'react';
import { profileTabs, type ProfileTab } from '../data/profileTabs';

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function getTab(): ProfileTab {
  const hash = window.location.hash.slice(1);
  return profileTabs.find((tab) => tab.id === hash)?.id ?? 'posts';
}

export function useProfileTab() {
  const activeTab = useSyncExternalStore(subscribe, getTab);

  const selectTab = (tab: ProfileTab) => {
    window.location.hash = tab;
  };

  return { activeTab, selectTab };
}
