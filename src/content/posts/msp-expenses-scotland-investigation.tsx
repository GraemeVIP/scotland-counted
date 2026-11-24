import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, Lead, P, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense claim comes
 * directly from the Scottish Parliament Open Data API
 * (AllowancesMemberTransactions: 242,844 receipts from April 2016 to June 2025)
 * and the Session 7 Register of Interests (1,785 records covering all 129
 * sitting MSPs, downloaded and checked 22 November 2026). Quoted descriptions
 * are the Parliament's own published wording and are not edited.
 * Company check: Craigview Strategies Limited (Companies House SC646066).
 * Nobody was contacted for comment.
 *
 * The 77.8% figure is the share of the Greens' 2024/25 Engagement Provision
 * (leaflets, mail and ads) spending claimed in March 2025: £83,886 of £107,884.
 */

import {
  type PartyKey,
  type RankRow,
  PARTY,
  gbp,
  Dot,
  Party,
  Who,
  QuickTake,
  Finding as KitFinding,
  ChartFrame,
  Swatch,
  Bar,
  RankList,
  Receipt as KitReceipt,
  CaseCard,
  Tiles,
  PartyList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const msp = (path: string) => `/representatives/msps/${path}`;

const FINDINGS = 8;

function Finding({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <KitFinding n={n} of={FINDINGS} id={id}>
      {children}
    </KitFinding>
  );
}

function Receipt(props: Parameters<typeof KitReceipt>[0]) {
  return <KitReceipt footer="Wording exactly as published by the Scottish Parliament." {...props} />;
}

/** One ranked row, drawn the same way as the kit's RankList, with its own number. */
function RankItem({ r, n, max }: { r: RankRow; n: number; max: number }) {
  return (
    <li className="flex gap-3 py-4 first:pt-0 last:pb-0">
      <span className="figure-num tnum w-7 shrink-0 text-[20px] leading-[1.2] text-[var(--muted)]">{n}</span>
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
  );
}

/** Top few rows on show, the rest folded away (numbering carries on). */
function RankFold({ rows, show = 3, more }: { rows: RankRow[]; show?: number; more: string }) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <>
      <RankList rows={rows.slice(0, show)} max={max} />
      {rows.length > show && (
        <Expand summary={more}>
          <ol className="divide-y divide-[var(--rule)]">
            {rows.slice(show).map((r, i) => (
              <RankItem key={r.key} r={r} n={show + i + 1} max={max} />
            ))}
          </ol>
        </Expand>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const PARTY_TALLY: {
  p: PartyKey;
  name: string;
  size: string;
  avg: number;
  promo: string;
  march: number;
  flat: string;
  travel: string;
}[] = [
  { p: "Lib Dem", name: "Scottish Liberal Democrats", size: "4 MSPs", avg: 41738, promo: "£9,434", march: 18.1, flat: "£8,962 (£8,944 CT)", travel: "£10,437 (£34,309 flights)" },
  { p: "Greens", name: "Scottish Green Party", size: "7 MSPs", avg: 35974, promo: "£15,412", march: 77.8, flat: "£6,629 (£3,636 CT)", travel: "£2,129 (9,991 car miles)" },
  { p: "Conservative", name: "Scottish Conservatives", size: "31 MSPs", avg: 35677, promo: "£12,689", march: 29.3, flat: "£9,438 (£51,968 CT)", travel: "£3,492 (190,128 car miles)" },
  { p: "SNP", name: "Scottish National Party", size: "62 MSPs", avg: 35364, promo: "£9,238", march: 31.3, flat: "£7,393 (£87,890 CT)", travel: "£2,172 (174,045 car miles)" },
  { p: "Labour", name: "Scottish Labour", size: "21 MSPs", avg: 31906, promo: "£11,842", march: 46.3, flat: "£5,453 (£8,936 CT)", travel: "£2,579 (58,203 car miles)" },
];

const promoNum = (s: string) => Number(s.replace(/[£,]/g, ""));

const GREENS_SCORECARD = [
  { name: "Ross Greer", href: msp("regions/west-scotland/ross-greer"), total: 168793, print: "£47,167", hotels: "£31,916", other: "£1,000 consultancy, three £159 TV licences, £396 hotel cancellation fee" },
  { name: "Ariane Burgess", href: msp("regions/highlands-and-islands/ariane-burgess"), total: 161785, print: "£45,255", hotels: "£2,888", other: "£18,260 on consultants, 23 flights (£3,620: 19 hers, 4 for staff), £3,713 car hire, 140 taxis (£1,033)" },
  { name: "Mark Ruskell", href: msp("regions/mid-scotland-and-fife/mark-ruskell"), total: 141472, print: "£38,620", hotels: "£31,927", other: "19,204 car miles (£8,642), £12,375 on research and rail consultants" },
  { name: "Patrick Harvie", href: msp("regions/glasgow/patrick-harvie"), total: 132308, print: "£49,499", hotels: "£26,215", other: "£17,400 leaflet bill on 28 March 2025, £2,990 for Trello (online planning software), £169.50 TV licence" },
  { name: "Maggie Chapman", href: msp("regions/north-east-scotland/maggie-chapman"), total: 112311, print: "£37,343", hotels: "£0", other: "16,412 car miles (£7,385), £6,979 office decorating and new floor" },
  { name: "Gillian Mackay", href: msp("regions/central-scotland-and-lothians-west/gillian-mackay"), total: 92960, print: "£40,363", hotels: "£8,003", other: "£16,380 on leaflets in March 2025 alone" },
  { name: "Lorna Slater", href: msp("constituencies/edinburgh-central"), total: 42658, print: "£28,509", hotels: "£0", other: "£3,000 media coaching while a minister, £3,430 newspapers, £1,764 event food" },
];

/** 2024/25 amounts only: payments made early for 2025/26 are left out. */
const COUNCIL_TAX: {
  name: string;
  p: PartyKey;
  href: string;
  note?: string;
  before: number;
  after: number;
  detail: string;
}[] = [
  { name: "Maree Todd", p: "SNP", href: msp("regions/highlands-and-islands/maree-todd"), before: 2308.51, after: 5494.23, detail: "Then £5,949 on 1 April 2025 for 2025/26" },
  { name: "Kenneth Gibson", p: "SNP", note: "now Presiding Officer", href: msp("constituencies/cunninghame-north"), before: 2650.0, after: 5494.23, detail: "Then £5,949 on 2 April 2025 for 2025/26" },
  { name: "Alexander Burnett", p: "Conservative", href: msp("constituencies/aberdeenshire-west"), before: 0, after: 5234.5, detail: "Then £5,949 on 3 April 2025 for 2025/26" },
  { name: "Jenni Minto", p: "SNP", href: msp("constituencies/argyll-and-bute"), before: 1415.25, after: 4472.01, detail: "Includes a £1,696 \"Second Home levy\"; then £4,842 in April to May 2025" },
  { name: "Liam McArthur", p: "Lib Dem", href: msp("constituencies/orkney-islands"), before: 2708.37, after: 4472.01, detail: "Up 65% in one year" },
  { name: "Gillian Martin", p: "SNP", href: msp("constituencies/aberdeenshire-east"), before: 2942.4, after: 3723.93, detail: "Then £3,313 in April to June 2025" },
  { name: "Ariane Burgess", p: "Greens", href: msp("regions/highlands-and-islands/ariane-burgess"), before: 1462.48, after: 3636.39, detail: "Up 149% in one year" },
  { name: "Graham Simpson", p: "Reform UK", note: "then a Tory", href: msp("regions/central-scotland-and-lothians-west/graham-simpson"), before: 2260.45, after: 3479.6, detail: "He also paid £4,842 early, in March 2025, for 2025/26. With that, he billed £8,322 in the 2024/25 year." },
  { name: "Collette Stevenson", p: "SNP", href: msp("constituencies/east-kilbride"), before: 606.29, after: 3441.77, detail: "Then £7,455 in April 2025 for 2025/26: two £3,727 lines four weeks apart, one labelled \"2 Home premium\"" },
  { name: "Siobhian Brown", p: "SNP", href: msp("constituencies/ayr"), before: 1462.48, after: 3441.77, detail: "Up 135% in one year" },
];

const NEWSPAPERS: { name: string; p: PartyKey; href?: string; former?: boolean; total: number; detail: string }[] = [
  { name: "Kate Forbes", p: "SNP", former: true, total: 7707.16, detail: "127 claims: local newsagent plus The Economist (£219 a year)" },
  { name: "Murdo Fraser", p: "Conservative", href: msp("regions/mid-scotland-and-fife/murdo-fraser"), total: 5761.53, detail: "67 claims, including one £1,049 bill at GC Stores" },
  { name: "Jamie Halcro Johnston", p: "Conservative", former: true, total: 4623.79, detail: "Local and national paper deliveries" },
  { name: "Rhoda Grant", p: "Labour", former: true, total: 4243.52, detail: "Ongoing newspaper subscriptions" },
  { name: "Shona Robison", p: "SNP", former: true, total: 3587.5, detail: "Ongoing newspaper subscriptions" },
  { name: "Lorna Slater", p: "Greens", href: msp("constituencies/edinburgh-central"), total: 3430.29, detail: "5 years of the FT (£1,592) and The Economist (£1,061), plus two £144 New Statesman entries 3 days apart" },
  { name: "Neil Bibby", p: "Labour", href: msp("regions/west-scotland/neil-bibby"), total: 3338.78, detail: "£909 in 2024/25 alone" },
  { name: "Annabelle Ewing", p: "SNP", former: true, total: 3247.4, detail: "7 claims, including £2,081 of local paper adverts filed as newspapers" },
  { name: "Colin Smyth", p: "Labour", former: true, total: 3217.55, detail: "48 claims for office papers" },
  { name: "Jim Fairlie", p: "SNP", href: msp("constituencies/perthshire-south-and-kinross-shire"), total: 3189.25, detail: "£857 in 2024/25 alone" },
];

const COMMUTER_HOTELS: { name: string; p: PartyKey; href: string; area: string; total: number; what: string }[] = [
  { name: "Graham Simpson", p: "Reform UK", href: msp("regions/central-scotland-and-lothians-west/graham-simpson"), area: "Central Scotland & Lothians West", total: 26329.15, what: "£13,500 flat rent, £8,322 council tax (incl. £4,842 paid early for 2025/26), £4,085 hotels" },
  { name: "Collette Stevenson", p: "SNP", href: msp("constituencies/east-kilbride"), area: "East Kilbride, 50 miles away by Parliament's count", total: 16588.05, what: "Edinburgh rented flat plus £3,442 council tax" },
  { name: "Russell Findlay", p: "Conservative", href: msp("regions/west-scotland/russell-findlay"), area: "West Scotland", total: 11593.94, what: "£10,495 Edinburgh hotels plus £1,099 meals and refreshments" },
  { name: "Ross Greer", p: "Greens", href: msp("regions/west-scotland/ross-greer"), area: "West Scotland", total: 10174.22, what: "£9,900 Edinburgh hotels" },
  { name: "Clare Adamson", p: "SNP", href: msp("constituencies/motherwell-and-wishaw"), area: "Motherwell and Wishaw, 35 miles away", total: 10125.04, what: "£9,259 Edinburgh hotels plus £866 meals and refreshments" },
  { name: "George Adam", p: "SNP", href: msp("constituencies/paisley"), area: "Paisley", total: 9684.0, what: "Edinburgh hotels (including £820 for one 5 night stay)" },
  { name: "Jackie Baillie", p: "Labour", href: msp("constituencies/dumbarton"), area: "Dumbarton", total: 9565.0, what: "Edinburgh hotels" },
  { name: "Monica Lennon", p: "Labour", href: msp("regions/glasgow/monica-lennon"), area: "Glasgow", total: 9248.57, what: "£9,183 Edinburgh hotels" },
  { name: "Pauline McNeill", p: "Labour", href: msp("regions/glasgow/pauline-mcneill"), area: "Glasgow", total: 8526.75, what: "£7,527 Edinburgh hotels plus £1,000 meals and refreshments" },
  { name: "Patrick Harvie", p: "Greens", href: msp("regions/glasgow/patrick-harvie"), area: "Glasgow", total: 7035.72, what: "£6,457 Edinburgh hotels" },
];

const TOP_10: { name: string; p: PartyKey; note?: string; href: string; area: string; amount: number; detail: string }[] = [
  { name: "Rachael Hamilton", p: "Conservative", href: msp("constituencies/ettrick-roxburgh-and-berwickshire"), area: "Ettrick, Roxburgh & Berwickshire", amount: 62112.43, detail: "£23,860 leaflets & ads, £19,640 Edinburgh flat, £7,202 travel" },
  { name: "Kenneth Gibson", p: "SNP", note: "now Presiding Officer", href: msp("constituencies/cunninghame-north"), area: "Cunninghame North", amount: 61907.28, detail: "£23,053 Edinburgh flat (£5,494 council tax), £21,183 office" },
  { name: "Karen Adam", p: "SNP", href: msp("constituencies/banffshire-and-buchan-coast"), area: "Banffshire & Buchan Coast", amount: 60577.13, detail: "£23,871 office, £17,619 Edinburgh flat, £12,171 leaflets & ads" },
  { name: "Emma Roddick", p: "SNP", href: msp("constituencies/inverness-and-nairn"), area: "Inverness and Nairn", amount: 60493.97, detail: "£17,587 Edinburgh flat, £17,045 leaflets & ads, £13,329 travel" },
  { name: "Maree Todd", p: "SNP", href: msp("regions/highlands-and-islands/maree-todd"), area: "Highlands and Islands", amount: 58721.78, detail: "£20,572 Edinburgh flat (£5,494 council tax), £19,457 office" },
  { name: "Collette Stevenson", p: "SNP", href: msp("constituencies/east-kilbride"), area: "East Kilbride", amount: 57385.08, detail: "£21,871 office, £16,588 Edinburgh flat, £16,460 leaflets & ads" },
  { name: "Stuart McMillan", p: "SNP", href: msp("constituencies/inverclyde"), area: "Inverclyde", amount: 56156.18, detail: "£20,428 office, £18,815 Edinburgh flat, £13,667 leaflets & ads" },
  { name: "Liam McArthur", p: "Lib Dem", href: msp("constituencies/orkney-islands"), area: "Orkney Islands", amount: 53860.11, detail: "£19,488 travel, £18,196 Edinburgh flat (£4,472 council tax)" },
  { name: "Siobhian Brown", p: "SNP", href: msp("constituencies/ayr"), area: "Ayr", amount: 51548.28, detail: "£22,698 office, £17,587 Edinburgh flat (£3,442 council tax)" },
  { name: "Ross Greer", p: "Greens", href: msp("regions/west-scotland/ross-greer"), area: "West Scotland", amount: 47747.97, detail: "£19,600 office, £17,000 leaflets & ads (all in March), £9,900 hotels" },
];

const COUNCILLORS: [string, PartyKey, string, string, string][] = [
  ["James Adams", "Conservative", "North East Scotland", "Aberdeenshire Council", "/representatives/msps/regions/north-east-scotland/james-adams"],
  ["Heather Anderson", "SNP", "Dundee City West", "Dundee City Council", "/representatives/msps/constituencies/dundee-city-west"],
  ["Gary Bouse", "SNP", "Falkirk West", "Falkirk Council", "/representatives/msps/constituencies/falkirk-west"],
  ["Holly Bruce", "Greens", "Glasgow Southside", "Glasgow City Council", "/representatives/msps/constituencies/glasgow-southside"],
  ["Yi-pei Chou Turvey", "Lib Dem", "North East Scotland", "Aberdeenshire Council", "/representatives/msps/regions/north-east-scotland/yi-pei-chou-turvey"],
  ["Sanne Dijkstra-Downie", "Lib Dem", "Edinburgh Northern", "City of Edinburgh Council", "/representatives/msps/constituencies/edinburgh-northern"],
  ["Joe Fagan", "Labour", "South Scotland", "South Lanarkshire Council", "/representatives/msps/regions/south-scotland/joe-fagan"],
  ["Zen Ghani", "SNP", "Glasgow Cathcart and Pollok", "Glasgow City Council", "/representatives/msps/constituencies/glasgow-cathcart-and-pollok"],
  ["Alex Kerr", "SNP", "Hamilton, Larkhall and Stonehouse", "Glasgow City Council", "/representatives/msps/constituencies/hamilton-larkhall-and-stonehouse"],
  ["Thomas Kerr", "Reform UK", "Glasgow", "Glasgow City Council", "/representatives/msps/regions/glasgow/thomas-kerr"],
  ["Morven-May MacCallum", "Lib Dem", "Highlands and Islands", "Highland Council", "/representatives/msps/regions/highlands-and-islands/morven-may-maccallum"],
  ["Julie MacDougall", "Reform UK", "Mid Scotland and Fife", "Fife Council", "/representatives/msps/regions/mid-scotland-and-fife/julie-macdougall"],
  ["Duncan Massey", "Reform UK", "North East Scotland", "Aberdeen City Council", "/representatives/msps/regions/north-east-scotland/duncan-massey"],
  ["Colm Merrick", "SNP", "Glasgow Anniesland", "East Renfrewshire Council", "/representatives/msps/constituencies/glasgow-anniesland"],
  ["Pauline Stafford", "SNP", "Bathgate", "West Lothian Council", "/representatives/msps/constituencies/bathgate"],
];

const COUNCILLOR_COUNTS = (Object.keys(PARTY) as PartyKey[])
  .map((p) => ({ p, n: COUNCILLORS.filter((c) => c[1] === p).length }))
  .filter((x) => x.n > 0)
  .sort((a, b) => b.n - a.n);

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function MspExpensesScotlandInvestigation() {
  const promoMax = Math.max(...PARTY_TALLY.map((t) => promoNum(t.promo)));
  const ctMax = Math.max(...COUNCIL_TAX.map((r) => r.after));

  const ctRow = (r: (typeof COUNCIL_TAX)[number]) => (
    <li key={r.name} className="py-4 first:pt-0 last:pb-0">
      <Who face name={r.name} href={r.href} p={r.p} note={r.note} />
      <div className="mt-2.5 space-y-1.5">
        <Bar value={r.before} max={ctMax} colour="var(--rule-strong)" label={gbp(r.before, false)} />
        <Bar value={r.after} max={ctMax} colour="var(--bad)" label={gbp(r.after, false)} />
      </div>
      <p className="ui mt-2 text-[14px] leading-[1.45] text-[var(--ink-2)]">{r.detail}</p>
    </li>
  );

  return (
    <Prose>
      <Lead>
        Holyrood lists who got paid and what each bill was for. We read all 242,844 lines, from
        leaflets and hotels to calendars and papers. Every party at Holyrood appears in the file.
      </Lead>

      <QuickTake
        items={[
          <>
            Leaflet money not spent by <strong>31 March</strong> is lost. The{" "}
            <strong>Scottish Greens</strong> spent <strong>77.8%</strong> of their 2024/25 leaflet
            budget in March alone.
          </>,
          <>
            Labour&apos;s{" "}
            <Link href={msp("regions/central-scotland-and-lothians-west/mark-griffin")}>
              <strong>Mark Griffin</strong>
            </Link>{" "}
            and{" "}
            <Link href={msp("regions/north-east-scotland/michael-marra")}>
              <strong>Michael Marra</strong>
            </Link>{" "}
            paid{" "}
            <strong>£19,800</strong> to a firm run by their party&apos;s former boss.
          </>,
          <>
            Tory{" "}
            <Link href={msp("constituencies/aberdeenshire-west")}>
              <strong>Alexander Burnett</strong>
            </Link>{" "}
            billed <strong>£39,480</strong> for calendars
            from 2016 to 2024.
          </>,
          <>
            MSPs backed double council tax on second homes. Then they billed taxpayers{" "}
            <strong>£161,374</strong> in council tax for their own Edinburgh flats in 2024/25.
            Take out £16,442 of next year&apos;s tax paid early, and the bill still{" "}
            <strong>nearly doubled</strong>.
          </>,
          <>
            Top claimer in 2024/25: Tory{" "}
            <Link href={msp("constituencies/ettrick-roxburgh-and-berwickshire")}>
              <strong>Rachael Hamilton</strong>
            </Link>{" "}
            at{" "}
            <strong>£62,112</strong>.
          </>,
        ]}
      />

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="labour-firm-and-calendars">
        £19,800 to an ex Labour boss, £39,480 on calendars, and football banners
      </Finding>

      <CaseCard
        figure="£19,800"
        people={[
          { name: "Mark Griffin", href: msp("regions/central-scotland-and-lothians-west/mark-griffin"), p: "Labour", place: "Central Scotland & Lothians West" },
          { name: "Michael Marra", href: msp("regions/north-east-scotland/michael-marra"), p: "Labour", place: "North East Scotland" },
        ]}
      >
        <p>
          <strong>£19,800 to an ex Scottish Labour boss&apos;s firm.</strong> Griffin (£11,400) and
          Marra (£8,400) paid <strong>Craigview Strategies</strong> £600 a day in 2023 and 2024. Both are regional MSPs: each speaks for a large Holyrood region,
          not one seat.
        </p>
        <p>
          Companies House shows the firm is run by Brian Roy. He was Scottish Labour&apos;s General
          Secretary (the party&apos;s top staff job) for five years.
        </p>
      </CaseCard>

      <CaseCard
        figure="£39,480"
        people={[{ name: "Alexander Burnett", href: msp("constituencies/aberdeenshire-west"), p: "Conservative", place: "Aberdeenshire West" }]}
      >
        <p>
          <strong>£39,480 on calendars for a rich estate owner.</strong> Tory Alexander Burnett&apos;s
          entry in the Register of Interests (the public list of MSPs&apos; homes, shares and other
          jobs) shows a big estate, £2.49 million in property firm shares, a £4.7 million trust, and
          £30,001 to £40,000 a year as a firm boss.
        </p>
        <p>
          And still, from 2016 to 2024, he billed taxpayers <strong>£39,480</strong> through Hill and
          Hay Ltd to print and post calendars. £9,545 of it went in December 2024 alone. Two of the
          December 2018 bills spell it &ldquo;CALANDER&rdquo;.
        </p>
      </CaseCard>

      <CaseCard
        kicker="Football club banners"
        figure="£1,830"
        people={[
          { name: "Siobhian Brown", href: msp("constituencies/ayr"), p: "SNP", place: "Ayr" },
          { name: "Marie McNair", href: msp("constituencies/clydebank-and-milngavie"), p: "SNP", place: "Clydebank and Milngavie" },
        ]}
      >
        <p>
          Brown billed <strong>£1,230</strong> for an &ldquo;ADVERTISING BANNER AT AYR
          UNITED&rdquo;. McNair billed <strong>£600</strong> for a &ldquo;New Trackside Banner in
          name of Marie McNair MSP&rdquo; at Clydebank FC.
        </p>
      </CaseCard>

      <Spotlight
        person={{ name: "Ross Greer", href: msp("regions/west-scotland/ross-greer"), p: "Greens", place: "West Scotland" }}
        kicker="November 2023 · a hotel he never stayed in"
        amount="£396"
        headline="You paid for a hotel booking he cancelled."
        lines={[{ what: "28 Nov Arrival 2NTS; Non-refundable Cancellation fee - 27 Nov 2023", amount: "£396.00" }]}
      >
        <p>
          He cancelled the day before and the fee couldn&apos;t be refunded. So it went on
          expenses, and the public paid for a room nobody slept in.
        </p>
      </Spotlight>

      <P>
        <strong>Other cancelled hotel and taxi fees that went on expenses:</strong>
      </P>
      <UL>
        <LI>
          <strong>£296</strong> for <Link href={msp("constituencies/argyll-and-bute")}>Jenni Minto</Link>{" "}
          (SNP), <strong>Premier Inn Oban</strong>
        </LI>
        <LI>
          <strong>£278</strong> for <Link href={msp("constituencies/cunninghame-north")}>Kenneth Gibson</Link>{" "}
          (SNP then, now Presiding Officer)
        </LI>
        <LI>
          <strong>£249</strong> for{" "}
          <Link href={msp("constituencies/perthshire-south-and-kinross-shire")}>Jim Fairlie</Link> (SNP)
        </LI>
        <LI>
          <strong>£150</strong> for <Link href={msp("constituencies/motherwell-and-wishaw")}>Clare Adamson</Link>{" "}
          (SNP)
        </LI>
        <LI>
          <strong>£55 taxi fee</strong> for Health boss <Link href={msp("constituencies/airdrie")}>Neil Gray</Link>{" "}
          (SNP)
        </LI>
      </UL>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="top-claimers">
        The 10 MSPs who claimed the most in 2024/25
      </Finding>
      <P>
        These are the claims MSPs make themselves: Edinburgh flats, offices, travel and leaflets.
        Staff pay isn&apos;t included. For scale, an MSP&apos;s own pay is £74,507 a year.
      </P>

      <ChartFrame
        kicker="2024/25 · MSPs still at Holyrood in 2026"
        title="Top claiming MSPs, not counting staff pay"
        caption="Source: Holyrood public expense files, April 2024 to March 2025."
      >
        <RankFold
          show={3}
          more="See numbers 4 to 10"
          rows={TOP_10.map((r) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.note} />,
            side: r.area,
            value: r.amount,
            label: gbp(r.amount, false),
            colour: PARTY[r.p].colour,
            detail: r.detail,
          }))}
        />
      </ChartFrame>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="party-tally">
        The Holyrood Party Tally: every party put on blast
      </Finding>
      <P>
        Each MSP gets a yearly pot for leaflets, mail and ads. It runs from April to March, and money
        not spent by 31 March is lost. So a late rush sticks out a mile.
      </P>

      <ChartFrame
        kicker="2024/25 · Leaflets, mail and ads"
        title="The Greens spent most per MSP, and most of it in March"
        caption="Source: Holyrood public expense files, April 2024 to March 2025."
      >
        <div className="grid gap-7 md:grid-cols-2">
          <div>
            <p className="ui mb-3 text-[14.5px] font-[640] text-[var(--ink)]">Spent per MSP</p>
            <div className="space-y-3">
              {[...PARTY_TALLY]
                .sort((a, b) => promoNum(b.promo) - promoNum(a.promo))
                .map((t) => (
                  <div key={t.p}>
                    <p className="mb-1">
                      <Party p={t.p} note={t.size} />
                    </p>
                    <Bar value={promoNum(t.promo)} max={promoMax} colour={PARTY[t.p].colour} label={t.promo} />
                  </div>
                ))}
            </div>
          </div>
          <div>
            <p className="ui mb-3 text-[14.5px] font-[640] text-[var(--ink)]">Share of the year&apos;s spending made in March</p>
            <div className="space-y-3">
              {[...PARTY_TALLY]
                .sort((a, b) => b.march - a.march)
                .map((t) => (
                  <div key={t.p}>
                    <p className="mb-1">
                      <Party p={t.p} />
                    </p>
                    <Bar
                      value={t.march}
                      max={100}
                      colour={t.p === "Greens" ? "var(--bad)" : "var(--rule-strong)"}
                      label={`${t.march}%`}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </ChartFrame>

      <P>
        <strong>All claims together</strong> (not just leaflets), the four Lib Dems top the list at
        £41,738 per MSP. Island flights for Orkney and Shetland, for MSPs and their staff, push that up. The Greens come second
        at £35,974, then the Tories, SNP and Labour.
      </P>

      <Expand summary="What stands out for each party, plus every party's figures">
        <PartyList
          items={[
            {
              p: "Greens",
              children: (
                <>
                  <strong>Scottish Greens:</strong> Second highest spend at{" "}
                  <strong>£35,974 per MSP</strong>, ahead of Tories, SNP and Labour. They came first
                  for leaflets at <strong>£15,412 per MSP</strong>. They spent <strong>77.8%</strong>{" "}
                  of their year&apos;s leaflet budget in March alone.
                </>
              ),
            },
            {
              p: "Conservative",
              children: (
                <>
                  <strong>Scottish Conservatives:</strong> First for Edinburgh flats and hotels at{" "}
                  <strong>£9,438 per MSP</strong> (£51,968 in council tax). Their MSPs and staff also
                  drove <strong>190,128 car miles</strong> (£84,308) in one year.
                </>
              ),
            },
            {
              p: "SNP",
              children: (
                <>
                  <strong>SNP:</strong> Claimed <strong>£2.19 million</strong> across 62 MSPs,
                  including <strong>£87,890</strong> in Edinburgh second home council tax after backing
                  double tax, plus <strong>174,045 car miles</strong> (£77,888) driven by MSPs and staff.
                </>
              ),
            },
            {
              p: "Labour",
              children: (
                <>
                  <strong>Scottish Labour:</strong> Lowest spend at £31,906 per MSP. They still
                  spent <strong>46.3%</strong> of their leaflet budget in March and paid{" "}
                  <strong>£19,800</strong> to an ex Scottish Labour boss&apos;s firm.
                </>
              ),
            },
            {
              p: "Lib Dem",
              children: (
                <>
                  <strong>Scottish Liberal Democrats:</strong> Top raw spend (£41,738 across four
                  MSPs), pushed up by £34,309 in island flights for Orkney and Shetland. That
                  includes £3,775 of flights for their staff.
                </>
              ),
            },
          ]}
        />
        <p className="ui mb-3 mt-6 text-[14.5px] font-[640] text-[var(--ink)]">Every party&apos;s figures per MSP</p>
        <PartyList
          items={PARTY_TALLY.map((t) => ({
            p: t.p,
            children: (
              <>
                <strong>
                  {t.name} ({t.size}): {gbp(t.avg, false)}
                </strong>{" "}
                per MSP in all. Leaflets {t.promo} ({t.march}% in March). Edinburgh flat or hotel{" "}
                {t.flat}. Travel {t.travel}.
              </>
            ),
          }))}
        />
        <p className="ui mt-4 text-[14px] text-[var(--muted)]">
          Not counting staff pay. CT means council tax. Car miles and flights include trips by MSPs
          and their staff. Source: Holyrood public expense files, April 2024 to March 2025.
        </p>
      </Expand>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="greens-scorecard">
        The Scottish Greens&apos; £852,287 bill: flights, 37,274 car miles, £101k hotels and a
        77.8% March blitz
      </Finding>
      <P>
        From May 2021 to June 2025, just seven Green MSPs billed taxpayers <strong>£852,287</strong>{" "}
        (not counting staff pay). £286,756 went on leaflets, mail and ads, alongside 37,274 car
        miles and £100,949 on hotels. Their hotels alone cost more than an MSP&apos;s £74,507
        yearly pay.
      </P>

      <BigStat
        value="£83,546"
        label="Spent on leaflets by five Green MSPs in March 2025, just before unspent money was lost."
        exact="Four of the five biggest March leaflet spenders at Holyrood were Greens: Patrick Harvie £17,400, Maggie Chapman £17,200 and Ross Greer £17,000, then Labour's Rhoda Grant £16,522 and Gillian Mackay £16,380. Green Mark Ruskell spent £15,566."
      />

      <Spotlight
        person={{ name: "Lorna Slater", href: msp("constituencies/edinburgh-central"), p: "Greens", place: "Edinburgh Central" }}
        kicker="September and November 2023 · while she was a government minister"
        amount="£3,000"
        headline="You paid for a minister's one to one speaking coach."
        lines={[
          { meta: "18 Sept 2023 · Pink Elephant Communications Ltd", what: "Pink Elephant Communication Skills 1-2-1", amount: "£1,500.00" },
          { meta: "2 Nov 2023 · Pink Elephant Communications Ltd", what: "Comm Skills October LS", amount: "£1,500.00" },
        ]}
      >
        <p>
          Two £1,500 sessions to help a minister talk better, billed as
          &ldquo;training&rdquo;.
        </p>
        <p>
          In May 2025 she also billed <strong>£1,764</strong> for &ldquo;International Biodiversity
          Day 2025 - Catering and Audio Visual Costs&rdquo;.
        </p>
      </Spotlight>

      <Spotlight
        person={{ name: "Maggie Chapman", href: msp("regions/north-east-scotland/maggie-chapman"), p: "Greens", place: "North East Scotland" }}
        kicker="November and December 2022 · her new regional office"
        amount="£6,979"
        headline="Her new office, decorated and floored on expenses."
        lines={[
          { meta: "7 Nov 2022", what: "Office Decoration 07/11/22", amount: "£1,980.00" },
          { meta: "7 Nov 2022", what: "Preparation and Decoration of office 07/11/22", amount: "£3,588.00" },
          { meta: "15 Dec 2022", what: "Replacing floor in new regional office", amount: "£1,411.20" },
        ]}
      >
        <p>Nearly £7,000 of public money to get one office looking nice.</p>
      </Spotlight>

      <P>
        <strong>Also on the Greens&apos; bills:</strong>
      </P>
      <UL>
        <LI>
          <Link href={msp("regions/glasgow/patrick-harvie")}>Patrick Harvie</Link>:{" "}
          <strong>£17,400</strong> to Alliance Print Group for one &ldquo;Annual Report Printing &amp;
          Mailing&rdquo; bill on <strong>28 March 2025</strong>, three days before unspent money ran out.
        </LI>
        <LI>
          <Link href={msp("regions/glasgow/patrick-harvie")}>Patrick Harvie</Link>:{" "}
          <strong>£2,990 for Trello</strong> (an online to do list app) over four years, and a{" "}
          <strong>£169.50 TV licence</strong> the day before that print bill.
        </LI>
        <LI>
          <Link href={msp("regions/west-scotland/ross-greer")}>Ross Greer</Link>:{" "}
          <strong>three £159 TV licences</strong>, one a year from 2021 to 2023.
        </LI>
        <LI>
          <Link href={msp("regions/highlands-and-islands/ariane-burgess")}>Ariane Burgess</Link>:{" "}
          <strong>£18,260 on consultants</strong>, <strong>23 flights</strong> (19 for her, 4 for
          her staff) and <strong>140 taxis</strong>.
        </LI>
      </UL>

      <Expand summary="See each Green MSP's four year claims">
        <RankList
          rows={GREENS_SCORECARD.map((r) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p="Greens" />,
            side: (
              <span className="tnum">
                Print &amp; mail {r.print} · Hotels {r.hotels}
              </span>
            ),
            value: r.total,
            label: gbp(r.total, false),
            colour: PARTY.Greens.colour,
            detail: r.other,
          }))}
        />
        <p className="ui mt-4 text-[14px] text-[var(--muted)]">
          Source: Holyrood public expense files, May 2021 to June 2025, not counting staff pay.
        </p>
      </Expand>

      {/* ------------------------------------------------------------ 5 */}
      <Finding n={5} id="double-council-tax">
        MSPs backed double council tax on second homes, then sent you the bill (+99%)
      </Finding>
      <P>
        In April 2024, councils started charging double council tax on second homes, using new
        Holyrood powers. Once it kicked in, the bill for MSPs&apos; Edinburgh flats nearly
        doubled. SNP minister{" "}
        <Link href={msp("constituencies/argyll-and-bute")}>Jenni Minto</Link>&apos;s claims even
        name it: £1,696 for a &ldquo;Second Home levy&rdquo;.
      </P>

      <Tiles
        items={[
          { value: "£72,822", label: "2023/24, before the double tax" },
          { value: "£144,932", label: "2024/25 tax for 2024/25: nearly double the year before (up 99%)", hot: true },
          { value: "£161,374", label: "Billed in 2024/25. £16,442 of it was next year's tax, paid early by four MSPs." },
          { value: "£116,901", label: "April to June 2025 alone, from 27 MSPs", hot: true },
        ]}
      />

      <ChartFrame
        kicker="Before and after the April 2024 double tax"
        title="How MSPs' Edinburgh council tax bills shot up"
        legend={
          <>
            <Swatch colour="var(--rule-strong)">2023/24</Swatch>
            <Swatch colour="var(--bad)">2024/25</Swatch>
          </>
        }
        caption="2024/25 bars leave out payments made early for the next year. Source: Holyrood public expense files, Edinburgh flat council tax lines, 2023/24 to June 2025."
      >
        <ol className="divide-y divide-[var(--rule)]">{COUNCIL_TAX.slice(0, 3).map(ctRow)}</ol>
        <Expand summary="See seven more MSPs">
          <ol className="divide-y divide-[var(--rule)]">{COUNCIL_TAX.slice(3).map(ctRow)}</ol>
        </Expand>
      </ChartFrame>

      {/* ------------------------------------------------------------ 6 */}
      <Finding n={6} id="newspaper-racket">
        The £127,627 paper bill (and Lorna Slater&apos;s double £144 claim)
      </Finding>
      <P>
        Holyrood already pays for a free library and daily press clips. But from May 2021 to June
        2025, MSPs still billed taxpayers <strong>£127,627</strong> for papers and mags (£35,987 in
        2024/25).
      </P>
      <P>
        Lorna Slater&apos;s papers cost £3,430 over four years. But look at July 2021:
      </P>

      <Receipt
        person={{ name: "Lorna Slater", href: msp("constituencies/edinburgh-central"), p: "Greens", place: "Edinburgh Central" }}
        heading="Newspaper claims · July 2021"
        lines={[
          { meta: "23 July 2021", what: "Subscription to the New Statesman", amount: "£144.00" },
          { meta: "26 July 2021", what: "Subs for the FT (£309) and New Statesman (£144)", amount: "£453.00" },
        ]}
        footer="The New Statesman is claimed in both. No refund shows in the public file. Holyrood claim numbers Q201193 and Q201194."
      />

      <ChartFrame
        kicker="May 2021 to June 2025 · £127,627 across Holyrood"
        title="Biggest MSP newspaper and magazine bills"
        caption="Source: Holyrood public expense files, Newspaper category, May 2021 to June 2025."
      >
        <RankFold
          more="See seven more"
          rows={NEWSPAPERS.map((r) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.former ? "former MSP" : undefined} />,
            value: r.total,
            label: gbp(r.total, false),
            colour: PARTY[r.p].colour,
            detail: r.detail,
          }))}
        />
      </ChartFrame>

      <P>
        <strong>Tory leader</strong>{" "}
        <Link href={msp("regions/west-scotland/russell-findlay")}>Russell Findlay</Link> billed
        taxpayers <strong>£699.96</strong> for <strong>four yearly Spectator subscriptions</strong>{" "}
        (2022 to 2025).
      </P>

      {/* ------------------------------------------------------------ 7 */}
      <Finding n={7} id="commuter-belt-hotels">
        Edinburgh flats and £10k hotels 35 to 50 miles away
      </Finding>
      <P>
        Plenty of people travel from Glasgow, Paisley and East Kilbride to Edinburgh every day and
        pay for it themselves. At Holyrood, MSPs from the very same towns get big flat and hotel
        bills paid by taxpayers.
      </P>
      <ChartFrame
        kicker="2024/25 · Edinburgh flats, hotels and meals"
        title="Central Belt and West MSPs staying in Edinburgh"
        caption="Source: Holyrood public expense files, 2024/25."
      >
        <RankFold
          more="See seven more MSPs"
          rows={COMMUTER_HOTELS.map((r) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} />,
            side: r.area,
            value: r.total,
            label: gbp(r.total, false),
            colour: PARTY[r.p].colour,
            detail: r.what,
          }))}
        />
      </ChartFrame>

      {/* ------------------------------------------------------------ 8 */}
      <Finding n={8} id="landlords-and-double-jobs">
        19 landlords and 15 MSPs with council jobs in 2026
      </Finding>
      <P>
        66 new MSPs arrived after the May 2026 election. Their claims aren&apos;t out yet, but their
        2026 Register of Interests entries are. <strong>26 of the 129 MSPs</strong> list property
        they own. And <strong>19 MSPs</strong> make money from letting: flats, houses, holiday lets,
        shops, land, a caravan, or a letting firm.
      </P>

      <PartyList
        items={[
          {
            p: "Reform UK",
            children: (
              <>
                <Link href={msp("regions/west-scotland/malcolm-offord")}>
                  <strong>Malcolm Offord</strong>
                </Link>
                : a £900,000 to £1 million home in Cape Town, and £775,000 in Borders Distillery
                shares.
              </>
            ),
          },
          {
            p: "Conservative",
            children: (
              <>
                <Link href={msp("constituencies/ettrick-roxburgh-and-berwickshire")}>
                  <strong>Rachael Hamilton</strong>
                </Link>
                : owns 49% of Borders Hotels while topping MSP claims at £62,112.
              </>
            ),
          },
          {
            p: "Labour",
            children: (
              <>
                <Link href={msp("regions/edinburgh-and-lothians-east/irshad-ahmed")}>
                  <strong>Irshad Ahmed</strong>
                </Link>
                : four rental lets.
              </>
            ),
          },
          {
            p: "SNP",
            children: (
              <>
                <Link href={msp("constituencies/glasgow-easterhouse-and-springburn")}>
                  <strong>Ivan McKee</strong>
                </Link>{" "}
                and{" "}
                <Link href={msp("constituencies/clackmannanshire-and-dunblane")}>
                  <strong>Keith Brown</strong>
                </Link>
                : half of a home letting firm, and a rented out house.
              </>
            ),
          },
        ]}
      />

      <P>
        And <strong>15 sitting MSPs</strong> still list an active local councillor job with no
        quit date. So they draw £25,001 to £30,000 in council pay on top of £74,507+ as an MSP.
      </P>

      <div className="not-prose flex flex-wrap gap-2">
        {COUNCILLOR_COUNTS.map(({ p, n }) => (
          <span
            key={p}
            className="ui inline-flex items-center gap-2 rounded-full border border-[var(--rule)] bg-[var(--surface)] px-3 py-1.5 text-[14px]"
          >
            <Dot p={p} />
            <span className="font-[560] text-[var(--ink-2)]">{PARTY[p].label}</span>
            <span className="tnum font-[700] text-[var(--ink)]">{n}</span>
          </span>
        ))}
      </div>

      <Expand summary="See all 15 MSPs who are also councillors">
        <ul className="divide-y divide-[var(--rule)]">
          {COUNCILLORS.map(([name, p, seat, council, href]) => (
            <li key={name} className="py-3 first:pt-0 last:pb-0">
              <Who face name={name} href={href} p={p} />
              <p className="ui mt-1 text-[14px] leading-[1.45] text-[var(--ink-2)]">
                {seat} · {council}
              </p>
            </li>
          ))}
        </ul>
        <p className="ui mt-4 text-[14px] text-[var(--muted)]">
          Source: Holyrood 2026 Register of Interests (checked 22 Nov 2026). MSPs who quit as
          councillors in Nov 2026 are left off.
        </p>
      </Expand>

      <Aside title="How we checked every number">
        <p>
          <strong>242,844 lines:</strong> every MSP expense line Holyrood has published, for all
          MSPs past and present, April 2016 to June 2025.
        </p>
        <p>
          <strong>50,067 receipts:</strong> the part of that file for MSPs sitting now, May 2021 to
          June 2025. These are in our search tool. Of today&apos;s 129 MSPs, 63 sat before May 2026
          and have past claims.
        </p>
        <p>
          Holyrood&apos;s full 2024/25 bill for MSPs was £27.45 million. Most of it (£22.57 million)
          was staff pay. This page covers the £4.58 million that shows up as individual claims in
          the published files. The last £0.30 million of the official total is costs the
          Parliament reports only as totals, with no claim lines behind them.
        </p>
      </Aside>

      <PostCTA
        title="Search 50,067 receipts from today's MSPs"
        body="Covers May 2021 to June 2025. Type your postcode to find your MSPs and MP, or search any bill."
        href="/mp-expenses-scotland/search?who=msp"
        cta="Open the MSP Receipt Finder"
      />
    </Prose>
  );
}
