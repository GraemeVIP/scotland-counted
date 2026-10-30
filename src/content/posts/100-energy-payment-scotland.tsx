import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { SCOTTISH_ASSESSORS, bandValueLabel } from "@/lib/data/councilTaxHelp";
import { postPath } from "@/lib/routeMap";

/*
 * Announced in the UK Budget on 28 October 2026. Council tax is devolved, so
 * Scotland gets its share of the money and decides how to pay it. Only the
 * band rule is settled for Scotland so far; the date and the method are not.
 * Update this page when the Scottish Government or councils publish details.
 */
const ELIGIBLE = ["A", "B", "C", "D"] as const;
const NOT_ELIGIBLE = ["E", "F", "G", "H"] as const;

export default function Post() {
  return (
    <Prose>
      <Lead>
        The £100 energy payment announced in the UK Budget goes to homes in council tax bands A to
        D. In Scotland, the Scottish Government has said it will pay it too, using the bands homes
        already have. The date, and whether you need to apply, haven&apos;t been announced yet.
      </Lead>

      <H2 id="who">Who gets the £100 energy payment?</H2>
      <P>
        Households in council tax bands A to D. That&apos;s the only rule announced so far. It
        isn&apos;t means tested, so your income and your benefits don&apos;t come into it. Your
        band does.
      </P>
      <P>
        The Chancellor, John Healey, announced it in the Budget on Wednesday 28 October 2026. In
        England it covers about 20 million households and costs £2.6 billion. It&apos;s a one off
        payment for this winter, to help with energy bills in the coldest months.
      </P>

      <H2 id="scotland">Is Scotland getting the £100?</H2>
      <P>
        Yes, as things stand. Council tax is run by the Scottish Government and councils, not
        Westminster, so the UK Government can&apos;t pay it here directly. Instead it gives
        Scotland a share of the money, and Scotland decides what to do with it.
      </P>
      <P>
        The day after the Budget, Deputy First Minister Jenny Gilruth said the Scottish
        Government would copy the scheme, and would work with councils on how to pay it out. The
        UK Treasury welcomed the Scottish Government&apos;s decision to give it to households in
        the bottom four bands.
      </P>
      <P>
        About 1.9 million Scottish homes are in bands A to D, so paying every one of them £100
        costs at least £190 million.
      </P>

      <H2 id="bands">Am I in band A to D?</H2>
      <P>
        Scotland&apos;s bands are based on what a home was worth on 1 April 1991, not what it&apos;s
        worth today. Ms Gilruth has said there&apos;s no time to rebalance them before winter, so
        the payment will use the band your home has now.
      </P>
      <GuideTable
        kicker="Scotland"
        title="Which bands get the £100"
        columns={["Band", "Value in April 1991", "£100 payment"]}
        align={["left", "left", "right"]}
        rows={[
          ...ELIGIBLE.map((b) => [`Band ${b}`, bandValueLabel(b), "Yes"]),
          ...NOT_ELIGIBLE.map((b) => [`Band ${b}`, bandValueLabel(b), "No"]),
        ]}
        caption="Scottish band values from the Scottish Assessors. England's bands use different values, so a Band D home in England is not the same as a Band D home in Scotland."
      />
      <P>
        Your band is printed on your council tax bill. You can also look it up free on the{" "}
        <a href={SCOTTISH_ASSESSORS.url} target="_blank" rel="noopener noreferrer">
          Scottish Assessors website
        </a>{" "}
        with your postcode. My guide to{" "}
        <Link href={postPath("check-council-tax-band")}>checking your council tax band</Link> walks
        through it step by step, and the{" "}
        <Link href="/council-tax-bands-scotland">council tax bands page</Link> shows what each band
        costs in your council.
      </P>

      <H2 id="when">When will it be paid, and do I need to apply?</H2>
      <P>
        For Scotland, neither has been announced. The Scottish Government has said only that it
        will work it out with councils. The UK Government said the money should arrive this
        winter, so expect it in the next few months rather than next year.
      </P>
      <H3>How England is doing it</H3>
      <P>
        Early reports say councils in England will pay it from January 2027. People who pay
        council tax by direct debit should get it straight into their bank account. Everyone else
        will be asked by their council to claim it. Scotland may do it the same way, or it may
        not. Nothing has been confirmed here yet.
      </P>
      <P>Things still unknown for Scotland include:</P>
      <UL>
        <LI>the payment date</LI>
        <LI>whether it&apos;s automatic or you have to claim it</LI>
        <LI>what happens if you don&apos;t pay by direct debit, or don&apos;t have a bank account</LI>
        <LI>how it works if your bill is already cut to nothing by Council Tax Reduction</LI>
      </UL>
      <P>I&apos;ll update this page as soon as any of that is announced.</P>

      <Aside title="Watch out for scams">
        <p>
          Payments like this always bring fake texts and emails asking for your bank details to
          &quot;claim your £100&quot;. Your council already has what it needs. Don&apos;t click
          links in messages about the payment. If you&apos;re unsure, phone your council on the
          number printed on your council tax bill.
        </p>
      </Aside>

      <H2 id="fair">Why bands and not income?</H2>
      <P>
        Because councils already know every home&apos;s band, so they can pay quickly without a
        new application system. The UK Government says bands A to D take in 80% of households
        struggling with fuel costs, and 88% of households in the poorest 30%.
      </P>
      <P>
        The catch is that bands are very old. A home that was cheap in 1991 can be worth a lot now,
        and some families on low incomes live in bigger, older homes in band E or above. Ms
        Gilruth called it &quot;not a perfect solution&quot;.
      </P>

      <H2 id="other-help">Other help with energy bills this winter</H2>
      <P>The £100 comes on top of anything else you get. In Scotland, check these too:</P>
      <UL>
        <LI>
          <Link href={postPath("winter-heating-payment")}>Winter Heating Payment</Link>, paid
          automatically if you get certain low income benefits.
        </LI>
        <LI>
          <Link href={postPath("winter-fuel-payment-scotland")}>
            Pension Age Winter Heating Payment
          </Link>
          , Scotland&apos;s version of the winter fuel payment.
        </LI>
        <LI>
          <Link href={postPath("council-tax-reduction-scotland")}>Council Tax Reduction</Link>,
          which cuts the bill itself if you&apos;re on a low income.
        </LI>
        <LI>
          <Link href={postPath("crisis-grant-scotland-how-to-apply")}>A crisis grant</Link> from
          your council if you can&apos;t afford to heat your home right now. You don&apos;t pay it
          back.
        </LI>
      </UL>
      <P>
        For what energy bills are doing, see the{" "}
        <Link href={postPath("energy-price-cap-scotland-2026-explained")}>
          energy price cap in Scotland
        </Link>
        .
      </P>

      <PostCTA
        title="Check your band now"
        body="Type your postcode to see your band on the Scottish Assessors list. If it says A, B, C or D, you're in line for the £100."
        href={SCOTTISH_ASSESSORS.url}
        cta="Find my council tax band"
      />
    </Prose>
  );
}
