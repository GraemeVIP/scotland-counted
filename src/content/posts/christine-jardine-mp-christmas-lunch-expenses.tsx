import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published individual business costs CSV files for
 * 2022/23 to 2026/27 (checked 22 November 2026 across all 650 UK seats, over
 * 350,000 claim lines). Quoted descriptions are IPSA's exact wording.
 * "91 repayments out of 20,879 claims" counts every Scottish MP claim line in
 * public/data/scottish-mp-receipts.json with an amount repaid above zero.
 * Gifts: Register of Members' Financial Interests (Nov 2025 and Apr 2026 entries).
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

const JARDINE = {
  name: "Christine Jardine",
  href: mp("edinburgh-west"),
  p: "Lib Dem" as PartyKey,
  place: "Edinburgh West",
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

/** Her December hospitality bills, year by year. */
const DECEMBERS: { what: string; value: number; label: string; hot?: boolean }[] = [
  { what: "8 December 2023 · two bills, payee names blanked by IPSA", value: 190.3, label: "£190" },
  { what: "13 December 2024 · one bill to “DINE”", value: 227, label: "£227" },
  {
    what: "19 December 2025 · Christmas lunch plus team building event",
    value: 510.11,
    label: "£510",
    hot: true,
  },
];

/** Staff Christmas meals in IPSA's files for all 650 seats, 2022 to 2027. */
const UK_FESTIVE: {
  name: string;
  seat: string;
  href?: string;
  p?: PartyKey;
  date: string;
  detail: string;
  value: number;
}[] = [
  {
    name: "Christine Jardine",
    seat: "Edinburgh West",
    href: mp("edinburgh-west"),
    p: "Lib Dem",
    date: "19 Dec 2025",
    detail: "“lunch staff team training Christmas” £250.80, plus “team building event” £259.31 the same day",
    value: 510.11,
  },
  {
    name: "Craig Whittaker",
    seat: "Calder Valley",
    date: "16 Feb 2024",
    detail: "“Full Team belated Festive meal. Friday 16th Feb.”",
    value: 300,
  },
  { name: "Craig Whittaker", seat: "Calder Valley", date: "23 Jan 2023", detail: "“Festive Meal for staff”", value: 210 },
  {
    name: "Ruth Cadbury",
    seat: "Brentford and Isleworth",
    date: "12 Dec 2024",
    detail: "“Thank you Xmas meal for staff team”",
    value: 188.41,
  },
  {
    name: "Sarah Gibson",
    seat: "Chippenham",
    date: "4 Dec 2024",
    detail: "“Team Christmas dinner”, with alcohol and service charge taken off",
    value: 154.05,
  },
  {
    name: "Douglas Chapman",
    seat: "Dunfermline and West Fife (former MP)",
    date: "15 Dec 2023",
    detail: "“Christmas Breakfast team meeting & Thank you for 2023”",
    value: 80.6,
  },
  {
    name: "Scott Benton",
    seat: "Blackpool South",
    date: "4 Mar 2024",
    detail: "“Staff festive meal”, moved from December",
    value: 58.06,
  },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function ChristineJardineMpChristmasLunchExpenses() {
  const decMax = Math.max(...DECEMBERS.map((d) => d.value));

  return (
    <Prose>
      <QuickTake
        items={[
          <>
            Six days before Christmas 2025, <strong>taxpayers</strong> paid <strong>£510</strong> for
            Edinburgh West MP <Link href={JARDINE.href}>Christine Jardine</Link>&apos;s office.
          </>,
          <>
            The lunch bill, <strong>&ldquo;lunch staff team training Christmas&rdquo;</strong>, was
            £250.80. A &ldquo;team building event&rdquo; the same day was £259.31.
          </>,
          <>
            In December 2024, IPSA <strong>turned down</strong> another MP&apos;s &ldquo;Festive team
            meal&rdquo; as &ldquo;Not claimable&rdquo;. In December 2025, hers was{" "}
            <strong>paid in full</strong>.
          </>,
          <>
            She has also billed you for a <strong>TV licence five years running</strong>: £842.
          </>,
          <>
            All <strong>605</strong> of her claim lines since 2022 were paid. <strong>£0</strong>{" "}
            refused. £0 paid back.
          </>,
        ]}
      />

      <Spotlight
        person={JARDINE}
        kicker="19 December 2025 · six days before Christmas"
        amount="£510"
        headline="You paid for her office Christmas lunch and team event."
        lines={[
          { meta: "Office Costs · Hospitality", what: "lunch staff team training Christmas", amount: "£250.80" },
          { meta: "Office Costs · Hospitality", what: "team building event", amount: "£259.31" },
        ]}
      >
        <p>
          A Christmas lunch, with the word &ldquo;training&rdquo; in it. Most people pay for their own
          work Christmas do, or their boss does. Here, you did.
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="christmas-lunch">
        A Christmas lunch, billed as training
      </Finding>
      <P>
        <Link href={JARDINE.href}>Christine Jardine</Link> has been the Lib Dem MP for Edinburgh
        West since 2017. Her office is on St John&apos;s Road in Corstorphine.
      </P>
      <P>
        On <strong>19 December 2025</strong>, IPSA paid two bills for her office. IPSA is the body
        that pays MPs&apos; expenses with public money.
      </P>
      <P>
        The first was £250.80 for &ldquo;lunch staff team training Christmas&rdquo;. The second was
        £259.31 for a &ldquo;team building event&rdquo;. Both were filed as hospitality, which means
        food and drink.
      </P>
      <P>It was not her first December bill, either. It was her third in a row, and the biggest.</P>

      <ChartFrame
        kicker="Christine Jardine · IPSA hospitality bills"
        title="Her December food and drink bills, three years running"
        caption="Source: IPSA claim files 2023/24 to 2025/26. The 2023 payee names are blanked out in IPSA's file."
      >
        <div className="space-y-4">
          {DECEMBERS.map((d) => (
            <div key={d.label}>
              <p
                className={`ui mb-1 text-[14.5px] leading-[1.45] ${d.hot ? "font-[680] text-[var(--ink)]" : "text-[var(--ink-2)]"}`}
              >
                {d.what}
              </p>
              <Bar
                value={d.value}
                max={decMax}
                colour={d.hot ? "var(--bad)" : "var(--rule-strong)"}
                label={d.label}
              />
            </div>
          ))}
        </div>
      </ChartFrame>

      <P>
        Her food and drink bills for 2025/26 came to <strong>£697.75</strong>. That is the most of
        any Scottish MP. Across the UK, only nine MPs billed more.
      </P>

      <Expand summary="See the proof: her December lines, word for word">
        <Receipt
          person={JARDINE}
          heading="IPSA records · Office Costs · Hospitality"
          lines={[
            { meta: "8 Dec 2023", what: "[***] [***]", amount: "£168.30" },
            { meta: "8 Dec 2023", what: "[***] [***]", amount: "£22.00" },
            { meta: "13 Dec 2024", what: "DINE", amount: "£227.00" },
            { meta: "19 Dec 2025", what: "lunch staff team training Christmas", amount: "£250.80" },
            { meta: "19 Dec 2025", what: "team building event", amount: "£259.31" },
          ]}
          total={{ label: "Three Decembers · all paid", amount: "£927.41" }}
          footer="Wording as printed by IPSA. [***] is how IPSA blanks out names. IPSA claim numbers for 19 Dec 2025: 60350715-1 and 60346208-1."
        />
      </Expand>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-christmas">
        One MP was refused. She was paid.
      </Finding>
      <P>
        We checked every claim line from all 650 UK seats, from 2022 to 2027. We looked for staff
        Christmas and festive meals.
      </P>
      <P>
        Only a handful of MPs billed one. Her lunch bill on its own was <strong>£250.80</strong>.
        One other MP&apos;s meal cost more: £300. But add her £259.31 team event on the same day,
        and her <strong>£510</strong> is the biggest staff Christmas spend we found.
      </P>

      <ChartFrame
        kicker="All 650 UK seats · 2022/23 to 2026/27"
        title="Staff Christmas meals that IPSA paid for"
        caption="Source: IPSA claim files, all MPs. Only Scottish MPs still in office are linked."
      >
        <RankList
          max={UK_FESTIVE[0].value}
          rows={UK_FESTIVE.map((r) => ({
            key: `${r.name}-${r.date}`,
            who: r.p ? (
              <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />
            ) : (
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-[620] text-[var(--ink)]">{r.name}</span>
                <span className="ui text-[13.5px] text-[var(--muted)]">{r.seat}</span>
              </span>
            ),
            side: r.date,
            value: r.value,
            label: gbp(r.value, false),
            colour: r.p ? PARTY[r.p].colour : "var(--rule-strong)",
            detail: r.detail,
            highlight: Boolean(r.p),
          }))}
        />
      </ChartFrame>

      <P>
        <strong>December 2024:</strong> IPSA refused the MP for Newbury&apos;s &ldquo;Festive team
        meal&rdquo; (£204.95) as &ldquo;Not claimable&rdquo;. <strong>December 2025:</strong> IPSA
        paid Christine Jardine&apos;s Christmas lunch in full.
      </P>

      <Receipt
        heading="IPSA records · 19 December 2024 · Newbury MP · Hospitality"
        lines={[{ meta: "Claimed £204.95 · Status: Not Paid", what: "Festive team meal", amount: "£0.00" }]}
        total={{ label: "IPSA's reason", amount: "Not claimable" }}
        footer="Wording as printed by IPSA, claim 60275492-1."
      />

      <P>
        We can&apos;t say why one was paid and one was not. IPSA&apos;s files only show the words on
        the bill. That is exactly the problem.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="other-claims">
        Everything else she billed you
      </Finding>
      <P>
        Her full bill for 2025/26 was <strong>£349,032</strong>. Most of that is staff pay. Here is
        the rest that stood out.
      </P>

      <Tiles
        items={[
          { value: "£842", label: "TV licences, five years running", hot: true },
          { value: "£21,735", label: "on her own flights in 2025/26" },
          { value: "£3,358", label: "on newspapers since 2022" },
        ]}
      />

      <Receipt
        person={JARDINE}
        heading="IPSA records · Office Costs · TV licence"
        lines={[
          { meta: "21 April 2022", what: "TVLICENSING.CO.UK", amount: "£159.00" },
          { meta: "17 April 2023", what: "TVLICENSING.CO.UK", amount: "£159.00" },
          { meta: "17 April 2024", what: "TVLICENSING.CO.UK", amount: "£169.50" },
          { meta: "22 April 2025", what: "TVLICENSING.CO.UK", amount: "£174.50" },
          { meta: "1 May 2026", what: "TVLICENSING.CO.UK", amount: "£180.00" },
        ]}
        total={{ label: "Five licences · all paid", amount: "£842.00" }}
        footer="Wording as printed by IPSA. IPSA allows a TV licence for an MP's local office."
      />

      <PointList
        items={[
          {
            key: "flights",
            title: "£21,735 on flights. Other Edinburgh MPs take the train.",
            children: (
              <>
                That was her own flights in 2025/26. In the same year,{" "}
                <Link href={mp("edinburgh-south-west")}>Scott Arthur</Link> billed £680 for flights and
                £9,467 for trains. <Link href={mp("edinburgh-north-and-leith")}>Tracy Gilbert</Link>{" "}
                billed £529 for flights and £11,268 for trains.
              </>
            ),
          },
          {
            key: "taxis",
            title: "£2,411 on taxis (2025/26)",
            children: <>The fourth highest of any Scottish MP that year.</>,
          },
          {
            key: "papers",
            title: "£3,358 on newspapers since 2022",
            children: (
              <>
                That includes a £269 Telegraph subscription every April since 2024, plus The Times,
                The Herald and The Economist.
              </>
            ),
          },
          {
            key: "wall",
            title: "A wall knocked down, then a wall put up",
            children: (
              <>
                March 2025: £760.80 for &ldquo;Internal office wall knocked down&rdquo;. May 2026:
                £1,100 &ldquo;For materials to build an internal wall/glass door&rdquo;. June 2026: £1,250
                for &ldquo;completion of work for which deposit previously paid&rdquo;.
              </>
            ),
          },
          {
            key: "lights",
            title: "£1,590 on the office lights in five weeks",
            children: (
              <>
                Two electrician call outs at £264 each in October 2025. Then £1,062 for new LED
                ceiling panels in November.
              </>
            ),
          },
          {
            key: "rent",
            title: "£22,200 rent for her London home (2025/26)",
            children: <>Plus £763 council tax to Westminster City Council.</>,
          },
        ]}
      />

      <P>
        Away from expenses, her Register of Interests lists rugby hospitality from Scottish Rugby:
        two tickets worth £798 (November 2025) and one worth £500 (April 2026). She declared both,
        as the rules require.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="who-stops-this">
        Why IPSA paid it, and who stops this
      </Finding>
      <P>
        IPSA lets MPs claim some food and drink for office work. Her own files include small bills
        like &ldquo;Coffee for office&rdquo;. IPSA checks claims against its rules before it pays.
      </P>
      <P>
        Not one of her 605 claim lines since 2022 has been refused. Not one has been paid back. On
        paper, the rules let all of it through. That is the scandal.
      </P>

      <section className="not-prose my-10 overflow-hidden rounded-[var(--r-m)] bg-[#10141d] px-6 py-7 text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)] ring-1 ring-[#ff4d4d]/40 sm:px-8 sm:py-8">
        <p className="ui text-[13px] font-[660] uppercase tracking-[0.07em] opacity-75">Who stops this?</p>
        <p className="figure-num mt-2 text-[48px] leading-none text-[#ff5757] sm:text-[56px]">Nobody.</p>
        <ul className="mt-6 space-y-4 text-[17px] leading-[1.55]">
          <li>
            Her Christmas lunch went in as &ldquo;lunch staff team training Christmas&rdquo;.{" "}
            <strong>A Christmas lunch, with the word &ldquo;training&rdquo; in it.</strong> IPSA paid
            it in full.
          </li>
          <li>
            IPSA only exists because of <strong>a law MPs passed themselves</strong> in 2009, after the
            last expenses scandal.
          </li>
          <li>
            IPSA&apos;s own files show just <strong>91 repayments out of 20,879 claims</strong> by
            Scottish MPs since 2022. That is fewer than 1 in 200.
          </li>
          <li className="text-[20px] font-[700] leading-[1.35]">
            The rules let all of this through. Nobody is going to stop the gravy train.
          </li>
        </ul>
      </section>

      <P>
        Three plain questions for <Link href={JARDINE.href}>Christine Jardine</Link> and IPSA have
        no answer in the public files:
      </P>

      <PointList
        items={[
          {
            key: "training",
            title: "What training happened at the Christmas lunch?",
            children: <>The bill says &ldquo;training&rdquo;. It does not say what was taught.</>,
          },
          {
            key: "event",
            title: "What was the £259.31 team building event?",
            children: <>It went in on the same day. The file gives no venue and no detail.</>,
          },
          {
            key: "refused",
            title: "Why was one MP's festive meal refused, but hers paid?",
            children: <>IPSA turned down a £204.95 &ldquo;Festive team meal&rdquo; in December 2024.</>,
          },
        ]}
      />

      <Aside title="Part of a wider pattern in Westminster">
        <p>
          <Link href={JARDINE.href}>Christine Jardine</Link> is not alone. See{" "}
          <Link href="/blog/worst-scottish-mp-expenses">the worst Scottish MP expenses</Link>,{" "}
          <Link href="/blog/scottish-mps-tv-licence-expenses">29 MPs who billed you for a TV licence</Link>{" "}
          and{" "}
          <Link href="/blog/kilmarnock-mp-23437-electricity-bill">a £23,437 power bill paid in one day</Link>
          . Or compare <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See her food and drink bills (or check your own MP)"
        body="Open our live Receipt Finder on Christine Jardine's hospitality claims. Copy any claim for X or WhatsApp, or email her direct."
        href="/mp-expenses-scotland/search?mp=edinburgh-west&q=hospitality"
        cta="See the receipts"
      />

      <P>
        Want the big picture? See <Link href="/mp-expenses-scotland">every Scottish MP&apos;s expenses</Link>.
      </P>
    </Prose>
  );
}
