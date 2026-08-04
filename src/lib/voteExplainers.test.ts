import { test } from "node:test";
import assert from "node:assert/strict";
import { explainVote, plainResult, plainVoteLabel, voteSubstance, SUBSTANCE } from "./voteExplainers.ts";

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
  assert.equal(plainResult("97 Ayes, 358 Noes"), "Did not pass, 97 votes to 358");
  assert.equal(plainResult("Agreed on division"), "Agreed on division");
});

test("vote labels translate without inventing", () => {
  assert.equal(plainVoteLabel("Aye"), "Voted yes");
  assert.equal(plainVoteLabel("Against"), "Voted no");
  assert.equal(plainVoteLabel("Abstain"), "Abstain");
});

test("every division currently on the site has a substance entry", () => {
  const LIVE_TITLES = [
    "Immigration and Asylum Bill: Second Reading",
    "Immigration and Asylum Bill: Reasoned Amendment to Second Reading",
    "Public Office (Accountability) Bill Report Stage: Amendment 199",
    "National Security (State Threats) Bill: motion to agree to Lords Amendment 1",
    "Taxation (Energy and Vehicles) Bill Committee: New Clause 4",
    "Opposition Day: Early release of prisoners",
    "Draft Trade Unions (Permissible Means of Voting) and Employment Rights (Unfair Dismissal) (Amendment) Order 2026",
    "Draft Code of Practice on Electronic and Workplace Ballots for Statutory Trade Union Ballots",
    "Draft Employment Tribunal (Extension of Time Limits) (Miscellaneous Amendments and Transitional Provisions) Regulations 2026",
    "Draft Employment Tribunals Extension of Jurisdiction (England and Wales) (Amendment) Order 2026",
    "Draft Climate Change Act 2008 (Credit Limit) Order 2026",
    "Draft Town and Country Planning (Discharge of Local Planning Authority Functions)  (England) Regulations 2026",
    "Draft Supply of Machinery (Safety) (Amendment etc.) and the EU Machinery Regulation  (Enforcement etc. in Northern Ireland) Regulations 2026",
    "Draft Children\u2019s Wellbeing and Schools Act 2026 (Establishment of Schools)  (Consequential Amendments) Regulations 2026",
    "King's Speech Motion for an Address",
    "Universal Credit (Removal of Two Child Limit) Bill: Second Reading",
  ];
  for (const title of LIVE_TITLES) {
    assert.ok(voteSubstance(title), `no substance entry matches: ${title}`);
  }
});

test("every substance entry keeps tabloid-length sentences", () => {
  for (const entry of SUBSTANCE) {
    const text = entry.what + " " + (entry.example ?? "");
    for (const sentence of text.split(/[.!?]+/)) {
      const words = sentence.trim().split(/\s+/).filter(Boolean);
      assert.ok(words.length <= 32, `sentence too long: ${sentence.trim().slice(0, 60)}`);
    }
  }
});
