"use client";

import NextLink from "next/link";
import { useState, type ComponentProps } from "react";

/**
 * A link that fetches its page when someone shows they might open it
 * (hover, touch or keyboard focus), not the moment it scrolls into view.
 *
 * Next.js prefetches every link in the viewport by default. Pages here carry
 * 60 to 100 internal links, so a single visit quietly downloaded dozens of
 * other pages, and every one of those reads counted against Vercel's free
 * allowance (ISR reads and Fast Origin Transfer). Waiting for intent keeps
 * navigation quick without paying for pages nobody opens. It is the pattern
 * the Next.js prefetching guide gives for this.
 *
 * Use it exactly like next/link. An explicit prefetch={false} still wins.
 */
export default function Link({ prefetch, onMouseEnter, onTouchStart, onFocus, ...props }: ComponentProps<typeof NextLink>) {
  const [intent, setIntent] = useState(false);

  return (
    <NextLink
      {...props}
      prefetch={intent ? prefetch : false}
      onMouseEnter={(event) => {
        setIntent(true);
        onMouseEnter?.(event);
      }}
      onTouchStart={(event) => {
        setIntent(true);
        onTouchStart?.(event);
      }}
      onFocus={(event) => {
        setIntent(true);
        onFocus?.(event);
      }}
    />
  );
}
