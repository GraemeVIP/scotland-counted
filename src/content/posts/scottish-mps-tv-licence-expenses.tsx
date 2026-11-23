import Link from "@/components/IntentLink";
import { ExpenseMpCheck, ExpenseNextUp } from "@/components/ExpenseStoryRail";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";
import {
  type PartyKey,
  type RankRow,
  PARTY,
  gbp,
  Dot,
  Who,
  QuickTake,
  Finding,
  ChartFrame,
  Bar,
  RankList,
  CaseCard,
  Face,
  Spotlight,
  Tiles,
  Expand,
} from "@/components/ExpenseKit";

/*
 * Written in Graeme's voice (graeme-writing skill). Every figure comes straight
 * from IPSA's published individualBusinessCosts CSV files for 2022/23 to
 * 2026/27 (checked 21 November 2026), filtered to Scotland's 57 current MPs.
 * Quoted descriptions are IPSA's exact wording.
 */

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const FINDINGS = 4;

/** RankList rows numbered from `start`, for the folded rest of the list. */
function MoreRanks({ rows, max, start }: { rows: RankRow[]; max: number; start: number }) {
  return (
    <ol className="divide-y divide-[var(--rule)]">
      {rows.map((r, i) => (
        <li key={r.key} className="flex gap-3 py-4 first:pt-0 last:pb-0">
          <span className="figure-num tnum w-7 shrink-0 text-[20px] leading-[1.2] text-[var(--muted)]">
            {start + i}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              {r.who}
              {r.side && <span className="ui text-[13.5px] text-[var(--muted)]">{r.side}</span>}
            </div>
            <div className="mt-2">
              <Bar value={r.value} max={max} colour={r.colour} label={r.label} />
            </div>
            {r.detail && <p className="ui mt-1.5 text-[14px] leading-[1.45] text-[var(--ink-2)]">{r.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const PARTY_TV: { p: PartyKey; name: string; mps: string; claims: string; amount: number }[] = [
  { p: "Labour", name: "Scottish Labour", mps: "21 of 37 MPs", claims: "51 claims", amount: 6745.5 },
  { p: "Lib Dem", name: "Scottish Liberal Democrats", mps: "4 of 6 MPs", claims: "22 claims", amount: 2753.75 },
  { p: "SNP", name: "Scottish National Party (SNP)", mps: "2 of 8 MPs", claims: "5 claims", amount: 662 },
  { p: "Conservative", name: "Scottish Conservatives", mps: "2 of 6 MPs", claims: "6 claims", amount: 592.75 },
];

const ALL_29_TV_MPS: {
  name: string;
  slug: string;
  p: PartyKey;
  note?: string;
  amount: number;
  detail: string;
}[] = [
  { name: "Christine Jardine", slug: "edinburgh-west", p: "Lib Dem", amount: 842, detail: "5 years running (latest £180 in May 2026)" },
  { name: "Alistair Carmichael", slug: "orkney-and-shetland", p: "Lib Dem", amount: 834, detail: "£1,080.25 billed for two island offices, £246.25 paid back" },
  { name: "Gregor Poynton", slug: "livingston", p: "Labour", amount: 688, detail: "4 licences in under 12 months (Dec 2024 to Nov 2025)" },
  { name: "Ian Murray", slug: "edinburgh-south", p: "Labour", amount: 682, detail: "4 years running, £5 over the yearly fee each time" },
  { name: "Wendy Chamberlain", slug: "north-east-fife", p: "Lib Dem", amount: 662, detail: "4 years running (2022/23 to 2025/26)" },
  { name: "Brendan O'Hara", slug: "argyll-bute-and-south-lochaber", p: "SNP", amount: 487.5, detail: "3 yearly licences" },
  { name: "David Mundell", slug: "dumfriesshire-clydesdale-and-tweeddale", p: "Conservative", amount: 418.25, detail: "4 years in a row. Half the fee each year at first, then the full fee in Feb 2026" },
  { name: "Irene Campbell", slug: "north-ayrshire-and-arran", p: "Labour", amount: 354.5, detail: "Jul 2025 + Jun 2026" },
  { name: "Dr Scott Arthur", slug: "edinburgh-south-west", p: "Labour", amount: 354, detail: "Jan 2025 + Feb 2026" },
  { name: "Dr Zubir Ahmed", slug: "glasgow-south-west", p: "Labour", amount: 349, detail: "Two licences in one year (Jul 2025 + Mar 2026)" },
  { name: "Imogen Walker", slug: "hamilton-and-clyde-valley", p: "Labour", amount: 344, detail: "Dec 2024 + Dec 2025" },
  { name: "Maureen Burke", slug: "glasgow-north-east", p: "Labour", amount: 344, detail: "Feb 2025 + Mar 2026" },
  { name: "Gordon McKee", slug: "glasgow-south", p: "Labour", amount: 344, detail: "Jan 2025 + Jan 2026" },
  { name: "Kirsteen Sullivan", slug: "bathgate-and-linlithgow", p: "Labour", note: "Co-op", amount: 344, detail: "Jan 2025 + Dec 2025" },
  { name: "Alison Taylor", slug: "paisley-and-renfrewshire-north", p: "Labour", amount: 344, detail: "Nov 2024 + Nov 2025" },
  { name: "Michael Shanks", slug: "rutherglen", p: "Labour", amount: 344, detail: "Jul 2024 + Jul 2025" },
  { name: "John Grady", slug: "glasgow-east", p: "Labour", amount: 344, detail: "Mar 2025 + Mar 2026" },
  { name: "Euan Stainbank", slug: "falkirk", p: "Labour", amount: 344, detail: "Jan 2025 + Sep 2025" },
  { name: "Martin McCluskey", slug: "inverclyde-and-renfrewshire-west", p: "Labour", amount: 344, detail: "Feb 2025 + Jan 2026" },
  { name: "Joani Reid", slug: "east-kilbride-and-strathaven", p: "Labour", amount: 180, detail: "May 2026" },
  { name: "Pamela Nash", slug: "motherwell-wishaw-and-carluke", p: "Labour", amount: 174.5, detail: "May 2026" },
  { name: "Kirsty Blackman", slug: "aberdeen-north", p: "SNP", amount: 174.5, detail: "Aug 2025" },
  { name: "Katrina Murray", slug: "cumbernauld-and-kirkintilloch", p: "Labour", amount: 174.5, detail: "Jul 2025" },
  { name: "Lillian Jones", slug: "kilmarnock-and-loudoun", p: "Labour", amount: 174.5, detail: "May 2025" },
  { name: "Chris Kane", slug: "stirling-and-strathallan", p: "Labour", amount: 174.5, detail: "Feb 2026" },
  { name: "Harriet Cross", slug: "gordon-and-buchan", p: "Conservative", amount: 174.5, detail: "Dec 2025" },
  { name: "Tracy Gilbert", slug: "edinburgh-north-and-leith", p: "Labour", amount: 174.5, detail: "Aug 2025" },
  { name: "Torcuil Crichton", slug: "na-h-eileanan-an-iar", p: "Labour", amount: 169.5, detail: "Mar 2025" },
  { name: "Susan Murray", slug: "mid-dunbartonshire", p: "Lib Dem", amount: 169.5, detail: "Sep 2024" },
];

const TV_ROWS: RankRow[] = ALL_29_TV_MPS.map((r) => ({
  key: r.slug,
  who: <Who face name={r.name} href={mp(r.slug)} p={r.p} note={r.note} />,
  value: r.amount,
  label: gbp(r.amount),
  colour: PARTY[r.p].colour,
  detail: r.detail,
}));

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function ScottishMpsTvLicenceExpenses() {
  const top = ALL_29_TV_MPS[0].amount;

  return (
    <Prose>
      <QuickTake
        items={[
          <>
            <Link href={mp("livingston")}>Gregor Poynton</Link> (Labour) billed{" "}
            <strong>£688</strong> for four TV licences in under a year.
          </>,
          <>
            <strong>29 of Scotland&apos;s 57 MPs</strong> put a TV licence on expenses from 2022 to
            2026.
          </>,
          <>
            <strong>84 claims</strong> billed <strong>£10,754</strong>. Enough to cover 59 homes&apos;
            licences at today&apos;s £180 fee.
          </>,
          <>
            <strong>21 of the 29</strong> are Scottish Labour, claiming <strong>£6,745.50</strong>.
          </>,
        ]}
      />

      <ExpenseMpCheck slug="scottish-mps-tv-licence-expenses" />

      <section
        aria-label="Gregor Poynton's four TV licences"
        className="not-prose my-10 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] border-l-[6px] border-l-[var(--bad)] bg-[color-mix(in_srgb,var(--bad)_5%,var(--surface))] text-[var(--ink)] shadow-[0_14px_34px_-26px_rgba(10,16,34,0.45)]"
      >
        <div className="flex items-center gap-3 border-b border-[var(--rule)] px-6 py-4 sm:px-8">
          <Face name="Gregor Poynton" href={mp("livingston")} size={44} />
          <p className="ui text-[15px] font-[620] leading-[1.35]">
            <Link href={mp("livingston")} className="text-[var(--ink)] underline decoration-[var(--rule-strong)] underline-offset-4">
              Gregor Poynton
            </Link>
            <span className="text-[var(--muted)]"> · Labour MP for Livingston</span>
          </p>
        </div>
        <div className="px-6 py-7 sm:px-8 sm:py-9">
          <p className="ui text-[13px] font-[660] uppercase tracking-[0.07em] text-[var(--muted)]">
            One TV licence covers one place for a whole year
          </p>
          <p className="mt-2 text-[28px] font-[720] leading-[1.15] sm:text-[34px]">
            He billed you for <span className="text-[var(--bad-text)]">four</span> in 11 months.
          </p>
          <ol className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { date: "18 Dec 2024", amount: "£169.50", note: "Licence 1" },
              { date: "14 Feb 2025", amount: "£169.50", note: "Licence 2, eight weeks later" },
              { date: "4 Nov 2025", amount: "£174.50", note: "Licence 3" },
              { date: "26 Nov 2025", amount: "£174.50", note: "Licence 4, three weeks later" },
            ].map((l) => (
              <li key={l.date} className="rounded-[var(--r-s)] bg-[var(--surface)] px-4 py-3 ring-1 ring-[var(--rule)]">
                <p className="ui text-[13px] text-[var(--muted)]">{l.date}</p>
                <p className="figure-num tnum mt-1 text-[26px] leading-none text-[var(--bad-text)]">{l.amount}</p>
                <p className="ui mt-1.5 text-[13.5px] text-[var(--ink-2)]">{l.note}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[17px] leading-[1.55] text-[var(--ink-2)]">
            Total for the four licences: <strong>£688</strong>. IPSA, the body that pays MPs&apos;
            expenses with public money, only pays for a TV licence at an MP&apos;s local office. Its
            files don&apos;t say why he needed four, or which buildings they were for.
          </p>
          <p className="mt-3 text-[17px] leading-[1.55]">
            <Link href="/blog/gregor-poynton-mp-four-tv-licences-livingston" className="font-[660] text-[#8bb8ff] underline underline-offset-4">
              Read the full story →
            </Link>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} of={FINDINGS} id="why-tv-licence">
        Why on earth do taxpayers buy MPs a TV licence?
      </Finding>
      <P>
        Under the rules of IPSA (the body that pays MPs&apos; expenses), MPs can&apos;t claim a TV
        licence for a London second home or their own home. But they can for their local office.
        The idea is that staff might need to watch live news or Westminster on TV.
      </P>
      <P>
        In 2026 that rule is well past its sell by date. You don&apos;t need a licence for BBC News
        online, X, radio, YouTube clips or Parliamentlive.tv. You only need one for live TV or BBC
        iPlayer.
      </P>
      <P>
        And the other 28 Scottish MPs claimed £0 for a TV licence, so it&apos;s hardly essential.
        The 29 who did kept claiming as the fee went from £159 to £169.50, then £174.50, and now £180.
      </P>

      <Tiles
        items={[
          { value: "28", label: "Scottish MPs who claimed £0 for a TV licence" },
          { value: "29", label: "Scottish MPs who put it on expenses", hot: true },
          { value: "£180", label: "The TV licence fee from April 2026, up from £174.50" },
        ]}
      />

      <P>
        It doesn&apos;t stop at licences either. <strong>12 Scottish MPs claimed £3,608 for TV sets
        and TV kit</strong> for their offices (after one part refund).
      </P>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} of={FINDINGS} id="standout-claims">
        The claims that jump straight off the page
      </Finding>
      <P>Go through the dates and notes on each claim and four more names stand out straight away.</P>

      <CaseCard
        kicker="Two licences in one year"
        figure="£349"
        people={[{ name: "Dr Zubir Ahmed", href: mp("glasgow-south-west"), p: "Labour", place: "Glasgow South West" }]}
      >
        <p>
          He claimed a <strong>£174.50</strong> licence online on 1 July 2025. On 31 March 2026 he
          claimed a second <strong>£174.50</strong> licence, paid in a Co-op shop.
        </p>
        <p>
          That was the day before the fee went up to £180. Handy timing. His files show one local
          office, and nothing says why it needed two licences.
        </p>
      </CaseCard>

      <Spotlight
        person={{ name: "Dr Zubir Ahmed", href: mp("glasgow-south-west"), p: "Labour", place: "Glasgow South West" }}
        kicker="6 February 2025 · Richer Sounds"
        amount="£715"
        headline="You paid for a £715 television for his office."
        lines={[
          { meta: "Office Costs · Equipment - purchase · Television", what: "WWW.RICHERSOUNDS.COM [200011726-1495]", amount: "£715.00" },
        ]}
      >
        <p>
          No Scottish MP put a dearer TV on expenses. Then the licences to watch it went on
          expenses as well.
        </p>
      </Spotlight>

      <CaseCard
        kicker="£5 over the fee, every year"
        figure="£682"
        people={[{ name: "Ian Murray", href: mp("edinburgh-south"), p: "Labour", place: "Edinburgh South" }]}
      >
        <p>
          Four licences in four years, and every time he billed £5 over the yearly fee. The extra
          £5 is what you&apos;re charged for paying in four chunks instead of all at once.
        </p>
      </CaseCard>

      <Spotlight
        person={{ name: "Dr Scott Arthur", href: mp("edinburgh-south-west"), p: "Labour", place: "Edinburgh South West" }}
        kicker="April and May 2025 · Currys"
        amount="£467"
        headline="You paid for two TVs for his office, six weeks apart."
        lines={[
          { meta: "13 April 2025 · Television", what: "CURRYS ONLINE", amount: "£218.00" },
          { meta: "26 May 2025 · Television", what: "CURRYS ONLINE", amount: "£249.00" },
        ]}
      >
        <p>
          And on top of the two sets, he claimed <strong>£354</strong> for TV licences.
        </p>
      </Spotlight>

      <CaseCard
        kicker="Two island offices, after money paid back"
        figure="£834"
        people={[{ name: "Alistair Carmichael", href: mp("orkney-and-shetland"), p: "Lib Dem", place: "Orkney and Shetland" }]}
      >
        <p>
          He billed taxpayers <strong>£1,080.25</strong> for TV licences at his Orkney and
          Shetland offices.
        </p>
        <p>
          He shares office space with the islands&apos; MSPs (members of the Scottish Parliament).
          The MSPs pay half of each licence they share. So he paid IPSA back{" "}
          <strong>£246.25</strong> when their half came in.
        </p>
        <p>
          That still leaves <strong>£834</strong> of public money on his licences. But he&apos;s
          the only one of the 29 MPs who paid any of it back.
        </p>
      </CaseCard>

      <CaseCard
        kicker="Five years in a row"
        figure="£842"
        people={[{ name: "Christine Jardine", href: mp("edinburgh-west"), p: "Lib Dem", place: "Edinburgh West" }]}
      >
        <p>
          She claimed a TV licence every single year from 2022/23 to May 2026, new £180 fee and all.
        </p>
      </CaseCard>

      <Spotlight
        person={{ name: "Christine Jardine", href: mp("edinburgh-west"), p: "Lib Dem", place: "Edinburgh West" }}
        kicker="19 December 2025 · six days before Christmas"
        amount="£510"
        headline="You paid for her office Christmas lunch and team day."
        lines={[
          { what: "lunch staff team training Christmas", amount: "£250.80" },
          { what: "team building event", amount: "£259.31" },
        ]}
      >
        <p>It was filed with the word &quot;training&quot; in it, and it went straight through.</p>
        <p>
          <Link href="/blog/christine-jardine-mp-christmas-lunch-expenses" className="font-[660] text-[#8bb8ff] underline underline-offset-4">
            Read the full story →
          </Link>
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 3 */}
      <ExpenseNextUp slug="scottish-mps-tv-licence-expenses" />

      <Finding n={3} of={FINDINGS} id="party-breakdown">
        By party: Scottish Labour makes up 63% of the bill
      </Finding>
      <P>
        Same story as second home council tax and London hotels: Labour tops this list too. 21 of
        Labour&apos;s 37 Scottish MPs billed a TV licence (57%). Only two of the SNP&apos;s eight
        MPs did, and two of the six Tories.
      </P>

      <ChartFrame
        kicker="IPSA 2022/23 to 2026/27 · TV Licence Claims by Party"
        title="Which parties billed taxpayers for TV licences?"
        caption={
          <>
            All Scottish MPs: <strong>29 MPs, 84 claims, £10,754.00 billed</strong>. The Lib Dem
            total includes £246.25 that Alistair Carmichael later paid back. Source: IPSA files
            (2022/23 to 2026/27) for Scotland&apos;s 57 MPs.
          </>
        }
      >
        <RankList
          rows={PARTY_TV.map((t) => ({
            key: t.p,
            who: (
              <span className="ui flex items-center gap-2 font-[620] text-[var(--ink)]">
                <Dot p={t.p} />
                {t.name}
              </span>
            ),
            side: `${t.mps} · ${t.claims}`,
            value: t.amount,
            label: gbp(t.amount),
            colour: PARTY[t.p].colour,
          }))}
        />
      </ChartFrame>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} of={FINDINGS} id="full-list">
        Every Scottish MP who billed a TV licence (2022 to 2026)
      </Finding>
      <P>
        The top 10 are below. Tap any name to see their page. Or{" "}
        <Link href="/mp-expenses-scotland/search?q=TV%20licence">
          check all 84 raw TV licence claims in our search tool
        </Link>
        .
      </P>

      <ChartFrame
        kicker="Top 10 of 29 Scottish MPs · 2022/23 to 2026/27"
        title="The biggest TV licence bills"
        caption="Ranked by the amount kept after any money paid back. Only Alistair Carmichael paid any back (£246.25). IPSA can split one licence across two tax years."
      >
        <RankList max={top} rows={TV_ROWS.slice(0, 10)} />
      </ChartFrame>

      <Expand summary="See the other 19 MPs (£169.50 to £344 each)">
        <MoreRanks max={top} rows={TV_ROWS.slice(10)} start={11} />
      </Expand>

      <Aside title="IPSA signed off all 84">
        <p>
          Its own rules let MPs put a TV licence for a local office on expenses, so nobody gets
          told no. See <Link href="/mp-expenses-scotland">all 57 Scottish MPs ranked</Link> or{" "}
          <Link href="/blog/worst-scottish-mp-expenses">the worst claims we found</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See all 84 TV licence claims (or search 20,879 more)"
        body="Open our live search tool on TV licences. Copy any claim for X or WhatsApp, or email your MP direct."
        href="/mp-expenses-scotland/search?q=TV%20licence"
        cta="Open the TV licence receipts"
      />
    </Prose>
  );
}
