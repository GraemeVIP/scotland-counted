"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { ScrollProgress } from "@/components/Motion";
import { PRIMARY } from "@/lib/data/navigation";
import { DesktopMenu, MobileMenu } from "@/components/SiteMenu";

export const NAV = PRIMARY;

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`ui font-[800] tracking-[-0.04em] leading-none ${className}`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      Scotland<span className="text-[var(--action)]">Counted</span>
    </span>
  );
}

function SearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-command"))}
      aria-label="Find your area, or search the site"
      className="group min-h-11 w-11 shrink-0 flex items-center justify-center gap-2.5 rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule-strong)] hover:border-[var(--brand)] transition-colors px-0 py-2.5 xl:w-auto xl:min-w-[150px] xl:justify-start xl:px-3.5 2xl:min-w-[230px]"
      style={{ boxShadow: "var(--shadow-1)" }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="text-[var(--brand)]" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.8-3.8" />
      </svg>
      <span className="ui hidden xl:block whitespace-nowrap text-[15px] font-[560] text-[var(--muted)] group-hover:text-[var(--ink)] transition-colors">
        Search site or area
      </span>
      {/*
        No ⌘K badge. It is Mac-only notation, and on Windows, Linux, Android and
        iOS it is either wrong or meaningless — a keyboard hint that most
        visitors cannot act on. The shortcut still works, and still accepts
        Ctrl+K as well as ⌘K for anyone who tries it.
      */}
    </button>
  );
}

function ThemeToggle() {
  function toggle() {
    const applied = document.documentElement.getAttribute("data-theme") as
      | "light"
      | "dark"
      | null;
    const current =
      applied ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark"
      className="w-10 h-10 sm:w-11 sm:h-11 inline-flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [browsePath, setBrowsePath] = useState<string | null>(null);
  const open = menuPath === pathname;
  /** Panel is only open for the path it was opened on, so navigating closes it. */
  const browse = browsePath === pathname;

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /*
   * Dismiss the desktop panel the way every other menu on the web does:
   * click away from it, or press Escape. Requiring a second click on the
   * button that opened it is a dead end — nothing on screen says that is the
   * only way out, so the panel reads as stuck.
   *
   * The panel renders inside <header>, so containment on that one node covers
   * the trigger too: clicking the button lands inside, this handler stays out
   * of the way, and the button's own toggle closes it without the two fighting.
   *
   * pointerdown rather than click, so it closes on the press instead of the
   * release, and a drag that starts inside the panel and ends outside does not
   * count as clicking away.
   */
  useEffect(() => {
    if (!browse) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setBrowsePath(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBrowsePath(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [browse]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 no-print transition-colors ${
        scrolled
          ? "bg-[var(--paper)]/94 backdrop-blur-md border-b border-[var(--rule)] shadow-[var(--shadow-1)]"
          : "bg-[var(--surface)] border-b border-[var(--rule)] shadow-[var(--shadow-1)] xl:bg-[var(--paper)] xl:border-transparent xl:shadow-none"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-14 flex items-center gap-2 sm:gap-6 2xl:gap-8 h-[72px] sm:h-[68px]">
        <Link
          href="/"
          className="shrink-0"
          onClick={() => setMenuPath(null)}
        >
          <Wordmark className="text-[17px] min-[390px]:text-[19px]" />
        </Link>

        <nav aria-label="Main" className="hidden xl:flex items-center gap-3 xl:gap-4 2xl:gap-5 ml-2">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`ui relative whitespace-nowrap text-[15px] font-[620] tracking-[-0.005em] py-1 transition-colors ${
                  active ? "text-[var(--ink)]" : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
              >
                {n.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--action)]" />
                )}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setBrowsePath(browse ? null : pathname)}
            aria-expanded={browse}
            aria-controls="browse-panel"
            className="ui relative hidden xl:inline-flex whitespace-nowrap text-[15px] font-[620] tracking-[-0.005em] py-1 transition-colors text-[var(--ink-2)] hover:text-[var(--ink)] items-center gap-1.5"
          >
            Everything
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className={`transition-transform ${browse ? "rotate-180" : ""}`}>
              <path d="m5 8 7 7 7-7" />
            </svg>
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2.5">
          <SearchButton />
          <ThemeToggle />
          <Link
            href="/find-my-mp-and-msp"
            className="btn btn-primary hidden sm:inline-flex whitespace-nowrap !px-5 !py-2.5 !text-[15px]"
          >
            Email your MP/MSP
          </Link>
          <button
            type="button"
            className="xl:hidden w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow-1)] transition-colors hover:border-[var(--brand)]"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
            onClick={() => setMenuPath(open ? null : pathname)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </div>
      <ScrollProgress />

      {browse && <DesktopMenu onNavigate={() => setBrowsePath(null)} />}

      {open && <MobileMenu onNavigate={() => setMenuPath(null)} />}
    </header>
  );
}

export function Footer() {
  const compactLinks = [
    ...PRIMARY,
    { href: "/data", label: "Data" },
    { href: "/methods", label: "Sources" },
    { href: "/faq", label: "Questions" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
  ];

  return (
    <footer className="mt-20 no-print bg-[var(--deep)] text-[var(--deep-ink)]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-8 sm:py-9">
        <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.7fr)] lg:items-center">
          <div>
            <Wordmark className="text-[22px]" />
            <p className="text-[15px] leading-[1.5] opacity-72 max-w-[42ch] mt-2.5">
              A free, independent guide to poverty, work and living costs in Scotland — with local
              facts, plain-English explanations and a way to contact the people who decide.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:justify-self-end">
            <ul className="flex flex-wrap gap-x-5 gap-y-2.5 ui text-[15px] font-[620]">
              {compactLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="opacity-76 hover:opacity-100 transition-opacity">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/browse" className="text-[var(--deep-ink)] underline underline-offset-4">
                  Every page →
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/*
          The two calculators, given their own row.
          Both were reachable only through the "Everything" menu, which renders
          on click and so contributes nothing a crawler can follow — between
          them they had a single inbound link on the whole site. They are the
          most useful things here for someone who arrived with a practical
          question, so they get a permanent home instead.
        */}
        <div className="mt-6 pt-5 border-t border-current/15 flex flex-wrap items-center gap-x-4 gap-y-3">
          <p className="kicker text-[var(--action)]">Free tools</p>
          {[
            { href: "/take-home-pay-calculator-scotland", label: "Take-home pay calculator" },
            { href: "/council-tax-bands-scotland", label: "Council tax by band" },
            { href: "/poverty-in-scotland-quiz", label: "Guess the figure" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="ui rounded-[var(--r-pill)] border border-current/30 px-4 py-2 text-[15px] font-[680] transition-colors hover:bg-white/10"
            >
              {t.label}
              <span aria-hidden="true"> →</span>
            </Link>
          ))}

          {/*
            Pushed right so it reads as its own thing rather than a fourth
            tool. The mark is inline SVG on currentColor: the footer is a dark
            slab, and a hosted PNG would need a second file per theme and would
            still be one more request for a 24px glyph.
          */}
          {site.social.x && (
            <a
              href={`https://x.com/${site.social.x}`}
              rel="noopener noreferrer me"
              target="_blank"
              className="ui ml-auto inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-current/30 px-4 py-2 text-[15px] font-[680] transition-colors hover:bg-white/10"
            >
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow @{site.social.x}
            </a>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-current/15 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 text-[15px] leading-[1.5] opacity-68">
          <p>
            Data checked {site.dataUpdated} · ONS, DWP, Scottish Government and named research
          </p>
          <p className="sm:text-right">
            Published independently by {site.author.name} ·{" "}
            <a href={site.organisation.url} className="underline underline-offset-3 hover:opacity-100">
              {site.organisation.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
