"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CountUp } from "@/components/Motion";
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
            <p
              className="mt-5 text-[15px] text-[var(--ink-2)] leading-[1.5] rise"
              style={{ animationDelay: "540ms" }}
            >
              <Link href="/the-numbers" className="font-[680]">
                Glasgow keeps its own record:
              </Link>{" "}
              36.1% — 39,319 children — live in relative poverty after housing costs, the highest
              rate and steepest decade rise of any Scottish council area.
            </p>
          </div>

          {/* ---- The people behind the proportion ---- */}
          <div className="lg:pl-6 lg:justify-self-end w-full max-w-[460px] mx-auto lg:mx-0">
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--deep)] scale-in sm:aspect-[5/4] lg:aspect-square"
              style={{ boxShadow: "var(--shadow-2)", animationDelay: "300ms" }}
            >
              <Image
                src="/images/editorial/scotland-school-morning.webp"
                alt="An illustrated parent helping a child get ready for school in an ordinary Scottish kitchen."
                fill
                priority
                sizes="(min-width: 1024px) 460px, (min-width: 640px) 70vw, calc(100vw - 40px)"
                className="object-cover object-center"
              />
              <div
                className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-20 text-white sm:px-6 sm:pb-6"
                style={{
                  background:
                    "linear-gradient(to top, rgba(15, 22, 27, 0.96) 0%, rgba(15, 22, 27, 0.78) 58%, transparent 100%)",
                }}
              >
                <div className="flex items-end justify-between gap-5">
                  <div>
                    <div className="figure-num text-[clamp(46px,5vw,62px)] text-[#f4a261]">
                      <CountUp value={17} suffix="%" />
                    </div>
                    <p className="ui mt-1 text-[15px] font-[650] text-white/85">
                      of everyone in Scotland
                    </p>
                  </div>
                  <div className="pb-1 text-right">
                    <div className="figure-num text-[24px] text-white">940,000</div>
                    <p className="ui mt-1 text-[15px] font-[650] text-white/75">people</p>
                  </div>
                </div>
                <p className="mt-4 border-t border-white/20 pt-3 text-[15px] leading-[1.5] text-white/80">
                  AI-generated illustration. Relative poverty after housing costs, 2022–25;
                  Scottish Government official statistics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
