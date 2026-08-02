/**
 * Council tax and water charges for every Scottish council, by band.
 *
 * Councils publish their own charges but many block automated access, so
 * these come from the national dataset: the Scottish Government publishes
 * council tax by band for all 32 councils, and Scottish Water publishes the
 * unmetered water and waste water charges that are collected alongside it.
 *
 * Council tax and water figures are both 2026-27. The council tax figures are
 * the complete national set published by the Scottish Government on 31 March
 * 2026; the water figures are Scottish Water's published unmetered charges.
 */

export type BandCharge = {
  band: string;
  councilTax: number;
  previousCouncilTax: number;
  councilTaxRise: number;
  councilTaxRisePct: number;
  water: number;
  wasteWater: number;
  total: number;
};

export type CouncilTaxChange = {
  previous: number;
  current: number;
  cash: number;
  percent: number;
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

/** Council tax only, 2025-26, retained as the published comparison year. */
export const councilTaxByBand2025: Record<string, Record<string, number>> = {
  "aberdeen-city": { A: 1090.85, B: 1272.65, C: 1454.46, D: 1636.27, E: 2149.88, F: 2658.94, G: 3204.36, H: 4008.86 },
  "aberdeenshire": { A: 1021.84, B: 1192.15, C: 1362.45, D: 1532.76, E: 2013.88, F: 2490.74, G: 3001.65, H: 3755.26 },
  "angus": { A: 974.35, B: 1136.74, C: 1299.13, D: 1461.52, E: 1920.27, F: 2374.97, G: 2862.14, H: 3580.72 },
  "argyll-and-bute": { A: 1083.76, B: 1264.39, C: 1445.01, D: 1625.64, E: 2135.91, F: 2641.66, G: 3183.55, H: 3982.82 },
  "city-of-edinburgh": { A: 1042.34, B: 1216.06, C: 1389.79, D: 1563.51, E: 2054.28, F: 2540.70, G: 3061.87, H: 3830.60 },
  "clackmannanshire": { A: 1062.92, B: 1240.07, C: 1417.23, D: 1594.38, E: 2094.84, F: 2590.87, G: 3122.33, H: 3906.23 },
  "dumfries-and-galloway": { A: 969.99, B: 1131.65, C: 1293.32, D: 1454.98, E: 1911.68, F: 2364.34, G: 2849.34, H: 3564.70 },
  "dundee-city": { A: 1070.23, B: 1248.60, C: 1426.97, D: 1605.34, E: 2109.24, F: 2608.68, G: 3143.79, H: 3933.08 },
  "east-ayrshire": { A: 1070.96, B: 1249.45, C: 1427.95, D: 1606.44, E: 2110.68, F: 2610.47, G: 3145.95, H: 3935.78 },
  "east-dunbartonshire": { A: 1066.47, B: 1244.21, C: 1421.96, D: 1599.70, E: 2101.83, F: 2599.51, G: 3132.75, H: 3919.27 },
  "east-lothian": { A: 1052.79, B: 1228.25, C: 1403.72, D: 1579.18, E: 2074.87, F: 2566.17, G: 3092.56, H: 3868.99 },
  "east-renfrewshire": { A: 1018.96, B: 1188.79, C: 1358.61, D: 1528.44, E: 2008.20, F: 2483.72, G: 2993.20, H: 3744.68 },
  "falkirk": { A: 1051.18, B: 1226.38, C: 1401.57, D: 1576.77, E: 2071.70, F: 2562.25, G: 3087.84, H: 3863.09 },
  "fife": { A: 999.17, B: 1165.70, C: 1332.23, D: 1498.76, E: 1969.20, F: 2435.49, G: 2935.07, H: 3671.96 },
  "glasgow-city": { A: 1074.00, B: 1253.00, C: 1432.00, D: 1611.00, E: 2116.68, F: 2617.88, G: 3154.88, H: 3946.95 },
  "highland": { A: 1018.06, B: 1187.74, C: 1357.41, D: 1527.09, E: 2006.43, F: 2481.52, G: 2990.55, H: 3741.37 },
  "inverclyde": { A: 1034.20, B: 1206.57, C: 1378.93, D: 1551.30, E: 2038.24, F: 2520.86, G: 3037.96, H: 3800.68 },
  "midlothian": { A: 1110.80, B: 1295.93, C: 1481.07, D: 1666.20, E: 2189.20, F: 2707.58, G: 3262.97, H: 4082.19 },
  "moray": { A: 1049.17, B: 1224.04, C: 1398.90, D: 1573.76, E: 2067.75, F: 2557.36, G: 3081.95, H: 3855.71 },
  "na-h-eileanan-siar": { A: 925.04, B: 1079.21, C: 1233.39, D: 1387.56, E: 1823.10, F: 2254.78, G: 2717.30, H: 3399.52 },
  "north-ayrshire": { A: 1035.85, B: 1208.49, C: 1381.13, D: 1553.77, E: 2041.48, F: 2524.88, G: 3042.80, H: 3806.74 },
  "north-lanarkshire": { A: 968.57, B: 1130.00, C: 1291.43, D: 1452.86, E: 1908.90, F: 2360.90, G: 2845.18, H: 3559.51 },
  "orkney-islands": { A: 1049.73, B: 1224.69, C: 1399.64, D: 1574.60, E: 2068.85, F: 2558.72, G: 3083.59, H: 3857.77 },
  "perth-and-kinross": { A: 1024.69, B: 1195.48, C: 1366.26, D: 1537.04, E: 2019.50, F: 2497.69, G: 3010.04, H: 3765.75 },
  "renfrewshire": { A: 1048.41, B: 1223.14, C: 1397.88, D: 1572.61, E: 2066.23, F: 2555.49, G: 3079.69, H: 3852.89 },
  "scottish-borders": { A: 994.48, B: 1160.23, C: 1325.97, D: 1491.72, E: 1959.95, F: 2424.05, G: 2921.28, H: 3654.71 },
  "shetland-islands": { A: 924.45, B: 1078.52, C: 1232.60, D: 1386.67, E: 1821.93, F: 2253.34, G: 2715.56, H: 3397.34 },
  "south-ayrshire": { A: 1046.27, B: 1220.65, C: 1395.03, D: 1569.41, E: 2062.03, F: 2550.29, G: 3073.43, H: 3845.05 },
  "south-lanarkshire": { A: 919.23, B: 1072.44, C: 1225.64, D: 1378.85, E: 1811.66, F: 2240.63, G: 2700.25, H: 3378.18 },
  "stirling": { A: 1074.52, B: 1253.61, C: 1432.69, D: 1611.78, E: 2117.70, F: 2619.14, G: 3156.40, H: 3948.86 },
  "west-dunbartonshire": { A: 1039.91, B: 1213.22, C: 1386.54, D: 1559.86, E: 2049.48, F: 2534.77, G: 3054.73, H: 3821.66 },
  "west-lothian": { A: 1010.30, B: 1178.68, C: 1347.07, D: 1515.45, E: 1991.13, F: 2462.61, G: 2967.76, H: 3712.85 },
};

/** Council tax only, 2026-27, by council slug then band. */
export const councilTaxByBand: Record<string, Record<string, number>> = {
  "aberdeen-city": { A: 1165.03, B: 1359.20, C: 1553.37, D: 1747.54, E: 2296.07, F: 2839.75, G: 3422.27, H: 4281.47 },
  "aberdeenshire": { A: 1124.03, B: 1311.36, C: 1498.70, D: 1686.04, E: 2215.27, F: 2739.82, G: 3301.83, H: 4130.80 },
  "angus": { A: 1065.77, B: 1243.39, C: 1421.02, D: 1598.65, E: 2100.45, F: 2597.81, G: 3130.69, H: 3916.69 },
  "argyll-and-bute": { A: 1188.89, B: 1387.03, C: 1585.18, D: 1783.33, E: 2343.10, F: 2897.91, G: 3492.35, H: 4369.16 },
  "city-of-edinburgh": { A: 1084.03, B: 1264.71, C: 1445.38, D: 1626.05, E: 2136.45, F: 2642.33, G: 3184.35, H: 3983.82 },
  "clackmannanshire": { A: 1122.45, B: 1309.52, C: 1496.60, D: 1683.67, E: 2212.16, F: 2735.96, G: 3297.19, H: 4124.99 },
  "dumfries-and-galloway": { A: 1052.43, B: 1227.84, C: 1403.24, D: 1578.65, E: 2074.17, F: 2565.31, G: 3091.52, H: 3867.69 },
  "dundee-city": { A: 1153.13, B: 1345.31, C: 1537.50, D: 1729.69, E: 2272.62, F: 2810.75, G: 3387.31, H: 4237.74 },
  "east-ayrshire": { A: 1144.85, B: 1335.66, C: 1526.47, D: 1717.28, E: 2256.32, F: 2790.58, G: 3363.01, H: 4207.34 },
  "east-dunbartonshire": { A: 1167.78, B: 1362.41, C: 1557.04, D: 1751.67, E: 2301.50, F: 2846.46, G: 3430.35, H: 4291.59 },
  "east-lothian": { A: 1131.75, B: 1320.37, C: 1509.00, D: 1697.62, E: 2230.48, F: 2758.63, G: 3324.51, H: 4159.17 },
  "east-renfrewshire": { A: 1080.10, B: 1260.12, C: 1440.13, D: 1620.15, E: 2128.70, F: 2632.74, G: 3172.79, H: 3969.37 },
  "falkirk": { A: 1143.39, B: 1333.96, C: 1524.52, D: 1715.09, E: 2253.44, F: 2787.02, G: 3358.72, H: 4201.97 },
  "fife": { A: 1049.13, B: 1223.99, C: 1398.84, D: 1573.70, E: 2067.67, F: 2557.26, G: 3081.83, H: 3855.57 },
  "glasgow-city": { A: 1137.33, B: 1326.89, C: 1516.44, D: 1706.00, E: 2241.49, F: 2772.25, G: 3340.92, H: 4179.70 },
  "highland": { A: 1089.33, B: 1270.88, C: 1452.44, D: 1633.99, E: 2146.88, F: 2655.23, G: 3199.90, H: 4003.28 },
  "inverclyde": { A: 1115.90, B: 1301.88, C: 1487.87, D: 1673.85, E: 2199.25, F: 2720.01, G: 3277.96, H: 4100.93 },
  "midlothian": { A: 1210.77, B: 1412.57, C: 1614.36, D: 1816.16, E: 2386.23, F: 2951.26, G: 3556.65, H: 4449.59 },
  "moray": { A: 1154.09, B: 1346.44, C: 1538.79, D: 1731.14, E: 2274.53, F: 2813.10, G: 3390.15, H: 4241.29 },
  "na-h-eileanan-siar": { A: 1003.67, B: 1170.94, C: 1338.22, D: 1505.50, E: 1978.06, F: 2446.44, G: 2948.27, H: 3688.48 },
  "north-ayrshire": { A: 1123.89, B: 1311.21, C: 1498.52, D: 1685.84, E: 2215.01, F: 2739.49, G: 3301.44, H: 4130.31 },
  "north-lanarkshire": { A: 1036.37, B: 1209.10, C: 1381.83, D: 1554.56, E: 2042.52, F: 2526.16, G: 3044.35, H: 3808.67 },
  "orkney-islands": { A: 1112.71, B: 1298.17, C: 1483.62, D: 1669.07, E: 2192.97, F: 2712.24, G: 3268.60, H: 4089.22 },
  "perth-and-kinross": { A: 1115.89, B: 1301.88, C: 1487.86, D: 1673.84, E: 2199.24, F: 2719.99, G: 3277.94, H: 4100.91 },
  "renfrewshire": { A: 1127.04, B: 1314.88, C: 1502.72, D: 1690.56, E: 2221.21, F: 2747.16, G: 3310.68, H: 4141.87 },
  "scottish-borders": { A: 1079.01, B: 1258.85, C: 1438.68, D: 1618.52, E: 2126.56, F: 2630.10, G: 3169.60, H: 3965.37 },
  "shetland-islands": { A: 991.93, B: 1157.26, C: 1322.58, D: 1487.90, E: 1954.94, F: 2417.84, G: 2913.80, H: 3645.36 },
  "south-ayrshire": { A: 1129.97, B: 1318.30, C: 1506.63, D: 1694.96, E: 2226.99, F: 2754.31, G: 3319.30, H: 4152.65 },
  "south-lanarkshire": { A: 978.98, B: 1142.15, C: 1305.31, D: 1468.47, E: 1929.41, F: 2386.27, G: 2875.76, H: 3597.76 },
  "stirling": { A: 1168.58, B: 1363.34, C: 1558.11, D: 1752.87, E: 2303.08, F: 2848.41, G: 3432.70, H: 4294.53 },
  "west-dunbartonshire": { A: 1121.02, B: 1307.86, C: 1494.69, D: 1681.53, E: 2209.34, F: 2732.49, G: 3293.00, H: 4119.75 },
  "west-lothian": { A: 1085.06, B: 1265.90, C: 1446.75, D: 1627.59, E: 2138.47, F: 2644.83, G: 3187.36, H: 3987.60 },
};

export const COUNCIL_TAX_YEAR = "2026-27";
export const PREVIOUS_COUNCIL_TAX_YEAR = "2025-26";
export const WATER_YEAR = "2026-27";
export const BAND_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

/** The change in the council-set charge only; Scottish Water is kept separate. */
export function councilTaxChangeFor(slug: string, band: string): CouncilTaxChange | null {
  const current = councilTaxByBand[slug]?.[band];
  const previous = councilTaxByBand2025[slug]?.[band];
  if (current === undefined || previous === undefined) return null;
  const cash = Math.round((current - previous) * 100) / 100;
  return { previous, current, cash, percent: (cash / previous) * 100 };
}

/** The full annual bill for one council and band: council tax plus water. */
export function chargesFor(slug: string): BandCharge[] | null {
  const bands = councilTaxByBand[slug];
  if (!bands) return null;
  return BAND_LETTERS.map((band) => {
    const councilTax = bands[band];
    const change = councilTaxChangeFor(slug, band);
    if (!change) throw new Error(`Missing ${PREVIOUS_COUNCIL_TAX_YEAR} council tax for ${slug}, Band ${band}`);
    const { water, wasteWater } = waterCharges2026[band];
    return {
      band,
      councilTax,
      previousCouncilTax: change.previous,
      councilTaxRise: change.cash,
      councilTaxRisePct: change.percent,
      water,
      wasteWater,
      total: councilTax + water + wasteWater,
    };
  });
}
