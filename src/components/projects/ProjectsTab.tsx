import { projects } from '../../data/projects';
import { ProjectCard } from './ProjectCard';

export function ProjectsTab() {
  return (
    <>
      <h2 className="text-lg font-semibold">Selected projects</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        A few projects I've worked on, from community tools to everyday business needs.
      </p>
      <div className="mt-5 space-y-4">
        {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </>
  );
}
