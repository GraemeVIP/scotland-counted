import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { G } from "@/components/Glossary";
import { scotlandPoverty } from "@/lib/data/scotland";

export default function Post() {
  return (
    <Prose>
      <Lead>
        Say the word poverty and someone will tell you that people should get a job. It is the
        oldest answer there is. It is also, for most families in poverty in Scotland, describing
        something they already did.
      </Lead>

      <BigStat
        value={`${scotlandPoverty.childrenInWorkingHouseholdsPct}%`}
        label="of children in poverty in Scotland live in a household where somebody works"
        exact={`Roughly 3 in every 4. Scottish Government, ${scotlandPoverty.period}.`}
      />

      <P>
        That is the whole argument in one number. Three quarters of the children counted as poor in
        Scotland have a parent who gets up and goes to work. Not a small minority. The clear
        majority.
      </P>

      <P>
        It means the common explanation for poverty — that it is caused by people not working —
        does not fit the facts. Something else is going on.
      </P>

      <H2 id="why-work-does-not-fix-it">So why does the work not fix it?</H2>

      <P>Three things, and they stack on top of each other.</P>

      <UL>
        <LI>
          <strong>Wages have not kept up.</strong> A job that covered the bills fifteen years ago
          may not cover them now. The price of food, energy and rent moved faster than pay did.
        </LI>
        <LI>
          <strong>The hours are not always there.</strong> Part-time work, short contracts and
          shifts that change week to week all mean the money changes week to week too. You cannot
          budget for a wage you cannot predict.
        </LI>
        <LI>
          <strong>Housing takes the difference.</strong> This is the big one, and it is the reason
          the official measure works the way it does.
        </LI>
      </UL>

      <H2 id="housing-costs">Why housing changes the picture</H2>

      <P>
        Poverty in these figures is measured <G t="ahc">after housing costs</G>. Rent or mortgage
        comes off first, and what is left is what counts.
      </P>

      <P>
        That is deliberate, and it is the fairer way round. Two families can earn exactly the same
        wage, and the one paying £700 a month in rent has far less to live on than the one paying
        £300. Measuring before housing would call them equally well off. They are not.
      </P>

      <Aside title="What this means in practice">
        <p>
          A pay rise that is swallowed by a rent rise does not move a family out of poverty. On
          paper they earn more. In the kitchen, nothing changed.
        </p>
      </Aside>

      <H2 id="what-this-changes">What this changes about the argument</H2>

      <P>
        If poverty were mostly about worklessness, the fix would be jobs. Scotland does not have a
        jobs problem of that kind — <Link href="/why-poverty-is-worse-in-glasgow">Glasgow has more jobs than
        working-age residents</Link>, and it still has the worst child poverty rate in the country.
      </P>

      <P>
        What moves the number is how much money families are left with: what they earn, what they
        get in support, and what housing takes. Those are decisions, and they are made by people
        you can name and write to.
      </P>

      <PostCTA
        title="Find out what it looks like where you live"
        body="Enter your postcode and see the figure for your own area, then send a ready-written email to the people who decide. It takes about a minute and you do not need to know anything about politics."
        href="/find-my-mp-and-msp"
        cta="See my area and email my MP"
      />

      <P>
        Every figure here is published and sourced. You can{" "}
        <Link href="/data">download the data</Link> or{" "}
        <Link href="/methods">read exactly how it was counted</Link>.
      </P>
    </Prose>
  );
}
