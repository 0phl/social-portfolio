import { useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowUpRightIcon, CheckIcon, GithubIcon } from 'lucide-react';
import { projects, type Project } from '../data/projects';
import { ProjectGallery } from '../components/projects/ProjectGallery';
import { ProjectImagePlaceholder } from '../components/projects/ProjectImagePlaceholder';

const stackCategories = [
  { label: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'Bootstrap', 'shadcn/ui', 'Framer Motion', 'React Markdown', 'Lucide'] },
  { label: 'Mobile', items: ['Flutter', 'Dart'] },
  { label: 'Backend', items: ['Laravel', 'Express', 'PHP', 'NestJS', 'Node.js', 'Zod', 'pg-boss', 'n8n'] },
  { label: 'Data', items: ['MySQL', 'Firebase', 'IndexedDB', 'PostgreSQL', 'Prisma', 'MinIO', 'Drizzle ORM', 'Durable Objects', 'SQLite', 'Browser Local Storage', 'Pinecone'] },
  { label: 'Integrations & files', items: ['Moodle Web Services', 'PDFKit', 'Nodemailer', 'Sharp', 'write-excel-file', 'Cloudflare Turnstile', 'Moodle', 'REST APIs'] },
  { label: 'Deployment', items: ['Docker Compose', 'Nginx', 'Rocky Linux', 'NPMplus', 'Cloudflare', 'Cloudflare Workers', 'Wrangler', 'Vercel'] },
  { label: 'Development & testing', items: ['Vitest', 'pnpm', 'Turborepo', 'PGlite', 'Vite', 'React Testing Library'] },
  { label: 'AI', items: ['Google Gemini', 'LLM Integration', 'RAG'] },
  { label: 'Maps', items: ['Leaflet.js'] },
];

export function ProjectPage({ project }: { project: Project }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const related = projects.filter((item) => item.id !== project.id && item.type === project.type).slice(0, 3);
  const featureGroups = project.featureGroups ?? [{ title: 'Highlights', items: project.highlights }];
  const stack = stackCategories.map((group) => ({
    label: group.label,
    items: project.technologies.filter((technology) => group.items.includes(technology)),
  })).filter((group) => group.items.length > 0);
  const otherTechnologies = project.technologies.filter((technology) => !stackCategories.some((group) => group.items.includes(technology)));
  if (otherTechnologies.length) stack.push({ label: 'Other', items: otherTechnologies });

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
          {project.repository && (
            <a href={project.repository} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <GithubIcon aria-hidden="true" className="h-4 w-4" /> Source<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {project.website && (
            <a href={project.website} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover">
              Visit live<span className="sr-only"> (opens in a new tab)</span><ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" />
            </a>
          )}
        </div>
      </header>
      <ProjectGallery key={project.id} images={project.images} title={project.title} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-14">
        <div>
          <section>
            <h2 className="mb-3 text-lg font-semibold">Overview</h2>
            <p className="text-base leading-relaxed text-gray-700">{project.description}</p>
            {project.note && <p className="mt-4 text-sm leading-relaxed text-gray-500">{project.note}</p>}
          </section>
          {project.contribution && (
            <section className="mt-10">
              <h2 className="mb-3 text-lg font-semibold">My contribution</h2>
              <h3 className="text-base font-semibold">{project.contribution.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-gray-700">{project.contribution.description}</p>
            </section>
          )}
          {featureGroups.map((group) => <section key={group.title} className="mt-10">
            <h2 className="mb-4 text-lg font-semibold">{group.title}</h2>
            <ul className="space-y-3">
              {group.items.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-[15px] leading-relaxed text-gray-800">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand"><CheckIcon aria-hidden="true" className="h-3 w-3" strokeWidth={3} /></span>
                  {highlight}
                </li>
              ))}
            </ul>
          </section>)}
          </div>
        <aside aria-label="Project details" className="lg:border-l lg:border-gray-200 lg:pl-8">
          <h2 className="mb-4 text-sm font-semibold">Tech stack</h2>
          <div className="space-y-4">
            {stack.map((group) => (
              <div key={group.label}>
                <h3 className="mb-2 text-xs font-normal text-gray-500">{group.label}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((technology) => <li key={technology} className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-800">{technology}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <section aria-labelledby="related-projects-heading" className="mb-16 mt-16 border-t border-gray-200 pt-8">
          <h2 id="related-projects-heading" className="mb-4 text-sm font-semibold">More {project.type} projects</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((item) => {
              const cover = item.images[0];
              return (
                <a key={item.id} href={`#projects/${item.id}`} className="group min-w-0 rounded-lg text-left">
                  <div className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    {cover ? <img src={cover.src} alt="" width={cover.width} height={cover.height} loading="lazy" className={`h-full w-full transition-transform duration-300 motion-safe:group-hover:scale-[1.02] ${cover.height > cover.width ? 'object-contain' : 'object-cover'}`} /> : <ProjectImagePlaceholder title={item.title} />}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold transition-colors group-hover:text-brand">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-600">{item.description}</p>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
