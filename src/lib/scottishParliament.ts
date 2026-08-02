/**
 * Current MSPs from the Scottish Parliament's official open-data API.
 *
 * The public postcode directory gives us the reader's Holyrood constituency
 * and region. These datasets then join that geography to one constituency MSP
 * and seven regional MSPs. Next's data cache keeps the sizeable source files
 * out of the hot path without making a production build depend on the API.
 */

import { REQUEST_TIMEOUT_MS } from "./parliament.ts";
import {
  representativeSlug,
  type Representative,
  type RepresentativeSource,
} from "./representatives.ts";
import {
  canonicalHolyroodGeographyName,
  publicHolyroodGeographyName,
} from "./scottishParliamentGeography.ts";

const API_ROOT = "https://data.parliament.scot/api";
const DATA_REVALIDATE_SECONDS = 60 * 60;

/**
 * A handful of newly elected members do not yet have their individual page in
 * the open-data Website table. Keep these exact-name fallbacks narrow so an
 * unknown person can never be linked to the wrong profile.
 */
const CURRENT_MEMBER_PROFILE_FALLBACKS = new Map([
  ["Kate Nevens", "https://www.parliament.scot/msps/current-and-previous-msps/kate-nevens"],
  ["Tim Eagle", "https://www.parliament.scot/msps/current-and-previous-msps/tim-eagle"],
  ["Joe Long", "https://www.parliament.scot/msps/current-and-previous-msps/joe-long"],
  ["James Adams", "https://www.parliament.scot/msps/current-and-previous-msps/james-adams"],
]);

export const SCOTTISH_PARLIAMENT_SOURCE_URL = "https://data.parliament.scot/";

type DatedRecord = {
  ValidFromDate: string;
  ValidUntilDate: string | null;
};

export type ScottishParliamentMember = {
  PersonID: number;
  PhotoURL: string | null;
  ParliamentaryName: string;
  PreferredName: string;
  IsCurrent: boolean;
};

export type ScottishParliamentConstituency = DatedRecord & {
  ID: number;
  Name: string;
  RegionID: number;
};

export type ScottishParliamentRegion = {
  ID: number;
  Name: string;
  StartDate: string;
  EndDate: string | null;
};

export type ConstituencyStatus = DatedRecord & {
  PersonID: number;
  ConstituencyID: number;
};

export type RegionStatus = DatedRecord & {
  PersonID: number;
  RegionID: number;
};

export type MemberParty = DatedRecord & {
  ID: number;
  PersonID: number;
  PartyID: number;
};

export type PersonCommitteeRole = DatedRecord & {
  PersonID: number;
  CommitteeRoleID: number;
  CommitteeID: number;
};

export type CommitteeRole = {
  ID: number;
  Name: string;
};

export type Committee = DatedRecord & {
  ID: number;
  Name: string;
};

export type MemberGovernmentRole = DatedRecord & {
  PersonID: number;
  GovernmentRoleID: number;
};

export type GovernmentRole = {
  ID: number;
  Name: string;
};

export type MemberPartyRole = DatedRecord & {
  MemberPartyID: number;
  PartyRoleTypeID: number;
};

export type PartyRole = {
  ID: number;
  Name: string;
};

export type Party = DatedRecord & {
  ID: number;
  PreferredName: string;
  ActualName: string;
};

export type EmailAddress = {
  PersonID: number;
  Address: string;
  IsDefault: boolean;
};

export type Website = {
  PersonID: number;
  WebURL: string;
  IsDefault: boolean;
};

export type Address = {
  PersonID: number;
  /** 1 = parliamentary, 2 = constituency. Home addresses are never used. */
  AddressTypeID: number;
  Line1: string;
  Line2: string;
  Town: string;
  Region: string;
  PostCode: string;
};

export type ScottishParliamentData = {
  members: ScottishParliamentMember[];
  constituencies: ScottishParliamentConstituency[];
  regions: ScottishParliamentRegion[];
  constituencyStatuses: ConstituencyStatus[];
  regionStatuses: RegionStatus[];
  memberParties: MemberParty[];
  parties: Party[];
  emailAddresses: EmailAddress[];
  websites: Website[];
  addresses: Address[];
  personCommitteeRoles: PersonCommitteeRole[];
  committeeRoles: CommitteeRole[];
  committees: Committee[];
  memberGovernmentRoles: MemberGovernmentRole[];
  governmentRoles: GovernmentRole[];
  memberPartyRoles: MemberPartyRole[];
  partyRoles: PartyRole[];
};

export type HolyroodRepresentatives = {
  constituencyMsp: Representative;
  regionalMsps: Representative[];
  source: RepresentativeSource;
};

export type HolyroodDirectory = {
  constituencies: Array<{
    name: string;
    region: string;
    msp: Representative;
  }>;
  regions: Array<{
    name: string;
    msps: Representative[];
  }>;
  source: RepresentativeSource;
};

async function fetchDataset<T>(path: string): Promise<T[]> {
  const response = await fetch(`${API_ROOT}/${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: DATA_REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Scottish Parliament ${path} request failed with ${response.status}`);
  }

  const data = (await response.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error(`Scottish Parliament ${path} response was not a dataset`);
  }

  return data as T[];
}

/** Fetch a cached snapshot. This function is called only from the live API route. */
export async function fetchScottishParliamentData(): Promise<ScottishParliamentData> {
  const websitesPromise = fetchDataset<Website>("websites").catch(() => []);
  const addressesPromise = fetchDataset<Address>("addresses").catch(() => []);
  const personCommitteeRolesPromise = fetchDataset<PersonCommitteeRole>("personcommitteeroles").catch(() => []);
  const committeeRolesPromise = fetchDataset<CommitteeRole>("committeeroles").catch(() => []);
  const committeesPromise = fetchDataset<Committee>("committees").catch(() => []);
  const memberGovernmentRolesPromise = fetchDataset<MemberGovernmentRole>("membergovernmentroles").catch(() => []);
  const governmentRolesPromise = fetchDataset<GovernmentRole>("governmentroles").catch(() => []);
  const memberPartyRolesPromise = fetchDataset<MemberPartyRole>("memberpartyroles").catch(() => []);
  const partyRolesPromise = fetchDataset<PartyRole>("partyroles").catch(() => []);

  const [
    members,
    constituencies,
    regions,
    constituencyStatuses,
    regionStatuses,
    memberParties,
    parties,
    emailAddresses,
    websites,
    addresses,
    personCommitteeRoles,
    committeeRoles,
    committees,
    memberGovernmentRoles,
    governmentRoles,
    memberPartyRoles,
    partyRoles,
  ] = await Promise.all([
    fetchDataset<ScottishParliamentMember>("members"),
    fetchDataset<ScottishParliamentConstituency>("constituencies"),
    fetchDataset<ScottishParliamentRegion>("regions"),
    fetchDataset<ConstituencyStatus>("MemberElectionConstituencyStatuses"),
    fetchDataset<RegionStatus>("MemberElectionregionStatuses"),
    fetchDataset<MemberParty>("memberparties"),
    fetchDataset<Party>("parties"),
    fetchDataset<EmailAddress>("emailaddresses"),
    websitesPromise,
    addressesPromise,
    personCommitteeRolesPromise,
    committeeRolesPromise,
    committeesPromise,
    memberGovernmentRolesPromise,
    governmentRolesPromise,
    memberPartyRolesPromise,
    partyRolesPromise,
  ]);

  return {
    members,
    constituencies,
    regions,
    constituencyStatuses,
    regionStatuses,
    memberParties,
    parties,
    emailAddresses,
    websites,
    addresses,
    personCommitteeRoles,
    committeeRoles,
    committees,
    memberGovernmentRoles,
    governmentRoles,
    memberPartyRoles,
    partyRoles,
  };
}

function normaliseName(value: string) {
  return canonicalHolyroodGeographyName(value);
}

function isActive(from: string, until: string | null, at: Date) {
  const atTime = at.getTime();
  const fromTime = Date.parse(from);
  const untilTime = until ? Date.parse(until) : Number.POSITIVE_INFINITY;
  return Number.isFinite(fromTime) && fromTime <= atTime && untilTime >= atTime;
}

function displayName(member: ScottishParliamentMember) {
  const comma = member.ParliamentaryName.indexOf(",");
  if (comma < 0) return member.ParliamentaryName.trim();

  const surname = member.ParliamentaryName.slice(0, comma).trim();
  const givenNames = member.ParliamentaryName.slice(comma + 1).trim();
  return `${member.PreferredName.trim() || givenNames} ${surname}`.trim();
}

function latestActive<T extends DatedRecord>(records: T[], at: Date) {
  return records
    .filter((record) => isActive(record.ValidFromDate, record.ValidUntilDate, at))
    .sort((a, b) => Date.parse(b.ValidFromDate) - Date.parse(a.ValidFromDate))[0];
}

function officeAddressFor(personId: number, data: ScottishParliamentData) {
  const address =
    data.addresses.find(
      (item) => item.PersonID === personId && item.AddressTypeID === 2
    ) ??
    data.addresses.find(
      (item) => item.PersonID === personId && item.AddressTypeID === 1
    );

  if (!address) return undefined;
  const formatted = [
    address.Line1,
    address.Line2,
    address.Town,
    address.Region,
    address.PostCode,
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");

  return formatted || undefined;
}

function uniqueRoleNames(items: Array<string | undefined>) {
  return Array.from(new Set(items.filter((item): item is string => Boolean(item)))).sort((a, b) =>
    a.localeCompare(b, "en-GB")
  );
}

function currentCommitteeRoles(personId: number, data: ScottishParliamentData, at: Date) {
  return uniqueRoleNames(
    data.personCommitteeRoles
      .filter((item) => item.PersonID === personId && isActive(item.ValidFromDate, item.ValidUntilDate, at))
      .map((item) => {
        const committee = data.committees.find((record) => record.ID === item.CommitteeID);
        const role = data.committeeRoles.find((record) => record.ID === item.CommitteeRoleID);
        if (!committee) return undefined;
        const committeeName = committee.Name.trim();
        const roleName = role?.Name.trim();
        return roleName && roleName !== "Member" ? `${roleName}, ${committeeName}` : committeeName;
      })
  );
}

function currentGovernmentRoles(personId: number, data: ScottishParliamentData, at: Date) {
  return uniqueRoleNames(
    data.memberGovernmentRoles
      .filter((item) => item.PersonID === personId && isActive(item.ValidFromDate, item.ValidUntilDate, at))
      .map((item) => data.governmentRoles.find((role) => role.ID === item.GovernmentRoleID)?.Name.trim())
  );
}

function currentPartyRoles(memberPartyId: number | undefined, data: ScottishParliamentData, at: Date) {
  if (!memberPartyId) return [];
  return uniqueRoleNames(
    data.memberPartyRoles
      .filter((item) => item.MemberPartyID === memberPartyId && isActive(item.ValidFromDate, item.ValidUntilDate, at))
      .map((item) => data.partyRoles.find((role) => role.ID === item.PartyRoleTypeID)?.Name.trim())
  );
}

function representativeFor(
  personId: number,
  representationType: "constituency" | "regional",
  areaName: string,
  data: ScottishParliamentData,
  at: Date,
  termStart: string,
): Representative | null {
  const member = data.members.find((item) => item.PersonID === personId && item.IsCurrent);
  if (!member) return null;

  const email =
    data.emailAddresses.find((item) => item.PersonID === personId && item.IsDefault)?.Address ??
    data.emailAddresses.find((item) => item.PersonID === personId)?.Address;
  if (!email?.includes("@")) return null;

  const partyMembership = latestActive(
    data.memberParties.filter((item) => item.PersonID === personId),
    at
  );
  const party = partyMembership
    ? data.parties.find(
        (item) => item.ID === partyMembership.PartyID && isActive(item.ValidFromDate, item.ValidUntilDate, at)
      )
    : undefined;

  const officialProfile = data.websites.find(
    (item) =>
      item.PersonID === personId &&
      /^https:\/\/www\.parliament\.scot\/msps\/current-and-previous-msps\//i.test(item.WebURL)
  );
  const name = displayName(member);
  const profileUrl =
    officialProfile?.WebURL ??
    CURRENT_MEMBER_PROFILE_FALLBACKS.get(name) ??
    "https://www.parliament.scot/msps/current-and-previous-msps";
  const photoSourceUrl = member.PhotoURL?.trim() || profileUrl;

  return {
    role: "MSP",
    name,
    party: party?.PreferredName || party?.ActualName || "Party not listed",
    constituency: areaName,
    email,
    officeAddress: officeAddressFor(personId, data),
    memberId: personId,
    profileUrl,
    ...(photoSourceUrl
      ? {
          photoUrl: `/images/representatives/msps/${representativeSlug(name)}.jpg`,
          photoSourceUrl,
        }
      : {}),
    termStart,
    committeeRoles: currentCommitteeRoles(personId, data, at),
    governmentRoles: currentGovernmentRoles(personId, data, at),
    partyRoles: currentPartyRoles(partyMembership?.ID, data, at),
    representationType,
  };
}

function sourceAt(checkedAt: Date): RepresentativeSource {
  return {
    name: "Scottish Parliament Open Data",
    url: SCOTTISH_PARLIAMENT_SOURCE_URL,
    checkedAt: checkedAt.toISOString(),
  };
}

function constituencyMspFor(
  constituency: ScottishParliamentConstituency,
  data: ScottishParliamentData,
  checkedAt: Date
) {
  const status = latestActive(
    data.constituencyStatuses.filter(
      (item) => item.ConstituencyID === constituency.ID
    ),
    checkedAt
  );

  return status
    ? representativeFor(
        status.PersonID,
        "constituency",
        constituency.Name,
        data,
        checkedAt,
        status.ValidFromDate,
      )
    : null;
}

function regionalMspsFor(
  region: ScottishParliamentRegion,
  data: ScottishParliamentData,
  checkedAt: Date
) {
  const publicRegionName = publicHolyroodGeographyName(region.Name);

  return Array.from(
    new Set(
      data.regionStatuses
        .filter(
          (item) =>
            item.RegionID === region.ID &&
            isActive(item.ValidFromDate, item.ValidUntilDate, checkedAt)
        )
        .map((item) => item.PersonID)
    )
  )
    .map((personId) => {
      const status = latestActive(
        data.regionStatuses.filter(
          (item) => item.PersonID === personId && item.RegionID === region.ID
        ),
        checkedAt,
      );
      return status
        ? representativeFor(
            personId,
            "regional",
            publicRegionName,
            data,
            checkedAt,
            status.ValidFromDate,
          )
        : null;
    })
    .filter((representative): representative is Representative => representative !== null)
    .sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
}

/**
 * Join a postcode's two Holyrood names to the official current-member data.
 * A complete result is deliberately required: saying "your eight MSPs" while
 * silently returning fewer would be more misleading than failing this half of
 * the lookup and leaving the independently sourced MP result available.
 */
export function buildHolyroodRepresentatives(
  data: ScottishParliamentData,
  constituencyName: string,
  regionName: string,
  checkedAt = new Date()
): HolyroodRepresentatives {
  const constituency = data.constituencies.find(
    (item) =>
      normaliseName(item.Name) === normaliseName(constituencyName) &&
      isActive(item.ValidFromDate, item.ValidUntilDate, checkedAt)
  );
  const region = data.regions.find(
    (item) =>
      normaliseName(item.Name) === normaliseName(regionName) &&
      isActive(item.StartDate, item.EndDate, checkedAt)
  );

  if (!constituency || !region || constituency.RegionID !== region.ID) {
    throw new Error("Scottish Parliament geography could not be matched");
  }

  const constituencyMsp = constituencyMspFor(constituency, data, checkedAt);
  const regionalMsps = regionalMspsFor(region, data, checkedAt);

  if (!constituencyMsp || regionalMsps.length !== 7) {
    throw new Error("Scottish Parliament returned an incomplete set of current MSPs");
  }

  return {
    constituencyMsp,
    regionalMsps,
    source: sourceAt(checkedAt),
  };
}

/**
 * Build the complete current Holyrood directory from a supplied snapshot.
 * This is pure so a checked-in snapshot can be generated deliberately; page
 * builds never need to call the upstream API.
 */
export function buildHolyroodDirectory(
  data: ScottishParliamentData,
  checkedAt = new Date()
): HolyroodDirectory {
  const currentRegions = data.regions.filter((region) =>
    isActive(region.StartDate, region.EndDate, checkedAt)
  );
  const regions = currentRegions
    .map((region) => {
      const msps = regionalMspsFor(region, data, checkedAt);
      if (msps.length !== 7) {
        throw new Error(`Scottish Parliament returned ${msps.length} current MSPs for ${region.Name}`);
      }
      return { name: publicHolyroodGeographyName(region.Name), msps };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "en-GB"));

  const regionNames = new Map(
    currentRegions.map((region) => [region.ID, publicHolyroodGeographyName(region.Name)]),
  );

  const constituencies = data.constituencies
    .filter((constituency) =>
      isActive(constituency.ValidFromDate, constituency.ValidUntilDate, checkedAt)
    )
    .map((constituency) => {
      const msp = constituencyMspFor(constituency, data, checkedAt);
      const region = regionNames.get(constituency.RegionID);
      if (!msp || !region) {
        throw new Error(`Scottish Parliament returned an incomplete record for ${constituency.Name}`);
      }
      return { name: constituency.Name, region, msp };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "en-GB"));

  return {
    constituencies,
    regions,
    source: sourceAt(checkedAt),
  };
}

export async function fetchHolyroodRepresentatives(
  constituencyName: string,
  regionName: string
): Promise<HolyroodRepresentatives> {
  const data = await fetchScottishParliamentData();
  return buildHolyroodRepresentatives(data, constituencyName, regionName);
}
