import type { ReactNode } from "react";
import { G } from "@/components/Glossary";
import { formatVoteDate, type VoteRecord } from "@/lib/voting";
import { holyroodConstituencies, holyroodRegions } from "@/lib/data/holyrood";
import {
  debateTopic,
  groupHolyroodVotes,
  HOLYROOD_DIVISIONS_SOURCE,
  partyCode,
  partyShortName,
  passed,
  proposerName,
  type HolyroodVoteRow,
  type VoteChoice,
} from "@/lib/holyroodVotes";

/**
 * An MSP's recent Holyrood votes, written for a reader of about ten.
 *
 * Same rules as the MP version: say what each vote was about and what
 * happened, never which side was right. The filter and jump links work
 * without JavaScript (the filter uses CSS :has, and simply shows every vote
 * in browsers without it).
 */

const CHOICES: Record<
  VoteChoice,
  { label: string; pill: string; tint: string; text: string }
> = {
  yes: {
    label: "Yes",
    pill: "border-[var(--good)] bg-[color-mix(in_srgb,var(--good)_14%,var(--surface))] text-[var(--good-text)]",
    tint: "border-l-[var(--good)]",
    text: "text-[var(--good-text)]",
  },
  no: {
    label: "No",
    pill: "border-[var(--bad)] bg-[color-mix(in_srgb,var(--bad)_12%,var(--surface))] text-[var(--bad-text)]",
    tint: "border-l-[var(--bad)]",
    text: "text-[var(--bad-text)]",
  },
  abstain: {
    label: "Abstain",
    pill: "border-[var(--warn)] bg-[color-mix(in_srgb,var(--warn)_16%,var(--surface))] text-[var(--warn-text)]",
    tint: "border-l-[var(--warn)]",
    text: "text-[var(--warn-text)]",
  },
  notVoted: {
    label: "Did not vote",
    pill: "border-dashed border-[var(--flat)] bg-[var(--surface-2)] text-[var(--flat-text)]",
    tint: "border-l-[var(--flat)]",
    text: "text-[var(--flat-text)]",
  },
};

const CHOICE_ORDER: VoteChoice[] = ["yes", "no", "abstain", "notVoted"];

function ChoiceIcon({ choice, className = "h-4 w-4" }: { choice: VoteChoice; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };
  if (choice === "yes") return <svg {...common}><path d="M3 8.5l3.2 3L13 4.5" /></svg>;
  if (choice === "no") return <svg {...common}><path d="M4 4l8 8M12 4l-8 8" /></svg>;
  if (choice === "abstain") return <svg {...common}><path d="M3.5 8h9" /></svg>;
  return (
    <svg {...common} strokeWidth={1.8}>
      <circle cx="8" cy="8" r="5.5" strokeDasharray="2.4 2.2" />
    </svg>
  );
}

function ChoicePill({ choice, size = "md" }: { choice: VoteChoice; size?: "md" | "sm" }) {
  const c = CHOICES[choice];
  return (
    <span
      className={`ui inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] font-[700] ${c.pill} ${
        size === "md" ? "px-3 py-1 text-[15px]" : "px-2 py-0.5 text-[13px]"
      }`}
    >
      <ChoiceIcon choice={choice} className={size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      {c.label}
    </span>
  );
}

const partySeats = (() => {
  const counts = new Map<string, number>();
  const all = [...holyroodConstituencies.map((c) => c.msp), ...holyroodRegions.flatMap((r) => r.msps)];
  for (const msp of all) counts.set(msp.party, (counts.get(msp.party) ?? 0) + 1);
  return { total: all.length, biggest: Math.max(0, ...counts.values()) };
})();

function HowHolyroodVotes() {
  return (
    <div className="mt-5 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-4 sm:px-5">
      <h3 className="ui text-[16.5px] font-[700] text-[var(--ink)]">
        How voting works at the Scottish Parliament
      </h3>
      <ul className="mt-3 space-y-2.5 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
        <li>
          <strong className="text-[var(--ink)]">MSPs vote at <G t="decision-time">Decision Time</G>.</strong>{" "}
          This is usually around 5pm. They vote on everything they talked about that day.
        </li>
        <li>
          <strong className="text-[var(--ink)]">A debate starts with a main idea.</strong> This is
          called a <G t="motion">motion</G>. Other parties can ask to change it. A change is called
          an <G t="amendment">amendment</G>. MSPs vote on each change first, then on the final
          motion.
        </li>
        <li>
          <strong className="text-[var(--ink)]">Every MSP can say Yes, No or <G t="abstain">Abstain</G>.</strong>{" "}
          Abstain means they took part but did not pick a side. Each counted vote is called a{" "}
          <G t="division">division</G>.
        </li>
        <li>
          <strong className="text-[var(--ink)]">A vote passes if more MSPs say Yes than No.</strong>{" "}
          Abstain votes do not count for either side.
          {partySeats.biggest * 2 < partySeats.total
            ? ` No party has more than half of the ${partySeats.total} MSPs, so a party needs help from other parties to win a vote.`
            : ""}
        </li>
        <li>
          <strong className="text-[var(--ink)]">Most of these votes do not change the law on their own.</strong>{" "}
          They show what the Parliament thinks about a topic.
        </li>
      </ul>
      <div className="mt-4 border-t border-[var(--rule)] pt-3.5">
        <p className="ui text-[14px] font-[640] text-[var(--ink)]">What the labels mean</p>
        <ul className="mt-2 grid gap-2 text-[14.5px] leading-[1.45] text-[var(--ink-2)] sm:grid-cols-2">
          <li className="flex flex-wrap items-center gap-x-2.5 gap-y-1"><ChoicePill choice="yes" size="sm" /> They agreed with it.</li>
          <li className="flex flex-wrap items-center gap-x-2.5 gap-y-1"><ChoicePill choice="no" size="sm" /> They disagreed with it.</li>
          <li className="flex flex-wrap items-center gap-x-2.5 gap-y-1"><ChoicePill choice="abstain" size="sm" /> They did not pick a side.</li>
          <li className="flex flex-wrap items-center gap-x-2.5 gap-y-1"><ChoicePill choice="notVoted" size="sm" /> No vote was recorded. The record does not say why.</li>
        </ul>
      </div>
    </div>
  );
}

function SummaryTile({ label, value, children }: { label: string; value: ReactNode; children?: ReactNode }) {
  return (
    <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-4">
      <p className="ui text-[13px] font-[640] uppercase tracking-[0.04em] text-[var(--muted)]">{label}</p>
      <p className="figure-num tnum mt-1.5 text-[28px] leading-none text-[var(--ink)]">{value}</p>
      {children && <p className="ui mt-2 text-[14px] leading-[1.45] text-[var(--ink-2)]">{children}</p>}
    </div>
  );
}

function VoteRow({ row, name, partyShort }: { row: HolyroodVoteRow; name: string; partyShort: string | null }) {
  const { vote, choice, amendment, division, partyLine } = row;
  const c = CHOICES[choice];
  const proposer = proposerName(division?.broughtBy ?? null);
  const didPass = passed(vote.result ?? division?.result);
  const isChange = amendment !== null;

  const what = isChange ? (
    <>
      A change (an <G t="amendment">amendment</G>){proposer ? ` put forward by ${proposer}` : ""}.
    </>
  ) : (
    <>
      The final vote on the main idea (the <G t="motion">motion</G>)
      {proposer ? `, put forward by ${proposer}` : ""}.
    </>
  );

  const stance =
    choice === "yes"
      ? `${name} voted for ${isChange ? "this change" : "the motion"}.`
      : choice === "no"
        ? `${name} voted against ${isChange ? "this change" : "the motion"}.`
        : choice === "abstain"
          ? `${name} took part but did not pick a side.`
          : `No vote was recorded for ${name}.`;

  return (
    <li
      data-choice={choice}
      className={`rounded-[var(--r-s)] border border-[var(--rule)] border-l-[5px] ${c.tint} bg-[var(--surface)] px-4 py-3.5`}
    >
      <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <ChoicePill choice={choice} />
        <div className="min-w-0 flex-1 basis-[14rem]">
          <p className="text-[16px] font-[600] leading-[1.45] text-[var(--ink)]">{what}</p>
          <p className="mt-0.5 text-[15px] leading-[1.5] text-[var(--ink-2)]">{stance}</p>
        </div>
      </div>
      <dl className="ui mt-3 grid gap-x-4 gap-y-1.5 text-[14px] leading-[1.45] text-[var(--ink-2)] sm:grid-cols-[auto_1fr]">
        <dt className="font-[640] text-[var(--ink)]">Result</dt>
        <dd>
          {didPass === null ? (
            vote.result ?? "Not published"
          ) : (
            <span className={`font-[680] ${didPass ? "text-[var(--good-text)]" : "text-[var(--bad-text)]"}`}>
              {didPass ? "✓ Passed" : "✗ Did not pass"}
            </span>
          )}
          {division && (
            <span className="tnum">
              {" "}· {division.yes} yes, {division.no} no, {division.abstain} abstain
            </span>
          )}
        </dd>
        {partyLine && partyShort && (
          <>
            <dt className="font-[640] text-[var(--ink)]">Their party</dt>
            <dd>
              Most {partyShort} MSPs voted{" "}
              <strong className={`font-[680] ${CHOICES[partyLine].text}`}>{CHOICES[partyLine].label}</strong>
              {choice === partyLine ? " too." : "."}
            </dd>
          </>
        )}
      </dl>
      {vote.reference && (
        <p className="ui mt-2 text-[12.5px] text-[var(--muted)]">Official reference: {vote.reference}</p>
      )}
    </li>
  );
}

export default function MspVoteList({
  name,
  party,
  votes,
}: {
  name: string;
  party: string;
  votes: VoteRecord[];
}) {
  const debates = groupHolyroodVotes(votes, party);
  const rows = debates.flatMap((d) => d.rows);
  const code = partyCode(party);
  const partyShort = partyShortName(code);

  const counts = Object.fromEntries(CHOICE_ORDER.map((ch) => [ch, rows.filter((r) => r.choice === ch).length])) as Record<
    VoteChoice,
    number
  >;
  const compared = rows.filter((r) => r.partyLine && r.choice !== "notVoted");
  const withParty = compared.filter((r) => r.choice === r.partyLine).length;
  const decided = rows.filter((r) => (r.choice === "yes" || r.choice === "no") && passed(r.vote.result) !== null);
  const winning = decided.filter((r) => (r.choice === "yes") === passed(r.vote.result)).length;

  const filters = CHOICE_ORDER.filter((ch) => counts[ch] > 0);
  const filterCss = filters
    .map(
      (ch) =>
        `#msp-votes:has(#mv-f-${ch}:checked) [data-choice]:not([data-choice="${ch}"]){display:none}` +
        `#msp-votes:has(#mv-f-${ch}:checked) [data-debate]:not(:has([data-choice="${ch}"])){display:none}`,
    )
    .join("");

  return (
    <section
      id="msp-votes"
      className="scroll-mt-24 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-8"
      aria-labelledby="msp-votes-heading"
    >
      <p className="kicker mb-2 text-[var(--brand)]">
        Voting record · Holyrood ({rows.length} latest votes)
      </p>
      <h2 id="msp-votes-heading" className="h2">
        How {name} voted, in plain English
      </h2>
      <p className="mt-2 max-w-[66ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
        These are the latest votes the Scottish Parliament has published for {name}. For each one we
        say what it was about and what happened. A vote shows what an MSP did, not why they did it.
      </p>

      {rows.length > 0 ? (
        <>
          {/* Quick summary */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {CHOICE_ORDER.map((ch) => (
              <div
                key={ch}
                className={`flex items-center gap-3 rounded-[var(--r-s)] border border-[var(--rule)] border-l-[5px] ${CHOICES[ch].tint} bg-[var(--surface)] px-3.5 py-3`}
              >
                <span className={CHOICES[ch].text}>
                  <ChoiceIcon choice={ch} className="h-5 w-5" />
                </span>
                <span>
                  <span className="figure-num tnum block text-[26px] leading-none text-[var(--ink)]">{counts[ch]}</span>
                  <span className="ui block text-[13.5px] font-[620] text-[var(--ink-2)]">
                    {ch === "yes" ? "Yes votes" : ch === "no" ? "No votes" : ch === "abstain" ? "Abstained" : "Did not vote"}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
            <SummaryTile
              label="Voted with their party"
              value={compared.length > 0 ? `${withParty} of ${compared.length}` : "Not shown"}
            >
              {compared.length > 0 && partyShort
                ? `Times ${name} voted the same way as most other ${partyShort} MSPs.`
                : code === "Ind" || code === "NPA"
                  ? `${name} is not in a party, so there is no party vote to compare with.`
                  : "There were not enough votes from their party to compare."}
            </SummaryTile>
            <SummaryTile
              label="On the winning side"
              value={decided.length > 0 ? `${winning} of ${decided.length}` : "Not shown"}
            >
              {decided.length > 0
                ? `Times ${name} said Yes or No and the vote went their way.`
                : `${name} did not say Yes or No in these votes.`}
            </SummaryTile>
          </div>

          <HowHolyroodVotes />

          {/* Jump links */}
          <nav aria-label="Jump to a debate" className="mt-6">
            <p className="ui text-[14.5px] font-[660] text-[var(--ink)]">Jump to a debate</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {debates.map((d) => (
                <li key={d.id}>
                  <a
                    href={`#${d.id}`}
                    className="ui inline-flex items-center gap-1.5 rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--surface)] px-3 py-1.5 text-[14px] font-[600] leading-[1.35] text-[var(--action-text)] no-underline hover:border-[var(--action)]"
                  >
                    {debateTopic(d.title).short}
                    <span className="tnum text-[var(--muted)]">({d.rows.length})</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Filter (CSS only) */}
          {filters.length > 1 && (
            <fieldset className="mt-4">
              <legend className="ui text-[14.5px] font-[660] text-[var(--ink)]">Show votes where {name} said</legend>
              <style dangerouslySetInnerHTML={{ __html: filterCss }} />
              <div className="mt-2 flex flex-wrap gap-2">
                {(["all", ...filters] as const).map((f) => (
                  <label
                    key={f}
                    className="ui inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] px-3 py-1.5 text-[14px] font-[600] text-[var(--ink-2)] has-[:checked]:border-[var(--action)] has-[:checked]:bg-[var(--action-tint)] has-[:checked]:text-[var(--action-text)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--action)]"
                  >
                    <input
                      type="radio"
                      name="msp-vote-filter"
                      id={`mv-f-${f}`}
                      value={f}
                      defaultChecked={f === "all"}
                      className="sr-only"
                    />
                    {f === "all" ? (
                      `All (${rows.length})`
                    ) : (
                      <>
                        <ChoiceIcon choice={f} className="h-3.5 w-3.5" />
                        {CHOICES[f].label} ({counts[f]})
                      </>
                    )}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {/* Votes, grouped by debate */}
          <div className="mt-6 space-y-5">
            {debates.map((d) => {
              const topic = debateTopic(d.title);
              return (
                <article
                  key={d.id}
                  id={d.id}
                  data-debate
                  className="scroll-mt-24 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5"
                  aria-labelledby={`${d.id}-h`}
                >
                  <p className="ui text-[13.5px] font-[600] text-[var(--muted)]">
                    <time dateTime={d.date}>{formatVoteDate(d.date)}</time> · {d.rows.length}{" "}
                    {d.rows.length === 1 ? "vote" : "votes"} in this debate
                  </p>
                  <h3 id={`${d.id}-h`} className="ui mt-1 text-[19px] font-[700] leading-[1.3] text-[var(--ink)]">
                    {topic.short}
                  </h3>
                  {topic.about && (
                    <p className="mt-1.5 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                      <strong className="text-[var(--ink)]">This debate was about:</strong> {topic.about}
                    </p>
                  )}
                  <ol className="mt-3.5 space-y-2.5">
                    {d.rows.map((row) => (
                      <VoteRow
                        key={`${row.vote.reference ?? row.vote.title}-${row.vote.date}-${row.vote.vote}`}
                        row={row}
                        name={name}
                        partyShort={partyShort}
                      />
                    ))}
                  </ol>
                  {topic.short !== d.title && (
                    <p className="ui mt-3 text-[13px] leading-[1.45] text-[var(--muted)]">
                      Official debate name: {d.title}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <HowHolyroodVotes />
          <p className="mt-6 text-[16px] leading-[1.6] text-[var(--ink-2)]">
            No recorded votes were available for {name} in the current snapshot.
          </p>
        </>
      )}

      <p className="ui mt-5 text-[14px] leading-[1.5] text-[var(--muted)]">
        Source:{" "}
        <a href={HOLYROOD_DIVISIONS_SOURCE}>Scottish Parliament Open Data, votes on motions 2026</a>.
        &ldquo;Put forward by&rdquo; and party totals come from the same official records. This is a
        record of votes only. It is not a score or a judgement.
      </p>
    </section>
  );
}
