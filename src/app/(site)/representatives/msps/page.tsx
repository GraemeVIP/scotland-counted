import Link from "next/link";
import { CTA, ContentFrame, InShort, Page, PageHeader } from "@/components/Blocks";
import PortraitLightbox from "@/components/PortraitLightbox";
import {
  formatHolyroodCheckedDate,
  HOLYROOD_DATA_CHECKED_AT,
  HOLYROOD_DATA_SOURCE_NAME,
  holyroodConstituencies,
  holyroodRegions,
} from "@/lib/data/holyrood";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";
import { representativeSlug } from "@/lib/representatives";
import { HolyroodSourceNote } from "./_shared";

export const metadata = meta({
  title: "Scottish MSPs: Names, Areas and Contact Details",
  description:
    "Find all 129 current MSPs in Scotland. See your constituency MSP, seven regional MSPs, public email addresses and official Parliament profiles.",
  path: "/representatives/msps",
});

export default function MspsDirectoryPage() {
  const checked = formatHolyroodCheckedDate();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Representatives", path: "/representatives" },
          { name: "Scottish MSPs", path: "/representatives/msps" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Current Scottish MSPs by constituency and region",
          description:
            "Current constituency and regional Members of the Scottish Parliament, with public contact details from Scottish Parliament Open Data.",
          url: `${site.url}/representatives/msps`,
          dateModified: HOLYROOD_DATA_CHECKED_AT,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: holyroodConstituencies.length + holyroodRegions.reduce((total, item) => total + item.msps.length, 0),
            itemListElement: [
              ...holyroodConstituencies.map((item) => ({
                name: `${item.msp.name}, MSP for ${item.constituency}`,
                url: `${site.url}/representatives/msps/constituencies/${item.constituencySlug}`,
              })),
              ...holyroodRegions.flatMap((item) => item.msps.map((msp) => ({
                name: `${msp.name}, regional MSP for ${item.region}`,
                url: `${site.url}/representatives/msps/regions/${item.regionSlug}/${representativeSlug(msp.name)}`,
              }))),
            ].map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item })),
          },
        }}
      />

      <Page>
        <PageHeader
          eyebrow="All 129 Members of the Scottish Parliament"
          title="Find your MSPs and contact them"
          lede="Everyone in Scotland has eight MSPs: one for their constituency and seven for their larger region. You do not need to know either area. The postcode tool finds all eight for you."
        >
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/find-my-mp-and-msp" className="btn btn-primary">
              Use my postcode
            </Link>
            <Link href="#holyrood-regions" className="btn btn-ghost">
              Browse the 8 regions
            </Link>
          </div>
        </PageHeader>

        <ContentFrame>
          <InShort expert={false}>
            <p>
              <strong>You do not have to choose the “right” MSP.</strong> All eight represent you.
              The postcode email tool uses your constituency MSP automatically because that is the
              closest local match, then shows the other seven.
            </p>
            <p>
              MSPs deal with Scottish matters such as the NHS, schools, housing law, justice,
              Scottish benefits and Scottish income tax.
            </p>
          </InShort>

          <section id="holyrood-regions" className="pt-12 scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="kicker mb-2 text-[var(--brand)]">Seven MSPs in each</p>
                <h2 className="h2">The 8 Scottish Parliament regions</h2>
              </div>
              <p className="ui text-[15px] leading-[1.45] text-[var(--ink-2)]">
                Checked <time dateTime={HOLYROOD_DATA_CHECKED_AT}>{checked}</time>
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {holyroodRegions.map((item) => (
                <Link
                  key={item.regionSlug}
                  href={`/representatives/msps/regions/${item.regionSlug}`}
                  className="group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-5 py-5 no-underline hover:border-[var(--rule-strong)]"
                >
                  <span className="ui block text-[17px] font-[750] leading-[1.35] text-[var(--ink)] group-hover:text-[var(--brand)]">
                    {item.region}
                  </span>
                  <span className="ui mt-2 block text-[15px] text-[var(--ink-2)]">See all 7 regional MSPs</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="pt-12">
            <details className="group rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]">
              <summary className="ui cursor-pointer list-none px-6 py-6 text-[18px] font-[750] marker:content-none sm:px-8 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  Browse all 73 constituencies
                  <span aria-hidden="true" className="text-[var(--brand)] group-open:rotate-45">＋</span>
                </span>
              </summary>
              <div className="border-t border-[var(--rule)] p-5 sm:p-8">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {holyroodConstituencies.map((item) => (
                    <article
                      key={item.constituencySlug}
                      className="group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] px-5 py-4 hover:border-[var(--rule-strong)]"
                    >
                      <span className="flex items-start gap-3">
                        <PortraitLightbox
                          src={item.msp.photoUrl}
                          alt={`${item.msp.name}, MSP for ${item.constituency}`}
                          sizes="48px"
                          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[var(--r-s)] bg-[var(--surface)]"
                        />
                        <span className="min-w-0">
                          <Link
                            href={`/representatives/msps/constituencies/${item.constituencySlug}`}
                            className="ui block text-[16px] font-[750] leading-[1.35] text-[var(--ink)] no-underline hover:text-[var(--brand)]"
                          >
                            {item.constituency}
                          </Link>
                          <span className="ui mt-1.5 block text-[15px] leading-[1.45] text-[var(--ink-2)]">
                            {item.msp.name} · {item.msp.party}
                          </span>
                        </span>
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            </details>
          </section>

          <section className="pt-12 max-w-[760px]">
            <h2 className="h2 mb-4">Where the names come from</h2>
            <HolyroodSourceNote />
            <p className="ui mt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Names, parties and contacts: {HOLYROOD_DATA_SOURCE_NAME}. Portraits: <a href="https://www.parliament.scot/about/copyright">Scottish Parliament copyright licence</a>. Last checked {checked}.
            </p>
          </section>

          <CTA
            title="Let the site find the right people"
            body="Enter your postcode. I find your MP, constituency MSP and seven regional MSPs. The ready-written emails go to the closest match automatically."
            href="/find-my-mp-and-msp"
            cta="Find everyone who represents me"
            secondaryHref="/representatives"
            secondaryCta="See every Scottish MP"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
