import raw from "./mspInterests.json" with { type: "json" };

export type MspTopReceipt = {
  date: string;
  year: string;
  allowance: string;
  expenditure: string;
  payee: string;
  details: string;
  amount: number;
};

export type MspHolyroodExpenses = {
  receiptCount: number;
  total2425: number;
  total4Yr: number;
  edinburghAcc2425: number;
  councilTax2324: number;
  councilTax2425: number;
  councilTax2526Q1: number;
  hotels2425: number;
  hotels4Yr: number;
  engagement2425: number;
  marchEngagement2025: number;
  office2425: number;
  travel2425: number;
  carMiles4Yr: number;
  newspapers4Yr: number;
  topReceipts: MspTopReceipt[];
};

export type MspFormerWestminsterRecord = {
  formerSeat: string;
  claimCount: number;
  totalPaid: number;
  nonStaffPaid: number;
  flights: number;
  hotels: number;
  hotelNights: number;
  officeRent: number;
  advertisingAndBanners: number;
  redundancy: number;
  topReceipts: {
    date: string;
    year: string;
    category: string;
    costType: string;
    details: string;
    amount: number;
  }[];
};

export type MspRegisterOfInterests = {
  isActiveCouncillor: boolean;
  properties: string[];
  remuneration: string[];
  shares: string[];
  gifts: string[];
  visits: string[];
  voluntaryCount: number;
};

export type MspInterestsProfile = {
  memberId: number;
  name: string;
  party: string;
  area: string;
  roleType: "Constituency" | "Regional";
  searchSlug: string;
  holyroodExpenses: MspHolyroodExpenses | null;
  formerWestminster: MspFormerWestminsterRecord | null;
  registerOfInterests: MspRegisterOfInterests;
};

type MspInterestsPayload = {
  checkedAt: string;
  expensesCoverage: string;
  registerCoverage: string;
  counts: {
    totalMsps: number;
    returningWithExpenses: number;
    formerWestminsterMps: number;
    landlords: number;
    activeCouncillors: number;
  };
  profiles: Record<string, MspInterestsProfile>;
};

const data = raw as MspInterestsPayload;

export const MSP_INTERESTS_CHECKED_AT = data.checkedAt;
export const MSP_INTERESTS_COUNTS = data.counts;

export function getMspInterests(memberId: number): MspInterestsProfile | null {
  return data.profiles[String(memberId)] ?? null;
}
