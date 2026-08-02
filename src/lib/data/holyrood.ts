import snapshot from "./holyrood.json" with { type: "json" };
import type { Representative } from "../representatives.ts";
import type { HolyroodRepresentatives } from "../scottishParliament.ts";
import { canonicalHolyroodGeographyName } from "../scottishParliamentGeography.ts";

export type HolyroodMspContact = {
  name: string;
  party: string;
  email: string;
  officeAddress: string | null;
  profileUrl: string;
};

export type HolyroodConstituencyRecord = {
  constituency: string;
  constituencySlug: string;
  region: string;
  regionSlug: string;
  msp: HolyroodMspContact;
};

export type HolyroodRegionRecord = {
  region: string;
  regionSlug: string;
  msps: HolyroodMspContact[];
};

export const HOLYROOD_DATA_CHECKED_AT = snapshot.checkedAt;
export const HOLYROOD_DATA_SOURCE = snapshot.source;
export const HOLYROOD_DATA_SOURCE_NAME = snapshot.sourceName;
export const holyroodConstituencies = snapshot.constituencies as HolyroodConstituencyRecord[];
export const holyroodRegions = snapshot.regions as HolyroodRegionRecord[];

function toRepresentative(
  contact: HolyroodMspContact,
  representationType: "constituency" | "regional",
  area: string,
): Representative {
  return {
    role: "MSP",
    name: contact.name,
    party: contact.party,
    email: contact.email,
    officeAddress: contact.officeAddress ?? undefined,
    profileUrl: contact.profileUrl,
    constituency: area,
    representationType,
  };
}

export function getHolyroodConstituencyBySlug(slug: string) {
  return holyroodConstituencies.find((item) => item.constituencySlug === slug);
}

export function getHolyroodRegionBySlug(slug: string) {
  return holyroodRegions.find((item) => item.regionSlug === slug);
}

/**
 * Checked-in fallback for the live postcode route. It deliberately requires
 * both geography names to agree before returning a complete set of eight MSPs.
 */
export function getSnapshotHolyroodRepresentatives(
  constituencyName: string,
  regionName: string,
): HolyroodRepresentatives | null {
  const constituency = holyroodConstituencies.find(
    (item) =>
      canonicalHolyroodGeographyName(item.constituency) ===
      canonicalHolyroodGeographyName(constituencyName),
  );
  const region = holyroodRegions.find(
    (item) =>
      canonicalHolyroodGeographyName(item.region) ===
      canonicalHolyroodGeographyName(regionName),
  );

  if (!constituency || !region || constituency.regionSlug !== region.regionSlug) return null;

  return {
    constituencyMsp: toRepresentative(
      constituency.msp,
      "constituency",
      constituency.constituency,
    ),
    regionalMsps: region.msps.map((msp) => toRepresentative(msp, "regional", region.region)),
    source: {
      name: HOLYROOD_DATA_SOURCE_NAME,
      url: HOLYROOD_DATA_SOURCE,
      checkedAt: HOLYROOD_DATA_CHECKED_AT,
    },
  };
}

export function formatHolyroodCheckedDate(locale = "en-GB") {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date(HOLYROOD_DATA_CHECKED_AT));
}
