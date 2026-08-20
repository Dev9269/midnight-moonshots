# PrivatePay 🌙

Privacy-first payroll & splits on **Midnight**. A payroll is created with a
private total, funded by payers, and claimed by beneficiaries — only what you
`disclose()` becomes public.

Built for the **New Moon to Full: Monthly Moonshots on Midnight** program.

## What's here

| Path | What |
|------|------|
| `contracts/private_pay.compact` | The Compact contract (create / fund / claim circuits) |
| `src/index.mjs` | Midnight.js SDK wiring (contract creation, wallet) |
| `src/ledger.js` | Ledger reduce for the contract state |
| `src/ui/` | Minimal frontend (connect Lace, create, fund, claim) |
| `tests/` | Contract + ledger tests |
| `docker-compose.yml` | Proof server + Compact compiler (official toolchain) |
| `.github/workflows/ci.yml` | Compile + test + build on every push |

## Toolchain (Level 1)

1. Install [Node 22](https://nodejs.org) and [Docker](https://docker.com).
2. `docker compose up -d` — starts the proof server on `:6300` and the
   Compact compiler container.
3. `npm ci && npm run compile` — compiles `contracts/private_pay.compact`.
4. `npm test` — runs the test suite.

## Contract summary

```text
createPayroll(payeeCount, total)  -> public: id + payee count; total stays private
fund(payrollId, amount)           -> public: payroll id only; amount stays private
claim(payrollId, share)           -> public: payroll id + the claimant's own share
```

Selective disclosure is the point: a payroll's total and individual funding
amounts are never public; each beneficiary reveals only their own share.

## Deploying to Preprod/Preview

```bash
npm run compile
npx midnight-deploy --network preprod --contract build/private_pay --proof-server http://localhost:6300
```

Set your Midnight network application id in `src/ui/app.js` (`APP_ID`) before
running `npm run dev`.

## Roadmap (Levels 4–6)

- **Waxing Gibbous (L4):** live MVP on Preprod with docs, CI/CD, X profile.
- **Full Moon (L5):** private payroll product with employer/payroll workflows
  and multi-currency private splits.
- **Supermoon (L6):** mainnet launch + audited circuits.