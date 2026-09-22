import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
    <main className="auth-layout">
      <section className="auth-intro">
        <div className="brand-mark">V</div>
        <p className="eyebrow">HEDERA GOVERNANCE NETWORK</p>
        <h1>Every voice,<br /><em>verifiably</em> counted.</h1>
        <p className="intro-copy">A transparent digital ballot built for secure participation and public trust.</p>
        <div className="trust-row"><span className="status-dot" /> Network operational <span className="trust-divider" /> Testnet</div>
      </section>
      <section className="auth-panel">
        <div className="panel-heading"><p className="eyebrow">Secure access</p><h2>Welcome to the ballot</h2><p>Authenticate to continue to your voting workspace.</p></div>
        <form onSubmit={handleAuth}>
          <label htmlFor="role">Account type</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Voters">Login as Voter</option>
          <option value="Admins">Login as Administrator</option>
        </select>

        {role === "Voters" && (
          <>
            <label htmlFor="voter-id">Voter ID</label>
            <input
            id="voter-id"
            type="text" 
            placeholder="e.g. VIT-123" 
            value={voterId} 
            onChange={(e) => setVoterId(e.target.value)}
            />
          </>
        )}
        <button className="primary-button" type="submit">Continue securely <span aria-hidden="true">↗</span></button>
      </form>
      </section>
    </main>
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
    } catch { alert("Admin action failed."); }
  };

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand-lockup"><div className="brand-mark small">V</div><span>VOTE<span className="brand-accent">/</span>LEDGER</span></div><div className="topbar-actions"><span className="role-chip admin-chip">Administrator</span><button className="text-button" onClick={onLogout}>Log out <span aria-hidden="true">↗</span></button></div></header>
      <section className="dashboard-heading"><div><p className="eyebrow">Operations / Live audit</p><h1>Control center</h1><p className="section-copy">Monitor the election ledger and manage the local registry.</p></div><div className="live-indicator"><span className="status-dot" /> Live mirror node</div></section>
      <section className="audit-section"><div className="section-title-row"><div><h2>Election snapshot</h2><p>Read-only tallies from the Hedera mirror node.</p></div><span className="refresh-label">Updates every 4 seconds</span></div><div className="tally-grid">
        {CANDIDATES.map(c => (
          <article className="tally-card" key={c.id}><div className="candidate-index">0{c.id}</div><p className="eyebrow">Candidate</p><h3>{c.name}</h3><p className="party-name">{c.party}</p><div className="vote-count">{tallies[c.id] || 0}</div><p className="vote-label">verified votes</p></article>
        ))}
      </div></section><section className="admin-action"><div><p className="eyebrow">Local demo utility</p><h2>Reset voter registry</h2><p>Clear the local participation registry so another test round can begin.</p></div><button className="outline-button" onClick={handleReset}>Reset registry <span aria-hidden="true">↗</span></button></section><footer className="app-footer"><span>VoteLedger / Admin workspace</span><span>Secured by Hedera Consensus Service</span></footer>
    </main>
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
    <main className="app-shell voter-shell"><header className="topbar"><div className="brand-lockup"><div className="brand-mark small">V</div><span>VOTE<span className="brand-accent">/</span>LEDGER</span></div><div className="topbar-actions"><span className="role-chip">Verified voter</span><button className="text-button" onClick={onLogout}>Exit booth <span aria-hidden="true">↗</span></button></div></header><section className="ballot-layout"><div className="ballot-intro"><p className="eyebrow">2026 Community Election</p><h1>Your voice<br /><em>matters here.</em></h1><p className="section-copy">Select one candidate to submit your encrypted vote to the public ledger.</p><div className="ballot-meta"><span>01</span><span>of 01</span><div className="progress-line"><i /></div></div></div><section className="ballot-card"><div className="section-title-row"><div><p className="eyebrow">Official ballot</p><h2>Choose your candidate</h2></div><span className="lock-mark">⌁</span></div><form onSubmit={handleVote}><div className="candidate-list">{CANDIDATES.map((c, index) => (<label className={`candidate-option ${selected === c.id ? "selected" : ""}`} key={c.id}><input type="radio" name="candidate" value={c.id} onChange={(e) => setSelected(e.target.value)} /><span className="radio-mark" /><span className="candidate-details"><span className="candidate-number">0{index + 1}</span><strong>{c.name}</strong><small>{c.party}</small></span><span className="option-arrow">→</span></label>))}</div><button className="primary-button" type="submit">Submit encrypted vote <span aria-hidden="true">↗</span></button></form>{status && <div className={`status-message ${status.startsWith("✅") ? "success" : "error"}`}>{status}</div>}<p className="privacy-note">Your selection is recorded once and cannot be changed.</p></section></section><footer className="app-footer"><span>VoteLedger / Private voting booth</span><span>End-to-end verifiable</span></footer></main>
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