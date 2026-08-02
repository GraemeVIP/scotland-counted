/**
 * The one-page summary graphic, described once.
 *
 * Used by the share block on the home page, the download on /press, and the
 * ImageObject structured data — so the dimensions, the alt text and the file
 * cannot drift apart.
 *
 * Portrait on purpose: it was made for a phone screen and for the feeds people
 * share things in. It is deliberately NOT the Open Graph card — those are
 * 1200x630 and a portrait image gets centre-cropped to a slice of its middle,
 * losing the title and the Glasgow panel. /opengraph-image still does that job.
 */
export const infographic = {
  src: "/images/brand/poverty-in-scotland-infographic.webp",
  downloadName: "scotland-counted-poverty-in-scotland.webp",
  width: 1536,
  height: 2752,
  title: "The reality of modern poverty in Scotland",
  license: "/press#reuse-terms",
  copyrightNotice: "© 2026 Scotland Counted",
  alt:
    "Infographic. About 17% of people in Scotland — one in six — live in relative poverty after housing costs. One in five children, one in six working-age adults and one in eight pensioners. Three in four children in poverty have a working parent. Glasgow's child poverty rose nine points to 36.1%, the highest in Scotland.",
  shareText:
    "Three in four children in poverty in Scotland live with someone who works. The figures, and who decides them:",
};
