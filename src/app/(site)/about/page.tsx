import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, SectionHead, HeaderPanel } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import { G } from "@/components/Glossary";
import { meta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = meta({
  title: "About Scotland Counted: Public Data Anyone Can Read",
  description:
    "Scotland Counted puts official Scottish data in plain words anyone can read. No political spin, no side taken, and every fact links back to its source.",
  path: "/about",
});

/** The three promises, shown beside the headline. */
const PROMISES = [
  { title: "Plain words", body: "Written so anyone can read it. No degree needed." },
  { title: "No side taken", body: "Every party is held to the same test." },
  { title: "Every fact sourced", body: "Each number links back to where it came from." },
];

const RULES = [
  {
    title: "Straight from the source",
    body: "Every figure comes from the body that published it, such as the Scottish Government, the ONS, IPSA or the Scottish Parliament. Each one links to the original, so you can check it yourself.",
  },
  {
    title: "Facts, not opinion",
    body: "We report what the records show. We do not tell you how to vote or what to think. If something is a sum we worked out, we say how we did it.",
  },
  {
    title: "Same test for everyone",
    body: "No party, campaign or government body pays for or steers this site. If the facts look bad for a party, we say so, whichever party it is.",
  },
  {
    title: "Open about mistakes",
    body: "If we get something wrong, we fix it in public. Every fix and every update is logged with the date.",
  },
];

const WHAT_IT_COVERS = [
  {
    title: "Pay, tax and bills",
    body: "See what you take home, how Scotland's income tax bands work, the minimum wage and what a house move costs in tax.",
    links: [
      { href: "/take-home-pay-calculator-scotland", label: "Take home pay" },
      { href: "/tax-bands-scotland", label: "Tax bands" },
      { href: "/lbtt-calculator-scotland", label: "LBTT calculator" },
    ],
  },
  {
    title: "Council tax",
    body: "Every band for all 32 councils, with water charges included, plus the discounts and help you might be missing.",
    links: [
      { href: "/council-tax-bands-scotland", label: "All 32 councils" },
      { href: "/single-person-discount-council-tax-scotland", label: "Single person discount" },
      { href: "/mansion-tax-scotland", label: "Mansion tax" },
    ],
  },
  {
    title: "Benefits and help",
    body: "Plain guides to Scottish payments: who can get them, how much they pay, when they are paid and who to call.",
    links: [
      { href: "/benefits", label: "All benefits" },
      { href: "/warm-home-discount-scotland", label: "Warm Home Discount" },
      { href: "/social-security-scotland-payment-dates", label: "Payment dates" },
    ],
  },
  {
    title: "Your area",
    body: "Put in a postcode to see how your area compares on pay, poverty, crime, homes and schools, and what your council promised.",
    links: [
      { href: "/compare-areas", label: "Compare two areas" },
      { href: "/simd-postcode-checker", label: "SIMD checker" },
      { href: "/councils", label: "Council records" },
    ],
  },
  {
    title: "MPs, MSPs and expenses",
    body: "Find who represents you, how they voted, what they claimed on expenses and what gifts and donations they declared.",
    links: [
      { href: "/representatives", label: "Find your MP and MSPs" },
      { href: "/mp-expenses-scotland", label: "MP expenses" },
      { href: "/blog/category/politics-explained", label: "Investigations" },
    ],
  },
  {
    title: "Modern Studies for schools",
    body: "Up to date Scottish figures, course guides and past paper help for National 5, Higher and Advanced Higher.",
    links: [
      { href: "/modern-studies", label: "Modern Studies" },
      { href: "/higher-modern-studies-past-papers", label: "Past papers" },
      { href: "/modern-studies-teaching-resources", label: "For teachers" },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]} />

      <Page>
        <PageHeader
          eyebrow="About Scotland Counted"
          title="Public data anyone can read"
          lede="We take the official figures on your money, your council, your area and the people you vote for, and put them in plain words. No spin. No side taken. Every fact links back to where it came from."
          panel={
            <HeaderPanel label="Our three promises">
              <ul className="divide-y divide-[var(--rule)]">
                {PROMISES.map((p) => (
                  <li key={p.title} className="flex items-baseline gap-3 py-3 first:pt-0 last:pb-0">
                    <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--brand)]" />
                    <span>
                      <span className="block text-[18px] font-[620] text-[var(--ink)]">{p.title}</span>
                      <span className="block text-[15.5px] leading-[1.5] text-[var(--ink-2)]">{p.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </HeaderPanel>
          }
        />

        {/* WHY WE BUILT IT */}
        <ContentFrame as="section" className="pt-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div className="min-w-0">
              <SectionHead eyebrow="Why we built it" title="You should not need a degree to understand your own country" />
              <p className="mt-6 border-l-4 border-[var(--brand)] pl-5 text-[22px] font-[560] leading-[1.4] text-[var(--ink)]">
                How clever you are, or what you studied, should never stop you knowing the facts.
              </p>
            </div>
            <div className="min-w-0 space-y-5 text-[18px] leading-[1.65] text-[var(--ink-2)]">
              <p>
                <ExplainText>
                  Scotland&apos;s public bodies publish a huge amount of data. It tells you where
                  your money goes, how your council is doing and what your MP claimed. But most of it
                  is written for experts. To read it, you almost need a degree in finance or politics.
                </ExplainText>
              </p>
              <p>
                <ExplainText>
                  So most people get their facts from the papers. Many papers take a side. They pick
                  the numbers that suit them, leave out the rest and put their own spin on it. Without
                  noticing, you end up seeing things the way the paper wants you to. It&apos;s
                  called political bias.
                </ExplainText>
              </p>
              <p>
                <ExplainText>
                  We strip all of that out. We report the data and the facts, not opinions. We take
                  no side, and every party is judged by the same test. Every claim we make is{" "}
                </ExplainText>
                <G t="objective">objective</G>
                <ExplainText>
                  {" "}and can be traced back to its source, so you never have to take our word for it.
                </ExplainText>
              </p>
            </div>
          </div>
        </ContentFrame>

        {/* PLAIN WORDS AND THE SQUIGGLES */}
        <ContentFrame as="section" className="pt-16">
          <div className="grid items-center gap-10 rounded-[var(--r-l)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8 lg:grid-cols-2 lg:gap-14 lg:p-10">
            <div className="min-w-0">
              <SectionHead eyebrow="How the site is written" title="Plain words, on purpose" />
              <div className="mt-5 space-y-4 text-[17.5px] leading-[1.65] text-[var(--ink-2)]">
                <p>
                  <ExplainText>
                    Every page on this site is written so anyone can read it. We use short
                    sentences and everyday words, so the facts are quick to find and easy to
                    follow.
                  </ExplainText>
                </p>
                <p>
                  <ExplainText>
                    Some words can&apos;t be avoided. When you see a word with a dotted line under it,
                    hover over it, or tap it on a phone. A short explanation pops up, so you never
                    have to leave the page to understand it.
                  </ExplainText>
                </p>
              </div>
            </div>
            <div className="min-w-0 rounded-[var(--r-m)] bg-[var(--surface-2)] p-6 sm:p-7">
              <p className="label mb-3">Try it</p>
              <p className="text-[21px] leading-[1.6] text-[var(--ink)]">
                Housing in Scotland is <G t="devolved">devolved</G>, but most benefits are{" "}
                <G t="reserved">reserved</G>. Every figure comes from a{" "}
                <G t="primary-source">primary source</G>.
              </p>
              <p className="mt-4 text-[15px] leading-[1.5] text-[var(--muted)]">
                Hover over, or tap, any word with a dotted line.
              </p>
            </div>
          </div>
        </ContentFrame>

        {/* OUR RULES */}
        <ContentFrame as="section" className="pt-16">
          <SectionHead eyebrow="Our rules" title="How we keep the facts honest" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RULES.map((item) => (
              <div key={item.title} className="border-t-2 border-[var(--ink)] pt-4">
                <h3 className="text-[19px] font-[620] text-[var(--ink)]">{item.title}</h3>
                <p className="mt-2.5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                  <ExplainText>{item.body}</ExplainText>
                </p>
              </div>
            ))}
          </div>
        </ContentFrame>

        {/* WHAT IT COVERS */}
        <ContentFrame as="section" className="pt-16">
          <SectionHead eyebrow="Everything on the site" title="What you can find here" />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WHAT_IT_COVERS.map((item) => (
              <article
                key={item.title}
                className="flex flex-col rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6"
              >
                <h3 className="text-[20px] font-[620] text-[var(--ink)]">{item.title}</h3>
                <p className="mt-2.5 flex-1 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                  <ExplainText>{item.body}</ExplainText>
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--rule)] pt-4 text-[14.5px] font-[560]">
                  {item.links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label} →
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-4 border-t border-[var(--rule)] pt-8 text-[16px] font-[580] sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/methods">How we count everything →</Link>
            <Link href="/data">Download the data →</Link>
            <Link href="/updates">What changed and when →</Link>
            <Link href="/corrections">Corrections log →</Link>
          </div>
        </ContentFrame>
      </Page>
    </>
  );
}
