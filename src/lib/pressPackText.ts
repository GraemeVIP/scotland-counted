/**
 * The press pack shape, and the pasteable version of one.
 *
 * Deliberately free of data imports, so a client component can render a pack
 * without dragging the benchmarking dataset along with it. That is not
 * hypothetical: the first version serialised both the packs and their rendered
 * text into the page, Next prefetched the result from every page that links to
 * /press, and three unrelated pages gained about 148kB. The budget check
 * caught it. Now the text is built where it is needed, from the pack.
 */

export type PressFact = {
  /** The sentence, already complete. */
  text: string;
  /** Where it came from. Never blank: a fact without one is not emitted. */
  source: string;
};

export type PressPack = {
  councilName: string;
  slug: string;
  headline: string;
  standfirst: string;
  facts: PressFact[];
  /** Caveats that must travel with the figures. */
  notes: string[];
  boilerplate: string;
  citation: string;
  dataFile: string;
  pageUrl: string;
  contactUrl: string;
};

/** The whole pack as something a journalist can paste into a document. */
export function pressPackText(pack: PressPack): string {
  const lines = [
    pack.headline,
    "",
    pack.standfirst,
    "",
    "FIGURES",
    ...pack.facts.map((f) => `- ${f.text} (${f.source})`),
  ];

  if (pack.notes.length) {
    lines.push("", "NOTES TO EDITORS", ...pack.notes.map((n) => `- ${n}`));
  }

  lines.push(
    "",
    "ABOUT",
    pack.boilerplate,
    "",
    `Full record: ${pack.pageUrl}`,
    `Underlying data: ${pack.dataFile}`,
    `Cite as: ${pack.citation}`,
    `Questions and corrections: ${pack.contactUrl}`,
  );

  return lines.join("\n");
}
