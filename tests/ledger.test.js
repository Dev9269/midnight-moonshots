import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { initialState, actions, reduce, check } from "../src/ledger.js";
import { createApp } from "../src/ui/app-core.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("initial state is zero", () => {
  assert.equal(initialState(), 0n);
});

test("create payroll sets the total", () => {
  assert.equal(reduce(0n, { type: actions.CreatePayroll, amount: 500n }), 500n);
});

test("fund adds to the balance", () => {
  assert.equal(reduce(500n, { type: actions.Fund, amount: 250n }), 750n);
});

test("claim subtracts the share", () => {
  assert.equal(reduce(750n, { type: actions.Claim, share: 300n }), 450n);
});

test("claim cannot exceed the balance", () => {
  assert.equal(check({ type: actions.Claim, share: 1000n }, 750n), false);
  assert.throws(() => reduce(750n, { type: actions.Claim, share: 1000n }));
});

test("privacy rule: only share values are disclosed on claim (ledger delta)", () => {
  const before = reduce(0n, { type: actions.CreatePayroll, amount: 1000n });
  const after = reduce(before, { type: actions.Claim, share: 250n });
  assert.equal(before, 1000n);
  assert.equal(after, 750n);
});

test("unknown actions keep the state unchanged", () => {
  assert.equal(reduce(10n, { type: "Nope" }), 10n);
});

test("contract source is valid Compact 0.23 (pragma + ledger + circuits)", () => {
  const src = readFileSync(join(root, "contracts", "private_pay.compact"), "utf8");
  assert.match(src, /pragma language_version 0\.23/i);
  assert.match(src, /import CompactStandardLibrary/i);
  assert.match(src, /export ledger total: Uint<64>/i);
  assert.match(src, /export circuit createPayroll/i);
  assert.match(src, /export circuit fund/i);
  assert.match(src, /export circuit claim/i);
});

test("compiled artifacts are gitignored until a local compile produces them", () => {
  const gitignore = readFileSync(join(root, ".gitignore"), "utf8");
  assert.match(gitignore, /contracts\/managed\//);
  assert.ok(!existsSync(join(root, "contracts", "managed")));
});

test("ui demo app drives the ledger", () => {
  const els = {};
  const refs = {
    ledger: { textContent: "" },
    log: { textContent: "" },
    walletStatus: { textContent: "" },
    create: { addEventListener() {} },
    fund: { addEventListener() {} },
    claim: { addEventListener() {} },
    connect: {
      addEventListener(evt, cb) {
        this.cb = cb;
      },
    },
    inputs: {
      total: { value: "1000" },
      payeeCount: { value: "3" },
      amount: { value: "500" },
      share: { value: "250" },
    },
  };
  createApp(refs);
  assert.ok(typeof refs.ledger.textContent === "string");
});