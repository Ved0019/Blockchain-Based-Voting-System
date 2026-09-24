const { Client, AccountId, PrivateKey, TransferTransaction, Hbar } = require("@hashgraph/sdk");
require("dotenv").config(); 

async function checkConfiguration() {
    try {
        const accountIdStr = process.env.HEDERA_ACCOUNT_ID || "0.0.9733911"; 
        const privateKeyStr = process.env.HEDERA_PRIVATE_KEY; 
        
        if (!accountIdStr || !privateKeyStr) {
            throw new Error("Missing HEDERA_ACCOUNT_ID or HEDERA_PRIVATE_KEY in environment.");
        }

        console.log("Initializing Hedera Testnet Client...");
        const client = Client.forTestnet();
        client.setOperator(AccountId.fromString(accountIdStr), PrivateKey.fromString(privateKeyStr));

        // FIX: Directly hitting the public Hedera Mirror Node API via fetch
        console.log(`Checking balance via Mirror Node REST API for account: ${accountIdStr}...`);
        const url = `https://hedera.com{accountIdStr}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Mirror Node API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.balances || data.balances.length === 0) {
            console.log("⚠️ Account not found on Testnet yet (Balance is effectively 0 HBAR).");
        } else {
            const rawBalance = data.balances[0].balance; // Added array index fix [0]
            // Convert tinybars to HBAR (1 HBAR = 100,000,000 tinybars)
            const hbarBalance = rawBalance / 100000000;
            console.log(`✅ Connection Success! Current Balance: ${hbarBalance} HBAR`);
        }
        // 3. Test a write transaction
        console.log("Attempting a small test transaction...");
        const transaction = await new TransferTransaction()
            .addHbarTransfer(accountIdStr, new Hbar(-0.1)) // Sent from you
            .addHbarTransfer(accountIdStr, new Hbar(0.1))  // Received by you
            .execute(client);

        const receipt = await transaction.getReceipt(client);
        console.log(`✅ Transaction Success! Status: ${receipt.status.toString()}`);
        console.log(`Transaction ID: ${transaction.transactionId.toString()}`);

    } catch (error) {
        console.error("❌ Configuration Check Failed!");
        console.error(error);
    }
}

checkConfiguration();
