require("dotenv").config();
const { Client, PrivateKey, TopicCreateTransaction } = require("@hashgraph/sdk");

async function main() {
    const myAccountId = process.env.HEDERA_ACCOUNT_ID;
    const myPrivateKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);

    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    console.log("Creating new HCS Topic...");

    const transaction = new TopicCreateTransaction().setTopicMemo("Hybrid Cloud E-Voting System");
    const txResponse = await transaction.execute(client);
    
    const receipt = await txResponse.getReceipt(client);
    const topicId = receipt.topicId;

    console.log(`\n✅ Success! Your New Topic ID is: ${topicId.toString()}`);
    console.log("Copy this ID and add it to your .env file as HCS_TOPIC_ID\n");
    
    process.exit();
}

main().catch((err) => {
    console.error(err);
});