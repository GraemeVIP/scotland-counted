/**
 * The site's spine.
 *
 * The site has 116 pages and had six menu items, so most of it was only
 * findable by search or by luck. The fix is not more menu items — it is one
 * short task-shaped path through the middle, plus one place that honestly
 * lists everything.
 *
 * The primary path follows the question a visitor actually has, in order:
 * where do I live, who is responsible, why would I bother, what do I do.
 */

/**
 * `featured` lights an item up in the menu. Used sparingly and on purpose:
 * one per column, so the eye lands on a short diagonal instead of scanning a
 * wall of identical links. Highlighting a fifth would mean highlighting
 * nothing.
 */
export type NavItem = { href: string; label: string; blurb?: string; featured?: boolean };

/** The five items in the header. Deliberately short, deliberately task-shaped. */
export const PRIMARY: NavItem[] = [
  { href: "/areas", label: "Your area" },
  { href: "/constituencies", label: "Your MP" },
  { href: "/your-power", label: "Your power" },
  { href: "/what-would-fix-it", label: "What would help" },
  { href: "/blog", label: "Explained" },
];

/** Everything, grouped the way a person would ask for it. Feeds the browse
 *  panel, the /browse page and the footer, so they can never disagree. */
export const SECTIONS: Array<{
  title: string;
  intro: string;
  items: NavItem[];
}> = [
  {
    title: "Where you live",
    intro: "The figures for your own council area and your own MP's area.",
    items: [
      { href: "/areas", label: "All 32 council areas", blurb: "Child poverty, benefits and pay context where you live", featured: true },
      { href: "/constituencies", label: "All 57 MP areas", blurb: "The area each MP is responsible for" },
      { href: "/why-glasgow", label: "Glasgow", blurb: "Why the worst rate in Scotland is where it is" },
      { href: "/council-tax-bands-scotland", label: "Council tax by band", blurb: "What it really costs, water included" },
      { href: "/take-home-pay-calculator-scotland", label: "Take-home pay calculator", blurb: "What you keep on Scottish tax rates" },
      { href: "/quiz", label: "Guess the figure", blurb: "Six questions. Most people get them wrong" },
    ],
  },
  {
    title: "Do something",
    intro: "The part that actually changes anything.",
    items: [
      { href: "/take-action", label: "Email your MP and MSP", blurb: "I write both emails for you", featured: true },
      { href: "/your-power", label: "Why it is worth the bother", blurb: "What happens after you press send" },
      { href: "/what-would-fix-it", label: "What would fix it", blurb: "Costed options, and who can do them" },
      { href: "/accountability", label: "Who decides what", blurb: "London, Edinburgh or the council" },
    ],
  },
  {
    title: "Understand it",
    intro: "Plain-English explainers, no assumed knowledge.",
    items: [
      { href: "/blog", label: "Explained in plain English", blurb: "Short answers to common questions", featured: true },
      { href: "/faq", label: "Questions and answers", blurb: "Search the things people actually ask" },
      { href: "/glossary", label: "Plain-English glossary", blurb: "Every term, in ordinary words" },
      { href: "/the-numbers", label: "The Glasgow record", blurb: "Every indicator in one place" },
    ],
  },
  {
    title: "Check the work",
    intro: "Everything I publish can be verified. Nothing here is behind a login.",
    items: [
      { href: "/data", label: "Download the data", blurb: "The raw files, free to reuse" },
      { href: "/methods", label: "Methods and sources", blurb: "Exactly how every figure was counted" },
      { href: "/press", label: "Press and reuse", blurb: "Charts, embeds and a press kit" },
      { href: "/updates", label: "What changed", blurb: "The public log, with RSS" },
      { href: "/corrections", label: "Corrections", blurb: "Errors, and what I did about them" },
      { href: "/contact", label: "Ask a question", blurb: "A real person reads it. No question is too basic", featured: true },
    ],
  },
];

/**
 * The places most people are looking for, for the menu's quick picks.
 *
 * Hard-coded rather than derived from the council data so the header does not
 * pull the whole dataset into the client bundle on every page. Names and hrefs
 * only — the figures live on the pages themselves.
 */
export const QUICK_AREAS: NavItem[] = [
  { href: "/areas/glasgow-city", label: "Glasgow" },
  { href: "/areas/city-of-edinburgh", label: "Edinburgh" },
  { href: "/areas/north-lanarkshire", label: "North Lanarkshire" },
  { href: "/areas/fife", label: "Fife" },
  { href: "/areas/aberdeen-city", label: "Aberdeen" },
  { href: "/areas/dundee-city", label: "Dundee" },
  { href: "/areas/south-lanarkshire", label: "South Lanarkshire" },
  { href: "/areas/renfrewshire", label: "Renfrewshire" },
];

/** What the site actually holds, for the menu footer. */
export const INVENTORY = [
  { count: "32", label: "council areas", href: "/areas" },
  { count: "57", label: "MP areas", href: "/constituencies" },
  { count: "46", label: "questions answered", href: "/faq" },
  { count: "6", label: "measures tracked", href: "/the-numbers" },
];

/** About and contact, which sit in the menu footer rather than a column. */
export const MENU_FOOTER_LINKS: NavItem[] = [
  { href: "/about", label: "Who makes this" },
  { href: "/contact", label: "Get in touch" },
  { href: "/privacy", label: "Privacy" },
];
