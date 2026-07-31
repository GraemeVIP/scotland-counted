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
    <Dumbbell
      rows={rows}
      fromLabel={fromLabel}
      toLabel={toLabel}
      onSelect={(slug) => router.push(`/areas/${slug}`)}
    />
  );
}
