"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CountUp, Pictogram } from "@/components/Motion";

/**
 * The opening statement. A hundred figures, thirty-six of them lit —
 * the oldest way of showing a proportion and the one people read
 * fastest. The parallax is a few pixels only; the number is the point.
 */
export default function Hero() {
  const [y, setY] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fade = Math.max(0, 1 - y / 520);

  return (
    <section className="relative overflow-hidden border-b border-[var(--rule)]">
      {/* A very faint survey grid, drifting slowly as you scroll */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--rule) 1px, transparent 1px), linear-gradient(to bottom, var(--rule) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          transform: `translateY(${y * 0.12}px)`,
          maskImage: "radial-gradient(120% 80% at 70% 30%, #000 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(120% 80% at 70% 30%, #000 20%, transparent 78%)",
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 pt-16 pb-16 sm:pt-24 sm:pb-24">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          {/* ---- Statement ---- */}
          <div>
            <p className="label mb-7 flex items-center gap-3">
              <span className="inline-block w-8 h-[2px] bg-[var(--action)]" aria-hidden="true" />
              Glasgow City &middot; 2000&ndash;2026
            </p>

            <h1 className="h1 max-w-[13ch] mb-8">
              More than one in three Glasgow children is growing up poor.
            </h1>

            <p className="lede max-w-[50ch] mb-10">
              Far more Glaswegians are in work than in 2000, and far fewer live in the
              country&apos;s worst-off neighbourhoods. Both are real gains. Yet child poverty here
              rose faster than in any other council area in Scotland.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/the-numbers" className="btn btn-primary">
                See the evidence
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/take-action" className="btn btn-ghost">
                Hold them to it
              </Link>
            </div>

            <p className="mt-9 text-[14.5px] text-[var(--ink-2)] max-w-[46ch] leading-[1.55]">
              Every figure on this site comes from official published data, and every source is
              linked. Nothing here is an estimate of ours.
            </p>
          </div>

          {/* ---- The proportion, drawn ---- */}
          <div className="lg:pl-6">
            <div className="bg-[var(--surface)] border border-[var(--rule)] p-7 sm:p-9" style={{ boxShadow: "var(--shadow-2)" }}>
              <div className="flex items-end justify-between gap-6 mb-7">
                <div>
                  <div className="figure-num text-[clamp(56px,7vw,88px)] text-[var(--action)]">
                    <CountUp value={36.1} decimals={1} suffix="%" />
                  </div>
                  <p className="label label-quiet mt-3">of Glasgow&apos;s children</p>
                </div>
                <div className="text-right">
                  <div className="figure-num text-[26px] text-[var(--ink)]">39,319</div>
                  <p className="label label-quiet mt-2">children</p>
                </div>
              </div>

              <Pictogram
                filled={36}
                columns={20}
                label="A hundred figures representing Glasgow's children. Thirty-six are highlighted, showing the share living in poverty in 2023 to 2024."
              />

              <p className="mt-7 pt-5 border-t border-[var(--rule)] text-[14.5px] leading-[1.6] text-[var(--ink-2)]">
                Living in poverty in 2023/24, counted after the rent is paid. Ten years earlier it
                was 27.1%.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Scroll cue ---- */}
      <div
        className="hidden lg:flex absolute bottom-7 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none"
        style={{ opacity: fade }}
        aria-hidden="true"
      >
        <span className="label label-quiet text-[10px]">Scroll</span>
        <span className="block w-[1px] h-8 bg-[var(--rule-strong)]" />
      </div>
    </section>
  );
}
