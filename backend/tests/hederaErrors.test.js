const assert = require("node:assert/strict");
const { test } = require("node:test");
const { getVoteBroadcastErrorMessage } = require("../lib/voteErrors");

test("invalid Hedera signatures explain how to fix the operator credentials", () => {
  const message = getVoteBroadcastErrorMessage({
    status: { toString: () => "INVALID_SIGNATURE" }
  });

  assert.match(message, /HEDERA_PRIVATE_KEY must match HEDERA_ACCOUNT_ID/);
  assert.match(message, /restart the backend/);
  assert.match(message, /Voter participation was reset/);
});

test("other Hedera precheck failures include their status", () => {
  const message = getVoteBroadcastErrorMessage({
    status: { toString: () => "INSUFFICIENT_PAYER_BALANCE" }
  });

  assert.match(message, /Hedera status: INSUFFICIENT_PAYER_BALANCE/);
  assert.match(message, /Voter participation was reset/);
});
