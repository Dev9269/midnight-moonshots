import { createApp } from "./app-core.js";

const app = createApp({
  connect: document.querySelector("#connect"),
  walletStatus: document.querySelector("#wallet-status"),
  create: document.querySelector("#create"),
  fund: document.querySelector("#fund"),
  claim: document.querySelector("#claim"),
  ledger: document.querySelector("#ledger"),
  log: document.querySelector("#log"),
  inputs: {
    payeeCount: document.querySelector("#payee-count"),
    total: document.querySelector("#total"),
    amount: document.querySelector("#amount"),
    share: document.querySelector("#share"),
  },
});