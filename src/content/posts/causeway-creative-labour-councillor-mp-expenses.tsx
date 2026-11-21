import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, H3, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";

/*
 * Every figure comes from IPSA's published claim files (2023/24 to 2026/27 so
 * far, searched for "Causeway Creative"), Companies House, Warrington Borough
 * Council's councillor pages and archived copies of the firm's own websites,
 * all checked 21 November 2026. We did not contact the firm or any MP.
 */

const DEMO_PAGES = [
  ["James Naish (Rushcliffe)", "16, including both test pages"],
  ["Natasha Irons (Croydon East)", "14, including both test pages"],
  ["Dan Carden (Liverpool Walton)", "13"],
  ["Damien Egan (Bristol North East)", "11"],
  ["Joani Reid (East Kilbride and Strathaven)", "9, plus the copied survey"],
];

const SPEND_BY_TYPE = [
  [
    "Bought-in comms and media",
    "£156,928",
    "Outside work on press, social media and newsletters, in place of an MP's own staff",
  ],
  ["Websites", "£76,713", "15 MPs. Ten of them paid the same £4,800"],
  ["Staff training", "£24,948", "£594 a time, to 31 MPs' offices"],
  ["Everything else", "£11,444", "Software, consultancy, advertising and admin"],
  ["Total", "£270,033", "53 MPs, August 2024 to November 2026"],
];

const SCOTTISH_MPS = [
  [
    <Link
      key="reid"
      href="/representatives/mps/east-kilbride-and-strathaven#donations-and-interests"
    >
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
    <Link
      key="sullivan"
      href="/representatives/mps/bathgate-and-linlithgow#donations-and-interests"
    >
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
    <Link
      key="gilbert"
      href="/representatives/mps/edinburgh-north-and-leith#donations-and-interests"
    >
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
        payment. But the money is public, the firm is run by a sitting politician, and it has rarely
        been reported. So here is what the official records show.
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
        IPSA publishes every claim in a huge spreadsheet. We searched every line from 2023/24 to the
        latest 2026/27 figures for Causeway Creative. This is what the money was for.
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
        claim it back from the public purse. Its website ran a competition to win a free website for
        a Labour group, open only to people at a local government conference.
      </P>
      <P>
        The payments bunch up at the end of IPSA&apos;s budget year. In March and April 2025 alone,
        MPs made 42 payments to the firm. The budget year ends on 31 March.
      </P>

      <H2 id="websites">3. What £4,800 actually bought: a copy and paste job</H2>
      <P>
        Fifteen MPs paid Causeway Creative for a website. Most paid the same thing: £4,800 to build
        it, then £1,200 the year after. So we went and looked at what they got.
      </P>
      <P>
        <strong>It&apos;s one template, copied from MP to MP.</strong> Every MP site we could read
        runs on WordPress, free website software, with a free theme called Hello Elementor and a
        drag and drop page builder. They all run the same add ons, and they all match
        Causeway&apos;s own &quot;MP website demo&quot; site, mpwebsites.uk, which still has
        &quot;Lorem Ipsum&quot; filler text on it.
      </P>
      <P>
        Anyone who builds websites for a living could copy a site like this to a new address, swap
        the names and have it live in under an hour. That&apos;s not a guess. The sites themselves
        show it was done exactly that way.
      </P>

      <div className="my-7 overflow-hidden rounded-[var(--r-m)] border-2 border-[var(--bad-text)]">
        <p className="ui bg-[var(--bad-text)] px-5 py-2.5 text-[15px] font-[700] uppercase tracking-[0.04em] text-white">
          The giveaways nobody deleted
        </p>
        <div className="divide-y divide-[var(--rule)]">
          <div className="p-5">
            <p className="tile-key">1. A find and replace that went too far</p>
            <p className="mt-2 text-[17px] font-[600] leading-[1.5] text-[var(--ink)]">
              &quot;Traditionally our industry has used Croydon East, which is placeholder text
              written in Latin.&quot;
            </p>
            <p className="ui mt-2.5 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              From a page called &quot;My Page Title&quot; on Natasha Irons MP&apos;s site. The
              template&apos;s filler text talks about &quot;Lorem Ipsum&quot;, the dummy Latin
              designers use. Someone swapped &quot;Lorem Ipsum&quot; for the MP&apos;s seat across
              the whole site in one go, and nobody checked. James Naish MP&apos;s site has the same
              page, saying the same thing about &quot;Rushcliffe&quot;. Both pages were still live
              on 21 November 2026.
            </p>
          </div>
          <div className="p-5">
            <p className="tile-key">2. Test pages left on the live site</p>
            <p className="ui mt-2 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              The demo has a page called &quot;Front Form Test&quot;. So do Natasha Irons&apos;s and
              James Naish&apos;s sites, still sitting there for the public to find. On Natasha
              Irons&apos;s, it sits above the line &quot;Designed and Powered by Causeway
              Creative&quot;.
            </p>
          </div>
          <div className="p-5">
            <p className="tile-key">3. Two MPs, one survey, the wrong web address</p>
            <p className="mt-2 text-[17px] font-[600] leading-[1.5] text-[var(--ink)]">
              &quot;I&apos;m lucky to have so many amazing small businesses in my
              constituency.&quot;
            </p>
            <p className="ui mt-2.5 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Joani Reid MP (East Kilbride) and Dan Carden MP (Liverpool) both run a &quot;Small
              Business Survey&quot; in their own words. Except the words are identical, line for
              line, with only the name and seat swapped. On both sites it sits at the same web
              address: &quot;restore the 5A bus route&quot;. A bus survey&apos;s address, reused for
              a banking survey, on two MPs&apos; sites, one in Scotland and one in England.
            </p>
          </div>
          <div className="p-5">
            <p className="tile-key">4. The same words, site after site</p>
            <p className="mt-2 text-[17px] font-[600] leading-[1.5] text-[var(--ink)]">
              &quot;As your MP, I want to ensure I represent you in any way I can.&quot;
            </p>
            <p className="ui mt-2.5 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Word for word on Causeway&apos;s demo, and on the sites of Joani Reid, James Asser,
              Dan Carden, James Naish and Damien Egan. On Dan Carden&apos;s site, every one of the
              13 building blocks on the home page comes straight from the demo.
            </p>
          </div>
        </div>
      </div>

      <H3>How many pages did £4,800 buy?</H3>
      <P>
        About 15. A home page, an about page, a contact page, a handful of &quot;find help&quot;
        pages (benefits, housing, education and so on), news and three standard legal pages. The
        news stories are written by the MP&apos;s own office, not by Causeway. Here&apos;s how many
        pages on each site carry the exact same name as a page on the demo:
      </P>
      <div className="my-7">
        <GuideTable
          kicker="Pages copied from the demo"
          title="Pages with the same name as Causeway's demo site"
          columns={["MP's site", "Same as the demo"]}
          align={["left", "right"]}
          rows={DEMO_PAGES}
          caption="Source: archived copies of each site on the Internet Archive's Wayback Machine, 2025 to 2026, plus the live sites, checked 21 November 2026."
        />
      </div>

      <H3>And what&apos;s the £1,200 for?</H3>
      <P>
        Nobody says. IPSA files it as &quot;Website hosting and design&quot;, and that&apos;s all.
        Joani Reid, James Asser, Jas Athwal, Damien Egan and Sam Rushworth each paid £1,200 about a
        year after the £4,800 build. It looks like a yearly fee to keep the site online.
      </P>
      <P>
        Ordinary hosting for a small WordPress site is sold for a few pounds a month. So that&apos;s
        £6,000 per MP in the first two years, for a copied template, paid for by you.
      </P>
      <P>
        To be fair, agencies use templates all the time. That&apos;s not the point. The point is one
        template being sold to MP after MP at full price, with the leftovers still showing, and paid
        for with public money every time.
      </P>
      <P>
        And a couple of things don&apos;t add up. Sam Rushworth and Dan Aldridge paid Causeway for
        websites, but their sites today are built on Squarespace. Lauren Edwards paid £4,800 in
        August 2024, yet by December 2024 her site was running on a Labour Party theme. What did
        those payments buy? We don&apos;t know. They should say.
      </P>

      <H2 id="joani-reid">4. Joani Reid: £24,664, the most of any MP in the UK</H2>
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
        She also told the paper the money mostly went on &quot;creating and building a website,
        advertising surgeries and communicating with my constituents&quot;.{" "}
        <strong>But only £6,000 of her £24,664 was for the website.</strong> That&apos;s less than a
        quarter. And the website is the copied template, survey and all. The other £18,664 is filed
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

      <H2 id="scottish-mps">5. The Scottish MPs who paid Causeway Creative</H2>
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

      <H2 id="the-company">6. What the company&apos;s own records show</H2>
      <UL>
        <LI>
          <strong>Its first accounts</strong>, covering July 2024 to December 2025, show an average
          of four staff and net assets of £8,358. As a small company, it did not have to publish its
          sales or profit.
        </LI>
        <LI>
          <strong>Its own terms and conditions</strong>, published in October 2024, gave the company
          number of We Are Civitas Ltd, his earlier firm, not Causeway Creative&apos;s.
        </LI>
        <LI>
          <strong>Its website</strong> quotes praise from Labour MPs and Labour figures, and lists a
          London office and a Warrington office. Its &quot;featured campaigns&quot; are a think
          tank, a renters&apos; group and the Warrington building its head office is in. Not one of
          the MP websites it was paid to build.
        </LI>
        <LI>
          <strong>It sells an &quot;IPSA fundable&quot; course</strong> teaching MPs&apos; staff
          graphic design, pitched so the cost can be claimed back from the public purse.
        </LI>
      </UL>

      <H2 id="what-we-did-not-find">7. What we did not find</H2>
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

      <H2 id="questions">8. The questions that need answers</H2>
      <UL>
        <LI>
          Why did so many Labour MPs choose a firm run by a Labour councillor? Did any of them ask
          other firms for a price first?
        </LI>
        <LI>
          Why did ten MPs each pay exactly £4,800 for what is, in effect, the same template website?
        </LI>
        <LI>What does the £1,200 a year after that actually pay for?</LI>
        <LI>Does IPSA check whether a supplier has political links to the MP paying it?</LI>
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
