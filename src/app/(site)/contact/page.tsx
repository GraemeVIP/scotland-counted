import Link from "next/link";
import { Suspense } from "react";
import { Page, ContentFrame, PageHeader, SectionHead } from "@/components/Blocks";
import ContactForm from "./ContactForm";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "Get in touch",
  description:
    "Ask a question about anything on this site, find out who can help with a problem, or report an error. One form, read by a person, never an automated reply.",
  path: "/contact",
});

/**
 * The page used to be built for people writing about the site, corrections,
 * press deadlines, data cuts. That is a small and fairly confident audience.
 * The much larger one is somebody who has just read that a third of children
 * near them are in poverty, has a question, and has no idea whether they are
 * allowed to ask it. Everything here is aimed at that person first.
 *
 * Two things earn their place by being true rather than promotional.
 *
 * The support signposting exists because inviting an audience in poverty to
 * "ask anything" reliably produces messages from people in real trouble. A
 * reply in a few days is no use to somebody being evicted on Friday, and the
 * honest thing is to say so on the page rather than in a reply they may not
 * read in time.
 *
 * The block naming Strathmark answers the question every serious reader and
 * every journalist asks of a site making claims about public figures: who is
 * behind this and who pays for it. Answering it plainly is a trust signal
 * first. That it also tells people what the author does for a living is a
 * consequence of the answer being honest, and it only works while it stays
 * that way. The moment this page sells something, the impartiality the whole
 * site rests on is worth less than whatever it sold.
 */

/*
 * Every link here was loaded and checked, not written from memory. A dead or
 * wrong link on this particular list is the one error on the site that could
 * actually cost somebody something.
 *
 * advice.scot returns 403 to scripted requests. That is bot protection on a
 * live site, not a broken address. Check it in a browser before concluding
 * otherwise.
 */
const SUPPORT = [
  {
    name: "advice.scot",
    what: "Advice Direct Scotland: benefits entitlement checks, money, energy bills and consumer problems. Free, national, and Scottish Government funded. BSL users can contact them directly.",
    href: "https://www.advice.scot/",
  },
  {
    name: "Citizens Advice Scotland",
    what: "Help in person at a local bureau, including benefit applications, appeals, debt and employment problems.",
    href: "https://www.cas.org.uk/bureaux",
  },
  {
    name: "Shelter Scotland",
    what: "Housing and homelessness, including if you have been asked to leave or have nowhere to stay tonight.",
    href: "https://scotland.shelter.org.uk/get_help",
  },
];

export default function Contact() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="A real person reads these"
          title="Ask me anything"
          lede="A question about a figure, a problem you are trying to find the right door for, an error you have spotted, or an idea. You do not need a reason that sounds official."
        />

        <ContentFrame className="grid gap-x-14 gap-y-10 lg:grid-cols-2 items-start pt-2">
          <Suspense
            fallback={
              <div className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-8 max-w-[560px] min-h-[420px]" />
            }
          >
            <ContactForm />
          </Suspense>

          <div className="grid gap-6">
            <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] px-6 py-6">
              <p className="ui text-[15px] font-[750] mb-3">What happens when you send it</p>
              <ul className="grid gap-2.5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                {[
                  "It is read by a person, not a queue. No ticket numbers and no automated replies.",
                  "You will get an answer, usually within a few days. Corrections and press deadlines jump the queue.",
                  "Your email is used to reply to you and nothing else. It is not added to any list.",
                  "No question here is too basic. Plenty of people who work in this field cannot explain the difference between an MP and an MSP either.",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--brand)]"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[var(--r-m)] border-l-[3px] border-[var(--warn)] bg-[var(--surface)] px-6 py-6">
              <p className="ui text-[15px] font-[750] mb-2">If you need help this week</p>
              <p className="text-[16px] leading-[1.6] text-[var(--ink-2)]">
                Please do not wait for me. This site explains the figures. It cannot give
                benefits, debt or legal advice, and a reply in a few days is no use if something
                is happening on Friday. The services below do this properly and they are free.
              </p>
            </div>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16 sm:pt-20">
          <SectionHead eyebrow="Free, and this is what they do" title="Where to get real help" />
          <ul className="mt-7 grid gap-4 sm:grid-cols-2 max-w-[1000px]">
            {SUPPORT.map((s) => (
              <li
                key={s.name}
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-6 py-5"
              >
                <a
                  href={s.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="ui text-[17px] font-[720] text-[var(--brand)]"
                >
                  {s.name}
                </a>
                <p className="mt-1.5 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">{s.what}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-[68ch] text-[15.5px] leading-[1.55] text-[var(--muted)]">
            You can also{" "}
            <Link href="/email-your-mp-and-msp">write to your MP and MSP</Link> about a problem of your own.
            Constituency casework is a real part of their job and it is free.
          </p>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16 sm:pt-20">
          <SectionHead eyebrow="No mystery about it" title="Who you are writing to" />
          <div className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_1fr] items-start max-w-[1000px]">
            <div>
              <p className="text-[18px] leading-[1.65] text-[var(--ink-2)] max-w-[62ch]">
                Scotland Counted is written and published by{" "}
                <strong className="text-[var(--ink)]">{site.author.name}</strong>, who runs{" "}
                <a href={site.organisation.url} rel="noopener noreferrer" target="_blank">
                  {site.organisation.name}
                </a>{" "}
                in Edinburgh, independent AI and digital advisory for engineering, manufacturing
                and specialist technical businesses, working internationally.
              </p>
              <p className="mt-4 text-[18px] leading-[1.65] text-[var(--ink-2)] max-w-[62ch]">
                That work runs on evidence before commitment, no vendor agenda, and decisions that
                stay with the client rather than the adviser.{" "}
                <strong className="text-[var(--ink)]">This site is built the same way</strong>, and
                for the same reason: every source is named, every method is published, and every
                correction is logged where you can see it.
              </p>
              <p className="mt-4 text-[18px] leading-[1.65] text-[var(--ink-2)] max-w-[62ch]">
                A site making claims about councils and elected members should say who is behind it
                and who pays for it, so you can weigh what you are reading.
              </p>
              {/*
                Deliberately narrower than "this site has no opinions". It runs
                a letter builder that asks MPs to back a higher minimum wage and
                a page of costed options for change. That is a position, and
                claiming otherwise hands anyone hostile an easy contradiction.
                What is actually promised is the part that matters and can be
                defended: the numbers are never bent, and it never tells anyone
                how to vote.
              */}
              <div className="mt-6 rounded-[var(--r-m)] border-l-[3px] border-[var(--brand)] bg-[var(--surface-2)] px-6 py-5">
                <p className="ui text-[15px] font-[750] mb-2">Figures, not spin</p>
                <p className="text-[16px] leading-[1.6] text-[var(--ink-2)] max-w-[58ch]">
                  Every number here is taken from the body that published it, the Scottish
                  Government, the ONS, DWP records, or named academic work, and is never adjusted,
                  reframed or cherry-picked to make a point land harder. Where the site sets out
                  what would change things, the options are costed, attributed to whoever proposed
                  them, and marked with who actually has the power to do them.
                </p>
                <p className="mt-3 text-[16px] leading-[1.6] text-[var(--ink-2)] max-w-[58ch]">
                  <strong className="text-[var(--ink)]">
                    It will never tell you who to vote for.
                  </strong>{" "}
                  Every party in Scotland comes off badly somewhere in this data, and the site
                  publishes those figures the same way regardless of who is in charge.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[16px]">
                <Link href="/about">More about Scotland Counted</Link>
                <Link href="/methods">How every figure was counted</Link>
                <Link href="/corrections">Corrections policy</Link>
              </div>
            </div>

            <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] px-6 py-6">
              <p className="ui text-[15px] font-[750] mb-3">Who pays for this</p>
              <p className="text-[16px] leading-[1.6] text-[var(--ink-2)]">
                Nobody, and that is on purpose. Having nothing to declare is simpler than
                declaring it.
              </p>
              <ul className="mt-4 grid gap-2.5">
                {[
                  {
                    t: "No donations",
                    b: "If you were thinking of offering, thank you, and the answer is still no.",
                  },
                  {
                    t: "No advertising, ever",
                    b: "Nothing is sponsored, no space is for sale, and nobody has paid to appear here.",
                  },
                  {
                    t: "No party, no candidate",
                    b: "Not affiliated with, funded by or working for any party or campaign group.",
                  },
                ].map((x) => (
                  <li key={x.t} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--good)]"
                    />
                    <span className="text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                      <strong className="text-[var(--ink)]">{x.t}.</strong> {x.b}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 pt-4 border-t border-[var(--rule)] text-[15.5px] leading-[1.55] text-[var(--muted)]">
                If any of that ever changes it will be written here first, before you have to find
                out some other way.
              </p>
            </div>
          </div>
        </ContentFrame>
      </Page>
    </>
  );
}
