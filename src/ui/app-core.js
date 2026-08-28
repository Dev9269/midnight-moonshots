// app-core.js is intentionally isolated from the DOM so the whole demo can run
// in Node for tests too. It drives the in-browser ledger simulator.

import { initialState, actions, reduce } from "../ledger.js";

export function createApp(els) {
  let wallet = null;
  let ledger = initialState();

  const render = () => {
    els.ledger.textContent = `total = ${ledger}`;
  };

  const log = (msg) => {
    els.log.textContent = `${new Date().toLocaleTimeString()}  ${msg}\n${els.log.textContent}`;
  };

  const num = (input, fallback = 0) => {
    const n = Number(input.value || fallback);
    return Number.isFinite(n) ? n : fallback;
  };

  const requireWallet = () => {
    if (!wallet) {
      log("Connect a wallet first.");
      return false;
    }
    return true;
  };

  els.connect.addEventListener("click", () => {
    wallet = { address: "demo-wallet", connected: true };
    els.walletStatus.textContent = "Connected: demo-wallet (simulated)";
    log("Wallet connected (in-browser simulation).");
  });

  els.create.addEventListener("click", () => {
    if (!requireWallet()) return;
    const total = num(els.inputs.total);
    const payeeCount = num(els.inputs.payeeCount, 1);
    ledger = reduce(ledger, { type: actions.CreatePayroll, amount: BigInt(total) });
    render();
    log(`createPayroll(total=${total}, payees=${payeeCount})  — total disclosed, payee list private`);
  });

  els.fund.addEventListener("click", () => {
    if (!requireWallet()) return;
    const amount = num(els.inputs.amount);
    ledger = reduce(ledger, { type: actions.Fund, amount: BigInt(amount) });
    render();
    log(`fund(amount=${amount})  — amount stays private`);
  });

  els.claim.addEventListener("click", () => {
    if (!requireWallet()) return;
    const share = num(els.inputs.share);
    try {
      ledger = reduce(ledger, { type: actions.Claim, share: BigInt(share) });
      render();
      log(`claim(share=${share})  — share disclosed`);
    } catch (e) {
      log(`claim rejected: ${e.message}`);
    }
  });

  render();
  return { getLedger: () => ledger };
}