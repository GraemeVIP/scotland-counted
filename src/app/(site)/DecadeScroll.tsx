"use client";

import { useEffect, useRef, useState } from "react";
import { PictoGrid } from "@/components/Motion";
import { CHILD_POVERTY_YEARS, GLASGOW_CHILD_COUNTS, getIndicator } from "@/lib/data/indicators";

/**
 * The decade, scrolled. A sticky panel: as the reader scrolls, the year
 * advances through the real series and the hundred figures light — and
 * dim, in 2020/21, because the data genuinely falls in the year benefits
 * were raised. The reader's own scrolling performs the argument.
 *
 * Facts only: every number shown is the published figure for that year.
 * Without JavaScript the panel renders the final year, so the truth is
 * never gated behind the effect.
 */

const CAPTIONS: { year: string; text: string }[] = [
  {
    year: "2014/15",
    text: "Where the decade starts. 27 in every 100 Glasgow children are growing up poor.",
  },
  {
    year: "2016/17",
    text: "Benefits are frozen while prices rise. Every year, the money buys a little less.",
  },
  {
    year: "2019/20",
    text: "Five years of rising — and this is before the pandemic has even arrived.",
  },
  {
    year: "2020/21",
    text: "Benefits go up: the £20 uplift, plus furlough. Watch the figures dim. Child poverty falls.",
  },
  {
    year: "2021/22",
    text: "The extra money is taken away again. It goes straight back up.",
  },
  {
    year: "2023/24",
    text: "36 in every 100 children. The worst in Scotland, and the fastest rise anywhere.",
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
      const total = el.offsetHeight - window.innerHeight;
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

  let caption = CAPTIONS[0];
  for (const c of CAPTIONS) {
    if (years.indexOf(c.year) <= yearIdx) caption = c;
  }

  const railPct = Math.max(1.5, progress * 100);

  return (
    <section
      ref={outerRef}
      id="the-decade"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen h-[420vh] no-print"
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
        {/* A soft light behind the figures — warmth, not graph paper. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(58% 55% at 72% 46%, rgba(224,138,60,0.17) 0%, rgba(224,138,60,0.05) 45%, transparent 72%)",
          }}
        />

        <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 h-full flex flex-col justify-center py-10">
          <div className="grid gap-x-16 gap-y-9 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center">
            {/* ---- Narration ---- */}
            <div className="order-2 lg:order-1">
              <p className="ui text-[14px] font-[600] opacity-65 mb-6">
                The decade, in your hands — keep scrolling
              </p>

              <div className="flex items-baseline gap-5 mb-7">
                <span className="figure-num text-[clamp(38px,4.4vw,58px)]" aria-hidden="true">
                  {years[yearIdx]}
                </span>
                <span className="figure-num text-[clamp(26px,3vw,40px)] text-[var(--action)]">
                  {pct.toFixed(1)}%
                </span>
              </div>

              {/* One continuous rail with a travelling marker, not segments */}
              <div className="max-w-[400px] mb-8" aria-hidden="true">
                <div className="relative h-[3px] rounded-full bg-white/15">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-[var(--action)]"
                    style={{ width: `${railPct}%` }}
                  />
                  <span
                    className="absolute top-1/2 h-[11px] w-[11px] -translate-y-1/2 -translate-x-1/2 rounded-full bg-[var(--action)]"
                    style={{
                      left: `${railPct}%`,
                      boxShadow: "0 0 0 4px var(--deep)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-3 ui text-[12.5px] opacity-45">
                  <span>{years[0]}</span>
                  <span>{years[last]}</span>
                </div>
              </div>

              <p className="text-[clamp(18px,1.9vw,22px)] leading-[1.5] max-w-[40ch] min-h-[4.6em]">
                {caption.text}
              </p>

              <p className="ui text-[12.5px] opacity-45 mt-7">
                End Child Poverty / Loughborough University · after housing costs
              </p>
            </div>

            {/* ---- The hundred ---- */}
            <div className="order-1 lg:order-2 w-full max-w-[600px] mx-auto lg:mx-0">
              <PictoGrid
                lit={lit}
                litColor="var(--action)"
                dimColor="#f3efe6"
                dimOpacity={0.17}
              />
              <p className="ui text-[15px] font-[560] opacity-80 mt-6 text-center lg:text-left">
                <span className="text-[var(--action)] font-[750]">{lit}</span> in every 100 Glasgow
                children · {GLASGOW_CHILD_COUNTS[yearIdx].toLocaleString("en-GB")} children
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
