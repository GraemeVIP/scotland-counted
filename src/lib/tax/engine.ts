/**
 * UK tax engine — 2026/27.
 *
 * Ported from the standalone calculator. Pure maths, no DOM and no React, so
 * the same code runs in the browser, in the server render and under
 * `node --test`. This is the single source of truth for income tax and National
 * Insurance across the whole site: the take-home figures quoted on the
 * indicator and cost-of-living pages come from here too, so the calculator and
 * the editorial can never drift apart.
 *
 * Income tax bands are defined over TAXABLE income — income above the Personal
 * Allowance — which is how the statutory limits are written.
 *
 * Rates live in TAX_DATA. One object to update each April.
 */

export type Region = "ruk" | "scotland";
export type StudentPlan = "1" | "2" | "4" | "5" | "pg" | "";
export type PensionType = "net" | "sac" | "ras";

export type Band = { name: string; rate: number; cap: number };
export type BandRow = { name: string; rate: number; amount: number; tax: number; flat?: boolean };

export const TAX_DATA = {
  taxYear: "2026/27",
  personalAllowance: 12570,
  /** The Personal Allowance falls by £1 for every £2 above this. */
  taperThreshold: 100000,
  ni: { primaryThreshold: 12570, upperLimit: 50270, mainRate: 0.08, upperRate: 0.02 },
  regions: {
    ruk: {
      label: "England, Wales & NI",
      bands: [
        { name: "Basic rate", rate: 0.2, cap: 37700 },
        { name: "Higher rate", rate: 0.4, cap: 125140 },
        { name: "Additional rate", rate: 0.45, cap: Infinity },
      ] as Band[],
    },
    scotland: {
      label: "Scotland",
      bands: [
        { name: "Starter rate", rate: 0.19, cap: 3967 }, // £12,571 – £16,537
        { name: "Basic rate", rate: 0.2, cap: 16956 }, // £16,538 – £29,526
        { name: "Intermediate rate", rate: 0.21, cap: 31092 }, // £29,527 – £43,662
        { name: "Higher rate", rate: 0.42, cap: 62430 }, // £43,663 – £75,000
        { name: "Advanced rate", rate: 0.45, cap: 125140 }, // £75,001 – £125,140
        { name: "Top rate", rate: 0.48, cap: Infinity }, // over £125,140
      ] as Band[],
    },
  },
  studentLoans: {
    "1": { name: "Plan 1", threshold: 26900, rate: 0.09 },
    "2": { name: "Plan 2", threshold: 29385, rate: 0.09 },
    "4": { name: "Plan 4", threshold: 33795, rate: 0.09 },
    "5": { name: "Plan 5", threshold: 25000, rate: 0.09 },
    pg: { name: "Postgraduate", threshold: 21000, rate: 0.06 },
  },
} as const;

/** Flat-rate tax codes map to different rates in Scotland. */
export const FLAT_CODES: Record<Region, Record<string, number>> = {
  ruk: { BR: 0.2, D0: 0.4, D1: 0.45 },
  scotland: { BR: 0.2, D0: 0.21, D1: 0.42, D2: 0.45, D3: 0.48 },
};

export type TaxCode =
  | { type: "standard"; allowance: number; code: string }
  | { type: "flat"; flat: string; code: string }
  | { type: "K"; kAmount: number; code: string }
  | { type: "NT"; code: string };

export const STANDARD_CODE: TaxCode = Object.freeze({
  type: "standard",
  allowance: 12570,
  code: "1257L",
});

/**
 * Accepts 1257L / K497 / BR / D0–D3 / 0T / NT, with an optional S or C region
 * prefix and a W1/M1/X emergency suffix. Returns null if unrecognised.
 */
export function parseTaxCode(raw: string | null | undefined): TaxCode | null {
  if (!raw || !raw.trim()) return STANDARD_CODE;
  const code = raw.toUpperCase().replace(/\s/g, "");

  let m = code.match(/^[SC]?(BR|D0|D1|D2|D3)(?:W1|M1|X)?$/);
  if (m) return { type: "flat", flat: m[1], code };

  if (/^[SC]?NT$/.test(code)) return { type: "NT", code };

  m = code.match(/^[SC]?K(\d{1,4})(?:W1|M1|X)?$/);
  if (m) return { type: "K", kAmount: Number(m[1]) * 10, code };

  m = code.match(/^[SC]?(\d{1,4})[LMNT]?(?:\W?(?:W1|M1|X))?$/);
  if (m) return { type: "standard", allowance: Number(m[1]) * 10, code };

  return null;
}

export function personalAllowance(adjustedIncome: number, base: number = TAX_DATA.personalAllowance) {
  const { taperThreshold } = TAX_DATA;
  if (adjustedIncome <= taperThreshold) return base;
  return Math.max(0, base - (adjustedIncome - taperThreshold) / 2);
}

export type TaxResult = {
  allowance: number;
  taxable: number;
  total: number;
  bands: BandRow[];
  codeInfo: TaxCode;
};

/** `taxableGross` is gross pay minus any pension taken before tax. */
export function incomeTax(
  taxableGross: number,
  region: Region,
  codeInfo: TaxCode = STANDARD_CODE
): TaxResult {
  if (codeInfo.type === "NT") {
    return { allowance: 0, taxable: 0, total: 0, bands: [], codeInfo };
  }

  if (codeInfo.type === "flat") {
    const rate = FLAT_CODES[region][codeInfo.flat] ?? FLAT_CODES.scotland[codeInfo.flat];
    const tax = taxableGross * rate;
    return {
      allowance: 0,
      taxable: taxableGross,
      total: tax,
      codeInfo,
      bands:
        taxableGross > 0
          ? [{ name: `${codeInfo.code} code`, rate, amount: taxableGross, tax, flat: true }]
          : [],
    };
  }

  let allowance = 0;
  let taxable: number;
  if (codeInfo.type === "K") {
    taxable = taxableGross + codeInfo.kAmount;
  } else {
    allowance = personalAllowance(taxableGross, codeInfo.allowance);
    taxable = Math.max(0, taxableGross - allowance);
  }

  const bands: BandRow[] = [];
  let total = 0;
  let floor = 0;
  for (const band of TAX_DATA.regions[region].bands) {
    const amount = Math.max(0, Math.min(taxable, band.cap) - floor);
    if (amount > 0) {
      const tax = amount * band.rate;
      bands.push({ name: band.name, rate: band.rate, amount, tax });
      total += tax;
    }
    floor = band.cap;
    if (taxable <= band.cap) break;
  }
  return { allowance, taxable, total, bands, codeInfo };
}

export function nationalInsurance(base: number) {
  const { primaryThreshold, upperLimit, mainRate, upperRate } = TAX_DATA.ni;
  const main = Math.max(0, Math.min(base, upperLimit) - primaryThreshold) * mainRate;
  const upper = Math.max(0, base - upperLimit) * upperRate;
  return { main, upper, total: main + upper };
}

export type StudentLoanRow = {
  key: string;
  name: string;
  threshold: number;
  rate: number;
  amount: number;
};

/**
 * Student loan deductions share the Class 1 NI earnings basis. `pgl` adds a
 * concurrent postgraduate loan on top of a numbered plan.
 */
export function studentLoan(base: number, plan?: StudentPlan, pgl?: boolean) {
  const rows: StudentLoanRow[] = [];
  const add = (key: keyof typeof TAX_DATA.studentLoans) => {
    const d = TAX_DATA.studentLoans[key];
    const amount = Math.max(0, base - d.threshold) * d.rate;
    if (amount > 0) {
      rows.push({ key, name: d.name, threshold: d.threshold, rate: d.rate, amount });
    }
  };
  if (plan && plan in TAX_DATA.studentLoans) {
    add(plan as keyof typeof TAX_DATA.studentLoans);
  }
  if (pgl && plan && plan !== "pg") add("pg");
  return { rows, total: rows.reduce((sum, row) => sum + row.amount, 0) };
}

export type CalcOptions = {
  /** £ per year contributed. */
  pension?: number;
  /**
   * 'net' — net pay: taken before tax, but not before NI (the default)
   * 'sac' — salary sacrifice: taken before both tax and NI
   * 'ras' — relief at source: taken from after-tax pay, provider adds 25%
   */
  pensionType?: PensionType;
  taxCode?: TaxCode;
  studentPlan?: StudentPlan;
  pgl?: boolean;
};

export type Calculation = ReturnType<typeof calculate>;

export function calculate(grossAnnual: number, region: Region, opts: CalcOptions = {}) {
  const codeInfo = opts.taxCode || STANDARD_CODE;
  const pensionType: PensionType = opts.pensionType || "net";
  const pension = Math.min(grossAnnual, Math.max(0, opts.pension || 0));

  const taxableGross = pensionType === "ras" ? grossAnnual : grossAnnual - pension;
  const niBase = pensionType === "sac" ? grossAnnual - pension : grossAnnual;

  const tax = incomeTax(taxableGross, region, codeInfo);
  const ni = nationalInsurance(niBase);
  const sl = studentLoan(niBase, opts.studentPlan, opts.pgl);

  const deductions = tax.total + ni.total + sl.total;
  const net = grossAnnual - pension - deductions;

  const nextTax = incomeTax(taxableGross + 1, region, codeInfo).total;
  const nextNi = nationalInsurance(niBase + 1).total;
  const nextSl = studentLoan(niBase + 1, opts.studentPlan, opts.pgl).total;

  return {
    gross: grossAnnual,
    pension,
    pensionType,
    pensionPot: pensionType === "ras" ? pension * 1.25 : pension,
    tax,
    ni,
    sl,
    deductions,
    net,
    effectiveRate: grossAnnual > 0 ? deductions / grossAnnual : 0,
    /**
     * Deductions on the next £1 of salary, holding the pension £ constant.
     * Callers with a %-based pension should diff calculate() themselves.
     */
    marginalRate: nextTax + nextNi + nextSl - deductions,
  };
}

/**
 * Finds the gross salary that yields `targetNet` as take-home.
 * `optsFor(gross)` returns the options for a candidate gross, so a %-based
 * pension can scale with it. Returns null if the target is unreachable.
 */
export function solveGross(
  targetNet: number,
  region: Region,
  optsFor: (gross: number) => CalcOptions = () => ({})
): number | null {
  if (!(targetNet > 0)) return null;
  let lo = targetNet; // net never exceeds gross
  let hi = Math.max(targetNet * 1.5, 20000);
  let guard = 0;
  while (calculate(hi, region, optsFor(hi)).net < targetNet) {
    hi *= 1.5;
    if (++guard > 40 || hi > 1e9) return null;
  }
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (calculate(mid, region, optsFor(mid)).net < targetNet) lo = mid;
    else hi = mid;
  }
  return hi;
}
