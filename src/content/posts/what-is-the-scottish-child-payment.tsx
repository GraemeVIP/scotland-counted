import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { G } from "@/components/Glossary";

export default function Post() {
  return (
    <Prose>
      <Lead>
        The Scottish Child Payment is money paid every week for every child in a low-income family.
        It does not exist anywhere else in the UK. Some families who are entitled to it have never
        claimed a penny.
      </Lead>

      <BigStat
        value="£28.20"
        label="per child, per week"
        exact="Rate as at April 2026. Paid for every eligible child, not just the first. Source: CPAG in Scotland."
      />

      <P>
        For a family with two children that is over £56 a week, or roughly £2,900 a year. For three
        children it is more again. It is paid on top of other benefits, and it does not reduce
        them.
      </P>

      <H2>Who can get it</H2>

      <P>
        Broadly, families on a low income who are getting a qualifying benefit such as{" "}
        <G t="uc">Universal Credit</G>. There is no cap on the number of children.
      </P>

      <P>
        The rules have changed several times since it started in 2021, and they can change again.
        This post is an explainer, not an eligibility check — the only place to find out for
        certain whether you qualify is Social Security Scotland, who administer it.
      </P>

      <Aside title="Check properly, and check for free">
        <p>
          Social Security Scotland can tell you if you qualify. Citizens Advice Scotland will also
          check your entitlement for free and in confidence, and will look at everything else you
          might be missing at the same time.
        </p>
        <p>
          Never pay anyone to make a benefits claim for you. It is always free to apply, and free
          to get advice.
        </p>
      </Aside>

      <H2>Why it matters more than its size suggests</H2>

      <P>
        Independent analysis credits this payment with holding Scotland&apos;s child poverty rate
        roughly flat while rates in comparable English cities rose. It is the single clearest
        example on this site of a decision that measurably changed the number.
      </P>

      <P>
        That cuts both ways. It shows the figures are not fixed and not inevitable — they respond
        to decisions. It also means decisions in the other direction show up just as fast.
      </P>

      <H2>Who decides it</H2>

      <P>
        The Scottish Parliament in Edinburgh. It is <G t="reserved">devolved</G>, which means your{" "}
        <strong>MSP</strong> is the person to ask about it — how much it is worth, and whether
        every family entitled to it is actually getting it.
      </P>

      <P>
        Your <strong>MP</strong> in London decides different things: Universal Credit, most other
        benefits, and help with private rent. Both matter. They are different people, and{" "}
        <Link href="/take-action">you have both of them</Link>.
      </P>

      <H2>The bit that gets missed: take-up</H2>

      <P>
        A payment only lifts a family out of poverty if the family receives it. Money that goes
        unclaimed does nothing at all, and unclaimed support is one of the quiet failures in the
        system — it never makes the news, because nothing visibly happens.
      </P>

      <P>
        That is why one of the standard asks in the emails this site writes is simply that every
        family entitled to the payment actually gets it. It costs comparatively little and it is
        hard to argue against.
      </P>

      <PostCTA
        title="Ask your MSP what they are doing about it"
        body="We will find your MSP, put your area's own child-poverty figure into the email and write it for you. You just read it and press send."
        href="/take-action"
        cta="Email my MSP"
      />

      <P>
        Every figure we publish is sourced. See the{" "}
        <Link href="/what-would-fix-it">costed list of what would actually help</Link>, or{" "}
        <Link href="/glossary">the plain-English glossary</Link>.
      </P>
    </Prose>
  );
}
