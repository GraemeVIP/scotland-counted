import Link from "@/components/IntentLink";
import { Page, PageHeader, SectionHead } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import { allCouncilBriefLinks } from "@/lib/data/evidenceBriefs";
import { meta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = meta({
  title: "Free Scottish data help for charities and good causes",
  description:
    "Use Scotland Counted's free charts and local data, or ask for free help with data analysis for your charity, community group or good cause. Every request is looked at case by case.",
  path: "/for-organisations",
});

export default function Organisations() {
  const briefs = allCouncilBriefLinks();
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "For organisations", path: "/for-organisations" },
        ]}
      />
      <Page>
        <PageHeader
          eyebrow="For charities and good causes"
          title="Free data help for good causes."
          lede="Need clear local facts for a grant bid, report or local meeting? Use our free data, or ask us for help. It is free for good causes. We look at each ask case by case."
        />
        <div className="grid gap-5 md:grid-cols-2">
          <section className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 sm:p-8">
            <p className="kicker text-[var(--brand)] mb-3">Ready now · free</p>
            <h2 className="h2">Use the public data</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--ink-2)]">
              <ExplainText>
                Download local figures, quote a guide or share a chart. Keep the source, date and
                credit on anything you reuse.
              </ExplainText>
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-[16px] font-semibold">
              <a href="#evidence-briefs">32 council evidence briefs (PDF) →</a>
              <Link href="/data">Browse the data →</Link>
              <Link href="/press">Charts and press files →</Link>
            </div>
          </section>
          <section className="rounded-[var(--r-m)] border-2 border-[var(--brand)] p-6 sm:p-8">
            <p className="kicker text-[var(--brand)] mb-3">Free help · case by case</p>
            <h2 className="h2">Ask for data help</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--ink-2)]">
              <ExplainText>
                We help Scottish charities, housing teams, schools and local groups with data
                analysis and charts. We do not charge good causes. We look at each ask case by
                case, based on time and what the public data can show.
              </ExplainText>
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Link href="/contact?reason=charity-help" className="btn btn-primary">
                Ask for data help →
              </Link>
              <Link href="/methods" className="ui text-[15.5px] font-[600]">
                See how we check facts →
              </Link>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
              We do not charge fees or sell paid work. Tell us your council area, your question and when you need it.
            </p>
          </section>
        </div>

        <section id="evidence-briefs" className="pt-12 scroll-mt-28" aria-labelledby="briefs-heading">
          <SectionHead
            eyebrow="Ready to print or save as PDF"
            title="32 Council Evidence Briefs for grant bids and reports"
          />
          <p className="mt-3 max-w-[70ch] text-[17px] leading-relaxed text-[var(--ink-2)]">
            <ExplainText>
              Small charities and local groups often have to prove local need when they apply for a
              grant. Pick your council below to open a free two page brief with official poverty,
              Crisis Grant, pay and council tax numbers. Save it as a PDF or copy the cited summary
              straight into your form.
            </ExplainText>
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {briefs.map((item) => (
              <a
                key={item.slug}
                href={item.path}
                className="tile group flex items-center justify-between gap-3 px-4 py-3.5 no-underline hover:border-[var(--brand)]"
              >
                <span className="min-w-0">
                  <span className="ui block truncate text-[15.5px] font-[650] text-[var(--ink)] group-hover:text-[var(--action-text)]">
                    {item.name}
                  </span>
                  <span className="block text-[13px] text-[var(--muted)]">
                    Child poverty {item.childPovertyPct.toFixed(1)}%
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-[15px] font-[700] text-[var(--action-text)]"
                >
                  PDF →
                </span>
              </a>
            ))}
          </div>
        </section>
        <section className="pt-12">
          <SectionHead eyebrow="How we can help" title="One place. One clear question." />
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              [
                "Local needs",
                "Pull local poverty, pay and living cost facts together. Each chart shows the year and how your area stacks up.",
              ],
              [
                "Bills and budgets",
                "Put council tax, local spend and public records into plain words anyone can read.",
              ],
              [
                "Charts and checks",
                "Turn raw public files into clean charts and short notes. Any gap in the data is set out clearly.",
              ],
            ].map(([title, body]) => (
              <div key={title} className="border-t-2 border-[var(--ink)] pt-4">
                <h3 className="text-[20px] font-bold">{title}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-[var(--ink-2)]">
                  <ExplainText>{body}</ExplainText>
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-12 border-t border-[var(--rule)] pt-8 max-w-[75ch] text-[17px] leading-relaxed text-[var(--ink-2)]">
          <h2 className="h2 mb-4">Who can ask, what you get and limits</h2>
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5">
              <h3 className="text-[18px] font-bold text-[var(--ink)]">Who this is for</h3>
              <p className="mt-2 text-[15.5px] leading-relaxed">
                <ExplainText>
                  Scottish registered charities, small local community groups (registered or not),
                  parent councils, schools and frontline advice projects with limited data support.
                </ExplainText>
              </p>
            </div>
            <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5">
              <h3 className="text-[18px] font-bold text-[var(--ink)]">Turnaround and privacy</h3>
              <p className="mt-2 text-[15.5px] leading-relaxed">
                <ExplainText>
                  We aim to reply within three to five working days. Everything is free, so priority
                  goes to public benefit and unmet need. Never send personal case files or client
                  details.
                </ExplainText>
              </p>
            </div>
          </div>
          <h3 className="h3 mb-3">Facts come first</h3>
          <p>
            <ExplainText>
              All help for good causes is free. We report what the public records show, never a
              pre-set line. Every tool and file on this site stays free for all.
            </ExplainText>
          </p>
          <p className="mt-4">
            <ExplainText>
              Every number links back to its first source so you can check it yourself.
            </ExplainText>{" "}
            <Link href="/methods">Read the methods</Link>.
          </p>
          <p className="mt-4">
            <ExplainText>
              When you get in touch, share your council area, your question, who will read it and
              when you need it. Leave out private case details.
            </ExplainText>
          </p>
        </section>
      </Page>
    </>
  );
}
