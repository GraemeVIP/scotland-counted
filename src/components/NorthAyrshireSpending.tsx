import Link from "@/components/IntentLink";

const accountsUrl = "https://www.north-ayrshire.gov.uk/Document-library/annual-accounts-2024-to-2025.pdf#page=15";
const spending = [
  ["Education", "175.995"],
  ["Health and Social Care Partnership", "135.243"],
  ["Place", "57.127"],
  ["Financing costs", "26.909"],
  ["Chief Executive’s services", "19.936"],
  ["Communities and Housing", "15.231"],
  ["Other corporate items", "8.350"],
];

export default function NorthAyrshireSpending() {
  return (
    <section id="spending" className="max-w-[820px] pt-14">
      <h2 className="h2 mb-3">Where North Ayrshire spent its money</h2>
      <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
        Education and the council’s Health and Social Care Partnership line accounted for about 71% of
        the £438.791 million shown as actual expenditure in its 2024/25 General Fund summary. These
        figures use the council’s budget reporting basis before accounting adjustments. The separate
        housing revenue account and capital programme sit elsewhere in the accounts.
      </p>
      <table className="mt-5 w-full border-collapse text-[16px] leading-[1.5] tnum">
        <caption className="pb-2 text-left font-[600]">2024/25 audited General Fund revenue expenditure</caption>
        <thead>
          <tr className="border-b-2 border-[var(--ink)]">
            <th scope="col" className="py-2 text-left">Service</th>
            <th scope="col" className="py-2 pl-4 text-right">£ million</th>
          </tr>
        </thead>
        <tbody>
          {spending.map(([service, amount]) => (
            <tr key={service} className="border-b border-[var(--rule)]">
              <th scope="row" className="py-2 text-left font-[500]">{service}</th>
              <td className="py-2 pl-4 text-right">{amount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-[650]">
            <th scope="row" className="py-2 text-left">Total</th>
            <td className="py-2 pl-4 text-right">438.791</td>
          </tr>
        </tfoot>
      </table>
      <p className="mt-3 text-[15px] leading-[1.6] text-[var(--ink-2)]">
        <a className="underline underline-offset-4" href={accountsUrl}>Audited annual accounts, page 15</a>
      </p>
      <p className="mt-5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
        The Scottish Government’s provisional return for 2025/26 puts Education at £208.4 million
        and Social Work at £144.1 million out of £431.7 million in net revenue spending. Its service
        definitions and accounting basis differ from the audited council table above. <a className="underline underline-offset-4" href="https://www.gov.scot/publications/local-government-2025-26-provisional-outturn-and-2026-27-budget-estimates/documents/">Scottish Government revenue workbook</a>.
      </p>
      <p className="mt-3 text-[15px] leading-[1.6] text-[var(--ink-2)]">
        <a className="underline underline-offset-4" href="https://www.north-ayrshire.gov.uk/council-voting-elections/performance-and-spending/payments-to-suppliers">Supplier payments over £25,000</a>{" "}·{" "}
        <a className="underline underline-offset-4" href="https://www.north-ayrshire.gov.uk/business-licensing/procurement-accounts/procurement">Contracts register and procurement reports</a>
      </p>
      <article className="mt-6 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5">
        <h3 className="h3">The £2.45 million school taxi bill</h3>
        <p className="mt-2 text-[16px] leading-[1.6] text-[var(--ink-2)]">
          North Ayrshire’s reported school run taxi and private hire bill for 2024/25. The route prices,
          invoices and journey counts are still needed to judge what the council got for its money.
        </p>
        <Link className="mt-3 inline-block text-[16px] font-[600] underline underline-offset-4" href="/blog/scottish-councils-school-taxi-spending">
          Read the nationwide council taxi investigation
        </Link>
      </article>
    </section>
  );
}
