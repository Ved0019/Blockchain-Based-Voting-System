import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export function Login({ onLogin }) {
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState(""); // For admin login fallback
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("request"); // 'request' or 'verify'
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/auth/request-otp`, {
        voterId: voterId.toUpperCase(),
      });
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/auth/verify-otp`, {
        voterId: voterId.toUpperCase(),
        otp,
      });

      // Decode token to get user info
      const decoded = jwtDecode(res.data.token);
      onLogin({
        token: res.data.token,
        voterId: decoded.sub,
        role: decoded.role,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/admin/login`, {
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
      setError(err.response?.data?.error || "Admin login failed");
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

        {!showAdminLogin && (
          <>
            {step === "request" ? (
              <form onSubmit={handleRequestOTP}>
                <div className="form-group">
                  <label htmlFor="voterId">Voter ID</label>
                  <input
                    id="voterId"
                    type="text"
                    placeholder="Enter your Voter ID"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
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
                  {loading ? "Sending OTP..." : "Request OTP"} <span aria-hidden="true">↗</span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <div className="form-group">
                  <label htmlFor="voterId">Voter ID</label>
                  <input
                    id="voterId"
                    type="text"
                    placeholder="Enter your Voter ID"
                    value={voterId}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="otp">One-Time Password</label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength="6"
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
                  {loading ? "Verifying..." : "Verify OTP"} <span aria-hidden="true">↗</span>
                </button>

                <div className="form-group" style={{ marginTop: "16px", textAlign: "center" }}>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => {
                      setStep("request");
                      setVoterId("");
                      setOtp("");
                      setError("");
                    }}
                  >
                    Back to Voter ID
                  </button>
                  <p className="eyebrow" style={{ marginTop: "8px", fontSize: "12px" }}>
                    Or <span className="text-button" onClick={() => setShowAdminLogin(true)}>admin login</span>
                  </p>
                </div>
              </form>
            )}
          </>
        )}

        {showAdminLogin && (
          <form onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label htmlFor="voterId">Admin Voter ID</label>
              <input
                id="voterId"
                type="text"
                placeholder="Enter admin Voter ID"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Admin Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter admin password"
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
              {logging ? "Logging in..." : "Admin Login"} <span aria-hidden="true">↗</span>
            </button>

            <div className="form-group" style={{ marginTop: "16px", textAlign: "center" }}>
              <button
                className="text-button"
                type="button"
                onClick={() => {
                  setShowAdminLogin(false);
                  setVoterId("");
                  setPassword("");
                  setError("");
                }}
              >
                Back to voter login
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}