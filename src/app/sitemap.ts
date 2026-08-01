import type { MetadataRoute } from "next";
import { councils } from "@/lib/data/councils";
import { constituencies } from "@/lib/data/constituencies";
import { indicators, lifeExpectancy, deprivation } from "@/lib/data/indicators";
import { postCategories, posts } from "@/lib/data/posts";
import { site } from "../../site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/areas`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/take-action`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/faq`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/your-power`, changeFrequency: "monthly", priority: 0.95 },
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

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const categoryPages: MetadataRoute.Sitemap = postCategories.map((category) => ({
    url: `${site.url}/blog/category/${category.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...core, ...categoryPages, ...postPages, ...indicatorPages, ...areaPages, ...constituencyPages].map((e) => ({
    ...e,
    lastModified: now,
  }));
}
