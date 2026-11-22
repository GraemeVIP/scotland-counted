import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, SectionHead, CTA } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import SharePage from "@/components/SharePage";
import Faq from "@/components/Faq";
import FindMpEmail from "@/components/FindMpEmail";
import { JsonLd, articleJsonLd, faqJsonLd, meta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Face, Expand } from "@/components/ExpenseKit";

/*
 * The receipts: single IPSA claim lines by Scottish MPs that most people would
 * never guess are paid from public money. Every figure and every quoted
 * description is copied from IPSA's individualBusinessCosts files, 2022/23 to
 * 2026/27 (checked 21 November 2026). Yearly totals match mpInterests.json,
 * which feeds the main MP expenses page.
 */

const PATH = "/mp-expenses-scotland/receipts";
const PUBLISHED_ISO = "2026-11-21";
const HERO_IMAGE = {
  src: "/images/editorial/mp-expenses-scotland-receipts.webp",
  alt: "Close-up of curled paper expense receipts on dark Scottish slate and oak beneath a brass magnifying glass and fountain pen",
  width: 1500,
  height: 1000,
};
const IPSA_YOUR_MP = "https://www.theipsa.org.uk/mp-staffing-business-costs/your-mp";
const IPSA_DOWNLOADS = "https://www.theipsa.org.uk/mp-staffing-business-costs/annual-publications";

export const metadata = meta({
  title: "Strangest Scottish MP Expenses: The Receipts, 2022 to 2026",
  description:
    "£23,437 of power paid in one day for Kilmarnock's MP, £3,000 for a speech coach, £546 to jet wash a second home's drains, a £1,248 iPhone. The real IPSA receipts.",
  path: PATH,
  type: "article",
  published: PUBLISHED_ISO,
  modified: PUBLISHED_ISO,
  image: HERO_IMAGE.src,
  imageAlt: HERO_IMAGE.alt,
  imageWidth: HERO_IMAGE.width,
  imageHeight: HERO_IMAGE.height,
  imageType: "image/webp",
});

type Receipt = {
  amount: string;
  what: string;
  mp: string;
  party: string;
  seat: string;
  slug: string;
  date: string;
  budget: string;
  /** IPSA's own wording, copied exactly. */
  ipsa: string[];
  context: ReactNode;
  /** Optional plain price comparison: [what, typical cost]. */
  compare?: [string, string][];
  /** Heading over the compare box. Defaults to "What this normally costs". */
  compareTitle?: string;
};

const RECEIPTS: Receipt[] = [
  {
    amount: "£23,437",
    what: "Biggest MP power bill in the UK (paid in one day)",
    mp: "Lillian Jones",
    party: "Scottish Labour",
    seat: "Kilmarnock and Loudoun",
    slug: "kilmarnock-and-loudoun",
    date: "19 May 2026",
    budget: "Paid outside her office cap",
    compareTitle: "Compare it with",
    ipsa: [
      "Lillian Jones - Yu Energy Utilities - 2000294348 (£20,384.74, Miscellaneous)",
      "Lillian Jones - Yu Energy Utilities - 2000294348 (£3,052.21, Other Costs)",
    ],
    context:
      "Two payments on one day to the same Yu Energy account, with £0 paid back. IPSA paid them outside her office cap. It is the biggest single MP power payout in the UK over five years, and £6,587 more than a full year of her office rent.",
    compare: [
      ["Her office power for 5 winter months (Clear Business)", "£1,074"],
      ["Next biggest single MP power bill in the UK", "£5,633"],
      ["A full year's rent for her Kilmarnock office", "£16,850"],
      ["Yu Energy payouts on 19 May 2026", "£23,437"],
    ],
  },
  {
    amount: "£3,000",
    what: "A speech and talk skills class",
    mp: "Angus MacDonald",
    party: "Liberal Democrat",
    seat: "Inverness, Skye and West Ross-shire",
    slug: "inverness-skye-and-west-ross-shire",
    date: "17 July 2025",
    budget: "Staff pot",
    ipsa: [
      "Provision of personalised presentation and speech skills workshop to assist MPs representational role in Parliament.",
    ],
    context:
      "Paid from his staff pot, which mostly pays for the people who work for him.",
  },
  {
    amount: "£546",
    what: "Jet washing the drains at his second home",
    mp: "Angus MacDonald",
    party: "Liberal Democrat",
    seat: "Inverness, Skye and West Ross-shire",
    slug: "inverness-skye-and-west-ross-shire",
    date: "24 and 27 March 2026",
    budget: "Second home pot",
    ipsa: [
      "Drainage professional pressure jet wash cleaning (£312)",
      "Drainage professional mechanical cable cleaning (£234)",
    ],
    context:
      "Paid from his second home pot. That same year he billed £3,314 for power and gas there.",
  },
  {
    amount: "£3,090",
    what: "Just to set up broadband at home",
    mp: "Chris Law",
    party: "Scottish National Party",
    seat: "Dundee Central",
    slug: "dundee-central",
    date: "25 July 2022",
    budget: "Office pot",
    ipsa: ["Home 5G mobile broadband installation"],
    context:
      "The file does not say which home it was for or what the fee covered. Ofcom says 99% of Dundee homes could get fast broadband that year.",
    compare: [
      ["Three's 5G home router, July 2022", "Free with a plan"],
      ["Starlink kit for remote homes, July 2022", "£529"],
      ["Normal phone or web setup by a Scottish MP", "£90"],
      ["Next biggest setup claim by any Scottish MP", "£691"],
      ["Chris Law's claim", "£3,090"],
    ],
  },
  {
    amount: "£10,000",
    what: "An unnamed office set up consultant (Scotland's #1 bill)",
    mp: "Melanie Ward",
    party: "Labour",
    seat: "Cowdenbeath and Kirkcaldy",
    slug: "cowdenbeath-and-kirkcaldy",
    date: "19 December 2024",
    budget: "Staff pot",
    compareTitle: "Compare it with",
    ipsa: [
      "Policy and Office set up consultant (£10,000, Dec 2024)",
      "Communications Support (£4,000, Jul 2025)",
      "research and writing of local industrial strategy (£7,000 across two lines, Apr 2025, repaid in full Aug 2025)",
    ],
    context:
      "The biggest single consultant bill by any Scottish MP. IPSA hides who got the £10,000 or the £4,000 for PR help. She paid back a separate £7,000 four months later. She also billed £4,691 at IKEA.",
    compare: [
      ["Office set up consultant (who got paid is hidden)", "£10,000"],
      ["PR support (who got paid is hidden)", "£4,000"],
      ["Local report (paid back in full 4 months later)", "£7,000"],
      ["IKEA (£4,691), building plans and a lease check, added up", "£8,284"],
    ],
  },
  {
    amount: "£1,248",
    what: "An iPhone and a case",
    mp: "John Lamont",
    party: "Conservative",
    seat: "Berwickshire, Roxburgh and Selkirk",
    slug: "berwickshire-roxburgh-and-selkirk",
    date: "12 June 2025",
    budget: "Office pot",
    ipsa: ["Iphone and protection case"],
    context: "One phone and its case. The file does not name the model.",
  },
  {
    amount: "£3,182",
    what: "Sofas and chairs from DFS and IKEA",
    mp: "Pamela Nash",
    party: "Labour",
    seat: "Motherwell, Wishaw and Carluke",
    slug: "motherwell-wishaw-and-carluke",
    date: "April 2025 to March 2026",
    budget: "Office pot",
    ipsa: [
      "IKEA LTD SHOP ONLINE (£1,334, £395 and £245)",
      "DFS TRADING LIMITED (£1,208)",
    ],
    context:
      "Filed as office kit. That same year she billed £2,750 for new carpet and £2,250 for work.",
  },
  {
    amount: "£510",
    what: "A staff Christmas lunch and team day",
    mp: "Christine Jardine",
    party: "Liberal Democrat",
    seat: "Edinburgh West",
    slug: "edinburgh-west",
    date: "19 December 2025",
    budget: "Office food pot",
    ipsa: ["lunch staff team training Christmas (£250.80)", "team building event (£259.31)"],
    context: "Both billed on the same day, paid from the office budget.",
  },
  {
    amount: "£7,314",
    what: "Lawyers' fees and new desks for an office move",
    mp: "Tracy Gilbert",
    party: "Labour",
    seat: "Edinburgh North and Leith",
    slug: "edinburgh-north-and-leith",
    date: "May 2025",
    budget: "Office pot",
    ipsa: [
      "Legal advice and costs (£3,044)",
      "FURNITURE@WORK LTD (£3,332.40 and £937.20)",
    ],
    context: "£3,044 for lawyers and £4,270 for office kit, all in one month.",
  },
  {
    amount: "£550",
    what: "Food and drink for local firms",
    mp: "Susan Murray",
    party: "Liberal Democrat",
    seat: "Mid Dunbartonshire",
    slug: "mid-dunbartonshire",
    date: "7 July 2025",
    budget: "Office food pot",
    ipsa: ["Hospitality event for Business owners of Mid Dunbartonshire."],
    context: "Food and drink for local business owners, billed as office hospitality.",
  },
  {
    amount: "£13,117",
    what: "Posting a report about himself to every home",
    mp: "John Grady",
    party: "Labour",
    seat: "Glasgow East",
    slug: "glasgow-east",
    date: "12 February 2026",
    budget: "Office pot",
    ipsa: ["Roderick Urquhart/ Treehouse for printing and delivery of MP Annual Report to constituents"],
    context: (
      <>
        IPSA allows this if there is no party badge on it.{" "}
        <Link href="/representatives/mps/coatbridge-and-bellshill">Frank McNally</Link> paid
        £9,974 and{" "}
        <Link href="/representatives/mps/west-aberdeenshire-and-kincardine">Andrew Bowie</Link>{" "}
        £5,898.
      </>
    ),
  },
  {
    amount: "£9,600",
    what: "An outside PR firm for media help",
    mp: "Gregor Poynton",
    party: "Labour",
    seat: "Livingston",
    slug: "livingston",
    date: "21 March 2025",
    budget: "Staff pot",
    ipsa: ["BB Partners Advisory Ltd - Comms and Media Support"],
    context: "BB Partners is a PR firm in Crawley. The bill landed ten days before the budget year ended.",
  },
  {
    amount: "£3,300",
    what: "A billboard ad for himself as local MP",
    mp: "Euan Stainbank",
    party: "Labour",
    seat: "Falkirk",
    slug: "falkirk",
    date: "31 October 2024",
    budget: "Office pot",
    ipsa: ["Advertising board to advertise Euan as local MP and contact details. To be advertised for 1 year."],
    context: "The board showed his name and contact details for one year.",
  },
  {
    amount: "£963",
    what: "A business dinner",
    mp: "Graeme Downie",
    party: "Labour",
    seat: "Dunfermline and Dollar",
    slug: "dunfermline-and-dollar",
    date: "13 March 2025",
    budget: "Office food pot",
    ipsa: ["Fife College hosted business dinner on behalf of Graeme Downie"],
    context: "Hosted by Fife College in his name. Billed 18 days before the budget year ended.",
  },
  {
    amount: "£893",
    what: "A newspaper column bill",
    mp: "Dave Doogan",
    party: "Scottish National Party",
    seat: "Angus and Perthshire Glens",
    slug: "angus-and-perthshire-glens",
    date: "19 June 2026",
    budget: "Office pot",
    ipsa: ["Newspaper Column Invoice"],
    context: "Filed under newspapers. The file does not say what the column was.",
  },
  {
    amount: "£35,792",
    what: "PR firm hired for speech notes and social posts",
    mp: "John Lamont",
    party: "Conservative",
    seat: "Berwickshire, Roxburgh and Selkirk",
    slug: "berwickshire-roxburgh-and-selkirk",
    date: "2022 to 2024 (13 bills)",
    budget: "Staff pot",
    ipsa: [
      "Peach Partners - additional hours as set out on the invoice for broadcast, digital preparation (£9,125)",
      "Peach Partners - social media, speech writing and press support (£2,916.66/month)",
    ],
    context: "Paid to Peach Partners across 13 bills out of his staff pot, on top of his own staff.",
  },
  {
    amount: "£24,530",
    what: "Five years of mobile phone bills (up to £909 a month)",
    mp: "Brendan O'Hara",
    party: "Scottish National Party",
    seat: "Argyll, Bute and South Lochaber",
    slug: "argyll-bute-and-south-lochaber",
    date: "2022 to 2026 (58 bills)",
    budget: "Office pot",
    ipsa: [
      "EE LTD (£909.24 on 9 March 2026)",
      "EE LIMITED (£721.96 on 7 March 2023)",
    ],
    context: "Over £500 a month for five years. That is four times more than any other Scottish MP.",
  },
  {
    amount: "£688",
    what: "Four TV licences billed in under a year",
    mp: "Gregor Poynton",
    party: "Scottish Labour",
    seat: "Livingston",
    slug: "livingston",
    date: "Dec 2024 to Nov 2025",
    budget: "Office pot",
    ipsa: [
      "TVLICENSING.CO.UK (£169.50 on 18 Dec 2024 & £169.50 on 14 Feb 2025)",
      "TVLICENSING.CO.UK (two £174.50 licences split across 4 Nov & 26 Nov 2025)",
    ],
    context: (
      <>
        Part of £10,754 billed by 29 Scottish MPs for TV licences from 2022 to 2026.{" "}
        <Link href="/representatives/mps/glasgow-south-west">Dr Zubir Ahmed</Link> also billed two in
        nine months, one online and one at a Co-op. IPSA only allows TV licences for a local office.
      </>
    ),
  },
];

const BIG_TABS: { mp: string; slug: string; party: string; what: string; amount: string; note: string }[] = [
  {
    mp: "Dr Zubir Ahmed",
    slug: "glasgow-south-west",
    party: "Labour",
    what: "London hotels",
    amount: "£37,359",
    note: "295 nights in one year, about £127 a night, booked by the month",
  },
  {
    mp: "John Grady",
    slug: "glasgow-east",
    party: "Labour",
    what: "London flat rent",
    amount: "£42,000",
    note: "£3,500 a month, the highest in Scotland",
  },
  {
    mp: "Melanie Ward",
    slug: "cowdenbeath-and-kirkcaldy",
    party: "Labour",
    what: "Family travel",
    amount: "£7,932",
    note: "Flights and trains for her family, the highest in Scotland",
  },
  {
    mp: "Chris Law",
    slug: "dundee-central",
    party: "SNP",
    what: "Car parking",
    amount: "£6,292",
    note: "About £121 a week, every week of the year",
  },
  {
    mp: "Gregor Poynton",
    slug: "livingston",
    party: "Labour",
    what: "Taxis",
    amount: "£5,059",
    note: "Nearly £100 a week",
  },
  {
    mp: "Douglas Alexander",
    slug: "lothian-east",
    party: "Labour (Co-op)",
    what: "Second home council tax",
    amount: "£4,093",
    note: "On his own house in East Lothian, which he lists as his second home",
  },
  {
    mp: "Angus MacDonald",
    slug: "inverness-skye-and-west-ross-shire",
    party: "Liberal Democrat",
    what: "Second home energy bills",
    amount: "£3,314",
    note: "On a home where he claims no rent",
  },
  {
    mp: "Chris Law",
    slug: "dundee-central",
    party: "SNP",
    what: "Hotels in Europe",
    amount: "£2,822",
    note: "The most of any Scottish MP",
  },
];

/*
 * Dr Zubir Ahmed's 14 London accommodation claims for 2025/26, exactly as IPSA
 * lists them (date, nights, amount paid, IPSA's own description with reference
 * codes removed). IPSA files every one under "Accommodation · Hotel - London".
 */
const ZUBIR_NIGHTS: [date: string, nights: number, paid: number, ipsa: string][] = [
  ["1 Mar 2025", 1, 91.8, "accommodation hire for parliament"],
  ["27 Mar 2025", 29, 3230.0, "airbnb block booking for 29 nights"],
  ["29 Apr 2025", 30, 3490.0, "Accommodation london 30 night block booking"],
  ["30 Apr 2025", 1, 184.8, "hotel stay while in parliament 30 April"],
  ["27 May 2025", 25, 3615.0, "Accommodation london 25 night block booking"],
  ["21 Jun 2025", 28, 4840.0, "Accommodation london 28 night block booking"],
  ["20 Jul 2025", 10, 1113.0, "block booked london accommodation"],
  ["1 Sep 2025", 10, 1124.26, "MP Accommodation - Block Booking of flat, charging for 10 nights"],
  ["1 Oct 2025", 30, 3537.98, "MP Accommodation - Block Booking of flat"],
  ["1 Nov 2025", 28, 2794.56, "MP Accommodation - Block Booking of flat"],
  ["1 Dec 2025", 19, 3315.5, "Mp Accommodation - Block Booking of flat"],
  ["1 Jan 2026", 28, 3270.06, "MP Accommodation - Block Booking of flat"],
  ["1 Feb 2026", 28, 3323.61, "MP Accommodation - Block Booking of flat"],
  ["1 Mar 2026", 28, 3428.01, "MP Accommodation - Block Booking of flat"],
];
const ZUBIR_TOTAL = ZUBIR_NIGHTS.reduce((sum, r) => sum + r[2], 0);
const ZUBIR_NIGHT_COUNT = ZUBIR_NIGHTS.reduce((sum, r) => sum + r[1], 0);
const gbp = (n: number, pence = true) =>
  `£${n.toLocaleString("en-GB", { minimumFractionDigits: pence ? 2 : 0, maximumFractionDigits: pence ? 2 : 0 })}`;
const ONS_EARNINGS_2026 =
  "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/annualsurveyofhoursandearnings/2026";
const IPSA_ACCOMMODATION = "https://information.ipsaonline.org.uk/guidance/accommodation-costs";
/*
 * How often the Commons needed him in 2025/26 (1 April 2025 to 31 March 2026).
 * Sitting days: Hansard calendar API. Votes: Commons Votes API. Speaking days:
 * Hansard spoken contributions. Written questions: Parliament's written
 * questions API. Minister dates: Members API (Parliamentary Under-Secretary,
 * Department of Health and Social Care, 6 Sep 2025 to 12 May 2026).
 * Checked 21 November 2026.
 */
const COMMONS_SITTING_DAYS = 152;
const ZUBIR_PARLIAMENT = "https://members.parliament.uk/member/5213";
const BACKBENCH_SCORECARD: [label: string, value: string][] = [
  ["Days the Commons sat, April to July 2025", "60"],
  ["London nights paid for (claims dated 27 March to 20 July 2025)", "123"],
  ["Cost of those nights", "£16,473"],
  ["Days he spoke in Commons debates", "11"],
  ["Commons votes he took part in", "75 of 106"],
  ["Written questions he tabled", "0"],
];

const ALL_MPS: [string, string][] = [
  ["£9,160", "newspaper and magazine subscriptions (72 claims)"],
  ["£3,863", "TV licences in 2025/26 (32 claims)"],
  ["£3,559", "food, drink and events filed as hospitality"],
  ["£58,237", "car parking for MPs' own travel"],
  ["£39,254", "taxis for MPs' own travel"],
  ["£73,648", "flights for MPs' husbands, wives, partners and children (flights only; £89,111 with trains and car trips)"],
];

const PUT_IT_TO_THEM = [
  "Why are MPs' expenses published as a 59,503 line spreadsheet, not a plain list anyone can search?",
  "Why are 2,009 Scottish claim lines one yearly total, so nobody can see a single taxi ride or flight?",
  "Why is the supplier's name blanked out on 199 Scottish claims?",
  "Will you back publishing every claim in plain English, with who was paid and what for?",
];

const PUT_IT_SUBJECT = "Question from a constituent: why are MPs' expenses so hard to find?";

const PUT_IT_BODY = `Dear [MP's name],

I am writing as your constituent about how MPs' expenses are published.

IPSA publishes every claim, but as a spreadsheet of 59,503 lines for 2025/26. Of the 6,101 lines for Scottish MPs, 2,009 are single yearly totals, so nobody can see individual journeys, and 199 have the supplier's name blanked out. In practice, almost nobody can find out what their MP claimed.

Please could you answer:

1. Will you publish your own 2025/26 claims in plain English, with what each was for and who was paid?
2. Will you press IPSA to publish every claim in a plain, searchable form, without yearly totals that hide individual journeys?
3. Will you back naming every supplier paid with public money?

Yours sincerely,
[Your name]
[Your address and postcode]`;

const FAQ = [
  {
    q: "Are these claims allowed?",
    a: "Yes. IPSA paid every claim on this page. No rule was broken.",
  },
  {
    q: "Where do these numbers come from?",
    a: "From IPSA's own files, 2022/23 to 2026/27. IPSA's file for 2025/26 alone has 59,503 rows for all 650 UK MPs, and 6,101 of them are for Scottish MPs. Across all five years there are 20,879 Scottish rows, and you can search every one. Wording on this page is copied exactly.",
  },
  {
    q: "Why can I not see each taxi or flight?",
    a: "IPSA lumps most trips into one yearly line per MP. Out of 6,101 Scottish rows in 2025/26, 2,009 are lump sums. Another 199 show [***] where IPSA blanked out who got paid. You see the sum, not the trip.",
  },
  {
    q: "How much does Zubir Ahmed spend a night in London?",
    a: "About £127 a night in 2025/26. IPSA paid £37,358.58 for 295 nights across 14 claims, about £3,113 a month. Most were month long flat stays filed under London hotels. All came under IPSA's £230 night cap.",
  },
  {
    q: "How do I check my own MP?",
    a: "Open your MP's page on Scotland Counted for a plain summary of their bills, gifts and trips. You can also search IPSA's own Your MP tool.",
  },
];

/** One receipt card: amount, plain words, the MP (face and link), IPSA's wording. */
function ReceiptCard({ r, i }: { r: Receipt; i: number }) {
  return (
              <li className="tile flex flex-col overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-dashed border-[var(--rule-strong)] bg-[var(--surface-2)] px-5 py-2.5">
                  <span className="ui text-[14px] font-[600] text-[var(--ink-2)]">
                    Receipt {String(i + 1).padStart(2, "0")} · {r.date}
                  </span>
                  <span className="ui rounded-full border border-[var(--rule-strong)] bg-[var(--paper)] px-2.5 py-0.5 text-[14px] font-[640] text-[var(--ink)]">
                    {r.budget}
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <p className="figure-num tnum text-[clamp(38px,4vw,48px)] leading-none text-[var(--bad-text)]">
                    {r.amount}
                  </p>
                  <h3 className="ui mt-2 text-[19px] font-[680] leading-[1.25] text-[var(--ink)]">
                    {r.what}
                  </h3>
                  <div className="mt-3 flex items-center gap-3">
                    <Face name={r.mp} href={`/representatives/mps/${r.slug}`} size={44} />
                    <p className="ui min-w-0 text-[14px] leading-[1.4] text-[var(--muted)]">
                      <Link
                        href={`/representatives/mps/${r.slug}#donations-and-interests`}
                        className="block text-[16.5px] font-[660] text-[var(--action-text)]"
                      >
                        {r.mp}
                      </Link>
                      {r.party} · {r.seat}
                    </p>
                  </div>
                  <div className="mt-4 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] px-3.5 py-3">
                    <p className="ui mb-1.5 text-[13.5px] font-[640] text-[var(--ink-2)]">What IPSA&apos;s record says</p>
                    {r.ipsa.map((line) => (
                      <p
                        key={line}
                        className="font-[family-name:var(--font-mono)] text-[13px] leading-[1.5] text-[var(--ink-2)]"
                      >
                        &ldquo;{line}&rdquo;
                      </p>
                    ))}
                  </div>
                  <ExplainText>
                    <p className="mt-3.5 text-[15px] leading-[1.55] text-[var(--ink-2)]">
                      {r.context}
                    </p>
                  </ExplainText>
                  {r.compare && (
                    <div className="mt-3.5 overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)]">
                      <p className="ui bg-[var(--surface-2)] px-3.5 py-2 text-[14px] font-[640] text-[var(--ink)]">
                        {r.compareTitle ?? "What this normally costs"}
                      </p>
                      <dl className="divide-y divide-[var(--rule)] text-[14px]">
                        {r.compare.map(([what, cost], i) => {
                          const last = i === r.compare!.length - 1;
                          return (
                            <div
                              key={what}
                              className={`flex items-baseline justify-between gap-4 px-3.5 py-2 ${
                                last ? "bg-[color-mix(in_srgb,var(--bad)_10%,transparent)]" : ""
                              }`}
                            >
                              <dt className={last ? "font-[680] text-[var(--ink)]" : "text-[var(--ink-2)]"}>
                                {what}
                              </dt>
                              <dd
                                className={`tnum shrink-0 font-[680] ${
                                  last ? "text-[var(--bad-text)]" : "text-[var(--ink)]"
                                }`}
                              >
                                {cost}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                    </div>
                  )}
                </div>
              </li>
  );
}

/** One row of the biggest yearly tabs list. */
function TabRow({ t }: { t: (typeof BIG_TABS)[number] }) {
  return (
                <li
                  className="grid gap-x-5 gap-y-1 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Face name={t.mp} href={`/representatives/mps/${t.slug}`} size={40} />
                    <div className="min-w-0">
                    <p className="ui text-[16.5px] font-[660] text-[var(--ink)]">{t.what}</p>
                    <p className="ui mt-0.5 text-[14px] text-[var(--muted)]">
                      <Link
                        href={`/representatives/mps/${t.slug}#donations-and-interests`}
                        className="font-[620] text-[var(--action-text)]"
                      >
                        {t.mp}
                      </Link>{" "}
                      · {t.party} · {t.note}
                    </p>
                  </div>
                  </div>
                  <p className="figure-num tnum text-[28px] leading-none text-[var(--bad-text)] sm:text-right">
                    {t.amount}
                  </p>
                </li>
  );
}

const RECEIPTS_SHOWN = 8;

export default function MpExpenseReceiptsPage() {
  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Scottish MPs", path: "/representatives" },
          { name: "MP Expenses & Register of Interests", path: "/mp-expenses-scotland" },
          { name: "The receipts", path: PATH },
        ]} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={articleJsonLd({
          headline: "The receipts: the strangest things Scottish MPs billed taxpayers for, 2022 to 2026",
          description:
            "A £23,437 power bill paid in one day, speech coaching, drain cleaning, an iPhone and DFS and IKEA furniture: single IPSA expense claims by Scottish MPs, with the official wording.",
          path: PATH,
          published: PUBLISHED_ISO,
          modified: PUBLISHED_ISO,
          image: HERO_IMAGE.src,
          section: "Scottish MPs",
          keywords: ["mp expenses", "mp expenses scotland", "strangest mp expenses", "ipsa expenses"],
          schemaType: "Article",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="The receipts · IPSA records 2022 to 2026 · Checked 21 November 2026"
          title="The receipts: what Scottish MPs billed taxpayers for"
          stat={{
            value: "£23,437",
            label: "paid out in one day for the Kilmarnock MP's electricity. No MP in the UK has a bigger power payout.",
            tone: "bad",
          }}
          lede="Drain cleaning at a second home. An iPhone. DFS and IKEA sofas. A staff Christmas lunch. A billboard of the MP. Every item here is a real claim paid with public money since 2022, copied word for word from IPSA (the body that pays MPs' expenses). All were within the rules."
        >
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href="/mp-expenses-scotland/search" className="btn btn-primary">
              Search all 20,879 receipts yourself →
            </Link>
            <a href="#put-it-to-them" className="btn btn-ghost">
              Email your MP about this ↓
            </a>
          </div>
          <SharePage
            title="The receipts: what Scottish MPs billed taxpayers for"
            text="£23,437 of power paid in one day for one MP, £546 to jet wash a second home's drains and a £1,248 iPhone, all paid by taxpayers. The real receipts:"
            path={PATH}
            label="Share the receipts"
            className="mt-4"
          />
        </PageHeader>

        {/* THE SINGLE RECEIPTS */}
        <ContentFrame as="section" id="receipts">
          <SectionHead eyebrow="Single claims · in IPSA's own words" title={`${RECEIPTS.length} receipts you paid for`} />
          <ExplainText>
            <p className="mt-3 max-w-[66ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              Each card shows the amount, what it was for, and the MP&apos;s own words to IPSA.
              Tap a name for that MP&apos;s full expenses.
            </p>
          </ExplainText>
          <p className="ui mt-4 max-w-[66ch] rounded-[var(--r-s)] border-l-[4px] border-[var(--action)] bg-[var(--action-tint)] px-4 py-3 text-[16px] leading-[1.5] text-[var(--ink)]">
            <strong>Each MP gets set pots of public money:</strong> office, staff and second home.
            The label at the top of each card says which pot paid.
          </p>

          <ol className="mt-8 grid gap-5 md:grid-cols-2">
            {RECEIPTS.slice(0, RECEIPTS_SHOWN).map((r, i) => (
              <ReceiptCard key={r.what} r={r} i={i} />
            ))}
          </ol>
          <Expand summary={`Show ${RECEIPTS.length - RECEIPTS_SHOWN} more receipts`}>
            <ol className="grid gap-5 md:grid-cols-2">
              {RECEIPTS.slice(RECEIPTS_SHOWN).map((r, i) => (
                <ReceiptCard key={r.what} r={r} i={i + RECEIPTS_SHOWN} />
              ))}
            </ol>
          </Expand>
        </ContentFrame>

        {/* BIGGEST YEARLY TABS */}
        <ContentFrame as="section" id="biggest-tabs" className="pt-16">
          <SectionHead
            eyebrow="Yearly totals · one MP each"
            title="The biggest tabs run up by a single Scottish MP"
          />
          <div className="tile mt-7 overflow-hidden">
            <ul className="divide-y divide-[var(--rule)]">
              {BIG_TABS.slice(0, 4).map((t) => (
                <TabRow key={t.mp + t.what} t={t} />
              ))}
            </ul>
          </div>
          <Expand summary={`Show ${BIG_TABS.length - 4} more`}>
            <ul className="divide-y divide-[var(--rule)]">
              {BIG_TABS.slice(4).map((t) => (
                <TabRow key={t.mp + t.what} t={t} />
              ))}
            </ul>
          </Expand>

          {/* ONE MP'S LONDON NIGHTS, CLAIM BY CLAIM */}
          <div id="hotel-nights" className="mt-12">
            <h3 className="ui text-[22px] font-[680] leading-[1.25] text-[var(--ink)]">
              {gbp(ZUBIR_TOTAL, false)} of London nights in one year
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <Face name="Dr Zubir Ahmed" href="/representatives/mps/glasgow-south-west" size={52} />
              <p className="ui min-w-0 text-[14px] leading-[1.4] text-[var(--muted)]">
                <Link
                  href="/representatives/mps/glasgow-south-west#donations-and-interests"
                  className="block text-[18px] font-[680] text-[var(--action-text)]"
                >
                  Dr Zubir Ahmed
                </Link>
                Labour · Glasgow South West
              </p>
            </div>
            <ExplainText>
              <p className="ui mt-3 max-w-[68ch] text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
                IPSA lists {ZUBIR_NIGHTS.length} London stay claims for him in 2025/26. Most are
                month long flat stays, plus one Airbnb.
              </p>
            </ExplainText>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {[
                [gbp(ZUBIR_TOTAL / ZUBIR_NIGHT_COUNT), "a night, on average"],
                [`${ZUBIR_NIGHT_COUNT}`, "nights paid in one year, about 42 weeks"],
                [gbp(ZUBIR_TOTAL / 12, false), "a month, on average"],
                [`${ZUBIR_NIGHTS.length}`, "separate claims in one year"],
              ].map(([n, label]) => (
                <div key={label} className="tile p-4 sm:p-5">
                  <p className="figure-num tnum text-[26px] leading-none text-[var(--bad-text)] sm:text-[30px]">{n}</p>
                  <p className="ui mt-2 text-[14px] leading-[1.4] text-[var(--ink-2)]">{label}</p>
                </div>
              ))}
            </div>

            <p className="ui mt-5 max-w-[68ch] text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
              <strong className="text-[var(--ink)]">Is it allowed?</strong> Yes. MPs can book
              hotels instead of renting a flat.{" "}
              <a href={IPSA_ACCOMMODATION} target="_blank" rel="noopener noreferrer">
                IPSA&apos;s London cap is £230 a night
              </a>
              . Every stay here sat below that cap.
            </p>

            <Expand summary={`Show all ${ZUBIR_NIGHTS.length} claims`}>
              <ul className="divide-y divide-[var(--rule)]">
                {ZUBIR_NIGHTS.map(([date, nights, paid, ipsa]) => (
                  <li
                    key={date + ipsa}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="ui text-[15.5px] font-[660] text-[var(--ink)]">
                        {date} · {nights} {nights === 1 ? "night" : "nights"}
                      </p>
                      <p className="ui mt-0.5 text-[14px] leading-[1.4] text-[var(--muted)]">&ldquo;{ipsa}&rdquo;</p>
                    </div>
                    <div className="text-right">
                      <p className="figure-num tnum text-[19px] leading-none text-[var(--ink)]">{gbp(paid)}</p>
                      <p className="ui tnum mt-1 text-[13.5px] text-[var(--muted)]">{gbp(paid / nights)} a night</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="ui mt-3 text-[14px] text-[var(--muted)]">
                Dates and wording as IPSA prints them, with codes taken out. IPSA files them all
                under &ldquo;Hotel - London&rdquo;.
              </p>
            </Expand>

            <Expand summary="How often was he needed in London?">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  [`${COMMONS_SITTING_DAYS}`, "days the Commons sat in 2025/26"],
                  [`${ZUBIR_NIGHT_COUNT}`, "London nights you paid for"],
                  [gbp(ZUBIR_TOTAL / COMMONS_SITTING_DAYS, false), "for each day it sat"],
                ].map(([n, label]) => (
                  <div key={label} className="tile p-3 sm:p-5">
                    <p className="figure-num tnum text-[23px] leading-none text-[var(--bad-text)] sm:text-[30px]">{n}</p>
                    <p className="ui mt-2 text-[13.5px] leading-[1.35] text-[var(--ink-2)] sm:text-[14px]">{label}</p>
                  </div>
                ))}
              </div>
              <ExplainText>
                <p className="ui mt-4 max-w-[68ch] text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
                  &ldquo;The Commons sat&rdquo; means MPs met in the House of Commons to debate and
                  vote. That is normally Monday to Thursday. In 2025/26 it sat on{" "}
                  {COMMONS_SITTING_DAYS} days. You paid for {ZUBIR_NIGHT_COUNT} of his London nights:{" "}
                  {ZUBIR_NIGHT_COUNT - COMMONS_SITTING_DAYS} more nights than sitting days.
                </p>
              </ExplainText>

              <p className="ui mt-6 text-[16px] font-[660] text-[var(--ink)]">
                Before he became a minister: April to July 2025
              </p>
              <div className="tile mt-3 overflow-hidden">
                <dl className="divide-y divide-[var(--rule)]">
                  {BACKBENCH_SCORECARD.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
                      <dt className="ui text-[14.5px] leading-[1.4] text-[var(--ink-2)]">{label}</dt>
                      <dd className="figure-num tnum shrink-0 text-right text-[19px] leading-none text-[var(--ink)]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <ExplainText>
                <p className="ui mt-4 max-w-[68ch] text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
                  He was then a backbencher (an MP with no job in government). His London work was
                  votes, debates and questions. In those four months you paid for twice as many
                  London nights as sitting days. He asked zero written questions.
                </p>
                <p className="ui mt-3 max-w-[68ch] text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
                  <strong className="text-[var(--ink)]">From 6 Sept 2025 to 12 May 2026 he was a health minister</strong>{" "}
                  (a job in government, running part of a department). Ministers work in London on
                  weekdays, so more nights make sense. Even so, his stays ran seven nights a week.
                </p>
                <p className="ui mt-3 max-w-[68ch] text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
                  Over the full year he voted in 202 of 301 votes (67%). The average MP voted in 69%.{" "}
                  <a href={ZUBIR_PARLIAMENT} target="_blank" rel="noopener noreferrer">
                    His record on Parliament&apos;s site →
                  </a>
                </p>
                <p className="ui mt-3 max-w-[68ch] text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
                  <strong className="text-[var(--ink)]">How does it compare?</strong> It beats the
                  £27,873 rent paid by the middle Scottish MP. Six Scottish MPs cost more once bills
                  are added, led by{" "}
                  <Link href="/representatives/mps/glasgow-east">John Grady</Link> at £45,573.{" "}
                  {gbp(ZUBIR_TOTAL, false)} is also close to a full time wage: the middle UK full
                  time worker earned{" "}
                  <a href={ONS_EARNINGS_2026} target="_blank" rel="noopener noreferrer">
                    £39,157 a year before tax
                  </a>{" "}
                  in April 2025 (ONS).
                </p>
                <p className="ui mt-3 max-w-[68ch] text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
                  <strong className="text-[var(--ink)]">Since July 2024:</strong> 548 nights and
                  £67,519 up to April 2026. His first three claims for 2026/27 cover 75 nights at
                  about £145 a night.
                </p>
              </ExplainText>
            </Expand>
          </div>

          <p className="ui mt-10 text-[15px] leading-[1.55] text-[var(--ink-2)]">
            <strong className="text-[var(--ink)]">Why do MPs get second homes?</strong> MPs work in
            two places, so you pay for a second home. They can own it and still bill its council tax
            and heat.{" "}
            <Link href="/mp-expenses-scotland#why-second-homes">How second home rules work →</Link>
          </p>

          <h3 className="ui mt-12 text-[22px] font-[680] leading-[1.25] text-[var(--ink)]">
            And across all 55 Scottish MPs with claims in 2025/26
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_MPS.map(([amount, label]) => (
              <div key={label} className="tile p-5">
                <p className="figure-num tnum text-[30px] leading-none text-[var(--ink)]">{amount}</p>
                <p className="ui mt-2 text-[14.5px] leading-[1.4] text-[var(--ink-2)]">{label}</p>
              </div>
            ))}
          </div>
        </ContentFrame>

        {/* WHY YOU'VE NEVER SEEN THIS */}
        <ContentFrame as="section" id="why-hidden" className="pt-16">
          <SectionHead
            eyebrow="Published, but hard to find"
            title="Why you have never seen these receipts"
          />
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "Reason 1",
                head: "Buried in a huge file",
                big: "59,503",
                unit: "rows",
                body: "That is IPSA's 2025/26 file for all 650 UK MPs. Just 6,101 rows are for Scottish MPs (20,879 over five years). Printed out, the file is 1,000 pages. Nobody spots a £3,000 speech coach by chance.",
              },
              {
                n: "Reason 2",
                head: "Lumped into one yearly sum",
                big: "2,009",
                unit: "Scottish claims",
                body: "These show one figure for a whole year. You see £5,059 on taxis. You cannot see a single ride, where it went, or why.",
              },
              {
                n: "Reason 3",
                head: "The name is blanked out",
                big: "199",
                unit: "Scottish claims",
                body: "IPSA blanked out who got paid and put [***] instead. You see public cash went out. You cannot see who got it.",
              },
            ].map((c) => (
              <div key={c.n} className="tile-night tile p-6">
                <p className="tile-key">{c.n}</p>
                <h3 className="ui mt-1.5 text-[19px] font-[680] leading-[1.25] text-white">
                  {c.head}
                </h3>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="figure-num tnum text-[40px] leading-none text-white">{c.big}</span>
                  <span className="ui text-[14px] font-[600] text-[var(--deep-muted)]">{c.unit}</span>
                </p>
                <p className="mt-3 text-[15px] leading-[1.55] text-[var(--deep-muted)]">{c.body}</p>
              </div>
            ))}
          </div>
          <ExplainText>
            <div className="mt-7 max-w-[66ch] space-y-4 text-[17px] leading-[1.65] text-[var(--ink-2)]">
              <p>
                After the 2009 expenses scandal, Parliament set up IPSA to pay and publish MPs&apos;
                expenses. It does. IPSA puts them in huge files on a
                site most folk never visit. Each line is a code, a pot name, and a few words.
              </p>
              <p>
                Nothing is secret by law. Yet almost nobody has time to read that many rows. So
                odd claims sit unread. We read the Scottish rows so you do not have to.
              </p>
            </div>
          </ExplainText>

          <div className="tile mt-8 p-6 sm:p-7">
            <p className="ui text-[19px] font-[680] text-[var(--ink)]">Check any MP yourself</p>
            <ol className="mt-4 space-y-3">
              {[
                { n: 1, href: "/email-your-mp-and-msp", label: "Find your MP by postcode", note: "A plain summary of their bills.", external: false },
                { n: 2, href: IPSA_YOUR_MP, label: "IPSA's Your MP tool", note: "Type their name to see each line.", external: true },
                { n: 3, href: IPSA_DOWNLOADS, label: "IPSA's full files", note: "Every row, for every MP.", external: true },
              ].map((step) => (
                <li key={step.n} className="flex items-start gap-3">
                  <span className="tnum inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[15px] font-[700] text-[var(--paper)]">
                    {step.n}
                  </span>
                  <div className="min-w-0">
                    {step.external ? (
                      <a href={step.href} className="ui text-[17px] font-[660] text-[var(--action-text)]">
                        {step.label} →
                      </a>
                    ) : (
                      <Link href={step.href} className="ui text-[17px] font-[660] text-[var(--action-text)]">
                        {step.label} →
                      </Link>
                    )}
                    <p className="text-[15.5px] leading-[1.5] text-[var(--ink-2)]">{step.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </ContentFrame>

        {/* PUT IT TO THEM */}
        <ContentFrame as="section" id="put-it-to-them" className="pt-16">
          <SectionHead eyebrow="Hidden in plain sight" title="Put it to them" />
          <ExplainText>
            <p className="mt-3 max-w-[66ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              MPs can say their bills are online, and they are: IPSA publishes them in giant files
              that few people open. Here are four questions MPs and IPSA could answer.
            </p>
          </ExplainText>
          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {PUT_IT_TO_THEM.map((q, i) => (
              <li key={q} className="tile flex gap-4 p-5">
                <span className="tnum inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bad-text)] text-[14px] font-[700] text-white">
                  {i + 1}
                </span>
                <p className="ui text-[16px] font-[600] leading-[1.45] text-[var(--ink)]">{q}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-[var(--r-m)] border border-[var(--rule)] border-l-[4px] border-l-[var(--action)] bg-[var(--action-tint)] p-5 sm:p-6">
            <p className="ui text-[18px] font-[660] text-[var(--ink)]">Send these questions to your MP</p>
            <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
              Type your postcode. We find your MP and fill in their email for you.
            </p>
            <details className="mt-2 max-w-[60ch] text-[14.5px] text-[var(--ink-2)]">
              <summary className="cursor-pointer font-[600] text-[var(--action-text)]">
                Read the email first
              </summary>
              <p className="mt-2 whitespace-pre-line rounded-[var(--r-s)] bg-[var(--surface)] p-3 leading-[1.55]">
                {PUT_IT_BODY}
              </p>
            </details>
            <div className="mt-4">
              <FindMpEmail subject={PUT_IT_SUBJECT} body={PUT_IT_BODY} />
            </div>
          </div>
        </ContentFrame>

        <ContentFrame as="section" id="read-more" className="pt-16">
          <p className="ui text-[19px] font-[680] text-[var(--ink)]">Read more</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href="/blog/kilmarnock-mp-23437-electricity-bill" className="btn btn-ghost">
              £23,437 Kilmarnock power bill (UK #1) →
              </Link>
              <Link href="/blog/scottish-mps-tv-licence-expenses" className="btn btn-ghost">
              29 MPs&apos; TV licences (£10,754) →
              </Link>
              <Link href="/mp-expenses-scotland" className="btn btn-ghost">
              All 57 MPs ranked →
              </Link>
              <Link href="/blog/worst-scottish-mp-expenses" className="btn btn-ghost">
              Read the worst of them →
              </Link>
          </div>
        </ContentFrame>

        <ContentFrame as="section" id="faq" className="pt-16">
          <Faq items={FAQ} kicker="Questions" title="Common questions about these receipts" />
        </ContentFrame>

        <ContentFrame as="section" className="mt-14 border-t-2 border-[var(--ink)] pt-8">
          <p className="label mb-3">Source</p>
          <p className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
            <ExplainText>
              IPSA expense files for 2022/23 to 2026/27, checked 21 Nov 2026. Wording is copied as
              IPSA prints it. Totals match our{" "}
              <Link href="/mp-expenses-scotland">full MP expenses page</Link>. IPSA paid every claim
              shown here.
            </ExplainText>
          </p>
        </ContentFrame>
      </Page>

      <CTA
        title="Ask your MP to explain their receipts"
        body="Type your Scottish postcode to see your MP's claims and open a ready email."
        href="/email-your-mp-and-msp"
        cta="Check and email my MP"
        secondaryHref="/mp-expenses-scotland"
        secondaryCta="See all 57 MPs ranked"
      />
    </>
  );
}
