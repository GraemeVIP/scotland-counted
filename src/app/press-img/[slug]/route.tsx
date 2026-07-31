import { ImageResponse } from "next/og";
import { indicators, getIndicator } from "@/lib/data/indicators";
import { site } from "@/lib/site";

/**
 * Downloadable PNG chart cards for the press kit, drawn server-side
 * from the same data as the live charts. Satori renders SVG paths but
 * not SVG text, so all labels are positioned divs over the plot.
 */

export function generateStaticParams() {
  return indicators.map((i) => ({ slug: i.slug }));
}

const W = 1200;
const H = 630;
const PLOT = { l: 96, r: 300, t: 160, b: 96 };
const COLORS: Record<string, string> = {
  "--glasgow": "#5b84ff",
  "--scotland": "#ff5a3c",
  "--workplace": "#00c48c",
};

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const ind = getIndicator(slug);
  if (!ind) return new Response("Not found", { status: 404 });

  const iw = W - PLOT.l - PLOT.r;
  const ih = H - PLOT.t - PLOT.b;
  const n = ind.x.length;
  const X = (i: number) => PLOT.l + (iw * i) / (n - 1);
  const Y = (v: number) => PLOT.t + ih - ((v - ind.yMin) / (ind.yMax - ind.yMin)) * ih;
  const path = (data: number[]) =>
    data.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
  const fmt = (v: number) =>
    ind.unit === "£" ? `£${v.toFixed(0)}` : `${v.toFixed(ind.decimals)}${ind.unit}`;

  // Spread end-labels vertically so converging series stay readable.
  const ends = ind.series
    .map((s, si) => ({ si, y: Y(s.data[n - 1]) }))
    .sort((a, b) => a.y - b.y);
  const labelY: number[] = [];
  let prev = -Infinity;
  for (const e of ends) {
    const y = Math.max(e.y, prev + 34);
    labelY[e.si] = y;
    prev = y;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0d1117",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Title block */}
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 72,
            right: 72,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>
            {ind.chartTitle}
          </div>
          <div style={{ display: "flex", fontSize: 18, color: "#8a93a3", marginTop: 8 }}>
            {ind.chartSub}
          </div>
        </div>

        {/* Geometry only — Satori supports paths, not SVG text */}
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {ind.yTicks.map((t) => (
            <path
              key={t}
              d={`M${PLOT.l} ${Y(t)} L${PLOT.l + iw} ${Y(t)}`}
              stroke="#161c26"
              strokeWidth={1.5}
            />
          ))}
          {ind.series.map((s) => (
            <path
              key={s.name}
              d={path(s.data)}
              fill="none"
              stroke={COLORS[s.colorVar] ?? "#ffffff"}
              strokeWidth={5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {ind.series.map((s) => (
            <circle
              key={`${s.name}-dot`}
              cx={X(n - 1)}
              cy={Y(s.data[n - 1])}
              r={7}
              fill={COLORS[s.colorVar] ?? "#ffffff"}
              stroke="#0d1117"
              strokeWidth={3}
            />
          ))}
        </svg>

        {/* Axis labels as divs */}
        {ind.yTicks.map((t) => (
          <div
            key={t}
            style={{
              position: "absolute",
              top: Y(t) - 12,
              left: 0,
              width: PLOT.l - 14,
              display: "flex",
              justifyContent: "flex-end",
              fontSize: 18,
              color: "#8a93a3",
            }}
          >
            {ind.unit === "£" ? `£${t}` : `${t}${ind.unit}`}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            top: H - PLOT.b + 18,
            left: PLOT.l,
            display: "flex",
            fontSize: 18,
            color: "#8a93a3",
          }}
        >
          {ind.x[0]}
        </div>
        <div
          style={{
            position: "absolute",
            top: H - PLOT.b + 18,
            left: PLOT.l + iw - 90,
            width: 90,
            display: "flex",
            justifyContent: "flex-end",
            fontSize: 18,
            color: "#8a93a3",
          }}
        >
          {ind.x[n - 1]}
        </div>

        {/* Series end labels */}
        {ind.series.map((s, si) => (
          <div
            key={s.name}
            style={{
              position: "absolute",
              top: labelY[si] - 14,
              left: X(n - 1) + 18,
              display: "flex",
              fontSize: 21,
              fontWeight: 700,
              color: COLORS[s.colorVar] ?? "#ffffff",
            }}
          >
            {`${s.name} ${fmt(s.data[n - 1])}`}
          </div>
        ))}

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 72,
            right: 72,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700 }}>
            Scotland<span style={{ color: "#f5e400" }}>&nbsp;Counted</span>
          </div>
          <div style={{ display: "flex", color: "#8a93a3" }}>
            {`${site.url.replace("https://", "")}/indicators/${ind.slug}`}
          </div>
        </div>
      </div>
    ),
    { width: W, height: H }
  );
}
