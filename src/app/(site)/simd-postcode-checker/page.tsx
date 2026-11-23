import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, SectionHead, CTA } from "@/components/Blocks";
import EditorialImage from "@/components/EditorialImage";
import SharePage from "@/components/SharePage";
import NextStepStrip from "@/components/NextStepStrip";
import QuickAnswer from "@/components/QuickAnswer";
import Faq from "@/components/Faq";
import { GuideTable } from "@/components/GuideTable";
import { JsonLd, faqJsonLd, imageJsonLd, meta } from "@/lib/seo";
import { rankAreas } from "@/lib/data/compareAreas";
import { councils } from "@/lib/data/councils";
import { SIMD_TOTAL_DATA_ZONES } from "@/lib/simd";
import SimdLookup from "./SimdLookup";
import Breadcrumbs from "@/components/Breadcrumbs";

const HERO_IMAGE = {
  src: "/images/editorial/simd-postcode-checker-scotland.webp",
  alt: "Sandstone tenements on a Scottish street representing SIMD postcode data zones",
  caption:
    "SIMD splits Scotland into 6,976 small neighbourhood data zones, each ranked from 1 (most deprived) to 6,976.",
  width: 1200,
  height: 800,
};

export const metadata = meta({
  title: "SIMD Postcode Checker Scotland: Check Your SIMD Decile",
  description:
    "Free SIMD postcode checker for Scotland. Enter any Scottish postcode to find its official SIMD 2020 decile (1 to 10), quintile, rank out of 6,976 and council share.",
  path: "/simd-postcode-checker",
  type: "website",
  image: HERO_IMAGE.src,
  imageAlt: HERO_IMAGE.alt,
  imageWidth: HERO_IMAGE.width,
  imageHeight: HERO_IMAGE.height,
  imageType: "image/webp",
});

const FAQ = [
  {
    q: "What is SIMD in Scotland?",
    a: "SIMD stands for the Scottish Index of Multiple Deprivation. It is the Scottish Government's official tool for identifying areas with concentrations of deprivation across 6,976 small neighbourhoods called data zones, scored across income, employment, education, health, access to services, crime and housing.",
  },
  {
    q: "What does SIMD Decile 1 or SIMD20 mean?",
    a: "Decile 1 is the most deprived 10% of neighbourhoods in Scotland (ranks 1 to 697). SIMD20 means the most deprived 20% (Deciles 1 and 2, or Quintile 1, covering ranks 1 to 1,395). Decile 10 is the least deprived 10%.",
  },
  {
    q: "Why do Scottish universities ask for my SIMD postcode?",
    a: "Most Scottish universities use SIMD20 (Quintile 1, Deciles 1 and 2) and sometimes SIMD40 (Deciles 1 to 4) for widening access contextual offers, guaranteed interviews, or adjusted entry requirements.",
  },
  {
    q: "Does living in a Decile 1 or Decile 10 postcode mean everyone there is poor or wealthy?",
    a: "No. SIMD measures areas, not individuals. Two in three people living in income deprivation in Scotland actually live outside the most deprived 20% of data zones, and prosperous households can live inside a Decile 1 area.",
  },
  {
    q: "Is SIMD 2020 still the latest version?",
    a: "Yes. SIMD 2020v2 is the current published Scottish Index of Multiple Deprivation used by the Scottish Government, councils, NHS boards and universities.",
  },
];

export default function SimdPostcodeCheckerPage() {
  const ranked = rankAreas("simd_most_deprived", "desc");
  const councilBySlug = new Map(councils.map((c) => [c.slug, c]));

  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Your area", path: "/areas" },
          { name: "SIMD postcode checker", path: "/simd-postcode-checker" },
        ]} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={imageJsonLd({
          src: HERO_IMAGE.src,
          alt: HERO_IMAGE.alt,
          title: "SIMD postcode checker Scotland",
          width: HERO_IMAGE.width,
          height: HERO_IMAGE.height,
        })}
      />

      <Page>
        <PageHeader
          eyebrow={`SIMD 2020v2 · ${SIMD_TOTAL_DATA_ZONES.toLocaleString("en-GB")} data zones`}
          title="SIMD postcode checker: check your SIMD decile in Scotland"
          lede="Enter any Scottish postcode to find its official Scottish Index of Multiple Deprivation (SIMD) rank, decile (1 to 10) and quintile (1 to 5), plus how all 32 Scottish councils compare."
        >
          <SharePage
            title="SIMD postcode checker Scotland"
            text="Check any Scottish postcode's official SIMD decile (1 to 10), quintile and council deprivation share."
            path="/simd-postcode-checker"
            label="Share SIMD checker"
            className="mt-4"
          />
        </PageHeader>

        <ContentFrame>
          <QuickAnswer
            answer={{
              label: "How SIMD Scotland scoring works",
              value: "1 to 10",
              unit: "SIMD deciles",
              detail:
                "Scotland is split into 6,976 data zones. Rank 1 (Decile 1) is the most deprived 10% of areas and Rank 6,976 (Decile 10) is the least deprived 10%. SIMD20 means Deciles 1 and 2.",
              rows: [
                { label: "SIMD10 (Decile 1)", value: "Ranks 1 to 697 (most deprived 10%)" },
                { label: "SIMD20 (Quintile 1)", value: "Ranks 1 to 1,395 (Deciles 1 and 2)" },
                { label: "SIMD40 (Quintiles 1 and 2)", value: "Ranks 1 to 2,790 (Deciles 1 to 4)" },
                { label: "Official edition", value: "SIMD 2020v2 (Scottish Government)" },
              ],
              asOf: "SIMD 2020v2 official data zones",
              source: {
                publisher: "Scottish Government SIMD",
                url: "https://www.gov.scot/collections/scottish-index-of-multiple-deprivation-2020/",
              },
              nextStep: {
                label: "Compare any two Scottish council areas",
                href: "/compare-areas",
              },
            }}
          />
        </ContentFrame>

        <ContentFrame className="pt-10">
          <SimdLookup />
          <NextStepStrip
            className="mt-7"
            items={[
              {
                href: "/council-tax-bands-scotland",
                label: "Council tax bands Scotland",
                blurb: "Check full yearly and monthly bills for all 32 councils.",
              },
              {
                href: "/safest-place-to-live-in-scotland",
                label: "Safest places in Scotland",
                blurb: "See how every Scottish council ranks on local crime.",
              },
              {
                href: "/who-is-my-msp",
                label: "Who is my MSP?",
                blurb: "Put in your postcode to find your MSPs, MP and emails.",
              },
            ]}
          />
          <EditorialImage
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            caption={HERO_IMAGE.caption}
            aspect="wide"
            className="mt-12"
          />
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="What SIMD measures"
            title="The seven domains behind every SIMD score"
          />
          <p className="mt-4 max-w-[66ch] text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            SIMD combines 30 indicators across seven domains into one combined rank. Income and
            employment carry the heaviest weight, while access to services reflects rural travel
            times to schools, GPs, shops and broadband.
          </p>
          <div className="mt-6">
            <GuideTable
              kicker="Methodology"
              title="SIMD 2020 domain weights"
              columns={["Domain", "Weight", "What it tracks"]}
              align={["left", "right", "left"]}
              rows={[
                ["Income", "28%", "People receiving income-related benefits and tax credits"],
                ["Employment", "28%", "Working-age people claiming unemployment or incapacity benefits"],
                ["Health", "14%", "Hospital stays, mortality, prescriptions and emergency admissions"],
                ["Education", "14%", "School attendance, attainment, university entry and qualifications"],
                ["Access to services", "9%", "Drive and public transport times to GP, school, shops and broadband"],
                ["Crime", "5%", "Recorded crimes of violence, drugs, housebreaking and vandalism"],
                ["Housing", "2%", "Overcrowded homes and homes without central heating"],
              ]}
              caption="Official domain weights published by the Scottish Government for SIMD 2020v2."
            />
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="All 32 councils"
            title="Most deprived areas in Scotland by council (SIMD20 share)"
          />
          <p className="mt-4 max-w-[66ch] text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            The table below shows the share of each council&apos;s data zones sitting inside
            Scotland&apos;s most deprived 20% (SIMD20). Click any council for full local pay, poverty
            and housing figures, or open the{" "}
            <a href="https://simd.scot/" target="_blank" rel="noopener noreferrer">
              official Scottish Government SIMD map ↗
            </a>{" "}
            to zoom down to street level.
          </p>

          <div className="tile mt-6 overflow-x-auto">
            <table className="w-full min-w-[460px] text-[15.5px]">
              <thead>
                <tr className="text-left">
                  {["Rank", "Council area", "Share in most deprived 20% (SIMD20)"].map((head) => (
                    <th key={head} className="kicker px-5 py-4 font-[500] text-[var(--muted)]">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ranked.map((row) => {
                  const council = councilBySlug.get(row.slug);
                  return (
                    <tr key={row.slug} className="border-t border-[var(--rule)]">
                      <td className="px-5 py-3 tnum text-[var(--muted)]">{row.rank}</td>
                      <td className="px-5 py-3 font-[580]">
                        <Link href={`/areas/${row.slug}`} className="text-[var(--action-text)]">
                          {council?.name ?? row.slug}
                        </Link>
                      </td>
                      <td className="px-5 py-3 tnum font-[600]">{row.value.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[15px] text-[var(--ink-2)]">
            Studying this for Modern Studies? See{" "}
            <Link href="/poverty-in-scotland">poverty in Scotland</Link>,{" "}
            <Link href="/indicators/glasgow-deprivation">Glasgow deprivation figures</Link>, or{" "}
            <Link href="/modern-studies-teaching-resources">free Modern Studies teaching resources</Link>.
          </p>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <Faq items={FAQ} kicker="Questions" title="Common questions about SIMD in Scotland" />
        </ContentFrame>

        <ContentFrame as="section" className="mt-16 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-4">Official sources</p>
          <ul className="space-y-2.5 text-[15.5px] text-[var(--ink-2)]">
            <li>
              <a
                href="https://www.gov.scot/collections/scottish-index-of-multiple-deprivation-2020/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Scottish Index of Multiple Deprivation 2020v2
              </a>
              , Scottish Government
            </li>
            <li>
              <a
                href="https://simd.scot/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Official interactive SIMD map
              </a>
              , Scottish Government
            </li>
          </ul>
        </ContentFrame>
      </Page>

      <CTA
        title="See how your council compares across Scotland"
        body="Put any two Scottish council areas side by side on pay, house prices, crime, schools, health and SIMD deprivation."
        href="/compare-areas"
        cta="Compare two areas"
        secondaryHref="/best-place-to-live-in-scotland"
        secondaryCta="Best places to live"
      />
    </>
  );
}
