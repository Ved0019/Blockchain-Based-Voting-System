import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { Login } from "./components/Login";
import { AdminConsole } from "./components/AdminConsole";
import { VoterBooth } from "./components/VoterBooth";
import { ManifestoDashboard } from "./components/ManifestoDashboard";

// --- INNER ROUTES COMPONENT (needs Router context for useNavigate) ---
function AppRoutes({ auth, onLogout }) {
  const navigate = useNavigate();
  const [voterView, setVoterView] = useState(() => sessionStorage.getItem("voterView") || "manifesto");

  const handleProceedToVote = () => {
    sessionStorage.setItem("voterView", "ballot");
    setVoterView("ballot");
    navigate("/vote");
  };

  const handleBackToManifesto = () => {
    sessionStorage.setItem("voterView", "manifesto");
    setVoterView("manifesto");
    navigate("/manifesto");
  };

  return (
    <Routes>
      {/* Admin route */}
      <Route
        path="/admin"
        element={
          auth.role === "Admins"
            ? <AdminConsole token={auth.token} onLogout={onLogout} />
            : <Navigate to="/manifesto" />
        }
      />

      {/* Manifesto Dashboard — voter reads this BEFORE voting */}
      <Route
        path="/manifesto"
        element={
          auth.role === "Voters"
            ? (
              <ManifestoDashboard
                token={auth.token}
                onLogout={onLogout}
                onProceedToVote={handleProceedToVote}
              />
            )
            : <Navigate to="/admin" />
        }
      />

      {/* Ballot page — only accessible to voters */}
      <Route
        path="/vote"
        element={
          auth.role === "Voters"
            ? (voterView === "ballot"
                ? <VoterBooth token={auth.token} onLogout={onLogout} onBackToManifesto={handleBackToManifesto} />
                : <Navigate to="/manifesto" />
              )
            : <Navigate to="/admin" />
        }
      />

      {/* Default redirect */}
      <Route
        path="*"
        element={
          <Navigate to={
            auth.role === "Admins" ? "/admin"
            : voterView === "ballot" ? "/vote"
            : "/manifesto"
          } />
        }
      />
    </Routes>
  );
}

// --- MAIN APP ---
export default function App() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authVoterId");
    localStorage.removeItem("authRole");
    sessionStorage.removeItem("voterView");
    setAuth(null);
  };

  // Reset voter view when re-authenticated
  const handleLogin = (authData) => {
    localStorage.setItem("authToken", authData.token);
    localStorage.setItem("authVoterId", authData.voterId);
    localStorage.setItem("authRole", authData.role);
    sessionStorage.setItem("voterView", "manifesto");
    setAuth(authData);
  };

  // Check for existing auth in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const voterId = localStorage.getItem("authVoterId");
    const role = localStorage.getItem("authRole");
    if (token && voterId && role) {
      try {
        const decoded = jwtDecode(token);
        // Check expiry
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authVoterId");
          localStorage.removeItem("authRole");
        } else {
          setAuth({ token, voterId, role });
        }
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authVoterId");
        localStorage.removeItem("authRole");
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100svh", fontFamily: "Manrope, sans-serif", color: "#5a6a80" }}>
        Loading…
      </div>
    );
  }

  if (!auth) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <AppRoutes auth={auth} onLogout={handleLogout} />
    </Router>
  );
}