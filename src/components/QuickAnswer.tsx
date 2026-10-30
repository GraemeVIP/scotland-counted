export type QuickAnswerData = {
  /** The question in the searcher's words, e.g. "Minimum wage Scotland, 21 and over". */
  label: string;
  /** The headline figure, e.g. "£12.71". Omit for a written answer. */
  value?: string;
  /** What the figure counts, e.g. "an hour". */
  unit?: string;
  /** One or two plain sentences that complete the answer. */
  detail: string;
  /** Supporting figures shown as a short table. */
  rows?: Array<{ label: string; value: string }>;
  /** When the answer applies, e.g. "From 1 April 2026". */
  asOf?: string;
  source?: { publisher: string; url: string };
};

/**
 * The answer, before anything else.
 *
 * Every money, council tax and benefit guide opens with this box: the figure,
 * what it applies to, when, and where it came from. It is what the reader
 * searched for, and it is the part Google and Bing lift into their own answer
 * boxes. All text on the blue uses --hero-ink and --hero-muted, which the
 * contrast check holds against the lightest blue in the gradient.
 */
export default function QuickAnswer({ answer, className = "" }: { answer: QuickAnswerData; className?: string }) {
  return (
    <section className={`answer-box ${className}`} aria-label={`Quick answer: ${answer.label}`}>
      <div className="beams" aria-hidden="true">
        <div className="beam a" />
        <div className="beam b" />
        <div className="beam-edge a" />
        <div className="beam-edge b" />
      </div>
      <div className={answer.rows?.length ? "grid gap-x-10 gap-y-7 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-end" : ""}>
        <div className="min-w-0">
          <p className="answer-label">Quick answer · {answer.label}</p>
          {answer.value && (
            <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {/* A place name runs longer than a figure, so it gets a smaller size to stay on a phone screen. */}
              <span
                className={`answer-value ${
                  answer.value.length > 8 ? "text-[clamp(38px,6.4vw,84px)] [overflow-wrap:anywhere]" : "text-[clamp(56px,8vw,104px)]"
                }`}
              >
                {answer.value}
              </span>
              {answer.unit && <span className="text-[17px] text-[var(--hero-muted)]">{answer.unit}</span>}
            </p>
          )}
          <p className={`answer-detail max-w-[52ch] text-[17px] leading-[1.55] ${answer.value ? "mt-4" : "mt-3 text-[19px] text-white"}`}>
            {answer.detail}
          </p>
        </div>
        {answer.rows && answer.rows.length > 0 && (
          <dl className="grid gap-px overflow-hidden rounded-[var(--r-m)] border border-white/15 bg-white/10">
            {answer.rows.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-4 bg-[rgba(2,30,80,0.55)] px-4 py-3">
                <dt className="text-[15px] text-[var(--hero-muted)]">{row.label}</dt>
                {/* Right aligned even when it wraps, so a long value lines up with the short ones above and below. */}
                <dd className="m-0 text-right text-[16px] font-[600] leading-[1.4] tnum text-white [text-wrap:balance]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {(answer.asOf || answer.source) && (
        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/15 pt-4 text-[14px] text-[var(--hero-muted)]">
          {answer.asOf && <span>{answer.asOf}</span>}
          {answer.source && (
            <span>
              Source{" "}
              <a href={answer.source.url} target="_blank" rel="noopener noreferrer" className="font-[560] text-white underline underline-offset-4">
                {answer.source.publisher}
              </a>
            </span>
          )}
        </p>
      )}
    </section>
  );
}
