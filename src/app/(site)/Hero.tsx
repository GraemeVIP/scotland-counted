"use client";

import Link from "@/components/IntentLink";
import PostcodeStart, { RESULT_SLOT_ID } from "@/components/PostcodeStart";
import type { LocalFacts, ResponsibilitySplit } from "@/lib/localFacts";
import { EXPENSE_STORIES, type ExpenseStory } from "@/lib/data/expenseStories";
import { postPath } from "@/lib/routeMap";

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

/**
 * Three expenses stories on the first screen. A big, exact figure with a
 * half told story is the strongest pull the site has, so the opening offers
 * it straight away rather than below the fold. The £23,437 energy bill
 * is left out here because the announcement bar above already leads on it. Figures and lines come from
 * the expenses story list, so they stay in step with the stories.
 */
const HOT_STORIES = [
  "msp-edinburgh-flats-commuter-belt",
  "scottish-mp-msp-expenses-what-it-could-buy",
  "scottish-mps-flights-climate-expenses",
]
  .map((slug) => EXPENSE_STORIES.find((story) => story.slug === slug))
  .filter((story): story is ExpenseStory => Boolean(story));

export default function Hero({
  facts,
  split,
}: {
  facts: Record<string, LocalFacts>;
  split: ResponsibilitySplit;
}) {
  return (
    <>
    <section className="saltire-hero -mt-[72px] pt-[72px] rounded-b-[var(--r-l)]">
      <div className="beams" aria-hidden="true">
        <div className="beam a" />
        <div className="beam b" />
        <div className="beam-edge a" />
        <div className="beam-edge b" />
      </div>

      <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-14 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)] lg:items-center">
          <div className="min-w-0">
            <p className="eyebrow rise">Independent public data for Scotland</p>

            <h1 className="rise mt-6 text-[clamp(44px,7vw,96px)] font-[600] leading-[0.96] tracking-[-0.05em] text-balance">
              What Scotland&rsquo;s numbers mean{" "}
              <span className="serif-accent text-[1.06em] text-[var(--hero-muted)]">where you live.</span>
            </h1>

            <p className="rise mt-6 max-w-[42ch] text-[clamp(17px,1.5vw,20px)] leading-[1.55] text-[var(--hero-muted)]">
              Pay, council tax, benefits and who decides, in plain English. Every figure links to
              where it came from.
            </p>

            <div className="rise mt-8 flex flex-wrap gap-3">
              <Link
                href="/council-tax-bands-scotland"
                className="ui inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-white px-5 text-[15.5px] font-[580] text-[#00336f] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_10px_24px_-12px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-px"
              >
                Check your council tax <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/take-home-pay-calculator-scotland"
                className="glass ui inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] px-5 text-[15.5px] font-[560] text-white transition-colors hover:bg-white/10"
              >
                Work out your take home pay
              </Link>
            </div>

            {HOT_STORIES.length > 0 && (
              <div className="rise mt-8">
                <p className="ui text-[13px] font-[640] uppercase tracking-[0.08em] text-[var(--hero-muted)]">
                  New from the expenses files
                </p>
                <ul className="mt-2.5 grid max-w-[560px] gap-2">
                  {HOT_STORIES.map((story) => (
                    <li key={story.slug}>
                      <Link
                        href={postPath(story.slug)}
                        className="group flex items-baseline gap-3 rounded-[14px] border border-white/15 bg-white/[0.06] px-4 py-2.5 no-underline transition-colors hover:bg-white/[0.12]"
                      >
                        <span className="figure-num tnum shrink-0 text-[19px] leading-none text-white">{story.stat}</span>
                        <span className="ui min-w-0 text-[15px] leading-[1.4] text-[var(--hero-muted)] group-hover:text-white">
                          {story.hook} <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ul className="rise mt-6 flex flex-wrap gap-2">
              {TRUST.map((item) => (
                <li
                  key={item}
                  className="ui rounded-[var(--r-pill)] border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[14px] text-[var(--hero-muted)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="on-light scale-in min-w-0 rounded-[var(--r-l)] bg-[var(--surface)] p-6 text-[var(--ink)] shadow-[0_40px_80px_-40px_rgba(0,8,32,0.85)] sm:p-8">
            <p className="eyebrow">Your area in a minute</p>
            <h2 className="mt-3 text-[26px] font-[600] leading-[1.1] tracking-[-0.035em]">
              Enter your postcode
            </h2>
            <p className="mt-2 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
              Your council, what your band costs, your MP and MSPs, and who decides what.
            </p>
            <div className="mt-5">
              <PostcodeStart facts={facts} split={split} />
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* The postcode result renders here, full width, rather than stretching the card and the hero. */}
    <div id={RESULT_SLOT_ID} />
    </>
  );
}
