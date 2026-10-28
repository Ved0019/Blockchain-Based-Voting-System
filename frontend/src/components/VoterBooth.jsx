import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { soundFx } from "../utils/soundEffects";
import { InteractiveTreeCatalog } from "./InteractiveTreeCatalog";
import "./StudioAesthetic.css";
import { useErrorToast, useInfoToast, useSuccessToast } from "./Toast";

export function VoterBooth({ token, onLogout, onBackToManifesto }) {
  const [selected, setSelected] = useState(() => {
    const pref = sessionStorage.getItem("preferredCandidate");
    return pref ? Number(pref) : "";
  });
  const [votedTxId, setVotedTxId] = useState("");
  const [electionData, setElectionData] = useState(null);
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  // Studio Aesthetics State (dmcg.co inspired)
  const [viewMode, setViewMode] = useState("reticle"); // "reticle" (Scr 1), "spec" (Scr 2), "tree" (Scr 3)
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [specCandidateIdx, setSpecCandidateIdx] = useState(0);

  const showSuccess = useSuccessToast();
  const showError = useErrorToast();
  const showInfo = useInfoToast();

  const handleToggleSound = () => {
    const isNowOn = soundFx.toggle();
    setSoundEnabled(isNowOn);
    if (isNowOn) showSuccess("Interactive tactile audio enabled");
  };

  const changeView = (mode) => {
    soundFx.playClick(850, 0.02);
    setViewMode(mode);
  };

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
          if (res.data.candidates && res.data.candidates.length > 0) {
            const pref = sessionStorage.getItem("preferredCandidate");
            const prefNum = pref ? Number(pref) : null;
            const match = prefNum ? res.data.candidates.find(c => c.candidateId === prefNum) : null;
            if (match) {
              setSelected(match.candidateId);
              const idx = res.data.candidates.findIndex(c => c.candidateId === match.candidateId);
              if (idx !== -1) setSpecCandidateIdx(idx);
            } else if (!selected) {
              setSelected(res.data.candidates[0].candidateId);
            }
          }
        } catch (err) {
          console.error("Failed to load election data:", err);
        }
      };

      fetchElectionData();
    }
  }, [loadingConfig, config]);

  const isActive = electionData?.election?.isActive ?? false;
  const candidates = electionData?.candidates || [];
  const selectedCandidateObj = candidates.find((c) => c.candidateId === selected);
  const activeSpecCandidate = candidates[specCandidateIdx] || candidates[0];

  const handlePreSubmit = (e) => {
    if (e) e.preventDefault();
    if (!selected) return showError("Please select a candidate.");
    if (!isActive) return showError("Voting is currently closed.");
    soundFx.playCardScan();
    setConfirmModalOpen(true);
  };

  const handleConfirmVote = async () => {
    setConfirmModalOpen(false);
    setSubmitLoading(true);
    soundFx.playClick(1300, 0.04);
    showInfo("Broadcasting cryptographic vote to Hedera consensus node...");

    try {
      const res = await axios.post(
        `${config.backendUrl}/castVote`,
        { candidateId: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const rawTxId = res.data.transactionId;
      let formattedTxId = rawTxId;
      if (rawTxId.includes('@')) {
        const [accountId, timestamp] = rawTxId.split('@');
        formattedTxId = accountId + '-' + timestamp.replace('.', '-');
      } else if (rawTxId.includes('.')) {
        formattedTxId = rawTxId.replace(/\./g, '-');
      }
      setVotedTxId(formattedTxId);
      soundFx.playCardScan();
      showSuccess("Vote timestamped & verified on Hedera Consensus Service!");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to submit ballot.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCopyTx = () => {
    if (votedTxId) {
      soundFx.playClick(1000, 0.02);
      navigator.clipboard.writeText(votedTxId);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2500);
      showSuccess("Transaction ID copied to clipboard!");
    }
  };

  const handleLogout = () => {
    soundFx.playClick(750, 0.02);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authVoterId");
    localStorage.removeItem("authRole");
    onLogout();
  };

  if (loadingConfig || !electionData) {
    return (
      <div className="voter-loading-shell">
        <div className="md-loading-spinner" />
        <h2>Entering secure voting booth…</h2>
        <p>Connecting to Hedera consensus node and verifying ballot credentials</p>
      </div>
    );
  }

  // If in tree mode, render the full-screen interactive node graph with candidate selector
  if (viewMode === "tree") {
    return (
      <InteractiveTreeCatalog
        onBackToHome={() => changeView("reticle")}
        onOpenBallot={() => {
          changeView("reticle");
          handlePreSubmit();
        }}
      />
    );
  }

  return (
    <div className="studio-shell">
      {/* ── TOP HEADER (Exact dmcg.co style) ── */}
      <header className="studio-header">
        <nav className="studio-nav-left" aria-label="Secondary navigation">
          {onBackToManifesto && (
            <button
              type="button"
              className="studio-nav-link"
              onClick={() => {
                soundFx.playClick(900, 0.02);
                onBackToManifesto();
              }}
            >
              ← Election Manifesto
            </button>
          )}
          <span className="chip-id-pill" style={{ margin: 0, padding: "4px 12px" }}>
            <span className="chip-square" />
            <span className="chip-label">BALLOT</span>
            <span className="chip-code">0.0.10697996</span>
          </span>
        </nav>

        {/* Stacked Center Office Brand */}
        <div
          className="studio-brand-center"
          onClick={() => changeView("reticle")}
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
            className={`studio-pill-btn ${viewMode === "reticle" ? "active" : ""}`}
            onClick={() => changeView("reticle")}
          >
            Reticle
          </button>
          <button
            type="button"
            className={`studio-pill-btn ${viewMode === "spec" ? "active" : ""}`}
            onClick={() => changeView("spec")}
          >
            Candidate Specs
          </button>
          <button
            type="button"
            className={`studio-pill-btn ${viewMode === "tree" ? "active" : ""}`}
            onClick={() => changeView("tree")}
          >
            Consensus Web
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
            onClick={handleLogout}
          >
            Exit Booth ↗
          </button>
        </div>
      </header>

      {/* ── STAGE MAIN AREA ── */}
      <main className="studio-stage" style={{ minHeight: "640px" }}>
        <AnimatePresence mode="wait">
          {/* ── MODE 1: RETICLE / NFC BALLOT CARD (Screenshot 1 Inspired) ── */}
          {viewMode === "reticle" && (
            <motion.div
              key="voter-reticle-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "640px" }}
            >
              {/* Electric Neon Green Viewfinder Reticle */}
              <div className="reticle-wrapper" style={{ marginBottom: "20px" }}>
                <div className="reticle-bracket reticle-tl" />
                <div className="reticle-bracket reticle-tr" />
                <div className="reticle-bracket reticle-bl" />
                <div className="reticle-bracket reticle-br" />

                {/* Dark Floating Cryptographic Card */}
                <div
                  className="nfc-card"
                  onClick={() => {
                    if (!votedTxId) handlePreSubmit();
                  }}
                  title={votedTxId ? "Ballot confirmed on ledger" : "Click to review and submit ballot"}
                >
                  <svg className="nfc-rings" viewBox="0 0 320 320">
                    <circle cx="160" cy="160" r="140" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="160" cy="160" r="110" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="160" cy="160" r="80" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="160" cy="160" r="50" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="160" cy="160" r="20" fill="none" stroke="white" strokeWidth="1" />
                  </svg>

                  <div className="nfc-card-header">
                    <span className="nfc-signal">{votedTxId ? "SEALED ✓" : "NFC )))"}</span>
                  </div>

                  {/* Pulsing Green Orbit Dots */}
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
                    {votedTxId ? (
                      <div className="nfc-card-title">
                        Ballot<br />
                        Recorded<br />
                        on<br />
                        <em>Hedera HCS®</em>
                      </div>
                    ) : (
                      <div className="nfc-card-title">
                        {selectedCandidateObj ? selectedCandidateObj.name : "Select"}<br />
                        <em>{selectedCandidateObj ? selectedCandidateObj.party : "Candidate"}</em>
                      </div>
                    )}
                  </div>

                  <div className="nfc-card-footer">
                    <div className="nfc-badge-pill">
                      {votedTxId ? "VERIFIED" : "SELECTION"}{" "}
                      <span>{selectedCandidateObj ? `#0${selectedCandidateObj.candidateId}` : "BALLOT"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monospace Chip Indicator */}
              <div className="chip-id-pill" style={{ marginBottom: "28px" }}>
                <span className="chip-square" />
                <span className="chip-label">BALLOT ID</span>
                <span className="chip-code">
                  {votedTxId ? `${votedTxId.slice(0, 20)}…` : "HCS-0.0.10697996-READY"}
                </span>
              </div>

              {/* Post-Vote Confirmation Card */}
              {votedTxId ? (
                <div className="vote-confirmation" style={{ width: "100%", maxWidth: "560px" }}>
                  <div className="vote-confirmation-badge">
                    <span>✓</span> Cryptographic Vote Confirmed on Ledger
                  </div>
                  <p>Your ballot has been hashed and permanently anchored to the Hedera testnet consensus topic.</p>

                  <div className="vote-confirmation-tx">
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>Consensus Transaction Receipt:</span>
                    <code>{votedTxId}</code>
                    <div className="vote-confirmation-links">
                      <button type="button" onClick={handleCopyTx}>
                        {copiedTx ? "✓ Copied" : "📋 Copy Transaction ID"}
                      </button>
                      <span>•</span>
                      <a
                        href={`https://hashscan.io/testnet/transaction/${votedTxId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Audit on HashScan Explorer ↗
                      </a>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {onBackToManifesto && (
                      <button
                        type="button"
                        className="studio-pill-btn"
                        onClick={onBackToManifesto}
                      >
                        ← Return to Election Manifesto
                      </button>
                    )}
                    <button
                      type="button"
                      className="studio-pill-btn active"
                      onClick={handleLogout}
                    >
                      Safely Exit Voting Booth ↗
                    </button>
                  </div>
                </div>
              ) : !isActive ? (
                <div className="voting-disabled" style={{ width: "100%" }}>
                  Voting is currently inactive. Please check with election administrators.
                </div>
              ) : (
                /* Candidate Selection List */
                <form onSubmit={handlePreSubmit} style={{ width: "100%" }}>
                  <div className="candidate-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {candidates.map((c, index) => {
                      const isSelected = selected === c.candidateId;
                      return (
                        <label
                          key={c.candidateId}
                          className={`candidate-option ${isSelected ? "selected" : ""}`}
                          onClick={() => soundFx.playClick(1000, 0.02)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px 20px",
                            background: isSelected ? "#f2f8f5" : "#ffffff",
                            border: `1.5px solid ${isSelected ? "var(--studio-black)" : "rgba(0,0,0,0.08)"}`,
                            borderRadius: "14px",
                            cursor: "pointer",
                            transition: "all 0.18s ease"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <input
                              type="radio"
                              name="candidate"
                              value={c.candidateId}
                              checked={isSelected}
                              onChange={(e) => setSelected(e.target.value)}
                              disabled={submitLoading || votedTxId}
                              style={{ accentColor: "#000" }}
                            />
                            <span
                              style={{
                                fontFamily: "var(--studio-mono)",
                                fontSize: "11px",
                                fontWeight: "700",
                                color: isSelected ? "#111" : "#888"
                              }}
                            >
                              0{index + 1}
                            </span>
                            <div>
                              <strong style={{ fontSize: "14px", color: "var(--studio-black)" }}>{c.name}</strong>
                              <div style={{ fontSize: "11px", color: "var(--studio-gray-mid)", marginTop: "2px" }}>
                                {c.party} {c.isIncumbent && " · (Incumbent)"}
                              </div>
                            </div>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "700", color: isSelected ? "#111" : "#bbb" }}>
                            {isSelected ? "●" : "→"}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Signature Black Pill CTA Button (Screenshot 2 style) */}
                  <button
                    type="submit"
                    className="spec-cta-pill"
                    disabled={!selected || submitLoading}
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      padding: "14px 24px",
                      marginTop: "20px",
                      fontSize: "13px"
                    }}
                  >
                    <span>{submitLoading ? "Writing to ledger..." : "Review & Submit Cryptographic Ballot"}</span>
                    <span className="cta-price" style={{ color: "var(--studio-neon-green)" }}>
                      {selected ? `#0${selected}` : "Select"} ↗
                    </span>
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {/* ── MODE 2: CANDIDATE SPEC SHOWCASE (Screenshot 2 Inspired) ── */}
          {viewMode === "spec" && activeSpecCandidate && (
            <motion.div
              key="voter-spec-view"
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
                  <div className="spec-feature">
                    <span className="spec-feature-title">Electoral Integrity</span>
                    <span className="spec-feature-copy">Audited on Hedera Consensus Service mirror node with timestamped public consensus.</span>
                  </div>
                  <div className="spec-feature">
                    <span className="spec-feature-title">Verified Promises</span>
                    <span className="spec-feature-copy">{activeSpecCandidate.tagline || "Full election manifesto published and verifiable on ledger."}</span>
                  </div>
                  <div className="spec-feature">
                    <span className="spec-feature-title">Campus Governance</span>
                    <span className="spec-feature-copy">Direct democratic accountability with immutable cryptographic balloting.</span>
                  </div>

                  <div className="spec-footer-note">
                    Official Student Council Election 2026. Real-time finality 3-5 sec on Hedera testnet.
                  </div>
                </div>

                {/* Center Column: 3D Hardware Ring / Candidate Emblem */}
                <div className="spec-center-col">
                  <div className="spec-object-wrapper">
                    <div className="spec-hardware-ring">
                      <div className="spec-ring-sensor" />
                      <div className="spec-hardware-inner">
                        0{activeSpecCandidate.candidateId}
                      </div>
                    </div>
                  </div>

                  {/* Carousel Controls */}
                  <div className="spec-slider-controls">
                    <button
                      type="button"
                      className="spec-slider-arrow"
                      onClick={() => {
                        soundFx.playClick(900, 0.02);
                        setSpecCandidateIdx((prev) => (prev - 1 + candidates.length) % candidates.length);
                      }}
                      aria-label="Previous candidate"
                    >
                      ‹
                    </button>
                    <div className="spec-dots-row">
                      {candidates.map((_, i) => (
                        <span
                          key={i}
                          className={`spec-dot-indicator ${i === specCandidateIdx ? "active" : ""}`}
                          onClick={() => {
                            soundFx.playClick(950, 0.02);
                            setSpecCandidateIdx(i);
                          }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="spec-slider-arrow"
                      onClick={() => {
                        soundFx.playClick(1100, 0.02);
                        setSpecCandidateIdx((prev) => (prev + 1) % candidates.length);
                      }}
                      aria-label="Next candidate"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Right Column: Candidate Specs & Select Button */}
                <div className="spec-right-col">
                  <div className="spec-right-title">{activeSpecCandidate.name}</div>
                  <div className="spec-right-copy">
                    {activeSpecCandidate.bio || "Student representative candidate running on verified platform commitments."}
                  </div>
                  <div className="spec-right-meta">
                    Party: <strong>{activeSpecCandidate.party}</strong>
                    {activeSpecCandidate.isIncumbent && " · Incumbent Record Available"}
                  </div>

                  <button
                    type="button"
                    className="spec-cta-pill"
                    onClick={() => {
                      setSelected(activeSpecCandidate.candidateId);
                      changeView("reticle");
                      handlePreSubmit();
                    }}
                  >
                    <span>Select & Cast Ballot</span>
                    <span className="cta-price">#0{activeSpecCandidate.candidateId}</span>
                  </button>
                </div>
              </div>

              <div className="spec-floating-tag">
                VoteLedger V2.4
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── BOTTOM FOOTER (dmcg.co style) ── */}
      <footer className="studio-footer">
        <div className="studio-footer-left">
          Hedera Consensus Service · End-to-end verifiable
        </div>

        {/* Center View Switcher */}
        <div className="studio-footer-center" role="toolbar" aria-label="View modes">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "reticle" ? "active" : ""}`}
            onClick={() => changeView("reticle")}
            title="Reticle Ballot View"
          >
            ⌖
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "spec" ? "active" : ""}`}
            onClick={() => changeView("spec")}
            title="Candidate Showcase Spec"
          >
            ⊞
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "tree" ? "active" : ""}`}
            onClick={() => changeView("tree")}
            title="Consensus Web Network"
          >
            ☍
          </button>
        </div>

        <div className="studio-footer-right">
          Topic 0.0.10697996 · 3-5s Finality
        </div>
      </footer>

      {/* ── CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {confirmModalOpen && selectedCandidateObj && (
          <motion.div
            className="vote-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmModalOpen(false)}
          >
            <motion.div
              className="vote-modal-card"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="vote-modal-header">
                <span className="vote-modal-icon">🗳️</span>
                <h3>Confirm Cryptographic Vote</h3>
                <p>Please review your selection before finalizing immutable ledger entry.</p>
              </div>

              <div className="vote-modal-nfc-card" aria-label={`Selected candidate ${selectedCandidateObj.name}`}>
                <svg className="vote-modal-nfc-rings" viewBox="0 0 320 320" aria-hidden="true">
                  <circle cx="160" cy="160" r="140" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="160" cy="160" r="110" fill="none" stroke="white" strokeWidth="1" />
                  <circle cx="160" cy="160" r="80" fill="none" stroke="white" strokeWidth="1" />
                  <circle cx="160" cy="160" r="50" fill="none" stroke="white" strokeWidth="1" />
                </svg>
                <div className="vote-modal-nfc-topline">
                  <span>VOTELEDGER</span>
                  <span>NFC )))</span>
                </div>
                <div className="vote-modal-nfc-mark" aria-hidden="true">✦</div>
                <div className="vote-modal-nfc-name">{selectedCandidateObj.name}</div>
                <div className="vote-modal-nfc-party">{selectedCandidateObj.party}</div>
                <div className="vote-modal-nfc-footer">
                  <span>SELECTION</span>
                  <strong>#{String(selectedCandidateObj.candidateId).padStart(2, "0")}</strong>
                </div>
              </div>

              <div className="vote-modal-candidate-summary">
                <div className="vote-modal-candidate-label">Selected Candidate:</div>
                <div className="vote-modal-candidate-name">{selectedCandidateObj.name}</div>
                <div className="vote-modal-candidate-party">{selectedCandidateObj.party}</div>
                {selectedCandidateObj.isIncumbent && (
                  <span className="incumbent-pill">Incumbent Representative</span>
                )}
              </div>

              <div className="vote-modal-warning">
                <strong>⚠️ Permanent Ledger Write:</strong> Your vote will be cryptographically hashed and permanently written to the Hedera testnet consensus topic. It cannot be altered or re-cast.
              </div>

              <div className="vote-modal-actions">
                <button
                  type="button"
                  className="studio-pill-btn"
                  onClick={() => setConfirmModalOpen(false)}
                  disabled={submitLoading}
                  style={{ flex: 1, justifyContent: "center", padding: "12px" }}
                >
                  Change Selection
                </button>
                <button
                  type="button"
                  className="spec-cta-pill"
                  onClick={handleConfirmVote}
                  disabled={submitLoading}
                  style={{ flex: 1, justifyContent: "center", margin: 0, padding: "12px" }}
                >
                  <span>{submitLoading ? "Writing..." : "Confirm & Sign Ballot"}</span>
                  <span className="cta-price" style={{ color: "var(--studio-neon-green)" }}>↗</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default VoterBooth;
