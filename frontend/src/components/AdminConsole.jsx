import { useState, useEffect } from "react";
import axios from "axios";

export function AdminConsole({ token, onLogout }) {
  const [tallies, setTallies] = useState({});
  const [newCandidate, setNewCandidate] = useState({ name: "", party: "", avatarIpfs: "" });
  const [newVoter, setNewVoter] = useState({ voterId: "", name: "", password: "" });
  const [adminMessage, setAdminMessage] = useState("");
  const [electionData, setElectionData] = useState(null);
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState({ totalVoters: 0, votedVoters: 0, turnoutPercentage: 0 });
  const totalVotesCast = Object.values(tallies).reduce((a, b) => a + b, 0);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Fetch configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("/api/config");
        setConfig({
          ...res.data,
          hederaTopicId: res.data.hederaTopicId || "0.0.10589786",
          mirrorNodeUrl: res.data.mirrorNodeUrl || `https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10589786/messages`,
          backendUrl: res.data.backendUrl || "http://localhost:5000"
        });
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

  // Fetch voter statistics
  useEffect(() => {
    if (!loadingConfig && config) {
      const fetchStats = async () => {
        try {
          const res = await axios.get(`${config.backendUrl}/api/admin/stats`);
          setStats(res.data);
        } catch (err) {
          console.error("Failed to fetch voter stats:", err);
        }
      };

      fetchStats();
      const interval = setInterval(fetchStats, 4000);
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
        { name: newCandidate.name, party: newCandidate.party, avatarIpfs: newCandidate.avatarIpfs },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminMessage("Candidate registered: " + res.data.candidate.name);
      setNewCandidate({ name: "", party: "", avatarIpfs: "" });
      // Refetch election data
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      setAdminMessage("Failed to register candidate: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleEnrollVoter = async (e) => {
    e.preventDefault();
    if (!newVoter.voterId || !newVoter.name || !newVoter.password) {
      setAdminMessage("Voter ID, name, and password are required.");
      return;
    }
    try {
      const res = await axios.post(`${config.backendUrl}/api/admin/voters`,
        { voterId: newVoter.voterId, name: newVoter.name, password: newVoter.password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminMessage("Voter enrolled: " + newVoter.voterId);
      setNewVoter({ voterId: "", name: "", password: "" });
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
        {tallies && (
          <div className="total-votes-cast">
            Total votes cast: {totalVotesCast}
          </div>
        )}
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
          {stats && (
            <div>
              <p className="eyebrow">Voter Turnout</p>
              <p className="section-copy">
                {stats.votedVoters} of {stats.totalVoters} voters ({stats.turnoutPercentage}%)
              </p>
            </div>
          )}
        </div>
        {electionData && electionData.election ? (
          <button className="outline-button" onClick={handleToggleStatus}>
            {electionData.election.isActive ? "Close Election" : "Open Election"}
          </button>
        ) : (
          <button className="outline-button" disabled>
            Loading...
          </button>
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
          <div className="form-group">
            <label>Candidate Name</label>
            <input
              type="text"
              value={newCandidate.name}
              onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Party/Affiliation</label>
            <input
              type="text"
              value={newCandidate.party}
              onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Avatar CID (IPFS)</label>
            <input
              type="text"
              value={newCandidate.avatarIpfs}
              onChange={(e) => setNewCandidate({ ...newCandidate, avatarIpfs: e.target.value })}
              placeholder="Enter IPFS CID for candidate avatar (optional)"
            />
          </div>
          <button className="primary-button" type="submit">Register Candidate <span aria-hidden="true">↗</span></button>
        </form>
      </section>

      {/* Voter Enrollment */}
      <section className="admin-action">
        <div>
          <p className="eyebrow">Enroll Voter</p>
          <h2>Add voter to electoral roll</h2>
          <p className="section-copy">Enter voter ID, name, and password to enroll a new voter.</p>
        </div>
        <form onSubmit={handleEnrollVoter}>
          <div className="form-group">
            <label>Voter ID</label>
            <input
              type="text"
              value={newVoter.voterId}
              onChange={(e) => setNewVoter({ ...newVoter, voterId: e.target.value.toUpperCase() })}
              required
            />
          </div>
          <div className="form-group">
            <label>Voter Name</label>
            <input
              type="text"
              value={newVoter.name}
              onChange={(e) => setNewVoter({ ...newVoter, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={newVoter.password}
              onChange={(e) => setNewVoter({ ...newVoter, password: e.target.value })}
              required
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