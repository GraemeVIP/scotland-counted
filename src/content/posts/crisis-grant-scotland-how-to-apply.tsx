import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";

export default function Post() {
  return (
    <Prose>
      <Lead>
        A Crisis Grant is emergency help from the Scottish Welfare Fund. You apply through your
        council, it does not have to be repaid, and it can help when a low income leaves you
        without essentials after an unexpected event.
      </Lead>

      <H2 id="what-it-is">What a Crisis Grant is</H2>
      <P>
        The Scottish Welfare Fund has two different grants. A Crisis Grant is for an immediate
        emergency. A Community Care Grant helps someone live independently or remain in the
        community. Neither is a loan.
      </P>
      <Aside title="It is not a Universal Credit advance">
        <p>
          A Universal Credit advance is normally recovered from later benefits. A Scottish Welfare
          Fund grant is council-administered emergency support that you do not pay back.
        </p>
      </Aside>

      <H2 id="who">Who can apply</H2>
      <P>
        You must be at least 16 and on a low income or receiving certain benefits. You do not need
        to be unemployed. The council looks at the emergency, the money and help available to you,
        and whether a grant is an appropriate way to prevent serious harm.
      </P>
      <P>
        Apply to the council where you live. The Scottish Government sets the national scheme, but
        it does not take individual applications.
      </P>

      <H2 id="covers">What it can cover</H2>
      <UL>
        <LI>Food when an emergency has left you with nothing to eat.</LI>
        <LI>Heating or electricity during an immediate crisis.</LI>
        <LI>Essential travel or other urgent living costs.</LI>
        <LI>Needs arising after a fire, flood, theft or sudden loss of income.</LI>
      </UL>
      <P>
        It is not a general top-up for every low income and it will not usually clear old debt. Say
        what happened, what is needed now and what harm will occur if help does not arrive.
      </P>

      <H2 id="apply">How to apply</H2>
      <H3>Have these details ready</H3>
      <UL>
        <LI>Your name, address, date of birth and National Insurance number if you have one.</LI>
        <LI>Who lives with you and any children or health needs.</LI>
        <LI>Current income, benefits, bank balance and essential outgoings.</LI>
        <LI>A short account of the emergency and what you need today.</LI>
      </UL>
      <P>
        Councils accept applications online or by phone. If forms are difficult, ask the council,
        a library, Citizens Advice or a local welfare-rights service to help. Do not wait to make
        the wording perfect while the emergency gets worse.
      </P>

      <H2 id="refused">If the council says no</H2>
      <P>
        Ask for the reason and how to request a review. Correct anything that was misunderstood and
        give missing evidence. Explain the immediate risk in plain terms: no food, no heat, unsafe
        travel, or a child or disabled person affected.
      </P>
      <P>
        A grant cannot solve an ongoing rent gap. For that, check <Link href="/blog/discretionary-housing-payment-scotland">Discretionary
        Housing Payments</Link>. If council tax is part of the problem, the <Link href="/blog/council-tax-in-scotland-guide">council
        tax guide</Link> explains reductions and what to do before arrears grow.
      </P>

      <PostCTA
        title="Apply through your council"
        body="Use your council's Scottish Welfare Fund page or phone its welfare team. The official source link below explains the national rules and takes you to local applications."
        href="/areas"
        cta="Find my council area"
      />
    </Prose>
  );
}
