import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published claim files for 2022/23 to 2026/27 (checked
 * 22 November 2026 across all 650 UK MPs, over 350,000 rows) and IPSA's
 * 2025/26 total spend file for every MP. Quoted descriptions are IPSA's exact
 * wording.
 * "London flat and travel" = Accommodation + MP Travel + Dependant Travel in
 * IPSA's 2025/26 claim file. "Not counting staff wages" = IPSA's total spend
 * minus staffing spend (so staff travel is included).
 * The word "hospitality" is kept out of the prose on purpose: our glossary
 * uses it for freebies given to MPs, not food and drink an MP bills for.
 * Free trips: Register of Members' Financial Interests (mpInterests.json).
 */

import {
  type PartyKey,
  PARTY,
  gbp,
  Who,
  QuickTake,
  Finding as KitFinding,
  ChartFrame,
  RankList,
  Receipt,
  CaseCard,
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const DOWNIE = {
  name: "Graeme Downie",
  href: mp("dunfermline-and-dollar"),
  p: "Labour" as PartyKey,
  place: "Dunfermline and Dollar",
};

const FINDINGS = 4;

function Finding({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <KitFinding n={n} of={FINDINGS} id={id}>
      {children}
    </KitFinding>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** Biggest single food, drink and event bills (IPSA "Hospitality"), all MPs, five years. */
const UK_HOSPITALITY: {
  name: string;
  p: PartyKey;
  seat: string;
  href?: string;
  date: string;
  detail: string;
  value: number;
}[] = [
  {
    name: "Graeme Downie",
    p: "Labour",
    seat: "Dunfermline & Dollar",
    href: mp("dunfermline-and-dollar"),
    date: "13 Mar 2025",
    detail: "“Fife College hosted business dinner on behalf of Graeme Downie”",
    value: 962.65,
  },
  {
    name: "Jessica Toale",
    p: "Labour",
    seat: "Bournemouth West",
    date: "6 Feb 2026",
    detail: "“Citizens Panel Launch event”",
    value: 840,
  },
  {
    name: "Saqib Bhatti",
    p: "Conservative",
    seat: "Meriden",
    date: "11 Jan 2024",
    detail: "“Constituency Women in Business Forum event”",
    value: 825,
  },
  {
    name: "Naushabah Khan",
    p: "Labour",
    seat: "Gillingham & Rainham",
    date: "21 Jan 2026",
    detail: "“GILLINGHAM FOOTBALL CL”",
    value: 590.4,
  },
  {
    name: "Stephen McCabe",
    p: "Labour",
    seat: "Birmingham Selly Oak (until 2024)",
    date: "9 May 2023",
    detail: "“LYRECO UK LTD”",
    value: 567.49,
  },
  {
    name: "Susan Murray",
    p: "Lib Dem",
    seat: "Mid Dunbartonshire",
    href: mp("mid-dunbartonshire"),
    date: "7 Jul 2025",
    detail: "“Hospitality event for Business owners of Mid Dunbartonshire.”",
    value: 550,
  },
];

/** Biggest London flat and travel bills, all MPs, 2025/26. */
const UK_LONDON: {
  name: string;
  p: PartyKey;
  seat: string;
  href?: string;
  value: number;
}[] = [
  {
    name: "Graeme Downie",
    p: "Labour",
    seat: "Dunfermline & Dollar",
    href: mp("dunfermline-and-dollar"),
    value: 84992.45,
  },
  {
    name: "Kirsty Blackman",
    p: "SNP",
    seat: "Aberdeen North",
    href: mp("aberdeen-north"),
    value: 80221.61,
  },
  { name: "Josh Simons", p: "Labour", seat: "Makerfield", value: 77414.96 },
  { name: "Stephen Gethins", p: "SNP", seat: "Arbroath & Broughty Ferry", value: 76713.98 },
  { name: "Stephen Flynn", p: "SNP", seat: "Aberdeen South", value: 74100.81 },
  {
    name: "Andrew Bowie",
    p: "Conservative",
    seat: "West Aberdeenshire & Kincardine",
    href: mp("west-aberdeenshire-and-kincardine"),
    value: 74056.61,
  },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function GraemeDownieMpDinnerExpensesDunfermline() {
  return (
    <Prose>
      <QuickTake
        items={[
          <>
            Dunfermline MP <Link href={DOWNIE.href}>Graeme Downie</Link> billed you{" "}
            <strong>£963</strong> for a Fife College dinner in his name. It is the biggest single
            food bill of all 650 UK MPs in five years.
          </>,
          <>
            His <strong>£410,253</strong> bill for 2025/26{" "}
            <strong>includes staff wages</strong>, and no MP in the UK cost more. Leave the wages
            out and he still tops the UK at <strong>£151,954</strong>.
          </>,
          <>
            He was also UK top for his <strong>London flat and trips (£84,992)</strong> and{" "}
            <strong>staff trips (£31,098)</strong>.
          </>,
          <>
            His office pot finished with just <strong>£119</strong> left out of £35,930.
          </>,
        ]}
      />

      <Spotlight
        person={DOWNIE}
        kicker="13 March 2025 · 2024/25 budget year · Food and drink"
        amount="£963"
        headline="A £963 meal in his name, with no guest list."
        lines={[
          {
            meta: "2024/25 · Office Costs · Hospitality",
            what: "Fife College hosted business dinner on behalf of Graeme Downie [200012541-0]",
            amount: "£962.65",
          },
        ]}
      >
        <p>
          The typical MP food bill is £11.60. This one hit nearly £1,000, with no word on who ate or
          why. £0 paid back.
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-dinner">
        Nearly £1,000 for one meal, and no guest list
      </Finding>
      <P>
        Line up every food and drink bill MPs have sent in since 2022, one by one. The one in the
        middle is £11.60. His own 18 other food and drink bills came to £142.55 in all.
      </P>
      <P>
        Then on <strong>13 March 2025</strong>, Labour MP{" "}
        <Link href={DOWNIE.href}>Graeme Downie</Link> billed £962.65 for a Fife College dinner in
        his name. There is no menu, no guest list and no note of why.
      </P>

      <Tiles
        items={[
          { value: "£962.65", label: "his meal bill, 13 March 2025", hot: true },
          { value: "£11.60", label: "typical MP bill for food, drink or events" },
          { value: "£840", label: "next biggest single bill of any MP in five years" },
        ]}
      />

      <P>
        Out of 3,146 food and event bills over five years, just 12 even say dinner. The next
        dearest was £154.
      </P>

      <Expand summary="See the proof: the IPSA line, word for word">
        <Receipt
          person={DOWNIE}
          heading="IPSA records · 2024/25 · Office Costs · Hospitality"
          lines={[
            {
              meta: "13 March 2025 · Claim 60302268-1",
              what: "Fife College hosted business dinner on behalf of Graeme Downie [200012541-0]",
              amount: "£962.65",
            },
          ]}
          total={{ label: "Paid in full · £0 repaid", amount: "£962.65" }}
          footer="Wording as printed by IPSA. His other 18 Hospitality lines (November 2024 to March 2026) came to £142.55 in all, the biggest £48.10."
        />
      </Expand>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-number-one">
        Number one in the entire UK, five times over
      </Finding>
      <P>
        The dinner, from 2024/25, was no fluke. The next year he went further. In 2025/26, Graeme
        Downie topped all 650 UK MPs on four more counts.
      </P>

      <ChartFrame
        kicker="All 650 UK MPs · 2022/23 to 2026/27"
        title="The biggest single food, drink and event bills of any MP"
        caption="Source: Five years of IPSA files for all 650 UK seats. Single bills only, not IPSA's lumped yearly totals."
      >
        <RankList
          max={UK_HOSPITALITY[0].value}
          rows={UK_HOSPITALITY.map((r) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
            side: r.date,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            detail: r.detail,
            highlight: r.name === "Graeme Downie",
          }))}
        />
      </ChartFrame>

      <Tiles
        items={[
          { value: "£410,253", label: "2. UK #1 total bill in 2025/26, staff included", hot: true },
          { value: "£151,954", label: "3. UK #1 bill not counting staff wages" },
          { value: "£84,992", label: "4. UK #1 London flat and travel bill" },
          { value: "£31,098", label: "5. UK #1 staff travel bill" },
        ]}
      />

      <ChartFrame
        kicker="All 650 UK MPs · 2025/26"
        title="The biggest London flat and travel bills of any MP"
        caption="Source: IPSA 2025/26 claim files. Second home costs plus the MP's own travel and family travel. Staff travel not included."
      >
        <RankList
          max={UK_LONDON[0].value}
          rows={UK_LONDON.map((r) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            highlight: r.name === "Graeme Downie",
          }))}
        />
      </ChartFrame>

      <PointList
        items={[
          {
            key: "flat",
            title: "£43,805 for his London flat",
            children: (
              <>
                £41,435 rent plus £1,695 council tax. IPSA raised his cap to £46,380 because two
                family members live with him.
              </>
            ),
          },
          {
            key: "travel",
            title: "£39,216 for his own travel",
            children: <>£29,820 on flights, against £3,935 on trains and £3,308 on parking.</>,
          },
          {
            key: "family",
            title: "£1,972 for family travel",
            children: <>Mostly flights between Fife and London.</>,
          },
        ]}
      />

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="staff-travel-and-more">
        £31,098 for staff travel, and £5,900 of training in one day
      </Finding>
      <P>
        Moving his team around cost <strong>£31,098</strong> in 2025/26, beating every other MP in
        the UK. IPSA lumps it into yearly blocks, so you only see the big buckets:
      </P>

      <Receipt
        person={DOWNIE}
        heading="IPSA records · 2025/26 · Staff travel · Totals for the year"
        lines={[
          { meta: "Staff", what: "Flights", amount: "£11,065.47" },
          { meta: "39 nights", what: "London hotels", amount: "£8,539.00" },
          { meta: "Booked and paid by IPSA", what: "Other hotels", amount: "£3,400.28" },
          { meta: "Staff", what: "Trains", amount: "£3,419.14" },
          { meta: "16 nights", what: "Hotels outside London", amount: "£1,631.60" },
          { meta: "Car mileage, meals, taxis, parking and more", what: "Everything else", amount: "£3,042.11" },
        ]}
        total={{ label: "Staff travel, 2025/26", amount: "£31,097.60" }}
        footer="In plain words. IPSA only prints staff travel as yearly totals, not trip by trip. The year before, his staff travel was £8,361.90."
      />

      <CaseCard kicker="His office pot in 2025/26" figure="£119 left" people={[DOWNIE]}>
        <p>
          Out of a £35,930 office cap, he spent <strong>£35,811</strong> (99.7%).
        </p>
      </CaseCard>

      <P>Local paper adverts were one of the big bills that year:</P>

      <PointList
        items={[
          {
            key: "ads",
            title: "£2,592 for Dunfermline Press adverts (spring 2025)",
            children: (
              <>
                The bills came to £3,792, but one £1,200 bill was a duplicate claim and was paid
                back.
              </>
            ),
          },
        ]}
      />

      <P>The big kit and training bills sit in the year before, 2024/25:</P>

      <PointList
        items={[
          {
            key: "training",
            title: "£5,900 for staff training in one day",
            children: (
              <>
                Six bills on 24 March 2025, one week before the 2024/25 budget year closed, for
                &ldquo;communications training services including written and broadcast
                production&rdquo;. Paid from his staff budget.
              </>
            ),
          },
          {
            key: "folder",
            title: "£2,936 for a letter folding machine (January 2025)",
            children: <>A &ldquo;Quadient machine for folding letters&rdquo;.</>,
          },
          {
            key: "signs",
            title: "£2,066 for office signs (March 2025)",
            children: <>A sign over the front and window signs, both dated 26 March 2025.</>,
          },
          {
            key: "kit",
            title: "£3,014 for desks, chairs and a sofa",
            children: (
              <>
                Four desks (£1,880) and four chairs (£633.60) in October 2024, then a £500 sofa in
                January 2025.
              </>
            ),
          },
        ]}
      />

      <P>
        Outside expenses, he also took three free trips abroad worth £11,882 on his Register of
        Interests: Taiwan (£5,669), Washington (£4,077) and Madrid (£2,137).
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        No cap on trips, and no one saying no
      </Finding>
      <P>
        He broke no rules, and that is the real fault. Trips have no cap at all, so the more an MP
        flies, the more you pay.
      </P>
      <P>
        Fife is a long way from London. Orkney is far further, yet Dunfermline&apos;s MP still cost
        more than all 649 other MPs in the UK. Four questions stand:
      </P>

      <PointList
        items={[
          {
            key: "guests",
            title: "Who sat at the £963 table?",
            children: <>Fife College is named, with no word on who came or why.</>,
          },
          {
            key: "staff",
            title: "Why did his team's trips beat all 649 other MPs?",
            children: <>£31,098 in one year, up from £8,362 in his first year.</>,
          },
          {
            key: "training-q",
            title: "Why £5,900 of staff training in one day before 31 March?",
            children: <>Six bills, all dated 24 March 2025.</>,
          },
          {
            key: "fly",
            title: "Why £29,820 on flights and just £3,935 on trains?",
            children: <>Nearby MPs took far more trains for a lot less cash.</>,
          },
        ]}
      />

      <Aside title="See how Scotland's other London bills add up">
        <p>
          See how Scotland&apos;s MPs{" "}
          <Link href="/blog/scottish-mps-london-homes-152-sitting-days">
            burned £2.91m on London flats and flights for 152 sitting days
          </Link>
          , read <Link href="/blog/worst-scottish-mp-expenses">the worst Scottish MP expenses</Link>,
          or compare <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See every bill Graeme Downie has claimed"
        body="Open our live Receipt Finder on Graeme Downie. Copy any receipt for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=dunfermline-and-dollar"
        cta="See his receipts"
      />
    </Prose>
  );
}
