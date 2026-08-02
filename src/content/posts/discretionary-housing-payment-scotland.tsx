import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";

export default function Post() {
  return (
    <Prose>
      <Lead>
        If Housing Benefit or the housing part of Universal Credit does not cover your rent, a
        Discretionary Housing Payment — usually shortened to DHP — may give extra help through the
        council.
      </Lead>

      <H2 id="what-it-is">What the payment is</H2>
      <P>
        DHP is a separate council payment on top of housing benefit support. It is not automatic
        just because there is a rent gap. The council looks at the household, the cause of the
        gap, the money available and what the payment would achieve.
      </P>
      <Aside title="It is different from Local Housing Allowance">
        <p>
          <Link href="/blog/local-housing-allowance-rent-shortfall-scotland">Local Housing
          Allowance</Link> sets a benefit cap for private rent. DHP is the extra pot a council can
          use when normal housing support still leaves a problem.
        </p>
      </Aside>

      <H2 id="who">Who can apply</H2>
      <P>
        You must normally rent your home and already get Housing Benefit or the housing element of
        Universal Credit. A low income alone is not enough if neither benefit is in payment.
      </P>
      <P>
        Apply to the council that deals with your housing costs. The application is free. You can
        ask a welfare-rights adviser, housing officer or Citizens Advice to help with the form.
      </P>

      <H2 id="covers">What it may cover</H2>
      <UL>
        <LI>A shortfall caused by the bedroom tax in social housing.</LI>
        <LI>A shortfall caused by the benefit cap.</LI>
        <LI>Some private-rent gaps where Local Housing Allowance is lower than the rent.</LI>
        <LI>In some cases, a deposit, rent in advance or reasonable moving costs.</LI>
      </UL>
      <P>
        A council may award a one-off payment or help for a limited period. It may expect a longer
        term plan, such as a benefit check, a move to affordable housing or action on an incorrect
        rent decision.
      </P>

      <H2 id="apply">How to make a strong application</H2>
      <H3>Show the whole budget</H3>
      <P>
        List income and essential costs honestly. Include food, energy, travel, disability costs,
        childcare and debt repayments. A bank statement does not explain every unusual payment,
        so add a short note where needed.
      </P>
      <H3>Explain what the payment prevents</H3>
      <UL>
        <LI>Rent arrears or homelessness.</LI>
        <LI>A move that would disrupt children’s schooling or essential care.</LI>
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
        When the immediate problem is food or heating rather than rent, the right route may be a
        <Link href="/blog/crisis-grant-scotland-how-to-apply"> Scottish Welfare Fund Crisis
        Grant</Link> instead.
      </P>

      <PostCTA
        title="Apply to the council that handles your rent help"
        body="Every Scottish council has its own DHP form. Start from your area page, then follow the council's official housing-support route."
        href="/areas"
        cta="Find my council"
      />
    </Prose>
  );
}
