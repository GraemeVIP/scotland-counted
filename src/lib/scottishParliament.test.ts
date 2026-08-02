import test from "node:test";
import assert from "node:assert/strict";
import {
  buildHolyroodDirectory,
  buildHolyroodRepresentatives,
  type ScottishParliamentData,
} from "./scottishParliament.ts";

const CHECKED_AT = new Date("2026-08-02T03:30:00.000Z");
const CURRENT_FROM = "2026-05-07T00:00:00";

function fixture(): ScottishParliamentData {
  const people = Array.from({ length: 8 }, (_, index) => index + 1);

  return {
    members: [
      ...people.map((personId) => ({
        PersonID: personId,
        PhotoURL: null,
        ParliamentaryName: `Person${personId}, Alex`,
        PreferredName: "Alex",
        IsCurrent: true,
      })),
      {
        PersonID: 99,
        PhotoURL: null,
        ParliamentaryName: "Former, Frankie",
        PreferredName: "Frankie",
        IsCurrent: true,
      },
    ],
    constituencies: [
      {
        ID: 201,
        Name: "Glasgow Kelvin and Maryhill",
        RegionID: 23,
        ValidFromDate: CURRENT_FROM,
        ValidUntilDate: null,
      },
    ],
    regions: [
      {
        ID: 20,
        Name: "Glasgow",
        StartDate: "2011-05-05T00:00:00",
        EndDate: "2026-05-06T00:00:00",
      },
      {
        ID: 23,
        Name: "Glasgow",
        StartDate: CURRENT_FROM,
        EndDate: null,
      },
    ],
    constituencyStatuses: [
      {
        PersonID: 1,
        ConstituencyID: 201,
        ValidFromDate: CURRENT_FROM,
        ValidUntilDate: null,
      },
    ],
    regionStatuses: [
      ...people.slice(1).map((personId) => ({
        PersonID: personId,
        RegionID: 23,
        ValidFromDate: CURRENT_FROM,
        ValidUntilDate: null,
      })),
      {
        PersonID: 99,
        RegionID: 20,
        ValidFromDate: "2021-05-06T00:00:00",
        ValidUntilDate: null,
      },
    ],
    memberParties: people.map((personId) => ({
      ID: personId,
      PersonID: personId,
      PartyID: 1,
      ValidFromDate: CURRENT_FROM,
      ValidUntilDate: null,
    })),
    parties: [
      {
        ID: 1,
        PreferredName: "Example Party",
        ActualName: "Example Party",
        ValidFromDate: CURRENT_FROM,
        ValidUntilDate: null,
      },
    ],
    emailAddresses: people.map((personId) => ({
      PersonID: personId,
      Address: `alex.person${personId}.msp@parliament.scot`,
      IsDefault: true,
    })),
    websites: people.map((personId) => ({
      PersonID: personId,
      WebURL: `https://www.parliament.scot/msps/current-and-previous-msps/alex-person-${personId}`,
      IsDefault: false,
    })),
    addresses: people.map((personId) => ({
      PersonID: personId,
      AddressTypeID: personId === 1 ? 2 : 1,
      Line1: personId === 1 ? "1 Glasgow Road" : "The Scottish Parliament",
      Line2: "",
      Town: personId === 1 ? "Glasgow" : "Edinburgh",
      Region: "",
      PostCode: personId === 1 ? "G1 1AA" : "EH99 1SP",
    })),
    personCommitteeRoles: [],
    committeeRoles: [],
    committees: [],
    memberGovernmentRoles: [],
    governmentRoles: [],
    memberPartyRoles: [],
    partyRoles: [],
  };
}

test("joins one constituency MSP and exactly seven regional MSPs", () => {
  const result = buildHolyroodRepresentatives(
    fixture(),
    "  glasgow kelvin and maryhill ",
    "Glasgow",
    CHECKED_AT
  );

  assert.equal(result.constituencyMsp.name, "Alex Person1");
  assert.equal(result.constituencyMsp.representationType, "constituency");
  assert.equal(result.constituencyMsp.constituency, "Glasgow Kelvin and Maryhill");
  assert.equal(result.constituencyMsp.officeAddress, "1 Glasgow Road, Glasgow, G1 1AA");
  assert.equal(result.regionalMsps.length, 7);
  assert.ok(result.regionalMsps.every((msp) => msp.representationType === "regional"));
  assert.ok(result.regionalMsps.every((msp) => msp.constituency === "Glasgow"));
  assert.ok(result.regionalMsps.every((msp) => msp.party === "Example Party"));
  assert.equal(result.source.name, "Scottish Parliament Open Data");
  assert.equal(result.source.checkedAt, CHECKED_AT.toISOString());
});

test("rejects an incomplete set instead of claiming it contains all eight MSPs", () => {
  const data = fixture();
  data.emailAddresses = data.emailAddresses.filter((item) => item.PersonID !== 8);

  assert.throws(
    () =>
      buildHolyroodRepresentatives(
        data,
        "Glasgow Kelvin and Maryhill",
        "Glasgow",
        CHECKED_AT
      ),
    /incomplete set of current MSPs/
  );
});

test("builds a complete pure directory for checked-in page data", () => {
  const directory = buildHolyroodDirectory(fixture(), CHECKED_AT);

  assert.equal(directory.constituencies.length, 1);
  assert.equal(directory.constituencies[0].name, "Glasgow Kelvin and Maryhill");
  assert.equal(directory.constituencies[0].region, "Glasgow");
  assert.equal(directory.constituencies[0].msp.name, "Alex Person1");
  assert.equal(directory.regions.length, 1);
  assert.equal(directory.regions[0].msps.length, 7);
  assert.equal(directory.source.checkedAt, CHECKED_AT.toISOString());
});

test("uses an exact official profile fallback for a current member missing a website record", () => {
  const data = fixture();
  data.members[0] = {
    PersonID: 1,
    PhotoURL: null,
    ParliamentaryName: "Nevens, Kate",
    PreferredName: "Kate",
    IsCurrent: true,
  };
  data.websites = data.websites.filter((item) => item.PersonID !== 1);

  const result = buildHolyroodRepresentatives(
    data,
    "Glasgow Kelvin and Maryhill",
    "Glasgow",
    CHECKED_AT,
  );

  assert.equal(
    result.constituencyMsp.profileUrl,
    "https://www.parliament.scot/msps/current-and-previous-msps/kate-nevens",
  );
});

test("expands the Parliament API's shortened region name in public records", () => {
  const data = fixture();
  data.regions[1].Name = "Central Scot and Lothians West";

  const representatives = buildHolyroodRepresentatives(
    data,
    "Glasgow Kelvin and Maryhill",
    "Central Scotland and Lothians West",
    CHECKED_AT,
  );
  const directory = buildHolyroodDirectory(data, CHECKED_AT);

  assert.ok(
    representatives.regionalMsps.every(
      (msp) => msp.constituency === "Central Scotland and Lothians West",
    ),
  );
  assert.equal(directory.constituencies[0].region, "Central Scotland and Lothians West");
  assert.equal(directory.regions[0].name, "Central Scotland and Lothians West");
});
