/**
 * Every MP and MSP expenses story on the site, with one short hook each.
 * Used by the "more expenses stories" strip on each story and the hub's
 * full list, so a reader who lands on one story is offered the others.
 * One place to edit: add a new expenses story here and it shows up everywhere.
 */

export type ExpenseStory = {
  slug: string;
  /** The headline figure, shown big. */
  stat: string;
  /** One short line. Says who and what, in plain words. */
  hook: string;
  /** The politician the story is about, linked to their profile. */
  person?: { name: string; href: string; place: string };
  group: "roundup" | "mp" | "msp";
  /** Newer or less linked stories are shown a little more often. */
  boost?: boolean;
  /** The closest story by place, offered as "Also in your area" at the end. */
  near?: string;
};

const mp = (seat: string) => `/representatives/mps/${seat}`;
const msp = (path: string) => `/representatives/msps/${path}`;

export const EXPENSE_STORIES: ExpenseStory[] = [
  { slug: "worst-scottish-mp-expenses", stat: "£10,000", hook: "An unnamed consultant, and the rest of the standout Scottish MP expenses", group: "roundup" },
  { slug: "scottish-mp-msp-expenses-what-it-could-buy", stat: "£6.64m", hook: "A year of MP and MSP expenses. More than three cities spend on Crisis Grants", group: "roundup", boost: true },
  { slug: "scottish-mps-london-homes-152-sitting-days", stat: "£2.91m", hook: "To house and fly 55 Scottish MPs to London for 152 sitting days", group: "roundup" },
  { slug: "scottish-mps-flights-climate-expenses", stat: "£868,378", hook: "On Scottish MPs' London flights. 85% of their travel money went on planes", group: "roundup", boost: true },
  { slug: "scottish-mp-expenses-and-freebies-investigation", stat: "£205,242", hook: "From donors, plus the F1 tickets and Qatar trips Scottish MPs declared", group: "roundup", boost: true },
  { slug: "scottish-mps-tv-licence-expenses", stat: "£10,754", hook: "TV licences billed by 29 Scottish MPs", group: "roundup" },
  { slug: "energy-minister-michael-shanks-flights-rutherglen", near: "zubir-ahmed-mp-london-hotels-glasgow", stat: "£11,753", hook: "The Energy Minister's London flights. His own staff took the train", group: "mp", boost: true, person: { name: "Michael Shanks", href: mp("rutherglen"), place: "Rutherglen" } },
  { slug: "zubir-ahmed-mp-london-hotels-glasgow", near: "energy-minister-michael-shanks-flights-rutherglen", stat: "£67,519", hook: "London hotels and flats. The biggest MP hotel bill in the UK", group: "mp", person: { name: "Dr Zubir Ahmed", href: mp("glasgow-south-west"), place: "Glasgow South West" } },
  { slug: "kilmarnock-mp-23437-electricity-bill", near: "zubir-ahmed-mp-london-hotels-glasgow", stat: "£23,437", hook: "One energy bill, two claims on the same day", group: "mp", person: { name: "Lillian Jones", href: mp("kilmarnock-and-loudoun"), place: "Kilmarnock" } },
  { slug: "pamela-nash-mp-furniture-expenses-motherwell", near: "energy-minister-michael-shanks-flights-rutherglen", stat: "£7,203", hook: "In the last week of the budget year, from DFS to a new carpet", group: "mp", person: { name: "Pamela Nash", href: mp("motherwell-wishaw-and-carluke"), place: "Motherwell" } },
  { slug: "euan-stainbank-mp-billboard-expenses-falkirk", near: "gregor-poynton-mp-four-tv-licences-livingston", stat: "£3,300", hook: "A year long board advertising himself. The biggest of any UK MP", group: "mp", person: { name: "Euan Stainbank", href: mp("falkirk"), place: "Falkirk" } },
  { slug: "chris-law-mp-3090-broadband-expenses-dundee", near: "graeme-downie-mp-dinner-expenses-dunfermline", stat: "£3,090", hook: "To set up home broadband. A typical claim is £90", group: "mp", person: { name: "Chris Law", href: mp("dundee-central"), place: "Dundee" } },
  { slug: "angus-macdonald-mp-speech-coach-drains-expenses", near: "torcuil-crichton-mp-coaching-expenses-western-isles", stat: "£3,000", hook: "Speech lessons, plus £546 to clean the drains at his second home", group: "mp", person: { name: "Angus MacDonald", href: mp("inverness-skye-and-west-ross-shire"), place: "Inverness and Skye" } },
  { slug: "torcuil-crichton-mp-coaching-expenses-western-isles", near: "angus-macdonald-mp-speech-coach-drains-expenses", stat: "£2,400", hook: "Coaching from a firm set up by a former IPSA worker", group: "mp", person: { name: "Torcuil Crichton", href: mp("na-h-eileanan-an-iar"), place: "Western Isles" } },
  { slug: "john-lamont-mp-iphone-expenses-borders", near: "gregor-poynton-mp-four-tv-licences-livingston", stat: "£2,346", hook: "Two iPhones in under three years", group: "mp", person: { name: "John Lamont", href: mp("berwickshire-roxburgh-and-selkirk"), place: "Borders" } },
  { slug: "graeme-downie-mp-dinner-expenses-dunfermline", near: "christine-jardine-mp-christmas-lunch-expenses", stat: "£963", hook: "One business dinner in his name, with no guest list", group: "mp", person: { name: "Graeme Downie", href: mp("dunfermline-and-dollar"), place: "Dunfermline" } },
  { slug: "gregor-poynton-mp-four-tv-licences-livingston", near: "euan-stainbank-mp-billboard-expenses-falkirk", stat: "£688", hook: "Four TV licences in 11 months. No other MP put four through in a year", group: "mp", person: { name: "Gregor Poynton", href: mp("livingston"), place: "Livingston" } },
  { slug: "christine-jardine-mp-christmas-lunch-expenses", near: "gregor-poynton-mp-four-tv-licences-livingston", stat: "£510", hook: "An office Christmas lunch and team day", group: "mp", person: { name: "Christine Jardine", href: mp("edinburgh-west"), place: "Edinburgh West" } },
  { slug: "msp-edinburgh-flats-commuter-belt", near: "christine-jardine-mp-christmas-lunch-expenses", stat: "£623,696", hook: "To rent Edinburgh flats for 36 MSPs. Some live 50 miles away", group: "msp", boost: true },
  { slug: "msp-expenses-scotland-investigation", stat: "£127,627", hook: "On MSPs' newspapers, plus the Holyrood party tally", group: "msp" },
  { slug: "meghan-gallacher-msp-low-expenses", near: "pamela-nash-mp-furniture-expenses-motherwell", stat: "£15,764", hook: "Less than half the typical MSP, and £0 on travel in four years", group: "msp", boost: true, person: { name: "Meghan Gallacher", href: msp("regions/central-scotland-and-lothians-west/meghan-gallacher"), place: "Central Scotland" } },
];

export const EXPENSE_STORY_SLUGS = new Set(EXPENSE_STORIES.map((s) => s.slug));

/**
 * The stories to offer on one page. Each page gets a different mix, so links
 * spread across the whole series instead of piling onto the same few. Three
 * slots always go to newer or less linked stories.
 */
export function pickExpenseStories(currentSlug: string, count = 5, skip: string[] = []): ExpenseStory[] {
  const mix = (other: string) => {
    let h = 7;
    for (const ch of currentSlug + "|" + other) h = (h * 33 + ch.charCodeAt(0)) | 0;
    return h;
  };
  const others = EXPENSE_STORIES.filter((s) => s.slug !== currentSlug && !skip.includes(s.slug)).sort(
    (a, b) => mix(a.slug) - mix(b.slug),
  );
  const boosted = others.filter((s) => s.boost).slice(0, 3);
  const rest = others.filter((s) => !boosted.includes(s));
  return [...boosted, ...rest].slice(0, count);
}

export function getExpenseStory(slug: string): ExpenseStory | undefined {
  return EXPENSE_STORIES.find((s) => s.slug === slug);
}

/** The closest other story by place, for local stories only. */
export function nearExpenseStory(slug: string): ExpenseStory | undefined {
  return getExpenseStory(getExpenseStory(slug)?.near ?? "");
}
