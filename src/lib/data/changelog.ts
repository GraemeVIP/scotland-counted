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
    date: "2026-08-01",
    title: "Pay figures relabelled and minimum-wage reality added",
    body: "The ASHE values were correct but the words around them were not careful enough. The site no longer calls the restricted full-time PAYE estimate a typical wage or treats the workplace-residence difference as wages leaving Glasgow. Every council page now starts with the current legal minimum, its full-time annual equivalent and independent evidence on what a basic living standard costs. The restricted pay estimate is clearly separated from poverty figures and removed from campaign emails.",
    href: "/indicators/glasgow-full-time-pay",
    kind: "correction",
  },
  {
    date: "2026-07-31",
    title: "Scotland-wide relaunch",
    body: "The project now leads with Scotland-wide poverty, work and living-standards evidence. Every council area carries local child-poverty, claimant-count and pay data; every Scottish Westminster seat has a constituency page; Glasgow remains the founding deep dive; and the postcode action is now the main route through the site.",
    href: "/",
    kind: "feature",
  },
  {
    date: "2026-07-31",
    title: "Letters now find and address the right representatives",
    body: "Enter a postcode and the action tool now finds the reader's MP and constituency MSP, routes each policy request to the tier that controls it, and opens a fully addressed draft in the reader's own email app.",
    href: "/find-my-mp-and-msp",
    kind: "feature",
  },
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
    body: "The project launched with six indicators from 2000, all 32 council areas, the four causes, seven costed fixes, and the accountability record. Every figure was retrieved from the original publisher.",
    href: "/",
    kind: "feature",
  },
];
