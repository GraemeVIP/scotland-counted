import { councilBenchmarks, LGBF_SOURCE } from "@/lib/data/councilBenchmarks";

/**
 * "How your council compares" — the like-for-like layer on every council
 * record, generated from the national benchmarking data (LGBF).
 *
 * The point of this block is the ruler, not the numbers alone: every council
 * is measured the same way, so "5th worst in Scotland" is a fact a reader can
 * repeat in an argument without caveats. The rank phrase does the emotional
 * work; the value and the Scotland figure sit beside it as the receipt.
 *
 * Tone thresholds are terciles of 32. Middle third stays neutral on purpose —
 * painting 11th of 32 as either triumph or scandal would be spin, and spin is
 * the one thing this site must never do.
 */
export default function CouncilCompare({ slug }: { slug: string }) {
  const rows = councilBenchmarks[slug];
  if (!rows || rows.length === 0) return null;

  return (
    <section id="compare" className="pt-14 scroll-mt-24">
      <p className="kicker mb-2 text-[var(--brand)]">Same ruler for all 32 councils</p>
      <h2 className="h2 mb-3">How your council compares</h2>
      <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
        Every council in Scotland reports these figures the same way, so this is a fair
        comparison. The year is shown for each figure.
      </p>

      <div className="mt-6 grid gap-3">
        {rows.map((row) => {
          const goodTercile = row.rank <= Math.ceil(row.of / 3);
          const badTercile = row.rank > row.of - Math.ceil(row.of / 3);
          const tone = goodTercile
            ? "border-[var(--good-text)] text-[var(--good-text)]"
            : badTercile
              ? "border-[var(--bad-text)] text-[var(--bad-text)]"
              : "border-[var(--rule-strong)] text-[var(--ink-2)]";
          return (
            <div
              key={row.code}
              className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="ui text-[16px] font-[750] leading-[1.4] text-[var(--ink)]">
                    {row.label}
                  </h3>
                  <p className="mt-1 text-[15px] leading-[1.5] text-[var(--ink-2)]">{row.plain}</p>
                </div>
                <span
                  className={`ui shrink-0 rounded-full border px-3 py-1 text-[15px] font-[750] ${tone}`}
                >
                  {row.phrase}
                </span>
              </div>
              <p className="ui mt-3 text-[15px] leading-[1.5] text-[var(--ink-2)] tnum">
                Here: <strong className="text-[var(--ink)]">{row.display}</strong>
                {" · "}Scotland: {row.scotlandDisplay}
                {" · "}{row.year}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 max-w-[68ch] text-[15.5px] leading-[1.55] text-[var(--muted)]">
        Figures from the {LGBF_SOURCE.name}, published by the {LGBF_SOURCE.publisher} — the
        national comparison every council takes part in. Data file retrieved{" "}
        {LGBF_SOURCE.retrieved}.{" "}
        <a href={LGBF_SOURCE.url} rel="noopener noreferrer" target="_blank">
          Check the data yourself
        </a>
        .
      </p>
    </section>
  );
}
