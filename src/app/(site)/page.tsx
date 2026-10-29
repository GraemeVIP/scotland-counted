import Link from "next/link";
import { FullBleed, Page } from "@/components/Blocks";
import { JsonLd, articleJsonLd, faqJsonLd, meta } from "@/lib/seo";
import BlogCarousel from "@/components/BlogCarousel";
import { postsByDate, type Post } from "@/lib/data/posts";
import { current as flagship } from "@/lib/data/flagship";
import Hero from "./Hero";
import { buildLocalFacts, responsibilitySplit } from "@/lib/localFacts";
import NewsletterSignup from "@/components/NewsletterSignup";
import { site } from "@/lib/site";
import { MINIMUM_WAGE, REAL_LIVING_WAGE, bandDRange, bandFor, pounds } from "@/lib/data/quickAnswers";
import { councilTaxBandPath, councilTaxPath } from "@/lib/routeMap";

const glasgowD = bandFor("glasgow-city", "D");
const range = bandDRange();

/**
 * The homepage.
 *
 * It used to run eleven sections competing for the first visit: a poverty
 * hero, postcode box, video, article carousel, quiz, share graphic, area
 * directory, national statistics, Glasgow spotlight, political action, tools
 * and FAQs. Each was good. Together they asked a first-time visitor to choose
 * between eleven things before doing anything.
 *
 * Now it does one job: say what the site is, then offer five doors. Everything
 * removed moved somewhere it fits better rather than being deleted, and the
 * mapping is written down in docs/site-repositioning-plan.md so nothing gets
 * quietly lost.
 */

const homeReads = postsByDate().filter((post): post is Post => Boolean(post));

export const metadata = meta({
  title: "Scotland Counted | Independent Public Data for Scotland",
  description:
    "Scottish public data made clear: local facts, council spending and performance, take-home pay, council tax and who makes the decisions.",
  path: "/",
  type: "website",
});

const ICONS = {
  pin: <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M3 10h18M16 15h2" /></>,
  home: <><path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" /><path d="M10 20v-5h4v5" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  people: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><circle cx="17" cy="9" r="2.4" /><path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" /></>,
};

/** Six doors. Each says what you get, not what the section is called. */
const DOORS: Array<{ href: string; title: string; body: string; icon: keyof typeof ICONS }> = [
  { href: "/areas", title: "Your area", body: "Child poverty, benefits and pay for all 32 councils", icon: "pin" },
  { href: "/money", title: "Money", body: "Wages, tax, bills and what help exists", icon: "wallet" },
  { href: "/council-tax-bands-scotland", title: "Council tax", body: "Every band for every council, water included", icon: "home" },
  { href: "/councils", title: "Councils", body: "Budgets, results, audits and promises", icon: "chart" },
  { href: "/who-decides", title: "Who decides", body: "Westminster, Holyrood or your council", icon: "people" },
  { href: "/blog", title: "Explainers", body: "The longer pieces, with the working shown", icon: "book" },
];


const EVIDENCE = [
  { href: "/methods", label: "Methods and sources", body: "Exactly how every figure was counted" },
  { href: "/data", label: "Download the data", body: "Source files, and the rules for reusing them" },
  { href: "/corrections", label: "Corrections", body: "Errors, dated, and what was done about them" },
  { href: "/about", label: "Who publishes this", body: "One person, named, with no funding or party" },
];

const FAQ = [
  {
    q: "What is Scotland Counted?",
    a: "An independent site that takes Scottish public data and explains what it means where you live. It covers poverty and living standards, pay and council tax, council spending and performance, and which government is responsible for each. Every figure links to its official source.",
  },
  {
    q: "Who runs it and who pays for it?",
    a: "It is written and published by one person, and named on the about page. There is no funding, no advertising, no donations and no party affiliation.",
  },
  {
    q: "What happens to the postcode I enter?",
    a: "It is used only to find your area, MP and MSPs. It is not saved and it never appears in a shareable link. Anything you type into a calculator stays in your browser.",
  },
  {
    q: "Who has the power to change any of this?",
    a: "The UK Government, the Scottish Government and your council each decide different things. You do not need to know which is which: the who decides page lists fifteen everyday issues and names the one responsible for each.",
  },
  {
    q: "What do I do if a figure is wrong?",
    a: "Report it. Corrections are fixed and then logged in public with the date, because a site that asks you to check its work has to show what happened when somebody did.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: "Independent public data for Scotland",
          description: metadata.description as string,
          path: "/",
        })}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <Hero facts={buildLocalFacts()} split={responsibilitySplit()} />

      <Page>
        {/* ---------- The answers people look for most ---------- */}
        <section className="pt-20 sm:pt-28" aria-labelledby="answers">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <div>
              <p className="eyebrow">Most searched</p>
              <h2 id="answers" className="h2 mt-4 max-w-[16ch] text-[clamp(32px,4.2vw,54px)]">
                The answers people <span className="serif-accent text-[var(--action-text)]">look for most</span>
              </h2>
            </div>
            <Link href="/money" className="btn btn-ghost">
              Everything about your money <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-9 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(200px,auto)]">
            <Link href="/minimum-wage-scotland" className="tile flex flex-col gap-3 p-7 sm:p-8 sm:col-span-2 lg:row-span-2 no-underline">
              <span className="tile-key">Minimum wage Scotland</span>
              <span className="display-stat text-[clamp(64px,7vw,104px)]">{pounds(MINIMUM_WAGE.current.over21, true)}</span>
              <span className="text-[15px] text-[var(--muted)]">an hour for anyone 21 and over, until 31 March 2027</span>
              <span className="max-w-[44ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                On 1 April 2027 it goes up 50p to {pounds(MINIMUM_WAGE.next.over21, true)}. Scotland doesn&rsquo;t set its own rate; Westminster does.
              </span>
              <span className="mt-4 grid h-[140px] grid-cols-4 items-end gap-2.5" aria-hidden="true">
                {MINIMUM_WAGE.history.map((step, index) => {
                  const last = index === MINIMUM_WAGE.history.length - 1;
                  return (
                    <span key={step.year} className="flex h-full flex-col justify-end gap-1.5">
                      <span className="tile-key text-center">{step.year}</span>
                      <span
                        className={`flex items-end justify-center rounded-t-[12px] rounded-b-[5px] pb-2.5 text-[13px] font-[580] tnum ${
                          last ? "bg-[var(--action)] text-[var(--action-ink)]" : "bg-[var(--paper-2)] text-[var(--ink-2)]"
                        }`}
                        style={{ height: `${Math.round((step.rate / MINIMUM_WAGE.history[MINIMUM_WAGE.history.length - 1].rate) * 86)}%` }}
                      >
                        {pounds(step.rate, true)}
                      </span>
                    </span>
                  );
                })}
              </span>
              <span className="mt-auto flex justify-between gap-3 border-t border-[var(--rule)] pt-3 text-[13px] text-[var(--muted)]">
                <span>Source <b className="font-[560] text-[var(--ink)]">{MINIMUM_WAGE.source.publisher}</b></span>
                <span>National Living Wage</span>
              </span>
            </Link>

            <Link href={councilTaxPath("glasgow-city")} className="tile flex flex-col gap-2.5 p-6 no-underline">
              <span className="tile-key">Glasgow council tax</span>
              <span className="display-stat text-[clamp(40px,4vw,54px)]">{pounds(glasgowD.councilTax)}</span>
              <span className="text-[14.5px] text-[var(--muted)]">Band D, a year, before water</span>
              <span className="mt-auto flex justify-between gap-3 border-t border-[var(--rule)] pt-3 text-[13px] text-[var(--muted)]">
                <span>Up <b className="font-[560] text-[var(--ink)]">{glasgowD.change.percent.toFixed(1)}%</b> on last year</span>
                <span>2026/27</span>
              </span>
            </Link>

            <Link href="/real-living-wage-scotland" className="tile tile-blue flex flex-col gap-2.5 p-6 no-underline">
              <span className="tile-key">Real Living Wage</span>
              <span className="display-stat text-[clamp(40px,4vw,54px)]">{pounds(REAL_LIVING_WAGE.uk, true)}</span>
              <span className="text-[14.5px] text-[var(--hero-muted)]">an hour outside London</span>
              <span className="mt-auto flex justify-between gap-3 border-t border-white/20 pt-3 text-[13px] text-[var(--hero-muted)]">
                <span>Source <b className="font-[560] text-white">{REAL_LIVING_WAGE.source.publisher}</b></span>
              </span>
            </Link>

            <Link href={councilTaxBandPath("d")} className="tile flex flex-col gap-2.5 p-6 no-underline">
              <span className="tile-key">Council tax Band D</span>
              <span className="display-stat text-[clamp(40px,4vw,54px)]">{pounds(range.lowest.total)}</span>
              <span className="text-[14.5px] text-[var(--muted)]">
                to {pounds(range.highest.total)} a year across all {range.count} councils, water included
              </span>
              <span className="mt-auto flex justify-between gap-3 border-t border-[var(--rule)] pt-3 text-[13px] text-[var(--muted)]">
                <span>Lowest <b className="font-[560] text-[var(--ink)]">{range.lowest.name}</b></span>
                <span>2026/27</span>
              </span>
            </Link>

            <Link href="/representatives" className="tile flex flex-col justify-between gap-4 p-6 no-underline">
              <span>
                <span className="tile-key">Who is my MSP?</span>
                <span className="mt-3 block text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  Your MP and all eight MSPs, with a ready written email to each.
                </span>
              </span>
              <span className="btn btn-primary self-start !min-h-10 !px-4 !py-2 !text-[14.5px]">
                Find yours <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </section>

        {/* ---------- One current finding ---------- */}
        <section className="pt-14" aria-labelledby="flagship">
          <Link
            href={flagship.href}
            className="tile tile-night grid items-center gap-x-12 gap-y-5 p-8 no-underline sm:p-12 md:grid-cols-[auto_minmax(0,1fr)]"
          >
            <span
              className="display-stat text-[clamp(84px,13vw,176px)] leading-[0.85]"
              style={{ background: "linear-gradient(180deg,#ffffff,#8fb6ff)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
            >
              {flagship.value.replace(" of ", "/")}
            </span>
            <span className="grid gap-3">
              <span className="tile-key">{flagship.kicker}</span>
              <span id="flagship" className="text-[clamp(22px,2.6vw,34px)] font-[600] leading-[1.15] tracking-[-0.03em]">
                {flagship.unit}.
              </span>
              <span className="max-w-[58ch] text-[15.5px] leading-[1.6] text-[var(--deep-muted)]">{flagship.context}</span>
              <span className="mt-1 text-[13.5px] text-[var(--deep-muted)]">
                Source <b className="font-[560] text-white">{flagship.source.publisher}</b> · {flagship.hrefLabel} <span aria-hidden="true">→</span>
              </span>
            </span>
          </Link>
        </section>

        {/* ---------- Six doors ---------- */}
        <section className="pt-24" aria-labelledby="doors">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 id="doors" className="h2 mt-4 text-[clamp(32px,4.2vw,54px)]">
                What do you <span className="serif-accent text-[var(--action-text)]">want to know?</span>
              </h2>
            </div>
            <p className="max-w-[44ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
              Six ways into the same evidence. Pick the one that matches your question.
            </p>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DOORS.map((door) => (
              <Link key={door.href} href={door.href} className="tile group flex items-center gap-4 p-5 no-underline">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[var(--action-tint)] text-[var(--action-text)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {ICONS[door.icon]}
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[18px] font-[600] tracking-[-0.02em]">{door.title}</span>
                  <span className="block text-[14.5px] leading-[1.45] text-[var(--muted)]">{door.body}</span>
                </span>
                <span aria-hidden="true" className="text-[var(--muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--action-text)]">→</span>
              </Link>
            ))}
          </div>
        </section>
      </Page>

      {/* ---------- The reading rail ----------
          A carousel, not one card, and outside the page container, not in it.
          When it came back it was restored inside <Page>, which double-framed
          it: the cards clipped against an inner box edge with dead margin
          outside, so the cut-off card read as a mistake instead of as "there
          is more this way". The band runs edge to edge, the heading stays on
          the content grid, and the track bleeds to the right-hand edge of the
          screen, where a peeking card actually means what it implies. */}
      <BlogCarousel posts={homeReads} />

      <Page>
        {/* ---------- Trust ---------- */}
        <section className="pt-24 pb-6" aria-labelledby="trust">
          <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(280px,0.62fr)_minmax(0,1.38fr)]">
            <div>
              <p className="eyebrow">Check the work</p>
              <h2 id="trust" className="h2 mt-4 max-w-[13ch] text-[clamp(32px,4vw,50px)]">
                Nothing here asks you to <span className="serif-accent text-[var(--action-text)]">take my word</span>
              </h2>
              <p className="mt-4 max-w-[36ch] text-[17px] leading-[1.55] text-[var(--ink-2)]">
                Every figure links to the official document it came from. When something is
                wrong it gets fixed and the fix is published.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {EVIDENCE.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="tile p-5 no-underline"
                >
                  <strong className="block text-[17px] leading-[1.3]">{item.label}</strong>
                  <span className="mt-1.5 block text-[15px] leading-[1.5] text-[var(--ink-2)]">
                    {item.body}
                  </span>
                </Link>
              ))}
              <p className="ui mt-2 border-t border-[var(--rule)] pt-4 text-[15px] leading-[1.55] text-[var(--ink-2)] sm:col-span-2">
                Latest finding from {flagship.source.publisher}. Published by {site.author.name},{" "}
                {site.organisation.name}. No funding, no advertising, no party.
              </p>
            </div>
          </div>
        </section>

      </Page>

      {/* ---------- Keep in touch ---------- */}
      <FullBleed className="bg-transparent">
        <Page>
          <section className="pt-16" aria-labelledby="updates">
            <div className="tile relative overflow-hidden">
              <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:items-center lg:gap-12 lg:p-12">
                <div>
                  <p className="eyebrow">When the numbers move</p>
                  <h2 id="updates" className="h2 mt-4 max-w-[16ch] text-[clamp(32px,4vw,50px)]">
                    Councils publish. <span className="serif-accent text-[var(--action-text)]">Nobody tells you.</span>
                  </h2>
                  <p className="mt-4 max-w-[40ch] text-[17px] leading-[1.55] text-[var(--ink-2)]">
                    Audits, budgets and benchmarking land quietly through the year. I read them and
                    send one email when something changes.
                  </p>
                </div>
                <div className="rounded-[var(--r-m)] bg-[var(--deep)] p-6 text-white shadow-[var(--shadow-2)] sm:p-8">
                  <NewsletterSignup variant="feature" />
                  <p className="mt-6 max-w-[54ch] border-t border-white/15 pt-5 text-[15px] leading-[1.6] text-[#cbd3e2]">
                    Alerts for one council area in particular are planned but not built yet. For now
                    every update covers all 32. You can also{" "}
                    <Link href="/updates" className="text-white underline decoration-white/50 underline-offset-4 hover:decoration-white">
                      follow the public log
                    </Link>
                    , which has an RSS feed.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Page>
      </FullBleed>

      <Page>
        {/* ---------- Questions ---------- */}
        <section className="pt-16" aria-labelledby="questions">
          <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(280px,0.62fr)_minmax(0,1.38fr)]">
            <div>
              <p className="eyebrow">Straight answers</p>
              <h2 id="questions" className="h2 mt-4 max-w-[12ch] text-[clamp(32px,4vw,50px)]">
                What people <span className="serif-accent text-[var(--action-text)]">ask first</span>
              </h2>
            </div>
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                {FAQ.map((item, index) => (
                  <details
                    key={item.q}
                    className={`group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5 open:border-[var(--brand)] ${index === FAQ.length - 1 ? "sm:col-span-2" : ""}`}
                  >
                    <summary className="ui flex cursor-pointer list-none items-start justify-between gap-4 text-[17px] font-[600] leading-[1.35]">
                      {item.q}
                      <span
                        aria-hidden="true"
                        className="text-[22px] leading-none text-[var(--action-text)] transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-4 border-t border-[var(--rule)] pt-4 text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
              <Link href="/faq" className="btn btn-ghost mt-6">
                Search all questions <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </Page>
    </>
  );
}
