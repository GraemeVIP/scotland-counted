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
            <strong>Taxpayers</strong> paid for <strong>four TV licences in 11 months</strong> for
            Livingston MP <Link href={POYNTON.href}>Gregor Poynton</Link>. That cost{" "}
            <strong>£688</strong>.
          </>,
          <>One TV licence covers one place for a whole year.</>,
          <>
            <strong>No other MP in the UK</strong> billed four in a year. We checked every MP since
            2022.
          </>,
          <>
            You also paid for the <strong>office TV</strong> (£228.97), the aerial (£30) and a TV stand
            (£40.79).
          </>,
          <>
            He billed <strong>£5,059 for taxis</strong> in 2025/26. That is the most of any Scottish MP.
          </>,
        ]}
      />

      <Spotlight
        person={POYNTON}
        kicker="18 December 2024 to 26 November 2025"
        amount="£688"
        headline="You paid for four TV licences in 11 months."
        lines={[
          { meta: "18 Dec 2024 · Office Costs · TV licence", what: "TVLICENSING.CO.UK", amount: "£169.50" },
          { meta: "14 Feb 2025 · Office Costs · TV licence", what: "TVLICENSING.CO.UK", amount: "£169.50" },
          { meta: "4 Nov 2025 · split over two budget years", what: "TVLICENSING.CO.UK", amount: "£174.50" },
          { meta: "26 Nov 2025 · split over two budget years", what: "TVLICENSING.CO.UK", amount: "£174.50" },
        ]}
      >
        <p>
          The second licence came <strong>eight weeks</strong> after the first. The last two came{" "}
          <strong>22 days</strong> apart.
        </p>
      </Spotlight>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="four-licences">
        Four licences, one office TV
      </Finding>
      <P>
        <Link href={POYNTON.href}>Gregor Poynton</Link> won Livingston for Labour in July 2024. His
        local office is at the Craigsfarm Community Hub in Craigshill.
      </P>
      <P>
        A TV licence lets you watch live TV in one place for a year. IPSA, the body that pays
        MPs&apos; expenses, only pays for a licence at an MP&apos;s local office.
      </P>
      <P>
        So why four? IPSA&apos;s files don&apos;t say. They show one office TV, one aerial and one TV
        stand.
      </P>

      <Tiles
        items={[
          { value: "4", label: "TV licences in 11 months", hot: true },
          { value: "£688", label: "for the four licences" },
          { value: "£988", label: "on TV in all, with the set, aerial and stand" },
        ]}
      />

      <Expand summary="See the proof: every TV line, word for word">
        <Receipt
          person={POYNTON}
          heading="IPSA records · TV licences · 2024/25 to 2026/27"
          lines={[
            { meta: "18 Dec 2024 · 2024/25", what: "TVLICENSING.CO.UK", amount: "£169.50" },
            { meta: "14 Feb 2025 · 2024/25", what: "TVLICENSING.CO.UK", amount: "£169.50" },
            { meta: "4 Nov 2025 · 2025/26 part", what: "TVLICENSING.CO.UK [200013634-164]", amount: "£54.98" },
            { meta: "4 Nov 2025 · 2026/27 part", what: "TVLICENSING.CO.UK [200013609-437]", amount: "£119.52" },
            { meta: "26 Nov 2025 · 2025/26 part", what: "TVLICENSING.CO.UK [200013634-163]", amount: "£72.67" },
            { meta: "26 Nov 2025 · 2026/27 part", what: "TVLICENSING.CO.UK [200013609-436]", amount: "£101.83" },
          ]}
          total={{ label: "Four licences · all paid · £0 repaid", amount: "£688.00" }}
          footer="Wording as printed by IPSA. IPSA split each November licence across two budget years. Added up, each is a full £174.50 licence."
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
        Number one out of all 650 UK MPs
      </Finding>
      <P>
        We checked every TV licence claim from all 650 UK seats, from 2022 to 2027. We counted full
        licence payments only, not monthly instalments.
      </P>
      <P>
        <strong>459 MPs</strong> billed for at least one. Only 12 others ever managed three in a
        year. <strong>Nobody else managed four.</strong>
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
        Across Scotland, 29 MPs billed you £10,754 for TV licences.{" "}
        <Link href="/blog/scottish-mps-tv-licence-expenses">See all 29 Scottish MPs</Link>.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="other-claims">
        Taxis, family flights and a removal van
      </Finding>
      <P>
        His full bill for 2025/26 was <strong>£372,851</strong>. Only six Scottish MPs billed more.
        Here is what stood out.
      </P>

      <Spotlight
        person={POYNTON}
        kicker="2025/26 · MP travel · Taxi"
        amount="£5,059"
        headline="The biggest taxi bill of any Scottish MP."
      >
        <p>
          Across all 650 UK MPs, only one billed more for taxis that year. £4,939 of it was for trips
          between London and his seat.
        </p>
      </Spotlight>

      <PointList
        items={[
          {
            key: "family",
            title: "£6,232 on family flights (2025/26)",
            children: (
              <>
                IPSA calls this dependant travel. It was the 10th highest of all UK MPs. The year before,
                it was £2,325.
              </>
            ),
          },
          {
            key: "council",
            title: "£3,630 council tax on his IPSA funded home (2025/26)",
            children: (
              <>
                Paid to West Lothian Council. Only one Scottish MP billed more. IPSA also paid
                £20,800 rent on that home.
              </>
            ),
          },
          {
            key: "pickfords",
            title: "£4,223 to Pickfords, the removal firm",
            children: (
              <>
                Filed as &ldquo;Removals&rdquo; on 24 January 2025. It is the biggest removals bill of
                any of Scotland&apos;s 57 MPs since 2022.
              </>
            ),
          },
          {
            key: "pr",
            title: "£9,600 for a PR firm",
            children: (
              <>
                &ldquo;BB Partners Advisory Ltd - Comms and Media Support&rdquo;, paid from his staff
                budget in March 2025. That is on top of his own staff.
              </>
            ),
          },
          {
            key: "flights",
            title: "£24,291 on his own flights (2025/26)",
            children: (
              <>
                Plus £1,525 on parking and £1,999 on hire cars. Two Edinburgh MPs,{" "}
                <Link href={mp("edinburgh-south-west")}>Scott Arthur</Link> and{" "}
                <Link href={mp("edinburgh-north-and-leith")}>Tracy Gilbert</Link>, spent under £700 on
                flights. They mostly took the train.
              </>
            ),
          },
          {
            key: "promo",
            title: "£1,990 for Royal Mail to post through doors",
            children: (
              <>
                Plus £1,716 to BIG LIME SIGNS AND GRA and £1,084 on a video editing app, KAPWING PRO
                PLAN.
              </>
            ),
          },
        ]}
      />

      <P>
        Away from expenses, his Register of Interests lists tickets and hospitality at Lord&apos;s
        Cricket Ground from Hanbury Strategy and Communications, worth £750 (June 2026). It also lists
        four Carabao Cup final tickets from the Football Association, worth £360 (March 2026). He
        declared both, as the rules require.
      </P>

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        Why IPSA paid it, and who stops this
      </Finding>
      <P>
        IPSA&apos;s rules allow a TV licence for an MP&apos;s local office. So each licence, on its
        own, passed the check.
      </P>
      <P>
        But nobody seems to have asked why one office needed four in 11 months. IPSA paid every one.
        £0 has been paid back. The rules let it through, and that is the scandal.
      </P>

      <section className="not-prose my-10 overflow-hidden rounded-[var(--r-m)] bg-[#10141d] px-6 py-7 text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)] ring-1 ring-[#ff4d4d]/40 sm:px-8 sm:py-8">
        <p className="ui text-[13px] font-[660] uppercase tracking-[0.07em] opacity-75">Who stops this?</p>
        <p className="figure-num mt-2 text-[48px] leading-none text-[#ff5757] sm:text-[56px]">Nobody.</p>
        <ul className="mt-6 space-y-4 text-[17px] leading-[1.55]">
          <li>
            IPSA only exists because of <strong>a law MPs passed themselves</strong> in 2009, after the
            last expenses scandal.
          </li>
          <li>
            IPSA&apos;s own files show just <strong>91 repayments out of 20,879 claims</strong> by
            Scottish MPs since 2022. That is fewer than 1 in 200.
          </li>
          <li className="text-[20px] font-[700] leading-[1.35]">
            Four TV licences in 11 months, and nobody said no.
          </li>
        </ul>
      </section>

      <P>
        Three plain questions for <Link href={POYNTON.href}>Gregor Poynton</Link> and IPSA have no
        answer in the public files:
      </P>

      <PointList
        items={[
          {
            key: "where",
            title: "Which places did the four licences cover?",
            children: <>IPSA&apos;s files show one office TV. They give no address for any licence.</>,
          },
          {
            key: "refund",
            title: "Were any licences refunded by TV Licensing?",
            children: <>If so, the refund never shows up. IPSA&apos;s files show £0 paid back.</>,
          },
          {
            key: "taxis",
            title: "Why £5,059 on taxis in one year?",
            children: <>That was more than any other Scottish MP, and all but one MP in the UK.</>,
          },
        ]}
      />

      <Aside title="Part of a wider pattern in Westminster">
        <p>
          <Link href={POYNTON.href}>Gregor Poynton</Link> is not alone. See{" "}
          <Link href="/blog/worst-scottish-mp-expenses">the worst Scottish MP expenses</Link>,{" "}
          <Link href="/blog/scottish-mps-tv-licence-expenses">29 MPs who billed you for a TV licence</Link>{" "}
          and{" "}
          <Link href="/blog/kilmarnock-mp-23437-electricity-bill">a £23,437 power bill paid in one day</Link>
          . Or compare <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <PostCTA
        title="See all his TV claims (or check your own MP)"
        body="Open our live Receipt Finder on Gregor Poynton's TV claims. Copy any claim for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=livingston&q=TV"
        cta="See the TV receipts"
      />

      <P>
        Want the big picture? See <Link href="/mp-expenses-scotland">every Scottish MP&apos;s expenses</Link>.
      </P>
    </Prose>
  );
}
