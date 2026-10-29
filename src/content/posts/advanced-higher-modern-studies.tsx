import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { postPath } from "@/lib/routeMap";
import {
  ADVANCED_HIGHER_MODERN_STUDIES as AH,
  JRF_SCOTLAND_2026 as JRF,
  MODERN_STUDIES_EXAMS_2027 as EXAMS,
  MODERN_STUDIES_LINKS as LINKS,
} from "@/lib/data/schools";

export default function Post() {
  const words = AH.dissertation.words.toLocaleString("en-GB");
  return (
    <Prose>
      <Lead>
        Advanced Higher Modern Studies is worth {AH.totalMarks} marks: a {AH.paper.duration} exam
        worth {AH.paper.marks} and a {words} word dissertation worth {AH.dissertation.marks}. It is
        the closest school gets to a university social science course, and the dissertation lives or
        dies on good data. This guide covers the course, then where to find that data and how to
        judge it.
      </Lead>

      <H2 id="assessment">How it is assessed</H2>
      <GuideTable
        kicker={`Course code ${AH.code}, SCQF level ${AH.scqfLevel}`}
        title="Two parts, one grade"
        columns={["Part", "Marks", "Length", "Share of your grade"]}
        align={["left", "right", "left", "right"]}
        rows={[
          ["Exam (question paper)", AH.paper.marks, AH.paper.duration, `${AH.paper.sharePct}%`],
          ["Project dissertation", AH.dissertation.marks, `${words} words`, `${AH.dissertation.sharePct}%`],
        ]}
        caption={`Advanced Higher Modern Studies course specification, ${AH.specVersion}. The course is ${AH.credits} SCQF credit points and about ${AH.hours} hours of learning.`}
      />

      <H2 id="exam">The exam</H2>
      <P>
        You choose one of three sections and answer questions from that section only. Each section
        has two parts:
      </P>
      <UL>
        <LI>
          <strong>Part A:</strong> two {AH.essayMarks} mark extended responses, from a choice of
          three.
        </LI>
        <LI>
          <strong>Part B:</strong> two questions you must both answer, one{" "}
          {AH.researchMethodsMarks} mark question on research methods and one {AH.sourceTrustMarks}{" "}
          mark question on how trustworthy a source is.
        </LI>
      </UL>
      <GuideTable
        kicker="Choose one section"
        title="The three sections and their topics"
        columns={["Section", "Topics"]}
        rows={AH.sections.map((section) => [section.name, section.topics.join("; ")])}
        caption="Advanced Higher Modern Studies course specification."
      />
      <P>
        In topics A to C you compare the UK, including Scotland, with other countries, and you
        choose which countries. Topic D, research methods, is the same in every section. It covers
        official statistics, surveys, interviews, focus groups, observation, case studies and
        longitudinal studies, and how to judge sources made with each.
      </P>

      <H2 id="dissertation">The dissertation</H2>
      <P>
        You choose a complex, current political or social issue and research it independently. The
        word count is {words}, including the main body and your evaluation of research methods, but
        not the contents page, bibliography, footnotes or appendices. Go more than{" "}
        {AH.dissertation.penaltyOverPct}% over and a penalty applies.
      </P>
      <GuideTable
        kicker={`${AH.dissertation.marks} marks`}
        title="How the dissertation is marked"
        columns={["What you have to do", "Marks"]}
        align={["left", "right"]}
        rows={AH.dissertationMarks.map((row) => [row.part, row.marks])}
        caption="Advanced Higher Modern Studies coursework assessment task, version 1.1, September 2024."
      />
      <P>
        Qualifications Scotland publishes an approved list of dissertation titles on the{" "}
        <a href={LINKS.advancedHigher}>course page</a>, along with a form for checking your own
        title. The 2026 course report said pupils who built their own titles often wrote insightful
        dissertations on current issues, and asked schools to support that.
      </P>

      <H2 id="data">Where to find data</H2>
      <P>
        Using a wide range of sources is worth marks, and so is evaluating them. Below are the
        official sources I use on this site, what each one is good for, and its main weakness. The
        weakness is the part that earns you evaluation marks, so don&apos;t skip it.
      </P>
      <GuideTable
        kicker="Official and expert sources"
        title="What each source is good for, and its catch"
        columns={["Source", "Good for", "The catch", "On this site"]}
        rows={[
          [
            "Scottish Government, Poverty and Income Inequality in Scotland",
            "Poverty rates for Scotland by age and family type",
            "Built on a household survey, so it is not reliable for single councils, and single years jump about",
            <Link key="l" href="/poverty-in-scotland">Poverty in Scotland</Link>,
          ],
          [
            "End Child Poverty and Loughborough University",
            "Child poverty for every council and constituency",
            "Estimates worked out from official data, not direct counts",
            <Link key="l" href="/areas">Area pages</Link>,
          ],
          [
            "National Records of Scotland, drug related deaths",
            "Deaths by deprivation, age and council",
            "Rates are age standardised: right for comparing places, but you have to explain what that means",
            <Link key="l" href={postPath("drug-deaths-scotland-deprivation")}>Drug deaths</Link>,
          ],
          [
            "Recorded Crime in Scotland",
            "Crimes recorded by the police, by type and council",
            "Only counts crime that is reported and recorded, so changes to recording can move the figures",
            <Link key="l" href={postPath("shoplifting-scotland-record-high")}>Shoplifting</Link>,
          ],
          [
            "Local Government Benchmarking Framework",
            "Council costs and performance on the same measures",
            "Councils differ in size, rurality and deprivation, so compare like with like",
            <Link key="l" href="/best-council-in-scotland">Best council</Link>,
          ],
          [
            "Audit Scotland, council budgets",
            "Where council money comes from and the budget gaps",
            "Councils work out their gaps differently, so comparisons need care",
            <Link key="l" href="/councils">Council records</Link>,
          ],
          [
            "Scottish Household Survey",
            "What residents think of their council and area",
            "Samples for each council are small, so small differences may just be chance",
            <Link key="l" href="/best-council-in-scotland">Best council</Link>,
          ],
          [
            "Scottish and UK Parliament open data",
            "Who MSPs and MPs are, their roles and their votes",
            "A vote shows what happened, not why a member voted that way",
            <Link key="l" href="/representatives">MPs and MSPs</Link>,
          ],
          [
            "Joseph Rowntree Foundation, Poverty in Scotland",
            "Who is in poverty and why, plus public attitudes",
            "A charity that campaigns against poverty: careful analysis, but it argues for change",
            <Link key="l" href="/causes-of-poverty">Causes of poverty</Link>,
          ],
        ]}
        caption="Every page on this site lists its sources in full, with links to the originals. Cite the original, not this site, wherever you can."
      />

      <H2 id="research-methods">Real examples for research methods questions</H2>
      <P>
        Part B rewards specific examples. Generic points about surveys being biased don&apos;t go
        far. Here are three real ones from Scottish data.
      </P>
      <H3>A survey that got better, and broke its own trend</H3>
      <P>
        Scotland&apos;s poverty figures come from the Family Resources Survey. The Joseph Rowntree
        Foundation explains that the Department for Work and Pensions now checks what people say
        about their benefits against its own records, because benefits used to be undercounted. The
        figures are more accurate, but they can&apos;t be compared directly with the old series. A
        neat example of reliability improving while comparison over time gets harder.
      </P>
      <H3>Why one year can mislead</H3>
      <P>
        On the new data, the single year child poverty rate was{" "}
        {JRF.singleYearChildPoverty.map((row) => `${row.pct}% in ${row.year}`).join(", ")}. The
        JRF says single year figures like these should be read with extreme caution, which is why it
        uses three year averages. That is a clear case for discussing sample size and why survey
        results bounce around.
      </P>
      <H3>Lived experience alongside statistics</H3>
      <P>
        The JRF&apos;s 2026 report combined official statistics with a representative survey of adults
        and research with people who have lived experience of poverty. It is a good example of mixed
        methods: the numbers show how big a problem is, the lived experience shows why, and each
        covers a weakness in the other.
      </P>
      <Aside title="Using this site as a source">
        <p>
          You can, but treat it like any secondary source. It is an independent site run by one
          person, not a government body. Every figure links to the official original and the{" "}
          <Link href="/methods">methods page</Link> explains every calculation, which helps
          reliability. For a dissertation, go to the original wherever you can and cite that.
        </p>
      </Aside>

      <H2 id="results">Results and the 2027 exam</H2>
      <GuideTable
        kicker={`Advanced Higher Modern Studies, ${AH.results.year}`}
        title={`Marks needed out of ${AH.totalMarks}`}
        columns={["Grade", "Minimum mark"]}
        align={["left", "right"]}
        rows={[
          ["A", AH.results.a],
          ["B", AH.results.b],
          ["C", AH.results.c],
          ["D", AH.results.d],
        ]}
        caption={`From the ${AH.results.year} course report. ${AH.results.entries.toLocaleString("en-GB")} pupils got a result and ${AH.results.pctA}% got an A.`}
      />
      <P>
        The 2027 exam is on {EXAMS.date}, {EXAMS.advancedHigher}. The course specification, specimen
        paper, coursework task and course reports are all on the{" "}
        <a href={LINKS.advancedHigher}>Advanced Higher Modern Studies course page</a>, and past papers
        from 2022 are on the <a href={LINKS.pastPapersAdvancedHigher}>past papers page</a>.
      </P>

      <PostCTA
        title="Start with the poverty evidence"
        body="Social inequality is the most data rich section. The causes of poverty guide sets out the official evidence with Scottish figures and sources you can follow back."
        href="/causes-of-poverty"
        cta="Causes of poverty"
      />
    </Prose>
  );
}
