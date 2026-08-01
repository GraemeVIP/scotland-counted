import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";

export default function Post() {
  return (
    <Prose>
      <Lead>
        When a private renter gets Housing Benefit or the housing part of Universal Credit, the
        tenancy agreement does not decide the maximum help. Local Housing Allowance does.
      </Lead>

      <H2 id="what-it-is">What Local Housing Allowance is</H2>
      <P>
        Scotland is divided into Broad Rental Market Areas. Each area has weekly caps for a shared
        room and for homes with one to four bedrooms. The relevant cap depends on where you live
        and how many bedrooms the benefit rules say the household needs.
      </P>
      <P>
        If the actual eligible rent is lower than the cap, help cannot be higher than the rent. If
        the rent is higher, the cap can leave a shortfall that must come from the rest of the
        household income.
      </P>

      <H2 id="frozen">Why the 2026 rates are already behind</H2>
      <P>
        The 2026–27 Scottish rates are frozen at the cash levels set in January 2024. They were
        based on the cheaper end of the market at that time. Rent Service Scotland also publishes
        newer 2025 evidence showing what the lower part of today’s market looks like — but that
        newer evidence was not used to raise the benefit caps.
      </P>
      <Aside title="The policy split matters">
        <p>
          Rent and housing law are devolved to Scotland. Local Housing Allowance inside Universal
          Credit is controlled by the UK Government. A renter can therefore face a Scottish rent
          market with a Westminster benefit cap based on older figures.
        </p>
      </Aside>

      <H2 id="glasgow">The Greater Glasgow gap</H2>
      <BigStat
        value="about £172 a month"
        label="the gap between the one-bedroom LHA cap and the 2025 Greater Glasgow advertised-rent average"
        exact="LHA: £159.95 a week, about £693 a month. Average advertised one-bedroom rent in 2025: £865 a month."
      />
      <P>
        This is not a claim that every one-bedroom tenant pays £865. The rent statistic mainly
        reflects homes advertised or newly let, while some existing tenants pay less. It shows the
        problem facing someone trying to move now: the benefit cap is below the current average.
      </P>

      <H2 id="bedrooms">Which bedroom rate applies</H2>
      <P>
        The benefit system has rules for how many bedrooms a household needs. Children may be
        expected to share depending on age and sex. A single person under 35 will often receive
        only the shared-accommodation rate unless an exemption applies.
      </P>
      <P>
        Do not guess from the number of bedrooms in the property. Check the household’s allowed
        size and any disability, care, foster-care, domestic-abuse or homelessness exception that
        may apply.
      </P>

      <H2 id="help">What to do about a shortfall</H2>
      <H3>Check the calculation first</H3>
      <UL>
        <LI>Confirm the correct rental market area and bedroom entitlement.</LI>
        <LI>Check that the eligible rent and all household details are right.</LI>
        <LI>Challenge a decision if the wrong rate or household size was used.</LI>
      </UL>
      <H3>Ask the council for extra help</H3>
      <P>
        A <Link href="/blog/discretionary-housing-payment-scotland">Discretionary Housing
        Payment</Link> can sometimes cover some or all of a rent gap. It can also help with a
        deposit, rent in advance or moving costs in some cases. The fund is discretionary, so give
        the council a clear budget and explain what will happen without the payment.
      </P>

      <PostCTA
        title="The cap is a political choice"
        body="Local Housing Allowance rates are decided at Westminster. We find your MP automatically, add the housing evidence and prepare the email in ordinary language."
        href="/take-action"
        cta="Email my MP"
      />
    </Prose>
  );
}
