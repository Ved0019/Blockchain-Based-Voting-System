require("dotenv").config();
const { Client, PrivateKey } = require("@hashgraph/sdk");

const accountId = process.env.HEDERA_ACCOUNT_ID;
const privateKeyString = process.env.HEDERA_PRIVATE_KEY;

console.log("Account ID:", accountId);
console.log("Private key string (first 20 chars):", privateKeyString.substring(0,20));

let privateKey;
try {
  // Try as is
  privateKey = PrivateKey.fromString(privateKeyString);
  console.log("PrivateKey loaded successfully (as is)");
} catch (e) {
  console.log("Failed to load private key as is:", e.message);
  // Try with 0x prefix
  try {
    privateKey = PrivateKey.fromString("0x" + privateKeyString);
    console.log("PrivateKey loaded successfully with 0x prefix");
  } catch (e2) {
    console.log("Failed with 0x prefix:", e2.message);
    // Try as base64
    try {
      privateKey = PrivateKey.fromString(privateKeyString, "base64");
      console.log("PrivateKey loaded successfully as base64");
    } catch (e3) {
      console.log("Failed as base64:", e3.message);
    }
  }
}

if (privateKey) {
  const publicKey = privateKey.publicKey;
  console.log("Public key:", publicKey.toString());

  // Get client for testnet
  const client = Client.forTestnet();
  // We don't have the operator set, but we can still query account info? Actually, to get account info we need to be operator or use a client without operator? We can use client.setOperator with any account? Actually, account info is public, we can query without operator? The AccountInfo query does not require signature? Let's check.

  // According to Hedera SDK, AccountInfoQuery does not require payment, so we can use any client (even without operator) to query account info.
  const { AccountInfoQuery } = require("@hashgraph/sdk");

  new AccountInfoQuery()
    .setAccountId(accountId)
    .execute(client)
    .then((info) => {
      console.log("Account info:", info.toString());
      console.log("Account public key:", info.key.toString());
      // Compare public keys
      if (info.key.toString() === publicKey.toString()) {
        console.log("Public key matches account public key!");
      } else {
        console.log("Public key does NOT match account public key.");
      }
    })
    .catch((err) => {
      console.log("Error fetching account info:", err);
    });
}
