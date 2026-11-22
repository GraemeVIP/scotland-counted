"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BAR_STORAGE_KEY } from "@/lib/announcement";
import { trackEvent } from "@/lib/analytics";

/*
 * A bold strip across the very top of every page, pointing visitors at the
 * MP expenses pages. It is part of the first render, so the page never jumps
 * when it appears. Closing it stores a flag; a tiny script in the site layout
 * (BAR_HIDE_SCRIPT in src/lib/announcement.ts) reads that flag before the page paints and hides the
 * strip, so people who closed it never see it flash back.
 *
 * To run a new message later, change the copy and bump BAR_STORAGE_KEY so people
 * who closed the old one see the new one.
 */
const HREF = "/mp-expenses-scotland/search";
const HIDE_ON = ["/mp-expenses-scotland"];

export default function AnnouncementBar() {
  const pathname = usePathname() || "/";
  if (HIDE_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  function close() {
    trackEvent("mp_expenses_banner_close", { page_path: pathname });
    document.documentElement.setAttribute("data-bar-closed", "");
    try {
      window.localStorage.setItem(BAR_STORAGE_KEY, "closed");
    } catch {
      // Private browsing: it simply comes back next visit.
    }
  }

  return (
    <aside aria-label="New on Scotland Counted" className="announce-top no-print relative z-[60] text-white">
      <div className="mx-auto flex max-w-[1320px] items-center gap-2 px-3 py-2 sm:gap-3 sm:px-5">
        <Link
          href={HREF}
          onClick={() => trackEvent("mp_expenses_banner_click", { page_path: pathname })}
          className="group flex min-w-0 flex-1 items-center justify-center gap-2.5 text-white no-underline sm:gap-3"
        >
          <span className="hidden shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11.5px] font-[800] uppercase tracking-[0.07em] text-[#b4152b] sm:inline">
            New
          </span>
          <span className="ui min-w-0 text-[14px] font-[600] leading-[1.3] sm:text-[15.5px]">
            <span className="sm:hidden">MPs billed you £10,754 for TV licences &amp; £37k for hotels. Search 20,879 receipts</span>
            <span className="hidden sm:inline">
              Scottish MPs billed you £10,754 for TV licences, £37,359 for London hotels and £3,090
              for broadband. <span className="font-[800]">Search all 20,879 receipts</span>
            </span>
          </span>
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[15px] font-[800] text-[#b4152b] transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
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
