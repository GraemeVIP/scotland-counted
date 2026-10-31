import Link from "@/components/IntentLink";
import ClipPlayer from "@/components/ClipPlayer";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { CITY_PAY, PRIVATE_RENTS } from "@/lib/data/money";
import { scotlandPoverty } from "@/lib/data/scotland";
import { JRF_SCOTLAND_2026 as JRF, plainPeriod } from "@/lib/data/schools";
import { pounds } from "@/lib/data/quickAnswers";
import { postPath } from "@/lib/routeMap";

/*
 * The clip was filmed and first posted on TikTok by @scotsagainstcorruption,
 * and went round X on 30 October 2026. The transcript was checked three ways:
 * the captions burned into the clip, a Gemini transcription and Whisper
 * large-v3. Where they differed, the majority reading is used. Swearing is
 * starred because the site is used in schools; nothing else is changed.
 */
const TRANSCRIPT = [
  "The council own nothing. They own absolutely f***ing nothing. Not one thing. It all belongs to the people.",
  "And it wasn't that long ago that you could demand that the council find you a property, because it was your property. All of the properties were your properties. They belonged to everybody. They were community owned.",
  "And then they decided they were gonnae con you. They were gonnae defraud the whole f***ing lot of yous, and sell you back that which was already yours at a f***ing very small peppercorn rent.",
  "And look where we are now. People have got them on private hands and private ownership, and they're charging fortunes to rent them. Fortunes! £750, £800 a month for a f***ing two bedroom ex-council house. I know a guy that was paying f***ing £750 for a one bedroom house, and you couldnae swing a f***ing cat in it. That's how bad it is.",
  "And yous all allowed it. The whole f***ing country allowed it. Because it was fraud. Absolute, abject fraud. They didnae own them. They didnae have the right to sell them. They had a fiduciary duty to protect that property for all of you. All of you.",
  "Thieving, criminal, corrupt, parasitic f***s.",
];

/** Scottish Government, Right to Buy ends in Scotland, 30 July 2016. */
const RTB_SOLD = 494_580;

/** Scottish Government private sector rent statistics 2010 to 2025, Table 2: average two bedroom rent. */
const GLASGOW_TWO_BED = { y2010: 564, y2025: 1_094, changePct: 94 };
const SCOTLAND_TWO_BED_2025 = 921;

/**
 * Housing Revenue Account statistics, 2024-25: average weekly council rent.
 * A month is the weekly figure times 52, divided by 12.
 */
const COUNCIL_RENT_WEEKLY = 86.32;
const COUNCIL_RENT_MONTHLY = Math.round((COUNCIL_RENT_WEEKLY * 52) / 12);

/** Homelessness in Scotland 2025-26, published 22 September 2026. */
const HOMELESS = {
  applications: 41_443,
  inTemporary: 19_004,
  childrenInTemporary: 10_715,
  notOffered: 21_800,
  unsuitableBreaches: 7_760,
  roughSleptNightBefore: 2_949,
  forces: 716,
  supportNeedPct: 50,
  aged25to49Pct: 62,
};

const n = (value: number) => value.toLocaleString("en-GB");

export default function Post() {
  const glasgow = CITY_PAY["glasgow-city"];
  const privateRenters = JRF.tenure.find((row) => row.home === "Private renters")!;
  const ownOutright = JRF.tenure.find((row) => row.home === "Own outright")!;

  return (
    <Prose>
      <Lead>
        A man sitting on the steps by Buchanan Galleries in Glasgow has been shared all over social
        media this week, saying Scotland&apos;s council houses were taken from the public and sold
        off. He swears a lot and he doesn&apos;t mince his words. He&apos;s also mostly right.
      </Lead>

      <H2 id="what-he-said">What he said, word for word</H2>
      <P>
        The clip is 86 seconds long. Below it is every word. I&apos;ve starred out the swearing,
        because some of the people who use this site are at school, but I haven&apos;t changed
        anything else.
      </P>
      <ClipPlayer
        src="/video/buchanan-galleries-council-houses.mp4"
        poster="/images/editorial/buchanan-galleries-steps.webp"
        title="A man on the steps by Buchanan Galleries in Glasgow talking about council houses"
      >
        Filmed and first posted on TikTok by{" "}
        <a href="https://www.tiktok.com/@scotsagainstcorruption" target="_blank" rel="noopener noreferrer">
          @scotsagainstcorruption
        </a>
        , then shared widely{" "}
        <a href="https://x.com/i/status/2116258588318461952" target="_blank" rel="noopener noreferrer">
          on X
        </a>
        . Strong language. If this is your video and you want it credited differently or taken
        down, <Link href="/contact">get in touch</Link>.
      </ClipPlayer>
      <blockquote className="my-8 rounded-[var(--r-m)] border border-[var(--rule)] border-l-[5px] border-l-[var(--brand)] bg-[var(--surface)] px-6 py-6 sm:px-8">
        <p className="ui mb-3 text-[14px] font-[600] uppercase tracking-[0.06em] text-[var(--brand)]">
          Full transcript
        </p>
        <div className="space-y-4 text-[18px] leading-[1.65] text-[var(--ink)]">
          {TRANSCRIPT.map((line) => (
            <p key={line.slice(0, 24)}>{line}</p>
          ))}
        </div>
      </blockquote>

      <H2 id="his-story">What we don&apos;t know about him</H2>
      <P>
        Let&apos;s be honest about something first. Nobody watching this knows who he is or how he
        lives. We&apos;re all filling in the gaps.
      </P>
      <P>
        He&apos;s sitting on cold steps in the dark, rolling a cigarette out of a tin, and he looks
        like life hasn&apos;t been kind to him lately. He talks about housing like someone
        who&apos;s felt it, not someone who&apos;s read about it. So most people, me included, have
        assumed he&apos;s struggling, maybe without a home of his own. I&apos;d bet a fair bit on
        it. But it is a bet. He might have a flat round the corner. I&apos;m writing about what he
        said, not deciding who he is.
      </P>
      <P>
        What struck me, and I think most people who shared it, is the gap between how he looks and
        how he talks. &quot;Peppercorn rent.&quot; &quot;Fiduciary duty.&quot; &quot;Absolute,
        abject fraud.&quot; He doesn&apos;t stumble over any of it. Plenty of politicians
        couldn&apos;t deliver it that cleanly with a speechwriter and an autocue. That says more
        about us than about him. We decide what somebody knows before they&apos;ve opened their
        mouth.
      </P>
      <P>So I checked what he said against the official figures.</P>

      <H2 id="sold">Were the council houses sold off?</H2>
      <P>Yes. This is the heart of what he&apos;s saying, and it&apos;s true.</P>
      <P>
        Right to Buy let council tenants buy the home they lived in for less than it was worth. The
        longer they&apos;d been a tenant, the bigger the discount. In Scotland it came in with the
        Tenants&apos; Rights, Etc. (Scotland) Act 1980.
      </P>
      <BigStat
        value={n(RTB_SOLD)}
        label="council and housing association homes in Scotland sold to their tenants under Right to Buy"
        exact="Between 1979/80 and 2014/15. Sales peaked at just under 40,000 in 1989. Scottish Government figures."
      />
      <P>
        In 1981, fewer than 4 in 10 homes in Scotland were owned by the people living in them. By
        2024 it was 6 in 10, and only 23% of homes were social homes, rented from a council or a
        housing association.
      </P>
      <P>
        The Scottish Parliament ended Right to Buy on 31 July 2016. The Scottish Government said
        that would stop up to 15,500 more social homes being sold over the next ten years. By then,
        nearly half a million had gone.
      </P>
      <Aside title="In Glasgow, the council really does own nothing">
        <p>
          His opening line is truer than he probably meant. On 7 March 2003, Glasgow City Council
          handed all of its council homes, more than 80,000 of them, to the new Glasgow Housing
          Association, after 58% of tenants who voted backed the move. It&apos;s now Wheatley Homes
          Glasgow. Those are still social homes at social rents, but since then the city&apos;s
          council houses haven&apos;t belonged to the council.
        </p>
      </Aside>

      <H2 id="fraud">Was it fraud?</H2>
      <P>Here&apos;s where he goes further than the facts.</P>
      <P>
        In law, the council did own those homes. They were built and run with public money, and you
        can argue they belonged to everyone in a moral sense. But the legal title sat with the
        council.
      </P>
      <P>
        And Right to Buy wasn&apos;t something councils dreamed up. Parliament passed it. A tenant
        who qualified had a legal right to buy, and the council had to sell. You can call that a
        terrible policy, and plenty of people do. But a law passed by Parliament isn&apos;t fraud,
        and councils that followed it weren&apos;t committing a crime.
      </P>
      <P>
        &quot;Fiduciary duty&quot; is a good phrase, and he uses it properly. It means a duty to look
        after something on someone else&apos;s behalf, the way a trustee looks after money for a
        child. Councils are meant to look after public money and property for the people they
        serve. His argument is that selling homes cheaply, homes that were never replaced, broke
        that trust. That&apos;s a political argument rather than a legal one. It&apos;s a serious
        one, and I think it&apos;s the one he&apos;s really making.
      </P>
      <P>
        One small thing. A peppercorn rent is a token rent, next to nothing. He uses it to mean the
        homes were sold for far less than they were worth. The term&apos;s a bit off, but the point
        stands.
      </P>

      <H2 id="rents">Is he right about the rents?</H2>
      <P>
        He says people are paying £750 to £800 a month for a two bedroom ex council house. If
        anything, he&apos;s being kind.
      </P>
      <BigStat
        value={`${pounds(GLASGOW_TWO_BED.y2025)} a month`}
        label="average advertised rent for a two bedroom private let in Greater Glasgow in 2025"
        exact={`Up ${GLASGOW_TWO_BED.changePct}% from ${pounds(GLASGOW_TWO_BED.y2010)} in 2010. The Scotland average was ${pounds(SCOTLAND_TWO_BED_2025)}. Scottish Government private rent statistics.`}
      />
      <P>
        Compare that with council rent. The average council rent in Scotland was{" "}
        {pounds(COUNCIL_RENT_WEEKLY, true)} a week in 2024/25, about {pounds(COUNCIL_RENT_MONTHLY)} a
        month, across every size of home. A two bedroom private let in Greater Glasgow costs nearly
        three times that.
      </P>
      <P>
        His friend paying £750 for a one bedroom place isn&apos;t far off either. The ONS average
        for a one bedroom home in Greater Glasgow was {pounds(glasgow.rent.oneBed)} in{" "}
        {PRIVATE_RENTS.month}.
      </P>
      <P>
        These figures mostly reflect homes advertised to new tenants, so some people who&apos;ve been
        in the same place for years pay less. But anyone looking for somewhere now faces these
        prices. And the help hasn&apos;t kept up: the most Universal Credit will pay towards private
        rent is frozen below the average, as my guide to the{" "}
        <Link href={postPath("local-housing-allowance-rent-shortfall-scotland")}>
          Local Housing Allowance rent shortfall
        </Link>{" "}
        shows.
      </P>
      <P>
        Not every home sold under Right to Buy is rented out now. Many are still lived in by the
        families who bought them, or by the people they sold to. But some have ended up with private
        landlords, and when they&apos;re let, they&apos;re let at market rents. I couldn&apos;t find
        an official count of how many in Scotland.
      </P>

      <H2 id="demand">Can you still demand the council finds you a home?</H2>
      <P>
        This is the one part he&apos;s got backwards, and the truth is almost worse.
      </P>
      <P>
        On paper, your rights are stronger now than they&apos;ve ever been. Since 31 December 2012,
        if you&apos;re homeless in Scotland and it isn&apos;t judged to be your own fault, the
        council has a legal duty to find you a settled home. Not just families or people who are
        ill. Everyone.
      </P>
      <P>The problem is there aren&apos;t enough homes to keep that promise. In 2025/26:</P>
      <UL>
        <LI>
          {n(HOMELESS.inTemporary)} households were in temporary accommodation on 31 March 2026, the
          highest since the figures began in 2002.
        </LI>
        <LI>{n(HOMELESS.childrenInTemporary)} children were among them, also a record.</LI>
        <LI>
          On {n(HOMELESS.notOffered)} occasions, a council should have offered somebody temporary
          accommodation and didn&apos;t.
        </LI>
        <LI>
          There were {n(HOMELESS.unsuitableBreaches)} breaches of the rules that limit how long
          people can be kept in unsuitable places like B&amp;Bs.
        </LI>
      </UL>
      <P>
        Glasgow City Council declared a housing emergency on 30 November 2023. The Scottish
        Parliament declared a national one on 15 May 2024. So the right he says we&apos;ve lost
        still exists. It&apos;s the homes that have gone.
      </P>

      <H2 id="anyone">Hardship can reach anyone</H2>
      <P>
        Whatever his story is, I think the clip landed because most of us know somebody who&apos;s
        one bad year from trouble. Maybe we are. Homelessness in Scotland doesn&apos;t look the way
        people imagine.
      </P>
      <UL>
        <LI>{n(HOMELESS.applications)} households applied to their council as homeless in 2025/26.</LI>
        <LI>
          The most common place people became homeless from was a family member&apos;s or a
          friend&apos;s home. A sofa, a spare room, a favour that ran out.
        </LI>
        <LI>
          {HOMELESS.supportNeedPct}% had at least one support need, such as mental health. The other
          half didn&apos;t.
        </LI>
        <LI>
          {HOMELESS.aged25to49Pct}% were aged 25 to 49. Working age people, not just the very young
          or the very old.
        </LI>
        <LI>{n(HOMELESS.forces)} households included someone who had served in the armed forces.</LI>
        <LI>{n(HOMELESS.roughSleptNightBefore)} had slept rough the night before they applied.</LI>
      </UL>
      <P>
        Poverty works the same way. About {n(scotlandPoverty.all.count)} people in Scotland,{" "}
        {scotlandPoverty.all.pct}%, were in poverty in {plainPeriod(scotlandPoverty.period)}. Two
        thirds of them ({JRF.peopleInPovertyWithWorkPct}%) live in a household where somebody works.
        And where you live matters: {privateRenters.pct}% of private renters are in poverty, against{" "}
        {ownOutright.pct}% of people who own their home outright. Rent alone pulls{" "}
        {JRF.privateRentersPulledInPct}% of private renters below the poverty line.
      </P>
      <P>
        Life can turn quickly. A relationship ends. A job goes. Somebody gets ill, or dies. A
        landlord sells up. Most people are a couple of those away from needing help, and the safety
        net he&apos;s talking about, a big stock of cheap public homes, is a lot thinner than it
        was.
      </P>
      <P>
        I don&apos;t know if the man on the steps has a home tonight. I hope he does. But he&apos;s
        right that something was sold that can&apos;t easily be bought back, and the people paying
        for it now are the ones with the least choice. See{" "}
        <Link href={postPath("causes-of-poverty")}>the causes of poverty in Scotland</Link> for more
        on how that happens.
      </P>

      <H2 id="help">If you&apos;re struggling with housing</H2>
      <UL>
        <LI>
          <a href="https://scotland.shelter.org.uk/get_help/helpline" target="_blank" rel="noopener noreferrer">
            Shelter Scotland&apos;s free helpline
          </a>
          : 0808 800 4444, Monday to Friday, 9am to 5pm.
        </LI>
        <LI>
          If you&apos;re homeless or about to be, go to your council&apos;s homelessness team. They
          have a legal duty to help, and to find you somewhere to stay while they look into it.{" "}
          <a href="https://www.mygov.scot/if-youre-homeless" target="_blank" rel="noopener noreferrer">
            mygov.scot explains what happens
          </a>
          .
        </LI>
        <LI>
          If your benefits don&apos;t cover your rent, ask your council for a{" "}
          <Link href={postPath("discretionary-housing-payment-scotland")}>
            Discretionary Housing Payment
          </Link>
          .
        </LI>
        <LI>
          If you can&apos;t afford food or heating right now, a{" "}
          <Link href={postPath("crisis-grant-scotland-how-to-apply")}>crisis grant</Link> doesn&apos;t
          have to be paid back.
        </LI>
      </UL>

      <PostCTA
        title="Housing is decided at Holyrood"
        body="Tell your MSP what rent costs where you live. I find your MSP from your postcode, add the housing figures and help you write the email in ordinary language."
        href="/email-your-mp-and-msp"
        cta="Email my MSP"
      />
    </Prose>
  );
}
