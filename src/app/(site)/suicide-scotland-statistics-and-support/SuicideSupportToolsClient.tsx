"use client";

import { useState } from "react";
import Link from "@/components/IntentLink";
import { ExplainText } from "@/components/Glossary";
import { Icon, type IconName } from "./icons";
import styles from "./suicide.module.css";

type DemographicId = "men" | "women" | "young" | "older" | "debt";

const TRIAL_CARDS = [
  {
    stat: "43% lower risk",
    title: "Write a 4-line Safety Plan before panic hits",
    icon: "clipboard" as IconName,
    proof:
      "A 2021 British Journal of Psychiatry meta-analysis of clinical trials found written safety plans cut crisis acts by 43%.",
    action:
      "Do tonight: Fill in the 1-minute Safety Plan below and save it to your phone notes while your head is clear.",
    sourceLabel: "British Journal of Psychiatry (2021 meta-analysis)",
  },
  {
    stat: "218 trials · 14,170 people",
    title: "Move your body on a clock, not on mood",
    icon: "walk" as IconName,
    proof:
      "A 2024 BMJ meta-analysis of 218 clinical trials found walking, jogging, yoga, and weights cut depression strongly. Harder effort worked even better.",
    action:
      "Do today: Put shoes on for a brisk 15-minute walk or 20 minutes of weights. Do not wait to feel ready.",
    sourceLabel: "British Medical Journal (2024 meta-analysis)",
  },
  {
    stat: "Up to 7x spike",
    title: "Skip alcohol completely on dark nights",
    icon: "glassOff" as IconName,
    proof:
      "A Psychological Medicine meta-analysis shows drinking during distress raises attempt risk up to 7 times. Heavy drinking triples long-term risk.",
    action:
      "Do tonight: Drink numbs pain for 30 minutes, then wrecks sleep and kills your brakes. Ride tonight out sober.",
    sourceLabel: "Psychological Medicine (2017) and PLOS ONE (2015)",
  },
  {
    stat: "Matches full CBT",
    title: "Act first, wait for mood second",
    icon: "calendar" as IconName,
    proof:
      "The UK NHS COBRA clinical trial in The Lancet proved Behavioural Activation worked just as well as full CBT for depression.",
    action:
      "Do tomorrow: Book 1 small daily job (shower, short walk, coffee with one person) and do it at the set time.",
    sourceLabel: "UK NHS COBRA trial, The Lancet (2016)",
  },
  {
    stat: "Cuts dark thoughts",
    title: "Fix broken sleep first",
    icon: "moon" as IconName,
    proof:
      "Meta-analyses of CBT-I sleep therapy prove fixing broken sleep lowers both depression and suicidal thoughts directly.",
    action:
      "Do tonight: Keep one fixed wake-up time. If awake 20 minutes at 2am, get up in dim light until sleepy. No bed scrolling.",
    sourceLabel: "Pooled CBT-I clinical trials",
  },
  {
    stat: "3x higher risk",
    title: "Freeze problem debt before it crushes you",
    icon: "pound" as IconName,
    proof:
      "UK Money and Mental Health research shows people in problem debt are 3 times more likely to have suicidal thoughts.",
    action:
      "Do this week: Ask StepChange Scotland for a free 6-month Debt Moratorium to pause chasing letters and bailiffs.",
    sourceLabel: "Money and Mental Health Policy Institute",
  },
] as const;

const DEMOGRAPHICS: {
  id: DemographicId;
  label: string;
  scottishFact: string;
  whatTrialsShow: string;
  moves: string[];
  linkHref: string;
  linkLabel: string;
  isExternal?: boolean;
}[] = [
  {
    id: "men",
    label: "Working-age men (25 to 64)",
    scottishFact:
      "Men make up 74% of deaths in Scotland (522 men in 2025). The male rate is 3.1 times higher than women.",
    whatTrialsShow:
      "Action beats sitting around waiting to feel like talking. The 2024 BMJ review of 218 tests found brisk walking, jogging, and weights cut depression strongly. Skipping alcohol on rough nights removes the 7x impulse spike.",
    moves: [
      "Lock in 3 brisk walks or gym sessions on fixed days each week and cut alcohol on rough nights.",
      "Ask your Scottish GP for an 8am to 11am fasting blood test (testosterone, SHBG, thyroid, and vitamin D).",
      "Save the 4-line Safety Plan in your phone (cuts crisis acts by 43%) and try Andy's Man Club on Monday at 7pm.",
    ],
    linkHref: "https://andysmanclub.co.uk/find-your-nearest-group/",
    linkLabel: "Find your nearest Scottish Andy's Man Club",
    isExternal: true,
  },
  {
    id: "women",
    label: "Women under heavy strain",
    scottishFact:
      "181 women died in Scotland in 2025. Caring overload, broken sleep, and chronic pain often sit behind severe low mood.",
    whatTrialsShow:
      "The 2024 BMJ review found weight training gave big drops in low mood and was easiest for younger women to stick with. The UK NHS Lancet study showed small daily action plans match full talking therapy.",
    moves: [
      "Protect sleep first: same wake time every day and leave the bed if awake for 20 minutes.",
      "Add 2 short weight or brisk walk sessions a week before mood improves.",
      "Book one small daily routine that is just for you, and check Carer Support or ADP if caring is draining you.",
    ],
    linkHref: "/disability-support-scotland",
    linkLabel: "Check Scottish disability and carer support",
  },
  {
    id: "young",
    label: "Under 25s and students",
    scottishFact:
      "Overall rates are lower than in middle age, but late-night spirals, exam pressure, and feeling trapped hit fast.",
    whatTrialsShow:
      "Written Safety Plans cut crisis acts by 43% because they give you a clear script when panic hits at 2am. The 2024 BMJ review showed walking, running, and weights gave big mood lifts in young adults.",
    moves: [
      "Fill in the 1-minute Safety Plan below tonight and pin it at the top of your phone Notes.",
      "Charge your phone outside the bedroom after midnight to break 2am scrolling.",
      "Use silent text (Text SHOUT to 85258) or CALM webchat if speaking aloud feels impossible.",
    ],
    linkHref: "https://giveusashout.org/",
    linkLabel: "See how silent Shout text works",
    isExternal: true,
  },
  {
    id: "older",
    label: "Older adults (60+)",
    scottishFact:
      "The average age of suicide in Scotland has climbed to 48.2. Being alone, grief, pain, and sight loss raise risk in later life.",
    whatTrialsShow:
      "The 2024 BMJ review found yoga, walking, and gentle weights were easiest for older adults (especially older men) to keep up. Booking one regular social plan each week breaks lonely loops fast.",
    moves: [
      "Put one fixed out-of-house habit on the calendar every week (walk group, club, or regular cafe).",
      "Ask your GP to check pain, sleep, hearing, or eyesight. Untreated health strain feeds low mood.",
      "Check Pension Credit, Winter Heating, or our Scottish Sight Loss guide if bills or health feel heavy.",
    ],
    linkHref: "/sight-loss-scotland",
    linkLabel: "Check Scottish sight loss and older support",
  },
  {
    id: "debt",
    label: "Crushed by debt or bills",
    scottishFact:
      "Rates in Scotland's poorest fifth are 2.7 times higher. UK research shows problem debt triples the risk of suicidal thoughts.",
    whatTrialsShow:
      "Talking care alone struggles while debt letters and rent warnings keep landing. Clearing the cash panic with Crisis Grants and Scotland's 6-month legal debt freeze gives your brain room to breathe.",
    moves: [
      "Apply online today for your council Crisis Grant so food and power are covered by tomorrow.",
      "Ask StepChange Scotland for a free 6-month Debt Moratorium to freeze chasing legally.",
      "Pay rent, power, and Council Tax first. Credit cards and loans can wait.",
    ],
    linkHref: "/struggling-right-now-scotland",
    linkLabel: "Open urgent Scottish money help hub",
  },
];

export function EvidenceAndDemographics() {
  const [demoId, setDemoId] = useState<DemographicId>("men");
  const active = DEMOGRAPHICS.find((d) => d.id === demoId)!;

  return (
    <div className="space-y-8">
      {/* 6 symmetrical medical test proof cards */}
      <div className={styles.trialGrid}>
        {TRIAL_CARDS.map((card, i) => (
          <div key={card.title} className={`${styles.card} ${styles.trialCard}`}>
            <div className={styles.trialTop}>
              <span
                className={i % 2 ? `${styles.chip} ${styles.chipBlue}` : styles.chip}
                aria-hidden="true"
              >
                <Icon name={card.icon} />
              </span>
              <p className={styles.statPill}>{card.stat}</p>
            </div>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardText} style={{ fontSize: 14.5 }}>
              <ExplainText>{card.proof}</ExplainText>
            </p>
            <div className={styles.actionBox}>{card.action}</div>
            <p className={styles.source}>
              <Icon name="book" size={14} />
              <span>Source: {card.sourceLabel}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Interactive Demographic Playbook */}
      <div className={styles.panel}>
        <p className="kicker text-[var(--brand)] mb-1">Matched to your life</p>
        <h3 className="text-[22px] sm:text-[26px] font-[720] leading-tight tracking-[-0.02em]">
          What medical tests show works best for people like you
        </h3>

        <div className={styles.tabs} role="tablist" aria-label="Demographic group">
          {DEMOGRAPHICS.map((item) => {
            const isOn = item.id === demoId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isOn}
                onClick={() => setDemoId(item.id)}
                className={isOn ? `${styles.tab} ${styles.tabOn}` : styles.tab}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className={styles.playGrid}>
          <div>
            <div className={styles.factBox}>
              <div className={styles.factHead}>
                <span className={`${styles.chip} ${styles.chipBlue}`} aria-hidden="true">
                  <Icon name="chart" size={18} />
                </span>
                <p className={`${styles.label} ${styles.labelBlue}`}>The Scottish numbers</p>
              </div>
              <p>{active.scottishFact}</p>
            </div>
            <div className={styles.factBox}>
              <div className={styles.factHead}>
                <span className={styles.chip} aria-hidden="true">
                  <Icon name="flask" size={18} />
                </span>
                <p className={styles.label}>What medical tests show works</p>
              </div>
              <p>{active.whatTrialsShow}</p>
            </div>
          </div>

          <div className={styles.movesBox}>
            <p className={styles.label}>3 concrete moves for this week</p>
            <ol className={styles.movesList}>
              {active.moves.map((move, index) => (
                <li key={move}>
                  <span className={styles.num} aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>{move}</span>
                </li>
              ))}
            </ol>
            <p className={styles.movesFoot}>
              {active.isExternal ? (
                <a href={active.linkHref} target="_blank" rel="noopener noreferrer">
                  {active.linkLabel} →
                </a>
              ) : (
                <Link href={active.linkHref}>{active.linkLabel} →</Link>
              )}
            </p>
          </div>
        </div>

        <div className={`mt-6 ${styles.note} ${styles.noteQuiet}`}>
          <Icon name="info" />
          <p className="m-0 text-[14.5px]">
            <strong className="text-[var(--ink)]">Health note:</strong> These steps work alongside
            NHS care, not instead of it. Never stop prescribed tablets suddenly without speaking to
            your GP or chemist first.
          </p>
        </div>
      </div>
    </div>
  );
}

type SituationId = "tonight" | "worried" | "noPhone" | "money" | "bereaved";

type SupportCard = {
  tag: string;
  icon: IconName;
  name: string;
  body: string;
  phoneNote: string;
  ctaLabel: string;
  href: string;
  isExternal?: boolean;
};

const SITUATIONS: { id: SituationId; label: string; intro: string; cards: SupportCard[] }[] = [
  {
    id: "tonight",
    label: "Struggling tonight",
    intro: "You do not have to explain everything cleanly. Pick one option below right now.",
    cards: [
      {
        tag: "24/7 · Free",
        name: "Samaritans Scotland",
        icon: "phone",
        body: "Someone listens with zero judgement any time, day or night. You can call or email.",
        phoneNote: "Free phone: 116 123 · Email: jo@samaritans.org",
        ctaLabel: "See Samaritans options",
        href: "https://www.samaritans.org/scotland/how-we-can-help/contact-samaritan/",
        isExternal: true,
      },
      {
        tag: "Scotland · Free",
        name: "Breathing Space",
        icon: "message",
        body: "Scotland's free space to talk or webchat when low mood or panic hits. Evenings and all weekend.",
        phoneNote: "Free phone: 0800 83 85 87 (Mon to Thu 6pm to 2am; Fri 6pm to Mon 6am)",
        ctaLabel: "Open Breathing Space webchat",
        href: "https://www.breathingspace.scot/",
        isExternal: true,
      },
      {
        tag: "24/7 · NHS Scotland",
        name: "NHS 24 Mental Health Hub",
        icon: "phone",
        body: "Speak to a trained mental health nurse in Scotland any hour of the day or night.",
        phoneNote: "Free phone: 111 (pick the Mental Health option)",
        ctaLabel: "NHS Inform mental health",
        href: "https://www.nhsinform.scot/illnesses-and-conditions/mental-health",
        isExternal: true,
      },
    ],
  },
  {
    id: "worried",
    label: "Worried about someone",
    intro: "You do not need to be an expert to help someone stay safe tonight.",
    cards: [
      {
        tag: "24/7 · Free advice",
        name: "Samaritans for friends and family",
        icon: "phone",
        body: "You can ring or message Samaritans for advice when you are worried about a mate or partner.",
        phoneNote: "Free phone: 116 123 (24 hours)",
        ctaLabel: "How to support someone",
        href: "https://www.samaritans.org/scotland/how-we-can-help/if-youre-worried-about-someone-else/",
        isExternal: true,
      },
      {
        tag: "Scotland · Men's groups",
        name: "Andy's Man Club",
        icon: "users",
        body: "Free peer groups across Scotland every Monday at 7pm. No GP note, no waitlist, no pressure.",
        phoneNote: "Free drop-in across Scotland every Monday at 7pm",
        ctaLabel: "Find nearest Scottish group",
        href: "https://andysmanclub.co.uk/find-your-nearest-group/",
        isExternal: true,
      },
      {
        tag: "Urgent · NHS Scotland",
        name: "NHS 24 (111) or 999",
        icon: "lifebuoy",
        body: "Call 111 together to reach the Mental Health Hub. If they are in immediate danger, call 999.",
        phoneNote: "Urgent NHS: 111 · Immediate danger: 999",
        ctaLabel: "NHS Inform crisis guide",
        href: "https://www.nhsinform.scot/illnesses-and-conditions/mental-health",
        isExternal: true,
      },
    ],
  },
  {
    id: "noPhone",
    label: "Hate phone calls",
    intro: "You do not have to speak aloud. Every option below works by silent text or online chat.",
    cards: [
      {
        tag: "24/7 · Silent text",
        name: "Shout Text Line",
        icon: "text",
        body: "Free, private text chat with a trained volunteer. Works quietly from any mobile phone.",
        phoneNote: "Text SHOUT to 85258 (free on all UK networks)",
        ctaLabel: "How Shout text works",
        href: "https://giveusashout.org/",
        isExternal: true,
      },
      {
        tag: "Webchat · WhatsApp",
        name: "CALM Online Chat",
        icon: "message",
        body: "Free webchat and WhatsApp support for anyone over 18. Open 5pm to midnight every day.",
        phoneNote: "Free phone: 0800 58 58 58 · Webchat 5pm to midnight",
        ctaLabel: "Open CALM webchat",
        href: "https://www.thecalmzone.net/",
        isExternal: true,
      },
      {
        tag: "Scotland · Men online",
        name: "Brothers in Arms Scotland",
        icon: "users",
        body: "Free digital mental health tools and support built for men in Scotland.",
        phoneNote: "Online self-help and support for Scottish men",
        ctaLabel: "Open Brothers in Arms",
        href: "https://www.brothersinarmsscotland.co.uk/",
        isExternal: true,
      },
    ],
  },
  {
    id: "money",
    label: "Money or debt stress",
    intro: "Money pressure is a huge driver of distress in Scotland. Tackle the cash panic first.",
    cards: [
      {
        tag: "32 councils · Fast cash",
        name: "Urgent money help hub",
        icon: "pound",
        body: "Get your council Crisis Grant online form, 2025/26 approval odds, and a today action plan.",
        phoneNote: "98% of Scottish Crisis Grants answered next working day",
        ctaLabel: "Open urgent money hub",
        href: "/struggling-right-now-scotland",
      },
      {
        tag: "6-month legal freeze",
        name: "StepChange Scotland",
        icon: "shield",
        body: "Free Scottish debt plans and the 6-month Debt Moratorium to stop chasing and sheriff officers.",
        phoneNote: "Free phone: 0800 138 1111",
        ctaLabel: "Start online debt check",
        href: "https://www.stepchange.org/debt-info/debt-in-scotland.aspx",
        isExternal: true,
      },
      {
        tag: "Refused claim?",
        name: "Challenge a benefit or grant no",
        icon: "clipboard",
        body: "Around half of challenged Crisis Grants and ADP claims get changed. Build a free review note.",
        phoneNote: "Free SPSO checks: 0800 014 7299",
        ctaLabel: "Open free refusal builder",
        href: "/benefit-or-crisis-grant-rejected-scotland",
      },
    ],
  },
  {
    id: "bereaved",
    label: "Lost someone to suicide",
    intro: "Grief after suicide is heavy and different. Free Scottish help is open from day one.",
    cards: [
      {
        tag: "Scotland · Free grief help",
        name: "Cruse Scotland",
        icon: "heart",
        body: "Free listening and grief support across Scotland for adults, young people, and families.",
        phoneNote: "Free phone: 0808 802 6161",
        ctaLabel: "Open Cruse Scotland",
        href: "https://www.crusescotland.org.uk/",
        isExternal: true,
      },
      {
        tag: "Peer support · Adults",
        name: "SOBS (Bereaved by Suicide)",
        icon: "users",
        body: "Run by people who have lost someone to suicide. Free helpline and local peer groups.",
        phoneNote: "Phone: 0300 111 5065 (9am to 9pm daily)",
        ctaLabel: "Open SOBS support",
        href: "https://uksobs.org/",
        isExternal: true,
      },
      {
        tag: "Scottish Government grant",
        name: "Funeral Support Payment",
        icon: "pound",
        body: "Helps pay funeral costs in Scotland if you get qualifying benefits or tax credits.",
        phoneNote: "Social Security Scotland: 0800 182 2222",
        ctaLabel: "Check Funeral Support",
        href: "https://www.mygov.scot/funeral-support-payment",
        isExternal: true,
      },
    ],
  },
];

const TEXT_STARTERS = [
  {
    id: "mate",
    label: "Checking in on a quiet mate",
    message:
      "Alright mate, you have been quiet lately. Everything alright? Free for a coffee or a walk this week if you fancy getting out the house.",
  },
  {
    id: "direct",
    label: "Asking the straight question",
    message:
      "Look, I can tell things are rough for you right now. I am going to ask you straight: are you thinking about ending it? You do not need to deal with that yourself.",
  },
  {
    id: "stay",
    label: "Keeping them company tonight",
    message:
      "Forget trying to sort it all tonight. I am coming round with a brew, or stay on the phone with me just now. If you want, we can give 111 or Breathing Space a shout together.",
  },
];

export function SituationMatcher() {
  const [activeId, setActiveId] = useState<SituationId>("tonight");
  const active = SITUATIONS.find((s) => s.id === activeId)!;

  return (
    <div className={styles.panel}>
      <p className="kicker text-[var(--brand)] mb-1">Find the right help fast</p>
      <h2 className="text-[24px] sm:text-[30px] font-[720] leading-tight tracking-[-0.02em]">
        Pick what fits your situation right now
      </h2>

      <div className={styles.tabs} role="tablist" aria-label="Your situation">
        {SITUATIONS.map((sit) => {
          const isOn = sit.id === activeId;
          return (
            <button
              key={sit.id}
              type="button"
              role="tab"
              aria-selected={isOn}
              onClick={() => setActiveId(sit.id)}
              className={isOn ? `${styles.tab} ${styles.tabOn}` : styles.tab}
            >
              {sit.label}
            </button>
          );
        })}
      </div>

      <p className={styles.matchIntro}>{active.intro}</p>

      <div className={styles.helpGrid}>
        {active.cards.map((card) => (
          <div key={card.name} className={styles.helpCard}>
            <div className={styles.cardHead}>
              <span className={styles.chip} aria-hidden="true">
                <Icon name={card.icon} />
              </span>
              <p className={styles.label}>{card.tag}</p>
            </div>
            <h3 className={styles.cardTitle} style={{ marginTop: 14, fontSize: 18 }}>
              {card.name}
            </h3>
            <p className={styles.cardText} style={{ fontSize: 14.5 }}>
              {card.body}
            </p>
            <p className={styles.phoneNote}>
              <Icon name="phone" size={15} />
              <span>{card.phoneNote}</span>
            </p>
            {card.isExternal ? (
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pillLink}
              >
                {card.ctaLabel} →
              </a>
            ) : (
              <Link href={card.href} className={styles.pillLink}>
                {card.ctaLabel} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorriedAndSafetyTools() {
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [warningSign, setWarningSign] = useState("");
  const [steadier, setSteadier] = useState("");
  const [personOrPlace, setPersonOrPlace] = useState("");
  const [reasonToStay, setReasonToStay] = useState("");
  const [copiedPlan, setCopiedPlan] = useState(false);

  async function copyMessage(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(id);
      window.setTimeout(() => setCopiedMsgId(null), 2200);
    } catch {
      setCopiedMsgId(null);
    }
  }

  const safetyPlanText = [
    "MY 1-MINUTE SAFETY PLAN (SCOTLAND)",
    "",
    `1. Early sign my head is getting heavy:\n   ${warningSign.trim() || "[Add 1 sign, e.g. stopping texts or not sleeping]"}`,
    "",
    `2. Small thing that steadies me for 20 minutes:\n   ${steadier.trim() || "[Add 1 thing, e.g. cold water, short walk, music]"}`,
    "",
    `3. Person or safe place I can message or go to:\n   ${personOrPlace.trim() || "[Add 1 name or place]"}`,
    "",
    `4. One reason to get through tonight:\n   ${reasonToStay.trim() || "[Add 1 anchor for tonight]"}`,
    "",
    "FREE 24/7 SCOTTISH BACKUP NUMBERS:",
    "- Samaritans (24/7): 116 123",
    "- Breathing Space (Scotland): 0800 83 85 87",
    "- NHS 24 Mental Health Hub: 111",
    "- Free silent text: Text SHOUT to 85258",
    "- Immediate danger: 999",
  ].join("\n");

  async function copySafetyPlan() {
    try {
      await navigator.clipboard.writeText(safetyPlanText);
      setCopiedPlan(true);
      window.setTimeout(() => setCopiedPlan(false), 2400);
    } catch {
      setCopiedPlan(false);
    }
  }

  const planFields = [
    {
      label: "1. One early sign my head is getting heavy",
      value: warningSign,
      set: setWarningSign,
      placeholder: "e.g. Ignoring texts, not sleeping, feeling trapped",
    },
    {
      label: "2. One small thing that steadies me for 20 minutes",
      value: steadier,
      set: setSteadier,
      placeholder: "e.g. Cold water on my face, short walk, kettle on, music",
    },
    {
      label: "3. One person or safe place I can message or go to",
      value: personOrPlace,
      set: setPersonOrPlace,
      placeholder: "e.g. Text my sister, go round to a mate's, walk to a cafe",
    },
    {
      label: "4. One reason to get through tonight",
      value: reasonToStay,
      set: setReasonToStay,
      placeholder: "e.g. My kids, my dog, tomorrow morning, speaking to my GP",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Worried about someone toolkit */}
      <div className={styles.panel}>
        <p className="kicker text-[var(--brand)] mb-1">Worried about a mate, partner, or family member?</p>
        <h2 className="text-[24px] sm:text-[30px] font-[720] leading-tight tracking-[-0.02em]">
          Real words you can send tonight
        </h2>
        <div className={`mt-5 ${styles.note}`}>
          <Icon name="info" />
          <p className="m-0">
            <strong>Myth check:</strong> Asking someone plainly if they are thinking about suicide
            does <strong>not</strong> put the idea in their head. NHS Scotland and Samaritans
            research shows asking directly often lowers stress and opens the door to help.
          </p>
        </div>

        <div className={`mt-5 ${styles.helpGrid}`}>
          {TEXT_STARTERS.map((item) => (
            <div key={item.id} className={styles.bubbleCard}>
              <div className={styles.cardHead}>
                <span className={`${styles.chip} ${styles.chipBlue}`} aria-hidden="true">
                  <Icon name="message" />
                </span>
                <p className={`${styles.label} ${styles.labelBlue}`}>{item.label}</p>
              </div>
              <p className={styles.bubble}>&ldquo;{item.message}&rdquo;</p>
              <button
                type="button"
                onClick={() => copyMessage(item.id, item.message)}
                className={
                  copiedMsgId === item.id ? `${styles.copyBtn} ${styles.copyDone}` : styles.copyBtn
                }
              >
                <Icon name={copiedMsgId === item.id ? "check" : "copy"} size={16} />
                {copiedMsgId === item.id ? "Copied message" : "Copy message"}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.miniSteps}>
          <div className={styles.miniStep}>
            <span className={styles.num} aria-hidden="true">
              1
            </span>
            <div>
              <p className="text-[15px] font-[720] text-[var(--ink)]">If they say yes, stay calm</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-[var(--ink-2)]">
                Listen without rushing to fix things. Thank them for telling you.
              </p>
            </div>
          </div>
          <div className={styles.miniStep}>
            <span className={styles.num} aria-hidden="true">
              2
            </span>
            <div>
              <p className="text-[15px] font-[720] text-[var(--ink)]">Stay with them tonight</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-[var(--ink-2)]">
                Stay in the room or on the phone if they feel unsafe right now.
              </p>
            </div>
          </div>
          <div className={styles.miniStep}>
            <span className={styles.num} aria-hidden="true">
              3
            </span>
            <div>
              <p className="text-[15px] font-[720] text-[var(--ink)]">Bring in free backup</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-[var(--ink-2)]">
                Ring NHS 111 or Breathing Space together. Call 999 if they are in immediate danger.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Private 1-minute Safety Plan builder */}
      <div className={styles.panel}>
        <p className="kicker text-[var(--brand)] mb-1">Private 1-minute tool · Stays on your device</p>
        <h2 className="text-[24px] sm:text-[30px] font-[720] leading-tight tracking-[-0.02em]">
          Build a 1-minute Safety Plan for rough nights
        </h2>
        <p className={styles.intro} style={{ fontSize: 16 }}>
          When your head is scrambled at 2am, it is hard to think straight. Fill in four quick lines
          now and copy them into your phone notes. Nothing leaves this screen.
        </p>

        <div className={styles.planGrid}>
          <div className={styles.fields}>
            {planFields.map((field) => (
              <label key={field.label} className={styles.field}>
                {field.label}
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  placeholder={field.placeholder}
                  className={styles.input}
                />
              </label>
            ))}
          </div>

          <div className={styles.planNote}>
            <div className={styles.planBar}>
              <span className={styles.planBarLabel}>
                <Icon name="clipboard" size={18} className="text-[var(--hub-benefits)]" />
                <span className={styles.label}>Ready for your phone notes</span>
              </span>
              <div className={styles.planBtns}>
                <button type="button" onClick={copySafetyPlan} className={styles.primaryBtn}>
                  <Icon name={copiedPlan ? "check" : "copy"} size={16} />
                  {copiedPlan ? "Copied plan" : "Copy to phone notes"}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className={styles.copyBtn}
                  style={{ marginTop: 0 }}
                >
                  <Icon name="printer" size={16} />
                  Print
                </button>
              </div>
            </div>
            <pre className={styles.planText}>{safetyPlanText}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
