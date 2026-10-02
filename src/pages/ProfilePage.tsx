import { useEffect, useRef } from 'react';
import { FileTextIcon, MessageSquareIcon } from 'lucide-react';
import { ProfileSidebar } from '../components/profile/ProfileSidebar';
import { projects } from '../data/projects';
import { ProjectPage } from './ProjectPage';
import { ProjectsTab } from '../components/projects/ProjectsTab';
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
  articles: {
    icon: FileTextIcon,
    title: 'No articles yet',
    description: 'Longer write-ups on building applications, running servers, and figuring things out will live here.',
  },
};

export function ProfilePage() {
  const { activeTab, selectTab, projectId } = useProfileTab();
  const project = projects.find((item) => item.id === projectId);
  const previousProject = useRef<string>();

  useEffect(() => {
    if (!project && previousProject.current && activeTab === 'projects') {
      const card = document.getElementById(`project-card-${previousProject.current}`);
      card?.focus({ preventScroll: true });
      card?.scrollIntoView({ block: 'center' });
    }
    previousProject.current = project?.id;
  }, [project, activeTab]);

  return (
    <>
      {project && <ProjectPage project={project} />}
      <div hidden={Boolean(project)} className="space-y-4">
        <ProfileHeader />
        <TabNavigation activeTab={activeTab} onSelect={selectTab} />

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
          <div className="min-w-0">
            {profileTabs.map((tab) => {
              const emptyState = tab.id === 'posts' || tab.id === 'articles' ? emptyStates[tab.id] : null;
              const Icon = emptyState?.icon;

              return (
                <section
                  key={tab.id}
                  role="tabpanel"
                  id={`panel-${tab.id}`}
                  aria-labelledby={`tab-${tab.id}`}
                  hidden={activeTab !== tab.id}
                  tabIndex={0}
                  className={`scroll-mt-36 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${tab.id === 'projects' ? '' : 'rounded-lg border border-gray-200 bg-white p-5 sm:p-6'}`}
                >
                  {tab.id === 'about' ? (
                    <>
                      <h2 className="text-lg font-semibold">A little about me</h2>
                      <div className="mt-3 max-w-2xl space-y-3 text-[15px] leading-relaxed text-gray-700">
                        {profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </div>
                    </>
                  ) : tab.id === 'projects' ? (
                    <ProjectsTab />
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
          <ProfileSidebar />
        </div>
      </div>
    </>
  );
}
