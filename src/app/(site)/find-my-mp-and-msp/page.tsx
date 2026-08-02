import Link from "next/link";
import { Page, ContentFrame, Col, PageHeader } from "@/components/Blocks";
import WhoDoesWhat from "@/components/WhoDoesWhat";
import FindCouncillors from "@/components/FindCouncillors";
import LetterBuilder from "./LetterBuilder";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";

export const metadata = meta({
  title: "Find My MSP and MP by Postcode in Scotland",
  description:
    "Enter your postcode to find your Scottish MSP and MP, add the facts for your area, and open ready-written emails in your own email app.",
  path: "/find-my-mp-and-msp",
});

const OTHER = [
  {
    title: "Share one clear fact",
    body: "A simple local fact is easier to understand and share than a full report. Every local page has the exact figure and source underneath.",
  },
  {
    title: "Use the figures in your own work",
    body: "Charities, community groups, unions and newsrooms can reuse everything for free. The download page has the exact files and original sources.",
  },
  {
    title: "Take the question to a local surgery",
    body: "Ask what your MP or MSP will do, and what they expect the local poverty figure to be in five years. A clear question is harder to avoid.",
  },
  {
    title: "Correct me in public",
    body: "If a figure is wrong, tell me. I will check it, fix any error and keep a public record of the change.",
  },
];

export default function TakeAction() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Take action", path: "/find-my-mp-and-msp" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="No politics knowledge needed"
          title="Find your MP and MSP by postcode"
          lede="Enter your postcode. I find the right people, add the facts for your area, write both emails and open them in your own email app. You do not have to choose who gets which request."
        />

        <ContentFrame>
          <LetterBuilder />

        <WhoDoesWhat className="pt-16" />

        <FindCouncillors className="pt-16" />

        <Col className="pt-14">
          <h2 className="h2 mb-4">Why send an email?</h2>
          <p>
            MPs and MSPs keep a record of messages from local people. A short email with a local
            fact and a clear question is harder to brush aside than a general complaint.
          </p>
          <p>
            Each email gives the exact local figure and asks what they will do. It also asks what
            they expect the figure to be in five years, so their answer can be checked later.
          </p>
          <p className="text-[15px] text-[var(--ink-2)]">
            No email is sent through this site and nothing you type is stored. Your postcode is
            used only to find your area and representatives from official services. Your name and
            personal message stay in your browser. The finished email opens in your own email app.
          </p>
        </Col>

        <section className="pt-14">
          <h2 className="h2 mb-6">Other simple ways to help</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {OTHER.map((o) => (
              <div
                key={o.title}
                className="rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule)] p-5"
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
        </ContentFrame>
      </Page>
    </>
  );
}
