/* Small stroke icons for the Where to apply page. Decorative only. */

const PATHS = {
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  bolt: <path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12l1-8Z" />,
  family: (
    <>
      <circle cx="8" cy="7" r="3" />
      <circle cx="17" cy="9.5" r="2.25" />
      <path d="M2.5 20v-1a5.5 5.5 0 0 1 11 0v1" />
      <path d="M14.5 20v-.5a3.5 3.5 0 0 1 7 0v.5" />
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
  heart: (
    <path d="M12 20.5s-8-4.6-8-10.4A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 8 2.5c0 5.8-8 10.4-8 10.4Z" />
  ),
  chat: (
    <>
      <path d="M20.5 11.5a8 8 0 0 1-11.6 7.1L3.5 20l1.4-4.9A8 8 0 1 1 20.5 11.5Z" />
      <path d="M8.5 10.5h7M8.5 13.5h4.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </>
  ),
  phone: (
    <path d="M5.2 3.5h3l1.5 4-2 1.3a11 11 0 0 0 7.5 7.5l1.3-2 4 1.5v3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3.2 5.6a2 2 0 0 1 2-2.1Z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.3 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.3-3.5-8.5S9.6 5.9 12 3.5Z" />
    </>
  ),
  form: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </>
  ),
  building: (
    <>
      <path d="M3.5 20.5h17M5 20.5V9.5L12 4l7 5.5v11" />
      <path d="M9 20.5v-5h6v5M9 11.5h.01M15 11.5h.01" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4.5" width="14" height="17" rx="2.5" />
      <path d="M9 4.5V3.5h6v1M8.5 11l2 2 4-4M8.5 17h7" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  book: (
    <>
      <path d="M4 5.5A2 2 0 0 1 6 3.5h13v14H6a2 2 0 0 0-2 2v-14Z" />
      <path d="M4 19.5a2 2 0 0 0 2 2h13v-4" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
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
