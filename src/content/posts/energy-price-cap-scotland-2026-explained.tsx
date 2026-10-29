import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { pounds } from "@/lib/data/quickAnswers";

/**
 * Ofgem energy price cap, 1 October to 31 December 2026, checked against
 * Ofgem on 29 October 2026: the cap levels letter of 26 August 2026, the
 * press release and the regional tables on the unit rates page. Unit rates in
 * pence per kWh, standing charges in pence a day. Electricity carries no VAT
 * from 1 October 2026 to 31 March 2027; gas includes 5% VAT.
 */
const CAP = {
  levels: [
    { label: "Direct Debit", july: 1663, october: 1723 },
    { label: "Paying when the bill arrives", july: 1796, october: 1861 },
    { label: "Prepayment meter", july: 1620, october: 1678 },
    { label: "Economy 7, Direct Debit", july: 1039, october: 1046 },
  ],
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
    places: "Aberdeen, Inverness, the Highlands and islands",
    dd: { elecUnit: 26.35, elecStanding: 55.14, gasUnit: 7.87, gasStanding: 29.87 },
    credit: { elecUnit: 27.83, elecStanding: 63.67 },
    prepay: { elecUnit: 25.54, elecStanding: 55.14 },
  },
  {
    name: "South Scotland",
    places: "Glasgow, Edinburgh and the south",
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

  return (
    <Prose>
      <Lead>
        From 1 October to 31 December 2026, the energy price cap is {pounds(dd.october)} a year for
        a typical home in Scotland paying for gas and electricity by Direct Debit. That is 4%, or
        about {pounds(rise)} a year, more than in the summer. Ofgem, the energy regulator, sets
        slightly different rates for the north and south of Scotland, and a home can still pay much
        more or much less.
      </Lead>

      <H2 id="current-cap">Energy price cap October to December 2026</H2>
      <P>
        The cap depends on how you pay. These are Ofgem&apos;s yearly figures for a typical home
        using {CAP.usage.electricity.toLocaleString("en-GB")} kWh of electricity and{" "}
        {CAP.usage.gas.toLocaleString("en-GB")} kWh of gas.
      </P>
      <GuideTable
        kicker="Ofgem energy price cap"
        title="Typical yearly bill by payment method"
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
        less electricity and 17% less gas, which makes the headline figure smaller without changing
        any rate. On the old measure the summer cap was {pounds(CAP.oldBasis.july)}, up 13% from{" "}
        {pounds(CAP.oldBasis.spring)} in the spring, and the October cap would be{" "}
        {pounds(CAP.oldBasis.october)}.
      </P>

      <H2 id="scotland-rates">Energy price cap Scotland: North and South Scotland rates</H2>
      <P>
        Ofgem splits Scotland into two regions. {south.name} covers {south.places}.{" "}
        {north.name} covers {north.places}. Ofgem has a postcode checker on its website if you are
        not sure which you are in.
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
        {pounds(dd.october)} for Great Britain as a whole. That is my sum from the published rates.
      </P>
      <P>
        The bigger difference is the electricity standing charge. South Scotland pays{" "}
        {p(south.dd.elecStanding)} a day, against a {p(CAP.october.elecStanding)} average. That is
        about {pounds(perYear(south.dd.elecStanding))} a year before you use any electricity at all.
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
        caption="Ofgem regional tables. Your own supplier can charge less than the cap, but not more, on a default tariff."
      />

      <H2 id="not-a-bill-cap">Why it is not a cap on the bill</H2>
      <P>
        Ofgem limits the unit rate for each kilowatt hour and the daily standing charge on a
        default tariff. The {pounds(dd.october)} figure applies those rates to an assumed amount of
        gas and electricity. It is a comparison tool, not a maximum invoice.
      </P>
      <UL>
        <LI>Use more energy and the bill can be higher than {pounds(dd.october)}.</LI>
        <LI>Use less and it can be lower.</LI>
        <LI>A fixed tariff follows the contract rate instead of changing with this cap period.</LI>
      </UL>

      <H2 id="rates">Price cap per kWh: the unit rates</H2>
      <BigStat
        value={p(CAP.october.elecUnit)}
        label="average price cap for a kWh of electricity, Direct Debit, October to December 2026"
        exact={`Gas is ${p(CAP.october.gasUnit)} a kWh. From July to September the averages were ${p(CAP.july.elecUnit)} for electricity and ${p(CAP.july.gasUnit)} for gas.`}
      />
      <P>
        These are Great Britain averages. Actual regional rates differ, as the Scottish tables
        above show, and prepayment or paying when the bill arrives produces different numbers.
      </P>

      <H2 id="standing">The standing charge</H2>
      <P>
        A standing charge is paid for each day the supply is connected, even if almost no energy
        is used. The October 2026 averages are {p(CAP.october.elecStanding)} a day for electricity
        and {p(CAP.october.gasStanding)} for gas. That is roughly{" "}
        {pounds(perYear(CAP.october.elecStanding + CAP.october.gasStanding))} a year before buying a
        unit of energy. In July it was {p(CAP.july.elecStanding)} and {p(CAP.july.gasStanding)}, or
        roughly {pounds(perYear(CAP.july.elecStanding + CAP.july.gasStanding))} a year.
      </P>
      <Aside title="Why turning everything off cannot make the bill zero">
        <p>
          Cutting use reduces the unit part. It does not remove the standing charge. That matters
          most to a low use household because the fixed daily amount takes a larger share of the
          bill.
        </p>
      </Aside>

      <H2 id="vat">No VAT on electricity until March 2027</H2>
      <P>
        The UK Government has cut VAT on household electricity from 5% to zero from 1 October 2026
        to 31 March 2027. Gas still carries 5% VAT. Ofgem says the cap would have been about £45 a
        year higher without the cut, and that gas bills went up about 8% this time while electricity
        stayed broadly the same.
      </P>
      <P>
        Homes that heat with electricity rather than gas get the most from the VAT cut. It also
        means October&apos;s rates cannot be compared exactly with earlier ones.
      </P>

      <H2 id="january-2027">Energy price cap January 2027</H2>
      <P>
        Ofgem sets a new cap every three months. The next one covers 1 January to 31 March 2027.
        Ofgem published the July cap on 27 May and the October cap on 26 August, so the January
        figure is expected in late November 2026. Until then, any January figure you see is a
        forecast by a consultancy, not the cap.
      </P>
      <P>
        Ofgem says some fixed deals were available at £100 or more below the October cap. If you
        compare a fix, check the exit fees, the length of the deal and the unit rates and standing
        charges in your region, not only the headline yearly figure.
      </P>

      <H2 id="who">Who the cap covers</H2>
      <P>
        The cap covers domestic default tariffs in Scotland, England and Wales. It does not set the
        price of heating oil, bottled gas or communal heat networks. A fixed deal is also governed
        by its contract while it lasts.
      </P>
      <P>
        Check the tariff name, payment method, unit rates and standing charges on the bill. Do not
        compare only the monthly Direct Debit: suppliers can change that payment to catch up with
        debt or build credit even when the tariff rates stay the same.
      </P>

      <H2 id="help">If you cannot afford energy</H2>
      <UL>
        <LI>Contact the supplier early and ask for an affordable repayment plan.</LI>
        <LI>Ask whether grants, hardship funds or the Warm Home Discount apply.</LI>
        <LI>Give meter readings so estimates do not hide the real position.</LI>
        <LI>
          Check the Scottish winter payments: the{" "}
          <Link href="/winter-heating-payment">Winter Heating Payment</Link> for people on some
          low income benefits, and the{" "}
          <Link href="/winter-fuel-payment-scotland">winter fuel payment in Scotland</Link> for
          pension age households.
        </LI>
        <LI>
          In an immediate emergency, check the <Link href="/crisis-grant-scotland">Scottish Crisis Grant</Link>{" "}
          or call your council using the <Link href="/crisis-grant-phone-number">Crisis Grant phone numbers</Link>.
        </LI>
      </UL>
      <P>
        Lower inflation does not undo the price rises already built into energy, food and rent.
        Read <Link href="/blog/why-food-prices-stay-high-when-inflation-falls">why prices stay high
        when inflation falls</Link>.
      </P>

      <PostCTA
        title="Energy rules are set at Westminster"
        body="Ofgem and UK energy policy sit with your MP. Enter your postcode and I find the right person, add the facts and prepare the email."
        href="/email-your-mp-and-msp"
        cta="Email my MP"
      />
    </Prose>
  );
}
