import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { meta } from "@/lib/seo";
import {
  classroomLessonPath,
  classroomLessons,
  findClassroomLesson,
  nextClassroomLesson,
} from "@/lib/data/classroom";
import PrintLesson from "./PrintLesson";
import PupilLessonClient from "./PupilLessonClient";
import styles from "../classroom.module.css";

type Props = { params: Promise<{ lesson: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return classroomLessons.map(({ slug }) => ({ lesson: slug }));
}

export async function generateMetadata({ params }: Props) {
  const lesson = findClassroomLesson((await params).lesson);
  if (!lesson) notFound();
  return meta({
    title: lesson.title,
    description: lesson.summary,
    path: classroomLessonPath(lesson.slug),
  });
}

export default async function ClassroomWorksheet({ params }: Props) {
  const lesson = findClassroomLesson((await params).lesson);
  if (!lesson) notFound();
  const nextLesson = nextClassroomLesson(lesson.slug);
  const path = classroomLessonPath(lesson.slug);

  return (
    <article>
      <div className={styles.printMasthead}>
        <BrandLogo tone="adaptive" height={24} />
        <div className={styles.printMastheadMeta}>
          <div className={styles.printMastheadDomain}>scotlandcounted.org.uk</div>
          <div>scotlandcounted.org.uk{path}</div>
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
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.heroBadge}>{lesson.topic}</span>
              <span className={styles.heroBadge}>{lesson.level}</span>
              <span className={styles.heroBadge}>{lesson.minutes} mins</span>
            </div>
            <h1 className={styles.heroTitle}>{lesson.title}</h1>
            <p className={styles.heroSummary}>{lesson.summary}</p>
          </div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>{lesson.heroStat.value}</div>
            <p className={styles.heroStatLabel}>{lesson.heroStat.label}</p>
          </div>
        </div>

        <div className={`${styles.heroActions} no-print`}>
          <div className={styles.segmented} role="navigation" aria-label="Lesson view">
            <a href={path} aria-current="page" className={`${styles.segItem} ${styles.segActive}`}>
              Pupil lesson
            </a>
            <a href={`${path}/teacher`} className={styles.segItem}>
              Teacher notes
            </a>
          </div>
          <div className={styles.heroBtnGroup}>
            <PrintLesson>Print or save PDF</PrintLesson>
          </div>
        </div>
      </header>

      <div className={styles.printNameRow} aria-hidden="true">
        <div>Name: _______________________</div>
        <div>Class: _____________</div>
        <div>Date: _____________</div>
      </div>

      <section className={styles.goalsGrid} aria-label="Lesson goals">
        <div className={styles.goalCard}>
          <p className={styles.goalLabel}>What you will learn</p>
          <p className={styles.goalText}>{lesson.objective}</p>
        </div>
        <div className={styles.goalCard}>
          <p className={styles.goalLabel}>How you will know</p>
          <p className={styles.goalText}>{lesson.success}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="words-heading">
        <p className={styles.eyebrow}>Key terms</p>
        <h2 id="words-heading" className={styles.sectionTitle}>
          Words that help
        </h2>
        <div className={styles.vocabGrid} style={{ marginTop: "0.85rem" }}>
          {lesson.vocabulary.map(([term, meaning]) => (
            <div key={term} className={styles.vocabCard}>
              <h3 className={styles.vocabTerm}>{term}</h3>
              <p className={styles.vocabDef}>{meaning}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sources-heading">
        <p className={styles.eyebrow}>
          {lesson.tone === "world" ? "Official international data" : "Official Scottish data"}
        </p>
        <h2 id="sources-heading" className={styles.sectionTitle}>
          Read the evidence
        </h2>
        <div className={styles.sourcesGrid} style={{ marginTop: "0.85rem" }}>
          {lesson.sources.map((src, idx) => (
            <div key={src.title} className={styles.sourceCard}>
              <div className={styles.sourceHead}>
                <span className={styles.sourceTag}>Source {idx + 1}</span>
                <span className={styles.sourcePublisher}>{src.publisher}</span>
              </div>
              <h3 className={styles.sourceTitle}>
                {src.href ? (
                  <a href={src.href} target="_blank" rel="noopener noreferrer">
                    {src.title}
                  </a>
                ) : (
                  src.title
                )}
              </h3>
              <p className={styles.sourceNote}>{src.note}</p>

              {src.table && (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <caption>{src.table.caption}</caption>
                    <thead>
                      <tr>
                        {src.table.columns.map((col) => (
                          <th key={col} scope="col">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {src.table.rows.map((row) => (
                        <tr key={row.label}>
                          <th scope="row">
                            <div>{row.label}</div>
                            {typeof row.barPct === "number" && (
                              <div className={styles.barTrack} aria-hidden="true">
                                <div className={styles.barFill} style={{ width: `${row.barPct}%` }} />
                              </div>
                            )}
                          </th>
                          {row.cells.map((cell, cellIdx) => (
                            <td key={cellIdx} className={styles.numCell}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`${styles.guideStrip} no-print`}>
          <p className={styles.guideStripText}>
            {lesson.tone === "world"
              ? "Want to explore more Modern Studies guides and data on this topic?"
              : "Want to explore more Scottish figures on this topic?"}
          </p>
          <a href={lesson.relatedGuide.href} className={styles.guideLink}>
            {lesson.relatedGuide.label} →
          </a>
        </div>
      </section>

      <PupilLessonClient lesson={lesson} nextLesson={nextLesson} />

      <footer className={styles.pageFoot}>
        <a href="https://scotlandcounted.org.uk" className={styles.footBrand}>
          <BrandLogo tone="adaptive" height={20} />
        </a>
        <div className={styles.footMeta}>
          <span>Free Scottish data for Modern Studies</span>
          <a href={`https://scotlandcounted.org.uk${path}`} className={styles.footUrl}>
            scotlandcounted.org.uk{path}
          </a>
        </div>
      </footer>
    </article>
  );
}
