import Link from "next/link";
import { Page, ContentFrame, PageHeader, SectionHead, CTA } from "@/components/Blocks";
import { GuideTable } from "@/components/GuideTable";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";
import { N5_PAST_PAPER_FILES } from "@/lib/data/schools";

/**
 * The page for teachers: the one link the school outreach email points at.
 *
 * A teacher deciding whether to share a site with pupils wants five answers
 * quickly: is it free, what fits my course, can I trust the figures, is it
 * balanced, and what happens to my pupils' data. Each has its own section, in
 * that order. Everything said about privacy is what the site actually does.
 */

export const metadata = meta({
  title: "Modern Studies Teaching Resources: Free Scottish Data for Class",
  description:
    "Free Modern Studies teaching resources: current Scottish data mapped to the National 5 and Higher course, past papers to download, model answers and practice questions.",
  path: "/modern-studies-teaching-resources",
});

const COURSE_MAP: Array<[string, Array<[string, string]>]> = [
  [
    "Democracy in Scotland and the UK",
    [
      ["Who is my MSP", "/who-is-my-msp"],
      ["All 129 MSPs and how they voted", "/representatives/msps"],
      ["Who decides what: Holyrood, Westminster or council", "/who-decides"],
      ["How to contact an MP or MSP", "/blog/how-to-contact-your-mp-or-msp"],
      ["Best council in Scotland, all 32 ranked", "/best-council-in-scotland"],
    ],
  ],
  [
    "Social issues: social inequality",
    [
      ["Poverty in Scotland", "/poverty-in-scotland"],
      ["Causes of poverty", "/causes-of-poverty"],
      ["UK poverty line in pounds", "/uk-poverty-line"],
      ["In work poverty", "/in-work-poverty-scotland"],
      ["Scottish Child Payment", "/scottish-child-payment"],
      ["Minimum wage and Real Living Wage", "/minimum-wage-scotland"],
      ["Life expectancy in Glasgow", "/life-expectancy-glasgow"],
      ["Drug deaths and deprivation", "/blog/drug-deaths-scotland-deprivation"],
      ["Every council area compared", "/areas"],
    ],
  ],
  [
    "Social issues: crime and the law",
    [
      ["Crime rate in Glasgow", "/crime-rate-glasgow"],
      ["Shoplifting in Scotland", "/blog/shoplifting-scotland-record-high"],
      ["Unemployment in Scotland", "/unemployment-scotland"],
    ],
  ],
];

export default function TeachingResourcesPage() {
  const years = N5_PAST_PAPER_FILES.map((p) => p.year);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Modern Studies", path: "/modern-studies" },
          { name: "Teaching resources", path: "/modern-studies-teaching-resources" },
        ])}
      />
      <Page>
        <PageHeader
          eyebrow="For teachers"
          title="Modern Studies teaching resources: free, current Scottish data"
          lede="Up to date Scottish figures for your classes, mapped to the course, with past papers, model answers and practice questions. Free, no ads, and no sign up for you or your pupils."
        />
        <ContentFrame>
          <section className="pb-12">
            <SectionHead eyebrow="Why it helps" title="Textbooks date. This does not." />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ["Current figures", "Every page shows when it was last updated and when its figures were checked. Poverty, pay, crime and health figures are the latest official releases."],
                ["Every figure sourced", "Each number links to the official source it came from, so pupils can practise judging reliability on real evidence."],
                ["Built for the exam", "Course guides, model answers and source questions in the style of the National 5 and Higher papers, using real Scottish data."],
              ].map(([title, body]) => (
                <div key={title} className="tile p-5">
                  <p className="ui text-[17px] font-[600]">{title}</p>
                  <p className="mt-2 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pb-12">
            <SectionHead eyebrow="Course map" title="What fits each part of the course" />
            <GuideTable
              title="Pages on this site by area of study"
              columns={["Area of study", "Pages"]}
              rows={COURSE_MAP.map(([area, pages]) => [
                area,
                <span key={area} className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {pages.map(([label, href]) => (
                    <Link key={href} href={href}>
                      {label}
                    </Link>
                  ))}
                </span>,
              ])}
              caption="International issues (world powers and world issues) is not covered yet. If you would find it useful, tell me which topics and I will prioritise them."
            />
          </section>

          <section className="pb-12">
            <SectionHead eyebrow="Exam preparation" title="Papers, guides and practice" />
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["National 5 past papers to download", "/nat-5-modern-studies-past-papers", `Every paper and its marking instructions, ${years[years.length - 1]} to ${years[0]}, one tap each on a phone.`],
                ["Higher past papers and practice questions", "/higher-modern-studies-past-papers", "Where to find the papers, the question types and their marks, and three practice source questions."],
                ["National 5 Modern Studies guide", "/national-5-modern-studies", "How the course is assessed, revision notes and model answers."],
                ["Higher Modern Studies guide", "/higher-modern-studies", "The essays, the source skills and current evidence for each section."],
                ["Advanced Higher Modern Studies", "/advanced-higher-modern-studies", "The dissertation, research methods and where to find good data."],
                ["Poverty in Scotland quiz", "/poverty-in-scotland-quiz", "Six questions on real figures. A quick starter: most classes get them wrong."],
                ["Plain English glossary", "/glossary", "Every technical term on the site in ordinary words."],
                ["Charts to download", "/press", "Charts and figures you can drop into slides, with the source attached."],
              ].map(([title, href, body]) => (
                <li key={href}>
                  <Link href={href} className="tile group block h-full p-5 no-underline">
                    <span className="ui block text-[17px] font-[600] text-[var(--ink)] group-hover:text-[var(--action-text)]">{title}</span>
                    <span className="mt-1.5 block text-[15px] leading-[1.5] text-[var(--ink-2)]">{body}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="pb-12 max-w-[760px]">
            <SectionHead eyebrow="Ideas for class" title="Ways teachers use it" />
            <ul className="mt-6 grid gap-3 text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              <li><strong className="text-[var(--ink)]">Your own area.</strong> Pupils put in the school postcode and compare child poverty, pay and life expectancy with the rest of Scotland.</li>
              <li><strong className="text-[var(--ink)]">Source skills.</strong> The practice questions use real tables, so pupils can check their conclusions against the official source afterwards.</li>
              <li><strong className="text-[var(--ink)]">Who is responsible.</strong> The who decides page shows which parliament or council controls each policy, a clear way into democracy questions.</li>
              <li><strong className="text-[var(--ink)]">Assignment research.</strong> Every figure has its source linked, which suits the research and evaluation the assignment and dissertation need.</li>
            </ul>
          </section>

          <section className="pb-12 max-w-[760px]">
            <SectionHead eyebrow="Trust" title="Balance, accuracy and your pupils" />
            <div className="mt-6 grid gap-4 text-[16.5px] leading-[1.65] text-[var(--ink-2)]">
              <p>
                <strong className="text-[var(--ink)]">Balance.</strong> Scotland Counted is independent
                and has no party, campaign or funder behind it. Pages keep official figures separate from
                interpretation, and where responsibility is described it is about which government holds
                the power, not which party deserves blame. Some investigations cover sensitive subjects
                such as sexual crime and drug deaths, so please read a page before sharing it with a
                class.
              </p>
              <p>
                <strong className="text-[var(--ink)]">Accuracy.</strong> Figures come from official
                sources such as the Scottish Government, National Records of Scotland, the ONS and
                Qualifications Scotland. Mistakes are fixed and logged publicly on the{" "}
                <Link href="/corrections">corrections page</Link>, and the{" "}
                <Link href="/methods">methods page</Link> explains how every figure was worked out.
              </p>
              <p>
                <strong className="text-[var(--ink)]">Pupils.</strong> There are no accounts, no sign
                up and no personal details needed to use anything on the site. Visits are measured with
                Google Analytics and Microsoft Clarity; the <Link href="/privacy">privacy page</Link>{" "}
                explains exactly what they record.
              </p>
              <p className="text-[15px] text-[var(--muted)]">
                Past papers and marking instructions © Qualifications Scotland (formerly SQA), reproduced
                in support of its qualifications on a non commercial basis.
              </p>
            </div>
          </section>

          <CTA
            title="Tell me what would help your classes"
            body={`A topic you need data for, a mistake, or an idea for a resource. I read everything sent to ${site.contactEmail}.`}
            href="/contact"
            cta="Get in touch"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
