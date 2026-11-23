import Link from "@/components/IntentLink";

export type NextStepItem = {
  href: string;
  label: string;
  blurb: string;
};

/**
 * Compact next-step links placed near the top of high-traffic pages
 * (right after the quick answer or lookup tool) so readers who finish
 * getting their answer have clear, relevant places to click next.
 */
export default function NextStepStrip({
  heading = "Check next",
  items,
  className = "mt-6",
}: {
  heading?: string;
  items: NextStepItem[];
  className?: string;
}) {
  return (
    <nav aria-label={heading} className={`not-prose ${className}`}>
      <p className="ui mb-2.5 text-[14px] font-[620] uppercase tracking-[0.06em] text-[var(--muted)]">
        {heading}
      </p>
      <ul className="grid gap-2.5 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group block h-full rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3.5 no-underline transition-colors hover:border-[var(--brand)]"
            >
              <span className="ui block text-[15.5px] font-[620] leading-[1.35] text-[var(--ink)] group-hover:text-[var(--brand)]">
                {item.label}
                <span aria-hidden="true" className="text-[var(--brand)]"> →</span>
              </span>
              <span className="mt-1 block text-[14.5px] leading-[1.45] text-[var(--ink-2)]">
                {item.blurb}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
