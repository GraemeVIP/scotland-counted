import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";

export default function Post() {
  return (
    <Prose>
      <Lead>
        Most people never write to the people who represent them. When you ask why, the answer is
        almost never that they do not care. It is that nobody ever told them how it works, and
        nobody wants to look daft.
      </Lead>

      <P>
        So here is the whole thing, plainly. There is no test, no form of words you have to get
        right, and no way to do it wrong.
      </P>

      <H2 id="mp-and-msp">First: you have two of them</H2>

      <P>
        Everyone in Scotland has both an MP and an MSP. They are different people in different
        buildings deciding different things.
      </P>

      <UL>
        <LI>
          <strong>Your MP</strong> works in the UK Parliament in London. They help decide Universal
          Credit, most benefits, help with private rent, tax and the State Pension.
        </LI>
        <LI>
          <strong>Your MSP</strong> works in the Scottish Parliament in Edinburgh. They help decide
          the Scottish Child Payment, council houses, homelessness help, schools, childcare and the
          NHS in Scotland.
        </LI>
      </UL>

      <P>
        You do not need to work out which one handles your issue. If you are not sure, write to
        both. Nobody will mind, and the wrong one will usually pass it on.
      </P>

      <Aside title="You do not need to have voted for them">
        <p>
          This is the one that stops people most often. An MP or MSP represents{" "}
          <strong>everyone</strong> who lives in their area, people who voted for them, people who
          voted against them, and people who did not vote at all. They still have to deal with you.
        </p>
      </Aside>

      <H2 id="what-to-say">What to actually say</H2>

      <P>
        Short is better than long. A message that takes two minutes to read is more likely to be
        read than one that takes ten. A good one has four parts:
      </P>

      <UL>
        <LI>
          <strong>Where you live.</strong> This is the part that makes them have to answer. They
          represent your area, so say you live in it.
        </LI>
        <LI>
          <strong>One fact.</strong> Not ten. One clear, checkable local figure lands harder than a
          general complaint about the state of things.
        </LI>
        <LI>
          <strong>A clear question.</strong> Something specific enough that a vague reply is
          obviously a vague reply.
        </LI>
        <LI>
          <strong>A request for an answer.</strong> Ask them to reply. It changes how the message
          is handled.
        </LI>
      </UL>

      <H3>What not to worry about</H3>

      <P>
        Spelling. Grammar. Whether you sound clever enough. None of it matters, and none of it is
        being judged. Staff read constituent mail all day and what registers is that a real person
        in the area took the time to write.
      </P>

      <P>Being angry is fine. Threatening anybody is not, and will get your message binned.</P>

      <H2 id="what-happens-next">What happens next</H2>

      <P>
        You will usually get a reply, though it can take a few weeks. It might be a standard letter
        rather than a personal one. That is normal and it does not mean it was ignored.
      </P>

      <P>
        Offices keep a record of what constituents are writing in about. That is the part people
        underestimate: even where an individual reply is short, the volume of letters on a subject
        is tracked, and it shapes what gets raised. One letter is a data point. Two hundred from
        the same area is a problem that needs managing.
      </P>

      <Aside title="If you get a non-answer">
        <p>
          Write back once, quoting your original question and asking it again. Politely refusing to
          accept a non-answer is entirely legitimate, and it is what journalists do.
        </p>
      </Aside>

      <H2 id="one-minute-version">The one-minute version</H2>

      <P>
        If all of that still feels like effort, that is exactly why this site exists. Put in your
        postcode and I will find both of your representatives, put your own area&apos;s figures
        into the message, write both emails and open them in your email app. You read them, change
        anything you like, and press send.
      </P>

      <PostCTA
        title="Write to your MP and MSP now"
        body="Enter your postcode. I find the right people and write both emails for you. Nothing is sent from this site and your postcode is not saved."
        href="/email-your-mp-and-msp"
        cta="Write my emails for me"
      />

      <P>
        Not sure who represents you? <Link href="/constituencies">Find your MP&apos;s area</Link>{" "}
        or <Link href="/areas">look up your council</Link>.
      </P>
    </Prose>
  );
}
