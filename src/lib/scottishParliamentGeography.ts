/**
 * Canonicalise only known, documented naming differences between the public
 * postcode directory and Scottish Parliament Open Data.
 *
 * This is deliberately not fuzzy matching. A new or misspelled area must fail
 * clearly rather than risk returning the wrong eight MSPs.
 */
const HOLYROOD_NAME_ALIASES = new Map([
  ["central scotland and lothians west", "central scot and lothians west"],
]);

const HOLYROOD_PUBLIC_LABELS = new Map([
  ["central scot and lothians west", "Central Scotland and Lothians West"],
]);

function normaliseHolyroodGeographyName(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en-GB");
}

export function canonicalHolyroodGeographyName(value: string) {
  const normalised = normaliseHolyroodGeographyName(value);

  return HOLYROOD_NAME_ALIASES.get(normalised) ?? normalised;
}

/**
 * Expand known upstream abbreviations before a geography name reaches a page,
 * generated snapshot or reader-facing representative record.
 */
export function publicHolyroodGeographyName(value: string) {
  const normalised = normaliseHolyroodGeographyName(value);
  return HOLYROOD_PUBLIC_LABELS.get(normalised) ?? value.trim().replace(/\s+/g, " ");
}
