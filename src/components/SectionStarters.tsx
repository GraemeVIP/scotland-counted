import Link from "@/components/IntentLink";
import { ExplainText } from "@/components/ExplainServer";
import { SECTION_STARTERS, isBridge } from "@/lib/data/nudges";

/**
 * Three ways in, at the top of the explainers index and each section page.
 * A list of articles asks the reader to choose; a tool or a big figure gives
 * them something to do in one click. Tools get a plain title, expenses
 * stories get their headline figure.
 */
export default function SectionStarters({ section, className = "" }: { section: string; className?: string }) {
  const items = SECTION_STARTERS[section] ?? SECTION_STARTERS.all;
  return (
    <nav aria-label="Start here" className={className}>
      <p className="ui mb-2.5 text-[14px] font-[620] uppercase tracking-[0.06em] text-[var(--muted)]">Start here</p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="tile group flex h-full flex-col gap-2 p-4 no-underline sm:p-5 transition-colors hover:border-[var(--brand)]"
            >
              {isBridge(item) ? (
                <>
                  <span className="figure-num tnum text-[30px] leading-none text-[var(--bad-text)]">{item.stat}</span>
                  <span className="text-[15.5px] leading-[1.45] text-[var(--ink-2)]">{item.text}</span>
                  <span className="ui mt-auto pt-1 text-[15px] font-[640] text-[var(--action-text)]">
                    {item.cta} <span aria-hidden="true">→</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="kicker text-[var(--action-text)]">{item.kicker}</span>
                  <span className="text-[18px] font-[640] leading-[1.25] text-[var(--ink)] group-hover:text-[var(--action-text)]">
                    {item.title}
                  </span>
                  <span className="hidden text-[15px] leading-[1.45] text-[var(--ink-2)] sm:block">
                    <ExplainText>{item.body}</ExplainText>
                  </span>
                  <span className="ui mt-auto pt-1 text-[15px] font-[640] text-[var(--action-text)]">
                    {item.cta} <span aria-hidden="true">→</span>
                  </span>
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
