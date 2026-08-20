// Minimal frontend wiring for PrivatePay.
// Uses the Midnight.js SDK + the Lace wallet DApp connector.
// Replace APP_ID with your Midnight network application id.

import { connectToLaceWallet } from "@midnight-ntwrk/midnight-js-wallet-lace";
import { PrivatePay } from "../index.mjs";

const APP_ID = "midnight.moonshots.private-pay";

const zkConfig = {
  // Proof server / compiler URL from docker-compose (midnight-proof-server)
  zkConfigPath: "/proofs/private_pay.compact",
  dockerImage: "midnightnetwork/compact-compiler:latest",
};

const els = {
  connect: document.querySelector("#connect"),
  status: document.querySelector("#wallet-status"),
  create: document.querySelector("#create"),
  fund: document.querySelector("#fund"),
  claim: document.querySelector("#claim"),
  log: document.querySelector("#log"),
};

let wallet;
let contract;

function log(msg) {
  els.log.textContent = `${new Date().toLocaleTimeString()} ${msg}\n` + els.log.textContent;
}

els.connect.addEventListener("click", async () => {
  try {
    wallet = await connectToLaceWallet(APP_ID);
    const address = await wallet.getAddress();
    els.status.textContent = `Connected: ${address}`;
    contract = await PrivatePay.create(zkConfig, wallet);
    log("Contract instance ready.");
  } catch (e) {
    log(`Connect failed: ${e.message}`);
  }
});

els.create.addEventListener("click", async () => {
  try {
    const payeeCount = Number(document.querySelector("#payee-count").value || 1);
    const total = BigInt(document.querySelector("#total").value || 0);
    await contract.createPayroll(payeeCount, total);
    log(`Payroll created: ${payeeCount} payees, total disclosed on claim.`);
  } catch (e) {
    log(`Create failed: ${e.message}`);
  }
});

els.fund.addEventListener("click", async () => {
  try {
    const payrollId = BigInt(document.querySelector("#payroll-id").value || 0);
    const amount = BigInt(document.querySelector("#amount").value || 0);
    await contract.fund(payrollId, amount);
    log(`Funded payroll ${payrollId} with ${amount} (amount kept private).`);
  } catch (e) {
    log(`Fund failed: ${e.message}`);
  }
});

els.claim.addEventListener("click", async () => {
  try {
    const payrollId = BigInt(document.querySelector("#payroll-id").value || 0);
    const share = BigInt(document.querySelector("#share").value || 0);
    await contract.claim(payrollId, share);
    log(`Claimed ${share} from payroll ${payrollId} (share disclosed).`);
  } catch (e) {
    log(`Claim failed: ${e.message}`);
  }
});