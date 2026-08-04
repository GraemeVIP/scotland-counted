/**
 * The site's spine.
 *
 * One registry feeds the header, both menus, the /browse page and the 404, so
 * they cannot disagree with each other. Editing this file is how the
 * navigation changes; there is deliberately nowhere else to do it.
 *
 * The primary path follows the four questions a visitor actually arrives with:
 * what is happening where I live, what does it mean for my money, who is
 * responsible, and what is the evidence. That order is why "Your area" comes
 * before "Councils" even though councils is the larger section.
 *
 * Poverty used to be the umbrella and is now one flagship subject among
 * several. It keeps a hub of its own at /poverty and every poverty URL that
 * existed before still works.
 */

/**
 * `featured` lights an item up in the menu. Used sparingly and on purpose:
 * one per column, so the eye lands on a short diagonal instead of scanning a
 * wall of identical links. Highlighting a fifth would mean highlighting
 * nothing.
 */
export type NavItem = { href: string; label: string; blurb?: string; featured?: boolean };
export type NavTone = "local" | "tools" | "councils" | "change" | "topics" | "proof";

/** The five items in the header. Deliberately short, deliberately task-shaped. */
export const PRIMARY: NavItem[] = [
  { href: "/areas", label: "Your area" },
  { href: "/money", label: "Your money" },
  { href: "/councils", label: "Councils" },
  { href: "/who-decides", label: "Who decides" },
  { href: "/blog", label: "Investigations" },
];

/** Everything, grouped the way a person would ask for it. Feeds the browse
 *  panel, the /browse page and the footer, so they can never disagree. */
export const SECTIONS: Array<{
  title: string;
  intro: string;
  tone: NavTone;
  items: NavItem[];
}> = [
  {
    title: "Your area",
    intro: "What the numbers look like where you live, and who represents you there.",
    tone: "local",
    items: [
      { href: "/areas", label: "All 32 council areas", blurb: "Child poverty, benefits and pay context where you live", featured: true },
      { href: "/find-my-mp-and-msp", label: "Find my MP and MSPs", blurb: "Enter a postcode. It is not stored" },
      { href: "/representatives", label: "Every MP and MSP", blurb: "Who they are, how to reach them, and how they voted" },
      { href: "/constituencies", label: "All 57 MP areas", blurb: "The area each MP is responsible for" },
      { href: "/why-poverty-is-worse-in-glasgow", label: "Glasgow", blurb: "Why the worst rate in Scotland is where it is" },
    ],
  },
  {
    title: "Your money",
    intro: "What you earn, what you keep, what it costs and what help exists.",
    tone: "tools",
    items: [
      { href: "/money", label: "Everything about your money", blurb: "Pay, council tax, benefits and bills in one place", featured: true },
      { href: "/take-home-pay-calculator-scotland", label: "Take-home pay calculator", blurb: "What you keep on Scottish tax rates" },
      { href: "/council-tax-bands-scotland", label: "Council tax by band", blurb: "What it really costs, water included" },
      { href: "/blog/universal-credit-when-you-work-more-hours", label: "Universal Credit and extra hours", blurb: "Why more work does not always mean more money" },
      { href: "/blog/crisis-grant-scotland-how-to-apply", label: "Emergency help", blurb: "Crisis Grants and rent shortfall payments" },
    ],
  },
  {
    title: "Councils",
    intro: "What your council spends, what it delivers and what the auditors found.",
    tone: "councils",
    items: [
      { href: "/councils", label: "All 32 council records", blurb: "Budgets, results, audits and promises", featured: true },
      { href: "/data", label: "Download the council data", blurb: "Every council on the same seven measures" },
      { href: "/press", label: "Figures for reuse", blurb: "Lift-ready lines, charts and citation" },
    ],
  },
  {
    title: "Who decides",
    intro: "Which government controls what, and what happens when you contact them.",
    tone: "change",
    items: [
      { href: "/who-decides", label: "Who decides what", blurb: "London, Edinburgh or your council, issue by issue", featured: true },
      { href: "/who-is-responsible-for-poverty-in-scotland", label: "Responsibility for poverty", blurb: "Which powers sit where, on this one subject" },
      { href: "/solutions-to-poverty-in-scotland", label: "What would fix it", blurb: "Costed options, and who can do them" },
      { href: "/what-happens-when-you-email-your-mp", label: "Why it is worth the bother", blurb: "What happens after you press send" },
    ],
  },
  {
    title: "Big subjects",
    intro: "The long-running stories, each with its own front door.",
    tone: "topics",
    items: [
      { href: "/poverty", label: "Poverty in Scotland", blurb: "The figures, the causes and who can fix it", featured: true },
      { href: "/blog", label: "Investigations and explainers", blurb: "Evidence-led pieces, filed by subject" },
      { href: "/glasgow-poverty-statistics", label: "The Glasgow record", blurb: "Every Glasgow indicator in one place" },
      { href: "/poverty-in-scotland-quiz", label: "Guess the figure", blurb: "Six questions. Most people get them wrong" },
      { href: "/faq", label: "Questions and answers", blurb: "Search the things people actually ask" },
      { href: "/glossary", label: "Plain-English glossary", blurb: "Every term, in ordinary words" },
    ],
  },
  {
    title: "Check the evidence",
    intro: "The data, methods and corrections behind every claim.",
    tone: "proof",
    items: [
      { href: "/data", label: "Download the data", blurb: "The source files and their reuse rules", featured: true },
      { href: "/methods", label: "Methods and sources", blurb: "Exactly how every figure was counted" },
      { href: "/press", label: "Press and reuse", blurb: "Charts, embeds and a press kit" },
      { href: "/updates", label: "What changed", blurb: "The public log, with RSS" },
      { href: "/corrections", label: "Corrections", blurb: "Errors, and what I did about them" },
      { href: "/accessibility", label: "Accessibility", blurb: "What is tested, and what is still known to be wrong" },
    ],
  },
];

/**
 * The places most people are looking for, for the menu's quick picks.
 *
 * Hard-coded rather than derived from the council data so the header does not
 * pull the whole dataset into the client bundle on every page. Names and hrefs
 * only. The figures live on the pages themselves.
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
  { count: "32", label: "council areas covered", href: "/areas" },
  { count: "32", label: "council records checked", href: "/councils" },
  { count: "57", label: "current MPs listed", href: "/representatives" },
  { count: "129", label: "current MSPs listed", href: "/representatives/msps" },
];

/** About and contact, which sit in the menu footer rather than a column. */
export const MENU_FOOTER_LINKS: NavItem[] = [
  { href: "/about", label: "About the project" },
  { href: "/contact", label: "Contact" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/privacy", label: "Privacy" },
];
