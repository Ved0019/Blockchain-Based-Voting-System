# Blockchain-Based-Voting-System
# 🗳️ Hybrid Cloud and Distributed Ledger E-Voting System

[![AWS Serverless](https://img.shields.io/badge/AWS-Serverless-FF9900?logo=amazonaws)](https://aws.amazon.com/)
[![Hedera Hashgraph](https://img.shields.io/badge/Hedera-HCS-222222?logo=hedera)](https://hedera.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)](https://reactjs.org/)

## 📖 Project Overview
The **Hybrid Cloud and Distributed Ledger E-Voting System** is a highly scalable, tamper-proof electronic voting application. This project bridges traditional cloud computing frameworks with Web3 Distributed Ledger Technology (DLT). 

By leveraging an AWS serverless cloud architecture for user authentication, API routing, and frontend delivery, alongside the Hedera public network for data immutability, the system achieves the throughput required for large-scale public deployment while maintaining cryptographic security against centralized database manipulation.

## 🏗️ Architecture & Tech Stack

This project is partitioned into two distinct operational environments:

### 1. The Cloud Environment (Application Layer)
*   **Amazon CloudFront & S3:** Global delivery and hosting of the React web application.
*   **Amazon Cognito:** Identity provider for voter authentication and JWT issuance.
*   **Amazon API Gateway:** RESTful API routing for client requests.
*   **AWS Lambda (Node.js):** Serverless compute engine that validates tokens, prevents duplicate voting, and acts as a bridge via the `@hashgraph/sdk`.
*   **Amazon DynamoDB:** NoSQL database functioning as a voter registry to strictly enforce a "one person, one vote" protocol.

### 2. The Distributed Ledger Environment (Trust Layer)
*   **Hedera Consensus Service (HCS):** A decentralized notary that assigns mathematically verifiable, immutable timestamps to AWS Lambda's signed votes. 
*   **Hedera Mirror Nodes:** A public, read-only historical ledger queried directly by the frontend to aggregate final vote counts without relying on the AWS database.

## 🚀 Key Features
*   **Tamper-Proof Ledger:** Votes are recorded on a decentralized Hashgraph network, making unauthorized alterations mathematically impossible.
*   **High Throughput & Low Latency:** Utilizes Hedera's aBFT consensus algorithm, processing 10,000+ TPS with 3-5 second finality.
*   **Zero-Gas Backend:** By using the Hedera Consensus Service rather than smart contracts, transaction costs are fixed at fractions of a cent ($0.0001 per HCS message).
*   **Duplicate Vote Prevention:** AWS DynamoDB tracks session states to block multiple votes from the same authenticated user.

---

## 📋 Prerequisites

Before deploying this architecture, ensure you have the following installed and configured:
*   [Node.js](https://nodejs.org/en/) (v16.x or later)
*   [AWS CLI](https://aws.amazon.com/cli/) configured with an IAM user possessing Administrator access.
*   An active [AWS Account](https://aws.amazon.com/) (Free Tier is sufficient).
*   A [Hedera Developer Portal](https://portal.hedera.com/) account (to generate Testnet Account ID and Private Key).

---

## 🛠️ Setup & Installation

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR-USERNAME/hybrid-cloud-evoting-system.git](https://github.com/YOUR-USERNAME/hybrid-cloud-evoting-system.git)
cd hybrid-cloud-evoting-system
