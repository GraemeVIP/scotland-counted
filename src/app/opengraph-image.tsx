import { ImageResponse } from "next/og";
import { site } from "../../site.config";

export const alt =
  "Glasgow Counted — 36.1% of Glasgow's children were living in poverty in 2023/24";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0d2f45",
          color: "#f3efe6",
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
            color: "#8fa4b3",
          }}
        >
          Glasgow City · 2000–2026 · Every figure sourced
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 36,
              marginBottom: 34,
            }}
          >
            <div
              style={{
                fontSize: 172,
                fontWeight: 800,
                letterSpacing: -8,
                lineHeight: 0.85,
                color: "#e08a3c",
              }}
            >
              36.1%
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 32,
                lineHeight: 1.3,
                color: "#c3d0d9",
                maxWidth: 520,
                paddingBottom: 8,
              }}
            >
              of Glasgow&apos;s children were living in poverty in 2023/24, after the rent is paid
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 46,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            Poverty in Glasgow has not fallen. It has changed shape.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 44,
            paddingTop: 28,
            borderTop: "2px solid #2a4b63",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700 }}>
            Glasgow<span style={{ color: "#e08a3c" }}>&nbsp;Counted</span>
          </div>
          <div style={{ display: "flex", color: "#8fa4b3" }}>
            {site.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    size
  );
}
