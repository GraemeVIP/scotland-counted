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
    "See what Scotland's numbers mean where you live. Local facts, council spending and performance, take-home pay and council tax, and who is responsible for each of it.",
  path: "/",
  type: "website",
});

/** The five doors. Each says what you get, not what the section is called. */
const DOORS = [
  {
    href: "/areas",
    eyebrow: "Your area",
    title: "What the figures say where you live",
    body: "Child poverty, benefits and pay for all 32 council areas, each with a permanent page you can link to.",
  },
  {
    href: "/money",
    eyebrow: "Your money",
    title: "What you keep and what it costs",
    body: "Take-home pay on Scottish rates, council tax by band, and plain answers on benefits, rent help and bills.",
  },
  {
    href: "/councils",
    eyebrow: "Councils",
    title: "What your council spends and delivers",
    body: "Budgets, service results, audit findings and promises, with every figure linked to the document it came from.",
  },
  {
    href: "/who-decides",
    eyebrow: "Who decides",
    title: "Westminster, Holyrood or your council",
    body: "Fifteen everyday issues, and which government actually controls each one. Stop writing to the wrong building.",
  },
  {
    href: "/blog",
    eyebrow: "Explainers",
    title: "The longer pieces, with the working shown",
    body: "Evidence-led explainers on poverty, money, politics and what to do about any of it.",
  },
];

const TOOLS = [
  {
    href: "/take-home-pay-calculator-scotland",
    eyebrow: "Take-home pay",
    title: "What you actually keep",
    body: "Scotland's tax bands, pensions and student loans. Or work backwards from the pay you need.",
  },
  {
    href: "/council-tax-bands-scotland",
    eyebrow: "Council tax",
    title: "What your band really costs",
    body: "All 32 councils, bands A to H, with the water charges most published figures leave out.",
  },
  {
    href: "/find-my-mp-and-msp",
    eyebrow: "Representatives",
    title: "Who represents you",
    body: "Your MP, your constituency MSP and your seven regional MSPs. The postcode is not stored.",
  },
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
        {/* ---------- Five doors ---------- */}
        <section className="py-12 sm:py-16" aria-labelledby="doors">
          <p className="kicker mb-3 text-[var(--brand)]">Pick a starting point</p>
          <h2 id="doors" className="display-stat max-w-[16ch] text-[clamp(32px,4vw,50px)]">
            What do you want to find out?
          </h2>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {DOORS.map((door, index) => (
              <Link
                key={door.href}
                href={door.href}
                className={`group flex flex-col rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-[var(--shadow-2)] lg:col-span-2 ${
                  index === 3 ? "lg:col-start-2" : ""
                } ${
                  index === 4
                    ? "md:col-span-2 md:mx-auto md:w-[calc(50%-0.5rem)] lg:col-start-4 lg:mx-0 lg:w-auto"
                    : ""
                }`}
              >
                <p className="label">{door.eyebrow}</p>
                <p className="mt-3 text-[21px] font-[770] leading-[1.2] transition-colors group-hover:text-[var(--brand)]">
                  {door.title}
                </p>
                <p className="mt-2.5 flex-1 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  {door.body}
                </p>
                <span
                  aria-hidden="true"
                  className="mt-6 text-[18px] text-[var(--action)] transition-transform group-hover:translate-x-1.5"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- Tools ---------- */}
        <section className="border-t border-[var(--rule)] py-12 sm:py-16" aria-labelledby="tools">
          <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(280px,0.62fr)_minmax(0,1.38fr)]">
            <div>
              <p className="kicker mb-3 text-[var(--action)]">Free, no sign-up</p>
              <h2 id="tools" className="display-stat max-w-[12ch] text-[clamp(34px,4vw,52px)]">
                Work out your own numbers
              </h2>
              <p className="mt-4 max-w-[34ch] text-[17px] leading-[1.55] text-[var(--ink-2)]">
                Nothing you type is sent anywhere. Every sum happens in your browser.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-[var(--shadow-2)]"
                >
                  <p className="label">{tool.eyebrow}</p>
                  <p className="mt-3 text-[19px] font-[770] leading-[1.2] transition-colors group-hover:text-[var(--brand)]">
                    {tool.title}
                  </p>
                  <p className="mt-2.5 flex-1 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                    {tool.body}
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-6 text-[18px] text-[var(--action)] transition-transform group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
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
        <section className="border-t border-[var(--rule)] py-12 sm:py-16" aria-labelledby="trust">
          <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(280px,0.62fr)_minmax(0,1.38fr)]">
            <div>
              <p className="kicker mb-3 text-[var(--good-text)]">Check the work</p>
              <h2 id="trust" className="display-stat max-w-[12ch] text-[clamp(34px,4vw,52px)]">
                Nothing here asks you to take my word
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
                  className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 no-underline transition-colors hover:border-[var(--brand)]"
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
      <FullBleed className="border-y border-[var(--rule)] bg-[var(--paper-2)]">
        <Page>
          <section className="py-12 sm:py-16" aria-labelledby="updates">
            <div className="relative overflow-hidden rounded-[var(--r-l)] border border-[var(--rule)] bg-[var(--surface)] shadow-[var(--shadow-1)]">
              <div aria-hidden="true" className="absolute inset-y-0 left-0 w-2 bg-[var(--action)]" />
              <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:items-center lg:gap-12 lg:p-12">
                <div>
                  <p className="kicker mb-3 text-[var(--action-hover)]">When the numbers move</p>
                  <h2 id="updates" className="display-stat max-w-[18ch] text-[clamp(36px,4vw,54px)]">
                    Councils publish. Nobody tells you
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
        <section className="border-t border-[var(--rule)] py-12 sm:py-16" aria-labelledby="questions">
          <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(280px,0.62fr)_minmax(0,1.38fr)]">
            <div>
              <p className="kicker mb-3 text-[var(--brand)]">Straight answers</p>
              <h2 id="questions" className="display-stat max-w-[12ch] text-[clamp(34px,4vw,52px)]">
                What people ask first
              </h2>
            </div>
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                {FAQ.map((item, index) => (
                  <details
                    key={item.q}
                    className={`group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5 open:border-[var(--brand)] ${index === FAQ.length - 1 ? "sm:col-span-2" : ""}`}
                  >
                    <summary className="ui flex cursor-pointer list-none items-start justify-between gap-4 text-[17px] font-[720] leading-[1.35]">
                      {item.q}
                      <span
                        aria-hidden="true"
                        className="text-[22px] leading-none text-[var(--action)] transition-transform group-open:rotate-45"
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
