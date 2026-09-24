import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export function Login({ onLogin }) {
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/auth/login`, {
        voterId: voterId.toUpperCase(),
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
      setError(err.response?.data?.error || "Login failed");
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
        <div className="panel-heading">
          <p className="eyebrow">Secure access</p>
          <h2>Welcome to the ballot</h2>
          <p>Authenticate to continue to your voting workspace.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="role">Account type</label>
            <select id="role">
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
            {loading ? "Logging in..." : "Login"} <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>
    </main>
  );
}