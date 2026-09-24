require("dotenv").config();
const { Client, PrivateKey, AccountInfoQuery } = require("@hashgraph/sdk");

const accountId = process.env.HEDERA_ACCOUNT_ID;
const privateKeyString = process.env.HEDERA_PRIVATE_KEY;

console.log("Account ID:", accountId);
console.log("Private key string length:", privateKeyString.length);

let privateKey;
try {
  privateKey = PrivateKey.fromString(privateKeyString);
  console.log("PrivateKey loaded successfully");
} catch (e) {
  console.log("Failed to load private key:", e.message);
  process.exit(1);
}

const publicKey = privateKey.publicKey;
console.log("Public key:", publicKey.toString());

// Set up client with operator
const client = Client.forTestnet();
client.setOperator(accountId, privateKey);

// Query account info
new AccountInfoQuery()
  .setAccountId(accountId)
  .execute(client)
  .then((info) => {
    console.log("Account info retrieved:");
    console.log("  Account ID: ", info.accountId.toString());
    console.log("  Public key: ", info.key.toString());
    console.log("  Balance: ", info.balance.toString());

    // Compare public keys
    if (info.key.toString() === publicKey.toString()) {
      console.log("SUCCESS: Public key matches account public key!");
    } else {
      console.log("ERROR: Public key does NOT match account public key.");
      console.log("Expected:", publicKey.toString());
      console.log("Got:", info.key.toString());
    }
  })
  .catch((err) => {
    console.log("Error fetching account info:", err);
  });
