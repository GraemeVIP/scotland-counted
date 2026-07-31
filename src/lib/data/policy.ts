/**
 * The costed policy options, and the accountability record.
 *
 * Every claim here is a documented decision or a published figure.
 * Where a modelled effect is quoted, the modeller is named. We do not
 * attribute motives, and we do not name individual politicians —
 * the record is about decisions and their measured consequences.
 */

export type FixStatus = "done" | "partial" | "not-done";

export type Fix = {
  id: string;
  what: string;
  effect: string;
  cost: string;
  status: FixStatus;
  statusLabel: string;
  /** Who has the power to do it. */
  lever: "Westminster" | "Holyrood" | "Glasgow City Council";
  sourceIds: string[];
};

export const fixes: Fix[] = [
  {
    id: "two-child-limit",
    what: "Scrap the two-child limit",
    effect:
      "The single biggest lever there is. It hits larger families hardest, and Glasgow has more of them than anywhere comparable in Scotland.",
    cost: "Paid by the UK",
    status: "done",
    statusLabel: "Done, April 2026",
    lever: "Westminster",
    sourceIds: ["cpag", "jrf"],
  },
  {
    id: "scp-supplement",
    what: "Top up the Scottish Child Payment for babies, disabled households and single parents",
    effect: "Around 10,000 children lifted out of poverty.",
    cost: "£310m a year",
    status: "partial",
    statusLabel: "Partly",
    lever: "Holyrood",
    sourceIds: ["jrf", "ippr"],
  },
  {
    id: "scp-takeup",
    what: "Make sure every family entitled to the Scottish Child Payment actually receives it",
    effect: "Up to 10,000 more children out of poverty by 2030/31.",
    cost: "£60m a year",
    status: "not-done",
    statusLabel: "Not done",
    lever: "Holyrood",
    sourceIds: ["jrf"],
  },
  {
    id: "housing-supply",
    what: "Build enough housing to meet assessed need",
    effect:
      "Cuts poverty directly, because poverty is counted after rent. Ends the temporary accommodation bill.",
    cost: "£8–9.2bn over five years",
    status: "not-done",
    statusLabel: "£4.1bn planned",
    lever: "Holyrood",
    sourceIds: ["jrf"],
  },
  {
    id: "lha",
    what: "Raise housing benefit back in line with real local rents",
    effect: "The most direct lever on the one measure Glasgow fails worst.",
    cost: "UK decision",
    status: "not-done",
    statusLabel: "Not done",
    lever: "Westminster",
    sourceIds: ["jrf"],
  },
  {
    id: "childcare",
    what: "Childcare for under-3s, with hours that match shift work",
    effect:
      "Removes the main thing stopping single parents taking or increasing work.",
    cost: "£15m set aside",
    status: "partial",
    statusLabel: "Barely",
    lever: "Holyrood",
    sourceIds: ["ug"],
  },
  {
    id: "homelessness",
    what: "Fund Glasgow's homelessness shortfall",
    effect:
      "Ends a projected seven-year breach of the law and stops reserves being spent on hotel rooms.",
    cost: "£56m (2026/27), £73m (2027/28)",
    status: "not-done",
    statusLabel: "Not done",
    lever: "Holyrood",
    sourceIds: ["housing"],
  },
];

export type Tier = {
  id: string;
  who: string;
  power: string;
  heading: string;
  points: { text: string; emphasis?: string }[];
  sourceIds: string[];
};

export const tiers: Tier[] = [
  {
    id: "westminster",
    who: "Westminster",
    power: "Controls Universal Credit, the two-child limit and housing benefit",
    heading: "Nine years of the two-child limit",
    points: [
      {
        emphasis: "The two-child limit ran from April 2017 to April 2026.",
        text: "No extra benefit support for a third or later child. A Conservative government introduced it; a Labour government kept it for nearly two years after taking office. It was designed to cut support for larger families, and Glasgow has more larger families than anywhere comparable in Scotland. It was scrapped only after nine years.",
      },
      {
        emphasis: "The benefit freeze from 2016 to 2020",
        text: "held payments flat in cash while prices rose — a real cut every year, during exactly the years Glasgow's child poverty climbed from 27.1% to 32.2%.",
      },
      {
        emphasis: "Housing benefit has been frozen for most of the past decade,",
        text: "so it drifted further below what landlords actually charge. Since poverty is measured after rent, that is arithmetic, not bad luck.",
      },
      {
        emphasis: "Asylum dispersal placed roughly 95% of Scotland's asylum seekers in one city",
        text: "without funding the consequences. The council estimated one batch of Home Office decisions alone could cost it more than £53m.",
      },
    ],
    sourceIds: ["cpag", "housing", "migration"],
  },
  {
    id: "holyrood",
    who: "Holyrood",
    power: "Sets the legal targets, and controls housing, childcare and the Scottish Child Payment",
    heading: "Legal targets, missed, with no consequence",
    points: [
      {
        emphasis: "All four legally binding interim targets for 2023/24 were missed.",
        text: "Relative poverty came in at 22% against a target under 18%. Absolute poverty 17% against 14%. Low income and material deprivation 9% against 8%. Persistent poverty — children stuck poor for years — hit 23% against a target of 8%, nearly three times over.",
      },
      {
        emphasis: "Ministers have conceded there is no penalty for missing them,",
        text: "which raises a fair question about what the legislation was for.",
      },
      {
        emphasis: "Housing is funded at £4.1bn against £8–9.2bn assessed as needed",
        text: "— roughly half, in the policy area that most directly drives the poverty figure.",
      },
      {
        emphasis: "Repeated council tax freezes",
        text: "have frozen the only significant revenue lever councils control. Holyrood takes the credit; councils administer the cuts.",
      },
      {
        emphasis: "The 2026–31 delivery plan leans on about £90m a year of employment schemes",
        text: "when the government's own commissioned evidence says cash transfers, not job programmes, are what move the number. It picked the cheaper lever, not the effective one.",
      },
    ],
    sourceIds: ["targets", "jrf", "fai"],
  },
  {
    id: "glasgow",
    who: "Glasgow City Council",
    power: "Runs housing, homelessness and local services",
    heading: "A budget mortgaged to its own past",
    points: [
      {
        emphasis: "The £770m equal pay settlement",
        text: "was the bill for decades of underpaying a mostly female workforce — carers, cleaners, caterers. No other Scottish council carries anything like it, and it was self-inflicted. It was funded by selling the City Chambers and Kelvingrove and renting them back, now costing £32.1m a year plus inflation. Money that would be services is permanently rent.",
      },
      {
        emphasis: "The council has been in a declared housing emergency since November 2023",
        text: "and expects to be breaching homelessness law until the early 2030s, while spending about £4.5m a month on temporary accommodation — the most expensive possible way to house people badly.",
      },
      {
        emphasis: "Both main parties have had long runs at this.",
        text: "Labour ran Glasgow for most of the post-war period; the SNP has run it since 2017. This is not one party's record.",
      },
    ],
    sourceIds: ["housing"],
  },
];

/** The four statutory targets and what was actually delivered. */
export const statutoryTargets = [
  { measure: "Relative poverty", target: "under 18%", actual: "22%", missed: true },
  { measure: "Absolute poverty", target: "under 14%", actual: "17%", missed: true },
  {
    measure: "Low income and material deprivation",
    target: "under 8%",
    actual: "9%",
    missed: true,
  },
  { measure: "Persistent poverty", target: "under 8%", actual: "23%", missed: true },
];

/** The four reasons Glasgow specifically, used on /why-glasgow. */
export const causes = [
  {
    id: "inheritance",
    n: 1,
    title: "The damage was done deliberately, decades ago",
    lead: "Even compared with places just as poor, Glasgow does worse.",
  },
  {
    id: "commuter",
    n: 2,
    title: "The city is full of good jobs. Glaswegians aren't the ones in them.",
    lead: "There are more jobs in Glasgow than there are adults in Glasgow.",
  },
  {
    id: "families",
    n: 3,
    title: "The families hit hardest are concentrated here",
    lead: "Being treated the same as everywhere else hurts more here.",
  },
  {
    id: "rent",
    n: 4,
    title: "Rent, which is why the numbers moved at all",
    lead: "Housing costs rose faster than the help available to pay them.",
  },
];
