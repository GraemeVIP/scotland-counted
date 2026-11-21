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
        "Some MPs tried to stop this law at the first hurdle. Voting yes meant blocking it. Voting no meant letting it carry on.",
    },
  },
  {
    pattern: /second reading/i,
    explain: {
      kind: "First big vote on a new law",
      plain:
        "The first yes or no vote on a new law. Voting yes meant letting it go ahead to the next stage. Voting no meant trying to stop it.",
    },
  },
  {
    pattern: /third reading/i,
    explain: {
      kind: "Final vote on a new law",
      plain:
        "The last vote on this law in the House of Commons. Voting yes meant passing it.",
    },
  },
  {
    pattern: /lords amendment/i,
    explain: {
      kind: "A change asked for by the House of Lords",
      plain:
        "The House of Lords asked to change this law. MPs voted on whether to accept the change.",
    },
  },
  {
    pattern: /new clause/i,
    explain: {
      kind: "A vote to add a new section",
      plain:
        "A vote on adding a new section to a law. Voting yes meant adding it.",
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
      kind: "A vote called by a party not in government",
      plain:
        "Parties not in government get some days to pick the debate. This vote does not change any law by itself, but it puts every MP on the record.",
    },
  },
  {
    pattern: /programme motion|allocation of time|carry-over|closure motion/i,
    explain: {
      kind: "A vote about debate time",
      plain:
        "A vote about how much time MPs get to debate a law, not about the law itself.",
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
        "A vote to switch on detailed rules under a law that already exists. Voting yes meant the rules start.",
    },
  },
  {
    pattern: /stage 1/i,
    explain: {
      kind: "First big vote on a new law",
      plain:
        "The first yes or no vote on a new Scottish law. Voting yes meant letting it go ahead.",
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
        "A vote on changing part of a new Scottish law while MSPs went through it line by line.",
    },
  },
];

export type SubstanceEntry = {
  match: RegExp;
  /** A plain headline shown in place of Parliament's official title. */
  title: string;
  what: string;
  example?: string;
  yesMeans?: string;
  noMeans?: string;
};

/**
 * Hand-checked, plain summaries of what specific bills and motions actually
 * do. Every sentence must stay at or under 32 words. Name who called a vote
 * when it was not the government, and never say "motion" or "opposition day"
 * in reader-facing words.
 */
export const SUBSTANCE: SubstanceEntry[] = [
  {
    match: /universal credit \(removal of two child limit\)/i,
    title: "Scrapping the two child benefit cap",
    what: "Scraps the rule that stopped families getting Universal Credit for a third or later child.",
    example: "Families with three or more children now get support for every child, not just the first two.",
    yesMeans: "Voted to scrap the two child benefit cap.",
    noMeans: "Voted to keep the two child benefit cap.",
  },
  {
    match: /immigration and asylum bill: third reading/i,
    title: 'Final vote on the new asylum law',
    what: "The last Commons vote on the government's law making it easier to refuse and deport people who ask for asylum.",
    example: 'Border rules are set at Westminster, so this covers Scotland too.',
    yesMeans: 'Voted to pass the new asylum and deportation law.',
    noMeans: 'Voted against passing the new asylum and deportation law.',
  },
  {
    match: /immigration and asylum bill.*(new clause|amendment)/i,
    title: 'A change to the new asylum law',
    what: "A vote on adding a change to the government's new asylum and deportation law.",
    example: 'The law makes it easier to refuse and deport people who ask for asylum.',
    yesMeans: 'Voted to add this change to the asylum law.',
    noMeans: 'Voted against adding this change to the asylum law.',
  },
  {
    match: /budget resolution.*alcohol duty/i,
    title: 'Budget: tax on alcohol',
    what: 'Sets the tax on beer, wine, cider and spirits, as announced in the autumn Budget.',
    yesMeans: 'Voted to approve this Budget tax change.',
    noMeans: 'Voted against this Budget tax change.',
  },
  {
    match: /budget resolution.*electric vehicle charging/i,
    title: 'Budget: VAT on charging electric cars',
    what: 'Changes the VAT charged on charging electric cars, as announced in the autumn Budget.',
    yesMeans: 'Voted to approve this Budget tax change.',
    noMeans: 'Voted against this Budget tax change.',
  },
  {
    match: /budget resolution.*employment visas/i,
    title: 'Budget: fees for work visas',
    what: 'Changes the charges employers pay to bring in workers from abroad on visas.',
    yesMeans: 'Voted to approve this Budget tax change.',
    noMeans: 'Voted against this Budget tax change.',
  },
  {
    match: /budget resolution.*business asset disposal relief/i,
    title: 'Budget: tax when you sell a business',
    what: 'Changes the tax break owners get when they sell all or part of their business.',
    yesMeans: 'Voted to approve this Budget tax change.',
    noMeans: 'Voted against this Budget tax change.',
  },
  {
    match: /budget resolution.*banking surcharge/i,
    title: 'Budget: extra tax on bank profits',
    what: 'Raises the extra tax banks pay on their profits, for a limited time.',
    yesMeans: 'Voted to approve this Budget tax change.',
    noMeans: 'Voted against this Budget tax change.',
  },
  {
    match: /budget resolution.*high value council tax surcharge/i,
    title: 'Budget: extra council tax on expensive homes in England',
    what: 'Brings in an extra council tax charge on high value homes in England.',
    example: 'Scotland is making its own version at Holyrood, with new council tax bands for homes worth over £1 million.',
    yesMeans: 'Voted to approve this Budget tax change.',
    noMeans: 'Voted against this Budget tax change.',
  },
  {
    match: /budget resolution.*income tax \(default, property and savings/i,
    title: 'Budget: income tax on savings and rent',
    what: 'Sets income tax rates on money people make from savings and from renting out property.',
    yesMeans: 'Voted to approve this Budget tax change.',
    noMeans: 'Voted against this Budget tax change.',
  },
  {
    match: /budget resolution/i,
    title: 'A tax change from the Budget',
    what: 'A vote to approve one of the tax changes announced in the autumn Budget.',
    yesMeans: 'Voted to approve this Budget tax change.',
    noMeans: 'Voted against this Budget tax change.',
  },
  {
    match: /railways bill/i,
    title: 'Railways law: more time',
    what: "A vote to let the new railways law carry on into Parliament's next year, instead of starting again.",
    yesMeans: 'Voted to give the railways law more time.',
    noMeans: 'Voted against giving the railways law more time.',
  },
  {
    match: /sporting events bill/i,
    title: 'Rules for hosting big sporting events',
    what: 'A law setting up permanent rules for hosting major sporting events in the UK, including a ban on ticket touting.',
    example: 'MPs voted on changes, including a Lib Dem plan on fair ticket prices for fans.',
    yesMeans: 'Voted to make this change to the sporting events law.',
    noMeans: 'Voted against this change to the sporting events law.',
  },
  {
    match: /private rented sector database/i,
    title: 'England only: a register of private landlords',
    what: 'Sets up a national database of private landlords and rented homes in England.',
    example: 'Scotland already has its own landlord register, run by councils.',
    yesMeans: 'Voted to set up the landlord database in England.',
    noMeans: 'Voted against the landlord database in England.',
  },
  {
    match: /tenancy deposit schemes/i,
    title: "Rules for protecting renters' deposits",
    what: "Updates the rules for the schemes that keep renters' deposits safe.",
    example: 'Scotland has its own deposit protection rules.',
    yesMeans: 'Voted to approve the new deposit rules.',
    noMeans: 'Voted against the new deposit rules.',
  },
  {
    match: /opposition day: employers/i,
    title: 'Conservative call to cut employer National Insurance for young workers',
    what: 'The Conservatives called this vote. It attacked the government for raising National Insurance on employers.',
    example: "It called for employers' National Insurance on staff under 25 to be halved.",
    yesMeans: 'Voted with the Conservatives to halve employer National Insurance for under 25s.',
    noMeans: "Voted against the Conservatives' call on employer National Insurance.",
  },
  {
    match: /government amendment to opposition day debate on welfare/i,
    title: "The government's reply on welfare spending",
    what: "The government rewrote the Conservatives' welfare motion. Its version blamed the last government for rising benefit costs and backed its own welfare reforms.",
    yesMeans: "Voted for the government's version on welfare.",
    noMeans: "Voted against the government's version on welfare.",
  },
  {
    match: /opposition day: welfare/i,
    title: 'Conservative call to cut welfare spending',
    what: 'The Conservatives called this vote. It asked the government to promise to bring down benefit spending on working age people before the next election.',
    yesMeans: 'Voted with the Conservatives to cut working age welfare spending.',
    noMeans: "Voted against the Conservatives' call to cut welfare spending.",
  },
  {
    match: /opposition day: uk-eu relations/i,
    title: 'Conservative call to keep EU rules out of the UK',
    what: 'The Conservatives called this vote. It said UK taxes, product standards and migration rules should be set in the UK, not by the EU.',
    example: "It also opposed paying any extra money to the EU or subsidising EU students' university fees.",
    yesMeans: 'Voted with the Conservatives against closer EU rules.',
    noMeans: "Voted against the Conservatives' call on EU relations.",
  },
  {
    match: /government amendment to opposition day debate on rosebank/i,
    title: "The government's reply on the Rosebank oilfield",
    what: "The government rewrote the Conservatives' Rosebank motion. Its version said a legal decision on the oilfield is still pending, so ministers would not commit in advance.",
    yesMeans: "Voted for the government's version on Rosebank.",
    noMeans: "Voted against the government's version on Rosebank.",
  },
  {
    match: /opposition day: rosebank/i,
    title: 'Conservative call to approve the Rosebank oilfield',
    what: 'The Conservatives called this vote. It asked the government to approve the Rosebank oil field, west of Shetland, as soon as possible.',
    example: 'Rosebank matters for oil and gas jobs in the North East of Scotland.',
    yesMeans: 'Voted with the Conservatives to approve Rosebank.',
    noMeans: "Voted against the Conservatives' call to approve Rosebank.",
  },
  {
    match: /removal of limit on\s+compensation/i,
    title: 'No more cap on unfair dismissal payouts',
    what: 'Removes the legal limit on how much compensation workers can win for unfair dismissal, from 1 January 2027.',
    example: 'Employment law is set at Westminster, so this covers Scotland too.',
    yesMeans: 'Voted to remove the cap on unfair dismissal payouts.',
    noMeans: 'Voted against removing the cap on unfair dismissal payouts.',
  },
  {
    match: /visitor levy \(england\)/i,
    title: 'England only: an overnight tourist tax',
    what: 'Lets mayors in England charge an overnight tax on visitors staying in their area.',
    example: 'Scotland already lets councils charge a visitor levy, under a Holyrood law.',
    yesMeans: 'Voted to let English mayors charge a tourist tax.',
    noMeans: 'Voted against letting English mayors charge a tourist tax.',
  },
  {
    match: /immigration and asylum bill: reasoned amendment/i,
    title: "Trying to block the new asylum law",
    what: "A vote to stop the government's new asylum and deportation law at the first hurdle.",
    example: "The law makes it easier to refuse and deport asylum seekers across the whole UK, including Scotland.",
    yesMeans: "Voted to block the new asylum and deportation law.",
    noMeans: "Voted to let the new asylum and deportation law carry on.",
  },
  {
    match: /immigration and asylum bill/i,
    title: "New asylum and deportation law",
    what: "Makes it easier to refuse and deport people who ask for asylum in the UK.",
    example: "It limits appeals based on the right to a family life. Border rules are set at Westminster, so this covers Scotland too.",
    yesMeans: "Voted for the law making it easier to refuse and deport asylum seekers.",
    noMeans: "Voted against the new asylum and deportation law.",
  },
  {
    match: /public office \(accountability\) bill/i,
    title: "The Hillsborough Law: a duty to tell the truth",
    what: "Known as the Hillsborough Law. It makes police and public officials tell the truth after disasters, and stops cover ups.",
    example: "Officials who lie or hide the truth can face jail. Bereaved families get help with legal costs.",
    yesMeans: "Voted for this change to the Hillsborough Law.",
    noMeans: "Voted against this change to the Hillsborough Law.",
  },
  {
    match: /national security \(state threats\) bill/i,
    title: "New law against spying for hostile countries",
    what: "Lets the government ban groups that work for hostile foreign countries, with up to 14 years in jail for helping them.",
    example: "MPs voted on changes, including protections so journalists and aid workers are not treated as spies.",
    yesMeans: "Voted for this change to the national security law.",
    noMeans: "Voted against this change to the national security law.",
  },
  {
    match: /taxation \(energy and vehicles\) bill/i,
    title: "Taxes on energy firms and drivers",
    what: "A tax law covering energy company profits and the tax free mileage pay people get for using their own car for work.",
    yesMeans: "Voted to add this change to the energy and vehicle tax law.",
    noMeans: "Voted against adding this change to the energy and vehicle tax law.",
  },
  {
    match: /early release of prisoners/i,
    title: "Keeping sex offenders out of early release",
    what: "A party not in government called this vote to stop sex offenders being let out of jail early when prisons are full.",
    example: "This covers prisons in England and Wales. Scotland has its own prison release rules.",
    yesMeans: "Voted to keep sex offenders out of early release.",
    noMeans: "Voted against this call on early prison release.",
  },
  {
    match: /permissible means of voting|electronic and workplace ballots/i,
    title: "Letting workers vote on strikes online",
    what: "Lets union members vote on strikes online or at work, not only by post.",
    example: "A nurse or rail worker could vote in a union ballot on their phone instead of posting a paper form.",
    yesMeans: "Voted to let workers vote online or at work in union ballots.",
    noMeans: "Voted against online and workplace voting in union ballots.",
  },
  {
    match: /access and unfair practices|access workplaces|time off for trade union/i,
    title: "More rights for trade unions at work",
    what: "Makes it easier for trade unions to come into workplaces, talk to staff, and get paid time off for union work.",
    example: "Employment law is set at Westminster, so these rules cover workers and bosses in Scotland too.",
    yesMeans: "Voted to give trade unions stronger rights at work.",
    noMeans: "Voted against giving trade unions stronger rights at work.",
  },
  {
    match: /employment tribunal/i,
    title: "More time to take a bad boss to a tribunal",
    what: "Gives workers six months instead of three to take an unfair employer to a tribunal.",
    example: "If you are sacked unfairly, you get twice as long to make your claim.",
    yesMeans: "Voted to give workers more time to bring a claim.",
    noMeans: "Voted against giving workers more time to bring a claim.",
  },
  {
    match: /climate change act 2008 \(credit limit\)/i,
    title: "Limits on using foreign carbon credits",
    what: "Sets a limit on how much the UK can count carbon credits bought from other countries towards its own climate targets.",
    example: "The lower the limit, the more pollution has to be cut here in the UK.",
    yesMeans: "Voted to approve the limit on foreign carbon credits.",
    noMeans: "Voted against the limit on foreign carbon credits.",
  },
  {
    match: /carbon budget order/i,
    title: "The UK's legal limit on climate pollution",
    what: "Sets a legal cap on how much greenhouse gas the whole UK can produce over five years, from 2038 to 2042.",
    example: "It is the seventh of these caps. Each one is tighter than the last.",
    yesMeans: "Voted to set the UK's new legal limit on climate pollution.",
    noMeans: "Voted against the UK's new legal limit on climate pollution.",
  },
  {
    match: /town and country planning.*\(england\)|clean air zones.*\(england\)/i,
    title: "England only: planning fees or clean air zones",
    what: "Changes council planning fees or clean air driving zone charges in England only.",
    example: "This does not affect Scotland. Planning and low emission zones here are run by Holyrood and Scottish councils.",
    yesMeans: "Voted to approve these England only rules.",
    noMeans: "Voted against these England only rules.",
  },
  {
    match: /supply of machinery/i,
    title: "Safety rules for work machines",
    what: "Keeps UK safety rules for machines like cranes, diggers and lawnmowers in line with Europe's.",
    example: "A digger that passes safety checks can still be sold in Scotland and in Europe.",
    yesMeans: "Voted to keep machine safety rules in line with Europe.",
    noMeans: "Voted against these machine safety rules.",
  },
  {
    match: /children.?s wellbeing and schools act/i,
    title: "England only: rules for new schools",
    what: "Changes the rules for opening new schools in England.",
    example: "This does not affect Scotland. Scottish schools are run in Scotland.",
    yesMeans: "Voted to approve these England only school rules.",
    noMeans: "Voted against these England only school rules.",
  },
  {
    match: /king.?s speech motion for an address: amendment/i,
    title: "A challenge to the government's plan for the year",
    what: "A vote on adding criticism to Parliament's formal reply to the King's Speech, the government's plan for the year ahead.",
    yesMeans: "Voted to add this criticism of the government's plan.",
    noMeans: "Voted against adding this criticism of the government's plan.",
  },
  {
    match: /king.?s speech/i,
    title: "Backing the government's plan for the year",
    what: "The big yearly vote on the government's plan for the year ahead, read out by the King.",
    example: "If a government loses this vote, it usually has to step down.",
    yesMeans: "Voted to back the government's plan for the year.",
    noMeans: "Voted against the government's plan for the year.",
  },
  {
    match: /northern ireland troubles bill/i,
    title: "How killings from the Troubles are investigated",
    what: "Changes how killings and bombings from the Northern Ireland Troubles are investigated.",
    example: "It undoes parts of the last government's law that shut down inquests and court cases, including cases involving former soldiers.",
    yesMeans: "Voted for this part of the Troubles investigations law.",
    noMeans: "Voted against this part of the Troubles investigations law.",
  },
  {
    match: /representation of the people bill/i,
    title: "New election rules, including votes at 16",
    what: "Changes the rules for UK elections, including votes at 16, voter ID and donations to parties.",
    example: "16 and 17 year olds can already vote in Scottish elections. This lets them vote in UK general elections too.",
    yesMeans: "Voted for this part of the new elections law.",
    noMeans: "Voted against this part of the new elections law.",
  },
  {
    match: /terminally ill adults \(end of life\) bill/i,
    title: "Assisted dying for terminally ill adults",
    what: "Whether adults with less than six months to live should be allowed help to end their life.",
    example: "This law covers England and Wales. Holyrood has been voting on a separate law for Scotland.",
    yesMeans: "Voted YES to allowing assisted dying.",
    noMeans: "Voted NO to allowing assisted dying.",
  },
  {
    match: /support for british farmers/i,
    title: "Lib Dem call for better farm support",
    what: "The Liberal Democrats called this vote. It criticised a farm grants scheme that ran out of money within hours of opening.",
    example: "It also criticised cuts to farm budgets and the tax changes on inherited farms.",
    yesMeans: "Voted with the Lib Dems to criticise the government on farm support.",
    noMeans: "Voted with the government against the Lib Dems' criticism.",
  },
  {
    match: /opposition day motion: inheritance tax/i,
    title: "Conservative call to scrap inheritance tax",
    what: "The Conservatives called this vote. It asked the government to cut public spending so it could scrap inheritance tax on family homes, farms and businesses.",
    example: "Inheritance tax is set at Westminster, so it applies in Scotland too.",
    yesMeans: "Voted with the Conservatives to scrap inheritance tax on homes, farms and businesses.",
    noMeans: "Voted against the Conservatives' call to scrap inheritance tax.",
  },
  {
    match: /mod bicester and illegal migrants/i,
    title: "Conservative call to leave the European Convention on Human Rights",
    what: "The Conservatives called this vote against the government's plan to house asylum seekers at an army base in Bicester, Oxfordshire.",
    example: "It also called for the UK to leave the European Convention on Human Rights, so people who arrive illegally can be deported.",
    yesMeans: "Voted with the Conservatives against the army base plan and for leaving the European Convention on Human Rights.",
    noMeans: "Voted against the Conservatives' call, including leaving the European Convention on Human Rights.",
  },
  {
    match: /windsor framework|interoperability in northern ireland|plant health.*northern ireland/i,
    title: "Northern Ireland trade and border rules",
    what: "Updates post Brexit rules for goods, trains or plants moving into Northern Ireland.",
    example: "Covers checks on food, plants, seed potatoes and trains crossing to Northern Ireland.",
    yesMeans: "Voted to approve these Northern Ireland trade rules.",
    noMeans: "Voted against these Northern Ireland trade rules.",
  },
  {
    match: /carbon border adjustment mechanism/i,
    title: "A carbon tax on imports from polluting countries",
    what: "Puts a carbon tax on steel, cement and fertiliser brought into the UK from countries with weaker climate rules.",
    example: "It is meant to stop polluting foreign factories undercutting UK firms that already pay carbon costs.",
    yesMeans: "Voted to bring in the carbon tax on imports.",
    noMeans: "Voted against the carbon tax on imports.",
  },
  {
    match: /courts and tribunals bill/i,
    title: "Changes to courts to cut waiting times",
    what: "Changes how courts and tribunals are run, to clear the huge backlog of cases.",
    example: "Most courts in Scotland are run in Scotland. Employment and benefits tribunals are UK wide.",
    yesMeans: "Voted for this part of the courts law.",
    noMeans: "Voted against this part of the courts law.",
  },
  {
    match: /health bill/i,
    title: "Health law: vapes, smoking and junk food adverts",
    what: "Changes rules on vapes, smoking, junk food adverts and NHS powers.",
    example: "Scottish hospitals are run in Scotland, but UK wide bans on tobacco and vape sales cover Scotland too.",
    yesMeans: "Voted for this change to the health law.",
    noMeans: "Voted against this change to the health law.",
  },
  {
    match: /highways \(financing\) bill|social housing bill/i,
    title: "England only: roads or council housing",
    what: "A law on road funding or council housing in England.",
    example: "Roads and council housing in Scotland are run by Holyrood and Scottish councils.",
    yesMeans: "Voted to block this England only law.",
    noMeans: "Voted to let this England only law carry on.",
  },
  {
    match: /motion to sit in private/i,
    title: "A vote to send the public out",
    what: "A vote on whether MPs should carry on in private, with the public and press sent out.",
    example: "MPs sometimes use this vote to hold up a debate rather than to meet in secret.",
    yesMeans: "Voted for the Commons to sit in private.",
    noMeans: "Voted against the Commons sitting in private.",
  },
  {
    match: /closure motion/i,
    title: "A vote to end the debate",
    what: "A vote to stop the talking and move straight to a decision.",
    example: "MPs use it when they think a debate is being dragged out on purpose.",
    yesMeans: "Voted to end the debate and go straight to a vote.",
    noMeans: "Voted to let the debate carry on.",
  },
  {
    match: /preventing alcohol and drug deaths/i,
    title: "Cutting Scotland's drug and alcohol deaths",
    what: "A Scottish Parliament vote on funding rehab beds and treatment to cut drug and alcohol deaths.",
    example: "Scotland has the highest drug death rate in Europe. Health and rehab are run by Holyrood.",
    yesMeans: "Backed this plan on drug and alcohol deaths.",
    noMeans: "Voted against this plan on drug and alcohol deaths.",
  },
  {
    match: /learning disabilities, autism and neurodivergence/i,
    title: "Support for autism, ADHD and learning disabilities",
    what: "A Scottish Parliament vote on better support and shorter waits for people with autism, ADHD and learning disabilities.",
    example: "Covers Scottish schools, NHS assessment waiting lists and local care.",
    yesMeans: "Backed stronger support for autism, ADHD and learning disabilities.",
    noMeans: "Voted against this plan on autism and learning disabilities.",
  },
  {
    match: /international climate justice/i,
    title: "Scottish money for poorer countries hit by climate change",
    what: "A Scottish Parliament vote on spending Scottish Government money to help poorer countries cope with climate change.",
    example: "Covers Holyrood's Climate Justice Fund.",
    yesMeans: "Backed spending on the Climate Justice Fund.",
    noMeans: "Voted against this plan on the Climate Justice Fund.",
  },
  {
    match: /cyber resilience/i,
    title: "Protecting Scottish hospitals and councils from hackers",
    what: "A Scottish Parliament vote on protecting Scottish hospitals and councils from computer hackers.",
    example: "It follows hacks that stole data and disrupted NHS boards and councils in Scotland.",
    yesMeans: "Backed tighter computer security for hospitals and councils.",
    noMeans: "Voted against this plan on computer security.",
  },
  {
    match: /fishing industry/i,
    title: "Support for Scotland's fishing industry",
    what: "A Scottish Parliament vote on fish quotas, fishing bans and support for Scottish fishing boats.",
    example: "Affects coastal towns and fishing crews in the North East, Highlands and Islands.",
    yesMeans: "Backed this plan for Scotland's fishing industry.",
    noMeans: "Voted against this plan for Scotland's fishing industry.",
  },
  {
    match: /prosperity and future in europe/i,
    title: "Closer ties between Scotland and Europe",
    what: "A Scottish Parliament vote calling for closer trade and travel ties with the European Union.",
    example: "Covers youth travel, food exports and Brexit red tape.",
    yesMeans: "Backed closer ties with the European Union.",
    noMeans: "Voted against closer ties with the European Union.",
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
): { title: string; what: string; example?: string; yesMeans?: string; noMeans?: string } | null {
  for (const entry of SUBSTANCE) {
    if (entry.match.test(title)) {
      return {
        title: entry.title,
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
    if (isYes) return "Voted to accept the House of Lords' change.";
    if (isNo) return "Voted to reject the House of Lords' change.";
  }
  if (/new clause|report stage|amendment \d+|stage 2/i.test(title)) {
    if (isYes) return "Voted to make this change to the law.";
    if (isNo) return "Voted against making this change to the law.";
  }
  if (/opposition day/i.test(title)) {
    if (isYes) return "Voted with the party that called this vote, against the government.";
    if (isNo) return "Voted with the government against the party that called this vote.";
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
