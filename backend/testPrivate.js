require("dotenv").config();
const { PrivateKey } = require("@hashgraph/sdk");

const privateKeyString = process.env.HEDERA_PRIVATE_KEY;
const privateKey = PrivateKey.fromString(privateKeyString);
console.log("Private key bytes:", privateKey.toBytes().toString('hex'));
console.log("Private key bytes length:", privateKey.toBytes().length);

// Also, let's get the raw key if it's an ECDSA key
if (privateKey._key) {
  console.log("Private key _key:", privateKey._key);
  if (privateKey._key._keyData) {
    console.log("Private key _keyData:", privateKey._key._keyData.toString('hex'));
  }
}
