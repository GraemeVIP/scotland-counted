/**
 * Child poverty after housing costs for all 32 Scottish council areas.
 *
 * Generated from the End Child Poverty / Loughborough University dataset
 * (Child-poverty-AHC-2015-2024). Percentages are of children aged 0-15.
 * rankLevel 1 = highest rate in Scotland. rankChange 1 = steepest rise.
 */

export type Council = {
  name: string;
  slug: string;
  /** ONS/NRS council area code. */
  code: string;
  /** Poverty rate for each year in COUNCIL_YEARS. */
  pcts: number[];
  /** Number of children in poverty for each year. */
  counts: number[];
  /** Change in percentage points, first year to last. */
  change: number;
  rankLevel: number;
  rankChange: number;
};

export const COUNCIL_YEARS = ["2014/15", "2015/16", "2016/17", "2017/18", "2018/19", "2019/20", "2020/21", "2021/22", "2022/23", "2023/24"];

/** Scotland-wide rate, recomputed from the 32 council figures. */
export const SCOTLAND_PCTS = [21.6, 22.8, 23.3, 24.2, 23.1, 24.2, 20.9, 23.9, 24.5, 23.3];

export const councils: Council[] = [
  {
    name: "Aberdeen City",
    slug: "aberdeen-city",
    code: "S12000033",
    pcts: [18.7, 19.5, 21.3, 22.3, 21.1, 21.3, 18.3, 20.5, 21.8, 19.1],
    counts: [6722, 7075, 7682, 7872, 6062, 7279, 7456, 7994, 8476, 7825],
    change: 0.4,
    rankLevel: 27,
    rankChange: 21,
  },
  {
    name: "Aberdeenshire",
    slug: "aberdeenshire",
    code: "S12000034",
    pcts: [15.6, 16.6, 17.4, 17.6, 15.7, 16.7, 14.2, 16.0, 16.5, 15.0],
    counts: [8444, 8960, 9372, 9257, 7927, 9210, 8074, 8799, 8846, 8164],
    change: -0.6,
    rankLevel: 29,
    rankChange: 26,
  },
  {
    name: "Angus",
    slug: "angus",
    code: "S12000041",
    pcts: [21.1, 21.9, 23.6, 24.1, 23.3, 24.0, 20.6, 24.2, 24.9, 24.1],
    counts: [4649, 4819, 5140, 5000, 4730, 5019, 4600, 5067, 5147, 4927],
    change: 3.0,
    rankLevel: 11,
    rankChange: 4,
  },
  {
    name: "Argyll and Bute",
    slug: "argyll-and-bute",
    code: "S12000035",
    pcts: [20.7, 22.2, 22.7, 23.9, 22.5, 23.3, 18.9, 21.7, 23.5, 21.2],
    counts: [3261, 3433, 3318, 3382, 3417, 3684, 2813, 3062, 3258, 2963],
    change: 0.5,
    rankLevel: 20,
    rankChange: 20,
  },
  {
    name: "City of Edinburgh",
    slug: "city-of-edinburgh",
    code: "S12000036",
    pcts: [18.6, 18.8, 20.7, 21.3, 18.9, 20.3, 17.2, 19.5, 20.4, 22.8],
    counts: [15624, 16102, 17706, 17911, 16222, 17980, 16142, 17339, 17907, 19644],
    change: 4.2,
    rankLevel: 14,
    rankChange: 3,
  },
  {
    name: "Clackmannanshire",
    slug: "clackmannanshire",
    code: "S12000005",
    pcts: [24.2, 25.5, 26.0, 27.3, 26.1, 27.3, 23.9, 28.3, 29.2, 28.5],
    counts: [2440, 2534, 2566, 2585, 2526, 2640, 2480, 2764, 2813, 2719],
    change: 4.3,
    rankLevel: 2,
    rankChange: 2,
  },
  {
    name: "Dumfries and Galloway",
    slug: "dumfries-and-galloway",
    code: "S12000006",
    pcts: [23.3, 25.3, 24.8, 26.4, 25.0, 26.7, 22.9, 26.0, 26.9, 22.7],
    counts: [6356, 6739, 6529, 6650, 6697, 6926, 6243, 6751, 6841, 5672],
    change: -0.6,
    rankLevel: 15,
    rankChange: 25,
  },
  {
    name: "Dundee City",
    slug: "dundee-city",
    code: "S12000042",
    pcts: [23.8, 25.0, 26.4, 27.0, 26.2, 26.8, 22.5, 27.1, 28.2, 26.1],
    counts: [6406, 6743, 7009, 6868, 6719, 7082, 6392, 7208, 7391, 7041],
    change: 2.3,
    rankLevel: 3,
    rankChange: 8,
  },
  {
    name: "East Ayrshire",
    slug: "east-ayrshire",
    code: "S12000008",
    pcts: [24.4, 26.1, 25.8, 26.6, 26.8, 27.3, 24.0, 27.2, 27.9, 23.6],
    counts: [5826, 6205, 6088, 6032, 6175, 6582, 5882, 6314, 6342, 5260],
    change: -0.8,
    rankLevel: 12,
    rankChange: 28,
  },
  {
    name: "East Dunbartonshire",
    slug: "east-dunbartonshire",
    code: "S12000045",
    pcts: [15.2, 15.9, 16.9, 16.6, 14.8, 16.3, 12.5, 14.9, 15.7, 14.9],
    counts: [3180, 3415, 3618, 3571, 3488, 3784, 2963, 3367, 3440, 3290],
    change: -0.3,
    rankLevel: 30,
    rankChange: 23,
  },
  {
    name: "East Lothian",
    slug: "east-lothian",
    code: "S12000010",
    pcts: [21.9, 22.5, 23.4, 24.7, 22.7, 24.5, 18.9, 21.1, 21.3, 22.1],
    counts: [4606, 4730, 4933, 5058, 5195, 5589, 4390, 4765, 4679, 4949],
    change: 0.2,
    rankLevel: 17,
    rankChange: 22,
  },
  {
    name: "East Renfrewshire",
    slug: "east-renfrewshire",
    code: "S12000011",
    pcts: [15.0, 15.6, 15.5, 15.5, 14.6, 15.8, 12.8, 14.4, 14.0, 12.0],
    counts: [3191, 3390, 3374, 3391, 3329, 3649, 3064, 3288, 3247, 2842],
    change: -3.0,
    rankLevel: 32,
    rankChange: 32,
  },
  {
    name: "Falkirk",
    slug: "falkirk",
    code: "S12000014",
    pcts: [22.7, 23.2, 23.5, 24.3, 23.8, 24.8, 21.5, 25.3, 26.2, 25.1],
    counts: [7046, 7216, 7336, 7326, 7417, 7686, 7009, 7771, 7882, 7483],
    change: 2.4,
    rankLevel: 5,
    rankChange: 7,
  },
  {
    name: "Fife",
    slug: "fife",
    code: "S12000047",
    pcts: [23.6, 25.0, 25.0, 26.0, 25.5, 26.4, 22.1, 26.1, 26.6, 25.0],
    counts: [16705, 17840, 17541, 17673, 17671, 18902, 16646, 18602, 18711, 17166],
    change: 1.4,
    rankLevel: 6,
    rankChange: 14,
  },
  {
    name: "Glasgow City",
    slug: "glasgow-city",
    code: "S12000049",
    pcts: [27.1, 29.5, 29.6, 30.9, 31.0, 32.2, 29.4, 32.0, 32.9, 36.1],
    counts: [29527, 32182, 32294, 32796, 30383, 33734, 34829, 35891, 36348, 39319],
    change: 9.0,
    rankLevel: 1,
    rankChange: 1,
  },
  {
    name: "Highland",
    slug: "highland",
    code: "S12000017",
    pcts: [21.4, 22.8, 22.8, 23.3, 22.6, 23.6, 20.5, 22.8, 23.3, 22.1],
    counts: [9614, 10145, 10123, 10049, 10695, 11136, 9404, 9799, 9776, 9097],
    change: 0.7,
    rankLevel: 18,
    rankChange: 18,
  },
  {
    name: "Inverclyde",
    slug: "inverclyde",
    code: "S12000018",
    pcts: [20.9, 23.0, 22.1, 23.3, 23.3, 23.8, 18.2, 24.4, 26.1, 22.4],
    counts: [3241, 3489, 3326, 3339, 3498, 3942, 2821, 3427, 3600, 3139],
    change: 1.5,
    rankLevel: 16,
    rankChange: 13,
  },
  {
    name: "Midlothian",
    slug: "midlothian",
    code: "S12000019",
    pcts: [21.8, 21.1, 23.4, 23.8, 22.5, 23.9, 20.0, 22.7, 23.2, 24.6],
    counts: [3952, 3922, 4337, 4339, 4385, 4583, 4180, 4590, 4592, 4984],
    change: 2.8,
    rankLevel: 8,
    rankChange: 5,
  },
  {
    name: "Moray",
    slug: "moray",
    code: "S12000020",
    pcts: [20.8, 22.0, 23.1, 23.2, 21.9, 23.4, 21.3, 24.1, 23.9, 23.0],
    counts: [3896, 4082, 4156, 4028, 4010, 4248, 3973, 4228, 4182, 3944],
    change: 2.2,
    rankLevel: 13,
    rankChange: 9,
  },
  {
    name: "Na h-Eileanan Siar",
    slug: "na-h-eileanan-siar",
    code: "S12000013",
    pcts: [17.5, 20.6, 20.8, 19.6, 18.7, 20.7, 16.7, 19.8, 18.5, 19.7],
    counts: [884, 992, 995, 934, 1056, 1143, 836, 913, 860, 850],
    change: 2.2,
    rankLevel: 24,
    rankChange: 10,
  },
  {
    name: "North Ayrshire",
    slug: "north-ayrshire",
    code: "S12000021",
    pcts: [24.8, 26.5, 26.2, 27.4, 27.1, 27.9, 24.7, 29.0, 29.2, 24.3],
    counts: [6655, 7038, 6810, 6797, 7083, 6932, 6585, 7141, 7181, 5855],
    change: -0.5,
    rankLevel: 9,
    rankChange: 24,
  },
  {
    name: "North Lanarkshire",
    slug: "north-lanarkshire",
    code: "S12000050",
    pcts: [23.9, 25.5, 25.2, 26.3, 25.5, 26.5, 23.2, 26.6, 26.9, 24.9],
    counts: [16961, 18077, 17772, 17745, 18130, 19372, 17043, 18252, 18264, 16632],
    change: 1.0,
    rankLevel: 7,
    rankChange: 16,
  },
  {
    name: "Orkney Islands",
    slug: "orkney-islands",
    code: "S12000023",
    pcts: [20.3, 20.7, 21.9, 22.4, 21.2, 22.7, 18.2, 20.1, 19.3, 18.6],
    counts: [808, 795, 844, 874, 812, 879, 779, 824, 786, 757],
    change: -1.7,
    rankLevel: 28,
    rankChange: 29,
  },
  {
    name: "Perth and Kinross",
    slug: "perth-and-kinross",
    code: "S12000048",
    pcts: [19.9, 21.2, 21.4, 22.4, 21.1, 22.6, 18.7, 21.9, 21.7, 19.2],
    counts: [5429, 5800, 5786, 5865, 5467, 6089, 5285, 5914, 5750, 5155],
    change: -0.7,
    rankLevel: 26,
    rankChange: 27,
  },
  {
    name: "Renfrewshire",
    slug: "renfrewshire",
    code: "S12000038",
    pcts: [19.3, 20.4, 21.3, 22.8, 21.9, 23.1, 19.5, 23.3, 24.0, 21.0],
    counts: [6672, 7003, 7177, 7453, 6551, 7038, 6919, 7840, 7944, 7241],
    change: 1.7,
    rankLevel: 21,
    rankChange: 12,
  },
  {
    name: "Scottish Borders",
    slug: "scottish-borders",
    code: "S12000026",
    pcts: [20.9, 22.5, 23.2, 23.9, 22.5, 24.2, 19.5, 23.4, 23.6, 21.5],
    counts: [4562, 4941, 4984, 4966, 4683, 5292, 4445, 4963, 4937, 4388],
    change: 0.6,
    rankLevel: 19,
    rankChange: 19,
  },
  {
    name: "Shetland Islands",
    slug: "shetland-islands",
    code: "S12000027",
    pcts: [13.3, 15.2, 16.0, 17.1, 14.4, 15.8, 18.7, 15.4, 16.4, 14.5],
    counts: [626, 710, 714, 736, 604, 743, 906, 700, 765, 668],
    change: 1.2,
    rankLevel: 31,
    rankChange: 15,
  },
  {
    name: "South Ayrshire",
    slug: "south-ayrshire",
    code: "S12000028",
    pcts: [22.7, 23.5, 24.2, 24.6, 24.6, 24.8, 20.6, 24.4, 25.0, 20.7],
    counts: [4650, 4753, 4805, 4708, 4946, 5006, 4270, 4807, 4871, 4005],
    change: -2.0,
    rankLevel: 22,
    rankChange: 30,
  },
  {
    name: "South Lanarkshire",
    slug: "south-lanarkshire",
    code: "S12000029",
    pcts: [21.5, 22.4, 22.5, 23.5, 22.5, 23.1, 19.6, 22.8, 23.6, 19.5],
    counts: [13286, 13890, 13745, 13948, 14496, 14723, 12971, 14292, 14641, 12403],
    change: -2.0,
    rankLevel: 25,
    rankChange: 31,
  },
  {
    name: "Stirling",
    slug: "stirling",
    code: "S12000030",
    pcts: [19.6, 20.0, 20.1, 21.2, 20.2, 21.3, 18.1, 20.8, 20.8, 20.4],
    counts: [3417, 3561, 3498, 3482, 3773, 3628, 3211, 3529, 3499, 3387],
    change: 0.8,
    rankLevel: 23,
    rankChange: 17,
  },
  {
    name: "West Dunbartonshire",
    slug: "west-dunbartonshire",
    code: "S12000039",
    pcts: [23.4, 24.5, 25.1, 26.9, 26.3, 26.8, 23.4, 27.6, 28.0, 25.2],
    counts: [4161, 4332, 4385, 4481, 4264, 4374, 4258, 4696, 4728, 4310],
    change: 1.8,
    rankLevel: 4,
    rankChange: 11,
  },
  {
    name: "West Lothian",
    slug: "west-lothian",
    code: "S12000040",
    pcts: [21.3, 22.1, 23.0, 23.8, 22.9, 24.6, 21.1, 23.9, 24.6, 24.1],
    counts: [8280, 8622, 8871, 8987, 8435, 9326, 8723, 9364, 9440, 9166],
    change: 2.8,
    rankLevel: 10,
    rankChange: 6,
  },
];

export const COUNCIL_COUNT = councils.length;

export function getCouncil(slug: string) {
  return councils.find((c) => c.slug === slug);
}

export function councilsByLevel() {
  return [...councils].sort((a, b) => a.rankLevel - b.rankLevel);
}

export function councilsByChange() {
  return [...councils].sort((a, b) => a.rankChange - b.rankChange);
}

/** Council areas that border Glasgow, used in the commuter-belt analysis. */
export const GLASGOW_NEIGHBOURS = [
  "east-dunbartonshire",
  "east-renfrewshire",
  "north-lanarkshire",
  "renfrewshire",
  "south-lanarkshire",
  "west-dunbartonshire",
];
