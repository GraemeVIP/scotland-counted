import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { BEST_START } from "@/lib/data/benefits";
import { pounds } from "@/lib/data/quickAnswers";

/**
 * The Education (Scotland) Act 1980 (Modification) Regulations 2026, SSI 2026/19:
 * the Universal Credit earned income limit for free school lunches from 1 April 2026.
 */
const UC_EARNINGS_LIMIT = { now: 995, before: 850, from: "1 April 2026" } as const;

/** The national minimum every council must pay, per child, per year. */
const CLOTHING_MINIMUM = { primary: 120, secondary: 150 } as const;

/** As published on each council's website, checked 29 October 2026. */
const COUNCIL_CLOTHING_GRANTS = [
  { council: "Highland", slug: "highland", primary: 166.5, secondary: 178.5, note: "Holiday meal payments follow without a separate form" },
  { council: "South Lanarkshire", slug: "south-lanarkshire", primary: 150, secondary: 170, note: "Nursery children get £150 too. Paid from 26 June 2026" },
  { council: "Midlothian", slug: "midlothian", primary: 120, secondary: 150, note: "Paid once a year, between summer and the end of March" },
  { council: "Moray", slug: "moray", primary: 120, secondary: 150, note: "One claim per child each year, April to March" },
];

/** Moray Council's published holiday payments for 2026/27, per child. */
const MORAY_HOLIDAY_PAYMENTS = [
  { holiday: "October 2026", primary: 25.5, secondary: 29, paid: "Tuesday 13 October 2026" },
  { holiday: "Christmas 2026", primary: 25.5, secondary: 29, paid: "Tuesday 22 December 2026" },
  { holiday: "February 2027 mid term", primary: 5.1, secondary: 5.8, paid: "Tuesday 9 February 2027" },
];

const money = (value: number) => pounds(value, !Number.isInteger(value));

export default function Post() {
  return (
    <Prose>
      <Lead>
        In Scotland every pupil in P1 to P5 gets a free school lunch, and older pupils get free
        meals and a clothing grant if the family gets a qualifying benefit, such as Universal Credit
        with earnings of {pounds(UC_EARNINGS_LIMIT.now)} a month or less. The school clothing grant
        is at least {pounds(CLOTHING_MINIMUM.primary)} for a primary pupil and{" "}
        {pounds(CLOTHING_MINIMUM.secondary)} for a secondary pupil, and you claim both from your
        council.
      </Lead>
      <P>
        Some of this help is automatic and some has to be claimed. The rules also change with a
        child&apos;s school year, so a family can qualify for one thing and miss another.
      </P>

      <H2 id="meals">Who gets free school meals in Scotland</H2>
      <UL>
        <LI>Every pupil in primary 1 to primary 5 at a publicly funded school gets a free lunch.</LI>
        <LI>Every pupil at a publicly funded special school gets a free lunch.</LI>
        <LI>Eligible children in funded early learning and childcare get a meal on attendance days.</LI>
      </UL>
      <P>
        These universal meals do not depend on family income. Independent school and home educated
        children are not included in the universal offer.
      </P>

      <H2 id="eligibility">Free school meals eligibility in Scotland after P5</H2>
      <P>
        From P6 to S6, a pupil gets free school meals when the family gets one of the benefits
        below. The same benefits are the usual route to the clothing grant and holiday payments.
      </P>
      <GuideTable
        kicker={`From ${UC_EARNINGS_LIMIT.from}`}
        title="Benefits that give free school meals"
        columns={["Benefit", "Condition"]}
        rows={[
          ["Universal Credit", `Monthly earned income of ${pounds(UC_EARNINGS_LIMIT.now)} or less, yours or yours and your partner's together`],
          ["Pension Credit", "Guarantee Credit or Savings Credit. New from April 2026"],
          ["Income Support", "No earnings test"],
          ["Income based Jobseeker's Allowance", "No earnings test"],
          ["Income related Employment and Support Allowance", "No earnings test"],
          ["Asylum support", "Support under Part VI of the Immigration and Asylum Act 1999"],
          ["Scottish Child Payment", "P6 and P7 only, and meals only"],
        ]}
        caption={`The Universal Credit limit rose from ${pounds(UC_EARNINGS_LIMIT.before)} to ${pounds(UC_EARNINGS_LIMIT.now)} on ${UC_EARNINGS_LIMIT.from}, to keep pace with the National Living Wage. Young people aged 16 to 18 who get one of these benefits in their own right can also qualify.`}
      />
      <Aside title="Register even when a younger child's lunch is already free">
        <p>
          Benefit based registration can unlock help in school holidays and the clothing grant. Do
          not assume the universal P1 to P5 lunch has registered the family for everything else.
        </p>
      </Aside>

      <H2 id="p6-p7">Free school meals Scotland: P6 and P7</H2>
      <P>
        In primary 6 and 7, a child can get free school meals when the family gets{" "}
        <Link href="/scottish-child-payment">Scottish Child Payment</Link>, as well as through the
        benefits above. The Scottish Child Payment route covers lunches only. Councils such as
        Highland, Midlothian and Moray say it does not give the clothing grant or holiday payments
        on its own.
      </P>
      <P>
        If the family also gets Universal Credit with earnings under the limit, apply on that basis
        too, because it unlocks the clothing grant and holiday help as well.
      </P>

      <H2 id="clothing">School clothing grant Scotland: how much you get</H2>
      <BigStat
        value={`at least ${pounds(CLOTHING_MINIMUM.primary)} or ${pounds(CLOTHING_MINIMUM.secondary)}`}
        label="for each child who qualifies, once a year"
        exact={`At least ${pounds(CLOTHING_MINIMUM.primary)} for a primary age child and ${pounds(CLOTHING_MINIMUM.secondary)} for a secondary age child. Councils can pay more.`}
      />
      <P>
        The clothing grant, often called the uniform grant, is normally cash paid into a bank
        account for uniforms, clothing and shoes. You apply to the council. The amounts and income
        rules vary locally, and some councils pay well above the minimum.
      </P>
      <GuideTable
        kicker="2026/27 examples"
        title="What some councils pay"
        columns={["Council", "Primary", "Secondary", "Notes"]}
        align={["left", "right", "right", "left"]}
        rows={[
          ["National minimum", pounds(CLOTHING_MINIMUM.primary), pounds(CLOTHING_MINIMUM.secondary), "Every council must pay at least this"],
          ...COUNCIL_CLOTHING_GRANTS.map((row) => [
            <Link key="c" href={`/councils/${row.slug}`}>{row.council}</Link>,
            money(row.primary),
            money(row.secondary),
            row.note,
          ]),
        ]}
        caption="Taken from each council's free school meals and clothing grant page on 29 October 2026. South Lanarkshire uses a higher Universal Credit earnings limit for the clothing grant, under £1,660 a month. Check your own council's page for its amount."
      />
      <P>
        The clothing grant is separate from the{" "}
        <Link href="/best-start-grant">Best Start Grant</Link> School Age Payment of{" "}
        {pounds(BEST_START.schoolAge, true)}, paid once in the year a child is first old enough for
        P1, and from <Link href="/scottish-child-payment">Scottish Child Payment</Link>. A family can
        qualify for all three.
      </P>

      <H2 id="holidays">Help in school holidays</H2>
      <P>
        Families who qualify for benefit based free school meals may also get council support in
        the summer, Christmas, Easter and shorter holidays. Depending on the council, this may be a
        cash payment, food voucher or another local arrangement.
      </P>
      <GuideTable
        kicker="Example: Moray Council"
        title="Holiday payments per child"
        columns={["Holiday", "Primary", "Secondary", "Paid on"]}
        align={["left", "right", "right", "left"]}
        rows={MORAY_HOLIDAY_PAYMENTS.map((row) => [row.holiday, pounds(row.primary, true), pounds(row.secondary, true), row.paid])}
        caption="Moray Council's published dates and amounts for 2026/27. Other councils set their own."
      />
      <P>
        Holiday help income rules are not always identical to the term time meal rules. Moray, for
        example, uses a slightly lower Universal Credit earnings limit for holiday payments. Check
        the local page instead of assuming one award automatically triggers the other.
      </P>

      <H2 id="apply">How to apply</H2>
      <H3>Use one council application where possible</H3>
      <UL>
        <LI>Check free school meals for every child, including P6, P7 and secondary pupils.</LI>
        <LI>Tick the school clothing grant option if the form combines them.</LI>
        <LI>Ask whether holiday support needs a separate registration.</LI>
        <LI>If you get Universal Credit, have your latest statement ready. Some councils ask for it even when earnings are £0.</LI>
        <LI>Keep the award notice in case the school or another scheme asks for proof.</LI>
      </UL>
      <P>
        Many councils ask you to claim again for each school year, so check every summer. A school
        office or council welfare team can help when the online form is difficult. If the family
        has no money for food today, do not wait for a school application, check the{" "}
        <Link href="/crisis-grant-scotland">crisis grant</Link> as well.
      </P>

      <PostCTA
        title="Find the council application"
        body="Start with your council area. The official sources below contain the national rules and the council pages used for the local figures."
        href="/areas"
        cta="Find my council"
      />
    </Prose>
  );
}
