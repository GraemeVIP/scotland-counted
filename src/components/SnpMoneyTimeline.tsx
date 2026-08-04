"use client";

import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import { ExplainText } from "@/components/Glossary";
import type {
  SnpTimelineEvent,
  SnpTimelinePhase,
  SnpTimelineStatus,
} from "@/lib/data/snpMoneyTimeline";

type TimelineSource = {
  title: string;
  publisher: string;
  url: string;
};

type Filter = "all" | SnpTimelinePhase;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Show everything" },
  { id: "foundations", label: "What court later proved" },
  { id: "fundraising", label: "Fundraising and questions" },
  { id: "investigation", label: "Police investigation" },
  { id: "court", label: "Court case" },
  { id: "aftermath", label: "What is still live" },
];

const statusStyles: Record<
  SnpTimelineStatus,
  { label: string; className: string; dot: string }
> = {
  court: {
    label: "Established in court",
    className:
      "border-[var(--good-text)] text-[var(--good-text)] bg-[color-mix(in_srgb,var(--good)_9%,var(--surface))]",
    dot: "bg-[var(--good)]",
  },
  official: {
    label: "Officially confirmed",
    className: "border-[var(--brand)] text-[var(--brand)] bg-[var(--brand-wash)]",
    dot: "bg-[var(--brand)]",
  },
  reported: {
    label: "Reported at the time",
    className:
      "border-[var(--rule-strong)] text-[var(--ink-2)] bg-[var(--surface-2)]",
    dot: "bg-[var(--ink-2)]",
  },
  allegation: {
    label: "Allegation at that stage",
    className:
      "border-[var(--warn-text)] text-[var(--warn-text)] bg-[color-mix(in_srgb,var(--warn)_10%,var(--surface))]",
    dot: "bg-[var(--warn)]",
  },
  context: {
    label: "Context, not evidence of guilt",
    className:
      "border-[var(--rule-strong)] text-[var(--muted)] bg-[var(--surface-2)]",
    dot: "bg-[var(--muted)]",
  },
  ongoing: {
    label: "Still ongoing",
    className: "border-[var(--action)] text-[var(--action-text)] bg-[var(--action-tint)]",
    dot: "bg-[var(--action)]",
  },
};

export default function SnpMoneyTimeline({
  events,
  sources,
}: {
  events: SnpTimelineEvent[];
  sources: Record<string, TimelineSource>;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    const selected = filter === "all" ? events : events.filter((event) => event.phase === filter);
    return [...selected].sort((a, b) => a.dateTime.localeCompare(b.dateTime));
  }, [events, filter]);

  const groups = useMemo(() => {
    const ordered: { id: string; label: string; events: SnpTimelineEvent[] }[] = [];
    for (const event of visible) {
      const current = ordered[ordered.length - 1];
      if (!current || current.id !== event.group) {
        ordered.push({ id: event.group, label: event.groupLabel, events: [event] });
      } else {
        current.events.push(event);
      }
    }
    return ordered;
  }, [visible]);

  return (
    <section className="not-prose my-9" aria-labelledby="full-timeline-heading">
      <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-6">
        <p className="label mb-2">Choose how much to see</p>
        <h3 id="full-timeline-heading" className="text-[24px] font-[780] leading-[1.2] text-[var(--ink)]">
          The complete timeline
        </h3>
        <p className="mt-2 max-w-[62ch] text-[16px] leading-[1.55] text-[var(--ink-2)]">
          “Show everything” is the full story. The filters only make it easier to revisit one
          part; they do not change the evidence.
        </p>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter timeline events">
          {filters.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={active}
                className={`ui min-h-11 rounded-[var(--r-pill)] border px-4 py-2 text-[15px] font-[680] transition-colors ${
                  active
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)] hover:border-[var(--brand)] hover:text-[var(--ink)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-[15px] text-[var(--muted)]" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? "event" : "events"}.
        </p>
      </div>

      <div className="mt-10 space-y-14">
        {groups.map((group, groupIndex) => (
          <Reveal key={group.id} delay={(groupIndex % 3) * 50}>
            <section aria-labelledby={`timeline-${group.id}`}>
              <div className="mb-6 flex items-center gap-4">
                <h3
                  id={`timeline-${group.id}`}
                  className="display-stat shrink-0 text-[27px] leading-[1.1] text-[var(--ink)] sm:text-[32px]"
                >
                  {group.label}
                </h3>
                <span className="h-px flex-1 bg-[var(--rule-strong)]" aria-hidden="true" />
              </div>

              <ol className="relative ml-2 border-l-2 border-[var(--rule-strong)] sm:ml-[116px]">
                {group.events.map((event) => {
                  const status = statusStyles[event.status];
                  return (
                    <li key={event.id} className="relative pb-8 pl-6 last:pb-0 sm:pl-9">
                      <span
                        className={`absolute -left-[8px] top-[8px] h-[14px] w-[14px] rounded-full border-[3px] border-[var(--paper)] shadow-[0_0_0_1px_var(--rule-strong)] ${status.dot}`}
                        aria-hidden="true"
                      />
                      <time
                        dateTime={event.dateTime}
                        className="ui mb-2 block text-[15px] font-[760] leading-[1.35] text-[var(--action-text)] sm:absolute sm:right-[calc(100%+37px)] sm:top-[5px] sm:w-[92px] sm:text-right"
                      >
                        {event.date}
                      </time>
                      <article className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)] transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-2)] sm:p-6">
                        <span
                          className={`ui inline-flex rounded-[var(--r-pill)] border px-3 py-1 text-[15px] font-[720] leading-[1.35] ${status.className}`}
                        >
                          <ExplainText>{status.label}</ExplainText>
                        </span>
                        <h4 className="mt-3 text-[21px] font-[770] leading-[1.25] tracking-[-0.015em] text-[var(--ink)] sm:text-[23px]">
                          <ExplainText>{event.title}</ExplainText>
                        </h4>
                        <p className="mt-3 text-[17px] leading-[1.62] text-[var(--ink-2)]">
                          <ExplainText>{event.summary}</ExplainText>
                        </p>
                        {event.explainer && (
                          <p className="mt-4 border-l-[3px] border-[var(--action)] pl-4 text-[16px] font-[620] leading-[1.55] text-[var(--ink)]">
                            <span className="ui font-[760] text-[var(--action-text)]">In everyday language: </span>
                            <ExplainText>{event.explainer}</ExplainText>
                          </p>
                        )}
                        <div className="mt-5 border-t border-[var(--rule)] pt-4">
                          <p className="ui text-[15px] font-[720] text-[var(--muted)]">
                            {event.sourceIds.length === 1 ? "Source" : "Sources"}
                          </p>
                          <ul className="mt-2 space-y-2">
                            {event.sourceIds.map((sourceId) => {
                              const source = sources[sourceId];
                              if (!source) return null;
                              return (
                                <li key={sourceId} className="text-[15px] leading-[1.5] text-[var(--ink-2)]">
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-[700] text-[var(--ink)] underline decoration-[var(--rule-strong)] underline-offset-3 hover:decoration-[var(--brand)]"
                                  >
                                    {source.title}
                                  </a>{" "}
                                  <span className="text-[var(--muted)]">, {source.publisher}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ol>
            </section>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
