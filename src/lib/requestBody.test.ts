import { test } from "node:test";
import assert from "node:assert/strict";
import { readLimitedBody } from "./requestBody.ts";

test("review payload limit works with and without Content-Length", async () => {
  const make = (value: string, headers?: Record<string,string>) => new Request("https://example.com", {method:"POST",body:value,headers});
  assert.equal(new TextDecoder().decode(await readLimitedBody(make("hello"),5)),"hello");
  await assert.rejects(readLimitedBody(make("longer"),5),RangeError);
  await assert.rejects(readLimitedBody(make("x",{"content-length":"99999"}),5),RangeError);
  // Byte size matters: two characters can occupy more than two bytes.
  await assert.rejects(readLimitedBody(make("éé"),3),RangeError);
});
