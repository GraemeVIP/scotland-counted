import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published individual business costs CSV files for
 * 2022/23 to 2026/27 (checked 22 November 2026 across all 650 UK seats, over
 * 350,000 claim lines). Quoted descriptions are IPSA's exact wording.
 * TV licence ranking: every "TV licence" line for every MP, with lines on the
 * same day added together, counting only full licence payments of £140 or
 * more (monthly instalments left out), then the most bought in any 365 days.
 * "406 MPs" = every MP with at least one IPSA line under the cost type
 * "TV licence", monthly instalments included (rechecked 23 November 2026).
 * "91 repayments out of 20,879 claims" counts every Scottish MP claim line in
 * public/data/scottish-mp-receipts.json with an amount repaid above zero.
 * Gifts: Register of Members' Financial Interests (Mar and Jun 2026 entries).
 */

import {
  type PartyKey,
  PARTY,
  Who,
  QuickTake,
  Finding as KitFinding,
  ChartFrame,
  RankList,
  Receipt,
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const POYNTON = {
  name: "Gregor Poynton",
  href: mp("livingston"),
  p: "Labour" as PartyKey,
  place: "Livingston",
};

const FINDINGS = 4;

function Finding({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <KitFinding n={n} of={FINDINGS} id={id}>
      {children}
    </KitFinding>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** Most full TV licences bought in any 12 months, all 650 UK seats, 2022 to 2027. */
const UK_TV: {
  name: string;
  seat: string;
  href?: string;
  p?: PartyKey;
  count: number;
  when: string;
}[] = [
  { name: "Gregor Poynton", seat: "Livingston", href: mp("livingston"), p: "Labour", count: 4, when: "Dec 2024 to Nov 2025" },
  {
    name: "Alistair Carmichael",
    seat: "Orkney and Shetland",
    href: mp("orkney-and-shetland"),
    p: "Lib Dem",
    count: 3,
    when: "June 2024 to June 2025",
  },
  { name: "Sammy Wilson", seat: "East Antrim", count: 3, when: "Nov 2022 to Nov 2023" },
  { name: "Liz Saville-Roberts", seat: "Dwyfor Meirionnydd", count: 3, when: "Mar 2025 to Feb 2026" },
  { name: "Llinos Medi", seat: "Ynys Môn", count: 3, when: "Jan 2025 to Nov 2025" },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function GregorPoyntonMpFourTvLicencesLivingston() {
  return (
    <Prose>
      <QuickTake
        items={[
          <>
            A TV licence lasts a whole year. Livingston MP{" "}
            <Link href={POYNTON.href}>Gregor Poynton</Link> billed you for <strong>four in 11 months</strong>{" "}
            (<strong>£688</strong>).
          </>,
          <>
            <strong>No other MP out of all 650 in the UK</strong> has claimed four full licences in
            a year since 2022.
          </>,
          <>
            Taxpayers also bought his <strong>office TV</strong> (£228.97), the aerial (£30) and a
            stand (£40.79).
          </>,
          <>
            On top of that, his <strong>£5,059 taxi bill</strong> in 2025/26 was the biggest in
            Scotland.
          </>,
        ]}
      />

      <Spotlight
        person={POYNTON}
        kicker="18 December 2024 to 26 November 2025"
        amount="£688"
        headline="Four TV licences in 11 months, all paid by you."
        lines={[
          { meta: "18 Dec 2024 · Office Costs · TV licence", what: "TVLICENSING.CO.UK", amount: "£169.50" },
          { meta: "14 Feb 2025 · Office Costs · TV licence", what: "TVLICENSING.CO.UK", amount: "£169.50" },
          { meta: "4 Nov 2025 · paid in two parts", what: "TVLICENSING.CO.UK", amount: "£174.50" },
          { meta: "26 Nov 2025 · paid in two parts", what: "TVLICENSING.CO.UK", amount: "£174.50" },
        ]}
      >
        <p>
          Licence two landed <strong>eight weeks</strong> after licence one. Licences three and four
          landed <strong>22 days</strong> apart in the exact same month.
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="four-licences">
        Four licences in 11 months
      </Finding>
      <P>
        One TV licence covers one address for 12 months. IPSA only allows a licence for an MP&apos;s
        local office, not their flat in London or their home.
      </P>
      <P>
        Labour&apos;s <Link href={POYNTON.href}>Gregor Poynton</Link> runs his Livingston office out
        of the Craigsfarm Community Hub in Craigshill. His files show one office TV, one aerial and
        one stand.
      </P>
      <P>
        Yet between December 2024 and November 2025, taxpayers paid for four separate licences. Not
        one note in IPSA&apos;s file says where they were used, or why.
      </P>

      <Tiles
        items={[
          { value: "4", label: "TV licences in 11 months", hot: true },
          { value: "£688", label: "for the four licences alone" },
          { value: "£988", label: "total TV bill, with the set, aerial and stand" },
        ]}
      />

      <Expand summary="See the proof: every TV line, word for word">
        <Receipt
          person={POYNTON}
          heading="IPSA records · TV licences · 2024/25 to 2026/27"
          lines={[
            { meta: "18 Dec 2024 · 2024/25", what: "TVLICENSING.CO.UK", amount: "£169.50" },
            { meta: "14 Feb 2025 · 2024/25", what: "TVLICENSING.CO.UK", amount: "£169.50" },
            { meta: "4 Nov 2025 · part 1", what: "TVLICENSING.CO.UK [200013634-164]", amount: "£54.98" },
            { meta: "4 Nov 2025 · part 2", what: "TVLICENSING.CO.UK [200013609-437]", amount: "£119.52" },
            { meta: "26 Nov 2025 · part 1", what: "TVLICENSING.CO.UK [200013634-163]", amount: "£72.67" },
            { meta: "26 Nov 2025 · part 2", what: "TVLICENSING.CO.UK [200013609-436]", amount: "£101.83" },
          ]}
          total={{ label: "Four licences · all paid · £0 repaid", amount: "£688.00" }}
          footer="Wording as printed by IPSA. IPSA paid each November licence in two parts, one for each of its money years. Added up, each is a full £174.50 licence."
        />
        <Receipt
          heading="IPSA records · The TV itself · 2024/25"
          lines={[
            { meta: "31 Oct 2024 · Equipment · Television", what: "TV Aerial Euipment", amount: "£30.00" },
            { meta: "4 Nov 2024 · Equipment · Television", what: "Office TV", amount: "£228.97" },
            { meta: "14 Feb 2025 · Stationery & printing", what: "TV Stand Purchase - Equipment", amount: "£40.79" },
          ]}
          total={{ label: "TV, aerial and stand", amount: "£299.76" }}
          footer="Wording and spelling as printed by IPSA. The TV stand was filed under stationery, on the same day as the second licence."
        />
      </Expand>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-number-one">
        Top of all 650 MPs in the UK
      </Finding>
      <P>
        Across five years of files for all 650 MPs, <strong>406 MPs</strong> put at least one TV
        licence on expenses.
      </P>
      <P>
        Just 12 other MPs ever hit three full licences in 12 months. <strong>Nobody else hit four.</strong>
      </P>

      <ChartFrame
        kicker="All 650 UK seats · 2022/23 to 2026/27"
        title="Most TV licences billed in any 12 months"
        caption="Source: IPSA claim files, all MPs. Five shown. Only Scottish MPs are linked."
      >
        <RankList
          max={4}
          rows={UK_TV.map((r) => ({
            key: r.name,
            who: r.p ? (
              <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />
            ) : (
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-[620] text-[var(--ink)]">{r.name}</span>
                <span className="ui text-[13.5px] text-[var(--muted)]">{r.seat}</span>
              </span>
            ),
            side: r.when,
            value: r.count,
            label: `${r.count} licences`,
            colour: r.p ? PARTY[r.p].colour : "var(--rule-strong)",
            highlight: r.count === 4,
          }))}
        />
      </ChartFrame>

      <P>
        In Scotland alone, 29 MPs billed £10,754 for TV licences.{" "}
        <Link href="/blog/scottish-mps-tv-licence-expenses">See the full Scottish list</Link>.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="other-claims">
        Scotland&apos;s biggest taxi bill, plus family flights and Pickfords
      </Finding>
      <P>
        In 2025/26, his total cost hit <strong>£372,851</strong>, seventh highest in Scotland. The
        TV licences are the small change.
      </P>

      <Spotlight
        person={POYNTON}
        kicker="2025/26 · MP travel · Taxi"
        amount="£5,059"
        headline="Nearly £100 a week on taxis. Top in Scotland."
      >
        <p>
          Only one MP out of all 650 in the UK spent more on taxis that year. Almost all of it
          (£4,939) went on trips between London and Livingston.
        </p>
      </Spotlight>

      <PointList
        items={[
          {
            key: "family",
            title: "£6,232 on family flights (2025/26)",
            children: (
              <>
                Fourth highest of the 44 MPs who billed for family flights that year, up from
                £2,325 the year before.
              </>
            ),
          },
          {
            key: "council",
            title: "£3,630 council tax on his IPSA funded home (2025/26)",
            children: (
              <>
                Paid to West Lothian Council, on top of £20,800 in rent. Only one Scottish MP
                claimed more council tax.
              </>
            ),
          },
          {
            key: "pickfords",
            title: "£4,223 to Pickfords, the removal firm",
            children: (
              <>
                A claim dated 24 January 2025, and the biggest removals bill of any sitting Scottish
                MP since 2022.
              </>
            ),
          },
          {
            key: "pr",
            title: "£9,600 for a PR firm",
            children: (
              <>
                Paid to &ldquo;BB Partners Advisory Ltd - Comms and Media Support&rdquo; out of his
                staff pot in March 2025, on top of his own office team.
              </>
            ),
          },
          {
            key: "flights",
            title: "£24,291 on his own flights (2025/26)",
            children: (
              <>
                Plus £1,525 on parking and £1,999 on hire cars. Next door in Edinburgh,{" "}
                <Link href={mp("edinburgh-south-west")}>Scott Arthur</Link> and{" "}
                <Link href={mp("edinburgh-north-and-leith")}>Tracy Gilbert</Link> both spent under
                £700 on flights and took the train instead.
              </>
            ),
          },
          {
            key: "promo",
            title: "£1,990 for Royal Mail door drops",
            children: (
              <>
                Plus £1,716 to BIG LIME SIGNS AND GRA and £1,084 on a video app called KAPWING PRO
                PLAN.
              </>
            ),
          },
        ]}
      />

      <P>
        He also logged £1,110 in free sport tickets on his Register of Interests: £750 at
        Lord&apos;s cricket from a PR firm (June 2026) and £360 for four Carabao Cup final tickets
        from the FA (March 2026).
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        How did four licences slip past IPSA?
      </Finding>
      <P>
        Look at any single £169.50 or £174.50 receipt on its own and it looks fine. MPs are allowed
        an office TV licence.
      </P>
      <P>
        Put all four dates side by side, though, and the pattern jumps out. Every claim was paid,
        and not a single penny shows as repaid. Across Scotland, MPs have paid back just 91 of
        20,879 claims since 2022.
      </P>
      <P>Three basic questions for <Link href={POYNTON.href}>Gregor Poynton</Link>:</P>

      <PointList
        items={[
          {
            key: "where",
            title: "Which buildings did four licences cover?",
            children: <>His files show one TV bought, and no address for any of the licences.</>,
          },
          {
            key: "refund",
            title: "Did TV Licensing refund any of them?",
            children: <>If they did, the money never made it back into IPSA&apos;s public log.</>,
          },
          {
            key: "taxis",
            title: "Why £5,059 on taxis in one year?",
            children: <>More than every other Scottish MP, and 648 of the 650 MPs in the UK.</>,
          },
        ]}
      />

      <Aside title="See the rest of Scotland's claims">
        <p>
          Four TV licences is just one slice of the file. See{" "}
          <Link href="/blog/scottish-mps-tv-licence-expenses">all 29 MPs claiming TV licences</Link>,{" "}
          <Link href="/blog/worst-scottish-mp-expenses">the worst Scottish MP expenses</Link> or{" "}
          <Link href="/mp-expenses-scotland">every Scottish MP ranked</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See all his TV claims (or check your own MP)"
        body="Open our live Receipt Finder on Gregor Poynton's TV claims. Copy any receipt for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=livingston&q=TV"
        cta="See the TV receipts"
      />
    </Prose>
  );
}
