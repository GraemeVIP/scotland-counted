import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { G } from "@/components/Glossary";
import { scotlandPoverty } from "@/lib/data/scotland";
import { COUNCIL_YEARS, councils } from "@/lib/data/councils";
import { scotlandVsEnglandWales, shopliftingLongRun } from "@/lib/data/shoplifting";
import { formatHolyroodCheckedDate, holyroodRegions } from "@/lib/data/holyrood";
import { postPath } from "@/lib/routeMap";
import {
  JRF_SCOTLAND_2026 as JRF,
  MODERN_STUDIES_EXAMS_2027 as EXAMS,
  MODERN_STUDIES_LINKS as LINKS,
  N5_MODERN_STUDIES as N5,
  holyroodSeatsByParty,
  plainPeriod,
  slashYear,
} from "@/lib/data/schools";

export default function Post() {
  const seats = holyroodSeatsByParty();
  const constituencySeats = seats.reduce((sum, row) => sum + row.constituency, 0);
  const regionalSeats = seats.reduce((sum, row) => sum + row.regional, 0);
  const totalSeats = constituencySeats + regionalSeats;
  const majority = Math.floor(totalSeats / 2) + 1;
  const top = seats[0];
  const listOnly = seats.filter((row) => row.constituency === 0 && row.regional > 0).sort((a, b) => b.regional - a.regional)[0];

  const period = plainPeriod(scotlandPoverty.period);
  const year = COUNCIL_YEARS[COUNCIL_YEARS.length - 1];
  const byRate = [...councils].sort((a, b) => b.pcts[b.pcts.length - 1] - a.pcts[a.pcts.length - 1]);
  const highest = byRate[0];
  const lowest = byRate[byRate.length - 1];
  const rateOf = (c: (typeof councils)[number]) => c.pcts[c.pcts.length - 1];

  const latest = shopliftingLongRun[shopliftingLongRun.length - 1];
  const preCovid = shopliftingLongRun.find((row) => row.year === "2019-20")!;
  const latestRate = scotlandVsEnglandWales[scotlandVsEnglandWales.length - 1];

  const partTime = JRF.work.find((row) => row.family.startsWith("Only part time"))!;
  const allFullTime = JRF.work.find((row) => row.family.startsWith("Everyone"))!;
  const privateRenters = JRF.tenure.find((row) => row.home === "Private renters")!;
  const mortgage = JRF.tenure.find((row) => row.home === "Own with a mortgage")!;

  return (
    <Prose>
      <Lead>
        National 5 Modern Studies is worth {N5.totalMarks} marks: an exam worth {N5.paper.marks} and
        an assignment worth {N5.assignment.marks}. Here&apos;s how it works in plain English, with
        revision notes and model answers that use real, recent Scottish figures you can put
        straight into an answer.
      </Lead>

      <H2 id="course">How the course is assessed</H2>
      <GuideTable
        kicker={`Course code ${N5.code}, SCQF level ${N5.scqfLevel}`}
        title="The two parts of your grade"
        columns={["Part", "Marks", "Time", "Share of your grade"]}
        align={["left", "right", "left", "right"]}
        rows={[
          ["Exam (question paper)", N5.paper.marks, N5.paper.duration, `${N5.paper.sharePct}%`],
          ["Assignment", N5.assignment.marks, `${N5.assignment.duration} to write it up`, `${N5.assignment.sharePct}%`],
        ]}
        caption={`National 5 Modern Studies course specification, ${N5.specVersion}. The course is ${N5.credits} SCQF credit points and about ${N5.hours} hours of learning.`}
      />
      <P>
        Your grade, A to D, comes from your total across both parts. In {N5.results.year} you
        needed {N5.results.a} out of {N5.totalMarks} for an A, {N5.results.b} for a B,{" "}
        {N5.results.c} for a C and {N5.results.d} for a D. Those boundaries move a little each year
        depending on how hard the paper was, so treat them as a guide, not a promise.
      </P>

      <H2 id="exam">What is in the exam</H2>
      <P>The paper has three sections, and you answer one option in each.</P>
      <UL>
        {N5.sections.map((section) => (
          <LI key={section.name}>
            <strong>{section.name}:</strong> {section.choice}.
          </LI>
        ))}
      </UL>
      <P>
        In each section you answer three knowledge questions and one source question. The knowledge
        questions are worth 4, 6 and either 6 or 8 marks, and one section has the 8 mark question.
        The source question at the end of each section is worth 10 marks.
      </P>
      <GuideTable
        kicker="Five question types"
        title="What each question asks for"
        columns={["The question starts", "Marks", "What the marking rules say"]}
        align={["left", "right", "left"]}
        rows={N5.questionTypes.map((q) => [q.type, q.marks, q.rule])}
        caption={`From the National 5 specimen paper (August 2025) and its marking instructions. In every source question you must use all the sources: two sources caps you at ${N5.sourceRule.twoSourcesMax} marks and one at ${N5.sourceRule.oneSourceMax}.`}
      />
      <Aside title="Read the question twice">
        <p>
          If a question says give a maximum of three reasons, give three. The course specification
          says only the best two or three points get credit, so a fourth is time you could spend on
          the next question. And if it asks you to explain, describing alone won&apos;t get the
          marks.
        </p>
      </Aside>

      <H2 id="assignment">The assignment</H2>
      <P>
        You pick any Modern Studies topic about a current political, social or international issue.
        You research it over about {N5.assignment.researchHours} hours, then write it up in{" "}
        {N5.assignment.duration}, in one sitting, under exam conditions. The only thing you can take
        in is your research sheet: two single sided sheets of A4 that show your own research. It
        can&apos;t be a plan, and copying straight from it gets no marks.
      </P>
      <GuideTable
        kicker={`${N5.assignment.marks} marks`}
        title="How the assignment is marked"
        columns={["What you have to do", "Marks"]}
        align={["left", "right"]}
        rows={N5.assignmentMarks.map((row) => [row.part, row.marks])}
        caption="National 5 Modern Studies coursework assessment task. An appropriate Modern Studies topic earns no marks itself, but without one you can't reach the rest."
      />
      <P>
        Half the marks are for evaluating your research methods, so pick methods you can say
        something real about: a survey you ran, an interview, or a table of official statistics you
        found. Then say what was good and bad about each one, specifically. General comments about
        surveys that don&apos;t mention your own survey get nothing.
      </P>
      <H3>Assignment topics that work well with data from this site</H3>
      <UL>
        <LI>
          Should the Scottish Child Payment be increased? Start with the{" "}
          <Link href="/scottish-child-payment">Scottish Child Payment</Link> and{" "}
          <Link href="/causes-of-poverty">causes of poverty</Link> pages.
        </LI>
        <LI>
          Why is child poverty higher in some council areas than others? Every council has its own
          page under <Link href="/areas">your area</Link>.
        </LI>
        <LI>
          Is the cost of living behind the rise in shoplifting? The{" "}
          <Link href={postPath("shoplifting-scotland-record-high")}>shoplifting</Link> piece has
          council by council figures.
        </LI>
        <LI>
          How well do MSPs represent their constituents? Use the{" "}
          <Link href="/representatives">MSP directory</Link> and{" "}
          <Link href="/msp-reviews">MSP reviews</Link>.
        </LI>
        <LI>
          Should councils raise council tax to protect services? See the{" "}
          <Link href="/council-tax-increase-scotland">council tax increase</Link> and{" "}
          <Link href="/best-council-in-scotland">best council</Link> pages.
        </LI>
      </UL>
      <P>
        If you use this site as a source, say so, and say what makes it more or less reliable. It is
        an independent website run by one person, not a government body, but every figure links to
        the official source so you can check it. That is exactly the kind of specific comment the
        marking rewards.
      </P>

      <H2 id="notes">National 5 modern studies revision notes</H2>
      <P>
        These aren&apos;t full notes for the whole course. They cover the parts where up to date
        Scottish evidence makes the biggest difference, with figures you can quote.
      </P>

      <H3>Democracy in Scotland: the Additional Member System</H3>
      <P>
        MSPs are elected in two ways. {constituencySeats} represent a{" "}
        <G t="constituency">constituency</G>, each won by First Past the Post. The other{" "}
        {regionalSeats} are regional MSPs, {regionalSeats / holyroodRegions.length} for each of the{" "}
        {holyroodRegions.length} regions, chosen from party lists to make the overall result more
        proportional.
      </P>
      <GuideTable
        kicker="The Scottish Parliament now"
        title="MSPs by party and how they were elected"
        columns={["Party", "Constituency", "Regional", "Total"]}
        align={["left", "right", "right", "right"]}
        rows={seats.map((row) => [row.party, row.constituency, row.regional, row.total])}
        caption={`Current MSPs from Scottish Parliament open data, checked ${formatHolyroodCheckedDate()}. This is the Parliament as it stands, so it can differ slightly from the May 2026 election result.`}
      />
      <P>
        That pattern is the whole point of AMS. {top.party} holds {top.constituency} of the{" "}
        {constituencySeats} constituency seats but only {top.regional} regional, because the
        regional lists top up parties that won fewer constituencies than their votes deserved.
        {listOnly ? ` ${listOnly.party} has ${listOnly.regional} MSPs and every one of them is a regional MSP.` : ""}
        {top.total < majority
          ? ` And with ${top.total} of ${totalSeats} seats, the largest party is short of the ${majority} it would need for a majority on its own.`
          : ""}
      </P>
      <P>
        For representation, every MSP&apos;s page in the <Link href="/representatives">directory</Link>{" "}
        lists their committee jobs and how they voted. Look up your own MSP and you have a recent,
        local example for a question on how MSPs represent people.
      </P>

      <H3>Devolved and reserved matters</H3>
      <P>
        The <Link href="/who-decides">who decides what</Link> page sorts everyday issues by who
        controls them. The NHS, schools, housing and the Scottish Child Payment are{" "}
        <G t="devolved">devolved</G> to the Scottish Parliament. Universal Credit, the minimum wage
        and energy bills are <G t="reserved">reserved</G> to the UK Parliament.
      </P>

      <H3>Social inequality: poverty in Scotland</H3>
      <UL>
        <LI>
          {scotlandPoverty.all.pct}% of people in Scotland,{" "}
          {scotlandPoverty.all.count.toLocaleString("en-GB")} in all, were in{" "}
          <G t="relative-poverty">relative poverty</G> after housing costs in {period}.
        </LI>
        <LI>
          By group: children {scotlandPoverty.children.pct}%, working age adults{" "}
          {scotlandPoverty.workingAge.pct}%, pensioners {scotlandPoverty.pensioners.pct}%.
        </LI>
        <LI>
          {scotlandPoverty.childrenInWorkingHouseholdsPct}% of children in poverty live in a
          household where someone works.
        </LI>
        <LI>
          Place matters. In {year}, child poverty ranged from {rateOf(highest)}% in {highest.name}{" "}
          to {rateOf(lowest)}% in {lowest.name}.
        </LI>
        <LI>
          Scotland missed its interim target of under {JRF.childTarget.interimPct}% child poverty by{" "}
          {JRF.childTarget.interimYear}. The rate is {scotlandPoverty.children.pct}%, against a final
          target of {JRF.childTarget.finalPct}% by {JRF.childTarget.finalYear}.
        </LI>
      </UL>
      <P>
        For the causes, the evidence points to three things: pay from work, the cost of living, and
        social security. The <Link href="/causes-of-poverty">causes of poverty</Link> guide takes each
        in turn with Scottish figures. Government responses you can describe include the{" "}
        <Link href="/scottish-child-payment">Scottish Child Payment</Link>, which only exists in
        Scotland, and free school meals for every pupil in primary 1 to 5.
      </P>

      <H3>Crime and the law</H3>
      <UL>
        <LI>
          Police in Scotland recorded {latest.shoplifting.toLocaleString("en-GB")} shoplifting crimes
          in {slashYear(latest.year)}, up from {preCovid.shoplifting.toLocaleString("en-GB")} in{" "}
          {slashYear(preCovid.year)}.
        </LI>
        <LI>
          In {slashYear(latestRate.year)} that was {latestRate.scotlandPer1000} per 1,000 people in
          Scotland, against {latestRate.englandWalesPer1000} in England and Wales.
        </LI>
        <LI>
          Recorded crime only counts what the police record. Not every crime is reported, which is a
          useful point when you evaluate a source.
        </LI>
      </UL>
      <P>
        The <Link href={postPath("shoplifting-scotland-record-high")}>shoplifting piece</Link> looks
        at causes, including food prices, and at what happened to convictions.
      </P>

      <H3>International issues</H3>
      <P>
        This site is about Scotland, so it doesn&apos;t cover world powers or world issues.{" "}
        <a href={LINKS.bitesizeN5}>BBC Bitesize National 5 Modern Studies</a> has notes on the USA,
        China and underdevelopment in Africa, alongside democracy, inequality and crime.
      </P>

      <H2 id="model-answers">National 5 modern studies model answers</H2>
      <P>
        These are my own example answers, written to show the shape markers look for. They
        aren&apos;t official, and I haven&apos;t given them a mark. Compare them with the marking
        instructions that come with each past paper.
      </P>
      <Aside title="Describe, in detail, two ways the Scottish Government has tried to reduce social and economic inequality. (4 marks)">
        <p>
          One way is the Scottish Child Payment. It is a weekly payment for each child in a low
          income family that gets a qualifying benefit such as Universal Credit, and it does not
          exist anywhere else in the UK. It gives families extra money for things like food,
          heating and school costs.
        </p>
        <p>
          A second way is free school meals. Every pupil in primary 1 to primary 5 at a publicly
          funded school gets a free lunch, whatever their family&apos;s income, which saves families
          money every school day.
        </p>
      </Aside>
      <P>
        Why it works: each way is named, then given detail and a real example. A 4 mark describe
        question needs two developed descriptions, not a list.
      </P>
      <Aside title="Explain, in detail, two reasons why some people in Scotland experience poverty. (6 marks)">
        <p>
          One reason is low pay and short hours. Having a job does not always protect a family. In
          Scotland, {scotlandPoverty.childrenInWorkingHouseholdsPct}% of children in poverty live in a
          household where someone works. If a parent can only get part time work, perhaps because of
          childcare, their income can stay below the poverty line. The Joseph Rowntree Foundation
          found {partTime.pct}% of people in families with only part time work were in poverty,
          compared with {allFullTime.pct}% where everyone works full time.
        </p>
        <p>
          A second reason is the cost of housing. Poverty is measured after rent or mortgage is
          paid, so high rent leaves less for everything else. {privateRenters.pct}% of private
          renters in Scotland are in poverty, compared with {mortgage.pct}% of people buying their
          home with a mortgage. This means renting privately on a low income is a big risk.
        </p>
      </Aside>
      <P>
        Why it works: each reason is explained, not just named, and backed by a recent Scottish
        figure. Words like because and this means are usually where the explanation marks are.
      </P>
      <Aside title="A tip for the 10 mark conclusions question">
        <p>
          Use each bullet point as a heading. Give your conclusion first, then back it with two
          pieces of evidence, ideally from different sources: Source 1 shows this, and Source 3
          backs it up because of that. Words like significant, much higher and the majority show
          the marker you are evaluating, not copying.
        </p>
      </Aside>

      <H2 id="dates">Exam date and results</H2>
      <P>
        The 2027 National 5 Modern Studies exam is on {EXAMS.date}, {EXAMS.n5}. In{" "}
        {N5.results.year}, {N5.results.entries.toLocaleString("en-GB")} pupils got a National 5
        Modern Studies result and {N5.results.pctA}% got an A. Everything official, including the
        course specification and the specimen paper, is on the{" "}
        <a href={LINKS.n5}>National 5 Modern Studies course page</a>.
      </P>

      <PostCTA
        title="Practise with real Scottish data"
        body="Where to get every past paper and marking instruction, how to use them well, and two full 10 mark source questions built from official figures."
        href="/nat-5-modern-studies-past-papers"
        cta="Nat 5 past papers and practice"
      />
    </Prose>
  );
}
