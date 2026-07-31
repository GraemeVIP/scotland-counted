/**
 * Single source of truth for site identity.
 * Change these values and every page, meta tag, sitemap entry and
 * structured-data block updates with them.
 */

export const site = {
  name: "Scotland Counted",
  shortName: "Scotland Counted",

  /**
   * The permanent home. Used for canonical URLs, the sitemap, Open Graph tags
   * and JSON-LD, and by src/middleware.ts to decide which host may be indexed:
   * any host that is not this one is served noindex. No trailing slash.
   */
  url: "https://scotlandcounted.co.uk",

  tagline: "Poverty in Scotland, explained clearly.",
  description:
    "Poverty, work and living costs across Scotland in ordinary words. Enter your postcode to see the local facts and open ready-written emails to your MP and MSP.",

  locale: "en_GB",
  themeColor: "#2a78d6",

  author: {
    name: "Graeme",
    role: "Founder, Strathmark Consulting",
    /** CHANGE ME — used in the byline and structured data. */
    url: "https://strathmarkconsulting.com",
  },

  organisation: {
    name: "Strathmark Consulting",
    url: "https://strathmarkconsulting.com",
  },

  /** CHANGE ME — shown on the about page and used for corrections. */
  contactEmail: "hello@strathmarkconsulting.com",

  /** Optional. Leave blank to hide the link. */
  social: {
    x: "",
    bluesky: "",
    linkedin: "",
  },

  /**
   * The Count — the email list. Create a free access key at
   * web3forms.com (submissions arrive in your inbox), paste it here
   * and redeploy: every sign-up form on the site goes live. While it
   * is empty the forms stay hidden, so nothing broken ever ships.
   */
  web3formsKey: "4bcc9b22-6c82-45cc-ab20-0882fc8144d5",

  /** Last full data refresh, shown in the footer. */
  dataUpdated: "July 2026",
} as const;

export type Site = typeof site;
