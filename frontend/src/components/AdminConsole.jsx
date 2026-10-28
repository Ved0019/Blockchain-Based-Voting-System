import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Sidebar } from "./Sidebar";
import "./AdminConsole.css";
import "./Sidebar.css";

export function AdminConsole({ token, onLogout }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tallies, setTallies] = useState({});
  const [newCandidate, setNewCandidate] = useState({ name: "", party: "", avatarIpfs: "" });
  const [newVoter, setNewVoter] = useState({ voterId: "", name: "", password: "" });
  const [adminMessage, setAdminMessage] = useState({ type: "", text: "" });
  const [electionData, setElectionData] = useState(null);
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState({ totalVoters: 0, votedVoters: 0, turnoutPercentage: 0 });
  const totalVotesCast = Object.values(tallies).reduce((a, b) => a + b, 0);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [manifestoLoading, setManifestoLoading] = useState(false);

  // Fetch configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const topicId = import.meta.env.VITE_HEDERA_TOPIC_ID || "0.0.10697996";
        const mirrorNodeUrl = import.meta.env.VITE_MIRROR_NODE_URL ||
          `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`;
        const res = await axios.get(`${backendUrl}/api/config`);
        setConfig({
          ...res.data,
          hederaTopicId: res.data.hederaTopicId || topicId,
          mirrorNodeUrl: res.data.mirrorNodeUrl || mirrorNodeUrl,
          backendUrl: res.data.backendUrl || backendUrl
        });
      } catch (err) {
        console.error("Failed to load config:", err);
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const topicId = import.meta.env.VITE_HEDERA_TOPIC_ID || "0.0.10697996";
        setConfig({
          hederaTopicId: topicId,
          mirrorNodeUrl: import.meta.env.VITE_MIRROR_NODE_URL ||
            `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`,
          backendUrl
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
          const res = await axios.get(`${config.backendUrl}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
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

  const showMessage = (type, text) => setAdminMessage({ type, text });

  const handleRegisterCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.party) {
      showMessage("error", "Name and Party are required.");
      return;
    }
    try {
      const res = await axios.post(`${config.backendUrl}/api/admin/candidates`,
        { name: newCandidate.name, party: newCandidate.party, avatarIpfs: newCandidate.avatarIpfs },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("success", `Candidate registered: ${res.data.candidate.name}`);
      setNewCandidate({ name: "", party: "", avatarIpfs: "" });
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      showMessage("error", "Failed to register candidate: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleEnrollVoter = async (e) => {
    e.preventDefault();
    if (!newVoter.voterId || !newVoter.name || !newVoter.password) {
      showMessage("error", "Voter ID, name, and password are required.");
      return;
    }
    try {
      const res = await axios.post(`${config.backendUrl}/api/admin/voters`,
        { voterId: newVoter.voterId, name: newVoter.name, password: newVoter.password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("success", `Voter enrolled: ${newVoter.voterId}`);
      setNewVoter({ voterId: "", name: "", password: "" });
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      showMessage("error", "Failed to enroll voter: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleToggleStatus = async () => {
    try {
      const res = await axios.post(`${config.backendUrl}/api/admin/toggle-status`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("success", `Election status updated to: ${res.data.isActive ? "Active" : "Closed"}`);
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      showMessage("error", "Failed to toggle status: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(`${config.backendUrl}/api/admin/reset`, {},
        { headers: { Authorization: `Bearer ${token}` } });
      showMessage("success", "Backend registry cleared. Voters can now vote again.");
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      showMessage("error", "Admin action failed: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleSeedManifesto = async () => {
    setManifestoLoading(true);
    try {
      const res = await axios.post(`${config.backendUrl}/api/admin/seed-manifesto`, {},
        { headers: { Authorization: `Bearer ${token}` } });
      showMessage("success", res.data.message);
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      showMessage("error", "Failed to seed manifesto: " + (err.response?.data?.error || "Unknown error"));
    } finally {
      setManifestoLoading(false);
    }
  };

  const handleSaveCandidateProfile = async (candidateId) => {
    if (!editingCandidate) return;
    setManifestoLoading(true);
    try {
      const res = await axios.put(`${config.backendUrl}/api/admin/candidates/${candidateId}`,
        editingCandidate,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("success", res.data.message);
      setEditingCandidate(null);
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      showMessage("error", "Failed to update candidate: " + (err.response?.data?.error || "Unknown error"));
    } finally {
      setManifestoLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authVoterId");
    localStorage.removeItem("authRole");
    onLogout();
  };

  const handleSidebarNavigate = (path) => {
    navigate(path);
  };

  if (loadingConfig) return <div className="loading">Loading configuration...</div>;
  if (!electionData) return <div className="loading">Loading election data...</div>;

  return (
    <div className="admin-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={handleSidebarNavigate}
      />

      <main className="admin-main" style={{ marginLeft: sidebarOpen ? '260px' : '72px' }}>
        <header className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark brand-mark--sm">V</div>
            <span>VOTE<span className="brand-accent">/</span>LEDGER</span>
          </div>
          <div className="topbar-actions">
            <span className="role-chip admin-chip">Administrator</span>
            <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
              {sidebarOpen ? "◀" : "▶"}
            </button>
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
        {adminMessage.text && (
          <div className={`alert alert--${adminMessage.type}`} role="alert">
            {adminMessage.text}
          </div>
        )}

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
            <button className="btn btn--outline" onClick={handleToggleStatus}>
              {electionData.election.isActive ? "Close Election" : "Open Election"}
            </button>
          ) : (
            <button className="btn btn--outline" disabled>Loading...</button>
          )}
        </section>

        {/* Candidate Registration */}
        <section className="admin-action card card--interactive">
          <div>
            <p className="eyebrow">Register Candidate</p>
            <h2>Add a new candidate</h2>
            <p className="section-copy">Enter candidate details to add to the ballot.</p>
          </div>
          <form onSubmit={handleRegisterCandidate} className="candidate-form">
            <div className="form-group">
              <label className="form-label">Candidate Name</label>
              <input
                type="text"
                className="form-input"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Party/Affiliation</label>
              <input
                type="text"
                className="form-input"
                value={newCandidate.party}
                onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Avatar CID (IPFS)</label>
              <input
                type="text"
                className="form-input"
                value={newCandidate.avatarIpfs}
                onChange={(e) => setNewCandidate({ ...newCandidate, avatarIpfs: e.target.value })}
                placeholder="Enter IPFS CID for candidate avatar (optional)"
              />
            </div>
            <button className="btn btn--primary" type="submit">Register Candidate <span aria-hidden="true">↗</span></button>
          </form>
        </section>

        {/* Voter Enrollment */}
        <section className="admin-action card card--interactive">
          <div>
            <p className="eyebrow">Enroll Voter</p>
            <h2>Add voter to electoral roll</h2>
            <p className="section-copy">Enter voter ID, name, and password to enroll a new voter.</p>
          </div>
          <form onSubmit={handleEnrollVoter} className="voter-form">
            <div className="form-group">
              <label className="form-label">Voter ID</label>
              <input
                type="text"
                className="form-input"
                value={newVoter.voterId}
                onChange={(e) => setNewVoter({ ...newVoter, voterId: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Voter Name</label>
              <input
                type="text"
                className="form-input"
                value={newVoter.name}
                onChange={(e) => setNewVoter({ ...newVoter, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={newVoter.password}
                onChange={(e) => setNewVoter({ ...newVoter, password: e.target.value })}
                required
              />
            </div>
            <button className="btn btn--primary" type="submit">Enroll Voter <span aria-hidden="true">↗</span></button>
          </form>
        </section>

        {/* Audit Section */}
        <section className="audit-section">
          <div className="section-title-row">
            <div>
              <h2>Election snapshot</h2>
              <p className="section-copy">Read-only tallies from the Hedera mirror node.</p>
            </div>
            <span className="refresh-label">Updates every 4 seconds</span>
          </div>
          <div className="tally-grid">
            {(electionData.candidates || []).map(c => (
              <article className="tally-card card card--interactive" key={c.candidateId}>
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

        {/* Manifesto & Candidate Profiles Management */}
        <section className="audit-section">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Manifesto Management</p>
              <h2>Candidate Manifestos & Track Records</h2>
              <p className="section-copy">Manage candidate profiles, manifesto commitments, and seed demonstration records.</p>
            </div>
            <button
              className="btn btn--outline"
              onClick={handleSeedManifesto}
              disabled={manifestoLoading}
            >
              {manifestoLoading ? "Seeding..." : "⚡ Seed / Reset Demo Manifestos"}
            </button>
          </div>

          <div className="candidate-profiles">
            {(electionData.candidates || []).map(c => {
              const isEditing = editingCandidate && editingCandidate.candidateId === c.candidateId;
              return (
                <div key={c.candidateId} className="candidate-profile card">
                  <div className="candidate-profile__header">
                    <div>
                      <strong>{c.name}</strong>
                      <span className="candidate-profile__party">({c.party})</span>
                      {c.isIncumbent && (
                        <span className="badge badge--gold">Incumbent</span>
                      )}
                    </div>
                    <div className="candidate-profile__actions">
                      <span className="candidate-profile__stats">
                        📋 {(c.manifesto || []).length} promises · 📊 {(c.performanceRecords || []).length} perf records
                      </span>
                      {!isEditing ? (
                        <button
                          className="btn btn--ghost"
                          onClick={() => setEditingCandidate({
                            candidateId: c.candidateId,
                            name: c.name,
                            party: c.party,
                            tagline: c.tagline || "",
                            bio: c.bio || "",
                            department: c.department || "",
                            year: c.year || "",
                            position: c.position || "Student Council President",
                            priorities: c.priorities || []
                          })}
                        >
                          Edit Profile ✎
                        </button>
                      ) : (
                        <button
                          className="btn btn--ghost"
                          onClick={() => setEditingCandidate(null)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="candidate-profile__edit">
                      <div className="form-group">
                        <label className="form-label">Tagline / Slogan</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editingCandidate.tagline}
                          onChange={e => setEditingCandidate({ ...editingCandidate, tagline: e.target.value })}
                          placeholder="Candidate campaign slogan"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Department & Year</label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            className="form-input"
                            value={editingCandidate.department}
                            onChange={e => setEditingCandidate({ ...editingCandidate, department: e.target.value })}
                            placeholder="Department"
                          />
                          <input
                            type="text"
                            className="form-input"
                            value={editingCandidate.year}
                            onChange={e => setEditingCandidate({ ...editingCandidate, year: e.target.value })}
                            placeholder="Year / Level"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Biography / Intro</label>
                        <textarea
                          className="form-textarea"
                          value={editingCandidate.bio}
                          onChange={e => setEditingCandidate({ ...editingCandidate, bio: e.target.value })}
                          placeholder="Brief candidate biography..."
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Top Priorities (comma-separated)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={Array.isArray(editingCandidate.priorities) ? editingCandidate.priorities.join(", ") : ""}
                          onChange={e => setEditingCandidate({
                            ...editingCandidate,
                            priorities: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                          })}
                          placeholder="Priority 1, Priority 2, Priority 3"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          className="btn btn--primary"
                          onClick={() => handleSaveCandidateProfile(c.candidateId)}
                          disabled={manifestoLoading}
                        >
                          {manifestoLoading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          className="btn btn--outline"
                          onClick={() => setEditingCandidate(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="candidate-profile__preview">
                      {c.tagline && (
                        <p className="candidate-profile__tagline">"{c.tagline}"</p>
                      )}
                      {c.priorities && c.priorities.length > 0 && (
                        <div className="candidate-profile__priorities">
                          {c.priorities.slice(0, 3).map((p, i) => (
                            <span key={i} className="badge badge--neutral">→ {p}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="admin-action card card--interactive">
          <div>
            <p className="eyebrow">Local demo utility</p>
            <h2>Reset voter registry</h2>
            <p className="section-copy">Clear the local participation registry so another test round can begin.</p>
          </div>
          <button className="btn btn--outline" onClick={handleReset}>Reset registry <span aria-hidden="true">↗</span></button>
        </section>

        <footer className="app-footer">
          <span>VoteLedger / Admin workspace</span>
          <span>Secured by Hedera Consensus Service</span>
        </footer>
      </main>
    </div>
  );
}