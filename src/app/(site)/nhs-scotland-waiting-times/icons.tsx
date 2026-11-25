/* Small stroke icons for NHS Scotland pages. Decorative only. */

const PATHS = {
  hospital: (
    <>
      <rect x="4" y="4" width="16" height="17" rx="2" />
      <path d="M9 21v-4h6v4M12 8v5M9.5 10.5h5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3.5v17M7 20.5h10M5 7.5h14M12 5.5l-7 2M12 5.5l7 2" />
      <path d="M5 7.5 2.5 13a2.5 2.5 0 0 0 5 0L5 7.5ZM19 7.5 16.5 13a2.5 2.5 0 0 0 5 0L19 7.5Z" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" />
      <path d="M3 14h18M7 9V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 21 19.5H3L12 3.5Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  file: (
    <>
      <path d="M6 3.5h8l4 4v13H6v-17Z" />
      <path d="M14 3.5v4h4M9 12h6M9 16h4" />
    </>
  ),
  heart: (
    <path d="M12 20.5s-8-4.6-8-10.4A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 8 2.5c0 5.8-8 10.4-8 10.4Z" />
  ),
  chat: (
    <path d="M20 11.5a7.5 7.5 0 0 1-11.2 6.5L4 19.5l1.5-4.3A7.5 7.5 0 1 1 20 11.5Z" />
  ),
  scan: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 12h8M12 8v8" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6.5" cy="7.5" r="2.5" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <path d="M8.7 9 19 16.5M8.7 15 19 7.5" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, className, size }: { name: IconName; className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
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
