import Link from "next/link";
import { CITY_ORDER, CITY_PAY, PRIVATE_RENTS } from "@/lib/data/money";
import { Prose, Lead, P, H2, H3, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { pounds } from "@/lib/data/quickAnswers";

type LhaRow = { area: string; shared: number; one: number; two: number; three: number; four: number };

/**
 * Universal Credit Local Housing Allowance monthly rates for Scotland, 2026 to 2027,
 * as published by DWP on GOV.UK. Frozen at the rates determined on 31 January 2024.
 */
const LHA_UC_MONTHLY_2026: LhaRow[] = [
  { area: "Aberdeen and Shire", shared: 325, one: 475, two: 650, three: 860, four: 1250 },
  { area: "Argyll and Bute", shared: 350, one: 450, two: 600, three: 695, four: 1200 },
  { area: "Ayrshires", shared: 375, one: 375, two: 475, three: 564.88, four: 800 },
  { area: "Dumfries and Galloway", shared: 335, one: 380, two: 450, three: 500, four: 690 },
  { area: "Dundee and Angus", shared: 375, one: 400, two: 615, three: 795, four: 1100 },
  { area: "East Dunbartonshire", shared: 425, one: 550, two: 750, three: 1000, four: 1400 },
  { area: "Fife", shared: 375, one: 450, two: 590, three: 715, four: 1250 },
  { area: "Forth Valley", shared: 415, one: 460, two: 650, three: 800, four: 1300 },
  { area: "Greater Glasgow", shared: 450, one: 695, two: 850, three: 970, four: 1800 },
  { area: "Highland and Islands", shared: 380, one: 475, two: 595, three: 695, four: 850 },
  { area: "Lothian", shared: 475, one: 750, two: 970, three: 1375, four: 2180 },
  { area: "North Lanarkshire", shared: 375, one: 440, two: 550, three: 675, four: 895 },
  { area: "Perth and Kinross", shared: 359.17, one: 425, two: 560, three: 750, four: 1250 },
  { area: "Renfrewshire and Inverclyde", shared: 360, one: 400, two: 525, three: 600, four: 1100 },
  { area: "Scottish Borders", shared: 325, one: 375, two: 500, three: 615, four: 985 },
  { area: "South Lanarkshire", shared: 375, one: 450, two: 575, three: 715.84, four: 1107 },
  { area: "West Dunbartonshire", shared: 350, one: 475, two: 595, three: 675, four: 950 },
  { area: "West Lothian", shared: 410, one: 500, two: 625, three: 750, four: 1112.5 },
];

/** Housing Benefit uses the weekly figure from the same determination. */
const GLASGOW_ONE_BED_WEEKLY = 159.95;

/** Scottish Government private rent statistics: average advertised one bedroom rent, Greater Glasgow, 2025. */
const GLASGOW_ADVERTISED_ONE_BED_2025 = 865;

const findLha = (area: string) => LHA_UC_MONTHLY_2026.find((row) => row.area === area);
const lhaFor = (area: string) => {
  const row = findLha(area);
  if (!row) throw new Error(`No Local Housing Allowance rate for ${area}`);
  return row;
};

export default function Post() {
  const glasgow = CITY_PAY["glasgow-city"];
  const glasgowLha = lhaFor("Greater Glasgow");
  const lothianLha = lhaFor("Lothian");
  const advertisedGap = GLASGOW_ADVERTISED_ONE_BED_2025 - glasgowLha.one;
  const cities = CITY_ORDER.map((slug) => {
    const city = CITY_PAY[slug];
    const lha = findLha(city.rentArea);
    return lha ? { city, lha: lha.one, gap: city.rent.oneBed - lha.one } : null;
  }).filter((row): row is NonNullable<typeof row> => row !== null);

  return (
    <Prose>
      <Lead>
        Local Housing Allowance, or LHA, is the most Universal Credit or Housing Benefit will pay
        towards private rent, and in Scotland the 2026/27 rates are frozen at the levels set in
        January 2024. A one bedroom home in Greater Glasgow gets up to {pounds(glasgowLha.one)} a
        month through Universal Credit, while the average one bedroom private rent there is{" "}
        {pounds(glasgow.rent.oneBed)}.
      </Lead>
      <P>
        The tenancy agreement does not decide your maximum help. The area you live in and the
        number of bedrooms the benefit rules say you need do.
      </P>

      <H2 id="what-it-is">What Local Housing Allowance is</H2>
      <P>
        Scotland is divided into 18 Broad Rental Market Areas. Each area has caps for a shared room
        and for homes with one to four bedrooms. The relevant cap depends on where you live and how
        many bedrooms the benefit rules say the household needs.
      </P>
      <P>
        If the actual eligible rent is lower than the cap, help cannot be higher than the rent. If
        the rent is higher, the cap can leave a gap that must come from the rest of the household
        income.
      </P>

      <H2 id="rates">LHA rates Scotland 2026/27 for every area</H2>
      <P>
        These are the most Universal Credit can pay towards rent each month from April 2026 to
        March 2027. Shared means the shared accommodation rate, for a room in a shared home.
      </P>
      <GuideTable
        kicker="Universal Credit, a month"
        title="Local Housing Allowance rates in Scotland, 2026/27"
        columns={["Area", "Shared", "1 bed", "2 bed", "3 bed", "4 bed"]}
        align={["left", "right", "right", "right", "right", "right"]}
        rows={LHA_UC_MONTHLY_2026.map((row) => [
          row.area,
          pounds(row.shared, true),
          pounds(row.one, true),
          pounds(row.two, true),
          pounds(row.three, true),
          pounds(row.four, true),
        ])}
        caption={
          <>
            DWP, Universal Credit Local Housing Allowance monthly rates for Scotland, 2026 to 2027.
            Housing Benefit uses weekly figures from the same rates, for example{" "}
            {pounds(GLASGOW_ONE_BED_WEEKLY, true)} a week for one bedroom in Greater Glasgow. The
            areas do not follow council boundaries exactly, so ask your council&apos;s benefits team
            if you are not sure which one covers your address.
          </>
        }
      />

      <H2 id="glasgow">LHA Glasgow 2026: the Greater Glasgow gap</H2>
      <BigStat
        value={`about ${pounds(advertisedGap)} a month`}
        label="the gap between the one bedroom LHA cap and the 2025 Greater Glasgow advertised rent average"
        exact={`LHA for Universal Credit: ${pounds(glasgowLha.one)} a month (${pounds(GLASGOW_ONE_BED_WEEKLY, true)} a week for Housing Benefit). Average advertised one bedroom rent in 2025: ${pounds(GLASGOW_ADVERTISED_ONE_BED_2025)} a month.`}
      />
      <P>
        This is not a claim that every one bedroom tenant pays {pounds(GLASGOW_ADVERTISED_ONE_BED_2025)}.
        The rent statistic mainly reflects homes advertised or newly let, while some existing tenants
        pay less. The ONS average for one bedroom homes in {glasgow.rentArea}, a different measure,
        was {pounds(glasgow.rent.oneBed)} in {PRIVATE_RENTS.month}, which is still well above the
        allowance. It shows the problem facing someone trying to move now: the benefit cap is below
        the current average.
      </P>
      <P>
        A two bedroom home in Greater Glasgow is capped at {pounds(glasgowLha.two)} a month, and a
        room in a shared home at {pounds(glasgowLha.shared)}.
      </P>

      <H2 id="edinburgh">Local housing allowance Edinburgh and the other cities</H2>
      <P>
        Edinburgh sits in the Lothian area, where the one bedroom rate is {pounds(lothianLha.one)} a
        month. That is the highest one bedroom rate in Scotland, but rents there are higher
        still. The table compares the one bedroom rate with the average rent in each city&apos;s
        area.
      </P>
      <GuideTable
        kicker={`One bedroom, ${PRIVATE_RENTS.month}`}
        title="LHA against the average rent"
        columns={["City", "Rental area", "LHA a month", "Average rent", "Gap"]}
        align={["left", "left", "right", "right", "right"]}
        rows={cities.map(({ city, lha, gap }) => [
          <Link key="c" href={city.path}>{city.name}</Link>,
          city.rentArea,
          pounds(lha),
          pounds(city.rent.oneBed),
          pounds(gap),
        ])}
        caption="LHA is the Universal Credit monthly rate for 2026/27. Average rent is the ONS Price Index of Private Rents for one bedroom homes in the area, which in Scotland is mostly based on advertised new lets."
      />

      <H2 id="frozen">Why the 2026/27 rates are frozen</H2>
      <P>
        The 2026/27 Scottish rates are frozen at the cash levels set in January 2024. They were
        based on the cheaper end of the market at that time. Rent Service Scotland also publishes
        newer 2025 evidence showing what the lower part of today&apos;s market looks like, but that
        newer evidence was not used to raise the benefit caps.
      </P>
      <Aside title="The policy split matters">
        <p>
          Rent and housing law are devolved to Scotland. Local Housing Allowance inside Universal
          Credit is controlled by the UK Government. A renter can therefore face a Scottish rent
          market with a Westminster benefit cap based on older figures.
        </p>
      </Aside>

      <H2 id="bedrooms">Which bedroom rate applies</H2>
      <P>
        The benefit system has rules for how many bedrooms a household needs. These people are
        expected to share a bedroom:
      </P>
      <UL>
        <LI>An adult couple.</LI>
        <LI>Two children under 16 of the same sex.</LI>
        <LI>Two children under 10, whatever their sex.</LI>
      </UL>
      <P>
        Other adults aged 16 or over get their own room. A single person under 35 will often
        receive only the shared accommodation rate unless an exemption applies.
      </P>
      <P>
        Do not guess from the number of bedrooms in the property. Check the household&apos;s allowed
        size and any disability, care, foster care, domestic abuse or homelessness exception that
        may apply.
      </P>

      <H2 id="housing-benefit">Housing Benefit in Scotland: who still claims it</H2>
      <P>
        Most working age renters now get help with rent through Universal Credit. You can only make
        a new claim for Housing Benefit if you have reached State Pension age, or if you live in
        supported, sheltered or temporary housing. Savings over £16,000 usually rule you out,
        unless you get the Guarantee Credit part of Pension Credit.
      </P>
      <P>
        Private renters on Housing Benefit face the same Local Housing Allowance caps as Universal
        Credit, worked out weekly rather than monthly.
      </P>

      <H2 id="help">What to do about a shortfall</H2>
      <H3>Check the calculation first</H3>
      <UL>
        <LI>Confirm the correct rental market area and the number of bedrooms the rules allow.</LI>
        <LI>Check that the rent and all household details are right.</LI>
        <LI>Challenge a decision if the wrong rate or household size was used.</LI>
      </UL>
      <H3>Ask the council for extra help</H3>
      <P>
        A <Link href="/blog/discretionary-housing-payment-scotland">Discretionary Housing
        Payment</Link> can sometimes cover some or all of a rent gap. It can also help with a
        deposit, rent in advance or moving costs in some cases. The fund is not automatic, so give
        the council a clear budget and explain what will happen without the payment.
      </P>
      <P>
        If you are on a low income, also check{" "}
        <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link> and the{" "}
        <Link href="/benefits">benefits guides</Link>. In an emergency, a{" "}
        <Link href="/crisis-grant-scotland">crisis grant</Link> can help with food or heating while
        you sort out the rent.
      </P>

      <PostCTA
        title="The cap is a political choice"
        body="Local Housing Allowance rates are decided at Westminster. I find your MP automatically, add the housing evidence and prepare the email in ordinary language."
        href="/email-your-mp-and-msp"
        cta="Email my MP"
      />
    </Prose>
  );
}
