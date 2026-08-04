"use client";

import Link from "next/link";
import PostcodeStart from "@/components/PostcodeStart";
import type { LocalFacts, ResponsibilitySplit } from "@/lib/localFacts";
import { current as flagship } from "@/lib/data/flagship";

/**
 * The national opening statement.
 *
 * It used to open with the poverty figure, which described the site as it was
 * rather than as it is. The product now covers pay, council tax, council
 * performance and political responsibility, so someone arriving about their
 * payslip was told they were on a poverty website and left.
 *
 * The postcode box still does the hard work, because a local answer is the
 * fastest way to show what the site is for. The card beside it carries one
 * current finding rather than four unrelated national figures, and reads from
 * lib/data/flagship.ts so swapping it is one edit.
 *
 * Nothing above the fold waits for an animation before it can be read.
 */

const TRUST = [
  "No postcode stored",
  "Every figure sourced",
  "Corrections published",
];

const SCALE = [
  { value: "32", label: "council areas" },
  { value: "32", label: "council records" },
  { value: "57", label: "MP areas" },
  { value: "100%", label: "sourced" },
];

/*
 * facts and split arrive as props rather than being built here. This file is
 * a client component, so calling the builders inside it would pull the
 * council datasets into the browser bundle on every page that renders a hero.
 * The server page builds them once; the type import is erased at compile time.
 */
export default function Hero({
  facts,
  split,
}: {
  facts: Record<string, LocalFacts>;
  split: ResponsibilitySplit;
}) {
  return (
    <section className="relative overflow-hidden xl:flex xl:min-h-[calc(100svh-69px)] xl:flex-col">
      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-14 py-6 sm:py-12 xl:flex xl:flex-1 xl:items-center">
        <div className="grid w-full gap-x-12 gap-y-10 xl:grid-cols-[minmax(0,1.12fr)_minmax(420px,0.88fr)] xl:items-center">
          {/* ---- Statement ---- */}
          <div className="md:max-xl:mx-auto md:max-xl:max-w-[680px] md:max-xl:text-center">
            <p className="kicker text-[var(--brand)] mb-3 sm:mb-5">
              <span className="sm:hidden">Free · independent · for Scotland</span>
              <span className="hidden sm:inline">Independent public data for Scotland</span>
            </p>

            <h1 className="display-stat text-[clamp(36px,10.5vw,44px)] sm:text-[clamp(44px,5.7vw,78px)] max-w-[16ch] mb-4 sm:mb-6 md:max-xl:mx-auto md:max-xl:max-w-[15ch]">
              See what Scotland&rsquo;s numbers mean{" "}
              <span className="mark">where you live.</span>
            </h1>

            <p className="text-[17px] sm:text-[clamp(18px,1.55vw,21px)] leading-[1.5] text-[var(--ink-2)] max-w-[49ch] mb-5 sm:mb-7 md:max-xl:mx-auto">
              <span className="sm:hidden">
                Your area, your council, your pay and your bills, in ordinary words. Then I find
                your MP and MSPs and write the emails for you.{" "}
              </span>
              <span className="hidden sm:inline">
                Enter your postcode to see the figures for your area, what your council spends
                and delivers, what you keep from your pay, and who controls each of it. Then I
                find your MP and MSPs and write both emails for you.{" "}
              </span>
              <strong className="text-[var(--ink)]">It takes about a minute.</strong>
            </p>

            <div className="md:max-xl:mx-auto md:max-xl:max-w-[620px] md:max-xl:text-left">
              <PostcodeStart facts={facts} split={split} />
            </div>

            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[16px] md:max-xl:justify-center">
              <Link href="/take-home-pay-calculator-scotland" className="font-[700]">
                Or calculate my pay →
              </Link>
              <Link href="/areas" className="text-[var(--ink-2)] font-[600]">
                Browse all 32 areas
              </Link>
            </div>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 md:max-xl:justify-center">
              {TRUST.map((item) => (
                <li
                  key={item}
                  className="ui flex items-center gap-1.5 text-[14.5px] font-[620] text-[var(--muted)]"
                >
                  <span aria-hidden="true" className="text-[var(--good-text)]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ---- One current finding ---- */}
          <div className="w-full max-w-[520px] mx-auto md:max-xl:max-w-[620px] xl:mx-0 xl:justify-self-end">
            <div
              className="rounded-[var(--r-l)] bg-[var(--surface)] border border-[var(--rule)] p-6 sm:p-7"
              style={{ boxShadow: "var(--shadow-3)" }}
            >
              <p className="kicker text-[var(--action)] mb-3">{flagship.kicker}</p>

              <div className="display-stat text-[clamp(44px,5.2vw,68px)] leading-[0.95] text-[var(--ink)]">
                {flagship.value}
              </div>
              <p className="text-[17px] font-[650] text-[var(--ink-2)] mt-3 max-w-[26ch]">
                {flagship.unit}
              </p>

              <p className="mt-5 pt-5 border-t border-[var(--rule)] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                {flagship.context}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link href={flagship.href} className="ui text-[16px] font-[700]">
                  {flagship.hrefLabel} →
                </Link>
                <a
                  href={flagship.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui text-[14.5px] text-[var(--muted)]"
                >
                  {flagship.source.publisher}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- The scale of the thing ---- */}
      <div className="slab-dark xl:shrink-0">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-14 py-7">
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6 justify-between md:max-xl:justify-center md:max-xl:text-center">
            <div className="flex flex-wrap gap-x-11 gap-y-5 md:max-xl:justify-center">
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
