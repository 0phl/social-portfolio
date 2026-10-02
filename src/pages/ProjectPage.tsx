import { useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowUpRightIcon, GithubIcon } from 'lucide-react';
import type { Project } from '../data/projects';

export function ProjectPage({ project }: { project: Project }) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [project.id]);

  return (
    <div>
      <a href="#projects" className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
        <ArrowLeftIcon aria-hidden="true" className="h-4 w-4" /> Back to projects
      </a>
      <header className="mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-gray-500">{project.type === 'professional' ? 'Professional' : 'Personal'} · {project.category}</p>
          <h1 ref={heading} tabIndex={-1} className="mt-2 text-3xl font-bold tracking-tight focus:outline-none sm:text-4xl">{project.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={project.repository} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <GithubIcon aria-hidden="true" className="h-4 w-4" /> Source<span className="sr-only"> (opens in a new tab)</span>
          </a>
          {project.website && (
            <a href={project.website} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover">
              Visit live<span className="sr-only"> (opens in a new tab)</span><ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" />
            </a>
          )}
        </div>
      </header>
      {project.image && (
        <img src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} className="h-auto w-full rounded-lg border border-gray-200" />
      )}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px] lg:gap-14">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Overview</h2>
          <p className="text-base leading-relaxed text-gray-700">{project.description}</p>
          {project.note && <p className="mt-4 text-sm leading-relaxed text-gray-500">{project.note}</p>}
        </section>
        <section className="lg:border-l lg:border-gray-200 lg:pl-8">
          <h2 className="mb-4 text-sm font-semibold">Tech stack</h2>
          <ul className="flex flex-wrap gap-1.5">
            {project.technologies.map((technology) => (
              <li key={technology} className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-800">{technology}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
