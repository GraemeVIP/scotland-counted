/**
 * Who controls what, issue by issue.
 *
 * The single most common reason a letter goes nowhere is that it went to the
 * wrong building. People write to their MSP about Universal Credit and to
 * their MP about school buildings, and both get a polite note saying it is not
 * theirs.
 *
 * Scotland uses a reserved powers model: Schedule 5 of the Scotland Act 1998
 * lists what stays with Westminster, and anything not on that list is devolved.
 * So "devolved" is the default and the reservations are the exceptions, which
 * is the opposite of how most people assume it works.
 *
 * Two rules for anything added here. Every row needs a source, because getting
 * this wrong sends someone to the wrong representative. And where control is
 * genuinely split, the split is described rather than flattened to one answer:
 * schools are devolved policy delivered by councils, and saying only "council"
 * or only "Scottish Government" would be wrong in a way that costs the reader
 * a wasted email.
 */

export type ControlLevel = "uk" | "scotland" | "council";

export type Responsibility = {
  id: string;
  /** The thing a person actually names when they complain about it. */
  issue: string;
  /** Who a letter should go to first. */
  level: ControlLevel;
  /** What that level actually decides, in ordinary words. */
  what: string;
  /** Where control is split, what the other level does. Left out when it is clean. */
  shared?: string;
  /** Who to write to, in the words the site uses elsewhere. */
  contact: string;
  sourceId: ResponsibilitySourceId;
};

export type ResponsibilitySourceId = keyof typeof RESPONSIBILITY_SOURCES;

export const RESPONSIBILITY_SOURCES = {
  "sp-powers": {
    title: "Devolved and reserved powers",
    publisher: "Scottish Parliament",
    url: "https://www.parliament.scot/about/how-parliament-works/devolved-and-reserved-powers",
  },
  "ukgov-devolution": {
    title: "Devolution settlement: Scotland",
    publisher: "UK Government",
    url: "https://www.gov.uk/guidance/devolution-settlement-scotland",
  },
  "scotland-act": {
    title: "Scotland Act 1998, Schedule 5 (reserved matters)",
    publisher: "legislation.gov.uk",
    url: "https://www.legislation.gov.uk/ukpga/1998/46/schedule/5",
  },
} as const;

export const LEVELS: Record<ControlLevel, { name: string; who: string; writeTo: string }> = {
  uk: {
    name: "UK Government",
    who: "Westminster. Decided in London, applies across the UK unless it has been devolved.",
    writeTo: "Your MP",
  },
  scotland: {
    name: "Scottish Government",
    who: "Holyrood. Decided in Edinburgh, applies across Scotland.",
    writeTo: "Your MSPs",
  },
  council: {
    name: "Your council",
    who: "Decided locally by the 32 councils, so it can differ from one area to the next.",
    writeTo: "Your councillors",
  },
};

export const RESPONSIBILITIES: Responsibility[] = [
  {
    id: "universal-credit",
    issue: "Universal Credit",
    level: "uk",
    what: "The amount, the rules for getting it and the sanctions are all set at Westminster.",
    shared:
      "Scotland can change how it is paid, for example twice a month or straight to a landlord, but not how much it is.",
    contact: "Your MP",
    sourceId: "sp-powers",
  },
  {
    id: "state-pension",
    issue: "State Pension and Child Benefit",
    level: "uk",
    what: "Both are reserved, so the rates are the same across the UK.",
    contact: "Your MP",
    sourceId: "sp-powers",
  },
  {
    id: "minimum-wage",
    issue: "The minimum wage",
    level: "uk",
    what: "Employment law is reserved, so the legal minimum is set at Westminster and is the same everywhere in the UK.",
    contact: "Your MP",
    sourceId: "sp-powers",
  },
  {
    id: "energy",
    issue: "Energy bills and the price cap",
    level: "uk",
    what: "Most energy policy is reserved, and the price cap is set by the UK regulator.",
    shared:
      "Renewable energy and home energy efficiency schemes are devolved, so insulation help comes from Edinburgh.",
    contact: "Your MP",
    sourceId: "sp-powers",
  },
  {
    id: "national-insurance",
    issue: "National Insurance and VAT",
    level: "uk",
    what: "Most taxation stays reserved, so these rates are the same across the UK.",
    contact: "Your MP",
    sourceId: "sp-powers",
  },
  {
    id: "income-tax",
    issue: "Income tax on your wages",
    level: "scotland",
    what: "The Scottish Parliament sets the rates and bands on earned income, so Scottish taxpayers pay different amounts from the rest of the UK.",
    shared: "National Insurance is separate and is not devolved.",
    contact: "Your MSPs",
    sourceId: "sp-powers",
  },
  {
    id: "scottish-child-payment",
    issue: "Scottish Child Payment",
    level: "scotland",
    what: "A Scottish benefit, decided at Holyrood and paid by Social Security Scotland.",
    contact: "Your MSPs",
    sourceId: "sp-powers",
  },
  {
    id: "nhs",
    issue: "The NHS and social care",
    level: "scotland",
    what: "Health and social services are devolved, so waiting times and funding are decided in Edinburgh.",
    shared: "Social care is delivered locally, so the service you get is arranged by your council.",
    contact: "Your MSPs",
    sourceId: "sp-powers",
  },
  {
    id: "schools",
    issue: "Schools",
    level: "scotland",
    what: "Education is devolved, so the curriculum, teacher pay and national funding are set in Edinburgh.",
    shared:
      "Your council runs the schools, so buildings, closures, catchment areas and school meals are local decisions.",
    contact: "Your MSPs for policy, your councillors for your school",
    sourceId: "sp-powers",
  },
  {
    id: "housing",
    issue: "Housing and homelessness",
    level: "scotland",
    what: "Housing is devolved, so tenants' rights, rent rules and national housing funding are set in Edinburgh.",
    shared:
      "Councils have the legal duty to house homeless people and decide local planning, so the failure is usually local.",
    contact: "Your MSPs for the law, your councillors for your case",
    sourceId: "sp-powers",
  },
  {
    id: "council-tax",
    issue: "Council tax",
    level: "council",
    what: "Your council sets the rate every year, which is why the bill differs between neighbouring areas.",
    shared:
      "The band system and the discounts are set nationally, and councils cannot change which band a house is in.",
    contact: "Your councillors",
    sourceId: "sp-powers",
  },
  {
    id: "bins",
    issue: "Bins, recycling and street cleaning",
    level: "council",
    what: "Entirely a council service, which is why the cost and the collection day change when you cross a boundary.",
    contact: "Your councillors",
    sourceId: "sp-powers",
  },
  {
    id: "roads",
    issue: "Local roads and potholes",
    level: "council",
    what: "Councils maintain local roads and decide what gets repaired and when.",
    shared: "Motorways and trunk roads are run nationally by Transport Scotland.",
    contact: "Your councillors",
    sourceId: "sp-powers",
  },
  {
    id: "crisis-grants",
    issue: "Crisis Grants and emergency help",
    level: "council",
    what: "The Scottish Welfare Fund is administered by your council, so how quickly you get a decision depends on where you live.",
    shared: "The fund itself is set up and paid for by the Scottish Government.",
    contact: "Your councillors, then your MSPs",
    sourceId: "sp-powers",
  },
];

export function responsibilitiesFor(level: ControlLevel): Responsibility[] {
  return RESPONSIBILITIES.filter((r) => r.level === level);
}
