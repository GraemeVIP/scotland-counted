import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { terms } from "@/lib/data/glossary";
import { site } from "@/lib/site";

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
    name: "Scotland Counted glossary",
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
          title="Words explained"
          lede="If the site has to use a technical word, it is explained here in ordinary language. Open the extra detail only if you want the exact definition."
        />

        <div className="mt-9 grid gap-5 sm:grid-cols-2 max-w-[1080px]">
          {terms.map((t) => (
            <article
              key={t.id}
              id={t.id}
              className="rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule)] p-5 scroll-mt-24"
            >
              <h2 className="text-[17px] font-[620] tracking-[-0.012em] mb-2">{t.term}</h2>
              <p className="text-[15.5px] leading-[1.55]">{t.def}</p>
              {t.tech && (
                <p className="mt-3 pt-3 border-t border-[var(--rule)] text-[15px] text-[var(--ink-2)] leading-[1.55]">
                  <span className="ui text-[15px] font-[650] text-[var(--muted)] block mb-1">
                    The exact detail
                  </span>
                  {t.tech}
                </p>
              )}
            </article>
          ))}
        </div>

        <Col className="pt-12">
          <h2 className="h2 mb-4">Why the exact words matter</h2>
          <p>
            Counting money before rent and counting it after rent can tell a very different story.
            A list that ranks neighbourhoods is also different from counting every person in need.
          </p>
          <p>
            The ideas are not difficult once the words are explained.
          </p>
        </Col>

        <CTA
          title="Now read the Glasgow record"
          body="Every technical term on the site is tappable in context, so you never have to leave the page you are reading to find out what something means."
          href="/the-numbers"
          cta="The Glasgow record"
          secondaryHref="/methods"
          secondaryCta="Methods and sources"
        />
      </Page>
    </>
  );
}
