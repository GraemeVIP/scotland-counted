import Link from "next/link";
import { notFound } from "next/navigation";
import Faq from "@/components/Faq";
import { CTA, ContentFrame, InShort, Page, PageHeader } from "@/components/Blocks";
import {
  formatHolyroodCheckedDate,
  formatHolyroodTermDate,
  getHolyroodRegionBySlug,
  getHolyroodRegionalMsp,
  HOLYROOD_DATA_CHECKED_AT,
  HOLYROOD_DATA_SOURCE,
  HOLYROOD_DATA_SOURCE_NAME,
  holyroodRegions,
} from "@/lib/data/holyrood";
import { representativeSlug } from "@/lib/representatives";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";
import {
  HolyroodSourceNote,
  MspProfileCard,
  MspVotingRecord,
} from "../../../_shared";

export function generateStaticParams() {
  return holyroodRegions.flatMap((region) =>
    region.msps.map((msp) => ({
      slug: region.regionSlug,
      person: representativeSlug(msp.name),
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; person: string }>;
}) {
  const { slug, person } = await params;
  const region = getHolyroodRegionBySlug(slug);
  const msp = getHolyroodRegionalMsp(slug, person);
  if (!region || !msp) return {};

  return meta({
    title: `${msp.name}, MSP for ${region.region}`,
    description: `${msp.name} is a regional MSP for ${region.region}. See their party, official portrait, current roles, public email and recorded votes.`,
    path: `/representatives/msps/regions/${region.regionSlug}/${representativeSlug(msp.name)}`,
  });
}

export default async function RegionalMspPage({
  params,
}: {
  params: Promise<{ slug: string; person: string }>;
}) {
  const { slug, person } = await params;
  const region = getHolyroodRegionBySlug(slug);
  const msp = getHolyroodRegionalMsp(slug, person);
  if (!region || !msp) notFound();

  const checked = formatHolyroodCheckedDate();
  const pagePath = `/representatives/msps/regions/${region.regionSlug}/${representativeSlug(msp.name)}`;
  const pageUrl = `${site.url}${pagePath}`;
  const otherMsps = region.msps.filter((item) => item.memberId !== msp.memberId);
  const faq = [
    {
      q: `Who is ${msp.name}?`,
      a: `${msp.name} is a ${msp.party} regional MSP for ${region.region}. They have represented the region at Holyrood since ${formatHolyroodTermDate(msp.termStart)}.`,
    },
    {
      q: `How do I contact ${msp.name}?`,
      a: `You can email ${msp.name} at ${msp.email}. Everyone in ${region.region} can contact a regional MSP, whatever party they support.`,
    },
    {
      q: `How has ${msp.name} voted?`,
      a: msp.votes.length > 0
        ? `This page shows the latest ${msp.votes.length} recorded votes in the Scottish Parliament's 2026 motion dataset, with the date, motion and vote shown for each.`
        : "No recorded votes for this member were in the current 2026 snapshot.",
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Scottish MSPs", path: "/representatives/msps" },
        { name: region.region, path: `/representatives/msps/regions/${region.regionSlug}` },
        { name: msp.name, path: pagePath },
      ])} />
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${pageUrl}#webpage`,
              url: pageUrl,
              name: `${msp.name}, MSP for ${region.region}`,
              description: `${msp.name} is a regional MSP for ${region.region}, with public contact details and an official voting record snapshot.`,
              inLanguage: "en-GB",
              dateModified: HOLYROOD_DATA_CHECKED_AT,
              primaryImageOfPage: { "@id": `${pageUrl}#portrait` },
              mainEntity: { "@id": `${pageUrl}#msp` },
              isPartOf: { "@id": `${site.url}/#website` },
            },
            {
              "@type": "ImageObject",
              "@id": `${pageUrl}#portrait`,
              contentUrl: `${site.url}${msp.photoUrl}`,
              caption: `${msp.name}, MSP`,
              license: "https://www.parliament.scot/about/copyright",
              acquireLicensePage: msp.photoSourceUrl,
              copyrightNotice: "Portrait supplied by the Scottish Parliament",
            },
            {
              "@type": "Person",
              "@id": `${pageUrl}#msp`,
              name: msp.name,
              url: pageUrl,
              image: `${site.url}${msp.photoUrl}`,
              jobTitle: `Regional Member of the Scottish Parliament for ${region.region}`,
              email: `mailto:${msp.email}`,
              affiliation: { "@type": "Organization", name: msp.party },
              memberOf: { "@type": "GovernmentOrganization", name: "Scottish Parliament", url: "https://www.parliament.scot/" },
              sameAs: [msp.profileUrl],
              mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
              startDate: msp.termStart,
            },
          ],
        }}
      />

      <Page>
        <PageHeader
          eyebrow="Regional MSP at Holyrood"
          title={`${msp.name}, MSP for ${region.region}`}
          lede={<><strong>{msp.name}</strong> is one of seven regional MSPs for {region.region}. Every person in the region can contact them, whatever party they support.</>}
        />

        <ContentFrame>
          <InShort expert={false}>
            <p><strong>You can contact {msp.name} about Scottish matters.</strong> Regional MSPs represent the whole region, not only people who voted for them.</p>
            <p>This page gives you the short answer first, then the official contact details, current roles and latest recorded votes.</p>
          </InShort>

          <section className="pt-10">
            <MspProfileCard msp={msp} area={region.region} regional />
          </section>

          <section className="pt-10">
            <MspVotingRecord msp={msp} />
          </section>

          <section className="pt-12">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="kicker mb-2 text-[var(--brand)]">People who represent the same region</p>
                <h2 className="h2">The other regional MSPs</h2>
              </div>
              <Link href={`/representatives/msps/regions/${region.regionSlug}`} className="ui text-[16px] font-[700]">See the region list →</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {otherMsps.map((other) => (
                <Link
                  key={other.memberId}
                  href={`/representatives/msps/regions/${region.regionSlug}/${representativeSlug(other.name)}`}
                  className="group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5 no-underline hover:border-[var(--rule-strong)]"
                >
                  <span className="ui block text-[17px] font-[750] text-[var(--ink)] group-hover:text-[var(--brand)]">{other.name}</span>
                  <span className="ui mt-1 block text-[15px] text-[var(--ink-2)]">{other.party}</span>
                  <span className="ui mt-3 block text-[15px] font-[700] text-[var(--brand)]">View their details →</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="pt-12 max-w-[760px]">
            <h2 className="h2 mb-4">Where this information comes from</h2>
            <HolyroodSourceNote />
            <p className="ui mt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Names, roles and contact details: <a href={HOLYROOD_DATA_SOURCE}>{HOLYROOD_DATA_SOURCE_NAME}</a>. Portrait: <a href="https://www.parliament.scot/about/copyright">Scottish Parliament Copyright Licence</a>. Last checked <time dateTime={HOLYROOD_DATA_CHECKED_AT}>{checked}</time>.
            </p>
          </section>

          <Faq items={faq} className="pt-12" />
          <CTA
            title="Find every person who represents you"
            body="Enter your postcode. I find your MP, constituency MSP and seven regional MSPs, then prepare the right emails automatically."
            href="/find-my-mp-and-msp"
            cta="Use my postcode"
            secondaryHref={`/representatives/msps/regions/${region.regionSlug}`}
            secondaryCta={`See all 7 MSPs for ${region.region}`}
          />
        </ContentFrame>
      </Page>
    </>
  );
}
