import Link from "next/link";
import { Page, PageHeader, SectionHead } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";

export const metadata = meta({
  title: "Scottish local data briefs for organisations",
  description: "Use Scotland Counted’s free charts and local data, or enquire about a commissioned brief for your charity, housing organisation or community project.",
  path: "/for-organisations",
});

export default function Organisations() {
  return <>
    <JsonLd data={breadcrumbJsonLd([{name:"Home",path:"/"},{name:"For organisations",path:"/for-organisations"}])} />
    <Page>
      <PageHeader eyebrow="For charities, housing teams and community organisations" title="Local evidence you can put to work." lede="Need to explain what is happening in a Scottish community? Start with the free data here, or ask me about a focused piece of research for your project." />
      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 sm:p-8">
          <p className="kicker text-[var(--brand)] mb-3">Available now · free</p>
          <h2 className="h2">Use the public resources</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[var(--ink-2)]">Download local figures, cite an explainer or embed an existing chart. Keep the original source, date and credit with anything you reuse.</p>
          <div className="mt-5 flex flex-wrap gap-4 text-[16px] font-semibold"><Link href="/data">Browse the data →</Link><Link href="/press">Charts and press downloads →</Link></div>
        </section>
        <section className="rounded-[var(--r-m)] border-2 border-[var(--brand)] p-6 sm:p-8">
          <p className="kicker text-[var(--brand)] mb-3">Commissioned work · by agreement</p>
          <h2 className="h2">Ask for a local evidence brief</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[var(--ink-2)]">A clearly sourced brief for a funding application, community presentation or service-planning discussion. Tell me the place, the question and what you need to do with the answer.</p>
          <Link href="/contact?reason=commission" className="btn btn-primary mt-5">Discuss a brief →</Link>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">Scope, price and timing are agreed before any paid work starts.</p>
        </section>
      </div>
      <section className="pt-12">
        <SectionHead eyebrow="A useful starting point" title="One place. One clear question." />
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            ["Community needs", "Explain local poverty and living-cost pressures, with the reporting years and comparison areas made clear."],
            ["Costs and context", "Bring council tax, local figures and the relevant public sources together in a format your readers can understand."],
            ["Evidence for a decision", "Turn an existing public dataset into a small set of charts and plain-English findings, with its limits explained."],
          ].map(([title,body]) => <div key={title} className="border-t-2 border-[var(--ink)] pt-4"><h3 className="text-[20px] font-bold">{title}</h3><p className="mt-3 text-[17px] leading-relaxed text-[var(--ink-2)]">{body}</p></div>)}
        </div>
      </section>
      <section className="mt-12 border-t border-[var(--rule)] pt-8 max-w-[75ch] text-[17px] leading-relaxed text-[var(--ink-2)]">
        <h2 className="h2 mb-4">Evidence comes first</h2>
        <p>Commissioned work pays for research and presentation time. It does not buy a favourable finding, editorial coverage or a representative’s rating. Public tools and published datasets remain free to use under their stated terms.</p>
        <p className="mt-4">I’m Graeme. I build and maintain Scotland Counted, and I show where the figures come from so you can check them. <Link href="/methods">Read the methods</Link> or <Link href="/about">meet the person behind the site</Link>.</p>
        <p className="mt-4">For an enquiry, include the council area, your question, your intended audience and any deadline. Please leave out personal case details.</p>
      </section>
    </Page>
  </>;
}
