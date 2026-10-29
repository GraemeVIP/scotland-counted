import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import PastPaperDownloads from "@/components/PastPaperDownloads";
import { postPath } from "@/lib/routeMap";
import { scotlandPoverty } from "@/lib/data/scotland";
import { councilShoplifting, scotlandVsEnglandWales, shopliftingLongRun } from "@/lib/data/shoplifting";
import {
  JRF_SCOTLAND_2026 as JRF,
  MODERN_STUDIES_LINKS as LINKS,
  MODERN_STUDIES_PAST_PAPERS as PAST,
  N5_MODERN_STUDIES as N5,
  QS_REPLACED_SQA,
  plainPeriod,
  slashYear,
} from "@/lib/data/schools";

/** Councils for the support and oppose question: the biggest rises and every fall. */
const RISES = ["Angus", "City of Edinburgh", "Dundee City", "Glasgow City"];

export default function Post() {
  const period = plainPeriod(scotlandPoverty.period);
  const latest = shopliftingLongRun[shopliftingLongRun.length - 1];
  const recentYears = shopliftingLongRun.slice(-7);
  const rates = scotlandVsEnglandWales.slice(-3);
  const councilRows = [
    ...councilShoplifting.filter((row) => RISES.includes(row.area)).sort((a, b) => b.changePct - a.changePct),
    ...councilShoplifting.filter((row) => row.changePct < 0).sort((a, b) => a.changePct - b.changePct),
  ];

  return (
    <Prose>
      <Lead>
        Every Nat 5 Modern Studies past paper from {PAST.firstYear} to {PAST.lastYear} is below, with
        its marking instructions, one tap to download. Then there&apos;s how to use them so they
        actually help, and two full 10 mark source questions I&apos;ve built from real Scottish data.
      </Lead>

      <H2 id="where">Modern studies nat 5 past papers: download them here</H2>
      <P>
        Each question paper comes with its marking instructions, which show exactly how every
        question is marked. Do the paper first, then mark it yourself against the instructions.
      </P>
      <PastPaperDownloads />
      <P>
        Qualifications Scotland took over from SQA on {QS_REPLACED_SQA}, which is why the newest
        papers carry the new name. The same papers are on the official{" "}
        <a href={LINKS.pastPapersN5}>National 5 Modern Studies past papers page</a> too.
      </P>
      <P>
        Some {PAST.modifiedYears} papers are labelled modified. They were changed because of Covid,
        so they may be shorter than the paper you will sit. Use them for single questions rather than
        a full timed run.
      </P>
      <P>
        The specimen paper, which shows the current layout with its own marking instructions, is on
        the <a href={LINKS.n5}>National 5 Modern Studies course page</a>.
      </P>

      <H2 id="use">How to get the most from a past paper</H2>
      <UL>
        <LI>
          <strong>Do at least one full paper on time.</strong> It is {N5.paper.marks} marks in{" "}
          {N5.paper.duration}, so just under two minutes a mark. Pace matters as much as
          knowledge.
        </LI>
        <LI>
          <strong>Mark it with the marking instructions, honestly.</strong> Check you described when
          asked to describe and explained when asked to explain. That is where most marks go.
        </LI>
        <LI>
          <strong>Do the source questions more than once.</strong> They are 30 of the 80 marks and the
          skill is the same every year, even though the topic changes.
        </LI>
        <LI>
          <strong>Keep a list of examples.</strong> Every time a question asks for recent examples,
          add one to your list. Swap old figures for new ones from this site.
        </LI>
        <LI>
          <strong>Read the course report.</strong> The 2025 report found many pupils struggled to
          describe how MSPs and MPs represent their constituents in Parliament, and wrote about their
          local work instead. Little things like that are worth knowing before the exam.
        </LI>
      </UL>

      <H2 id="question-types">Question types and marks</H2>
      <GuideTable
        kicker="National 5 Modern Studies"
        title="The five question types"
        columns={["The question starts", "Marks", "What the marking rules say"]}
        align={["left", "right", "left"]}
        rows={N5.questionTypes.map((q) => [q.type, q.marks, q.rule])}
        caption={`From the specimen paper (August 2025) and its marking instructions. Use every source in a source question: two sources caps you at ${N5.sourceRule.twoSourcesMax} marks and one at ${N5.sourceRule.oneSourceMax}.`}
      />
      <P>
        Each section has knowledge questions worth 4, 6 and either 6 or 8 marks, then one 10 mark
        source question. In the 2025 paper the three source questions were one of each kind: an
        options question, a support and oppose question, and a conclusions question. The{" "}
        <Link href="/national-5-modern-studies">National 5 modern studies guide</Link> has model
        answers for the describe and explain questions.
      </P>

      <H2 id="practice-knowledge">Practice knowledge questions with real data</H2>
      <P>
        Written by me in the National 5 style, not taken from a paper. Each one has evidence on this
        site you can use as your recent example.
      </P>
      <UL>
        <LI>
          Describe, in detail, two ways MSPs can represent their constituents in the Scottish
          Parliament. (4 marks) Evidence: committee jobs and votes on the{" "}
          <Link href="/representatives">MSP directory</Link>.
        </LI>
        <LI>
          Explain, in detail, why some people in Scotland are more likely to be in poverty than
          others. (6 marks) Evidence: <Link href="/causes-of-poverty">causes of poverty</Link>.
        </LI>
        <LI>
          Describe, in detail, two ways poverty can affect children&apos;s health or education. (4
          marks) Evidence: the effects sections of the causes of poverty guide.
        </LI>
        <LI>
          Explain, in detail, two reasons why crime is higher in some parts of Scotland than others.
          (6 marks) Evidence: the council by council figures in the{" "}
          <Link href={postPath("shoplifting-scotland-record-high")}>shoplifting piece</Link>.
        </LI>
      </UL>

      <H2 id="practice-conclusions">Practice source question: conclusions</H2>
      <GuideTable
        kicker="Source 1"
        title={`Who is in poverty in Scotland, ${period}`}
        columns={["Group", "In relative poverty after housing costs"]}
        align={["left", "right"]}
        rows={[
          ["All people", `${scotlandPoverty.all.pct}%`],
          ["Children", `${scotlandPoverty.children.pct}%`],
          ["Working age adults", `${scotlandPoverty.workingAge.pct}%`],
          ["Pensioners", `${scotlandPoverty.pensioners.pct}%`],
        ]}
        caption={`Scottish Government. ${scotlandPoverty.childrenInWorkingHouseholdsPct}% of children in poverty live in a household where someone works.`}
      />
      <GuideTable
        kicker="Source 2"
        title="Chance of being in poverty, by work in the family"
        columns={["Family", "In poverty"]}
        align={["left", "right"]}
        rows={JRF.work.map((row) => [row.family, `${row.pct}%`])}
        caption={`Joseph Rowntree Foundation, Poverty in Scotland 2026. Figures for ${period}.`}
      />
      <GuideTable
        kicker="Source 3"
        title="Chance of being in poverty, by type of home"
        columns={["Home", "In poverty"]}
        align={["left", "right"]}
        rows={JRF.tenure.map((row) => [row.home, `${row.pct}%`])}
        caption={`Joseph Rowntree Foundation, Poverty in Scotland 2026. ${JRF.privateRentersPulledInPct}% of all private renters are pulled into poverty by their housing costs.`}
      />
      <Aside title="Question (10 marks)">
        <p>Using Sources 1, 2 and 3, what conclusions can be drawn about poverty in Scotland?</p>
        <p>You should reach a conclusion about each of the following:</p>
        <p>
          the age group most likely to be in poverty; the link between hours of work and poverty;
          whether having a job always protects against poverty; the link between type of home and
          poverty.
        </p>
        <p>
          Your conclusions must be supported by evidence from the sources. You should link
          information within and between the sources. Your answer must be based on all three
          sources.
        </p>
      </Aside>
      <H3>What a strong answer does</H3>
      <UL>
        <LI>Uses each bullet as a heading and gives a clear conclusion first.</LI>
        <LI>
          Backs every conclusion with two pieces of evidence, for example the children figure in
          Source 1 compared with the other groups.
        </LI>
        <LI>
          Links sources for the job question: Source 2 shows full time work protects best, while the
          note under Source 1 shows most children in poverty still have a working parent.
        </LI>
        <LI>Uses evaluative words such as much higher, the majority and over three times as likely.</LI>
      </UL>

      <H2 id="practice-support-oppose">Practice source question: support and oppose</H2>
      <GuideTable
        kicker="Source 1"
        title="Shoplifting recorded by the police in Scotland"
        columns={["Year", "Crimes recorded"]}
        align={["left", "right"]}
        rows={recentYears.map((row) => [slashYear(row.year), row.shoplifting.toLocaleString("en-GB")])}
        caption={`Scottish Government, Recorded Crime in Scotland. ${slashYear(latest.year)} is the highest in the series, which starts in ${slashYear(shopliftingLongRun[0].year)}.`}
      />
      <GuideTable
        kicker="Source 2"
        title="Shoplifting per 1,000 people"
        columns={["Year", "Scotland", "England and Wales"]}
        align={["left", "right", "right"]}
        rows={rates.map((row) => [slashYear(row.year), row.scotlandPer1000, row.englandWalesPer1000])}
        caption="Scottish Government and Office for National Statistics, police recorded crime."
      />
      <GuideTable
        kicker="Source 3"
        title={`Change in shoplifting since ${slashYear("2019-20")}, selected councils`}
        columns={["Council area", `${slashYear("2019-20")}`, `${slashYear(latest.year)}`, "Change"]}
        align={["left", "right", "right", "right"]}
        rows={councilRows.map((row) => [row.area, row.y2019.toLocaleString("en-GB"), row.y2025.toLocaleString("en-GB"), `${row.changePct > 0 ? "up" : "down"} ${Math.abs(row.changePct)}%`])}
        caption="Recorded Crime in Scotland. The four councils at the top had some of the biggest rises. The others are every council where shoplifting fell."
      />
      <Aside title="Question (10 marks)">
        <p>Using Sources 1, 2 and 3, give reasons to support and oppose the view of Jamie Reid.</p>
        <p>
          &ldquo;Shoplifting has gone up in every part of Scotland, and Scotland has always had a
          bigger shoplifting problem than England and Wales.&rdquo; View of Jamie Reid
        </p>
        <p>
          In your answer you must give evidence from the sources that supports Jamie Reid&apos;s view
          and evidence from the sources that opposes it. Your answer must be based on all three
          sources.
        </p>
      </Aside>
      <H3>What a strong answer does</H3>
      <UL>
        <LI>
          Support: the national total in Source 1, and the biggest council rises in Source 3, linked
          together.
        </LI>
        <LI>
          Oppose: the councils in Source 3 where shoplifting fell, and the years in Source 2 when
          England and Wales had the higher rate. The word always is the weak spot in this view.
        </LI>
        <LI>
          Explains each point instead of copying numbers: say what the figures show about the view.
        </LI>
      </UL>
      <P>
        Jamie Reid is made up, but every number is real. For the full story behind these figures,
        read <Link href={postPath("shoplifting-scotland-record-high")}>shoplifting in Scotland</Link>.
      </P>

      <PostCTA
        title="Get the official papers"
        body={`Every National 5 Modern Studies paper and marking instruction from ${PAST.firstYear} to ${PAST.lastYear}, free from Qualifications Scotland.`}
        href={LINKS.pastPapersN5}
        cta="Open the past papers page"
      />
    </Prose>
  );
}
