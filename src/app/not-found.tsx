import Link from "next/link";
import { PRIMARY } from "@/lib/data/navigation";

/**
 * The page people land on when a link is wrong.
 *
 * Next's default 404 is a bare line of text with no way out, which is a poor
 * end for someone who followed a link from a video description or a shared
 * post. This one apologises once, then does the only useful thing: offers the
 * routes that answer the question they probably arrived with.
 */

/** Next already marks not-found responses noindex, so this only sets the title. */
export const metadata = {
  title: "Page not found",
};

const HELP = [
  {
    href: "/areas",
    title: "Find your council area",
    body: "Poverty, work and pay figures for all 32 council areas in Scotland.",
  },
  {
    href: "/email-your-mp-and-msp",
    title: "Email your MP and MSP",
    body: "Enter a postcode and I find both, then write both emails for you.",
  },
  {
    href: "/council-tax-bands-scotland",
    title: "Council tax by band",
    body: "What every band really costs where you live, with water included.",
  },
  {
    href: "/browse",
    title: "See everything on the site",
    body: "Every page in one list, if you would rather just look for yourself.",
  },
];

export default function NotFound() {
  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">
      <div className="max-w-[1120px] mx-auto py-16 sm:py-24">
        {/*
          not-found.tsx sits outside the (site) group, so it does not get the
          header. That left the one page people reach by accident with no
          wordmark to say where they had landed and no link to the homepage
          at all: every route out of here went sideways, never home.
        */}
        <Link
          href="/"
          className="ui inline-block mb-10 text-[19px] font-[800] tracking-[-0.02em] no-underline text-[var(--ink)]"
        >
          Scotland<span className="text-[var(--action)]">Counted</span>
        </Link>

        <p className="kicker mb-4 text-[var(--action)]">404</p>
        <h1 className="h1 max-w-[16ch] mb-5">This page does not exist</h1>
        <p className="lede max-w-[54ch]">
          The link was probably wrong, or the page has moved since it was shared. Nothing is
          broken. Here is where most people are trying to get to.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {HELP.map((h) => (
            <Link
              key={h.href}
              href={h.href}
              className="group rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6 no-underline transition-all duration-300 hover:border-[var(--brand)] hover:-translate-y-1"
            >
              <p className="text-[20px] font-[750] leading-[1.2] group-hover:text-[var(--brand)] transition-colors">
                {h.title}
              </p>
              <p className="text-[15.5px] leading-[1.55] text-[var(--ink-2)] mt-2">{h.body}</p>
              <span
                aria-hidden="true"
                className="mt-5 inline-block text-[var(--action)] text-[18px] group-hover:translate-x-1.5 transition-transform"
              >
                →
              </span>
            </Link>
          ))}
        </div>

        <nav
          aria-label="Main sections"
          className="mt-12 pt-7 border-t border-[var(--rule)] flex flex-wrap gap-x-7 gap-y-3"
        >
          {PRIMARY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="ui text-[16px] font-[650] text-[var(--ink-2)] hover:text-[var(--brand)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="mt-8 text-[15.5px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch]">
          If you followed a link from somewhere on this site and it brought you here,{" "}
          <Link href="/contact">tell me</Link> and I will fix it.
        </p>
      </div>
    </div>
  );
}
