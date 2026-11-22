import Link from "@/components/IntentLink";
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
  { name: "David Mundell", slug: "dumfriesshire-clydesdale-and-tweeddale", p: "Conservative", amount: 418.25, detail: "4 years running (half shares, then the full fee in Feb 2026)" },
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
            <strong>84 claims</strong> billed <strong>£10,754</strong>. That would pay 59 homes&apos;
            licences at today&apos;s £180 fee.
          </>,
          <>
            <strong>21 of the 29</strong> are Scottish Labour. By share, the Lib Dems lead:{" "}
            <strong>4 of their 6 MPs</strong> claimed.
          </>,
        ]}
      />

      <CaseCard
        kicker="Four licences in under a year"
        figure="£688"
        people={[{ name: "Gregor Poynton", href: mp("livingston"), p: "Labour", place: "Livingston" }]}
      >
        <p>
          He billed £169.50 on 18 Dec 2024, then £169.50 again on 14 Feb 2025.
        </p>
        <p>
          Two more followed on 4 Nov and 26 Nov 2025, worth £349 together. IPSA&apos;s files do not
          say why he needed four licences in less than a year.
        </p>
      </CaseCard>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} of={FINDINGS} id="why-tv-licence">
        Why do taxpayers buy MPs a TV licence?
      </Finding>
      <P>
        IPSA (the body that pays MPs&apos; expenses) lets MPs claim a TV licence for their local
        office. The idea is that staff may need to watch live news or Parliament TV. MPs cannot
        claim one for their own home or London flat.
      </P>
      <P>
        You only need a licence for live TV or BBC iPlayer. Not for news websites, radio or YouTube.
      </P>
      <P>The other 28 Scottish MPs claimed nothing for a TV licence in these files.</P>

      <Tiles
        items={[
          { value: "29", label: "Scottish MPs who claimed a TV licence", hot: true },
          { value: "28", label: "Scottish MPs who claimed £0" },
          { value: "£180", label: "The TV licence fee from April 2026, up from £174.50" },
        ]}
      />

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} of={FINDINGS} id="standout-claims">
        The other claims that stand out
      </Finding>

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
          That was the day before the fee rose to £180. His files show one local office. They do
          not say why he needed two licences.
        </p>
      </CaseCard>

      <CaseCard
        kicker="£5 over the fee, every year"
        figure="£682"
        people={[{ name: "Ian Murray", href: mp("edinburgh-south"), p: "Labour", place: "Edinburgh South" }]}
      >
        <p>
          Four licences over four years. Each time he billed £5 more than the yearly fee, the extra
          you pay to spread a licence over four payments instead of one.
        </p>
      </CaseCard>

      <CaseCard
        kicker="Two island offices, after money paid back"
        figure="£834"
        people={[{ name: "Alistair Carmichael", href: mp("orkney-and-shetland"), p: "Lib Dem", place: "Orkney and Shetland" }]}
      >
        <p>
          He billed <strong>£1,080.25</strong> for licences at his Orkney and Shetland offices. He
          later paid back <strong>£246.25</strong>, partly as his local MSP&apos;s (member of the
          Scottish Parliament) half share. He is the only one of the 29 who paid any back.
        </p>
      </CaseCard>

      <CaseCard
        kicker="Five years in a row"
        figure="£842"
        people={[{ name: "Christine Jardine", href: mp("edinburgh-west"), p: "Lib Dem", place: "Edinburgh West" }]}
      >
        <p>She claimed a TV licence every year from 2022/23 to May 2026, including the new £180 fee.</p>
      </CaseCard>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} of={FINDINGS} id="party-breakdown">
        By party: Scottish Labour makes up 63% of the bill
      </Finding>
      <P>
        Labour has the most Scottish MPs, so it tops the bill. But look at the share of each
        party&apos;s MPs who claimed.
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

      <P>
        <strong>Share who claimed:</strong> Lib Dems 4 of 6 MPs. Labour 21 of 37. Conservatives 2 of
        6. SNP 2 of 8.
      </P>

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

      <Aside title="Paid by IPSA, within its rules">
        <p>
          IPSA paid every one of these 84 claims. Its rules let MPs claim a TV licence for a local
          office. See <Link href="/mp-expenses-scotland">all 57 Scottish MPs ranked</Link> or{" "}
          <Link href="/mp-expenses-scotland/receipts">the oddest claims</Link>.
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
