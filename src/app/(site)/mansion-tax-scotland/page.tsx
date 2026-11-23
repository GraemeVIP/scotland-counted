import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, HeaderFacts, SectionHead, CTA, Callout } from "@/components/Blocks";
import EditorialImage from "@/components/EditorialImage";
import SharePage from "@/components/SharePage";
import QuickAnswer from "@/components/QuickAnswer";
import Faq from "@/components/Faq";
import { GuideTable } from "@/components/GuideTable";
import { JsonLd, articleJsonLd, faqJsonLd, imageJsonLd, meta } from "@/lib/seo";
import { chargesFor } from "@/lib/data/councilTax";
import { councils } from "@/lib/data/councils";
import { councilTaxPath } from "@/lib/routeMap";
import Breadcrumbs from "@/components/Breadcrumbs";

const HERO_IMAGE = {
  src: "/images/editorial/mansion-tax-scotland-council-tax-bands.webp",
  alt: "Detached Victorian sandstone villa in Scotland surrounded by autumn leaves representing new Band I and Band J council tax homes",
  caption:
    "The Council Tax (High Value Dwellings etc.) (Scotland) Bill creates Band I for homes worth over £1 million and Band J for homes worth over £2 million from April 2028.",
  width: 1200,
  height: 800,
};

const PUBLISHED_ISO = "2026-11-21";
const MODIFIED_ISO = "2026-11-21";

export const metadata = meta({
  title: "Mansion Tax Scotland: New Council Tax Bands I & J Explained",
  description:
    "Scotland's new mansion tax bill introduces Council Tax Band I (£1m to £2m) and Band J (over £2m) from April 2028, plus backdated dementia exemptions.",
  path: "/mansion-tax-scotland",
  type: "article",
  published: PUBLISHED_ISO,
  modified: MODIFIED_ISO,
  image: "/images/share/mansion-tax-scotland-council-tax-bands.jpg",
  imageAlt: HERO_IMAGE.alt,
  imageWidth: 1200,
  imageHeight: 630,
  imageType: "image/jpeg",
});

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const BAND_I_MULTIPLIER = 2.886;
const BAND_J_MULTIPLIER = 4.628;

const NEW_BANDS_TABLE = [
  ["Band D (current benchmark)", "£45,001 to £58,000 (1 April 1991 value)", "1.000 × Band D", "360 / 360", "Standard council benchmark"],
  ["Band G (current)", "£106,001 to £212,000 (1 April 1991 value)", "1.964 × Band D", "707 / 360", "Remains based on 1991 value unless over £1m in 2026"],
  ["Band H (current top band)", "Over £212,000 (1 April 1991 value)", "2.450 × Band D", "882 / 360", "Remains for homes under £1m on 1 April 2026"],
  ["Band I (new from April 2028)", "Over £1,000,000 up to £2,000,000 (1 April 2026 value)", "2.886 × Band D", "Nearly 2.9 × Band D", "~12,940 Scottish homes (~£4,770 average)"],
  ["Band J (new from April 2028)", "Over £2,000,000 (1 April 2026 value)", "4.628 × Band D", "Over 4.6 × Band D", "~660 Scottish homes (~£7,650 average)"],
];

const SAMPLE_COUNCILS = [
  "city-of-edinburgh",
  "glasgow-city",
  "east-dunbartonshire",
  "east-renfrewshire",
  "east-lothian",
  "aberdeen-city",
  "aberdeenshire",
  "fife",
  "perth-and-kinross",
  "stirling",
];

const FAQ = [
  {
    q: "What is the new mansion tax in Scotland?",
    a: "It is a reform in the Council Tax (High Value Dwellings etc.) (Scotland) Bill, introduced at the Scottish Parliament in November 2026. From 1 April 2028, it creates two new council tax bands above Band H for properties worth more than £1 million on 1 April 2026: Band I (£1 million to £2 million) and Band J (over £2 million).",
  },
  {
    q: "How much will Council Tax Band I and Band J cost in Scotland?",
    a: "Band I is charged at 2.886 times a council's Band D rate (around £4,770 a year on average across Scotland, before water charges). Band J is charged at 4.628 times the Band D rate (around £7,650 a year on average, before water charges). Exact bills depend on which of the 32 councils you live in.",
  },
  {
    q: "How many homes in Scotland will pay the mansion tax?",
    a: "Scottish Government estimates say roughly 13,600 properties will move into the new bands, less than 1% of all homes in Scotland. Around 12,940 homes fall into Band I (£1m to £2m) and about 660 homes fall into Band J (over £2m), with the largest concentration in Edinburgh.",
  },
  {
    q: "What if I have lived in my home for decades and cannot afford a huge council tax jump?",
    a: "The Bill includes automatic transitional relief for eligible sole or main residences moving from Bands A to H into Band I or Band J. It caps the annual council tax increase at either 50% of the previous year's bill or £1,500 a year, whichever is lower, so the rise is phased in rather than landing all at once.",
  },
  {
    q: "What does the Bill change for people with dementia or cognitive impairment?",
    a: "The Bill replaces the outdated phrase 'severe mental impairment' with 'significant cognitive impairment' and allows council tax discounts or exemptions for conditions such as dementia or brain injuries to be backdated to the date of medical diagnosis, rather than waiting until a qualifying benefit claim is approved.",
  },
  {
    q: "Does the mansion tax replace Land and Buildings Transaction Tax (LBTT)?",
    a: "No. Council tax is an annual charge on living in or owning a home. LBTT (Scotland's version of Stamp Duty) is a one off tax paid when you buy a property. Buying a £1.5 million home in Scotland still requires paying LBTT at purchase as well as Band I council tax each year from April 2028.",
  },
];

export default function MansionTaxScotlandPage() {
  const councilRows = SAMPLE_COUNCILS.map((slug) => {
    const council = councils.find((c) => c.slug === slug);
    const bands = chargesFor(slug);
    if (!council || !bands) return null;
    const bandD = bands[3].councilTax;
    const bandH = bands[7].councilTax;
    const bandI = bandD * BAND_I_MULTIPLIER;
    const bandJ = bandD * BAND_J_MULTIPLIER;
    return {
      slug,
      name: council.name,
      bandD,
      bandH,
      bandI,
      bandJ,
      extraI: bandI - bandH,
      extraJ: bandJ - bandH,
    };
  }).filter((r): r is NonNullable<typeof r> => r !== null);
  /** Edinburgh, from the worked examples table below, for the page header. */
  const edinburgh = councilRows.find((r) => r.slug === "city-of-edinburgh");

  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Council tax bands", path: "/council-tax-bands-scotland" },
          { name: "Mansion tax Scotland", path: "/mansion-tax-scotland" },
        ]} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={imageJsonLd({
          src: HERO_IMAGE.src,
          alt: HERO_IMAGE.alt,
          title: "Mansion tax Scotland: Council Tax Bands I and J explained",
          width: HERO_IMAGE.width,
          height: HERO_IMAGE.height,
        })}
      />
      <JsonLd
        data={articleJsonLd({
          headline: "Mansion Tax Scotland: New Council Tax Bands I and J Explained",
          description:
            "How Scotland's Council Tax (High Value Dwellings etc.) Bill works: Band I (£1m to £2m), Band J (over £2m), April 2028 start date, transitional caps and backdated dementia discounts.",
          path: "/mansion-tax-scotland",
          published: PUBLISHED_ISO,
          modified: MODIFIED_ISO,
          image: HERO_IMAGE.src,
          section: "Council tax",
          keywords: [
            "mansion tax scotland",
            "new council tax bands scotland",
            "council tax band i scotland",
            "council tax band j scotland",
            "council tax high value dwellings bill scotland",
          ],
          schemaType: "Article",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="Scottish Parliament Bill · Published 21 November 2026 · Last updated 21 November 2026"
          title="Mansion tax Scotland: new council tax bands I and J explained"
          lede="The Scottish Government has unveiled the Council Tax (High Value Dwellings etc.) (Scotland) Bill at Holyrood. Branded in the press as Scotland's mansion tax, it creates two new bands above Band H for homes worth over £1 million from April 2028, alongside backdated council tax help for people diagnosed with dementia and emergency powers for flooded homes."
          panel={
            edinburgh ? (
              <HeaderFacts
                label={`Council tax a year in ${edinburgh.name}, before water`}
                items={[
                  { value: pounds.format(edinburgh.bandH), label: "Band H, the top band now" },
                  { value: pounds.format(edinburgh.bandI), label: "new Band I, homes worth £1m to £2m" },
                  { value: pounds.format(edinburgh.bandJ), label: "new Band J, homes worth over £2m" },
                ]}
              />
            ) : undefined
          }
        >
          <SharePage
            title="Mansion tax Scotland: new council tax bands I & J explained"
            text="What Scotland's new Council Tax Band I (£1m to £2m) and Band J (over £2m) cost in each council, plus the new dementia and emergency discount rules."
            path="/mansion-tax-scotland"
            label="Share mansion tax guide"
            className="mt-4"
          />
        </PageHeader>

        <ContentFrame>
          <QuickAnswer
            answer={{
              label: "Scotland's new high value council tax bands",
              value: "Bands I & J",
              unit: "starting 1 April 2028",
              detail:
                "Homes worth over £1 million on 1 April 2026 will move out of the 1991 valuation system into two new bands from April 2028. Band I (£1m to £2m) pays 2.886 times Band D (around £4,770 a year). Band J (over £2m) pays 4.628 times Band D (around £7,650 a year). Around 13,600 homes are affected.",
              rows: [
                { label: "Band I (£1m to £2m)", value: "2.886 × Band D (~£4,770/yr)" },
                { label: "Band J (Over £2m)", value: "4.628 × Band D (~£7,650/yr)" },
                { label: "Homes affected", value: "~13,600 (under 1% of Scotland)" },
                { label: "Transitional rise cap", value: "Lower of 50% or £1,500 a year" },
              ],
              asOf: "Checked 21 November 2026 · Scottish Parliament & gov.scot",
              source: {
                publisher: "Scottish Government",
                url: "https://www.gov.scot/news/mansion-tax-bill-unveiled/",
              },
              nextStep: {
                label: "Check your current 2026/27 council tax bill",
                href: "/council-tax-bands-scotland",
              },
            }}
          />
          <EditorialImage
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            caption={HERO_IMAGE.caption}
            aspect="wide"
            loading="eager"
            className="mt-10"
          />
        </ContentFrame>

        <ContentFrame as="section" className="pt-14">
          <SectionHead
            eyebrow="What the Bill actually does"
            title="How Band I and Band J work from April 2028"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              Right now, every council tax bill in Scotland is anchored to what a home would have
              sold for on <strong>1 April 1991</strong>. Anything worth over £212,000 back in 1991
              sits in <Link href="/council-tax-band-h-scotland">Band H</Link>, where the owner pays
              2.45 times the local <Link href="/council-tax-band-d-scotland">Band D</Link> charge,
              whether the house is worth £850,000 today or £5 million.
            </p>
            <p>
              The <strong>Council Tax (High Value Dwellings etc.) (Scotland) Bill</strong>, formally
              introduced at Holyrood on 18 and 19 November 2026, leaves Bands A to H on their 1991
              footing for 99% of Scottish households. At the very top, however, it introduces a new
              modern valuation date of <strong>1 April 2026</strong> for any home worth more than £1
              million.
            </p>
            <p>
              If passed by MSPs, the Scottish Assessors will value high end properties against April
              2026 market prices, and the new charges will take effect on council tax bills from{" "}
              <strong>1 April 2028</strong>.
            </p>
          </div>
          <div className="mt-7">
            <GuideTable
              kicker="Council Tax (High Value Dwellings etc.) (Scotland) Bill"
              title="Current top council tax bands vs new Band I and Band J"
              columns={["Band", "Property valuation threshold", "Multiplier", "Ratio", "Who it covers"]}
              align={["left", "left", "right", "right", "left"]}
              rows={NEW_BANDS_TABLE}
              caption="Multipliers and property counts from the Scottish Parliament Bill papers published in November 2026."
            />
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Worked examples across Scotland"
            title="What Band I and Band J would cost in 10 Scottish councils"
          />
          <p className="mt-4 max-w-[66ch] text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            Because every council sets its own Band D rate, there is no single Scottish mansion tax
            bill. Applying the Bill&apos;s exact <strong>2.886</strong> (Band I) and{" "}
            <strong>4.628</strong> (Band J) multipliers to each council&apos;s confirmed{" "}
            <Link href="/council-tax-bands-scotland">2026/27 Band D council tax charge</Link> shows
            what those bills look like today, before Scottish Water charges or future 2027 and 2028
            rate increases.
          </p>

          <div className="tile mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-[15.5px]">
              <thead>
                <tr className="text-left">
                  {[
                    "Council area",
                    "Band D (now)",
                    "Band H (now)",
                    "New Band I (£1m–£2m)",
                    "New Band J (£2m+)",
                    "Extra at Band J vs H",
                  ].map((head) => (
                    <th key={head} className="kicker px-5 py-4 font-[500] text-[var(--muted)]">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {councilRows.map((row) => (
                  <tr key={row.slug} className="border-t border-[var(--rule)]">
                    <td className="px-5 py-3.5 font-[580]">
                      <Link href={councilTaxPath(row.slug)} className="text-[var(--action-text)]">
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 tnum">{pounds.format(row.bandD)}</td>
                    <td className="px-5 py-3.5 tnum">{pounds.format(row.bandH)}</td>
                    <td className="px-5 py-3.5 font-[580] tnum">{pounds.format(row.bandI)}</td>
                    <td className="px-5 py-3.5 font-[580] tnum text-[var(--bad-text)]">
                      {pounds.format(row.bandJ)}
                    </td>
                    <td className="px-5 py-3.5 font-[580] tnum text-[var(--bad-text)]">
                      +{pounds.format(row.extraJ)}/yr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14.5px] leading-[1.5] text-[var(--muted)]">
            Figures above are council tax only, calculated from each council&apos;s 2026/27 Band D
            rate times 2.886 (Band I) and 4.628 (Band J).{" "}
            <Link href="/water-rates-scotland">Scottish Water charges</Link> are billed on top.
          </p>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Where the £1m+ homes are"
            title="Why Edinburgh carries the bulk of Band I and Band J"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              Across the whole of Scotland, the Scottish Government estimates around{" "}
              <strong>12,940 properties</strong> sit between £1 million and £2 million (Band I) and
              roughly <strong>660 properties</strong> sit above £2 million (Band J). That is around
              13,600 homes in total, or roughly half of one per cent of Scotland&apos;s housing
              stock.
            </p>
            <p>
              More than half of those properties sit in{" "}
              <Link href="/edinburgh-council-tax-bands">Edinburgh</Link>, followed by pockets in{" "}
              <Link href="/glasgow-council-tax-bands">Glasgow</Link>,{" "}
              <Link href="/east-dunbartonshire-council-tax-bands">East Dunbartonshire</Link>{" "}
              (Bearsden and Milngavie),{" "}
              <Link href="/east-renfrewshire-council-tax-bands">East Renfrewshire</Link>,{" "}
              <Link href="/east-lothian-council-tax-bands">East Lothian</Link>,{" "}
              <Link href="/aberdeen-council-tax-bands">Aberdeen</Link>,{" "}
              <Link href="/aberdeenshire-council-tax-bands">Aberdeenshire</Link> and St Andrews in{" "}
              <Link href="/fife-council-tax-bands">Fife</Link>.
            </p>
          </div>
          <Callout>
            <p className="font-[600] text-[var(--ink)] mb-1">
              Transitional relief: the £1,500 or 50% annual cap
            </p>
            <p className="text-[16.5px] leading-[1.55] text-[var(--ink-2)]">
              A common objection to a mansion tax is the older homeowner whose family home in
              Edinburgh or Bearsden was bought 35 years ago and is now worth £1.2 million on paper,
              even though their pension income is modest. To soften sudden bill jumps, the Bill sets
              out automatic transitional protection for a sole or main residence moving from Bands A
              to H into Band I or J: your bill increase is capped at{" "}
              <strong>50% of the previous year&apos;s bill or £1,500 a year</strong>, whichever is
              lower. The{" "}
              <Link href="/single-person-discount-council-tax-scotland">
                25% single person discount
              </Link>{" "}
              also continues to apply.
            </p>
          </Callout>
        </ContentFrame>

        <ContentFrame as="section" className="pt-14">
          <SectionHead
            eyebrow="Hidden inside the same Bill"
            title="Two changes that affect ordinary households: dementia backdating and flood relief"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              While the headlines focus on £1 million houses, the{" "}
              <em>Council Tax (High Value Dwellings etc.) (Scotland) Bill</em> actually makes two
              important changes for ordinary households across all 32 councils:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Backdated council tax discounts for dementia and brain injuries:</strong>{" "}
                First, the Bill scraps the outdated legal label &quot;severe mental impairment&quot;
                and replaces it with <strong>&quot;significant cognitive impairment&quot;</strong>.
                Second, and much more importantly for families, it allows the council tax exemption
                or 25% discount for conditions like dementia to be{" "}
                <strong>backdated to the date of medical diagnosis</strong>, rather than only
                starting from the date a qualifying benefit like{" "}
                <Link href="/adult-disability-payment">Adult Disability Payment</Link> or Attendance
                Allowance was awarded.
              </li>
              <li>
                <strong>Local emergency council tax relief (flooding and fires):</strong> The Bill
                gives all 32 Scottish councils clear statutory power to reduce or waive council tax
                bills for households hit by local emergencies or natural disasters, such as severe
                flooding or tenement fires, without waiting for national legislation.
              </li>
            </ul>
            <p>
              Meanwhile, if you are buying a home at any price point in Scotland today, remember that
              annual council tax is separate from the upfront purchase tax. You can work out your
              exact purchase tax using our{" "}
              <Link href="/lbtt-calculator-scotland">
                Scottish LBTT calculator (Stamp Duty)
              </Link>
              , check what the upcoming{" "}
              <Link href="/scottish-budget-2027-28">Scottish Budget on 3 December 2026</Link> means
              for council funding and{" "}
              <Link href="/tax-bands-scotland">Scottish income tax bands</Link>, or see{" "}
              <Link href="/blog/how-council-tax-works-scotland">
                how council tax works in Scotland
              </Link>
              .
            </p>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <Faq
            items={FAQ}
            kicker="Questions"
            title="Common questions about Scotland's mansion tax and Bands I and J"
          />
        </ContentFrame>

        <ContentFrame as="section" className="mt-16 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-4">Official sources and how each figure is used</p>
          <ul className="space-y-3.5 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
            <li>
              <a
                href="https://www.parliament.scot/bills-and-laws/bills/s7/council-tax-high-value-dwellings-etc-scotland-bill"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Council Tax (High Value Dwellings etc.) (Scotland) Bill
              </a>
              , Scottish Parliament: Bill text, Policy Memorandum and Financial Memorandum
              introduced 18 to 19 November 2026: Band I (£1m to £2m, 2.886 × Band D, ~12,940 homes)
              and Band J (over £2m, 4.628 × Band D, ~660 homes) on a 1 April 2026 valuation standard
              taking effect 1 April 2028.
            </li>
            <li>
              <a
                href="https://www.gov.scot/news/mansion-tax-bill-unveiled/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Mansion tax bill unveiled
              </a>
              , Scottish Government (gov.scot): official news release covering the illustrative
              £4,770 (Band I) and £7,650 (Band J) annual charges, transitional protection capping
              annual rises for existing sole/main residences at the lower of 50% or £1,500 a year,
              significant cognitive impairment (dementia) backdating to medical diagnosis date, and
              local emergency council tax relief powers.
            </li>
            <li>
              <a
                href="https://www.gov.scot/publications/council-tax-high-value-dwellings-etc-scotland-bill-business-regulatory-impact-assessment/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Council Tax (High Value Dwellings etc.) (Scotland) Bill: Business and Regulatory Impact Assessment
              </a>
              , Scottish Government (gov.scot): property volume estimates (~13,600 homes, under 1%
              of Scottish dwellings) and geographical distribution across council areas.
            </li>
            <li>
              <a
                href="https://www.gov.scot/publications/council-tax-datasets/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Council tax datasets: 2026/27 Band D to Band H charges by local authority
              </a>
              , Scottish Government: the confirmed 2026/27 council tax charges used to calculate
              the worked Band I (2.886 × Band D) and Band J (4.628 × Band D) council table above.
            </li>
            <li>
              <a
                href="https://www.saa.gov.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Council tax valuation list and 1 April 1991 band thresholds
              </a>
              , Scottish Assessors Association: current Band A to Band H 1991 valuation thresholds
              and ratios (240/360 to 882/360 of Band D).
            </li>
          </ul>
        </ContentFrame>
      </Page>

      <CTA
        title="Check your current council tax band and 2026/27 bill"
        body="Look up every band from A to H in all 32 Scottish councils, with Scottish Water charges included, or calculate LBTT if you are moving home."
        href="/council-tax-bands-scotland"
        cta="Check council tax bands"
        secondaryHref="/lbtt-calculator-scotland"
        secondaryCta="Open Scottish LBTT calculator"
      />
    </>
  );
}
