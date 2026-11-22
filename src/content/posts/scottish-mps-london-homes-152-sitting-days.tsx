import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";

/*
 * Written in Graeme's voice (graeme-writing skill) for everyday tabloid readers
 * and school-age clarity: every Westminster term is explained in plain English
 * (and automatically underlined by ExplainText via glossary.ts).
 *
 * Data sources (checked 22 November 2026):
 * - IPSA 2025/26 individualBusinessCosts CSV (Accommodation + MP Travel + Dependant Travel)
 * - Hansard / Parliament API (152 days the Commons opened in 2025/26, speaking days,
 *   written questions, and recorded votes across all 55 full-year Scottish MPs).
 */

const mp = (slug: string) => `/representatives/mps/${slug}#london-record`;

const SHUTTLE_BREAKDOWN = [
  ["London flats, hotels, second home council tax & heating bills", "£1,559,441"],
  ["MPs' own flights, trains, taxis, airport parking & car mileage", "£1,265,797"],
  ["Flights, trains & taxis for MPs' partners and children", "£89,111"],
  [
    <strong key="t">Total just to shuttle &amp; house 55 Scottish MPs (2025/26)</strong>,
    <strong key="v">£2,914,349 (£19,173 per open day)</strong>,
  ],
  ["Staff travel billed on top (for MPs' office staff)", "£565,753"],
  [
    <strong key="gt">Combined housing &amp; travel total (before £13.11m staff wages or MP pay)</strong>,
    <strong key="gv">£3,480,101</strong>,
  ],
];

const BIGGEST_SHUTTLE_BILLS = [
  [
    <Link key="gd" href={mp("dunfermline-and-dollar")} className="font-[600]">
      Graeme Downie
    </Link>,
    "Labour",
    "£84,992",
    "£559",
    "55 days",
    "214 votes (£397 each)",
  ],
  [
    <Link key="kb" href={mp("aberdeen-north")} className="font-[600]">
      Kirsty Blackman
    </Link>,
    "SNP",
    "£80,222",
    "£528",
    "58 days",
    "83 votes (SNP skips England-only laws)",
  ],
  [
    <Link key="ab" href={mp("west-aberdeenshire-and-kincardine")} className="font-[600]">
      Andrew Bowie
    </Link>,
    "Conservative",
    "£74,057",
    "£487",
    "41 days",
    "190 votes (£390 each)",
  ],
  [
    <Link key="cl" href={mp("dundee-central")} className="font-[600]">
      Chris Law
    </Link>,
    "SNP",
    "£73,355",
    "£483",
    "41 days",
    "77 votes (SNP skips England-only laws)",
  ],
  [
    <Link key="iw" href={mp("hamilton-and-clyde-valley")} className="font-[600]">
      Imogen Walker
    </Link>,
    "Labour (Whip)",
    "£70,803",
    "£466",
    "6 days",
    "165 votes (Whips rarely speak)",
  ],
  [
    <Link key="gp" href={mp("livingston")} className="font-[600]">
      Gregor Poynton
    </Link>,
    "Labour",
    "£69,250",
    "£456",
    "21 days",
    "228 votes (£304 each)",
  ],
  [
    <Link key="bo" href={mp("argyll-bute-and-south-lochaber")} className="font-[600]">
      Brendan O&apos;Hara
    </Link>,
    "SNP",
    "£68,561",
    "£451",
    "37 days",
    "80 votes (SNP skips England-only laws)",
  ],
  [
    <Link key="ac" href={mp("orkney-and-shetland")} className="font-[600]">
      Alistair Carmichael
    </Link>,
    "Lib Dem",
    "£68,482",
    "£451",
    "58 days",
    "162 votes (£423 each)",
  ],
  [
    <Link key="ck" href={mp("stirling-and-strathallan")} className="font-[600]">
      Chris Kane
    </Link>,
    "Labour",
    "£68,303",
    "£449",
    "25 days",
    "230 votes (£297 each)",
  ],
  [
    <Link key="jl" href={mp("berwickshire-roxburgh-and-selkirk")} className="font-[600]">
      John Lamont
    </Link>,
    "Conservative",
    "£68,187",
    "£449",
    "85 days",
    "240 votes (£284 each)",
  ],
];

const COST_PER_SPOKEN_DAY = [
  [
    <Link key="es" href={mp("ayr-carrick-and-cumnock")} className="font-[600]">
      Elaine Stewart
    </Link>,
    "Labour",
    "£57,135",
    "19 days",
    "5",
    <strong key="esv">£3,007</strong>,
    "£344",
  ],
  [
    <Link key="ck2" href={mp("stirling-and-strathallan")} className="font-[600]">
      Chris Kane
    </Link>,
    "Labour",
    "£68,303",
    "25 days",
    "9",
    <strong key="ckv">£2,732</strong>,
    "£297",
  ],
  [
    <Link key="jr" href={mp("east-kilbride-and-strathaven")} className="font-[600]">
      Joani Reid
    </Link>,
    "Labour",
    "£48,655",
    "19 days",
    "5",
    <strong key="jrv">£2,561</strong>,
    "£272",
  ],
  [
    <Link key="ag" href={mp("central-ayrshire")} className="font-[600]">
      Alan Gemmell
    </Link>,
    "Labour",
    "£56,145",
    "24 days",
    "2",
    <strong key="agv">£2,339</strong>,
    "£230",
  ],
  [
    <Link key="mb" href={mp("glasgow-north-east")} className="font-[600]">
      Maureen Burke
    </Link>,
    "Labour",
    "£42,825",
    "19 days",
    "26",
    <strong key="mbv">£2,254</strong>,
    "£248",
  ],
  [
    <Link key="ks" href={mp("airdrie-and-shotts")} className="font-[600]">
      Kenneth Stevenson
    </Link>,
    "Labour",
    "£33,465",
    "16 days",
    "4",
    <strong key="ksv">£2,092</strong>,
    "£148",
  ],
  [
    <Link key="gm" href={mp("glasgow-south")} className="font-[600]">
      Gordon McKee
    </Link>,
    "Labour",
    "£42,867",
    "21 days",
    "2",
    <strong key="gmv">£2,041</strong>,
    "£198",
  ],
  [
    <Link key="lj" href={mp("kilmarnock-and-loudoun")} className="font-[600]">
      Lillian Jones
    </Link>,
    "Labour",
    "£43,062",
    "24 days",
    "7",
    <strong key="ljv">£1,794</strong>,
    "£219",
  ],
  [
    <Link key="fm" href={mp("coatbridge-and-bellshill")} className="font-[600]">
      Frank McNally
    </Link>,
    "Labour",
    "£46,862",
    "28 days",
    "6",
    <strong key="fmv">£1,674</strong>,
    "£180",
  ],
  [
    <Link key="jg" href={mp("glasgow-east")} className="font-[600]">
      John Grady
    </Link>,
    "Labour",
    "£60,603",
    "39 days",
    "29",
    <strong key="jgv">£1,554</strong>,
    "£245",
  ],
];

export default function ScottishMpsLondonHomes152SittingDays() {
  return (
    <Prose>
      <Lead>
        The House of Commons only opened its doors for 152 days in 2025/26, which means it was
        shut for 213 days of the year. Yet taxpayers spent £2.91 million in that single year just
        housing Scotland&apos;s MPs in London and shuttling them and their families up and down the
        road: £19,173 every single day Parliament was open.
      </Lead>

      <P>
        That £2.91 million does not include their £98,599 salaries. It does not include their local
        Scottish offices. It does not include £13.11 million in staff wages, or another £565,753
        spent flying their staff around. It is purely the bill to rent London flats, pay hotel
        rooms, cover second home council tax and heating, pay for flights, trains, taxis and
        airport parking, and fly MPs&apos; partners and kids down to London.
      </P>

      <BigStat
        value="£19,173"
        label="Spent every single day Parliament was open in 2025/26 just housing and shuttling Scotland's 55 full-year MPs and their families to London."
        exact="£2,914,349 total across 152 open days (sitting days), before salaries, Scottish offices or £13.11m in staff wages."
      />

      <H2 id="the-shuttle-bill">1. What the £2.91 million London shuttle bill actually pays for</H2>
      <P>
        Most people in Scotland pay to commute to work out of their own taxed wages. If your job
        asks you into an office three days a week, nobody rents you a £3,500 a month flat for all
        365 days of the year, pays your council tax and gas bill, covers your taxis and airport
        parking, and buys flights for your partner and kids.
      </P>
      <P>
        For Scotland&apos;s 55 MPs who served the whole of 2025/26, taxpayers picked up every single
        part of that tab:
      </P>

      <div className="my-7">
        <GuideTable
          kicker="IPSA 2025/26 · All 55 Full-Year Scottish MPs"
          title="The real cost of housing and shuttling Scotland's MPs to London"
          columns={["What taxpayers paid for", "2025/26 total"]}
          align={["left", "right"]}
          rows={SHUTTLE_BREAKDOWN}
          caption="Source: IPSA 2025/26 individualBusinessCosts CSV for the 55 current Scottish MPs who served the entire financial year."
        />
      </div>

      <H2 id="paid-when-shut">2. Paid for 365 nights when Parliament was shut for 213 days</H2>
      <P>
        In Parliament, a day when MPs meet in London to debate and vote is called a sitting day. In
        2025/26 there were <strong>152 sitting days</strong>. For the other <strong>213 days</strong>{" "}
        of the year (weekends, summer recess, party conference weeks, Christmas and Easter), the
        Commons chamber was shut.
      </P>
      <P>
        Because 53 of Scotland&apos;s MPs rent a private London flat on a full 12 month lease,
        taxpayers pay for all 365 nights automatically. You pay for the flat in August when
        Parliament is on summer holiday, you pay for it over Christmas, and you pay for it every
        Friday, Saturday and Sunday. IPSA never publishes how many nights an MP actually slept
        there.
      </P>
      <P>
        There is only one Scottish MP whose exact London nights you can count, because he used
        hotels and month long Airbnb block bookings instead of a 12 month flat lease:{" "}
        <Link href={mp("glasgow-south-west")}>Dr Zubir Ahmed</Link> (Labour, Glasgow South West).
      </P>
      <UL>
        <LI>
          <strong>295 London nights paid for, against 152 days Parliament was open:</strong>{" "}
          Taxpayers paid <strong>£37,359</strong> for his London stays (143 more nights than the
          Commons sat, working out at £246 for every open day).
        </LI>
        <LI>
          <strong>Before he got a government job (April to July 2025):</strong> Parliament was open
          for <strong>60 days</strong>. Taxpayers paid for <strong>123 London nights</strong> (more
          than double the days Parliament was open). Across those four months, he spoke in debates
          on <strong>11 days</strong> and asked <strong>zero written questions</strong>.
        </LI>
        <LI>
          <strong>After he became a health minister (from 6 September 2025):</strong> Government
          ministers work in London departments on weekdays, so extra nights are expected. Even so,
          his block bookings still billed taxpayers <strong>seven nights a week, weekends
          included</strong> (28 to 30 nights every month). You can read{" "}
          <Link href="/mp-expenses-scotland/receipts#hotel-nights">
            all 14 of his hotel claims night by night here
          </Link>
          .
        </LI>
      </UL>

      <H2 id="price-of-presence">3. Putting a price tag on what we actually got for £2.91 million</H2>
      <P>
        If taxpayers are paying £50,000 to £85,000 a year just to shuttle a single MP down to London
        and put a roof over their head, it is fair to ask a simple question: <strong>what did they
        actually do while they were down there?</strong>
      </P>
      <P>
        Every speech an MP makes is recorded word for word in Hansard, every formal question they
        put to government departments is published online, and every time they walk through a
        doorway to vote Aye or No is logged in Parliament&apos;s voting record.
      </P>
      <P>
        First, here are the <strong>10 Scottish MPs with the biggest combined London housing and
        travel bills</strong> in 2025/26. Notice that Labour, the SNP, the Conservatives and the
        Liberal Democrats are all right at the top:
      </P>

      <div className="my-7">
        <GuideTable
          kicker="All Parties · Home + Own Travel + Family Travel (2025/26)"
          title="The 10 biggest Scottish MP London shuttle bills in 2025/26"
          columns={["MP", "Party", "London + travel bill", "Per open day", "Days spoken", "Votes cast"]}
          align={["left", "left", "right", "right", "right", "left"]}
          rows={BIGGEST_SHUTTLE_BILLS}
          caption="Includes Accommodation, MP Travel and Dependant (family) Travel from IPSA 2025/26. Excludes staff wages, staff travel and Scottish office costs."
        />
      </div>

      <P>
        Now look at ordinary MPs who held <strong>no extra government job</strong>, were not a party
        whip (the MPs who organise votes and rarely speak), and were not an unpaid aide to a
        minister (a PPS, such as Pamela Nash, who is excluded from this list because convention bars
        a PPS from asking written questions).
      </P>
      <P>
        When you divide each ordinary MP&apos;s combined London housing and travel bill by the number
        of days they actually stood up and spoke in Parliament, taxpayers paid{" "}
        <strong>between £1,554 and £3,007 every single day they spoke</strong>, and{" "}
        <strong>£148 to £344 every single time they voted Aye or No</strong>:
      </P>

      <div className="my-7">
        <GuideTable
          kicker="Ordinary MPs With No Government, Whip or PPS Job · 2025/26"
          title="What taxpayers paid every time these MPs spoke or voted in London"
          columns={[
            "MP",
            "Party",
            "London + travel bill",
            "Days spoken",
            "Written Qs",
            "Cost per day spoken",
            "Cost per vote",
          ]}
          align={["left", "left", "right", "right", "right", "right", "right"]}
          rows={COST_PER_SPOKEN_DAY}
          caption="Source: IPSA 2025/26 (Accommodation + MP Travel + Family Travel) divided by 2025/26 Hansard speaking days and recorded Commons votes. Excludes ministers, whips, opposition spokespeople and PPSs."
        />
      </div>

      <H2 id="why-not-remote">4. They proved remote voting works during Covid, then binned it</H2>
      <P>
        The common defence from MPs is that they do lots of unseen work helping local residents with
        housing, benefits and passport problems. That is true, and it completely proves the point:
        <strong> helping people in Kilmarnock, Ayr, Stirling or Glasgow happens in Scotland, not
        from a £3,500 a month flat in Westminster.</strong>
      </P>
      <P>
        Every normal office worker in Britain spent the last five years running meetings on Teams
        and Zoom. Even Parliament itself proved remote voting and video debates worked smoothly
        during Covid in 2020 and 2021. MPs could vote securely from their Scottish constituency
        office in 30 seconds flat without boarding a plane or booking a single hotel room.
      </P>
      <P>
        Yet Westminster scrapped remote voting the moment lockdown ended. So every week, Scottish
        taxpayers keep shelling out £19,173 a day to fly 55 politicians down to London, rent them
        year round flats that sit empty more than half the year, pay their council tax, heating,
        taxis and airport parking, and fly their families down too, just so some of them can stand
        up and speak 19 times a year at £3,007 a pop and walk through a doorway to say Aye or No.
      </P>

      <Aside title="Fairness notes so nobody can wriggle out of the numbers">
        <p>
          Government ministers, party whips and unpaid ministerial aides (a PPS, such as Pamela Nash
          at the Ministry of Defence) are kept out of the second table because their jobs restrict
          them from speaking freely or asking written questions. SNP MPs cast fewer total votes
          because the SNP does not vote on laws that only affect England. Every single figure on
          this page comes directly from IPSA, Hansard and Parliament&apos;s official voting records.
        </p>
      </Aside>

      <PostCTA
        title="See every Scottish MP's London cost vs what they actually did"
        body="Check the sortable table of all 55 full-year Scottish MPs, or search all 20,879 individual expense receipts by postcode."
        href="/mp-expenses-scotland#london-record"
        cta="Compare all 55 Scottish MPs →"
      />
    </Prose>
  );
}
