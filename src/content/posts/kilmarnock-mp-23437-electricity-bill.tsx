import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published individualBusinessCosts CSV files for 2022/23
 * to 2026/27 (checked 22 November 2026 across all 650 UK MPs, over 350,000
 * rows). Quoted descriptions are IPSA's exact wording.
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
    what: "Paid to Yu Energy in a single day (19 May 2026)",
    value: 23436.95,
    label: "£23,437",
    hot: true,
  },
];

const UK_TOP_ELECTRICITY: {
  name: string;
  p: PartyKey;
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
    detail: "Plus £3,052 to the same firm on the same day",
    value: 20384.74,
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
            <strong>Taxpayers</strong> paid a <strong>£23,437</strong> electricity bill for Kilmarnock MP{" "}
            <Link href={JONES.href}>Lillian Jones</Link>, all on one day. IPSA, the body that pays
            MPs&apos; expenses with public money, sent it to her energy company, Yu Energy.
          </>,
          <>
            The <strong>biggest power bill</strong> for any of the 650 UK MPs in five years. Her
            bigger payment alone is <strong>over three and a half times</strong> the next biggest MP
            power claim.
          </>,
          <>
            <strong>£6,587 more</strong> than a full year&apos;s rent on her Kilmarnock office.
          </>,
          <>
            Fellow Labour MP <Link href={MURRAY.href}>Chris Murray</Link> uses the{" "}
            <strong>same firm</strong>. His office bill for June 2026 was <strong>£178.79</strong>.
          </>,
          <>
            Equal to <strong>156</strong> Warm Home Discounts. <strong>£0</strong> has been paid back.
          </>,
        ]}
      />

      <CaseCard kicker="Paid in a single day" figure="£23,437" people={[JONES]}>
        <p>
          Her Kilmarnock office normally pays about <strong>£215 a month</strong> for power.
        </p>
        <p>
          Then, on <strong>19 May 2026</strong>, IPSA made two payments to Yu Energy, a business
          energy firm, covering two budget years: <strong>£20,385</strong> for 2025/26 and{" "}
          <strong>£3,052</strong> for 2026/27.
        </p>
      </CaseCard>

      <section
        aria-label="Her power bill and her Winter Fuel vote"
        className="not-prose my-10 overflow-hidden rounded-[var(--r-m)] bg-[#10141d] text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)] ring-1 ring-[#ff4d4d]/40"
      >
        <div className="flex items-center gap-3 border-b border-white/15 px-6 py-4 sm:px-8">
          <Face name={JONES.name} href={JONES.href} size={44} />
          <p className="ui text-[15px] font-[620] leading-[1.35]">
            <Link href={JONES.href} className="text-white underline decoration-white/40 underline-offset-4">
              Lillian Jones
            </Link>
            <span className="opacity-75"> · Labour MP for Kilmarnock and Loudoun</span>
          </p>
        </div>
        <div className="grid sm:grid-cols-2">
          <div className="border-b border-white/15 px-6 py-7 sm:border-b-0 sm:border-r sm:px-8 sm:py-9">
            <p className="ui text-[13px] font-[660] uppercase tracking-[0.07em] opacity-75">
              19 May 2026 · Her power bill
            </p>
            <p className="figure-num tnum mt-2 text-[54px] leading-none text-[#ff5757] sm:text-[62px]">£23,437</p>
            <p className="mt-3 text-[19px] font-[600] leading-[1.4]">Paid by taxpayers. In one day.</p>
          </div>
          <div className="px-6 py-7 sm:px-8 sm:py-9">
            <p className="ui text-[13px] font-[660] uppercase tracking-[0.07em] opacity-75">
              10 September 2024 · Her vote
            </p>
            <p className="mt-2 text-[28px] font-[720] leading-[1.15] sm:text-[32px]">
              She voted to cut the Winter Fuel Payment.
            </p>
            <p className="mt-3 text-[17px] leading-[1.5] opacity-85">
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
        flat power bills ran from £21 to £85 a month.
      </P>
      <P>
        Then came <strong>19 May 2026</strong>. IPSA logged two big power payments to Yu Energy on
        the same day, on the same account.
      </P>

      <ChartFrame
        kicker="Putting £23,437 in perspective"
        title="One day's power payments vs her own normal bills and rent"
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
          heading="IPSA records · 19 May 2026 · Two payments to Yu Energy"
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
          total={{ label: "Paid on one day · £0 repaid", amount: "£23,436.95" }}
          footer="Wording as printed by IPSA. 2000294348 is the Yu Energy account. IPSA file codes: 200013554-0-C (2025/26) and 200013554-0 (2026/27)."
        />
        <p className="text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
          Her normal office power bill came from Clear Business (£1,074.15 for Nov 2024 to Mar
          2025). Her London flat bills from Octopus ran from £21.57 to £85.01 a month. Her office
          rent for 2025/26 was £16,850.04.
        </p>
      </Expand>

      <CaseCard kicker="Same energy firm, another Labour MP" figure="£178.79" people={[MURRAY]}>
        <p>
          Chris Murray&apos;s Edinburgh office also buys its power from <strong>Yu Energy</strong>.
          His bills in IPSA&apos;s files: <strong>£75.84</strong> for March 2026 and{" "}
          <strong>£178.79</strong> for June 2026. That is <strong>£254.63</strong> in all.
        </p>
        <p>
          Lillian Jones&apos;s payments to the same firm on one day came to{" "}
          <strong>£23,437</strong>. That is about <strong>131 times</strong> his June bill.
        </p>
      </CaseCard>

      <Expand summary="See Chris Murray's two Yu Energy lines, word for word">
        <Receipt
          person={MURRAY}
          heading="IPSA records · 2026/27 · Office Costs · Utilities"
          lines={[
            { meta: "Paid 15 April 2026", what: "YU Energy Expense - March", amount: "£75.84" },
            { meta: "Paid 6 July 2026", what: "YuEnergy Bill for June 2026", amount: "£178.79" },
          ]}
          total={{ label: "Both bills", amount: "£254.63" }}
          footer="Wording as printed by IPSA. These are the only Yu Energy lines for any Scottish MP apart from Lillian Jones's two."
        />
      </Expand>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-number-one">
        Number one out of all 650 UK MPs over five years
      </Finding>
      <P>
        We checked over 350,000 claim lines from all 650 UK MPs, from 2022 to 2027. We looked at
        every power and gas claim.
      </P>
      <P>
        Nothing else comes close. Her bigger payment on its own is more than{" "}
        <strong>three and a half times</strong> the next biggest single MP power claim.
      </P>

      <ChartFrame
        kicker="All 650 UK MPs · 2022/23 to 2026/27"
        title="Biggest single power claims across all 650 UK MPs"
        caption="Source: Five years of IPSA files (2022/23 to 2026/27) across all 650 UK seats."
      >
        <RankList
          max={UK_TOP_ELECTRICITY[0].value}
          rows={UK_TOP_ELECTRICITY.map((r, i) => ({
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

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="warm-home-contrast">
        156 Warm Home Discounts, and her Winter Fuel vote
      </Finding>
      <P>
        In East Ayrshire and across Scotland, low paid homes have to apply for the{" "}
        <Link href="/warm-home-discount-scotland">£150 Warm Home Discount</Link> to keep the heat
        on. At £150 a home, the £23,437 paid in one day equals{" "}
        <strong>156 Warm Home Discounts</strong>.
      </P>

      <Tiles
        items={[
          { value: "£150", label: "one Warm Home Discount for one home" },
          { value: "156", label: "Warm Home Discounts the one day's payments equal", hot: true },
        ]}
      />

      <P>
        Now look at how she voted in Westminster. On <strong>10 September 2024</strong>,{" "}
        <Link href={JONES.href}>Lillian Jones</Link> backed Labour&apos;s cut to the Winter Fuel
        Payment. That cut took up to £300 of winter heat help from millions of pensioners.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="how-ipsa-paid-it">
        How IPSA paid it outside her normal office limit
      </Finding>
      <P>
        Look at which pot of cash paid for this. Normal power bills for an MP&apos;s office come
        from their capped office budget.
      </P>
      <P>
        A £23,437 bill would have smashed straight through that cap. So IPSA paid Yu Energy from
        extra public cash, outside her office budget. That kept it out of her normal office bill.
      </P>
      <P>
        To be fair, a business power bill can jump fast for real reasons. Yu Energy can charge steep
        out of deal rates if a shop unit has no fixed plan. An old tenant may have left unpaid meter
        bills behind, or electric heaters may have run all winter.
      </P>
      <P>
        Even so, four clear questions for <Link href={JONES.href}>Lillian Jones</Link> and IPSA have
        no answer in the public files:
      </P>

      <PointList
        items={[
          {
            key: "building",
            title: "Which building and which dates did it pay for?",
            children: <>IPSA&apos;s file gives one account number and nothing else.</>,
          },
          {
            key: "how",
            title: "How did an office paying £215 a month end up owing £23,437?",
            children: <>Was there no fixed deal in place? Or was it a meter or landlord fight?</>,
          },
          {
            key: "challenge",
            title: "Did IPSA fight the bill before paying £23,437?",
            children: (
              <>
                Why did the public pay more than a year&apos;s rent instead of the firm or landlord
                sorting it out?
              </>
            ),
          },
          {
            key: "repaid",
            title: "Will any of the £23,437 ever come back?",
            children: <>In the latest public files, £0 has been paid back.</>,
          },
        ]}
      />

      <P>
        The power bill is not her only eye catching claim. IPSA, the body that pays MPs&apos;
        expenses with public money, also paid for this:
      </P>

      <Spotlight
        person={JONES}
        kicker="7 November 2024 · Kilmarnock FC"
        amount="£1,020"
        headline="You paid for a Kilmarnock FC advertising board with her name on it."
        lines={[
          {
            meta: "Office Costs · Advertising and contact cards",
            what: "Advertising Board for Kilmarnock FC for Lillian Jones MP",
            amount: "£1,020.00",
          },
        ]}
      >
        <p>Her name, up at the football. Taxpayers footed the bill.</p>
      </Spotlight>

      <P>
        She also billed you <strong>£2,820 for office signs</strong> from Owen Kerr Signs, in two
        payments of £1,410 (March and April 2025).
      </P>

      <Aside title="Part of a wider pattern in Westminster">
        <p>
          <Link href={JONES.href}>Lillian Jones</Link> is not alone. Across Scotland&apos;s 57 MPs,
          we found{" "}
          <Link href="/blog/scottish-mps-tv-licence-expenses">
            29 MPs who claimed £10,754 for TV licences
          </Link>
          . We also found{" "}
          <Link href="/blog/worst-scottish-mp-expenses">£3,090 to set up 5G broadband</Link>,
          <strong>£24,530 on one MP&apos;s phone bills</strong>, and{" "}
          <strong>£37,359 on London hotels</strong>. See{" "}
          <Link href="/mp-expenses-scotland/receipts">the oddest claims</Link> or compare{" "}
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
