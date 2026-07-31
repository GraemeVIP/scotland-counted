"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { ScrollProgress, PictoGrid } from "@/components/Motion";
import NewsletterSignup from "@/components/NewsletterSignup";

export const NAV = [
  { href: "/the-numbers", label: "The numbers" },
  { href: "/why-glasgow", label: "Why Glasgow" },
  { href: "/what-would-fix-it", label: "What would fix it" },
  { href: "/accountability", label: "Accountability" },
  { href: "/areas", label: "Your area" },
];

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`ui font-[800] tracking-[-0.04em] leading-none ${className}`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      Glasgow<span className="text-[var(--action)]">Counted</span>
    </span>
  );
}

function SearchButton() {
  const [mac, setMac] = useState(false);
  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-command"))}
      aria-label="Search the site"
      className="group flex items-center gap-2.5 border border-[var(--rule-strong)] hover:border-[var(--ink)] transition-colors px-3 py-2"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="text-[var(--muted)] group-hover:text-[var(--ink)] transition-colors" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.8-3.8" />
      </svg>
      <span className="ui hidden md:block text-[12.5px] text-[var(--muted)] group-hover:text-[var(--ink)] transition-colors">
        Search
      </span>
      <kbd className="datum hidden md:block text-[10px] text-[var(--muted)] border border-[var(--rule)] px-1 py-0.5">
        {mac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) setTheme(stored);
  }, []);

  function toggle() {
    const current =
      theme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark"
      className="p-2 text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

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
        <Link href="/" className="shrink-0" aria-label="Glasgow Counted, home">
          <Wordmark className="text-[19px]" />
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-7 ml-2">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`ui relative text-[14px] font-[520] tracking-[-0.005em] py-1 transition-colors ${
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
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <SearchButton />
          <ThemeToggle />
          <Link
            href="/take-action"
            className="btn btn-primary hidden sm:inline-flex !px-5 !py-2.5 !text-[14px]"
          >
            Take action
          </Link>
          <button
            type="button"
            className="lg:hidden p-2 text-[var(--ink-2)]"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </div>
      <ScrollProgress />

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="lg:hidden border-t border-[var(--rule)] bg-[var(--surface)]"
        >
          {[...NAV, { href: "/take-action", label: "Take action" }].map((n) => (
            <Link
              key={n.href}
              href={n.href}
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
    <footer className="mt-28 no-print bg-[var(--deep)] text-[var(--deep-ink)]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Wordmark className="text-[26px]" />
            <p className="text-[15.5px] leading-[1.6] opacity-70 max-w-[36ch] mt-5">
              {site.tagline} An independent, fully sourced record — free to read, quote and reuse.
            </p>
            <p className="ui text-[11px] uppercase tracking-[0.12em] font-[620] opacity-50 mt-7">
              Data last checked {site.dataUpdated}
            </p>
            <div className="max-w-[280px] mt-8" aria-hidden="true">
              <PictoGrid
                lit={36}
                columns={25}
                litColor="var(--action)"
                dimColor="#f3efe6"
                dimOpacity={0.14}
              />
              <p className="ui text-[10px] uppercase tracking-[0.14em] font-[620] opacity-40 mt-2.5">
                36 in every 100 Glasgow children · 2023/24
              </p>
            </div>
          </div>

          <div>
            <p className="ui text-[11px] uppercase tracking-[0.12em] font-[620] opacity-50 mb-5">
              The site
            </p>
            <ul className="space-y-3 text-[15px]">
              {NAV.concat([
                { href: "/constituencies", label: "Constituencies" },
                { href: "/take-action", label: "Take action" },
              ]).map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="opacity-75 hover:opacity-100 transition-opacity">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="ui text-[11px] uppercase tracking-[0.12em] font-[620] opacity-50 mb-5">
              The evidence
            </p>
            <ul className="space-y-3 text-[15px]">
              {[
                { href: "/methods", label: "Methods and sources" },
                { href: "/glossary", label: "Plain-English glossary" },
                { href: "/data", label: "Download the data" },
                { href: "/press", label: "Press and reuse" },
                { href: "/updates", label: "What changed" },
                { href: "/corrections", label: "Corrections" },
              ].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="opacity-75 hover:opacity-100 transition-opacity">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="ui text-[11px] uppercase tracking-[0.12em] font-[620] opacity-50 mb-5">
              Who made this
            </p>
            <p className="text-[15px] leading-[1.6] opacity-75 max-w-[30ch]">
              A personal project by {site.author.name} at{" "}
              <a href={site.organisation.url} className="underline underline-offset-2">
                {site.organisation.name}
              </a>
              . Not funded by, or affiliated with, any political party or campaign.
            </p>
            <div className="flex flex-wrap gap-x-5 mt-4">
              <Link
                href="/about"
                className="text-[15px] underline underline-offset-2 opacity-75 hover:opacity-100"
              >
                About this project
              </Link>
              <Link
                href="/contact"
                className="text-[15px] underline underline-offset-2 opacity-75 hover:opacity-100"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>

        {site.web3formsKey && (
          <div className="mt-14 pt-10 border-t border-current/15">
            <p className="ui text-[11px] uppercase tracking-[0.12em] font-[620] opacity-50 mb-4">
              The Count — one email when the data changes
            </p>
            <NewsletterSignup variant="footer" />
          </div>
        )}

        <div className="mt-14 pt-7 border-t border-current/15 flex flex-wrap gap-x-8 gap-y-2 ui text-[11px] uppercase tracking-[0.12em] font-[620] opacity-50">
          <span>ONS · DWP · Scottish Government · Academic sources</span>
          <Link href="/methods" className="hover:opacity-100 underline underline-offset-2">
            Every number is sourced
          </Link>
        </div>
      </div>
    </footer>
  );
}
