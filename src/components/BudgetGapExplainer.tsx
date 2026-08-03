import {
  BRIDGING_ACTIONS,
  BUDGET_SOURCE,
  COMPARISON_CAVEAT,
  COUNCIL_TAX,
  FORMULA_COUNTS,
  FORMULA_SOURCE,
  FUNDING_MIX,
  NATIONAL,
  gapFor,
  isReserveOutlier,
} from "@/lib/data/councilBudgetMechanics";

/**
 * "Why your council says it needs more money."
 *
 * Almost every council announces that it needs another twenty million, every
 * single year, whatever it was given. People notice that and assume a fiddle.
 * This section does not tell them whether they are right. It shows them the
 * pattern, explains what a budget gap actually is, names who paid to close it,
 * and says plainly how the grant is worked out — including the part that
 * answers the obvious suspicion, which is that coming in on budget does not
 * cost a council its funding the next year.
 *
 * Every number is from the Audit Scotland budget bulletin or the Scottish
 * Parliament's own briefing on the funding formula. The conclusion is left to
 * the reader, deliberately and permanently.
 */
export default function BudgetGapExplainer({
  slug,
  councilName,
}: {
  slug: string;
  councilName: string;
}) {
  const gap = gapFor(slug);
  const outlier = isReserveOutlier(slug);
  const hasGap = gap !== undefined && gap > 0;
  const hasSurplus = gap !== undefined && gap < 0;
  const gapText = gap === undefined ? null : `£${Math.abs(gap).toLocaleString("en-GB")}m`;
  const shortName = councilName.replace(/ Council$/, "");
  const biggest = BRIDGING_ACTIONS[0];

  return (
    <section id="why-more-money" className="pt-14 scroll-mt-24">
      <p className="kicker mb-2 text-[var(--action)]">The bit nobody explains</p>
      <h2 className="h2 mb-3">Why your council says it needs more money</h2>
      <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
        Councils say they need more money nearly every year, whatever they are given. Here is
        what that really means, and who ends up paying for it.
      </p>

      {/* The pattern, stated first. This is the part a reader can repeat. */}
      <div className="mt-6 rounded-[var(--r-m)] border border-[var(--action)] bg-[var(--action-tint)] p-5 sm:p-6">
        <p className="text-[26px] font-[800] leading-[1.2] text-[var(--ink)] sm:text-[30px]">
          {NATIONAL.councilsWithGap} of Scotland&rsquo;s {NATIONAL.councilsTotal} councils said
          they needed more money this year.
        </p>
        <p className="mt-3 max-w-[62ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
          Only {NATIONAL.surplusCouncil} said it had money left over.{" "}
          {hasGap ? (
            <>
              <strong className="text-[var(--ink)]">
                {shortName} said it needed {gapText} more.
              </strong>
            </>
          ) : hasSurplus ? (
            <>
              <strong className="text-[var(--ink)]">
                {shortName} was the one that did not — it had {gapText} left over.
              </strong>
            </>
          ) : null}
        </p>
        <p className="mt-3 max-w-[62ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
          The money from the Scottish Government went <strong className="text-[var(--ink)]">up</strong>{" "}
          that year, not down. Councils got {NATIONAL.totalFunding}. That is{" "}
          {NATIONAL.revenueChange} on the year before, even after prices rose. And the amount they
          say they are short has stayed about the same for {NATIONAL.gapYears} years running. It
          works out at {NATIONAL.gapSharePence}.
        </p>
      </div>

      {/* What a gap is. The single most useful thing on the page. */}
      <div className="mt-6 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
        <h3 className="ui mb-3 text-[19px] font-[750] leading-[1.3] text-[var(--ink)]">
          So what is a &ldquo;budget gap&rdquo;?
        </h3>
        <p className="max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
          Before a council sets its budget, it works out two numbers. What it thinks its
          services will cost. And what money it thinks it will get.
        </p>
        <p className="mt-3 max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
          If the cost is bigger, the difference is the gap. It is a plan, made before any
          decisions. <strong className="text-[var(--ink)]">It is not money missing from a bank
          account.</strong>
        </p>
        <p className="mt-3 max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
          The law says a council cannot plan to spend more than it gets. So the gap always gets
          closed. It has to be. The real question is who pays to close it.
        </p>
      </div>

      {/* Who paid. */}
      <div className="mt-6 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
        <h3 className="ui mb-1 text-[19px] font-[750] leading-[1.3] text-[var(--ink)]">
          Who paid to close it
        </h3>
        <p className="mb-4 max-w-[66ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
          This is every council added together, for {" "}
          <span className="tnum">2026/27</span>.
        </p>

        <ul className="grid gap-2">
          {BRIDGING_ACTIONS.map((row, index) => (
            <li key={row.action} className="grid grid-cols-[1fr_auto] items-center gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span
                    className={`ui text-[16px] leading-[1.4] ${
                      index === 0 ? "font-[750] text-[var(--ink)]" : "text-[var(--ink-2)]"
                    }`}
                  >
                    {row.action}
                  </span>
                  {row.amount ? (
                    <span className="ui tnum text-[15px] text-[var(--muted)]">{row.amount}</span>
                  ) : null}
                </div>
                <div
                  aria-hidden="true"
                  className="mt-1 h-2 rounded-full bg-[var(--rule)]"
                >
                  <div
                    className={`h-2 rounded-full ${
                      index === 0 ? "bg-[var(--action)]" : "bg-[var(--brand)]"
                    }`}
                    style={{ width: `${row.share}%` }}
                  />
                </div>
              </div>
              <span className="ui tnum shrink-0 text-[15px] font-[750] text-[var(--ink-2)]">
                {row.share}%
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-5 max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink)]">
          <strong>The biggest single way the gap was closed was your council tax.</strong>{" "}
          {biggest.amount} of it. Every council in Scotland put its rate up, by{" "}
          {COUNCIL_TAX.averageIncrease} on average — from {COUNCIL_TAX.lowestIncrease.value} in{" "}
          {COUNCIL_TAX.lowestIncrease.council} to {COUNCIL_TAX.highestIncrease.value} in{" "}
          {COUNCIL_TAX.highestIncrease.council}. That was the second year in a row. Over the two
          years together, bills went up {COUNCIL_TAX.twoYearAverage} on average.
        </p>
      </div>

      {/* The suspicion, answered straight. */}
      <div className="mt-6 rounded-[var(--r-m)] border border-[var(--brand)] bg-[var(--brand-wash)] p-5 sm:p-6">
        <h3 className="ui mb-3 text-[19px] font-[750] leading-[1.3] text-[var(--ink)]">
          Do they lose money if they spend less?
        </h3>
        <p className="max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
          A lot of people assume a council has to spend the lot, or it gets less next year.
          That is not how the grant works.
        </p>
        <p className="mt-3 max-w-[66ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
          The Scottish Government works out each council&rsquo;s share using a formula. It counts
          things the council cannot change:
        </p>
        <ul className="mt-3 grid gap-2">
          {FORMULA_COUNTS.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-[16px] leading-[1.55] text-[var(--ink-2)]"
            >
              <span aria-hidden="true" className="text-[var(--brand)]">
                &bull;
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink)]">
          <strong>
            It does not count how well the council managed last year&rsquo;s money.
          </strong>{" "}
          A council that comes in on budget does not get less the next year for doing it.
        </p>
      </div>

      {/* Where the money comes from, for context. */}
      <div className="mt-6 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
        <h3 className="ui mb-3 text-[19px] font-[750] leading-[1.3] text-[var(--ink)]">
          Where every £1 comes from
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {FUNDING_MIX.map((row) => (
            <li
              key={row.source}
              className="flex items-baseline gap-3 rounded-[var(--r-s)] border border-[var(--rule)] px-3 py-2"
            >
              <span className="ui tnum text-[19px] font-[800] text-[var(--brand)]">
                {row.pence}p
              </span>
              <span className="text-[15.5px] leading-[1.45] text-[var(--ink-2)]">{row.source}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-[66ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
          Council tax is only about a fifth of the money. So when a council puts it up, the
          extra it raises is small next to the whole budget — but it comes straight out of
          your pocket.
        </p>
      </div>

      <p className="mt-6 max-w-[68ch] text-[17px] font-[750] leading-[1.5] text-[var(--ink)]">
        Those are the facts. What you make of them is up to you.
      </p>

      <p className="mt-4 max-w-[68ch] text-[15.5px] leading-[1.55] text-[var(--muted)]">
        {outlier
          ? `${shortName} is left out of Audit Scotland's comparison chart. It has a large pot of harbour money set aside, which makes it very different from the rest. `
          : ""}
        {COMPARISON_CAVEAT} Figures from{" "}
        <a href={BUDGET_SOURCE.url} rel="noopener noreferrer" target="_blank">
          {BUDGET_SOURCE.title}
        </a>
        , {BUDGET_SOURCE.publisher}, June 2026. How the formula works is set out by{" "}
        <a href={FORMULA_SOURCE.url} rel="noopener noreferrer" target="_blank">
          {FORMULA_SOURCE.publisher}
        </a>
        .
      </p>
    </section>
  );
}
