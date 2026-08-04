import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";

export default function Post() {
  return (
    <Prose>
      <Lead>
        Scotland has universal free lunches for younger primary pupils, benefit-based meals for
        many older children, and a separate cash grant for school clothes. The help can overlap,
        but some of it still has to be claimed.
      </Lead>

      <H2 id="meals">Who gets free school meals</H2>
      <UL>
        <LI>Every pupil in primary 1 to primary 5 at a publicly funded school gets a free lunch.</LI>
        <LI>Every pupil at a publicly funded special school gets a free lunch.</LI>
        <LI>Eligible children in funded early learning and childcare get a meal on attendance days.</LI>
      </UL>
      <P>
        These universal meals do not depend on family income. Independent-school and home-educated
        children are not included in the universal offer.
      </P>

      <H2 id="older">The rules after primary 5</H2>
      <P>
        In primary 6 and 7, a child can qualify when the family gets Scottish Child Payment or
        another listed benefit. In secondary school, the family usually qualifies through a listed
        benefit or a low Universal Credit earned-income figure.
      </P>
      <Aside title="Register even when a younger child's lunch is already free">
        <p>
          Benefit-based registration can unlock help in school holidays and other support. Do not
          assume the universal P1-to-P5 meal has registered the family for everything else.
        </p>
      </Aside>

      <H2 id="clothing">School clothing grants</H2>
      <BigStat
        value="at least £120 or £150"
        label="for each child who qualifies, once a year"
        exact="At least £120 for a primary-age child and £150 for a secondary-age child. Councils can pay more."
      />
      <P>
        The grant is normally cash paid into a bank account for uniforms, clothing and shoes. You
        apply to the council. The rules and application dates vary locally, so a family refused
        in one year should check again if income or the council rules change.
      </P>
      <P>
        The clothing grant is separate from the Best Start Grant School Age Payment and from the
        <Link href="/blog/what-is-the-scottish-child-payment"> Scottish Child Payment</Link>. A
        family can qualify for more than one scheme.
      </P>

      <H2 id="holidays">Help in school holidays</H2>
      <P>
        Families who qualify for benefit-based free school meals may also get council support in
        the summer, Christmas, Easter and shorter holidays. Depending on the council, this may be a
        cash payment, food voucher or another local arrangement.
      </P>
      <P>
        Holiday-help income rules are not always identical to the term-time meal rules. Check the
        local page instead of assuming one award automatically triggers the other.
      </P>

      <H2 id="apply">How to apply</H2>
      <H3>Use one council application where possible</H3>
      <UL>
        <LI>Check free school meals for every child, including P6, P7 and secondary pupils.</LI>
        <LI>Tick the school clothing grant option if the form combines them.</LI>
        <LI>Ask whether holiday support needs a separate registration.</LI>
        <LI>Keep the award notice in case the school or another scheme asks for proof.</LI>
      </UL>
      <P>
        A school office or council welfare team can help when the online form is difficult. If the
        family has no money for food today, do not wait for a school application, check the
        <Link href="/blog/crisis-grant-scotland-how-to-apply"> Crisis Grant</Link> as well.
      </P>

      <PostCTA
        title="Find the council application"
        body="Start with your council area. The official sources below contain every local free-meal and clothing-grant link."
        href="/areas"
        cta="Find my council"
      />
    </Prose>
  );
}
