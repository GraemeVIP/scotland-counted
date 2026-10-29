"use client";

import Link from "@/components/IntentLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { ScrollProgress } from "@/components/Motion";
import { ABOUT, EVIDENCE, EXPLAINERS, HUBS, PRIMARY, hubBarColor, hubForPath, type HubId } from "@/lib/data/navigation";
import { HubPanel, MobileMenu } from "@/components/SiteMenu";
import { BrandLogo } from "@/components/BrandLogo";

export const NAV = PRIMARY;

function Wordmark({ height = 28, priority = false, sizeClass }: { height?: number; priority?: boolean; sizeClass?: string }) {
  return <BrandLogo tone="on-dark" height={height} priority={priority} sizeClass={sizeClass} />;
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
  const [panel, setPanel] = useState<{ path: string; hub: HubId } | null>(null);
  const open = menuPath === pathname;
  /** A panel is only open for the path it was opened on, so navigating closes it. */
  const openHub = panel && panel.path === pathname ? panel.hub : null;
  const browse = openHub !== null;
  const closePanel = () => setPanel(null);
  const currentHub = hubForPath(pathname);

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
      if (!headerRef.current?.contains(event.target as Node)) setPanel(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
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
          <Wordmark height={32} priority sizeClass="h-[26px] sm:h-[29px] xl:h-[28px] min-[1400px]:h-[32px]" />
        </Link>

        <nav aria-label="Main" className="hidden xl:flex items-center gap-0.5 mx-auto">
          {HUBS.map((hub) => {
            const expanded = openHub === hub.id;
            const here = currentHub === hub.id;
            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => setPanel(expanded ? null : { path: pathname, hub: hub.id })}
                aria-expanded={expanded}
                aria-controls="hub-panel"
                className={`ui inline-flex items-center gap-1 whitespace-nowrap text-[14px] font-[500] h-10 px-2 min-[1400px]:gap-1.5 min-[1400px]:px-2.5 rounded-[var(--r-pill)] transition-colors ${
                  expanded ? "bg-white/16 text-white" : here ? "text-white hover:bg-white/10" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: hubBarColor(hub.id) }} />
                {hub.label}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className={`transition-transform ${expanded ? "rotate-180" : ""}`}>
                  <path d="m5 8 7 7 7-7" />
                </svg>
              </button>
            );
          })}
          <Link
            href={EXPLAINERS.href}
            aria-current={pathname === EXPLAINERS.href ? "page" : undefined}
            className={`ui inline-flex items-center whitespace-nowrap text-[14px] font-[500] h-10 px-2 min-[1400px]:px-2.5 rounded-[var(--r-pill)] transition-colors ${
              pathname.startsWith(EXPLAINERS.href) ? "text-white bg-white/12" : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            {EXPLAINERS.label}
          </Link>
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
        The section panel floats over the page rather than pushing it down, and
        a dimmed backdrop behind it closes it when clicked. Both sit inside the
        header so the click away handler counts the panel as inside.
      */}
      {openHub && (
        <>
          <div aria-hidden="true" onClick={closePanel} className="hidden xl:block fixed inset-0 -z-10 bg-[rgba(4,17,47,0.42)]" />
          <div className="absolute inset-x-0 top-full px-3 sm:px-5">
            <HubPanel hubId={openHub} onNavigate={closePanel} />
          </div>
        </>
      )}
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
      <MobileMenu pathname={pathname} onNavigate={() => setMenuPath(null)} onClose={() => setMenuPath(null)} />
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
  /* Each section's first links, then the pages that make the site checkable. */
  const columns = [
    ...HUBS.map((hub) => ({
      title: hub.label,
      color: hubBarColor(hub.id),
      href: hub.href,
      items: hub.groups.flatMap((group) => group.items).slice(0, 5),
    })),
    { title: "Evidence", color: undefined, href: "/methods", items: EVIDENCE },
  ];

  return (
    <footer className="saltire-hero mt-24 no-print rounded-t-[var(--r-l)]" style={{ background: "radial-gradient(60% 90% at 100% 0%, rgba(31,111,255,0.28), transparent 60%), var(--deep)" }}>
      <div className="beams opacity-40" aria-hidden="true">
        <div className="beam a" />
        <div className="beam b" />
      </div>
      <div className="max-w-[1232px] mx-auto px-5 sm:px-8 lg:px-14 pt-14 pb-10">
        <div className="grid gap-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
            <Link href="/" className="text-white" aria-label="Scotland Counted home">
              <Wordmark height={34} />
            </Link>
            <p className="mt-4 max-w-[52ch] text-[15.5px] leading-[1.6] text-[var(--deep-muted)]">
              Independent public data for Scotland. What the numbers mean where you live, who decides,
              and how to reach them. Every figure linked to where it came from.
            </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
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

          <nav aria-label="Footer" className="grid gap-x-6 gap-y-9 border-t border-white/10 pt-9 grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
            {columns.map((column) => (
              <div key={column.title}>
                <Link href={column.href} className="ui inline-flex items-center gap-2 text-[15px] font-[620] text-white no-underline">
                  {column.color && <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: column.color }} />}
                  {column.title}
                </Link>
                <ul className="mt-3.5 grid gap-2">
                  {column.items.map((item) => (
                    <li key={item.href + item.label}>
                      <Link href={item.href} className="ui block text-[14.5px] leading-[1.35] text-white/80 transition-colors hover:text-white">
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
            {ABOUT.map((item) => (
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
