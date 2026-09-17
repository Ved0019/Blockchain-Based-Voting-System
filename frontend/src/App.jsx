import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const HCS_TOPIC_ID = "0.0.10589786"; // <-- REPLACE WITH YOUR TOPIC ID
const MIRROR_NODE_URL = `https://testnet.mirrornode.hedera.com/api/v1/topics/${HCS_TOPIC_ID}/messages`;

const CANDIDATES = [
  { id: "1", name: "Alice Johnson", party: "Innovation Party" },
  { id: "2", name: "Bob Martinez", party: "Governance Alliance" },
];

// --- 1. LOGIN SCREEN ---
function Login({ onLogin }) {
  const [role, setRole] = useState("Voters");
  const [voterId, setVoterId] = useState("");

  const handleAuth = (e) => {
    e.preventDefault();
    if (role === "Admins") {
      onLogin({ token: "mock-admin-token", group: "Admins" });
    } else {
      if (!voterId) return alert("Please enter a Voter ID");
      onLogin({ token: `mock-voter-token-${voterId}`, group: "Voters" });
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>System Login</h2>
      <form onSubmit={handleAuth}>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "16px" }}>
          <option value="Voters">Login as Voter</option>
          <option value="Admins">Login as Administrator</option>
        </select>
        
        {role === "Voters" && (
          <input 
            type="text" 
            placeholder="Enter your Voter ID (e.g. VIT-123)" 
            value={voterId} 
            onChange={(e) => setVoterId(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "16px", boxSizing: "border-box" }}
          />
        )}
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#0066cc", color: "#fff", border: "none" }}>Authenticate</button>
      </form>
    </div>
  );
}

// --- 2. ADMIN DASHBOARD ---
function AdminDashboard({ token, onLogout }) {
  const [tallies, setTallies] = useState({ "1": 0, "2": 0 });

  useEffect(() => {
    const fetchTallies = async () => {
      try {
        const res = await axios.get(MIRROR_NODE_URL);
        const counts = { "1": 0, "2": 0 };
        (res.data.messages || []).forEach(msg => {
          try {
            const parsed = JSON.parse(atob(msg.message));
            if (parsed.candidateId) counts[parsed.candidateId] = (counts[parsed.candidateId] || 0) + 1;
          } catch {}
        });
        setTallies(counts);
      } catch (err) { console.error(err); }
    };
    fetchTallies();
    const interval = setInterval(fetchTallies, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:5000/api/admin/reset", {}, { headers: { Authorization: `Bearer ${token}` } });
      alert("Backend registry cleared. Voters can now vote again.");
    } catch (err) { alert("Admin action failed."); }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #ccc", paddingBottom: "10px" }}>
        <h2>⚙️ Admin Control Center</h2>
        <button onClick={onLogout} style={{ background: "#cc0000", color: "#fff", padding: "5px 15px", border: "none" }}>Logout</button>
      </div>
      
      <h3>Live Election Audit (Read-Only via Mirror Node)</h3>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {CANDIDATES.map(c => (
          <div key={c.id} style={{ border: "1px solid #aaa", padding: "20px", width: "200px", textAlign: "center" }}>
            <h4>{c.name}</h4>
            <h1 style={{ color: "#0066cc" }}>{tallies[c.id] || 0}</h1>
          </div>
        ))}
      </div>
      
      <button onClick={handleReset} style={{ background: "#555", color: "#fff", padding: "10px 20px" }}>Reset Election Registry (Local Demo)</button>
    </div>
  );
}

// --- 3. VOTER BALLOT ---
function VoterDashboard({ token, onLogout }) {
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");

  const handleVote = async (e) => {
    e.preventDefault();
    if (!selected) return setStatus("Please select a candidate.");
    setStatus("Submitting cryptographic vote...");

    try {
      const res = await axios.post("http://localhost:5000/castVote", 
        { candidateId: selected }, 
        { headers: { Authorization: `Bearer ${token}` } } // Pass mock JWT
      );
      setStatus(`✅ Success! Tx ID: ${res.data.transactionId}`);
    } catch (err) {
      setStatus(`❌ Error: ${err.response?.data?.error || "Failed to vote"}`);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", border: "1px solid #eee", borderRadius: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>Official Ballot</h2>
        <button onClick={onLogout}>Exit Booth</button>
      </div>

      <form onSubmit={handleVote}>
        {CANDIDATES.map(c => (
          <label key={c.id} style={{ display: "block", background: "#f9f9f9", padding: "15px", marginBottom: "10px", cursor: "pointer" }}>
            <input type="radio" name="candidate" value={c.id} onChange={(e) => setSelected(e.target.value)} style={{ marginRight: "10px" }}/>
            <strong>{c.name}</strong> - {c.party}
          </label>
        ))}
        <button type="submit" style={{ width: "100%", padding: "15px", background: "#0066cc", color: "#fff", border: "none", fontSize: "16px", marginTop: "10px" }}>
          Cast Vote
        </button>
      </form>

      {status && <div style={{ marginTop: "20px", padding: "15px", background: "#eef" }}>{status}</div>}
    </div>
  );
}

// --- MAIN APP ROUTER ---
export default function App() {
  const [auth, setAuth] = useState(null);

  const handleLogout = () => setAuth(null);

  if (!auth) return <Login onLogin={setAuth} />;

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={auth.group === "Admins" ? <AdminDashboard token={auth.token} onLogout={handleLogout} /> : <Navigate to="/vote" />} />
        <Route path="/vote" element={auth.group === "Voters" ? <VoterDashboard token={auth.token} onLogout={handleLogout} /> : <Navigate to="/admin" />} />
        <Route path="*" element={<Navigate to={auth.group === "Admins" ? "/admin" : "/vote"} />} />
      </Routes>
    </Router>
  );
}