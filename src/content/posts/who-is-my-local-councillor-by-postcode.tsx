import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import RepresentativeLookup from "@/app/(site)/representatives/RepresentativeLookup";
import {
  COUNCILLOR_FINDERS,
  COUNCILLOR_TOTALS as TOTALS,
  LOCAL_ELECTION_2027,
  councilSearchName,
  councillorFinder,
} from "@/lib/data/local";

const n = (value: number) => value.toLocaleString("en-GB");

const rows = [...COUNCILLOR_FINDERS]
  .sort((a, b) => councilSearchName(a.councilSlug).localeCompare(councilSearchName(b.councilSlug)))
  .map((row) => [
    <Link key="c" href={`/councils/${row.councilSlug}`}>
      {councilSearchName(row.councilSlug)}
    </Link>,
    row.wards,
    row.councillors,
    <a key="f" href={row.url} className="whitespace-nowrap font-[560]">
      Find councillors
    </a>,
  ]);

const glasgow = councillorFinder("glasgow-city");

export default function Post() {
  return (
    <Prose>
      <Lead>
        Most people in Scotland don&apos;t have one local councillor. They have three or four, all
        elected for the same ward, and you can go to any of them. Here&apos;s how to find yours from
        your postcode in about a minute.
      </Lead>

      <H2 id="postcode">Find my councillor by postcode</H2>
      <P>Each council keeps its own list of councillors, so it&apos;s two quick steps.</P>
      <UL>
        <LI>Put your postcode in the box below. The result names your council at the top.</LI>
        <LI>
          Find that council in the table under it and open its councillor finder. Most ask for your
          postcode or street and then show your ward and every councillor for it, with their email
          addresses.
        </LI>
      </UL>
      <RepresentativeLookup />
      <P>
        The box shows your MSPs and MP as well. If your problem is about the NHS, benefits or the
        law, they&apos;re the ones to ask, and my guide to{" "}
        <Link href="/who-is-my-msp">who is my MSP</Link> explains which does what.
      </P>

      <H2 id="councils">Councillors in my area, council by council</H2>
      <GuideTable
        kicker={`${TOTALS.councils} councils, ${n(TOTALS.wards)} wards, ${n(TOTALS.councillors)} councillors`}
        title="Find your councillors"
        columns={["Council", "Wards", "Councillors", "Councillor finder"]}
        align={["left", "right", "right", "left"]}
        rows={rows}
        caption="Wards and councillors from Boundaries Scotland, in use since the May 2022 election. Finder links go to each council's own website and were checked on 29 October 2026. If one has moved, search the council's website for find my councillor."
      />

      <H2 id="who">Who are my councillors, and why there are several</H2>
      <P>
        Since 2007 Scotland has elected councillors in groups. Each council is split into wards,
        and almost every ward elects three or four councillors. Some island wards elect one or two.
        {glasgow && (
          <>
            {" "}Glasgow, for example, has {glasgow.councillors} councillors across{" "}
            {glasgow.wards} wards.
          </>
        )}
      </P>
      <P>
        You vote by numbering the candidates in order of preference, so a ward often ends up with
        councillors from more than one party. That works in your favour. Every councillor for your
        ward represents you equally. If one doesn&apos;t reply, or isn&apos;t interested, go to
        another. You don&apos;t need a reason.
      </P>

      <H2 id="what">What a local councillor for my area can help with</H2>
      <UL>
        <LI>Council house repairs, damp and mould</LI>
        <LI>Homelessness applications and temporary accommodation</LI>
        <LI>Bins, recycling and fly tipping</LI>
        <LI>Roads, pavements, potholes and street lights</LI>
        <LI>School places and catchment areas</LI>
        <LI>Social care and care at home</LI>
        <LI>Council tax bills, discounts and reductions</LI>
        <LI>Planning applications and licensing</LI>
      </UL>
      <P>
        Councillors don&apos;t run services day to day. Council staff do. What a councillor can do
        is chase it, ask questions officials have to answer, and raise it at council meetings.
        Benefits, the NHS and the minimum wage aren&apos;t council matters, and{" "}
        <Link href="/who-decides">who decides what</Link> sets out where they sit.
      </P>

      <H2 id="contact">How to contact my local councillor</H2>
      <UL>
        <LI>
          Email is usually quickest. The council&apos;s finder gives each councillor&apos;s address,
          and often a phone number.
        </LI>
        <LI>
          Many councillors hold drop in surgeries in the ward. The council&apos;s councillor pages or
          the councillor&apos;s own page will list them.
        </LI>
        <LI>
          Say where you live, what&apos;s happened, what you&apos;ve already tried and what you want
          done. Add photos and reference numbers if you have them.
        </LI>
      </UL>
      <Aside title="Report it first, then go to your councillor">
        <p>
          If it&apos;s a council service, report it to the council first and keep the reference
          number. Then your councillor has something specific to chase, and it&apos;s much harder
          for it to get lost.
        </p>
      </Aside>
      <P>
        While you&apos;re there, it&apos;s worth seeing what your council actually does with the
        money. Each council has its own page, linked from the table above, and{" "}
        <Link href="/best-council-in-scotland">the best council in Scotland</Link> ranks all 32.
      </P>

      <H2 id="election">The next council election</H2>
      <P>
        The next council elections are on {LOCAL_ELECTION_2027.date}, in all {TOTALS.councils}{" "}
        councils at once. Every councillor&apos;s seat is up. If you&apos;ve had a good or a bad
        experience with yours, that&apos;s the day it counts.
      </P>

      <PostCTA
        title="Want to write to your MP and MSP too?"
        body="The email tool finds them from your postcode, adds your local figures and drafts the emails. You read and send them yourself."
        href="/email-your-mp-and-msp"
        cta="Write the emails"
      />
    </Prose>
  );
}
