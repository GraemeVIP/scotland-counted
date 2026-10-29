import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { SOCIAL_SECURITY_SCOTLAND as SSS } from "@/lib/data/benefits";

export default function Post() {
  return (
    <Prose>
      <Lead>
        The Adult Disability Payment phone number is <a href={SSS.phoneHref}>{SSS.phone}</a>.
        It&apos;s Social Security Scotland&apos;s freephone line, open {SSS.hours}. The same number
        covers new claims, questions about a claim you&apos;ve already made, and changes of
        circumstances.
      </Lead>

      <H2 id="numbers">Adult disability payment number and other ways in</H2>
      <GuideTable
        title="How to contact Social Security Scotland"
        columns={["How", "Details", "When"]}
        rows={[
          ["Freephone", <a key="p" href={SSS.phoneHref}>{SSS.phone}</a>, "8am to 5pm, Monday to Friday"],
          ["From outside the UK", SSS.abroad, "Not free. Ask them to call you back."],
          ["Webchat", "On mygov.scot", "8am to 5pm, Monday to Friday"],
          ["British Sign Language", "Contact Scotland BSL video call", "Through Contact Scotland BSL"],
          ["Post", SSS.post.join(", "), "Any time"],
        ]}
        caption="Lines are closed on bank holidays. If your mobile won't call 0800 numbers, you can call free from a landline or payphone."
      />

      <H2 id="ready">What to have ready before you call</H2>
      <P>
        I&apos;d have these in front of you. It makes the call shorter and saves you being asked to
        ring back.
      </P>
      <UL>
        <LI>Your National Insurance number. They can find you much quicker with it.</LI>
        <LI>Your full name, date of birth and address.</LI>
        <LI>Bank, building society or credit union details if you&apos;re starting a claim.</LI>
        <LI>The names of your GP and anyone else who supports you, like a nurse or social worker.</LI>
        <LI>A rough list of what your condition makes hard: cooking, washing, dressing, getting out.</LI>
      </UL>

      <H2 id="apply-by-phone">Applying for adult disability payment by phone</H2>
      <P>
        You can start a claim on the phone. They&apos;ll take your details and fill in part 1 with
        you there and then. After that they post you a paper form for part 2, with a return envelope.
        You have 8 weeks to send it back and you can ask for longer.
      </P>
      <P>
        If you&apos;re applying for someone who is terminally ill, the whole application can be done
        on the phone in one go. The full rules and rates are on the{" "}
        <Link href="/adult-disability-payment">adult disability payment</Link> page.
      </P>

      <Aside title="Is that call really from them?">
        <p>
          Social Security Scotland will never phone you to take a payment. If you&apos;re not sure a
          call is genuine, hang up and ring {SSS.phone} yourself. They&apos;ll tell you whether it
          was them. They also never ask for bank details over webchat.
        </p>
      </Aside>

      <H2 id="other">Other numbers you might be after</H2>
      <UL>
        <LI>
          Need emergency money today? Crisis grants come from your council, not Social Security
          Scotland. Every council&apos;s line is on the{" "}
          <Link href="/crisis-grant-phone-number">crisis grant phone number</Link> page.
        </LI>
        <LI>
          Still on PIP and not moved over yet? PIP is run by the DWP, so questions about it go to
          the DWP rather than this line.
        </LI>
      </UL>

      <PostCTA
        title="Rather not phone?"
        body="Webchat runs the same hours as the phone line, and you can start an Adult Disability Payment claim online through mygov.scot at any time."
        href="https://www.mygov.scot/contact-social-security-scotland"
        cta="Contact options on mygov.scot"
      />
    </Prose>
  );
}
