import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { scotlandPoverty } from "@/lib/data/scotland";
import { COUNCIL_YEARS, SCOTLAND_PCTS, councils } from "@/lib/data/councils";
import { deprivationDrugDeathRates2025 } from "@/lib/data/drugDeaths";
import { councilShoplifting, shopliftingLongRun } from "@/lib/data/shoplifting";
import {
  HIGHER_MODERN_STUDIES as H,
  JRF_SCOTLAND_2026 as JRF,
  MODERN_STUDIES_LINKS as LINKS,
  MODERN_STUDIES_PAST_PAPERS as PAST,
  QS_REPLACED_SQA,
  plainPeriod,
  slashYear,
} from "@/lib/data/schools";

/** Councils for the objectivity question: a spread of high and low on both measures. */
const SHOPLIFTING_PICKS = [
  "Dundee City",
  "City of Edinburgh",
  "Glasgow City",
  "Inverclyde",
  "Clackmannanshire",
  "East Renfrewshire",
  "Argyll and Bute",
  "Shetland Islands",
];

export default function Post() {
  const period = plainPeriod(scotlandPoverty.period);
  const year = COUNCIL_YEARS[COUNCIL_YEARS.length - 1];
  const scotlandRate = SCOTLAND_PCTS[SCOTLAND_PCTS.length - 1];
  const byRate = [...councils].sort((a, b) => b.pcts[b.pcts.length - 1] - a.pcts[a.pcts.length - 1]);
  const councilRows = [...byRate.slice(0, 3), ...byRate.slice(-3)];
  const latest = shopliftingLongRun[shopliftingLongRun.length - 1];
  const preCovid = shopliftingLongRun.find((row) => row.year === "2019-20")!;
  const first = shopliftingLongRun[0];
  const picks = councilShoplifting.filter((row) => SHOPLIFTING_PICKS.includes(row.area));

  return (
    <Prose>
      <Lead>
        Higher Modern Studies past papers are free from Qualifications Scotland, with the marking
        instructions for every year from {PAST.firstYear} to {PAST.lastYear}. Below is exactly where
        to find them, how to use them properly, and three Paper 2 style practice questions I&apos;ve
        built from real Scottish data.
      </Lead>

      <H2 id="where">SQA past papers higher modern studies: where to find them now</H2>
      <P>
        Qualifications Scotland replaced SQA on {QS_REPLACED_SQA}, but the past papers haven&apos;t
        moved. They are still on the SQA website. Go to the{" "}
        <a href={LINKS.pastPapersHigher}>Higher Modern Studies past papers page</a> and you get:
      </P>
      <UL>
        <LI>
          Paper 1 and Paper 2 for every year from {PAST.firstYear} to {PAST.lastYear}, as PDFs.
        </LI>
        <LI>The marking instructions for each paper, which show what earns marks and why.</LI>
        <LI>A button to download the whole set in one go.</LI>
      </UL>
      <P>
        Some {PAST.modifiedYears} papers are labelled modified. That means they were changed because
        of Covid disruption, for example made shorter, so they won&apos;t match the full exam you will
        sit. They&apos;re still good practice for individual questions.
      </P>
      <P>
        The specimen papers, which show the current layout with marking instructions, are on the{" "}
        <a href={LINKS.higher}>Higher Modern Studies course page</a> instead, along with the course
        reports. I don&apos;t copy any papers onto this site. Always get them from the official page so
        you have the right version.
      </P>

      <H2 id="use">How to use past papers well</H2>
      <UL>
        <LI>
          <strong>Time yourself.</strong> Paper 1 is {H.paper1.duration} for {H.paper1.marks} marks
          and Paper 2 is {H.paper2.duration} for {H.paper2.marks}. Practise at that pace at least
          once before the exam.
        </LI>
        <LI>
          <strong>Mark it with the marking instructions.</strong> Don&apos;t just check whether you
          got the content right. Look at how marks are split between knowledge, analysis, structure
          and conclusions.
        </LI>
        <LI>
          <strong>Read the course report for that year.</strong> It says which questions pupils found
          hard and the mistakes that cost them. The reports are on the course page.
        </LI>
        <LI>
          <strong>Don&apos;t memorise essays.</strong> The 2026 course report warned that prepared
          essays fall down when the question is worded differently. Practise planning answers to
          lots of questions instead.
        </LI>
        <LI>
          <strong>Update the examples.</strong> Older papers and answers will have older figures.
          Swap in the latest ones. This site keeps the Scottish figures current, with the source on
          every page.
        </LI>
      </UL>

      <H2 id="question-types">The question types and their marks</H2>
      <GuideTable
        kicker="Paper 1 and Paper 2"
        title="Every question type at Higher"
        columns={["Paper", "Question", "Marks"]}
        align={["left", "left", "right"]}
        rows={[
          ...H.paper1Types.map((q) => ["Paper 1", `${q.type}: ${q.needs}`, q.marks]),
          ...H.paper2Types.map((q) => ["Paper 2", `${q.skill}: ${q.wording}`, q.marks]),
        ]}
        caption="From the Higher Modern Studies course specification and the 2026 marking instructions. In Paper 1 you write two 20 mark answers and one 12 mark answer."
      />
      <P>
        In a 20 mark essay, up to {H.essay20.knowledge} marks are for knowledge, {H.essay20.analysis}{" "}
        for analysis, {H.essay20.structure} for structure and {H.essay20.conclusions} for
        conclusions. The <Link href="/higher-modern-studies">Higher modern studies guide</Link>{" "}
        explains each part of the course in more detail.
      </P>

      <H2 id="practice-conclusions">Practice question 1: conclusions</H2>
      <P>
        These sources use real figures. The question is written by me in the style of Paper 2. It
        isn&apos;t an official question, so there is no official marking scheme, but the hints after
        it show what a strong answer covers.
      </P>
      <GuideTable
        kicker="Source A"
        title={`Drug death rates by how deprived the area is, Scotland, 2025`}
        columns={["Area", "Deaths per 100,000 people"]}
        align={["left", "right"]}
        rows={deprivationDrugDeathRates2025.map((row) => [row.area, row.rate])}
        caption="National Records of Scotland. Rates are age standardised, so areas with older or younger populations can be compared fairly."
      />
      <GuideTable
        kicker="Source B"
        title={`Child poverty after housing costs, selected council areas, ${year}`}
        columns={["Council area", "Children in poverty"]}
        align={["left", "right"]}
        rows={[
          ...councilRows.map((c) => [c.name, `${c.pcts[c.pcts.length - 1]}%`]),
          ["Scotland", `${scotlandRate}%`],
        ]}
        caption="End Child Poverty and Loughborough University. The three highest and three lowest of Scotland's 32 councils."
      />
      <GuideTable
        kicker="Source C"
        title={`How deep poverty goes in Scotland, ${period}`}
        columns={["Measure", "Figure"]}
        align={["left", "right"]}
        rows={[
          ["People in poverty", `${scotlandPoverty.all.pct}%`],
          ["People in deep poverty", `${JRF.deepPct}%`],
          ["People in very deep poverty", `${JRF.veryDeepPct}%`],
          ["How far below the poverty line people in poverty are, on average", `${JRF.averageGapPct}%`],
          ["How far below the line people in very deep poverty are, on average", `${JRF.veryDeepGapPct}%`],
        ]}
        caption="Scottish Government poverty statistics and the Joseph Rowntree Foundation, Poverty in Scotland 2026."
      />
      <Aside title="Question (10 marks)">
        <p>Using only Sources A, B and C, what conclusions can be drawn about poverty and inequality in Scotland?</p>
        <p>You should reach a conclusion about each of the following:</p>
        <p>
          the link between deprivation and drug deaths; the differences in child poverty between
          council areas; how far below the poverty line people in poverty are.
        </p>
        <p>You should make an overall conclusion about the most serious inequality shown in the sources.</p>
      </Aside>
      <H3>What a strong answer covers</H3>
      <UL>
        <LI>
          A clear link: the death rate rises steadily with deprivation, and the most deprived fifth
          is about {Math.round(deprivationDrugDeathRates2025[0].rate / deprivationDrugDeathRates2025[deprivationDrugDeathRates2025.length - 1].rate)}{" "}
          times the least deprived. Use the steps in between, not just the two ends.
        </LI>
        <LI>
          A comparison with the Scotland figure, not just a list: which councils are well above{" "}
          {scotlandRate}% and which are well below.
        </LI>
        <LI>
          Linking sources: Source C shows many people in poverty are far below the line, which helps
          explain why the gaps in Sources A and B are so large.
        </LI>
        <LI>
          An overall conclusion that makes a judgement, not a summary of the three bullets.
        </LI>
      </UL>

      <H2 id="practice-objectivity">Practice question 2: objectivity</H2>
      <GuideTable
        kicker="Source A"
        title="Shoplifting recorded by the police in Scotland"
        columns={["Year", "Crimes recorded"]}
        align={["left", "right"]}
        rows={[first, preCovid, ...shopliftingLongRun.slice(-3)].map((row) => [slashYear(row.year), row.shoplifting.toLocaleString("en-GB")])}
        caption={`Scottish Government, Recorded Crime in Scotland. ${slashYear(latest.year)} is the highest in the series, which starts in ${slashYear(first.year)}.`}
      />
      <GuideTable
        kicker="Source B"
        title={`Shoplifting and child poverty in selected council areas`}
        columns={["Council area", `Shoplifting per 10,000 people, ${slashYear(latest.year)}`, `Child poverty, ${year}`]}
        align={["left", "right", "right"]}
        rows={picks.map((row) => [row.area, row.rate2025, `${row.childPoverty2023}%`])}
        caption="Recorded Crime in Scotland and End Child Poverty. Sorted from the highest shoplifting rate to the lowest."
      />
      <Aside title="Question (10 marks)">
        <p>
          Using only Sources A and B, to what extent is it accurate to state that shoplifting is
          highest in the parts of Scotland with the most child poverty?
        </p>
        <p>You must make an overall judgement on the extent of the accuracy of the statement.</p>
      </Aside>
      <H3>What a strong answer covers</H3>
      <UL>
        <LI>
          Evidence for: some councils with high child poverty also have high shoplifting rates. Find
          them and link the two columns.
        </LI>
        <LI>
          Evidence against: the council with the most child poverty in Source B does not have the
          highest shoplifting rate, and the City of Edinburgh has less child poverty than Clackmannanshire but a
          far higher shoplifting rate.
        </LI>
        <LI>
          Source A sets the scene: shoplifting across Scotland is at its highest in the series, but
          the question is about where, so use it to frame the answer, not as your main evidence.
        </LI>
        <LI>
          A judgement with a size to it, such as &ldquo;only partly accurate&rdquo; backed by your strongest
          evidence. The marking warns against absolute answers and vague ones like &ldquo;to an extent&rdquo;.
        </LI>
      </UL>

      <H2 id="practice-reliability">Practice question 3: reliability</H2>
      <P>
        These are three real sources this site uses. Read the descriptions, then answer the
        question.
      </P>
      <GuideTable
        kicker="Sources A, B and C"
        title="Three sources on poverty in Scotland"
        columns={["Source", "Who made it", "How the figures were produced", "Date"]}
        rows={[
          [
            "A: Poverty and Income Inequality in Scotland",
            "Scottish Government statisticians",
            "Official statistics from a large national household survey, averaged over three years",
            "March 2026",
          ],
          [
            "B: Poverty in Scotland 2026",
            "Joseph Rowntree Foundation, a charity that campaigns to end poverty",
            "Analysis of the official statistics, plus its own public attitudes survey and interviews",
            JRF.published,
          ],
          [
            "C: Local child poverty estimates",
            "End Child Poverty, a coalition of charities, with Loughborough University",
            "Estimates for each council area worked out by university researchers from official data",
            `Covers years up to ${year}`,
          ],
        ]}
      />
      <Aside title="Question (8 marks)">
        <p>To what extent are Sources A, B and C reliable?</p>
        <p>You must provide an overall conclusion on the most reliable source of information.</p>
      </Aside>
      <H3>What a strong answer covers</H3>
      <UL>
        <LI>
          Something specific about each source: who made it, how, and whether it could be biased.
          A charity that campaigns on poverty may choose what to emphasise, but its figures can come
          from official data.
        </LI>
        <LI>
          Method, not just author: a three year average from a big survey is steadier than a single
          year; estimates for small areas are less certain than national figures.
        </LI>
        <LI>
          Date, explained properly: say why the age matters for this topic, rather than assuming
          older means worse. The 2026 course report is clear there is no cut off.
        </LI>
        <LI>
          An overall conclusion that compares all three, not just praise for the one you pick.
        </LI>
      </UL>
      <Aside title="Practise the essays too">
        <p>
          A few Paper 1 style questions to plan with real evidence: To what extent is low pay the
          main cause of poverty in Scotland? Government measures have failed to reduce health
          inequalities. Discuss. To what extent does the Additional Member System produce fair
          representation in Scotland? The <Link href="/causes-of-poverty">causes of poverty</Link>{" "}
          guide and the <Link href="/higher-modern-studies#evidence">Higher evidence section</Link>{" "}
          have figures for all three.
        </p>
      </Aside>

      <PostCTA
        title="Get the official papers"
        body={`Every Higher Modern Studies paper and marking instruction from ${PAST.firstYear} to ${PAST.lastYear}, free from Qualifications Scotland.`}
        href={LINKS.pastPapersHigher}
        cta="Open the past papers page"
      />
    </Prose>
  );
}
