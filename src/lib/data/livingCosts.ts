/**
 * What full-time minimum wage actually buys in Glasgow.
 *
 * Everything here is either published or is arithmetic on published figures,
 * and the arithmetic is shown. We deliberately do not publish a take-home pay
 * figure: that needs assumptions about tax bands we have not verified for the
 * year, and an unsourced number on this page would undermine the rest. Rent is
 * therefore shown against gross pay, which understates the squeeze rather than
 * overstating it.
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

export const glasgowRent = {
  monthly: 865,
  scotlandMonthly: 738,
  size: "one-bedroom",
  area: "Greater Glasgow",
  year: 2025,
  sourceId: "rent-scotland-2025",
};

/** Rent as a share of gross pay, before a penny of tax comes off. */
export const rentShareOfGross =
  glasgowRent.monthly / minimumWage.monthlyGross;

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
