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
  Receipt,
  CaseCard,
  Tiles,
  PointList,
} from "@/components/ExpenseKit";

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

const FINDINGS = 10;

const person = (name: string, slug: string, p: PartyKey, place: string): CasePerson => ({
  name,
  href: mp(slug),
  p,
  place,
});

const PRINT_AND_POST: { name: string; slug: string; p: PartyKey; seat: string; value: number }[] = [
  { name: "John Grady", slug: "glasgow-east", p: "Labour", seat: "Glasgow East", value: 13116.8 },
  { name: "Frank McNally", slug: "coatbridge-and-bellshill", p: "Labour", seat: "Coatbridge and Bellshill", value: 9974 },
  { name: "Andrew Bowie", slug: "west-aberdeenshire-and-kincardine", p: "Conservative", seat: "West Aberdeenshire and Kincardine", value: 5898 },
];

const GADGETS: { name: string; slug: string; p: PartyKey; value: number; detail: string }[] = [
  { name: "Elaine Stewart", slug: "ayr-carrick-and-cumnock", p: "Labour", value: 2535, detail: "Phone gear from Amazon" },
  { name: "Pete Wishart", slug: "perth-and-kinross-shire", p: "SNP", value: 1399, detail: "Bought at Apple" },
  { name: "John Lamont", slug: "berwickshire-roxburgh-and-selkirk", p: "Conservative", value: 1248, detail: "An iPhone and protection case" },
];

export default function WorstScottishMpExpenses() {
  return (
    <Prose>
      <Lead>
        £23,437 for power in one day. £3,090 to set up broadband. £3,000 for a speech coach. £546
        to clean drains at a second home. All paid by you.
      </Lead>

      <QuickTake
        items={[
          <>
            <Link href={mp("kilmarnock-and-loudoun")}>Lillian Jones</Link>: the biggest MP power
            bill in the UK in five years.
          </>,
          <>
            <Link href={mp("dundee-central")}>Chris Law</Link>: £3,090 to set up broadband. A
            normal setup claim is £90.
          </>,
          <>
            <Link href={mp("cowdenbeath-and-kirkcaldy")}>Melanie Ward</Link>:{" "}
            <strong>£10,000</strong> for an office set up consultant.
          </>,
          <>
            <Link href={mp("glasgow-east")}>John Grady</Link>: <strong>£13,117</strong> to print and
            post a report about his own work.
          </>,
          <>
            IPSA (the body that runs MPs&apos; expenses) paid every claim.{" "}
            <strong>No rules were broken.</strong>
          </>,
        ]}
      />

      <P>
        We read all <strong>21,017 expense lines</strong> filed by Scotland&apos;s MPs from 2022/23 to
        2026/27. Line by line. These are the claims that made us stop and look twice.
      </P>
      <P>
        Here is the catch. IPSA runs MPs&apos; expenses, and it paid every one. Nobody broke the
        rules. The rules just let them do this.
      </P>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} of={FINDINGS} id="power-bill">
        £23,437 for power, paid in one day
      </Finding>

      <CaseCard figure="£23,437" people={[person("Lillian Jones", "kilmarnock-and-loudoun", "Labour", "Kilmarnock and Loudoun")]}>
        <p>
          <strong>The biggest MP power bill in the UK in five years</strong>
        </p>
        <p>
          On 19 May 2026 IPSA made two payments to Yu Energy on the same account. It beats a full
          year of her office rent (£16,850) by £6,587.
        </p>
      </CaseCard>

      <Receipt
        heading="19 May 2026 · Two payments, one day"
        lines={[
          { meta: "2025/26 · Miscellaneous", what: "Lillian Jones - Yu Energy Utilities - 2000294348", amount: "£20,384.74" },
          { meta: "2026/27 · Other Costs", what: "Lillian Jones - Yu Energy Utilities - 2000294348", amount: "£3,052.21" },
        ]}
        total={{ label: "Paid in one day", amount: "£23,436.95" }}
        footer="Wording as printed by IPSA."
      />

      <Tiles
        items={[
          { value: "£150", label: "One Warm Home Discount: money off a low income home's energy bill" },
          { value: "156", label: "Warm Home Discounts that one day's payout equals", hot: true },
        ]}
      />

      <P>
        <Link href="/blog/kilmarnock-mp-23437-electricity-bill">Read the full £23,437 power bill story</Link>.
      </P>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} of={FINDINGS} id="broadband">
        £3,090 just to set up broadband
      </Finding>

      <CaseCard figure="£3,090" people={[person("Chris Law", "dundee-central", "SNP", "Dundee Central")]}>
        <p>
          <strong>One claim, July 2022, paid in full</strong>
        </p>
        <p>
          He was then MP for Dundee West. Since 2024 his seat has been Dundee Central. The file does
          not say which home it was for, or who was paid.
        </p>
      </CaseCard>

      <Receipt
        heading="25 July 2022"
        lines={[{ what: "Home 5G mobile broadband installation", amount: "£3,090.00" }]}
        footer="Wording as printed by IPSA."
      />

      <Tiles
        items={[
          { value: "£90", label: "A typical phone or internet setup claim by a Scottish MP" },
          { value: "£529", label: "Starlink satellite kit for remote homes, July 2022" },
          { value: "£3,090", label: "Chris Law's claim", hot: true },
        ]}
      />

      <P>
        5G home broadband is just a box you plug in. No van. No fitter. In July 2022, Three gave
        that box away free with a plan. Many folk just use their phone.
      </P>
      <P>
        Why not get normal broadband like the rest of us? Ofcom says 99% of homes in Dundee could
        get fast broadband that year. It could be his home, or the London flat you rent for him.
      </P>
      <P>
        Even Starlink kit for remote farms cost £529 then. His claim was nearly six times that. And
        IPSA will not say who got the cash.
      </P>
      <Aside title="Questions Chris Law should answer">
        <p>Which home was it for? Who got paid? And what did £3,090 buy?</p>
      </Aside>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} of={FINDINGS} id="speech-coach">
        A £3,000 speech coach, and £546 to clean drains
      </Finding>

      <CaseCard figure="£3,546" people={[person("Angus MacDonald", "inverness-skye-and-west-ross-shire", "Lib Dem", "Inverness, Skye and West Ross-shire")]}>
        <p>
          <strong>Speech lessons from the staff budget, and drains at his second home</strong>
        </p>
        <p>
          Talking is the job. The £3,000 came from his staff pot, meant for folk who help local
          voters.
          That year he also billed £3,314 for energy at his second home. He claims no rent there.
        </p>
      </CaseCard>

      <Receipt
        heading="Three claims, 2025/26"
        lines={[
          {
            meta: "17 July 2025",
            what: "Provision of personalised presentation and speech skills workshop to assist MPs representational role in Parliament.",
            amount: "£3,000.00",
          },
          { meta: "24 March 2026", what: "Drainage professional mechanical cable cleaning", amount: "£234.00" },
          { meta: "27 March 2026", what: "Drainage professional pressure jet wash cleaning", amount: "£312.00" },
        ]}
        footer="Wording as printed by IPSA (reference numbers left out)."
      />

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} of={FINDINGS} id="self-promotion">
        Paying to put their own name through your door
      </Finding>
      <P>
        These MPs paid to print and post a yearly report about their own work. IPSA allows it if
        there is no party badge on it. It still puts their face through every door. £13,117 is
        about £250 for every week of the year.
      </P>

      <ChartFrame kicker="IPSA files · Annual report leaflets" title="Biggest bills to print and post an MP's report">
        <RankList
          rows={PRINT_AND_POST.map((r) => ({
            key: r.slug,
            who: <Who face name={r.name} href={mp(r.slug)} p={r.p} />,
            side: r.seat,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
          }))}
        />
      </ChartFrame>

      <PointList
        items={[
          {
            key: "stainbank",
            title: <Who face name="Euan Stainbank" href={mp("falkirk")} p="Labour" note="£3,300" />,
            children: <>A year long sign with his name and details. A billboard of himself, paid by the folk he serves.</>,
          },
        ]}
      />

      {/* ------------------------------------------------------------ 5 */}
      <Finding n={5} of={FINDINGS} id="consultants">
        Consultants and PR firms, on top of their own staff
      </Finding>
      <P>Every MP gets a big budget for staff. Some still paid outside firms on top.</P>

      <CaseCard figure="£10,000" people={[person("Melanie Ward", "cowdenbeath-and-kirkcaldy", "Labour", "Cowdenbeath and Kirkcaldy")]}>
        <p>
          <strong>The biggest single consultant bill by any Scottish MP</strong>
        </p>
        <p>IPSA hides who got paid. She also billed £4,000 for PR help.</p>
      </CaseCard>

      <Receipt
        heading="Her two biggest outside help bills"
        lines={[
          { meta: "19 December 2024", what: "Policy and Office set up consultant", amount: "£10,000.00" },
          { meta: "16 July 2025", what: "Communications Support", amount: "£4,000.00" },
        ]}
        footer="Wording as printed by IPSA."
      />

      <PointList
        items={[
          {
            key: "ward-more",
            title: "More from Melanie Ward",
            children: (
              <>
                £7,000 for a local industrial strategy report, paid back four months later. £4,691
                at IKEA. £2,150 for drawings needed to get permission to paint and fit security at
                her listed office building. £1,443 for a survey before leasing an office.
              </>
            ),
          },
        ]}
      />

      <CaseCard figure="£35,792" people={[person("John Lamont", "berwickshire-roxburgh-and-selkirk", "Conservative", "Berwickshire, Roxburgh and Selkirk")]}>
        <p>
          <strong>13 bills to PR firm Peach Partners</strong>
        </p>
        <p>
          That is about £2,750 a bill, for speech notes, press help and social posts. The biggest
          was £9,125. Every penny came from his staff pot.
        </p>
      </CaseCard>

      <CaseCard figure="£9,600" people={[person("Gregor Poynton", "livingston", "Labour", "Livingston")]}>
        <p>
          <strong>Media help from PR firm BB Partners in Crawley</strong>
        </p>
      </CaseCard>

      {/* ------------------------------------------------------------ 6 */}
      <Finding n={6} of={FINDINGS} id="tv-licences">
        29 MPs billed you for a TV licence
      </Finding>
      <P>
        From 2022/23 to 2026/27, 29 Scottish MPs billed <strong>£10,754</strong> for TV licences. Homes
        pay £180 a year out of their own pocket.
      </P>
      <PointList
        items={[
          {
            key: "poynton-tv",
            title: <Who face name="Gregor Poynton" href={mp("livingston")} p="Labour" note="£688" />,
            children: <>Four licences in under a year.</>,
          },
          {
            key: "ahmed-tv",
            title: <Who face name="Dr Zubir Ahmed" href={mp("glasgow-south-west")} p="Labour" note="£349" />,
            children: <>Two in nine months: one online and one at a Co-op.</>,
          },
        ]}
      />
      <P>
        <Link href="/blog/scottish-mps-tv-licence-expenses">See all 29 Scottish MPs</Link>.
      </P>

      {/* ------------------------------------------------------------ 7 */}
      <Finding n={7} of={FINDINGS} id="phones">
        A £24,530 phone tab, and new gadgets
      </Finding>

      <CaseCard figure="£24,530" people={[person("Brendan O'Hara", "argyll-bute-and-south-lochaber", "SNP", "Argyll, Bute and South Lochaber")]}>
        <p>
          <strong>Mobile phone bills, March 2022 to June 2026</strong>
        </p>
        <p>That is about £110 a week. His biggest month was £909.24, in March 2026.</p>
      </CaseCard>

      <ChartFrame kicker="IPSA files · Phones and tech" title="Biggest single gadget claims">
        <RankList
          rows={GADGETS.map((r) => ({
            key: r.slug,
            who: <Who face name={r.name} href={mp(r.slug)} p={r.p} />,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            detail: r.detail,
          }))}
        />
      </ChartFrame>

      {/* ------------------------------------------------------------ 8 */}
      <Finding n={8} of={FINDINGS} id="perks">
        Dinners, a Christmas lunch, sofas and a column
      </Finding>

      <Receipt
        person={person("Christine Jardine", "edinburgh-west", "Lib Dem", "Edinburgh West")}
        heading="19 December 2025 · Two claims, one day"
        lines={[
          { what: "lunch staff team training Christmas", amount: "£250.80" },
          { what: "team building event", amount: "£259.31" },
        ]}
        total={{ label: "Total", amount: "£510.11" }}
        footer="Wording as printed by IPSA."
      />

      <Receipt
        person={person("Graeme Downie", "dunfermline-and-dollar", "Labour", "Dunfermline and Dollar")}
        heading="13 March 2025 · Hospitality"
        lines={[{ what: "Fife College hosted business dinner on behalf of Graeme Downie", amount: "£962.65" }]}
        footer="Wording as printed by IPSA (reference number left out)."
      />

      <PointList
        items={[
          {
            key: "nash",
            title: <Who face name="Pamela Nash" href={mp("motherwell-wishaw-and-carluke")} p="Labour" note="£3,182" />,
            children: <>Four DFS and IKEA bills for office furniture in 2025/26.</>,
          },
          {
            key: "doogan",
            title: <Who face name="Dave Doogan" href={mp("angus-and-perthshire-glens")} p="SNP" note="£892.80" />,
            children: <>A &quot;Newspaper Column Invoice&quot;. The file does not say what it was for.</>,
          },
        ]}
      />

      {/* ------------------------------------------------------------ 9 */}
      <Finding n={9} of={FINDINGS} id="second-homes">
        Second homes, paid for by you
      </Finding>
      <P>
        MPs work in two places, so you pay for a second home. They can own it and still bill you.
      </P>
      <P>
        Many councils, like East Lothian, charge double council tax on second homes. IPSA raised MP
        caps so taxpayers pick up that extra bill too. See{" "}
        <Link href="/blog/scottish-mp-expenses-and-freebies-investigation">
          who claimed the most for second homes in 2025/26
        </Link>
        .
      </P>

      {/* ------------------------------------------------------------ 10 */}
      <Finding n={10} of={FINDINGS} id="repeat-names">
        The names that keep coming up
      </Finding>
      <P>Read enough of these and the same names pop up again and again.</P>
      <PointList
        items={[
          {
            key: "downie",
            title: <Who face name="Graeme Downie" href={mp("dunfermline-and-dollar")} p="Labour" note="£151,954" />,
            children: (
              <>The highest non staff expenses in Scotland in 2025/26, a £41,435 London flat and a £2,936 letter folding machine.</>
            ),
          },
          {
            key: "law",
            title: <Who face name="Chris Law" href={mp("dundee-central")} p="SNP" note="£6,292 parking" />,
            children: <>The £3,090 broadband, a £28,200 London flat and the most on hotels in Europe (£2,822).</>,
          },
          {
            key: "macdonald",
            title: <Who face name="Angus MacDonald" href={mp("inverness-skye-and-west-ross-shire")} p="Lib Dem" note="£3,314 energy" />,
            children: <>The speech coach, the drains, and energy bills on a second home where he claims no rent.</>,
          },
          {
            key: "ward",
            title: <Who face name="Melanie Ward" href={mp("cowdenbeath-and-kirkcaldy")} p="Labour" note="£7,932 family travel" />,
            children: <>The £10,000 consultant, £4,691 at IKEA and Scotland&apos;s highest family travel bill.</>,
          },
        ]}
      />

      <H2 id="why-hidden">Why you have never heard of this</H2>
      <P>
        IPSA puts every claim online. But its 2025/26 file alone, for all 650 UK MPs, has 59,503
        rows. Many rows lump a whole year into one line, and some hide who got paid. It is not
        secret. Just almost nobody has time to read it.
      </P>
      <P>
        So we did. <Link href="/mp-expenses-scotland/search">Search every claim</Link>{" "}
        yourself, see <Link href="/mp-expenses-scotland/receipts">the oddest receipts</Link>, or
        check <Link href="/mp-expenses-scotland">all 57 Scottish MPs ranked</Link>.
      </P>

      <Aside title="All within the rules">
        <p>
          IPSA paid every claim on this page. No rule was broken. The real ask is why the rules let
          any of this happen.
        </p>
      </Aside>

      <PostCTA
        title="Search every Scottish MP claim (or check your MP)"
        body="Type your postcode. Filter by Amazon, IKEA, TV licence, speech coach or taxi. Copy any claim or email your MP."
        href="/mp-expenses-scotland/search"
        cta="Open the Receipt Finder"
      />
    </Prose>
  );
}
