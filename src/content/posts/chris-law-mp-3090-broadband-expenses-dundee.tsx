import type { ReactNode } from "react";
import Link from "@/components/IntentLink";
import { Prose, P, Aside, PostCTA } from "@/components/Prose";

/*
 * Written in Graeme's voice (graeme-writing skill). Every expense figure comes
 * directly from IPSA's published individualBusinessCosts CSV files for 2022/23
 * to 2026/27 (checked 22 November 2026 across all 650 UK MPs, over 350,000
 * rows). Quoted descriptions are IPSA's exact wording and must not be edited.
 * "Typical setup claim" = the middle (median) phone or internet installation
 * claim: £90 across all 1,149 such UK claims, and £90 across Scottish MPs once
 * IPSA's lumped yearly totals are left out.
 * Broadband context: Ofcom Connected Nations 2022 (September 2022 data) and
 * Starlink's UK kit price before 24 August 2022 (ISPreview).
 * Nobody was contacted for comment.
 */

import {
  type PartyKey,
  PARTY,
  gbp,
  Who,
  QuickTake,
  Finding as KitFinding,
  ChartFrame,
  Bar,
  RankList,
  Receipt,
  CaseCard,
  Face,
  Tiles,
  PointList,
  Expand,
  Spotlight,
} from "@/components/ExpenseKit";

const mp = (slug: string) => `/representatives/mps/${slug}#donations-and-interests`;

const LAW = {
  name: "Chris Law",
  href: mp("dundee-central"),
  p: "SNP" as PartyKey,
  place: "Dundee Central",
};

const FINDINGS = 4;

function Finding({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <KitFinding n={n} of={FINDINGS} id={id}>
      {children}
    </KitFinding>
  );
}

/** Other MPs with their own local story page, linked near the end. */
const MORE_LOCAL_STORIES: { name: string; seat: string; place: string; hook: string; story: string }[] = [
  { name: "Lillian Jones", seat: "kilmarnock-and-loudoun", place: "Kilmarnock", hook: "£23,437 for electricity in one day", story: "/blog/kilmarnock-mp-23437-electricity-bill" },
  { name: "Euan Stainbank", seat: "falkirk", place: "Falkirk", hook: "£3,300 for a billboard of himself", story: "/blog/euan-stainbank-mp-billboard-expenses-falkirk" },
  { name: "Angus MacDonald", seat: "inverness-skye-and-west-ross-shire", place: "Inverness and Skye", hook: "£3,000 speech coach and £546 drains", story: "/blog/angus-macdonald-mp-speech-coach-drains-expenses" },
  { name: "Pamela Nash", seat: "motherwell-wishaw-and-carluke", place: "Motherwell", hook: "£7,542 on DFS, IKEA and a new carpet", story: "/blog/pamela-nash-mp-furniture-expenses-motherwell" },
  { name: "John Lamont", seat: "berwickshire-roxburgh-and-selkirk", place: "Borders", hook: "Two iPhones on expenses", story: "/blog/john-lamont-mp-iphone-expenses-borders" },
  { name: "Graeme Downie", seat: "dunfermline-and-dollar", place: "Dunfermline", hook: "£963 for one business dinner", story: "/blog/graeme-downie-mp-dinner-expenses-dunfermline" },
];

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** The biggest single home internet claims across all 650 UK MPs. */
const UK_TOP_HOME_INTERNET: {
  name: string;
  p: PartyKey;
  seat: string;
  href?: string;
  date: string;
  detail: ReactNode;
  value: number;
}[] = [
  {
    name: "Chris Law",
    p: "SNP",
    seat: "Dundee West (now Dundee Central)",
    href: mp("dundee-central"),
    date: "25 Jul 2022",
    detail: "“Home 5G mobile broadband installation”",
    value: 3090,
  },
  {
    name: "Nigel Evans",
    p: "Conservative",
    seat: "Ribble Valley (former MP)",
    date: "23 Oct 2024",
    detail: "Two months of BT bills for his home office, after he lost his seat",
    value: 430.64,
  },
  {
    name: "Robert Syms",
    p: "Conservative",
    seat: "Poole (former MP)",
    date: "20 Jun 2023",
    detail: "BT line and internet for his home office",
    value: 370.09,
  },
  {
    name: "Christopher Chope",
    p: "Conservative",
    seat: "Christchurch",
    date: "21 Jan 2023",
    detail: "Home office landline and internet, BT",
    value: 260.61,
  },
  {
    name: "John Whittingdale",
    p: "Conservative",
    seat: "Maldon",
    date: "28 Jun 2026",
    detail: "Home office broadband",
    value: 259.86,
  },
];

/** His parking bills for trips between Dundee and London, year by year. */
const PARKING: { year: string; value: number; label: string; note?: string }[] = [
  { year: "2022/23", value: 1913.91, label: "£1,914" },
  { year: "2023/24", value: 3654.72, label: "£3,655", note: "2nd in the UK" },
  { year: "2024/25", value: 4693.44, label: "£4,693", note: "1st in the UK" },
  { year: "2025/26", value: 6292.29, label: "£6,292", note: "1st in the UK" },
];

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

export default function ChrisLawMp3090BroadbandExpensesDundee() {
  const parkMax = Math.max(...PARKING.map((s) => s.value));

  return (
    <Prose>
      <QuickTake
        items={[
          <>
            <strong>Taxpayers</strong> paid <strong>£3,090</strong> to set up home broadband for{" "}
            <Link href={LAW.href}>Chris Law</Link>. One claim, in July 2022. He was SNP MP for Dundee
            West until 2024, and is now MP for Dundee Central.
          </>,
          <>
            A typical phone or internet setup claim by an MP is <strong>£90</strong>. His was over{" "}
            <strong>34 times</strong> that.
          </>,
          <>
            The <strong>biggest home broadband claim</strong> of all 650 UK MPs since 2022. The next
            biggest was £431.
          </>,
          <>
            He also ran up the <strong>biggest parking bill</strong> of any UK MP in 2025/26:{" "}
            <strong>£6,292</strong>, or about £121 a week.
          </>,
          <>
            And <strong>26 nights</strong> in European hotels in one year. No MP in the UK had
            more.
          </>,
        ]}
      />

      <CaseCard kicker="One claim · 25 July 2022 · paid in full" figure="£3,090" people={[LAW]}>
        <p>
          IPSA, the body that pays MPs&apos; expenses with public money, logged it as{" "}
          <strong>&ldquo;Home 5G mobile broadband installation&rdquo;</strong>.
        </p>
        <p>The record does not say which home it was for, or who got the money.</p>
      </CaseCard>

      {/* ------------------------------------------------------------ 1 */}
      <Finding n={1} id="the-broadband">
        £3,090 to set up broadband at home
      </Finding>
      <P>
        <Link href={LAW.href}>Chris Law</Link> has been an SNP MP for Dundee since 2015. His office
        is on Marshall Street in Lochee.
      </P>
      <P>
        5G home broadband runs off the same masts as your phone. Most of the time it&apos;s a wee
        box you plug in at the wall, and you&apos;re done.
      </P>
      <P>
        Yet IPSA paid £3,090 to install it, out of his office budget. It&apos;s marked Paid, and
        £0 has come back.
      </P>

      <Tiles
        items={[
          { value: "£90", label: "a typical phone or internet setup claim by an MP" },
          { value: "£529", label: "Starlink satellite kit for remote homes, July 2022" },
          { value: "£3,090", label: "Chris Law's home 5G setup", hot: true },
        ]}
      />

      <P>
        Why not normal broadband like the rest of us? Ofcom, the body that checks UK phone and
        internet services, says 99% of homes in Dundee could get superfast broadband that year.
      </P>
      <P>
        For comparison, a Starlink dish for a remote farm cost £529 back then. His
        claim was nearly six times that.
      </P>

      <Expand summary="See the proof: the IPSA line, word for word">
        <Receipt
          person={LAW}
          heading="IPSA record · 25 July 2022 · Office Costs"
          lines={[
            {
              meta: "Landline phone and internet: installation and equipment · Internet",
              what: "Home 5G mobile broadband installation",
              amount: "£3,090.00",
            },
          ]}
          total={{ label: "Paid in full · £0 repaid", amount: "£3,090.00" }}
          footer="Wording as printed by IPSA. IPSA claim number 60124158-1 (2022/23), filed under his old seat."
        />
        <p className="text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
          How we got £90: it is the middle claim out of all 1,149 phone and internet setup claims
          by UK MPs since 2022. For Scottish MPs alone it is also £90, once IPSA&apos;s lumped
          yearly totals are left out.
        </p>
      </Expand>

      {/* ------------------------------------------------------------ 2 */}
      <Finding n={2} id="uk-number-one">
        No MP in the UK comes close
      </Finding>
      <P>
        We checked over 350,000 claim lines from all 650 UK MPs, from 2022 to 2027. We pulled out
        every home broadband and home internet claim.
      </P>
      <P>
        His is top by a country mile. The next biggest was £430.64, and that was two months of BT
        bills. His one claim is over <strong>seven times</strong> that.
      </P>

      <ChartFrame
        kicker="All 650 UK MPs · 2022/23 to 2026/27"
        title="Biggest single home internet claims by any UK MP"
        caption="Source: Five years of IPSA files (2022/23 to 2026/27) across all 650 UK seats. One line per MP."
      >
        <RankList
          max={UK_TOP_HOME_INTERNET[0].value}
          rows={UK_TOP_HOME_INTERNET.map((r, i) => ({
            key: r.name,
            who: <Who face name={r.name} href={r.href} p={r.p} note={r.seat} />,
            side: r.date,
            value: r.value,
            label: gbp(r.value, false),
            colour: PARTY[r.p].colour,
            detail: r.detail,
            highlight: i === 0,
          }))}
        />
      </ChartFrame>

      <P>
        Only one claim in IPSA&apos;s whole phone and internet setup group was bigger: £3,954 for
        a phone line into a brand new MP office in Yeovil. And his was for a home.
      </P>

      {/* ------------------------------------------------------------ 3 */}
      <Finding n={3} id="parking-and-travel">
        Top of the UK for parking and European hotels
      </Finding>
      <P>
        The broadband isn&apos;t the only bill that jumps out. His travel puts him near the top of
        all 650 MPs too.
      </P>

      <ChartFrame
        kicker="Parking on trips between Dundee and London"
        title="His parking bill has more than tripled in three years"
        caption="Source: IPSA travel totals for Chris Law MP, 2022/23 to 2025/26. Ranks are out of all 650 UK MPs."
      >
        <div className="space-y-4">
          {PARKING.map((s, i) => (
            <div key={s.year}>
              <p
                className={`ui mb-1 text-[14.5px] leading-[1.45] ${i === PARKING.length - 1 ? "font-[680] text-[var(--ink)]" : "text-[var(--ink-2)]"}`}
              >
                {s.year}
                {s.note ? ` · ${s.note}` : ""}
              </p>
              <Bar
                value={s.value}
                max={parkMax}
                colour={i === PARKING.length - 1 ? "var(--bad)" : "var(--rule-strong)"}
                label={s.label}
              />
            </div>
          ))}
        </div>
      </ChartFrame>

      <P>
        In 2025/26 he claimed <strong>£6,292</strong> for parking, well clear of the next MP in the
        UK on £3,587. Over four years his parking came to £16,554, more than any other MP.
      </P>

      <Spotlight
        person={LAW}
        kicker="2025/26 · trips to Europe"
        amount="26 nights"
        headline="The most nights in European hotels of any UK MP."
      >
        <p>
          IPSA lets MPs claim some work trips to Europe. The next highest MP had 16 nights. His
          European trips that year came to <strong>£6,191.92</strong>:
        </p>
        <ul className="space-y-1 text-[16px]">
          <li>Hotels, 26 nights: £2,821.90</li>
          <li>Flights: £2,871.91</li>
          <li>Food and drink: £150.19</li>
          <li>Parking: £145.00</li>
          <li>Taxis: £126.18</li>
          <li>Trains: £55.51</li>
          <li>Other public transport: £21.23</li>
        </ul>
        <p className="text-[14px] opacity-75">IPSA only gives yearly totals for travel, not single trips.</p>
      </Spotlight>

      <PointList
        items={[
          {
            key: "staff-hotels",
            title: "£10,996 on London hotels for his staff",
            children: (
              <>73 nights in 2025/26, more than any other MP in the UK spent on staff hotels in London.</>
            ),
          },
          {
            key: "travel",
            title: "£68,044 on travel in one year",
            children: (
              <>
                His own trips, his staff and his family, in 2025/26. Only one MP in the UK billed
                more, <Link href={mp("dunfermline-and-dollar")}>Graeme Downie</Link> (£72,286).
              </>
            ),
          },
          {
            key: "flat",
            title: "£28,200 for a London flat",
            children: (
              <>
                His second home rent for 2025/26. He went over his housing budget two years running
                and had to pay back £266.
              </>
            ),
          },
          {
            key: "family",
            title: "£2,000 for family travel",
            children: <>£1,999.75 in 2025/26, mostly flights, so his family could travel between home and London.</>,
          },
        ]}
      />

      {/* ------------------------------------------------------------ 4 */}
      <Finding n={4} id="why-ipsa-paid">
        Why IPSA paid it all
      </Finding>
      <P>
        IPSA lets MPs claim to set up phones and internet for their work. That can include a
        home office. The £3,090 went in under that heading and IPSA signed it off.
      </P>
      <P>
        Now, Dundee is a long way from London. MPs there have to travel, and parking at an airport
        or station soon adds up. He has also paid some money back when he went over.
      </P>
      <P>
        But nobody else in the UK claimed anything like £3,090 for home broadband. So{" "}
        <Link href={LAW.href}>Chris Law</Link> and IPSA still have three questions to answer:
      </P>

      <PointList
        items={[
          {
            key: "which-home",
            title: "Which home was it for?",
            children: <>His home in Dundee, or the London flat you rent for him?</>,
          },
          {
            key: "who-paid",
            title: "Who got the £3,090?",
            children: <>IPSA&apos;s record names no firm.</>,
          },
          {
            key: "what",
            title: "What did it actually buy?",
            children: <>A typical setup claim is £90. What made this one cost £3,000 more?</>,
          },
        ]}
      />

      <Aside title="Part of a wider pattern in Westminster">
        <p>
          Dundee isn&apos;t alone in this. Across Scotland&apos;s 57 MPs we also
          found a <Link href="/blog/kilmarnock-mp-23437-electricity-bill">£23,437 power bill paid in one day</Link>{" "}
          and <Link href="/blog/scottish-mps-tv-licence-expenses">29 MPs who claimed for TV licences</Link>.
          See <Link href="/blog/worst-scottish-mp-expenses">the worst claims</Link> or compare{" "}
          <Link href="/mp-expenses-scotland">all 57 Scottish MPs</Link>.
        </p>
      </Aside>

      <section aria-labelledby="more-local-stories" className="not-prose my-10">
        <h2
          id="more-local-stories"
          className="ui text-[20px] font-[700] leading-[1.25] text-[var(--ink)] sm:text-[22px]"
        >
          More local MP stories
        </h2>
        <p className="ui mt-1 text-[15px] leading-[1.5] text-[var(--muted)]">
          One MP, one town, one bill. Is yours here?
        </p>
        <ul className="mt-4 divide-y divide-[var(--rule)] rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-4 sm:px-5">
          {MORE_LOCAL_STORIES.map((s) => (
            <li key={s.story} className="flex items-center gap-3 py-3.5">
              <Face name={s.name} href={mp(s.seat)} size={44} />
              <div className="min-w-0 flex-1">
                <Link href={s.story} className="ui text-[16px] font-[660] leading-[1.35]">
                  {s.hook} →
                </Link>
                <p className="ui mt-0.5 text-[13.5px] leading-[1.4] text-[var(--muted)]">
                  <Link href={mp(s.seat)} className="text-[var(--muted)]">
                    {s.name}
                  </Link>{" "}
                  · {s.place}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <PostCTA
        title="See every claim Chris Law has made"
        body="Open our live Receipt Finder on the Dundee Central MP. Copy any claim for X or WhatsApp, or email him direct."
        href="/mp-expenses-scotland/search?mp=dundee-central"
        cta="See his receipts"
      />

      <P>
        Want the full picture? <Link href="/mp-expenses-scotland">Compare all 57 Scottish MPs</Link>.
      </P>
    </Prose>
  );
}
