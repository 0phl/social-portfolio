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

      <div className="relative px-4 pb-6 sm:px-6">
        <img
          src={profile.avatar}
          alt={profile.name}
          width={128}
          height={128}
          className="absolute -top-12 h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-sm sm:-top-16 sm:h-32 sm:w-32"
        />

        <div className="flex flex-wrap justify-end gap-2 pl-28 pt-4 sm:pl-36">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:min-h-[38px]"
          >
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-[100px] items-center justify-center rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover sm:min-h-[38px]"
          >
            Connect
            <span className="sr-only"> on LinkedIn (opens in a new tab)</span>
          </a>
        </div>

        <div className="mt-4">
          <h1 id="profile-name" className="text-2xl font-bold sm:text-3xl">
            {profile.name}
          </h1>
          <p className="mt-1 text-[15px] text-gray-600 sm:text-base">{profile.title}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-800 sm:text-[15px]">
            {profile.bio}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            <p className="flex items-center gap-1">
              <MapPinIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
              {profile.location}
            </p>
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-gray-900 hover:underline">
              <GithubIcon aria-hidden="true" className="h-4 w-4" /> GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-brand hover:underline">
              <LinkedinIcon aria-hidden="true" className="h-4 w-4" /> LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
