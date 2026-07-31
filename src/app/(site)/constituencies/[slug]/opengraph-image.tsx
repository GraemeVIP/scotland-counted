import { ImageResponse } from "next/og";
import {
  constituencies,
  getConstituency,
  CONSTITUENCY_YEARS,
  CONSTITUENCY_COUNT,
} from "@/lib/data/constituencies";
import { site } from "@/lib/site";

export const alt = "Child poverty in this constituency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return constituencies.map((c) => ({ slug: c.slug }));
}

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const c = getConstituency(slug);
  const last = CONSTITUENCY_YEARS[9];

  if (!c) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0d1117",
            color: "#ffffff",
            fontSize: 48,
          }}
        >
          Scotland Counted
        </div>
      ),
      size
    );
  }

  const rose = c.change > 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0d1117",
          color: "#ffffff",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#8a93a3",
          }}
        >
          {`Constituency · one MP answers for this · ${last}`}
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              fontSize: 54,
              fontWeight: 700,
              letterSpacing: -1.5,
              marginBottom: 24,
            }}
          >
            {c.name}
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
            <div
              style={{
                display: "flex",
                fontSize: 150,
                fontWeight: 800,
                letterSpacing: -7,
                lineHeight: 0.85,
                color: rose ? "#ff7a5c" : "#00c48c",
              }}
            >
              {`${c.pcts[9]}%`}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                paddingBottom: 10,
                fontSize: 28,
                color: "#a8b1c1",
              }}
            >
              <div style={{ display: "flex" }}>
                {`${c.counts[9].toLocaleString("en-GB")} children in poverty`}
              </div>
              <div style={{ display: "flex" }}>
                {`${rose ? "Up" : "Down"} ${Math.abs(c.change)} points in a decade`}
              </div>
              <div style={{ display: "flex" }}>
                {`Ranked ${c.rankLevel} of ${CONSTITUENCY_COUNT} Scottish seats`}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 44,
            paddingTop: 28,
            borderTop: "2px solid #232935",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700 }}>
            Scotland<span style={{ color: "#f5e400" }}>&nbsp;Counted</span>
          </div>
          <div style={{ display: "flex", color: "#8a93a3" }}>
            {site.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    size
  );
}
