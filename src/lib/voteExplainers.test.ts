import { test } from "node:test";
import assert from "node:assert/strict";
import { explainVote, plainResult, plainVoteLabel } from "./voteExplainers.ts";

test("a reasoned amendment is not mistaken for a plain second reading", () => {
  const e = explainVote("Immigration and Asylum Bill: Reasoned Amendment to Second Reading");
  assert.ok(e);
  assert.match(e!.plain, /blocking/i);
});

test("statutory instruments are called rules, not laws", () => {
  const e = explainVote(
    "Draft Code of Practice on Electronic and Workplace Ballots for Statutory Trade Union Ballots"
  );
  assert.ok(e);
  assert.match(e!.kind, /rules, not a new law/i);
});

test("committee new clauses match", () => {
  const e = explainVote("Taxation (Energy and Vehicles) Bill Committee: New Clause 5");
  assert.ok(e);
  assert.match(e!.kind, /add a new section/i);
});

test("opposition day motions are flagged as non-binding", () => {
  const e = explainVote("Opposition Day: Early release of prisoners");
  assert.ok(e);
  assert.match(e!.plain, /does not change any law/i);
});

test("unknown shapes return null rather than a guess", () => {
  assert.equal(explainVote("Humble Address to His Majesty"), null);
});

test("results become plain and unparseable strings pass through", () => {
  assert.equal(plainResult("330 Ayes, 199 Noes"), "Passed, 330 votes to 199");
  assert.equal(plainResult("330 Aye, 199 No"), "Passed, 330 votes to 199");
  assert.equal(plainResult("97 Ayes, 358 Noes"), "Did not pass — 97 votes to 358");
  assert.equal(plainResult("Agreed on division"), "Agreed on division");
});

test("vote labels translate without inventing", () => {
  assert.equal(plainVoteLabel("Aye"), "Voted yes");
  assert.equal(plainVoteLabel("Against"), "Voted no");
  assert.equal(plainVoteLabel("Abstain"), "Abstain");
});
