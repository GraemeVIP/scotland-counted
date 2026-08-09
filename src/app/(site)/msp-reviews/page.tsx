import { ContentFrame, InShort, Page, PageHeader } from "@/components/Blocks";
import MspReviewDirectory from "@/components/MspReviewDirectory";
import MspReviewForm from "@/components/MspReviewForm";
import { getMspRating, mspReviewProfiles } from "@/lib/data/mspReviews";
import { listApprovedMspReviews } from "@/lib/mspReviewsDb";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";

const pageDescription = "Read moderated Scottish MSP reviews, rate your MSP without an account, or find the official route for a formal complaint. Email is optional.";

export const metadata = meta({
  title: "Rate My MSP | Scottish MSP Reviews",
  description: pageDescription,
  path: "/msp-reviews",
});

export const revalidate = 60;

export default async function MspReviewsPage() {
  const options = mspReviewProfiles.map((profile) => ({
    memberId: profile.msp.memberId,
    name: profile.msp.name,
    area: profile.areas.join(", "),
    slug: profile.slug,
  }));
  const reviews = await listApprovedMspReviews();
  const publishedCount = reviews.length;
  const latestInteractionMonth = new Date().toISOString().slice(0, 7);
  const directoryEntries = mspReviewProfiles.map((profile) => {
    const rating = getMspRating(reviews.filter((review) => review.memberId === profile.msp.memberId));
    return {
      memberId: profile.msp.memberId,
      slug: profile.slug,
      name: profile.msp.name,
      party: profile.msp.party,
      areas: profile.areas,
      ratingValue: rating?.ratingValue ?? null,
      reviewCount: rating?.reviewCount ?? 0,
    };
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Scottish MSP reviews", path: "/msp-reviews" }])} />
      <JsonLd data={articleJsonLd({
        headline: "Rate my MSP: Scottish MSP reviews",
        description: pageDescription,
        path: "/msp-reviews",
        keywords: ["Scottish MSP reviews", "rate my MSP", "MSP complaints", "review my MSP"],
        schemaType: "WebPage",
      })} />
      <Page>
        <PageHeader
          eyebrow="Scottish MSP reviews and complaints"
          title="Rate and review your Scottish MSP"
          lede="Read what happened when people asked a Member of the Scottish Parliament for help, or share your own firsthand experience. No account is needed and nothing is published automatically."
        >
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#leave-an-msp-review" className="btn btn-primary justify-center text-center">Rate an MSP</a>
            <a href="#find-an-msp" className="btn btn-ghost justify-center text-center">Find an MSP&apos;s reviews</a>
          </div>
          <ul aria-label="Review submission facts" className="ui mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-[650] text-[var(--ink-2)]">
            <li><span aria-hidden="true" className="mr-1.5 text-[var(--good-text)]">✓</span>No account</li>
            <li><span aria-hidden="true" className="mr-1.5 text-[var(--good-text)]">✓</span>Email optional</li>
            <li><span aria-hidden="true" className="mr-1.5 text-[var(--good-text)]">✓</span>Every review moderated</li>
          </ul>
        </PageHeader>
        <ContentFrame>
          <InShort expert={false}>
            <p><strong>This is an experience log, not a political popularity poll.</strong> Reviews must describe contact with an MSP or their office that directly affected the reviewer, someone they support or a community they represented.</p>
            <p>Nothing appears automatically. Private details are removed.</p>
          </InShort>

          <section aria-labelledby="choose-route-title" className="pt-12 sm:pt-16">
            <p className="kicker mb-3 text-[var(--brand)]">Choose the right route</p>
            <h2 id="choose-route-title" className="h2">Review an MSP or make a formal complaint?</h2>
            <p className="mt-4 max-w-[72ch] text-[17px] leading-[1.65] text-[var(--ink-2)]">They do different jobs. A Scotland Counted review creates a moderated public record of your experience. A formal complaint asks the Scottish Parliament to consider whether an MSP broke its Code of Conduct.</p>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <article className="rounded-[var(--r-m)] border border-[var(--action)] bg-[var(--action-tint)] p-6 sm:p-7">
                <p className="ui text-[15px] font-[750] uppercase tracking-[0.06em] text-[var(--action)]">Public experience review</p>
                <h3 className="h3 mt-3">Tell people what happened</h3>
                <p className="mt-3 text-[16px] leading-[1.6] text-[var(--ink-2)]">Use this when you dealt directly with an MSP or their office and want an eligible account and rating to be considered for publication.</p>
                <a href="#leave-an-msp-review" className="ui mt-5 inline-block text-[16px] font-[750] text-[var(--action)]">Leave a moderated review →</a>
              </article>
              <article className="rounded-[var(--r-m)] border border-[var(--rule-strong)] bg-[var(--surface)] p-6 sm:p-7">
                <p className="ui text-[15px] font-[750] uppercase tracking-[0.06em] text-[var(--brand)]">Official complaint</p>
                <h3 className="h3 mt-3">Ask Parliament to consider misconduct</h3>
                <p className="mt-3 text-[16px] leading-[1.6] text-[var(--ink-2)]">Use the Scottish Parliament route if you believe an MSP breached its Code of Conduct. Scotland Counted cannot investigate or decide an official complaint.</p>
                <a href="https://www.parliament.scot/msps/complain-about-an-msp" target="_blank" rel="noopener noreferrer" className="ui mt-5 inline-block text-[16px] font-[750] text-[var(--brand)]">Use Parliament&apos;s complaint process ↗</a>
              </article>
            </div>
          </section>

          <section id="leave-an-msp-review" className="scroll-mt-28 pt-14 sm:pt-18">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
              <div>
                <p className="kicker mb-3 text-[var(--action)]">Submit an experience</p>
                <h2 className="h2 mb-4">Leave an MSP review</h2>
                <p className="mb-3 max-w-[62ch] text-[17px] leading-[1.65] text-[var(--ink-2)]">Specific accounts are useful: what you asked, how long replies took, what action the office took and what happened next. A one-line insult or a rating with no story will not be published.</p>
                <p className="ui mb-7 text-[15px] font-[700] text-[var(--ink)]">No account needed. Email is optional. Nothing goes live without review.</p>
                <MspReviewForm msps={options} latestInteractionMonth={latestInteractionMonth} />
              </div>
              <aside className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 sm:p-7 lg:sticky lg:top-28">
                <h3 className="h3 mb-4">What happens after you submit?</h3>
                <ol className="grid gap-4 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  <li className="grid grid-cols-[30px_1fr] gap-3"><span aria-hidden="true" className="ui flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--brand)] text-[15px] font-[800] text-white">1</span><span><strong className="text-[var(--ink)]">It stays private.</strong> The account enters the moderation queue and is not published automatically.</span></li>
                  <li className="grid grid-cols-[30px_1fr] gap-3"><span aria-hidden="true" className="ui flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--brand)] text-[15px] font-[800] text-white">2</span><span><strong className="text-[var(--ink)]">It is checked.</strong> Firsthand relevance, useful detail, safety and private information are reviewed.</span></li>
                  <li className="grid grid-cols-[30px_1fr] gap-3"><span aria-hidden="true" className="ui flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--brand)] text-[15px] font-[800] text-white">3</span><span><strong className="text-[var(--ink)]">A decision is made.</strong> Eligible edited reviews are published; rejected submissions remain off the site.</span></li>
                </ol>
                <p className="ui mt-6 border-t border-[var(--rule)] pt-5 text-[15px] leading-[1.5] text-[var(--muted)]">{publishedCount === 0 ? "The log is new. No reviews have passed moderation yet." : `${publishedCount} approved ${publishedCount === 1 ? "review is" : "reviews are"} currently public.`}</p>
              </aside>
            </div>
          </section>

          <section id="find-an-msp" className="scroll-mt-28 pt-16 sm:pt-20">
            <p className="kicker mb-3 text-[var(--brand)]">Browse the directory</p>
            <h2 className="h2">Scottish MSP reviews and ratings</h2>
            <p className="mb-7 mt-4 max-w-[72ch] text-[17px] leading-[1.65] text-[var(--ink-2)]">Find any current constituency or regional MSP. A blank record means no review has passed moderation; it is never turned into a made-up zero rating.</p>
            <MspReviewDirectory entries={directoryEntries} />
          </section>

          <section className="py-16 sm:py-20 max-w-[780px]">
            <h2 className="h2 mb-4">When to make an official MSP complaint</h2>
            <p className="text-[17px] leading-[1.65] text-[var(--ink-2)]">Publishing an experience here does not start the Scottish Parliament&apos;s formal complaints process, overturn a decision or replace legal advice. If you believe an MSP breached the Code of Conduct, <a href="https://www.parliament.scot/msps/complain-about-an-msp" target="_blank" rel="noopener noreferrer" className="font-[700] text-[var(--brand)]">read the Scottish Parliament&apos;s complaint guidance</a>. For a disputed service or casework decision, also use the MSP office or responsible public body&apos;s own complaints route.</p>
          </section>
        </ContentFrame>
      </Page>
    </>
  );
}
