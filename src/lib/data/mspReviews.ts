import { holyroodConstituencies, holyroodRegions, type HolyroodMspContact } from "./holyrood.ts";
import { representativeSlug } from "../representatives.ts";

export type ApprovedMspReview = {
  id: string;
  memberId: number;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  authorName: string;
  relationship: "constituent" | "family advocate" | "community advocate";
  interactionDate?: string;
  publishedDate: string;
};

/**
 * Only reviews that have passed the published moderation rules belong here.
 * Submission emails and verification material must never be copied into this file.
 */
export type MspReviewProfile = {
  slug: string;
  profilePath: string;
  msp: HolyroodMspContact;
  areas: string[];
  representation: "constituency" | "regional";
};

const profilesById = new Map<number, MspReviewProfile>();

for (const record of holyroodConstituencies) {
  profilesById.set(record.msp.memberId, {
    slug: representativeSlug(record.msp.name),
    profilePath: `/representatives/msps/constituencies/${record.constituencySlug}`,
    msp: record.msp,
    areas: [record.constituency],
    representation: "constituency",
  });
}

for (const region of holyroodRegions) {
  for (const msp of region.msps) {
    if (!profilesById.has(msp.memberId)) {
      profilesById.set(msp.memberId, {
        slug: representativeSlug(msp.name),
        profilePath: `/representatives/msps/regions/${region.regionSlug}/${representativeSlug(msp.name)}`,
        msp,
        areas: [region.region],
        representation: "regional",
      });
    }
  }
}

export const mspReviewProfiles = [...profilesById.values()].sort((a, b) =>
  a.msp.name.localeCompare(b.msp.name, "en-GB"),
);

export function getMspReviewProfile(slug: string) {
  return mspReviewProfiles.find((profile) => profile.slug === slug);
}

export function getMspReviewProfileByMemberId(memberId: number) {
  return mspReviewProfiles.find((profile) => profile.msp.memberId === memberId);
}

export function getMspRating(reviews: ApprovedMspReview[]) {
  if (reviews.length === 0) return null;
  return {
    reviewCount: reviews.length,
    ratingValue: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
  };
}
