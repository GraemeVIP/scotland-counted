import Link from "@/components/IntentLink";
import { notFound } from "next/navigation";
import Faq from "@/components/Faq";
import { CTA, ContentFrame, InShort, Page, PageHeader } from "@/components/Blocks";
import {
  formatHolyroodCheckedDate,
  getHolyroodConstituencyBySlug,
  HOLYROOD_DATA_CHECKED_AT,
  HOLYROOD_DATA_SOURCE,
  HOLYROOD_DATA_SOURCE_NAME,
  holyroodConstituencies,
} from "@/lib/data/holyrood";
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
  holyroodPersonJsonLd,
  partyLabel,
} from "../../_shared";
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
  return holyroodConstituencies.map((item) => ({ slug: item.constituencySlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = getHolyroodConstituencyBySlug(slug);
  if (!record) return {};

  return meta({
    title: `MSP for ${record.constituency}: ${record.msp.name}`,
    description: `${record.msp.name} is the MSP for ${record.constituency}. See their party, public email and official Scottish Parliament profile.`,
    path: `/representatives/msps/constituencies/${record.constituencySlug}`,
  });
}

export default async function HolyroodConstituencyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = getHolyroodConstituencyBySlug(slug);
  if (!record) notFound();
  const reviews = await listApprovedMspReviews(record.msp.memberId);

  const checked = formatHolyroodCheckedDate();
  const expenses = getMspInterests(record.msp.memberId)?.holyroodExpenses ?? null;
  const pagePath = `/representatives/msps/constituencies/${record.constituencySlug}`;
  const pageUrl = `${site.url}${pagePath}`;
  const faq = [
    {
      q: `Who is the MSP for ${record.constituency}?`,
      a: `${record.msp.name} (${partyLabel(record.msp)}) is the constituency MSP for ${record.constituency}. Last checked on ${checked}.`,
    },
    {
      q: `How do I write to ${record.msp.name}?`,
      a: `Email ${record.msp.name} at ${record.msp.email}. Tap the button above to open a ready email in your own mail app.`,
    },
    {
      q: `How many MSPs serve ${record.constituency}?`,
      a: `Eight. ${record.msp.name} is your one local MSP. You also have seven regional MSPs for ${record.region}.`,
    },
    {
      q: `Do I have to vote for ${record.msp.name} to write to them?`,
      a: "No. MSPs must help everyone who lives in their area, no matter how you voted.",
    },
  ];

  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Scottish MSPs", path: "/representatives/msps" },
          { name: record.constituency, path: pagePath },
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
              name: `MSP for ${record.constituency}: ${record.msp.name}`,
              description: `${record.msp.name} is the constituency MSP for ${record.constituency}, with public contact details from the Scottish Parliament.`,
              inLanguage: "en-GB",
              dateModified: HOLYROOD_DATA_CHECKED_AT,
              mainEntity: { "@id": `${pageUrl}#msp` },
              isPartOf: { "@id": `${site.url}/#website` },
            },
            holyroodPersonJsonLd({
              msp: record.msp,
              area: record.constituency,
              pagePath,
            }),
          ],
        }}
      />

      <Page>
        <PageHeader
          eyebrow="Your local MSP at Holyrood"
          title={`Who is the MSP for ${record.constituency}?`}
          lede={
            <>
              <strong>{record.msp.name}</strong> is the {partyLabel(record.msp)} constituency MSP for{" "}
              {record.constituency}. They serve everyone in this area, not just their voters.
            </>
          }
          stat={
            expenses
              ? {
                  value: gbpWhole.format(expenses.total2425),
                  label: `paid by taxpayers for ${record.msp.name}'s bills in 2024/25, not counting staff pay.`,
                }
              : {
                  value: "8",
                  label: `MSPs serve ${record.constituency}. ${record.msp.name} is one. Seven more cover ${record.region}.`,
                }
          }
        />

        <ContentFrame>
          <InShort expert={false}>
            <p>
              Your constituency MSP is <strong>{record.msp.name}</strong>. They help with Scottish
              services and vote on laws and spend at Holyrood.
            </p>
            <p>
              You also have seven regional MSPs for {record.region}. You can write to any of them.
              Our postcode tool picks {record.msp.name} first for your area.
            </p>
          </InShort>


          <section className="pt-10 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
            <MspProfileCard msp={record.msp} area={record.constituency} />
            <aside className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 sm:p-7">
              <p className="kicker mb-3 text-[var(--brand)]">Your other Holyrood voices</p>
              <h2 className="h3 mb-3">Seven regional MSPs also serve you</h2>
              <p className="text-[16px] leading-[1.6] text-[var(--ink-2)]">
                {record.constituency} sits in {record.region}. You can write to any of its seven
                regional MSPs too.
              </p>
              <Link
                href={`/representatives/msps/regions/${record.regionSlug}`}
                className="btn btn-ghost mt-6 justify-center text-center"
              >
                See all 7 regional MSPs
              </Link>
            </aside>
          </section>

          <MspExpensesAndInterests msp={record.msp} area={record.constituency} />

          <MspProfileReviews msp={record.msp} reviews={reviews} />

          <section className="pt-10">
            <MspVotingRecord msp={record.msp} />
          </section>

          <MspOwnExpensesLine msp={record.msp} pagePath={pagePath} />
          <MspStoryPicks msp={record.msp} pagePath={pagePath} />

          <section className="pt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-6">
              <h2 className="h3 mb-3">What can your MSP help with?</h2>
              <p className="text-[16px] leading-[1.65] text-[var(--ink-2)]">
                MSPs deal with the NHS, schools, housing law, police, courts, Scottish benefits,
                trains and Scottish tax. Their team can also chase Scottish public bodies.
              </p>
            </div>
            <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-6">
              <h2 className="h3 mb-3">What goes somewhere else?</h2>
              <p className="text-[16px] leading-[1.65] text-[var(--ink-2)]">
                Universal Credit, visas and work law go to your MP in Westminster. Bins, council
                house fixes and local roads go to your council. Our postcode tool picks the right
                one for you.
              </p>
            </div>
          </section>

          <section className="pt-12 max-w-[760px]">
            <h2 className="h2 mb-4">Where these facts come from</h2>
            <HolyroodSourceNote />
            <p className="ui mt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Names and emails: <a href={HOLYROOD_DATA_SOURCE}>{HOLYROOD_DATA_SOURCE_NAME}</a>.
              Photos: <a href="https://www.parliament.scot/about/copyright">Holyrood photo licence</a>.
              Last checked <time dateTime={HOLYROOD_DATA_CHECKED_AT}>{checked}</time>.
            </p>
          </section>

          <Faq items={faq} className="pt-12" />

          <CTA
            title={`Want to write to ${record.msp.name}?`}
            body="Type your postcode. We find your MP and MSPs and write a ready email with local facts. You read and send it yourself."
            href="/email-your-mp-and-msp"
            cta="Start my email"
            secondaryHref="/representatives/msps"
            secondaryCta="Browse every Scottish MSP area"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
