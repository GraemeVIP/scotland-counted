import Link from "next/link";
import { pay, friction } from "@/lib/data/power";

/**
 * The short version of the case for acting.
 *
 * The site used to carry 109 words on why contacting anyone is worth the
 * bother, and they sat on the page you only reach after deciding to act. This
 * puts the argument in front of the decision instead of behind it.
 *
 * The heading names MPs and MSPs rather than saying "them". Someone skimming
 * has no idea who "them" is, and a heading with no subject in it is worth
 * nothing in search either.
 */
export default function WhyBother({ className = "" }: { className?: string }) {
  return (
    <section className={className} aria-labelledby="why-bother">
      <div
        className="rounded-[var(--r-l)] bg-[var(--deep)] text-[var(--deep-ink)] p-7 sm:p-10 lg:p-12"
        style={{ boxShadow: "var(--shadow-2)" }}
      >
        {/* Argument left, the money right — so neither column is left hanging. */}
        <div className="grid gap-x-12 gap-y-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <div>
            <p className="kicker text-[var(--action)] mb-3">Before you scroll past</p>
            <h2
              id="why-bother"
              className="display-stat text-[clamp(30px,3.8vw,50px)] max-w-[16ch]"
            >
              Is it worth emailing your MP or MSP?
            </h2>
            <p className="text-[18px] sm:text-[19px] leading-[1.55] mt-5 max-w-[48ch] opacity-85">
              Almost nobody does. Not because they do not care — because it is a faff, and because
              nobody expects anything to come of it. Here is the honest answer.
            </p>
            <p className="text-[19px] sm:text-[21px] leading-[1.5] font-[640] mt-6 max-w-[46ch]">
              They work for you. You do not need to have voted for them. Answering people who live
              in their area is the job.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[pay.mp, pay.msp].map((p) => (
              <div
                key={p.role}
                className="rounded-[var(--r-m)] bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.14)] px-5 py-6"
              >
                <p className="ui text-[14.5px] font-[700] opacity-70">{p.role} is paid</p>
                <p className="display-stat text-[clamp(30px,3.2vw,42px)] mt-2">{p.amount}</p>
                <p className="text-[14.5px] leading-[1.45] opacity-70 mt-2.5">a year, by you</p>
              </div>
            ))}
          </div>
        </div>

        {/* The friction, as an even strip rather than a ragged two-column list. */}
        <div className="mt-10 pt-8 border-t border-[rgba(255,255,255,0.16)]">
          <p className="ui text-[16px] font-[720] mb-5">
            The reason nobody bothers is the effort. We took it away.
          </p>
          <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
            {friction.map((f, i) => (
              <li key={f.before} className="flex flex-col gap-2">
                <span
                  aria-hidden="true"
                  className="ui text-[13px] font-[750] text-[var(--action)] tnum"
                >
                  0{i + 1}
                </span>
                <span className="text-[15.5px] leading-[1.45] opacity-85">{f.now}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link href="/take-action" className="btn btn-primary">
            Write mine now
            <span aria-hidden="true">→</span>
          </Link>
          <p className="text-[16.5px] leading-[1.55] opacity-80 max-w-[42ch]">
            It takes about a minute, and it leaves a record with a date on it you can go back and
            check.{" "}
            <Link
              href="/your-power"
              className="text-[var(--deep-ink)] underline underline-offset-4 decoration-[var(--action)] decoration-2"
            >
              What happens next
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
