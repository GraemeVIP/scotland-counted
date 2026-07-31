import { ImageResponse } from "next/og";

/**
 * The tab icon: three counted bars on the institutional deep blue.
 * Replaces the default Next.js favicon, which told every visitor this
 * was a developer side project before they read a word.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 3,
          background: "#0d2f45",
          paddingBottom: 6,
        }}
      >
        <div style={{ width: 5, height: 9, background: "#e08a3c" }} />
        <div style={{ width: 5, height: 15, background: "#e08a3c" }} />
        <div style={{ width: 5, height: 21, background: "#f3efe6" }} />
      </div>
    ),
    size
  );
}
