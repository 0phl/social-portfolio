import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDownIcon, MapPinIcon } from 'lucide-react';
import { education, experience, skillGroups } from '../../data/about';
import { profile } from '../../data/profile';

const card = 'bg-white border border-gray-200 rounded-lg p-5 sm:p-6 scroll-mt-[136px]';
const ease = [0.23, 1, 0.32, 1] as const;

export function AboutTab({ active, section, bioRequest }: { active: boolean; section?: string; bioRequest: number }) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [openRole, setOpenRole] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active || section !== 'bio') return;
    setBioExpanded(true);
    const frame = requestAnimationFrame(() => {
      const bio = document.getElementById('about-bio');
      bio?.focus({ preventScroll: true });
      bio?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [active, section, bioRequest, reduceMotion]);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0, y: active || reduceMotion ? 0 : 6 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease }}
      className="space-y-4"
    >
      <section id="about-bio" tabIndex={-1} aria-labelledby="about-heading" className={`${card} focus-visible:outline-brand`}>
        <h2 id="about-heading" className="mb-3 text-lg font-semibold text-gray-900">About</h2>
        <div id="about-bio-text" className={`space-y-3 text-[15px] leading-relaxed text-gray-700 ${bioExpanded ? '' : 'line-clamp-3'}`}>
          {profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <button
          onClick={() => setBioExpanded(!bioExpanded)}
          aria-expanded={bioExpanded}
          aria-controls="about-bio-text"
          className="mt-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-brand"
        >
          {bioExpanded ? 'Show less' : '…see more'}
        </button>
      </section>

      <section id="about-experience" className={card}>
        <h2 className="mb-5 text-lg font-semibold text-gray-900">Experience</h2>
        <ol>
          {experience.map((role, index) => {
            const isLast = index === experience.length - 1;
            const isOpen = openRole === role.id;
            return (
              <li key={role.id} className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[110px_18px_minmax(0,1fr)]">
                <p className="hidden pt-[7px] text-xs tabular-nums text-gray-500 sm:block">{role.period}</p>
                <div aria-hidden="true" className="relative flex justify-center">
                  <span className={`relative z-10 mt-2 h-2.5 w-2.5 rounded-full border-2 ${role.current ? 'border-brand bg-brand' : 'border-gray-300 bg-white'}`} />
                  {!isLast && <span className="absolute bottom-0 top-6 w-px bg-gray-200" />}
                </div>
                <div className={isLast ? '' : 'pb-4'}>
                  <h3>
                    <button
                      id={`role-${role.id}`}
                      onClick={() => setOpenRole(isOpen ? null : role.id)}
                      aria-expanded={isOpen}
                      aria-controls={`details-${role.id}`}
                      className="group -mx-3 w-full rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-gray-50"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="font-semibold text-gray-900 transition-colors group-hover:text-brand">{role.role}</span>
                            {role.current && <span className="rounded bg-brand-light px-1.5 py-0.5 text-[11px] font-medium text-brand">Current</span>}
                          </span>
                          <span className="mt-0.5 block text-sm text-gray-700">{role.company}<span className="mx-1.5 text-gray-300">·</span>{role.type}</span>
                          <span className="mt-1 flex flex-wrap items-center gap-1 text-xs text-gray-500">
                            <span className="tabular-nums sm:hidden">{role.period} ·</span>
                            <MapPinIcon aria-hidden="true" className="h-3 w-3" />{role.location}
                          </span>
                          {!isOpen && <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{role.description}</span>}
                        </span>
                        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.2, ease }} className="mt-1 shrink-0 text-gray-400 group-hover:text-gray-700">
                          <ChevronDownIcon aria-hidden="true" className="h-4 w-4" />
                        </motion.span>
                      </span>
                    </button>
                  </h3>
                  <div id={`details-${role.id}`} role="region" aria-labelledby={`role-${role.id}`}>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.25, ease }}
                          className="overflow-hidden"
                        >
                          <div className="max-w-xl pb-1 pt-2">
                            <div className="space-y-3">
                              {role.details.map((detail) => <p key={detail} className="text-sm leading-relaxed text-gray-700">{detail}</p>)}
                            </div>
                            <h4 className="mb-2 mt-4 text-xs font-semibold text-gray-900">Highlights</h4>
                            <ul className="space-y-1.5">
                              {role.highlights.map((highlight) => (
                                <li key={highlight} className="flex gap-2.5 text-sm leading-relaxed text-gray-700">
                                  <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-gray-400" />{highlight}
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {role.skills.map((skill) => <span key={skill} className="rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600">{skill}</span>)}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section id="about-skills" className={card}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Skills</h2>
        <div className="space-y-4">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <h3 className="mb-2 text-xs text-gray-500">{group.label}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => <li key={skill} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-800">{skill}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="about-education" className={card}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Education</h2>
        <h3 className="font-semibold text-gray-900">{education.school}</h3>
        <p className="mt-0.5 text-sm text-gray-700">{education.degree}</p>
        <p className="mt-1 text-xs tabular-nums text-gray-500">{education.period}</p>
      </section>
    </motion.div>
  );
}
