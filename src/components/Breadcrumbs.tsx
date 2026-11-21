import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

type Crumb = { name: string; path: string };

/**
 * The trail at the top of a page ("Home › Scottish MPs › MP expenses") and the
 * matching BreadcrumbList structured data for search engines, from one list,
 * so what people see and what Google reads can never disagree.
 */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      {crumbs.length > 1 && (
        <nav aria-label="Breadcrumb" className="no-print mx-auto max-w-[1232px] px-5 pt-5 sm:px-8 lg:px-14">
          <ol className="ui flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13.5px] leading-snug text-[var(--muted)]">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={`${c.path}-${i}`} className="flex min-w-0 items-center gap-x-1.5">
                  {last ? (
                    <span aria-current="page" className="max-w-[62vw] truncate text-[var(--ink-2)] sm:max-w-[52ch]">
                      {c.name}
                    </span>
                  ) : (
                    <Link
                      href={c.path}
                      className="whitespace-nowrap text-[var(--muted)] underline-offset-4 hover:text-[var(--action-text)] hover:underline"
                    >
                      {c.name}
                    </Link>
                  )}
                  {!last && <span aria-hidden="true">›</span>}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </>
  );
}
