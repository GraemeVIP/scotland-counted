import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, SectionHead, CTA, Callout } from "@/components/Blocks";
import EditorialImage from "@/components/EditorialImage";
import SharePage from "@/components/SharePage";
import QuickAnswer from "@/components/QuickAnswer";
import Faq from "@/components/Faq";
import { GuideTable } from "@/components/GuideTable";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, imageJsonLd, meta } from "@/lib/seo";

const HERO_IMAGE = {
  src: "/images/editorial/warm-home-discount-scotland-150.webp",
  alt: "Warm Scottish living room with a cast iron radiator, mug of tea and smart electricity display during winter snow",
  caption:
    "In Scotland, the £150 Warm Home Discount is automatic for the expanded Core Group (including Pension Credit and disability or under 5 elements), while everyone else in the Broader Group must apply directly to their electricity supplier.",
  width: 1200,
  height: 800,
};

const PUBLISHED_ISO = "2026-11-21";
const MODIFIED_ISO = "2026-11-21";

export const metadata = meta({
  title: "Warm Home Discount Scotland 2026/27: £150 & How to Apply",
  description:
    "How to get the £150 Warm Home Discount in Scotland for winter 2026/27. Check who gets it automatically in the Core Group and who must apply to their supplier.",
  path: "/warm-home-discount-scotland",
  type: "article",
  published: PUBLISHED_ISO,
  modified: MODIFIED_ISO,
  image: HERO_IMAGE.src,
  imageAlt: HERO_IMAGE.alt,
  imageWidth: HERO_IMAGE.width,
  imageHeight: HERO_IMAGE.height,
  imageType: "image/webp",
});

const GROUPS_TABLE = [
  [
    "Core Group (Automatic in Scotland)",
    "On 23 August 2026 you or your partner received: (1) Pension Credit; (2) Universal Credit with an extra amount for a disability or health condition (for you or your child); (3) a disability or pensioner premium on income related ESA or with a Support for Mortgage Interest loan; OR (4) you have a child under 5 living with you and are unemployed on Universal Credit, get income related ESA, or have a Support for Mortgage Interest loan",
    "Automatic. You get a letter between late October 2026 and early January 2027 (call 0800 030 9322 by 26 February 2027 if your letter asks for details)",
  ],
  [
    "Broader Group (Apply to supplier in Scotland)",
    "You get means tested benefits (such as standard Universal Credit without those automatic elements, Housing Benefit, Income Support or income based JSA) and meet your electricity supplier's extra criteria",
    "Not automatic. You MUST apply directly to your electricity supplier every winter (first come, first served)",
  ],
];

const SUPPLIER_LINKS = [
  {
    name: "ScottishPower",
    url: "https://www.scottishpower.co.uk/support-centre/warm-home-discount",
    cta: "ScottishPower Warm Home Discount page",
    how: "Apply via your ScottishPower online account or app under Warm Home Discount (Broader Group).",
  },
  {
    name: "British Gas (and Scottish Gas)",
    url: "https://www.britishgas.co.uk/energy/help-with-bills/warm-home-discount.html",
    cta: "British Gas Warm Home Discount page",
    how: "Apply online through the British Gas and Scottish Gas Warm Home Discount Broader Group form.",
  },
  {
    name: "Octopus Energy (and Co-op Energy)",
    url: "https://octopus.energy/blog/warm-home-discount/",
    cta: "Octopus Energy Warm Home Discount page",
    how: "Apply through your Octopus Energy online account dashboard.",
  },
  {
    name: "OVO Energy (and Boost / SSE)",
    url: "https://www.ovoenergy.com/guides/energy-guides/warm-home-discount-scheme",
    cta: "OVO Energy Warm Home Discount page",
    how: "Apply via OVO's online Warm Home Discount Scotland portal.",
  },
  {
    name: "EDF Energy",
    url: "https://www.edfenergy.com/help-support/warm-home-discount",
    cta: "EDF Warm Home Discount page",
    how: "Apply through EDF's Warm Home Discount Scotland web form.",
  },
  {
    name: "E.ON Next (and Sainsbury's Energy)",
    url: "https://www.eonnext.com/warm-home-discount",
    cta: "E.ON Next Warm Home Discount page",
    how: "Apply online through E.ON Next's Scottish Broader Group application page.",
  },
  {
    name: "Utilita",
    url: "https://help.utilita.co.uk/scottish-whd",
    cta: "Utilita Scotland WHD portal",
    how: "Apply via the My Utilita app or Utilita's Scottish WHD page (smart prepay credit sent straight to your meter).",
  },
  {
    name: "Utility Warehouse",
    url: "https://uw.co.uk/legal/energy-information/warm-home-discount-scheme",
    cta: "Utility Warehouse WHD page",
    how: "Apply through your UW online account or check their official scheme criteria.",
  },
  {
    name: "So Energy",
    url: "https://www.so.energy/warm-home-discount",
    cta: "So Energy Warm Home Discount page",
    how: "Apply via your So Energy online account under Scotland Broader Group.",
  },
  {
    name: "Outfox Energy",
    url: "https://www.outfox.energy/warm-home-discount/",
    cta: "Outfox Energy WHD page",
    how: "Apply through the Outfox Energy Warm Home Discount portal.",
  },
  {
    name: "Good Energy",
    url: "https://www.goodenergy.co.uk/blog/warm-home-discount-explained/",
    cta: "Good Energy WHD guide",
    how: "Check Good Energy's Scotland Broader Group application form.",
  },
  {
    name: "Ecotricity",
    url: "https://www.ecotricity.co.uk/our-news/2024/your-guide-to-the-warm-home-discount-scheme",
    cta: "Ecotricity WHD guide",
    how: "Contact Ecotricity or apply online under their Scottish Broader Group rules.",
  },
  {
    name: "100Green, E (Gas & Electricity), Fuse, Home Energy, London Power, Square 1, TruEnergy & Tulo",
    url: "https://www.gov.uk/the-warm-home-discount-scheme/energy-suppliers",
    cta: "Full GOV.UK participating supplier list",
    how: "Check the official GOV.UK supplier directory and contact your provider directly to apply.",
  },
];

const SUPPLIER_TABLE = SUPPLIER_LINKS.map((s) => [
  <a
    key={s.name}
    href={s.url}
    target="_blank"
    rel="noopener noreferrer"
    className="font-[580] text-[var(--action-text)] underline decoration-[var(--rule-strong)] underline-offset-3 hover:decoration-[var(--brand)]"
  >
    {s.name}
  </a>,
  "Participating",
  <span key={`${s.name}-how`}>
    {s.how}{" "}
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="font-[580] text-[var(--action-text)] whitespace-nowrap"
    >
      {s.cta} →
    </a>
  </span>,
]);

const WINTER_STACK_TABLE = [
  ["Warm Home Discount Scotland", "£150 off electricity bill", "Electricity supplier (GOV.UK / Ofgem scheme)", "Automatic for expanded Core Group; direct supplier application for Scotland Broader Group"],
  ["£100 Energy Payment Scotland", "£100 one off winter help", "Scottish Government & local councils", "Council tax bands A to D (rollout details expected in the 3 December Scottish Budget)"],
  ["Winter Heating Payment", "£59.75 cash payment", "Social Security Scotland", "Automatic if on qualifying low income benefits during the November qualifying week"],
  ["Pension Age Winter Heating Payment", "£101.70 to £305.10", "Social Security Scotland", "Automatic for most eligible pensioners in Scotland (replaces Winter Fuel Payment)"],
  ["Child Winter Heating Payment", "£251.50 cash payment", "Social Security Scotland", "Automatic for families of children on the highest care rate of Child Disability Payment"],
];

const FAQ = [
  {
    q: "Who gets the Warm Home Discount automatically in Scotland in 2026/27?",
    a: "Under GOV.UK's 2026/27 rules for Scotland, you are in the automatic Core Group if you or your partner were named on the electricity bill with a participating supplier on 23 August 2026 and receive: Pension Credit (either Guarantee Credit or Savings Credit); an extra amount of Universal Credit because you or your child has a disability or health condition; a disability or pensioner premium on income related ESA or with a Support for Mortgage Interest loan; or have a child under 5 living with you while unemployed on Universal Credit, on income related ESA, or with a Support for Mortgage Interest loan.",
  },
  {
    q: "Who still has to apply directly to their energy supplier in Scotland?",
    a: "If you live in Scotland and receive means tested benefits such as standard Universal Credit (without the disability element or unemployed under 5 rule), Housing Benefit, Income Support or income based JSA, you do not get it automatically. You fall into Scotland's Broader Group and must apply directly to your electricity supplier every winter before their limited funding pot closes.",
  },
  {
    q: "Why does Scotland still have a Broader Group when England and Wales are fully automatic?",
    a: "In England and Wales, every qualifying benefit (Universal Credit, Housing Benefit, income related ESA and Pension Credit) is matched automatically in a single Core Group. In Scotland, the automatic Core Group has been expanded to cover Pension Credit plus disability and young child elements, while other low income households still apply directly to their supplier under the Broader Group.",
  },
  {
    q: "When do automatic Core Group letters arrive in Scotland, and what is the helpline number?",
    a: "If you qualify automatically in the Core Group, you will receive a letter between late October 2026 and early January 2027. If you think you qualify automatically and have not received a letter by early January 2027, call the official Warm Home Discount Scheme helpline on 0800 030 9322 (Monday to Friday, 8am to 6pm) before the 26 February 2027 deadline.",
  },
  {
    q: "How much is the Warm Home Discount in Scotland for 2026/27?",
    a: "It is a one off £150 discount applied directly to your electricity bill (or added as a £150 voucher or top up credit if you use a prepayment meter) by 31 March 2027. If your supplier provides both your gas and electricity, you can ask them to put the £150 on your gas bill instead.",
  },
  {
    q: "Can I get Warm Home Discount on top of the £100 Scottish energy payment and Winter Heating Payment?",
    a: "Yes. The £150 Warm Home Discount does not affect your entitlement to Social Security Scotland's £59.75 Winter Heating Payment, Pension Age Winter Heating Payment, or the £100 energy payment for homes in council tax bands A to D.",
  },
];

export default function WarmHomeDiscountScotlandPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Benefits", path: "/benefits" },
          { name: "Warm Home Discount Scotland", path: "/warm-home-discount-scotland" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={imageJsonLd({
          src: HERO_IMAGE.src,
          alt: HERO_IMAGE.alt,
          title: "Warm Home Discount Scotland 2026/27: £150 electricity discount",
          width: HERO_IMAGE.width,
          height: HERO_IMAGE.height,
        })}
      />
      <JsonLd
        data={articleJsonLd({
          headline: "Warm Home Discount Scotland 2026/27: £150 eligibility and how to apply",
          description:
            "How to get the £150 Warm Home Discount in Scotland for winter 2026/27: who qualifies automatically in the expanded Core Group and who must apply to their supplier in the Broader Group.",
          path: "/warm-home-discount-scotland",
          published: PUBLISHED_ISO,
          modified: MODIFIED_ISO,
          image: HERO_IMAGE.src,
          section: "Benefits",
          keywords: [
            "warm home discount scotland",
            "apply for warm home discount scotland",
            "scottishpower warm home discount",
            "british gas warm home discount scotland",
            "broader group warm home discount scotland",
          ],
          schemaType: "Article",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="Winter 2026/27 · Published 21 November 2026 · Last updated 21 November 2026"
          title="Warm Home Discount Scotland 2026/27: who gets £150 automatically and who must apply"
          lede="The Warm Home Discount takes £150 off your winter electricity bill by 31 March 2027. In Scotland, the scheme splits households into two groups: an expanded automatic Core Group (covering Pension Credit plus certain disability and child under 5 benefit elements) and a Broader Group where you still have to apply directly to your energy supplier before their funding runs out."
        >
          <SharePage
            title="Warm Home Discount Scotland 2026/27: how to get your £150"
            text="Check whether you get the £150 Warm Home Discount automatically in Scotland's Core Group or need to apply directly to your electricity supplier."
            path="/warm-home-discount-scotland"
            label="Share Warm Home Discount guide"
            className="mt-4"
          />
        </PageHeader>

        <ContentFrame>
          <QuickAnswer
            answer={{
              label: "Warm Home Discount in Scotland",
              value: "£150",
              unit: "off your electricity bill (paid by 31 March 2027)",
              detail:
                "You get the £150 automatically in Scotland if you were with a participating supplier on 23 August 2026 and receive Pension Credit, Universal Credit with a disability/health element, ESA disability/pensioner premiums, or have a child under 5 while unemployed on UC or income related ESA. Other low income households in Scotland fall into the Broader Group and must apply directly to their supplier.",
              rows: [
                { label: "Discount amount", value: "£150 (credited to bill or meter)" },
                { label: "Qualifying date", value: "23 August 2026" },
                { label: "Core Group letters", value: "Late Oct 2026 to early Jan 2027" },
                { label: "Helpline (if no letter)", value: "0800 030 9322 (by 26 Feb 2027)" },
              ],
              asOf: "Checked 21 November 2026 against GOV.UK",
              source: {
                publisher: "GOV.UK Warm Home Discount (Scotland)",
                url: "https://www.gov.uk/the-warm-home-discount-scheme/if-you-live-in-scotland",
              },
              nextStep: {
                label: "Also check the £100 energy payment for bands A to D",
                href: "/100-energy-payment-scotland",
              },
            }}
          />
          <EditorialImage
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            caption={HERO_IMAGE.caption}
            aspect="wide"
            loading="eager"
            className="mt-10"
          />
        </ContentFrame>

        <ContentFrame as="section" className="pt-14">
          <SectionHead
            eyebrow="Automatic vs application"
            title="How Scotland's Core Group and Broader Group work in 2026/27"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              In England and Wales, the Warm Home Discount is completely automatic for every single
              qualifying benefit. In Scotland, it works differently: some households get the £150
              automatically, and others still have to apply directly to their electricity supplier.
            </p>
            <p>
              To qualify either way, three things must have been true on the qualifying date of{" "}
              <strong>23 August 2026</strong>: your electricity supplier is part of the scheme, you
              (or your partner) get a qualifying means tested benefit, and your name (or your
              partner&apos;s) is on the electricity bill.
            </p>
            <p>
              Under the official GOV.UK rules for 2026/27, Scotland&apos;s automatic{" "}
              <strong>Core Group</strong> now covers everyone on <strong>Pension Credit</strong>,
              plus households getting specific disability, pensioner or young child elements on
              Universal Credit, income related ESA or Support for Mortgage Interest.
            </p>
            <p>
              If you receive means tested benefits outside that automatic list, you sit in
              Scotland&apos;s <strong>Broader Group</strong>. You will not receive a letter from the
              government, and you have to apply directly to your electricity supplier every winter,
              even if you received the £150 last year.
            </p>
          </div>
          <div className="mt-7">
            <GuideTable
              kicker="Scotland · Winter 2026 to 2027"
              title="Core Group (automatic) vs Broader Group (apply) in Scotland"
              columns={["Group", "Who is in it (on 23 August 2026)", "How you get the £150"]}
              align={["left", "left", "left"]}
              rows={GROUPS_TABLE}
              caption="Exact 2026/27 criteria from GOV.UK (The Warm Home Discount Scheme: if you live in Scotland)."
            />
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Automatic Core Group checklist"
            title="When you get the £150 automatically in Scotland"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              You will get the £150 discount <strong>automatically</strong> in Scotland (no supplier
              application needed) if you or your partner were named on the electricity bill on 23
              August 2026 and meet any one of these official GOV.UK conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2.5">
              <li>
                <strong>Pension Credit:</strong> You or your partner get Pension Credit (Guarantee
                Credit or Savings Credit).
              </li>
              <li>
                <strong>Universal Credit with a disability or health element:</strong> You get an
                extra amount of Universal Credit because you or your child has a disability or
                health condition (such as Limited Capability for Work or the disabled child
                addition).
              </li>
              <li>
                <strong>Income related ESA premiums:</strong> You get a disability premium or a
                pensioner premium of income related Employment and Support Allowance (ESA).
              </li>
              <li>
                <strong>Support for Mortgage Interest (SMI) premiums:</strong> You get a disability
                premium or a pensioner premium and have an SMI loan.
              </li>
              <li>
                <strong>Child under 5 rule:</strong> You or your partner have responsibility for a
                child under the age of 5 who normally lives with you, <em>and</em> you are
                unemployed and get Universal Credit, or get income related ESA, or have an SMI loan.
              </li>
            </ul>
            <p>
              <strong>What happens next if you are in the Core Group:</strong> You will receive a
              letter in the post between <strong>late October 2026 and early January 2027</strong>.
              Most letters confirm you do not need to do anything and your supplier will take £150
              off your bill by 31 March 2027. If the letter says the government needs to check a
              detail (for example, matching your name on the electricity account), call the helpline
              on <strong>0800 030 9322</strong> by <strong>26 February 2027</strong>.
            </p>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Broader Group applications"
            title="When you still have to apply directly to your supplier"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              If you do not meet the automatic Core Group criteria above, you may still qualify for
              the £150 through your electricity supplier&apos;s <strong>Broader Group</strong>. This
              typically covers Scottish households who:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Receive <strong>Universal Credit</strong> without the disability element (or are in
                work on a low income below the supplier&apos;s threshold)
              </li>
              <li>
                Receive <strong>Housing Benefit</strong>, <strong>Income Support</strong>, or{" "}
                <strong>income based Jobseeker&apos;s Allowance (JSA)</strong>
              </li>
              <li>
                Meet their energy supplier&apos;s own low income or household vulnerability rules
              </li>
            </ul>
            <p>
              Because each energy supplier only has a limited number of Broader Group discounts to
              hand out each winter, GOV.UK advises contacting your supplier as early as possible,
              even if you qualified last year. You must stay with that supplier until the £150 is
              credited to your bill.
            </p>
          </div>
          <Callout>
            <p className="font-[600] text-[var(--ink)] mb-1">
              Why checking now matters more than ever
            </p>
            <p className="text-[16.5px] leading-[1.55] text-[var(--ink-2)]">
              Mid November temperatures in the Highlands have already dropped to minus 8.4 degrees
              Celsius, and on Wednesday 25 November Ofgem is expected to confirm a{" "}
              <Link href="/energy-price-cap-scotland">
                26% jump in the January 2027 energy price cap
              </Link>{" "}
              (taking a typical bill from £1,723 to around £2,166). If you are in the Broader Group,
              apply while your supplier&apos;s window is still open.
            </p>
          </Callout>
        </ContentFrame>

        <ContentFrame as="section" className="pt-14">
          <SectionHead
            eyebrow="24 participating suppliers · 2026/27"
            title="All energy suppliers in the 2026/27 Warm Home Discount scheme"
          />
          <p className="mt-4 max-w-[66ch] text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            These 24 electricity suppliers are officially part of the 2026/27 Warm Home Discount
            scheme on GOV.UK. If you are in the automatic Core Group, your supplier applies the £150
            after DWP data matching. If you are in the Broader Group, log into your supplier&apos;s
            website or app to apply directly.
          </p>
          <div className="mt-6">
            <GuideTable
              kicker="GOV.UK & Ofgem · 2026 to 2027"
              title="Participating electricity suppliers in Scotland"
              columns={["Electricity supplier", "2026/27 status", "How Scottish Broader Group customers apply"]}
              align={["left", "left", "left"]}
              rows={SUPPLIER_TABLE}
              caption="Source: GOV.UK participating energy suppliers list for 2026/27. If you applied directly to your supplier under the Broader Group, you will not get a letter from the DWP helpline: contact your supplier for updates."
            />
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Prepayment, credit & park homes"
            title="How the £150 is actually paid to you"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              The Warm Home Discount is never paid as cash into a bank account. Any text message or
              email asking for your debit card number or bank login to deposit £150 is a scam.
            </p>
            <ul className="list-disc pl-6 space-y-2.5">
              <li>
                <strong>Direct Debit and quarterly credit bills:</strong> Your supplier adds a £150
                credit straight onto your electricity account by 31 March 2027. If your supplier
                provides both your gas and electricity, you can contact them to ask for the £150 to
                be put on your gas bill instead.
              </li>
              <li>
                <strong>Smart prepayment meters:</strong> The £150 is normally sent automatically to
                your smart electricity meter as top up credit.
              </li>
              <li>
                <strong>Traditional key or card prepayment meters:</strong> Your supplier sends you a
                top up voucher by post or email that you redeem at a PayPoint, Payzone or Post
                Office.
              </li>
              <li>
                <strong>Park (mobile) homes:</strong> If you live in a park home and pay the site
                owner for electricity rather than having your own supplier bill, you apply a
                different way through the{" "}
                <a
                  href="https://www.charisgrants.com/partners/park-homes/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Park Homes Warm Home Discount
                </a>{" "}
                run by Charis Grants.
              </li>
            </ul>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Stack every Scottish winter payment"
            title="Five winter energy payments you can combine in Scotland"
          />
          <p className="mt-4 max-w-[66ch] text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            Getting the £150 Warm Home Discount does not reduce or block any other Scottish winter
            help. If your household qualifies for each rule below, you get all of them on top of
            each other.
          </p>
          <div className="mt-6">
            <GuideTable
              kicker="Scotland · Winter 2026/27"
              title="Every winter heating and energy payment in Scotland compared"
              columns={["Scheme", "Amount", "Who runs it", "How to get it"]}
              align={["left", "left", "left", "left"]}
              rows={WINTER_STACK_TABLE}
              caption="All five payments are tax free and do not count as income when working out your Universal Credit or Council Tax Reduction."
            />
          </div>
          <div className="mt-6 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              Check the full guides for each payment here: the{" "}
              <Link href="/100-energy-payment-scotland">£100 energy payment in Scotland</Link> for
              homes in council tax bands A to D,{" "}
              <Link href="/winter-heating-payment">Winter Heating Payment</Link> (£59.75), and{" "}
              <Link href="/winter-fuel-payment-scotland">Pension Age Winter Heating Payment</Link>.
              You can also check when holiday benefits arrive early on{" "}
              <Link href="/social-security-scotland-payment-dates">
                Social Security Scotland payment dates
              </Link>{" "}
              and <Link href="/scotland-bank-holidays">Scotland bank holidays</Link>, or follow the{" "}
              <Link href="/scottish-budget-2027-28">Scottish Budget on 3 December 2026</Link> for
              any extra winter council funding.
            </p>
            <p>
              If you are out of gas or electricity credit right now and cannot wait weeks for a
              discount, apply to your local council for an emergency{" "}
              <Link href="/crisis-grant-scotland">Scottish Crisis Grant</Link> or phone them directly
              using our list of{" "}
              <Link href="/crisis-grant-phone-number">all 32 council Crisis Grant phone numbers</Link>.
            </p>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <Faq
            items={FAQ}
            kicker="Questions"
            title="Common questions about the Warm Home Discount in Scotland"
          />
        </ContentFrame>

        <ContentFrame as="section" className="mt-16 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-4">Official sources and how each figure is used</p>
          <ul className="space-y-3.5 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
            <li>
              <a
                href="https://www.gov.uk/the-warm-home-discount-scheme/if-you-live-in-scotland"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                The Warm Home Discount Scheme: if you live in Scotland
              </a>
              , GOV.UK: £150 discount amount, 23 August 2026 qualifying date, 31 March 2027
              payment deadline, expanded automatic Core Group criteria in Scotland (Pension Credit,
              Universal Credit disability/health elements, income related ESA/SMI premiums, and
              child under 5 rules), and Broader Group supplier application rules.
            </li>
            <li>
              <a
                href="https://www.gov.uk/the-warm-home-discount-scheme/if-you-live-in-england-or-wales"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                The Warm Home Discount Scheme: if you live in England or Wales
              </a>
              , GOV.UK: comparison with England and Wales where all qualifying benefits are matched
              automatically in a single Core Group.
            </li>
            <li>
              <a
                href="https://www.gov.uk/the-warm-home-discount-scheme/energy-suppliers"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                The Warm Home Discount Scheme: participating energy suppliers
              </a>
              , GOV.UK: the 24 participating electricity suppliers for the 2026 to 2027 scheme year.
            </li>
            <li>
              <a
                href="https://www.gov.uk/the-warm-home-discount-scheme/if-you-do-not-get-a-letter"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                The Warm Home Discount Scheme: if you do not get a letter
              </a>
              , GOV.UK: official helpline (0800 030 9322, Monday to Friday 8am to 6pm), late
              October 2026 to early January 2027 letter window, and 26 February 2027 deadline.
            </li>
            <li>
              <a
                href="https://www.ofgem.gov.uk/environmental-and-social-schemes/warm-home-discount-whd/eligibility"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Warm Home Discount (WHD): eligibility and scheme guidance
              </a>
              , Ofgem: compulsory supplier participation rules and Broader Group obligation caps.
            </li>
            <li>
              <a
                href="https://www.mygov.scot/winter-heating-payment"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Winter Heating Payment, Pension Age Winter Heating Payment and Child Winter Heating Payment
              </a>
              , mygov.scot (Social Security Scotland): 2026/27 Scottish winter heating payment
              amounts (£59.75, £101.70 to £305.10, and £251.50).
            </li>
            <li>
              <a
                href="https://www.cornwall-insight.com/press-releases/energy-bills-set-for-steep-rise-in-january/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Energy bills set for steep rise in January 2027
              </a>
              , Cornwall Insight: final forecast of a 26% rise (+£443) taking the typical Direct
              Debit price cap from £1,723 to £2,166 from 1 January 2027.
            </li>
            <li>
              <a
                href="https://www.itv.com/news/2026-11-20/thursday-was-coldest-night-of-autumn-so-far-with-temperatures-set-to-dip-further"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Met Office report: minus 8.4 degrees Celsius recorded at Tulloch Bridge in the Scottish Highlands
              </a>
              , ITV News / Met Office (19 to 20 November 2026).
            </li>
          </ul>
        </ContentFrame>
      </Page>

      <CTA
        title="In council tax band A to D? Check the £100 energy payment too"
        body="Around 1.9 million Scottish homes in bands A to D are in line for a separate £100 winter energy payment. Check your band and see how the scheme works."
        href="/100-energy-payment-scotland"
        cta="Check the £100 energy payment"
        secondaryHref="/energy-price-cap-scotland"
        secondaryCta="See January 2027 energy price cap forecast"
      />
    </>
  );
}
