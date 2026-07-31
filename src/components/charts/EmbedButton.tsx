"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/** A copyable iframe snippet, offered under charts that have an embed route. */
export default function EmbedButton({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const snippet = `<iframe src="${site.url}/embed/${slug}" width="100%" height="520" style="border:0" loading="lazy" title="${title.replace(/"/g, "'")}"></iframe>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <details className="group">
      <summary className="ui text-[15px] font-[620] text-[var(--ink-2)] hover:text-[var(--brand)] cursor-pointer py-2 w-fit list-none flex items-center gap-2">
        <span className="transition-transform group-open:rotate-90" aria-hidden="true">
          ▸
        </span>
        Embed this chart on your site
      </summary>
      <div className="mt-2 mb-3 max-w-[640px]">
        <div className="flex gap-2 items-stretch">
          <code className="datum flex-1 text-[15px] leading-[1.5] bg-[var(--paper-2)] border border-[var(--rule)] px-3 py-2.5 overflow-x-auto whitespace-nowrap">
            {snippet}
          </code>
          <button
            type="button"
            onClick={copy}
            className="ui shrink-0 bg-[var(--ink)] text-[var(--paper)] px-4 text-[15px] font-[620] hover:bg-[var(--brand)] hover:text-white transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-[15px] text-[var(--muted)] mt-2 leading-[1.5]">
          Free for any use. The chart stays live as the data updates, and links back here so your
          readers can check the sources.
        </p>
      </div>
    </details>
  );
}
