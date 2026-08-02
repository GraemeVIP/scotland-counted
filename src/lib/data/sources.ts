import { snpMoneyTimelineSources } from "@/lib/data/snpMoneyTimeline";

/**
 * Every source used on the site, in one place.
 *
 * Primary records are preferred. Where a public event can only be dated
 * from contemporary reporting, the publisher and the limits of that
 * evidence are stated. Derived numbers always explain their working.
 */

export type Source = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** What we took from it. */
  used: string;
  /** Any transformation we applied. Blank means we used it as published. */
  derivation?: string;
};

export const sources: Source[] = [
  {
    id: "sg-poverty-2026",
    title: "Poverty and Income Inequality in Scotland 2022–25",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/poverty-and-income-inequality-in-scotland-2022-25/",
    used: "The Scotland-wide headline poverty rates for all people, children, working-age adults and pensioners, and the share of children in poverty living in a working household.",
  },
  {
    id: "ecp",
    title: "Local child poverty estimates after housing costs, 2015–2024",
    publisher: "End Child Poverty / Loughborough University",
    url: "https://endchildpoverty.org.uk/child-poverty-2025/",
    used: "Child poverty rates and counts for Glasgow and all 32 Scottish council areas.",
    derivation:
      "The Scotland-wide rate is not published in this dataset. I recompute it by summing the 32 council counts and dividing by the implied child populations. The method reproduces the published Scottish rate of 24.5% for 2022/23.",
  },
  {
    id: "aps",
    title: "Annual Population Survey, table T01",
    publisher: "Office for National Statistics, via NOMIS",
    url: "https://www.nomisweb.co.uk/",
    used: "Employment rates for Glasgow and Scotland, 2004–2025.",
    derivation:
      "Rates calculated as people aged 16–64 in employment divided by the resident population aged 16–64, both from the same survey.",
  },
  {
    id: "claimant",
    title: "Claimant Count",
    publisher: "Office for National Statistics, via NOMIS",
    url: "https://www.nomisweb.co.uk/",
    used: "Claimants as a share of residents aged 16–64, each January 2000–2026.",
  },
  {
    id: "ashe",
    title: "Annual Survey of Hours and Earnings, resident and workplace analyses",
    publisher: "Office for National Statistics, via NOMIS",
    url: "https://www.nomisweb.co.uk/",
    used: "Median gross weekly pay within the published full-time employee-job sample, 2008–2025, on both the workplace and residence bases.",
    derivation:
      "These figures are never described as the average wage or annualised as a salary. The two bases are separate medians and cannot show that a particular amount of money leaves an area.",
  },
  {
    id: "ashe-guide",
    title: "Guide to interpreting Annual Survey of Hours and Earnings estimates",
    publisher: "Office for National Statistics",
    url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/methodologies/guidetointerpretingannualsurveyofhoursandearningsasheestimates",
    used: "The sample, exclusions and definition of gross weekly pay behind the pay charts.",
    derivation:
      "ASHE samples PAYE employee jobs, not every worker. The displayed full-time series excludes part-time jobs, self-employment, employees outside PAYE, junior rates and pay affected by absence; gross pay can include overtime, bonuses, shift premiums and allowances.",
  },
  {
    id: "glasgow-labour-profile",
    title: "Labour Market Profile — Glasgow City",
    publisher: "Office for National Statistics, via NOMIS",
    url: "https://www.nomisweb.co.uk/reports/lmp/lad/1778385245/report.aspx",
    used: "The 2025 Glasgow workplace and residence pay estimates and the 2024 split between full-time and part-time employee jobs.",
    derivation:
      "The employee-jobs count shows 128,000 of 442,000 Glasgow employee jobs were part-time in 2024 — 29%. Those jobs are excluded from the full-time pay series.",
  },
  {
    id: "minimum-wage-2026",
    title: "National Minimum Wage and National Living Wage rates",
    publisher: "UK Government",
    url: "https://www.gov.uk/national-minimum-wage-rates",
    used: "The legal hourly minimums from 1 April 2026: £12.71 for workers aged 21 and over, £10.85 for ages 18–20, and £8 for under-18s and eligible apprentices.",
    derivation:
      "The full-time illustration is £12.71 multiplied by 37.5 paid hours and 52 weeks: £24,784.50 gross a year. It is an illustration, not a claim that every minimum-wage worker receives those hours.",
  },
  {
    id: "mis-2025",
    title: "A Minimum Income Standard for the United Kingdom in 2025",
    publisher: "Joseph Rowntree Foundation / Loughborough University",
    url: "https://www.jrf.org.uk/a-minimum-income-standard-for-the-united-kingdom-in-2025",
    used: "The finding that a single adult working full time at the legal minimum reached 76% of the Minimum Income Standard, while a lone parent with children aged 3 and 7 reached 69%.",
  },
  {
    id: "real-living-wage",
    title: "Real Living Wage rates and frequently asked questions",
    publisher: "Living Wage Foundation",
    url: "https://www.livingwage.org.uk/faqs",
    used: "The current voluntary real Living Wage of £13.45 an hour outside London, calculated from living costs rather than set as the legal wage floor.",
    derivation:
      "At 37.5 paid hours for 52 weeks this is £26,227.50 gross a year, £1,443 more than the same-hours illustration at the 2026 legal minimum.",
  },
  {
    id: "jobs-density",
    title: "Jobs Density",
    publisher: "Office for National Statistics, via NOMIS",
    url: "https://www.nomisweb.co.uk/",
    used: "Jobs per working-age resident, Glasgow and Scotland. Published for Glasgow to 2021.",
  },
  {
    id: "ons-le",
    title: "Life Expectancy by Local Authority, time series",
    publisher: "Office for National Statistics",
    url: "https://www.ons.gov.uk/datasets/life-expectancy-by-local-authority",
    used: "Life expectancy at birth by sex, Glasgow and Scotland, 2001–03 to 2017–19.",
  },
  {
    id: "simd",
    title: "Scottish Index of Multiple Deprivation",
    publisher: "Scottish Government, via Understanding Glasgow",
    url: "https://www.understandingglasgow.com/glasgow-indicators/poverty/deprivation/trends",
    used: "Share of Glasgow's population living in Scotland's most deprived 10% and 20% of neighbourhoods, SIMD 2004 and SIMD 2020.",
    derivation:
      "Intermediate releases (2006, 2009, 2012, 2016) are omitted because neighbourhood boundaries were redrawn between the 2001 and 2011 censuses, so the middle points are not comparable with either end.",
  },
  {
    id: "gcph",
    title:
      "History, politics and vulnerability: explaining excess mortality",
    publisher:
      "Walsh, McCartney, Collins, Taulbut and Batty — GCPH, NHS Health Scotland, UWS and UCL, 2016",
    url: "https://www.gcph.co.uk/latest/publications/310-history-politics-and-vulnerability-explaining-excess-mortality",
    used: "The explanation for Glasgow's excess mortality relative to Liverpool and Manchester, and the historical policy causes.",
  },
  {
    id: "scotpho",
    title: "Excess mortality in Scotland and Glasgow",
    publisher: "ScotPHO",
    url: "https://www.scotpho.org.uk/comparative-health/excess-mortality-in-scotland-and-glasgow",
    used: "The size of Glasgow's excess mortality after adjusting for deprivation.",
  },
  {
    id: "targets",
    title: "Tackling Child Poverty Delivery Plan progress report 2024–25",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/tackling-child-poverty-delivery-plan-progress-report-2024-25/pages/6/",
    used: "Outturns against the four statutory interim targets in the Child Poverty (Scotland) Act 2017.",
  },
  {
    id: "jrf",
    title: "What reaching Scotland's child poverty targets requires",
    publisher: "Joseph Rowntree Foundation",
    url: "https://www.jrf.org.uk/news/scale-of-action-needed-to-reach-scottish-child-poverty-targets-requires-every-ounce-of",
    used: "Modelled effect and cost of individual policy options.",
  },
  {
    id: "ippr",
    title: "What would it take to eradicate child poverty in Scotland?",
    publisher: "IPPR Scotland",
    url: "https://www.ippr.org/articles/what-would-it-take-to-eradicate-child-poverty-in-scotland",
    used: "Modelled effect and cost of individual policy options.",
  },
  {
    id: "fai",
    title: "No shortcuts to Scotland's child poverty targets",
    publisher: "Fraser of Allander Institute",
    url: "https://fraserofallander.org/no-shortcuts-to-child-poverty-targets/",
    used: "Independent confirmation that income transfers, not employment programmes, drive the child poverty figure.",
  },
  {
    id: "cpag",
    title: "Two-child limit abolition and Scottish Child Payment rates",
    publisher: "CPAG in Scotland",
    url: "https://cpag.org.uk/news/scotlands-child-poverty-campaigners-hail-two-child-limit-abolition",
    used: "Confirmation of the April 2026 abolition and current Scottish Child Payment rates.",
  },
  {
    id: "thresholds",
    title: "Poverty thresholds by household type",
    publisher: "Trust for London",
    url: "https://trustforlondon.org.uk/data/poverty-thresholds/",
    used: "The poverty line expressed in pounds per week for different household types, 2022/23.",
  },
  {
    id: "housing",
    title: "Glasgow's housing emergency: submission to the Local Government Committee",
    publisher: "Glasgow City Council / Scottish Parliament",
    url: "https://www.parliament.scot/-/media/files/committees/local-gov/correspondence/2025/glasgowcitycouncilsubmision.pdf",
    used: "Temporary accommodation spending and the projected unfunded homelessness shortfall to 2027/28.",
  },
  {
    id: "migration",
    title: "Asylum dispersal in Scotland",
    publisher: "Migration Scotland",
    url: "https://migrationscotland.org.uk/policyarea/asylum-dispersal/",
    used: "Glasgow's share of Scotland's dispersed asylum seekers.",
  },
  {
    id: "ug",
    title: "The Glasgow Indicators Project",
    publisher: "Understanding Glasgow / Glasgow Centre for Population Health",
    url: "https://www.understandingglasgow.com/",
    used: "In-work poverty, neighbourhood variation in child poverty, and workless household figures.",
  },
  {
    id: "ashe-scotland-2025",
    title: "Annual Survey of Hours and Earnings 2025: employee earnings",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/annual-survey-of-hours-and-earnings-2025/pages/employee-earnings/",
    used: "Median gross weekly pay for full-time employees in Scotland, £773.80 in April 2025, used to show that a Glasgow figure slightly above it is expected rather than anomalous.",
  },
  {
    id: "council-tax-scotland",
    title: "Council Tax by band 2025-26 and 2026-27, council tax datasets",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/council-tax-datasets/",
    used: "Council tax by band for all 32 Scottish councils in 2025-26 and 2026-27, including the cash and percentage change between the two years.",
    derivation:
      "The amounts are used as displayed to the nearest penny in the two national workbooks, which record the figures reported by each local authority. Cash and percentage changes are calculated from those two published amounts. Scottish Water charges are excluded from every council-tax comparison and added separately from Scottish Water's published table.",
  },
  {
    id: "scottish-water-2026",
    title: "Unmetered charges 2026-27",
    publisher: "Scottish Water",
    url: "https://www.scottishwater.co.uk/your-home/your-charges/your-charges-2026-2027/unmetered-charges-2026-2027",
    used: "Unmetered water and waste water charges for 2026-27: £201.30 and £233.58 at Band A, £434.88 combined. These are collected with council tax.",
  },
  {
    id: "council-tax-how-it-works",
    title: "How Council Tax works",
    publisher: "mygov.scot",
    url: "https://www.mygov.scot/council-tax",
    used: "Who normally pays Council Tax in Scotland, what it helps fund, and the fact that Scottish Water charges usually appear on the same bill.",
  },
  {
    id: "council-tax-discounts",
    title: "Council Tax discounts, exemptions and reductions",
    publisher: "mygov.scot",
    url: "https://www.mygov.scot/council-tax/discounts-exemptions-and-reductions",
    used: "The single-adult, student, disability, severe mental impairment and low-income routes that can reduce or remove a Council Tax bill.",
  },
  {
    id: "council-tax-reduction-2026",
    title: "Council Tax Reduction in Scotland: 2025-2026",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/council-tax-reduction-scotland-2025-2026/",
    used: "Council Tax Reduction can cover any share of Council Tax liability up to 100%, depending on income and household circumstances.",
  },
  {
    id: "council-tax-band-proposals",
    title: "Making a proposal to alter your Council Tax band",
    publisher: "Scottish Assessors Association",
    url: "https://www.saa.gov.uk/council-tax/council-tax-proposals/",
    used: "The Scotland-specific grounds and deadlines for asking an Assessor to alter a property band, including the six-month window after becoming liable.",
  },
  {
    id: "council-tax-arrears",
    title: "If you cannot pay your Council Tax",
    publisher: "mygov.scot",
    url: "https://www.mygov.scot/council-tax/if-you-cannot-pay",
    used: "Council Tax is a priority debt and residents should contact their council quickly to discuss smaller payments and check reductions or exemptions.",
  },
  {
    id: "council-tax-empty-homes-2026",
    title: "Council tax on second and long-term empty homes: guidance",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/local-government-finance-circular-6-2026-council-tax-on-second-and-long-term-empty-homes-guidance/",
    used: "The discounts, increases and exclusions councils can apply to second homes and properties empty for a long time from 2026.",
  },
  {
    id: "ofgem-cap-2026",
    title: "Energy price cap unit rates and standing charges",
    publisher: "Ofgem",
    url: "https://www.ofgem.gov.uk/information-consumers/energy-advice-households/energy-price-cap-unit-rates-and-standing-charges",
    used: "The 13% rise from 1 July 2026, the £1,862 typical-use illustration, and the electricity, gas and standing-charge rates for July to September 2026.",
  },
  {
    id: "ons-food-prices",
    title: "Cost of living insights: Food",
    publisher: "Office for National Statistics",
    url: "https://www.ons.gov.uk/economy/inflationandpriceindices/articles/costoflivinginsights/food",
    used: "Food and non-alcoholic drink prices rose 38.6% between November 2020 and November 2025, and 31.6% between January 2021 and August 2024 against 9.5% in the preceding decade.",
  },
  {
    id: "scottish-tax-2026",
    title: "Scottish Income Tax: rates and bands, 2026 to 2027",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/scottish-income-tax-rates-and-bands/pages/2026-to-2027/",
    used: "The bands used to work out take-home pay: a £12,570 personal allowance, then 19% to £16,537, 20% to £29,526 and 21% to £43,662.",
  },
  {
    id: "ni-rates-2026",
    title: "National Insurance rates and categories",
    publisher: "UK Government",
    url: "https://www.gov.uk/national-insurance-rates-letters",
    used: "Class 1 employee National Insurance, category A: nothing below £242 a week, 8% between £242 and £967, and 2% above.",
  },
  {
    id: "rent-scotland-2025",
    title: "Private Sector Rent Statistics, Scotland, 2010 to 2025",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/private-sector-rent-statistics-scotland-2010-to-2025/pages/1-bedroom-properties/",
    used: "Average monthly rent for a one-bedroom property in the Greater Glasgow Broad Rental Market Area, £865 in 2025, against £738 across Scotland.",
    derivation:
      "These are predominantly advertised rents, recorded when a property comes to market. They describe what someone moving now would pay, not what every existing tenant pays.",
  },
  {
    id: "uc-what-youll-get",
    title: "Universal Credit: what you'll get",
    publisher: "UK Government",
    url: "https://www.gov.uk/universal-credit/what-youll-get",
    used: "Universal Credit standard allowance of £424.90 a month for a single person aged 25 or over, and the health element of £429.80 a month for a severe condition.",
  },
  {
    id: "uc-earnings",
    title: "Universal Credit: how your wages affect your payments",
    publisher: "UK Government",
    url: "https://www.gov.uk/universal-credit/how-your-wages-affect-your-payments",
    used: "The 55p taper — Universal Credit falls by 55p for every £1 earned — and the work allowances of £427 and £710 a month.",
    derivation:
      "Because the taper is 55p rather than a pound, earnings always raise total income. This is the fact that settles whether anyone is financially better off not working.",
  },
  {
    id: "hmrc-rti",
    title: "Earnings and employment from Pay As You Earn Real Time Information, UK: November 2025",
    publisher: "HM Revenue and Customs / Office for National Statistics",
    url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/earningsandemploymentfrompayasyouearnrealtimeinformationuk/november2025",
    used: "Median monthly pay of £2,538 in October 2025 across all payrolled employees, used as an independent check on the survey-based earnings figures.",
    derivation:
      "This is not a sample. It covers every payroll submission to HMRC, so it is a different method and a different population from ASHE. I annualise it as 12 monthly payments: £30,456.",
  },
  {
    id: "ashe-uk-2025",
    title: "Employee earnings in the UK: 2025",
    publisher: "Office for National Statistics",
    url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/annualsurveyofhoursandearnings/2025",
    used: "UK median gross weekly pay for full-time employees, £766.60 in April 2025, for comparison against the all-employee payroll figure.",
  },
  {
    id: "ons-low-pay-2025",
    title: "Low and high pay in the UK: 2025",
    publisher: "Office for National Statistics",
    url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/lowandhighpayuk/2025",
    used: "That around 2.0 million workers — about 6.6% of the UK workforce — are paid at or below the minimum wage, which is why the middle of the distribution sits well above it.",
  },
  {
    id: "lpc-remit",
    title: "Low Pay Commission Remit 2026: National Living Wage and National Minimum Wage",
    publisher: "UK Government",
    url: "https://www.gov.uk/government/publications/national-minimum-wage-and-national-living-wage-low-pay-commission-remit-2026/low-pay-commission-remit-2026-national-living-wage-and-national-minimum-wage",
    used: "That the National Living Wage is set at two-thirds of median hourly earnings, which is why median full-time pay sits around one and a half times the minimum.",
  },
  {
    id: "ipsa-pay",
    title: "IPSA confirms decision on MPs' pay for 2026-27",
    publisher: "Independent Parliamentary Standards Authority",
    url: "https://www.theipsa.org.uk/news/press-releases/ipsa-confirms-decision-on-mps-pay-for-2026-27",
    used: "The basic annual salary of an MP from 1 April 2026, and the stated target for the rest of this parliament.",
  },
  {
    id: "msp-pay",
    title: "MSP salaries, Scottish Parliament Salaries Scheme",
    publisher: "Scottish Parliament",
    url: "https://www.parliament.scot/msps/msp-salaries",
    used: "The basic annual salary of an MSP from 1 April 2026.",
  },
  {
    id: "written-questions",
    title: "Written questions and answers",
    publisher: "UK Parliament",
    url: "https://www.parliament.uk/about/how/business/written-answers/",
    used: "How a written parliamentary question works, the convention that it is answered within seven days, and the fact that every question and answer is published permanently.",
    derivation:
      "The seven-day expectation is a convention rather than a binding rule, and I say so wherever I use it.",
  },
  {
    id: "hansard",
    title: "Written questions, answers and statements",
    publisher: "UK Parliament (Hansard)",
    url: "https://questions-statements.parliament.uk/",
    used: "The public, searchable record in which written questions and their answers are published.",
  },
  {
    id: "ons-cpi-2026",
    title: "Consumer price inflation, UK: June 2026",
    publisher: "Office for National Statistics",
    url: "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/latest",
    used: "The June 2026 CPI rate of 2.6%, and the distinction between the rate at which prices rise and the price level itself.",
  },
  {
    id: "ons-household-costs-2026",
    title: "Household Costs Indices for UK household groups: January to March 2026",
    publisher: "Office for National Statistics",
    url: "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/householdcostsindicesforukhouseholdgroups/januarytomarch2026",
    used: "Five-year cumulative household-cost growth and the March 2026 rates for low-income households and renters.",
    derivation:
      "I describe the published five-year rise for low-income households of 33.9% as 'about a third'. The HCI figures are official statistics in development and may be revised.",
  },
  {
    id: "sg-cost-living-2025",
    title: "Understanding the Cost of Living Crisis in Scotland",
    publisher: "Scottish Government Cost of Living Analytical Working Group",
    url: "https://www.gov.scot/publications/understanding-cost-living-crisis-scotland/",
    used: "The causes, unequal impact and continuing legacy of the 2021 to 2023 inflation shock in Scotland.",
  },
  {
    id: "sg-private-rents-2025",
    title: "Private Sector Rent Statistics, Scotland, 2010 to 2025",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/private-sector-rent-statistics-scotland-2010-to-2025/",
    used: "Greater Glasgow's average advertised and new-let rents, including the £1,094 monthly two-bedroom average in 2025 and its 94% rise since 2010.",
    derivation:
      "The publication is based predominantly on advertised rents and does not represent what every existing tenant pays. I state that limitation beside the figures.",
  },
  {
    id: "welfare-freeze-act",
    title: "Welfare Reform and Work Act 2016: explanatory notes",
    publisher: "UK Legislation",
    url: "https://www.legislation.gov.uk/ukpga/2016/7/notes/division/3/index.htm",
    used: "The four-year cash freeze applied to specified working-age benefits and tax credits from 2016–17.",
  },
  {
    id: "welfare-freeze-vote",
    title: "Welfare Reform and Work Bill — Commons Division 203",
    publisher: "UK Parliament (Hansard)",
    url: "https://hansard.parliament.uk/Commons/2016-03-02/division/16030293001906/WelfareReformAndWorkBill?outputType=Names",
    used: "The final Commons division on 2 March 2016: 309 MPs voted Aye and 274 voted No.",
  },
  {
    id: "welfare-freeze-impact",
    title: "End the benefit freeze to stop people being swept into poverty",
    publisher: "Joseph Rowntree Foundation",
    url: "https://www.jrf.org.uk/social-security/end-the-benefit-freeze-to-stop-people-being-swept-into-poverty",
    used: "The estimate that the freeze left affected support worth 6.5% less in real terms by 2019 than if it had risen with inflation.",
    derivation: "This is independent modelling, not an administrative count, and is labelled as an estimate.",
  },
  {
    id: "uc-uplift-withdrawal",
    title: "Coronavirus: Withdrawing crisis social security measures",
    publisher: "House of Commons Library",
    url: "https://commonslibrary.parliament.uk/research-briefings/cbp-8973/",
    used: "The temporary £20-a-week Universal Credit increase and its withdrawal in October 2021.",
  },
  {
    id: "lha-2026",
    title: "Local Housing Allowance rates applicable from April 2026 to March 2027",
    publisher: "Scottish Government / Rent Service Scotland",
    url: "https://www.gov.scot/publications/local-housing-allowance-rates/pages/2026-to-2027/",
    used: "The 2026–27 weekly rates for every Scottish rental market area, confirmation that they remain frozen at January 2024 levels, and the newer 2025 rent evidence they sit below.",
  },
  {
    id: "scottish-welfare-fund",
    title: "Scottish Welfare Fund — help with living costs",
    publisher: "mygov.scot",
    url: "https://www.mygov.scot/scottish-welfare-fund",
    used: "Crisis Grants are non-repayable council grants for low-income people facing an unexpected emergency; Community Care Grants serve a different purpose.",
  },
  {
    id: "discretionary-housing-payment",
    title: "Applying for a Discretionary Housing Payment",
    publisher: "mygov.scot",
    url: "https://www.mygov.scot/discretionary-housing-payment",
    used: "Who can apply for extra housing help and the costs it may cover, including bedroom tax, benefit cap, rent shortfalls, deposits and rent in advance.",
  },
  {
    id: "free-school-meals-2026",
    title: "Check who can get free school meals",
    publisher: "mygov.scot",
    url: "https://www.mygov.scot/primary-school-meals",
    used: "The 2026 rules for universal meals in primary 1 to 5 and special schools, and the benefit and income tests for older pupils.",
  },
  {
    id: "school-clothing-grants",
    title: "Help with school clothing costs",
    publisher: "mygov.scot",
    url: "https://www.mygov.scot/clothing-grants",
    used: "School clothing grants are paid by councils and are at least £120 for a primary-age child and £150 for a secondary-age child, with local eligibility rules.",
  },
  {
    id: "mini-budget-2022",
    title: "The 17 October 2022 fiscal statement: summary and background",
    publisher: "House of Commons Library",
    url: "https://commonslibrary.parliament.uk/research-briefings/cbp-9643/",
    used: "The lack of an accompanying OBR forecast, the UK-specific component of the market reaction and the subsequent rise in mortgage rates after the September 2022 mini-budget.",
  },
  {
    id: "brexit-food-prices",
    title: "Brexit and Consumer Food Prices: May 2023 update",
    publisher: "Centre for Economic Performance, London School of Economics",
    url: "https://cep.lse.ac.uk/textonly/_new2014/news/releases/2023_05_25_i508.pdf",
    used: "The modelled effect of post-Brexit non-tariff barriers on UK food prices between December 2019 and March 2023.",
    derivation:
      "This is an academic estimate, not an official price count. The researchers estimated food-price growth would have been eight percentage points lower without the new barriers, equivalent to about £250 per household over the period.",
  },
  {
    id: "nao-energy-market",
    title: "The energy supplier market",
    publisher: "National Audit Office",
    url: "https://www.nao.org.uk/reports/the-energy-supplier-market/",
    used: "Ofgem's estimate that supplier failures would cost consumers £2.7 billion and the NAO finding that licensing and monitoring increased the risk and cost of failure.",
  },
  {
    id: "obr-tax-thresholds-2025",
    title: "Economic and fiscal outlook — November 2025",
    publisher: "Office for Budget Responsibility",
    url: "https://obr.uk/efo/economic-and-fiscal-outlook-november-2025/",
    used: "The extension of frozen personal tax thresholds to 2030–31 and the explanation of fiscal drag.",
  },
  {
    id: "scottish-housing-budget",
    title: "Affordable Housing Supply Programme",
    publisher: "Scottish Parliament Information Centre",
    url: "https://www.parliament.scot/chamber-and-committees/research-prepared-for-parliament/research-briefings/2025/4/22/sb-2515",
    used: "The 25% real-terms fall in the affordable-housing budget in 2024–25, the increase in 2025–26 and the assessment that the 2032 homes target looked challenging.",
  },
  {
    id: "sg-child-payment-2026",
    title: "Five years of Scottish Child Payment",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/news/five-years-of-scottish-child-payment/",
    used: "The April 2026 payment rate and the estimate that the payment keeps 40,000 children out of relative poverty in 2025–26.",
    derivation: "The poverty effect is a Scottish Government estimate and is labelled as such.",
  },
  ...snpMoneyTimelineSources,
];

export const sourcesById: Record<string, Source> = Object.fromEntries(
  sources.map((s) => [s.id, s])
);

export function getSources(ids: string[]) {
  return ids.map((id) => sourcesById[id]).filter(Boolean);
}
