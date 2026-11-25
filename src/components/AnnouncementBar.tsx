"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BAR_STORAGE_KEY, type BarVariant } from "@/lib/announcement";
import { trackEvent } from "@/lib/analytics";

/*
 * A bold strip across the very top of every page, pointing visitors to free
 * Modern Studies lessons, local postcode tools, council numbers and charity
 * data help. It is part of the first render, so the page never jumps when it
 * appears. Closing it stores a flag; a tiny script in the site layout
 * (BAR_HIDE_SCRIPT in src/lib/announcement.ts) reads that flag before the page
 * paints and hides the strip, so people who closed it never see it flash back.
 *
 * It also runs an A/B test. Every version is in the HTML, and the same script
 * picks one per visitor (kept in their browser), so CSS shows only that one
 * from the first paint. Each version is hidden on the page it points to, so
 * nobody is told about the page they are already reading.
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

const VARIANTS: Variant[] = [
  {
    id: "lessons",
    href: "/modern-studies-teaching-resources",
    hideOn: ["/modern-studies-teaching-resources", "/modern-studies"],
    long: "Free Modern Studies classroom lessons using real Scottish and global data.",
    short: "Free Modern Studies classroom lessons.",
    cta: "See all 8 lessons",
    shortCta: "See lessons",
  },
  {
    id: "postcode",
    href: "/simd-postcode-checker",
    hideOn: ["/simd-postcode-checker"],
    long: "Check your Scottish postcode's official SIMD rank and council area.",
    short: "Check your Scottish postcode's SIMD rank.",
    cta: "Check your postcode",
    shortCta: "Check postcode",
  },
  {
    id: "councils",
    href: "/councils",
    hideOn: ["/councils"],
    long: "See how all 32 Scottish councils spend and perform.",
    short: "See your Scottish council budget.",
    cta: "Check your council",
    shortCta: "Check council",
  },
  {
    id: "charities",
    href: "/for-organisations",
    hideOn: ["/for-organisations"],
    long: "Free local charts and data packs for Scottish charities.",
    short: "Free data help for Scottish charities.",
    cta: "See how we help",
    shortCta: "Get data help",
  },
];

/** Pages where the whole strip stays hidden. */
const HIDE_ON: string[] = [];

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
    trackEvent("announcement_banner_click", { page_path: pathname, banner_variant: id });
    trackEvent(`banner_click_${id}`, { page_path: pathname, banner_variant: id });
  }

  function close() {
    const v = currentVariant();
    trackEvent("announcement_banner_close", { page_path: pathname, banner_variant: v });
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
      aria-label="Featured on Scotland Counted"
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
            <span className="hidden shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11.5px] font-[800] uppercase tracking-[0.07em] text-[#074f48] sm:inline">
              Free
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
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[15px] font-[800] text-[#074f48] transition-transform group-hover:translate-x-0.5"
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
