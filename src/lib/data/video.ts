/**
 * The explainer video, described once.
 *
 * It appears on the home page and inside the cost-of-living post, and the same
 * object feeds the VideoObject structured data on both — so the embed, the
 * poster and the schema can never drift apart.
 *
 * The poster is downloaded and served from this site rather than hot-linked
 * from YouTube, which is what lets the Content-Security-Policy keep img-src
 * locked to 'self'.
 */
export const costOfLivingVideo = {
  youtubeId: "_TDU9rTLp3E",
  name: "Cost Of Living Explained - The Truth",
  description:
    "Where the money went during the UK cost of living crisis: record upstream energy profits while retail suppliers collapsed, supermarket fuel margins that cost drivers an extra £900m in a year, and what the ONS, the IMF and the CMA actually found about profit-driven inflation.",
  thumbnail: "/images/video/cost-of-living-explained.webp",
  /** ISO date, from the YouTube upload record. */
  uploadDate: "2026-08-01",
  /** ISO 8601 duration — 6 minutes 7 seconds. */
  duration: "PT6M7S",
};
