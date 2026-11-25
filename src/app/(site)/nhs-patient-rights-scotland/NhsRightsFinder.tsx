"use client";

import { useState } from "react";
import { ExplainText } from "@/components/Glossary";
import { HEALTH_BOARDS } from "@/lib/data/nhsScotland";
import { Icon, type IconName } from "../nhs-scotland-waiting-times/icons";
import s from "../nhs-scotland-waiting-times/nhs.module.css";

type IssueId =
  | "wait-12w"
  | "ae-corridor"
  | "cancelled-op"
  | "cancer-scan"
  | "records-opinion"
  | "complaint-spso";

type IssuePlan = {
  id: IssueId;
  icon: IconName;
  title: string;
  short: string;
  lawPromise: string;
  officialRecord: string;
  steps: string[];
};

const ISSUES: IssuePlan[] = [
  {
    id: "wait-12w",
    icon: "clock",
    title: "Waiting over 12 weeks for planned surgery",
    short: "Inpatient or day case operation past 12 weeks.",
    lawPromise:
      "Scots law sets a 12-week Treatment Time Guarantee for planned inpatient care. Your Health Board must try to meet it, or offer another hospital.",
    officialRecord:
      "At 31 October 2026, 96,339 people in Scotland (62%) had passed 12 weeks. 14,828 had waited over a year.",
    steps: [
      "Ask the hospital waiting list team for your place and expected date in writing.",
      "Tell your GP if your pain gets worse. Ask them to write to your specialist.",
      "Ask your Health Board if another Scottish hospital can take you sooner.",
      "Still stuck? Contact PASS for free help to send a formal complaint.",
    ],
  },
  {
    id: "ae-corridor",
    icon: "alert",
    title: "Long A&E wait, corridor care or unsafe ward",
    short: "Left for hours in A&E or poor hospital care.",
    lawPromise:
      "Scots law says your NHS care must be safe, respectful and meet your needs. You have a legal right to raise a concern without it hurting your future care.",
    officialRecord:
      "In 12 months to September 2026, 91,717 patients waited over 12 hours in Scottish A&E departments.",
    steps: [
      "Write down dates, times, ward names and what happened while it is still fresh.",
      "If you are still on a ward, ask to speak to the senior charge nurse right away.",
      "Send a formal Stage 2 complaint to your Health Board. They must normally reply within 20 working days.",
      "Ask PASS to help you write it for free, and tell your MSP so it goes on the Holyrood record.",
    ],
  },
  {
    id: "cancelled-op",
    icon: "scissors",
    title: "Operation cancelled at short notice",
    short: "Cancelled by the hospital due to no bed or staff.",
    lawPromise:
      "Your Health Board must tell you why your operation was cancelled and give you a clear plan for a new date. You can complain if repeated cancellations harm your health.",
    officialRecord:
      "Scottish hospitals cancelled 7,305 planned operations in 12 months due to capacity, beds or staff shortages.",
    steps: [
      "Ask the ward or booking team to confirm in writing that the hospital cancelled it, not you.",
      "Ask when your new date will be and whether you can go on the short-notice cancellation list.",
      "Tell your GP if the delay makes your condition worse or stops you working.",
      "Raise a formal complaint with your Health Board if it happens more than once.",
    ],
  },
  {
    id: "cancer-scan",
    icon: "scan",
    title: "Delayed cancer referral or hospital scan",
    short: "Urgent cancer wait or MRI, CT or endoscopy delay.",
    lawPromise:
      "Scotland has a 62-day standard from urgent cancer referral to first treatment, and a 6-week standard for key scans and endoscopy tests.",
    officialRecord:
      "Only 72.3% of urgent cancer referrals met the 62-day standard, and 46.6% of endoscopy waits passed 6 weeks.",
    steps: [
      "Ask your GP to check that your referral was marked urgent suspicion of cancer, not routine.",
      "Phone the hospital department to check your referral arrived and has not been lost in admin.",
      "Ask your GP to chase the consultant directly if new symptoms appear.",
      "Raise a fast Stage 1 complaint with the Health Board if your scan or clinic date keeps slipping.",
    ],
  },
  {
    id: "records-opinion",
    icon: "file",
    title: "See your medical records or ask for a second opinion",
    short: "Get your full notes for free or challenge a diagnosis.",
    lawPromise:
      "Under UK data law you have a legal right to a free copy of your full GP and hospital records via a Subject Access Request. You can also ask for a second medical opinion.",
    officialRecord:
      "Health Boards must normally send your medical notes within one calendar month, at zero cost.",
    steps: [
      "Email your GP practice or Health Board records team asking for a Subject Access Request for your notes.",
      "State the dates and clinics you want so they do not delay your request.",
      "To ask for a second opinion, speak to your GP or consultant and ask for a referral to another specialist.",
      "If they refuse your records past one month, you can report the Health Board to the Information Commissioner.",
    ],
  },
  {
    id: "complaint-spso",
    icon: "scale",
    title: "Health Board brushed off your complaint",
    short: "Escalate to the independent Scottish Ombudsman.",
    lawPromise:
      "If your Health Board gives a weak reply or misses deadlines, you have a legal right to take your case to the SPSO. It is free and fully independent of the NHS.",
    officialRecord:
      "NHS Scotland received 34,220 complaints in a year. The SPSO upholds or partly upholds most health cases it fully investigates.",
    steps: [
      "Wait for your Health Board's final Stage 2 written reply (or chase them if 20 working days have passed).",
      "Contact PASS on 0800 917 2127 if you want free help checking the Health Board's reply.",
      "Send your complaint and the Health Board's final letter to the SPSO within 12 months.",
      "The SPSO can order the Health Board to apologise, fix unsafe systems and review your care.",
    ],
  },
];

export default function NhsRightsFinder() {
  const [issueId, setIssueId] = useState<IssueId>("wait-12w");
  const [boardSlug, setBoardSlug] = useState<string>(HEALTH_BOARDS[0].slug);

  const issue = ISSUES.find((i) => i.id === issueId) ?? ISSUES[0];
  const board = HEALTH_BOARDS.find((b) => b.slug === boardSlug) ?? HEALTH_BOARDS[0];

  return (
    <div className={s.explorer} id="rights-checker">
      <div className={s.explorerTop}>
        <div>
          <p className={s.cardKicker} style={{ color: "var(--hub-benefits)" }}>
            Step-by-step rights checker
          </p>
          <h2 className={s.explorerTitle}>Pick what is going wrong today</h2>
        </div>

        <div className={s.selectWrap}>
          <label htmlFor="rights-board-select" className={s.selectLabel}>
            Your Health Board (for direct link)
          </label>
          <select
            id="rights-board-select"
            className={s.select}
            value={boardSlug}
            onChange={(e) => setBoardSlug(e.target.value)}
          >
            {HEALTH_BOARDS.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={s.issueGrid} role="radiogroup" aria-label="NHS issue picker">
        {ISSUES.map((item) => {
          const active = item.id === issueId;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setIssueId(item.id)}
              className={`${s.issueBtn} ${active ? s.issueBtnActive : ""}`}
            >
              <span className={s.iconChip} style={{ width: 38, height: 38 }}>
                <Icon name={item.icon} size={19} />
              </span>
              <span>
                <span className={s.issueBtnTitle}>{item.title}</span>
                <span className={s.issueBtnSub}>{item.short}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className={s.planBox} aria-live="polite">
        <p className={s.cardKicker} style={{ color: "var(--hub-benefits)" }}>
          Your rights and next steps
        </p>
        <h3 className={s.cardHeading} style={{ marginTop: 6, fontSize: 22 }}>
          {issue.title}
        </h3>

        <div className={s.planGrid}>
          <div className={s.metricTile}>
            <p className={s.metricLabel}>What Scots law promises</p>
            <p className={s.cardText}>
              <ExplainText>{issue.lawPromise}</ExplainText>
            </p>
          </div>
          <div className={s.metricTile}>
            <p className={s.metricLabel}>What the official NHS record shows</p>
            <p className={s.cardText}>
              <ExplainText>{issue.officialRecord}</ExplainText>
            </p>
          </div>
        </div>

        <ol className={s.stepList}>
          {issue.steps.map((step, idx) => (
            <li key={step} className={s.stepItem}>
              <span className={s.stepNum} aria-hidden="true">
                {idx + 1}
              </span>
              <span>
                <ExplainText>{step}</ExplainText>
              </span>
            </li>
          ))}
        </ol>

        <div className={s.explorerFoot}>
          <div className="flex flex-wrap gap-3">
            <a
              href={board.complaintsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={s.onlineBtn}
            >
              Complain to {board.shortName}
              <Icon name="arrow" size={16} />
            </a>
            <a
              href="https://pass-scotland.org.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className={s.secondaryBtn}
            >
              Get free PASS help
            </a>
            <a
              href="https://www.spso.org.uk/how-to-complain-about-public-services"
              target="_blank"
              rel="noopener noreferrer"
              className={s.secondaryBtn}
            >
              Escalate to SPSO
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
