import Link from "next/link";
import {
  FAMILY_SOURCE_LINE,
  FAMILY_SOURCE_URL,
  familyMeasuresFor,
  peerGroupsFor,
} from "@/lib/familyGroupDisplay";

/**
 * "Councils like yours", using the grouping the benchmarking body publishes,
 * never one invented here.
 *
 * This section existed as a refusal for a long time: deciding which councils
 * are alike is a judgement, and the site does not make judgements. The
 * Improvement Service already makes this one. It sorts all 32 councils into
 * family groups of eight, two separate sets, one by how urban or rural the
 * area is and one by deprivation, and publishes which set applies to each
 * measure and the group average alongside the data. Everything shown here is
 * theirs: the grouping, the averages and the series. This file only says it
 * in plain words.
 *
 * Tone rules carried over from CouncilCompare: figures are stated, never
 * scored. The trend sentence gives the first and latest published figure and
 * stops. Where low does not mean good, the note from the benchmarks row
 * travels with the figure.
 */
export default function FamilyGroupComparison({
  slug,
  councilName,
}: {
  slug: string;
  councilName: string;
}) {
  const peerGroups = peerGroupsFor(slug);
  const measures = familyMeasuresFor(slug);
  if (peerGroups.length === 0 || measures.length === 0) return null;

  const place = councilName.replace(/ Council$/, "");

  return (
    <section id="similar-councils" className="pt-14 scroll-mt-24">
      <p className="kicker mb-2 text-[var(--brand)]">Councils like yours</p>
      <h2 className="h2 mb-3">How {place} compares with similar councils</h2>
      <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
        Comparing a big city with a small island council is not fair on either. So the{" "}
        <a href={FAMILY_SOURCE_URL} rel="noopener noreferrer" target="_blank">
          Improvement Service
        </a>
        , which runs the national benchmarking, sorts all 32 councils into groups of eight and
        publishes an average for each group. The grouping and every average below are theirs,
        not mine. Bin, road and recycling measures are grouped by how urban or rural an area
        is. Collection and satisfaction measures are grouped by deprivation.
      </p>

      {/* Who "similar" actually means, named and linked. */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {peerGroups.map((group) => (
          <div
            key={group.kind}
            className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5"
          >
            <p className="ui text-[15px] font-[750] text-[var(--ink)]">
              For {group.groupedBy}
            </p>
            <p className="mt-1 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
              {place} is grouped with {group.label}:
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {group.peers.map((peer) => (
                <li key={peer.slug}>
                  <Link
                    href={`/councils/${peer.slug}`}
                    className="ui inline-block rounded-[var(--r-pill)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3 py-1.5 text-[14.5px] font-[620] text-[var(--ink-2)] no-underline transition-colors hover:border-[var(--brand)] hover:text-[var(--ink)]"
                  >
                    {peer.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* The figures: council, similar councils, Scotland, and the trend. */}
      <div className="mt-6 grid gap-3">
        {measures.map((measure) => (
          <article
            key={measure.code}
            className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="ui text-[16px] font-[750] leading-[1.35] text-[var(--ink)]">
                {measure.label}
              </p>
              <p className="ui tnum text-[14px] text-[var(--muted)]">{measure.year}</p>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-3">
              <div>
                <dt className="ui text-[13.5px] font-[700] text-[var(--muted)]">{place}</dt>
                <dd className="tnum mt-0.5 text-[19px] font-[780] text-[var(--ink)]">
                  {measure.council}
                </dd>
              </div>
              <div>
                <dt className="ui text-[13.5px] font-[700] text-[var(--muted)]">
                  Similar councils
                </dt>
                <dd className="tnum mt-0.5 text-[19px] font-[780] text-[var(--ink-2)]">
                  {measure.family}
                </dd>
              </div>
              {measure.scotland && (
                <div>
                  <dt className="ui text-[13.5px] font-[700] text-[var(--muted)]">Scotland</dt>
                  <dd className="tnum mt-0.5 text-[19px] font-[780] text-[var(--ink-2)]">
                    {measure.scotland}
                  </dd>
                </div>
              )}
            </dl>
            <p className="mt-3 text-[15px] leading-[1.5] text-[var(--ink-2)]">
              In {measure.firstYear}, the first year published, the figure here was{" "}
              {measure.firstValue}. Figures are adjusted for inflation by the publisher, so the
              two years can be compared.
            </p>
            {measure.note && (
              <p className="mt-2 text-[14.5px] leading-[1.5] text-[var(--muted)]">
                {measure.note}
              </p>
            )}
          </article>
        ))}
      </div>

      <p className="mt-5 max-w-[68ch] text-[15px] leading-[1.55] text-[var(--muted)]">
        Groups and averages from the {FAMILY_SOURCE_LINE}. &ldquo;Similar councils&rdquo; is
        the average for the group of eight that includes {place}, on the set of councils the
        publisher uses for that measure.
      </p>
    </section>
  );
}
