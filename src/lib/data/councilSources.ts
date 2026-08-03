/**
 * The verified, repeatable sources for holding all 32 councils to account.
 *
 * The rule this registry enforces: evidence about a council comes from bodies
 * OUTSIDE the council. Councils publish their own performance reports, and
 * the site's owner does not trust self-marking — reasonably, since a council
 * report card written by the council is the exact pattern this site exists to
 * replace. Self-published papers are used only for what a council PROMISED
 * (budgets it set, targets it adopted), never as proof of how things went.
 * The going-badly evidence must come from the independent tier below.
 *
 * Every source here was verified live on 3 August 2026 — named documents
 * fetched or found for named councils — before being written down. Nothing in
 * this file is aspirational.
 */

export type CouncilSource = {
  id: string;
  name: string;
  publisher: string;
  /** Independent of the councils it reports on. */
  independent: boolean;
  independenceNote: string;
  /** How often new data arrives. */
  cadence: string;
  /** Which of the 32 councils it covers. */
  coverage: "all-32" | "per-council" | "rolling-selection";
  /** Where to start, and the shape repeated URLs take. */
  startUrl: string;
  urlPattern?: string;
  /** Which record fields in councilAccountability.ts this source feeds. */
  feeds: Array<"budgetFigures" | "outcomes" | "auditFindings" | "commitments">;
  whatToExtract: string;
};

export const COUNCIL_SOURCES: CouncilSource[] = [
  {
    id: "audit-scotland-annual-audit",
    name: "Annual audit report, per council",
    publisher: "Audit Scotland (appointed auditors, for the Accounts Commission)",
    independent: true,
    independenceNote:
      "The statutory external auditor. Councils cannot choose, brief or mark their own audit.",
    cadence: "Annual, roughly September to December for the prior financial year",
    coverage: "per-council",
    startUrl: "https://audit.scot/publications",
    urlPattern:
      "Search audit.scot publications for \"annual audit\" plus the council name; PDFs also mirror on council sites",
    feeds: ["budgetFigures", "auditFindings", "outcomes"],
    whatToExtract:
      "Funding gaps and savings shortfalls, use of reserves, whether savings targets were actually delivered, Best Value findings, and every recommendation with its status. This is the single richest independent record of a council's year.",
  },
  {
    id: "accounts-commission-overview",
    name: "Local government overview reports",
    publisher: "Accounts Commission",
    independent: true,
    independenceNote: "The statutory watchdog for all Scottish councils.",
    cadence: "Annual: financial bulletin (roughly January) and overview (roughly May)",
    coverage: "all-32",
    startUrl: "https://audit.scot/publications",
    feeds: ["budgetFigures", "outcomes"],
    whatToExtract:
      "The Scotland-wide picture in one place: combined funding gaps, reserves drawn down, councils flagged as financially stressed. The comparative lines that make one council's record mean something.",
  },
  {
    id: "lgbf",
    name: "Local Government Benchmarking Framework (LGBF)",
    publisher: "Improvement Service, on behalf of SOLACE and COSLA",
    independent: true,
    independenceNote:
      "A single national methodology across every council — a council cannot quietly redefine its own measure. Over 100 indicators covering cost, performance and satisfaction.",
    cadence: "Annual; the 2024/25 data arrived in the 14th National Benchmarking Overview (2026)",
    coverage: "all-32",
    startUrl:
      "https://www.improvementservice.org.uk/products-and-services/data-intelligence-and-benchmarking/local-government-benchmarking-framework",
    feeds: ["outcomes"],
    whatToExtract:
      "The like-for-like numbers people actually argue about: cost per bin collection, share of roads needing repair, cost per pupil, satisfaction scores — every council on the same ruler, so \"worst in Scotland\" is a fact rather than a feeling.",
  },
  {
    id: "shr-engagement",
    name: "Engagement plans and landlord performance, per council landlord",
    publisher: "Scottish Housing Regulator",
    independent: true,
    independenceNote:
      "The housing watchdog. Already proven in this repo: Glasgow's systemic-failure finding came from here.",
    cadence: "Annual engagement plans, from April",
    coverage: "per-council",
    startUrl: "https://www.housingregulator.gov.scot/landlord-performance/landlords/",
    urlPattern:
      "https://www.housingregulator.gov.scot/landlord-performance/landlords/<council-name>/",
    feeds: ["auditFindings", "outcomes"],
    whatToExtract:
      "Homelessness duties not met, temporary accommodation failures, and what the regulator required the council to do about it.",
  },
];

/**
 * How a data pass uses this registry, per council:
 *
 *   1. Pull the latest annual audit report; lift funding gap, savings
 *      delivered vs promised, reserves movement and open recommendations into
 *      budgetFigures / auditFindings, each with the report as its source.
 *   2. Add the council's own budget papers ONLY for commitments — what they
 *      said they would do — never as evidence of how it went.
 *   3. Take the comparable LGBF indicators for outcomes, so every record can
 *      say where the council sits against the other 31.
 *   4. Check the housing regulator page for engagement findings.
 *
 * Done in that order, every claim on a council page traces to a body the
 * council does not control.
 */
export const COUNCIL_SOURCE_IDS = COUNCIL_SOURCES.map((s) => s.id);
