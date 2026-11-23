import Link from "@/components/IntentLink";
import { ExpenseMpCheck, ExpenseNextUp } from "@/components/ExpenseStoryRail";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written with the graeme-writing skill. Figures: IPSA's published claims
 * for 2024/25 and 2025/26, category "MP Travel" (the MP's own trips) and
 * "Staff Travel", journey type "London-constituency MP & Staff". IPSA
 * publishes one yearly total per type of ticket, not single trips.
 */

import {
  type PartyKey,
  QuickTake,
  Finding,
  Spotlight,
  RankList,
  Who,
  Tiles,
  PointList,
  Expand,
} from "@/components/ExpenseKit";

const FINDINGS = 5;
const mp = (slug: string) => `/representatives/mps/${slug}`;

const SHANKS = {
  name: "Michael Shanks",
  href: mp("rutherglen"),
  p: "Labour" as PartyKey,
  place: "Rutherglen · UK Energy Minister",
};
const SULLIVAN = {
  name: "Kirsteen Sullivan",
  href: mp("bathgate-and-linlithgow"),
  p: "Labour" as PartyKey,
  place: "Bathgate and Linlithgow",
};

/** Share of each MP's own London plane and train money that went on planes, 2025/26. */
const SHARE: { name: string; slug: string; seat: string; air: number; rail: number }[] = [
  { name: "Kirsteen Sullivan", slug: "bathgate-and-linlithgow", seat: "Bathgate and Linlithgow", air: 18342, rail: 0 },
  { name: "Michael Shanks", slug: "rutherglen", seat: "Rutherglen", air: 11753, rail: 955 },
  { name: "Martin Rhodes", slug: "glasgow-north", seat: "Glasgow North", air: 6276, rail: 6977 },
  { name: "Chris Murray", slug: "edinburgh-east-and-musselburgh", seat: "Edinburgh East and Musselburgh", air: 5376, rail: 6339 },
  { name: "John Grady", slug: "glasgow-east", seat: "Glasgow East", air: 2782, rail: 9270 },
  { name: "Euan Stainbank", slug: "falkirk", seat: "Falkirk", air: 1070, rail: 6695 },
  { name: "Tracy Gilbert", slug: "edinburgh-north-and-leith", seat: "Edinburgh North and Leith", air: 529, rail: 10481 },
];
const pct = (a: number, r: number) => Math.round((a / (a + r)) * 100);

export default function EnergyMinisterMichaelShanksFlightsRutherglen() {
  return (
    <Prose>
      <QuickTake
        items={[
          <>
            Michael Shanks is the UK&apos;s <strong>Energy Minister</strong>. In 2025/26, taxpayers
            paid £11,753 for his London flights and £955 for his trains.
          </>,
          <>
            His job is cutting the UK&apos;s carbon. His own department says a UK flight puts out more than{" "}
            <strong>six times</strong> the carbon of a train.
          </>,
          <>
            That&apos;s <strong>92%</strong> of his London travel money on planes. His own staff
            did the opposite: most of their money went on trains.
          </>,
          <>
            Bathgate and Linlithgow MP Kirsteen Sullivan put <strong>£18,342 on planes and £0 on trains</strong>.
            Every penny on flights.
          </>,
          <>
            Labour MPs in the same cities took the train. Tracy Gilbert in Leith spent £10,481 on trains
            and £529 on planes.
          </>,
        ]}
      />

      <ExpenseMpCheck slug="energy-minister-michael-shanks-flights-rutherglen" />

      <Spotlight
        person={SHANKS}
        kicker="His own London travel, 2025/26 · paid by taxpayers"
        amount="92%"
        headline="The Energy Minister flies. His staff take the train."
        lines={[
          { meta: "The MP's own trips", what: "Air travel", amount: "£11,752.87" },
          { meta: "The MP's own trips", what: "Rail", amount: "£955.04" },
          { meta: "His staff's trips", what: "Rail", amount: "£1,879.05" },
          { meta: "His staff's trips", what: "Air travel", amount: "£665.78" },
        ]}
      >
        <p>
          His job is the UK&apos;s move to clean power. Rutherglen is a few minutes by train from
          Glasgow Central, where trains leave for London all day.
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} of={FINDINGS} id="the-job">
        What the Energy Minister is there to do
      </Finding>
      <P>
        Michael Shanks has been an energy minister since July 2024. He works in the government
        department for Energy Security and Net Zero.
      </P>
      <P>
        Net zero is the UK&apos;s legal promise to stop adding to climate change by 2050. To get there,
        the UK has to cut the carbon it puts into the air. His part of that job is clean power: the
        plan to make all of the UK&apos;s electricity clean by 2030.
      </P>
      <P>
        His own department also writes the official carbon sums that UK businesses use. They say a UK
        flight puts out more than <strong>six times</strong> the carbon of a train, for each person, mile
        for mile.
      </P>
      <Tiles
        items={[
          { value: "6.5x", label: "Carbon from a UK flight compared with a train, per person, by his own department's figures", hot: true },
          { value: "2050", label: "The year the UK has promised to reach net zero" },
          { value: "92%", label: "His own London travel money spent on planes, 2025/26", hot: true },
        ]}
      />
      <P>
        So the minister whose job is cutting the UK&apos;s carbon picked the way of travelling his own
        department says is more than six times worse. And he put 92% of his London travel money
        on it.
      </P>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} of={FINDINGS} id="energy-minister">
        The Energy Minister&apos;s travel bill
      </Finding>
      <P>
        Every Scottish MP can claim for getting between home and Westminster. IPSA, the body that pays
        MPs&apos; expenses, publishes what each one spent on planes and trains in a year.
      </P>
      <P>
        Michael Shanks spent <strong>£11,753</strong> of your money on London flights in 2025/26, and{" "}
        <strong>£955</strong> on trains. The year before it was £7,138 on planes and £1,039 on trains.
      </P>
      <P>
        His staff made the same trip mostly by rail: <strong>£1,879 on trains</strong> and £666 on
        planes. So the people who work for him take the train. The minister whose job is clean power
        flies.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <ExpenseNextUp slug="energy-minister-michael-shanks-flights-rutherglen" />

      <Finding n={3} of={FINDINGS} id="sullivan">
        Bathgate and Linlithgow&apos;s MP: £0 on trains
      </Finding>
      <Spotlight
        person={SULLIVAN}
        kicker="Her own London travel, 2025/26 · paid by taxpayers"
        amount="100%"
        headline="£18,342 on planes. Not one train ticket."
        lines={[
          { meta: "The MP's own trips", what: "Air travel", amount: "£18,342.27" },
          { meta: "The MP's own trips", what: "Rail", amount: "£0.00" },
          { meta: "Her staff's trips", what: "Rail", amount: "£1,052.50" },
        ]}
      >
        <p>
          Linlithgow is about 20 minutes from Edinburgh Waverley by train. The year before, she put
          £15,190 on planes and £192 on trains.
        </p>
      </Spotlight>
      <P>
        Her staff spent £1,052 on London trains in 2025/26. She spent nothing.
      </P>
      <P>
        On 8 January 2025, in a debate in Parliament, she talked about getting people to make the
        &ldquo;shift from their cars to public transport&rdquo;. Her own London travel was all by
        plane.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} of={FINDINGS} id="neighbours">
        Their neighbours take the train
      </Finding>
      <P>
        This isn&apos;t about distance. Labour MPs from the same towns and cities make the same trip
        mostly by train. Here&apos;s how much of each MP&apos;s own London plane and train money went
        on planes in 2025/26.
      </P>

      <RankList
        max={100}
        rows={SHARE.map((r) => ({
          key: r.name,
          who: <Who face name={r.name} href={mp(r.slug)} p="Labour" note={r.seat} />,
          side: `£${r.air.toLocaleString("en-GB")} planes · £${r.rail.toLocaleString("en-GB")} trains`,
          value: pct(r.air, r.rail),
          label: `${pct(r.air, r.rail)}% planes`,
        }))}
      />

      <Tiles
        items={[
          { value: "100%", label: "Kirsteen Sullivan's London plane and train money spent on planes", hot: true },
          { value: "92%", label: "Michael Shanks, the UK Energy Minister", hot: true },
          { value: "5%", label: "Tracy Gilbert, Edinburgh North and Leith" },
        ]}
      />

      <P>
        If Tracy Gilbert can get from Leith to London by train, so can an MP 20 minutes up the line. If
        John Grady can do it from Glasgow East, so can the Energy Minister from Rutherglen.
      </P>

      {/* ------------------------------------------------------------ 5 */}
      <Finding n={5} of={FINDINGS} id="why-nobody-saw-it">
        Why nobody spotted this until now
      </Finding>
      <P>
        As far as we can find, this has never been reported. Not by a paper, not by a TV channel, not
        by anyone.
      </P>
      <P>
        That&apos;s not an accident. IPSA used to publish MPs&apos; travel claim by claim. It
        doesn&apos;t any more. Now each MP gets one yearly total for each kind of ticket, buried in a
        spreadsheet of <strong>59,503 lines</strong> for 2025/26 alone. There&apos;s no
        &ldquo;planes against trains&rdquo; table. You have to build it yourself.
      </P>
      <P>
        Most journalists don&apos;t have the hours to do that. We&apos;re not journalists. Scotland
        Counted goes through the public data line by line, for every Scottish MP, and puts the numbers
        side by side. That&apos;s how this turned up.
      </P>

      <PointList
        items={[
          {
            key: "trips",
            title: "Does this count trips?",
            children: (
              <>No. IPSA only gives a yearly total for each type of ticket, so we compare money, not journeys.</>
            ),
          },
          {
            key: "minister",
            title: "Is any of this his minister travel?",
            children: (
              <>No. These are his trips between home and Westminster, paid through IPSA. Government trips are paid by his department.</>
            ),
          },
          {
            key: "staff",
            title: "Are staff or family trips included?",
            children: <>No. Only the MP&apos;s own trips. We show staff trips separately.</>,
          },
        ]}
      />

      <Expand summary="How we worked this out">
        <div className="space-y-3 text-[16px] leading-[1.6] text-[var(--ink-2)]">
          <p>
            Every figure comes from IPSA&apos;s published claims for 2024/25 and 2025/26. We used the
            MP&apos;s own travel only (IPSA&apos;s &ldquo;MP Travel&rdquo;) for trips between London
            and home. Staff trips come from &ldquo;Staff Travel&rdquo;, for the same journeys.
          </p>
          <p>
            The share is the plane money divided by plane plus train money. Taxis, parking and car
            miles are left out.
          </p>
          <p>
            The carbon figures are the UK government&apos;s 2025 conversion factors, from his own
            department. A UK flight is 0.229 kg of carbon dioxide (and the gases like it) per person per
            kilometre, counting the extra warming planes cause high up. A national rail trip is 0.035.
            That is about 6.5 times more for the flight.
          </p>
        </div>
      </Expand>

      <Aside title="More on MPs' travel">
        <p>
          See{" "}
          <Link href="/blog/scottish-mps-london-homes-152-sitting-days">
            what it cost to house and fly Scottish MPs to London
          </Link>
          , or{" "}
          <Link href="/mp-expenses-scotland">every Scottish MP&apos;s expenses</Link>.
        </p>
      </Aside>

      <PostCTA
        title="Check your own MP"
        body="Search every Scottish MP's claims, including flights and trains."
        href="/mp-expenses-scotland/search"
        cta="Search MP receipts"
      />
    </Prose>
  );
}
