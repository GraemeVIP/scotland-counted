import Link from "next/link";
import { CTA, ContentFrame, InShort, Page, PageHeader } from "@/components/Blocks";
import { councilsByLevel } from "@/lib/data/councils";
import { councilAccountabilityRecords } from "@/lib/data/councilAccountability";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";
import AccountabilityMethodNote from "@/components/AccountabilityMethodNote";
import { COUNCIL_TAX, NATIONAL } from "@/lib/data/councilBudgetMechanics";
import CouncilWatch from "@/components/CouncilWatch";
import CouncilDirectory from "./CouncilDirectory";

export const metadata = meta({
  title: "Scottish council budgets and performance | Scotland Counted",
  description:
    "See what Scottish councils are funded to do, what they promised, and what official audits and performance figures show.",
  path: "/councils",
});

export default function CouncilsPage() {
  const areas = [...councilsByLevel()].sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  const publishedSlugs = new Set(councilAccountabilityRecords.map((record) => record.councilSlug));
  const missedTargets = councilAccountabilityRecords.reduce(
    (n, record) => n + record.outcomes.filter((o) => o.status === "missed").length,
    0
  );
  const openFindings = councilAccountabilityRecords.reduce(
    (n, record) =>
      n + record.auditFindings.filter((f) => f.status === "open" || f.status === "in-progress").length,
    0
  );

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Council budgets and performance", path: "/councils" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Scottish council budgets and performance",
          description:
            "An evidence-led directory of council budgets, targets, promises and official checks in Scotland.",
          url: `${site.url}/councils`,
          numberOfItems: publishedSlugs.size,
          isPartOf: { "@id": `${site.url}/#website` },
        }}
      />

      <Page>
        <PageHeader
          eyebrow="Your money. Their choices."
          title="What is your council doing with the money?"
          lede="You pay for your council. This section shows what they promised and what really happened. The watchdogs checked. Every fact links to the paper it came from."
        />

        <ContentFrame>
          <InShort expert={false}>
            <p>
              <strong>Nothing here is a guess.</strong> Every number comes from an official
              paper. Each one is linked, so you can check it yourself.
            </p>
            <p>
              Where something cannot be checked, the page says so. A gap is better than a made-up
              number.
            </p>
          </InShort>

          <AccountabilityMethodNote />

          {/*
            The receipts, before any prose. Counted from the records themselves
            so the figures can never drift from the pages they summarise, and
            a card only renders when there is something to count.
          */}
          <section className="pt-12" aria-label="What the records show so far">
            <p className="kicker mb-4 text-[var(--action)]">Counted so far, across every published record</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [missedTargets, missedTargets === 1 ? "goal they set themselves, missed" : "goals they set themselves, missed"],
                [openFindings, openFindings === 1 ? "watchdog warning still open" : "watchdog warnings still open"],
                [publishedSlugs.size, publishedSlugs.size === 1 ? "council checked in full so far" : "councils checked in full so far"],
              ].map(([n, label]) =>
                Number(n) > 0 ? (
                  <div
                    key={String(label)}
                    className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] bg-[var(--surface)] p-6"
                  >
                    <p className="figure-num text-[clamp(40px,5vw,56px)] leading-none text-[var(--ink)]">{n}</p>
                    <p className="mt-2 text-[16px] leading-[1.5] text-[var(--ink-2)]">{label}</p>
                  </div>
                ) : null
              )}
            </div>
          </section>

          {/*
            The pattern people already half-notice, said out loud and sourced.
            The full working, what a gap is, who paid, and how the grant is
            actually decided, sits on every individual council page.
          */}
          <section className="pt-12" aria-label="Why councils say they need more money">
            <div className="rounded-[var(--r-m)] border border-[var(--action)] bg-[var(--action-tint)] p-6 sm:p-7">
              <p className="kicker mb-3 text-[var(--action)]">The bit nobody explains</p>
              <p className="text-[26px] font-[800] leading-[1.2] text-[var(--ink)] sm:text-[32px]">
                {NATIONAL.councilsWithGap} of Scotland&rsquo;s {NATIONAL.councilsTotal} councils
                said they needed more money this year.
              </p>
              <p className="mt-4 max-w-[64ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
                Only {NATIONAL.surplusCouncil} said it had money left over. Their money from the
                Scottish Government went {NATIONAL.revenueChange} that year, not down, even after
                prices rose. And the amount they say they are short has stayed about the same for{" "}
                {NATIONAL.gapYears} years running. It works out at {NATIONAL.gapSharePence}.
              </p>
              <p className="mt-3 max-w-[64ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
                The law says a council cannot plan to spend more than it gets, so the gap always
                gets closed. The biggest single way they closed it was{" "}
                <strong className="text-[var(--ink)]">your council tax</strong>, up{" "}
                {COUNCIL_TAX.averageIncrease} on average, for the second year in a row.
              </p>
              <p className="mt-4 text-[16px] font-[700] leading-[1.5] text-[var(--ink)]">
                Open any council below to see how it works, and what yours did.
              </p>
            </div>
          </section>

          <section className="pt-12">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["The money", "What they got. What they spent. The gaps they have not closed."],
                ["The results", "The goals they set for themselves. Met or missed, in their own figures."],
                ["The watchdogs", "What the auditors found when they looked."],
              ].map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--brand)] bg-[var(--surface)] p-6"
                >
                  <h2 className="h3 mb-2">{title}</h2>
                  <p className="text-[16px] leading-[1.55] text-[var(--ink-2)]">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-14" id="all-councils">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="kicker mb-2 text-[var(--brand)]">All 32 council areas</p>
                <h2 className="h2">Pick your council</h2>
              </div>
              <div className="text-right">
                <p className="ui text-[15px] text-[var(--muted)]">
                  {publishedSlugs.size} of {areas.length} detailed council records published
                </p>
                <Link href="/areas" className="ui text-[16px] font-[700]">
                  See all local poverty figures →
                </Link>
              </div>
            </div>

            <CouncilDirectory councils={areas} publishedSlugs={[...publishedSlugs]} />
          </section>

          <CTA
            title="Seen something that makes you angry?"
            body="Do not shout at the telly. Your MSP decides how councils are funded, and your councillors answer to you. Put in your postcode and I will write the email for you."
            href="/find-my-mp-and-msp"
            cta="Write to the people in charge"
            secondaryHref="/areas"
            secondaryCta="See the poverty figures first"
          />

          <CouncilWatch />
        </ContentFrame>
      </Page>
    </>
  );
}
