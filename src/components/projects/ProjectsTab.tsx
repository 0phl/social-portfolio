import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { projects } from '../../data/projects';
import { ProjectCard } from './ProjectCard';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'professional', label: 'Professional' },
  { id: 'personal', label: 'Personal' },
] as const;

export function ProjectsTab() {
  const reduceMotion = useReducedMotion();
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
            className={`relative min-h-10 whitespace-nowrap rounded-full border border-transparent px-2.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-4 ${filter === id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {filter === id && <motion.span aria-hidden="true" layoutId="projectFilter" transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 38 }} className="absolute inset-0 rounded-full border border-gray-200 bg-white" />}
            <span className="relative">{label}
            <span className="ml-1.5 text-xs tabular-nums text-gray-400">
              {projects.filter((project) => id === 'all' || project.type === id).length}
            </span>
            </span>
          </button>
        ))}
      </div>
      <p role="status" className="sr-only">{visible.length} {filter === 'all' ? '' : filter} projects</p>
      <motion.div key={filter} id="project-results" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : 0.04 } } }} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.map((project) => <motion.div key={project.id} variants={{ hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 8 }, show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] } } }}><ProjectCard project={project} /></motion.div>)}
      </motion.div>
      {visible.length === 0 && (
        <p className="rounded-lg border border-gray-200 bg-white px-5 py-10 text-center text-sm text-gray-600">
          No professional projects shared here yet.
        </p>
      )}
    </>
  );
}
