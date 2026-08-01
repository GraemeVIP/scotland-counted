import Link from "next/link";
import {
  Page,
  ContentFrame,
  PageHeader,
  InShort,
  EvidenceDetails,
  CTA,
} from "@/components/Blocks";
import WhoDoesWhat from "@/components/WhoDoesWhat";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { pay, whatHappens, paperTrail, friction } from "@/lib/data/power";
import { getSources } from "@/lib/data/sources";

export const metadata = meta({
  title: "What happens when you email your MP",
  description:
    "Your MP is paid £98,599 a year and has to deal with people who live in their area. Here is what actually happens after you press send, and why a written answer matters.",
  path: "/your-power",
});

const FAQ = [
  {
    q: "Is emailing my MP a waste of time?",
    a: "No. Your email is logged, and offices sort what comes in by subject — that is how they know what their area cares about. You will usually get a reply, and the reply is a record you can check later.",
  },
  {
    q: "How much is an MP paid?",
    a: "An MP's basic salary is £98,599 a year from 1 April 2026, before expenses. An MSP's is £77,711. Answering people who live in their area is part of the job they are paid to do.",
  },
  {
    q: "Do I have to have voted for them?",
    a: "No. An MP or MSP represents everyone who lives in their area — people who voted for them, people who voted against them, and people who did not vote at all.",
  },
  {
    q: "What is a written parliamentary question?",
    a: "A formal question an MP puts to the government. A minister has to answer it, and both the question and the answer are published permanently where anyone can read them. The expectation is an answer within about seven days, though that is a convention rather than a hard rule.",
  },
];

export default function YourPower() {
  const cited = getSources([
    pay.mp.sourceId,
    pay.msp.sourceId,
    ...paperTrail.sourceIds,
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Your power", path: "/your-power" },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: "What happens when you email your MP",
          description:
            "What an MP and MSP are paid, what happens to your email after you send it, and why a written answer creates a record you can check.",
          path: "/your-power",
        })}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <Page>
        <PageHeader
          eyebrow="Why it is worth the bother"
          title="You have more power than you think"
          lede="Almost nobody writes to the people who represent them. It is not apathy — it is that the whole thing feels like it is meant for somebody else. It is not. Here is exactly how it works."
        />

        <ContentFrame>
          <div className="mt-2 mb-10">
            <InShort>
              <p>
                You have two people whose job is to deal with you: an <strong>MP</strong> in London
                and an <strong>MSP</strong> in Edinburgh. Between them they are paid over{" "}
                <strong>£176,000 a year</strong>, by you.
              </p>
              <p>
                You do not need to have voted for them. You do not need to know anything about
                politics. You just need to ask them a question they have to answer.
              </p>
              <p>
                We write the email. You read it and press send. It takes about a minute.
              </p>
            </InShort>
          </div>

        <section>
          <h2 className="h2 mb-5">What they are paid</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[pay.mp, pay.msp].map((p) => (
              <div
                key={p.role}
                className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] p-6"
                style={{ boxShadow: "var(--shadow-1)" }}
              >
                <p className="ui text-[15px] font-[720] text-[var(--ink-2)]">{p.role}</p>
                <p className="figure-num text-[42px] sm:text-[50px] leading-[1] text-[var(--action)] mt-1.5">
                  {p.amount}
                </p>
                <p className="text-[16px] leading-[1.5] text-[var(--ink-2)] mt-3">{p.note}</p>
                {"extra" in p && p.extra && (
                  <p className="text-[15px] leading-[1.5] text-[var(--muted)] mt-2.5">{p.extra}</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-[18px] leading-[1.6] mt-6 max-w-[62ch]">
            That is public money, and dealing with people who live in their area is not a favour
            they are doing you. It is the job.
          </p>
        </section>

        <section className="pt-14">
          <h2 className="h2 mb-3">What happens after you press send</h2>
          <p className="text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch] mb-7">
            Four things. None of them depend on your MP liking you or agreeing with you.
          </p>

          <ol className="grid gap-4 lg:grid-cols-2">
            {whatHappens.map((s) => (
              <li
                key={s.step}
                className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6"
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className="figure-num text-[26px] text-[var(--action)] shrink-0"
                    aria-hidden="true"
                  >
                    {s.step}
                  </span>
                  <h3 className="text-[21px] font-[740] leading-[1.25]">{s.title}</h3>
                </div>
                <p className="text-[17px] leading-[1.6] text-[var(--ink-2)] mt-3">{s.body}</p>
                {s.detail && (
                  <p className="text-[15.5px] leading-[1.55] text-[var(--muted)] mt-3 pt-3 border-t border-[var(--rule)]">
                    {s.detail}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="pt-14">
          <div
            className="rounded-[var(--r-m)] bg-[var(--deep)] text-[var(--deep-ink)] p-6 sm:p-9"
            style={{ boxShadow: "var(--shadow-2)" }}
          >
            <p className="ui text-[15px] font-[750] text-[var(--action)] mb-3">
              The bit almost nobody knows
            </p>
            <h2 className="text-[26px] sm:text-[34px] font-[780] leading-[1.15] max-w-[20ch]">
              {paperTrail.title}
            </h2>
            <p className="text-[18px] leading-[1.6] mt-4 max-w-[60ch] opacity-90">
              {paperTrail.plain}
            </p>
            <p className="text-[17px] leading-[1.6] mt-3 max-w-[60ch] opacity-75">
              {paperTrail.convention}
            </p>
            <p className="text-[18px] leading-[1.6] mt-5 max-w-[60ch]">
              <strong>{paperTrail.why}</strong>
            </p>
          </div>
        </section>

        <section className="pt-14">
          <h2 className="h2 mb-3">Why nobody used to bother</h2>
          <p className="text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch] mb-7">
            Five separate jobs stood between a person being angry and a person being heard. That
            is why almost nobody did it. Every one of them is now done for you.
          </p>
          <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] overflow-hidden">
            {friction.map((f, i) => (
              <div
                key={f.before}
                className={`grid sm:grid-cols-2 gap-x-6 gap-y-1 px-5 sm:px-6 py-4 ${
                  i > 0 ? "border-t border-[var(--rule)]" : ""
                }`}
              >
                <p className="text-[16.5px] leading-[1.5] text-[var(--muted)] line-through decoration-[var(--rule-strong)]">
                  {f.before}
                </p>
                <p className="text-[16.5px] leading-[1.5] text-[var(--ink)] font-[560]">
                  {f.now}
                </p>
              </div>
            ))}
          </div>
        </section>

        <WhoDoesWhat className="pt-16" showDetail={false} />

        <section className="pt-14">
          <h2 className="h2 mb-6">Questions people ask</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {FAQ.map((f) => (
              <div key={f.q} className="border-t-2 border-[var(--ink)] pt-4">
                <h3 className="h3 mb-2">{f.q}</h3>
                <p className="text-[15.5px] text-[var(--ink-2)] leading-[1.55]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <EvidenceDetails className="mt-10" summary="Where these facts come from">
          <ul className="space-y-2.5">
            {cited.map((s) => (
              <li key={s.id} className="text-[15.5px] leading-[1.55]">
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>{" "}
                — {s.publisher}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[15px]">
            We do not publish figures for how often MPs reply, because no reliable national figure
            exists. Where something is a convention rather than a rule, we say so.{" "}
            <Link href="/methods">Read our methods</Link>.
          </p>
        </EvidenceDetails>

        <CTA
          title="Right — who represents you?"
          body="Put in your postcode. We find your MP and MSP, put your own area's figures into both emails and write them for you."
          href="/take-action"
          cta="Find mine and write the emails"
          secondaryHref="/areas"
          secondaryCta="See my area's figures first"
        />
        </ContentFrame>
      </Page>
    </>
  );
}
