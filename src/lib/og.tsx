import { ImageResponse } from "next/og";
import { existsSync, readFileSync } from "node:fs";
import { join, normalize, resolve } from "node:path";
import { site } from "@/lib/site";

/**
 * Branded 1200x630 Open Graph / social share card templates.
 *
 * Every template shares the site's Saltire navy palette, high-contrast type,
 * embedded SC logo and domain footer. Images are read from public/ on disk so
 * card rendering needs no external network calls.
 */

export const OG_ALT =
  "Scotland Counted | Poverty, work and living standards across Scotland";
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const DEEP = "#04112f";
const SURFACE = "#0b1c47";
const ACCENT = "#6db5fc";
const CORAL = "#ff7a5c";
const MINT = "#00c48c";
const AMBER = "#f6c453";
const MUTED = "#b4c2de";
const BORDER = "rgba(255,255,255,0.16)";
const DOMAIN = site.url.replace("https://", "");

const PUBLIC_DIR = resolve(process.cwd(), "public");
const imageCache = new Map<string, string | null>();

/** The logo is read once and embedded, so every card needs no network. */
export const OG_LOGO = `data:image/png;base64,${readFileSync(
  join(PUBLIC_DIR, "brand/logo-on-dark.png"),
).toString("base64")}`;

/**
 * Safely reads a local PNG or JPEG from public/ as a data URI for Satori.
 * Satori does not decode WebP, so only .jpg/.jpeg/.png are loaded.
 */
export function loadPublicImage(publicPath?: string | null): string | null {
  if (!publicPath) return null;
  const clean = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
  const cached = imageCache.get(clean);
  if (cached !== undefined) return cached;

  const lower = clean.toLowerCase();
  if (!lower.endsWith(".jpg") && !lower.endsWith(".jpeg") && !lower.endsWith(".png")) {
    imageCache.set(clean, null);
    return null;
  }

  const abs = resolve(PUBLIC_DIR, normalize(clean));
  if (!abs.startsWith(PUBLIC_DIR) || !existsSync(abs)) {
    imageCache.set(clean, null);
    return null;
  }

  try {
    const mime = lower.endsWith(".png") ? "image/png" : "image/jpeg";
    const uri = `data:${mime};base64,${readFileSync(abs).toString("base64")}`;
    imageCache.set(clean, uri);
    return uri;
  } catch {
    imageCache.set(clean, null);
    return null;
  }
}

export function partyAccent(party?: string | null): string {
  const p = (party ?? "").toLowerCase();
  if (p.includes("snp") || p.includes("scottish national")) return AMBER;
  if (p.includes("labour")) return "#ff6b6b";
  if (p.includes("conservative")) return ACCENT;
  if (p.includes("liberal")) return "#ffaa44";
  if (p.includes("green")) return MINT;
  return MUTED;
}

export function toneColor(tone?: "accent" | "bad" | "good" | "amber" | "white"): string {
  if (tone === "bad") return CORAL;
  if (tone === "good") return MINT;
  if (tone === "amber") return AMBER;
  if (tone === "white") return "#ffffff";
  return ACCENT;
}

function Footer() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 24,
        borderTop: `2px solid ${BORDER}`,
        fontSize: 22,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
      <img src={OG_LOGO} alt="Scotland Counted" width={233} height={40} />
      <div style={{ display: "flex", color: MUTED }}>{DOMAIN}</div>
    </div>
  );
}

/** Homepage share card. */
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
          padding: "56px 68px",
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
            color: ACCENT,
          }}
        >
          Scotland · Every council area · Every figure sourced
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 36,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: "flex",
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
                maxWidth: 540,
                paddingBottom: 8,
              }}
            >
              of people in Scotland were living in relative poverty after housing costs in 2022-25
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 46,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.15,
              maxWidth: 920,
            }}
          >
            Poverty has an address. So does power.
          </div>
        </div>

        <Footer />
      </div>
    ),
    OG_SIZE,
  );
}

export type OgPersonStat = {
  value: string;
  label: string;
  tone?: "accent" | "bad" | "good" | "amber" | "white";
};

/**
 * Politician profile card for MPs, constituency MSPs, regional MSPs, and MSP reviews.
 * Embeds the local portrait on the right alongside name, seat/region, party and real figures.
 */
export function ogPersonCard({
  eyebrow,
  name,
  roleLine,
  party,
  photoPath,
  stats,
}: {
  eyebrow: string;
  name: string;
  roleLine: string;
  party: string;
  photoPath?: string | null;
  stats: OgPersonStat[];
}) {
  const portrait = loadPublicImage(photoPath);
  const accent = partyAccent(party);
  const nameSize = name.length > 22 ? 50 : name.length > 16 ? 58 : 64;
  const roleSize = roleLine.length > 42 ? 26 : 30;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: DEEP,
          color: "#ffffff",
          padding: "52px 68px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 44, flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between", height: "100%", paddingBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: accent,
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  color: accent,
                }}
              >
                {eyebrow}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: nameSize,
                  fontWeight: 800,
                  letterSpacing: -2,
                  lineHeight: 1.05,
                  color: "#ffffff",
                }}
              >
                {name}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: roleSize,
                  lineHeight: 1.25,
                  color: MUTED,
                }}
              >
                {roleLine}
              </div>
            </div>

            <div style={{ display: "flex", gap: 20, marginTop: "auto", paddingTop: 28 }}>
              {stats.slice(0, 3).map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: SURFACE,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 14,
                    padding: "16px 22px",
                    minWidth: 180,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontSize: s.value.length > 9 ? 28 : 34,
                      fontWeight: 800,
                      letterSpacing: -1,
                      color: toneColor(s.tone ?? "white"),
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 18,
                      color: MUTED,
                      marginTop: 6,
                      lineHeight: 1.25,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {portrait ? (
            <div
              style={{
                display: "flex",
                width: 284,
                height: 356,
                borderRadius: 20,
                overflow: "hidden",
                border: `4px solid ${accent}`,
                background: SURFACE,
                flexShrink: 0,
                marginBottom: 24,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
              <img
                src={portrait}
                alt={name}
                width={284}
                height={356}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
              />
            </div>
          ) : null}
        </div>

        <Footer />
      </div>
    ),
    OG_SIZE,
  );
}

/**
 * Editorial & investigation share card for blog posts, expenses investigations, and major hubs.
 * Supports an optional hero figure (e.g. £23,437), an optional editorial photo on the right,
 * and an optional politician mini-portrait badge.
 */
export function ogInvestigationCard({
  eyebrow,
  eyebrowColor = ACCENT,
  title,
  subtitle,
  stat,
  statTone = "bad",
  photoPath,
  person,
}: {
  eyebrow: string;
  eyebrowColor?: string;
  title: string;
  subtitle?: string;
  stat?: string;
  statTone?: "accent" | "bad" | "good" | "amber" | "white";
  photoPath?: string | null;
  person?: { name: string; place: string; photoPath?: string | null };
}) {
  const photo = loadPublicImage(photoPath);
  const avatar = loadPublicImage(person?.photoPath);
  const hasRightPhoto = Boolean(photo);

  const titleSize = hasRightPhoto
    ? title.length > 72
      ? 34
      : title.length > 52
        ? 40
        : 46
    : title.length > 72
      ? 44
      : title.length > 48
        ? 52
        : 58;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: DEEP,
          color: "#ffffff",
          padding: "52px 68px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 44, flex: 1, alignItems: "center", paddingBottom: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                color: eyebrowColor,
              }}
            >
              {eyebrow}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: "auto", marginBottom: "auto" }}>
              {stat ? (
                <div
                  style={{
                    display: "flex",
                    fontSize: stat.length > 8 ? 72 : 92,
                    fontWeight: 800,
                    letterSpacing: -3.5,
                    lineHeight: 0.92,
                    color: toneColor(statTone),
                  }}
                >
                  {stat}
                </div>
              ) : null}

              <div
                style={{
                  display: "flex",
                  fontSize: titleSize,
                  fontWeight: 800,
                  letterSpacing: -1.5,
                  lineHeight: 1.1,
                  color: "#ffffff",
                }}
              >
                {title}
              </div>

              {subtitle && !stat ? (
                <div
                  style={{
                    display: "flex",
                    fontSize: 24,
                    lineHeight: 1.35,
                    color: MUTED,
                  }}
                >
                  {subtitle.length > 135 ? `${subtitle.slice(0, 132)}...` : subtitle}
                </div>
              ) : null}
            </div>

            {person ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {avatar ? (
                  <div
                    style={{
                      display: "flex",
                      width: 52,
                      height: 52,
                      borderRadius: 999,
                      overflow: "hidden",
                      border: `2px solid ${ACCENT}`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
                    <img
                      src={avatar}
                      alt={person.name}
                      width={52}
                      height={52}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                    />
                  </div>
                ) : null}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", fontSize: 22, fontWeight: 700, color: "#ffffff" }}>
                    {person.name}
                  </div>
                  <div style={{ display: "flex", fontSize: 18, color: MUTED }}>
                    {person.place}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", fontSize: 22, color: MUTED }}>
                Plain English reporting backed by official records
              </div>
            )}
          </div>

          {photo ? (
            <div
              style={{
                display: "flex",
                width: 390,
                height: 390,
                borderRadius: 20,
                overflow: "hidden",
                border: `2px solid ${BORDER}`,
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
              <img
                src={photo}
                alt=""
                width={390}
                height={390}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : null}
        </div>

        <Footer />
      </div>
    ),
    OG_SIZE,
  );
}

/**
 * Head-to-head comparison card for Glasgow vs Edinburgh, /compare-areas?a=...&b=...,
 * and area-vs-area comparisons.
 */
export function ogCompareCard({
  eyebrow,
  leftName,
  leftWins,
  leftFacts,
  rightName,
  rightWins,
  rightFacts,
  totalMeasures,
}: {
  eyebrow: string;
  leftName: string;
  leftWins: number;
  leftFacts: string[];
  rightName: string;
  rightWins: number;
  rightFacts: string[];
  totalMeasures: number;
}) {
  const nameSize = Math.max(leftName.length, rightName.length) > 16 ? 32 : 40;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: DEEP,
          color: "#ffffff",
          padding: "52px 68px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: ACCENT,
          }}
        >
          {eyebrow}
        </div>

        <div style={{ display: "flex", alignItems: "stretch", gap: 24, marginTop: 24, marginBottom: 24, flex: 1 }}>
          {/* Left area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              background: SURFACE,
              border: `2px solid ${leftWins >= rightWins ? MINT : BORDER}`,
              borderRadius: 20,
              padding: "28px 32px",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", fontSize: nameSize, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1 }}>
              {leftName}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <div style={{ display: "flex", fontSize: 78, fontWeight: 800, letterSpacing: -3, lineHeight: 0.9, color: leftWins >= rightWins ? MINT : "#ffffff" }}>
                {String(leftWins)}
              </div>
              <div style={{ display: "flex", fontSize: 22, color: MUTED }}>
                {`of ${totalMeasures} measures`}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 20, color: MUTED }}>
              {leftFacts.slice(0, 2).map((f, i) => (
                <div key={i} style={{ display: "flex" }}>{f}</div>
              ))}
            </div>
          </div>

          {/* VS badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 68,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 999,
                background: ACCENT,
                color: DEEP,
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              VS
            </div>
          </div>

          {/* Right area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              background: SURFACE,
              border: `2px solid ${rightWins > leftWins ? MINT : BORDER}`,
              borderRadius: 20,
              padding: "28px 32px",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", fontSize: nameSize, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1 }}>
              {rightName}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <div style={{ display: "flex", fontSize: 78, fontWeight: 800, letterSpacing: -3, lineHeight: 0.9, color: rightWins > leftWins ? MINT : "#ffffff" }}>
                {String(rightWins)}
              </div>
              <div style={{ display: "flex", fontSize: 22, color: MUTED }}>
                {`of ${totalMeasures} measures`}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 20, color: MUTED }}>
              {rightFacts.slice(0, 2).map((f, i) => (
                <div key={i} style={{ display: "flex" }}>{f}</div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    ),
    OG_SIZE,
  );
}

/**
 * Big-number stat card for council accountability, council tax, salary after tax,
 * indicators, rankings, and MSP region pages.
 */
export function ogStatCard({
  eyebrow,
  title,
  stat,
  statTone = "accent",
  details,
}: {
  eyebrow: string;
  title: string;
  stat: string;
  statTone?: "accent" | "bad" | "good" | "amber" | "white";
  details: string[];
}) {
  const titleSize = title.length > 48 ? 42 : title.length > 32 ? 48 : 54;
  const statSize = stat.length > 10 ? 96 : stat.length > 7 ? 116 : 138;

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
          padding: "56px 68px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: ACCENT,
          }}
        >
          {eyebrow}
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: 36 }}>
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 800,
              letterSpacing: -1.5,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            {title}
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
            <div
              style={{
                display: "flex",
                fontSize: statSize,
                fontWeight: 800,
                letterSpacing: -5,
                lineHeight: 0.88,
                color: toneColor(statTone),
              }}
            >
              {stat}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                paddingBottom: 6,
                fontSize: 26,
                color: MUTED,
                flex: 1,
              }}
            >
              {details.slice(0, 3).map((line, i) => (
                <div key={i} style={{ display: "flex", lineHeight: 1.25 }}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    ),
    OG_SIZE,
  );
}

/**
 * Clean branded card for general pages, hubs, tools, and categories.
 */
export function ogPageCard({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  const titleSize = title.length > 65 ? 44 : title.length > 44 ? 52 : 60;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: DEEP,
          color: "#ffffff",
          padding: "56px 68px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: ACCENT,
          }}
        >
          {eyebrow}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 1020 }}>
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 800,
              letterSpacing: -1.8,
              lineHeight: 1.08,
            }}
          >
            {title}
          </div>
          {description ? (
            <div style={{ display: "flex", fontSize: 28, lineHeight: 1.35, color: MUTED }}>
              {description.length > 160 ? `${description.slice(0, 157)}...` : description}
            </div>
          ) : null}
        </div>

        <Footer />
      </div>
    ),
    OG_SIZE,
  );
}
