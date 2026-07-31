import Link from "next/link";
import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "About this project",
  description: `${site.name} is a personal, independent project by ${site.author.name} at ${site.organisation.name}. No party affiliation, no funding, no paywall — just public data made readable.`,
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
          eyebrow="Who made this and why"
          title="About this project"
          lede={`${site.name} is an independent evidence-to-action project covering every Scottish council area and Westminster constituency. It is a personal project by ${site.author.name}, founder of ${site.organisation.name}, with no party, campaign or charity affiliation.`}
        />

        <Col className="pt-11">
          <h2 className="h2 mb-4">Why it exists</h2>
          <p>
            Every figure on this site was already public. Local child-poverty rates sit in a
            Loughborough University spreadsheet. Claimant and pay data for all 32 councils sit
            behind the NOMIS query builder. Life expectancy is a 22-megabyte CSV on an ONS
            download server. The national poverty headline lives in a government statistical
            release.
          </p>
          <p>
            None of it is secret. All of it is effectively inaccessible to the people it describes.
            That gap — between technically published and actually available — is where a lot of
            bad argument lives, because a claim is much easier to make when checking it takes a
            weekend.
          </p>
          <p>
            <strong>
              This site closes that gap across Scotland. It connects national evidence, all 32
              council areas, all 57 Westminster constituencies and a Glasgow deep dive — then
              finds the reader&apos;s representatives and prepares the right addressed email.
            </strong>{" "}
            Nothing here is new information. It is the same information, made usable.
          </p>

          <h2 className="h2 mb-4 mt-11">What it is not</h2>
          <p>
            It is not campaign material, and it is not neutral about evidence. Where independent
            modelling reaches a clear conclusion — that income transfers reduce child poverty and
            employment programmes alone do not — the site says so, because that is what the
            evidence shows, not because of a political preference.
          </p>
          <p>
            The <Link href="/accountability">accountability pages</Link> are deliberately
            cross-party. Labour ran Glasgow for most of the post-war period and the SNP has run it
            since 2017. The two-child limit was introduced by a Conservative government and
            retained by a Labour one. Every layer of government named there has a real record, and
            the point is the decisions, not the rosettes.
          </p>
          <p>
            The analytical record does not attribute motives or make claims about anyone&apos;s
            honesty. Individual representatives are named only when a reader asks the postcode
            tool to find their current MP and MSP from official sources. The accountability record
            remains decisions and measured consequences, not personalities.
          </p>

          <h2 className="h2 mb-4 mt-11">How it is funded</h2>
          <p>
            It is not. There are no ads, no trackers, no paywall, no email harvesting and no
            sponsor. It costs very little to run and {site.author.name} pays for it.
          </p>

          <h2 className="h2 mb-4 mt-11">Reuse</h2>
          <p>
            The analysis and charts are free to reuse with attribution to {site.name}. The
            underlying data belongs to its original publishers and is subject to their licences,
            which are almost all Open Government Licence.{" "}
            <Link href="/data">The extracts are downloadable</Link> so you can verify rather than
            trust.
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
          body="A correction is more valuable than a share. If a figure here does not match the source, that is a serious problem and we want to know about it today."
          href="/corrections"
          cta="Report an error"
          secondaryHref="/methods"
          secondaryCta="Read the methods"
        />
      </Page>
    </>
  );
}
