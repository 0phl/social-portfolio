import { FileTextIcon, FolderOpenIcon, MessageSquareIcon } from 'lucide-react';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { TabNavigation } from '../components/profile/TabNavigation';
import { profile } from '../data/profile';
import { profileTabs } from '../data/profileTabs';
import { useProfileTab } from '../hooks/useProfileTab';

const emptyStates = {
  posts: {
    icon: MessageSquareIcon,
    title: 'No posts yet',
    description: "I'll share project updates, things I'm learning, and notes from my day-to-day work here.",
  },
  projects: {
    icon: FolderOpenIcon,
    title: 'Projects are on the way',
    description: "I'm putting together a selection of my work, with the story behind each project.",
  },
  articles: {
    icon: FileTextIcon,
    title: 'No articles yet',
    description: 'Longer write-ups on building applications, running servers, and figuring things out will live here.',
  },
};

export function ProfilePage() {
  const { activeTab, selectTab } = useProfileTab();

  return (
    <div className="space-y-4">
      <ProfileHeader />
      <TabNavigation activeTab={activeTab} onSelect={selectTab} />

      {profileTabs.map((tab) => {
        const emptyState = tab.id === 'about' ? null : emptyStates[tab.id];
        const Icon = emptyState?.icon;

        return (
          <section
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            tabIndex={0}
            className="scroll-mt-36 rounded-lg border border-gray-200 bg-white p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:p-6"
          >
            {tab.id === 'about' ? (
              <>
                <h2 className="text-lg font-semibold">A little about me</h2>
                <div className="mt-3 max-w-2xl space-y-3 text-[15px] leading-relaxed text-gray-700">
                  {profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </>
            ) : emptyState && Icon ? (
              <div className="flex flex-col items-center py-8 text-center sm:py-10">
                <div className="mb-4 rounded-full bg-gray-50 p-3 text-gray-500">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </div>
                <h2 className="text-base font-semibold">{emptyState.title}</h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600">{emptyState.description}</p>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
