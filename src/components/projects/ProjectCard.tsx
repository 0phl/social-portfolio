import type { Project } from '../../data/projects';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      id={`project-card-${project.id}`}
      href={`#projects/${project.id}`}
      aria-labelledby={`project-${project.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left transition-colors hover:border-gray-300"
    >
      <div className="aspect-video overflow-hidden border-b border-gray-100 bg-gray-50">
        {project.image && (
          <img
            src={project.image.src}
            alt=""
            width={project.image.width}
            height={project.image.height}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-gray-500">
          {project.type === 'professional' ? 'Professional' : 'Personal'}
          <span className="mx-1">·</span>{project.category}
        </p>
        <h3 id={`project-${project.id}`} className="mt-1 font-semibold text-gray-900 transition-colors group-hover:text-brand">{project.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600">{project.description}</p>
        <ul aria-label={`${project.title} technologies`} className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {project.technologies.map((technology) => (
            <li key={technology} className="rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600">{technology}</li>
          ))}
        </ul>
      </div>
    </a>
  );
}
