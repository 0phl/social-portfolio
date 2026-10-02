import { ArrowRightIcon } from 'lucide-react';
import { profile } from '../../data/profile';

export function ProfileSidebar() {
  return (
    <aside aria-label="Profile summary" className="hidden space-y-4 lg:block">
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">About</h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">{profile.bio}</p>
        <a href="#about" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
          Read full bio <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
        </a>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-semibold">Skills</h2>
        <ul className="flex flex-wrap gap-2">
          {['Linux', 'Bash', 'PostgreSQL', 'React', 'TypeScript', 'Flutter'].map((skill) => (
            <li key={skill} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">{skill}</li>
          ))}
        </ul>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Experience</h2>
        <div className="flex gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-gray-200 bg-gray-100 font-bold text-gray-500">S</span>
          <div>
            <h3 className="text-sm font-semibold">Server Administrator</h3>
            <p className="mt-1 text-xs text-gray-600">Seaversity, Inc.</p>
          </div>
        </div>
      </section>
    </aside>
  );
}
