/** A single recorded parliamentary vote, kept small enough for static pages. */
export type VoteRecord = {
  date: string;
  title: string;
  vote: string;
  result?: string;
  reference?: string;
  sourceUrl: string;
};

export function formatVoteDate(value: string, locale = "en-GB") {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date(value));
}
