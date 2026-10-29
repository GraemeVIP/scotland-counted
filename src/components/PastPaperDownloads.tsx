import { N5_PAST_PAPER_FILES, PAST_PAPER_CREDIT } from "@/lib/data/schools";

const size = (kb: number) => (kb >= 1000 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);

function FileLink({ href, label, kb, pages, year }: { href: string; label: string; kb: number; pages: number; year: number }) {
  return (
    <a
      href={href}
      download
      className="group flex min-h-[64px] items-center gap-3 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 no-underline transition-colors hover:border-[var(--action)]"
      aria-label={`Download the ${year} ${label.toLowerCase()}, PDF, ${size(kb)}, ${pages} pages`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--action-text)" strokeWidth="2" aria-hidden="true" className="shrink-0">
        <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="min-w-0">
        <span className="ui block text-[15.5px] font-[600] text-[var(--ink)] group-hover:text-[var(--action-text)]">{label}</span>
        <span className="ui block text-[13.5px] text-[var(--muted)]">
          PDF · {size(kb)} · {pages} pages
        </span>
      </span>
    </a>
  );
}

/**
 * The National 5 Modern Studies papers, one tap each, newest first.
 *
 * Linking out to the official finder meant a menu, a filter and a zip file on
 * a phone. Hosted here they open straight away. The credit line is required by
 * Qualifications Scotland's terms and stays with the files.
 */
export default function PastPaperDownloads() {
  return (
    <figure className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 sm:p-6">
      <div className="grid gap-3">
        {N5_PAST_PAPER_FILES.map((paper) => (
          <div key={paper.year} className="grid gap-2 sm:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
            <p className="display-stat text-[24px] leading-none text-[var(--ink)] tnum">{paper.year}</p>
            <FileLink href={paper.qp.href} label="Question paper" kb={paper.qp.kb} pages={paper.qp.pages} year={paper.year} />
            <FileLink href={paper.mi.href} label="Marking instructions" kb={paper.mi.kb} pages={paper.mi.pages} year={paper.year} />
          </div>
        ))}
      </div>
      <figcaption className="mt-4 text-[14px] leading-[1.55] text-[var(--ink-2)]">{PAST_PAPER_CREDIT}</figcaption>
    </figure>
  );
}
