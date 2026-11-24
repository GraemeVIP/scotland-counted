import Link from "@/components/IntentLink";
import { Page, PageHeader, SectionHead } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import { meta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = meta({
  title: "Free Scottish data help for charities and good causes",
  description:
    "Use Scotland Counted's free charts and local data, or ask for free help with data analysis for your charity, community group or good cause. Every request is looked at case by case.",
  path: "/for-organisations",
});

export default function Organisations() {
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
            <Link href="/methods" className="btn btn-primary mt-5">
              See how we check facts →
            </Link>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
              We do not charge fees or sell paid work. A contact form is on the way.
            </p>
          </section>
        </div>
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
          <h2 className="h2 mb-4">Facts come first</h2>
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
