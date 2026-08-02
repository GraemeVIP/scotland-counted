/**
 * The videos, described once each.
 *
 * The same object feeds the embed, the poster and the VideoObject structured
 * data wherever a video appears, so those three can never drift apart.
 *
 * Posters are downloaded and served from this site rather than hot-linked from
 * YouTube, which is what lets the Content-Security-Policy keep img-src locked
 * to 'self'.
 */

export type SiteVideo = {
  youtubeId: string;
  name: string;
  description: string;
  thumbnail: string;
  /** ISO date and time, including the timezone, from the YouTube upload record. */
  uploadDate: string;
  /** ISO 8601 duration. */
  duration: string;
};

/**
 * What the site is and what it does. This is the one that leads, because a
 * stranger who has just landed needs to know what they are looking at before
 * they need an argument about energy profits.
 */
export const explainerVideo: SiteVideo = {
  youtubeId: "c8tqlj0aCpI",
  name: "Scotland Counted Explainer",
  description:
    "What this site is for, in four minutes. Why one in six people in Scotland live in poverty after housing costs, why three in four children in poverty have a working parent, how the figures differ street by street, and how to put a question to your MP and MSP in about a minute.",
  thumbnail: "/images/video/scotland-counted-explainer.webp",
  uploadDate: "2026-08-01T07:45:49-07:00",
  duration: "PT4M22S",
};

/** The argument about where the money went. Lives on the cost-of-living post. */
export const costOfLivingVideo: SiteVideo = {
  youtubeId: "_TDU9rTLp3E",
  name: "Cost Of Living Explained - The Truth",
  description:
    "Where the money went during the UK cost of living crisis: record upstream energy profits while retail suppliers collapsed, supermarket fuel margins that cost drivers an extra £900m in a year, and what the ONS, the IMF and the CMA actually found about profit-driven inflation.",
  thumbnail: "/images/video/cost-of-living-explained.webp",
  uploadDate: "2026-08-01T06:26:43-07:00",
  duration: "PT6M7S",
};
