# PrivatePay 🌙

Privacy-first payroll & splits on **Midnight**. A payroll is kept as a public
counter; every amount that flows into it is a **private** circuit parameter.
Each party reveals only what they `disclose()` — never the full financial
picture.

Built for the **New Moon to Full: Monthly Moonshots on Midnight** program.

## The contract

`contracts/private_pay.compact` (Compact 0.23):

```text
createPayroll(total)  -> the private total is disclosed onto the ledger
fund(amount)          -> a payer adds a private amount (only the running total changes)
claim(share)          -> a beneficiary withdraws their share (asserted <= balance)
```

Because the ledger uses a `Counter`, increments and decrements commit only to
the delta — the contract never commits to *who* funded or *what* the total
was declared as.

## Toolchain

Midnight toolchain is a Compact compiler + a ZK proof server:

| Component | Install |
|---|---|
| Compact compiler | `curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh \| sh` then `compact update 0.31.1` |
| Proof server | `docker compose up -d` (image `midnightntwrk/proof-server`), or `docker run -p 6300:6300 midnightntwrk/proof-server:8.1.0 midnight-proof-server -v` |

> **Windows:** Midnight is natively supported on Linux/macOS. On Windows,
> develop in **WSL 2** (`wsl --install`) and run the commands above inside the
> WSL shell.

## Build & test

```bash
npm ci                 # this repo has zero dependencies
npm run compile        # compact compile contracts/private_pay.compact -> contracts/managed/private_pay
npm test               # contract model + lifecycle tests
npm run check          # syntax-check every JS entry point
npm run build          # static UI build into dist/
npm run demo           # simulate create -> fund -> claim through the ledger model
```

`npm run compile` generates `contracts/managed/private_pay/` (JS bindings, zkIR
circuits, prover/verifier keys). That directory is git-ignored by default —
commit the generated artifacts if you want a byte-level auditable build.

## Talking to a real Midnight network

1. Start the proof server: `docker compose up -d`.
2. Compile the contract (above).
3. In your DApp, wire the generated driver to the
   [`@midnight-ntwrk/midnight-js-contracts`](https://www.npmjs.com/package/@midnight-ntwrk/midnight-js-contracts)
   SDK (`createContract`), your wallet (in-browser: **Lace** — Settings »
   Midnight » set proof server to `Local (http://localhost:6300)`), and a
   DevNet/TestNet RPC node + indexer from the
   [Midnight environments page](https://docs.midnight.network/relnotes/overview.md#environments).
4. Deploy and call `createPayroll`, `fund`, `claim` exactly like the demo in
   `src/index.mjs`.

Network presets: local DevNet (`docker compose`), public `preview` and
`preprod` testnets. This is where the L1–L3 "wired to Lace on Preprod" work
runs; the repo keeps the contract + tests + CI/CD layer fully reproducible, so
the on-chain wiring is a one-command deploy.

## Layout

```text
contracts/private_pay.compact   Compact contract (source of truth)
src/ledger.js                   ledger model mirroring the contract semantics
src/index.mjs                   dependency-free demo runner
src/ui/                         static frontend (Lace-ready, demo mode in-browser)
scripts/                        build + syntax-check (zero-dep)
tests/                          node:test suite for the model + contract source
docker-compose.yml              local proof server
.github/workflows/ci.yml        compile + check + test + build on every push
```

## CI/CD

`.github/workflows/ci.yml` installs the official Compact toolchain, compiles the
contract on every push, syntax-checks the source, runs the tests, and builds
the UI — so a broken contract or commit is caught before review.