import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";

/*
 * Every figure comes from IPSA's published claim files (2023/24 to 2026/27 so
 * far, searched for "Causeway Creative"), Companies House, Warrington Borough
 * Council's councillor pages and archived copies of the firm's own websites,
 * all checked 21 November 2026. We did not contact the firm or any MP.
 */

const SPEND_BY_TYPE = [
  ["Bought-in comms and media", "£156,928", "Outside work on press, social media and newsletters, in place of an MP's own staff"],
  ["Websites", "£76,713", "15 MPs. Ten of them paid the same £4,800"],
  ["Staff training", "£24,948", "£594 a time, to 31 MPs' offices"],
  ["Everything else", "£11,444", "Software, consultancy, advertising and admin"],
  ["Total", "£270,033", "53 MPs, August 2024 to November 2026"],
];

const SCOTTISH_MPS = [
  [
    <Link key="reid" href="/representatives/mps/east-kilbride-and-strathaven#donations-and-interests">
      Joani Reid
    </Link>,
    "Labour",
    "East Kilbride and Strathaven",
    "£24,664",
  ],
  [
    <Link key="ahmed" href="/representatives/mps/glasgow-south-west#donations-and-interests">
      Dr Zubir Ahmed
    </Link>,
    "Labour",
    "Glasgow South West",
    "£15,082",
  ],
  [
    <Link key="sullivan" href="/representatives/mps/bathgate-and-linlithgow#donations-and-interests">
      Kirsteen Sullivan
    </Link>,
    "Labour (Co-op)",
    "Bathgate and Linlithgow",
    "£1,188",
  ],
  [
    <Link key="cooper" href="/representatives/mps/dumfries-and-galloway#donations-and-interests">
      John Cooper
    </Link>,
    "Conservative",
    "Dumfries and Galloway",
    "£594",
  ],
  [
    <Link key="gilbert" href="/representatives/mps/edinburgh-north-and-leith#donations-and-interests">
      Tracy Gilbert
    </Link>,
    "Labour",
    "Edinburgh North and Leith",
    "£594",
  ],
];

export default function Post() {
  return (
    <Prose>
      <Lead>
        Four days after Labour won the 2024 general election, a Labour councillor in Warrington set
        up a design and PR company. Since then, 53 MPs have paid it £270,033 of public money through
        their expenses. 49 of them are Labour MPs.
      </Lead>

      <P>
        Nothing here breaks the rules. IPSA, the body that runs MPs&apos; expenses, approved every
        payment. But the money is public, the firm is run by a sitting politician, and it has
        rarely been reported. So here is what the official records show.
      </P>

      <BigStat
        value="£270,033"
        label="Paid by 53 MPs to Causeway Creative Ltd since August 2024, all from public money."
        exact="49 Labour or Labour Co-op MPs, 2 Conservatives, 1 Lib Dem and 1 we could not confirm. The biggest payer in the whole UK is Joani Reid, MP for East Kilbride and Strathaven."
      />

      <H2 id="who-runs-it">1. Who runs Causeway Creative</H2>
      <P>
        Companies House lists one director and one owner: Thomas Michael Jennings. He owns more than
        75% of the company. The firm was set up on 8 July 2024. Its website address was registered
        on 1 July 2024, three days before polling day.
      </P>
      <P>
        Tom Jennings is a Labour and Co-operative councillor on Warrington Borough Council, for
        Bewsey and Whitecross. He was first elected in 2016. Until February 2024 he sat on the
        council&apos;s cabinet, in charge of economic development.
      </P>
      <P>
        The firm&apos;s registered office is in Warrington, at a charity where he is also a
        director. Nation.Cymru first linked the firm to the councillor in October 2025, over a Welsh
        Labour MP who paid it £7,500.
      </P>

      <Aside title="To be fair: he is not new to this">
        <p>
          Tom Jennings has run political web and digital firms for about ten years. One of them, We
          Are Civitas, built websites for Labour MPs. Its own website said it helped elect Andy
          Burnham and Steve Rotheram as metro mayors.
        </p>
        <p>
          So the story is not that a beginner got lucky. It is the scale. Before 2024, his earlier
          firm was paid just £726.78 from MPs&apos; expenses. Since Causeway was set up, MPs have
          paid it £270,033.
        </p>
      </Aside>

      <H2 id="what-mps-paid-for">2. What MPs paid for</H2>
      <P>
        IPSA publishes every claim in a huge spreadsheet. We searched every line from 2023/24 to
        the latest 2026/27 figures for Causeway Creative. This is what the money was for.
      </P>
      <div className="my-7">
        <GuideTable
          kicker="IPSA claim files · checked 21 November 2026"
          title="What MPs paid Causeway Creative for"
          columns={["What IPSA records", "Paid", "Details"]}
          align={["left", "right", "left"]}
          rows={SPEND_BY_TYPE}
          caption="Source: IPSA individual business costs files, 2023/24 to 2026/27 (2026/27 is part year). Totals rounded to the nearest pound."
        />
      </div>
      <P>
        The firm sells training to MPs&apos; staff as &quot;IPSA-fundable&quot;, meaning MPs can
        claim it back from the public purse. Its website ran a competition to win a free website
        for a Labour group, open only to people at a local government conference.
      </P>
      <P>
        The payments bunch up at the end of IPSA&apos;s budget year. In March and April 2025 alone,
        MPs made 42 payments to the firm. The budget year ends on 31 March.
      </P>

      <H2 id="joani-reid">3. Joani Reid: £24,664, the most of any MP in the UK</H2>
      <P>
        Joani Reid, Labour MP for East Kilbride and Strathaven, has paid Causeway Creative £24,664
        since 2024. No other MP in the UK has paid it more. IPSA files £18,664 of that as
        &quot;Staffing: Bought-in services, Comms &amp; Media&quot;.
      </P>
      <div className="my-7 overflow-hidden rounded-[var(--r-m)] border-2 border-[var(--bad-text)]">
        <p className="ui bg-[var(--bad-text)] px-5 py-2.5 text-[15px] font-[700] uppercase tracking-[0.04em] text-white">
          What she said vs what the receipts show
        </p>
        <div className="grid md:grid-cols-2">
          <div className="border-b border-[var(--rule)] bg-[var(--surface)] p-5 md:border-b-0 md:border-r">
            <p className="tile-key">What Joani Reid told The Scotsman, December 2025</p>
            <p className="mt-2 text-[17px] font-[600] leading-[1.5] text-[var(--ink)]">
              &quot;Not used any public money to hire any consultant or consultancy services for
              public or media relations.&quot;
            </p>
          </div>
          <div className="bg-[color-mix(in_srgb,var(--bad)_8%,transparent)] p-5">
            <p className="tile-key">What IPSA&apos;s own records show</p>
            <p className="mt-2 text-[17px] font-[600] leading-[1.5] text-[var(--ink)]">
              £18,664 of public money paid to Causeway Creative, an outside firm, filed as
              &quot;Bought-in services, Comms &amp; Media&quot;.
            </p>
          </div>
        </div>
        <p className="ui border-t border-[var(--rule)] bg-[var(--surface-2)] px-5 py-3.5 text-[16px] font-[650] text-[var(--ink)]">
          Put side by side, they don&apos;t match. An outside firm was paid public money, and
          IPSA&apos;s record calls the work comms and media.
        </p>
      </div>
      <P>
        To be fair to her, she also told the paper the money mostly went on &quot;creating and
        building a website, advertising surgeries and communicating with my constituents&quot;.
        But IPSA&apos;s records only show £6,000 of it as website work. The other £18,664 is filed
        as bought in comms and media, paid in five chunks between March and April 2025.
      </P>
      <P>
        Read it for yourself and make your own mind up. All seven payments, with dates, are on our{" "}
        <Link href="/mp-expenses-scotland#full-lists">MP expenses page</Link>.
      </P>
      <Aside title="A separate issue: her husband's firm">
        <p>
          Ms Reid&apos;s husband, David Taylor, is a lobbyist who owns and runs a different firm,
          Earthcott Ltd. Earthcott gave her £2,400 of free media training in 2026. Nothing links
          Earthcott to Causeway Creative.
        </p>
      </Aside>

      <H2 id="scottish-mps">4. The Scottish MPs who paid Causeway Creative</H2>
      <div className="my-7">
        <GuideTable
          kicker="IPSA claim files · since August 2024"
          title="Scottish MPs' payments to Causeway Creative"
          columns={["MP", "Party", "Seat", "Paid"]}
          align={["left", "left", "left", "right"]}
          rows={SCOTTISH_MPS}
          caption="Source: IPSA individual business costs files. Tap a name for that MP's full expenses."
        />
      </div>

      <H2 id="the-company">5. What the company&apos;s own records show</H2>
      <UL>
        <LI>
          <strong>Its first accounts</strong>, covering July 2024 to December 2025, show an average
          of four staff and net assets of £8,358. As a small company, it did not have to publish
          its sales or profit.
        </LI>
        <LI>
          <strong>Its own terms and conditions</strong>, published in October 2024, gave the
          company number of We Are Civitas Ltd, his earlier firm, not Causeway Creative&apos;s.
        </LI>
        <LI>
          <strong>Its website</strong> quotes praise from Labour MPs and Labour figures, and lists
          a London office and a Warrington office.
        </LI>
      </UL>

      <H2 id="what-we-did-not-find">6. What we did not find</H2>
      <UL>
        <LI>
          <strong>No overseas links.</strong> The only owner is British and based in England.
        </LI>
        <LI>
          <strong>No political donations</strong> from the firm or from Mr Jennings, on the
          Electoral Commission&apos;s register.
        </LI>
        <LI>
          <strong>No broken rules.</strong> IPSA approved every payment, and MPs are allowed to buy
          services from firms run by councillors.
        </LI>
      </UL>

      <H2 id="questions">7. The questions that need answers</H2>
      <UL>
        <LI>
          Why did so many Labour MPs choose a firm run by a Labour councillor? Did any of them ask
          other firms for a price first?
        </LI>
        <LI>
          Why did ten MPs each pay exactly £4,800 for a website? Is that a fixed price, and is it
          good value for public money?
        </LI>
        <LI>
          Does IPSA check whether a supplier has political links to the MP paying it?
        </LI>
        <LI>
          Joani Reid: what exactly did the £18,664 of &quot;bought-in comms and media&quot; pay for?
        </LI>
      </UL>

      <P>
        You can see every Scottish MP&apos;s claims on our{" "}
        <Link href="/mp-expenses-scotland">MP expenses page</Link>, and the strangest single claims
        on <Link href="/mp-expenses-scotland/receipts">the receipts page</Link>.
      </P>

      <PostCTA
        title="Ask your MP what they paid for"
        body="Enter your postcode to see your own MP's expenses and open a ready written email asking them to explain."
        href="/email-your-mp-and-msp"
        cta="Check and email my MP"
      />
    </Prose>
  );
}
