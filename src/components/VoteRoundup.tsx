import Link from "next/link";
import { divisions, scottishTally } from "@/lib/data/votes";
import Reveal from "@/components/Reveal";

/**
 * How Scotland's 57 MPs voted, division by division.
 *
 * The constituency pages show one MP's record to one reader. This is the same
 * ledger read the other way round — the whole Scottish delegation on a single
 * vote — so the accountability page carries an actual record rather than only
 * an explanation of who holds which power.
 *
 * Two rules from the constituency version carry over. We say what the vote was
 * on and what each side meant, and we never say which side was right. And we do
 * not print a list of the MPs who voted one way: the site's rule is that the
 * record is about decisions, not individuals, and a reader who wants to know
 * about their own MP can look up their own area.
 */

const SEATS = 57;

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function VoteRoundup({ className = "" }: { className?: string }) {
  return (
    <section className={className} aria-labelledby="vote-roundup">
      <p className="kicker mb-3 text-[var(--brand)]">The record, not the promise</p>
      <h2 id="vote-roundup" className="display-stat text-[clamp(28px,3.4vw,44px)] max-w-[20ch]">
        How Scotland&apos;s MPs actually voted
      </h2>
      <p className="mt-5 text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch]">
        Every one of these is a real vote in the House of Commons, taken from the official record.
        A vote is public forever. It is the one thing an MP cannot take back, and it is why writing
        to them is worth doing.
      </p>

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        {divisions.map((d, i) => {
          const t = scottishTally(d);
          const carried = d.ayes > d.noes;
          const parts = [
            { n: t.aye, label: "voted for it", colorVar: "--good" },
            { n: t.no, label: "voted against it", colorVar: "--bad" },
            { n: t.absent, label: "not recorded", colorVar: "--flat" },
          ].filter((p) => p.n > 0);

          return (
            <Reveal key={d.id} delay={i * 70}>
              <article
                className="h-full flex flex-col rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] px-6 sm:px-8 py-7"
                style={{ boxShadow: "var(--shadow-2)" }}
              >
                <p className="ui text-[15px] font-[700] text-[var(--muted)]">
                  {d.stage} · {fmtDate(d.date)}
                </p>
                <h3 className="text-[25px] sm:text-[29px] font-[780] leading-[1.15] mt-1.5 max-w-[20ch]">
                  {d.headline}
                </h3>
                <p className="text-[16.5px] leading-[1.6] text-[var(--ink-2)] mt-4 max-w-[54ch]">
                  {d.plain}
                </p>

                <div className="mt-6">
                  <p className="ui text-[15px] font-[720] text-[var(--ink-2)] mb-2.5">
                    Scotland&apos;s {SEATS} MPs
                  </p>
                  <div
                    className="flex h-[14px] w-full overflow-hidden rounded-[var(--r-pill)] bg-[var(--surface-2)]"
                    role="img"
                    aria-label={parts
                      .map((p) => `${p.n} ${p.label}`)
                      .join(", ")}
                  >
                    {parts.map((p) => (
                      <span
                        key={p.label}
                        style={{
                          width: `${(p.n / SEATS) * 100}%`,
                          background: `var(${p.colorVar})`,
                        }}
                      />
                    ))}
                  </div>
                  <ul className="mt-3.5 grid gap-x-6 gap-y-1.5 sm:grid-cols-3">
                    {parts.map((p) => (
                      <li key={p.label} className="ui text-[15px] leading-[1.4] tnum">
                        <span
                          className="figure-num text-[19px] mr-1.5"
                          style={{ color: `var(${p.colorVar})` }}
                        >
                          {p.n}
                        </span>
                        <span className="text-[var(--ink-2)]">{p.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-6">
                  <p className="ui text-[15px] leading-[1.5] text-[var(--ink-2)] tnum border-t border-[var(--rule)] pt-4">
                    <span className="font-[740] text-[var(--ink)]">
                      {d.ayes} to {d.noes}
                    </span>{" "}
                    across the whole Commons — it {carried ? "passed" : "did not pass"}
                  </p>
                  <a
                    href={`https://votes.parliament.uk/Votes/Commons/Division/${d.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui text-[15px] font-[650] inline-block mt-3"
                  >
                    Check this vote on the official record →
                  </a>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <div
        className="mt-6 rounded-[var(--r-m)] bg-[var(--deep)] text-[var(--deep-ink)] px-6 sm:px-8 py-6"
        style={{ boxShadow: "var(--shadow-1)" }}
      >
        <p className="text-[19px] sm:text-[21px] leading-[1.5] font-[620] max-w-[60ch]">
          One of those MPs is yours. Find your area and we will show you how they were recorded, by
          name, on each of these votes.
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link href="/constituencies" className="btn btn-primary">
            Find how my MP voted
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/take-action" className="btn border-current/35 text-current hover:bg-white/10">
            Email them about it
          </Link>
        </div>
      </div>
    </section>
  );
}
