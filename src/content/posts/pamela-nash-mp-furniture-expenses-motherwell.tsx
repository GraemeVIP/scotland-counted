import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published claim files for 2022/23 to 2026/27 (checked
 * 22 November 2026 across all 650 UK MPs, over 350,000 rows) and IPSA's
 * 2025/26 total spend file (office budget and spend). Quoted descriptions are
 * IPSA's exact wording.
 * End of year figures: every 2025/26 "Equipment - purchase" and "Maintenance,
 * Redecorations & Repairs" line for all MPs, by the date on the claim, leaving
 * out IPSA's lumped yearly totals (all dated 31 March). PPS post and days
 * spoken: UK Parliament Members API and Hansard (mpLondonRecord.json). Gift:
 * Register of Members' Financial Interests (mpInterests.json).
 */

import {
  type PartyKey,
  PARTY,
  gbp,
  Who,
  QuickTake,
  Finding as KitFinding,
  ChartFrame,
  Bar,
  RankList,
  Receipt,
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const NASH = {
  name: "Pamela Nash",
  href: mp("motherwell-wishaw-and-carluke"),
  p: "Labour" as PartyKey,
  place: "Motherwell, Wishaw and Carluke",
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

/**
 * Office kit, furniture and repair bills for all MPs, 2025/26 budget year,
 * by the week on the claim. "A normal week" is the average of the other 51
 * full weeks of the year.
 */
const WEEKS: { what: string; value: number; label: string; hot?: boolean }[] = [
  { what: "A normal week in 2025/26 (average)", value: 18944.11, label: "£18,944" },
  { what: "4 to 10 March 2026", value: 38333, label: "£38,333" },
  { what: "11 to 17 March 2026", value: 41843, label: "£41,843" },
  { what: "18 to 24 March 2026", value: 52717, label: "£52,717" },
  { what: "25 to 31 March 2026: the last 7 days", value: 138464.37, label: "£138,464", hot: true },
];

/** Biggest office kit, furniture and repair bills in the last 7 days of 2025/26. */
const LAST_WEEK_TOP: {
  name: string;
  p: PartyKey;
  seat: string;
  href?: string;
  detail: ReactNode;
  value: number;
}[] = [
  {
    name: "Ben Obese-Jecty",
    p: "Conservative",
    seat: "Huntingdon",
    detail: "IKEA, Dunelm, Debenhams, AO.com, paint, and two £3,000 bills from Superior Finish Ltd",
    value: 15868.37,
  },
  {
    name: "Pamela Nash",
    p: "Labour",
    seat: "Motherwell, Wishaw & Carluke",
    href: mp("motherwell-wishaw-and-carluke"),
    detail: "New carpet, building works, DFS, IKEA and Amazon",
    value: 7202.8,
  },
  {
    name: "Alex Brewer",
    p: "Lib Dem",
    seat: "North East Hampshire",
    detail: "One bill for “Office works”",
    value: 6000,
  },
  {
    name: "Adam Dance",
    p: "Lib Dem",
    seat: "Yeovil",
    detail: "Office maintenance, camera kit and John Lewis",
    value: 4819.6,
  },
  {
    name: "Kanishka Narayan",
    p: "Labour",
    seat: "Vale of Glamorgan",
    detail: "One bill for “Office Equipment”",
    value: 4800,
  },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function PamelaNashMpFurnitureExpensesMotherwell() {
  const weekMax = Math.max(...WEEKS.map((w) => w.value));

  return (
    <Prose>
      <QuickTake
        items={[
          <>
            <strong>Taxpayers</strong> paid <strong>£3,182</strong> for IKEA and DFS furniture for
            Motherwell MP <Link href={NASH.href}>Pamela Nash</Link>. After a £245 refund, the public is
            still out <strong>£2,937</strong>.
          </>,
          <>
            Three of those four bills landed in the <strong>last two days</strong> of the budget year:
            30 and 31 March 2026.
          </>,
          <>
            That same week you also paid for a <strong>new office carpet</strong> and{" "}
            <strong>building works</strong>.
          </>,
          <>
            Only <strong>one MP in the whole UK</strong> billed more for office kit and repairs that
            week.
          </>,
          <>
            She is the <strong>only MP out of 650</strong> to put a DFS bill on expenses in five years.
          </>,
        ]}
      />

      <Spotlight
        person={NASH}
        kicker="2025/26 budget year · Office furniture"
        amount="£3,182"
        headline="You paid for her IKEA and DFS shopping."
        lines={[
          { meta: "5 April 2025", what: "IKEA LTD SHOP ONLINE", amount: "£1,334.00" },
          { meta: "30 March 2026", what: "IKEA LTD SHOP ONLINE [200013613-12910]", amount: "£395.00" },
          { meta: "31 March 2026", what: "DFS TRADING LIMITED [200013613-5048]", amount: "£1,208.00" },
          { meta: "31 March 2026", what: "IKEA LTD SHOP ONLINE [200013613-2955]", amount: "£245.00" },
        ]}
      >
        <p>IKEA refunded the £245 bill on 17 April 2026.</p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-receipts">
        Seven bills in the last seven days
      </Finding>
      <P>
        <Link href={NASH.href}>Pamela Nash</Link> won Motherwell, Wishaw and Carluke for Labour in
        July 2024.
      </P>
      <P>
        IPSA runs on a budget year. It starts on 1 April and ends on 31 March. Each MP gets a pot of
        money for their office each year. On 1 April, a new pot starts.
      </P>
      <P>
        Then came the last week of March 2026. In seven days, seven bills went in: carpet, building
        works, DFS, IKEA and Amazon.
      </P>

      <Receipt
        person={NASH}
        heading="IPSA records · 25 to 31 March 2026 · The last 7 days of the budget year"
        lines={[
          {
            meta: "26 March 2026 · Repairs",
            what: "Replacement of office carpet [200013634-169]",
            amount: "£2,750.00",
          },
          { meta: "26 March 2026 · Office kit", what: "AMAZON [***] [200013613-8864]", amount: "£230.71" },
          { meta: "28 March 2026 · Office kit", what: "AMAZON [***] [200013613-12850]", amount: "£124.09" },
          {
            meta: "30 March 2026 · Office furniture",
            what: "IKEA LTD SHOP ONLINE [200013613-12910]",
            amount: "£395.00",
          },
          {
            meta: "30 March 2026 · Repairs",
            what: "Essential refurbishment works to Constituency Office [200013634-170]",
            amount: "£2,250.00",
          },
          {
            meta: "31 March 2026 · Office furniture",
            what: "IKEA LTD SHOP ONLINE [200013613-2955]",
            amount: "£245.00",
          },
          {
            meta: "31 March 2026 · Office furniture",
            what: "DFS TRADING LIMITED [200013613-5048]",
            amount: "£1,208.00",
          },
        ]}
        total={{ label: "Total for the last 7 days of the year", amount: "£7,202.80" }}
        footer="Wording as printed by IPSA. All paid from her 2025/26 office budget. The £245 IKEA bill was refunded on 17 April 2026."
      />

      <Tiles
        items={[
          { value: "£2,750", label: "a new office carpet, 26 March 2026" },
          { value: "£1,208", label: "the only DFS bill of any UK MP in five years", hot: true },
        ]}
      />

      <P>
        The building works did not stop in March. Another <strong>£350</strong> for the same
        &quot;Essential refurbishment works&quot; went in on 24 April 2026. Building works total:
        £2,600.
      </P>
      <P>
        IPSA&apos;s line for DFS just says &quot;DFS TRADING LIMITED&quot;. DFS is best known for
        sofas. The file does not say what she bought.
      </P>
      <P>
        This was not her first furniture spree. In the first nine days of the same budget year, April
        2025, she billed £2,742 for furniture from IKEA, Argos, Amazon and others.
      </P>

      <Expand summary="See the proof: every furniture line, word for word">
        <Receipt
          person={NASH}
          heading="IPSA records · Office furniture · 1 to 9 April 2025"
          lines={[
            { meta: "5 April 2025", what: "IKEA LTD SHOP ONLINE", amount: "£1,334.00" },
            { meta: "5 April 2025", what: "ARGOS", amount: "£274.00" },
            { meta: "5 April 2025", what: "WF [***]", amount: "£154.98" },
            { meta: "5 April 2025", what: "SP URBAN LOCKERS LTD", amount: "£149.00" },
            { meta: "8 April 2025", what: "AMZNMKTPLACE [***]", amount: "£717.90" },
            { meta: "9 April 2025", what: "AMAZON [***]", amount: "£111.99" },
          ]}
          total={{ label: "First nine days of the year", amount: "£2,741.87" }}
          footer="Wording as printed by IPSA, 2025/26 file. IPSA hides some shop details with [***]."
        />
        <Receipt
          heading="IPSA records · Office furniture and works billed to her 2026/27 budget"
          lines={[
            { meta: "21 February 2026", what: "Constituency Office - Office Chair", amount: "£99.99" },
            { meta: "24 March 2026", what: "AMAZON [***]", amount: "£683.03" },
            { meta: "17 April 2026 · Refund", what: "IKEA LTD SHOP ONLINE", amount: "-£245.00" },
          ]}
          footer="Wording as printed by IPSA, 2026/27 file. The £350 for more refurbishment works (24 April 2026, code 200013634-171) sits in the 2025/26 file."
        />
        <p className="text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
          Her 2025/26 office furniture came to £4,589.87, the second most of Scotland&apos;s 57 MPs.
          Only <Link href={mp("edinburgh-north-and-leith")}>Tracy Gilbert</Link> billed more
          (£5,854.90).
        </p>
      </Expand>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="end-of-year-rush">
        The last week of March, when MPs go shopping
      </Finding>
      <P>
        We checked every 2025/26 bill for office kit, furniture and repairs, for all 650 MPs. Then we
        added them up week by week.
      </P>
      <P>
        A normal week came to about <strong>£18,900</strong>. The last seven days of March came to{" "}
        <strong>£138,464</strong>. That is over <strong>seven times</strong> a normal week.
      </P>
      <P>
        The whole year&apos;s kit and repair bills came to £1,114,356. So about one pound in every
        eight landed in those last seven days.
      </P>

      <ChartFrame
        kicker="All 650 UK MPs · 2025/26 budget year"
        title="Office kit, furniture and repair bills, week by week"
        caption="Source: IPSA 2025/26 claim files for all 650 MPs. Counts 'Equipment - purchase' and 'Maintenance, Redecorations & Repairs' by the date on each bill. Leaves out IPSA's lumped yearly totals."
      >
        <div className="space-y-4">
          {WEEKS.map((w) => (
            <div key={w.label}>
              <p
                className={`ui mb-1 text-[14.5px] leading-[1.45] ${w.hot ? "font-[680] text-[var(--ink)]" : "text-[var(--ink-2)]"}`}
              >
                {w.what}
              </p>
              <Bar
                value={w.value}
                max={weekMax}
                colour={w.hot ? "var(--bad)" : "var(--rule-strong)"}
                label={w.label}
              />
            </div>
          ))}
        </div>
      </ChartFrame>

      <P>
        <strong>135 MPs</strong> billed for kit or repairs in that final week. Pamela Nash&apos;s
        £7,203 was the <strong>second biggest in the UK</strong>.
      </P>

      <ChartFrame
        kicker="All 650 UK MPs · 25 to 31 March 2026"
        title="Biggest office kit, furniture and repair bills in the last 7 days of the year"
        caption="Source: IPSA 2025/26 claim files. Each MP's total for the week."
      >
        <RankList
          max={LAST_WEEK_TOP[0].value}
          rows={LAST_WEEK_TOP.map((r) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            detail: r.detail,
            highlight: r.name === "Pamela Nash",
          }))}
        />
      </ChartFrame>

      <P>
        Her total for office kit, furniture and repairs over the whole 2025/26 year was £10,295. Of
        Scotland&apos;s 57 MPs, only <Link href={mp("angus-and-perthshire-glens")}>Dave Doogan</Link>{" "}
        billed more.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="the-rest">
        Everything else she billed you for
      </Finding>
      <P>
        The furniture is not the only thing on her file. In 2025/26 she billed{" "}
        <strong>£84,680</strong>, not counting her staff&apos;s wages. With staff, it was £241,357.
      </P>

      <PointList
        items={[
          {
            key: "flat",
            title: "£28,547 rent on a London flat (2025/26)",
            children: (
              <>
                This is her second home, in London. You also paid £1,791 of council tax on it,
                and a £1,154 power bill in January 2026.
              </>
            ),
          },
          {
            key: "flights",
            title: "£22,864 on flights (2025/26)",
            children: <>Her own trips between Scotland and London.</>,
          },
          {
            key: "postage",
            title: "£1,440 for one month of post",
            children: <>A single bill for &quot;Postage (March 2026)&quot;.</>,
          },
          {
            key: "tv",
            title: "£174.50 for a TV licence",
            children: (
              <>
                For her constituency office, May 2026. She is one of{" "}
                <Link href="/blog/scottish-mps-tv-licence-expenses">29 Scottish MPs</Link> to bill
                you for one.
              </>
            ),
          },
        ]}
      />

      <P>
        From September 2025 to June 2026, she was a PPS: an unpaid helper to a defence minister.
      </P>
      <P>
        In August 2026 the Royal Navy gave her £1,544 of free Tattoo tickets and hospitality. She
        declared it.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        Why IPSA said yes
      </Finding>
      <P>
        An MP needs a working office. So desks, chairs, carpets and repairs can all go on expenses.
        IPSA paid every one of these bills in full. The rules allowed it. That is the scandal.
      </P>
      <P>
        To be fair, she did not use up her office pot. IPSA gave her £41,930 for 2025/26. That
        included £6,000 of start up money carried over from her first year. She spent £26,485. That
        left an underspend of <strong>£15,445</strong>.
      </P>
      <P>
        So why did so much land in the last week of March? The public files do not say. Four plain
        questions have no answer:
      </P>

      <PointList
        items={[
          {
            key: "dfs",
            title: "What did DFS sell her for £1,208?",
            children: <>IPSA&apos;s line gives the firm&apos;s name and nothing else.</>,
          },
          {
            key: "carpet",
            title: "Why replace the carpet in the last week of the budget year?",
            children: <>The £2,750 bill went in on 26 March 2026, five days before the year ended.</>,
          },
          {
            key: "works",
            title: "What were the “essential” works?",
            children: <>£2,600 over two bills, with no detail on what was done.</>,
          },
          {
            key: "more",
            title: "Why more furniture, a year after kitting out the office?",
            children: <>She had already billed £2,742 for furniture in April 2025.</>,
          },
        ]}
      />

      <Aside title="Part of a wider pattern in Westminster">
        <p>
          <Link href={NASH.href}>Pamela Nash</Link> is not alone. Kilmarnock MP{" "}
          <Link href={mp("kilmarnock-and-loudoun")}>Lillian Jones</Link> billed you{" "}
          <Link href="/blog/kilmarnock-mp-23437-electricity-bill">£23,437 for power in one day</Link>
          . See <Link href="/blog/worst-scottish-mp-expenses">the worst Scottish MP expenses</Link>,
          or compare <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See every bill Pamela Nash has claimed"
        body="Open our live Receipt Finder on Pamela Nash. Copy any claim for X or WhatsApp, or email her direct."
        href="/mp-expenses-scotland/search?mp=motherwell-wishaw-and-carluke"
        cta="See her receipts"
      />
    </Prose>
  );
}
