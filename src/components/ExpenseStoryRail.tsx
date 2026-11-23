import Link from "@/components/IntentLink";
import { EXPENSE_STORIES, pickExpenseStories, type ExpenseStory } from "@/lib/data/expenseStories";

function StoryRow({ s }: { s: ExpenseStory }) {
  return (
    <li className="flex items-start gap-4 py-3.5">
      <span className="figure-num tnum w-[92px] shrink-0 pt-0.5 text-right text-[19px] leading-none text-[var(--bad-text)] sm:w-[110px] sm:text-[22px]">
        {s.stat}
      </span>
      <div className="min-w-0 flex-1">
        <Link href={`/blog/${s.slug}`} className="ui text-[16px] font-[660] leading-[1.35]">
          {s.hook} →
        </Link>
        {s.person && (
          <p className="ui mt-0.5 text-[13.5px] leading-[1.4] text-[var(--muted)]">
            <Link href={s.person.href} className="text-[var(--muted)]">
              {s.person.name}
            </Link>{" "}
            · {s.person.place}
          </p>
        )}
      </div>
    </li>
  );
}

/** "Read the next one": shown on every expenses story, straight after the article. */
export function ExpenseStoryRail({ slug }: { slug: string }) {
  const picks = pickExpenseStories(slug);
  return (
    <section aria-labelledby="more-expenses-stories" className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
      <p className="label">You paid for these too</p>
      <h2 id="more-expenses-stories" className="ui mt-1 text-[22px] font-[700] leading-[1.25] text-[var(--ink)] sm:text-[24px]">
        Read the next one
      </h2>
      <p className="ui mt-1 text-[15px] leading-[1.5] text-[var(--muted)]">
        Same expense files, same taxpayers. Is your MP or MSP here?
      </p>
      <ul className="mt-3 divide-y divide-[var(--rule)]">
        {picks.map((s) => (
          <StoryRow key={s.slug} s={s} />
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/mp-expenses-scotland#all-stories" className="btn btn-primary">
          See all {EXPENSE_STORIES.length} expenses stories →
        </Link>
        <Link href="/mp-expenses-scotland/search" className="btn btn-ghost">
          Check your MP&apos;s receipts by postcode
        </Link>
      </div>
    </section>
  );
}

/** The full list, grouped, for the expenses hub. */
export function ExpenseStoryIndex() {
  const groups: { key: ExpenseStory["group"]; title: string }[] = [
    { key: "roundup", title: "The big picture" },
    { key: "mp", title: "MP by MP" },
    { key: "msp", title: "Holyrood MSPs" },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {groups.map((g) => (
        <div key={g.key} className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-5 py-4">
          <h3 className="ui text-[18px] font-[700] text-[var(--ink)]">{g.title}</h3>
          <ul className="mt-1 divide-y divide-[var(--rule)]">
            {EXPENSE_STORIES.filter((s) => s.group === g.key).map((s) => (
              <StoryRow key={s.slug} s={s} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
