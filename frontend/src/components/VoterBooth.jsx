import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export function VoterBooth({ token, onLogout }) {
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const [votedTxId, setVotedTxId] = useState("");
  const [electionData, setElectionData] = useState(null);
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

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

  // Determine if election is active
  const isActive = electionData?.election?.isActive ?? false;

  const handleVote = async (e) => {
    e.preventDefault();
    if (!selected) return setStatus("Please select a candidate.");
    if (!isActive) return setStatus("Voting is currently closed.");
    setSubmitLoading(true);
    setStatus("Submitting cryptographic vote...");

    try {
      const res = await axios.post(`${config.backendUrl}/castVote`,
        { candidateId: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const rawTxId = res.data.transactionId;
      // Format transactionId for HashScan: split at '@' and replace '.' in timestamp
      const [accountId, timestamp] = rawTxId.split('@');
      const formattedTxId = accountId + '-' + timestamp.replace('.', '-');
      setVotedTxId(formattedTxId);
      setStatus(`✅ Success! Your vote has been recorded.`);
    } catch (err) {
      setStatus(`❌ Error: ${err.response?.data?.error || "Failed to vote"}`);
    } finally {
      setSubmitLoading(false);
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
          <div className="ballot-meta"><span>01</span><span>01</span><div className="progress-line"><i /></div></div>
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
                      disabled={!isActive || submitLoading || votedTxId}
                    />
                    <span className="radio-mark" />
                    <span className="candidate-details">
                      {c.avatarIpfs ? (
                        <img
                          src={`https://gateway.pinata.cloud/ipfs/${c.avatarIpfs}`}
                          alt={c.name}
                          className="candidate-avatar"
                        />
                      ) : (
                        <span className="candidate-number">0{index + 1}</span>
                      )}
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
                disabled={!isActive || !selected || submitLoading || votedTxId}
              >
                {submitLoading ? "Submitting..." : "Submit encrypted vote"} <span aria-hidden="true">↗</span>
              </button>
            </form>
          )}
          {status && <div className={`status-message ${status.startsWith("✅") ? "success" : "error"}`}>{status}</div>}
          {votedTxId && (
            <div className="vote-confirmation">
              <p>Your vote has been successfully recorded on the ledger.</p>
              <p>
                Transaction ID: <code>{votedTxId}</code>{' '}
                <a
                  href={`https://hashscan.io/testnet/transaction/${votedTxId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on HashScan
                </a>
              </p>
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