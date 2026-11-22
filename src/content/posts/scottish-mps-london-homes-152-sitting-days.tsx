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
} from "@/components/ExpenseKit";

/*
 * Written in Graeme's voice (graeme-writing skill) for everyday tabloid readers
 * and school-age clarity: every Westminster term is explained in plain English
 * (and automatically underlined by ExplainText via glossary.ts).
 *
 * Data sources (checked 22 November 2026):
 * - IPSA 2025/26 individualBusinessCosts CSV (Accommodation + MP Travel + Dependant Travel)
 * - Hansard / Parliament API (152 days the Commons opened in 2025/26, speaking days,
 *   written questions, and recorded votes across all 55 full-year Scottish MPs).
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
  bill: number;
  days: number;
  questions: number;
  perDay: number;
}[] = [
  { name: "Elaine Stewart", slug: "ayr-carrick-and-cumnock", bill: 57135, days: 19, questions: 5, perDay: 3007 },
  { name: "Chris Kane", slug: "stirling-and-strathallan", bill: 68303, days: 25, questions: 9, perDay: 2732 },
  { name: "Joani Reid", slug: "east-kilbride-and-strathaven", bill: 48655, days: 19, questions: 5, perDay: 2561 },
  { name: "Alan Gemmell", slug: "central-ayrshire", bill: 56145, days: 24, questions: 2, perDay: 2339 },
  { name: "Maureen Burke", slug: "glasgow-north-east", bill: 42825, days: 19, questions: 26, perDay: 2254 },
  { name: "Kenneth Stevenson", slug: "airdrie-and-shotts", bill: 33465, days: 16, questions: 4, perDay: 2092 },
  { name: "Gordon McKee", slug: "glasgow-south", bill: 42867, days: 21, questions: 2, perDay: 2041 },
  { name: "Lillian Jones", slug: "kilmarnock-and-loudoun", bill: 43062, days: 24, questions: 7, perDay: 1794 },
  { name: "Frank McNally", slug: "coatbridge-and-bellshill", bill: 46862, days: 28, questions: 6, perDay: 1674 },
  { name: "John Grady", slug: "glasgow-east", bill: 60603, days: 39, questions: 29, perDay: 1554 },
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
  who: <Who face name={r.name} href={mp(r.slug)} p="Labour" />,
  value: r.perDay,
  label: gbp(r.perDay, false),
  colour: PARTY.Labour.colour,
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
            Taxpayers paid <strong>£2.91 million</strong> to house and fly 55 Scottish MPs and
            their families to London. That is <strong>£19,173</strong> for each day the Commons sat.
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
        That daily figure is for all 55 MPs together. Five sitting days cost nearly as much as one
        MP&apos;s pay for a whole year (£98,599). The bill leaves out pay, Scottish offices and
        £13.11 million in staff pay.
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
          Split by those days, that is the most of any Scottish MP outside government and party
          jobs. <a href="#price-of-presence">See the top ten</a>.
        </p>
      </CaseCard>


      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-shuttle-bill">
        What the bill pays for
      </Finding>
      <P>
        Most folk in Scotland pay to get to work out of their own pay. If your boss wants you in
        three days a week, nobody rents you a £3,500 a month flat all year. Nobody pays your council
        tax, gas, taxis, car park, or flights for your kids.
      </P>
      <P>
        For Scotland&apos;s 55 full year MPs, taxpayers paid every bit of that bill through IPSA
        (the body that pays MPs&apos; expenses):
      </P>

      <ChartFrame
        kicker="IPSA 2025/26 · All 55 Full-Year Scottish MPs"
        title="The real cost of housing and flying Scotland's MPs to London"
        caption="Source: IPSA 2025/26 files for the 55 Scottish MPs who sat all year. Staff travel is not included."
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

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="price-of-presence">
        What did we get for the money?
      </Finding>
      <P>
        We pay up to £85,000 a year just to house and fly one MP to London. So ask one plain thing:{" "}
        <strong>what did they do down there?</strong>
      </P>
      <P>
        Every speech is saved in Hansard (the official record of the Commons). Every written
        question goes online. Every Aye or No vote is logged too.
      </P>
      <P>
        We took each ordinary MP&apos;s London flat and travel bill. We left out ministers, whips
        (the MPs who organise their party&apos;s votes) and unpaid PPS aides (MPs who help a
        minister) like <Link href={mp("motherwell-wishaw-and-carluke")}>Pamela Nash</Link>. Split by
        the days they spoke, taxpayers paid <strong>£1,554 to £3,007 each day they spoke</strong>:
      </P>

      <ChartFrame
        kicker="Ordinary MPs With No Minister, Whip or PPS Job · 2025/26"
        title="What you paid for each day these MPs spoke in London"
        caption="Source: IPSA 2025/26 flat and travel bills (each MP's own bill) split by 2025/26 Hansard days spoken. Leaves out ministers, whips and PPS aides."
      >
        <RankList max={COST_PER_SPOKEN_DAY[0].perDay} rows={PER_DAY_ROWS.slice(0, 3)} />
      </ChartFrame>

      <Expand summary="See the other 7 (£1,554 to £2,339 a day spoken)">
        <MoreRanks max={COST_PER_SPOKEN_DAY[0].perDay} rows={PER_DAY_ROWS.slice(3)} start={4} />
      </Expand>

      <Expand summary="Open the 10 biggest London bills across all four parties (£68k to £85k)">
        <ChartFrame
          kicker="All Parties · Flat + Own Travel + Family Travel (2025/26)"
          title="The 10 biggest Scottish MP London bills in 2025/26"
          caption="Counts flats, hotels, MP travel and family travel from IPSA 2025/26 files. Leaves out staff pay, staff trips and Scottish offices."
        >
          <RankList max={BIGGEST_SHUTTLE_BILLS[0].bill} rows={BIG_BILL_ROWS} />
        </ChartFrame>
      </Expand>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="paid-when-shut">
        Paid for 365 nights when it was shut for 213 days
      </Finding>
      <P>
        The Commons sat on 152 days. For the other <strong>213 days</strong> it was shut for
        weekends, recess, Easter and Christmas.
      </P>

      <Tiles
        items={[
          { value: "152", label: "days the Commons sat in 2025/26" },
          { value: "213", label: "days the Commons was shut", hot: true },
          { value: "365", label: "nights paid on each 12 month flat lease", hot: true },
        ]}
      />

      <P>
        Because most Scottish MPs rent a London flat on a 12 month lease, you pay for all 365
        nights.
      </P>
      <P>
        You pay in August when it is on break. You pay over Christmas. You pay every Friday,
        Saturday and Sunday. IPSA never says how many nights an MP slept there.
      </P>
      <P>
        Only one Scottish MP lets us count each night. He used hotels and block flat stays instead
        of a yearly lease. That is <Link href={mp("glasgow-south-west")}>Dr Zubir Ahmed</Link>{" "}
        (Labour, Glasgow South West).
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
                Taxpayers paid <strong>£37,359</strong> for his London stays. That is 143 more
                nights than open days, or £246 for each open day.
              </>
            ),
          },
          {
            title: "Before his top job (April to July 2025)",
            children: (
              <>
                Westminster opened on <strong>60 days</strong>. You paid for{" "}
                <strong>123 London nights</strong>, more than twice as many. In those four months,
                he spoke on <strong>11 days</strong> and asked <strong>zero written questions</strong>.
              </>
            ),
          },
          {
            title: "After he became a health minister (6 Sept 2025)",
            children: (
              <>
                A minister works in London on weekdays, so more nights make sense. Even so, his
                bills still ran <strong>seven nights a week</strong> (28 to 30 nights a month). See{" "}
                <Link href="/mp-expenses-scotland/receipts#hotel-nights">all 14 of his hotel claims</Link>
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
        MPs say they do lots of unseen work helping local folk with housing, benefits and visas.
        That is true. And it proves the point: <strong>helping folk in Ayr, Stirling or Glasgow
        happens in Scotland, not from a £3,500 a month London flat.</strong>
      </P>
      <P>
        Normal staff across the UK spent five years on Teams and Zoom. Westminster itself ran remote
        votes and video talks in 2020 and 2021. MPs voted safely from their local office in 30
        seconds flat. No plane. No hotel.
      </P>
      <P>Yet Westminster binned remote votes as soon as lockdown ended.</P>
      <P>
        So Scots keep paying £19,173 for each day the Commons sits to fly 55 MPs to London. You
        rent flats that sit empty half the year. You pay their council tax, heat, taxis and car
        parks. You fly their kids down too. All so some can speak on 19 days a year at £3,007 a day
        and walk through a door to say Aye or No.
      </P>

      <Aside title="Fairness notes so nobody can dodge the numbers">
        <p>
          Ministers, whips (who organise their party&apos;s votes) and unpaid PPS aides (like{" "}
          <Link href={mp("motherwell-wishaw-and-carluke")}>Pamela Nash</Link>) are left out of the
          cost per day spoken list because their roles limit speeches. Every number comes straight from IPSA,
          Hansard and Commons vote logs.
        </p>
      </Aside>

      <PostCTA
        title="See every Scottish MP's London bill vs what they did"
        body="Check all 55 Scottish MPs side by side, or search 20,879 claims by postcode."
        href="/mp-expenses-scotland#london-record"
        cta="Compare all 55 Scottish MPs"
      />
    </Prose>
  );
}
