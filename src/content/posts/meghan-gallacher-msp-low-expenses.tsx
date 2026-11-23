import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written with the graeme-writing skill. Figures: Holyrood's own expense
 * files (allowances_member_transactions, claim months May 2021 to June
 * 2025), compared across the 63 MSPs who sat before 2026 and still sit
 * now (Tim Eagle joined in November 2023). The flat groups come from Annex A of the MSP expenses rules.
 */

import {
  type PartyKey,
  QuickTake,
  Finding,
  Face,
  Party,
  RankList,
  Who,
  Tiles,
  PointList,
  Expand,
} from "@/components/ExpenseKit";

const FINDINGS = 3;
const msp = (path: string) => `/representatives/msps/${path}`;

const GALLACHER = {
  name: "Meghan Gallacher",
  href: msp("regions/central-scotland-and-lothians-west/meghan-gallacher"),
  p: "Conservative" as PartyKey,
};
const SIMPSON = {
  name: "Graham Simpson",
  href: msp("regions/central-scotland-and-lothians-west/graham-simpson"),
  p: "Reform UK" as PartyKey,
};

/** 2024/25 totals for the 63 MSPs who sat before 2026 and still sit. */
const LOWEST: { name: string; href?: string; p: PartyKey; note: string; cost: number; her?: boolean }[] = [
  { name: "Lorna Slater", href: msp("constituencies/edinburgh-central"), p: "Greens", note: "Edinburgh Central", cost: 13611 },
  { name: "Meghan Gallacher", href: GALLACHER.href, p: "Conservative", note: "Central Scotland and Lothians West", cost: 15764, her: true },
  { name: "Ivan McKee", href: msp("constituencies/glasgow-easterhouse-and-springburn"), p: "SNP", note: "Glasgow Easterhouse and Springburn", cost: 16653 },
  { name: "Claire Baker", href: msp("regions/mid-scotland-and-fife/claire-baker"), p: "Labour", note: "Mid Scotland and Fife", cost: 18266 },
];

export default function MeghanGallacherMspLowExpenses() {
  return (
    <Prose>
      <QuickTake
        items={[
          <>
            In 2024/25, Meghan Gallacher cost taxpayers <strong>£15,764</strong>. The typical MSP cost
            £33,693.
          </>,
          <>
            She has claimed <strong>nothing at all for travel</strong> since 2021. Not one train ticket.
            Not one mile.
          </>,
          <>
            Her Edinburgh hotels came to <strong>£2,369</strong> across four years.
          </>,
          <>
            <Link href={SIMPSON.href}>Graham Simpson</Link> covers the same area. In 2024/25 he cost <strong>£34,416</strong>, more than
            twice as much.
          </>,
        ]}
      />

      <div className="not-prose my-10 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] border-l-[6px] border-l-[var(--good)] bg-[color-mix(in_srgb,var(--good)_6%,var(--surface))] px-5 py-6 sm:px-7">
        <div className="flex items-center gap-4">
          <Face name={GALLACHER.name} href={GALLACHER.href} size={72} />
          <div className="min-w-0">
            <p className="ui text-[13px] font-[660] uppercase tracking-[0.06em] text-[var(--muted)]">
              Her bill to taxpayers, 2024/25
            </p>
            <Link href={GALLACHER.href} className="text-[20px] font-[680]">
              Meghan Gallacher MSP
            </Link>
            <div className="mt-1">
              <Party p="Conservative" note="Central Scotland and Lothians West" />
            </div>
          </div>
        </div>
        <p className="figure-num mt-5 text-[44px] leading-none text-[var(--good-text)]">£15,764</p>
        <p className="mt-3 text-[17px] leading-[1.6] text-[var(--ink-2)]">
          Less than half what the typical MSP cost. £0 on travel. No flat.
        </p>
      </div>

      <P>
        Most of what we write about MSP expenses is the bad stuff. Flats, hotels, leaflets, gadgets.
        So it&apos;s only fair to show what it looks like when someone keeps the bill down.
      </P>
      <P>
        We checked every claim from the 63 MSPs who sat at Holyrood before 2026 and are still there
        now. One name kept coming out near the bottom.
      </P>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} of={FINDINGS} id="lowest">
        Second lowest of 63 MSPs
      </Finding>
      <P>
        In 2024/25, only one of the 63 cost less than Meghan Gallacher. That was{" "}
        <Link href={msp("constituencies/edinburgh-central")}>Lorna Slater</Link>, an Edinburgh MSP. MSPs from Edinburgh can&apos;t claim for hotels or a flat at all, so their
        bills start lower.
      </P>

      <RankList
        rows={LOWEST.map((r) => ({
          key: r.name,
          who: <Who face name={r.name} href={r.href} p={r.p} note={r.note} />,
          value: r.cost,
          label: `£${r.cost.toLocaleString("en-GB")}`,
          colour: r.her ? "var(--good)" : "var(--rule-strong)",
          highlight: r.her,
        }))}
      />

      <P>
        The year before was the same story. In 2023/24 she cost £15,504. The typical MSP cost £33,107.
      </P>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} of={FINDINGS} id="no-travel">
        Not a penny on travel in four years
      </Finding>
      <P>
        Every MSP can claim for getting between home and Holyrood, by train or by car. Most do. The
        typical MSP we checked billed <strong>£9,517</strong> for travel over four years, for them and
        their staff. For their own trips alone, it was £6,710.
      </P>
      <P>
        Meghan Gallacher has claimed <strong>nothing</strong>. Not in four years of records. Only three
        of the 63 MSPs we checked have a travel bill of zero, and she&apos;s one of them.
      </P>

      <Tiles
        items={[
          { value: "£0", label: "Her travel claims, May 2021 to June 2025" },
          { value: "£2,369", label: "Her Edinburgh hotels across the same four years" },
          { value: "£0", label: "Edinburgh flat. She has never billed for one" },
        ]}
      />

      <P>
        Her office in Lanarkshire is cheap too. Rent and service charges come to about £3,400 a year.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} of={FINDINGS} id="same-region">
        Same region, very different bill
      </Finding>
      <P>
        <Link href={SIMPSON.href}>Graham Simpson</Link> covers the same region. He was a Conservative,
        like her, until he joined Reform UK in August 2025. He lives in East Kilbride. Under the rules, that
        puts him in the group that can rent an Edinburgh flat, and he does.
      </P>

      <Tiles
        items={[
          { value: "£15,764", label: "Meghan Gallacher, 2024/25" },
          { value: "£34,416", label: "Graham Simpson, 2024/25", hot: true },
          { value: "22,544", label: "Car miles Simpson claimed in four years. Hers: none", hot: true },
        ]}
      />

      <P>
        Same patch of Scotland. Same job. One of them cost you less than half what the other did.
        That&apos;s why we&apos;ve <Link href="/blog/msp-edinburgh-flats-commuter-belt">looked hard at
        the flat rules</Link>. If one MSP can keep the bill this low, the rest can do a lot better.
      </P>

      <PointList
        items={[
          {
            key: "leaflets",
            title: "Where does her money go?",
            children: (
              <>
                Mostly her yearly report, printed and posted to homes in her region. In March 2025 that
                came to £8,750. It&apos;s her biggest cost by far.
              </>
            ),
          },
          {
            key: "flat",
            title: "Could she have had a flat?",
            children: (
              <>
                It depends on where an MSP lives, and we don&apos;t publish home addresses. Only homes in
                Group 3 seats, over 90 minutes away, get a flat. All North Lanarkshire seats are Group
                2: hotel nights only. She has never billed for a flat.
              </>
            ),
          },
          {
            key: "staff",
            title: "What about staff pay?",
            children: (
              <>
                Staff wages aren&apos;t in Holyrood&apos;s expense files, so they aren&apos;t in these
                figures for any MSP. A few small staff costs, like train fares, are in the files, and we
                counted them for everyone. So the comparison is fair.
              </>
            ),
          },
        ]}
      />

      <Expand summary="How we worked this out">
        <div className="space-y-3 text-[16px] leading-[1.6] text-[var(--ink-2)]">
          <p>
            Every figure comes from Holyrood&apos;s own expense files. We added up all claims for each
            MSP by year. Staff wages are not in those files. A small amount of other staff costs is,
            and we counted it for every MSP.
          </p>
          <p>
            We compared the 63 MSPs who sat at Holyrood before 2026 and are still MSPs now. Most were
            there from 2021. Tim Eagle joined in November 2023. The files run to June 2025. The
            typical figure is the middle one of the 63, so a few very high bills don&apos;t skew it.
          </p>
          <p>
            Travel means every claim for travel and car miles, by the MSP and their staff. The
            £6,710 counts the MSP&apos;s own trips only. Simpson&apos;s home town comes from
            what he told Parliament on 11 November 2026.
          </p>
        </div>
      </Expand>

      <Aside title="More on MSP expenses">
        <p>
          See how{" "}
          <Link href="/blog/msp-edinburgh-flats-commuter-belt">
            taxpayers rent Edinburgh flats for MSPs who live 50 miles away
          </Link>
          , or the full{" "}
          <Link href="/blog/msp-expenses-scotland-investigation">MSP expenses investigation</Link>.
        </p>
      </Aside>

      <PostCTA
        title="Check your own MSP"
        body="Look up any MSP's claims, line by line."
        href="/mp-expenses-scotland/search?who=msp"
        cta="Search MSP receipts"
      />
    </Prose>
  );
}
