import Link from "@/components/IntentLink";
import { ExplainText } from "@/components/ExplainServer";
import { G } from "@/components/Glossary";
import type { ReactNode } from "react";
import {
  LONDON_RECORD,
  SCOTTISH_MIDDLE,
  heldFrontbenchJob,
  notAnMpThatYear,
  servedFullYear,
  type MpLondonRecord as Record,
} from "@/lib/data/mpLondonRecord";

const moneyWhole = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

function shortDate(iso: string | null) {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function roleDates(start: string | null, end: string | null) {
  const from = start && start > LONDON_RECORD.start ? `from ${shortDate(start)}` : "";
  const to = end && end < "2026-12-31" ? `until ${shortDate(end)}` : "";
  return [from, to].filter(Boolean).join(", ");
}

/**
 * "What they did at Westminster" on every MP page: the Commons
 * sitting days in 2025/26 set against what the MP's second home cost, and
 * what Parliament's own records show they did there.
 */
export default function MpLondonRecord({
  record,
  name,
  party,
  secondHome,
}: {
  record: Record;
  name: string;
  party: string;
  secondHome: number;
}) {
  const days = LONDON_RECORD.sittingDays;

  if (notAnMpThatYear(record)) {
    return (
      <div className="tile p-6 sm:p-8">
        <h2 className="h3">What they did at Westminster</h2>
        <p className="ui mt-3 text-[16px] leading-[1.6] text-[var(--ink-2)]">
          {name} became an MP on {shortDate(record.memberSince)}, after IPSA&apos;s 2025/26 year
          ended. There is no full year to show yet.
        </p>
      </div>
    );
  }

  const votePct = Math.round((record.votes / LONDON_RECORD.divisions) * 100);
  const isSnp = /scottish national party/i.test(party);
  const posts = record.posts.filter((p) => p.kind !== "committee");
  const shownPosts = posts.slice(0, 4);
  const usesHotels = record.hotelNights >= 30;

  const tiles: { figure: string; label: ReactNode; compare?: ReactNode }[] = [
    {
      figure: `${moneyWhole.format(secondHome / days)} a day`,
      label: (
        <>
          Taxpayers paid {moneyWhole.format(secondHome)} for their <G t="second-home">second home</G>{" "}
          in 2025/26. Split across the {days} days the Commons sat, that is{" "}
          {moneyWhole.format(secondHome / days)} for each day.
        </>
      ),
    },
    {
      figure: `${record.votes} of ${LONDON_RECORD.divisions}`,
      label: <>Commons votes they voted in ({votePct}%)</>,
      compare: <>All MPs, on average: {Math.round(LONDON_RECORD.averageTurnoutPct)}%</>,
    },
    {
      figure: `${record.speakingDays}`,
      label: <>days they spoke in a debate, out of {days} sitting days</>,
      compare: <>Typical Scottish MP: {SCOTTISH_MIDDLE.speakingDays}</>,
    },
    {
      figure: `${record.writtenQuestions}`,
      label: (
        <>
          <G t="written-question">written questions</G> they sent to ministers
        </>
      ),
      compare: <>Typical Scottish MP: {SCOTTISH_MIDDLE.writtenQuestions}</>,
    },
  ];

  return (
    <div className="tile p-6 sm:p-8">
      <p className="kicker mb-3 text-[var(--action-text)]">2025/26 · from Parliament&apos;s own records</p>
      <h2 className="h3">What they did at Westminster</h2>
      <ExplainText>
        <p className="ui mt-3 max-w-[68ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
          The House of Commons sat on <strong className="text-[var(--ink)]">{days} days</strong> in
          IPSA&apos;s 2025/26 year, usually Monday to Thursday. Taxpayers pay for MPs&apos; homes in
          London so they can be there on those days. Here is what {name} did.
          {usesHotels && (
            <>
              {" "}
              {name} used hotels instead of renting and was paid for{" "}
              <strong className="text-[var(--ink)]">{record.hotelNights} nights</strong>,{" "}
              {record.hotelNights > days
                ? `${record.hotelNights - days} more nights than there were sitting days`
                : `against ${days} sitting days`}
              .
            </>
          )}
        </p>
      </ExplainText>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map(({ figure, label, compare }, i) => (
          <div key={i} className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-4">
            <p className="figure-num tnum text-[24px] leading-none text-[var(--ink)] sm:text-[28px]">{figure}</p>
            <p className="ui mt-2 text-[13.5px] leading-[1.4] text-[var(--ink-2)]">{label}</p>
            {compare && <p className="ui mt-1.5 text-[12.5px] text-[var(--muted)]">{compare}</p>}
          </div>
        ))}
      </div>

      {!servedFullYear(record) && (
        <p className="ui mt-4 text-[14.5px] text-[var(--ink-2)]">
          {name} became an MP on {shortDate(record.memberSince)}, part way through the year.
        </p>
      )}

      {!usesHotels && record.hotelNights > 0 && (
        <p className="ui mt-4 text-[14.5px] text-[var(--ink-2)]">
          They also claimed for {record.hotelNights} {record.hotelNights === 1 ? "night" : "nights"} in
          a hotel.
        </p>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="ui text-[15.5px] font-[660] text-[var(--ink)]">Their jobs in Parliament that year</h3>
          {shownPosts.length ? (
            <ul className="ui mt-2 space-y-1.5 text-[14.5px] leading-[1.45] text-[var(--ink-2)]">
              {shownPosts.map((p) => (
                <li key={p.name + p.start}>
                  <ExplainText>{p.name}</ExplainText>
                  {roleDates(p.start, p.end) && (
                    <span className="text-[var(--muted)]"> ({roleDates(p.start, p.end)})</span>
                  )}
                </li>
              ))}
              {posts.length > shownPosts.length && (
                <li className="text-[var(--muted)]">and {posts.length - shownPosts.length} more</li>
              )}
            </ul>
          ) : (
            <p className="ui mt-2 text-[14.5px] text-[var(--ink-2)]">
              <ExplainText>None. A backbencher, with no government job and no job speaking for their party.</ExplainText>
            </p>
          )}
        </div>
        <div>
          <h3 className="ui text-[15.5px] font-[660] text-[var(--ink)]">
            <G t="commons-committee">Commons committees</G> they sat on
          </h3>
          {record.committees.length ? (
            <ul className="ui mt-2 space-y-1.5 text-[14.5px] leading-[1.45] text-[var(--ink-2)]">
              {record.committees.map((c) => (
                <li key={c.name + c.start}>
                  {c.name}
                  {roleDates(c.start, c.end) && (
                    <span className="text-[var(--muted)]"> ({roleDates(c.start, c.end)})</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="ui mt-2 text-[14.5px] text-[var(--ink-2)]">None that year.</p>
          )}
        </div>
      </div>

      <ExplainText>
        <div className="ui mt-6 space-y-2 border-t border-[var(--rule)] pt-5 text-[14px] leading-[1.55] text-[var(--muted)]">
          {heldFrontbenchJob(record) && (
            <p>
              Ministers answer questions rather than ask them, and whips by custom do not speak in
              debates. Both rarely send written questions, so lower figures here are normal.
            </p>
          )}
          {isSnp && (
            <p>
              The SNP&apos;s long-standing policy is not to vote on laws that only affect England, or
              England and Wales, so its MPs take part in fewer Commons votes.
            </p>
          )}
          {shownPosts.some((p) => /spokesperson/i.test(p.name)) && (
            <p>
              A spokesperson is an MP picked by their party to speak for it on one subject.
            </p>
          )}
          <p>
            Typical Scottish MP means the one in the middle: half of Scotland&apos;s MPs did more, half
            did less. Speaking days count debates in the main Commons chamber and in Westminster Hall.
            Votes, speeches,
            questions and jobs come from{" "}
            <a href={`https://members.parliament.uk/member/${record.memberId}`} target="_blank" rel="noopener noreferrer">
              Parliament&apos;s record for {name}
            </a>
            ; second home costs from IPSA. Checked {shortDate(LONDON_RECORD.checkedDate)}.{" "}
            <Link href="/mp-expenses-scotland#london-record">Compare every Scottish MP →</Link>
          </p>
        </div>
      </ExplainText>
    </div>
  );
}
