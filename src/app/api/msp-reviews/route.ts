import { readLimitedBody } from "@/lib/requestBody";
import { NextResponse } from "next/server";
import { getMspReviewProfileByMemberId } from "@/lib/data/mspReviews";
import { submitMspReview } from "@/lib/mspReviewsDb";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };
const RELATIONSHIPS = new Set(["constituent", "family advocate", "community advocate"]);

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function boolean(value: unknown) {
  return value === true || value === "true" || value === "on" || value === "1";
}

function redirect(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303, headers: NO_STORE });
}

function fail(request: Request, json: boolean, message: string, status = 400, mspSlug?: string) {
  if (json) return NextResponse.json({ error: message }, { status, headers: NO_STORE });
  const params = new URLSearchParams({ status: "error" });
  if (mspSlug) params.set("msp", mspSlug);
  return redirect(request, `/msp-reviews/submitted?${params}`);
}

export async function POST(request: Request) {
  const json = request.headers.get("content-type")?.includes("application/json") === true;
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return fail(request, json, "Review submissions are disabled on previews.", 403);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return fail(request, json, "Open this form on Scotland Counted to submit a review.", 403);
  let body: Record<string, unknown>;
  try {
    const bytes = await readLimitedBody(request);
    const bounded = new Response(bytes as BodyInit, { headers: { "Content-Type": request.headers.get("content-type") || "application/json" } });
    body = json ? await bounded.json() : Object.fromEntries(await bounded.formData());
    if (!body || typeof body !== "object" || Array.isArray(body)) return fail(request, json, "The review could not be read.");
  } catch (error) {
    return fail(request, json, error instanceof RangeError ? "The review is too large." : "The review could not be read.", error instanceof RangeError ? 413 : 400);
  }

  if (text(body.botcheck)) {
    return json
      ? NextResponse.json({ success: true, confirmationPath: "/msp-reviews/submitted" }, { headers: NO_STORE })
      : redirect(request, "/msp-reviews/submitted");
  }

  const profile = getMspReviewProfileByMemberId(Number(body.memberId));
  const rating = Number(body.rating);
  const title = text(body.title);
  const story = text(body.story);
  const displayName = text(body.displayName);
  const followUpOptIn = boolean(body.followUpOptIn);
  const submittedEmail = text(body.email).toLowerCase();
  const email = followUpOptIn ? submittedEmail : "";
  const relationship = text(body.relationship);
  const interactionMonth = text(body.interactionDate);

  const slug = profile?.slug;
  if (!profile) return fail(request, json, "Choose a current MSP.");
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return fail(request, json, "Choose a rating from 1 to 5.", 400, slug);
  if (title.length < 8 || title.length > 100) return fail(request, json, "The headline must be between 8 and 100 characters.", 400, slug);
  if (story.length < 80 || story.length > 4000) return fail(request, json, "The account must be between 80 and 4,000 characters.", 400, slug);
  if (displayName.length < 2 || displayName.length > 70) return fail(request, json, "Enter the name that may be shown with the review.", 400, slug);
  if (email && (email.length < 5 || email.length > 254 || !/^\S+@\S+\.\S+$/.test(email))) return fail(request, json, "Enter a valid email address.", 400, slug);
  if (followUpOptIn && !email) return fail(request, json, "Enter an email address if you would like to be considered for a follow up.", 400, slug);
  if (!RELATIONSHIPS.has(relationship)) return fail(request, json, "Choose how you were connected to the experience.", 400, slug);
  if (!boolean(body.firsthand) || !boolean(body.permission)) return fail(request, json, "Both confirmations are required.", 400, slug);
  if (interactionMonth && !/^\d{4}-(0[1-9]|1[0-2])$/.test(interactionMonth)) return fail(request, json, "Enter a valid interaction month.", 400, slug);
  if (interactionMonth && interactionMonth > new Date().toISOString().slice(0, 7)) return fail(request, json, "The interaction month cannot be in the future.", 400, slug);

  try {
    await submitMspReview({
      memberId: profile.msp.memberId,
      mspSlug: profile.slug,
      mspName: profile.msp.name,
      rating,
      title,
      body: story,
      displayName,
      email: email || null,
      followUpOptIn,
      relationship,
      interactionMonth: interactionMonth ? `${interactionMonth}-01` : null,
    });
    const confirmationPath = `/msp-reviews/submitted?msp=${encodeURIComponent(profile.slug)}`;
    return json
      ? NextResponse.json({ success: true, confirmationPath }, { status: 201, headers: NO_STORE })
      : redirect(request, confirmationPath);
  } catch (error) {
    console.error("MSP review submission failed", error instanceof Error ? error.name : "Unknown error");
    return fail(request, json, "The review could not be saved. Please try again shortly.", 502, slug);
  }
}
