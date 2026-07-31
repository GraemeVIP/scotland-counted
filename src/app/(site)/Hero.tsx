"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CountUp, Pictogram } from "@/components/Motion";
import PostcodeStart from "@/components/PostcodeStart";

/**
 * The national opening statement. The postcode is the shortest route
 * from a Scotland-wide fact to the reader's own evidence and the people
 * with the power to act on it.
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

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-12 sm:pt-12 sm:pb-14">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          {/* ---- Statement ---- */}
          <div>
            <p className="label mb-5 flex items-center gap-3 rise" style={{ animationDelay: "60ms" }}>
              <span className="inline-block w-8 h-[2px] bg-[var(--action)]" aria-hidden="true" />
              Scotland &middot; Poverty, work and living standards
            </p>

            <h1 className="h1 max-w-[16ch] mb-6 rise" style={{ animationDelay: "150ms" }}>
              Poverty has an address. So does power.
            </h1>

            <p
              className="lede max-w-[52ch] mb-7 !text-[clamp(17px,1.6vw,20px)] rise"
              style={{ animationDelay: "260ms" }}
            >
              Around 940,000 people in Scotland are living in poverty after housing costs. See
              what the evidence says where you live, who controls the decisions, and contact the
              right representative without having to look them up.
            </p>

            <div className="rise" style={{ animationDelay: "370ms" }}>
              <PostcodeStart />
            </div>

            <div
              className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] rise"
              style={{ animationDelay: "470ms" }}
            >
              <Link href="/areas" className="font-[650]">
                Explore all 32 council areas →
              </Link>
              <Link href="/methods" className="text-[var(--ink-2)]">
                Every figure sourced
              </Link>
            </div>
            <p className="mt-5 text-[15px] text-[var(--muted)] leading-[1.5] rise" style={{ animationDelay: "540ms" }}>
              Formerly Glasgow Counted. Same independent project, now built around every Scottish
              area.
            </p>
          </div>

          {/* ---- The proportion, drawn ---- */}
          <div className="lg:pl-6 lg:justify-self-end w-full max-w-[460px] mx-auto lg:mx-0">
            <div
              className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6 sm:p-7 scale-in" style={{ boxShadow: "var(--shadow-2)", animationDelay: "300ms" }}
            >
              <div className="flex items-end justify-between gap-6 mb-5">
                <div>
                  <div className="figure-num text-[clamp(44px,4.5vw,64px)] text-[var(--action)]">
                    <CountUp value={17} suffix="%" />
                  </div>
                  <p className="ui text-[13px] font-[600] text-[var(--muted)] mt-2">
                    of everyone in Scotland
                  </p>
                </div>
                <div className="text-right">
                  <div className="figure-num text-[22px] text-[var(--ink)]">940,000</div>
                  <p className="ui text-[13px] font-[600] text-[var(--muted)] mt-1.5">people</p>
                </div>
              </div>

              <Pictogram
                filled={17}
                columns={20}
                label="A hundred figures representing Scotland's population. Seventeen are highlighted, showing the share living in relative poverty after housing costs in 2022 to 2025."
              />

              <p className="mt-5 pt-4 border-t border-[var(--rule)] text-[13.5px] leading-[1.55] text-[var(--ink-2)]">
                Relative poverty after housing costs, 2022–25. Children: 21%. Working-age adults:
                18%. Pensioners: 13%. Scottish Government official statistics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Scroll cue ---- */}
      <div
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3 pointer-events-none"
        style={{ opacity: fade }}
        aria-hidden="true"
      >
        <span className="ui text-[13px] font-[600] text-[var(--muted)]">
          Scroll to see Scotland
        </span>
        <span className="nudge grid h-9 w-9 place-items-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--action)]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </span>
      </div>
    </section>
  );
}
