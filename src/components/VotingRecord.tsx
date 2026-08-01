import Link from "next/link";
import { votesForConstituency, scottishTally, type Side } from "@/lib/data/votes";
import Reveal from "@/components/Reveal";

/**
 * How this constituency's MP actually voted.
 *
 * The site asks people to write to their MP about specific things. Showing the
 * record of how that MP already voted on those things is what turns a request
 * into accountability — it is the difference between correspondence and a
 * ledger.
 *
 * Two rules hold this together. We say what each vote was on and what each
 * side meant, and we never say which side was right. And an absence is
 * reported as an absence, not as neglect: MPs miss votes for many legitimate
 * reasons and we are not in the business of implying otherwise.
 */

const VERDICT: Record<
  Side,
  { label: string; colorVar: string; bg: string; glyph: string }
> = {
  Aye: {
    label: "Voted for it",
    colorVar: "--good",
    bg: "rgba(29,122,69,0.10)",
    glyph: "✓",
  },
  No: {
    label: "Voted against it",
    colorVar: "--bad",
    bg: "rgba(168,50,31,0.10)",
    glyph: "✕",
  },
  Absent: {
    label: "Not recorded",
    colorVar: "--flat",
    bg: "rgba(125,117,104,0.10)",
    glyph: "–",
  },
};

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function VotingRecord({
  slug,
  constituency,
  className = "",
}: {
  slug: string;
  constituency: string;
  className?: string;
}) {
  const record = votesForConstituency(slug);
  if (record.length === 0) return null;

  const mpName = record.find((r) => r.mpName)?.mpName;

  return (
    <section className={className} aria-labelledby="voting-record">
      <p className="label mb-3">The record</p>
      <h2 id="voting-record" className="h2 mb-3">
        How your MP actually voted
      </h2>
      <p className="text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch]">
        Asking someone what they will do is one thing. Here is what they already did. These are
        real votes in the House of Commons by the MP for {constituency}, taken from the official
        record.
      </p>

      <div className="mt-8 space-y-5">
        {record.map(({ division, side }, i) => {
          const v = VERDICT[side];
          const tally = scottishTally(division);
          const carried = division.ayes > division.noes;

          return (
            <Reveal key={division.id} delay={i * 70}>
              <article
                className="group relative overflow-hidden rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)]"
                style={{ boxShadow: "var(--shadow-2)" }}
              >
                {/* The verdict stripe carries the meaning before any words are read. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[6px]"
                  style={{ background: `var(${v.colorVar})` }}
                />

                <div className="pl-7 pr-6 sm:pl-9 sm:pr-9 py-7">
                  <p className="ui text-[15px] font-[700] text-[var(--muted)]">
                    {division.stage} · {fmtDate(division.date)}
                  </p>

                  <h3 className="text-[26px] sm:text-[32px] font-[780] leading-[1.14] mt-1.5 max-w-[20ch]">
                    {division.headline}
                  </h3>

                  <div
                    className="inline-flex items-center gap-3 rounded-[var(--r-pill)] px-5 py-3 mt-5"
                    style={{ background: v.bg }}
                  >
                    <span
                      aria-hidden="true"
                      className="figure-num text-[20px] leading-none"
                      style={{ color: `var(${v.colorVar})` }}
                    >
                      {v.glyph}
                    </span>
                    <span className="ui text-[17px] sm:text-[19px] font-[760]">
                      {mpName ? `${mpName} ` : "Your MP "}
                      <span style={{ color: `var(${v.colorVar})` }}>{v.label.toLowerCase()}</span>
                    </span>
                  </div>

                  {side === "Absent" && (
                    <p className="text-[15.5px] leading-[1.55] text-[var(--muted)] mt-3 max-w-[58ch]">
                      Their vote was not recorded. MPs miss votes for all sorts of ordinary
                      reasons, so this is not the same as voting against — it only means they were
                      not counted that day.
                    </p>
                  )}

                  <p className="text-[17px] leading-[1.6] text-[var(--ink-2)] mt-5 max-w-[60ch]">
                    {division.plain}
                  </p>

                  <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 mt-5 pt-5 border-t border-[var(--rule)]">
                    <div>
                      <dt className="ui text-[15px] font-[700] text-[var(--good)]">
                        Voting for it meant
                      </dt>
                      <dd className="text-[15.5px] leading-[1.5] text-[var(--ink-2)] mt-1">
                        {division.ayeMeans}
                      </dd>
                    </div>
                    <div>
                      <dt className="ui text-[15px] font-[700] text-[var(--bad)]">
                        Voting against it meant
                      </dt>
                      <dd className="text-[15.5px] leading-[1.5] text-[var(--ink-2)] mt-1">
                        {division.noMeans}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-wrap items-center gap-x-7 gap-y-2 mt-5 pt-5 border-t border-[var(--rule)]">
                    <p className="ui text-[15px] text-[var(--ink-2)] tnum">
                      <span className="font-[740] text-[var(--ink)]">
                        {division.ayes} to {division.noes}
                      </span>{" "}
                      across the whole Commons — it {carried ? "passed" : "did not pass"}
                    </p>
                    <p className="ui text-[15px] text-[var(--ink-2)] tnum">
                      Scotland&apos;s 57 MPs:{" "}
                      <span className="font-[740] text-[var(--good)]">{tally.aye} for</span>,{" "}
                      <span className="font-[740] text-[var(--bad)]">{tally.no} against</span>,{" "}
                      <span className="font-[740] text-[var(--flat)]">
                        {tally.absent} not recorded
                      </span>
                    </p>
                  </div>

                  <a
                    href={`https://votes.parliament.uk/Votes/Commons/Division/${division.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui text-[15px] font-[650] inline-block mt-4"
                  >
                    Check this vote on the official record →
                  </a>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <p className="text-[16px] leading-[1.6] text-[var(--ink-2)] mt-6 max-w-[62ch]">
        This is the whole point of writing to them. A vote is a matter of public record forever,
        and so is a reply.{" "}
        <Link href="/your-power">See what happens when you email them</Link>.
      </p>
    </section>
  );
}
