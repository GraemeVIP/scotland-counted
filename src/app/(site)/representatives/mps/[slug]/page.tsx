import Link from "next/link";
import { notFound } from "next/navigation";
import Faq from "@/components/Faq";
import { CTA, ContentFrame, EvidenceDetails, InShort, Page, PageHeader } from "@/components/Blocks";
import { CONSTITUENCY_YEARS, getConstituency } from "@/lib/data/constituencies";
import {
  formatMpCheckedDate,
  getMpByConstituencySlug,
  MP_DATA_CHECKED_ISO,
  MP_DATA_SOURCE,
  MP_DATA_SOURCE_NAME,
  mps,
} from "@/lib/data/mps";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return mps.map((mp) => ({ slug: mp.constituencySlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mp = getMpByConstituencySlug(slug);
  if (!mp) return {};

  return meta({
    title: `MP for ${mp.constituency}: ${mp.name}`,
    description: `${mp.name} is the MP for ${mp.constituency}. See their party, email, phone, address and official UK Parliament profile.`,
    path: `/representatives/mps/${slug}`,
  });
}

function emailHref({
  email,
  name,
  constituency,
  povertyRate,
  povertyCount,
  povertyYear,
}: {
  email: string;
  name: string;
  constituency: string;
  povertyRate: number;
  povertyCount: number;
  povertyYear: string;
}) {
  const subject = `Question from a constituent in ${constituency}`;
  const body = `Dear ${name},\n\nI live in the ${constituency} constituency.\n\nThe latest constituency estimate says ${povertyCount.toLocaleString("en-GB")} children here were living in poverty after housing costs in ${povertyYear}, which is ${povertyRate}%.\n\nWhat action will you take in Parliament to bring that figure down, and what do you expect it to be in five years?\n\nYours sincerely,\n[Your name]\n[Your address]`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function isDialablePhone(phone: string) {
  return /^\+?[\d\s()\-]+$/.test(phone);
}

export default async function MpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mp = getMpByConstituencySlug(slug);
  const constituency = getConstituency(slug);
  if (!mp || !constituency) notFound();

  const checked = formatMpCheckedDate();
  const latestIndex = CONSTITUENCY_YEARS.length - 1;
  const povertyYear = CONSTITUENCY_YEARS[latestIndex];
  const povertyRate = constituency.pcts[latestIndex];
  const povertyCount = constituency.counts[latestIndex];
  const pagePath = `/representatives/mps/${mp.constituencySlug}`;
  const pageUrl = `${site.url}${pagePath}`;
  const preparedEmail = emailHref({
    email: mp.email,
    name: mp.name,
    constituency: mp.constituency,
    povertyRate,
    povertyCount,
    povertyYear,
  });

  const faq = [
    {
      q: `Who is the MP for ${mp.constituency}?`,
      a: `${mp.name} is the ${mp.party} MP for ${mp.constituency}. This information was checked against the official UK Parliament Members API on ${checked}.`,
    },
    {
      q: `How do I contact ${mp.name}?`,
      a: `You can email ${mp.name} at ${mp.email}${mp.phone ? ` or phone ${mp.phone}` : ""}. Their official UK Parliament contact page is linked above.`,
    },
    {
      q: `Do I have to have voted for ${mp.name} to contact them?`,
      a: `No. An MP represents everyone who lives in their constituency, whether they voted for them, voted for someone else or did not vote. Include your home address so the office can confirm that you live in the area.`,
    },
    {
      q: "Is an MP the same as an MSP?",
      a: "No. An MP represents you in the UK Parliament at Westminster. An MSP represents you in the Scottish Parliament at Holyrood. Enter your postcode on Scotland Counted to find both.",
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Scottish MPs", path: "/representatives" },
          { name: mp.constituency, path: pagePath },
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
              name: `MP for ${mp.constituency}: ${mp.name}`,
              description: `${mp.name} is the ${mp.party} MP for ${mp.constituency}, with public contact details from UK Parliament.`,
              inLanguage: "en-GB",
              dateModified: MP_DATA_CHECKED_ISO,
              mainEntity: { "@id": `${pageUrl}#mp` },
              isPartOf: { "@id": `${site.url}/#website` },
            },
            {
              "@type": "Person",
              "@id": `${pageUrl}#mp`,
              name: mp.name,
              url: pageUrl,
              jobTitle: `Member of Parliament for ${mp.constituency}`,
              email: `mailto:${mp.email}`,
              ...(mp.phone && isDialablePhone(mp.phone) ? { telephone: mp.phone } : {}),
              address: mp.officeAddress,
              affiliation: {
                "@type": "Organization",
                name: mp.party,
              },
              memberOf: {
                "@type": "GovernmentOrganization",
                name: "UK Parliament",
                url: "https://www.parliament.uk/",
              },
              sameAs: [mp.profileUrl, ...(mp.website ? [mp.website] : [])],
              mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
            },
          ],
        }}
      />

      <Page>
        <PageHeader
          eyebrow="Your representative at Westminster"
          title={`Who is the MP for ${mp.constituency}?`}
          lede={
            <>
              <strong>{mp.name}</strong> is the {mp.party} MP for {mp.constituency}. They
              represent everyone who lives in the area, not only people who voted for them.
            </>
          }
        />

        <ContentFrame>
          <InShort expert={false}>
            <p>
              Your MP is <strong>{mp.name}</strong>. You can email them directly using the public
              address supplied by UK Parliament.
            </p>
            <p>
              This is your representative in London. You also have MSPs at Holyrood and local
              councillors. If you are unsure who should deal with your problem, the postcode tool
              works that out for you.
            </p>
          </InShort>

          <section className="pt-10">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
              <div className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] bg-[var(--surface)] p-6 sm:p-8">
                <p className="kicker mb-3 text-[var(--action)]">Current MP</p>
                <h2 className="h2 mb-2">{mp.name}</h2>
                <p className="ui text-[17px] leading-[1.5] text-[var(--ink-2)]">
                  {mp.party} · MP for {mp.constituency}
                </p>

                <dl className="mt-7 grid gap-5">
                  <div>
                    <dt className="ui text-[15px] font-[750] text-[var(--ink)]">Email</dt>
                    <dd className="mt-1 text-[16px] leading-[1.5] break-words">
                      <a href={`mailto:${mp.email}`}>{mp.email}</a>
                    </dd>
                  </div>
                  {mp.phone && (
                    <div>
                      <dt className="ui text-[15px] font-[750] text-[var(--ink)]">Phone</dt>
                      <dd className="mt-1 text-[16px] leading-[1.5]">
                        {isDialablePhone(mp.phone) ? (
                          <a href={`tel:${mp.phone.replace(/[^+\d]/g, "")}`}>{mp.phone}</a>
                        ) : (
                          mp.phone
                        )}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="ui text-[15px] font-[750] text-[var(--ink)]">Office address</dt>
                    <dd className="mt-1 text-[16px] leading-[1.55] text-[var(--ink-2)]">
                      {mp.officeAddress}
                    </dd>
                  </div>
                </dl>

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <a href={preparedEmail} className="btn btn-primary justify-center text-center">
                    Open a ready-written email
                  </a>
                  <a href={mp.profileUrl} className="btn btn-ghost justify-center text-center">
                    Official Parliament profile
                  </a>
                </div>
                <p className="ui mt-4 text-[15px] leading-[1.5] text-[var(--ink-2)]">
                  The draft opens in your own email app. Read it, add your address and change
                  anything you want before sending.
                </p>
              </div>

              <aside className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 sm:p-7">
                <p className="kicker mb-3 text-[var(--brand)]">One local fact to use</p>
                <p className="figure-num text-[42px] sm:text-[50px] leading-[1] text-[var(--brand)]">
                  {povertyRate}%
                </p>
                <p className="mt-4 text-[17px] leading-[1.55] text-[var(--ink-2)]">
                  {povertyCount.toLocaleString("en-GB")} children in {mp.constituency} were
                  estimated to be living in poverty after housing costs in {povertyYear}.
                </p>
                <Link
                  href={`/constituencies/${mp.constituencySlug}`}
                  className="ui mt-6 inline-block text-[16px] font-[700]"
                >
                  See the full local evidence →
                </Link>
              </aside>
            </div>
          </section>

          <section className="pt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-6">
              <h2 className="h3 mb-3">What can your MP deal with?</h2>
              <p className="text-[16px] leading-[1.65] text-[var(--ink-2)]">
                MPs vote on matters controlled at Westminster, including Universal Credit rules,
                most taxes and immigration. Their office can also take up a problem you are having
                with a UK Government department.
              </p>
            </div>
            <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-6">
              <h2 className="h3 mb-3">What should go somewhere else?</h2>
              <p className="text-[16px] leading-[1.65] text-[var(--ink-2)]">
                The Scottish NHS, schools and many housing matters are handled in Scotland. Bins,
                council housing and local roads are usually council matters. The postcode tool
                sends each request to the right person.
              </p>
            </div>
          </section>

          <section className="pt-12 max-w-[760px]">
            <h2 className="h2 mb-4">Where this information comes from</h2>
            <p className="text-[17px] leading-[1.65] text-[var(--ink-2)]">
              The name, party and public contact details came from {" "}
              <a href={mp.profileUrl}>UK Parliament&apos;s official record</a>. I checked them on {" "}
              <time dateTime={MP_DATA_CHECKED_ISO}>{checked}</time>. The page keeps a checked copy,
              so it still works if Parliament&apos;s website is temporarily unavailable.
            </p>
            <p className="mt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              MPs can change after an election, resignation or by-election. If this record is out
              of date, <Link href="/contact">tell me and I will check it</Link>.
            </p>
            <EvidenceDetails className="mt-6" summary="See the exact official data source">
              <p>
                Source: {MP_DATA_SOURCE_NAME}. Snapshot generated from {" "}
                <code className="text-[15px] break-words">{MP_DATA_SOURCE}</code>.
              </p>
            </EvidenceDetails>
          </section>

          <Faq items={faq} className="pt-12" />

          <CTA
            title="You also have MSPs and councillors"
            body="Enter your postcode. I find all the right people and put each request into the email for the person who can act on it."
            href="/find-my-mp-and-msp"
            cta="Find everyone who represents me"
            secondaryHref="/representatives"
            secondaryCta="Browse every Scottish MP"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
