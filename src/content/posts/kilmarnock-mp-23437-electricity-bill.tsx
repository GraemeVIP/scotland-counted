import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published individualBusinessCosts CSV files for 2022/23
 * to 2026/27 (checked 22 November 2026 across all 650 UK MPs, over 350,000
 * rows). Quoted descriptions are IPSA's exact wording.
 * Voting record: House of Commons Divisions 14 and 15, 10 September 2024.
 */

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const LILLIAN_ROWS = [
  [
    "19 May 2026",
    "2025/26",
    "Miscellaneous",
    "Lillian Jones - Yu Energy Utilities - 2000294348",
    "£20,384.74",
  ],
  [
    "19 May 2026",
    "2026/27",
    "Other Costs",
    "Lillian Jones - Yu Energy Utilities - 2000294348",
    "£3,052.21",
  ],
  [
    <strong key="tot">Combined same day payout</strong>,
    <strong key="yr">2025/26 &amp; 2026/27</strong>,
    <strong key="pot">Central contingency pots</strong>,
    <strong key="acc">Account 2000294348 (£0 repaid)</strong>,
    <strong key="val">£23,436.95</strong>,
  ],
];

const SCALE_ROWS = [
  ["Her London flat electricity bill (Octopus Energy, typical month)", "£21 to £85"],
  ["Her Kilmarnock office electricity (Clear Business, Nov 2024 to Mar 2025, 5 winter months)", "£1,074.15"],
  ["A full year's rent for her entire Kilmarnock constituency office (2025/26)", "£16,850.04"],
  [
    <strong key="yu">One day&apos;s electricity payout to Yu Energy (19 May 2026)</strong>,
    <strong key="yuv">£23,436.95</strong>,
  ],
];

const UK_TOP_ELECTRICITY = [
  [
    <strong key="lj">1. Lillian Jones (Labour, Kilmarnock &amp; Loudoun)</strong>,
    <strong key="ljd">19 May 2026</strong>,
    <strong key="ljb">Miscellaneous &amp; Other Costs</strong>,
    <strong key="ljv">£23,436.95 (£20,384.74 + £3,052.21)</strong>,
  ],
  [
    "2. Nick Thomas-Symonds (Labour, Torfaen)",
    "29 May 2024",
    "Office Costs (SSE Utility bill)",
    "£5,632.57",
  ],
  [
    "3. Valerie Vaz (Labour, Walsall South)",
    "20 Jul 2022",
    "Office Costs (advance invoice)",
    "£5,124.01",
  ],
  [
    "4. Sara Britcliffe (Conservative, Hyndburn)",
    "19 Jul 2024",
    "Office Costs (SSE Energy Solutions)",
    "£5,081.02",
  ],
  [
    "5. Janet Daby (Labour, Lewisham East)",
    "30 Mar 2026",
    "Office Costs (SmartestEnergy Business)",
    "£4,543.85",
  ],
  [
    "6. Kirsty Blackman (SNP, Aberdeen North)",
    "31 May 2024",
    "Office Costs (Office Electricity 2022/23, EON)",
    "£4,506.93",
  ],
];

export default function KilmarnockMp23437ElectricityBill() {
  return (
    <Prose>
      <Lead>
        While pensioners and working families across Kilmarnock and East Ayrshire are applying for
        a £150 Warm Home Discount just to take the edge off winter heating bills, IPSA quietly paid
        £23,436.95 of taxpayers&apos; money to an energy firm in a single day for Kilmarnock and
        Loudoun MP Lillian Jones.
      </Lead>

      <P>
        We checked more than 350,000 individual expense lines filed by all 650 UK MPs across five
        IPSA financial years (2022/23 to 2026/27). The £20,384.74 electricity payment logged under{" "}
        <Link href={mp("kilmarnock-and-loudoun")}>Lillian Jones</Link> on 19 May 2026, alongside a
        second £3,052.21 payout to the exact same supplier and account number on the exact same
        day, is the <strong>largest electricity payout for any MP in the entire United Kingdom</strong>.
      </P>

      <BigStat
        value="£23,437"
        label="Paid by IPSA to Yu Energy on a single day (19 May 2026) on account 2000294348 for Kilmarnock and Loudoun MP Lillian Jones."
        exact="£20,384.74 filed under Miscellaneous (2025/26) plus £3,052.21 under Other Costs (2026/27). Paid in full. £0 repaid."
      />

      <H2 id="the-receipts">1. What the official IPSA ledger shows</H2>
      <P>
        Lillian Jones was elected as the Scottish Labour MP for Kilmarnock and Loudoun in July
        2024. Her constituency office sits on Portland Street in Kilmarnock.
      </P>
      <P>
        In May 2025, her office billed taxpayers £1,074.15 to Clear Business for five winter months
        of electricity (November 2024 to March 2025), working out at about £215 a month. Her London
        flat electricity claims with Octopus Energy sat between £21.57 and £85.01 a month.
      </P>
      <P>
        Then, on <strong>19 May 2026</strong>, IPSA recorded two enormous electricity payments on
        the exact same day to commercial energy supplier <strong>Yu Energy</strong>, both quoting
        the exact same account reference (<code>2000294348</code>):
      </P>

      <div className="my-7">
        <GuideTable
          kicker="IPSA Official Records · 19 May 2026"
          title="The two Yu Energy electricity payouts logged on the same day"
          columns={["Date", "IPSA year", "Budget pot", "IPSA wording", "Amount paid"]}
          align={["left", "left", "left", "left", "right"]}
          rows={LILLIAN_ROWS}
          caption="Source: IPSA individualBusinessCosts CSV files for 2025/26 (claim 200013554-0-C) and 2026/27 (claim 200013554-0). Both marked Paid, with £0.00 repaid."
        />
      </div>

      <P>
        Put that next to the rest of her own expense ledger and the numbers jump straight off the
        page. Taxpayers paid <strong>£6,587 more</strong> to Yu Energy on one day than it cost to
        rent her entire Kilmarnock constituency office for a full year (£16,850.04).
      </P>

      <div className="my-7">
        <GuideTable
          kicker="Putting £23,437 in perspective"
          title="One day's electricity payout vs her own normal bills and rent"
          columns={["Item from Lillian Jones's IPSA ledger", "Cost"]}
          align={["left", "right"]}
          rows={SCALE_ROWS}
          caption="Source: IPSA 2024/25, 2025/26 and 2026/27 individual claims for Lillian Jones MP."
        />
      </div>

      <H2 id="uk-number-one">2. Number one out of all 650 UK MPs over five years</H2>
      <P>
        To check whether huge commercial catch up bills like this happen routinely to MPs, we
        scanned every single utility claim across all five years of IPSA data for the whole UK
        Parliament (all 650 seats in England, Scotland, Wales and Northern Ireland).
      </P>
      <P>
        Nothing else in Britain comes close. Even taking the £20,384.74 line on its own, it is more
        than <strong>three and a half times bigger</strong> than the next largest electricity claim
        by any MP in the UK over five years. Taking both same day Yu Energy payouts together
        (£23,436.95), it is more than <strong>four times bigger</strong>.
      </P>

      <div className="my-7">
        <GuideTable
          kicker="All 650 UK MPs · 2022/23 to 2026/27"
          title="Largest single electricity claims across the entire UK Parliament"
          columns={["MP", "Date", "IPSA category & detail", "Paid by taxpayers"]}
          align={["left", "left", "left", "right"]}
          rows={UK_TOP_ELECTRICITY}
          caption="Source: All five IPSA individualBusinessCosts CSV files (2022/23 to 2026/27), filtered to Electricity claims across all 650 UK constituencies."
        />
      </div>

      <H2 id="warm-home-contrast">3. 156 Warm Home Discounts, and her Winter Fuel vote</H2>
      <P>
        In East Ayrshire and across Scotland, households on low incomes and pensions have spent the
        last two winters applying for the{" "}
        <Link href="/warm-home-discount-scotland">£150 Warm Home Discount</Link> to help keep the
        heating on. At £150 a household, £23,436.95 paid out on one day equals{" "}
        <strong>156 Warm Home Discounts</strong>.
      </P>
      <P>
        That contrast hits even harder when you look at the parliamentary voting record. On{" "}
        <strong>10 September 2024</strong> (House of Commons Divisions 14 and 15), Lillian Jones
        voted with the Labour government against motions to block its restriction of the Winter
        Fuel Payment, which removed up to £300 of winter heating support from millions of
        pensioners.
      </P>

      <H2 id="how-ipsa-paid-it">4. How IPSA paid it outside her Office Costs budget</H2>
      <P>
        Look closely at the budget columns in IPSA&apos;s spreadsheet and another detail jumps out.
        Normal electricity bills for an MP&apos;s office come out of their capped{" "}
        <strong>Office Costs</strong> budget.
      </P>
      <P>
        A £23,437 electricity bill would have blown a massive hole straight through a normal office
        budget. Instead, IPSA logged the £20,384.74 payout under <strong>Miscellaneous</strong>{" "}
        (2025/26) and the £3,052.21 payout under <strong>Other Costs</strong> (2026/27), using
        IPSA direct payout claim references (<code>200013554</code>). That means IPSA paid Yu
        Energy directly from central contingency funds, keeping the bill out of her standard Office
        Costs total.
      </P>
      <P>
        To be completely fair, there are plausible commercial reasons a business electricity bill
        can balloon like this. Yu Energy is a business supplier whose out of contract deemed rates
        on commercial high street units can be punishing if a lease changes hands without a fixed
        tariff agreed, or if a previous tenant left meter readings unchallenged or an office ran
        heavy electric heating through a Scottish winter on a variable rate.
      </P>
      <P>
        Even if that is what happened, it still leaves four obvious questions for Lillian Jones and
        IPSA that the public record does not answer:
      </P>
      <UL>
        <LI>
          <strong>Which exact building and dates did the £23,436.95 cover?</strong> IPSA&apos;s
          published entry gives an account number and nothing else.
        </LI>
        <LI>
          <strong>How did an office paying £215 a month to Clear Business end up owing £23,436.95 to
          Yu Energy?</strong> Was the office left on an out of contract commercial tariff, or was
          there a meter or landlord billing dispute?
        </LI>
        <LI>
          <strong>Did IPSA challenge the bill before paying £23,436.95 of public money?</strong>{" "}
          Why did taxpayers absorb a bill larger than a full year&apos;s office rent instead of the
          supplier or landlord resolving it?
        </LI>
        <LI>
          <strong>Will any of the £23,436.95 be recovered or repaid?</strong> As of IPSA&apos;s
          latest published ledger, £0.00 has been repaid.
        </LI>
      </UL>

      <Aside title="Part of a wider pattern across every Westminster party">
        <p>
          Lillian Jones is far from alone. Across Scotland&apos;s 57 MPs, we found{" "}
          <Link href="/blog/scottish-mps-tv-licence-expenses">
            29 MPs billing taxpayers £10,754 for TV licences
          </Link>
          , <Link href="/blog/worst-scottish-mp-expenses">£3,090 to set up 5G home broadband</Link>,
          £24,530 on one MP&apos;s EE mobile bills, and £37,359 on one MP&apos;s London hotel stays.
          You can browse <Link href="/mp-expenses-scotland/receipts">the strangest receipts</Link>{" "}
          or compare <Link href="/mp-expenses-scotland">all 57 Scottish MPs ranked</Link>.
        </p>
      </Aside>

      <PostCTA
        title="Inspect both Yu Energy receipts (or check your own MP by postcode)"
        body="Open our live Receipt Finder pre-filtered to Yu Energy, copy the exact IPSA receipt for X or WhatsApp, or email Lillian Jones directly."
        href="/mp-expenses-scotland/search?q=Yu%20Energy"
        cta="See the Yu Energy receipts →"
      />
    </Prose>
  );
}
