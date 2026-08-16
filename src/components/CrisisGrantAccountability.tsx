import Link from "next/link";
import {
  CRISIS_GRANT_CSV_URL,
  CRISIS_GRANT_SOURCE_URL,
  CRISIS_GRANT_TABLES_URL,
  CRISIS_GRANT_YEARS,
  crisisGrantScotland,
  crisisGrantScotlandAcceptanceHistory,
  getCrisisGrantCouncil,
} from "@/lib/data/crisisGrants";

function signedDifference(value: number) {
  if (value === 0) return "the same as Scotland";
  return `${Math.abs(value)} percentage point${Math.abs(value) === 1 ? "" : "s"} ${value > 0 ? "above" : "below"} Scotland`;
}

function money(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CrisisGrantAccountability({
  slug,
  councilName,
}: {
  slug: string;
  councilName: string;
}) {
  const stat = getCrisisGrantCouncil(slug);
  if (!stat) return null;

  const outcomeQuestion =
    Math.abs(stat.differenceFromScotland) >= 5
      ? `${councilName}'s published award rate is ${signedDifference(stat.differenceFromScotland)}. The national tables show the difference, but not its cause. The council should explain whether local case mix, evidence requirements, repeat applications, budget pressure, staff guidance or another part of administration produced it.`
      : `${councilName}'s published award rate is ${signedDifference(stat.differenceFromScotland)}. That does not remove the need for scrutiny: the council should still publish enough information to show how decisions are made consistently and whether rejected applicants can use the review process.`;

  return (
    <section id="crisis-grants" className="scroll-mt-24 pt-14">
      <p className="kicker mb-2 text-[var(--bad-text)]">Emergency help, local decisions</p>
      <h2 className="h2 mb-3">The Crisis Grant gap in {councilName}</h2>
      <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
        In 2025/26, {councilName} awarded a Crisis Grant in {stat.acceptanceRate}% of decided
        applications. Scotland&apos;s rate was {crisisGrantScotland.acceptanceRate}%. The same national
        scheme produced council rates from 52% to 89%.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-4 border-t-[var(--action)] bg-[var(--surface)] p-5">
          <p className="ui text-[15px] font-[750] text-[var(--ink-2)]">Decisions resulting in an award</p>
          <p className="mt-3 text-[42px] font-[800] leading-none tracking-[-0.04em] text-[var(--action)] tnum">
            {stat.acceptanceRate}%
          </p>
          <p className="mt-3 text-[15px] leading-[1.5] text-[var(--ink-2)]">
            About {stat.awards.toLocaleString("en-GB")} awards from {stat.decisions.toLocaleString("en-GB")} decisions.
          </p>
        </article>

        <article className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-4 border-t-[var(--brand)] bg-[var(--surface)] p-5">
          <p className="ui text-[15px] font-[750] text-[var(--ink-2)]">Compared with Scotland</p>
          <p className="mt-3 text-[34px] font-[800] leading-none tracking-[-0.04em] text-[var(--brand)] tnum">
            {stat.differenceFromScotland > 0 ? "+" : ""}{stat.differenceFromScotland} points
          </p>
          <p className="mt-3 text-[15px] leading-[1.5] text-[var(--ink-2)]">
            Rank #{stat.rank} of 32 when published award rates are ordered highest to lowest.
          </p>
        </article>

        <article className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-4 border-t-[var(--good)] bg-[var(--surface)] p-5">
          <p className="ui text-[15px] font-[750] text-[var(--ink-2)]">Decided by the deadline</p>
          <p className="mt-3 text-[42px] font-[800] leading-none tracking-[-0.04em] text-[var(--good-text)] tnum">
            {stat.processedByNextWorkingDay}%
          </p>
          <p className="mt-3 text-[15px] leading-[1.5] text-[var(--ink-2)]">
            By the end of the next working day, January to March 2026.
          </p>
        </article>

        <article className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-4 border-t-[var(--brand-deep)] bg-[var(--surface)] p-5">
          <p className="ui text-[15px] font-[750] text-[var(--ink-2)]">Average award</p>
          <p className="mt-3 text-[42px] font-[800] leading-none tracking-[-0.04em] text-[var(--brand-deep)] tnum">
            {money(stat.averageAward)}
          </p>
          <p className="mt-3 text-[15px] leading-[1.5] text-[var(--ink-2)]">
            {money(stat.spend)} in Crisis Grant expenditure during 2025/26.
          </p>
        </article>
      </div>

      <figure className="mt-6 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-[var(--rule)] pb-4">
          <div>
            <p className="ui text-[15px] font-[750] text-[var(--brand)]">Five complete years</p>
            <h3 className="mt-1 text-[21px] font-[760] leading-[1.3]">This is not just one quarter</h3>
          </div>
          <p className="ui text-[15px] text-[var(--muted)]">Share of decisions resulting in an award</p>
        </div>
        <div className="mt-5 space-y-4">
          {CRISIS_GRANT_YEARS.map((year, index) => (
            <div key={year}>
              <div className="flex items-baseline justify-between gap-4 text-[15px] leading-[1.45]">
                <span className="font-[680] text-[var(--ink-2)]">{year}</span>
                <span className="tnum font-[750] text-[var(--ink)]">
                  {councilName} {stat.acceptanceHistory[index]}% · Scotland {crisisGrantScotlandAcceptanceHistory[index]}%
                </span>
              </div>
              <div className="mt-1.5 h-3.5 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-[var(--brand)]"
                  style={{ width: `${stat.acceptanceHistory[index]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <figcaption className="mt-5 border-t border-[var(--rule)] pt-4 text-[15px] leading-[1.6] text-[var(--ink-2)]">
          These are applications and decisions, not unique people. A person can apply more than
          once. Counts are rounded to the nearest five and can differ slightly when added.
        </figcaption>
      </figure>

      <div className="mt-6 rounded-[var(--r-m)] border border-[var(--rule)] border-l-4 border-l-[var(--action)] bg-[var(--surface-2)] p-5 sm:p-6">
        <p className="ui text-[15px] font-[760] text-[var(--action)]">The question this council needs to answer</p>
        <p className="mt-2 max-w-[75ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">{outcomeQuestion}</p>
        <p className="mt-3 max-w-[75ch] text-[15px] leading-[1.6] text-[var(--muted)]">
          A higher rate is not automatically better and a lower rate is not proof of unlawful or
          ruthless decision-making. The figures prove different outcomes. They do not establish motive,
          applicant need or decision quality on their own.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/blog/crisis-grant-acceptance-rates-scotland-councils" className="btn btn-primary">
          See all 32 councils and the full investigation <span aria-hidden="true">→</span>
        </Link>
        <a href={CRISIS_GRANT_CSV_URL} download className="btn btn-secondary">
          Download the council data <span aria-hidden="true">↓</span>
        </a>
      </div>

      <p className="ui mt-5 text-[15px] leading-[1.55] text-[var(--muted)]">
        Source: Scottish Government, <a href={CRISIS_GRANT_SOURCE_URL} target="_blank" rel="noopener noreferrer">Scottish Welfare Fund statistics to 31 March 2026</a>,
        Tables 6, 18, 24, 28 and 36. <a href={CRISIS_GRANT_TABLES_URL}>Open the source workbook</a>.
      </p>
    </section>
  );
}
