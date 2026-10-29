import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { CARER_SUPPORT_PAYMENT as CSP, SOCIAL_SECURITY_SCOTLAND as SSS } from "@/lib/data/benefits";
import { pounds } from "@/lib/data/quickAnswers";

export default function Post() {
  const total = CSP.weekly + CSP.supplement;
  return (
    <Prose>
      <Lead>
        Carer Support Payment is what replaced Carer&apos;s Allowance in Scotland. If you look after
        someone for 35 hours a week or more, unpaid, it pays up to {pounds(CSP.weekly, true)} a week.
        You also get the Scottish Carer Supplement on top, automatically.
      </Lead>

      <H2 id="rates">Carer support payment rates for 2026/27</H2>
      <GuideTable
        kicker="2026/27"
        title="The carer package in Scotland"
        columns={["Payment", "A week", "A year", "Affects other benefits?"]}
        align={["left", "right", "right", "left"]}
        rows={[
          ["Carer Support Payment", pounds(CSP.weekly, true), pounds(CSP.weekly * 52, true), "Yes, see below"],
          ["Scottish Carer Supplement", pounds(CSP.supplement, true), pounds(CSP.supplement * 52, true), "No"],
          ["Carer Additional Person Payment, each extra person", pounds(CSP.additionalPerson, true), pounds(CSP.additionalPerson * 52, true), "No"],
        ]}
        caption="A year is the weekly rate times 52. All three come together in one payment every four weeks."
      />
      <P>
        Caring for one person, that&apos;s {pounds(total, true)} a week with the supplement, or about{" "}
        {pounds(total * 52)} a year. The supplement replaced the old twice yearly Carer&apos;s
        Allowance Supplement, so it now comes with every payment instead.
      </P>

      <H2 id="eligibility">Carer support payment eligibility</H2>
      <P>To get it you need to:</P>
      <UL>
        <LI>be 16 or over</LI>
        <LI>usually live in Scotland</LI>
        <LI>give unpaid care for {CSP.hours} hours or more a week</LI>
        <LI>take home no more than {pounds(CSP.earningsLimit)} a week if you work</LI>
      </UL>
      <P>
        The person you look after also has to get a qualifying disability benefit at the right rate.
        The daily living part of <Link href="/adult-disability-payment">Adult Disability Payment</Link>{" "}
        is one of them. Social Security Scotland keeps the full list.
      </P>
      <H3>What counts as caring</H3>
      <P>
        It has to be unpaid, as family or a friend. Paid care work and volunteering through a charity
        don&apos;t count. Plenty of people never think of themselves as carers. If you&apos;re keeping
        someone safe, getting them through a mental health crisis, or helping them wash, dress and
        eat, that&apos;s caring.
      </P>
      <H3>The earnings limit</H3>
      <P>
        Your take home pay can&apos;t be more than {pounds(CSP.earningsLimit)} a week. That&apos;s
        about £884 a month or £10,608 a year, after tax, National Insurance and some allowed
        expenses. If your pay goes up and down they can average it out, so one big week doesn&apos;t
        knock you off.
      </P>
      <H3>Caring for more than one person</H3>
      <P>
        If you also look after someone else for {CSP.additionalPersonHours} hours a week or more, you
        can get the Carer Additional Person Payment of {pounds(CSP.additionalPerson, true)} a week for
        each extra person. The hours can overlap with the time you spend on the first person.
      </P>

      <Aside title="How it fits with other benefits">
        <p>
          The supplement and the additional person payment don&apos;t touch anything else. Carer
          Support Payment itself does. The DWP counts it as income for Universal Credit and other
          income related benefits, and if you get State Pension it can reduce or stop it. A benefits
          check before you apply is worth ten minutes.
        </p>
      </Aside>

      <H2 id="apply">How to apply for carer support payment</H2>
      <UL>
        <LI>Online through mygov.scot. One form covers all three payments.</LI>
        <LI>
          By phone on <a href={SSS.phoneHref}>{SSS.phone}</a>, {SSS.hours}.
        </LI>
        <LI>On a paper form, which they&apos;ll post out to you.</LI>
      </UL>
      <P>
        Two people can&apos;t both get Carer Support Payment for caring for the same person. If a
        couple care for their child together, only one gets it. The other might still get the
        additional person payment.
      </P>

      <H2 id="paid">When you&apos;re paid</H2>
      <P>
        Every four weeks, at the end of the four weeks. Bank holidays move the date forward, and
        the <Link href="/social-security-scotland-payment-dates">payment dates page</Link> lists the
        Christmas ones. If you&apos;re aged 16 to 19 and care for fewer hours, the{" "}
        <Link href="/young-carers-allowance-scotland">Young Carer Grant</Link> might suit you better.
      </P>

      <PostCTA
        title="Check if you can apply"
        body="mygov.scot has a short checker that asks your age, where you live, your caring hours and what you earn. It isn't an application, so there's nothing to lose."
        href="https://www.mygov.scot/carer-support-payment"
        cta="Carer Support Payment on mygov.scot"
      />
    </Prose>
  );
}
