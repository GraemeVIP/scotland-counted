import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, Aside, PostCTA } from "@/components/Prose";
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
  CaseCard,
  Tiles,
  PointList,
  Expand,
  Spotlight,
  PartyList,
} from "@/components/ExpenseKit";

/*
 * The freebies: gifts, VIP tickets, paid trips abroad and donations that
 * Scotland's 57 MPs declared on the UK Parliament Register of Interests
 * (src/lib/data/mpInterests.json, checked 21 November 2026; Harriet Cross
 * rechecked on Parliament's interests API on 22 November 2026: no entries).
 * The two child vote finding also uses IPSA's 2025/26 annual totals for the
 * five MPs named. Expense claims (hotels, council tax, family travel, taxis,
 * parking) now live in the scandal roundup and the hub, linked below.
 * Written in Graeme's voice (graeme-writing skill).
 */

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const FINDINGS = 5;

const person = (name: string, slug: string, p: PartyKey, place: string): CasePerson => ({
  name,
  href: mp(slug),
  p,
  place,
});

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const NO_VOTERS: CasePerson[] = [
  person("Andrew Bowie", "west-aberdeenshire-and-kincardine", "Conservative", "West Aberdeenshire and Kincardine"),
  person("John Lamont", "berwickshire-roxburgh-and-selkirk", "Conservative", "Berwickshire, Roxburgh and Selkirk"),
  person("David Mundell", "dumfriesshire-clydesdale-and-tweeddale", "Conservative", "Dumfriesshire, Clydesdale and Tweeddale"),
  person("John Cooper", "dumfries-and-galloway", "Conservative", "Dumfries and Galloway"),
  person("Harriet Cross", "gordon-and-buchan", "Conservative", "Gordon and Buchan"),
];

const VIP_TICKETS: { name: string; slug: string; p: PartyKey; value: number; detail: string }[] = [
  { name: "Pamela Nash", slug: "motherwell-wishaw-and-carluke", p: "Labour", value: 1544, detail: "Two Edinburgh Military Tattoo tickets. Then drinks on the Royal Yacht Britannia. From the Royal Navy." },
  { name: "Brendan O'Hara", slug: "argyll-bute-and-south-lochaber", p: "SNP", value: 1525, detail: "Spurs v Dortmund, and the League Cup Final at Hampden. Food and drink too." },
  { name: "Christine Jardine", slug: "edinburgh-west", p: "Lib Dem", value: 1298, detail: "Two Scotland rugby games, with food and drink." },
  { name: "Gregor Poynton", slug: "livingston", p: "Labour", value: 1110, detail: "Lord's cricket, and the Carabao Cup Final at Wembley." },
  { name: "Andrew Bowie", slug: "west-aberdeenshire-and-kincardine", p: "Conservative", value: 1100, detail: "Two British Grand Prix tickets at Silverstone, with food and drink." },
  { name: "Pete Wishart", slug: "perth-and-kinross-shire", p: "SNP", value: 984, detail: "A seat at the Ivor Novello music awards, with food and drink." },
  { name: "David Mundell", slug: "dumfriesshire-clydesdale-and-tweeddale", p: "Conservative", value: 925, detail: "Tennis tickets. One was for Wimbledon Centre Court." },
];

const TRIPS: { key: string; name: string; slug: string; p: PartyKey; value: number; detail: string }[] = [
  { key: "grady", name: "John Grady", slug: "glasgow-east", p: "Labour", value: 7000, detail: "Qatar. Paid by Qatar's foreign ministry." },
  { key: "stewart", name: "Elaine Stewart", slug: "ayr-carrick-and-cumnock", p: "Labour", value: 6421, detail: "China. Paid by the Great Britain China Centre." },
  { key: "ward", name: "Melanie Ward", slug: "cowdenbeath-and-kirkcaldy", p: "Labour", value: 5957, detail: "Qatar. Paid by the Doha Forum." },
  { key: "downie-tw", name: "Graeme Downie", slug: "dunfermline-and-dollar", p: "Labour", value: 5669, detail: "Taiwan. Paid by Taiwan's foreign ministry." },
  { key: "gemmell", name: "Alan Gemmell", slug: "central-ayrshire", p: "Labour", value: 4763, detail: "China. Paid by the Great Britain China Centre." },
  { key: "downie-us", name: "Graeme Downie", slug: "dunfermline-and-dollar", p: "Labour", value: 4077, detail: "The US. Paid by the Coalition for Global Prosperity." },
];

const DONATIONS: { name: string; slug: string; p: PartyKey; value: number; detail: string }[] = [
  { name: "Lillian Jones", slug: "kilmarnock-and-loudoun", p: "Labour", value: 30064, detail: "Mostly £27,564 of staff and help from Best for Britain. It is for a trade group she chairs." },
  { name: "Dr Zubir Ahmed", slug: "glasgow-south-west", p: "Labour", value: 30000, detail: "One gift, from Francesca Sainsbury Perrin." },
  { name: "Wendy Chamberlain", slug: "north-east-fife", p: "Lib Dem", value: 27000, detail: "£15,000 from Claire Enders. £12,000 from Patrick Foster." },
  { name: "David Mundell", slug: "dumfriesshire-clydesdale-and-tweeddale", p: "Conservative", value: 22100, detail: "Of this, £11,100 is free adviser time. The Coalition for Global Prosperity pays." },
  { name: "Andrew Bowie", slug: "west-aberdeenshire-and-kincardine", p: "Conservative", value: 20000, detail: "From Alasdair Locke, to pay one of his staff." },
  { name: "Chris Murray", slug: "edinburgh-east-and-musselburgh", p: "Labour", value: 19500, detail: "A policy adviser. Paid by a migration think tank, RAMP." },
  { name: "John Cooper", slug: "dumfries-and-galloway", p: "Conservative", value: 16500, detail: "£7,500 of it came from Adam Keswick." },
];

const PARTY_TALLY: { p: PartyKey; name: string; mps: string; detail: string }[] = [
  { p: "Labour", name: "Scottish Labour", mps: "37 MPs", detail: "£169,931 in all. £105,589 from donors, in 10 gifts. £57,288 for 19 trips abroad. £7,054 in 12 other gifts." },
  { p: "Conservative", name: "Scottish Tories", mps: "6 MPs", detail: "£80,001 in all. £71,100 from donors, in 10 gifts. £6,876 for 4 trips abroad. £2,025 in 3 other gifts." },
  { p: "Lib Dem", name: "Scottish Lib Dems", mps: "6 MPs", detail: "£35,061 in all. £28,553 from donors, in 3 gifts. £4,860 for 3 trips abroad. £1,648 in 3 other gifts." },
  { p: "SNP", name: "SNP", mps: "8 MPs", detail: "£11,902 in all. Nothing from donors. £7,533 for 7 trips abroad. £4,369 in 4 gifts." },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function Post() {
  return (
    <Prose>
      <Lead>
        MPs were paid £93,904 in 2025/26. That puts them in the top 5% of earners. On top, they get
        free stuff. F1 tickets. VIP boxes. Trips to Qatar. Big gifts of cash. Here are the names.
      </Lead>

      <QuickTake
        items={[
          <>
            <Link href={mp("angus-and-perthshire-glens")}>Dave Doogan</Link> got two free F1 tickets.
            They were worth <strong>£1,860</strong>.
          </>,
          <>
            <strong>5 Scottish Tory MPs</strong> voted No to ending the two child limit. They claimed{" "}
            <strong>£523,512</strong> in expenses.
          </>,
          <>
            MPs from <strong>all four big parties</strong> took free VIP tickets. F1, rugby, football,
            even Wimbledon.
          </>,
          <>
            <strong>33 trips abroad</strong>, paid by others. Worth <strong>£76,557</strong>. Qatar,
            China and Taiwan are on the list.
          </>,
          <>
            <Link href={mp("glasgow-south-west")}>Dr Zubir Ahmed</Link> got <strong>£30,000</strong>{" "}
            from one donor.
          </>,
        ]}
      />

      <Aside title="What is the Register of Interests?">
        <p>
          It is the public list where MPs must show what they get from outside. Gifts. Free
          tickets. Trips paid by others. Cash from donors.
        </p>
        <p>
          None of it comes from you. Firms, rich donors and other countries pay. So ask what they
          want back.
        </p>
      </Aside>

      <Tiles
        items={[
          { value: "£205,242", label: "23 donations" },
          { value: "£76,557", label: "33 paid trips abroad" },
          { value: "£15,096", label: "22 gifts and VIP tickets" },
        ]}
      />

      <P>
        That is <strong>£296,895</strong> in all, for Scotland&apos;s 57 MPs. We checked the list on
        21 November 2026.
      </P>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} of={FINDINGS} id="freebies">
        F1, rugby and football: free VIP tickets
      </Finding>
      <P>Most fans save up for their own ticket. Some MPs get theirs free. Food and drink come too.</P>

      <Spotlight
        person={person("Dave Doogan", "angus-and-perthshire-glens", "SNP", "Angus and Perthshire Glens")}
        kicker="4 July 2026 · Register of Interests"
        amount="£1,860"
        headline="Two free F1 tickets at Silverstone, with food and drink."
      >
        <p>
          A gift from Silverstone Circuit. It was for the Sprint Race. No Scottish MP has a bigger
          single gift on the list.
        </p>
      </Spotlight>

      <ChartFrame kicker="Register of Interests" title="More free VIP tickets">
        <RankList
          rows={VIP_TICKETS.map((t) => ({
            key: t.slug,
            who: <Who face name={t.name} href={mp(t.slug)} p={t.p} />,
            value: t.value,
            label: gbp(t.value, false),
            colour: PARTY[t.p].colour,
            detail: t.detail,
          }))}
        />
      </ChartFrame>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} of={FINDINGS} id="voting-against-help">
        Voting against child poverty support while claiming £523,512 in expenses and F1 freebies
      </Finding>
      <P>
        In February 2026, MPs voted on ending the{" "}
        <Link href="/scottish-child-payment">two child limit on Universal Credit</Link>. That rule
        stops poor families getting £3,514 a year for a third or later child.
      </P>
      <P>Five Scottish Tory MPs voted No.</P>

      <CaseCard kicker="Voted No to ending the two child limit" figure="£523,512" people={NO_VOTERS}>
        <p>
          <strong>Their 2025/26 expenses, not counting staff</strong>
        </p>
        <p>
          That is on top of their £93,904 pay. We checked IPSA&apos;s files for those five MPs.
          Between them they claimed £523,512.
        </p>
      </CaseCard>

      <PointList
        items={[
          {
            key: "homes",
            title: "£147,964 for their own London flat rents",
            children: <>Plus £7,218 for council tax on second homes. And £4,185 to heat and power them.</>,
          },
          {
            key: "freebies",
            title: "£80,001 in cash, trips and VIP gifts",
            children: (
              <>
                <Link href={mp("west-aberdeenshire-and-kincardine")}>Andrew Bowie</Link> got £20,000
                from businessman Alasdair Locke. He also got £1,100 of F1 tickets.{" "}
                <Link href={mp("dumfriesshire-clydesdale-and-tweeddale")}>David Mundell</Link> got
                £11,100 of free adviser time. The Coalition for Global Prosperity paid.{" "}
                <Link href={mp("dumfries-and-galloway")}>John Cooper</Link> got £16,500 from donors.
              </>
            ),
          },
        ]}
      />

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} of={FINDINGS} id="foreign-trips">
        Qatar, China and Taiwan: trips paid for by someone else
      </Finding>
      <P>
        Scottish MPs took <strong>33 trips abroad</strong> paid by others. They were worth{" "}
        <strong>£76,557</strong>. Some were paid by other countries. Here are the biggest.
      </P>

      <ChartFrame kicker="Register of Interests" title="The biggest paid trips abroad">
        <RankList
          rows={TRIPS.map((t) => ({
            key: t.key,
            who: <Who face name={t.name} href={mp(t.slug)} p={t.p} />,
            value: t.value,
            label: gbp(t.value, false),
            colour: PARTY[t.p].colour,
            detail: t.detail,
          }))}
        />
      </ChartFrame>

      <PointList
        items={[
          {
            key: "downie",
            title: <Who face name="Graeme Downie" href={mp("dunfermline-and-dollar")} p="Labour" note="£11,882" />,
            children: <>The most of any Scottish MP. Taiwan, the US and Spain.</>,
          },
          {
            key: "gemmell",
            title: <Who face name="Alan Gemmell" href={mp("central-ayrshire")} p="Labour" note="£11,184" />,
            children: <>China, Angola and Syria.</>,
          },
          {
            key: "ward",
            title: <Who face name="Melanie Ward" href={mp("cowdenbeath-and-kirkcaldy")} p="Labour" note="£8,159" />,
            children: <>Qatar, paid by the Doha Forum. And a £2,202 trip to Syria.</>,
          },
        ]}
      />

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} of={FINDINGS} id="donations">
        £205,242 from donors, and who got the most
      </Finding>
      <P>
        A donation can be cash. Or it can be staff that someone else pays for. Either way, the MP
        gets help for free. Not one SNP MP listed a donation.
      </P>

      <ChartFrame kicker="Register of Interests" title="The biggest donations, by MP">
        <RankList
          rows={DONATIONS.map((d) => ({
            key: d.slug,
            who: <Who face name={d.name} href={mp(d.slug)} p={d.p} />,
            value: d.value,
            label: gbp(d.value, false),
            colour: PARTY[d.p].colour,
            detail: d.detail,
          }))}
        />
      </ChartFrame>

      {/* ------------------------------------------------------------ 5 */}
      <Finding n={5} of={FINDINGS} id="party-tally">
        The party tally: Labour took 57% of the freebies and 75% of paid trips abroad
      </Finding>
      <P>
        Scottish Labour won 37 of Scotland&apos;s 57 seats (65%). It said it would clean up
        Westminster. Yet Labour MPs took <strong>£169,931 of the £296,895</strong> (57%). They took{" "}
        <strong>75% of all paid trips abroad</strong>. That is £57,288, to places like Qatar, China,
        Taiwan and Syria.
      </P>
      <P>
        Labour also has <strong>both MPs married to lobbyists</strong>.{" "}
        <Link href={mp("east-kilbride-and-strathaven")}>Joani Reid</Link>&apos;s husband is a
        lobbyist. Companies House lists him as the only director of Earthcott Ltd. He owns over 75%
        of it. That PR firm gave her £2,400 of free media training.{" "}
        <Link href={mp("paisley-and-renfrewshire-south")}>Johanna Baxter</Link>&apos;s husband runs a
        lobbying and PR firm, SEC Newgate UK. He is its Executive Chairman.
      </P>

      <PartyList
        items={PARTY_TALLY.map((t) => ({
          p: t.p,
          key: t.p,
          children: (
            <>
              <strong>{t.name}</strong> ({t.mps}): {t.detail}
            </>
          ),
        }))}
      />
      <p className="ui mt-3 text-[14px] text-[var(--ink-2)]">
        Source: the Register of Interests, checked 21 November 2026.
      </p>

      <H2 id="expense-claims">The expense claims</H2>
      <P>
        Freebies are paid by others. Expenses are paid by you. For those, read{" "}
        <Link href="/blog/worst-scottish-mp-expenses">the Scottish MP expenses scandal</Link>. It has
        the £23,437 power bill, the £3,090 broadband and the Christmas lunch. It also has{" "}
        <Link href="/blog/worst-scottish-mp-expenses#hotel-nights">£37,359 of London hotel nights</Link>
        . For council tax on second homes, family travel, taxis and parking, see{" "}
        <Link href="/mp-expenses-scotland">all 57 MPs ranked</Link>.
      </P>

      <H2 id="ask-your-mp">Put it to your own MP</H2>
      <P>
        Gifts sit on the Register of Interests. Expenses sit in IPSA&apos;s files. The two are kept
        apart, and both are hard to search. So few voters ever join them up.
      </P>
      <P>
        So we put it all in one place. Each Scottish MP has a{" "}
        <Link href="/representatives">profile page</Link>. It shows their gifts, trips, expenses and
        votes. It has a one click email asking them to explain.
      </P>

      <PostCTA
        title="Check your own MP's gifts and expenses, and ask them to explain"
        body="Type your postcode. See what your MP got and what they claimed. Then send them a ready made email."
        href="/mp-expenses-scotland"
        cta="See all 57 MPs ranked"
      />

      <Expand summary="For journalists and researchers: where this data comes from">
        <p className="text-[16px] leading-[1.6] text-[var(--ink-2)]">
          Gifts, trips and donations come from the UK Parliament Register of Interests. It has 210
          entries for all 57 Scottish MPs. We checked it on 21 November 2026. The expense totals in
          Finding 2 come from IPSA&apos;s 2025/26 files. You are welcome to quote it with a link to{" "}
          <Link href="/mp-expenses-scotland">scotlandcounted.org.uk/mp-expenses-scotland</Link>.
        </p>
      </Expand>
    </Prose>
  );
}
