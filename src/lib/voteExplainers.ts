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
        "Parties not in government get set days to pick what MPs debate. This vote does not change any law by itself, but it forces every MP to take a side.",
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
  /** Only match votes on this day (YYYY-MM-DD), for titles Parliament reuses. */
  date?: string;
  /** A plain headline shown in place of Parliament's official title. */
  title: string;
  what: string;
  example?: string;
  yesMeans?: string;
  noMeans?: string;
  /**
   * What a YES vote supported, written to follow "voted for" / "voted against".
   * Example: "letting asylum seekers work after three months of waiting".
   * When set, the card says "[MP] voted for/against [proposition]."
   */
  proposition?: string;
  /** Who put the vote forward, in plain words: "The Conservatives", "The government". */
  by?: string;
  /** One sentence on what passing meant, when "This went ahead." would mislead. */
  ifPassed?: string;
  /** One sentence on what rejection meant, when "This did not happen." would mislead. */
  ifRejected?: string;
};

/**
 * Hand-checked, plain summaries of what specific bills and motions actually
 * do. Every sentence must stay at or under 32 words. Name who called a vote
 * when it was not the government, and never say "motion" or "opposition day"
 * in reader-facing words.
 */
export const SUBSTANCE: SubstanceEntry[] = [
  {
    match: /^draft\s+trade\s+unions\s+\(permissible\s+means\s+of\s+voting\)\s+and\s+employment\s+rights\s+\(unfair\s+dismissal\)\s+\(amendment\)\s+order\s+2026$/i,
    title: "Letting workers vote on strikes online",
    by: "The government",
    proposition: "letting union members vote on strikes online, at work, by post or a mix",
    what: "Employment law is set at Westminster, so these trade union rules cover Scotland too.",
  },
  {
    match: /^draft\s+code\s+of\s+practice\s+on\s+electronic\s+and\s+workplace\s+ballots\s+for\s+statutory\s+trade\s+union\s+ballots$/i,
    title: "Guidance for online strike votes",
    by: "The government",
    proposition: "official guidance on running union votes online and at work",
    what: "Employment law is set at Westminster, so these trade union rules cover Scotland too.",
  },
  {
    match: /^draft\s+acas\s+code\s+of\s+practice\s+on\s+time\s+off\s+for\s+trade\s+union\s+duties\s+and\s+activities$/i,
    title: "Time off for union reps",
    by: "The government",
    proposition: "updated guidance on paid time off for workers who do union duties",
    what: "Employment law is set at Westminster, so these trade union rules cover Scotland too.",
  },
  {
    match: /^draft\s+code\s+of\s+practice\s+on\s+the\s+right\s+of\s+trade\s+unions\s+to\s+access\s+workplaces$/i,
    title: "Guidance on unions coming into workplaces",
    by: "The government",
    proposition: "official guidance on trade unions' new right to enter workplaces",
    what: "Employment law is set at Westminster, so these trade union rules cover Scotland too.",
  },
  {
    match: /^draft\s+trade\s+unions\s+\(right\s+to\s+access\s+workplaces\)\s+regulations\s+2026$/i,
    title: "Letting unions into workplaces",
    by: "The government",
    proposition: "the rules letting trade unions enter workplaces to meet and recruit workers",
    what: "Employment law is set at Westminster, so these trade union rules cover Scotland too.",
  },
  {
    match: /^draft\s+code\s+of\s+practice\s+on\s+access\s+and\s+unfair\s+practices\s+during\s+the\s+recognition\s+and\s+\s+derecognition\s+process$/i,
    title: "Banning unfair tactics when unions ask to be recognised",
    by: "The government",
    proposition: "guidance banning unfair tactics when a union asks an employer to recognise it",
    what: "Employment law is set at Westminster, so these trade union rules cover Scotland too.",
  },
  {
    match: /^draft\s+railways\s+\(interoperability\s+in\s+northern\s+ireland\)\s+\(convention\s+on\s+international\s+\s+carriage\s+by\s+rail\)\s+\(amendment\)\s+regulations\s+2026$/i,
    title: "Northern Ireland train standards",
    by: "The government",
    proposition: "using EU safety and design rules for trains in Northern Ireland",
    what: "A post-Brexit rule for Northern Ireland only.",
  },
  {
    match: /^highways\s+\(financing\)\s+bill:\s+second\s+reading:\s+reasoned\s+amendment$/i,
    title: "Conservative bid to block the road tolls law",
    by: "The Conservatives (Richard Holden MP)",
    proposition: "blocking the road tolls law over doubts the government can deliver the Lower Thames Crossing",
    what: "The law lets licensed companies charge tolls to pay for work on major roads in England, such as the Lower Thames Crossing. England only.",
    ifRejected: "The law carried on.",
  },
  {
    match: /^social\s+housing\s+bill\s+\[lords\]:\s+reasoned\s+amendment\s+to\s+second\s+reading$/i,
    title: "Conservative bid to block the council housing law",
    by: "The Conservatives (Gareth Bacon MP)",
    proposition: "blocking the social housing law because, they said, it would in effect end the Right to Buy",
    what: "The law makes council tenants wait 10 years instead of 3 to buy their home and protects new council homes from Right to Buy for 30 years. The debate was about England.",
    ifRejected: "The law carried on.",
  },
  {
    match: /^immigration\s+and\s+asylum\s+bill\s+report\s+stage:\s+new\s+clause\s+18$/i,
    title: "Joining the EU's asylum pact",
    by: "The Lib Dems (Max Wilkinson MP)",
    proposition: "making the government start talks within three months to join the EU's shared asylum system, and report on progress every six months",
    what: "Moves asylum appeals from judges to a new body staffed mostly by people who are not judges, allows one appeal only, and tightens \"right to family life\" claims. Border rules cover Scotland too.",
  },
  {
    match: /^immigration\s+and\s+asylum\s+bill\s+report\s+stage:\s+new\s+clause\s+50$/i,
    title: "Banning illegal arrivals from becoming British citizens",
    by: "The Conservatives (Chris Philp MP)",
    proposition: "banning anyone who entered the UK illegally from ever becoming a British citizen",
    what: "Moves asylum appeals from judges to a new body staffed mostly by people who are not judges, allows one appeal only, and tightens \"right to family life\" claims. Border rules cover Scotland too.",
  },
  {
    match: /^immigration\s+and\s+asylum\s+bill\s+report\s+stage:\s+new\s+clause\s+54$/i,
    title: "A 10 year wait to settle in the UK",
    by: "The Conservatives (Chris Philp MP)",
    proposition: "making migrants wait 10 years before they can settle in the UK for good, and refusing it to anyone who has claimed benefits, earned below a set income or has a criminal record",
    what: "Moves asylum appeals from judges to a new body staffed mostly by people who are not judges, allows one appeal only, and tightens \"right to family life\" claims. Border rules cover Scotland too.",
  },
  {
    match: /^immigration\s+and\s+asylum\s+bill\s+report\s+stage:\s+new\s+clause\s+62$/i,
    title: "Protecting skilled workers already here from tougher rules",
    by: "A group of 52 MPs led by Neil Duncan-Jordan MP (Labour)",
    proposition: "protecting people already in the UK on skilled worker visas from new, tougher rules on settling here for good",
    what: "Moves asylum appeals from judges to a new body staffed mostly by people who are not judges, allows one appeal only, and tightens \"right to family life\" claims. Border rules cover Scotland too.",
  },
  {
    match: /^immigration\s+and\s+asylum\s+bill:\s+third\s+reading$/i,
    title: "Final vote on the new asylum and appeals law",
    by: "The government",
    proposition: "passing the new asylum law, which moves appeals from judges to a new body, allows one appeal only and makes foreign criminals easier to deport",
    what: "Moves asylum appeals from judges to a new body staffed mostly by people who are not judges, allows one appeal only, and tightens \"right to family life\" claims. Border rules cover Scotland too.",
    ifPassed: "The law moved on to the House of Lords.",
  },
  {
    match: /^sporting\s+events\s+bill\s+\[lords\]\s+report:\s+new\s+clause\s+1$/i,
    title: "Banning resale of sports tickets above face value",
    by: "The Lib Dems (Anna Sabine MP)",
    proposition: "banning resale of tickets to major sporting events above face value, capping resale site fees, and fining sites that break the rules",
    what: "A law setting permanent rules for hosting major sporting events in the UK, including a ban on ticket touting.",
  },
  {
    match: /^sporting\s+events\s+bill\s+\[lords\]\s+report:\s+amendment\s+6$/i,
    title: "Banning transport and council strikes during big events",
    by: "The Conservatives (Rebecca Paul MP)",
    proposition: "banning strikes by transport and council workers during major sporting events",
    what: "A law setting permanent rules for hosting major sporting events in the UK, including a ban on ticket touting.",
  },
  {
    match: /^sporting\s+events\s+bill\s+\[lords\]\s+report:\s+amendment\s+8$/i,
    title: "Separate sport and facilities by biological sex",
    by: "The Conservatives (Rebecca Paul MP)",
    proposition: "requiring major sporting events to keep competitions, changing rooms, toilets and rooms separate by biological sex, with no public money for events that do not",
    what: "A law setting permanent rules for hosting major sporting events in the UK, including a ban on ticket touting.",
  },
  {
    match: /^railways\s+bill:\s+carry\-over\s+extension\s+\(motion\)$/i,
    title: "More time for the Great British Railways law",
    by: "The government",
    proposition: "giving the government until April 2027 to pass its law creating Great British Railways, instead of the law falling",
    what: "A law to bring rail services under a new public body, Great British Railways.",
  },
  {
    match: /^budget\s+resolution\s+no\.\s+3:\s+income\s+tax\s+\(default,\s+property\s+and\s+savings\s+rates\)$/i,
    title: "Budget: higher income tax on savings and rent",
    by: "The government",
    proposition: "raising income tax on savings and rental income to 24%, 44% and 49% from April 2027",
    what: "The savings rates cover Scotland. Scotland sets its own rates on wages and can set its own on rent.",
  },
  {
    match: /^budget\s+resolution\s+no\.7:\s+increase\s+in\s+rate\s+of\s+banking\s+surcharge\s+for\s+temporary\s+period$/i,
    title: "Budget: doubling the extra tax on bank profits",
    by: "The government",
    proposition: "doubling the extra tax on bank profits from 3% to 6% from January 2027 to March 2028",
    what: "One of the tax changes from the autumn Budget. These votes are put forward by the government.",
  },
  {
    match: /^budget\s+resolution\s+no\.\s+8:\s+capital\s+gains\s+tax\s+\(business\s+asset\s+disposal\s+relief\)$/i,
    title: "Budget: smaller tax break for selling a business",
    by: "The government",
    proposition: "halving the amount of profit from selling a business that gets the lower 18% tax rate, from £1 million to £500,000",
    what: "One of the tax changes from the autumn Budget. These votes are put forward by the government.",
  },
  {
    match: /^budget\s+resolution\s+no\.\s+15:\s+charges\s+in\s+connection\s+with\s+employment\s+visas$/i,
    title: "Budget: no tax when your boss pays your visa fees",
    by: "The government",
    proposition: "letting workers pay no income tax when their employer pays their visa fees",
    what: "One of the tax changes from the autumn Budget. These votes are put forward by the government.",
  },
  {
    match: /^budget\s+resolution\s+no\.\s+55:\s+value\s+added\s+tax\s+\(electric\s+vehicle\s+charging\)$/i,
    title: "Budget: keeping 20% VAT on public car chargers",
    by: "The government",
    proposition: "keeping full 20% VAT on public and workplace electric car chargers, while home electricity gets 0% VAT",
    what: "This covers the whole UK, including Scotland.",
  },
  {
    match: /^budget\s+resolution\s+no\.\s+76:\s+rates\s+of\s+alcohol\s+duty$/i,
    title: "Budget: tax on alcohol up 4.55%",
    by: "The government",
    proposition: "raising the tax on alcohol by 4.55% from February 2027, with bigger discounts for small producers",
    what: "One of the tax changes from the autumn Budget. These votes are put forward by the government.",
  },
  {
    match: /^budget\s+resolution\s+no\.\s+86:\s+high\s+value\s+council\s+tax\s+surcharge$/i,
    title: "Budget: extra council tax on £2 million homes in England",
    by: "The government",
    proposition: "an extra yearly charge of £2,500 to £7,500 on homes worth over £2 million in England, from April 2028",
    what: "This is England only. Scotland is making its own version at Holyrood, with new council tax bands for homes over £1 million.",
  },
  {
    match: /^draft\s+private\s+rented\s+sector\s+database\s+regulations\s+2026$/i,
    title: "England only: a register of private landlords",
    by: "The government",
    proposition: "making private landlords in England register every rented home on a national database, for £65 a year per property",
    what: "This is England only. Scotland already has its own landlord register, run by councils.",
  },
  {
    match: /^draft\s+housing\s+\(tenancy\s+deposit\s+schemes\)\s+order\s+2026$/i,
    title: "England only: the government taking interest on renters' deposits",
    by: "The government",
    proposition: "letting the government take a share of the interest earned on renters' protected deposits in England",
    what: "More than £2.5 billion of deposits sit in these schemes. The government says it will spend the money on help for renters. England only.",
  },
  {
    match: /^visitor\s+levy\s+\(england\)\s+bill\s+second\s+reading$/i,
    title: "England only: an overnight tourist tax",
    by: "The government",
    proposition: "letting mayors in England add an overnight tourist tax to hotel and holiday let bills",
    what: "This is England only. Scotland already lets councils charge a visitor levy, under a 2024 Holyrood law.",
  },
  {
    match: /^draft\s+employment\s+rights\s+act\s+2025\s+\(unfair\s+dismissal\)\s+\(removal\s+of\s+limit\s+on\s+\s+compensation\)\s+\(consequential\s+amendments\)\s+regulations\s+2026$/i,
    title: "No more cap on unfair dismissal payouts",
    by: "The government",
    proposition: "removing the cap on what workers can win for unfair dismissal, from January 2027",
    what: "Today the cap is the lower of £123,543 or a year's pay. Employment law covers Scotland too.",
  },
  {
    match: /^national\s+security\s+\(state\s+threats\)\s+bill\s+committee:\s+amendment\s+3$/i,
    title: "Removing a defence for dealing with banned groups",
    by: "The Conservatives (Alicia Kearns MP)",
    proposition: "removing the legal defence for dealing with a banned group for allowed reasons, such as diplomacy or humanitarian aid",
    what: "A new law letting the government ban groups that work for hostile foreign countries. Helping a banned group can mean up to 14 years in jail.",
  },
  {
    match: /^national\s+security\s+\(state\s+threats\)\s+bill\s+committee:\s+amendment\s+8$/i,
    title: "Covering plots planned in the UK but carried out abroad",
    by: "The Conservatives (Alicia Kearns MP)",
    proposition: "making the law cover acts carried out abroad but planned in the UK",
    what: "A new law letting the government ban groups that work for hostile foreign countries. Helping a banned group can mean up to 14 years in jail.",
  },
  {
    match: /^national\s+security\s+\(state\s+threats\)\s+bill\s+committee:\s+amendment\s+13$/i,
    title: "A new crime of being 'inspired by' a banned group",
    by: "The Conservatives (Alicia Kearns MP)",
    proposition: "creating a new crime of acting \"inspired by\" a banned group, even without being directed by it",
    what: "A new law letting the government ban groups that work for hostile foreign countries. Helping a banned group can mean up to 14 years in jail.",
  },
  {
    match: /^national\s+security\s+\(state\s+threats\)\s+bill\s+committee:\s+new\s+clause\s+3$/i,
    title: "Banning Iran's Revolutionary Guard",
    by: "The Lib Dems (Max Wilkinson MP)",
    proposition: "making the government move to ban Iran's Revolutionary Guard under the new law within a month",
    what: "A new law letting the government ban groups that work for hostile foreign countries. Helping a banned group can mean up to 14 years in jail.",
  },
  {
    match: /^national\s+security\s+\(state\s+threats\)\s+bill:\s+motion\s+to\s+agree\s+to\s+lords\s+amendment\s+1$/i,
    title: "Protecting aid work under the new spying law",
    by: "The government",
    proposition: "protecting humanitarian aid work so it cannot count as helping a banned group",
    what: "A new law letting the government ban groups that work for hostile foreign countries. Helping a banned group can mean up to 14 years in jail.",
  },
  {
    match: /^national\s+security\s+\(state\s+threats\)\s+bill:\s+allocation\s+of\s+time\s+motion$/i,
    title: "Setting the debate time for the spying law",
    by: "The government",
    proposition: "the timetable for debating the new national security law",
    what: "A new law letting the government ban groups that work for hostile foreign countries. Helping a banned group can mean up to 14 years in jail.",
  },
  {
    match: /^taxation\s+\(energy\s+and\s+vehicles\)\s+bill\s+committee:\s+new\s+clause\s+2$/i,
    title: "A review of mileage pay for care workers",
    by: "The Lib Dems (Daisy Cooper MP)",
    proposition: "a review of whether 55p a mile is enough for care workers who drive to people's homes",
    what: "A tax law. It raises the windfall tax on some electricity generators from 45% to 55%, raises tax free mileage pay from 45p to 55p a mile, and cuts lorry tax for a year.",
  },
  {
    match: /^taxation\s+\(energy\s+and\s+vehicles\)\s+bill\s+committee:\s+new\s+clause\s+4$/i,
    title: "A review of the 55% windfall tax",
    by: "The Conservatives (James Wild MP)",
    proposition: "a government review of the 55% windfall tax on electricity generators, reported by March 2028",
    what: "A tax law. It raises the windfall tax on some electricity generators from 45% to 55%, raises tax free mileage pay from 45p to 55p a mile, and cuts lorry tax for a year.",
  },
  {
    match: /^taxation\s+\(energy\s+and\s+vehicles\)\s+bill\s+committee:\s+new\s+clause\s+5$/i,
    title: "A review of the lorry tax cut",
    by: "The Conservatives (James Wild MP)",
    proposition: "a government review of the temporary lorry tax rates, reported by June 2027",
    what: "A tax law. It raises the windfall tax on some electricity generators from 45% to 55%, raises tax free mileage pay from 45p to 55p a mile, and cuts lorry tax for a year.",
  },
  {
    match: /^public\s+office\s+\(accountability\)\s+bill\s+report\s+stage:\s+amendment\s+3$/i,
    title: "Protecting staff who speak to inquiries",
    by: "The Lib Dems (Jess Brown-Fuller MP)",
    proposition: "making public bodies show their staff can safely give information to inquiries",
    what: "The Hillsborough Law. It makes public officials tell the truth after disasters, makes misleading the public a crime, and gives bereaved families free legal help at inquests.",
  },
  {
    match: /^public\s+office\s+\(accountability\)\s+bill\s+report\s+stage:\s+amendment\s+199$/i,
    title: "Letting spy chiefs block secrets going to inquiries",
    by: "The Conservatives (Nick Timothy MP)",
    proposition: "letting the heads of the spy agencies, the National Crime Agency and the armed forces stop their staff handing secret information to inquiries",
    what: "The Hillsborough Law. It makes public officials tell the truth after disasters, makes misleading the public a crime, and gives bereaved families free legal help at inquests.",
  },
  {
    match: /^public\s+office\s+\(accountability\)\s+bill\s+report\s+stage:\s+amendment\s+19$/i,
    title: "Needing the Attorney General's say-so to prosecute",
    by: "The Conservatives (Dr Kieran Mullan MP)",
    proposition: "needing the Attorney General's permission before anyone can be prosecuted for misleading the public",
    what: "The Hillsborough Law. It makes public officials tell the truth after disasters, makes misleading the public a crime, and gives bereaved families free legal help at inquests.",
  },
  {
    match: /^representation\s+of\s+the\s+people\s+bill:\s+report\s+stage:\s+new\s+clause\s+65$/i,
    title: "Helping British voters abroad to vote",
    by: "The Conservatives (Paul Holmes MP)",
    proposition: "an independent review on getting more British voters living abroad registered and voting",
    what: "A new law on UK elections: votes at 16, changes to voter ID and registration, and new rules on donations to parties.",
  },
  {
    match: /^representation\s+of\s+the\s+people\s+bill:\s+report\s+stage:\s+new\s+clause\s+67$/i,
    title: "Banning election leaflets in foreign languages",
    by: "The Conservatives (Paul Holmes MP)",
    proposition: "banning party campaign leaflets written in foreign languages during elections",
    what: "A new law on UK elections: votes at 16, changes to voter ID and registration, and new rules on donations to parties.",
  },
  {
    match: /^representation\s+of\s+the\s+people\s+bill:\s+report\s+stage:\s+new\s+clause\s+88$/i,
    title: "A Royal Commission on capping donations to parties",
    by: "The Lib Dems (Lisa Smart MP)",
    proposition: "setting up a Royal Commission, a formal expert inquiry, on capping donations to political parties",
    what: "A new law on UK elections: votes at 16, changes to voter ID and registration, and new rules on donations to parties.",
  },
  {
    match: /^representation\s+of\s+the\s+people\s+bill:\s+third\s+reading$/i,
    title: "Final vote on the new elections law, including votes at 16",
    by: "The government",
    proposition: "passing the new elections law, including votes at 16 in UK elections",
    what: "A new law on UK elections: votes at 16, changes to voter ID and registration, and new rules on donations to parties.",
  },
  {
    match: /^health\s+bill:\s+report\s+stage:\s+new\s+clause\s+6$/i,
    title: "Making every maternity unit good or outstanding",
    by: "The Lib Dems (Helen Morgan MP)",
    proposition: "requiring every NHS maternity unit in England to be rated good or outstanding, with a support scheme to get them there",
    what: "Scraps NHS England and the patient watchdog Healthwatch, and moves their jobs to the Health Department and local health boards. It covers the NHS in England. Scotland runs its own NHS.",
  },
  {
    match: /^health\s+bill:\s+report\s+stage:\s+new\s+clause\s+145$/i,
    title: "Answering families harmed by valproate and pelvic mesh",
    by: "The Conservatives (Dr Caroline Johnson MP)",
    proposition: "making the government publish its response to the Hughes Report, on payouts for people harmed by the drug valproate and pelvic mesh, within 30 days",
    what: "Scraps NHS England and the patient watchdog Healthwatch, and moves their jobs to the Health Department and local health boards. It covers the NHS in England. Scotland runs its own NHS.",
  },
  {
    match: /^health\s+bill:\s+report\s+stage:\s+new\s+clause\s+140$/i,
    title: "Ending patients being treated in corridors",
    by: "The Lib Dems (Helen Morgan MP)",
    proposition: "ending corridor care in English hospitals within a year, or holding an inquiry",
    what: "Scraps NHS England and the patient watchdog Healthwatch, and moves their jobs to the Health Department and local health boards. It covers the NHS in England. Scotland runs its own NHS.",
  },
  {
    match: /^health\s+bill:\s+report\s+stage:\s+new\s+clause\s+142$/i,
    title: "Banning puberty blockers for under 18s",
    by: "The Conservatives (Dr Caroline Johnson MP)",
    proposition: "banning puberty blockers for under 18s for gender treatment, including in medical trials unless Parliament agrees",
    what: "Scraps NHS England and the patient watchdog Healthwatch, and moves their jobs to the Health Department and local health boards. It covers the NHS in England. Scotland runs its own NHS.",
  },
  {
    match: /^health\s+bill:\s+report\s+stage:\s+new\s+clause\s+143$/i,
    title: "Single sex wards, toilets and changing rooms",
    by: "The Conservatives (Dr Caroline Johnson MP)",
    proposition: "requiring single sex wards, toilets and changing rooms for NHS patients and staff in England",
    what: "Scraps NHS England and the patient watchdog Healthwatch, and moves their jobs to the Health Department and local health boards. It covers the NHS in England. Scotland runs its own NHS.",
  },
  {
    match: /^health\s+bill:\s+report\s+stage:\s+amendment\s+1$/i,
    title: "Cutting a section out of the NHS law",
    by: "The Conservatives (Dr Caroline Johnson MP)",
    proposition: "deleting one section of the NHS law (we could not confirm exactly what that section does)",
    what: "Scraps NHS England and the patient watchdog Healthwatch, and moves their jobs to the Health Department and local health boards. It covers the NHS in England. Scotland runs its own NHS.",
  },
  {
    match: /^courts\s+and\s+tribunals\s+bill\s+report\s+stage:\s+new\s+clause\s+25$/i,
    title: "Ending the court backlog measures once waits fall",
    by: "The Conservatives (Nick Timothy MP)",
    proposition: "ending the emergency court backlog measures once Crown Court waiting lists fall below pre-Covid levels",
    what: "Cuts the right to choose a jury trial for some crimes and doubles magistrates' sentencing powers, to clear court backlogs. It covers England and Wales. Scotland has its own courts.",
  },
  {
    match: /^courts\s+and\s+tribunals\s+bill\s+report\s+stage:\s+amendment\s+1$/i,
    title: "Keeping the right to choose a jury trial",
    by: "The Conservatives (Dr Kieran Mullan MP), backed by the Greens",
    proposition: "keeping people's right to choose a jury trial",
    what: "Cuts the right to choose a jury trial for some crimes and doubles magistrates' sentencing powers, to clear court backlogs. It covers England and Wales. Scotland has its own courts.",
  },
  {
    match: /^courts\s+and\s+tribunals\s+bill\s+report\s+stage:\s+amendment\s+18$/i,
    title: "Better legal aid for serious cases in magistrates' courts",
    by: "The Lib Dems (Jess Brown-Fuller MP)",
    proposition: "paying lawyers the higher Crown Court legal aid rate for magistrates' court cases likely to bring over a year in prison",
    what: "Cuts the right to choose a jury trial for some crimes and doubles magistrates' sentencing powers, to clear court backlogs. It covers England and Wales. Scotland has its own courts.",
  },
  {
    match: /^courts\s+and\s+tribunals\s+bill:\s+third\s+reading$/i,
    title: "Final vote on cutting jury trials to clear court backlogs",
    by: "The government",
    proposition: "passing the courts law, which cuts the right to choose a jury trial for some crimes",
    what: "Cuts the right to choose a jury trial for some crimes and doubles magistrates' sentencing powers, to clear court backlogs. It covers England and Wales. Scotland has its own courts.",
  },
  {
    match: /^northern\s+ireland\s+troubles\s+bill:\s+carry\-over\s+extension\s+motion$/i,
    title: "Giving the Troubles law more time",
    by: "The government",
    proposition: "giving the Troubles law more time to finish its passage",
    what: "Replaces the last government's Legacy Act. It ends the offer of immunity from prosecution for Troubles killings and lets some court cases and inquests restart.",
  },
  {
    match: /^northern\s+ireland\s+troubles\s+bill:\s+programme\s+motion$/i,
    title: "Setting the debate time for the Troubles law",
    by: "The government",
    proposition: "the timetable for debating the Troubles law",
    what: "Replaces the last government's Legacy Act. It ends the offer of immunity from prosecution for Troubles killings and lets some court cases and inquests restart.",
  },
  {
    match: /^northern\s+ireland\s+troubles\s+bill\s+committee:\s+amendment\s+23$/i,
    title: "Covering the Omagh bombing",
    by: "The DUP (Gavin Robinson MP)",
    proposition: "moving the official end of the Troubles to August 1998, so the Omagh bombing is covered",
    what: "Replaces the last government's Legacy Act. It ends the offer of immunity from prosecution for Troubles killings and lets some court cases and inquests restart.",
  },
  {
    match: /^northern\s+ireland\s+troubles\s+bill\s+committee:\s+amendment\s+52$/i,
    title: "Barring people linked to paramilitary parties",
    by: "Independent MP Alex Easton",
    proposition: "barring members of parties linked to paramilitaries from a group set up under the law",
    what: "Replaces the last government's Legacy Act. It ends the offer of immunity from prosecution for Troubles killings and lets some court cases and inquests restart.",
  },
  {
    match: /^northern\s+ireland\s+troubles\s+bill\s+committee:\s+amendment\s+4$/i,
    title: "Investigations for victims of Troubles sex crimes",
    by: "The UUP (Robin Swann MP)",
    proposition: "letting victims of sexual crimes from the Troubles ask for an investigation",
    what: "Replaces the last government's Legacy Act. It ends the offer of immunity from prosecution for Troubles killings and lets some court cases and inquests restart.",
  },
  {
    match: /^northern\s+ireland\s+troubles\s+bill\s+committee:\s+amendment\s+47$/i,
    title: "Extra protection for veterans from prosecution",
    by: "The Conservatives (Alex Burghart MP)",
    proposition: "needing a senior official's written permission before army, security service or RUC veterans can be prosecuted",
    what: "Replaces the last government's Legacy Act. It ends the offer of immunity from prosecution for Troubles killings and lets some court cases and inquests restart.",
  },
  {
    match: /^northern\s+ireland\s+troubles\s+bill\s+committee:\s+new\s+clause\s+21$/i,
    title: "Blocking cases against soldiers without new evidence",
    by: "The Conservatives (Alex Burghart MP)",
    proposition: "blocking investigations, prosecutions and inquests into soldiers and police unless there is new and compelling evidence",
    what: "Replaces the last government's Legacy Act. It ends the offer of immunity from prosecution for Troubles killings and lets some court cases and inquests restart.",
  },
  {
    match: /^northern\s+ireland\s+troubles\s+bill\s+committee:\s+amendment\s+51$/i,
    title: "Stopping the Loughgall inquest",
    by: "The Conservatives (David Davis MP)",
    proposition: "stopping the inquest into the 1987 Loughgall shootings from restarting",
    what: "Replaces the last government's Legacy Act. It ends the offer of immunity from prosecution for Troubles killings and lets some court cases and inquests restart.",
  },
  {
    match: /^northern\s+ireland\s+troubles\s+bill\s+committee:\s+amendment\s+32$/i,
    title: "Narrowing a test for some inquests",
    by: "The DUP (Gavin Robinson MP)",
    proposition: "limiting a legal test in the law to inquests involving former soldiers or RUC officers (we could not confirm the exact effect)",
    what: "Replaces the last government's Legacy Act. It ends the offer of immunity from prosecution for Troubles killings and lets some court cases and inquests restart.",
  },
  {
    match: /^northern\s+ireland\s+troubles\s+bill\s+committee:\s+new\s+clause\s+7$/i,
    title: "Checking the law's effect on army recruitment",
    by: "The Conservatives (Alex Burghart MP)",
    proposition: "an independent reviewer of how the law affects armed forces recruitment",
    what: "Replaces the last government's Legacy Act. It ends the offer of immunity from prosecution for Troubles killings and lets some court cases and inquests restart.",
  },
  {
    match: /^northern\s+ireland\s+troubles\s+bill\s+committee:\s+new\s+clause\s+12$/i,
    title: "A plan for reconciliation",
    by: "The Lib Dems (Paul Kohler MP)",
    proposition: "a legal duty to publish a strategy for reconciliation in Northern Ireland",
    what: "Replaces the last government's Legacy Act. It ends the offer of immunity from prosecution for Troubles killings and lets some court cases and inquests restart.",
  },
  {
    match: /^northern\s+ireland\s+troubles\s+bill:\s+third\s+reading$/i,
    title: "Final vote on the Troubles law",
    by: "The government",
    proposition: "passing the Troubles law, which ends the offer of immunity from prosecution for Troubles killings",
    what: "Replaces the last government's Legacy Act. It ends the offer of immunity from prosecution for Troubles killings and lets some court cases and inquests restart.",
  },
  {
    match: /^immigration\s+and\s+asylum\s+bill:\s+reasoned\s+amendment\s+to\s+second\s+reading$/i,
    title: "Conservative bid to block the asylum law for not going far enough",
    by: "The Conservatives (Chris Philp MP)",
    proposition: "blocking the asylum law for not going far enough on deportations and on leaving the European Convention on Human Rights",
    ifRejected: "The law carried on.",
    what: "Replaces the immigration appeals tribunal with a new appeals body, narrows 'right to family life' claims and changes the protection people get after an asylum claim. Border rules cover Scotland too.",
  },
  {
    match: /^immigration\s+and\s+asylum\s+bill:\s+second\s+reading$/i,
    title: "First big vote on the new asylum law",
    by: "The government",
    proposition: "letting the new asylum and appeals law go ahead to its next stage",
    what: "Replaces the immigration appeals tribunal with a new appeals body, narrows 'right to family life' claims and changes the protection people get after an asylum claim. Border rules cover Scotland too.",
  },
  {
    match: /^motion to sit in private$/i,
    title: "A move to hold up a Friday debate",
    by: "A Labour MP",
    proposition: "sending the public out and sitting in private, a move used to hold up Friday debates on backbench MPs' bills",
    what: "On Fridays, MPs debate bills from backbench MPs. This vote is sometimes used as a tactic to slow things down, not to meet in secret.",
  },
  {
    match: /^closure motion$/i,
    date: "2026-09-11",
    title: "Ending the debate on assisted dying",
    by: "Kit Malthouse MP (Conservative), who backed the bill",
    proposition: "ending the debate on assisted dying so MPs could vote on it",
    ifPassed: "The debate ended and MPs voted on assisted dying straight away.",
    what: "A vote to stop the talking and move straight to a decision.",
  },
  {
    match: /^closure motion$/i,
    date: "2026-10-16",
    title: "Ending the debate on a pubs bill",
    by: "Mike Wood MP (Conservative)",
    proposition: "ending the debate on his Heritage Public Houses Bill so MPs could vote on it",
    what: "A vote to stop the talking and move straight to a decision.",
    ifRejected: "The debate ran out of time, so the bill could not go ahead.",
  },
  {
    match: /^terminally ill adults \(end of life\) bill: second reading$/i,
    title: "Assisted dying for terminally ill adults",
    by: "Lauren Edwards MP (Labour)",
    proposition: "allowing adults with six months or less to live to get help to end their life, with safeguards",
    what: "A backbench MP's bill to allow assisted dying. It would have covered England and Wales. Holyrood votes on its own law for Scotland.",
    ifRejected: "MPs rejected it, so assisted dying stays illegal.",
  },
  {
    match: /^king.?s speech motion for an address: amendment \(l\)$/i,
    title: "Lib Dem call for a customs union with the EU",
    by: "The Lib Dems (James MacCleary MP)",
    proposition: "calling on the government to negotiate a customs union with the EU, which would cut checks and charges on trade",
    what: "A proposed addition to Parliament's reply to the King's Speech, the government's plan for the year.",
  },
  {
    match: /^king.?s speech motion for an address$/i,
    title: "Backing the government's plan for the year",
    by: "The government",
    proposition: "approving the government's plan for the year, read out in the King's Speech",
    what: "The big yearly vote on the government's plan. If a government loses it, it usually has to step down.",
  },
  {
    match: /^draft carbon budget order 2026$/i,
    title: "The UK's legal cap on climate pollution for 2038 to 2042",
    by: "The government",
    proposition: "capping UK greenhouse gas emissions for 2038 to 2042 at 535 million tonnes, about 87% below 1990",
    what: "The seventh legal cap on UK climate pollution. Each cap is tighter than the last.",
  },
  {
    match: /^carbon border adjustment mechanism/i,
    title: "How the new carbon tax on imports is worked out",
    by: "The government",
    proposition: "the rules for working out the new carbon tax on imports such as steel, aluminium and cement, with a discount if a carbon price was already paid abroad",
    what: "The tax is meant to stop polluting foreign factories undercutting UK firms that already pay carbon costs.",
  },
  {
    match: /^withdrawal agreement \(windsor framework and governance\)/i,
    title: "How post-Brexit rules for Northern Ireland are run",
    by: "The government",
    proposition: "changing how post-Brexit arrangements for Northern Ireland are run and checked",
    what: "Lets the UK agree some decisions with the EU between formal meetings, and changes deadlines for checks by the Northern Ireland Assembly.",
  },
  {
    match: /^draft clean air zones central services/i,
    title: "England only: clean air zone fees",
    by: "The government",
    proposition: "doubling the fee English councils pay per clean air zone payment, from £2 to £4",
    what: "This only affects England. Low emission zones in Scotland are run by Scottish councils.",
  },
  {
    match: /^draft town and country planning \(fees/i,
    title: "England only: higher planning fees",
    by: "The government",
    proposition: "raising planning application fees in England",
    what: "This only affects England. Planning in Scotland is run by Holyrood and Scottish councils.",
  },
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
    by: "The Conservatives (Julia Lopez MP)",
    proposition: "halving the National Insurance employers pay on staff under 25, and criticising the government for raising it",
    what: "National Insurance is a tax on wages. The government raised the part bosses pay in its first Budget.",
    example: "The Conservatives say this broke Labour's election promise not to raise National Insurance.",
    yesMeans: 'Voted with the Conservatives to halve employer National Insurance for under 25s.',
    noMeans: "Voted against the Conservatives' call on employer National Insurance.",
  },
  {
    match: /government amendment to opposition day debate on welfare/i,
    title: "The government's reply on welfare spending",
    by: "The government (Sir Stephen Timms MP)",
    proposition: "swapping the Conservatives' words for the government's own, which blamed the last government for rising benefit costs and backed its welfare reforms",
    ifPassed: "The government's wording replaced the Conservatives' wording.",
    what: "When a party not in government brings a vote, the government can rewrite it. If the rewrite passes, the government's words replace theirs.",
    yesMeans: "Voted for the government's version on welfare.",
    noMeans: "Voted against the government's version on welfare.",
  },
  {
    match: /opposition day: welfare/i,
    title: 'Conservative call to cut welfare spending',
    by: "The Conservatives (Helen Whately MP)",
    proposition: "making the government promise to cut spending on benefits for people of working age before the next election",
    what: "Working age benefits include Universal Credit and disability benefits for people under pension age.",
    yesMeans: 'Voted with the Conservatives to cut working age welfare spending.',
    noMeans: "Voted against the Conservatives' call to cut welfare spending.",
  },
  {
    match: /opposition day: uk-eu relations/i,
    title: 'Conservative call to keep EU rules out of the UK',
    by: "The Conservatives (Mike Wood MP)",
    proposition: "keeping control of UK taxes, immigration and rules on goods in the UK, not the EU, and not paying the EU any extra money",
    what: "It also opposed the UK helping pay for EU students' university fees. The government is seeking closer trade ties with the EU.",
    yesMeans: 'Voted with the Conservatives against closer EU rules.',
    noMeans: "Voted against the Conservatives' call on EU relations.",
  },
  {
    match: /government amendment to opposition day debate on rosebank/i,
    title: "The government's reply on the Rosebank oilfield",
    by: "The government (Martin McCluskey MP)",
    proposition: "swapping the Conservatives' words for the government's own, which said ministers would not decide in advance on Rosebank",
    ifPassed: "The government's wording replaced the Conservatives' wording.",
    what: "When a party not in government brings a vote, the government can rewrite it. If the rewrite passes, the government's words replace theirs.",
    yesMeans: "Voted for the government's version on Rosebank.",
    noMeans: "Voted against the government's version on Rosebank.",
  },
  {
    match: /opposition day: rosebank/i,
    title: 'Conservative call to approve the Rosebank oilfield',
    by: "The Conservatives (Andrew Bowie MP)",
    proposition: "approving the Rosebank oil field west of Shetland as soon as possible, for jobs and energy supply",
    what: "Rosebank is a large oil and gas field west of Shetland. Ministers are still making a legal decision on whether it can go ahead.",
    example: "It matters for oil and gas jobs in the North East of Scotland.",
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
    what: "Raises the windfall tax on some electricity generators from 45% to 55%, raises tax free mileage pay from 45p to 55p a mile, and cuts lorry tax for a year.",
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
    by: "The Lib Dems (Tim Farron MP)",
    proposition: "criticising the government after a farm grants scheme ran out of money within hours, and over cuts to farm budgets",
    what: "The scheme pays farmers to look after nature and the land. It opened in September 2026.",
    example: "Farm support in Scotland is run by the Scottish Government, so this was about England.",
    yesMeans: "Voted with the Lib Dems to criticise the government on farm support.",
    noMeans: "Voted with the government against the Lib Dems' criticism.",
  },
  {
    match: /opposition day motion: inheritance tax/i,
    title: "Conservative call to scrap inheritance tax",
    by: "The Conservatives (Andrew Griffith MP)",
    proposition: "cutting public spending so inheritance tax can be scrapped on family homes, farms and businesses",
    what: "Inheritance tax is paid on what people leave behind when they die, above a tax free limit.",
    example: "It is set at Westminster, so it applies in Scotland too.",
    yesMeans: "Voted with the Conservatives to scrap inheritance tax on homes, farms and businesses.",
    noMeans: "Voted against the Conservatives' call to scrap inheritance tax.",
  },
  {
    match: /mod bicester and illegal migrants/i,
    title: "Conservative call to leave the European Convention on Human Rights",
    by: "The Conservatives (Joy Morrissey MP)",
    proposition: "opposing the plan to house asylum seekers at an army base in Bicester, and calling for the UK to leave the European Convention on Human Rights",
    what: "The government plans to house up to 1,300 asylum seekers at a former army base near Piddington, a village of about 350 people in Oxfordshire.",
    example: "The European Convention on Human Rights is the treaty behind many court cases that stop deportations.",
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
    title: "Cutting jury trials to clear court backlogs",
    what: "Cuts the right to choose a jury trial for some crimes and doubles magistrates' sentencing powers, to clear court backlogs.",
    example: "It covers England and Wales. Scotland has its own courts.",
    yesMeans: "Voted for this part of the courts law.",
    noMeans: "Voted against this part of the courts law.",
  },
  {
    match: /health bill/i,
    title: "Scrapping NHS England",
    what: "Scraps NHS England and Healthwatch, and moves their jobs to the Health Department and local health boards.",
    example: "It covers the NHS in England. Scotland runs its own NHS.",
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
export function voteSubstance(title: string, date?: string): Omit<SubstanceEntry, "match"> | null {
  for (const entry of SUBSTANCE) {
    if (entry.date && (!date || !date.startsWith(entry.date))) continue;
    if (entry.match.test(title)) {
      const { match: _match, ...rest } = entry;
      void _match;
      return rest;
    }
  }
  return null;
}

/** Whether the vote passed, from Parliament's "330 Aye, 199 No" style result. */
export function votePassed(result: string | undefined): boolean | null {
  if (!result) return null;
  const m = result.match(/(\d+)\s*ayes?\s*,?\s*(\d+)\s*no(?:es)?\b/i);
  if (!m) return null;
  return parseInt(m[1], 10) > parseInt(m[2], 10);
}

/** "The Conservatives (Mike Wood MP)" -> "Conservative"; null for the government. */
function partyWord(by?: string): string | null {
  if (!by || /^the government/i.test(by)) return null;
  if (/conservative/i.test(by)) return "Conservative";
  if (/lib dem/i.test(by)) return "Lib Dem";
  if (/\bDUP\b/.test(by)) return "DUP";
  if (/\bUUP\b/.test(by)) return "UUP";
  if (/labour/i.test(by)) return "Labour backbench";
  if (/independent/i.test(by)) return "independent MP's";
  return "backbench";
}

/** The short thing an MP voted for or against: "this Conservative plan". */
function voteThing(title: string, by?: string): string {
  const party = partyWord(by);
  if (/government amendment to opposition/i.test(title)) return "the government's version";
  if (/reasoned amendment/i.test(title)) return `this ${party ?? "party"} bid to block the law`;
  if (/opposition day/i.test(title)) return `this ${party ?? "party"} plan`;
  if (/king.?s speech motion for an address$/i.test(title)) return "the government's plan for the year";
  if (/(^draft |\bregulations\b|\border\s+20\d\d|code of practice)/i.test(title) && !/bill/i.test(title))
    return "these new rules";
  if (/lords amendment/i.test(title)) return "this change from the House of Lords";
  if (/new clause|amendment/i.test(title)) return party ? `this ${party} change` : "this government change";
  if (/third reading|stage 3/i.test(title)) return "the new law at its final vote";
  if (/second reading|stage 1/i.test(title)) return "the new law at its first big vote";
  if (/budget resolution/i.test(title)) return "this Budget tax change";
  if (/closure/i.test(title)) return "this move to end the debate";
  if (/sit in private/i.test(title)) return "this delaying move";
  if (/carry-over|programme motion|allocation of time/i.test(title)) return "this timetable move";
  return "this";
}

function sentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * The plain story of one MP's vote, built to read in seconds:
 * - stance: "Seamus Logan voted against this Conservative plan."
 * - meant: what a yes vote supported, stated positively
 * - result: "Voted down (103 for, 274 against). Nothing changed."
 */
export function voteStory(
  title: string,
  vote: string,
  name: string,
  result?: string,
  date?: string,
): { stance: string; meant?: string; by?: string; result?: string; passed: boolean | null } {
  const sub = voteSubstance(title, date);
  const isYes = /^(aye|yes|for)$/i.test(vote);
  const isNo = /^(no|against)$/i.test(vote);

  let stance = inferStance(title, vote);
  if (sub?.proposition && (isYes || isNo)) {
    stance = `${name} voted ${isYes ? "for" : "against"} ${voteThing(title, sub.by)}.`;
  } else if (isYes || isNo) {
    stance = `${name}: ${stance.charAt(0).toLowerCase()}${stance.slice(1)}`;
  }

  const passed = votePassed(result);
  const counts = result?.match(/(\d+)\s*ayes?\s*,?\s*(\d+)\s*no(?:es)?\b/i);
  const tally = counts ? ` (${counts[1]} for, ${counts[2]} against)` : "";
  const isPartyVote = /opposition day/i.test(title) && !/government amendment/i.test(title);

  let line: string | undefined;
  if (passed === true) {
    const after =
      sub?.ifPassed ??
      (isPartyVote
        ? "It is only a statement, so it does not change the law."
        : /reasoned amendment/i.test(title)
          ? "The law was blocked."
          : /third reading/i.test(title)
            ? "The law cleared the House of Commons."
            : /second reading/i.test(title)
              ? "The law moved on to its next stage."
              : "It goes ahead.");
    line = `Passed${tally}. ${after}`;
  } else if (passed === false) {
    const after =
      sub?.ifRejected ??
      (/reasoned amendment/i.test(title)
        ? "The law carried on."
        : /(second|third) reading/i.test(title)
          ? "The law was stopped."
          : "Nothing changed.");
    line = `Voted down${tally}. ${after}`;
  }

  return {
    stance,
    meant: sub?.proposition ? `${sentenceCase(sub.proposition)}.` : undefined,
    by: sub?.by,
    result: line,
    passed,
  };
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
