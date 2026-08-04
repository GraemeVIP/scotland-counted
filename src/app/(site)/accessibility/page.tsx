import Link from "next/link";
import { Page, ContentFrame, Col, PageHeader, InShort } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";

/**
 * The accessibility statement.
 *
 * Written to be true rather than reassuring. The site is designed and tested
 * against WCAG 2.2 AA, and that is what it says: no formal audit has been
 * commissioned, so it does not claim compliance. Known problems are listed by
 * name, because a statement with an empty limitations section is a statement
 * nobody checked.
 */

export const metadata = meta({
  title: "Accessibility Statement",
  description:
    "How Scotland Counted is designed and tested for accessibility, what is checked automatically, the known limitations, and how to report a problem.",
  path: "/accessibility",
});

const LAST_REVIEWED = "3 August 2026";

const TESTED = [
  {
    title: "Colour and contrast",
    body: "Text is measured against WCAG AA contrast ratios in both light and dark themes: 4.5:1 for normal text and 3:1 for large text. Body text clears it comfortably. The orange accent does not, and that is listed under known limitations below rather than glossed over here. Colour is never the only way information is given, so a red or green figure always carries a word as well.",
  },
  {
    title: "Keyboard access",
    body: "Every control can be reached and operated with a keyboard alone, including the menu, the command palette and the calculators. Focus is always visible.",
  },
  {
    title: "Headings and structure",
    body: "One H1 per page, headings in order, and landmarks so a screen reader can skip to the main content.",
  },
  {
    title: "Charts and figures",
    body: "Every chart has a text alternative and the underlying figures are given as text or a table nearby. No finding is available only as a picture.",
  },
  {
    title: "Motion",
    body: "Animation is decorative and is switched off for anyone whose system asks for reduced motion. No content depends on movement to be understood.",
  },
  {
    title: "Text and zoom",
    body: "The layout works at 320px wide and at 200% zoom without content being cut off or requiring sideways scrolling, apart from wide tables which scroll inside their own container.",
  },
];

const KNOWN = [
  /*
   * Named because an automated sweep found it and the statement above says
   * contrast is checked. The measured figures: the orange accent is 3.10:1
   * against white, which clears the 3:1 bar for large text and interface
   * components and misses the 4.5:1 bar for normal-size text. In dark mode
   * white text on the lighter orange is 2.56:1. Do not soften this wording
   * without changing the colours it describes.
   */
  {
    title: "The orange accent does not reach AA for small text",
    body: "The orange used for buttons and section labels sits at about 3.1:1 against white. That passes the 3:1 standard for large text and interface controls, and misses the 4.5:1 standard for normal-size text. It is never the only signal: every button also has its own words, and no figure on this site depends on colour to be understood. An automated check counts these and fails if the number grows.",
  },
  {
    title: "Real screen readers have not been tested exhaustively",
    body: "Automated checks and keyboard testing are run regularly. Full manual testing with VoiceOver, NVDA and JAWS has not been carried out across every page.",
  },
  {
    title: "iOS Safari needs real-device testing",
    body: "Mobile layouts are tested at real widths in a desktop browser. Some behaviour, particularly the menu and sticky header, has been verified on a real iPad but not across every iOS version.",
  },
  {
    title: "Wide data tables scroll sideways",
    body: "Council comparison tables are wider than a phone screen and scroll inside their own container. The page itself never scrolls sideways, but the table does, which is awkward with a screen magnifier.",
  },
  {
    title: "Embedded video",
    body: "The explainer video is hosted on YouTube and its player is outside this site's control. Captions are provided.",
  },
];

export default function Accessibility() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Accessibility", path: "/accessibility" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="Accessibility"
          title="How this site is built to be usable"
          lede="Scotland Counted is designed and tested against WCAG 2.2 level AA. No formal audit has been commissioned, so this page says what is actually checked and what is known to fall short."
        />

        <ContentFrame>
          <InShort expert={false}>
            <p>
              This site exists to make public information reachable. That is worth very little
              if the site itself is not.
            </p>
            <p>
              If something here does not work for you, tell me and I will fix it. That is a
              faster route than any statement.
            </p>
          </InShort>

          <section className="pt-12">
            <h2 className="h2 mb-3">The standard being aimed at</h2>
            <Col>
              <p>
                The target is the Web Content Accessibility Guidelines version 2.2, level AA.
                The site is <strong>designed and tested against</strong> that standard rather
                than certified to it. No independent audit has been carried out, so a claim of
                full compliance would not be honest.
              </p>
              <p>Last reviewed: {LAST_REVIEWED}.</p>
            </Col>
          </section>

          <section className="pt-14">
            <h2 className="h2 mb-3">What is checked</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {TESTED.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--good)] bg-[var(--surface)] p-5"
                >
                  <h3 className="ui text-[17px] font-[750] leading-[1.35]">{item.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-14">
            <h2 className="h2 mb-3">How it is tested</h2>
            <Col>
              <p>
                Automated accessibility checks run against a production build of every page in
                the sitemap, covering contrast, landmarks, heading order, form labels and image
                alternatives. Keyboard journeys are tested by hand: the menu, the command
                palette, the postcode lookup and both calculators.
              </p>
              <p>
                Layout is checked at 390px, 768px, 1024px, 1280px and 1440px wide, in light and
                dark themes, with and without reduced motion.
              </p>
            </Col>
          </section>

          <section className="pt-14">
            <h2 className="h2 mb-3">Known limitations</h2>
            <p className="mb-6 max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              These are the things currently known to fall short. The list being short does not
              mean nothing else is wrong, only that nothing else has been found yet.
            </p>
            <div className="grid gap-4">
              {KNOWN.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[var(--r-m)] border border-[var(--rule)] border-l-[3px] border-l-[var(--warn)] bg-[var(--surface)] p-5"
                >
                  <h3 className="ui text-[17px] font-[750] leading-[1.35]">{item.title}</h3>
                  <p className="mt-2 max-w-[70ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-14">
            <h2 className="h2 mb-3">Reporting a problem</h2>
            <Col>
              <p>
                If any part of this site is unusable for you, please{" "}
                <Link href="/contact">get in touch</Link> and say what you were trying to do and
                what happened. A description of the barrier is more useful than a technical
                report, and you do not need to know the standard to report a problem with it.
              </p>
              <p>
                Accessibility problems are treated the same way as factual errors: fixed, then
                recorded in the public <Link href="/corrections">corrections log</Link>.
              </p>
            </Col>
          </section>
        </ContentFrame>
      </Page>
    </>
  );
}
