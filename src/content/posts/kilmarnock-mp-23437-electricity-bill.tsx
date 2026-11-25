import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published individualBusinessCosts CSV files for 2022/23
 * to 2026/27 (checked 23 November 2026 across every MP who claimed since 2022,
 * over 350,000 rows). Quoted descriptions are IPSA's exact wording.
 * Voting record: House of Commons Divisions 14 and 15, 10 September 2024.
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
  Face,
  Party,
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const JONES = {
  name: "Lillian Jones",
  href: mp("kilmarnock-and-loudoun"),
  p: "Labour" as PartyKey,
  place: "Kilmarnock and Loudoun",
};

const MURRAY = {
  name: "Chris Murray",
  href: mp("edinburgh-east-and-musselburgh"),
  p: "Labour" as PartyKey,
  place: "Edinburgh East and Musselburgh",
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

/** One day's payout against her own normal bills and rent, on one scale. */
const SCALE: { what: string; value: number; label: string; hot?: boolean }[] = [
  { what: "Her London flat electricity bill (typical month)", value: 85, label: "£21 to £85" },
  {
    what: "Labour MP Chris Murray's office bill from the same firm, Yu Energy (June 2026)",
    value: 178.79,
    label: "£179",
  },
  {
    what: "Her Kilmarnock office electricity for 5 winter months (Nov 2024 to Mar 2025)",
    value: 1074.15,
    label: "£1,074",
  },
  {
    what: "A full year's rent for her whole Kilmarnock office (2025/26)",
    value: 16850.04,
    label: "£16,850",
  },
  {
    what: "Two Yu Energy claims, both dated 19 May 2026",
    value: 23436.95,
    label: "£23,437",
    hot: true,
  },
];

/** Each MP's biggest single gas or electricity claim, top eight, 2022/23 to 2026/27. */
const UK_TOP_ELECTRICITY: {
  name: string;
  p: PartyKey;
  partyLabel?: string;
  colour?: string;
  seat: string;
  href?: string;
  date: string;
  detail: ReactNode;
  value: number;
}[] = [
  {
    name: "Lillian Jones",
    p: "Labour",
    seat: "Kilmarnock & Loudoun",
    href: mp("kilmarnock-and-loudoun"),
    date: "19 May 2026",
    detail: "Plus £3,052 to the same firm in a claim dated the same day",
    value: 20384.74,
  },
  {
    name: "Bim Afolami",
    p: "Conservative",
    seat: "Hitchin and Harpenden",
    date: "4 Sep 2024",
    detail: "Accommodation (Gas & Electricity for London residence)",
    value: 6483.31,
  },
  {
    name: "Nick Thomas-Symonds",
    p: "Labour",
    seat: "Torfaen",
    date: "29 May 2024",
    detail: "Office Costs (SSE Utility bill)",
    value: 5632.57,
  },
  {
    name: "Valerie Vaz",
    p: "Labour",
    seat: "Walsall South",
    date: "20 Jul 2022",
    detail: "Office Costs (advance invoice)",
    value: 5124.01,
  },
  {
    name: "Sara Britcliffe",
    p: "Conservative",
    seat: "Hyndburn",
    date: "19 Jul 2024",
    detail: "Office Costs (SSE Energy Solutions)",
    value: 5081.02,
  },
  {
    name: "Liz Saville-Roberts",
    p: "Independent",
    partyLabel: "Plaid Cymru",
    colour: "#3f8428",
    seat: "Dwyfor Meirionnydd",
    date: "29 Jul 2022",
    detail: "Office Costs (Gas charges for constituency office)",
    value: 4663.87,
  },
  {
    name: "Janet Daby",
    p: "Labour",
    seat: "Lewisham East",
    date: "30 Mar 2026",
    detail: "Office Costs (SmartestEnergy Business)",
    value: 4543.85,
  },
  {
    name: "Kirsty Blackman",
    p: "SNP",
    seat: "Aberdeen North",
    href: mp("aberdeen-north"),
    date: "31 May 2024",
    detail: "Office Costs (Office Electricity 2022/23, EON)",
    value: 4506.93,
  },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function KilmarnockMp23437ElectricityBill() {
  const scaleMax = Math.max(...SCALE.map((s) => s.value));

  return (
    <Prose>
      <QuickTake
        items={[
          <>
            Public funds paid a <strong>£23,437</strong> energy bill for Kilmarnock MP{" "}
            <Link href={JONES.href}>Lillian Jones</Link>, in two claims dated the same day. It is
            the <strong>biggest energy bill of any UK MP</strong> since 2022.
          </>,
          <>
            It cost <strong>£6,587 more</strong> than a full year&apos;s rent on her Kilmarnock
            office.
          </>,
          <>
            Labour MP <Link href={MURRAY.href}>Chris Murray</Link> uses the same firm (Yu Energy).
            His June 2026 office bill was <strong>£178.79</strong>.
          </>,
          <>
            That equals <strong>156 Warm Home Discounts</strong>, after she voted to cut the Winter
            Fuel Payment. <strong>£0</strong> paid back.
          </>,
        ]}
      />

      <CaseCard kicker="Two claims, one date" figure="£23,437" people={[JONES]}>
        <p>
          Her last office power bill worked out at about <strong>£215 a month</strong>.
        </p>
        <p>
          Then came two claims to Yu Energy, both dated <strong>19 May 2026</strong>:{" "}
          <strong>£20,385</strong> (2025/26) and <strong>£3,052</strong> (2026/27).
        </p>
      </CaseCard>

      <section
        aria-label="Her energy bill and her Winter Fuel vote"
        className="not-prose my-10 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] border-l-[6px] border-l-[var(--bad)] bg-[color-mix(in_srgb,var(--bad)_5%,var(--surface))] text-[var(--ink)] shadow-[0_14px_34px_-26px_rgba(10,16,34,0.45)]"
      >
        <div className="flex items-center gap-3 border-b border-[var(--rule)] px-6 py-4 sm:px-8">
          <Face name={JONES.name} href={JONES.href} size={44} />
          <p className="ui text-[15px] font-[620] leading-[1.35]">
            <Link href={JONES.href} className="text-[var(--ink)] underline decoration-[var(--rule-strong)] underline-offset-4">
              Lillian Jones
            </Link>
            <span className="text-[var(--muted)]"> · Labour MP for Kilmarnock and Loudoun</span>
          </p>
        </div>
        <div className="grid sm:grid-cols-2">
          <div className="border-b border-[var(--rule)] px-6 py-7 sm:border-b-0 sm:border-r sm:px-8 sm:py-9">
            <p className="ui text-[13px] font-[660] uppercase tracking-[0.07em] text-[var(--muted)]">
              19 May 2026 · Her energy bill
            </p>
            <p className="figure-num tnum mt-2 text-[54px] leading-none text-[var(--bad-text)] sm:text-[62px]">£23,437</p>
            <p className="mt-3 text-[19px] font-[600] leading-[1.4]">Paid by taxpayers. Two claims, one date.</p>
          </div>
          <div className="px-6 py-7 sm:px-8 sm:py-9">
            <p className="ui text-[13px] font-[660] uppercase tracking-[0.07em] text-[var(--muted)]">
              10 September 2024 · Her vote
            </p>
            <p className="mt-2 text-[28px] font-[720] leading-[1.15] sm:text-[32px]">
              She voted to cut the Winter Fuel Payment.
            </p>
            <p className="mt-3 text-[17px] leading-[1.5] text-[var(--ink-2)]">
              Millions of pensioners lost up to <strong>£300</strong> of help to heat their homes.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-receipts">
        What the public records show
      </Finding>
      <P>
        <Link href={JONES.href}>Lillian Jones</Link> won Kilmarnock and Loudoun for Labour in July
        2024. Her local office sits on Portland Street in Kilmarnock.
      </P>
      <P>
        Her office paid £1,074 for five winter months of power, about £215 a month. Her London
        flat power bills ran from £21 to £85.
      </P>
      <P>
        Then came <strong>19 May 2026</strong>. IPSA logged two big energy claims to Yu Energy,
        both dated that day, on the same account.
      </P>

      <ChartFrame
        kicker="Putting £23,437 in perspective"
        title="Two energy claims on one date vs her own normal bills and rent"
        caption="Source: IPSA files (2024/25 to 2026/27) for Lillian Jones MP."
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

      <Expand summary="See the proof: the two IPSA lines, word for word">
        <Receipt
          person={JONES}
          heading="IPSA records · 19 May 2026 · Two claims to Yu Energy"
          lines={[
            {
              meta: "2025/26 budget year · Miscellaneous",
              what: "Lillian Jones - Yu Energy Utilities - 2000294348",
              amount: "£20,384.74",
            },
            {
              meta: "2026/27 budget year · Other Costs",
              what: "Lillian Jones - Yu Energy Utilities - 2000294348",
              amount: "£3,052.21",
            },
          ]}
          total={{ label: "Both dated 19 May 2026 · £0 repaid", amount: "£23,436.95" }}
          footer="Wording as printed by IPSA. 2000294348 is the Yu Energy account. IPSA file codes: 200013554-0-C (2025/26) and 200013554-0 (2026/27)."
        />
        <p className="text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
          Her normal office power bill came from Clear Business (£1,074.15 for Nov 2024 to Mar
          2025). Her London flat power bills ran from £21.57 to £85.01. The Octopus Energy ones
          were £52.43 to £85.01. Her office rent for 2025/26 was £16,850.04.
        </p>
      </Expand>

      <CaseCard kicker="Same energy firm, another Labour MP" figure="£178.79" people={[MURRAY]}>
        <p>
          Chris Murray&apos;s Edinburgh office also buys its power from <strong>Yu Energy</strong>.
          His bills in IPSA&apos;s files: <strong>£75.84</strong> for March 2026 and{" "}
          <strong>£178.79</strong> for June 2026. That is <strong>£254.63</strong> in all.
        </p>
        <p>
          Lillian Jones&apos;s two claims to the same firm, dated the same day, came to{" "}
          <strong>£23,437</strong>. That is about <strong>131 times</strong> his June bill.
        </p>
      </CaseCard>

      <Expand summary="See Chris Murray's two Yu Energy lines, word for word">
        <Receipt
          person={MURRAY}
          heading="IPSA records · 2026/27 · Office Costs · Utilities"
          lines={[
            { meta: "Claim dated 15 April 2026", what: "YU Energy Expense - March", amount: "£75.84" },
            { meta: "Claim dated 6 July 2026", what: "YuEnergy Bill for June 2026", amount: "£178.79" },
          ]}
          total={{ label: "Both bills", amount: "£254.63" }}
          footer="Wording as printed by IPSA. These are the only Yu Energy lines for any Scottish MP apart from Lillian Jones's two."
        />
      </Expand>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-number-one">
        Number one of every UK MP since 2022
      </Finding>
      <P>
        We checked over 350,000 claim lines from every MP since 2022. We looked at every power and
        gas claim.
      </P>
      <P>
        Nothing else comes close. Her bigger claim on its own is more than{" "}
        <strong>three times</strong> the next biggest single gas or electricity claim by any MP.
        That was £6,483 for Conservative Bim Afolami&apos;s London home in 2024.
      </P>

      <ChartFrame
        kicker="Every UK MP · 2022/23 to 2026/27"
        title="Biggest single gas and electricity claims by any UK MP"
        caption="Source: Five years of IPSA files (2022/23 to 2026/27) for every MP who claimed. Each MP's biggest single claim is shown once."
      >
        <RankList
          max={UK_TOP_ELECTRICITY[0].value}
          rows={UK_TOP_ELECTRICITY.map((r, i) => ({
            key: r.name,
            who: r.partyLabel ? (
              <span className="flex min-w-0 items-center gap-2.5">
                <Face name={r.name} href={r.href} size={40} />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-[620] text-[var(--ink)]">{r.name}</span>
                  <Party p={r.p} label={r.partyLabel} note={r.seat} />
                </span>
              </span>
            ) : (
              <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />
            ),
            side: r.date,
            value: r.value,
            label: gbp(r.value, false),
            colour: r.colour ?? PARTY[r.p].colour,
            detail: r.detail,
            highlight: i === 0,
          }))}
        />
      </ChartFrame>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="warm-home-contrast">
        156 Warm Home Discounts, and her Winter Fuel vote
      </Finding>
      <P>
        In East Ayrshire and across Scotland, low paid homes have to apply for the{" "}
        <Link href="/warm-home-discount-scotland">£150 Warm Home Discount</Link> to keep the heat
        on. At £150 a home, the £23,437 in those two claims equals{" "}
        <strong>156 Warm Home Discounts</strong>.
      </P>

      <Tiles
        items={[
          { value: "£150", label: "one Warm Home Discount for one home" },
          { value: "156", label: "Warm Home Discounts the two claims equal", hot: true },
        ]}
      />

      <P>
        Now look at how she voted in Westminster. On <strong>10 September 2024</strong>,{" "}
        <Link href={JONES.href}>Lillian Jones</Link> backed Labour&apos;s cut to the Winter Fuel
        Payment. That cut took up to £300 of winter heat help from millions of pensioners.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="how-ipsa-paid-it">
        How £23,437 went through without touching her office cap
      </Finding>
      <P>
        Normally, an MP&apos;s energy bill comes out of their office pot. A £23,437 hit would have
        blown straight through it.
      </P>
      <P>
        So the Yu Energy claims went through a side pot of public cash. Her normal office pot never
        took the hit.
      </P>
      <P>
        Business energy bills can spike with no fixed deal, an old debt, or heaters left on all winter.
        The files never say which of those took place, or why the claim was so large.
      </P>
      <P>
        Kilmarnock people still have no answers to four plain questions:
      </P>

      <PointList
        items={[
          {
            key: "building",
            title: "Which building and which dates did £23,437 cover?",
            children: <>IPSA only prints one Yu Energy account number.</>,
          },
          {
            key: "how",
            title: "How did a £215 a month office end up owing £23,437?",
            children: <>Was it out of deal rates, a faulty meter, or an old tenant&apos;s debt?</>,
          },
          {
            key: "challenge",
            title: "Did IPSA fight the bill before paying more than a year's rent?",
            children: (
              <>
                Why did taxpayers pay instead of the energy firm or landlord sorting it out?
              </>
            ),
          },
          {
            key: "repaid",
            title: "Will a penny of the £23,437 ever come back?",
            children: <>In the latest public files, £0 has been repaid.</>,
          },
        ]}
      />

      <P>
        The energy bill sits alongside her other local promo claims:
      </P>

      <Spotlight
        person={JONES}
        kicker="7 November 2024 · Kilmarnock FC"
        amount="£1,020"
        headline="A Kilmarnock FC advertising board with her name on it."
        lines={[
          {
            meta: "Office Costs · Advertising and contact cards",
            what: "Advertising Board for Kilmarnock FC for Lillian Jones MP",
            amount: "£1,020.00",
          },
        ]}
      >
        <p>Taxpayers paid £1,020 to put her name up at Rugby Park.</p>
      </Spotlight>

      <P>
        She also billed <strong>£2,820 for office signs</strong> from Owen Kerr Signs in two £1,410
        payments (March and April 2025).
      </P>

      <Aside title="Not just Kilmarnock">
        <p>
          Across Scotland&apos;s 57 MPs, we also found{" "}
          <Link href="/blog/scottish-mps-tv-licence-expenses">
            29 MPs claiming £10,754 for TV licences
          </Link>
          , <Link href="/blog/chris-law-mp-3090-broadband-expenses-dundee">£3,090 to set up 5G broadband</Link>,{" "}
          <strong>£24,515 on one MP&apos;s mobile bills</strong> and{" "}
          <strong>£37,359 on London hotels for</strong>{" "}
          <Link href="/representatives/mps/glasgow-south-west#donations-and-interests">Dr Zubir Ahmed</Link>{" "}
          in one year. See{" "}
          <Link href="/blog/worst-scottish-mp-expenses">standout MP expense claims</Link> or compare{" "}
          <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See both Yu Energy claims (or check your own MP)"
        body="Open our live Receipt Finder on Yu Energy. Copy any claim for X or WhatsApp, or email Lillian Jones direct."
        href="/mp-expenses-scotland/search?q=Yu%20Energy"
        cta="See the Yu Energy receipts"
      />
    </Prose>
  );
}
