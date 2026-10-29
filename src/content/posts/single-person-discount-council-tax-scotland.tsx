import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA, BigStat } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { SINGLE_PERSON_DISCOUNT as SPD } from "@/lib/data/councilTaxHelp";
import { bandDRange, bandFor, pounds } from "@/lib/data/quickAnswers";
import { COUNCIL_SEARCH_NAMES, councilTaxPath } from "@/lib/routeMap";

/** The big four cities, a few large councils, and whoever is cheapest and dearest at Band D. */
const FEATURED = ["glasgow-city", "city-of-edinburgh", "aberdeen-city", "dundee-city", "fife", "highland", "north-lanarkshire"];

function discountRows() {
  const { lowest, highest } = bandDRange();
  const slugs = [...new Set([...FEATURED, lowest.slug, highest.slug])];
  return slugs
    .map((slug) => {
      const bill = bandFor(slug, "D").total;
      const saving = (bill * SPD.percent) / 100;
      return { slug, name: COUNCIL_SEARCH_NAMES[slug], bill, saving, pay: bill - saving };
    })
    .sort((a, b) => b.bill - a.bill);
}

export default function Post() {
  const rows = discountRows();
  const glasgow = rows.find((r) => r.slug === "glasgow-city")!;
  const { lowest, highest } = bandDRange();

  return (
    <Prose>
      <Lead>
        If you&apos;re the only adult in your home, you get {SPD.percent}% off your council tax
        bill. It comes off the water and waste water charges too. What you earn doesn&apos;t matter,
        but it isn&apos;t automatic. You have to ask your council for it.
      </Lead>

      <H2 id="worth">What {SPD.percent}% off Band D is worth</H2>
      <P>
        The discount comes off the whole bill, water included. Here&apos;s what it saves on a Band D
        home in 2026/27.
      </P>
      <BigStat
        value={pounds(glasgow.saving)}
        label="Saved a year on a Band D home in Glasgow"
        exact={`${pounds(glasgow.bill, true)} becomes ${pounds(glasgow.pay, true)}, council tax and water together.`}
      />
      <GuideTable
        kicker="Band D, 2026/27"
        title={`What ${SPD.percent}% off saves`}
        columns={["Council", "Full bill", "You save", "You pay"]}
        align={["left", "right", "right", "right"]}
        rows={rows.map((r) => [
          <Link key={r.slug} href={councilTaxPath(r.slug)}>
            {r.name}
          </Link>,
          pounds(r.bill, true),
          pounds(r.saving, true),
          pounds(r.pay, true),
        ])}
        caption={`Council tax plus Scottish Water's charges. ${COUNCIL_SEARCH_NAMES[highest.slug]} has the highest Band D bill in Scotland and ${COUNCIL_SEARCH_NAMES[lowest.slug]} the lowest. Pick a council to see every band.`}
      />
      <P>
        Your home may not be Band D, so check yours. You can{" "}
        <Link href="/check-council-tax-band">check your council tax band</Link> free by postcode,
        then take a quarter off the figure on your council&apos;s page.
      </P>

      <H2 id="who-counts">Who counts as an adult</H2>
      <P>
        An adult is anyone aged 18 or over. But some adults are disregarded, which means they
        don&apos;t count. If everyone else in your home is disregarded, you still get the{" "}
        {SPD.percent}% off. The main ones are:
      </P>
      <UL>
        <LI>full time students and student nurses</LI>
        <LI>some apprentices and youth trainees</LI>
        <LI>someone aged 18 or over you still get Child Benefit for, who is in full time education</LI>
        <LI>
          a carer who gives at least 35 hours of care a week to someone on certain disability
          benefits, as long as that person isn&apos;t their partner or a child under 18
        </LI>
        <LI>someone classed as severely mentally impaired who gets certain benefits</LI>
        <LI>a care leaver aged 18 to 25</LI>
        <LI>someone living permanently in a care home, or in hospital long term</LI>
        <LI>someone in prison or detention</LI>
      </UL>
      <P>
        If everyone in the home is disregarded, the discount goes up to{" "}
        {SPD.everyoneDisregardedPercent}%. And a home where everyone is a full time student pays no
        council tax at all.
      </P>

      <H2 id="apply">How to claim the single person discount</H2>
      <P>
        Apply to your council. Look for the single person discount form on its council tax pages.
        In Edinburgh, for example, the council has to have you down as living at the address before
        it&apos;ll give the discount.
      </P>
      <P>
        Councils check these claims. South Lanarkshire is reviewing single person discounts and
        writes to people asking them to fill in a short online form. Edinburgh says it may ask for
        more information or evidence. If a letter like that arrives, reply to it.
      </P>

      <H2 id="moves-in">What happens if someone moves in</H2>
      <P>
        The discount stops from the day another adult who isn&apos;t disregarded moves in. That
        includes a partner.
      </P>
      <UL>
        <LI>
          You have to tell the council in writing within {SPD.notifyDays} days of when you know
          the discount should stop.
        </LI>
        <LI>If you don&apos;t, the council can charge you a {pounds(SPD.penalty)} penalty.</LI>
        <LI>The council works the bill out again, without the discount, from the day they moved in.</LI>
      </UL>
      <P>
        If the person moving in is disregarded, a student say, you keep the discount. Tell the
        council anyway, and be ready to show proof.
      </P>
      <Aside title="Can I get this and Council Tax Reduction?">
        <p>
          Yes. The {SPD.percent}% comes off first, then{" "}
          <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link> is worked out on
          what&apos;s left. If your income is low, claim both.
        </p>
      </Aside>

      <H2 id="other-discounts">Council tax discounts Scotland: the others worth knowing</H2>
      <P>
        The single person discount is the most common one. These are the others I&apos;d check.
      </P>
      <H3>A home adapted for a disabled person</H3>
      <P>
        If your home has an extra bathroom or kitchen, an extra room, or space to use a wheelchair
        indoors because someone has a disability, you may be charged at the band below yours. Band
        D pays the Band C rate. Even Band A gets a partial reduction. It covers the water too. In
        Edinburgh the council visits the home to check.
      </P>
      <H3>Homes where nobody counts</H3>
      <P>
        A home lived in only by full time students, only by people under 18, or only by care
        leavers pays no council tax.
      </P>
      <H3>Help if your income is low</H3>
      <P>
        <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link> can take up to
        all of the council tax off. If you share with another adult on a low income, the{" "}
        <Link href="/council-tax-reduction-scotland#second-adult">second adult rule</Link> may
        help instead.
      </P>
      <P>
        The water and waste water charges follow most of these discounts. The{" "}
        <Link href="/water-rates-scotland">water rates Scotland</Link> page has the full charge for
        every band.
      </P>

      <PostCTA
        title="See your bill before and after"
        body="Put in your postcode and pick your band. You'll see the full 2026/27 bill, water included, and then you can take a quarter off."
        href="/council-tax-bands-scotland"
        cta="Check my council tax"
      />
    </Prose>
  );
}
