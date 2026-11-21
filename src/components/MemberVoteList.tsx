import type { VoteRecord } from "@/lib/voting";
import { formatVoteDate } from "@/lib/voting";
import { ExplainText } from "@/components/Glossary";
import {
  explainVote,
  voteSubstance,
  voteStory,
  plainVoteLabel,
} from "@/lib/voteExplainers";

function VoteCard({ vote, name }: { vote: VoteRecord; name: string }) {
  const positive = /^(aye|yes|for)$/i.test(vote.vote);
  const negative = /^(no|against)$/i.test(vote.vote);
  const explainer = explainVote(vote.title);
  const substance = voteSubstance(vote.title, vote.date);
  const story = voteStory(vote.title, vote.vote, name, vote.result, vote.date);

  return (
    <article className="overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]">
      <div className="px-4 pb-4 pt-4 sm:px-5">
        <div className="ui flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-[var(--muted)]">
          <time dateTime={vote.date} className="font-[600] text-[var(--ink-2)]">
            {formatVoteDate(vote.date)}
          </time>
          {explainer && <span>· {explainer.kind}</span>}
        </div>
        <h3 className="ui mt-1 text-[18px] font-[680] leading-[1.3] text-[var(--ink)]">
          {substance?.title ?? vote.title}
        </h3>
        {story.by && (
          <p className="ui mt-1 text-[14px] text-[var(--ink-2)]">
            <strong className="font-[640] text-[var(--ink)]">Brought by:</strong> {story.by}
          </p>
        )}

        {/* The MP's vote, in one sentence */}
        <div
          className={`mt-3.5 flex items-start gap-3 rounded-[var(--r-s)] border-l-[4px] px-4 py-3 ${
            positive
              ? "border-[var(--good-text)] bg-[color-mix(in_srgb,var(--good)_9%,transparent)]"
              : negative
                ? "border-[var(--bad-text)] bg-[color-mix(in_srgb,var(--bad)_8%,transparent)]"
                : "border-[var(--brand)] bg-[var(--surface-2)]"
          }`}
        >
          <span
            className={`ui mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-[13px] font-[720] uppercase tracking-[0.03em] text-white ${
              positive ? "bg-[var(--good-text)]" : negative ? "bg-[var(--bad-text)]" : "bg-[var(--brand)]"
            }`}
          >
            {positive ? "Yes" : negative ? "No" : vote.vote}
          </span>
          <p className="text-[16px] font-[560] leading-[1.5] text-[var(--ink)]">
            <ExplainText>{story.stance}</ExplainText>
          </p>
        </div>

        {story.meant && (
          <p className="mt-3 text-[15.5px] leading-[1.55] text-[var(--ink)]">
            <ExplainText>
              <strong className="text-[var(--ink)]">What a yes vote meant:</strong> {story.meant}
            </ExplainText>
          </p>
        )}

        {story.result && (
          <p className="ui mt-2 text-[15px] leading-[1.5] text-[var(--ink-2)]">
            <strong className="text-[var(--ink)]">Result:</strong>{" "}
            <span
              className={`font-[640] ${story.passed ? "text-[var(--good-text)]" : "text-[var(--bad-text)]"}`}
            >
              {story.result.split(". ")[0]}.
            </span>{" "}
            {story.result.split(". ").slice(1).join(". ")}
          </p>
        )}

        {substance && (
          <p className="mt-3 border-t border-dashed border-[var(--rule)] pt-3 text-[14.5px] leading-[1.55] text-[var(--ink-2)]">
            <ExplainText>
              <strong className="text-[var(--ink)]">
                {/opposition day/i.test(vote.title)
                  ? "More detail:"
                  : /bill/i.test(vote.title)
                    ? "About the law:"
                    : "Background:"}
              </strong>{" "}
              {substance.what}
              {substance.example ? ` ${substance.example}` : ""}
            </ExplainText>
          </p>
        )}
      </div>

      <div className="border-t border-[var(--rule)] bg-[var(--surface-2)] px-4 py-2.5 text-[13px] leading-[1.45] text-[var(--muted)] sm:px-5">
        {explainer && (
          <p>
            <ExplainText>
              <strong className="text-[var(--ink-2)]">This kind of vote:</strong> {explainer.plain}
            </ExplainText>
          </p>
        )}
        <p className="mt-0.5">
          Official name: {vote.title} · Recorded as: {plainVoteLabel(vote.vote)}
        </p>
      </div>
    </article>
  );
}

function HowToRead() {
  return (
    <div className="mt-4 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3.5 sm:px-5">
      <p className="ui text-[15px] font-[680] text-[var(--ink)]">How to read these votes</p>
      <ul className="mt-2 space-y-1.5 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
        <li>
          <strong className="text-[var(--ink)]">Every vote is yes or no to one idea.</strong> The
          coloured line says, in plain words, what the MP backed or opposed.
        </li>
        <li>
          <strong className="text-[var(--ink)]">Many votes are on one small change</strong> to a new
          law, not on the whole law. The card says which.
        </li>
        <li>
          <strong className="text-[var(--ink)]">&ldquo;Brought by&rdquo; is who put the idea forward.</strong>{" "}
          The government has the most MPs, so its ideas usually pass and other parties&apos; ideas
          usually fail.
        </li>
      </ul>
    </div>
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
          Parliament gives every vote a long, confusing title. For each one, we say in one sentence
          what {name} voted for or against, and whether it passed.
        </ExplainText>
      </p>
      <HowToRead />

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
                <span
                  className="ml-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--rule-strong)] text-[13px] transition-transform group-open:rotate-90"
                  aria-hidden="true"
                >
                  ▶
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
