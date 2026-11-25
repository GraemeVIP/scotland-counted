import type { Tariff } from "./engine.ts";

export const suppliers = ["Octopus Energy", "ScottishPower", "British Gas", "EDF", "E.ON Next", "OVO Energy", "Utility Warehouse", "Sainsbury’s Energy", "So Energy", "Good Energy", "Ecotricity", "Outfox Energy", "Another supplier"] as const;
export const regions = { south: "Southern Scotland", north: "Northern Scotland" };
export const payments = { debit: "Direct Debit", credit: "Pay when the bill arrives", prepay: "Prepayment meter" };
export type Region = keyof typeof regions;
export type Payment = keyof typeof payments;
export type Quote = Tariff & { title: string; period: string; source: string; benchmark: boolean };
export const ofgemUrl = "https://www.ofgem.gov.uk/your-energy-supply/your-energy-bill/energy-price-cap-unit-rates-and-standing-charges";
export const quarterNames = ["January to March", "April to June", "July to September", "October to December"];
export function quarter(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "numeric", timeZone: "Europe/London" }).formatToParts(date);
  const get = (key: string) => Number(parts.find(p => p.type === key)?.value);
  return quarterNames[Math.floor((get("month") - 1) / 3)] + " " + get("year");
}

type Prices = Record<Region, Record<Payment, [unit: number, standing: number]>>;
// Ofgem's single rate regional tables, including the next published cap.
// A snapshot is only eligible during the quarter named on it.
const caps: Record<string, Prices> = {
  "October to December 2026": {
    north: { debit: [26.35, 55.14], credit: [27.83, 63.67], prepay: [25.54, 55.14] },
    south: { debit: [26.11, 61.41], credit: [27.58, 70.19], prepay: [25.31, 61.41] },
  },
  "January to March 2027": {
    north: { debit: [32.40, 55.07], credit: [34.21, 63.55], prepay: [31.41, 55.07] },
    south: { debit: [32.57, 61.33], credit: [34.39, 70.06], prepay: [31.58, 61.33] },
  },
};
export function capSnapshot(region: Region, payment: Payment, period: string): Quote | null {
  const pair = caps[period]?.[region][payment];
  if (!pair) return null;
  return { title: "Ofgem regional estimate", unit: pair[0], standing: pair[1], source: ofgemUrl, period, benchmark: true };
}
export function supplierCard(supplier: string, region: Region, payment: Payment, period: string): Quote | null {
  if (period !== "October to December 2026") return null;
  const edf = supplier === "EDF";
  const sainsburys = supplier === "Sainsbury’s Energy" && payment !== "prepay";
  if (!edf && !sainsburys) return null;
  // Both suppliers publish these single rate prices for the supported payment methods.
  const prices: Prices = {
    north: { debit: [26.346, 55.136], credit: [27.829, 63.665], prepay: [25.542, 55.136] },
    south: { debit: [26.106, 61.408], credit: [27.576, 70.191], prepay: [25.309, 61.408] },
  };
  const [unit, standing] = prices[region][payment];
  return { title: edf ? "EDF Standard Variable" : "Sainsbury’s Standard Variable", unit, standing, period, benchmark: false,
    source: edf ? "https://www.edfenergy.com/sites/default/files/2026-09/DM1903-STANDARD-VARIABLE-DEEMED-AND-WELCOME-OCT26-RATES.pdf" : "https://assets.ctfassets.net/3v0uw5lj7xro/dlKxcoVeTvy3r98vjiCEO/b0cd67ce691712a3ab34621f50053f2f/SE_Prices_01_10_26.pdf" };
}

export function parseCap(script: string, region: Region, payment: Payment, period: string): Quote | null {
  const raw = script.match(/^\s*var options = (\{[^\n]+\});\s*$/m)?.[1];
  if (!raw) return null;
  try {
    const chart = JSON.parse(raw);
    const title = String(chart.options?.title?.text).replace(/<[^>]*>/g, "").toLowerCase();
    const method = { debit: "direct debit", credit: "standard credit", prepay: "prepayment meter" }[payment];
    if (!title.includes("electricity") || !title.includes(method) || !title.includes("single rate")) return null;
    const [header, ...rows] = chart.data.value as string[][];
    const headers = header.map(h => h.replace(/\s+/g, " ").trim().toLowerCase());
    const row = rows.find(r => r[0] === regions[region]);
    if (!row) return null;
    function read(column: string, suffix: string) {
      const cell = row?.[headers.indexOf((column + " " + period).toLowerCase())];
      return cell?.endsWith(suffix) ? Number(cell.slice(0, -suffix.length)) : NaN;
    }
    const unit = read("Unit rate", " pence per kWh");
    const standing = read("Daily standing charge", " pence per day");
    if (!Number.isFinite(unit) || !Number.isFinite(standing) || unit <= 0 || standing < 0) return null;
    return { unit, standing, title: "Ofgem regional estimate", source: ofgemUrl, period, benchmark: true };
  } catch { return null; }
}

type OctopusRate = { valid_from: string; valid_to: string | null; payment_method: string | null; value_inc_vat: number };
export function activeOctopusRate(rows: OctopusRate[], payment: Payment, now: Date) {
  const method = payment === "debit" ? "DIRECT_DEBIT" : "NON_DIRECT_DEBIT";
  if (payment === "prepay") return null;
  const valid = rows.filter(r => Date.parse(r.valid_from) <= now.getTime() && (r.valid_to === null || now.getTime() < Date.parse(r.valid_to)) && Number.isFinite(r.value_inc_vat) && r.value_inc_vat >= 0);
  return valid.find(r => r.payment_method === method) ?? valid.find(r => r.payment_method === null) ?? null;
}
