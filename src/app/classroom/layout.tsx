import { BrandLogo } from "@/components/BrandLogo";
import { TEACHING_RESOURCES_PATH } from "@/lib/data/classroom";
import styles from "./classroom.module.css";

export default function ClassroomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#classroom-main">
        Skip to lesson
      </a>
      <header className={`${styles.header} no-print`}>
        <div className={styles.headerInner}>
          <a href={TEACHING_RESOURCES_PATH} className={styles.brandLink}>
            <BrandLogo tone="adaptive" height={26} />
            <span className={styles.classroomPill}>Classroom</span>
            <span className={styles.brandUrl}>scotlandcounted.org.uk</span>
          </a>
          <nav className={styles.headerNav} aria-label="Classroom navigation">
            <a href={`${TEACHING_RESOURCES_PATH}#lesson-packs`} className={styles.navPill}>
              All 8 lessons
            </a>
            <a href="/" className={styles.navPill}>
              Main site
            </a>
          </nav>
        </div>
      </header>
      <main id="classroom-main" className={styles.main}>
        {children}
      </main>
    </div>
  );
}
