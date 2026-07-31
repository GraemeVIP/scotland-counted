"use client";

import { useEffect, useRef, useState } from "react";
import { PictoGrid } from "@/components/Motion";
import { CHILD_POVERTY_YEARS, GLASGOW_CHILD_COUNTS, getIndicator } from "@/lib/data/indicators";

/**
 * The decade, scrolled. A sticky panel on the institutional deep blue:
 * as the reader scrolls, the year advances through the real series and
 * the hundred figures light — and dim, in 2020/21, because the data
 * genuinely dips in the year benefits were raised. The reader's own
 * scrolling performs the argument.
 *
 * Facts only: every number shown is the published figure for that year.
 * Without JavaScript the panel renders the final year, so the truth is
 * never gated behind the effect.
 */

const CAPTIONS: { year: string; text: string }[] = [
  {
    year: "2014/15",
    text: "Where the decade starts: 27 in every 100 Glasgow children in poverty, counted after housing costs.",
  },
  {
    year: "2016/17",
    text: "The benefit freeze bites. Payments are held flat in cash while prices rise — a real cut every year.",
  },
  {
    year: "2019/20",
    text: "On the eve of the pandemic the rate has climbed for five years straight.",
  },
  {
    year: "2020/21",
    text: "The pandemic year. Benefits go up — the £20 Universal Credit uplift, plus furlough. Watch the figures dim: child poverty falls.",
  },
  {
    year: "2021/22",
    text: "The uplift is withdrawn. The rate goes straight back up.",
  },
  {
    year: "2023/24",
    text: "36 in every 100 — 39,319 children. The highest rate, and the steepest rise, of any council area in Scotland.",
  },
];

export default function DecadeScroll() {
  const outerRef = useRef<HTMLDivElement>(null);
  const pcts = getIndicator("child-poverty")!.series[0].data;
  const years = CHILD_POVERTY_YEARS;
  const last = years.length - 1;

  /** SSR and no-JS render the end of the story — the current truth. */
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const stickyH = window.innerHeight;
      const total = el.offsetHeight - stickyH;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? passed / total : 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Interpolate the real series between adjacent years.
  const yearFloat = progress * last;
  const i = Math.min(Math.floor(yearFloat), last - 1);
  const frac = yearFloat - i;
  const pct = pcts[i] + (pcts[i + 1] - pcts[i]) * frac;
  const yearIdx = Math.round(yearFloat);
  const lit = Math.round(pct);

  // Latest caption whose year we have reached.
  let caption = CAPTIONS[0];
  for (const c of CAPTIONS) {
    if (years.indexOf(c.year) <= yearIdx) caption = c;
  }

  return (
    <section
      ref={outerRef}
      id="the-decade"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen h-[480vh] no-print"
      aria-label="The decade, year by year: child poverty in Glasgow from 2014/15 to 2023/24"
    >
      {/* Full story for screen readers and print, independent of scroll state. */}
      <div className="sr-only">
        {CAPTIONS.map((c) => (
          <p key={c.year}>
            {c.year}: {c.text}
          </p>
        ))}
      </div>

      <div className="sticky top-0 h-screen bg-[var(--deep)] text-[var(--deep-ink)] overflow-hidden">
        {/* faint grid, as on the hero */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 h-full flex flex-col justify-center py-10">
          <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center min-h-0">
            {/* ---- Narration ---- */}
            <div className="order-2 lg:order-1">
              <p className="ui text-[11px] uppercase tracking-[0.16em] font-[650] opacity-55 mb-5">
                The decade, in your hands — keep scrolling
              </p>

              <div className="flex items-baseline gap-6 mb-6">
                <span className="figure-num text-[clamp(44px,5.5vw,76px)]" aria-hidden="true">
                  {years[yearIdx]}
                </span>
                <span className="figure-num text-[clamp(30px,3.6vw,48px)] text-[var(--action)]">
                  {pct.toFixed(1)}%
                </span>
              </div>

              {/* Year scrubber */}
              <div
                className="flex items-end gap-[3px] mb-8 max-w-[420px]"
                aria-hidden="true"
              >
                {years.map((y, k) => (
                  <div key={y} className="flex-1">
                    <div
                      className="h-[3px] transition-colors duration-150"
                      style={{
                        background:
                          k <= yearIdx ? "var(--action)" : "rgba(243,239,230,0.25)",
                      }}
                    />
                  </div>
                ))}
              </div>

              <p
                key={caption.year}
                className="text-[clamp(17px,1.9vw,21px)] leading-[1.55] max-w-[44ch] min-h-[5.2em] font-serif"
                style={{ animation: "none" }}
                aria-live="off"
              >
                {caption.text}
              </p>

              <p className="ui text-[11px] uppercase tracking-[0.13em] font-[620] opacity-45 mt-6">
                End Child Poverty / Loughborough University · after housing costs
              </p>
            </div>

            {/* ---- The hundred ---- */}
            <div className="order-1 lg:order-2 max-w-[520px] w-full mx-auto lg:mx-0">
              <PictoGrid
                lit={lit}
                litColor="var(--action)"
                dimColor="#f3efe6"
                dimOpacity={0.16}
              />
              <p className="ui text-[11.5px] uppercase tracking-[0.12em] font-[620] opacity-55 mt-5 text-center lg:text-left">
                <span className="text-[var(--action)] font-[750]">{lit}</span> in every 100
                Glasgow children · {GLASGOW_CHILD_COUNTS[yearIdx].toLocaleString("en-GB")} children
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
