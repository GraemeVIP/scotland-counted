type TocItem = { id: string; label: string };

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

export default function ArticleToc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <>
      <details className="lg:hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 mb-8">
        <summary className="ui cursor-pointer text-[16px] font-[750] text-[var(--ink)]">
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
          <p className="ui text-[15px] font-[760] text-[var(--ink)]">On this page</p>
          <Links items={items} />
        </nav>
      </aside>
    </>
  );
}
