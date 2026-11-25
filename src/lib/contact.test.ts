import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getContactReason, validateContactInput } from "./contact.ts";

describe("contact form validation", () => {
  it("resolves known and fallback contact reasons", () => {
    assert.equal(getContactReason("charity-help").id, "charity-help");
    assert.equal(getContactReason("correction").id, "correction");
    assert.equal(getContactReason("unknown").id, "charity-help");
  });

  it("requires an email when wantsReply is true", () => {
    const res = validateContactInput({
      reason: "charity-help",
      wantsReply: true,
      email: "",
      message: "Can you help us with local child poverty numbers for a grant bid?",
    });
    assert.equal(res.ok, false);
    if (!res.ok) assert.equal(res.field, "email");
  });

  it("allows anonymous tips and error reports when wantsReply is false", () => {
    const res = validateContactInput({
      reason: "correction",
      wantsReply: false,
      email: "",
      pageUrl: "https://scotlandcounted.org.uk/safest-place-to-live-in-scotland",
      message: "Highland also fell by 0.5% so three councils fell in total.",
    });
    assert.equal(res.ok, true);
    if (res.ok) {
      assert.equal(res.honeypot, false);
      assert.equal(res.data.reason, "correction");
      assert.equal(res.data.email, "");
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
    const shortMsg = validateContactInput({ reason: "general", wantsReply: false, message: "Hi" });
    assert.equal(shortMsg.ok, false);
    if (!shortMsg.ok) assert.equal(shortMsg.field, "message");

    const badEmail = validateContactInput({
      reason: "press",
      wantsReply: true,
      email: "not-an-email",
      message: "Looking to quote your North Ayrshire crime chart tomorrow.",
    });
    assert.equal(badEmail.ok, false);
    if (!badEmail.ok) assert.equal(badEmail.field, "email");
  });
});
