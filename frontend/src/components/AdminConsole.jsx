import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { useSuccessToast, useErrorToast, useInfoToast } from "./Toast";
import { soundFx } from "../utils/soundEffects";
import { InteractiveTreeCatalog } from "./InteractiveTreeCatalog";
import "./AdminConsole.css";
import "./Sidebar.css";
import "./StudioAesthetic.css";

export function AdminConsole({ token, onLogout, initialSection }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Scroll to section on mount based on initialSection prop
  useEffect(() => {
    if (initialSection) {
      const element = document.getElementById(`section-${initialSection}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        // Add a brief highlight effect
        element.classList.add("section-highlight");
        setTimeout(() => element.classList.remove("section-highlight"), 2000);
      }
    }
  }, [initialSection]);

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };
  const [tallies, setTallies] = useState({});
  const [newCandidate, setNewCandidate] = useState({ name: "", party: "", avatarIpfs: "" });
  const [newVoter, setNewVoter] = useState({ voterId: "", name: "", password: "" });
  const [electionData, setElectionData] = useState(null);
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState({ totalVoters: 0, votedVoters: 0, turnoutPercentage: 0 });
  const totalVotesCast = Object.values(tallies).reduce((a, b) => a + b, 0);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [manifestoLoading, setManifestoLoading] = useState(false);
  const [adminViewMode, setAdminViewMode] = useState("console"); // "console" | "reticle" | "tree"
  const [soundEnabled, setSoundEnabled] = useState(false);
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();
  const showInfo = useInfoToast();

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

  const handleRegisterCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.party) {
      showError("Name and Party are required.");
      return;
    }
    try {
      const res = await axios.post(`${config.backendUrl}/api/admin/candidates`,
        { name: newCandidate.name, party: newCandidate.party, avatarIpfs: newCandidate.avatarIpfs },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess(`Candidate registered: ${res.data.candidate.name}`);
      setNewCandidate({ name: "", party: "", avatarIpfs: "" });
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      showError("Failed to register candidate: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleEnrollVoter = async (e) => {
    e.preventDefault();
    if (!newVoter.voterId || !newVoter.name || !newVoter.password) {
      showError("Voter ID, name, and password are required.");
      return;
    }
    try {
      const res = await axios.post(`${config.backendUrl}/api/admin/voters`,
        { voterId: newVoter.voterId, name: newVoter.name, password: newVoter.password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess(`Voter enrolled: ${newVoter.voterId}`);
      setNewVoter({ voterId: "", name: "", password: "" });
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      showError("Failed to enroll voter: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleToggleStatus = async () => {
    try {
      const res = await axios.post(`${config.backendUrl}/api/admin/toggle-status`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess(`Election status updated to: ${res.data.isActive ? "Active" : "Closed"}`);
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      showError("Failed to toggle status: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset the local voter registry? This will allow voters to cast their ballot again in this round.")) {
      return;
    }
    try {
      await axios.post(`${config.backendUrl}/api/admin/reset`, {},
        { headers: { Authorization: `Bearer ${token}` } });
      showSuccess("Backend registry cleared. Voters can now vote again.");
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      showError("Admin action failed: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleSeedManifesto = async () => {
    setManifestoLoading(true);
    try {
      const res = await axios.post(`${config.backendUrl}/api/admin/seed-manifesto`, {},
        { headers: { Authorization: `Bearer ${token}` } });
      showSuccess(res.data.message);
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      showError("Failed to seed manifesto: " + (err.response?.data?.error || "Unknown error"));
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
      showSuccess(res.data.message);
      setEditingCandidate(null);
      const res2 = await axios.get(`${config.backendUrl}/api/election`);
      setElectionData(res2.data);
    } catch (err) {
      showError("Failed to update candidate: " + (err.response?.data?.error || "Unknown error"));
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

  if (loadingConfig || !electionData) {
    return (
      <div className="voter-loading-shell">
        <div className="md-loading-spinner" />
        <h2>Loading admin control center…</h2>
        <p>Syncing with Hedera network, candidate registry, and live mirror node tallies</p>
      </div>
    );
  }

  // Full-screen interactive DAG tree if in "tree" mode
  if (adminViewMode === "tree") {
    return (
      <InteractiveTreeCatalog
        onBackToHome={() => setAdminViewMode("console")}
        onOpenBallot={() => setAdminViewMode("console")}
      />
    );
  }

  return (
    <div className="admin-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={handleSidebarNavigate}
        mobileOpen={mobileSidebarOpen}
        onMobileToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <main className={`admin-main ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
        <header className="topbar" style={{ height: "76px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="chip-id-pill" style={{ margin: 0, padding: "3px 10px", fontSize: "11px" }}>
              <span className="chip-square" />
              <span className="chip-label">ADMIN</span>
            </div>
            <div className="studio-brand-center" style={{ position: "static", transform: "none", textAlign: "left" }}>
              <span className="line-1">The</span>
              <span className="line-2">Consensus Office</span>
              <span className="line-3">of VoteLedger</span>
            </div>
          </div>

          <motion.div
            className="topbar-actions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}
          >
            <button
              type="button"
              className={`studio-pill-btn ${adminViewMode === "console" ? "active" : ""}`}
              onClick={() => {
                soundFx.playClick(850, 0.02);
                setAdminViewMode("console");
              }}
            >
              Console
            </button>
            <button
              type="button"
              className={`studio-pill-btn ${adminViewMode === "reticle" ? "active" : ""}`}
              onClick={() => {
                soundFx.playCardScan();
                setAdminViewMode("reticle");
              }}
            >
              Reticle Monitor
            </button>
            <button
              type="button"
              className={`studio-pill-btn ${adminViewMode === "tree" ? "active" : ""}`}
              onClick={() => {
                soundFx.playClick(950, 0.02);
                setAdminViewMode("tree");
              }}
            >
              Consensus Web
            </button>
            <button
              type="button"
              className={`studio-sound-btn ${soundEnabled ? "active" : ""}`}
              onClick={() => {
                const en = soundFx.toggle();
                setSoundEnabled(en);
              }}
              title={soundEnabled ? "Mute interactive audio" : "Enable tactile haptic audio"}
            >
              {soundEnabled ? "🔊" : "🔈"}
            </button>

            <motion.button
              className="sidebar-toggle-btn"
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth <= 768) {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
              aria-label="Toggle navigation menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="desktop-toggle-icon">{sidebarOpen ? "◀" : "▶"}</span>
              <span className="mobile-toggle-icon">{mobileSidebarOpen ? "✕" : "☰"}</span>
            </motion.button>
            <motion.button
              className="studio-pill-btn"
              style={{ background: "#111111", color: "#ffffff" }}
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Log out ↗
            </motion.button>
          </motion.div>
        </header>

        {/* ── RETICLE LIVE NODE MONITOR (When Reticle Mode is Active) ── */}
        {adminViewMode === "reticle" && (
          <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="reticle-wrapper" style={{ marginBottom: "20px" }}>
              <div className="reticle-bracket reticle-tl" />
              <div className="reticle-bracket reticle-tr" />
              <div className="reticle-bracket reticle-bl" />
              <div className="reticle-bracket reticle-br" />

              <div className="nfc-card" style={{ cursor: "default" }}>
                <svg className="nfc-rings" viewBox="0 0 320 320">
                  <circle cx="160" cy="160" r="140" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="160" cy="160" r="110" fill="none" stroke="white" strokeWidth="1" />
                  <circle cx="160" cy="160" r="80" fill="none" stroke="white" strokeWidth="1" />
                  <circle cx="160" cy="160" r="50" fill="none" stroke="white" strokeWidth="1" />
                </svg>

                <div className="nfc-card-header">
                  <span className="nfc-signal" style={{ color: "#00ff66" }}>
                    ● HCS NODE OPERATIONAL
                  </span>
                </div>

                <div className="nfc-dots-orbit">
                  <span className="nfc-dot" />
                  <span className="nfc-dot" />
                  <span className="nfc-dot" />
                  <span className="nfc-dot" />
                  <span className="nfc-dot" />
                  <span className="nfc-dot" />
                  <span className="nfc-dot" />
                  <span className="nfc-dot" />
                </div>

                <div className="nfc-card-body">
                  <div className="nfc-card-title">
                    Topic 0.0.10697996<br />
                    <em>{totalVotesCast} Verified Votes</em><br />
                    <span style={{ fontSize: "12px", fontFamily: "var(--studio-mono)", opacity: 0.8 }}>
                      Turnout: {stats.turnoutPercentage}% ({stats.votedVoters}/{stats.totalVoters})
                    </span>
                  </div>
                </div>

                <div className="nfc-card-footer">
                  <div className="nfc-badge-pill">
                    HCS MIRROR <span>LIVE</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="chip-id-pill" style={{ marginBottom: "24px" }}>
              <span className="chip-square" />
              <span className="chip-label">STATUS</span>
              <span className="chip-code">
                {electionData?.election?.isActive ? "ELECTION ACTIVE · ACCEPTING BALLOTS" : "ELECTION INACTIVE · CLOSED"}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                type="button"
                className="studio-pill-btn active"
                onClick={handleToggleStatus}
              >
                {electionData?.election?.isActive ? "Pause Election" : "Activate Election"}
              </button>
              <button
                type="button"
                className="studio-pill-btn"
                onClick={handleSeedManifesto}
                disabled={manifestoLoading}
              >
                {manifestoLoading ? "Seeding..." : "⚡ Seed Demo Manifestos"}
              </button>
              <button
                type="button"
                className="studio-pill-btn"
                onClick={handleReset}
              >
                Reset Voter Registry
              </button>
              <button
                type="button"
                className="studio-pill-btn"
                onClick={() => setAdminViewMode("console")}
              >
                Open Full Console Grid →
              </button>
            </div>
          </div>
        )}

        {adminViewMode === "console" && (
          <>
            <motion.section
              id="section-overview"
              className="dashboard-heading"
              variants={cardVariants}
            >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="eyebrow">Operations / Live audit</p>
              <h1>Control center</h1>
              <p className="section-copy">Monitor the election ledger and manage the local registry.</p>
            </motion.div>
            <motion.div
              className="live-indicator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="status-dot" /> Live mirror node
            </motion.div>
            {tallies && (
              <motion.div
                className="total-votes-cast"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 12 }}
              >
                Total votes cast: {totalVotesCast}
              </motion.div>
            )}
          </motion.section>

        {/* Election Status */}
          <motion.section
            id="section-election"
            className="admin-status card"
            variants={cardVariants}
          >
            <motion.div
              className="section-title-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="eyebrow">Election Status</p>
                {electionData && electionData.election ? (
                  <>
                    <h2>{electionData.election.title}</h2>
                    <p className="section-copy">Status: {electionData.election.isActive ? "Active" : "Closed"}</p>
                  </>
                ) : (
                  <p>Loading election details...</p>
                )}
              </motion.div>
              {stats && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <p className="eyebrow">Voter Turnout</p>
                  <p className="section-copy">
                    {stats.votedVoters} of {stats.totalVoters} voters ({stats.turnoutPercentage}%)
                  </p>
                </motion.div>
              )}
            </motion.div>
            <motion.button
              className="btn btn--outline"
              onClick={handleToggleStatus}
              disabled={!electionData || !electionData.election}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {electionData && electionData.election ? (
                electionData.election.isActive ? "Close Election" : "Open Election"
              ) : (
                "Loading..."
              )}
            </motion.button>
          </motion.section>

        {/* Candidate Registration */}
          <motion.section
            id="section-candidates"
            className="admin-action card card--interactive"
            variants={cardVariants}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="eyebrow">Register Candidate</p>
              <h2>Add a new candidate</h2>
              <p className="section-copy">Enter candidate details to add to the ballot.</p>
            </motion.div>
            <motion.form
              onSubmit={handleRegisterCandidate}
              className="candidate-form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="form-group" variants={itemVariants}>
                <label className="form-label">Candidate Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  required
                />
              </motion.div>
              <motion.div className="form-group" variants={itemVariants}>
                <label className="form-label">Party/Affiliation</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCandidate.party}
                  onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                  required
                />
              </motion.div>
              <motion.div className="form-group" variants={itemVariants}>
                <label className="form-label">Avatar CID (IPFS)</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCandidate.avatarIpfs}
                  onChange={(e) => setNewCandidate({ ...newCandidate, avatarIpfs: e.target.value })}
                  placeholder="Enter IPFS CID for candidate avatar (optional)"
                />
              </motion.div>
              <motion.button
                className="btn btn--primary"
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                Register Candidate <span aria-hidden="true">↗</span>
              </motion.button>
            </motion.form>
          </motion.section>

        {/* Voter Enrollment */}
          <motion.section
            id="section-voters"
            className="admin-action card card--interactive"
            variants={cardVariants}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="eyebrow">Enroll Voter</p>
              <h2>Add voter to electoral roll</h2>
              <p className="section-copy">Enter voter ID, name, and password to enroll a new voter.</p>
            </motion.div>
            <motion.form
              onSubmit={handleEnrollVoter}
              className="voter-form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="form-group" variants={itemVariants}>
                <label className="form-label">Voter ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={newVoter.voterId}
                  onChange={(e) => setNewVoter({ ...newVoter, voterId: e.target.value.toUpperCase() })}
                  required
                />
              </motion.div>
              <motion.div className="form-group" variants={itemVariants}>
                <label className="form-label">Voter Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newVoter.name}
                  onChange={(e) => setNewVoter({ ...newVoter, name: e.target.value })}
                  required
                />
              </motion.div>
              <motion.div className="form-group" variants={itemVariants}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={newVoter.password}
                  onChange={(e) => setNewVoter({ ...newVoter, password: e.target.value })}
                  required
                />
              </motion.div>
              <motion.button
                className="btn btn--primary"
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                Enroll Voter <span aria-hidden="true">↗</span>
              </motion.button>
            </motion.form>
          </motion.section>

        {/* Audit Section */}
          <motion.section
            id="section-tallies"
            className="audit-section"
            variants={cardVariants}
          >
            <motion.div
              className="section-title-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2>Election snapshot</h2>
                <p className="section-copy">Read-only tallies from the Hedera mirror node.</p>
              </motion.div>
              <motion.span
                className="refresh-label"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                Updates every 4 seconds
              </motion.span>
            </motion.div>
            <motion.div
              className="tally-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {(electionData.candidates || []).map((c, index) => (
                <motion.article
                  key={c.candidateId}
                  className="tally-card card card--interactive"
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <div className="candidate-index">{index + 1 < 10 ? `0${index + 1}` : index + 1}</div>
                  <p className="eyebrow">Candidate</p>
                  <h3>{c.name}</h3>
                  <p className="party-name">{c.party}</p>
                  <div className="vote-count">{tallies[c.candidateId] || 0}</div>
                  <p className="vote-label">verified votes</p>
                </motion.article>
              ))}
            </motion.div>
          </motion.section>

        {/* Manifesto & Candidate Profiles Management */}
        <section id="section-manifesto" className="audit-section">
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

        {/* Evidence Archive */}
        <section id="section-evidence" className="admin-action card card--interactive">
          <div>
            <p className="eyebrow">Evidence Archive</p>
            <h2>Verified Documents</h2>
            <p className="section-copy">Manage official notices, audit reports, and institutional records supporting candidate claims.</p>
          </div>
          <p className="section-copy" style={{color: "var(--color-text-muted)", fontSize: "0.875rem"}}>Evidence management is integrated with the Manifesto section above. Use the "Seed / Reset Demo Manifestos" button to populate demo evidence documents.</p>
        </section>

        {/* Campus Issues */}
        <section id="section-issues" className="admin-action card card--interactive">
          <div>
            <p className="eyebrow">Campus Issues</p>
            <h2>Student Priority Issues</h2>
            <p className="section-copy">Track key campus challenges and candidate proposed solutions.</p>
          </div>
          <p className="section-copy" style={{color: "var(--color-text-muted)", fontSize: "0.875rem"}}>Issue management is integrated with the Manifesto section. Campus issues are displayed in the Manifesto Dashboard for voters.</p>
        </section>

        <section id="section-reset" className="admin-action card card--interactive">
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
        </>
        )}
      </main>
    </div>
  );
}