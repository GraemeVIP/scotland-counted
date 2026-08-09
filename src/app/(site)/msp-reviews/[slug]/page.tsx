import { notFound } from "next/navigation";
import Link from "next/link";
import { ContentFrame, InShort, Page, PageHeader } from "@/components/Blocks";
import MspReviewForm from "@/components/MspReviewForm";
import { getMspRating, getMspReviewProfile, mspReviewProfiles } from "@/lib/data/mspReviews";
import { listApprovedMspReviews } from "@/lib/mspReviewsDb";
import { JsonLd, breadcrumbJsonLd, meta, mspReviewsJsonLd } from "@/lib/seo";

const publishedDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });
const interactionMonth = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

export function generateStaticParams() {
  return mspReviewProfiles.map((profile) => ({ slug: profile.slug }));
}

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const profile = getMspReviewProfile((await params).slug);
  if (!profile) return {};
  const reviews = await listApprovedMspReviews(profile.msp.memberId);
  const metadata = meta({
    title: `${profile.msp.name} MSP Reviews`,
    description: `Read moderated, firsthand reviews of ${profile.msp.name}, ${profile.msp.party} MSP for ${profile.areas.join(", ")}, or submit your own experience.`,
    path: `/msp-reviews/${profile.slug}`,
    image: "/images/social/msp-reviews-share.jpg",
    imageAlt: "Rate My MSP: moderated Scottish MSP reviews on Scotland Counted",
    imageWidth: 1200,
    imageHeight: 630,
    imageType: "image/jpeg",
  });
  return reviews.length
    ? metadata
    : { ...metadata, robots: { index: false, follow: true } };
}

export default async function MspReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const profile = getMspReviewProfile((await params).slug);
  if (!profile) notFound();
  const reviews = await listApprovedMspReviews(profile.msp.memberId);
  const aggregate = getMspRating(reviews);
  const options = mspReviewProfiles.map((item) => ({ memberId: item.msp.memberId, name: item.msp.name, area: item.areas.join(", "), slug: item.slug }));
  const jobTitle = `${profile.representation === "regional" ? "Regional" : "Constituency"} Member of the Scottish Parliament for ${profile.areas.join(", ")}`;
  const latestInteractionMonth = new Date().toISOString().slice(0, 7);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "MSP reviews", path: "/msp-reviews" }, { name: profile.msp.name, path: `/msp-reviews/${profile.slug}` }])} />
      <JsonLd data={mspReviewsJsonLd({
        name: profile.msp.name,
        pagePath: `/msp-reviews/${profile.slug}`,
        officialProfileUrl: profile.msp.profileUrl,
        image: profile.msp.photoUrl,
        jobTitle,
        party: profile.msp.party,
        reviews,
      })} />
      <Page>
        <PageHeader
          eyebrow="Moderated, firsthand experiences"
          title={`${profile.msp.name} MSP reviews`}
          lede={`${profile.msp.name} is a ${profile.msp.party} MSP for ${profile.areas.join(", ")}. This page records eligible experiences submitted by people who dealt with them or their office.`}
          stat={aggregate ? { value: aggregate.ratingValue.toFixed(1), label: `${aggregate.reviewCount} approved ${aggregate.reviewCount === 1 ? "review" : "reviews"}, rated from 1 to 5`, tone: aggregate.ratingValue < 2.5 ? "bad" : "neutral" } : undefined}
        >
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#leave-review" className="btn btn-primary justify-center text-center">Review this MSP</a>
            <Link href={profile.profilePath} className="btn btn-ghost justify-center text-center">View full MSP profile</Link>
            <a href={profile.msp.profileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost justify-center text-center">Official MSP profile ↗</a>
          </div>
          <p className="ui mt-4 text-[15px] font-[650] text-[var(--ink-2)]">No account needed · Email optional · Every review moderated</p>
        </PageHeader>
        <ContentFrame>
          <InShort expert={false}>
            {reviews.length === 0 ? (
              <><p><strong>No reviews have passed moderation for {profile.msp.name} yet.</strong> That is not a positive or negative score; it means there is no eligible published evidence.</p><p>If you dealt with this MSP or their office, you can submit a detailed account below.</p></>
            ) : (
              <><p><strong>{reviews.length} {reviews.length === 1 ? "review has" : "reviews have"} passed moderation.</strong> The rating is calculated only from the reviews visible on this page.</p><p>Reviews describe individual experiences. They do not prove how every constituent is treated.</p></>
            )}
          </InShort>

          <section className="pt-12">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div><p className="kicker mb-2 text-[var(--brand)]">Published experiences</p><h2 className="h2">What people reported</h2></div>
              <a href="#leave-review" className="btn btn-primary">Review this MSP</a>
            </div>
            {reviews.length ? (
              <div className="grid gap-5">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div><p className="ui text-[18px] font-[800] text-[var(--ink)]">{review.title}</p><p className="ui mt-2 text-[15px] text-[var(--muted)]">{review.authorName} · {review.relationship}{review.interactionDate ? <> · interaction <time dateTime={review.interactionDate}>{interactionMonth.format(new Date(`${review.interactionDate}T00:00:00Z`))}</time></> : null} · <time dateTime={review.publishedDate}>published {publishedDate.format(new Date(review.publishedDate))}</time></p></div>
                      <p className="ui rounded-full bg-[var(--action-tint)] px-4 py-2 text-[15px] font-[800] text-[var(--action)]" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                    </div>
                    <p className="mt-5 whitespace-pre-line text-[17px] leading-[1.7] text-[var(--ink-2)]">{review.body}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[var(--r-m)] border border-dashed border-[var(--rule-strong)] bg-[var(--surface-2)] p-7"><p className="text-[16px] leading-[1.6] text-[var(--ink-2)]">There is nothing to publish here yet. Empty pages do not receive a made-up zero rating and no aggregate-rating markup is emitted until at least one approved review is visible.</p></div>
            )}
          </section>

          <section id="leave-review" className="pt-16 sm:pt-20 scroll-mt-28">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div><p className="kicker mb-3 text-[var(--action)]">Add your experience</p><h2 className="h2 mb-3">Review {profile.msp.name}</h2><p className="ui mb-6 text-[15px] font-[700] text-[var(--ink)]">No account needed. Email is optional. Nothing goes live without review.</p><MspReviewForm msps={options} initialSlug={profile.slug} latestInteractionMonth={latestInteractionMonth} /></div>
              <aside className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6"><h2 className="h3 mb-3">Before you submit</h2><p className="text-[15.5px] leading-[1.6] text-[var(--ink-2)]">Keep documents and identifying case details private. Email is requested only if you opt into a possible follow-up. Nothing appears automatically.</p><p className="mt-5 border-t border-[var(--rule)] pt-5 text-[15px] leading-[1.55] text-[var(--ink-2)]">Need an official misconduct decision? <a href="https://www.parliament.scot/msps/complain-about-an-msp" target="_blank" rel="noopener noreferrer" className="font-[700] text-[var(--brand)]">Use the Scottish Parliament&apos;s complaint process ↗</a></p></aside>
            </div>
          </section>

          <div className="py-14"><Link href="/msp-reviews" className="ui text-[16px] font-[700]">← Browse all MSP reviews</Link></div>
        </ContentFrame>
      </Page>
    </>
  );
}
