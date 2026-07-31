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
 * Tiles are shaded by rate rather than coloured categorically, so the spread
 * reads at a glance without implying a threshold the data does not have.
 */
export default function AreaGrid({ className = "" }: { className?: string }) {
  const areas = councilsByLevel();
  const worst = areas[0].pcts[9];
  const best = areas[areas.length - 1].pcts[9];
  const span = worst - best || 1;

  return (
    <section className={className} aria-labelledby="find-your-area">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 mb-7">
        <div>
          <p className="kicker text-[var(--brand)] mb-2.5">Find your place</p>
          <h2
            id="find-your-area"
            className="display-stat text-[clamp(30px,3.6vw,46px)] max-w-[18ch]"
          >
            Every council area in Scotland
          </h2>
          <p className="text-[18px] leading-[1.6] text-[var(--ink-2)] mt-4 max-w-[54ch]">
            Worst rate first. Each one has its own page with ten years of figures, the people who
            represent it, and an email already written.
          </p>
        </div>
        <p className="text-[15px] text-[var(--muted)] tnum">
          Children in poverty · {COUNCIL_YEARS[9]}
        </p>
      </div>

      {/* 140px lets two tiles sit side by side on a phone; one column would
          make 32 areas an 1,800px scroll before anything else happens. */}
      <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))]">
        {areas.map((a) => {
          const t = (a.pcts[9] - best) / span;
          return (
            <Link
              key={a.slug}
              href={`/areas/${a.slug}`}
              className="group relative rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3.5 no-underline overflow-hidden transition-[border-color,transform] hover:border-[var(--brand)] hover:-translate-y-0.5"
            >
              {/* Rate as a wash, so the spread is visible before anything is read. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{ background: "var(--brand)", opacity: 0.04 + t * 0.16 }}
              />
              <span className="relative flex items-baseline justify-between gap-3">
                <span className="ui text-[15.5px] font-[650] text-[var(--ink)] leading-[1.25]">
                  {a.name}
                </span>
                <span className="display-stat text-[19px] text-[var(--ink)] tnum shrink-0">
                  {a.pcts[9]}%
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
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
