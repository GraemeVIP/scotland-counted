import Link from "next/link";
import { site } from "@/lib/site";
import { ExplainText } from "@/components/Glossary";

/**
 * Who wrote this, and why anyone should believe it.
 *
 * Search engines and readers both ask the same question of a site that makes
 * claims about public figures: who is behind it, and what are they accountable
 * to. A named person, a stated method, a corrections policy and no funding to
 * hide is the honest answer, so it is stated on every article rather than
 * buried on an About page nobody opens.
 */
export default function AuthorBio({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-[var(--r-m)] bg-[var(--surface-2)] border border-[var(--rule)] p-6 sm:p-7 ${className}`}
    >
      <p className="ui text-[15px] font-[750] text-[var(--ink-2)] mb-3">Who wrote this</p>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-[21px] font-[750] text-[var(--ink)]">{site.author.name}</p>
        <p className="text-[15px] text-[var(--ink-2)]">{site.author.role}</p>
      </div>

      <p className="text-[16.5px] leading-[1.6] text-[var(--ink-2)] mt-3 max-w-[60ch]">
        <ExplainText>
        Scotland Counted is an independent record of poverty, work and living costs in Scotland. It is
        not a newspaper and not a campaign group. Every
        figure on it is taken from the original publisher, the Scottish Government, the ONS, DWP
        records or named academic work, never from someone else&apos;s write-up of them.
        </ExplainText>
      </p>

      <p className="text-[16.5px] leading-[1.6] text-[var(--ink-2)] mt-3 max-w-[60ch]">
        <ExplainText>
        <strong className="text-[var(--ink)]">No party, no funding, no paywall.</strong> Nothing
        here is sponsored and nobody pays to appear. If a figure is wrong I correct it in public
        and keep the old version on the record.
        </ExplainText>
      </p>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-[var(--rule)] text-[15px]">
        <Link href="/about">Who makes this</Link>
        <Link href="/methods">How every figure was counted</Link>
        <Link href="/corrections">Corrections</Link>
        <Link href="/contact">Ask a question</Link>
      </div>
    </aside>
  );
}
