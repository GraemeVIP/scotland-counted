"use client";

import { useEffect, useState } from "react";
import styles from "../classroom.module.css";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ClassroomTimer({ defaultMinutes }: { defaultMinutes: number }) {
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  function preset(mins: number) {
    setRunning(false);
    setSecondsLeft(mins * 60);
  }

  return (
    <div className={`${styles.timerCard} no-print`} aria-label="Classroom countdown timer">
      <div>
        <div style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.78 }}>
          Board timer
        </div>
        <div className={styles.timerDisplay} role="timer" aria-live="off">
          {formatTime(secondsLeft)}
        </div>
      </div>

      <div className={styles.timerControls}>
        <button type="button" className={styles.timerChip} onClick={() => preset(5)}>
          5 min
        </button>
        <button type="button" className={styles.timerChip} onClick={() => preset(10)}>
          10 min
        </button>
        <button type="button" className={styles.timerChip} onClick={() => preset(defaultMinutes)}>
          {defaultMinutes} min
        </button>
        <button
          type="button"
          className={styles.timerPrimary}
          onClick={() => {
            if (secondsLeft === 0) setSecondsLeft(5 * 60);
            setRunning((r) => !r);
          }}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button type="button" className={styles.timerChip} onClick={() => preset(5)}>
          Reset
        </button>
      </div>
    </div>
  );
}

type TallyRow = [zero: number, one: number, two: number];

export function ClassTally() {
  const [starter, setStarter] = useState<TallyRow>([0, 0, 0]);
  const [finalRow, setFinalRow] = useState<TallyRow>([0, 0, 0]);

  function bump(
    setter: React.Dispatch<React.SetStateAction<TallyRow>>,
    col: 0 | 1 | 2,
    delta: number,
  ) {
    setter((prev) => {
      const next: TallyRow = [...prev] as TallyRow;
      next[col] = Math.max(0, next[col] + delta);
      return next;
    });
  }

  function renderCells(row: TallyRow, setter: React.Dispatch<React.SetStateAction<TallyRow>>, label: string) {
    const total = row[0] + row[1] + row[2];
    const twoPct = total > 0 ? Math.round((row[2] / total) * 100) : 0;
    return (
      <>
        {([0, 1, 2] as const).map((col) => (
          <td key={col}>
            <span className={styles.tallyStepper}>
              <button
                type="button"
                className={styles.tallyBtn}
                aria-label={`Remove one from ${label} ${col} points`}
                onClick={() => bump(setter, col, -1)}
              >
                -
              </button>
              <span className={styles.tallyVal}>{row[col]}</span>
              <button
                type="button"
                className={styles.tallyBtn}
                aria-label={`Add one to ${label} ${col} points`}
                onClick={() => bump(setter, col, 1)}
              >
                +
              </button>
            </span>
            <span className={styles.tallyPrintBlank}>______</span>
          </td>
        ))}
        <td className={styles.numCell}>
          <span className="no-print">
            {total > 0
              ? `${total} ${total === 1 ? "pupil" : "pupils"} (${twoPct}% scored 2)`
              : "0"}
          </span>
          <span className={styles.tallyPrintBlank}>______</span>
        </td>
      </>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption>Class totals only. Keep names off this sheet.</caption>
        <thead>
          <tr>
            <th scope="col">Task</th>
            <th scope="col">0 points</th>
            <th scope="col">1 point</th>
            <th scope="col">2 points</th>
            <th scope="col">Class total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Starter</th>
            {renderCells(starter, setStarter, "Starter")}
          </tr>
          <tr>
            <th scope="row">Final check</th>
            {renderCells(finalRow, setFinalRow, "Final check")}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
