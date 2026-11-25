"use client";

import { useState } from "react";
import Link from "@/components/IntentLink";
import { ExplainText } from "@/components/Glossary";
import { HEALTH_BOARDS, NHS_PERIODS, type HealthBoardRecord } from "@/lib/data/nhsScotland";
import { Icon } from "./icons";
import s from "./nhs.module.css";

const QUICK_SLUGS = [
  "greater-glasgow-and-clyde",
  "lothian",
  "lanarkshire",
  "grampian",
  "ayrshire-and-arran",
  "tayside",
  "fife",
  "highland",
];

function fmt(n: number) {
  return n.toLocaleString("en-GB");
}

function pctTone(pct: number, goodAt: number, warnAt: number) {
  if (pct >= goodAt) return { val: s.metricValGood, bar: s.barFillGood };
  if (pct >= warnAt) return { val: s.metricValWarn, bar: s.barFillWarn };
  return { val: s.metricValBad, bar: s.barFillBad };
}

export default function NhsBoardExplorer() {
  const [slug, setSlug] = useState<string>(HEALTH_BOARDS[0].slug);
  const board: HealthBoardRecord = HEALTH_BOARDS.find((b) => b.slug === slug) ?? HEALTH_BOARDS[0];

  const aeTone = pctTone(board.aeWithin4hPct, 85, 70);
  const cancerTone = board.cancer62Pct !== null ? pctTone(board.cancer62Pct, 85, 70) : { val: "", bar: "" };
  const ttgMetPct = Number((100 - board.inpatientOver12wPct).toFixed(1));
  const ttgTone = pctTone(ttgMetPct, 70, 50);

  return (
    <div className={s.explorer} id="board-checker">
      <div className={s.explorerTop}>
        <div>
          <p className={s.cardKicker} style={{ color: "var(--hub-tax)" }}>
            14 NHS Health Boards · Official PHS data
          </p>
          <h2 className={s.explorerTitle}>Check your local Health Board</h2>
        </div>

        <div className={s.selectWrap}>
          <label htmlFor="nhs-board-select" className={s.selectLabel}>
            Pick your Health Board
          </label>
          <select
            id="nhs-board-select"
            className={s.select}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          >
            {HEALTH_BOARDS.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={s.chips} role="group" aria-label="Quick Health Board picker">
        {QUICK_SLUGS.map((q) => {
          const item = HEALTH_BOARDS.find((b) => b.slug === q);
          if (!item) return null;
          const active = item.slug === slug;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => setSlug(item.slug)}
              className={`${s.chipBtn} ${active ? s.chipBtnActive : ""}`}
              aria-pressed={active}
            >
              {item.shortName}
            </button>
          );
        })}
      </div>

      <div className={s.metricGrid}>
        <div className={s.metricTile}>
          <p className={s.metricLabel}>A&amp;E seen within 4 hours (target 95%)</p>
          <p className={`${s.metricVal} ${aeTone.val}`}>{board.aeWithin4hPct}%</p>
          <div className={s.barTrack} aria-hidden="true">
            <div className={`${s.barFill} ${aeTone.bar}`} style={{ width: `${Math.min(100, board.aeWithin4hPct)}%` }} />
          </div>
          <p className={s.metricSub}>
            <ExplainText>
              {fmt(board.aeOver12h12m)} waited over 12 hours. {fmt(board.aeOver8h12m)} waited over 8 hours ({NHS_PERIODS.ae12m}).
            </ExplainText>
          </p>
        </div>

        <div className={s.metricTile}>
          <p className={s.metricLabel}>Past the 12-week legal surgery rule</p>
          <p className={`${s.metricVal} ${ttgTone.val}`}>{board.inpatientOver12wPct}%</p>
          <div className={s.barTrack} aria-hidden="true">
            <div
              className={`${s.barFill} ${s.barFillBad}`}
              style={{ width: `${Math.min(100, board.inpatientOver12wPct)}%` }}
            />
          </div>
          <p className={s.metricSub}>
            <ExplainText>
              {fmt(board.inpatientOver12w)} of {fmt(board.inpatientWaiting)} inpatient waits pass 12 weeks. {fmt(board.inpatientOver52w)} pass a year.
            </ExplainText>
          </p>
        </div>

        <div className={s.metricTile}>
          <p className={s.metricLabel}>Outpatient clinic waiting list</p>
          <p className={s.metricVal}>{fmt(board.outpatientWaiting)}</p>
          <p className={s.metricSub}>
            <ExplainText>
              {fmt(board.outpatientOver12w)} wait over 12 weeks. {fmt(board.outpatientOver52w)} wait over a year (as at {NHS_PERIODS.sotLatest}).
            </ExplainText>
          </p>
        </div>

        <div className={s.metricTile}>
          <p className={s.metricLabel}>62-day urgent cancer target (target 95%)</p>
          <p className={`${s.metricVal} ${cancerTone.val}`}>
            {board.cancer62Pct !== null ? `${board.cancer62Pct}%` : "N/A"}
          </p>
          {board.cancer62Pct !== null && (
            <div className={s.barTrack} aria-hidden="true">
              <div
                className={`${s.barFill} ${cancerTone.bar}`}
                style={{ width: `${Math.min(100, board.cancer62Pct)}%` }}
              />
            </div>
          )}
          <p className={s.metricSub}>
            <ExplainText>
              Out of {fmt(board.cancer62Eligible)} urgent cancer referrals ({NHS_PERIODS.cancer4q}).
            </ExplainText>
          </p>
        </div>

        <div className={s.metricTile}>
          <p className={s.metricLabel}>Bed days lost to delayed discharge</p>
          <p className={`${s.metricVal} ${s.metricValBad}`}>{fmt(board.delayedBedDays12m)}</p>
          <p className={s.metricSub}>
            <ExplainText>
              {fmt(board.delayedBedsDaily)} beds blocked on an average day in {NHS_PERIODS.delayedDischargesLatest}.
            </ExplainText>
          </p>
        </div>

        <div className={s.metricTile}>
          <p className={s.metricLabel}>Ops cancelled by hospital (no bed or staff)</p>
          <p className={`${s.metricVal} ${s.metricValWarn}`}>{fmt(board.opsCancelledCapacity12m)}</p>
          <p className={s.metricSub}>
            <ExplainText>
              Out of {fmt(board.opsCancelledTotal12m)} total cancelled operations in 12 months.
            </ExplainText>
          </p>
        </div>
      </div>

      <div className={s.explorerFoot}>
        <p className={s.cardText}>
          <strong>{board.name}:</strong> Need to raise a complaint or check your rights?
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={board.complaintsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={s.onlineBtn}
          >
            {board.shortName} complaints page
            <Icon name="arrow" size={16} />
          </a>
          <Link href="/nhs-patient-rights-scotland" className={s.secondaryBtn}>
            See your legal rights
          </Link>
        </div>
      </div>
    </div>
  );
}
