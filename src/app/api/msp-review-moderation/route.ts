import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { mspReviewProfiles } from "@/lib/data/mspReviews";
import { decideReview, getReviewForModeration } from "@/lib/mspReviewsDb";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE });
}

function validId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function validToken(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{64}$/i.test(value);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("The moderation request could not be read.");
  }

  if (!validId(body.id) || !validToken(body.token)) return fail("This moderation link is invalid.", 403);

  try {
    if (body.action === "view") {
      const submission = await getReviewForModeration(body.id, body.token);
      return submission
        ? NextResponse.json({ submission }, { headers: NO_STORE })
        : fail("This link has expired or the review has already been decided.", 410);
    }

    if (body.action !== "approve" && body.action !== "reject") return fail("Choose approve or reject.");
    const submission = await getReviewForModeration(body.id, body.token);
    if (!submission) return fail("This link has expired or the review has already been decided.", 410);
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const story = typeof body.story === "string" ? body.story.trim() : "";
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
    if (body.action === "approve") {
      if (title.length < 8 || title.length > 100) return fail("The headline must be between 8 and 100 characters.");
      if (story.length < 80 || story.length > 4000) return fail("The account must be between 80 and 4,000 characters.");
      if (displayName.length < 2 || displayName.length > 70) return fail("The display name must be between 2 and 70 characters.");
    }

    const decision = await decideReview({
      id: body.id,
      token: body.token,
      action: body.action,
      title,
      body: story,
      displayName,
    });
    if (decision && body.action === "approve") {
      const profile = mspReviewProfiles.find((item) => item.msp.name === submission.msp_name);
      revalidateTag("msp-reviews", { expire: 0 });
      revalidatePath("/msp-reviews");
      if (profile) {
        revalidatePath(`/msp-reviews/${profile.slug}`);
        revalidatePath(profile.profilePath);
      }
    }
    return decision
      ? NextResponse.json({ success: true, decision }, { headers: NO_STORE })
      : fail("This link has expired or the review has already been decided.", 410);
  } catch (error) {
    console.error("MSP review moderation failed", error);
    return fail("The decision could not be saved. Please try again.", 502);
  }
}
