import Link from "@/components/IntentLink";
import type { CSSProperties } from "react";
import { Page, ContentFrame, SectionHead, CTA } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  ADULT_DISABILITY_PAYMENT as ADP,
  CARER_SUPPORT_PAYMENT as CSP,
  SOCIAL_SECURITY_SCOTLAND as SSS,
} from "@/lib/data/benefits";
import { meta } from "@/lib/seo";
import { Icon, type IconName } from "./icons";
import styles from "./disability.module.css";

export const metadata = meta({
  title: "Disability Support, ADP Data & Rights in Scotland (2026/27)",
  description:
    "Official Social Security Scotland approval rates, wait times, 2026/27 Adult Disability Payment rates, free VoiceAbility advocacy, sight loss support, and workplace rights.",
  path: "/disability-support-scotland",
});

const colorVar = (color: string) => ({ "--c": color }) as CSSProperties;

type HelpAction = { label: string; href: string };

/**
 * Each card ends in something to do, not just a fact: the official place to
 * apply, or free help when someone says no.
 */
const EXTRA_HELP: { title: string; body: string; icon: IconName; color: string; actions: HelpAction[] }[] = [
  {
    title: "Access to Work",
    body: "Your health makes work harder? This UK grant can pay for kit, software, a support worker or taxis to get you there. You apply yourself, online.",
    icon: "briefcase",
    color: "var(--hub-tax)",
    actions: [{ label: "Apply online", href: "https://www.gov.uk/access-to-work/apply" }],
  },
  {
    title: "Ask for changes at work or in shops",
    body: "The law says employers, councils and shops must make fair changes for your health, sight or hearing. Ask them in writing. If they say no, a free service can tell you what to do next.",
    icon: "scale",
    color: "var(--hub-reps)",
    actions: [{ label: "Get free advice online", href: "https://www.equalityadvisoryservice.com/" }],
  },
  {
    title: "Blue Badge and bus pass",
    body: "A Blue Badge lets you park closer, and hidden conditions count too. Disabled people in Scotland can also get a free bus pass.",
    icon: "bus",
    color: "var(--hub-area)",
    actions: [
      { label: "Apply for a Blue Badge", href: "https://www.gov.uk/apply-blue-badge" },
      { label: "Apply for a bus pass", href: "https://getyournec.scot/" },
    ],
  },
  {
    title: "Help to adapt your home",
    body: "Your council can fit grab rails, ramps or a shower you can walk into, and lend you equipment. Start by asking them for a care needs assessment.",
    icon: "home",
    color: "var(--hub-schools)",
    actions: [{ label: "How to ask your council", href: "https://www.mygov.scot/care-equipment-adapt-home" }],
  },
];

export default function DisabilitySupportScotlandPage() {
  const heroFacts = [
    { value: "52% to 54%", label: "first claims turned down." },
    { value: "51 to 86", label: "days wait from Part 2." },
    { value: `£${ADP.dailyLiving.enhanced.toFixed(2)}`, label: "top weekly care rate in 2026/27." },
  ];

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Benefits", path: "/benefits" },
          { name: "Disability support in Scotland", path: "/disability-support-scotland" },
        ]}
      />
      <Page>
        <header className={styles.hero}>
          <div className="min-w-0">
            <p className={styles.eyebrow}>
              <Icon name="shield" />
              Disability in Scotland
              <span className={styles.eyebrowExtra}> · Data and rights</span>
            </p>
            <h1 className={`h1 ${styles.heroTitle}`}>
              Disability help, benefits and rights in Scotland
            </h1>
            <div className={`lede ${styles.heroLede}`}>
              <ExplainText>
                Over half of first Adult Disability Payment claims are turned down. See the real
                odds, what proof counts, and where to get free form help.
              </ExplainText>
            </div>
          </div>
          <div className="min-w-0">
            <p className={styles.panelLabel}>Real ADP numbers</p>
            <ul className={styles.stats}>
              {heroFacts.map((f) => (
                <li key={f.value} className={styles.stat}>
                  <span className={styles.statValue}>{f.value}</span>
                  <span className={styles.statLabel}>
                    <ExplainText>{f.label}</ExplainText>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <ContentFrame>
          {/* Sight loss prominent cross-link */}
          <section className="pt-10 pb-12 sm:pt-12">
            <div className={styles.sight}>
              <span className={styles.sightIcon}>
                <Icon name="eye" />
              </span>
              <div className="min-w-0">
                <p className={styles.sightKicker}>Sight loss hub</p>
                <h2 className={styles.sightTitle}>Losing your sight or blind in Scotland?</h2>
                <p className={styles.sightBody}>
                  Open our Sight Loss page. It has one tap high contrast dark and big text mode, a
                  tax savings checker, and direct Scottish phone lines.
                </p>
              </div>
              <Link href="/sight-loss-scotland" className={styles.sightBtn}>
                Open Sight Loss guide
                <Icon name="arrow" className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </section>

          {/* Section 1: Data led reality of ADP */}
          <section className="pb-14">
            <SectionHead
              eyebrow="What the Scottish data shows"
              title="Why half of first ADP claims fail, and how to prepare"
            />
            <div className={styles.grid3}>
              <div className={styles.card} style={colorVar("var(--hub-benefits)")}>
                <span className={styles.iconChip}>
                  <Icon name="chart" />
                </span>
                <p className={styles.cardKicker}>Yes vs no</p>
                <p className={styles.bigFig}>43% to 45%</p>
                <div aria-hidden="true">
                  <div className={styles.split}>
                    <span className={styles.splitYes} />
                    <span className={styles.splitNo} />
                  </div>
                  <div className={styles.splitKey}>
                    <span>Yes</span>
                    <span>No</span>
                  </div>
                </div>
                <p className={styles.cardText}>
                  <ExplainText>
                    Only 43% to 45% of normal rules ADP claims get a yes first time. Around 52% to
                    54% get a no.
                  </ExplainText>
                </p>
              </div>

              <div className={styles.card} style={colorVar("var(--hub-area)")}>
                <span className={styles.iconChip}>
                  <Icon name="clipboard" />
                </span>
                <p className={styles.cardKicker}>Why claims fail</p>
                <p className={styles.cardHeading}>Daily life beats a label</p>
                <p className={styles.cardText}>
                  <ExplainText>
                    Naming an illness is not enough. Say what goes wrong on bad days, how long tasks
                    take, and if you are safe.
                  </ExplainText>
                </p>
              </div>

              <div className={styles.card} style={colorVar("var(--hub-reps)")}>
                <span className={styles.iconChip}>
                  <Icon name="phone" />
                </span>
                <p className={styles.cardKicker}>Free form help</p>
                <p className={styles.cardHeading}>VoiceAbility Scotland</p>
                <p className={styles.cardText}>
                  <ExplainText>
                    Scotland funds VoiceAbility to help you fill in ADP forms for free. Call 0300
                    303 1660, Monday to Friday, 9am to 5pm.
                  </ExplainText>
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Main Scottish disability benefits 2026/27 */}
          <section className="pb-14">
            <SectionHead
              eyebrow="2026/27 Scottish payments"
              title="Main disability and carer payments in Scotland"
            />
            <div className={styles.grid2}>
              <div className={styles.card} style={colorVar("var(--hub-benefits)")}>
                <div className={styles.payHead}>
                  <span className={styles.iconChip}>
                    <Icon name="person" />
                  </span>
                  <h3 className={styles.payTitle}>Adult Disability Payment (ADP)</h3>
                </div>
                <div className={styles.payBody}>
                  <p className={styles.cardText}>For ages 16 to pension age. Tax free, no means test.</p>
                  <ul className={styles.rates}>
                    <li className={styles.rate}>
                      <span>Daily care is</span>
                      <span>
                        <strong className={styles.fig}>£{ADP.dailyLiving.standard.toFixed(2)}</strong>{" "}
                        or{" "}
                        <strong className={styles.fig}>£{ADP.dailyLiving.enhanced.toFixed(2)}</strong>{" "}
                        a week.
                      </span>
                    </li>
                    <li className={styles.rate}>
                      <span>Getting around is</span>
                      <span>
                        <strong className={styles.fig}>£{ADP.mobility.standard.toFixed(2)}</strong>{" "}
                        or{" "}
                        <strong className={styles.fig}>£{ADP.mobility.enhanced.toFixed(2)}</strong>{" "}
                        a week.
                      </span>
                    </li>
                  </ul>
                </div>
                <Link href="/adult-disability-payment" className={styles.cardLink}>
                  Full ADP guide and rates
                  <Icon name="arrow" />
                </Link>
              </div>

              <div className={styles.card} style={colorVar("var(--hub-reps)")}>
                <div className={styles.payHead}>
                  <span className={styles.iconChip}>
                    <Icon name="heart" />
                  </span>
                  <h3 className={styles.payTitle}>Carer Support Payment</h3>
                </div>
                <div className={styles.payBody}>
                  <p className={styles.leadFig}>
                    <strong className={styles.fig}>£{CSP.weekly.toFixed(2)}</strong> a week in
                    2026/27.
                  </p>
                  <p className={styles.cardText}>
                    For carers who give {CSP.hours}+ hours a week and earn under £
                    {CSP.earningsLimit} a week after tax.
                  </p>
                </div>
                <Link href="/carer-support-payment" className={styles.cardLink}>
                  See Carer Support Payment guide
                  <Icon name="arrow" />
                </Link>
              </div>

              <div className={styles.card} style={colorVar("var(--hub-area)")}>
                <div className={styles.payHead}>
                  <span className={styles.iconChip}>
                    <Icon name="family" />
                  </span>
                  <h3 className={styles.payTitle}>Child and Pension Age payments</h3>
                </div>
                <p className={`${styles.cardText} ${styles.payBody}`}>
                  Child Disability Payment helps under 16s. Pension Age Disability Payment helps
                  older Scots who need care or watching over.
                </p>
                <div className={styles.linkRow}>
                  <a
                    href="https://www.mygov.scot/child-disability-payment/how-to-apply"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardLink}
                  >
                    Apply for a child <Icon name="arrow" />
                  </a>
                  <a
                    href="https://www.mygov.scot/pension-age-disability-payment/how-to-apply"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardLink}
                  >
                    Apply for an older person <Icon name="arrow" />
                  </a>
                </div>
                <p className={styles.phoneSmall}>
                  Or phone <a href={SSS.phoneHref}>{SSS.phone}</a>
                </p>
              </div>

              <div
                className={`${styles.card} ${styles.warnCard}`}
                style={colorVar("var(--hub-investigations)")}
              >
                <div className={styles.payHead}>
                  <span className={styles.iconChip}>
                    <Icon name="clock" />
                  </span>
                  <h3 className={styles.payTitle}>Turned down? You have 42 days</h3>
                </div>
                <div className={styles.payBody}>
                  <p className={styles.leadFig}>
                    You get <strong className={styles.fig}>42 days</strong>
                  </p>
                  <p className={styles.cardText}>
                    from your letter to ask for a fresh look. Call Citizens Advice or VoiceAbility
                    first so you can send clear proof.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Practical rights beyond benefits */}
          <section className="pb-14">
            <SectionHead eyebrow="Rights, travel and work" title="Extra help people often miss" />
            <div className={styles.grid4}>
              {EXTRA_HELP.map((item) => (
                <div key={item.title} className={styles.card} style={colorVar(item.color)}>
                  <span className={styles.iconChip}>
                    <Icon name={item.icon} />
                  </span>
                  <h3 className={styles.miniTitle}>{item.title}</h3>
                  <p className={styles.miniText}>{item.body}</p>
                  <div className={styles.helpActions}>
                    {item.actions.map((action, i) => (
                      <a
                        key={action.href}
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={i === 0 ? styles.helpBtn : styles.helpBtnAlt}
                      >
                        {action.label} <span aria-hidden="true">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="pb-10">
            <div className={styles.note}>
              <span className={styles.noteIcon}>
                <Icon name="info" />
              </span>
              <p>
                <strong>Plain note:</strong> Figures come from Social Security Scotland and
                mygov.scot for 2026/27. This is public guide info, not personal legal advice. For
                free form help call VoiceAbility on <a href="tel:03003031660">0300 303 1660</a>.
              </p>
            </div>
          </section>

          <CTA
            title="Need cash or bill help today?"
            body="Check your council's Crisis Grant rate, phone number, and free debt help."
            href="/struggling-right-now-scotland"
            cta="Open urgent help hub"
            secondaryHref="/sight-loss-scotland"
            secondaryCta="Open Sight Loss hub"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
