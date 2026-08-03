import type { VoteRecord } from "@/lib/voting";
import { formatVoteDate } from "@/lib/voting";
import { ExplainText } from "@/components/Glossary";
import { explainVote, voteSubstance, plainResult, plainVoteLabel } from "@/lib/voteExplainers";

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
        <ExplainText>
          These are the latest recorded votes published by {parliament}. A vote shows what happened
          in that vote; it does not explain why a member voted that way.
        </ExplainText>
      </p>
      {votes.length > 0 ? (
        <div className="mt-6 grid gap-3">
          {votes.map((vote) => {
            const positive = /^(aye|yes|for)$/i.test(vote.vote);
            const explainer = explainVote(vote.title);
            const substance = voteSubstance(vote.title);
            return (
              <article key={`${vote.sourceUrl}-${vote.date}-${vote.title}-${vote.vote}`} className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="ui max-w-[70ch] text-[16px] font-[750] leading-[1.4] text-[var(--ink)]">{vote.title}</h3>
                  {/* The official term stays in the record line below; the chip
                      answers the only question a visitor actually has. */}
                  <span className={`ui shrink-0 rounded-full border px-3 py-1 text-[15px] font-[750] ${positive ? "border-[var(--good-text)] text-[var(--good-text)]" : "border-[var(--brand)] text-[var(--brand)]"}`}>{plainVoteLabel(vote.vote)}</span>
                </div>
                {(explainer || substance) && (
                  <div className="mt-3 rounded-[var(--r-s)] border-l-[3px] border-[var(--brand)] bg-[var(--surface-2)] px-3.5 py-2.5">
                    {explainer && (
                      <p className="text-[15px] leading-[1.5] text-[var(--ink-2)]">
                        <strong className="text-[var(--ink)]">{explainer.kind}.</strong>{" "}
                        {explainer.plain}
                      </p>
                    )}
                    {substance && (
                      <>
                        <p className={`text-[15px] leading-[1.5] text-[var(--ink-2)] ${explainer ? "mt-1.5" : ""}`}>
                          {substance.what}
                        </p>
                        {substance.example && (
                          <p className="mt-1.5 text-[15px] leading-[1.5] text-[var(--ink-2)]">
                            {substance.example}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
                <p className="ui mt-2 text-[15px] leading-[1.5] text-[var(--ink-2)]">
                  <time dateTime={vote.date}>{formatVoteDate(vote.date)}</time>
                  {vote.result ? ` · ${plainResult(vote.result)}` : ""}
                  {` · They voted ${vote.vote}`}
                  {vote.reference ? ` · ${vote.reference}` : ""}
                </p>
                <a href={vote.sourceUrl} className="ui mt-3 inline-block text-[15px] font-[650]">Check the official record →</a>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 text-[16px] leading-[1.6] text-[var(--ink-2)]"><ExplainText>No recorded votes were available in the current snapshot.</ExplainText></p>
      )}
    </section>
  );
}
