"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { ScrollProgress } from "@/components/Motion";
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
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-command"))}
      aria-label="Find your area, or search the site"
      className="group flex items-center gap-2.5 rounded-full bg-[var(--surface)] border border-[var(--rule-strong)] hover:border-[var(--brand)] transition-colors px-4 py-2.5"
      style={{ boxShadow: "var(--shadow-1)" }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="text-[var(--brand)]" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.8-3.8" />
      </svg>
      <span className="ui hidden md:block text-[14px] font-[560] text-[var(--ink-2)] group-hover:text-[var(--ink)] transition-colors">
        Find your area
      </span>
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
    <footer className="mt-24 no-print bg-[var(--deep)] text-[var(--deep-ink)]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-12 sm:py-14">
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Wordmark className="text-[24px]" />
            <p className="text-[15px] leading-[1.55] opacity-70 max-w-[36ch] mt-4">
              {site.tagline} Free to read, quote and reuse.
            </p>
            {site.web3formsKey && (
              <div className="mt-6">
                <p className="ui text-[13px] font-[640] opacity-80 mb-2.5">
                  One email when the data changes
                </p>
                <NewsletterSignup variant="footer" />
              </div>
            )}
          </div>

          <div>
            <p className="ui text-[12px] font-[680] opacity-50 mb-4">The site</p>
            <ul className="space-y-2.5 text-[14.5px]">
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
            <p className="ui text-[12px] font-[680] opacity-50 mb-4">The evidence</p>
            <ul className="space-y-2.5 text-[14.5px]">
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
            <p className="ui text-[12px] font-[680] opacity-50 mb-4">Who made this</p>
            <p className="text-[14.5px] leading-[1.55] opacity-75 max-w-[28ch]">
              A personal project by {site.author.name} at{" "}
              <a href={site.organisation.url} className="underline underline-offset-2">
                {site.organisation.name}
              </a>
              . No party, no funding, no paywall.
            </p>
            <div className="flex flex-wrap gap-x-5 mt-3.5 text-[14.5px]">
              <Link href="/about" className="underline underline-offset-2 opacity-75 hover:opacity-100">
                About
              </Link>
              <Link href="/contact" className="underline underline-offset-2 opacity-75 hover:opacity-100">
                Get in touch
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-current/15 flex flex-wrap items-baseline gap-x-6 gap-y-2 ui text-[12px] opacity-55">
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
