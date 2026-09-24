import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { Login } from "./components/Login";
import { AdminConsole } from "./components/AdminConsole";
import { VoterBooth } from "./components/VoterBooth";

// --- MAIN APP ROUTER ---
export default function App() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => setAuth(null);

  // Check for existing auth in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const voterId = localStorage.getItem("authVoterId");
    const role = localStorage.getItem("authRole");
    if (token && voterId && role) {
      setAuth({ token, voterId, role });
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  if (!auth) return <Login onLogin={(authData) => {
    localStorage.setItem("authToken", authData.token);
    localStorage.setItem("authVoterId", authData.voterId);
    localStorage.setItem("authRole", authData.role);
    setAuth(authData);
  }} />;

  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={auth.role === "Admins" ? <AdminConsole token={auth.token} onLogout={handleLogout} /> : <Navigate to="/vote" />}
        />
        <Route
          path="/vote"
          element={auth.role === "Voters" ? <VoterBooth token={auth.token} onLogout={handleLogout} /> : <Navigate to="/admin" />}
        />
        <Route
          path="*"
          element={<Navigate to={auth.role === "Admins" ? "/admin" : "/vote"} />}
        />
      </Routes>
    </Router>
  );
}