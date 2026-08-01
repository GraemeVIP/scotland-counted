import Link from "next/link";
import { Page, FullBleed, EvidenceDetails } from "@/components/Blocks";
import { JsonLd, articleJsonLd, faqJsonLd, videoJsonLd, meta } from "@/lib/seo";
import { councilsByLevel, SCOTLAND_PCTS } from "@/lib/data/councils";
import { scotlandPoverty } from "@/lib/data/scotland";
import { getSources } from "@/lib/data/sources";
import { site } from "@/lib/site";
import { PictoGrid } from "@/components/Motion";
import AreaGrid from "@/components/AreaGrid";
import WhyBother from "@/components/WhyBother";
import Hero from "./Hero";
import VideoEmbed from "@/components/VideoEmbed";
import { costOfLivingVideo as VIDEO } from "@/lib/data/video";

export const metadata = meta({
  title: "Poverty in Scotland, explained clearly",
  description:
    "See what poverty means where you live, find your MP and MSP automatically, and open ready-written emails. Every figure is sourced.",
  path: "/",
  type: "website",
});

const FAQ = [
  {
    q: "How many people live in poverty in Scotland?",
    a: "About 1 in 6 people. The exact figure is 17%, or around 940,000 people, after rent or mortgage costs in 2022–25.",
  },
  {
    q: "Is this only about child poverty?",
    a: "No. The site also covers adults, pensioners, work, out-of-work benefits, pay, housing and health. Child poverty is used for local comparisons because it is the best reliable local measure available.",
  },
  {
    q: "Why do local pages lead with child poverty?",
    a: "The main poverty survey can tell us about Scotland as a whole, but not each local area safely. Child-poverty figures use benefit and tax records, so every council area can be compared in the same way.",
  },
  {
    q: "Who has the power to reduce poverty?",
    a: "The UK Government, Scottish Government and councils each decide different things. You do not need to know which is which: enter your postcode and the site sends each request to the right person.",
  },
  {
    q: "What happens to the postcode I enter?",
    a: "It is used only to find your area, MP and MSP. The site does not save it. Anything you add stays in your browser and your own email app.",
  },
];

export default function Home() {
  const byLevel = councilsByLevel();
  const glasgow = byLevel.find((council) => council.slug === "glasgow-city")!;
  const scotlandChange = (SCOTLAND_PCTS[9] - SCOTLAND_PCTS[0]).toFixed(1);
  const nationalSource = getSources([scotlandPoverty.sourceId])[0];
  const groups = [
    { ...scotlandPoverty.all, plain: "1 in 6" },
    { ...scotlandPoverty.children, plain: "1 in 5" },
    { ...scotlandPoverty.workingAge, plain: "1 in 6" },
    { ...scotlandPoverty.pensioners, plain: "1 in 8" },
  ];

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: "Nearly a million people in Scotland live in poverty",
          description: metadata.description as string,
          path: "/",
        })}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <Hero />

      {/*
        The video sits directly under the hero, on a dark band so it reads as a
        thing in its own right rather than an illustration inside an article.
        It is six minutes and it answers the question most people actually
        arrive with, so it earns the position — but it loads nothing from
        YouTube until somebody presses play.
      */}
      <JsonLd data={videoJsonLd(VIDEO)} />
      <FullBleed>
        <div className="bg-[var(--deep)] py-14 text-[var(--deep-ink)] sm:py-20">
          <Page>
            <div className="mx-auto grid max-w-[1120px] gap-x-14 gap-y-9 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
              <div>
                <p className="kicker mb-3 text-[var(--action)]">Start here · 6 minutes</p>
                <h2
                  id="explainer-video"
                  className="display-stat text-[clamp(32px,4vw,50px)] max-w-[15ch]"
                >
                  Where did the money actually go?
                </h2>
                <p className="mt-5 max-w-[46ch] text-[17.5px] leading-[1.6] opacity-85">
                  Your bills went up and stayed up. You were told it was the war, or the pandemic,
                  or just bad luck. Some of it was. This is what the rest of it was — energy
                  profits, supermarket fuel margins, and what the ONS, the IMF and the competition
                  watchdog found when they looked.
                </p>
                <Link
                  href="/blog/why-is-the-cost-of-living-so-high"
                  className="ui mt-6 inline-block text-[16px] font-[680] underline decoration-current/40 underline-offset-4 hover:decoration-current"
                >
                  Read the written version, with every source
                  <span aria-hidden="true"> →</span>
                </Link>
              </div>

              <VideoEmbed
                onDark
                id={VIDEO.youtubeId}
                title={VIDEO.name}
                poster={VIDEO.thumbnail}
              />
            </div>
          </Page>
        </div>
      </FullBleed>

      <Page>
        <AreaGrid className="py-16 sm:py-20" />
      </Page>

      <div className="border-y border-[var(--rule)] bg-[var(--paper-2)]">
        <Page>
          <section className="py-16 sm:py-20" aria-labelledby="national-picture">
            <div className="grid gap-x-14 gap-y-9 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:items-start">
              <div>
                <p className="kicker text-[var(--brand)] mb-3">Across Scotland</p>
                <h2
                  id="national-picture"
                  className="display-stat text-[clamp(34px,4.2vw,54px)] max-w-[15ch]"
                >
                  Poverty is not rare, and it is not one kind of person
                </h2>
                <div className="mt-6 max-w-[48ch] space-y-4 text-[17px] leading-[1.6] text-[var(--ink-2)]">
                  <p>
                    It can mean working, paying the rent and still not having enough left for
                    heating, travel, clothes or an unexpected bill.
                  </p>
                  <p>
                    It affects children, adults and pensioners. The easy-to-picture number comes
                    first. The exact figure stays beside it for anyone who wants to check.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {groups.map((group) => (
                  <article
                    key={group.label}
                    className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-7"
                    style={{ boxShadow: "var(--shadow-1)" }}
                  >
                    <p className="ui text-[16px] font-[720] text-[var(--ink-2)]">{group.label}</p>
                    <p className="display-stat mt-5 text-[clamp(38px,4vw,52px)] text-[var(--brand)]">
                      {group.plain}
                    </p>
                    <p className="ui mt-4 text-[15.5px] font-[650] text-[var(--ink-2)]">
                      Exact figure: {group.pct}%
                    </p>
                    {"count" in group && (
                      <p className="ui mt-1 text-[15px] text-[var(--muted)]">
                        {group.count.toLocaleString("en-GB")} people
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </div>

            <EvidenceDetails className="mt-7 max-w-[820px] mx-auto">
              <p>
                The official measure calls this <strong>relative poverty after housing costs</strong>.
                It means a household has less than 60% of the usual UK income after rent or
                mortgage costs. The source is {" "}
                <a href={nationalSource.url} target="_blank" rel="noopener noreferrer">
                  {nationalSource.title}, {nationalSource.publisher}
                </a>
                .
              </p>
            </EvidenceDetails>
          </section>
        </Page>
      </div>

      <Page>
        <section className="py-16 sm:py-20" aria-labelledby="work-and-poverty">
          <div className="overflow-hidden rounded-[var(--r-l)] bg-[var(--deep)] text-[var(--deep-ink)]">
            <div className="grid lg:grid-cols-[minmax(310px,0.78fr)_minmax(0,1.22fr)]">
              <div className="bg-[var(--brand)] p-7 sm:p-10 lg:p-12">
                <p className="kicker mb-5 text-white/80">Work and poverty</p>
                <p className="display-stat text-[clamp(68px,8vw,108px)]">3 in 4</p>
                <div className="mt-7 max-w-[300px]">
                  <PictoGrid
                    lit={3}
                    total={4}
                    columns={4}
                    litColor="#ffffff"
                    dimColor="#ffffff"
                    dimOpacity={0.24}
                  />
                </div>
                <p className="mt-6 max-w-[18ch] text-[20px] font-[720] leading-[1.35]">
                  children in poverty live with someone who works
                </p>
                <p className="mt-3 text-[15px] text-white/70">
                  Official Scottish Government figures, 2022–25
                </p>
              </div>

              <div className="p-7 sm:p-10 lg:p-12">
                <p className="kicker mb-3 text-[var(--action)]">What that tells us</p>
                <h2
                  id="work-and-poverty"
                  className="display-stat max-w-[18ch] text-[clamp(34px,4vw,52px)]"
                >
                  A job does not always pay enough to live on
                </h2>
                <p className="mt-6 max-w-[58ch] text-[18px] leading-[1.6] opacity-85">
                  A job can be low-paid, offer too few hours or change from week to week. Rent,
                  food and energy can rise faster than wages. Benefits can also fall short.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {["Low pay", "Too few hours", "Bills rising faster"].map((reason) => (
                    <div
                      key={reason}
                      className="rounded-[var(--r-s)] border border-white/15 bg-white/[0.055] px-4 py-4 text-[16px] font-[700]"
                    >
                      {reason}
                    </div>
                  ))}
                </div>
                <p className="mt-7 text-[16px] leading-[1.55] opacity-80">
                  Every area page shows poverty, out-of-work benefits, the legal minimum wage and
                  a carefully labelled ONS pay estimate. {" "}
                  <Link
                    href="/areas"
                    className="font-[720] text-white underline decoration-[var(--action)] decoration-2 underline-offset-4"
                  >
                    See the figures where you live
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 sm:pb-20" aria-labelledby="glasgow-spotlight">
          <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.65fr)] lg:items-end">
            <div>
              <p className="kicker mb-3 text-[var(--brand)]">Glasgow · its own record</p>
              <h2
                id="glasgow-spotlight"
                className="display-stat max-w-[16ch] text-[clamp(34px,4.2vw,54px)]"
              >
                Glasgow has been hit hardest
              </h2>
            </div>
            <p className="max-w-[44ch] text-[17px] leading-[1.6] text-[var(--ink-2)] lg:justify-self-end">
              Scotland-wide figures matter, but they must not hide what has happened in Glasgow.
              It has the highest rate and the steepest ten-year rise of any Scottish council area.
            </p>
          </div>

          <div className="overflow-hidden rounded-[var(--r-l)] bg-[var(--deep)] text-[var(--deep-ink)]">
            <div className="grid lg:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)]">
              <div className="bg-[var(--brand)] p-7 sm:p-10 lg:p-12">
                <p className="kicker text-white/80">Children in poverty</p>
                <p className="display-stat mt-7 text-[clamp(72px,9vw,120px)]">{glasgow.pcts[9]}%</p>
                <p className="mt-5 max-w-[18ch] text-[22px] font-[730] leading-[1.3]">
                  more than 1 in 3 children in Glasgow
                </p>
                <p className="mt-4 text-[16px] text-white/75">
                  {glasgow.counts[9].toLocaleString("en-GB")} children
                </p>
              </div>

              <div className="p-7 sm:p-10 lg:p-12">
                <h3 className="max-w-[22ch] text-[28px] font-[780] leading-[1.15] sm:text-[34px]">
                  The worst rate in Scotland — and the biggest rise
                </h3>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[var(--r-s)] border border-white/15 bg-white/[0.055] p-5">
                    <p className="display-stat text-[38px] text-[var(--action)]">
                      +{glasgow.change.toFixed(1)} points
                    </p>
                    <p className="mt-2 text-[15.5px] opacity-75">rise in Glasgow over ten years</p>
                  </div>
                  <div className="rounded-[var(--r-s)] border border-white/15 bg-white/[0.055] p-5">
                    <p className="display-stat text-[38px]">+{scotlandChange} points</p>
                    <p className="mt-2 text-[15.5px] opacity-75">rise across Scotland</p>
                  </div>
                </div>
                <p className="mt-7 max-w-[58ch] text-[17px] leading-[1.6] opacity-[0.82]">
                  The Glasgow record also follows work, benefits, wages, neighbourhoods and life
                  expectancy. It shows what changed, why the city was hit harder and which
                  government made which decisions.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/the-numbers" className="btn btn-primary">
                    See Glasgow&apos;s full story <span aria-hidden="true">→</span>
                  </Link>
                  <Link href="/why-glasgow" className="btn border-current/35 text-current hover:bg-white/10">
                    Why it is worse here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <WhyBother className="pb-10 sm:pb-12" />

        {/*
          Most people arrive with a practical question about their own money
          long before they care about a poverty statistic. The two calculators
          answer one immediately, and earn the right to the rest of the site.
        */}
        <section className="border-t border-[var(--rule)] py-12 sm:py-14" aria-labelledby="tools">
          <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(280px,0.62fr)_minmax(0,1.38fr)]">
            <div>
              <p className="kicker mb-3 text-[var(--action)]">Free, no sign-up</p>
              <h2 id="tools" className="display-stat max-w-[12ch] text-[clamp(34px,4vw,52px)]">
                Work out your own numbers
              </h2>
              <p className="mt-4 max-w-[34ch] text-[17px] leading-[1.55] text-[var(--ink-2)]">
                Nothing you type is sent anywhere. Both sums happen in your browser.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  href: "/take-home-pay-calculator-scotland",
                  eyebrow: "Take-home pay",
                  title: "What you actually keep",
                  body: "Scotland's six tax bands, pensions and student loans. Or work backwards from the pay you need.",
                },
                {
                  href: "/council-tax-bands-scotland",
                  eyebrow: "Council tax",
                  title: "What your band really costs",
                  body: "All 32 councils, bands A to H, with the water charges most published figures leave out.",
                },
              ].map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group flex flex-col rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-[var(--shadow-2)]"
                >
                  <p className="label">{t.eyebrow}</p>
                  <p className="mt-3 text-[21px] font-[770] leading-[1.2] transition-colors group-hover:text-[var(--brand)]">
                    {t.title}
                  </p>
                  <p className="mt-2.5 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">{t.body}</p>
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

        <section className="border-t border-[var(--rule)] py-12 sm:py-14" aria-labelledby="questions">
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

          <p className="ui mt-10 text-[15px] text-[var(--muted)]">
            {site.name} — a personal public-interest project by {site.author.name} at {" "}
            {site.organisation.name}. No party affiliation, no funding, no paywall.
          </p>
        </section>
      </Page>
    </>
  );
}
