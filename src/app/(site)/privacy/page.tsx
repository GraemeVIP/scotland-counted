import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, InShort, SectionHead } from "@/components/Blocks";
import { meta } from "@/lib/seo";
import { site } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CookieSettingsButton } from "@/components/CookieBanner";

/**
 * Written to describe what the code actually does, not what would be
 * convenient. If a form or a third-party call changes, this page changes with
 * it — a privacy policy that has drifted from the software is worse than none,
 * because it is a written statement that is no longer true.
 *
 * Which is why the analytics wording is derived rather than typed. This page
 * and the scripts in src/components/Analytics.tsx read the same two config
 * values, so the page cannot end up claiming "no analytics" while a tag is
 * loading. Switch a tool on or off and the words follow it.
 */

const GA4_ON = Boolean(site.analytics.ga4);
const CLARITY_ON = Boolean(site.analytics.clarity);
const ANALYTICS_ON = GA4_ON || CLARITY_ON;

const TOOL_NAMES = [GA4_ON && "Google Analytics", CLARITY_ON && "Microsoft Clarity"].filter(
  Boolean
) as string[];

/** "A and B", or just "A". */
const toolList = TOOL_NAMES.join(" and ");

export const metadata = meta({
  title: "Privacy",
  description: ANALYTICS_ON
    ? `How Scotland Counted uses ${toolList}, what it collects, and how to have data deleted. Postcode lookups and temporary browser storage explained.`
    : "What this site collects, what it does not, and how to have it deleted. No tracking, no analytics, no advertising. Postcode lookups and temporary browser storage explained.",
  path: "/privacy",
});

export default function Privacy() {
  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]} />

      <Page>
        <PageHeader
          eyebrow="What happens to your information"
          title="Privacy"
          lede={
            ANALYTICS_ON
              ? `This site is built to need as little from you as possible. There is no advertising and nothing is ever sold. ${toolList} measure which pages get used, and this page says exactly what that means, what else is collected, and how to have it removed.`
              : "This site is built to need as little from you as possible. There is no tracking, no analytics, no advertising and no profiling. This page says exactly what is collected, when, and how to have it removed."
          }
        />

        <InShort expert={false}>
          <p>
            <strong>
              {ANALYTICS_ON
                ? `${toolList} only use cookies if you accept them. Google Analytics only starts after you click Agree and continue. Microsoft Clarity runs without cookies until then.`
                : "No visit tools are running."}
            </strong>{" "}
            Your sums and drafts stay on your own device unless you send them.
          </p>
          <p>
            Postcodes go to lookup tools to find your area, MP and MSPs. Your tab holds a
            postcode only until the email tool reads it. Sum tools run inside your browser.
          </p>
          <p>
            We have no login accounts and no mailing list. Contact notes only go to our team so we
            can write back.
          </p>
        </InShort>

        <ContentFrame as="section" className="pt-16 sm:pt-20">
          <SectionHead eyebrow="The short version" title="What is collected, and when" />

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {[
              {
                t: "Using the contact form",
                b: "Your name, email, topic and note go through Web3Forms to our inbox. That lets us write back. Leave out private case notes. We never add you to a mailing list.",
              },
              {
                t: "Entering a postcode",
                b: "Your postcode goes to a public tool to find your council, MP and MSPs. This tab keeps it briefly for the email tool, then clears it. Closing the tab wipes it. We never store postcodes or send emails for you.",
              },
              {
                t: "Using the calculators",
                b: "Sums run on your own device. Pay and pension figures stay out of visit stats. Council tax lookups only send the postcode to find your council.",
              },
              {
                t: "Accounts and mailing lists",
                b: "Scotland Counted has no logins and no newsletter. We only see your email if you choose to send the contact form.",
              },
            ].map((row) => (
              <div
                key={row.t}
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-6 py-6"
                style={{ boxShadow: "var(--shadow-1)" }}
              >
                <p className="ui text-[17px] font-[600]">{row.t}</p>
                <p className="mt-2.5 text-[16px] leading-[1.6] text-[var(--ink-2)]">{row.b}</p>
              </div>
            ))}
          </div>
        </ContentFrame>

        {ANALYTICS_ON && (
          <ContentFrame as="section" className="pt-16 sm:pt-20">
            <SectionHead
              eyebrow="Be aware"
              title="How visits are measured"
            />
            <div className="mt-7 grid gap-4 max-w-[1000px]">
              <p className="text-[17px] leading-[1.65] text-[var(--ink-2)] max-w-[68ch]">
                {toolList} show which pages help most. Google Analytics starts after you agree.
                Microsoft Clarity runs without cookies until then. Change your pick anytime using{" "}
                <CookieSettingsButton className="cursor-pointer underline decoration-[var(--rule-strong)] underline-offset-4 text-[var(--ink)] hover:text-[var(--action-text)]">
                  Cookie settings
                </CookieSettingsButton>
                .
              </p>

              <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-6 py-6">
                <p className="ui text-[15px] font-[600] mb-3">What they record</p>
                <ul className="grid gap-2.5">
                  {[
                    "Which pages you visit, your rough area, and where you came from.",
                    "Your phone or computer type and screen size.",
                    ...(CLARITY_ON
                      ? [
                          "Clarity logs clicks and scrolls to find bugs. Words you type are hidden.",
                        ]
                      : []),
                  ].map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 text-[16.5px] leading-[1.6] text-[var(--ink-2)]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[9px] h-[7px] w-[7px] shrink-0 rounded-full bg-[var(--warn)]"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] px-6 py-6">
                <p className="ui text-[15px] font-[600] mb-3">How to turn it off</p>
                <ul className="grid gap-2.5 text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
                  <li>
                    Switch on <strong className="text-[var(--ink)]">Do Not Track</strong> or
                    tracking protection in your browser. Firefox, Brave and Safari block these
                    tools by default.
                  </li>
                  {GA4_ON && (
                    <li>
                      Install Google&apos;s official{" "}
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                      >
                        Analytics opt out add on
                      </a>
                      , which stops it on every site, not just this one.
                    </li>
                  )}
                  <li>
                    Use any content blocker. Nothing on this site breaks when these are
                    blocked — every page, the letter builder and the postcode lookup all work
                    exactly the same.
                  </li>
                </ul>
              </div>

              <p className="text-[15.5px] leading-[1.55] text-[var(--muted)] max-w-[68ch]">
                This counts visits only. We never track who you are. Nothing is sold or shared.
              </p>
            </div>
          </ContentFrame>
        )}

        <ContentFrame as="section" className="pt-16 sm:pt-20">
          <SectionHead eyebrow="Just as important" title="What is never collected" />
          <ul className="mt-7 grid gap-3 lg:grid-cols-2 max-w-[1000px]">
            {[
              ...(ANALYTICS_ON
                ? [
                    "Private form boxes stay masked in Clarity. Stats leave out postcodes, names, emails, pay and message words.",
                  ]
                : [
                    "No visit stats run. There is no Google Analytics, no pixel and no heatmap.",
                    "No tracking cookies. This browser only stores light or dark mode choice on your device.",
                  ]),
              "No ads networks. Nothing about you is ever sold. Our tools are listed below.",
              "No profiling and no automated checks. We never try to guess who you are.",
              "No account, no password and no sign up needed on any page.",
              "Postcodes never go on a server list. Your tab only holds them briefly for the email tool.",
            ].map((item) => (
              <li
                key={item}
                className="flex gap-3 text-[16.5px] leading-[1.6] text-[var(--ink-2)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-[9px] h-[7px] w-[7px] shrink-0 rounded-full bg-[var(--good)]"
                />
                {item}
              </li>
            ))}
          </ul>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16 sm:pt-20">
          <SectionHead eyebrow="Who else is involved" title="The services this site uses" />
          <p className="mt-6 max-w-[62ch] text-[18px] leading-[1.6] text-[var(--ink-2)]">
            A handful of other companies are involved in making the site work. None of them are
            given anything about you beyond what is needed for the job described.
          </p>

          <div className="mt-8 overflow-x-auto rounded-[var(--r-m)] border border-[var(--rule)]">
            <table className="w-full border-collapse text-[15.5px]">
              <thead>
                <tr>
                  {["Service", "What it does", "What it sees"].map((h) => (
                    <th
                      key={h}
                      className="ui border-b-2 border-[var(--ink)] bg-[var(--surface-2)] px-5 py-3.5 text-left text-[15px] font-[600] text-[var(--muted)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Vercel", "Hosts the site", "Standard server logs, which include IP addresses, for security and to keep the site running"],
                  ["Web3Forms", "Sends contact form messages to our editorial inbox", "Your name, email address, topic and the message fields you submit on the contact page"],
                  ...(GA4_ON ? [["Google Analytics", "Measures visits and existing tool actions", "Page paths, device details, approximate location, referral information and limited action events"]] : []),
                  ...(CLARITY_ON ? [["Microsoft Clarity", "Helps find usability problems", "Page interaction and session recordings with private form fields masked"]] : []),
                  ["postcodes.io", "Turns a postcode into a council area", "The postcode you entered"],
                  ["UK Parliament", "Provides the public record of who your MP is", "The constituency found from your postcode. Your postcode is not sent to UK Parliament"],
                  ["Scottish Parliament", "Provides the public record of who your MSPs are", "Usually only an area name. If postcodes.io cannot identify your Scottish Parliament areas, the postcode you entered is sent to the Scottish Parliament postcode finder"],
                  ["YouTube", "Plays the video, but only after you press play", "Nothing until you click. Nothing loads from YouTube on a normal page view"],
                ].map(([a, b, c]) => (
                  <tr key={a} className="transition-colors hover:bg-[var(--surface-2)]">
                    <td className="ui border-b border-[var(--rule)] px-5 py-4 font-[580]">{a}</td>
                    <td className="border-b border-[var(--rule)] px-5 py-4 text-[var(--ink-2)]">
                      {b}
                    </td>
                    <td className="border-b border-[var(--rule)] px-5 py-4 text-[var(--ink-2)]">
                      {c}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16 sm:pt-20">
          <SectionHead eyebrow="Your rights" title="Asking for your information back, or gone" />
          <div className="mt-6 grid gap-x-14 gap-y-5 lg:grid-cols-2">
            <div className="space-y-4 text-[17px] leading-[1.6] text-[var(--ink-2)]">
              <p>
                Under UK data protection law you can ask what is held about you, ask for it to be
                corrected, and ask for it to be deleted, for example any message you sent through
                the <Link href="/contact">contact page</Link>.
              </p>
              <p>
                Scotland Counted does not run a mailing list and collects no personal account
                details.
              </p>
            </div>
            <div className="space-y-4 text-[17px] leading-[1.6] text-[var(--ink-2)]">
              <p>
                Read more about how the site works on the <Link href="/about">about page</Link> and{" "}
                <Link href="/methods">methods page</Link>.
              </p>
              <p>
                If you have concerns about privacy or data rights in the UK you can check guidance
                from the Information Commissioner&apos;s Office at{" "}
                <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
                  ico.org.uk
                </a>
                .
              </p>
            </div>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="mt-16 border-t-2 border-[var(--ink)] pt-8">
          <p className="max-w-[70ch] text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
            {site.name} is an independent non-profit public data organisation. Every figure links to
            its official source, and any updates are logged on the{" "}
            <Link href="/corrections">corrections page</Link>.
          </p>
        </ContentFrame>
      </Page>
    </>
  );
}
