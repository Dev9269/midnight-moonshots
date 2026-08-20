import { createContract } from "@midnight-ntwrk/midnight-js-contracts";
import { createDeferred } from "@midnight-ntwrk/midnight-js-utils";
import { Wallet } from "@midnight-ntwrk/midnight-js-types";
import { LevelStateStore } from "@midnight-ntwrk/midnight-js-leveldb";
import { privatePayContract } from "../contracts/private_pay.compact.js";
import { Ledger } from "./ledger.js";

export const PrivatePay = {
  async create(zkConfig, wallet) {
    const stateStore = new LevelStateStore("./privatepay-state");
    const contract = await createContract(
      privatePayContract,
      wallet,
      zkConfig,
      stateStore,
      Ledger
    );
    return contract;
  },

  createPayroll: async (contract, payeeCount, total) =>
    contract.createPayroll(payeeCount, total).then(c => c),

  fund: async (contract, payrollId, amount) =>
    contract.fund(payrollId, amount).then(c => c),

  claim: async (contract, payrollId, share) =>
    contract.claim(payrollId, share).then(c => c),
};