"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "../../site.config";

export const NAV = [
  { href: "/the-numbers", label: "The numbers" },
  { href: "/why-glasgow", label: "Why Glasgow" },
  { href: "/what-would-fix-it", label: "What would fix it" },
  { href: "/accountability", label: "Accountability" },
  { href: "/areas", label: "Your area" },
  { href: "/take-action", label: "Take action" },
];

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      document.documentElement.setAttribute("data-theme", stored);
      setTheme(stored);
    }
  }, []);

  function toggle() {
    const current =
      theme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
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
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-[var(--ground)]/95 backdrop-blur border-b border-[var(--rule)] no-print">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 flex items-center gap-4 h-[58px]">
        <Link href="/" className="font-[680] tracking-[-0.02em] text-[17px] shrink-0">
          Glasgow<span className="text-[var(--glasgow)]"> Counted</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-1 ml-2">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-2 text-[14.5px] rounded transition-colors ${
                  active
                    ? "text-[var(--ink)] font-[600]"
                    : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="lg:hidden p-2 text-[var(--ink-2)]"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="lg:hidden border-t border-[var(--rule)] bg-[var(--surface)]">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block px-6 py-3 border-b border-[var(--rule)] text-[15.5px]"
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
    <footer className="border-t-2 border-[var(--ink)] mt-24 no-print">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-[680] tracking-[-0.02em] text-[17px] mb-2">
              Glasgow<span className="text-[var(--glasgow)]"> Counted</span>
            </p>
            <p className="text-[14.5px] text-[var(--ink-2)] max-w-[34ch]">
              {site.tagline} An independent, fully sourced record — free to read, quote and reuse.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-3">The site</p>
            <ul className="space-y-2 text-[14.5px] text-[var(--ink-2)]">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-[var(--ink)]">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">The evidence</p>
            <ul className="space-y-2 text-[14.5px] text-[var(--ink-2)]">
              <li><Link href="/methods" className="hover:text-[var(--ink)]">Methods and sources</Link></li>
              <li><Link href="/glossary" className="hover:text-[var(--ink)]">Plain-English glossary</Link></li>
              <li><Link href="/data" className="hover:text-[var(--ink)]">Download the data</Link></li>
              <li><Link href="/corrections" className="hover:text-[var(--ink)]">Corrections</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Who made this</p>
            <p className="text-[14.5px] text-[var(--ink-2)] max-w-[32ch]">
              A personal project by {site.author.name} at{" "}
              <a
                href={site.organisation.url}
                className="underline decoration-[var(--baseline)] underline-offset-2 hover:decoration-current"
              >
                {site.organisation.name}
              </a>
              . Not funded by, or affiliated with, any political party or campaign.
            </p>
            <Link
              href="/about"
              className="inline-block mt-3 text-[14.5px] underline decoration-[var(--baseline)] underline-offset-2 hover:decoration-current"
            >
              About this project
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--rule)] flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11.5px] text-[var(--muted)]">
          <span>Data last checked {site.dataUpdated}</span>
          <span>Figures from ONS, DWP, the Scottish Government and academic sources</span>
          <Link href="/methods" className="hover:text-[var(--ink)] underline underline-offset-2">
            Every number is sourced
          </Link>
        </div>
      </div>
    </footer>
  );
}
