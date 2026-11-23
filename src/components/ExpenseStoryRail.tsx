import Link from "@/components/IntentLink";
import ExpenseMpCheckClient, { type MpCheckStory, type MspCheckStory } from "@/components/ExpenseMpCheckClient";
import {
  EXPENSE_STORIES,
  nearExpenseStory,
  pickExpenseStories,
  type ExpenseStory,
} from "@/lib/data/expenseStories";
import { mps } from "@/lib/data/mps";

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

/**
 * "Read the next one": shown on every expenses story, straight after the
 * article, where reading naturally ends. Nothing earlier on the page pulls
 * people away before they have read the story. Holds, quietly: the nearest
 * local story ("Also in your area"), five more, and a slim postcode check.
 */
export function ExpenseStoryRail({ slug }: { slug: string }) {
  const near = nearExpenseStory(slug);
  const picks = pickExpenseStories(slug, 5, near ? [near.slug] : []);
  return (
    <section aria-labelledby="more-expenses-stories" className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
      <p className="label">You paid for these too</p>
      <h2 id="more-expenses-stories" className="ui mt-1 text-[22px] font-[700] leading-[1.25] text-[var(--ink)] sm:text-[24px]">
        Read the next one
      </h2>
      {near && (
        <p className="ui mt-2 text-[15.5px] leading-[1.5] text-[var(--ink-2)]">
          <span className="font-[650] text-[var(--ink)]">Also in your area:</span>{" "}
          {near.person && (
            <>
              <Link href={near.person.href} className="font-[620]">
                {near.person.name}
              </Link>
              , {near.person.place}.{" "}
            </>
          )}
          <Link href={`/blog/${near.slug}`}>
            <span className="figure-num tnum text-[var(--bad-text)]">{near.stat}</span> {near.hook} →
          </Link>
        </p>
      )}
      <ul className="mt-3 divide-y divide-[var(--rule)]">
        {picks.map((s) => (
          <StoryRow key={s.slug} s={s} />
        ))}
      </ul>
      <div className="mt-4">
        <Link href="/mp-expenses-scotland#all-stories" className="btn btn-primary">
          See all {EXPENSE_STORIES.length} expenses stories →
        </Link>
      </div>
      <div className="mt-6 border-t border-[var(--rule)] pt-5">
        <ExpenseMpCheck slug={slug} framed={false} compact />
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

const SEATS: Record<number, string> = Object.fromEntries(mps.map((m) => [m.memberId, m.constituencySlug]));

const MP_STORIES: Record<string, MpCheckStory> = Object.fromEntries(
  EXPENSE_STORIES.filter((s) => s.group === "mp" && s.person).map((s) => [
    s.person!.href.split("/").pop()!,
    { slug: s.slug, stat: s.stat, hook: s.hook },
  ]),
);

const MSP_STORIES: Record<string, MspCheckStory> = Object.fromEntries(
  EXPENSE_STORIES.filter((s) => s.group === "msp" && s.person).map((s) => [
    s.person!.name.toLowerCase(),
    { slug: s.slug, stat: s.stat, hook: s.hook, name: s.person!.name, href: s.person!.href },
  ]),
);

/**
 * "Is your MP on the list?" A postcode check at the foot of every expenses
 * story's end strip (slim), and near the top of the hub (full size). Answers with the reader's own MP, that MP's story if
 * there is one, and a link to every bill they claimed.
 */
export function ExpenseMpCheck({
  slug,
  title,
  intro,
  framed,
  compact,
}: {
  slug?: string;
  title?: string;
  intro?: string;
  framed?: boolean;
  compact?: boolean;
}) {
  return (
    <ExpenseMpCheckClient
      currentSlug={slug}
      seats={SEATS}
      stories={MP_STORIES}
      mspStories={MSP_STORIES}
      title={title}
      intro={intro}
      framed={framed}
      compact={compact}
    />
  );
}

/** The four biggest stories, for the top of the hub. */
const START_HERE = [
  "zubir-ahmed-mp-london-hotels-glasgow",
  "kilmarnock-mp-23437-electricity-bill",
  "scottish-mps-flights-climate-expenses",
  "msp-edinburgh-flats-commuter-belt",
];

export function ExpenseStoryStarters() {
  const stories = START_HERE.map((slug) => EXPENSE_STORIES.find((s) => s.slug === slug)!).filter(Boolean);
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stories.map((s) => (
        <div
          key={s.slug}
          className="tile flex flex-col gap-2 border-t-[3px] border-t-[var(--bad)] p-4"
        >
          <span className="figure-num tnum text-[30px] leading-none text-[var(--bad-text)]">{s.stat}</span>
          <Link href={`/blog/${s.slug}`} className="ui flex-1 text-[15.5px] font-[640] leading-[1.4]">
            {s.hook} →
          </Link>
          {s.person && (
            <p className="ui text-[13.5px] leading-[1.4] text-[var(--muted)]">
              <Link href={s.person.href} className="text-[var(--muted)]">
                {s.person.name}
              </Link>{" "}
              · {s.person.place}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
