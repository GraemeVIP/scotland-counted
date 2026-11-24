import Link from "@/components/IntentLink";
import { H2, H3, Lead, P, Prose } from "@/components/Prose";

const reportingUrl = "https://www.scottishdailyexpress.co.uk/news/scottish-news/cash-strapped-councils-spending-millions-36436320";
const policyUrl = "https://www.north-ayrshire.gov.uk/documents/school-transport-policy";
const awardUrl = "https://www.publiccontractsscotland.gov.uk/search/show/search_view.aspx?ID=AUG512048";

export default function Post() {
  return (
    <Prose>
      <Lead>
        North Ayrshire Council reported spending about £2.45 million on taxis and private hire for
        school runs in 2024/25. That was about 87% of its £2.83 million taxi bill. What did the
        council get for the money, and could it have bought the same service for less?{" "}
        <a href={reportingUrl}>Sunday Mail reporting on council FOI returns</a>.
      </Lead>
      <P>
        I can see the total and how the council says it buys transport. The missing bit is the
        link between the two. How many pupils were carried? How much did each route cost, how often
        did it run, and did the invoices match the agreed prices?
      </P>
      <P>
        The Scottish Government’s wider school transport line for North Ayrshire was £5.176 million
        in 2024/25 and £5.873 million provisionally in 2025/26. That line covers school transport
        under sections 50 and 51 of the Education (Scotland) Act 1980. It does not split out taxis,
        so we can’t use it to tell whether the taxi bill itself went up. <a href="https://www.gov.scot/publications/local-government-2025-26-provisional-outturn-and-2026-27-budget-estimates/documents/">Scottish Government revenue workbook, North Ayrshire tab</a>.
      </P>

      <H2 id="comparison">How North Ayrshire compares</H2>
      <P>
        Of the 25 councils with a school run figure in the comparison, North Ayrshire had the
        tenth biggest bill and came eighth when the bill was divided by the full school roll.
        That works out at about £144 per pupil on the roll. On the same measure, East Ayrshire
        reported £256, Inverclyde £55 and South Ayrshire less than £1. The size of that gap is a
        reason to check which journeys each council counted. The number of pupils actually carried
        is needed to work out the cost per passenger. Seven councils have no school run figure in
        the comparison. <a href="/data/scottish-school-taxi-spending-2024-25.csv" download>Download the figures for all 32 councils (CSV)</a>.
      </P>
      <P>
        In September 2024, North Ayrshire had 17,037 pupils on the roll. The Scottish Government
        recorded an additional support need for 6,706 of them, or 39.4%. East Ayrshire recorded a
        lower share, 30.9%, and reported a higher taxi bill. We would need to know which pupils
        qualified for transport in aggregate, the distances involved, the vehicles needed and what
        each council counted before drawing a conclusion from that. <a href="https://www.gov.scot/publications/foi-202500484033/">Scottish Government pupil figures</a>.
      </P>

      <H2 id="contracts">How the council buys the journeys</H2>
      <P>
        The council’s 2021 tender notice estimated £12.58 million before VAT for a purchasing
        system covering several years and different kinds of statutory journeys. One published
        batch of awards under that system gave price 70% of the score and quality 30%. That tells
        us how bids in that batch were judged. To see what any particular journey cost in 2024/25,
        we need the individual contract and the payments against it. <a href="https://www.find-tender.service.gov.uk/Notice/002285-2021">Original tender notice</a>{" "}·{" "}
        <a href={awardUrl}>Published award criteria</a>.
      </P>
      <P>
        The council’s contracts register lists 86 entries under NAC/5051. One shows the overall
        estimate and the other 85 have a zero in the value field. There are no route descriptions
        in those entries. The register can help identify suppliers, but those fields give us no
        route prices. <a href="https://maps-north-ayrshire.opendata.arcgis.com/datasets/02d5148515024fb1bf338705de49c831_34/explore">Council contracts register</a>.
      </P>
      <P>
        The council’s supplier dataset gives the vendor, date and amount for payments over £25,000.
        The published rows have no description of the work, invoice number or route reference. If
        a firm does several jobs for the council, a payment row alone gives us no way to tell which
        job it covers. <a href="https://www.north-ayrshire.gov.uk/council-voting-elections/performance-and-spending/payments-to-suppliers">Council supplier payments</a>.
      </P>

      <H2 id="five-questions">Five questions about the £2.45 million</H2>
      <H3>1. Was the journey needed?</H3>
      <P>
        The council has duties around school transport. Its own policy also goes further on distance
        for primary pupils and lists several ways to provide the service, including buses, taxis and
        arrangements with parents. To test the need for a particular taxi booking, I’d look for the
        recorded reason for choosing that vehicle and when the route was last reviewed. A child who
        needs a wheelchair accessible vehicle or cannot safely share may need a different arrangement.
        {" "}<a href={policyUrl}>North Ayrshire’s school transport policy</a>.
      </P>
      <H3>2. Did we get value for money?</H3>
      <P>
        Pick a route and check its daily or journey rate against the bills, including credits and
        extra charges. Check what was actually delivered against what was booked. A high bill might
        reflect a long route carrying several pupils, or it might include missed or cancelled trips
        that were still payable. The contract and the records of the journeys tell us which.
      </P>
      <H3>3. Could the same job have been bought for less?</H3>
      <P>
        Ask how many valid bids came in and what the next viable option cost. Then compare routes
        that need the same kind of vehicle, passenger support and hours. A regular taxi fare is
        only a useful comparison if it covers the same work. A shared route, minibus or parent
        mileage payment is worth checking where the council could meet the same needs that way.
      </P>
      <H3>4. Who benefited, and how?</H3>
      <P>
        Pupils get a way to attend school. Contractors get paid to provide it. The records to ask
        for are pupil and journey counts in aggregate, measures of reliability, and the sums received
        by each contractor. There’s no need to identify children or publish pickup addresses to
        answer any of that.
      </P>
      <H3>5. Did the taxi bill displace anything else?</H3>
      <P>
        To answer that, I’d ask which budget paid for the journeys, whether any of the money was
        restricted to a specific purpose, and for the decision approving any transfer from another
        budget. If the council deferred or cut a service to cover these costs, the transfer and its
        reason should be traceable in a budget paper or approval. The published figures reviewed
        here leave that question open.
      </P>

      <H2 id="records">The records that would answer those questions</H2>
      <P>
        The first request is for the council’s original FOI reply, the exact total and its scope,
        a spreadsheet of invoice lines and credits, and the matching list of routes and agreed
        rates with any identifying details removed. That gives us a way to reconcile what went
        through the accounts. From there, a small sample of invoices, tender scores and decisions
        about changing routes would let us check individual cases. The £2.45 million is the
        starting point. The price of doing the same job properly is the figure we need alongside it.
      </P>
      <P>
        See how this fits into the wider <Link href="/councils/north-ayrshire#spending">North Ayrshire Council spending breakdown</Link>.
      </P>
    </Prose>
  );
}
