import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { terms } from "@/lib/data/glossary";
import { site } from "../../../site.config";

export const metadata = meta({
  title: "Plain-English glossary",
  description:
    "Every technical term used on this site, explained in plain English, with the methodological detail underneath. After housing costs, relative poverty, SIMD, percentage points, jobs density and more.",
  path: "/glossary",
});

/** DefinedTermSet helps search engines surface individual definitions. */
function glossaryJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glasgow Counted glossary",
    url: `${site.url}/glossary`,
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.def,
    })),
  };
}

export default function Glossary() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Glossary", path: "/glossary" },
        ])}
      />
      <JsonLd data={glossaryJsonLd()} />

      <Page>
        <PageHeader
          eyebrow={`${terms.length} terms`}
          title="Plain-English glossary"
          lede="Jargon is how a subject stays the property of specialists. Here is every technical term this site uses, in ordinary words — with the precise version underneath for anyone who wants it."
        />

        <div className="mt-9 grid gap-5 sm:grid-cols-2 max-w-[1080px]">
          {terms.map((t) => (
            <article
              key={t.id}
              id={t.id}
              className="bg-[var(--surface)] border border-[var(--rule)] p-5 scroll-mt-24"
            >
              <h2 className="text-[17px] font-[620] tracking-[-0.012em] mb-2">{t.term}</h2>
              <p className="text-[15.5px] leading-[1.55]">{t.def}</p>
              {t.tech && (
                <p className="mt-3 pt-3 border-t border-[var(--rule)] text-[14px] text-[var(--ink-2)] leading-[1.55]">
                  <span className="ui text-[10.5px] uppercase tracking-[0.1em] font-[620] text-[var(--muted)] block mb-1">
                    The technical detail
                  </span>
                  {t.tech}
                </p>
              )}
            </article>
          ))}
        </div>

        <Col className="pt-12">
          <h2 className="h2 mb-4">Why this page exists</h2>
          <p>
            Almost every term here is doing real work — the difference between measuring income
            before or after rent changes Glasgow&apos;s poverty rate by several points, and the
            difference between a ranking and a headcount changes what the deprivation figures can
            legitimately be used to claim.
          </p>
          <p>
            None of that is difficult. It is just unexplained, in most of the places it appears.
          </p>
        </Col>

        <CTA
          title="Now read the numbers"
          body="Every technical term on the site is tappable in context, so you never have to leave the page you are reading to find out what something means."
          href="/the-numbers"
          cta="The numbers"
          secondaryHref="/methods"
          secondaryCta="Methods and sources"
        />
      </Page>
    </>
  );
}
