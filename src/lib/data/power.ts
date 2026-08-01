/**
 * The case for actually sending the email.
 *
 * This is the argument the site was missing. Everything here is a documented
 * fact about how the system works, or a published figure. We do not claim a
 * number of emails guarantees an outcome, and we do not invent response rates:
 * an accountability site that makes numbers up has nothing left to stand on.
 *
 * Where something is a convention rather than a rule, it says so.
 */

/** What the people you are writing to are paid, from the bodies that set it. */
export const pay = {
  mp: {
    amount: "£98,599",
    role: "Your MP",
    note: "Basic salary from 1 April 2026, before expenses and before any extra paid for other roles.",
    extra: "The body that sets it has said it intends to reach around £110,000 by the end of this parliament.",
    sourceId: "ipsa-pay",
  },
  msp: {
    amount: "£77,711",
    role: "Your MSP",
    note: "Basic salary from 1 April 2026, before expenses and before any extra paid for other roles.",
    sourceId: "msp-pay",
  },
} as const;

/**
 * What actually happens after you press send. Each step is something the
 * system does, not something we hope for.
 */
export const whatHappens: Array<{
  step: string;
  title: string;
  body: string;
  detail?: string;
}> = [
  {
    step: "1",
    title: "It gets logged",
    body: "Your email arrives at their office and goes on the record. Staff sort the post by subject, so what people are writing about gets counted.",
    detail:
      "Every MP and MSP office keeps a record of constituent correspondence. That record is how an office knows what its area is worried about.",
  },
  {
    step: "2",
    title: "They should write back",
    body: "You live in their area, so they deal with your case. It can take a few weeks, and the reply is sometimes a standard letter. That is still a reply, and it is still on paper.",
    detail:
      "Answering constituents is a long-standing expectation of the job rather than a law. What it means in practice is that ignoring a constituent is a choice an office has to make deliberately.",
  },
  {
    step: "3",
    title: "You now have something to check",
    body: "Both emails ask what they will do, and what they expect your area's figure to be in five years. Once they have answered, you can hold them to it.",
    detail:
      "This is the part that matters most. A promise with a number and a date attached can be checked later. A promise without one cannot.",
  },
  {
    step: "4",
    title: "Enough letters change what gets raised",
    body: "One email is a person. A hundred emails from the same place is a problem an office has to manage. Subjects that fill the postbag are the subjects that get raised.",
    detail:
      "I are not going to pretend there is a magic number. What is true is that offices prioritise by volume, because that is the only signal they have about what their area cares about.",
  },
];

/**
 * The bit almost nobody knows: an MP can force a written answer from a
 * government minister, and it is published permanently.
 */
export const paperTrail = {
  title: "Your MP can make a minister answer in writing",
  plain:
    "An MP can put a formal written question to the government. A minister has to answer it, and both the question and the answer are published where anyone can read them, forever.",
  convention:
    "The expectation is an answer within about seven days. That is a long-standing convention rather than a hard rule.",
  why: "This is what a paper trail means. It is not a phone call nobody remembers. It is a permanent public record with a date on it.",
  sourceIds: ["written-questions", "hansard"],
};

/** The friction this site removes, stated plainly. */
export const friction: Array<{ before: string; now: string }> = [
  {
    before: "Work out who your MP even is",
    now: "I find them from your postcode, or straight from your area's page",
  },
  {
    before: "Find an email address that works",
    now: "I take it from the official parliamentary records",
  },
  {
    before: "Find figures for your own area",
    now: "Already in the email, with the source",
  },
  {
    before: "Work out what to ask for, and who can actually do it",
    now: "Each email only asks for things that person controls",
  },
  {
    before: "Write the thing",
    now: "Written. You read it and press send",
  },
];
