"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BAR_STORAGE_KEY, type BarVariant } from "@/lib/announcement";
import { trackEvent } from "@/lib/analytics";

/*
 * A bold strip across the very top of every page, pointing visitors at the
 * MP expenses pages. It is part of the first render, so the page never jumps
 * when it appears. Closing it stores a flag; a tiny script in the site layout
 * (BAR_HIDE_SCRIPT in src/lib/announcement.ts) reads that flag before the page
 * paints and hides the strip, so people who closed it never see it flash back.
 *
 * It also runs an A/B test. Every version is in the HTML, and the same script
 * picks one per visitor (kept in their browser), so CSS shows only that one
 * from the first paint. Each version is hidden on the page it points to, so
 * nobody is told about the story they are already reading.
 */
type Variant = {
  id: BarVariant;
  href: string;
  /** Pages where this version would only repeat what is already on screen. */
  hideOn: string[];
  long: string;
  short: string;
  cta: string;
  shortCta: string;
};

const HUB = "/mp-expenses-scotland";

const VARIANTS: Variant[] = [
  {
    id: "hotels",
    href: HUB,
    hideOn: ["/blog/zubir-ahmed-mp-london-hotels-glasgow"],
    long: "You paid £67,519 for one Glasgow MP's London hotels.",
    short: "You paid £67,519 for one MP's London hotels.",
    cta: "Is your MP on the list?",
    shortCta: "Is yours on the list?",
  },
  {
    id: "energy",
    href: HUB,
    hideOn: ["/blog/kilmarnock-mp-23437-electricity-bill"],
    long: "You paid £23,437 for one MP's energy bill.",
    short: "You paid £23,437 for one MP's energy bill.",
    cta: "Is your MP on the list?",
    shortCta: "Is yours on the list?",
  },
  {
    id: "receipts",
    href: `${HUB}/search`,
    hideOn: [],
    long: "See every claim your MP made, from hotels to TV licences.",
    short: "See every claim your MP made.",
    cta: "Check by postcode",
    shortCta: "Check by postcode",
  },
  {
    id: "flats",
    href: "/blog/msp-edinburgh-flats-commuter-belt",
    hideOn: ["/blog/msp-edinburgh-flats-commuter-belt"],
    long: "You paid £623,696 for 36 MSPs' Edinburgh flats.",
    short: "You paid £623,696 for 36 MSPs' flats.",
    cta: "Is yours one of them?",
    shortCta: "Is yours one?",
  },
  {
    id: "buys",
    href: "/blog/scottish-mp-msp-expenses-what-it-could-buy",
    hideOn: ["/blog/scottish-mp-msp-expenses-what-it-could-buy"],
    long: "You paid £6.64m for a year of MP and MSP perks.",
    short: "You paid £6.64m for a year of MP and MSP perks.",
    cta: "See what it could have bought",
    shortCta: "See what it could buy",
  },
];

/** The whole strip is hidden on the expenses hub and Receipt Finder. */
const HIDE_ON = [HUB];

function currentVariant(): BarVariant | null {
  const v = document.documentElement.getAttribute("data-bar-variant");
  return VARIANTS.some((x) => x.id === v) ? (v as BarVariant) : null;
}

export default function AnnouncementBar() {
  const pathname = usePathname() || "/";
  const hidden = HIDE_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const skip = VARIANTS.filter((v) => v.hideOn.includes(pathname)).map((v) => v.id);

  // One "seen" per version per visit, sent after the analytics scripts load.
  useEffect(() => {
    if (hidden) return;
    const timer = window.setTimeout(() => {
      const v = currentVariant();
      if (!v || skip.includes(v) || document.documentElement.hasAttribute("data-bar-closed")) return;
      if (typeof window.clarity === "function") window.clarity("set", "banner_variant", v);
      const seenKey = `sc-bar-seen-${v}`;
      try {
        if (window.sessionStorage.getItem(seenKey)) return;
        window.sessionStorage.setItem(seenKey, "1");
      } catch {
        // Private browsing: count it anyway.
      }
      trackEvent(`banner_view_${v}`, { page_path: pathname, banner_variant: v });
    }, 4000);
    return () => window.clearTimeout(timer);
    // skip is derived from pathname, so pathname covers it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hidden]);

  if (hidden) return null;

  function click(id: BarVariant) {
    trackEvent("mp_expenses_banner_click", { page_path: pathname, banner_variant: id });
    trackEvent(`banner_click_${id}`, { page_path: pathname, banner_variant: id });
  }

  function close() {
    const v = currentVariant();
    trackEvent("mp_expenses_banner_close", { page_path: pathname, banner_variant: v });
    if (v) trackEvent(`banner_close_${v}`, { page_path: pathname, banner_variant: v });
    document.documentElement.setAttribute("data-bar-closed", "");
    try {
      window.localStorage.setItem(BAR_STORAGE_KEY, "closed");
    } catch {
      // Private browsing: it simply comes back next visit.
    }
  }

  return (
    <aside
      aria-label="New on Scotland Counted"
      data-skip={skip.join(" ")}
      className="announce-top no-print relative z-[60] text-white"
    >
      <div className="mx-auto flex max-w-[1320px] items-center gap-2 px-3 py-2 sm:gap-3 sm:px-5">
        {VARIANTS.filter((v) => !skip.includes(v.id)).map((v) => (
          <Link
            key={v.id}
            href={v.href}
            data-variant={v.id}
            onClick={() => click(v.id)}
            className="announce-variant group min-w-0 flex-1 items-center justify-center gap-2.5 text-white no-underline sm:gap-3"
          >
            <span className="hidden shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11.5px] font-[800] uppercase tracking-[0.07em] text-[#b4152b] sm:inline">
              New
            </span>
            <span className="ui min-w-0 text-[14px] font-[600] leading-[1.3] sm:text-[15.5px]">
              <span className="sm:hidden">
                {v.short} <span className="font-[800]">{v.shortCta}</span>
              </span>
              <span className="hidden sm:inline">
                {v.long} <span className="font-[800]">{v.cta}</span>
              </span>
            </span>
            <span
              aria-hidden="true"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[15px] font-[800] text-[#b4152b] transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        ))}
        <button
          type="button"
          onClick={close}
          aria-label="Close this message"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
