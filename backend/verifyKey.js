require("dotenv").config();
const { Client, PrivateKey, PublicKey } = require("@hashgraph/sdk");

const accountId = process.env.HEDERA_ACCOUNT_ID;
const privateKeyString = process.env.HEDERA_PRIVATE_KEY;

console.log("Account ID:", accountId);
console.log("Private key string:", privateKeyString);

let privateKey;
try {
  privateKey = PrivateKey.fromString(privateKeyString);
  console.log("PrivateKey loaded successfully");
} catch (e) {
  console.log("Failed to load private key:", e.message);
  process.exit(1);
}

const publicKey = privateKey.publicKey;
console.log("Public key (from SDK):", publicKey.toString());
console.log("Public key (hex):", publicKey.toBytes().toString('hex'));
console.log("Public key (base64):", publicKey.toBytes().toString('base64'));

// Now, let's get the account info from mirror node via REST API to see the public key there
const https = require('https');
https.get('https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.9733911', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const mirrorKey = parsed.key.key; // hex string
      console.log("Mirror node public key (hex):", mirrorKey);
      console.log("Mirror node public key type:", parsed.key._type);

      // Convert our public key to the same format (compressed SEC1 hex)
      // The Hedera SDK's PublicKey for ECDSA_SECP256K1 should have a method to get the compressed format?
      // We can use the _key property? Let's see.
      console.log("Public key _key:", publicKey._key); // This might be the raw key bytes?
      // Actually, we can use publicKey.toBytesRaw()? Not sure.

      // Let's compute the public key from private key using elliptic for comparison?
      // But we can also try to see if the mirror key matches the public key bytes we have.
      const ourKeyBytes = publicKey.toBytes();
      console.log("Our public key bytes length:", ourKeyBytes.length);
      console.log("Our public key bytes:", ourKeyBytes.toString('hex'));

      // The mirror key is 66 hex characters? Let's check.
      console.log("Mirror key length:", mirrorKey.length);
      // If it's 66, that's 33 bytes (compressed public key is 33 bytes: 0x02/0x03 + 32 bytes X/Y).
      // Our key bytes length? Let's see.
    } catch (e) {
      console.log("Failed to parse mirror node response:", e);
    }
  });
}).on("error", (err) => {
  console.log("Error fetching mirror node data:", err);
});
