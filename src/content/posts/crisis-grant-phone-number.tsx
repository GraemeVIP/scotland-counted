import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { CRISIS_GRANT_LINES, telHref } from "@/lib/data/benefits";

const withPhone = CRISIS_GRANT_LINES.filter((line) => line.phone).length;

export default function Post() {
  return (
    <Prose>
      <Lead>
        There&apos;s no single crisis grant phone number for Scotland. Each council runs its own
        Scottish Welfare Fund, so you ring the council where you live. I&apos;ve put all 32 below,
        taken from each council&apos;s own crisis grant page.
      </Lead>

      <H2 id="numbers">Crisis grant phone number for every council</H2>
      <GuideTable
        kicker={`${withPhone} of 32 councils publish a line`}
        title="Scottish Welfare Fund numbers"
        columns={["Council", "Phone", "Notes"]}
        rows={CRISIS_GRANT_LINES.map((line) => [
          <Link key="c" href={`/councils/${line.councilSlug}`}>{line.council}</Link>,
          line.phone ? (
            <a key="p" href={telHref(line.phone)} className="whitespace-nowrap font-[560]">
              {line.phone}
            </a>
          ) : (
            <a key="p" href={line.url}>Council page</a>
          ),
          [line.hours, line.note].filter(Boolean).join(". ") || "",
        ])}
        caption="Checked against council websites on 29 October 2026. Where a council gives no hours, assume office hours on weekdays. If a number doesn't work, use the council page link on its name."
      />

      <H2 id="before">Before you call</H2>
      <P>
        Lines get busy first thing, especially on a Monday. Have these ready so you only need to
        tell your story once:
      </P>
      <UL>
        <LI>Your name, address, date of birth and National Insurance number.</LI>
        <LI>Who lives with you, and any children or health needs.</LI>
        <LI>What money you have coming in and what&apos;s in the bank today.</LI>
        <LI>What happened, and what you need right now: food, gas, electric, travel.</LI>
      </UL>
      <P>
        Most councils decide a crisis grant by the end of the next working day. Many will pay by
        bank transfer, voucher or a top up straight onto your meter.
      </P>

      <Aside title="Can't get through?">
        <p>
          Almost every council also takes applications online, and the form is often quicker than
          waiting on the phone. If you&apos;re out of credit, many libraries and council offices let
          you use a phone or computer for free.
        </p>
      </Aside>

      <H2 id="what">What a crisis grant is</H2>
      <P>
        It&apos;s money you don&apos;t pay back, for an emergency like losing your job, a fire or
        flood, or having nothing left for food and heating. You need to be 16 or over and on a low
        income or certain benefits. The full rules are in my{" "}
        <Link href="/crisis-grant-scotland">crisis grant Scotland</Link> guide, and the council by
        council award rates are in the{" "}
        <Link href="/blog/crisis-grant-acceptance-rates-scotland-councils">crisis grant acceptance rates</Link>{" "}
        piece.
      </P>
      <P>
        If you get a refusal, ask for a review. If the review still says no, the Scottish Public
        Services Ombudsman can look at it independently, free on 0800 014 7299.
      </P>

      <PostCTA
        title="Not sure which council you're in?"
        body="Put in your postcode and I'll show you your council, then find its number in the table above."
        href="/areas"
        cta="Find my council"
      />
    </Prose>
  );
}
