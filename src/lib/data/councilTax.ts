/**
 * Council tax and water charges for every Scottish council, by band.
 *
 * Councils publish their own charges but many block automated access, so
 * these come from the national dataset: the Scottish Government publishes
 * council tax by band for all 32 councils, and Scottish Water publishes the
 * unmetered water and waste water charges that are collected alongside it.
 *
 * Council tax figures are 2025-26, the latest complete national set. Water is
 * 2026-27. Where a council has announced a rise for 2026-27 we do not guess
 * it: the year of each figure is stated on the page.
 */

export type BandCharge = {
  band: string;
  councilTax: number;
  water: number;
  wasteWater: number;
  total: number;
};

export const waterCharges2026: Record<string, { water: number; wasteWater: number }> = {
  A: { water: 201.3, wasteWater: 233.58 },
  B: { water: 234.85, wasteWater: 272.51 },
  C: { water: 268.4, wasteWater: 311.44 },
  D: { water: 301.95, wasteWater: 350.37 },
  E: { water: 369.05, wasteWater: 428.23 },
  F: { water: 436.15, wasteWater: 506.09 },
  G: { water: 503.25, wasteWater: 583.95 },
  H: { water: 603.9, wasteWater: 700.74 },
};

/** Council tax only, 2025-26, by council slug then band. */
export const councilTaxByBand: Record<string, Record<string, number>> = {
  "aberdeen-city": { A: 1090.85, B: 1272.65, C: 1454.46, D: 1636.27, E: 2149.88, F: 2658.94, G: 3204.36, H: 4008.86 },
  "aberdeenshire": { A: 1021.84, B: 1192.15, C: 1362.45, D: 1532.76, E: 2013.88, F: 2490.74, G: 3001.65, H: 3755.26 },
  "angus": { A: 974.35, B: 1136.74, C: 1299.13, D: 1461.52, E: 1920.27, F: 2374.97, G: 2862.14, H: 3580.72 },
  "argyll-and-bute": { A: 1083.76, B: 1264.39, C: 1445.01, D: 1625.64, E: 2135.91, F: 2641.66, G: 3183.55, H: 3982.82 },
  "city-of-edinburgh": { A: 1042.34, B: 1216.06, C: 1389.79, D: 1563.51, E: 2054.28, F: 2540.7, G: 3061.87, H: 3830.6 },
  "clackmannanshire": { A: 1062.92, B: 1240.07, C: 1417.23, D: 1594.38, E: 2094.84, F: 2590.87, G: 3122.33, H: 3906.23 },
  "dumfries-and-galloway": { A: 969.99, B: 1131.65, C: 1293.32, D: 1454.98, E: 1911.68, F: 2364.34, G: 2849.34, H: 3564.7 },
  "dundee-city": { A: 1070.23, B: 1248.6, C: 1426.97, D: 1605.34, E: 2109.24, F: 2608.68, G: 3143.79, H: 3933.08 },
  "east-ayrshire": { A: 1070.96, B: 1249.45, C: 1427.95, D: 1606.44, E: 2110.68, F: 2610.47, G: 3145.95, H: 3935.78 },
  "east-dunbartonshire": { A: 1066.47, B: 1244.21, C: 1421.96, D: 1599.7, E: 2101.83, F: 2599.51, G: 3132.75, H: 3919.27 },
  "east-lothian": { A: 1052.79, B: 1228.25, C: 1403.72, D: 1579.18, E: 2074.87, F: 2566.17, G: 3092.56, H: 3868.99 },
  "east-renfrewshire": { A: 1018.96, B: 1188.79, C: 1358.61, D: 1528.44, E: 2008.2, F: 2483.72, G: 2993.2, H: 3744.68 },
  "falkirk": { A: 1051.18, B: 1226.38, C: 1401.57, D: 1576.77, E: 2071.7, F: 2562.25, G: 3087.84, H: 3863.09 },
  "fife": { A: 999.17, B: 1165.7, C: 1332.23, D: 1498.76, E: 1969.2, F: 2435.49, G: 2935.07, H: 3671.96 },
  "glasgow-city": { A: 1074.0, B: 1253.0, C: 1432.0, D: 1611.0, E: 2116.68, F: 2617.88, G: 3154.88, H: 3946.95 },
  "highland": { A: 1018.06, B: 1187.74, C: 1357.41, D: 1527.09, E: 2006.43, F: 2481.52, G: 2990.55, H: 3741.37 },
  "inverclyde": { A: 1034.2, B: 1206.57, C: 1378.93, D: 1551.3, E: 2038.24, F: 2520.86, G: 3037.96, H: 3800.68 },
  "midlothian": { A: 1110.8, B: 1295.93, C: 1481.07, D: 1666.2, E: 2189.2, F: 2707.58, G: 3262.97, H: 4082.19 },
  "moray": { A: 1049.17, B: 1224.04, C: 1398.9, D: 1573.76, E: 2067.75, F: 2557.36, G: 3081.95, H: 3855.71 },
  "na-h-eileanan-siar": { A: 925.04, B: 1079.21, C: 1233.39, D: 1387.56, E: 1823.1, F: 2254.78, G: 2717.3, H: 3399.52 },
  "north-ayrshire": { A: 1035.85, B: 1208.49, C: 1381.13, D: 1553.77, E: 2041.48, F: 2524.88, G: 3042.8, H: 3806.74 },
  "north-lanarkshire": { A: 968.57, B: 1130.0, C: 1291.43, D: 1452.86, E: 1908.9, F: 2360.9, G: 2845.18, H: 3559.51 },
  "orkney-islands": { A: 1049.73, B: 1224.69, C: 1399.64, D: 1574.6, E: 2068.85, F: 2558.72, G: 3083.59, H: 3857.77 },
  "perth-and-kinross": { A: 1024.69, B: 1195.48, C: 1366.26, D: 1537.04, E: 2019.5, F: 2497.69, G: 3010.04, H: 3765.75 },
  "renfrewshire": { A: 1048.41, B: 1223.14, C: 1397.88, D: 1572.61, E: 2066.23, F: 2555.49, G: 3079.69, H: 3852.89 },
  "scottish-borders": { A: 994.48, B: 1160.23, C: 1325.97, D: 1491.72, E: 1959.95, F: 2424.05, G: 2921.28, H: 3654.71 },
  "shetland-islands": { A: 924.45, B: 1078.52, C: 1232.6, D: 1386.67, E: 1821.93, F: 2253.34, G: 2715.56, H: 3397.34 },
  "south-ayrshire": { A: 1046.27, B: 1220.65, C: 1395.03, D: 1569.41, E: 2062.03, F: 2550.29, G: 3073.43, H: 3845.05 },
  "south-lanarkshire": { A: 919.23, B: 1072.44, C: 1225.64, D: 1378.85, E: 1811.66, F: 2240.63, G: 2700.25, H: 3378.18 },
  "stirling": { A: 1074.52, B: 1253.61, C: 1432.69, D: 1611.78, E: 2117.7, F: 2619.14, G: 3156.4, H: 3948.86 },
  "west-dunbartonshire": { A: 1039.91, B: 1213.22, C: 1386.54, D: 1559.86, E: 2049.48, F: 2534.77, G: 3054.73, H: 3821.66 },
  "west-lothian": { A: 1010.3, B: 1178.68, C: 1347.07, D: 1515.45, E: 1991.13, F: 2462.61, G: 2967.76, H: 3712.85 },
};

export const COUNCIL_TAX_YEAR = "2025-26";
export const WATER_YEAR = "2026-27";
export const BAND_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

/** The full annual bill for one council and band: council tax plus water. */
export function chargesFor(slug: string): BandCharge[] | null {
  const bands = councilTaxByBand[slug];
  if (!bands) return null;
  return BAND_LETTERS.map((band) => {
    const councilTax = bands[band];
    const { water, wasteWater } = waterCharges2026[band];
    return { band, councilTax, water, wasteWater, total: councilTax + water + wasteWater };
  });
}
