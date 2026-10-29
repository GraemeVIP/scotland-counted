import Link from "next/link";
import type { ReactNode } from "react";
import { Prose, Lead, P, H2, H3, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { ExplainText } from "@/components/Glossary";
import VideoEmbed from "@/components/VideoEmbed";
import { JsonLd, videoJsonLd } from "@/lib/seo";
import { GuideTable } from "@/components/GuideTable";
import { bandDRange, pounds } from "@/lib/data/quickAnswers";
import { ASHE_2026, CITY_PAY, PRIVATE_RENTS, minimumWageNow } from "@/lib/data/money";
import { calculate } from "@/lib/tax/engine";

import { costOfLivingVideo as VIDEO } from "@/lib/data/video";

/** ONS consumer price inflation, UK, 12 months to September 2026 (released 21 October 2026). */
const CPI = { june: 2.6, september: 3.5 };

/** Ofgem price cap, typical use, Direct Debit, 1 October to 31 December 2026. */
const ENERGY_CAP = 1723;

/** ONS Price Index of Private Rents, September 2026: UK average for all homes, and its change on a year. */
const UK_RENT = { all: 1406, allChangePct: 3.8 };

function Decision({
  title,
  who,
  children,
  proof,
}: {
  title: string;
  who: string;
  children: ReactNode;
  proof: string;
}) {
  return (
    <section className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
      <p className="ui text-[15px] font-[600] text-[var(--action-text)]">{who}</p>
      <h3 className="text-[21px] font-[620] leading-[1.25] text-[var(--ink)] mt-2">{title}</h3>
      <div className="text-[17px] leading-[1.62] text-[var(--ink-2)] mt-3 space-y-3"><ExplainText>{children}</ExplainText></div>
      <p className="text-[15px] leading-[1.5] text-[var(--muted)] mt-4 pt-4 border-t border-[var(--rule)]">
        <strong className="text-[var(--ink-2)]">The record:</strong> <ExplainText>{proof}</ExplainText>
      </p>
    </section>
  );
}

export default function Post() {
  const councilTax = bandDRange();
  const rentShare = Math.round((PRIVATE_RENTS.scotland.oneBed / minimumWageNow.netMonthly) * 100);
  const taxGap = (salary: number) => calculate(salary, "scotland").net - calculate(salary, "ruk").net;
  const lothian = CITY_PAY["city-of-edinburgh"].rent;
  const dundee = CITY_PAY["dundee-city"].rent;

  return (
    <Prose>
      <Lead>
        The cost of living in Scotland is still high because prices rose sharply between 2021 and
        2023 and most of them never came back down. Inflation was {CPI.september}% in the year to
        September 2026, so prices are now rising again from that much higher starting point. The
        crisis did not end when the inflation number came down.
      </Lead>

      <BigStat
        value="About 34%"
        label="rise in everyday household costs over five years for people on low incomes"
        exact="ONS Household Costs Index, five years to March 2026: 33.9%. These figures are official statistics in development."
      />

      <JsonLd data={videoJsonLd(VIDEO)} />

      <VideoEmbed
        id={VIDEO.youtubeId}
        title={VIDEO.name}
        poster="/images/video/refresh-video-cost-living.webp"
        className="my-10"
        caption="Six minutes on where the money actually went: energy company profits, supermarket fuel margins and what the ONS, the IMF and the competition watchdog found."
      />

      <H2 id="what-is-happening">What is happening now</H2>

      <P>
        In June 2026, the main UK inflation rate was {CPI.june}%. By September it had climbed back
        to {CPI.september}%, with petrol and diesel giving the biggest push. Even a low rate would
        not mean the problem has gone away. It means a basket that already became far more
        expensive is still getting another {CPI.september}% dearer over the year.
      </P>

      <Aside title="Lower inflation does not mean lower prices">
        <p>
          Think of a car slowing down. It is still moving forward. Inflation slowing means prices
          are going up more slowly; it does not rewind the food shop, rent or power bill to 2021.
        </p>
      </Aside>

      <P>
        This hits people on low pay hardest because there is less that can be cut. A better off
        household can delay a holiday or save less. A family already buying the cheapest food
        cannot stop buying dinner, heating the home or paying the rent.
      </P>

      <div className="grid gap-3 sm:grid-cols-3 my-7">
        {[
          ["Food", "The weekly shop rose fast, then stayed expensive."],
          ["Energy", "Gas and electricity jumped, and standing charges kept landing."],
          ["Housing", "Rent and mortgage costs carried on rising after the worst inflation passed."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-[var(--r-s)] bg-[var(--surface-2)] border border-[var(--rule)] p-5">
            <p className="ui text-[17px] font-[620] text-[var(--ink)]">{title}</p>
            <p className="text-[15.5px] leading-[1.55] text-[var(--ink-2)] mt-2">{body}</p>
          </div>
        ))}
      </div>

      <P>
        The detailed guides explain <Link href="/blog/why-food-prices-stay-high-when-inflation-falls">why
        food stays expensive when inflation falls</Link> and why the <Link href="/energy-price-cap-scotland">energy
        price cap is not a maximum bill</Link>.
      </P>

      <H2 id="monthly-costs">What is the cost of living in Scotland? The main bills in 2026</H2>

      <P>
        These are the latest official figures for the biggest fixed costs a household in Scotland
        faces. Food is not in the table because there is no official figure for a typical shop,
        only for how fast prices change.
      </P>

      <GuideTable
        kicker="Scotland, autumn 2026"
        title="What the main household bills cost"
        columns={["Cost", "A month", "A year", "What the figure is"]}
        align={["left", "right", "right", "left"]}
        rows={[
          [
            "Rent, one bedroom home",
            pounds(PRIVATE_RENTS.scotland.oneBed),
            pounds(PRIVATE_RENTS.scotland.oneBed * 12),
            `ONS average private rent in Scotland, ${PRIVATE_RENTS.month}`,
          ],
          [
            "Rent, all homes",
            pounds(PRIVATE_RENTS.scotland.all),
            pounds(PRIVATE_RENTS.scotland.all * 12),
            `ONS average private rent in Scotland, ${PRIVATE_RENTS.month}`,
          ],
          [
            "Gas and electricity",
            pounds(ENERGY_CAP / 12),
            pounds(ENERGY_CAP),
            "Ofgem price cap for typical use, Direct Debit, October to December 2026",
          ],
          [
            "Council tax and water, Band D",
            `${pounds(councilTax.lowest.total / 12)} to ${pounds(councilTax.highest.total / 12)}`,
            `${pounds(councilTax.lowest.total)} to ${pounds(councilTax.highest.total)}`,
            `2026/27, from ${councilTax.lowest.name} (lowest) to ${councilTax.highest.name} (highest)`,
          ],
        ]}
        caption="ONS rents in Scotland are mostly advertised new lets, so they show what someone moving now would pay. Council tax depends on your band and council; Band D is the reference band."
      />

      <P>
        Against that, the typical full time employee living in Scotland earned{" "}
        {pounds(ASHE_2026.scotland.annual)} a year before tax in April 2026. Someone working full
        time on the minimum wage takes home about {pounds(minimumWageNow.netMonthly)} a month, so
        an average one bedroom rent alone would take {rentShare}% of it.
      </P>

      <P>
        Check your own figures: <Link href="/check-council-tax-band">find your council tax
        band</Link>, see <Link href="/water-rates-scotland">water rates in Scotland</Link>, or
        compare with the <Link href="/average-salary-scotland">average salary in Scotland</Link>.
      </P>

      <H2 id="scotland-vs-uk">Is living in Scotland expensive compared with the rest of the UK?</H2>

      <UL>
        <LI>
          <strong>Rent is lower on average, but not everywhere.</strong> The average private rent in
          Scotland was {pounds(PRIVATE_RENTS.scotland.all)} a month in {PRIVATE_RENTS.month},
          against {pounds(UK_RENT.all)} across the UK. Scottish rents rose{" "}
          {PRIVATE_RENTS.scotland.allChangePct}% in a year, against {UK_RENT.allChangePct}% for the
          UK. Inside Scotland the spread is wide: a one bedroom home averages{" "}
          {pounds(lothian.oneBed)} in the Lothian area around Edinburgh and {pounds(dundee.oneBed)}{" "}
          around Dundee.
        </LI>
        <LI>
          <strong>Pay is close to the UK figure.</strong> Typical full time pay for people living in
          Scotland was {pounds(ASHE_2026.scotland.annual)} in April 2026, against{" "}
          {pounds(ASHE_2026.uk.annual)} for the UK.
        </LI>
        <LI>
          <strong>Income tax depends on what you earn.</strong> On £25,000 a year, Scottish income
          tax leaves you about {pounds(taxGap(25000))} a year better off than in England. On
          £50,000 you take home about {pounds(-taxGap(50000))} less. See{" "}
          <Link href="/30000-after-tax-scotland">£30,000 after tax in Scotland</Link> for a worked
          example.
        </LI>
        <LI>
          <strong>Some help only exists in Scotland.</strong> The Scottish Child Payment adds £28.20
          a week per child for low income families.
        </LI>
      </UL>

      <H2 id="what-started-it">Cost of living crisis Scotland: what started it</H2>

      <P>Two big shocks were real, global and outside the control of any Scottish MP.</P>

      <UL>
        <LI>
          <strong>The pandemic jammed up supply.</strong> Factories shut, shipping backed up and
          materials became harder to get just as economies reopened and demand returned.
        </LI>
        <LI>
          <strong>Russia&apos;s invasion of Ukraine sent energy and food costs soaring.</strong>{" "}
          Europe paid much more for gas. Grain, fertiliser and transport costs rose too.
        </LI>
      </UL>

      <P>
        The Bank of England then raised interest rates to slow price rises. That was its job under
        the inflation target set by government, but the medicine hurt: mortgages, borrowing and
        eventually rents became more expensive.
      </P>

      <P>
        So no, MPs did not cause a pandemic or start the war in Ukraine. But that is not the end
        of the story. Governments choose how protected people are before a shock, what extra costs
        they add, and how quickly help catches up.
      </P>

      <H2 id="decisions-made-it-worse">The choices that made it worse</H2>

      <P>
        These are the avoidable parts. Each one has a date, a decision maker and a public record.
        They are not all the work of the same party, and they did not all cause the original
        inflation. They did make ordinary households less able to cope with it.
      </P>

      <div className="grid gap-4 my-7">
        <Decision
          who="UK Government and MPs · 2016 to 2020"
          title="They froze working age benefits before prices exploded"
          proof="The Welfare Reform and Work Bill passed its final Commons division by 309 votes to 274. Independent JRF modelling put the real terms loss at 6.5% by 2019."
        >
          <p>
            Universal Credit rates, Child Benefit and other working age support were held at the
            same cash amount for four years. Prices kept moving. The safety net became worth less
            before the biggest price shock in forty years arrived.
          </p>
        </Decision>

        <Decision
          who="UK Government · October 2021"
          title="They removed £20 a week from Universal Credit"
          proof="The temporary uplift was allowed to expire in October 2021. That was £1,040 a year from affected households."
        >
          <p>
            The increase had been introduced during Covid. The Government chose not to keep it,
            despite warnings from committees in all four UK nations. This was not a Commons vote
            that directly cut the payment; ministers let the temporary increase end.
          </p>
        </Decision>

        <Decision
          who="UK Government and regulators"
          title="They allowed avoidable costs to build up in food and energy"
          proof="LSE researchers estimated post Brexit food barriers added about £250 per household by March 2023. The NAO said weak Ofgem licensing and monitoring increased the £2.7bn cost of supplier failures."
        >
          <p>
            Brexit did not cause all food inflation, and failed energy firms did not cause the
            global gas spike. But new trade barriers added friction to food imports, while weakly
            financed energy suppliers collapsed and their costs were passed back to customers.
          </p>
        </Decision>

        <Decision
          who="Truss Government · September 2022"
          title="The mini budget poured panic into the mortgage market"
          proof="The Commons Library records a UK specific part of the market shock, sharply higher gilt yields and substantially higher mortgage offers after the announcement."
        >
          <p>
            Interest rates were already rising. The mini budget did not create the whole mortgage
            squeeze. But announcing around £45 billion of tax cuts without an OBR forecast made a
            bad market much worse, fast. Most of the plan was then reversed.
          </p>
        </Decision>

        <Decision
          who="UK Government · still in force in 2026/27"
          title="Rent support is frozen while rents keep moving"
          proof="The 2026/27 Local Housing Allowance tables carry forward the April 2024 cash rates and explicitly leave newer 2025 rent evidence out of the calculation."
        >
          <p>
            Local Housing Allowance limits how much Universal Credit can help a private renter
            with rent. It was reset in April 2024, then frozen again. The present UK Government
            has continued that freeze through 2026/27. <Link href="/blog/local-housing-allowance-rent-shortfall-scotland">See
            the current Scottish rates and the Greater Glasgow shortfall</Link>.
          </p>
        </Decision>

        <Decision
          who="Conservative and Labour UK governments"
          title="Frozen tax allowances quietly take more from wages"
          proof="The personal allowance has stayed at £12,570 since 2022/23. The November 2025 Budget extended the freeze to 2030/31."
        >
          <p>
            When pay rises but the tax free allowance does not, more of the wage is taxed. That is
            called fiscal drag. Conservatives introduced and extended the freeze; Labour extended
            it again. Scotland sets its own income tax bands, but Westminster still controls the
            tax free personal allowance.
          </p>
        </Decision>

        <Decision
          who="Scottish Government · 2024/25"
          title="Holyrood cut affordable housing money during a housing emergency"
          proof="The Scottish Parliament research service records a 25% real terms fall in the programme for 2024/25. Funding rose by 32% the next year, but the building pipeline had already been hit."
        >
          <p>
            Westminster does not control every part of this. Housing is devolved. The Scottish
            Government cut the affordable housing programme, then restored it after pressure and
            extra funding. Putting money back was right; making the cut in the first place was not.
          </p>
        </Decision>
      </div>

      <H2 id="glasgow-hit">Why Glasgow feels it harder</H2>

      <BigStat
        value="£1,094"
        label="average monthly advertised rent for a two bedroom home in Greater Glasgow in 2025"
        exact="Up 94% since 2010, compared with 54.7% general UK inflation over the same period. Scottish Government private rent statistics."
      />

      <P>
        That rent figure mostly reflects homes being advertised or newly let. It is not what every
        existing tenant pays. It still shows the price facing somebody who needs to move today.
      </P>

      <P>
        Glasgow entered the crisis with more people already on low incomes, worse health, and a
        much higher child poverty rate than most of Scotland. The same £20 increase hurts more when
        there was only £10 spare in the first place.
      </P>

      <P>
        A worker aged 21 or over on the legal minimum of £12.71 an hour, paid for 37.5 hours every
        week, earns £24,784.50 gross a year. The Joseph Rowntree Foundation found that full time
        minimum wage pay covered only 76% of what a single adult needed for a basic acceptable
        living standard in 2025. For a lone parent with two young children it covered 69%. See the
        full <Link href="/minimum-wage-scotland">minimum wage take home
        calculation</Link>.
      </P>

      <Aside title="This is why 'get a job' is not an answer">
        <p>
          The shortfall can exist before a person misses a shift, buys anything unusual or makes a
          bad choice. The legal wage floor itself can leave a full time worker below what ordinary
          life costs.
        </p>
      </Aside>

      <H2 id="what-helped">Decisions that did help</H2>

      <P>
        Government choices can lower the pressure too. The UK energy guarantee stopped the first
        shock landing in full. In Scotland, the Scottish Child Payment puts £28.20 a week per child
        into low income households; Scottish Government modelling estimates it keeps 40,000
        children out of relative poverty in 2025/26.
      </P>

      <P>
        Holyrood also restored affordable housing funding in 2025/26, and the UK Government has now
        abolished the two child limit. Those facts matter because accountability is not about
        pretending every decision failed. It is about keeping the useful choices and reversing
        the damaging ones.
      </P>

      <H2 id="who-can-fix-it">Who can fix what</H2>

      <div className="grid gap-3 my-7">
        <div className="rounded-[var(--r-s)] border-l-[5px] border-l-[var(--action)] bg-[var(--surface-2)] p-5 sm:p-6">
          <H3>Your MP at Westminster</H3>
          <p className="text-[17px] leading-[1.6] text-[var(--ink-2)] mt-2">
            Universal Credit, Local Housing Allowance, the legal minimum wage, the tax free
            allowance, energy market rules and most of the big economic decisions.
          </p>
        </div>
        <div className="rounded-[var(--r-s)] border-l-[5px] border-l-[var(--brand)] bg-[var(--surface-2)] p-5 sm:p-6">
          <H3>Your MSP at Holyrood</H3>
          <p className="text-[17px] leading-[1.6] text-[var(--ink-2)] mt-2">
            Scottish benefits, housing, rent rules, childcare, Scottish income tax bands and much
            of public transport.
          </p>
        </div>
        <div className="rounded-[var(--r-s)] border-l-[5px] border-l-[var(--good)] bg-[var(--surface-2)] p-5 sm:p-6">
          <H3>Your council</H3>
          <p className="text-[17px] leading-[1.6] text-[var(--ink-2)] mt-2">
            Council tax, local housing and homelessness help, crisis grants, schools and many of
            the services people rely on when money runs out.
          </p>
        </div>
      </div>

      <PostCTA
        title="Ask the right people what they will change"
        body="Enter your postcode. I find your MP and MSP automatically, use the right local facts, write both emails and open them in your email app. You do not need to know who represents you."
        href="/email-your-mp-and-msp"
        cta="Find them and write my emails"
      />

      <P>
        Want to inspect the proof first? Every source used here is listed below. You can also see{" "}
        <Link href="/solutions-to-poverty-in-scotland">which changes would make the biggest difference</Link> and{" "}
        <Link href="/methods">how this site checks a claim</Link>.
      </P>
    </Prose>
  );
}
