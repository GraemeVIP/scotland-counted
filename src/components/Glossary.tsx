"use client";

import { useEffect, useRef, useState } from "react";
import { getTerm } from "@/lib/data/glossary";

/**
 * An inline term the reader can tap for a plain explanation.
 * Keyboard accessible, dismissable with Escape or an outside click,
 * and it repositions itself to stay on screen.
 */
export function G({ t, children }: { t: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const term = getTerm(t);

  useEffect(() => {
    if (!open) return;
    function place() {
      const btn = btnRef.current;
      const box = boxRef.current;
      if (!btn || !box) return;
      const r = btn.getBoundingClientRect();
      const bw = box.offsetWidth;
      const bh = box.offsetHeight;
      let left = r.left + window.scrollX;
      const maxLeft = window.scrollX + document.documentElement.clientWidth - bw - 12;
      if (left > maxLeft) left = maxLeft;
      if (left < window.scrollX + 12) left = window.scrollX + 12;
      let top = r.bottom + window.scrollY + 8;
      if (r.bottom + bh + 16 > window.innerHeight && r.top > bh + 16) {
        top = r.top + window.scrollY - bh - 8;
      }
      setPos({ top, left });
    }
    place();
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close);
    };
  }, [open]);

  if (!term) return <>{children}</>;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="gl"
        aria-expanded={open}
        aria-controls={open ? `glossary-${term.id}` : undefined}
        aria-label={`${typeof children === "string" ? children : term.term} — what this means`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {children}
      </button>
      {open && (
        <div
          ref={boxRef}
          id={`glossary-${term.id}`}
          role="dialog"
          aria-labelledby={`glossary-${term.id}-title`}
          aria-describedby={`glossary-${term.id}-description`}
          className="glossbox"
          style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            className="absolute top-1.5 right-2 text-[var(--muted)] hover:text-[var(--ink)] text-[17px] leading-none p-1"
            onClick={() => {
              setOpen(false);
              btnRef.current?.focus();
            }}
          >
            &times;
          </button>
          <div id={`glossary-${term.id}-title`} className="ui text-[15px] font-[680] text-[var(--brand)] mb-1.5">
            {term.term}
          </div>
          <div id={`glossary-${term.id}-description`} className="text-[var(--ink)]">{term.def}</div>
          {term.tech && (
            <div className="mt-2.5 pt-2.5 border-t border-[var(--rule)] text-[15px]">
              {term.tech}
            </div>
          )}
        </div>
      )}
    </>
  );
}
