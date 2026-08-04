import { waterCharges2026, WATER_YEAR } from "@/lib/data/councilTax";
import { ExplainText } from "@/components/Glossary";

/**
 * The water charge, made impossible to miss.
 *
 * In Scotland water and waste water are billed with council tax, so almost
 * every council tax figure published online is hundreds of pounds short. That
 * is the one thing this site has that the others do not, and most people have
 * never been told it, so it gets stated once, loudly, in plain words.
 */

const exact = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});
const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export default function WaterCharge({ className = "" }: { className?: string }) {
  const a = waterCharges2026.A;
  const d = waterCharges2026.D;
  const aTotal = a.water + a.wasteWater;
  const dTotal = d.water + d.wasteWater;

  return (
    <section
      className={`rounded-[var(--r-m)] bg-[var(--deep)] p-6 text-[var(--deep-ink)] sm:p-9 ${className}`}
      style={{ boxShadow: "var(--shadow-2)" }}
      aria-labelledby="water-charge"
    >
      <p className="kicker mb-3 text-[var(--action)]">Read this before you compare anywhere else</p>
      <h2
        id="water-charge"
        className="display-stat text-[clamp(26px,3.2vw,40px)] max-w-[20ch]"
      >
        Your water bill is inside your council tax
      </h2>

      <p className="mt-5 max-w-[58ch] text-[18px] leading-[1.6] opacity-90">
        <ExplainText>
        In Scotland you do not get a separate water bill. Scottish Water charges you for water and
        for taking waste water away, and your council collects it{" "}
        <strong className="opacity-100">on the same bill as your council tax</strong>.
        </ExplainText>
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {[
          { band: "A", water: a.water, waste: a.wasteWater, total: aTotal, note: "the most common band in Scotland" },
          { band: "D", water: d.water, waste: d.wasteWater, total: dTotal, note: "the standard comparison band" },
        ].map((r) => (
          <div
            key={r.band}
            className="rounded-[var(--r-s)] border border-white/15 bg-white/[0.07] px-5 py-5"
          >
            <p className="ui text-[14.5px] font-[700] opacity-75">Band {r.band}, {r.note}</p>
            <p className="display-stat mt-2 text-[clamp(28px,3vw,38px)]">{pounds.format(r.total)}</p>
            <p className="mt-2.5 text-[14.5px] leading-[1.5] opacity-75">
              a year of water charges, {exact.format(r.water)} for water and{" "}
              {exact.format(r.waste)} for waste water
            </p>
          </div>
        ))}
      </div>

      <p className="mt-7 max-w-[60ch] text-[19px] leading-[1.55] font-[640]">
        <ExplainText>
        This is why other websites give you a lower number. They quote the council tax and leave
        the water out. Every figure on this site includes it.
        </ExplainText>
      </p>

      <p className="mt-4 max-w-[60ch] text-[16px] leading-[1.6] opacity-80">
        <ExplainText>
        If you get Council Tax Reduction you can also get up to 35% off the water charges. That is
        the Water Charges Reduction Scheme, and your council applies it for you. Charges shown are{" "}
        {WATER_YEAR}.
        </ExplainText>
      </p>
    </section>
  );
}
