import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { scotlandPoverty } from "@/lib/data/scotland";
import { shopliftingLongRun } from "@/lib/data/shoplifting";
import { FUNDING_MIX } from "@/lib/data/councilBudgetMechanics";
import { postPath } from "@/lib/routeMap";
import {
  ADVANCED_HIGHER_MODERN_STUDIES as AH,
  HIGHER_MODERN_STUDIES as H,
  MODERN_STUDIES_EXAMS_2027 as EXAMS,
  MODERN_STUDIES_LINKS as LINKS,
  N5_MODERN_STUDIES as N5,
  QS_REPLACED_SQA,
  holyroodSeatsByParty,
  plainPeriod,
  slashYear,
} from "@/lib/data/schools";

export default function Post() {
  const seats = holyroodSeatsByParty();
  const constituencySeats = seats.reduce((sum, row) => sum + row.constituency, 0);
  const top = seats[0];
  const shoplifting = shopliftingLongRun[shopliftingLongRun.length - 1];
  const [grant, councilTax] = FUNDING_MIX;
  const period = plainPeriod(scotlandPoverty.period);

  return (
    <Prose>
      <Lead>
        Modern Studies is the Scottish school subject about how power works, who has it, and what
        it does to people&apos;s lives. I&apos;ve put the official course facts and the up to date
        Scottish evidence on this site in one place, so pupils and teachers can find both quickly.
      </Lead>

      <H2 id="what">What modern studies is</H2>
      <P>
        At National 5 and Higher the course has the same three areas of study: democracy in
        Scotland and the UK, social issues in the UK, and international issues. In social issues
        you study either social inequality or crime and the law. In international issues you study
        either a world power, such as the USA or China, or a world issue, such as a conflict.
      </P>
      <P>
        The exams are set and marked by Qualifications Scotland, which replaced SQA on{" "}
        {QS_REPLACED_SQA}. Most course documents still carry the SQA name and still live on
        sqa.org.uk. Qualifications Scotland says they remain current, so don&apos;t worry if your
        notes say SQA.
      </P>

      <H2 id="levels">The courses, level by level</H2>
      <GuideTable
        kicker="Qualifications Scotland course specifications"
        title="How each course is assessed"
        columns={["Level", "Exam", "Coursework", "Total marks", "Guide"]}
        align={["left", "left", "left", "right", "left"]}
        rows={[
          [
            "National 5",
            `${N5.paper.marks} marks, ${N5.paper.duration}`,
            `Assignment, ${N5.assignment.marks} marks`,
            N5.totalMarks,
            <Link key="g" href="/national-5-modern-studies">N5 guide</Link>,
          ],
          [
            "Higher",
            `Two papers, ${H.paper1.marks} and ${H.paper2.marks} marks`,
            `Assignment, ${H.assignment.marks} marks`,
            H.totalMarks,
            <Link key="g" href="/higher-modern-studies">Higher guide</Link>,
          ],
          [
            "Advanced Higher",
            `${AH.paper.marks} marks, ${AH.paper.duration}`,
            `Dissertation, ${AH.dissertation.marks} marks`,
            AH.totalMarks,
            <Link key="g" href="/advanced-higher-modern-studies">AH guide</Link>,
          ],
        ]}
        caption={`Checked against the course specifications on 29 October 2026. All three exams are on ${EXAMS.date}.`}
      />
      <P>
        Past papers and their marking instructions are free from Qualifications Scotland. I explain
        where to find them and how to use them well on the{" "}
        <Link href="/nat-5-modern-studies-past-papers">Nat 5 modern studies past papers</Link> and{" "}
        <Link href="/higher-modern-studies-past-papers">Higher modern studies past papers</Link>{" "}
        pages, along with practice questions built from real Scottish data.
      </P>

      <H2 id="resources">Modern studies resources on this site</H2>
      <P>
        Every figure on this site comes from official statistics, with the source underneath. That
        matters in Modern Studies, because markers reward recent, accurate examples. Here is where
        each part of the course meets the evidence.
      </P>
      <GuideTable
        kicker="Free to use in class and in answers"
        title="Where to find evidence for each topic"
        columns={["Part of the course", "Evidence here", "What it gives you"]}
        rows={[
          [
            "Democracy: representation",
            <Link key="l" href="/representatives">Every MP and MSP</Link>,
            "Committee jobs, contact details and recorded votes for each member",
          ],
          [
            "Democracy: voting systems",
            <Link key="l" href="/national-5-modern-studies#notes">Seats by party</Link>,
            `How the Additional Member System works in practice: ${top.party} holds ${top.constituency} of ${constituencySeats} constituency seats but only ${top.regional} regional`,
          ],
          [
            "Democracy: devolved and reserved",
            <Link key="l" href="/who-decides">Who decides what</Link>,
            "Which issues sit with Westminster, Holyrood or your council",
          ],
          [
            "Social inequality",
            <Link key="l" href="/poverty-in-scotland">Poverty in Scotland</Link>,
            `${scotlandPoverty.all.pct}% of people and ${scotlandPoverty.children.pct}% of children in poverty, ${period}`,
          ],
          [
            "Causes and effects of inequality",
            <Link key="l" href="/causes-of-poverty">Causes of poverty</Link>,
            "Work, the cost of living and social security, with Scottish figures",
          ],
          [
            "Government responses",
            <Link key="l" href="/scottish-child-payment">Scottish Child Payment</Link>,
            "A payment that only exists in Scotland, and who decides it",
          ],
          [
            "Local government",
            <Link key="l" href="/best-council-in-scotland">All 32 councils ranked</Link>,
            `Where council money comes from: ${grant.pence}p in every £1 from the Scottish Government, ${councilTax.pence}p from council tax`,
          ],
          [
            "Crime and the law",
            <Link key="l" href={postPath("shoplifting-scotland-record-high")}>Shoplifting in Scotland</Link>,
            `${shoplifting.shoplifting.toLocaleString("en-GB")} shoplifting crimes recorded in ${slashYear(shoplifting.year)}`,
          ],
          [
            "Health inequalities",
            <Link key="l" href={postPath("drug-deaths-scotland-deprivation")}>Drug deaths and deprivation</Link>,
            "How the death rate changes from the poorest areas to the richest",
          ],
          [
            "Your own area",
            <Link key="l" href="/areas">All 32 council areas</Link>,
            "Child poverty, benefits and pay for the place you live",
          ],
          ["International issues", "Not covered here", "Use your class notes and BBC Bitesize"],
        ]}
        caption="This site is about Scotland, so it has nothing on world powers or world issues."
      />

      <H2 id="revision">Modern studies revision: how to use real data</H2>
      <P>
        Knowing a topic is half of it. The other half is backing your points with evidence. The
        2026 Higher course report told teachers to keep giving pupils the best recent examples,
        because some answers leaned on very old ones. A few habits make a big difference:
      </P>
      <UL>
        <LI>
          <strong>Learn a few figures well.</strong> One accurate, recent statistic with its year
          beats three vague ones.
        </LI>
        <LI>
          <strong>Always say where and when.</strong> &ldquo;{scotlandPoverty.all.pct}% of people in
          Scotland were in poverty in {period}, according to the Scottish Government&rdquo; is
          evidence. &ldquo;Loads of people are poor&rdquo; is not.
        </LI>
        <LI>
          <strong>Explain what the figure shows.</strong> A number on its own is description. Saying
          what it proves about the question is where the higher marks are.
        </LI>
        <LI>
          <strong>Compare.</strong> Two areas, two years or two groups side by side is the start of
          analysis.
        </LI>
        <LI>
          <strong>Use Scotland.</strong> Questions often ask for recent examples from Scotland, and
          everything here is Scottish, right down to your own council.
        </LI>
      </UL>
      <Aside title="A worked example">
        <p>
          <strong>Point:</strong> having a job does not always protect a family from poverty.
        </p>
        <p>
          <strong>Evidence:</strong> {scotlandPoverty.childrenInWorkingHouseholdsPct}% of children in
          poverty in Scotland live in a household where someone works (Scottish Government, {period}).
        </p>
        <p>
          <strong>Explanation:</strong> low pay, short hours and high rent can leave a working family
          below the poverty line, so a job on its own is not enough.
        </p>
      </Aside>

      <H2 id="teachers">For teachers</H2>
      <P>
        A teacher already uses this site with their classes, which is partly why these pages exist.
        Here are a few things that work well in a lesson.
      </P>
      <UL>
        <LI>
          The <Link href="/poverty-in-scotland-quiz">poverty quiz</Link>. Six questions, and most
          people guess wrong, which gets a discussion going fast.
        </LI>
        <LI>
          Local figures. Pupils look up the school&apos;s council on{" "}
          <Link href="/areas">the area pages</Link>, then compare it with a council of their choice.
        </LI>
        <LI>
          Writing to a representative. Both the National 5 and Higher course specifications suggest
          it as a citizenship activity. The <Link href="/representatives">MP and MSP directory</Link>{" "}
          has contact details for every member, and{" "}
          <Link href="/email-your-mp-and-msp">email your MP and MSP</Link> walks through writing one.
        </LI>
        <LI>
          Source evaluation. Every page lists its sources, and the{" "}
          <Link href="/methods">methods page</Link> explains every calculation. That makes the site a
          fair test case for a reliability question: who made it, how, and could it be biased?
        </LI>
        <LI>
          Data files. The <Link href="/data">data page</Link> has the cleaned files, free to reuse
          if you credit the site.
        </LI>
      </UL>
      <P>
        If you use any of this in class, I&apos;d really like to hear how it went and what would
        help. Use the <Link href="/contact?reason=teaching">teaching option on the contact form</Link>.
        No pupil names needed.
      </P>

      <H2 id="official">Official links worth bookmarking</H2>
      <UL>
        <LI>
          <a href={LINKS.subject}>Modern Studies on the Qualifications Scotland website</a>, with
          links to every level.
        </LI>
        <LI>
          Course pages for <a href={LINKS.n5}>National 5</a>, <a href={LINKS.higher}>Higher</a> and{" "}
          <a href={LINKS.advancedHigher}>Advanced Higher</a>: course specifications, specimen papers,
          coursework tasks and course reports.
        </LI>
        <LI>
          <a href={LINKS.pastPapersHome}>Past papers and marking instructions</a> for every subject.
        </LI>
        <LI>
          <a href={LINKS.timetable2027}>The 2027 exam timetable</a> (a PDF).
        </LI>
        <LI>
          BBC Bitesize for <a href={LINKS.bitesizeN5}>National 5</a> and{" "}
          <a href={LINKS.bitesizeHigher}>Higher</a> Modern Studies.
        </LI>
      </UL>
      <Aside title="Exam day in 2027">
        <p>
          Every Modern Studies exam is on {EXAMS.date}. Higher Paper 1 runs {EXAMS.higherPaper1} and
          Paper 2 {EXAMS.higherPaper2}. Advanced Higher is {EXAMS.advancedHigher}. National 5 is{" "}
          {EXAMS.n5}.
        </p>
      </Aside>

      <PostCTA
        title="Find the figures for your own area"
        body="Pick your council and get its child poverty rate, benefits and pay, each with the official source underneath. Local evidence makes an answer stand out."
        href="/areas"
        cta="Find my area"
      />
    </Prose>
  );
}
