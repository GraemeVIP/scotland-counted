import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, SectionHead, CTA } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import SharePage from "@/components/SharePage";
import Faq from "@/components/Faq";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";

/*
 * The receipts: single IPSA claim lines by Scottish MPs that most people would
 * never guess are paid from public money. Every figure and every quoted
 * description is copied from IPSA's 2025/26 individualBusinessCosts file
 * (checked 21 November 2026). Yearly totals match mpInterests.json, which
 * feeds the main MP expenses page.
 */

const PATH = "/mp-expenses-scotland/receipts";
const PUBLISHED_ISO = "2026-11-21";
const HERO_IMAGE = {
  src: "/images/editorial/refresh-court-records.webp",
  alt: "Official parliamentary folders and financial ledgers on a desk, for the receipts behind Scottish MPs' expense claims",
  width: 1500,
  height: 1000,
};
const IPSA_YOUR_MP = "https://www.theipsa.org.uk/mp-staffing-business-costs/your-mp";
const IPSA_DOWNLOADS = "https://www.theipsa.org.uk/mp-staffing-business-costs/annual-publications";

export const metadata = meta({
  title: "Strangest Scottish MP Expenses: The Receipts (2025/26)",
  description:
    "£3,000 for a speech coach, £546 to jet-wash a second home's drains, a £1,248 iPhone, DFS and IKEA furniture. The real IPSA receipts behind Scottish MPs' expenses.",
  path: PATH,
  type: "article",
  published: PUBLISHED_ISO,
  modified: PUBLISHED_ISO,
  image: HERO_IMAGE.src,
  imageAlt: HERO_IMAGE.alt,
  imageWidth: HERO_IMAGE.width,
  imageHeight: HERO_IMAGE.height,
  imageType: "image/webp",
});

type Receipt = {
  amount: string;
  what: string;
  mp: string;
  party: string;
  seat: string;
  slug: string;
  date: string;
  budget: string;
  /** IPSA's own wording, copied exactly. */
  ipsa: string[];
  context: string;
};

const RECEIPTS: Receipt[] = [
  {
    amount: "£3,000",
    what: "A speech and presentation skills workshop",
    mp: "Angus MacDonald",
    party: "Liberal Democrat",
    seat: "Inverness, Skye and West Ross-shire",
    slug: "inverness-skye-and-west-ross-shire",
    date: "17 July 2025",
    budget: "Staffing budget",
    ipsa: [
      "Provision of personalised presentation and speech skills workshop to assist MPs representational role in Parliament.",
    ],
    context:
      "Speaking in Parliament is the core of an MP's job. This came out of his staffing budget, the money meant for the staff who help constituents.",
  },
  {
    amount: "£546",
    what: "Jet-washing the drains at his second home",
    mp: "Angus MacDonald",
    party: "Liberal Democrat",
    seat: "Inverness, Skye and West Ross-shire",
    slug: "inverness-skye-and-west-ross-shire",
    date: "24 and 27 March 2026",
    budget: "Accommodation budget",
    ipsa: [
      "Drainage professional pressure jet wash cleaning (£312)",
      "Drainage professional mechanical cable cleaning (£234)",
    ],
    context:
      "Filed under accommodation, the budget for MPs' second homes. The same year he also billed £3,314 for that home's energy bills.",
  },
  {
    amount: "£20,385",
    what: "One energy bill",
    mp: "Lillian Jones",
    party: "Labour",
    seat: "Kilmarnock and Loudoun",
    slug: "kilmarnock-and-loudoun",
    date: "19 May 2026",
    budget: "Miscellaneous",
    ipsa: ["Lillian Jones - Yu Energy Utilities - 2000294348"],
    context:
      "A single payment of £20,384.74, filed as miscellaneous. The record does not say which building or which months it covers. The typical household energy bill is £2,166 a year.",
  },
  {
    amount: "£1,248",
    what: "An iPhone and a case",
    mp: "John Lamont",
    party: "Conservative",
    seat: "Berwickshire, Roxburgh and Selkirk",
    slug: "berwickshire-roxburgh-and-selkirk",
    date: "12 June 2025",
    budget: "Office budget",
    ipsa: ["Iphone and protection case"],
    context:
      "One phone and its case, paid for by taxpayers. The record does not say which model.",
  },
  {
    amount: "£3,182",
    what: "Furniture from DFS and IKEA",
    mp: "Pamela Nash",
    party: "Labour",
    seat: "Motherwell, Wishaw and Carluke",
    slug: "motherwell-wishaw-and-carluke",
    date: "April 2025 to March 2026",
    budget: "Office budget",
    ipsa: [
      "IKEA LTD SHOP ONLINE (£1,334, £395 and £245)",
      "DFS TRADING LIMITED (£1,208)",
    ],
    context:
      "Filed as office equipment. In the same year she also billed £2,750 for a new office carpet and £2,250 for refurbishment works.",
  },
  {
    amount: "£7,314",
    what: "Lawyers' fees and new furniture for an office move",
    mp: "Tracy Gilbert",
    party: "Labour",
    seat: "Edinburgh North and Leith",
    slug: "edinburgh-north-and-leith",
    date: "May 2025",
    budget: "Office budget",
    ipsa: [
      "Legal advice and costs (£3,044)",
      "FURNITURE@WORK LTD (£3,332.40 and £937.20)",
    ],
    context: "£3,044 for lawyers and £4,270 for furniture, all in one month.",
  },
  {
    amount: "£510",
    what: "A staff Christmas lunch and a team building event",
    mp: "Christine Jardine",
    party: "Liberal Democrat",
    seat: "Edinburgh West",
    slug: "edinburgh-west",
    date: "19 December 2025",
    budget: "Office hospitality",
    ipsa: ["lunch staff team training Christmas (£250.80)", "team building event (£259.31)"],
    context: "Both claimed on the same day, six days before Christmas, and paid by taxpayers.",
  },
  {
    amount: "£550",
    what: "A hospitality event for local business owners",
    mp: "Susan Murray",
    party: "Liberal Democrat",
    seat: "Mid Dunbartonshire",
    slug: "mid-dunbartonshire",
    date: "7 July 2025",
    budget: "Office hospitality",
    ipsa: ["Hospitality event for Business owners of Mid Dunbartonshire."],
    context: "Food and drink for local business owners, paid from public money.",
  },
];

const BIG_TABS: { mp: string; slug: string; party: string; what: string; amount: string; note: string }[] = [
  {
    mp: "Dr Zubir Ahmed",
    slug: "glasgow-south-west",
    party: "Labour",
    what: "London hotels",
    amount: "£43,475",
    note: "323 nights in one year, instead of renting a flat",
  },
  {
    mp: "John Grady",
    slug: "glasgow-east",
    party: "Labour",
    what: "London flat rent",
    amount: "£42,000",
    note: "£3,500 a month, the highest in Scotland",
  },
  {
    mp: "Melanie Ward",
    slug: "cowdenbeath-and-kirkcaldy",
    party: "Labour",
    what: "Family travel",
    amount: "£7,932",
    note: "Flights and trains for her family, the highest in Scotland",
  },
  {
    mp: "Chris Law",
    slug: "dundee-central",
    party: "SNP",
    what: "Car parking",
    amount: "£6,292",
    note: "About £121 a week, every week of the year",
  },
  {
    mp: "Gregor Poynton",
    slug: "livingston",
    party: "Labour",
    what: "Taxis",
    amount: "£5,233",
    note: "More than £100 a week",
  },
  {
    mp: "Douglas Alexander",
    slug: "lothian-east",
    party: "Labour (Co-op)",
    what: "Second home council tax",
    amount: "£4,093",
    note: "On a home where he claims no rent",
  },
  {
    mp: "Angus MacDonald",
    slug: "inverness-skye-and-west-ross-shire",
    party: "Liberal Democrat",
    what: "Second home energy bills",
    amount: "£3,314",
    note: "On a home where he claims no rent",
  },
  {
    mp: "Chris Law",
    slug: "dundee-central",
    party: "SNP",
    what: "Hotels in Europe",
    amount: "£2,822",
    note: "The most of any Scottish MP",
  },
];

const ALL_MPS: [string, string][] = [
  ["£9,160", "newspaper and magazine subscriptions (72 claims)"],
  ["£3,863", "TV licences (32 claims)"],
  ["£3,559", "food, drink and events filed as hospitality"],
  ["£58,237", "car parking for MPs' own travel"],
  ["£39,254", "taxis for MPs' own travel"],
  ["£73,648", "flights for MPs' husbands, wives, partners and children"],
];

const PUT_IT_TO_THEM = [
  "Why are MPs' expenses published as a 59,503 line spreadsheet, not a plain list anyone can search?",
  "Why are 2,009 Scottish claim lines one yearly total, so nobody can see a single taxi ride or flight?",
  "Why is the supplier's name blanked out on 199 Scottish claims?",
  "Will you back publishing every claim in plain English, with who was paid and what for?",
];

const PUT_IT_MAILTO = `mailto:?subject=${encodeURIComponent(
  "Question from a constituent: why are MPs' expenses so hard to find?",
)}&body=${encodeURIComponent(
  `Dear [MP's name],

I am writing as your constituent about how MPs' expenses are published.

IPSA publishes every claim, but as a spreadsheet of 59,503 lines for 2025/26. Of the 6,101 lines for Scottish MPs, 2,009 are single yearly totals, so nobody can see individual journeys, and 199 have the supplier's name blanked out. In practice, almost nobody can find out what their MP claimed.

Please could you answer:

1. Will you publish your own 2025/26 claims in plain English, with what each was for and who was paid?
2. Will you press IPSA to publish every claim in a plain, searchable form, without yearly totals that hide individual journeys?
3. Will you back naming every supplier paid with public money?

Yours sincerely,
[Your name]
[Your address and postcode]`,
)}`;

const FAQ = [
  {
    q: "Are these expense claims allowed?",
    a: "Yes. Every claim on this page was approved and paid by IPSA, the body that runs MPs' expenses. Nothing here breaks the rules. That is the point: the rules let MPs bill the taxpayer for things most people pay for themselves.",
  },
  {
    q: "Where does this information come from?",
    a: "From IPSA's own published records for 2025/26. IPSA publishes every MP's claims as a downloadable spreadsheet file (a CSV). The 2025/26 file has 59,503 lines covering 658 current and former MPs, including 6,101 lines for Scotland's MPs. We read every Scottish line and copied the descriptions exactly as IPSA prints them.",
  },
  {
    q: "Why can't I see every taxi or flight?",
    a: "IPSA rolls most travel into one yearly total per MP, labelled 'Aggregated figure for travel'. Of the 6,101 Scottish lines in 2025/26, 2,009 are totals like this, and 199 more have the supplier blanked out with [***]. You can see how much was spent, but not on which journeys.",
  },
  {
    q: "How do I check my own MP's expenses?",
    a: "Open your MP's page on Scotland Counted for a plain English summary of their 2025/26 claims, donations and gifts. You can also search IPSA's own 'Your MP' tool, or download the full spreadsheets from IPSA's annual publications page.",
  },
];

export default function MpExpenseReceiptsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Scottish MPs", path: "/representatives" },
          { name: "MP Expenses & Register of Interests", path: "/mp-expenses-scotland" },
          { name: "The receipts", path: PATH },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={articleJsonLd({
          headline: "The receipts: the strangest things Scottish MPs billed taxpayers for in 2025/26",
          description:
            "Speech coaching, drain cleaning, an iPhone, DFS and IKEA furniture and a staff Christmas lunch: single IPSA expense claims by Scottish MPs, with the official wording.",
          path: PATH,
          published: PUBLISHED_ISO,
          modified: PUBLISHED_ISO,
          image: HERO_IMAGE.src,
          section: "Scottish MPs",
          keywords: ["mp expenses", "mp expenses scotland", "strangest mp expenses", "ipsa expenses"],
          schemaType: "Article",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="The receipts · IPSA 2025/26 · Checked 21 November 2026"
          title="The receipts: what Scottish MPs billed taxpayers for"
          stat={{
            value: "£3,000",
            label: "billed by one Scottish MP for a speech and presentation skills workshop.",
            tone: "bad",
          }}
          lede="Speech coaching. Drain cleaning at a second home. An iPhone. Furniture from DFS and IKEA. A staff Christmas lunch. Every item on this page is a real claim, paid with public money in 2025/26, copied word for word from IPSA's own records. All of them were within the rules."
        >
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href="/email-your-mp-and-msp" className="btn btn-primary">
              Ask your own MP to explain →
            </Link>
            <Link href="/mp-expenses-scotland" className="btn btn-ghost">
              All 57 MPs ranked →
            </Link>
          </div>
          <SharePage
            title="The receipts: what Scottish MPs billed taxpayers for"
            text="£3,000 for a speech coach, £546 to jet-wash a second home's drains and a £1,248 iPhone, all paid by taxpayers. The real receipts:"
            path={PATH}
            label="Share the receipts"
            className="mt-4"
          />
        </PageHeader>

        {/* THE SINGLE RECEIPTS */}
        <ContentFrame as="section" id="receipts" className="scroll-mt-20">
          <SectionHead eyebrow="Single claims · in IPSA's own words" title="Eight receipts you paid for" />
          <ExplainText>
            <p className="mt-3 max-w-[66ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              Each card shows the amount, what it was for in plain words, and the description the
              MP&apos;s office gave IPSA, copied exactly. Tap a name for that MP&apos;s full
              expenses.
            </p>
          </ExplainText>

          <ol className="mt-8 grid gap-5 md:grid-cols-2">
            {RECEIPTS.map((r, i) => (
              <li key={r.what} className="tile flex flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-3 border-b border-dashed border-[var(--rule-strong)] bg-[var(--surface-2)] px-5 py-2.5">
                  <span className="tile-key">
                    Receipt {String(i + 1).padStart(2, "0")} · {r.date}
                  </span>
                  <span className="tile-key">{r.budget}</span>
                </div>
                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <p className="figure-num tnum text-[clamp(38px,4vw,48px)] leading-none text-[var(--bad-text)]">
                    {r.amount}
                  </p>
                  <h3 className="ui mt-2 text-[19px] font-[680] leading-[1.25] text-[var(--ink)]">
                    {r.what}
                  </h3>
                  <p className="ui mt-1.5 text-[14px] text-[var(--muted)]">
                    <Link
                      href={`/representatives/mps/${r.slug}#donations-and-interests`}
                      className="font-[640] text-[var(--action-text)]"
                    >
                      {r.mp}
                    </Link>{" "}
                    · {r.party} · {r.seat}
                  </p>
                  <div className="mt-4 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] px-3.5 py-3">
                    <p className="tile-key mb-1.5">What IPSA&apos;s record says</p>
                    {r.ipsa.map((line) => (
                      <p
                        key={line}
                        className="font-[family-name:var(--font-mono)] text-[13px] leading-[1.5] text-[var(--ink-2)]"
                      >
                        &ldquo;{line}&rdquo;
                      </p>
                    ))}
                  </div>
                  <ExplainText>
                    <p className="mt-3.5 text-[15px] leading-[1.55] text-[var(--ink-2)]">
                      {r.context}
                    </p>
                  </ExplainText>
                </div>
              </li>
            ))}
          </ol>
        </ContentFrame>

        {/* BIGGEST YEARLY TABS */}
        <ContentFrame as="section" id="biggest-tabs" className="pt-16 scroll-mt-20">
          <SectionHead
            eyebrow="Yearly totals · one MP each"
            title="The biggest tabs run up by a single Scottish MP"
          />
          <div className="tile mt-7 overflow-hidden">
            <ul className="divide-y divide-[var(--rule)]">
              {BIG_TABS.map((t) => (
                <li
                  key={t.mp + t.what}
                  className="grid gap-x-5 gap-y-1 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="ui text-[16.5px] font-[660] text-[var(--ink)]">{t.what}</p>
                    <p className="ui mt-0.5 text-[14px] text-[var(--muted)]">
                      <Link
                        href={`/representatives/mps/${t.slug}#donations-and-interests`}
                        className="font-[620] text-[var(--action-text)]"
                      >
                        {t.mp}
                      </Link>{" "}
                      · {t.party} · {t.note}
                    </p>
                  </div>
                  <p className="figure-num tnum text-[28px] leading-none text-[var(--bad-text)] sm:text-right">
                    {t.amount}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="ui mt-12 text-[22px] font-[680] leading-[1.25] text-[var(--ink)]">
            And across all 55 Scottish MPs with claims in 2025/26
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_MPS.map(([amount, label]) => (
              <div key={label} className="tile p-5">
                <p className="figure-num tnum text-[30px] leading-none text-[var(--ink)]">{amount}</p>
                <p className="ui mt-2 text-[14.5px] leading-[1.4] text-[var(--ink-2)]">{label}</p>
              </div>
            ))}
          </div>
        </ContentFrame>

        {/* WHY YOU'VE NEVER SEEN THIS */}
        <ContentFrame as="section" id="why-hidden" className="pt-16 scroll-mt-20">
          <SectionHead
            eyebrow="Published, but hard to find"
            title="Why you have never seen these receipts"
          />
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <div className="tile-night tile p-6">
              <p className="tile-key">The file</p>
              <p className="figure-num tnum mt-2 text-[40px] leading-none text-white">59,503</p>
              <p className="mt-3 text-[15px] leading-[1.55] text-[var(--deep-muted)]">
                lines in IPSA&apos;s 2025/26 spreadsheet, covering 658 MPs. Scotland&apos;s MPs
                alone take up 6,101 of them.
              </p>
            </div>
            <div className="tile-night tile p-6">
              <p className="tile-key">Lumped together</p>
              <p className="figure-num tnum mt-2 text-[40px] leading-none text-white">2,009</p>
              <p className="mt-3 text-[15px] leading-[1.55] text-[var(--deep-muted)]">
                Scottish lines are one yearly total, like &ldquo;Aggregated figure for travel&rdquo;.
                You see the taxi bill, never the journeys.
              </p>
            </div>
            <div className="tile-night tile p-6">
              <p className="tile-key">Blanked out</p>
              <p className="figure-num tnum mt-2 text-[40px] leading-none text-white">199</p>
              <p className="mt-3 text-[15px] leading-[1.55] text-[var(--deep-muted)]">
                more Scottish lines hide the supplier&apos;s name behind [***], so you cannot see
                who was paid.
              </p>
            </div>
          </div>
          <ExplainText>
            <div className="mt-7 max-w-[66ch] space-y-4 text-[17px] leading-[1.65] text-[var(--ink-2)]">
              <p>
                After the 2009 expenses scandal, MPs&apos; claims had to be made public. They are.
                IPSA publishes every claim, but as huge downloadable spreadsheet files (called CSV
                files), filed under &ldquo;annual publications&rdquo; on a website most people have
                never heard of. Each line is a payment code, a budget heading and a few words typed
                by the MP&apos;s office.
              </p>
              <p>
                Nothing is hidden in the legal sense. But almost nobody has the time to read 59,503
                lines, so claims like a £3,000 speech workshop sit there unread. We read all 6,101
                Scottish lines so you do not have to.
              </p>
            </div>
          </ExplainText>

          <div className="tile mt-8 p-6 sm:p-7">
            <p className="tile-key">Check any MP yourself</p>
            <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[16px] leading-[1.6] text-[var(--ink-2)] marker:font-[700] marker:text-[var(--ink)]">
              <li>
                Find your MP on{" "}
                <Link href="/email-your-mp-and-msp">our postcode search</Link> and open their page for
                a plain English summary.
              </li>
              <li>
                Search their name on <a href={IPSA_YOUR_MP}>IPSA&apos;s &ldquo;Your MP&rdquo; tool</a>{" "}
                to see each claim line.
              </li>
              <li>
                Or download the full spreadsheets from{" "}
                <a href={IPSA_DOWNLOADS}>IPSA&apos;s annual publications page</a>.
              </li>
            </ol>
          </div>
        </ContentFrame>

        {/* PUT IT TO THEM */}
        <ContentFrame as="section" id="put-it-to-them" className="pt-16 scroll-mt-20">
          <SectionHead eyebrow="Hidden in plain sight" title="Put it to them" />
          <ExplainText>
            <p className="mt-3 max-w-[66ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              MPs can always say their expenses are published. They are, in a spreadsheet of 59,503
              lines that almost nobody opens. Whether it is meant to or not, publishing it this way
              keeps it out of sight. These are the questions MPs and IPSA should have to answer.
            </p>
          </ExplainText>
          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {PUT_IT_TO_THEM.map((q, i) => (
              <li key={q} className="tile flex gap-4 p-5">
                <span className="tnum inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bad-text)] text-[14px] font-[700] text-white">
                  {i + 1}
                </span>
                <p className="ui text-[16px] font-[600] leading-[1.45] text-[var(--ink)]">{q}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-[var(--r-m)] border border-[var(--rule)] border-l-[4px] border-l-[var(--action)] bg-[var(--action-tint)] p-5 sm:p-6">
            <p className="ui text-[18px] font-[660] text-[var(--ink)]">Send these questions to your MP</p>
            <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
              This opens a ready written email in your own email app. Add your MP&apos;s address (find
              it with <Link href="/email-your-mp-and-msp">our postcode search</Link>), your name and
              your postcode.
            </p>
            <a href={PUT_IT_MAILTO} className="btn btn-primary mt-4">
              Open the ready written email →
            </a>
          </div>
        </ContentFrame>

        <ContentFrame as="section" id="faq" className="pt-16 scroll-mt-20">
          <Faq items={FAQ} kicker="Questions" title="Common questions about these receipts" />
        </ContentFrame>

        <ContentFrame as="section" className="mt-14 border-t-2 border-[var(--ink)] pt-8">
          <p className="label mb-3">Source</p>
          <p className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
            <ExplainText>
              IPSA 2025/26 individualBusinessCosts file, checked 21 November 2026. Descriptions are
              copied exactly as IPSA publishes them. Yearly totals match our{" "}
              <Link href="/mp-expenses-scotland">full MP expenses page</Link>. Every claim shown was
              approved and paid by IPSA. Read next:{" "}
              <Link href="/blog/causeway-creative-labour-councillor-mp-expenses">
                the Labour councillor&apos;s firm that MPs paid £270,033
              </Link>
              .
            </ExplainText>
          </p>
        </ContentFrame>
      </Page>

      <CTA
        title="Ask your MP to explain their receipts"
        body="Enter your Scottish postcode to see your own MP's 2025/26 expense claims and open a ready drafted email asking them to explain."
        href="/email-your-mp-and-msp"
        cta="Check and email my MP"
        secondaryHref="/mp-expenses-scotland"
        secondaryCta="See all 57 MPs ranked"
      />
    </>
  );
}
