import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { meta } from "@/lib/seo";
import { classroomLessonPath, classroomLessons, findClassroomLesson } from "@/lib/data/classroom";
import PrintLesson from "../PrintLesson";
import { ClassroomTimer, ClassTally } from "../TeacherToolsClient";
import styles from "../../classroom.module.css";

type Props = { params: Promise<{ lesson: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return classroomLessons.map(({ slug }) => ({ lesson: slug }));
}

export async function generateMetadata({ params }: Props) {
  const lesson = findClassroomLesson((await params).lesson);
  if (!lesson) notFound();
  return meta({
    title: `Teacher notes · ${lesson.title}`,
    description: `Lesson plan, model answers, board timer and class tally. ${lesson.summary}`,
    path: `${classroomLessonPath(lesson.slug)}/teacher`,
  });
}

export default async function ClassroomTeacherNotes({ params }: Props) {
  const lesson = findClassroomLesson((await params).lesson);
  if (!lesson) notFound();
  const path = classroomLessonPath(lesson.slug);
  const mainWorkMinutes = lesson.minutes - 20;

  return (
    <article>
      <div className={styles.printMasthead}>
        <BrandLogo tone="adaptive" height={24} />
        <div className={styles.printMastheadMeta}>
          <div className={styles.printMastheadDomain}>scotlandcounted.org.uk</div>
          <div>scotlandcounted.org.uk{path}/teacher</div>
        </div>
      </div>

      <header className={`${styles.hero} ${styles.heroTeacher}`}>
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
              <span className={styles.heroBadge}>Teacher copy</span>
              <span className={styles.heroBadge}>{lesson.level}</span>
              <span className={styles.heroBadge}>{lesson.minutes} mins</span>
            </div>
            <h1 className={styles.heroTitle}>{lesson.title}</h1>
            <p className={styles.heroSummary}>
              {lesson.topic}. {lesson.objective}
            </p>
          </div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>{lesson.heroStat.value}</div>
            <p className={styles.heroStatLabel}>{lesson.heroStat.label}</p>
          </div>
        </div>

        <div className={`${styles.heroActions} no-print`}>
          <div className={styles.segmented} role="navigation" aria-label="Lesson view">
            <a href={path} className={styles.segItem}>
              Pupil lesson
            </a>
            <a href={`${path}/teacher`} aria-current="page" className={`${styles.segItem} ${styles.segActive}`}>
              Teacher notes
            </a>
          </div>
          <div className={styles.heroBtnGroup}>
            <PrintLesson>Print teacher copy</PrintLesson>
          </div>
        </div>
      </header>

      <section className={styles.goalsGrid} aria-label="Teaching focus">
        <div className={styles.goalCard}>
          <p className={`${styles.goalLabel} ${styles.eyebrowTeal}`}>What to look for</p>
          <p className={styles.goalText}>{lesson.success}</p>
        </div>
        <div className={styles.goalCard}>
          <p className={`${styles.goalLabel} ${styles.eyebrowTeal}`}>Classroom tip</p>
          <p className={styles.goalText}>{lesson.teacherNote}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="plan-heading">
        <p className={`${styles.eyebrow} ${styles.eyebrowTeal}`}>Lesson plan</p>
        <h2 id="plan-heading" className={styles.sectionTitle}>
          Run the lesson in four steps
        </h2>

        <div className={styles.timelineGrid} style={{ marginTop: "0.85rem" }}>
          <div className={styles.timelineStep}>
            <span className={styles.timeBadge}>5 mins</span>
            <h3 className={styles.timelineStepTitle}>Starter</h3>
            <p className={styles.timelineStepBody}>
              Let pupils try the warm up alone before you explain the skill.
            </p>
          </div>
          <div className={styles.timelineStep}>
            <span className={styles.timeBadge}>10 mins</span>
            <h3 className={styles.timelineStepTitle}>Read sources</h3>
            <p className={styles.timelineStepBody}>
              Read the sources aloud. Ask who made them and what dates they cover.
            </p>
          </div>
          <div className={styles.timelineStep}>
            <span className={styles.timeBadge}>{mainWorkMinutes} mins</span>
            <h3 className={styles.timelineStepTitle}>Main tasks</h3>
            <p className={styles.timelineStepBody}>
              Work through questions 1 to 4 in pairs or alone. Ask for proof from the text.
            </p>
          </div>
          <div className={styles.timelineStep}>
            <span className={styles.timeBadge}>5 mins</span>
            <h3 className={styles.timelineStepTitle}>Final check</h3>
            <p className={styles.timelineStepBody}>
              Pupils answer the last task alone so you can see what stuck.
            </p>
          </div>
        </div>

        <ClassroomTimer defaultMinutes={mainWorkMinutes} />

        <div className={styles.goalCard} style={{ marginTop: "0.9rem" }}>
          <p className={`${styles.goalLabel} ${styles.eyebrowTeal}`}>Support and stretch</p>
          <p className={styles.goalText}>
            For extra help, read the tables aloud, talk through Question 1 as a class, or take
            spoken answers. Use Take it further for fast finishers.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="answers-heading">
        <p className={`${styles.eyebrow} ${styles.eyebrowTeal}`}>Standalone marking guide</p>
        <h2 id="answers-heading" className={styles.sectionTitle}>
          Suggested answers
        </h2>
        <p className={styles.sourceNote}>
          These are guide answers for class use, not official SQA mark schemes. Accept any clear
          answer backed by the source.
        </p>

        <div className={styles.tasksStack} style={{ marginTop: "1rem" }}>
          <div className={styles.answerCard}>
            <p className={styles.goalLabel}>Starter</p>
            <p className={styles.answerPrompt}>{lesson.starter.question}</p>
            <p className={styles.answerBody}>{lesson.starter.answer}</p>
          </div>

          {lesson.tasks.map((task, idx) => (
            <div key={task.question} className={styles.answerCard}>
              <p className={styles.goalLabel}>Question {idx + 1}</p>
              <p className={styles.answerPrompt}>{task.question}</p>
              <p className={styles.answerBody}>{task.answer}</p>
            </div>
          ))}

          <div className={styles.answerCard}>
            <p className={styles.goalLabel}>Final check</p>
            <p className={styles.answerPrompt}>{lesson.exit.question}</p>
            <p className={styles.answerBody}>{lesson.exit.answer}</p>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="tally-heading">
        <p className={`${styles.eyebrow} ${styles.eyebrowTeal}`}>Quick impact check</p>
        <h2 id="tally-heading" className={styles.sectionTitle}>
          Record what the class learnt
        </h2>
        <p className={styles.sourceNote}>
          Give 1 point for the right core answer and 1 point for the reason or unit. Count pupils
          who tried both tasks. Keep names in school and record totals only.
        </p>

        <ClassTally />

        <div className={styles.goalCard} style={{ marginTop: "0.9rem" }}>
          <p className={`${styles.goalLabel} ${styles.eyebrowTeal}`}>Notes for next time</p>
          <p className={styles.goalText}>
            Jot down one thing the class got quickly and one point to cover again next week.
          </p>
          <div className={styles.printLines} aria-hidden="true">
            <div className={styles.printLine} />
            <div className={styles.printLine} />
            <div className={styles.printLine} />
          </div>
        </div>

        <div className={`${styles.feedbackBanner} no-print`}>
          <div>
            <p className={styles.questionText}>Tried this lesson with a class?</p>
            <p className={styles.sourceNote} style={{ marginTop: "0.2rem" }}>
              Send us your rough class totals or one quick note so we can improve our school pages.
            </p>
          </div>
          <a href="/contact?topic=general" className={styles.nextLink}>
            Share teacher feedback →
          </a>
        </div>
      </section>

      <footer className={styles.pageFoot}>
        <a href="https://scotlandcounted.org.uk" className={styles.footBrand}>
          <BrandLogo tone="adaptive" height={20} />
        </a>
        <div className={styles.footMeta}>
          <span>Teacher copy · Free for Scottish schools</span>
          <a href={`https://scotlandcounted.org.uk${path}/teacher`} className={styles.footUrl}>
            scotlandcounted.org.uk{path}/teacher
          </a>
        </div>
      </footer>
    </article>
  );
}
