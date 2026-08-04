"use client";

import { useRouter } from "next/navigation";
import Dumbbell, { type DumbbellRow } from "@/components/charts/Dumbbell";

/** Wraps the chart so a row click navigates to that area's page. */
export default function AreaDumbbell({
  rows,
  fromLabel,
  toLabel,
}: {
  rows: DumbbellRow[];
  fromLabel: string;
  toLabel: string;
}) {
  const router = useRouter();
  return (
    <>
      <div className="md:hidden rounded-[var(--r-s)] bg-[var(--surface-2)] border border-[var(--rule)] p-5 text-[16px] leading-[1.55] text-[var(--ink-2)]">
        The full 32-area chart needs more room than a phone screen. Use the clear, tappable list
        directly below instead, it contains the same figures.
      </div>
      <div className="hidden md:block">
        <Dumbbell
          rows={rows}
          fromLabel={fromLabel}
          toLabel={toLabel}
          onSelect={(slug) => router.push(`/areas/${slug}`)}
        />
      </div>
    </>
  );
}
