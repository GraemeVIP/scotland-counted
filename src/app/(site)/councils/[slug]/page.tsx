import Link from "next/link";
import { notFound } from "next/navigation";
import { G, PlainText } from "@/components/Glossary";
import Faq from "@/components/Faq";
import { CTA, ContentFrame, EvidenceDetails, InShort, Page, PageHeader } from "@/components/Blocks";
import {
  councilAccountabilityRecords,
  getCouncilAccountability,
  type AuditFinding,
  type CommitmentStatus,
  type PerformanceOutcome,
} from "@/lib/data/councilAccountability";
import { getCouncil } from "@/lib/data/councils";
import { headlineCards, shortVersion } from "@/lib/councilSignals";
import CouncilCompare from "@/components/CouncilCompare";
import CrisisGrantAccountability from "@/components/CrisisGrantAccountability";
import FamilyGroupComparison from "@/components/FamilyGroupComparison";
import BudgetGapExplainer from "@/components/BudgetGapExplainer";
import CouncilWatch from "@/components/CouncilWatch";
import AccountabilityMethodNote from "@/components/AccountabilityMethodNote";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { crisisGrantScotland, getCrisisGrantCouncil } from "@/lib/data/crisisGrants";

export function generateStaticParams() {
  return councilAccountabilityRecords.map((record) => ({ slug: record.councilSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = getCouncilAccountability(slug);
  if (!record) return { robots: { index: false, follow: true } };

  return meta({
    title: `${record.councilName}: budget and performance | Scotland Counted`,
    description:
      `See ${record.councilName}'s published funding pressure, service goals, audit findings and promises, with every claim linked to an official source.`,
    path: `/councils/${record.councilSlug}`,
  });
}

function money(value: number, unit: "million" | "billion", qualifier?: "over" | "projected" | "expected") {
  const formatted = value.toLocaleString("en-GB", { maximumFractionDigits: 1 });
  const figure = `£${formatted}${unit === "million" ? "m" : "bn"}`;
  return qualifier === "over" ? `Over ${figure}` : qualifier === "expected" ? `Expected ${figure}` : figure;
}

function statusLabel(status: PerformanceOutcome["status"] | CommitmentStatus | AuditFinding["status"]) {
  return {
    met: "Goal met",
    missed: "Goal missed",
    "not-comparable": "Not a fair comparison",
    "not-verified": "Needs new evidence",
    planned: "Planned",
    "in-progress": "In progress",
    complete: "Marked complete",
    open: "Open",
    closed: "Closed",
  }[status];
}

function statusClass(status: PerformanceOutcome["status"] | CommitmentStatus | AuditFinding["status"]) {
  if (status === "missed" || status === "open") {
    return "border-[var(--bad-text)] text-[var(--bad-text)]";
  }
  if (status === "met" || status === "complete" || status === "closed") {
    return "border-[var(--good-text)] text-[var(--good-text)]";
  }
  return "border-[var(--rule-strong)] text-[var(--ink-2)]";
}

function sourceTitle(record: NonNullable<ReturnType<typeof getCouncilAccountability>>, sourceId: string) {
  return record.sources.find((source) => source.id === sourceId)?.title ?? "Official source";
}

function sourceUrl(record: NonNullable<ReturnType<typeof getCouncilAccountability>>, sourceId: string) {
  return record.sources.find((source) => source.id === sourceId)?.url ?? "/methods";
}

function ClaimSource({
  record,
  sourceIds,
}: {
  record: NonNullable<ReturnType<typeof getCouncilAccountability>>;
  sourceIds: string[];
}) {
  return (
    <p className="ui mt-4 text-[14px] leading-[1.5] text-[var(--muted)]">
      Source: {sourceIds.map((sourceId, index) => (
        <span key={sourceId}>
          {index > 0 ? "; " : ""}
          <a href={sourceUrl(record, sourceId)} target="_blank" rel="noopener noreferrer">
            {sourceTitle(record, sourceId)}
          </a>
        </span>
      ))}
    </p>
  );
}

export default async function CouncilAccountabilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = getCouncilAccountability(slug);
  const council = getCouncil(slug);
  if (!record || !council) notFound();

  const pagePath = `/councils/${record.councilSlug}`;
  const crisisGrant = getCrisisGrantCouncil(record.councilSlug);
  const missed = record.outcomes.filter((outcome) => outcome.status === "missed");
  const reportedOutcomes = record.outcomes.filter((outcome) => outcome.status !== "not-verified");
  const sameMeasureMisses = missed.filter((outcome) => !outcome.comparisonNote).length;
  const countBasedMisses = missed.length - sameMeasureMisses;
  const allocation =
    record.budgetContext.find((figure) => figure.id === "day-to-day-funding-2025-26") ?? record.budgetContext[0];
  const allocationText = allocation ? money(allocation.value, allocation.unit, allocation.qualifier) : "the published allocation";
  const openFindings = record.auditFindings.filter((finding) => finding.status === "open");
  const budgetGridClass = record.budgetContext.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  const budgetAccentClasses = [
    "border-t-[var(--brand)]",
    "border-t-[var(--action)]",
    "border-t-[var(--good)]",
    "border-t-[var(--brand-deep)]",
  ];
  const budgetSourceIds = Array.from(new Set(record.budgetContext.flatMap((figure) => figure.sourceIds)));
  const budgetCardSpan = (index: number) =>
    record.budgetContext.length === 5 && index === record.budgetContext.length - 1 ? "md:col-span-2" : "";
  // Derived from data every council has, so the most prominent slot on the
  // page never falls back to an em dash for the councils with thinner records.
  const quickReadCards = headlineCards(record);
  const shortVersionText = shortVersion(record);
  const allocationFaq = allocation
    ? record.councilName +
      " has " +
      allocationText +
      " listed under " +
      allocation.label +
      " for " +
      allocation.period +
      ". It is a budget or allocation, not proof of the final amount spent, and the other figures on this page are kept separate."
    : "This record does not yet include a separate day-to-day funding allocation. The figures that are available are labelled below and linked to their sources.";
  const targetFaq =
    sameMeasureMisses > 0
      ? `${record.councilName} has ${sameMeasureMisses} goal${sameMeasureMisses === 1 ? "" : "s"} marked as missed where the numbers can be compared directly.`
      : reportedOutcomes.length > 0
        ? "The published results are shown below. None is marked as a missed goal where the numbers can be compared directly."
        : "No service-goal result has been checked for this record yet.";
  const faq = [
    {
      q: `How much money does ${record.councilName} receive?`,
      a: allocationFaq,
    },
    {
      q: `Has ${record.councilName} missed any goals?`,
      a: targetFaq +
        (countBasedMisses > 0
          ? " A further " +
            countBasedMisses +
            " result is marked as missed, but its source does not give the matching total needed for a direct comparison."
          : ""),
    },
    ...(crisisGrant
      ? [{
          q: `What percentage of Crisis Grant applications does ${record.councilName} award?`,
          a: `In 2025/26, ${crisisGrant.acceptanceRate}% of decided Crisis Grant applications in ${record.councilName} resulted in an award, compared with ${crisisGrantScotland.acceptanceRate}% across Scotland. This is an outcome rate for applications, not unique people, and it does not by itself explain why councils differ.`,
        }]
      : []),
    {
      q: "Does this page prove that a councillor is personally responsible?",
      a: "No. It records what the council, its officers, auditors and regulators published. It does not assign an individual motive or blame without a separate documented decision trail.",
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Council budgets and performance", path: "/councils" },
          { name: record.councilName, path: pagePath },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: `${record.councilName}: budget and performance`,
          description: record.summary,
          path: pagePath,
          modified: record.lastReviewedOn,
          schemaType: "WebPage",
          keywords: [record.councilName, "council budget", "council performance", "Crisis Grant acceptance rate", "audit findings"],
        })}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <Page>
        <PageHeader
          eyebrow={`Holding the council to account · Checked ${record.lastReviewedOn}`}
          title={`${record.councilName}: what was promised and what happened`}
          lede={<PlainText text={record.summary} />}
        />

        <ContentFrame>
          <InShort expert={false}>
            <p><PlainText text={shortVersionText} /></p>
            <p className="ui mt-4 text-[14px] leading-[1.5] text-[var(--muted)]">
              Words with a dotted underline have a quick explanation. Hover or tap them.
            </p>
          </InShort>

          <AccountabilityMethodNote councilName={record.councilName} />

        <section
          aria-labelledby="quick-read-title"
          className="mt-8 rounded-[var(--r-l)] bg-[var(--deep)] p-5 text-[var(--deep-ink)] sm:p-7"
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="kicker text-[var(--action)]">The headline</p>
              <h2 id="quick-read-title" className="mt-2 text-[clamp(28px,4vw,46px)] font-[800] leading-[1] tracking-[-0.035em]">
                Three things to know
              </h2>
              <p className="mt-3 max-w-[58ch] text-[16px] leading-[1.55] opacity-85">
                If you only read one part, read this. The detailed figures and official source links come after it.
              </p>
            </div>
            <a href="#money" className="btn btn-on-deep !px-5 !py-2.5 !text-[15px]">
              See the evidence <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {quickReadCards.map((card) => (
              <article
                key={card.label}
                className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-4 bg-[var(--surface)] p-5 text-[var(--ink)]"
                style={{ borderTopColor: card.accent }}
              >
                <p className="ui text-[15px] font-[760] text-[var(--ink-2)]">{card.label}</p>
                <p className="mt-3 text-[clamp(30px,4vw,48px)] font-[800] leading-none tracking-[-0.04em]" style={{ color: card.accent }}>
                  {card.value}
                </p>
                <p className="ui mt-2 text-[14px] font-[700] text-[var(--ink-2)]">{card.sub}</p>
                <p className="mt-4 text-[15px] leading-[1.5] text-[var(--ink-2)]">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

          <nav
          aria-label="On this council page"
          className="mt-8 flex flex-wrap gap-2 border-y border-[var(--rule)] py-4"
        >
            {[
              { id: "money", label: "Money" },
              { id: "why-more-money", label: "Why they need more" },
              { id: "performance", label: "Goals" },
              { id: "crisis-grants", label: "Crisis Grants" },
              { id: "compare", label: "Compare councils" },
              { id: "audit-trail", label: "What auditors found" },
              { id: "promises", label: "Promises" },
              { id: "sources", label: "Sources" },
            ].map((anchor) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                className="ui rounded-[var(--r-pill)] border border-[var(--rule)] px-3.5 py-2 text-[15px] font-[650] text-[var(--ink-2)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                {anchor.label}
              </a>
            ))}
          </nav>

          <section id="money" className="pt-12 scroll-mt-24">
            <p className="kicker mb-2 text-[var(--brand)]">Follow the money</p>
            <h2 className="h2 mb-3">What the published figures say</h2>
            <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              These figures show what the council planned to spend on everyday services and what it
              still needed to find. That second number is not money already missing. The final
              accounts show what really happened after the year ended.{" "}
              {/* The article stays on the same line as the term: JSX drops a line
                  break between text and an element, which rendered "Arevenue". */}
              A <G t="revenue-budget">revenue budget</G> pays for everyday services.{" "}
              A <G t="capital-programme">capital programme</G> pays for big, long-term things.
            </p>
            <div className={`mt-7 grid gap-5 ${budgetGridClass}`}>
              {record.budgetContext.length > 0 ? record.budgetContext.map((figure, index) => (
                <article
                  key={figure.id}
                  className={`flex h-full flex-col rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] bg-[var(--surface)] p-6 ${budgetAccentClasses[index % budgetAccentClasses.length]} ${budgetCardSpan(index)}`}
                >
                  <p className="ui min-h-[42px] text-[15px] font-[750] leading-[1.4] text-[var(--muted)]"><PlainText text={figure.label} /></p>
                  <p className="figure-num mt-4 text-[42px] leading-none text-[var(--brand)]">
                    {money(figure.value, figure.unit, figure.qualifier)}
                  </p>
                  <p className="ui mt-3 text-[15px] font-[650] text-[var(--ink-2)]">{figure.period}</p>
                  <p className="mt-4 flex-1 text-[16px] leading-[1.55] text-[var(--ink-2)]"><PlainText text={figure.plainEnglish} /></p>
                </article>
              )) : (
                <p className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                  No budget figure has been added to this record yet. Check the source list for the
                  latest published council papers.
                </p>
              )}
            </div>
            {record.budgetContext.length > 0 && <ClaimSource record={record} sourceIds={budgetSourceIds} />}
          </section>

          {/*
            Straight after the money, because this is where a reader has just
            been told the council "needed" another £19m and is entitled to ask
            why that happens every single year.
          */}
          <BudgetGapExplainer slug={record.councilSlug} councilName={record.councilName} />

          <section id="performance" className="pt-14 scroll-mt-24">
            <p className="kicker mb-2 text-[var(--action)]">
              {reportedOutcomes.length > 0 ? "Promises versus results" : "The missing evidence"}
            </p>
            <h2 className="h2 mb-3">
              {reportedOutcomes.length > 0 ? "Did services do what they promised?" : "What we still do not know about services"}
            </h2>
            <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              A goal is what the council said it wanted to achieve. The result is what happened.
              They sit side by side here, and it is flagged when the two numbers cannot be
              compared fairly.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[14px] leading-[1.5] text-[var(--ink-2)]" aria-label="How to read the status labels">
              <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--bad-text)]" /> Red means a goal was missed or a matter is still open.</span>
              <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--good-text)]" /> Green means a goal was met or the action is marked complete.</span>
              <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--muted)]" /> Grey means there is not enough evidence for a firm result.</span>
            </div>
            <div className={`mt-7 grid gap-4 ${record.outcomes.length > 1 ? "md:grid-cols-2" : ""}`}>
              {record.outcomes.length > 0 ? record.outcomes.map((outcome) => (
                <article
                  key={outcome.id}
                  className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="ui text-[15px] font-[750] text-[var(--muted)]"><PlainText text={outcome.service} /></p>
                      <h3 className="h3 mt-2"><PlainText text={outcome.measure} /></h3>
                    </div>
                    <span className={`ui shrink-0 rounded-[var(--r-pill)] border px-3 py-1.5 text-[14px] font-[750] ${statusClass(outcome.status)}`}>
                      {statusLabel(outcome.status)}
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-[var(--r-s)] bg-[var(--surface-2)] p-4">
                      <p className="ui text-[14px] font-[700] text-[var(--muted)]">Goal</p>
                      <p className="mt-1 text-[23px] font-[700] tnum">{outcome.target}</p>
                    </div>
                    <div className="rounded-[var(--r-s)] bg-[var(--surface-2)] p-4">
                      <p className="ui text-[14px] font-[700] text-[var(--muted)]">What happened</p>
                      <p className="mt-1 text-[23px] font-[700] tnum">{outcome.actual}</p>
                    </div>
                  </div>
                  <p className="ui mt-4 text-[15px] leading-[1.5] text-[var(--ink-2)]">
                    Period: {outcome.period}{outcome.variance ? ` · ${outcome.variance}` : ""}
                  </p>
                  {outcome.explanation && (
                    <p className="mt-3 border-l-2 border-[var(--brand)] pl-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">
                      <strong>In plain English:</strong> <PlainText text={outcome.explanation} />
                    </p>
                  )}
                  {outcome.comparisonNote && (
                    <p className="mt-3 border-l-2 border-[var(--brand)] pl-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">
                      <PlainText text={outcome.comparisonNote} />
                    </p>
                  )}
                  <ClaimSource record={record} sourceIds={outcome.sourceIds} />
                </article>
              )) : (
                <p className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                  No service goal has been independently checked for this council yet. That is a
                  research gap, not proof that every goal was met.
                </p>
              )}
            </div>
          </section>

          <CrisisGrantAccountability slug={record.councilSlug} councilName={record.councilName} />

          <CouncilCompare slug={record.councilSlug} />

          <FamilyGroupComparison slug={record.councilSlug} councilName={record.councilName} />

          <section id="audit-trail" className="pt-14 scroll-mt-24">
            <p className="kicker mb-2 text-[var(--bad-text)]">Outside checks</p>
            <h2 className="h2 mb-3">What the auditors found</h2>
            <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              These are checks by people outside the council: Audit Scotland, the Accounts
              Commission and the Scottish Housing Regulator. An <G t="audit-finding">audit finding</G>{" "}
              is a point they recorded after checking the books or how a service works.{" "}
              <G t="best-value">Best Value</G> is the formal name for one of those checks. It is not
              a gold star for every service.
            </p>
            <div className="mt-7 grid gap-4">
              {record.auditFindings.length > 0 ? record.auditFindings.map((finding) => (
                <article
                  key={finding.id}
                  className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="ui text-[15px] font-[750] text-[var(--muted)]"><PlainText text={finding.publisher} /> · {finding.reportDate}</p>
                      <h3 className="h3 mt-2"><PlainText text={finding.title} /></h3>
                    </div>
                    <span className={`ui shrink-0 rounded-[var(--r-pill)] border px-3 py-1.5 text-[14px] font-[750] ${statusClass(finding.status)}`}>
                      {statusLabel(finding.status)}
                    </span>
                  </div>
                  <p className="mt-4 max-w-[78ch] text-[16px] leading-[1.6] text-[var(--ink-2)]"><PlainText text={finding.finding} /></p>
                  {finding.recommendation && (
                    <p className="mt-4 max-w-[78ch] border-l-2 border-[var(--brand)] pl-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">
                      <strong>What was recommended:</strong> <PlainText text={finding.recommendation} />
                    </p>
                  )}
                  {finding.managementResponse && (
                    <p className="mt-3 max-w-[78ch] text-[15px] leading-[1.55] text-[var(--ink-2)]">
                      <strong>The recorded response:</strong> <PlainText text={finding.managementResponse} />
                    </p>
                  )}
                  <ClaimSource record={record} sourceIds={finding.sourceIds} />
                </article>
              )) : (
                <p className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                  No audit or regulator finding has been added to this record yet. Check back after
                  the next published review.
                </p>
              )}
            </div>
            {openFindings.length > 0 && (
              <p className="mt-5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                {openFindings.length} finding{openFindings.length === 1 ? " remains" : "s remain"} marked open in this record. That is a status from the source, not a claim that nothing has changed since publication.
              </p>
            )}
          </section>

          <section id="promises" className="pt-14 scroll-mt-24">
            <p className="kicker mb-2 text-[var(--brand)]">What your council said it would do</p>
            <h2 className="h2 mb-3">Promises and deadlines</h2>
            <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              A <G t="commitment">commitment</G> is something the council said it would do. We look
              for a date, an owner and later proof. Saying it in a plan is not the same as finishing it.
            </p>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {record.commitments.length > 0 ? record.commitments.map((commitment) => (
                <article key={commitment.id} className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="h3"><PlainText text={commitment.title} /></h3>
                    <span className={`ui shrink-0 rounded-[var(--r-pill)] border px-3 py-1.5 text-[14px] font-[750] ${statusClass(commitment.status)}`}>
                      {statusLabel(commitment.status)}
                    </span>
                  </div>
                  <p className="mt-4 text-[16px] leading-[1.6] text-[var(--ink-2)]"><PlainText text={commitment.commitment} /></p>
                  <dl className="mt-5 grid gap-2 text-[15px] leading-[1.5] text-[var(--ink-2)]">
                    <div><dt className="inline font-[700]">Owner:</dt> <dd className="inline">{commitment.owner}</dd></div>
                    <div><dt className="inline font-[700]">Due:</dt> <dd className="inline">{commitment.dueBy ?? "No date published"}</dd></div>
                  </dl>
                  <p className="mt-4 border-l-2 border-[var(--rule-strong)] pl-3 text-[15px] leading-[1.55] text-[var(--ink-2)]"><PlainText text={commitment.currentEvidence} /></p>
                  <ClaimSource record={record} sourceIds={commitment.sourceIds} />
                </article>
              )) : (
                <p className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                  No council commitment with a published deadline has been added to this record yet.
                </p>
              )}
            </div>
          </section>

          <section id="sources" className="pt-14 scroll-mt-24 max-w-[820px]">
            <h2 className="h2 mb-3">What we still do not know</h2>
            <p className="text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              This is a first, source-complete record, not a claim that every council decision is
              covered. These gaps stay visible so the page cannot pretend to know more than the
              evidence supports.
            </p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
              {record.knownGaps.map((gap) => <li key={gap}><PlainText text={gap} /></li>)}
            </ul>

            <EvidenceDetails className="mt-8" summary={`Show the ${record.sources.length} official sources`}>
              <ol className="space-y-5">
                {record.sources.map((source, index) => (
                  <li key={source.id} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="ui tnum text-[14px] text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[16px] font-[650]">
                        {source.title}
                      </a>
                      <p className="ui mt-1 text-[14px] text-[var(--muted)]">{source.publisher}{source.publishedOn ? ` · ${source.publishedOn}` : ""}</p>
                      <p className="mt-2 text-[15px] leading-[1.55] text-[var(--ink-2)]"><PlainText text={source.usedFor} /></p>
                    </div>
                  </li>
                ))}
              </ol>
            </EvidenceDetails>

            <p className="mt-7 text-[15px] leading-[1.6] text-[var(--ink-2)]">
              Council officers and elected members can send corrections or a response through the
              <Link href="/contact"> contact page</Link>. Confirmed changes will be dated and
              recorded here.
            </p>
          </section>

          <Faq items={faq} className="pt-14" />

          <CTA
            title="See the poverty figures alongside this record"
            body={`The ${council.name} area page shows the local poverty, work and pay figures that explain why council decisions matter.`}
            href={`/areas/${council.slug}`}
            cta={`See ${council.name} area facts`}
            secondaryHref="/representatives"
            secondaryCta="Find the people who represent you"
          />

          <CouncilWatch councilName={record.councilName} />
        </ContentFrame>
      </Page>
    </>
  );
}
