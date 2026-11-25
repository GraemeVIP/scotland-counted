import type { ReactNode } from "react";
import { Page, ContentFrame, CTA } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { crisisGrantScotland } from "@/lib/data/crisisGrants";
import { meta } from "@/lib/seo";
import ChallengeWizardClient from "./ChallengeWizardClient";
import { Icon, type IconName } from "./icons";
import s from "./challenge.module.css";

export const metadata = meta({
  title: "Turned Down for a Benefit or Crisis Grant in Scotland? How to Challenge",
  description:
    "Official Scottish overturn rates, deadline calculator, 32 council Crisis Grant refusal league table, free SPSO and VoiceAbility numbers, and interactive review letter builder.",
  path: "/benefit-or-crisis-grant-rejected-scotland",
});

const tel = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, "")}`;

/** The header figures, with the low and high ends drawn as a range bar. */
const OVERTURN_RATES = [
  { value: "50% to 60%", low: 50, high: 60, label: "SPSO Crisis Grant reviews changed." },
  { value: "45% to 49%", low: 45, high: 49, label: "ADP checks allowed or partly allowed." },
  { value: "53% to 54%", low: 53, high: 54, label: "ADP appeals won by the claimant." },
];

const WORDING: {
  claim: string;
  icon: IconName;
  weak: { quote: string; why: string };
  strong: { quote: string; why: string };
}[] = [
  {
    claim: "Disability claim",
    icon: "heart",
    weak: {
      quote: "I have bad eyesight and pain in my knees.",
      why: "Staff cannot score a health label on its own. They score what you cannot do safely, in good time, and again and again.",
    },
    strong: {
      quote:
        "I cannot read food labels or the dials on my cooker, so I need someone with me to make a meal safely. That is every day. After ten minutes on my feet my legs give way, and I have fallen twice this month.",
      why: "Says what you cannot do, how often, the help you need, and what happens when you try.",
    },
  },
  {
    claim: "Crisis Grant",
    icon: "pound",
    weak: {
      quote: "I am skint and need help before payday.",
      why: "Councils often turn down general money claims. Name the sudden hit or urgent risk to health.",
    },
    strong: {
      quote:
        "My hours were cut this week and I have £4 left. My pre-pay power meter runs out tonight with two kids at home.",
      why: "Names the sudden drop, shows exact cash left, and proves urgent risk to heat or food.",
    },
  },
];

function HelpCard({
  icon,
  name,
  body,
  phone,
  href,
  cta,
}: {
  icon: IconName;
  name: string;
  body: ReactNode;
  phone: string;
  href: string;
  cta: string;
}) {
  return (
    <div className={s.adviceCard}>
      <span className={`${s.chip} ${s.chipLg}`}>
        <Icon name={icon} size={24} />
      </span>
      <h3 className={s.adviceName}>{name}</h3>
      <p className={s.adviceBody}>{body}</p>
      <div className={s.adviceActions}>
        <a href={href} target="_blank" rel="noopener noreferrer" className={s.onlineBtn}>
          {cta} <span aria-hidden="true">→</span>
        </a>
        <p className={s.phoneSmall}>
          Or phone <a href={tel(phone)}>{phone}</a>
        </p>
      </div>
    </div>
  );
}

export default function BenefitRejectedScotlandPage() {
  return (
    <div className={s.page}>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Benefits", path: "/benefits" },
          { name: "Benefit or Crisis Grant refused", path: "/benefit-or-crisis-grant-rejected-scotland" },
        ]}
      />
      <Page>
        <ContentFrame>
          <header className={s.hero}>
            <div className={s.heroCopy}>
              <p className={s.pill}>
                <Icon name="scale" size={15} />
                <ExplainText>Refused in Scotland · Data and rights</ExplainText>
              </p>
              <h1 className={`h1 ${s.heroTitle}`}>Turned down for a benefit or Crisis Grant?</h1>
              <div className={`lede ${s.heroLede}`}>
                <ExplainText>
                  A first no is often not final. Around half of challenged Crisis Grants and ADP
                  claims get changed. Check your cut-off date, build a review note, and see real
                  council refusal rates.
                </ExplainText>
              </div>
            </div>
            <div className={s.facts}>
              <p className={s.factsLabel}>Real Scottish overturn rates</p>
              <ul className={s.factList}>
                {OVERTURN_RATES.map((f) => (
                  <li key={f.label} className={s.range}>
                    <div className={s.rangeTop}>
                      <span className={`figure-num ${s.rangeValue}`}>{f.value}</span>
                      <span className={s.rangeText}>
                        <ExplainText>{f.label}</ExplainText>
                      </span>
                    </div>
                    <div className={s.track} aria-hidden="true">
                      <span className={s.trackFill} style={{ width: `${f.low}%` }} />
                      <span
                        className={s.trackSpread}
                        style={{ left: `${f.low}%`, width: `${Math.max(1.5, f.high - f.low)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </header>

          {/* Interactive deadline checker + letter builder + 32-council refusal table */}
          <section className={s.section}>
            <ChallengeWizardClient />
          </section>

          {/* What fails vs what wins: concrete examples split clearly by claim type */}
          <section className={s.section}>
            <p className={s.kicker}>
              <Icon name="xCircle" size={16} />
              Why claims fail
            </p>
            <h2 className={`display-stat ${s.sectionTitle}`}>
              What gets turned down vs what wins a review
            </h2>
            {WORDING.map((w) => (
              <div key={w.claim} className={s.group}>
                <h3 className={s.groupTitle}>
                  <span className={s.chip}>
                    <Icon name={w.icon} size={20} />
                  </span>
                  {w.claim}
                </h3>
                <div className={s.compare}>
                  <div className={s.weak}>
                    <p className={s.badge}>
                      <Icon name="xCircle" size={16} />
                      Weak wording
                    </p>
                    <p className={s.quote}>&ldquo;{w.weak.quote}&rdquo;</p>
                    <p className={s.why}>{w.weak.why}</p>
                  </div>
                  <div className={s.strong}>
                    <p className={s.badge}>
                      <Icon name="checkCircle" size={16} />
                      Strong wording
                    </p>
                    <p className={s.quote}>&ldquo;{w.strong.quote}&rdquo;</p>
                    <p className={s.why}>{w.strong.why}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Free Scottish appeal & review help (online first + phone reference) */}
          <section className={s.section}>
            <p className={s.kicker}>
              <Icon name="shield" size={16} />
              Free appeal help
            </p>
            <h2 className={`display-stat ${s.sectionTitle}`}>
              Who can back you up for free in Scotland
            </h2>
            <div className={s.advice}>
              <HelpCard
                icon="scale"
                name="SPSO (Crisis Grants)"
                body="Free independent check if your council still says no after Tier 1. Urgent cases often answered in 1 working day."
                phone="0800 014 7299"
                href="https://swf.spso.org.uk/"
                cta="Request a review"
              />
              <HelpCard
                icon="heart"
                name="VoiceAbility Scotland"
                body="Free help for disabled Scots challenging Scottish disability benefit decisions."
                phone="0300 303 1660"
                href="https://www.voiceability.org/in-scotland"
                cta="Request help online"
              />
              <HelpCard
                icon="eye"
                name="RNIB Scotland"
                body="Sight loss advisers who help blind and partially sighted Scots challenge refused claims."
                phone="0303 123 9999"
                href="https://www.rnib.org.uk/about-us/contact-us/"
                cta="Send RNIB a message"
              />
              <HelpCard
                icon="chat"
                name="Citizens Advice Scotland"
                body="Free help with DWP checks, tribunal forms, and council tax reviews in all 32 areas."
                phone="0800 028 1456"
                href="https://www.cas.org.uk/bureaux"
                cta="Find local office"
              />
            </div>
          </section>

          <section className="pb-4">
            <div className={s.note}>
              <span className={s.chip}>
                <Icon name="info" size={20} />
              </span>
              <p className={`m-0 ${s.noteText}`}>
                <strong>Data sources and plain note:</strong> Across Scotland,{" "}
                {crisisGrantScotland.rejections.toLocaleString("en-GB")} Crisis Grants were turned
                down in 2025/26. Rates come from SPSO and Social Security Scotland reports. This
                page shares free public facts, not legal advice.{" "}
                <ExplainText>
                  Call VoiceAbility or Citizens Advice Scotland for free help with your case.
                </ExplainText>
              </p>
            </div>
          </section>

          <CTA
            title="Need the direct official link to apply instead?"
            body="Browse 24 direct Scottish links sorted by topic so you never get stuck in government website loops."
            href="/where-to-apply-scotland"
            cta="Open Where to Apply directory"
            secondaryHref="/struggling-right-now-scotland"
            secondaryCta="Open urgent help hub"
          />
        </ContentFrame>
      </Page>
    </div>
  );
}
