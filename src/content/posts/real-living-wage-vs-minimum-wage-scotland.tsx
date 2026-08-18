import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";

export default function Post() {
  return (
    <Prose>
      <Lead>
        The UK Government’s “National Living Wage” is the legal minimum for workers aged 21 and
        over. The “real Living Wage” is a different, voluntary figure calculated from living
        costs. The names make a simple difference needlessly confusing.
      </Lead>

      <H2 id="short-answer">The short answer</H2>
      <UL>
        <LI>The legal minimum is £12.71 an hour for workers aged 21 and over from April 2026.</LI>
        <LI>The real Living Wage is £13.45 an hour outside London.</LI>
        <LI>Every employer must pay the legal minimum. Paying the real Living Wage is voluntary.</LI>
      </UL>

      <H2 id="legal">The legal minimum</H2>
      <P>
        Minimum wage law covers Scotland, England, Wales and Northern Ireland. The UK Government
        sets the rates after advice from the Low Pay Commission. The adult rate is linked to a
        share of typical hourly earnings, not to a shopping basket showing what a household needs.
      </P>
      <P>
        An employer cannot choose to pay less because the business is small or because the worker
        agrees. Age and apprenticeship rules can produce a lower legal rate, which is why two
        adults doing similar work may lawfully receive different hourly pay.
      </P>

      <H2 id="real">The real Living Wage</H2>
      <P>
        The Living Wage Foundation commissions a separate calculation based on the Minimum Income
        Standard. Researchers price the goods and services the public agrees are needed for a
        decent basic life, then turn that into an hourly rate.
      </P>
      <Aside title="The word “real” does not make it law">
        <p>
          It distinguishes the cost-based Living Wage from the government’s legal rate with a
          similar name. An accredited employer promises to pay it, but the legal minimum wage
          remains the floor that every employer must meet.
        </p>
      </Aside>

      <H2 id="difference">What the gap is worth</H2>
      <BigStat
        value="74p an hour"
        label="the difference between £13.45 and £12.71"
        exact="At 37.5 paid hours a week for 52 weeks, that is £1,443 before tax over a year."
      />
      <P>
        That does not solve every household budget. Rent, children, disability, travel and benefit
        rules change what a household needs and keeps. It does show why a small-looking hourly gap
        matters across a full year.
      </P>

      <H2 id="check">How to check your employer</H2>
      <P>
        First check the legal rate for your age and apprenticeship year. Then divide pay before tax by
        the paid hours in the pay period. Do not count unpaid breaks as paid work, but do include
        time the law treats as working time.
      </P>
      <P>
        If the employer advertises itself as a Living Wage employer, check the Living Wage
        Foundation’s employer directory. If it is only paying the legal minimum, that may be
        lawful even though it falls short of the voluntary rate.
      </P>
      <P>
        See <Link href="/blog/minimum-wage-take-home-pay-scotland-2026">what the legal minimum
        becomes after Scottish tax and National Insurance</Link> before comparing it with rent and
        bills.
      </P>

      <PostCTA
        title="Low pay is a decision, not a mystery"
        body="Westminster sets the legal minimum. Employers decide whether to stop there. I can find your MP automatically and prepare the right email without asking you to understand the political split."
        href="/email-your-mp-and-msp"
        cta="Email my MP"
      />
    </Prose>
  );
}
