import Link from "next/link";
import type { CSSProperties } from "react";
import { COUNCIL_SEARCH_NAMES } from "@/lib/routeMap";
import { councils } from "@/lib/data/councils";
import {
  COMPARE_METRICS,
  KEY_FACTS,
  THEMES,
  gapSize,
  rangeOf,
  rankOf,
  winner,
  type CompareMetric,
  type ThemeId,
} from "@/lib/data/compareAreas";

const A_COLOUR = "var(--brand)";
const B_COLOUR = "var(--hub-area)";

const shortName = (slug: string) => COUNCIL_SEARCH_NAMES[slug] ?? slug;
const fullName = (slug: string) => councils.find((c) => c.slug === slug)?.name ?? slug;
const withUnit = (metric: CompareMetric, v: number) => `${metric.format(v)}${metric.unit ? ` ${metric.unit}` : ""}`;

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const GAP_LABEL = { same: "About the same", small: "Small gap", clear: "Clear gap", big: "Big gap" } as const;

/** The verdict in words: "More crime in Glasgow", or "About the same in both". */
function verdict(metric: CompareMetric, a: string, b: string) {
  const va = metric.values[a];
  const vb = metric.values[b];
  if (va == null || vb == null) return "Not published for both areas";
  const group = metric.groups?.[a];
  if (group && group === metric.groups?.[b]) return "Both share one figure";
  if (gapSize(metric, a, b) === "same") return "About the same in both";
  return `${metric.more ?? "Higher"} in ${shortName(va > vb ? a : b)}`;
}

function ThemeIcon({ id, size = 24 }: { id: ThemeId; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (id) {
    case "money":
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "work":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18" />
        </svg>
      );
    case "poverty":
      return (
        <svg {...common}>
          <path d="M19 5h-9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H5M12 2v3M12 19v3" />
        </svg>
      );
    case "safety":
      return (
        <svg {...common}>
          <path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "health":
      return (
        <svg {...common}>
          <path d="M12 20s-7.5-4.6-9.2-9.2A4.8 4.8 0 0 1 12 6.4a4.8 4.8 0 0 1 9.2 4.4C19.5 15.4 12 20 12 20z" />
        </svg>
      );
    case "schools":
      return (
        <svg {...common}>
          <path d="m2 9 10-5 10 5-10 5z" />
          <path d="M6 11v5c3.5 2.5 8.5 2.5 12 0v-5M22 9v6" />
        </svg>
      );
    case "services":
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M2 10l10-6 10 6z" />
        </svg>
      );
    case "people":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14a6.5 6.5 0 0 1 3 6" />
        </svg>
      );
  }
}

function Dot({ colour, size = 14 }: { colour: string; size?: number }) {
  return <span aria-hidden="true" className="inline-block shrink-0 rounded-full" style={{ background: colour, width: size, height: size }} />;
}

/** Scotland is shown as a grey diamond everywhere, on the line and in the figures. */
function Diamond({ size = 12 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 rotate-45 rounded-[2px] bg-[var(--ink-2)]"
      style={{ width: size * 0.8, height: size * 0.8 }}
    />
  );
}

const Tick = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
    <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function BetterBadge() {
  return (
    <span className="ui inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-[var(--surface)] bg-[var(--good)] px-2.5 py-1 text-[13px] font-[700] leading-none text-white shadow-[var(--shadow-1)]">
      <Tick size={13} />
      Better
    </span>
  );
}

/* ---------- The line from lowest to highest council ---------- */

function pinStyle(pct: number): CSSProperties {
  // Keep each name label inside the card when its dot sits near either end.
  const shift = pct < 12 ? "-14px" : pct > 88 ? "calc(-100% + 14px)" : "-50%";
  return { left: `${pct}%`, transform: `translateX(${shift})` };
}

function Track({ metric, a, b }: { metric: CompareMetric; a: string; b: string }) {
  const { min, max } = rangeOf(metric);
  const span = max - min || 1;
  const at = (v: number) => Math.min(100, Math.max(0, ((v - min) / span) * 100));
  const va = metric.values[a];
  const vb = metric.values[b];
  const good = "color-mix(in srgb, var(--good) 70%, transparent)";
  const bad = "color-mix(in srgb, var(--bad) 70%, transparent)";
  const mid = "color-mix(in srgb, var(--warn) 55%, transparent)";
  const directional = metric.direction !== "neutral";
  const lowerBetter = metric.direction === "lower-better";
  const gradient = !directional
    ? "linear-gradient(90deg, var(--rule-strong), var(--rule-strong))"
    : lowerBetter
      ? `linear-gradient(90deg, ${good}, ${mid}, ${bad})`
      : `linear-gradient(90deg, ${bad}, ${mid}, ${good})`;
  const ends = directional
    ? lowerBetter
      ? [
          { word: "← Better", colour: "var(--good-text)" },
          { word: "Worse →", colour: "var(--bad-text)" },
        ]
      : [
          { word: "← Worse", colour: "var(--bad-text)" },
          { word: "Better →", colour: "var(--good-text)" },
        ]
    : [
        { word: "Lowest", colour: "var(--ink-2)" },
        { word: "Highest", colour: "var(--ink-2)" },
      ];

  const pin = (slug: string, v: number, colour: string, above: boolean) => (
    <div className={`absolute ${above ? "top-0" : "bottom-0"}`} style={pinStyle(at(v))}>
      <span
        className="ui inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[13px] font-[650] leading-none text-[var(--surface)] shadow-[var(--shadow-1)]"
        style={{ background: colour }}
      >
        {shortName(slug)}
      </span>
    </div>
  );
  const dot = (v: number, colour: string) => (
    <div
      className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[var(--surface)] shadow-[var(--shadow-1)]"
      style={{ left: `${at(v)}%`, background: colour }}
    />
  );

  return (
    <div className="mt-5" aria-hidden="true">
      <p className="ui mb-1 text-[13.5px] text-[var(--muted)]">Where they sit among all 32 areas</p>
      <div className="relative h-[86px]">
        {va != null && pin(a, va, A_COLOUR, true)}
        <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full" style={{ background: gradient }} />
        {metric.scotland != null && (
          <div className="absolute top-1/2" style={{ left: `${at(metric.scotland)}%`, transform: "translate(-50%, -50%)" }}>
            <span className="block h-4 w-4 rotate-45 rounded-[3px] border-2 border-[var(--surface)] bg-[var(--ink-2)]" />
          </div>
        )}
        {vb != null && dot(vb, B_COLOUR)}
        {va != null && dot(va, A_COLOUR)}
        {vb != null && pin(b, vb, B_COLOUR, false)}
      </div>
      <div className="ui mt-2 flex items-start justify-between gap-4 text-[14px] leading-[1.35]">
        <span>
          <strong className="block font-[650]" style={{ color: ends[0].colour }}>
            {ends[0].word}
          </strong>
          <span className="text-[var(--muted)]">{withUnit(metric, min)}</span>
        </span>
        <span className="text-right">
          <strong className="block font-[650]" style={{ color: ends[1].colour }}>
            {ends[1].word}
          </strong>
          <span className="text-[var(--muted)]">{withUnit(metric, max)}</span>
        </span>
      </div>
    </div>
  );
}

/* ---------- One measure ---------- */

/** One area's figure, in a box tinted with that area's colour so it can never be misread. */
function FigureBox({
  metric,
  slug,
  colour,
  better,
  twoLineNames,
}: {
  metric: CompareMetric;
  slug: string;
  colour: string;
  better: boolean;
  /** Either name in the pair runs to two lines on a phone, so both reserve two lines and the figures stay level. */
  twoLineNames: boolean;
}) {
  const v = metric.values[slug];
  const rank = rankOf(metric, slug);
  const shared = metric.groups?.[slug];
  return (
    <div
      className="relative min-w-0 rounded-[var(--r-m)] border-t-[5px] px-4 pb-4 pt-3.5 sm:px-5"
      style={{ borderColor: colour, background: `color-mix(in srgb, ${colour} 9%, var(--surface))` }}
    >
      {/* Sits on the top edge, so both boxes keep their numbers on the same line */}
      {better && (
        <span className="absolute -top-[15px] right-3">
          <BetterBadge />
        </span>
      )}
      <p
        className={`ui min-w-0 font-[700] leading-[1.2] [overflow-wrap:anywhere] ${
          !shortName(slug).includes(" ") && shortName(slug).length > 14
            ? "text-[13px] sm:text-[16px]"
            : shortName(slug).length > 12
              ? "text-[14px] sm:text-[16px]"
              : "text-[16px]"
        } ${twoLineNames ? "max-sm:min-h-[34px]" : ""}`}
        style={{ color: colour }}
      >
        {shortName(slug)}
      </p>
      {v == null ? (
        <p className="mt-3 text-[16px] leading-[1.4] text-[var(--ink-2)]">{metric.missing ?? "Not published"}</p>
      ) : (
        <>
          <p className="display-stat tnum mt-2.5 text-[clamp(28px,3vw,44px)] leading-none text-[var(--ink)]">{metric.format(v)}</p>
          {metric.unit && <p className="ui mt-1.5 text-[15px] text-[var(--ink-2)]">{metric.unit}</p>}
          <p className="ui mt-2.5 text-[14px] leading-[1.35] text-[var(--ink-2)]">
            {shared
              ? `Shared with the ${shared} ${metric.groupKind ?? "area"}`
              : rank &&
                (rank.rank === 1
                  ? `Highest of ${rank.of} areas`
                  : rank.rank === rank.of
                    ? `Lowest of ${rank.of} areas`
                    : `${ordinal(rank.rank)} highest of ${rank.of}`)}
          </p>
        </>
      )}
    </div>
  );
}

/**
 * Read top to bottom in three beats: what this is (the heading), the two
 * figures side by side with the better one marked, then what it means.
 */
function MeasureCard({ metric, a, b }: { metric: CompareMetric; a: string; b: string }) {
  const heading = (
    <div className="flex items-start gap-3.5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-[var(--brand-wash)] text-[var(--brand)]">
        <ThemeIcon id={metric.theme} size={22} />
      </span>
      <div className="min-w-0">
        <h3 className="display-stat text-[clamp(24px,2.3vw,30px)] leading-[1.1] text-[var(--ink)]">{metric.label}</h3>
        <p className="mt-1.5 text-[16px] leading-[1.5] text-[var(--ink-2)]">{metric.plain}</p>
      </div>
    </div>
  );

  if (metric.pending) {
    return (
      <article className="flex flex-col gap-5 rounded-[var(--r-l)] border-2 border-dashed border-[var(--rule-strong)] p-6 sm:p-7">
        {heading}
        <p className="ui rounded-[var(--r-s)] bg-[var(--surface-2)] px-4 py-3 text-[16px] font-[600] text-[var(--ink-2)]">
          Coming soon: being added from the official figures.
        </p>
      </article>
    );
  }

  const w = winner(metric, a, b);
  const gap = gapSize(metric, a, b);
  const sharedPair = metric.groups?.[a] && metric.groups[a] === metric.groups?.[b];
  const twoLineNames = [a, b].some((slug) => shortName(slug).includes(" ") && shortName(slug).length > 12);
  return (
    <article className="tile flex flex-col p-6 sm:p-7">
      {heading}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <FigureBox metric={metric} slug={a} colour={A_COLOUR} better={w === "a"} twoLineNames={twoLineNames} />
        <FigureBox metric={metric} slug={b} colour={B_COLOUR} better={w === "b"} twoLineNames={twoLineNames} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[var(--r-m)] bg-[var(--surface-2)] px-4 py-3">
        <p className="ui flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[17px] font-[650] leading-[1.3] text-[var(--ink)]">
          {verdict(metric, a, b)}
          {gap && gap !== "same" && !sharedPair && (
            <span
              className={`rounded-full px-2.5 py-1 text-[12.5px] font-[650] leading-none ${
                gap === "big"
                  ? "bg-[var(--ink)] text-[var(--surface)]"
                  : gap === "clear"
                    ? "bg-[var(--ink-2)] text-[var(--surface)]"
                    : "border border-[var(--rule-strong)] text-[var(--ink-2)]"
              }`}
            >
              {GAP_LABEL[gap]}
            </span>
          )}
        </p>
        {metric.scotland != null && (
          <p className="ui flex items-center gap-2 text-[15px] text-[var(--ink-2)]">
            <Diamond />
            Scotland <strong className="tnum font-[650] text-[var(--ink)]">{withUnit(metric, metric.scotland)}</strong>
          </p>
        )}
      </div>

      <Track metric={metric} a={a} b={b} />

      <p className="ui mt-auto pt-5 text-[14px] leading-[1.5] text-[var(--muted)]">
        {metric.note && <span className="mb-1.5 block text-[15px] text-[var(--ink-2)]">{metric.note}</span>}
        {metric.period} ·{" "}
        <a href={metric.source.url} className="text-[var(--muted)] underline decoration-[var(--rule-strong)] underline-offset-2">
          {metric.source.publisher}
        </a>
      </p>
    </article>
  );
}

/* ---------- The summary at the top ---------- */

function Scoreboard({ a, b }: { a: string; b: string }) {
  const results = COMPARE_METRICS.map((m) => winner(m, a, b)).filter((w) => w === "a" || w === "b");
  const aWins = results.filter((w) => w === "a").length;
  const bWins = results.filter((w) => w === "b").length;
  const total = aWins + bWins || 1;
  const lead = aWins === bWins ? null : aWins > bWins ? a : b;
  const side = (slug: string, colour: string, wins: number, right: boolean) => (
    <div className={`min-w-0 ${right ? "text-right" : "text-left"}`}>
      <p className="ui text-[13.5px] text-[var(--muted)] max-sm:hidden">{fullName(slug)}</p>
      <p className="display-stat mt-0.5 text-[clamp(20px,4.4vw,52px)] leading-[1.08] [overflow-wrap:anywhere]" style={{ color: colour }}>
        {shortName(slug)}
      </p>
      <p className="ui mt-4 text-[15px] text-[var(--ink-2)]">Better on</p>
      <p className="display-stat tnum mt-1 text-[clamp(44px,6vw,76px)] leading-none text-[var(--ink)]">
        {wins}
        <span className="ui ml-2 text-[15px] font-[500] tracking-normal text-[var(--ink-2)] max-sm:ml-0 max-sm:mt-1.5 max-sm:block">
          {wins === 1 ? "measure" : "measures"}
        </span>
      </p>
    </div>
  );
  return (
    <div className="tile overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 p-5 sm:gap-6 sm:p-8">
        {side(a, A_COLOUR, aWins, false)}
        <span className="ui grid h-12 w-12 place-items-center rounded-full bg-[var(--surface-2)] text-[15px] font-[700] text-[var(--muted)] sm:h-14 sm:w-14">
          vs
        </span>
        {side(b, B_COLOUR, bWins, true)}
      </div>
      <div className="flex h-3.5" aria-hidden="true">
        <span style={{ width: `${(aWins / total) * 100}%`, background: A_COLOUR }} />
        <span style={{ width: `${(bWins / total) * 100}%`, background: B_COLOUR }} />
      </div>
      <p className="px-5 py-4 text-[17px] leading-[1.5] text-[var(--ink)] sm:px-8">
        {lead ? (
          <>
            <strong>{shortName(lead)}</strong> comes out better on {Math.max(aWins, bWins)} of the {results.length} measures
            where better or worse is clear, like crime and life expectancy.
          </>
        ) : (
          <>Level: each area is better on {aWins} of the {results.length} measures where better or worse is clear.</>
        )}{" "}
        <span className="text-[var(--ink-2)]">Prices, rents and council tax are not scored, because cheaper is not better for everyone.</span>
      </p>
    </div>
  );
}

function AtAGlance({ a, b }: { a: string; b: string }) {
  const tiles = THEMES.flatMap((theme) => {
    const id = KEY_FACTS[theme.id];
    const metric = COMPARE_METRICS.find((m) => m.id === id && !m.pending);
    return metric ? [{ theme, metric }] : [];
  });
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map(({ theme, metric }) => {
        const w = winner(metric, a, b);
        return (
          <li key={theme.id}>
            <a href={`#theme-${theme.id}`} className="tile group flex h-full flex-col p-5 no-underline sm:p-6">
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[var(--brand-wash)] text-[var(--brand)]">
                  <ThemeIcon id={theme.id} size={21} />
                </span>
                <span className="display-stat text-[23px] leading-[1.1] text-[var(--ink)] group-hover:text-[var(--action-text)]">
                  {metric.label}
                </span>
              </span>
              <span className="ui mt-3.5 text-[16.5px] font-[600] leading-[1.35] text-[var(--ink)]">{verdict(metric, a, b)}</span>
              <span className="ui mt-auto grid grid-cols-2 gap-2.5 pt-4">
                {[
                  { slug: a, colour: A_COLOUR, side: "a" },
                  { slug: b, colour: B_COLOUR, side: "b" },
                ].map(({ slug, colour, side }) => {
                  const v = metric.values[slug];
                  return (
                    <span
                      key={slug}
                      className="min-w-0 rounded-[12px] border-t-[3px] px-3 py-2"
                      style={{ borderColor: colour, background: `color-mix(in srgb, ${colour} 9%, var(--surface))` }}
                    >
                      <span className="block truncate text-[13px] font-[650]" style={{ color: colour }}>
                        {shortName(slug)}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5">
                        {v == null ? (
                          <span className="text-[14px] font-[600] text-[var(--ink-2)]">Not published</span>
                        ) : (
                          <span className="tnum truncate text-[19px] font-[700] text-[var(--ink)]">{metric.format(v)}</span>
                        )}
                        {w === side && (
                          <span className="text-[var(--good-text)]" title="Better">
                            <Tick size={16} />
                          </span>
                        )}
                      </span>
                    </span>
                  );
                })}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** A bold dark banner opens each part of life, so the page reads as clear chapters. */
function ThemeBanner({ theme, a, b }: { theme: (typeof THEMES)[number]; a: string; b: string }) {
  const results = COMPARE_METRICS.filter((m) => m.theme === theme.id)
    .map((m) => winner(m, a, b))
    .filter((w) => w === "a" || w === "b");
  const aw = results.filter((w) => w === "a").length;
  const bw = results.filter((w) => w === "b").length;
  return (
    <div className="tile tile-night overflow-hidden p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] bg-white/10 text-white sm:h-16 sm:w-16">
            <ThemeIcon id={theme.id} size={30} />
          </span>
          <div className="min-w-0">
            <h2 id={`theme-${theme.id}-title`} className="display-stat text-[clamp(30px,3.6vw,46px)] leading-[1.05] text-white">
              {theme.label}
            </h2>
            <p className="mt-1.5 text-[16.5px] leading-[1.45] text-[var(--deep-muted)]">{theme.blurb}</p>
          </div>
        </div>
        {results.length > 0 && (
          <p className="ui inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[15.5px] text-[#04112f]">
            {aw === bw ? (
              <>Level: {aw} each</>
            ) : (
              <>
                <Dot colour={aw > bw ? A_COLOUR : B_COLOUR} size={12} />
                <strong className="font-[700]">{shortName(aw > bw ? a : b)}</strong> better on {Math.max(aw, bw)} of {results.length}
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Two council areas side by side on every measure the site holds.
 *
 * Built to be read at a glance: a scoreboard, one headline per part of life,
 * then a banner per part of life and a card per measure. Each card names the
 * measure first, shows both figures in their area's colour with the better
 * one marked, and only then says what it means. "Better" only appears where
 * higher or lower is plainly better; prices, rents and council tax get none.
 */
export default function AreaComparison({ a, b }: { a: string; b: string }) {
  return (
    <div id="comparison" className="scroll-mt-4">
      <Scoreboard a={a} b={b} />

      <h2 className="display-stat mt-14 text-[clamp(28px,3.2vw,40px)]">At a glance</h2>
      <p className="mt-2 max-w-[60ch] text-[17px] leading-[1.55] text-[var(--ink-2)]">
        The headline from each part of life. Tap one to see the detail.
      </p>
      <div className="mt-6">
        <AtAGlance a={a} b={b} />
      </div>

      {/* Stays in view while scrolling, so the two colours are never in doubt */}
      <nav
        aria-label="Comparison sections"
        className="sticky top-[calc(var(--header-h)+10px)] z-10 mt-14 flex items-center gap-4 overflow-x-auto rounded-[var(--r-pill)] border border-[var(--rule)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 py-2.5 shadow-[var(--shadow-1)] backdrop-blur [scrollbar-width:none]"
      >
        <span className="ui flex shrink-0 items-center gap-2 text-[15px] font-[650]">
          <Dot colour={A_COLOUR} size={12} />
          {shortName(a)}
          <span className="font-[500] text-[var(--muted)]">vs</span>
          <Dot colour={B_COLOUR} size={12} />
          {shortName(b)}
        </span>
        <span className="h-5 w-px shrink-0 bg-[var(--rule-strong)]" aria-hidden="true" />
        {THEMES.map((t) => (
          <a
            key={t.id}
            href={`#theme-${t.id}`}
            className="ui shrink-0 whitespace-nowrap text-[14.5px] text-[var(--ink-2)] no-underline hover:text-[var(--action-text)]"
          >
            {t.label}
          </a>
        ))}
      </nav>

      {THEMES.map((theme) => {
        const metrics = COMPARE_METRICS.filter((m) => m.theme === theme.id);
        if (!metrics.length) return null;
        return (
          <section key={theme.id} id={`theme-${theme.id}`} className="mt-16 scroll-mt-14" aria-labelledby={`theme-${theme.id}-title`}>
            <ThemeBanner theme={theme} a={a} b={b} />
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {metrics.map((m) => (
                <MeasureCard key={m.id} metric={m} a={a} b={b} />
              ))}
            </div>
          </section>
        );
      })}

      <div className="mt-14 max-w-[70ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
        <p>
          On each line, the coloured dots show where the two areas sit between the lowest and highest of Scotland&apos;s 32
          council areas, and the grey diamond is Scotland as a whole. Every figure is the latest published, with its source
          under the card.
        </p>
        <p className="mt-3">
          More on each area: <Link href={`/areas/${a}`}>{shortName(a)}</Link> and <Link href={`/areas/${b}`}>{shortName(b)}</Link>.
        </p>
      </div>
    </div>
  );
}
