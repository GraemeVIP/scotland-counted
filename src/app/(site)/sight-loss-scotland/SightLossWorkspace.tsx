"use client";

import { useState, type ReactNode } from "react";
import Link from "@/components/IntentLink";
import { ADULT_DISABILITY_PAYMENT as ADP, SOCIAL_SECURITY_SCOTLAND as SSS } from "@/lib/data/benefits";
import styles from "./sightLoss.module.css";

type TaxBand = "none" | "basic" | "intermediate" | "higher";

const BLIND_ALLOWANCE = 3250;
const TV_DISCOUNT = 90;

const TAX_RATES: Record<TaxBand, { label: string; rate: number; annualSaving: number }> = {
  none: { label: "No income tax paid", rate: 0, annualSaving: 0 },
  basic: { label: "Basic rate (20%)", rate: 0.2, annualSaving: Math.round(BLIND_ALLOWANCE * 0.2) },
  intermediate: {
    label: "Intermediate (21%)",
    rate: 0.21,
    annualSaving: Math.round(BLIND_ALLOWANCE * 0.21),
  },
  higher: { label: "Higher rate (42%+)", rate: 0.42, annualSaving: Math.round(BLIND_ALLOWANCE * 0.42) },
};

/* Simple stroke icons. Decorative only, so always hidden from screen readers. */
const ICON_PATHS: Record<string, ReactNode> = {
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17.5" cy="9" r="2.5" />
      <path d="M16 14.2c2.9.2 5 2.6 5 5.8" />
    </>
  ),
  pound: (
    <>
      <path d="M17 6.5A4 4 0 0 0 9.5 8v12" />
      <path d="M6.5 13h8" />
      <path d="M6.5 20H18" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  ),
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5A8 8 0 1 1 21 12Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  heart: (
    <path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6.1a5 5 0 1 1 7.5 6.5Z" />
  ),
  hand: (
    <>
      <path d="M11 12.5V5.5a1.5 1.5 0 0 1 3 0v6" />
      <path d="M14 11V4.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M17 8.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-1.2a7 7 0 0 1-5-2.1l-3.3-3.4a1.6 1.6 0 0 1 2.2-2.3L8 16V7.5a1.5 1.5 0 0 1 3 0v5" />
    </>
  ),
  form: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  building: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V10l7-5 7 5v11" />
      <path d="M9.5 21v-5h5v5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.1" />
    </>
  ),
  text: (
    <>
      <path d="M4 7V5h10v2M9 5v14M7 19h4" />
      <path d="M14 12v-1.5h7V12M17.5 10.5V19M16 19h3" />
    </>
  ),
};

function Icon({ name, className }: { name: keyof typeof ICON_PATHS; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className ?? styles.icon}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

function IconChip({ name, tone }: { name: keyof typeof ICON_PATHS; tone: string }) {
  return (
    <span className={`${styles.iconChip} ${tone}`} aria-hidden="true">
      <Icon name={name} className="" />
    </span>
  );
}

function HeroArt() {
  return (
    <svg viewBox="0 0 240 240" fill="none" aria-hidden="true" focusable="false">
      <circle cx="120" cy="120" r="112" stroke="currentColor" strokeOpacity="0.16" strokeWidth="2" />
      <circle cx="120" cy="120" r="86" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" />
      <circle cx="120" cy="120" r="60" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2" />
      <path
        d="M62 120s22-38 58-38 58 38 58 38-22 38-58 38-58-38-58-38Z"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <circle cx="120" cy="120" r="19" stroke="currentColor" strokeWidth="6" />
      <circle cx="120" cy="120" r="6" fill="currentColor" />
      <circle cx="210" cy="64" r="5" fill="currentColor" fillOpacity="0.6" />
      <circle cx="34" cy="170" r="4" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}

export default function SightLossWorkspace() {
  const [highContrast, setHighContrast] = useState(false);
  const [scale, setScale] = useState(1);

  const [taxBand, setTaxBand] = useState<TaxBand>("basic");
  const [hasCviBlind, setHasCviBlind] = useState(true);
  const [usesBus, setUsesBus] = useState(true);
  const [inWork, setInWork] = useState(false);

  function toggleHighContrast() {
    setHighContrast((prev) => {
      const next = !prev;
      if (next && scale < 1.3) setScale(1.35);
      if (!next && scale === 1.35) setScale(1);
      return next;
    });
  }

  const taxSaving = TAX_RATES[taxBand].annualSaving;
  const tvSaving = hasCviBlind ? TV_DISCOUNT : 0;
  const totalCashSaving = taxSaving + tvSaving;
  const fourYearBackdate = taxSaving * 4;

  const tick = (
    <span className={styles.tick} aria-hidden="true">
      <Icon name="check" className="" />
    </span>
  );

  return (
    <div
      className={[styles.wrap, highContrast && styles.highContrast, scale > 1 && styles.scaled]
        .filter(Boolean)
        .join(" ")}
      style={{ ["--sight-scale" as string]: String(scale) }}
    >
      {/* Prominent, unmistakable high-contrast & large-text controls bar */}
      <div className={styles.readerBar} role="region" aria-label="Easier reading controls">
        <div className={styles.readerBarTitle}>
          <span className={styles.readerBarIcon} aria-hidden="true">
            <Icon name="text" />
          </span>
          <span>Easier reading mode</span>
        </div>

        <div className={styles.readerBarControls}>
          <button
            type="button"
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
            className={
              highContrast ? `${styles.hcToggle} ${styles.hcToggleActive}` : styles.hcToggle
            }
          >
            <Icon name="eye" />
            {highContrast ? "Switch back to standard colours" : "High contrast dark + large text"}
          </button>

          <div className={styles.sizeGroup} role="group" aria-label="Text size">
            <button
              type="button"
              onClick={() => setScale(1)}
              aria-pressed={scale === 1}
              className={scale === 1 ? `${styles.sizeBtn} ${styles.sizeBtnActive}` : styles.sizeBtn}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setScale(1.3)}
              aria-pressed={scale === 1.3 || scale === 1.35}
              className={
                scale === 1.3 || scale === 1.35
                  ? `${styles.sizeBtn} ${styles.sizeBtnActive}`
                  : styles.sizeBtn
              }
            >
              Large
            </button>
            <button
              type="button"
              onClick={() => setScale(1.55)}
              aria-pressed={scale === 1.55}
              className={
                scale === 1.55 ? `${styles.sizeBtn} ${styles.sizeBtnActive}` : styles.sizeBtn
              }
            >
              Extra large
            </button>
          </div>
        </div>
      </div>

      <header className={styles.hero}>
        <div>
          <p className={styles.heroEyebrow}>
            <Icon name="eye" />
            Sight loss in Scotland · Data, rights and support
          </p>
          <h1 className={styles.h1}>Losing your sight or living with sight loss in Scotland</h1>
          <p className={styles.lede}>
            Near 194,000 people in Scotland live with sight loss. Most are not on a council blind
            list. Many miss tax breaks, free bus passes, work grants and weekly payments. Here is what
            the data shows and what you can claim today.
          </p>
        </div>
        <div className={styles.heroArt}>
          <HeroArt />
        </div>
      </header>

      {/* Section 1: Data first */}
      <section className={styles.section} aria-labelledby="data-heading">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>What the Scottish numbers show</p>
          <h2 id="data-heading" className={styles.h2}>
            Why thousands of Scots miss help they can claim now
          </h2>
        </div>

        <div className={styles.statGrid}>
          <div className={`${styles.card} ${styles.statCard} ${styles.toneBlue}`}>
            <div className={styles.statTop}>
              <IconChip name="people" tone={styles.toneBlue} />
              <p className={styles.eyebrow}>Living with sight loss</p>
            </div>
            <p className={styles.statNum}>193,674</p>
            <p className={styles.body}>
              People in Scotland live with sight loss today. Around 8,730 more lose sight each year
              (RNIB data).
            </p>
          </div>
          <div className={`${styles.card} ${styles.statCard} ${styles.toneTeal}`}>
            <div className={styles.statTop}>
              <IconChip name="pound" tone={styles.toneTeal} />
              <p className={styles.eyebrow}>Scottish tax rule</p>
            </div>
            <p className={styles.statNum}>£3,250</p>
            <p className={styles.body}>
              Blind Person&apos;s Allowance for 2026/27. In Scotland you do NOT need a council blind
              card to claim it. You can claim back up to 4 tax years.
            </p>
          </div>
          <div className={`${styles.card} ${styles.statCard} ${styles.tonePurple}`}>
            <div className={styles.statTop}>
              <IconChip name="trend" tone={styles.tonePurple} />
              <p className={styles.eyebrow}>Forecast by 2036</p>
            </div>
            <p className={styles.statNum}>234,000+</p>
            <p className={styles.body}>
              Scots forecast to live with sight loss in ten years, up 21%. Eye clinic waits are
              long, yet local help can start now.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Scottish Sight Loss Entitlements & Tax Savings Estimator */}
      <section className={styles.section} aria-labelledby="calc-heading">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Quick checker · 2026/27 Scottish rules</p>
          <h2 id="calc-heading" className={styles.h2}>
            Check what tax breaks and support you could claim
          </h2>
          <p className={styles.body}>
            Pick the options that fit you. Nothing you tap leaves this screen.
          </p>
        </div>

        <div className={styles.calcWrap}>
          <div className={styles.toggleRow}>
            <div className={`${styles.card} ${styles.questionCard}`}>
              <h3 className={styles.h3}>1. Do you (or your partner) pay Scottish Income Tax?</h3>
              <p className={styles.body}>
                In Scotland, you can claim Blind Person&apos;s Allowance if an eye doctor says you
                cannot do work that needs sight. Pay no tax? Pass the £3,250 allowance to your
                spouse or civil partner.
              </p>
              <div className={styles.taxPills} role="group" aria-label="Scottish tax band">
                {(Object.keys(TAX_RATES) as TaxBand[]).map((band) => (
                  <button
                    key={band}
                    type="button"
                    aria-pressed={taxBand === band}
                    onClick={() => setTaxBand(band)}
                    className={
                      taxBand === band ? `${styles.taxPill} ${styles.taxPillActive}` : styles.taxPill
                    }
                  >
                    {TAX_RATES[band].label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              aria-pressed={hasCviBlind}
              onClick={() => setHasCviBlind((v) => !v)}
              className={
                hasCviBlind ? `${styles.checkCard} ${styles.checkCardActive}` : styles.checkCard
              }
            >
              <span className={styles.checkBox} aria-hidden="true">
                {hasCviBlind ? "✓" : ""}
              </span>
              <span>
                <strong className={styles.h3} style={{ display: "block" }}>
                  2. Signed off as blind (severely sight impaired) on a CVI
                </strong>
                <span className={styles.body} style={{ display: "block", marginTop: "0.25rem" }}>
                  Cuts your TV Licence in half (saves £90 off £180 a year) for your whole home. Also
                  backs up mobility claims.
                </span>
              </span>
            </button>

            <button
              type="button"
              aria-pressed={usesBus}
              onClick={() => setUsesBus((v) => !v)}
              className={
                usesBus ? `${styles.checkCard} ${styles.checkCardActive}` : styles.checkCard
              }
            >
              <span className={styles.checkBox} aria-hidden="true">
                {usesBus ? "✓" : ""}
              </span>
              <span>
                <strong className={styles.h3} style={{ display: "block" }}>
                  3. Travel by bus or train in Scotland
                </strong>
                <span className={styles.body} style={{ display: "block", marginTop: "0.25rem" }}>
                  Get a free Scottish bus pass and a +1 friend pass so someone travels free with
                  you.
                </span>
              </span>
            </button>

            <button
              type="button"
              aria-pressed={inWork}
              onClick={() => setInWork((v) => !v)}
              className={
                inWork ? `${styles.checkCard} ${styles.checkCardActive}` : styles.checkCard
              }
            >
              <span className={styles.checkBox} aria-hidden="true">
                {inWork ? "✓" : ""}
              </span>
              <span>
                <strong className={styles.h3} style={{ display: "block" }}>
                  4. In work, self-employed, or starting a job
                </strong>
                <span className={styles.body} style={{ display: "block", marginTop: "0.25rem" }}>
                  Claim a free Access to Work grant for big screens, reading tools, support staff,
                  or taxis to work.
                </span>
              </span>
            </button>
          </div>

          <aside className={styles.resultCard} aria-live="polite">
            <div className={styles.resultTop}>
              <p className={styles.eyebrow}>Your guide total for 2026/27</p>
              <p className={styles.statNum}>£{totalCashSaving.toLocaleString("en-GB")} / year</p>
              <p className={styles.body}>
                Direct tax and bill savings each year before any weekly payment.
              </p>
            </div>

            <ul className={styles.resultList}>
              {taxSaving > 0 ? (
                <li>
                  {tick}
                  <span>
                    <strong>Blind Person&apos;s Allowance:</strong> saves about{" "}
                    <strong>£{taxSaving} a year</strong> in Scottish tax. Backdating 4 years could
                    bring back up to <strong>£{fourYearBackdate.toLocaleString("en-GB")}</strong>{" "}
                    from HMRC.
                  </span>
                </li>
              ) : (
                <li>
                  {tick}
                  <span>
                    <strong>Blind Person&apos;s Allowance:</strong> if your spouse or civil partner
                    pays tax, pass the £3,250 allowance to them.
                  </span>
                </li>
              )}

              {hasCviBlind && (
                <li>
                  {tick}
                  <span>
                    <strong>Half-price TV Licence:</strong> pay £90 instead of £180 a year. Covers
                    everyone in your home.
                  </span>
                </li>
              )}

              <li>
                {tick}
                <span>
                  <strong>Adult Disability Payment (ADP):</strong> £
                  {ADP.dailyLiving.standard.toFixed(2)} to £{ADP.dailyLiving.enhanced.toFixed(2)} a
                  week for daily help, plus £{ADP.mobility.standard.toFixed(2)} to £
                  {ADP.mobility.enhanced.toFixed(2)} for getting around. Tax free, no means test.{" "}
                  <Link href="/adult-disability-payment">See full ADP guide</Link>.
                </span>
              </li>

              {usesBus && (
                <li>
                  {tick}
                  <span>
                    <strong>Free Scottish bus pass (+1 friend):</strong> apply via your council or
                    getyournec.scot. You can also get a railcard.
                  </span>
                </li>
              )}

              {inWork && (
                <li>
                  {tick}
                  <span>
                    <strong>Access to Work and job rights:</strong> your boss must make fair changes
                    at work (big screen, software, light, or hours). Access to Work helps pay for kit
                    and travel.
                  </span>
                </li>
              )}
            </ul>
          </aside>
        </div>
      </section>

      {/* Section 3: Step-by-step roadmap */}
      <section className={styles.section} aria-labelledby="steps-heading">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Step by step</p>
          <h2 id="steps-heading" className={styles.h2}>
            What to do if you are losing your sight now
          </h2>
        </div>

        <div className={styles.stepsGrid}>
          <div className={`${styles.card} ${styles.stepCard} ${styles.toneBlue}`}>
            <span className={styles.stepNum} aria-hidden="true">
              1
            </span>
            <div>
              <h3 className={styles.h3}>Book a free NHS eye test now</h3>
              <p className={styles.body}>
                NHS eye tests are free for all in Scotland. If your sight drops fast, tell the
                optician it is urgent. They can send you straight to a hospital eye clinic with no GP
                wait.
              </p>
            </div>
          </div>

          <div className={`${styles.card} ${styles.stepCard} ${styles.toneTeal}`}>
            <span className={styles.stepNum} aria-hidden="true">
              2
            </span>
            <div>
              <h3 className={styles.h3}>Ask for the Eye Clinic Liaison Officer</h3>
              <p className={styles.body}>
                Most Scottish eye clinics have an ECLO. They explain your test in plain words, sort
                magnifiers, and link you up with local help.
              </p>
            </div>
          </div>

          <div className={`${styles.card} ${styles.stepCard} ${styles.tonePurple}`}>
            <span className={styles.stepNum} aria-hidden="true">
              3
            </span>
            <div>
              <h3 className={styles.h3}>Get a CVI, but do not wait to ask for help</h3>
              <p className={styles.body}>
                A hospital eye doctor signs a CVI form if you meet blind or low sight rules. While
                you wait, call your council sight team direct for lamps, talking kit, and cane
                training.
              </p>
            </div>
          </div>

          <div className={`${styles.card} ${styles.stepCard} ${styles.toneGreen}`}>
            <span className={styles.stepNum} aria-hidden="true">
              4
            </span>
            <div>
              <h3 className={styles.h3}>Claim tax, benefits and work rights</h3>
              <p className={styles.body}>
                Call HMRC for Blind Person&apos;s Allowance. Apply for Adult Disability Payment (or
                Pension Age Disability Payment if retired). The Equality Act 2010 protects your
                rights at work and in shops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Direct Scottish helplines */}
      <section className={styles.section} aria-labelledby="help-heading">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Free help in Scotland</p>
          <h2 id="help-heading" className={styles.h2}>
            Where to turn today
          </h2>
        </div>

        <div className={styles.helplineGrid}>
          <div className={`${styles.card} ${styles.helpCard}`}>
            <div className={styles.helpHead}>
              <IconChip name="eye" tone={styles.toneBlue} />
              <h3 className={styles.h3}>RNIB Scotland Helpline</h3>
            </div>
            <p className={styles.body}>
              Free help on CVI forms, benefits, work rights, reading tech, and coping with sight
              loss. Open Monday to Friday, 9am to 6pm.
            </p>
            <a href="https://www.rnib.org.uk/about-us/contact-us/" target="_blank" rel="noopener noreferrer" className={styles.phoneBtn}>
              <Icon name="chat" />
              Send RNIB a message
            </a>
            <p className={styles.phoneLine}>
              Or phone <a href="tel:03031239999">0303 123 9999</a>
            </p>
          </div>

          <div className={`${styles.card} ${styles.helpCard}`}>
            <div className={styles.helpHead}>
              <IconChip name="heart" tone={styles.toneTeal} />
              <h3 className={styles.h3}>Sight Scotland (Family Support)</h3>
            </div>
            <p className={styles.body}>
              Free Scottish charity help for people with sight loss and their families. Open Monday
              to Friday, 10am to 12pm and 1pm to 3pm. Veterans line: 0800 035 6409.
            </p>
            <a href="https://sightscotland.org.uk/individual-and-group-support" target="_blank" rel="noopener noreferrer" className={styles.phoneBtn}>
              <Icon name="compass" />
              See how they can help
            </a>
            <p className={styles.phoneLine}>
              Or phone <a href="tel:08000248973">0800 024 8973</a>
            </p>
          </div>

          <div className={`${styles.card} ${styles.helpCard}`}>
            <div className={styles.helpHead}>
              <IconChip name="hand" tone={styles.tonePurple} />
              <h3 className={styles.h3}>Visibility Scotland</h3>
            </div>
            <p className={styles.body}>
              Scottish sight loss charity giving one to one help, clinic support, and daily living
              tips across Scotland.
            </p>
            <a href="mailto:info@visibilityscotland.org.uk" className={styles.phoneBtn}>
              <Icon name="mail" />
              Email Visibility Scotland
            </a>
            <p className={styles.phoneLine}>
              Or phone <a href="tel:08009871087">0800 987 1087</a>
            </p>
          </div>

          <div className={`${styles.card} ${styles.helpCard}`}>
            <div className={styles.helpHead}>
              <IconChip name="form" tone={styles.toneOrange} />
              <h3 className={styles.h3}>VoiceAbility Scotland (Free form help)</h3>
            </div>
            <p className={styles.body}>
              Funded by the Scottish Government to help disabled people fill in benefit forms for
              free. Open Monday to Friday, 9am to 5pm.
            </p>
            <a href="https://www.voiceability.org/in-scotland" target="_blank" rel="noopener noreferrer" className={styles.phoneBtn}>
              <Icon name="form" />
              Ask for form help online
            </a>
            <p className={styles.phoneLine}>
              Or phone <a href="tel:03003031660">0300 303 1660</a>
            </p>
          </div>

          <div className={`${styles.card} ${styles.helpCard}`}>
            <div className={styles.helpHead}>
              <IconChip name="building" tone={styles.toneGreen} />
              <h3 className={styles.h3}>Social Security Scotland</h3>
            </div>
            <p className={styles.body}>
              Apply for Scottish disability payments online or by phone. Phone lines open {SSS.hours}.
            </p>
            <a
              href="https://www.mygov.scot/contact-social-security-scotland"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.phoneBtn}
            >
              <Icon name="chat" />
              Webchat or contact online
            </a>
            <p className={styles.phoneLine}>
              Or phone <a href={SSS.phoneHref}>{SSS.phone}</a>
            </p>
          </div>

          <div className={`${styles.card} ${styles.helpCard} ${styles.linksCard}`}>
            <div className={styles.helpHead}>
              <IconChip name="compass" tone={styles.toneBlue} />
              <h3 className={styles.h3}>More Scottish support guides</h3>
            </div>
            <p className={styles.body}>
              Need wider disability help, urgent cash, or mental health support?
            </p>
            <ul className={styles.linkList}>
              <li>
                <Link href="/where-to-apply-scotland">Where to apply: 24 direct links →</Link>
              </li>
              <li>
                <Link href="/benefit-or-crisis-grant-rejected-scotland">
                  Turned down? How to challenge a refusal →
                </Link>
              </li>
              <li>
                <Link href="/disability-support-scotland">Disability rights and ADP data →</Link>
              </li>
              <li>
                <Link href="/struggling-right-now-scotland">Urgent cash and bills help →</Link>
              </li>
              <li>
                <Link href="/suicide-scotland-statistics-and-support">
                  Mental health and suicide support →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className={styles.disclaimer}>
        <Icon name="info" />
        <p style={{ margin: 0 }}>
          <strong>Plain note:</strong> This page shares free public facts from 2026/27 HMRC, Social
          Security Scotland, TV Licensing, and RNIB sources. It is not personal tax, medical, or
          legal advice. Always check your own case with a doctor, HMRC, RNIB, or Citizens Advice
          Scotland.
        </p>
      </div>
    </div>
  );
}
