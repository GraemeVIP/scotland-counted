"use client";

import { useState } from "react";
import Link from "@/components/IntentLink";
import { CRISIS_GRANT_LINES, SOCIAL_SECURITY_SCOTLAND, telHref } from "@/lib/data/benefits";
import { crisisGrantCouncils, crisisGrantScotland } from "@/lib/data/crisisGrants";
import { Icon, type IconName } from "./icons";
import s from "./urgent.module.css";

const SORTED = [...crisisGrantCouncils].sort((a, b) => a.council.localeCompare(b.council, "en-GB"));
const LINE_BY_SLUG = new Map(CRISIS_GRANT_LINES.map((line) => [line.councilSlug, line]));

type CrisisId = "food" | "power" | "rent" | "councilTax" | "kids" | "debt";

type CrisisOption = {
  id: CrisisId;
  title: string;
  hint: string;
};

const CRISIS_ICONS: Record<CrisisId, IconName> = {
  food: "basket",
  power: "flame",
  rent: "home",
  councilTax: "receipt",
  kids: "users",
  debt: "lock",
};

const CRISIS_OPTIONS: CrisisOption[] = [
  {
    id: "food",
    title: "No cash for food today",
    hint: "Council Crisis Grant and free local food vouchers.",
  },
  {
    id: "power",
    title: "Gas or electric running out",
    hint: "Emergency meter credit, Crisis Grant, and £150 bill help.",
  },
  {
    id: "rent",
    title: "Short on rent or eviction worry",
    hint: "Council rent top-up grant and free Shelter Scotland help.",
  },
  {
    id: "councilTax",
    title: "Council Tax bill too high",
    hint: "Council Tax cut (up to 100% off) plus up to 35% off water.",
  },
  {
    id: "kids",
    title: "Kids at home",
    hint: "£28.20 weekly Scottish Child Payment, Best Start, school grants.",
  },
  {
    id: "debt",
    title: "Chased for debts or arrears",
    hint: "Free Scottish debt plan and 6-month legal freeze on chasing.",
  },
];

type PlanStep = {
  id: CrisisId;
  heading: string;
  action: string;
  contactLabel: string;
  contactHref: string;
  isExternal?: boolean;
  phoneNote?: string;
  haveReady: string;
};

export default function UrgentCouncilFinder() {
  const [slug, setSlug] = useState("glasgow-city");
  const [selectedIds, setSelectedIds] = useState<CrisisId[]>(["food"]);
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const selected = SORTED.find((c) => c.slug === slug) ?? SORTED[0];
  const councilLine = LINE_BY_SLUG.get(selected.slug);
  const refusalRate = 100 - selected.acceptanceRate;

  const gap = selected.acceptanceRate - crisisGrantScotland.acceptanceRate;
  const gapWord =
    gap > 0
      ? `${gap} points above the Scottish average`
      : gap < 0
        ? `${Math.abs(gap)} points below the Scottish average`
        : "right on the Scottish average";

  function toggleCrisis(id: CrisisId) {
    setCopied(false);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  async function copyCouncilPhone() {
    if (!councilLine?.phone) return;
    try {
      await navigator.clipboard.writeText(councilLine.phone);
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 2200);
    } catch {
      setCopiedPhone(false);
    }
  }

  const allSteps: Record<CrisisId, PlanStep> = {
    food: {
      id: "food",
      heading: `Apply online for a ${selected.council} Crisis Grant`,
      action:
        "Apply online so you have a written copy and reference number. You do not need to be on benefits. Most councils decide by the next working day.",
      contactLabel: `Apply online at ${selected.council}`,
      contactHref: councilLine?.url ?? "/crisis-grant-phone-number",
      isExternal: Boolean(councilLine?.url),
      phoneNote: councilLine?.phone
        ? `Council phone: ${councilLine.phone} · Citizens Advice: 0800 028 1456`
        : "Citizens Advice Scotland free phone: 0800 028 1456",
      haveReady: "Bank balance, National Insurance number, and why cash ran out today.",
    },
    power: {
      id: "power",
      heading: "Protect your power supply and check fuel grants",
      action:
        "Message your supplier online for emergency credit and ask to join their free Priority Services Register. Use Home Energy Scotland online to check fuel debt grants and £150 Warm Home Discount help.",
      contactLabel: "Open Home Energy Scotland online",
      contactHref: "https://www.homeenergyscotland.org/",
      isExternal: true,
      phoneNote: "Free phone: 0808 808 2282",
      haveReady: "Energy account number, supplier name, and current meter balance.",
    },
    rent: {
      id: "rent",
      heading: `Ask ${selected.council} for a rent top-up (DHP)`,
      action:
        "Apply in writing for Discretionary Housing Payment to cover rent shortfalls, Bedroom Tax, or Benefit Cap drops. Use Shelter Scotland online advice or chat if your landlord sent a warning.",
      contactLabel: "Open Shelter Scotland online help",
      contactHref: "https://scotland.shelter.org.uk/get_help/helpline",
      isExternal: true,
      phoneNote: "Free phone: 0808 800 4444 (Mon to Fri, 9am to 5pm)",
      haveReady: "Tenancy agreement, rent amount, and Universal Credit housing award.",
    },
    councilTax: {
      id: "councilTax",
      heading: `Claim Council Tax Reduction from ${selected.council}`,
      action:
        "Universal Credit does NOT apply this cut for you. Apply direct to your council in writing. You can get up to 100% off Council Tax and up to 35% off Scottish Water.",
      contactLabel: "See Council Tax Reduction guide",
      contactHref: "/blog/council-tax-reduction-scotland",
      haveReady: "Council Tax account number and latest payslips or benefit award.",
    },
    kids: {
      id: "kids",
      heading: "Claim missed Scottish family cash",
      action:
        "Apply online for Scottish Child Payment (£28.20 a week per child under 16, no cap) plus Best Start Grants and free school meals. Applying online gives you a dated confirmation.",
      contactLabel: "Apply on mygov.scot",
      contactHref: "https://www.mygov.scot/scottish-child-payment",
      isExternal: true,
      phoneNote: `Social Security Scotland free phone: ${SOCIAL_SECURITY_SCOTLAND.phone}`,
      haveReady: "Child birth dates, bank details, and qualifying benefit letter.",
    },
    debt: {
      id: "debt",
      heading: "Freeze chasing with Scotland's 6-month Moratorium",
      action:
        "Use StepChange's free online Scottish debt check to get written advice. Ask about a Scottish Debt Moratorium, which pauses sheriff officers and chasing for 6 months while you set up a plan.",
      contactLabel: "Start StepChange Scotland online check",
      contactHref: "https://www.stepchange.org/debt-info/debt-in-scotland.aspx",
      isExternal: true,
      phoneNote: "Free phone: 0800 138 1111",
      haveReady: "Rough list of who you owe and your monthly take-home income.",
    },
  };

  const activeSteps = CRISIS_OPTIONS.filter((o) => selectedIds.includes(o.id)).map(
    (o) => allSteps[o.id],
  );

  function buildPlainTextPlan() {
    const header = `My Urgent Money Plan (${selected.council})\n`;
    const councilLineTxt = councilLine?.phone
      ? `${selected.council} Crisis Grant phone: ${councilLine.phone}\nApply online: ${councilLine.url}\n`
      : `${selected.council} Crisis Grant online: ${councilLine?.url ?? "https://scotlandcounted.org.uk/crisis-grant-phone-number"}\n`;

    const body = activeSteps
      .map(
        (step, idx) =>
          `\n${idx + 1}. ${step.heading}\n   ${step.action}\n   Have ready: ${step.haveReady}`,
      )
      .join("\n");

    return `${header}${councilLineTxt}${body}\n\nFree Scottish helplines:\n- Citizens Advice Scotland: 0800 028 1456\n- StepChange Debt Charity: 0800 138 1111\n- Shelter Scotland: 0808 800 4444\n- Home Energy Scotland: 0808 808 2282`;
  }

  async function copyPlan() {
    if (activeSteps.length === 0) return;
    try {
      await navigator.clipboard.writeText(buildPlainTextPlan());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Direct 32-council Crisis Grant number + live 2025/26 odds */}
      <div className={s.card}>
        <div className={s.councilTop}>
          <div className={s.stepHead}>
            <span className={s.stepNum} aria-hidden="true">
              1
            </span>
            <div>
              <p className={s.stepKicker}>Step 1 · Your council</p>
              <h2 className={s.stepTitle}>
                Get your council Crisis Grant number and real 2025/26 odds
              </h2>
            </div>
          </div>
          <label className={s.selectLabel}>
            <span>Pick your Scottish council</span>
            <select value={slug} onChange={(e) => setSlug(e.target.value)} className={s.select}>
              {SORTED.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.council}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Direct online application + phone reference bar for chosen council */}
        <div className={s.direct}>
          <span className={`${s.chip} ${s.chipLg} ${s.chipSolid}`}>
            <Icon name="building" size={24} />
          </span>
          <div className="min-w-0">
            <p className={s.directLabel}>Direct {selected.council} Crisis Grant form</p>
            <p className={s.directLead}>
              Apply online first so you keep a written record and reference number.
            </p>
            <p className={s.directPhone}>
              {councilLine?.phone ? (
                <>
                  Council phone: <strong className="text-[var(--ink)]">{councilLine.phone}</strong>
                  {(councilLine.hours || councilLine.note) &&
                    ` (${[councilLine.hours, councilLine.note].filter(Boolean).join(". ")})`}
                </>
              ) : (
                "Online application only for this council."
              )}
            </p>
          </div>
          <div className={s.directActions}>
            {councilLine?.url && (
              <a
                href={councilLine.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Apply online at {selected.council} →
              </a>
            )}
            {councilLine?.phone && (
              <>
                <button
                  type="button"
                  onClick={copyCouncilPhone}
                  className={`${s.ghostBtn} ${s.onlyWide}`}
                >
                  <Icon name={copiedPhone ? "check" : "copy"} size={16} />
                  {copiedPhone ? "Copied number" : "Copy phone number"}
                </button>
                <a href={telHref(councilLine.phone)} className={`${s.ghostBtn} ${s.onlyNarrow}`}>
                  <Icon name="phone" size={16} />
                  Call {councilLine.phone}
                </a>
              </>
            )}
          </div>
        </div>

        {/* 3 verified 2025/26 Scottish Government stats */}
        <div className={s.stats}>
          <div className={s.stat}>
            <p className={`m-0 ${s.statTop}`}>
              <span className={s.chip}>
                <Icon name="checkCircle" size={18} />
              </span>
              Approval rate (2025/26)
            </p>
            <p className={`figure-num ${s.statValue}`}>{selected.acceptanceRate}%</p>
            <p className={s.statNote}>
              Rank #{selected.rank} of 32. {gapWord} (65%).
            </p>
          </div>
          <div className={s.stat}>
            <p className={`m-0 ${s.statTop}`}>
              <span className={s.chip}>
                <Icon name="pound" size={18} />
              </span>
              Average grant paid
            </p>
            <p className={`figure-num ${s.statValue}`}>£{selected.averageAward}</p>
            <p className={s.statNote}>
              {selected.awards.toLocaleString("en-GB")} grants paid in 2025/26.
            </p>
          </div>
          <div className={s.stat}>
            <p className={`m-0 ${s.statTop}`}>
              <span className={s.chip}>
                <Icon name="clock" size={18} />
              </span>
              Decision speed
            </p>
            <p className={`figure-num ${s.statValue}`}>{selected.processedByNextWorkingDay}%</p>
            <p className={s.statNote}>answered by the next working day.</p>
          </div>
        </div>

        {/* Data-led refusal heads-up if chosen council turns down more than Scottish average */}
        {selected.acceptanceRate < crisisGrantScotland.acceptanceRate && (
          <div className={s.warn}>
            <Icon name="alert" size={20} />
            <p className="m-0">
              <strong>Heads up for {selected.council}:</strong> {refusalRate}% of Crisis Grants
              were turned down here in 2025/26 (above the 35% Scottish average). If they say no, you
              have 20 working days to ask for a free review.{" "}
              <Link href="/benefit-or-crisis-grant-rejected-scotland" className="font-[700]">
                Open free refusal builder →
              </Link>
            </p>
          </div>
        )}

        <div className={s.linkRow}>
          <Link href="/crisis-grant-phone-number" className={s.linkPill}>
            <Icon name="phone" size={16} />
            See all 32 council phone numbers →
          </Link>
          <a href={`/briefs/${selected.slug}`} className={s.linkPill}>
            <Icon name="file" size={16} />
            Open {selected.council} 2-page Evidence Brief →
          </a>
        </div>
      </div>

      {/* Step 2 + 3: Live interactive Today Plan Builder */}
      <div className={s.card}>
        <div className={s.stepHead}>
          <span className={s.stepNum} aria-hidden="true">
            2
          </span>
          <div>
            <p className={s.stepKicker}>Step 2 · Build your today plan</p>
            <h2 className={s.stepTitle}>
              Tick what is hitting you today to build a tailored {selected.council} plan
            </h2>
          </div>
        </div>
        <p className={s.stepIntro}>
          Every box you tick adds the exact phone number, link, and papers to gather into your plan
          on the right. Nothing leaves your screen.
        </p>

        <div className={s.builder}>
          {/* Left: Multi-select crisis toggles */}
          <ul className={s.options}>
            {CRISIS_OPTIONS.map((option) => {
              const isOn = selectedIds.includes(option.id);
              return (
                <li key={option.id}>
                  <label className={s.option} data-on={isOn}>
                    <span className={s.chip}>
                      <Icon name={CRISIS_ICONS[option.id]} size={20} />
                    </span>
                    <span className={s.optionText}>
                      <span className={s.optionTitle}>{option.title}</span>
                      <span className={s.optionHint}>{option.hint}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => toggleCrisis(option.id)}
                      className={s.checkbox}
                    />
                  </label>
                </li>
              );
            })}
          </ul>

          {/* Right: Live generated action sheet */}
          <div className={s.plan}>
            <div className={s.planHead}>
              <div>
                <p className={s.planLabel}>Your action plan · {selected.council}</p>
                <p className={s.planCount}>
                  {activeSteps.length === 0
                    ? "Tick at least 1 box on the left"
                    : `${activeSteps.length} ${activeSteps.length === 1 ? "step" : "steps"} ready to follow today`}
                </p>
              </div>
              <div className={s.planBtns}>
                <button
                  type="button"
                  onClick={copyPlan}
                  disabled={activeSteps.length === 0}
                  className={s.tealBtn}
                >
                  <Icon name={copied ? "check" : "copy"} size={16} />
                  {copied ? "Copied plan" : "Copy plan"}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  disabled={activeSteps.length === 0}
                  className={s.lightBtn}
                >
                  <Icon name="printer" size={16} />
                  Print
                </button>
              </div>
            </div>

            <div className={s.planBody}>
              {activeSteps.length === 0 ? (
                <div className={s.empty}>
                  <span className={`${s.chip} ${s.chipLg}`}>
                    <Icon name="clipboard" size={24} />
                  </span>
                  Tick one or more boxes on the left to build your {selected.council} action list.
                </div>
              ) : (
                <ol className={s.steps}>
                  {activeSteps.map((step, index) => (
                    <li key={step.id} className={s.step}>
                      <span className={s.stepDot} aria-hidden="true">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className={s.stepHeading}>
                          <span className="sr-only">{index + 1}. </span>
                          {step.heading}
                        </p>
                        <p className={s.stepAction}>{step.action}</p>
                        <p className={s.ready}>
                          <Icon name="clipboard" size={16} />
                          <span>
                            <strong className="text-[var(--ink)]">Have ready:</strong>{" "}
                            {step.haveReady}
                          </span>
                        </p>
                        <p className={s.stepLink}>
                          {step.isExternal ? (
                            <a href={step.contactHref} target="_blank" rel="noopener noreferrer">
                              {step.contactLabel} →
                            </a>
                          ) : (
                            <Link href={step.contactHref}>{step.contactLabel} →</Link>
                          )}
                        </p>
                        {step.phoneNote && (
                          <p className={s.phoneNote}>
                            <Icon name="phone" size={14} />
                            <span>{step.phoneNote}</span>
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
