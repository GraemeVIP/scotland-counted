"use client";

import { useState } from "react";
import type { ClassroomLesson } from "@/lib/data/classroom";
import { classroomLessonPath } from "@/lib/data/classroom";
import styles from "../classroom.module.css";

export default function PupilLessonClient({
  lesson,
  nextLesson,
}: {
  lesson: ClassroomLesson;
  nextLesson: ClassroomLesson;
}) {
  const [boardMode, setBoardMode] = useState(false);
  const [starterPick, setStarterPick] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [exitNote, setExitNote] = useState("");
  const [hintsOpen, setHintsOpen] = useState<Record<number, boolean>>({});
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});
  const [exitChecked, setExitChecked] = useState(false);

  const doneCount = Object.values(checkedTasks).filter(Boolean).length;
  const totalTasks = lesson.tasks.length;
  const pct = Math.round((doneCount / totalTasks) * 100);
  const allDone = doneCount === totalTasks && exitChecked;

  const pickedChoice = starterPick !== null ? lesson.starter.choices[starterPick] : null;

  return (
    <>
      <section className={styles.section} aria-labelledby="starter-heading">
        <div className={styles.sectionTop}>
          <div>
            <p className={styles.eyebrow}>5 minute warm up</p>
            <h2 id="starter-heading" className={styles.sectionTitle}>
              Start here
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setBoardMode((b) => !b)}
            className={`${styles.modeToggle} no-print`}
          >
            {boardMode ? "Show self check buttons" : "Hide checks (class board mode)"}
          </button>
        </div>

        <div className={styles.starterCard}>
          <p className={styles.questionText}>{lesson.starter.question}</p>

          <div className={styles.choiceGrid} role="group" aria-label="Starter choices">
            {lesson.starter.choices.map((choice, idx) => {
              const selected = starterPick === idx;
              const cls =
                !boardMode && selected
                  ? choice.correct
                    ? `${styles.choiceBtn} ${styles.choiceCorrect}`
                    : `${styles.choiceBtn} ${styles.choiceWrong}`
                  : styles.choiceBtn;
              return (
                <button
                  key={choice.label}
                  type="button"
                  onClick={() => setStarterPick(idx)}
                  aria-pressed={selected}
                  className={cls}
                >
                  <span className={styles.choiceBox} aria-hidden="true">
                    {selected && !boardMode ? (choice.correct ? "✓" : "✕") : ""}
                  </span>
                  <span>{choice.label}</span>
                </button>
              );
            })}
          </div>

          {!boardMode && pickedChoice && (
            <div className={`${styles.feedbackBox} no-print`} role="status">
              <strong>{pickedChoice.correct ? "Spot on. " : "Close. "}</strong>
              {lesson.starter.answer}
            </div>
          )}

          <div className={styles.printLines} aria-hidden="true">
            <div className={styles.printLine} />
            <div className={styles.printLine} />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="tasks-heading">
        <div className={styles.sectionTop}>
          <div>
            <p className={styles.eyebrow}>Main work</p>
            <h2 id="tasks-heading" className={styles.sectionTitle}>
              Work through the questions
            </h2>
          </div>
        </div>

        {!boardMode && (
          <div className={`${styles.modeBar} no-print`} aria-label="Lesson progress">
            <div className={styles.progressWrap}>
              <span className={styles.progressText}>
                {doneCount} of {totalTasks} checked
              </span>
              <div className={styles.progressTrack} aria-hidden="true">
                <div className={styles.progressFill} style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        )}

        <div className={styles.tasksStack} style={{ marginTop: "1rem" }}>
          {lesson.tasks.map((task, idx) => {
            const isChecked = Boolean(checkedTasks[idx]) && !boardMode;
            const isHint = Boolean(hintsOpen[idx]) && !boardMode;
            const value = notes[idx] ?? "";
            return (
              <div
                key={task.question}
                className={isChecked ? `${styles.taskCard} ${styles.taskCardDone}` : styles.taskCard}
              >
                <div className={styles.taskHeader}>
                  <span
                    className={isChecked ? `${styles.taskNum} ${styles.taskNumDone}` : styles.taskNum}
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>
                  <p className={styles.questionText}>{task.question}</p>
                </div>

                <textarea
                  className={styles.scratchpad}
                  aria-label={`Your notes for question ${idx + 1}`}
                  placeholder="Write your answer here. Nothing leaves this screen."
                  value={value}
                  data-filled={value.trim().length > 0 ? "true" : "false"}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [idx]: e.target.value }))}
                />

                {!value.trim() && (
                  <div className={styles.printLines} aria-hidden="true">
                    <div className={styles.printLine} />
                    <div className={styles.printLine} />
                    <div className={styles.printLine} />
                  </div>
                )}

                {!boardMode && (
                  <div className={`${styles.taskFooter} no-print`}>
                    <button
                      type="button"
                      className={styles.subtleBtn}
                      onClick={() => setHintsOpen((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                    >
                      {isHint ? "Hide hint" : "Need a hint?"}
                    </button>
                    <button
                      type="button"
                      className={styles.checkBtn}
                      onClick={() => setCheckedTasks((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                    >
                      {isChecked ? "Hide model answer" : "Check your answer"}
                    </button>
                  </div>
                )}

                {isHint && (
                  <div className={`${styles.hintBox} no-print`}>
                    <strong>Hint: </strong>
                    {task.hint}
                  </div>
                )}

                {isChecked && (
                  <div className={`${styles.feedbackBox} no-print`}>
                    <strong>Model check: </strong>
                    {task.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="exit-heading">
        <p className={styles.eyebrow}>5 minute wrap up</p>
        <h2 id="exit-heading" className={styles.sectionTitle}>
          Before you finish
        </h2>

        <div className={styles.taskCard} style={{ marginTop: "0.85rem" }}>
          <p className={styles.questionText}>{lesson.exit.question}</p>
          <textarea
            className={styles.scratchpad}
            aria-label="Your final answer"
            placeholder="Write your final check here. Nothing leaves this screen."
            value={exitNote}
            data-filled={exitNote.trim().length > 0 ? "true" : "false"}
            onChange={(e) => setExitNote(e.target.value)}
          />
          {!exitNote.trim() && (
            <div className={styles.printLines} aria-hidden="true">
              <div className={styles.printLine} />
              <div className={styles.printLine} />
              <div className={styles.printLine} />
            </div>
          )}

          {!boardMode && (
            <div className={`${styles.taskFooter} no-print`}>
              <button
                type="button"
                className={styles.checkBtn}
                onClick={() => setExitChecked((v) => !v)}
              >
                {exitChecked ? "Hide final check" : "Check final answer"}
              </button>
            </div>
          )}

          {!boardMode && exitChecked && (
            <div className={`${styles.feedbackBox} no-print`}>
              <strong>What scores full marks: </strong>
              {lesson.exit.answer}
            </div>
          )}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="extension-heading">
        <p className={styles.eyebrow}>Extra challenge</p>
        <h2 id="extension-heading" className={styles.sectionTitle}>
          Take it further
        </h2>
        <div className={styles.goalCard} style={{ marginTop: "0.85rem" }}>
          <p className={styles.goalText}>{lesson.extension}</p>
        </div>
      </section>

      <div className={`${styles.completeCard} no-print`}>
        <div>
          <p className={styles.goalLabel}>{allDone ? "Lesson complete" : "Up next"}</p>
          <p className={styles.questionText}>{nextLesson.title}</p>
        </div>
        <a href={classroomLessonPath(nextLesson.slug)} className={styles.nextLink}>
          Next lesson →
        </a>
      </div>
    </>
  );
}
