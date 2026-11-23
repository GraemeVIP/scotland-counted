import Link from "@/components/IntentLink";
import type { ExpenseStory } from "@/lib/data/expenseStories";
import { isPraiseStory, storyForProfile, storyHref } from "@/lib/expenseNudges";

/*
 * Quiet "read more" routes from a profile or a tool result to the expenses
 * stories and the Receipt Finder.
 *
 * House rule: slick and unintrusive. These never sit above a page's own
 * content and never come before a tool's answer. Each one is a slim line in
 * the site's normal card style, so readers finish what they came for first.
 *
 * No hooks, no browser only code: safe in server pages and client tools.
 */

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const shell =
  "not-prose rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3.5 sm:px-5";
const lead = "ui block text-[12.5px] font-[640] uppercase tracking-[0.05em] text-[var(--muted)]";
const body = "mt-1 text-[15.5px] leading-[1.55] text-[var(--ink-2)]";
const link = "ui font-[600] whitespace-nowrap";

function Stat({ story }: { story: ExpenseStory }) {
  return (
    <strong
      className={`tnum font-[700] ${isPraiseStory(story) ? "text-[var(--ink)]" : "text-[var(--bad-text)]"}`}
    >
      {story.stat}
    </strong>
  );
}

/** A profile's own story, as one slim line after the profile's main content. */
export function ExpenseStoryHook({
  story,
  name,
  receiptsHref,
  className = "",
}: {
  story: ExpenseStory;
  name: string;
  receiptsHref?: string;
  className?: string;
}) {
  return (
    <aside data-nudge="story_hook" aria-label={`Expenses story about ${name}`} className={`${shell} ${className}`}>
      <span className={lead}>From the receipts</span>
      <p className={body}>
        <Stat story={story} /> {story.hook}.{" "}
        <Link href={storyHref(story)} className={link}>
          Read the story about {name} →
        </Link>
        {receiptsHref && (
          <>
            {" "}
            <Link href={receiptsHref} className={`${link} text-[var(--ink-2)]`}>
              See every receipt →
            </Link>
          </>
        )}
      </p>
    </aside>
  );
}

/** For profiles without a story: the real total, and a quiet route to the receipts. */
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
  /** For example "for rent, travel and office costs". */
  what?: string;
  href: string;
  cta: string;
  className?: string;
}) {
  return (
    <aside data-nudge="receipts_nudge" aria-label={`Receipts for ${name}`} className={`${shell} ${className}`}>
      <span className={lead}>From the receipts</span>
      <p className={body}>
        {amount ? (
          <>
            {name} claimed{" "}
            <strong className="tnum font-[700] text-[var(--ink)]">{gbp.format(amount)}</strong>{" "}
            {what} {period}. Taxpayers paid for every receipt.{" "}
          </>
        ) : (
          <>Every receipt {name} claimed is public. </>
        )}
        <Link href={href} className={link}>
          {cta} →
        </Link>
      </p>
    </aside>
  );
}

export type StoryPick = { story: ExpenseStory; label?: string };

/**
 * Two or three other stories, at the end of a profile, so the reader has
 * somewhere to go once they have finished it.
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
    <section data-nudge="story_picks" aria-label={title} className={`not-prose ${className}`}>
      <p className="kicker mb-1.5 text-[var(--muted)]">{kicker}</p>
      <h2 className="h3">{title}</h2>
      {intro && (
        <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">{intro}</p>
      )}
      <ul className={`mt-4 grid gap-2.5 ${picks.length >= 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
        {picks.map(({ story, label }) => (
          <li
            key={story.slug}
            className="flex h-full flex-col rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3.5"
          >
            {label && <p className={lead}>{label}</p>}
            <p className="mt-1 text-[15.5px] leading-[1.45]">
              <Stat story={story} />{" "}
              <Link href={storyHref(story)} className="ui font-[600]">
                {story.hook} →
              </Link>
            </p>
            {story.person && (
              <p className="ui mt-auto pt-2 text-[14px] leading-[1.4] text-[var(--muted)]">
                <Link href={story.person.href} className="text-[var(--ink-2)]">
                  {story.person.name}
                </Link>{" "}
                · {story.person.place}
              </p>
            )}
          </li>
        ))}
      </ul>
      <Link href={moreHref} className="ui mt-3 inline-block text-[15.5px] font-[600]">
        {moreLabel} →
      </Link>
    </section>
  );
}

/**
 * "Your MP" after a postcode tool gives its answer. One slim line: their
 * story if they have one, or their receipts.
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
    <Link href={profile} className="font-[600] text-[var(--ink)]">
      {name}
    </Link>
  );

  return (
    <aside data-nudge="your_mp_expenses" aria-label={`Expenses for ${name}, your MP`} className={`${shell} ${className}`}>
      <span className={lead}>Your MP, in the receipts</span>
      {story ? (
        <p className={body}>
          {who}, MP for {constituency}: <Stat story={story} /> {story.hook}.{" "}
          <Link href={storyHref(story)} className={link}>
            Read the story →
          </Link>
        </p>
      ) : (
        <p className={body}>
          {who} is your MP for {constituency}. Every receipt they claimed from 2022 to 2026 is
          public.{" "}
          <Link href={receipts} className={link}>
            See what they claimed →
          </Link>
        </p>
      )}
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
    <aside data-nudge="your_msp_story" aria-label={`Expenses story about ${name}`} className={`${shell} ${className}`}>
      <span className={lead}>Your MSP, in the receipts</span>
      <p className={body}>
        <Link href={profileHref} className="font-[600] text-[var(--ink)]">
          {name}
        </Link>
        : <Stat story={story} /> {story.hook}.{" "}
        <Link href={storyHref(story)} className={link}>
          Read the story →
        </Link>
      </p>
    </aside>
  );
}
