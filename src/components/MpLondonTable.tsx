"use client";

import { useMemo, useState } from "react";
import Link from "@/components/IntentLink";
import type { LondonTableRow } from "@/lib/data/mpLondonRecord";
import { trackEvent } from "@/lib/analytics";

type SortKey = "perSittingDay" | "votePct" | "speakingDays" | "writtenQuestions";

const SORTS: { key: SortKey; label: string; dir: 1 | -1 }[] = [
  { key: "perSittingDay", label: "Cost per sitting day", dir: -1 },
  { key: "speakingDays", label: "Fewest speaking days", dir: 1 },
  { key: "writtenQuestions", label: "Fewest questions", dir: 1 },
  { key: "votePct", label: "Fewest votes", dir: 1 },
];

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

function partyShort(party: string) {
  if (/scottish national/i.test(party)) return "SNP";
  if (/labour/i.test(party)) return "Lab";
  if (/conservative/i.test(party)) return "Con";
  if (/liberal/i.test(party)) return "LD";
  return party;
}

/**
 * Every Scottish MP who served all of 2025/26, side by side: second home cost
 * per Commons sitting day, and what they did in the Commons that year.
 */
export default function MpLondonTable({ rows, sittingDays }: { rows: LondonTableRow[]; sittingDays: number }) {
  const [sort, setSort] = useState<SortKey>("perSittingDay");
  const [showAll, setShowAll] = useState(false);

  const sorted = useMemo(() => {
    const s = SORTS.find((x) => x.key === sort)!;
    return [...rows].sort((a, b) => (a[sort] - b[sort]) * s.dir || b.perSittingDay - a.perSittingDay);
  }, [rows, sort]);
  const shown = showAll ? sorted : sorted.slice(0, 10);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Sort the MPs">
        {SORTS.map((s) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={sort === s.key}
            onClick={() => {
              setSort(s.key);
              trackEvent("mp_london_sort", { sort: s.key });
            }}
            className={`ui rounded-full border px-3.5 py-1.5 text-[14px] font-[600] ${
              sort === s.key
                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--surface)]"
                : "border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <ol className="tile mt-5 divide-y divide-[var(--rule)] overflow-hidden">
        {shown.map((r, i) => (
          <li key={r.slug} className="px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="ui min-w-0 text-[16px] font-[660] text-[var(--ink)]">
                <span className="tnum mr-2 text-[var(--muted)]">{i + 1}.</span>
                <Link href={`/representatives/mps/${r.slug}#london-record`} className="text-[var(--action-text)]">
                  {r.name}
                </Link>{" "}
                <span className="font-[500] text-[var(--muted)]">({partyShort(r.party)})</span>
              </p>
              {r.role && (
                <span className="ui rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 text-[12.5px] font-[600] text-[var(--ink-2)]">
                  {r.role}
                </span>
              )}
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
              {[
                ["Second home per sitting day", money.format(r.perSittingDay), "perSittingDay"],
                ["Votes taken part in", `${r.votePct}%`, "votePct"],
                ["Days spoke in debates", `${r.speakingDays}`, "speakingDays"],
                ["Written questions", `${r.writtenQuestions}`, "writtenQuestions"],
              ].map(([label, value, key]) => (
                <div key={label}>
                  <dt className="ui text-[12.5px] leading-[1.3] text-[var(--muted)]">{label}</dt>
                  <dd
                    className={`figure-num tnum mt-0.5 text-[19px] leading-none ${
                      key === sort ? "text-[var(--bad-text)]" : "text-[var(--ink)]"
                    }`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            {r.hotelNights >= 30 && (
              <p className="ui mt-2 text-[13px] text-[var(--ink-2)]">
                Used hotels: {r.hotelNights} nights paid for, against {sittingDays} sitting days.
              </p>
            )}
          </li>
        ))}
      </ol>

      {rows.length > 10 && (
        <button
          type="button"
          onClick={() => {
            setShowAll((v) => !v);
            if (!showAll) trackEvent("mp_london_show_all");
          }}
          className="btn btn-ghost mt-4"
        >
          {showAll ? "Show the top 10 only" : `Show all ${rows.length} MPs`}
        </button>
      )}
    </div>
  );
}
