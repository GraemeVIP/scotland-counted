"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { POSTCODE_SESSION_KEY } from "@/lib/representatives";

export default function PostcodeStart() {
  const router = useRouter();
  const inputId = useId();
  const [postcode, setPostcode] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const field = event.currentTarget.elements.namedItem("postcode") as HTMLInputElement | null;
    const value = (field?.value ?? postcode).trim().toUpperCase();
    if (!value) return;

    sessionStorage.setItem(POSTCODE_SESSION_KEY, value);
    router.push("/find-my-mp-and-msp#letter-builder");
  }

  return (
    <div className="w-full max-w-[620px]">
      <form onSubmit={submit} className="grid gap-2.5 sm:grid-cols-[minmax(0,260px)_auto]">
        <label className="sr-only" htmlFor={inputId}>
          Your Scottish postcode
        </label>
        <input
          id={inputId}
          name="postcode"
          type="text"
          value={postcode}
          onChange={(event) => setPostcode(event.target.value.toUpperCase())}
          placeholder="Your postcode, e.g. G12 8QQ"
          data-clarity-mask="true"
          autoComplete="postal-code"
          inputMode="text"
          required
          className="ui w-full rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule-strong)] px-4 py-3.5 text-[16px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] outline-none transition-colors"
        />
        <button type="submit" className="btn btn-primary justify-center whitespace-nowrap">
          Find my MP and MSP
          <span aria-hidden="true">→</span>
        </button>
      </form>
      <p className="mt-3 text-[15px] text-[var(--ink-2)] leading-[1.5]">
        I find the right people and write the emails for you. I do not save your postcode.
      </p>
    </div>
  );
}
