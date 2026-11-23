import Link from "@/components/IntentLink";
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
import { JsonLd, faqJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";
import MemberVoteList from "@/components/MemberVoteList";
import MpInterestsCard from "@/components/MpInterestsCard";
import MpLondonRecord from "@/components/MpLondonRecord";
import { getLondonRecordByConstituencySlug } from "@/lib/data/mpLondonRecord";
import MpEmailComposer from "@/components/MpEmailComposer";
import { buildMpEmailIssues } from "@/lib/mpEmails";
import PortraitLightbox from "@/components/PortraitLightbox";
import {
  getMpInterestsByConstituencySlug,
  MP_INTERESTS_CHECKED_ISO,
} from "@/lib/data/mpInterests";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ExpenseStoryHook, ExpenseStoryPicks, ReceiptsNudge } from "@/components/ExpenseNudges";
import { mpReceiptsHref, storyForProfile } from "@/lib/expenseNudges";
import { relatedMpStories } from "@/lib/expenseNudgePicks";

export function generateStaticParams() {
  return mps.map((mp) => ({ slug: mp.constituencySlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mp = getMpByConstituencySlug(slug);
  if (!mp) return {};

  return meta({
    title: `MP for ${mp.constituency}: ${mp.name}`,
    description: `${mp.name} is the MP for ${mp.constituency}. See their party, email, phone, voting record, declared donations, foreign trips and official UK Parliament profile.`,
    path: `/representatives/mps/${slug}`,
  });
}


function isDialablePhone(phone: string) {
  return /^\+?[\d\s()\-]+$/.test(phone);
}

export default async function MpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mp = getMpByConstituencySlug(slug);
  const constituency = getConstituency(slug);
  if (!mp || !constituency) notFound();
  const interests = getMpInterestsByConstituencySlug(slug);
  const londonRecord = getLondonRecordByConstituencySlug(slug);

  const checked = formatMpCheckedDate();
  const latestIndex = CONSTITUENCY_YEARS.length - 1;
  const povertyYear = CONSTITUENCY_YEARS[latestIndex];
  const povertyRate = constituency.pcts[latestIndex];
  const povertyCount = constituency.counts[latestIndex];
  const pagePath = `/representatives/mps/${mp.constituencySlug}`;
  const pageUrl = `${site.url}${pagePath}`;
  const ownStory = storyForProfile(pagePath);
  const receiptsHref = mpReceiptsHref(mp.constituencySlug);
  const otherStories = relatedMpStories(mp.constituencySlug, mp.party);
  const emailIssues = buildMpEmailIssues({
    name: mp.name,
    constituency: mp.constituency,
    povertyCount,
    povertyRate,
    povertyYear,
    interests,
    votes: mp.votes ?? [],
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
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Scottish MPs", path: "/representatives" },
          { name: mp.constituency, path: pagePath },
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
              ...(mp.photoUrl ? { image: `${site.url}${mp.photoUrl}` } : {}),
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
                <div className="flex items-start gap-4">
                  {mp.photoUrl && (
                    <PortraitLightbox
                      src={mp.photoUrl}
                      alt={`${mp.name}, MP for ${mp.constituency}`}
                      sizes="80px"
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--r-s)] bg-[var(--surface-2)]"
                    />
                  )}
                  <div>
                    <p className="kicker mb-3 text-[var(--action-text)]">Current MP</p>
                    <h2 className="h2 mb-2">{mp.name}</h2>
                  </div>
                </div>
                <p className="ui text-[17px] leading-[1.5] text-[var(--ink-2)]">
                  {mp.party} · MP for {mp.constituency}
                </p>

                <dl className="mt-7 grid gap-5">
                  <div>
                    <dt className="ui text-[15px] font-[600] text-[var(--ink)]">Email</dt>
                    <dd className="mt-1 text-[16px] leading-[1.5] break-words">
                      <a href={`mailto:${mp.email}`}>{mp.email}</a>
                    </dd>
                  </div>
                  {mp.phone && (
                    <div>
                      <dt className="ui text-[15px] font-[600] text-[var(--ink)]">Phone</dt>
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
                    <dt className="ui text-[15px] font-[600] text-[var(--ink)]">Office address</dt>
                    <dd className="mt-1 text-[16px] leading-[1.55] text-[var(--ink-2)]">
                      {mp.officeAddress}
                    </dd>
                  </div>
                </dl>

                <div className="mt-7 border-t border-[var(--rule)] pt-6">
                  <MpEmailComposer name={mp.name} email={mp.email} issues={emailIssues} />
                </div>
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
                  className="ui mt-6 inline-block text-[16px] font-[580]"
                >
                  See the full local evidence →
                </Link>
              </aside>
            </div>
          </section>

          {interests && (
            <section id="donations-and-interests" className="pt-10">
              <MpInterestsCard
                interests={interests}
                checkedDate={MP_INTERESTS_CHECKED_ISO}
                email={mp.email}
                povertyCount={povertyCount}
                povertyRate={povertyRate}
                povertyYear={povertyYear}
              />
            </section>
          )}

          {londonRecord && (
            <section id="london-record" className="pt-10">
              <MpLondonRecord
                record={londonRecord}
                name={mp.name}
                party={mp.party}
                secondHome={interests?.expenses?.accommodationSpend ?? 0}
              />
            </section>
          )}

          <section className="pt-10">
            <MemberVoteList name={mp.name} votes={mp.votes ?? []} parliament="Commons" />
          </section>

          {/* Read more routes come after the profile's own content, never
              above it. One slim line on their own receipts, then the picks. */}
          <div className="pt-10">
            {ownStory ? (
              <ExpenseStoryHook story={ownStory} name={mp.name} receiptsHref={receiptsHref} />
            ) : (
              <ReceiptsNudge
                name={mp.name}
                amount={interests?.expenses?.nonStaffSpend}
                what="for rent, travel and office costs"
                period={interests?.expenses ? `in ${interests.expenses.year}` : undefined}
                href={receiptsHref}
                cta="See every receipt"
              />
            )}
          </div>

          <ExpenseStoryPicks
            className="mt-10"
            kicker="From the same expense files"
            title="What other MPs claimed"
            intro={`Taxpayers paid for all of these. Now check what ${mp.name} claimed.`}
            picks={otherStories.map((p) => ({
              story: p.story,
              label: p.sameParty ? `Another ${p.party} MP` : `${p.party} MP`,
            }))}
            moreHref={receiptsHref}
            moreLabel={`See every receipt ${mp.name} claimed`}
          />

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
              The name, party and public contact details came from UK Parliament&apos;s official
              member record, checked on <time dateTime={MP_DATA_CHECKED_ISO}>{checked}</time>. The
              page keeps a checked copy, so it still works if Parliament&apos;s website is
              temporarily unavailable.
            </p>
            <p className="mt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Portrait: UK Parliament member record. The local copy is used so the page remains
              dependable when the official site is busy.
            </p>
            <p className="mt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              MPs can change after an election, resignation or by election. Checked dates are shown
              on every profile and updates are tracked in the{" "}
              <Link href="/updates">public update log</Link>.
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
            href="/email-your-mp-and-msp"
            cta="Find everyone who represents me"
            secondaryHref="/representatives"
            secondaryCta="Browse every Scottish MP"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
