import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, SectionHead } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";

export const metadata = meta({
  title: "About Scotland Counted: Independent Scottish Public Data",
  description:
    "Scotland Counted is a non-profit organisation set up to demystify the official data published by Scottish governmental organisations and make it plain and accessible for everyone.",
  path: "/about",
});

const WHAT_IT_DOES = [
  {
    title: "Pay, tax and household bills",
    body: "Compare Scotland's six income tax bands with England, calculate exact take home pay, work out Scottish LBTT (Stamp Duty) on a home move, check minimum wage and Real Living Wage rates, and see official Scotland bank holiday dates.",
    links: [
      { href: "/take-home-pay-calculator-scotland", label: "Take home pay calculator" },
      { href: "/tax-bands-scotland", label: "Scottish tax bands" },
      { href: "/lbtt-calculator-scotland", label: "LBTT calculator" },
      { href: "/scotland-bank-holidays", label: "Scotland bank holidays" },
    ],
  },
  {
    title: "Council tax across all 32 councils",
    body: "Every council sets its own rates, and Scottish Water charges arrive on the same bill even though most tables leave them out. Scotland Counted shows Band A to H monthly and yearly totals with water included, plus discounts and reductions.",
    links: [
      { href: "/council-tax-bands-scotland", label: "All 32 councils" },
      { href: "/glasgow-council-tax-bands", label: "Glasgow bands" },
      { href: "/edinburgh-council-tax-bands", label: "Edinburgh bands" },
      { href: "/single-person-discount-council-tax-scotland", label: "Single person discount" },
    ],
  },
  {
    title: "Scottish benefits and winter support",
    body: "Plain English guides to devolved Scottish payments, eligibility rules, helpline numbers and early bank holiday payment dates, covering Adult Disability Payment, Carer Support Payment, Scottish Child Payment, Winter Heating Payment and Crisis Grants.",
    links: [
      { href: "/benefits", label: "All Scottish benefits" },
      { href: "/winter-heating-payment", label: "Winter Heating Payment" },
      { href: "/social-security-scotland-payment-dates", label: "Payment dates" },
      { href: "/crisis-grant-phone-number", label: "Crisis grant numbers" },
    ],
  },
  {
    title: "Your local area, SIMD and council records",
    body: "Look up any Scottish postcode's official SIMD deprivation decile, compare any two of Scotland's 32 council areas side by side on crime, house prices, rent, pay and schools, and read sourced council budget and audit records.",
    links: [
      { href: "/simd-postcode-checker", label: "SIMD postcode checker" },
      { href: "/compare-areas", label: "Compare two areas" },
      { href: "/councils", label: "All 32 council records" },
      { href: "/best-place-to-live-in-scotland", label: "Area rankings" },
    ],
  },
  {
    title: "Representatives and who decides what",
    body: "Find your Westminster MP, constituency MSP and all seven regional MSPs from one postcode, see how devolution splits power between London, Holyrood and local councils, and inspect voting records and public timelines.",
    links: [
      { href: "/who-is-my-msp", label: "Who is my MSP" },
      { href: "/representatives", label: "MPs and MSPs directory" },
      { href: "/who-decides", label: "Who decides what" },
      { href: "/blog/operation-branchform-snp-money-timeline", label: "Operation Branchform timeline" },
    ],
  },
  {
    title: "Free Modern Studies resources for schools",
    body: "Up to date Scottish statistics, course guides, past paper help and classroom data packs built for National 5, Higher and Advanced Higher Modern Studies teachers and pupils across Scotland.",
    links: [
      { href: "/modern-studies", label: "Modern Studies hub" },
      { href: "/national-5-modern-studies", label: "National 5 guide" },
      { href: "/higher-modern-studies", label: "Higher guide" },
      { href: "/modern-studies-teaching-resources", label: "For teachers" },
    ],
  },
];

const PRINCIPLES = [
  {
    title: "Primary sources only",
    body: "Every figure comes straight from the body that published it, including the Scottish Government, Revenue Scotland, Social Security Scotland, the ONS, DWP, Police Scotland, Audit Scotland and the Scottish Parliament. Sources are linked beside the numbers so anyone can check the original table.",
  },
  {
    title: "Plain English over bureaucracy",
    body: "Official releases are often buried across hundreds of spreadsheets, technical PDFs and jargon-heavy press notices. Scotland Counted translates those numbers into clear tables, interactive lookups and everyday language without dumbing down the facts.",
  },
  {
    title: "No political party, no paywall",
    body: "Scotland Counted is completely independent of every political party, campaign group and government body. Every party comes off badly somewhere in the official record, and every council and government is measured on the exact same basis.",
  },
  {
    title: "Transparent methods and corrections",
    body: "When official figures are derived, combined or ranked, the method is published in full. Every data update and confirmed correction is logged publicly with dates.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="About Scotland Counted"
          title="Making Scottish public data plain and accessible for everyone"
          lede="Scotland Counted is an independent non-profit organisation set up to demystify the official data published by Scottish governmental organisations, councils and public bodies, turning complex spreadsheets and policy announcements into clear tools and plain English guides anyone can use."
        />

        <ContentFrame as="section" className="pt-4">
          <div className="max-w-[68ch] space-y-5 text-[18px] leading-[1.65] text-[var(--ink-2)]">
            <p>
              Scottish public bodies publish vast amounts of important data every month on tax
              bands, council budgets, poverty, crime, wages, benefits and local services. Almost
              none of it is presented in a way ordinary households can quickly understand or act on.
            </p>
            <p>
              Too often, finding a straight answer means digging through dozens of government PDFs,
              spreadsheets with different dates, or partisan spin from political press offices.
              Scotland Counted exists to close that gap by gathering the primary records in one
              place, showing the exact sources, and building free calculators and local lookups on
              top of them.
            </p>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Everything on the site"
            title="What Scotland Counted covers"
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {WHAT_IT_DOES.map((item) => (
              <article
                key={item.title}
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-7"
              >
                <h3 className="text-[21px] font-[620] text-[var(--ink)]">{item.title}</h3>
                <p className="mt-3 text-[16px] leading-[1.6] text-[var(--ink-2)]">{item.body}</p>
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
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Editorial standards"
            title="How the figures are kept honest"
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {PRINCIPLES.map((item) => (
              <div
                key={item.title}
                className="border-t-2 border-[var(--ink)] pt-4"
              >
                <h3 className="text-[20px] font-[620] text-[var(--ink)]">{item.title}</h3>
                <p className="mt-2.5 text-[16px] leading-[1.6] text-[var(--ink-2)]">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--rule)] pt-6 text-[16px] font-[580]">
            <Link href="/methods">Read our methods and sources →</Link>
            <Link href="/data">Download open datasets →</Link>
            <Link href="/updates">See the public update log →</Link>
            <Link href="/corrections">View the corrections log →</Link>
          </div>
        </ContentFrame>
      </Page>
    </>
  );
}
