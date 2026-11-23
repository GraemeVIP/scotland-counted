/**
 * Server side picks for MP profiles: one or two of the strongest expenses
 * stories about other MPs in the same party, topped up with the biggest
 * stories overall. Reads the full MP list, so keep it out of browser code.
 */
import type { ExpenseStory } from "@/lib/data/expenseStories";
import { getMpByConstituencySlug } from "@/lib/data/mps";
import { mpStories, statValue } from "@/lib/expenseNudges";

/** "Labour (Co-op)" sits with Labour. */
export function partyFamily(party: string) {
  return party.replace(/\s*\(Co-op\)\s*/i, "").trim();
}

function seatOf(story: ExpenseStory) {
  return story.person?.href.split("/").pop() ?? "";
}

export type MpStoryPick = { story: ExpenseStory; party: string; sameParty: boolean };

export function relatedMpStories(constituencySlug: string, party: string, count = 2): MpStoryPick[] {
  const family = partyFamily(party);
  const ranked = mpStories()
    .filter((s) => seatOf(s) !== constituencySlug)
    .map((story) => {
      const theirParty = partyFamily(getMpByConstituencySlug(seatOf(story))?.party ?? "");
      return { story, party: theirParty, sameParty: theirParty === family };
    })
    .sort((a, b) => statValue(b.story.stat) - statValue(a.story.stat));

  const same = ranked.filter((p) => p.sameParty);
  const rest = ranked.filter((p) => !p.sameParty);
  // The biggest same party story leads. The next slot rotates by seat, so
  // 34 Labour profiles do not all send readers to the same two stories.
  if (same.length > 2) {
    let h = 7;
    for (const ch of constituencySlug) h = (h * 31 + ch.charCodeAt(0)) | 0;
    const others = same.slice(1);
    const pick = others[Math.abs(h) % others.length];
    return [same[0], pick, ...others.filter((p) => p !== pick), ...rest].slice(0, count);
  }
  return [...same, ...rest].slice(0, count);
}
