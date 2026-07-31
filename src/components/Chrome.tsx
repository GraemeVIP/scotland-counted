"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { ScrollProgress } from "@/components/Motion";
import NewsletterSignup from "@/components/NewsletterSignup";
import { PRIMARY, SECTIONS } from "@/lib/data/navigation";

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
      className="group min-h-11 shrink-0 flex items-center gap-2.5 rounded-full bg-[var(--surface)] border border-[var(--rule-strong)] hover:border-[var(--brand)] transition-colors px-4 py-2.5"
      style={{ boxShadow: "var(--shadow-1)" }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="text-[var(--brand)]" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.8-3.8" />
      </svg>
      <span className="ui hidden md:block whitespace-nowrap text-[15px] font-[620] text-[var(--ink-2)] group-hover:text-[var(--ink)] transition-colors">
        Find your area
      </span>
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
      className="w-11 h-11 inline-flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 no-print transition-colors ${
        scrolled
          ? "bg-[var(--paper)]/94 backdrop-blur-md border-b border-[var(--rule)] shadow-[var(--shadow-1)]"
          : "bg-[var(--paper)] border-b border-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 flex items-center gap-8 h-[68px]">
        <Link
          href="/"
          className="shrink-0"
          aria-label={`${site.name}, home`}
          onClick={() => setMenuPath(null)}
        >
          <Wordmark className="text-[19px]" />
        </Link>

        <nav aria-label="Main" className="hidden xl:flex items-center gap-5 ml-2">
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
            className="ui relative whitespace-nowrap text-[15px] font-[620] tracking-[-0.005em] py-1 transition-colors text-[var(--ink-2)] hover:text-[var(--ink)] inline-flex items-center gap-1.5"
          >
            Everything
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className={`transition-transform ${browse ? "rotate-180" : ""}`}>
              <path d="m5 8 7 7 7-7" />
            </svg>
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <SearchButton />
          <ThemeToggle />
          <Link
            href="/take-action"
            className="btn btn-primary hidden sm:inline-flex whitespace-nowrap !px-5 !py-2.5 !text-[15px]"
          >
            Email your MP/MSP
          </Link>
          <button
            type="button"
            className="xl:hidden w-11 h-11 inline-flex items-center justify-center text-[var(--ink-2)]"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
            onClick={() => setMenuPath(open ? null : pathname)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </div>
      <ScrollProgress />

      {browse && (
        <div
          id="browse-panel"
          className="hidden xl:block border-t border-[var(--rule)] bg-[var(--surface)] shadow-[var(--shadow-2)]"
        >
          <div className="max-w-[1440px] mx-auto px-14 py-9 grid grid-cols-4 gap-8">
            {SECTIONS.map((sec) => (
              <div key={sec.title}>
                <p className="ui text-[15px] font-[750] text-[var(--action)] mb-1.5">{sec.title}</p>
                <p className="text-[14.5px] leading-[1.45] text-[var(--muted)] mb-3.5">{sec.intro}</p>
                <ul className="space-y-2.5">
                  {sec.items.map((n) => (
                    <li key={n.href}>
                      <Link href={n.href} className="group block no-underline">
                        <span className="ui text-[15.5px] font-[640] text-[var(--ink)] group-hover:text-[var(--action)] transition-colors">
                          {n.label}
                        </span>
                        {n.blurb && (
                          <span className="block text-[14px] leading-[1.4] text-[var(--ink-2)] mt-0.5">
                            {n.blurb}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--rule)] bg-[var(--surface-2)]">
            <div className="max-w-[1440px] mx-auto px-14 py-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[15px] text-[var(--ink-2)]">
                Looking for one particular place? Every council and MP area has its own page.
              </p>
              <Link href="/browse" className="ui text-[15px] font-[700]">
                See every page on this site →
              </Link>
            </div>
          </div>
        </div>
      )}

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="xl:hidden border-t border-[var(--rule)] bg-[var(--surface)]"
        >
          {[...NAV, { href: "/take-action", label: "Email your MP/MSP" }].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setMenuPath(null)}
              className="ui block px-6 py-4 border-b border-[var(--rule)] text-[16px] font-[560]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 no-print bg-[var(--deep)] text-[var(--deep-ink)]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-12 sm:py-14">
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Wordmark className="text-[24px]" />
            <p className="text-[15px] leading-[1.55] opacity-70 max-w-[36ch] mt-4">
              Poverty and living costs explained in ordinary words. Every number can be checked.
            </p>
            {site.web3formsKey && (
              <div className="mt-6">
                <p className="ui text-[15px] font-[680] opacity-80 mb-2.5">
                  One email when the data changes
                </p>
                <NewsletterSignup variant="footer" />
              </div>
            )}
          </div>

          {SECTIONS.slice(0, 2).map((sec) => (
            <div key={sec.title}>
              <p className="ui text-[15px] font-[720] opacity-70 mb-4">{sec.title}</p>
              <ul className="space-y-2.5 text-[15px]">
                {sec.items.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="opacity-75 hover:opacity-100 transition-opacity">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="ui text-[15px] font-[720] opacity-70 mb-4">Check us</p>
            <ul className="space-y-2.5 text-[15px]">
              {SECTIONS[3].items.slice(0, 5).map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="opacity-75 hover:opacity-100 transition-opacity">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/browse" className="opacity-75 hover:opacity-100 transition-opacity">
                  Every page on this site
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="ui text-[15px] font-[720] opacity-70 mb-4">Who made this</p>
            <p className="text-[15px] leading-[1.55] opacity-80 max-w-[28ch]">
              A personal project by {site.author.name} at{" "}
              <a href={site.organisation.url} className="underline underline-offset-2">
                {site.organisation.name}
              </a>
              . No party, no funding, no paywall.
            </p>
            <div className="flex flex-wrap gap-x-5 mt-3.5 text-[15px]">
              <Link href="/about" className="underline underline-offset-2 opacity-75 hover:opacity-100">
                About
              </Link>
              <Link href="/contact" className="underline underline-offset-2 opacity-75 hover:opacity-100">
                Get in touch
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-current/15 flex flex-wrap items-baseline gap-x-6 gap-y-2 ui text-[15px] opacity-70">
          <span>Data last checked {site.dataUpdated}</span>
          <span>ONS · DWP · Scottish Government · academic sources</span>
          <Link href="/methods" className="underline underline-offset-2 hover:opacity-100">
            Every number is sourced
          </Link>
        </div>
      </div>
    </footer>
  );
}
