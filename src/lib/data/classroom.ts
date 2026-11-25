export const TEACHING_RESOURCES_PATH = "/modern-studies-teaching-resources";

export type LessonTone = "democracy" | "budget" | "inequality" | "crime" | "world" | "foi";

export type LessonTable = {
  caption: string;
  columns: string[];
  rows: {
    label: string;
    cells: string[];
    barPct?: number;
  }[];
};

export type LessonSource = {
  title: string;
  publisher: string;
  href: string;
  note: string;
  table?: LessonTable;
};

export type LessonStarter = {
  question: string;
  choices: { label: string; correct?: boolean }[];
  answer: string;
};

export type LessonTask = {
  question: string;
  hint: string;
  answer: string;
};

export type LessonExit = {
  question: string;
  answer: string;
};

export type ClassroomLesson = {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  tone: LessonTone;
  level: string;
  minutes: number;
  heroStat: { value: string; label: string };
  relatedGuide: { label: string; href: string };
  objective: string;
  success: string;
  vocabulary: [term: string, meaning: string][];
  starter: LessonStarter;
  sources: LessonSource[];
  tasks: LessonTask[];
  exit: LessonExit;
  extension: string;
  teacherNote: string;
};

export const classroomLessons: ClassroomLesson[] = [
  {
    slug: "who-decides-what",
    title: "Who decides what in Scotland?",
    summary: "Use three real-world scenarios to identify which level of government holds responsibility and what to ask them.",
    topic: "Democracy in Scotland and the UK",
    tone: "democracy",
    level: "S2 to S4 · National 5",
    minutes: 35,
    heroStat: { value: "3", label: "levels of government in Scotland" },
    relatedGuide: { label: "Explore our full Who Decides guide", href: "/who-decides" },
    objective: "Identify which public body is responsible for a decision and justify your choice with evidence.",
    success: "Name the correct level of government and support it with one clear reason from the sources.",
    vocabulary: [
      ["Devolved power", "A policy area where the Scottish Parliament at Holyrood can pass laws, such as education and health."],
      ["Reserved power", "A policy area kept at the UK Parliament in Westminster, such as employment law and immigration."],
      ["Local authority", "Your local council, responsible for delivering day-to-day services such as local roads, bins, and schools."],
    ],
    starter: {
      question: "A resident wants the UK National Minimum Wage increased. Which representative has the power to vote on that change?",
      choices: [
        { label: "A local councillor" },
        { label: "An MSP at Holyrood" },
        { label: "An MP at Westminster", correct: true },
      ],
      answer: "An MP at Westminster. Employment law and the National Minimum Wage are reserved matters. A councillor or MSP can comment on the issue, but neither can legislate to change the legal rate.",
    },
    sources: [
      {
        title: "Devolved and reserved powers",
        publisher: "Scottish Parliament",
        href: "https://www.parliament.scot/about/how-parliament-works/devolved-and-reserved-powers",
        note: "The Scottish Parliament can pass laws on devolved areas including education, health, and justice. Areas such as employment law, defence, and immigration remain reserved to Westminster.",
      },
      {
        title: "Report a pothole",
        publisher: "mygov.scot",
        href: "https://www.mygov.scot/report-pothole",
        note: "Faults on local streets are reported to the local council. Motorways and trunk roads are maintained separately by Transport Scotland, so the type of road determines who is responsible.",
      },
    ],
    tasks: [
      {
        question: "A serious pothole has opened on a council-maintained residential street. Who should receive the first report, and what detail helps them act?",
        hint: "Check Source 2 for who maintains local streets, then think what a roads inspector needs to locate the defect.",
        answer: "The local council's roads service. Including the exact street name or a nearby landmark lets inspectors locate it. Source 2 distinguishes local streets from motorways and trunk roads.",
      },
      {
        question: "A group of pupils wants to propose a change to Scottish education law. Which parliament can pass that change, and which representative could raise it?",
        hint: "Check Source 1 to confirm whether education is devolved or reserved.",
        answer: "The Scottish Parliament, because education is a devolved power. An MSP (constituency or regional) can lodge questions, motions, or legislation at Holyrood.",
      },
      {
        question: "Explain why two separate questions about education might legitimately be sent to two different public bodies.",
        hint: "Separate national legislation and curriculum policy from local delivery such as school buildings and transport.",
        answer: "National law-making and local delivery are separate responsibilities. An MSP deals with Scottish education policy and legislation, whereas the local council manages school buildings, staffing budgets, and local transport.",
      },
      {
        question: "Draft one neutral, specific question for the right public body in either example. Ask for a fact, a reason, or a timescale.",
        hint: "Keep the wording constructive and factual, naming the exact issue clearly.",
        answer: "Example for the council: 'When will the roads team inspect the reported pothole on High Street, and what is the target timescale for repair?' Accept any clear, neutral question addressed to the right body.",
      },
    ],
    exit: {
      question: "Someone wants UK immigration rules changed. Which parliament deals with that issue, and why?",
      answer: "The UK Parliament at Westminster, because immigration is a reserved matter. Award 1 mark for naming the UK Parliament and 1 mark for identifying it as reserved.",
    },
    extension: "Find a real issue in Scotland where two public bodies hold different duties on the same problem. Explain what you would ask each one.",
    teacherNote: "Read the scenarios aloud and let pupils test their answers in pairs. Keep examples fictional so pupils do not need to contact any representative during class.",
  },
  {
    slug: "read-a-council-budget",
    title: "How to read council spending",
    summary: "Calculate real spending changes from Scottish Government figures and evaluate what raw cash totals leave out.",
    topic: "Local government finance and numeracy",
    tone: "budget",
    level: "S3 to S6 · National 5 or Higher",
    minutes: 45,
    heroStat: { value: "£7,778m", label: "net education spend across councils (2024/25)" },
    relatedGuide: { label: "Explore all 32 Scottish councils", href: "/councils" },
    objective: "Compare public spending across two financial years and explain the limits of cash-terms data.",
    success: "Calculate changes accurately with units and identify at least one factor needed to judge real-world impact.",
    vocabulary: [
      ["Net revenue spending", "Day-to-day council spending on services after related fees, charges, and service income are deducted."],
      ["Cash terms", "Figures shown in the pounds spent at the time, without adjusting for inflation."],
      ["Core funding", "General grant funding from the Scottish Government that councils use to run local services."],
    ],
    starter: {
      question: "In a simplified example, a council spends £10m in Year 1 and £12m in Year 2. Does that prove local services improved?",
      choices: [
        { label: "Yes, an extra £2m means better services" },
        { label: "No, inflation, demand, or accounting changes could absorb it", correct: true },
        { label: "No, it proves the council overspent" },
      ],
      answer: "No. Spending rose by £2m in cash terms, but inflation, higher demand, new statutory duties, or changes in how grants are recorded can account for some or all of the rise without improving frontline services.",
    },
    sources: [
      {
        title: "Local Government Finance Statistics, Table 2.1",
        publisher: "Scottish Government",
        href: "https://www.gov.scot/publications/scottish-local-government-finance-statistics-2024-25/pages/2--revenue-expenditure-and-income/",
        note: "Selected net revenue spending across all 32 Scottish councils, in £ million (cash terms). The publication reports an 11.7% cash-terms rise in recorded education spending between 2023/24 and 2024/25.",
        table: {
          caption: "Scottish council net revenue spending (£ million, cash terms)",
          columns: ["Service", "2023/24", "2024/25"],
          rows: [
            { label: "Education", cells: ["£6,960m", "£7,778m"], barPct: 100 },
            { label: "Social work", cells: ["£4,605m", "£4,873m"], barPct: 63 },
            { label: "Roads and transport", cells: ["£454m", "£441m"], barPct: 6 },
          ],
        },
      },
      {
        title: "Explanatory note under Table 2.1",
        publisher: "Scottish Government",
        href: "https://www.gov.scot/publications/scottish-local-government-finance-statistics-2024-25/pages/2--revenue-expenditure-and-income/",
        note: "The report explains that moving an existing Early Learning and Childcare grant into core funding helped drive the reported increase in education spending.",
      },
    ],
    tasks: [
      {
        question: "Calculate the cash-terms change for each service between 2023/24 and 2024/25. State the direction and units clearly.",
        hint: "Subtract the 2023/24 figure from the 2024/25 figure for each row and include £m.",
        answer: "Education rose by £818m (+£818m), social work rose by £268m (+£268m), and roads and transport fell by £13m (-£13m).",
      },
      {
        question: "Calculate the percentage change in education spending using the table figures (divide the change by the 2023/24 figure, then multiply by 100). Why does your answer differ slightly from the 11.7% in Source 1?",
        hint: "Compute 818 ÷ 6,960 × 100, then think about how rounded table figures affect percentages.",
        answer: "818 ÷ 6,960 × 100 is approximately 11.8%. The publication reports 11.7% because the official percentage is calculated from exact unrounded figures before the table values are rounded to the nearest £1m.",
      },
      {
        question: "A commentator claims every school in Scotland received 11.7% more money to spend. Using both sources, explain two flaws with that claim.",
        hint: "Check the geography of the data, what Source 2 says about grant reclassification, and the effect of inflation.",
        answer: "First, the figure is a Scotland-wide council total covering wider education services, not an even rise for every individual school. Second, Source 2 shows reclassifying an existing childcare grant into core funding inflated the recorded increase. Cash-terms figures also ignore inflation.",
      },
      {
        question: "Write one accurate headline sentence supported by the evidence, followed by one question you would ask before judging whether services improved.",
        hint: "Stick to what the table proves (cash terms, net spending, Scotland-wide), then ask about outcomes, inflation, or per-pupil spending.",
        answer: "Headline: 'Recorded net education spending by Scottish councils rose by £818m in cash terms between 2023/24 and 2024/25.' Follow-up: 'How did real-terms spending per pupil and educational outcomes change once grant transfers are stripped out?'",
      },
    ],
    exit: {
      question: "By how much did recorded social work spending change? Give one reason that figure alone cannot prove social care improved.",
      answer: "It rose by £268m. Award 1 mark for +£268m with units, and 1 mark for a valid caveat such as inflation, rising demand for care, or the absence of service outcome data.",
    },
    extension: "Find your own council's published budget page. Check which financial year it covers and whether it reports planned budgets or final actual spending (outturn).",
    teacherNote: "Allow calculators and display the percentage change formula if helpful. Keep planned budgets, actual spending, and service outcomes distinct throughout discussion.",
  },
  {
    slug: "compare-poverty-figures",
    title: "What do Scotland's poverty figures show?",
    summary: "Compare relative poverty rates across groups, practise percentage points, and test two common claims against Scottish Government data.",
    topic: "Social inequality",
    tone: "inequality",
    level: "S3 to S6 · National 5 or Higher",
    minutes: 40,
    heroStat: { value: "21%", label: "of children in relative poverty (AHC)" },
    relatedGuide: { label: "Explore our full Poverty in Scotland guide", href: "/poverty-in-scotland" },
    objective: "Compare relative poverty rates accurately and explain what a rate can and cannot establish about a population.",
    success: "Cite the group, time period, and measure cleanly, and distinguish between rates and headcounts.",
    vocabulary: [
      ["Relative poverty", "Household income below 60% of the UK median, adjusted for household size and composition."],
      ["After housing costs (AHC)", "Disposable income measured after rent, mortgage interest, and water charges are deducted."],
      ["Percentage point", "The arithmetic difference between two percentages (for example, 17% minus 12% equals 5 percentage points)."],
    ],
    starter: {
      question: "Group A has a poverty rate of 12% and Group B has a rate of 17%. How should you describe the gap between them?",
      choices: [
        { label: "5 percentage points", correct: true },
        { label: "5% more people" },
        { label: "A 29% poverty rate" },
      ],
      answer: "5 percentage points. Saying '5% higher' is ambiguous because 17 is actually about 42% larger than 12. Always use 'percentage points' for the direct difference between two rates.",
    },
    sources: [
      {
        title: "Poverty and Income Inequality in Scotland, 2022 to 2025",
        publisher: "Scottish Government",
        href: "https://www.gov.scot/publications/poverty-and-income-inequality-in-scotland-2022-25/",
        note: "Estimated proportion of each group living in relative poverty after housing costs. The release pools three years of household survey data and publishes rounded figures.",
        table: {
          caption: "Estimated share in relative poverty after housing costs (2022 to 2025)",
          columns: ["Group", "Relative poverty rate"],
          rows: [
            { label: "Children", cells: ["21%"], barPct: 100 },
            { label: "Working-age adults", cells: ["18%"], barPct: 86 },
            { label: "Pensioners", cells: ["13%"], barPct: 62 },
          ],
        },
      },
      {
        title: "In-work child poverty summary",
        publisher: "Scottish Government",
        href: "https://www.gov.scot/publications/poverty-and-income-inequality-in-scotland-2022-25/",
        note: "The same release reports that three-quarters (75%) of children in relative poverty lived in a household where at least one adult was in paid work. That share is calculated out of children already counted in relative poverty.",
      },
    ],
    tasks: [
      {
        question: "Which group had the highest relative poverty rate? How many percentage points separated the highest and lowest groups?",
        hint: "Compare the top and bottom values in Source 1 and subtract them.",
        answer: "Children had the highest rate at 21%, and pensioners the lowest at 13%. The gap between them is 8 percentage points.",
      },
      {
        question: "Can you use this table alone to state which group contains the largest total number of people in poverty? Explain what extra information you need.",
        hint: "Think about the size of Scotland's working-age adult population compared with its child population.",
        answer: "No. You need the population size of each group or the raw headcounts. A slightly lower rate (18%) in a much larger population of working-age adults represents far more individuals than a higher rate (21%) among children.",
      },
      {
        question: "Someone claims having a job always keeps a family out of poverty. Use Source 2 to evaluate that claim, and name one factor the figure cannot explain.",
        hint: "Look at the proportion of children in poverty living in working households, then consider wages, hours, and housing costs.",
        answer: "Source 2 refutes the claim: three-quarters of children in relative poverty lived in households where someone was in paid work. However, the statistic alone does not explain why, such as part-time hours, low pay, childcare barriers, or high rent.",
      },
      {
        question: "Write two concise sentences suitable for a school briefing: one accurate comparison citing the period and measure, and one clear limitation of the data.",
        hint: "Name 2022 to 2025, 'relative poverty after housing costs', and one thing the table cannot show.",
        answer: "Example: 'Between 2022 and 2025, 21% of children in Scotland lived in relative poverty after housing costs, 8 percentage points higher than pensioners (13%). However, this summary does not explain how wages, housing costs, or social security policies affected each group.'",
      },
    ],
    exit: {
      question: "How many percentage points higher was the working-age adult rate than the pensioner rate? State either the time period or the measure used.",
      answer: "5 percentage points (18% minus 13%). Award 1 mark for 5 percentage points and 1 mark for citing 2022 to 2025 or relative poverty after housing costs.",
    },
    extension: "Find a published local child poverty estimate for your council area. Check its source, year, and methodology before comparing it with the Scotland-wide survey estimate.",
    teacherNote: "Keep discussion grounded in published statistics and hypothetical cases. Pupils never need to disclose anything about their own household circumstances.",
  },
  {
    slug: "test-a-crime-headline",
    title: "Can the crime figures support the headline?",
    summary: "Compare police recorded crime with the national crime survey and rewrite an overstated headline so it matches the evidence.",
    topic: "Crime and the law",
    tone: "crime",
    level: "S3 to S6 · National 5 or Higher",
    minutes: 40,
    heroStat: { value: "315,357", label: "crimes recorded by Police Scotland (2025/26)" },
    relatedGuide: { label: "Explore our Glasgow crime rate analysis", href: "/crime-rate-glasgow" },
    objective: "Distinguish between police recorded crime statistics and victimisation survey estimates.",
    success: "Write a precise headline and identify at least one limitation of police recorded data.",
    vocabulary: [
      ["Police recorded crime", "Crimes reported to or detected by Police Scotland and logged in official crime statistics."],
      ["Crime survey estimate", "A statistical estimate from interviewing a representative sample of adults, capturing unreported crime too."],
      ["Reporting period", "The exact dates or financial year covered by a statistical release."],
    ],
    starter: {
      question: "A newspaper headline reads 'All crime in Scotland is up'. The official bulletin says 'Police recorded more crimes'. Are those statements equivalent?",
      choices: [
        { label: "Yes, police records capture every crime committed" },
        { label: "No, many offences are never reported to or recorded by police", correct: true },
        { label: "No, police data only covers violent offences" },
      ],
      answer: "No. Many crimes go unreported, and changes in public reporting or police recording practices can move recorded totals even when underlying crime levels differ.",
    },
    sources: [
      {
        title: "Recorded Crime in Scotland, 2025/26",
        publisher: "Scottish Government",
        href: "https://www.gov.scot/publications/recorded-crime-scotland-2025-26/",
        note: "Official totals for all crimes recorded by Police Scotland across each financial year. Between 2024/25 and 2025/26, recorded crime rose by approximately 5%.",
        table: {
          caption: "Total crimes recorded by Police Scotland",
          columns: ["Financial year", "Crimes recorded"],
          rows: [
            { label: "2024/25", cells: ["299,111"], barPct: 95 },
            { label: "2025/26", cells: ["315,357"], barPct: 100 },
          ],
        },
      },
      {
        title: "Scottish Crime and Justice Survey (SCJS)",
        publisher: "Scottish Government",
        href: "https://www.gov.scot/publications/scottish-crime-and-justice-survey-2024-25-main-findings/pages/comparisons-with-other-statistical-sources-of-crime-and-victimisation/",
        note: "The SCJS interviews a sample of adults about their experiences of crime, including incidents never reported to police. It covers a different set of offences and the latest cited survey covers 2024/25.",
      },
    ],
    tasks: [
      {
        question: "How many additional crimes did Police Scotland record in 2025/26 compared with 2024/25? Show your working.",
        hint: "Subtract 299,111 from 315,357.",
        answer: "315,357 minus 299,111 equals 16,246 additional recorded crimes.",
      },
      {
        question: "A draft headline says 'Total crime in Scotland up 5%'. Rewrite it so readers know exactly what was measured and when.",
        hint: "Specify 'police recorded crime', Scotland, the 2025/26 financial year, and the approximate 5% rise.",
        answer: "Example: 'Police recorded crime in Scotland rose by around 5% in 2025/26.' Accept any precise wording specifying police records, Scotland, the period, and the approximate change.",
      },
      {
        question: "Identify one question each source is best suited to answer. Why must you check the survey dates before using Source 2 to test the 2025/26 headline?",
        hint: "Compare what each source measures, then check the exact years on Source 1 and Source 2.",
        answer: "Police statistics track recorded offences across all crime categories every year, while the SCJS estimates adults' wider experiences including unreported crime. Because the cited SCJS ends in 2024/25, it cannot confirm what happened in 2025/26.",
      },
      {
        question: "Suggest one additional source you would consult to understand why recorded crime increased, and explain what it would add.",
        hint: "Think about breakdowns by crime category, police recording methodology notes, or a subsequent SCJS release.",
        answer: "Strong suggestions include the bulletin's breakdown by crime type (for example, shoplifting or cyber-enabled crime), official notes on changes in recording rules, or the 2025/26 SCJS when published.",
      },
    ],
    exit: {
      question: "Write one accurate sentence using the 2025/26 police figure, followed by a second sentence stating one limitation of that figure.",
      answer: "Award 1 mark for accurately stating Police Scotland recorded 315,357 crimes in 2025/26, and 1 mark for a valid limitation such as unreported crime, recording changes, or inability to infer causes.",
    },
    extension: "Compare recorded crime rates per 10,000 population across two Scottish council areas. Explain why rates are fairer than raw totals and what differences between areas still matter.",
    teacherNote: "Use national statistical releases so personal disclosures are never needed. Credit any well-reasoned interpretation that cites the correct source and reporting period.",
  },
  {
    slug: "compare-education-systems",
    title: "What can an international test tell us?",
    summary: "Interpret PISA 2022 scores for Scotland against the OECD average without turning sample estimates into a simplistic league table.",
    topic: "International comparison and source skills",
    tone: "world",
    level: "S4 to S6 · Higher or Advanced Higher",
    minutes: 45,
    heroStat: { value: "493", label: "Scotland PISA reading score vs 476 OECD average" },
    relatedGuide: { label: "Explore all Modern Studies guides", href: "/modern-studies" },
    objective: "Evaluate international education data and explain how sampling uncertainty shapes fair comparisons.",
    success: "Make like-for-like comparisons and explain why small score gaps may be statistically similar.",
    vocabulary: [
      ["PISA", "The OECD Programme for International Student Assessment, testing reading, maths, and science among sampled 15-year-olds."],
      ["Sampling uncertainty", "The natural margin of error when estimating a whole country's score from a tested sample rather than every pupil."],
      ["Statistically similar", "No clear evidence of a real difference once sampling uncertainty is taken into account."],
    ],
    starter: {
      question: "Two countries record estimated mean scores of 499 and 500 in an international sample test. Can you conclude the second country's system is stronger?",
      choices: [
        { label: "Yes, 500 is clearly higher than 499" },
        { label: "No, a 1-point gap may sit well inside sampling uncertainty", correct: true },
        { label: "No, both countries performed below average" },
      ],
      answer: "No. A 1-point gap between sample estimates is usually statistically indistinguishable from zero. You must check margins of error, participation rates, and what the test actually measures.",
    },
    sources: [
      {
        title: "PISA 2022 Highlights: Scotland's Results, Table 1.2",
        publisher: "Scottish Government",
        href: "https://www.gov.scot/publications/programme-international-student-assessment-pisa-2022-highlights-scotlands-results/pages/1/",
        note: "Estimated mean scores (in points) from the 2022 PISA cycle, comparing Scotland against the OECD average across all three tested domains.",
        table: {
          caption: "PISA 2022 estimated mean scores (points)",
          columns: ["Domain", "Scotland", "OECD average"],
          rows: [
            { label: "Reading", cells: ["493", "476"], barPct: 100 },
            { label: "Science", cells: ["483", "485"], barPct: 98 },
            { label: "Mathematics", cells: ["471", "472"], barPct: 95 },
          ],
        },
      },
      {
        title: "Interpretation and Scottish sample note",
        publisher: "Scottish Government",
        href: "https://www.gov.scot/publications/programme-international-student-assessment-pisa-2022-highlights-scotlands-results/pages/1/",
        note: "The official report classifies Scotland as above the OECD average in reading, and statistically similar in mathematics and science. Scotland's pupil participation rate was 79.4%, narrowly below the OECD's 80% benchmark.",
      },
    ],
    tasks: [
      {
        question: "In which domain was Scotland's estimated score clearly above the OECD average? Calculate the difference in points.",
        hint: "Compare Scotland and the OECD average across all three rows in Source 1.",
        answer: "Reading, by 17 points (493 minus 476 equals 17).",
      },
      {
        question: "Explain why claiming 'Scotland performed worse than the OECD average in maths' overstates the evidence.",
        hint: "Look at the 1-point gap (471 vs 472) and check how Source 2 classifies it.",
        answer: "Both scores are sample estimates separated by just 1 point. Once sampling uncertainty is accounted for, Source 2 classifies Scotland's mathematics score as statistically similar to the OECD average.",
      },
      {
        question: "A commentator wants to rank entire national school systems using only the reading score. Give two reasons why this evidence is too narrow.",
        hint: "Consider subject breadth, age group sampled, test year, participation rate, and using an average rather than individual countries.",
        answer: "Valid reasons include: reading is only one domain; PISA samples only 15-year-olds; the cycle reflects 2022 conditions; Scotland's 79.4% participation rate sat just below the 80% threshold; and comparing to an OECD mean does not rank individual countries.",
      },
      {
        question: "Write one fair headline supported by the data, then suggest one other indicator needed to judge an education system more fully.",
        hint: "Anchor your headline in PISA 2022 and reading, then think about exam attainment, attendance, or equity gaps.",
        answer: "Headline: 'Scotland scored above the OECD average in reading in PISA 2022, and similar in maths and science.' Other indicators: National 5 and Higher attainment, attendance rates, destination statistics, or deprivation attainment gaps.",
      },
    ],
    exit: {
      question: "Scotland's estimated science score was 483 against an OECD average of 485. Write a fair conclusion and justify it.",
      answer: "Award 1 mark for concluding Scotland was statistically similar to the OECD average in science, and 1 mark for citing sampling uncertainty or Source 2's classification.",
    },
    extension: "Select a country from your class's World Power or World Issue unit. Locate its 2022 PISA results in one domain and check any published sampling or participation caveats.",
    teacherNote: "Designed as an international source-evaluation exercise that slots alongside whichever World Power or World Issue unit your department teaches.",
  },
  {
    slug: "ask-for-a-public-record",
    title: "How to ask for a public record",
    summary: "Identify which Scottish public authority holds a record and draft a focused, valid Freedom of Information request in class.",
    topic: "Citizenship, participation and research",
    tone: "foi",
    level: "S3 to S6 · National 5 to Advanced Higher",
    minutes: 40,
    heroStat: { value: "20 days", label: "statutory working-day reply limit" },
    relatedGuide: { label: "Check which body runs each service", href: "/who-decides" },
    objective: "Turn a broad civic question into a clear, valid request for recorded public information.",
    success: "Identify the likely public authority and specify the exact record and date range cleanly.",
    vocabulary: [
      ["Freedom of Information (FOI)", "Your statutory right under Scottish law to request recorded information held by covered public authorities."],
      ["Public authority", "An organisation delivering public functions covered by Scottish FOI law, such as a council, NHS board, or Police Scotland."],
      ["Exemption", "A specific legal ground allowing an authority to withhold part or all of a record, such as personal data."],
    ],
    starter: {
      question: "Which prompt asks for recorded information a council can locate under Freedom of Information law?",
      choices: [
        { label: "Why are local buses never on time?" },
        { label: "Please send the annual report on council-supported bus services for 2024/25.", correct: true },
        { label: "Tell me everything you know about public transport." },
      ],
      answer: "The second option. FOI applies to existing recorded information held by an authority, not open-ended opinions or unfocused requests that would exceed cost limits.",
    },
    sources: [
      {
        title: "How do I ask for information?",
        publisher: "Scottish Information Commissioner",
        href: "https://www.foi.scot/how-do-i-ask",
        note: "Under the Freedom of Information (Scotland) Act, a valid request must clearly describe the recorded information sought and be made in a recordable format (such as email or letter). Real requests require the requester's real name and a reply address; use placeholders in class.",
      },
      {
        title: "How long will I have to wait?",
        publisher: "Scottish Information Commissioner",
        href: "https://www.foi.scot/how-long-will-i-wait",
        note: "Scottish public authorities normally have up to 20 working days to respond. A reply may release the record, confirm the information is not held, link to already-published material, or cite an exemption.",
      },
      {
        title: "Classroom practice scenario (fictional)",
        publisher: "Practice task",
        href: "",
        note: "A local council operates public libraries across its area. A youth group wants to investigate how weekly library opening hours changed across two financial years and has heard the council carried out an opening-hours review.",
      },
    ],
    tasks: [
      {
        question: "Which public authority should you approach first? Name one place to check online before submitting a request.",
        hint: "Identify who operates public libraries, then think what councils already publish proactively.",
        answer: "The local council operating the libraries. Check its library web pages, committee meeting papers, or published FOI disclosure log first to see if the record is already publicly available.",
      },
      {
        question: "Draft a concise FOI request asking for recorded library opening hours in 2023/24 and 2024/25, or for the published review.",
        hint: "Name the exact record, the libraries covered, and both financial years clearly.",
        answer: "Example: 'Under the Freedom of Information (Scotland) Act 2002, please provide the recorded schedule of weekly opening hours for each public library you operated in 2023/24 and 2024/25, together with any review of library opening hours covering those years.'",
      },
      {
        question: "Using Source 1, identify the two personal details a real requester must include to make the request legally valid (keep placeholders in class).",
        hint: "Check what the Scottish Information Commissioner says makes a request valid.",
        answer: "The requester's real full name and a valid reply address (email or postal address), submitted in a permanent/recordable written format.",
      },
      {
        question: "State two lawful responses a council could send other than releasing the full document. What should you check if it sends a link to a published report?",
        hint: "Refer to Source 2 for the range of lawful outcomes.",
        answer: "The authority could issue a notice that the information is not held, or withhold part under a legal exemption (or cost limit). If it sends a web link, verify the dates, scope, and whether every part of your request is actually answered.",
      },
    ],
    exit: {
      question: "Rewrite 'Tell me everything about local libraries' as one focused FOI request for a specific council record and time period.",
      answer: "Award 1 mark for naming a specific recorded item (such as the library service annual report, visitor counts, or spending outturn) and 1 mark for defining a clear scope and financial year (such as 2024/25).",
    },
    extension: "Find a real council committee paper online. Identify one documented fact it establishes and one missing figure you could reasonably request under FOI.",
    teacherNote: "Keep this strictly as a classroom drafting exercise using fictional names and placeholders. Any real FOI request should be sent by an adult following school policy.",
  },
  {
    slug: "world-power-usa-inequality",
    title: "World Power (USA): Why do poverty and health gaps persist?",
    summary: "Compare two US Census poverty measures alongside health insurance figures to evaluate social inequality in the world's largest economy.",
    topic: "International issues · World power (USA)",
    tone: "world",
    level: "S3 to S6 · National 5 or Higher",
    minutes: 45,
    heroStat: { value: "36.8m", label: "Americans below the official US poverty line (2023)" },
    relatedGuide: { label: "Compare with poverty in Scotland", href: "/poverty-in-scotland" },
    objective: "Evaluate social and economic inequality in the USA using official US Census Bureau statistics.",
    success: "Distinguish between the two US poverty measures and explain why high median income can coexist with millions living in poverty or without health insurance.",
    vocabulary: [
      ["Official Poverty Measure (OPM)", "The long-standing US poverty threshold based on pre-tax cash income compared against family size."],
      ["Supplemental Poverty Measure (SPM)", "A broader US Census measure that factors in taxes, non-cash support, medical costs, and regional housing costs."],
      ["Uninsured rate", "The share of people who lacked any public or private health insurance coverage throughout the full calendar year."],
    ],
    starter: {
      question: "Real median household income in the USA reached $80,610 in 2023. Does a high national median prove very few Americans live in poverty?",
      choices: [
        { label: "Yes, $80,610 means almost every family is comfortable" },
        { label: "No, a median hides wide gaps between high and low earners", correct: true },
        { label: "No, the median only measures billionaires" },
      ],
      answer: "No. The median shows the middle household, not the spread of incomes. In 2023, 36.8 million people still lived below the Official Poverty Measure even as real median income rose 4.0%.",
    },
    sources: [
      {
        title: "Income and Poverty in the United States: 2023",
        publisher: "U.S. Census Bureau",
        href: "https://www.census.gov/library/publications/2024/demo/p60-283.html",
        note: "Published September 2024 for calendar year 2023. Real median household income rose 4.0% to $80,610, while the two official poverty measures pointed in different directions.",
        table: {
          caption: "Selected U.S. Census Bureau income and poverty indicators (2023)",
          columns: ["Indicator", "2023 figure", "Change vs 2022"],
          rows: [
            { label: "Real median household income", cells: ["$80,610", "+4.0%"], barPct: 100 },
            { label: "Official Poverty Measure (OPM)", cells: ["11.1% (36.8m)", "-0.4 percentage points"], barPct: 45 },
            { label: "Supplemental Poverty Measure (SPM)", cells: ["12.9%", "+0.5 percentage points"], barPct: 52 },
          ],
        },
      },
      {
        title: "Health Insurance Coverage in the United States: 2023",
        publisher: "U.S. Census Bureau",
        href: "https://www.census.gov/library/publications/2024/demo/p60-284.html",
        note: "While 92.0% of the US population had health insurance for all or part of 2023, an estimated 26.4 million people (8.0%) had no coverage at any point in the year, including 5.8% of children under 19 (about 4.4 million children).",
      },
    ],
    tasks: [
      {
        question: "Calculate the gap in percentage points between the 2023 Supplemental Poverty Measure (SPM) and the Official Poverty Measure (OPM). Why can those two official rates move in opposite directions?",
        hint: "Subtract 11.1% from 12.9%, then check what extra costs and benefits the SPM includes in the Key terms box.",
        answer: "1.8 percentage points (12.9% minus 11.1%). They can diverge because the OPM only counts pre-tax cash income, whereas the SPM also captures changes in taxes, safety-net programmes, medical out-of-pocket bills, and regional housing costs.",
      },
      {
        question: "Using Source 1 and Source 2, give two pieces of statistical evidence that strong economic headlines in the USA do not eliminate social inequality.",
        hint: "Contrast the $80,610 median income with the number of people in poverty and the number lacking health insurance.",
        answer: "Even with median household income rising 4.0% to $80,610, 36.8 million people remained below the Official Poverty Measure (11.1%, with SPM rising to 12.9%) and 26.4 million Americans (8.0%), including 4.4 million children, went without health insurance all year.",
      },
      {
        question: "A pupil writes 'Only 8% of Americans lack health insurance, so US healthcare inequality is a minor issue.' Evaluate that claim using both the percentage and headcount in Source 2.",
        hint: "Compare 8.0% with the actual headcount of 26.4 million people and think about the consequences of being uninsured in a largely private healthcare system.",
        answer: "Although 8.0% sounds small beside 92.0% insured, in a population of over 330 million it equals 26.4 million people (more than four times Scotland's total population), including 4.4 million children, who risk severe medical debt or delayed care. Furthermore, being insured for 'part of the year' still leaves gaps.",
      },
      {
        question: "Write one balanced conclusion (two sentences) suitable for a National 5 or Higher Modern Studies USA inequality essay, citing at least two exact figures from the sources.",
        hint: "Acknowledge the rise in median income and high overall insurance coverage, then balance it with the poverty and uninsured figures.",
        answer: "Example: 'Although US real median household income rose 4.0% to $80,610 in 2023 and 92.0% of residents held health insurance, deep social inequality persists. Official U.S. Census data shows 36.8 million people remained below the official poverty line, the Supplemental Poverty Measure climbed to 12.9%, and 26.4 million Americans went uninsured all year.'",
      },
    ],
    exit: {
      question: "State the number of Americans who went without health insurance throughout 2023, and explain one reason why the SPM poverty rate (12.9%) is higher than the OPM rate (11.1%).",
      answer: "Award 1 mark for 26.4 million (or 8.0%), and 1 mark for explaining that the SPM accounts for real-world living costs such as housing and medical expenses (or tax/benefit shifts) omitted by the older OPM.",
    },
    extension: "Compare health insurance coverage and child poverty rates between two contrasting US states (for example, one that expanded Medicaid under the Affordable Care Act and one that did not).",
    teacherNote: "Maps directly to SQA National 5 and Higher Modern Studies International Issues: World Power (USA) social and economic inequality. Encourage pupils to cite both percentages and headcounts in source evaluation answers.",
  },
  {
    slug: "world-issue-global-development",
    title: "World Issue: Why is global poverty still concentrated?",
    summary: "Use World Bank poverty figures and OECD international aid data to evaluate progress on global development and donor commitments.",
    topic: "International issues · World issue (Development)",
    tone: "world",
    level: "S3 to S6 · National 5 or Higher",
    minutes: 45,
    heroStat: { value: "692m", label: "people in extreme poverty under $2.15 a day (2024)" },
    relatedGuide: { label: "Explore all Modern Studies guides", href: "/modern-studies" },
    objective: "Analyse global extreme poverty trends and evaluate how international aid (ODA) is measured against UN targets.",
    success: "Compare absolute donor spending with percentage of GNI and explain why global averages can mask severe regional concentration.",
    vocabulary: [
      ["Extreme poverty ($2.15/day)", "The World Bank international benchmark for living on less than $2.15 per person per day (adjusted for 2017 purchasing power)."],
      ["Official Development Assistance (ODA)", "Government aid designed to promote economic development and welfare in lower-income countries."],
      ["0.7% GNI target", "The long-standing United Nations target asking wealthy donor countries to spend 0.7% of Gross National Income on international aid."],
    ],
    starter: {
      question: "Global extreme poverty fell from nearly 38% in 1990 to 8.5% in 2024. Does that mean every region of the world saw the same rapid progress?",
      choices: [
        { label: "Yes, every continent is on track to end extreme poverty by 2030" },
        { label: "No, extreme poverty is now heavily concentrated in Sub-Saharan Africa and conflict zones", correct: true },
        { label: "No, global extreme poverty has risen since 1990" },
      ],
      answer: "No. While global poverty fell sharply over three decades, progress stalled after 2020 and around two-thirds of the 692 million people in extreme poverty in 2024 lived in Sub-Saharan Africa.",
    },
    sources: [
      {
        title: "Poverty, Prosperity, and Planet Report 2024",
        publisher: "World Bank",
        href: "https://www.worldbank.org/en/publication/poverty-prosperity-and-planet",
        note: "Around 692 million people (8.5% of the global population) lived in extreme poverty (below $2.15 a day) in 2024, down from nearly 38% in 1990. Progress has slowed due to post-pandemic recovery gaps, conflict, debt, and climate shocks, with roughly two-thirds of the world's extreme poor living in Sub-Saharan Africa.",
      },
      {
        title: "Official Development Assistance (ODA) 2024 Figures",
        publisher: "OECD Development Assistance Committee (DAC)",
        href: "https://www.oecd.org/en/topics/official-development-assistance-oda.html",
        note: "Total aid across all OECD-DAC donors stood at $214.6 billion in 2024 (about 0.33% of combined GNI). Only four donor nations met the UN 0.7% target: Norway (1.02%), Luxembourg (1.00%), Sweden (0.79%), and Denmark (0.71%).",
        table: {
          caption: "Selected OECD-DAC international aid donors vs UN 0.7% GNI target (2024)",
          columns: ["Donor", "Share of GNI", "Met 0.7% UN target?"],
          rows: [
            { label: "Norway", cells: ["1.02%", "Yes"], barPct: 100 },
            { label: "Sweden", cells: ["0.79%", "Yes"], barPct: 77 },
            { label: "United Kingdom", cells: ["0.50% ($18.0bn)", "No (set at 0.5% since 2020)"], barPct: 49 },
            { label: "OECD-DAC combined average", cells: ["0.33% ($214.6bn)", "No"], barPct: 32 },
            { label: "United States", cells: ["Largest total ($63.3bn)", "No (well below 0.7%)"], barPct: 24 },
          ],
        },
      },
    ],
    tasks: [
      {
        question: "Using Source 1, calculate roughly how many of the 692 million people in extreme poverty lived in Sub-Saharan Africa in 2024. Name two barriers that slowed progress after 2020.",
        hint: "Work out roughly two-thirds of 692 million, then check the factors listed in Source 1.",
        answer: "Roughly two-thirds of 692 million is around 460 million people. Barriers listed include slow post-pandemic recovery, armed conflict, debt pressures, and climate shocks.",
      },
      {
        question: "Look at Source 2. Why is the United States described as the biggest aid donor in dollar terms ($63.3bn) even though Norway (1.02% of GNI) contributes far more relative to the size of its economy?",
        hint: "Compare total economy size (GNI) with percentage of national income spent.",
        answer: "The US economy is vastly larger than Norway's, so spending a much smaller share of its national income still produces the world's largest total dollar amount ($63.3bn). Measuring by % of GNI compares effort fairly across rich countries of very different sizes.",
      },
      {
        question: "How many percentage points below the UN 0.7% target was the UK's 2024 aid spend (0.50% of GNI)? Why might critics and supporters judge the UK's 0.50% figure differently?",
        hint: "Subtract 0.50% from 0.70%, then compare the UK both to the UN target and to the 0.33% OECD average.",
        answer: "0.20 percentage points below the 0.7% target. Critics argue the cut from 0.7% breaks the UN commitment and reduces support for fragile regions; defenders point out 0.50% still sits well above the 0.33% OECD average while balancing domestic budget pressures.",
      },
      {
        question: "Write two balanced sentences evaluating international responses to global underdevelopment, citing one figure from the World Bank and one from the OECD.",
        hint: "Show both the long-term progress or scale of aid AND the gap that remains.",
        answer: "Example: 'Long-term development efforts helped cut global extreme poverty from nearly 38% in 1990 to 8.5% in 2024, supported by $214.6 billion in annual OECD-DAC aid. However, with 692 million people still living under $2.15 a day and only four donor nations meeting the UN 0.7% GNI target, international support falls short of ending extreme poverty in Sub-Saharan Africa.'",
      },
    ],
    exit: {
      question: "Name two OECD countries that met the UN 0.7% aid target in 2024, and give one reason why measuring aid as a % of GNI is more informative than dollar totals alone.",
      answer: "Award 1 mark for naming two of Norway, Luxembourg, Sweden, or Denmark, and 1 mark for explaining that % of GNI adjusts for economy size so fair comparisons can be made between larger and smaller nations.",
    },
    extension: "Investigate one limitation of Official Development Assistance (such as in-donor refugee costs or tied aid) and explain why some economists argue debt relief and trade access matter as much as direct aid.",
    teacherNote: "Maps directly to SQA National 5 and Higher Modern Studies International Issues: World Issue (Underdevelopment / Global Development). Useful for teaching source comparison between absolute totals and relative shares.",
  },
];

export function classroomLessonPath(slug: string) {
  return `/classroom/${slug}`;
}

export function findClassroomLesson(slug: string) {
  return classroomLessons.find((lesson) => lesson.slug === slug);
}

export function nextClassroomLesson(slug: string) {
  const index = classroomLessons.findIndex((lesson) => lesson.slug === slug);
  if (index < 0) return classroomLessons[0];
  return classroomLessons[(index + 1) % classroomLessons.length];
}
