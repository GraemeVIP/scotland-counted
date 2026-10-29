import Link from "next/link";
import { Page } from "@/components/Blocks";
import Faq from "@/components/Faq";
import QuickAnswer from "@/components/QuickAnswer";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { getSources } from "@/lib/data/sources";
import { calculate, TAX_DATA } from "@/lib/tax/engine";
import { SALARIES, salaryHubPath, salaryPath } from "@/lib/routeMap";

/**
 * "30000 after tax scotland" and its neighbours.
 *
 * One page per common salary, every figure worked out by the same tested tax
 * engine the calculator uses, so a page can never disagree with the tool. The
 * keyword is written the way people type it, digits and no comma, in the
 * address, the title and the H1; the body uses ordinary money formatting.
 */

const money = (value: number, pence = false) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: pence ? 2 : 0,
    maximumFractionDigits: pence ? 2 : 0,
  }).format(value);

const pct = (value: number) => `${(value * 100).toFixed(1)}%`;

const HOURS_A_WEEK = 37.5;

const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six"];

function figures(amount: number) {
  const scotland = calculate(amount, "scotland");
  const england = calculate(amount, "ruk");
  const pension = calculate(amount, "scotland", { pension: amount * 0.05, pensionType: "net" });
  const plan4 = calculate(amount, "scotland", { studentPlan: "4" });
  return { scotland, england, pension, plan4 };
}

export function salaryMetadata(amount: number) {
  const { scotland } = figures(amount);
  return meta({
    title: `${amount} After Tax Scotland 2026/27: Monthly, Weekly and Yearly`,
    description: `On £${amount.toLocaleString("en-GB")} a year in Scotland you take home ${money(scotland.net)} in 2026/27, or ${money(scotland.net / 12)} a month, after Scottish income tax and National Insurance.`,
    path: salaryPath(amount),
    type: "article",
  });
}

export function SalaryAfterTax({ amount }: { amount: number }) {
  const { scotland, england, pension, plan4 } = figures(amount);
  const gap = scotland.net - england.net;
  const keepPerPound = 1 - scotland.marginalRate;
  const bandsPaid = scotland.tax.bands.filter((band) => band.amount > 0);
  const index = SALARIES.indexOf(amount);
  const lower = index > 0 ? SALARIES[index - 1] : null;
  const higher = index < SALARIES.length - 1 ? SALARIES[index + 1] : null;
  const pretty = money(amount);

  const faq = [
    {
      q: `How much is ${amount} after tax in Scotland?`,
      a: `On a ${pretty} salary in Scotland you take home ${money(scotland.net)} a year in 2026/27. That is ${money(scotland.net / 12)} a month or ${money(scotland.net / 52)} a week, on the standard 1257L tax code with no pension or student loan.`,
    },
    {
      q: `How much tax do you pay on ${amount} in Scotland?`,
      a: `${money(scotland.tax.total)} in Scottish income tax and ${money(scotland.ni.total)} in National Insurance, ${money(scotland.deductions)} in all. That is ${pct(scotland.effectiveRate)} of your pay.`,
    },
    {
      q: `Do you take home more on ${amount} in Scotland or England?`,
      a:
        Math.abs(gap) < 1
          ? `About the same. The difference is under a pound a year.`
          : gap > 0
            ? `Scotland, by ${money(gap)} a year, because the starter rate is lower than England's basic rate.`
            : `England, Wales and Northern Ireland, by ${money(-gap)} a year. Scotland's intermediate, higher and advanced rates take more at this level.`,
    },
  ];

  const sources = getSources(["scottish-tax-2026", "ni-rates-2026"]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Salary after tax Scotland", path: salaryHubPath() },
          { name: `${pretty} after tax`, path: salaryPath(amount) },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <Page>
        <article className="max-w-[1120px] mx-auto pt-8 sm:pt-12">
          <Link href={salaryHubPath()} className="ui inline-flex items-center gap-2 text-[14.5px] font-[540] text-[var(--muted)] hover:text-[var(--ink)]">
            <span aria-hidden="true">←</span> Every salary
          </Link>

          <header className="mt-8">
            <p className="eyebrow">Salary after tax · {TAX_DATA.taxYear}</p>
            <h1 className="h1 mt-5 max-w-[20ch] text-[clamp(38px,5.4vw,76px)]">
              {amount} after tax Scotland: what you take home
            </h1>
            <p className="lede mt-6 max-w-[60ch]">
              On {pretty} a year in Scotland you take home {money(scotland.net)} after income tax and
              National Insurance. I have done the sums on Scotland&rsquo;s own tax bands, so you don&rsquo;t have to.
            </p>
          </header>

          <QuickAnswer
            className="mt-9"
            answer={{
              label: `${pretty} after tax in Scotland`,
              value: money(scotland.net / 12),
              unit: "a month",
              detail: `${money(scotland.net)} a year in your pocket, on the standard 1257L tax code with no pension and no student loan.`,
              rows: [
                { label: "A year", value: money(scotland.net) },
                { label: "A month", value: money(scotland.net / 12) },
                { label: "A week", value: money(scotland.net / 52) },
                { label: `An hour, at ${HOURS_A_WEEK} hours a week`, value: money(scotland.net / 52 / HOURS_A_WEEK, true) },
              ],
              asOf: `Tax year ${TAX_DATA.taxYear}, from 6 April 2026`,
              source: { publisher: "Scottish Government and GOV.UK rates", url: sources[0]?.url ?? "https://www.gov.scot" },
            }}
          />

          <div className="mt-14 grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
            <div className="prose min-w-0">
              <h2 className="h2" id="where-it-goes">Where the rest of {pretty} goes</h2>
              <p>
                Out of {pretty} you pay {money(scotland.tax.total)} in Scottish income tax and{" "}
                {money(scotland.ni.total)} in National Insurance. That is {money(scotland.deductions)} in all, or{" "}
                {pct(scotland.effectiveRate)} of what you earn.
              </p>
              <p>
                The first {money(scotland.tax.allowance)} is your personal allowance, so it&rsquo;s tax free. After that
                Scotland charges a different rate on each slice of your pay.
                {bandsPaid.length > 0 && ` At ${pretty} you pay ${bandsPaid.length === 1 ? "one of them" : `${NUMBER_WORDS[bandsPaid.length]} of them`}:`}
              </p>
              {bandsPaid.length > 0 && (
                <ul>
                  {bandsPaid.map((band) => (
                    <li key={band.name}>
                      {band.name} of {Math.round(band.rate * 100)}% on {money(band.amount)}: {money(band.tax)}
                    </li>
                  ))}
                </ul>
              )}
              <p>
                National Insurance is the same across the UK: 8% on earnings between {money(TAX_DATA.ni.primaryThreshold)} and{" "}
                {money(TAX_DATA.ni.upperLimit)}, then 2% above that.
              </p>

              <h2 className="h2" id="england">{amount} after tax in Scotland against England</h2>
              <p>
                {Math.abs(gap) < 1
                  ? `On ${pretty} you take home about the same in Scotland as in England, Wales and Northern Ireland.`
                  : gap > 0
                    ? `On ${pretty} you take home ${money(gap)} a year more in Scotland than someone on the same pay in England, Wales or Northern Ireland. Scotland's 19% starter rate is lower than the 20% basic rate there.`
                    : `On ${pretty} you take home ${money(-gap)} a year less in Scotland than someone on the same pay in England, Wales or Northern Ireland, ${money(-gap / 12)} a month. Scotland's higher rates start lower and charge more.`}
              </p>

              <h2 className="h2" id="pay-rise">What a pay rise is worth at {pretty}</h2>
              <p>
                At this level you keep {Math.round(keepPerPound * 100)}p of every extra pound you earn. The other{" "}
                {Math.round(scotland.marginalRate * 100)}p goes in income tax and National Insurance.
                {scotland.marginalRate > 0.5 &&
                  " That is unusually high, because your personal allowance is being taken away as your pay rises."}
              </p>

              <h2 className="h2" id="deductions">If you pay into a pension or a student loan</h2>
              <p>
                A 5% workplace pension taken before tax ({money(amount * 0.05)} a year) leaves you {money(pension.net)} a year,
                or {money(pension.net / 12)} a month. If you studied in Scotland you are probably on a Plan 4 student loan.{" "}
                {plan4.sl.total > 0
                  ? `On ${pretty} that takes ${money(plan4.sl.total)} a year and leaves ${money(plan4.net)}.`
                  : `You don't repay anything on it until you earn over ${money(TAX_DATA.studentLoans["4"].threshold)}, so at ${pretty} it makes no difference.`}
              </p>
              <p>
                For your own tax code, pension or loan, use the{" "}
                <Link href="/take-home-pay-calculator-scotland">take home pay calculator</Link>. It runs the same sums as
                this page.
              </p>
            </div>

            <aside className="min-w-0 lg:pt-2">
              <div className="tile p-6 lg:sticky lg:top-24">
                <p className="tile-key">Full breakdown</p>
                <dl className="mt-4 grid gap-0 text-[15px]">
                  {[
                    ["Salary", money(amount)],
                    ["Income tax", `−${money(scotland.tax.total)}`],
                    ["National Insurance", `−${money(scotland.ni.total)}`],
                    ["Take home a year", money(scotland.net)],
                    ["Take home a month", money(scotland.net / 12)],
                    ["Take home a week", money(scotland.net / 52)],
                  ].map(([label, value], row) => (
                    <div key={label} className={`flex justify-between gap-4 py-2.5 ${row ? "border-t border-[var(--rule)]" : ""} ${row >= 3 ? "font-[580]" : ""}`}>
                      <dt className="text-[var(--ink-2)]">{label}</dt>
                      <dd className="m-0 tnum">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>

          <nav aria-label="Other salaries" className="mt-14 grid gap-3 sm:grid-cols-3">
            {lower && (
              <Link href={salaryPath(lower)} className="tile p-5 no-underline">
                <span className="tile-key">Lower</span>
                <span className="mt-2 block text-[18px] font-[580]">{money(lower)} after tax</span>
              </Link>
            )}
            <Link href={salaryHubPath()} className="tile p-5 no-underline">
              <span className="tile-key">Every salary</span>
              <span className="mt-2 block text-[18px] font-[580]">Salary after tax Scotland</span>
            </Link>
            {higher && (
              <Link href={salaryPath(higher)} className="tile p-5 no-underline">
                <span className="tile-key">Higher</span>
                <span className="mt-2 block text-[18px] font-[580]">{money(higher)} after tax</span>
              </Link>
            )}
          </nav>

          <section className="mt-14" aria-labelledby="salary-questions">
            <Faq items={faq} id="salary-questions" kicker="Quick answers" />
          </section>

          <section className="mt-12 text-[15px] leading-[1.6] text-[var(--ink-2)]">
            <p className="eyebrow">Sources</p>
            <ul className="mt-3 grid gap-2">
              {sources.map((source) => (
                <li key={source.id}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-[580] text-[var(--ink)]">
                    {source.title}
                  </a>
                  , {source.publisher}
                </li>
              ))}
            </ul>
          </section>
        </article>
      </Page>
    </>
  );
}

export function salaryHubMetadata() {
  return meta({
    title: "Salary After Tax Scotland 2026/27: Every Salary From £15,000 to £150,000",
    description:
      "Take home pay in Scotland for every common salary from £15,000 to £150,000, worked out on the 2026/27 Scottish income tax bands and National Insurance.",
    path: salaryHubPath(),
    type: "website",
  });
}

export function SalaryHub() {
  const rows = SALARIES.map((amount) => ({ amount, ...figures(amount) }));
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Salary after tax Scotland", path: salaryHubPath() },
        ])}
      />
      <Page>
        <article className="max-w-[1120px] mx-auto pt-8 sm:pt-12">
          <header>
            <p className="eyebrow">Take home pay · {TAX_DATA.taxYear}</p>
            <h1 className="h1 mt-5 max-w-[20ch] text-[clamp(38px,5.4vw,76px)]">
              Salary after tax Scotland: take home pay for every salary
            </h1>
            <p className="lede mt-6 max-w-[60ch]">
              What you actually keep on every common salary, worked out on Scotland&rsquo;s six income tax bands and
              National Insurance. Pick yours for the full breakdown.
            </p>
          </header>

          <div className="tile mt-10 overflow-x-auto">
            <table className="w-full min-w-[560px] text-[15.5px]">
              <thead>
                <tr className="text-left">
                  {["Salary", "Take home a year", "A month", "A week", "Against England"].map((head) => (
                    <th key={head} className="kicker px-5 py-4 font-[500] text-[var(--muted)]">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ amount, scotland, england }) => {
                  const gap = scotland.net - england.net;
                  return (
                    <tr key={amount} className="border-t border-[var(--rule)]">
                      <td className="px-5 py-3.5">
                        <Link href={salaryPath(amount)} className="font-[580] text-[var(--action-text)]">
                          {money(amount)}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 tnum">{money(scotland.net)}</td>
                      <td className="px-5 py-3.5 tnum">{money(scotland.net / 12)}</td>
                      <td className="px-5 py-3.5 tnum">{money(scotland.net / 52)}</td>
                      <td className={`px-5 py-3.5 tnum ${gap >= 0 ? "text-[var(--good-text)]" : "text-[var(--bad-text)]"}`}>
                        {Math.abs(gap) < 1 ? "the same" : `${gap > 0 ? "+" : "−"}${money(Math.abs(gap))}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[14.5px] text-[var(--muted)]">
            Standard 1257L tax code, no pension, no student loan. For anything else use the{" "}
            <Link href="/take-home-pay-calculator-scotland">take home pay calculator</Link>.
          </p>
        </article>
      </Page>
    </>
  );
}
