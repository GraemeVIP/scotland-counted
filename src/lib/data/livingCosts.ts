/**
 * What full-time minimum wage actually buys in Glasgow.
 *
 * Everything here is either published or is arithmetic on published figures,
 * and the arithmetic is shown so anyone can check it. Take-home is computed
 * from the published Scottish bands and the published National Insurance
 * rates rather than quoted from a calculator, so the working is auditable
 * rather than asserted.
 */

const HOURLY = 12.71;
const HOURS = 37.5;
const WEEKS = 52;

export const minimumWage = {
  hourly: HOURLY,
  hours: HOURS,
  weeklyGross: HOURLY * HOURS,
  annualGross: HOURLY * HOURS * WEEKS,
  monthlyGross: (HOURLY * HOURS * WEEKS) / 12,
  from: "1 April 2026",
  sourceId: "minimum-wage-2026",
};

/** Scottish income tax, 2026 to 2027. Bands are annual and inclusive. */
export const scottishTaxBands = [
  { name: "Personal Allowance", upTo: 12_570, rate: 0 },
  { name: "Starter", upTo: 16_537, rate: 0.19 },
  { name: "Basic", upTo: 29_526, rate: 0.2 },
  { name: "Intermediate", upTo: 43_662, rate: 0.21 },
  { name: "Higher", upTo: 75_000, rate: 0.42 },
];

/** Class 1 employee National Insurance, category A, 2026 to 2027. Weekly. */
export const nationalInsurance = {
  weeklyFreeUpTo: 242,
  weeklyUpperLimit: 967,
  mainRate: 0.08,
  upperRate: 0.02,
};

/** Income tax on a gross annual salary, band by band. */
export function incomeTaxOn(annual: number) {
  let tax = 0;
  let lower = 0;
  for (const band of scottishTaxBands) {
    if (annual <= lower) break;
    const taxableHere = Math.min(annual, band.upTo) - lower;
    tax += taxableHere * band.rate;
    lower = band.upTo;
  }
  return tax;
}

/** Employee National Insurance on a gross weekly wage. */
export function nationalInsuranceOn(weekly: number) {
  const { weeklyFreeUpTo: free, weeklyUpperLimit: upper, mainRate, upperRate } = nationalInsurance;
  const main = Math.max(0, Math.min(weekly, upper) - free) * mainRate;
  const above = Math.max(0, weekly - upper) * upperRate;
  return (main + above) * 52;
}

export const minimumWageTakeHome = (() => {
  const gross = minimumWage.annualGross;
  const tax = incomeTaxOn(gross);
  const ni = nationalInsuranceOn(minimumWage.weeklyGross);
  const net = gross - tax - ni;
  return {
    gross,
    tax,
    ni,
    annual: net,
    monthly: net / 12,
    sourceIds: ["scottish-tax-2026", "ni-rates-2026"],
  };
})();

export const glasgowRent = {
  monthly: 865,
  scotlandMonthly: 738,
  size: "one-bedroom",
  area: "Greater Glasgow",
  year: 2025,
  sourceId: "rent-scotland-2025",
};

/** Rent as a share of gross pay, before a penny of tax comes off. */
export const rentShareOfGross = glasgowRent.monthly / minimumWage.monthlyGross;

/** Rent as a share of what actually reaches the bank account. */
export const rentShareOfTakeHome = glasgowRent.monthly / minimumWageTakeHome.monthly;

/** What is left each month once rent is paid, out of take-home pay. */
export const leftAfterRentMonthly = minimumWageTakeHome.monthly - glasgowRent.monthly;

/**
 * The Minimum Income Standard is the rigorous version of this calculation:
 * what the public agrees a household needs for a decent life, priced up by
 * Loughborough. Better than anything we could assemble ourselves.
 */
export const minimumIncomeStandard = [
  {
    household: "A single adult",
    covers: 76,
    note: "Working full time at the legal minimum still left them a quarter short of a basic, decent standard of living.",
  },
  {
    household: "A lone parent with children aged 3 and 7",
    covers: 69,
    note: "Nearly a third short, even in full-time work at the legal minimum.",
  },
];

/**
 * The "better off on benefits" question, answered with the rules rather than
 * with assertion either way.
 *
 * The decisive fact is structural: Universal Credit tapers at 55p in the
 * pound, so earnings never reduce total income. There is no point at which
 * someone is financially better off not working. What is true, and is the
 * serious version of the complaint, is that the reward for working can be
 * thin — 45p of every pound above the work allowance.
 */
export const benefitsComparison = {
  taperPence: 55,
  keptPence: 45,
  workAllowanceWithHousing: 427,
  workAllowanceWithoutHousing: 710,
  singleOver25Monthly: 424.9,
  healthElementMonthly: 429.8,
  get outOfWorkMaxMonthly() {
    return this.singleOver25Monthly + this.healthElementMonthly;
  },
  get outOfWorkMaxAnnual() {
    return this.outOfWorkMaxMonthly * 12;
  },
  sourceIds: ["uc-what-youll-get", "uc-earnings"],
};


/**
 * What the bills have done, then against now.
 *
 * People do not experience inflation as a percentage. They experience it as
 * the same shop costing more, so these are shown as what changed and over
 * what period, with the comparison period named.
 */
export const costsThenAndNow = [
  {
    what: "Energy",
    now: "£1,854 a year",
    detail: "Ofgem cap for a typical dual-fuel home paying by direct debit, from 1 July 2026, after a 13% rise",
    change: "53% higher",
    against: "than winter 2021/22, before the energy crisis",
    sourceId: "ofgem-cap-2026",
  },
  {
    what: "Food",
    now: "38.6% dearer",
    detail: "The price of food and non-alcoholic drinks across the UK, November 2020 to November 2025",
    change: "31.6% in three and a half years",
    against: "against 9.5% across the whole decade before it",
    sourceId: "ons-food-prices",
  },
];

/**
 * Council tax is a real line in any household budget and it is missing here
 * on purpose. Glasgow City Council blocks automated access to its charges,
 * and the figures circulating on commercial council-tax sites disagree with
 * each other — two of them give different Scottish Water charges for the same
 * band. We would rather leave a stated gap than publish a number we cannot
 * trace to the council. Anyone can read theirs off their own bill.
 */
export const councilTaxNote =
  "Council tax and water charges are not included here. Glasgow publishes them, but we could not retrieve them from the council directly, and we do not publish figures we cannot trace to the source. Yours is on your bill. Council Tax Reduction may also apply at this income.";
