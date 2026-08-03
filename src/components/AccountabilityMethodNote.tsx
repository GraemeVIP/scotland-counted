type AccountabilityMethodNoteProps = {
  councilName?: string;
};

/**
 * How these pages are made, said in the site's own voice.
 *
 * Two rules this note has to keep. It is written as "I", because the site is
 * run by one person and saying "we" would be a small lie. And it claims only
 * what can be shown: no counts of pages read, and no sources that are not
 * actually cited on the pages themselves.
 */
export default function AccountabilityMethodNote({ councilName }: AccountabilityMethodNoteProps) {
  const shortName = councilName?.replace(/ Council$/, "");

  return (
    <aside
      aria-label="How these council pages are made"
      className="mt-8 rounded-[var(--r-m)] border border-[var(--brand)] bg-[var(--brand-wash)] p-5 sm:p-6"
    >
      <p className="kicker mb-2 text-[var(--brand)]">How this page is made</p>
      <p className="text-[17px] font-[750] leading-[1.45] text-[var(--ink)]">
        You should not need a degree to find out how your council is doing.
      </p>
      <p className="mt-2 max-w-[68ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
        So I read the papers and write down what they say in plain words. Councils mark their
        own homework. The auditors at Audit Scotland do not work for the council, so where the
        two disagree, I show both.
      </p>
      <p className="mt-2 max-w-[68ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
        Every figure links to the paper it came from
        {shortName ? `, including the ones about ${shortName}` : ""}. You can check any of it
        yourself. If I cannot back something up, it does not go on the page. And I say what is
        still missing.
      </p>
    </aside>
  );
}
