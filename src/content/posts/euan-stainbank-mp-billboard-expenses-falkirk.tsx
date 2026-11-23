import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { ExpenseMpCheck, ExpenseNextUp } from "@/components/ExpenseStoryRail";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published individualBusinessCosts CSV files for 2022/23
 * to 2026/27 (checked 22 November 2026 across all 650 UK MPs, over 350,000
 * rows). Quoted descriptions are IPSA's exact wording and must not be edited.
 * UK advertising board ranking: every "Advertising and contact cards" line whose
 * wording mentions an advertising, advert, ad or sponsor board, a hoarding, a
 * billboard or a pitchside board (139 claims by 63 MPs, rechecked 23 November
 * 2026; the first pass missed "Ad Boards" and "sponsor board" wording, which
 * added Dave Robertson and Sarah Smith). Office address from the UK Parliament members
 * site. Nobody was contacted for comment.
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
  CaseCard,
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const STAINBANK = {
  name: "Euan Stainbank",
  href: mp("falkirk"),
  p: "Labour" as PartyKey,
  place: "Falkirk",
};

const FINDINGS = 4;

function Finding({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <KitFinding n={n} of={FINDINGS} id={id}>
      {children}
    </KitFinding>
  );
}

/** Other MPs with their own local story page, linked near the end. */
/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** The board against his own office costs, on one scale. */
const SCALE: { what: string; value: number; label: string; hot?: boolean }[] = [
  { what: "His Falkirk office phone and internet bill (typical month, 2025)", value: 85.49, label: "£85" },
  { what: "One month's rent on his Falkirk office (2024/25)", value: 833.33, label: "£833" },
  { what: "His biggest single Falkirk office power bill (January 2025)", value: 986.53, label: "£987" },
  { what: "One advertising board for him, booked for a year (31 October 2024)", value: 3300, label: "£3,300", hot: true },
];

/** The biggest single advertising board claims across all 650 UK MPs. */
const UK_TOP_BOARDS: {
  name: string;
  p: PartyKey;
  seat: string;
  href?: string;
  date: string;
  detail: ReactNode;
  value: number;
}[] = [
  {
    name: "Euan Stainbank",
    p: "Labour",
    seat: "Falkirk",
    href: mp("falkirk"),
    date: "31 Oct 2024",
    detail: "“Advertising board to advertise Euan as local MP”. To be advertised for 1 year.",
    value: 3300,
  },
  {
    name: "Dave Robertson",
    p: "Labour",
    seat: "Lichfield",
    date: "22 Apr 2025",
    detail: "“Ad Boards at Chasetown FC - Multiyear deal”",
    value: 2160,
  },
  {
    name: "Lizzi Collinge",
    p: "Labour",
    seat: "Morecambe & Lunesdale",
    date: "31 Jul 2025",
    detail: "“Football Hoarding costs for 2025/2026”",
    value: 1800,
  },
  {
    name: "Sarah Smith",
    p: "Labour",
    seat: "Hyndburn",
    date: "30 May 2025",
    detail: "“1 sx TV sponsor board at Accrington Stanley FC”",
    value: 1800,
  },
  {
    name: "Frank McNally",
    p: "Labour",
    seat: "Coatbridge & Bellshill",
    href: mp("coatbridge-and-bellshill"),
    date: "27 Mar 2025",
    detail: "Board at Albion Rovers FC",
    value: 1621.48,
  },
  {
    name: "Joani Reid",
    p: "Labour",
    seat: "East Kilbride & Strathaven",
    href: mp("east-kilbride-and-strathaven"),
    date: "9 Oct 2024",
    detail: "“Advertising Hoarding at East Kilbride FC”",
    value: 1500,
  },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function EuanStainbankMpBillboardExpensesFalkirk() {
  const scaleMax = Math.max(...SCALE.map((s) => s.value));

  return (
    <Prose>
      <QuickTake
        items={[
          <>
            Four months after winning Falkirk, Labour MP{" "}
            <Link href={STAINBANK.href}>Euan Stainbank</Link> billed you <strong>£3,300</strong>{" "}
            for a big ad board.
          </>,
          <>
            It is the <strong>biggest single board claim of all 650 UK MPs</strong> since 2022. The
            next biggest was £2,160.
          </>,
          <>
            That one sign cost <strong>four months&apos; rent</strong> on his Falkirk office.
          </>,
          <>
            The claim is dated 31 October 2024 and was paid in full. <strong>£0</strong> has come
            back.
          </>,
        ]}
      />

      <ExpenseMpCheck slug="euan-stainbank-mp-billboard-expenses-falkirk" />

      <Spotlight
        person={STAINBANK}
        kicker="31 October 2024 · booked for a whole year"
        amount="£3,300"
        headline="A year of ads telling Falkirk who its MP is, paid by Falkirk."
        lines={[
          {
            meta: "Office Costs · Advertising and contact cards",
            what: "Advertising board to advertise Euan as local MP and contact details. To be advertised for 1 year.",
            amount: "£3,300.00",
          },
        ]}
      >
        <p>You voted him in in July. By October, you were paying £275 a month to put his name on a board.</p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-billboard">
        Four months&apos; office rent, spent on one sign
      </Finding>
      <P>
        <Link href={STAINBANK.href}>Euan Stainbank</Link> won Falkirk in July 2024. He opened a
        local office on Newmarket Street.
      </P>
      <P>
        Less than four months on, he claimed £3,300 for a year of ads &ldquo;to advertise Euan as
        local MP&rdquo;.
      </P>
      <P>
        The file never says where the sign stood or who made it. You only see the price tag.
      </P>

      <ChartFrame
        kicker="Putting £3,300 in perspective"
        title="One advertising board vs his own Falkirk office bills"
        caption="Source: IPSA files (2024/25 and 2025/26) for Euan Stainbank MP."
      >
        <div className="space-y-4">
          {SCALE.map((s) => (
            <div key={s.label}>
              <p
                className={`ui mb-1 text-[14.5px] leading-[1.45] ${s.hot ? "font-[680] text-[var(--ink)]" : "text-[var(--ink-2)]"}`}
              >
                {s.what}
              </p>
              <Bar
                value={s.value}
                max={scaleMax}
                colour={s.hot ? "var(--bad)" : "var(--rule-strong)"}
                label={s.label}
              />
            </div>
          ))}
        </div>
      </ChartFrame>

      <Tiles
        items={[
          { value: "£275", label: "what the board cost every single month" },
          { value: "£3,300", label: "the full bill, paid upfront", hot: true },
        ]}
      />

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-number-one">
        The biggest advertising board of all 650 UK MPs
      </Finding>
      <P>
        Across five years and all 650 UK seats, 63 MPs put an ad board on expenses (139 claims in
        all).
      </P>
      <P>
        Most spent a few hundred pounds at a local football club. Stainbank&apos;s £3,300 beat
        the next biggest in the UK, £2,160 for boards at Chasetown FC, by £1,140.
      </P>

      <ChartFrame
        kicker="All 650 UK MPs · 2022/23 to 2026/27"
        title="Biggest single advertising board claims by any UK MP"
        caption="Source: Five years of IPSA files (2022/23 to 2026/27) across all 650 UK seats. One line per MP."
      >
        <RankList
          max={UK_TOP_BOARDS[0].value}
          rows={UK_TOP_BOARDS.map((r, i) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
            side: r.date,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            detail: r.detail,
            highlight: i === 0,
          }))}
        />
      </ChartFrame>

      <P>
        Three of the top six are Scottish Labour MPs. Even{" "}
        <Link href={mp("kilmarnock-and-loudoun")}>Lillian Jones</Link>&apos;s £1,020 board at
        Kilmarnock FC was less than a third of Stainbank&apos;s bill.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <ExpenseNextUp slug="euan-stainbank-mp-billboard-expenses-falkirk" />

      <Finding n={3} id="his-other-claims">
        £5,002 on furniture, £2,808 to a display firm, and broken heating
      </Finding>
      <P>
        The board sits alongside several other hefty bills since July 2024:
      </P>

      <CaseCard kicker="Office furniture, in one go" figure="£5,002" people={[STAINBANK]}>
        <p>
          A claim dated <strong>19 September 2024</strong> shows <strong>£5,001.60</strong> paid to an
          office furniture shop. One of the biggest single furniture bills of any Scottish MP.
        </p>
      </CaseCard>

      <PointList
        items={[
          {
            key: "heating",
            title: "£2,380 to fix broken office heating",
            children: (
              <>
                His office says the air conditioning units were its only heating and were broken
                when it signed the lease. Taxpayers paid £2,006.17 for a part, £205.44 for repairs
                and £168 for a service, a job a landlord normally sorts out.
              </>
            ),
          },
          {
            key: "apb",
            title: "£2,808 to a display firm, with no detail",
            children: (
              <>
                Three bills from APB Displays Limited: £897 (November 2025), £897 (January 2026) and
                £1,014 (March 2026). The file never says what was bought.
              </>
            ),
          },
          {
            key: "tv",
            title: "£344 for two TV licences",
            children: (
              <>
                January 2025 (£169.50) and September 2025 (£174.50). See{" "}
                <Link href="/blog/scottish-mps-tv-licence-expenses">all 29 Scottish MPs who did it</Link>.
              </>
            ),
          },
          {
            key: "training",
            title: "£1,500 for staff training from Real Clear",
            children: <>Two £750 bills, both in claims dated 31 January 2025.</>,
          },
          {
            key: "flat",
            title: "£24,480 a year for his London flat",
            children: (
              <>
                £2,040 a month in 2025/26, allowed under IPSA&apos;s second home rules.
              </>
            ),
          },
        ]}
      />

      <Expand summary="See the proof: his biggest claims, word for word">
        <Receipt
          person={STAINBANK}
          heading="IPSA records · Euan Stainbank · 2024 to 2026"
          lines={[
            {
              meta: "31 Oct 2024 · Advertising and contact cards",
              what: "Advertising board to advertise Euan as local MP and contact details. To be advertised for 1 year.",
              amount: "£3,300.00",
            },
            {
              meta: "19 Sep 2024 · Equipment purchase",
              what: "[***] Office Furniture Centre- Euan Stainbank",
              amount: "£5,001.60",
            },
            {
              meta: "29 Nov 2024 · Equipment purchase",
              what: "Part required to fix office heating",
              amount: "£2,006.17",
            },
            {
              meta: "26 Nov 2024 · Maintenance and repairs",
              what: "Required repairs to AC units. There is no heating within the office and the air conditioning units provide heat which were not working when we took over the lease.",
              amount: "£205.44",
            },
            {
              meta: "19 Jan 2026 · Advertising and contact cards",
              what: "APB DISPLAYS LIMITED",
              amount: "£897.00",
            },
            {
              meta: "30 Mar 2026 · Maintenance and repairs",
              what: "APB DISPLAYS LIMITED [200013613-2355]",
              amount: "£1,014.00",
            },
          ]}
          footer="Wording as printed by IPSA, including the [***] where IPSA hid part of the name. IPSA claim number for the board: 60262102-1 (2024/25). Every line is marked Paid. £0 repaid."
        />
      </Expand>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        How a £3,300 ad board slips past the rules
      </Finding>
      <P>
        IPSA lets MPs pay to tell locals how to reach them, as long as there is no party badge on
        it.
      </P>
      <P>
        Put your phone number on a huge sign and it counts as &ldquo;contact details&rdquo;. Other
        new MPs do the same job for a few hundred pounds. Falkirk voters are owed three answers:
      </P>

      <PointList
        items={[
          {
            key: "where",
            title: "Where did the board stand, and who got the £3,300?",
            children: <>IPSA names no place and no firm.</>,
          },
          {
            key: "why-so-much",
            title: "Why £1,140 more than any other MP in the UK?",
            children: <>The next biggest board in the UK was £2,160, and that was a deal over several years.</>,
          },
          {
            key: "worth-it",
            title: "What was the £2,808 to APB Displays for?",
            children: <>Three more bills, with no word on what you bought.</>,
          },
        ]}
      />

      <Aside title="Not the only MP advertising themselves on your money">
        <p>
          Some MPs send glossy leaflets through every door at your expense too. See{" "}
          <Link href="/blog/worst-scottish-mp-expenses">the worst Scottish MP expenses</Link>,{" "}
          <Link href="/blog/msp-expenses-scotland-investigation">Holyrood&apos;s March leaflet rush</Link>{" "}
          or compare <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See every claim Euan Stainbank has made"
        body="Open our live Receipt Finder on the Falkirk MP. Copy any receipt for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=falkirk"
        cta="See his receipts"
      />
    </Prose>
  );
}
