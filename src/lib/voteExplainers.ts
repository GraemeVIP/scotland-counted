/**
 * Plain-English explainers for parliamentary votes.
 *
 * Written at a tabloid reading level: short sentences, everyday words, zero
 * parliamentary or legal jargon. If a reader cannot tell in five seconds what
 * the vote was about and what their MP did, the copy is too complicated.
 */

export type VoteExplainer = {
  /** The kind of vote, as a short label. */
  kind: string;
  /** What it was, and what voting yes meant here. Short sentences. */
  plain: string;
};

type Rule = { pattern: RegExp; explain: VoteExplainer };

const RULES: Rule[] = [
  {
    pattern: /reasoned amendment/i,
    explain: {
      kind: "A vote to block a new law",
      plain:
        "Some MPs tried to stop this law early. Voting yes meant blocking it. Voting no meant letting it carry on.",
    },
  },
  {
    pattern: /second reading/i,
    explain: {
      kind: "First big vote on a new law",
      plain:
        "The first yes or no vote on a new law. Voting yes meant letting it move forward. Voting no meant trying to stop it.",
    },
  },
  {
    pattern: /third reading/i,
    explain: {
      kind: "Final vote on a new law",
      plain:
        "The final vote before the law left this part of Parliament. Voting yes meant passing it.",
    },
  },
  {
    pattern: /lords amendment/i,
    explain: {
      kind: "A change asked for by the Lords",
      plain:
        "The House of Lords asked to change this law. MPs voted on whether to agree to that change.",
    },
  },
  {
    pattern: /new clause/i,
    explain: {
      kind: "A vote to add a new section",
      plain:
        "A vote on adding a new part to a law while MPs checked it line by line. Voting yes meant adding it.",
    },
  },
  {
    pattern: /report stage|(^|\W)amendment \d+/i,
    explain: {
      kind: "A vote to change part of a law",
      plain:
        "A vote on changing one part of a new law before it was finished. Voting yes meant making the change.",
    },
  },
  {
    pattern: /opposition day/i,
    explain: {
      kind: "An opposition debate",
      plain:
        "A debate picked by the opposition parties. This vote does not change any law by itself, but it puts every MP on the record.",
    },
  },
  {
    pattern: /programme motion|allocation of time|carry-over|closure motion/i,
    explain: {
      kind: "A vote about debate time",
      plain:
        "A vote about how much time MPs get to talk about a law, not about the law itself.",
    },
  },
  {
    pattern: /money resolution|ways and means/i,
    explain: {
      kind: "Permission to spend money",
      plain: "A vote to let a new law spend public money.",
    },
  },
  {
    pattern: /(^draft |\b(regulations|order)\s+20\d\d|code of practice)/i,
    explain: {
      kind: "Detailed rules, not a new law",
      plain:
        "A vote on switching on new rules under a law that already exists. Voting yes meant the rules start.",
    },
  },
  {
    pattern: /stage 1/i,
    explain: {
      kind: "First big vote on a new law",
      plain:
        "The first yes or no vote on a new Scottish law. Voting yes meant letting it move forward.",
    },
  },
  {
    pattern: /stage 3/i,
    explain: {
      kind: "Final vote on a new law",
      plain: "The final vote on a new Scottish law. Voting yes meant passing it.",
    },
  },
  {
    pattern: /stage 2/i,
    explain: {
      kind: "A vote to change part of a law",
      plain:
        "A vote on changing part of a new Scottish law while MSPs checked it line by line.",
    },
  },
];

export type SubstanceEntry = {
  match: RegExp;
  what: string;
  example?: string;
  yesMeans?: string;
  noMeans?: string;
};

/**
 * Hand-checked, ultra-simple summaries of what specific bills and motions
 * actually do. Every sentence must stay at or under 32 words.
 */
export const SUBSTANCE: SubstanceEntry[] = [
  {
    match: /universal credit \(removal of two child limit\)/i,
    what: "Scraps the two child benefit cap on Universal Credit.",
    example:
      "Families with three or more kids now get benefit money for every child, not just the first two.",
    yesMeans: "Voted to scrap the two child benefit cap.",
    noMeans: "Voted against scrapping the two child benefit cap.",
  },
  {
    match: /immigration and asylum bill: reasoned amendment/i,
    what: "A vote to block the government's new asylum and deportation law before it went any further.",
    example:
      "The law makes it easier to turn down and deport asylum seekers across the whole UK, including Scotland.",
    yesMeans: "Voted to block the new asylum and deportation law.",
    noMeans: "Voted to let the new asylum and deportation law carry on.",
  },
  {
    match: /immigration and asylum bill/i,
    what: "Makes it easier to turn down and deport people asking for asylum in the UK.",
    example:
      "It cuts the right to appeal using family life rules. These border rules apply in Scotland too.",
    yesMeans: "Backed the law making it easier to refuse and deport asylum seekers.",
    noMeans: "Voted against the new asylum and deportation law.",
  },
  {
    match: /public office \(accountability\) bill/i,
    what: "Known as the Hillsborough Law. It forces police, bosses and public officials to tell the truth after disasters and cover ups.",
    example:
      "Officials who lie or hide the truth can face jail, and grieving families get their legal bills paid.",
    yesMeans: "Voted for this change to the Hillsborough Law on public cover ups.",
    noMeans: "Voted against this change to the Hillsborough Law (usually to keep the government's wording).",
  },
  {
    match: /national security \(state threats\) bill/i,
    what: "Lets the government ban groups working for hostile foreign countries, with up to 14 years in jail for helping them.",
    example:
      "This vote was about protecting journalists and aid workers so they are not treated as spies just for doing their jobs.",
    yesMeans: "Voted in favour of this change to the foreign spying and national security law.",
    noMeans: "Voted against this change to the foreign spying and national security law.",
  },
  {
    match: /taxation \(energy and vehicles\) bill/i,
    what: "Puts a bigger windfall tax on power companies (up from 45% to 55%) and raises tax free mileage pay for drivers.",
    example:
      "If you drive your own car for work, your boss can pay you more per mile tax free.",
    yesMeans: "Voted to add this tax change to the energy and driving tax bill.",
    noMeans: "Voted against adding this tax change to the energy and driving tax bill.",
  },
  {
    match: /early release of prisoners/i,
    what: "A demand from the Conservatives to stop sex offenders getting out of jail early when prisons are full.",
    example:
      "This rule covers prisons in England and Wales. Scotland has its own separate prison release rules.",
    yesMeans: "Voted with the opposition to demand sex offenders are excluded from early prison release.",
    noMeans: "Voted against the opposition demand on early prison release.",
  },
  {
    match: /permissible means of voting|electronic and workplace ballots/i,
    what: "Lets workers vote on strikes online or at work instead of only by post.",
    example:
      "A nurse or rail worker can now vote in a union ballot on their phone instead of posting a paper form.",
    yesMeans: "Voted to let workers vote online or at work in union strike ballots.",
    noMeans: "Voted against online and workplace voting in union ballots.",
  },
  {
    match: /access and unfair practices|right to access workplaces|time off for trade union/i,
    what: "Makes it easier for trade unions to come into workplaces, speak to staff, and get paid time off for union work.",
    example:
      "These workplace rules apply across the whole UK, so they cover bosses and workers in Scotland too.",
    yesMeans: "Voted to give trade unions stronger rights inside workplaces.",
    noMeans: "Voted against giving trade unions stronger rights inside workplaces.",
  },
  {
    match: /employment tribunal/i,
    what: "Gives workers six months instead of three to take a bad boss to a tribunal.",
    example:
      "If you are sacked unfairly, you now get twice as long to put your claim in.",
    yesMeans: "Voted to give workers six months instead of three to bring a workplace claim.",
    noMeans: "Voted against giving workers more time to bring a workplace claim.",
  },
  {
    match: /climate change act 2008 \(credit limit\)|carbon budget order/i,
    what: "Stops the UK Government buying foreign carbon credits to hit its climate targets.",
    example:
      "Pollution has to be cut here in the UK instead of paying other countries to do it.",
    yesMeans: "Voted to approve the UK's legal targets for cutting carbon emissions.",
    noMeans: "Voted against the UK's carbon emissions rule.",
  },
  {
    match: /town and country planning.*\(england\)|clean air zones.*\(england\)/i,
    what: "Changes council planning charges or clean air driving zones in England only.",
    example:
      "This does not affect Scotland because Scottish councils and Holyrood run our planning and low emission zones.",
    yesMeans: "Voted to approve these England only council planning or clean air rules.",
    noMeans: "Voted against these England only council planning or clean air rules.",
  },
  {
    match: /supply of machinery/i,
    what: "Keeps UK safety rules for work machines like cranes, diggers and lawnmowers matching Europe's rules.",
    example:
      "Means a digger or power tool that passes safety checks can still be sold in Scotland and Europe.",
    yesMeans: "Voted to keep machinery safety rules aligned.",
    noMeans: "Voted against these machinery safety rules.",
  },
  {
    match: /children.?s wellbeing and schools act/i,
    what: "Changes the rules for opening new schools in England.",
    example:
      "Does not affect Scotland at all because Scottish schools are run here in Scotland.",
    yesMeans: "Voted to approve these England only school rules.",
    noMeans: "Voted against these England only school rules.",
  },
  {
    match: /king.?s speech/i,
    what: "The big yearly vote on the Prime Minister's plan for the country.",
    example:
      "If a government loses a King's Speech vote, it usually has to quit.",
    yesMeans: "Voted for this change or motion on the government's yearly plan.",
    noMeans: "Voted against this change or motion on the government's yearly plan.",
  },
  {
    match: /northern ireland troubles bill/i,
    what: "Changes how old killings and bombings from the Northern Ireland Troubles are investigated.",
    example:
      "Scraps parts of the old government's law that shut down Troubles inquests and court cases, including cases involving former soldiers.",
    yesMeans: "Voted in favour of this part of the Northern Ireland Troubles investigation law.",
    noMeans: "Voted against this part of the Northern Ireland Troubles investigation law.",
  },
  {
    match: /representation of the people bill/i,
    what: "Changes the rules for UK elections, including lowering the voting age to 16, voter ID rules, and political donations.",
    example:
      "16 and 17 year olds in Scotland could already vote in Scottish elections. This lets them vote in UK General Elections too.",
    yesMeans: "Voted for this part of the new UK voting and elections law.",
    noMeans: "Voted against this part of the new UK voting and elections law.",
  },
  {
    match: /terminally ill adults \(end of life\) bill/i,
    what: "A vote on whether terminally ill adults with less than six months to live should have the right to assisted dying.",
    example:
      "This bill covers England and Wales. The Scottish Parliament has been voting on a separate assisted dying law for Scotland.",
    yesMeans: "Voted YES to legalising assisted dying for terminally ill adults.",
    noMeans: "Voted NO to legalising assisted dying for terminally ill adults.",
  },
  {
    match: /support for british farmers|inheritance tax/i,
    what: "A vote demanding the government scraps its new inheritance tax on family farms.",
    example:
      "Inheritance tax is set at Westminster, so the new farm tax hits farming families in Scotland too.",
    yesMeans: "Voted to tell the government to scrap the new inheritance tax on family farms.",
    noMeans: "Voted with the government to keep its new inheritance tax plans for family farms.",
  },
  {
    match: /mod bicester and illegal migrants/i,
    what: "An opposition vote attacking the government's plan to house asylum seekers at an old army site.",
    example:
      "It also demanded tougher action to stop small boats and deport people who arrive illegally.",
    yesMeans: "Voted against housing asylum seekers at the army site and called for tougher border rules.",
    noMeans: "Voted with the government to reject the opposition protest over asylum housing.",
  },
  {
    match: /windsor framework|interoperability in northern ireland|plant health.*northern ireland/i,
    what: "Updates post Brexit trade, train or farming rules for goods moving into Northern Ireland.",
    example:
      "Covers checks on food, plants, seed potatoes and trains crossing to Northern Ireland.",
    yesMeans: "Voted to approve these Northern Ireland trade and border rules.",
    noMeans: "Voted against these Northern Ireland trade and border rules.",
  },
  {
    match: /carbon border adjustment mechanism/i,
    what: "Puts a green tax on cheap foreign steel, cement and fertiliser coming into the UK from high polluting countries.",
    example:
      "Meant to stop dirty foreign factories undercutting UK businesses that have to pay green costs.",
    yesMeans: "Voted to bring in the new border tax on high polluting foreign imports.",
    noMeans: "Voted against the new border tax on foreign imports.",
  },
  {
    match: /courts and tribunals bill/i,
    what: "Changes how courts and tribunals are run to try to clear huge backlogs of cases.",
    example:
      "Most courts in Scotland are run by Scotland, except UK wide employment and benefits tribunals.",
    yesMeans: "Voted for this part of the courts and tribunals reform law.",
    noMeans: "Voted against this part of the courts and tribunals reform law.",
  },
  {
    match: /health bill/i,
    what: "Changes rules on vapes, smoking, junk food adverts and NHS powers.",
    example:
      "Scottish hospitals are run in Scotland, but UK wide bans on tobacco and vape sales cover Scotland too.",
    yesMeans: "Voted for this change to the UK Health Bill.",
    noMeans: "Voted against this change to the UK Health Bill.",
  },
  {
    match: /highways \(financing\) bill|social housing bill/i,
    what: "A vote on road funding or council housing rules in England.",
    example:
      "Roads and council housing in Scotland are run by Scottish councils and Holyrood.",
    yesMeans: "Voted to block this England only road or housing law.",
    noMeans: "Voted to let this England only road or housing law carry on.",
  },
  {
    match: /motion to sit in private|closure motion/i,
    what: "A quick vote on House of Commons timetable rules during a debate.",
    example:
      "MPs use these votes to end a debate and move straight to a vote, or to control chamber time.",
    yesMeans: "Voted yes on this parliamentary timetable move.",
    noMeans: "Voted no on this parliamentary timetable move.",
  },
  {
    match: /preventing alcohol and drug deaths/i,
    what: "A Scottish Parliament vote on funding rehab beds and treatment to cut Scotland's drug and alcohol deaths.",
    example:
      "Scotland has the highest drug death rate in Europe, and health and rehab funding is run at Holyrood.",
    yesMeans: "Backed this plan on tackling drug and alcohol deaths in Scotland.",
    noMeans: "Voted against this motion on drug and alcohol deaths.",
  },
  {
    match: /learning disabilities, autism and neurodivergence/i,
    what: "A Scottish Parliament vote on better support and shorter waiting times for people with autism, ADHD and learning disabilities.",
    example:
      "Covers Scottish schools, NHS assessment waiting lists and local care support.",
    yesMeans: "Backed the motion for stronger support on autism, ADHD and learning disabilities.",
    noMeans: "Voted against this motion on autism and learning disabilities.",
  },
  {
    match: /international climate justice/i,
    what: "A Scottish Parliament vote on spending Scottish Government money to help poorer countries deal with climate change.",
    example:
      "Covers Holyrood's overseas Climate Justice Fund.",
    yesMeans: "Backed spending Scottish Government money on the overseas Climate Justice Fund.",
    noMeans: "Voted against this motion on the overseas Climate Justice Fund.",
  },
  {
    match: /cyber resilience/i,
    what: "A Scottish Parliament vote on protecting Scottish hospitals and councils from computer hackers.",
    example:
      "Comes after hackers stole data and disrupted NHS boards and councils in Scotland.",
    yesMeans: "Backed the plan to tighten computer security across Scottish hospitals and councils.",
    noMeans: "Voted against this motion on public sector computer security.",
  },
  {
    match: /fishing industry/i,
    what: "A Scottish Parliament vote on fish quotas, sea bans and support for Scottish fishing boats.",
    example:
      "Affects coastal towns and fishing crews in the North East, Highlands and Islands.",
    yesMeans: "Backed this motion on supporting Scotland's fishing industry.",
    noMeans: "Voted against this motion on Scotland's fishing industry.",
  },
  {
    match: /prosperity and future in europe/i,
    what: "A Scottish Parliament vote calling for closer trade and travel ties between Scotland and the European Union.",
    example:
      "Covers youth travel deals, food exports and Brexit border red tape.",
    yesMeans: "Backed calling for closer ties with the European Union.",
    noMeans: "Voted against the motion calling for closer ties with the European Union.",
  },
];

/** The kind of vote, or null when no rule matches. Never guesses substance. */
export function explainVote(title: string): VoteExplainer | null {
  for (const rule of RULES) {
    if (rule.pattern.test(title)) return rule.explain;
  }
  return null;
}

/** The hand-checked story of the bill itself, when one exists. */
export function voteSubstance(
  title: string,
): { what: string; example?: string; yesMeans?: string; noMeans?: string } | null {
  for (const entry of SUBSTANCE) {
    if (entry.match.test(title)) {
      return {
        what: entry.what,
        example: entry.example,
        yesMeans: entry.yesMeans,
        noMeans: entry.noMeans,
      };
    }
  }
  return null;
}

/**
 * Infers a plain-English one-liner explaining what this member's specific vote
 * (Aye / No / Abstain) actually meant on this division.
 */
export function inferStance(title: string, vote: string): string {
  const isYes = /^(aye|yes|for)$/i.test(vote);
  const isNo = /^(no|against)$/i.test(vote);
  const sub = voteSubstance(title);

  if (/reasoned amendment/i.test(title)) {
    if (isYes) return "Voted to block this law before it went any further.";
    if (isNo) return "Voted against blocking this law, so it could carry on.";
  }

  if (isYes && sub?.yesMeans) return sub.yesMeans;
  if (isNo && sub?.noMeans) return sub.noMeans;

  if (/second reading|stage 1/i.test(title)) {
    if (isYes) return "Voted YES to let this new law move forward.";
    if (isNo) return "Voted NO to try to stop this new law.";
  }
  if (/third reading|stage 3/i.test(title)) {
    if (isYes) return "Voted YES to pass this new law.";
    if (isNo) return "Voted NO to try to stop this new law passing.";
  }
  if (/lords amendment/i.test(title)) {
    if (isYes) return "Voted to agree to the change asked for by the House of Lords.";
    if (isNo) return "Voted to turn down the change asked for by the House of Lords.";
  }
  if (/new clause|report stage|amendment \d+|stage 2/i.test(title)) {
    if (isYes) return "Voted to make this change to the law.";
    if (isNo) return "Voted against making this change to the law.";
  }
  if (/opposition day/i.test(title)) {
    if (isYes) return "Backed the opposition parties in this debate.";
    if (isNo) return "Voted with the government against the opposition parties.";
  }
  if (/programme motion|allocation of time|carry-over|closure motion/i.test(title)) {
    if (isYes) return "Voted for the government's timetable for this debate.";
    if (isNo) return "Voted against the government's timetable for this debate.";
  }
  if (/(^draft |\b(regulations|order)\s+20\d\d|code of practice)/i.test(title)) {
    if (isYes) return "Voted YES to bring these new rules in.";
    if (isNo) return "Voted NO to block these new rules.";
  }

  if (isYes) return "Voted YES to this.";
  if (isNo) return "Voted NO to this.";
  return `Recorded as: ${vote}.`;
}

/**
 * "330 Ayes, 199 Noes" (and similar) → "Passed: 330 votes to 199".
 */
export function plainResult(result: string): string {
  const m = result.match(/(\d+)\s*ayes?\s*,?\s*(\d+)\s*no(?:es)?\b/i);
  if (!m) return result;
  const ayes = parseInt(m[1], 10);
  const noes = parseInt(m[2], 10);
  if (Number.isNaN(ayes) || Number.isNaN(noes)) return result;
  return ayes > noes
    ? `Passed: ${ayes} votes to ${noes}`
    : `Did not pass: ${ayes} votes to ${noes}`;
}

/** "Aye"/"For" → "Voted yes"; "No"/"Against" → "Voted no"; otherwise as-is. */
export function plainVoteLabel(vote: string): string {
  if (/^(aye|yes|for)$/i.test(vote)) return "Voted yes";
  if (/^(no|against)$/i.test(vote)) return "Voted no";
  return vote;
}
