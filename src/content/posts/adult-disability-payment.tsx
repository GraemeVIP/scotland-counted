import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { ADULT_DISABILITY_PAYMENT as ADP, SOCIAL_SECURITY_SCOTLAND as SSS } from "@/lib/data/benefits";
import { pounds } from "@/lib/data/quickAnswers";

const rows = [
  ["Daily living, standard", ADP.dailyLiving.standard],
  ["Daily living, enhanced", ADP.dailyLiving.enhanced],
  ["Mobility, standard", ADP.mobility.standard],
  ["Mobility, enhanced", ADP.mobility.enhanced],
] as const;

export default function Post() {
  const most = ADP.dailyLiving.enhanced + ADP.mobility.enhanced;
  return (
    <Prose>
      <Lead>
        Adult Disability Payment is Scotland&apos;s replacement for PIP. It&apos;s extra money if
        you have a disability or a long term health condition that makes everyday life harder. It
        isn&apos;t means tested, so your wages and your savings don&apos;t come into it.
      </Lead>

      <H2 id="rates">Adult disability payment rates for 2026/27</H2>
      <P>
        There are two parts. Daily living covers things like cooking, eating, washing and dressing.
        Mobility covers planning a journey and getting about. You can get one part or both, and
        each part has a standard and an enhanced rate.
      </P>
      <GuideTable
        kicker="2026/27"
        title="What each part pays"
        columns={["Part and rate", "A week", "Every 4 weeks", "A year"]}
        align={["left", "right", "right", "right"]}
        rows={rows.map(([label, weekly]) => [label, pounds(weekly, true), pounds(weekly * 4, true), pounds(weekly * 52, true)])}
        caption="Paid every four weeks. A year is the weekly rate times 52."
      />
      <P>
        The most anyone can get is both enhanced rates together. That&apos;s{" "}
        {pounds(most, true)} a week, or {pounds(most * 52, true)} over a year. If you&apos;re
        terminally ill you get the enhanced daily living rate automatically.
      </P>

      <H2 id="eligibility">Adult disability payment eligibility</H2>
      <P>You can apply if you&apos;re between 16 and State Pension age and you have:</P>
      <UL>
        <LI>a disability</LI>
        <LI>a long term physical or mental health condition</LI>
        <LI>a terminal illness</LI>
      </UL>
      <P>
        You don&apos;t need a diagnosis to apply. What matters is how your condition affects you
        day to day. It doesn&apos;t matter if you work, and your income and savings aren&apos;t
        looked at.
      </P>
      <H3>What counts for the daily living part</H3>
      <P>
        Help with preparing food, eating and drinking, managing treatment, washing, using the toilet,
        dressing, talking to people, reading, mixing with people face to face, and making decisions
        about money.
      </P>
      <H3>What counts for the mobility part</H3>
      <P>Help with planning and following a journey, or with moving around.</P>
      <Aside title="Already on PIP?">
        <p>
          You don&apos;t need to apply. Social Security Scotland moves you over to Adult Disability
          Payment and tells you when. You can&apos;t get both at the same time.
        </p>
      </Aside>

      <H2 id="apply">How to apply for adult disability payment</H2>
      <P>The application comes in two parts, online or by phone and paper.</P>
      <UL>
        <LI>Online, through your mygov.scot myaccount. Send part 1 within 14 days of starting.</LI>
        <LI>Then send part 2 within 8 weeks. You can ask for more time and you don&apos;t have to say why.</LI>
        <LI>
          By phone on <a href={SSS.phoneHref}>{SSS.phone}</a>, {SSS.hours}. They fill in part 1
          with you and post out a paper form for the rest.
        </LI>
        <LI>If you&apos;re terminally ill there&apos;s only one part, and you can do the whole thing over the phone.</LI>
      </UL>
      <P>
        Your award runs from the day you sent part 1, not the day you get the decision letter.
        So it pays to start early, even if you need longer to finish part 2.
      </P>
      <P>
        The full list of numbers, opening times and what to have ready is on the{" "}
        <Link href="/adult-disability-payment-phone-number">adult disability payment phone number</Link>{" "}
        page.
      </P>

      <H2 id="login">Adult disability payment login</H2>
      <P>
        There&apos;s no separate login for Adult Disability Payment. You sign in to your mygov.scot
        myaccount, which is where you start and save an online application. If you&apos;ve never used
        it, you&apos;ll set up a user name and password and give a few personal details first.
      </P>

      <H2 id="paid">When adult disability payments are paid</H2>
      <P>
        You&apos;re paid every four weeks, in arrears. The first payment lands after the first four
        weeks have passed. If you&apos;re terminally ill you&apos;re paid weekly, in advance. When a
        payment date falls on a bank holiday it comes early, and the{" "}
        <Link href="/social-security-scotland-payment-dates">Social Security Scotland payment dates</Link>{" "}
        page lists every one, Christmas included.
      </P>

      <H2 id="carers">If someone cares for you</H2>
      <P>
        Getting the daily living part can open the door for whoever looks after you. If they care
        for you 35 hours a week or more, they may be able to claim{" "}
        <Link href="/carer-support-payment">Carer Support Payment</Link>.
      </P>

      <PostCTA
        title="Start with part 1 today"
        body="The money is backdated to the day part 1 goes in. Start online through mygov.scot or phone Social Security Scotland free and they'll do part 1 with you."
        href="https://www.mygov.scot/adult-disability-payment/how-to-apply"
        cta="How to apply on mygov.scot"
      />
    </Prose>
  );
}
