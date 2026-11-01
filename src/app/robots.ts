import type { MetadataRoute } from "next";
import { site } from "../../site.config";

// These crawlers spend more of the monthly Vercel allowance than they return in UK
// readers. Delete a name to let that crawler back in.
const BLOCKED_CRAWLERS = ["Amazonbot", "Baiduspider", "PetalBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      ...BLOCKED_CRAWLERS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
