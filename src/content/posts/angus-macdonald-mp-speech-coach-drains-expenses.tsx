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
  {
    name: "Dan Jarvis",
    p: "Labour",
    seat: "Barnsley Central (now Barnsley North)",
    date: "21 Apr 2023",
    detail: "A speechwriting training course",
    value: 1020,
  },
  {
    name: "Stephen Kinnock",
    p: "Labour",
    seat: "Aberafan Maesteg",
    date: "14 Aug 2025",
    detail: "“Impact Factory - Public Speaking training 12th Sept”",
    value: 660,
  },
];

/** His second home bills for 2025/26, with no rent at all. */
const SECOND_HOME: { what: string; value: number; label: string; hot?: boolean }[] = [
  { what: "Rent", value: 0, label: "£0" },
  { what: "Drain cleaning (two visits, March 2026)", value: 546, label: "£546", hot: true },
  { what: "Buildings insurance", value: 745.55, label: "£746" },
  { what: "Flat service charges", value: 939.24, label: "£939" },
  { what: "Energy and water", value: 3314.09, label: "£3,314" },
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
            <strong>Taxpayers</strong> paid <strong>£3,000</strong> for a speech skills workshop
            for Highland MP <Link href={MACDONALD.href}>Angus MacDonald</Link>.
          </>,
          <>
            It came out of his <strong>staff budget</strong>. That money is meant for the people
            who help you with your problems.
          </>,
          <>
            You also paid <strong>£546</strong> to clean the drains at his second home in London.
            No other UK MP has billed for that.
          </>,
          <>
            He claims <strong>no rent</strong> on that home. But he billed{" "}
            <strong>£3,314</strong> for its energy and water in one year, the most of any Scottish
            MP.
          </>,
          <>
            <strong>£0</strong> has been paid back.
          </>,
        ]}
      />

      <Spotlight
        person={MACDONALD}
        kicker="17 July 2025 · from his staff budget"
        amount="£3,000"
        headline="You paid for lessons in giving speeches."
        lines={[
          {
            meta: "Staffing · Bought-in services · Comms & Media",
            what: "Provision of personalised presentation and speech skills workshop to assist MPs representational role in Parliament.",
            amount: "£3,000.00",
          },
        ]}
      >
        <p>Talking is the job. You paid for him to learn how to do it.</p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-speech-coach">
        £3,000 for lessons in giving speeches
      </Finding>
      <P>
        <Link href={MACDONALD.href}>Angus MacDonald</Link> won Inverness, Skye and West Ross-shire
        for the Lib Dems in July 2024. He has offices on the High Street in Fort William and in
        Inverness.
      </P>
      <P>
        IPSA is the body that pays MPs&apos; expenses with public money. On 17 July 2025 it paid
        £3,000 for a &ldquo;personalised presentation and speech skills workshop&rdquo; for him.
      </P>
      <P>
        The money came from his staff budget. That pot pays the people who answer your letters
        and help you with benefits, housing and the like.
      </P>

      <Tiles
        items={[
          { value: "£450", label: "one month's rent on his constituency office (2024/25)" },
          { value: "£3,000", label: "one speech workshop for the MP", hot: true },
        ]}
      />

      <P>
        That one workshop cost more than six months&apos; rent on his local office. The record
        does not say who ran it, or how long it lasted.
      </P>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-comparison">
        How it compares across all 650 UK MPs
      </Finding>
      <P>
        We checked over 350,000 claim lines from all 650 UK MPs, from 2022 to 2027. We pulled out
        every claim that was only about speeches.
      </P>
      <P>
        His is the biggest by any Scottish MP. In the whole UK, only one MP put in a bigger single
        claim. He is a fellow Lib Dem.
      </P>
      <P>
        Compare it with Labour&apos;s Stephen Kinnock. He paid £660 for public speaking training
        in 2025. Angus MacDonald&apos;s workshop cost over four times that.
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

      <CaseCard kicker="The Lib Dem speech habit" figure="£37,000" people={[MACDONALD]}>
        <p>
          Lib Dem MP Chris Coghlan, from Dorking in Surrey, has billed <strong>£34,000</strong> for
          &ldquo;speech consultancy&rdquo; since October 2024. That is 14 claims.
        </p>
        <p>
          Add Angus MacDonald&apos;s £3,000 and two Lib Dem MPs have billed you{" "}
          <strong>£37,000</strong> for help with speeches.
        </p>
      </CaseCard>

      <Aside title="He is not the only Scottish MP paying for coaching">
        <p>
          Labour&apos;s <Link href={mp("na-h-eileanan-an-iar")}>Torcuil Crichton</Link> billed £2,400
          for coaching. The firm belongs to a former IPSA worker. It billed 12 MPs £16,800 in
          under a year.{" "}
          <Link href="/blog/torcuil-crichton-mp-coaching-expenses-western-isles">Read the Western Isles story</Link>.
        </p>
      </Aside>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="second-home">
        £546 to clean the drains at his second home
      </Finding>
      <P>
        MPs who live far from London can claim for a second home there. His is a London flat. He
        bills <strong>no rent</strong> for it. But you still pay its running costs.
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
        We searched the second home claims of all 650 UK MPs since 2022. <strong>Nobody
        else</strong> billed you to clean their drains.
      </P>

      <ChartFrame
        kicker="His London flat · 2025/26"
        title="What you paid for a second home he pays no rent on"
        caption="Source: IPSA files for Angus MacDonald MP, 2025/26 budget year. His whole second home bill that year was £6,076, with £0 rent. Smaller items are not shown."
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
        His £3,314 for energy and water was the <strong>8th highest</strong> of all 650 MPs that
        year. It was the highest in Scotland.
      </P>
      <P>
        Then in March 2026 he billed <strong>£3,027.12</strong> for council tax. IPSA&apos;s line
        says it includes the &ldquo;second home premium&rdquo;. That is the extra charge councils put
        on second homes. You pay that too.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        The rest of his bills, and why IPSA said yes
      </Finding>
      <P>Here is what else stands out in his files since July 2024.</P>

      <PointList
        items={[
          {
            key: "cameras",
            title: "£1,126 for two digital cameras on the same day",
            children: <>£562.98 each on 27 March 2025. One for Westminster, one for the Highlands.</>,
          },
          {
            key: "legal",
            title: "£3,064 in legal and professional fees",
            children: <>For his Inverness office, in March 2025.</>,
          },
          {
            key: "furniture",
            title: "£2,182 on office furniture from one firm",
            children: <>Two bills from Kings Office Furniture, in March and May 2025.</>,
          },
          {
            key: "rail",
            title: "£19,942 on train fares in one year",
            children: (
              <>
                The most of any UK MP in 2025/26. To be fair, his seat is one of the furthest from
                London.
              </>
            ),
          },
        ]}
      />

      <P>
        Some bills are fair enough. Vandals smashed his office windows, and part of the ceiling
        fell in at his Fort William office. He also pays local papers like the West Highland Free
        Press to list his surgeries. That is what the money is for.
      </P>
      <P>
        But the speech workshop and the drains? IPSA lets MPs buy in outside help from their staff
        budget. It also pays running costs on a second home, even with no rent. So both were within
        the rules. And that is the scandal.
      </P>
      <P>
        He is not short of money either. His own Register of Interests lists shares in Hampden and
        Co, a bank, worth over £70,000. He also owns an office building in Stirling that
        earns him rent.
      </P>

      <PointList
        items={[
          {
            key: "who-ran-it",
            title: "Who ran the £3,000 workshop?",
            children: <>IPSA&apos;s record names no firm and no trainer.</>,
          },
          {
            key: "why-staff",
            title: "Why did it come from the staff budget?",
            children: <>That money is meant for help to local people, not lessons for the MP.</>,
          },
          {
            key: "drains",
            title: "Why should you clean his drains?",
            children: <>No other MP of the 650 has billed you for that.</>,
          },
        ]}
      />

      <Expand summary="See the proof: his other big claims, word for word">
        <Receipt
          person={MACDONALD}
          heading="IPSA records · Angus MacDonald · 2025 to 2026"
          lines={[
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
              meta: "24 Mar 2026 · Second home · Council tax",
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
              meta: "24 Mar 2025 · Staffing · Bought-in services",
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
        body="Open our live Receipt Finder on the Highland MP. Copy any claim for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=inverness-skye-and-west-ross-shire"
        cta="See his receipts"
      />

      <P>
        Want the full picture? <Link href="/mp-expenses-scotland">Compare all 57 Scottish MPs</Link>.
      </P>
    </Prose>
  );
}
