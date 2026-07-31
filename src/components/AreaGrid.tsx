import Link from "next/link";
import { councilsByLevel, COUNCIL_YEARS } from "@/lib/data/councils";

/**
 * Every council area at once, worst rate first.
 *
 * Two jobs. It is the second place on the homepage a visitor is asked to do
 * something — before this, the postcode box in the hero was the only one, and
 * anyone who scrolled past it was never asked again. And it makes the size of
 * the site visible: 32 areas on screen answers "is my place in here" without
 * anyone having to search.
 *
 * Column counts are fixed to 2, 4 and 8 rather than auto-filling, because 32
 * divides evenly by all three. Auto-fill left a ragged half-empty last row at
 * most widths, which is what made the section look broken.
 *
 * The rate sits under the name rather than beside it. Side by side, a long
 * name like Clackmannanshire and a percentage fight for the same line and one
 * of them gets clipped.
 */
export default function AreaGrid({ className = "" }: { className?: string }) {
  const areas = councilsByLevel();
  const worst = areas[0].pcts[9];
  const best = areas[areas.length - 1].pcts[9];
  const span = worst - best || 1;

  return (
    <section className={className} aria-labelledby="find-your-area">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 mb-8">
        <div>
          <p className="kicker text-[var(--brand)] mb-2.5">Find your place</p>
          <h2
            id="find-your-area"
            className="display-stat text-[clamp(30px,3.6vw,46px)] max-w-[16ch]"
          >
            Every council area in Scotland
          </h2>
        </div>
        <p className="text-[16px] leading-[1.55] text-[var(--ink-2)] max-w-[38ch]">
          Worst rate first. Each has its own page with ten years of figures, the people who
          represent it, and an email already written.
          <span className="block text-[14.5px] text-[var(--muted)] mt-2 tnum">
            Children in poverty · {COUNCIL_YEARS[9]}
          </span>
        </p>
      </div>

      <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
        {areas.map((a) => {
          const t = (a.pcts[9] - best) / span;
          return (
            <Link
              key={a.slug}
              href={`/areas/${a.slug}`}
              className="group relative flex flex-col justify-between min-h-[104px] rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-3.5 py-3 no-underline overflow-hidden transition-[border-color,transform,box-shadow] hover:border-[var(--brand)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-2)]"
            >
              {/* Rate as a wash, so the spread is visible before anything is read. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{ background: "var(--brand)", opacity: 0.03 + t * 0.15 }}
              />
              <span className="relative ui text-[14px] font-[640] leading-[1.25] [overflow-wrap:anywhere] hyphens-auto text-[var(--ink-2)] group-hover:text-[var(--ink)] transition-colors">
                {a.name}
              </span>
              <span className="relative display-stat text-[24px] leading-[1.15] text-[var(--ink)] tnum mt-2">
                {a.pcts[9]}%
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-7">
        <Link href="/constituencies" className="ui text-[16px] font-[700]">
          Or find it by your MP&apos;s area →
        </Link>
        <Link href="/browse" className="ui text-[16px] font-[600] text-[var(--ink-2)]">
          See everything on this site
        </Link>
      </div>
    </section>
  );
}
