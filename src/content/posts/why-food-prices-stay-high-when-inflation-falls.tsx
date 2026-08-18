import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";

export default function Post() {
  return (
    <Prose>
      <Lead>
        Inflation tells us how quickly prices are changing. It does not tell us that prices have
        returned to where they started. A lower inflation rate can still mean a more expensive
        weekly shop.
      </Lead>

      <H2 id="simple">The simplest explanation</H2>
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

      <H2 id="numbers">What happened to food prices</H2>
      <BigStat
        value="38.6% higher"
        label="UK food and non-alcoholic drink prices in November 2025 than in November 2020"
        exact="Official ONS price data. The rise is cumulative across five years."
      />
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
        Brexit added a UK-specific cost. Research from the London School of Economics estimated
        that new non-tariff barriers added about eight percentage points to food-price growth from
        late 2019 to March 2023, roughly £250 for the average household over that period. It is an
        academic estimate, not a receipt count, and I label it that way.
      </P>

      <H2 id="fall">Can food prices actually fall?</H2>
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

      <H2 id="households">Why low-income households feel it most</H2>
      <P>
        Food takes a larger share of a small income. The same £10 increase therefore removes more
        of the money available for heating, travel or a child’s shoes. Official Household Costs
        Indices show that low-income households experienced about a third of cumulative cost growth
        over the five years to March 2026.
      </P>
      <P>
        Families should also check <Link href="/blog/free-school-meals-clothing-grant-scotland">free
        school meals and clothing grants</Link>. When there is no money for food or heating today,
        a <Link href="/blog/crisis-grant-scotland-how-to-apply">Crisis Grant</Link> may be the more
        urgent route.
      </P>

      <PostCTA
        title="Inflation is not an excuse to ignore the price level"
        body="The site turns the official figures into a ready-written question for the people who control wages, benefits and food policy. I find your MP and MSP automatically."
        href="/email-your-mp-and-msp"
        cta="Ask for an answer"
      />
    </Prose>
  );
}
