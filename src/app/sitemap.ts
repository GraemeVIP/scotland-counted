import type { MetadataRoute } from "next";
import { councils } from "@/lib/data/councils";
import { constituencies } from "@/lib/data/constituencies";
import { indicators, lifeExpectancy, deprivation } from "@/lib/data/indicators";
import { postCategories, posts } from "@/lib/data/posts";
import { site } from "../../site.config";
import { BAND_LETTERS } from "@/lib/data/councilTax";

export default function sitemap(): MetadataRoute.Sitemap {
  const dataChecked = new Date(`${site.dataCheckedISO}T00:00:00Z`);

  const core: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/areas`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/take-action`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/faq`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/your-power`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/council-tax-bands-scotland`, changeFrequency: "yearly", priority: 0.9 },
    { url: `${site.url}/take-home-pay-calculator-scotland`, changeFrequency: "yearly", priority: 0.9 },
    { url: `${site.url}/browse`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/constituencies`, changeFrequency: "yearly", priority: 0.9 },
    { url: `${site.url}/what-would-fix-it`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/accountability`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/the-numbers`, changeFrequency: "monthly", priority: 0.75 },
    { url: `${site.url}/why-glasgow`, changeFrequency: "yearly", priority: 0.75 },
    { url: `${site.url}/press`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/updates`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${site.url}/methods`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/glossary`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/data`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/corrections`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const indicatorPages: MetadataRoute.Sitemap = [
    ...indicators.map((i) => i.slug),
    lifeExpectancy.slug,
    deprivation.slug,
  ].map((slug) => ({
    url: `${site.url}/indicators/${slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const areaPages: MetadataRoute.Sitemap = councils.map((c) => ({
    url: `${site.url}/areas/${c.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.75,
  }));

  const constituencyPages: MetadataRoute.Sitemap = constituencies.map((c) => ({
    url: `${site.url}/constituencies/${c.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  const councilTaxPages: MetadataRoute.Sitemap = [
    ...BAND_LETTERS.map((b) => `band-${b.toLowerCase()}`),
    ...councils.map((c) => c.slug),
  ].map((slug) => ({
    url: `${site.url}/council-tax-bands-scotland/${slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.8,
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

  const categoryPages: MetadataRoute.Sitemap = postCategories.map((category) => ({
    url: `${site.url}/blog/category/${category.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [
    ...core,
    ...categoryPages,
    ...postPages,
    ...indicatorPages,
    ...areaPages,
    ...constituencyPages,
    ...councilTaxPages,
  ].map((e) => ({ lastModified: dataChecked, ...e }));
}
