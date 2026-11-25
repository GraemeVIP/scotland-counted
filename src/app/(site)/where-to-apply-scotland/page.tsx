import Link from "@/components/IntentLink";
import { Page, ContentFrame, CTA } from "@/components/Blocks";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ExplainText } from "@/components/ExplainServer";
import { meta } from "@/lib/seo";
import ApplyDirectoryClient from "./ApplyDirectoryClient";
import { Icon } from "./icons";
import styles from "./apply.module.css";

const FACTS = [
  { value: "24", label: "direct official forms and free phone lines." },
  { value: "6", label: "clear groups from sight loss to urgent bills." },
  { value: "£0", label: "every link is free. Never pay a middleman." },
];

export const metadata = meta({
  title: "Where to Apply in Scotland: Direct Links for Benefits & Support",
  description:
    "Skip government website mazes. Direct verified links to apply for Scottish benefits, sight loss tax breaks, free bus passes, Blue Badges, Crisis Grants, and free advice.",
  path: "/where-to-apply-scotland",
});

export default function WhereToApplyScotlandPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Benefits", path: "/benefits" },
          { name: "Where to apply", path: "/where-to-apply-scotland" },
        ]}
      />
      <Page>
        <header className={styles.hero}>
          <div className="min-w-0">
            <p className={styles.eyebrow}>
              <Icon name="link" />
              Direct links · Scotland
            </p>
            <h1 className={`h1 ${styles.heroTitle}`}>Where to apply for help in Scotland</h1>
            <div className={`lede ${styles.heroLede}`}>
              <ExplainText>
                Half of Scottish help sits on mygov.scot, half on GOV.UK, and the rest on council
                sites. Pick a topic below to go straight to the real official form.
              </ExplainText>
            </div>
          </div>
          <div className="min-w-0">
            <p className={styles.panelLabel}>What is inside</p>
            <ul className={styles.stats}>
              {FACTS.map((f) => (
                <li key={f.value} className={styles.stat}>
                  <span className={styles.statValue}>{f.value}</span>
                  <span className={styles.statLabel}>
                    <ExplainText>{f.label}</ExplainText>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <ContentFrame>
          <section className="pt-10 pb-12 sm:pt-12">
            <ApplyDirectoryClient />
          </section>

          <section className="pb-10">
            <div className={styles.note}>
              <span className={styles.noteIcon}>
                <Icon name="link" />
              </span>
              <p>
                <strong>Spot a broken link?</strong> Government pages move. Tell us on our{" "}
                <Link href="/contact">contact page</Link> and we will fix it fast.
              </p>
            </div>
          </section>

          <CTA
            title="Already applied and got turned down?"
            body="Around half of challenged Crisis Grants and ADP claims get overturned. See the exact deadline and free review steps."
            href="/benefit-or-crisis-grant-rejected-scotland"
            cta="Challenge a refusal"
            secondaryHref="/sight-loss-scotland"
            secondaryCta="Open Sight Loss hub"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
