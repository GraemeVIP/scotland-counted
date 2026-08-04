/**
 * The guess-the-number quiz.
 *
 * Every question here is a figure already published elsewhere on this site with
 * a link to the publisher, nothing is invented for effect, and nothing appears
 * here that is not defensible on the page it comes from. The shock is meant to
 * come from the gap between what people assume and what is true, not from
 * dressing a number up.
 *
 * Rules the questions follow:
 *  - Three options. More than that is work, and this has to be fast on a phone.
 *  - The wrong options are plausible, not silly. A giveaway teaches nothing.
 *  - Every reveal says what the number means for a person, not just what it is.
 *  - `href` points at the page where the same figure is shown with its source.
 */

export type QuizQuestion = {
  id: string;
  /** Short label for the progress row. */
  tag: string;
  question: string;
  options: string[];
  /** Index into options. */
  answer: number;
  /** The figure, made large on reveal. */
  headline: string;
  /** What it means. One or two sentences, plain. */
  reveal: string;
  /** Where the same figure is shown with its source. */
  href: string;
  hrefLabel: string;
};

export const quiz: QuizQuestion[] = [
  {
    id: "glasgow-children",
    tag: "Glasgow",
    question: "How many of Glasgow's children are growing up in poverty?",
    options: ["About 1 in 10", "About 1 in 5", "More than 1 in 3"],
    answer: 2,
    headline: "36.1%",
    reveal:
      "More than one in three. It is the worst rate in Scotland, and ten years ago it was 27.1%, the biggest rise of any council area in the country.",
    href: "/indicators/glasgow-child-poverty",
    hrefLabel: "See the ten-year chart",
  },
  {
    id: "working-families",
    tag: "Work",
    question: "Of the children in poverty in Scotland, how many live with someone who works?",
    options: ["About 1 in 4", "About half", "About 3 in 4"],
    answer: 2,
    headline: "3 in 4",
    reveal:
      "Three in four. Poverty is mostly not about worklessness. It is about what is left after rent, childcare and bills. This is why 'get a job' is not an answer.",
    href: "/solutions-to-poverty-in-scotland",
    hrefLabel: "See what would actually help",
  },
  {
    id: "legal-targets",
    tag: "The law",
    question:
      "Scotland put four child poverty targets into law for 2023/24. How many were met?",
    options: ["All four", "Two of the four", "None of them"],
    answer: 2,
    headline: "0 of 4",
    reveal:
      "Every one was missed. The widest miss was persistent poverty: 23% against a target below 8%. Ministers have confirmed there is no penalty for missing them.",
    href: "/who-is-responsible-for-poverty-in-scotland",
    hrefLabel: "See the record",
  },
  {
    id: "take-home",
    tag: "Wages",
    question:
      "Full-time on the legal minimum wage in Scotland. What reaches your account each month?",
    options: ["About £2,400", "About £2,050", "About £1,780"],
    answer: 2,
    headline: "£1,784",
    reveal:
      "£24,785 a year before tax becomes about £1,784 a month after Scottish income tax and National Insurance. Average rent on a Glasgow two-bedroom flat is about £865 of that.",
    href: "/take-home-pay-calculator-scotland",
    hrefLabel: "Work out your own",
  },
  {
    id: "water",
    tag: "Bills",
    question:
      "In Scotland, water charges arrive on your council tax bill. At Band A, how much a year?",
    options: ["Nothing, it is included", "About £180", "About £435"],
    answer: 2,
    headline: "£435",
    reveal:
      "About £435 a year at Band A, before the council tax itself. Most council tax figures published online leave the water out, which is why other sites show you a smaller number than you actually pay.",
    href: "/council-tax-bands-scotland",
    hrefLabel: "Check your own band",
  },
  {
    id: "pandemic",
    tag: "Proof",
    question:
      "During the pandemic, Universal Credit went up £20 a week. What happened to child poverty in Glasgow?",
    options: ["It kept rising", "It stayed flat", "It fell, then rose when the money stopped"],
    answer: 2,
    headline: "32.2% → 29.4% → 32.0%",
    reveal:
      "It fell for the first time in a decade, then went straight back up when the £20 was withdrawn. This is the closest thing to proof that the level of poverty is a choice, not weather.",
    href: "/who-is-responsible-for-poverty-in-scotland",
    hrefLabel: "See what changed it",
  },
];

/** Shown on the end screen, keyed by how many were right. */
export function scoreVerdict(correct: number, total: number) {
  const share = correct / total;
  if (share >= 0.8) {
    return {
      title: "You already knew",
      body: "You are unusual. Most people guess far lower on nearly every one of these. Which raises the harder question: if the facts are this well known to you, why has so little changed?",
    };
  }
  if (share >= 0.4) {
    return {
      title: "Roughly where most people are",
      body: "Most people underestimate these figures, and almost nobody is told them plainly. That is not your fault, but it is the reason so little pressure ever reaches the people who decide.",
    };
  }
  return {
    title: "Almost nobody gets these right",
    body: "That is the point. These are published, official figures about the country you live in, and they are nowhere near what most people assume. Being surprised is the normal response.",
  };
}
