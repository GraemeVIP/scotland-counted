import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { G } from "@/components/Glossary";
import { BANK_HOLIDAY_PAYMENT_DATES, SOCIAL_SECURITY_SCOTLAND } from "@/lib/data/benefits";
import { pounds } from "@/lib/data/quickAnswers";

/** Scottish Child Payment, per child per week. Social Security Scotland and Turn2us. */
const SCP = {
  weekly: 28.2,
  previous: 27.15,
  from: "April 2026",
  /** Paid every four weeks. */
  weeksPerPayment: 4,
  ageLimit: 16,
  /** The higher rate the Scottish Government plans for babies under one. */
  babyRate: 40,
  babyFrom: "2027",
} as const;

/** GOV.UK Child Benefit weekly rates, 2026/27. */
const CHILD_BENEFIT = { eldest: 27.05, other: 17.9 } as const;

/** Scottish Government estimate for 2025/26. */
const CHILDREN_KEPT_OUT_OF_POVERTY = 40000;

const CHILDREN = [1, 2, 3, 4];

export default function Post() {
  const christmas = BANK_HOLIDAY_PAYMENT_DATES.filter(
    (row) => row.due.includes("December 2026") || row.due.includes("January 2027"),
  );

  return (
    <Prose>
      <Lead>
        Scottish Child Payment is {pounds(SCP.weekly, true)} a week for every child under{" "}
        {SCP.ageLimit} in a family that gets Universal Credit or Pension Credit. Social Security
        Scotland pays it every four weeks, there is no limit on the number of children, and you
        have to apply for it.
      </Lead>
      <P>
        It does not exist anywhere else in the UK and it does not reduce your other benefits. Some
        families who are entitled to it have never claimed a penny.
      </P>

      <BigStat
        value={pounds(SCP.weekly, true)}
        label="per child, per week"
        exact={`Rate from ${SCP.from}, up from ${pounds(SCP.previous, true)}. Paid every four weeks, so ${pounds(SCP.weekly * SCP.weeksPerPayment, true)} per child each payment.`}
      />

      <H2 id="how-much">How much is Scottish Child Payment 2026/27?</H2>
      <P>
        It is {pounds(SCP.weekly, true)} a week for each eligible child, paid as{" "}
        {pounds(SCP.weekly * SCP.weeksPerPayment, true)} per child every four weeks. Every child
        counts, not just the first.
      </P>
      <GuideTable
        kicker={`From ${SCP.from}`}
        title="Scottish Child Payment by number of children"
        columns={["Children", "A week", "Every four weeks", "A year"]}
        align={["left", "right", "right", "right"]}
        rows={CHILDREN.map((n) => [
          n === 1 ? "1 child" : `${n} children`,
          pounds(SCP.weekly * n, true),
          pounds(SCP.weekly * n * SCP.weeksPerPayment, true),
          pounds(SCP.weekly * n * 52, true),
        ])}
        caption="A year is 52 weeks at the 2026/27 rate. The payment is on top of other benefits, including Child Benefit."
      />
      <P>
        For a family with two children that is {pounds(SCP.weekly * 2, true)} a week, or roughly{" "}
        {pounds(Math.round((SCP.weekly * 2 * 52) / 100) * 100)} a year, before any other help.
      </P>

      <H2 id="increase">Scottish Child Payment increase 2026</H2>
      <P>
        The payment rose from {pounds(SCP.previous, true)} to {pounds(SCP.weekly, true)} a week in{" "}
        {SCP.from}, in line with inflation. The Scottish Government also plans a higher rate of{" "}
        {pounds(SCP.babyRate)} a week for babies under one from {SCP.babyFrom}. Rates normally
        change each April, and you do not need to do anything to get the new rate.
      </P>

      <H2 id="who-can-get-it">Who qualifies for Scottish Child Payment</H2>
      <UL>
        <LI>You live in Scotland.</LI>
        <LI>You are responsible for a child under {SCP.ageLimit}.</LI>
        <LI>
          You, or your partner, get <G t="uc">Universal Credit</G> or Pension Credit.
        </LI>
      </UL>
      <P>
        There is no cap on the number of children. Only one person can get the payment for each
        child. If it is unclear who is mainly responsible, it goes to the person who gets Child
        Benefit, or the child part of Universal Credit or Pension Credit, for that child. Kinship
        carers can also qualify, with evidence of the kinship care arrangement.
      </P>
      <P>
        The rules have changed several times since the payment started in 2021, and they can change
        again. This post is an explainer, not an eligibility check. The only place to find out for
        certain whether you qualify is Social Security Scotland, which runs it.
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

      <H2 id="apply">How to apply for Scottish Child Payment</H2>
      <P>
        It is not paid automatically when you get Universal Credit. You apply to Social Security
        Scotland in one of three ways:
      </P>
      <UL>
        <LI>Online, through the Scottish Child Payment page on mygov.scot.</LI>
        <LI>
          By phone on{" "}
          <a href={SOCIAL_SECURITY_SCOTLAND.phoneHref} className="whitespace-nowrap">
            {SOCIAL_SECURITY_SCOTLAND.phone}
          </a>
          , free, {SOCIAL_SECURITY_SCOTLAND.hours}.
        </LI>
        <LI>On a paper form, downloaded from mygov.scot and posted back.</LI>
      </UL>
      <P>
        Apply as soon as you start getting a qualifying benefit. Once you get Scottish Child
        Payment, Social Security Scotland also checks whether you can get the{" "}
        <Link href="/best-start-grant">Best Start Grant</Link> Early Learning Payment and School Age
        Payment and pays them without a separate application. In P6 and P7, Scottish Child Payment
        also gives{" "}
        <Link href="/blog/free-school-meals-clothing-grant-scotland">free school meals</Link>.
      </P>

      <H2 id="payment-dates">Scottish Child Payment payment dates</H2>
      <P>
        Payments arrive every four weeks, on a date set by when your claim started. When a payment
        date falls on a bank holiday, Social Security Scotland pays early. These are the changes
        over Christmas and New Year.
      </P>
      <GuideTable
        kicker="Christmas 2026"
        title="Bank holiday payment dates"
        columns={["Due on", "Paid on"]}
        rows={christmas.map((row) => [row.due, row.paid])}
        caption={
          <>
            Every change to 2028 is on the{" "}
            <Link href="/social-security-scotland-payment-dates">Social Security Scotland payment dates</Link>{" "}
            page.
          </>
        }
      />

      <H2 id="child-benefit">Scottish Child Payment and Child Benefit</H2>
      <P>
        They are different payments and most families on a low income can get both. Child Benefit,
        which some people still call family allowance, is paid across the UK by HMRC. It is not
        means tested, although higher earners can have to pay some of it back through tax. It is{" "}
        {pounds(CHILD_BENEFIT.eldest, true)} a week for the eldest or only child and{" "}
        {pounds(CHILD_BENEFIT.other, true)} for each other child.
      </P>
      <P>
        Scottish Child Payment is extra, only in Scotland, and only for families on a qualifying
        benefit. Getting one does not reduce the other.
      </P>

      <H2 id="why-it-matters">Why it matters more than its size suggests</H2>
      <P>
        The Scottish Government estimates that the payment kept{" "}
        {CHILDREN_KEPT_OUT_OF_POVERTY.toLocaleString("en-GB")} children out of relative poverty in
        2025/26. Independent analysis credits it with holding Scotland&apos;s child poverty rate
        roughly flat while rates in comparable English cities rose. It is the single clearest
        example on this site of a decision that measurably changed the number.
      </P>
      <P>
        That cuts both ways. It shows the figures are not fixed and not inevitable, they respond to
        decisions. It also means decisions in the other direction show up just as fast.
      </P>

      <H2 id="who-decides">Who decides it</H2>
      <P>
        The Scottish Parliament in Edinburgh. It is <G t="reserved">devolved</G>, which means your{" "}
        <strong>MSP</strong> is the person to ask about it, how much it is worth, and whether every
        family entitled to it is actually getting it.
      </P>
      <P>
        Your <strong>MP</strong> in London decides different things: Universal Credit, most other
        benefits, and help with private rent. Both matter. They are different people, and{" "}
        <Link href="/email-your-mp-and-msp">you have both of them</Link>.
      </P>

      <H2 id="take-up">The bit that gets missed: take up</H2>
      <P>
        A payment only lifts a family out of poverty if the family receives it. Money that goes
        unclaimed does nothing at all, and unclaimed support is one of the quiet failures in the
        system, it never makes the news, because nothing visibly happens.
      </P>
      <P>
        That is why one of the standard asks in the emails this site writes is simply that every
        family entitled to the payment actually gets it. It costs comparatively little and it is
        hard to argue against.
      </P>

      <PostCTA
        title="Ask your MSP what they are doing about it"
        body="I will find your MSP, put your area's own child poverty figure into the email and write it for you. You just read it and press send."
        href="/email-your-mp-and-msp"
        cta="Email my MSP"
      />

      <P>
        Every figure I publish is sourced. See the{" "}
        <Link href="/solutions-to-poverty-in-scotland">costed list of what would actually help</Link>, the{" "}
        <Link href="/benefits">benefits guides</Link>, or{" "}
        <Link href="/glossary">the plain English glossary</Link>.
      </P>
    </Prose>
  );
}
