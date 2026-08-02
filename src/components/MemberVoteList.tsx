import type { VoteRecord } from "@/lib/voting";
import { formatVoteDate } from "@/lib/voting";

export default function MemberVoteList({
  name,
  votes,
  parliament,
}: {
  name: string;
  votes: VoteRecord[];
  parliament: "Commons" | "Holyrood";
}) {
  return (
    <section className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 sm:p-8" aria-labelledby="member-votes">
      <p className="kicker mb-3 text-[var(--brand)]">Recorded votes</p>
      <h2 id="member-votes" className="h2 mb-3">How {name} has voted</h2>
      <p className="text-[16px] leading-[1.6] text-[var(--ink-2)]">
        These are the latest recorded divisions published by {parliament}. A vote shows what happened in that division; it does not explain why a member voted that way.
      </p>
      {votes.length > 0 ? (
        <div className="mt-6 grid gap-3">
          {votes.map((vote) => {
            const positive = /^(aye|yes|for)$/i.test(vote.vote);
            return (
              <article key={`${vote.sourceUrl}-${vote.date}-${vote.title}-${vote.vote}`} className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="ui max-w-[70ch] text-[16px] font-[750] leading-[1.4] text-[var(--ink)]">{vote.title}</h3>
                  <span className={`ui shrink-0 rounded-full border px-3 py-1 text-[15px] font-[750] ${positive ? "border-[var(--good-text)] text-[var(--good-text)]" : "border-[var(--brand)] text-[var(--brand)]"}`}>{vote.vote}</span>
                </div>
                <p className="ui mt-2 text-[15px] leading-[1.5] text-[var(--ink-2)]">
                  <time dateTime={vote.date}>{formatVoteDate(vote.date)}</time>{vote.result ? ` · Result: ${vote.result}` : ""}{vote.reference ? ` · ${vote.reference}` : ""}
                </p>
                <a href={vote.sourceUrl} className="ui mt-3 inline-block text-[15px] font-[650]">Check the official record →</a>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 text-[16px] leading-[1.6] text-[var(--ink-2)]">No recorded votes were available in the current snapshot.</p>
      )}
    </section>
  );
}
