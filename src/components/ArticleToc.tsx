import Link from "@/components/IntentLink";

type TocItem = { id: string; label: string };
type TocNext = { kicker: string; label: string; href: string };

function Links({ items }: { items: TocItem[] }) {
  return (
    <ol className="grid gap-2.5 mt-3">
      {items.map((item, index) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="group grid grid-cols-[24px_minmax(0,1fr)] gap-2.5 no-underline text-[15px] leading-[1.4] text-[var(--ink-2)] hover:text-[var(--brand)]"
          >
            <span className="tnum text-[var(--muted)] group-hover:text-[var(--brand)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{item.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * The contents list. On wide screens it stays in view as you scroll, so it
 * also carries one "next step" link: the tool or story the page leads to,
 * in sight the whole way down rather than only at the end.
 */
export default function ArticleToc({ items, next }: { items: TocItem[]; next?: TocNext }) {
  if (items.length === 0) return null;

  return (
    <>
      <details className="lg:hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 mb-8">
        <summary className="ui cursor-pointer text-[16px] font-[600] text-[var(--ink)]">
          On this page
        </summary>
        <nav aria-label="Article contents">
          <Links items={items} />
        </nav>
      </details>

      <aside className="hidden lg:block min-w-0 lg:col-start-2 lg:row-start-1">
        <nav
          aria-label="Article contents"
          className="sticky top-24 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5"
        >
          <p className="ui text-[15px] font-[620] text-[var(--ink)]">On this page</p>
          <Links items={items} />
          {next && (
            <Link
              href={next.href}
              className="group mt-5 block rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 no-underline transition-colors hover:border-[var(--brand)]"
            >
              <span className="ui block text-[12.5px] font-[640] uppercase tracking-[0.06em] text-[var(--muted)]">
                {next.kicker}
              </span>
              <span className="ui mt-1 block text-[15px] font-[640] leading-[1.35] text-[var(--ink)] group-hover:text-[var(--brand)]">
                {next.label} <span aria-hidden="true" className="text-[var(--brand)]">→</span>
              </span>
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}
