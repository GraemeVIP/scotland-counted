import Link from "next/link";
import { Page, Col, PageHeader } from "@/components/Blocks";
import LetterBuilder from "./LetterBuilder";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";

export const metadata = meta({
  title: "Take action",
  description:
    "Write to your MSP or MP about child poverty in your area in about two minutes. The letter is pre-filled with the official figures for your council area and the specific costed policies you want them to back.",
  path: "/take-action",
});

const OTHER = [
  {
    title: "Share one chart, not the whole site",
    body: "A single figure with a source travels further than a link to a homepage. Every chart on this site has a data table underneath it, and every page has a permanent URL you can link to directly.",
  },
  {
    title: "Use the numbers in your own work",
    body: "If you run a charity, a community group, a union branch or a newsroom, the data here is free to reuse with attribution. Download the CSVs and check them against the original publishers.",
  },
  {
    title: "Ask a specific question at a surgery",
    body: "General concern is easy to absorb. \"Do you support restoring Local Housing Allowance to the 30th percentile?\" is not. The costed options page lists each measure and who decides it.",
  },
  {
    title: "Correct us in public",
    body: "If a figure here is wrong, that matters more than anything else on the site. Report it and we will fix it and log the change where anyone can see it.",
  },
];

export default function TakeAction() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Take action", path: "/take-action" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="Two minutes"
          title="Ask them where they stand"
          lede="Politicians respond to specific, checkable questions far better than to general concern. This builds a letter with the official figures for your own council area and the exact policies you want them to back."
          stat={{
            value: "2 min",
            label: "from picking your area to a finished letter, with every figure filled in",
            tone: "neutral",
          }}
        />

        {/* Plain instructions before the tool */}
        <div className="grid gap-px bg-[var(--rule)] border-y border-[var(--rule)] mt-2 sm:grid-cols-3">
          {[
            {
              n: 1,
              t: "Build the letter below",
              b: "Pick your council area and what you want done. The official figures fill themselves in.",
            },
            {
              n: 2,
              t: "Copy it",
              b: "One button. Add a sentence of your own first if you can — personal letters get better replies.",
            },
            {
              n: 3,
              t: "Send it to your MSP or MP",
              b: "The lookup button finds who represents you from your postcode. Paste, add your address, send.",
            },
          ].map((s) => (
            <div key={s.n} className="bg-[var(--paper)] px-6 py-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="figure-num text-[30px] text-[var(--action)]" aria-hidden="true">
                  {s.n}
                </span>
                <h2 className="ui text-[15px] font-[660] tracking-[-0.01em]">{s.t}</h2>
              </div>
              <p className="text-[14.5px] text-[var(--ink-2)] leading-[1.55]">{s.b}</p>
            </div>
          ))}
        </div>

        <LetterBuilder />

        <Col className="pt-14">
          <h2 className="h2 mb-4">Why a letter, and why this one</h2>
          <p>
            Constituency correspondence is logged, counted and reported internally. A letter that
            cites the right figure and asks a closed question is much harder to answer with a
            template than one that expresses concern.
          </p>
          <p>
            This letter names the measure, the year, the source and the ask. It also asks for a
            forecast — what they expect the rate to be in five years — because a forecast is a
            commitment that can be checked later.
          </p>
          <p className="text-[15px] text-[var(--ink-2)]">
            Nothing is sent through this site and nothing you type is stored. The letter is
            assembled in your browser; you copy it or open it in your own email client. We never
            see it.
          </p>
        </Col>

        <section className="pt-14">
          <h2 className="h2 mb-6">Other things that actually help</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {OTHER.map((o) => (
              <div
                key={o.title}
                className="bg-[var(--surface)] border border-[var(--rule)] p-5"
              >
                <h3 className="h3 mb-2">{o.title}</h3>
                <p className="text-[15px] text-[var(--ink-2)] leading-[1.55]">{o.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[15px] text-[var(--ink-2)]">
            <Link href="/data">Download the data</Link> ·{" "}
            <Link href="/corrections">Report an error</Link> ·{" "}
            <Link href="/methods">Read the methods</Link>
          </p>
        </section>
      </Page>
    </>
  );
}
