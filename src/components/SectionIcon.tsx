import type { HubId } from "@/lib/data/navigation";

/**
 * One small line icon per menu section, so each section is recognisable by
 * shape as well as colour (colour alone fails for colour blind readers).
 * Used by the header panels, the phone menu and search.
 */
const PATHS: Record<HubId | "explainers" | "search" | "pin" | "person" | "book" | "question" | "doc" | "tool", string> = {
  // A coin with a pound sign.
  money: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm2.4 5.6A2.4 2.4 0 0 0 10.2 10v5.2c0 .7-.3 1.3-.9 1.8h5.8M8.8 12.6h4.4",
  // A heart.
  benefits: "M12 20s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z",
  // A house.
  tax: "M4 10.5 12 4l8 6.5M6 9v10h12V9M10 19v-5h4v5",
  // A map pin.
  area: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  // A parliament building with columns.
  reps: "M3 20h18M4.5 17h15M6 17v-6m4 6v-6m4 6v-6m4 6v-6M3.5 9 12 4l8.5 5h-17Z",
  // A graduation cap.
  schools: "M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Zm4 2v4.3c0 1.4 2.5 2.7 5.5 2.7s5.5-1.3 5.5-2.7V11M21.5 9v5",
  // A magnifier over a document.
  investigations: "M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21H11m3-18 4 4v3.5M14 3v4h4m-2.2 5.5a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Zm2.4 5.8L21 21",
  // An open book.
  explainers: "M12 6.5C10.3 5.2 7.8 4.8 4 5v13c3.8-.2 6.3.2 8 1.5m0-13c1.7-1.3 4.2-1.7 8-1.5v13c-3.8-.2-6.3.2-8 1.5m0-13v13",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4",
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8.5c.6-3.4 3.4-5.5 7-5.5s6.4 2.1 7 5.5",
  book: "M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5m0-15v15m0 0A1.5 1.5 0 0 0 6.5 21H19M9 7h6",
  question: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.5-11.5a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 3.8m0 2.8h.01",
  doc: "M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8l-5-5Zm0 0v5h5M8.5 13h7m-7 4h5",
  tool: "M14.7 6.3a4 4 0 0 0-5.3 5.3L4 17v3h3l5.4-5.4a4 4 0 0 0 5.3-5.3l-2.4 2.4-2.6-.4-.4-2.6 2.4-2.4Z",
};

export type IconName = keyof typeof PATHS;

export function SectionIcon({ name, size = 18, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/** A rounded tile holding a section icon, tinted in the section colour. */
export function SectionTile({
  name,
  color,
  size = 36,
  solid = false,
}: {
  name: IconName;
  color: string;
  size?: number;
  solid?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-[10px]"
      style={{
        width: size,
        height: size,
        color: solid ? "var(--surface)" : color,
        background: solid ? color : `color-mix(in srgb, ${color} 13%, var(--surface))`,
        boxShadow: solid ? undefined : `inset 0 0 0 1px color-mix(in srgb, ${color} 20%, transparent)`,
      }}
    >
      <SectionIcon name={name} size={Math.round(size * 0.52)} />
    </span>
  );
}
