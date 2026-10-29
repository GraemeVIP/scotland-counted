import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";

/**
 * ONS consumer price index for food and non alcoholic beverages, UK.
 * Index (2015 = 100, series D7BU) and 12 month rate (series D7G8) for each
 * September, released 21 October 2026. Checked 29 October 2026.
 */
const FOOD = [
  { year: 2021, index: 104.2, rate: 0.8 },
  { year: 2022, index: 119.3, rate: 14.5 },
  { year: 2023, index: 133.8, rate: 12.1 },
  { year: 2024, index: 136.3, rate: 1.9 },
  { year: 2025, index: 142.5, rate: 4.5 },
  { year: 2026, index: 144.3, rate: 1.3 },
];
const FOOD_PEAK = { month: "March 2023", rate: 19.1 };
const CPI_SEPTEMBER_2026 = 3.5;

const BASE = FOOD[0];
const LATEST = FOOD[FOOD.length - 1];
const fiveYearRise = ((LATEST.index - BASE.index) / BASE.index) * 100;
const gbp = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 }).format(value);

export default function Post() {
  return (
    <Prose>
      <Lead>
        Food prices in Scotland are still high because inflation measures how fast prices rise, not
        whether they fall back. UK food prices rose {LATEST.rate}% in the year to September 2026,
        but that sits on top of a {fiveYearRise.toFixed(1)}% rise over five years. A lower
        inflation rate can still mean a more expensive weekly shop.
      </Lead>

      <H2 id="simple">Why food prices stay high when inflation falls</H2>
      <P>
        Imagine a basket costs £100. After a 10% rise it costs £110. If inflation then falls to 2%,
        the basket does not go back to £102. It rises again to £112.20. The speed of the rise fell;
        the price did not.
      </P>
      <Aside title="Falling inflation is not falling prices">
        <p>
          Prices falling across a category is called deflation. It can happen to individual items,
          but a lower positive inflation rate means the overall price level is still going up.
        </p>
      </Aside>

      <H2 id="numbers">Food prices in Scotland: the latest figures</H2>
      <BigStat
        value={`${fiveYearRise.toFixed(1)}% higher`}
        label="UK food and non alcoholic drink prices in September 2026 than in September 2021"
        exact={`Official ONS price index. Over the year to September 2026 food prices rose ${LATEST.rate}%, while prices overall rose ${CPI_SEPTEMBER_2026}%.`}
      />
      <P>
        There is no separate official monthly food price index for Scotland. The ONS figures cover
        the whole UK, including Scotland. Measured from November 2020 to November 2025, the rise
        was 38.6%.
      </P>
      <GuideTable
        kicker="ONS consumer price index, UK"
        title="Food price inflation each September"
        columns={["Year to September", "Food prices rose", "What £100 of food from September 2021 cost"]}
        align={["left", "right", "right"]}
        rows={FOOD.slice(1).map((row) => [
          String(row.year),
          `${row.rate}%`,
          gbp((row.index / BASE.index) * 100),
        ])}
        caption="The yearly rates are published by the ONS. The last column is my sum from the ONS food price index: the same food that cost £100 in September 2021 cost this much in September of each later year."
      />
      <P>
        Food inflation peaked at {FOOD_PEAK.rate}% in {FOOD_PEAK.month}. It has been far lower
        since, but in every year shown the price of food still went up.
      </P>
      <P>
        Pay also rose for many workers, but not every income kept up and not every household starts
        from the same position. Someone already spending nearly all income on essentials cannot
        swap a holiday or savings contribution for dearer food. There may be nothing flexible left.
      </P>

      <H2 id="why">Why food rose so sharply</H2>
      <P>
        Several shocks landed together. Energy became more expensive for farms, factories,
        refrigeration and transport. Fertiliser and other inputs rose. Bad harvests and global
        disruption affected some products. Labour and packaging costs also changed.
      </P>
      <P>
        Brexit added a UK specific cost. Research from the London School of Economics estimated
        that new non tariff barriers added about eight percentage points to food price growth from
        late 2019 to March 2023, roughly £250 for the average household over that period. It is an
        academic estimate, not a receipt count, and I label it that way.
      </P>

      <H2 id="fall">Will food prices go down?</H2>
      <P>
        Individual products move up and down all the time. A supermarket can also cut one visible
        price while another size shrinks or a promotion ends. A broad fall needs costs or margins
        across enough products to come down, and businesses must pass those savings on.
      </P>
      <UL>
        <LI>A sale is temporary; it is not the same as a lower normal price.</LI>
        <LI>A smaller pack at the same price is a price rise per gram.</LI>
        <LI>Cheaper fuel can help transport costs without reversing every earlier increase.</LI>
      </UL>

      <H2 id="households">Why low income households feel it most</H2>
      <P>
        Food takes a larger share of a small income. The same £10 increase therefore removes more
        of the money available for heating, travel or a child&apos;s shoes. Official Household Costs
        Indices show that low income households experienced about a third of cumulative cost growth
        over the five years to March 2026.
      </P>
      <P>
        The same pressure runs through the rest of the budget. See{" "}
        <Link href="/cost-of-living-scotland">why the cost of living in Scotland is
        still so high</Link> and what the <Link href="/energy-price-cap-scotland">energy price
        cap</Link> means for heating bills.
      </P>

      <H2 id="help">Help with food costs in Scotland</H2>
      <UL>
        <LI>
          <strong>Best Start Foods:</strong> a prepaid card for healthy food if you are pregnant or
          have a young child and get certain benefits. It is part of the{" "}
          <Link href="/best-start-grant">Best Start Grant</Link> application.
        </LI>
        <LI>
          <strong>Free school meals:</strong> every pupil in primary 1 to primary 5 at a publicly
          funded school gets a free lunch, and older pupils can qualify on income. See{" "}
          <Link href="/blog/free-school-meals-clothing-grant-scotland">free school meals and
          clothing grants</Link>.
        </LI>
        <LI>
          <strong>Scottish Child Payment:</strong> a weekly payment for each child under 16 in a
          family on a qualifying benefit. See the <Link href="/scottish-child-payment">Scottish
          Child Payment</Link> guide.
        </LI>
        <LI>
          <strong>Crisis Grant:</strong> when there is no money for food or heating today, a{" "}
          <Link href="/crisis-grant-scotland">Crisis Grant</Link> from your council may be the
          more urgent route. The <Link href="/crisis-grant-phone-number">Crisis Grant phone
          numbers</Link> page lists every council.
        </LI>
      </UL>
      <P>
        For everything else you might be due, see the guide to{" "}
        <Link href="/benefits">benefits in Scotland</Link>.
      </P>

      <PostCTA
        title="Inflation is not an excuse to ignore the price level"
        body="The site turns the official figures into a ready written question for the people who control wages, benefits and food policy. I find your MP and MSP automatically."
        href="/email-your-mp-and-msp"
        cta="Ask for an answer"
      />
    </Prose>
  );
}
