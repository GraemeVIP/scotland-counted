import { notFound } from "next/navigation";
import LineChart from "@/components/charts/LineChart";
import { indicators, getIndicator } from "@/lib/data/indicators";
import { site } from "@/lib/site";

/**
 * Chrome-free chart pages for embedding in other sites via iframe.
 * The attribution link back to the full page is the point of the
 * feature: every embed is a citation.
 */

export function generateStaticParams() {
  return indicators.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const ind = getIndicator(slug);
  if (!ind) return {};
  return {
    title: ind.chartTitle,
    robots: { index: false, follow: true },
  };
}

export default async function EmbedPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const ind = getIndicator(slug);
  if (!ind) notFound();

  return (
    <div className="p-4 sm:p-5">
      <p className="h4 mb-0.5">{ind.chartTitle}</p>
      <p className="ui text-[12px] text-[var(--muted)] leading-[1.5]">{ind.chartSub}</p>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 mb-1">
        {ind.series.map((s) => (
          <span
            key={s.name}
            className="ui inline-flex items-center gap-2 text-[12.5px] font-[520] text-[var(--ink-2)]"
          >
            <span className="w-[14px] h-[3px] shrink-0" style={{ background: `var(${s.colorVar})` }} />
            {s.name}
          </span>
        ))}
      </div>

      <LineChart
        x={ind.x}
        series={ind.series}
        yMin={ind.yMin}
        yMax={ind.yMax}
        yTicks={ind.yTicks}
        unit={ind.unit === "years" ? "" : ind.unit}
        decimals={ind.decimals}
        gapBand={ind.series.length === 2}
        provisionalFrom={ind.provisionalFrom}
        provisionalLabel={ind.provisionalLabel}
        ariaLabel={ind.summary}
      />

      <p className="flex flex-wrap items-baseline justify-between gap-2 mt-3 pt-2.5 border-t border-[var(--rule)]">
        <a
          href={`${site.url}/indicators/${ind.slug}`}
          target="_blank"
          rel="noopener"
          className="ui text-[12px] font-[640] text-[var(--brand)] hover:underline underline-offset-2"
        >
          Glasgow<span className="text-[var(--action)]">Counted</span> — the data behind this chart
        </a>
        <span className="ui text-[12px] text-[var(--muted)]">
          Free to embed with this link
        </span>
      </p>
    </div>
  );
}
