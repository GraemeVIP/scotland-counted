import Image from "next/image";
import Link from "@/components/IntentLink";
import { appliances } from "@/lib/electricity/appliances";
import { capSnapshot, quarter } from "@/lib/electricity/rates";

/**
 * The electricity cost calculator, sold where people are already thinking
 * about bills: the homepage, the energy and cost of living explainers, and
 * the winter payment pages.
 *
 * The example costs are worked out from the calculator's own appliance
 * figures and Ofgem's capped unit rate for this quarter (southern Scotland,
 * Direct Debit), so they move when the cap does and always match the tool.
 */

export const ELECTRICITY_CALCULATOR = "/electricity-cost-calculator-scotland";
const ART = "/images/tools/electricity-house-scotland.webp";

function rateNow() {
  return (
    capSnapshot("south", "debit", quarter(new Date()))?.unit ??
    capSnapshot("south", "debit", "January to March 2027")?.unit ??
    26.11
  );
}

/** Cost of one use, in pence, from the calculator's own figures. */
function perUse(id: string, unit: number) {
  const a = appliances.find((x) => x.id === id)!;
  switch (a.model) {
    case "litres":
      return a.rating * (a.detail ?? 1) * unit; // one boil of a litre
    case "showers":
      return (a.rating * (a.detail ?? 8)) / 60_000 * unit; // one shower
    case "cycles":
      return a.rating * unit; // one load
    default:
      return 0;
  }
}

function money(pence: number) {
  return pence >= 100 ? `£${(pence / 100).toFixed(2)}` : `${Math.round(pence)}p`;
}

function examples() {
  const unit = rateNow();
  return [
    { label: "Boil a kettle", value: money(perUse("kettle", unit)) },
    { label: "An 8 minute electric shower", value: money(perUse("shower", unit)) },
    { label: "A tumble dryer load", value: money(perUse("dryer", unit)) },
  ];
}

function Bolt({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

/**
 * `feature` is the big homepage section. `card` is the slim panel that sits
 * after an article or near the end of a page, never mid-read.
 */
export default function ElectricityPromo({ variant = "card" }: { variant?: "feature" | "card" }) {
  const items = examples();

  if (variant === "feature") {
    return (
      <section className="pt-24" aria-labelledby="electricity-promo">
        <div
          className="relative overflow-hidden rounded-[var(--r-l)] text-white"
          style={{
            background:
              "radial-gradient(70% 90% at 100% 0%, rgba(31,111,255,0.45), transparent 60%), linear-gradient(135deg, #0b4fd0 0%, #06276e 55%, #031234 100%)",
            boxShadow: "0 40px 80px -40px rgba(2,20,60,0.6)",
          }}
        >
          <div className="grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-10 lg:p-12">
            <div>
              <p className="ui inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-white/25 bg-white/12 px-3 py-1.5 text-[13px] font-[650] tracking-[0.02em]">
                <Bolt /> Free calculator
              </p>
              <h2 id="electricity-promo" className="mt-5 max-w-[18ch] text-[clamp(32px,4.2vw,54px)] font-[650] leading-[1.02] tracking-[-0.035em]">
                What does your home&rsquo;s electricity <span className="serif-accent text-[#d6e4ff]">really cost?</span>
              </h2>
              <p className="mt-5 max-w-[46ch] text-[17px] leading-[1.6] text-white/85">
                Pick what you use, from the kettle to the tumble dryer. See the cost of each one in
                pounds and pence at your own rate, and where the money goes.
              </p>
              <ul className="mt-7 grid gap-2.5 sm:grid-cols-3">
                {items.map((item) => (
                  <li key={item.label} className="rounded-[var(--r-m)] border border-white/18 bg-white/[0.08] px-4 py-3.5">
                    <span className="block text-[clamp(26px,2.6vw,32px)] font-[700] leading-none tracking-[-0.02em] tnum">{item.value}</span>
                    <span className="mt-1.5 block text-[14px] leading-snug text-white/80">{item.label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[13px] text-white/65">At this quarter&rsquo;s capped Scottish rate.</p>
              <Link
                href={ELECTRICITY_CALCULATOR}
                className="ui mt-7 inline-flex min-h-[52px] items-center gap-2 rounded-[var(--r-pill)] bg-white px-6 text-[16px] font-[650] text-[#06276e] no-underline shadow-[0_14px_30px_-14px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-px"
              >
                Work out my costs <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="relative">
              <Image
                src={ART}
                width={1080}
                height={720}
                alt="A cutaway Scottish home with the lights, television, kettle and washing machine in different rooms."
                sizes="(min-width: 1024px) 540px, 92vw"
                className="h-auto w-full rounded-[var(--r-m)]"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <aside aria-labelledby="electricity-card" className="overflow-hidden rounded-[var(--r-l)] text-white"
      style={{
        background: "radial-gradient(60% 100% at 100% 0%, rgba(31,111,255,0.4), transparent 60%), linear-gradient(135deg, #0b4fd0 0%, #06276e 60%, #031234 100%)",
      }}
    >
      <div className="grid items-center gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <p className="ui inline-flex items-center gap-2 text-[13px] font-[650] tracking-[0.02em] text-white">
            <Bolt /> Free calculator
          </p>
          <h2 id="electricity-card" className="mt-2.5 text-[clamp(22px,2.4vw,28px)] font-[650] leading-[1.15] tracking-[-0.02em]">
            What does your kettle, shower or tumble dryer cost to run?
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {items.map((item) => (
              <li key={item.label} className="ui rounded-[var(--r-pill)] border border-white/20 bg-white/[0.08] px-3 py-1.5 text-[14px] text-white/85">
                {item.label} <b className="font-[700] text-white tnum">{item.value}</b>
              </li>
            ))}
          </ul>
          <Link
            href={ELECTRICITY_CALCULATOR}
            className="ui mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-[var(--r-pill)] bg-white px-5 text-[15.5px] font-[650] text-[#06276e] no-underline transition-transform hover:-translate-y-px"
          >
            Try the electricity cost calculator <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Image
          src={ART}
          width={1080}
          height={720}
          alt=""
          sizes="260px"
          className="hidden h-auto w-full rounded-[var(--r-m)] md:block"
        />
      </div>
    </aside>
  );
}
