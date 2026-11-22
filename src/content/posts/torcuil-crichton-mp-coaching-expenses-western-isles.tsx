import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published individual business costs CSV files for
 * 2022/23 to 2026/27 (checked 22 November 2026 across all 650 UK seats, over
 * 350,000 claim lines). Quoted descriptions are IPSA's exact wording.
 * The coach's career and prices come only from her own business website
 * (laralloydcoaching.co.uk). Company details: Companies House, Lara Lloyd
 * Coaching Ltd, company number 16329224, incorporated 19 March 2025.
 * Nothing personal about the coach is published here: she is a private person.
 * Gift: Register of Members' Financial Interests (13 May 2026 entry).
 */

import {
  type PartyKey,
  PARTY,
  Who,
  QuickTake,
  Finding as KitFinding,
  ChartFrame,
  RankList,
  Receipt,
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const CRICHTON = {
  name: "Torcuil Crichton",
  href: mp("na-h-eileanan-an-iar"),
  p: "Labour" as PartyKey,
  place: "Na h-Eileanan an Iar",
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

/** All 16 of his bills to the coaching firm, as printed by IPSA. */
const HIS_BILLS: { meta: string; what: string; amount: string }[] = [
  { meta: "21 Oct 2025 · Staffing · Training - staff", what: "LARA LLOYD COACHING", amount: "£125.00" },
  { meta: "21 Oct 2025 · Staffing · Training - staff", what: "LARA LLOYD COACHING", amount: "£125.00" },
  { meta: "21 Oct 2025 · Staffing · Training - staff", what: "LARA LLOYD COACHING", amount: "£125.00" },
  { meta: "21 Oct 2025 · Staffing · Training - staff", what: "LARA LLOYD COACHING", amount: "£125.00" },
  { meta: "21 Oct 2025 · Staffing · Training - staff", what: "LARA LLOYD COACHING", amount: "£125.00" },
  { meta: "21 Oct 2025 · Staffing · Training - staff", what: "LARA LLOYD COACHING", amount: "£125.00" },
  { meta: "28 Oct 2025 · Office Costs · Training - MP", what: "LARA LLOYD COACHING", amount: "£175.00" },
  { meta: "12 Nov 2025 · Office Costs · Training - MP", what: "LARA LLOYD COACHING", amount: "£175.00" },
  { meta: "15 Dec 2025 · Office Costs · Training - MP", what: "LARA LLOYD COACHING", amount: "£175.00" },
  { meta: "5 Jan 2026 · Office Costs · Training - MP", what: "LARA LLOYD COACHING", amount: "£175.00" },
  { meta: "2 Feb 2026 · Staffing · Training - staff", what: "LARA LLOYD COACHING", amount: "£175.00" },
  { meta: "2 Mar 2026 · Staffing · Training - staff", what: "LARA LLOYD COACHING [200013613-3415]", amount: "£150.00" },
  { meta: "13 Mar 2026 · Staffing · Training - staff", what: "LARA LLOYD COACHING [200013613-11998]", amount: "£150.00" },
  { meta: "8 Apr 2026 · Staffing · Training - staff", what: "LARA LLOYD COACHING", amount: "£150.00" },
  { meta: "7 May 2026 · Staffing · Training - staff", what: "LARA LLOYD COACHING", amount: "£150.00" },
  { meta: "16 Jun 2026 · Staffing · Training - MP", what: "Lara Lloyd Coaching", amount: "£175.00" },
];

/** Every MP whose IPSA claims name the coaching firm (Sept 2025 to June 2026). */
const UK_CLIENTS: { name: string; seat: string; href?: string; p?: PartyKey; bills: number; value: number; note?: string }[] = [
  { name: "Andrew Cooper", seat: "Mid Cheshire", bills: 1, value: 3100 },
  { name: "Anneliese Midgley", seat: "Knowsley", bills: 2, value: 2700, note: "Filed as “Professional & consultancy”" },
  {
    name: "Torcuil Crichton",
    seat: "Na h-Eileanan an Iar",
    href: mp("na-h-eileanan-an-iar"),
    p: "Labour",
    bills: 16,
    value: 2400,
    note: "The only Scottish MP. The most bills of anyone.",
  },
  { name: "Pam Cox", seat: "Colchester", bills: 2, value: 1950 },
  { name: "Luke Evans", seat: "Hinckley and Bosworth", bills: 1, value: 1150 },
  { name: "Diana Johnson", seat: "Kingston upon Hull North and Cottingham", bills: 6, value: 1050, note: "“session 1 of 6” to “session 6 of 6”" },
  { name: "Saqib Bhatti", seat: "Meriden and Solihull East", bills: 1, value: 1050 },
  { name: "Peter Swallow", seat: "Bracknell", bills: 1, value: 950 },
  { name: "Ed Miliband", seat: "Doncaster North", bills: 5, value: 875, note: "Named Edward Miliband in IPSA's files" },
  { name: "Ashley Dalton", seat: "West Lancashire", bills: 4, value: 700 },
  { name: "Paul Foster", seat: "South Ribble", bills: 3, value: 525 },
  { name: "Helen Maguire", seat: "Epsom and Ewell", bills: 2, value: 350 },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function TorcuilCrichtonMpCoachingExpensesWesternIsles() {
  return (
    <Prose>
      <QuickTake
        items={[
          <>
            <strong>Taxpayers</strong> paid <strong>£2,400</strong> for coaching for Western Isles MP{" "}
            <Link href={CRICHTON.href}>Torcuil Crichton</Link> and his staff. It went in{" "}
            <strong>16 bills</strong>.
          </>,
          <>
            The coach used to work at <strong>IPSA</strong>, the body that pays MPs&apos; expenses. Now
            MPs pay her firm with IPSA&apos;s money.
          </>,
          <>
            <strong>12 MPs</strong> across the UK paid her firm <strong>£16,800</strong> in under a
            year. He is the <strong>only Scottish MP</strong> on the list.
          </>,
          <>
            He sent in <strong>more bills than any of them</strong>: 16 out of 44.
          </>,
          <>
            IPSA paid every penny. <strong>£0</strong> of the £16,800 has been refused or paid back.
          </>,
        ]}
      />

      <Spotlight
        person={CRICHTON}
        kicker="21 October 2025 to 16 June 2026 · 16 bills"
        amount="£2,400"
        headline="You paid for coaching for the Western Isles MP and his staff."
        lines={[
          { meta: "21 Oct 2025 · six bills on one day · staff training", what: "LARA LLOYD COACHING", amount: "6 × £125" },
          { meta: "Oct 2025 to June 2026 · training for the MP himself", what: "LARA LLOYD COACHING", amount: "5 × £175" },
          { meta: "Feb to May 2026 · staff training", what: "LARA LLOYD COACHING", amount: "£175 + 4 × £150" },
        ]}
      >
        <p>
          Five bills were for coaching the MP himself: <strong>£875</strong>. The other 11 were for
          his staff: <strong>£1,525</strong>.
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-receipts">
        What the 16 bills show
      </Finding>
      <P>
        <Link href={CRICHTON.href}>Torcuil Crichton</Link> won Na h-Eileanan an Iar, the Western
        Isles, for Labour in July 2024.
      </P>
      <P>
        On <strong>21 October 2025</strong>, six bills to the coaching firm went in on one day. Each
        was £125, filed as staff training.
      </P>
      <P>
        A week later came the first bill for coaching him. It was £175. Four more followed, each
        exactly £175.
      </P>
      <P>
        That price is no accident. The coach&apos;s own website charges <strong>£1,050 for six one
        hour sessions</strong>, mostly online. That works out at £175 a session.
      </P>

      <Tiles
        items={[
          { value: "£2,400", label: "to the coaching firm, in 16 bills", hot: true },
          { value: "£875", label: "of it for coaching the MP himself" },
          { value: "£4,200", label: "on all training since he was elected" },
        ]}
      />

      <P>
        The coaching was not his first training bill. He also billed <strong>£1,500</strong> to HIVE
        SUPPORT LTD (four bills of £375, Sept 2024 to Jan 2025). Then <strong>£300</strong> to
        ELECTED TECHNOLOGIES (Aug 2025). All of it was filed as staff training.
      </P>

      <Expand summary="See the proof: all 16 IPSA lines, word for word">
        <Receipt
          person={CRICHTON}
          heading="IPSA records · 2025/26 and 2026/27 · Coaching firm"
          lines={HIS_BILLS}
          total={{ label: "16 bills · all paid · £0 repaid", amount: "£2,400.00" }}
          footer="Wording as printed by IPSA. The numbers in square brackets are IPSA's own reference codes."
        />
      </Expand>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-list">
        12 MPs, £16,800, and he is the only Scot
      </Finding>
      <P>
        We checked every claim line from all 650 UK seats, from 2022 to 2027. We searched for the
        coaching firm&apos;s name.
      </P>
      <P>
        <strong>12 MPs</strong> billed it, in <strong>44 claims</strong>, from September 2025 to
        June 2026. That came to <strong>£16,800</strong>. IPSA paid all of it.
      </P>

      <ChartFrame
        kicker="All 650 UK seats · Sept 2025 to June 2026"
        title="Every MP who billed taxpayers for the coaching firm"
        caption="Source: IPSA claim files 2025/26 and 2026/27. Amounts are what IPSA paid. Only Scottish MPs are linked."
      >
        <RankList
          max={UK_CLIENTS[0].value}
          rows={UK_CLIENTS.map((r) => ({
            key: r.name,
            who: r.p ? (
              <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />
            ) : (
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-[620] text-[var(--ink)]">{r.name}</span>
                <span className="ui text-[13.5px] text-[var(--muted)]">{r.seat}</span>
              </span>
            ),
            side: `${r.bills} ${r.bills === 1 ? "bill" : "bills"}`,
            value: r.value,
            label: `£${r.value.toLocaleString("en-GB")}`,
            colour: r.p ? PARTY[r.p].colour : "var(--rule-strong)",
            detail: r.note,
            highlight: Boolean(r.p),
          }))}
        />
      </ChartFrame>

      <P>
        Look at how differently it was filed. One MP put it down as &ldquo;Professional &amp;
        consultancy&rdquo;. Another listed &ldquo;session 1 of 6&rdquo; through to &ldquo;session 6 of
        6&rdquo;, at £175 each. That is the website&apos;s £1,050 package, paid for by you.
      </P>
      <P>
        Back in Scotland, only two of our 57 MPs billed for &ldquo;Training - MP&rdquo; in 2025/26.
        He was top, with <strong>£700</strong> that year.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="other-claims">
        Everything else he billed you
      </Finding>
      <P>
        His full bill for 2025/26 was <strong>£313,106</strong>. Most of that is staff pay
        (£209,561). Here is the rest that stood out.
      </P>

      <PointList
        items={[
          {
            key: "flights",
            title: "£23,608 on his own flights (2025/26)",
            children: (
              <>
                To be fair, he represents islands. Flying is part of the job. His staff flew too:
                £8,424, plus £3,691 on London hotels.
              </>
            ),
          },
          {
            key: "rent",
            title: "£21,600 rent for his London home (2025/26)",
            children: <>That is £1,800 a month, plus £1,089 council tax.</>,
          },
          {
            key: "adverts",
            title: "£4,813 on adverts in one year (2025/26)",
            children: (
              <>
                That was 16 bills, including a £250 &ldquo;Advertising board in constituency&rdquo;.
                Since July 2025, four bills to &ldquo;SQ SPORSNIS&rdquo; have come to £1,825.
              </>
            ),
          },
          {
            key: "furniture",
            title: "£4,372 on office furniture",
            children: (
              <>
                £2,689.51 for &ldquo;Purchase of office furniture&rdquo; (Jan 2025). Then £1,682.63
                more to MACKENZIE HOLDINGS LTD (Sept 2025).
              </>
            ),
          },
          {
            key: "water",
            title: "Three £270 water tests in a month",
            children: (
              <>
                &ldquo;Legionella testing&rdquo; was billed on 12 April, 7 May and 8 May 2025. One
                was a duplicate, and that £270 was paid back.
              </>
            ),
          },
        ]}
      />

      <P>
        Credit where it is due: he has paid back <strong>£1,749.85</strong> over four lines. Most of
        that was a £1,476 caseworker software bill and the duplicate water test.
      </P>
      <P>
        Away from expenses, his Register of Interests lists two tickets with hospitality for a Paul
        Simon concert from Diageo, worth £370 (May 2026). He declared it, as the rules require.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        The revolving door, and why IPSA paid it
      </Finding>
      <P>
        Here is the part that should make you sit up. The coach&apos;s own website says she worked
        in the House of Commons Members&apos; and Members&apos; Staff Services Team. Then she
        worked at IPSA, as its Stakeholder Engagement Lead.
      </P>
      <P>
        Her company, Lara Lloyd Coaching Ltd, was set up on <strong>19 March 2025</strong>, Companies
        House says. The first MP bill to it shows up in IPSA&apos;s files on{" "}
        <strong>16 September 2025</strong>.
      </P>
      <P>
        That is a <strong>revolving door</strong>. Someone leaves a job inside the system. Then MPs
        pay their firm, using the system&apos;s own money.
      </P>
      <P>
        Nothing in the public records says she broke any rule. MPs are allowed to buy training for
        themselves and their staff. IPSA checked the bills and paid every one. That is the point. The
        rules let it all through.
      </P>

      <section className="not-prose my-10 overflow-hidden rounded-[var(--r-m)] bg-[#10141d] px-6 py-7 text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)] ring-1 ring-[#ff4d4d]/40 sm:px-8 sm:py-8">
        <p className="ui text-[13px] font-[660] uppercase tracking-[0.07em] opacity-75">Who stops this?</p>
        <p className="figure-num mt-2 text-[48px] leading-none text-[#ff5757] sm:text-[56px]">Nobody.</p>
        <ul className="mt-6 space-y-4 text-[17px] leading-[1.55]">
          <li>
            IPSA only exists because of <strong>a law MPs passed themselves</strong> in 2009, after the
            last expenses scandal.
          </li>
          <li>
            IPSA&apos;s own files show just <strong>91 repayments out of 20,879 claims</strong> by
            Scottish MPs since 2022. That is fewer than 1 in 200.
          </li>
          <li className="text-[20px] font-[700] leading-[1.35]">
            A former IPSA insider now gets paid with IPSA&apos;s money. And IPSA waved every bill
            through.
          </li>
        </ul>
      </section>

      <P>
        Four plain questions for <Link href={CRICHTON.href}>Torcuil Crichton</Link> and IPSA have no
        answer in the public files:
      </P>

      <PointList
        items={[
          {
            key: "what",
            title: "What was the MP being coached in?",
            children: <>IPSA&apos;s file gives the firm&apos;s name and nothing else.</>,
          },
          {
            key: "six",
            title: "Why six bills on one day?",
            children: <>Six staff sessions at £125 each, all dated 21 October 2025.</>,
          },
          {
            key: "check",
            title: "Did IPSA check its old staff member's firm before paying?",
            children: <>12 MPs, 44 bills, £16,800. Not one refused.</>,
          },
          {
            key: "worth",
            title: "What did Western Isles voters get for £2,400?",
            children: <>The files do not say what changed after the coaching.</>,
          },
        ]}
      />

      <Aside title="Part of a wider pattern in Westminster">
        <p>
          <Link href={CRICHTON.href}>Torcuil Crichton</Link> is not alone. See{" "}
          <Link href="/blog/worst-scottish-mp-expenses">the worst Scottish MP expenses</Link>,{" "}
          <Link href="/blog/scottish-mps-tv-licence-expenses">29 MPs who billed you for a TV licence</Link>{" "}
          and{" "}
          <Link href="/blog/kilmarnock-mp-23437-electricity-bill">a £23,437 power bill paid in one day</Link>
          . Or compare <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See all 16 coaching bills (or check your own MP)"
        body="Open our live Receipt Finder on Torcuil Crichton's coaching claims. Copy any claim for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=na-h-eileanan-an-iar&q=Lara%20Lloyd"
        cta="See the coaching receipts"
      />

      <P>
        Want the big picture? See <Link href="/mp-expenses-scotland">every Scottish MP&apos;s expenses</Link>.
      </P>
    </Prose>
  );
}
