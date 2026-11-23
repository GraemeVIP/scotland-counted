import Image from "next/image";

/**
 * The Scotland Counted logo: the blue saltire SC mark, with the name set
 * beside it on two lines ("Scotland" over "Counted").
 *
 * The mark is a transparent image (public/brand/sc-mark.webp, trimmed from
 * Graeme's 1254px master), so it sits straight on any background. The name is
 * live text, so it stays sharp at every size and needs no second image for
 * the dark theme.
 *
 * "on-dark" is white lettering for the navy header, menu sheet and footer.
 * "adaptive" follows the theme (ink on paper, white in the dark theme).
 *
 * Kept in its own file so the header, the menu sheet and the 404 page can all
 * use it without importing each other.
 */
const MARK_RATIO = 193 / 120;

export function BrandLogo({
  tone = "on-dark",
  height = 30,
  priority = false,
  className = "",
}: {
  tone?: "on-dark" | "adaptive";
  /** Height of the mark in px. The name is sized to match it. */
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  const markWidth = Math.round(height * MARK_RATIO);
  const fontSize = Math.round(height * 0.42 * 10) / 10;
  return (
    <span className={`inline-flex items-center gap-2.5 align-middle ${className}`}>
      <Image
        src="/brand/sc-mark.webp"
        alt=""
        width={markWidth}
        height={height}
        priority={priority}
        unoptimized
        className="block shrink-0"
        style={{ height, width: markWidth }}
      />
      <span
        className={`ui relative top-[0.75px] flex flex-col items-center text-center font-[800] uppercase leading-[1.02] tracking-[0.045em] ${
          tone === "on-dark" ? "text-white" : "text-[var(--ink)]"
        }`}
        style={{ fontSize }}
      >
        <span>Scotland</span>
        <span>Counted</span>
      </span>
    </span>
  );
}
