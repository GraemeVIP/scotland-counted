import Link from "next/link";
import { notFound } from "next/navigation";
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
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";

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
      `See ${record.councilName}'s published funding pressure, service targets, audit findings and promises, with every claim linked to an official source.`,
    path: `/councils/${record.councilSlug}`,
  });
}

function money(value: number, unit: "million" | "billion", qualifier?: "over" | "projected" | "expected") {
  const figure = `£${value}${unit === "million" ? "m" : "bn"}`;
  return qualifier === "over"
    ? `Over ${figure}`
    : qualifier === "projected"
      ? `Projected ${figure}`
      : qualifier === "expected"
        ? `Expected ${figure}`
        : figure;
}

function statusLabel(status: PerformanceOutcome["status"] | CommitmentStatus | AuditFinding["status"]) {
  return {
    met: "Target met",
    missed: "Target missed",
    "not-comparable": "Not directly comparable",
    "not-verified": "Needs a fresh check",
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
  const missed = record.outcomes.filter((outcome) => outcome.status === "missed");
  const sameMeasureMisses = missed.filter((outcome) => !outcome.comparisonNote).length;
  const countBasedMisses = missed.length - sameMeasureMisses;
  const allocation = record.budgetContext.find((figure) => figure.id === "day-to-day-funding-2025-26");
  const allocationText = allocation ? money(allocation.value, allocation.unit, allocation.qualifier) : "the published allocation";
  const openFindings = record.auditFindings.filter((finding) => finding.status === "open");
  const faq = [
    {
      q: `How much money does ${record.councilName} receive?`,
      a: `${record.councilName} was reported to receive ${allocationText} for day-to-day services in 2025/26. That is a funding allocation, not the final outturn, and the other figures on this page are kept separate so they are not confused with it.`,
    },
    {
      q: `Has ${record.councilName} missed any targets?`,
      a: `${record.councilName} missed ${sameMeasureMisses} same-measure service target${sameMeasureMisses === 1 ? "" : "s"} in this first record. ${countBasedMisses > 0 ? `A further ${countBasedMisses} entry records failures as a count rather than a percentage, because the source does not publish the matching denominator.` : "The source notes explain how each comparison was made."}`,
    },
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
          keywords: [record.councilName, "council budget", "council performance", "audit findings"],
        })}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <Page>
        <PageHeader
          eyebrow={`Council accountability · Checked ${record.lastReviewedOn}`}
          title={`${record.councilName}: budgets, performance and promises`}
          lede={record.summary}
        />

        <ContentFrame>
          <InShort expert={false}>
            <p>
              <strong>The short version:</strong> {record.councilName} has money coming in, but it also faces a
              large projected gap. Official figures show some service targets were missed, while
              independent auditors and the housing regulator have raised wider concerns.
            </p>
            <p>
              This page keeps the bad news visible without turning a forecast, a target or a count
              into something it does not mean. Open the source links when you want the full detail.
            </p>
          </InShort>

          <nav
            aria-label="On this council page"
            className="mt-8 flex flex-wrap gap-2 border-y border-[var(--rule)] py-4"
          >
            {["money", "performance", "audit-trail", "promises", "sources"].map((anchor) => (
              <a
                key={anchor}
                href={`#${anchor}`}
                className="ui rounded-[var(--r-pill)] border border-[var(--rule)] px-3.5 py-2 text-[15px] font-[650] text-[var(--ink-2)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                {anchor === "audit-trail"
                  ? "Audit findings"
                  : anchor.charAt(0).toUpperCase() + anchor.slice(1)}
              </a>
            ))}
          </nav>

          <section id="money" className="pt-12 scroll-mt-24">
            <p className="kicker mb-2 text-[var(--brand)]">Follow the money</p>
            <h2 className="h2 mb-3">What the published figures say</h2>
            <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              A funding allocation is not the same thing as money left to spend. A projected gap is
              not the same thing as a bill already unpaid. These cards keep those ideas separate.
            </p>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {record.budgetContext.map((figure) => (
                <article
                  key={figure.id}
                  className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--brand)] bg-[var(--surface)] p-6"
                >
                  <p className="ui text-[15px] font-[750] leading-[1.4] text-[var(--muted)]">{figure.label}</p>
                  <p className="figure-num mt-4 text-[42px] leading-none text-[var(--brand)]">
                    {money(figure.value, figure.unit, figure.qualifier)}
                  </p>
                  <p className="ui mt-3 text-[15px] font-[650] text-[var(--ink-2)]">{figure.period}</p>
                  <p className="mt-4 text-[16px] leading-[1.55] text-[var(--ink-2)]">{figure.plainEnglish}</p>
                  <ClaimSource record={record} sourceIds={figure.sourceIds} />
                </article>
              ))}
            </div>
          </section>

          <section id="performance" className="pt-14 scroll-mt-24">
            <p className="kicker mb-2 text-[var(--action)]">Promises versus results</p>
            <h2 className="h2 mb-3">Service targets: what was missed and what was met</h2>
            <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              Most cards compare the council&apos;s own target and reported result using the same
              measure. The homelessness entry is different: the regulator publishes a count of
              failures against a statutory duty, not a percentage, so it is labelled clearly
              instead of being turned into a made-up rate.
            </p>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {record.outcomes.map((outcome) => (
                <article
                  key={outcome.id}
                  className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="ui text-[15px] font-[750] text-[var(--muted)]">{outcome.service}</p>
                      <h3 className="h3 mt-2">{outcome.measure}</h3>
                    </div>
                    <span className={`ui shrink-0 rounded-[var(--r-pill)] border px-3 py-1.5 text-[14px] font-[750] ${statusClass(outcome.status)}`}>
                      {statusLabel(outcome.status)}
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-[var(--r-s)] bg-[var(--surface-2)] p-4">
                      <p className="ui text-[14px] font-[700] text-[var(--muted)]">Target</p>
                      <p className="mt-1 text-[23px] font-[700] tnum">{outcome.target}</p>
                    </div>
                    <div className="rounded-[var(--r-s)] bg-[var(--surface-2)] p-4">
                      <p className="ui text-[14px] font-[700] text-[var(--muted)]">Reported result</p>
                      <p className="mt-1 text-[23px] font-[700] tnum">{outcome.actual}</p>
                    </div>
                  </div>
                  <p className="ui mt-4 text-[15px] leading-[1.5] text-[var(--ink-2)]">
                    Period: {outcome.period}{outcome.variance ? ` · ${outcome.variance}` : ""}
                  </p>
                  {outcome.comparisonNote && (
                    <p className="mt-3 border-l-2 border-[var(--brand)] pl-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">
                      {outcome.comparisonNote}
                    </p>
                  )}
                  <ClaimSource record={record} sourceIds={outcome.sourceIds} />
                </article>
              ))}
            </div>
          </section>

          <section id="audit-trail" className="pt-14 scroll-mt-24">
            <p className="kicker mb-2 text-[var(--bad-text)]">Independent scrutiny</p>
            <h2 className="h2 mb-3">What auditors and regulators found</h2>
            <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              These are findings from Audit Scotland, the Accounts Commission and the Scottish
              Housing Regulator. They are not anonymous complaints or political commentary.
            </p>
            <div className="mt-7 grid gap-4">
              {record.auditFindings.map((finding) => (
                <article
                  key={finding.id}
                  className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="ui text-[15px] font-[750] text-[var(--muted)]">{finding.publisher} · {finding.reportDate}</p>
                      <h3 className="h3 mt-2">{finding.title}</h3>
                    </div>
                    <span className={`ui shrink-0 rounded-[var(--r-pill)] border px-3 py-1.5 text-[14px] font-[750] ${statusClass(finding.status)}`}>
                      {statusLabel(finding.status)}
                    </span>
                  </div>
                  <p className="mt-4 max-w-[78ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">{finding.finding}</p>
                  {finding.recommendation && (
                    <p className="mt-4 max-w-[78ch] border-l-2 border-[var(--brand)] pl-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">
                      <strong>What was recommended:</strong> {finding.recommendation}
                    </p>
                  )}
                  {finding.managementResponse && (
                    <p className="mt-3 max-w-[78ch] text-[15px] leading-[1.55] text-[var(--ink-2)]">
                      <strong>The recorded response:</strong> {finding.managementResponse}
                    </p>
                  )}
                  <ClaimSource record={record} sourceIds={finding.sourceIds} />
                </article>
              ))}
            </div>
            {openFindings.length > 0 && (
              <p className="mt-5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                {openFindings.length} finding{openFindings.length === 1 ? " remains" : "s remain"} marked open in this record. That is a status from the source, not a claim that nothing has changed since publication.
              </p>
            )}
          </section>

          <section id="promises" className="pt-14 scroll-mt-24">
            <p className="kicker mb-2 text-[var(--brand)]">What was promised</p>
            <h2 className="h2 mb-3">Commitments and deadlines</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {record.commitments.map((commitment) => (
                <article key={commitment.id} className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="h3">{commitment.title}</h3>
                    <span className={`ui shrink-0 rounded-[var(--r-pill)] border px-3 py-1.5 text-[14px] font-[750] ${statusClass(commitment.status)}`}>
                      {statusLabel(commitment.status)}
                    </span>
                  </div>
                  <p className="mt-4 text-[16px] leading-[1.6] text-[var(--ink-2)]">{commitment.commitment}</p>
                  <dl className="mt-5 grid gap-2 text-[15px] leading-[1.5] text-[var(--ink-2)]">
                    <div><dt className="inline font-[700]">Owner:</dt> <dd className="inline">{commitment.owner}</dd></div>
                    <div><dt className="inline font-[700]">Due:</dt> <dd className="inline">{commitment.dueBy ?? "No date published"}</dd></div>
                  </dl>
                  <p className="mt-4 border-l-2 border-[var(--rule-strong)] pl-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">{commitment.currentEvidence}</p>
                  <ClaimSource record={record} sourceIds={commitment.sourceIds} />
                </article>
              ))}
            </div>
          </section>

          <section id="sources" className="pt-14 scroll-mt-24 max-w-[820px]">
            <h2 className="h2 mb-3">What is still missing</h2>
            <p className="text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              This is a first, source-complete record, not a claim that every council decision is
              covered. These gaps stay visible so the page cannot pretend to know more than the
              evidence supports.
            </p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
              {record.knownGaps.map((gap) => <li key={gap}>{gap}</li>)}
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
                      <p className="mt-2 text-[15px] leading-[1.55] text-[var(--ink-2)]">{source.usedFor}</p>
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
        </ContentFrame>
      </Page>
    </>
  );
}
