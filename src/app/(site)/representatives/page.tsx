import Link from "next/link";
import { CTA, ContentFrame, InShort, Page, PageHeader } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import {
  formatMpCheckedDate,
  MP_DATA_CHECKED_ISO,
  MP_DATA_SOURCE_NAME,
  mps,
} from "@/lib/data/mps";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "Scottish MPs and MSPs: Names and Contact Details",
  description:
    "Find your MP and all eight MSPs in Scotland. See current names, areas, parties, public contact details and ready-written email links.",
  path: "/representatives",
});

export default function RepresentativesPage() {
  const checked = formatMpCheckedDate();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Scottish MPs and MSPs", path: "/representatives" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Current Scottish MPs and MSPs",
          description:
            "Find current Scottish MPs and MSPs, with public contact details from the UK Parliament and Scottish Parliament.",
          url: `${site.url}/representatives`,
          dateModified: MP_DATA_CHECKED_ISO,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: mps.length,
            itemListElement: mps.map((mp, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `${mp.name}, MP for ${mp.constituency}`,
              url: `${site.url}/representatives/mps/${mp.constituencySlug}`,
            })),
          },
          hasPart: {
            "@type": "CollectionPage",
            name: "Current Scottish MSPs",
            url: `${site.url}/representatives/msps`,
          },
        }}
      />

      <Page>
        <PageHeader
          eyebrow="Everyone who represents you"
          title="Find your MP and MSPs"
          lede="You have one MP at Westminster and eight MSPs at Holyrood. Use your postcode and I find them automatically, or browse every current name and public contact below."
        >
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/find-my-mp-and-msp" className="btn btn-primary">
              Use my postcode
            </Link>
            <Link href="/representatives/msps" className="btn btn-ghost">
              Browse all 129 MSPs
            </Link>
          </div>
        </PageHeader>

        <ContentFrame>
          <InShort expert={false}>
            <p>
              <strong>Most people do not know their political boundaries.</strong> That is normal.
              Enter your postcode and the site finds the correct people for you. You do not have
              to choose between them.
            </p>
            <p>
              Your MP works at Westminster in London. Your constituency MSP and seven regional
              MSPs work in the Scottish Parliament in Edinburgh. They deal with different things.
            </p>
          </InShort>

          <section className="pt-10 grid gap-4 md:grid-cols-2">
            <Link
              href="#every-scottish-mp"
              className="group rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--brand)] bg-[var(--surface)] p-6 no-underline transition-colors hover:border-[var(--rule-strong)] sm:p-7"
            >
              <span className="figure-num block text-[34px] text-[var(--brand)]">1 MP</span>
              <span className="h3 mt-3 block group-hover:text-[var(--brand)]">Your voice at Westminster</span>
              <span className="mt-2 block text-[16px] leading-[1.55] text-[var(--ink-2)]">
                Browse all 57 Scottish seats, current MPs and public contact details.
              </span>
            </Link>
            <Link
              href="/representatives/msps"
              className="group rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] bg-[var(--surface)] p-6 no-underline transition-colors hover:border-[var(--rule-strong)] sm:p-7"
            >
              <span className="figure-num block text-[34px] text-[var(--action)]">8 MSPs</span>
              <span className="h3 mt-3 block group-hover:text-[var(--brand)]">Your voices at Holyrood</span>
              <span className="mt-2 block text-[16px] leading-[1.55] text-[var(--ink-2)]">
                See one constituency MSP and seven regional MSPs. All eight represent you.
              </span>
            </Link>
          </section>

          <section id="every-scottish-mp" className="pt-12 scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="kicker mb-2 text-[var(--brand)]">Current representatives</p>
                <h2 className="h2">Every Scottish MP, A to Z</h2>
              </div>
              <p className="ui text-[15px] leading-[1.45] text-[var(--ink-2)]">
                Checked <time dateTime={MP_DATA_CHECKED_ISO}>{checked}</time>
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mps.map((mp) => (
                <Link
                  key={mp.constituencySlug}
                  href={`/representatives/mps/${mp.constituencySlug}`}
                  className="group block rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-5 py-5 no-underline transition-colors hover:border-[var(--rule-strong)]"
                >
                  <span className="ui block text-[17px] font-[750] leading-[1.3] text-[var(--ink)] group-hover:text-[var(--brand)]">
                    {mp.name}
                  </span>
                  <span className="ui block text-[15px] leading-[1.45] text-[var(--ink-2)] mt-1.5">
                    {mp.party}
                  </span>
                  <span className="ui block text-[15px] leading-[1.45] text-[var(--muted)] mt-3">
                    MP for {mp.constituency}
                  </span>
                </Link>
              ))}
            </div>

            <p className="ui mt-6 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Names and public contact details come from the {MP_DATA_SOURCE_NAME}. Each MP page
              links to the matching official UK Parliament record.
            </p>
          </section>

          <CTA
            title="Not sure which area or person is yours?"
            body="Enter your postcode. I find your MP and all eight MSPs, then prepare focused emails to your MP and constituency MSP automatically."
            href="/find-my-mp-and-msp"
            cta="Find my MP and MSP"
            secondaryHref="/representatives/msps"
            secondaryCta="Browse every Scottish MSP"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
