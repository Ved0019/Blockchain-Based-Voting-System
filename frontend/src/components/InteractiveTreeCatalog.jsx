import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundFx } from "../utils/soundEffects";
import "./InteractiveTreeCatalog.css";
import "./StudioAesthetic.css";

// ── Root & Category Nodes ──
const ROOT_NODE = {
  id: "root",
  label: "Manifesto Ledger",
  count: 36,
  x: 60,
  y: 480,
  width: 170,
  height: 38
};

const CATEGORY_NODES = [
  {
    id: "cat-candidates",
    label: "Candidates",
    count: 3,
    parentId: "root",
    x: 290,
    y: 280,
    width: 125,
    height: 36,
    active: true
  },
  {
    id: "cat-delivered",
    label: "Delivered Track Record",
    count: 8,
    parentId: "root",
    x: 290,
    y: 480,
    width: 195,
    height: 36
  },
  {
    id: "cat-proposed",
    label: "Proposed Promises",
    count: 14,
    parentId: "root",
    x: 290,
    y: 690,
    width: 175,
    height: 36
  }
];

// ── Graph Card Nodes matching Screenshot 3 ──
const CARD_NODES = [
  // ── BRANCH 1: CANDIDATES ──
  {
    id: "cand-aarav",
    title: "Aarav Sharma",
    sub: "Council President · Incumbent (PSA)",
    candidateId: "1",
    candidateName: "Aarav Sharma",
    party: "Progressive Student Alliance (PSA)",
    status: "Incumbent",
    category: "Leadership & Administration",
    problem: "Need for proven, accountable leadership to complete multi-year campus infrastructure upgrades.",
    solution: "Re-election bid to finalize Wi-Fi 6 expansion in all dorms, open the 24/7 library commons, and launch the ERP grievance tracking system.",
    impact: "Spearheaded 18 RO purifiers, 2 AM exam study commons, ₹6.8L sports courts, and 24/7 emergency medical transit.",
    evidenceRef: "Council Resolution #CR-2025-04 & Senate Minutes #ASM-88",
    targetTimeline: "2024–2026 Academic Term",
    parentId: "cat-candidates",
    x: 520,
    y: 120,
    width: 200,
    height: 110,
    variant: "variant-groth",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11px", fontWeight: "700", color: "#00ff66" }}>01 · INCUMBENT</span>
          <span style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(255,255,255,0.15)", borderRadius: "9999px" }}>PSA</span>
        </div>
        <div>
          <div style={{ fontSize: "17px", fontWeight: "800", letterSpacing: "-0.02em", color: "#fff" }}>Aarav Sharma</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>92% Promise SLA Score</div>
        </div>
      </div>
    )
  },
  {
    id: "cand-ananya",
    title: "Ananya Iyer",
    sub: "Presidential Challenger · ECE (ARDCI)",
    candidateId: "2",
    candidateName: "Ananya Iyer",
    party: "Academic Reform & Digital Campus (ARDCI)",
    status: "Challenger",
    category: "Academic & Research Reform",
    problem: "Academic evaluation opacity, limited capstone research funding, and high lab printing expenses.",
    solution: "Universal 24/7 library digital commons, ₹25,000 undergraduate research seed micro-grants, and free lab report printing.",
    impact: "Mentored 400+ freshmen through the Peer Tutoring Network and organized Women in STEM National Conclave.",
    evidenceRef: "IEEE Student Chapter Report #IBR-2024",
    targetTimeline: "2026–2027 Academic Term",
    parentId: "cand-aarav",
    x: 780,
    y: 115,
    width: 200,
    height: 110,
    variant: "variant-gradient",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11px", fontWeight: "700", color: "#1e3a5f" }}>02 · CHALLENGER</span>
          <span style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(30,58,95,0.12)", borderRadius: "9999px", fontWeight: "700" }}>ARDCI</span>
        </div>
        <div>
          <div style={{ fontSize: "17px", fontWeight: "800", letterSpacing: "-0.02em", color: "#0f1d3a" }}>Ananya Iyer</div>
          <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>IEEE Lead · Research First</div>
        </div>
      </div>
    )
  },
  {
    id: "cand-rohan",
    title: "Rohan Varma",
    sub: "Presidential Challenger · Mech (USWAC)",
    candidateId: "3",
    candidateName: "Rohan Varma",
    party: "United Student Welfare & Athletics (USWAC)",
    status: "Challenger",
    category: "Student Welfare & Health",
    problem: "Inflation in cafeteria meal costs, lack of mental health resources, and safety concerns on outer campus roads.",
    solution: "Standardized ₹35 nutritious thali, 24/7 confidential mental wellness pavilion, modern sports complex, and night golf carts.",
    impact: "University basketball captain and hostel warden council rep; led campus health and cultural festivals.",
    evidenceRef: "Spandan Festival Report #SFR-2024",
    targetTimeline: "2026–2027 Academic Term",
    parentId: "cand-ananya",
    x: 1040,
    y: 115,
    width: 200,
    height: 110,
    variant: "variant-usual",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11px", fontWeight: "700", color: "#ffeedd" }}>03 · CHALLENGER</span>
          <span style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(0,0,0,0.3)", borderRadius: "9999px" }}>USWAC</span>
        </div>
        <div>
          <div style={{ fontSize: "17px", fontWeight: "800", letterSpacing: "-0.02em", color: "#fff" }}>Rohan Varma</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", marginTop: "2px" }}>Welfare & Athletics Lead</div>
        </div>
      </div>
    )
  },

  // ── BRANCH 2: WHAT CANDIDATE HAS DONE (DELIVERED TRACK RECORD) ──
  {
    id: "deliv-water",
    title: "RO Water Purifiers",
    sub: "18 High-Capacity RO+UV Units",
    candidateId: "1",
    candidateName: "Aarav Sharma (Incumbent)",
    party: "PSA",
    status: "Completed",
    category: "Campus Infrastructure",
    problem: "Chronic water contamination complaints and intermittent drinking water supply across dormitories.",
    solution: "Drafted council procurement tender and coordinated with Works & Estate Department for installation of 18 commercial units.",
    impact: "2,800+ hostellers now have guaranteed clean potable drinking water 24/7. Water complaints eliminated.",
    evidenceRef: "Council Resolution #CR-2025-04 & Municipal Lab Certificate #MWQ-892",
    targetTimeline: "Delivered Month 3 of Tenure (August 2024)",
    parentId: "cat-delivered",
    x: 550,
    y: 330,
    width: 210,
    height: 105,
    variant: "default",
    render: () => (
      <div style={{ padding: "12px 14px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#059669", background: "#d1fae5", padding: "2px 8px", borderRadius: "9999px" }}>✓ COMPLETED</span>
          <span style={{ fontSize: "15px" }}>💧</span>
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "#111" }}>RO Water Purifiers</div>
          <div style={{ fontSize: "11px", color: "#666" }}>18 Commercial Units in 6 Dorms</div>
        </div>
      </div>
    )
  },
  {
    id: "deliv-library-2am",
    title: "2 AM Library Access",
    sub: "Extended Exam Study Commons",
    candidateId: "1",
    candidateName: "Aarav Sharma (Incumbent)",
    party: "PSA",
    status: "Completed",
    category: "Library & Learning",
    problem: "Library previously closed at 9 PM, causing severe study room overcrowding in dorms during finals.",
    solution: "Submitted student petition with 1,840 signatures to Academic Senate; negotiated security staffing arrangements with Chief Librarian.",
    impact: "Central Library reading rooms extended to 2:00 AM for 3 weeks during midterms and finals. Nightly footfall of 450+ students.",
    evidenceRef: "Academic Senate Minutes #ASM-88 (Resolution passed Oct 14, 2024)",
    targetTimeline: "Delivered October 2024",
    parentId: "deliv-water",
    x: 820,
    y: 310,
    width: 210,
    height: 105,
    variant: "variant-icons",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="icons-header">SENATE RESOLUTION #ASM-88</span>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#059669" }}>✓ DONE</span>
        </div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: "900", color: "#1e3a8a" }}>2 AM Library Finals</div>
          <div style={{ fontSize: "11px", color: "#3b82f6" }}>450+ Nightly Attendance</div>
        </div>
      </div>
    )
  },
  {
    id: "deliv-sports",
    title: "Sports Courts Resurfaced",
    sub: "Synthetic Acrylic & High-Mast LEDs",
    candidateId: "1",
    candidateName: "Aarav Sharma (Incumbent)",
    party: "PSA",
    status: "Completed",
    category: "Sports and Gym Facilities",
    problem: "Cracked concrete basketball and tennis courts caused frequent student injuries; no floodlights for evening games.",
    solution: "Secured ₹6.8 Lakhs capital infrastructure grant from University Executive Board and oversaw synthetic resurfacing contractor.",
    impact: "Resurfaced with shock-absorbent synthetic material, 8 LED floodlights active until 10 PM. Hosted Inter-University Invitational.",
    evidenceRef: "Works & Estate Dept Work Order #WD-4091 (Completed Jan 2025)",
    targetTimeline: "Delivered January 2025",
    parentId: "deliv-library-2am",
    x: 1090,
    y: 290,
    width: 210,
    height: 110,
    variant: "default",
    render: () => (
      <div style={{ background: "#ff3b30", color: "#fff", height: "100%", padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", background: "rgba(0,0,0,0.25)", padding: "2px 8px", borderRadius: "9999px" }}>✓ COMPLETED</span>
          <span style={{ fontSize: "14px" }}>🏀</span>
        </div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: "800" }}>Synthetic Sports Courts</div>
          <div style={{ fontSize: "11px", opacity: 0.9 }}>₹6.8L Grant · LED Floodlights</div>
        </div>
      </div>
    )
  },
  {
    id: "deliv-medical",
    title: "24/7 Health Transport",
    sub: "Emergency Campus Ambulance",
    candidateId: "1",
    candidateName: "Aarav Sharma (Incumbent)",
    party: "PSA",
    status: "Completed",
    category: "Transport & Health",
    problem: "Late-night medical emergencies in outer dorms required waiting 45+ minutes for municipal ambulances.",
    solution: "Converted administrative utility vehicle into an on-campus emergency transit unit stationed 24/7 at Campus Clinic.",
    impact: "Handled 42 emergency hospital transfers with an average dispatch time under 8 minutes.",
    evidenceRef: "Campus Health Center Order #SWD-102 & Incident Dispatch Log #EMT-2024",
    targetTimeline: "Operational since August 2024",
    parentId: "deliv-sports",
    x: 1360,
    y: 290,
    width: 210,
    height: 110,
    variant: "variant-petal",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#059669", background: "#d1fae5", padding: "2px 8px", borderRadius: "9999px" }}>✓ COMPLETED</span>
          <span style={{ fontSize: "15px" }}>🚑</span>
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "#111" }}>Emergency Health Van</div>
          <div style={{ fontSize: "11px", color: "#059669" }}>42 Hospital Transfers (&lt;8 min)</div>
        </div>
      </div>
    )
  },
  {
    id: "deliv-wifi-a",
    title: "Hostel A Wi-Fi 6 Rollout",
    sub: "Gigabit Fiber & 48 Access Points",
    candidateId: "1",
    candidateName: "Aarav Sharma (Incumbent)",
    party: "PSA",
    status: "Partially Completed",
    category: "Wi-Fi and Digital Facilities",
    problem: "Severe bandwidth throttling and dead zones across all campus hostel rooms during evening study hours.",
    solution: "Secured central IT sanction for ₹14 Lakhs; completed optical fiber laying and installed 48 Wi-Fi 6 APs in Hostel Block A.",
    impact: "Hostel A achieved verified speeds exceeding 90 Mbps per room. Hostels B, C, and D pending Phase 2 & 3.",
    evidenceRef: "IT Infrastructure Audit Report #IT-2025-11",
    targetTimeline: "Phase 1 Complete, Phases 2 & 3 in 2026",
    parentId: "cat-delivered",
    x: 550,
    y: 470,
    width: 210,
    height: 105,
    variant: "variant-format",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#f59e0b", background: "rgba(245,158,11,0.2)", padding: "2px 8px", borderRadius: "9999px" }}>◑ PARTIAL</span>
          <span style={{ fontSize: "13px", color: "#00ff66" }}>📡</span>
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "#fff" }}>Hostel A Wi-Fi 6</div>
          <div style={{ fontSize: "11px", color: "#aaa" }}>90+ Mbps in Block A · B/C Pending</div>
        </div>
      </div>
    )
  },
  {
    id: "deliv-canteen-caps",
    title: "Canteen Price Regulation",
    sub: "12 Daily Food Staples Protected",
    candidateId: "1",
    candidateName: "Aarav Sharma (Incumbent)",
    party: "PSA",
    status: "Partially Completed",
    category: "Canteen Food Quality & Affordability",
    problem: "Private cafeteria food prices surged 22% in two years, making daily nutrition unaffordable for students on aid.",
    solution: "Formed student mess inspection squad, conducted 4 surprise kitchen checks, and instituted contract price caps on 12 staples.",
    impact: "Breakfast and lunch prices stabilized; kitchen exhaust upgrades remain pending contractor dispute.",
    evidenceRef: "Canteen Inspection Committee Report #CC-2025-Q3",
    targetTimeline: "Active Price Caps, Upgrades Pending",
    parentId: "deliv-wifi-a",
    x: 820,
    y: 450,
    width: 210,
    height: 105,
    variant: "variant-usual",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#fff", background: "rgba(0,0,0,0.3)", padding: "2px 8px", borderRadius: "9999px" }}>◑ PARTIAL</span>
          <span style={{ fontSize: "14px" }}>🍽️</span>
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "#fff" }}>Canteen Price Caps</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)" }}>12 Staples Regulated</div>
        </div>
      </div>
    )
  },
  {
    id: "deliv-erp",
    title: "ERP Grievance Portal",
    sub: "Automated Ticket SLA System",
    candidateId: "1",
    candidateName: "Aarav Sharma (Incumbent)",
    party: "PSA",
    status: "In Progress",
    category: "Student Grievances & Transparency",
    problem: "Student maintenance and grading petitions vanish into departmental inboxes with zero status tracking.",
    solution: "Student developer team wrote and audited open-source ticketing software with 7-day administrative SLA resolution.",
    impact: "Prototype audited and ready; live deployment awaiting API security sign-off from Controller of Examinations.",
    evidenceRef: "Software Audit & Deployment Request #SAD-2024-19",
    targetTimeline: "Pending Registrar Database API",
    parentId: "deliv-canteen-caps",
    x: 1090,
    y: 435,
    width: 210,
    height: 110,
    variant: "variant-americana",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#2563eb", background: "#dbeafe", padding: "2px 8px", borderRadius: "9999px" }}>⟳ IN PROGRESS</span>
          <div className="americana-symbol" style={{ width: "18px", height: "18px" }} />
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "#111" }}>Grievance ERP Portal</div>
          <div style={{ fontSize: "11px", color: "#666" }}>Code Audited · Awaiting API</div>
        </div>
      </div>
    )
  },
  {
    id: "deliv-peer",
    title: "Peer Tutoring Network",
    sub: "400+ Undergraduates Mentored",
    candidateId: "2",
    candidateName: "Ananya Iyer (Challenger)",
    party: "ARDCI",
    status: "Completed",
    category: "Academic Excellence",
    problem: "High failure rates in freshman engineering calculus and circuit theory without peer assistance.",
    solution: "Founded volunteer student tutoring network pairing high-scoring seniors with struggling junior undergraduates.",
    impact: "Supported 400+ students with verified 1.4 GPA average improvement across participating students.",
    evidenceRef: "IEEE Student Chapter Report #IBR-2024",
    targetTimeline: "Successfully Running (2024–2025)",
    parentId: "deliv-erp",
    x: 1360,
    y: 420,
    width: 210,
    height: 110,
    variant: "variant-tolan",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#065f46", background: "#a7f3d0", padding: "2px 8px", borderRadius: "9999px" }}>✓ COMPLETED</span>
          <span style={{ fontSize: "15px" }}>📚</span>
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "900", color: "#14532d" }}>Peer Tutoring Network</div>
          <div style={{ fontSize: "11px", color: "#166534" }}>400+ Freshmen Mentored</div>
        </div>
      </div>
    )
  },

  // ── BRANCH 3: WHAT CANDIDATES PROPOSE (2026 MANIFESTO PROMISES) ──
  {
    id: "prop-commons",
    title: "Permanent 24/7 Study Commons",
    sub: "East Wing Biometric Pods & Power Strip Desks",
    candidateId: "1",
    candidateName: "Aarav Sharma (C1-P02)",
    party: "PSA",
    status: "Proposed",
    category: "Library and Learning Resources",
    problem: "Students study in noisy, overcrowded dorm common rooms outside exam months.",
    solution: "Extend Library East Wing as a permanent year-round 24/7 silent reading commons with RFID turnstiles and dedicated night proctors.",
    impact: "Guaranteed quiet air-conditioned study environment for 350+ students every night.",
    evidenceRef: "Senate Resolution Proposal #ASM-88",
    targetTimeline: "Q1 2026 (Month 2)",
    parentId: "cat-proposed",
    x: 550,
    y: 630,
    width: 210,
    height: 105,
    variant: "default",
    render: () => (
      <div style={{ padding: "12px 14px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#7c3aed", background: "#ede9fe", padding: "2px 8px", borderRadius: "9999px" }}>→ PROPOSED</span>
          <span style={{ fontSize: "13px" }}>🏛️</span>
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "#111" }}>24/7 Library Commons</div>
          <div style={{ fontSize: "11px", color: "#666" }}>Permanent Biometric East Wing</div>
        </div>
      </div>
    )
  },
  {
    id: "prop-thali",
    title: "Subsidized ₹35 Healthy Thali",
    sub: "Nutritional Price Cap & Hygiene Swab Audits",
    candidateId: "3",
    candidateName: "Rohan Varma & Aarav Sharma (C1-P09 & C3-P01)",
    party: "USWAC / PSA",
    status: "Proposed",
    category: "Canteen Food Quality and Affordability",
    problem: "Students skip meals due to rising private cafeteria prices and low nutritional quality.",
    solution: "Cap the standardized student thali (dal, seasonal sabzi, 3 rotis, rice, salad) at ₹35 with monthly independent food safety swab testing.",
    impact: "Guaranteed affordable, wholesome nutrition for over 600 students daily across all 3 dining halls.",
    evidenceRef: "Canteen Contract Stipulation #CC-2026",
    targetTimeline: "Q1 2026 (Immediate)",
    parentId: "prop-commons",
    x: 820,
    y: 610,
    width: 210,
    height: 105,
    variant: "variant-feast",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "10px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#7c3aed", background: "#ede9fe", padding: "2px 8px", borderRadius: "9999px" }}>→ PROPOSED</span>
          <span className="feast-cutlery" style={{ margin: 0 }}>🍽️</span>
        </div>
        <div>
          <div style={{ fontSize: "17px", fontWeight: "900", color: "#111", letterSpacing: "-0.03em" }}>₹35 Healthy Thali</div>
          <div style={{ fontSize: "11px", color: "#555" }}>Nutritional Price Ceiling</div>
        </div>
      </div>
    )
  },
  {
    id: "prop-research",
    title: "₹25k Research Micro-Grants",
    sub: "Student Innovation Seed Fund",
    candidateId: "2",
    candidateName: "Ananya Iyer (C2-P01)",
    party: "ARDCI",
    status: "Proposed",
    category: "Academic Excellence",
    problem: "Student engineers lack seed grants for hardware components, sensors, and cloud compute credits for final-year thesis.",
    solution: "Establish ₹10 Lakhs annual Student Research Fund providing ₹25,000 micro-grants for 40 interdisciplinary student projects.",
    impact: "40+ undergraduate teams empowered to publish in IEEE/ACM conferences and file patents.",
    evidenceRef: "IEEE Research Policy Proposal #IRP-2025",
    targetTimeline: "Q1 2026 (Month 2)",
    parentId: "prop-thali",
    x: 1090,
    y: 590,
    width: 210,
    height: 110,
    variant: "variant-gradient",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#0369a1", background: "#e0f2fe", padding: "2px 8px", borderRadius: "9999px" }}>→ PROPOSED</span>
          <span style={{ fontSize: "14px" }}>🔬</span>
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "900", color: "#0f1d3a" }}>₹25k Research Grants</div>
          <div style={{ fontSize: "11px", color: "#334155" }}>₹10L Student Seed Fund</div>
        </div>
      </div>
    )
  },
  {
    id: "prop-wifi-all",
    title: "Complete Wi-Fi 6 in Hostels B, C, D",
    sub: "72 Dual-Band Enterprise Access Points",
    candidateId: "1",
    candidateName: "Aarav Sharma & Ananya Iyer (C1-P04 & C2-P03)",
    party: "PSA / ARDCI",
    status: "Proposed",
    category: "Wi-Fi and Digital Facilities",
    problem: "Hostels B, C, and D suffer from 62% dead zones and throttled speeds below 5 Mbps during peak evening hours.",
    solution: "Lay optical fiber backhaul and install 72 dual-band Wi-Fi 6 enterprise APs across all remaining dorm corridors.",
    impact: "Consistent 80+ Mbps throughput in every hostel room with zero dead zones in common rooms.",
    evidenceRef: "IT Committee Pending Allocation #IT-2026-02",
    targetTimeline: "Q1 2026 (Within 90 Days)",
    parentId: "prop-research",
    x: 1360,
    y: 580,
    width: 210,
    height: 110,
    variant: "variant-icons",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="icons-header">INFRASTRUCTURE EXPANSION</span>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#2563eb" }}>→ PROPOSED</span>
        </div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: "900", color: "#1e3a8a" }}>Hostel B, C, D Wi-Fi 6</div>
          <div style={{ fontSize: "11px", color: "#2563eb" }}>Zero Dead Zones · 80 Mbps</div>
        </div>
      </div>
    )
  },
  {
    id: "prop-wellness",
    title: "Student Wellness Pavilion",
    sub: "Two Full-Time Licensed Psychologists",
    candidateId: "1",
    candidateName: "Aarav Sharma & Rohan Varma (C1-P10 & C3-P03)",
    party: "PSA / USWAC",
    status: "Proposed",
    category: "Mental Wellbeing and Student Support",
    problem: "Current counseling operates part-time with 3-week waiting lists during exams and stigma around public clinic visits.",
    solution: "Build private, quiet wellness suites staffed by 2 full-time licensed counselors with guaranteed <48h appointments and 24/7 hotline.",
    impact: "Over 400 confidential sessions delivered annually with immediate crisis support.",
    evidenceRef: "Student Welfare Sanction Letter #SWD-102",
    targetTimeline: "Q2 2026",
    parentId: "cat-proposed",
    x: 550,
    y: 790,
    width: 210,
    height: 105,
    variant: "variant-format",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#00ff66", background: "rgba(0,255,102,0.15)", padding: "2px 8px", borderRadius: "9999px" }}>→ PROPOSED</span>
          <span style={{ fontSize: "14px" }}>💚</span>
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "#fff" }}>Mental Wellness Pavilion</div>
          <div style={{ fontSize: "11px", color: "#aaa" }}>2 Full-Time Psychologists</div>
        </div>
      </div>
    )
  },
  {
    id: "prop-solar-walkway",
    title: "Solar Covered Walkways",
    sub: "400m Weatherproof Canopies with Solar PV",
    candidateId: "1",
    candidateName: "Aarav Sharma (C1-P03)",
    party: "PSA",
    status: "Proposed",
    category: "Campus Infrastructure",
    problem: "Extreme monsoons and summer heat make walking between Academic Blocks 1, 2, and Cafeteria grueling.",
    solution: "Erect modular tensile fabric canopies with integrated solar PV lighting along the primary 400m inter-block pathway.",
    impact: "Sheltered, shaded transit connecting main campus quadrangle with night solar illumination.",
    evidenceRef: "Campus Master Plan #CMP-2026",
    targetTimeline: "Q3 2026 (Before Monsoon)",
    parentId: "prop-wellness",
    x: 820,
    y: 770,
    width: 210,
    height: 105,
    variant: "default",
    render: () => (
      <div style={{ padding: "12px 14px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#7c3aed", background: "#ede9fe", padding: "2px 8px", borderRadius: "9999px" }}>→ PROPOSED</span>
          <span style={{ fontSize: "14px" }}>☀️</span>
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "#111" }}>Solar Rain Canopies</div>
          <div style={{ fontSize: "11px", color: "#666" }}>400m Weatherproof Path</div>
        </div>
      </div>
    )
  },
  {
    id: "prop-night-transit",
    title: "Electric Night Transit Shuttle",
    sub: "Safe Shuttle Outer Dorms to Labs",
    candidateId: "3",
    candidateName: "Rohan Varma & Aarav Sharma (C3-P04 & C1-P08)",
    party: "USWAC / PSA",
    status: "Proposed",
    category: "Transport and Hostel Facilities",
    problem: "Outer dorms are 1.4 km from labs; students returning past 10 PM face dark unlit perimeter roads.",
    solution: "Deploy 14-seater electric campus shuttle van on 20-minute continuous loops between 7:30 PM and 12:30 AM with live GPS tracking.",
    impact: "Safe night transit for all students and elimination of long walks after late-night lab sessions.",
    evidenceRef: "Campus Transit Sanction Memo #SWD-102",
    targetTimeline: "Q2 2026",
    parentId: "prop-solar-walkway",
    x: 1090,
    y: 750,
    width: 210,
    height: 110,
    variant: "variant-universe",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#38bdf8", background: "rgba(56,189,248,0.2)", padding: "2px 8px", borderRadius: "9999px" }}>→ PROPOSED</span>
          <span style={{ fontSize: "14px" }}>⚡</span>
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "#fff" }}>Night Electric Transit</div>
          <div style={{ fontSize: "11px", color: "#38bdf8" }}>20-Min Loops to Outer Dorms</div>
        </div>
      </div>
    )
  },
  {
    id: "prop-hedera-ledger",
    title: "Hedera Topic 0.0.10697996",
    sub: "Consensus Timestamped Manifestos",
    candidateId: "1",
    candidateName: "All Candidates (Hedera Public Goods)",
    party: "HCS Consensus",
    status: "Ledger Verified",
    category: "Cryptographic Electoral Integrity",
    problem: "Campaign promises are often forgotten or altered after elections without verifiable public audit trails.",
    solution: "Every candidate manifesto pledge, performance record, and voting ballot is permanently inscribed on Hedera Consensus Service.",
    impact: "100% immutable, tamper-proof electoral accountability with 3-5 second real-time consensus finality.",
    evidenceRef: "https://hashscan.io/testnet/topic/0.0.10697996",
    targetTimeline: "Active on Testnet Topic 0.0.10697996",
    parentId: "prop-night-transit",
    x: 1360,
    y: 730,
    width: 220,
    height: 110,
    variant: "variant-hedera",
    render: () => (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="hedera-badge">HCS TESTNET</span>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00ff66", boxShadow: "0 0 8px #00ff66" }} />
        </div>
        <div className="hedera-title">Topic 0.0.10697996</div>
        <div className="hedera-sub">Consensus Timestamped Manifestos</div>
      </div>
    )
  }
];

export function InteractiveTreeCatalog({ onBackToHome, onOpenBallot }) {
  const [displayMode, setDisplayMode] = useState("tree"); // "tree" | "grid"
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [brandTitleMode, setBrandTitleMode] = useState("consensus-office");

  // Canvas pan & zoom state
  const [pan, setPan] = useState({ x: -20, y: -80 });
  const [zoom, setZoom] = useState(0.88);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const allNodes = [ROOT_NODE, ...CATEGORY_NODES, ...CARD_NODES];

  const handleToggleSound = () => {
    const enabled = soundFx.toggle();
    setSoundEnabled(enabled);
  };

  const handleMouseDown = (e) => {
    if (displayMode !== "tree") return;
    if (e.target.closest(".card-tile") || e.target.closest(".category-node-pill") || e.target.closest("button")) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.4));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.55));
  const handleResetZoom = () => {
    setZoom(0.88);
    setPan({ x: -20, y: -80 });
  };

  // Calculate cubic bezier curve between parent right-center and child left-center
  const calculateBezierPath = (parent, child) => {
    const x1 = parent.x + parent.width;
    const y1 = parent.y + parent.height / 2;
    const x2 = child.x;
    const y2 = child.y + child.height / 2;

    const dx = x2 - x1;
    const curvature = Math.max(dx * 0.5, 45);

    return `M ${x1} ${y1} C ${x1 + curvature} ${y1}, ${x2 - curvature} ${y2}, ${x2} ${y2}`;
  };

  // Check if a line is part of the hovered node's lineage
  const isLineHighlighted = (parent, child) => {
    if (!hoveredNodeId) return false;
    return child.id === hoveredNodeId || parent.id === hoveredNodeId;
  };

  const handleSelectCandidateToVote = (candidateId) => {
    if (candidateId) {
      sessionStorage.setItem("preferredCandidate", String(candidateId));
    }
    setSelectedCard(null);
    if (onOpenBallot) onOpenBallot();
  };

  return (
    <div className="tree-page-shell">
      {/* ── HEADER (Exact dmcg.co top navigation) ── */}
      <header className="tree-page-header">
        <div className="tree-header-left">
          <button
            type="button"
            className="tree-header-link"
            onClick={() => onBackToHome && onBackToHome()}
          >
            ← Back
          </button>
          <a
            href="https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10697996/messages"
            target="_blank"
            rel="noopener noreferrer"
            className="tree-header-link"
          >
            Hedera HCS Protocol ↗
          </a>
        </div>

        {/* Stacked Center Brand Typography */}
        <div
          className="tree-brand-stacked"
          onClick={() => {
            soundFx.playClick(900, 0.02);
            setBrandTitleMode((m) => (m === "consensus-office" ? "manifesto-ledger" : "consensus-office"));
          }}
          title="Click to toggle title"
        >
          {brandTitleMode === "consensus-office" ? (
            <>
              <span className="sub-line">The</span>
              <span className="main-line">Consensus Office</span>
              <span className="by-line">of VoteLedger</span>
            </>
          ) : (
            <>
              <span className="sub-line">Official</span>
              <span className="main-line">Manifesto Ledger</span>
              <span className="by-line">Council Election 2026</span>
            </>
          )}
        </div>

        <div className="tree-header-right">
          <button
            type="button"
            className="tree-pill"
            onClick={() => {
              soundFx.playClick(850, 0.02);
              onBackToHome && onBackToHome();
            }}
          >
            Exit Web
          </button>
          <button
            type="button"
            className="tree-pill active"
            onClick={() => soundFx.playClick(950, 0.02)}
          >
            Manifesto Web
          </button>
          <button
            type="button"
            className={`tree-audio-btn ${soundEnabled ? "enabled" : ""}`}
            onClick={handleToggleSound}
            title={soundEnabled ? "Mute haptic audio" : "Enable tactile haptic audio"}
            aria-label="Toggle haptic audio"
          >
            {soundEnabled ? "🔊" : "🔈"}
          </button>
          {onOpenBallot && (
            <button
              type="button"
              className="tree-pill"
              style={{ background: "#111111", color: "#ffffff", marginLeft: "6px" }}
              onClick={() => {
                soundFx.playClick(1200, 0.03);
                onOpenBallot();
              }}
            >
              Cast Ballot ↗
            </button>
          )}
        </div>
      </header>

      {/* ── MAIN CANVAS VIEWPORT (Tree Mode) ── */}
      {displayMode === "tree" ? (
        <div
          className="tree-canvas-viewport"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="tree-canvas-content"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
            }}
          >
            {/* SVG Connecting Cubic Bezier Curves Layer */}
            <svg className="tree-svg-layer" width="2600" height="1600">
              {/* Category Node connections to Root */}
              {CATEGORY_NODES.map((cat) => {
                const path = calculateBezierPath(ROOT_NODE, cat);
                const isHighlight = isLineHighlighted(ROOT_NODE, cat);
                return (
                  <path
                    key={`line-${ROOT_NODE.id}-${cat.id}`}
                    d={path}
                    className={`tree-bezier-path ${isHighlight ? "highlighted" : ""} ${hoveredNodeId && !isHighlight ? "dimmed" : ""}`}
                  />
                );
              })}

              {/* Card Node connections to their parents */}
              {CARD_NODES.map((card) => {
                const parent = allNodes.find((n) => n.id === card.parentId);
                if (!parent) return null;
                const path = calculateBezierPath(parent, card);
                const isHighlight = isLineHighlighted(parent, card);
                return (
                  <path
                    key={`line-${parent.id}-${card.id}`}
                    d={path}
                    className={`tree-bezier-path ${isHighlight ? "highlighted" : ""} ${hoveredNodeId && !isHighlight ? "dimmed" : ""}`}
                  />
                );
              })}
            </svg>

            {/* Root Node */}
            <div
              className="tree-node-item"
              style={{ left: ROOT_NODE.x, top: ROOT_NODE.y }}
              onMouseEnter={() => setHoveredNodeId(ROOT_NODE.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <div className="category-node-pill selected">
                <span>{ROOT_NODE.label}</span>
                <span className="node-count">{ROOT_NODE.count}</span>
              </div>
            </div>

            {/* Category Branch Nodes */}
            {CATEGORY_NODES.map((cat) => (
              <div
                key={cat.id}
                className="tree-node-item"
                style={{ left: cat.x, top: cat.y }}
                onMouseEnter={() => setHoveredNodeId(cat.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => {
                  soundFx.playClick(1000, 0.02);
                }}
              >
                <div className={`category-node-pill ${cat.active ? "selected" : ""}`}>
                  <span>{cat.label}</span>
                  <span className="node-count">{cat.count}</span>
                </div>
              </div>
            ))}

            {/* Card Nodes */}
            {CARD_NODES.map((card) => {
              const isHovered = hoveredNodeId === card.id;
              return (
                <div
                  key={card.id}
                  className="tree-node-item"
                  style={{
                    left: card.x,
                    top: card.y,
                    width: card.width,
                    height: card.height
                  }}
                  onMouseEnter={() => setHoveredNodeId(card.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => {
                    soundFx.playClick(1150, 0.02);
                    setSelectedCard(card);
                  }}
                >
                  <div className={`card-tile ${card.variant} ${isHovered ? "highlighted" : ""}`} style={{ height: "100%" }}>
                    {card.render()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── GRID VIEW (When toggle ⊞ is selected) ── */
        <div className="grid-view-container">
          {CARD_NODES.map((card) => (
            <div
              key={card.id}
              className={`card-tile ${card.variant}`}
              style={{ minHeight: "130px", padding: "16px" }}
              onClick={() => {
                soundFx.playClick(1100, 0.02);
                setSelectedCard(card);
              }}
            >
              {card.render()}
            </div>
          ))}
        </div>
      )}

      {/* ── ZOOM & PAN CONTROLS OVERLAY ── */}
      {displayMode === "tree" && (
        <div className="canvas-zoom-controls">
          <button type="button" className="zoom-btn" onClick={handleZoomIn} title="Zoom in">
            +
          </button>
          <button type="button" className="zoom-btn" onClick={handleZoomOut} title="Zoom out">
            −
          </button>
          <button type="button" className="zoom-btn" onClick={handleResetZoom} title="Reset view">
            ⊙
          </button>
        </div>
      )}

      {/* ── FOOTER (Exact dmcg.co bottom bar) ── */}
      <footer className="tree-page-footer">
        <div className="tree-footer-left">
          Hedera Consensus Service · Topic 0.0.10697996
        </div>

        {/* Center Grid ⊞ vs Tree ☍ Switcher */}
        <div className="tree-footer-center" role="toolbar" aria-label="Catalog view switcher">
          <button
            type="button"
            className={`tree-mode-toggle ${displayMode === "grid" ? "active" : ""}`}
            onClick={() => {
              soundFx.playClick(850, 0.02);
              setDisplayMode("grid");
            }}
            title="Grid view"
            aria-label="Grid view"
          >
            ⊞
          </button>
          <button
            type="button"
            className={`tree-mode-toggle ${displayMode === "tree" ? "active" : ""}`}
            onClick={() => {
              soundFx.playClick(950, 0.02);
              setDisplayMode("tree");
            }}
            title="Interactive Tree view"
            aria-label="Tree view"
          >
            ☍
          </button>
        </div>

        <div className="tree-footer-right">
          Cryptographically Verified Manifestos
        </div>
      </footer>

      {/* ── CARD DETAIL MODAL / MANIFESTO DOSSIER ── */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="card-detail-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              className="card-detail-modal"
              style={{ maxWidth: "520px" }}
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="card-modal-close"
                onClick={() => setSelectedCard(null)}
              >
                ✕
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", gap: "10px" }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "10.5px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                  {selectedCard.category || "MANIFESTO RECORD"}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    padding: "3px 10px",
                    borderRadius: "9999px",
                    background:
                      selectedCard.status === "Completed"
                        ? "#d1fae5"
                        : selectedCard.status === "Partially Completed"
                        ? "#fef3c7"
                        : selectedCard.status === "In Progress"
                        ? "#e0f2fe"
                        : selectedCard.status === "Incumbent"
                        ? "#111"
                        : "#ede9fe",
                    color:
                      selectedCard.status === "Completed"
                        ? "#065f46"
                        : selectedCard.status === "Partially Completed"
                        ? "#92400e"
                        : selectedCard.status === "In Progress"
                        ? "#0369a1"
                        : selectedCard.status === "Incumbent"
                        ? "#00ff66"
                        : "#6b21a8"
                  }}
                >
                  {selectedCard.status === "Completed"
                    ? "✓ DELIVERED & AUDITED"
                    : selectedCard.status === "Partially Completed"
                    ? "◑ PARTIALLY DELIVERED"
                    : selectedCard.status === "In Progress"
                    ? "⟳ IN PROGRESS"
                    : selectedCard.status === "Incumbent"
                    ? "● INCUMBENT RECORD"
                    : "→ PROPOSED IN MANIFESTO"}
                </span>
              </div>

              <h2 style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em", color: "#0f1d3a", margin: "0 0 4px" }}>
                {selectedCard.title}
              </h2>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#2563eb", marginBottom: "16px" }}>
                {selectedCard.candidateName} {selectedCard.party && `· ${selectedCard.party}`}
              </div>

              {/* Problem / Context */}
              {selectedCard.problem && (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "3px" }}>
                    {selectedCard.status === "Completed" ? "Context / Issue Addressed" : "Current Problem Identified"}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#334155", lineHeight: 1.5 }}>
                    {selectedCard.problem}
                  </div>
                </div>
              )}

              {/* Solution / Action Taken */}
              {selectedCard.solution && (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "3px" }}>
                    {selectedCard.status === "Completed" ? "Action Taken & Delivery" : "Proposed Manifesto Solution"}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#334155", lineHeight: 1.5 }}>
                    {selectedCard.solution}
                  </div>
                </div>
              )}

              {/* Student Impact / Measurable Outcome */}
              {selectedCard.impact && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 14px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#166534", marginBottom: "3px" }}>
                    {selectedCard.status === "Completed" ? "Verified Student Impact" : "Target Student Outcome & Benefit"}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#14532d", lineHeight: 1.5 }}>
                    {selectedCard.impact}
                  </div>
                </div>
              )}

              {/* Evidence & Timeline Row */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "11.5px", color: "#64748b", marginBottom: "20px" }}>
                {selectedCard.evidenceRef && (
                  <div style={{ flex: 1, minWidth: "180px", background: "#f1f5f9", padding: "8px 12px", borderRadius: "8px" }}>
                    <span style={{ fontWeight: "700", display: "block", color: "#334155" }}>Evidence Document:</span>
                    <span style={{ fontFamily: "var(--font-mono, monospace)" }}>{selectedCard.evidenceRef}</span>
                  </div>
                )}
                {selectedCard.targetTimeline && (
                  <div style={{ flex: 1, minWidth: "140px", background: "#f1f5f9", padding: "8px 12px", borderRadius: "8px" }}>
                    <span style={{ fontWeight: "700", display: "block", color: "#334155" }}>Timeline / Phase:</span>
                    <span>{selectedCard.targetTimeline}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="studio-pill-btn"
                  onClick={() => setSelectedCard(null)}
                  style={{ flex: 1, justifyContent: "center", padding: "12px", borderRadius: "9999px" }}
                >
                  Close Dossier
                </button>
                {selectedCard.candidateId && onOpenBallot && (
                  <button
                    type="button"
                    className="spec-cta-pill"
                    onClick={() => handleSelectCandidateToVote(selectedCard.candidateId)}
                    style={{ flex: 2, justifyContent: "center", margin: 0, padding: "12px", borderRadius: "9999px" }}
                  >
                    <span>Support & Cast Ballot</span>
                    <span className="cta-price" style={{ color: "var(--studio-neon-green)" }}>
                      #0{selectedCard.candidateId} ↗
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InteractiveTreeCatalog;
