 require("dotenv").config();
  const { Client, PrivateKey } = require("@hashgraph/sdk");

  // Generate a new ED25519 key pair
  const newPrivateKey = PrivateKey.generateED25519();
  const newPublicKey = newPrivateKey.publicKey;

  // Derive the account ID from the public key (for testnet, shard=0, realm=0)
  // Note: In Hedera, account IDs are assigned by the network when you create an account via a transaction.
  // The key pair itself doesn't contain an account ID - you get that when you create the account on-chain.

  console.log("🔑 New Private Key (hex):", newPrivateKey.toString());
  console.log("🔑 New Private Key (base64):", newPrivateKey.toStringBase64());
  console.log("🔑 New Public Key (hex):", newPublicKey.toString());
  console.log("\n📝 To get an Account ID, you must:")
  console.log("1. Use the Hashgraph faucet to create an account with this public key");
  console.log("2. Or submit an account creation transaction using a funded payer account");