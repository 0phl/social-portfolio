import type { KeyboardEvent } from 'react';
import { profileTabs, type ProfileTab } from '../../data/profileTabs';

interface TabNavigationProps {
  activeTab: ProfileTab;
  onSelect: (tab: ProfileTab) => void;
}

export function TabNavigation({ activeTab, onSelect }: TabNavigationProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % profileTabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + profileTabs.length) % profileTabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = profileTabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    document.getElementById(`tab-${profileTabs[nextIndex].id}`)?.focus();
  };

  return (
    <div className="sticky top-16 z-40 rounded-lg border border-gray-200 bg-white">
      <div role="tablist" aria-label="Profile sections" className="flex">
        {profileTabs.map((tab, index) => {
          const selected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`relative min-w-0 flex-1 rounded-md px-2 py-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand sm:flex-none sm:px-6 ${selected ? 'text-brand' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {tab.label}
              {selected && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
