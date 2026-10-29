import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { SOCIAL_SECURITY_SCOTLAND as SSS, YOUNG_CARER_GRANT as YCG } from "@/lib/data/benefits";
import { pounds } from "@/lib/data/quickAnswers";

export default function Post() {
  return (
    <Prose>
      <Lead>
        There isn&apos;t a benefit called Young Carers Allowance in Scotland. What you&apos;re after
        is the Young Carer Grant: {pounds(YCG.yearly, true)} once a year for 16 to 19 year olds who
        look after someone. You can spend it on anything you like.
      </Lead>

      <H2 id="who">Who can get the young carer grant</H2>
      <UL>
        <LI>You&apos;re 16, 17, 18 or 19.</LI>
        <LI>You live in Scotland.</LI>
        <LI>
          You&apos;ve cared for one, two or three people for an average of {YCG.hours} hours a week
          over the last three months. You can add the hours for different people together.
        </LI>
        <LI>The person you care for normally gets a qualifying disability benefit.</LI>
        <LI>You don&apos;t already get Carer Support Payment or Carer&apos;s Allowance.</LI>
      </UL>

      <H2 id="how-often">How often you can claim</H2>
      <P>
        Once a year, every year, until you turn 20. You need to leave a full year between claims. Go
        in even a day early and it gets rejected, and you have to apply again. Each year is a new
        application.
      </P>

      <H2 id="spend">What you can spend it on</H2>
      <P>
        Whatever you want. Clothes, driving lessons, a holiday, a laptop for college. Nobody asks
        and you don&apos;t have to keep receipts.
      </P>

      <Aside title="Caring 35 hours a week or more?">
        <p>
          Then <Link href="/carer-support-payment">Carer Support Payment</Link> could be worth far
          more to you, paid every four weeks instead of once a year. Get your Young Carer Grant first,
          then apply for Carer Support Payment, because you can&apos;t get the grant once you&apos;re
          on it.
        </p>
      </Aside>

      <H2 id="apply">How to apply</H2>
      <UL>
        <LI>Online through mygov.scot.</LI>
        <LI>
          By phone on <a href={SSS.phoneHref}>{SSS.phone}</a>, {SSS.hours}.
        </LI>
        <LI>On a paper form.</LI>
      </UL>
      <P>
        You&apos;ll need your National Insurance number, the details of who you care for and the
        benefit they get, and your bank details.
      </P>

      <PostCTA
        title="Apply for the Young Carer Grant"
        body="If you've been caring for 16 hours a week or more for the last three months, it takes one form."
        href="https://www.mygov.scot/young-carer-grant"
        cta="Young Carer Grant on mygov.scot"
      />
    </Prose>
  );
}
