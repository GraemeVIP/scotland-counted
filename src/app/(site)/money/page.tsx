import Link from "next/link";
import { Page, ContentFrame, PageHeader, InShort, SectionHead, CTA, Card } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import Faq from "@/components/Faq";

/**
 * The money hub.
 *
 * Everything about a household's own money was scattered: two calculators in
 * different corners of the menu and thirteen explainers filed under a blog
 * category nobody browses. A visitor who wants to know what they keep, what
 * their council tax costs and why their energy bill moved had no single place
 * to stand.
 *
 * Organised by the task a person arrives with, not by the type of content.
 * Someone does not think "I need a calculator", they think "how much do I
 * actually keep". The tools and the explainers that answer the same question
 * sit together for that reason.
 */

export const metadata = meta({
  title: "Your Money in Scotland: Pay, Council Tax and Bills",
  description:
    "Work out your take-home pay on Scottish tax rates, check your council tax by band, and understand Universal Credit, rent help, energy and food costs in plain English.",
  path: "/money",
});

/** The five things people actually arrive wanting to do. */
const TASKS = [
  {
    href: "/take-home-pay-calculator-scotland",
    eyebrow: "Calculator",
    title: "Work out what I keep",
    body: "Scottish income tax, National Insurance, pension and student loan, worked out on the figures for this tax year. Nothing you type leaves your browser.",
    meta: "Take-home pay",
  },
  {
    href: "/council-tax-bands-scotland",
    eyebrow: "Calculator",
    title: "Check what my council tax costs",
    body: "Every band in all 32 councils, with the Scottish Water charges shown separately, and what it rose by this year.",
    meta: "Council tax by band",
  },
  {
    href: "/blog/universal-credit-when-you-work-more-hours",
    eyebrow: "Explainer",
    title: "Understand what happens if I work more hours",
    body: "Why an extra shift does not always leave you better off, and how much of each extra pound you actually keep.",
    meta: "Universal Credit",
  },
  {
    href: "/blog/crisis-grant-scotland-how-to-apply",
    eyebrow: "Explainer",
    title: "Find help with rent or an emergency",
    body: "Crisis Grants, Discretionary Housing Payments and what to do when the rent help does not cover the rent.",
    meta: "Emergency help",
  },
  {
    href: "/blog/why-is-the-cost-of-living-so-high",
    eyebrow: "Explainer",
    title: "Understand why a bill has risen",
    body: "Energy, food and the gap between falling inflation and prices that stay where they are.",
    meta: "Cost of living",
  },
];

/** Grouped so the reader can find the one that matches their situation. */
const GROUPS = [
  {
    id: "pay",
    title: "Pay and wages",
    intro: "What you earn, what you keep, and how the two differ.",
    items: [
      { href: "/take-home-pay-calculator-scotland", label: "Take-home pay calculator", blurb: "What you keep on Scottish tax rates" },
      { href: "/blog/minimum-wage-take-home-pay-scotland-2026", label: "Minimum wage in Scotland", blurb: "What full-time work at the legal minimum actually pays" },
      { href: "/blog/real-living-wage-vs-minimum-wage-scotland", label: "Real Living Wage versus minimum wage", blurb: "One is the law, one is voluntary. What separates them" },
      { href: "/blog/universal-credit-when-you-work-more-hours", label: "Universal Credit and extra hours", blurb: "Why more work does not always mean more money" },
    ],
  },
  {
    id: "bills",
    title: "Bills and housing",
    intro: "The costs that arrive whether or not the money is there.",
    items: [
      { href: "/council-tax-bands-scotland", label: "Council tax by band", blurb: "All 32 councils, water charges shown separately" },
      { href: "/blog/how-council-tax-works-scotland", label: "How council tax works", blurb: "Bands, discounts and the help most people miss" },
      { href: "/blog/council-tax-rises-scotland-2026-27", label: "What council tax rose by this year", blurb: "Every council, and what it means for a Band D bill" },
      { href: "/blog/local-housing-allowance-rent-shortfall-scotland", label: "Local Housing Allowance", blurb: "Why rent help often falls short of the rent" },
      { href: "/blog/energy-price-cap-scotland-2026-explained", label: "The energy price cap", blurb: "What the cap is, and what it does not cap" },
    ],
  },
  {
    id: "help",
    title: "Help you may be entitled to",
    intro: "Payments and grants that exist, and how to apply for them.",
    items: [
      { href: "/blog/what-is-the-scottish-child-payment", label: "Scottish Child Payment", blurb: "How much it is and who can get it" },
      { href: "/blog/crisis-grant-scotland-how-to-apply", label: "Crisis Grants", blurb: "Emergency money, and how to apply" },
      { href: "/blog/discretionary-housing-payment-scotland", label: "Discretionary Housing Payments", blurb: "Help with a rent shortfall" },
      { href: "/blog/free-school-meals-clothing-grant-scotland", label: "Free school meals and clothing grants", blurb: "What schools provide, and how to claim it" },
    ],
  },
  {
    id: "prices",
    title: "Why prices are what they are",
    intro: "The explanations behind the numbers on your bills.",
    items: [
      { href: "/blog/why-is-the-cost-of-living-so-high", label: "Why the cost of living is still so high", blurb: "The longer answer, with the figures" },
      { href: "/blog/why-food-prices-stay-high-when-inflation-falls", label: "Why food prices stay high", blurb: "Falling inflation does not mean falling prices" },
    ],
  },
];

const FAQ = [
  {
    q: "Does the take-home pay calculator send my salary anywhere?",
    a: "No. It runs entirely in your browser. Nothing you type is sent to a server, stored or logged, and there is no account to create.",
  },
  {
    q: "Why is my council tax bill higher than the figure shown?",
    a: "The council tax figures separate the council's charge from Scottish Water's charges for water and waste water, because they are set by different bodies. Your bill combines them. Both numbers are shown on the council tax pages so you can see which is which.",
  },
  {
    q: "Do Scottish income tax rates differ from the rest of the UK?",
    a: "Yes. The Scottish Parliament sets income tax rates and bands on earnings for Scottish taxpayers, and they differ from the rest of the UK. National Insurance is not devolved and is the same everywhere. The calculator uses the Scottish rates.",
  },
];

export default function MoneyHub() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Your money", path: "/money" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <Page>
        <PageHeader
          eyebrow="Your money"
          title="What you earn, what you keep and what it costs"
          lede="Two calculators and a set of plain-English answers about pay, council tax, benefits and bills in Scotland. Everything you type into a calculator stays in your browser."
        />

        <ContentFrame>
          <InShort expert={false}>
            <p>
              Pick the thing you actually came to find out. The calculators do the sums for
              you. The explainers answer the questions the sums raise.
            </p>
            <p>
              Every figure links to the official source it came from, and the tax year it
              applies to is always on the page.
            </p>
          </InShort>

          <section className="pt-12">
            <SectionHead eyebrow="Start here" title="What do you want to work out?" />
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {TASKS.map((task) => (
                <Card
                  key={task.href}
                  href={task.href}
                  eyebrow={task.eyebrow}
                  title={task.title}
                  body={task.body}
                  meta={task.meta}
                />
              ))}
            </div>
          </section>

          {GROUPS.map((group) => (
            <section key={group.id} id={group.id} className="pt-14 scroll-mt-24">
              <h2 className="h2 mb-2">{group.title}</h2>
              <p className="max-w-[64ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
                {group.intro}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block h-full rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--brand)]"
                    >
                      <strong className="block text-[17px] leading-[1.35]">{item.label}</strong>
                      <span className="mt-1.5 block text-[15.5px] leading-[1.5] text-[var(--ink-2)]">
                        {item.blurb}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <Faq items={FAQ} className="pt-14" />

          <CTA
            title="Your bill went up. Someone decided that."
            body="Council tax is set by your council. Income tax bands are set at Holyrood. Universal Credit is set at Westminster. Find out which one to write to, and what to say."
            href="/who-decides"
            cta="See who decides what"
            secondaryHref="/areas"
            secondaryCta="See the figures where you live"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
