function getVoteBroadcastErrorMessage(error) {
  const status = error?.status?.toString();

  if (status === "INVALID_SIGNATURE") {
    return "Hedera rejected the operator signature. HEDERA_PRIVATE_KEY must match HEDERA_ACCOUNT_ID. Update backend/.env with the matching account credentials and restart the backend. Voter participation was reset.";
  }

  const statusDetails = status ? ` Hedera status: ${status}.` : "";
  return `Failed to broadcast vote to ledger.${statusDetails} Voter participation was reset.`;
}

module.exports = { getVoteBroadcastErrorMessage };
