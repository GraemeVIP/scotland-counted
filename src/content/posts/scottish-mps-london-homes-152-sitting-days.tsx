import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";
import {
  type PartyKey,
  type RankRow,
  PARTY,
  gbp,
  Who,
  Finding as KitFinding,
  QuickTake,
  ChartFrame,
  Swatch,
  Bar,
  RankList,
  CaseCard,
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

/*
 * Written in Graeme's voice (graeme-writing skill) for everyday tabloid readers
 * and school-age clarity: every Westminster term is explained in plain English
 * (and automatically underlined by ExplainText via glossary.ts).
 *
 * Data sources (checked 22 November 2026):
 * - IPSA 2025/26 individualBusinessCosts CSV (Accommodation + MP Travel + Dependant Travel)
 * - Hansard / Parliament API (152 days the Commons opened in 2025/26, speaking days,
 *   written questions, and recorded votes for the 55 Scottish MPs still in Parliament
 *   who served all of 2025/26). Stephen Flynn and Stephen Gethins sat all year but have
 *   since left; with them the 57 seats cost £3,065,164 (re-checked 23 November 2026).
 */

const mp = (slug: string) => `/representatives/mps/${slug}#london-record`;

const FINDINGS = 4;

function Finding({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <KitFinding n={n} of={FINDINGS} id={id}>
      {children}
    </KitFinding>
  );
}

/** RankList rows numbered from `start`, for the folded "places 4 to 10". */
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

const SHUTTLE_PARTS = [
  { what: "London flats, hotels, second home council tax & heating bills", value: 1559441 },
  { what: "MPs' own flights, trains, taxis, airport parking & car mileage", value: 1265797 },
  { what: "Flights, trains & taxis for MPs' partners and children", value: 89111 },
];

const STAFF_TRAVEL = { what: "Staff travel billed on top (for MPs' office staff)", value: 565753 };

const BIGGEST_SHUTTLE_BILLS: {
  name: string;
  slug: string;
  p: PartyKey;
  note?: string;
  bill: number;
  perDay: string;
  spoken: string;
}[] = [
  { name: "Graeme Downie", slug: "dunfermline-and-dollar", p: "Labour", bill: 84992, perDay: "£559", spoken: "55 days" },
  { name: "Kirsty Blackman", slug: "aberdeen-north", p: "SNP", bill: 80222, perDay: "£528", spoken: "58 days" },
  { name: "Andrew Bowie", slug: "west-aberdeenshire-and-kincardine", p: "Conservative", bill: 74057, perDay: "£487", spoken: "41 days" },
  { name: "Chris Law", slug: "dundee-central", p: "SNP", bill: 73355, perDay: "£483", spoken: "41 days" },
  { name: "Imogen Walker", slug: "hamilton-and-clyde-valley", p: "Labour", note: "Whip (organises party votes)", bill: 70803, perDay: "£466", spoken: "6 days" },
  { name: "Gregor Poynton", slug: "livingston", p: "Labour", bill: 69250, perDay: "£456", spoken: "21 days" },
  { name: "Brendan O'Hara", slug: "argyll-bute-and-south-lochaber", p: "SNP", bill: 68561, perDay: "£451", spoken: "37 days" },
  { name: "Alistair Carmichael", slug: "orkney-and-shetland", p: "Lib Dem", bill: 68482, perDay: "£451", spoken: "58 days" },
  { name: "Chris Kane", slug: "stirling-and-strathallan", p: "Labour", bill: 68303, perDay: "£449", spoken: "25 days" },
  { name: "John Lamont", slug: "berwickshire-roxburgh-and-selkirk", p: "Conservative", bill: 68187, perDay: "£449", spoken: "85 days" },
];

const COST_PER_SPOKEN_DAY: {
  name: string;
  slug: string;
  p: PartyKey;
  bill: number;
  days: number;
  questions: number;
  perDay: number;
}[] = [
  { name: "Elaine Stewart", slug: "ayr-carrick-and-cumnock", p: "Labour", bill: 57135, days: 19, questions: 5, perDay: 3007 },
  { name: "Chris Kane", slug: "stirling-and-strathallan", p: "Labour", bill: 68303, days: 25, questions: 9, perDay: 2732 },
  { name: "Joani Reid", slug: "east-kilbride-and-strathaven", p: "Labour", bill: 48655, days: 19, questions: 5, perDay: 2561 },
  { name: "Alan Gemmell", slug: "central-ayrshire", p: "Labour", bill: 56145, days: 24, questions: 2, perDay: 2339 },
  { name: "Maureen Burke", slug: "glasgow-north-east", p: "Labour", bill: 42825, days: 19, questions: 26, perDay: 2254 },
  { name: "Kenneth Stevenson", slug: "airdrie-and-shotts", p: "Labour", bill: 33465, days: 16, questions: 4, perDay: 2092 },
  { name: "Gordon McKee", slug: "glasgow-south", p: "Labour", bill: 42867, days: 21, questions: 2, perDay: 2041 },
  { name: "Brendan O'Hara", slug: "argyll-bute-and-south-lochaber", p: "SNP", bill: 68561, days: 37, questions: 55, perDay: 1853 },
  { name: "Andrew Bowie", slug: "west-aberdeenshire-and-kincardine", p: "Conservative", bill: 74057, days: 41, questions: 81, perDay: 1806 },
  { name: "Lillian Jones", slug: "kilmarnock-and-loudoun", p: "Labour", bill: 43062, days: 24, questions: 7, perDay: 1794 },
];

const BIG_BILL_ROWS: RankRow[] = BIGGEST_SHUTTLE_BILLS.map((r) => ({
  key: r.slug,
  who: <Who face name={r.name} href={mp(r.slug)} p={r.p} note={r.note} />,
  value: r.bill,
  label: gbp(r.bill, false),
  colour: PARTY[r.p].colour,
  detail: (
    <span className="tnum">
      Own bill ÷ 152 sitting days: {r.perDay} · spoke on {r.spoken}
    </span>
  ),
}));

const PER_DAY_ROWS: RankRow[] = COST_PER_SPOKEN_DAY.map((r) => ({
  key: r.slug,
  who: <Who face name={r.name} href={mp(r.slug)} p={r.p} />,
  value: r.perDay,
  label: gbp(r.perDay, false),
  colour: PARTY[r.p].colour,
  detail: (
    <span className="tnum">
      {gbp(r.bill, false)} bill · spoke on {r.days} days · {r.questions} written questions
    </span>
  ),
}));

/** Dr Zubir Ahmed: London nights paid for against days the Commons sat. */
const AHMED_NIGHTS = [
  { label: "Whole of 2025/26", open: 152, nights: 295 },
  { label: "April to July 2025, before his government job", open: 60, nights: 123 },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function ScottishMpsLondonHomes152SittingDays() {
  const shuttleMax = SHUTTLE_PARTS[0].value;

  return (
    <Prose>
      <QuickTake
        items={[
          <>
            The Commons sat on just <strong>152 days</strong> in 2025/26. Those are the days MPs
            meet in London to debate and vote.
          </>,
          <>
            Taxpayers paid <strong>£2.91 million</strong> to house and fly the 55 Scottish MPs
            still in Parliament who served all of 2025/26, and their families, to London. Or <strong>£19,173</strong> for every day the Commons sat.
          </>,
          <>
            One Scottish MP had <strong>295 London nights</strong> paid for across 152 open days.
          </>,
          <>
            Ordinary MPs cost up to <strong>£3,007</strong> for each day they stood up and spoke.
            Top was <Link href={mp("ayr-carrick-and-cumnock")}>Elaine Stewart</Link> (Labour).
          </>,
        ]}
      />

      <P>
        That daily figure covers all 55 MPs together. Five sitting days cost £95,867, more than a
        whole year of one MP&apos;s pay in 2025/26 (£93,904). And it leaves out their pay, Scottish
        offices and £13.11 million in staff pay.
      </P>

      <CaseCard
        kicker="Her bill split by the days she spoke"
        figure="£3,007"
        people={[
          { name: "Elaine Stewart", href: mp("ayr-carrick-and-cumnock"), p: "Labour", place: "Ayr, Carrick and Cumnock" },
        ]}
      >
        <p>
          Her London flat and travel bill came to <strong>£57,135</strong>. She spoke in the
          Commons on <strong>19 days</strong> all year.
        </p>
        <p>
          Split across those days, no Scottish MP cost more, apart from ministers, whips and PPS
          aides.{" "}
          <a href="#price-of-presence">See the top ten</a>.
        </p>
      </CaseCard>


      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-shuttle-bill">
        What the bill pays for
      </Finding>
      <P>
        Most people in Scotland pay their own way to work. If your boss wants you in three days a
        week, nobody rents you a £3,500 a month flat all year. And they certainly don&apos;t cover
        your council tax, gas, taxis, car park or your kids&apos; flights.
      </P>
      <P>
        The 55 Scottish MPs still in Parliament who served all of 2025/26 get the lot, paid by
        taxpayers through IPSA (the body that pays MPs&apos; expenses):
      </P>

      <ChartFrame
        kicker="IPSA 2025/26 · 55 Scottish MPs Who Served All Year"
        title="The real cost of housing and flying Scotland's MPs to London"
        caption="Source: IPSA 2025/26 files for the 55 Scottish MPs still in Parliament who served all of 2025/26. Staff travel is not included."
      >
        <div className="space-y-4">
          {SHUTTLE_PARTS.map((r) => (
            <div key={r.what}>
              <p className="ui mb-1.5 text-[15px] leading-[1.4] text-[var(--ink-2)]">{r.what}</p>
              <Bar value={r.value} max={shuttleMax} label={gbp(r.value, false)} />
            </div>
          ))}
        </div>

        <div className="ui mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t-2 border-[var(--ink)] pt-3">
          <span className="text-[15.5px] font-[680] text-[var(--ink)]">
            Total to house &amp; fly 55 Scottish MPs (2025/26)
          </span>
          <span className="tnum text-[17px] font-[700] text-[var(--bad-text)]">£2,914,349</span>
        </div>
      </ChartFrame>

      <Expand summary="Add staff travel and the bill is £3.48 million">
        <p className="ui mb-1.5 text-[15px] leading-[1.4] text-[var(--ink-2)]">{STAFF_TRAVEL.what}</p>
        <Bar
          value={STAFF_TRAVEL.value}
          max={shuttleMax}
          colour="var(--rule-strong)"
          label={gbp(STAFF_TRAVEL.value, false)}
        />
        <div className="ui mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t-2 border-[var(--ink)] pt-3">
          <span className="text-[15.5px] font-[680] text-[var(--ink)]">
            Flats, MP travel, family travel and staff travel
          </span>
          <span className="tnum text-[17px] font-[700] text-[var(--ink)]">£3,480,101</span>
        </div>
      </Expand>

      <P>
        Two Scottish MPs who sat all year are left out because they have since left the Commons:{" "}
        <a href="https://members.parliament.uk/member/4735">Stephen Flynn</a> (£74,101) and{" "}
        <a href="https://members.parliament.uk/member/4434">Stephen Gethins</a> (£76,714). Add them
        back and the 57 seats cost <strong>£3,065,164</strong>, or £20,166 a day.
      </P>
      <P>
        Planes take a big slice of the travel money. Energy Minister{" "}
        <Link href={mp("rutherglen")}>Michael Shanks</Link> put 92p of every £1 of his own London
        travel on flights, as{" "}
        <Link href="/blog/energy-minister-michael-shanks-flights-rutherglen">
          our Energy Minister flights story
        </Link>{" "}
        shows.
      </P>

      <P>Three of the biggest bills buried inside that £2.91 million:</P>

      <Spotlight
        person={{ name: "Melanie Ward", href: mp("cowdenbeath-and-kirkcaldy"), p: "Labour", place: "Cowdenbeath and Kirkcaldy" }}
        kicker="2025/26 · Family travel"
        amount="£7,932"
        headline="Her family's flights and train trips went on expenses."
        lines={[
          { meta: "Family · Air travel", what: "Aggregated figure for travel during 2025-26", amount: "£7,607.27" },
          { meta: "Family · Rail", what: "Aggregated figure for travel during 2025-26", amount: "£305.40" },
          { meta: "Family · Other public transport", what: "Aggregated figure for travel during 2025-26", amount: "£19.80" },
        ]}
      >
        <p>
          The biggest family travel bill of any Scottish MP that year. IPSA signed off every penny.
        </p>
      </Spotlight>

      <Spotlight
        person={{ name: "Gregor Poynton", href: mp("livingston"), p: "Labour", place: "Livingston" }}
        kicker="2025/26 · Taxis"
        amount="£5,059"
        headline="His taxi bill. No Scottish MP billed more."
      >
        <p>
          And his family&apos;s flights came to another <strong>£6,232</strong>.
        </p>
        <p>
          <Link href="/blog/gregor-poynton-mp-four-tv-licences-livingston" className="font-[660] text-[#8bb8ff] underline underline-offset-4">
            Read the full story →
          </Link>
        </p>
      </Spotlight>

      <Spotlight
        person={{ name: "Douglas Alexander", href: mp("lothian-east"), p: "Labour", place: "Lothian East" }}
        kicker="20 October 2025 · Second home council tax"
        amount="£4,093"
        headline="You paid the council tax on his second home."
        lines={[
          { meta: "Accommodation · Council tax", what: "Council tax associated costs 2025 to 2026", amount: "£4,093.21" },
        ]}
      >
        <p>The biggest council tax bill any Scottish MP put on expenses in 2025/26.</p>
      </Spotlight>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="price-of-presence">
        What did we get for the money?
      </Finding>
      <P>
        Up to £85,000 a year goes on housing and flying one MP to London. So the obvious question
        is: <strong>what did they actually do down there?</strong>
      </P>
      <P>
        It&apos;s easy to check. Every speech is saved in Hansard (the official record of the
        Commons), and every written question and Aye or No vote goes online.
      </P>
      <P>
        So we took each ordinary MP&apos;s London flat and travel bill. We left out ministers, whips
        (the MPs who organise their party&apos;s votes) and unpaid PPS aides (MPs who help a
        minister) like <Link href={mp("motherwell-wishaw-and-carluke")}>Pamela Nash</Link>.
        Opposition spokespeople stay in, as they hold no government job. Split by the days they
        spoke, it comes to <strong>£1,794 to £3,007 each day they spoke</strong>:
      </P>

      <ChartFrame
        kicker="Ordinary MPs With No Minister, Whip or PPS Job · 2025/26"
        title="What you paid for each day these MPs spoke in London"
        caption="Source: IPSA 2025/26 flat and travel bills (each MP's own bill) split by 2025/26 Hansard days spoken. Leaves out ministers, whips and PPS aides. Opposition spokespeople are included."
      >
        <RankList max={COST_PER_SPOKEN_DAY[0].perDay} rows={PER_DAY_ROWS.slice(0, 3)} />
      </ChartFrame>

      <Expand summary="See the other 7 (£1,794 to £2,339 a day spoken)">
        <MoreRanks max={COST_PER_SPOKEN_DAY[0].perDay} rows={PER_DAY_ROWS.slice(3)} start={4} />
      </Expand>

      <Expand summary="Open the 10 biggest London bills across all four parties (£68k to £85k)">
        <ChartFrame
          kicker="All Parties · Flat + Own Travel + Family Travel (2025/26)"
          title="The 10 biggest London bills among the 55 Scottish MPs in 2025/26"
          caption="Counts flats, hotels, MP travel and family travel from IPSA 2025/26 files. Leaves out staff pay, staff trips and Scottish offices. Stephen Gethins (£76,714) and Stephen Flynn (£74,101), who have since left the Commons, would also make this list."
        >
          <RankList max={BIGGEST_SHUTTLE_BILLS[0].bill} rows={BIG_BILL_ROWS} />
        </ChartFrame>
      </Expand>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="paid-when-shut">
        Paying for London homes all year, when it was shut for 213 days
      </Finding>
      <P>
        The Commons sat on 152 days. For the other <strong>213 days</strong> it was shut for
        weekends, recess, Easter and Christmas.
      </P>

      <Tiles
        items={[
          { value: "152", label: "days the Commons sat in 2025/26" },
          { value: "213", label: "days the Commons was shut", hot: true },
          { value: "49", label: "of the 55 claimed rent on a London home", hot: true },
        ]}
      />

      <P>
        In 2025/26, 49 of the 55 claimed rent on a London home. Rent keeps running whether the
        Commons sits or not.
      </P>
      <P>
        August when it&apos;s on break, Christmas, every weekend: the rent still runs. IPSA prints
        it as one total for the year. It never says how many nights an MP actually slept there.
      </P>
      <P>
        Only one Scottish MP lets us count each night:{" "}
        <Link href={mp("glasgow-south-west")}>Dr Zubir Ahmed</Link> (Labour, Glasgow South West).
        He used hotels and block flat stays instead of a yearly lease.
      </P>

      <ChartFrame
        kicker="Dr Zubir Ahmed · Labour, Glasgow South West"
        title="London nights paid for vs days the Commons sat"
        legend={
          <>
            <Swatch colour="var(--rule-strong)">Days the Commons sat</Swatch>
            <Swatch colour={PARTY.Labour.colour}>London nights paid for</Swatch>
          </>
        }
      >
        <div className="space-y-5">
          {AHMED_NIGHTS.map((r) => (
            <div key={r.label}>
              <p className="ui mb-2 text-[14.5px] font-[640] text-[var(--ink)]">{r.label}</p>
              <div className="space-y-1.5">
                <Bar value={r.open} max={295} colour="var(--rule-strong)" label={`${r.open} days`} />
                <Bar value={r.nights} max={295} colour={PARTY.Labour.colour} label={`${r.nights} nights`} />
              </div>
            </div>
          ))}
        </div>
      </ChartFrame>

      <PointList
        items={[
          {
            title: "295 London nights paid for, vs 152 open days",
            children: (
              <>
                His London stays cost taxpayers <strong>£37,359</strong>. He had 143 more nights
                than open days, which works out at £246 for each open day.
              </>
            ),
          },
          {
            title: "Before his top job (April to July 2025)",
            children: (
              <>
                Westminster opened on <strong>60 days</strong>, but{" "}
                <strong>123 London nights</strong> went on expenses. More than twice as many. And in
                those four months he spoke on <strong>11 days</strong> and asked{" "}
                <strong>zero written questions</strong>.
              </>
            ),
          },
          {
            title: "After he became a health minister (6 Sept 2025)",
            children: (
              <>
                A minister works in London on weekdays, so more nights make sense. But five of his
                seven monthly flat bills as a minister still covered <strong>28 nights or more</strong>,
                weekends included. See{" "}
                <Link href="/blog/worst-scottish-mp-expenses#hotel-nights">all 14 of his hotel claims</Link>
                .
              </>
            ),
          },
        ]}
      />

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-not-remote">
        They proved remote voting works in Covid, then binned it
      </Finding>
      <P>
        MPs will tell you they do lots of unseen work, helping local people with housing, benefits
        and visas. And they do. But that proves the point: <strong>helping people in Ayr, Stirling or
        Glasgow happens in Scotland, not in a £3,500 a month London flat.</strong>
      </P>
      <P>
        The rest of us spent five years on Teams and Zoom. Westminster itself ran remote votes and
        video talks in 2020 and 2021. MPs voted from their local office in 30 seconds flat,
        without a plane or a hotel in sight.
      </P>
      <P>Then it binned remote votes the minute lockdown ended.</P>
      <P>
        So Scots keep paying £19,173 for every day the Commons sits. The money rents flats that
        keep costing when the Commons is shut. It covers council tax, heating, taxis and car parks, and flies
        MPs&apos; kids down too. All so some of them can speak on 19 days a year, at £3,007 a day,
        and walk through a door to say Aye or No.
      </P>

      <Aside title="How we kept it fair">
        <p>
          Ministers, whips (who organise their party&apos;s votes) and unpaid PPS aides (like{" "}
          <Link href={mp("motherwell-wishaw-and-carluke")}>Pamela Nash</Link>) are left out of the
          cost per day spoken list because their roles limit speeches. Every number comes straight from IPSA,
          Hansard and Commons vote logs.
        </p>
      </Aside>

      <PostCTA
        title="See every Scottish MP's London bill vs what they did"
        body="Check all 57 Scottish seats side by side, or search about 21,000 claims by postcode."
        href="/mp-expenses-scotland#london-record"
        cta="Compare all 57 Scottish MPs"
      />
    </Prose>
  );
}
