"use client";

import { useState, type CSSProperties } from "react";
import Link from "@/components/IntentLink";
import { Icon, type IconName } from "./icons";
import styles from "./apply.module.css";

type CategoryId =
  | "all"
  | "disability"
  | "crisis"
  | "families"
  | "work-travel"
  | "older-carers"
  | "free-help";

type ApplyItem = {
  id: string;
  category: Exclude<CategoryId, "all">;
  title: string;
  body: string;
  runner: string;
  channel: string;
  ready: string;
  applyUrl: string;
  applyLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
  secondaryExternal?: boolean;
};

/* Each group has its own colour (a site hub token, so dark mode follows)
   and icon, shown on the filter chips and on every card. */
const CATEGORIES: { id: CategoryId; label: string; color: string; icon: IconName }[] = [
  { id: "all", label: "All 24 links", color: "var(--ink)", icon: "grid" },
  { id: "disability", label: "Sight loss & disability", color: "var(--hub-benefits)", icon: "eye" },
  { id: "crisis", label: "Urgent cash & bills", color: "var(--hub-investigations)", icon: "bolt" },
  { id: "families", label: "Families & kids", color: "var(--hub-area)", icon: "family" },
  { id: "work-travel", label: "Travel, work & home", color: "var(--hub-tax)", icon: "bus" },
  { id: "older-carers", label: "Older Scots & carers", color: "var(--hub-reps)", icon: "heart" },
  { id: "free-help", label: "Free form & debt help", color: "var(--hub-schools)", icon: "chat" },
];

const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  (typeof CATEGORIES)[number]
>;

function channelIcon(channel: string): IconName {
  const c = channel.toLowerCase();
  if (c.startsWith("free phone")) return "phone";
  if (c.startsWith("online")) return "globe";
  if (c.startsWith("council")) return "building";
  if (c.startsWith("local")) return "pin";
  return "form";
}

const colorVar = (color: string) => ({ "--c": color }) as CSSProperties;

const ITEMS: ApplyItem[] = [
  {
    id: "adp",
    category: "disability",
    title: "Adult Disability Payment (ADP)",
    body: "Weekly tax free help for ages 16 to pension age with a health condition or disability.",
    runner: "Social Security Scotland",
    channel: "Online or phone",
    ready: "NI number, bank details, and notes on bad days.",
    applyUrl: "https://www.mygov.scot/adult-disability-payment/how-to-apply",
    applyLabel: "Apply on mygov.scot",
    secondaryLabel: "0800 182 2222",
    secondaryHref: "tel:08001822222",
  },
  {
    id: "blind-allowance",
    category: "disability",
    title: "Blind Person's Allowance (£3,250)",
    body: "Cuts your Scottish tax bill. No council blind card needed in Scotland. Backdate 4 years.",
    runner: "HMRC",
    channel: "Online or phone",
    ready: "NI number and eye doctor letter on sight and work.",
    applyUrl: "https://www.gov.uk/blind-persons-allowance/how-to-claim",
    applyLabel: "Claim at HMRC",
    secondaryLabel: "Tax checker",
    secondaryHref: "/sight-loss-scotland",
  },
  {
    id: "tv-blind",
    category: "disability",
    title: "Half-price TV Licence (blind)",
    body: "Saves £90 a year (pay £90 not £180) for your whole home if certified blind.",
    runner: "TV Licensing",
    channel: "Online or post",
    ready: "Copy of your CVI or eye doctor blind sign-off.",
    applyUrl: "https://www.tvlicensing.co.uk/check-if-you-need-one/for-your-home/blindseverely-sight-impaired-aud5",
    applyLabel: "Apply at TV Licensing",
    secondaryLabel: "Sight Loss hub",
    secondaryHref: "/sight-loss-scotland",
  },
  {
    id: "cdp",
    category: "disability",
    title: "Child Disability Payment",
    body: "Weekly tax free help for disabled children under 16 living in Scotland.",
    runner: "Social Security Scotland",
    channel: "Online or phone",
    ready: "Child details, bank details, and school or doctor notes.",
    applyUrl: "https://www.mygov.scot/child-disability-payment/how-to-apply",
    applyLabel: "Apply on mygov.scot",
    secondaryLabel: "0800 182 2222",
    secondaryHref: "tel:08001822222",
  },
  {
    id: "rnib-scotland",
    category: "disability",
    title: "RNIB Scotland Sight Loss Support",
    body: "Free help with CVI sight registration, benefits, work rights, and reading tech.",
    runner: "RNIB Scotland",
    channel: "Free phone",
    ready: "Your eye clinic notes or questions on sight loss.",
    applyUrl: "https://www.rnib.org.uk/scotland/",
    applyLabel: "Open RNIB Scotland",
    secondaryLabel: "0303 123 9999",
    secondaryHref: "tel:03031239999",
  },
  {
    id: "padp",
    category: "older-carers",
    title: "Pension Age Disability Payment",
    body: "Replaces Attendance Allowance in Scotland for older Scots who need daily care.",
    runner: "Social Security Scotland",
    channel: "Online or phone",
    ready: "NI number, bank details, and list of care needs.",
    applyUrl: "https://www.mygov.scot/pension-age-disability-payment/how-to-apply",
    applyLabel: "Apply on mygov.scot",
    secondaryLabel: "0800 182 2222",
    secondaryHref: "tel:08001822222",
  },
  {
    id: "carer",
    category: "older-carers",
    title: "Carer Support Payment",
    body: "£86.45 a week if you care 35+ hours a week for someone on a qualifying care payment.",
    runner: "Social Security Scotland",
    channel: "Online or phone",
    ready: "Bank details and details of the person you care for.",
    applyUrl: "https://www.mygov.scot/carer-support-payment/how-to-apply",
    applyLabel: "Apply on mygov.scot",
    secondaryLabel: "Carer guide",
    secondaryHref: "/carer-support-payment",
  },
  {
    id: "pension-credit",
    category: "older-carers",
    title: "Pension Credit (unlocks extra help)",
    body: "Tops up low pensions and unlocks Council Tax cuts and free TV licences over 75.",
    runner: "DWP",
    channel: "Online or phone",
    ready: "Income, pension, and savings totals plus bank details.",
    applyUrl: "https://www.gov.uk/pension-credit/how-to-claim",
    applyLabel: "Apply on GOV.UK",
    secondaryLabel: "0800 99 1234",
    secondaryHref: "tel:0800991234",
  },
  {
    id: "young-carer",
    category: "older-carers",
    title: "Young Carer Grant (Scotland)",
    body: "Yearly cash grant for carers aged 16 to 18 in Scotland who care 16+ hours a week.",
    runner: "Social Security Scotland",
    channel: "Online or phone",
    ready: "Your bank details and details of who you care for.",
    applyUrl: "https://www.mygov.scot/young-carer-grant/how-to-apply",
    applyLabel: "Apply on mygov.scot",
    secondaryLabel: "0800 182 2222",
    secondaryHref: "tel:08001822222",
  },
  {
    id: "crisis-grant",
    category: "crisis",
    title: "Scottish Welfare Fund Crisis Grant",
    body: "Fast cash for food, power, or emergencies. 98% are decided by the next working day.",
    runner: "Your Scottish council",
    channel: "Council form",
    ready: "ID, bank details, and a short note on the crisis.",
    applyUrl: "https://www.mygov.scot/scottish-welfare-fund/crisis-grants",
    applyLabel: "Find council form",
    secondaryLabel: "32 numbers",
    secondaryHref: "/crisis-grant-phone-number",
  },
  {
    id: "ctr",
    category: "crisis",
    title: "Council Tax Reduction (Scotland)",
    body: "Cuts your council tax bill on a low income. You must apply direct to your council.",
    runner: "Your Scottish council",
    channel: "Council form",
    ready: "Council tax bill, payslips or benefit letter, and savings.",
    applyUrl: "https://www.mygov.scot/council-tax-reduction",
    applyLabel: "Find council form",
    secondaryLabel: "Full guide",
    secondaryHref: "/blog/council-tax-reduction-scotland",
  },
  {
    id: "dhp",
    category: "crisis",
    title: "Discretionary Housing Payment",
    body: "Extra rent help from your council when housing costs beat Universal Credit or Housing Benefit.",
    runner: "Your Scottish council",
    channel: "Council form",
    ready: "Rent proof, benefit award note, and weekly spend list.",
    applyUrl: "https://www.mygov.scot/housing-benefit/discretionary-housing-payments",
    applyLabel: "Apply via mygov.scot",
    secondaryLabel: "Rent guide",
    secondaryHref: "/blog/discretionary-housing-payment-scotland",
  },
  {
    id: "uc",
    category: "crisis",
    title: "Universal Credit",
    body: "Monthly UK payment for households on low pay or out of work.",
    runner: "DWP",
    channel: "Online form",
    ready: "Bank account, email, ID, rent details, and recent pay.",
    applyUrl: "https://www.gov.uk/universal-credit/how-to-claim",
    applyLabel: "Apply on GOV.UK",
    secondaryLabel: "UC guide",
    secondaryHref: "/blog/universal-credit-when-you-work-more-hours",
  },
  {
    id: "warm-home",
    category: "crisis",
    title: "Warm Home Discount (£150 off)",
    body: "£150 off your winter electricity bill. Automatic for many, or apply via your supplier.",
    runner: "Energy suppliers / UK Gov",
    channel: "Auto or supplier",
    ready: "Your energy account number and benefit award letter.",
    applyUrl: "https://www.gov.uk/the-warm-home-discount-scheme",
    applyLabel: "Check on GOV.UK",
    secondaryLabel: "See £150 rules",
    secondaryHref: "/warm-home-discount-scotland",
  },
  {
    id: "scp",
    category: "families",
    title: "Scottish Child Payment",
    body: "Weekly payment per child under 16 for families getting qualifying benefits.",
    runner: "Social Security Scotland",
    channel: "Online or phone",
    ready: "Child birth date, bank details, and benefit award letter.",
    applyUrl: "https://www.mygov.scot/scottish-child-payment/how-to-apply",
    applyLabel: "Apply on mygov.scot",
    secondaryLabel: "Full guide",
    secondaryHref: "/scottish-child-payment",
  },
  {
    id: "best-start",
    category: "families",
    title: "Best Start Grant & Foods",
    body: "Cash grants at birth, nursery, and school start, plus a four weekly food card.",
    runner: "Social Security Scotland",
    channel: "Online or phone",
    ready: "MAT B1 or child details, bank details, and benefit proof.",
    applyUrl: "https://www.mygov.scot/best-start-grant-best-start-foods/how-to-apply",
    applyLabel: "Apply on mygov.scot",
    secondaryLabel: "See rates",
    secondaryHref: "/best-start-grant",
  },
  {
    id: "fsm",
    category: "families",
    title: "Free School Meals & Clothing Grant",
    body: "Free school lunches and yearly uniform cash paid direct by your Scottish council.",
    runner: "Your Scottish council",
    channel: "Council form",
    ready: "Child school name and benefit or low-income proof.",
    applyUrl: "https://www.mygov.scot/school-meals",
    applyLabel: "Apply via mygov.scot",
    secondaryLabel: "Grant rules",
    secondaryHref: "/blog/free-school-meals-clothing-grant-scotland",
  },
  {
    id: "nec",
    category: "work-travel",
    title: "Free Scottish Bus Pass (+1 Pass)",
    body: "Free bus travel for under 22s, over 60s, and disabled or blind people in Scotland.",
    runner: "Improvement Service",
    channel: "Online or council",
    ready: "Photo, ID, address proof, and CVI or disability letter.",
    applyUrl: "https://getyournec.scot/",
    applyLabel: "Apply at getyournec.scot",
    secondaryLabel: "Sight Loss hub",
    secondaryHref: "/sight-loss-scotland",
  },
  {
    id: "blue-badge",
    category: "work-travel",
    title: "Blue Badge Parking Pass",
    body: "Disabled parking badge covering physical, sight, and hidden disabilities across Scotland.",
    runner: "Your Scottish council",
    channel: "Online form",
    ready: "Photo, ID, and ADP letter or doctor proof.",
    applyUrl: "https://www.gov.uk/apply-blue-badge",
    applyLabel: "Apply on GOV.UK",
    secondaryLabel: "Disability hub",
    secondaryHref: "/disability-support-scotland",
  },
  {
    id: "access-to-work",
    category: "work-travel",
    title: "Access to Work (kit & taxis)",
    body: "Free UK grant paying for big screens, reading tech, helpers, or taxis to work.",
    runner: "DWP (UK wide)",
    channel: "Online form",
    ready: "Job details, employer name (or sole trader), and needs.",
    applyUrl: "https://www.gov.uk/access-to-work/apply",
    applyLabel: "Apply on GOV.UK",
    secondaryLabel: "Work rights",
    secondaryHref: "/sight-loss-scotland",
  },
  {
    id: "voiceability",
    category: "free-help",
    title: "VoiceAbility (free form help)",
    body: "Scottish Government funded help to apply for or challenge Social Security Scotland claims.",
    runner: "Free Scottish advocacy",
    channel: "Free phone",
    ready: "Your claim letter or questions. Completely free.",
    applyUrl: "https://www.voiceability.org/in-scotland",
    applyLabel: "Open VoiceAbility",
    secondaryLabel: "0300 303 1660",
    secondaryHref: "tel:03003031660",
  },
  {
    id: "spso",
    category: "free-help",
    title: "SPSO Crisis Grant Review",
    body: "Free independent review if your council still says no after a Tier 1 Crisis Grant check.",
    runner: "Scottish Ombudsman",
    channel: "Free phone",
    ready: "Council refusal letter and Tier 1 review reply.",
    applyUrl: "https://www.spso.org.uk/scottishwelfarefund/",
    applyLabel: "Open SPSO review",
    secondaryLabel: "0800 014 7299",
    secondaryHref: "tel:08000147299",
  },
  {
    id: "cas",
    category: "free-help",
    title: "Citizens Advice Scotland",
    body: "Free local advisers for full benefit checks, appeals, housing, and debt in all 32 councils.",
    runner: "Free advice charity",
    channel: "Local office",
    ready: "Any letters or bills you want checked for free.",
    applyUrl: "https://www.cas.org.uk/bureaux",
    applyLabel: "Find local office",
    secondaryLabel: "Refusal guide",
    secondaryHref: "/benefit-or-crisis-grant-rejected-scotland",
  },
  {
    id: "stepchange",
    category: "free-help",
    title: "StepChange Debt Charity",
    body: "Free, FCA regulated debt plans for Scotland. Never pay a private firm for debt help.",
    runner: "Free debt charity",
    channel: "Online or phone",
    ready: "Rough list of bills and monthly income.",
    applyUrl: "https://www.stepchange.org/debt-info/debt-in-scotland.aspx",
    applyLabel: "Open StepChange",
    secondaryLabel: "0800 138 1111",
    secondaryHref: "tel:08001381111",
  },
];

export default function ApplyDirectoryClient() {
  const [cat, setCat] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = ITEMS.filter((item) => {
    if (cat !== "all" && item.category !== cat) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.body.toLowerCase().includes(q) ||
      item.runner.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Search + Category filter bar */}
      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <label className={styles.search}>
            <span className="sr-only">Search Scottish applications and links</span>
            <Icon name="search" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. bus pass, blind, crisis grant, rent, tax..."
            />
          </label>
          <span className={styles.count} aria-live="polite">
            Showing {filtered.length} of {ITEMS.length} direct links
          </span>
        </div>

        <div className={styles.chips} role="group" aria-label="Filter by category">
          {CATEGORIES.map((c) => {
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => setCat(c.id)}
                className={styles.chip}
                style={colorVar(c.color)}
              >
                <span className={styles.chipIcon}>
                  <Icon name={c.icon} />
                </span>
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          No links match &ldquo;{query}&rdquo;. Try clearing the search box or switching to All {ITEMS.length}{" "}
          links.
        </div>
      ) : (
        <ul className={styles.grid}>
          {filtered.map((item) => {
            const isInternalSecondary = item.secondaryHref.startsWith("/");
            const isPhone = item.secondaryHref.startsWith("tel:");
            const meta = CATEGORY_BY_ID[item.category];
            return (
              <li key={item.id} className={styles.card} style={colorVar(meta.color)}>
                <p className={styles.catTag}>
                  <span className={styles.iconChip}>
                    <Icon name={meta.icon} />
                  </span>
                  {meta.label}
                </p>

                <h2 className={styles.cardTitle}>{item.title}</h2>
                <div className={styles.meta}>
                  <span className={styles.runner}>
                    <Icon name="building" />
                    {item.runner}
                  </span>
                  <span className={styles.channel}>
                    <Icon name={channelIcon(item.channel)} />
                    {item.channel}
                  </span>
                </div>

                <p className={styles.cardBody}>{item.body}</p>

                <div className={styles.ready}>
                  <Icon name="clipboard" />
                  <p>
                    <strong>Have ready:</strong> {item.ready}
                  </p>
                </div>

                <div className={styles.actions}>
                  <a
                    href={item.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.primary}
                  >
                    {item.applyLabel}
                    <Icon name="arrow" />
                  </a>
                  {isInternalSecondary ? (
                    <Link href={item.secondaryHref} className={styles.secondary}>
                      <Icon name="book" />
                      {item.secondaryLabel}
                    </Link>
                  ) : isPhone ? (
                    <p className={styles.phoneLine}>
                      Or phone <a href={item.secondaryHref}>{item.secondaryLabel}</a>
                    </p>
                  ) : (
                    <a href={item.secondaryHref} className={styles.secondary}>
                      <Icon name="arrow" />
                      {item.secondaryLabel}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
