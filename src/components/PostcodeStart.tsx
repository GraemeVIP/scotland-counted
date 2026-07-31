"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { POSTCODE_SESSION_KEY } from "@/lib/representatives";

export default function PostcodeStart() {
  const router = useRouter();
  const [postcode, setPostcode] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = postcode.trim().toUpperCase();
    if (!value) return;

    sessionStorage.setItem(POSTCODE_SESSION_KEY, value);
    router.push("/take-action#letter-builder");
  }

  return (
    <div className="max-w-[620px]">
      <form onSubmit={submit} className="grid gap-2.5 sm:grid-cols-[minmax(0,260px)_auto]">
        <label className="sr-only" htmlFor="home-postcode">
          Your Scottish postcode
        </label>
        <input
          id="home-postcode"
          type="text"
          value={postcode}
          onChange={(event) => setPostcode(event.target.value.toUpperCase())}
          placeholder="Your postcode, e.g. G12 8QQ"
          autoComplete="postal-code"
          inputMode="text"
          required
          className="ui w-full rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule-strong)] px-4 py-3.5 text-[16px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] outline-none transition-colors"
        />
        <button type="submit" className="btn btn-primary justify-center whitespace-nowrap">
          Show me who can act
          <span aria-hidden="true">→</span>
        </button>
      </form>
      <p className="mt-3 text-[15px] text-[var(--ink-2)] leading-[1.5]">
        Your postcode finds your area, MP and constituency MSP automatically. Scotland Counted
        does not save it.
      </p>
    </div>
  );
}
