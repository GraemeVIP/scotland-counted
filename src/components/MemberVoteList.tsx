import type { VoteRecord } from "@/lib/voting";
import { formatVoteDate } from "@/lib/voting";
import { ExplainText } from "@/components/Glossary";
import {
  explainVote,
  voteSubstance,
  inferStance,
  plainResult,
  plainVoteLabel,
} from "@/lib/voteExplainers";

function VoteCard({ vote, name }: { vote: VoteRecord; name: string }) {
  const positive = /^(aye|yes|for)$/i.test(vote.vote);
  const negative = /^(no|against)$/i.test(vote.vote);
  const explainer = explainVote(vote.title);
  const substance = voteSubstance(vote.title);
  const stance = inferStance(vote.title, vote.vote);

  return (
    <article className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[13.5px] text-[var(--muted)] mb-1">
            <time dateTime={vote.date} className="font-[560] text-[var(--ink-2)]">
              {formatVoteDate(vote.date)}
            </time>
            {explainer && <span>· {explainer.kind}</span>}
            {vote.result && <span>· {plainResult(vote.result)}</span>}
          </div>
          <h3 className="ui text-[16.5px] font-[660] leading-[1.35] text-[var(--ink)]">
            {substance?.title ?? vote.title}
          </h3>
          {substance && (
            <p className="ui mt-0.5 text-[12.5px] leading-[1.4] text-[var(--muted)]">
              Official name: {vote.title}
            </p>
          )}
        </div>
        <span
          className={`ui shrink-0 rounded-full border px-3 py-1 text-[14.5px] font-[620] ${
            positive
              ? "border-[var(--good-text)] text-[var(--good-text)]"
              : negative
                ? "border-[var(--bad-text)] text-[var(--bad-text)]"
                : "border-[var(--brand)] text-[var(--brand)]"
          }`}
        >
          {plainVoteLabel(vote.vote)}
        </span>
      </div>

      {/* Plain-English Bill Summary + Inferred Stance */}
      <div className="mt-3 rounded-[var(--r-s)] border-l-[3px] border-[var(--brand)] bg-[var(--surface-2)] px-3.5 py-2.5 text-[14.5px] leading-[1.5] text-[var(--ink-2)] space-y-1.5">
        <ExplainText>
          {substance ? (
            <p>
              <strong className="text-[var(--ink)]">What this vote was about:</strong>{" "}
              {substance.what}
              {substance.example ? ` ${substance.example}` : ""}
            </p>
          ) : (
            explainer && (
              <p>
                <strong className="text-[var(--ink)]">What kind of vote this was:</strong>{" "}
                {explainer.plain}
              </p>
            )
          )}
          <p>
            <strong className="text-[var(--ink)]">What {name}&apos;s vote meant:</strong> {stance}
          </p>
        </ExplainText>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[13.5px] text-[var(--muted)]">
        <span>
          Official record: {vote.vote}
          {vote.reference ? ` · ${vote.reference}` : ""}
        </span>
      </div>
    </article>
  );
}

export default function MemberVoteList({
  name,
  votes,
  parliament,
}: {
  name: string;
  votes: VoteRecord[];
  parliament: "Commons" | "Holyrood";
}) {
  const initialVotes = votes.slice(0, 4);
  const remainingVotes = votes.slice(4);

  return (
    <section
      className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 sm:p-8"
      aria-labelledby="member-votes"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="kicker mb-2 text-[var(--brand)]">
            Voting record · {parliament === "Commons" ? "Westminster" : "Holyrood"} ({votes.length} latest votes)
          </p>
          <h2 id="member-votes" className="h2">
            How {name} voted, in plain English
          </h2>
        </div>
      </div>
      <p className="mt-2 max-w-[66ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
        <ExplainText>
          Parliament gives every vote a long, confusing legal title. Under each vote below, we tell
          you in plain English what the vote was really about and what {name} voted to do.
        </ExplainText>
      </p>

      {votes.length > 0 ? (
        <div className="mt-5 space-y-3">
          {initialVotes.map((vote) => (
            <VoteCard
              key={`${vote.sourceUrl}-${vote.date}-${vote.title}-${vote.vote}`}
              vote={vote}
              name={name}
            />
          ))}

          {remainingVotes.length > 0 && (
            <details className="group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)]">
              <summary className="ui cursor-pointer list-none flex items-center justify-between px-4 py-3.5 text-[15.5px] font-[600] text-[var(--action-text)] hover:bg-[var(--surface-2)]">
                <span>
                  Show {remainingVotes.length} more recorded votes for {name}
                </span>
                <span className="transition-transform group-open:rotate-90" aria-hidden="true">
                  ▸
                </span>
              </summary>
              <div className="border-t border-[var(--rule)] p-3 sm:p-4 space-y-3 bg-[var(--surface-2)]">
                {remainingVotes.map((vote) => (
                  <VoteCard
                    key={`${vote.sourceUrl}-${vote.date}-${vote.title}-${vote.vote}`}
                    vote={vote}
                    name={name}
                  />
                ))}
              </div>
            </details>
          )}
        </div>
      ) : (
        <p className="mt-6 text-[16px] leading-[1.6] text-[var(--ink-2)]">
          <ExplainText>No recorded votes were available in the current snapshot.</ExplainText>
        </p>
      )}
    </section>
  );
}
