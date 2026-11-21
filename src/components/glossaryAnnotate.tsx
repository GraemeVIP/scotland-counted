import { cloneElement, isValidElement, type ComponentType, type ReactElement, type ReactNode } from "react";
import { getTerm } from "@/lib/data/glossary";

/*
 * Shared by the browser and the server. Glossary.tsx is a client file, so a
 * server page cannot run its code directly. Pages built on the server use
 * ExplainServer.tsx, which calls the same annotateNode below with the whole
 * page tree in hand. Browser components keep using ExplainText as before.
 */
type TermComponent = ComponentType<{ t: string; children: ReactNode }>;

/*
 * The site has two audiences: a reader who needs the short answer and a
 * reader who wants to check the method.  The short answer should still be
 * available when a post uses a technical word without an author remembering
 * to add a manual <G>.  This list deliberately contains terms that benefit
 * from help; ordinary words and proper names are left alone.
 */
const AUTO_GLOSSARY_IDS = [
  "wordpress",
  "lorem-ipsum",
  "page-builder",
  "find-and-replace",
  "ahc",
  "pp",
  "relative-poverty",
  "scp",
  "claimant",
  "claimant-count",
  "uc",
  "aps",
  "simd",
  "median",
  "constituency",
  "ward",
  "interim",
  "equivalised",
  "real-terms",
  "workres",
  "jobs-density",
  "freeze",
  "tcl",
  "lha",
  "lha-acronym",
  "dhp",
  "persistent",
  "saleleaseback",
  "reserved",
  "devolved",
  "dwp",
  "ons",
  "hmrc",
  "ofgem",
  "obr",
  "nao",
  "minimum-income-standard",
  "living-wage",
  "in-work-poverty",
  "work-allowance",
  "taper",
  "health-element",
  "absolute-poverty",
  "inflation",
  "eligible",
  "eligibility",
  "entitlement",
  "discretionary",
  "gross-pay",
  "net-pay",
  "national-insurance",
  "paye",
  "ashe",
  "housing-element",
  "benefit-cap",
  "bedroom-tax",
  "standing-charge",
  "kilowatt-hour",
  "kwh",
  "price-cap",
  "tax-code",
  "salary-sacrifice",
  "relief-at-source",
  "net-earnings",
  "gross-salary",
  "material-deprivation",
  "fiscal-drag",
  "settlement",
  "forecast",
  "allocation",
  "underspend",
  "estimate",
  "outcome",
  "milestone",
  "division",
  "motion",
  "qualifying",
  "means-tested",
  "arrears",
  "tariff",
  "council-tax-reduction",
  "water-charges-reduction",
  "benchmark",
  "budget-gap",
  "shortfall",
  "projected",
  "outturn",
  "reserves",
  "overspend",
  "best-value",
  "transformation",
  "service-target",
  "funding-allocation",
  "provisional",
  "capital-programme",
  "revenue-budget",
  "regulator",
  "audit-finding",
  "independent-scrutiny",
  "commitment",
  "medium-term-financial-plan",
  "performance-framework",
  "service-level",
  "accountability",
  "scrutiny",
  "statutory",
  "denominator",
  "statutory-duty",
  "systemic-failure",
  "strategic-plan",
  "financial-outlook",
  "service-reform",
  "capital-plan",
  "general-fund",
  "cumulative",
  "like-for-like",
  "primary-source",
  "embezzlement",
  "embezzled",
  "ring-fenced",
  "earmarked",
  "cashflow",
  "arrest",
  "arrested",
  "charged",
  "conviction",
  "convicted",
  "warrant",
  "prosecution",
  "prosecutors",
  "prosecution-report",
  "indictment",
  "guilty-plea",
  "qualified-audit-opinion",
  "proceeds-of-crime",
  "crown-counsel",
  "copfs",
  "fiduciary-duty",
  "section-30-order",
  "net-assets",
  "net-liabilities",
  "working-capital",
  "auditor",
  "deficit",
  "surplus",
  "liabilities",
  "remanded",
  "allegation",
  "contempt-of-court",
  "ipsa",
  "register-of-interests",
  "register-of-financial-interests",
  "register-of-members-financial-interests",
  "second-reading",
  "third-reading",
  "reasoned-amendment",
  "report-stage",
  "new-clause",
  "lords-amendment",
  "opposition-day",
  "programme-motion",
  "closure-motion",
  "lobbying",
  "lobbyist",
  "lobbyists",
  "hospitality",
  "in-kind",
  "shareholding",
  "shareholdings",
  "windfall-tax",
  "inheritance-tax",
  "second-home",
  "second-homes",
  "non-staff-expenses",
  "non-staff",
  "dependant-travel",
  "by-election",
  "think-tank",
  "think-tanks",
  "lobby-group",
  "lobby-groups",
  "carbon-budget",
  "carbon-budgets",
  "net-zero",
  "companies-house",
  "two-child-benefit-cap",
  "media-training",
  "pr",
  "factor-fees",
  "crisis-grant",
  "warm-home-discount",
  "winter-heating-payment",
] as const;

const autoTerms = AUTO_GLOSSARY_IDS.flatMap((id) => {
  const term = getTerm(id);
  return term ? [term] : [];
}).sort((a, b) => b.term.length - a.term.length);

/** Terms that double as surnames, so a capitalised match is a name, not the term. */
const LOWER_CASE_ONLY = new Set(["ward"]);

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const termPatternSource = (value: string) => escapeRegex(value).replace(/\s+/g, "[\\s-]+");
export const normaliseTermText = (value: string) => value.toLowerCase().replace(/[\s-]+/g, " ").trim();
const autoTermPattern = autoTerms.length
  ? new RegExp(`\\b(${autoTerms.map((term) => termPatternSource(term.term)).join("|")})\\b`, "gi")
  : null;

/*
 * A term is a button, and browsers will start a new line right beside a
 * button even where they never would in plain text. That stranded the
 * opening quote of “after housing costs” at the end of one line, with the
 * words starting the next. So anything touching a term with no space
 * between, such as quote marks, brackets or a comma, is kept with it.
 */
function annotateString(value: string, keyPrefix: string, G: TermComponent): ReactNode {
  if (!autoTermPattern || !value.trim()) return value;

  // One capture group, so the parts alternate: text, term, text, … text.
  const parts = value.split(autoTermPattern);
  const out: ReactNode[] = [];
  let text = parts[0];
  for (let index = 1; index < parts.length; index += 2) {
    const part = parts[index];
    const after = parts[index + 1] ?? "";
    const found = autoTerms.find((candidate) => normaliseTermText(candidate.term) === normaliseTermText(part));
    // Some terms are also surnames ("Melanie Ward"). Only explain those in lower case.
    // Acronyms like ONS or DWP only count in capitals, so "add ons" is left alone.
    const isAcronym = found ? /^[A-Z0-9]{2,6}$/.test(found.term) : false;
    const term =
      found &&
      ((LOWER_CASE_ONLY.has(found.id) && /^[A-Z]/.test(part)) ||
        (isAcronym && part !== part.toUpperCase()))
        ? undefined
        : found;
    if (!term) {
      text += part + after;
      continue;
    }
    const lead = /\S*$/.exec(text)![0];
    const trail = /^\S*/.exec(after)![0];
    if (text.length > lead.length) out.push(text.slice(0, text.length - lead.length));
    const button = (
      <G key={`${keyPrefix}-${term.id}-${index}`} t={term.id}>
        {part}
      </G>
    );
    out.push(
      lead || trail ? (
        <span key={`${keyPrefix}-word-${index}`} className="gl-word">
          {lead}
          {button}
          {trail}
        </span>
      ) : (
        button
      ),
    );
    text = after.slice(trail.length);
  }
  if (text) out.push(text);
  return out;
}

export function annotateNode(node: ReactNode, keyPrefix: string, G: TermComponent): ReactNode {
  if (typeof node === "string") return annotateString(node, keyPrefix, G);
  if (Array.isArray(node)) {
    return node.map((child, index) => {
      const annotated = annotateNode(child, `${keyPrefix}-${index}`, G);
      // ExplainText often receives several JSX children as an array. Keep
      // those children keyed after annotation so React does not warn (or
      // discard useful identity during client updates).
      return isValidElement(annotated)
        ? cloneElement(annotated, { key: annotated.key ?? `${keyPrefix}-${index}` })
        : annotated;
    });
  }
  if (!isValidElement(node)) return node;

  const element = node as ReactElement<{
    children?: ReactNode;
    href?: string;
    role?: string;
    onClick?: unknown;
    "aria-hidden"?: boolean | "true";
  }>;
  const props = element.props;
  // Never put a button inside a link or another button. Existing glossary
  // terms are already explained, so wrapping them again would be noisy.
  if (
    element.type === G ||
    [
      "a",
      "button",
      "label",
      "select",
      "option",
      "textarea",
      "input",
      "code",
      "pre",
      "script",
      "style",
      "svg",
      "summary",
    ].includes(String(element.type)) ||
    typeof props.href === "string" ||
    typeof props.onClick === "function" ||
    props.role === "button" ||
    props.role === "option" ||
    props["aria-hidden"] === true ||
    props["aria-hidden"] === "true" ||
    ["h1", "h2", "h3", "h4", "h5", "h6"].includes(String(element.type))
  ) {
    return node;
  }
  if (!("children" in props)) return node;

  return cloneElement(element, {
    children: annotateNode(props.children, keyPrefix, G),
  });
}

