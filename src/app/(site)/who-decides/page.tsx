import Link from "next/link";
import { Page, ContentFrame, PageHeader, InShort, CTA } from "@/components/Blocks";
import Faq from "@/components/Faq";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import {
  LEVELS,
  RESPONSIBILITIES,
  RESPONSIBILITY_SOURCES,
  responsibilitiesFor,
  type ControlLevel,
} from "@/lib/data/responsibilities";

/**
 * Who decides what.
 *
 * The most wasted action on this site is a well-written email sent to the
 * wrong building. This page exists to stop that happening, so it is organised
 * by the thing a person is annoyed about rather than by the institution.
 *
 * Where control is split it says so. Flattening "schools" to a single answer
 * would be quicker to read and would send half the readers to the wrong place.
 */

export const metadata = meta({
  title: "Who Decides What in Scotland: Westminster, Holyrood or Your Council",
  description:
    "Universal Credit, council tax, schools, housing, roads and energy bills. See which government controls each one in Scotland, and which representative to contact about it.",
  path: "/who-decides",
});

const ORDER: ControlLevel[] = ["uk", "scotland", "council"];

const ACCENT: Record<ControlLevel, string> = {
  uk: "var(--brand)",
  scotland: "var(--action)",
  council: "var(--good)",
};

const FAQ = [
  {
    q: "How does the split actually work?",
    a: "Scotland uses a reserved powers model. Schedule 5 of the Scotland Act 1998 lists what stays with the UK Parliament, and anything not on that list is devolved to the Scottish Parliament. So devolved is the default and the reservations are the exceptions, which is the opposite of how most people assume it works.",
  },
  {
    q: "Should I write to my MP or my MSP?",
    a: "It depends entirely on the issue, which is what this page is for. Universal Credit, the minimum wage and the State Pension are your MP. Income tax on your wages, the NHS and schools policy are your MSPs. Council tax, bins, local roads and Crisis Grants are your councillors.",
  },
  {
    q: "I have more than one MSP. Which one do I contact?",
    a: "Everyone in Scotland has one constituency MSP and seven regional MSPs, and all eight can take up your case. You can write to any of them. Some people write to the constituency MSP first and go to a regional MSP if they get nowhere.",
  },
  {
    q: "What if the answer is that it is split?",
    a: "Then say so in your letter. If a school building is falling apart, that is your council, but if the problem is that councils have not been given the money, that is Holyrood. Naming both is more effective than picking the wrong one.",
  },
];

export default function WhoDecides() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Who decides", path: "/who-decides" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <Page>
        <PageHeader
          eyebrow="Who decides"
          title="Westminster, Holyrood or your council?"
          lede="Most letters that go nowhere went to the wrong building. Find the thing you are annoyed about, and see who actually controls it."
        />

        <ContentFrame>
          <InShort expert={false}>
            <p>
              Scotland works on a reserved powers model. A list in the Scotland Act says what
              stays with Westminster. Everything not on that list is decided in Scotland.
            </p>
            <p>
              Some things are genuinely split. Where they are, this page says so, because
              writing to one when you needed the other is how people conclude that contacting
              anyone is pointless.
            </p>
          </InShort>

          {ORDER.map((level) => {
            const items = responsibilitiesFor(level);
            const meta = LEVELS[level];
            return (
              <section key={level} id={level} className="pt-14 scroll-mt-24">
                <div
                  className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] bg-[var(--surface)] p-6 sm:p-7"
                  style={{ borderTopColor: ACCENT[level] }}
                >
                  <p className="kicker mb-2" style={{ color: ACCENT[level] }}>
                    Write to {meta.writeTo.toLowerCase()}
                  </p>
                  <h2 className="h2 mb-2">{meta.name}</h2>
                  <p className="max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
                    {meta.who}
                  </p>

                  <ul className="mt-7 grid gap-4">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-5"
                      >
                        <h3 className="ui text-[17px] font-[750] leading-[1.35]">{item.issue}</h3>
                        <p className="mt-2 max-w-[68ch] text-[16px] leading-[1.55] text-[var(--ink-2)]">
                          {item.what}
                        </p>
                        {item.shared ? (
                          <p className="mt-3 max-w-[68ch] border-l-2 border-[var(--rule-strong)] pl-3 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                            <strong className="text-[var(--ink)]">Not the whole story.</strong>{" "}
                            {item.shared}
                          </p>
                        ) : null}
                        <p className="ui mt-3 text-[15px] font-[650] text-[var(--ink-2)]">
                          Contact: {item.contact}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}

          <section className="pt-14">
            <h2 className="h2 mb-3">Find the people who represent you</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/email-your-mp-and-msp"
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--brand)]"
              >
                <span className="label">Enter a postcode</span>
                <strong className="mt-3 block text-[20px]">Find my MP and MSPs</strong>
                <span className="mt-2 block text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  Your postcode is used to look them up and is not stored.
                </span>
              </Link>
              <Link
                href="/what-happens-when-you-email-your-mp"
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--brand)]"
              >
                <span className="label">Before you write</span>
                <strong className="mt-3 block text-[20px]">What happens after you press send</strong>
                <span className="mt-2 block text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  What they do with it, how long it takes, and what gets a reply.
                </span>
              </Link>
            </div>
          </section>

          <Faq items={FAQ} className="pt-14" />

          <section className="pt-14">
            <p className="label mb-4">Where this comes from</p>
            <ul className="grid gap-3">
              {Object.entries(RESPONSIBILITY_SOURCES).map(([id, source]) => (
                <li key={id} className="text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.title}
                  </a>{" "}
                  &middot; {source.publisher}
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-[68ch] text-[15.5px] leading-[1.55] text-[var(--muted)]">
              {RESPONSIBILITIES.length} issues listed. If one is wrong or a power has moved,{" "}
              <Link href="/corrections">report it</Link> and it will be fixed and logged.
            </p>
          </section>

          <CTA
            title="Now you know who to write to"
            body="Find your MP, your constituency MSP and your seven regional MSPs, and send them something they have to answer."
            href="/email-your-mp-and-msp"
            cta="Find my representatives"
            secondaryHref="/councils"
            secondaryCta="See my council's record first"
          />
        </ContentFrame>
      </Page>
    </>
  );
}
