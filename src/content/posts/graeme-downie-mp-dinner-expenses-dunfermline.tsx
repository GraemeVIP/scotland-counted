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
            <strong>Taxpayers</strong> paid <strong>£963</strong> for a business dinner for Dunfermline
            MP <Link href={DOWNIE.href}>Graeme Downie</Link>. Fife College hosted it in March 2025 (the
            2024/25 budget year).
          </>,
          <>
            It is the <strong>biggest single bill for food, drink or events</strong> of any of the
            650 UK MPs in five years. The typical one is £11.60.
          </>,
          <>
            In 2025/26, with his staff, he cost you <strong>£410,253</strong>. That is more than{" "}
            <strong>any other MP in the UK</strong>.
          </>,
          <>
            His 2025/26 London flat and travel bill, <strong>£84,992</strong>, was the biggest in the UK
            too.
          </>,
          <>
            So was his 2025/26 staff travel: <strong>£31,098</strong>, number one of all 650 MPs.
          </>,
        ]}
      />

      <Spotlight
        person={DOWNIE}
        kicker="13 March 2025 · 2024/25 budget year · Food and drink"
        amount="£963"
        headline="You paid for a business dinner in his name."
        lines={[
          {
            meta: "2024/25 · Office Costs · Hospitality",
            what: "Fife College hosted business dinner on behalf of Graeme Downie [200012541-0]",
            amount: "£962.65",
          },
        ]}
      >
        <p>
          The file does not say who ate, how many came, or what it was for. £0 has been paid back.
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-dinner">
        The £963 dinner
      </Finding>
      <P>
        <Link href={DOWNIE.href}>Graeme Downie</Link> won Dunfermline and Dollar for Labour in July
        2024.
      </P>
      <P>
        On 13 March 2025, Fife College hosted a &quot;business dinner&quot; on his behalf. IPSA, the
        body that pays MPs&apos; expenses, paid £962.65 from his office budget.
      </P>
      <P>
        That is all the public record says. There is no guest list. There is no menu. There is no
        reason given.
      </P>
      <P>
        His other 18 bills for food and drink came to <strong>£142.55</strong> all together. Most
        were under £10. This one dinner was nearly £1,000.
      </P>

      <Tiles
        items={[
          { value: "£962.65", label: "his business dinner, 13 March 2025 (2024/25)", hot: true },
          { value: "£11.60", label: "the typical MP bill for food, drink or events" },
          { value: "£840", label: "the next biggest single food, drink or event bill of any MP" },
        ]}
      />

      <P>
        IPSA files food, drink and events under one heading. Only 12 of those bills use the word
        dinner. The next biggest of them was £154, for one Lib Dem MP&apos;s team Christmas dinner.
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
        Number one in the UK on five counts
      </Finding>
      <P>
        Count one. We checked all 3,146 food, drink and event bills from all 650 MPs over five years.
        His 2024/25 dinner is the <strong>biggest single one</strong>.
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

      <P>
        Counts two to five come from IPSA&apos;s 2025/26 totals for every MP in the UK. He came top
        on all four.
      </P>

      <Tiles
        items={[
          { value: "£410,253", label: "2. His total bill in 2025/26, staff included", hot: true },
          { value: "£151,954", label: "3. His 2025/26 bill not counting staff wages" },
          { value: "£84,992", label: "4. His 2025/26 London flat and travel bill" },
          { value: "£31,098", label: "5. His staff's travel in 2025/26" },
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
                That includes £41,435 of rent and £1,695 of council tax. IPSA gave him a bigger
                budget, £46,380, to cover two family members who live with him.
              </>
            ),
          },
          {
            key: "travel",
            title: "£39,216 for his own travel",
            children: <>£29,820 of it on flights. He billed £3,935 for trains and £3,308 for parking.</>,
          },
          {
            key: "family",
            title: "£1,972 for family travel",
            children: <>Trips for his family between home and London, mostly flights.</>,
          },
        ]}
      />

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="staff-travel-and-more">
        £31,098 for his staff to travel, and the rest
      </Finding>
      <P>
        Staff travel is what his team&apos;s trips cost. In 2025/26 it came to{" "}
        <strong>£31,098</strong>. No MP in the UK billed more.
      </P>
      <P>
        IPSA lumps staff travel into yearly totals. So we cannot see who went where. But we can see
        what it was spent on.
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

      <P>He billed plenty more for his office too. Here are the big ones:</P>

      <PointList
        items={[
          {
            key: "training",
            title: "£5,900 for staff training, in one day",
            children: (
              <>
                Six bills on 24 March 2025, a week before the budget year ended, for
                &quot;communications training services including written and broadcast
                production&quot;.
              </>
            ),
          },
          {
            key: "folder",
            title: "£2,936 for a letter folding machine (January 2025)",
            children: <>A &quot;Quadient machine for folding letters&quot;.</>,
          },
          {
            key: "signs",
            title: "£2,066 for office signs (March 2025)",
            children: <>A sign above the door and signs on the window, both on 26 March 2025.</>,
          },
          {
            key: "kit",
            title: "£3,014 for desks, chairs and a sofa",
            children: <>Four desks (£1,880), four chairs (£633.60) and a £500 sofa for the office.</>,
          },
          {
            key: "ads",
            title: "£3,792 for Dunfermline Press adverts (spring 2025)",
            children: <>£1,200 of that was claimed twice by mistake. He paid it back.</>,
          },
        ]}
      />

      <CaseCard kicker="His office pot in 2025/26" figure="£119 left" people={[DOWNIE]}>
        <p>
          IPSA gave him £35,930 to run his office. He spent <strong>£35,811</strong>. That is 99.7% of
          the pot.
        </p>
      </CaseCard>

      <P>
        Others paid for some of his trips too. He declared three free trips worth £11,882 on the
        Register of Interests: Taiwan (£5,669, paid by Taiwan&apos;s government), Washington (£4,077)
        and Madrid (£2,137).
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        Why IPSA paid it all
      </Finding>
      <P>
        IPSA checked the dinner and paid it in full. It was billed to his office budget, so the rules
        allowed it. That is the scandal.
      </P>
      <P>
        The big totals are within the rules too. There is no cap on MPs&apos; travel. The more they
        fly, the more they can bill. And IPSA lets him spend more on the flat because of his
        family.
      </P>
      <P>
        To be fair, a Fife MP has a long way to go to work. But no other MP in the UK, from Orkney to
        Cornwall, cost you more last year. Four plain questions have no answer in the public files:
      </P>

      <PointList
        items={[
          {
            key: "guests",
            title: "Who came to the £963 dinner, and what was it for?",
            children: <>The file names Fife College and nothing else.</>,
          },
          {
            key: "staff",
            title: "Why does his team's travel cost more than any other MP's?",
            children: <>£31,098 in a year. His first year, which was shorter, came to £8,362.</>,
          },
          {
            key: "training-q",
            title: "Why £5,900 of training in one day, a week before the year ended?",
            children: <>Six bills, all dated 24 March 2025.</>,
          },
          {
            key: "fly",
            title: "Why fly so much?",
            children: <>£29,820 on flights in a year, against £3,935 on trains.</>,
          },
        ]}
      />

      <Aside title="Part of a wider pattern in Westminster">
        <p>
          <Link href={DOWNIE.href}>Graeme Downie</Link> is not alone. See how Scotland&apos;s MPs{" "}
          <Link href="/blog/scottish-mps-london-homes-152-sitting-days">
            billed for London homes for 152 sitting days
          </Link>
          , read <Link href="/blog/worst-scottish-mp-expenses">the worst Scottish MP expenses</Link>,
          or compare <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See every bill Graeme Downie has claimed"
        body="Open our live Receipt Finder on Graeme Downie. Copy any claim for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=dunfermline-and-dollar"
        cta="See his receipts"
      />
    </Prose>
  );
}
