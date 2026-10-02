import { useState } from 'react';
import { projects } from '../../data/projects';
import { ProjectCard } from './ProjectCard';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'professional', label: 'Professional' },
  { id: 'personal', label: 'Personal' },
] as const;

export function ProjectsTab() {
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all');
  const visible = projects.filter((project) => filter === 'all' || project.type === filter);

  return (
    <>
      <h2 className="sr-only">Projects</h2>
      <div role="group" aria-label="Filter projects" className="mb-4 inline-flex max-w-full rounded-full bg-gray-100 p-1">
        {filters.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            aria-controls="project-results"
            onClick={() => setFilter(id)}
            className={`min-h-10 rounded-full border px-2.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-4 ${filter === id ? 'border-gray-200 bg-white text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            {label}
            <span className="ml-1.5 text-xs tabular-nums text-gray-400">
              {projects.filter((project) => id === 'all' || project.type === id).length}
            </span>
          </button>
        ))}
      </div>
      <p role="status" className="sr-only">{visible.length} {filter === 'all' ? '' : filter} projects</p>
      <div id="project-results" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
      {visible.length === 0 && (
        <p className="rounded-lg border border-gray-200 bg-white px-5 py-10 text-center text-sm text-gray-600">
          No professional projects shared here yet.
        </p>
      )}
    </>
  );
}
