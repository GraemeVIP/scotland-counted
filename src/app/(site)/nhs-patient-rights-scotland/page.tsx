import type { CSSProperties } from "react";
import Link from "@/components/IntentLink";
import { Page, ContentFrame, SectionHead, CTA } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { NHS_SCOTLAND_SUMMARY as S, NHS_SOURCES } from "@/lib/data/nhsScotland";
import { meta } from "@/lib/seo";
import { Icon, type IconName } from "../nhs-scotland-waiting-times/icons";
import s from "../nhs-scotland-waiting-times/nhs.module.css";
import NhsRightsFinder from "./NhsRightsFinder";

export const metadata = meta({
  title: "NHS Patient Rights in Scotland: Your Rights, Complaints & Free Help",
  description:
    "Plain-English guide to your rights under the Patient Rights (Scotland) Act 2011: the 12-week Treatment Time Guarantee, how to complain to your Health Board, free PASS support, medical records and the SPSO.",
  path: "/nhs-patient-rights-scotland",
});

const colorVar = (color: string) => ({ "--c": color }) as CSSProperties;
const fmt = (n: number) => n.toLocaleString("en-GB");
const tel = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, "")}`;

const SIX_RIGHTS: {
  title: string;
  kicker: string;
  body: string;
  icon: IconName;
  color: string;
}[] = [
  {
    kicker: "Planned surgery",
    title: "12-week Treatment Time Guarantee",
    body: "Scots law sets a 12-week limit for planned inpatient care. Your Health Board should start treatment in time. If not, ask about another hospital.",
    icon: "clock",
    color: "var(--bad-text)",
  },
  {
    kicker: "Raising concerns",
    title: "Right to complain safely",
    body: "You can complain about any GP, dentist, clinic or hospital. It cannot hurt your care. Stage 1 takes 5 working days. Stage 2 takes 20.",
    icon: "chat",
    color: "var(--hub-tax)",
  },
  {
    kicker: "Independent referee",
    title: "Take it to the Ombudsman (SPSO)",
    body: "Not happy with your Health Board's reply? Go to the SPSO. It is free and outside the NHS. It can order apologies and safety fixes.",
    icon: "scale",
    color: "var(--hub-reps)",
  },
  {
    kicker: "Your own notes",
    title: "See your medical records for free",
    body: "You can ask for your full GP and hospital notes free. This is called a Subject Access Request. The NHS must send them within one month.",
    icon: "file",
    color: "var(--hub-benefits)",
  },
  {
    kicker: "Choices in care",
    title: "Ask for a second opinion",
    body: "You have a right to help choose your care. Staff must explain risks in plain words. You can also ask for a second opinion.",
    icon: "heart",
    color: "var(--hub-area)",
  },
  {
    kicker: "Free backup",
    title: "Independent help from PASS",
    body: "Scots law funds PASS so you are not alone. It is free and private. Staff can help you write letters or go to meetings.",
    icon: "shield",
    color: "var(--hub-schools)",
  },
];

const FREE_SERVICES = [
  {
    name: "PASS (Patient Advice and Support Service)",
    kicker: "Free NHS rights help",
    body: "Free, independent Scottish help with your NHS rights. Staff can help you write a complaint or go to meetings.",
    cta: "Visit PASS online",
    href: "https://pass-scotland.org.uk/",
    phone: "0800 917 2127",
    icon: "shield" as IconName,
    color: "var(--hub-benefits)",
  },
  {
    name: "Scottish Public Services Ombudsman (SPSO)",
    kicker: "Final independent referee",
    body: "Use the SPSO after Stage 2 if you are still not happy. It is free. Apply within 12 months of your complaint.",
    cta: "Complain to SPSO online",
    href: "https://www.spso.org.uk/how-to-complain-about-public-services",
    phone: "0800 377 7330",
    icon: "scale" as IconName,
    color: "var(--hub-reps)",
  },
  {
    name: "NHS Inform: Charter of Patient Rights",
    kicker: "Official Scottish charter",
    body: "Read the full official Charter of Patient Rights. It sets out the rules under the 2011 Act.",
    cta: "Read the official Charter",
    href: "https://www.nhsinform.scot/care-support-and-rights/health-rights/charter-of-patient-rights-and-responsibilities/",
    phone: "0800 22 44 88",
    icon: "file" as IconName,
    color: "var(--hub-tax)",
  },
  {
    name: "Care Inspectorate Scotland",
    kicker: "Care homes and home care",
    body: "Is someone stuck in hospital due to a delayed discharge? You can also report poor home care or care home standards here.",
    cta: "Report a care issue online",
    href: "https://www.careinspectorate.com/index.php/complaints",
    phone: "0345 600 9527",
    icon: "bed" as IconName,
    color: "var(--hub-area)",
  },
];

export default function NhsPatientRightsScotlandPage() {
  const heroFacts = [
    {
      value: "12 weeks",
      label: `legal surgery limit, broken ${fmt(S.waitingLists.inpatientOver12w)} times.`,
      alert: true,
    },
    {
      value: "5 / 20 days",
      label: "official Health Board reply limits for complaints.",
      alert: false,
    },
    {
      value: "Free",
      label: "independent backup from PASS and the SPSO.",
      alert: false,
    },
  ];

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Your area", path: "/areas" },
          { name: "NHS patient rights in Scotland", path: "/nhs-patient-rights-scotland" },
        ]}
      />
      <Page>
        <header className={`${s.hero} ${s.heroRights}`}>
          <div className="min-w-0">
            <p className={s.eyebrow}>
              <Icon name="shield" />
              Patient rights in Scotland
              <span className={s.eyebrowExtra}> · Scots law</span>
            </p>
            <h1 className={`h1 ${s.heroTitle}`}>
              Your NHS rights in Scotland, in plain English
            </h1>
            <div className={`lede ${s.heroLede}`}>
              <ExplainText>
                Patient rights are buried on old NHS websites. Here is what Scots law promises you,
                how often boards break it, and free help you can use today.
              </ExplainText>
            </div>
          </div>

          <div className="min-w-0">
            <p className={s.panelLabel}>What the law sets</p>
            <ul className={s.stats}>
              {heroFacts.map((f) => (
                <li key={f.value} className={`${s.stat} ${f.alert ? s.statAlert : ""}`}>
                  <span className={s.statValue}>{f.value}</span>
                  <span className={s.statLabel}>
                    <ExplainText>{f.label}</ExplainText>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <ContentFrame>
          {/* Cross-link banner back to NHS Waiting Times */}
          <section className="pt-10 pb-12 sm:pt-12">
            <div className={s.banner}>
              <span className={s.bannerIcon}>
                <Icon name="hospital" />
              </span>
              <div className="min-w-0">
                <p className={s.bannerKicker}>Official PHS data</p>
                <h2 className={s.bannerTitle}>See how your local Health Board performs</h2>
                <p className={s.bannerBody}>
                  Check real A&amp;E 12-hour waits, broken 12-week surgery guarantees, cancer waits
                  and cancelled operations for all 14 Scottish Health Boards.
                </p>
              </div>
              <Link href="/nhs-scotland-waiting-times" className={s.bannerBtn}>
                Open NHS data hub
                <Icon name="arrow" className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </section>

          {/* Interactive Rights & Action Picker */}
          <section className="pb-14">
            <NhsRightsFinder />
          </section>

          {/* 6 Plain-English Rights under Scots Law */}
          <section className="pb-14">
            <SectionHead
              eyebrow="Patient Rights (Scotland) Act 2011"
              title="Six clear rights every patient in Scotland has"
            />
            <div className={s.grid3}>
              {SIX_RIGHTS.map((r) => (
                <div key={r.title} className={s.card} style={colorVar(r.color)}>
                  <span className={s.iconChip}>
                    <Icon name={r.icon} />
                  </span>
                  <p className={s.cardKicker}>{r.kicker}</p>
                  <h3 className={s.cardHeading}>{r.title}</h3>
                  <p className={s.cardText}>
                    <ExplainText>{r.body}</ExplainText>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Free official help directory */}
          <section className="pb-14">
            <SectionHead
              eyebrow="Independent and free"
              title="Where to get real help if the NHS lets you down"
            />
            <p className={s.cardText} style={{ maxWidth: "66ch", marginTop: 8 }}>
              <ExplainText>
                Scotland Counted does not give personal medical or legal advice. These official
                bodies are free to use and have real powers to help you.
              </ExplainText>
            </p>
            <div className={s.grid2}>
              {FREE_SERVICES.map((svc) => (
                <div key={svc.name} className={s.card} style={colorVar(svc.color)}>
                  <span className={s.iconChip}>
                    <Icon name={svc.icon} />
                  </span>
                  <p className={s.cardKicker}>{svc.kicker}</p>
                  <h3 className={s.cardHeading}>{svc.name}</h3>
                  <p className={s.cardText}>
                    <ExplainText>{svc.body}</ExplainText>
                  </p>
                  <div className="mt-auto pt-2">
                    <a
                      href={svc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s.onlineBtn}
                    >
                      {svc.cta}
                      <Icon name="arrow" size={16} />
                    </a>
                    <p className={s.phoneNote}>
                      Or phone <a href={tel(svc.phone)}>{svc.phone}</a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Official Sources */}
          <section className="pb-14">
            <div className={s.sourceBox}>
              <h2 className={s.cardHeading}>Official laws and sources</h2>
              <ul className={s.sourceList}>
                {NHS_SOURCES.slice(5).map((src) => (
                  <li key={src.href}>
                    <a href={src.href} target="_blank" rel="noopener noreferrer">
                      {src.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <CTA
            title="Tell your MSP what happened to you"
            body="MSPs can chase a Health Board chief executive directly on your behalf. Use our free tool to find and email all eight of your MSPs."
            href="/email-your-mp-and-msp"
            cta="Email your MSP"
            secondaryHref="/nhs-scotland-waiting-times"
            secondaryCta="Check NHS wait times"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
