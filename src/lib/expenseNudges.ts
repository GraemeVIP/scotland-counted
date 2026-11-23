/**
 * Small helpers that point readers from a profile or a tool result to the
 * expenses stories and the Receipt Finder.
 *
 * Safe for browser components: it only reads the short story list, never the
 * big MP or MSP data files, so the tools stay light.
 */
import { EXPENSE_STORIES, type ExpenseStory } from "@/lib/data/expenseStories";

/** The same slug rule the MP pages use: "Motherwell, Wishaw and Carluke" to "motherwell-wishaw-and-carluke". */
export function placeSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function storyHref(story: ExpenseStory) {
  return `/blog/${story.slug}`;
}

/** The expenses story about the politician on this profile, if there is one. */
export function storyForProfile(profileHref: string): ExpenseStory | undefined {
  return EXPENSE_STORIES.find((s) => s.person?.href === profileHref);
}

export function mpProfileHref(constituencySlug: string) {
  return `/representatives/mps/${constituencySlug}`;
}

/** Every Scottish MP's own receipts in the Receipt Finder. */
export function mpReceiptsHref(constituencySlug: string) {
  return `/mp-expenses-scotland/search?mp=${constituencySlug}`;
}

/** "£67,519" to 67519, so stories can be ranked by size. */
export function statValue(stat: string) {
  const n = Number(stat.replace(/[^0-9.]/g, ""));
  return /m$/i.test(stat.trim()) ? n * 1_000_000 : n;
}

/** The Holyrood stories, biggest first. */
export function mspStories(excludeSlug?: string): ExpenseStory[] {
  return EXPENSE_STORIES.filter((s) => s.group === "msp" && s.slug !== excludeSlug);
}

export function mpStories(): ExpenseStory[] {
  return EXPENSE_STORIES.filter((s) => s.group === "mp");
}

/** The single biggest MP story, used where a tool has no postcode to go on. */
export function biggestMpStory(): ExpenseStory {
  return [...mpStories()].sort((a, b) => statValue(b.stat) - statValue(a.stat))[0];
}

/** Stories that praise a politician for spending little. Shown in calm colours. */
const PRAISE_STORIES = new Set(["meghan-gallacher-msp-low-expenses"]);

export function isPraiseStory(story: ExpenseStory) {
  return PRAISE_STORIES.has(story.slug);
}
