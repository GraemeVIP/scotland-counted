/**
 * Plain-English definitions for every technical term used on the site.
 *
 * Each entry has a `def` written for someone with no background in
 * statistics or social policy, and an optional `tech` note for readers
 * who want the methodological detail. Both are shown in the popover;
 * the glossary page renders them as a searchable list.
 */

export type Term = {
  id: string;
  term: string;
  def: string;
  tech?: string;
};

export const terms: Term[] = [
  {
    id: "ahc",
    term: "After housing costs",
    def: "Income counted once the rent or mortgage is paid, rather than before. It is the money a family actually has left to live on.",
    tech: "The alternative is a before-housing-costs measure. Glasgow looks worse on the after-housing-costs count because rents here take a bigger bite than in much of Scotland, so the two measures tell different stories about the same households.",
  },
  {
    id: "pp",
    term: "Percentage points",
    def: "The plain gap between two percentages. Going from 27% to 36% is a rise of nine percentage points.",
    tech: "It is not the same as a 9% rise. In relative terms that move is about a third higher. Percentage points avoid the ambiguity, which is why this site uses them.",
  },
  {
    id: "relative-poverty",
    term: "Relative poverty",
    def: "Having less than 60% of what a typical household in the country has. It measures whether you can afford to take part in normal life, not whether you are starving.",
    tech: "The official UK measure, published in the Households Below Average Income series. It is a moving line: if everyone's income falls together, relative poverty can go down even though people are worse off. That is why it is usually read alongside absolute and persistent measures.",
  },
  {
    id: "scp",
    term: "Scottish Child Payment",
    def: "A weekly payment from the Scottish Government for every child in a low-income family. It does not exist anywhere else in the UK. In April 2026 it was £28.20 per child per week.",
    tech: "Introduced in 2021 and increased repeatedly since. Independent analysis credits it with holding Scotland's child poverty rate roughly flat while rates in English cities rose. It is set to rise to £40 a week for children under one from 2027.",
  },
  {
    id: "claimant",
    term: "Out-of-work benefits",
    def: "Payments to working-age people who are out of work, or on very low earnings and expected to look for more.",
    tech: "The official name is the Claimant Count. It is not the same as unemployment: it counts people claiming, which misses those out of work but not eligible, and includes some people in low-paid work.",
  },
  {
    id: "uc",
    term: "Universal Credit",
    def: "The single monthly payment that replaced six older benefits, including Jobseeker's Allowance, tax credits and housing benefit.",
    tech: "Rolled out gradually from 2013. Because it covers a wider group than the benefits it replaced, statistics spanning the changeover are not measuring quite the same population before and after.",
  },
  {
    id: "aps",
    term: "A survey that stopped working",
    def: "Some job figures come from asking a sample of households, not from counting everyone. After 2023, far too few people answered for the results to be trusted at city level.",
    tech: "The ONS Annual Population Survey. Response rates fell so far that the ONS itself downgraded the estimates and flagged them as unreliable for local areas. Glasgow's apparent six-point fall in 2024 is not corroborated by any other source, which is why it is shown dotted here rather than removed or trusted.",
  },
  {
    id: "simd",
    term: "SIMD",
    def: "The Scottish Index of Multiple Deprivation. It splits Scotland into about 7,000 small neighbourhoods and ranks them from worst-off to best-off, using income, jobs, health, education, housing, crime and access to services.",
    tech: "Because it is a ranking, it can only tell you how places compare with each other, never whether the country as a whole got richer or poorer. A neighbourhood can improve in absolute terms and still fall in the ranking if others improved faster.",
  },
  {
    id: "le",
    term: "Life expectancy at birth",
    def: "How long a baby born now would live if today's death rates lasted its whole life. It is a summary of the population's health, not a forecast for any one person.",
    tech: "Figures are averaged over three years at a time to reduce year-to-year noise. A period life expectancy of 73.6 does not mean today's babies will die at 73.6 — it means death rates in those years were equivalent to that.",
  },
  {
    id: "median",
    term: "Median",
    def: "The middle figure. Line everyone up by wage and the median is the person standing in the middle — half earn more, half earn less.",
    tech: "Preferred to the average for incomes, because a small number of very high earners drag an average upward and make it unrepresentative of a typical household.",
  },
  {
    id: "workres",
    term: "Workplace and residence pay",
    def: "Two restricted pay estimates. Workplace pay covers selected full-time employee jobs based in Glasgow. Residence pay covers selected full-time employee jobs held by people who live in Glasgow. Neither is the average wage of everyone who works.",
    tech: "Both come from the ONS Annual Survey of Hours and Earnings, which samples PAYE employee jobs. The full-time figures exclude all part-time jobs, self-employment and other workers outside the selected sample. The two lines describe separate groups, so the difference between them is not a direct measure of commuting and cannot show that a particular amount of wages leaves Glasgow.",
  },
  {
    id: "jobs-density",
    term: "Jobs density",
    def: "The number of jobs in an area for every working-age person living there. Above 1.0 means there are more jobs than adults, so people must be travelling in to fill them.",
    tech: "Published by the ONS. It counts jobs by location of workplace, including part-time and self-employment. Glasgow's figure of 1.08 against Scotland's 0.82 is the clearest single indicator that the city is a regional employment centre rather than a place short of work.",
  },
  {
    id: "freeze",
    term: "The benefit freeze",
    def: "From 2016 to 2020 most working-age benefits were held at the same cash amount while prices rose. Standing still while the shops get dearer is a cut.",
    tech: "Formally a nominal freeze on most working-age rates. Its real-terms bite grew each year as inflation compounded, and it coincided almost exactly with the steepest phase of Glasgow's child poverty rise.",
  },
  {
    id: "tcl",
    term: "The two-child limit",
    def: "A rule that stopped families getting benefit support for a third or any later child. It ran from April 2017 until it was scrapped in April 2026.",
    tech: "It applied to children born after April 2017, so its effect compounded each year as more families came within scope. Because it targeted larger families, its impact fell disproportionately on places with bigger average family sizes — Glasgow among them.",
  },
  {
    id: "lha",
    term: "Housing benefit for private renters",
    def: "The maximum help with rent a private tenant can get. It is meant to track local rents, but has been frozen for most of the past decade while rents rose.",
    tech: "Formally Local Housing Allowance. It was designed to cover the cheapest 30% of local rents. Freezes mean it now falls well short of that in much of Glasgow, so tenants make up the difference out of money meant for food and heating — which is precisely how the after-housing-costs poverty figure worsens.",
  },
  {
    id: "persistent",
    term: "Persistent poverty",
    def: "Being poor in three or more of the last four years. It is far more damaging than a single bad year, because families have no savings left to fall back on.",
    tech: "One of four statutory measures in the Child Poverty (Scotland) Act 2017. Its 2023/24 interim target was under 8%; the outturn was 23%. It is the target Scotland missed by the widest margin, and the one most closely linked to long-term harm to children.",
  },
  {
    id: "newtowns",
    term: "The New Towns",
    def: "Places like East Kilbride and Cumbernauld, built from the 1950s to move people out of overcrowded Glasgow. Those who moved tended to be younger, skilled and in work.",
    tech: "Researchers describe this as socially selective migration. Because it removed a healthier, more economically active slice of the population, the city left behind was older, sicker and poorer than the raw numbers suggest. Liverpool and Manchester did not experience the same policy at the same scale, which is a leading explanation for why Glasgow's health is worse than its deprivation alone predicts.",
  },
  {
    id: "saleleaseback",
    term: "Sale and leaseback",
    def: "Selling a building you own for a lump sum, then renting it back from the new owner. You get the cash now and pay rent forever.",
    tech: "Glasgow used it on the City Chambers, Kelvingrove and other buildings to fund the equal pay settlement. The council now pays £32.1m a year plus inflation, on leases running up to 30 years. It converted a one-off liability into a permanent charge on the revenue budget — money that would otherwise fund services.",
  },
  {
    id: "reserved",
    term: "Reserved and devolved",
    def: "Reserved means Westminster decides. Devolved means Holyrood decides. Most benefits are reserved; the Scottish Child Payment, housing and childcare are devolved.",
    tech: "The split is set out in the Scotland Acts. It matters here because the largest levers on child poverty — Universal Credit, the two-child limit and Local Housing Allowance — sit with Westminster, while the legal duty to cut child poverty sits with Holyrood. Responsibility and power are not held by the same body.",
  },
  {
    id: "in-work-poverty",
    term: "In-work poverty",
    def: "Being poor even though someone in the household has a job. It is now the most common kind of poverty in Scotland.",
    tech: "Across Scotland, 75% of children in poverty live in a household where at least one adult works (Scottish Government, 2022–25). It is driven by low hourly pay, too few hours, insecure contracts and housing costs — which is why raising the employment rate alone does not reduce it.",
  },
];

export const termsById: Record<string, Term> = Object.fromEntries(
  terms.map((t) => [t.id, t])
);

export function getTerm(id: string) {
  return termsById[id];
}
