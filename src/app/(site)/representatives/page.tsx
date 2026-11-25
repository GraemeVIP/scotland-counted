import Link from "@/components/IntentLink";
import { CTA, ContentFrame, HeaderFacts, InShort, Page, PageHeader } from "@/components/Blocks";
import PortraitLightbox from "@/components/PortraitLightbox";
import { JsonLd, meta } from "@/lib/seo";
import {
  formatMpCheckedDate,
  MP_DATA_CHECKED_ISO,
  MP_DATA_SOURCE_NAME,
  mps,
} from "@/lib/data/mps";
import { holyroodConstituencies, holyroodRegions } from "@/lib/data/holyrood";
import { representativeSlug } from "@/lib/representatives";
import { site } from "@/lib/site";
import RepresentativeLookup from "./RepresentativeLookup";
import RepresentativeDirectorySearch, { type DirectoryEntry } from "./RepresentativeDirectorySearch";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = meta({
  title: "Scottish MPs and MSPs: Find & Contact Yours",
  description:
    "Every Scottish MP and MSP in one directory, with parties, constituencies and official contact details. Search by name or enter a postcode to find yours.",
  path: "/representatives",
});

export default function RepresentativesPage() {
  const checked = formatMpCheckedDate();
  const directoryEntries: DirectoryEntry[] = [
    ...mps.map((mp) => ({
      name: mp.name,
      role: "MP" as const,
      party: mp.party,
      area: mp.constituency,
      label: `MP for ${mp.constituency}`,
      href: `/representatives/mps/${mp.constituencySlug}`,
      photoUrl: mp.photoUrl,
    })),
    ...holyroodConstituencies.map((record) => ({
      name: record.msp.name,
      role: "MSP" as const,
      party: record.msp.party,
      area: record.constituency,
      label: `MSP for ${record.constituency}`,
      href: `/representatives/msps/constituencies/${record.constituencySlug}`,
      photoUrl: record.msp.photoUrl,
    })),
    ...holyroodRegions.flatMap((record) => record.msps.map((msp) => ({
      name: msp.name,
      role: "MSP" as const,
      party: msp.party,
      area: record.region,
      label: `Regional MSP for ${record.region}`,
      href: `/representatives/msps/regions/${record.regionSlug}/${representativeSlug(msp.name)}`,
      photoUrl: msp.photoUrl,
    }))),
  ];
  const mspCount = directoryEntries.filter((entry) => entry.role === "MSP").length;

  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Scottish MPs and MSPs", path: "/representatives" },
        ]} />
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
          lede="You have one MP at Westminster and eight MSPs at Holyrood. Enter your postcode to see their names and contact details. Nothing opens or sends unless you choose it."
          panel={
            <HeaderFacts
              items={[
                { value: "1", label: "MP for you at Westminster in London." },
                { value: "8", label: "MSPs for you at Holyrood in Edinburgh." },
                { value: String(mps.length), label: "Scottish MPs in all." },
                { value: String(mspCount), label: "MSPs in all." },
              ]}
            />
          }
        />

        <ContentFrame>
          <RepresentativeLookup />
          <div className="my-6 flex flex-wrap gap-4 text-[16px] font-semibold">
            <Link href="/representatives/msps">Browse all 129 MSPs →</Link>
            <Link href="/mp-expenses-scotland">
              See MP donations, foreign trips & gifts (£297k declared) →
            </Link>
            <Link href="/who-decides">See who decides what →</Link>
          </div>
          <RepresentativeDirectorySearch entries={directoryEntries} />

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
              <span className="figure-num block text-[34px] text-[var(--action-text)]">8 MSPs</span>
              <span className="h3 mt-3 block group-hover:text-[var(--brand)]">Your voices at Holyrood</span>
              <span className="mt-2 block text-[16px] leading-[1.55] text-[var(--ink-2)]">
                See one constituency MSP and seven regional MSPs. All eight represent you.
              </span>
            </Link>
          </section>

          <section id="every-scottish-mp" className="pt-12">
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
                <article
                  key={mp.constituencySlug}
                  className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-5 py-5 transition-colors hover:border-[var(--rule-strong)]"
                >
                  <div className="flex items-start gap-3">
                    <PortraitLightbox
                      src={mp.photoUrl}
                      alt={`${mp.name}, MP for ${mp.constituency}`}
                      sizes="56px"
                      className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[var(--r-s)] bg-[var(--surface-2)]"
                    />
                    <span className="min-w-0">
                      <Link
                        href={`/representatives/mps/${mp.constituencySlug}`}
                        className="ui block text-[17px] font-[600] leading-[1.3] text-[var(--ink)] no-underline hover:text-[var(--brand)]"
                      >
                        {mp.name}
                      </Link>
                      <span className="ui block text-[15px] leading-[1.45] text-[var(--ink-2)] mt-1.5">
                        {mp.party}
                      </span>
                      <span className="ui block text-[15px] leading-[1.45] text-[var(--muted)] mt-2">
                        MP for {mp.constituency}
                      </span>
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <p className="ui mt-6 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Names and public contact details come from the {MP_DATA_SOURCE_NAME}. Each MP page
              links to the matching official UK Parliament record.
            </p>
          </section>

          <CTA
            title="Ready to ask them to act?"
            body="The email tool finds the same representatives, adds your local facts and prepares focused drafts. You stay in control and nothing is sent automatically."
            href="/email-your-mp-and-msp"
            cta="Write the emails for me"
            secondaryHref="/representatives/msps"
            secondaryCta="Browse every Scottish MSP"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
