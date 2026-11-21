import snapshot from "@/lib/data/mpLondonRecord.json";
import { getMpInterestsByMemberId } from "@/lib/data/mpInterests";

/*
 * How often each Scottish MP was needed at Westminster in IPSA's 2025/26 year
 * (1 April 2025 to 31 March 2026), from Parliament's own open data. Refreshed
 * by scripts/update-mp-london-record.mjs.
 */

export type MpRole = {
  kind: "government" | "opposition" | "other" | "committee";
  name: string;
  start: string | null;
  end: string | null;
};

export type MpLondonRecord = {
  memberId: number;
  name: string;
  constituencySlug: string;
  memberSince: string | null;
  votes: number;
  speakingDays: number;
  spokenContributions: number;
  writtenQuestions: number;
  posts: MpRole[];
  committees: MpRole[];
  hotelNights: number;
  hotelPaid: number;
};

export const LONDON_RECORD = {
  checkedDate: snapshot.checkedDate,
  year: snapshot.year,
  start: snapshot.start,
  end: snapshot.end,
  sittingDays: snapshot.sittingDays,
  fridaySittings: snapshot.fridaySittings,
  weekendSittings: snapshot.weekendSittings,
  divisions: snapshot.divisions,
  averageTurnoutPct: snapshot.averageTurnoutPct,
  sources: snapshot.sources,
};

const records = snapshot.records as MpLondonRecord[];

/** True when the MP served the whole of 2025/26. */
export function servedFullYear(r: MpLondonRecord) {
  return !r.memberSince || r.memberSince <= LONDON_RECORD.start;
}

/** True when the MP was not in the Commons at all during 2025/26. */
export function notAnMpThatYear(r: MpLondonRecord) {
  return !!r.memberSince && r.memberSince > LONDON_RECORD.end;
}

export function getLondonRecordByConstituencySlug(slug: string) {
  return records.find((r) => r.constituencySlug === slug);
}

/** A minister or whip at any point in the year: their job limits speaking and questions. */
export function heldFrontbenchJob(r: MpLondonRecord) {
  return r.posts.some(
    (p) => p.kind === "government" || /whip/i.test(p.name),
  );
}

export function roleLabel(r: MpLondonRecord): string | null {
  const gov = r.posts.filter((p) => p.kind === "government");
  if (gov.some((p) => /secretary of state/i.test(p.name) && !/under-secretary/i.test(p.name)))
    return "Cabinet minister";
  if (gov.some((p) => /whip/i.test(p.name))) return gov.some((p) => !/whip/i.test(p.name)) ? "Minister" : "Government whip";
  if (gov.length) return "Minister";
  if (r.posts.some((p) => /whip/i.test(p.name))) return "Party whip";
  if (r.posts.some((p) => /^shadow (secretary|minister|chancellor|deputy leader|leader)/i.test(p.name)))
    return "Shadow minister";
  if (r.posts.some((p) => p.kind === "opposition" || /spokesperson/i.test(p.name))) return "Party spokesperson";
  return null;
}

function median(values: number[]) {
  const s = [...values].sort((a, b) => a - b);
  if (!s.length) return 0;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

const fullYear = records.filter(servedFullYear);

/** Middle values across the Scottish MPs who served all of 2025/26. */
export const SCOTTISH_MIDDLE = {
  votes: Math.round(median(fullYear.map((r) => r.votes))),
  speakingDays: Math.round(median(fullYear.map((r) => r.speakingDays))),
  writtenQuestions: Math.round(median(fullYear.map((r) => r.writtenQuestions))),
  count: fullYear.length,
};

export type LondonTableRow = {
  name: string;
  party: string;
  slug: string;
  role: string | null;
  secondHome: number;
  perSittingDay: number;
  hotelNights: number;
  votes: number;
  votePct: number;
  speakingDays: number;
  writtenQuestions: number;
};

/** One row per MP who served all of 2025/26, for the all-MPs table. */
export function londonTableRows(parties: Record<number, string>): LondonTableRow[] {
  return fullYear.map((r) => {
    const secondHome = getMpInterestsByMemberId(r.memberId)?.expenses?.accommodationSpend ?? 0;
    return {
      name: r.name,
      party: parties[r.memberId] ?? "",
      slug: r.constituencySlug,
      role: roleLabel(r),
      secondHome,
      perSittingDay: secondHome / LONDON_RECORD.sittingDays,
      hotelNights: r.hotelNights,
      votes: r.votes,
      votePct: Math.round((r.votes / LONDON_RECORD.divisions) * 100),
      speakingDays: r.speakingDays,
      writtenQuestions: r.writtenQuestions,
    };
  });
}
