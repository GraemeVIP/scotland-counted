import Link from "next/link";
import { GuideTable } from "@/components/GuideTable";
import { MINIMUM_WAGE, pounds } from "@/lib/data/quickAnswers";
import { FULL_TIME, PRIVATE_RENTS, cityBudgets, minimumWageNext, minimumWageNow, type CitySlug } from "@/lib/data/money";

/**
 * Tables shared by the four city minimum wage pages. The prose on each page is
 * local; these hold the figures that are the same everywhere, plus the side by
 * side comparison, so every page reads them from one place.
 */

const { current, next } = MINIMUM_WAGE;

/** Every legal rate, now and from 1 April 2027. */
export function MinimumWageRatesTable({ place }: { place: string }) {
  const rows = [
    ["21 and over", current.over21, next.over21],
    ["18 to 20", current.age18to20, next.age18to20],
    ["Under 18", current.under18, next.under18],
    ["Apprentice", current.apprentice, next.apprentice],
  ] as const;
  return (
    <GuideTable
      kicker={`The same in ${place} as anywhere in the UK`}
      title="Minimum wage rates"
      columns={["Age", "Now", "From 1 April 2027"]}
      align={["left", "right", "right"]}
      rows={rows.map(([label, now, then]) => [label, pounds(now, true), pounds(then, true)])}
      caption="Hourly rates from GOV.UK. The apprentice rate is for apprentices under 19, or 19 and over in their first year."
    />
  );
}

/** Gross and take home pay for a full time week at the legal minimum, now and next April. */
export function MinimumWagePayTable() {
  return (
    <GuideTable
      kicker={`Age 21 and over, ${FULL_TIME.hours} hours a week`}
      title="Full time pay at the legal minimum"
      columns={["", `Now (${pounds(current.over21, true)})`, `April 2027 (${pounds(next.over21, true)})`]}
      align={["left", "right", "right"]}
      rows={[
        ["Pay before tax, a week", pounds(minimumWageNow.weekly, true), pounds(minimumWageNext.weekly, true)],
        ["Pay before tax, a year", pounds(minimumWageNow.annual, true), pounds(minimumWageNext.annual, true)],
        ["Take home, a year", pounds(minimumWageNow.net, true), pounds(minimumWageNext.net, true)],
        ["Take home, a month", pounds(minimumWageNow.netMonthly, true), pounds(minimumWageNext.netMonthly, true)],
      ]}
      caption="Scottish income tax and employee National Insurance on 2026/27 rules, standard tax code, no pension or student loan. The 2027/28 Scottish tax bands aren't set yet."
    />
  );
}

/** Take home pay against rent and council tax in all four cities, with this page's city marked. */
export function CityBudgetCompare({ current: here }: { current: CitySlug }) {
  return (
    <GuideTable
      kicker="Full time on the legal minimum, a month"
      title="What's left after rent and council tax"
      columns={["City", "Take home", "One bedroom rent", "Council tax and water", "Left"]}
      align={["left", "right", "right", "right", "right"]}
      rows={cityBudgets().map((city) => [
        city.slug === here ? (
          <strong key="c">{city.name}</strong>
        ) : (
          <Link key="c" href={city.path}>
            {city.name}
          </Link>
        ),
        pounds(city.takeHome),
        pounds(city.rent.oneBed),
        pounds(city.councilTaxMonthly),
        city.slug === here ? <strong key="l">{pounds(city.left)}</strong> : pounds(city.left),
      ])}
      caption={`Take home at ${pounds(current.over21, true)} an hour, ${FULL_TIME.hours} hours a week. Rent is the ONS average for a one bedroom home in the city's rental area, ${PRIVATE_RENTS.month}. Council tax is Band A for 2026/27 with water and waste water, before any discount.`}
    />
  );
}
