import Link from "next/link";
import { COUNCIL_SEARCH_NAMES } from "@/lib/routeMap";
import { COUNCIL_FAMILY_GROUP, FAMILY_GROUP_MEMBERS } from "@/lib/data/familyGroups";

const name = (slug: string) => COUNCIL_SEARCH_NAMES[slug] ?? slug;
export const compareHref = (a: string, b?: string) => (b ? `/compare-areas?a=${a}&b=${b}` : `/compare-areas?a=${a}`);

/** The pairings people search for most, used wherever no single area is in view. */
export const POPULAR_PAIRS: Array<[string, string]> = [
  ["glasgow-city", "city-of-edinburgh"],
  ["aberdeen-city", "dundee-city"],
  ["fife", "city-of-edinburgh"],
  ["glasgow-city", "east-renfrewshire"],
  ["highland", "aberdeenshire"],
  ["north-lanarkshire", "south-lanarkshire"],
];

/**
 * Up to four areas worth comparing with this one: the two big cities, then
 * councils the Improvement Service groups with it as similar in deprivation.
 */
function suggestionsFor(slug: string) {
  const group = COUNCIL_FAMILY_GROUP[slug]?.deprivation;
  const similar = group ? (FAMILY_GROUP_MEMBERS.deprivation[group] ?? []) : [];
  const picks = ["city-of-edinburgh", "glasgow-city", ...similar].filter((s, i, all) => s !== slug && all.indexOf(s) === i);
  return picks.slice(0, 4);
}

const Arrow = () => (
  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
    →
  </span>
);

/**
 * A pointer to the compare tool, for the pages people reach it from: every
 * council area page, the area list, and the poverty, crime, health and
 * council tax pages. With an area it offers ready made pairings for that
 * area; without one it offers the most popular pairings.
 */
export default function ComparePromo({ slug, className = "" }: { slug?: string; className?: string }) {
  const pairs: Array<[string, string]> = slug ? suggestionsFor(slug).map((other) => [slug, other]) : POPULAR_PAIRS.slice(0, 4);
  return (
    <aside className={`tile relative overflow-hidden p-6 sm:p-8 ${className}`} aria-labelledby="compare-promo-title">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[linear-gradient(180deg,var(--brand),var(--hub-area))]" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="kicker text-[var(--brand)]">Compare areas</p>
          <h2 id="compare-promo-title" className="display-stat mt-2 text-[clamp(24px,2.8vw,34px)] leading-[1.12]">
            {slug ? `How does ${name(slug)} compare?` : "How does your area compare?"}
          </h2>
          <p className="mt-2.5 max-w-[56ch] text-[16.5px] leading-[1.55] text-[var(--ink-2)]">
            Put any two council areas side by side: pay, house prices, rent, crime, poverty, health and schools, in plain
            words with the official figures.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {pairs.map(([x, y]) => (
              <li key={`${x}-${y}`}>
                <Link
                  href={compareHref(x, y)}
                  className="group ui inline-flex items-center gap-2 rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] px-3.5 py-2 text-[15px] font-[600] text-[var(--ink)] no-underline hover:border-[var(--brand)]"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand)]" aria-hidden="true" />
                  {name(x)}
                  <span className="font-[500] text-[var(--muted)]">vs</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--hub-area)]" aria-hidden="true" />
                  {name(y)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href={slug ? compareHref(slug) : "/compare-areas"} className="btn btn-primary group justify-center max-lg:self-start">
          {slug ? `Compare ${name(slug)}` : "Compare two areas"} <Arrow />
        </Link>
      </div>
    </aside>
  );
}
