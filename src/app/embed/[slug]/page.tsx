import { notFound } from "next/navigation";
import LineChart from "@/components/charts/LineChart";
import { indicators, getIndicator } from "@/lib/data/indicators";
import { councils, COUNCIL_YEARS, SCOTLAND_PCTS } from "@/lib/data/councils";
import { constituencies, CONSTITUENCY_YEARS } from "@/lib/data/constituencies";
import { site } from "@/lib/site";

/**
 * Chrome-free chart pages for embedding in other sites via iframe.
 * The attribution link back to the full page is the point of the
 * feature: every embed is a citation.
 *
 * Three kinds of slug, so a journalist can embed the chart for the place they
 * are actually writing about rather than only the national indicators:
 *   glasgow-child-poverty        an indicator
 *   area-glasgow-city            a council area
 *   mp-kilmarnock-and-loudoun    an MP's area
 */

type Chart = {
  title: string;
  sub: string;
  href: string;
  x: string[];
  series: Array<{
    name: string;
    colorVar: "--glasgow" | "--scotland" | "--workplace";
    data: number[];
  }>;
  yMin: number;
  yMax: number;
  yTicks: number[];
  unit: string;
  decimals: number;
  gapBand: boolean;
  provisionalFrom?: number;
  provisionalLabel?: string;
  ariaLabel: string;
};

const AREA_PREFIX = "area-";
const MP_PREFIX = "mp-";

/** Shared shape for the two place charts, which differ only in their series. */
function placeChart(
  name: string,
  href: string,
  years: string[],
  pcts: number[]
): Chart {
  return {
    title: `Children living in poverty in ${name}`,
    sub: `Money left after rent or mortgage · ${years[0]} to ${years[9]}`,
    href,
    x: years,
    series: [
      { name, colorVar: "--glasgow", data: pcts },
      { name: "Scotland", colorVar: "--scotland", data: SCOTLAND_PCTS },
    ],
    yMin: 5,
    yMax: 40,
    yTicks: [5, 10, 15, 20, 25, 30, 35, 40],
    unit: "%",
    decimals: 1,
    gapBand: true,
    ariaLabel: `Child poverty in ${name} compared with Scotland, ${years[0]} to ${years[9]}.`,
  };
}

function resolve(slug: string): Chart | null {
  if (slug.startsWith(AREA_PREFIX)) {
    const c = councils.find((x) => x.slug === slug.slice(AREA_PREFIX.length));
    return c
      ? placeChart(c.name, `${site.url}/areas/${c.slug}`, COUNCIL_YEARS, c.pcts)
      : null;
  }

  if (slug.startsWith(MP_PREFIX)) {
    const c = constituencies.find((x) => x.slug === slug.slice(MP_PREFIX.length));
    return c
      ? placeChart(c.name, `${site.url}/constituencies/${c.slug}`, CONSTITUENCY_YEARS, c.pcts)
      : null;
  }

  const ind = getIndicator(slug);
  if (!ind) return null;
  return {
    title: ind.chartTitle,
    sub: ind.chartSub,
    href: `${site.url}/indicators/${ind.slug}`,
    x: ind.x,
    series: ind.series,
    yMin: ind.yMin,
    yMax: ind.yMax,
    yTicks: ind.yTicks,
    unit: ind.unit === "years" ? "" : ind.unit,
    decimals: ind.decimals,
    gapBand: ind.series.length === 2,
    provisionalFrom: ind.provisionalFrom,
    provisionalLabel: ind.provisionalLabel,
    ariaLabel: ind.summary,
  };
}

export function generateStaticParams() {
  return [
    ...indicators.map((i) => ({ slug: i.slug })),
    ...councils.map((c) => ({ slug: `${AREA_PREFIX}${c.slug}` })),
    ...constituencies.map((c) => ({ slug: `${MP_PREFIX}${c.slug}` })),
  ];
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const chart = resolve(slug);
  if (!chart) return {};
  return {
    title: chart.title,
    alternates: { canonical: chart.href },
    robots: { index: false, follow: true },
  };
}

export default async function EmbedPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const chart = resolve(slug);
  if (!chart) notFound();

  return (
    <div className="p-4 sm:p-5">
      <p className="h4 mb-0.5">{chart.title}</p>
      <p className="ui text-[15px] text-[var(--muted)] leading-[1.5]">{chart.sub}</p>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 mb-1">
        {chart.series.map((s) => (
          <span
            key={s.name}
            className="ui inline-flex items-center gap-2 text-[15px] font-[520] text-[var(--ink-2)]"
          >
            <span className="w-[14px] h-[3px] shrink-0" style={{ background: `var(${s.colorVar})` }} />
            {s.name}
          </span>
        ))}
      </div>

      <LineChart
        x={chart.x}
        series={chart.series}
        yMin={chart.yMin}
        yMax={chart.yMax}
        yTicks={chart.yTicks}
        unit={chart.unit}
        decimals={chart.decimals}
        gapBand={chart.gapBand}
        provisionalFrom={chart.provisionalFrom}
        provisionalLabel={chart.provisionalLabel}
        ariaLabel={chart.ariaLabel}
      />

      <p className="flex flex-wrap items-baseline justify-between gap-2 mt-3 pt-2.5 border-t border-[var(--rule)]">
        <a
          href={chart.href}
          target="_blank"
          rel="noopener"
          className="ui text-[15px] font-[640] text-[var(--brand)] hover:underline underline-offset-2"
        >
          Scotland<span className="text-[var(--action)]">Counted</span> — the data behind this chart
        </a>
        <span className="ui text-[15px] text-[var(--muted)]">Free to embed with this link</span>
      </p>
    </div>
  );
}
