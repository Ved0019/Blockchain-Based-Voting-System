import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import * as jwt_decode from "jwt-decode";

// --- 1. LOGIN SCREEN ---
function Login({ onLogin }) {
  const [role, setRole] = useState("Voters");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        identifier: identifier.toUpperCase(),
        password,
        role: role.toLowerCase()
      });

      // Decode token to get user info
      const decoded = jwt_decode.default(res.data.token);
      onLogin({
        token: res.data.token,
        voterId: decoded.voterId,
        role: decoded.role,
        name: decoded.name
      });
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
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

          <div className="mb-3">
            <label htmlFor="identifier">Identifier</label>
            <input
              id="identifier"
              type="text"
              placeholder="Enter your Voter ID or Admin ID"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Continue securely"} <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>
    </main>
  );
}

// --- 2. ADMIN DASHBOARD ---
function AdminDashboard({ token, onLogout }) {
  const [tallies, setTallies] = useState({});
  const [newCandidate, setNewCandidate] = useState({ name: "", party: "" });
  const [newVoter, setNewVoter] = useState({ voterId: "", name: "" });
  const [adminMessage, setAdminMessage] = useState("");
  const [electionData, setElectionData] = useState(null);
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Fetch configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("/api/config");
        setConfig(res.data);
      } catch (err) {
        console.error("Failed to load config:", err);
        // Fallback defaults
        setConfig({
          hederaTopicId: "0.0.10589786",
          mirrorNodeUrl: `https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10589786/messages`,
          backendUrl: "http://localhost:5000"
        });
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchConfig();
  }, []);

  // Fetch election data when config is loaded
  useEffect(() => {
    if (!loadingConfig && config) {
      const fetchElectionData = async () => {
        try {
          const res = await axios.get(`${config.backendUrl}/api/election`);
          setElectionData(res.data);
        } catch (err) {
          console.error("Failed to load election data:", err);
        }
      };

      fetchElectionData();
    }
  }, [loadingConfig, config]);

  // Fetch tallies from mirror node
  useEffect(() => {
    if (!loadingConfig && config) {
      const fetchTallies = async () => {
        try {
          const res = await axios.get(config.mirrorNodeUrl);
          const counts = {};
          (res.data.messages || []).forEach(msg => {
            try {
              const parsed = JSON.parse(atob(msg.message));
              if (parsed.candidateId) {
                counts[parsed.candidateId] = (counts[parsed.candidateId] || 0) + 1;
              }
            } catch {}
          });
          setTallies(counts);
        } catch (err) { console.error("Failed to fetch tallies:", err); }
      };

      fetchTallies();
      const interval = setInterval(fetchTallies, 4000);
      return () => clearInterval(interval);
    }
  }, [loadingConfig, config]);

  const handleRegisterCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.party) {
      setAdminMessage("Name and Party are required.");
      return;
    }
    try {
      const res = await axios.post(`${config.backendUrl}/api/admin/candidates`,
        { name: newCandidate.name, party: newCandidate.party },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminMessage("Candidate registered: " + res.data.candidate.name);
      setNewCandidate({ name: "", party: "" });
      // Refetch election data
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      setAdminMessage("Failed to register candidate: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleEnrollVoter = async (e) => {
    e.preventDefault();
    if (!newVoter.voterId) {
      setAdminMessage("Voter ID is required.");
      return;
    }
    try {
      const res = await axios.post(`${config.backendUrl}/api/admin/voters`,
        { voterId: newVoter.voterId, name: newVoter.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminMessage("Voter enrolled: " + newVoter.voterId);
      setNewVoter({ voterId: "", name: "" });
      // Refetch election data
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      setAdminMessage("Failed to enroll voter: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleToggleStatus = async () => {
    try {
      const res = await axios.post(`${config.backendUrl}/api/admin/toggle-status`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminMessage("Election status updated to: " + (res.data.isActive ? "Active" : "Closed"));
      // Refetch election data
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      setAdminMessage("Failed to toggle status: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(`${config.backendUrl}/api/admin/reset`, {},
        { headers: { Authorization: `Bearer ${token}` } });
      setAdminMessage("Backend registry cleared. Voters can now vote again.");
      // Refetch election data
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      setAdminMessage("Admin action failed: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authVoterId");
    localStorage.removeItem("authRole");
    onLogout();
  };

  if (loadingConfig) return <p>Loading configuration...</p>;
  if (!electionData) return <p>Loading election data...</p>;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark small">V</div>
          <span>VOTE<span className="brand-accent">/</span>LEDGER</span>
        </div>
        <div className="topbar-actions">
          <span className="role-chip admin-chip">Administrator</span>
          <button className="text-button" onClick={handleLogout}>Log out <span aria-hidden="true">↗</span></button>
        </div>
      </header>
      <section className="dashboard-heading">
        <div>
          <p className="eyebrow">Operations / Live audit</p>
          <h1>Control center</h1>
          <p className="section-copy">Monitor the election ledger and manage the local registry.</p>
        </div>
        <div className="live-indicator"><span className="status-dot" /> Live mirror node</div>
      </section>

      {/* Admin Message */}
      {adminMessage && <div className="admin-message">{adminMessage}</div>}

      {/* Election Status */}
      <section className="admin-status">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Election Status</p>
            {electionData && electionData.election ? (
              <>
                <h2>{electionData.election.title}</h2>
                <p className="section-copy">Status: {electionData.election.isActive ? "Active" : "Closed"}</p>
              </>
            ) : (
              <p>Loading election details...</p>
            )}
          </div>
        </div>
        {electionData && electionData.election ? (
          <button className="outline-button" onClick={handleToggleStatus}>
            {electionData.election.isActive ? "Close Election" : "Open Election"}
          </button>
        ) : (
          <button className="outline-button" disabled>
            Loading...
          )
        )}
      </section>

      {/* Candidate Registration */}
      <section className="admin-action">
        <div>
          <p className="eyebrow">Register Candidate</p>
          <h2>Add a new candidate</h2>
          <p className="section-copy">Enter candidate details to add to the ballot.</p>
        </div>
        <form onSubmit={handleRegisterCandidate}>
          <div>
            <label>Candidate Name</label>
            <input
              type="text"
              value={newCandidate.name}
              onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Party/Affiliation</label>
            <input
              type="text"
              value={newCandidate.party}
              onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
              required
            />
          </div>
          <button className="primary-button" type="submit">Register Candidate <span aria-hidden="true">↗</span></button>
        </form>
      </section>

      {/* Voter Enrollment */}
      <section className="admin-action">
        <div>
          <p className="eyebrow">Enroll Voter</p>
          <h2>Add voter to electoral roll</p>
          <p className="section-copy">Enter voter ID and name to enroll a new voter.</p>
        </div>
        <form onSubmit={handleEnrollVoter}>
          <div>
            <label>Voter ID</label>
            <input
              type="text"
              value={newVoter.voterId}
              onChange={(e) => setNewVoter({ ...newVoter, voterId: e.target.value.toUpperCase() })}
              required
            />
          </div>
          <div>
            <label>Voter Name</label>
            <input
              type="text"
              value={newVoter.name}
              onChange={(e) => setNewVoter({ ...newVoter, name: e.target.value })}
            />
          </div>
          <button className="primary-button" type="submit">Enroll Voter <span aria-hidden="true">↗</span></button>
        </form>
      </section>

      {/* Audit Section */}
      <section className="audit-section">
        <div className="section-title-row">
          <div>
            <h2>Election snapshot</h2>
            <p>Read-only tallies from the Hedera mirror node.</p>
          </div>
          <span className="refresh-label">Updates every 4 seconds</span>
        </div>
        <div className="tally-grid">
          {(electionData.candidates || []).map(c => (
            <article className="tally-card" key={c.candidateId}>
              <div className="candidate-index">0{c.candidateId}</div>
              <p className="eyebrow">Candidate</p>
              <h3>{c.name}</h3>
              <p className="party-name">{c.party}</p>
              <div className="vote-count">{tallies[c.candidateId] || 0}</div>
              <p className="vote-label">verified votes</p>
            </article>
          ))}
        </div>
      </section>
      <section className="admin-action">
        <div>
          <p className="eyebrow">Local demo utility</p>
          <h2>Reset voter registry</h2>
          <p>Clear the local participation registry so another test round can begin.</p>
        </div>
        <button className="outline-button" onClick={handleReset}>Reset registry <span aria-hidden="true">↗</span></button>
      </section>
      <footer className="app-footer">
        <span>VoteLedger / Admin workspace</span>
        <span>Secured by Hedera Consensus Service</span>
      </footer>
    </main>
  );
}

// --- 3. VOTER BALLOT ---
function VoterDashboard({ token, onLogout }) {
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const [votedTxId, setVotedTxId] = useState("");
  const [electionData, setElectionData] = useState(null);
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Fetch configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("/api/config");
        setConfig(res.data);
      } catch (err) {
        console.error("Failed to load config:", err);
        // Fallback defaults
        setConfig({
          hederaTopicId: "0.0.10589786",
          mirrorNodeUrl: `https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10589786/messages`,
          backendUrl: "http://localhost:5000"
        });
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchConfig();
  }, []);

  // Fetch election data when config is loaded
  useEffect(() => {
    if (!loadingConfig && config) {
      const fetchElectionData = async () => {
        try {
          const res = await axios.get(`${config.backendUrl}/api/election`);
          setElectionData(res.data);
        } catch (err) {
          console.error("Failed to load election data:", err);
        }
      };

      fetchElectionData();
    }
  }, [loadingConfig, config]);

  // Determine if election is active
  const isActive = electionData?.election?.isActive ?? false;

  const handleVote = async (e) => {
    e.preventDefault();
    if (!selected) return setStatus("Please select a candidate.");
    if (!isActive) return setStatus("Voting is currently closed.");
    setStatus("Submitting cryptographic vote...");

    try {
      const res = await axios.post(`${config.backendUrl}/castVote`,
        { candidateId: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(`✅ Success! Tx ID: ${res.data.transactionId}`);
      setVotedTxId(res.data.transactionId);
    } catch (err) {
      setStatus(`❌ Error: ${err.response?.data?.error || "Failed to vote"}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authVoterId");
    localStorage.removeItem("authRole");
    onLogout();
  };

  if (loadingConfig) return <p>Loading configuration...</p>;
  if (!electionData) return <p>Loading election data...</p>;

  return (
    <main className={`app-shell voter-shell ${votedTxId ? "voted" : ""}`}>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark small">V</div>
          <span>VOTE<span className="brand-accent">/</span>LEDGER</span>
        </div>
        <div className="topbar-actions">
          <span className="role-chip">Verified voter</span>
          <button className="text-button" onClick={handleLogout}>Exit booth <span aria-hidden="true">↗</span></button>
        </div>
      </header>
      {!isActive && (
        <div className="election-closed-banner">
          <p>⚠️ Voting is currently closed. Please check back later.</p>
        </div>
      )}
      <section className="ballot-layout">
        <div className="ballot-intro">
          <p className="eyebrow">2026 Community Election</p>
          <h1>Your voice<br /><em>matters here.</em></h1>
          <p className="section-copy">Select one candidate to submit your encrypted vote to the public ledger.</p>
          <div className="ballot-meta"><span>01</span><span>of 01</span><div className="progress-line"><i /></div></div>
        </div>
        <section className="ballot-card">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Official ballot</p>
              <h2>Choose your candidate</h2>
            </div>
            <span className="lock-mark">⌁</span>
          </div>
          {!isActive || votedTxId ? (
            <p className="voting-disabled">Voting is currently disabled.</p>
          ) : (
            <form onSubmit={handleVote}>
              <div className="candidate-list">
                {electionData.candidates.map((c, index) => (
                  <label className={`candidate-option ${selected === c.candidateId ? "selected" : ""}`} key={c.candidateId}>
                    <input
                      type="radio"
                      name="candidate"
                      value={c.candidateId}
                      checked={selected === c.candidateId}
                      onChange={(e) => setSelected(e.target.value)}
                      disabled={!isActive || votedTxId}
                    />
                    <span className="radio-mark" />
                    <span className="candidate-details">
                      <span className="candidate-number">0{index + 1}</span>
                      <strong>{c.name}</strong>
                      <small>{c.party}</small>
                    </span>
                    <span className="option-arrow">→</span>
                  </label>
                ))}
              </div>
              <button
                className="primary-button"
                type="submit"
                disabled={!isActive || !selected || votedTxId}
              >
                Submit encrypted vote <span aria-hidden="true">↗</span>
              </button>
            </form>
          )}
          {status && <div className={`status-message ${status.startsWith("✅") ? "success" : "error"}`}>{status}</div>}
          {votedTxId && (
            <div className="vote-confirmation">
              <p>Your vote has been successfully recorded on the ledger.</p>
              <p>Transaction ID: <code>{votedTxId}</code></p>
            </div>
          )}
          <p className="privacy-note">Your selection is recorded once and cannot be changed.</p>
        </section>
      </section>
      <footer className="app-footer">
        <span>VoteLedger / Private voting booth</span>
        <span>End-to-end verifiable</span>
      </footer>
    </main>
  );
}

// --- MAIN APP ROUTER ---
export default function App() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => setAuth(null);

  // Check for existing auth in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const voterId = localStorage.getItem("authVoterId");
    const role = localStorage.getItem("authRole");
    if (token && voterId && role) {
      setAuth({ token, voterId, role });
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  if (!auth) return <Login onLogin={(authData) => {
    localStorage.setItem("authToken", authData.token);
    localStorage.setItem("authVoterId", authData.voterId);
    localStorage.setItem("authRole", authData.role);
    setAuth(authData);
  }} />;

  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={auth.role === "admin" ? <AdminDashboard token={auth.token} onLogout={handleLogout} /> : <Navigate to="/vote" />}
        />
        <Route
          path="/vote"
          element={auth.role === "voter" ? <VoterDashboard token={auth.token} onLogout={handleLogout} /> : <Navigate to="/admin" />}
        />
        <Route
          path="*"
          element={<Navigate to={auth.role === "admin" ? "/admin" : "/vote"} />}
        />
      </Routes>
    </Router>
  );
}