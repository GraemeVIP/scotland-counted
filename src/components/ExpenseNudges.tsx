import Link from "@/components/IntentLink";
import type { ExpenseStory } from "@/lib/data/expenseStories";
import { isPraiseStory, storyForProfile, storyHref } from "@/lib/expenseNudges";

/*
 * Nudges from a profile or a tool result to the expenses stories and the
 * Receipt Finder. Most visitors read one page and leave, so these sit at the
 * moments people are most curious: on their own MP's page, and right after a
 * tool has given them an answer about where they live.
 *
 * No hooks, no browser only code: safe in server pages and client tools.
 */

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

/**
 * The big card at the top of a profile whose politician has their own story.
 * One huge number, one line on what it bought, one tap to the story.
 */
export function ExpenseStoryHook({
  story,
  name,
  role,
  receiptsHref,
  className = "",
}: {
  story: ExpenseStory;
  name: string;
  role: string;
  receiptsHref?: string;
  className?: string;
}) {
  // A story that praises low spending gets calm colours, not the red alarm.
  const praise = isPraiseStory(story);
  const tone = praise ? "text-[var(--action-text)]" : "text-[var(--bad-text)]";
  return (
    <aside
      aria-label={`Expenses story about ${name}`}
      className={`not-prose rounded-[var(--r-m)] border border-[var(--rule)] border-l-[5px] ${praise ? "border-l-[var(--action)]" : "border-l-[var(--bad)]"} bg-[var(--surface)] p-5 sm:p-7 ${className}`}
    >
      <p className={`kicker ${tone}`}>{praise ? "From the receipts" : "You paid for this"}</p>
      <div className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <p className={`figure-num tnum text-[44px] leading-none sm:text-[56px] ${tone}`}>
          {story.stat}
        </p>
        <p className="ui text-[18px] font-[640] leading-[1.35] text-[var(--ink)] sm:text-[20px]">
          {story.hook}
        </p>
      </div>
      <p className="mt-3 max-w-[60ch] text-[16px] leading-[1.55] text-[var(--ink-2)]">
        {praise
          ? `That is the total taxpayers paid for ${name}, ${role}. The story shows how it compares.`
          : `Taxpayers covered this bill for ${name}, ${role}. The receipts are public, and the story shows what they say.`}
      </p>
      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <Link href={storyHref(story)} className="btn btn-primary justify-center text-center">
          Read the story →
        </Link>
        {receiptsHref && (
          <Link href={receiptsHref} className="btn btn-ghost justify-center text-center">
            See every receipt {name} claimed
          </Link>
        )}
      </div>
    </aside>
  );
}

/**
 * A slimmer strip for profiles without their own story: the real total they
 * claimed and a tap through to every receipt.
 */
export function ReceiptsNudge({
  name,
  amount,
  period,
  what,
  href,
  cta,
  className = "",
}: {
  name: string;
  /** Real total from the official files. Leave out if there is none. */
  amount?: number;
  /** For example "in 2025/26". */
  period?: string;
  /** For example "on rent, travel and office costs". */
  what?: string;
  href: string;
  cta: string;
  className?: string;
}) {
  return (
    <aside
      aria-label={`Receipts for ${name}`}
      className={`not-prose rounded-[var(--r-m)] border border-[var(--rule)] border-l-[5px] border-l-[var(--action)] bg-[var(--action-tint)] p-5 sm:p-6 ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-[58ch]">
          <p className="kicker mb-1.5 text-[var(--action-text)]">Your money, their receipts</p>
          {amount ? (
            <p className="ui text-[17px] leading-[1.45] text-[var(--ink)]">
              {name} claimed{" "}
              <strong className="tnum text-[var(--bad-text)]">{gbp.format(amount)}</strong>{" "}
              {what} {period}. Taxpayers paid every penny.
            </p>
          ) : (
            <p className="ui text-[17px] leading-[1.45] text-[var(--ink)]">
              Every receipt {name} has claimed is public. Taxpayers paid for all of them.
            </p>
          )}
          <p className="mt-1 text-[15px] leading-[1.5] text-[var(--ink-2)]">
            See each one: the date, who was paid and what it was for.
          </p>
        </div>
        <Link href={href} className="btn btn-primary shrink-0 justify-center text-center">
          {cta} →
        </Link>
      </div>
    </aside>
  );
}

export type StoryPick = { story: ExpenseStory; label?: string };

/**
 * Two or three other stories, each with its big number, so the reader has
 * somewhere to go once they reach the end of a profile.
 */
export function ExpenseStoryPicks({
  picks,
  kicker,
  title,
  intro,
  moreHref = "/mp-expenses-scotland#all-stories",
  moreLabel = "See every expenses story",
  className = "",
}: {
  picks: StoryPick[];
  kicker: string;
  title: string;
  intro?: string;
  moreHref?: string;
  moreLabel?: string;
  className?: string;
}) {
  if (picks.length === 0) return null;
  return (
    <section
      aria-label={title}
      className={`not-prose rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7 ${className}`}
    >
      <p className="kicker text-[var(--bad-text)]">{kicker}</p>
      <h2 className="h2 mt-1.5">{title}</h2>
      {intro && (
        <p className="mt-2 max-w-[60ch] text-[16px] leading-[1.55] text-[var(--ink-2)]">{intro}</p>
      )}
      <ul className={`mt-5 grid gap-3 ${picks.length >= 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
        {picks.map(({ story, label }) => (
          <li
            key={story.slug}
            className="flex h-full flex-col rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4"
          >
            {label && (
              <p className="ui text-[12.5px] font-[640] uppercase tracking-[0.05em] text-[var(--muted)]">
                {label}
              </p>
            )}
            <p
              className={`figure-num tnum mt-1 text-[30px] leading-none ${isPraiseStory(story) ? "text-[var(--action-text)]" : "text-[var(--bad-text)]"}`}
            >
              {story.stat}
            </p>
            <Link
              href={storyHref(story)}
              className="ui mt-2 text-[16px] font-[640] leading-[1.35]"
            >
              {story.hook} →
            </Link>
            {story.person && (
              <p className="ui mt-auto pt-3 text-[14px] leading-[1.4] text-[var(--muted)]">
                <Link href={story.person.href} className="font-[600] text-[var(--ink-2)]">
                  {story.person.name}
                </Link>{" "}
                · {story.person.place}
              </p>
            )}
          </li>
        ))}
      </ul>
      <Link href={moreHref} className="ui mt-5 inline-block text-[16px] font-[600]">
        {moreLabel} →
      </Link>
    </section>
  );
}

/**
 * "Your MP" after a postcode tool gives its answer. If the MP has a story,
 * lead with its number. If not, send people to the MP's own receipts.
 */
export function YourMpExpenses({
  name,
  constituency,
  constituencySlug,
  className = "",
}: {
  name: string;
  constituency: string;
  constituencySlug: string;
  className?: string;
}) {
  const profile = `/representatives/mps/${constituencySlug}`;
  const receipts = `/mp-expenses-scotland/search?mp=${constituencySlug}`;
  const story = storyForProfile(profile);
  const who = (
    <Link href={profile} className="font-[640]">
      {name}
    </Link>
  );

  return (
    <aside
      aria-label={`Expenses for ${name}, your MP`}
      className={`not-prose rounded-[var(--r-m)] border border-[var(--rule)] border-l-[5px] ${story ? "border-l-[var(--bad)]" : "border-l-[var(--action)]"} bg-[var(--surface)] p-5 sm:p-6 ${className}`}
    >
      <p className={`kicker mb-1.5 ${story ? "text-[var(--bad-text)]" : "text-[var(--action-text)]"}`}>
        Your MP, in the receipts
      </p>
      {story ? (
        <>
          <div className="grid gap-x-5 gap-y-1.5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
            <p className="figure-num tnum text-[38px] leading-none text-[var(--bad-text)] sm:text-[44px]">
              {story.stat}
            </p>
            <p className="ui text-[17px] font-[640] leading-[1.35] text-[var(--ink)]">{story.hook}</p>
          </div>
          <p className="mt-3 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
            That is {who}, your MP for {constituency}. Taxpayers covered the bill.
          </p>
        </>
      ) : (
        <p className="ui text-[17px] leading-[1.45] text-[var(--ink)]">
          {who} is your MP for {constituency}. Every receipt they claimed from 2022 to 2026 is
          public, and taxpayers paid for all of them.
        </p>
      )}
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        {story && (
          <Link href={storyHref(story)} className="btn btn-primary justify-center text-center">
            Read the story →
          </Link>
        )}
        <Link
          href={receipts}
          className={`btn ${story ? "btn-ghost" : "btn-primary"} justify-center text-center`}
        >
          See what {name} claimed{story ? "" : " →"}
        </Link>
      </div>
    </aside>
  );
}

/** The same idea for an MSP, used only when that MSP has a story. */
export function YourMspStory({
  name,
  profileHref,
  className = "",
}: {
  name: string;
  profileHref: string;
  className?: string;
}) {
  const story = storyForProfile(profileHref);
  if (!story) return null;
  return (
    <aside
      aria-label={`Expenses story about ${name}`}
      className={`not-prose rounded-[var(--r-m)] border border-[var(--rule)] border-l-[5px] border-l-[var(--action)] bg-[var(--surface)] p-5 sm:p-6 ${className}`}
    >
      <p className="kicker mb-1.5 text-[var(--action-text)]">Your MSP, in the receipts</p>
      <div className="grid gap-x-5 gap-y-1.5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <p className="figure-num tnum text-[38px] leading-none text-[var(--action-text)] sm:text-[44px]">
          {story.stat}
        </p>
        <p className="ui text-[17px] font-[640] leading-[1.35] text-[var(--ink)]">{story.hook}</p>
      </div>
      <p className="mt-3 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
        That is{" "}
        <Link href={profileHref} className="font-[640]">
          {name}
        </Link>
        , one of your MSPs.
      </p>
      <Link href={storyHref(story)} className="btn btn-ghost mt-4 justify-center text-center">
        Read the story →
      </Link>
    </aside>
  );
}
