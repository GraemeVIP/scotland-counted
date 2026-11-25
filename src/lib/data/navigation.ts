/**
 * The site's spine.
 *
 * One registry feeds the header, the section panels, the phone menu, the
 * footer, /browse and the 404, so they cannot disagree with each other.
 * Editing this file is how the navigation changes; there is deliberately
 * nowhere else to do it.
 *
 * Six sections, shaped by what people actually come looking for: money and
 * pay, benefits, council tax, their area, who represents them, and Modern
 * Studies for schools. Every page belongs to exactly one section, so nothing
 * is more than two clicks from anywhere. The pages that make the site
 * checkable (data, methods, corrections) sit in the footer on every page
 * rather than crowding the menu.
 */

export type NavItem = { href: string; label: string; tag?: string };

/** "investigations" is the red Investigations menu; it is not one of the six sections in HUBS. */
export type HubId = "money" | "benefits" | "tax" | "area" | "reps" | "schools" | "investigations";

/**
 * The featured box at the left of each panel. `kind` picks the control:
 * a salary box that opens the calculator, a council picker, a postcode box,
 * the next early payment date, or a plain link.
 */
export type HubFeature = {
  kind: "salary" | "council" | "postcode-area" | "postcode-reps" | "payment-dates" | "link";
  kicker: string;
  title: string;
  text: string;
  cta: string;
  href: string;
};

export type Hub = {
  id: HubId;
  label: string;
  /** The section's front door. */
  href: string;
  intro: string;
  feature: HubFeature;
  groups: { heading: string; items: NavItem[] }[];
  /** Shown as chips along the bottom of the panel. */
  top: NavItem[];
  /**
   * Pages for someone who needs help today. They stay in their group (so the
   * section page, /browse and the tests still list them), but the menus lift
   * them out into their own band so they are never lost in a long list.
   */
  help?: { title: string; text: string; hrefs: string[] };
};

/** A section's groups as the menus show them: anything in the help band is left out of the lists. */
export function menuGroups(hub: Hub) {
  const lifted = new Set(hub.help?.hrefs ?? []);
  return hub.groups.map((group) => ({ ...group, items: group.items.filter((item) => !lifted.has(item.href)) }));
}

/** The help band's links, in the order given. */
export function helpItems(hub: Hub): NavItem[] {
  const all = hub.groups.flatMap((group) => group.items);
  return (hub.help?.hrefs ?? []).map((href) => all.find((item) => item.href === href)!).filter(Boolean);
}

export const HUBS: Hub[] = [
  {
    id: "money",
    label: "Money",
    href: "/money",
    intro: "What you earn, what you keep and the legal minimum.",
    feature: {
      kind: "salary",
      kicker: "Calculator",
      title: "Take home pay",
      text: "Put in your salary and see what reaches your bank on Scottish tax rates.",
      cta: "Work it out",
      href: "/take-home-pay-calculator-scotland",
    },
    groups: [
      {
        heading: "Pay and tax",
        items: [
          { href: "/take-home-pay-calculator-scotland", label: "Take home pay calculator", tag: "Tool" },
          { href: "/tax-bands-scotland", label: "Scottish income tax bands" },
          { href: "/scottish-budget-2027-28", label: "Scottish Budget 2027/28", tag: "3 Dec" },
          { href: "/30000-after-tax-scotland", label: "£30,000 after tax" },
          { href: "/average-salary-scotland", label: "Average salary in Scotland" },
        ],
      },
      {
        heading: "Minimum wage",
        items: [
          { href: "/minimum-wage-scotland", label: "Minimum wage Scotland" },
          { href: "/minimum-wage-2027", label: "Minimum wage 2027", tag: "April" },
          { href: "/real-living-wage-scotland", label: "Real Living Wage" },
          { href: "/minimum-wage-in-glasgow-scotland", label: "Minimum wage in Glasgow" },
          { href: "/minimum-wage-in-edinburgh-scotland", label: "Minimum wage in Edinburgh" },
          { href: "/minimum-wage-aberdeen", label: "Minimum wage in Aberdeen" },
          { href: "/minimum-wage-dundee", label: "Minimum wage in Dundee" },
        ],
      },
      {
        heading: "Bills and prices",
        items: [
          { href: "/lbtt-calculator-scotland", label: "LBTT calculator (Stamp Duty)", tag: "Tool" },
          { href: "/scotland-bank-holidays", label: "Scotland bank holidays" },
          { href: "/electricity-cost-calculator-scotland", label: "Electricity cost calculator", tag: "Tool" },
          { href: "/energy-price-cap-scotland", label: "Energy price cap" },
          { href: "/cost-of-living-scotland", label: "Why the cost of living is so high" },
          { href: "/blog/why-food-prices-stay-high-when-inflation-falls", label: "Why food prices stay high" },
        ],
      },
    ],
    top: [
      { href: "/minimum-wage-scotland", label: "Minimum wage" },
      { href: "/30000-after-tax-scotland", label: "£30,000 after tax" },
      { href: "/average-salary-scotland", label: "Average salary" },
    ],
  },
  {
    id: "benefits",
    label: "Benefits",
    href: "/benefits",
    intro: "What you can claim, how much it is and when it is paid.",
    feature: {
      kind: "payment-dates",
      kicker: "Payment dates",
      title: "Paid early over holidays",
      text: "When a payment falls on a bank holiday, Social Security Scotland pays it early.",
      cta: "All payment dates",
      href: "/social-security-scotland-payment-dates",
    },
    groups: [
      {
        heading: "Disability and caring",
        items: [
          { href: "/adult-disability-payment", label: "Adult Disability Payment" },
          { href: "/adult-disability-payment-phone-number", label: "Adult Disability Payment phone number" },
          { href: "/disability-support-scotland", label: "Disability support and your rights", tag: "New" },
          { href: "/sight-loss-scotland", label: "Sight loss and blindness", tag: "New" },
          { href: "/carer-support-payment", label: "Carer Support Payment" },
          { href: "/young-carers-allowance-scotland", label: "Young Carer Grant" },
        ],
      },
      {
        heading: "Families and winter",
        items: [
          { href: "/scottish-child-payment", label: "Scottish Child Payment" },
          { href: "/best-start-grant", label: "Best Start Grant" },
          { href: "/blog/free-school-meals-clothing-grant-scotland", label: "Free school meals and clothing" },
          { href: "/winter-fuel-payment-scotland", label: "Winter fuel payment" },
          { href: "/winter-heating-payment", label: "Winter Heating Payment" },
          { href: "/warm-home-discount-scotland", label: "Warm Home Discount (£150)" },
          { href: "/100-energy-payment-scotland", label: "£100 energy payment" },
        ],
      },
      {
        heading: "Apply, appeal and crisis help",
        items: [
          { href: "/where-to-apply-scotland", label: "Where to apply: 24 direct links", tag: "New" },
          { href: "/benefit-or-crisis-grant-rejected-scotland", label: "Turned down? Challenge it", tag: "New" },
          { href: "/crisis-grant-scotland", label: "Crisis grant" },
          { href: "/crisis-grant-phone-number", label: "Crisis grant phone numbers", tag: "32 councils" },
          { href: "/blog/discretionary-housing-payment-scotland", label: "Discretionary Housing Payment" },
          { href: "/blog/universal-credit-when-you-work-more-hours", label: "Universal Credit and extra hours" },
          { href: "/blog/local-housing-allowance-rent-shortfall-scotland", label: "Housing benefit and rent gaps" },
          { href: "/struggling-right-now-scotland", label: "Short of money today" },
          { href: "/suicide-scotland-statistics-and-support", label: "Struggling to cope: 24/7 support" },
        ],
      },
    ],
    top: [
      { href: "/adult-disability-payment", label: "Adult Disability Payment" },
      { href: "/winter-fuel-payment-scotland", label: "Winter fuel payment" },
      { href: "/social-security-scotland-payment-dates", label: "Payment dates" },
    ],
    help: {
      title: "Need help today?",
      text: "Free, fast and confidential.",
      hrefs: ["/struggling-right-now-scotland", "/suicide-scotland-statistics-and-support"],
    },
  },
  {
    id: "tax",
    label: "Council tax",
    href: "/council-tax-bands-scotland",
    intro: "Your band, your bill and how to pay less.",
    feature: {
      kind: "council",
      kicker: "Your bill",
      title: "Council tax by council",
      text: "Every band from A to H, with water and sewerage included.",
      cta: "Show my bands",
      href: "/council-tax-bands-scotland",
    },
    groups: [
      {
        heading: "Your bill",
        items: [
          { href: "/council-tax-bands-scotland", label: "Bands for every council", tag: "32" },
          { href: "/check-council-tax-band", label: "Check your council tax band" },
          { href: "/council-tax-band-d-scotland", label: "Band D across Scotland" },
          { href: "/council-tax-increase-scotland", label: "This year’s rises" },
          { href: "/mansion-tax-scotland", label: "Mansion tax (Bands I and J)", tag: "New" },
        ],
      },
      {
        heading: "Pay less",
        items: [
          { href: "/council-tax-reduction-scotland", label: "Council tax reduction" },
          { href: "/single-person-discount-council-tax-scotland", label: "Single person discount" },
          { href: "/water-rates-scotland", label: "Water rates" },
          { href: "/blog/how-council-tax-works-scotland", label: "How council tax works" },
        ],
      },
      {
        heading: "Your council",
        items: [
          { href: "/councils", label: "All 32 council records" },
          { href: "/best-council-in-scotland", label: "Best council in Scotland" },
          { href: "/who-decides", label: "Who decides what" },
        ],
      },
    ],
    top: [
      { href: "/glasgow-council-tax-bands", label: "Glasgow council tax bands" },
      { href: "/council-tax-band-d-scotland", label: "Band D" },
      { href: "/single-person-discount-council-tax-scotland", label: "Single person discount" },
    ],
  },
  {
    id: "area",
    label: "Your area",
    href: "/areas",
    intro: "The local figures, your council and who represents you.",
    feature: {
      kind: "postcode-area",
      kicker: "Postcode",
      title: "Everything about where you live",
      text: "Your council area, its local figures and the people who represent you.",
      cta: "Go",
      href: "/areas",
    },
    groups: [
      {
        heading: "Places",
        items: [
          { href: "/compare-areas", label: "Compare two areas", tag: "New" },
          { href: "/areas", label: "All 32 council areas" },
          { href: "/best-place-to-live-in-scotland", label: "Best places to live", tag: "New" },
          { href: "/cheapest-place-to-live-in-scotland", label: "Cheapest places to live" },
          { href: "/safest-place-to-live-in-scotland", label: "Safest places to live" },
          { href: "/glasgow-vs-edinburgh", label: "Glasgow vs Edinburgh" },
          { href: "/constituencies", label: "All 57 MP areas" },
        ],
      },
      {
        heading: "Local figures",
        items: [
          { href: "/simd-postcode-checker", label: "SIMD postcode checker", tag: "Tool" },
          { href: "/poverty-in-scotland", label: "Poverty in Scotland" },
          { href: "/unemployment-scotland", label: "Unemployment in Scotland" },
          { href: "/life-expectancy-glasgow", label: "Life expectancy in Glasgow" },
          { href: "/crime-rate-glasgow", label: "Crime rate in Glasgow" },
        ],
      },
      {
        heading: "The Glasgow record",
        items: [
          { href: "/glasgow-poverty-statistics", label: "Glasgow poverty statistics" },
          { href: "/why-poverty-is-worse-in-glasgow", label: "Why poverty is worse in Glasgow" },
          { href: "/blog/drug-deaths-scotland-deprivation", label: "Drug deaths and deprivation" },
        ],
      },
    ],
    top: [
      { href: "/compare-areas", label: "Compare two areas" },
      { href: "/areas/glasgow-city", label: "Glasgow" },
      { href: "/poverty-in-scotland", label: "Poverty in Scotland" },
      { href: "/unemployment-scotland", label: "Unemployment" },
    ],
  },
  {
    id: "reps",
    label: "MSPs and MPs",
    href: "/representatives",
    intro: "Who represents you, how to reach them and who decides what.",
    feature: {
      kind: "postcode-reps",
      kicker: "Postcode",
      title: "Find your MSP and MP",
      text: "All eight of your MSPs and your MP, with their official contact details.",
      cta: "Find them",
      href: "/who-is-my-msp",
    },
    groups: [
      {
        heading: "Find yours",
        items: [
          { href: "/who-is-my-msp", label: "Who is my MSP" },
          { href: "/who-is-my-local-councillor-by-postcode", label: "Who is my local councillor" },
          { href: "/representatives/msps", label: "All 129 MSPs" },
          { href: "/representatives", label: "All 57 MPs" },
          { href: "/mp-expenses-scotland", label: "MP expenses and donations" },
        ],
      },
      {
        heading: "Get in touch",
        items: [
          { href: "/email-your-mp-and-msp", label: "Email your MP and MSP", tag: "Tool" },
          { href: "/what-happens-when-you-email-your-mp", label: "What happens when you email" },
          { href: "/blog/how-to-contact-your-mp-or-msp", label: "How to contact them" },
        ],
      },
      {
        heading: "Who decides",
        items: [
          { href: "/who-decides", label: "Who decides what" },
          { href: "/who-is-responsible-for-poverty-in-scotland", label: "Who is responsible for poverty" },
          { href: "/solutions-to-poverty-in-scotland", label: "What would fix it" },
        ],
      },
    ],
    top: [
      { href: "/who-is-my-msp", label: "Who is my MSP" },
      { href: "/email-your-mp-and-msp", label: "Email your MSP" },
      { href: "/who-is-my-local-councillor-by-postcode", label: "Councillors" },
    ],
  },
  {
    id: "schools",
    label: "Schools",
    href: "/modern-studies",
    intro: "Free Modern Studies lessons, course guides and practice with Scottish evidence.",
    feature: {
      kind: "link",
      kicker: "Free for schools",
      title: "Classroom lessons",
      text: "Printable pupil worksheets with real sources, teacher notes and suggested answers.",
      cta: "See the classroom lessons",
      href: "/modern-studies-teaching-resources",
    },
    groups: [
      {
        heading: "Courses",
        items: [
          { href: "/national-5-modern-studies", label: "National 5 Modern Studies" },
          { href: "/higher-modern-studies", label: "Higher Modern Studies" },
          { href: "/advanced-higher-modern-studies", label: "Advanced Higher Modern Studies" },
        ],
      },
      {
        heading: "Past papers",
        items: [
          { href: "/nat-5-modern-studies-past-papers", label: "Nat 5 past papers" },
          { href: "/higher-modern-studies-past-papers", label: "Higher past papers" },
        ],
      },
      {
        heading: "Topics and tools",
        items: [
          { href: "/modern-studies-teaching-resources", label: "For teachers", tag: "Free" },
          { href: "/causes-of-poverty", label: "Causes of poverty" },
          { href: "/poverty-in-scotland-quiz", label: "Poverty quiz" },
          { href: "/glossary", label: "Plain English glossary" },
          { href: "/faq", label: "Questions and answers" },
        ],
      },
    ],
    top: [
      { href: "/higher-modern-studies-past-papers", label: "Higher past papers" },
      { href: "/national-5-modern-studies", label: "National 5" },
      { href: "/causes-of-poverty", label: "Causes of poverty" },
    ],
  },
];

/** Every investigation (expenses and other probes): the category page. */
export const INVESTIGATIONS: NavItem = { href: "/blog/category/politics-explained", label: "Investigations" };

/**
 * The red Investigations menu in the header. It opens a panel like the six
 * sections, led by the MP and MSP expenses series. Kept out of HUBS so the
 * six sections (and the footer columns built from them) stay as they are.
 */
export const INVESTIGATIONS_HUB: Hub = {
  id: "investigations",
  label: "Investigations",
  href: INVESTIGATIONS.href,
  intro: "What MPs and MSPs billed you for, from the official expense files.",
  feature: {
    kind: "link",
    kicker: "MP and MSP expenses",
    title: "21 stories, every receipt",
    text: "Hotels, energy bills, flights and Edinburgh flats. Check what your own MP claimed by postcode.",
    cta: "See all 21 stories",
    href: "/mp-expenses-scotland#all-stories",
  },
  groups: [
    {
      heading: "Start here",
      items: [
        { href: "/mp-expenses-scotland", label: "MP expenses and donations" },
        { href: "/mp-expenses-scotland/search", label: "Search every MP receipt", tag: "Tool" },
        { href: "/blog/worst-scottish-mp-expenses", label: "Standout MP expense claims" },
        { href: "/blog/scottish-mp-msp-expenses-what-it-could-buy", label: "What £6.64m could buy" },
      ],
    },
    {
      heading: "Biggest bills",
      items: [
        { href: "/blog/zubir-ahmed-mp-london-hotels-glasgow", label: "£67,519 on London hotels" },
        { href: "/blog/kilmarnock-mp-23437-electricity-bill", label: "£23,437 energy bill" },
        { href: "/blog/scottish-mps-flights-climate-expenses", label: "£868,378 on London flights", tag: "New" },
        { href: "/blog/energy-minister-michael-shanks-flights-rutherglen", label: "The Energy Minister's flights", tag: "New" },
        { href: "/blog/scottish-mps-london-homes-152-sitting-days", label: "£2.91m on London homes" },
      ],
    },
    {
      heading: "Holyrood and more",
      items: [
        { href: "/blog/msp-edinburgh-flats-commuter-belt", label: "£623,696 on MSPs' Edinburgh flats", tag: "New" },
        { href: "/blog/meghan-gallacher-msp-low-expenses", label: "The MSP who claims least", tag: "New" },
        { href: "/blog/msp-expenses-scotland-investigation", label: "MSP expenses party tally" },
        { href: "/blog/scottish-mp-expenses-and-freebies-investigation", label: "Gifts, trips and donors" },
        { href: "/blog/operation-branchform-snp-money-timeline", label: "Operation Branchform timeline" },
      ],
    },
  ],
  top: [
    { href: "/mp-expenses-scotland", label: "MP expenses hub" },
    { href: "/mp-expenses-scotland/search", label: "Receipt Finder" },
    { href: "/blog/zubir-ahmed-mp-london-hotels-glasgow", label: "£67,519 London hotels" },
  ],
};

/** Every post: explainers, guides and investigations. Phone menu, 404 and /browse. */
export const EXPLAINERS: NavItem = { href: "/blog", label: "Explainers" };

/** The pages that make the site checkable. Footer, phone menu and /browse. */
export const EVIDENCE: NavItem[] = [
  { href: "/data", label: "Download the data" },
  { href: "/methods", label: "Methods and sources" },
  { href: "/corrections", label: "Corrections" },
  { href: "/press", label: "Press and reuse" },
  { href: "/updates", label: "What changed" },
  { href: "/accessibility", label: "Accessibility" },
];

/** Footer and phone menu links. */
export const ABOUT: NavItem[] = [
  { href: "/about", label: "About Scotland Counted" },
  { href: "/for-organisations", label: "For organisations" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

/** Every section front door plus Investigations and Explainers: the 404 and anywhere that needs the short list. */
export const PRIMARY: NavItem[] = [...HUBS.map((hub) => ({ href: hub.href, label: hub.label })), INVESTIGATIONS, EXPLAINERS];

/** CSS colour for a section, themed for the page. */
export const hubColor = (id: HubId) => `var(--hub-${id})`;
/** CSS colour for a section's dot on the navy header bar. */
export const hubBarColor = (id: HubId) => `var(--hub-${id}-bar)`;

/** The section a path belongs to, so the phone menu can open on the right one. */
export function hubForPath(pathname: string): HubId | null {
  for (const hub of HUBS) {
    if (pathname === hub.href) return hub.id;
    if (hub.groups.some((group) => group.items.some((item) => item.href === pathname))) return hub.id;
  }
  if (pathname.startsWith("/areas") || pathname.startsWith("/constituencies") || pathname.startsWith("/indicators")) return "area";
  if (pathname.startsWith("/representatives")) return "reps";
  if (pathname.startsWith("/councils") || pathname.endsWith("-council-tax-bands") || pathname.startsWith("/council-tax-band-")) return "tax";
  if (pathname.endsWith("-after-tax-scotland")) return "money";
  if (
    pathname.startsWith("/mp-expenses-scotland") ||
    pathname.startsWith(INVESTIGATIONS.href) ||
    INVESTIGATIONS_HUB.groups.some((group) => group.items.some((item) => item.href === pathname))
  ) {
    return "investigations";
  }
  return null;
}
