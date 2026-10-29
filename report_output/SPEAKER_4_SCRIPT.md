# 🎤 Speaker 4 Presentation Script (7-Minute Code & Live Database Walkthrough)
**Role:** Student-4 (Roll: 22BCE8947 / 24MIC7348)  
**Time Allotted:** Exactly 7:00 Minutes (~950 Words at 135 words/min)  
**Topic:** Code Overview, Core Files Deep Dive, Frontend UI Architecture & Live MongoDB Walkthrough

---

## ⏱️ Speaker Time Breakdown (7 Minutes Total)

| Minute | Stage / Action | Primary Focus |
| :--- | :--- | :--- |
| **00:00 – 01:00** | Slide / VS Code | **Transition & High-Level Codebase Architecture** (Monorepo structure) |
| **01:00 – 03:00** | VS Code (`server.js`) | **Core Backend Logic & File Walkthrough** (`/castVote`, WiredTiger locking, Hedera SDK) |
| **03:00 – 04:15** | Browser (React UI) | **Frontend Interface Features Added** (Manifesto, Voter Booth, Admin Console) |
| **04:15 – 06:00** | MongoDB Compass | **Live MongoDB Database Walkthrough** (`voters`, `elections`, atomic flag check) |
| **06:00 – 07:00** | Slide / Panel | **Synthesis, Non-Repudiation Summary & Hand-off to Evaluator Q&A** |

---

## 🎙️ Spoken Script (Word-for-Word)

### [00:00 – 01:00] Transition & Codebase Architecture Overview
*(Action Cue: Smile, nod to Speaker 3, adjust microphone, and address the evaluators directly.)*

> "Thank you, Speaker 3. Respected evaluators, I will now walk you through the concrete implementation of our system: our codebase architecture, the key files powering our backend and frontend, the user interface we engineered, and a live inspection of our MongoDB database.
>
> *(Action Cue: Open VS Code showing the root project explorer.)*
>
> Our codebase is organized as a clean decoupled monorepo divided into two main environments: `backend/` and `frontend/`. 
> 
> The core design philosophy here is **separation of concerns**: our Node.js backend handles local voter eligibility, JWT token verification, and atomic state mutation, while the Hedera SDK communicates over gRPC with the distributed ledger for immutable consensus ordering. The React frontend provides an intuitive, accessible interface so voters can review candidate policies before casting their ballots."

---

### [01:00 – 03:00] Core Backend Files & Critical Code Logic
*(Action Cue: In VS Code, navigate to `backend/server.js` and scroll to lines 290–355.)*

> "Let us look at the backend heart of our application in `backend/server.js`.
>
> First, on lines 62 to 76, we initialize our **Hedera Client**. We set the operator account credentials using `@hashgraph/sdk`, establishing a secure gRPC channel to the Hedera Testnet.
>
> Next, on lines 80 to 100, we enforce **Stateless JWT Middleware**. When a user logs in via `controllers/auth.js`, passwords are verified using `bcrypt`, and a signed token containing their role and voter ID is returned. Requests hitting protected endpoints pass through `authenticateToken` and `requireRole`, strictly isolating voters from administrative actions.
>
> Now, look at lines 290 to 355: this is our critical ballot-casting endpoint: `app.post('/castVote')`.
>
> *(Action Cue: Highlight the `Voter.findOneAndUpdate` call on lines 307–311.)*
>
> Here you see our **atomic ballot claim**. Notice the filter query:
> `{ voterId: voterId, hasVoted: false }`.
> We use MongoDB's `findOneAndUpdate` with `{ returnDocument: 'after' }`. Under MongoDB's WiredTiger engine, an exclusive document-level write lock is placed on this specific student record. If two requests arrive in the same millisecond, MongoDB serializes them. The first request mutates `hasVoted` to `true`. The second request finds zero matching documents, evaluates to `null`, and is immediately stopped with an HTTP 403 Forbidden. This guarantees that double-voting is mathematically impossible at the database layer.
>
> Next, look at lines 324 to 336. Once the local claim succeeds, we prepare the payload:
> `JSON.stringify({ candidateId, timestamp })`.
> Notice what is **absent**: there are zero student roll numbers, zero names, and zero IP addresses. We instantiate a `TopicMessageSubmitTransaction` targeting Topic `0.0.10697996`, sign it, and broadcast it to Hedera.
>
> Finally, look at our fail-safe catch block on lines 337 to 345: if a network drop or timeout occurs while communicating with Hedera, we execute an automatic rollback:
> `hasVoted: false, votedAt: null`.
> This ensures that no student is ever disenfranchised due to a temporary network blip."

---

### [03:00 – 04:15] Frontend Interface Architecture & Features Added
*(Action Cue: Switch window to the browser running at `http://localhost:5173`.)*

> "Now, let us examine the user interface in our `frontend/` directory, built with React 18 and Vite.
>
> In `frontend/src/App.jsx`, we implement client-side role dispatch. Voters and Admins see completely different interfaces based on their decoded JWT permissions.
>
> We added three major interfaces to the application:
>
> 1. **The Manifesto Dashboard (`ManifestoDashboard.jsx`):**
> *(Action Cue: Click through candidate profiles on the Manifesto screen.)*  
> Instead of a dry, confusing ballot screen, voters first land on an interactive civic portal. Here, students can inspect candidate profiles, read official manifesto commitments, and review linked evidence documents before entering the polling booth.
>
> 2. **The Secure Voter Booth (`VoterBooth.jsx`):**
> *(Action Cue: Click 'Proceed to Vote' and show candidate cards.)*  
> Inside the booth, candidates are displayed as responsive interactive cards. When the voter selects a candidate and clicks 'Submit Vote', the button enters an animated loading state (`submitLoading: true`), and an interactive tactile audio confirmation plays. Once confirmed, the UI presents an immutable confirmation modal containing the **Hedera Transaction ID**, which the student can copy with one click to verify on HashScan.
>
> 3. **The Administrator Console (`AdminConsole.jsx`):**
> *(Action Cue: Briefly show the Admin tab or explain its features.)*  
> For administrators, we built tools to register candidates, enroll student voter IDs with hashed credentials, toggle the election status active or inactive, and monitor live audit tallies."

---

### [04:15 – 06:00] Live MongoDB Database Walkthrough
*(Action Cue: Switch window to MongoDB Compass or terminal showing the database collections.)*

> "Now, I will open our live MongoDB database so you can observe the exact data structures and verify our concurrency safeguards.
>
> *(Action Cue: In MongoDB Compass, open the `voting_system` database and click the `voters` collection.)*
>
> Here in the `voters` collection, each document represents an eligible student.
> Look at this record for voter ID `22BCE8319`:
>
> - Notice the `password` field: it contains a 60-character bcrypt hash (`$2b$10$...`). Plaintext passwords are never stored anywhere in the system.
> - Notice the `role` field: set to `'voter'`.
> - Crucially, look at `hasVoted`: currently set to `false`, and `votedAt` is `null`.
>
> *(Action Cue: Point to the field on screen.)*
>
> When this student casts their vote in the frontend, the atomic `findOneAndUpdate` executes in real time. 
> 
> Watch what happens: `hasVoted` instantly mutates to `true`, and `votedAt` receives an exact ISO timestamp. If the student attempts to click submit again, or if an attacker replays the POST request, the database rejects the write instantly.
>
> Most importantly, look closely at this voter document: **notice what is NOT here**.
> There is **zero candidate selection data** stored in this record. The database knows *that* student `22BCE8319` voted, but it has no technical record of *who* they voted for. The vote itself lives strictly as an anonymous payload on Hedera Topic `0.0.10697996`.
>
> *(Action Cue: Click into the `elections` collection.)*
>
> Finally, in the `elections` collection, we maintain the election lifecycle state. The boolean `isActive` controls whether the voting gateway accepts ballots, and `topicId` binds our system directly to the Hedera ledger."

---

### [06:00 – 07:00] Technical Summary & Hand-Off to Evaluators
*(Action Cue: Switch back to the presentation slide or look up at the evaluator panel.)*

> "To summarize our implementation:
>
> 1. **Robust Concurrency:** We solved the double-voting problem at the database layer using WiredTiger's document-level locking.
> 2. **Privacy by Decoupling:** We achieved complete voter privacy by decoupling identity in MongoDB from anonymous vote payloads on Hedera.
> 3. **Fault-Tolerant Rollback:** We ensured zero voter disenfranchisement through our automated two-phase rollback handler.
> 4. **Civic Transparency:** We engineered an intuitive React interface featuring candidate manifestos and verifiable cryptographic receipts.
>
> This completes our technical presentation. My team members and I are now ready to answer any questions from the honorable evaluation panel. Thank you."

---

## 📋 Quick Stage Direction Checklist for Speaker 4
- [ ] **Tab 1 Ready:** VS Code open at `backend/server.js` (line 290 centered).
- [ ] **Tab 2 Ready:** React Frontend at `http://localhost:5173` (Manifesto & Voter Booth loaded).
- [ ] **Tab 3 Ready:** MongoDB Compass open to `voting_system.voters` collection.
- [ ] **Speaking Pace:** Calm, authoritative, and steady (~135 words per minute). Do not rush through the code lines.
