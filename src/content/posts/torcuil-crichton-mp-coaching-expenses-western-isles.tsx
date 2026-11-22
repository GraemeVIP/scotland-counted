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
  place: "Na h-Eileanan an Iar (Western Isles)",
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
    seat: "Na h-Eileanan an Iar (Western Isles)",
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
            Western Isles MP <Link href={CRICHTON.href}>Torcuil Crichton</Link> put{" "}
            <strong>16 coaching bills</strong> on expenses: <strong>£2,400</strong> in eight
            months.
          </>,
          <>
            The coach used to work at <strong>IPSA</strong>, the very office that pays MPs&apos;
            expenses.
          </>,
          <>
            <strong>12 MPs</strong> across the UK paid her new firm <strong>£16,800</strong>. He is
            the <strong>only Scottish MP</strong> on the list, and sent in more bills than anyone
            else.
          </>,
          <>
            Every penny was waved through. <strong>£0</strong> was refused or paid back.
          </>,
        ]}
      />

      <Spotlight
        person={CRICHTON}
        kicker="21 October 2025 to 16 June 2026 · 16 bills"
        amount="£2,400"
        headline="16 coaching bills in eight months, all paid by you."
        lines={[
          { meta: "21 Oct 2025 · six bills on one day · staff training", what: "LARA LLOYD COACHING", amount: "6 × £125" },
          { meta: "Oct 2025 to June 2026 · training for the MP himself", what: "LARA LLOYD COACHING", amount: "5 × £175" },
          { meta: "Feb to May 2026 · staff training", what: "LARA LLOYD COACHING", amount: "£175 + 4 × £150" },
        ]}
      >
        <p>
          <strong>£875</strong> was for coaching the MP himself. The other <strong>£1,525</strong>{" "}
          was for his staff. Six of those bills went in on the exact same Tuesday.
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-receipts">
        Six bills in one day, then £175 a session
      </Finding>
      <P>
        Most people in the Western Isles pay for their own night classes or courses. Not at
        Westminster.
      </P>
      <P>
        On <strong>21 October 2025</strong>, Labour MP{" "}
        <Link href={CRICHTON.href}>Torcuil Crichton</Link>&apos;s office sent in six bills to Lara
        Lloyd Coaching on the same day. Every one was £125, all logged as staff training.
      </P>
      <P>
        Seven days later, the personal coaching started. Five bills for &ldquo;Training - MP&rdquo;
        landed between October 2025 and June 2026, each for £175 on the nose.
      </P>
      <P>
        Check the coach&apos;s own website and the maths jumps straight out. She sells{" "}
        <strong>six one hour sessions for £1,050</strong>, mostly online. Split £1,050 by six and
        you get £175 a pop.
      </P>

      <Tiles
        items={[
          { value: "£2,400", label: "to the coaching firm, in 16 bills", hot: true },
          { value: "£875", label: "for coaching the MP himself (Oct 2025 to June 2026)" },
          { value: "£4,200", label: "on all training since he won the seat in July 2024" },
        ]}
      />

      <P>
        That wasn&apos;t even the start of his training spend. Before Lara Lloyd Coaching, taxpayers
        had already paid <strong>£1,500</strong> to HIVE SUPPORT LTD (four bills of £375) and{" "}
        <strong>£300</strong> to ELECTED TECHNOLOGIES. All of it went down as staff training.
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
        We ran the firm&apos;s name through every claim from all 650 UK MPs since 2022.
      </P>
      <P>
        It popped up <strong>44 times</strong> across <strong>12 MPs</strong> in under ten months,
        totalling <strong>£16,800</strong>. Crichton was the only Scottish MP on the list, and he
        filed more than a third of the bills on his own.
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
        MPs filed the exact same coach under different labels. One called it &ldquo;Professional &amp;
        consultancy&rdquo;. Another logged &ldquo;session 1 of 6&rdquo; through to &ldquo;session 6
        of 6&rdquo; at £175 each, buying the £1,050 package straight off the website with public
        money.
      </P>
      <P>
        In Scotland, only two of our 57 MPs claimed &ldquo;Training - MP&rdquo; in 2025/26. Crichton
        came top with <strong>£700</strong> for four sessions, then billed a fifth in June 2026.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="other-claims">
        What else went on his £313,106 tab
      </Finding>
      <P>
        Staff wages made up £209,561 of his <strong>£313,106</strong> total in 2025/26. Here is
        what stood out in the rest of his file:
      </P>

      <PointList
        items={[
          {
            key: "flights",
            title: "£23,608 on his own flights (2025/26)",
            children: (
              <>
                Fair enough, you can&apos;t take a bus from Stornoway to Westminster. His staff
                also billed £8,424 for flights and £3,691 for London hotels.
              </>
            ),
          },
          {
            key: "rent",
            title: "£21,600 rent for his London flat (2025/26)",
            children: <>£1,800 a month, plus £1,089 in council tax.</>,
          },
          {
            key: "adverts",
            title: "£4,813 on adverts in one year (2025/26)",
            children: (
              <>
                16 separate bills, including £250 for an &ldquo;Advertising board in
                constituency&rdquo; and £1,825 across four bills to &ldquo;SQ SPORSNIS&rdquo;.
              </>
            ),
          },
          {
            key: "furniture",
            title: "£4,372 on office furniture",
            children: (
              <>
                £2,689.51 in January 2025, followed by another £1,682.63 to MACKENZIE HOLDINGS LTD
                eight months later.
              </>
            ),
          },
          {
            key: "water",
            title: "Three £270 water tests in four weeks",
            children: (
              <>
                &ldquo;Legionella testing&rdquo; went in on 12 April, 7 May and 8 May 2025. One was
                a duplicate and he paid that £270 back.
              </>
            ),
          },
        ]}
      />

      <P>
        To his credit, he did pay back <strong>£1,749.85</strong> across four claims, mostly a
        £1,476 software bill and that duplicate water test. His Register of Interests also notes
        £370 of Paul Simon concert tickets from Diageo in May 2026.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        From working at IPSA to being paid by IPSA
      </Finding>
      <P>
        Here is why this story stinks. On her own website, the coach says she worked inside the
        House of Commons supporting MPs, and then worked at IPSA dealing directly with MPs.
      </P>
      <P>
        Companies House shows she formed Lara Lloyd Coaching Ltd on <strong>19 March 2025</strong>.
        Less than six months later, on <strong>16 September 2025</strong>, MPs started billing IPSA
        to pay her new firm.
      </P>
      <P>
        Leave the expenses watchdog in March, invoice the expenses watchdog by September. Nothing in
        the files says any rule was broken. That is the whole issue: IPSA&apos;s rules wave this
        straight through.
      </P>
      <P>
        Since 2022, Scottish MPs have paid back just 91 out of 20,879 claims. You can see the worst
        of them in our{" "}
        <Link href="/blog/worst-scottish-mp-expenses">Scottish MP expenses roundup</Link>.
      </P>

      <P>
        For now, Western Isles voters are left with four plain questions:
      </P>

      <PointList
        items={[
          {
            key: "what",
            title: "What was he actually being coached in?",
            children: <>IPSA only prints the firm&apos;s name. Not a word on what was taught.</>,
          },
          {
            key: "six",
            title: "Why did six £125 bills land on the same day?",
            children: <>All six staff coaching bills carry the same date: 21 October 2025.</>,
          },
          {
            key: "check",
            title: "Did IPSA flag a former worker's new firm?",
            children: <>12 MPs, 44 bills, £16,800 paid out, zero turned down.</>,
          },
          {
            key: "worth",
            title: "What did folk in the islands get for £2,400?",
            children: <>Nobody in the public file has to prove the coaching did a thing.</>,
          },
        ]}
      />

      <Aside title="Not a one off at Westminster">
        <p>
          Across Scotland&apos;s 57 MPs, we also found{" "}
          <Link href="/blog/kilmarnock-mp-23437-electricity-bill">a £23,437 power bill paid in one day</Link>,{" "}
          <Link href="/blog/scottish-mps-tv-licence-expenses">29 MPs claiming TV licences</Link> and{" "}
          <Link href="/blog/angus-macdonald-mp-speech-coach-drains-expenses">£3,000 for speech lessons in the Highlands</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See all 16 coaching bills (or check your own MP)"
        body="Open our live Receipt Finder on Torcuil Crichton's coaching claims. Copy any receipt for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=na-h-eileanan-an-iar&q=Lara%20Lloyd"
        cta="See the coaching receipts"
      />
    </Prose>
  );
}
