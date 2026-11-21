import { Page, ContentFrame, PageHeader, CTA } from "@/components/Blocks";
import { JsonLd, faqJsonLd, meta } from "@/lib/seo";
import { faqItems } from "@/lib/data/faqs";
import FaqSearch from "./FaqSearch";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = meta({
  title: "Poverty in Scotland FAQs: Clear Answers",
  description:
    "Straight answers about poverty in Scotland, your local figures, MPs and MSPs, the ready written emails, privacy, and the proof behind every number.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Questions and answers", path: "/faq" },
        ]} />
      <JsonLd data={faqJsonLd(faqItems)} />

      <Page>
        <PageHeader
          eyebrow={`${faqItems.length} questions · Plain English answers`}
          title="Poverty in Scotland: your questions answered"
          lede="You do not need the political words or the right name for a statistic. Search in ordinary language, choose a topic, or open any question below."
        />

        <ContentFrame>
          <FaqSearch />

          <CTA
            title="Check the original figures yourself"
            body="Every answer on Scotland Counted links straight back to official Scottish Government, ONS, DWP and council datasets."
            href="/methods"
            cta="Methods and sources"
            secondaryHref="/about"
            secondaryCta="About Scotland Counted"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
