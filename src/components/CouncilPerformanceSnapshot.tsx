import Link from "next/link";
import {
  councilPerformanceBySlug,
  performancePillars,
} from "@/lib/data/councilPerformanceIndex";

export default function CouncilPerformanceSnapshot({ slug }: { slug: string }) {
  const result = councilPerformanceBySlug[slug];
  if (!result) return null;

  const peerMovement = result.overallRank - result.peerRank;

  return (
    <section
      id="council-index"
      aria-labelledby="council-index-title"
      className="mt-10 scroll-mt-24 overflow-hidden rounded-[var(--r-l)] border border-[var(--rule)] bg-[var(--surface)]"
    >
      <div className="bg-[var(--deep)] p-5 text-[var(--deep-ink)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-[55ch]">
            <p className="kicker text-[#9db2ff]">Scotland Counted council index</p>
            <h2 id="council-index-title" className="mt-2 text-[clamp(28px,4vw,44px)] font-[640] leading-[1.05] tracking-[-0.03em]">
              {result.name} ranks #{result.overallRank} of 32
            </h2>
            <p className="mt-3 text-[16px] leading-[1.6] text-[#d7deed]">
              Its comparison score is {result.overallScore.toFixed(1)}, based on 53 official figures. We changed the rules 10,000 sensible ways. It usually finished between #{result.rankLow} and #{result.rankHigh}.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="tnum text-[54px] font-[640] leading-none text-[var(--action)]">#{result.overallRank}</p>
            <p className="ui mt-2 text-[15px] font-[580] text-[#d7deed]">national result</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--r-s)] border border-white/15 bg-white/5 p-4">
            <p className="ui text-[15px] text-[#c7d1e5]">Against similar councils</p>
            <p className="tnum mt-2 text-[28px] font-[640]">#{result.peerRank}</p>
            <p className={`ui mt-1 text-[15px] font-[560] ${peerMovement > 0 ? "text-[#63e6b5]" : peerMovement < 0 ? "text-[#ff9b87]" : "text-[#c7d1e5]"}`}>
              {peerMovement > 0 ? `up ${peerMovement} places` : peerMovement < 0 ? `down ${Math.abs(peerMovement)} places` : "same as main rank"}
            </p>
          </div>
          <div className="rounded-[var(--r-s)] border border-white/15 bg-white/5 p-4">
            <p className="ui text-[15px] text-[#c7d1e5]">What residents said</p>
            <p className="tnum mt-2 text-[28px] font-[640]">#{result.residentVerdict.rank}</p>
            <p className="ui mt-1 text-[15px] text-[#c7d1e5]">average across five questions: {result.residentVerdict.average.toFixed(1)}%</p>
          </div>
          <div className="rounded-[var(--r-s)] border border-white/15 bg-white/5 p-4">
            <p className="ui text-[15px] text-[#c7d1e5]">Data available</p>
            <p className="tnum mt-2 text-[28px] font-[640]">{result.coverage.toFixed(1)}%</p>
            <p className="ui mt-1 text-[15px] text-[#c7d1e5]">missing figures get the middle score</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {performancePillars.map((pillar) => {
            const value = result.pillars[pillar.key];
            return (
              <div key={pillar.key} className="border-l-2 border-[var(--brand)] pl-3">
                <p className="ui text-[15px] font-[560] leading-[1.3] text-[var(--ink-2)]">{pillar.label}</p>
                <p className="tnum mt-2 text-[22px] font-[640] text-[var(--ink)]">#{value.rank}</p>
                <p className="ui mt-1 text-[15px] text-[var(--muted)]">score {value.score.toFixed(1)}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-5">
          <p className="max-w-[62ch] text-[15px] leading-[1.55] text-[var(--ink-2)]">
            This score only compares councils with each other. It is not a percentage, pass mark or official grade. Poverty, crime, health, budget gaps and Crisis Grants are shown separately because they do not all measure how well a council is run.
          </p>
          <Link href="/blog/best-performing-councils-scotland" className="btn btn-secondary shrink-0">
            See all 32 and how we worked it out <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
