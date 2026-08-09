import Link from "next/link";
import { ContentFrame, Page, PageHeader } from "@/components/Blocks";
import { getMspReviewProfile } from "@/lib/data/mspReviews";
import { meta } from "@/lib/seo";

export const metadata = {
  ...meta({
    title: "Review Submission Received",
    description: "Confirmation that an MSP review has entered the private moderation queue.",
    path: "/msp-reviews/submitted",
  }),
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default async function ReviewSubmittedPage({
  searchParams,
}: {
  searchParams: Promise<{ msp?: string; status?: string }>;
}) {
  const { msp, status } = await searchParams;
  const profile = msp ? getMspReviewProfile(msp) : undefined;
  const failed = status === "error";

  return (
    <Page>
      <PageHeader
        eyebrow={failed ? "Submission not completed" : "Submission received"}
        title={failed ? "Your review was not saved" : "Your review is safely in the moderation queue"}
        lede={failed
          ? "Something stopped the submission from being saved. Please return to the form and try again."
          : `Thank you${profile ? ` for sharing your experience with ${profile.msp.name}` : " for sharing your experience"}. Nothing has been published automatically.`}
      />
      <ContentFrame className="pb-16 sm:pb-20">
        <div
          role={failed ? "alert" : "status"}
          className={`max-w-[780px] rounded-[var(--r-m)] border border-[var(--rule)] border-t-[4px] bg-[var(--surface)] p-7 sm:p-9 ${failed ? "border-t-[var(--bad)]" : "border-t-[var(--good)]"}`}
        >
          {failed ? (
            <>
              <h2 className="h3 mb-3">Please try once more</h2>
              <p className="text-[16px] leading-[1.65] text-[var(--ink-2)]">No partial review is published. If the problem continues, contact Scotland Counted and explain that the review form would not submit.</p>
            </>
          ) : (
            <>
              <h2 className="h3 mb-3">What happens next</h2>
              <p className="text-[16px] leading-[1.65] text-[var(--ink-2)]">The account will be checked for a genuine, direct interaction and for private or unsafe details. It will appear publicly only if it passes moderation.</p>
              <p className="mt-4 text-[16px] leading-[1.65] text-[var(--ink-2)]">If you opted into follow-up, Scotland Counted may email you when the account could support a fuller public-interest article. Otherwise, no contact email was collected.</p>
            </>
          )}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {profile && (
              <Link href={`/msp-reviews/${profile.slug}`} className="btn btn-primary justify-center text-center">
                Return to {profile.msp.name}&apos;s reviews
              </Link>
            )}
            <Link href="/msp-reviews" className="btn btn-ghost justify-center text-center">
              Browse all MSP reviews
            </Link>
          </div>
        </div>
      </ContentFrame>
    </Page>
  );
}
