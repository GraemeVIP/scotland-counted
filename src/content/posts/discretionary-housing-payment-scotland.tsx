import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";

/** Scottish Government, Discretionary Housing Payments in Scotland: 1 April 2025 to 31 March 2026. */
const DHP_BUDGET_2025_26 = {
  total: 97.1,
  bedroomTax: 79.7,
  benefitCap: 9.5,
  other: 7.9,
} as const;

/** GOV.UK: the cut to eligible rent in social housing for spare bedrooms. */
const SPARE_ROOM_CUT = { one: 14, twoOrMore: 25 } as const;

/** An illustration only, not a typical rent. */
const EXAMPLE_RENT = 400;

const millions = (value: number) => `£${value.toFixed(1)} million`;

export default function Post() {
  const oneRoomShortfall = (EXAMPLE_RENT * SPARE_ROOM_CUT.one) / 100;
  const twoRoomShortfall = (EXAMPLE_RENT * SPARE_ROOM_CUT.twoOrMore) / 100;

  return (
    <Prose>
      <Lead>
        A Discretionary Housing Payment, usually shortened to DHP, is extra money from your council
        when Housing Benefit or the housing part of Universal Credit does not cover your rent. In
        Scotland it is used to cancel out the bedroom tax in full, and it can also help with the
        benefit cap, private rent gaps, deposits and moving costs.
      </Lead>

      <H2 id="what-it-is">What a discretionary housing payment is</H2>
      <P>
        DHP is a separate council payment on top of your housing benefit support. It is not
        automatic just because there is a rent gap. You have to apply, and the council looks at the
        household, the cause of the gap, the money available and what the payment would achieve.
      </P>
      <Aside title="It is different from Local Housing Allowance">
        <p>
          <Link href="/blog/local-housing-allowance-rent-shortfall-scotland">Local Housing
          Allowance</Link> sets a benefit cap for private rent. DHP is the extra pot a council can
          use when normal housing support still leaves a problem.
        </p>
      </Aside>

      <H2 id="bedroom-tax">Bedroom tax Scotland: why you should not have to pay it</H2>
      <P>
        The bedroom tax is the UK rule that cuts housing support for council and housing
        association tenants with a spare bedroom. Your eligible rent is cut by{" "}
        {SPARE_ROOM_CUT.one}% for one spare bedroom and {SPARE_ROOM_CUT.twoOrMore}% for two or more.
        The rule still applies in Scotland, but the Scottish Government pays councils to cover it
        through DHP.
      </P>
      <P>
        The national DHP guidance says ministers are committed to fully mitigating the bedroom tax,
        and expect anyone affected who applies to get a DHP that covers the shortfall. So if you are
        paying it yourself, apply.
      </P>
      <GuideTable
        kicker="Example"
        title={`A social rent of £${EXAMPLE_RENT} a month`}
        columns={["Spare bedrooms", "Cut to housing support", "DHP should cover"]}
        align={["left", "right", "right"]}
        rows={[
          ["None", "£0", "Nothing to cover"],
          ["One", `£${oneRoomShortfall} a month`, `£${oneRoomShortfall} a month`],
          ["Two or more", `£${twoRoomShortfall} a month`, `£${twoRoomShortfall} a month`],
        ]}
        caption={`An illustration, not a typical rent. The cut is ${SPARE_ROOM_CUT.one}% or ${SPARE_ROOM_CUT.twoOrMore}% of the eligible rent, which can be a little lower than the rent on your tenancy if it includes service charges.`}
      />

      <H2 id="benefit-cap">The benefit cap</H2>
      <P>
        The benefit cap limits the total a working age household can get from most benefits. When
        it cuts your housing support, the Scottish Government aims to mitigate it as fully as the
        DHP rules allow, and it funds councils separately for this. The wording is less firm than for
        the bedroom tax, so give the council a clear picture of your budget when you apply.
      </P>

      <H2 id="who">Who can apply</H2>
      <P>
        You must normally rent your home and already get Housing Benefit or the housing element of
        Universal Credit. A low income alone is not enough if neither benefit is in payment.
      </P>
      <P>
        Apply to the council that deals with your housing costs. The application is free. You can
        ask a welfare rights adviser, housing officer or Citizens Advice to help with the form.
      </P>

      <H2 id="covers">What it may cover</H2>
      <UL>
        <LI>A shortfall caused by the bedroom tax in social housing.</LI>
        <LI>A shortfall caused by the benefit cap.</LI>
        <LI>Some private rent gaps where Local Housing Allowance is lower than the rent.</LI>
        <LI>In some cases, a deposit, rent in advance or reasonable moving costs.</LI>
      </UL>
      <P>
        A council may award a one off payment or help for a limited period. It may expect a longer
        term plan, such as a benefit check, a move to affordable housing or action on an incorrect
        rent decision.
      </P>

      <H2 id="budget">How much councils have to spend</H2>
      <P>
        The published DHP budget for Scotland in 2025/26 was {millions(DHP_BUDGET_2025_26.total)}.
        Most of it was set aside for the bedroom tax.
      </P>
      <GuideTable
        kicker="Scotland, 2025/26"
        title="Discretionary Housing Payment budget"
        columns={["What it is for", "Budget"]}
        align={["left", "right"]}
        rows={[
          ["Bedroom tax", millions(DHP_BUDGET_2025_26.bedroomTax)],
          ["Benefit cap", millions(DHP_BUDGET_2025_26.benefitCap)],
          ["Everything else, including private rent gaps", millions(DHP_BUDGET_2025_26.other)],
          ["Total", millions(DHP_BUDGET_2025_26.total)],
        ]}
        caption="Scottish Government, Discretionary Housing Payments in Scotland, 1 April 2025 to 31 March 2026."
      />
      <P>
        The bedroom tax and benefit cap money is set separately from the general allocation. Help
        with every other rent gap, including most private rent shortfalls, comes from the much
        smaller general pot, so there is less of it to go round.
      </P>

      <H2 id="apply">How to apply for a discretionary housing payment in Scotland</H2>
      <P>
        Every council has its own DHP form, usually on its housing benefit or benefits pages. That
        is true in Edinburgh, Glasgow and every other council. Find your council, then search its
        website for discretionary housing payment.
      </P>
      <H3>Show the whole budget</H3>
      <P>
        List income and essential costs honestly. Include food, energy, travel, disability costs,
        childcare and debt repayments. A bank statement does not explain every unusual payment, so
        add a short note where needed.
      </P>
      <H3>Explain what the payment prevents</H3>
      <UL>
        <LI>Rent arrears or homelessness.</LI>
        <LI>A move that would disrupt children&apos;s schooling or essential care.</LI>
        <LI>Loss of an adapted or otherwise suitable home.</LI>
        <LI>Immediate hardship while a benefit error or housing move is resolved.</LI>
      </UL>

      <H2 id="next">What happens next</H2>
      <P>
        Keep the decision and note when the award ends. If refused, ask for reasons and the local
        review process. A change in rent, income, benefits or household circumstances can justify a
        fresh application.
      </P>
      <P>
        When the immediate problem is food or heating rather than rent, the right route may be a{" "}
        <Link href="/crisis-grant-scotland">Scottish Welfare Fund crisis grant</Link> instead. If
        council tax is adding to the pressure, check{" "}
        <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link>.
      </P>

      <PostCTA
        title="Apply to the council that handles your rent help"
        body="Every Scottish council has its own DHP form. Start from your area page, then follow the council's official housing support route."
        href="/areas"
        cta="Find my council"
      />
    </Prose>
  );
}
