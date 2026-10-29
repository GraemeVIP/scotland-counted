import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import RepresentativeLookup from "@/app/(site)/representatives/RepresentativeLookup";
import { HOLYROOD_DATA_CHECKED_AT, holyroodConstituencies, holyroodRegions } from "@/lib/data/holyrood";
import { mps } from "@/lib/data/mps";
import { SCOTTISH_PARLIAMENT as SP, TOTAL_MSPS } from "@/lib/data/local";

const checked = new Date(HOLYROOD_DATA_CHECKED_AT).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const regionRows = holyroodRegions.map((region) => [
  <Link key="r" href={`/representatives/msps/regions/${region.regionSlug}`}>
    {region.region}
  </Link>,
  holyroodConstituencies.filter((record) => record.regionSlug === region.regionSlug).length,
  region.msps.length,
]);

export default function Post() {
  return (
    <Prose>
      <Lead>
        Everyone in Scotland has {SP.perPerson} MSPs, not one. There&apos;s a constituency MSP
        for your local area and {SP.regionalPerRegion} regional MSPs for the wider region, and you
        can go to any of them. Put your postcode in below and I&apos;ll show you all of them, plus
        your MP, with their contact details.
      </Lead>

      <H2 id="postcode">Who is my MSP by postcode</H2>
      <P>
        The lookup uses the Scottish Parliament&apos;s and the UK Parliament&apos;s own records.
        It only shows names and contact details. It won&apos;t send anything, and I don&apos;t
        keep your postcode.
      </P>
      <RepresentativeLookup />

      <H2 id="two-kinds">Constituency MSPs and regional MSPs</H2>
      <P>
        The Scottish Parliament has {TOTAL_MSPS} MSPs. {SP.constituencyMsps} of them each represent
        one constituency, a local area a bit like a Westminster seat. The other {SP.regionalMsps}{" "}
        are regional MSPs. Scotland is split into {SP.regions} regions and each one elects{" "}
        {SP.regionalPerRegion}.
      </P>
      <P>
        Your constituency MSP is usually who people mean when they say &ldquo;my MSP&rdquo;. But the
        regional ones represent you just as much, and the Scottish Parliament says you can contact
        either type about anything it deals with. If your constituency MSP doesn&apos;t get back to
        you, or you&apos;d rather speak to someone from another party, pick one of the regional
        seven. You don&apos;t need to explain why.
      </P>
      <Aside title="Why there are two kinds">
        <p>
          You get two votes at a Scottish Parliament election. The first picks your constituency
          MSP. The second is for a party in your region, and the regional seats are shared out so
          the overall result is closer to how people voted. That&apos;s why your regional MSPs can
          come from different parties to your constituency MSP.
        </p>
        <p>The current MSPs were elected on {SP.elected}.</p>
      </Aside>

      <H2 id="regions">MSP for my area: the eight regions</H2>
      <P>
        If you know your region you can go straight to it. Each page lists the regional MSPs and
        the constituencies inside it.
      </P>
      <GuideTable
        kicker={`${SP.regions} regions, ${SP.constituencyMsps} constituencies`}
        title="Scottish Parliament regions"
        columns={["Region", "Constituencies", "Regional MSPs"]}
        align={["left", "right", "right"]}
        rows={regionRows}
        caption={
          <>
            From the Scottish Parliament&apos;s open data, checked {checked}. Every one of the{" "}
            {TOTAL_MSPS} is on the <Link href="/representatives/msps">MSP directory</Link>.
          </>
        }
      />

      <H2 id="contact">How to contact my MSP</H2>
      <UL>
        <LI>
          Email is best. Almost every MSP&apos;s address follows the same pattern,
          firstname.surname.msp@parliament.scot. The lookup above shows the exact one.
        </LI>
        <LI>
          Phone the Scottish Parliament on <a href={SP.phoneHref}>{SP.phone}</a>, or free on{" "}
          <a href={SP.freephoneHref}>{SP.freephone}</a>. Calls are answered {SP.hours}.
        </LI>
        <LI>Write to them at {SP.address.join(", ")}.</LI>
        <LI>Many MSPs also hold local surgeries. Their own website will have the times.</LI>
      </UL>
      <P>
        Whichever way you do it, put your full address and postcode in. It shows them straight away
        that you live in their area. Then say what&apos;s happened and what you want them to do.
        Short is fine.
      </P>
      <P>
        If you&apos;d like a hand with the wording, the{" "}
        <Link href="/email-your-mp-and-msp">email your MP and MSP</Link> tool puts your area&apos;s
        figures into a draft for you, and you read it before anything is sent. There&apos;s more on
        what to say in{" "}
        <Link href="/blog/how-to-contact-your-mp-or-msp">how to contact your MP or MSP</Link>.
      </P>

      <H2 id="mp-or-msp">MSP or MP: who to ask</H2>
      <P>
        Your MSP deals with what the Scottish Parliament controls. That includes the NHS in
        Scotland, schools, housing, policing and Scottish benefits like the Scottish Child Payment.
        Your MP, one of {mps.length} for Scotland at Westminster, deals with what the UK still
        controls, like Universal Credit, the State Pension, immigration and defence.
      </P>
      <P>
        If you&apos;re not sure, send it to both. It costs nothing. The full split is on{" "}
        <Link href="/who-decides">who decides what</Link>.
      </P>
      <P>
        For bins, potholes, council housing and council tax, your councillors are usually quicker.
        My guide to{" "}
        <Link href="/who-is-my-local-councillor-by-postcode">who is my local councillor by postcode</Link>{" "}
        links to every council&apos;s councillor finder.
      </P>

      <PostCTA
        title="Write to them in a few minutes"
        body="The email tool finds the same people from your postcode, adds your local figures and drafts a separate email for your MP and MSP. Nothing is sent until you send it."
        href="/email-your-mp-and-msp"
        cta="Write the emails"
      />
    </Prose>
  );
}
