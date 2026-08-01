import Link from "next/link";
import { Page, ContentFrame, PageHeader, InShort, SectionHead } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";

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
    ? `What this site collects, what it does not, and how to have it deleted. ${toolList} measure how pages are used. Postcodes are never stored.`
    : "What this site collects, what it does not, and how to have it deleted. No tracking, no analytics, no advertising. Postcodes are never stored.",
  path: "/privacy",
});

export default function Privacy() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ])}
      />

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
            <strong>Nothing is collected unless you type it and press send.</strong>
          </p>
          <p>
            Postcodes are used to find your area and never stored. The calculators work entirely
            inside your browser.
          </p>
          <p>
            If you join the mailing list I keep your email address, and nothing else. You can have
            it deleted at any time by asking.
          </p>
        </InShort>

        <ContentFrame as="section" className="pt-16 sm:pt-20">
          <SectionHead eyebrow="The short version" title="What is collected, and when" />

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {[
              {
                t: "Joining the mailing list",
                b: "Your email address, and nothing else. There is no name field. It is stored in Mailchimp and used to send occasional updates about this site.",
              },
              {
                t: "Using the contact form",
                b: "Your email address so a reply can reach you, your message, and the subject you picked. There is also a name box, which is optional — leave it blank and nothing is collected from it.",
              },
              {
                t: "Entering a postcode",
                b: "It is sent to a public lookup service to work out your council area, MP and MSP, and it is used for that and nothing else. It is not stored by this site and it is not written to your emails.",
              },
              {
                t: "Using the calculators",
                b: "Nothing at all. The take-home pay and council tax sums run entirely in your browser. No wage, band or figure you enter ever leaves your device.",
              },
            ].map((row) => (
              <div
                key={row.t}
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-6 py-6"
                style={{ boxShadow: "var(--shadow-1)" }}
              >
                <p className="ui text-[17px] font-[750]">{row.t}</p>
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
                This site uses {toolList} to understand which pages people find useful and
                where they get stuck. These set cookies and load when the page does. If you
                would rather they did not run, the controls below all work.
              </p>

              <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-6 py-6">
                <p className="ui text-[15px] font-[750] mb-3">What they record</p>
                <ul className="grid gap-2.5">
                  {[
                    "The pages you visit, roughly where in the world you are, and which site or search sent you.",
                    "Your device, browser and screen size.",
                    ...(CLARITY_ON
                      ? [
                          "Clarity also records how the page is used — scrolling, clicks and mouse movement — so layout problems can be spotted. Text you type is masked and is not part of that recording.",
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
                <p className="ui text-[15px] font-[750] mb-3">How to turn it off</p>
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
                        Analytics opt-out add-on
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
                This is measurement, not identification. There is no attempt to work out who
                you are, nothing is combined with the mailing list, and none of it is sold or
                shared. If you would like your data removed, email{" "}
                <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
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
                    "Nothing you type is ever sent to the analytics tools. The letter box, your name and your postcode are masked before anything is recorded.",
                  ]
                : [
                    "No analytics. There is no Google Analytics, no Plausible, no pixel and no heatmap.",
                    "No tracking cookies. The only thing stored in your browser is whether you chose light or dark mode, and that stays on your device.",
                  ]),
              "No advertising, no ad networks and nothing sold or shared with anyone.",
              "No profiling, no automated decisions and no attempt to work out who you are.",
              "No account, no password and no sign-up needed to use anything here.",
              "Your postcode is never stored, never logged against you and never added to a list.",
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
                      className="ui border-b-2 border-[var(--ink)] bg-[var(--surface-2)] px-5 py-3.5 text-left text-[14.5px] font-[750] text-[var(--muted)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Vercel", "Hosts the site", "Standard server logs, which include IP addresses, for security and to keep the site running"],
                  ["Web3Forms", "Delivers the contact form and sign-ups to a real inbox", "Only what you typed into the form"],
                  ["Mailchimp", "Stores the mailing list", "Your email address"],
                  ["postcodes.io", "Turns a postcode into a council area", "The postcode you entered"],
                  ["UK Parliament and the Scottish Parliament", "Provide the public record of who your MP and MSP are", "Nothing about you — the site asks them about an area, not a person"],
                  ["YouTube", "Plays the video, but only after you press play", "Nothing until you click. Nothing loads from YouTube on a normal page view"],
                ].map(([a, b, c]) => (
                  <tr key={a} className="transition-colors hover:bg-[var(--surface-2)]">
                    <td className="ui border-b border-[var(--rule)] px-5 py-4 font-[700]">{a}</td>
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
                corrected, and ask for it to be deleted. Because the only thing kept is an email
                address, that is usually a one-line request and it is done the same day.
              </p>
              <p>
                Every mailing list email has an unsubscribe link, which removes you immediately. You
                do not have to give a reason and nothing is kept afterwards.
              </p>
            </div>
            <div className="space-y-4 text-[17px] leading-[1.6] text-[var(--ink-2)]">
              <p>
                To ask for anything, use <Link href="/contact">the contact form</Link> and pick
                &ldquo;Something else&rdquo;, or write to the address on that page.
              </p>
              <p>
                If you are not happy with how a request is handled you can complain to the
                Information Commissioner&apos;s Office at{" "}
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
            {site.name} is a personal, independent project by {site.author.name} at{" "}
            {site.organisation.name}. It has no funding, no advertising and nothing to sell, which
            is the main reason there is so little to say on this page. If anything here does not
            match what the site actually does,{" "}
            <Link href="/contact">tell me and it will be corrected</Link>.
          </p>
        </ContentFrame>
      </Page>
    </>
  );
}
