import snapshot from "@/lib/data/mpInterests.json";

export type MpDonationItem = {
  id: number;
  donor: string;
  donorStatus: string;
  value: number;
  date: string | null;
  description: string;
  address: string | null;
  companyNumber: string | null;
};

export type MpVisitItem = {
  id: number;
  countries: string[];
  destinations: string[];
  donors: string[];
  value: number;
  startDate: string | null;
  endDate: string | null;
  purpose: string;
  paymentDetails: string | null;
  appg: string | null;
};

export type MpEarningItem = {
  id: number;
  role: string;
  payer: string | null;
  value: number;
  regularity: string | null;
  hours: number | null;
  description: string | null;
};

export type MpPropertyItem = {
  id: number;
  location: string;
  country: string;
  type: string;
  description: string | null;
  rentalIncome: boolean;
  ownerDetails: string | null;
};

export type MpShareholdingItem = {
  id: number;
  organisation: string;
  description: string | null;
  threshold: string | null;
};

export type MpFamilyItem = {
  id: number;
  kind: "lobbying" | "employed";
  personName: string;
  relation: string;
  jobTitle: string;
  employer: string;
};

export type MpExpensesSummary = {
  year: string;
  totalSpend: number;
  nonStaffSpend: number;
  staffingSpend: number;
  officeSpend: number;
  accommodationSpend: number;
  travelSpend: number;
  otherSpend: number;
  secondHomeRent: number;
  secondHomeCouncilTax: number;
  secondHomeUtilities: number;
  londonHotels: number;
  flights: number;
  rail: number;
  taxis: number;
  dependantTravel: number;
  parking: number;
};

export type MpInterestRecord = {
  memberId: number;
  name: string;
  party: string;
  constituency: string;
  constituencySlug: string;
  registerUrl: string;
  ipsaUrl?: string;
  donationsTotal: number;
  giftsTotal: number;
  visitsTotal: number;
  earningsTotal: number;
  totalFinancialValue: number;
  expenses: MpExpensesSummary | null;
  donations: MpDonationItem[];
  gifts: MpDonationItem[];
  visits: MpVisitItem[];
  earnings: MpEarningItem[];
  properties: MpPropertyItem[];
  shareholdings: MpShareholdingItem[];
  family: MpFamilyItem[];
  miscellaneousCount: number;
};

export const MP_INTERESTS_CHECKED_ISO = snapshot.checkedDate;
export const MP_INTERESTS_SOURCE = snapshot.source;
export const MP_INTERESTS_SOURCE_NAME = snapshot.sourceName;
export const mpInterests = snapshot.records as MpInterestRecord[];

export function getMpInterestsByConstituencySlug(slug: string): MpInterestRecord | undefined {
  return mpInterests.find((record) => record.constituencySlug === slug);
}

export function getMpInterestsByMemberId(memberId: number): MpInterestRecord | undefined {
  return mpInterests.find((record) => record.memberId === memberId);
}

export const MP_INTERESTS_TOTALS = (() => {
  let donations = 0;
  let gifts = 0;
  let visits = 0;
  let donationsCount = 0;
  let giftsCount = 0;
  let visitsCount = 0;
  let propertiesCount = 0;
  let rentalPropertiesCount = 0;
  let shareholdingsCount = 0;
  let familyCount = 0;
  let mpsWithFinancialDeclarations = 0;

  let expensesTotal = 0;
  let expensesNonStaff = 0;
  let expensesStaffing = 0;
  let expensesOffice = 0;
  let expensesAccommodation = 0;
  let expensesTravel = 0;
  let secondHomeRent = 0;
  let secondHomeCouncilTax = 0;
  let secondHomeUtilities = 0;
  let londonHotels = 0;
  let flights = 0;
  let taxis = 0;
  let dependantTravel = 0;
  let parking = 0;

  for (const mp of mpInterests) {
    donations += mp.donationsTotal;
    gifts += mp.giftsTotal;
    visits += mp.visitsTotal;
    donationsCount += mp.donations.length;
    giftsCount += mp.gifts.length;
    visitsCount += mp.visits.length;
    propertiesCount += mp.properties.length;
    rentalPropertiesCount += mp.properties.filter((p) => p.rentalIncome).length;
    shareholdingsCount += mp.shareholdings.length;
    familyCount += mp.family.length;
    if (mp.totalFinancialValue > 0) mpsWithFinancialDeclarations += 1;

    if (mp.expenses) {
      expensesTotal += mp.expenses.totalSpend;
      expensesNonStaff += mp.expenses.nonStaffSpend;
      expensesStaffing += mp.expenses.staffingSpend;
      expensesOffice += mp.expenses.officeSpend;
      expensesAccommodation += mp.expenses.accommodationSpend;
      expensesTravel += mp.expenses.travelSpend;
      secondHomeRent += mp.expenses.secondHomeRent;
      secondHomeCouncilTax += mp.expenses.secondHomeCouncilTax;
      secondHomeUtilities += mp.expenses.secondHomeUtilities;
      londonHotels += mp.expenses.londonHotels;
      flights += mp.expenses.flights;
      taxis += mp.expenses.taxis;
      dependantTravel += mp.expenses.dependantTravel;
      parking += mp.expenses.parking;
    }
  }

  const r = (n: number) => Math.round(n * 100) / 100;

  return {
    donations: r(donations),
    gifts: r(gifts),
    visits: r(visits),
    combined: r(donations + gifts + visits),
    donationsCount,
    giftsCount,
    visitsCount,
    propertiesCount,
    rentalPropertiesCount,
    shareholdingsCount,
    familyCount,
    mpsWithFinancialDeclarations,
    expensesTotal: r(expensesTotal),
    expensesNonStaff: r(expensesNonStaff),
    expensesStaffing: r(expensesStaffing),
    expensesOffice: r(expensesOffice),
    expensesAccommodation: r(expensesAccommodation),
    expensesTravel: r(expensesTravel),
    secondHomeRent: r(secondHomeRent),
    secondHomeCouncilTax: r(secondHomeCouncilTax),
    secondHomeUtilities: r(secondHomeUtilities),
    londonHotels: r(londonHotels),
    flights: r(flights),
    taxis: r(taxis),
    dependantTravel: r(dependantTravel),
    parking: r(parking),
  };
})();
