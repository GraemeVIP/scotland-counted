/**
 * Shoplifting and other theft in Scotland, 1996-97 to 2025-26.
 *
 * Crime counts: Scottish Government, Recorded Crime in Scotland (statistics.gov.scot
 * "recorded-crime" cube, which matches the 2025-26 bulletin: 53,369 shoplifting crimes).
 * Rates per head use the population implied by the published all-crimes count and rate.
 * Food prices: ONS CPI index 01, food and non-alcoholic beverages (D7BU), averaged over
 * each April-to-March year. England and Wales: ONS appendix tables A5a and A7,
 * year ending March 2026. Crisis Grant applications: statistics.gov.scot to 2020-21,
 * then Scottish Welfare Fund tables to March 2026 (Table 6).
 *
 * Built by a one-off extraction; every figure here can be re-derived from those sources.
 */

/** Scotland, all recorded crimes of dishonesty split into shoplifting and everything else. */
export const shopliftingLongRun = [
  { year: "1996-97", shoplifting: 26174, otherDishonesty: 259611 },
  { year: "1997-98", shoplifting: 26984, otherDishonesty: 239902 },
  { year: "1998-99", shoplifting: 30766, otherDishonesty: 246208 },
  { year: "1999-00", shoplifting: 32144, otherDishonesty: 243413 },
  { year: "2000-01", shoplifting: 32264, otherDishonesty: 221031 },
  { year: "2001-02", shoplifting: 31570, otherDishonesty: 211308 },
  { year: "2002-03", shoplifting: 28299, otherDishonesty: 196486 },
  { year: "2003-04", shoplifting: 27948, otherDishonesty: 183056 },
  { year: "2004-05", shoplifting: 28534, otherDishonesty: 181831 },
  { year: "2005-06", shoplifting: 28247, otherDishonesty: 159551 },
  { year: "2006-07", shoplifting: 28750, otherDishonesty: 155010 },
  { year: "2007-08", shoplifting: 29186, otherDishonesty: 137532 },
  { year: "2008-09", shoplifting: 32048, otherDishonesty: 135764 },
  { year: "2009-10", shoplifting: 30332, otherDishonesty: 122924 },
  { year: "2010-11", shoplifting: 29660, otherDishonesty: 126210 },
  { year: "2011-12", shoplifting: 29758, otherDishonesty: 124579 },
  { year: "2012-13", shoplifting: 26449, otherDishonesty: 109450 },
  { year: "2013-14", shoplifting: 27693, otherDishonesty: 109631 },
  { year: "2014-15", shoplifting: 27364, otherDishonesty: 99493 },
  { year: "2015-16", shoplifting: 28424, otherDishonesty: 87365 },
  { year: "2016-17", shoplifting: 28650, otherDishonesty: 84555 },
  { year: "2017-18", shoplifting: 31321, otherDishonesty: 83153 },
  { year: "2018-19", shoplifting: 33523, otherDishonesty: 80983 },
  { year: "2019-20", shoplifting: 30688, otherDishonesty: 80721 },
  { year: "2020-21", shoplifting: 20557, otherDishonesty: 69174 },
  { year: "2021-22", shoplifting: 22913, otherDishonesty: 69960 },
  { year: "2022-23", shoplifting: 28619, otherDishonesty: 74774 },
  { year: "2023-24", shoplifting: 38674, otherDishonesty: 72380 },
  { year: "2024-25", shoplifting: 44730, otherDishonesty: 66183 },
  { year: "2025-26", shoplifting: 53369, otherDishonesty: 64671 },
] as const;

/** Every crime-of-dishonesty category, 2019-20 (before Covid) against 2025-26. */
export const dishonestyCategories = [
  { label: "Shoplifting", y2019: 30688, y2025: 53369 },
  { label: "Other theft", y2019: 41421, y2025: 30320 },
  { label: "Fraud", y2019: 11939, y2025: 15364 },
  { label: "Housebreaking", y2019: 12903, y2025: 6968 },
  { label: "Theft of a motor vehicle", y2019: 5002, y2025: 4898 },
  { label: "Other dishonesty", y2019: 4746, y2025: 4369 },
  { label: "Theft from a motor vehicle", y2019: 2982, y2025: 1537 },
  { label: "Theft by opening lockfast places", y2019: 1728, y2025: 1215 },
] as const;

/** 2013-14 to 2025-26, each indexed so 2019-20 = 100. */
export const indexedTheft = {
  years: ["2013-14", "2014-15", "2015-16", "2016-17", "2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26"],
  shoplifting: [90.2, 89.2, 92.6, 93.4, 102.1, 109.2, 100.0, 67.0, 74.7, 93.3, 126.0, 145.8, 173.9],
  otherTheft: [141.9, 129.3, 112.1, 109.1, 107.3, 103.5, 100.0, 77.3, 80.4, 89.5, 82.8, 77.0, 73.2],
  housebreaking: [172.6, 159.7, 136.7, 126.3, 117.3, 106.8, 100.0, 75.2, 65.8, 68.2, 70.0, 57.2, 54.0],
} as const;

/** Year-on-year change in food prices (April-March average) and in recorded shoplifting. */
export const foodPricesAndShoplifting = [
  { year: "2013-14", foodInflationPct: 3.2, shopliftingChangePct: 4.7, covid: false },
  { year: "2014-15", foodInflationPct: -1.4, shopliftingChangePct: -1.2, covid: false },
  { year: "2015-16", foodInflationPct: -2.5, shopliftingChangePct: 3.9, covid: false },
  { year: "2016-17", foodInflationPct: -1.7, shopliftingChangePct: 0.8, covid: false },
  { year: "2017-18", foodInflationPct: 2.9, shopliftingChangePct: 9.3, covid: false },
  { year: "2018-19", foodInflationPct: 1.5, shopliftingChangePct: 7, covid: false },
  { year: "2019-20", foodInflationPct: 1.5, shopliftingChangePct: -8.5, covid: false },
  { year: "2020-21", foodInflationPct: 0.1, shopliftingChangePct: -33, covid: true },
  { year: "2021-22", foodInflationPct: 1.8, shopliftingChangePct: 11.5, covid: true },
  { year: "2022-23", foodInflationPct: 14.1, shopliftingChangePct: 24.9, covid: false },
  { year: "2023-24", foodInflationPct: 11.3, shopliftingChangePct: 35.1, covid: false },
  { year: "2024-25", foodInflationPct: 2.2, shopliftingChangePct: 15.7, covid: false },
  { year: "2025-26", foodInflationPct: 4.3, shopliftingChangePct: 19.3, covid: false },
] as const;

/** Crisis Grant applications to the Scottish Welfare Fund, Scotland. */
export const crisisGrantApplications = [
  { year: "2013-14", applications: 114520 },
  { year: "2014-15", applications: 142975 },
  { year: "2015-16", applications: 143425 },
  { year: "2016-17", applications: 165075 },
  { year: "2017-18", applications: 174300 },
  { year: "2018-19", applications: 193320 },
  { year: "2019-20", applications: 222065 },
  { year: "2020-21", applications: 271610 },
  { year: "2021-22", applications: 267930 },
  { year: "2022-23", applications: 291585 },
  { year: "2023-24", applications: 260015 },
  { year: "2024-25", applications: 244945 },
  { year: "2025-26", applications: 258490 },
] as const;

/** Police-recorded shoplifting per 1,000 people. Years are April to March. */
export const scotlandVsEnglandWales = [
  { year: "2013-14", scotlandPer1000: 5.21, englandWalesPer1000: 5.67, englandWalesCount: 321065, scotlandCount: 27693 },
  { year: "2014-15", scotlandPer1000: 5.13, englandWalesPer1000: 5.72, englandWalesCount: 326053, scotlandCount: 27364 },
  { year: "2015-16", scotlandPer1000: 5.31, englandWalesPer1000: 5.87, englandWalesCount: 337251, scotlandCount: 28424 },
  { year: "2016-17", scotlandPer1000: 5.33, englandWalesPer1000: 6.4, englandWalesCount: 370294, scotlandCount: 28650 },
  { year: "2017-18", scotlandPer1000: 5.82, englandWalesPer1000: 6.56, englandWalesCount: 382649, scotlandCount: 31321 },
  { year: "2018-19", scotlandPer1000: 6.22, englandWalesPer1000: 6.38, englandWalesCount: 374789, scotlandCount: 33523 },
  { year: "2019-20", scotlandPer1000: 5.67, englandWalesPer1000: 6.09, englandWalesCount: 359245, scotlandCount: 30688 },
  { year: "2020-21", scotlandPer1000: 3.8, englandWalesPer1000: 3.85, englandWalesCount: 228107, scotlandCount: 20557 },
  { year: "2021-22", scotlandPer1000: 4.23, englandWalesPer1000: 4.63, englandWalesCount: 274933, scotlandCount: 22913 },
  { year: "2022-23", scotlandPer1000: 5.25, englandWalesPer1000: 5.74, englandWalesCount: 342378, scotlandCount: 28619 },
  { year: "2023-24", scotlandPer1000: 7.02, englandWalesPer1000: 7.37, englandWalesCount: 443959, scotlandCount: 38674 },
  { year: "2024-25", scotlandPer1000: 8.06, englandWalesPer1000: 8.71, englandWalesCount: 530324, scotlandCount: 44730 },
  { year: "2025-26", scotlandPer1000: 9.63, englandWalesPer1000: 8.2, englandWalesCount: 507086, scotlandCount: 53369 },
] as const;

/** All 32 councils, sorted by 2025-26 rate. Rates are per 10,000 people. Solved is the published clear-up rate (Recorded Crime 2025-26 tables, Table_3). Child poverty is after housing costs, 2023/24. */
export const councilShoplifting = [
  { area: "Dundee City", y2019: 1410, y2025: 3174, rate2019: 95.1, rate2025: 211.8, changePct: 125, solved2019: 65, solved2025: 47.4, childPoverty2023: 26.1 },
  { area: "City of Edinburgh", y2019: 3969, y2025: 10595, rate2019: 78.1, rate2025: 199.6, changePct: 167, solved2019: 53.1, solved2025: 38.4, childPoverty2023: 22.8 },
  { area: "Glasgow City", y2019: 4573, y2025: 9722, rate2019: 74.7, rate2025: 149.5, changePct: 113, solved2019: 57, solved2025: 39.3, childPoverty2023: 36.1 },
  { area: "Inverclyde", y2019: 490, y2025: 1111, rate2019: 61.9, rate2025: 140.7, changePct: 127, solved2019: 79.2, solved2025: 68.8, childPoverty2023: 22.4 },
  { area: "Aberdeen City", y2019: 1989, y2025: 2469, rate2019: 89.3, rate2025: 106.5, changePct: 24, solved2019: 68.1, solved2025: 50.5, childPoverty2023: 19.1 },
  { area: "Fife", y2019: 2152, y2025: 3902, rate2019: 58.1, rate2025: 104.1, changePct: 81, solved2019: 81.7, solved2025: 69.1, childPoverty2023: 25 },
  { area: "West Dunbartonshire", y2019: 580, y2025: 901, rate2019: 64.8, rate2025: 101.1, changePct: 55, solved2019: 65.9, solved2025: 54.5, childPoverty2023: 25.2 },
  { area: "West Lothian", y2019: 961, y2025: 1746, rate2019: 53.5, rate2025: 93.7, changePct: 82, solved2019: 43, solved2025: 40.5, childPoverty2023: 24.1 },
  { area: "East Ayrshire", y2019: 939, y2025: 1101, rate2019: 77.7, rate2025: 90.6, changePct: 17, solved2019: 81.7, solved2025: 70.3, childPoverty2023: 23.6 },
  { area: "Midlothian", y2019: 637, y2025: 873, rate2019: 68.2, rate2025: 87.4, changePct: 37, solved2019: 47.7, solved2025: 39.1, childPoverty2023: 24.6 },
  { area: "South Ayrshire", y2019: 925, y2025: 951, rate2019: 82.6, rate2025: 84.8, changePct: 3, solved2019: 83, solved2025: 70.6, childPoverty2023: 20.7 },
  { area: "North Ayrshire", y2019: 724, y2025: 1131, rate2019: 53.8, rate2025: 84.5, changePct: 56, solved2019: 74.4, solved2025: 70.5, childPoverty2023: 24.3 },
  { area: "Renfrewshire", y2019: 977, y2025: 1574, rate2019: 53.9, rate2025: 83.1, changePct: 61, solved2019: 67.8, solved2025: 51.8, childPoverty2023: 21 },
  { area: "Perth and Kinross", y2019: 661, y2025: 1194, rate2019: 44.1, rate2025: 77.4, changePct: 81, solved2019: 76.2, solved2025: 53.9, childPoverty2023: 19.2 },
  { area: "South Lanarkshire", y2019: 1780, y2025: 2545, rate2019: 55.1, rate2025: 76.2, changePct: 43, solved2019: 66.9, solved2025: 54.8, childPoverty2023: 19.5 },
  { area: "East Lothian", y2019: 476, y2025: 830, rate2019: 43.8, rate2025: 72, changePct: 74, solved2019: 71.4, solved2025: 33, childPoverty2023: 22.1 },
  { area: "North Lanarkshire", y2019: 2121, y2025: 2365, rate2019: 62.1, rate2025: 68.6, changePct: 12, solved2019: 61.9, solved2025: 62.7, childPoverty2023: 24.9 },
  { area: "Clackmannanshire", y2019: 215, y2025: 354, rate2019: 41.6, rate2025: 67.9, changePct: 65, solved2019: 81.4, solved2025: 70.6, childPoverty2023: 28.5 },
  { area: "Angus", y2019: 273, y2025: 756, rate2019: 23.6, rate2025: 65.8, changePct: 177, solved2019: 72.9, solved2025: 66.3, childPoverty2023: 24.1 },
  { area: "Falkirk", y2019: 833, y2025: 1046, rate2019: 52.2, rate2025: 65.3, changePct: 26, solved2019: 72.4, solved2025: 46.2, childPoverty2023: 25.1 },
  { area: "East Dunbartonshire", y2019: 295, y2025: 631, rate2019: 27.1, rate2025: 57.5, changePct: 114, solved2019: 56.9, solved2025: 51.3, childPoverty2023: 14.9 },
  { area: "Highland", y2019: 919, y2025: 1152, rate2019: 39.2, rate2025: 48.6, changePct: 25, solved2019: 84.5, solved2025: 72.7, childPoverty2023: 22.1 },
  { area: "Moray", y2019: 226, y2025: 448, rate2019: 24, rate2025: 47.2, changePct: 98, solved2019: 73, solved2025: 73.9, childPoverty2023: 23 },
  { area: "Dumfries and Galloway", y2019: 672, y2025: 626, rate2019: 45.7, rate2025: 42.9, changePct: -7, solved2019: 81.3, solved2025: 77, childPoverty2023: 22.7 },
  { area: "Stirling", y2019: 352, y2025: 398, rate2019: 38.2, rate2025: 42.2, changePct: 13, solved2019: 81.5, solved2025: 52.5, childPoverty2023: 20.4 },
  { area: "Scottish Borders", y2019: 313, y2025: 444, rate2019: 26.9, rate2025: 38, changePct: 42, solved2019: 68.7, solved2025: 58.3, childPoverty2023: 21.5 },
  { area: "East Renfrewshire", y2019: 178, y2025: 336, rate2019: 18.6, rate2025: 33.7, changePct: 89, solved2019: 58.4, solved2025: 44.9, childPoverty2023: 12 },
  { area: "Aberdeenshire", y2019: 799, y2025: 712, rate2019: 30.6, rate2025: 26.9, changePct: -11, solved2019: 73.3, solved2025: 65.9, childPoverty2023: 15 },
  { area: "Argyll and Bute", y2019: 150, y2025: 207, rate2019: 17.2, rate2025: 23.6, changePct: 38, solved2019: 76, solved2025: 68.6, childPoverty2023: 21.2 },
  { area: "Orkney Islands", y2019: 30, y2025: 34, rate2019: 13.7, rate2025: 15.5, changePct: 13, solved2019: 93.3, solved2025: 91.2, childPoverty2023: 18.6 },
  { area: "Na h-Eileanan Siar", y2019: 21, y2025: 35, rate2019: 8, rate2025: 13.5, changePct: 67, solved2019: 95.2, solved2025: 85.7, childPoverty2023: 19.7 },
  { area: "Shetland Islands", y2019: 48, y2025: 6, rate2019: 20.9, rate2025: 2.6, changePct: -88, solved2019: 100, solved2025: 66.7, childPoverty2023: 14.5 },
] as const;

/** Recorded shoplifting in the two biggest cities. Glasgow was higher every year to 2019-20. */
export const edinburghVsGlasgow = [
  { year: "1996-97", edinburgh: 3796, glasgow: 5332 },
  { year: "1997-98", edinburgh: 3671, glasgow: 6189 },
  { year: "1998-99", edinburgh: 3920, glasgow: 7688 },
  { year: "1999-00", edinburgh: 4062, glasgow: 7377 },
  { year: "2000-01", edinburgh: 3951, glasgow: 7847 },
  { year: "2001-02", edinburgh: 3800, glasgow: 6911 },
  { year: "2002-03", edinburgh: 3274, glasgow: 6248 },
  { year: "2003-04", edinburgh: 3197, glasgow: 5237 },
  { year: "2004-05", edinburgh: 3194, glasgow: 5319 },
  { year: "2005-06", edinburgh: 3275, glasgow: 5199 },
  { year: "2006-07", edinburgh: 3361, glasgow: 4989 },
  { year: "2007-08", edinburgh: 3553, glasgow: 5564 },
  { year: "2008-09", edinburgh: 4448, glasgow: 6166 },
  { year: "2009-10", edinburgh: 3956, glasgow: 5898 },
  { year: "2010-11", edinburgh: 3649, glasgow: 5546 },
  { year: "2011-12", edinburgh: 3609, glasgow: 6330 },
  { year: "2012-13", edinburgh: 3194, glasgow: 5339 },
  { year: "2013-14", edinburgh: 3371, glasgow: 5708 },
  { year: "2014-15", edinburgh: 3138, glasgow: 5421 },
  { year: "2015-16", edinburgh: 3499, glasgow: 5500 },
  { year: "2016-17", edinburgh: 3757, glasgow: 5421 },
  { year: "2017-18", edinburgh: 4223, glasgow: 5615 },
  { year: "2018-19", edinburgh: 4760, glasgow: 5340 },
  { year: "2019-20", edinburgh: 3969, glasgow: 4573 },
  { year: "2020-21", edinburgh: 2597, glasgow: 2418 },
  { year: "2021-22", edinburgh: 3040, glasgow: 2902 },
  { year: "2022-23", edinburgh: 3557, glasgow: 4018 },
  { year: "2023-24", edinburgh: 5747, glasgow: 5553 },
  { year: "2024-25", edinburgh: 8007, glasgow: 7475 },
  { year: "2025-26", edinburgh: 10595, glasgow: 9722 },
] as const;

/** Councils split into thirds by child poverty in 2019/20, before the price rises. Shoplifting per 10,000 people. */
export const shopliftingByPovertyThird = {
  years: ["2013-14", "2014-15", "2015-16", "2016-17", "2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26"],
  leastPoor: [47.5, 47.9, 52.5, 54.0, 57.5, 61.6, 55.1, 38.1, 42.3, 48.1, 67.2, 82.8, 103.0],
  middle: [39.4, 34.8, 36.5, 38.3, 44.4, 49.7, 43.5, 32.8, 34.7, 39.4, 54.6, 64.8, 69.0],
  poorest: [63.3, 64.1, 64.0, 62.2, 67.2, 70.3, 66.2, 41.2, 47.2, 64.2, 82.3, 88.9, 108.3],
  members: {
    leastPoor: ["Aberdeen City", "Aberdeenshire", "City of Edinburgh", "East Dunbartonshire", "East Renfrewshire", "Na h-Eileanan Siar", "Orkney Islands", "Perth and Kinross", "Renfrewshire", "Shetland Islands", "Stirling"],
    middle: ["Angus", "Argyll and Bute", "East Lothian", "Highland", "Inverclyde", "Midlothian", "Moray", "Scottish Borders", "South Lanarkshire", "West Lothian"],
    poorest: ["Clackmannanshire", "Dumfries and Galloway", "Dundee City", "East Ayrshire", "Falkirk", "Fife", "Glasgow City", "North Ayrshire", "North Lanarkshire", "South Ayrshire", "West Dunbartonshire"],
  },
} as const;

/**
 * Clear-up rate: Recorded Crime in Scotland 2025-26 tables, Table_3 (2014-15 and 2015-16 from the 2023-24 tables).
 * Convictions, custody share and average custodial days: Criminal Proceedings in Scotland 2023-24,
 * Tables 4b, 9b and 10c, for people whose main crime was shoplifting. Court figures stop at 2023-24.
 * convictionsPer100 is our division of people convicted by crimes recorded in the same year; court
 * delays mean they are not the same cases, so treat it as a rough guide to direction.
 */
export const shopliftingJustice = [
  { year: "2014-15", recorded: 27364, clearUpPct: 74.6, convicted: 6942, convictionsPer100: 25.4, custodyPct: 30.6, custodyDays: 116 },
  { year: "2015-16", recorded: 28424, clearUpPct: 72.9, convicted: 6596, convictionsPer100: 23.2, custodyPct: 28.5, custodyDays: 115 },
  { year: "2016-17", recorded: 28650, clearUpPct: 71.6, convicted: 6248, convictionsPer100: 21.8, custodyPct: 26.1, custodyDays: 119 },
  { year: "2017-18", recorded: 31321, clearUpPct: 67.4, convicted: 5661, convictionsPer100: 18.1, custodyPct: 26.4, custodyDays: 119 },
  { year: "2018-19", recorded: 33523, clearUpPct: 67.4, convicted: 5928, convictionsPer100: 17.7, custodyPct: 30.8, custodyDays: 118 },
  { year: "2019-20", recorded: 30688, clearUpPct: 66.3, convicted: 5422, convictionsPer100: 17.7, custodyPct: 26.3, custodyDays: 121 },
  { year: "2020-21", recorded: 20557, clearUpPct: 65.7, convicted: 2678, convictionsPer100: 13, custodyPct: 23.1, custodyDays: 127 },
  { year: "2021-22", recorded: 22913, clearUpPct: 56, convicted: 2704, convictionsPer100: 11.8, custodyPct: 23.6, custodyDays: 123 },
  { year: "2022-23", recorded: 28619, clearUpPct: 53.5, convicted: 3004, convictionsPer100: 10.5, custodyPct: 28.2, custodyDays: 116 },
  { year: "2023-24", recorded: 38674, clearUpPct: 50.3, convicted: 2854, convictionsPer100: 7.4, custodyPct: 31.5, custodyDays: 121 },
  { year: "2024-25", recorded: 44730, clearUpPct: 49, convicted: null, convictionsPer100: null, custodyPct: null, custodyDays: null },
  { year: "2025-26", recorded: 53369, clearUpPct: 50.6, convicted: null, convictionsPer100: null, custodyPct: null, custodyDays: null },
] as const;
