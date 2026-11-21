import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { pounds } from "@/lib/data/quickAnswers";

/**
 * Ofgem energy price cap, 1 October to 31 December 2026, checked against
 * Ofgem on 21 November 2026: the cap levels letter of 26 August 2026, the
 * press release and the regional tables on the unit rates page. Unit rates in
 * pence per kWh, standing charges in pence a day. Electricity carries no VAT
 * from 1 October 2026 to 31 March 2027; gas includes 5% VAT.
 *
 * Also covers Cornwall Insight's final November 2026 forecast for the
 * 1 January to 31 March 2027 cap ahead of Ofgem's official announcement on
 * Wednesday 25 November 2026.
 */
const CAP = {
  levels: [
    { label: "Direct Debit", july: 1663, october: 1723 },
    { label: "Paying when the bill arrives", july: 1796, october: 1861 },
    { label: "Prepayment meter", july: 1620, october: 1678 },
    { label: "Economy 7, Direct Debit", july: 1039, october: 1046 },
  ],
  /** Cornwall Insight final November 2026 forecast for 1 Jan to 31 Mar 2027. */
  januaryForecast: {
    typicalDirectDebit: 2166,
    riseCash: 443,
    risePct: 26,
    elecUnit: 32.54,
    elecStanding: 56,
    gasUnit: 10.9,
    gasStanding: 31,
  },
  /** Typical Direct Debit bill on Ofgem's old (2023) typical use. */
  oldBasis: { spring: 1641, july: 1862, october: 1935 },
  /** Ofgem's typical use from July 2026, kWh a year. */
  usage: { electricity: 2500, gas: 9500, economy7: 3400 },
  july: { elecUnit: 26.11, elecStanding: 57.19, gasUnit: 7.33, gasStanding: 29.04 },
  october: { elecUnit: 26.32, elecStanding: 54.83, gasUnit: 7.97, gasStanding: 29.68 },
};

type Rates = { elecUnit: number; elecStanding: number; gasUnit: number; gasStanding: number };

const REGIONS: { name: string; places: string; dd: Rates; credit: { elecUnit: number; elecStanding: number }; prepay: { elecUnit: number; elecStanding: number } }[] = [
  {
    name: "North Scotland",
    places: "Aberdeen, Inverness, Dundee, Perth, the Highlands and islands",
    dd: { elecUnit: 26.35, elecStanding: 55.14, gasUnit: 7.87, gasStanding: 29.87 },
    credit: { elecUnit: 27.83, elecStanding: 63.67 },
    prepay: { elecUnit: 25.54, elecStanding: 55.14 },
  },
  {
    name: "South Scotland",
    places: "Glasgow, Edinburgh, Fife, Lanarkshire, Ayrshire and the Borders",
    dd: { elecUnit: 26.11, elecStanding: 61.41, gasUnit: 7.87, gasStanding: 29.89 },
    credit: { elecUnit: 27.58, elecStanding: 70.19 },
    prepay: { elecUnit: 25.31, elecStanding: 61.41 },
  },
];

const p = (pence: number) => `${pence.toFixed(2)}p`;
const perYear = (pencePerDay: number) => (pencePerDay * 365) / 100;
const typicalBill = (r: Rates) =>
  (CAP.usage.electricity * r.elecUnit + CAP.usage.gas * r.gasUnit) / 100 + perYear(r.elecStanding + r.gasStanding);

export default function Post() {
  const dd = CAP.levels[0];
  const rise = dd.october - dd.july;
  const [north, south] = REGIONS;
  const jan = CAP.januaryForecast;

  return (
    <Prose>
      <Lead>
        From 1 October to 31 December 2026, the Ofgem energy price cap is {pounds(dd.october)} a
        year for a typical home paying for gas and electricity by Direct Debit. That works out at
        about {pounds(typicalBill(north.dd))} in North Scotland and {pounds(typicalBill(south.dd))}{" "}
        in South Scotland. On Wednesday 25 November 2026, Ofgem confirms the new cap for 1 January
        to 31 March 2027, and Cornwall Insight&apos;s final forecast warns it will jump by{" "}
        {jan.risePct}% ({pounds(jan.riseCash)} a year) to {pounds(jan.typicalDirectDebit)}.
      </Lead>

      <H2 id="january-2027">Energy price cap January 2027: the +26% forecast</H2>
      <P>
        Ofgem sets a new price cap every three months. The next one covers the coldest quarter of
        the year, from 1 January to 31 March 2027, and Ofgem publishes the confirmed rates on
        Wednesday 25 November 2026.
      </P>
      <P>
        Ahead of that announcement, energy consultancy Cornwall Insight has published its final
        forecast. Because Ofgem works out the cap from wholesale energy prices over an assessment
        window that has now closed, Cornwall Insight&apos;s final forecast is normally within a few
        pounds of the official number.
      </P>
      <GuideTable
        kicker="1 January to 31 March 2027 · Final forecast"
        title="October 2026 cap vs January 2027 forecast (Direct Debit)"
        columns={["Measure", "Oct to Dec 2026 (confirmed)", "Jan to Mar 2027 (forecast)", "Expected change"]}
        align={["left", "right", "right", "right"]}
        rows={[
          ["Typical yearly dual fuel bill", pounds(dd.october), pounds(jan.typicalDirectDebit), `+${pounds(jan.riseCash)} (+${jan.risePct}%)`],
          ["Electricity unit rate (per kWh)", p(CAP.october.elecUnit), p(jan.elecUnit), `+${p(jan.elecUnit - CAP.october.elecUnit)}`],
          ["Electricity standing charge (per day)", p(CAP.october.elecStanding), `~${jan.elecStanding}p`, "Broadly flat"],
          ["Gas unit rate (per kWh)", p(CAP.october.gasUnit), p(jan.gasUnit), `+${p(jan.gasUnit - CAP.october.gasUnit)}`],
          ["Gas standing charge (per day)", p(CAP.october.gasStanding), `~${jan.gasStanding}p`, "Broadly flat"],
        ]}
        caption="Confirmed October 2026 Great Britain average rates from Ofgem; January 2027 forecast figures from Cornwall Insight's final November 2026 release."
      />
      <P>
        If Ofgem confirms a {pounds(jan.typicalDirectDebit)} cap on 25 November, household bills
        will sit at their highest level since early 2023. The jump comes down to wholesale gas and
        electricity prices climbing through the autumn after supply disruption in the Middle East
        and lower European gas storage heading into winter.
      </P>
      <Aside title="What to do before 1 January 2027">
        <p>
          Take a meter reading just before 1 January 2027 if you do not have a working smart meter,
          so none of your December use is billed at the higher January unit rates. If you are on a
          low income or Pension Credit, check the{" "}
          <Link href="/warm-home-discount-scotland">£150 Warm Home Discount in Scotland</Link> right
          away while supplier application windows are still open.
        </p>
      </Aside>

      <H2 id="current-cap">Energy price cap October to December 2026</H2>
      <P>
        Until 31 December 2026, your rates are governed by the autumn cap. What you pay depends on
        how you pay your bill. These are Ofgem&apos;s yearly figures for a typical home using{" "}
        {CAP.usage.electricity.toLocaleString("en-GB")} kWh of electricity and{" "}
        {CAP.usage.gas.toLocaleString("en-GB")} kWh of gas.
      </P>
      <GuideTable
        kicker="Ofgem energy price cap"
        title="Typical yearly bill by payment method (Oct to Dec 2026)"
        columns={["How you pay", "July to September 2026", "October to December 2026", "Change"]}
        align={["left", "right", "right", "right"]}
        rows={CAP.levels.map((level) => [
          level.label,
          pounds(level.july),
          pounds(level.october),
          `${Math.round(((level.october - level.july) / level.july) * 100)}% higher`,
        ])}
        caption={`Ofgem figures, rounded to the nearest pound. Economy 7 assumes ${CAP.usage.economy7.toLocaleString("en-GB")} kWh of electricity a year.`}
      />
      <P>
        You may have seen {pounds(CAP.oldBasis.july)} quoted for the summer. That was the same cap
        measured on Ofgem&apos;s older idea of typical use. From July 2026 Ofgem assumes about 7%
        less electricity and 17% less gas, which makes the headline figure look smaller without
        changing a single unit rate. On the older measure the summer cap was{" "}
        {pounds(CAP.oldBasis.july)}, up 13% from {pounds(CAP.oldBasis.spring)} in the spring, and
        the October to December cap would be {pounds(CAP.oldBasis.october)} ({pounds(rise)} higher
        than summer on the new measure).
      </P>

      <H2 id="scotland-rates">Energy price cap Scotland: North and South Scotland rates</H2>
      <P>
        Ofgem splits Scotland into two electricity distribution regions. {south.name} covers{" "}
        {south.places}. {north.name} covers {north.places}.
      </P>
      <GuideTable
        kicker="Direct Debit, 1 October to 31 December 2026"
        title="Energy price cap rates in Scotland"
        columns={["Region", "Electricity per kWh", "Electricity per day", "Gas per kWh", "Gas per day"]}
        align={["left", "right", "right", "right", "right"]}
        rows={[
          ...REGIONS.map((r) => [r.name, p(r.dd.elecUnit), p(r.dd.elecStanding), p(r.dd.gasUnit), p(r.dd.gasStanding)]),
          ["Great Britain average", p(CAP.october.elecUnit), p(CAP.october.elecStanding), p(CAP.october.gasUnit), p(CAP.october.gasStanding)],
        ]}
        caption="Ofgem regional tables. Single rate electricity. Gas prices include 5% VAT; electricity has no VAT in this period."
      />
      <P>
        At Ofgem&apos;s typical use, those rates work out at about {pounds(typicalBill(north.dd))} a
        year in North Scotland and {pounds(typicalBill(south.dd))} in South Scotland, against{" "}
        {pounds(dd.october)} for Great Britain as a whole.
      </P>
      <P>
        The big regional difference is the electricity standing charge. South Scotland pays{" "}
        {p(south.dd.elecStanding)} a day, against a {p(CAP.october.elecStanding)} Great Britain
        average. That is about {pounds(perYear(south.dd.elecStanding))} a year before you switch a
        kettle on.
      </P>
      <GuideTable
        kicker="Single rate electricity, 1 October to 31 December 2026"
        title="Electricity rates in Scotland by how you pay"
        columns={["Region and charge", "Direct Debit", "Paying on the bill", "Prepayment"]}
        align={["left", "right", "right", "right"]}
        rows={REGIONS.flatMap((r) => [
          [`${r.name}, per kWh`, p(r.dd.elecUnit), p(r.credit.elecUnit), p(r.prepay.elecUnit)],
          [`${r.name}, per day`, p(r.dd.elecStanding), p(r.credit.elecStanding), p(r.prepay.elecStanding)],
        ])}
        caption="Ofgem regional tables. Your supplier can charge less than the cap, never more, on a default variable tariff."
      />

      <H2 id="not-a-bill-cap">Why it is not a cap on the bill</H2>
      <P>
        Ofgem caps the unit rate for each kilowatt hour and the daily standing charge on a default
        tariff. The {pounds(dd.october)} and {pounds(jan.typicalDirectDebit)} figures apply those
        rates to an assumed amount of gas and electricity. It is a yardstick for comparison, not a
        maximum bill.
      </P>
      <UL>
        <LI>
          Use more energy in a cold Scottish winter and your bill will be higher than{" "}
          {pounds(dd.october)} or {pounds(jan.typicalDirectDebit)}.
        </LI>
        <LI>Use less and it will be lower.</LI>
        <LI>A fixed tariff follows your contract rate rather than moving with the quarterly cap.</LI>
      </UL>

      <H2 id="rates">Price cap per kWh: the unit rates</H2>
      <BigStat
        value={p(CAP.october.elecUnit)}
        label="average price cap for a kWh of electricity, Direct Debit, October to December 2026"
        exact={`Gas is ${p(CAP.october.gasUnit)} a kWh now, and forecast by Cornwall Insight to reach ${p(jan.gasUnit)} a kWh in January 2027 while electricity is forecast to reach ${p(jan.elecUnit)} a kWh.`}
      />
      <P>
        These are Great Britain averages. Actual regional rates differ, as the North and South
        Scotland tables above show, and paying when the bill arrives costs more per unit than Direct
        Debit or prepayment.
      </P>

      <H2 id="standing">The standing charge</H2>
      <P>
        A standing charge is paid for every day the supply is connected, even if no energy is used.
        The October to December 2026 Great Britain averages are {p(CAP.october.elecStanding)} a day
        for electricity and {p(CAP.october.gasStanding)} for gas. That adds up to roughly{" "}
        {pounds(perYear(CAP.october.elecStanding + CAP.october.gasStanding))} a year before buying a
        single unit of energy.
      </P>
      <Aside title="Why turning everything off cannot make the bill zero">
        <p>
          Cutting use reduces the unit part of the bill. It does not remove the standing charge.
          That hits low use households hardest because the fixed daily fee takes up a much bigger
          share of the total bill.
        </p>
      </Aside>

      <H2 id="vat">No VAT on electricity until 2027</H2>
      <P>
        The UK Government cut VAT on household electricity from 5% to zero starting 1 October 2026.
        Gas still carries 5% VAT. Ofgem says the autumn cap would have been about £45 a year higher
        without the electricity VAT cut, and Cornwall Insight&apos;s {pounds(jan.typicalDirectDebit)}{" "}
        January 2027 forecast already includes zero VAT on electricity.
      </P>
      <P>
        Scottish homes in rural and island areas that heat with electricity rather than mains gas
        get the biggest cushion from the electricity VAT removal, though a jump to{" "}
        {p(jan.elecUnit)} per kWh in January will still hit electric heating hard.
      </P>

      <H2 id="who">Who the cap covers</H2>
      <P>
        The cap covers domestic default (standard variable) tariffs in Scotland, England and Wales.
        It does not cap heating oil, LPG, bottled gas or communal heat networks, and a fixed tariff
        is governed by its contract while the fix lasts.
      </P>
      <P>
        Check the tariff name, payment method, unit rates and standing charges on your bill. Do not
        judge a tariff only by the monthly Direct Debit amount: suppliers frequently adjust that
        monthly payment to clear arrears or build winter credit even when the tariff rates have not
        changed.
      </P>

      <H2 id="help">Help with energy bills in Scotland this winter</H2>
      <P>
        With temperatures already dropping below minus 8 degrees Celsius in the Highlands and a 26%
        price cap rise forecast for January, check every Scottish and UK scheme you qualify for:
      </P>
      <UL>
        <LI>
          <strong>£150 off your electricity bill:</strong> Check the{" "}
          <Link href="/warm-home-discount-scotland">Warm Home Discount in Scotland</Link>. It is
          automatic for the expanded Core Group (including Pension Credit and certain disability or
          child under 5 elements), while other low income households in Scotland&apos;s Broader
          Group must apply straight to their supplier before funds run out.
        </LI>
        <LI>
          <strong>£100 for council tax bands A to D:</strong> Check the{" "}
          <Link href="/100-energy-payment-scotland">£100 energy payment in Scotland</Link> and look
          for rollout confirmation in the{" "}
          <Link href="/scottish-budget-2027-28">Scottish Budget on 3 December 2026</Link>.
        </LI>
        <LI>
          <strong>Scottish winter heating benefits:</strong> Check the{" "}
          <Link href="/winter-heating-payment">Winter Heating Payment</Link> (£59.75 automatic
          payment for people on qualifying low income benefits) and the{" "}
          <Link href="/winter-fuel-payment-scotland">Pension Age Winter Heating Payment</Link> for
          pensioners.
        </LI>
        <LI>
          <strong>Cut your council tax bill at the same time:</strong> Check{" "}
          <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link>, the{" "}
          <Link href="/single-person-discount-council-tax-scotland">25% single person discount</Link>,
          and your council&apos;s bands on{" "}
          <Link href="/council-tax-bands-scotland">council tax bands Scotland</Link>.
        </LI>
        <LI>
          <strong>Emergency cash help:</strong> If you are close to running out of credit on a
          prepayment meter or cannot afford to heat your home today, apply for a{" "}
          <Link href="/crisis-grant-scotland">Scottish Crisis Grant</Link> or phone your council on
          the <Link href="/crisis-grant-phone-number">32 council Crisis Grant phone numbers</Link>.
        </LI>
      </UL>
      <P>
        Lower headline inflation does not undo the price rises already baked into energy, food and
        rent. Read <Link href="/blog/why-food-prices-stay-high-when-inflation-falls">why prices stay
        high when inflation falls</Link> and our overview of the{" "}
        <Link href="/cost-of-living-scotland">cost of living in Scotland</Link>.
      </P>

      <PostCTA
        title="Energy rules are set at Westminster"
        body="Ofgem and UK energy policy sit with your MP, while winter benefits and council tax sit with your MSPs. Enter your postcode and we find the right person and prepare the email."
        href="/email-your-mp-and-msp"
        cta="Email my MP or MSP"
      />
    </Prose>
  );
}
