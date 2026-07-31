"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pictogram } from "@/components/Motion";
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

  return (
    <section className="relative overflow-hidden border-b border-[var(--rule)] lg:min-h-[calc(100svh-68px)]">
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

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-12 sm:pt-12 sm:pb-14 lg:min-h-[calc(100svh-68px)] lg:flex lg:items-center">
        <div className="grid w-full gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          {/* ---- Statement ---- */}
          <div>
            <p className="label mb-5 flex items-center gap-3 rise" style={{ animationDelay: "60ms" }}>
              <span className="inline-block w-8 h-[2px] bg-[var(--action)]" aria-hidden="true" />
              Scotland &middot; The facts in plain English
            </p>

            <h1 className="h1 !text-[clamp(40px,5vw,68px)] max-w-[18ch] mb-6 rise" style={{ animationDelay: "150ms" }}>
              Nearly one million people in Scotland are living in poverty.
            </h1>

            <p
              className="lede max-w-[52ch] mb-7 !text-[clamp(17px,1.6vw,20px)] rise"
              style={{ animationDelay: "260ms" }}
            >
              That means struggling to pay for rent, food, heating, travel and the basics. Enter
              your postcode and we will show what is happening where you live, find your MP and
              MSP, and write the emails for you.
            </p>

            <div className="rise" style={{ animationDelay: "370ms" }}>
              <PostcodeStart />
            </div>

            <div
              className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] rise"
              style={{ animationDelay: "470ms" }}
            >
              <Link href="/areas" className="font-[650]">
                See every Scottish area →
              </Link>
              <Link href="/methods" className="text-[var(--ink-2)]">
                Check every number
              </Link>
            </div>
            <p
              className="mt-5 text-[15px] text-[var(--ink-2)] leading-[1.5] rise"
              style={{ animationDelay: "540ms" }}
            >
              <Link href="/the-numbers" className="font-[680]">
                Glasgow needs its own spotlight:
              </Link>{" "}
              more than 1 in 3 children are growing up in poverty. That is 39,319 children — the
              worst rate in Scotland and the biggest rise over the last ten years.
            </p>
          </div>

          {/* ---- The proportion, drawn ---- */}
          <div className="lg:pl-6 lg:justify-self-end w-full max-w-[460px] mx-auto lg:mx-0">
            <div
              className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6 sm:p-7 scale-in"
              style={{ boxShadow: "var(--shadow-2)", animationDelay: "300ms" }}
            >
              <div className="flex items-end justify-between gap-6 mb-5">
                <div>
                  <div className="display text-[clamp(36px,4vw,56px)] text-[var(--action)] leading-[0.95]">
                    About 1 in 6
                  </div>
                  <p className="ui text-[16px] font-[650] text-[var(--ink-2)] mt-3">
                    people in Scotland
                  </p>
                </div>
                <div className="text-right">
                  <div className="figure-num text-[24px] text-[var(--ink)]">17%</div>
                  <p className="ui text-[15px] font-[650] text-[var(--muted)] mt-1.5">exact figure</p>
                </div>
              </div>

              <Pictogram
                filled={17}
                columns={20}
                label="A hundred figures representing Scotland's population. Seventeen are highlighted, showing the share living in relative poverty after housing costs in 2022 to 2025."
              />

              <p className="mt-5 pt-4 border-t border-[var(--rule)] text-[15px] leading-[1.55] text-[var(--ink-2)]">
                17 out of every 100 people — around 940,000 people — did not have enough money
                left after housing costs. Official Scottish Government figures, 2022–25.
              </p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
