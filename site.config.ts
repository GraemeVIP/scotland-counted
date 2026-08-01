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
  url: "https://scotlandcounted.org.uk",

  tagline: "A free guide to poverty, work and living costs in Scotland.",
  description:
    "Scotland Counted is a free, independent guide to poverty, work and living costs across Scotland. See the facts for your area, understand who has the power to change things and open a ready-written email to your MP and MSP.",

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

  /**
   * Handles only, no @ and no URL — the code adds both.
   *
   * The X handle does more than add a footer link: it becomes twitter:site and
   * twitter:creator, so a shared link renders a card attributed to the account
   * with a follow path back to it. Without it a post can travel and leave no
   * way to find who published the thing. It is also listed in sameAs, which is
   * how a search engine ties the profile and the site to one publisher.
   *
   * Leave any of these blank and the link and its tags disappear.
   */
  social: {
    x: "scotlandcounted",
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

  /**
   * Analytics. Every field is off until you paste an ID in, and each one is
   * independent — filling in one does not switch on the others.
   *
   * Two things happen automatically when you do fill them in. The
   * Content-Security-Policy in next.config.ts opens up only the hosts that
   * the tools you enabled actually need, so the policy stays tight for
   * anything you leave blank. And the privacy page reads these values, so
   * what it tells people is always what is really running.
   *
   * These load without a consent banner, which is a decision taken with the
   * PECR position understood. If that changes, gate <Analytics /> rather than
   * blanking these — blanking them also removes the disclosure.
   */
  analytics: {
    /** GA4 measurement ID, looks like G-XXXXXXXXXX. */
    ga4: "G-5XZC7EX4KP",
    /** Microsoft Clarity project ID, from the Clarity dashboard URL. */
    clarity: "xvpsd85ara",
    /**
     * Search Console: the content="…" value from the HTML-tag method, not the
     * whole tag. Verification only — it sets no cookie and collects nothing.
     */
    googleSiteVerification: "",
  },

  /** Last full data refresh, shown in the footer. */
  dataUpdated: "July 2026",

  /**
   * The same refresh as an ISO date. This is the one source of truth for every
   * machine-readable date on the site — sitemap lastmod and the dateModified in
   * article structured data both read it, so they can never drift apart or fall
   * back to "whenever this happened to build". Update it with dataUpdated.
   */
  dataCheckedISO: "2026-07-31",
} as const;

export type Site = typeof site;
