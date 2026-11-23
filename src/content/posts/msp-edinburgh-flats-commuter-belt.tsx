import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written with the graeme-writing skill. Figures: Holyrood's own expense
 * files (allowances_member_transactions, 2024/25 claim months, Edinburgh
 * Accommodation Provision), the Members' Expenses Scheme Annex A groups,
 * SPCB Paper 60 (10 September 2026), the Allowances Office review of the
 * scheme (September 2025, paragraphs 59 and 67), Holyrood vote records
 * for 2024/25, and the Official Report of 11 November 2026.
 * Distances are straight lines from each seat's main town to Holyrood,
 * except where an MSP has said publicly where they live.
 */

import {
  type PartyKey,
  QuickTake,
  Finding,
  Spotlight,
  CaseCard,
  RankList,
  Who,
  Tiles,
  PointList,
  Expand,
} from "@/components/ExpenseKit";

const FINDINGS = 4;
const msp = (path: string) => `/representatives/msps/${path}`;

const SIMPSON = {
  name: "Graham Simpson",
  href: msp("regions/central-scotland-and-lothians-west/graham-simpson"),
  p: "Reform UK" as PartyKey,
  place: "Regional MSP, lives in East Kilbride",
};
const STEVENSON = {
  name: "Collette Stevenson",
  href: msp("constituencies/east-kilbride"),
  p: "SNP" as PartyKey,
  place: "East Kilbride",
};
const GIBSON = {
  name: "Kenneth Gibson",
  href: msp("constituencies/cunninghame-north"),
  p: "SNP" as PartyKey,
  place: "Cunninghame North, lives in Kilbirnie",
};

/** Commuter belt renters, 2024/25. Flat costs = rent, council tax, bills. */
const NEAR: { name: string; href?: string; p: PartyKey; seat: string; miles: number; cost: number }[] = [
  { name: "Màiri McAllan", href: msp("constituencies/clydesdale"), p: "SNP", seat: "Clydesdale (Lanark)", miles: 30, cost: 2392 },
  { name: "Collette Stevenson", href: msp("constituencies/east-kilbride"), p: "SNP", seat: "East Kilbride", miles: 41, cost: 16588 },
  { name: "Jackson Carlaw", p: "Conservative", seat: "Eastwood (Newton Mearns)", miles: 47, cost: 13343 },
  { name: "Graeme Dey", p: "SNP", seat: "Angus South (Arbroath)", miles: 48, cost: 20393 },
  { name: "Willie Coffey", p: "SNP", seat: "Kilmarnock and Irvine Valley", miles: 56, cost: 18852 },
  { name: "Stuart McMillan", href: msp("constituencies/inverclyde"), p: "SNP", seat: "Greenock and Inverclyde", miles: 61, cost: 18815 },
  { name: "Kenneth Gibson", href: msp("constituencies/cunninghame-north"), p: "SNP", seat: "Cunninghame North (Kilbirnie)", miles: 62, cost: 23053 },
  { name: "Ruth Maguire", p: "SNP", seat: "Cunninghame South (Irvine)", miles: 62, cost: 13545 },
  { name: "Siobhian Brown", href: msp("constituencies/ayr"), p: "SNP", seat: "Ayr", miles: 66, cost: 17587 },
];

export default function MspEdinburghFlatsCommuterBelt() {
  return (
    <Prose>
      <QuickTake
        items={[
          <>
            In 2024/25, taxpayers rented Edinburgh flats for <strong>36 MSPs</strong>. Rent,
            council tax and bills came to <strong>£623,696</strong>.
          </>,
          <>
            Holyrood only sits <strong>Tuesday to Thursday</strong>, about 36 weeks a year. The flats
            are paid for all year round.
          </>,
          <>
            The rule: if your home area is <strong>more than 90 minutes</strong> from Holyrood, you can
            have a flat. Under 90 minutes, you get hotel nights only.
          </>,
          <>
            <strong>East Kilbride</strong> is 50 miles away, by Parliament&apos;s own count. It&apos;s
            on the flat list. Glasgow city isn&apos;t.
          </>,
          <>
            Holyrood&apos;s own expenses staff worked out that two hotel nights a week would cost{" "}
            <strong>£4,798 less</strong> than the average flat.
          </>,
        ]}
      />

      <Spotlight
        person={SIMPSON}
        kicker="Edinburgh flat, 2024/25 · Conservative MSP at the time"
        amount="£22,244"
        headline="A flat in Edinburgh, for an MSP who lives in East Kilbride."
        lines={[
          { meta: "Rent", what: "Rental Expenditure", amount: "£13,500.00" },
          { meta: "Including £4,842 paid early for 2025/26", what: "Council Tax", amount: "£8,321.97" },
          { meta: "Bills", what: "Utilities and Telephone Costs", amount: "£421.74" },
        ]}
      >
        <p>
          On 11 November 2026 he told Parliament about &ldquo;the situation where I live, in East
          Kilbride&rdquo;. In the same speech: &ldquo;People like me are forced to use cars&rdquo;.
        </p>
        <p>He also billed £4,085 for Edinburgh hotels that year, on top of the flat.</p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} of={FINDINGS} id="the-rule">
        The 90 minute rule that hands out the flats
      </Finding>
      <P>
        Every MSP&apos;s home falls into one of three groups. The group decides what you can bill for
        a place to sleep in Edinburgh. It goes by the area where you live, not the seat you
        represent.
      </P>

      <Tiles
        items={[
          { value: "Group 1", label: "Edinburgh, West Lothian and part of Midlothian. Nothing at all." },
          { value: "Group 2", label: "Under 90 minutes away: Glasgow city, Fife, Dundee, Stirling. Hotel nights only." },
          { value: "Group 3", label: "Over 90 minutes away. A whole flat, up to £22,400 a year.", hot: true },
        ]}
      />

      <P>
        The 90 minutes is measured from the middle of the area, or its nearest big station. Not from
        where the MSP actually lives. And that&apos;s where it falls apart.
      </P>
      <P>
        Glasgow&apos;s own suburbs are in <strong>Group 3</strong>. That means places like East
        Kilbride, Newton Mearns, Clydebank and Dumbarton. Glasgow city, sitting right next to them,
        is in Group 2. So an MSP in Newton Mearns can rent a flat, and one a few miles up the road
        in Glasgow Southside gets hotel nights.
      </P>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} of={FINDINGS} id="east-kilbride">
        East Kilbride: 50 miles, two MSPs, two flats
      </Finding>
      <P>
        Holyrood&apos;s expense rules are set by a small group of MSPs who run the Parliament. In
        September 2026, their own staff wrote them{" "}
        <a href="https://www.parliament.scot/-/media/files/spcb/spcb-papers/spcb-papers-2026/10-september/spcb-2026-paper-60.pdf">a report on the flat rules</a>. In it, they admitted the problem in black and white.
        They listed <strong>East Kilbride at 50 miles</strong> from Parliament, and Scone at 47. Both
        are on the flat list.
      </P>
      <P>
        Two MSPs who live in East Kilbride had taxpayers rent them an Edinburgh flat in 2024/25. One
        is Graham Simpson, at the top of this page. The other is Collette Stevenson, the MSP for East
        Kilbride. Between them that&apos;s <strong>£38,832</strong>.
      </P>

      <CaseCard kicker="Edinburgh flat, 2024/25" figure="£16,588" people={[STEVENSON]}>
        <p>
          Collette Stevenson is the MSP for East Kilbride, and she lives there. In October 2026,
          Holyrood magazine said she has always lived in East Kilbride.
        </p>
        <p>
          Taxpayers still rented her a flat in Edinburgh: £11,837 rent, £3,442 council tax and £1,310
          in bills.
        </p>
      </CaseCard>

      <P>
        Lots of people go from Lanarkshire to Edinburgh for work every day. They pay for it
        themselves. Nobody rents them a flat.
      </P>
      <P>
        So what did Holyrood&apos;s staff suggest? Not taking a single flat away. Their report was about
        Green MSP <Link href={msp("regions/mid-scotland-and-fife/mark-ruskell")}>Mark Ruskell</Link>,
        who lives in the north of the Stirling seat, about two hours from Holyrood. His area only gets
        hotel nights. The staff said it should move up to the flat group.
      </P>
      <P>
        So the fix for a rule that hands out too many flats was to hand out one more. If he has a late
        night, a hotel is there. Otherwise he can drive home, like everyone else does.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} of={FINDINGS} id="commuter-belt">
        The commuter belt flats
      </Finding>
      <P>
        These MSPs all had an Edinburgh flat on expenses in 2024/25, with seats within about 66 miles
        of Holyrood. Miles are straight lines from each seat&apos;s main town. By road it&apos;s further:
        Holyrood&apos;s own report puts East Kilbride at 50.
      </P>

      <RankList
        rows={NEAR.map((r) => ({
          key: r.name,
          who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
          side: `${r.miles} miles`,
          value: r.cost,
          label: `£${r.cost.toLocaleString("en-GB")}`,
        }))}
      />

      <CaseCard kicker="Kilbirnie to Holyrood, 2024/25" figure="£23,053" people={[GIBSON]}>
        <p>
          His own website says he lives in Kilbirnie, in Ayrshire. In 2024/25 he billed £17,558 in
          rent and £5,494 in council tax for the Edinburgh flat. All in, that&apos;s about £1,921 a month.
        </p>
        <p>
          He was an SNP MSP then. Since May 2026 he has been Holyrood&apos;s Presiding Officer.
        </p>
      </CaseCard>

      <P>
        The islands are a different story. An MSP from Shetland lives 300 miles away. They need a bed
        in Edinburgh, and nobody sensible argues with that. It&apos;s why the flats in the commuter
        belt stand out.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} of={FINDINGS} id="hotels-vs-flats">
        Parliament&apos;s own sums say hotels can be cheaper
      </Finding>
      <P>
        In September 2025, Holyrood&apos;s own expenses office compared hotels with flats. A hotel
        night, with dinner, bed and breakfast, cost £165 on average in 2024/25.
      </P>

      <Tiles
        items={[
          { value: "£16,678", label: "Average yearly cost of an MSP's Edinburgh flat, 2024/25", hot: true },
          { value: "£11,880", label: "Two hotel nights a week, 36 weeks. £4,798 cheaper." },
          { value: "£17,820", label: "Three hotel nights a week. £1,142 dearer." },
        ]}
      />

      <P>
        So the whole thing comes down to one number: how many nights each MSP actually sleeps in the
        flat. And that&apos;s the one number nobody publishes.
      </P>
      <P>
        The chamber voted on <strong>83 days</strong> in 2024/25. Every one was a Tuesday, Wednesday
        or Thursday. Mondays and Fridays are kept for work back home.
      </P>
      <P>
        Of the 62 MSPs allowed a flat, <strong>37</strong> took one. Holyrood&apos;s staff still said
        keep the flats. Their reasons: hotel prices are going up, and MSPs told them a flat is handier.
      </P>

      <PointList
        items={[
          {
            key: "nights",
            title: "How many nights did each MSP use the flat?",
            children: <>Nobody publishes it, so nobody can check if the flat was the cheaper choice.</>,
          },
          {
            key: "suburbs",
            title: "Why are Glasgow's suburbs in the flat group, but not Glasgow?",
            children: <>The rule measures from the middle of an area, not from anyone&apos;s front door.</>,
          },
          {
            key: "check",
            title: "Does anyone compare the flat with hotels, MSP by MSP?",
            children: <>The rules give a flat by postcode group. There&apos;s no value for money test.</>,
          },
        ]}
      />

      <Expand summary="How we worked this out">
        <div className="space-y-3 text-[16px] leading-[1.6] text-[var(--ink-2)]">
          <p>
            Flat costs come from Holyrood&apos;s own expense files for 2024/25. We added up rent, council
            tax, bills, phone, insurance and deposits for each flat. 36 MSPs claimed rent. Their flats
            came to £623,696. Of that, £454,525 was rent. Hotels and meals are not in that total.
          </p>
          <p>
            The groups come from the MSP expenses rules. The East Kilbride and Scone miles come from a
            report by Holyrood&apos;s staff to the MSPs who run the Parliament, dated 10 September 2026
            (Paper 60). The hotel and flat sums come from
            Holyrood&apos;s own review in September 2025. The 83 voting days come from its vote records.
          </p>
          <p>
            Graham Simpson&apos;s words come from what was said in Holyrood on 11 November 2026. Collette
            Stevenson&apos;s home town is from Holyrood magazine. Kenneth Gibson&apos;s is from his own
            website. Home addresses are private, so other miles are from each seat&apos;s main town.
          </p>
        </div>
      </Expand>

      <Aside title="More on MSP expenses">
        <p>
          See the full{" "}
          <Link href="/blog/msp-expenses-scotland-investigation">MSP expenses investigation</Link>,
          or how{" "}
          <Link href="/blog/scottish-mps-london-homes-152-sitting-days">
            Scottish MPs billed for London homes for 152 sitting days
          </Link>
          .
        </p>
      </Aside>

      <PostCTA
        title="Search every MSP receipt"
        body="Look up any MSP's Edinburgh flat, hotels and bills, line by line."
        href="/mp-expenses-scotland/search?who=msp"
        cta="Search MSP receipts"
      />
    </Prose>
  );
}
