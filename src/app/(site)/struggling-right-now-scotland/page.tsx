import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Page, ContentFrame, CTA } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { crisisGrantScotland } from "@/lib/data/crisisGrants";
import { meta } from "@/lib/seo";
import UrgentCouncilFinder from "./UrgentCouncilFinder";
import { Icon, type IconName } from "./icons";
import s from "./urgent.module.css";

export const metadata = meta({
  title: "Struggling Right Now in Scotland? Urgent Cash, Council Numbers & Plan",
  description:
    "Direct Crisis Grant phone numbers for all 32 Scottish councils, real 2025/26 approval odds, an interactive today action plan, Scots law bill priorities, and free helplines.",
  path: "/struggling-right-now-scotland",
});

const tel = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, "")}`;

const PRIORITY_BILLS: { label: string; text: string }[] = [
  { label: "Rent or mortgage:", text: "Keeps your roof safe. Ask for rent help early." },
  { label: "Gas and electric:", text: "Ask your supplier for emergency credit first." },
  { label: "Council Tax:", text: "Councils can take money straight from wages or benefits." },
  { label: "Court fines and child support:", text: "Tell them early if you cannot pay." },
];

const WAITING_DEBTS: { label: string; text: string; icon: IconName }[] = [
  { label: "Credit cards and store cards:", text: "Cannot take your home right away.", icon: "card" },
  {
    label: "Personal loans and overdrafts:",
    text: "Can be paused under a free debt plan.",
    icon: "wallet",
  },
  {
    label: "Buy-now-pay-later and catalogues:",
    text: "Always sit behind rent and power.",
    icon: "bag",
  },
  {
    label: "Scotland 6-month freeze:",
    text: "Ask StepChange or Citizens Advice for a free Debt Moratorium.",
    icon: "pause",
  },
];

function AdviceCard({
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

export default function StrugglingRightNowPage() {
  const facts = [
    { value: `${crisisGrantScotland.acceptanceRate}%`, label: "Scottish yes rate." },
    { value: `£${crisisGrantScotland.averageAward}`, label: "average grant paid." },
    {
      value: `${crisisGrantScotland.processedByNextWorkingDay}%`,
      label: "answered by next working day.",
    },
  ];

  return (
    <div className={s.page}>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Benefits", path: "/benefits" },
          { name: "Struggling right now", path: "/struggling-right-now-scotland" },
        ]}
      />
      <Page>
        <ContentFrame>
          <header className={s.hero}>
            <div className={s.heroCopy}>
              <p className={s.pill}>
                <Icon name="buoy" size={15} />
                <ExplainText>Urgent money help · Scotland</ExplainText>
              </p>
              <h1 className={`h1 ${s.heroTitle}`}>Short of cash or stuck on bills today?</h1>
              <div className={`lede ${s.heroLede}`}>
                <ExplainText>
                  Pick your council for its direct Crisis Grant number and real 2025/26 odds. Then
                  tick what is hitting you today to build a free step-by-step plan.
                </ExplainText>
              </div>
            </div>
            <div className={s.facts}>
              <p className={s.factsLabel}>Crisis Grants (2025/26)</p>
              <ul className={s.factList}>
                {facts.map((f) => (
                  <li key={f.label} className={s.fact}>
                    <span className={`figure-num ${s.factValue}`}>{f.value}</span>
                    <span className={s.factText}>
                      <ExplainText>{f.label}</ExplainText>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </header>

          {/* Interactive 32-council contact + odds + tailored today action plan */}
          <section className={s.section}>
            <UrgentCouncilFinder />
          </section>

          {/* Scots law priority bills: pay first vs can wait */}
          <section className={s.section}>
            <p className={s.kicker}>
              <Icon name="scale" size={16} />
              Scots law priority bills
            </p>
            <h2 className={`display-stat ${s.sectionTitle}`}>
              What to pay first when money runs short
            </h2>
            <div className={s.bills}>
              <div className={`${s.bill} ${s.billPriority}`}>
                <div className={s.billHead}>
                  <span className={`${s.chip} ${s.chipSolid}`}>
                    <Icon name="shield" size={20} />
                  </span>
                  <div>
                    <p className={s.billTag}>Pay these first · Priority bills</p>
                    <p className={s.billSub}>
                      Missing these puts your home, heating, or wages at risk fastest in Scotland.
                    </p>
                  </div>
                </div>
                <ul className={s.billList}>
                  {PRIORITY_BILLS.map((b, i) => (
                    <li key={b.label} className={s.billItem}>
                      <span className={s.billNum} aria-hidden="true">
                        {i + 1}
                      </span>
                      <span>
                        <strong>{b.label}</strong> {b.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`${s.bill} ${s.billWait}`}>
                <div className={s.billHead}>
                  <span className={s.chip}>
                    <Icon name="clock" size={20} />
                  </span>
                  <div>
                    <p className={s.billTag}>These can wait · Non-priority debts</p>
                    <p className={s.billSub}>
                      Do not skip food or rent to pay these. Call StepChange first for a free plan.
                    </p>
                  </div>
                </div>
                <ul className={s.billList}>
                  {WAITING_DEBTS.map((b) => (
                    <li key={b.label} className={s.billItem}>
                      <span className={s.billIcon}>
                        <Icon name={b.icon} size={16} />
                      </span>
                      <span>
                        <strong>{b.label}</strong> {b.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 4 free Scottish advice services (online first + phone reference) */}
          <section className={s.section}>
            <p className={s.kicker}>
              <Icon name="chat" size={16} />
              Free Scottish advice
            </p>
            <h2 className={`display-stat ${s.sectionTitle}`}>
              Get free written advice or online help today
            </h2>
            <div className={s.advice}>
              <AdviceCard
                icon="chat"
                name="Citizens Advice Scotland"
                body={
                  <ExplainText>
                    Free benefit checks, food vouchers, and local help across all 32 Scottish
                    councils.
                  </ExplainText>
                }
                phone="0800 028 1456"
                href="https://www.cas.org.uk/bureaux"
                cta="Find local office"
              />
              <AdviceCard
                icon="buoy"
                name="StepChange Scotland"
                body="Free debt plans under Scots law and 6-month Moratorium help. Never pay a debt firm."
                phone="0800 138 1111"
                href="https://www.stepchange.org/start.aspx"
                cta="Online debt advice"
              />
              <AdviceCard
                icon="home"
                name="Shelter Scotland"
                body="Free help with rent arrears, landlord warnings, and eviction threats across Scotland."
                phone="0808 800 4444"
                href="https://scotland.shelter.org.uk/get_help"
                cta="Housing help online"
              />
              <AdviceCard
                icon="bolt"
                name="Home Energy Scotland"
                body="Free Scottish Government advice on power bills, fuel debt, and heating grants."
                phone="0808 808 2282"
                href="https://www.homeenergyscotland.org/contact-us"
                cta="Contact them online"
              />
            </div>
          </section>

          <section className="pb-4">
            <div className={s.note}>
              <span className={s.chip}>
                <Icon name="info" size={20} />
              </span>
              <p className={`m-0 ${s.noteText}`}>
                <strong>Plain note:</strong> We share free public data and official contacts. We do
                not give personal debt plans. Always call StepChange or Citizens Advice for free
                debt help. Feeling overwhelmed tonight?{" "}
                <Link href="/suicide-scotland-statistics-and-support">
                  See free 24/7 crisis phone lines
                </Link>
                .
              </p>
            </div>
          </section>

          <CTA
            title="Need a direct official link to apply instead?"
            body="Browse 24 direct Scottish links sorted by topic, or challenge a refused grant or benefit for free."
            href="/where-to-apply-scotland"
            cta="Open Where to Apply directory"
            secondaryHref="/benefit-or-crisis-grant-rejected-scotland"
            secondaryCta="Turned down? Challenge it free"
          />
        </ContentFrame>
      </Page>
    </div>
  );
}
