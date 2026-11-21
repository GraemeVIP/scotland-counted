import Link from "@/components/IntentLink";
import { G } from "@/components/Glossary";
import { ExplainText } from "@/components/ExplainServer";
import type { MpInterestRecord } from "@/lib/data/mpInterests";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

const moneyWhole = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MpInterestsCard({
  interests,
  checkedDate,
  email,
  povertyCount,
  povertyRate,
  povertyYear,
}: {
  interests: MpInterestRecord;
  checkedDate: string;
  email?: string;
  povertyCount?: number;
  povertyRate?: number;
  povertyYear?: string;
}) {
  const hasFinancialOrProperty =
    interests.donations.length > 0 ||
    interests.gifts.length > 0 ||
    interests.visits.length > 0 ||
    interests.earnings.length > 0 ||
    interests.properties.length > 0 ||
    interests.shareholdings.length > 0 ||
    interests.family.length > 0;

  const exp = interests.expenses;
  const shortName = interests.name.replace(/^(Mr|Mrs|Ms|Miss|Dr) /, "");

  const askMailto = (() => {
    if (!email) return null;
    const subject = `Question from a constituent: your 2025/26 expenses and registered interests (${interests.constituency})`;
    const lines: string[] = [];
    if (exp) {
      lines.push(
        `According to the 2025/26 IPSA figures, you claimed ${money.format(exp.nonStaffSpend)} in non-staff expenses on top of your £91,346 MP salary (${money.format(exp.totalSpend)} including staff wages).`,
      );
      const items: string[] = [];
      if (exp.secondHomeRent > 0)
        items.push(`${money.format(exp.secondHomeRent)} for second home rent`);
      if (exp.secondHomeCouncilTax > 0)
        items.push(`${money.format(exp.secondHomeCouncilTax)} for second home council tax`);
      if (exp.secondHomeUtilities > 0)
        items.push(
          `${money.format(exp.secondHomeUtilities)} for second home heating and utilities`,
        );
      if (exp.londonHotels > 0) items.push(`${money.format(exp.londonHotels)} for London hotels`);
      if (exp.flights > 0) items.push(`${money.format(exp.flights)} for flights`);
      if (exp.taxis > 0) items.push(`${money.format(exp.taxis)} for taxis`);
      if (exp.parking > 0) items.push(`${money.format(exp.parking)} for car parking`);
      if (exp.dependantTravel > 0)
        items.push(`${money.format(exp.dependantTravel)} for family/dependant travel`);
      if (items.length > 0) {
        lines.push(`That included ${items.join(", ")}.`);
      }
    }
    if (interests.totalFinancialValue > 0) {
      lines.push(
        `On the Register of Interests, you have also declared ${money.format(interests.totalFinancialValue)} in private donations, funded overseas trips or hospitality.`,
      );
    }
    if (povertyCount && povertyRate) {
      lines.push(
        `At the same time, an estimated ${povertyCount.toLocaleString("en-GB")} children in ${interests.constituency} (${povertyRate}%) are living in poverty after housing costs, and local households are paying rising council tax and energy bills out of their own wages.`,
      );
    }
    const body = `Dear ${interests.name},\n\nI am a constituent in ${interests.constituency}.\n\n${lines.join("\n\n")}\n\nCould you explain how you justify charging these personal accommodation and travel costs to the taxpayer while households in ${interests.constituency} face these pressures?\n\nYours sincerely,\n[Your name]\n[Your address and postcode in ${interests.constituency}]`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  })();

  return (
    <div className="tile overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[var(--rule)] bg-[linear-gradient(160deg,var(--surface-2),var(--surface)_75%)] px-6 py-6 sm:px-8 sm:py-7">
        <div>
          <p className="kicker mb-2 text-[var(--action-text)]">
            Taxpayer expenses, donations and freebies
          </p>
          <h2 className="h2">
            Expenses, donations, foreign trips and freebies for {interests.name}
          </h2>
          <p className="mt-2 max-w-[66ch] text-[16px] leading-[1.55] text-[var(--ink-2)]">
            <ExplainText>
              Every pound {interests.name} billed to the taxpayer via IPSA in 2025/26 on top of
              their £91,346 salary, plus private donations, free tickets, hospitality, paid foreign
              trips, rental properties and lobbying links on the Register of Interests (checked{" "}
              {formatDate(checkedDate) ?? checkedDate}).
            </ExplainText>
          </p>
        </div>
        <div className="w-full max-w-[360px] rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]">
          <p className="ui text-[14px] font-[620] leading-[1.35] text-[var(--ink-2)]">
            {exp
              ? `${shortName}'s own claims, ${exp.year}`
              : `${shortName}'s declared donations, trips and gifts`}
          </p>
          <p className="figure-num tnum mt-2 text-[38px] leading-[1.1] text-[var(--ink)]">
            {moneyWhole.format(exp ? exp.totalSpend : interests.totalFinancialValue)}
          </p>
          <p className="ui mt-1 text-[13px] text-[var(--muted)]">
            This MP only. Not a total for all MPs.
          </p>
          {exp && (
            <dl className="ui mt-3.5 space-y-1.5 border-t border-[var(--rule)] pt-3 text-[14px]">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[var(--ink-2)]">Wages for office staff</dt>
                <dd className="tnum font-[600] text-[var(--ink)]">
                  {moneyWhole.format(exp.staffingSpend)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[var(--ink-2)]">Everything else: rent, travel, office</dt>
                <dd className="tnum font-[700] text-[var(--bad-text)]">
                  {moneyWhole.format(exp.nonStaffSpend)}
                </dd>
              </div>
            </dl>
          )}
          <Link
            href="/mp-expenses-scotland"
            className="ui mt-3.5 inline-block text-[14px] font-[600] text-[var(--action-text)] no-underline hover:underline"
          >
            Compare all 57 Scottish MPs →
          </Link>
        </div>
      </div>

      <div className="px-6 pb-7 sm:px-8">
        {/* Local poverty & household bills contrast bar */}
        {povertyCount !== undefined && povertyRate !== undefined && (
          <div className="mt-5 rounded-[var(--r-s)] border-l-[3px] border-[var(--brand)] bg-[var(--surface-2)] px-4 py-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">
            <ExplainText>
              <strong className="text-[var(--ink)]">Meanwhile in {interests.constituency}:</strong>{" "}
              An estimated{" "}
              <Link href={`/constituencies/${interests.constituencySlug}`} className="font-[600]">
                {povertyCount.toLocaleString("en-GB")} children ({povertyRate}%)
              </Link>{" "}
              were living in poverty after housing costs in {povertyYear ?? "2023/24"}. While MPs
              can claim back their second home council tax and heating bills from the taxpayer,
              local families struggling with bills rely on{" "}
              <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link>, the{" "}
              <Link href="/warm-home-discount-scotland">£150 Warm Home Discount</Link> and{" "}
              <Link href="/crisis-grant-scotland">Scottish Welfare Fund Crisis Grants</Link>.
            </ExplainText>
          </div>
        )}

        {/* IPSA Expenses Block */}
        {exp && (
          <div className="mt-6">
            <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="ui text-[17px] font-[620] text-[var(--ink)]">
                {shortName}&apos;s claims from taxpayers via <G t="ipsa">IPSA</G> ({exp.year}):{" "}
                {money.format(exp.totalSpend)}
              </h3>
              <span className="ui text-[14px] text-[var(--muted)]">
                Rent, travel, hotels & office (without staff wages):{" "}
                <strong className="text-[var(--ink)]">{money.format(exp.nonStaffSpend)}</strong>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="relative overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 pt-5">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] bg-[var(--bad)]"
                />
                <p className="tile-key">London accommodation</p>
                <p className="figure-num tnum mt-1.5 text-[24px] leading-none text-[var(--ink)]">
                  {moneyWhole.format(exp.accommodationSpend)}
                </p>
                <p className="ui mt-2 text-[12.5px] leading-[1.4] text-[var(--ink-2)]">
                  Rent: {moneyWhole.format(exp.secondHomeRent)} · Council tax:{" "}
                  {moneyWhole.format(exp.secondHomeCouncilTax)}
                </p>
              </div>
              <div className="relative overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 pt-5">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] bg-[var(--bad)]"
                />
                <p className="tile-key">Travel & hotels</p>
                <p className="figure-num tnum mt-1.5 text-[24px] leading-none text-[var(--ink)]">
                  {moneyWhole.format(exp.travelSpend)}
                </p>
                <p className="ui mt-2 text-[12.5px] leading-[1.4] text-[var(--ink-2)]">
                  Flights: {moneyWhole.format(exp.flights)} · Hotels:{" "}
                  {moneyWhole.format(exp.londonHotels)}
                </p>
              </div>
              <div className="relative overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 pt-5">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] bg-[var(--bad)]"
                />
                <p className="tile-key">Taxis, parking & family</p>
                <p className="figure-num tnum mt-1.5 text-[24px] leading-none text-[var(--ink)]">
                  {moneyWhole.format(exp.taxis + exp.parking + exp.dependantTravel)}
                </p>
                <p className="ui mt-2 text-[12.5px] leading-[1.4] text-[var(--ink-2)]">
                  Taxis: {moneyWhole.format(exp.taxis)} · Family travel:{" "}
                  {moneyWhole.format(exp.dependantTravel)}
                </p>
              </div>
              <div className="relative overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 pt-5">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] bg-[var(--bad)]"
                />
                <p className="tile-key">Office & staffing</p>
                <p className="figure-num tnum mt-1.5 text-[24px] leading-none text-[var(--ink)]">
                  {moneyWhole.format(exp.officeSpend + exp.staffingSpend)}
                </p>
                <p className="ui mt-2 text-[12.5px] leading-[1.4] text-[var(--ink-2)]">
                  Office: {moneyWhole.format(exp.officeSpend)} · Staff:{" "}
                  {moneyWhole.format(exp.staffingSpend)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Register of Interests Summary pills */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="relative overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 pt-5">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-[var(--brand)]"
            />
            <p className="tile-key">Campaign donations</p>
            <p className="figure-num tnum mt-1.5 text-[24px] leading-none text-[var(--ink)]">
              {moneyWhole.format(interests.donationsTotal)}
            </p>
            <p className="ui mt-2 text-[13px] text-[var(--ink-2)]">
              {interests.donations.length} {interests.donations.length === 1 ? "entry" : "entries"}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 pt-5">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-[var(--brand)]"
            />
            <p className="tile-key">Funded foreign trips</p>
            <p className="figure-num tnum mt-1.5 text-[24px] leading-none text-[var(--ink)]">
              {moneyWhole.format(interests.visitsTotal)}
            </p>
            <p className="ui mt-2 text-[13px] text-[var(--ink-2)]">
              {interests.visits.length} {interests.visits.length === 1 ? "trip" : "trips"}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 pt-5">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-[var(--brand)]"
            />
            <p className="tile-key">Gifts & hospitality</p>
            <p className="figure-num tnum mt-1.5 text-[24px] leading-none text-[var(--ink)]">
              {moneyWhole.format(interests.giftsTotal)}
            </p>
            <p className="ui mt-2 text-[13px] text-[var(--ink-2)]">
              {interests.gifts.length} {interests.gifts.length === 1 ? "item" : "items"}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 pt-5">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-[var(--brand)]"
            />
            <p className="tile-key">Property & companies</p>
            <p className="figure-num tnum mt-1.5 text-[24px] leading-none text-[var(--ink)]">
              {interests.properties.length + interests.shareholdings.length}
            </p>
            <p className="ui mt-2 text-[13px] text-[var(--ink-2)]">
              {interests.properties.length} property · {interests.shareholdings.length} shareholding
            </p>
          </div>
        </div>

        {!hasFinancialOrProperty ? (
          <div className="mt-6 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
            <ExplainText>
              <strong>{interests.name}</strong> currently has no declared private donations, gifts,
              hospitality, funded overseas visits, second jobs, rental properties or company
              shareholdings on the House of Commons Register of Interests
              {interests.miscellaneousCount > 0
                ? ` (only ${interests.miscellaneousCount} unpaid or miscellaneous ${
                    interests.miscellaneousCount === 1 ? "role" : "roles"
                  } declared).`
                : "."}
            </ExplainText>
          </div>
        ) : (
          <ExplainText>
            <div className="mt-6 space-y-6">
              {interests.donations.length > 0 && (
                <div>
                  <h3 className="ui mb-2.5 text-[17px] font-[660] text-[var(--ink)]">
                    Donations and other support ({money.format(interests.donationsTotal)})
                  </h3>
                  <ul className="divide-y divide-[var(--rule)] overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)]">
                    {interests.donations.map((d) => (
                      <li
                        key={d.id}
                        className="flex flex-wrap items-baseline justify-between gap-3 px-4 py-3.5 text-[15.5px] transition-colors hover:bg-[var(--surface-2)]"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-[600] text-[var(--ink)]">{d.donor}</span>{" "}
                          <span className="text-[14px] text-[var(--muted)]">({d.donorStatus})</span>
                          {d.description && (
                            <p className="mt-0.5 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
                              {d.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-[640] text-[var(--action-text)] tnum">
                            {money.format(d.value)}
                          </span>
                          {d.date && (
                            <span className="block text-[13.5px] text-[var(--muted)]">
                              {formatDate(d.date)}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {interests.visits.length > 0 && (
                <div>
                  <h3 className="ui mb-2.5 text-[17px] font-[660] text-[var(--ink)]">
                    Funded visits outside the UK ({money.format(interests.visitsTotal)})
                  </h3>
                  <ul className="divide-y divide-[var(--rule)] overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)]">
                    {interests.visits.map((v) => (
                      <li
                        key={v.id}
                        className="flex flex-wrap items-baseline justify-between gap-3 px-4 py-3.5 text-[15.5px] transition-colors hover:bg-[var(--surface-2)]"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-[600] text-[var(--ink)]">
                            {v.countries.join(", ") || "International visit"}
                          </span>
                          {v.destinations.length > 0 && (
                            <span className="text-[14.5px] text-[var(--muted)]">
                              {" "}
                              ({v.destinations.join(", ")})
                            </span>
                          )}
                          <p className="mt-0.5 text-[14.5px] font-[550] text-[var(--ink-2)]">
                            Funded by: {v.donors.join(", ") || "See register"}
                          </p>
                          {v.purpose && (
                            <p className="mt-1 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
                              Purpose: {v.purpose}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-[640] text-[var(--action-text)] tnum">
                            {money.format(v.value)}
                          </span>
                          {v.startDate && (
                            <span className="block text-[13.5px] text-[var(--muted)]">
                              {formatDate(v.startDate)}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {interests.gifts.length > 0 && (
                <div>
                  <h3 className="ui mb-2.5 text-[17px] font-[660] text-[var(--ink)]">
                    Gifts, benefits and hospitality ({money.format(interests.giftsTotal)})
                  </h3>
                  <ul className="divide-y divide-[var(--rule)] overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)]">
                    {interests.gifts.map((g) => (
                      <li
                        key={g.id}
                        className="flex flex-wrap items-baseline justify-between gap-3 px-4 py-3.5 text-[15.5px] transition-colors hover:bg-[var(--surface-2)]"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-[600] text-[var(--ink)]">{g.donor}</span>
                          {g.description && (
                            <p className="mt-0.5 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
                              {g.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-[640] text-[var(--action-text)] tnum">
                            {money.format(g.value)}
                          </span>
                          {g.date && (
                            <span className="block text-[13.5px] text-[var(--muted)]">
                              {formatDate(g.date)}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {interests.earnings.length > 0 && (
                <div>
                  <h3 className="ui mb-2.5 text-[17px] font-[660] text-[var(--ink)]">
                    Outside employment and earnings
                  </h3>
                  <ul className="divide-y divide-[var(--rule)] overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)]">
                    {interests.earnings.map((e) => (
                      <li
                        key={e.id}
                        className="flex flex-wrap items-baseline justify-between gap-3 px-4 py-3.5 text-[15.5px] transition-colors hover:bg-[var(--surface-2)]"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-[600] text-[var(--ink)]">{e.role}</span>
                          {e.payer && (
                            <span className="text-[14.5px] text-[var(--muted)]"> · {e.payer}</span>
                          )}
                          {e.description && (
                            <p className="mt-0.5 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
                              {e.description}
                            </p>
                          )}
                        </div>
                        {e.value > 0 && (
                          <div className="text-right shrink-0">
                            <span className="font-[640] text-[var(--ink)] tnum">
                              {money.format(e.value)}
                            </span>
                            {e.regularity && (
                              <span className="block text-[13.5px] text-[var(--muted)]">
                                {e.regularity}
                              </span>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(interests.properties.length > 0 ||
                interests.shareholdings.length > 0 ||
                interests.family.length > 0) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {interests.properties.length > 0 && (
                    <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-5">
                      <h3 className="ui text-[15.5px] font-[620] text-[var(--ink)] mb-2">
                        Land and property declared
                      </h3>
                      <ul className="space-y-2 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
                        {interests.properties.map((p) => (
                          <li key={p.id}>
                            <strong className="text-[var(--ink)]">
                              {p.location} ({p.country})
                            </strong>
                            : {p.description || p.type}
                            {p.rentalIncome ? " · Rental income declared" : ""}
                            {p.ownerDetails ? ` (${p.ownerDetails})` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(interests.shareholdings.length > 0 || interests.family.length > 0) && (
                    <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-5">
                      <h3 className="ui text-[15.5px] font-[620] text-[var(--ink)] mb-2">
                        Shareholdings & family declarations
                      </h3>
                      <ul className="space-y-2 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
                        {interests.shareholdings.map((s) => (
                          <li key={s.id}>
                            <strong className="text-[var(--ink)]">{s.organisation}</strong>
                            {s.description ? `: ${s.description}` : ""}
                          </li>
                        ))}
                        {interests.family.map((f) => (
                          <li key={f.id}>
                            <strong className="text-[var(--ink)]">
                              {f.personName} ({f.relation})
                            </strong>
                            :{" "}
                            {f.kind === "lobbying"
                              ? `Lobbyist (${f.jobTitle} at ${f.employer})`
                              : `Employed as ${f.jobTitle}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ExplainText>
        )}

        {askMailto && (
          <div className="mt-7 rounded-[var(--r-m)] border border-[var(--rule)] border-l-[4px] border-l-[var(--action)] bg-[var(--action-tint)] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-[56ch]">
                <p className="kicker mb-1 text-[var(--action-text)]">Put it to your MP</p>
                <h3 className="ui text-[18px] font-[640] text-[var(--ink)]">
                  Ask {interests.name} to explain these claims
                </h3>
                <p className="mt-1 text-[15px] leading-[1.5] text-[var(--ink-2)]">
                  We have drafted an email setting {interests.name}&apos;s 2025/26 expense claims
                  and registered interests alongside the cost of living and child poverty figures in{" "}
                  {interests.constituency}. It opens in your email app so you can edit it and add
                  your address.
                </p>
              </div>
              <a href={askMailto} className="btn btn-primary shrink-0 justify-center text-center">
                Ask {interests.name} to explain →
              </a>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-4 text-[15px]">
          <Link href="/mp-expenses-scotland" className="font-[600]">
            Compare all 57 Scottish MPs on expenses, donations & freebies →
          </Link>
        </div>
      </div>
    </div>
  );
}
