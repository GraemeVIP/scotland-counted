import Link from "next/link";
import { notFound } from "next/navigation";
import Faq from "@/components/Faq";
import { CTA, ContentFrame, InShort, Page, PageHeader } from "@/components/Blocks";
import {
  formatHolyroodCheckedDate,
  getHolyroodRegionBySlug,
  HOLYROOD_DATA_CHECKED_AT,
  HOLYROOD_DATA_SOURCE,
  HOLYROOD_DATA_SOURCE_NAME,
  holyroodConstituencies,
  holyroodRegions,
} from "@/lib/data/holyrood";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";
import { HolyroodSourceNote, MspContactCard, holyroodPersonJsonLd } from "../../_shared";

export function generateStaticParams() {
  return holyroodRegions.map((item) => ({ slug: item.regionSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = getHolyroodRegionBySlug(slug);
  if (!record) return {};

  return meta({
    title: `MSPs for ${record.region}: Names and Contact Details`,
    description: `See all seven regional MSPs for ${record.region}. Find each MSP's party, public email address and official Scottish Parliament profile.`,
    path: `/representatives/msps/regions/${record.regionSlug}`,
  });
}

export default async function HolyroodRegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = getHolyroodRegionBySlug(slug);
  if (!record) notFound();

  const checked = formatHolyroodCheckedDate();
  const pagePath = `/representatives/msps/regions/${record.regionSlug}`;
  const pageUrl = `${site.url}${pagePath}`;
  const constituencies = holyroodConstituencies.filter(
    (item) => item.regionSlug === record.regionSlug,
  );
  const faq = [
    {
      q: `Who are the regional MSPs for ${record.region}?`,
      a: `${record.msps.map((msp) => msp.name).join(", ")} are the seven regional MSPs for ${record.region}. The official Scottish Parliament data was last checked on ${checked}.`,
    },
    {
      q: `Can I contact any ${record.region} regional MSP?`,
      a: `Yes. All seven regional MSPs represent everyone in ${record.region}. You can contact any of them, whatever party you support. There is no wrong choice.`,
    },
    {
      q: `Do I also have a constituency MSP in ${record.region}?`,
      a: "Yes. Everyone in Scotland has one constituency MSP as well as seven regional MSPs. Enter your postcode and Scotland Counted finds the constituency MSP automatically.",
    },
    {
      q: "What can a regional MSP help with?",
      a: "A regional MSP has the same parliamentary role as a constituency MSP. They can take up problems with Scottish public bodies and work on Scottish matters such as the NHS, schools, housing law, justice, transport and Scottish benefits.",
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Scottish MSPs", path: "/representatives/msps" },
          { name: record.region, path: pagePath },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${pageUrl}#webpage`,
              url: pageUrl,
              name: `Regional MSPs for ${record.region}`,
              description: `The seven regional MSPs for ${record.region}, with public contact details from the Scottish Parliament.`,
              inLanguage: "en-GB",
              dateModified: HOLYROOD_DATA_CHECKED_AT,
              mainEntity: record.msps.map((_, index) => ({ "@id": `${pageUrl}#msp-${index + 1}` })),
              isPartOf: { "@id": `${site.url}/#website` },
            },
            ...record.msps.map((msp, index) =>
              holyroodPersonJsonLd({
                msp,
                area: record.region,
                pagePath,
                regional: true,
                idSuffix: `msp-${index + 1}`,
              }),
            ),
          ],
        }}
      />

      <Page>
        <PageHeader
          eyebrow="Your regional representatives at Holyrood"
          title={`Who are the MSPs for ${record.region}?`}
          lede={`Seven regional MSPs represent everyone in ${record.region}. You can contact any of them, whatever party you support. There is no wrong choice.`}
          stat={{ value: "7", label: "regional MSPs represent every person in this region" }}
        />

        <ContentFrame>
          <InShort expert={false}>
            <p>
              <strong>Every person in {record.region} can contact all seven people below.</strong> A
              regional MSP has the same parliamentary powers as a constituency MSP.
            </p>
            <p>
              You also have one constituency MSP for your smaller local area. Use the postcode tool
              if you do not know the name of that area or person.
            </p>
          </InShort>

          <section className="pt-12">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="kicker mb-2 text-[var(--brand)]">All seven current members</p>
                <h2 className="h2">Regional MSPs for {record.region}</h2>
              </div>
              <p className="ui text-[15px] leading-[1.45] text-[var(--ink-2)]">
                Checked <time dateTime={HOLYROOD_DATA_CHECKED_AT}>{checked}</time>
              </p>
            </div>

            <div className="grid items-start gap-5 lg:grid-cols-2">
              {record.msps.map((msp) => (
                <MspContactCard
                  key={msp.email}
                  msp={msp}
                  area={record.region}
                  regional
                  headingLevel={3}
                />
              ))}
            </div>
          </section>

          <section className="pt-12">
            <details className="group rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]">
              <summary className="ui cursor-pointer list-none px-6 py-6 text-[18px] font-[750] marker:content-none sm:px-8 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  See the {constituencies.length} constituencies in {record.region}
                  <span aria-hidden="true" className="text-[var(--brand)] group-open:rotate-45">＋</span>
                </span>
              </summary>
              <div className="border-t border-[var(--rule)] p-5 sm:p-8">
                <p className="mb-5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                  Each constituency elects one local MSP. Everyone in these constituencies also has
                  the seven regional MSPs listed above.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {constituencies.map((item) => (
                    <Link
                      key={item.constituencySlug}
                      href={`/representatives/msps/constituencies/${item.constituencySlug}`}
                      className="group block rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] px-5 py-4 no-underline hover:border-[var(--rule-strong)]"
                    >
                      <span className="ui block text-[16px] font-[750] leading-[1.35] text-[var(--ink)] group-hover:text-[var(--brand)]">
                        {item.constituency}
                      </span>
                      <span className="ui mt-1.5 block text-[15px] text-[var(--ink-2)]">
                        {item.msp.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </details>
          </section>

          <section className="pt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-6">
              <h2 className="h3 mb-3">What can a regional MSP deal with?</h2>
              <p className="text-[16px] leading-[1.65] text-[var(--ink-2)]">
                Regional and constituency MSPs do the same job at Holyrood. They deal with the
                Scottish NHS, schools, housing law, justice, transport, Scottish benefits and
                Scottish income tax.
              </p>
            </div>
            <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-6">
              <h2 className="h3 mb-3">Which of the seven should I contact?</h2>
              <p className="text-[16px] leading-[1.65] text-[var(--ink-2)]">
                Any of them. All seven represent the whole region. You can contact more than one,
                but one clear email is often the easiest place to start. Their party does not stop
                them from representing you.
              </p>
            </div>
          </section>

          <section className="pt-12 max-w-[760px]">
            <h2 className="h2 mb-4">Where this information comes from</h2>
            <HolyroodSourceNote />
            <p className="ui mt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Source: <a href={HOLYROOD_DATA_SOURCE}>{HOLYROOD_DATA_SOURCE_NAME}</a>. Last checked {" "}
              <time dateTime={HOLYROOD_DATA_CHECKED_AT}>{checked}</time>.
            </p>
          </section>

          <Faq items={faq} className="pt-12" />

          <CTA
            title="Find your constituency MSP as well"
            body="Enter your postcode. I find all eight MSPs and your Westminster MP, then choose the closest local match for the ready-written email."
            href="/find-my-mp-and-msp"
            cta="Use my postcode"
            secondaryHref="/representatives/msps"
            secondaryCta="Browse every Scottish MSP area"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
