import Link from "next/link";
import { CTA, ContentFrame, InShort, Page, PageHeader } from "@/components/Blocks";
import { councilsByLevel } from "@/lib/data/councils";
import { councilAccountabilityRecords } from "@/lib/data/councilAccountability";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "Scottish council budgets and performance | Scotland Counted",
  description:
    "See what Scottish councils are funded to do, what they promised, and what official audits and performance figures show.",
  path: "/councils",
});

export default function CouncilsPage() {
  const areas = councilsByLevel();
  const publishedSlugs = new Set(councilAccountabilityRecords.map((record) => record.councilSlug));

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
            "An evidence-led directory of council budgets, targets, promises and official scrutiny in Scotland.",
          url: `${site.url}/councils`,
          numberOfItems: publishedSlugs.size,
          isPartOf: { "@id": `${site.url}/#website` },
        }}
      />

      <Page>
        <PageHeader
          eyebrow="The people who run local services"
          title="What is your council doing with the money?"
          lede="Council tax and government grants pay for services near you. This section follows the money, the targets councils set and the results that have actually been published."
        />

        <ContentFrame>
          <InShort expert={false}>
            <p>
              <strong>This is not a league table made from guesses.</strong> A council only gets a
              performance claim here when the target, result and source can be checked together.
            </p>
            <p>
              Glasgow is the first detailed accountability record. The other council areas already have their local
              poverty figures, while their budget and performance records are being built from the
              same official sources.
            </p>
          </InShort>

          <section className="pt-12">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Money", "Budgets, funding gaps and reserves"],
                ["Results", "Targets, actual performance and missed deadlines"],
                ["Scrutiny", "Audit findings, regulator warnings and responses"],
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
                  {publishedSlugs.size} of {areas.length} detailed accountability records published
                </p>
                <Link href="/areas" className="ui text-[16px] font-[700]">
                  See all local poverty figures →
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((council) => {
                const hasRecord = publishedSlugs.has(council.slug);
                return (
                  <article
                    key={council.slug}
                    className={`rounded-[var(--r-s)] border bg-[var(--surface)] p-5 ${
                      hasRecord
                        ? "border-[var(--action)] border-t-[3px]"
                        : "border-[var(--rule)]"
                    }`}
                  >
                    <p className="ui text-[15px] font-[750] text-[var(--muted)]">
                      {hasRecord ? "Accountability record" : "Local facts available"}
                    </p>
                    <h3 className="ui mt-2 text-[18px] font-[750] leading-[1.3] text-[var(--ink)]">
                      {council.name}
                    </h3>
                    <p className="mt-2 text-[15px] leading-[1.5] text-[var(--ink-2)]">
                      {hasRecord
                        ? "Budgets, service targets, promises and audit findings."
                        : "Council accountability record coming soon. Local poverty facts are ready now."}
                    </p>
                    <Link
                      href={hasRecord ? `/councils/${council.slug}` : `/areas/${council.slug}`}
                      className="ui mt-4 inline-block text-[15px] font-[700] text-[var(--brand)]"
                    >
                      {hasRecord ? "Open the council record →" : "See the area figures →"}
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>

          <CTA
            title="Start with the facts for your street"
            body="Enter your postcode and I will find your council area, MP and MSPs without making you work out the boundaries first."
            href="/find-my-mp-and-msp"
            cta="Find my area and representatives"
            secondaryHref="/areas"
            secondaryCta="Browse all 32 areas"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
