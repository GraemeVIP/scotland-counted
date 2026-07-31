import Link from "next/link";
import { pay, friction } from "@/lib/data/power";

/**
 * The short version of the case for acting, for pages where the reader has
 * just seen their own number.
 *
 * The site used to carry 109 words on why contacting anyone is worth the
 * bother, and they sat on the page you only reach after deciding to act. This
 * puts the argument in front of the decision instead of behind it.
 */
export default function WhyBother({ className = "" }: { className?: string }) {
  return (
    <section className={className} aria-labelledby="why-bother">
      <div
        className="rounded-[var(--r-m)] bg-[var(--deep)] text-[var(--deep-ink)] p-6 sm:p-9"
        style={{ boxShadow: "var(--shadow-2)" }}
      >
        <h2 id="why-bother" className="text-[26px] sm:text-[32px] font-[780] leading-[1.15]">
          Is it even worth writing to them?
        </h2>
        <p className="text-[18px] leading-[1.6] mt-3 max-w-[58ch] opacity-90">
          Most people never do. Not because they do not care — because it is a faff, and because
          nobody expects anything to come of it. Here is the honest answer.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {[pay.mp, pay.msp].map((p) => (
            <div
              key={p.role}
              className="rounded-[var(--r-s)] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.14)] px-5 py-5"
            >
              <p className="ui text-[15px] font-[720] opacity-75">{p.role} is paid</p>
              <p className="figure-num text-[34px] sm:text-[40px] leading-[1] mt-1.5">
                {p.amount}
              </p>
              <p className="text-[15px] leading-[1.5] opacity-75 mt-2.5">a year, by you</p>
            </div>
          ))}
        </div>

        <p className="text-[18px] leading-[1.6] mt-6 max-w-[58ch]">
          <strong>They work for you.</strong> You do not need to have voted for them. Answering
          people who live in their area is the job.
        </p>

        <div className="mt-7 pt-6 border-t border-[rgba(255,255,255,0.16)]">
          <p className="ui text-[15px] font-[750] opacity-80 mb-3">
            The reason nobody bothers is the effort. We took it away.
          </p>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {friction.map((f) => (
              <li key={f.before} className="text-[16px] leading-[1.5] flex gap-2.5">
                <span aria-hidden="true" className="text-[var(--action)] font-[800] shrink-0">
                  ✓
                </span>
                <span className="opacity-85">{f.now}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[17px] leading-[1.6] mt-6 max-w-[58ch] opacity-90">
          It takes about a minute, and it leaves a record with a date on it that you can go back
          and check.
        </p>

        <Link
          href="/your-power"
          className="ui inline-block mt-5 text-[16px] font-[700] text-[var(--action)] underline underline-offset-4"
        >
          What happens after you press send →
        </Link>
      </div>
    </section>
  );
}
