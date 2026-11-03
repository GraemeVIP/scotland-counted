import Link from "@/components/IntentLink";
import { Page, CTA, Reveal } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";
import { COUNCIL_COUNT } from "@/lib/data/councils";
import { TOTAL_MSPS } from "@/lib/data/local";
import { mps } from "@/lib/data/mps";

export const metadata = meta({
  title: "About this project",
  description: `${site.name} is a personal, independent project by ${site.author.name} at ${site.organisation.name}. No party affiliation, no funding and no paywall.`,
  path: "/about",
});

const TEXT_LINK = "underline underline-offset-[3px] decoration-1 hover:decoration-2";

const STORY = [
  {
    when: "At school",
    title: "I struggled an awful lot.",
    body: "I went to Kilwinning Academy in North Ayrshire. I didn't learn well in a classroom and, as a teenage boy, I didn't appreciate what I was being taught. Given the chance, I'd love to go back and do it all again.",
  },
  {
    when: "After school",
    title: "I worked hard to turn things around.",
    body: `These days I run a marketing consultancy, ${site.organisation.name}, and I love learning.`,
  },
  {
    when: "Now",
    title: "This is my way of giving back.",
    body: `${site.name} is my personal project alongside the day job. I enjoy helping people who struggle to understand things on their own, because I was one of them. The figures on this site affect everyone, but most of them are written for people who already understand them. So I take complicated subjects and data that most people never get to grips with, and break them down into words anyone can follow, including school pupils.`,
  },
];

const COVERAGE = [
  { value: COUNCIL_COUNT, label: "council areas, every one of them covered" },
  { value: mps.length, label: "areas represented by an MP" },
  { value: TOTAL_MSPS, label: "MSPs, with how they voted" },
];

const NOT_THIS = [
  {
    title: "Not party campaign material",
    body: "It follows the evidence. When several independent experts reach the same answer, the site says so in plain words.",
  },
  {
    title: "Every main party covered",
    body: (
      <>
        The{" "}
        <Link href="/who-is-responsible-for-poverty-in-scotland" className={TEXT_LINK}>
          who decides page
        </Link>{" "}
        covers every main party that made relevant decisions. The point is what governments did and
        what happened next, not the colour of a party badge.
      </>
    ),
  },
  {
    title: "No guessing at motives",
    body: "The site does not guess why a politician made a choice or claim that someone is dishonest. Representative pages use official public records, and the postcode tool only matches those records to your area when you ask it to.",
  },
];

const USE_IT = [
  {
    href: "/data",
    title: "Reuse the words and charts",
    body: `They are free to reuse if you credit ${site.name}. The original data still belongs to the organisations that published it.`,
    cta: "Download the exact files",
  },
  {
    href: "/press",
    title: "Journalists and researchers",
    body: "Journalists, researchers, councillors and community organisations are welcome to use any of it. If a chart would be more useful in a different format, ask.",
    cta: "Charts and figures",
  },
  {
    href: "/contact",
    title: "Corrections and questions",
    body: "Corrections, questions and data requests. The contact form goes straight to a real inbox, presorted by reason.",
    cta: "Get in touch",
  },
];

export default function About() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <section className="saltire-hero -mt-[72px] pt-[72px] rounded-b-[var(--r-l)]">
        <div className="beams" aria-hidden="true">
          <div className="beam a" />
          <div className="beam b" />
          <div className="beam-edge a" />
          <div className="beam-edge b" />
        </div>

        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-14 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:items-center">
            <div className="min-w-0">
              <p className="eyebrow rise">The person behind the numbers</p>

              <h1 className="rise mt-6 text-[clamp(44px,6.6vw,92px)] font-[600] leading-[0.98] tracking-[-0.05em] text-balance">
                I struggled at school.{" "}
                <span className="serif-accent text-[1.06em] text-[var(--hero-muted)]">So I built this.</span>
              </h1>

              <p className="rise mt-6 max-w-[46ch] text-[clamp(17px,1.5vw,20px)] leading-[1.55] text-[var(--hero-muted)]">
                {site.name} is a free, independent guide to poverty, work and living costs in
                Scotland. It shows the local facts, explains who has the power to change them and
                helps people email the right MP and MSP.
              </p>

              <div className="rise mt-8 flex flex-wrap gap-3">
                <a
                  href="#why-i-built-it"
                  className="ui inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-white px-5 text-[15.5px] font-[580] text-[#00336f] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_10px_24px_-12px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-px"
                >
                  Read why I built it <span aria-hidden="true">→</span>
                </a>
                <Link
                  href="/methods"
                  className="glass ui inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] px-5 text-[15.5px] font-[560] text-white transition-colors hover:bg-white/10"
                >
                  How every figure is counted
                </Link>
              </div>
            </div>

            <div className="on-light scale-in min-w-0 rounded-[var(--r-l)] bg-[var(--surface)] p-6 text-[var(--ink)] shadow-[0_40px_80px_-40px_rgba(0,8,32,0.85)] sm:p-8">
              <p className="eyebrow">Who runs it</p>
              <h2 className="mt-3 text-[34px] font-[600] leading-[1.05] tracking-[-0.035em]">
                {site.author.name}
              </h2>
              <p className="mt-1 text-[15.5px] text-[var(--muted)]">{site.author.role}</p>
              <p className="mt-4 text-[16px] leading-[1.55] text-[var(--ink-2)]">
                I write and publish {site.name} myself. No political party, charity or campaign runs
                it.
              </p>
              <ul className="ui mt-5 flex flex-wrap gap-2 border-t border-[var(--rule)] pt-5">
                {["No party", "No ads", "No paywall", "No sign up"].map((item) => (
                  <li
                    key={item}
                    className="rounded-[var(--r-pill)] border border-[var(--rule-strong)] bg-[var(--surface-2)] px-3 py-1.5 text-[14px] text-[var(--ink-2)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Page>
        <div className="max-w-[1120px] mx-auto">
          <section id="why-i-built-it" className="scroll-mt-24 pt-20 sm:pt-28">
            <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(280px,0.62fr)_minmax(0,1.38fr)]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="eyebrow">My story</p>
                <h2 className="h2 mt-4 max-w-[13ch] text-[clamp(32px,4vw,50px)]">
                  Why I <span className="serif-accent text-[var(--action-text)]">built it</span>
                </h2>
                <p className="mt-4 max-w-[34ch] text-[17px] leading-[1.55] text-[var(--ink-2)]">
                  I&apos;m {site.author.name}. This site isn&apos;t a faceless resource. There&apos;s a
                  person behind it, and a reason it exists.
                </p>
              </div>

              <div className="min-w-0">
                <ol className="relative grid gap-4 before:absolute before:bottom-10 before:left-[15px] before:top-10 before:w-px before:bg-[var(--rule-strong)]">
                  {STORY.map((step, i) => (
                    <li key={step.when} className="relative pl-12">
                      <span
                        aria-hidden="true"
                        className="ui tnum absolute left-0 top-6 grid h-8 w-8 place-items-center rounded-full bg-[var(--action)] text-[14px] font-[600] text-white shadow-[0_0_0_4px_var(--brand-wash)]"
                      >
                        {i + 1}
                      </span>
                      <Reveal delay={i * 60}>
                        <div className="tile p-6 sm:p-7">
                          <p className="tile-key">{step.when}</p>
                          <h3 className="mt-2 text-[clamp(22px,2.4vw,28px)] font-[600] leading-[1.15] tracking-[-0.03em]">
                            {step.title}
                          </h3>
                          <p className="mt-3 text-[16.5px] leading-[1.6] text-[var(--ink-2)]">{step.body}</p>
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ol>

                <Reveal>
                  <div className="tile tile-blue mt-6 p-7 sm:p-9">
                    <p className="text-[clamp(28px,3.6vw,44px)] leading-[1.08] tracking-[-0.02em]">
                      <span className="serif-accent">It&apos;s the kind of thing I wish I&apos;d had at school.</span>
                    </p>
                    <p className="mt-5 max-w-[56ch] text-[16.5px] leading-[1.6] text-[var(--hero-muted)]">
                      When I saw a teacher had shared the site with their class, I built a{" "}
                      <Link href="/modern-studies-teaching-resources" className={`${TEXT_LINK} text-white`}>
                        section for Modern Studies
                      </Link>
                      .
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="pt-20 sm:pt-28" aria-labelledby="why-it-exists">
            <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
              <div>
                <p className="eyebrow">Why it exists</p>
                <h2 id="why-it-exists" className="h2 mt-4 max-w-[17ch] text-[clamp(32px,4vw,50px)]">
                  Every figure was already public. The problem was{" "}
                  <span className="serif-accent text-[var(--action-text)]">finding it.</span>
                </h2>
              </div>
              <div className="grid gap-4 text-[17px] leading-[1.6] text-[var(--ink-2)]">
                <p>
                  Some numbers were buried in large spreadsheets, government downloads or difficult
                  search tools. People should not need data skills or a free weekend to understand
                  what is happening in their own area.
                </p>
                <p>A public number is not truly useful if ordinary people cannot find or understand it.</p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {COVERAGE.map((item, i) => (
                <Reveal key={item.label} delay={i * 60}>
                  <div className="tile h-full p-6 sm:p-7">
                    <p className="figure-num text-[clamp(52px,6vw,76px)] text-[var(--action-text)]">{item.value}</p>
                    <p className="mt-5 text-[16px] leading-[1.45] text-[var(--ink-2)]">{item.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="mt-6 max-w-[72ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              Glasgow keeps its own detailed story because its figures are the worst in Scotland. The
              site then finds your MP and MSP and writes both emails.{" "}
              <strong className="text-[var(--ink)]">
                Nothing here is new information. It is the same information, made usable.
              </strong>
            </p>
          </section>

          <section className="pt-20 sm:pt-28" aria-labelledby="what-it-is-not">
            <p className="eyebrow">What it is not</p>
            <h2 id="what-it-is-not" className="h2 mt-4 max-w-[20ch] text-[clamp(32px,4vw,50px)]">
              Evidence, <span className="serif-accent text-[var(--action-text)]">not a campaign</span>
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {NOT_THIS.map((item, i) => (
                <Reveal key={item.title} delay={i * 60}>
                  <div className="tile h-full p-6 sm:p-7">
                    <h3 className="text-[20px] font-[600] leading-[1.2] tracking-[-0.025em]">{item.title}</h3>
                    <p className="mt-3 text-[16px] leading-[1.6] text-[var(--ink-2)]">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="pt-20 sm:pt-28" aria-label="Funding and practical help">
            <div className="grid gap-4 lg:grid-cols-2">
              <Reveal>
                <div className="tile h-full p-7 sm:p-9">
                  <p className="tile-key">How it is funded</p>
                  <h2 className="mt-3 text-[clamp(26px,3vw,36px)] font-[600] leading-[1.1] tracking-[-0.035em]">
                    Free to use. No ads, no paywall.
                  </h2>
                  <div className="mt-4 grid gap-3 text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
                    <p>
                      I also offer{" "}
                      <Link href="/for-organisations" className={TEXT_LINK}>
                        commissioned local evidence briefs
                      </Link>
                      , with scope and price agreed in advance. Paid work does not buy editorial
                      coverage or influence the published figures.
                    </p>
                    <p>
                      Visit analytics help me understand what people find useful, and email updates
                      are opt in.{" "}
                      <Link href="/privacy" className={TEXT_LINK}>
                        Read how your information is handled
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <div className="tile tile-night h-full p-7 sm:p-9">
                  <p className="tile-key">Practical help in Ayrshire</p>
                  <h2 className="mt-3 text-[clamp(26px,3vw,36px)] font-[600] leading-[1.1] tracking-[-0.035em]">
                    Free help for people who can&apos;t afford it.
                  </h2>
                  <div className="mt-4 grid gap-3 text-[16.5px] leading-[1.6] text-[var(--deep-muted)]">
                    <p>
                      I also run{" "}
                      <a
                        href="https://www.ayrshiretechhelp.co.uk/who-we-help"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${TEXT_LINK} text-white`}
                      >
                        Ayrshire Tech Help
                      </a>
                      , my local computer repair business. I keep a small number of free home visits
                      and essential repairs for people who cannot afford help and would otherwise be
                      cut off from family or essential online services.
                    </p>
                    <p>
                      This help is available in Ayrshire only. No proof of income or financial
                      paperwork is needed. It works on trust, with each request considered
                      individually and any free work agreed before booking. Family, neighbours and
                      support workers can ask on someone&apos;s behalf with their permission.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="pt-20 sm:pt-28" aria-labelledby="use-it">
            <p className="eyebrow">Use it, check it</p>
            <h2 id="use-it" className="h2 mt-4 max-w-[20ch] text-[clamp(32px,4vw,50px)]">
              It&apos;s yours to <span className="serif-accent text-[var(--action-text)]">use</span>
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {USE_IT.map((item) => (
                <Link key={item.href} href={item.href} className="tile group flex h-full flex-col p-6 no-underline sm:p-7">
                  <strong className="block text-[19px] font-[600] leading-[1.25] tracking-[-0.02em]">{item.title}</strong>
                  <span className="mt-2 block flex-1 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">{item.body}</span>
                  <span className="ui mt-5 inline-flex items-center gap-2 text-[15px] font-[580] text-[var(--action-text)]">
                    {item.cta}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
            <p className="ui mt-6 border-t border-[var(--rule)] pt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              {site.organisation.name}:{" "}
              <a href={site.organisation.url} target="_blank" rel="noopener noreferrer" className={TEXT_LINK}>
                {site.organisation.url.replace("https://", "")}
              </a>
            </p>
          </section>
        </div>

        <CTA
          title="Found something wrong?"
          body="A correction is more valuable than a share. If a figure here does not match the source, that is a serious problem and I want to know about it today."
          href="/corrections"
          cta="Report an error"
          secondaryHref="/methods"
          secondaryCta="Read the methods"
        />
      </Page>
    </>
  );
}
