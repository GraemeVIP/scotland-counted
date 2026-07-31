import Link from "next/link";
import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import { G } from "@/components/Glossary";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { tiers, statutoryTargets } from "@/lib/data/policy";
import { getSources } from "@/lib/data/sources";

export const metadata = meta({
  title: "Who decided this",
  description:
    "Three layers of government touch child poverty in Glasgow. The decisions each made, and the measured consequences — including all four statutory Scottish targets missed in 2023/24. Sourced, and cross-party.",
  path: "/accountability",
});

export default function Accountability() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Accountability", path: "/accountability" },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: "Who decided this",
          description: metadata.description as string,
          path: "/accountability",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="The record"
          title="Who decided this"
          lede="Three layers of government touch this problem: Westminster, Holyrood and the City Chambers. Each has made things worse in its own way, and each can blame the other two — which is exactly the problem."
        />

        <Col className="pt-9">
          <p className="text-[15px] text-[var(--ink-2)]">
            What follows is a record of documented decisions and published outcomes. We do not
            attribute motives, and we do not name individual politicians. Where a party is named,
            it is because the decision was taken by a government that party formed. If you believe
            anything here is wrong,{" "}
            <Link href="/corrections">tell us and we will correct it publicly</Link>.
          </p>
        </Col>

        {/* ---------- The four missed targets ---------- */}
        <section className="pt-12">
          <h2 className="h2 mb-3">Scotland wrote its targets into law, then missed all four</h2>
          <Col>
            <p>
              The Child Poverty (Scotland) Act 2017 set legally binding interim targets for
              2023/24. Here is what was promised, and what was delivered.
            </p>
          </Col>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full max-w-[720px] border-collapse text-[15px]">
              <thead>
                <tr>
                  {["Measure", "Target", "Actual", ""].map((h, i) => (
                    <th
                      key={i}
                      className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--muted)] font-normal text-left pr-4 pb-2.5 border-b border-[var(--rule)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {statutoryTargets.map((t) => (
                  <tr key={t.measure}>
                    <td className="pr-4 py-3 border-b border-[var(--rule)] font-[560]">
                      {t.measure}
                    </td>
                    <td className="pr-4 py-3 border-b border-[var(--rule)] tnum text-[var(--ink-2)]">
                      {t.target}
                    </td>
                    <td className="pr-4 py-3 border-b border-[var(--rule)] tnum font-[640] text-[var(--bad)]">
                      {t.actual}
                    </td>
                    <td className="py-3 border-b border-[var(--rule)]">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-[var(--bad)] border border-current rounded-[2px] px-2 py-1">
                        Missed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Col className="pt-6">
            <p>
              <G t="persistent">Persistent poverty</G> — children stuck poor for three of the last
              four years — came in at <strong>23% against a target of 8%</strong>. That is nearly
              three times over, on the measure most closely linked to lasting harm.
            </p>
            <p>
              Ministers have conceded there is <strong>no penalty for missing them</strong>. Which
              raises a fair question about what the legislation was for.
            </p>
          </Col>
        </section>

        {/* ---------- The three tiers ---------- */}
        <section className="pt-14">
          <h2 className="h2 mb-6">The record, by who holds the power</h2>
          <div className="grid gap-5">
            {tiers.map((t) => (
              <article
                key={t.id}
                className="bg-[var(--surface)] border border-[var(--rule)] border-l-[3px] border-l-[var(--bad)] rounded-r-[3px] px-6 sm:px-7 pt-5 pb-3"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-[var(--muted)] mb-1">
                  {t.who} — {t.power}
                </p>
                <h3 className="text-[18px] font-[620] tracking-[-0.012em] mb-4">{t.heading}</h3>
                <ul className="list-disc pl-[1.15em] space-y-2.5">
                  {t.points.map((p, i) => (
                    <li
                      key={i}
                      className="text-[15.5px] leading-[1.55] text-[var(--ink-2)] max-w-[68ch]"
                    >
                      {p.emphasis && (
                        <strong className="text-[var(--ink)] font-[600]">{p.emphasis} </strong>
                      )}
                      {p.text}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- The structural point ---------- */}
        <section className="pt-14">
          <h2 className="h2 mb-5 max-w-[26ch]">The fault underneath all three</h2>
          <Col>
            <p>
              The target is set in Edinburgh. The money that would actually move it — Universal
              Credit, the two-child limit, <G t="lha">housing benefit</G> — is controlled in
              London. The consequences land in Glasgow, on a council with a frozen tax base and a
              mortgaged budget.
            </p>
            <p>
              <strong>
                Nobody owns the outcome. So nobody can be removed for failing to deliver it.
              </strong>{" "}
              Every one of the three can honestly say the main levers sit with someone else, and
              every one of them is partly right. That is not an accident of politics; it is the
              structure. See <G t="reserved">reserved and devolved</G> for how the split works.
            </p>
            <p>
              But the data does settle one argument. Child poverty in Glasgow fell in the single
              year that payments to families went up, and rose again the moment they were
              withdrawn. Whatever Glasgow&apos;s history, that swing was not caused by it. It was
              policy, working in both directions.
            </p>
          </Col>
        </section>

        <section className="mt-14 pt-6 border-t border-[var(--rule)]">
          <p className="eyebrow mb-4">Where this comes from</p>
          <ul className="space-y-4 max-w-[74ch]">
            {getSources(["targets", "cpag", "housing", "jrf", "fai", "migration"]).map((s) => (
              <li key={s.id} className="text-[15px] text-[var(--ink-2)] leading-[1.55]">
                <a
                  href={s.url}
                  className="text-[var(--ink)] underline decoration-[var(--baseline)] underline-offset-2 hover:decoration-current"
                >
                  {s.title}
                </a>
                <span className="text-[var(--muted)]"> — {s.publisher}</span>
                <br />
                {s.used}
              </li>
            ))}
          </ul>
        </section>

        <CTA
          title="A record is only accountability if someone is shown it"
          body="Your MSP and MP both have a say in at least one of the decisions on this page. It takes about two minutes to ask them where they stand."
          href="/take-action"
          cta="Write to your representative"
          secondaryHref="/what-would-fix-it"
          secondaryCta="See the costed options"
        />
      </Page>
    </>
  );
}
