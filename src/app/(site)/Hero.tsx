"use client";

import Link from "next/link";
import { Pictogram } from "@/components/Motion";
import PostcodeStart from "@/components/PostcodeStart";

/**
 * The national opening statement.
 *
 * Written for a phone, for someone in their twenties who does not follow
 * politics and has about four seconds of patience. One enormous claim, one
 * marker-pen emphasis on the part that matters, one thing to do. The proof
 * sits beside it rather than after it, so the page never asks for trust it
 * has not earned.
 *
 * The strip at the foot exists because the site has 311 pages and used to
 * look like it had five. Saying how much is here is part of the pitch.
 */

const SCALE = [
  { value: "32", label: "council areas" },
  { value: "57", label: "MP areas" },
  { value: "10", label: "years of figures" },
  { value: "100%", label: "sourced" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 pt-10 pb-10 sm:pt-14">
        <div className="grid w-full gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center">
          {/* ---- Statement ---- */}
          <div>
            <p
              className="kicker text-[var(--brand)] mb-6 rise"
              style={{ animationDelay: "60ms" }}
            >
              Scotland · the facts in plain English
            </p>

            <h1
              className="display-stat text-[clamp(44px,6.4vw,86px)] max-w-[15ch] mb-7 rise"
              style={{ animationDelay: "140ms" }}
            >
              Nearly a million people in Scotland are{" "}
              <span className="mark">living in poverty.</span>
            </h1>

            <p
              className="text-[clamp(18px,1.7vw,22px)] leading-[1.5] text-[var(--ink-2)] max-w-[46ch] mb-8 rise"
              style={{ animationDelay: "250ms" }}
            >
              We find your MP and MSP, put your area&apos;s own figures in an email and write it
              for you. <strong className="text-[var(--ink)]">It takes about a minute.</strong>
            </p>

            <div className="rise" style={{ animationDelay: "350ms" }}>
              <PostcodeStart />
            </div>

            <div
              className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[16px] rise"
              style={{ animationDelay: "450ms" }}
            >
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
              className="rounded-[var(--r-l)] bg-[var(--surface)] border border-[var(--rule)] p-6 sm:p-8 scale-in"
              style={{ boxShadow: "var(--shadow-3)", animationDelay: "280ms" }}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="kicker text-[var(--muted)] mb-2">Right now</p>
                  <div className="display-stat text-[clamp(46px,5.4vw,72px)] text-[var(--action)]">
                    1 in 6
                  </div>
                  <p className="text-[17px] font-[650] text-[var(--ink-2)] mt-2.5">
                    people in Scotland
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="display-stat text-[30px] text-[var(--ink)]">17%</div>
                  <p className="text-[14px] font-[620] text-[var(--muted)] mt-1.5 leading-[1.3]">
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
      <div className="slab-dark">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-7">
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6 justify-between">
            <div className="flex flex-wrap gap-x-11 gap-y-5">
              {SCALE.map((s) => (
                <div key={s.label}>
                  <div className="display-stat text-[30px] sm:text-[36px] text-[var(--signal)]">
                    {s.value}
                  </div>
                  <p className="text-[14.5px] font-[600] opacity-75 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/browse"
              className="ui text-[16px] font-[700] text-[var(--deep-ink)] underline underline-offset-4 decoration-[var(--signal)] decoration-2"
            >
              See everything on this site →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
