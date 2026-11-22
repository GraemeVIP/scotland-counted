import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published individualBusinessCosts CSV files for 2022/23
 * to 2026/27 (checked 22 November 2026 across all 650 UK MPs, over 350,000
 * rows). Quoted descriptions are IPSA's exact wording and must not be edited.
 * Speech help ranking: every claim line whose wording is only about speeches
 * (speech consultancy, speech writing, speech skills or speech training).
 * Lines that bundle speeches with press, research or social media work are
 * left out. Shares and property: UK Parliament Register of Members' Financial
 * Interests (2026). Nobody was contacted for comment.
 */

import {
  type PartyKey,
  PARTY,
  gbp,
  Who,
  QuickTake,
  Finding as KitFinding,
  ChartFrame,
  Bar,
  RankList,
  Receipt,
  CaseCard,
  Face,
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const MACDONALD = {
  name: "Angus MacDonald",
  href: mp("inverness-skye-and-west-ross-shire"),
  p: "Lib Dem" as PartyKey,
  place: "Inverness, Skye and West Ross-shire",
};

const FINDINGS = 4;

function Finding({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <KitFinding n={n} of={FINDINGS} id={id}>
      {children}
    </KitFinding>
  );
}

/** Other MPs with their own local story page, linked near the end. */
const MORE_LOCAL_STORIES: { name: string; seat: string; place: string; hook: string; story: string }[] = [
  { name: "Torcuil Crichton", seat: "na-h-eileanan-an-iar", place: "Western Isles", hook: "£2,400 coaching from a former IPSA worker", story: "/blog/torcuil-crichton-mp-coaching-expenses-western-isles" },
  { name: "Lillian Jones", seat: "kilmarnock-and-loudoun", place: "Kilmarnock", hook: "£23,437 for electricity in one day", story: "/blog/kilmarnock-mp-23437-electricity-bill" },
  { name: "Chris Law", seat: "dundee-central", place: "Dundee", hook: "£3,090 to set up home broadband", story: "/blog/chris-law-mp-3090-broadband-expenses-dundee" },
  { name: "Euan Stainbank", seat: "falkirk", place: "Falkirk", hook: "£3,300 for a billboard of himself", story: "/blog/euan-stainbank-mp-billboard-expenses-falkirk" },
  { name: "Christine Jardine", seat: "edinburgh-west", place: "Edinburgh West", hook: "£510 Christmas lunch and team day", story: "/blog/christine-jardine-mp-christmas-lunch-expenses" },
  { name: "John Lamont", seat: "berwickshire-roxburgh-and-selkirk", place: "Borders", hook: "Two iPhones on expenses", story: "/blog/john-lamont-mp-iphone-expenses-borders" },
];

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** Biggest single claims by any UK MP that are only about speeches. */
const UK_TOP_SPEECH: {
  name: string;
  p: PartyKey;
  seat: string;
  href?: string;
  date: string;
  detail: ReactNode;
  value: number;
}[] = [
  {
    name: "Chris Coghlan",
    p: "Lib Dem",
    seat: "Dorking & Horley",
    date: "10 Dec 2025",
    detail: "“Speech Consultancy”. £34,000 across 14 claims since October 2024.",
    value: 4400,
  },
  {
    name: "Angus MacDonald",
    p: "Lib Dem",
    seat: "Inverness, Skye & West Ross-shire",
    href: mp("inverness-skye-and-west-ross-shire"),
    date: "17 Jul 2025",
    detail: "“personalised presentation and speech skills workshop”",
    value: 3000,
  },
  {
    name: "Liam Byrne",
    p: "Labour",
    seat: "Birmingham Hodge Hill",
    date: "26 Apr 2023",
    detail: "“Speech writing services”",
    value: 3000,
  },
];

/** His second home bills for 2025/26, with no rent at all. */
const SECOND_HOME: { what: string; value: number; label: string; hot?: boolean }[] = [
  { what: "Rent", value: 0, label: "£0" },
  { what: "Drain cleaning (two visits, March 2026)", value: 546, label: "£546", hot: true },
  { what: "Buildings insurance", value: 745.55, label: "£746" },
  { what: "Flat service charges", value: 939.24, label: "£939" },
  { what: "Energy and water", value: 3314.09, label: "£3,314" },
  { what: "Phone and internet", value: 383.42, label: "£383" },
  { what: "One hotel stay on constituency visits", value: 147.5, label: "£148" },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function AngusMacdonaldMpSpeechCoachDrainsExpenses() {
  const homeMax = Math.max(...SECOND_HOME.map((s) => s.value));

  return (
    <Prose>
      <QuickTake
        items={[
          <>
            Highland MP <Link href={MACDONALD.href}>Angus MacDonald</Link> took{" "}
            <strong>£3,000</strong> from his <strong>staff pot</strong> for a speech skills class.
          </>,
          <>
            You also paid <strong>£546</strong> to clean the drains at his London second home.{" "}
            <strong>No other UK MP</strong> has put that on expenses.
          </>,
          <>
            He claims £0 rent on that flat. Yet he billed <strong>£3,314</strong> for its power and
            water in one year, top in Scotland.
          </>,
          <>
            He lists over <strong>£70,000 in bank shares</strong> and a rented block in Stirling.{" "}
            <strong>£0</strong> paid back.
          </>,
        ]}
      />

      <Spotlight
        person={MACDONALD}
        kicker="17 July 2025 · from his staff budget"
        amount="£3,000"
        headline="£3,000 for lessons in how to give a speech."
      >
        <p>
          Logged as a &ldquo;personalised presentation and speech skills workshop&rdquo;. Speaking
          up for voters is the whole job.
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-speech-coach">
        Six months&apos; office rent, spent on one speech class
      </Finding>
      <P>
        An MP&apos;s staff pot pays the team who help local folk with housing, benefits and bills.
      </P>
      <P>
        In July 2025, Highland Lib Dem MP <Link href={MACDONALD.href}>Angus MacDonald</Link> took
        £3,000 straight out of that pot for a speech class for himself.
      </P>

      <Tiles
        items={[
          { value: "£450", label: "one month's rent on his local office (2024/25)" },
          { value: "£3,000", label: "one speech class for the MP", hot: true },
        ]}
      />

      <P>
        That one class cost more than six months&apos; rent on his local office. IPSA&apos;s file
        never says who got the £3,000 or how long it lasted.
      </P>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-comparison">
        Only one MP in the UK beat it, and he is a Lib Dem too
      </Finding>
      <P>
        Out of all 650 MPs over five years, his £3,000 is the top speech claim in Scotland. It is
        joint second in the whole UK.
      </P>
      <P>
        Labour MP Stephen Kinnock paid £660 for speech help in 2025. MacDonald&apos;s bill was more
        than four times that.
      </P>

      <ChartFrame
        kicker="All 650 UK MPs · 2022/23 to 2026/27"
        title="Biggest single claims for speech help by any UK MP"
        caption="Source: Five years of IPSA files (2022/23 to 2026/27) across all 650 UK seats. One line per MP. Claims that mix speeches with press, research or social media work are left out."
      >
        <RankList
          max={UK_TOP_SPEECH[0].value}
          rows={UK_TOP_SPEECH.map((r) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
            side: r.date,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            detail: r.detail,
            highlight: r.name === "Angus MacDonald",
          }))}
        />
      </ChartFrame>

      <CaseCard
        kicker="Two Lib Dem MPs, one speech habit"
        figure="£37,000"
        people={[{ name: "Chris Coghlan", p: "Lib Dem", place: "Dorking and Horley" }, MACDONALD]}
      >
        <p>
          Surrey Lib Dem Chris Coghlan has billed <strong>£34,000</strong> for &ldquo;speech
          consultancy&rdquo; across 14 claims since October 2024.
        </p>
        <p>
          Put him and Angus MacDonald together and two Lib Dem MPs have billed taxpayers{" "}
          <strong>£37,000</strong> for speech help.
        </p>
      </CaseCard>

      <Aside title="Not the only Scottish MP claiming for coaching">
        <p>
          Western Isles Labour MP{" "}
          <Link href={mp("na-h-eileanan-an-iar")}>Torcuil Crichton</Link> billed £2,400 to a coach
          who used to work at IPSA.{" "}
          <Link href="/blog/torcuil-crichton-mp-coaching-expenses-western-isles">Read that story here</Link>.
        </p>
      </Aside>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="second-home">
        No rent claimed, yet £546 to jet wash the drains
      </Finding>
      <P>
        MacDonald claims <strong>£0 in rent</strong> on his London flat. Sounds thrifty, until you
        read the running bills he sends you instead.
      </P>

      <Receipt
        person={MACDONALD}
        heading="IPSA records · March 2026 · Second home · Cleaning"
        lines={[
          {
            meta: "24 March 2026",
            what: "Drainage professional mechanical cable cleaning [200013634-145]",
            amount: "£234.00",
          },
          {
            meta: "27 March 2026",
            what: "Drainage professional pressure jet wash cleaning [200013634-146]",
            amount: "£312.00",
          },
        ]}
        total={{ label: "Two visits in four days · £0 repaid", amount: "£546.00" }}
        footer="Wording as printed by IPSA. IPSA claim numbers 60365741-7 and 60365741-8 (2025/26)."
      />

      <P>
        Out of all 650 MPs since 2022, <strong>not a single other MP</strong> put second home drain
        cleaning on expenses.
      </P>

      <ChartFrame
        kicker="His London flat · 2025/26"
        title="What you paid for a second home he pays no rent on"
        caption="Source: IPSA files for Angus MacDonald MP, 2025/26 budget year (April 2025 to March 2026). These items add up to £6,075.80, his whole second home bill that year, with £0 rent."
      >
        <div className="space-y-4">
          {SECOND_HOME.map((s) => (
            <div key={s.what}>
              <p
                className={`ui mb-1 text-[14.5px] leading-[1.45] ${s.hot ? "font-[680] text-[var(--ink)]" : "text-[var(--ink-2)]"}`}
              >
                {s.what}
              </p>
              <Bar
                value={s.value}
                max={homeMax}
                colour={s.hot ? "var(--bad)" : "var(--rule-strong)"}
                label={s.label}
              />
            </div>
          ))}
        </div>
      </ChartFrame>

      <P>
        His £3,314 power and water bill was <strong>top in Scotland</strong> and eighth in the UK.
      </P>
      <P>
        On 24 March 2026 came <strong>£3,027.12</strong> for council tax (in his 2026/27 pot). That
        includes the &ldquo;second home premium&rdquo; councils put on second homes. You pay that
        too.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        Two cameras, bank shares, and rules that pay for drains
      </Finding>
      <P>Four other big bills sit in his file since July 2024:</P>

      <PointList
        items={[
          {
            key: "cameras",
            title: "£1,126 for two cameras on the same day",
            children: <>£562.98 each on 27 March 2025. One for London, one for the Highlands.</>,
          },
          {
            key: "legal",
            title: "£3,064 in legal fees",
            children: <>For his Inverness office, March 2025.</>,
          },
          {
            key: "furniture",
            title: "£2,182 on office desks and chairs",
            children: <>Two bills from Kings Office Furniture, March and May 2025.</>,
          },
          {
            key: "rail",
            title: "£19,942 on train fares in one year",
            children: (
              <>
                Top in the UK in 2025/26, though the Highlands is a long trip to London.
              </>
            ),
          },
        ]}
      />

      <P>
        To be fair, some bills make sense. Vandals broke his windows, a roof fell in at Fort
        William, and local papers list his surgeries. Nobody minds paying for that.
      </P>
      <P>
        The £3,000 speech class and £546 drain clean are not the same. His Register of Interests
        lists over £70,000 in Hampden and Co bank shares, plus a rented block in Stirling. He is
        not short of cash, yet IPSA&apos;s rules still make you pay for his drains.
      </P>

      <PointList
        items={[
          {
            key: "who-ran-it",
            title: "Who got paid £3,000 for the class?",
            children: <>No firm and no coach is named in IPSA&apos;s log.</>,
          },
          {
            key: "why-staff",
            title: "Why take it out of the staff pot?",
            children: <>That pot pays staff who help local voters, not speech lessons.</>,
          },
          {
            key: "drains",
            title: "Why did you pay to clear his drains?",
            children: <>Not one other MP out of 650 sent that bill to the public.</>,
          },
        ]}
      />

      <Expand summary="See the proof: his big claims, word for word">
        <Receipt
          person={MACDONALD}
          heading="IPSA records · Angus MacDonald · 2025 and 2026"
          lines={[
            {
              meta: "17 Jul 2025 · Paid from his staff budget",
              what: "Provision of personalised presentation and speech skills workshop to assist MPs representational role in Parliament.",
              amount: "£3,000.00",
            },
            {
              meta: "1 Apr 2025 · Second home · Water",
              what: "Annual Water Rates - London Accommodation",
              amount: "£971.22",
            },
            {
              meta: "20 Nov 2025 · Second home · Energy",
              what: "Gas/Electricity Payments for London Accommodation (Aug-Nov 2025)",
              amount: "£620.25",
            },
            {
              meta: "24 Mar 2026 · Second home · Council tax (2026/27 budget)",
              what: "Council tax & adjustment (second home premium)",
              amount: "£3,027.12",
            },
            {
              meta: "27 Mar 2025 · Equipment",
              what: "Digital Camera + SD Memory Card for use in Westminster",
              amount: "£562.98",
            },
            {
              meta: "27 Mar 2025 · Equipment",
              what: "Digital Camera + SD Memory Card for use in constituency",
              amount: "£562.98",
            },
            {
              meta: "24 Mar 2025 · Paid from his staff budget",
              what: "Professional and legal fees for Inverness Constituency Office [200012963-4]",
              amount: "£3,064.00",
            },
          ]}
          footer="Wording as printed by IPSA. Speech workshop claim number: 60316967-1 (2025/26). Every line is marked Paid. £0 repaid."
        />
      </Expand>

      <section aria-labelledby="more-local-stories" className="not-prose my-10">
        <h2
          id="more-local-stories"
          className="ui text-[20px] font-[700] leading-[1.25] text-[var(--ink)] sm:text-[22px]"
        >
          More local MP stories
        </h2>
        <p className="ui mt-1 text-[15px] leading-[1.5] text-[var(--muted)]">
          One MP, one town, one bill. Is yours here?
        </p>
        <ul className="mt-4 divide-y divide-[var(--rule)] rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-4 sm:px-5">
          {MORE_LOCAL_STORIES.map((s) => (
            <li key={s.story} className="flex items-center gap-3 py-3.5">
              <Face name={s.name} href={mp(s.seat)} size={44} />
              <div className="min-w-0 flex-1">
                <Link href={s.story} className="ui text-[16px] font-[660] leading-[1.35]">
                  {s.hook} →
                </Link>
                <p className="ui mt-0.5 text-[13.5px] leading-[1.4] text-[var(--muted)]">
                  <Link href={mp(s.seat)} className="text-[var(--muted)]">
                    {s.name}
                  </Link>{" "}
                  · {s.place}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <PostCTA
        title="See every claim Angus MacDonald has made"
        body="Open our live Receipt Finder on the Highland MP. Copy any receipt for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=inverness-skye-and-west-ross-shire"
        cta="See his receipts"
      />
    </Prose>
  );
}
