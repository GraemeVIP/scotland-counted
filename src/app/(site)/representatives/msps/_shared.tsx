import Link from "next/link";
import type { HolyroodMspContact } from "@/lib/data/holyrood";
import { site } from "@/lib/site";
import { formatVoteDate } from "@/lib/voting";
import PortraitLightbox from "@/components/PortraitLightbox";
import { ExplainText } from "@/components/Glossary";
import { representativeSlug } from "@/lib/representatives";

export function preparedMspEmailHref({
  msp,
  area,
  regional = false,
}: {
  msp: HolyroodMspContact;
  area: string;
  regional?: boolean;
}) {
  const subject = `Question from someone you represent in ${area}`;
  const body = `Dear ${msp.name},\n\nI live in ${area}${
    regional ? " and understand that you are one of my regional MSPs" : " and understand that you are my constituency MSP"
  }.\n\nI am writing about:\n[Say what is happening and how it affects you.]\n\nPlease tell me what you can do about this, and when I can expect an update.\n\nYours sincerely,\n[Your name]\n[Your home address]`;

  return `mailto:${msp.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function MspContactCard({
  msp,
  area,
  regional = false,
  headingLevel = 2,
  detailsHref,
}: {
  msp: HolyroodMspContact;
  area: string;
  regional?: boolean;
  headingLevel?: 2 | 3;
  detailsHref?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] bg-[var(--surface)] p-6 sm:p-7">
      <div className="flex items-start gap-4">
        {msp.photoUrl && (
          <PortraitLightbox
            src={msp.photoUrl}
            alt={`${msp.name}, ${msp.party} MSP`}
            sizes="80px"
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--r-s)] bg-[var(--surface-2)]"
          />
        )}
        <div>
          <p className="kicker mb-3 text-[var(--action)]">
            {regional ? "Regional MSP" : "Constituency MSP"}
          </p>
          {detailsHref ? (
            <Link
              href={detailsHref}
              className="no-underline hover:text-[var(--brand)]"
              aria-label={`View full details for ${msp.name}`}
            >
              <Heading className={headingLevel === 2 ? "h2 mb-2" : "h3 mb-2"}>{msp.name}</Heading>
            </Link>
          ) : (
            <Heading className={headingLevel === 2 ? "h2 mb-2" : "h3 mb-2"}>{msp.name}</Heading>
          )}
        </div>
      </div>
      <p className="ui text-[16px] leading-[1.5] text-[var(--ink-2)]">
        {msp.party} · represents {area}
      </p>

      <dl className="mt-6 grid gap-4">
        <div>
          <dt className="ui text-[15px] font-[750] text-[var(--ink)]">Email</dt>
          <dd className="mt-1 text-[16px] leading-[1.5] break-words">
            <a href={`mailto:${msp.email}`}>{msp.email}</a>
          </dd>
        </div>
        {msp.officeAddress && (
          <div>
            <dt className="ui text-[15px] font-[750] text-[var(--ink)]">Public office address</dt>
            <dd className="mt-1 text-[16px] leading-[1.55] text-[var(--ink-2)]">
              {msp.officeAddress}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={preparedMspEmailHref({ msp, area, regional })}
          className="btn btn-primary justify-center text-center"
        >
          Open a ready-written email
        </a>
        <a href={msp.profileUrl} className="btn btn-ghost justify-center text-center">
          Official Parliament profile
        </a>
        {detailsHref && (
          <Link href={detailsHref} className="btn btn-ghost justify-center text-center">
            Full details
          </Link>
        )}
      </div>
      <p className="ui mt-4 text-[15px] leading-[1.5] text-[var(--ink-2)]">
        The draft opens in your own email app. Read it, add the details of your problem and change
        anything you want before sending.
      </p>
    </article>
  );
}

export function MspProfileCard({
  msp,
  area,
  regional = false,
}: {
  msp: HolyroodMspContact;
  area: string;
  regional?: boolean;
}) {
  return (
    <article className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-[minmax(190px,0.7fr)_minmax(0,1.3fr)] sm:items-start">
        <div>
          <PortraitLightbox
            src={msp.photoUrl}
            alt={`${msp.name}, ${msp.party} MSP`}
            sizes="(max-width: 640px) 100vw, 280px"
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--r-s)] bg-[var(--surface-2)]"
            priority
          />
          <p className="ui mt-2 text-[14px] leading-[1.45] text-[var(--muted)]">
            Official Scottish Parliament portrait
          </p>
        </div>
        <div>
          <p className="kicker mb-3 text-[var(--action)]">
            {regional ? "Regional MSP" : "Constituency MSP"}
          </p>
          <h2 className="h2 mb-2">{msp.name}</h2>
          <p className="ui text-[17px] leading-[1.5] text-[var(--ink-2)]">
            {msp.party} · {regional ? `regional MSP for ${area}` : `MSP for ${area}`}
          </p>

          <dl className="mt-7 grid gap-5">
            <div>
              <dt className="ui text-[15px] font-[750] text-[var(--ink)]">In office since</dt>
              <dd className="mt-1 text-[16px] leading-[1.5]">
                <time dateTime={msp.termStart}>{formatVoteDate(msp.termStart, "en-GB")}</time>
              </dd>
            </div>
            <div>
              <dt className="ui text-[15px] font-[750] text-[var(--ink)]">Email</dt>
              <dd className="mt-1 break-words text-[16px] leading-[1.5]"><a href={`mailto:${msp.email}`}>{msp.email}</a></dd>
            </div>
            {msp.officeAddress && (
              <div>
                <dt className="ui text-[15px] font-[750] text-[var(--ink)]">Public office</dt>
                <dd className="mt-1 text-[16px] leading-[1.55] text-[var(--ink-2)]">{msp.officeAddress}</dd>
              </div>
            )}
          </dl>

          {(msp.partyRoles.length > 0 || msp.governmentRoles.length > 0 || msp.committeeRoles.length > 0) && (
            <div className="mt-7 border-t border-[var(--rule)] pt-5">
              <h3 className="h3 mb-3">Current roles</h3>
              <ul className="grid gap-2 text-[16px] leading-[1.5] text-[var(--ink-2)]">
                {[...msp.partyRoles, ...msp.governmentRoles, ...msp.committeeRoles].map((role) => <li key={role}>{role}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href={preparedMspEmailHref({ msp, area, regional })} className="btn btn-primary justify-center text-center">
          Open a ready-written email
        </a>
        <a href={msp.profileUrl} className="btn btn-ghost justify-center text-center">
          Official Parliament profile
        </a>
        <Link href={`/msp-reviews/${representativeSlug(msp.name)}`} className="btn btn-ghost justify-center text-center">
          Reviews and experiences
        </Link>
      </div>
      <p className="ui mt-4 text-[15px] leading-[1.5] text-[var(--ink-2)]">
        The draft opens in your own email app. Read it and change anything you want before sending.
      </p>
    </article>
  );
}

export function MspVotingRecord({ msp }: { msp: HolyroodMspContact }) {
  return (
    <section className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6 sm:p-8">
      <p className="kicker mb-3 text-[var(--brand)]">Recorded votes</p>
      <h2 className="h2 mb-3">How {msp.name} has voted</h2>
      <p className="text-[16px] leading-[1.6] text-[var(--ink-2)]">
        <ExplainText>
          These are the latest votes published for this MSP in the Scottish Parliament&apos;s 2026
          motion data. A vote shows what happened in that vote; it does not explain why a member
          voted that way.
        </ExplainText>
      </p>
      {msp.votes.length > 0 ? (
        <div className="mt-6 grid gap-3">
          {msp.votes.map((vote) => (
            <article key={`${vote.reference ?? vote.title}-${vote.date}-${vote.vote}`} className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="ui text-[16px] font-[750] leading-[1.4] text-[var(--ink)]">{vote.title}</h3>
                <span className={`ui shrink-0 rounded-full border px-3 py-1 text-[15px] font-[750] ${vote.vote.toLowerCase() === "yes" || vote.vote.toLowerCase() === "for" ? "border-[var(--good-text)] text-[var(--good-text)]" : "border-[var(--brand)] text-[var(--brand)]"}`}>
                  {vote.vote}
                </span>
              </div>
              <p className="ui mt-2 text-[15px] leading-[1.5] text-[var(--ink-2)]">
                <time dateTime={vote.date}>{formatVoteDate(vote.date)}</time>{vote.result ? ` · Result: ${vote.result}` : ""}{vote.reference ? ` · ${vote.reference}` : ""}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-[16px] leading-[1.6] text-[var(--ink-2)]">No recorded votes were available for this member in the current snapshot.</p>
      )}
      <p className="ui mt-5 text-[14px] leading-[1.5] text-[var(--muted)]">
        Source: <a href="https://data.parliament.scot/api/votesmotion?year=2026">Scottish Parliament Open Data, votes on motions 2026</a>. This page shows recorded votes only; it is not a score or a judgement.
      </p>
    </section>
  );
}

export function holyroodPersonJsonLd({
  msp,
  area,
  pagePath,
  regional = false,
  idSuffix = "msp",
}: {
  msp: HolyroodMspContact;
  area: string;
  pagePath: string;
  regional?: boolean;
  idSuffix?: string;
}) {
  const pageUrl = `${site.url}${pagePath}`;

  return {
    "@type": "Person",
    "@id": `${pageUrl}#${idSuffix}`,
    name: msp.name,
    url: pageUrl,
    jobTitle: `${regional ? "Regional" : "Constituency"} Member of the Scottish Parliament for ${area}`,
    email: `mailto:${msp.email}`,
    image: `${site.url}${msp.photoUrl}`,
    startDate: msp.termStart,
    ...(msp.officeAddress ? { address: msp.officeAddress } : {}),
    affiliation: { "@type": "Organization", name: msp.party },
    memberOf: {
      "@type": "GovernmentOrganization",
      name: "Scottish Parliament",
      url: "https://www.parliament.scot/",
    },
    sameAs: [msp.profileUrl],
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
  };
}

export function HolyroodSourceNote() {
  return (
    <p className="text-[17px] leading-[1.65] text-[var(--ink-2)]">
      Names, parties and public contact details come from the Scottish Parliament’s official open
      data. Portraits come from the member records and are covered by the Parliament&apos;s {" "}
      <a href="https://www.parliament.scot/about/copyright">copyright licence</a>. The checked date
      is shown on every page. MSPs can change, so if something looks wrong, {" "}
      <Link href="/contact">tell me and I will check it</Link>.
    </p>
  );
}
