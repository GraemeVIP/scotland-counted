import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";

/*
 * Written in Graeme's voice (graeme-writing skill). Every figure comes straight
 * from IPSA's published individualBusinessCosts CSV files for 2022/23 to
 * 2026/27 (checked 21 November 2026), filtered to Scotland's 57 current MPs.
 * Quoted descriptions are IPSA's exact wording.
 */

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const PARTY_TV_ROWS = [
  ["Scottish Labour", "21 MPs (out of 37)", "51 claims", "£6,745.50"],
  ["Scottish Liberal Democrats", "4 MPs (out of 6)", "22 claims", "£2,753.75"],
  ["Scottish National Party (SNP)", "2 MPs (out of 8)", "5 claims", "£662.00"],
  ["Scottish Conservatives", "2 MPs (out of 6)", "6 claims", "£592.75"],
  [<strong key="tot">All Scottish MPs</strong>, <strong key="mps">29 MPs</strong>, <strong key="c">84 claims</strong>, <strong key="v">£10,754.00</strong>],
];

const ALL_29_TV_MPS = [
  [
    <Link key="ac" href={mp("orkney-and-shetland")} className="font-[600]">
      Alistair Carmichael
    </Link>,
    "Lib Dem",
    "Orkney and Shetland",
    "£1,080.25",
    "12 entries (two island offices; £246.25 repaid as MSP 50% share)",
  ],
  [
    <Link key="cj" href={mp("edinburgh-west")} className="font-[600]">
      Christine Jardine
    </Link>,
    "Lib Dem",
    "Edinburgh West",
    "£842.00",
    "5 years running (including £180.00 in May 2026)",
  ],
  [
    <Link key="gp" href={mp("livingston")} className="font-[600]">
      Gregor Poynton
    </Link>,
    "Labour",
    "Livingston",
    "£688.00",
    "4 licences in under 12 months (two in Dec 2024 / Feb 2025, two more in Nov 2025)",
  ],
  [
    <Link key="im" href={mp("edinburgh-south")} className="font-[600]">
      Ian Murray
    </Link>,
    "Labour",
    "Edinburgh South",
    "£682.00",
    "4 years running (billed £179.50 in Dec 2025, £5 over the £174.50 fee)",
  ],
  [
    <Link key="wc" href={mp("north-east-fife")} className="font-[600]">
      Wendy Chamberlain
    </Link>,
    "Lib Dem",
    "North East Fife",
    "£662.00",
    "4 years running (2022/23 to 2025/26)",
  ],
  [
    <Link key="bo" href={mp("argyll-bute-and-south-lochaber")} className="font-[600]">
      Brendan O&apos;Hara
    </Link>,
    "SNP",
    "Argyll, Bute and South Lochaber",
    "£487.50",
    "3 annual licences across 4 IPSA entries",
  ],
  [
    <Link key="dm" href={mp("dumfriesshire-clydesdale-and-tweeddale")} className="font-[600]">
      David Mundell
    </Link>,
    "Conservative",
    "Dumfriesshire, Clydesdale & Tweeddale",
    "£418.25",
    "4 years running (previously 50% share, full £174.50 in Feb 2026)",
  ],
  [
    <Link key="ic" href={mp("north-ayrshire-and-arran")} className="font-[600]">
      Irene Campbell
    </Link>,
    "Labour",
    "North Ayrshire and Arran",
    "£354.50",
    "£174.50 in Jul 2025 + £180.00 in Jun 2026",
  ],
  [
    <Link key="sa" href={mp("edinburgh-south-west")} className="font-[600]">
      Dr Scott Arthur
    </Link>,
    "Labour",
    "Edinburgh South West",
    "£354.00",
    "£174.50 in Jan 2025 + £179.50 in Feb 2026",
  ],
  [
    <Link key="za" href={mp("glasgow-south-west")} className="font-[600]">
      Dr Zubir Ahmed
    </Link>,
    "Labour",
    "Glasgow South West",
    "£349.00",
    "Two £174.50 licences in the same year (TV Licensing Jul 2025 + Co-op Mar 2026)",
  ],
  [
    <Link key="iw" href={mp("hamilton-and-clyde-valley")} className="font-[600]">
      Imogen Walker
    </Link>,
    "Labour",
    "Hamilton and Clyde Valley",
    "£344.00",
    "2 annual licences (Dec 2024 + Dec 2025)",
  ],
  [
    <Link key="mb" href={mp("glasgow-north-east")} className="font-[600]">
      Maureen Burke
    </Link>,
    "Labour",
    "Glasgow North East",
    "£344.00",
    "2 annual licences (Feb 2025 + Mar 2026)",
  ],
  [
    <Link key="gm" href={mp("glasgow-south")} className="font-[600]">
      Gordon McKee
    </Link>,
    "Labour",
    "Glasgow South",
    "£344.00",
    "£169.50 in Jan 2025 + £174.50 in Jan 2026",
  ],
  [
    <Link key="ks" href={mp("bathgate-and-linlithgow")} className="font-[600]">
      Kirsteen Sullivan
    </Link>,
    "Labour (Co-op)",
    "Bathgate and Linlithgow",
    "£344.00",
    "£169.50 in Jan 2025 + £174.50 in Dec 2025",
  ],
  [
    <Link key="at" href={mp("paisley-and-renfrewshire-north")} className="font-[600]">
      Alison Taylor
    </Link>,
    "Labour",
    "Paisley and Renfrewshire North",
    "£344.00",
    "£169.50 in Nov 2024 + £174.50 in Nov 2025",
  ],
  [
    <Link key="ms" href={mp("rutherglen")} className="font-[600]">
      Michael Shanks
    </Link>,
    "Labour",
    "Rutherglen",
    "£344.00",
    "£169.50 in Jul 2024 + £174.50 in Jul 2025",
  ],
  [
    <Link key="jg" href={mp("glasgow-east")} className="font-[600]">
      John Grady
    </Link>,
    "Labour",
    "Glasgow East",
    "£344.00",
    "£169.50 in Mar 2025 + £174.50 in Mar 2026",
  ],
  [
    <Link key="es" href={mp("falkirk")} className="font-[600]">
      Euan Stainbank
    </Link>,
    "Labour",
    "Falkirk",
    "£344.00",
    "£169.50 in Jan 2025 + £174.50 in Sep 2025",
  ],
  [
    <Link key="mm" href={mp("inverclyde-and-renfrewshire-west")} className="font-[600]">
      Martin McCluskey
    </Link>,
    "Labour",
    "Inverclyde and Renfrewshire West",
    "£344.00",
    "2 annual licences (Feb 2025 + Jan 2026)",
  ],
  [
    <Link key="jr" href={mp("east-kilbride-and-strathaven")} className="font-[600]">
      Joani Reid
    </Link>,
    "Labour",
    "East Kilbride and Strathaven",
    "£180.00",
    "May 2026 (£180.00 rate)",
  ],
  [
    <Link key="pn" href={mp("motherwell-wishaw-and-carluke")} className="font-[600]">
      Pamela Nash
    </Link>,
    "Labour",
    "Motherwell, Wishaw and Carluke",
    "£174.50",
    "May 2026 (constituency office)",
  ],
  [
    <Link key="kb" href={mp("aberdeen-north")} className="font-[600]">
      Kirsty Blackman
    </Link>,
    "SNP",
    "Aberdeen North",
    "£174.50",
    "Aug 2025",
  ],
  [
    <Link key="km" href={mp("cumbernauld-and-kirkintilloch")} className="font-[600]">
      Katrina Murray
    </Link>,
    "Labour",
    "Cumbernauld and Kirkintilloch",
    "£174.50",
    "Jul 2025",
  ],
  [
    <Link key="lj" href={mp("kilmarnock-and-loudoun")} className="font-[600]">
      Lillian Jones
    </Link>,
    "Labour",
    "Kilmarnock and Loudoun",
    "£174.50",
    "May 2025 (constituency office)",
  ],
  [
    <Link key="ck" href={mp("stirling-and-strathallan")} className="font-[600]">
      Chris Kane
    </Link>,
    "Labour",
    "Stirling and Strathallan",
    "£174.50",
    "Feb 2026",
  ],
  [
    <Link key="hc" href={mp("gordon-and-buchan")} className="font-[600]">
      Harriet Cross
    </Link>,
    "Conservative",
    "Gordon and Buchan",
    "£174.50",
    "Dec 2025",
  ],
  [
    <Link key="tg" href={mp("edinburgh-north-and-leith")} className="font-[600]">
      Tracy Gilbert
    </Link>,
    "Labour",
    "Edinburgh North and Leith",
    "£174.50",
    "Aug 2025",
  ],
  [
    <Link key="tc" href={mp("na-h-eileanan-an-iar")} className="font-[600]">
      Torcuil Crichton
    </Link>,
    "Labour",
    "Na h-Eileanan an Iar",
    "£169.50",
    "Mar 2025",
  ],
  [
    <Link key="sm" href={mp("mid-dunbartonshire")} className="font-[600]">
      Susan Murray
    </Link>,
    "Lib Dem",
    "Mid Dunbartonshire",
    "£169.50",
    "Sep 2024",
  ],
];

export default function ScottishMpsTvLicenceExpenses() {
  return (
    <Prose>
      <Lead>
        Ordinary households in Scotland pay £180 a year for a TV licence out of their own pocket,
        and get threatening letters through the door if they miss it. Pensioners over 75 lost their
        universal free licence years ago. Meanwhile, more than half of Scotland&apos;s MPs, on a
        salary of £98,599 a year, put their TV licence straight onto taxpayer expenses.
      </Lead>

      <P>
        We searched all 20,879 line by line IPSA receipts filed by Scotland&apos;s 57 current MPs
        between 2022 and 2026 using our{" "}
        <Link href="/mp-expenses-scotland/search?q=TV%20licence">live receipt lookup tool</Link>.
        Between them, <strong>29 Scottish MPs</strong> filed <strong>84 TV licence claims</strong>{" "}
        totalling <strong>£10,754.00</strong> of public money.
      </P>

      <BigStat
        value="£10,754"
        label="Claimed by 29 Scottish MPs for TV licences across 84 IPSA expense entries between 2022 and 2026."
        exact="21 of the 29 MPs are Scottish Labour (£6,745.50). Every claim was approved under IPSA's Office Costs budget."
      />

      <H2 id="why-tv-licence">1. Why on earth are taxpayers buying MPs a TV licence?</H2>
      <P>
        Under IPSA&apos;s rules, MPs are explicitly barred from claiming a TV licence for their
        London second home or private home. They are, however, allowed to bill the public for a TV
        licence for their constituency office on the grounds that staff might need to watch news or
        parliamentary broadcasts live.
      </P>
      <P>
        Stop and think about how dated that excuse is in 2026. You do not need a TV licence to read
        BBC News online, check X, listen to the radio, watch clips on YouTube, or follow Parliament
        on Parliamentlive.tv. You only legally need a TV licence if you are watching live broadcast
        TV channels or BBC iPlayer.
      </P>
      <P>
        More to the point, 28 of Scotland&apos;s 57 MPs managed to do their job without billing the
        taxpayer a single penny for a TV licence over the last five years. The other 29 stuck the
        bill on the public purse, even as the fee climbed from £159 to £169.50, then £174.50, and
        now £180 in April 2026.
      </P>

      <H2 id="standout-claims">2. The claims that jump straight off the page</H2>
      <P>
        When you look through the individual dates and receipt descriptions, a few names stand out
        immediately:
      </P>
      <UL>
        <LI>
          <strong>Two £174.50 TV licences in the same financial year, one online and one at a Co-op
          (Dr Zubir Ahmed, Labour):</strong> The MP for Glasgow South West (who billed taxpayers
          £37,359 for 295 nights in London hotels, £12,523 to refurbish his office in early 2025,
          and took a £30,000 private donation) claimed <strong>£174.50 from
          TVLICENSING.CO.UK</strong> on 1 July 2025 (claim <code>60320713-14</code>). Nine months
          later, on <strong>31 March 2026</strong> (the very last day of the IPSA financial year and
          the exact day before the TV licence rose from £174.50 to £180), he filed a second full{" "}
          <strong>£174.50 TV licence claim paid at a Co-op</strong> (
          <code>CO-OP GROUP 010406</code>, claim <code>60370981-1</code>, likely paid over a
          PayPoint counter). His IPSA rent records show one constituency office at £1,500 a month
          (£18,000/year), and IPSA&apos;s published line gives no explanation of why two separate
          annual TV licences were claimed inside nine months.
        </LI>
        <LI>
          <strong>Four TV licences in under 12 months (Gregor Poynton, Labour):</strong> The MP for
          Livingston (who also tops Scotland for MP taxi fares at £5,059 and claimed £3,630 for his
          second home council tax) billed taxpayers <strong>£688.00 across four separate TV
          licences</strong> between December 2024 and November 2025: £169.50 on 18 December 2024,
          another £169.50 two months later on 14 February 2025, and then two more annual licences
          totalling £349.00 on 4 November and 26 November 2025. Again, IPSA&apos;s records do not
          explain why taxpayers paid for four separate TV licences in less than a year (whether for
          two offices, a London flat, or duplicate renewals).
        </LI>
        <LI>
          <strong>£179.50 claimed when the TV licence cost £174.50 (Ian Murray, Labour):</strong>{" "}
          The former Scottish Secretary claimed four TV licences totalling <strong>£682.00</strong>.
          In 2022 and 2023 he claimed £164.00 when the annual licence fee was £159.00; in April
          2024 he claimed £174.50 when the fee was £169.50; and in December 2025 he claimed{" "}
          <strong>£179.50</strong> when the fee was £174.50: £5.00 extra every year (typically what
          happens if a licence is paid on a quarterly direct debit surcharge rather than annually).
        </LI>
        <LI>
          <strong>Over £1,000 across two island offices (Alistair Carmichael, Lib Dem):</strong>{" "}
          The MP for Orkney and Shetland logged <strong>£1,080.25</strong> across 12 entries for
          his Orkney and Shetland offices, though to his credit the ledger shows he repaid £246.25
          (plus an £84.75 credit) where his local MSP split half the bill.
        </LI>
        <LI>
          <strong>Five years straight (Christine Jardine, Lib Dem):</strong> The MP for Edinburgh
          West claimed a TV licence every single year from 2022/23 through May 2026 (
          <strong>£842.00</strong> total, including the new £180.00 rate), on top of £510 for a
          staff Christmas lunch and team building event.
        </LI>
      </UL>

      <H2 id="party-breakdown">3. By party: Scottish Labour accounts for 63% of the total</H2>
      <P>
        Just like second home council tax and London hotels, the TV licence tally leans heavily
        towards Scottish Labour. Twenty one of Labour&apos;s 37 Scottish MPs put their TV licence
        on expenses (57% of their MPs), compared with just two of the SNP&apos;s eight MPs and two
        of the Conservatives&apos; six MPs.
      </P>

      <div className="my-7">
        <GuideTable
          kicker="IPSA 2022/23 to 2026/27 · TV Licence Claims by Party"
          title="Which parties billed taxpayers for TV licences?"
          columns={["Party", "MPs claiming", "Total claims", "Paid by taxpayers"]}
          align={["left", "left", "right", "right"]}
          rows={PARTY_TV_ROWS}
          caption="Source: IPSA individualBusinessCosts CSV files (2022/23 to 2026/27), filtered to Scotland's 57 current MPs."
        />
      </div>

      <H2 id="full-list">4. Every Scottish MP who billed taxpayers for a TV licence (2022 to 2026)</H2>
      <P>
        Here is the complete list of all 29 Scottish MPs who put a TV licence on public expenses
        between 2022 and 2026. Click any name to see their full expenses and send them an email, or{" "}
        <Link href="/mp-expenses-scotland/search?q=TV%20licence">
          inspect all 84 raw TV licence receipts directly in our search tool
        </Link>
        .
      </P>

      <div className="my-7">
        <GuideTable
          kicker="All 29 Scottish MPs · IPSA 2022/23 to 2026/27"
          title="Every Scottish MP who claimed a TV licence on expenses"
          columns={["MP", "Party", "Constituency", "Total claimed", "Notes from IPSA ledger"]}
          align={["left", "left", "left", "right", "left"]}
          rows={ALL_29_TV_MPS}
          caption="Note: IPSA sometimes splits a single annual TV licence across two financial years when the renewal date falls mid-year; totals shown are the sum paid across all entries."
        />
      </div>

      <Aside title="Approved and paid by IPSA, and that is the problem">
        <p>
          Every single one of these 84 claims was approved and paid by IPSA. IPSA&apos;s guidelines
          explicitly allow MPs to claim a TV licence for their constituency office, alongside{" "}
          <Link href="/mp-expenses-scotland/search?q=newspaper">
            £30,695 in newspaper subscriptions
          </Link>
          , <Link href="/mp-expenses-scotland/search?q=Amazon">£40,613 on Amazon</Link>,{" "}
          <Link href="/mp-expenses-scotland/search?q=IKEA">£20,010 at IKEA</Link> and{" "}
          <Link href="/blog/worst-scottish-mp-expenses">
            £3,090 to set up home broadband
          </Link>
          . You can also{" "}
          <Link href="/mp-expenses-scotland">compare all 57 Scottish MPs ranked</Link> or browse{" "}
          <Link href="/mp-expenses-scotland/receipts">the strangest receipts</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See all 84 TV licence receipts (or search 20,879 other claims)"
        body="Open our live 5-year receipt search tool pre-filtered to TV licences, copy any receipt for X or WhatsApp, or email your MP directly."
        href="/mp-expenses-scotland/search?q=TV%20licence"
        cta="Open the TV licence receipts →"
      />
    </Prose>
  );
}
