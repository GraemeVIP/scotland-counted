import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, SectionHead, CTA } from "@/components/Blocks";
import EditorialImage from "@/components/EditorialImage";
import SharePage from "@/components/SharePage";
import QuickAnswer from "@/components/QuickAnswer";
import Faq from "@/components/Faq";
import { GuideTable } from "@/components/GuideTable";
import { JsonLd, faqJsonLd, imageJsonLd, meta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

const HERO_IMAGE = {
  src: "/images/editorial/scotland-bank-holidays-calendar.webp",
  alt: "Open calendar planner with heather and tea for Scotland bank holiday dates",
  caption:
    "Scotland normally has nine statutory bank holidays a year, including 2 January, early August and St Andrew's Day.",
  width: 1200,
  height: 800,
};

export const metadata = meta({
  title: "Scotland Bank Holidays 2026, 2027 & 2028: Official Dates",
  description:
    "Every official Scottish bank holiday for 2026, 2027 and 2028, including substitute days, how Scotland differs from England, and benefit payment date changes.",
  path: "/scotland-bank-holidays",
  type: "website",
  image: "/images/share/scotland-bank-holidays-calendar.jpg",
  imageAlt: HERO_IMAGE.alt,
  imageWidth: 1200,
  imageHeight: 630,
  imageType: "image/jpeg",
});

const HOLIDAYS_2026 = [
  ["1 January", "Thursday", "New Year's Day", "Statutory"],
  ["2 January", "Friday", "2nd January", "Scotland only"],
  ["3 April", "Friday", "Good Friday", "UK wide"],
  ["4 May", "Monday", "Early May bank holiday", "UK wide"],
  ["25 May", "Monday", "Spring bank holiday", "UK wide"],
  ["15 June", "Monday", "World Cup bank holiday", "Special 2026 Scotland holiday"],
  ["3 August", "Monday", "Summer bank holiday", "First Monday in August (Scotland)"],
  ["30 November", "Monday", "St Andrew's Day", "Scotland only"],
  ["25 December", "Friday", "Christmas Day", "UK wide"],
  ["28 December", "Monday", "Boxing Day (substitute day)", "26 December falls on Saturday"],
];

const HOLIDAYS_2027 = [
  ["1 January", "Friday", "New Year's Day", "UK wide"],
  ["4 January", "Monday", "2nd January (substitute day)", "2 January falls on Saturday"],
  ["26 March", "Friday", "Good Friday", "UK wide"],
  ["3 May", "Monday", "Early May bank holiday", "UK wide"],
  ["31 May", "Monday", "Spring bank holiday", "UK wide"],
  ["2 August", "Monday", "Summer bank holiday", "First Monday in August (Scotland)"],
  ["30 November", "Tuesday", "St Andrew's Day", "Scotland only"],
  ["27 December", "Monday", "Christmas Day (substitute day)", "25 December falls on Saturday"],
  ["28 December", "Tuesday", "Boxing Day (substitute day)", "26 December falls on Sunday"],
];

const HOLIDAYS_2028 = [
  ["3 January", "Monday", "New Year's Day (substitute day)", "1 January falls on Saturday"],
  ["4 January", "Tuesday", "2nd January (substitute day)", "2 January falls on Sunday"],
  ["14 April", "Friday", "Good Friday", "UK wide"],
  ["1 May", "Monday", "Early May bank holiday", "UK wide"],
  ["29 May", "Monday", "Spring bank holiday", "UK wide"],
  ["7 August", "Monday", "Summer bank holiday", "First Monday in August (Scotland)"],
  ["30 November", "Thursday", "St Andrew's Day", "Scotland only"],
  ["25 December", "Monday", "Christmas Day", "UK wide"],
  ["26 December", "Tuesday", "Boxing Day", "UK wide"],
];

const FAQ = [
  {
    q: "How many bank holidays does Scotland have each year?",
    a: "Scotland normally has 9 statutory bank holidays a year, compared with 8 in England and Wales. In 2026 Scotland had 10 because of the special 15 June World Cup bank holiday.",
  },
  {
    q: "Is Easter Monday a bank holiday in Scotland?",
    a: "No. Easter Monday is not a statutory bank holiday in Scotland, though some councils, schools and employers still treat it as a local public holiday.",
  },
  {
    q: "When is the August bank holiday in Scotland?",
    a: "Scotland's Summer bank holiday is always the first Monday in August (3 August 2026, 2 August 2027, 7 August 2028). In England and Wales it is the last Monday in August.",
  },
  {
    q: "Do I automatically get Scottish bank holidays off work?",
    a: "No. Employers in Scotland do not have to give paid leave on bank holidays, and they can count bank holidays towards your statutory 5.6 weeks of annual leave. Your employment contract sets out which days you get off.",
  },
  {
    q: "How do Scottish bank holidays affect benefit payments?",
    a: "When a Social Security Scotland or DWP payment falls on a bank holiday, it is normally paid early on the last working day before the holiday. That helps before Christmas, though it leaves a longer gap until January.",
  },
];

export default function ScotlandBankHolidaysPage() {
  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Scotland bank holidays", path: "/scotland-bank-holidays" },
        ]} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={imageJsonLd({
          src: HERO_IMAGE.src,
          alt: HERO_IMAGE.alt,
          title: "Scotland bank holidays 2026, 2027 and 2028",
          width: HERO_IMAGE.width,
          height: HERO_IMAGE.height,
        })}
      />

      <Page>
        <PageHeader
          eyebrow="Official GOV.UK & Scottish Government dates"
          title="Scotland bank holidays 2026, 2027 and 2028"
          lede="Scotland has its own bank holiday calendar, including 2 January, the first Monday in August and St Andrew's Day. Here is every official date for 2026, 2027 and 2028, plus substitute days when a holiday lands on a weekend."
        >
          <SharePage
            title="Scotland bank holidays 2026, 2027 and 2028"
            text="Every official Scottish bank holiday for 2026, 2027 and 2028, plus substitute days and benefit payment changes."
            path="/scotland-bank-holidays"
            label="Share bank holiday dates"
            className="mt-4"
          />
        </PageHeader>

        <ContentFrame>
          <QuickAnswer
            answer={{
              label: "Scotland bank holidays",
              value: "9 days",
              unit: "in a normal year",
              detail:
                "Scotland gets 2 January and St Andrew's Day, takes its Summer bank holiday on the first Monday in August, and does not have Easter Monday as a statutory bank holiday. Next up in late 2026: St Andrew's Day (30 Nov), Christmas Day (25 Dec) and Boxing Day substitute (28 Dec).",
              rows: [
                { label: "Remaining in 2026", value: "30 Nov, 25 Dec, 28 Dec" },
                { label: "New Year 2027", value: "1 Jan and 4 Jan (sub)" },
                { label: "August 2027", value: "Monday 2 August" },
                { label: "Christmas 2027", value: "27 Dec and 28 Dec (subs)" },
              ],
              asOf: "Checked against GOV.UK and gov.scot (2026 to 2028)",
              source: {
                publisher: "GOV.UK UK bank holidays",
                url: "https://www.gov.uk/bank-holidays",
              },
              nextStep: {
                label: "Check Social Security Scotland payment dates",
                href: "/social-security-scotland-payment-dates",
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
          <SectionHead eyebrow="2026 calendar" title="Scotland bank holidays 2026" />
          <div className="mt-6">
            <GuideTable
              kicker="2026"
              title="All Scottish bank holidays in 2026"
              columns={["Date", "Day", "Bank holiday", "Notes"]}
              align={["left", "left", "left", "left"]}
              rows={HOLIDAYS_2026}
              caption="2026 included an extra national bank holiday in Scotland on Monday 15 June."
            />
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-14">
          <SectionHead eyebrow="2027 calendar" title="Scotland bank holidays 2027" />
          <div className="mt-6">
            <GuideTable
              kicker="2027"
              title="All Scottish bank holidays in 2027"
              columns={["Date", "Day", "Bank holiday", "Notes"]}
              align={["left", "left", "left", "left"]}
              rows={HOLIDAYS_2027}
              caption="Because 2 January, Christmas Day and Boxing Day fall on weekends in 2027, substitute weekdays apply."
            />
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-14">
          <SectionHead eyebrow="2028 calendar" title="Scotland bank holidays 2028" />
          <div className="mt-6">
            <GuideTable
              kicker="2028"
              title="All Scottish bank holidays in 2028"
              columns={["Date", "Day", "Bank holiday", "Notes"]}
              align={["left", "left", "left", "left"]}
              rows={HOLIDAYS_2028}
              caption="New Year 2028 falls over Saturday and Sunday, giving substitute bank holidays on Monday 3 and Tuesday 4 January."
            />
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Scotland vs England & local dates"
            title="Bank holidays vs local Scottish council holidays"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              In Scotland, statutory bank holidays are set nationally, while{" "}
              <strong>local public holidays</strong> are set separately by each of the 32 councils.
              That is why Glasgow Fair Monday, Edinburgh&apos;s Victoria Day and Autumn holidays,
              and local September weekends differ from one council area to the next.
            </p>
            <p>
              If you receive Scottish benefits such as Adult Disability Payment, Carer Support
              Payment or Scottish Child Payment, bank holidays move your payment date forward. See
              every early payment date on{" "}
              <Link href="/social-security-scotland-payment-dates">
                Social Security Scotland payment dates
              </Link>
              .
            </p>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <Faq items={FAQ} kicker="Questions" title="Common questions about Scotland bank holidays" />
        </ContentFrame>

        <ContentFrame as="section" className="mt-16 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-4">Official sources</p>
          <ul className="space-y-2.5 text-[15.5px] text-[var(--ink-2)]">
            <li>
              <a
                href="https://www.gov.uk/bank-holidays"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                UK bank holidays (Scotland)
              </a>
              , GOV.UK
            </li>
            <li>
              <a
                href="https://www.mygov.scot/scotland-bank-holidays"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Bank holidays in Scotland
              </a>
              , mygov.scot
            </li>
          </ul>
        </ContentFrame>
      </Page>

      <CTA
        title="Check how bank holidays affect your Scottish payments"
        body="See every Christmas, New Year and bank holiday payment shift for Social Security Scotland benefits."
        href="/social-security-scotland-payment-dates"
        cta="See payment dates"
        secondaryHref="/benefits"
        secondaryCta="All Scottish benefits"
      />
    </>
  );
}
