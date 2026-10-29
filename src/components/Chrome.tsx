"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { ScrollProgress } from "@/components/Motion";
import { PRIMARY, SECTIONS } from "@/lib/data/navigation";
import { DesktopMenu, MobileMenu } from "@/components/SiteMenu";

export const NAV = PRIMARY;

/** The mark: a Saltire blue tile with the cross in white. */
export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id="sc-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b86ff" />
          <stop offset="1" stopColor="#004aa0" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#sc-mark)" />
      <path d="M9.5 9.5 22.5 22.5M22.5 9.5 9.5 22.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`ui inline-flex items-center gap-2.5 font-[600] tracking-[-0.025em] leading-none ${className}`}>
      <LogoMark />
      Scotland Counted
    </span>
  );
}

function SearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-command"))}
      aria-label="Find your area, or search the site"
      className="group h-10 w-10 shrink-0 flex items-center justify-center rounded-[var(--r-pill)] border border-white/20 text-white transition-colors hover:bg-white/10"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.8-3.8" />
      </svg>
      {/*
        No ⌘K badge. It is Mac-only notation, and on Windows, Linux, Android and
        iOS it is either wrong or meaningless, a keyboard hint that most
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
      className="w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-[var(--r-pill)] border border-white/20 text-white transition-colors hover:bg-white/10"
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
   * button that opened it is a dead end, nothing on screen says that is the
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
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => {
      if (mq.matches) setMenuPath(null);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
    <>
    <header
      ref={headerRef}
      className="sticky top-0 z-50 no-print px-3 pt-3 sm:px-5"
    >
      <div
        className={`max-w-[1320px] mx-auto flex items-center gap-2 sm:gap-3 h-[60px] rounded-[var(--r-pill)] pl-4 pr-2 text-white border border-white/12 transition-shadow ${
          scrolled ? "shadow-[0_14px_40px_-14px_rgba(0,12,40,0.55)]" : "shadow-[0_10px_30px_-16px_rgba(0,12,40,0.45)]"
        }`}
        style={{
          background: "rgba(3, 18, 52, 0.8)",
          WebkitBackdropFilter: "blur(18px) saturate(160%)",
          backdropFilter: "blur(18px) saturate(160%)",
        }}
      >
        <Link
          href="/"
          className="shrink-0 text-white"
          onClick={() => setMenuPath(null)}
          aria-label="Scotland Counted home"
        >
          <Wordmark className="text-[16px] min-[390px]:text-[17px]" />
        </Link>

        <nav aria-label="Main" className="hidden xl:flex items-center gap-0.5 mx-auto">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`ui whitespace-nowrap text-[14.5px] font-[500] px-3 py-2 rounded-[var(--r-pill)] transition-colors ${
                  active ? "text-white bg-white/12" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setBrowsePath(browse ? null : pathname)}
            aria-expanded={browse}
            aria-controls="browse-panel"
            aria-label="Everything on this site"
            className="ui inline-flex items-center gap-1.5 whitespace-nowrap text-[14.5px] font-[500] px-3 py-2 rounded-[var(--r-pill)] text-white/80 hover:text-white hover:bg-white/10 aria-expanded:bg-white/12 aria-expanded:text-white transition-colors"
          >
            Everything
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className={`transition-transform ${browse ? "rotate-180" : ""}`}>
              <path d="m5 8 7 7 7-7" />
            </svg>
          </button>
        </nav>

        <div className="ml-auto xl:ml-0 flex items-center gap-1.5 sm:gap-2">
          <SearchButton />
          <ThemeToggle />
          <Link
            href="/email-your-mp-and-msp"
            className="ui hidden sm:inline-flex items-center whitespace-nowrap rounded-[var(--r-pill)] bg-white px-4 h-10 text-[14.5px] font-[580] text-[#00336f] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_6px_18px_-8px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-px"
          >
            Email your MP/MSP
          </Link>
          <button
            type="button"
            className="xl:hidden w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-[var(--r-pill)] border border-white/20 text-white transition-colors hover:bg-white/10"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
            onClick={() => setMenuPath(open ? null : pathname)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>
      <ScrollProgress />

      {/*
        The desktop panel is in normal flow directly under the header bar, so
        it belongs inside the header and is unaffected by what follows.
      */}
      {browse && <DesktopMenu onNavigate={() => setBrowsePath(null)} />}
    </header>

    {/*
      The mobile sheet is a sibling of the header, not a child, and that is
      load-bearing rather than tidiness. (It now covers the header entirely
      and carries its own close button, see the note in SiteMenu.tsx.)

      Once scrolled, the header gains backdrop-blur-md. An element with a
      backdrop-filter becomes the containing block for its position: fixed
      descendants, so the sheet, inset from the top by the header's own height
, stopped resolving against the viewport and started resolving against a
      73px-tall header. top: 72px against 73px of height leaves a sheet one
      pixel tall. It opened, the button switched to a cross, and nothing
      appeared, which read as the menu refusing to open at all.

      At the very top of the page there is no blur, so it worked there and only
      there. That is also why scrolling back up "fixed" it: the blur went away
      and the sheet snapped back to full height.

      Rendered outside the header, fixed resolves against the viewport again
      whatever the header is doing.
    */}
    {open && (
      <MobileMenu onNavigate={() => setMenuPath(null)} onClose={() => setMenuPath(null)} />
    )}
    </>
  );
}

export function Footer() {
  const tools = [
    { href: "/take-home-pay-calculator-scotland", label: "Take home pay calculator" },
    { href: "/council-tax-bands-scotland", label: "Council tax by band" },
    { href: "/email-your-mp-and-msp", label: "Email your MP and MSP" },
    { href: "/poverty-in-scotland-quiz", label: "Guess the figure" },
  ];
  const legal = [
    { href: "/about", label: "About" },
    { href: "/methods", label: "Methods" },
    { href: "/corrections", label: "Corrections" },
    { href: "/privacy", label: "Privacy" },
    { href: "/accessibility", label: "Accessibility" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="saltire-hero mt-24 no-print rounded-t-[var(--r-l)]" style={{ background: "radial-gradient(60% 90% at 100% 0%, rgba(31,111,255,0.28), transparent 60%), var(--deep)" }}>
      <div className="beams opacity-40" aria-hidden="true">
        <div className="beam a" />
        <div className="beam b" />
      </div>
      <div className="max-w-[1232px] mx-auto px-5 sm:px-8 lg:px-14 pt-14 pb-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)]">
          <div>
            <Link href="/" className="text-white" aria-label="Scotland Counted home">
              <Wordmark className="text-[19px]" />
            </Link>
            <p className="mt-4 max-w-[38ch] text-[15.5px] leading-[1.6] text-[var(--deep-muted)]">
              Independent public data for Scotland. What the numbers mean where you live, who decides,
              and how to reach them. Every figure linked to where it came from.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {tools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="ui rounded-[var(--r-pill)] border border-white/15 bg-white/5 px-3.5 py-2 text-[14px] font-[500] text-white transition-colors hover:bg-white/12"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          <nav aria-label="Footer" className="grid gap-x-8 gap-y-9 grid-cols-2 md:grid-cols-3">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="kicker text-[var(--deep-muted)]">{section.title}</p>
                <ul className="mt-4 grid gap-2.5">
                  {section.items.slice(0, 5).map((item) => (
                    <li key={item.href + item.label}>
                      <Link href={item.href} className="ui text-[15px] text-white/85 transition-colors hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-[14.5px] text-[var(--deep-muted)]">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="ui transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/browse" className="ui text-white underline underline-offset-4 decoration-white/40">
                Every page
              </Link>
            </li>
          </ul>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>
              Published independently by {site.author.name} ·{" "}
              <a href={site.organisation.url} className="text-white/90 underline underline-offset-3 decoration-white/30 hover:text-white">
                {site.organisation.name}
              </a>
            </p>
            {site.social.x && (
              <a
                href={`https://x.com/${site.social.x}`}
                rel="noopener noreferrer me"
                target="_blank"
                className="ui inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-white/15 px-3.5 py-1.5 text-white transition-colors hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @{site.social.x}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
