import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { meta } from "@/lib/seo";
import { councils } from "@/lib/data/councils";
import {
  allCouncilBriefLinks,
  evidenceBriefPath,
  getCouncilEvidenceBrief,
} from "@/lib/data/evidenceBriefs";
import { BriefToolbar, CopyGrantButton } from "./BriefActions";
import styles from "../briefs.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return councils.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const brief = getCouncilEvidenceBrief((await params).slug);
  if (!brief) notFound();
  return meta({
    title: `${brief.name}: Local Evidence Brief for Charities`,
    description: `Free printable 2-page local evidence brief for ${brief.name}: child poverty, Crisis Grants, pay, council tax, and official citations for charity grant bids and reports.`,
    path: evidenceBriefPath(brief.slug),
  });
}

export default async function CouncilEvidenceBriefPage({ params }: Props) {
  const brief = getCouncilEvidenceBrief((await params).slug);
  if (!brief) notFound();
  const councilList = allCouncilBriefLinks().map(({ slug, name }) => ({ slug, name }));

  return (
    <article>
      <div className={styles.printMasthead}>
        <BrandLogo tone="adaptive" height={24} />
        <div className={styles.printMastheadMeta}>
          <div className={styles.printMastheadDomain}>scotlandcounted.org.uk</div>
          <div>Local Evidence Brief · scotlandcounted.org.uk{brief.path}</div>
        </div>
      </div>

      <header className={styles.hero}>
        <div className={styles.heroBrandRow}>
          <a href="https://scotlandcounted.org.uk" className={styles.heroLogoPill}>
            <BrandLogo tone="adaptive" height={22} />
          </a>
          <a href="https://scotlandcounted.org.uk" className={styles.heroDomain}>
            scotlandcounted.org.uk
          </a>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.heroBadge}>Local Evidence Brief</span>
          <span className={styles.heroBadge}>Free 2-page PDF</span>
          <span className={styles.heroBadge}>ONS code {brief.code}</span>
        </div>
        <h1 className={styles.heroTitle}>{brief.name}: Local Evidence Brief</h1>
        <p className={styles.heroSummary}>
          Verified official figures for {brief.name} set against Scotland, formatted so local
          charities, community groups, and advice services can attach evidence to funding bids,
          board papers, and council consultations in seconds.
        </p>

        <BriefToolbar
          currentSlug={brief.slug}
          councils={councilList}
          grantParagraph={brief.grantParagraph}
        />
      </header>

      <section className={styles.useGrid} aria-label="How charities use this brief">
        <div className={styles.useCard}>
          <p className={styles.useKicker}>1. Grant applications</p>
          <h2 className={styles.useTitle}>Prove local need fast</h2>
          <p className={styles.useBody}>
            Paste the cited summary below into National Lottery, Robertson Trust, or council grant
            forms, or attach the saved PDF directly.
          </p>
        </div>
        <div className={styles.useCard}>
          <p className={styles.useKicker}>2. Consultations</p>
          <h2 className={styles.useTitle}>Back up local responses</h2>
          <p className={styles.useBody}>
            Cite exact local child poverty, Crisis Grant demand, and council tax figures when
            responding to local budget consultations.
          </p>
        </div>
        <div className={styles.useCard}>
          <p className={styles.useKicker}>3. Trustee boards</p>
          <h2 className={styles.useTitle}>Share one clean snapshot</h2>
          <p className={styles.useBody}>
            Give trustees and partners an independent, source-linked summary of local conditions
            without spending hours in government spreadsheets.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="headline-heading">
        <p className={styles.eyebrow}>Headline local need</p>
        <h2 id="headline-heading" className={styles.sectionTitle}>
          Key figures for {brief.name}
        </h2>

        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>Child poverty (after housing)</p>
            <p className={styles.kpiValue}>{brief.childPovertyPct.toFixed(1)}%</p>
            <p className={styles.kpiSub}>
              {brief.childPovertyCount.toLocaleString("en-GB")} children in {brief.childPovertyPeriod} (Scotland:{" "}
              {brief.childPovertyScotland.toFixed(1)}%).
            </p>
            <p className={styles.kpiFoot}>Rank {brief.childPovertyRank} highest of 32</p>
          </div>

          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>Crisis Grant demand (2025/26)</p>
            <p className={styles.kpiValue}>{brief.crisisApplications.toLocaleString("en-GB")}</p>
            <p className={styles.kpiSub}>
              applications; {brief.crisisAcceptanceRate}% awarded (Scotland:{" "}
              {brief.crisisAcceptanceScotland}%), average £{brief.crisisAverageAward}.
            </p>
            <p className={styles.kpiFoot}>
              £{Math.round(brief.crisisSpend).toLocaleString("en-GB")} total paid out
            </p>
          </div>

          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>Band D council tax (2026-27)</p>
            <p className={styles.kpiValue}>£{Math.round(brief.bandDTax).toLocaleString("en-GB")}</p>
            <p className={styles.kpiSub}>
              Up £{Math.round(brief.bandDRiseCash)} (+{brief.bandDRisePct.toFixed(1)}%) on 2025-26,
              plus £{Math.round(brief.bandDWater)} Scottish Water.
            </p>
            <p className={styles.kpiFoot}>
              £{Math.round(brief.bandDTotal).toLocaleString("en-GB")} full Band D bill
            </p>
          </div>

          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>Local pay and work</p>
            <p className={styles.kpiValue}>
              {brief.medianPay !== null
                ? `£${Math.round(brief.medianPay).toLocaleString("en-GB")}`
                : brief.claimantRate !== null
                  ? `${brief.claimantRate.toFixed(1)}%`
                  : "N/A"}
            </p>
            <p className={styles.kpiSub}>
              {brief.medianPay !== null
                ? `median weekly full-time pay (Scotland: £${Math.round(brief.medianPayScotland)}).`
                : "out-of-work benefit claimants (ONS small-area pay sample suppressed)."}
            </p>
            <p className={styles.kpiFoot}>
              {brief.claimantRate !== null
                ? `Claimants: ${brief.claimantRate.toFixed(1)}% (Scotland ${brief.claimantScotland.toFixed(1)}%)`
                : "ONS official labour data"}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="comparison-heading">
        <p className={styles.eyebrow}>Official comparison table</p>
        <h2 id="comparison-heading" className={styles.sectionTitle}>
          {brief.name} compared with Scotland
        </h2>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Measure</th>
                <th scope="col">{brief.name}</th>
                <th scope="col">Scotland</th>
                <th scope="col">Context and source</th>
              </tr>
            </thead>
            <tbody>
              {brief.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">
                    <div>{row.label}</div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 550, color: "var(--ink-3)" }}>
                      {row.period}
                    </div>
                  </th>
                  <td className={styles.localVal}>
                    <div>{row.localDisplay}</div>
                    {typeof row.barPct === "number" && (
                      <div className={styles.barTrack} aria-hidden="true">
                        <div className={styles.barFill} style={{ width: `${row.barPct}%` }} />
                      </div>
                    )}
                  </td>
                  <td className={styles.scotVal}>{row.scotlandDisplay}</td>
                  <td className={styles.noteCell}>
                    <div>{row.note}</div>
                    <div style={{ marginTop: "0.2rem", color: "var(--ink-3)", fontSize: "0.78rem" }}>
                      Source: {row.source}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="grant-heading">
        <p className={styles.eyebrow}>Ready to reuse</p>
        <h2 id="grant-heading" className={styles.sectionTitle}>
          Cited paragraph for funding bids and reports
        </h2>

        <div className={styles.quoteCard}>
          <div className={styles.quoteTop}>
            <span className={styles.quoteTag}>Free to copy and adapt with source links</span>
            <CopyGrantButton text={brief.grantParagraph} />
          </div>
          <p className={styles.quoteText}>{brief.grantParagraph}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sources-heading">
        <p className={styles.eyebrow}>Primary sources</p>
        <h2 id="sources-heading" className={styles.sectionTitle}>
          Check every figure at its original publisher
        </h2>

        <div className={styles.sourcesGrid}>
          {brief.sources.map((src) => (
            <div key={src.title} className={styles.sourceItem}>
              <a href={src.url} target="_blank" rel="noopener noreferrer">
                {src.title}
              </a>
              <div className={styles.sourcePub}>
                {src.publisher} · {src.period}
              </div>
            </div>
          ))}
        </div>

        <div className={`${styles.moreBar} no-print`}>
          <span style={{ fontSize: "0.92rem", color: "var(--ink-2)" }}>
            Need deeper charts, CSV downloads, or tailored charity data help for {brief.name}?
          </span>
          <div className={styles.moreLinks}>
            <a href={`/councils/${brief.slug}`}>Full council page →</a>
            <a href={`/areas/${brief.slug}`}>Area trends →</a>
            <a href="/contact?reason=charity-help">Ask for free charity help →</a>
          </div>
        </div>
      </section>

      <footer className={styles.pageFoot}>
        <a href="https://scotlandcounted.org.uk" className={styles.footBrand}>
          <BrandLogo tone="adaptive" height={20} />
        </a>
        <div className={styles.footMeta}>
          <span>Free for Scottish charities and community groups</span>
          <a href={`https://scotlandcounted.org.uk${brief.path}`} className={styles.footUrl}>
            scotlandcounted.org.uk{brief.path}
          </a>
        </div>
      </footer>
    </article>
  );
}
