import type { ReactNode } from "react";
import Link from "next/link";
import { ExplainText } from "@/components/Glossary";

/**
 * Typographic primitives for blog posts.
 *
 * Posts are TSX rather than markdown so they can drop in the site's own
 * charts, glossary terms and callouts inline, the thing that makes an
 * explainer here different from an explainer anywhere else. These components
 * keep the prose consistent without needing an MDX toolchain.
 */

export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-[68ch] space-y-5">{children}</div>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[18px] leading-[1.68] text-[var(--ink-2)]"><ExplainText>{children}</ExplainText></p>;
}

/** The opening paragraph, set larger. */
export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="text-[21px] sm:text-[22px] leading-[1.55] text-[var(--ink)] font-[480]">
      <ExplainText>{children}</ExplainText>
    </p>
  );
}

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="h2 pt-6 scroll-mt-24">
      {children}
    </h2>
  );
}

export function H3({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h3 id={id} className="h3 pt-3 scroll-mt-24">
      {children}
    </h3>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="space-y-2.5 pl-1">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="text-[18px] leading-[1.6] text-[var(--ink-2)] flex gap-3">
      <span aria-hidden="true" className="text-[var(--action)] shrink-0">
        •
      </span>
      <span><ExplainText>{children}</ExplainText></span>
    </li>
  );
}

/**
 * A single number given room to land. The plain-English phrase is the headline
 * and the exact figure sits underneath as the proof, the same pattern the rest
 * of the site uses.
 */
export function BigStat({
  value,
  label,
  exact,
}: {
  value: string;
  label: string;
  exact?: string;
}) {
  return (
    <div className="my-8 rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] border-l-[5px] border-l-[var(--action)] px-6 sm:px-8 py-7">
      <p className="figure-num text-[44px] sm:text-[54px] leading-[1] text-[var(--action)]">
        {value}
      </p>
      <p className="ui text-[18px] font-[680] leading-[1.4] mt-3 text-[var(--ink)]"><ExplainText>{label}</ExplainText></p>
      {exact && (
        <p className="text-[15.5px] text-[var(--ink-2)] leading-[1.5] mt-2 tnum"><ExplainText>{exact}</ExplainText></p>
      )}
    </div>
  );
}

/** A short aside that is worth stopping for, without breaking the argument. */
export function Aside({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="my-7 rounded-[var(--r-s)] bg-[var(--surface-2)] border border-[var(--rule)] px-5 sm:px-6 py-5">
      <p className="ui text-[15px] font-[750] text-[var(--brand)] mb-2">{title}</p>
      <div className="text-[16.5px] leading-[1.6] text-[var(--ink-2)] space-y-2.5"><ExplainText>{children}</ExplainText></div>
    </div>
  );
}

/** The in-article prompt to go and do the thing the post is about. */
export function PostCTA({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div
      className="my-9 rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] p-6 sm:p-7"
      style={{ boxShadow: "var(--shadow-2)" }}
    >
      <p className="text-[21px] font-[750] leading-[1.3]">{title}</p>
      <p className="text-[17px] text-[var(--ink-2)] leading-[1.6] mt-2.5 max-w-[58ch]"><ExplainText>{body}</ExplainText></p>
      <Link href={href} className="btn btn-primary mt-5">
        {cta}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
