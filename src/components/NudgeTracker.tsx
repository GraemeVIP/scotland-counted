"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/*
 * Counts how often each "read more" nudge is seen and clicked, so we can tell
 * which ones actually move people on to another page.
 *
 * Every nudge's outer element carries data-nudge="<name>" (KeepReading, the
 * expenses rail, the "your MP" cards, next step strips and so on). This one
 * listener covers them all, including nudges that only appear after a tool
 * gives its answer. It sends:
 *   nudge_view_<name>  once per page, when half the nudge is on screen
 *   nudge_click_<name> when a link inside it is clicked
 * Both go to GA4 and Clarity through trackEvent.
 */
export default function NudgeTracker() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    const seen = new Set<string>();
    const watched = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const name = (e.target as HTMLElement).dataset.nudge;
          io.unobserve(e.target);
          if (!name || seen.has(name)) continue;
          seen.add(name);
          trackEvent(`nudge_view_${name}`, { nudge: name, page_path: pathname });
        }
      },
      { threshold: 0.5 },
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-nudge]").forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        io.observe(el);
      });
    };
    scan();
    // Nudges inside tool answers appear later, after a postcode lookup.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    const onClick = (ev: MouseEvent) => {
      const link = (ev.target as Element | null)?.closest?.("a[href]");
      const box = link?.closest<HTMLElement>("[data-nudge]");
      const name = box?.dataset.nudge;
      if (!link || !name) return;
      const to = link.getAttribute("href") || "";
      trackEvent("nudge_click", { nudge: name, page_path: pathname, link_to: to });
      trackEvent(`nudge_click_${name}`, { nudge: name, page_path: pathname, link_to: to });
    };
    document.addEventListener("click", onClick, true);

    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("click", onClick, true);
    };
  }, [pathname]);

  return null;
}
