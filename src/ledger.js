// Ledger helpers for the PrivatePay contract.
// Midnight.js SDK requires a Ledger implementation that maps contract
// circuit calls onto the on-chain transaction lifecycle.

export const Ledger = {
  initialState: () => 0n,

  reduce(current, action) {
    switch (action.type) {
      case "CreatePayroll":
        return action.total;
      case "Fund":
        return current + action.amount;
      case "Claim":
        return current - action.share;
      default:
        return current;
    }
  },
};

export function initialState() {
  return Ledger.initialState();
}