"use client";

import Link from "next/link";
import { Pictogram } from "@/components/Motion";
import PostcodeStart from "@/components/PostcodeStart";

/**
 * The national opening statement.
 *
 * The proof sits beside the claim and the postcode box does the hard work.
 * Nothing above the fold waits for an entrance animation before it can be read.
 */

const SCALE = [
  { value: "32", label: "council areas" },
  { value: "57", label: "MP areas" },
  { value: "10", label: "years of figures" },
  { value: "100%", label: "sourced" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden lg:flex lg:min-h-[calc(100svh-69px)] lg:flex-col">
      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-10 sm:py-12 lg:flex lg:flex-1 lg:items-center">
        <div className="grid w-full gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(420px,0.88fr)] lg:items-center">
          {/* ---- Statement ---- */}
          <div>
            <p className="kicker text-[var(--brand)] mb-5">
              Scotland&apos;s poverty, explained simply
            </p>

            <h1 className="display-stat text-[clamp(44px,5.7vw,78px)] max-w-[16ch] mb-6">
              Nearly a million people in Scotland{" "}
              <span className="mark">live in poverty.</span>
            </h1>

            <p className="text-[clamp(18px,1.55vw,21px)] leading-[1.5] text-[var(--ink-2)] max-w-[49ch] mb-7">
              We find your MP and MSP, add the facts for your area and write both emails. You read
              them and press send. <strong className="text-[var(--ink)]">It takes about a minute.</strong>
            </p>

            <div>
              <PostcodeStart />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[16px]">
              <Link href="/areas" className="font-[700]">
                Or browse all 32 areas →
              </Link>
              <Link href="/your-power" className="text-[var(--ink-2)] font-[600]">
                Why it is worth doing
              </Link>
            </div>
          </div>

          {/* ---- The proportion, drawn ---- */}
          <div className="w-full max-w-[520px] mx-auto lg:mx-0 lg:justify-self-end">
            <div
              className="rounded-[var(--r-l)] bg-[var(--surface)] border border-[var(--rule)] p-6 sm:p-7"
              style={{ boxShadow: "var(--shadow-3)" }}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="kicker text-[var(--muted)] mb-2">Right now</p>
                  <div className="display-stat text-[clamp(46px,5.4vw,72px)] text-[var(--brand)]">
                    1 in 6
                  </div>
                  <p className="text-[17px] font-[650] text-[var(--ink-2)] mt-2.5">
                    people in Scotland
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="display-stat text-[30px] text-[var(--ink)]">17%</div>
                  <p className="text-[15px] font-[620] text-[var(--muted)] mt-1.5 leading-[1.3]">
                    exact
                    <br />
                    figure
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Pictogram
                  filled={17}
                  columns={20}
                  litColor="var(--brand)"
                  label="A hundred figures representing Scotland's population. Seventeen are highlighted, showing the share living in relative poverty after housing costs in 2022 to 2025."
                />
              </div>

              <p className="mt-6 pt-5 border-t border-[var(--rule)] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                Around <strong className="text-[var(--ink)]">940,000 people</strong> did not have
                enough money left once housing was paid for. Scottish Government, 2022–25.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- The scale of the thing ---- */}
      <div className="slab-dark lg:shrink-0">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-7">
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6 justify-between">
            <div className="flex flex-wrap gap-x-11 gap-y-5">
              {SCALE.map((s) => (
                <div key={s.label}>
                  <div className="display-stat text-[30px] sm:text-[36px] text-[var(--deep-ink)]">
                    {s.value}
                  </div>
                  <p className="text-[15px] font-[600] opacity-75 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/browse"
              className="ui text-[16px] font-[700] text-[var(--deep-ink)] underline underline-offset-4 decoration-[var(--action)] decoration-2"
            >
              See everything on this site →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
