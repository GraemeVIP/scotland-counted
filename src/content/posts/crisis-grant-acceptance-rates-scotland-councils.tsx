import Link from "next/link";
import { Aside, H2, H3, Lead, LI, P, PostCTA, Prose, UL } from "@/components/Prose";
import {
  CRISIS_GRANT_CSV_URL,
  CRISIS_GRANT_SOURCE_URL,
  CRISIS_GRANT_TABLES_URL,
  CRISIS_GRANT_YEARS,
  crisisGrantCouncilsByAcceptance,
  crisisGrantScotland,
} from "@/lib/data/crisisGrants";

const inverclyde = crisisGrantCouncilsByAcceptance[0];
const midlothian = crisisGrantCouncilsByAcceptance.at(-1)!;

function signed(value: number) {
  if (value === 0) return "same as Scotland";
  return `${value > 0 ? "+" : "−"}${Math.abs(value)} ${Math.abs(value) === 1 ? "point" : "points"}`;
}

function ExtremeHistory() {
  return (
    <figure className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="border-b border-[var(--rule)] pb-4">
        <p className="ui text-[15px] font-[760] text-[var(--brand)]">Five years of the same comparison</p>
        <h3 className="mt-1 text-[22px] font-[760] leading-[1.25]">The two ends of the table stay far apart</h3>
      </div>

      <div className="mt-6 space-y-6">
        {CRISIS_GRANT_YEARS.map((year, index) => (
          <div key={year}>
            <p className="ui text-[15px] font-[750] text-[var(--ink)]">{year}</p>
            <div className="mt-2 space-y-2.5">
              {[
                { name: "Inverclyde", value: inverclyde.acceptanceHistory[index], color: "bg-[var(--brand)]" },
                { name: "Midlothian", value: midlothian.acceptanceHistory[index], color: "bg-[var(--action)]" },
              ].map((row) => (
                <div key={row.name}>
                  <div className="flex items-baseline justify-between gap-4 text-[15px] leading-[1.4]">
                    <span className="font-[650] text-[var(--ink-2)]">{row.name}</span>
                    <span className="tnum font-[760] text-[var(--ink)]">{row.value}%</span>
                  </div>
                  <div className="mt-1 h-3 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
                    <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <figcaption className="mt-6 border-t border-[var(--rule)] pt-4 text-[15px] leading-[1.6] text-[var(--ink-2)]">
        Inverclyde&apos;s published rate was 77% to 89% in every year shown. Midlothian&apos;s was 49% to
        57%. That persistence makes the gap an accountability question, but it still does not identify
        the cause. Source: Scottish Government, Table 28.
      </figcaption>
    </figure>
  );
}

function CouncilTable() {
  return (
    <figure className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--rule)] pb-4">
        <div>
          <p className="ui text-[15px] font-[760] text-[var(--brand)]">All 32 councils</p>
          <h3 className="mt-1 text-[22px] font-[760] leading-[1.25]">Crisis Grant decisions resulting in an award</h3>
        </div>
        <p className="ui text-[15px] text-[var(--muted)]">Financial year 2025/26</p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-[720px] border-collapse text-[15px] tnum">
          <thead>
            <tr>
              <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-left font-[700]">#</th>
              <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-left font-[700]">Council</th>
              <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-right font-[700]">Award rate</th>
              <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-right font-[700]">vs Scotland</th>
              <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-right font-[700]">Awards / decisions</th>
              <th className="border-b-2 border-[var(--ink)] pb-2 text-right font-[700]">On time*</th>
            </tr>
          </thead>
          <tbody>
            {crisisGrantCouncilsByAcceptance.map((row) => {
              const extreme = row.slug === "inverclyde" || row.slug === "midlothian";
              return (
                <tr key={row.slug} className={extreme ? "bg-[var(--surface-2)]" : undefined}>
                  <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-[var(--muted)]">{row.rank}</td>
                  <td className="border-b border-[var(--rule)] py-2.5 pr-4 font-[650]">
                    <Link href={`/councils/${row.slug}`}>{row.council}</Link>
                  </td>
                  <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-right font-[780]">{row.acceptanceRate}%</td>
                  <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-right text-[var(--ink-2)]">{signed(row.differenceFromScotland)}</td>
                  <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-right text-[var(--ink-2)]">
                    {row.awards.toLocaleString("en-GB")} / {row.decisions.toLocaleString("en-GB")}
                  </td>
                  <td className="border-b border-[var(--rule)] py-2.5 text-right text-[var(--ink-2)]">{row.processedByNextWorkingDay}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <figcaption className="mt-5 border-t border-[var(--rule)] pt-4 text-[15px] leading-[1.6] text-[var(--ink-2)]">
        Scotland: {crisisGrantScotland.acceptanceRate}%. Rates are ordered highest to lowest; ties
        share a rank. Counts are published rounded to the nearest five. *On time is the share of
        initial decisions made by the end of the next working day in the latest quarter, January to
        March 2026, not the whole financial year.
      </figcaption>
    </figure>
  );
}

export default function Post() {
  return (
    <Prose>
      <Lead>
        A person facing an emergency applies to the same Scottish Welfare Fund scheme wherever they
        live. But in 2025/26, the share of decided Crisis Grant applications resulting in an award
        ranged from 89% in Inverclyde to 52% in Midlothian.
      </Lead>

      <P>
        That 37-point gap is real and it is large. It also appeared across thousands of decisions and
        has persisted for five years. The official statistics do not tell us that applicants in every
        area had identical circumstances. They do tell us that &quot;it is only a few unusual cases&quot; is
        not an adequate explanation.
      </P>

      <H2 id="short-answer">The story in three numbers</H2>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-3">
        {[
          { value: "89%", label: "Inverclyde award rate", note: "1,765 awards · about 1,980 decisions" },
          { value: "52%", label: "Midlothian award rate", note: "3,815 awards · about 7,320 decisions" },
          { value: "37", label: "percentage-point gap", note: `Scotland overall: ${crisisGrantScotland.acceptanceRate}%` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5">
            <p className="display-stat text-[38px] leading-none text-[var(--action)]">{stat.value}</p>
            <p className="mt-3 text-[16px] font-[700] leading-[1.4] text-[var(--ink)]">{stat.label}</p>
            <p className="mt-2 text-[15px] leading-[1.5] text-[var(--muted)]">{stat.note}</p>
          </div>
        ))}
      </div>

      <Aside title="The clearest honest conclusion">
        <p>
          The figures prove a persistent postcode difference in outcomes. They do not prove that one
          council is compassionate, another is ruthless, or that every application should have been
          decided the same way. Those are claims about causes and decision quality, and they need
          evidence the national table does not contain.
        </p>
      </Aside>

      <H2 id="every-council">Every Scottish council compared</H2>
      <P>
        The official measure is the proportion of decided applications that resulted in an award.
        &quot;Application&quot; matters: these are not 258,490 different people. Somebody can apply more than
        once, and the scheme normally limits awards to three in a rolling 12 months unless an exception
        is justified.
      </P>

      <CouncilTable />

      <P>
        The range is not simply one high council and one low council. Angus and Dundee City were also
        well above Scotland, at 79% and 78%. Highland was next to the bottom at 53%. Fifteen councils
        were above Scotland&apos;s 65%, one matched it and sixteen were below it when using the published
        whole-percentage rates.
      </P>

      <H2 id="persistent">Why one year is not enough</H2>
      <P>
        A single year can be distorted by a change in demand, a backlog or a small number of cases.
        The two councils at the ends of the 2025/26 table do not fit that easy explanation. Inverclyde
        stayed high and Midlothian stayed low in every year from 2021/22 to 2025/26.
      </P>

      <ExtremeHistory />

      <P>
        Nor are these tiny samples. The latest annual table records about 1,980 decisions in Inverclyde
        and 7,320 in Midlothian. Different applicant circumstances may still matter, but the persistence
        and volume make the gap a legitimate question about how the scheme operates locally.
      </P>

      <H2 id="explanations">What might explain the gap</H2>
      <P>
        Councils administer the scheme under national statutory guidance, but they assess individual
        applications and manage local demand. Several explanations could move a council&apos;s rate. The
        national statistics do not separate their effects.
      </P>

      <UL>
        <LI><strong>Different applications.</strong> The mix of emergencies, household resources, repeat applications and evidence available may vary by area.</LI>
        <LI><strong>Different local practice.</strong> Staff may ask questions, seek evidence, interpret priority and record outcomes differently while working inside the same guidance.</LI>
        <LI><strong>What happens before an application is counted.</strong> Advice, referral or informal screening can affect who reaches a recorded decision.</LI>
        <LI><strong>Budget pressure.</strong> The Scottish Government&apos;s publication says pressure on available budgets weighed on award rates before additional funding was provided. That is a national observation, not proof of what caused one council&apos;s rate.</LI>
        <LI><strong>Reviews and data quality.</strong> Refusals can be changed on review, but the workbook warns that review data can be incomplete for councils that have not supplied all records.</LI>
      </UL>

      <P>
        That is precisely why the disparity is a story rather than a verdict. A 37-point gap should
        trigger disclosure and comparison. It should not be filled with a motive that has not been
        evidenced.
      </P>

      <H2 id="limits">What the figures cannot prove</H2>
      <UL>
        <LI>They do not show whether applications in different councils had the same facts or urgency.</LI>
        <LI>They do not tell us how many people were discouraged, diverted or helped before a formal decision.</LI>
        <LI>They do not measure whether an award was enough to resolve the emergency.</LI>
        <LI>A high rate is not automatically proof of better decisions, and a low rate is not automatically proof of cruelty or illegality.</LI>
        <LI>The rank is an outcome comparison, not a league table of council quality.</LI>
      </UL>

      <Aside title="Speed is a separate question">
        <p>
          Crisis Grant decisions should be made by the end of the next working day. Nationally, 98%
          met that deadline in January to March 2026. Local rates ranged from 67% in Shetland to 100%
          in nine councils. A fast refusal and a slow award answer different accountability questions,
          so the table keeps speed and award rate separate.
        </p>
      </Aside>

      <H2 id="questions">The questions every council should answer</H2>
      <P>
        A useful response needs more than &quot;every case is considered on its merits&quot;. Councils should
        publish evidence that lets residents see why their outcomes differ from the rest of Scotland.
      </P>

      <H3>Questions for the council</H3>
      <UL>
        <LI>Why is your award rate above or below the Scotland rate, and what analysis supports that explanation?</LI>
        <LI>What local guidance, priority rules and evidence requirements do decision-makers use?</LI>
        <LI>How many potential applicants are advised or redirected before a formal application is recorded?</LI>
        <LI>How do budget pressure and remaining funds affect decisions during the year?</LI>
        <LI>How many refusals are reviewed, how many are changed and is the review data complete?</LI>
        <LI>What quality checks test whether different staff make consistent decisions on similar facts?</LI>
        <LI>Will the council publish anonymised reasons for awards and refusals in a form that can be compared nationally?</LI>
      </UL>

      <P>
        Scotland Counted will add a clearly labelled response from any council and correct any figure
        that does not match the official source. The question is not whether staff can defend one
        application in isolation. It is why a national safety net produces such different aggregate
        outcomes depending on the council receiving it.
      </P>

      <H2 id="refused">If your Crisis Grant application was refused</H2>
      <P>
        Ask for the written reason and request a first-tier review from the council. The statutory
        guidance says this should normally be requested within 20 working days of the decision. A
        Crisis Grant review should be decided within two working days, and a review cannot reduce or
        take away an award already made.
      </P>
      <P>
        Explain what was misunderstood, supply missing evidence and describe the immediate harm in
        concrete terms. The <Link href="/blog/crisis-grant-scotland-how-to-apply">Crisis Grant application guide</Link> has
        a plain-English checklist, and each <Link href="/councils">council accountability page</Link> now shows the local
        rate beside Scotland and the five-year history.
      </P>

      <H2 id="data">Download the data and check the method</H2>
      <P>
        The Scottish Government published this update on 28 July 2026. Scotland Counted extracted
        Tables 6, 18, 24, 28 and 36 from the official workbook. Rankings use the published whole
        percentages, highest to lowest, with tied councils sharing a rank. Differences and annual
        changes are percentage points, not percent changes.
      </P>
      <P>
        Council counts are rounded independently to the nearest five, so awards plus rejections can
        differ slightly from decisions and the 32 councils do not always add exactly to the separately
        published Scotland total. The latest-quarter processing figures may also be revised as pending
        cases and delayed records are resolved. Nothing here substitutes a local rate for case-level
        evidence.
      </P>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        <a href={CRISIS_GRANT_CSV_URL} download className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 no-underline hover:border-[var(--brand)]">
          <span className="label">Prepared CSV · 32 councils</span>
          <strong className="mt-2 block text-[19px] leading-[1.3]">Download the journalist-ready table</strong>
          <span className="mt-2 block text-[15px] leading-[1.5] text-[var(--ink-2)]">Five years of rates, decisions, awards, spending, average awards and latest processing performance.</span>
          <span className="ui mt-4 block text-[15px] font-[680] text-[var(--brand)]">Download CSV ↓</span>
        </a>
        <a href={CRISIS_GRANT_TABLES_URL} className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 no-underline hover:border-[var(--brand)]">
          <span className="label">Official source workbook</span>
          <strong className="mt-2 block text-[19px] leading-[1.3]">Check every number at source</strong>
          <span className="mt-2 block text-[15px] leading-[1.5] text-[var(--ink-2)]">The Scottish Government Excel workbook, with notes, definitions and all Scottish Welfare Fund tables.</span>
          <span className="ui mt-4 block text-[15px] font-[680] text-[var(--brand)]">Open workbook →</span>
        </a>
      </div>

      <P>
        The publication and its commentary are available on the <a href={CRISIS_GRANT_SOURCE_URL}>Scottish Government website</a>.
        If you use the prepared file, cite Scottish Government as the data source and Scotland Counted
        for the extraction and ranking.
      </P>

      <PostCTA
        title="Ask your council to explain its rate"
        body="Open the local accountability page, compare the five-year outcome with Scotland and use the questions above. The purpose of the ranking is to secure an evidenced explanation, not to guess one."
        href="/councils"
        cta="Choose a council"
      />
    </Prose>
  );
}
