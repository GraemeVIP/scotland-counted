import Link from "@/components/IntentLink";
import type { HolyroodMspContact } from "@/lib/data/holyrood";
import { site } from "@/lib/site";
import { formatVoteDate } from "@/lib/voting";
import PortraitLightbox from "@/components/PortraitLightbox";
import { ExplainText } from "@/components/ExplainServer";
import MspVoteList from "@/components/MspVoteList";
import { representativeSlug } from "@/lib/representatives";
import { getMspRating, type ApprovedMspReview } from "@/lib/data/mspReviews";
import { getMspInterests } from "@/lib/data/mspInterests";

const gbpWhole = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const gbpExact = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

function formatReceiptDate(iso: string) {
  if (!iso) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(iso)) return iso;
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function mspPartyColour(party: string) {
  const p = party.toLowerCase();
  if (p.includes("national") || p === "snp") return "#f2c200";
  if (p.includes("labour")) return "#e4003b";
  if (p.includes("conservative")) return "#0087dc";
  if (p.includes("green")) return "#02a95b";
  if (p.includes("liberal")) return "#faa61a";
  if (p.includes("reform")) return "#12b6cf";
  return "#8a93a3";
}

const reviewPublishedDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });
const reviewInteractionMonth = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function preparedMspEmailHref({
  msp,
  area,
  regional = false,
}: {
  msp: HolyroodMspContact;
  area: string;
  regional?: boolean;
}) {
  const subject = `Question from someone you represent in ${area}`;
  const body = `Dear ${msp.name},\n\nI live in ${area}${
    regional ? " and understand that you are one of my regional MSPs" : " and understand that you are my constituency MSP"
  }.\n\nI am writing about:\n[Say what is happening and how it affects you.]\n\nPlease tell me what you can do about this, and when I can expect an update.\n\nYours sincerely,\n[Your name]\n[Your home address]`;

  return `mailto:${msp.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function MspContactCard({
  msp,
  area,
  regional = false,
  headingLevel = 2,
  detailsHref,
}: {
  msp: HolyroodMspContact;
  area: string;
  regional?: boolean;
  headingLevel?: 2 | 3;
  detailsHref?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] bg-[var(--surface)] p-6 sm:p-7">
      <div className="flex items-start gap-4">
        {msp.photoUrl && (
          <PortraitLightbox
            src={msp.photoUrl}
            alt={`${msp.name}, ${msp.party} MSP`}
            sizes="80px"
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--r-s)] bg-[var(--surface-2)]"
          />
        )}
        <div>
          <p className="kicker mb-3 text-[var(--action-text)]">
            {regional ? "Regional MSP" : "Constituency MSP"}
          </p>
          {detailsHref ? (
            <Link
              href={detailsHref}
              className="no-underline hover:text-[var(--brand)]"
              aria-label={`View full details for ${msp.name}`}
            >
              <Heading className={headingLevel === 2 ? "h2 mb-2" : "h3 mb-2"}>{msp.name}</Heading>
            </Link>
          ) : (
            <Heading className={headingLevel === 2 ? "h2 mb-2" : "h3 mb-2"}>{msp.name}</Heading>
          )}
        </div>
      </div>
      <p className="ui text-[16px] leading-[1.5] text-[var(--ink-2)]">
        {partyLabel(msp)} · represents {area}
      </p>

      <dl className="mt-6 grid gap-4">
        <div>
          <dt className="ui text-[15px] font-[600] text-[var(--ink)]">Email</dt>
          <dd className="mt-1 text-[16px] leading-[1.5] break-words">
            <a href={`mailto:${msp.email}`}>{msp.email}</a>
          </dd>
        </div>
        {msp.officeAddress && (
          <div>
            <dt className="ui text-[15px] font-[600] text-[var(--ink)]">Public office address</dt>
            <dd className="mt-1 text-[16px] leading-[1.55] text-[var(--ink-2)]">
              {msp.officeAddress}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={preparedMspEmailHref({ msp, area, regional })}
          className="btn btn-primary justify-center text-center"
        >
          Open a ready written email
        </a>
        <a href={msp.profileUrl} className="btn btn-ghost justify-center text-center">
          Official Parliament profile
        </a>
        {detailsHref && (
          <Link href={detailsHref} className="btn btn-ghost justify-center text-center">
            Full details
          </Link>
        )}
      </div>
      <p className="ui mt-4 text-[15px] leading-[1.5] text-[var(--ink-2)]">
        The draft opens in your own email app. Read it, add the details of your problem and change
        anything you want before sending.
      </p>
    </article>
  );
}

export function MspProfileCard({
  msp,
  area,
  regional = false,
}: {
  msp: HolyroodMspContact;
  area: string;
  regional?: boolean;
}) {
  return (
    <article className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-[minmax(190px,0.7fr)_minmax(0,1.3fr)] sm:items-start">
        <div>
          <PortraitLightbox
            src={msp.photoUrl}
            alt={`${msp.name}, ${msp.party} MSP`}
            sizes="(max-width: 640px) 100vw, 280px"
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--r-s)] bg-[var(--surface-2)]"
            priority
          />
          <p className="ui mt-2 text-[14px] leading-[1.45] text-[var(--muted)]">
            Official Scottish Parliament portrait
          </p>
        </div>
        <div>
          <p className="kicker mb-3 text-[var(--action-text)]">
            {regional ? "Regional MSP" : "Constituency MSP"}
          </p>
          <h2 className="h2 mb-2">{msp.name}</h2>
          <p className="ui text-[17px] leading-[1.5] text-[var(--ink-2)]">
            {partyLabel(msp)} · {regional ? `regional MSP for ${area}` : `MSP for ${area}`}
          </p>

          <dl className="mt-7 grid gap-5">
            <div>
              <dt className="ui text-[15px] font-[600] text-[var(--ink)]">This term began</dt>
              <dd className="mt-1 text-[16px] leading-[1.5]">
                <time dateTime={msp.termStart}>{formatVoteDate(msp.termStart, "en-GB")}</time>
              </dd>
            </div>
            <div>
              <dt className="ui text-[15px] font-[600] text-[var(--ink)]">Email</dt>
              <dd className="mt-1 break-words text-[16px] leading-[1.5]"><a href={`mailto:${msp.email}`}>{msp.email}</a></dd>
            </div>
            {msp.officeAddress && (
              <div>
                <dt className="ui text-[15px] font-[600] text-[var(--ink)]">Public office</dt>
                <dd className="mt-1 text-[16px] leading-[1.55] text-[var(--ink-2)]">{msp.officeAddress}</dd>
              </div>
            )}
          </dl>

          {(msp.partyRoles.length > 0 || msp.governmentRoles.length > 0 || msp.committeeRoles.length > 0) && (
            <div className="mt-7 border-t border-[var(--rule)] pt-5">
              <h3 className="h3 mb-3">Current roles</h3>
              <ul className="grid gap-2 text-[16px] leading-[1.5] text-[var(--ink-2)]">
                {[...msp.partyRoles, ...msp.governmentRoles, ...msp.committeeRoles].map((role) => <li key={role}>{role}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a href={preparedMspEmailHref({ msp, area, regional })} className="btn btn-primary justify-center text-center">
          Open a ready written email
        </a>
        <Link href="#expenses-and-interests" className="btn btn-ghost justify-center text-center">
          Expenses &amp; interests
        </Link>
        <Link href="#msp-votes" className="btn btn-ghost justify-center text-center">
          How they voted
        </Link>
        <Link href="#reviews" className="btn btn-ghost justify-center text-center">
          Read reviews
        </Link>
        <a href={msp.profileUrl} className="btn btn-ghost justify-center text-center">
          Official Parliament profile
        </a>
      </div>
      <p className="ui mt-4 text-[15px] leading-[1.5] text-[var(--ink-2)]">
        The draft opens in your own email app. Read it and change anything you want before sending.
      </p>
    </article>
  );
}

export function MspExpensesAndInterests({
  msp,
  area,
}: {
  msp: HolyroodMspContact;
  area: string;
}) {
  const profile = getMspInterests(msp.memberId);
  if (!profile) return null;

  const exp = profile.holyroodExpenses;
  const west = profile.formerWestminster;
  const roi = profile.registerOfInterests;
  const dotColour = mspPartyColour(msp.party);

  const roiGroups = [
    { key: "properties", title: "Properties & rental income", items: roi.properties },
    { key: "remuneration", title: "Outside jobs & councillor pay", items: roi.remuneration },
    { key: "shares", title: "Company shareholdings", items: roi.shares },
    { key: "gifts", title: "Gifts, donations & hospitality", items: roi.gifts },
    { key: "visits", title: "Funded overseas visits", items: roi.visits },
  ].filter((g) => g.items.length > 0);

  const challengeSubject = `Question from someone you represent in ${area}: your published expenses and interests`;
  const challengeSummary = exp
    ? `your published Holyrood expenses of ${gbpExact.format(exp.total2425)} in 2024/25 (${gbpExact.format(exp.total4Yr)} over four years, excluding staff pay)`
    : west
      ? `your previous Westminster expense claims of ${gbpExact.format(west.totalPaid)} (including ${gbpExact.format(west.hotels)} on London hotels and ${gbpExact.format(west.flights)} on flights) and your 2026 Holyrood Register of Interests`
      : "your 2026 Scottish Parliament Register of Interests";
  const challengeBody = `Dear ${msp.name},\n\nI live in ${area} and am writing to ask about ${challengeSummary}, as published in the official parliamentary records.\n\nCould you explain why Scottish taxpayers should cover these costs on top of an MSP salary, and set out how you ensure value for money for local residents?\n\nYours sincerely,\n[Your name]\n[Your home address]`;
  const challengeMailto = `mailto:${msp.email}?subject=${encodeURIComponent(challengeSubject)}&body=${encodeURIComponent(challengeBody)}`;

  return (
    <section
      id="expenses-and-interests"
      className="pt-10 scroll-mt-24"
      aria-labelledby="msp-expenses-heading"
    >
      <ExplainText>
      <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--rule)] pb-5">
          <div>
            <p className="ui inline-flex items-center gap-2 text-[14px] font-[660] text-[var(--brand)]">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                style={{ background: dotColour }}
              />
              <span>Holyrood expenses &amp; 2026 Register of Interests</span>
            </p>
            <h2 id="msp-expenses-heading" className="h2 mt-1.5">
              {msp.name}: bills, payees &amp; outside ties
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {exp && (
              <Link
                href={`/mp-expenses-scotland/search?who=msp&msp=${profile.searchSlug}`}
                className="btn btn-primary text-[14.5px]"
              >
                Search all {exp.receiptCount.toLocaleString("en-GB")} receipts →
              </Link>
            )}
            <a href={challengeMailto} className="btn btn-ghost text-[14.5px]">
              Ask {msp.name} to explain
            </a>
          </div>
        </div>

        {/* 1. HOLYROOD EXPENSES (RETURNING MSPs) OR NEW MAY 2026 NOTICE */}
        {exp ? (
          <div className="space-y-5">
            <p className="ui text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
              These bills are from the last Holyrood term (2021 to June 2025). The Scottish
              Parliament has not published any bills from after June 2025 yet.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="tile border-t-[3px] border-t-[var(--bad)] p-4">
                <p className="ui text-[12.5px] font-[640] uppercase tracking-[0.04em] text-[var(--muted)]">
                  2024/25 direct bills
                </p>
                <p className="figure-num tnum mt-1.5 text-[30px] leading-none text-[var(--bad-text)]">
                  {gbpWhole.format(exp.total2425)}
                </p>
                <p className="ui mt-1.5 text-[13px] text-[var(--ink-2)]">
                  Not counting staff pay. Four year total: {gbpWhole.format(exp.total4Yr)}.
                </p>
              </div>

              <div className="tile p-4">
                <p className="ui text-[12.5px] font-[640] uppercase tracking-[0.04em] text-[var(--muted)]">
                  Edinburgh flat &amp; hotels
                </p>
                <p className="figure-num tnum mt-1.5 text-[30px] leading-none text-[var(--ink)]">
                  {gbpWhole.format(exp.edinburghAcc2425)}
                </p>
                <p className="ui mt-1.5 text-[13px] text-[var(--ink-2)]">
                  {exp.councilTax2425 > 0
                    ? `Includes ${gbpWhole.format(exp.councilTax2425)} council tax${
                        exp.councilTax2526Q1 > 0
                          ? `. Plus ${gbpWhole.format(exp.councilTax2526Q1)} claimed in April to June 2025 for the 2025/26 bill`
                          : ""
                      }.`
                    : exp.hotels2425 > 0
                      ? `Includes ${gbpWhole.format(exp.hotels2425)} on Edinburgh hotels.`
                      : "No Edinburgh flat or hotel claimed in 2024/25."}
                </p>
              </div>

              <div className="tile p-4">
                <p className="ui text-[12.5px] font-[640] uppercase tracking-[0.04em] text-[var(--muted)]">
                  Leaflets &amp; mailshots
                </p>
                <p className="figure-num tnum mt-1.5 text-[30px] leading-none text-[var(--ink)]">
                  {gbpWhole.format(exp.engagement2425)}
                </p>
                <p className="ui mt-1.5 text-[13px] text-[var(--ink-2)]">
                  {exp.marchEngagement2025 > 0 && exp.engagement2425 > 0
                    ? `${Math.round((exp.marchEngagement2025 / exp.engagement2425) * 100)}% (${gbpWhole.format(exp.marchEngagement2025)}) spent in March alone.`
                    : "Newsletters, reports and local ads."}
                </p>
              </div>

              <div className="tile p-4">
                <p className="ui text-[12.5px] font-[640] uppercase tracking-[0.04em] text-[var(--muted)]">
                  Office, travel &amp; papers
                </p>
                <p className="figure-num tnum mt-1.5 text-[30px] leading-none text-[var(--ink)]">
                  {gbpWhole.format(exp.office2425 + exp.travel2425)}
                </p>
                <p className="ui mt-1.5 text-[13px] text-[var(--ink-2)]">
                  Office {gbpWhole.format(exp.office2425)}. Travel {gbpWhole.format(exp.travel2425)}.
                  {exp.newspapers4Yr >= 500
                    ? ` Papers: ${gbpWhole.format(exp.newspapers4Yr)} (4 yrs).`
                    : exp.carMiles4Yr >= 1000
                      ? ` Car miles: ${exp.carMiles4Yr.toLocaleString("en-GB")} (4 yrs).`
                      : ""}
                </p>
              </div>
            </div>

            {exp.topReceipts.length > 0 && (
              <div className="rounded-[var(--r-s)] border border-dashed border-[var(--rule-strong)] bg-[var(--surface-2)] px-5 py-4 font-[family-name:var(--font-mono)]">
                <p className="ui text-[13.5px] font-[640] uppercase tracking-[0.05em] text-[var(--ink-2)]">
                  Biggest one off bills, one of each kind (not counting monthly rent)
                </p>
                <div className="mt-3 divide-y divide-dashed divide-[var(--rule-strong)]">
                  {exp.topReceipts
                    .filter((r, i, all) => all.slice(0, i).filter((x) => x.expenditure === r.expenditure).length < 1)
                    .map((r, i) => (
                    <div
                      key={`${r.date}-${r.amount}-${i}`}
                      className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                    >
                      <div className="min-w-0">
                        <span className="block text-[13px] text-[var(--ink-2)]">
                          {formatReceiptDate(r.date)} ({r.year}) · {r.expenditure}
                          {r.payee ? ` · Paid to: ${r.payee}` : ""}
                        </span>
                        <span className="block text-[15px] leading-[1.45] text-[var(--ink)]">
                          &ldquo;{r.details}&rdquo;
                        </span>
                      </div>
                      <span className="tnum shrink-0 text-[15px] font-[650] text-[var(--bad-text)]">
                        {gbpExact.format(r.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] px-5 py-4">
            <p className="ui text-[15.5px] font-[640] text-[var(--ink)]">
              New MSP from May 2026. First Holyrood bills are not out yet.
            </p>
            <p className="mt-1 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Holyrood has only shared MSP bills up to June 2025 so far. You can still see their
              2026 Register of Interests below
              {west ? ", plus their past Westminster MP bills." : "."}
            </p>
          </div>
        )}

        {/* 2. PREVIOUS WESTMINSTER RECORD FOR EX-MPs (PATRICIA GIBSON, STEPHEN FLYNN, ETC.) */}
        {west && (
          <div className="rounded-[var(--r-s)] border border-[var(--rule)] border-l-[5px] border-l-[var(--bad)] bg-[var(--surface-2)] p-5 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="ui text-[12.5px] font-[680] uppercase tracking-[0.06em] text-[var(--bad-text)]">
                  Past Westminster MP bills ({west.formerSeat}, 2022 to 2025)
                </p>
                <p className="ui mt-1 text-[15px] text-[var(--ink-2)]">
                  Before joining Holyrood in May 2026, {msp.name} claimed{" "}
                  <strong>{gbpWhole.format(west.totalPaid)}</strong> in Westminster bills from IPSA.
                  That covers {west.claimCount.toLocaleString("en-GB")} claims, with{" "}
                  <strong>{gbpWhole.format(west.nonStaffPaid)}</strong> outside staff pay and
                  redundancy.
                </p>
              </div>
              <p className="figure-num tnum text-[30px] leading-none text-[var(--bad-text)]">
                {gbpWhole.format(west.totalPaid)}
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-3.5 py-2.5">
                <p className="ui text-[12px] font-[620] text-[var(--muted)]">Flights</p>
                <p className="figure-num tnum text-[22px] text-[var(--ink)] mt-0.5">
                  {gbpWhole.format(west.flights)}
                </p>
              </div>
              <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-3.5 py-2.5">
                <p className="ui text-[12px] font-[620] text-[var(--muted)]">
                  London hotels ({west.hotelNights} nights)
                </p>
                <p className="figure-num tnum text-[22px] text-[var(--ink)] mt-0.5">
                  {gbpWhole.format(west.hotels)}
                </p>
              </div>
              <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-3.5 py-2.5">
                <p className="ui text-[12px] font-[620] text-[var(--muted)]">
                  Banners &amp; local ads
                </p>
                <p className="figure-num tnum text-[22px] text-[var(--ink)] mt-0.5">
                  {gbpWhole.format(west.advertisingAndBanners)}
                </p>
              </div>
              <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-3.5 py-2.5">
                <p className="ui text-[12px] font-[620] text-[var(--muted)]">
                  Office rent &amp; redundancy
                </p>
                <p className="figure-num tnum text-[22px] text-[var(--ink)] mt-0.5">
                  {gbpWhole.format(west.officeRent + west.redundancy)}
                </p>
              </div>
            </div>

            {west.topReceipts.length > 0 && (
              <details className="group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] overflow-hidden">
                <summary className="ui flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[14.5px] font-[620] text-[var(--action-text)] hover:bg-[var(--surface-2)] [&::-webkit-details-marker]:hidden">
                  <span>See standout Westminster bills for {msp.name}</span>
                  <span aria-hidden="true" className="text-[var(--muted)] transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <div className="border-t border-dashed border-[var(--rule-strong)] px-4 py-3 font-[family-name:var(--font-mono)] divide-y divide-dashed divide-[var(--rule)]">
                  {west.topReceipts.map((r, i) => (
                    <div
                      key={`${r.date}-${r.amount}-${i}`}
                      className="flex items-baseline justify-between gap-4 py-2"
                    >
                      <div className="min-w-0">
                        <span className="block text-[12px] text-[var(--muted)]">
                          {r.date} ({r.year}) · {r.category} · {r.costType}
                        </span>
                        <span className="block text-[13.5px] text-[var(--ink)]">
                          &ldquo;{r.details}&rdquo;
                        </span>
                      </div>
                      <span className="tnum shrink-0 text-[14.5px] font-[640] text-[var(--bad-text)]">
                        {gbpExact.format(r.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* 3. LIVE 2026 REGISTER OF INTERESTS */}
        <div className="border-t border-[var(--rule)] pt-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="h3">2026 Register of Interests</h3>
            <div className="flex flex-wrap gap-2">
              {roi.isActiveCouncillor && (
                <span className="ui rounded-full bg-[color-mix(in_srgb,var(--bad)_14%,transparent)] px-3 py-1 text-[12.5px] font-[660] text-[var(--bad-text)]">
                  Also a paid councillor in 2026
                </span>
              )}
              {roi.properties.length > 0 && (
                <span className="ui rounded-full bg-[color-mix(in_srgb,var(--warn)_20%,transparent)] px-3 py-1 text-[12.5px] font-[660] text-[var(--ink)]">
                  Lists {roi.properties.length}{" "}
                  {roi.properties.length === 1 ? "property" : "properties"}
                </span>
              )}
            </div>
          </div>

          {roiGroups.length > 0 ? (
            <div className="grid gap-3">
              {roiGroups.map((group) => (
                <details
                  key={group.key}
                  open={group.key === "properties" || group.key === "remuneration" || roiGroups.length <= 2}
                  className="group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] overflow-hidden"
                >
                  <summary className="ui flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-[640] text-[var(--ink)] hover:bg-[var(--surface)] [&::-webkit-details-marker]:hidden">
                    <span>
                      {group.title} ({group.items.length})
                    </span>
                    <span aria-hidden="true" className="text-[var(--muted)] transition-transform group-open:rotate-180">
                      ▾
                    </span>
                  </summary>
                  <ul data-verbatim="true" className="border-t border-[var(--rule)] bg-[var(--surface)] px-4 py-3 space-y-2.5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                    {group.items.map((item, idx) => (
                      <li key={`${group.key}-${idx}`} className="border-b border-[var(--rule)] pb-2.5 last:border-b-0 last:pb-0">
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
              No paid jobs, rental homes, shares, gifts or free trips are listed on the 2026
              Register of Interests.
              {roi.voluntaryCount > 0
                ? ` They list ${roi.voluntaryCount} unpaid ${roi.voluntaryCount === 1 ? "role" : "roles"}.`
                : ""}
            </p>
          )}

          <p className="ui text-[13.5px] leading-[1.5] text-[var(--muted)]">
            Source: Holyrood bills (to June 2025) and the 2026 Register of Interests
            {west ? ". Past MP bills from IPSA (2022 to 2025)." : "."}{" "}
            <Link href="/blog/msp-expenses-scotland-investigation" className="font-[600]">
              Read our MSP party tally →
            </Link>
          </p>
        </div>
      </div>
      </ExplainText>
    </section>
  );
}

export function MspProfileReviews({
  msp,
  reviews,
}: {
  msp: HolyroodMspContact;
  reviews: ApprovedMspReview[];
}) {
  const aggregate = getMspRating(reviews);
  const reviewPath = `/msp-reviews/${representativeSlug(msp.name)}`;

  return (
    <section id="reviews" className="pt-10" aria-labelledby="profile-reviews-heading">
      <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker mb-2 text-[var(--brand)]">Published experiences</p>
            <h2 id="profile-reviews-heading" className="h2">
              Reviews of {msp.name}
            </h2>
          </div>
          {aggregate && (
            <p
              className="ui rounded-full bg-[var(--action-tint)] px-4 py-2 text-[15px] font-[640] text-[var(--action-text)]"
              aria-label={`${aggregate.ratingValue.toFixed(1)} out of 5 from ${aggregate.reviewCount} approved ${aggregate.reviewCount === 1 ? "review" : "reviews"}`}
            >
              {aggregate.ratingValue.toFixed(1)} out of 5 · {aggregate.reviewCount} {aggregate.reviewCount === 1 ? "review" : "reviews"}
            </p>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="mt-6 grid gap-5">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="ui text-[18px] font-[640] text-[var(--ink)]">{review.title}</h3>
                    <p className="ui mt-2 text-[15px] leading-[1.55] text-[var(--muted)]">
                      {review.authorName} · {review.relationship}
                      {review.interactionDate ? (
                        <>
                          {" "}· interaction {" "}
                          <time dateTime={review.interactionDate}>
                            {reviewInteractionMonth.format(new Date(`${review.interactionDate}T00:00:00Z`))}
                          </time>
                        </>
                      ) : null}
                      {" "}· {" "}
                      <time dateTime={review.publishedDate}>
                        published {reviewPublishedDate.format(new Date(review.publishedDate))}
                      </time>
                    </p>
                  </div>
                  <p
                    className="ui rounded-full bg-[var(--action-tint)] px-4 py-2 text-[15px] font-[640] text-[var(--action-text)]"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </p>
                </div>
                <p className="mt-5 whitespace-pre-line text-[17px] leading-[1.7] text-[var(--ink-2)]">
                  {review.body}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-[16px] leading-[1.6] text-[var(--ink-2)]">
            No checked reviews for {msp.name} yet. That is not a good or bad score.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={`${reviewPath}#leave-review`} className="btn btn-primary justify-center text-center">
            Review this MSP
          </Link>
          <Link href={reviewPath} className="btn btn-ghost justify-center text-center">
            Open the full review page
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * The Presiding Officer chairs Holyrood and gives up their party to stay
 * neutral, so they do not vote. Checked on parliament.scot, 22 Nov 2026.
 */
const PRESIDING_OFFICERS = new Set(["Kenneth Gibson"]);

function isPresidingOfficer(msp: HolyroodMspContact) {
  return PRESIDING_OFFICERS.has(msp.name);
}

/** "SNP" etc., or "Presiding Officer (no party)" for the chair of Holyrood. */
export function partyLabel(msp: HolyroodMspContact) {
  return isPresidingOfficer(msp) ? "Presiding Officer (no party)" : msp.party;
}

export function MspVotingRecord({ msp }: { msp: HolyroodMspContact }) {
  if (isPresidingOfficer(msp)) {
    return (
      <section
        id="msp-votes"
        className="scroll-mt-24 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-8"
        aria-labelledby="msp-votes-heading"
      >
        <p className="kicker mb-2 text-[var(--brand)]">Voting record · Holyrood</p>
        <h2 id="msp-votes-heading" className="h2">
          Why {msp.name} does not vote
        </h2>
        <p className="mt-2 max-w-[66ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
          {msp.name} is the Presiding Officer: the person who chairs debates in the Scottish
          Parliament, a bit like a referee. To stay neutral, the Presiding Officer leaves their party
          and does not take part in votes. So the official record shows &ldquo;did not vote&rdquo; for
          all {msp.votes.length} of the latest votes. That is part of the job, not a missed vote.
        </p>
      </section>
    );
  }
  return <MspVoteList name={msp.name} party={msp.party} votes={msp.votes} />;
}

export function holyroodPersonJsonLd({
  msp,
  area,
  pagePath,
  regional = false,
  idSuffix = "msp",
}: {
  msp: HolyroodMspContact;
  area: string;
  pagePath: string;
  regional?: boolean;
  idSuffix?: string;
}) {
  const pageUrl = `${site.url}${pagePath}`;

  return {
    "@type": "Person",
    "@id": `${pageUrl}#${idSuffix}`,
    name: msp.name,
    url: pageUrl,
    jobTitle: `${regional ? "Regional" : "Constituency"} Member of the Scottish Parliament for ${area}`,
    email: `mailto:${msp.email}`,
    image: `${site.url}${msp.photoUrl}`,
    startDate: msp.termStart,
    ...(msp.officeAddress ? { address: msp.officeAddress } : {}),
    affiliation: { "@type": "Organization", name: msp.party },
    memberOf: {
      "@type": "GovernmentOrganization",
      name: "Scottish Parliament",
      url: "https://www.parliament.scot/",
    },
    sameAs: [msp.profileUrl],
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
  };
}

export function HolyroodSourceNote() {
  return (
    <p className="text-[17px] leading-[1.65] text-[var(--ink-2)]">
      Names, parties and emails come from Holyrood public files. Photos come from Holyrood under its{" "}
      <a href="https://www.parliament.scot/about/copyright">photo licence</a>. Each page shows when
      it was last checked, and changes go on our <Link href="/updates">update log</Link>.
    </p>
  );
}
