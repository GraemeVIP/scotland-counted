import Link from "next/link";
import { Page, ContentFrame, PageHeader, SectionHead } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { HUBS, hubColor } from "@/lib/data/navigation";
import { posts } from "@/lib/data/posts";
import { postPath } from "@/lib/routeMap";
import { SOCIAL_SECURITY_SCOTLAND as SSS } from "@/lib/data/benefits";

/**
 * The benefits front door.
 *
 * The Benefits menu section needed somewhere to land. Each guide is shown with
 * its answer, the rate or the date, so a reader can see at a glance which one
 * is theirs before opening it.
 */

export const metadata = meta({
  title: "Benefits in Scotland: What You Can Claim, How Much and When",
  description:
    "Adult Disability Payment, Carer Support Payment, Scottish Child Payment, Best Start Grant, winter payments and crisis grants, with this year's rates and how to apply.",
  path: "/benefits",
});

const hub = HUBS.find((h) => h.id === "benefits")!;
const byPath = new Map(posts.map((post) => [postPath(post.slug), post]));

export default function BenefitsPage() {
  const color = hubColor(hub.id);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Benefits", path: "/benefits" },
        ])}
      />
      <Page>
        <PageHeader
          eyebrow="Benefits in Scotland"
          title="Benefits in Scotland"
          lede="What you can claim, how much it is this year and when it is paid. Each guide gives you the answer first, then how to apply."
        />
        <ContentFrame>
          {hub.groups.map((group) => (
            <section key={group.heading} className="pb-12">
              <SectionHead eyebrow={hub.label} title={group.heading} />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 mt-5">
                {group.items.map((item) => {
                  const post = byPath.get(item.href);
                  const answer = post?.quickAnswer;
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
                      {post && <span className="text-[15px] leading-[1.5] text-[var(--ink-2)]">{post.standfirst}</span>}
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
                Social Security Scotland will talk it through with you for free on{" "}
                <a href={SSS.phoneHref}>{SSS.phone}</a>, {SSS.hours}. For DWP benefits like Universal
                Credit and State Pension, Citizens Advice Scotland can check everything you are owed in
                one go.
              </p>
              <p className="mt-3 text-[16.5px]">
                <Link href="/social-security-scotland-payment-dates">Social Security Scotland payment dates</Link>
                {" · "}
                <Link href="/crisis-grant-phone-number">Crisis grant numbers for every council</Link>
              </p>
            </div>
          </section>
        </ContentFrame>
      </Page>
    </>
  );
}
