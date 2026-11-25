import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, Lead, P, PostCTA } from "@/components/Prose";
import ExpensesWhatItBuys from "@/components/ExpensesWhatItBuys";
import {
  gbp,
  QuickTake,
  Finding as KitFinding,
  ChartFrame,
  Bar,
  Swatch,
  CaseCard,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

/*
 * Written in Graeme's voice (graeme-writing skill) to UK tabloid Reading Age
 * 8 to 10 (Flesch-Kincaid Grade <= 5.5).
 *
 * Every figure is verified with zero double-counting from:
 * - IPSA 2025/26 official Scottish MP claims (the 55 Scottish MPs still in Parliament
 *   who served all of 2025/26, 6,101 rows, £18,328,069.26 total; re-checked 23 Nov 2026)
 * - Scottish Parliament 2024/25 official MSP claims (129 MSPs, £27,450,000 total,
 *   £4,576,651.88 direct non-staff claims)
 * - Scottish Government 2025/26 Scottish Welfare Fund Crisis Grant statistics
 * - NHS Scotland 2025/26 Agenda for Change Band 5 nurse pay (£32,073) & Public
 *   Health Scotland waiting list statistics (588,864 patients waiting)
 *
 * Restyled for phone skim readers (22 Nov 2026): named receipts with faces
 * first, calculator straight after, one mention of each total near the top.
 */

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;
const msp = (path: string) => `/representatives/msps/${path}`;

const FINDINGS = 5;

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

const FOUR_POTS = [
  { what: "Second homes, hotels and second home council tax", mp: 1_559_441, msp: 993_355, total: 2_552_796 },
  { what: "Travel: flights, cars, taxis, parking, staff and family trips", mp: 1_920_661, msp: 359_290, total: 2_279_950 },
  { what: "Glossy leaflets, calendars, billboards, PR firms and consultants", mp: 227_067, msp: 1_506_916, total: 1_733_983 },
  { what: "Papers, TV licences, dinners and one £20,385 Yu Energy bill", mp: 36_966, msp: 37_621, total: 74_587 },
];

const CRISIS_COMPARISON = [
  { label: "Dundee: 3,350 Crisis Grants", value: 338_560, display: "£338,560", hot: false },
  { label: "Edinburgh: 17,290 Crisis Grants", value: 2_120_654, display: "£2,120,654", hot: false },
  { label: "Glasgow: 25,940 Crisis Grants", value: 3_950_416, display: "£3,950,416", hot: false },
  { label: "All three cities together: 46,580 Crisis Grants", value: 6_409_630, display: "£6,409,630", hot: false },
  { label: "Scottish MPs + MSPs: 1 year of 2nd homes, travel, leaflets, PR and extras", value: 6_641_316, display: "£6,641,316", hot: true },
];

const EXTRAS = [
  {
    what: "Glossy leaflets, annual reports, calendars and billboards",
    amount: 1_562_047,
    detail: "£1,388,987 by MSPs (77.8% of the Greens' pot spent in March) + £173,060 by MPs",
  },
  {
    what: "Flying MP office staff around and London staff hotels",
    amount: 565_753,
    detail: "Includes £188,478 on staff flights and £169,523 on London hotels",
  },
  {
    what: "Second home council tax billed to taxpayers",
    amount: 243_021,
    detail: "£161,374 for MSPs (up 122% once councils doubled it) + £81,647 for 47 MPs",
  },
  {
    what: "Outside PR firms, unnamed consultants and speech coaches",
    amount: 171_937,
    detail: "£117,929 by MSPs (Craigview, Pink Elephant) + £54,008 by MPs (£10k unnamed)",
  },
];

const EXTRAS_SMALL = [
  {
    what: "MPs' own taxis and airport parking",
    amount: 97_491,
    detail: "£58,237 parking (up to £121 a week) + £39,254 taxis",
  },
  {
    what: "Flights, trains and taxis for MPs' partners and children",
    amount: 89_111,
    detail: "Billed by 35 of the 55 Scottish MPs (top: Melanie Ward, £7,932)",
  },
  {
    what: "Newspapers and magazines (both parliaments have free libraries)",
    amount: 45_147,
    detail: "£35,987 by MSPs (£127,627 over 4 years) + £9,160 by MPs",
  },
  {
    what: "Kilmarnock MP's one day Yu Energy bill (the 2025/26 part)",
    amount: 20_385,
    detail: "The same day total across both lines was £23,437",
  },
  {
    what: "Office TV licences, dinners, Christmas lunches and cancelled hotel rooms",
    amount: 9_056,
    detail: "£4,965 TV licences (£3,863 MPs + £1,102 MSPs) + £3,559 MPs' dinners and lunches + £532 for cancelled MSP staff hotel rooms",
  },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function ScottishMpMspExpensesWhatItCouldBuy() {
  const potMax = FOUR_POTS[0].total;
  const crisisMax = CRISIS_COMPARISON[CRISIS_COMPARISON.length - 1].value;
  const extrasMax = EXTRAS[0].amount;

  return (
    <Prose>
      <Lead>
        In one year, 184 Scottish MPs and MSPs spent £6.64 million on second homes, hotels,
        travel, leaflets, PR firms and papers. More than Glasgow, Edinburgh and Dundee gave out in
        Crisis Grants all year. A Crisis Grant is emergency cash from your council when you
        can&apos;t pay for food or heating.
      </Lead>

      <QuickTake
        items={[
          <>
            Biggest bill on one date: <strong>£23,437 in two claims</strong> to Yu Energy, an
            energy supplier, for Kilmarnock MP{" "}
            <Link href={mp("kilmarnock-and-loudoun")}>Lillian Jones</Link>.
          </>,
          <>
            <strong>Staff pay and local office rent are left out.</strong> This is only homes,
            travel, leaflets, PR and papers.
          </>,
          <>
            Even if you take out flats and MP travel, <strong>£2.80 million a year</strong> goes
            on leaflets, PR firms, second home council tax, taxis and papers.
          </>,
          <>
            The full one year total would pay <strong>207 new NHS nurses</strong> for a year.
          </>,
        ]}
      />

      <P>
        We use the latest full year each parliament has published: <strong>2025/26</strong> for
        the 55 Scottish MPs still in Parliament who served all of 2025/26 (from IPSA, the body that
        pays MPs&apos; expenses), and <strong>2024/25</strong> for 129 MSPs (from Holyrood, the
        Scottish Parliament).
      </P>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-receipts-proof">
        The biggest bills and totals, with faces
      </Finding>
      <P>
        These come from <strong>several years</strong>, not just the one year above. Each card
        tells you if it&apos;s one bill or a total.
      </P>

      <CaseCard
        kicker="Two claims, one date · 156 Warm Home Discounts"
        figure="£23,437"
        people={[
          {
            name: "Lillian Jones MP",
            href: mp("kilmarnock-and-loudoun"),
            p: "Labour",
            place: "Kilmarnock and Loudoun",
          },
        ]}
      >
        <p>
          <strong>Two claims to Yu Energy, an energy supplier, both dated 19 May 2026.</strong>{" "}
          £20,385 came from the 2025/26 budget and £3,052 from 2026/27. It came after she voted to
          cut the Winter Fuel Payment.
        </p>
        <p>
          Together they equal <strong>156 Warm Home Discounts</strong> (£150 off a low income
          home&apos;s winter power bill) in East Ayrshire, or <strong>180 Crisis Grants</strong>.{" "}
          <Link href="/blog/kilmarnock-mp-23437-electricity-bill">Read the full story →</Link>
        </p>
      </CaseCard>

      <Spotlight
        person={{
          name: "Angus MacDonald MP",
          href: mp("inverness-skye-and-west-ross-shire"),
          p: "Lib Dem",
          place: "Inverness, Skye and West Ross-shire",
        }}
        kicker="17 July 2025 · one workshop"
        amount="£3,000"
        headline="Public funds paid for his speech workshop."
        lines={[
          {
            meta: "Comms & Media · paid from his staffing budget",
            what: "Provision of personalised presentation and speech skills workshop to assist MPs representational role in Parliament.",
            amount: "£3,000.00",
          },
        ]}
      >
        <p>
          One workshop on how to give speeches. <strong>Which is a big part of the job he was
          elected to do.</strong>
        </p>
        <p>
          <Link href="/blog/angus-macdonald-mp-speech-coach-drains-expenses" className="font-[660] text-[#8bb8ff] underline underline-offset-4">
            Read the full story →
          </Link>
        </p>
      </Spotlight>

      <Spotlight
        person={{
          name: "Melanie Ward MP",
          href: mp("cowdenbeath-and-kirkcaldy"),
          p: "Labour",
          place: "Cowdenbeath and Kirkcaldy",
        }}
        kicker="2025/26 · top family travel bill of any Scottish MP"
        amount="£7,932"
        headline="Her family's flights and trains, on expenses."
        lines={[
          { meta: "Family travel · Air travel", what: "Aggregated figure for travel during 2025-26", amount: "£7,607.27" },
          { meta: "Family travel · Rail", what: "Aggregated figure for travel during 2025-26", amount: "£305.40" },
          { meta: "Family travel · Other public transport", what: "Aggregated figure for travel during 2025-26", amount: "£19.80" },
        ]}
      >
        <p>
          35 of the 55 Scottish MPs still in Parliament claimed for partners and children in
          2025/26. Hers was the biggest bill.
        </p>
        <p>
          She also billed <strong>£14,000 for consultants nobody names</strong>: £10,000 for a
          &ldquo;Policy and Office set up consultant&rdquo; (December 2024) and £4,000 for
          &ldquo;Communications Support&rdquo; (July 2025).
        </p>
      </Spotlight>

      <CaseCard
        kicker="Total over 8 years (2016 to 2024)"
        figure="£36,953"
        people={[
          {
            name: "Alexander Burnett",
            href: msp("constituencies/aberdeenshire-west"),
            p: "Conservative",
            place: "MSP",
          },
        ]}
      >
        <p>
          <strong>Spent printing and posting calendars and fridge magnets</strong> from 2016 to
          2024. He&apos;s the MSP for Aberdeenshire West, and a rich estate owner. £9,545 of it went
          out in December 2024 alone.
        </p>
        <p>
          Enough for <strong>14,212 hot school lunches</strong> at £2.60 each.
        </p>
      </CaseCard>

      <CaseCard
        kicker="Total of 13 bills"
        figure="£35,792"
        people={[
          {
            name: "John Lamont MP",
            href: mp("berwickshire-roxburgh-and-selkirk"),
            p: "Conservative",
          },
        ]}
      >
        <p>
          <strong>Paid to the PR firm Peach Partners across 13 bills</strong>, from his budget for
          staff. The work covered speech notes, social media posts and media prep. He is MP for
          Berwickshire, Roxburgh and Selkirk.
        </p>
        <p>
          Enough to pay <strong>1 new NHS nurse</strong> for a year (£32,073), with £3,719 to
          spare.{" "}
          <Link href="/blog/john-lamont-mp-iphone-expenses-borders">Read his full story →</Link>
        </p>
      </CaseCard>

      <Spotlight
        person={{
          name: "Mark Griffin",
          href: msp("regions/central-scotland-and-lothians-west/mark-griffin"),
          p: "Labour",
          place: "MSP",
        }}
        kicker="November 2023 to March 2024 · £600 a day"
        amount="£11,400"
        headline="Public funds paid an ex Labour adviser's firm for office support."
        lines={[
          { meta: "Nov 2023 · Craigview Strategies Limited", what: "Consultancy costs associated with support for private members bill", amount: "£2,400.00" },
          { meta: "Dec 2023 · Craigview Strategies Limited", what: "Consultancy re: private members bill", amount: "£2,400.00" },
          { meta: "Mar 2024 · Craigview Strategies Limited", what: "Consultancy Costs Private Members Bill", amount: "£2,400.00" },
        ]}
      >
        <p>
          Two more bills (£4,200) took it to £11,400. Craigview Strategies is run by ex Scottish
          Labour boss Brian Roy.
        </p>
        <p>
          Fellow Labour MSP{" "}
          <Link href={msp("regions/north-east-scotland/michael-marra")}>Michael Marra</Link> paid
          the same firm <strong>£8,400</strong> in 2023. Together, that <strong>£19,800</strong>{" "}
          could fund <strong>152 Crisis Grants</strong> (£130 each) for homes with empty cupboards.
        </p>
      </Spotlight>

      <Spotlight
        person={{
          name: "Patrick Harvie",
          href: msp("regions/glasgow/patrick-harvie"),
          p: "Greens",
          place: "MSP · Glasgow",
        }}
        kicker="28 March 2025 · 3 days before the budget cutoff"
        amount="£17,400"
        headline="His annual report, printed and posted in one bill."
        lines={[
          { meta: "Alliance Print Group", what: "Annual Report Printing & Mailing costs", amount: "£17,400.00" },
        ]}
      >
        <p>
          Sent in three days before the year ran out, just before unspent leaflet cash vanished.
          The same money pays for <strong>134 Crisis Grants</strong> or{" "}
          <strong>6,692 school lunches</strong>.
        </p>
      </Spotlight>

      <CaseCard
        kicker="Total of 57 claims"
        figure="£24,515"
        people={[
          {
            name: "Brendan O'Hara MP",
            href: mp("argyll-bute-and-south-lochaber"),
            p: "SNP",
          },
        ]}
      >
        <p>
          <strong>Spent on mobile phone bills over 57 claims.</strong> He is MP for Argyll, Bute
          and South Lochaber.
        </p>
        <p>
          Enough for <strong>188 Crisis Grants</strong> at the £130 average award across
          Scotland.
        </p>
      </CaseCard>

      <CaseCard
          kicker="194 claims over 4 years · 5,180 school lunches"
          figure="£13,469"
          people={[
            { name: "Kate Forbes", p: "SNP", place: "MSP" },
            {
              name: "Murdo Fraser",
              href: msp("regions/mid-scotland-and-fife/murdo-fraser"),
              p: "Conservative",
              place: "MSP",
            },
          ]}
        >
          <p>
            <strong>194 newspaper and magazine claims</strong> between them, from May 2021 to June
            2025.
          </p>
        </CaseCard>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="nhs-and-schools">
        What one year of claims could pay for instead
      </Finding>
      <P>
        Tap a pot below. The cards show what the same money would pay for in Scotland.
      </P>

      <ExpensesWhatItBuys />

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="the-665m-bill">
        Where the £6.64 million goes
      </Finding>
      <P>
        Four kinds of claim make up the whole bill. Second homes and travel are the biggest.
      </P>

      <ChartFrame
        kicker="One year · 55 MPs (2025/26) + 129 MSPs (2024/25)"
        title="The £6.64 million bill, in four parts"
        caption="Source: IPSA 2025/26 and Holyrood 2024/25 public files. Staff pay and local office rent are left out. The £20,385 Yu Energy line is the 2025/26 part of Lillian Jones' £23,437; the other £3,052 came from the 2026/27 budget."
      >
        <div className="space-y-5">
          {FOUR_POTS.map((r) => (
            <div key={r.what}>
              <p className="ui mb-1 text-[16px] font-[640] leading-[1.4] text-[var(--ink)]">{r.what}</p>
              <Bar value={r.total} max={potMax} label={gbp(r.total, false)} />
              <p className="ui mt-1 text-[15px] text-[var(--ink-2)]">
                MPs {gbp(r.mp, false)} · MSPs {gbp(r.msp, false)}
              </p>
            </div>
          ))}
        </div>

        <div className="ui mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t-2 border-[var(--ink)] pt-3.5">
          <span className="text-[16px] font-[700] text-[var(--ink)]">One year total</span>
          <span className="tnum text-[19px] font-[700] text-[var(--bad-text)]">£6,641,316</span>
        </div>
      </ChartFrame>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="crisis-grants-bombshell">
        Side by side with Crisis Grants in Glasgow, Edinburgh and Dundee
      </Finding>
      <P>
        Across all 32 councils, the average Crisis Grant in 2025/26 was <strong>£130</strong>. In
        these three cities it works out at about £138. Cash strapped council teams{" "}
        had to <strong>turn down 89,990 emergency claims</strong>. And for a home with no money for
        food or the gas meter, a Crisis Grant is the last lifeline.
      </P>

      <ChartFrame
        kicker="One year · Crisis Grants vs MP and MSP claims"
        title="Glasgow, Edinburgh and Dundee's Crisis Grants vs one year of MP and MSP claims"
        legend={
          <>
            <Swatch colour="var(--rule-strong)">Emergency Crisis Grants for families</Swatch>
            <Swatch colour="var(--bad)">MP + MSP 2nd homes, travel, leaflets &amp; extras</Swatch>
          </>
        }
        caption={
          <>
            Source: Scottish Government <Link href="/crisis-grant-scotland">Crisis Grant</Link> figures to 31
            March 2026, IPSA 2025/26 and Holyrood 2024/25.
          </>
        }
      >
        <div className="space-y-4">
          {CRISIS_COMPARISON.map((c) => (
            <div key={c.label}>
              <p
                className={`ui mb-1 text-[15.5px] leading-[1.4] ${
                  c.hot ? "font-[700] text-[var(--ink)]" : "text-[var(--ink-2)]"
                }`}
              >
                {c.label}
              </p>
              <Bar
                value={c.value}
                max={crisisMax}
                colour={c.hot ? "var(--bad)" : "var(--rule-strong)"}
                label={c.display}
              />
            </div>
          ))}
        </div>
      </ChartFrame>

      {/* ------------------------------------------------------------ 5 */}
      <Finding n={5} id="zero-excuse-pot">
        Even without flats and MP travel, £2.80 million a year goes on extras
      </Finding>
      <P>
        Politicians often say an MP or MSP from far away needs a flat, and a train or flight, to get
        to work.
      </P>
      <P>
        So take out all second home rent and heat bills, and all their own flights, trains and car
        miles.
      </P>
      <P>
        The bill still comes to <strong>£2,803,948 in one year</strong> on costs most workers pay
        themselves or cannot claim. The four biggest:
      </P>

      <ChartFrame
        kicker="£2.80 Million Outside Flats & MP Travel · 1 Year (MPs + MSPs)"
        title="What is left when you count leaflets, PR firms, council tax, family trips, staff hotels, taxis and papers"
        caption="Source: IPSA 2025/26 and Holyrood 2024/25 files. Leaves out staff pay, local offices, second home rent and bills, and MPs' and MSPs' own travel."
      >
        <div className="space-y-5">
          {EXTRAS.map((z) => (
            <div key={z.what}>
              <p className="ui mb-1 text-[16px] font-[640] leading-[1.4] text-[var(--ink)]">{z.what}</p>
              <Bar value={z.amount} max={extrasMax} label={gbp(z.amount, false)} />
              <p className="ui mt-1 text-[15px] leading-[1.45] text-[var(--ink-2)]">{z.detail}</p>
            </div>
          ))}
        </div>

        <div className="ui mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t-2 border-[var(--ink)] pt-3.5">
          <span className="text-[16px] font-[700] text-[var(--ink)]">1 year total across all nine</span>
          <span className="tnum text-[19px] font-[700] text-[var(--bad-text)]">£2,803,948</span>
        </div>
      </ChartFrame>

      <ChartFrame kicker="Also in the £2.80 million" title="Five smaller bills taxpayers picked up">
        <div className="space-y-5">
          {EXTRAS_SMALL.map((z) => (
            <div key={z.what}>
              <p className="ui mb-1 text-[16px] font-[640] leading-[1.4] text-[var(--ink)]">{z.what}</p>
              <Bar value={z.amount} max={extrasMax} label={gbp(z.amount, false)} />
              <p className="ui mt-1 text-[15px] leading-[1.45] text-[var(--ink-2)]">{z.detail}</p>
            </div>
          ))}
        </div>
      </ChartFrame>

      <PointList
        items={[
          {
            key: "glasgow-rejected",
            title: "The £2.80m outside core costs equals every rejected Crisis Grant in Glasgow, with £821,000 left over",
            children: (
              <>
                Glasgow turned down <strong>15,250 claims</strong> in 2025/26. At the £130 average
                across Scotland, those come to <strong>£1.98 million</strong>. The £2.80m would pay them all, with £821,448 left.
              </>
            ),
          },
          {
            key: "nurses-87",
            title: "The £2.80m outside core costs equals 87 new NHS Scotland nurses each year",
            children: (
              <>
                A newly qualified NHS Scotland nurse starts on <strong>£32,073</strong>. Cut just the
                leaflets, PR firms, second home council tax, family flights, taxis and papers
                (£2.21 million), and you can pay <strong>68 full time ward nurses</strong>.
              </>
            ),
          },
          {
            key: "school-meals-1m",
            title: "The £2.80m outside core costs equals 1.08 million hot school lunches each year",
            children: (
              <>
                At £2.60 a meal, it buys <strong>1,078,441 hot school lunches</strong> for older
                kids who miss out on free meals.
              </>
            ),
          },
        ]}
      />

      <Expand summary="How we checked every number">
        <div className="space-y-3 text-[16px] leading-[1.6] text-[var(--ink-2)]">
          <p>
            <strong className="text-[var(--ink)]">MPs.</strong> Every MP figure comes from IPSA
            (the body that pays MPs&apos; expenses) for the 55 Scottish MPs still in Parliament who
            served all of 2025/26. Their total claims were £18.33m. We took out staff pay and their
            local office rent and bills. We kept London homes, hotels and every travel claim (staff
            travel too), plus leaflets, PR, papers, TV licences and dinners. That left £3,744,135.
          </p>
          <p>
            <strong className="text-[var(--ink)]">MSPs.</strong> Every MSP figure comes from
            Holyrood&apos;s 2024/25 files for all 129 MSPs. Their total claims were £27.45m. We took
            out staff pay and £1.68m of local office costs. That left £2,897,181.
          </p>
          <p>
            <strong className="text-[var(--ink)]">Why two different years.</strong> Each is the
            latest full year that parliament has published.
          </p>
          <p>
            <strong className="text-[var(--ink)]">Crisis Grants.</strong> From the Scottish
            Government&apos;s 2025/26 report: 167,990 awards, 89,990 turned down, £130 average.
          </p>
        </div>
      </Expand>

      <PostCTA
        title="Check your own MP and MSPs in our 70,946 receipt finder"
        body="Type your postcode to see every bill your MP and MSPs sent to taxpayers. Or send a ready email asking them to explain."
        href="/mp-expenses-scotland/search"
        cta="Search all MP & MSP receipts"
      />
    </Prose>
  );
}
