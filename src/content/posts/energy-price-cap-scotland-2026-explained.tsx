import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { pounds } from "@/lib/data/quickAnswers";

/**
 * Ofgem energy price cap, 1 January to 31 March 2027, confirmed by Ofgem on
 * 25 November 2026 and checked that day against the press release, the
 * summary of changes letter and the regional tables on the unit rates page.
 * The October to December 2026 figures come from the same regional tables
 * and the 26 August 2026 letter. Unit rates in pence per kWh, standing
 * charges in pence a day. Electricity carries no VAT from 1 October 2026 to
 * 30 June 2027; gas includes 5% VAT.
 */
const OFGEM = {
  press: "https://www.ofgem.gov.uk/press-release/energy-price-cap-rise-26-january-2027",
  news: "https://www.ofgem.gov.uk/news/changes-energy-price-cap-between-1-january-and-31-march-2027",
  rates: "https://www.ofgem.gov.uk/your-energy-supply/your-energy-bill/energy-price-cap-unit-rates-and-standing-charges",
  summary:
    "https://www.ofgem.gov.uk/sites/default/files/2026-11/summary-of-changes-to-energy-price-cap-1-January-to-31-March-2027.pdf",
};

const CAP = {
  levels: [
    { label: "Direct Debit", october: 1723, january: 2166 },
    { label: "Paying when the bill arrives", october: 1861, january: 2328 },
    { label: "Prepayment meter", october: 1678, january: 2108 },
    { label: "Economy 7, Direct Debit", october: 1046, january: 1265 },
  ],
  risePct: 26,
  gasRisePct: 33,
  elecRisePct: 19,
  /** Typical Direct Debit bill on Ofgem's old (2023) typical use. */
  oldBasis: { october: 1935, january: 2451 },
  /** Ofgem's typical use from July 2026, kWh a year. */
  usage: { electricity: 2500, gas: 9500, economy7: 3400 },
  october: { elecUnit: 26.32, elecStanding: 54.83, gasUnit: 7.97, gasStanding: 29.68 },
  january: { elecUnit: 32.69, elecStanding: 54.77, gasUnit: 10.96, gasStanding: 29.65 },
  /** Ofgem: switching from paying on the bill to Direct Debit saves about this a year. */
  directDebitSaving: 160,
  nextAnnouncement: "23 February 2027",
};

type Rates = { elecUnit: number; elecStanding: number; gasUnit: number; gasStanding: number };
type Elec = { elecUnit: number; elecStanding: number };

const REGIONS: {
  name: string;
  places: string;
  october: Rates;
  january: Rates;
  credit: Elec;
  prepay: Elec;
}[] = [
  {
    name: "North Scotland",
    places: "Aberdeen, Inverness, Dundee, Perth, the Highlands and islands",
    october: { elecUnit: 26.35, elecStanding: 55.14, gasUnit: 7.87, gasStanding: 29.87 },
    january: { elecUnit: 32.4, elecStanding: 55.07, gasUnit: 10.86, gasStanding: 29.84 },
    credit: { elecUnit: 34.21, elecStanding: 63.55 },
    prepay: { elecUnit: 31.41, elecStanding: 55.07 },
  },
  {
    name: "South Scotland",
    places: "Glasgow, Edinburgh, Fife, Lanarkshire, Ayrshire and the Borders",
    october: { elecUnit: 26.11, elecStanding: 61.41, gasUnit: 7.87, gasStanding: 29.89 },
    january: { elecUnit: 32.57, elecStanding: 61.33, gasUnit: 10.86, gasStanding: 29.86 },
    credit: { elecUnit: 34.39, elecStanding: 70.06 },
    prepay: { elecUnit: 31.58, elecStanding: 61.33 },
  },
];

const p = (pence: number) => `${pence.toFixed(2)}p`;
const perYear = (pencePerDay: number) => (pencePerDay * 365) / 100;
const typicalBill = (r: Rates) =>
  (CAP.usage.electricity * r.elecUnit + CAP.usage.gas * r.gasUnit) / 100 + perYear(r.elecStanding + r.gasStanding);

function Ofgem({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Post() {
  const dd = CAP.levels[0];
  const rise = dd.january - dd.october;
  const [north, south] = REGIONS;
  const bills = REGIONS.map((r) => {
    const before = typicalBill(r.october);
    const after = typicalBill(r.january);
    return { r, before, after, year: after - before, month: (after - before) / 12 };
  });
  const [n, s] = bills;

  return (
    <Prose>
      <Lead>
        Ofgem has confirmed the energy price cap will rise by {CAP.risePct}% on 1 January 2027. A
        typical home paying for gas and electricity by Direct Debit goes from {pounds(dd.october)}{" "}
        to {pounds(dd.january)} a year. In Scotland that is about {pounds(n.after)} in North
        Scotland, up {pounds(n.year)}, and {pounds(s.after)} in South Scotland, up {pounds(s.year)}.
        That is about {pounds(n.month)} to {pounds(s.month)} more every month.
      </Lead>
      <P>
        Want to know what those rates mean in your home? Use the{" "}
        <Link href="/electricity-cost-calculator-scotland">electricity cost calculator</Link> to
        price a wash, an evening with the lights on or a week of electric showers.
      </P>

      <H2 id="january-2027">Energy price cap January 2027: confirmed 26% rise</H2>
      <P>
        Ofgem{" "}
        <Ofgem href={OFGEM.press}>announced the new cap on 25 November 2026</Ofgem>. It runs from
        1 January to 31 March 2027, the coldest three months of the year. Ofgem says the rise is
        down to the conflict in the Middle East pushing up international gas prices. Gas bills go
        up {CAP.gasRisePct}% and electricity bills {CAP.elecRisePct}%.
      </P>
      <GuideTable
        kicker="Confirmed by Ofgem · 1 January to 31 March 2027"
        title="What changes on 1 January (Great Britain average, Direct Debit)"
        columns={["Measure", "Oct to Dec 2026", "Jan to Mar 2027", "Change"]}
        align={["left", "right", "right", "right"]}
        rows={[
          ["Typical yearly dual fuel bill", pounds(dd.october), pounds(dd.january), `+${pounds(rise)} (+${CAP.risePct}%)`],
          ["Electricity unit rate (per kWh)", p(CAP.october.elecUnit), p(CAP.january.elecUnit), `+${p(CAP.january.elecUnit - CAP.october.elecUnit)}`],
          ["Electricity standing charge (per day)", p(CAP.october.elecStanding), p(CAP.january.elecStanding), p(CAP.january.elecStanding - CAP.october.elecStanding)],
          ["Gas unit rate (per kWh)", p(CAP.october.gasUnit), p(CAP.january.gasUnit), `+${p(CAP.january.gasUnit - CAP.october.gasUnit)}`],
          ["Gas standing charge (per day)", p(CAP.october.gasStanding), p(CAP.january.gasStanding), p(CAP.january.gasStanding - CAP.october.gasStanding)],
        ]}
        caption="Ofgem unit rates and standing charges page, 25 November 2026. Gas includes 5% VAT; electricity has no VAT."
      />
      <P>
        Almost all of the rise is in the unit rates. Standing charges barely move. So the more gas
        and electricity your home uses, the harder this one hits.
      </P>
      <P>
        How you pay changes the figure too. These are{" "}
        <Ofgem href={OFGEM.summary}>Ofgem&apos;s yearly figures by payment method</Ofgem> for a
        typical home using {CAP.usage.electricity.toLocaleString("en-GB")} kWh of electricity and{" "}
        {CAP.usage.gas.toLocaleString("en-GB")} kWh of gas.
      </P>
      <GuideTable
        kicker="Ofgem energy price cap"
        title="Typical yearly bill by how you pay"
        columns={["How you pay", "Oct to Dec 2026", "Jan to Mar 2027", "Change"]}
        align={["left", "right", "right", "right"]}
        rows={CAP.levels.map((level) => [
          level.label,
          pounds(level.october),
          pounds(level.january),
          `+${pounds(level.january - level.october)} (${Math.round(((level.january - level.october) / level.october) * 100)}%)`,
        ])}
        caption={`Ofgem summary of changes, 25 November 2026, rounded to the nearest pound. Economy 7 assumes ${CAP.usage.economy7.toLocaleString("en-GB")} kWh of electricity a year.`}
      />
      <Aside title="What to do before 1 January 2027">
        <p>
          Take a meter reading on 31 December if you do not have a working smart meter, so none of
          your December use is billed at the higher January rates. If you pay when the bill
          arrives, Ofgem says moving to Direct Debit saves the average customer about{" "}
          {pounds(CAP.directDebitSaving)} a year. If you are already struggling, tell your supplier
          now. Ofgem says they must offer help, such as an affordable repayment plan.
        </p>
      </Aside>

      <H2 id="scotland-rates">Energy price cap Scotland: North and South Scotland rates</H2>
      <P>
        Ofgem splits Scotland into two electricity regions. {south.name} covers {south.places}.{" "}
        {north.name} covers {north.places}. These are the{" "}
        <Ofgem href={OFGEM.rates}>regional rates Ofgem published</Ofgem> for 1 January to 31 March
        2027.
      </P>
      <GuideTable
        kicker="Direct Debit, 1 January to 31 March 2027"
        title="Energy price cap rates in Scotland"
        columns={["Region", "Electricity per kWh", "Electricity per day", "Gas per kWh", "Gas per day"]}
        align={["left", "right", "right", "right", "right"]}
        rows={[
          ...REGIONS.map((r) => [r.name, p(r.january.elecUnit), p(r.january.elecStanding), p(r.january.gasUnit), p(r.january.gasStanding)]),
          ["Great Britain average", p(CAP.january.elecUnit), p(CAP.january.elecStanding), p(CAP.january.gasUnit), p(CAP.january.gasStanding)],
        ]}
        caption="Ofgem regional tables. Single rate electricity. Gas prices include 5% VAT; electricity has no VAT in this period."
      />
      <P>
        We applied those rates to Ofgem&apos;s typical use to see what they mean for a Scottish
        home on Direct Debit.
      </P>
      <GuideTable
        kicker="Typical dual fuel home, Direct Debit"
        title="What the rise means in pounds"
        columns={["Region", "Oct to Dec 2026", "Jan to Mar 2027", "Extra a year", "Extra a month"]}
        align={["left", "right", "right", "right", "right"]}
        rows={bills.map((b) => [
          b.r.name,
          `${pounds(b.before)} a year`,
          `${pounds(b.after)} a year`,
          `+${pounds(b.year)}`,
          `+${pounds(b.month)}`,
        ])}
        caption={`Our sums: each region's Ofgem rates applied to ${CAP.usage.electricity.toLocaleString("en-GB")} kWh of electricity, ${CAP.usage.gas.toLocaleString("en-GB")} kWh of gas and 365 days of standing charges. Yearly figures assume the January rates last a full year.`}
      />
      <P>
        Monthly, that is about {pounds(n.after / 12)} in North Scotland and {pounds(s.after / 12)}{" "}
        in South Scotland, against around {pounds(s.before / 12)} now. Most homes use far more
        energy in January than in summer, so winter bills will run well above that average.
      </P>
      <P>
        The biggest regional difference is still the electricity standing charge. South Scotland
        pays {p(south.january.elecStanding)} a day, against a {p(CAP.january.elecStanding)} Great
        Britain average. That is about {pounds(perYear(south.january.elecStanding))} a year before
        you switch a kettle on.
      </P>
      <GuideTable
        kicker="Single rate electricity, 1 January to 31 March 2027"
        title="Electricity rates in Scotland by how you pay"
        columns={["Region and charge", "Direct Debit", "Paying on the bill", "Prepayment"]}
        align={["left", "right", "right", "right"]}
        rows={REGIONS.flatMap((r) => [
          [`${r.name}, per kWh`, p(r.january.elecUnit), p(r.credit.elecUnit), p(r.prepay.elecUnit)],
          [`${r.name}, per day`, p(r.january.elecStanding), p(r.credit.elecStanding), p(r.prepay.elecStanding)],
        ])}
        caption="Ofgem regional tables. Your supplier can charge less than the cap, never more, on a default variable tariff."
      />

      <H2 id="not-a-bill-cap">Why it is not a cap on the bill</H2>
      <P>
        Ofgem caps the price of each kilowatt hour and the daily standing charge on a default
        tariff. The {pounds(dd.january)} figure applies those rates to an assumed amount of gas and
        electricity. It is a yardstick for comparison, not a maximum bill.
      </P>
      <UL>
        <LI>Use more energy in a cold Scottish winter and your bill will be higher than {pounds(dd.january)}.</LI>
        <LI>Use less and it will be lower.</LI>
        <LI>A fixed tariff follows your contract rate rather than moving with the cap.</LI>
      </UL>
      <P>
        You may also see {pounds(CAP.oldBasis.january)} quoted. That is the same January cap
        measured on Ofgem&apos;s older idea of typical use. From July 2026 Ofgem assumes about 7%
        less electricity and 17% less gas, so the headline figure looks smaller without changing a
        single unit rate. On the older measure the cap goes from {pounds(CAP.oldBasis.october)} to{" "}
        {pounds(CAP.oldBasis.january)}.
      </P>

      <H2 id="rates">Price cap per kWh: the unit rates</H2>
      <BigStat
        value={p(CAP.january.elecUnit)}
        label="average price cap for a kWh of electricity, Direct Debit, January to March 2027"
        exact={`Up from ${p(CAP.october.elecUnit)}. Gas goes from ${p(CAP.october.gasUnit)} to ${p(CAP.january.gasUnit)} a kWh.`}
      />
      <P>
        These are Great Britain averages. Regional rates differ, as the North and South Scotland
        tables above show. Paying when the bill arrives costs more per unit than Direct Debit or
        prepayment.
      </P>

      <H2 id="standing">The standing charge</H2>
      <P>
        A standing charge is paid for every day the supply is connected, even if no energy is used.
        From January the Great Britain averages are {p(CAP.january.elecStanding)} a day for
        electricity and {p(CAP.january.gasStanding)} for gas. That adds up to roughly{" "}
        {pounds(perYear(CAP.january.elecStanding + CAP.january.gasStanding))} a year before buying a
        single unit of energy.
      </P>
      <P>
        The UK Government has asked Ofgem to remove standing charges from gas bills in 2027 or as
        soon as possible after. <Ofgem href={OFGEM.news}>Ofgem says</Ofgem> it is working on options
        and will share details later.
      </P>
      <Aside title="Why turning everything off cannot make the bill zero">
        <p>
          Cutting use reduces the unit part of the bill. It does not remove the standing charge.
          That hits low use homes hardest, because the fixed daily fee takes up a much bigger share
          of the total bill.
        </p>
      </Aside>

      <H2 id="vat">No VAT on electricity until July 2027</H2>
      <P>
        The UK Government removed VAT from household electricity from 1 October 2026 to 30 June
        2027. Gas still carries 5% VAT. All the January figures on this page already include that,
        so they cannot be compared like for like with caps from before October 2026.
      </P>
      <P>
        Rural and island homes in Scotland that heat with electricity rather than mains gas get the
        most from the VAT cut. Even so, a jump to {p(north.january.elecUnit)} a kWh in North
        Scotland will hit electric heating hard this winter.
      </P>

      <H2 id="who">Who the cap covers</H2>
      <P>
        Ofgem says the rise affects around 20 million homes in Great Britain on standard variable
        (default) tariffs. Around 10 million homes on fixed deals are not affected while their fix
        lasts. The cap does not cover heating oil, LPG, bottled gas or communal heat networks.
      </P>
      <P>
        Check the tariff name, payment method, unit rates and standing charges on your bill. Do not
        judge a tariff only by the monthly Direct Debit amount. Suppliers often change that payment
        to clear arrears or build up winter credit, even when the rates stay the same.
      </P>
      <P>
        The cap changes every three months. Ofgem will publish the next one, for 1 April to 30 June
        2027, by {CAP.nextAnnouncement}.
      </P>

      <H2 id="help">Help with energy bills in Scotland this winter</H2>
      <P>
        With a {CAP.risePct}% rise now confirmed for January, check every Scottish and UK scheme
        you qualify for.
      </P>
      <UL>
        <LI>
          <strong>Short of money right now:</strong> If you cannot afford to heat your home or top
          up your meter today, start with our{" "}
          <Link href="/struggling-right-now-scotland">help if you are struggling right now</Link>{" "}
          page. You can also apply for a <Link href="/crisis-grant-scotland">Scottish Crisis Grant</Link>{" "}
          or phone your council on the{" "}
          <Link href="/crisis-grant-phone-number">32 council Crisis Grant phone numbers</Link>.
        </LI>
        <LI>
          <strong>£150 off your electricity bill:</strong> Check the{" "}
          <Link href="/warm-home-discount-scotland">Warm Home Discount in Scotland</Link>. It is
          automatic for the expanded Core Group, including Pension Credit, while other low income
          homes in Scotland&apos;s Broader Group must apply to their supplier before funds run out.
        </LI>
        <LI>
          <strong>£100 towards your energy bill:</strong> Ofgem says around 20 million homes will
          get £100 from January. Check the{" "}
          <Link href="/100-energy-payment-scotland">£100 energy payment in Scotland</Link> for who
          qualifies here, and watch the{" "}
          <Link href="/scottish-budget-2027-28">Scottish Budget on 3 December 2026</Link>.
        </LI>
        <LI>
          <strong>Scottish winter heating benefits:</strong> Check the{" "}
          <Link href="/winter-heating-payment">Winter Heating Payment</Link> (£59.75 paid
          automatically to people on qualifying low income benefits) and the{" "}
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
      </UL>
      <P>
        Lower headline inflation does not undo price rises already baked into energy, food and rent.
        Read <Link href="/blog/why-food-prices-stay-high-when-inflation-falls">why prices stay
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
