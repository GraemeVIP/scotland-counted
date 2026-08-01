/**
 * Plain-English articles and their search/wayfinding metadata.
 *
 * The first screen gives a normal reader the answer. The same article then
 * exposes the dates, definitions and original sources that a journalist or
 * representative may need to check it.
 */

export const postCategories = [
  {
    slug: "money-and-bills",
    name: "Money and bills",
    description: "Why food, rent, energy and wages no longer add up in Scotland — what each one actually costs now, and who controls the rules that set the price.",
    color: "var(--action)",
  },
  {
    slug: "poverty-explained",
    name: "Poverty explained",
    description: "The words and the numbers stripped of jargon: what poverty officially means, how it is measured in Scotland, and the proof under every figure.",
    color: "var(--brand)",
  },
  {
    slug: "take-action",
    name: "Take action",
    description: "Simple ways to make the people with power answer for what they decide — who to write to, what to ask, and what happens after you press send.",
    color: "var(--good)",
  },
] as const;

export type PostCategorySlug = (typeof postCategories)[number]["slug"];

export type Post = {
  slug: string;
  title: string;
  /** Meta description and card text. Written for a search result, not a headline. */
  description: string;
  /** The opening line on the post itself. */
  standfirst: string;
  /** ISO date published. */
  date: string;
  /** ISO date last checked or revised. */
  updated?: string;
  category: PostCategorySlug;
  tags: string[];
  readingMinutes: number;
  featured?: boolean;
  image: {
    src: string;
    alt: string;
    caption: string;
    objectPosition?: string;
  };
  /** Explicit headings keep the contents list honest and stable. */
  toc: { id: string; label: string }[];
  /** Feeds FAQPage structured data and the questions block at the foot. */
  faq: { q: string; a: string }[];
  /** Source ids from src/lib/data/sources.ts. */
  sourceIds: string[];
};

export const posts: Post[] = [
  {
    slug: "council-tax-in-scotland-guide",
    title: "Council tax in Scotland: the simple guide nobody gives you",
    description:
      "A plain-English guide to council tax in Scotland: bands, bills, water, discounts, reductions, appeals, moving home, arrears and empty homes.",
    standfirst:
      "Your bill is a mix of a property band, your council's rate and Scottish Water charges. Here are the ten things that explain almost everything — followed by the exact sources.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Council tax", "Council tax bands", "Council Tax Reduction", "Scottish Water"],
    readingMinutes: 9,
    image: {
      src: "/images/editorial/council-tax-scotland-guide.webp",
      alt: "A Glasgow resident working through a council tax bill with a notebook and calculator at his kitchen table",
      caption:
        "The bill looks complicated because three different things are mixed together. Once they are separated, it becomes much easier to check.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "what-it-pays-for", label: "1. What council tax pays for" },
      { id: "who-pays", label: "2. Who has to pay" },
      { id: "band", label: "3. What your band means" },
      { id: "bill", label: "4. How the bill is worked out" },
      { id: "water", label: "5. Why water is on the bill" },
      { id: "discounts", label: "6. Discounts and exemptions" },
      { id: "reduction", label: "7. Help on a low income" },
      { id: "challenge", label: "8. Challenging a band" },
      { id: "moving", label: "9. Moving or missing payments" },
      { id: "empty-homes", label: "10. Empty and second homes" },
    ],
    faq: [
      {
        q: "How do I find my council tax band in Scotland?",
        a: "Look up the property free on the Scottish Assessors Association website. A postcode can find the council area, but it cannot prove the band because neighbouring homes can be different.",
      },
      {
        q: "Does Scottish council tax include water?",
        a: "The bill usually does. Your council collects separate water and waste-water charges for Scottish Water. That is why a council-tax-only figure can be hundreds of pounds lower than the bill that arrives.",
      },
      {
        q: "Can Council Tax Reduction wipe out the whole bill?",
        a: "It can reduce the council tax part by up to 100%, depending on income and household circumstances. Water charges can remain, although an automatic water reduction of up to 35% may apply.",
      },
    ],
    sourceIds: [
      "council-tax-how-it-works",
      "council-tax-scotland",
      "scottish-water-2026",
      "council-tax-discounts",
      "council-tax-reduction-2026",
      "council-tax-band-proposals",
      "council-tax-arrears",
      "council-tax-empty-homes-2026",
    ],
  },
  {
    slug: "minimum-wage-take-home-pay-scotland-2026",
    title: "What minimum wage actually pays in Scotland in 2026",
    description:
      "Minimum wage in Scotland is £12.71 an hour. See the weekly, monthly and yearly pay, and what is left after Scottish tax and National Insurance.",
    standfirst:
      "£12.71 an hour sounds clear. A payslip is not. We have done the tax and National Insurance working for a 37.5-hour week so you can see what reaches the bank.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Minimum wage", "Take-home pay", "Scottish income tax", "Low pay"],
    readingMinutes: 6,
    image: {
      src: "/images/editorial/minimum-wage-take-home-scotland.webp",
      alt: "A supermarket worker checking a payslip and phone calculator during her break",
      caption:
        "Minimum wage is an hourly floor, not a guaranteed salary. Hours, unpaid time off, tax and National Insurance decide what reaches the bank.",
      objectPosition: "center 40%",
    },
    toc: [
      { id: "rates", label: "The 2026 hourly rates" },
      { id: "full-time", label: "What full-time adds up to" },
      { id: "take-home", label: "What reaches the bank" },
      { id: "hours", label: "Why your pay may be lower" },
      { id: "enough", label: "Is it enough to live on?" },
    ],
    faq: [
      {
        q: "What is minimum wage in Scotland in 2026?",
        a: "From 1 April 2026 it is £12.71 an hour for workers aged 21 and over, £10.85 for ages 18 to 20, and £8 for under-18s and eligible apprentices.",
      },
      {
        q: "What is £12.71 an hour per year?",
        a: "At 37.5 paid hours every week for 52 weeks it is £24,784.50 gross a year. It is not a guaranteed annual salary: fewer paid hours or unpaid time off means less.",
      },
    ],
    sourceIds: ["minimum-wage-2026", "scottish-tax-2026", "ni-rates-2026", "mis-2025"],
  },
  {
    slug: "real-living-wage-vs-minimum-wage-scotland",
    title: "Minimum wage and the real Living Wage are not the same thing",
    description:
      "The legal minimum is £12.71 an hour in 2026. The real Living Wage is £13.45. See who sets each rate, who must pay it and what the difference is worth.",
    standfirst:
      "They sound almost identical. One is the legal floor an employer must pay. The other is a voluntary rate calculated from what ordinary life actually costs.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Real Living Wage", "Minimum wage", "Pay", "Living costs"],
    readingMinutes: 5,
    image: {
      src: "/images/editorial/real-living-wage-scotland.webp",
      alt: "Two café workers comparing their pay envelopes and rota before opening",
      caption:
        "The legal minimum is set from the labour market. The real Living Wage starts with the cost of a decent basic life.",
      objectPosition: "center 38%",
    },
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "legal", label: "The legal minimum" },
      { id: "real", label: "The real Living Wage" },
      { id: "difference", label: "What the gap is worth" },
      { id: "check", label: "How to check your employer" },
    ],
    faq: [
      {
        q: "Is the real Living Wage compulsory in Scotland?",
        a: "No. The legal minimum wage is compulsory. The independently calculated real Living Wage is voluntary unless an employer has promised it in a contract or pay policy.",
      },
      {
        q: "How much more is the real Living Wage?",
        a: "The current rate outside London is £13.45, which is 74p an hour above the 2026 legal rate for workers aged 21 and over. At 37.5 hours a week that is £1,443 gross a year.",
      },
    ],
    sourceIds: ["minimum-wage-2026", "real-living-wage", "mis-2025", "lpc-remit"],
  },
  {
    slug: "universal-credit-when-you-work-more-hours",
    title: "What happens to Universal Credit when you work more hours?",
    description:
      "Universal Credit does not stop when you work. See the 55% taper, the work allowance, and why an extra £1 of pay leaves only 45p of extra support.",
    standfirst:
      "Working more always leaves you with more total money. But the increase can feel painfully small because Universal Credit is reduced as earnings rise.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Universal Credit", "Work allowance", "Benefits", "Low pay"],
    readingMinutes: 6,
    image: {
      src: "/images/editorial/universal-credit-working.webp",
      alt: "A working parent comparing a work rota and household budget beside a laptop at home",
      caption:
        "A change in shifts can change both wages and Universal Credit. The calculation is monthly, which is why irregular pay can make awards jump around.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "taper", label: "How the 55% taper works" },
      { id: "allowance", label: "Who gets a work allowance" },
      { id: "example", label: "A simple example" },
      { id: "changes", label: "Why payments jump around" },
    ],
    faq: [
      {
        q: "Do you lose Universal Credit when you start work?",
        a: "Not automatically. Your award is recalculated from the earnings reported in each monthly assessment period. It reduces as earnings rise and can reach zero if income is high enough.",
      },
      {
        q: "What is the Universal Credit taper rate?",
        a: "Universal Credit normally falls by 55p for each £1 of take-home earnings counted above any work allowance. That means earnings still increase total household income.",
      },
    ],
    sourceIds: ["uc-earnings", "uc-what-youll-get", "minimum-wage-2026"],
  },
  {
    slug: "local-housing-allowance-rent-shortfall-scotland",
    title: "Why rent help does not cover the rent in much of Scotland",
    description:
      "Local Housing Allowance caps the Universal Credit help you get for private rent. Scotland's rates are frozen at 2024 levels while rents keep rising.",
    standfirst:
      "The benefit is meant to help with a cheaper local rent. In 2026 it is still using rates fixed from 2024, even though newer rent evidence is higher in most Scottish areas.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Local Housing Allowance", "Rent", "Universal Credit", "Housing"],
    readingMinutes: 6,
    image: {
      src: "/images/editorial/local-housing-allowance-rent-gap.webp",
      alt: "A prospective tenant checking a letting sheet and phone calculator inside a small Glasgow flat",
      caption:
        "Universal Credit does not promise to cover the rent written in a tenancy. For private renters, help is capped by area and bedroom need.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "what-it-is", label: "What Local Housing Allowance is" },
      { id: "frozen", label: "Why the rates are frozen" },
      { id: "glasgow", label: "The Greater Glasgow gap" },
      { id: "bedrooms", label: "Which bedroom rate applies" },
      { id: "help", label: "What to do about a shortfall" },
    ],
    faq: [
      {
        q: "Does Universal Credit pay all of your private rent?",
        a: "Not necessarily. The housing element is limited by Local Housing Allowance for your area and household size, or by your actual rent if that is lower.",
      },
      {
        q: "What is the one-bedroom LHA rate in Greater Glasgow in 2026?",
        a: "It is £159.95 a week from April 2026 to March 2027, about £693 a month. The Scottish Government's 2025 advertised-rent average for a one-bedroom Greater Glasgow property was £865 a month.",
      },
    ],
    sourceIds: ["lha-2026", "sg-private-rents-2025", "discretionary-housing-payment"],
  },
  {
    slug: "energy-price-cap-scotland-2026-explained",
    title: "The energy price cap does not cap your total bill",
    description:
      "Ofgem's energy price cap is £1,862 from July to September 2026 for a typical-use home. See what it really caps, why bills rose and how standing charges work.",
    standfirst:
      "£1,862 is not the most any household can pay. It is an illustration based on typical use. The cap controls the rates, so using more still costs more.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Energy price cap", "Energy bills", "Standing charge", "Cost of living"],
    readingMinutes: 6,
    image: {
      src: "/images/editorial/energy-price-cap-scotland.webp",
      alt: "A resident in a jumper adjusting a tenement radiator while holding an energy bill envelope",
      caption:
        "The cap limits unit rates and standing charges on default tariffs. It cannot stop a cold home from needing more energy.",
      objectPosition: "center 45%",
    },
    toc: [
      { id: "not-a-bill-cap", label: "Why it is not a bill cap" },
      { id: "rates", label: "The current rates" },
      { id: "standing", label: "The standing charge" },
      { id: "who", label: "Who the cap covers" },
      { id: "help", label: "If you cannot afford energy" },
    ],
    faq: [
      {
        q: "Is £1,862 the maximum energy bill in 2026?",
        a: "No. It is Ofgem's annual illustration for a typical-use dual-fuel household paying by Direct Debit. Your bill depends on the energy you use, your region, payment method and tariff.",
      },
      {
        q: "Does the energy price cap apply in Scotland?",
        a: "Yes. Ofgem's cap covers default domestic tariffs in England, Scotland and Wales. Regional unit rates and standing charges can differ.",
      },
    ],
    sourceIds: ["ofgem-cap-2026", "sg-cost-living-2025"],
  },
  {
    slug: "why-food-prices-stay-high-when-inflation-falls",
    title: "Why food prices stay high when inflation falls",
    description:
      "Lower inflation does not mean cheaper food. It means prices are rising more slowly. UK food prices were 38.6% higher in November 2025 than five years earlier.",
    standfirst:
      "The news says inflation is down. The supermarket receipt says the weekly shop is still dear. Both can be true at the same time.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Food prices", "Inflation", "Groceries", "Cost of living"],
    readingMinutes: 6,
    image: {
      src: "/images/editorial/food-prices-inflation.webp",
      alt: "A shopper comparing basic groceries with a shopping list in a supermarket aisle",
      caption:
        "Falling inflation changes the speed of price rises. It does not reverse the rises already built into bread, milk, vegetables and everything else.",
      objectPosition: "center 40%",
    },
    toc: [
      { id: "simple", label: "The simplest explanation" },
      { id: "numbers", label: "What happened to food prices" },
      { id: "why", label: "Why food rose so sharply" },
      { id: "fall", label: "Can prices actually fall?" },
      { id: "households", label: "Why low incomes feel it most" },
    ],
    faq: [
      {
        q: "Why are groceries still expensive if inflation is lower?",
        a: "Because inflation measures the rate of change, not the price level. If prices rise 10% and then inflation falls to 2%, the earlier rise stays and another 2% is added.",
      },
      {
        q: "How much did UK food prices rise?",
        a: "ONS data showed food and non-alcoholic drink prices were 38.6% higher in November 2025 than in November 2020.",
      },
    ],
    sourceIds: ["ons-food-prices", "ons-cpi-2026", "brexit-food-prices", "sg-cost-living-2025"],
  },
  {
    slug: "crisis-grant-scotland-how-to-apply",
    title: "Crisis Grant Scotland: how to apply and what you get",
    description:
      "A Scottish Welfare Fund Crisis Grant is emergency money you do not repay. Who can apply, what it covers, and how to claim through your council.",
    standfirst:
      "This is not a loan and it is not an advance from Universal Credit. It is a council grant for a low-income person facing an immediate emergency.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Crisis Grant", "Scottish Welfare Fund", "Emergency help", "Benefits"],
    readingMinutes: 5,
    image: {
      src: "/images/editorial/scottish-welfare-fund-crisis-grant.webp",
      alt: "A community adviser helping a resident complete an online application at a public computer",
      caption:
        "Applications go to the local council. Help should be practical and immediate; you do not have to produce perfect words or repay the grant.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "what-it-is", label: "What a Crisis Grant is" },
      { id: "who", label: "Who can apply" },
      { id: "covers", label: "What it can cover" },
      { id: "apply", label: "How to apply" },
      { id: "refused", label: "If the council says no" },
    ],
    faq: [
      {
        q: "Do you pay a Scottish Crisis Grant back?",
        a: "No. It is a grant from the Scottish Welfare Fund, not a loan or a Universal Credit advance.",
      },
      {
        q: "Can I get a Crisis Grant for food or heating?",
        a: "Yes, those are the kinds of immediate essentials a Crisis Grant can cover when an emergency has left a low-income person without money.",
      },
    ],
    sourceIds: ["scottish-welfare-fund"],
  },
  {
    slug: "discretionary-housing-payment-scotland",
    title: "Discretionary Housing Payments in Scotland, explained",
    description:
      "A Discretionary Housing Payment can top up rent when Universal Credit or Housing Benefit falls short, including the bedroom tax. How to apply in Scotland.",
    standfirst:
      "If you get help with rent but there is still a gap, your council has another fund. It can sometimes cover the shortfall, a deposit, rent in advance or moving costs.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Discretionary Housing Payment", "Rent", "Bedroom tax", "Benefit cap"],
    readingMinutes: 5,
    image: {
      src: "/images/editorial/discretionary-housing-payment.webp",
      alt: "A tenant on the phone comparing a tenancy document and household budget beside moving boxes",
      caption:
        "The payment is discretionary, so it is not automatic. A clear explanation of the rent gap and what would happen without help matters.",
      objectPosition: "center 40%",
    },
    toc: [
      { id: "what-it-is", label: "What the payment is" },
      { id: "who", label: "Who can apply" },
      { id: "covers", label: "What it may cover" },
      { id: "apply", label: "How to make a strong application" },
      { id: "next", label: "What happens next" },
    ],
    faq: [
      {
        q: "Who can get a Discretionary Housing Payment in Scotland?",
        a: "You must normally rent your home and already receive Housing Benefit or the housing element of Universal Credit. Your council then decides whether extra help is appropriate.",
      },
      {
        q: "Can a DHP cover a rent deposit?",
        a: "In some cases it can help with a deposit, rent in advance or removal costs, as well as an ongoing rent shortfall. Ask your council what its local fund will consider.",
      },
    ],
    sourceIds: ["discretionary-housing-payment", "lha-2026"],
  },
  {
    slug: "free-school-meals-clothing-grant-scotland",
    title: "Free school meals and clothing grants: what families can get",
    description:
      "Who gets free school meals in Scotland, how P1 to P5 works, the rules for older pupils, and how to claim £120 or £150 towards school clothing.",
    standfirst:
      "Some help is automatic, some has to be claimed, and the rules change with a child's school year. This is the short version for a busy parent.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Free school meals", "School clothing grant", "Families", "School costs"],
    readingMinutes: 5,
    image: {
      src: "/images/editorial/free-school-meals-clothing-grant.webp",
      alt: "A parent helping her primary-school child put on an unbranded school jumper before leaving home",
      caption:
        "School is free, but uniforms, shoes, lunches and holiday weeks still cost money. Several kinds of help can be claimed together.",
      objectPosition: "center 38%",
    },
    toc: [
      { id: "meals", label: "Who gets free school meals" },
      { id: "older", label: "The rules after P5" },
      { id: "clothing", label: "School clothing grants" },
      { id: "holidays", label: "Help in school holidays" },
      { id: "apply", label: "How to apply" },
    ],
    faq: [
      {
        q: "Are school meals free for every primary pupil in Scotland?",
        a: "Lunch is universal in council and Scottish Government-funded schools from primary 1 to primary 5. In primary 6 and 7, Scottish Child Payment or another qualifying benefit can give entitlement.",
      },
      {
        q: "How much is the school clothing grant in Scotland?",
        a: "Every council must pay at least £120 for a primary-age child and £150 for a secondary-age child. Councils set local eligibility rules and may pay more.",
      },
    ],
    sourceIds: ["free-school-meals-2026", "school-clothing-grants", "sg-child-payment-2026"],
  },
  {
    slug: "why-is-the-cost-of-living-so-high",
    title: "Why is the cost of living still so high in Scotland?",
    description:
      "The cost of living crisis in Scotland did not end when inflation fell. Why food, rent and energy stay expensive, and which decisions made it worse.",
    standfirst:
      "War and the pandemic pushed prices up. That is true. It is also true that political choices left ordinary families with less protection — and added avoidable costs of their own.",
    date: "2026-08-01",
    updated: "2026-08-01",
    category: "money-and-bills",
    tags: ["Cost of living", "Food", "Energy", "Rent", "Universal Credit"],
    readingMinutes: 10,
    featured: true,
    image: {
      src: "/images/editorial/glasgow-cost-of-living.webp",
      alt: "A supermarket worker at a Glasgow kitchen table checking household bills beside a bag of groceries",
      caption:
        "The squeeze is not one bill. Food, energy, rent and tax all land on the same household income.",
      objectPosition: "center 48%",
    },
    toc: [
      { id: "what-is-happening", label: "What is happening now" },
      { id: "what-started-it", label: "What started the crisis" },
      { id: "decisions-made-it-worse", label: "The choices that made it worse" },
      { id: "glasgow-hit", label: "Why Glasgow feels it harder" },
      { id: "what-helped", label: "Decisions that did help" },
      { id: "who-can-fix-it", label: "Who can fix what" },
    ],
    faq: [
      {
        q: "Has the cost of living crisis ended because inflation is lower?",
        a: "No. Lower inflation means prices are rising more slowly; it does not put them back where they were. By March 2026, the ONS Household Costs Index was about 34% higher than five years earlier for low-income households.",
      },
      {
        q: "Did MPs cause the cost of living crisis?",
        a: "Not by themselves. Pandemic disruption and Russia’s invasion of Ukraine caused major global food and energy shocks. But UK governments and MPs made choices on benefits, rent support, trade, tax and the 2022 mini-budget that left households more exposed or added extra cost.",
      },
      {
        q: "Who controls help with the cost of living in Scotland?",
        a: "Both parliaments do. Westminster controls Universal Credit, Local Housing Allowance, the legal minimum wage, most tax allowances and energy regulation. Holyrood controls the Scottish Child Payment, housing, Scottish income-tax bands, childcare and much of public transport. Councils control local crisis support and services.",
      },
    ],
    sourceIds: [
      "ons-cpi-2026",
      "ons-household-costs-2026",
      "sg-cost-living-2025",
      "sg-private-rents-2025",
      "welfare-freeze-act",
      "welfare-freeze-vote",
      "welfare-freeze-impact",
      "uc-uplift-withdrawal",
      "lha-2026",
      "mini-budget-2022",
      "brexit-food-prices",
      "nao-energy-market",
      "obr-tax-thresholds-2025",
      "scottish-housing-budget",
      "sg-child-payment-2026",
      "cpag",
      "minimum-wage-2026",
      "mis-2025",
    ],
  },
  {
    slug: "do-people-in-poverty-work",
    title: "Most children in poverty in Scotland have a parent who works",
    description:
      "Three out of four children living in poverty in Scotland have a parent in work. Here is what that means, and why working more hours does not fix it.",
    standfirst:
      "The most common thing said about poverty is that people should get a job. Most of them already have one.",
    date: "2026-07-31",
    category: "poverty-explained",
    tags: ["Work", "Low pay", "Housing costs"],
    readingMinutes: 4,
    image: {
      src: "/images/editorial/scotland-working-family.webp",
      alt: "A parent in work clothes walking home with her school-age child and a bag of groceries",
      caption:
        "Having a job is no longer a guaranteed route out of poverty. Most children in poverty have a working parent.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "why-work-does-not-fix-it", label: "Why work does not fix it" },
      { id: "housing-costs", label: "How housing changes the picture" },
      { id: "what-this-changes", label: "What this changes" },
    ],
    faq: [
      {
        q: "Do most people in poverty work?",
        a: "Yes. In Scotland, about 75% of children living in poverty are in a household where at least one adult works. Work has stopped being a reliable way out of poverty.",
      },
      {
        q: "Why does working not lift a family out of poverty?",
        a: "Three things: wages that have not kept up with prices, hours that are part-time or unpredictable, and housing costs that take a large share of what is left. Poverty is measured after rent or mortgage is paid.",
      },
    ],
    sourceIds: ["sg-poverty-2026", "jrf"],
  },
  {
    slug: "what-does-poverty-mean",
    title: "What does poverty actually mean in the UK?",
    description:
      "Poverty has an official definition, and it is not what most people assume. What the poverty line is in pounds a week, and why 'after housing costs' matters.",
    standfirst:
      "The word gets used loosely. The measure behind it is precise, and knowing it makes every other number on this site readable.",
    date: "2026-07-31",
    category: "poverty-explained",
    tags: ["Poverty line", "Housing costs", "Definitions"],
    readingMinutes: 5,
    image: {
      src: "/images/editorial/glasgow-everyday-street.webp",
      alt: "People walking along a wet Glasgow tenement street after rain",
      caption:
        "Poverty is not a type of person or place. It is a household being left with too little to take part in ordinary life.",
    },
    toc: [
      { id: "short-version", label: "The short version" },
      { id: "real-money", label: "What it means in pounds" },
      { id: "after-housing-costs", label: "Why housing matters" },
      { id: "three-measures", label: "Three different measures" },
      { id: "where-scotland-stands", label: "Where Scotland stands" },
    ],
    faq: [
      {
        q: "What is the poverty line in the UK?",
        a: "A household is in relative poverty when it has less than 60% of the usual UK household income. In 2022/23, after housing costs, a couple with two young children needed more than £407 a week to be above it.",
      },
      {
        q: "What does 'after housing costs' mean?",
        a: "Rent or mortgage is taken off the household's income before the comparison is made. It is the money actually available for everything else, so it is the fairer measure in places where housing is expensive.",
      },
    ],
    sourceIds: ["sg-poverty-2026", "thresholds"],
  },
  {
    slug: "what-is-the-scottish-child-payment",
    title: "What is the Scottish Child Payment, and who can get it?",
    description:
      "A weekly payment for every child in a low-income family in Scotland. What it is worth, who can get it, and why many eligible families never claim.",
    standfirst:
      "It does not exist anywhere else in the UK, and some families who are entitled to it have never claimed it.",
    date: "2026-07-31",
    updated: "2026-08-01",
    category: "money-and-bills",
    tags: ["Benefits", "Families", "Scottish Child Payment"],
    readingMinutes: 4,
    image: {
      src: "/images/editorial/scotland-secure-homes.webp",
      alt: "Two children arriving home from school to a secure family home",
      caption:
        "The payment is designed to give low-income families more room for everyday essentials, for every eligible child.",
      objectPosition: "center 44%",
    },
    toc: [
      { id: "who-can-get-it", label: "Who can get it" },
      { id: "why-it-matters", label: "Why it matters" },
      { id: "who-decides", label: "Who decides it" },
      { id: "take-up", label: "The money going unclaimed" },
    ],
    faq: [
      {
        q: "How much is the Scottish Child Payment?",
        a: "As of April 2026 it is £28.20 per child per week, paid for every child in a low-income family. It is set to rise to £40 a week for children under one from 2027.",
      },
      {
        q: "Who decides the Scottish Child Payment?",
        a: "The Scottish Parliament in Edinburgh. It is a devolved payment, so your MSP can be asked about it. Most other benefits, including Universal Credit, are decided at Westminster by your MP.",
      },
    ],
    sourceIds: ["cpag", "jrf"],
  },
  {
    slug: "how-to-contact-your-mp-or-msp",
    title: "How to contact your MP or MSP (and what to actually say)",
    description:
      "You do not need to know anything about politics to write to the people who represent you. What to say, what happens next, and how to do it in about a minute.",
    standfirst:
      "Most people never contact their representatives, and the main reason is not apathy. It is not knowing how it works.",
    date: "2026-07-31",
    category: "take-action",
    tags: ["MP", "MSP", "Email"],
    readingMinutes: 4,
    image: {
      src: "/images/editorial/email-your-representative.webp",
      alt: "A woman writing an email on a laptop at her Glasgow kitchen table",
      caption:
        "You do not need political knowledge or perfect words. You live in their area, so you are entitled to ask for an answer.",
      objectPosition: "center 38%",
    },
    toc: [
      { id: "mp-and-msp", label: "Your MP and your MSP" },
      { id: "what-to-say", label: "What to actually say" },
      { id: "what-happens-next", label: "What happens next" },
      { id: "one-minute-version", label: "The one-minute version" },
    ],
    faq: [
      {
        q: "Do I have to have voted for my MP to contact them?",
        a: "No. An MP represents everyone who lives in their area, whether they voted for them, voted against them, or did not vote at all. They still have to deal with your case.",
      },
      {
        q: "What is the difference between an MP and an MSP?",
        a: "Your MP works in the UK Parliament in London and helps decide Universal Credit, most benefits and help with private rent. Your MSP works in the Scottish Parliament in Edinburgh and helps decide the Scottish Child Payment, housing, childcare and schools. You have both.",
      },
      {
        q: "Will my MP actually reply?",
        a: "Usually yes, though it can take a few weeks. Offices log what constituents write about, so the volume of letters on a subject matters even when an individual reply is short.",
      },
    ],
    sourceIds: [],
  },
];

export const POST_COUNT = posts.length;

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function getPostCategory(slug: string) {
  return postCategories.find((category) => category.slug === slug);
}

export function postsInCategory(slug: string) {
  return postsByDate().filter((post) => post.category === slug);
}

/** Newest first, which is how the index and the feed should read. */
export function postsByDate() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

/** Other posts, prioritising the same category and then recency. */
export function relatedPosts(slug: string, limit = 2) {
  const current = getPost(slug);
  if (!current) return [];
  const others = postsByDate().filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  return [
    ...sameCategory,
    ...others.filter((p) => p.category !== current.category),
  ].slice(0, limit);
}
