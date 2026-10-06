import { ArrowRightIcon } from 'lucide-react';
import { profile } from '../../data/profile';
import { experience, skillGroups } from '../../data/about';
import { projects } from '../../data/projects';
import { useStickySidebar } from '../../hooks/useStickySidebar';

export function ProfileSidebar({ onReadBio }: { onReadBio: () => void }) {
  const sidebar = useStickySidebar(136);
  const skillCount = new Set(skillGroups.flatMap((group) => group.skills)).size;
  return (
    <aside ref={sidebar} aria-label="Profile summary" className="sticky hidden space-y-4 pb-4 lg:block">
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">About</h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">{profile.about[0]}</p>
        <a href="#about/bio" onClick={onReadBio} className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
          Read full bio <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
        </a>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-semibold">Top Skills</h2>
        <ul className="flex flex-wrap gap-2">
          {['Linux Administration', 'Bash', 'PostgreSQL', 'React', 'TypeScript', 'Docker'].map((skill) => (
            <li key={skill} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">{skill}</li>
          ))}
          <li><a href="#about/skills" onClick={onReadBio} className="inline-block rounded-full px-3 py-1 text-xs font-medium text-brand hover:bg-brand-light">+{skillCount - 6} more</a></li>
        </ul>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Experience</h2>
        <div className="-mx-2">
          {experience.slice(0, 2).map((role) => (
            <a key={role.id} href="#about/experience" onClick={onReadBio} className="group flex gap-3 rounded-md p-2 transition-colors hover:bg-gray-50">
              <img src={role.logo} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 shrink-0 rounded border border-gray-200 bg-white object-contain" />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold group-hover:text-brand">{role.role}</h3>
                <p className="text-xs text-gray-600">{role.company} · {role.type}</p>
                <p className="mt-0.5 text-xs text-gray-500">{role.period}</p>
              </div>
            </a>
          ))}
        </div>
        <a href="#about/experience" onClick={onReadBio} className="mt-3 flex w-full items-center justify-center gap-1 border-t border-gray-100 pt-3 text-sm font-medium text-brand hover:underline">Show all {experience.length} experiences <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" /></a>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-semibold">Featured Projects</h2>
        <div className="space-y-4">
          {projects.filter((project) => project.featured).map((project) => (
            <a key={project.id} href={`#projects/${project.id}`} className="group flex gap-3">
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50">
                {project.images[0] && <img src={project.images[0].src} alt="" loading="lazy" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0"><h3 className="text-sm font-semibold group-hover:text-brand">{project.title}</h3><p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{project.description}</p></div>
            </a>
          ))}
        </div>
      </section>
      <footer className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-2 text-xs text-gray-500">
        <a href="#about/bio" onClick={onReadBio} className="hover:text-brand hover:underline">About</a>
        <a href="https://github.com/0phl/social-portfolio" target="_blank" rel="noopener noreferrer" className="hover:text-brand hover:underline">Source code<span className="sr-only"> (opens in a new tab)</span></a>
        <p className="mt-2 w-full text-center">{profile.name} © {new Date().getFullYear()}</p>
      </footer>
    </aside>
  );
}
