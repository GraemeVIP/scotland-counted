import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, HeaderFacts, SectionHead, CTA } from "@/components/Blocks";
import { GuideTable } from "@/components/GuideTable";
import { meta } from "@/lib/seo";
import { site } from "@/lib/site";
import { N5_PAST_PAPER_FILES } from "@/lib/data/schools";
import { classroomLessonPath, classroomLessons } from "@/lib/data/classroom";
import Breadcrumbs from "@/components/Breadcrumbs";

/**
 * The page for teachers: the one link the school outreach email points at.
 *
 * A teacher deciding whether to share a site with pupils wants five answers
 * quickly: is it free, what fits my course, can I trust the figures, is it
 * balanced, and what happens to my pupils' data. Each has its own section, in
 * that order. Everything said about privacy is what the site actually does.
 */

export const metadata = meta({
  title: "Modern Studies Teaching Resources: Free Scottish Data",
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
      ["SIMD postcode checker and council rankings", "/simd-postcode-checker"],
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
  [
    "International issues: world powers and world issues",
    [
      ["World Power (USA): poverty and health gaps", "/classroom/world-power-usa-inequality"],
      ["World Issue: global poverty and international aid", "/classroom/world-issue-global-development"],
      ["International test scores: Scotland vs OECD (PISA)", "/classroom/compare-education-systems"],
    ],
  ],
];

export default function TeachingResourcesPage() {
  const years = N5_PAST_PAPER_FILES.map((p) => p.year);
  const coursePages = COURSE_MAP.reduce((total, [, pages]) => total + pages.length, 0);
  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Modern Studies", path: "/modern-studies" },
          { name: "Teaching resources", path: "/modern-studies-teaching-resources" },
        ]} />
      <Page>
        <PageHeader
          eyebrow="For teachers"
          title="Free Modern Studies lessons and teaching resources"
          lede="Give pupils a real source and clear questions. Every lesson has a printable worksheet, answers and a quick check of what pupils learnt."
          panel={
            <HeaderFacts
              items={[
                { value: String(classroomLessons.length), label: "classroom lessons with teacher notes." },
                { value: "35 to 45", label: "minutes to teach each lesson." },
                {
                  value: String(years.length),
                  label: `years of National 5 past papers, ${years[years.length - 1]} to ${years[0]}.`,
                },
              ]}
            />
          }
        />
        <ContentFrame>
          <section id="lesson-packs" className="pb-12 scroll-mt-28" aria-labelledby="lesson-packs-title">
            <h2 id="lesson-packs-title" className="h2">Classroom lessons</h2>
            <p className="mt-3 max-w-[68ch] text-[17px] leading-relaxed text-[var(--ink-2)]">
              Open a lesson on phones, laptops or the class board. Pupils get real Scottish data,
              quick checks and a print ready worksheet. Teachers get a timer, model answers and a
              class tally.
            </p>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {classroomLessons.map((lesson) => {
                const path = classroomLessonPath(lesson.slug);
                return (
                  <li key={lesson.slug} className="tile flex flex-col p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="ui text-[13.5px] font-[700] uppercase tracking-[0.04em] text-[var(--brand)]">
                        {lesson.topic}
                      </span>
                      <span className="shrink-0 rounded-full bg-[var(--paper-2)] px-2.5 py-0.5 text-[13px] font-[700] text-[var(--ink)]">
                        {lesson.heroStat.value}
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-[21px] font-[680] leading-[1.2]">{lesson.title}</h3>
                    <p className="mt-2.5 flex-1 text-[16px] leading-relaxed text-[var(--ink-2)]">
                      {lesson.summary}
                    </p>
                    <p className="mt-4 text-[14px] font-[550] text-[var(--muted)]">
                      {lesson.level} · {lesson.minutes} mins
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--rule)] pt-4">
                      {/* Document links keep main-site scripts out of classroom worksheets. */}
                      <a
                        href={path}
                        aria-label={`Open pupil lesson: ${lesson.title}`}
                        className="inline-flex items-center rounded-full bg-[var(--action)] px-3.5 py-2 text-[14.5px] font-[680] text-white no-underline hover:bg-[var(--action-hover)]"
                      >
                        Open lesson →
                      </a>
                      <a
                        href={`${path}/teacher`}
                        aria-label={`Teacher notes: ${lesson.title}`}
                        className="inline-flex items-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] px-3.5 py-2 text-[14.5px] font-[650] text-[var(--ink)] no-underline hover:border-[var(--brand)]"
                      >
                        Teacher notes
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
          <section className="pb-12">
            <SectionHead eyebrow="Why it helps" title="Textbooks date. This does not." />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ["Current figures", "Every page shows its update date. Poverty, pay, crime and health pages use the latest official releases."],
                ["Every figure sourced", "Each fact links to its source. Pupils can practise checking real evidence."],
                ["Built for the exam", "Course guides, model answers and source checks in the National 5 and Higher style."],
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
              caption="Covers all three core National 5 and Higher Modern Studies units: Democracy, Social Issues, and International Issues."
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
              <li><strong className="text-[var(--ink)]">Your own area.</strong> Pupils enter the school postcode. They compare local poverty, pay and health with Scotland.</li>
              <li><strong className="text-[var(--ink)]">Source skills.</strong> Tests use real tables. Pupils check their answers against the real source.</li>
              <li><strong className="text-[var(--ink)]">Who decides.</strong> Our guide names who runs each service. It fits democracy units well.</li>
              <li><strong className="text-[var(--ink)]">Research tasks.</strong> Every fact links to its source. Pupils can cite and check data easily.</li>
            </ul>
          </section>

          <section className="pb-12 max-w-[760px]">
            <SectionHead eyebrow="Trust" title="Balance, accuracy and your pupils" />
            <div className="mt-6 grid gap-4 text-[16.5px] leading-[1.65] text-[var(--ink-2)]">
              <p>
                <strong className="text-[var(--ink)]">Why it exists.</strong> Scotland Counted puts
                public data in plain words. Anyone can read it. You do not need a degree to check
                your council or parliament. <Link href="/about">Read more about us</Link>.
              </p>
              <p>
                <strong className="text-[var(--ink)]">Balance.</strong> No party runs or funds this
                site. There are no ads and no paywall. Facts sit separate from notes. We show who
                has power to act. Check pages on hard topics like crime and drug deaths before class.
              </p>
              <p>
                <strong className="text-[var(--ink)]">Accuracy.</strong> Data comes from official
                bodies like the Scottish Government and ONS. We log fixes on the{" "}
                <Link href="/corrections">corrections page</Link>. Our{" "}
                <Link href="/methods">methods page</Link> shows every sum.
              </p>
              <p>
                <strong className="text-[var(--ink)]">Pupils.</strong> No account is needed. No sign
                up is asked for. Site stats run without personal names, and typed boxes stay
                hidden. See our <Link href="/privacy">privacy page</Link> for full details.
              </p>
              <p id="teacher-pilot" className="scroll-mt-28">
                <strong className="text-[var(--ink)]">Teacher feedback.</strong> Used a lesson
                in class? <Link href="/contact">Tell us how it went</Link> so we can make these
                pages better.
              </p>
              <p className="text-[15px] text-[var(--muted)]">
                Past papers and marking instructions © Qualifications Scotland (formerly SQA), reproduced
                in support of its qualifications on a non commercial basis.
              </p>
            </div>
          </section>

          <CTA
            title="Check every official dataset behind these lessons"
            body="Download clean CSV tables, verify the primary Scottish Government and ONS sources, or explore our full methods."
            href="/data"
            cta="Browse open data"
            secondaryHref="/methods"
            secondaryCta="Methods and sources"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
