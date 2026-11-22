import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, Aside, PostCTA } from "@/components/Prose";
import {
  type PartyKey,
  type CasePerson,
  PARTY,
  gbp,
  Dot,
  Who,
  QuickTake,
  Finding,
  ChartFrame,
  RankList,
  CaseCard,
  Tiles,
  PointList,
  Expand,
} from "@/components/ExpenseKit";

/*
 * Figures: IPSA's 2025/26 annual publication and its 6,101 Scottish claim
 * lines, plus the UK Parliament Register of Interests (checked 21 November
 * 2026). Two of Scotland's 57 MPs have no claims in IPSA's 2025/26 file, so the
 * 2025/26 totals cover 55 MPs. Quoted descriptions are IPSA's exact wording.
 * Party and per MP totals: IPSA's 2025/26 annual totals as stored in
 * src/lib/data/mpInterests.json.
 */

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const FINDINGS = 8;

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
  { name: "Dave Doogan", slug: "angus-and-perthshire-glens", p: "SNP", value: 1860, detail: "Silverstone Formula 1 VIP tickets" },
  { name: "Brendan O'Hara", slug: "argyll-bute-and-south-lochaber", p: "SNP", value: 1525, detail: "Champions League and Hampden VIP boxes" },
  { name: "Gregor Poynton", slug: "livingston", p: "Labour", value: 1110, detail: "Lord's Cricket Ground and the Carabao Cup Final at Wembley" },
  { name: "Andrew Bowie", slug: "west-aberdeenshire-and-kincardine", p: "Conservative", value: 1100, detail: "Silverstone British Grand Prix VIP tickets" },
  { name: "Harriet Cross", slug: "gordon-and-buchan", p: "Conservative", value: 925, detail: "Wentworth PGA golf VIP ticket" },
];

const COUNCIL_TAX: { name: string; slug: string; p: PartyKey; seat: string; value: number }[] = [
  { name: "Douglas Alexander", slug: "lothian-east", p: "Labour", seat: "Lothian East", value: 4093.21 },
  { name: "Gregor Poynton", slug: "livingston", p: "Labour", seat: "Livingston", value: 3629.54 },
  { name: "Melanie Ward", slug: "cowdenbeath-and-kirkcaldy", p: "Labour", seat: "Cowdenbeath and Kirkcaldy", value: 3302.72 },
  { name: "Richard Baker", slug: "glenrothes-and-mid-fife", p: "Labour", seat: "Glenrothes and Mid Fife", value: 2938.52 },
];

const PARTY_TALLY: {
  p: PartyKey;
  name: string;
  mps: string;
  total: number;
  perMp: number;
  detail: string;
}[] = [
  {
    p: "SNP",
    name: "SNP",
    mps: "8 MPs (7 with 2025/26 claims)",
    total: 778624,
    perMp: 111232,
    detail: "£778,624 in all. Second home council tax £7,761. Family travel £19,749, parking £17,033. Gifts, trips and donations £11,902.",
  },
  {
    p: "Conservative",
    name: "Scottish Conservatives",
    mps: "6 MPs (5 with 2025/26 claims)",
    total: 523512,
    perMp: 104702,
    detail: "£523,512 in all. Second home council tax £7,218. Parking £10,708. Gifts, trips and donations £80,001.",
  },
  {
    p: "Lib Dem",
    name: "Scottish Liberal Democrats",
    mps: "6 MPs",
    total: 564881,
    perMp: 94147,
    detail: "£564,881 in all. Second home council tax £7,437. Family travel £8,654, taxis £5,819. Gifts, trips and donations £35,061.",
  },
  {
    p: "Labour",
    name: "Scottish Labour",
    mps: "37 MPs",
    total: 3343933,
    perMp: 90377,
    detail:
      "£3,343,933 in all. Second home council tax £59,231 (73% of Scotland's total). London hotels £44,605 (98%, mostly one MP). Gifts, trips and donations £169,931.",
  },
];

const TOP_10: {
  name: string;
  slug: string;
  p: PartyKey;
  seat: string;
  value: number;
  detail: string;
}[] = [
  { name: "Graeme Downie", slug: "dunfermline-and-dollar", p: "Labour", seat: "Dunfermline and Dollar", value: 151953.9, detail: "£41,435 flat rent, £29,820 flights" },
  { name: "Chris Law", slug: "dundee-central", p: "SNP", seat: "Dundee Central", value: 129065.55, detail: "£28,200 flat rent, £6,292 parking" },
  { name: "Dave Doogan", slug: "angus-and-perthshire-glens", p: "SNP", seat: "Angus and Perthshire Glens", value: 127847.3, detail: "£27,600 flat rent, £26,217 flights" },
  { name: "Alistair Carmichael", slug: "orkney-and-shetland", p: "Lib Dem", seat: "Orkney and Shetland", value: 124028.74, detail: "£35,437 flights (most in Scotland)" },
  { name: "Kirsty Blackman", slug: "aberdeen-north", p: "SNP", seat: "Aberdeen North", value: 121470.95, detail: "£39,951 flat rent, £27,472 flights" },
  { name: "Andrew Bowie", slug: "west-aberdeenshire-and-kincardine", p: "Conservative", seat: "West Aberdeenshire and Kincardine", value: 121470.92, detail: "3p less than Kirsty Blackman. £32,480 flat rent, £33,100 flights" },
  { name: "Gregor Poynton", slug: "livingston", p: "Labour", seat: "Livingston", value: 115007.84, detail: "£24,291 flights, £5,059 taxis" },
  { name: "Brendan O'Hara", slug: "argyll-bute-and-south-lochaber", p: "SNP", seat: "Argyll, Bute and South Lochaber", value: 114984.88, detail: "£29,322 flat rent, £3,109 parking" },
  { name: "Dr Zubir Ahmed", slug: "glasgow-south-west", p: "Labour", seat: "Glasgow South West", value: 111044.9, detail: "£37,359 London hotels" },
  { name: "Melanie Ward", slug: "cowdenbeath-and-kirkcaldy", p: "Labour", seat: "Cowdenbeath and Kirkcaldy", value: 101035.36, detail: "£19,140 flat rent, £7,932 family travel" },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function Post() {
  return (
    <Prose>
      <Lead>
        MPs were paid £93,904 in 2025/26. On top, Scottish MPs billed you for council tax on their
        second homes, hotels, taxis and family flights. Here are the names.
      </Lead>

      <QuickTake
        items={[
          <>
            <Link href={mp("glasgow-south-west")}>Dr Zubir Ahmed</Link> billed{" "}
            <strong>£37,359</strong> for London hotels. A full time minimum wage worker takes home
            about £20,850 a year.
          </>,
          <>
            <strong>5 Scottish Conservative MPs</strong> voted No to scrapping the two child benefit
            limit. Their own claims were about <strong>10% above</strong> the Scottish average.
          </>,
          <>
            MPs from <strong>three parties</strong> took free VIP tickets, from Silverstone F1 to
            Hampden.
          </>,
          <>
            <strong>47 MPs</strong> billed <strong>£81,647</strong> for council tax on their second
            homes.
          </>,
          <>
            <Link href={mp("dundee-central")}>Chris Law</Link> billed <strong>£6,292</strong> to
            park his car. That is £121 every week.
          </>,
        ]}
      />

      <Aside title="What is an MP's &quot;second home&quot;?">
        <p>
          MPs work in two places: London and their constituency (the area that elects them). So
          IPSA (the body that pays MPs&apos; expenses) pays for a second home in one of them.
        </p>
        <p>
          Even when the MP owns that home and claims £0 rent, IPSA can still pay its council tax,
          energy, insurance and broadband.
        </p>
      </Aside>

      <Tiles
        items={[
          { value: "£5.21m", label: "Billed by Scottish MPs for their own costs in 2025/26. This is our headline figure.", hot: true },
          { value: "£13.11m", label: "Paid for their staff wages on top (£18.32m with staff)" },
          { value: "£296,895", label: "Gifts, trips and donations declared. Paid by donors, not by you" },
        ]}
      />

      <P>
        All figures are for the 2025/26 budget year. Two of Scotland&apos;s 57 MPs have no claims
        in IPSA&apos;s 2025/26 file, so these totals cover 55 MPs.
      </P>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} of={FINDINGS} id="flats-and-hotels">
        £37,359 for London hotels and a £3,500 a month flat
      </Finding>

      <CaseCard figure="£37,359" people={[person("Dr Zubir Ahmed", "glasgow-south-west", "Labour", "Glasgow South West")]}>
        <p>
          <strong>295 nights in London hotels, about £127 a night</strong>
        </p>
        <p>
          He claimed no London rent. Most of the bills are month long bookings of a flat, which IPSA
          files as hotels (<Link href="/mp-expenses-scotland/receipts#hotel-nights">see every
          claim</Link>).
        </p>
      </CaseCard>

      <Tiles
        items={[
          { value: "£20,850", label: "What a full time minimum wage worker takes home in a year, after tax" },
          { value: "£37,359", label: "Dr Ahmed's London hotel bill for one year", hot: true },
        ]}
      />

      <CaseCard figure="£42,000" people={[person("John Grady", "glasgow-east", "Labour", "Glasgow East")]}>
        <p>
          <strong>The maximum London rent: £3,500 every month</strong>
        </p>
        <p>That is more than triple a typical Glasgow private rent.</p>
      </CaseCard>

      <P>
        Across Scotland, you paid <strong>£1.38m</strong> for MPs&apos; second home rent. That is
        about £25,000 for each of the 55 MPs.
      </P>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} of={FINDINGS} id="voting-against-help">
        How five MPs voted on the two child limit, and what they claimed
      </Finding>
      <P>
        In February 2026, MPs voted on scrapping the{" "}
        <Link href="/scottish-child-payment">two child benefit limit on Universal Credit</Link>. The
        limit stops low income families getting £3,514 a year for a third child. Five Scottish
        Conservative MPs voted No.
      </P>

      <CaseCard kicker="Voted No · their 2025/26 claims, not counting staff" figure="£523,512" people={NO_VOTERS}>
        <p>
          That is about <strong>£104,700 each</strong>. The average for all 55 Scottish MPs was
          about £94,700. So theirs was about 10% higher.
        </p>
        <p>
          It includes £147,964 for London flat rent and £7,218 for second home council tax. All
          within IPSA&apos;s rules.
        </p>
      </CaseCard>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} of={FINDINGS} id="freebies">
        F1, golf and football: free VIP tickets
      </Finding>
      <P>
        MPs must list gifts on the Register of Financial Interests (the public list of their outside
        money). These are paid by firms and donors, not by you. The biggest VIP tickets:
      </P>

      <ChartFrame kicker="Register of Interests · 2025/26" title="Free VIP tickets declared by Scottish MPs">
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

      <Tiles
        items={[
          { value: "£205,242", label: "23 private donations" },
          { value: "£76,557", label: "33 paid trips abroad, including Qatar, China and Taiwan" },
          { value: "£15,096", label: "22 gifts and VIP packages" },
        ]}
      />

      <Expand summary="The biggest donations and trips, by name">
        <PointList
          items={[
            {
              key: "cross",
              title: <Who face name="Harriet Cross" href={mp("gordon-and-buchan")} p="Conservative" note="£40,000" />,
              children: <>Political donations.</>,
            },
            {
              key: "ahmed",
              title: <Who face name="Dr Zubir Ahmed" href={mp("glasgow-south-west")} p="Labour" note="£30,000" />,
              children: <>A donation from Francesca Sainsbury Perrin.</>,
            },
            {
              key: "bowie",
              title: <Who face name="Andrew Bowie" href={mp("west-aberdeenshire-and-kincardine")} p="Conservative" note="£20,000" />,
              children: <>A donation from businessman Alasdair Locke.</>,
            },
            {
              key: "downie",
              title: <Who face name="Graeme Downie" href={mp("dunfermline-and-dollar")} p="Labour" note="£11,882" />,
              children: <>Paid trips to Taiwan, the US and Spain.</>,
            },
            {
              key: "mundell",
              title: <Who face name="David Mundell" href={mp("dumfriesshire-clydesdale-and-tweeddale")} p="Conservative" note="£11,100" />,
              children: <>From the Coalition for Global Prosperity.</>,
            },
            {
              key: "ward",
              title: <Who face name="Melanie Ward" href={mp("cowdenbeath-and-kirkcaldy")} p="Labour" note="£8,159" />,
              children: <>A £5,957 trip to Qatar, paid by the Doha Forum, and a £2,202 trip to Syria.</>,
            },
            {
              key: "grady",
              title: <Who face name="John Grady" href={mp("glasgow-east")} p="Labour" note="£7,000" />,
              children: <>A trip to Qatar, paid for by Qatar&apos;s foreign ministry.</>,
            },
          ]}
        />
      </Expand>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} of={FINDINGS} id="second-home-bills">
        £81,647 for council tax on second homes
      </Finding>

      <CaseCard figure="£4,093" people={[person("Douglas Alexander", "lothian-east", "Labour", "Lothian East")]}>
        <p>
          <strong>The highest second home council tax in Scotland, and £0 rent</strong>
        </p>
        <p>He declares co-owning homes in East Lothian and Argyll.</p>
      </CaseCard>

      <ChartFrame kicker="IPSA 2025/26" title="Top 4 for second home council tax">
        <RankList
          rows={COUNCIL_TAX.map((r) => ({
            key: r.slug,
            who: <Who face name={r.name} href={mp(r.slug)} p={r.p} />,
            side: r.seat,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
          }))}
        />
      </ChartFrame>

      <P>
        Energy and water are on top: 38 MPs billed £39,218 for their second homes. The most was{" "}
        <Link href={mp("inverness-skye-and-west-ross-shire")}>Angus MacDonald</Link>, at £3,314.
      </P>

      {/* ------------------------------------------------------------ 5 */}
      <Finding n={5} of={FINDINGS} id="family-parking-taxis">
        £6,292 to park, £5,059 on taxis, £7,932 for family travel
      </Finding>

      <PointList
        items={[
          {
            key: "law",
            title: <Who face name="Chris Law" href={mp("dundee-central")} p="SNP" note="£6,292 parking" />,
            children: <>The most in Scotland. That is £121 every week, at airports and stations.</>,
          },
          {
            key: "poynton",
            title: <Who face name="Gregor Poynton" href={mp("livingston")} p="Labour" note="£5,059 taxis" />,
            children: <>The most in Scotland. Nearly £100 a week on cabs.</>,
          },
          {
            key: "ward",
            title: <Who face name="Melanie Ward" href={mp("cowdenbeath-and-kirkcaldy")} p="Labour" note="£7,932 family travel" />,
            children: <>The most in Scotland. £7,607 of it was family flights.</>,
          },
        ]}
      />

      <Tiles
        items={[
          { value: "£89,111", label: "Family travel, 35 MPs" },
          { value: "£58,237", label: "Car parking, 35 MPs" },
          { value: "£39,254", label: "MPs' own taxis, 46 MPs" },
        ]}
      />

      {/* ------------------------------------------------------------ 6 */}
      <Finding n={6} of={FINDINGS} id="party-tally">
        Every party, side by side
      </Finding>
      <P>
        Per MP, the SNP claimed the most. In total, Labour claimed the most: it has 37 of
        Scotland&apos;s 57 MPs. Bars show the average per MP, not counting staff.
      </P>

      <ChartFrame
        kicker="IPSA 2025/26 & Register of Interests · By party"
        title="Average claimed per MP, by party"
        caption="Source: IPSA 2025/26 expense files and the UK Parliament Register of Interests (checked 21 November 2026)."
      >
        <RankList
          rows={PARTY_TALLY.map((t) => ({
            key: t.p,
            who: (
              <span className="ui flex items-center gap-2 font-[620] text-[var(--ink)]">
                <Dot p={t.p} />
                {t.name}
              </span>
            ),
            side: t.mps,
            value: t.perMp,
            label: gbp(t.perMp, false),
            colour: PARTY[t.p].colour,
            detail: t.detail,
          }))}
        />
      </ChartFrame>

      {/* ------------------------------------------------------------ 7 */}
      <Finding n={7} of={FINDINGS} id="buried-receipts">
        More receipts: PR firms, European hotels and TV licences
      </Finding>

      <PointList
        items={[
          {
            key: "pr",
            title: "£40,449 on outside PR and media firms",
            children: (
              <>
                MPs already get about £255,000 for staff. Still,{" "}
                <Link href={mp("central-ayrshire")}>Alan Gemmell</Link> paid £1,500 for a website and{" "}
                <Link href={mp("rutherglen")}>Michael Shanks</Link> paid £1,100 for social media
                templates.
              </>
            ),
          },
          {
            key: "europe",
            title: "£9,194 on hotels in Europe, 12 MPs",
            children: (
              <>
                <Link href={mp("dundee-central")}>Chris Law</Link> £2,822,{" "}
                <Link href={mp("paisley-and-renfrewshire-south")}>Johanna Baxter</Link> £1,004,{" "}
                <Link href={mp("argyll-bute-and-south-lochaber")}>Brendan O&apos;Hara</Link> £822.
              </>
            ),
          },
          {
            key: "papers",
            title: "£9,160 on newspapers and £3,863 on TV licences",
            children: (
              <>
                That is 32 TV licence claims in 2025/26 alone. From 2022 to 2026 it was £10,754 (
                <Link href="/blog/scottish-mps-tv-licence-expenses">see all 29 MPs</Link>).
              </>
            ),
          },
        ]}
      />

      <P>
        For a £23,437 power bill, a £3,090 broadband setup and a £3,000 speech coach, see{" "}
        <Link href="/blog/worst-scottish-mp-expenses">the worst Scottish MP expenses</Link>. The
        power bill was paid on 19 May 2026: £20,384.74 from the 2025/26 budget and £3,052.21 from
        2026/27.
      </P>

      <Expand summary="17 double claims or overspends that MPs paid back">
        <p className="mb-4 text-[16px] leading-[1.6] text-[var(--ink-2)]">
          IPSA lists 17 cases where Scottish MPs claimed twice or went over budget, then repaid it.
          The biggest:
        </p>
        <PointList
          items={[
            {
              key: "crichton",
              title: <Who face name="Torcuil Crichton" href={mp("na-h-eileanan-an-iar")} p="Labour" note="£1,746 repaid" />,
              children: <>£1,476 and £270, including a double claim for Legionella testing.</>,
            },
            {
              key: "ward-rep",
              title: <Who face name="Melanie Ward" href={mp("cowdenbeath-and-kirkcaldy")} p="Labour" note="£1,657 repaid" />,
              children: <>Across two claims.</>,
            },
            {
              key: "downie-rep",
              title: <Who face name="Graeme Downie" href={mp("dunfermline-and-dollar")} p="Labour" note="£1,200 repaid" />,
              children: <>A double advertising claim.</>,
            },
            {
              key: "small",
              title: "Smaller double advertising claims",
              children: (
                <>
                  <Link href={mp("north-east-fife")}>Wendy Chamberlain</Link> (£126) and{" "}
                  <Link href={mp("edinburgh-east-and-musselburgh")}>Chris Murray</Link> (£71.50).
                </>
              ),
            },
          ]}
        />
      </Expand>

      {/* ------------------------------------------------------------ 8 */}
      <Finding n={8} of={FINDINGS} id="top-10-table">
        The top 10 Scottish MPs, not counting staff
      </Finding>
      <P>
        Every MP gets a similar staff budget, so we leave staff out. See{" "}
        <Link href="/mp-expenses-scotland">all 57 MPs ranked</Link>.
      </P>

      <Expand summary="Open the top 10 (Graeme Downie is first on £151,954)">
        <RankList
          rows={TOP_10.map((r) => ({
            key: r.slug,
            who: <Who face name={r.name} href={mp(r.slug)} p={r.p} />,
            side: r.seat,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            detail: r.detail,
          }))}
        />
      </Expand>

      <H2 id="ask-your-mp">Put the receipts to your own MP</H2>
      <P>
        Every Scottish MP&apos;s 2025/26 claims, gifts and votes are on their{" "}
        <Link href="/representatives">profile page</Link>, with a button to email them.
      </P>

      <PostCTA
        title="Check your own MP's expenses and ask them to explain"
        body="Enter your postcode to see every pound your MP claimed in 2025/26 and send them a ready made email."
        href="/mp-expenses-scotland"
        cta="See all 57 MPs ranked"
      />

      <Expand summary="For journalists and researchers: where this data comes from">
        <p className="text-[16px] leading-[1.6] text-[var(--ink-2)]">
          Every number comes from IPSA&apos;s 2025/26 expense files (6,101 Scottish claim lines)
          and the UK Parliament Register of Interests (210 entries across all 57 Scottish MPs,
          checked 21 November 2026). You are welcome to quote it with a link to{" "}
          <Link href="/mp-expenses-scotland">scotlandcounted.org.uk/mp-expenses-scotland</Link>.
        </p>
      </Expand>
    </Prose>
  );
}
