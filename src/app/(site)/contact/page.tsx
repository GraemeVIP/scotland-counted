import { Suspense } from "react";
import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, HeaderPanel } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import { JsonLd, faqJsonLd, meta } from "@/lib/seo";
import ContactForm from "./ContactForm";

export const metadata = meta({
  title: "Contact Scotland Counted",
  description:
    "Ask for free public data help for your charity or community group, report a mistake, share public records or get in touch with Scotland Counted.",
  path: "/contact",
});

const PROMISES = [
  { title: "No mailing list", body: "We only use your email to reply to you." },
  { title: "Open fixes", body: "Real errors are fixed and logged in public." },
  { title: "Free for good causes", body: "We never charge charities, schools or local groups." },
];

const QUICK_ROUTES = [
  {
    href: "/email-your-mp-and-msp",
    title: "Contact your MP or MSP",
    body: "Need help with housing or bills? Put in your postcode to write to them.",
  },
  {
    href: "/corrections",
    title: "Check our corrections log",
    body: "See how we fix mistakes and read past updates.",
  },
  {
    href: "/data",
    title: "Download the raw files",
    body: "Get our tables and source links to check the figures yourself.",
  },
  {
    href: "/for-organisations",
    title: "Free data help for charities",
    body: "See how we help good causes with local charts, bids and checks.",
  },
];

const FAQ = [
  {
    q: "What happens if I report an error on a page?",
    a: "We check the figure against its source. If we got it wrong, we fix the page and log the date on our corrections page.",
  },
  {
    q: "Why do you ask for my name and email?",
    a: "So we can write back to you. We never put your email on a mailing list or share it with anyone.",
  },
  {
    q: "Can Scotland Counted help with a personal benefit or housing case?",
    a: "No. We are a public data site, not an advice team. Use our email tool to write to your MP or MSP, or try Citizens Advice Scotland.",
  },
  {
    q: "Can my charity or school ask for free data help?",
    a: "Yes. Pick the charity help option on this page. Tell us your area, your question and your date. Every request is free and checked case by case.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <Page>
        <PageHeader
          eyebrow="Get in touch"
          title="Contact Scotland Counted"
          lede="Ask a question, report a mistake or share public records. You can also request free data help for a charity or local group."
          panel={
            <HeaderPanel label="How we handle messages">
              <ul className="divide-y divide-[var(--rule)]">
                {PROMISES.map((item) => (
                  <li key={item.title} className="flex items-baseline gap-3 py-3 first:pt-0 last:pb-0">
                    <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--action)]" />
                    <span>
                      <span className="block text-[18px] font-[620] text-[var(--ink)]">{item.title}</span>
                      <span className="block text-[15.5px] leading-[1.5] text-[var(--ink-2)]">{item.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </HeaderPanel>
          }
        />

        <ContentFrame className="pt-4">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)] lg:items-start">
            <div className="min-w-0">
              <Suspense
                fallback={
                  <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-8 text-[16px] text-[var(--muted)]">
                    Loading contact form...
                  </div>
                }
              >
                <ContactForm />
              </Suspense>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24">
              <div
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6"
                style={{ boxShadow: "var(--shadow-1)" }}
              >
                <p className="kicker text-[var(--action-text)]">Faster routes</p>
                <p className="mt-2 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  <ExplainText>
                    Need help with a bill or local council? One of these tools may help faster.
                  </ExplainText>
                </p>
                <ul className="mt-5 divide-y divide-[var(--rule)]">
                  {QUICK_ROUTES.map((item) => (
                    <li key={item.href} className="py-3.5 first:pt-0 last:pb-0">
                      <Link
                        href={item.href}
                        className="ui block text-[16px] font-[620] text-[var(--ink)] transition-colors hover:text-[var(--action-text)]"
                      >
                        {item.title} →
                      </Link>
                      <p className="mt-1 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
                        <ExplainText>{item.body}</ExplainText>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6"
                style={{ boxShadow: "var(--shadow-1)" }}
              >
                <p className="ui text-[15.5px] font-[620] text-[var(--ink)]">Personal case help</p>
                <p className="mt-2 text-[15px] leading-[1.55] text-[var(--ink-2)]">
                  <ExplainText>
                    We cannot give legal, benefit or housing advice. Try Citizens Advice Scotland or your MP or MSP.
                  </ExplainText>
                </p>
                <div className="mt-4 flex flex-wrap gap-4 border-t border-[var(--rule)] pt-4">
                  <Link href="/about" className="ui text-[14.5px] font-[600] text-[var(--action-text)] hover:underline">
                    About us →
                  </Link>
                  <Link href="/privacy" className="ui text-[14.5px] font-[600] text-[var(--action-text)] hover:underline">
                    Privacy policy →
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          <Faq items={FAQ} className="pt-16" />
        </ContentFrame>
      </Page>
    </>
  );
}
