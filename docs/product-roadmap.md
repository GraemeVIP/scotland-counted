# Product roadmap

Products worth building, with the data and safeguards each one needs.

Nothing here is implemented. Each entry records what would have to be true
before it could be, so that a future decision starts from the constraints
rather than from the idea.

## Local alerts

**Tell me when the figures, audit record or council budget for my area change.**

The newsletter exists and works. What does not exist is any way to say "only my
council", which is the version people actually want.

### What it needs

| Requirement | Status |
| --- | --- |
| Council preference per subscriber | Not possible with the current form, which posts to a forwarding service and stores nothing |
| Topic preference (budget, audit, benchmarking) | Same |
| Frequency preference | Same |
| A data-update trigger | Partly. `/updates` already logs changes, but nothing watches it |
| Unsubscribe per topic | Not possible without stored state |

### The blocker, stated plainly

Storing a council preference means storing subscriber records, which means
subscription storage and privacy work. Both are explicitly out of scope for the
current work, so the homepage says alerts for one area are planned rather than
pretending they exist.

### Minimum honest version

Send one email per data release covering all 32 councils, with the per-council
figures in it, and let the reader find their own. That needs no stored
preference and is what happens today.

### Administrative workflow, if built

1. A data release lands and `/updates` records it.
2. The release generator produces per-council lines.
3. Subscribers matching a council receive only their section.
4. Every email carries the source and a one-click unsubscribe.

## Household money product

**One place that combines everything that decides what is left at the end of
the month.**

Take-home pay and council tax already exist as separate calculators. The
combination is the product.

### Inputs

Pay, pension contributions, student loan plan, council tax band and council,
housing costs, childcare, and the benefits that taper against earnings.

### The hard constraint

**Everything entered stays in the browser.** The two existing calculators work
that way and the combined one must too. That rules out saved scenarios across
devices, and rules out any comparison feature that needs a server to hold the
numbers.

A shareable scenario would have to encode the inputs in the URL, which is a
privacy decision in its own right and should not be taken casually.

### What is already available

- Scottish income tax bands and National Insurance: in `lib/tax/engine.ts`
- Council tax by band and council, including water: in `lib/data/councilTax.ts`
- Local Housing Allowance rates: referenced in explainers, not yet structured
- Childcare costs: not held anywhere

Two of the five inputs would need new sourced datasets before this could be
built without inventing numbers.

## Representative response tracker

**Did they answer?**

Voluntary reports from people who used the letter tool: email sent,
acknowledgement received, reply received, time taken, question answered, or no
reply after a stated period.

### Why it is dangerous

It is a system for publishing judgements about named people based on
self-reported, unverifiable data. Done badly it is defamatory, gameable, and
exactly the kind of political claim the site's editorial rules prohibit.

### Safeguards it would need

- A minimum sample before any figure is published for a representative
- No public ranking from a single report, ever
- No publication of the correspondence itself without the sender's permission
- Rate limiting and duplicate detection, because an organised group could
  otherwise manufacture a record
- A stated, published methodology including what counts as a reply
- Aggregate reporting only, at the level of "this many people reported no reply
  within four weeks", not "this MP ignores constituents"
- A right of reply for the representative before anything is published

### Recommendation

Build the private collection first and publish nothing for at least six months.
If the data does not survive its own methodology, it should not be published at
all.

## Annual flagship reports

Recurring products that give the site a publishing rhythm and a reason to be
cited.

| Report | Data needed | Status |
| --- | --- | --- |
| State of Scotland's Councils | Audit Scotland budget bulletin, LGBF benchmarking, annual audits | Both sources already ingested. Could be produced now |
| Scottish Household Money Report | Tax engine, council tax, wage data, cost-of-living series | Sources exist, no year-on-year comparison held |
| Who Answered Scotland | Response tracker | Blocked on the tracker above and its safeguards |
| Council Promises Versus Outcomes | Commitments and outcomes in `councilAccountability*.ts` | Data model exists, most records have commitments but few have verified outcomes |
| Cost of Living by Council Area | Council tax, housing costs, pay by area | Housing costs by area not yet held |

Only the first is genuinely ready. The others each need one dataset that does
not exist yet, and the honest order is to build the data before announcing the
report.

## Deliberately not on this roadmap

- **A single council league table.** The site refuses to produce one, because
  cost, outcome, satisfaction and audit findings are different things and
  averaging them produces a number that means nothing.
- **Automated political claims.** Nothing that generates a statement about a
  named person without a human reading it first.
- **Automated email or social posting.** Distribution stays manual, for the
  reasons set out in the distribution playbook.
