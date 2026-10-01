import { GithubIcon, LinkedinIcon, MapPinIcon } from 'lucide-react';
import { profile } from '../../data/profile';

export function ProfileHeader() {
  return (
    <section aria-labelledby="profile-name" className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <img
        src={profile.cover}
        alt=""
        width={2172}
        height={724}
        className="h-32 w-full border-b border-gray-200 bg-gray-100 object-cover object-center sm:h-48"
      />

      <div className="px-4 pb-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <img
            src={profile.avatar}
            alt={profile.name}
            width={128}
            height={128}
            className="relative -mt-12 h-24 w-24 shrink-0 rounded-full border-4 border-white bg-white object-cover shadow-sm sm:-mt-16 sm:h-32 sm:w-32"
          />

          <div className="flex flex-wrap gap-2 pt-4">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <GithubIcon aria-hidden="true" className="h-4 w-4" />
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
            >
              <LinkedinIcon aria-hidden="true" className="h-4 w-4" />
              Connect
              <span className="sr-only"> on LinkedIn (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div className="mt-5">
          <h1 id="profile-name" className="text-2xl font-bold tracking-tight sm:text-3xl">
            {profile.name}
          </h1>
          <p className="mt-1 text-[15px] text-gray-600 sm:text-base">{profile.title}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-800 sm:text-[15px]">
            {profile.bio}
          </p>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-gray-500">
            <MapPinIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
            {profile.location}
          </p>
        </div>
      </div>
    </section>
  );
}
