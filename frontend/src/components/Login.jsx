import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { StudioHome } from "./StudioHome";
import { useErrorToast, useSuccessToast } from "./Toast";

export function Login({ onLogin }) {
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("voter");
  const [loading, setLoading] = useState(false);
  const [showStudio] = useState(true);

  const showError = useErrorToast();
  const showSuccess = useSuccessToast();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === "admin") {
      setVoterId("ADMIN001");
      setPassword("admin123");
    } else {
      setVoterId("VOTER001");
      setPassword("voter123");
    }
  };

  const handleQuickFill = (roleType) => {
    handleRoleChange(roleType);
    showSuccess(`Filled demo credentials for ${roleType.toUpperCase()}`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await axios.post(`${backendUrl}/api/auth/login`, {
        voterId: voterId.trim().toUpperCase(),
        password,
      });

      // Decode token to get user info
      const decoded = jwtDecode(res.data.token);
      onLogin({
        token: res.data.token,
        voterId: decoded.sub,
        role: decoded.role,
      });
    } catch (err) {
      showError(err.response?.data?.error || "Login failed. Try demo keys VOTER001 or ADMIN001.");
    } finally {
      setLoading(false);
    }
  };

  if (showStudio) {
    return <StudioHome onLogin={onLogin} />;
  }

  return (
    <main className="auth-layout" style={{ position: "relative" }}>
      {/* Optional top-right switch to explore 3D Studio Showcase */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          zIndex: 50
        }}
      >
        <button
          type="button"
          onClick={() => setShowStudio(true)}
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid #c7d0de",
            borderRadius: "9999px",
            padding: "7px 14px",
            fontSize: "12px",
            fontWeight: "600",
            color: "#173b78",
            cursor: "pointer",
            transition: "all 0.18s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 8px rgba(23, 59, 120, 0.08)"
          }}
          title="Explore the 3D Hardware Reticle and Interactive Node Graph"
        >
          <span>✦ 3D Studio & Reticle Showcase</span>
          <span style={{ fontSize: "14px" }}>↗</span>
        </button>
      </div>

      <section className="auth-intro">
        <div>
          <div className="brand-mark">V</div>
          <p className="eyebrow">HEDERA GOVERNANCE NETWORK</p>
          <h1>Every voice,<br /><em>verifiably</em> counted.</h1>
          <p className="intro-copy">A transparent digital ballot built for secure participation and public trust.</p>
        </div>
        <div className="trust-row">
          <span className="status-dot" /> Network operational <span className="trust-divider" /> Testnet Consensus Topic 0.0.10697996
        </div>
      </section>

      <section className="auth-panel">
        <div className="panel-heading">
          <p className="eyebrow">Secure access</p>
          <h2>Welcome to the ballot</h2>
          <p>Authenticate to continue to your voting workspace.</p>
        </div>

        {/* Demo Fast-login Chips */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "20px"
          }}
        >
          <button
            type="button"
            onClick={() => handleQuickFill("voter")}
            style={{
              flex: 1,
              padding: "8px 10px",
              background: role === "voter" ? "#eff6ff" : "#f8fafc",
              border: `1.5px solid ${role === "voter" ? "#2563eb" : "#e2e8f0"}`,
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#1e3a5f" }}>Voter Demo</div>
            <div style={{ fontSize: "10px", color: "#64748b", fontFamily: "var(--font-mono)" }}>VOTER001</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("admin")}
            style={{
              flex: 1,
              padding: "8px 10px",
              background: role === "admin" ? "#eff6ff" : "#f8fafc",
              border: `1.5px solid ${role === "admin" ? "#2563eb" : "#e2e8f0"}`,
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#1e3a5f" }}>Admin Demo</div>
            <div style={{ fontSize: "10px", color: "#64748b", fontFamily: "var(--font-mono)" }}>ADMIN001</div>
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="role">Account type</label>
            <select
              id="role"
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="voter">Login as Voter</option>
              <option value="admin">Login as Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="voterId">Identifier</label>
            <input
              id="voterId"
              type="text"
              placeholder="Enter your Voter ID or Admin ID"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"} <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
