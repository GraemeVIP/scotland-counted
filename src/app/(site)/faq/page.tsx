import { Page, ContentFrame, PageHeader, CTA } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { faqItems } from "@/lib/data/faqs";
import FaqSearch from "./FaqSearch";

export const metadata = meta({
  title: "Poverty in Scotland FAQs: Clear Answers",
  description:
    "Straight answers about poverty in Scotland, your local figures, MPs and MSPs, the ready-written emails, privacy, and the proof behind every number.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Questions and answers", path: "/faq" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqItems)} />

      <Page>
        <PageHeader
          eyebrow={`${faqItems.length} questions · Plain-English answers`}
          title="Poverty in Scotland: your questions answered"
          lede="You do not need the political words or the right name for a statistic. Search in ordinary language, choose a topic, or open any question below."
        />

        <ContentFrame>
          <FaqSearch />

          <CTA
            title="Still cannot find the answer?"
            body="Ask a real question, suggest one I should add, or tell me when an answer is unclear. Corrections and confusing explanations are taken seriously."
            href="/contact"
            cta="Ask a question"
            secondaryHref="/methods"
            secondaryCta="Check the sources"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
