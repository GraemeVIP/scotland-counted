import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TOKEN = /^[0-9a-f]{64}$/i;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store, max-age=0" },
  });
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json({ error: "Storage is not configured" }, 500);

  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return json({ error: "The request could not be read" }, 400);
  }

  const id = typeof input.id === "string" ? input.id : "";
  const token = typeof input.token === "string" ? input.token : "";
  if (!UUID_V4.test(id) || !TOKEN.test(token)) return json({ error: "Invalid moderation link" }, 403);

  const tokenHash = await sha256(token);
  const query = `id=eq.${encodeURIComponent(id)}&status=eq.pending&moderation_token_hash=eq.${tokenHash}`;
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };

  if (input.action === "view") {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/msp_review_submissions?${query}&select=id,msp_name,rating,title,body,display_name,email,follow_up_opt_in,relationship,interaction_month,created_at`,
      { headers },
    );
    if (!response.ok) return json({ error: "The submission could not be loaded" }, 502);
    const rows = await response.json();
    return rows[0]
      ? json({ submission: rows[0] })
      : json({ error: "This link has expired or the review was already decided" }, 410);
  }

  if (input.action !== "approve" && input.action !== "reject") {
    return json({ error: "Invalid decision" }, 400);
  }
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const body = typeof input.body === "string" ? input.body.trim() : "";
  const displayName = typeof input.displayName === "string" ? input.displayName.trim() : "";
  if (input.action === "approve" && (
    title.length < 8 || title.length > 100 ||
    body.length < 80 || body.length > 4000 ||
    displayName.length < 2 || displayName.length > 70
  )) {
    return json({ error: "The edited review does not meet the required lengths" }, 400);
  }

  const approving = input.action === "approve";
  const response = await fetch(`${supabaseUrl}/rest/v1/msp_review_submissions?${query}`, {
    method: approving ? "PATCH" : "DELETE",
    headers: { ...headers, Prefer: "return=representation" },
    ...(approving
      ? {
          body: JSON.stringify({
            title,
            body,
            display_name: displayName,
            status: "approved",
            moderation_token_hash: null,
          }),
        }
      : {}),
  });
  if (!response.ok) return json({ error: "The decision could not be saved" }, 502);
  const rows = await response.json();
  return rows[0]
    ? json({ success: true, decision: approving ? rows[0].status : "rejected" })
    : json({ error: "This link has expired or the review was already decided" }, 410);
});
