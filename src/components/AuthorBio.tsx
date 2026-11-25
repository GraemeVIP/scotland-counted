import Link from "@/components/IntentLink";
import { ExplainText } from "@/components/ExplainServer";

/**
 * Editorial standard note shown at the end of articles so readers can verify
 * where figures come from, how they are checked, and how errors are handled.
 */
export default function AuthorBio({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-[var(--r-m)] bg-[var(--surface-2)] border border-[var(--rule)] p-6 sm:p-7 ${className}`}
    >
      <p className="ui text-[15px] font-[600] text-[var(--ink-2)] mb-3">How this page was checked</p>

      <p className="text-[16.5px] leading-[1.6] text-[var(--ink-2)] max-w-[60ch]">
        <ExplainText>
          Scotland Counted is an independent record of poverty, work and living costs in Scotland. It is
          not a newspaper and not a campaign group. Every figure on it is taken from the original
          publisher, such as the Scottish Government, the ONS, DWP records, IPSA (the body that pays
          MPs&apos; expenses), the UK and Scottish Parliaments or named academic work, never from
          someone else&apos;s write up of them.
        </ExplainText>
      </p>

      <p className="text-[16.5px] leading-[1.6] text-[var(--ink-2)] mt-3 max-w-[60ch]">
        <ExplainText>
          <strong className="text-[var(--ink)]">No party, no funding, no paywall.</strong> Nothing
          here is sponsored and nobody pays to appear. Confirmed errors are corrected in public and
          logged on the corrections page.
        </ExplainText>
      </p>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-[var(--rule)] text-[15px]">
        <Link href="/about">About Scotland Counted</Link>
        <Link href="/methods">How every figure was counted</Link>
        <Link href="/corrections">Corrections</Link>
        <Link href="/contact">Contact us</Link>
      </div>
    </aside>
  );
}
