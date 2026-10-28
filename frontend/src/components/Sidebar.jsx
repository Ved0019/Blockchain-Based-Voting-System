import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "📊", path: "/admin" },
  { id: "candidates", label: "Candidates", icon: "👥", path: "/admin/candidates" },
  { id: "voters", label: "Voters", icon: "🗳️", path: "/admin/voters" },
  { id: "election", label: "Election Control", icon: "⚙️", path: "/admin/election" },
  { id: "tallies", label: "Live Tallies", icon: "📈", path: "/admin/tallies" },
  { id: "manifesto", label: "Manifesto Mgmt", icon: "📋", path: "/admin/manifesto" },
  { id: "evidence", label: "Evidence Archive", icon: "📂", path: "/admin/evidence" },
  { id: "issues", label: "Campus Issues", icon: "🏛️", path: "/admin/issues" },
];

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 260;

export function Sidebar({ onNavigate, isOpen = true, onToggle, mobileOpen = false, onMobileToggle }) {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const currentPath = location.pathname.replace("/admin", "") || "/";
  const activeItem = NAV_ITEMS.find(item =>
    currentPath === item.path.replace("/admin", "") ||
    (item.path !== "/admin" && currentPath.startsWith(item.path.replace("/admin", "")))
  ) || NAV_ITEMS[0];

  const handleItemClick = (item) => {
    if (onNavigate) onNavigate(item.path);
    if (mobileOpen && onMobileToggle) onMobileToggle();
  };

  const handleKeyDown = (e, item) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleItemClick(item);
    }
  };

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="sidebar-overlay visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileToggle}
          />
        )}
      </AnimatePresence>
      <motion.aside
        className={`admin-sidebar ${mobileOpen ? "mobile-open" : ""}`}
        role="navigation"
        aria-label="Admin navigation"
        data-collapsed={isOpen ? "false" : "true"}
        animate={{ width: isOpen || mobileOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Brand / Logo */}
        <div className="sidebar-brand">
          <motion.div
            className="brand-mark"
            animate={{ rotate: [-6, 6, -6], transition: { duration: 4, repeat: Infinity } }}
            style={{ transformOrigin: "center" }}
          >
            V
          </motion.div>
          {isOpen && (
            <motion.span
              className="brand-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              VOTE<span className="brand-accent">/</span>LEDGER
            </motion.span>
          )}
          {/* Mobile menu toggle - only shown when collapsed on mobile */}
          <button
            className="sidebar-mobile-toggle"
            onClick={onMobileToggle}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Main admin navigation">
          <ul role="list">
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeItem.id === item.id;
              return (
                <li key={item.id}>
                  <motion.button
                    className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                    role="menuitem"
                    aria-current={isActive ? "page" : undefined}
                    aria-label={item.label}
                    onClick={() => handleItemClick(item)}
                    onKeyDown={(e) => handleKeyDown(e, item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    whileTap={{ scale: 0.98 }}
                    style={{ transitionDelay: `${index * 0.03}s` }}
                  >
                    <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                    {isOpen && (
                      <motion.span
                        className="nav-label"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {isActive && isOpen && (
                      <motion.span
                        className="active-indicator"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                      />
                    )}
                    {isOpen && hoveredItem === item.id && !isActive && (
                      <motion.span className="hover-glow" />
                    )}
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - User info & Toggle */}
        <div className="sidebar-footer">
          {isOpen && (
            <motion.div
              className="user-info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="user-avatar">A</div>
              <div className="user-details">
                <span className="user-name">Administrator</span>
                <span className="user-role">System Admin</span>
              </div>
            </motion.div>
          )}
          <button
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isOpen}
          >
            <motion.span
              className="toggle-icon"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              ◀
            </motion.span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;