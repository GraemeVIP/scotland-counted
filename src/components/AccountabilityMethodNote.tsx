type AccountabilityMethodNoteProps = {
  councilName?: string;
};

export default function AccountabilityMethodNote({ councilName }: AccountabilityMethodNoteProps) {
  return (
    <aside
      aria-label="How these council pages are made"
      className="mt-8 rounded-[var(--r-m)] border border-[var(--brand)] bg-[var(--brand-wash)] p-5 sm:p-6"
    >
      <p className="kicker mb-2 text-[var(--brand)]">Why this page is written this way</p>
      <p className="text-[17px] font-[750] leading-[1.45] text-[var(--ink)]">
        We have worked through thousands of pages of council papers, audit reports and official data so you do not have to.
      </p>
      <p className="mt-2 max-w-[72ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
        We use each council&apos;s own budgets, accounts and performance reports alongside independent
        Audit Scotland and Accounts Commission audits, Scottish Government funding figures,
        regulator reports and national comparison data where they help explain the picture. We
        remove the official language, translate the key points into plain English and pull out the
        figures that matter.
        {councilName ? ` That includes the papers behind ${councilName}. ` : " "}The original sources
        stay on the page so you can check our work. Everyone pays for council services, and everyone
        deserves to understand what is going on.
      </p>
    </aside>
  );
}
