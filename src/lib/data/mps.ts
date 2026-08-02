import snapshot from "@/lib/data/mps.json";
import type { Representative } from "@/lib/representatives";
import type { VoteRecord } from "@/lib/voting";

export type MpRecord = {
  constituency: string;
  constituencySlug: string;
  constituencyCode: string;
  memberId: number;
  name: string;
  party: string;
  email: string;
  phone: string | null;
  officeAddress: string;
  website: string | null;
  profileUrl: string;
  photoUrl: string;
  photoSourceUrl: string;
  votes?: VoteRecord[];
};

export const MP_DATA_CHECKED_ISO = snapshot.checkedDate;
export const MP_DATA_SOURCE = snapshot.source;
export const MP_DATA_SOURCE_NAME = snapshot.sourceName;
export const mps = snapshot.records as MpRecord[];

export function getMpByConstituencySlug(slug: string) {
  return mps.find((mp) => mp.constituencySlug === slug);
}

export function getMpByConstituencyName(name: string) {
  const normalised = name.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en-GB");
  return mps.find(
    (mp) =>
      mp.constituency
        .normalize("NFKC")
        .trim()
        .replace(/\s+/g, " ")
        .toLocaleLowerCase("en-GB") === normalised
  );
}

export function mpRecordToRepresentative(mp: MpRecord): Representative {
  return {
    role: "MP",
    name: mp.name,
    party: mp.party,
    constituency: mp.constituency,
    email: mp.email,
    memberId: mp.memberId,
    phone: mp.phone ?? undefined,
    officeAddress: mp.officeAddress,
    profileUrl: mp.profileUrl,
    photoUrl: mp.photoUrl,
    photoSourceUrl: mp.photoSourceUrl,
    votes: mp.votes,
  };
}

export function formatMpCheckedDate(locale = "en-GB") {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${MP_DATA_CHECKED_ISO}T00:00:00Z`));
}
