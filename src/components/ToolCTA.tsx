import Link from "next/link";

/**
 * An in-page pointer to one of the calculators.
 *
 * The tools answer a practical question — "what do I actually take home", "what
 * is my council tax really" — and the best moment to offer one is while
 * somebody is reading the paragraph that raised the question. This is the block
 * for that, so every placement looks the same and none of them read like an
 * advert bolted on to the page.
 */

export type ToolId = "take-home" | "council-tax";

const TOOLS: Record<
  ToolId,
  { href: string; kicker: string; title: string; body: string; cta: string }
> = {
  "take-home": {
    href: "/take-home-pay-calculator-scotland",
    kicker: "Free tool",
    title: "What do you actually take home?",
    body: "Put in a salary or an hourly rate and see what reaches your account on Scotland's tax bands — or work backwards from the pay you need to live on.",
    cta: "Open the take-home calculator",
  },
  "council-tax": {
    href: "/council-tax-bands-scotland",
    kicker: "Free tool",
    title: "What is your council tax, water included?",
    body: "Every band in all 32 councils, with the water charges most published figures leave out. Enter a postcode for your own area.",
    cta: "Check council tax by band",
  },
};

export default function ToolCTA({
  tool,
  className = "",
}: {
  tool: ToolId;
  className?: string;
}) {
  const t = TOOLS[tool];
  return (
    <aside
      className={`rounded-[var(--r-m)] bg-[var(--deep)] px-6 py-7 text-[var(--deep-ink)] sm:px-8 ${className}`}
      style={{ boxShadow: "var(--shadow-2)" }}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
        <div>
          <p className="kicker mb-2.5 text-[var(--action)]">{t.kicker}</p>
          <p className="text-[22px] font-[760] leading-[1.2] max-w-[26ch] sm:text-[26px]">
            {t.title}
          </p>
          <p className="mt-3 max-w-[58ch] text-[16.5px] leading-[1.55] opacity-85">{t.body}</p>
        </div>
        <Link href={t.href} className="btn btn-primary whitespace-nowrap lg:shrink-0">
          {t.cta}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </aside>
  );
}
