/**
 * The latest official Scotland-wide poverty headline.
 *
 * These are three-year averages from the Scottish Government's
 * Poverty and Income Inequality in Scotland 2022–25 publication,
 * released in March 2026. Local pages use separate administrative
 * datasets because the Family Resources Survey is not robust at
 * council-area level.
 */

export const scotlandPoverty = {
  period: "2022–25",
  all: { pct: 17, count: 940_000, label: "All people" },
  children: { pct: 21, label: "Children" },
  workingAge: { pct: 18, label: "Working-age adults" },
  pensioners: { pct: 13, label: "Pensioners" },
  childrenInWorkingHouseholdsPct: 75,
  sourceId: "sg-poverty-2026",
} as const;
