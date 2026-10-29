import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { councilTaxByBand, waterCharges2026 } from "@/lib/data/councilTax";
import {
  COUNCIL_TAX_REDUCTION as CTR,
  CTR_COUNCILS,
  SECOND_ADULT_REBATE as SAR,
  WATER_CHARGES_REDUCTION,
} from "@/lib/data/councilTaxHelp";
import { bandFor, pounds } from "@/lib/data/quickAnswers";
import { COUNCIL_SEARCH_NAMES, councilTaxPath, postPath } from "@/lib/routeMap";

/** Where a council's Band D council tax sits among all 32, 1 being the lowest. */
function bandDRank(slug: string) {
  const sorted = Object.keys(councilTaxByBand).sort((x, y) => councilTaxByBand[x].D - councilTaxByBand[y].D);
  return sorted.indexOf(slug) + 1;
}

function CouncilBandD({ slug }: { slug: string }) {
  const d = bandFor(slug, "D");
  const name = COUNCIL_SEARCH_NAMES[slug];
  const rank = bandDRank(slug);
  return (
    <P>
      For 2026/27, Band D council tax in {name} is {pounds(d.councilTax, true)}
      {rank === 1 ? ", the lowest of all 32 councils" : ""}. With water and waste water the bill is{" "}
      {pounds(d.total, true)}. A full reduction takes the council tax part to nothing. Every band
      is on the <Link href={councilTaxPath(slug)}>{name} council tax bands</Link> page.
    </P>
  );
}

export default function Post() {
  const glasgowA = bandFor("glasgow-city", "A");
  const waterA = waterCharges2026.A.water + waterCharges2026.A.wasteWater;
  const waterAReduced = waterA * (1 - WATER_CHARGES_REDUCTION.maxPercent / 100);
  const exampleExcess = 50;
  const exampleContribution = (exampleExcess * CTR.taperPercent) / 100;
  const { edinburgh, southLanarkshire: southLan, northLanarkshire: northLan } = CTR_COUNCILS;

  return (
    <Prose>
      <Lead>
        Council Tax Reduction is help from your council if your income is low. It can take up to{" "}
        {CTR.maxPercent}% off your council tax. You can get it whether you rent or own, work or
        don&apos;t, and whether or not you&apos;re on Universal Credit. But it isn&apos;t
        automatic. You have to claim it.
      </Lead>

      <H2 id="who-qualifies">Who qualifies for council tax reduction</H2>
      <P>You can claim if you:</P>
      <UL>
        <LI>are responsible for paying the council tax on the home you live in</LI>
        <LI>have savings of less than {pounds(CTR.savingsLimit)}</LI>
        <LI>have a low income, from benefits, from work, or from self employment</LI>
      </UL>
      <P>
        The savings limit doesn&apos;t apply if you or your partner get the Guarantee Credit part of
        Pension Credit. Most full time students can&apos;t get it.
      </P>
      <P>
        It replaced Council Tax Benefit in 2013, and the rules are the same in every council in
        Scotland. Your council runs it and decides your claim.
      </P>

      <H2 id="how-much">How much you can get</H2>
      <P>
        The council compares your income with what the rules say a household like yours needs to
        live on. That figure depends on whether you&apos;re single or a couple, your age, any
        children, and things like disability or caring.
      </P>
      <UL>
        <LI>If your income is at or below that amount, you get the full reduction.</LI>
        <LI>
          If it&apos;s above, you pay {CTR.taperPercent}% of the difference towards your council
          tax and the reduction covers the rest. So if you&apos;re {pounds(exampleExcess)} a week
          over, you pay {pounds(exampleContribution)} a week of council tax.
        </LI>
        <LI>
          Other adults who live with you, like a grown up son or daughter, can lower your reduction
          because they&apos;re expected to chip in. That doesn&apos;t apply to your partner, or to
          anyone named on the bill with you.
        </LI>
      </UL>
      <H3>It doesn&apos;t cover water</H3>
      <P>
        Council Tax Reduction only comes off the council tax. The water and waste water charges
        stay. But anyone who gets it can also get up to {WATER_CHARGES_REDUCTION.maxPercent}% off
        water through the Water Charges Reduction Scheme, and the council applies that for you.
      </P>
      <P>
        Take a Band A home in Glasgow. The full bill for 2026/27 is {pounds(glasgowA.total, true)}.
        With a full reduction the council tax part, {pounds(glasgowA.councilTax, true)}, goes to
        nothing. With the full water reduction the water drops from {pounds(waterA, true)} to{" "}
        {pounds(waterAReduced, true)}. That&apos;s what&apos;s left to pay for the year. More on
        that on the <Link href="/water-rates-scotland">water rates Scotland</Link> page.
      </P>

      <H2 id="universal-credit">Council tax reduction and Universal Credit</H2>
      <P>
        Council Tax Reduction isn&apos;t part of Universal Credit. It&apos;s a separate claim to
        your council. If you said you wanted it when you claimed Universal Credit, the DWP may pass
        your details on. South Lanarkshire Council says you still need to send your own
        application, and I&apos;d do the same wherever you live, so nothing falls through the gap.
      </P>
      <P>
        Universal Credit doesn&apos;t give you a full reduction automatically the way some older
        benefits did. The council counts it as income and works out the reduction from there. If
        nobody in your home has any other income, you usually pay no council tax at all.
      </P>
      <P>
        Once you start earning, the reduction tapers away rather than stopping dead. That&apos;s
        the {CTR.taperPercent}% rule above. Tell the council when your hours or pay change. If
        you&apos;re weighing up more hours, my piece on{" "}
        <Link href={postPath("universal-credit-when-you-work-more-hours")}>
          Universal Credit when you work more hours
        </Link>{" "}
        shows how the sums work.
      </P>

      <H2 id="second-adult">The second adult rule</H2>
      <P>
        If your own income is too high for Council Tax Reduction, there&apos;s one more route. It
        looks at the income of another adult who lives with you, not yours. This is called second
        adult rebate, or Second Adult Reduction on some council sites.
      </P>
      <P>You can claim it if you&apos;re single, or in a couple where at least one of you is disregarded for council tax, and you share your home with an adult aged 18 or over who:</P>
      <UL>
        <LI>isn&apos;t your partner</LI>
        <LI>isn&apos;t named on the bill</LI>
        <LI>isn&apos;t disregarded, for example as a full time student</LI>
        <LI>isn&apos;t paying you a commercial rent (informal &quot;dig money&quot; is fine)</LI>
      </UL>
      <GuideTable
        kicker="2026/27"
        title="Second adult rebate"
        columns={["The other adult", "Off your council tax"]}
        align={["left", "right"]}
        rows={[
          ["On Pension Credit, Universal Credit with no earnings, or an older income related benefit", `${SAR.onBenefitsPercent}%`],
          [`Gross income under ${pounds(SAR.lowerIncome)} a week`, `${SAR.lowIncomePercent}%`],
          [`Gross income from ${pounds(SAR.lowerIncome)} up to ${pounds(SAR.upperIncome)} a week`, `${SAR.middleIncomePercent}%`],
          [`Gross income of ${pounds(SAR.upperIncome)} a week or more`, "Nothing"],
          ["On one of those benefits, and everyone else in the home is a student", `${SAR.studentHomePercent}%`],
        ]}
        caption="Council tax only, not water. Disability benefits such as Adult Disability Payment don't count towards the other adult's income."
      />
      <P>
        You can&apos;t get both at once. If you qualify for ordinary Council Tax Reduction and
        second adult rebate, the council gives you whichever is higher.
      </P>

      <H2 id="apply">How to apply through your council</H2>
      <P>
        Every council has its own online form, and many have a calculator that tells you first
        whether it&apos;s worth claiming. Have these ready:
      </P>
      <UL>
        <LI>details of everyone who lives with you</LI>
        <LI>your income and your partner&apos;s, from work and from benefits</LI>
        <LI>your savings</LI>
        <LI>proof of any of that, if the council asks for it</LI>
      </UL>
      <P>
        If you&apos;re self employed, councils often have a separate form for your earnings. The
        reduction normally starts from when the council gets your claim, and backdating is limited,
        so claim as soon as your money drops. You usually only claim once. After that the council
        checks in with you, and you tell it when things change.
      </P>
      <P>
        If you&apos;re awarded it, it goes straight onto your council tax account and you get a new
        bill. If you think the decision is wrong, ask the council to review it in writing. If
        you&apos;re still unhappy, an independent tribunal, the Local Taxation Chamber, can look at
        it again.
      </P>
      <Aside title="Already struggling to pay?">
        <p>
          Speak to the council as soon as you know you&apos;ll miss a payment. If you&apos;ve got
          nothing left for food or heating today, a{" "}
          <Link href="/crisis-grant-scotland">crisis grant</Link> may help while the claim goes
          through.
        </p>
      </Aside>

      <H2 id="edinburgh">Council tax reduction Edinburgh</H2>
      <P>
        Edinburgh uses the same rules: savings under {pounds(CTR.savingsLimit)}, responsible for the
        bill, and a low income from benefits or work. You claim on the{" "}
        <a href={edinburgh.url} target="_blank" rel="noopener noreferrer">
          council&apos;s Council Tax Reduction page
        </a>
        , and you can claim Housing Benefit at the same time. There&apos;s a separate form if
        you&apos;re self employed.
      </P>
      <P>
        One thing to know: the form can&apos;t be saved halfway, and it logs you out after{" "}
        {edinburgh.formTimeoutMinutes} minutes of nothing happening. Get your details together
        before you start. If you&apos;re awarded it, Edinburgh usually applies it from the Monday
        after it gets your claim. If you disagree with the decision, there&apos;s a{" "}
        <a href={edinburgh.reviewUrl} target="_blank" rel="noopener noreferrer">
          review process
        </a>
        .
      </P>
      <CouncilBandD slug={edinburgh.slug} />

      <H2 id="south-lanarkshire">South Lanarkshire council tax reduction</H2>
      <P>
        South Lanarkshire has an online calculator and an online claim form on its{" "}
        <a href={southLan.url} target="_blank" rel="noopener noreferrer">
          Council Tax Reduction page
        </a>
        . It may also send you a text message with a link to check if you qualify. Benefits and
        Revenue Services are on <a href={southLan.phoneHref}>{southLan.phone}</a>.
      </P>
      <P>
        If you&apos;re of pension age, it backdates your claim by up to{" "}
        {southLan.backdatePensionMonths} months without you asking. If you&apos;re of working age,
        you can ask for it to be backdated to when your circumstances changed, by up to{" "}
        {southLan.backdateWorkingMonths} months from when you ask. And if you don&apos;t qualify
        yourself, it has a separate form for{" "}
        <a href={southLan.secondAdultUrl} target="_blank" rel="noopener noreferrer">
          Second Adult Reduction
        </a>
        .
      </P>
      <CouncilBandD slug={southLan.slug} />

      <H2 id="north-lanarkshire">North Lanarkshire council tax reduction</H2>
      <P>
        North Lanarkshire has one{" "}
        <a href={northLan.url} target="_blank" rel="noopener noreferrer">
          calculator and online claim
        </a>{" "}
        for Housing Benefit and Council Tax Reduction together. Send all the evidence it asks for.
        If you can&apos;t get everything, still send the form with what you have. Without the
        evidence it can&apos;t decide your claim.
      </P>
      <P>
        If you disagree with the decision, you have {northLan.reviewMonths} months to ask for a
        review in writing, and the council has {northLan.reviewMonths} months to reply. After that
        you can go to the Local Taxation Chamber. If the council doesn&apos;t reply in time, you can
        go straight there. The postal address for reviews is on the council&apos;s{" "}
        <a href={northLan.reviewUrl} target="_blank" rel="noopener noreferrer">
          review page
        </a>
        .
      </P>
      <CouncilBandD slug={northLan.slug} />

      <H2 id="other-help">Other help with the bill</H2>
      <P>
        Council Tax Reduction is for low incomes. There are other discounts that have nothing to do
        with money. If you live alone you get the{" "}
        <Link href="/single-person-discount-council-tax-scotland">single person discount</Link>,
        and you can have both. It&apos;s also worth making sure you&apos;re in the right band. You
        can <Link href="/check-council-tax-band">check your council tax band</Link> free.
      </P>

      <PostCTA
        title="Find your council and claim"
        body="Every council runs its own claim form. Put in your postcode and I'll show you your council and what your band costs. Then claim on the council's own website."
        href="/council-tax-bands-scotland"
        cta="Find my council"
      />
    </Prose>
  );
}
