import { ArrowUpRightIcon, GithubIcon } from 'lucide-react';
import type { Project } from '../../data/projects';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article aria-labelledby={`project-${project.id}`} className="rounded-lg border border-gray-200 p-4 sm:p-5">
      {project.image && (
        <img
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          loading="lazy"
          decoding="async"
          className="mb-5 h-auto w-full rounded-md border border-gray-200"
        />
      )}
      <p className="text-xs font-medium text-gray-500">{project.category}</p>
      <h3 id={`project-${project.id}`} className="mt-1 text-lg font-semibold">{project.title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-700">{project.description}</p>
      {project.note && <p className="mt-2 text-xs leading-relaxed text-gray-500">{project.note}</p>}
      <ul aria-label={`${project.title} technologies`} className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map((technology) => (
          <li key={technology} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">{technology}</li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {project.website && (
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand hover:underline"
          >
            Visit site
            <span className="sr-only">for {project.title} (opens in a new tab)</span>
            <ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" />
          </a>
        )}
        <a
          href={project.repository}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand hover:underline"
        >
          <GithubIcon aria-hidden="true" className="h-4 w-4" />
          View repository
          <span className="sr-only">for {project.title} (opens in a new tab)</span>
          <ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
