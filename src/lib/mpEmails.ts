import type { MpInterestRecord } from "@/lib/data/mpInterests";
import { voteSubstance } from "@/lib/voteExplainers";

/** One ready written email a constituent can pick from a list. */
export type EmailIssue = {
  id: string;
  /** Short label for the dropdown. */
  label: string;
  subject: string;
  body: string;
};

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

/** MPs' basic salary by IPSA year, from IPSA's pay decisions. */
const MP_SALARY: Record<string, string> = {
  "2024/25": "£91,346",
  "2025/26": "£93,904",
  "2026/27": "£98,599",
};
const salaryFor = (year: string) => MP_SALARY[year] ?? "MP";

const SIGN_OFF = `Yours sincerely,\n[Your name]\n[Your address and postcode]`;

type Vote = { date: string; title: string; vote: string };

/**
 * The emails offered on an MP's page. Every figure comes from the same data
 * the page shows, so the email never says anything the reader cannot see.
 */
export function buildMpEmailIssues({
  name,
  constituency,
  povertyCount,
  povertyRate,
  povertyYear,
  interests,
  votes,
}: {
  name: string;
  constituency: string;
  povertyCount: number;
  povertyRate: number;
  povertyYear: string;
  interests?: MpInterestRecord;
  votes: Vote[];
}): EmailIssue[] {
  const hello = `Dear ${name},\n\nI live in ${constituency} and I am writing to you as my MP.`;
  const issues: EmailIssue[] = [];

  issues.push({
    id: "child-poverty",
    label: `Child poverty in ${constituency}`,
    subject: `Child poverty in ${constituency}`,
    body: `${hello}\n\nAn estimated ${povertyCount.toLocaleString("en-GB")} children in ${constituency} (${povertyRate}%) were living in poverty after housing costs in ${povertyYear}.\n\nWhat will you do in Parliament to bring that number down, and what do you expect it to be in five years?\n\n${SIGN_OFF}`,
  });

  const exp = interests?.expenses;
  if (exp) {
    const items: string[] = [];
    if (exp.secondHomeRent > 0) items.push(`${money.format(exp.secondHomeRent)} for second home rent`);
    if (exp.secondHomeCouncilTax > 0)
      items.push(`${money.format(exp.secondHomeCouncilTax)} for second home council tax`);
    if (exp.secondHomeUtilities > 0)
      items.push(`${money.format(exp.secondHomeUtilities)} for second home energy bills`);
    if (exp.londonHotels > 0) items.push(`${money.format(exp.londonHotels)} for hotels`);
    if (exp.taxis > 0) items.push(`${money.format(exp.taxis)} for taxis`);
    if (exp.dependantTravel > 0) items.push(`${money.format(exp.dependantTravel)} for family travel`);
    issues.push({
      id: "expenses",
      label: "Your expenses",
      subject: `Your ${exp.year} expenses`,
      body: `${hello}\n\nIPSA's records show you claimed ${money.format(exp.nonStaffSpend)} in ${exp.year} on top of your ${salaryFor(exp.year)} salary, not counting staff wages.${items.length ? ` That included ${items.join(", ")}.` : ""}\n\nMost people pay for their own rent, bills and travel out of their wages. Why should taxpayers pay for yours on top of your salary? And will you commit to cutting these claims?\n\n${SIGN_OFF}`,
    });
  }

  if (interests && interests.totalFinancialValue > 0) {
    const parts: string[] = [];
    if (interests.donationsTotal > 0) parts.push(`${money.format(interests.donationsTotal)} in donations`);
    if (interests.visitsTotal > 0) parts.push(`${money.format(interests.visitsTotal)} in paid trips abroad`);
    if (interests.giftsTotal > 0) parts.push(`${money.format(interests.giftsTotal)} in gifts and free tickets`);
    issues.push({
      id: "donations",
      label: "Your donations, gifts and free trips",
      subject: "Your donations, gifts and free trips",
      body: `${hello}\n\nThe Register of Members' Financial Interests shows you have declared ${parts.join(", ")}.\n\nWhy did you accept these, and how do you make sure they never affect how you vote?\n\n${SIGN_OFF}`,
    });
  }

  const latest = [...votes]
    .sort((a, b) => b.date.localeCompare(a.date))
    .find((v) => voteSubstance(v.title));
  if (latest) {
    const sub = voteSubstance(latest.title)!;
    const how = /^(aye|yes|for)$/i.test(latest.vote)
      ? "voted yes"
      : /^(no|against)$/i.test(latest.vote)
        ? "voted no"
        : `were recorded as "${latest.vote}"`;
    const when = new Date(latest.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    issues.push({
      id: "latest-vote",
      label: `Your vote on: ${sub.title}`,
      subject: `Your vote on ${sub.title}`,
      body: `${hello}\n\nOn ${when} you ${how} on "${latest.title}" (${sub.title}).\n\nPlease could you explain why you voted that way, and what it means for people in ${constituency}?\n\n${SIGN_OFF}`,
    });
  }

  issues.push({
    id: "own-words",
    label: "Something else (write your own)",
    subject: `A question from a constituent in ${constituency}`,
    body: `${hello}\n\n[Write your question here]\n\n${SIGN_OFF}`,
  });

  return issues;
}
