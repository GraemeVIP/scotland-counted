import type { MetadataRoute } from "next";
import { councils } from "@/lib/data/councils";
import { indicators, lifeExpectancy, deprivation } from "@/lib/data/indicators";
import { site } from "../../site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/the-numbers`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/why-glasgow`, changeFrequency: "yearly", priority: 0.9 },
    { url: `${site.url}/what-would-fix-it`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/accountability`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/take-action`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/areas`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/methods`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/glossary`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/data`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/corrections`, changeFrequency: "monthly", priority: 0.3 },
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
    priority: c.slug === "glasgow-city" ? 0.9 : 0.6,
  }));

  return [...core, ...indicatorPages, ...areaPages].map((e) => ({
    ...e,
    lastModified: now,
  }));
}
