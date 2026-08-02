import Link from "next/link";
import type { HolyroodMspContact } from "@/lib/data/holyrood";
import { site } from "@/lib/site";

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
}: {
  msp: HolyroodMspContact;
  area: string;
  regional?: boolean;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] bg-[var(--surface)] p-6 sm:p-7">
      <p className="kicker mb-3 text-[var(--action)]">
        {regional ? "Regional MSP" : "Constituency MSP"}
      </p>
      <Heading className={headingLevel === 2 ? "h2 mb-2" : "h3 mb-2"}>{msp.name}</Heading>
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
      </div>
      <p className="ui mt-4 text-[15px] leading-[1.5] text-[var(--ink-2)]">
        The draft opens in your own email app. Read it, add the details of your problem and change
        anything you want before sending.
      </p>
    </article>
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
      data. The checked date is shown on every page. MSPs can change, so if something looks wrong, {" "}
      <Link href="/contact">tell me and I will check it</Link>.
    </p>
  );
}
