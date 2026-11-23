import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { ExpenseMpCheck, ExpenseNextUp } from "@/components/ExpenseStoryRail";
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
            Borders Tory MP <Link href={LAMONT.href}>John Lamont</Link> billed you for{" "}
            <strong>two iPhones</strong> in under three years: <strong>£1,098</strong> (2022) and{" "}
            <strong>£1,248</strong> (2025).
          </>,
          <>
            Eight months after getting his next iPhone, he voted <strong>twice</strong> to keep the
            two child limit on poor homes.
          </>,
          <>
            Over five years he spent <strong>£49,568 on ads</strong>. That is top of all 650 UK
            MPs, and nearly twice the next one.
          </>,
          <>
            He also paid a PR firm <strong>£35,792</strong> out of his staff pot.
          </>,
        ]}
      />

      <ExpenseMpCheck slug="john-lamont-mp-iphone-expenses-borders" />

      <Spotlight
        person={LAMONT}
        kicker="12 June 2025 · His second iPhone on expenses"
        amount="£1,248"
        headline="Two iPhones in under three years, paid by you."
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
          <strong>£2,346</strong> on two phones. Other Scottish MPs bought used phones for under
          £600. £0 paid back.
        </p>
      </Spotlight>

      <Spotlight
        person={LAMONT}
        kicker="2022/23 to 2026/27 · Adverts and contact cards"
        amount="£49,568"
        headline="The UK's biggest MP ad spender, nearly twice second place."
        lines={[
          { meta: "1 July 2025", what: "Hawick Paper - surgery advert (6 months)", amount: "£1,224.00" },
          { meta: "17 July 2025", what: "Kelso Life - surgery advert (9 months)", amount: "£1,382.40" },
        ]}
      >
        <p>201 ad bills in five years, putting his name in local papers on your cash.</p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-phones">
        Two £1,000+ iPhones, while his peers bought cheaper
      </Finding>
      <P>
        Most people keep a phone until the screen breaks or it dies. Not Borders Tory MP{" "}
        <Link href={LAMONT.href}>John Lamont</Link>.
      </P>
      <P>
        A claim dated 9 August 2022 billed you £1,098 for &ldquo;iPhone purchase - John
        Lamont&rdquo;. Under three years on, you bought him a new one with a case for £1,248. On top came a £39.90 mic
        and £17 to £30 a month for his office phone plan.
      </P>

      <Tiles
        items={[
          { value: "£1,098", label: "iPhone one, August 2022" },
          { value: "£1,248", label: "iPhone two and case, June 2025" },
          { value: "£2,346", label: "two phones in under three years", hot: true },
        ]}
      />

      <P>
        Other Scottish MPs spent far less. His Tory neighbour{" "}
        <Link href={mp("dumfriesshire-clydesdale-and-tweeddale")}>David Mundell</Link> paid £426 for
        a Samsung. <Link href={mp("na-h-eileanan-an-iar")}>Torcuil Crichton</Link> (£596 at Back
        Market) and <Link href={mp("rutherglen")}>Michael Shanks</Link> (£570 at Music Magpie) both
        bought used phones.
      </P>
      <P>
        Of today&apos;s 57 Scottish MPs, just one other has a bill naming a phone over £1,000:{" "}
        <Link href={mp("glasgow-north-east")}>Maureen Burke</Link>, once, at £1,199.
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
        One of just three MPs in the UK to claim two £1,000+ iPhones
      </Finding>
      <P>
        At least <strong>23 MPs</strong> named an iPhone on expenses since 2022 (and more hide
        behind shop names like Apple or Currys).
      </P>
      <P>
        Only <strong>three MPs out of 650</strong> put through two iPhones over £1,000 each: John
        Lamont, Fabian Hamilton and Ian Liddell-Grainger. Lamont&apos;s £1,248 bill sits sixth
        dearest in the UK.
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

      {/* ------------------------------------------------------------ 3 */}
      <ExpenseNextUp slug="john-lamont-mp-iphone-expenses-borders" />

      <Finding n={3} id="the-rest">
        £49,568 on ads and £35,792 for a PR firm
      </Finding>
      <P>
        In our <Link href="/mp-expenses-scotland/search">Receipt Finder</Link>, his 690 bills add up
        to <strong>£165,521</strong>. That is top in Scotland, in part because IPSA prints his bills
        one by one instead of in yearly lumps.
      </P>
      <P>Two things eat most of that cash: a PR firm and local paper ads.</P>

      <CaseCard kicker="13 bills, September 2022 to December 2023" figure="£35,792" people={[LAMONT]}>
        <p>
          <strong>Paid to PR firm Peach Partners</strong> for speeches, press notes and social
          posts. One bill hit <strong>£9,125</strong> for &ldquo;additional hours&rdquo;.
        </p>
        <p>
          All of it came out of his staff pot. Add four unnamed bills at the same £2,083.33 rate and
          it hits <strong>£44,125</strong> across 17 bills.
        </p>
      </CaseCard>

      <P>
        Next come the ads: <strong>£49,568</strong> in five years. Most were drop in dates in local
        papers, like £1,224 at a time to the Hawick Paper and £1,382.40 to Kelso Life. No MP in the
        UK came close.
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
                £3,990 to print a &ldquo;Parliamentary update leaflet&rdquo;, £4,348.70 to post it,
                and £1,056 for a surgery tour letter.
              </>
            ),
          },
          {
            key: "filming",
            title: "£4,500 for filming (2022)",
            children: <>Two £2,250 bills to &ldquo;Westminster Digital filming&rdquo;.</>,
          },
          {
            key: "folder",
            title: "£2,040 for a letter folding machine (February 2025)",
            children: <>Bought for his Hawick office to stuff envelopes.</>,
          },
          {
            key: "year",
            title: "£111,342 in 2025/26, not counting staff wages",
            children: (
              <>
                13th highest of all 650 UK MPs (£370,136 with staff). He spent £34,974 of his
                £35,930 office pot.
              </>
            ),
          },
        ]}
      />

      <P>
        Credit where it is due: he shares his London flat with another MP, splitting the rent and
        saving taxpayers money.
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
        Two new iPhones for him, no help for a third child
      </Finding>
      <P>
        None of this broke IPSA&apos;s rules. Work phones, PR firms and local ads are all allowed.
      </P>
      <P>
        Now look at how he voted. Eight months after you bought his next iPhone, he voted No on{" "}
        <strong>3 February 2026</strong> and <strong>23 February 2026</strong> to keep the two child
        limit on Universal Credit.
      </P>
      <P>Borders voters can judge that for themselves, and ask him four plain questions:</P>

      <PointList
        items={[
          {
            key: "phone",
            title: "Why buy a new iPhone in under three years?",
            children: <>Did the first £1,098 phone break, or just get old?</>,
          },
          {
            key: "price",
            title: "Why pay £1,248 when other Scots MPs paid £426 to £596?",
            children: <>Other MPs got by on less than half the cost.</>,
          },
          {
            key: "pr",
            title: "Why pay a PR firm £35,792 on top of office staff?",
            children: <>That cash came straight from his staff pot.</>,
          },
          {
            key: "ads",
            title: "Why spend twice as much as other MPs on ads?",
            children: <>£49,568 in five years, top of all 650 seats.</>,
          },
        ]}
      />

      <Aside title="See the rest of Scotland's phone and perk bills">
        <p>
          Phones are only the start. See a{" "}
          <Link href="/blog/worst-scottish-mp-expenses">£24,515 mobile phone tab</Link>,{" "}
          <Link href="/blog/scottish-mps-tv-licence-expenses">29 Scottish MPs claiming TV licences</Link>{" "}
          or compare <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See every bill John Lamont has claimed"
        body="Open our live Receipt Finder on John Lamont. Copy any receipt for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=berwickshire-roxburgh-and-selkirk"
        cta="See his receipts"
      />
    </Prose>
  );
}
