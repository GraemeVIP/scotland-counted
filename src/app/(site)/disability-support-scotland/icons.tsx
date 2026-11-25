/* Small stroke icons for the Disability support page. Decorative only. */

const PATHS = {
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20.5h16" />
      <rect x="5.5" y="11" width="3.5" height="7" rx="1" />
      <rect x="10.25" y="6" width="3.5" height="12" rx="1" />
      <rect x="15" y="13.5" width="3.5" height="4.5" rx="1" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4.5" width="14" height="17" rx="2.5" />
      <path d="M9 4.5V3.5h6v1M8.5 11l2 2 4-4M8.5 17h7" />
    </>
  ),
  phone: (
    <path d="M5.2 3.5h3l1.5 4-2 1.3a11 11 0 0 0 7.5 7.5l1.3-2 4 1.5v3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3.2 5.6a2 2 0 0 1 2-2.1Z" />
  ),
  person: (
    <>
      <circle cx="12" cy="4.8" r="2" />
      <path d="M4.5 9h15M12 9v5.5M12 14.5l-3.5 6M12 14.5l3.5 6" />
    </>
  ),
  family: (
    <>
      <circle cx="8" cy="7" r="3" />
      <circle cx="17" cy="9.5" r="2.25" />
      <path d="M2.5 20v-1a5.5 5.5 0 0 1 11 0v1" />
      <path d="M14.5 20v-.5a3.5 3.5 0 0 1 7 0v.5" />
    </>
  ),
  heart: (
    <path d="M12 20.5s-8-4.6-8-10.4A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 8 2.5c0 5.8-8 10.4-8 10.4Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.5" y="7" width="17" height="12.5" rx="2.5" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3.5 12.5h17" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3.5v17M7 20.5h10M5 7.5h14M12 5.5l-7 2M12 5.5l7 2" />
      <path d="M5 7.5 2.5 13a2.5 2.5 0 0 0 5 0L5 7.5ZM19 7.5 16.5 13a2.5 2.5 0 0 0 5 0L19 7.5Z" />
    </>
  ),
  bus: (
    <>
      <rect x="4.5" y="3" width="15" height="15" rx="3" />
      <path d="M4.5 11h15M8 18v2.5M16 18v2.5" />
      <circle cx="8.5" cy="14.5" r=".9" fill="currentColor" />
      <circle cx="15.5" cy="14.5" r=".9" fill="currentColor" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5v10h13v-10M10 19.5v-5h4v5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
