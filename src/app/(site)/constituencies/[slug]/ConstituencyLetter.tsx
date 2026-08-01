"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { POSTCODE_SESSION_KEY, type Representative } from "@/lib/representatives";
import { buildLetter, mailtoUrl, type LetterArea } from "@/lib/letter";

/**
 * The action step on a constituency page.
 *
 * Most visitors arrive here from a search for their own town, so the email has
 * to be reachable from this page rather than from the start of the postcode
 * flow. A Westminster seat already names the MP, so the letter needs nothing
 * typed. The postcode is only asked for afterwards, to add the MSP — which a
 * Westminster boundary genuinely cannot tell us.
 */
export default function ConstituencyLetter({
  slug,
  area,
}: {
  slug: string;
  area: LetterArea;
}) {
  const router = useRouter();
  const [mp, setMp] = useState<Representative | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error" | "ready">("idle");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [personal, setPersonal] = useState("");
  const [copied, setCopied] = useState(false);
  const [postcode, setPostcode] = useState("");

  const letter = mp
    ? buildLetter({ area, role: "MP", representative: mp, senderName, personal })
    : "";

  async function writeEmail() {
    setState("loading");
    setMessage("");
    try {
      const response = await fetch(`/api/mp?constituency=${encodeURIComponent(slug)}`, {
        cache: "no-store",
      });
      const result = (await response.json()) as { mp?: Representative; error?: string };
      if (!response.ok || !result.mp) {
        throw new Error(result.error ?? "The lookup failed.");
      }
      setMp(result.mp);
      setState("ready");
    } catch (caught) {
      setState("error");
      setMessage(
        caught instanceof Error ? caught.message : "Parliament's records could not be reached just now."
      );
    }
  }

  async function copyLetter() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 3200);
    } catch {
      setCopied(false);
    }
  }

  function goToFullFlow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = postcode.trim().toUpperCase();
    if (!value) return;
    sessionStorage.setItem(POSTCODE_SESSION_KEY, value);
    router.push("/take-action#letter-builder");
  }

  const inputCls =
    "ui w-full rounded-[var(--r-s)] bg-[var(--paper)] border border-[var(--rule-strong)] px-3.5 py-3 text-[16px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] outline-none transition-colors";

  return (
    <section
      id="email-your-mp"
      className="scroll-mt-24 rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] p-6 sm:p-8"
      style={{ boxShadow: "var(--shadow-2)" }}
    >
      <h2 className="h2 mb-2">Email the MP for {area.name}</h2>

      {state !== "ready" && (
        <>
          <p className="text-[17px] text-[var(--ink-2)] leading-[1.6] max-w-[62ch]">
            One MP speaks for this area. I already know who it is, so you do not need to enter
            anything. Press the button and I will write the email, with the figures from this
            page, ready for you to read and send.
          </p>

          <button
            type="button"
            onClick={writeEmail}
            disabled={state === "loading"}
            className="btn btn-primary mt-5 justify-center"
          >
            {state === "loading" ? "Writing your email…" : "Write my email to the MP"}
            {state !== "loading" && <span aria-hidden="true">→</span>}
          </button>

          <p className="mt-3 text-[15px] text-[var(--muted)] leading-[1.5]">
            Nothing is sent from this site. The finished email opens in your own email app.
          </p>
        </>
      )}

      <div aria-live="polite">
        {state === "error" && (
          <p className="mt-4 text-[15px] text-[var(--bad-text)] leading-[1.5]">
            {message} You can still{" "}
            <a href="/take-action">use the postcode finder</a>.
          </p>
        )}

        {state === "ready" && mp && (
          <div className="mt-1">
            <p className="text-[17px] text-[var(--ink-2)] leading-[1.6] max-w-[62ch]">
              Your email is written and addressed. Read it, then press the button to open it in
              your own email app.
            </p>

            <div className="mt-5 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4">
              <p className="ui text-[15px] font-[720] text-[var(--action)]">Your MP</p>
              <p className="text-[20px] font-[700] mt-1">{mp.name}</p>
              <p className="text-[15px] text-[var(--ink-2)] leading-[1.45] mt-1">
                {mp.party} · {mp.constituency}
              </p>
              <a href={`mailto:${mp.email}`} className="text-[15px] break-all inline-block mt-2">
                {mp.email}
              </a>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="ui text-[15px] font-[700] block mb-1.5" htmlFor="letter-name">
                  Your name (optional)
                </label>
                <input
                  id="letter-name"
                  type="text"
                  value={senderName}
                  onChange={(event) => setSenderName(event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="ui text-[15px] font-[700] block mb-1.5" htmlFor="letter-personal">
                  Add a sentence of your own (optional)
                </label>
                <input
                  id="letter-personal"
                  type="text"
                  value={personal}
                  onChange={(event) => setPersonal(event.target.value)}
                  placeholder="Something about your street, family, work or bills."
                  className={inputCls}
                />
              </div>
            </div>

            <div className="mt-5 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-5">
              <p className="label mb-3">Your email</p>
              <pre className="text-[16px] leading-[1.65] whitespace-pre-wrap font-sans text-[var(--ink-2)] m-0 overflow-x-auto">
                {letter}
              </pre>
            </div>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-[auto_auto] sm:justify-start">
              <a
                href={mailtoUrl(mp, area, letter)}
                className="btn btn-primary justify-center text-center"
                aria-label={`Open a ready-to-send email to ${mp.name}, the MP for ${area.name}`}
              >
                Open this email in my email app
              </a>
              <button type="button" onClick={copyLetter} className="btn btn-ghost justify-center">
                {copied ? "Copied" : "Copy the email instead"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-7 pt-6 border-t border-[var(--rule)]">
        <h3 className="h3 mb-2">You also have an MSP. Email them too.</h3>
        <p className="text-[16px] text-[var(--ink-2)] leading-[1.6] max-w-[62ch]">
          Your MP works in London. Your MSP works in Edinburgh, and decides different things —
          like the Scottish Child Payment, council houses and childcare. Asking both is stronger
          than asking one.
        </p>
        <p className="text-[16px] text-[var(--ink-2)] leading-[1.6] max-w-[62ch] mt-2.5">
          Put your postcode in and I will find your MSP and write that email too. It takes a
          few seconds.
        </p>
        <form onSubmit={goToFullFlow} className="mt-4 grid gap-2.5 sm:grid-cols-[minmax(0,240px)_auto] sm:justify-start">
          <label className="sr-only" htmlFor="constituency-postcode">
            Your postcode
          </label>
          <input
            id="constituency-postcode"
            name="postcode"
            type="text"
            value={postcode}
            onChange={(event) => setPostcode(event.target.value.toUpperCase())}
            placeholder="Postcode, e.g. G12 8QQ"
            autoComplete="postal-code"
            inputMode="text"
            required
            className={inputCls}
          />
          <button type="submit" className="btn btn-ghost justify-center whitespace-nowrap">
            Find my MSP too
            <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="mt-3 text-[15px] text-[var(--muted)] leading-[1.5]">
          I use your postcode only to find your representatives. I do not save it.
        </p>
      </div>
    </section>
  );
}
