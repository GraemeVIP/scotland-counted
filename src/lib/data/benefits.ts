/**
 * Social Security Scotland rates and contact details, as published on
 * mygov.scot and checked on 29 October 2026.
 *
 * The benefit guides, their quick answer boxes and the phone number page all
 * read from here, so an April uprating is changed once.
 */

export const SSS_SOURCE = { publisher: "mygov.scot", url: "https://www.mygov.scot/contact-social-security-scotland" };

export const SOCIAL_SECURITY_SCOTLAND = {
  phone: "0800 182 2222",
  phoneHref: "tel:08001822222",
  hours: "8am to 5pm, Monday to Friday, except bank holidays",
  abroad: "+44 (0)1382 931 000",
  post: ["Social Security Scotland", "General Enquiries", "PO Box 10301", "Dundee", "DD1 9FY"],
} as const;

/** Weekly rates for 2026/27. */
export const ADULT_DISABILITY_PAYMENT = {
  dailyLiving: { standard: 76.7, enhanced: 114.6 },
  mobility: { standard: 30.3, enhanced: 80 },
  source: { publisher: "mygov.scot", url: "https://www.mygov.scot/adult-disability-payment" },
} as const;

export const CARER_SUPPORT_PAYMENT = {
  weekly: 86.45,
  supplement: 11.7,
  additionalPerson: 10.4,
  earningsLimit: 204,
  hours: 35,
  additionalPersonHours: 20,
  source: { publisher: "mygov.scot", url: "https://www.mygov.scot/carer-support-payment" },
} as const;

export const BEST_START = {
  pregnancyAndBabyFirst: 796.65,
  pregnancyAndBabyLater: 398.35,
  earlyLearning: 331.95,
  schoolAge: 331.95,
  /** Best Start Foods, paid every four weeks. */
  foods: { pregnancy: 22.4, underOne: 44.8, oneToThree: 22.4 },
  source: { publisher: "mygov.scot", url: "https://www.mygov.scot/best-start-grant-best-start-foods" },
} as const;

export const YOUNG_CARER_GRANT = {
  yearly: 405.1,
  hours: 16,
  source: { publisher: "mygov.scot", url: "https://www.mygov.scot/young-carer-grant" },
} as const;

/** Winter 2026 to 2027. Replaced Winter Fuel Payment in Scotland. */
export const PENSION_AGE_WINTER_HEATING = {
  min: 105.55,
  max: 316.7,
  under80: 211.15,
  over80: 316.7,
  bothOver80Together: 158.35,
  sharedUnder80: 105.55,
  incomeThreshold: 35000,
  bornOnOrBefore: "27 June 1960",
  qualifyingWeek: "Monday 21 September to Sunday 27 September 2026",
  paidFrom: "November 2026",
  chaseBy: "the start of March 2027",
  bankReference: "PAWHP",
  source: { publisher: "mygov.scot", url: "https://www.mygov.scot/pension-age-winter-heating-payment" },
} as const;

export const WINTER_HEATING_PAYMENT = {
  amount: 62,
  qualifyingWeek: "2 November to 8 November 2026",
  paidFrom: "December",
  bankReference: "WHP",
  source: { publisher: "mygov.scot", url: "https://www.mygov.scot/winter-heating-payment" },
} as const;

/**
 * When a payment date lands on a bank holiday, Social Security Scotland pays
 * early. Covers Adult Disability Payment, Carer Support Payment, Child
 * Disability Payment, Pension Age Disability Payment, Scottish Child Payment
 * and Scottish Adult DLA. Best Start Foods is not affected.
 */
export const BANK_HOLIDAY_PAYMENT_DATES: Array<{ due: string; paid: string }> = [
  { due: "Thursday 24 December 2026", paid: "Wednesday 23 December 2026" },
  { due: "Friday 25 December 2026", paid: "Wednesday 23 December 2026" },
  { due: "Monday 28 December 2026", paid: "Wednesday 23 December 2026" },
  { due: "Friday 1 January 2027", paid: "Thursday 31 December 2026" },
  { due: "Monday 4 January 2027", paid: "Thursday 31 December 2026" },
  { due: "Friday 26 March 2027", paid: "Thursday 25 March 2027" },
  { due: "Monday 29 March 2027", paid: "Thursday 25 March 2027" },
  { due: "Monday 3 May 2027", paid: "Friday 30 April 2027" },
  { due: "Monday 31 May 2027", paid: "Friday 28 May 2027" },
  { due: "Monday 30 August 2027", paid: "Friday 27 August 2027" },
  { due: "Monday 27 December 2027", paid: "Friday 24 December 2027" },
  { due: "Tuesday 28 December 2027", paid: "Friday 24 December 2027" },
  { due: "Wednesday 29 December 2027", paid: "Friday 24 December 2027" },
  { due: "Monday 3 January 2028", paid: "Friday 31 December 2027" },
  { due: "Tuesday 4 January 2028", paid: "Friday 31 December 2027" },
];

export const BANK_HOLIDAY_SOURCE = { publisher: "mygov.scot", url: "https://www.mygov.scot/bank-holiday-payment-dates" };

/**
 * The Scottish Welfare Fund line for each council, taken from the council's
 * own crisis grant page. Where the council publishes no phone line, or its
 * page could not be checked, phone is left out and the page says so.
 */
export type CrisisGrantLine = {
  councilSlug: string;
  council: string;
  phone?: string;
  hours?: string;
  note?: string;
  url: string;
};

export const CRISIS_GRANT_LINES: CrisisGrantLine[] = [
  { councilSlug: "aberdeen-city", council: "Aberdeen City", phone: "0800 03 04 713", hours: "9am to 5pm, Monday to Friday", url: "https://www.aberdeencity.gov.uk/services/benefits-and-advice/apply-scottish-welfare-fund" },
  { councilSlug: "aberdeenshire", council: "Aberdeenshire", phone: "01467 537400", url: "https://www.aberdeenshire.gov.uk/benefits-and-grants/scottish-welfare-fund/crisis-grants/" },
  { councilSlug: "angus", council: "Angus", phone: "03452 777 778", note: "Council contact centre", url: "https://www.angus.gov.uk/benefits_and_money_advice/apply_for_a_grant_from_the_scottish_welfare_fund" },
  { councilSlug: "argyll-and-bute", council: "Argyll and Bute", phone: "01546 605512", hours: "9am to 12.30pm and 1.30pm to 4.45pm, Monday to Friday", note: "Choose option 1", url: "https://www.argyll-bute.gov.uk/council-tax-and-benefits/benefits-and-grants/crisis-grants" },
  { councilSlug: "clackmannanshire", council: "Clackmannanshire", phone: "01259 450000", note: "Revenue Services", url: "https://www.clacks.gov.uk/council/welfarefund/" },
  { councilSlug: "dumfries-and-galloway", council: "Dumfries and Galloway", note: "We could not confirm a current number. Use the council page.", url: "https://www.dumfriesandgalloway.gov.uk/benefits-financial-support/apply-benefits-financial-support/crisis-grant" },
  { councilSlug: "dundee-city", council: "Dundee", phone: "0300 102 4011", hours: "9.30am to 4.30pm, Monday to Friday", note: "Option 1. The old 01382 431188 still works.", url: "https://www.dundeecity.gov.uk/welfare-reform/crisis-and-community-care-grants-scottish-welfare-fund" },
  { councilSlug: "east-ayrshire", council: "East Ayrshire", phone: "01563 554400", note: "Option 2", url: "https://www.east-ayrshire.gov.uk/CouncilAndGovernment/Benefits/Scottish-Welfare-Fund.aspx" },
  { councilSlug: "east-dunbartonshire", council: "East Dunbartonshire", phone: "0300 123 4510", note: "Ask for the Scottish Welfare Fund team", url: "https://www.eastdunbarton.gov.uk/services/a-z-of-services/benefits/scottish-welfare-fund/" },
  { councilSlug: "east-lothian", council: "East Lothian", phone: "01620 828790", url: "https://www.eastlothian.gov.uk/benefits-and-support/scottish-welfare-fund/crisis-grant-and-community-care-grant" },
  { councilSlug: "east-renfrewshire", council: "East Renfrewshire", phone: "0141 577 3475", url: "https://www.eastrenfrewshire.gov.uk/crisis-grants" },
  { councilSlug: "city-of-edinburgh", council: "Edinburgh", phone: "0131 529 5299", url: "https://www.edinburgh.gov.uk/benefits-grants/scottish-welfare-fund/3" },
  { councilSlug: "falkirk", council: "Falkirk", phone: "0808 100 3161", hours: "9am to 5pm, Monday to Friday", url: "https://www.falkirk.gov.uk/benefits/scottish-welfare-fund" },
  { councilSlug: "fife", council: "Fife", note: "No phone line on the council's crisis grant page. Apply online.", url: "https://www.fife.gov.uk/benefits-money-advice/scottish-welfare-fund/crisis" },
  { councilSlug: "glasgow-city", council: "Glasgow", phone: "0141 276 1177", note: "Option 1", url: "https://www.glasgow.gov.uk/swf" },
  { councilSlug: "highland", council: "Highland", phone: "0800 083 1887", note: "Freephone advice line", url: "https://www.highland.gov.uk/directory-record/4757/scottish-welfare-fund" },
  { councilSlug: "inverclyde", council: "Inverclyde", phone: "01475 714444", hours: "9am to 3pm, Monday to Friday", note: "They will call you back", url: "https://www.inverclyde.gov.uk/advice-and-benefits/scottish-welfare-fund/how-to-apply" },
  { councilSlug: "midlothian", council: "Midlothian", phone: "0131 270 5600", url: "https://www.midlothian.gov.uk/info/612/benefits_and_grants/208/scottish_welfare_fund" },
  { councilSlug: "moray", council: "Moray", phone: "01343 563456", note: "Customer contact team", url: "https://www.moray.gov.uk/benefits-and-grants/benefits-service/scottish-welfare-fund/" },
  { councilSlug: "na-h-eileanan-siar", council: "Western Isles", note: "No phone line on the council's crisis grant page. Apply online.", url: "https://www.cne-siar.gov.uk/benefits-and-grants/scottish-welfare-fund-0/crisis-grant" },
  { councilSlug: "north-ayrshire", council: "North Ayrshire", phone: "01294 310001", url: "https://www.north-ayrshire.gov.uk/benefits/scottish-welfare-fund.aspx" },
  { councilSlug: "north-lanarkshire", council: "North Lanarkshire", phone: "0300 555 0405", url: "https://www.northlanarkshire.gov.uk/benefits-and-money/scottish-welfare-fund/crisis-grants" },
  { councilSlug: "orkney-islands", council: "Orkney", phone: "01856 873535", url: "https://www.orkney.gov.uk/benefits-council-tax-and-money/benefits-and-financial-support/scottish-welfare-fund" },
  { councilSlug: "perth-and-kinross", council: "Perth and Kinross", phone: "01738 476900", note: "Option 2", url: "https://www.pkc.gov.uk/scottishwelfarefund" },
  { councilSlug: "renfrewshire", council: "Renfrewshire", phone: "0300 300 0204", note: "Help to apply", url: "https://www.renfrewshire.gov.uk/benefits-and-money/scottish-welfare-fund/apply-crisis-grant" },
  { councilSlug: "scottish-borders", council: "Scottish Borders", phone: "0300 100 1800", note: "Customer Advice and Support", url: "https://www.scotborders.gov.uk/benefits-grants/community-care-grant-crisis-grant" },
  { councilSlug: "shetland-islands", council: "Shetland", phone: "01595 744682", hours: "9am to 3.45pm, Monday to Friday", url: "https://www.shetland.gov.uk/support-grants-benefits/scottish-welfare-fund" },
  { councilSlug: "south-ayrshire", council: "South Ayrshire", phone: "0300 123 0900", note: "Ask for a crisis grant", url: "https://www.south-ayrshire.gov.uk/scottish-welfare-fund" },
  { councilSlug: "south-lanarkshire", council: "South Lanarkshire", phone: "0800 952 0448", url: "https://www.southlanarkshire.gov.uk/Scottish-Welfare-Fund" },
  { councilSlug: "stirling", council: "Stirling", phone: "01786 233210", url: "https://www.stirling.gov.uk/housing/benefits/crisis-grants/" },
  { councilSlug: "west-dunbartonshire", council: "West Dunbartonshire", phone: "01389 737640", url: "https://www.west-dunbarton.gov.uk/welfarefund" },
  { councilSlug: "west-lothian", council: "West Lothian", phone: "01506 280000", hours: "8.30am to 5pm", url: "https://www.westlothian.gov.uk/scottish-welfare-fund" },
];

export const telHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, "")}`;
