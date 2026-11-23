"use client";

import { useState } from "react";
import Link from "@/components/IntentLink";
import { councils } from "@/lib/data/councils";
import { councilTaxPath } from "@/lib/routeMap";
import { simdFromRank, SIMD_TOTAL_DATA_ZONES, type SimdSummary } from "@/lib/simd";
import { YourMpExpenses } from "@/components/ExpenseNudges";
import { placeSlug } from "@/lib/expenseNudges";

/** The 57 Scottish MPs, slimmed down on the server so the page stays light. */
export type MpLite = { name: string; constituency: string; slug: string };

type LookupResult = {
  postcode: string;
  neighbourhood: string;
  dataZoneCode: string | null;
  ward: string | null;
  councilName: string;
  councilSlug: string | null;
  simd: SimdSummary;
  mp: MpLite | null;
};

type PostcodesIoPayload = {
  status: number;
  result?: {
    postcode: string;
    country: string | null;
    admin_district: string | null;
    admin_ward: string | null;
    lsoa: string | null;
    parliamentary_constituency_2024?: string | null;
    parliamentary_constituency?: string | null;
    index_of_multiple_deprivation: number | null;
    codes?: {
      admin_district?: string | null;
      lsoa?: string | null;
    };
  };
};

const EXAMPLES = ["G12 8QQ", "EH1 1YZ", "AB10 1XG", "DD1 4HN"];

export default function SimdLookup({ mps = [] }: { mps?: MpLite[] }) {
  const [postcode, setPostcode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);

  async function runLookup(raw: string) {
    const compact = raw.replace(/\s+/g, "").toUpperCase();
    if (compact.length < 5) {
      setStatus("error");
      setError("Enter a full Scottish postcode, for example G12 8QQ.");
      return;
    }

    setStatus("loading");
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(compact)}`,
        { cache: "no-store", headers: { Accept: "application/json" } },
      );

      if (response.status === 404) {
        setStatus("error");
        setError("I could not find that postcode. Check the spelling and try again.");
        return;
      }
      if (!response.ok) {
        setStatus("error");
        setError("The postcode service is not responding just now. Please try again shortly.");
        return;
      }

      const data = (await response.json()) as PostcodesIoPayload;
      const r = data.result;
      if (!r) {
        setStatus("error");
        setError("I could not find that postcode.");
        return;
      }
      if (r.country !== "Scotland") {
        setStatus("error");
        setError("That postcode is outside Scotland. SIMD only covers Scottish postcodes.");
        return;
      }

      const simd = r.index_of_multiple_deprivation != null ? simdFromRank(r.index_of_multiple_deprivation) : null;
      if (!simd) {
        setStatus("error");
        setError("That Scottish postcode does not have an SIMD rank published in the directory.");
        return;
      }

      const councilCode = r.codes?.admin_district ?? null;
      const matched = councilCode ? councils.find((c) => c.code === councilCode) : null;

      const seat = r.parliamentary_constituency_2024 ?? r.parliamentary_constituency ?? "";
      const mp = seat ? mps.find((m) => m.slug === placeSlug(seat)) ?? null : null;

      setResult({
        postcode: r.postcode,
        mp,
        neighbourhood: r.lsoa ?? "Scottish data zone",
        dataZoneCode: r.codes?.lsoa ?? null,
        ward: r.admin_ward ?? null,
        councilName: matched?.name ?? r.admin_district ?? "Scotland",
        councilSlug: matched?.slug ?? null,
        simd,
      });
      setStatus("idle");
    } catch {
      setStatus("error");
      setError("Could not reach the postcode lookup service. Please try again.");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runLookup(postcode);
  }

  return (
    <section
      id="checker"
      className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-7"
      aria-label="SIMD postcode checker"
    >
      <h2 className="h3 mb-2">Check a Scottish postcode</h2>
      <p className="max-w-[60ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
        Enter any Scottish postcode to see its SIMD 2020v2 decile (1 to 10), quintile (1 to 5), and
        exact rank out of {SIMD_TOTAL_DATA_ZONES.toLocaleString("en-GB")} data zones. Lookups run in
        your browser and are not stored.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-4 grid gap-2.5 sm:grid-cols-[minmax(0,320px)_auto] sm:justify-start"
      >
        <label htmlFor="simd-postcode" className="sr-only">
          Scottish postcode
        </label>
        <input
          id="simd-postcode"
          type="text"
          maxLength={10}
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          placeholder="Your postcode, e.g. G12 8QQ"
          data-clarity-mask="true"
          autoComplete="postal-code"
          className="ui min-h-12 w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-4 text-[16px] text-[var(--ink)] outline-none focus:border-[var(--brand)]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn btn-primary cursor-pointer justify-center whitespace-nowrap"
        >
          {status === "loading" ? "Checking…" : "Check SIMD"}
          {status !== "loading" && <span aria-hidden="true">→</span>}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[14px] text-[var(--muted)]">
        <span>Try an example:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => {
              setPostcode(ex);
              void runLookup(ex);
            }}
            className="ui cursor-pointer rounded-full border border-[var(--rule)] bg-[var(--paper)] px-3 py-1 text-[13.5px] font-[560] text-[var(--ink-2)] hover:border-[var(--brand)]"
          >
            {ex}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {status === "error" && (
          <p className="mt-4 text-[15px] font-[560] text-[var(--bad-text)]">{error}</p>
        )}

        {result && (
          <div className="mt-6 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--rule)] pb-4">
              <div>
                <p className="kicker text-[var(--brand)]">
                  {result.postcode} · {result.councilName}
                </p>
                <h3 className="mt-1 text-[22px] font-[640] text-[var(--ink)]">
                  SIMD Decile {result.simd.decile} of 10 (Quintile {result.simd.quintile})
                </h3>
                <p className="mt-1 text-[15.5px] text-[var(--ink-2)]">{result.simd.bandLabel}</p>
              </div>
              <p className="display-stat text-[28px] tnum text-[var(--brand)]">
                Rank {result.simd.rank.toLocaleString("en-GB")}
                <span className="ui block text-right text-[13.5px] font-[500] text-[var(--muted)]">
                  out of {SIMD_TOTAL_DATA_ZONES.toLocaleString("en-GB")}
                </span>
              </p>
            </div>

            <div className="mt-5" aria-label={`SIMD decile ${result.simd.decile} out of 10`}>
              <div className="grid grid-cols-10 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => {
                  const active = d === result.simd.decile;
                  return (
                    <div
                      key={d}
                      className={`rounded-[4px] py-2 text-center text-[13px] font-[620] tnum ${
                        active
                          ? "bg-[var(--brand)] text-white"
                          : "bg-[var(--surface-2)] text-[var(--muted)]"
                      }`}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>
              <div className="mt-1.5 flex justify-between text-[12.5px] text-[var(--muted)]">
                <span>1 = Most deprived 10%</span>
                <span>10 = Least deprived 10%</span>
              </div>
            </div>

            <dl className="mt-5 grid gap-3 border-t border-[var(--rule)] pt-4 text-[15px] sm:grid-cols-3">
              <div>
                <dt className="text-[13.5px] text-[var(--muted)]">Data zone</dt>
                <dd className="m-0 font-[580] text-[var(--ink)]">
                  {result.neighbourhood}
                  {result.dataZoneCode ? ` (${result.dataZoneCode})` : ""}
                </dd>
              </div>
              {result.ward && (
                <div>
                  <dt className="text-[13.5px] text-[var(--muted)]">Council ward</dt>
                  <dd className="m-0 font-[580] text-[var(--ink)]">{result.ward}</dd>
                </div>
              )}
              <div>
                <dt className="text-[13.5px] text-[var(--muted)]">Council area</dt>
                <dd className="m-0 font-[580] text-[var(--ink)]">{result.councilName}</dd>
              </div>
            </dl>

            <p className="mt-4 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
              {result.simd.explanation}
            </p>

            {result.councilSlug && (
              <div className="mt-5 flex flex-wrap gap-3 border-t border-[var(--rule)] pt-4 text-[15px] font-[580]">
                <Link href={`/areas/${result.councilSlug}`}>
                  See {result.councilName} area facts →
                </Link>
                <Link href={`/councils/${result.councilSlug}`}>
                  {result.councilName} council record →
                </Link>
                <Link href={councilTaxPath(result.councilSlug)}>
                  {result.councilName} council tax →
                </Link>
              </div>
            )}
          </div>
        )}
        {result?.mp && (
          <YourMpExpenses
            name={result.mp.name}
            constituency={result.mp.constituency}
            constituencySlug={result.mp.slug}
            className="mt-4"
          />
        )}
      </div>
    </section>
  );
}
