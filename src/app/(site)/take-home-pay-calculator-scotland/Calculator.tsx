"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  calculate,
  solveGross,
  parseTaxCode,
  TAX_DATA,
  type CalcOptions,
  type PensionType,
  type Region,
  type StudentPlan,
} from "@/lib/tax/engine";

/**
 * The take-home pay calculator.
 *
 * The maths is entirely in @/lib/tax/engine, the same module the site's own
 * minimum-wage figures come from, and the one covered by `npm test`. This file
 * only collects input and shows the answer.
 *
 * Scotland is on by default. Every other UK calculator makes you find the
 * toggle; on this site the Scottish rates are the point, and the rest of the UK
 * is the comparison rather than the default.
 */

const WEEKS = 52;
const DAYS_PER_WEEK = 5;

const gbp = (v: number, dp = 0) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }).format(v);

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

type Period = "hour" | "week" | "month" | "year";
const PERIODS: { id: Period; label: string }[] = [
  { id: "hour", label: "Hour" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];

const PENSION_TYPES: { id: PensionType; label: string; hint: string }[] = [
  { id: "net", label: "Net pay", hint: "Taken before tax, but not before National Insurance. The most common." },
  { id: "sac", label: "Salary sacrifice", hint: "Taken before both tax and National Insurance, so it also cuts your NI." },
  { id: "ras", label: "Relief at source", hint: "Taken from pay after tax. Your provider adds 25% back into the pot." },
];

const LOAN_PLANS: { id: StudentPlan; label: string }[] = [
  { id: "", label: "None" },
  { id: "1", label: "Plan 1" },
  { id: "2", label: "Plan 2" },
  { id: "4", label: "Plan 4" },
  { id: "5", label: "Plan 5" },
  { id: "pg", label: "Postgraduate" },
];

const SPLIT_COLOURS: Record<string, string> = {
  net: "var(--good)",
  tax: "var(--brand)",
  ni: "var(--action)",
  pen: "var(--warn)",
  sl: "var(--flat)",
};

function toAnnual(amount: number, period: Period, hours: number) {
  if (period === "year") return amount;
  if (period === "month") return amount * 12;
  if (period === "week") return amount * WEEKS;
  return amount * hours * WEEKS;
}

function num(raw: string) {
  const n = Number(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function Calculator() {
  /**
   * A shared link carries the whole calculation. Reading it through
   * useSearchParams rather than in an effect means the values are available on
   * the first render, so a shared link shows its answer immediately instead of
   * flashing an empty form, and there is no server/client mismatch to hydrate
   * around. It is why this component sits inside a Suspense boundary.
   */
  const q = useSearchParams();
  const initial = <T,>(key: string, fallback: T, parse: (v: string) => T): T => {
    const v = q.get(key);
    return v === null ? fallback : parse(v);
  };

  const [amount, setAmount] = useState(() => initial("s", "", (v) => v));
  const [period, setPeriod] = useState<Period>(() => initial("p", "year", (v) => v as Period));
  const [reverse, setReverse] = useState(false);
  const [hours, setHours] = useState(() => initial("h", 37.5, (v) => num(v) || 37.5));
  const [scotland, setScotland] = useState(() => q.get("scot") !== "0");

  const [pension, setPension] = useState(() => initial("pen", "", (v) => v));
  const [pensionUnit, setPensionUnit] = useState<"pct" | "gbp">(() =>
    q.get("pu") === "gbp" ? "gbp" : "pct"
  );
  const [pensionType, setPensionType] = useState<PensionType>(() =>
    initial("pt", "net", (v) => v as PensionType)
  );
  const [studentPlan, setStudentPlan] = useState<StudentPlan>(() =>
    initial("sl", "", (v) => v as StudentPlan)
  );
  const [pgl, setPgl] = useState(() => q.get("pgl") === "1");
  const [taxCode, setTaxCode] = useState(() => initial("code", "", (v) => v));

  /** Open the panel straight away if a shared link set something inside it. */
  const [advanced, setAdvanced] = useState(
    () => !!(q.get("pen") || q.get("sl") || q.get("code"))
  );

  const region: Region = scotland ? "scotland" : "ruk";
  const codeInfo = useMemo(() => parseTaxCode(taxCode), [taxCode]);
  const codeInvalid = taxCode.trim() !== "" && codeInfo === null;

  const optsFor = useMemo(() => {
    const pensionValue = num(pension);
    return (gross: number): CalcOptions => ({
      pension: pensionUnit === "pct" ? (gross * pensionValue) / 100 : pensionValue,
      pensionType,
      taxCode: codeInfo ?? undefined,
      studentPlan,
      pgl,
    });
  }, [pension, pensionUnit, pensionType, codeInfo, studentPlan, pgl]);

  const entered = num(amount);
  const hasInput = amount.trim() !== "" && entered > 0;

  const result = useMemo(() => {
    if (!hasInput) return null;
    const target = toAnnual(entered, period, hours);
    if (reverse) {
      const gross = solveGross(target, region, optsFor);
      if (gross === null) return { unreachable: true as const };
      return { calc: calculate(gross, region, optsFor(gross)), solvedGross: gross };
    }
    return { calc: calculate(target, region, optsFor(target)) };
  }, [hasInput, entered, period, hours, reverse, region, optsFor]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams();
    if (hasInput) {
      q.set("s", amount.replace(/[^0-9.]/g, ""));
      if (period !== "year") q.set("p", period);
      if (!scotland) q.set("scot", "0");
      if (hours !== 37.5) q.set("h", String(hours));
      if (num(pension) > 0) {
        q.set("pen", pension);
        if (pensionUnit === "gbp") q.set("pu", "gbp");
        if (pensionType !== "net") q.set("pt", pensionType);
      }
      if (studentPlan) q.set("sl", studentPlan);
      if (pgl) q.set("pgl", "1");
      if (taxCode.trim()) q.set("code", taxCode.trim());
    }
    const url = q.toString() ? `${window.location.pathname}?${q}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [amount, hasInput, period, scotland, hours, pension, pensionUnit, pensionType, studentPlan, pgl, taxCode]);

  const calc = result && "calc" in result ? result.calc : null;
  const unreachable = result && "unreachable" in result;

  /** The URL already carries the whole calculation, so sharing is just a copy. */
  const [copied, setCopied] = useState(false);
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked, the URL bar still holds the same link. */
    }
  }

  const marginal = useMemo(() => {
    if (!calc) return 0;
    const next = calculate(calc.gross + 1, region, optsFor(calc.gross + 1));
    return (
      next.tax.total + next.ni.total + next.sl.total - (calc.tax.total + calc.ni.total + calc.sl.total)
    );
  }, [calc, region, optsFor]);

  const insight = useMemo(() => {
    if (!calc) return null;
    const adjusted = calc.pensionType === "ras" ? calc.gross : calc.gross - calc.pension;
    if (
      calc.tax.codeInfo.type === "standard" &&
      adjusted > TAX_DATA.taperThreshold &&
      calc.tax.allowance > 0
    ) {
      return `You are in the £100,000 trap. Between £100,000 and £125,140 you lose £1 of Personal Allowance for every £2 you earn, so each extra £1 here loses ${pct(marginal)} to deductions.`;
    }
    if (scotland) {
      const other = calculate(calc.gross, "ruk", optsFor(calc.gross));
      const delta =
        calc.tax.total + calc.ni.total + calc.sl.total -
        (other.tax.total + other.ni.total + other.sl.total);
      if (delta >= 1) {
        return `Scottish rates cost ${gbp(delta)} a year more than the same salary in the rest of the UK.`;
      }
      if (delta <= -1) {
        return `Scottish rates save ${gbp(-delta)} a year compared with the same salary in the rest of the UK.`;
      }
      return "At this salary, Scottish and rest-of-UK rates work out the same.";
    }
    return null;
  }, [calc, scotland, marginal, optsFor]);

  const splitParts = calc
    ? [
        { key: "net", name: "Take-home", value: calc.net },
        { key: "tax", name: "Income tax", value: calc.tax.total },
        { key: "ni", name: "National Insurance", value: calc.ni.total },
        { key: "pen", name: "Pension", value: calc.pension },
        { key: "sl", name: "Student loan", value: calc.sl.total },
      ].filter((p) => p.value > 0.005)
    : [];

  const rows: [string, number][] = [
    ["Year", 1],
    ["Month", 1 / 12],
    ["Week", 1 / WEEKS],
    ["Day", 1 / (WEEKS * DAYS_PER_WEEK)],
    ["Hour", hours > 0 ? 1 / (WEEKS * hours) : 0],
  ];

  const fieldCls =
    "w-full rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] px-4 py-3 text-[16px] ui outline-none focus:border-[var(--brand)]";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
      {/* ─────────── Input ─────────── */}
      <section
        className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-7"
        style={{ boxShadow: "var(--shadow-2)" }}
        aria-label="Your pay"
      >
        <label htmlFor="salary" className="ui block text-[15px] font-[750] mb-2.5">
          {reverse ? "Your take-home pay" : "Your pay before tax"}
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[22px] font-[700] text-[var(--muted)]"
          >
            £
          </span>
          <input
            id="salary"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            placeholder="30,000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] py-4 pl-10 pr-4 text-[28px] font-[760] tnum outline-none focus:border-[var(--brand)]"
          />
        </div>

        <div
          role="group"
          aria-label="Pay period"
          className="mt-3 grid grid-cols-4 gap-1 rounded-[var(--r-s)] bg-[var(--surface-2)] p-1"
        >
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              aria-pressed={period === p.id}
              className={`ui rounded-[10px] py-2 text-[15px] font-[700] transition-colors ${
                period === p.id
                  ? "bg-[var(--paper)] text-[var(--ink)] shadow-[var(--shadow-1)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setReverse((v) => !v)}
          className="ui mt-3.5 text-[15px] font-[650] text-[var(--brand)] hover:underline"
        >
          {reverse ? "← Enter pay before tax instead" : "Know your take-home? Work backwards →"}
        </button>

        {/* Scotland */}
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--rule)] pt-5">
          <div>
            <p className="ui text-[15.5px] font-[720]">Scottish taxpayer</p>
            <p className="text-[14.5px] leading-[1.45] text-[var(--muted)] mt-0.5">
              Scotland&apos;s six bands, not the UK&apos;s three
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={scotland}
            aria-label="Scottish taxpayer"
            onClick={() => setScotland((v) => !v)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              scotland ? "bg-[var(--brand)]" : "bg-[var(--rule-strong)]"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                scotland ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Hours */}
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-[var(--rule)] pt-5">
          <div>
            <p className="ui text-[15.5px] font-[720]">Hours a week</p>
            <p className="text-[14.5px] leading-[1.45] text-[var(--muted)] mt-0.5">
              Used for the hourly figures
            </p>
          </div>
          <input
            type="text"
            inputMode="decimal"
            aria-label="Hours per week"
            value={hours}
            onChange={(e) => setHours(num(e.target.value))}
            className="w-20 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] px-3 py-2 text-center text-[16px] font-[700] tnum outline-none focus:border-[var(--brand)]"
          />
        </div>

        {/* Advanced */}
        <button
          type="button"
          onClick={() => setAdvanced((v) => !v)}
          aria-expanded={advanced}
          className="ui mt-5 flex w-full items-center justify-between border-t border-[var(--rule)] pt-5 text-left"
        >
          <span>
            <span className="block text-[15.5px] font-[720]">More options</span>
            <span className="mt-0.5 block text-[14.5px] text-[var(--muted)]">
              Pension, student loan, tax code
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`text-[var(--brand)] transition-transform ${advanced ? "rotate-45" : ""}`}
          >
            ＋
          </span>
        </button>

        {advanced && (
          <div className="mt-5 grid gap-5 rounded-[var(--r-s)] bg-[var(--surface-2)] p-5">
            <div>
              <label htmlFor="pension" className="ui block text-[15px] font-[700] mb-2">
                Pension
              </label>
              <div className="flex gap-2">
                <input
                  id="pension"
                  type="text"
                  inputMode="decimal"
                  placeholder="5"
                  value={pension}
                  onChange={(e) => setPension(e.target.value)}
                  className={`${fieldCls} flex-1`}
                />
                <div className="flex rounded-[var(--r-s)] bg-[var(--paper)] p-1">
                  {(["pct", "gbp"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setPensionUnit(u)}
                      aria-pressed={pensionUnit === u}
                      className={`ui rounded-[8px] px-3 text-[14.5px] font-[700] ${
                        pensionUnit === u
                          ? "bg-[var(--brand)] text-white"
                          : "text-[var(--muted)]"
                      }`}
                    >
                      {u === "pct" ? "%" : "£/yr"}
                    </button>
                  ))}
                </div>
              </div>
              {num(pension) > 0 && (
                <>
                  <select
                    aria-label="Pension type"
                    value={pensionType}
                    onChange={(e) => setPensionType(e.target.value as PensionType)}
                    className={`${fieldCls} mt-2`}
                  >
                    {PENSION_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-[14.5px] leading-[1.5] text-[var(--muted)]">
                    {PENSION_TYPES.find((t) => t.id === pensionType)?.hint}
                  </p>
                </>
              )}
            </div>

            <div>
              <label htmlFor="loan" className="ui block text-[15px] font-[700] mb-2">
                Student loan
              </label>
              <select
                id="loan"
                value={studentPlan}
                onChange={(e) => setStudentPlan(e.target.value as StudentPlan)}
                className={fieldCls}
              >
                {LOAN_PLANS.map((p) => (
                  <option key={p.id || "none"} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              {studentPlan && studentPlan !== "pg" && (
                <label className="ui mt-2.5 flex items-center gap-2.5 text-[15px]">
                  <input
                    type="checkbox"
                    checked={pgl}
                    onChange={(e) => setPgl(e.target.checked)}
                    className="h-4 w-4 accent-[var(--brand)]"
                  />
                  Also repaying a postgraduate loan
                </label>
              )}
            </div>

            <div>
              <label htmlFor="code" className="ui block text-[15px] font-[700] mb-2">
                Tax code
              </label>
              <input
                id="code"
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="1257L"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
                aria-invalid={codeInvalid}
                className={`${fieldCls} font-[700] uppercase ${
                  codeInvalid ? "border-[var(--bad-text)]" : ""
                }`}
              />
              <p
                className={`mt-2 text-[14.5px] leading-[1.5] ${
                  codeInvalid ? "text-[var(--bad-text)]" : "text-[var(--muted)]"
                }`}
              >
                {codeInvalid
                  ? "That is not a tax code I recognise. Leave it blank for the standard 1257L."
                  : "Leave blank for the standard 1257L. Accepts K codes, BR, D0 to D3, 0T and NT."}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ─────────── Results ─────────── */}
      <section aria-label="Your result" className="grid gap-5">
        <div
          className="rounded-[var(--r-m)] bg-[var(--deep)] p-6 text-[var(--deep-ink)] sm:p-8"
          style={{ boxShadow: "var(--shadow-2)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="kicker text-[var(--action)]">
              {reverse ? "You would need to earn" : "You take home"}
            </p>
            <div className="flex items-center gap-2.5">
              <span className="ui rounded-[var(--r-pill)] border border-white/25 px-3 py-1 text-[14px] font-[700]">
                {scotland ? "Scotland" : "England, Wales & NI"} · {TAX_DATA.taxYear}
              </span>
              {hasInput && (
                <button
                  type="button"
                  onClick={copyLink}
                  className="ui rounded-[var(--r-pill)] border border-white/25 px-3 py-1 text-[14px] font-[700] transition-colors hover:bg-white/10"
                >
                  {copied ? "Copied" : "Copy link"}
                </button>
              )}
            </div>
          </div>

          {!hasInput ? (
            <p className="mt-4 text-[19px] leading-[1.5] opacity-80 max-w-[38ch]">
              Put your pay in on the left and this fills in, before tax or after, whichever you
              know.
            </p>
          ) : unreachable ? (
            <p className="mt-4 text-[19px] leading-[1.5] opacity-90 max-w-[42ch]">
              That take-home is not reachable with these pension settings. The pension swallows the
              extra pay.
            </p>
          ) : (
            calc && (
              <>
                <p className="display-stat mt-3 text-[clamp(40px,6vw,68px)] tnum">
                  {gbp(reverse ? calc.gross : calc.net)}
                  <span className="ml-2 text-[20px] font-[600] opacity-70">a year</span>
                </p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    ["Monthly", calc.net / 12, 0],
                    ["Weekly", calc.net / WEEKS, 0],
                    ["Hourly", hours > 0 ? calc.net / WEEKS / hours : 0, 2],
                  ].map(([label, value, dp]) => (
                    <div
                      key={label as string}
                      className="rounded-[var(--r-s)] border border-white/15 bg-white/[0.07] px-4 py-3"
                    >
                      <p className="ui text-[14px] font-[700] opacity-75">{label as string}</p>
                      <p className="display-stat mt-1 text-[clamp(18px,2.2vw,24px)] tnum">
                        {gbp(value as number, dp as number)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
                  <p className="ui opacity-85">
                    Deductions take <strong className="opacity-100">{pct(calc.effectiveRate)}</strong> of
                    your pay
                  </p>
                  <p className="ui opacity-85">
                    Next £1 loses <strong className="opacity-100">{pct(marginal)}</strong>
                  </p>
                </div>

                {/* Split bar */}
                <div className="mt-6">
                  <div
                    className="flex h-[16px] w-full overflow-hidden rounded-[var(--r-pill)] bg-white/10"
                    role="img"
                    aria-label={splitParts
                      .map((p) => `${p.name} ${gbp(p.value)}`)
                      .join(", ")}
                  >
                    {splitParts.map((p) => (
                      <span
                        key={p.key}
                        style={{
                          width: `${(p.value / calc.gross) * 100}%`,
                          background: SPLIT_COLOURS[p.key],
                        }}
                      />
                    ))}
                  </div>
                  <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    {splitParts.map((p) => (
                      <li key={p.key} className="ui flex items-center gap-2.5 text-[15px]">
                        <span
                          aria-hidden="true"
                          className="h-3 w-3 shrink-0 rounded-[3px]"
                          style={{ background: SPLIT_COLOURS[p.key] }}
                        />
                        <span className="opacity-85">{p.name}</span>
                        <span className="ml-auto tnum font-[700]">{gbp(p.value)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {insight && (
                  <p className="mt-6 border-t border-white/15 pt-5 text-[16.5px] leading-[1.55] opacity-90 max-w-[62ch]">
                    {insight}
                  </p>
                )}
              </>
            )
          )}
        </div>

        {calc && !unreachable && (
          <>
            <div className="overflow-x-auto rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]">
              <table className="w-full border-collapse text-[15px]">
                <thead>
                  <tr>
                    {["", "Before tax", "Income tax", "NI", "Take-home"].map((h) => (
                      <th
                        key={h}
                        className="ui border-b-2 border-[var(--ink)] px-4 pb-3 pt-4 text-left text-[14.5px] font-[750] text-[var(--muted)] last:text-right"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, factor]) => (
                    <tr key={label} className="transition-colors hover:bg-[var(--surface-2)]">
                      <td className="ui border-b border-[var(--rule)] px-4 py-3 font-[700]">
                        {label}
                      </td>
                      {[calc.gross, calc.tax.total, calc.ni.total].map((v, i) => (
                        <td
                          key={i}
                          className="ui tnum border-b border-[var(--rule)] px-4 py-3 text-[var(--ink-2)]"
                        >
                          {gbp(v * factor, factor < 1 / WEEKS ? 2 : 0)}
                        </td>
                      ))}
                      <td className="ui tnum border-b border-[var(--rule)] px-4 py-3 text-right font-[750]">
                        {gbp(calc.net * factor, factor < 1 / WEEKS ? 2 : 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <details className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]">
              <summary className="ui cursor-pointer list-none px-6 py-4 text-[16px] font-[700] text-[var(--brand)]">
                How this was worked out
              </summary>
              <div className="border-t border-[var(--rule)] px-6 py-5">
                <p className="ui text-[15px] font-[700] mb-3">
                  Income tax, {scotland ? "Scottish" : "UK"} rates, {TAX_DATA.taxYear}
                </p>
                {calc.tax.allowance > 0 && (
                  <p className="text-[15px] leading-[1.55] text-[var(--ink-2)] mb-3">
                    The first {gbp(calc.tax.allowance)} is your Personal Allowance and is not taxed.
                    That leaves {gbp(calc.tax.taxable)} to be taxed.
                  </p>
                )}
                <ul className="grid gap-2">
                  {calc.tax.bands.map((b) => (
                    <li
                      key={b.name}
                      className="ui flex flex-wrap items-baseline justify-between gap-x-4 border-b border-[var(--rule)] pb-2 text-[15px] last:border-0"
                    >
                      <span className="text-[var(--ink-2)]">
                        {b.name}, {gbp(b.amount)} at {(b.rate * 100).toFixed(0)}%
                      </span>
                      <span className="tnum font-[700]">{gbp(b.tax, 2)}</span>
                    </li>
                  ))}
                </ul>
                <p className="ui mt-4 flex justify-between border-t-2 border-[var(--ink)] pt-3 text-[15.5px] font-[750]">
                  <span>Income tax</span>
                  <span className="tnum">{gbp(calc.tax.total, 2)}</span>
                </p>

                <p className="ui mt-6 text-[15px] font-[700] mb-2">National Insurance</p>
                <p className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
                  8% on pay between {gbp(TAX_DATA.ni.primaryThreshold)} and{" "}
                  {gbp(TAX_DATA.ni.upperLimit)}, then 2% above that. NI is set UK-wide, so it is the
                  same in Scotland.
                </p>
                <p className="ui mt-3 flex justify-between border-t-2 border-[var(--ink)] pt-3 text-[15.5px] font-[750]">
                  <span>National Insurance</span>
                  <span className="tnum">{gbp(calc.ni.total, 2)}</span>
                </p>

                {calc.sl.rows.length > 0 && (
                  <>
                    <p className="ui mt-6 text-[15px] font-[700] mb-2">Student loan</p>
                    <ul className="grid gap-2">
                      {calc.sl.rows.map((r) => (
                        <li
                          key={r.key}
                          className="ui flex justify-between text-[15px] text-[var(--ink-2)]"
                        >
                          <span>
                            {r.name}, {(r.rate * 100).toFixed(0)}% over {gbp(r.threshold)}
                          </span>
                          <span className="tnum font-[700]">{gbp(r.amount, 2)}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {calc.pension > 0 && (
                  <>
                    <p className="ui mt-6 text-[15px] font-[700] mb-2">Pension</p>
                    <p className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
                      {gbp(calc.pension)} a year leaves your pay.
                      {calc.pensionType === "ras" &&
                        ` Your provider adds 25% basic-rate relief, so ${gbp(calc.pensionPot)} goes into the pot.`}
                    </p>
                  </>
                )}
              </div>
            </details>
          </>
        )}

        <p className="text-[15px] leading-[1.6] text-[var(--ink-2)]">
          Figures are {TAX_DATA.taxYear}. Income tax in Scotland is set by the Scottish Parliament;
          National Insurance is UK-wide. Based on 52 weeks and a five-day week, and Class 1 employee
          NI on annual earnings. This is a guide, not financial advice. If a number here looks wrong,{" "}
          <Link href="/corrections">tell me</Link>.
        </p>
      </section>
    </div>
  );
}
