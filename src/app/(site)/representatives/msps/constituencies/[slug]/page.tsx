import Link from "next/link";
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
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";
import { listApprovedMspReviews } from "@/lib/mspReviewsDb";
import { HolyroodSourceNote, MspProfileCard, MspProfileReviews, MspVotingRecord, holyroodPersonJsonLd } from "../../_shared";

export const revalidate = 60;

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
  const pagePath = `/representatives/msps/constituencies/${record.constituencySlug}`;
  const pageUrl = `${site.url}${pagePath}`;
  const faq = [
    {
      q: `Who is the MSP for ${record.constituency}?`,
      a: `${record.msp.name} is the ${record.msp.party} constituency MSP for ${record.constituency}. The official Scottish Parliament data was last checked on ${checked}.`,
    },
    {
      q: `How do I contact ${record.msp.name}?`,
      a: `You can email ${record.msp.name} at ${record.msp.email}. This page also links to their official Scottish Parliament profile and opens a ready-written email in your own email app.`,
    },
    {
      q: `How many MSPs represent someone in ${record.constituency}?`,
      a: `Eight. ${record.msp.name} is the one MSP elected for ${record.constituency}. Everyone in the constituency also has seven regional MSPs for ${record.region}.`,
    },
    {
      q: `Do I have to have voted for ${record.msp.name} to contact them?`,
      a: "No. MSPs represent everyone who lives in their area, whether they voted for them, voted for another candidate or did not vote.",
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Scottish MSPs", path: "/representatives/msps" },
          { name: record.constituency, path: pagePath },
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
          eyebrow="Your local representative at Holyrood"
          title={`Who is the MSP for ${record.constituency}?`}
          lede={
            <>
              <strong>{record.msp.name}</strong> is the {record.msp.party} constituency MSP for {" "}
              {record.constituency}. They represent everyone who lives in the area, not only people
              who voted for them.
            </>
          }
        />

        <ContentFrame>
          <InShort expert={false}>
            <p>
              Your constituency MSP is <strong>{record.msp.name}</strong>. They can take up problems
              with Scottish public services and vote on laws and spending at Holyrood.
            </p>
            <p>
              You also have seven regional MSPs for {record.region}. There is no wrong person to
              contact. The postcode email tool uses {record.msp.name} automatically as the closest
              local match.
            </p>
          </InShort>

          <section className="pt-10 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
            <MspProfileCard msp={record.msp} area={record.constituency} />
            <aside className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 sm:p-7">
              <p className="kicker mb-3 text-[var(--brand)]">Your other Holyrood voices</p>
              <h2 className="h3 mb-3">Seven regional MSPs also represent you</h2>
              <p className="text-[16px] leading-[1.6] text-[var(--ink-2)]">
                {record.constituency} is in the {record.region} region. Every person in that larger
                region can contact any of its seven MSPs.
              </p>
              <Link
                href={`/representatives/msps/regions/${record.regionSlug}`}
                className="btn btn-ghost mt-6 justify-center text-center"
              >
                See all 7 regional MSPs
              </Link>
            </aside>
          </section>

          <MspProfileReviews msp={record.msp} reviews={reviews} />

          <section className="pt-10">
            <MspVotingRecord msp={record.msp} />
          </section>

          <section className="pt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-6">
              <h2 className="h3 mb-3">What can your MSP deal with?</h2>
              <p className="text-[16px] leading-[1.65] text-[var(--ink-2)]">
                MSPs deal with the Scottish NHS, schools, housing law, policing, courts, Scottish
                benefits, transport and Scottish income tax. Their office can also take up a
                problem with a Scottish public body.
              </p>
            </div>
            <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-6">
              <h2 className="h3 mb-3">What should go somewhere else?</h2>
              <p className="text-[16px] leading-[1.65] text-[var(--ink-2)]">
                Universal Credit, immigration and most employment law are UK matters for your MP.
                Bins, council housing repairs and many local roads are usually council matters. The
                postcode tool works out who should receive each request.
              </p>
            </div>
          </section>

          <section className="pt-12 max-w-[760px]">
            <h2 className="h2 mb-4">Where this information comes from</h2>
            <HolyroodSourceNote />
            <p className="ui mt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Names, parties and contacts: <a href={HOLYROOD_DATA_SOURCE}>{HOLYROOD_DATA_SOURCE_NAME}</a>.
              Portraits: <a href="https://www.parliament.scot/about/copyright">Scottish Parliament copyright licence</a>.
              Last checked {" "}<time dateTime={HOLYROOD_DATA_CHECKED_AT}>{checked}</time>.
            </p>
          </section>

          <Faq items={faq} className="pt-12" />

          <CTA
            title="Find every person who represents you"
            body="Enter your postcode. I find your MP, constituency MSP and seven regional MSPs, then prepare the right emails automatically."
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
