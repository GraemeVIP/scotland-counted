import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every flight and rail
 * figure comes directly from IPSA's published individual business costs CSV
 * files for 2025/26 (MP Travel, London-constituency rows, excluding staff and
 * family, checked 23 November 2026 across all 55 current Scottish MPs who
 * served in 2025/26). IPSA records ticket costs, not a count of trips.
 * Exact speeches: UK Parliament Hansard (Christine Jardine, Airport
 * Expansion, 28 January 2025). Overseas trips: Register of Members'
 * Financial Interests (2026). Committee places: UK Parliament members API.
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
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const mp = (slug: string) => `/representatives/mps/${slug}`;
const SHANKS_STORY = "/blog/energy-minister-michael-shanks-flights-rutherglen";

const JARDINE = {
  name: "Christine Jardine",
  href: mp("edinburgh-west"),
  p: "Lib Dem" as PartyKey,
  place: "Edinburgh West",
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
/* Data (IPSA 2025/26 · MP Travel · London-constituency only)          */
/* ------------------------------------------------------------------ */

/** All 5 Edinburgh MPs side by side in 2025/26 (London-constituency MP Travel). */
const EDINBURGH_MPS: {
  name: string;
  seat: string;
  href: string;
  p: PartyKey;
  air: number;
  rail: number;
  share: string;
  note?: string;
}[] = [
  {
    name: "Christine Jardine",
    seat: "Edinburgh West",
    href: mp("edinburgh-west"),
    p: "Lib Dem",
    air: 20789.46,
    rail: 870.67,
    share: "96.0% air",
    note: "Nearly 40 times Tracy Gilbert's flight bill from the same city.",
  },
  {
    name: "Ian Murray",
    seat: "Edinburgh South",
    href: mp("edinburgh-south"),
    p: "Labour",
    air: 8385.46,
    rail: 338.6,
    share: "96.1% air",
  },
  {
    name: "Chris Murray",
    seat: "Edinburgh East and Musselburgh",
    href: mp("edinburgh-east-and-musselburgh"),
    p: "Labour",
    air: 5376.15,
    rail: 6339.13,
    share: "45.9% air",
    note: "Spent more on trains than planes.",
  },
  {
    name: "Dr Scott Arthur",
    seat: "Edinburgh South West",
    href: mp("edinburgh-south-west"),
    p: "Labour",
    air: 680.39,
    rail: 8907.79,
    share: "7.1% air",
    note: "Most of his London travel spend went on trains.",
  },
  {
    name: "Tracy Gilbert",
    seat: "Edinburgh North and Leith",
    href: mp("edinburgh-north-and-leith"),
    p: "Labour",
    air: 529.1,
    rail: 10481.0,
    share: "4.8% air",
    note: "Almost all of her London travel spend went on trains.",
  },
];

/** All 6 Glasgow MPs side by side in 2025/26 (London-constituency MP Travel). */
const GLASGOW_MPS: {
  name: string;
  seat: string;
  href: string;
  p: PartyKey;
  air: number;
  rail: number;
  share: string;
  note?: string;
}[] = [
  {
    name: "Patricia Ferguson",
    seat: "Glasgow West",
    href: mp("glasgow-west"),
    p: "Labour",
    air: 19233.09,
    rail: 0,
    share: "100% air",
    note: "£0 on London trains across the whole year.",
  },
  {
    name: "Maureen Burke",
    seat: "Glasgow North East",
    href: mp("glasgow-north-east"),
    p: "Labour",
    air: 15003.35,
    rail: 526.74,
    share: "96.6% air",
  },
  {
    name: "Gordon McKee",
    seat: "Glasgow South",
    href: mp("glasgow-south"),
    p: "Labour",
    air: 9438.04,
    rail: 688.09,
    share: "93.2% air",
  },
  {
    name: "Dr Zubir Ahmed",
    seat: "Glasgow South West",
    href: mp("glasgow-south-west"),
    p: "Labour",
    air: 7441.51,
    rail: 55.0,
    share: "99.3% air",
  },
  {
    name: "Martin Rhodes",
    seat: "Glasgow North",
    href: mp("glasgow-north"),
    p: "Labour",
    air: 6276.09,
    rail: 6977.25,
    share: "47.4% air",
    note: "Spent more on trains than planes.",
  },
  {
    name: "John Grady",
    seat: "Glasgow East",
    href: mp("glasgow-east"),
    p: "Labour",
    air: 2781.71,
    rail: 9269.59,
    share: "23.1% air",
    note: "Most of his London travel spend went on trains.",
  },
];

/**
 * Four more MPs near Glasgow and Edinburgh main lines (2025/26 London
 * travel). Shanks and Sullivan have their own story, linked in finding 4.
 */
const OTHER_FLYERS: {
  name: string;
  slug: string;
  party: string;
  seat: string;
  air: string;
  rail: string;
  context: string;
}[] = [
  {
    name: "Graeme Downie",
    slug: "dunfermline-and-dollar",
    party: "Labour",
    seat: "Dunfermline and Dollar",
    air: "£28,916",
    rail: "£2,529",
    context: "92.0% air. Sits on the Commons Energy Security and Net Zero Committee. Also took £11,882 in funded trips to the USA, Taiwan and Spain.",
  },
  {
    name: "Douglas McAllister",
    slug: "west-dunbartonshire",
    party: "Labour",
    seat: "West Dunbartonshire",
    air: "£22,241",
    rail: "£131",
    context: "99.4% air. Backed clean energy in his first Commons speech.",
  },
  {
    name: "Katrina Murray",
    slug: "cumbernauld-and-kirkintilloch",
    party: "Labour",
    seat: "Cumbernauld and Kirkintilloch",
    air: "£19,017",
    rail: "£187",
    context: "99.0% air. Declared £840 of US flights paid by Elected Officials to Protect America, and a £1,570 trip to look at Swiss trains and training (£380 of it travel).",
  },
  {
    name: "Brian Leishman",
    slug: "alloa-and-grangemouth",
    party: "Labour",
    seat: "Alloa and Grangemouth",
    air: "£18,292",
    rail: "£1,835",
    context: "90.9% air. Told Parliament in June 2025: \"There is no doubt about it; we face a climate emergency.\"",
  },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function ScottishMpsFlightsClimateExpenses() {
  return (
    <Prose>
      <QuickTake
        items={[
          <>
            Across Scotland, 55 current MPs billed you <strong>£868,378</strong> for London flights
            and <strong>£150,170</strong> for trains in 2025/26. That&apos;s{" "}
            <strong>85% of their London travel money on planes</strong>.
          </>,
          <>
            In Edinburgh, <Link href={mp("edinburgh-north-and-leith")}>Tracy Gilbert</Link> spent{" "}
            <strong>£529 on planes</strong> and <strong>£10,481 on trains</strong>. In the same
            city, <Link href={JARDINE.href}>Christine Jardine</Link> spent{" "}
            <strong>£20,789 on planes</strong> and £871 on trains.
          </>,
          <>
            In Glasgow, <Link href={mp("glasgow-east")}>John Grady</Link> spent{" "}
            <strong>£9,270 on trains</strong>. Across the same city,{" "}
            <Link href={mp("glasgow-west")}>Patricia Ferguson</Link> spent{" "}
            <strong>£19,233 on planes</strong> and <strong>£0 on trains</strong>.
          </>,
          <>
            Bathgate and Linlithgow MP{" "}
            <Link href={mp("bathgate-and-linlithgow")}>Kirsteen Sullivan</Link> also spent{" "}
            <strong>£0 on London trains</strong> all year (£18,342 on planes). UK Energy Minister{" "}
            <Link href={mp("rutherglen")}>Michael Shanks</Link> billed £11,753 for planes and £955
            for trains. <Link href={SHANKS_STORY}>Read their story</Link>.
          </>,
        ]}
      />

      <Spotlight
        person={JARDINE}
        kicker="2025/26 London travel · Same city contrast"
        amount="£20,789"
        headline="£20,789 on planes from Edinburgh. Two MPs in the same city spent £529 and £680."
        lines={[
          { meta: "Christine Jardine · Edinburgh West", what: "London flights £20,789 vs trains £871", amount: "96.0% air" },
          { meta: "Dr Scott Arthur · Edinburgh South West", what: "London flights £680 vs trains £8,908", amount: "7.1% air" },
          { meta: "Tracy Gilbert · Edinburgh North and Leith", what: "London flights £529 vs trains £10,481", amount: "4.8% air" },
        ]}
      >
        <p>
          On 28 January 2025, she told MPs:{" "}
          <a href="https://hansard.parliament.uk/Commons/2025-01-28/debates/DA779B29-76E4-40CE-BE62-3C19ACFE0877/AirportExpansion#contribution-540D2CA6-4785-4AFC-BC86-BAE33058A917">
            &ldquo;I have consistently raised airport noise, opposition to the expansion of
            Heathrow&rdquo;
          </a>
          . Her own flights over four years came to <strong>£71,282</strong>. You paid.
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="edinburgh-split">
        Same city, 40 times the flight bill
      </Finding>
      <P>
        Ask MPs why they fly to London and you hear the same excuse. Trains take too long. Votes
        finish late. Flying is the only way to do the job.
      </P>
      <P>
        Then look at the five MPs who represent Edinburgh. They live in the same city. Fast trains
        leave Waverley and Haymarket for London every half hour.
      </P>
      <P>
        In 2025/26, <Link href={mp("edinburgh-north-and-leith")}>Tracy Gilbert</Link> spent{" "}
        <strong>£529 on planes</strong> and <strong>£10,481 on trains</strong> for London trips.{" "}
        <Link href={mp("edinburgh-south-west")}>Dr Scott Arthur</Link> spent{" "}
        <strong>£680 on planes</strong> and <strong>£8,908 on trains</strong>.
      </P>
      <P>
        Both did the exact same London job by rail. Yet{" "}
        <Link href={JARDINE.href}>Christine Jardine</Link> (Edinburgh West) billed{" "}
        <strong>£20,789 on planes</strong> and just <strong>£871 on trains</strong>. It&apos;s nearly
        40 times Tracy Gilbert&apos;s flight bill from the same city.
      </P>

      <ChartFrame
        kicker="IPSA · 2025/26 · All 5 Edinburgh MPs"
        title="London flights vs trains from the exact same city"
        caption="IPSA 2025/26 London to constituency MP Travel only (excluding staff and family). IPSA records ticket costs, not a count of trips."
      >
        <RankList
          max={EDINBURGH_MPS[0].air}
          rows={EDINBURGH_MPS.map((r, i) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
            side: `Rail ${gbp(r.rail, false)} · ${r.share}`,
            value: r.air,
            label: gbp(r.air, false),
            colour: PARTY[r.p].colour,
            detail: r.note,
            highlight: i === 0,
          }))}
        />
      </ChartFrame>

      <P>
        Over four years (2022/23 to 2025/26), her own flight bills hit <strong>£71,282</strong>.
        Add staff and family planes and the sum hits £94,464.
      </P>
      <P>
        Want to see what else she billed? We also looked at her{" "}
        <Link href="/blog/christine-jardine-mp-christmas-lunch-expenses">
          £510.11 office Christmas lunch claim
        </Link>
        .
      </P>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="glasgow-split">
        Glasgow: John Grady £9,270 on trains, Patricia Ferguson £0
      </Finding>
      <P>
        Glasgow shows the exact same split. Fast trains run from Glasgow Central to London all day.
      </P>
      <P>
        In 2025/26, <Link href={mp("glasgow-east")}>John Grady</Link> (Glasgow East) spent{" "}
        <strong>£9,270 on trains</strong> and £2,782 on planes.{" "}
        <Link href={mp("glasgow-north")}>Martin Rhodes</Link> (Glasgow North) also spent more on
        trains (£6,977) than planes (£6,276).
      </P>
      <P>
        Across the same city, <Link href={mp("glasgow-west")}>Patricia Ferguson</Link> (Glasgow
        West) billed <strong>£19,233 on planes</strong> and <strong>£0 on trains</strong>.
      </P>

      <ChartFrame
        kicker="IPSA · 2025/26 · All 6 Glasgow MPs"
        title="Glasgow MPs' London flights vs trains side by side"
        caption="IPSA 2025/26 London to constituency MP Travel only (excluding staff and family)."
      >
        <RankList
          max={GLASGOW_MPS[0].air}
          rows={GLASGOW_MPS.map((r, i) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
            side: `Rail ${gbp(r.rail, false)} · ${r.share}`,
            value: r.air,
            label: gbp(r.air, false),
            colour: PARTY[r.p].colour,
            detail: r.note,
            highlight: i === 0,
          }))}
        />
      </ChartFrame>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="scotland-total">
        85% of their London travel money went on planes
      </Finding>
      <P>
        Step back to the whole country. In 2025/26, the 55 current Scottish MPs in IPSA&apos;s
        files spent <strong>£868,378 on London planes</strong> and{" "}
        <strong>£150,170 on trains</strong>. That&apos;s{" "}
        <strong>85% of their London travel money on planes</strong>.
      </P>
      <P>
        Add other UK and European trips and those 55 MPs spent <strong>£912,655 on planes</strong>{" "}
        against £161,123 on trains.
      </P>

      <Tiles
        items={[
          { value: "£868,378", label: "London flights in 2025/26 (55 MPs)", hot: true },
          { value: "£150,170", label: "London trains in 2025/26 (55 MPs)" },
          { value: "£521,119", label: "Glasgow and Edinburgh belt flights alone (83% on planes)" },
        ]}
      />

      <P>
        Be fair to island and far north MPs. Seats like Orkney, Shetland and the Western Isles have
        no real train option to London.
      </P>
      <P>
        So we took out all 18 island, Highland, north east and rural south seats. That leaves{" "}
        <strong>39 seats around Glasgow, Edinburgh, Fife, Ayrshire and Lanarkshire</strong>. Even
        there, MPs billed <strong>£521,119 on London planes</strong> against £104,553 on trains.
        That&apos;s <strong>83% of their London travel money on planes</strong>.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="minister-and-zero-rail">
        The Energy Minister and the MPs who spent £0 on trains
      </Finding>
      <P>
        Three Scottish MPs put nothing at all on London trains in 2025/26. Every penny of their London
        travel went on planes.
      </P>
      <P>
        One is <Link href={mp("glasgow-west")}>Patricia Ferguson</Link> in Glasgow West, above.
        Another is <Link href={mp("argyll-bute-and-south-lochaber")}>Brendan O&apos;Hara</Link> in
        Argyll, Bute and South Lochaber. His seat is one of the 18 island, Highland and rural seats we took
        out above.
      </P>
      <P>
        The third is <Link href={mp("bathgate-and-linlithgow")}>Kirsteen Sullivan</Link> in Bathgate
        and Linlithgow, about 20 minutes by train from Edinburgh. She put{" "}
        <strong>£18,342 on planes</strong>. UK Energy Minister{" "}
        <Link href={mp("rutherglen")}>Michael Shanks</Link> flies too. His Rutherglen seat
        is a few minutes from Glasgow Central, and he put <strong>£11,753 on planes</strong> and £955
        on trains.
      </P>
      <P>
        We&apos;ve told their story in full:{" "}
        <Link href={SHANKS_STORY}>the Energy Minister who flies while his staff take the train</Link>.
      </P>

      <Expand summary="See 4 more MPs beside fast London rail lines (2025/26)">
        <ul className="divide-y divide-[var(--rule)]">
          {OTHER_FLYERS.map((row) => (
            <li key={row.name} className="py-3.5">
              <p className="ui text-[15.5px] font-[660] text-[var(--ink)]">
                <Link href={mp(row.slug)}>{row.name}</Link> ({row.party}) · {row.seat}
              </p>
              <p className="ui mt-1 text-[14.5px] leading-[1.45] text-[var(--ink-2)]">
                <strong>2025/26 London travel:</strong> Planes {row.air} vs Trains {row.rail}
              </p>
              <p className="ui mt-1 text-[14.5px] leading-[1.45] text-[var(--muted)]">
                {row.context}
              </p>
            </li>
          ))}
        </ul>
      </Expand>

      <Aside title="What the files show, and what they hide">
        <p>
          For MP safety, IPSA hides single UK flight dates and prints one yearly spend figure per
          MP. These numbers show <strong>ticket costs</strong>, not how many trips each MP took.
        </p>
        <p>
          None of these MPs broke the rules. IPSA lets any Scottish MP fly and pays the bill. The
          test is plain. <Link href={mp("edinburgh-north-and-leith")}>Tracy Gilbert</Link> and{" "}
          <Link href={mp("edinburgh-south-west")}>Dr Scott Arthur</Link> do the job from Edinburgh by
          train. Why is another MP in the same city billing you over £20,000 a year for planes?
        </p>
      </Aside>

      <PointList
        items={[
          {
            key: "minister",
            title: (
              <Link href={SHANKS_STORY}>
                The Energy Minister flies to London. His staff take the train
              </Link>
            ),
            children: <>Michael Shanks put 92% of his London travel money on planes.</>,
          },
          {
            key: "shuttle",
            title: (
              <Link href="/blog/scottish-mps-london-homes-152-sitting-days">
                £2.91 million to shuttle Scottish MPs to London for 152 sitting days
              </Link>
            ),
            children: <>See every Scottish MP&apos;s full London housing and travel bill.</>,
          },
          {
            key: "zubir",
            title: (
              <Link href="/blog/zubir-ahmed-mp-london-hotels-glasgow">
                Dr Zubir Ahmed: £67,519 on London hotels and flats (UK number one)
              </Link>
            ),
            children: <>25 London hotel and flat claims across less than two years.</>,
          },
          {
            key: "worst",
            title: (
              <Link href="/blog/worst-scottish-mp-expenses">Standout Scottish MP expense claims</Link>
            ),
            children: <>All the biggest Scottish MP expense claims in one place.</>,
          },
        ]}
      />

      <PostCTA
        title="Check what your own MP spent on flights and trains"
        body="Put your Scottish postcode into our free Receipt Finder to inspect every IPSA claim since 2022, in plain English."
        href="/mp-expenses-scotland/search"
        cta="Open the Receipt Finder"
      />
    </Prose>
  );
}
