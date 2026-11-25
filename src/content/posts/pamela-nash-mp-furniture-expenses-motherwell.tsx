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
            Motherwell MP <Link href={NASH.href}>Pamela Nash</Link> claimed{" "}
            <strong>£3,182</strong> at IKEA and DFS (£2,937 left after a £245 refund).
          </>,
          <>
            Seven bills worth <strong>£7,203</strong> went in during the <strong>last seven days</strong>{" "}
            of the budget year: a carpet, building work, DFS, two IKEA bills and two Amazon orders.
          </>,
          <>
            MP shop bills jumped <strong>seven times</strong> in that last week of March. Only one
            UK MP spent more than her.
          </>,
          <>
            Out of all 650 MPs in five years, she is the <strong>only one</strong> to claim DFS.
          </>,
        ]}
      />

      <Spotlight
        person={NASH}
        kicker="2025/26 budget year · Office furniture"
        amount="£3,182"
        headline="IKEA and DFS, mostly in the last two days of the year."
        lines={[
          { meta: "5 April 2025", what: "IKEA LTD SHOP ONLINE", amount: "£1,334.00" },
          { meta: "30 March 2026", what: "IKEA LTD SHOP ONLINE [200013613-12910]", amount: "£395.00" },
          { meta: "31 March 2026", what: "DFS TRADING LIMITED [200013613-5048]", amount: "£1,208.00" },
          { meta: "31 March 2026", what: "IKEA LTD SHOP ONLINE [200013613-2955]", amount: "£245.00" },
        ]}
      >
        <p>Three of the four bills hit on 30 and 31 March. IKEA paid back £245 in April.</p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-receipts">
        Seven bills in the last seven days of the year
      </Finding>
      <P>
        An MP&apos;s office pot resets on 1 April, and spare cash does not normally carry over.
        Hers had £6,000 of start up money rolled in from her first year.
      </P>
      <P>
        In the last seven days of March 2026, Labour MP <Link href={NASH.href}>Pamela Nash</Link>{" "}
        put seven shop and building bills through IPSA. They came to <strong>£7,202.80</strong>: a
        £2,750 carpet, £2,250 of building work, £1,208 at DFS, two IKEA bills (£395 and £245) and
        two Amazon orders (£230.71 and £124.09).
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
        footer="Wording as printed by IPSA. All paid from her 2025/26 office budget. The £245 IKEA bill was refunded on 17 April 2026. A £126.12 banner dated 27 March 2026 is not counted here."
      />

      <Tiles
        items={[
          { value: "£2,750", label: "a new office carpet, 26 March 2026" },
          { value: "£1,208", label: "the only DFS bill of all 650 MPs in five years", hot: true },
        ]}
      />

      <P>
        Another <strong>£350</strong> for the same work went in during April, taking it to £2,600.
        Back in April 2025 she had already spent £2,742 at IKEA, Argos and Amazon to kit out the
        room.
      </P>
      <P>
        The file never says what she bought at DFS for £1,208.
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
        The mad March rush across Westminster
      </Finding>
      <P>
        This is not just Motherwell. Look at all 650 UK MPs&apos; office kit and repair bills week
        by week and a huge spike jumps off the page.
      </P>
      <P>
        In a normal week, all 650 MPs spend about <strong>£18,900</strong>. In the last seven days
        of March, that shot up to <strong>£138,464</strong>, over seven times higher. One pound in
        every eight spent all year went out in one week.
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
        <strong>135 MPs</strong> went to the shops in that last week. Pamela Nash&apos;s £7,203 was
        second top in the whole UK.
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
        Over the whole year, her £10,295 kit and repair spend was second in Scotland behind{" "}
        <Link href={mp("angus-and-perthshire-glens")}>Dave Doogan</Link>.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="the-rest">
        The rest of her £84,680 bill (and £1,544 Tattoo tickets)
      </Finding>
      <P>
        Not counting staff wages, she claimed <strong>£84,680</strong> in 2025/26 (£241,357 with
        staff):
      </P>

      <PointList
        items={[
          {
            key: "flat",
            title: "£28,547 rent on a London flat (2025/26)",
            children: <>Plus £1,791 in council tax.</>,
          },
          {
            key: "flights",
            title: "£22,864 on flights (2025/26)",
            children: <>Her own trips between Scotland and London.</>,
          },
        ]}
      />

      <P>A few more bills sit in her 2026/27 budget instead:</P>

      <PointList
        items={[
          {
            key: "power",
            title: "£1,154 power bill for the London flat (January 2026)",
            children: <>Dated January 2026, but billed to the next year&apos;s budget.</>,
          },
          {
            key: "postage",
            title: "£1,440 for one month of post",
            children: <>A single bill for &ldquo;Postage (March 2026)&rdquo;.</>,
          },
          {
            key: "tv",
            title: "£174.50 for a TV licence (May 2026)",
            children: (
              <>
                One of{" "}
                <Link href="/blog/scottish-mps-tv-licence-expenses">29 Scottish MPs</Link> billing
                taxpayers for a local office licence.
              </>
            ),
          },
        ]}
      />

      <P>
        From September 2025 to June 2026 she was a PPS (an unpaid aide to a minister). In August
        2026, the Royal Navy gave her £1,544 of free Tattoo seats and drinks on the Royal Yacht
        Britannia.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        Four questions left by the March dash
      </Finding>
      <P>
        An MP needs desks and chairs to work. IPSA lets MPs buy them, and she still finished
        £15,445 under her £41,930 office cap.
      </P>
      <P>
        Still, sending seven big bills in during the last week of March leaves four clear
        questions:
      </P>

      <PointList
        items={[
          {
            key: "dfs",
            title: "What did DFS sell her for £1,208?",
            children: <>Only the shop name shows up. No item, no room, no note.</>,
          },
          {
            key: "carpet",
            title: "Why buy a new carpet five days before the year closed?",
            children: <>The £2,750 bill went in on 26 March 2026.</>,
          },
          {
            key: "works",
            title: "What was the £2,600 building work?",
            children: <>Two bills, with no word on what work was done.</>,
          },
          {
            key: "more",
            title: "Why buy more furniture a year after kitting the room out?",
            children: <>You had already paid £2,742 for office kit in April 2025.</>,
          },
        ]}
      />

      <Aside title="See how other Scottish MPs spend your cash">
        <p>
          Compare Motherwell with Kilmarnock, where{" "}
          <Link href={mp("kilmarnock-and-loudoun")}>Lillian Jones</Link> ran up{" "}
          <Link href="/blog/kilmarnock-mp-23437-electricity-bill">a £23,437 power bill in one day</Link>.
          See <Link href="/blog/worst-scottish-mp-expenses">standout Scottish MP expense claims</Link> or{" "}
          <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See every bill Pamela Nash has claimed"
        body="Open our live search tool on Pamela Nash. Copy any bill for X or WhatsApp, or email her direct."
        href="/mp-expenses-scotland/search?mp=motherwell-wishaw-and-carluke"
        cta="See her bills"
      />
    </Prose>
  );
}
