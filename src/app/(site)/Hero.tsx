"use client";

import Link from "@/components/IntentLink";
import PostcodeStart, { RESULT_SLOT_ID } from "@/components/PostcodeStart";
import type { LocalFacts, ResponsibilitySplit } from "@/lib/localFacts";

/**
 * The homepage opening: the Saltire band.
 *
 * The cross is drawn in light behind the headline rather than as a flag, and
 * the band sits under the floating header, so the page opens on one colour.
 * Every piece of text on the blue uses --hero-ink or --hero-muted, which the
 * contrast check holds at 4.5:1 or better against the lightest blue in the band.
 *
 * The postcode tool sits on a white card rather than on the blue: it renders
 * results, links and errors that are built for the page's normal surfaces, and
 * a card keeps all of that legible without restyling the tool.
 */

const TRUST = ["Free, no account", "Every figure sourced", "We never store your postcode"];

const CARD_INCLUDES = [
  "Council tax and water",
  "Child poverty and budget",
  "Your MP and 8 MSPs",
  "Who decides what",
];

const HERO_PILLARS = [
  {
    href: "/modern-studies",
    tag: "For schools",
    hook: "Free Modern Studies course guides, past paper help and Scottish data",
  },
  {
    href: "/for-organisations",
    tag: "For good causes",
    hook: "Free local charts, poverty packs and data help for Scottish charities",
  },
  {
    href: "/mp-expenses-scotland",
    tag: "Public records",
    hook: "20,879 official MP expense receipts and declared interests across Scotland",
  },
];

export default function Hero({
  facts,
  split,
}: {
  facts: Record<string, LocalFacts>;
  split: ResponsibilitySplit;
}) {
  return (
    <>
    <section className="saltire-hero home-hero-fit -mt-[72px] pt-[72px] rounded-b-[var(--r-l)] flex flex-col">
      <div className="beams" aria-hidden="true">
        <div className="beam a" />
        <div className="beam b" />
        <div className="beam-edge a" />
        <div className="beam-edge b" />
      </div>

      <div className="home-hero-inner relative flex flex-1 flex-col justify-between w-full px-4 sm:px-6 min-[1440px]:px-5 pt-6 pb-8 sm:pt-8 sm:pb-9 lg:pt-[clamp(20px,3vh,48px)] lg:pb-[clamp(20px,3vh,44px)]">
        <div className="mx-auto w-full max-w-[1400px] my-auto">
          <div className="grid gap-7 sm:gap-9 lg:grid-cols-[minmax(0,1.08fr)_minmax(440px,0.92fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(520px,0.9fr)] lg:items-center lg:gap-10 xl:gap-16">
            <div className="min-w-0">
              <p className="eyebrow rise">Independent public data for Scotland</p>

              <h1 className="rise mt-4 text-[clamp(38px,4.9vw,78px)] font-[620] leading-[0.98] tracking-[-0.045em] text-balance">
                What Scotland&rsquo;s numbers mean{" "}
                <span className="serif-accent text-[1.06em] text-[var(--hero-muted)]">where you live.</span>
              </h1>

              <p className="rise mt-4 sm:mt-5 max-w-[46ch] text-[16.5px] sm:text-[19px] leading-[1.55] text-[var(--hero-muted)]">
                Pay, council tax, benefits and who decides, in plain English. Every figure links to
                where it came from.
              </p>

              <div className="rise mt-6 sm:mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/council-tax-bands-scotland"
                  className="ui inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-[var(--r-pill)] bg-white px-6 text-[15.5px] font-[580] text-[#00336f] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_10px_24px_-12px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-px no-underline"
                >
                  Check your council tax <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/take-home-pay-calculator-scotland"
                  className="glass ui inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-[var(--r-pill)] px-6 text-[15.5px] font-[560] text-white transition-colors hover:bg-white/12 no-underline"
                >
                  Work out your take home pay
                </Link>
              </div>

              <ul className="rise mt-5 sm:mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] sm:text-[14px] text-[var(--hero-muted)]">
                {TRUST.map((item) => (
                  <li key={item} className="ui inline-flex items-center gap-1.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="shrink-0 text-white/80"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="home-hero-card on-light scale-in min-w-0 rounded-[24px] bg-[var(--surface)] p-5 text-[var(--ink)] shadow-[0_32px_70px_-32px_rgba(0,8,32,0.85),0_0_0_1px_rgba(255,255,255,0.14)] sm:p-7 lg:p-8 xl:p-9">
              <p className="eyebrow">Your area in a minute</p>
              <h2 className="mt-2.5 text-[24px] sm:text-[30px] font-[620] leading-[1.1] tracking-[-0.035em]">
                Enter your postcode
              </h2>
              <p className="mt-2 text-[15px] sm:text-[16px] leading-[1.5] text-[var(--ink-2)]">
                Your council, what your band costs, your MP and MSPs, and who decides what.
              </p>
              <div className="mt-5">
                <PostcodeStart facts={facts} split={split} />
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-[var(--rule)] pt-4">
                {CARD_INCLUDES.map((item) => (
                  <li key={item} className="ui flex items-center gap-2 text-[13.5px] sm:text-[14px] font-[520] text-[var(--ink-2)]">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--action)]" />
                    <span className="min-w-0 leading-[1.35]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="home-hero-dock rise mx-auto w-full max-w-[1400px] mt-8 lg:mt-[clamp(20px,3vh,48px)] border-t border-white/15 pt-5 sm:pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
            <p className="ui text-[12.5px] font-[640] uppercase tracking-[0.09em] text-[var(--hero-muted)]">
              Education, civic tools and public records
            </p>
            <Link
              href="/about"
              className="ui inline-flex items-center gap-1.5 text-[13.5px] font-[560] text-white/90 hover:text-white no-underline transition-colors"
            >
              About our mission and sources <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className="grid gap-3 md:grid-cols-3">
            {HERO_PILLARS.map((item) => (
              <li key={item.href} className="min-w-0">
                <Link
                  href={item.href}
                  className="home-hero-dock-card group flex h-full flex-col justify-between gap-2 rounded-[16px] border border-white/15 bg-white/[0.07] px-4 py-3.5 sm:px-5 sm:py-4 no-underline backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.12]"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="ui text-[15px] font-[640] text-white">
                      {item.tag}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-[15px] text-white/60 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                    >
                      →
                    </span>
                  </span>
                  <span className="ui text-[14.5px] leading-[1.42] text-[var(--hero-muted)] group-hover:text-white">
                    {item.hook}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
    {/* The postcode result renders here, full width, rather than stretching the card and the hero. */}
    <div id={RESULT_SLOT_ID} />
    </>
  );
}
