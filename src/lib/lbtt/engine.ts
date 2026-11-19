/**
 * Scottish Land and Buildings Transaction Tax (LBTT) calculator engine.
 *
 * Pure maths, no DOM and no React, so the same code runs in the browser,
 * during server rendering, and under `node --test`.
 *
 * Official Revenue Scotland residential rates (current for 2026/27):
 *   Up to £145,000:            0%  (£175,000 for eligible first-time buyers)
 *   £145,001 to £250,000:      2%
 *   £250,001 to £325,000:      5%
 *   £325,001 to £750,000:      10%
 *   Over £750,000:             12%
 *
 * Additional Dwelling Supplement (ADS), effective from 5 December 2024:
 *   8% of the total purchase price when buying an additional residential
 *   property for £40,000 or more. First-time buyer relief cannot be combined
 *   with ADS.
 */

export type BuyerType = "standard" | "first-time" | "additional";

export type LbttBandRow = {
  label: string;
  rate: number;
  taxable: number;
  tax: number;
};

export type LbttResult = {
  price: number;
  buyerType: BuyerType;
  baseTax: number;
  adsTax: number;
  totalTax: number;
  effectiveRate: number;
  ftbSaving: number;
  bands: LbttBandRow[];
};

export const LBTT_DATA = {
  taxYear: "2026/27",
  nilThreshold: 145_000,
  ftbNilThreshold: 175_000,
  adsThreshold: 40_000,
  adsRate: 0.08,
  adsEffectiveFrom: "5 December 2024",
  bands: [
    { from: 0, to: 145_000, rate: 0, label: "Up to £145,000" },
    { from: 145_000, to: 250_000, rate: 0.02, label: "£145,001 to £250,000" },
    { from: 250_000, to: 325_000, rate: 0.05, label: "£250,001 to £325,000" },
    { from: 325_000, to: 750_000, rate: 0.1, label: "£325,001 to £750,000" },
    { from: 750_000, to: Infinity, rate: 0.12, label: "Over £750,000" },
  ] as const,
} as const;

function standardBands(price: number): LbttBandRow[] {
  return LBTT_DATA.bands.map((band) => {
    const taxable = Math.max(0, Math.min(price, band.to) - band.from);
    return {
      label: band.label,
      rate: band.rate,
      taxable,
      tax: Math.floor(taxable * band.rate),
    };
  });
}

function firstTimeBuyerBands(price: number): LbttBandRow[] {
  const ftbBands = [
    { from: 0, to: 175_000, rate: 0, label: "Up to £175,000 (first-time buyer)" },
    { from: 175_000, to: 250_000, rate: 0.02, label: "£175,001 to £250,000" },
    { from: 250_000, to: 325_000, rate: 0.05, label: "£250,001 to £325,000" },
    { from: 325_000, to: 750_000, rate: 0.1, label: "£325,001 to £750,000" },
    { from: 750_000, to: Infinity, rate: 0.12, label: "Over £750,000" },
  ] as const;

  return ftbBands.map((band) => {
    const taxable = Math.max(0, Math.min(price, band.to) - band.from);
    return {
      label: band.label,
      rate: band.rate,
      taxable,
      tax: Math.floor(taxable * band.rate),
    };
  });
}

export function calculateLbtt(rawPrice: number, buyerType: BuyerType = "standard"): LbttResult {
  const price = Number.isFinite(rawPrice) && rawPrice > 0 ? Math.floor(rawPrice) : 0;
  const standard = standardBands(price);
  const standardTotal = standard.reduce((sum, row) => sum + row.tax, 0);

  const bands = buyerType === "first-time" ? firstTimeBuyerBands(price) : standard;
  const baseTax = bands.reduce((sum, row) => sum + row.tax, 0);
  const adsTax =
    buyerType === "additional" && price >= LBTT_DATA.adsThreshold
      ? Math.floor(price * LBTT_DATA.adsRate)
      : 0;
  const totalTax = baseTax + adsTax;
  const effectiveRate = price > 0 ? totalTax / price : 0;
  const ftbSaving = buyerType === "first-time" ? Math.max(0, standardTotal - baseTax) : 0;

  return {
    price,
    buyerType,
    baseTax,
    adsTax,
    totalTax,
    effectiveRate,
    ftbSaving,
    bands,
  };
}
