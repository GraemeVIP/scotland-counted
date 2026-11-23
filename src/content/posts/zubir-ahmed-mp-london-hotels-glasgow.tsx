import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published individual business costs CSV files for
 * 2024/25 to 2026/27 (checked 22 November 2026 across all 650 UK seats).
 * Quoted descriptions are IPSA's exact wording (with reference codes trimmed).
 * Commons sitting days: Hansard calendar (152 sitting days in 2025/26).
 * Votes & written questions: UK Parliament APIs. Minister dates: Members API.
 * Donation: UK Parliament Register of Members' Financial Interests (2026).
 * Nobody was contacted for comment.
 */

import {
  type PartyKey,
  PARTY,
  gbp,
  Who,
  QuickTake,
  Finding as KitFinding,
  ChartFrame,
  RankList,
  Receipt,
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const AHMED = {
  name: "Dr Zubir Ahmed",
  href: mp("glasgow-south-west"),
  p: "Labour" as PartyKey,
  place: "Glasgow South West",
};

const FINDINGS = 4;

function Finding({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <KitFinding n={n} of={FINDINGS} id={id}>
      {children}
    </KitFinding>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** All 25 of Dr Zubir Ahmed's London hotel and flat block booking claims (2024/25 to 2026/27). */
const ALL_STAYS: { date: string; year: string; paid: number; ipsa: string }[] = [
  { date: "7 Jul 2024", year: "2024/25", paid: 2388.0, ipsa: "accommodation hire for parliament" },
  { date: "1 Sep 2024", year: "2024/25", paid: 1353.0, ipsa: "Accommodation hire for parliament" },
  { date: "1 Oct 2024", year: "2024/25", paid: 2823.0, ipsa: "accomodation hire to attend parliament" },
  { date: "7 Nov 2024", year: "2024/25", paid: 2465.0, ipsa: "accommodation hire to attend parliament" },
  { date: "30 Nov 2024", year: "2024/25", paid: 2280.0, ipsa: "accommodation hire to attend parliament" },
  { date: "3 Jan 2025", year: "2024/25", paid: 2415.0, ipsa: "ACCOMMODATION HIRE FOR ATTENDANCE AT PARLIAMENT" },
  { date: "1 Feb 2025", year: "2024/25", paid: 2725.0, ipsa: "accommodation hire for parliament attendance" },
  { date: "1 Mar 2025", year: "2024/25", paid: 2845.7, ipsa: "accommodation hire for parliament" },
  { date: "1 Mar 2025", year: "2025/26", paid: 91.8, ipsa: "accommodation hire for parliament" },
  { date: "27 Mar 2025", year: "2025/26", paid: 3230.0, ipsa: "airbnb block booking for 29 nights" },
  { date: "29 Apr 2025", year: "2025/26", paid: 3490.0, ipsa: "Accommodation london 30 night block booking" },
  { date: "30 Apr 2025", year: "2025/26", paid: 184.8, ipsa: "hotel stay while in parliament 30 April" },
  { date: "27 May 2025", year: "2025/26", paid: 3615.0, ipsa: "Accommodation london 25 night block booking" },
  { date: "21 Jun 2025", year: "2025/26", paid: 4840.0, ipsa: "Accommodation london 28 night block booking" },
  { date: "20 Jul 2025", year: "2025/26", paid: 1113.0, ipsa: "block booked london accommodation" },
  { date: "1 Sep 2025", year: "2025/26", paid: 1124.26, ipsa: "MP Accommodation - Block Booking of flat, charging for 10 nights" },
  { date: "1 Oct 2025", year: "2025/26", paid: 3537.98, ipsa: "MP Accommodation - Block Booking of flat" },
  { date: "1 Nov 2025", year: "2025/26", paid: 2794.56, ipsa: "MP Accommodation - Block Booking of flat" },
  { date: "1 Dec 2025", year: "2025/26", paid: 3315.5, ipsa: "Mp Accommodation - Block Booking of flat" },
  { date: "1 Jan 2026", year: "2025/26", paid: 3270.06, ipsa: "MP Accommodation - Block Booking of flat" },
  { date: "1 Feb 2026", year: "2025/26", paid: 3323.61, ipsa: "MP Accommodation - Block Booking of flat" },
  { date: "1 Mar 2026", year: "2025/26", paid: 3428.01, ipsa: "MP Accommodation - Block Booking of flat" },
  { date: "2 Apr 2026", year: "2026/27", paid: 3462.0, ipsa: "block accommodation for westminster" },
  { date: "15 Apr 2026", year: "2026/27", paid: 3774.93, ipsa: "Block Flat booking" },
  { date: "15 Apr 2026", year: "2026/27", paid: 3628.61, ipsa: "june block booking flat" },
];

/** Top Scottish MPs for hotel claims across 2024/25 to 2026/27. */
const SCOTLAND_HOTELS: {
  name: string;
  seat: string;
  href: string;
  p: PartyKey;
  claims: number;
  value: number;
  note?: string;
}[] = [
  {
    name: "Dr Zubir Ahmed",
    seat: "Glasgow South West",
    href: mp("glasgow-south-west"),
    p: "Labour",
    claims: 25,
    value: 67518.82,
    note: "Nearly five times the next Scottish MP.",
  },
  {
    name: "Michael Shanks",
    seat: "Rutherglen",
    href: mp("rutherglen"),
    p: "Labour",
    claims: 32,
    value: 14195.31,
  },
  {
    name: "Douglas McAllister",
    seat: "West Dunbartonshire",
    href: mp("west-dunbartonshire"),
    p: "Labour",
    claims: 19,
    value: 9396.31,
  },
  {
    name: "Euan Stainbank",
    seat: "Falkirk",
    href: mp("falkirk"),
    p: "Labour",
    claims: 15,
    value: 9163.16,
  },
  {
    name: "Chris Kane",
    seat: "Stirling and Strathallan",
    href: mp("stirling-and-strathallan"),
    p: "Labour",
    claims: 16,
    value: 9024.1,
  },
  {
    name: "Alison Taylor",
    seat: "Paisley and Renfrewshire North",
    href: mp("paisley-and-renfrewshire-north"),
    p: "Labour",
    claims: 25,
    value: 7828.0,
  },
];

const BACKBENCH_CHECK: [label: string, value: string][] = [
  ["Days the Commons sat, April to July 2025", "60"],
  ["London nights paid for (27 March to 20 July 2025)", "123"],
  ["Cost of those nights", "£16,473"],
  ["Days he spoke in debates", "11"],
  ["Votes he took part in", "75 of 106"],
  ["Written questions he asked", "0"],
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function ZubirAhmedMpLondonHotelsGlasgow() {
  return (
    <Prose>
      <QuickTake
        items={[
          <>
            Glasgow South West MP <Link href={AHMED.href}>Dr Zubir Ahmed</Link> has billed you{" "}
            <strong>£67,519</strong> for London hotels and short stay flats since July 2024.
          </>,
          <>
            That is the <strong>highest total of all 650 UK MPs</strong> since July 2024. He sits
            nearly £20,000 ahead of second place (Esther McVey, £47,864) and almost five times
            ahead of any other Scottish MP.
          </>,
          <>
            In 2025/26 alone, taxpayers paid <strong>£37,359</strong> for{" "}
            <strong>295 nights</strong> in London. The House of Commons only sat for{" "}
            <strong>152 days</strong>.
          </>,
          <>
            Before he became a minister, he billed <strong>123 nights</strong> across 60 sitting
            days, spoke on 11 days, and asked zero written questions.
          </>,
        ]}
      />

      <Spotlight
        person={AHMED}
        kicker="July 2024 to April 2026 · 25 claims"
        amount="£67,519"
        headline="25 London hotel and flat bills in less than two years."
        lines={[
          { meta: "21 Jun 2025 · 28 night stay", what: "Accommodation london 28 night block booking", amount: "£4,840.00" },
          { meta: "15 Apr 2026 · two bills on one day", what: "Block Flat booking + june block booking flat", amount: "£7,403.54" },
          { meta: "27 Mar 2025 · 29 night stay", what: "airbnb block booking for 29 nights", amount: "£3,230.00" },
        ]}
      >
        <p>
          He claims no London rent. Instead, his stays go through IPSA as hotels and block booked
          flats, running between <strong>£2,300 and £4,840 a month</strong>.
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-bills">
        £67,519 on London stays, including £4,840 for one month
      </Finding>
      <P>
        Most folk in Govan, Pollok, Cardonald and Penilee know what a hotel room costs. You would
        think twice before paying £170 a night for a whole month.
      </P>
      <P>
        Dr <Link href={AHMED.href}>Zubir Ahmed</Link> won Glasgow South West in July 2024. Since
        then, he has billed taxpayers <strong>£67,519</strong> for London stays across 25 claims.
        IPSA files every one under London hotels.
      </P>
      <P>
        His biggest single bill was <strong>£4,840</strong> on 21 June 2025. That paid for a 28
        night block booking. It works out at £172.86 a night for four full weeks.
      </P>
      <P>
        In March 2025, you paid <strong>£3,230</strong> for a 29 night Airbnb stay. In April 2025,
        <strong>£3,490</strong> paid for 30 nights. In May 2025, <strong>£3,615</strong> paid for
        25 nights.
      </P>
      <P>
        The new year started fast too. In April 2026 alone, three claims went through for{" "}
        <strong>£10,866</strong>. Two flat bookings landed on the same day (£3,775 and £3,629).
      </P>

      <Tiles
        items={[
          { value: "£19,295", label: "London hotels in 2024/25 (8 claims)" },
          { value: "£37,359", label: "London hotels in 2025/26 (295 nights)", hot: true },
          { value: "£10,866", label: "Already claimed in April 2026 (3 claims)" },
        ]}
      />

      <P>
        Put that total beside real pay. A full time worker in the UK earned about £39,157 before
        tax in 2025. That means his 2025/26 London stays alone cost close to a whole year of work.
      </P>
      <P>
        Over less than two years, <strong>£67,519</strong> is more than two years of take home pay
        for many families in Glasgow South West.
      </P>

      <Expand summary="Show all 25 London hotel and flat claims">
        <ul className="divide-y divide-[var(--rule)]">
          {ALL_STAYS.map((s, i) => (
            <li key={`${s.date}-${i}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 py-3">
              <div className="min-w-0">
                <p className="ui text-[15.5px] font-[660] text-[var(--ink)]">
                  {s.date} · {s.year}
                </p>
                <p className="ui mt-0.5 text-[14px] leading-[1.4] text-[var(--muted)]">&ldquo;{s.ipsa}&rdquo;</p>
              </div>
              <div className="text-right">
                <p className="figure-num tnum text-[19px] leading-none text-[var(--ink)]">{gbp(s.paid)}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="ui mt-3 text-[14px] text-[var(--muted)]">
          Exact dates, totals and descriptions from IPSA&apos;s published files for 2024/25 to
          2026/27. Every claim is filed under London hotels.
        </p>
      </Expand>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="sitting-days">
        295 London nights in one year, when Parliament sat for 152 days
      </Finding>
      <P>
        MPs do not live at Westminster all year. In 2025/26, the House of Commons only sat for{" "}
        <strong>152 days</strong>. It was shut for 213 days.
      </P>
      <P>
        Yet in that one year, taxpayers paid for <strong>295 nights</strong> in London for Dr
        Zubir Ahmed. That is 143 more nights than sitting days. It works out at £246 for every day
        the Commons opened.
      </P>
      <P>
        Some will point out he became a health minister on 6 September 2025 (a role he held until
        12 May 2026). Fair enough. A minister works in London during the week.
      </P>
      <P>
        But look at the four months <strong>before</strong> he became a minister, from April to
        July 2025. He was an ordinary backbencher.
      </P>

      <ChartFrame
        kicker="April to July 2025 · before he was a minister"
        title="His backbench record against his London nights"
        caption="IPSA 2025/26 claims, Hansard and UK Parliament APIs."
      >
        <dl className="divide-y divide-[var(--rule)]">
          {BACKBENCH_CHECK.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-3">
              <dt className="ui text-[15px] leading-[1.4] text-[var(--ink-2)]">{label}</dt>
              <dd className="figure-num tnum shrink-0 text-right text-[20px] leading-none text-[var(--ink)]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </ChartFrame>

      <P>
        In those four months, the Commons sat on 60 days. You paid for{" "}
        <strong>123 London nights</strong> (£16,473). He spoke on 11 days and asked{" "}
        <strong>zero written questions</strong>.
      </P>
      <P>
        Even when he was a minister, his stays ran seven nights a week. That covers weekends and
        recess too. Over the year, he voted in 202 of 301 votes (67%), just below the MP average
        of 69%.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="scotland-rank">
        Number one in the UK, and five times any other Scottish MP
      </Finding>
      <P>
        We checked all 650 UK seats in IPSA&apos;s hotel files since the July 2024 election. Dr
        Zubir Ahmed sits top in Britain at <strong>£67,519</strong>. Second in the whole UK is
        Esther McVey at £47,864.
      </P>
      <P>
        In Scotland, nobody else comes close. The next highest Scottish MP, Michael Shanks, spent
        £14,195.
      </P>

      <ChartFrame
        kicker="IPSA · 2024/25 to 2026/27 · Scottish MPs"
        title="Biggest London hotel bills among Scottish MPs"
        caption="IPSA individual business costs, 2024/25 to 2026/27 (MP own hotel claims)."
      >
        <RankList
          max={SCOTLAND_HOTELS[0].value}
          rows={SCOTLAND_HOTELS.map((r, i) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
            side: `${r.claims} claims`,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            detail: r.note,
            highlight: i === 0,
          }))}
        />
      </ChartFrame>

      <P>
        Add up the next six Scottish MPs on that list. You still do not reach his bill. Most MPs
        rent a flat on a set cap, or only book a room on nights they stay.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="other-claims">
        What else you paid for in his office
      </Finding>
      <P>
        His Glasgow office bills also stood out. Every one below is a real item or job from
        IPSA&apos;s files.
      </P>

      <Receipt
        heading="Other tangible claims · 2024/25 to 2025/26"
        lines={[
          { meta: "28 Jan 2025 · Office refurb", what: "Office improvement costs", amount: "£8,550.00" },
          { meta: "6 Mar 2025 · Office refurb", what: "Office refurb", amount: "£3,493.00" },
          { meta: "28 Jan 2025 · Furniture", what: "Office desks and chairs", amount: "£2,253.60" },
          { meta: "10 Oct 2025 · Office signage", what: "Window Graphics", amount: "£1,164.00" },
          { meta: "1 Jul 2025 + 31 Mar 2026 · Two in 9 months", what: "Two full TV licences (TVLICENSING.CO.UK + CO-OP)", amount: "£349.00" },
        ]}
        total={{ label: "Those five items alone", amount: "£15,809.60" }}
      />

      <P>
        That is <strong>£12,043</strong> just on fixing up the office, <strong>£2,254</strong> on
        desks and chairs, <strong>£1,164</strong> on window signs, and{" "}
        <strong>two full TV licences in nine months</strong>.
      </P>
      <P>
        On the Register of Interests, he also declared a <strong>£30,000</strong> donation from
        Francesca Sainsbury Perrin.
      </P>

      <Aside title="Did he break IPSA's rules?">
        <p>
          Nothing in the public files says so. MPs are allowed to book London hotels instead of
          renting a flat, as long as each night sits under IPSA&apos;s £230 cap. IPSA waved every
          one of these 25 claims through, and £0 was refused or paid back.
        </p>
        <p>
          That is the real issue. IPSA sets the rules and marks its own work, while taxpayers pay
          for 295 hotel nights in a year Parliament only opened for 152 days.
        </p>
      </Aside>

      <PointList
        items={[
          {
            key: "shuttle",
            title: (
              <Link href="/blog/scottish-mps-london-homes-152-sitting-days">
                £2.91 million to shuttle Scottish MPs to London for 152 sitting days
              </Link>
            ),
            children: <>Shows every Scottish MP&apos;s London bill side by side.</>,
          },
          {
            key: "worst",
            title: (
              <Link href="/blog/worst-scottish-mp-expenses">The Scottish MP expenses scandal</Link>
            ),
            children: <>Puts all the worst claims in Scotland on one page.</>,
          },
          {
            key: "kilmarnock",
            title: (
              <Link href="/blog/kilmarnock-mp-23437-electricity-bill">
                £23,437 electricity bill paid in one day
              </Link>
            ),
            children: <>For Kilmarnock MP Lillian Jones, the biggest in the UK in five years.</>,
          },
        ]}
      />

      <PostCTA
        title="Check every receipt your MP claimed"
        body="Put your Glasgow or Scottish postcode into our free Receipt Finder to see every IPSA claim since 2022, in plain English."
        href="/mp-expenses-scotland/search"
        cta="Open the Receipt Finder"
      />
    </Prose>
  );
}
