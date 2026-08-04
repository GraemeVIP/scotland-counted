import type { MetadataRoute } from "next";
import { councils } from "@/lib/data/councils";
import { constituencies } from "@/lib/data/constituencies";
import { indicators, lifeExpectancy, deprivation } from "@/lib/data/indicators";
import { isPostCategoryIndexable, postCategories, posts } from "@/lib/data/posts";
import { site } from "../../site.config";
import { BAND_LETTERS } from "@/lib/data/councilTax";
import { MP_DATA_CHECKED_ISO, mps } from "@/lib/data/mps";
import {
  HOLYROOD_DATA_CHECKED_AT,
  holyroodConstituencies,
  holyroodRegions,
} from "@/lib/data/holyrood";
import { representativeSlug } from "@/lib/representatives";
import { councilAccountabilityRecords } from "@/lib/data/councilAccountability";

export default function sitemap(): MetadataRoute.Sitemap {
  const dataChecked = new Date(`${site.dataCheckedISO}T00:00:00Z`);
  const seoRelease = new Date("2026-08-02T00:00:00Z");
  const repositioning = new Date("2026-08-03T00:00:00Z");
  const latestPostDate = new Date(
    Math.max(...posts.map((post) => new Date(post.updated ?? post.date).getTime())),
  );

  const core: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "monthly", priority: 1, lastModified: seoRelease },
    { url: `${site.url}/areas`, changeFrequency: "monthly", priority: 0.95, lastModified: seoRelease },
    { url: `${site.url}/money`, changeFrequency: "monthly", priority: 0.95, lastModified: repositioning },
    { url: `${site.url}/councils`, changeFrequency: "monthly", priority: 0.85, lastModified: seoRelease },
    { url: `${site.url}/who-decides`, changeFrequency: "monthly", priority: 0.9, lastModified: repositioning },
    { url: `${site.url}/poverty`, changeFrequency: "monthly", priority: 0.9, lastModified: repositioning },
    { url: `${site.url}/find-my-mp-and-msp`, changeFrequency: "monthly", priority: 0.95, lastModified: seoRelease },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.9, lastModified: latestPostDate },
    { url: `${site.url}/faq`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/what-happens-when-you-email-your-mp`, changeFrequency: "monthly", priority: 0.95, lastModified: seoRelease },
    { url: `${site.url}/council-tax-bands-scotland`, changeFrequency: "yearly", priority: 0.9, lastModified: seoRelease },
    { url: `${site.url}/take-home-pay-calculator-scotland`, changeFrequency: "yearly", priority: 0.9, lastModified: seoRelease },
    { url: `${site.url}/poverty-in-scotland-quiz`, changeFrequency: "monthly", priority: 0.85, lastModified: seoRelease },
    { url: `${site.url}/browse`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/constituencies`, changeFrequency: "yearly", priority: 0.9 },
    {
      url: `${site.url}/representatives`,
      changeFrequency: "monthly",
      priority: 0.9,
      lastModified: new Date(`${MP_DATA_CHECKED_ISO}T00:00:00Z`),
    },
    {
      url: `${site.url}/representatives/msps`,
      changeFrequency: "monthly",
      priority: 0.9,
      lastModified: new Date(HOLYROOD_DATA_CHECKED_AT),
    },
    { url: `${site.url}/solutions-to-poverty-in-scotland`, changeFrequency: "monthly", priority: 0.85, lastModified: seoRelease },
    { url: `${site.url}/who-is-responsible-for-poverty-in-scotland`, changeFrequency: "monthly", priority: 0.85, lastModified: seoRelease },
    { url: `${site.url}/glasgow-poverty-statistics`, changeFrequency: "monthly", priority: 0.75, lastModified: seoRelease },
    { url: `${site.url}/why-poverty-is-worse-in-glasgow`, changeFrequency: "yearly", priority: 0.75, lastModified: seoRelease },
    { url: `${site.url}/press`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/updates`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${site.url}/methods`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/glossary`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/data`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/corrections`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/accessibility`, changeFrequency: "yearly", priority: 0.3, lastModified: repositioning },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const indicatorPages: MetadataRoute.Sitemap = [
    ...indicators.map((i) => i.slug),
    lifeExpectancy.slug,
    deprivation.slug,
  ].map((slug) => ({
    url: `${site.url}/indicators/${slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.8,
    lastModified: seoRelease,
  }));

  const areaPages: MetadataRoute.Sitemap = councils.map((c) => ({
    url: `${site.url}/areas/${c.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.75,
    lastModified: seoRelease,
  }));

  const councilAccountabilityPages: MetadataRoute.Sitemap = councilAccountabilityRecords.map((record) => ({
    url: `${site.url}/councils/${record.councilSlug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    lastModified: new Date(`${record.lastReviewedOn}T00:00:00Z`),
  }));

  const constituencyPages: MetadataRoute.Sitemap = constituencies.map((c) => ({
    url: `${site.url}/constituencies/${c.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  const representativePages: MetadataRoute.Sitemap = mps.map((mp) => ({
    url: `${site.url}/representatives/mps/${mp.constituencySlug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    lastModified: new Date(`${MP_DATA_CHECKED_ISO}T00:00:00Z`),
  }));

  const holyroodRepresentativePages: MetadataRoute.Sitemap = [
    ...holyroodConstituencies.map((record) =>
      `/representatives/msps/constituencies/${record.constituencySlug}`
    ),
    ...holyroodRegions.map((record) => `/representatives/msps/regions/${record.regionSlug}`),
    ...holyroodRegions.flatMap((record) =>
      record.msps.map(
        (msp) => `/representatives/msps/regions/${record.regionSlug}/${representativeSlug(msp.name)}`,
      ),
    ),
  ].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    lastModified: new Date(HOLYROOD_DATA_CHECKED_AT),
  }));

  const councilTaxPages: MetadataRoute.Sitemap = [
    ...BAND_LETTERS.map((b) => `band-${b.toLowerCase()}`),
    ...councils.map((c) => c.slug),
  ].map((slug) => ({
    url: `${site.url}/council-tax-bands-scotland/${slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.8,
    lastModified: seoRelease,
  }));

  /**
   * Posts carry a real date, so they get a real lastModified. Everything else
   * gets the date the underlying data was last checked. Stamping every URL with
   * the build time told search engines the whole site changes on every deploy,
   * which is both untrue and the fastest way to have lastmod ignored entirely.
   */
  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.85,
    lastModified: new Date(p.updated ?? p.date),
  }));

  const categoryPages: MetadataRoute.Sitemap = postCategories
    .filter((category) => isPostCategoryIndexable(category.slug))
    .map((category) => ({
      url: `${site.url}/blog/category/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
      lastModified: new Date(
        Math.max(
          ...posts
            .filter((post) => post.category === category.slug)
            .map((post) => new Date(post.updated ?? post.date).getTime()),
        ),
      ),
    }));

  return [
    ...core,
    ...categoryPages,
    ...postPages,
    ...indicatorPages,
    ...areaPages,
    ...councilAccountabilityPages,
    ...constituencyPages,
    ...representativePages,
    ...holyroodRepresentativePages,
    ...councilTaxPages,
  ].map((e) => ({ lastModified: dataChecked, ...e }));
}
