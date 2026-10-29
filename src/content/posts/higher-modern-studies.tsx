import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { scotlandPoverty } from "@/lib/data/scotland";
import { deprivationDrugDeathRates2025 } from "@/lib/data/drugDeaths";
import { shopliftingLongRun } from "@/lib/data/shoplifting";
import { COUNCIL_TAX, FUNDING_MIX } from "@/lib/data/councilBudgetMechanics";
import { formatHolyroodCheckedDate } from "@/lib/data/holyrood";
import { postPath } from "@/lib/routeMap";
import {
  HIGHER_MODERN_STUDIES as H,
  JRF_SCOTLAND_2026 as JRF,
  MODERN_STUDIES_EXAMS_2027 as EXAMS,
  MODERN_STUDIES_LINKS as LINKS,
  PHS_CHILD_POVERTY as PHS,
  holyroodSeatsByParty,
  plainPeriod,
  slashYear,
} from "@/lib/data/schools";

export default function Post() {
  const seats = holyroodSeatsByParty();
  const constituencySeats = seats.reduce((sum, row) => sum + row.constituency, 0);
  const top = seats[0];
  const listOnly = seats.filter((row) => row.constituency === 0 && row.regional > 0).sort((a, b) => b.regional - a.regional)[0];
  const period = plainPeriod(scotlandPoverty.period);
  const mostDeprived = deprivationDrugDeathRates2025[0];
  const leastDeprived = deprivationDrugDeathRates2025[deprivationDrugDeathRates2025.length - 1];
  const times = Math.round(mostDeprived.rate / leastDeprived.rate);
  const latest = shopliftingLongRun[shopliftingLongRun.length - 1];
  const preCovid = shopliftingLongRun.find((row) => row.year === "2019-20")!;
  const [grant] = FUNDING_MIX;

  return (
    <Prose>
      <Lead>
        Higher Modern Studies is worth {H.totalMarks} marks: two exam papers and an assignment. Paper
        1 tests what you know through essays, Paper 2 tests your source skills, and the assignment
        tests your research. Here&apos;s how each part works, and where to find up to date Scottish
        evidence for your answers.
      </Lead>

      <H2 id="assessment">How Higher is assessed</H2>
      <GuideTable
        kicker={`Course code ${H.code}, SCQF level ${H.scqfLevel}`}
        title="Three parts, one grade"
        columns={["Part", "Marks", "Time", "Share of your grade"]}
        align={["left", "right", "left", "right"]}
        rows={[
          ["Paper 1: extended responses", H.paper1.marks, H.paper1.duration, `${H.paper1.sharePct}%`],
          ["Paper 2: source skills", H.paper2.marks, H.paper2.duration, `${H.paper2.sharePct}%`],
          ["Assignment", H.assignment.marks, `${H.assignment.duration} to write it up`, `${H.assignment.sharePct}%`],
        ]}
        caption={`Higher Modern Studies course specification, ${H.specVersion}. The course is ${H.credits} SCQF credit points and about ${H.hours} hours of learning.`}
      />

      <H2 id="paper-1">Paper 1: the essays</H2>
      <P>
        Paper 1 has three sections: democracy in Scotland and the UK, social issues in the UK, and
        international issues. You answer one question in each. In social issues you pick social
        inequality or crime and the law, and in international issues a world power or a world issue.
        Two of your answers are worth 20 marks and one is worth 12. In the 2026 paper and the
        specimen paper, the 12 mark question was in the international section.
      </P>
      <GuideTable
        kicker="Paper 1 question types"
        title="What the command word wants"
        columns={["Command word", "Marks", "What it asks for"]}
        align={["left", "right", "left"]}
        rows={H.paper1Types.map((q) => [q.type, q.marks, q.needs])}
        caption="From the 2026 Higher Modern Studies Paper 1 marking instructions."
      />
      <P>
        In a 20 mark essay, up to {H.essay20.knowledge} marks are for knowledge and understanding, up
        to {H.essay20.analysis} for analysis, up to {H.essay20.structure} for structure and up to{" "}
        {H.essay20.conclusions} for conclusions. In a 12 mark essay, up to {H.essay12.knowledge} are
        for knowledge and the other {H.essay12.higherSkills} for analysis or evaluation. Without
        examples, the most you can get for knowledge is {H.noExampleKnowledgeCap} out of{" "}
        {H.essay20.knowledge}. That is why recent, accurate Scottish evidence matters so much here.
      </P>
      <Aside title="Learn the topic, not a set of essays">
        <p>
          The 2026 course report warned that pupils who memorise prepared essays struggle when the
          wording of the question doesn&apos;t match. It also asked for conclusions that answer the
          question, not a summary of what you already wrote.
        </p>
      </Aside>

      <H2 id="paper-2">Paper 2: the source skills</H2>
      <P>
        Paper 2 has three questions, and you answer all of them. Each one gives you sources that
        can be written, numbers, graphs or pictures.
      </P>
      <GuideTable
        kicker="Paper 2"
        title="The three source questions"
        columns={["Skill", "Marks", "Sources", "How it is worded"]}
        align={["left", "right", "left", "left"]}
        rows={H.paper2Types.map((q) => [q.skill, q.marks, q.sources, q.wording])}
        caption="Higher Modern Studies course specification and the 2026 Paper 2."
      />
      <UL>
        <LI>
          <strong>Conclusions:</strong> back every conclusion with evidence, link sources together,
          and give an overall conclusion. Leave the overall conclusion out and the most you can get
          is 8.
        </LI>
        <LI>
          <strong>Objectivity:</strong> give evidence for and against the statement, then a judgement
          on how accurate it is, such as largely accurate. Saying it is completely accurate gets no
          marks for the judgement, and vague words like partly only get some.
        </LI>
        <LI>
          <strong>Reliability:</strong> comment on each source specifically, who made it, when, how
          and whether it might be biased, then compare all three to pick the most reliable. There is
          no age cut off. An older source isn&apos;t automatically unreliable.
        </LI>
      </UL>
      <P>
        I&apos;ve written three Paper 2 style practice questions using real Scottish data on the{" "}
        <Link href="/higher-modern-studies-past-papers">Higher modern studies past papers</Link> page.
      </P>

      <H2 id="assignment">The assignment</H2>
      <P>
        You choose an issue with more than one possible answer, research it over about{" "}
        {H.assignment.researchHours} hours, then write it up as a report in{" "}
        {H.assignment.duration}, under exam conditions. You can take in your research sheet, no
        more than two sides of A4. It has to show your actual research, with each source named.
      </P>
      <GuideTable
        kicker={`${H.assignment.marks} marks`}
        title="How the assignment is marked"
        columns={["What you have to do", "Marks"]}
        align={["left", "right"]}
        rows={H.assignmentMarks.map((row) => [row.part, row.marks])}
        caption="Higher Modern Studies coursework assessment task."
      />
      <P>
        The 2026 course report said pupils who put only web addresses on their research sheet, then
        wrote from memory, could not get the analysis marks. Put the actual figures and quotes on
        the sheet, then refer to them by name in your report. You can only evaluate sources that
        appear on the sheet.
      </P>
      <P>
        Good assignment questions from this site&apos;s data include: should the Scottish Child
        Payment be increased, should council tax be replaced, or should Scotland change how it
        tackles shoplifting. Each has a clear decision to make and official evidence on both sides.
      </P>

      <H2 id="evidence">Up to date evidence for each section</H2>
      <H3>Democracy: electoral systems and holding government to account</H3>
      <P>
        The current Scottish Parliament shows the Additional Member System at work. {top.party}{" "}
        holds {top.constituency} of {constituencySeats} constituency seats but only {top.regional}{" "}
        regional.
        {listOnly ? ` ${listOnly.party} has ${listOnly.regional} MSPs, all elected from the regional lists.` : ""}{" "}
        The full table, from Scottish Parliament open data checked {formatHolyroodCheckedDate()}, is
        in the <Link href="/national-5-modern-studies#notes">National 5 notes</Link>, and it works
        just as well at Higher.
      </P>
      <P>
        For holding government to account, every MSP&apos;s page in the{" "}
        <Link href="/representatives">directory</Link> lists their committee jobs and recorded votes.
        Committees are one of the main checks on the Scottish Government, so a named convener and
        what their committee looked at is a strong example.
      </P>

      <H3>Social inequality: causes, effects and responses</H3>
      <UL>
        <LI>
          {scotlandPoverty.all.pct}% of people and {scotlandPoverty.children.pct}% of children in
          Scotland were in poverty in {period}. The <Link href="/causes-of-poverty">causes of poverty</Link>{" "}
          guide covers why: pay, housing and other costs, and social security.
        </LI>
        <LI>
          Poverty is deepening for those in it. The Joseph Rowntree Foundation found people in
          poverty had incomes {JRF.averageGapPct}% below the poverty line on average.
        </LI>
        <LI>
          Health inequalities: in 2025 the drug death rate in Scotland&apos;s most deprived areas was{" "}
          {mostDeprived.rate} per 100,000, against {leastDeprived.rate} in the least deprived. That
          is about {times} times higher. See{" "}
          <Link href={postPath("drug-deaths-scotland-deprivation")}>drug deaths and deprivation</Link>.
        </LI>
        <LI>
          Public Health Scotland found children under 16 in the lowest income households were almost
          four times as likely to have poor general health as those in the highest ({PHS.poorHealth.lowestIncomePct}%
          against {PHS.poorHealth.highestIncomePct}%, {PHS.poorHealth.year}).
        </LI>
        <LI>
          Government measures: the interim target of under {JRF.childTarget.interimPct}% child
          poverty by {JRF.childTarget.interimYear} was missed. That is strong evidence for a question
          on whether government measures have worked, balanced by the{" "}
          <Link href="/scottish-child-payment">Scottish Child Payment</Link>, which is paid only in
          Scotland.
        </LI>
        <LI>
          Local government: {grant.pence}p of every £1 councils spend on services comes from the
          Scottish Government, and every council raised council tax in 2026/27, by{" "}
          {COUNCIL_TAX.averageIncrease} on average. See{" "}
          <Link href="/council-tax-increase-scotland">council tax increase Scotland</Link>.
        </LI>
      </UL>

      <H3>Crime and the law</H3>
      <P>
        Recorded shoplifting in Scotland rose from {preCovid.shoplifting.toLocaleString("en-GB")} in{" "}
        {slashYear(preCovid.year)} to {latest.shoplifting.toLocaleString("en-GB")} in{" "}
        {slashYear(latest.year)}. The <Link href={postPath("shoplifting-scotland-record-high")}>shoplifting piece</Link>{" "}
        tests economic explanations, such as food prices, against the data, which suits a question
        on the causes of crime. The{" "}
        <Link href={postPath("glasgow-sex-crime-rise-migrants")}>Glasgow sex crime analysis</Link>{" "}
        shows how to test a claim about crime against police records, and why changes to how crime
        is recorded matter when you read the figures.
      </P>

      <H3>International issues</H3>
      <P>
        This site doesn&apos;t cover world powers or world issues, so use your class notes and the
        resources below.
      </P>

      <H2 id="bitesize">BBC Bitesize higher modern studies and other free help</H2>
      <P>
        <a href={LINKS.bitesizeHigher}>BBC Bitesize Higher Modern Studies</a> is free and covers
        democracy in Scotland and the UK, inequality, crime and the law, the USA and China as world
        powers, and underdevelopment in Africa. It is good for getting the basics straight.
      </P>
      <P>
        What it can&apos;t do is keep every figure current, and markers reward recent examples. So use
        Bitesize to learn the topic, then swap in the latest Scottish figures from this site and from
        official sources. The other free essentials are on the{" "}
        <a href={LINKS.higher}>Higher Modern Studies course page</a>: the course specification, the
        specimen papers, the coursework task and the course reports, which tell you exactly where
        pupils lost marks last year.
      </P>

      <H2 id="dates">Exam dates and grade boundaries</H2>
      <P>
        In 2027 both papers are on {EXAMS.date}. Paper 1 runs {EXAMS.higherPaper1} and Paper 2{" "}
        {EXAMS.higherPaper2}.
      </P>
      <GuideTable
        kicker={`Higher Modern Studies, ${H.results.year}`}
        title={`Marks needed out of ${H.totalMarks}`}
        columns={["Grade", "Minimum mark"]}
        align={["left", "right"]}
        rows={[
          ["A", H.results.a],
          ["B", H.results.b],
          ["C", H.results.c],
          ["D", H.results.d],
        ]}
        caption={`From the ${H.results.year} course report. ${H.results.entries.toLocaleString("en-GB")} pupils got a result and ${H.results.pctA}% got an A. Boundaries change a little each year.`}
      />

      <PostCTA
        title="Practise with past papers and real data"
        body="Where every Higher paper and marking instruction is, how to use them, and Paper 2 style questions built from official Scottish figures."
        href="/higher-modern-studies-past-papers"
        cta="Higher past papers and practice"
      />
    </Prose>
  );
}
