/**
 * The public record of what changed on the site and in its data.
 * Newest first. Every data refresh, correction and new section gets an
 * entry — this feeds /updates and the RSS feed, and it is the honest
 * version of a "blog": the site's news is the data's news.
 */

export type ChangeEntry = {
  /** ISO date, used for RSS and sorting. */
  date: string;
  title: string;
  body: string;
  /** Optional path readers should look at. */
  href?: string;
  kind: "data" | "feature" | "correction" | "analysis";
};

export const changelog: ChangeEntry[] = [
  {
    date: "2026-07-31",
    title: "The Count opens, and a contact form",
    body: "The email list is live — one email when the data changes, nothing else. And a contact form replaces the published email address: report an error, make a press enquiry, request data, or suggest an improvement, pre-sorted by reason.",
    href: "/contact",
    kind: "feature",
  },
  {
    date: "2026-07-31",
    title: "Constituency pages: all 57 Scottish Westminster seats",
    body: "Every UK Parliament constituency in Scotland now has its own page with ten years of child poverty figures, its rank, and a letter tool pre-filled for the MP who answers for it. Glasgow East is the highest in Scotland at 34.9%.",
    href: "/constituencies",
    kind: "feature",
  },
  {
    date: "2026-07-31",
    title: "Council pages now carry work and pay data",
    body: "All 32 council area pages gained claimant count (2000–2026) and median pay (2008–2025) charts against Scotland, from the ONS via NOMIS. Orkney's pay series is suppressed by the ONS for small samples and is omitted rather than estimated.",
    href: "/areas",
    kind: "data",
  },
  {
    date: "2026-07-31",
    title: "Charts can now be embedded",
    body: "Every headline indicator chart carries an embed button: a copyable iframe that stays live as the data updates and links back to the sources. Free for any use.",
    href: "/press",
    kind: "feature",
  },
  {
    date: "2026-07-31",
    title: "Site launched",
    body: "Glasgow Counted published: six indicators from 2000, all 32 council areas, the four causes, seven costed fixes, and the accountability record. Every figure retrieved from the original publisher.",
    href: "/",
    kind: "feature",
  },
];
