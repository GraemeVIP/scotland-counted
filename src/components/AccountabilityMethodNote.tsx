import { sourceDocumentCount } from "@/lib/councilSignals";

type AccountabilityMethodNoteProps = {
  councilName?: string;
};

/**
 * The trust box, and the hook that earns the rest of the page.
 *
 * The heading it replaced, "How this page is made", told a reader nothing
 * and sounded like a colophon. The point is not the process, it is that all
 * of this is already public and effectively unreachable: hundreds of pages of
 * audit reports and budget papers, in PDFs you would have to know existed to
 * find.
 *
 * Two rules it has to keep. It is written as "I", because the site is run by
 * one person. And the one number in it is counted from the records at build
 * time, not typed in, so the claim about the work is a claim a reader can go
 * and check rather than a boast about pages read.
 */
export default function AccountabilityMethodNote({ councilName }: AccountabilityMethodNoteProps) {
  const shortName = councilName?.replace(/ Council$/, "");
  const documents = sourceDocumentCount();
  // Pulled out of the JSX purely for readability, the clause is long enough
  // that inlining it buries the sentence it belongs to.
  const including = shortName ? `, including the ones on ${shortName},` : "";

  return (
    <aside
      aria-label="Where the figures on this page come from"
      className="mt-8 rounded-[var(--r-m)] border border-[var(--brand)] bg-[var(--brand-wash)] p-5 sm:p-6"
    >
      <p className="kicker mb-2 text-[var(--brand)]">I read it so you do not have to</p>
      <p className="text-[19px] font-[800] leading-[1.3] text-[var(--ink)] sm:text-[21px]">
        None of this is secret. It is just buried where you would never look.
      </p>
      <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
        Your council&rsquo;s spending, its broken promises and what the auditors said about both
        are all published already. They sit in audit reports, budget papers and national
        comparison files. That is dozens of PDFs, running to thousands of pages between them.
        You would have to know they existed to find them. I go through them{including} and pull
        out the parts that actually affect you.
      </p>
      <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
        Councils mark their own homework. The auditors at Audit Scotland do not work for the
        council, so where the two disagree, I show you both.
      </p>
      <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
        Every figure links straight back to the document it came from &mdash;{" "}
        <strong className="text-[var(--ink)]">{documents} of them so far</strong>. Check any of
        it yourself. If I cannot back something up it does not go on the page, and I tell you
        what is still missing.
      </p>
    </aside>
  );
}
