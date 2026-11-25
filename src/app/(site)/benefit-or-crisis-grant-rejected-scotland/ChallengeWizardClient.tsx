"use client";

import { useState } from "react";
import Link from "@/components/IntentLink";
import { crisisGrantCouncils } from "@/lib/data/crisisGrants";
import { Icon, type IconName } from "./icons";
import s from "./challenge.module.css";

type RefusalType = "crisis" | "sss" | "dwp" | "council";

const TAB_ICONS: Record<RefusalType, IconName> = {
  crisis: "pound",
  sss: "heart",
  dwp: "file",
  council: "home",
};

const SORTED_COUNCILS = [...crisisGrantCouncils].sort((a, b) =>
  a.council.localeCompare(b.council, "en-GB"),
);

const BY_REFUSAL_RATE = [...crisisGrantCouncils].sort(
  (a, b) => a.acceptanceRate - b.acceptanceRate,
);

const TABS: {
  id: RefusalType;
  label: string;
  stage1Window: string;
  stage1Reply: string;
  stage2Window: string;
  stage2Body: string;
  overturnStat: string;
  reasons: string[];
}[] = [
  {
    id: "crisis",
    label: "Crisis Grant (Council)",
    stage1Window: "20 working days",
    stage1Reply: "Council must reply in 2 working days",
    stage2Window: "1 month to SPSO",
    stage2Body: "SPSO Independent Review (0800 014 7299)",
    overturnStat: "50% to 60% overturned or changed at SPSO",
    reasons: [
      "I face an urgent gap for food, heating, or power",
      "I had a sudden drop in cash or missed payment",
      "The council missed my bank balance or bill proof",
      "I have children or a health need at home",
    ],
  },
  {
    id: "sss",
    label: "ADP / Scottish benefit",
    stage1Window: "42 calendar days",
    stage1Reply: "Agency has 56 days (or go straight to appeal)",
    stage2Window: "31 calendar days",
    stage2Body: "First-tier Tribunal for Scotland (free)",
    overturnStat: "45% to 49% win at check; 53% to 54% win at appeal",
    reasons: [
      "My bad days were played down or ignored",
      "Tasks take me far longer or leave me in pain",
      "I risk falls, burns, or harm without help or aids",
      "I have a fresh letter from my doctor, clinic, or carer",
    ],
  },
  {
    id: "dwp",
    label: "Universal Credit / DWP",
    stage1Window: "1 calendar month",
    stage1Reply: "DWP sends a Mandatory Reconsideration Notice",
    stage2Window: "1 calendar month",
    stage2Body: "Independent Tribunal (gov.uk/appeal-benefit-decision)",
    overturnStat: "Over half of challenged DWP disability claims win at tribunal",
    reasons: [
      "The decision used the wrong wage, date, or rent figure",
      "Key notes from my journal or letters were missed",
      "My health limits work more than the report says",
      "I had a good reason for a missed call or task",
    ],
  },
  {
    id: "council",
    label: "Council Tax / Rent help",
    stage1Window: "Ask straight away",
    stage1Reply: "Council checks your income and rent figures",
    stage2Window: "Within 2 months",
    stage2Body: "Council Tax Reduction Review Panel (free)",
    overturnStat: "Many errors come from out-of-date wage or Universal Credit feeds",
    reasons: [
      "My weekly income is lower than the figure used",
      "My household size or disability status changed",
      "A rent gap puts my tenancy at risk",
      "I attached fresh payslips or my Universal Credit statement",
    ],
  },
];

function addWorkingDays(start: Date, workingDays: number): Date {
  const d = new Date(start.getTime());
  let added = 0;
  while (added < workingDays) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return d;
}

function addCalendarDays(start: Date, days: number): Date {
  const d = new Date(start.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

function addOneMonth(start: Date): Date {
  const d = new Date(start.getTime());
  d.setMonth(d.getMonth() + 1);
  return d;
}

function formatUKDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function ChallengeWizardClient() {
  const [tab, setTab] = useState<RefusalType>("crisis");
  const [councilSlug, setCouncilSlug] = useState("glasgow-city");
  const [letterDate, setLetterDate] = useState("");
  const [selectedReasons, setSelectedReasons] = useState<Record<string, boolean>>({});
  const [showAllCouncils, setShowAllCouncils] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeTab = TABS.find((t) => t.id === tab)!;
  const selectedCouncil =
    SORTED_COUNCILS.find((c) => c.slug === councilSlug) ?? SORTED_COUNCILS[0];

  // Deadline calculation
  let deadlineDate: Date | null = null;
  let daysRemaining: number | null = null;
  if (letterDate) {
    const parsed = new Date(`${letterDate}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      if (tab === "crisis") deadlineDate = addWorkingDays(parsed, 20);
      else if (tab === "sss") deadlineDate = addCalendarDays(parsed, 42);
      else if (tab === "dwp") deadlineDate = addOneMonth(parsed);
      else deadlineDate = addCalendarDays(parsed, 28);

      const today = new Date();
      today.setHours(12, 0, 0, 0);
      daysRemaining = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    }
  }

  const chosenReasonList = activeTab.reasons.filter((r) => selectedReasons[`${tab}:${r}`]);
  const reasonBullets =
    chosenReasonList.length > 0
      ? chosenReasonList.map((r) => `- ${r}`).join("\n")
      : "- [Write 1 or 2 plain facts the decision missed]";

  const dateText = letterDate
    ? formatUKDate(new Date(`${letterDate}T12:00:00`))
    : "[DATE ON LETTER]";

  const templates: Record<RefusalType, string> = {
    crisis: `Subject: Tier 1 Review Request - Crisis Grant\n\nDear ${selectedCouncil.council} Scottish Welfare Fund Team,\n\nI am asking for a Tier 1 review of your Crisis Grant refusal dated ${dateText} (Ref: [INSERT REF]).\n\nKey facts about my urgent need:\n${reasonBullets}\n\nPlease review this within the 2 working day target for Crisis Grants and send your written reply to [YOUR EMAIL OR ADDRESS].\n\nName: [YOUR FULL NAME]\nAddress: [YOUR ADDRESS]\nPhone: [YOUR PHONE]`,
    sss: `Subject: Redetermination Request - Social Security Scotland\n\nDear Social Security Scotland,\n\nI am asking for a redetermination of my decision dated ${dateText} (NI number: [INSERT NI NUMBER]).\n\nWhy I think the decision is wrong:\n${reasonBullets}\n\nI have attached / will follow up with supporting notes from [DOCTOR / CLINIC / CARER].\n\nName: [YOUR FULL NAME]\nAddress: [YOUR ADDRESS]\nPhone: [YOUR PHONE]`,
    dwp: `Subject: Mandatory Reconsideration Request\n\nDear Department for Work and Pensions,\n\nI am asking for a Mandatory Reconsideration of my decision dated ${dateText} (NI number: [INSERT NI NUMBER]).\n\nWhy I think the decision is wrong:\n${reasonBullets}\n\nPlease review my claim and send a Mandatory Reconsideration Notice.\n\nName: [YOUR FULL NAME]\nAddress: [YOUR ADDRESS]\nPhone: [YOUR PHONE]`,
    council: `Subject: Review Request - Council Tax Reduction / Rent Help\n\nDear ${selectedCouncil.council} Benefits Team,\n\nI am asking for a written review of your decision dated ${dateText} (Ref: [INSERT REF]).\n\nFacts to check again:\n${reasonBullets}\n\nPlease check my claim and reply in writing.\n\nName: [YOUR FULL NAME]\nAddress: [YOUR ADDRESS]\nPhone: [YOUR PHONE]`,
  };

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(templates[tab]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  function toggleReason(reason: string) {
    const key = `${tab}:${reason}`;
    setSelectedReasons((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const councilRows = showAllCouncils ? BY_REFUSAL_RATE : BY_REFUSAL_RATE.slice(0, 8);

  return (
    <div className="space-y-10">
      {/* Main interactive Refusal Challenge Studio */}
      <div className={s.card}>
        <div className={s.stepHead}>
          <span className={s.stepNum} aria-hidden="true">
            1
          </span>
          <div>
            <p className={s.stepKicker}>Interactive challenge builder</p>
            <h2 className={s.stepTitle}>
              <span className="sr-only">1. </span>Pick what was turned down and check your time
              limit
            </h2>
          </div>
        </div>

        <div className={s.tabs} role="tablist" aria-label="Decision type">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setTab(t.id);
                  setCopied(false);
                }}
                className={s.tab}
              >
                <Icon name={TAB_ICONS[t.id]} size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* 2-stage timeline strip */}
        <div className={s.timeline}>
          <div className={s.stage}>
            <p className={s.stageTag}>
              <span className={s.stageDot} aria-hidden="true">
                1
              </span>
              Stage 1 limit
            </p>
            <p className={s.stageValue}>{activeTab.stage1Window}</p>
            <p className={s.stageBody}>{activeTab.stage1Reply}</p>
          </div>

          <div className={`${s.stage} ${s.stage2}`}>
            <p className={s.stageTag}>
              <span className={s.stageDot} aria-hidden="true">
                2
              </span>
              Stage 2 free review
            </p>
            <p className={s.stageValue}>{activeTab.stage2Window}</p>
            <p className={s.stageBody}>{activeTab.stage2Body}</p>
          </div>

          <div className={`${s.stage} ${s.stageWin}`}>
            <p className={s.stageTag}>
              <Icon name="trending" size={18} />
              Official track record
            </p>
            <p className={s.stageWinText}>{activeTab.overturnStat}</p>
          </div>
        </div>

        {/* Deadline calculator + council selector */}
        <div className={s.tools}>
          <div className={s.tool}>
            <label className={s.selectLabel}>
              <span className={s.toolHead}>
                <span className={s.chip}>
                  <Icon name="calendar" size={18} />
                </span>
                <span className={s.toolTitle}>Date on your refusal letter (optional)</span>
              </span>
              <input
                type="date"
                value={letterDate}
                onChange={(e) => setLetterDate(e.target.value)}
                className={s.input}
              />
            </label>
            {deadlineDate && daysRemaining !== null ? (
              <p
                className={`${s.result} ${daysRemaining >= 0 ? s.resultGood : s.resultBad}`}
                aria-live="polite"
              >
                <Icon name={daysRemaining >= 0 ? "clock" : "alert"} size={18} />
                <span>
                  <strong>Guide deadline: {formatUKDate(deadlineDate)}</strong>{" "}
                  {daysRemaining >= 0 ? (
                    <span className={`${s.goodText} font-[700]`}>
                      ({daysRemaining} {daysRemaining === 1 ? "day" : "days"} left).
                    </span>
                  ) : (
                    <span className={`${s.badText} font-[700]`}>
                      (past normal limit. Late claims can still pass with a good reason).
                    </span>
                  )}
                </span>
              </p>
            ) : (
              <p className={s.hint}>
                Pick the date on your letter to see your cut-off date. Nothing leaves this screen.
              </p>
            )}
          </div>

          {(tab === "crisis" || tab === "council") ? (
            <div className={s.tool}>
              <label className={s.selectLabel}>
                <span className={s.toolHead}>
                  <span className={s.chip}>
                    <Icon name="pin" size={18} />
                  </span>
                  <span className={s.toolTitle}>Your Scottish council</span>
                </span>
                <select
                  value={councilSlug}
                  onChange={(e) => setCouncilSlug(e.target.value)}
                  className={s.select}
                >
                  {SORTED_COUNCILS.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.council}
                    </option>
                  ))}
                </select>
              </label>
              <p className={s.toolText}>
                {selectedCouncil.council} turned down{" "}
                <strong className="text-[var(--ink)]">
                  {selectedCouncil.rejections.toLocaleString("en-GB")}
                </strong>{" "}
                Crisis Grants in 2025/26 (
                <strong className="text-[var(--ink)]">
                  {100 - selectedCouncil.acceptanceRate}% no rate
                </strong>
                ).{" "}
                <Link href="/crisis-grant-phone-number" className="whitespace-nowrap font-[700]">
                  Get council phone number →
                </Link>
              </p>
            </div>
          ) : (
            <div className={s.tool}>
              <div className={s.toolHead}>
                <span className={s.chip}>
                  <Icon name={tab === "sss" ? "heart" : "chat"} size={18} />
                </span>
                <p className={s.toolTitle}>Free expert help first</p>
              </div>
              <p className="m-0 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
                {tab === "sss"
                  ? "VoiceAbility is funded by Scotland to help with ADP redeterminations and appeals for free."
                  : "Citizens Advice Scotland checks DWP letters and writes strong Mandatory Reconsiderations for free."}
              </p>
              <p className={s.toolLink}>
                {tab === "sss" ? (
                  <a
                    href="https://www.voiceability.org/in-scotland"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Request free VoiceAbility help online →
                  </a>
                ) : (
                  <a href="https://www.cas.org.uk/bureaux" target="_blank" rel="noopener noreferrer">
                    Find your local Citizens Advice →
                  </a>
                )}
              </p>
            </div>
          )}
        </div>

        <div className={s.divider} />

        {/* Interactive letter builder */}
        <div className={s.letterGrid}>
          <div>
            <div className={s.subHead}>
              <span className={s.subNum} aria-hidden="true">
                2
              </span>
              <div>
                <p className={s.subTitle}>
                  <span className="sr-only">2. </span>Tick what applies to build your review note
                </p>
                <p className={s.subText}>
                  Ticking boxes adds clear bullet points into your starter review note.
                </p>
              </div>
            </div>
            <ul className={s.reasons}>
              {activeTab.reasons.map((reason) => {
                const isOn = Boolean(selectedReasons[`${tab}:${reason}`]);
                return (
                  <li key={reason}>
                    <label className={s.reason} data-on={isOn}>
                      <input
                        type="checkbox"
                        checked={isOn}
                        onChange={() => toggleReason(reason)}
                        className={s.checkbox}
                      />
                      <span>{reason}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={s.letter}>
            <div className={s.letterHead}>
              <span className={s.letterLabel}>
                <span className={s.subNum} aria-hidden="true">
                  3
                </span>
                <span>
                  <span className="sr-only">3. </span>Ready to copy review note
                </span>
              </span>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={copyTemplate} className={s.tealBtn}>
                  <Icon name={copied ? "check" : "copy"} size={16} />
                  {copied ? "Copied text" : "Copy text"}
                </button>
                <button type="button" onClick={() => window.print()} className={s.lightBtn}>
                  <Icon name="printer" size={16} />
                  Print
                </button>
              </div>
            </div>
            <pre className={s.letterBody}>{templates[tab]}</pre>
          </div>
        </div>
      </div>

      {/* Data-led 32-council Crisis Grant Refusal Rates table */}
      <div className={s.card}>
        <div className={s.tableTop}>
          <div className={s.stepHead}>
            <span className={`${s.chip} ${s.chipLg} ${s.chipSolid}`}>
              <Icon name="bars" size={22} />
            </span>
            <div>
              <p className={s.stepKicker}>2025/26 Scottish Government data</p>
              <h2 className={s.stepTitle}>Where Crisis Grants get turned down most across Scotland</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAllCouncils((v) => !v)}
            className={s.ghostBtn}
            aria-expanded={showAllCouncils}
          >
            {showAllCouncils ? "Show top 8 highest" : "Show all 32 councils"}
          </button>
        </div>
        <p className={s.tableIntro}>
          Refusal rates vary by council, from 48% in Midlothian to 11% in Inverclyde. That wide gap
          is why free SPSO checks work so often.
        </p>

        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Council</th>
                <th>Refusal rate</th>
                <th>Claims refused (2025/26)</th>
                <th>Average grant paid</th>
              </tr>
            </thead>
            <tbody>
              {councilRows.map((c, i) => {
                const refusalRate = 100 - c.acceptanceRate;
                return (
                  <tr key={c.slug}>
                    <th>
                      <span className={s.councilCell}>
                        <span className={s.rank} aria-hidden="true">
                          {i + 1}
                        </span>
                        {c.council}
                      </span>
                    </th>
                    <td>
                      <div className={s.rateCell}>
                        <span className={s.rateNum}>{refusalRate}%</span>
                        <div className={s.bar}>
                          <div
                            className={s.barFill}
                            style={{ width: `${Math.min(100, refusalRate * 2)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td data-label="Claims refused (2025/26)">
                      {c.rejections.toLocaleString("en-GB")}
                    </td>
                    <td data-label="Average grant paid">£{c.averageAward}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
