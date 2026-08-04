/**
 * How many homes sit in each council tax band, by council.
 *
 * Nobody can tell you your band from a postcode. It belongs to the property
 * and only the Scottish Assessors hold it. What this data can do is tell you
 * how likely each band is where you live, which narrows eight options down to
 * two or three and is usually enough for someone to recognise their own bill.
 *
 * Source: Scottish Government, chargeable dwellings, September 2025.
 */

export const dwellingsByBand: Record<string, Record<string, number>> = {
  "aberdeen-city": { A: 20080, B: 26983, C: 19177, D: 16285, E: 15598, F: 9144, G: 8335, H: 1163 },
  "aberdeenshire": { A: 19137, B: 15689, C: 14250, D: 18481, E: 22638, F: 17742, G: 11652, H: 645 },
  "angus": { A: 14223, B: 12595, C: 7271, D: 9093, E: 8268, F: 3346, G: 1778, H: 148 },
  "argyll-and-bute": { A: 7079, B: 9849, C: 9100, D: 6274, E: 7614, F: 4573, G: 3055, H: 244 },
  "city-of-edinburgh": { A: 20539, B: 45381, C: 44114, D: 41485, E: 42786, F: 26045, G: 23814, H: 4306 },
  "clackmannanshire": { A: 5931, B: 7114, C: 2128, D: 2787, E: 3468, F: 2089, G: 943, H: 49 },
  "dumfries-and-galloway": { A: 10409, B: 21992, C: 12269, D: 10375, E: 10822, F: 5639, G: 2670, H: 152 },
  "dundee-city": { A: 25080, B: 16065, C: 9032, D: 9326, E: 7078, F: 2548, G: 1155, H: 37 },
  "east-ayrshire": { A: 24798, B: 9101, C: 5739, D: 7120, E: 6880, F: 3899, G: 1074, H: 49 },
  "east-dunbartonshire": { A: 1007, B: 3565, C: 8298, D: 8660, E: 10601, F: 7274, G: 7195, H: 683 },
  "east-lothian": { A: 1113, B: 9222, C: 15232, D: 7207, E: 7451, F: 6564, G: 5401, H: 719 },
  "east-renfrewshire": { A: 1202, B: 5031, C: 4003, D: 6921, E: 8506, F: 6773, G: 7103, H: 800 },
  "falkirk": { A: 21249, B: 18991, C: 7050, D: 9357, E: 9192, F: 6158, G: 3107, H: 81 },
  "fife": { A: 38349, B: 47026, C: 23711, D: 21723, E: 24425, F: 14593, G: 6975, H: 436 },
  "glasgow-city": { A: 55147, B: 76975, C: 69457, D: 43107, E: 31117, F: 14081, G: 6499, H: 638 },
  "highland": { A: 18253, B: 22729, C: 24549, D: 20652, E: 20128, F: 10203, G: 4806, H: 338 },
  "inverclyde": { A: 17422, B: 6013, C: 3720, D: 3465, E: 3623, F: 1904, G: 1410, H: 215 },
  "midlothian": { A: 919, B: 12427, C: 11087, D: 6016, E: 5650, F: 4819, G: 3226, H: 185 },
  "moray": { A: 11189, B: 10202, C: 7030, D: 6594, E: 6706, F: 2578, G: 724, H: 51 },
  "na-h-eileanan-siar": { A: 4568, B: 3809, C: 2787, D: 1870, E: 1388, F: 198, G: 29, H: 5 },
  "north-ayrshire": { A: 20491, B: 18169, C: 7614, D: 7363, E: 9194, F: 4273, G: 1274, H: 61 },
  "north-lanarkshire": { A: 50044, B: 37340, C: 20354, D: 18499, E: 17649, F: 10806, G: 3174, H: 169 },
  "orkney-islands": { A: 2106, B: 2814, C: 2442, D: 1943, E: 1608, F: 394, G: 27, H: 5 },
  "perth-and-kinross": { A: 8116, B: 14442, C: 12656, D: 11760, E: 12146, F: 8339, G: 6747, H: 696 },
  "renfrewshire": { A: 11261, B: 24360, C: 14984, D: 13473, E: 11548, F: 7153, G: 4455, H: 194 },
  "scottish-borders": { A: 15664, B: 12387, C: 7235, D: 6215, E: 6504, F: 5033, G: 4734, H: 493 },
  "shetland-islands": { A: 2848, B: 1812, C: 2842, D: 1902, E: 1535, F: 326, G: 73, H: 1 },
  "south-ayrshire": { A: 6684, B: 12512, C: 8857, D: 8564, E: 9757, F: 5378, G: 3477, H: 301 },
  "south-lanarkshire": { A: 34485, B: 29815, C: 26508, D: 22424, E: 20953, F: 14415, G: 7359, H: 594 },
  "stirling": { A: 5336, B: 8288, C: 4335, D: 4914, E: 6462, F: 5389, G: 5572, H: 750 },
  "west-dunbartonshire": { A: 7179, B: 16446, C: 7708, D: 6144, E: 4862, F: 1791, G: 835, H: 70 },
  "west-lothian": { A: 16799, B: 24561, C: 10849, D: 9622, E: 10724, F: 7815, G: 3406, H: 203 },
};

/** Scotland-wide totals, for comparison. */
export const dwellingsScotland: Record<string, number> = { A: 498707, B: 583705, C: 426388, D: 369621, E: 366881, F: 221282, G: 142084, H: 14481 };

export const DWELLINGS_YEAR = "September 2025";

/** Share of homes in each band for one council, as whole percentages. */
export function bandShares(slug: string) {
  const d = dwellingsByBand[slug];
  if (!d) return null;
  const total = Object.values(d).reduce((a, b) => a + b, 0);
  return Object.entries(d).map(([band, count]) => ({
    band,
    count,
    share: (count / total) * 100,
  }));
}
