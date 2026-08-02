import Link from "next/link";
import { Page, ContentFrame, Col, PageHeader, CTA } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "About this project",
  description: `${site.name} is a personal, independent project by ${site.author.name} at ${site.organisation.name}. No party affiliation, no funding and no paywall.`,
  path: "/about",
});

export default function About() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="What Scotland Counted is"
          title="About this project"
          lede={`${site.name} is a free, independent guide to poverty, work and living costs in Scotland. It shows the local facts, explains who has the power to change them and helps people email the right MP and MSP. It is written and published by ${site.author.name}, founder of ${site.organisation.name}. No political party, charity or campaign runs it.`}
        />

        <ContentFrame>
          <Col className="pt-11 mx-auto">
          <h2 className="h2 mb-4">Why it exists</h2>
          <p>
            Every figure on this site was already public. The problem was finding it. Some numbers
            were buried in large spreadsheets, government downloads or difficult search tools.
          </p>
          <p>
            People should not need data skills or a free weekend to understand what is happening
            in their own area. A public number is not truly useful if ordinary people cannot find
            or understand it.
          </p>
          <p>
            <strong>
              This site covers all 32 council areas and all 57 areas represented by an MP. Glasgow
              keeps its own detailed story because its figures are the worst in Scotland. The site
              then finds the reader&apos;s MP and MSP and writes both emails.
            </strong>{" "}
            Nothing here is new information. It is the same information, made usable.
          </p>

          <h2 className="h2 mb-4 mt-11">What it is not</h2>
          <p>
            It is not party campaign material. It follows the evidence. When several independent
            experts reach the same answer, the site says so in plain words.
          </p>
          <p>
            The <Link href="/who-is-responsible-for-poverty-in-scotland">who decides page</Link> covers every main party that
            made relevant decisions. The point is what governments did and what happened next,
            not the colour of a party badge.
          </p>
          <p>
            The site does not guess why a politician made a choice or claim that someone is
            dishonest. It names your current MP and MSP only after you ask the postcode tool to
            find them from official sources.
          </p>

          <h2 className="h2 mb-4 mt-11">How it is funded</h2>
          <p>
            It is not. There are no ads, no trackers, no paywall, no email harvesting and no
            sponsor. It costs very little to run and {site.author.name} pays for it.
          </p>

          <h2 className="h2 mb-4 mt-11">Reuse</h2>
          <p>
            The words and charts are free to reuse if you credit {site.name}. The original data
            still belongs to the organisations that published it.{" "}
            <Link href="/data">Download the exact files</Link> if you want to check my work.
          </p>
          <p>
            Journalists, researchers, councillors and community organisations are welcome to use
            any of it. If a chart would be more useful in a different format, ask.
          </p>

          <h2 className="h2 mb-4 mt-11">Contact</h2>
          <p>
            Corrections, questions and data requests:{" "}
            <Link href="/contact">the contact form</Link> goes straight to a real inbox, pre-sorted
            by reason.
          </p>
          <p>
            {site.organisation.name}:{" "}
            <a href={site.organisation.url} target="_blank" rel="noopener noreferrer">
              {site.organisation.url.replace("https://", "")}
            </a>
          </p>
        </Col>

        <CTA
          title="Found something wrong?"
          body="A correction is more valuable than a share. If a figure here does not match the source, that is a serious problem and I want to know about it today."
          href="/corrections"
          cta="Report an error"
          secondaryHref="/methods"
          secondaryCta="Read the methods"
        />
        </ContentFrame>
      </Page>
    </>
  );
}
