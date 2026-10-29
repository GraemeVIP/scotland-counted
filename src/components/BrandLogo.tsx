import Image from "next/image";

/**
 * The Scotland Counted logo: the SC monogram and the wordmark.
 *
 * "on-dark" is the original artwork, white lettering for the navy header and
 * footer. "adaptive" is for surfaces that follow the theme: the dark lettering
 * version on paper, swapped for the white one when the dark theme is on.
 *
 * Kept in its own file so the header, the menu sheet and the 404 page can all
 * use it without importing each other.
 */
const RATIO = 560 / 96;

export function BrandLogo({
  tone = "on-dark",
  height = 28,
  priority = false,
  className = "",
  sizeClass,
}: {
  tone?: "on-dark" | "adaptive";
  height?: number;
  priority?: boolean;
  className?: string;
  /** Responsive height classes, e.g. "h-[26px] xl:h-[32px]". Overrides `height` on screen. */
  sizeClass?: string;
}) {
  const width = Math.round(height * RATIO);
  const img = (src: string, extra = "") => (
    <Image
      src={src}
      alt="Scotland Counted"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={`block w-auto max-w-full ${sizeClass ?? ""} ${extra}`}
      style={sizeClass ? undefined : { height, width: "auto" }}
    />
  );
  if (tone === "on-dark") return <span className={`inline-flex ${className}`}>{img("/brand/logo-on-dark.webp")}</span>;
  return (
    <span className={`inline-flex ${className}`}>
      {img("/brand/logo-on-light.webp", "logo-light-theme")}
      {img("/brand/logo-on-dark.webp", "logo-dark-theme")}
    </span>
  );
}
