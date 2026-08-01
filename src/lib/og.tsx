import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * The share card, in one place.
 *
 * Next's opengraph-image file convention only covers the segment it sits in and
 * that segment's children, and a route group does not carry it across — so the
 * root file left every page under (site) with no card at all, including the
 * home page. Both segments now render this, so there is one card and one place
 * to change it.
 *
 * The palette is the site's own: deep navy, white, and coral for the accent,
 * matching the header wordmark. Every colour here clears WCAG AA against the
 * background (coral 5.21:1, the muted grey 7.47:1).
 */

export const OG_ALT =
  "Scotland Counted — poverty, work and living standards across Scotland";
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const DEEP = "#16203a";
const CORAL = "#ff5a3c";
const MUTED = "#a8b1c1";

export function ogImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: DEEP,
          color: "#ffffff",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: CORAL,
          }}
        >
          Scotland · Every council area · Every figure sourced
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
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
                color: "#ffffff",
              }}
            >
              17%
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 32,
                lineHeight: 1.3,
                color: MUTED,
                maxWidth: 520,
                paddingBottom: 8,
              }}
            >
              of people in Scotland were living in relative poverty after housing costs in 2022–25
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
            Poverty has an address. So does power.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 44,
            paddingTop: 28,
            borderTop: "2px solid rgba(255,255,255,0.16)",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700 }}>
            Scotland<span style={{ color: CORAL }}>Counted</span>
          </div>
          <div style={{ display: "flex", color: MUTED }}>
            {site.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
