import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, Aside, PostCTA } from "@/components/Prose";
import FindMpEmail from "@/components/FindMpEmail";
import {
  type PartyKey,
  type CasePerson,
  PARTY,
  gbp,
  Who,
  QuickTake,
  Finding,
  ChartFrame,
  RankList,
  Receipt,
  Spotlight,
  CaseCard,
  Tiles,
  PointList,
  Expand,
} from "@/components/ExpenseKit";

/*
 * The Scottish MP expenses scandal: one roundup of the worst claims, each
 * pointing to the MP's own local story. This page now also holds everything
 * from the old receipts page (/mp-expenses-scotland/receipts redirects here).
 *
 * Written in Graeme's voice (graeme-writing skill). Every claim comes from
 * IPSA's published individual claim files for 2022/23 to 2026/27: 20,879
 * claim lines for Scotland's current MPs (public/data/scottish-mp-receipts.json),
 * checked 22 November 2026. Quoted descriptions are IPSA's own wording (with
 * reference codes left out) and must not be edited.
 * Commons sitting days: Hansard calendar. Votes: Commons Votes API. Written
 * questions: Parliament's written questions API. Minister dates: Members API.
 * Earnings: ONS ASHE 2026. Nobody was contacted for comment.
 */

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;
const story = (slug: string) => `/blog/${slug}`;

const FINDINGS = 11;

const person = (name: string, slug: string, p: PartyKey, place: string): CasePerson => ({
  name,
  href: mp(slug),
  p,
  place,
});

/** The big "read the full story" button under each MP's headline claim. */
function FullStory({ href, children }: { href: string; children: ReactNode }) {
  return (
    <p className="not-prose pt-2">
      <Link href={href} className="btn btn-primary text-[17px]">
        {children} →
      </Link>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** The ten MPs with their own local story, biggest bill first. */
const LOCAL_STORIES: { name: string; slug: string; p: PartyKey; town: string; amount: string; what: string; story: string }[] = [
  { name: "Dr Zubir Ahmed", slug: "glasgow-south-west", p: "Labour", town: "Glasgow South West", amount: "£67,519", what: "London hotels and flats", story: "zubir-ahmed-mp-london-hotels-glasgow" },
  { name: "Lillian Jones", slug: "kilmarnock-and-loudoun", p: "Labour", town: "Kilmarnock", amount: "£23,437", what: "Power, paid in one day", story: "kilmarnock-mp-23437-electricity-bill" },
  { name: "Pamela Nash", slug: "motherwell-wishaw-and-carluke", p: "Labour", town: "Motherwell", amount: "£5,932", what: "DFS, IKEA and a carpet", story: "pamela-nash-mp-furniture-expenses-motherwell" },
  { name: "Angus MacDonald", slug: "inverness-skye-and-west-ross-shire", p: "Lib Dem", town: "Inverness and Skye", amount: "£3,546", what: "Speech coach and drains", story: "angus-macdonald-mp-speech-coach-drains-expenses" },
  { name: "Euan Stainbank", slug: "falkirk", p: "Labour", town: "Falkirk", amount: "£3,300", what: "A billboard of himself", story: "euan-stainbank-mp-billboard-expenses-falkirk" },
  { name: "Chris Law", slug: "dundee-central", p: "SNP", town: "Dundee", amount: "£3,090", what: "Home broadband setup", story: "chris-law-mp-3090-broadband-expenses-dundee" },
  { name: "Torcuil Crichton", slug: "na-h-eileanan-an-iar", p: "Labour", town: "Western Isles", amount: "£2,400", what: "Ex IPSA coaching", story: "torcuil-crichton-mp-coaching-expenses-western-isles" },
  { name: "John Lamont", slug: "berwickshire-roxburgh-and-selkirk", p: "Conservative", town: "Borders", amount: "£2,346", what: "Two iPhones", story: "john-lamont-mp-iphone-expenses-borders" },
  { name: "Graeme Downie", slug: "dunfermline-and-dollar", p: "Labour", town: "Dunfermline", amount: "£963", what: "One business dinner", story: "graeme-downie-mp-dinner-expenses-dunfermline" },
  { name: "Gregor Poynton", slug: "livingston", p: "Labour", town: "Livingston", amount: "£688", what: "Four TV licences", story: "gregor-poynton-mp-four-tv-licences-livingston" },
  { name: "Christine Jardine", slug: "edinburgh-west", p: "Lib Dem", town: "Edinburgh West", amount: "£510", what: "Staff Christmas lunch", story: "christine-jardine-mp-christmas-lunch-expenses" },
];

/** "Is your MP here?": every local story at a glance, with a link to each. */
function LocalStories() {
  return (
    <section aria-labelledby="your-mp-here" className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 id="your-mp-here" className="ui text-[20px] font-[680] text-[var(--ink)]">
        Is your MP here?
      </h2>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2">
        {LOCAL_STORIES.map((s) => (
          <li key={s.slug} className="flex min-w-0 items-center justify-between gap-3 rounded-[var(--r-s)] border border-[var(--rule)] px-3.5 py-3">
            <div className="min-w-0 flex-1">
              <Who face name={s.name} href={mp(s.slug)} p={s.p} note={s.town} />
            </div>
            <Link href={story(s.story)} className="min-w-0 max-w-[46%] text-right no-underline">
              <span className="figure-num tnum block text-[24px] leading-none text-[var(--bad-text)]">{s.amount}</span>
              <span className="ui mt-1 block text-[13.5px] leading-[1.3] text-[var(--ink-2)]">{s.what}</span>
              <span className="ui mt-0.5 block text-[13.5px] font-[640] text-[var(--action-text)]">Read it →</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

const PRINT_AND_POST: { name: string; slug: string; p: PartyKey; seat: string; value: number }[] = [
  { name: "John Grady", slug: "glasgow-east", p: "Labour", seat: "Glasgow East", value: 13116.8 },
  { name: "Frank McNally", slug: "coatbridge-and-bellshill", p: "Labour", seat: "Coatbridge and Bellshill", value: 9974.22 },
  { name: "Andrew Bowie", slug: "west-aberdeenshire-and-kincardine", p: "Conservative", seat: "West Aberdeenshire and Kincardine", value: 5563.32 },
];

const GADGETS: { name: string; slug: string; p: PartyKey; value: number; detail: string }[] = [
  { name: "Elaine Stewart", slug: "ayr-carrick-and-cumnock", p: "Labour", value: 2535, detail: "Phone gear from Amazon" },
  { name: "Pete Wishart", slug: "perth-and-kinross-shire", p: "SNP", value: 1399, detail: "Bought at Apple" },
];

/** The biggest yearly tabs run up by one Scottish MP (2025/26). */
const BIG_TABS: { name: string; slug: string; p: PartyKey; what: string; amount: string; note: string }[] = [
  { name: "John Grady", slug: "glasgow-east", p: "Labour", what: "London flat rent", amount: "£42,000", note: "£3,500 a month, the highest in Scotland." },
  { name: "Dr Zubir Ahmed", slug: "glasgow-south-west", p: "Labour", what: "London hotels", amount: "£37,359", note: "295 nights in one year (see Finding 10)." },
  { name: "Melanie Ward", slug: "cowdenbeath-and-kirkcaldy", p: "Labour", what: "Family travel", amount: "£7,932", note: "Flights and trains for her family, the highest in Scotland." },
  { name: "Chris Law", slug: "dundee-central", p: "SNP", what: "Car parking", amount: "£6,292", note: "About £121 a week, every week of the year." },
  { name: "Gregor Poynton", slug: "livingston", p: "Labour", what: "Taxis", amount: "£5,059", note: "Nearly £100 a week." },
  { name: "Douglas Alexander", slug: "lothian-east", p: "Labour", what: "Second home council tax", amount: "£4,093", note: "On his own house in East Lothian, which he lists as his second home." },
  { name: "Angus MacDonald", slug: "inverness-skye-and-west-ross-shire", p: "Lib Dem", what: "Second home energy", amount: "£3,314", note: "On a home where he claims no rent." },
  { name: "Chris Law", slug: "dundee-central", p: "SNP", what: "Hotels in Europe", amount: "£2,822", note: "The most of any Scottish MP." },
];

const ALL_MPS: { value: string; label: string }[] = [
  { value: "£73,648", label: "Flights for MPs' husbands, wives, partners and children (£89,111 with trains and car trips)" },
  { value: "£58,237", label: "Car parking for MPs' own travel" },
  { value: "£39,254", label: "Taxis for MPs' own travel" },
  { value: "£9,160", label: "Newspapers and magazines (72 claims)" },
  { value: "£3,863", label: "TV licences in 2025/26 alone (32 claims)" },
  { value: "£3,559", label: "Food, drink and events filed as hospitality" },
];

/*
 * Dr Zubir Ahmed's 14 London stay claims for 2025/26, exactly as IPSA lists
 * them (date, nights, amount paid, IPSA's wording with codes removed). IPSA
 * files every one under "Accommodation · Hotel - London".
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
const COMMONS_SITTING_DAYS = 152;

const ONS_EARNINGS_2026 =
  "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/annualsurveyofhoursandearnings/2026";
const IPSA_ACCOMMODATION = "https://information.ipsaonline.org.uk/guidance/accommodation-costs";
const ZUBIR_PARLIAMENT = "https://members.parliament.uk/member/5213";
const IPSA_YOUR_MP = "https://www.theipsa.org.uk/mp-staffing-business-costs/your-mp";
const IPSA_DOWNLOADS = "https://www.theipsa.org.uk/mp-staffing-business-costs/annual-publications";

const BACKBENCH_SCORECARD: [label: string, value: string][] = [
  ["Days the Commons sat, April to July 2025", "60"],
  ["London nights paid for (claims dated 27 March to 20 July 2025)", "123"],
  ["Cost of those nights", "£16,473"],
  ["Days he spoke in Commons debates", "11"],
  ["Commons votes he took part in", "75 of 106"],
  ["Written questions he tabled", "0"],
];

const PUT_IT_TO_THEM = [
  "Why are MPs' expenses published as a 59,503 line spreadsheet, not a plain list anyone can search?",
  "Why are 2,009 Scottish claim lines one yearly total, so nobody can see a single taxi ride or flight?",
  "Why is the name of who got paid blanked out on 199 Scottish claims?",
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

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function WorstScottishMpExpenses() {
  return (
    <Prose>
      <Lead>
        A £23,437 power bill paid in one day. £3,090 to set up broadband. A Christmas lunch filed
        as &ldquo;training&rdquo;, and four TV licences in 11 months. You paid for the lot. Here it
        is, claim by claim.
      </Lead>

      <QuickTake
        items={[
          <>
            <Link href={mp("kilmarnock-and-loudoun")}>Lillian Jones</Link>: the biggest MP power
            bill in the UK in five years. <strong>£23,437</strong>, paid in one day.
          </>,
          <>
            <Link href={mp("dundee-central")}>Chris Law</Link>: <strong>£3,090</strong> to set up
            broadband. A normal setup claim is £90.
          </>,
          <>
            <Link href={mp("edinburgh-west")}>Christine Jardine</Link>: a <strong>£510</strong> staff
            Christmas lunch and team day.
          </>,
          <>
            <Link href={mp("na-h-eileanan-an-iar")}>Torcuil Crichton</Link>: <strong>£2,400</strong> of
            coaching from a former IPSA worker.
          </>,
          <>
            Just <strong>91 repayments out of 20,879 claims</strong>. IPSA paid the rest, and{" "}
            <strong>we found no broken rules.</strong>
          </>,
        ]}
      />

      <LocalStories />

      <P>
        We read all <strong>20,879 expense claims</strong> filed by Scotland&apos;s MPs from 2022/23 to
        2026/27, one line at a time. These are the ones that made us read them twice.
      </P>
      <P>
        We found no broken rules, and that&apos;s the worrying bit. IPSA, the body that runs
        MPs&apos; expenses, looked at every one of these and paid it.
      </P>

      <Aside title="How MPs' expenses work">
        <p>
          Each MP gets set pots of public money: one for the office, one for staff, and one for a
          second home, since they work in London and back home.
        </p>
        <p>Where the file shows which pot paid, we say so.</p>
      </Aside>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} of={FINDINGS} id="power-bill">
        £23,437 for power, paid in one day
      </Finding>

      <Spotlight
        person={person("Lillian Jones", "kilmarnock-and-loudoun", "Labour", "Kilmarnock and Loudoun")}
        kicker="19 May 2026 · paid outside her office cap"
        amount="£23,437"
        headline="The biggest MP power bill in the UK in five years."
        lines={[
          { meta: "2025/26 · Miscellaneous", what: "Lillian Jones - Yu Energy Utilities - 2000294348", amount: "£20,384.74" },
          { meta: "2026/27 · Other Costs", what: "Lillian Jones - Yu Energy Utilities - 2000294348", amount: "£3,052.21" },
        ]}
      >
        <p>
          Two payments to one account on one day. Together they top a year of her office rent
          by £6,587.
        </p>
        <FullStory href={story("kilmarnock-mp-23437-electricity-bill")}>
          Read the full Kilmarnock story
        </FullStory>
      </Spotlight>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} of={FINDINGS} id="broadband">
        £3,090 just to set up broadband
      </Finding>

      <Spotlight
        person={person("Chris Law", "dundee-central", "SNP", "Dundee West at the time, now Dundee Central")}
        kicker="25 July 2022 · office pot"
        amount="£3,090"
        headline="His home broadband setup went on expenses."
        lines={[{ what: "Home 5G mobile broadband installation", amount: "£3,090.00" }]}
      >
        <p>
          5G home broadband is a box you plug in, no fitter needed. A normal setup claim by a
          Scottish MP is £90. The file doesn&apos;t say which home, or who got the money.
        </p>
        <FullStory href={story("chris-law-mp-3090-broadband-expenses-dundee")}>
          Read the full Dundee story
        </FullStory>
      </Spotlight>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} of={FINDINGS} id="speech-coach">
        Torcuil Crichton&apos;s coach and Angus MacDonald&apos;s speech lessons
      </Finding>

      <Spotlight
        person={person("Torcuil Crichton", "na-h-eileanan-an-iar", "Labour", "Na h-Eileanan an Iar")}
        kicker="October 2025 to June 2026 · 16 bills"
        amount="£2,400"
        headline="Coaching for him and his staff, billed 16 times."
        lines={[{ meta: "Filed as training for him and his staff", what: "LARA LLOYD COACHING", amount: "£2,400.00" }]}
      >
        <p>
          And the coach used to work at IPSA, the very body that pays the bills.{" "}
          <strong>12 MPs across the UK billed IPSA £16,800</strong> for her firm in under a year. He&apos;s
          the only one from Scotland.
        </p>
        <FullStory href={story("torcuil-crichton-mp-coaching-expenses-western-isles")}>
          Read the full Western Isles story
        </FullStory>
      </Spotlight>

      <Spotlight
        person={person("Angus MacDonald", "inverness-skye-and-west-ross-shire", "Lib Dem", "Inverness, Skye and West Ross-shire")}
        kicker="2025/26 · staff pot and second home pot"
        amount="£3,546"
        headline="A speech coach, and his drains cleaned, on expenses."
        lines={[
          {
            meta: "17 July 2025 · staff pot",
            what: "Provision of personalised presentation and speech skills workshop to assist MPs representational role in Parliament.",
            amount: "£3,000.00",
          },
          { meta: "24 March 2026 · second home pot", what: "Drainage professional mechanical cable cleaning", amount: "£234.00" },
          { meta: "27 March 2026 · second home pot", what: "Drainage professional pressure jet wash cleaning", amount: "£312.00" },
        ]}
      >
        <p>Talking is the whole job. And the £3,000 came from the pot meant for staff who help local voters.</p>
        <FullStory href={story("angus-macdonald-mp-speech-coach-drains-expenses")}>
          Read the full Highlands story
        </FullStory>
      </Spotlight>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} of={FINDINGS} id="perks">
        Christine Jardine&apos;s Christmas lunch and Graeme Downie&apos;s dinner
      </Finding>

      <Spotlight
        person={person("Christine Jardine", "edinburgh-west", "Lib Dem", "Edinburgh West")}
        kicker="19 December 2025 · six days before Christmas"
        amount="£510"
        headline="You paid for her office Christmas lunch and team day."
        lines={[
          { what: "lunch staff team training Christmas", amount: "£250.80" },
          { what: "team building event", amount: "£259.31" },
        ]}
      >
        <p>
          <strong>A Christmas lunch, with the word &ldquo;training&rdquo; stuck on it.</strong>{" "}
          Most of us pay for our own Christmas do. This one went on expenses.
        </p>
        <FullStory href={story("christine-jardine-mp-christmas-lunch-expenses")}>
          Read the full Edinburgh West story
        </FullStory>
      </Spotlight>

      <Spotlight
        person={person("Graeme Downie", "dunfermline-and-dollar", "Labour", "Dunfermline and Dollar")}
        kicker="13 March 2025 · 18 days before the budget year ended"
        amount="£963"
        headline="A business dinner, hosted in his name."
        lines={[{ what: "Fife College hosted business dinner on behalf of Graeme Downie", amount: "£962.65" }]}
      >
        <p>Nearly £1,000 of public money on one dinner. The file doesn&apos;t say who ate it.</p>
        <FullStory href={story("graeme-downie-mp-dinner-expenses-dunfermline")}>
          Read the full Dunfermline story
        </FullStory>
      </Spotlight>

      <PointList
        items={[
          {
            key: "murray",
            title: <Who face name="Susan Murray" href={mp("mid-dunbartonshire")} p="Lib Dem" note="£550" />,
            children: (
              <>
                Food and drink for local bosses: &ldquo;Hospitality event for Business owners of Mid
                Dunbartonshire.&rdquo; 7 July 2025.
              </>
            ),
          },
          {
            key: "doogan",
            title: <Who face name="Dave Doogan" href={mp("angus-and-perthshire-glens")} p="SNP" note="£892.80" />,
            children: (
              <>
                A &ldquo;Newspaper Column Invoice&rdquo;, 19 June 2026. Nothing says what the piece
                was, or why the public paid for it.
              </>
            ),
          },
        ]}
      />

      {/* ------------------------------------------------------------ 5 */}
      <Finding n={5} of={FINDINGS} id="self-promotion">
        Paying to put their own name in front of you
      </Finding>

      <Spotlight
        person={person("Euan Stainbank", "falkirk", "Labour", "Falkirk")}
        kicker="31 October 2024 · up for a whole year"
        amount="£3,300"
        headline="A billboard of himself, up for a year."
        lines={[
          {
            what: "Advertising board to advertise Euan as local MP and contact details. To be advertised for 1 year.",
            amount: "£3,300.00",
          },
        ]}
      >
        <p>A year of adverts for the MP, paid for by the people he serves.</p>
        <FullStory href={story("euan-stainbank-mp-billboard-expenses-falkirk")}>
          Read the full Falkirk story
        </FullStory>
      </Spotlight>

      <P>
        Others paid to print and post a yearly report on their own work. IPSA allows that as long
        as there&apos;s no party badge on it. But it still puts their face through every door.
      </P>

      <Receipt
        person={person("John Grady", "glasgow-east", "Labour", "Glasgow East")}
        heading="12 February 2026 · one bill"
        lines={[
          {
            what: "12/02 Roderick Urquhart/ Treehouse for printing and delivery of MP Annual Report to constituents",
            amount: "£13,116.80",
          },
        ]}
        footer="Wording as printed by IPSA."
      />

      <ChartFrame kicker="IPSA files · Yearly report leaflets" title="Biggest single bills to print and post an MP's report">
        <RankList
          rows={PRINT_AND_POST.map((r) => ({
            key: r.slug,
            who: <Who face name={r.name} href={mp(r.slug)} p={r.p} />,
            side: r.seat,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
          }))}
        />
      </ChartFrame>

      {/* ------------------------------------------------------------ 6 */}
      <Finding n={6} of={FINDINGS} id="tv-licences">
        Four TV licences in 11 months
      </Finding>

      <Spotlight
        person={person("Gregor Poynton", "livingston", "Labour", "Livingston")}
        kicker="December 2024 to November 2025 · office pot"
        amount="£688"
        headline="Four TV licences in 11 months."
        lines={[
          { meta: "18 Dec 2024 and 14 Feb 2025", what: "TVLICENSING.CO.UK", amount: "2 × £169.50" },
          { meta: "4 and 26 Nov 2025, two licences split over four lines", what: "TVLICENSING.CO.UK", amount: "£349.00" },
        ]}
      >
        <p>One licence covers a place for a whole year. IPSA only allows a licence for a local office, yet paid four in 11 months.</p>
        <FullStory href={story("gregor-poynton-mp-four-tv-licences-livingston")}>
          Read the full Livingston story
        </FullStory>
      </Spotlight>

      <P>
        He&apos;s not the only one. 29 Scottish MPs billed <strong>£10,754</strong> for TV licences from 2022/23 to
        2026/27. <Link href={mp("glasgow-south-west")}>Dr Zubir Ahmed</Link> billed two in nine
        months, one online and one at a Co-op.{" "}
        <Link href="/blog/scottish-mps-tv-licence-expenses">See all 29 Scottish MPs</Link>.
      </P>

      {/* ------------------------------------------------------------ 7 */}
      <Finding n={7} of={FINDINGS} id="phones">
        Two iPhones, and a £24,515 phone tab
      </Finding>

      <Spotlight
        person={person("John Lamont", "berwickshire-roxburgh-and-selkirk", "Conservative", "Berwickshire, Roxburgh and Selkirk")}
        kicker="August 2022 and June 2025 · office pot"
        amount="£2,346"
        headline="Two iPhones, both on expenses."
        lines={[
          { meta: "9 August 2022", what: "iPhone purchase - John Lamont", amount: "£1,098.00" },
          { meta: "12 June 2025", what: "Iphone and protection case", amount: "£1,248.00" },
        ]}
      >
        <p>Two phones on the public purse, three years apart.</p>
        <FullStory href={story("john-lamont-mp-iphone-expenses-borders")}>
          Read the full Borders story
        </FullStory>
      </Spotlight>

      <CaseCard figure="£24,515" people={[person("Brendan O'Hara", "argyll-bute-and-south-lochaber", "SNP", "Argyll, Bute and South Lochaber")]}>
        <p>
          <strong>57 mobile phone bills, March 2022 to June 2026</strong>
        </p>
        <p>
          About £110 a week. His biggest was £909.24 from EE in March 2026, and his total is four
          times more than any other Scottish MP&apos;s.
        </p>
      </CaseCard>

      <ChartFrame kicker="IPSA files · Phones and tech" title="More big gadget claims">
        <RankList
          rows={GADGETS.map((r) => ({
            key: r.slug,
            who: <Who face name={r.name} href={mp(r.slug)} p={r.p} />,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            detail: r.detail,
          }))}
        />
      </ChartFrame>

      {/* ------------------------------------------------------------ 8 */}
      <Finding n={8} of={FINDINGS} id="furniture">
        Sofas, carpet and lawyers for the office
      </Finding>

      <Spotlight
        person={person("Pamela Nash", "motherwell-wishaw-and-carluke", "Labour", "Motherwell, Wishaw and Carluke")}
        kicker="April 2025 to March 2026 · office pot"
        amount="£5,932"
        headline="DFS and IKEA furniture, and a new carpet."
        lines={[
          { meta: "Three bills, 5 April 2025 to 31 March 2026", what: "IKEA LTD SHOP ONLINE", amount: "£1,974.00" },
          { meta: "31 March 2026", what: "DFS TRADING LIMITED", amount: "£1,208.00" },
          { meta: "26 March 2026", what: "Replacement of office carpet", amount: "£2,750.00" },
        ]}
      >
        <p>Most of it went through in the last week of the budget year. £245 of IKEA was paid back later.</p>
        <FullStory href={story("pamela-nash-mp-furniture-expenses-motherwell")}>
          Read the full Motherwell story
        </FullStory>
      </Spotlight>

      <Receipt
        person={person("Tracy Gilbert", "edinburgh-north-and-leith", "Labour", "Edinburgh North and Leith")}
        heading="May 2025 · one office move, one month"
        lines={[
          { meta: "15 May 2025", what: "Legal advice and costs", amount: "£3,044.00" },
          { meta: "1 May 2025", what: "FURNITURE@WORK LTD", amount: "£3,332.40" },
          { meta: "14 May 2025", what: "FURNITURE@WORK LTD", amount: "£937.20" },
        ]}
        total={{ label: "Lawyers and desks in one month", amount: "£7,313.60" }}
        footer="Wording as printed by IPSA."
      />

      {/* ------------------------------------------------------------ 9 */}
      <Finding n={9} of={FINDINGS} id="consultants">
        Consultants and PR firms, on top of their own staff
      </Finding>
      <P>Every MP gets a big budget for staff. Some paid outside firms on top anyway.</P>

      <CaseCard figure="£10,000" people={[person("Melanie Ward", "cowdenbeath-and-kirkcaldy", "Labour", "Cowdenbeath and Kirkcaldy")]}>
        <p>
          <strong>The biggest single consultant bill by any Scottish MP</strong>
        </p>
        <p>
          The file doesn&apos;t say who got paid. She also billed £4,000 for PR help and £4,691 at
          IKEA. A £7,000 local report, in a claim dated 25 April 2025, was paid back about three
          months later.
        </p>
      </CaseCard>

      <Receipt
        heading="Her two biggest outside help bills · staff pot"
        lines={[
          { meta: "19 December 2024", what: "Policy and Office set up consultant", amount: "£10,000.00" },
          { meta: "16 July 2025", what: "Communications Support", amount: "£4,000.00" },
        ]}
        footer="Wording as printed by IPSA."
      />

      <CaseCard figure="£35,792" people={[person("John Lamont", "berwickshire-roxburgh-and-selkirk", "Conservative", "Berwickshire, Roxburgh and Selkirk")]}>
        <p>
          <strong>13 bills to PR firm Peach Partners, September 2022 to December 2023</strong>
        </p>
        <p>
          Speech notes, press help and social posts, with the biggest bill at £9,125. All of it
          came from his staff pot.
        </p>
      </CaseCard>

      <CaseCard figure="£9,600" people={[person("Gregor Poynton", "livingston", "Labour", "Livingston")]}>
        <p>
          <strong>Media help from PR firm BB Partners in Crawley</strong>
        </p>
        <p>The claim is dated 21 March 2025, ten days before the budget year ended.</p>
      </CaseCard>

      {/* ------------------------------------------------------------ 10 */}
      <Finding n={10} of={FINDINGS} id="hotel-nights">
        {gbp(ZUBIR_TOTAL, false)} of London nights in one year
      </Finding>

      <CaseCard figure={gbp(ZUBIR_TOTAL, false)} people={[person("Dr Zubir Ahmed", "glasgow-south-west", "Labour", "Glasgow South West")]}>
        <p>
          <strong>
            {ZUBIR_NIGHT_COUNT} London nights in 2025/26. The Commons only sat on {COMMONS_SITTING_DAYS} days.
          </strong>
        </p>
        <p>
          He claims no London rent. Most of his {ZUBIR_NIGHTS.length} claims are month
          long flat stays, plus one Airbnb, and IPSA files them all as hotels. Across 2024 to
          2026, his total hits £67,519.
        </p>
      </CaseCard>
      <FullStory href={story("zubir-ahmed-mp-london-hotels-glasgow")}>
        Read the full £67,519 Glasgow South West hotel story
      </FullStory>

      <Tiles
        items={[
          { value: gbp(ZUBIR_TOTAL / ZUBIR_NIGHT_COUNT), label: "A night, on average" },
          { value: gbp(ZUBIR_TOTAL / 12, false), label: "A month, on average" },
          { value: `${ZUBIR_NIGHT_COUNT}`, label: "Nights paid in one year, about 42 weeks", hot: true },
        ]}
      />

      <P>
        <strong>That&apos;s close to a full time wage.</strong> The middle UK full time worker
        earned{" "}
        <a href={ONS_EARNINGS_2026} target="_blank" rel="noopener noreferrer">
          £39,157 a year before tax
        </a>{" "}
        in 2025.
      </P>
      <P>
        Is it allowed? Yes. MPs can book hotels instead of renting a flat, and{" "}
        <a href={IPSA_ACCOMMODATION} target="_blank" rel="noopener noreferrer">
          IPSA&apos;s London cap is £230 a night
        </a>
        . Every stay sat below it.
      </P>

      <Expand summary={`Show all ${ZUBIR_NIGHTS.length} claims`}>
        <ul className="divide-y divide-[var(--rule)]">
          {ZUBIR_NIGHTS.map(([date, nights, paid, ipsa]) => (
            <li key={date + ipsa} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 py-3">
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
          Dates and wording as IPSA prints them, with codes taken out. IPSA files them all under
          &ldquo;Hotel - London&rdquo;.
        </p>
      </Expand>

      <Expand summary="How often was he needed in London?">
        <div className="space-y-4">
          <P>
            &ldquo;The Commons sat&rdquo; means MPs met to debate and vote, normally Monday to
            Thursday. In 2025/26 it had {COMMONS_SITTING_DAYS} sitting days. The public paid for{" "}
            {ZUBIR_NIGHT_COUNT} of his London nights. So that&apos;s{" "}
            {ZUBIR_NIGHT_COUNT - COMMONS_SITTING_DAYS} more nights than sitting days, or{" "}
            {gbp(ZUBIR_TOTAL / COMMONS_SITTING_DAYS, false)} for each day it sat.
          </P>
          <p className="ui text-[16px] font-[660] text-[var(--ink)]">Before he became a minister: April to July 2025</p>
          <div className="tile overflow-hidden">
            <dl className="divide-y divide-[var(--rule)]">
              {BACKBENCH_SCORECARD.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
                  <dt className="ui text-[14.5px] leading-[1.4] text-[var(--ink-2)]">{label}</dt>
                  <dd className="figure-num tnum shrink-0 text-right text-[19px] leading-none text-[var(--ink)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <P>
            As a backbencher then, his London job was voting, speaking and asking questions. In
            those four months he billed twice as many nights as sitting days, and tabled no written
            questions.
          </P>
          <P>
            From 6 September 2025 to 12 May 2026 he was a health minister. A minister works in London
            through the week, so more nights make sense. But his stays ran seven nights a week,
            weekends included.
          </P>
          <P>
            Over the full year he voted in 202 of 301 votes (67%). The average MP voted in 69%.{" "}
            <a href={ZUBIR_PARLIAMENT} target="_blank" rel="noopener noreferrer">
              His record on Parliament&apos;s site
            </a>
            .
          </P>
          <P>
            His year of stays beat the £27,873 rent paid by the middle Scottish MP. From July 2024
            to April 2026 it comes to 548 nights and £67,519. His first three claims for 2026/27 add 75
            nights, at about £145 a night.
          </P>
        </div>
      </Expand>

      {/* ------------------------------------------------------------ 11 */}
      <Finding n={11} of={FINDINGS} id="biggest-tabs">
        The biggest tabs, one MP at a time
      </Finding>
      <P>These are yearly totals for 2025/26. Each is the highest in Scotland for that kind of bill.</P>

      <PointList
        items={BIG_TABS.map((t) => ({
          key: t.slug + t.what,
          title: <Who face name={t.name} href={mp(t.slug)} p={t.p} note={`${t.what}: ${t.amount}`} />,
          children: <>{t.note}</>,
        }))}
      />

      <P>
        Why second homes? MPs work in two places, so you cover a second home. They can even own
        it and still bill you its council tax and heating.{" "}
        <Link href="/mp-expenses-scotland#why-second-homes">How second home rules work</Link>.
      </P>

      <ChartFrame kicker="IPSA 2025/26 · 55 Scottish MPs (two had no claims that year)" title="Across every Scottish MP, in one year">
        <Tiles items={ALL_MPS.slice(0, 3)} />
        <Tiles items={ALL_MPS.slice(3)} />
      </ChartFrame>

      <H2 id="why-hidden">Why you have never seen these receipts</H2>
      <P>
        IPSA does put every claim online, and none of it is secret. But almost nobody has time to
        wade through it. These numbers show why.
      </P>

      <Tiles
        items={[
          { value: "59,503", label: "Rows in IPSA's 2025/26 file for all 650 UK MPs. Printed out, it is 1,000 pages.", hot: true },
          { value: "2,009", label: "Scottish claims lumped into one yearly sum. You see £5,059 on taxis, not a single ride." },
          { value: "199", label: "Scottish claims where IPSA blanked out who got paid and put [***] instead." },
        ]}
      />

      <section className="not-prose my-10 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] border-l-[6px] border-l-[var(--bad)] bg-[color-mix(in_srgb,var(--bad)_5%,var(--surface))] px-6 py-7 text-[var(--ink)] shadow-[0_14px_34px_-26px_rgba(10,16,34,0.45)] sm:px-8 sm:py-8">
        <p className="ui text-[13px] font-[660] uppercase tracking-[0.07em] text-[var(--muted)]">Who stops this?</p>
        <p className="figure-num mt-2 text-[48px] leading-none text-[var(--bad-text)] sm:text-[56px]">Nobody.</p>
        <ul className="mt-6 space-y-4 text-[17px] leading-[1.55]">
          <li>
            Christine Jardine&apos;s Christmas lunch went in as &ldquo;lunch staff team
            training Christmas&rdquo;. Put <strong>training</strong> on a meal bill and IPSA pays
            the lot.
          </li>
          <li>
            Who set up IPSA? <strong>MPs did</strong>, with a law they passed in 2009 after the last
            expenses scandal.
          </li>
          <li>
            IPSA&apos;s own files show just <strong>91 repayments out of 20,879 claims</strong> by Scottish
            MPs since 2022. Fewer than 1 in 200.
          </li>
          <li>
            At Holyrood, <strong>MSPs vote on their own expenses rules</strong>, and the board
            running the scheme is made up of MSPs too.
          </li>
          <li className="text-[20px] font-[700] leading-[1.35]">
            Unless voters ask for tighter rules, Parliament has little reason to change them.
          </li>
        </ul>
      </section>

      <H2 id="check-your-mp">Check your own MP, and put it to them</H2>
      <P>So we read it all for you. You can check any MP yourself in three steps.</P>
      <PointList
        items={[
          {
            key: "postcode",
            title: <Link href="/email-your-mp-and-msp">1. Find your MP by postcode</Link>,
            children: <>A plain summary of their bills.</>,
          },
          {
            key: "ipsa-tool",
            title: (
              <a href={IPSA_YOUR_MP} target="_blank" rel="noopener noreferrer">
                2. IPSA&apos;s Your MP tool
              </a>
            ),
            children: <>Type their name to see each line.</>,
          },
          {
            key: "ipsa-files",
            title: (
              <a href={IPSA_DOWNLOADS} target="_blank" rel="noopener noreferrer">
                3. IPSA&apos;s full files
              </a>
            ),
            children: <>Every row, for every MP.</>,
          },
        ]}
      />

      <P>Any MP can tell you their bills are online. They are, in a giant file almost nobody opens. So ask them these:</P>
      <PointList
        items={PUT_IT_TO_THEM.map((q, i) => ({
          key: `q${i}`,
          title: `Question ${i + 1}`,
          children: <>{q}</>,
        }))}
      />

      <div className="not-prose my-7 rounded-[var(--r-m)] border border-[var(--rule)] border-l-[4px] border-l-[var(--action)] bg-[var(--action-tint)] p-5 sm:p-6">
        <p className="ui text-[18px] font-[660] text-[var(--ink)]">Send these questions to your MP</p>
        <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
          Type your postcode. We find your MP and fill in their email for you.
        </p>
        <details className="mt-2 max-w-[60ch] text-[14.5px] text-[var(--ink-2)]">
          <summary className="cursor-pointer font-[600] text-[var(--action-text)]">Read the email first</summary>
          <p className="mt-2 whitespace-pre-line rounded-[var(--r-s)] bg-[var(--surface)] p-3 leading-[1.55]">
            {PUT_IT_BODY}
          </p>
        </details>
        <div className="mt-4">
          <FindMpEmail subject={PUT_IT_SUBJECT} body={PUT_IT_BODY} />
        </div>
      </div>

      <Aside title="No broken rules found">
        <p>
          We found no broken rules in any claim on this page. What needs answering is why IPSA&apos;s rules
          let these claims through. For gifts, VIP tickets and paid trips, see{" "}
          <Link href="/blog/scottish-mp-expenses-and-freebies-investigation">the gifts and trips MPs declared</Link>
          . For every MP ranked, see <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <PostCTA
        title="Search every Scottish MP claim (or check your MP)"
        body="Type your postcode. Filter by Amazon, IKEA, TV licence, speech coach or taxi. Copy any claim or email your MP."
        href="/mp-expenses-scotland/search"
        cta="Search all 20,879 claims"
      />
    </Prose>
  );
}
