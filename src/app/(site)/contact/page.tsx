import Link from "next/link";
import { Suspense } from "react";
import { Page, PageHeader } from "@/components/Blocks";
import ContactForm from "./ContactForm";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";

export const metadata = meta({
  title: "Get in touch",
  description:
    "Report an error, make a press enquiry, request data in a different shape, or suggest an improvement. One form, straight to a real inbox — corrections outrank everything.",
  path: "/contact",
});

const EXPECT = [
  {
    t: "Corrections come first",
    b: "A figure that doesn't match its source is the most important message this site can receive. Confirmed errors are fixed and logged publicly.",
    href: "/corrections",
    link: "The corrections policy",
  },
  {
    t: "Press: check the kit first",
    b: "Sourced stat lines, downloadable charts and embeds are ready-made — you may not need to wait for a reply at all.",
    href: "/press",
    link: "The press kit",
  },
  {
    t: "Data in another shape",
    b: "Every series is already downloadable as CSV. If you need a different cut for research or campaigning, ask.",
    href: "/data",
    link: "The data downloads",
  },
];

export default function Contact() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="One form, a real inbox"
          title="Get in touch"
          lede="Report an error, ask a press question, request data, or suggest an improvement. Pick the reason and the message arrives pre-sorted."
        />

        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] items-start pt-2">
          <Suspense
            fallback={
              <div className="bg-[var(--surface)] border border-[var(--rule)] p-8 max-w-[560px] min-h-[420px]" />
            }
          >
            <ContactForm />
          </Suspense>

          <div className="grid gap-7 max-w-[420px]">
            {EXPECT.map((e) => (
              <div key={e.t} className="border-l-[3px] border-[var(--brand)] pl-6 py-1">
                <p className="h4 mb-1.5">{e.t}</p>
                <p className="text-[14.5px] text-[var(--ink-2)] leading-[1.55] mb-2">{e.b}</p>
                <Link
                  href={e.href}
                  className="ui text-[13.5px] font-[640] text-[var(--brand)] underline decoration-[var(--rule-strong)] underline-offset-3 hover:decoration-current"
                >
                  {e.link}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Page>
    </>
  );
}
