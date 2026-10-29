import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundFx } from "../utils/soundEffects";
import { InteractiveTreeCatalog } from "./InteractiveTreeCatalog";
import "./ManifestoDashboard.css";
import "./StudioAesthetic.css";
import { useErrorToast, useWarningToast } from "./Toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const CATEGORY_ICONS = {
  "Academic Excellence": "📚",
  "Library and Learning Resources": "🏛️",
  "Campus Infrastructure": "🏗️",
  "Wi-Fi and Digital Facilities": "📡",
  "Sports and Gym Facilities": "🏋️",
  "Student Clubs and Cultural Events": "🎭",
  "Student Safety and Anti-Ragging": "🛡️",
  "Transport and Hostel Facilities": "🚌",
  "Canteen Food Quality and Affordability": "🍽️",
  "Mental Wellbeing and Student Support": "💚",
  "Internship, Placement and Career Development": "💼",
  "Student Grievances and Transparency": "⚖️",
  "Accessibility and Inclusive Campus": "♿",
  "Environment and Sustainability": "🌱",
};

const STATUS_CONFIG = {
  "Completed": { color: "#059669", bg: "#d1fae5", label: "✓ Completed" },
  "Partially Completed": { color: "#b45309", bg: "#fef3c7", label: "◑ Partial" },
  "In Progress": { color: "#3d6b5d", bg: "#e6f0ec", label: "⟳ In Progress" },
  "Not Started": { color: "#6b7280", bg: "#f3f4f6", label: "○ Not Started" },
  "Unable to Verify": { color: "#7c3aed", bg: "#ede9fe", label: "? Unverified" },
  "Proposed": { color: "#0369a1", bg: "#e0f2fe", label: "→ Proposed" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Proposed"];
  return (
    <span style={{
      display: "inline-block",
      background: cfg.bg,
      color: cfg.color,
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: ".04em",
      whiteSpace: "nowrap",
    }}>{cfg.label}</span>
  );
}

function Countdown({ deadline }) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = new Date(deadline) - Date.now();
      if (diff <= 0) { setTimeLeft("Voting Closed"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [deadline]);
  return <span className="md-countdown-value">{timeLeft}</span>;
}

// ─── SECTION A: ELECTION OVERVIEW (HERO BANNER) ──────────────────────────────
function ElectionOverview({ election, candidates, voterStatus, onProceedToVote }) {
  const isActive = election?.isActive;
  const totalCandidates = candidates?.length || 0;
  const incumbents = candidates?.filter(c => c.isIncumbent).length || 0;

  return (
    <motion.section
      className="md-hero-banner"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="md-hero-ambient-circle" />

      <div className="md-hero-topline">
        <div className="md-hero-brand-mark">V</div>
        <div className="md-hero-eyebrow">
          Hedera Consensus Service · Official Manifesto & Integrity Portal · {election?.academicYear || "2025–2026"}
        </div>
      </div>

      <div className="md-hero-grid">
        <div>
          <h1 className="md-hero-title">
            {election?.institutionName || "Apex Institute of Technology"}<br />
            <em>Student Council Election</em>
          </h1>
          <p className="md-hero-desc">
            Explore cryptographic candidate manifestos, compare verified past track records against 2026 commitments, and verify tamper-proof consensus records before casting your vote.
          </p>

          <div className="md-hero-meta-row" style={{ marginBottom: 24 }}>
            <span className="md-hero-pill">📅 Academic Year {election?.academicYear || "2025–2026"}</span>
            <span className="md-hero-pill">🗳️ {election?.electionPhase || "Official Voting Phase"}</span>
            <span className={`md-hero-pill ${isActive ? "md-pill-open" : ""}`}>
              <span className="md-live-dot" style={{ marginRight: 6 }} />
              {isActive ? "Hedera Consensus Live · Voting Open" : "Voting Closed"}
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <button
              type="button"
              className="md-hero-cta"
              onClick={() => {
                soundFx.playCardScan();
                onProceedToVote && onProceedToVote();
              }}
            >
              <span>Proceed to Cast Ballot</span>
              <span className="md-hero-cta-arrow">↗</span>
            </button>
            <a
              href="#section-compare"
              className="md-hero-secondary-btn"
              onClick={(e) => {
                e.preventDefault();
                soundFx.playClick(900, 0.02);
                document.getElementById("section-compare")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Compare Manifestos ↓
            </a>
          </div>
        </div>

        <div className="md-hero-stats-col">
          <div className="md-hero-stat-card">
            <div className="md-hero-stat-val">{totalCandidates}</div>
            <div className="md-hero-stat-lbl">Certified Candidates</div>
          </div>
          <div className="md-hero-stat-card">
            <div className="md-hero-stat-val">{incumbents}</div>
            <div className="md-hero-stat-lbl">Incumbent Record</div>
          </div>
          <div className="md-hero-stat-card">
            <div className="md-hero-stat-val" style={{ fontSize: 20 }}>0.0.10697996</div>
            <div className="md-hero-stat-lbl">HCS Mirror Topic</div>
          </div>
          <div className="md-hero-stat-card">
            <div className="md-hero-stat-val" style={{ fontSize: 20 }}>100%</div>
            <div className="md-hero-stat-lbl">Ledger Immutability</div>
          </div>

          {election?.votingDeadline && (
            <div className="md-hero-stat-card md-hero-timer-card">
              <div className="md-hero-stat-lbl" style={{ marginBottom: 6 }}>Voting Closes In</div>
              <Countdown deadline={election.votingDeadline} />
            </div>
          )}
        </div>
      </div>

      {voterStatus && (
        <div className={`md-hero-voter-bar ${voterStatus.hasVoted ? "voted" : "eligible"}`}>
          {voterStatus.hasVoted
            ? `✅ Cryptographic receipt confirmed for ${voterStatus.name}. Your vote has been permanently recorded on Hedera Consensus Service.`
            : `🗳️ Welcome, ${voterStatus.name}. You are verified and eligible to cast your ballot. Review candidate commitments below.`}
        </div>
      )}
    </motion.section>
  );
}

// ─── SECTION B: CANDIDATE PROFILE CARDS ──────────────────────────────────────
function CandidateCards({ candidates, onSelectManifesto, onProceedToVote }) {
  return (
    <section className="md-section">
      <div className="md-section-header">
        <span className="md-section-eyebrow">Candidates</span>
        <h2 className="md-section-title">Meet the Candidates</h2>
        <p className="md-section-sub">Click "View Full Manifesto" to explore each candidate's detailed promises and, where applicable, their verified track record.</p>
      </div>
      <div className="md-candidate-grid">
        {candidates.map((c, i) => (
          <CandidateCard
            key={c.candidateId}
            candidate={c}
            index={i}
            onSelectManifesto={onSelectManifesto}
            onProceedToVote={onProceedToVote}
          />
        ))}
      </div>
    </section>
  );
}

function CandidateCard({ candidate: c, index, onSelectManifesto, onProceedToVote }) {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = !imgError && (c.avatarUrl || (c.avatarIpfs ? `https://gateway.pinata.cloud/ipfs/${c.avatarIpfs}` : null));
  const initials = c.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#121212", "#3d6b5d", "#475569"];

  return (
    <motion.div
      className="md-candidate-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      <div>
        {c.isIncumbent && <div className="md-incumbent-ribbon" style={{ marginBottom: 12 }}>Re-election Bid · Incumbent</div>}
        <div className="md-candidate-card-top">
          <div className="md-avatar" style={{ background: colors[index % colors.length] }}>
            {avatarUrl
              ? <img src={avatarUrl} alt={c.name} onError={() => setImgError(true)} />
              : <span>{initials}</span>}
          </div>
          <div className="md-candidate-identity">
            <h3 className="md-candidate-name">{c.name}</h3>
            <div className="md-candidate-party">{c.party}</div>
            <div className="md-candidate-dept">{c.department} · {c.year}</div>
            <div className="md-candidate-position">{c.position}</div>
          </div>
        </div>
        {c.tagline && <blockquote className="md-tagline">"{c.tagline}"</blockquote>}
        {c.bio && <p className="md-bio-snippet">{c.bio.slice(0, 220)}{c.bio.length > 220 ? "…" : ""}</p>}
        {c.priorities && c.priorities.length > 0 && (
          <div className="md-priorities">
            <div className="md-priorities-label">Top Priorities</div>
            <ul className="md-priorities-list">
              {c.priorities.slice(0, 3).map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="md-card-actions" style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
        <button
          className="md-btn-primary"
          onClick={() => {
            soundFx.playClick(900, 0.02);
            onSelectManifesto(c);
          }}
        >
          View Full Manifesto →
        </button>
        <button
          className="md-btn-primary"
          style={{
            background: "#0f1d3a",
            boxShadow: "0 4px 12px rgba(15, 29, 58, 0.2)"
          }}
          onClick={() => {
            soundFx.playCardScan();
            sessionStorage.setItem("preferredCandidate", c.candidateId);
            onProceedToVote && onProceedToVote(c.candidateId);
          }}
        >
          Vote #0{c.candidateId} ↗
        </button>
      </div>
    </motion.div>
  );
}

function CandidateJourney({ candidate }) {
  const milestones = candidate.timelineMilestones || [];
  const completed = milestones.filter(m => m.status === "Completed").length;
  const progress = milestones.length ? Math.round((completed / milestones.length) * 100) : 0;

  if (!milestones.length) return null;

  return (
    <section className="md-candidate-journey" aria-labelledby="candidate-journey-title">
      <div className="md-journey-header">
        <div>
          <span className="md-section-eyebrow">Delivery record</span>
          <h3 id="candidate-journey-title">What happened, and when</h3>
          <p>Milestones are ordered from the first commitment to the latest documented outcome.</p>
        </div>
        <div className="md-journey-score">
          <strong>{progress}%</strong>
          <span>milestones complete</span>
        </div>
      </div>

      <div className="md-journey-progress" aria-label={`${progress}% of milestones completed`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <ol className="md-journey-track">
        {milestones.map((milestone, index) => (
          <li
            key={`${milestone.title}-${index}`}
            className={`md-journey-node ${milestone.status === "Completed" ? "is-complete" : "is-current"}`}
          >
            <span className="md-journey-marker" aria-hidden="true">{milestone.status === "Completed" ? "✓" : String(index + 1).padStart(2, "0")}</span>
            <div className="md-journey-card">
              <span className="md-journey-date">{milestone.dateOrPeriod}</span>
              <strong>{milestone.title}</strong>
              <p>{milestone.description}</p>
              <StatusBadge status={milestone.status} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ─── SECTION C+D: FULL CANDIDATE MANIFESTO & PERFORMANCE REPORT ──────────────
function CandidateManifestoView({ candidate, evidence, onBack, onProceedToVote }) {
  const [activeTab, setActiveTab] = useState("manifesto");
  const [expandedPromise, setExpandedPromise] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", ...new Set((candidate.manifesto || []).map(p => p.category))];
  const filteredManifesto = filterCategory === "All"
    ? (candidate.manifesto || [])
    : (candidate.manifesto || []).filter(p => p.category === filterCategory);

  const perfRecords = candidate.performanceRecords || [];
  const completedCount = perfRecords.filter(r => r.status === "Completed").length;
  const partialCount = perfRecords.filter(r => r.status === "Partially Completed").length;
  const inProgressCount = perfRecords.filter(r => r.status === "In Progress").length;
  const notStartedCount = perfRecords.filter(r => r.status === "Not Started").length;

  const initials = candidate.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="md-manifesto-view">
      <button className="md-back-btn" onClick={onBack}>← Back to All Candidates</button>

      {/* Candidate hero */}
      <div className="md-manifesto-hero" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div className="md-manifesto-avatar">{initials}</div>
          <div>
            <h2 className="md-manifesto-cname">{candidate.name}</h2>
            <div className="md-manifesto-party">{candidate.party}</div>
            <div className="md-manifesto-meta">{candidate.position} · {candidate.department} · {candidate.year}</div>
            {candidate.isIncumbent && (
              <span className="md-incumbent-tag">📋 Incumbent — Previous Term Performance Available</span>
            )}
          </div>
        </div>
        {onProceedToVote && (
          <button
            type="button"
            className="md-btn-primary"
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
            onClick={() => {
              soundFx.playCardScan();
              sessionStorage.setItem("preferredCandidate", candidate.candidateId);
              onProceedToVote(candidate.candidateId);
            }}
          >
            <span>Proceed to Vote for {candidate.name.split(" ")[0]}</span>
            <span>#0{candidate.candidateId} ↗</span>
          </button>
        )}
      </div>

      {/* Bio & Experience */}
      {candidate.bio && (
        <div className="md-bio-block">
          <h4>About {candidate.name.split(" ")[0]}</h4>
          <p>{candidate.bio}</p>
          {candidate.experience && candidate.experience.length > 0 && (
            <>
              <h4 style={{ marginTop: 16 }}>Leadership Experience</h4>
              <ul className="md-exp-list">
                {candidate.experience.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </>
          )}
        </div>
      )}

      <CandidateJourney candidate={candidate} />

      {/* Tabs */}
      <div className="md-tab-bar">
        <button
          className={`md-tab ${activeTab === "manifesto" ? "md-tab-active" : ""}`}
          onClick={() => setActiveTab("manifesto")}
        >
          📋 Full Manifesto ({(candidate.manifesto || []).length} Promises)
        </button>
        {candidate.isIncumbent && (
          <button
            className={`md-tab ${activeTab === "performance" ? "md-tab-active" : ""}`}
            onClick={() => setActiveTab("performance")}
          >
            📊 Previous Term Report ({perfRecords.length} Promises Tracked)
          </button>
        )}
        <button
          className={`md-tab ${activeTab === "timeline" ? "md-tab-active" : ""}`}
          onClick={() => setActiveTab("timeline")}
        >
          📅 Timeline
        </button>
      </div>

      {/* MANIFESTO TAB */}
      {activeTab === "manifesto" && (
        <div>
          <div className="md-filter-bar">
            <span className="md-filter-label">Filter by category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                className={`md-filter-btn ${filterCategory === cat ? "md-filter-active" : ""}`}
                onClick={() => setFilterCategory(cat)}
              >
                {CATEGORY_ICONS[cat] || "📌"} {cat}
              </button>
            ))}
          </div>
          <div className="md-promises-list">
            {filteredManifesto.map((promise, i) => (
              <PromiseCard
                key={promise.id || i}
                promise={promise}
                expanded={expandedPromise === (promise.id || i)}
                onToggle={() => setExpandedPromise(expandedPromise === (promise.id || i) ? null : (promise.id || i))}
              />
            ))}
          </div>
        </div>
      )}

      {/* PERFORMANCE TAB */}
      {activeTab === "performance" && candidate.isIncumbent && (
        <div>
          <div className="md-perf-summary">
            <h3 className="md-perf-title">Previous Term: Promises vs. Performance</h3>
            <p className="md-perf-note">
              This section presents a review of {candidate.name.split(" ")[0]}'s commitments from the previous academic year and verified outcomes.
              Status labels are based on documented council records and official reports.
            </p>
            <div className="md-perf-scorecard">
              <div className="md-score-item md-score-complete">
                <span className="md-score-num">{completedCount}</span>
                <span className="md-score-lbl">Completed</span>
              </div>
              <div className="md-score-item md-score-partial">
                <span className="md-score-num">{partialCount}</span>
                <span className="md-score-lbl">Partial</span>
              </div>
              <div className="md-score-item md-score-progress">
                <span className="md-score-num">{inProgressCount}</span>
                <span className="md-score-lbl">In Progress</span>
              </div>
              <div className="md-score-item md-score-notstarted">
                <span className="md-score-num">{notStartedCount}</span>
                <span className="md-score-lbl">Not Started</span>
              </div>
            </div>
            <div className="md-perf-bar-wrap">
              {perfRecords.length > 0 && (
                <>
                  <div className="md-perf-bar-label">Promise Completion Breakdown ({perfRecords.length} total)</div>
                  <div className="md-perf-bar">
                    {completedCount > 0 && (
                      <div style={{ width: `${(completedCount / perfRecords.length) * 100}%`, background: "#059669" }} title="Completed" />
                    )}
                    {partialCount > 0 && (
                      <div style={{ width: `${(partialCount / perfRecords.length) * 100}%`, background: "#d97706" }} title="Partial" />
                    )}
                    {inProgressCount > 0 && (
                      <div style={{ width: `${(inProgressCount / perfRecords.length) * 100}%`, background: "#3d6b5d" }} title="In Progress" />
                    )}
                    {notStartedCount > 0 && (
                      <div style={{ width: `${(notStartedCount / perfRecords.length) * 100}%`, background: "#9ca3af" }} title="Not Started" />
                    )}
                  </div>
                  <div className="md-perf-bar-legend">
                    <span style={{ color: "#059669" }}>■ Completed</span>
                    <span style={{ color: "#d97706" }}>■ Partial</span>
                    <span style={{ color: "#3d6b5d" }}>■ In Progress</span>
                    <span style={{ color: "#9ca3af" }}>■ Not Started</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="md-promises-list">
            {perfRecords.map((rec, i) => (
              <PerformanceCard
                key={rec.id || i}
                record={rec}
                evidence={evidence}
                expanded={expandedPromise === `perf-${rec.id || i}`}
                onToggle={() => setExpandedPromise(expandedPromise === `perf-${rec.id || i}` ? null : `perf-${rec.id || i}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* TIMELINE TAB */}
      {activeTab === "timeline" && (
        <div className="md-timeline">
          {(candidate.timelineMilestones || []).length === 0 && (
            <p className="md-empty">No timeline data available for this candidate.</p>
          )}
          {(candidate.timelineMilestones || []).map((m, i) => (
            <div key={i} className={`md-timeline-item ${m.status === "Completed" ? "md-tl-done" : "md-tl-upcoming"}`}>
              <div className="md-tl-dot" />
              <div className="md-tl-content">
                <div className="md-tl-phase">{m.phase}</div>
                <div className="md-tl-title">{m.title}</div>
                <div className="md-tl-desc">{m.description}</div>
                <div className="md-tl-date">{m.dateOrPeriod}</div>
                <StatusBadge status={m.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PromiseCard({ promise, expanded, onToggle }) {
  return (
    <div className={`md-promise-card ${expanded ? "md-promise-expanded" : ""}`}>
      <button className="md-promise-header" onClick={onToggle} aria-expanded={expanded}>
        <div className="md-promise-header-left">
          <span className="md-promise-cat-icon">{CATEGORY_ICONS[promise.category] || "📌"}</span>
          <div>
            <div className="md-promise-category">{promise.category}</div>
            <div className="md-promise-title">{promise.title}</div>
          </div>
        </div>
        <div className="md-promise-header-right">
          <StatusBadge status={promise.status} />
          <span className="md-promise-chevron">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>
      {expanded && (
        <div className="md-promise-body">
          <div className="md-promise-grid">
            <div className="md-promise-field">
              <label>Current Problem</label>
              <p>{promise.currentProblem}</p>
            </div>
            <div className="md-promise-field">
              <label>Proposed Solution</label>
              <p>{promise.proposedSolution}</p>
            </div>
            <div className="md-promise-field">
              <label>Expected Benefit</label>
              <p>{promise.expectedBenefit}</p>
            </div>
            <div className="md-promise-field">
              <label>Target Timeline</label>
              <p>{promise.targetTimeline}</p>
            </div>
            {promise.implementationSteps && promise.implementationSteps.length > 0 && (
              <div className="md-promise-field md-full-width">
                <label>Implementation Steps</label>
                <ol className="md-steps">
                  {promise.implementationSteps.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            )}
            {promise.dependenciesAndBudget && (
              <div className="md-promise-field">
                <label>Dependencies &amp; Budget</label>
                <p>{promise.dependenciesAndBudget}</p>
              </div>
            )}
            {promise.measurableMetrics && (
              <div className="md-promise-field">
                <label>How Progress Will Be Measured</label>
                <p>{promise.measurableMetrics}</p>
              </div>
            )}
            {promise.evidenceRef && (
              <div className="md-promise-field md-evidence-ref">
                <label>Evidence Reference</label>
                <p>📎 {promise.evidenceRef}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PerformanceCard({ record, evidence, expanded, onToggle }) {
  const relatedEvidence = (evidence || []).filter(e =>
    e.relatedCategory === record.category || e.fileNumber?.includes(record.evidenceRef?.replace(/.*#/, "") || "@@")
  );

  return (
    <div className={`md-promise-card ${expanded ? "md-promise-expanded" : ""}`}>
      <button className="md-promise-header" onClick={onToggle} aria-expanded={expanded}>
        <div className="md-promise-header-left">
          <span className="md-promise-cat-icon">{CATEGORY_ICONS[record.category] || "📌"}</span>
          <div>
            <div className="md-promise-category">{record.category}</div>
            <div className="md-promise-title">{record.originalPromise}</div>
          </div>
        </div>
        <div className="md-promise-header-right">
          <StatusBadge status={record.status} />
          <span className="md-promise-chevron">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>
      {expanded && (
        <div className="md-promise-body">
          <div className="md-promise-grid">
            <div className="md-promise-field">
              <label>Original Promise</label>
              <p>{record.originalPromise}</p>
            </div>
            <div className="md-promise-field">
              <label>Action Taken</label>
              <p>{record.actionTaken}</p>
            </div>
            <div className="md-promise-field">
              <label>Actual Outcome</label>
              <p>{record.actualOutcome}</p>
            </div>
            <div className="md-promise-field">
              <label>Student Impact</label>
              <p>{record.studentImpact}</p>
            </div>
            {record.remainingWork && (
              <div className="md-promise-field">
                <label>Remaining Work</label>
                <p>{record.remainingWork}</p>
              </div>
            )}
            {record.delayExplanation && (
              <div className="md-promise-field">
                <label>Explanation for Delay/Status</label>
                <p>{record.delayExplanation}</p>
              </div>
            )}
            {record.evidenceRef && (
              <div className="md-promise-field md-evidence-ref">
                <label>Evidence Reference</label>
                <p>📎 {record.evidenceRef}</p>
              </div>
            )}
          </div>
          {relatedEvidence.length > 0 && (
            <div className="md-related-evidence">
              <label>📂 Related Verified Documents</label>
              {relatedEvidence.map((doc, i) => (
                <div key={i} className="md-evidence-mini">
                  <strong>{doc.title}</strong>
                  <span className="md-evidence-auth">{doc.issuingAuthority}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SECTION D: PREVIOUS LEADER PERFORMANCE (PROMISES VS PERFORMANCE) ────────
function PreviousTermDashboardSection({ candidates, evidence, onSelectManifesto }) {
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const incumbents = (candidates || []).filter(c => c.isIncumbent);
  const incumbent = incumbents[0] || null;
  const perfRecords = incumbent?.performanceRecords || [];

  const completedCount = perfRecords.filter(r => r.status === "Completed").length;
  const partialCount = perfRecords.filter(r => r.status === "Partially Completed").length;
  const inProgressCount = perfRecords.filter(r => r.status === "In Progress").length;
  const notStartedCount = perfRecords.filter(r => r.status === "Not Started").length;
  const unverifiedCount = perfRecords.filter(r => r.status === "Unable to Verify").length;

  const filteredRecords = filterStatus === "All"
    ? perfRecords
    : perfRecords.filter(r => r.status === filterStatus);

  return (
    <section className="md-section" id="section-performance">
      <div className="md-section-header">
        <span className="md-section-eyebrow">Accountability & Past Delivery</span>
        <h2 className="md-section-title">Previous Term: Promises vs Performance</h2>
        <p className="md-section-sub">
          Review the documented performance of the previous student administration.
          Verified achievements are strictly distinguished from unverified claims and future campaign proposals.
        </p>
      </div>

      {!incumbent || perfRecords.length === 0 ? (
        <div className="md-empty" style={{ background: "var(--md-bg-card)", border: "1px solid var(--md-border)", borderRadius: "var(--md-radius-lg)", padding: 48 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "var(--md-navy)", margin: "0 0 8px" }}>No verified performance data available.</p>
          <p style={{ fontSize: 13, color: "var(--md-muted)", margin: 0 }}>No previous term commitments have been filed or verified for this election cycle.</p>
        </div>
      ) : (
        <div className="md-perf-summary" style={{ padding: "32px", borderRadius: "var(--md-radius-lg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, fontFamily: "var(--md-font-mono)", color: "var(--md-gold)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>
                Previous Term Council Review (2024–2025)
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--md-navy)", margin: 0 }}>
                {incumbent.name} · {incumbent.party}
              </h3>
              <p style={{ fontSize: 13, color: "var(--md-muted)", margin: "4px 0 0" }}>
                Incumbent Contesting for Re-election: {incumbent.position} · {incumbent.department}
              </p>
            </div>
            {onSelectManifesto && (
              <button
                className="md-btn-primary"
                style={{ padding: "10px 18px", fontSize: 13 }}
                onClick={() => onSelectManifesto(incumbent)}
              >
                View Aarav's 2026 Manifesto →
              </button>
            )}
          </div>

          <p className="md-perf-note">
            The evaluations below reflect documented student council records, university works department work orders, and health center reports.
            Click any status filter or individual card to inspect root causes, remaining work, and supporting documentation.
          </p>

          <div className="md-perf-scorecard">
            <div
              className={`md-score-item md-score-complete ${filterStatus === "Completed" ? "md-score-active" : ""}`}
              onClick={() => setFilterStatus(filterStatus === "Completed" ? "All" : "Completed")}
              style={{ cursor: "pointer" }}
              title="Filter by Completed"
            >
              <span className="md-score-num">{completedCount}</span>
              <span className="md-score-lbl">Completed</span>
            </div>
            <div
              className={`md-score-item md-score-partial ${filterStatus === "Partially Completed" ? "md-score-active" : ""}`}
              onClick={() => setFilterStatus(filterStatus === "Partially Completed" ? "All" : "Partially Completed")}
              style={{ cursor: "pointer" }}
              title="Filter by Partially Completed"
            >
              <span className="md-score-num">{partialCount}</span>
              <span className="md-score-lbl">Partial</span>
            </div>
            <div
              className={`md-score-item md-score-progress ${filterStatus === "In Progress" ? "md-score-active" : ""}`}
              onClick={() => setFilterStatus(filterStatus === "In Progress" ? "All" : "In Progress")}
              style={{ cursor: "pointer" }}
              title="Filter by In Progress"
            >
              <span className="md-score-num">{inProgressCount}</span>
              <span className="md-score-lbl">In Progress</span>
            </div>
            <div
              className={`md-score-item md-score-notstarted ${filterStatus === "Not Started" ? "md-score-active" : ""}`}
              onClick={() => setFilterStatus(filterStatus === "Not Started" ? "All" : "Not Started")}
              style={{ cursor: "pointer" }}
              title="Filter by Not Started"
            >
              <span className="md-score-num">{notStartedCount}</span>
              <span className="md-score-lbl">Not Started</span>
            </div>
            {unverifiedCount > 0 && (
              <div
                className="md-score-item"
                style={{ background: "#ede9fe", color: "#7c3aed", cursor: "pointer" }}
                onClick={() => setFilterStatus(filterStatus === "Unable to Verify" ? "All" : "Unable to Verify")}
                title="Filter by Unable to Verify"
              >
                <span className="md-score-num">{unverifiedCount}</span>
                <span className="md-score-lbl">Unverified</span>
              </div>
            )}
          </div>

          <div className="md-perf-bar-wrap">
            <div className="md-perf-bar-label">
              Performance Completion Breakdown ({perfRecords.length} commitments tracked)
              {filterStatus !== "All" && ` · Showing: ${filterStatus}`}
            </div>
            <div className="md-perf-bar">
              {completedCount > 0 && (
                <div style={{ width: `${(completedCount / perfRecords.length) * 100}%`, background: "#059669" }} title={`Completed: ${completedCount}`} />
              )}
              {partialCount > 0 && (
                <div style={{ width: `${(partialCount / perfRecords.length) * 100}%`, background: "#d97706" }} title={`Partial: ${partialCount}`} />
              )}
              {inProgressCount > 0 && (
                <div style={{ width: `${(inProgressCount / perfRecords.length) * 100}%`, background: "#3d6b5d" }} title={`In Progress: ${inProgressCount}`} />
              )}
              {notStartedCount > 0 && (
                <div style={{ width: `${(notStartedCount / perfRecords.length) * 100}%`, background: "#9ca3af" }} title={`Not Started: ${notStartedCount}`} />
              )}
            </div>
            <div className="md-perf-bar-legend">
              <span style={{ color: "#059669" }}>■ {completedCount} Completed</span>
              <span style={{ color: "#d97706" }}>■ {partialCount} Partial</span>
              <span style={{ color: "#3d6b5d" }}>■ {inProgressCount} In Progress</span>
              <span style={{ color: "#9ca3af" }}>■ {notStartedCount} Not Started</span>
              {filterStatus !== "All" && (
                <button
                  style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--md-navy)", cursor: "pointer", textDecoration: "underline", fontSize: 11, fontWeight: 700 }}
                  onClick={() => setFilterStatus("All")}
                >
                  Show All ({perfRecords.length})
                </button>
              )}
            </div>
          </div>

          <div className="md-promises-list" style={{ marginTop: 24 }}>
            {filteredRecords.map((rec, i) => (
              <PerformanceCard
                key={rec.id || i}
                record={rec}
                evidence={evidence}
                expanded={expandedRecord === (rec.id || i)}
                onToggle={() => setExpandedRecord(expandedRecord === (rec.id || i) ? null : (rec.id || i))}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ─── SECTION E: CANDIDATE COMPARISON CENTER ──────────────────────────────────
function ComparisonCenter({ candidates, onProceedToVote }) {
  const [selected, setSelected] = useState(() => (candidates || []).slice(0, 2).map(c => c.candidateId));
  const [filterCat, setFilterCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMap, setExpandedMap] = useState({});

  const toggleSelect = (id) => {
    soundFx.playClick(900, 0.02);
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const toggleExpand = (key) => {
    soundFx.playClick(950, 0.015);
    setExpandedMap(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const compareCandidates = candidates.filter(c => selected.includes(c.candidateId));
  const allCategories = ["All", ...new Set(candidates.flatMap(c => (c.manifesto || []).map(p => p.category)))];

  const matchesSearch = (item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.proposedSolution && item.proposedSolution.toLowerCase().includes(q)) ||
      (item.problemStatement && item.problemStatement.toLowerCase().includes(q)) ||
      (item.measurableMetrics && item.measurableMetrics.toLowerCase().includes(q)) ||
      (item.targetTimeline && item.targetTimeline.toLowerCase().includes(q))
    );
  };

  return (
    <section className="md-section" id="section-compare">
      <div className="md-section-header">
        <span className="md-section-eyebrow">Compare Manifestos</span>
        <h2 className="md-section-title">Candidate Comparison Center</h2>
        <p className="md-section-sub">Select 2 or 3 candidates to compare their policy commitments side-by-side. Use live search or category filters to inspect specific priorities.</p>
      </div>

      <div className="md-compare-selector">
        {candidates.map(c => (
          <button
            key={c.candidateId}
            className={`md-compare-select-btn ${selected.includes(c.candidateId) ? "md-cmp-selected" : ""}`}
            onClick={() => toggleSelect(c.candidateId)}
            aria-pressed={selected.includes(c.candidateId)}
          >
            {selected.includes(c.candidateId) ? "✓ " : "+ "}{c.name.split(" ")[0]}
          </button>
        ))}
        {selected.length > 0 && (
          <button className="md-compare-clear" onClick={() => setSelected([])}>Clear</button>
        )}
      </div>

      {selected.length < 2 && (
        <div className="md-compare-prompt">
          Select at least 2 candidates above to begin comparison.
        </div>
      )}

      {compareCandidates.length >= 2 && (
        <>
          {/* Live Search and Keyword Filter */}
          <div className="md-compare-search-wrap" style={{ marginTop: 24 }}>
            <span className="md-compare-search-icon">🔍</span>
            <input
              type="text"
              className="md-compare-search-input"
              placeholder="Search promises and policy keywords (e.g. Wi-Fi, Food, Gym, Placement, Library, Solar, Healthcare)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: 14,
                  color: "var(--md-muted)",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="md-filter-bar" style={{ marginTop: 12, marginBottom: 20 }}>
            <span className="md-filter-label">Filter by:</span>
            {allCategories.map(cat => (
              <button
                key={cat}
                className={`md-filter-btn ${filterCat === cat ? "md-filter-active" : ""}`}
                onClick={() => {
                  soundFx.playClick(900, 0.02);
                  setFilterCat(cat);
                }}
              >
                {CATEGORY_ICONS[cat] || ""} {cat}
              </button>
            ))}
          </div>

          <div className="md-comparison-table-wrap">
            <table className="md-comparison-table">
              <thead>
                <tr>
                  <th className="md-cmp-aspect-col">
                    <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.85 }}>
                      Comparison Matrix
                    </span>
                  </th>
                  {compareCandidates.map(c => (
                    <th key={c.candidateId} className="md-cmp-cand-col">
                      <div className="md-cmp-cand-name">{c.name}</div>
                      <div className="md-cmp-cand-party">{c.party.split("(")[0].trim()}</div>
                      {c.isIncumbent && <div className="md-cmp-incumbent-tag">Incumbent</div>}
                      <button
                        type="button"
                        className="md-cmp-vote-btn"
                        style={{ marginTop: 10, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}
                        onClick={() => {
                          soundFx.playCardScan();
                          sessionStorage.setItem("preferredCandidate", c.candidateId);
                          onProceedToVote && onProceedToVote(c.candidateId);
                        }}
                      >
                        <span>Cast Ballot</span>
                        <span>#0{c.candidateId} ↗</span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="md-cmp-row-section">
                  <td colSpan={compareCandidates.length + 1}>🎯 Core Vision</td>
                </tr>
                <tr>
                  <td className="md-cmp-aspect">Tagline</td>
                  {compareCandidates.map(c => (
                    <td key={c.candidateId} className="md-cmp-cell">{c.tagline || "—"}</td>
                  ))}
                </tr>
                <tr>
                  <td className="md-cmp-aspect">Top Priorities</td>
                  {compareCandidates.map(c => (
                    <td key={c.candidateId} className="md-cmp-cell">
                      <ul className="md-cmp-list">
                        {(c.priorities || []).slice(0, 3).map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="md-cmp-aspect">Prior Experience</td>
                  {compareCandidates.map(c => (
                    <td key={c.candidateId} className="md-cmp-cell">
                      <ul className="md-cmp-list">
                        {(c.experience || []).slice(0, 2).map((e, i) => <li key={i}>{e}</li>)}
                      </ul>
                    </td>
                  ))}
                </tr>
                {compareCandidates.some(c => c.isIncumbent) && (
                  <>
                    <tr className="md-cmp-row-section">
                      <td colSpan={compareCandidates.length + 1}>📊 Previous Term Track Record</td>
                    </tr>
                    <tr>
                      <td className="md-cmp-aspect">Promises Kept</td>
                      {compareCandidates.map(c => {
                        const recs = c.performanceRecords || [];
                        const done = recs.filter(r => r.status === "Completed").length;
                        return (
                          <td key={c.candidateId} className="md-cmp-cell">
                            {c.isIncumbent
                              ? <><strong style={{ color: "#059669" }}>{done}/{recs.length}</strong> completed</>
                              : <span style={{ color: "#9ca3af" }}>No prior term</span>}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="md-cmp-aspect">Unfinished Commitments</td>
                      {compareCandidates.map(c => {
                        const recs = c.performanceRecords || [];
                        const pending = recs.filter(r => ["In Progress", "Not Started", "Partially Completed"].includes(r.status)).length;
                        return (
                          <td key={c.candidateId} className="md-cmp-cell">
                            {c.isIncumbent
                              ? <><strong style={{ color: "#d97706" }}>{pending}</strong> pending</>
                              : <span style={{ color: "#9ca3af" }}>N/A</span>}
                          </td>
                        );
                      })}
                    </tr>
                  </>
                )}

                <tr className="md-cmp-row-section">
                  <td colSpan={compareCandidates.length + 1}>
                    📋 Manifesto Proposals{filterCat !== "All" ? ` — ${filterCat}` : ""}{searchQuery ? ` (Filter: "${searchQuery}")` : ""}
                  </td>
                </tr>
                {/* Dynamically show filtered promises by category */}
                {(filterCat === "All" ? Object.keys(CATEGORY_ICONS) : [filterCat]).map(cat => {
                  const rows = compareCandidates.map(c =>
                    (c.manifesto || []).filter(p => p.category === cat && matchesSearch(p))
                  );
                  if (rows.every(r => r.length === 0)) return null;
                  return (
                    <tr key={cat}>
                      <td className="md-cmp-aspect">
                        <span style={{ fontSize: 18, marginRight: 6 }}>{CATEGORY_ICONS[cat] || "📌"}</span>
                        <span>{cat}</span>
                      </td>
                      {compareCandidates.map((c, ci) => (
                        <td key={c.candidateId} className="md-cmp-cell">
                          {rows[ci].length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              {rows[ci].map((proposal, pi) => {
                                const itemKey = `${c.candidateId}-${cat}-${pi}`;
                                const isExpanded = !!expandedMap[itemKey];
                                return (
                                  <div key={itemKey} className="md-cmp-proposal-card">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                      <StatusBadge status={proposal.status || "Proposed"} />
                                      {proposal.targetTimeline && (
                                        <span className="md-timeline-pill">🗓 {proposal.targetTimeline}</span>
                                      )}
                                    </div>
                                    <div className="md-cmp-proposal-title">
                                      {proposal.title}
                                    </div>
                                    <p className="md-cmp-proposal-desc">
                                      {proposal.proposedSolution?.slice(0, 160)}
                                      {proposal.proposedSolution?.length > 160 && !isExpanded ? "…" : ""}
                                    </p>
                                    {proposal.measurableMetrics && (
                                      <div className="md-cmp-badge-row">
                                        <span className="md-kpi-pill" title={proposal.measurableMetrics}>
                                          🎯 KPI: {proposal.measurableMetrics.slice(0, 52)}{proposal.measurableMetrics.length > 52 ? "…" : ""}
                                        </span>
                                      </div>
                                    )}

                                    <button
                                      type="button"
                                      className="md-cmp-expand-btn"
                                      onClick={() => toggleExpand(itemKey)}
                                      aria-expanded={isExpanded}
                                    >
                                      {isExpanded ? "▲ Hide implementation details" : "▼ View details & evidence"}
                                    </button>

                                    <AnimatePresence>
                                      {isExpanded && (
                                        <motion.div
                                          className="md-cmp-expanded-body"
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          {proposal.problemStatement && (
                                            <div style={{ marginBottom: 8 }}>
                                              <strong style={{ color: "var(--md-navy)", fontSize: 11.5, display: "block" }}>🚨 Problem Identified:</strong>
                                              <p style={{ margin: "2px 0 0", color: "#64748b" }}>{proposal.problemStatement}</p>
                                            </div>
                                          )}
                                          {proposal.proposedSolution?.length > 160 && (
                                            <div style={{ marginBottom: 8 }}>
                                              <strong style={{ color: "var(--md-navy)", fontSize: 11.5, display: "block" }}>💡 Complete Solution:</strong>
                                              <p style={{ margin: "2px 0 0", color: "#475569" }}>{proposal.proposedSolution}</p>
                                            </div>
                                          )}
                                          {proposal.implementationSteps && proposal.implementationSteps.length > 0 && (
                                            <div style={{ marginBottom: 8 }}>
                                              <strong style={{ color: "var(--md-navy)", fontSize: 11.5, display: "block" }}>🛠 Implementation Milestones:</strong>
                                              <ul style={{ margin: "4px 0 0", paddingLeft: 16, color: "#475569" }}>
                                                {proposal.implementationSteps.map((s, si) => <li key={si}>{s}</li>)}
                                              </ul>
                                            </div>
                                          )}
                                          {proposal.evidenceCitations && proposal.evidenceCitations.length > 0 && (
                                            <div>
                                              <strong style={{ color: "var(--md-navy)", fontSize: 11.5, display: "block" }}>🔗 Verifiable Evidence:</strong>
                                              <ul style={{ margin: "4px 0 0", paddingLeft: 16, color: "var(--md-blue)" }}>
                                                {proposal.evidenceCitations.map((ev, evi) => (
                                                  <li key={evi}>{typeof ev === "string" ? ev : (ev.title || "Document")}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>

                                    <button
                                      type="button"
                                      className="md-cmp-vote-btn"
                                      onClick={() => {
                                        soundFx.playCardScan();
                                        sessionStorage.setItem("preferredCandidate", c.candidateId);
                                        onProceedToVote && onProceedToVote(c.candidateId);
                                      }}
                                    >
                                      <span>Vote for {c.name.split(" ")[0]}</span>
                                      <span>#0{c.candidateId} ↗</span>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: 12.5, fontStyle: "italic" }}>
                              {searchQuery ? "No matching proposals" : "No proposal filed"}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md-compare-disclaimer">
            ⚖️ This comparison presents information as filed by each candidate. Past achievements are distinguished from future proposals.
            No candidate is ranked or recommended by this system.
          </div>
        </>
      )}
    </section>
  );
}

// ─── SECTION F: CAMPUS ISSUES ─────────────────────────────────────────────────
function CampusIssues({ issues }) {
  const [expanded, setExpanded] = useState(null);
  const urgencyColor = { Critical: "#dc2626", High: "#d97706", Medium: "#3d6b5d" };

  if (!issues || issues.length === 0) return null;

  return (
    <section className="md-section">
      <div className="md-section-header">
        <span className="md-section-eyebrow">Student Priorities</span>
        <h2 className="md-section-title">What Students Want to Improve</h2>
        <p className="md-section-sub">
          These are key campus challenges. See how each candidate proposes to address them.
          <strong> Data is labeled as demonstration.</strong>
        </p>
      </div>
      <div className="md-issues-list">
        {issues.map((issue, i) => (
          <div key={issue.issueId} className="md-issue-card">
            <button
              className="md-issue-header"
              onClick={() => setExpanded(expanded === issue.issueId ? null : issue.issueId)}
            >
              <div className="md-issue-header-left">
                <span className="md-issue-cat-icon">{CATEGORY_ICONS[issue.category] || "📌"}</span>
                <div>
                  <div className="md-issue-cat">{issue.category}</div>
                  <div className="md-issue-title">{issue.title}</div>
                </div>
              </div>
              <div className="md-issue-header-right">
                <span
                  className="md-urgency-badge"
                  style={{ background: urgencyColor[issue.urgency] + "20", color: urgencyColor[issue.urgency] }}
                >
                  {issue.urgency} Priority
                </span>
                <span className="md-promise-chevron">{expanded === issue.issueId ? "▲" : "▼"}</span>
              </div>
            </button>
            {expanded === issue.issueId && (
              <div className="md-issue-body">
                <p>{issue.description}</p>
                <div className="md-issue-status">
                  <strong>Current Status:</strong> {issue.currentStatus}
                </div>
                {issue.studentSentiment && (
                  <div className="md-sentiment-note">
                    📊 {issue.studentSentiment} <em>(Demo data — not collected from actual students)</em>
                  </div>
                )}
                <div className="md-solutions-grid">
                  {(issue.solutions || []).map((sol, si) => (
                    <div key={si} className="md-solution-card">
                      <div className="md-sol-candidate">{sol.candidateName}</div>
                      <div className="md-sol-approach">{sol.proposedApproach}</div>
                      {sol.timelineTarget && (
                        <div className="md-sol-timeline">🗓 {sol.timelineTarget}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── SECTION H: EVIDENCE & TRANSPARENCY ──────────────────────────────────────
function EvidenceArchive({ documents }) {
  const [expanded, setExpanded] = useState(null);
  const verificationColors = {
    "Officially Verified": { color: "#059669", bg: "#d1fae5" },
    "Council Record": { color: "#3d6b5d", bg: "#e6f0ec" },
    "Under Review": { color: "#d97706", bg: "#fef3c7" },
    "Self-Reported": { color: "#7c3aed", bg: "#ede9fe" },
  };

  if (!documents || documents.length === 0) return null;

  return (
    <section className="md-section">
      <div className="md-section-header">
        <span className="md-section-eyebrow">Transparency Archive</span>
        <h2 className="md-section-title">Evidence & Supporting Documents</h2>
        <p className="md-section-sub">
          Official notices, senate resolutions, audit reports, and institutional records that support or contextualize candidate claims.
          Documents are from the fictional demonstration scenario.
        </p>
      </div>
      <div className="md-evidence-grid">
        {documents.map((doc, i) => {
          const vCfg = verificationColors[doc.verificationStatus] || verificationColors["Council Record"];
          return (
            <div key={doc.docId} className="md-evidence-card">
              <div className="md-evidence-card-top">
                <span
                  className="md-verification-badge"
                  style={{ background: vCfg.bg, color: vCfg.color }}
                >
                  {doc.verificationStatus}
                </span>
                <span className="md-evidence-date">{doc.date}</span>
              </div>
              <h4 className="md-evidence-title">{doc.title}</h4>
              <div className="md-evidence-authority">🏛 {doc.issuingAuthority}</div>
              <p className="md-evidence-summary">{doc.summary}</p>
              <button
                className="md-evidence-expand-btn"
                onClick={() => setExpanded(expanded === doc.docId ? null : doc.docId)}
              >
                {expanded === doc.docId ? "▲ Collapse Details" : "▼ View Full Details"}
              </button>
              {expanded === doc.docId && (
                <div className="md-evidence-detail">
                  {doc.keyFindings && doc.keyFindings.length > 0 && (
                    <>
                      <strong>Key Findings:</strong>
                      <ul>
                        {doc.keyFindings.map((f, fi) => <li key={fi}>{f}</li>)}
                      </ul>
                    </>
                  )}
                  {doc.fileSnippet && (
                    <div className="md-file-snippet">
                      <strong>Document Excerpt:</strong>
                      <blockquote>{doc.fileSnippet}</blockquote>
                    </div>
                  )}
                  {doc.fileNumber && (
                    <div className="md-file-number">File Ref: {doc.fileNumber}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── SECTION I: VOTER DECISION CHECKLIST ─────────────────────────────────────
function VoterChecklist({ onProceed, voterStatus, isActive }) {
  const [checked, setChecked] = useState({});

  const items = [
    { id: "c1", text: "I have reviewed the manifestos of all candidates." },
    { id: "c2", text: "I have compared candidates' proposals on issues that matter to me." },
    { id: "c3", text: "I have reviewed the previous leader's verified performance record." },
    { id: "c4", text: "I understand which claims are officially verified and which are proposals." },
    { id: "c5", text: "I have considered the feasibility and expected student impact of each plan." },
  ];

  const allChecked = items.every(item => checked[item.id]);

  return (
    <section className="md-section md-checklist-section">
      <div className="md-section-header">
        <span className="md-section-eyebrow">Before You Vote</span>
        <h2 className="md-section-title">Informed Voter Checklist</h2>
        <p className="md-section-sub">
          This checklist helps you confirm you've reviewed the available information. It does not indicate or record any candidate preference.
        </p>
      </div>
      <div className="md-checklist">
        {items.map(item => (
          <label key={item.id} className={`md-check-item ${checked[item.id] ? "md-checked" : ""}`}>
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={e => setChecked(prev => ({ ...prev, [item.id]: e.target.checked }))}
            />
            <span className="md-check-box">{checked[item.id] ? "✓" : ""}</span>
            <span className="md-check-text">{item.text}</span>
          </label>
        ))}
      </div>
      <div className="md-proceed-zone">
        {voterStatus?.hasVoted ? (
          <div className="md-already-voted">
            ✅ You have already cast your vote. Your ballot has been recorded on the Hedera ledger.
          </div>
        ) : !isActive ? (
          <div className="md-voting-closed">
            ⚠️ Voting is currently closed. The election administrator must open voting before you can cast your ballot.
          </div>
        ) : (
          <>
            {!allChecked && (
              <p className="md-checklist-hint">
                Complete all checklist items above to enable the voting button. (Optional — you may also proceed directly.)
              </p>
            )}
            <button
              className="md-proceed-btn"
              onClick={onProceed}
              title="Proceed to the official ballot page"
            >
              🗳️ Proceed to Cast Your Vote →
            </button>
            <p className="md-proceed-note">
              Clicking this button navigates to the official ballot. No vote is recorded until you make a selection and confirm on the next page.
              Your ballot remains private. Duplicate voting is prevented by the backend.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

// ─── MAIN MANIFESTO DASHBOARD ─────────────────────────────────────────────────
export function ManifestoDashboard({ token, onLogout, onProceedToVote }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState(null);
  const [voterStatus, setVoterStatus] = useState(null);
  const [manifestoViewMode, setManifestoViewMode] = useState("portal"); // "portal" | "spec" | "tree"
  const [specCandidateIdx, setSpecCandidateIdx] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const showError = useErrorToast();
  const showWarning = useWarningToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/manifesto/overview`),
      ]);
      setData(overviewRes.data);
    } catch (err) {
      showError("Failed to load manifesto data. Please check that the backend is running.");
      console.error("Manifesto load error:", err);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchVoterStatus = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/api/voter/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVoterStatus(res.data);
    } catch (err) {
      showWarning("Could not fetch voter status: " + (err.response?.data?.error || err.message));
    }
  }, [token, showWarning]);

  useEffect(() => {
    fetchData();
    fetchVoterStatus();
  }, [fetchData, fetchVoterStatus]);

  const handleSelectManifesto = async (candidate) => {
    setSelectedCandidate(candidate);
    setActiveSection("manifesto-detail");
    try {
      const res = await axios.get(`${BACKEND_URL}/api/candidates/${candidate.candidateId}/manifesto`);
      setSelectedCandidateDetail(res.data);
    } catch (err) {
      setSelectedCandidateDetail({ candidate, relatedEvidence: [] });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToOverview = () => {
    setActiveSection("overview");
    setSelectedCandidate(null);
    setSelectedCandidateDetail(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authVoterId");
    localStorage.removeItem("authRole");
    onLogout();
  };

  const navSections = [
    { id: "overview", label: "Overview" },
    { id: "candidates", label: "Candidates" },
    { id: "performance", label: "Previous Term" },
    { id: "compare", label: "Compare" },
    { id: "issues", label: "Issues" },
    { id: "evidence", label: "Evidence" },
    { id: "vote", label: "Cast Vote" },
  ];

  const scrollToSection = (id) => {
    if (activeSection === "manifesto-detail") {
      handleBackToOverview();
      setTimeout(() => {
        const el = document.getElementById(`section-${id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      const el = document.getElementById(`section-${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (manifestoViewMode === "tree") {
    return (
      <InteractiveTreeCatalog
        onBackToHome={() => setManifestoViewMode("portal")}
        onOpenBallot={() => onProceedToVote && onProceedToVote()}
      />
    );
  }

  const activeCandidates = data?.candidates || [];
  const currentSpecCandidate = activeCandidates[specCandidateIdx] || activeCandidates[0];

  return (
    <div className="md-shell">
      {/* TOP NAV */}
      <header className="md-topnav" style={{ flexWrap: "wrap", height: "auto", minHeight: "68px", padding: "10px clamp(16px, 4vw, 40px)" }}>
        <div className="md-topnav-brand" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div className="chip-id-pill" style={{ margin: 0, padding: "3px 10px", fontSize: "11px" }}>
            <span className="chip-square" />
            <span className="chip-label">MANIFESTO</span>
          </div>
          <div className="studio-brand-center" style={{ position: "static", transform: "none", textAlign: "left" }}>
            <span className="line-1">The</span>
            <span className="line-2">Consensus Office</span>
            <span className="line-3">of VoteLedger</span>
          </div>
        </div>

        {manifestoViewMode === "portal" && (
          <nav className="md-topnav-links" aria-label="Dashboard sections">
            {navSections.map(s => (
              <button
                key={s.id}
                className={`md-nav-link ${activeSection === s.id ? "md-nav-link-active" : ""}`}
                onClick={() => {
                  soundFx.playClick(900, 0.02);
                  setActiveSection(s.id);
                  scrollToSection(s.id);
                }}
              >
                {s.label}
              </button>
            ))}
          </nav>
        )}

        <div className="md-topnav-actions" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            className={`studio-pill-btn ${manifestoViewMode === "portal" ? "active" : ""}`}
            onClick={() => {
              soundFx.playClick(850, 0.02);
              setManifestoViewMode("portal");
            }}
          >
            Portal
          </button>
          <button
            type="button"
            className={`studio-pill-btn ${manifestoViewMode === "spec" ? "active" : ""}`}
            onClick={() => {
              soundFx.playCardScan();
              setManifestoViewMode("spec");
            }}
          >
            3D Spec
          </button>
          <button
            type="button"
            className={`studio-pill-btn ${manifestoViewMode === "tree" ? "active" : ""}`}
            onClick={() => {
              soundFx.playClick(950, 0.02);
              setManifestoViewMode("tree");
            }}
          >
            Ledger Web
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

          {voterStatus && (
            <span className="md-voter-chip">
              {voterStatus.hasVoted ? "✅ Voted" : "🗳 Eligible"}
            </span>
          )}
          <button className="md-logout-btn" onClick={handleLogout}>
            Exit ↗
          </button>
        </div>
      </header>

      {/* ── 3D SPEC SHOWCASE MODE (Screenshot 2 Inspired) ── */}
      {manifestoViewMode === "spec" && currentSpecCandidate && (
        <div style={{ padding: "60px 20px", display: "flex", justifyContent: "center" }}>
          <div className="spec-card-container">
            <div className="spec-card-grid">
              <div className="spec-left-col">
                <div className="spec-mark">〰</div>
                <div className="spec-feature">
                  <span className="spec-feature-title">Candidate Department</span>
                  <span className="spec-feature-copy">{currentSpecCandidate.department} · {currentSpecCandidate.year}</span>
                </div>
                <div className="spec-feature">
                  <span className="spec-feature-title">Campaign Tagline</span>
                  <span className="spec-feature-copy">"{currentSpecCandidate.tagline || 'Transparent, accountable leadership for all students.'}"</span>
                </div>
                <div className="spec-feature">
                  <span className="spec-feature-title">Manifesto Commitments</span>
                  <span className="spec-feature-copy">{(currentSpecCandidate.manifesto || []).length} verified policy commitments published.</span>
                </div>

                <div className="spec-footer-note">
                  Student Council General Election 2026. Certified on Hedera Consensus Service mirror node.
                </div>
              </div>

              <div className="spec-center-col">
                <div className="spec-object-wrapper">
                  <div className="spec-hardware-ring">
                    <div className="spec-ring-sensor" />
                    <div className="spec-hardware-inner">
                      0{currentSpecCandidate.candidateId}
                    </div>
                  </div>
                </div>

                <div className="spec-slider-controls">
                  <button
                    type="button"
                    className="spec-slider-arrow"
                    onClick={() => {
                      soundFx.playClick(900, 0.02);
                      setSpecCandidateIdx((prev) => (prev - 1 + activeCandidates.length) % activeCandidates.length);
                    }}
                  >
                    ‹
                  </button>
                  <div className="spec-dots-row">
                    {activeCandidates.map((_, i) => (
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
                      setSpecCandidateIdx((prev) => (prev + 1) % activeCandidates.length);
                    }}
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="spec-right-col">
                <div className="spec-right-title">{currentSpecCandidate.name}</div>
                <div className="spec-right-copy">
                  {currentSpecCandidate.bio || "Candidate running for student council leadership."}
                </div>
                <div className="spec-right-meta">
                  Party: <strong>{currentSpecCandidate.party}</strong>
                  {currentSpecCandidate.isIncumbent && " · (Incumbent Record Available)"}
                </div>

                <button
                  type="button"
                  className="spec-cta-pill"
                  onClick={() => {
                    soundFx.playCardScan();
                    sessionStorage.setItem("preferredCandidate", currentSpecCandidate.candidateId);
                    onProceedToVote && onProceedToVote(currentSpecCandidate.candidateId);
                  }}
                >
                  <span>Proceed to Cast Ballot</span>
                  <span className="cta-price" style={{ color: "var(--studio-neon-green)" }}>
                    #0{currentSpecCandidate.candidateId} ↗
                  </span>
                </button>
              </div>
            </div>

            <div className="spec-floating-tag">
              VoteLedger V2.4
            </div>
          </div>
        </div>
      )}

      {/* CONTENT (When Portal mode is active) */}
      {manifestoViewMode === "portal" && (
        <main className="md-main">
          {loading && (
            <div className="md-loading">
              <div className="md-loading-spinner" />
              <p>Loading election manifesto data…</p>
            </div>
          )}

          {!loading && data && (
            <>
              {activeSection === "manifesto-detail" && selectedCandidateDetail ? (
                <div id="section-manifesto-detail">
                  <CandidateManifestoView
                    candidate={selectedCandidateDetail.candidate}
                    evidence={selectedCandidateDetail.relatedEvidence}
                    onBack={handleBackToOverview}
                    onProceedToVote={onProceedToVote}
                  />
                </div>
              ) : (
                <>
                  <div id="section-overview">
                    <ElectionOverview
                      election={data.election}
                      candidates={data.candidates}
                      voterStatus={voterStatus}
                      onProceedToVote={onProceedToVote}
                    />
                  </div>

                  <div id="section-candidates">
                    <CandidateCards
                      candidates={data.candidates}
                      onSelectManifesto={handleSelectManifesto}
                      onProceedToVote={onProceedToVote}
                    />
                  </div>

                  <div id="section-performance">
                    <PreviousTermDashboardSection
                      candidates={data.candidates}
                      evidence={data.evidenceDocs}
                      onSelectManifesto={handleSelectManifesto}
                    />
                  </div>

                  <div id="section-compare">
                    <ComparisonCenter
                      candidates={data.candidates}
                      onProceedToVote={onProceedToVote}
                    />
                  </div>

                  <div id="section-issues">
                    <CampusIssues issues={data.campusIssues} />
                  </div>

                  <div id="section-evidence">
                    <EvidenceArchive documents={data.evidenceDocs} />
                  </div>

                  <div id="section-vote">
                    <VoterChecklist
                      onProceed={onProceedToVote}
                      voterStatus={voterStatus}
                      isActive={data.election?.isActive}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </main>
      )}

      <footer className="md-footer">
        <span>VoteLedger · Election Manifesto Portal · Blockchain-Secured Voting</span>
        <span>⚠ All candidate profiles are demonstration data for illustrative purposes</span>
      </footer>
    </div>
  );
}
