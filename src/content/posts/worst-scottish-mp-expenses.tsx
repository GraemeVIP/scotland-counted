import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";

/*
 * Written in Graeme's voice (graeme-writing skill). Every claim comes from
 * IPSA's published individual claim files for 2022/23 to 2026/27, read line by
 * line for Scotland's current MPs (21,017 lines), checked 21 November 2026.
 * Quoted descriptions are IPSA's own wording and must not be edited.
 * Broadband comparisons: Ofcom Connected Nations 2022 (September 2022 data),
 * Three's July 2022 5G home broadband offer and Starlink's July 2022 UK price.
 * Nobody was contacted for comment.
 */

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const BROADBAND = [
  ["Three's 5G home broadband router, July 2022", "Free with a monthly plan"],
  ["Starlink satellite broadband kit, made for the remotest homes, July 2022", "£529"],
  ["A typical phone or internet setup claim by a Scottish MP", "£90"],
  ["The next biggest setup claim by any Scottish MP", "£691"],
  [<strong key="cl">Chris Law&apos;s claim</strong>, <strong key="cla">£3,090</strong>],
];

const REPEAT_NAMES = [
  [
    <Link key="gd" href={mp("dunfermline-and-dollar")} className="font-[600]">
      Graeme Downie (Labour)
    </Link>,
    "The highest non staff expenses in Scotland (£151,954), a £41,435 London flat, a £963 business dinner and a £2,936 letter folding machine",
  ],
  [
    <Link key="cl" href={mp("dundee-central")} className="font-[600]">
      Chris Law (SNP)
    </Link>,
    "A £3,090 broadband setup, £6,292 on car parking in one year, a £28,200 London flat, and the most of any Scottish MP on hotels in Europe (£2,822)",
  ],
  [
    <Link key="am" href={mp("inverness-skye-and-west-ross-shire")} className="font-[600]">
      Angus MacDonald (Lib Dem)
    </Link>,
    "A £3,000 speech workshop, £546 to clean drains and £3,314 of energy bills on a second home where he claims no rent",
  ],
];

export default function WorstScottishMpExpenses() {
  return (
    <Prose>
      <Lead>
        £3,090 to set up broadband. £3,000 for a speech coach. £546 to clean the drains at a second
        home. £13,117 to post a glossy report about the MP through every letterbox. All paid for by
        you, and all sitting in a spreadsheet almost nobody reads.
      </Lead>

      <P>
        We went through every one of the 21,017 expense lines filed by Scotland&apos;s current MPs
        since 2022. Line by line. These are the ones that made us stop and read them twice.
      </P>
      <P>
        And here&apos;s the thing. IPSA, the body that runs MPs&apos; expenses, approved every single
        one. Nobody broke the rules. The rules just let them do this.
      </P>

      <BigStat
        value="£3,090"
        label="Claimed by Chris Law MP in July 2022 for one thing: setting up broadband at his home."
        exact="The typical phone or internet setup claim by a Scottish MP is £90. The next biggest is £691."
      />

      <H2 id="broadband">1. £3,090 just to set up broadband at home</H2>
      <P>
        On 25 July 2022, <Link href={mp("dundee-central")}>Chris Law</Link>, then the SNP MP for
        Dundee West, claimed £3,090 from the public purse. IPSA&apos;s record describes it in five
        words: &quot;Home 5G mobile broadband installation&quot;. It was paid in full.
      </P>
      <P>
        5G home broadband is just a box you plug into the wall. No engineer. No installation. In
        July 2022, Three were giving the box away free with a monthly plan. Plenty of people just
        use their phone as a hotspot.
      </P>
      <div className="my-7">
        <GuideTable
          kicker="What this normally costs"
          title="Setting up home broadband in July 2022, compared with Chris Law's claim"
          columns={["What", "Cost"]}
          align={["left", "right"]}
          rows={BROADBAND}
          caption="Sources: Three's home broadband offer, July 2022; Starlink UK pricing reported by ISPreview, August 2022; IPSA claim files 2022/23 to 2026/27."
        />
      </div>
      <P>
        So why not just get normal broadband like everyone else? Almost every home in the country
        can. Ofcom says 99% of homes in Dundee could get fast broadband that year. The record
        doesn&apos;t even say which home this was for: his own, or the flat in London taxpayers
        were already renting for him.
      </P>
      <P>
        Even Starlink, the satellite kit for the remotest homes in the country, cost £529 at the
        time. His claim was nearly six times that. And we&apos;re not told who was paid.
      </P>
      <Aside title="Questions Chris Law should answer">
        <p>Which home was it for? Who was paid? And what did £3,090 actually buy?</p>
      </Aside>

      <H2 id="speech-coach">2. A speech coach, and the drains cleaned at his second home</H2>
      <P>
        <Link href={mp("inverness-skye-and-west-ross-shire")}>Angus MacDonald</Link>, the Lib Dem
        MP for Inverness, Skye and West Ross-shire, billed £3,000 in July 2025 for a
        &quot;personalised presentation and speech skills workshop&quot;. Talking is the job. And
        that money came out of his staffing budget, the money that&apos;s meant for the people who
        help his constituents.
      </P>
      <P>
        In March 2026 he billed £546 for &quot;professional pressure jet wash&quot; and
        &quot;mechanical cable&quot; cleaning of the drains at his second home. The same year he
        billed £3,314 for that home&apos;s energy bills. It&apos;s a home where he claims no rent.
      </P>

      <H2 id="self-promotion">3. Paying to put their own name through your door</H2>
      <UL>
        <LI>
          <Link href={mp("glasgow-east")}>John Grady</Link> (Labour) paid £13,116.80 for the
          &quot;printing and delivery of MP Annual Report to constituents&quot;.{" "}
          <Link href={mp("coatbridge-and-bellshill")}>Frank McNally</Link> paid £9,974 and{" "}
          <Link href={mp("west-aberdeenshire-and-kincardine")}>Andrew Bowie</Link> £5,898 for
          theirs. IPSA allows these as long as there&apos;s no party politics in them. They still put
          the MP&apos;s name and face through every door.
        </LI>
        <LI>
          <Link href={mp("falkirk")}>Euan Stainbank</Link> (Labour) paid £3,300 for an
          &quot;Advertising board to advertise Euan as local MP and contact details. To be
          advertised for 1 year.&quot; A billboard of himself, paid for by the people he
          represents.
        </LI>
      </UL>

      <H2 id="consultants">4. Consultants and PR firms, on top of their own staff</H2>
      <P>
        Every MP gets a big budget for staff. Some still paid outside firms on top.
      </P>
      <UL>
        <LI>
          <Link href={mp("cowdenbeath-and-kirkcaldy")}>Melanie Ward</Link> (Labour) paid £10,000 for
          a &quot;Policy and Office set up consultant&quot;. She also claimed £7,000 for
          &quot;research and writing of local industrial strategy&quot;, then paid all £7,000 back.
        </LI>
        <LI>
          <Link href={mp("livingston")}>Gregor Poynton</Link> (Labour) paid £9,600 to BB Partners
          Advisory Ltd, a PR firm in Crawley, for &quot;Comms and Media Support&quot;.
        </LI>
        <LI>
          <Link href={mp("berwickshire-roxburgh-and-selkirk")}>John Lamont</Link> (Conservative)
          paid <strong>£35,792</strong> across 13 invoices to PR and media consultancy Peach
          Partners, including a single £9,125 bill for &quot;broadcast, digital preparation&quot;
          and regular £2,083 to £2,917 monthly retainers for &quot;social media, speech writing and
          press support&quot;. Every penny came out of his taxpayer staffing budget.
        </LI>
      </UL>

      <H2 id="perks">5. £23,437 electricity bill, TV licences, a £24,530 mobile bill and dinners</H2>
      <UL>
        <LI>
          <strong>£23,437 paid to Yu Energy for electricity in a single day (Lillian Jones, Labour):</strong>{" "}
          On 19 May 2026 IPSA paid £20,384.74 (under Miscellaneous) and £3,052.21 (under Other
          Costs) on the exact same account number for Kilmarnock and Loudoun MP{" "}
          <Link href={mp("kilmarnock-and-loudoun")}>Lillian Jones</Link>. That is the largest
          electricity payout for any MP in the entire UK over five years, costs £6,587 more than a
          full year&apos;s rent for her entire office (£16,850), and equals 156 Warm Home
          Discounts.{" "}
          <Link href="/blog/kilmarnock-mp-23437-electricity-bill">
            Read the full £23,437 electricity investigation →
          </Link>
        </LI>
        <LI>
          <strong>29 Scottish MPs billed taxpayers £10,754 for TV licences:</strong> More than half
          of Scotland&apos;s MPs put their TV licence on public expenses while ordinary households
          pay £180 a year out of their own pocket. That includes four licences in under 12 months
          for <Link href={mp("livingston")}>Gregor Poynton</Link> (£688) and two £174.50 licences
          in nine months for <Link href={mp("glasgow-south-west")}>Dr Zubir Ahmed</Link> (one
          online and one at a Co-op).{" "}
          <Link href="/blog/scottish-mps-tv-licence-expenses">
            See the full list of all 29 Scottish MPs →
          </Link>
        </LI>
        <LI>
          <Link href={mp("argyll-bute-and-south-lochaber")}>Brendan O&apos;Hara</Link> (SNP):{" "}
          <strong>£24,530</strong> on EE mobile phone bills across 58 claims, over £500 a month for
          five years running and peaking at £909.24 in March 2026 (more than four times higher than
          any other Scottish MP).
        </LI>
        <LI>
          <Link href={mp("dunfermline-and-dollar")}>Graeme Downie</Link> (Labour): £962.65 for a
          &quot;business dinner on behalf of Graeme Downie&quot;.
        </LI>
        <LI>
          <Link href={mp("edinburgh-west")}>Christine Jardine</Link> (Lib Dem): £510 on one day for
          a staff Christmas lunch and a team building event.
        </LI>
        <LI>
          <Link href={mp("motherwell-wishaw-and-carluke")}>Pamela Nash</Link> (Labour): £3,182 at
          DFS and IKEA for her office.
        </LI>
        <LI>
          <Link href={mp("ayr-carrick-and-cumnock")}>Elaine Stewart</Link> (Labour): £2,535 on
          Amazon under mobile phone equipment, alongside{" "}
          <Link href={mp("perth-and-kinross-shire")}>Pete Wishart</Link> (SNP) at £1,399 on
          Apple.com and{" "}
          <Link href={mp("berwickshire-roxburgh-and-selkirk")}>John Lamont</Link> (Conservative) at
          £1,248 for an &quot;Iphone and protection case&quot;.
        </LI>
        <LI>
          <Link href={mp("angus-and-perthshire-glens")}>Dave Doogan</Link> (SNP): £892.80 for a
          &quot;Newspaper Column Invoice&quot;. The record doesn&apos;t say what that was for.
        </LI>
      </UL>

      <H2 id="second-homes">6. Second homes, paid for by you</H2>
      <P>
        MPs work in two places, so the public pays for a second home. They can even own it and
        still claim the bills. <Link href={mp("lothian-east")}>Douglas Alexander</Link> claimed
        £4,093 for council tax on his house in East Lothian, which he lists as his second home.
        East Lothian charges double council tax on second homes. IPSA raised MPs&apos; budgets to
        cover charges like that, so you pick up the extra too.
      </P>
      <P>
        <Link href={mp("glasgow-south-west")}>Dr Zubir Ahmed</Link> billed £37,359 for 295 nights in
        London hotels in a single year, about £127 a night, mostly month-long block bookings of a flat (
        <Link href="/mp-expenses-scotland/receipts#hotel-nights">every claim, night by night</Link>). <Link href={mp("glasgow-east")}>John Grady</Link> billed
        £42,000 in London rent. That&apos;s £3,500 a month.
      </P>

      <H2 id="repeat-names">7. The names that keep coming up</H2>
      <P>
        Go through enough of these and the same names keep popping up.
      </P>
      <div className="my-7">
        <GuideTable
          kicker="Repeat names"
          title="Scottish MPs who appear again and again in the strangest claims"
          columns={["MP", "What they claimed"]}
          align={["left", "left"]}
          rows={REPEAT_NAMES}
          caption="Source: IPSA claim files 2022/23 to 2026/27. Click a name to see their full expenses."
        />
      </div>

      <H2 id="why-hidden">8. Why you&apos;ve never heard about any of this</H2>
      <P>
        IPSA does publish every claim. But it publishes them as a spreadsheet of 59,503 lines a
        year. Thousands of lines are lumped into one yearly total, and some hide who was paid.
        It&apos;s not secret. It&apos;s just that almost nobody has the time to read it.
      </P>
      <P>
        So we did. You can{" "}
        <Link href="/mp-expenses-scotland/search">
          search all 20,879 Scottish MP receipts yourself
        </Link>
        , browse <Link href="/mp-expenses-scotland/receipts">the strangest receipts</Link>, read
        our breakdown of{" "}
        <Link href="/blog/scottish-mps-tv-licence-expenses">
          the 29 MPs who claimed TV licences
        </Link>
        , and compare <Link href="/mp-expenses-scotland">all 57 Scottish MPs ranked</Link>.
      </P>

      <Aside title="All within the rules">
        <p>
          IPSA approved and paid every claim on this page. We found no broken rules. The question
          is whether the rules should allow any of it.
        </p>
      </Aside>

      <PostCTA
        title="Search all 20,879 Scottish MP receipts (or look up your MP by postcode)"
        body="Type your postcode, filter by Amazon, IKEA, TV licence, speech coach or taxi, copy any receipt for X or WhatsApp, and email your MP directly."
        href="/mp-expenses-scotland/search"
        cta="Open the Receipt Finder →"
      />
    </Prose>
  );
}
