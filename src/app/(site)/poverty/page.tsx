import Link from "next/link";
import { Page, ContentFrame, PageHeader, InShort, CTA, Card } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { scotlandPoverty } from "@/lib/data/scotland";
import { getSources } from "@/lib/data/sources";
import VideoEmbed from "@/components/VideoEmbed";
import ShareGraphic from "@/components/ShareGraphic";
import { explainerVideo } from "@/lib/data/video";

/**
 * The poverty hub.
 *
 * Poverty was the whole site, and the homepage was built around it. As the
 * product grew to cover pay, council tax, council performance and political
 * responsibility, a homepage that opened with child poverty stopped describing
 * what the site is.
 *
 * The answer is not to demote the subject. It is to give it a proper front
 * door of its own, so the homepage can describe the whole product while
 * poverty keeps a page that leads with the figures, the Glasgow record, the
 * quiz and the route to doing something about it.
 *
 * Every poverty URL that existed before this page still exists and still
 * works. This hub links to them; it does not replace them.
 */

export const metadata = meta({
  title: "Poverty in Scotland: The Figures, the Causes and Who Can Fix It",
  description:
    "How many people live in poverty in Scotland, how many of them are in work, why Glasgow is worst, and which government controls each lever. Every figure sourced.",
  path: "/poverty",
});

export default function PovertyHub() {
  const p = scotlandPoverty;
  const [source] = getSources([p.sourceId]);

  const HEADLINES = [
    { value: `${p.all.pct}%`, label: `of people in Scotland, ${p.all.count.toLocaleString("en-GB")} in total` },
    { value: `${p.children.pct}%`, label: "of children" },
    { value: `${p.workingAge.pct}%`, label: "of working-age adults" },
    { value: `${p.pensioners.pct}%`, label: "of pensioners" },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Poverty", path: "/poverty" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="Poverty in Scotland"
          title="The figures, the causes and who can fix it"
          lede={`${p.all.pct}% of people in Scotland were living in relative poverty after housing costs in ${p.period}. Three quarters of the children among them live in a household where somebody works.`}
        />

        <ContentFrame>
          <InShort expert={false}>
            <p>
              Poverty here means relative poverty after housing costs: living on less than 60%
              of the middle UK income once the rent or mortgage is paid.
            </p>
            <p>
              The figure that surprises people most is that work is not a way out of it for
              everyone. {p.childrenInWorkingHouseholdsPct}% of children in poverty in Scotland
              live in a working household.
            </p>
          </InShort>

          <section className="pt-12">
            <p className="kicker mb-4 text-[var(--action)]">Scotland, {p.period}</p>
            {/* A plain grid, not StatStrip: that component shows a movement
                between two periods, and these are a single snapshot. */}
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {HEADLINES.map((stat) => (
                <li
                  key={stat.label}
                  className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] bg-[var(--surface)] p-5"
                >
                  <p className="figure-num text-[clamp(30px,4vw,42px)] leading-none text-[var(--ink)]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[15.5px] leading-[1.45] text-[var(--ink-2)]">{stat.label}</p>
                </li>
              ))}
            </ul>
            <p className="ui mt-4 text-[14px] leading-[1.5] text-[var(--muted)]">
              Source:{" "}
              {source ? (
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>
              ) : (
                "Scottish Government"
              )}
              . Relative poverty after housing costs.
            </p>
          </section>

          <section className="pt-14">
            <h2 className="h2 mb-3">Start here</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card
                href="/blog/what-does-poverty-mean"
                eyebrow="Explainer"
                title="What poverty actually means"
                body="Relative, absolute and persistent poverty are three different things, and the difference changes the number by hundreds of thousands of people."
                meta="5 min read"
              />
              <Card
                href="/blog/do-people-in-poverty-work"
                eyebrow="Explainer"
                title="Most children in poverty have a working parent"
                body="The single most common assumption about poverty in Scotland, tested against the official figures."
                meta="4 min read"
              />
              <Card
                href="/poverty-in-scotland-quiz"
                eyebrow="Six questions"
                title="Guess the figure"
                body="Most people get these wrong, and the direction they get them wrong in is the interesting part."
                meta="Two minutes"
              />
              <Card
                href="/areas"
                eyebrow="Local"
                title="Poverty where you live"
                body="Child poverty, out-of-work benefits and pay for all 32 council areas, each with its own permanent page."
                meta="32 areas"
              />
            </div>
          </section>

          {/* Moved off the homepage rather than dropped. The explainer and the
              share graphic are poverty material and belong with the subject. */}
          <section className="pt-14">
            <h2 className="h2 mb-3">Four minutes, if you would rather watch it</h2>
            <p className="mb-6 max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              The whole picture, explained once, with the figures on screen.
            </p>
            <VideoEmbed
              id={explainerVideo.youtubeId}
              title={explainerVideo.name}
              poster={explainerVideo.thumbnail}
            />
          </section>

          <ShareGraphic className="mx-auto max-w-[1120px] pt-14" />

          <section className="pt-14">
            <h2 className="h2 mb-3">The Glasgow record</h2>
            <p className="max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              Glasgow has the highest child poverty rate of any Scottish council area, and the
              gap has widened rather than closed. It is the site&rsquo;s detailed case study
              because the data goes back furthest there.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/why-poverty-is-worse-in-glasgow"
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--brand)]"
              >
                <span className="label">The explanation</span>
                <strong className="mt-3 block text-[20px]">Why Glasgow is worst</strong>
                <span className="mt-2 block text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  What is different about the city, and which of it is fixable.
                </span>
              </Link>
              <Link
                href="/glasgow-poverty-statistics"
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--brand)]"
              >
                <span className="label">The evidence</span>
                <strong className="mt-3 block text-[20px]">Every Glasgow indicator</strong>
                <span className="mt-2 block text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  Poverty, pay, employment, life expectancy, in one place with sources.
                </span>
              </Link>
            </div>
          </section>

          <section className="pt-14">
            <h2 className="h2 mb-3">What would change it, and who can do it</h2>
            <p className="max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              The levers are real and they are split between three levels of government. Both
              pages below name which government holds which one.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/solutions-to-poverty-in-scotland"
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--brand)]"
              >
                <span className="label">Options</span>
                <strong className="mt-3 block text-[20px]">What would actually help</strong>
                <span className="mt-2 block text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  Costed options, and who has the power to choose them.
                </span>
              </Link>
              <Link
                href="/who-is-responsible-for-poverty-in-scotland"
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--brand)]"
              >
                <span className="label">Responsibility</span>
                <strong className="mt-3 block text-[20px]">Who is responsible</strong>
                <span className="mt-2 block text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  Which powers sit in London, which in Edinburgh, and which locally.
                </span>
              </Link>
            </div>
          </section>

          <CTA
            title="One email is worth more than one share"
            body="The people who set benefit levels, tax bands and council budgets are required to answer their constituents. Find yours and write to them."
            href="/find-my-mp-and-msp"
            cta="Find my MP and MSPs"
            secondaryHref="/who-decides"
            secondaryCta="Check who controls what first"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
