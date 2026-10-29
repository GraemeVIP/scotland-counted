import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { CRISIS_GRANT_LINES, telHref } from "@/lib/data/benefits";
import { crisisGrantCouncils, crisisGrantScotland } from "@/lib/data/crisisGrants";
import { pounds } from "@/lib/data/quickAnswers";

const count = (value: number) => value.toLocaleString("en-GB");

/** The councils people search for by name, largest first. */
const LARGEST_COUNCILS = [
  "glasgow-city",
  "city-of-edinburgh",
  "fife",
  "north-lanarkshire",
  "aberdeen-city",
  "south-lanarkshire",
  "midlothian",
  "dundee-city",
];

const byAverageAward = [...crisisGrantCouncils].sort((a, b) => a.averageAward - b.averageAward);
const lowestAverage = byAverageAward[0];
const highestAverage = byAverageAward[byAverageAward.length - 1];

export default function Post() {
  const s = crisisGrantScotland;
  const lines = LARGEST_COUNCILS.map((slug) => CRISIS_GRANT_LINES.find((line) => line.councilSlug === slug)).filter(
    (line): line is NonNullable<typeof line> => line !== undefined,
  );

  return (
    <Prose>
      <Lead>
        A crisis grant is emergency money from the Scottish Welfare Fund that you do not pay back.
        In Scotland you apply to the council where you live, online or by phone, and the council
        should decide by the end of the next working day.
      </Lead>
      <P>
        In 2025/26 Scottish councils received {count(s.applications)} crisis grant applications and
        made {count(s.awards)} awards, {s.acceptanceRate}% of the decisions. The average award was{" "}
        {pounds(s.averageAward)}. It is help with an emergency rather than a fixed sum, so what you
        get depends on what you need right now.
      </P>

      <H2 id="what-it-is">What a crisis grant is</H2>
      <P>
        The Scottish Welfare Fund has two grants. A crisis grant is for an immediate emergency, such
        as losing your money, a fire or flood, or having nothing left for food or heating. A
        community care grant helps someone set up home or stay living independently. Neither is a
        loan.
      </P>
      <Aside title="It is not a Universal Credit advance">
        <p>
          A Universal Credit advance is normally recovered from later benefits. A Scottish Welfare
          Fund grant is council administered emergency support that you do not pay back.
        </p>
      </Aside>

      <H2 id="who">Who can apply for a crisis grant</H2>
      <P>
        You must be at least 16 and on a low income or receiving certain benefits. You do not need
        to be unemployed. The council looks at the emergency, the money and help available to you,
        and whether a grant is an appropriate way to prevent serious harm.
      </P>
      <P>
        Apply to the council where you live. The Scottish Government sets the national scheme, but
        it does not take individual applications. Under the national guidance you can normally get
        no more than three crisis grants in 12 months, unless the council accepts that your
        circumstances are exceptional.
      </P>

      <H2 id="covers">What a crisis grant can cover</H2>
      <UL>
        <LI>Food when an emergency has left you with nothing to eat.</LI>
        <LI>Heating or electricity during an immediate crisis.</LI>
        <LI>Essential travel or other urgent living costs.</LI>
        <LI>Needs arising after a fire, flood, theft or sudden loss of income.</LI>
      </UL>
      <P>
        It is not a general top up for every low income and it will not usually clear old debt. Say
        what happened, what is needed now and what harm will occur if help does not arrive.
      </P>
      <P>
        Councils pay in the way that fits the emergency, often a bank transfer, a voucher or a top
        up straight onto a prepayment meter. If you have no bank account, say so when you apply.
      </P>

      <H2 id="how-much">How much is a crisis grant?</H2>
      <P>
        There is no set amount. The council pays for the items or costs that get you through the
        emergency. The national figures give a sense of the scale.
      </P>
      <GuideTable
        kicker="Scottish Welfare Fund, 2025/26"
        title="Crisis grants across Scotland"
        columns={["Measure", "Figure"]}
        align={["left", "right"]}
        rows={[
          ["Applications", count(s.applications)],
          ["Awards", count(s.awards)],
          ["Share of decisions that led to an award", `${s.acceptanceRate}%`],
          ["Total paid in crisis grants", pounds(s.spend)],
          ["Average award", pounds(s.averageAward)],
          ["Decided by the end of the next working day (January to March 2026)", `${s.processedByNextWorkingDay}%`],
        ]}
        caption={
          <>
            Scottish Government, Scottish Welfare Fund statistics to 31 March 2026. Counts are
            published rounded to the nearest five. Every council&apos;s figures are in the{" "}
            <Link href="/blog/crisis-grant-acceptance-rates-scotland-councils">crisis grant acceptance rates</Link>{" "}
            piece.
          </>
        }
      />
      <P>
        The average award ranges from {pounds(lowestAverage.averageAward)} in {lowestAverage.council}{" "}
        to {pounds(highestAverage.averageAward)} in {highestAverage.council}. Island councils make
        far fewer awards than the cities, so their averages are less typical.
      </P>

      <H2 id="apply">Apply for crisis grant help online or by phone</H2>
      <P>
        You apply to your own council, not to the Scottish Government or the DWP. Most councils have
        an online form and most also take applications by phone. If you are not sure which council
        covers your address, <Link href="/areas">find your council area</Link> first.
      </P>
      <GuideTable
        kicker="The largest councils"
        title="Crisis grant phone numbers"
        columns={["Council", "Phone", "Notes"]}
        rows={lines.map((line) => [
          <Link key="c" href={`/councils/${line.councilSlug}`}>{line.council}</Link>,
          line.phone ? (
            <a key="p" href={telHref(line.phone)} className="whitespace-nowrap font-[560]">
              {line.phone}
            </a>
          ) : (
            <a key="p" href={line.url}>Apply online</a>
          ),
          [line.hours, line.note].filter(Boolean).join(". "),
        ])}
        caption={
          <>
            Taken from each council&apos;s own crisis grant page, checked 29 October 2026. The
            numbers for all 32 councils are on the{" "}
            <Link href="/crisis-grant-phone-number">crisis grant phone number</Link> page.
          </>
        }
      />
      <H3>Have these details ready</H3>
      <UL>
        <LI>Your name, address, date of birth and National Insurance number if you have one.</LI>
        <LI>Who lives with you and any children or health needs.</LI>
        <LI>Current income, benefits, bank balance and essential outgoings.</LI>
        <LI>A short account of the emergency and what you need today.</LI>
      </UL>
      <P>
        If forms are difficult, ask the council, a library, Citizens Advice or a local welfare
        rights service to help. Do not wait to make the wording perfect while the emergency gets
        worse.
      </P>

      <H2 id="application">Crisis grant application: what happens next</H2>
      <P>
        Once the council has everything it needs, it should decide a crisis grant by the end of the
        next working day. A working day runs to 4.45pm, so an application that arrives later, or at
        a weekend, counts from the next working day. Nationally, {s.processedByNextWorkingDay}% of
        decisions met the deadline in January to March 2026.
      </P>
      <P>
        If the council asks for more information, reply quickly, because the decision clock starts
        once it has what it needs. To check on an application, phone the council&apos;s Scottish
        Welfare Fund team with your name, address and the date you applied. Each council handles
        its own applications, so it is the only place that can tell you where yours has got to.
      </P>

      <H2 id="crisis-loan">Crisis loan Scotland: what replaced it</H2>
      <P>
        Crisis loans from the DWP Social Fund ended in Scotland on 1 April 2013. The Scottish
        Welfare Fund replaced them, along with community care grants, and it gives grants rather
        than loans. If you are searching for a crisis loan in Scotland, the crisis grant is what you
        are looking for.
      </P>
      <P>
        The only loan left for an emergency is a Universal Credit advance from the DWP, which is
        taken back from later payments. A crisis grant is not.
      </P>

      <H2 id="community-care-grant">Crisis grant or community care grant</H2>
      <P>
        A community care grant is the other half of the Scottish Welfare Fund. It helps people stay
        in their community rather than go into care, set up home after care, hospital, prison or
        homelessness, or keep a family together under exceptional pressure. It often pays for
        essentials such as beds, furniture and kitchen items.
      </P>
      <P>
        Councils usually use one form for both grants. A community care grant takes longer: the
        council has up to 15 working days from having all the information it needs.
      </P>

      <H2 id="refused">If the council says no</H2>
      <P>
        Ask for the reason, then ask for a review. You normally have 20 working days from the
        decision to ask, and councils aim to decide a crisis grant review within 2 working days.
        Correct anything that was misunderstood and give missing evidence. Explain the immediate
        risk in plain terms: no food, no heat, unsafe travel, or a child or disabled person
        affected.
      </P>
      <P>
        If the review still says no, the Scottish Public Services Ombudsman can look at it
        independently, free on 0800 014 7299. Ask soon after the review decision, because there is
        a time limit.
      </P>
      <P>
        A grant cannot solve an ongoing rent gap. For that, check{" "}
        <Link href="/blog/discretionary-housing-payment-scotland">Discretionary Housing Payments</Link>.
        If council tax is part of the problem, check{" "}
        <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link>, and see the{" "}
        <Link href="/benefits">benefits guides</Link> for regular help you may be missing.
      </P>

      <PostCTA
        title="Apply through your council"
        body="Every Scottish council runs its own Scottish Welfare Fund. Find your council's crisis grant phone number, opening hours and online form."
        href="/crisis-grant-phone-number"
        cta="Find my council's number"
      />
    </Prose>
  );
}
