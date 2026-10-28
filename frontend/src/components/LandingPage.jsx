import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const STAGGER_DELAY = 0.1;

export function LandingPage({ onLogin }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: STAGGER_DELAY,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const features = [
    {
      icon: "⛓️",
      title: "Blockchain Verified",
      description:
        "Every vote recorded on Hedera Consensus Service — immutable, timestamped, and publicly auditable on the mirror node.",
    },
    {
      icon: "🔐",
      title: "End-to-End Privacy",
      description:
        "Zero-knowledge architecture ensures voter anonymity while maintaining full transparency of the tally process.",
    },
    {
      icon: "📊",
      title: "Real-Time Results",
      description:
        "Live vote tallies streamed from Hedera mirror nodes with cryptographic proof — no central authority can manipulate counts.",
    },
    {
      icon: "📋",
      title: "Informed Voting",
      description:
        "Comprehensive candidate manifestos with track records, comparisons, and verified evidence — so every vote is an informed one.",
    },
    {
      icon: "🏛️",
      title: "Institutional Grade",
      description:
        "Built for student councils, cooperatives, and organizations requiring legally compliant, auditable digital elections.",
    },
    {
      icon: "⚡",
      title: "Instant Finality",
      description:
        "Hedera's hashgraph consensus delivers 3-5 second finality with fair ordering — no forks, no reorganizations, no waiting.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Authenticate",
      description:
        "Voters log in with verified credentials. Admins manage the electoral roll and candidate registration.",
    },
    {
      number: "02",
      title: "Review Manifestos",
      description:
        "Explore candidate promises, track records, comparisons, and verified evidence before deciding.",
    },
    {
      number: "03",
      title: "Cast Vote",
      description:
        "Submit your encrypted selection to the Hedera Consensus Service — recorded immutably in seconds.",
    },
    {
      number: "04",
      title: "Verify & Audit",
      description:
        "Anyone can verify the tally in real-time on the public mirror node. Full cryptographic audit trail.",
    },
  ];

  const trustIndicators = [
    { label: "Hedera Testnet", value: "Live" },
    { label: "HCS Topic", value: "0.0.10697996" },
    { label: "Mirror Node", value: "Active" },
    { label: "Finality", value: "3-5 sec" },
  ];

  return (
    <motion.div
      className="landing-shell"
      initial="hidden"
      animate="visible"
      variants={heroVariants}
    >
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header / Nav */}
      <header className="landing-nav" role="banner">
        <div className="nav-container">
          <div className="brand-lockup" aria-label="VoteLedger Home">
            <motion.div
              className="brand-mark"
              animate={floatingVariants}
              style={{ transformOrigin: "center" }}
            >
              V
            </motion.div>
            <span className="brand-text">
              VOTE<span className="brand-accent">/</span>LEDGER
            </span>
          </div>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#trust" className="nav-link">Trust</a>
            <motion.button
              className="nav-cta"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogin}
            >
              Enter Booth →
            </motion.button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main id="main-content" className="landing-main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-container">
            <motion.div className="hero-content" variants={containerVariants}>
              <motion.div
                className="hero-badge"
                variants={cardVariants}
                custom={0}
              >
                <motion.span
                  className="badge-dot"
                  animate={pulseVariants}
                  style={{ transformOrigin: "center" }}
                />
                Student Council General Election 2026 — Now Live
              </motion.div>

              <motion.h1
                id="hero-title"
                className="hero-title"
                variants={cardVariants}
                custom={1}
              >
                Every voice,<br />
                <span className="editorial">verifiably</span> counted.
              </motion.h1>

              <motion.p
                className="hero-subtitle"
                variants={cardVariants}
                custom={2}
              >
                A transparent digital ballot built on Hedera Consensus Service
                for secure participation and public trust.
              </motion.p>

              <motion.div
                className="hero-actions"
                variants={cardVariants}
                custom={3}
              >
                <motion.button
                  className="btn btn--primary btn--lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogin}
                >
                  Enter Voting Booth
                  <span aria-hidden="true"> ↳</span>
                </motion.button>
                <motion.a
                  href="#features"
                  className="btn btn--outline btn--lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore Features
                </motion.a>
              </motion.div>

              <motion.div
                className="hero-trust"
                variants={cardVariants}
                custom={4}
              >
                <div className="trust-item">
                  <span className="trust-label">Network</span>
                  <span className="trust-value">
                    <span className="status-dot" />
                    Hedera Testnet Operational
                  </span>
                </div>
                <div className="trust-divider" aria-hidden="true" />
                <div className="trust-item">
                  <span className="trust-label">Finality</span>
                  <span className="trust-value">3–5 seconds</span>
                </div>
                <div className="trust-divider" aria-hidden="true" />
                <div className="trust-item">
                  <span className="trust-label">Votes Cast</span>
                  <span className="trust-value">1,247</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Animated Visual Element */}
            <motion.div
              className="hero-visual"
              variants={cardVariants}
              custom={5}
              animate={floatingVariants}
            >
              <div className="visual-card">
                <div className="visual-header">
                  <span className="visual-dot" />
                  <span className="visual-dot" />
                  <span className="visual-dot" />
                </div>
                <div className="visual-content">
                  <div className="blockchain-viz">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="block"
                        animate={{
                          y: [0, -5, 0],
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut",
                          },
                        }}
                      >
                        <div className="block-hash">
                          0x{Array.from({ length: 16 }, () =>
                            Math.floor(Math.random() * 16).toString(16)
                          ).join("")}
                        </div>
                        <div className="block-meta">
                          <span>Block #{10697996 + i}</span>
                          <span>{Math.floor(Math.random() * 50) + 10} votes</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="visual-caption">
                    Live mirror node feed — <a href="https://hashscan.io/testnet/topic/0.0.10697996" target="_blank" rel="noopener noreferrer">View on HashScan ↗</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features" aria-labelledby="features-title">
          <div className="section-container">
            <motion.div className="section-header" variants={cardVariants}>
              <p className="eyebrow">Why VoteLedger</p>
              <h2 id="features-title" className="section-title">
                Built for trust,<br />
                designed for <span className="highlight">participation</span>.
              </h2>
              <p className="section-subtitle">
                Every feature exists to make voting more transparent, accessible, and verifiable.
              </p>
            </motion.div>

            <motion.div
              className="features-grid"
              variants={containerVariants}
              role="list"
            >
              {features.map((feature, index) => (
                <motion.article
                  key={feature.title}
                  className="feature-card"
                  variants={cardVariants}
                  custom={index}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(15,30,61,0.15)" }}
                  role="listitem"
                >
                  <div className="feature-icon" aria-hidden="true">
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works" aria-labelledby="how-title">
          <div className="section-container">
            <motion.div className="section-header" variants={cardVariants}>
              <p className="eyebrow">Process</p>
              <h2 id="how-title" className="section-title">
                Four steps to<br />
                a verified ballot.
              </h2>
            </motion.div>

            <motion.div
              className="steps-timeline"
              variants={containerVariants}
              role="list"
            >
              {steps.map((step, index) => (
                <motion.article
                  key={step.number}
                  className="step-card"
                  variants={cardVariants}
                  custom={index}
                  role="listitem"
                >
                  <div className="step-connector" aria-hidden="true">
                    <span className="step-number">{step.number}</span>
                    {index < steps.length - 1 && <span className="step-line" />}
                  </div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trust Indicators Section */}
        <section id="trust" className="trust" aria-labelledby="trust-title">
          <div className="section-container">
            <motion.div className="section-header" variants={cardVariants}>
              <p className="eyebrow">Transparency</p>
              <h2 id="trust-title" className="section-title">
                Verify it<br />
                yourself.
              </h2>
              <p className="section-subtitle">
                Every vote is recorded on a public ledger. No trust required — only verification.
              </p>
            </motion.div>

            <motion.div
              className="trust-grid"
              variants={containerVariants}
              role="list"
            >
              {trustIndicators.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="trust-card"
                  variants={cardVariants}
                  custom={index}
                  role="listitem"
                >
                  <span className="trust-metric">{item.value}</span>
                  <span className="trust-metric-label">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="trust-actions"
              variants={cardVariants}
              custom={trustIndicators.length}
            >
              <motion.a
                href="https://hashscan.io/testnet/topic/0.0.10697996"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Live Ledger on HashScan
                <span aria-hidden="true"> ↗</span>
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta" aria-labelledby="cta-title">
          <div className="section-container">
            <motion.div className="cta-card" variants={cardVariants}>
              <div className="cta-content">
                <motion.h2
                  id="cta-title"
                  className="cta-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Ready to cast your vote?
                </motion.h2>
                <motion.p
                  className="cta-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Join 1,247 verified voters. Your ballot takes 30 seconds.
                  Immutable. Transparent. Yours.
                </motion.p>
                <motion.button
                  className="btn btn--primary btn--lg cta-btn"
                  whileHover={{ scale: 1.02, y: -2, boxShadow: "0 12px 28px rgba(13,148,136,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogin}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Enter Voting Booth Now
                  <span aria-hidden="true"> ↳</span>
                </motion.button>
              </div>
              <motion.div
                className="cta-visual"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="ballot-preview">
                  <div className="ballot-header">
                    <span>🗳️</span>
                    <span>Official Ballot</span>
                  </div>
                  <div className="ballot-options">
                    <div className="ballot-option">
                      <span className="ballot-radio" />
                      <span>Aarav Sharma — PSA</span>
                    </div>
                    <div className="ballot-option">
                      <span className="ballot-radio" />
                      <span>Ananya Iyer — ARDCI</span>
                    </div>
                    <div className="ballot-option">
                      <span className="ballot-radio" />
                      <span>Rohan Varma — USWAC</span>
                    </div>
                  </div>
                  <div className="ballot-footer">
                    <span className="verify-link">Verify on Hedera →</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer" role="contentinfo">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="brand-lockup">
              <div className="brand-mark">V</div>
              <span className="brand-text">
                VOTE<span className="brand-accent">/</span>LEDGER
              </span>
            </div>
            <p className="footer-tagline">
              Blockchain-secured voting for transparent democracy.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#trust">Transparency</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="https://hashscan.io/testnet/topic/0.0.10697996" target="_blank" rel="noopener noreferrer">Live Ledger</a>
              <a href="https://hedera.com" target="_blank" rel="noopener noreferrer">Hedera Network</a>
              <a href="#">Documentation</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Election Rules</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>⚠ Demonstration data — Fictional scenario for illustrative purposes only</p>
            <p>Built with Hedera Consensus Service · React · Vite</p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}