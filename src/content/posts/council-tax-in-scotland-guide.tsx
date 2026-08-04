import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";

export default function Post() {
  return (
    <Prose>
      <Lead>
        Council tax is not one number. Your property has a band, your council puts a price on that
        band, and Scottish Water adds separate charges to the same bill. Discounts and help are
        applied after that.
      </Lead>

      <Aside title="Want the price, not the explanation?">
        <p>
          Use the <Link href="/council-tax-bands-scotland">Scottish council tax checker</Link>.
          Enter your postcode to find your council automatically, then choose the band shown on
          your bill or on the Scottish Assessors website.
        </p>
      </Aside>

      <H2 id="what-it-pays-for">1. What council tax pays for</H2>
      <P>
        Council tax goes to your local council. It helps pay for local services such as bin
        collections, roads, schools, social care and keeping public places running. It does not
        buy you a personal share of each service. It is a local tax used across the council area.
      </P>
      <P>
        Councils also receive money from the Scottish Government and other sources. That is why
        the council tax bill is important, but it is not the whole council budget.
      </P>

      <H2 id="who-pays">2. Who has to pay</H2>
      <P>
        A full bill assumes at least two adults live in the home. Usually the adults who own or
        rent and live in the property are responsible. Couples who live together can both be
        responsible even when only one name appears first on the letter.
      </P>
      <P>
        Some rented homes have different rules. In a house where separate households rent
        individual rooms and share facilities, the owner may be responsible instead. If a bill
        names the wrong person, contact the council rather than ignoring it.
      </P>

      <H2 id="band">3. What your band means</H2>
      <P>
        Every home sits in a band from A to H. Band A is the lowest and H is the highest. In
        Scotland the band is based on what the property could have sold for on 1 April 1991, not
        what it is worth today and not what you paid for it.
      </P>
      <UL>
        <LI>Band A means a 1991 value of up to £27,000.</LI>
        <LI>Band D means £45,001 to £58,000.</LI>
        <LI>Band H means more than £212,000.</LI>
      </UL>
      <P>
        A postcode cannot tell you the exact band because neighbouring properties can differ.
        Look up the address free on the Scottish Assessors Association website, then use my
        council page for the current cost.
      </P>

      <H2 id="bill">4. How the bill is worked out</H2>
      <P>
        Each council sets one main figure: its Band D charge. The other bands are fixed
        proportions of Band D. A Band A home pays two-thirds of the Band D council-tax charge;
        higher bands pay more. The proportions are set nationally, but each council chooses its
        own Band D starting point.
      </P>
      <P>
        That is why two Band A homes in different council areas can have different bills. See the
        exact annual and monthly figures for <Link href="/council-tax-bands-scotland">all 32
        councils and every band</Link>, or compare the{" "}
        <Link href="/blog/council-tax-rises-scotland-2026-27">
          2026/27 council tax rise in every council
        </Link>.
      </P>

      <H2 id="water">5. Why water is on the same bill</H2>
      <P>
        Most Scottish households pay Scottish Water through the council tax bill. The council is
        collecting the money, but the water and waste-water lines are not council tax. In 2026–27
        they add £434.88 a year at Band A and £652.32 at Band D.
      </P>
      <Aside title="Why online figures often look too low">
        <p>
          Many pages quote only the council-tax part. The bill through your door normally includes
          council tax, water and waste water. My calculator shows all three separately and then
          gives the total.
        </p>
      </Aside>

      <H2 id="discounts">6. Discounts and exemptions</H2>
      <P>You may not owe the full bill. Common routes include:</P>
      <UL>
        <LI>A 25% discount when only one adult in the home is counted.</LI>
        <LI>No council tax when every resident is a qualifying full-time student.</LI>
        <LI>A lower band charge when the home has qualifying disability adaptations.</LI>
        <LI>Discounts or exemptions where someone has a severe mental impairment.</LI>
      </UL>
      <P>
        The council will not always know automatically. Ask it to check every discount and
        exemption that may fit the household, and tell it when circumstances change.
      </P>

      <H2 id="reduction">7. Help when your income is low</H2>
      <P>
        Council Tax Reduction is means-tested help run by your council under a Scottish scheme. It
        can remove part of the council-tax charge or reduce it to zero. The decision depends on
        income, savings, benefits, children, disability and who else lives with you.
      </P>
      <P>
        A zero council-tax charge does not always mean a zero bill because water can remain.
        Households receiving Council Tax Reduction can also get up to 35% off water and waste
        water through a scheme the council applies automatically.
      </P>

      <H2 id="challenge">8. Challenging a band</H2>
      <P>
        The Assessor sets the band, not the council. A challenge in Scotland is called a proposal.
        One clear route is to submit it within six months of becoming the owner or the person
        responsible for the bill. Other routes exist after a banding notice, a relevant tribunal
        decision or a material change to the property or area.
      </P>
      <P>
        Compare genuinely similar homes before applying: same type, size, position and history.
        A review can leave the band unchanged and can expose evidence that another property should
        move up, so do not submit a guess based only on a current online valuation.
      </P>

      <H2 id="moving">9. Moving home or missing payments</H2>
      <H3>When you move</H3>
      <P>
        Tell the old and new councils promptly. Give the moving date, both addresses and the names
        of the adults moving. Owners should also say whether the old home is empty, sold or rented
        out. Keep the closing and opening bills so overlapping dates can be corrected.
      </P>
      <H3>If you cannot pay</H3>
      <P>
        Council tax is a priority debt. Contact the council as soon as you know a payment will be
        missed. Ask for smaller instalments and a full check of reduction, discounts and
        exemptions. If the emergency is immediate, a <Link href="/blog/crisis-grant-scotland-how-to-apply">Crisis
        Grant</Link> may help with food or heating while you deal with the bill.
      </P>

      <H2 id="empty-homes">10. Empty homes and second homes</H2>
      <P>
        Councils have discretion over many empty and second-home charges. A home empty for long
        enough can face an increase of up to 100%, but important exemptions remain, including
        some homes being sold or let, properties under structural repair, and homes left empty
        because the owner is in long-term care, hospital or prison.
      </P>
      <P>
        These rules depend on the reason, dates and the council’s policy. Tell the council rather
        than assuming an empty property owes nothing.
      </P>

      <PostCTA
        title="See the bill for your own area"
        body="Enter your postcode, choose your band and see council tax, water, waste water and the monthly total. The calculator covers every Scottish council without making you know the council name first."
        href="/council-tax-bands-scotland"
        cta="Check my council tax"
      />
    </Prose>
  );
}
