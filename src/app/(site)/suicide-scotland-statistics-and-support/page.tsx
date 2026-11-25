import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, HeaderFacts, SectionHead, CTA } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { meta } from "@/lib/seo";
import {
  EvidenceAndDemographics,
  SituationMatcher,
  WorriedAndSafetyTools,
} from "./SuicideSupportToolsClient";
import { Icon, type IconName } from "./icons";
import styles from "./suicide.module.css";

export const metadata = meta({
  title: "Suicide & Depression in Scotland: Proven Steps, Real Data & 24/7 Support",
  description:
    "What medical tests on thousands of real people prove actually helps depression and suicidal thoughts, tailored Scottish playbooks, official NRS data, a 1-minute Safety Plan, and 24/7 support.",
  path: "/suicide-scotland-statistics-and-support",
});

const NRS_TREND = [
  { year: "2019", deaths: 833 },
  { year: "2020", deaths: 805 },
  { year: "2021", deaths: 753 },
  { year: "2022", deaths: 762 },
  { year: "2023", deaths: 792 },
  { year: "2024", deaths: 704 },
  { year: "2025", deaths: 703 },
] as const;

const HELPLINES: {
  tag: string;
  tagIcon: IconName;
  name: string;
  number: string;
  callHref: string;
  callIcon: IconName;
  desc: string;
  href: string;
  linkLabel: string;
}[] = [
  {
    tag: "24/7 · Free phone or email",
    tagIcon: "clock",
    name: "Samaritans:",
    number: "116 123",
    callHref: "tel:116123",
    callIcon: "phone",
    desc: "Talk or email in confidence any hour, day or night.",
    href: "https://www.samaritans.org/scotland/how-we-can-help/contact-samaritan/",
    linkLabel: "Contact them online",
  },
  {
    tag: "Scotland · Phone or webchat",
    tagIcon: "message",
    name: "Breathing Space:",
    number: "0800 83 85 87",
    callHref: "tel:0800838587",
    callIcon: "phone",
    desc: "Weekdays 6pm to 2am and 24 hours across the weekend.",
    href: "https://www.breathingspace.scot/",
    linkLabel: "Start a webchat",
  },
  {
    tag: "24/7 · NHS Scotland",
    tagIcon: "clock",
    name: "NHS 24:",
    number: "Call 111",
    callHref: "tel:111",
    callIcon: "phone",
    desc: "Choose the Mental Health Hub option any time.",
    href: "https://www.nhsinform.scot/illnesses-and-conditions/mental-health",
    linkLabel: "Mental health help",
  },
  {
    tag: "24/7 · Silent text",
    tagIcon: "clock",
    name: "Shout:",
    number: "85258",
    callHref: "sms:85258?&body=SHOUT",
    callIcon: "text",
    desc: "Free, silent text support if you cannot speak aloud.",
    href: "https://giveusashout.org/",
    linkLabel: "How Shout works",
  },
];

const WHAT_HAPPENS_ROWS = [
  {
    service: "Breathing Space (0800 83 85 87)",
    icon: "message" as IconName,
    record: "No. Completely private.",
    work: "No. Never told.",
    what: "A calm listener talks or webchats with you. No GP note needed.",
  },
  {
    service: "NHS 24 Mental Health Hub (111)",
    icon: "phone" as IconName,
    record: "Shared with your GP so they can follow up.",
    work: "No. Strictly private.",
    what: "A trained mental health nurse helps make a safe plan for tonight.",
  },
  {
    service: "Your Scottish GP",
    icon: "clipboard" as IconName,
    record: "Yes, on your private NHS notes.",
    work: "No. Only if you ask for a fit note.",
    what: "Can offer talking care, medication, fit notes, or local NHS referral.",
  },
  {
    service: "Hospital A&E",
    icon: "home" as IconName,
    record: "Yes, on your NHS record.",
    work: "No. Strictly private.",
    what: "A safe space tonight and a check with a mental health nurse.",
  },
  {
    service: "Andy's Man Club (Mon 7pm)",
    icon: "users" as IconName,
    record: "No. First name only.",
    work: "No. Peer group only.",
    what: "Free cup of tea and a chat with other men. Zero pressure to speak.",
  },
] as const;

export default function SuicideScotlandPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Benefits", path: "/benefits" },
          {
            name: "Suicide statistics and support",
            path: "/suicide-scotland-statistics-and-support",
          },
        ]}
      />
      <Page>
        <div className={styles.page}>
        {/* Calm, prominent 24/7 crisis support box FIRST, before any figures */}
        <ContentFrame className="pt-6">
          <section aria-label="Free 24/7 crisis support in Scotland" className={styles.crisis}>
            <div className={styles.crisisHead}>
              <span className={styles.crisisMark} aria-hidden="true">
                <Icon name="heart" size={26} />
              </span>
              <div>
                <p className={styles.crisisKicker}>Free, private support right now</p>
                <h2 className={styles.crisisTitle}>
                  If you are struggling tonight, free help is open now.
                </h2>
                <p className={styles.crisisLede}>
                  You do not have to wait for a crisis. Every service below is free in Scotland. If
                  someone is in immediate danger, <a href="tel:999">call 999</a> or go to A&amp;E.
                </p>
              </div>
            </div>

            <div className={styles.lineGrid}>
              {HELPLINES.map((line) => (
                <div key={line.number} className={styles.lineCard}>
                  <p className={styles.lineTag}>
                    <Icon name={line.tagIcon} size={15} />
                    {line.tag}
                  </p>
                  <a
                    href={line.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.callBtn}
                  >
                    <span className={styles.callIcon} aria-hidden="true">
                      <Icon name={line.callIcon === "text" ? "text" : "message"} size={20} />
                    </span>
                    <span className={styles.callText}>
                      <span className={styles.callLead}>{line.name.replace(/:$/, "")}</span>
                      <span className={styles.webMain}>{line.linkLabel} →</span>
                    </span>
                  </a>
                  <p className={styles.lineDesc}>{line.desc}</p>
                  <p className={styles.lineNumber}>
                    <Icon name={line.callIcon} size={15} />
                    <span>
                      {line.callIcon === "text" ? "Or text" : "Or phone"}{" "}
                      <a href={line.callHref}>{line.number.replace(/^Call /, "")}</a>
                      {line.callIcon === "text" ? " with the word SHOUT" : ""}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </ContentFrame>

        <PageHeader
          eyebrow="Scottish data · Plain answers"
          title="Suicide in Scotland: real data, honest answers, and free help"
          lede="Three in four deaths are men. Rates in Scotland's poorest areas are 2.7 times higher. See what actually happens when you ask for help, use our 1-minute Safety Plan, and read the real numbers."
          panel={
            <HeaderFacts
              label="NRS Scotland (2025)"
              items={[
                { value: "703", label: "deaths in 2025 (down from 833 in 2019)." },
                { value: "74% men", label: "522 men vs 181 women (3.1x male rate)." },
                { value: "2.7x", label: "higher rate in Scotland's poorest fifth." },
              ]}
            />
          }
        />

        <ContentFrame>
          {/* Section 1: Authoritative Clinical Trials & Meta-Analyses with clickable squiggle explainers */}
          <section className="pb-14">
            <SectionHead
              eyebrow="Gold-standard medical proof"
              title="What clinical trials and meta-analyses prove helps"
            />
            <p className={styles.intro}>
              <ExplainText>
                Everyone already knows phone numbers exist. These six steps are not guesses or soft
                opinions. They come from clinical trials and meta-analyses, the gold standard in
                medical proof. Tap any underlined word to see why it beats opinion.
              </ExplainText>
            </p>
            <div className="mt-7">
              <EvidenceAndDemographics />
            </div>
          </section>

          {/* Section 1B: Low testosterone & hidden blood causes in men */}
          <section id="low-testosterone-blood-tests" className="pb-14">
            <SectionHead
              eyebrow="Check the physical root · Men's bloods"
              title="Low testosterone and depression: how to get your bloods checked in Scotland"
            />
            <p className={styles.intro}>
              <ExplainText>
                Flat mood, heavy tiredness, brain fog, poor sleep, and zero drive are often treated
                as depression alone. Sometimes the cause is physical. A 2019 JAMA Psychiatry
                meta-analysis of 27 clinical trials (1,890 men) found testosterone treatment cut low
                mood symptoms and more than doubled the odds of a major lift compared to placebo.
              </ExplainText>
            </p>

            <div className={`mt-7 ${styles.twoGrid}`}>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={`${styles.chip} ${styles.chipBlue}`} aria-hidden="true">
                    <Icon name="drop" />
                  </span>
                  <p className={`${styles.label} ${styles.labelBlue}`}>
                    Step by step · NHS Scotland GP
                  </p>
                </div>
                <h3 className={styles.cardTitle} style={{ marginTop: 14 }}>
                  How to ask for a proper blood test
                </h3>
                <ol className={styles.stepList}>
                  <li>
                    <span className={`${styles.num} ${styles.numBlue}`} aria-hidden="true">
                      1
                    </span>
                    <span>
                      <strong>Book 8am to 11am, fasting:</strong> Drink water only before the
                      test. Testosterone peaks early in the morning. Eating first can drop your
                      reading by up to 30%.
                    </span>
                  </li>
                  <li>
                    <span className={`${styles.num} ${styles.numBlue}`} aria-hidden="true">
                      2
                    </span>
                    <span>
                      <strong>Ask for the full mood blood check:</strong>{" "}
                      <ExplainText>
                        Ask for Total Testosterone and SHBG (to check free testosterone), plus
                        thyroid, vitamin D, vitamin B12, and iron. Low vitamin D is very common in
                        Scotland.
                      </ExplainText>
                    </span>
                  </li>
                  <li>
                    <span className={`${styles.num} ${styles.numBlue}`} aria-hidden="true">
                      3
                    </span>
                    <span>
                      <strong>Get your exact numbers printed:</strong> Do not settle for
                      &ldquo;your bloods look fine&rdquo;. Ask for the actual reading in nmol/L.
                    </span>
                  </li>
                  <li>
                    <span className={`${styles.num} ${styles.numBlue}`} aria-hidden="true">
                      4
                    </span>
                    <span>
                      <strong>Confirm with a second morning test:</strong> NHS Scotland requires
                      two separate low fasting morning tests (plus LH, FSH, and prolactin) before
                      starting treatment or referring you to a specialist.
                    </span>
                  </li>
                </ol>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.chip} aria-hidden="true">
                    <Icon name="scale" />
                  </span>
                  <p className={styles.label}>UK BSSM medical thresholds</p>
                </div>
                <h3 className={styles.cardTitle} style={{ marginTop: 14 }}>
                  What your testosterone numbers actually mean
                </h3>
                <div className="mt-4 flex-1">
                  <div className={`${styles.band} ${styles.bandLow}`}>
                    <p className={styles.bandTitle}>Below 8 nmol/L</p>
                    <p className={styles.bandText}>
                      Clearly low under UK guidelines. With symptoms, usually warrants an NHS
                      specialist referral to discuss treatment.
                    </p>
                  </div>
                  <div className={`${styles.band} ${styles.bandMid}`}>
                    <p className={styles.bandTitle}>8 to 12 nmol/L (Borderline zone)</p>
                    <p className={styles.bandText}>
                      <ExplainText>
                        Do not get brushed off here. UK guidelines say to repeat the morning test
                        and check SHBG to measure free testosterone.
                      </ExplainText>
                    </p>
                  </div>
                  <div className={`${styles.band} ${styles.bandOk}`}>
                    <p className={styles.bandTitle}>Above 12 nmol/L</p>
                    <p className={styles.bandText}>
                      Usually normal. Check thyroid, vitamin D, iron, sleep, and stress instead.
                    </p>
                  </div>
                </div>
                <p className={styles.cardFoot}>
                  <strong className="text-[var(--ink)]">Private tests &amp; safety:</strong> Start
                  free with your NHS GP. If you pay privately, use a UKAS-accredited morning venous
                  blood draw, not an afternoon finger-prick kit. Never buy unprescribed hormones
                  online.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: 1-Click Situation Matcher */}
          <section className="pb-14">
            <SituationMatcher />
          </section>

          {/* Section 2: What Actually Happens When You Ask for Help in Scotland */}
          <section className="pb-14">
            <SectionHead
              eyebrow="Breaking the silence"
              title="What actually happens when you ask for help in Scotland"
            />
            <p className={styles.intro}>
              Many people stay quiet because they fear being locked up or having their employer
              told. Here is what each Scottish route actually does.
            </p>
            <div className={`mt-6 ${styles.panel}`}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Scottish service</th>
                    <th>On your medical record?</th>
                    <th>Employer told?</th>
                    <th>What actually happens</th>
                  </tr>
                </thead>
                <tbody>
                  {WHAT_HAPPENS_ROWS.map((row) => (
                    <tr key={row.service}>
                      <th scope="row">
                        <span className={styles.serviceCell}>
                          <Icon name={row.icon} size={18} />
                          <span>{row.service}</span>
                        </span>
                      </th>
                      <td data-label="On your medical record?">{row.record}</td>
                      <td data-label="Employer told?" className={styles.employer}>
                        {row.work}
                      </td>
                      <td data-label="What actually happens">{row.what}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={`mt-6 ${styles.note}`}>
                <Icon name="shield" />
                <p className="m-0">
                  <strong>Will I be sectioned?</strong> Almost never. Under Scots law, keeping
                  someone in hospital against their will is a last resort for immediate severe risk.
                  Telling your GP or NHS 111 that you have dark thoughts does <strong>not</strong>{" "}
                  get you locked up.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Full Official NRS Scottish Data Picture (Samaritans-safe) */}
          <section className="pb-14">
            <SectionHead
              eyebrow="National Records of Scotland (2019 to 2025)"
              title="What the official Scottish figures show"
            />

            {/* 7-year trend + long-term hope */}
            <div className={`mt-7 ${styles.panel}`}>
              <div className={styles.trendGrid}>
                <div>
                  <div className={styles.trendHead}>
                    <span className={`${styles.chip} ${styles.chipBlue}`} aria-hidden="true">
                      <Icon name="chart" />
                    </span>
                    <span className={styles.trendBadge}>
                      <Icon name="trendDown" size={16} />
                      Down 16% since 2019
                    </span>
                  </div>
                  <h3 className={styles.cardTitle} style={{ marginTop: 16, fontSize: 21 }}>
                    Probable suicide deaths in Scotland (2019 to 2025)
                  </h3>
                  <p className={styles.cardText}>
                    Deaths fell from 833 in 2019 to 703 in 2025. Since 2001, the rate in
                    Scotland&apos;s poorest fifth of areas has dropped by over 40%. Support and early
                    help save lives.
                  </p>
                </div>

                <div className={styles.trendRows}>
                  {NRS_TREND.map((row) => (
                    <div key={row.year} className={styles.trendRow}>
                      <span className="font-[700] text-[var(--ink)]">{row.year}</span>
                      <div className={styles.trendTrack}>
                        <div
                          className={
                            row.year === "2025"
                              ? `${styles.trendFill} ${styles.trendFillNow}`
                              : styles.trendFill
                          }
                          style={{ width: `${Math.round((row.deaths / 850) * 100)}%` }}
                        />
                      </div>
                      <span className="text-right font-[720] text-[var(--ink)]">{row.deaths}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3 symmetrical data insight cards: Sex, Age, Deprivation */}
            <div className={styles.statGrid}>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={`${styles.chip} ${styles.chipBlue}`} aria-hidden="true">
                    <Icon name="users" />
                  </span>
                  <p className={`${styles.label} ${styles.labelBlue}`}>Men vs women (2025)</p>
                </div>
                <p className={styles.bigStat}>3.1x higher</p>
                <p className={`${styles.cardText} flex-1`}>
                  522 men (21.9 per 100,000) and 181 women (7.1 per 100,000) died in 2025. Men make
                  up 74% of all deaths.
                </p>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={`${styles.chip} ${styles.chipBlue}`} aria-hidden="true">
                    <Icon name="clock" />
                  </span>
                  <p className={`${styles.label} ${styles.labelBlue}`}>Age reality (2025)</p>
                </div>
                <p className={styles.bigStat}>Age 48.2</p>
                <p className={`${styles.cardText} flex-1`}>
                  Average age rose to 48.2 years in 2025. Rates are highest in adults aged 25 to 64,
                  over double under-25s or over-75s.
                </p>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={`${styles.chip} ${styles.chipBlue}`} aria-hidden="true">
                    <Icon name="home" />
                  </span>
                  <p className={`${styles.label} ${styles.labelBlue}`}>Deprivation gap (2025)</p>
                </div>
                <p className={styles.bigStat}>2.7x higher</p>
                <p className={`${styles.cardText} flex-1`}>
                  <ExplainText>
                    Rates in Scotland&apos;s poorest fifth of areas are 2.7 times higher than in the
                    richest fifth. Money and debt stress hit hard.
                  </ExplainText>
                </p>
              </div>
            </div>

            {/* NRS Council-level picture: symmetrical 2-card split */}
            <div className={`mt-4 ${styles.twoGrid}`}>
              <div className={`${styles.card} ${styles.areaCard}`}>
                <div className={styles.cardHead}>
                  <span className={`${styles.chip} ${styles.chipBlue}`} aria-hidden="true">
                    <Icon name="pin" />
                  </span>
                  <p className={`${styles.label} ${styles.labelBlue}`}>
                    Higher than Scottish average (NRS 5-year data)
                  </p>
                </div>
                <h3 className={styles.cardTitle} style={{ marginTop: 14 }}>
                  Areas where extra local support matters most
                </h3>
                <p className={`${styles.cardText} flex-1`}>
                  NRS multi-year data flags <strong>Na h-Eileanan Siar</strong>,{" "}
                  <strong>North Ayrshire</strong>, <strong>Dundee City</strong>, and{" "}
                  <strong>Highland</strong> as clearly above the Scottish average rate.
                </p>
                <p className="mt-4">
                  <Link href="/struggling-right-now-scotland" className={styles.pillLink}>
                    Check your council&apos;s urgent money and grant help →
                  </Link>
                </p>
              </div>

              <div className={`${styles.card} ${styles.areaCard} ${styles.areaCardCalm}`}>
                <div className={styles.cardHead}>
                  <span className={styles.chip} aria-hidden="true">
                    <Icon name="pin" />
                  </span>
                  <p className={styles.label}>Lower than Scottish average (NRS 5-year data)</p>
                </div>
                <h3 className={styles.cardTitle} style={{ marginTop: 14 }}>
                  Why NRS uses 5-year council averages
                </h3>
                <p className={`${styles.cardText} flex-1`}>
                  <strong>East Renfrewshire</strong>, <strong>East Dunbartonshire</strong>,{" "}
                  <strong>Midlothian</strong>, <strong>South Lanarkshire</strong>, and{" "}
                  <strong>Edinburgh</strong> sit below the Scottish average. Five-year totals avoid
                  false spikes in small areas.
                </p>
                <p className={styles.source} style={{ fontSize: 14 }}>
                  <Icon name="book" size={16} />
                  <span>
                    Source:{" "}
                    <a
                      href="https://www.nrscotland.gov.uk/statistics-and-data/statistics/statistics-by-theme/vital-events/deaths/suicides"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      National Records of Scotland, Probable Suicides
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Worried about someone + Private 1-Minute Safety Plan */}
          <section className="pb-14">
            <WorriedAndSafetyTools />
          </section>

          {/* Section 5: Lost someone to suicide in Scotland (Procurator Fiscal + grief support) */}
          <section className="pb-12">
            <SectionHead
              eyebrow="Support after a loss in Scotland"
              title="If you lost someone to suicide"
            />
            <div className={`mt-7 ${styles.twoGrid}`}>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={`${styles.chip} ${styles.chipBlue}`} aria-hidden="true">
                    <Icon name="scale" />
                  </span>
                  <p className={`${styles.label} ${styles.labelBlue}`}>
                    Scots law (not English coroners)
                  </p>
                </div>
                <h3 className={styles.cardTitle} style={{ marginTop: 14 }}>
                  How the Procurator Fiscal handles sudden deaths
                </h3>
                <p className={`${styles.cardText} flex-1`}>
                  Most UK guides talk about English coroners. Scotland does not have coroners.
                  Sudden deaths are checked by the <strong>Procurator Fiscal</strong>. Police ask
                  routine questions for the Fiscal&apos;s report. You are not in trouble, and you do
                  not have to handle paperwork alone.
                </p>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.chip} aria-hidden="true">
                    <Icon name="heart" />
                  </span>
                  <p className={styles.label}>Free grief and funeral support</p>
                </div>
                <h3 className={styles.cardTitle} style={{ marginTop: 14 }}>
                  Cruse Scotland, SOBS, and Funeral Support Payment
                </h3>
                <p className={`${styles.cardText} flex-1`}>
                  <strong>Cruse Scotland</strong> (0808 802 6161) and <strong>SOBS</strong> (0300
                  111 5065) offer free grief support from day one. If money is tight, Scotland&apos;s{" "}
                  <strong>Funeral Support Payment</strong> helps cover funeral bills.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href="https://www.crusescotland.org.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pillLink}
                  >
                    Cruse Scotland →
                  </a>
                  <a
                    href="https://uksobs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pillLink}
                  >
                    SOBS peer groups →
                  </a>
                  <a
                    href="https://www.mygov.scot/funeral-support-payment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pillLink}
                  >
                    Funeral Support Payment →
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="pb-10">
            <div className={`${styles.note} ${styles.noteQuiet}`}>
              <Icon name="shield" />
              <p className="m-0">
                <strong className="text-[var(--ink)]">Safe guide note:</strong> We follow
                Samaritans media guidelines. No methods are mentioned, and free 24/7 support comes
                first. We share official public data and tools, not medical advice.
              </p>
            </div>
          </section>

          <CTA
            title="Money, bills, or debt piling on the stress?"
            body="Get your council's direct Crisis Grant form, a tailored today plan, and free Scottish debt freeze advice."
            href="/struggling-right-now-scotland"
            cta="Open urgent money help hub"
            secondaryHref="/where-to-apply-scotland"
            secondaryCta="Browse 24 direct Scottish links"
          />
        </ContentFrame>
        </div>
      </Page>
    </>
  );
}
