import Link from "@/components/IntentLink";
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
import { JsonLd, faqJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";
import { listApprovedMspReviews } from "@/lib/mspReviewsDb";
import { getMspInterests } from "@/lib/data/mspInterests";
import {
  HolyroodSourceNote,
  MspExpensesAndInterests,
  MspProfileCard,
  MspProfileReviews,
  MspStoryPicks,
  MspOwnExpensesLine,
  MspVotingRecord,
} from "../../../_shared";
import Breadcrumbs from "@/components/Breadcrumbs";

/*
 * A day, not a minute. Approving a review refreshes this page straight away
 * (api/msp-review-moderation), so a short timer only rebuilt pages nothing had
 * changed, and every rebuild used server time from the monthly allowance.
 */
export const revalidate = 86400;

/** Same format as the expenses box further down the page (_shared.tsx). */
const gbpWhole = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

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
  const reviews = await listApprovedMspReviews(msp.memberId);

  const checked = formatHolyroodCheckedDate();
  const expenses = getMspInterests(msp.memberId)?.holyroodExpenses ?? null;
  const pagePath = `/representatives/msps/regions/${region.regionSlug}/${representativeSlug(msp.name)}`;
  const pageUrl = `${site.url}${pagePath}`;
  const otherMsps = region.msps.filter((item) => item.memberId !== msp.memberId);
  const faq = [
    {
      q: `Who is ${msp.name}?`,
      a: `${msp.name} (${msp.party}) is a regional MSP for ${region.region}. They have sat at Holyrood since ${formatHolyroodTermDate(msp.termStart)}.`,
    },
    {
      q: `How do I write to ${msp.name}?`,
      a: `Email ${msp.name} at ${msp.email}. Anyone in ${region.region} can write to them, no matter who you voted for.`,
    },
    {
      q: `How has ${msp.name} voted?`,
      a: msp.votes.length > 0
        ? `This page lists their last ${msp.votes.length} votes in Holyrood in 2026, with the date and how they voted.`
        : "No 2026 votes are logged for this MSP yet.",
    },
  ];

  return (
    <>
      <Breadcrumbs crumbs={[
        { name: "Home", path: "/" },
        { name: "Scottish MSPs", path: "/representatives/msps" },
        { name: region.region, path: `/representatives/msps/regions/${region.regionSlug}` },
        { name: msp.name, path: pagePath },
      ]} />
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
          lede={<><strong>{msp.name}</strong> is one of seven regional MSPs for {region.region}. Anyone in the region can write to them, no matter who you voted for.</>}
          stat={
            expenses
              ? {
                  value: gbpWhole.format(expenses.total2425),
                  label: `paid by taxpayers for ${msp.name}'s bills in 2024/25, not counting staff pay.`,
                }
              : {
                  value: "7",
                  label: `regional MSPs serve ${region.region}. ${msp.name} is one of them.`,
                }
          }
        />

        <ContentFrame>
          <InShort expert={false}>
            <p><strong>You can write to {msp.name} about Scottish issues.</strong> Regional MSPs serve the whole area, not just their voters.</p>
            <p>This page gives the short answer first, then their email, bills, roles and recent votes.</p>
          </InShort>


          <section className="pt-10">
            <MspProfileCard msp={msp} area={region.region} regional />
          </section>

          <MspExpensesAndInterests msp={msp} area={region.region} />

          <MspProfileReviews msp={msp} reviews={reviews} />

          <section className="pt-10">
            <MspVotingRecord msp={msp} />
          </section>

          <MspOwnExpensesLine msp={msp} pagePath={pagePath} />
          <MspStoryPicks msp={msp} pagePath={pagePath} />

          <section className="pt-12">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="kicker mb-2 text-[var(--brand)]">People who represent the same region</p>
                <h2 className="h2">The other regional MSPs</h2>
              </div>
              <Link href={`/representatives/msps/regions/${region.regionSlug}`} className="ui text-[16px] font-[580]">See the region list →</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {otherMsps.map((other) => (
                <Link
                  key={other.memberId}
                  href={`/representatives/msps/regions/${region.regionSlug}/${representativeSlug(other.name)}`}
                  className="group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5 no-underline hover:border-[var(--rule-strong)]"
                >
                  <span className="ui block text-[17px] font-[600] text-[var(--ink)] group-hover:text-[var(--brand)]">{other.name}</span>
                  <span className="ui mt-1 block text-[15px] text-[var(--ink-2)]">{other.party}</span>
                  <span className="ui mt-3 block text-[15px] font-[580] text-[var(--brand)]">View their details →</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="pt-12 max-w-[760px]">
            <h2 className="h2 mb-4">Where these facts come from</h2>
            <HolyroodSourceNote />
            <p className="ui mt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Names and emails: <a href={HOLYROOD_DATA_SOURCE}>{HOLYROOD_DATA_SOURCE_NAME}</a>. Photo: <a href="https://www.parliament.scot/about/copyright">Holyrood photo licence</a>. Last checked <time dateTime={HOLYROOD_DATA_CHECKED_AT}>{checked}</time>.
            </p>
          </section>

          <Faq items={faq} className="pt-12" />
          <CTA
            title={`Want to write to ${msp.name}?`}
            body="Type your postcode. We find your MP and MSPs and write a ready email with local facts. You read and send it yourself."
            href="/email-your-mp-and-msp"
            cta="Start my email"
            secondaryHref={`/representatives/msps/regions/${region.regionSlug}`}
            secondaryCta={`See all 7 MSPs for ${region.region}`}
          />
        </ContentFrame>
      </Page>
    </>
  );
}
