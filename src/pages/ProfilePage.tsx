import { useEffect, useRef, useState } from 'react';
import { BlogTab } from '../components/blog/BlogTab';
import { FeedTab } from '../components/posts/FeedTab';
import { AboutTab } from '../components/profile/AboutTab';
import { ProfileSidebar } from '../components/profile/ProfileSidebar';
import { projects } from '../data/projects';
import { blogPosts } from '../data/blog';
import { BlogPage } from './BlogPage';
import { ProjectPage } from './ProjectPage';
import { ProjectsTab } from '../components/projects/ProjectsTab';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { TabNavigation } from '../components/profile/TabNavigation';
import { profileTabs } from '../data/profileTabs';
import { useProfileTab } from '../hooks/useProfileTab';

export function ProfilePage() {
  const { activeTab, selectTab, projectId, postId, aboutSection, blogId } = useProfileTab();
  const project = projects.find((item) => item.id === projectId);
  const blog = blogPosts.find((item) => item.id === blogId);
  const previousProject = useRef<string>();
  const previousBlog = useRef<string>();
  const [bioRequest, setBioRequest] = useState(0);

  useEffect(() => {
    if (!project && previousProject.current && activeTab === 'projects') {
      const card = document.getElementById(`project-card-${previousProject.current}`);
      card?.focus({ preventScroll: true });
      card?.scrollIntoView({ block: 'center' });
    }
    previousProject.current = project?.id;
  }, [project, activeTab]);

  useEffect(() => {
    if (!blog && previousBlog.current && activeTab === 'blog') {
      const card = document.getElementById(`blog-card-${previousBlog.current}`);
      card?.focus({ preventScroll: true });
      card?.scrollIntoView({ block: 'center' });
    }
    previousBlog.current = blog?.id;
  }, [blog, activeTab]);

  return (
    <>
      {project && <ProjectPage project={project} />}
      {blog && <BlogPage post={blog} />}
      <div hidden={Boolean(project || blog)} className="space-y-4">
        <ProfileHeader />
        <TabNavigation activeTab={activeTab} onSelect={selectTab} />

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
          <div className="min-w-0">
            {profileTabs.map((tab) => {
              return (
                <section
                  key={tab.id}
                  role="tabpanel"
                  id={`panel-${tab.id}`}
                  aria-labelledby={`tab-${tab.id}`}
                  hidden={activeTab !== tab.id}
                  tabIndex={0}
                  className="scroll-mt-36 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  {tab.id === 'about' ? (
                    <AboutTab active={activeTab === 'about'} section={aboutSection} bioRequest={bioRequest} />
                  ) : tab.id === 'projects' ? (
                    <ProjectsTab />
                  ) : tab.id === 'posts' ? (
                    <FeedTab postId={postId} />
                  ) : tab.id === 'blog' ? (
                    <BlogTab active={activeTab === 'blog'} />
                  ) : null}
                </section>
              );
            })}
          </div>
          <ProfileSidebar onReadBio={() => setBioRequest((request) => request + 1)} />
        </div>
      </div>
    </>
  );
}
