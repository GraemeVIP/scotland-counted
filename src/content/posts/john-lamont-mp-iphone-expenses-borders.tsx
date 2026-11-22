import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published claim files for 2022/23 to 2026/27 (checked
 * 22 November 2026 across all 650 UK MPs, over 350,000 rows) and IPSA's
 * 2025/26 total spend file. Quoted descriptions are IPSA's exact wording.
 * iPhone counts: every line whose description names an iPhone. Many phone
 * bills only name a shop (APPLE.COM/UK, Currys), so real totals are higher.
 * Receipt Finder total: our search tool's default view (2022/23 to 2026/27,
 * leaving out lumped yearly totals and staff travel).
 * Votes: Commons Divisions 2253 (3 February 2026) and 2265 (23 February 2026).
 * Front bench post: UK Parliament Members API (mpLondonRecord.json).
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

const LAMONT = {
  name: "John Lamont",
  href: mp("berwickshire-roxburgh-and-selkirk"),
  p: "Conservative" as PartyKey,
  place: "Berwickshire, Roxburgh and Selkirk",
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

/** Dearest single iPhone bills where IPSA's line names an iPhone (one handset). */
const UK_IPHONES: {
  name: string;
  p: PartyKey;
  seat: string;
  href?: string;
  date: string;
  detail: string;
  value: number;
}[] = [
  {
    name: "Andrew Western",
    p: "Labour",
    seat: "Stretford & Urmston",
    date: "30 Mar 2026",
    detail: "“Iphone 17”",
    value: 2101.95,
  },
  {
    name: "Barry Gardiner",
    p: "Labour",
    seat: "Brent West",
    date: "2 Dec 2025",
    detail: "“New iPhone 17 Pro”",
    value: 1499,
  },
  {
    name: "Marcus Fysh",
    p: "Conservative",
    seat: "Yeovil (until 2024)",
    date: "13 Jan 2024",
    detail: "“Apple iPhone & cable per invoice”",
    value: 1468,
  },
];

/** Most spent on adverts, all MPs, 2022/23 to 2026/27. */
const UK_ADVERTS: {
  name: string;
  p: PartyKey;
  seat: string;
  href?: string;
  value: number;
}[] = [
  {
    name: "John Lamont",
    p: "Conservative",
    seat: "Berwickshire, Roxburgh & Selkirk",
    href: mp("berwickshire-roxburgh-and-selkirk"),
    value: 49567.9,
  },
  { name: "Ellie Chowns", p: "Greens", seat: "North Herefordshire", value: 27532.48 },
  { name: "Alan Mak", p: "Conservative", seat: "Havant", value: 27024.4 },
  { name: "David Pinto-Duschinsky", p: "Labour", seat: "Hendon", value: 24676.24 },
  {
    name: "David Mundell",
    p: "Conservative",
    seat: "Dumfriesshire, Clydesdale & Tweeddale",
    href: mp("dumfriesshire-clydesdale-and-tweeddale"),
    value: 22437.33,
  },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function JohnLamontMpIphoneExpensesBorders() {
  return (
    <Prose>
      <QuickTake
        items={[
          <>
            <strong>Taxpayers</strong> bought Borders MP <Link href={LAMONT.href}>John Lamont</Link>{" "}
            <strong>two iPhones</strong>. IPSA, the body that pays MPs&apos; expenses with public money,
            paid for both.
          </>,
          <>
            <strong>£1,098</strong> in August 2022, then <strong>£1,248</strong> in June 2025. Most
            people pay for their own phone.
          </>,
          <>
            He also billed <strong>£49,568 on adverts</strong> in five years, the{" "}
            <strong>most of any UK MP</strong>.
          </>,
          <>
            He is the <strong>only one of Scotland&apos;s 57 MPs</strong> whose bills say they bought
            an iPhone.
          </>,
          <>
            He also tops our Receipt Finder, with <strong>£165,521</strong> across 690 bills. That is
            more than any other Scottish MP.
          </>,
        ]}
      />

      <Spotlight
        person={LAMONT}
        kicker="12 June 2025 · His second iPhone on expenses"
        amount="£1,248"
        headline="You paid for his new iPhone and case."
        lines={[
          {
            meta: "9 August 2022 · Office Costs · Mobile phone kit",
            what: "iPhone purchase - John Lamont",
            amount: "£1,098.00",
          },
          {
            meta: "12 June 2025 · Office Costs · Mobile phone kit",
            what: "Iphone and protection case",
            amount: "£1,248.00",
          },
        ]}
      >
        <p>
          Two iPhones in under three years. <strong>£2,346</strong> in all. £0 has been paid back.
        </p>
      </Spotlight>

      <Spotlight
        person={LAMONT}
        kicker="2022/23 to 2026/27 · Adverts and contact cards"
        amount="£49,568"
        headline="The most any UK MP spent on adverts in five years."
        lines={[
          { meta: "1 July 2025", what: "Hawick Paper - surgery advert (6 months)", amount: "£1,224.00" },
          { meta: "17 July 2025", what: "Kelso Life - surgery advert (9 months)", amount: "£1,382.40" },
        ]}
      >
        <p>Two of 201 advert bills. Nearly double the next MP in the UK. Taxpayers paid.</p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-phones">
        Two iPhones, both paid by you
      </Finding>
      <P>
        <Link href={LAMONT.href}>John Lamont</Link> has been the Tory MP for the Borders since 2017.
        His office is on the High Street in Hawick. Since July 2025 he has had a senior front bench
        job: Shadow Deputy Leader of the House.
      </P>
      <P>
        In August 2022, IPSA paid £1,098 for &quot;iPhone purchase - John Lamont&quot;. Less than three
        years later, in June 2025, it paid £1,248 for an &quot;Iphone and protection case&quot;.
      </P>
      <P>
        That is on top of the phone contract. Most months he also billed for the &quot;Hawick office
        mobile phone&quot;, at about £17 to £30 a month.
      </P>
      <P>
        In March 2025 he billed one more gadget: £39.90 for a &quot;Mic for iphone recording&quot;.
      </P>

      <Tiles
        items={[
          { value: "£1,098", label: "iPhone number one, August 2022" },
          { value: "£1,248", label: "iPhone number two, with a case, June 2025" },
          { value: "£2,346", label: "two phones in under three years, paid by you", hot: true },
        ]}
      />

      <P>
        Other Scottish MPs found cheaper ways. His Tory neighbour{" "}
        <Link href={mp("dumfriesshire-clydesdale-and-tweeddale")}>David Mundell</Link> billed £426 for
        a Samsung Galaxy A55.
      </P>
      <P>
        <Link href={mp("na-h-eileanan-an-iar")}>Torcuil Crichton</Link>&apos;s phone bill was £596, to
        Back Market. <Link href={mp("rutherglen")}>Michael Shanks</Link>&apos;s was £570, to Music
        Magpie. Both firms sell used phones.
      </P>
      <P>
        Only one other Scottish MP has billed over £1,000 for a phone.{" "}
        <Link href={mp("glasgow-north-east")}>Maureen Burke</Link> billed £1,199, once, in August
        2024.
      </P>

      <Expand summary="See the proof: both iPhone lines, word for word">
        <Receipt
          person={LAMONT}
          heading="IPSA records · Office Costs · His iPhone bills"
          lines={[
            {
              meta: "9 August 2022 · 2022/23 · Mobile telephone - equipment purchase · Claim 60141404-1",
              what: "iPhone purchase - John Lamont",
              amount: "£1,098.00",
            },
            {
              meta: "12 June 2025 · 2025/26 · Mobile telephone - equipment purchase · Claim 60308213-2",
              what: "Iphone and protection case",
              amount: "£1,248.00",
            },
            {
              meta: "2 March 2025 · 2024/25 · Equipment - purchase · Claim 60285397-4",
              what: "Mic for iphone recording",
              amount: "£39.90",
            },
          ]}
          total={{ label: "Two iPhones · £0 repaid", amount: "£2,346.00" }}
          footer="Wording as printed by IPSA. The mic line is not counted in the total."
        />
      </Expand>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-iphones">
        How his iPhones compare with all 650 MPs
      </Finding>
      <P>
        We searched five years of bills from all 650 MPs for the word iPhone. We found at least{" "}
        <strong>23 MPs</strong> who billed you for buying an iPhone.
      </P>
      <P>
        Many phone bills just say &quot;APPLE.COM&quot; or &quot;Currys&quot;. So the real number is
        higher.
      </P>
      <P>
        Only <strong>three MPs</strong> billed for two iPhones that cost over £1,000 each. John Lamont
        is one. The other two are English MPs Fabian Hamilton and Ian Liddell-Grainger.
      </P>

      <ChartFrame
        kicker="All 650 UK MPs · 2022/23 to 2026/27"
        title="The three dearest single iPhone bills of any MP"
        caption="Source: Five years of IPSA files for all 650 UK seats. Only lines that name an iPhone and buy one handset. Leaves out bills for several phones at once, or a phone with a laptop."
      >
        <RankList
          max={UK_IPHONES[0].value}
          rows={UK_IPHONES.map((r) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
            side: r.date,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            detail: r.detail,
            highlight: r.name === "John Lamont",
          }))}
        />
      </ChartFrame>

      <P>
        His £1,248 phone was the sixth dearest single iPhone bill of all 650 MPs.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="the-rest">
        The rest of his bills: a PR firm, adverts and leaflets
      </Finding>
      <P>
        The phones are the small stuff. Our{" "}
        <Link href="/mp-expenses-scotland/search">Receipt Finder</Link> shows his bills one by one,
        from 2022 to 2026. They add up to <strong>£165,521</strong> across 690 bills. That is more
        than any other Scottish MP.
      </P>
      <P>
        To be fair, part of that is how IPSA prints things. His bills show up one at a time, where many
        MPs have theirs lumped into yearly totals. But most of his total comes from two things: a PR
        firm and adverts.
      </P>

      <CaseCard kicker="13 bills, September 2022 to December 2023" figure="£35,792" people={[LAMONT]}>
        <p>
          <strong>Paid to the PR firm Peach Partners</strong> for speech writing, press releases and
          social media posts. The biggest bill was <strong>£9,125</strong>, for &quot;additional
          hours&quot;.
        </p>
        <p>
          It came out of his staff budget, the pot meant for his own team. Four more bills for the
          same work, at the same £2,083.33 each, do not name the firm. With those, it is{" "}
          <strong>£44,125</strong> across 17 bills.
        </p>
      </CaseCard>

      <P>
        Then the adverts. Over five years he billed <strong>£49,568</strong> for adverts and cards.
        That is the most of any MP in the UK, and nearly double the next MP.
      </P>
      <P>
        Most were adverts for his surgeries in local papers. A surgery is a drop in session where you
        can meet your MP. He paid the Hawick Paper £1,224 at a time, and Kelso Life £1,382.40.
      </P>

      <ChartFrame
        kicker="All 650 UK MPs · 2022/23 to 2026/27"
        title="Most spent on adverts and contact cards by any MP"
        caption="Source: Five years of IPSA files for all 650 UK seats ('Advertising and contact cards')."
      >
        <RankList
          max={UK_ADVERTS[0].value}
          rows={UK_ADVERTS.map((r) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            highlight: r.name === "John Lamont",
          }))}
        />
      </ChartFrame>

      <PointList
        items={[
          {
            key: "newsletter",
            title: "£9,395 for one summer newsletter (2025)",
            children: (
              <>
                £3,990 for a &quot;Parliamentary update leaflet&quot;, £4,348.70 to post it, and
                £1,056 for a letter about his surgery tour. IPSA approved it.
              </>
            ),
          },
          {
            key: "filming",
            title: "£4,500 for filming (2022)",
            children: <>Two bills of £2,250 to &quot;Westminster Digital filming&quot;.</>,
          },
          {
            key: "folder",
            title: "£2,040 for a folding machine (February 2025)",
            children: <>A &quot;Stuffing / folding machine&quot; for his Hawick office, for posting letters.</>,
          },
          {
            key: "year",
            title: "£111,342 in 2025/26, not counting staff wages",
            children: (
              <>
                That puts him 13th of all 650 MPs. With staff it was £370,136. He spent £34,974 of his
                £35,930 office pot.
              </>
            ),
          },
        ]}
      />

      <P>
        One fair point in his favour. He shares his London flat with another MP, so the rent and
        bills are split two ways. That saves you money.
      </P>

      <Expand summary="See the Peach Partners bills and the newsletter, word for word">
        <Receipt
          person={LAMONT}
          heading="IPSA records · Staffing · Bought-in services · Peach Partners"
          lines={[
            {
              meta: "10 March 2023 · The biggest",
              what: "Peach Partners - additional hours as set out on the invoice for broadcast, digital preparation, editing, graphic design and policy generation.",
              amount: "£9,125.00",
            },
            {
              meta: "28 February 2023",
              what: "Peach Partners - social media, speech writing and press support (further details on invoice)",
              amount: "£2,916.66",
            },
            {
              meta: "29 June 2023",
              what: "Peach Partners - press release drafting, social media support, creation of digital media drafting, speech preparation, managing press enquiries and column writing for local press",
              amount: "£2,083.33",
            },
          ]}
          total={{ label: "All 13 Peach Partners bills", amount: "£35,792.12" }}
          footer="Wording as printed by IPSA. Three of the 13 lines shown. The other ten run from September 2022 to December 2023 at £2,083.33 to £2,916.66 each."
        />
        <Receipt
          heading="IPSA records · Summer 2025 newsletter"
          lines={[
            {
              meta: "7 July 2025 · Office Costs",
              what: "Overprinting - surgery tour letter (approved)",
              amount: "£1,056.00",
            },
            {
              meta: "31 July 2025 · Office Costs",
              what: "Parliamentry update newsletter - postage",
              amount: "£4,348.70",
            },
            {
              meta: "18 August 2025 · Staffing",
              what: "Parliamentary update leaflet (approved by IPSA) [200012973-1]",
              amount: "£3,990.00",
            },
          ]}
          total={{ label: "Three bills", amount: "£9,394.70" }}
          footer="Wording as printed by IPSA, spelling mistakes included."
        />
      </Expand>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        Why IPSA paid, and how he voted
      </Finding>
      <P>
        IPSA lets MPs claim for a work phone. It lets them pay a PR firm from the staff pot. It lets
        them advertise their surgeries. So every bill here was within the rules. That is the scandal.
      </P>
      <P>
        Now look at how he voted. On <strong>3 February 2026</strong> and again on{" "}
        <strong>23 February 2026</strong>, he voted No to scrapping the two child limit.
      </P>
      <P>
        That rule stopped families getting the usual Universal Credit help for a third child. He
        voted to keep it. You paid for his second iPhone eight months before.
      </P>
      <P>Four plain questions for him have no answer in the public files:</P>

      <PointList
        items={[
          {
            key: "phone",
            title: "Why a second iPhone in under three years?",
            children: <>Could the first one not be fixed, or kept going?</>,
          },
          {
            key: "price",
            title: "Why £1,248 when others paid £426 to £596?",
            children: <>Fellow Scottish MPs got work phones for less than half the price.</>,
          },
          {
            key: "pr",
            title: "Why pay a PR firm on top of his own staff?",
            children: <>£35,792 went to Peach Partners from the pot meant for his team.</>,
          },
          {
            key: "ads",
            title: "Why do his adverts cost more than any other MP's?",
            children: <>£49,568 in five years, nearly double the next MP in the UK.</>,
          },
        ]}
      />

      <Aside title="Part of a wider pattern in Westminster">
        <p>
          <Link href={LAMONT.href}>John Lamont</Link> is not alone. We found a{" "}
          <Link href="/blog/worst-scottish-mp-expenses">£24,515 phone tab</Link> for another Scottish
          MP, and <Link href="/blog/scottish-mps-tv-licence-expenses">29 Scottish MPs</Link> who billed you
          for TV licences. See <Link href="/mp-expenses-scotland/receipts">the oddest claims</Link> or
          compare <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See every bill John Lamont has claimed"
        body="Open our live Receipt Finder on John Lamont. Copy any claim for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=berwickshire-roxburgh-and-selkirk"
        cta="See his receipts"
      />
    </Prose>
  );
}
