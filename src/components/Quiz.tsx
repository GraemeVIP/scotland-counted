"use client";

import { useState } from "react";
import Link from "next/link";
import { quiz, scoreVerdict } from "@/lib/data/quiz";
import { ExplainText } from "@/components/Glossary";

/**
 * Guess the figure, then see the real one.
 *
 * The shock is the gap between the guess and the truth, so the answer is only
 * revealed after a commitment, showing the number first would waste it. One
 * question at a time, three big tap targets, and the real figure lands large.
 *
 * Wrong answers are never scolded. The whole point is that almost nobody knows
 * these, and telling someone off for that is the fastest way to lose them.
 */

export default function Quiz({
  className = "",
  headingLevel = "h3",
}: {
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const q = quiz[step];
  const answered = picked !== null;
  const isLast = step === quiz.length - 1;
  const Heading = headingLevel;

  function choose(i: number) {
    if (answered) return;
    setPicked(i);
    if (i === q.answer) setCorrect((c) => c + 1);
  }

  function next() {
    if (isLast) {
      setDone(true);
      return;
    }
    setStep((s) => s + 1);
    setPicked(null);
  }

  function restart() {
    setStep(0);
    setPicked(null);
    setCorrect(0);
    setDone(false);
  }

  if (done) {
    const v = scoreVerdict(correct, quiz.length);
    return (
      <section
        className={`rounded-[var(--r-m)] bg-[var(--deep)] px-6 py-9 text-[var(--deep-ink)] sm:px-10 sm:py-12 ${className}`}
        style={{ boxShadow: "var(--shadow-2)" }}
        aria-live="polite"
      >
        <p className="kicker mb-3 text-[var(--action)]">Your score</p>
        <p className="display-stat text-[clamp(52px,8vw,88px)]">
          {correct}
          <span className="opacity-50"> / {quiz.length}</span>
        </p>
        <Heading className="mt-4 text-[24px] font-[780] leading-[1.2] sm:text-[30px]">{v.title}</Heading>
        <p className="mt-4 max-w-[56ch] text-[17.5px] leading-[1.6] opacity-85"><ExplainText>{v.body}</ExplainText></p>

        <p className="mt-7 max-w-[56ch] text-[19px] leading-[1.5] font-[660]">
          Every one of those figures was decided by someone. You can write to them in about a
          minute, and I will do the writing.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/find-my-mp-and-msp" className="btn btn-primary">
            Email my MP and MSP
            <span aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            onClick={restart}
            className="btn border-current/35 text-current hover:bg-white/10"
          >
            Play again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] ${className}`}
      style={{ boxShadow: "var(--shadow-2)" }}
      aria-label="Guess the figure"
    >
      {/* Progress */}
      <div className="flex items-center gap-3 border-b border-[var(--rule)] bg-[var(--surface-2)] px-5 py-3.5 sm:px-7">
        <p className="ui text-[14px] font-[750] uppercase tracking-[0.08em] text-[var(--muted)]">
          {q.tag}
        </p>
        <div className="ml-auto flex items-center gap-1.5" aria-hidden="true">
          {quiz.map((_, i) => (
            <span
              key={i}
              className={`h-[6px] rounded-full transition-all ${
                i === step
                  ? "w-6 bg-[var(--brand)]"
                  : i < step
                    ? "w-[6px] bg-[var(--brand)] opacity-40"
                    : "w-[6px] bg-[var(--rule-strong)]"
              }`}
            />
          ))}
        </div>
        <p className="ui tnum text-[14px] font-[700] text-[var(--muted)]">
          {step + 1}/{quiz.length}
        </p>
      </div>

      <div className="px-5 py-7 sm:px-7 sm:py-8">
        <Heading className="text-[21px] font-[770] leading-[1.25] max-w-[30ch] sm:text-[26px]">
          <ExplainText>{q.question}</ExplainText>
        </Heading>

        <div className="mt-6 grid gap-2.5">
          {q.options.map((opt, i) => {
            const isAnswer = i === q.answer;
            const isPicked = i === picked;
            const state = !answered
              ? "idle"
              : isAnswer
                ? "right"
                : isPicked
                  ? "wrong"
                  : "muted";
            return (
              <button
                key={opt}
                type="button"
                onClick={() => choose(i)}
                disabled={answered}
                aria-pressed={isPicked}
                className={`ui flex items-center gap-3.5 rounded-[var(--r-s)] border-2 px-5 py-4 text-left text-[16.5px] font-[650] transition-all ${
                  state === "idle"
                    ? "border-[var(--rule)] bg-[var(--paper)] hover:border-[var(--brand)] hover:-translate-y-px"
                    : state === "right"
                      ? "border-[var(--good)] bg-[var(--good)]/10"
                      : state === "wrong"
                        ? "border-[var(--bad)] bg-[var(--bad)]/10"
                        : "border-[var(--rule)] bg-[var(--paper)] opacity-45"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-[800] ${
                    state === "right"
                      ? "bg-[var(--good)] text-white"
                      : state === "wrong"
                        ? "bg-[var(--bad)] text-white"
                        : "border-2 border-[var(--rule-strong)]"
                  }`}
                >
                  {state === "right" ? "✓" : state === "wrong" ? "✕" : ""}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-7 border-t-2 border-[var(--ink)] pt-6" aria-live="polite">
            <p className="ui text-[15px] font-[750] text-[var(--muted)]">
              {picked === q.answer ? "Correct" : "Almost nobody gets this one"}
            </p>
            <p className="display-stat mt-1.5 text-[clamp(34px,5.5vw,54px)] text-[var(--brand)]">
              {q.headline}
            </p>
            <p className="mt-3 max-w-[58ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
                <ExplainText>{q.reveal}</ExplainText>
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button type="button" onClick={next} className="btn btn-primary">
                {isLast ? "See my score" : "Next question"}
                <span aria-hidden="true">→</span>
              </button>
              <Link href={q.href} className="ui text-[15.5px] font-[680] text-[var(--brand)]">
                {q.hrefLabel} →
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
