"use client";

import { useMemo, useState } from "react";
import { pressPackText, type PressPack } from "@/lib/pressPackText";

/**
 * Pick a council, get a finished press package.
 *
 * The whole thing is generated from the same data the council pages render,
 * through fixed templates that cannot phrase a judgement. See pressPack.ts for
 * what that costs and why it is worth it.
 *
 * The packs arrive already built, as a prop.
 *
 * The obvious version imported the generator here and called it on the client.
 * That worked, and it also pulled the whole benchmarking dataset into a shared
 * client chunk: three unrelated pages gained 183kB each, which the budget
 * check caught. The generator reads several hundred kilobytes of data to
 * produce about 1.5kB of text per council, so the text is what should travel.
 * Built once at build time on the server, switching is still instant.
 */
export default function PressPackPicker({ packs }: { packs: PressPack[] }) {
  const options = useMemo(
    () => packs.map((p) => ({ slug: p.slug, name: p.councilName })),
    [packs],
  );
  const [slug, setSlug] = useState(options[0]?.slug ?? "");
  const [copied, setCopied] = useState(false);

  const pack = useMemo(() => packs.find((p) => p.slug === slug) ?? null, [packs, slug]);
  const packText = useMemo(() => (pack ? pressPackText(pack) : ""), [pack]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(packText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked. The text is on the page to select by hand. */
    }
  }

  return (
    <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="grow">
          <label
            htmlFor="press-pack-council"
            className="ui mb-2 block text-[15px] font-[750] text-[var(--ink)]"
          >
            Choose a council area
          </label>
          <select
            id="press-pack-council"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="ui w-full min-h-12 rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3 text-[16px] text-[var(--ink)] outline-none focus:border-[var(--brand)]"
          >
            {options.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={copy}
          className="btn btn-primary shrink-0 justify-center whitespace-nowrap"
        >
          {copied ? "Copied" : "Copy the pack"}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {copied ? "Press pack copied to the clipboard." : ""}
      </p>

      {pack ? (
        <>
          <p className="mt-6 text-[20px] font-[750] leading-[1.25] text-[var(--ink)]">
            {pack.headline}
          </p>
          <p className="mt-2 max-w-[68ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
            {pack.standfirst}
          </p>

          <h3 className="ui mt-6 mb-2 text-[15px] font-[750] text-[var(--ink)]">Figures</h3>
          <ul className="grid gap-3">
            {pack.facts.map((fact) => (
              <li
                key={fact.text}
                className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4"
              >
                <p className="text-[16px] leading-[1.55] text-[var(--ink)]">{fact.text}</p>
                <p className="ui mt-2 text-[14px] text-[var(--muted)]">{fact.source}</p>
              </li>
            ))}
          </ul>

          {pack.notes.length > 0 && (
            <>
              <h3 className="ui mt-6 mb-2 text-[15px] font-[750] text-[var(--ink)]">
                Notes to editors
              </h3>
              <ul className="grid gap-2">
                {pack.notes.map((note) => (
                  <li key={note} className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
                    {note}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/*
            The plain-text version is on the page, not just behind the button.
            Clipboard access can be blocked, and a press pack you cannot select
            with a mouse is no use to the person who needs it most.
          */}
          <details className="mt-6">
            <summary className="ui cursor-pointer text-[15px] font-[700] text-[var(--brand)]">
              Show it as plain text
            </summary>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4 font-sans text-[15px] leading-[1.6] text-[var(--ink-2)]">
              {packText}
            </pre>
          </details>
        </>
      ) : null}
    </div>
  );
}
