import Link from "next/link";

/**
 * The third tier, which the site cannot look up for you.
 *
 * MPs and MSPs resolve from a postcode through official APIs. Councillors do
 * not — there is no national register with a lookup, so every one of the 32
 * councils publishes its own list its own way. Rather than pretend, this
 * explains how to find them and what they are actually for.
 *
 * The genuinely useful fact is the one almost nobody knows: in Scotland you
 * have three or four councillors, not one. If the first is no help, the others
 * represent you just as much.
 */

const COUNCIL_JOBS = [
  "Council houses, repairs and damp",
  "Homelessness applications and temporary accommodation",
  "Bins, recycling and fly-tipping",
  "Local roads, pavements and street lighting",
  "Schools, school places and catchment",
  "Social care and care at home",
  "Council tax bills, discounts and reductions",
  "Planning applications and licensing",
];

export default function FindCouncillors({ className = "" }: { className?: string }) {
  return (
    <section className={className} aria-labelledby="find-councillors">
      <p className="kicker mb-3 text-[var(--brand)]">The third one nobody mentions</p>
      <h2 id="find-councillors" className="display-stat text-[clamp(28px,3.4vw,44px)] max-w-[20ch]">
        You also have councillors
      </h2>
      <p className="mt-5 max-w-[62ch] text-[18px] leading-[1.6] text-[var(--ink-2)]">
        Your MP is in London and your MSP is in Edinburgh. Your councillors are the ones down the
        road, and for a lot of everyday problems they are the people who can actually fix it.
      </p>

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <div
          className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-6 py-6"
          style={{ boxShadow: "var(--shadow-1)" }}
        >
          <p className="ui text-[15px] font-[750] text-[var(--brand)] mb-2">
            You have three or four, not one
          </p>
          <p className="text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
            Scotland elects councillors in groups. Almost every ward returns three or four of them,
            usually from different parties, and <strong className="text-[var(--ink)]">every
            single one represents you</strong>. A few island wards elect fewer.
          </p>
          <p className="mt-3 text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
            That matters more than it sounds. If one does not reply, or fobs you off, you can go
            straight to another one who represents exactly the same streets. You do not need a
            reason and you do not need to explain why you are asking them instead.
          </p>
        </div>

        <div
          className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-6 py-6"
          style={{ boxShadow: "var(--shadow-1)" }}
        >
          <p className="ui text-[15px] font-[750] text-[var(--brand)] mb-2">How to find yours</p>
          <ol className="grid gap-3 text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
            <li className="flex gap-3">
              <span aria-hidden="true" className="ui tnum shrink-0 font-[750] text-[var(--muted)]">
                01
              </span>
              <span>
                Search for your council&apos;s name plus{" "}
                <strong className="text-[var(--ink)]">&ldquo;find my councillor&rdquo;</strong>.
                Every Scottish council has this page.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="ui tnum shrink-0 font-[750] text-[var(--muted)]">
                02
              </span>
              <span>
                Put in your postcode. It returns your ward and everyone who represents it, with
                email addresses and usually a phone number.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="ui tnum shrink-0 font-[750] text-[var(--muted)]">
                03
              </span>
              <span>
                Email them the same way you would an MP. Say where you live, what has happened, and
                what you want done.
              </span>
            </li>
          </ol>
          <p className="mt-4 text-[15.5px] leading-[1.55] text-[var(--muted)]">
            Not sure which council you are in? Enter a postcode above and we will tell you.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] px-6 py-6">
        <p className="ui text-[15px] font-[750] mb-3">Things to take to a councillor</p>
        <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {COUNCIL_JOBS.map((job) => (
            <li
              key={job}
              className="flex gap-2.5 text-[16px] leading-[1.55] text-[var(--ink-2)]"
            >
              <span
                aria-hidden="true"
                className="mt-[9px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--brand)]"
              />
              {job}
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-[62ch] text-[15.5px] leading-[1.55] text-[var(--muted)]">
          Benefits, the NHS and the minimum wage are not council matters —{" "}
          <Link href="/accountability">who decides what</Link> sets out the split. If you are not
          sure, send it to your MP and MSP as well. Nobody minds.
        </p>
      </div>
    </section>
  );
}
