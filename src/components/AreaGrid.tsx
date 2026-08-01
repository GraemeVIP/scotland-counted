import Link from "next/link";
import { councilsByLevel, COUNCIL_YEARS } from "@/lib/data/councils";

/** Every council area at once, worst rate first. */
export default function AreaGrid({ className = "" }: { className?: string }) {
  const areas = councilsByLevel();
  const worst = areas[0].pcts[9];
  const best = areas[areas.length - 1].pcts[9];
  const span = worst - best || 1;

  return (
    <section className={className} aria-labelledby="find-your-area">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.62fr)] lg:items-end mb-8">
        <div>
          <p className="kicker text-[var(--brand)] mb-2.5">Find your place</p>
          <h2
            id="find-your-area"
            className="display-stat text-[clamp(32px,3.6vw,48px)] max-w-[18ch]"
          >
            Every council area in Scotland
          </h2>
        </div>
        <p className="text-[16px] leading-[1.55] text-[var(--ink-2)] max-w-[44ch] lg:justify-self-end">
          Pick your area. You will get the short answer first, then the full figures, sources and
          a ready-written email for the people who represent you.
          <span className="block text-[15px] text-[var(--muted)] mt-2 tnum">
            Ranked by children in poverty · {COUNCIL_YEARS[9]}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {areas.map((a, index) => {
          const t = (a.pcts[9] - best) / span;
          return (
            <Link
              key={a.slug}
              href={`/areas/${a.slug}`}
              className="group relative flex min-h-[108px] flex-col items-start justify-between gap-3 overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3.5 no-underline transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-2)] sm:grid sm:min-h-[78px] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 pointer-events-none bg-[var(--brand)]"
                style={{ width: `${18 + t * 82}%`, opacity: 0.035 + t * 0.09 }}
              />
              <span className="relative min-w-0">
                <span className="ui block text-[15.5px] font-[700] leading-[1.25] text-[var(--ink)]">
                  {a.name}
                </span>
                <span className="ui mt-1 block text-[15px] leading-none text-[var(--muted)]">
                  {index + 1} of 32
                </span>
              </span>
              <span className="relative display-stat text-[25px] leading-none text-[var(--ink)] tnum">
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
