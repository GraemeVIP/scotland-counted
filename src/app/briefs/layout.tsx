import { BrandLogo } from "@/components/BrandLogo";
import styles from "./briefs.module.css";

export default function BriefsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#brief-main">
        Skip to evidence brief
      </a>
      <header className={`${styles.header} no-print`}>
        <div className={styles.headerInner}>
          <a href="/for-organisations" className={styles.brandLink}>
            <BrandLogo tone="adaptive" height={24} />
            <span className={styles.briefPill}>Local Evidence Brief</span>
            <span className={styles.brandUrl}>scotlandcounted.org.uk</span>
          </a>
          <nav className={styles.headerNav} aria-label="Evidence brief navigation">
            <a href="/for-organisations#evidence-briefs" className={styles.navPill}>
              All 32 councils
            </a>
            <a href="/" className={styles.navPill}>
              Main site
            </a>
          </nav>
        </div>
      </header>
      <main id="brief-main" className={styles.main}>
        {children}
      </main>
    </div>
  );
}
