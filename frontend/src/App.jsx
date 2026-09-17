import { useState, useEffect } from "react";
import axios from "axios";

// Static candidate list
const CANDIDATES = [
  { id: "1", name: "Alice Johnson", party: "Decentralized Innovation Party" },
  { id: "2", name: "Bob Martinez", party: "Open Governance Alliance" },
  { id: "3", name: "Carol Davis", party: "Public Integrity Coalition" }
];

// Hedera Testnet Mirror Node URL and your Topic ID
const HCS_TOPIC_ID = "0.0.10589786"; // <-- REPLACE WITH YOUR HCS_TOPIC_ID
const MIRROR_NODE_URL = `https://testnet.mirrornode.hedera.com/api/v1/topics/${HCS_TOPIC_ID}/messages`;

export default function App() {
  const [voterId, setVoterId] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [tallies, setTallies] = useState({ "1": 0, "2": 0, "3": 0 });
  const [recentVotes, setRecentVotes] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Fetch and decode messages directly from the Hedera Mirror Node
  const fetchLedgerVotes = async () => {
    if (!HCS_TOPIC_ID || HCS_TOPIC_ID === "0.0.yyyyy") return;
    try {
      const res = await axios.get(MIRROR_NODE_URL);
      const messages = res.data.messages || [];

      const counts = { "1": 0, "2": 0, "3": 0 };
      const decodedHistory = [];

      messages.forEach((item) => {
        try {
          // Decode Base64 message
          const rawString = atob(item.message);
          const parsed = JSON.parse(rawString);

          if (parsed.candidateId && counts[parsed.candidateId] !== undefined) {
            counts[parsed.candidateId] += 1;
          }

          decodedHistory.unshift({
            sequenceNumber: item.sequence_number,
            consensusTimestamp: item.consensus_timestamp,
            candidateId: parsed.candidateId
          });
        } catch {
          // Ignore invalid message formatting
        }
      });

      setTallies(counts);
      setRecentVotes(decodedHistory.slice(0, 5));
    } catch (err) {
      console.error("Mirror node fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLedgerVotes();
    const interval = setInterval(fetchLedgerVotes, 4000); // Poll every 4 seconds
    return () => clearInterval(interval);
  }, []);

  // 2. Submit vote to local Express/Lambda backend
  const handleVote = async (e) => {
    e.preventDefault();
    if (!voterId.trim() || !selectedCandidate) {
      setStatusMsg("Please provide both a Voter ID and select a candidate.");
      return;
    }

    setLoading(true);
    setStatusMsg("Submitting vote to Hedera Consensus Service...");

    try {
      const res = await axios.post("http://localhost:5000/castVote", {
        voterId: voterId.trim(),
        candidateId: selectedCandidate
      });

      setStatusMsg(`Success! Recorded on ledger. Tx ID: ${res.data.transactionId}`);
      setSelectedCandidate("");
      fetchLedgerVotes();
    } catch (err) {
      const errorText = err.response?.data?.error || "Transaction failed.";
      setStatusMsg(`Error: ${errorText}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <header style={{ borderBottom: "1px solid #ccc", paddingBottom: "16px", marginBottom: "24px" }}>
        <h1>🗳️ Hybrid Cloud & Distributed Ledger E-Voting</h1>
        <p style={{ color: "#555" }}>
          Topic ID: <code>{HCS_TOPIC_ID}</code> | Public Ledger: Hedera Testnet
        </p>
      </header>

      {/* Live Tallies from Mirror Node */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Live Results (Direct from Hedera Mirror Node)</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {CANDIDATES.map((cand) => (
            <div key={cand.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
              <h3>{cand.name}</h3>
              <p style={{ color: "#666", fontSize: "0.85rem" }}>{cand.party}</p>
              <div style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "12px", color: "#0066cc" }}>
                {tallies[cand.id]}
              </div>
              <span style={{ fontSize: "0.8rem", color: "#888" }}>verified votes</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ballot Form */}
      <section style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginBottom: "32px" }}>
        <h2>Cast Your Ballot</h2>
        <form onSubmit={handleVote}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Voter Identifier:</label>
            <input
              type="text"
              placeholder="e.g. voter-101"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Choose a Candidate:</label>
            {CANDIDATES.map((cand) => (
              <label key={cand.id} style={{ display: "block", marginBottom: "8px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="candidate"
                  value={cand.id}
                  checked={selectedCandidate === cand.id}
                  onChange={(e) => setSelectedCandidate(e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                <strong>{cand.name}</strong> ({cand.party})
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#999" : "#0066cc",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1rem"
            }}
          >
            {loading ? "Recording on Hedera..." : "Submit Vote"}
          </button>
        </form>

        {statusMsg && (
          <div style={{ marginTop: "16px", padding: "12px", borderRadius: "4px", background: "#f5f5f5", borderLeft: "4px solid #0066cc" }}>
            {statusMsg}
          </div>
        )}
      </section>

      {/* Ledger Consensus Stream */}
      <section>
        <h3>Recent Hedera Consensus Messages</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {recentVotes.map((v, i) => (
            <li key={i} style={{ padding: "8px 0", borderBottom: "1px solid #eee", fontSize: "0.85rem" }}>
              Seq #{v.sequenceNumber} | Consensus Timestamp: {v.consensusTimestamp} | Candidate ID: {v.candidateId}
            </li>
          ))}
          {recentVotes.length === 0 && <p style={{ color: "#888" }}>No votes recorded yet.</p>}
        </ul>
      </section>
    </div>
  );
}