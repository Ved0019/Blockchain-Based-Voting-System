import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { useErrorToast, useSuccessToast } from "./Toast";
import { soundFx } from "../utils/soundEffects";
import { InteractiveTreeCatalog } from "./InteractiveTreeCatalog";
import "./StudioAesthetic.css";

const CANDIDATES_DATA = [
  {
    id: "1",
    candidateId: "1",
    name: "Aarav Sharma",
    party: "Student Alliance for Reform",
    position: "Council President Nominee",
    isIncumbent: true,
    tagline: "Accountable Governance & Verified Delivery",
    avatarIpfs: "bafkreidv4e7yhy7z374h7xhy",
    ringColor: "silver",
    pillars: [
      { title: "24/7 Library & Lab Access", copy: "RFID automated overnight access to STEM labs and central study facilities." },
      { title: "Hostel Wi-Fi Overhaul", copy: "Gigabit fiber backhaul with dedicated AP per dorm room block." },
      { title: "Transparency Registry", copy: "Quarterly budget allocations and student grievance tickets published to ledger." }
    ],
    bio: "Current council representative with 92% promise completion rate. Focused on infrastructure and student rights."
  },
  {
    id: "2",
    candidateId: "2",
    name: "Ananya Iyer",
    party: "Voice of Students",
    position: "Presidential Challenger",
    isIncumbent: false,
    tagline: "Inclusivity, Mental Health & Modern Campus Life",
    avatarIpfs: "bafkreif7z374h7xhyidv4e7y",
    ringColor: "gold",
    pillars: [
      { title: "Universal Meal Subsidy", copy: "Direct canteen subsidy ensuring nutritious, affordable meals under ₹40." },
      { title: "Full-Time Wellness Counselors", copy: "Confidential on-campus psychological support with zero waitlists." },
      { title: "Eco-Friendly Electric Shuttles", copy: "Zero-emission campus transit connecting all outer dorms every 10 mins." }
    ],
    bio: "Debate society president and mental health advocate campaigning for direct student representation and transparency."
  },
  {
    id: "3",
    candidateId: "3",
    name: "Rohan Varma",
    party: "Progressive Youth Front",
    position: "Independent Presidential Candidate",
    isIncumbent: false,
    tagline: "Career Development & Student Entrepreneurship",
    avatarIpfs: "bafkreibhy7z374h7xhyidv4e",
    ringColor: "carbon",
    pillars: [
      { title: "Startup Incubation Seed Fund", copy: "₹50 Lakh annual student founder grant with alumni venture mentorship." },
      { title: "Internship Placement Guarantee", copy: "Partnerships with 200+ tier-1 technology and research organizations." },
      { title: "Open Course Auditing", copy: "Cross-department elective flexibility without restrictive prerequisite barriers." }
    ],
    bio: "Computer science researcher and student founder building decentralized public goods and career acceleration pathways."
  }
];

export function StudioHome({ onLogin }) {
  const [viewMode, setViewMode] = useState("card"); // "card" (Screenshot 1), "spec" (Screenshot 2), "tree" (Screenshot 3)
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedCandidateIdx, setSelectedCandidateIdx] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeBranch, setActiveBranch] = useState("all");

  const showError = useErrorToast();
  const showSuccess = useSuccessToast();

  const currentCandidate = CANDIDATES_DATA[selectedCandidateIdx];

  const handleToggleSound = () => {
    const isNowOn = soundFx.toggle();
    setSoundEnabled(isNowOn);
    if (isNowOn) {
      showSuccess("Interactive sound feedback enabled");
    }
  };

  const changeView = (mode) => {
    soundFx.playClick(850, 0.02);
    setViewMode(mode);
  };

  const handleQuickFill = (roleType) => {
    soundFx.playClick(1000, 0.02);
    if (roleType === "admin") {
      setVoterId("ADMIN001");
      setPassword("admin123");
    } else {
      setVoterId("VOTER001");
      setPassword("voter123");
    }
  };

  const handleNextCandidate = () => {
    soundFx.playClick(1100, 0.02);
    setSelectedCandidateIdx((prev) => (prev + 1) % CANDIDATES_DATA.length);
  };

  const handlePrevCandidate = () => {
    soundFx.playClick(900, 0.02);
    setSelectedCandidateIdx((prev) => (prev - 1 + CANDIDATES_DATA.length) % CANDIDATES_DATA.length);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    soundFx.playClick(1300, 0.04);
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await axios.post(`${backendUrl}/api/auth/login`, {
        voterId: voterId.trim().toUpperCase(),
        password,
      });

      const decoded = jwtDecode(res.data.token);
      onLogin({
        token: res.data.token,
        voterId: decoded.sub,
        role: decoded.role,
      });
    } catch (err) {
      showError(err.response?.data?.error || "Authentication failed. Try demo keys VOTER001 or ADMIN001.");
    } finally {
      setLoading(false);
    }
  };

  if (viewMode === "tree") {
    return (
      <InteractiveTreeCatalog
        onBackToHome={() => changeView("card")}
        onOpenBallot={() => setAuthModalOpen(true)}
      />
    );
  }

  return (
    <div className="studio-shell">
      {/* ── TOP HEADER (dmcg.co inspired) ── */}
      <header className="studio-header">
        <nav className="studio-nav-left" aria-label="Secondary navigation">
          <button
            type="button"
            className="studio-nav-link"
            onClick={() => {
              soundFx.playClick(700, 0.02);
              setAboutModalOpen(true);
            }}
          >
            About
          </button>
          <a
            href="https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10697996/messages"
            target="_blank"
            rel="noopener noreferrer"
            className="studio-nav-link"
            style={{ textDecoration: "none" }}
          >
            Hedera Protocol ↗
          </a>
        </nav>

        {/* Stacked Center Office Typography */}
        <div
          className="studio-brand-center"
          onClick={() => changeView("card")}
          role="button"
          tabIndex={0}
        >
          <span className="line-1">The</span>
          <span className="line-2">Consensus Office</span>
          <span className="line-3">of VoteLedger</span>
        </div>

        <div className="studio-nav-right">
          <button
            type="button"
            className={`studio-pill-btn ${viewMode === "card" ? "active" : ""}`}
            onClick={() => changeView("card")}
          >
            Reticle
          </button>
          <button
            type="button"
            className={`studio-pill-btn ${viewMode === "spec" ? "active" : ""}`}
            onClick={() => changeView("spec")}
          >
            Candidates
          </button>
          <button
            type="button"
            className={`studio-pill-btn ${viewMode === "tree" ? "active" : ""}`}
            onClick={() => changeView("tree")}
          >
            Ledger Web
          </button>
          <button
            type="button"
            className={`studio-sound-btn ${soundEnabled ? "active" : ""}`}
            onClick={handleToggleSound}
            title={soundEnabled ? "Mute interactive audio" : "Enable tactile haptic audio"}
            aria-label="Toggle haptic audio"
          >
            {soundEnabled ? "🔊" : "🔈"}
          </button>
          <button
            type="button"
            className="studio-pill-btn"
            style={{ background: "var(--studio-black)", color: "#ffffff", marginLeft: "4px" }}
            onClick={() => {
              soundFx.playCardScan();
              setAuthModalOpen(true);
            }}
          >
            Sign In →
          </button>
        </div>
      </header>

      {/* ── STAGE MAIN AREA ── */}
      <main className="studio-stage">
        <AnimatePresence mode="wait">
          {/* ── VIEW 1: RETICLE / NFC CARD (Screenshot 1) ── */}
          {viewMode === "card" && (
            <motion.div
              key="card-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              {/* Electric Neon Green Viewfinder Reticle */}
              <div className="reticle-wrapper">
                <div className="reticle-bracket reticle-tl" />
                <div className="reticle-bracket reticle-tr" />
                <div className="reticle-bracket reticle-bl" />
                <div className="reticle-bracket reticle-br" />

                {/* Dark Floating Cryptographic Card */}
                <div
                  className="nfc-card"
                  onClick={() => {
                    soundFx.playCardScan();
                    setAuthModalOpen(true);
                  }}
                  title="Click to authenticate verified ballot"
                >
                  {/* Concentric Rings Overlay */}
                  <svg className="nfc-rings" viewBox="0 0 320 320">
                    <circle cx="160" cy="160" r="140" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="160" cy="160" r="110" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="160" cy="160" r="80" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="160" cy="160" r="50" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="160" cy="160" r="20" fill="none" stroke="white" strokeWidth="1" />
                  </svg>

                  <div className="nfc-card-header">
                    <span className="nfc-signal">NFC )))</span>
                  </div>

                  {/* Pulsing / Rotating Green Consensus Orbit */}
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
                    <div className="nfc-emblem-row">
                      <div className="nfc-star-symbol" />
                    </div>
                    <div className="nfc-card-title">
                      Blockchain<br />
                      Verified<br />
                      by<br />
                      <em>VoteLedger®</em>
                    </div>
                  </div>

                  <div className="nfc-card-footer">
                    <div className="nfc-badge-pill">
                      Hedera <span>HCS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact Monospace Chip Pill from Screenshot 1 */}
              <div
                className="chip-id-pill"
                onClick={() => {
                  soundFx.playClick(1000, 0.02);
                  setAuthModalOpen(true);
                }}
                style={{ cursor: "pointer" }}
                title="Click to enter ballot credentials"
              >
                <span className="chip-square" />
                <span className="chip-label">CHIP</span>
                <span className="chip-code">EZ7SXZY6FRRN · HCS-TOPIC</span>
              </div>
            </motion.div>
          )}

          {/* ── VIEW 2: HARDWARE SPEC / CANDIDATE SHOWCASE (Screenshot 2) ── */}
          {viewMode === "spec" && (
            <motion.div
              key="spec-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
              className="spec-card-container"
            >
              <div className="spec-card-grid">
                {/* Left Column: Platform Pillars */}
                <div className="spec-left-col">
                  <div className="spec-mark">〰</div>
                  {currentCandidate.pillars.map((p, idx) => (
                    <div key={idx} className="spec-feature">
                      <span className="spec-feature-title">{p.title}</span>
                      <span className="spec-feature-copy">{p.copy}</span>
                    </div>
                  ))}

                  <div className="spec-footer-note">
                    Official Student Council Election 2026. Cryptographically timestamped on Hedera Consensus Service. Zero-knowledge ballot verification.
                  </div>
                </div>

                {/* Center Column: 3D Hardware Ring / Candidate Emblem */}
                <div className="spec-center-col">
                  <div className="spec-object-wrapper">
                    <div className="spec-hardware-ring">
                      <div className="spec-ring-sensor" />
                      <div className="spec-hardware-inner">
                        0{currentCandidate.id}
                      </div>
                    </div>
                  </div>

                  {/* Carousel Controls */}
                  <div className="spec-slider-controls">
                    <button
                      type="button"
                      className="spec-slider-arrow"
                      onClick={handlePrevCandidate}
                      aria-label="Previous candidate"
                    >
                      ‹
                    </button>
                    <div className="spec-dots-row">
                      {CANDIDATES_DATA.map((_, i) => (
                        <span
                          key={i}
                          className={`spec-dot-indicator ${i === selectedCandidateIdx ? "active" : ""}`}
                          onClick={() => {
                            soundFx.playClick(950, 0.02);
                            setSelectedCandidateIdx(i);
                          }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="spec-slider-arrow"
                      onClick={handleNextCandidate}
                      aria-label="Next candidate"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Right Column: Candidate Specs & Black Pill CTA */}
                <div className="spec-right-col">
                  <div className="spec-right-title">
                    {currentCandidate.name}
                  </div>
                  <div className="spec-right-copy">
                    {currentCandidate.bio}
                  </div>
                  <div className="spec-right-meta">
                    Party: <strong>{currentCandidate.party}</strong>
                    {currentCandidate.isIncumbent && " · Incumbent Record Available"}
                  </div>

                  {/* Signature Black Pill CTA */}
                  <button
                    type="button"
                    className="spec-cta-pill"
                    onClick={() => {
                      soundFx.playCardScan();
                      setAuthModalOpen(true);
                    }}
                  >
                    <span>Cast Ballot</span>
                    <span className="cta-price">#0{currentCandidate.id}</span>
                  </button>
                </div>
              </div>

              {/* Sandbar style edge pill */}
              <div className="spec-floating-tag">
                VoteLedger V2.4
              </div>
            </motion.div>
          )}

          {/* ── VIEW 3: INTERACTIVE NODE NETWORK / TREE (Screenshot 3) ── */}
          {viewMode === "tree" && (
            <motion.div
              key="tree-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
              className="tree-container"
            >
              {/* Smooth Bezier SVG Connections Canvas */}
              <svg className="tree-svg-canvas" preserveAspectRatio="none">
                <path d="M 120 240 C 180 240, 180 140, 260 140" className="tree-canvas-path" />
                <path d="M 120 240 C 180 240, 180 240, 260 240" className="tree-canvas-path" />
                <path d="M 120 240 C 180 240, 180 340, 260 340" className="tree-canvas-path" />
                <path d="M 370 140 C 440 140, 440 90, 520 90" className="tree-canvas-path" />
                <path d="M 370 140 C 440 140, 440 160, 520 160" className="tree-canvas-path" />
                <path d="M 370 140 C 440 140, 440 220, 520 220" className="tree-canvas-path" />
                <path d="M 370 240 C 440 240, 440 290, 520 290" className="tree-canvas-path" />
                <path d="M 370 240 C 440 240, 440 360, 520 360" className="tree-canvas-path" />
                <path d="M 370 340 C 440 340, 440 420, 520 420" className="tree-canvas-path" />
              </svg>

              <div className="tree-layout-grid">
                {/* Column 1: Root Node */}
                <div className="tree-root-box">
                  <div
                    className="tree-node-pill active"
                    onClick={() => {
                      soundFx.playClick(800, 0.02);
                      setActiveBranch("all");
                    }}
                  >
                    <span>Election</span>
                    <span className="count">108</span>
                  </div>
                </div>

                {/* Column 2: Branches */}
                <div className="tree-branches-col">
                  <div
                    className={`tree-node-pill ${activeBranch === "candidates" ? "active" : ""}`}
                    onClick={() => {
                      soundFx.playClick(900, 0.02);
                      setActiveBranch("candidates");
                    }}
                  >
                    <span>Candidates</span>
                    <span className="count">03</span>
                  </div>
                  <div
                    className={`tree-node-pill ${activeBranch === "issues" ? "active" : ""}`}
                    onClick={() => {
                      soundFx.playClick(1000, 0.02);
                      setActiveBranch("issues");
                    }}
                  >
                    <span>Campus Issues</span>
                    <span className="count">14</span>
                  </div>
                  <div
                    className={`tree-node-pill ${activeBranch === "proofs" ? "active" : ""}`}
                    onClick={() => {
                      soundFx.playClick(1100, 0.02);
                      setActiveBranch("proofs");
                    }}
                  >
                    <span>Consensus Proofs</span>
                    <span className="count">100%</span>
                  </div>
                </div>

                {/* Column 3: Diverse Interactive Cards / Leaves */}
                <div className="tree-leaves-grid">
                  <div
                    className="tree-card-tile highlight"
                    onClick={() => {
                      soundFx.playClick(1200, 0.02);
                      setSelectedCandidateIdx(0);
                      setViewMode("spec");
                    }}
                  >
                    <span className="tile-tag">Candidate 01</span>
                    <span className="tile-title">Aarav Sharma</span>
                    <span className="tile-sub">Alliance for Reform</span>
                  </div>

                  <div
                    className="tree-card-tile"
                    onClick={() => {
                      soundFx.playClick(1200, 0.02);
                      setSelectedCandidateIdx(1);
                      setViewMode("spec");
                    }}
                  >
                    <span className="tile-tag">Candidate 02</span>
                    <span className="tile-title">Ananya Iyer</span>
                    <span className="tile-sub">Voice of Students</span>
                  </div>

                  <div
                    className="tree-card-tile"
                    onClick={() => {
                      soundFx.playClick(1200, 0.02);
                      setSelectedCandidateIdx(2);
                      setViewMode("spec");
                    }}
                  >
                    <span className="tile-tag">Candidate 03</span>
                    <span className="tile-title">Rohan Varma</span>
                    <span className="tile-sub">Progressive Youth</span>
                  </div>

                  <div className="tree-card-tile dark">
                    <span className="tile-tag" style={{ color: "#00ff66" }}>HCS TOPIC</span>
                    <span className="tile-title">0.0.10697996</span>
                    <span className="tile-sub">Fair Consensus</span>
                  </div>

                  <div className="tree-card-tile">
                    <span className="tile-tag">ISSUE #01</span>
                    <span className="tile-title">24x7 Wi-Fi</span>
                    <span className="tile-sub">High Priority</span>
                  </div>

                  <div className="tree-card-tile">
                    <span className="tile-tag">ISSUE #02</span>
                    <span className="tile-title">Canteen Quality</span>
                    <span className="tile-sub">Verified Reviews</span>
                  </div>

                  <div className="tree-card-tile">
                    <span className="tile-tag">ISSUE #03</span>
                    <span className="tile-title">Hostel Transit</span>
                    <span className="tile-sub">EV Shuttles</span>
                  </div>

                  <div className="tree-card-tile dark">
                    <span className="tile-tag" style={{ color: "#00ff66" }}>MIRROR NODE</span>
                    <span className="tile-title">HashScan</span>
                    <span className="tile-sub">Public Explorer</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── BOTTOM FOOTER (Exact dmcg.co style) ── */}
      <footer className="studio-footer">
        <div className="studio-footer-left">
          Cryptographic governance & verifiable ballots
        </div>

        {/* Center Viewport Switcher (Exact from Screenshot 3!) */}
        <div className="studio-footer-center" role="toolbar" aria-label="View modes">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "card" ? "active" : ""}`}
            onClick={() => changeView("card")}
            title="Reticle / NFC Card View"
            aria-label="View Reticle Card"
          >
            ⌖
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "spec" ? "active" : ""}`}
            onClick={() => changeView("spec")}
            title="Product Spec / Candidate View"
            aria-label="View Candidate Spec Card"
          >
            ⊞
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "tree" ? "active" : ""}`}
            onClick={() => changeView("tree")}
            title="Interactive Ledger Web View"
            aria-label="View Ledger Web Graph"
          >
            ☍
          </button>
        </div>

        <div className="studio-footer-right">
          Hedera Testnet · Topic 0.0.10697996
        </div>
      </footer>

      {/* ── AUTHENTICATION MODAL DIALOG ── */}
      <AnimatePresence>
        {authModalOpen && (
          <motion.div
            className="studio-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAuthModalOpen(false)}
          >
            <motion.div
              className="studio-modal-dialog"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                className="studio-modal-close"
                onClick={() => setAuthModalOpen(false)}
                aria-label="Close dialog"
              >
                ✕
              </button>

              <div className="studio-modal-eyebrow">HCS Authenticator</div>
              <h2 className="studio-modal-title">Enter ballot credentials</h2>
              <p className="studio-modal-desc">
                Provide your voter or admin key to enter the cryptographic ballot workspace.
              </p>

              {/* 1-Click Fast Demo Credentials Chips */}
              <div className="studio-demo-chips">
                <button
                  type="button"
                  className="studio-demo-chip"
                  onClick={() => handleQuickFill("voter")}
                >
                  🗳️ Voter Account
                  <span>VOTER001 / voter123</span>
                </button>
                <button
                  type="button"
                  className="studio-demo-chip"
                  onClick={() => handleQuickFill("admin")}
                >
                  ⚙️ Admin Console
                  <span>ADMIN001 / admin123</span>
                </button>
              </div>

              <form onSubmit={handleLoginSubmit}>
                <div className="studio-form-group">
                  <label className="studio-form-label" htmlFor="studio-voter-id">
                    Voter or Admin Identifier
                  </label>
                  <input
                    id="studio-voter-id"
                    type="text"
                    className="studio-form-input"
                    placeholder="e.g. VOTER001 or ADMIN001"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>

                <div className="studio-form-group">
                  <label className="studio-form-label" htmlFor="studio-password">
                    Passcode
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="studio-password"
                      type={showPassword ? "text" : "password"}
                      className="studio-form-input"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      style={{ paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "var(--studio-gray-mid)"
                      }}
                      tabIndex={-1}
                      aria-label="Toggle password view"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="studio-submit-pill"
                  disabled={loading}
                >
                  {loading ? "Authenticating..." : "Authenticate & Continue ↗"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ABOUT MODAL ── */}
      <AnimatePresence>
        {aboutModalOpen && (
          <motion.div
            className="studio-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAboutModalOpen(false)}
          >
            <motion.div
              className="studio-modal-dialog studio-about-card"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                className="studio-modal-close"
                onClick={() => setAboutModalOpen(false)}
                aria-label="Close dialog"
              >
                ✕
              </button>

              <div className="studio-modal-eyebrow">Design Office Specification</div>
              <h2 className="studio-modal-title">VoteLedger Architecture</h2>
              <p className="studio-modal-desc">
                An institutional e-voting platform built on the Hedera Consensus Service, combining Swiss editorial precision with cryptographic integrity.
              </p>

              <div className="studio-about-pillars">
                <div className="studio-about-pillar">
                  <div className="studio-about-num">01</div>
                  <div>
                    <div className="studio-about-p-title">Hedera Consensus Service (HCS)</div>
                    <div className="studio-about-p-desc">Each ballot submission creates an immutable timestamped consensus message on topic 0.0.10697996 with fair ordering in 3-5 seconds.</div>
                  </div>
                </div>

                <div className="studio-about-pillar">
                  <div className="studio-about-num">02</div>
                  <div>
                    <div className="studio-about-p-title">End-to-End Cryptographic Secrecy</div>
                    <div className="studio-about-p-desc">Voter identities are verified without exposing ballot contents. Tamper-evident receipts allow public verification via mirror nodes.</div>
                  </div>
                </div>

                <div className="studio-about-pillar">
                  <div className="studio-about-num">03</div>
                  <div>
                    <div className="studio-about-p-title">Informed Electoral Governance</div>
                    <div className="studio-about-p-desc">Every candidate profile includes auditable previous term performance records, campus issue solutions, and evidence references.</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="studio-submit-pill"
                onClick={() => {
                  setAboutModalOpen(false);
                  setAuthModalOpen(true);
                }}
              >
                Enter Voting Booth ↗
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StudioHome;
