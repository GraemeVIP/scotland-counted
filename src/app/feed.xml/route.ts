import { changelog } from "@/lib/data/changelog";
import { site } from "@/lib/site";

/** RSS feed of the public change log. Static at build time. */

export const dynamic = "force-static";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const items = changelog
    .map((e) => {
      const link = `${site.url}${e.href ?? "/updates"}`;
      return `    <item>
      <title>${esc(e.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="false">${esc(`${e.date}-${e.title}`)}</guid>
      <pubDate>${new Date(e.date + "T12:00:00Z").toUTCString()}</pubDate>
      <description>${esc(e.body)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — what changed</title>
    <link>${esc(site.url)}/updates</link>
    <atom:link href="${esc(site.url)}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(
      "Every data refresh, new section and correction on " + site.name + "."
    )}</description>
    <language>en-gb</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
