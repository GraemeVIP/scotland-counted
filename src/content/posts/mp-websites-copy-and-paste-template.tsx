import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import RevealCompare from "@/components/RevealCompare";

/*
 * Written in Graeme's voice (graeme-writing skill). Screenshots were taken
 * from the live sites on 21 November 2026 with a phone sized browser; the
 * yellow highlights were added by us. Full, untouched copies of every page
 * (screenshot, PDF, complete web archive and HTML, with SHA-256 fingerprints)
 * are kept offline in outputs/causeway-evidence-2026-11-21. Payments come
 * from IPSA's claim files. Nobody was contacted.
 */

const IMG = "/images/blog/causeway-template";
const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const TEMPLATE_FILLER = {
  src: `${IMG}/filler-template.webp`,
  alt: "Causeway Creative's demo website: a page of filler text that mentions Lorem Ipsum, Hipster Ipsum, Zombie Ipsum and Bacon Ipsum, highlighted in yellow",
  label: "Causeway's template",
  url: "mpwebsites.uk/my-page-title",
};

const IRONS_FILLER = {
  src: `${IMG}/filler-irons.webp`,
  alt: "Natasha Irons MP's website: the same filler page, now reading Croydon East, Hipster East, Zombie East and Bacon East, highlighted in yellow",
  label: "Natasha Irons MP",
  url: "natashairons.co.uk/my-page-title",
};

const NAISH_FILLER = {
  src: `${IMG}/filler-naish.webp`,
  alt: "James Naish MP's website: the same filler page, reading Rushcliffe, and Hipster, Zombie, Bacon with the word after each one missing, highlighted in yellow",
  label: "James Naish MP",
  url: "jamesnaish.com/my-page-title",
};

const WORDS = [
  [
    "WordPress",
    "Free software for building a website. You don't need to know any code. Millions of small businesses, clubs and bloggers use it.",
  ],
  [
    "Template",
    "A website someone has already designed. You copy it and change the words and pictures. Like buying a printed birthday card and writing your own name in it.",
  ],
  [
    "Theme",
    "The ready made look of a WordPress site. These MP sites use a free one called Hello Elementor.",
  ],
  [
    "Page builder",
    "A tool for laying out pages by dragging boxes around the screen, a bit like making a PowerPoint slide. No skill with code needed.",
  ],
  [
    "Lorem Ipsum",
    "Made up Latin that designers drop in as filler while they wait for the real words. It means nothing. Its only job is to be replaced.",
  ],
  [
    "Find and replace",
    "The button in Word that swaps every copy of one word for another, all in one go.",
  ],
  [
    "Hosting",
    "Renting space on a computer that keeps the website online. For a small WordPress site like these, it's commonly sold for a few pounds a month.",
  ],
];

const PAID = [
  [
    <Link key="reid" href={mp("east-kilbride-and-strathaven")} className="font-[600]">
      Joani Reid
    </Link>,
    "East Kilbride and Strathaven",
    "£4,800, then £1,200",
  ],
  ["Dan Carden", "Liverpool Walton", "£4,800"],
  ["Natasha Irons", "Croydon East", "£4,800, then £300"],
  ["James Naish", "Rushcliffe", "£4,800, then £817"],
];

export default function Post() {
  return (
    <Prose>
      <Lead>
        MPs have been paying £4,800 of your money for websites. I went and looked at them.
        They&apos;re the same template, copied from one MP to the next, and whoever did the copying
        left the leftovers on show. You don&apos;t have to take my word for it. Slide across and
        see.
      </Lead>

      <P>
        All of this is still online as I write. I&apos;ve saved full copies of every page, with the
        date and time, in case any of it disappears.
      </P>

      <H2 id="see-for-yourself">1. The template, and an MP&apos;s website</H2>
      <P>
        The firm, Causeway Creative, has a demo website for MPs. It&apos;s for a made up MP called
        Joanne Bloggs, MP for &quot;Lorem Ipsum South&quot;. On it there&apos;s a page of filler
        text that jokes about Lorem Ipsum, the dummy Latin designers use until the real words
        arrive.
      </P>
      <P>Now look at the same page on Natasha Irons MP&apos;s real website. Drag the red line.</P>

      <RevealCompare
        title="Causeway's demo template vs Natasha Irons MP's website"
        left={TEMPLATE_FILLER}
        right={IRONS_FILLER}
        width={780}
        height={1166}
        caption="Both pages were live on 21 November 2026. The yellow highlights are ours. Everything else is exactly as it appears on each site."
      />

      <P>
        <strong>
          &quot;Traditionally our industry has used Croydon East, which is placeholder text written
          in Latin.&quot;
        </strong>
      </P>
      <P>
        Here&apos;s what happened. Someone took the template and used find and replace to swap
        &quot;Lorem&quot; for &quot;Croydon&quot; and &quot;Ipsum&quot; for &quot;East&quot; across
        the whole site in one go. It swapped them everywhere, including the joke filler page that
        should never have been there. So now her site talks about &quot;Hipster East, Zombie East,
        Bacon East&quot; and &quot;Website East&quot;. Nobody checked.
      </P>

      <H2 id="naish">2. And again on another MP&apos;s site</H2>
      <P>
        James Naish MP has the same page. On his, &quot;Ipsum&quot; was swapped for nothing at all.
        So it reads &quot;Hipster , Zombie , Bacon&quot;, with gaps where the words used to be.
      </P>

      <RevealCompare
        title="Natasha Irons MP vs James Naish MP: the same leftover page"
        left={IRONS_FILLER}
        right={NAISH_FILLER}
        width={780}
        height={1166}
        caption="Live on both sites on 21 November 2026. Highlights are ours."
      />

      <H2 id="same-site">3. Same words, same photos</H2>
      <P>
        It&apos;s not just the leftover pages. The main pages are the template too. Here&apos;s the
        &quot;How can I help you?&quot; section on Causeway&apos;s demo, next to Dan Carden
        MP&apos;s home page. Same words. And look at the photos underneath. They&apos;re the same
        stock photos.
      </P>

      <RevealCompare
        title="Causeway's demo template vs Dan Carden MP's home page"
        left={{
          src: `${IMG}/help-template.webp`,
          alt: "Causeway's demo home page: How can I help you, with the sentence As your MP, I want to ensure I represent you in any way I can highlighted, above Benefits and Healthcare photos",
          label: "Causeway's template",
          url: "mpwebsites.uk",
        }}
        right={{
          src: `${IMG}/help-carden.webp`,
          alt: "Dan Carden MP's home page: the same heading, the same highlighted sentence and the same Benefits and Healthcare photos, in green",
          label: "Dan Carden MP",
          url: "dancardenmp.co.uk",
        }}
        width={780}
        height={1280}
        caption="Live on 21 November 2026. The same sentence appears on the sites of Joani Reid, James Asser, James Naish and Damien Egan. Highlights are ours."
      />

      <H2 id="survey">4. Two MPs, one survey, a bus route&apos;s web address</H2>
      <P>
        Joani Reid is the MP for East Kilbride and Strathaven. Dan Carden is the MP for Liverpool
        Walton. Both run a &quot;Small Business Survey&quot; on their websites, written as if
        it&apos;s in their own words:
      </P>
      <P>
        <strong>
          &quot;I&apos;m lucky to have so many amazing small businesses in my constituency.&quot;
        </strong>
      </P>
      <P>
        It&apos;s word for word the same on both, with only the name and the place swapped. And on
        both sites the survey sits at a web address called{" "}
        <strong>&quot;restore the 5A bus route&quot;</strong>. That&apos;s left over from a bus
        survey. It has nothing to do with small businesses. Watch the address bar change as you
        slide.
      </P>

      <RevealCompare
        title="Joani Reid MP's survey vs Dan Carden MP's survey"
        left={{
          src: `${IMG}/survey-reid.webp`,
          alt: "Joani Reid MP's Small Business Survey for East Kilbride and Strathaven, with the line I'm lucky to have so many amazing small businesses in my constituency highlighted",
          label: "Joani Reid MP",
          url: "joanireidmp.co.uk/survey/restore-the-5a-bus-route",
        }}
        right={{
          src: `${IMG}/survey-carden.webp`,
          alt: "Dan Carden MP's Small Business Survey for Liverpool Walton, with the identical highlighted line",
          label: "Dan Carden MP",
          url: "dancardenmp.co.uk/survey/restore-the-5a-bus-route",
        }}
        width={780}
        height={1406}
        caption="Live on both sites on 21 November 2026. Highlights are ours."
      />

      <H2 id="test-pages">5. Test pages, left out for the public</H2>
      <P>
        The template has a page called &quot;Front Form Test&quot;. It&apos;s for checking a form
        works before a site goes live. Natasha Irons&apos;s and James Naish&apos;s sites both still
        have it, open to anyone.
      </P>

      <RevealCompare
        title="The Front Form Test page on two MPs' websites"
        left={{
          src: `${IMG}/formtest-irons.webp`,
          alt: "A page titled Front Form Test on Natasha Irons MP's website, with an empty name and email form",
          label: "Natasha Irons MP",
          url: "natashairons.co.uk/front-form-test",
        }}
        right={{
          src: `${IMG}/formtest-naish.webp`,
          alt: "A page titled Front Form Test on James Naish MP's website, with the same empty form",
          label: "James Naish MP",
          url: "jamesnaish.com/front-form-test",
        }}
        width={780}
        height={1000}
        caption="Live on both sites on 21 November 2026. Highlights are ours."
      />

      <H2 id="plain-english">6. What all these words mean</H2>
      <P>
        If you don&apos;t work with websites, half of this sounds like a foreign language. So
        here&apos;s what it all means in plain English.
      </P>
      <div className="my-7">
        <GuideTable
          kicker="Plain English"
          title="The web words in this story"
          columns={["Word", "What it means"]}
          align={["left", "left"]}
          rows={WORDS}
        />
      </div>

      <H2 id="how-long">7. How long does a site like this take?</H2>
      <P>
        I work with websites, so I&apos;ll be straight with you. These sites run on WordPress, with
        a free theme and a drag and drop page builder. The builder has a paid version, but it costs
        less than £100 a year. None of this needs a developer. It&apos;s built so people with no
        technical skills can make their own website.
      </P>
      <P>
        Each MP site has about 15 pages: a home page, an about page, a contact page, a few
        &quot;find help&quot; pages, a news page and three standard legal pages. The design is the
        template. The words are the template. Even the photos are the template.
      </P>
      <P>
        Copying a template like this onto a new web address and swapping the names in takes about
        45 minutes. Not weeks. Not even a day. The find and replace mistakes show that&apos;s exactly how
        it was done.
      </P>

      <H2 id="the-money">8. What it cost you</H2>
      <P>
        Fifteen MPs paid Causeway Creative for a website. Most paid exactly £4,800 to set it up.
        Some then paid £1,200 the year after. IPSA, the body that runs MPs&apos; expenses, only
        records it as &quot;Website hosting and design&quot;. It doesn&apos;t say what the yearly
        fee covers.
      </P>
      <div className="my-7">
        <GuideTable
          kicker="IPSA claim files"
          title="What the MPs in this story paid Causeway Creative for their websites"
          columns={["MP (Labour)", "Seat", "Website payments"]}
          align={["left", "left", "right"]}
          rows={PAID}
          caption="Source: IPSA individual business costs files, 2024/25 to 2026/27. Website lines only. Joani Reid also paid the firm £18,664 for comms and media work."
        />
      </div>
      <P>
        £4,800 for a copied template, with the test pages still on it. Then £1,200 a year for
        something that costs a few pounds a month. All of it public money.
      </P>

      <H2 id="who-is-he">9. Who is behind Causeway Creative?</H2>
      <P>
        Causeway Creative is owned and run by Tom Jennings. He&apos;s not an MP. He&apos;s a Labour
        and Co-operative councillor in Warrington, first elected in 2016. Until February 2024 he sat
        on the council&apos;s cabinet, in charge of economic development.
      </P>
      <P>
        So how can a councillor run a business? Easily. Being a councillor is a part time role. It
        comes with an allowance, not a full salary, and many councillors have other jobs.
        That&apos;s allowed, as long as they declare their business interests to the council.
      </P>
      <P>
        He set the company up on 8 July 2024. That&apos;s four days after Labour won the general
        election, when a few hundred new MPs suddenly needed websites. He&apos;s been in this line
        of work for about ten years. His earlier firm, We Are Civitas, built websites for Labour MPs
        too. 49 of the 53 MPs who have paid Causeway are Labour.
      </P>

      <H2 id="why-pay">10. So why are MPs paying him?</H2>
      <P>We can&apos;t see inside their heads, but the records show a few things.</P>
      <UL>
        <LI>
          <strong>It isn&apos;t their money.</strong> The bill goes to IPSA, so the MP never pays it
          themselves. There&apos;s not much reason to shop around.
        </LI>
        <LI>
          <strong>He&apos;s one of their own.</strong> A Labour councillor who has built Labour
          websites for years is an easy name to pass around a party full of new MPs.
        </LI>
        <LI>
          <strong>He sells it as claimable.</strong> Causeway even sells a training course for
          MPs&apos; staff that it advertises as &quot;IPSA fundable&quot;, meaning the MP can claim
          it back.
        </LI>
        <LI>
          <strong>Nobody checks the value.</strong> IPSA checks a claim fits the rules. Making sure
          it&apos;s good value is left to the MP.
        </LI>
      </UL>
      <P>
        Did any of these MPs get a second quote? Did any of them look at what they got? On this
        evidence, it doesn&apos;t look like it.
      </P>

      <Aside title="Within the rules, and that's the problem">
        <p>
          IPSA approved every one of these payments. MPs are allowed to buy from firms run by
          councillors, and we found no broken rules. Causeway isn&apos;t the only firm selling
          websites to MPs on expenses either. The question is why the rules let public money buy a
          copied template at £4,800 a time, with nobody checking.
        </p>
      </Aside>

      <PostCTA
        title="The full Causeway Creative investigation"
        body="Who runs it, the £270,033 it has been paid by 53 MPs, and why Joani Reid paid more than any other MP in the UK."
        href="/blog/causeway-creative-labour-councillor-mp-expenses"
        cta="Read the full investigation"
      />
    </Prose>
  );
}
