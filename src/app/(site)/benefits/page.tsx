import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, HeaderFacts, SectionHead } from "@/components/Blocks";
import { meta } from "@/lib/seo";
import { HUBS, hubColor } from "@/lib/data/navigation";
import { posts } from "@/lib/data/posts";
import { postPath } from "@/lib/routeMap";
import { SOCIAL_SECURITY_SCOTLAND as SSS } from "@/lib/data/benefits";
import Breadcrumbs from "@/components/Breadcrumbs";

/**
 * The benefits front door.
 *
 * The Benefits menu section needed somewhere to land. Each guide is shown with
 * its answer, the rate or the date, so a reader can see at a glance which one
 * is theirs before opening it.
 */

export const metadata = meta({
  title: "Benefits in Scotland 2026/27: Rates & How to Claim",
  description:
    "Adult Disability Payment, Carer Support Payment, Scottish Child Payment, Best Start Grant, winter payments and crisis grants, with this year's rates and how to apply.",
  path: "/benefits",
});

const hub = HUBS.find((h) => h.id === "benefits")!;
const byPath = new Map(posts.map((post) => [postPath(post.slug), post]));
const STATIC_GUIDES: Record<string, { value: string; unit: string; standfirst: string }> = {
  "/where-to-apply-scotland": {
    value: "24",
    unit: "direct official forms",
    standfirst:
      "Search and jump straight to the real official form for benefits, sight loss, bus passes, grants, and free help.",
  },
  "/benefit-or-crisis-grant-rejected-scotland": {
    value: "50% to 60%",
    unit: "SPSO reviews overturned",
    standfirst:
      "Exact deadlines, overturn rates, SPSO and VoiceAbility phone numbers, and copyable review wording.",
  },
  "/sight-loss-scotland": {
    value: "£3,250",
    unit: "tax allowance",
    standfirst:
      "Sight loss data, large text dark mode, 2026/27 tax savings, bus pass rules and phone numbers.",
  },
  "/disability-support-scotland": {
    value: "52% to 54%",
    unit: "first ADP claims denied",
    standfirst:
      "Real ADP approval odds, wait times, 2026/27 rates, free form help and work rights.",
  },
  "/struggling-right-now-scotland": {
    value: "52% to 89%",
    unit: "Crisis Grant rates",
    standfirst:
      "Pick your council for Crisis Grant odds, cash help you may miss, and free debt advice.",
  },
  "/suicide-scotland-statistics-and-support": {
    value: "703",
    unit: "deaths in 2025",
    standfirst:
      "Free 24/7 Scottish crisis phone lines upfront, plus official Scottish data and local help.",
  },
  "/warm-home-discount-scotland": {
    value: "£150",
    unit: "off power bill",
    standfirst:
      "Paid automatically for Pension Credit and some disability homes, or apply via your supplier.",
  },
};

/**
 * Three weekly rates for the page header, read from the same guide answers
 * the cards below show, so the two can never disagree.
 */
const allItems = hub.groups.flatMap((g) => g.items);
const HEADER_FACTS = ["/adult-disability-payment", "/carer-support-payment", "/scottish-child-payment"].flatMap(
  (href) => {
    const item = allItems.find((i) => i.href === href);
    const answer = byPath.get(href)?.quickAnswer;
    return item && answer?.value
      ? [{ value: answer.value, label: answer.unit ? `${item.label}, ${answer.unit}` : item.label }]
      : [];
  },
);

export default function BenefitsPage() {
  const color = hubColor(hub.id);
  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Benefits", path: "/benefits" },
        ]} />
      <Page>
        <PageHeader
          eyebrow="Benefits in Scotland"
          title="Benefits in Scotland"
          lede="See what you can claim, what it pays, and when it lands. Each guide gives the plain fact first, then how to claim."
          panel={
            HEADER_FACTS.length > 0 ? (
              <HeaderFacts label="This year's rates" items={HEADER_FACTS} />
            ) : undefined
          }
        />
        <ContentFrame>
          {hub.groups.map((group) => (
            <section key={group.heading} className="pb-12">
              <SectionHead eyebrow={hub.label} title={group.heading} />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 mt-5">
                {group.items.map((item) => {
                  const post = byPath.get(item.href);
                  const staticGuide = STATIC_GUIDES[item.href];
                  const answer = post?.quickAnswer ?? staticGuide;
                  const summary = post?.standfirst ?? staticGuide?.standfirst;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="tile group flex flex-col gap-2 p-5 no-underline"
                    >
                      <span className="ui text-[18px] font-[600] leading-[1.3] text-[var(--ink)] group-hover:text-[var(--action-text)] transition-colors">
                        {item.label}
                      </span>
                      {answer?.value && (
                        <span className="ui text-[15.5px] text-[var(--ink-2)]">
                          <span className="font-[640] tnum" style={{ color }}>
                            {answer.value}
                          </span>
                          {answer.unit ? ` ${answer.unit}` : ""}
                        </span>
                      )}
                      {summary && <span className="text-[15px] leading-[1.5] text-[var(--ink-2)]">{summary}</span>}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}

          <section className="pb-6">
            <div className="tile p-6 sm:p-7 max-w-[760px]">
              <p className="ui text-[19px] font-[600]">Not sure what you can get?</p>
              <p className="mt-2 text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
                Call free on <a href={SSS.phoneHref}>{SSS.phone}</a> ({SSS.hours}). Staff can talk
                you through Scottish claims. For UK wide claims like Universal Credit or State
                Pension, a local advice office can check your full list for free.
              </p>
              <p className="mt-3 text-[16.5px]">
                <Link href="/social-security-scotland-payment-dates">Payment dates</Link>
                {" · "}
                <Link href="/crisis-grant-phone-number">Council Crisis Grant numbers</Link>
              </p>
            </div>
          </section>
        </ContentFrame>
      </Page>
    </>
  );
}
