import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { G } from "@/components/Glossary";
import { povertyLine } from "@/lib/data/indicators";
import { scotlandPoverty } from "@/lib/data/scotland";

export default function Post() {
  return (
    <Prose>
      <Lead>
        When a report says a million people are in poverty, it is not a figure of speech. There is
        an exact test behind it. Once you know the test, every other number on this site becomes
        readable.
      </Lead>

      <H2>The short version</H2>

      <P>
        A household is counted as being in poverty when it has <strong>less than 60% of what a
        normal household in the UK has</strong> to live on, once rent or mortgage is paid.
      </P>

      <P>
        That is it. It is a comparison. It asks whether a family has fallen a long way behind what
        is normal in the country they live in.
      </P>

      <H2>What that is in real money</H2>

      <P>
        Percentages are hard to picture, so here is the same line in pounds per week. This is the
        money left <G t="ahc">after housing costs</G> in {povertyLine.year}. Below these figures, a
        household counted as being in poverty:
      </P>

      <div className="my-7 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] overflow-hidden">
        {povertyLine.rows.map((row, index) => (
          <div
            key={row.who}
            className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 sm:px-6 py-4 ${
              index > 0 ? "border-t border-[var(--rule)]" : ""
            }`}
          >
            <p className="text-[16.5px] leading-[1.5] text-[var(--ink-2)] max-w-[42ch]">
              {row.who}
            </p>
            <p className="figure-num text-[22px] text-[var(--ink)] tnum whitespace-nowrap">
              {row.amount}
            </p>
          </div>
        ))}
      </div>

      <P>
        That is for everything that is not rent: food, gas, electricity, travel, school shoes,
        a birthday. If a family has less than that, they are in poverty by the official measure.
      </P>

      <H2>Why “after housing costs” matters so much</H2>

      <P>
        You will see two versions of poverty figures, before housing costs and after. This site
        uses after, and so does the Scottish Government headline.
      </P>

      <P>
        The reason is simple. Rent is not optional and it is not the same everywhere. Two families
        on identical wages are not equally well off if one hands over £700 a month and the other
        £300. Counting the money that is actually left is closer to how life works.
      </P>

      <Aside title="One thing worth knowing">
        <p>
          Because the line moves with what is normal, relative poverty can fall in a bad year — if
          everyone&apos;s income drops together, the line drops too. That is why serious reporting
          reads it alongside other measures, and why we show ten years rather than one.
        </p>
      </Aside>

      <H2>Relative, absolute and persistent</H2>

      <P>Three words get used, and they measure different things.</P>

      <UL>
        <LI>
          <strong><G t="relative-poverty">Relative poverty</G></strong> — falling a long way behind
          what is normal today. This is the main headline measure.
        </LI>
        <LI>
          <strong>Absolute poverty</strong> — measured against a line fixed at a past year and
          uprated for prices. It asks whether living standards themselves are improving.
        </LI>
        <LI>
          <strong><G t="persistent">Persistent poverty</G></strong> — being in poverty for several
          of the last few years. This is the one that does the most damage, because short spells
          can be recovered from and long ones cannot.
        </LI>
      </UL>

      <H2>Where Scotland stands</H2>

      <P>
        On the main measure, {scotlandPoverty.all.pct}% of people in Scotland —{" "}
        {scotlandPoverty.all.count.toLocaleString("en-GB")} of them — were below that line in{" "}
        {scotlandPoverty.period}. For children it is {scotlandPoverty.children.pct}%.
      </P>

      <P>
        Those are national figures. The number where you live can be very different, and in some
        places it is far worse.
      </P>

      <PostCTA
        title="See the figure for your own area"
        body="Every council area and every MP area in Scotland has its own page, with ten years of figures and the source underneath."
        href="/areas"
        cta="Find my area"
      />

      <P>
        The full definitions are in the <Link href="/glossary">plain-English glossary</Link>, and
        the exact method is on the <Link href="/methods">methods page</Link>.
      </P>
    </Prose>
  );
}
