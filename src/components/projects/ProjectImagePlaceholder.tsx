export function ProjectImagePlaceholder({ title }: { title: string }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-brand-light px-5 py-3 text-center">
      <svg aria-hidden="true" viewBox="0 0 200 128" fill="none" className="mb-3 w-[26%] max-w-40 shrink-0 text-brand">
        <rect x="48" y="10" width="120" height="88" rx="12" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.14" />
        <rect x="32" y="26" width="120" height="88" rx="12" fill="white" />
        <rect x="32.75" y="26.75" width="118.5" height="86.5" rx="11.25" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M33 49H151" stroke="currentColor" strokeOpacity="0.14" />
        <circle cx="45" cy="38" r="2" fill="currentColor" fillOpacity="0.5" />
        <circle cx="53" cy="38" r="2" fill="currentColor" fillOpacity="0.25" />
        <circle cx="61" cy="38" r="2" fill="currentColor" fillOpacity="0.15" />
        <rect x="74" y="63" width="36" height="32" rx="6" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
        <circle cx="99" cy="73" r="3" fill="currentColor" fillOpacity="0.55" />
        <path d="M75 88L85 78L94 87L99 82L109 92" stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 59H14M18 55V63M171 105H179M175 101V109" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <p className="max-w-sm text-balance text-sm font-semibold leading-snug text-gray-800 sm:text-base">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-gray-600">Project preview coming soon</p>
    </div>
  );
}
