import { ArrowRightIcon } from 'lucide-react';
import type { Project } from '../../data/projects';
import { ProjectImagePlaceholder } from '../projects/ProjectImagePlaceholder';

export function ProjectPostPreview({ project }: { project: Project }) {
  const cover = project.images[0];

  return (
    <a href={`#projects/${project.id}`} className="group mt-3 block overflow-hidden rounded-lg border border-gray-200 text-left transition-colors hover:bg-gray-50">
      <div className="aspect-video overflow-hidden border-b border-gray-200 bg-gray-100">
        {cover ? (
          <img src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]" />
        ) : <ProjectImagePlaceholder title={project.title} />}
      </div>
      <div className="p-4">
        <h4 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-brand">{project.title}</h4>
        <p className="mt-1 line-clamp-2 text-xs text-gray-600">{project.description}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((technology) => <span key={technology} className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{technology}</span>)}
          </div>
          <span className="flex items-center gap-1 whitespace-nowrap text-xs font-medium text-brand">View project <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </a>
  );
}
