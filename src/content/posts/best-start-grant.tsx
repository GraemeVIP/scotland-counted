import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { BEST_START as BS, SOCIAL_SECURITY_SCOTLAND as SSS } from "@/lib/data/benefits";
import { pounds } from "@/lib/data/quickAnswers";

export default function Post() {
  return (
    <Prose>
      <Lead>
        Best Start Grant is three one off payments from Social Security Scotland for families on a
        low income. One around the birth, one when your child is two or three, and one when they
        start school. You don&apos;t pay any of it back, and you can spend it on whatever you need.
      </Lead>

      <H2 id="amounts">How much the best start grant is</H2>
      <GuideTable
        kicker="2026/27"
        title="The three Best Start Grant payments"
        columns={["Payment", "Amount", "When to apply"]}
        rows={[
          ["Pregnancy and Baby Payment, first child", pounds(BS.pregnancyAndBabyFirst, true), "From 24 weeks pregnant until the baby is 6 months old"],
          ["Pregnancy and Baby Payment, later children", pounds(BS.pregnancyAndBabyLater, true), "Same window"],
          ["Early Learning Payment", pounds(BS.earlyLearning, true), "When your child is between 2 and 3 years 6 months"],
          ["School Age Payment", pounds(BS.schoolAge, true), "The year your child is first old enough for P1"],
        ]}
        caption="Each payment is normally made once per child. Your first child means your oldest child under 16, including stepchildren and children you've taken on through kinship care or adoption."
      />
      <P>
        Over the three payments, a first child can bring in{" "}
        {pounds(BS.pregnancyAndBabyFirst + BS.earlyLearning + BS.schoolAge, true)}. That&apos;s real
        money at the points where a family tends to need it most.
      </P>

      <H2 id="early-learning">Best start grant early learning payment</H2>
      <P>
        The Early Learning Payment is {pounds(BS.earlyLearning, true)} per child. You claim it when
        your child is between 2 years old and 3 years 6 months. Your child doesn&apos;t have to go to
        nursery to get it. Clothes, toys, days out, it&apos;s up to you.
      </P>
      <Aside title="Some of it is now automatic">
        <p>
          If you already get <Link href="/scottish-child-payment">Scottish Child Payment</Link> for
          a child of the right age, Social Security Scotland checks whether you can get the Early
          Learning Payment and the School Age Payment and pays you without a separate application.
        </p>
      </Aside>

      <H3>School Age Payment dates</H3>
      <P>
        Children born between 1 March 2021 and 28 February 2022 can be claimed for from 1 June 2026
        to 28 February 2027. Children born between 1 March 2022 and 28 February 2023 can be claimed
        for from 1 June 2027 to 29 February 2028. You still claim in that year if you&apos;re
        deferring school.
      </P>

      <H2 id="who">Who can get it</H2>
      <P>You or your partner normally need to get one of these:</P>
      <UL>
        <LI>Universal Credit</LI>
        <LI>Housing Benefit</LI>
        <LI>Income Support</LI>
        <LI>Pension Credit</LI>
        <LI>income based Jobseeker&apos;s Allowance</LI>
        <LI>income related Employment and Support Allowance</LI>
      </UL>
      <P>
        Child Benefit on its own doesn&apos;t count. If you&apos;re under 18 you don&apos;t need any
        benefit at all. If you&apos;re 18 or 19 and get nothing yourself, you can still claim if
        your parent or carer gets Child Benefit or a similar payment for you.
      </P>

      <H2 id="foods">Best Start Foods</H2>
      <P>
        Best Start Foods sits alongside the grant. It&apos;s a prepaid card topped up every four weeks
        to spend on healthy food like milk and fruit.
      </P>
      <UL>
        <LI>{pounds(BS.foods.pregnancy, true)} every four weeks while you&apos;re pregnant</LI>
        <LI>{pounds(BS.foods.underOne, true)} for each child under one</LI>
        <LI>{pounds(BS.foods.oneToThree, true)} for each child aged one to three</LI>
      </UL>

      <H2 id="apply">Apply for best start grant</H2>
      <P>
        One form covers all three grant payments, Best Start Foods and Scottish Child Payment.
        You&apos;ll get a separate letter for each one.
      </P>
      <UL>
        <LI>Online through mygov.scot. Most people take 10 to 20 minutes, and you can&apos;t save it halfway, so set aside the time.</LI>
        <LI>By phone on <a href={SSS.phoneHref}>{SSS.phone}</a>, {SSS.hours}.</LI>
        <LI>On a paper form, including large print.</LI>
      </UL>
      <P>
        Have your National Insurance number, bank details, your partner&apos;s name and date of birth,
        and the details of your children to hand. Don&apos;t apply twice for the same child while
        you&apos;re waiting, as it slows everything down.
      </P>

      <PostCTA
        title="One form for every family payment"
        body="Apply once and Social Security Scotland checks you for all five family payments, including Scottish Child Payment."
        href="https://www.mygov.scot/best-start-grant-best-start-foods"
        cta="Best Start Grant on mygov.scot"
      />
    </Prose>
  );
}
