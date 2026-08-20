import { test } from "node:test";
import assert from "node:assert/strict";
import { Ledger } from "../src/ledger.js";

test("initial state is zero", () => {
  assert.equal(Ledger.initialState(), 0n);
});

test("create payroll sets the total", () => {
  const next = Ledger.reduce(0n, { type: "CreatePayroll", total: 500n });
  assert.equal(next, 500n);
});

test("fund adds to the balance", () => {
  const next = Ledger.reduce(500n, { type: "Fund", amount: 250n });
  assert.equal(next, 750n);
});

test("claim subtracts the share", () => {
  const next = Ledger.reduce(750n, { type: "Claim", share: 300n });
  assert.equal(next, 450n);
});

test("unknown actions keep the state unchanged", () => {
  assert.equal(Ledger.reduce(10n, { type: "Nope" }), 10n);
});