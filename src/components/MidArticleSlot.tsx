"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Moves its children into the middle of an article: just before the section
 * heading halfway down. The article bodies are written as plain components,
 * so the template cannot reach inside them on the server; this places one
 * small "next step" card where readers are, rather than only at the end.
 *
 * Nothing renders on the server, so there is no mismatch, and the card lands
 * well below the first screen, so the page does not jump while it loads.
 * Short pages (fewer than three sections) get nothing.
 */
export default function MidArticleSlot({ containerId, children }: { containerId: string; children: ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const headings = Array.from(container.querySelectorAll("h2")).filter(
      (h) => !h.closest("details, table, aside, nav, figure"),
    );
    if (headings.length < 3) return;
    const anchor = headings[Math.floor(headings.length / 2)];
    const slot = document.createElement("div");
    slot.className = "mid-article-nudge my-10";
    anchor.parentNode?.insertBefore(slot, anchor);
    // Mounting the portal target is the point of this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTarget(slot);
    return () => {
      slot.remove();
    };
  }, [containerId]);

  return target ? createPortal(children, target) : null;
}
