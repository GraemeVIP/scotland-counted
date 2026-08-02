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
      "This stopped families getting normal support for a third or later child. It hit larger families hardest and was finally scrapped in April 2026.",
    cost: "Paid from the UK benefits budget",
    status: "done",
    statusLabel: "Done, April 2026",
    lever: "Westminster",
    sourceIds: ["cpag", "jrf"],
  },
  {
    id: "scp-supplement",
    what: "Give extra Scottish Child Payment to the families at greatest risk",
    effect: "Experts estimate this could lift around 10,000 children out of poverty.",
    cost: "£310m a year",
    status: "partial",
    statusLabel: "Partly",
    lever: "Holyrood",
    sourceIds: ["jrf", "ippr"],
  },
  {
    id: "scp-takeup",
    what: "Make sure every eligible family gets the Scottish Child Payment",
    effect: "Experts estimate this could lift up to 10,000 more children out of poverty by 2030/31.",
    cost: "£60m a year",
    status: "not-done",
    statusLabel: "Not done",
    lever: "Holyrood",
    sourceIds: ["jrf"],
  },
  {
    id: "housing-supply",
    what: "Build enough affordable homes",
    effect:
      "Lower housing costs leave families with more money for food, heat and other basics. It would also cut the huge hotel and B&B bill.",
    cost: "£8–9.2bn over five years",
    status: "not-done",
    statusLabel: "£4.1bn planned",
    lever: "Holyrood",
    sourceIds: ["jrf"],
  },
  {
    id: "lha",
    what: "Make help with private rent match real local rents",
    effect: "Families would no longer have to fill such a large rent gap using money meant for other basics.",
    cost: "Paid from the UK benefits budget",
    status: "not-done",
    statusLabel: "Not done",
    lever: "Westminster",
    sourceIds: ["jrf"],
  },
  {
    id: "childcare",
    what: "Provide childcare for under-3s at times that fit shift work",
    effect:
      "This would help single parents take a job or work more hours.",
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
      "This would help Glasgow meet its legal duty to house people and stop so much public money going on hotel rooms.",
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
    power: "The UK Government controls Universal Credit and help with private rent",
    heading: "UK Government decisions reduced help to families",
    points: [
      {
        emphasis: "The two-child limit ran from April 2017 to April 2026.",
        text: "Families received no normal extra support for a third or later child. A Conservative government introduced the rule. A Labour government kept it for nearly two more years before scrapping it.",
      },
      {
        emphasis: "The benefit freeze from 2016 to 2020",
        text: "kept payments at the same cash amount while prices rose. During those years Glasgow child poverty rose from 27.1% to 32.2%.",
      },
      {
        emphasis: "Help with private rent has been frozen for much of the last decade,",
        text: "so it fell further behind real rents. Families filled the gap using money meant for food, heating and other basics.",
      },
      {
        emphasis: "About 95% of asylum seekers sent to Scotland were housed in Glasgow",
        text: "without enough money to cover the cost. The council said one group of Home Office decisions could cost it more than £53m.",
      },
    ],
    sourceIds: ["cpag", "housing", "migration"],
  },
  {
    id: "holyrood",
    who: "Holyrood",
    power: "The Scottish Government controls housing, childcare and the Scottish Child Payment",
    heading: "Scottish Government promises were missed",
    points: [
      {
        emphasis: "All four legally binding interim targets for 2023/24 were missed.",
        text: "The exact results were 22% against a target below 18%; 17% against 14%; 9% against 8%; and 23% against 8% for children poor for years.",
      },
      {
        emphasis: "Ministers have conceded there is no penalty for missing them,",
        text: "which raises a fair question about what the legislation was for.",
      },
      {
        emphasis: "Housing has £4.1bn planned, against £8–9.2bn experts say is needed",
        text: "— about half of the higher estimate.",
      },
      {
        emphasis: "Council tax was frozen several times,",
        text: "which limited one of the few ways councils can raise money themselves.",
      },
      {
        emphasis: "The 2026–31 plan spends about £90m a year on job support",
        text: "even though the government's own research says direct family income changes the poverty figure more.",
      },
    ],
    sourceIds: ["targets", "jrf", "fai"],
  },
  {
    id: "glasgow",
    who: "Glasgow City Council",
    power: "Glasgow City Council runs homelessness and local services",
    heading: "Past council decisions still cost Glasgow today",
    points: [
      {
        emphasis: "The £770m equal pay settlement",
        text: "covered years of underpaying mainly female workers such as carers, cleaners and caterers. The council sold buildings including the City Chambers and Kelvingrove, then rented them back. That now costs £32.1m a year plus inflation.",
      },
      {
        emphasis: "The council has been in a declared housing emergency since November 2023",
        text: "and expects to keep breaking its legal housing duty into the early 2030s. It spends about £4.5m a month on temporary rooms such as hotels and B&Bs.",
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

/** The four reasons Glasgow specifically, used on /why-poverty-is-worse-in-glasgow. */
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
