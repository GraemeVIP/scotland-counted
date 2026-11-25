import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getContactReason, validateContactInput } from "./contact.ts";

describe("contact form validation", () => {
  it("resolves known and fallback contact reasons", () => {
    assert.equal(getContactReason("charity-help").id, "charity-help");
    assert.equal(getContactReason("correction").id, "correction");
    assert.equal(getContactReason("unknown").id, "general");
  });

  it("requires both name and email", () => {
    const noName = validateContactInput({
      reason: "charity-help",
      name: "",
      email: "alex@example.org.uk",
      message: "Can you help us with local child poverty numbers for a grant bid?",
    });
    assert.equal(noName.ok, false);
    if (!noName.ok) assert.equal(noName.field, "name");

    const noEmail = validateContactInput({
      reason: "charity-help",
      name: "Alex Smith",
      email: "",
      message: "Can you help us with local child poverty numbers for a grant bid?",
    });
    assert.equal(noEmail.ok, false);
    if (!noEmail.ok) assert.equal(noEmail.field, "email");
  });

  it("accepts a valid submission with name, email and message", () => {
    const res = validateContactInput({
      reason: "correction",
      name: "Alex Smith",
      email: "alex@example.org.uk",
      pageUrl: "https://scotlandcounted.org.uk/safest-place-to-live-in-scotland",
      message: "Highland also fell by 0.5% so three councils fell in total.",
    });
    assert.equal(res.ok, true);
    if (res.ok) {
      assert.equal(res.honeypot, false);
      assert.equal(res.data.reason, "correction");
      assert.equal(res.data.name, "Alex Smith");
      assert.equal(res.data.email, "alex@example.org.uk");
    }
  });

  it("flags honeypot submissions silently without failing", () => {
    const res = validateContactInput({
      reason: "general",
      botcheck: "https://spam.example",
      message: "spam",
    });
    assert.equal(res.ok, true);
    if (res.ok) assert.equal(res.honeypot, true);
  });

  it("rejects very short messages and invalid emails", () => {
    const shortMsg = validateContactInput({
      reason: "general",
      name: "Alex Smith",
      email: "alex@example.org.uk",
      message: "Hi",
    });
    assert.equal(shortMsg.ok, false);
    if (!shortMsg.ok) assert.equal(shortMsg.field, "message");

    const badEmail = validateContactInput({
      reason: "press",
      name: "Alex Smith",
      email: "not-an-email",
      message: "Looking to quote your North Ayrshire crime chart tomorrow.",
    });
    assert.equal(badEmail.ok, false);
    if (!badEmail.ok) assert.equal(badEmail.field, "email");
  });
});
