import { NextResponse } from "next/server";
import { validateContactInput } from "@/lib/contact";
import { ContactMailNotConfiguredError, sendContactMessage } from "@/lib/contactMail";
import { readLimitedBody } from "@/lib/requestBody";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

function fail(message: string, status = 400, field?: string) {
  return NextResponse.json({ error: message, ...(field ? { field } : {}) }, { status, headers: NO_STORE });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return fail("Open this form on Scotland Counted to send a message.", 403);
  }

  let body: Record<string, unknown>;
  try {
    const bytes = await readLimitedBody(request, 32 * 1024);
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return fail("Your message could not be read.");
    }
    body = parsed as Record<string, unknown>;
  } catch (error) {
    return fail(
      error instanceof RangeError ? "Your message is too long." : "Your message could not be read.",
      error instanceof RangeError ? 413 : 400,
    );
  }

  const check = validateContactInput(body);
  if (!check.ok) {
    return fail(check.error, 400, check.field);
  }

  if (check.honeypot) {
    return NextResponse.json(
      { success: true, reference: "SC-RECEIVED", reasonLabel: "General question or feedback" },
      { status: 201, headers: NO_STORE },
    );
  }

  try {
    const sent = await sendContactMessage(check.data);
    return NextResponse.json({ success: true, ...sent }, { status: 201, headers: NO_STORE });
  } catch (error) {
    if (error instanceof ContactMailNotConfiguredError) {
      return fail("The contact inbox is not set up on local preview. It sends when live on the site.", 503);
    }
    console.error("Contact form submission failed", error instanceof Error ? error.name : "Unknown error");
    return fail("Your message could not be sent right now. Please try again shortly.", 502);
  }
}
