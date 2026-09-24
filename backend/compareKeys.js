require("dotenv").config();
const { PrivateKey } = require("@hashgraph/sdk");

const privateKeyString = process.env.HEDERA_PRIVATE_KEY;
const privateKey = PrivateKey.fromString(privateKeyString);

// Get the ECDSA key pair
const keyPair = privateKey._key._keyPair;
console.log("Private key bytes (from keyPair):", keyPair.privateKey.toString('hex'));
console.log("Public key bytes (from keyPair):", keyPair.publicKey.toString('hex'));

// The public key bytes are likely uncompressed (64 bytes for X and Y)
// Let's compress it (assuming secp256k1)
// We need to compute the compressed public key: 0x02 or 0x03 + X coordinate
// But we don't have the curve parameters here. Instead, we can use the Hedera SDK's PublicKey object we already have.
const publicKey = privateKey.publicKey;
console.log("Public key (from SDK):", publicKey.toString());
console.log("Public key bytes (from SDK):", publicKey.toBytes().toString('hex'));

// Now, let's get the mirror node public key for account 0.0.9733911
const https = require('https');
https.get('https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.9733911', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const mirrorKeyHex = parsed.key.key; // hex string
      console.log("Mirror node public key (hex):", mirrorKeyHex);
      console.log("Mirror node public key type:", parsed.key._type);

      // Now, we need to convert our public key to the same format (compressed SEC1 hex)
      // The Hedera SDK's PublicKey for ECDSA_SECP256K1 should give us the raw public key in uncompressed format? 
      // Actually, the toBytes() method returns the DER encoding of the public key (SubjectPublicKeyInfo).
      // We need to extract the raw public key bits.

      // Let's use the _key property of the PublicKey object (if it's an EcdsaPublicKey)
      if (publicKey._key && publicKey._key._keyData) {
        const ourKeyData = publicKey._key._keyData; // This should be the raw key data (compressed or uncompressed?)
        console.log("Our key data (from _keyData):", ourKeyData.toString('hex'));
        console.log("Our key data length:", ourKeyData.length);
        // If it's 33 bytes, it's already compressed.
        if (ourKeyData.length === 33) {
          console.log("Our key data is compressed (33 bytes)");
          if (ourKeyData.toString('hex') === mirrorKeyHex) {
            console.log("SUCCESS: Our compressed public key matches mirror node key!");
          } else {
            console.log("ERROR: Our compressed public key does NOT match mirror node key.");
          }
        } else if (ourKeyData.length === 64) {
          console.log("Our key data is uncompressed (64 bytes), need to compress");
          // We would need to compress it, but let's skip for now.
        } else {
          console.log("Our key data is neither 33 nor 64 bytes:", ourKeyData.length);
        }
      } else {
        console.log("Could not access _keyData");
      }
    } catch (e) {
      console.log("Failed to parse mirror node response:", e);
    }
  });
}).on("error", (err) => {
  console.log("Error fetching mirror node data:", err);
});
