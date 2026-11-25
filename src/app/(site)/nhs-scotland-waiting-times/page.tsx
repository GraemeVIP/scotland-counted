import type { CSSProperties } from "react";
import Link from "@/components/IntentLink";
import { Page, ContentFrame, SectionHead, CTA } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  CANCER_62_BY_TYPE,
  NHS_PERIODS,
  NHS_SCOTLAND_SUMMARY as S,
  NHS_SOURCES,
  WORST_AE_HOSPITALS,
} from "@/lib/data/nhsScotland";
import { meta } from "@/lib/seo";
import NhsBoardExplorer from "./NhsBoardExplorer";
import { Icon } from "./icons";
import s from "./nhs.module.css";

export const metadata = meta({
  title: "NHS Scotland Waiting Times, Hospital Data & Buried Figures (2026)",
  description:
    "Official Public Health Scotland CSV data for all 14 Health Boards: 91,717 over 12 hours in A&E, 96,339 past the 12-week legal guarantee, 585,953 removed without treatment, cancer waits and delayed discharges.",
  path: "/nhs-scotland-waiting-times",
});

const colorVar = (color: string) => ({ "--c": color }) as CSSProperties;
const fmt = (n: number) => n.toLocaleString("en-GB");

export default function NhsScotlandWaitingTimesPage() {
  const heroFacts = [
    {
      value: fmt(S.ae.over12h12m),
      label: "people waited over 12 hours in A&E in 12 months.",
      alert: true,
    },
    {
      value: fmt(S.waitingLists.inpatientOver12w),
      label: "past the 12-week legal Treatment Time Guarantee.",
      alert: false,
    },
    {
      value: fmt(S.delayedDischarges.bedDaysLost12m),
      label: "hospital bed days lost to delayed discharge.",
      alert: false,
    },
  ];

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Your area", path: "/areas" },
          { name: "NHS Scotland waiting times", path: "/nhs-scotland-waiting-times" },
        ]}
      />
      <Page>
        <header className={s.hero}>
          <div className="min-w-0">
            <p className={s.eyebrow}>
              <Icon name="hospital" />
              NHS Scotland
              <span className={s.eyebrowExtra}> · Official PHS data</span>
            </p>
            <h1 className={`h1 ${s.heroTitle}`}>
              NHS Scotland waiting times and the numbers they bury
            </h1>
            <div className={`lede ${s.heroLede}`}>
              <ExplainText>
                Health Boards publish raw CSV files each month. Few people ever open them. Here is
                what Public Health Scotland data shows on A&amp;E waits, broken legal promises,
                blocked beds and patients dropped from lists.
              </ExplainText>
            </div>
          </div>

          <div className="min-w-0">
            <p className={s.panelLabel}>Official 12-month record</p>
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
          {/* Prominent cross-link to Patient Rights */}
          <section className="pt-10 pb-12 sm:pt-12">
            <div className={s.banner}>
              <span className={s.bannerIcon}>
                <Icon name="shield" />
              </span>
              <div className="min-w-0">
                <p className={s.bannerKicker}>Your legal rights</p>
                <h2 className={s.bannerTitle}>Stuck on an NHS list or treated badly?</h2>
                <p className={s.bannerBody}>
                  Scots law gives you clear rights. See the 12-week rule, how to get your medical
                  notes free, and how to use PASS and the Ombudsman.
                </p>
              </div>
              <Link href="/nhs-patient-rights-scotland" className={s.bannerBtn}>
                See your NHS rights
                <Icon name="arrow" className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </section>

          {/* Interactive 14 Health Boards Explorer */}
          <section className="pb-14">
            <NhsBoardExplorer />
          </section>

          {/* Section 1: The numbers they do not shout about */}
          <section className="pb-14">
            <SectionHead
              eyebrow="Buried in the raw CSVs"
              title="Four NHS figures that rarely make the headlines"
            />
            <div className={s.grid2}>
              <div className={`${s.card} ${s.cardAlert}`} style={colorVar("var(--bad-text)")}>
                <span className={s.iconChip}>
                  <Icon name="alert" />
                </span>
                <p className={s.cardKicker}>Removed without care</p>
                <p className={`${s.bigFig} ${s.bigFigBad}`}>
                  {fmt(S.removalsWithoutTreatment.totalRemovedWithoutTreatment)}
                </p>
                <h3 className={s.cardHeading}>Waits cleared without treatment</h3>
                <p className={s.cardText}>
                  <ExplainText>
                    In 12 months, over half a million outpatient and inpatient waits ended with no
                    hospital care. {fmt(S.removalsWithoutTreatment.outpatientSentBackToGp)} clinic
                    waits were sent back to a GP.{" "}
                    {fmt(
                      S.removalsWithoutTreatment.outpatientOtherReasons +
                        S.removalsWithoutTreatment.inpatientOtherReasons,
                    )}{" "}
                    were listed as other reasons, which can include death or moving away.
                  </ExplainText>
                </p>
              </div>

              <div className={s.card} style={colorVar("var(--hub-area)")}>
                <span className={s.iconChip}>
                  <Icon name="scissors" />
                </span>
                <p className={s.cardKicker}>Cancelled by the hospital</p>
                <p className={s.bigFig}>{fmt(S.cancelledOps.cancelledByHospitalCapacity12m)}</p>
                <h3 className={s.cardHeading}>
                  {S.cancelledOps.dailyHospitalCapacityCancellations} ops scrapped each day
                </h3>
                <p className={s.cardText}>
                  <ExplainText>
                    Hospitals cancelled {fmt(S.cancelledOps.totalCancelled12m)} planned operations
                    in 12 months. {fmt(S.cancelledOps.cancelledByHospitalCapacity12m)} were axed due
                    to no bed, no staff or theatre delays, not because the patient was unwell.
                  </ExplainText>
                </p>
              </div>

              <div className={s.card} style={colorVar("var(--hub-tax)")}>
                <span className={s.iconChip}>
                  <Icon name="bed" />
                </span>
                <p className={s.cardKicker}>Delayed discharge</p>
                <p className={s.bigFig}>{fmt(S.delayedDischarges.averageDailyBedsBlocked)}</p>
                <h3 className={s.cardHeading}>Beds blocked every single day</h3>
                <p className={s.cardText}>
                  <ExplainText>
                    Nearly 2,000 hospital beds hold people who are fit to leave. They wait for home
                    care or a care home place. That cost {fmt(S.delayedDischarges.bedDaysLost12m)}{" "}
                    bed days in 12 months and clogs up A&amp;E corridors.
                  </ExplainText>
                </p>
              </div>

              <div className={s.card} style={colorVar("var(--hub-reps)")}>
                <span className={s.iconChip}>
                  <Icon name="scale" />
                </span>
                <p className={s.cardKicker}>Complaints and harm payouts</p>
                <p className={s.bigFig}>£{S.accountability.cnorisAnnualPayoutsM}m</p>
                <h3 className={s.cardHeading}>
                  {fmt(S.accountability.nhsComplaintsAnnual)} NHS complaints a year
                </h3>
                <p className={s.cardText}>
                  <ExplainText>
                    NHS Scotland pays around £{S.accountability.cnorisAnnualPayoutsM} million a year
                    through CNORIS when poor care harms patients. Total future claim costs sit near
                    £{S.accountability.cnorisLiabilityProvisionBn} billion.
                  </ExplainText>
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Waiting list reality & broken legal guarantee */}
          <section className="pb-14">
            <SectionHead
              eyebrow={`Snapshot as at ${NHS_PERIODS.sotLatest}`}
              title="669,008 waits on hospital lists across Scotland"
            />
            <div className={s.grid3}>
              <div className={s.card} style={colorVar("var(--bad-text)")}>
                <span className={s.iconChip}>
                  <Icon name="clock" />
                </span>
                <p className={s.cardKicker}>12-week legal rule broken</p>
                <p className={`${s.bigFig} ${s.bigFigBad}`}>
                  {S.waitingLists.inpatientOver12wPct}%
                </p>
                <p className={s.cardText}>
                  <ExplainText>
                    Scots law sets a 12-week Treatment Time Guarantee for planned inpatient surgery.{" "}
                    {fmt(S.waitingLists.inpatientOver12w)} of{" "}
                    {fmt(S.waitingLists.inpatientOngoing)} patients have already waited longer.
                  </ExplainText>
                </p>
              </div>

              <div className={s.card} style={colorVar("var(--hub-area)")}>
                <span className={s.iconChip}>
                  <Icon name="hospital" />
                </span>
                <p className={s.cardKicker}>Waiting over a year</p>
                <p className={s.bigFig}>{fmt(S.waitingLists.totalOver52w)}</p>
                <p className={s.cardText}>
                  <ExplainText>
                    {fmt(S.waitingLists.inpatientOver52w)} people have waited over 52 weeks for
                    surgery, and {fmt(S.waitingLists.outpatientOver52w)} for a first outpatient
                    clinic visit.
                  </ExplainText>
                </p>
              </div>

              <div className={s.card} style={colorVar("var(--hub-investigations)")}>
                <span className={s.iconChip}>
                  <Icon name="alert" />
                </span>
                <p className={s.cardKicker}>Waiting over 2 and 3 years</p>
                <p className={s.bigFig}>{fmt(S.waitingLists.totalOver104w)}</p>
                <p className={s.cardText}>
                  <ExplainText>
                    {fmt(S.waitingLists.totalOver104w)} people have waited more than two years.{" "}
                    {fmt(S.waitingLists.totalOver156w)} have waited over three full years for care.
                  </ExplainText>
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Worst Type 1 A&E Hospitals */}
          <section className="pb-14">
            <SectionHead
              eyebrow={`Main A&E units · ${NHS_PERIODS.ae12m}`}
              title="The 10 hardest-hit emergency departments in Scotland"
            />
            <p className={s.cardText} style={{ maxWidth: "66ch", marginTop: 8 }}>
              <ExplainText>
                The national target is 95% seen within 4 hours. Across Scotland, main A&amp;E units
                hit {S.ae.type1Within4hPct}%, with {S.ae.dailyOver12h} people waiting over 12 hours
                every single day.
              </ExplainText>
            </p>
            <div className={s.rankList}>
              {WORST_AE_HOSPITALS.map((h) => (
                <div key={h.code} className={s.rankRow}>
                  <div>
                    <p className={s.rankName}>{h.name}</p>
                    <p className={s.rankMeta}>
                      NHS {h.board} · {fmt(h.attendances)} visits
                    </p>
                  </div>
                  <div className={s.rankBarWrap}>
                    <div className={s.barTrack} aria-hidden="true">
                      <div
                        className={`${s.barFill} ${s.barFillBad}`}
                        style={{ width: `${Math.min(100, h.within4hPct)}%` }}
                      />
                    </div>
                    <p className={s.rankMeta}>
                      {fmt(h.over12h)} waited over 12 hours · {fmt(h.over8h)} over 8 hours
                    </p>
                  </div>
                  <div className={s.rankStat}>
                    <p className={s.rankPct}>{h.within4hPct}%</p>
                    <p className={s.rankSub}>within 4 hours</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Cancer waits & Diagnostic scans */}
          <section className="pb-14">
            <SectionHead
              eyebrow={`Cancer & Scans · ${NHS_PERIODS.cancer4q}`}
              title="Cancer 62-day waits and scan backlogs"
            />
            <p className={s.cardText} style={{ maxWidth: "66ch", marginTop: 8 }}>
              <ExplainText>
                Once cancer is confirmed, 95.0% start care within 31 days. The bottleneck is the
                62-day urgent target: only {S.cancer.standard62Pct}% started in time, so{" "}
                {fmt(S.cancer.standard62Missed)} urgent patients missed the target.
              </ExplainText>
            </p>

            <div className={s.rankList}>
              {CANCER_62_BY_TYPE.map((c) => (
                <div key={c.type} className={s.rankRow}>
                  <div>
                    <p className={s.rankName}>{c.type}</p>
                    <p className={s.rankMeta}>{fmt(c.eligible)} urgent referrals in 12 months</p>
                  </div>
                  <div className={s.rankBarWrap}>
                    <div className={s.barTrack} aria-hidden="true">
                      <div
                        className={`${s.barFill} ${c.pct < 70 ? s.barFillBad : s.barFillWarn}`}
                        style={{ width: `${Math.min(100, c.pct)}%` }}
                      />
                    </div>
                  </div>
                  <div className={s.rankStat}>
                    <p className={s.rankPct}>{c.pct}%</p>
                    <p className={s.rankSub}>within 62 days</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={s.grid2}>
              <div className={s.card} style={colorVar("var(--hub-tax)")}>
                <span className={s.iconChip}>
                  <Icon name="scan" />
                </span>
                <p className={s.cardKicker}>Imaging scans (MRI, CT, Ultrasound)</p>
                <p className={s.bigFig}>{fmt(S.diagnostics.imagingOver6w)}</p>
                <p className={s.cardText}>
                  <ExplainText>
                    Waiting over the 6-week limit out of {fmt(S.diagnostics.imagingTotal)} people on
                    scan lists (as at {NHS_PERIODS.diagnosticsLatest}).
                  </ExplainText>
                </p>
              </div>

              <div className={s.card} style={colorVar("var(--bad-text)")}>
                <span className={s.iconChip}>
                  <Icon name="alert" />
                </span>
                <p className={s.cardKicker}>Endoscopy camera tests</p>
                <p className={`${s.bigFig} ${s.bigFigBad}`}>
                  {S.diagnostics.endoscopyOver6wPct}%
                </p>
                <p className={s.cardText}>
                  <ExplainText>
                    Almost half of endoscopy waits ({fmt(S.diagnostics.endoscopyOver6w)} of{" "}
                    {fmt(S.diagnostics.endoscopyTotal)}) pass the 6-week limit.
                  </ExplainText>
                </p>
              </div>
            </div>
          </section>

          {/* Official Sources */}
          <section className="pb-14">
            <div className={s.sourceBox}>
              <h2 className={s.cardHeading}>Check the raw CSV files yourself</h2>
              <p className={s.cardText} style={{ marginTop: 6 }}>
                <ExplainText>
                  Every number on this page comes straight from official Public Health Scotland open
                  data CSVs and statutory reports.
                </ExplainText>
              </p>
              <ul className={s.sourceList}>
                {NHS_SOURCES.map((src) => (
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
            title="Put these figures in front of your MSP"
            body="NHS Scotland is run by Holyrood. Your MSPs set the budget and oversee every Health Board. Send them a short email in two minutes."
            href="/email-your-mp-and-msp"
            cta="Email your MSP"
            secondaryHref="/nhs-patient-rights-scotland"
            secondaryCta="See your NHS rights"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
