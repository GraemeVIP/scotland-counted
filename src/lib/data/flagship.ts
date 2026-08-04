import { NATIONAL, BUDGET_SOURCE } from "./councilBudgetMechanics";

/**
 * The one finding the homepage leads with.
 *
 * The homepage used to show four unrelated sets of national figures at once,
 * which is how a visitor ends up remembering none of them. One finding, chosen
 * because it is current and because it demonstrates the half of the site most
 * people do not know exists.
 *
 * Every number here is read from the module that already holds it, so swapping
 * the finding is an edit to this file alone and the figures cannot drift from
 * the pages that explain them. When a newer release lands, change `current`.
 */

export type Flagship = {
  /** Short label above the finding. */
  kicker: string;
  /** The finding itself, as a number a reader can repeat. */
  value: string;
  /** What that number counts. */
  unit: string;
  /** One sentence of context. Not a conclusion. */
  context: string;
  /** Where to read the working. */
  href: string;
  hrefLabel: string;
  source: { title: string; publisher: string; url: string };
};

export const current: Flagship = {
  kicker: "Councils, 2026/27",
  value: `${NATIONAL.councilsWithGap} of ${NATIONAL.councilsTotal}`,
  unit: "councils said they needed more money this year",
  context: `Their funding went ${NATIONAL.revenueChange} in real terms, and the gap has stayed about the same size for ${NATIONAL.gapYears} years. Only ${NATIONAL.surplusCouncil} reported a surplus.`,
  href: "/councils",
  hrefLabel: "See what your council said",
  source: {
    title: BUDGET_SOURCE.title,
    publisher: BUDGET_SOURCE.publisher,
    url: BUDGET_SOURCE.url,
  },
};
