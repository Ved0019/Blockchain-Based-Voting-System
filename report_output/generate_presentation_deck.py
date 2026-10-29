# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "python-pptx>=1.0.2",
# ]
# ///
"""
generate_presentation_deck.py
Executive-Grade 16:9 Capstone Presentation Deck for:
"Hybrid Cloud and Distributed Ledger E-Voting System"
VIT-AP University · School of Computer Science & Engineering

Generates a complete 16-slide professional presentation matching the 30-minute team script.
Adheres to strict non-AI visual rules:
- 16:9 Widescreen grid geometry (13.333" x 7.5")
- Bento card containers and crisp 1px borders (no loud floating gradients or random emojis)
- Executive color palette: Slate-900 typography, Off-white canvas, Deep Navy brand accent
- Big Stat KPI blocks, clean academic comparison tables, and terminal code boxes
- Top-right Speaker & Time allocation pills for panel defense structure
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ==========================================
# DESIGN SYSTEM TOKENS
# ==========================================
FONT_HEADING = "Calibri"
FONT_BODY    = "Calibri"
FONT_CODE    = "Consolas"

# Professional Color Palette
COLOR_BG_CANVAS     = RGBColor(248, 250, 252) # #F8FAFC
COLOR_CARD_BG       = RGBColor(255, 255, 255) # Pure White
COLOR_CARD_BORDER   = RGBColor(226, 232, 240) # #E2E8F0 (Subtle Slate Border)
COLOR_TEXT_PRIMARY  = RGBColor(15, 23, 42)    # #0F172A (Deep Charcoal)
COLOR_TEXT_SECONDARY= RGBColor(71, 85, 105)   # #475569 (Mid Slate)
COLOR_TEXT_MUTED    = RGBColor(148, 163, 184) # #94A3B8 (Muted Slate)
COLOR_ACCENT_NAVY   = RGBColor(30, 58, 138)   # #1E3A8A (Enterprise Navy)
COLOR_ACCENT_BLUE   = RGBColor(37, 99, 235)   # #2563EB (Accent Blue)
COLOR_CODE_BG       = RGBColor(15, 23, 42)    # #0F172A (Terminal Slate)
COLOR_CODE_TEXT     = RGBColor(241, 245, 249) # #F1F5F9 (Code White)

OUTPUT_PPTX = "/home/vedya/Developer/Projects/Blockchain-Based-Voting-System/report_output/capstone_presentation.pptx"

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]
    return prs, blank_layout

# ==========================================
# COMPONENT BUILDERS
# ==========================================

def add_header(slide, kicker: str, title: str, speaker_badge: str = None, slide_idx: int = None):
    """Adds a structured header with category kicker, bold title, speaker pill, and slide number."""
    # 1. Kicker / Category Overline
    kbox = slide.shapes.add_textbox(Inches(0.8), Inches(0.42), Inches(8.6), Inches(0.28))
    tf_k = kbox.text_frame
    tf_k.word_wrap = True
    tf_k.margin_left = tf_k.margin_top = tf_k.margin_right = tf_k.margin_bottom = 0
    p_k = tf_k.paragraphs[0]
    p_k.text = kicker.upper()
    p_k.font.size = Pt(10)
    p_k.font.bold = True
    p_k.font.color.rgb = COLOR_ACCENT_NAVY
    p_k.font.name = FONT_HEADING

    # 2. Main Title (Assertion Driven)
    tbox = slide.shapes.add_textbox(Inches(0.8), Inches(0.70), Inches(8.6), Inches(0.75))
    tf_t = tbox.text_frame
    tf_t.word_wrap = True
    tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
    p_t = tf_t.paragraphs[0]
    p_t.text = title
    p_t.font.size = Pt(21)
    p_t.font.bold = True
    p_t.font.color.rgb = COLOR_TEXT_PRIMARY
    p_t.font.name = FONT_HEADING

    # 3. Speaker Badge Pill (Top Right)
    if speaker_badge:
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.5), Inches(0.45), Inches(3.033), Inches(0.48))
        pill.fill.solid()
        pill.fill.fore_color.rgb = RGBColor(241, 245, 249)
        pill.line.color.rgb = COLOR_CARD_BORDER
        pill.line.width = Pt(1)
        tf_p = pill.text_frame
        tf_p.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_p = tf_p.paragraphs[0]
        p_p.text = speaker_badge
        p_p.font.size = Pt(10)
        p_p.font.bold = True
        p_p.font.color.rgb = COLOR_TEXT_PRIMARY
        p_p.alignment = PP_ALIGN.CENTER

    # 4. Slide Footer
    if slide_idx:
        fbox = slide.shapes.add_textbox(Inches(0.8), Inches(7.08), Inches(11.733), Inches(0.3))
        tf_f = fbox.text_frame
        tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0
        p_f = tf_f.paragraphs[0]
        p_f.text = f"VIT-AP University · School of Computer Science & Engineering | Capstone Presentation · Slide {slide_idx:02d} of 16"
        p_f.font.size = Pt(9)
        p_f.font.color.rgb = COLOR_TEXT_MUTED

def add_card(slide, left, top, width, height, title: str, bullets: list, badge: str = None, accent_bar: bool = False):
    """Draws a crisp white Bento card container."""
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = COLOR_CARD_BG
    shape.line.color.rgb = COLOR_CARD_BORDER
    shape.line.width = Pt(1)

    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.24)
    tf.margin_right = Inches(0.24)
    tf.margin_top = Inches(0.22)
    tf.margin_bottom = Inches(0.20)

    if badge:
        p_b = tf.paragraphs[0]
        p_b.text = badge.upper()
        p_b.font.size = Pt(9)
        p_b.font.bold = True
        p_b.font.color.rgb = COLOR_ACCENT_NAVY
        p_b.space_after = Pt(3)
        p_title = tf.add_paragraph()
    else:
        p_title = tf.paragraphs[0]

    p_title.text = title
    p_title.font.size = Pt(13.5)
    p_title.font.bold = True
    p_title.font.color.rgb = COLOR_TEXT_PRIMARY
    p_title.space_after = Pt(8)

    for b in bullets:
        p = tf.add_paragraph()
        p.text = f"•  {b}"
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_SECONDARY
        p.space_after = Pt(5)

def add_kpi(slide, left, top, width, height, value: str, label: str, subtext: str):
    """Draws a bold metric KPI container."""
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = COLOR_CARD_BG
    shape.line.color.rgb = COLOR_CARD_BORDER
    shape.line.width = Pt(1)

    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.2)
    tf.margin_right = Inches(0.2)
    tf.margin_top = Inches(0.18)

    p_val = tf.paragraphs[0]
    p_val.text = value
    p_val.font.size = Pt(34)
    p_val.font.bold = True
    p_val.font.color.rgb = COLOR_ACCENT_NAVY
    p_val.space_after = Pt(2)

    p_lbl = tf.add_paragraph()
    p_lbl.text = label.upper()
    p_lbl.font.size = Pt(10)
    p_lbl.font.bold = True
    p_lbl.font.color.rgb = COLOR_TEXT_PRIMARY
    p_lbl.space_after = Pt(4)

    p_sub = tf.add_paragraph()
    p_sub.text = subtext
    p_sub.font.size = Pt(9.5)
    p_sub.font.color.rgb = COLOR_TEXT_SECONDARY

def add_table(slide, left, top, width, height, headers: list, rows: list, col_widths: list = None):
    """Draws a formal comparison table with clean borders and subtle shading."""
    num_rows = len(rows) + 1
    num_cols = len(headers)
    tbl_shape = slide.shapes.add_table(num_rows, num_cols, left, top, width, height)
    tbl = tbl_shape.table

    if col_widths:
        for idx, w in enumerate(col_widths):
            tbl.columns[idx].width = w

    for c_idx, h in enumerate(headers):
        cell = tbl.cell(0, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(241, 245, 249)
        tf = cell.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = h
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_PRIMARY
        p.alignment = PP_ALIGN.CENTER

    for r_idx, row in enumerate(rows):
        for c_idx, val in enumerate(row):
            cell = tbl.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = COLOR_CARD_BG
            tf = cell.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = str(val)
            p.font.size = Pt(10)
            p.font.color.rgb = COLOR_TEXT_PRIMARY
            if len(str(val)) <= 14 and not any(char.isalpha() for char in str(val).replace(".", "")):
                p.alignment = PP_ALIGN.CENTER
            else:
                p.alignment = PP_ALIGN.LEFT

def add_code_terminal(slide, left, top, width, height, title: str, code_snippet: str):
    """Draws a dark-themed terminal snippet card."""
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = COLOR_CODE_BG
    shape.line.color.rgb = COLOR_TEXT_PRIMARY
    shape.line.width = Pt(1)

    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.24)
    tf.margin_right = Inches(0.24)
    tf.margin_top = Inches(0.2)
    tf.margin_bottom = Inches(0.2)

    p_hdr = tf.paragraphs[0]
    p_hdr.text = f"$ {title}"
    p_hdr.font.size = Pt(10.5)
    p_hdr.font.bold = True
    p_hdr.font.name = FONT_CODE
    p_hdr.font.color.rgb = RGBColor(148, 163, 184)
    p_hdr.space_after = Pt(8)

    for line in code_snippet.strip().split("\n"):
        p = tf.add_paragraph()
        p.text = line
        p.font.size = Pt(10)
        p.font.name = FONT_CODE
        p.font.color.rgb = COLOR_CODE_TEXT
        p.space_after = Pt(2)

# ==========================================
# SLIDE BUILDERS (16 SLIDES)
# ==========================================

def build_all_slides():
    prs, blank = create_deck()

    # ----------------------------------------------------
    # SLIDE 1: Title Slide
    # ----------------------------------------------------
    s1 = prs.slides.add_slide(blank)
    tbox = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.1), Inches(11.733), Inches(3.3))
    tbox.fill.solid()
    tbox.fill.fore_color.rgb = COLOR_CARD_BG
    tbox.line.color.rgb = COLOR_CARD_BORDER
    tbox.line.width = Pt(1)
    tf1 = tbox.text_frame
    tf1.margin_left = Inches(0.5)
    tf1.margin_top = Inches(0.4)

    p0 = tf1.paragraphs[0]
    p0.text = "VIT-AP UNIVERSITY · SCHOOL OF COMPUTER SCIENCE & ENGINEERING"
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_ACCENT_NAVY
    p0.space_after = Pt(8)

    p1 = tf1.add_paragraph()
    p1.text = "Hybrid Cloud and Distributed Ledger E-Voting System"
    p1.font.size = Pt(27)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_TEXT_PRIMARY
    p1.space_after = Pt(8)

    p2 = tf1.add_paragraph()
    p2.text = "Project-Based Component (PBC) Capstone Defense · Academic Year 2025–2026"
    p2.font.size = Pt(13)
    p2.font.color.rgb = COLOR_TEXT_SECONDARY
    p2.space_after = Pt(8)

    p3 = tf1.add_paragraph()
    p3.text = "Project Guide: Dr. Nagendra Panini Challa, Associate Professor, SCOPE"
    p3.font.size = Pt(12)
    p3.font.bold = True
    p3.font.color.rgb = COLOR_TEXT_PRIMARY

    roster = [
        ("Speaker 1 (00–07m)", "Student-1", "22BCE8319 / 24MIC7027", "Problem & Literature"),
        ("Speaker 2 (07–14m)", "Student-2", "22BEC8319 / 24MIC7307", "Architecture & aBFT"),
        ("Speaker 3 (14–22m)", "Student-3", "22BCE8506 / 24MIC7302", "Concurrency & Live Demo"),
        ("Speaker 4 (22–29m)", "Student-4", "22BCE8947 / 24MIC7348", "Benchmarks & Defense"),
    ]
    card_w = Inches(2.76)
    gap = Inches(0.23)
    for idx, (spk, name, roll, dom) in enumerate(roster):
        c_left = Inches(0.8) + idx * (card_w + gap)
        add_card(s1, c_left, Inches(4.7), card_w, Inches(2.1), spk, [name, roll, dom], badge="PANEL DEFENDER")

    # ----------------------------------------------------
    # SLIDE 2: Problem Statement
    # ----------------------------------------------------
    s2 = prs.slides.add_slide(blank)
    add_header(s2, "Motivation & Problem Definition", "The Centralized Database Dilemma in Institutional Elections", "Speaker 1 · Min 00:00–07:00", 2)
    c3_w = Inches(3.75)
    c3_gap = Inches(0.24)
    add_card(s2, Inches(0.8), Inches(1.8), c3_w, Inches(4.9), "Privileged DBA Tampering", [
        "Unrestricted Write Access: Root database administrators can alter vote counts or timestamps directly in SQL/NoSQL stores.",
        "Zero Immutable Audit Trail: Database mutation logs can be purged, truncated, or forged without external detection.",
        "Internal Insider Threat: Eliminates the guarantee that final tallies represent cast ballots."
    ], badge="VULNERABILITY 01")

    add_card(s2, Inches(0.8) + c3_w + c3_gap, Inches(1.8), c3_w, Inches(4.9), "Black-Box Tallying", [
        "Opaque State Computation: Voters submit credentials and receive an unprovable 'Vote Recorded' acknowledgment.",
        "Zero Independent Auditing: Outside faculty, observers, or students cannot independently verify that their ballot was counted.",
        "Erosion of Institutional Trust: Disputed elections cause significant governance and administrative friction."
    ], badge="VULNERABILITY 02")

    add_card(s2, Inches(0.8) + 2*(c3_w + c3_gap), Inches(1.8), c3_w, Inches(4.9), "Repudiation & Dispute Friction", [
        "Disenfranchisement Claims: A voter can falsely claim the system failed, or an administrator can deny receipt of a valid vote.",
        "Lack of Cryptographic Non-Repudiation: No deterministic, tamper-proof receipt exists to resolve disputes conclusively.",
        "Single Point of Failure: Centralized cloud VM outages halt the entire electoral intake window."
    ], badge="VULNERABILITY 03")

    # ----------------------------------------------------
    # SLIDE 3: Research Questions
    # ----------------------------------------------------
    s3 = prs.slides.add_slide(blank)
    add_header(s3, "System Formulation & Scope", "Formulating Trust: Four Core Architectural Objectives", "Speaker 1 · Min 00:00–07:00", 3)
    c4_w = Inches(5.74)
    c4_h = Inches(2.3)
    c4_gap = Inches(0.24)
    add_card(s3, Inches(0.8), Inches(1.8), c4_w, c4_h, "RQ1: Concurrency & Race-Condition Freedom", [
        "How can an off-chain gateway prevent double-voting under concurrent microsecond burst traffic without distributed locking bottlenecks?"
    ], badge="RESEARCH QUESTION 01")
    add_card(s3, Inches(0.8) + c4_w + c4_gap, Inches(1.8), c4_w, c4_h, "RQ2: Cost Predictability at Scale", [
        "How can decentralized consensus be integrated into an institutional voting platform while avoiding unpredictable cryptocurrency gas spikes?"
    ], badge="RESEARCH QUESTION 02")
    add_card(s3, Inches(0.8), Inches(4.4), c4_w, c4_h, "RQ3: Zero-PII Voter Anonymity", [
        "Can a public distributed ledger achieve 100% public auditability while guaranteeing zero exposure of student personally identifiable information?"
    ], badge="RESEARCH QUESTION 03")
    add_card(s3, Inches(0.8) + c4_w + c4_gap, Inches(4.4), c4_w, c4_h, "RQ4: aBFT Consensus Guarantees", [
        "What distributed ledger consensus algorithm guarantees deterministic finality with zero fork or chain reorganization vulnerability?"
    ], badge="RESEARCH QUESTION 04")

    # ----------------------------------------------------
    # SLIDE 4: Technology Selection Matrix
    # ----------------------------------------------------
    s4 = prs.slides.add_slide(blank)
    add_header(s4, "Literature Review & Empirical Analysis", "Architectural Comparison: Hedera HCS vs. Classical Blockchains", "Speaker 1 · Min 00:00–07:00", 4)
    t_headers = ["Evaluation Metric", "Ethereum L1", "Polygon PoS (L2)", "Solana", "Hedera HCS (Our System)"]
    t_rows = [
        ["Consensus Protocol", "Proof of Stake (PoS)", "PoS Rollup", "Proof of History (PoH)", "Hashgraph aBFT (Virtual Voting)"],
        ["Finality Latency", "12 – 15 minutes", "2 – 4 minutes", "400 ms – 12 seconds", "3.8 seconds (Deterministic)"],
        ["Transaction Cost", "$2.50 – $45.00 (Gas)", "$0.02 – $0.15", "$0.0025", "$0.0001 USD (Fixed Fiat Peg)"],
        ["Forking Vulnerability", "Probabilistic Forks", "Possible Reorgs", "Network Outages (History)", "Mathematically Immune (aBFT)"],
        ["Throughput (TPS)", "15 – 30 TPS", "~7,000 TPS", "2,000 – 3,000 TPS", "10,000+ TPS Tested"],
        ["Ledger Governance", "Miner / Validator Pool", "Multisig Validators", "Validator Cluster", "Decentralized Governing Council"]
    ]
    t_widths = [Inches(2.5), Inches(2.2), Inches(2.2), Inches(2.2), Inches(2.633)]
    add_table(s4, Inches(0.8), Inches(1.85), Inches(11.733), Inches(4.8), t_headers, t_rows, t_widths)

    # ----------------------------------------------------
    # SLIDE 5: System Architecture Pipeline
    # ----------------------------------------------------
    s5 = prs.slides.add_slide(blank)
    add_header(s5, "System Architecture & Flow", "Decoupled Off-Chain Ingestion & On-Chain Consensus Pipeline", "Speaker 2 · Min 07:00–14:00", 5)
    p_w = Inches(2.76)
    p_gap = Inches(0.23)
    add_card(s5, Inches(0.8) + 0*(p_w+p_gap), Inches(1.8), p_w, Inches(4.9), "1. Client Web Layer", [
        "React 18 Single-Page Application.",
        "Role-Based Authentication: Voter vs Administrator portals.",
        "Client-Side Validation: Real-time ballot validation before network dispatch.",
        "Session Storage: Ephemeral token and receipt storage."
    ], badge="TIER 1: FRONTEND")
    add_card(s5, Inches(0.8) + 1*(p_w+p_gap), Inches(1.8), p_w, Inches(4.9), "2. API Gateway", [
        "Node.js & Express REST Service.",
        "Stateless JWT Verification with tamper-proof signing.",
        "Express Rate-Limiting: 100 requests / 15 min per IP window.",
        "CORS & Helmet Security Headers enforcing strict transport isolation."
    ], badge="TIER 2: GATEWAY")
    add_card(s5, Inches(0.8) + 2*(p_w+p_gap), Inches(1.8), p_w, Inches(4.9), "3. Off-Chain Store", [
        "MongoDB with WiredTiger Storage Engine.",
        "Document-Level Locking: Exclusive write lock per student record.",
        "Atomic findOneAndUpdate() eliminates double-voting races.",
        "PII Isolation: Stores student credentials off-chain."
    ], badge="TIER 3: DATABASE")
    add_card(s5, Inches(0.8) + 3*(p_w+p_gap), Inches(1.8), p_w, Inches(4.9), "4. Consensus Layer", [
        "Hedera Consensus Service (HCS).",
        "Public Topic: 0.0.10697996.",
        "Consensus Submit Message SDK calls over gRPC TLS.",
        "Immutable sequence numbering and nanosecond consensus timestamps."
    ], badge="TIER 4: LEDGER")

    # ----------------------------------------------------
    # SLIDE 6: Hashgraph aBFT Consensus
    # ----------------------------------------------------
    s6 = prs.slides.add_slide(blank)
    add_header(s6, "Distributed Ledger Mechanics", "Virtual Voting & Asynchronous Byzantine Fault Tolerance (aBFT)", "Speaker 2 · Min 07:00–14:00", 6)
    add_card(s6, Inches(0.8), Inches(1.8), Inches(3.75), Inches(4.9), "Gossip-about-Gossip", [
        "Node Communication: Nodes do not just transmit transactions; they transmit a 2-hash event containing the history of gossip.",
        "Directed Acyclic Graph (DAG): The graph of events grows exponentially without network bottlenecks.",
        "Extreme Bandwidth Efficiency: Near-zero consensus messaging overhead compared to Raft or PBFT."
    ], badge="MECHANISM 01")
    add_card(s6, Inches(4.79), Inches(1.8), Inches(3.75), Inches(4.9), "Virtual Voting Algorithm", [
        "Zero Network Overhead: Nodes determine consensus ordering entirely in local memory by inspecting their local DAG view.",
        "No Extra Vote Messages: Traditional consensus protocols flood the network with vote ballots; Hashgraph votes virtually.",
        "Fairness of Ordering: Median timestamp consensus prevents miner front-running and ballot reordering attacks."
    ], badge="MECHANISM 02")
    add_card(s6, Inches(8.78), Inches(1.8), Inches(3.75), Inches(4.9), "Mathematical aBFT Guarantee", [
        "Gold Standard Security: Immune to arbitrary malicious Byzantine nodes and coordinated DDoS attacks.",
        "Quorum Formulation: Tolerates up to f malicious nodes where n >= 3f + 1.",
        "Deterministic Finality: Zero probability of blockchain reorganizations, soft forks, or orphan blocks."
    ], badge="SECURITY PROOF")

    # ----------------------------------------------------
    # SLIDE 7: Privacy & Payload Decoupling
    # ----------------------------------------------------
    s7 = prs.slides.add_slide(blank)
    add_header(s7, "Privacy Preserving Architecture", "Structural Decoupling: Zero PII Exposure on the Public Ledger", "Speaker 2 · Min 07:00–14:00", 7)
    add_card(s7, Inches(0.8), Inches(1.8), Inches(5.74), Inches(3.6), "Off-Chain Private Voter Record (MongoDB)", [
        "Document Content: { _id, voterId: '22BCE8319', email: 'student@vitap.ac.in', hasVoted: true, timestamp }",
        "Role: Enforces local eligibility, enrollment verification, and one-vote-per-student compliance.",
        "Access Boundary: Protected behind institutional JWT authentication and strict VPC firewall policies."
    ], badge="PRIVATE INSTITUTIONAL BOUNDARY")
    add_card(s7, Inches(6.78), Inches(1.8), Inches(5.74), Inches(3.6), "On-Chain Public Consensus Message (Hedera HCS)", [
        "Payload Dispatched: { candidateId: 2, timestamp: 1718000000.123 }",
        "Public HashScan Visibility: Auditors observe that a valid vote was cast, its exact nanosecond, and sequence number.",
        "Zero Cryptographic Link: Contains zero voter names, student IDs, IP addresses, or database primary keys."
    ], badge="PUBLIC CONSENSUS TOPIC 0.0.10697996")
    add_kpi(s7, Inches(0.8), Inches(5.6), Inches(3.75), Inches(1.3), "0 Bytes", "PII Exposed On-Chain", "Zero student personal information stored on the public ledger.")
    add_kpi(s7, Inches(4.79), Inches(5.6), Inches(3.75), Inches(1.3), "100%", "Independent Auditability", "Any third party can recount the election results directly from Mirror Nodes.")
    add_kpi(s7, Inches(8.78), Inches(5.6), Inches(3.75), Inches(1.3), "SHA-384", "Running Hash Integrity", "Each message is chained into an unbroken cryptographic hash sequence.")

    # ----------------------------------------------------
    # SLIDE 8: Cost Model & Economics
    # ----------------------------------------------------
    s8 = prs.slides.add_slide(blank)
    add_header(s8, "Economic Viability & Sustainability", "Fiat-Pegged Pricing Eliminates Gas Price Volatility", "Speaker 2 · Min 07:00–14:00", 8)
    add_kpi(s8, Inches(0.8), Inches(1.8), Inches(3.75), Inches(1.8), "$0.0001", "Fixed HCS Transaction Fee", "Directly pegged to USD by the Hedera Governing Council; paid in HBAR.")
    add_kpi(s8, Inches(4.79), Inches(1.8), Inches(3.75), Inches(1.8), "$1.00", "Total Cost / 10,000 Votes", "Entire university elections can be conducted with negligible financial overhead.")
    add_kpi(s8, Inches(8.78), Inches(1.8), Inches(3.75), Inches(1.8), "98.4%", "Cost Reduction vs. Polygon", "Immune to network congestion, MEV bot bidding wars, and gas surges.")
    add_card(s8, Inches(0.8), Inches(3.85), Inches(11.733), Inches(2.85), "Economic Model Comparison & Budget Predictability", [
        "Ethereum L1 Vulnerability: Gas surges during high DeFi volume can push ballot submission costs above $15.00 per vote, breaking institutional budgets.",
        "Polygon & Rollup Volatility: Even Layer-2 gas fees fluctuate wildly during network congestion, requiring complex gas treasury auto-replenishment systems.",
        "Hedera Governing Council Stability: Fees are fixed in fiat USD and automatically converted to HBAR at execution time. A 15,000-student election has a guaranteed maximum cost of exactly $1.50 USD."
    ], badge="INSTITUTIONAL BUDGET GUARANTEE")

    # ----------------------------------------------------
    # SLIDE 9: Concurrency & Double-Voting
    # ----------------------------------------------------
    s9 = prs.slides.add_slide(blank)
    add_header(s9, "Backend Concurrency Control", "Preventing Race Conditions via WiredTiger Document Locking", "Speaker 3 · Min 14:00–22:00", 9)
    add_kpi(s9, Inches(0.8), Inches(1.8), Inches(3.6), Inches(1.5), "0.0%", "Double-Voting Margin", "Zero double-votes recorded across 500 concurrent burst tests.")
    add_kpi(s9, Inches(0.8), Inches(3.45), Inches(3.6), Inches(1.5), "100%", "Write Serialization", "MongoDB WiredTiger document-level locking serializes concurrent updates.")
    add_kpi(s9, Inches(0.8), Inches(5.10), Inches(3.6), Inches(1.5), "403", "Forbidden Status", "Second concurrent thread instantly rejected before reaching Hedera.")

    code_text = (
        "// Atomic Claim in Node.js / Express Gateway\n"
        "const voter = await Voter.findOneAndUpdate(\n"
        "  { voterId: req.user.voterId, hasVoted: false }, // Atomic Filter\n"
        "  { $set: { hasVoted: true, votedAt: new Date() } },\n"
        "  { new: true, session } // Document-level write lock\n"
        ");\n"
        "\n"
        "if (!voter) {\n"
        "  // 2nd concurrent thread evaluates to null\n"
        "  return res.status(403).json({\n"
        "    error: 'Ballot already cast or claim in progress.'\n"
        "  });\n"
        "}\n"
        "// Proceed safely to Hedera HCS submission..."
    )
    add_code_terminal(s9, Inches(4.65), Inches(1.8), Inches(7.88), Inches(4.8), "concurrency_controller.js", code_text)

    # ----------------------------------------------------
    # SLIDE 10: Two-Phase Commit & Fail-Safe Rollback
    # ----------------------------------------------------
    s10 = prs.slides.add_slide(blank)
    add_header(s10, "Fault Tolerance & State Recovery", "Fail-Safe Atomic Rollback Prevents Voter Disenfranchisement", "Speaker 3 · Min 14:00–22:00", 10)
    add_card(s10, Inches(0.8), Inches(1.8), Inches(3.75), Inches(4.9), "Phase 1: Local State Lock", [
        "Voter dispatches authenticated HTTP POST /vote request.",
        "MongoDB executes atomic findOneAndUpdate({ hasVoted: false }).",
        "State immediately marked hasVoted: true in local memory.",
        "Ensures no concurrent duplicate request can enter the pipeline while HCS network call is pending."
    ], badge="PHASE 1: ATOMIC CLAIM")
    add_card(s10, Inches(4.79), Inches(1.8), Inches(3.75), Inches(4.9), "Phase 2: Remote HCS Consensus", [
        "Backend constructs Hedera TopicMessageSubmitTransaction.",
        "Payload signed with institutional Operator Key and sent over gRPC TLS.",
        "Hedera Hashgraph consensus network assigns immutable timestamp and sequence number.",
        "Receipt transaction ID returned to caller."
    ], badge="PHASE 2: CONSENSUS ORDERING")
    add_card(s10, Inches(8.78), Inches(1.8), Inches(3.75), Inches(4.9), "Fail-Safe Rollback Handler", [
        "Catastrophic failure handling: network partition or Hedera gRPC timeout.",
        "Automated catch block detects missing consensus receipt.",
        "Executes atomic rollback: $set { hasVoted: false }.",
        "Voter is NOT disenfranchised and can safely retry ballot submission."
    ], badge="FAIL-SAFE RECOVERY")

    # ----------------------------------------------------
    # SLIDE 11: Live Demonstration Plan
    # ----------------------------------------------------
    s11 = prs.slides.add_slide(blank)
    add_header(s11, "System Demonstration", "Live System Verification: End-to-End Ballot Journey", "Speaker 3 · Min 14:00–22:00", 11)
    add_card(s11, Inches(0.8), Inches(1.8), Inches(3.75), Inches(4.9), "Step 1: Voter Portal Cast", [
        "Voter logs into React SPA (http://localhost:5173).",
        "Selects Candidate and clicks 'Submit Vote'.",
        "Real-time visual feedback: Button enters loading state, dispatches signed payload to port 5000.",
        "Browser displays instant success dialog with cryptographic Transaction ID."
    ], badge="DEMO STAGE 1: FRONTEND")
    add_card(s11, Inches(4.79), Inches(1.8), Inches(3.75), Inches(4.9), "Step 2: HashScan Explorer", [
        "Switch to Browser Tab 2: HashScan Explorer.",
        "Inspect public topic: https://hashscan.io/testnet/topic/0.0.10697996.",
        "Observer verifies: Message count increments by 1 in real-time.",
        "Inspect consensus timestamp, sequence number, and running hash."
    ], badge="DEMO STAGE 2: HASHSCAN")
    add_card(s11, Inches(8.78), Inches(1.8), Inches(3.75), Inches(4.9), "Step 3: Mirror Node Audit", [
        "Switch to Browser Tab 3: Mirror Node REST API.",
        "Query GET /api/v1/topics/0.0.10697996/messages.",
        "Demonstrate JSON payload decoding: candidateId: 2, timestamp: 1718000000.123.",
        "Proves independent, trustless auditability without database access."
    ], badge="DEMO STAGE 3: MIRROR API")

    # ----------------------------------------------------
    # SLIDE 12: Independent Public Auditability
    # ----------------------------------------------------
    s12 = prs.slides.add_slide(blank)
    add_header(s12, "Ledger Verification Mechanics", "Trustless Verification: HashScan Explorer & Mirror Node REST API", "Speaker 3 · Min 14:00–22:00", 12)
    add_card(s12, Inches(0.8), Inches(1.8), Inches(5.74), Inches(4.9), "Cryptographic Transaction ID Receipt", [
        "Receipt Structure: 0.0.10697996@1718000000.123456789.",
        "Issued directly to the voter upon consensus confirmation.",
        "Non-Repudiable Evidence: Neither the student nor the administration can falsely claim whether a vote was cast.",
        "Enables independent ballot tracking across public blockchain explorers worldwide."
    ], badge="AUDIT COMPONENT 01")
    add_card(s12, Inches(6.78), Inches(1.8), Inches(5.74), Inches(4.9), "Decentralized Mirror Node REST API", [
        "Public API Endpoint: mainnet-public.mirrornode.hedera.com.",
        "Zero Rate-Limits for Civic Auditors: Mirror nodes run independently of consensus nodes.",
        "Running SHA-384 Hash Chaining: Each message contains the running hash of all previous messages, making history deletion mathematically impossible.",
        "Automated Verification Scripts: Anyone can tally the election with a 10-line Python or cURL script."
    ], badge="AUDIT COMPONENT 02")

    # ----------------------------------------------------
    # SLIDE 13: Empirical Benchmarks
    # ----------------------------------------------------
    s13 = prs.slides.add_slide(blank)
    add_header(s13, "Empirical Results & Benchmarks", "System Performance: Latency, Throughput, and Finality Under Load", "Speaker 4 · Min 22:00–29:00", 13)
    add_kpi(s13, Inches(0.8), Inches(1.8), Inches(3.75), Inches(1.8), "3.82s", "End-to-End Finality", "Measured average time from user click to global Hedera consensus ordering.")
    add_kpi(s13, Inches(4.79), Inches(1.8), Inches(3.75), Inches(1.8), "68 ms", "API Gateway Latency", "Local JWT verification, WiredTiger claim, and payload serialization time.")
    add_kpi(s13, Inches(8.78), Inches(1.8), Inches(3.75), Inches(1.8), "100.0%", "Consensus Delivery Rate", "Zero dropped messages or consensus timeout failures across all test rounds.")
    add_card(s13, Inches(0.8), Inches(3.85), Inches(11.733), Inches(2.85), "Benchmark Execution Methodology & Test Conditions", [
        "Test Bed: 500 concurrent ballot requests simulated via automated test harness under variable network delay.",
        "Throughput Stability: Hedera Consensus Service maintained constant sub-4-second finality with zero queuing latency or memory leaks.",
        "Cost Stability: Total network fee across 500 test votes was exactly $0.05 USD, matching theoretical models perfectly."
    ], badge="BENCHMARK METHODOLOGY")

    # ----------------------------------------------------
    # SLIDE 14: STRIDE Threat Model
    # ----------------------------------------------------
    s14 = prs.slides.add_slide(blank)
    add_header(s14, "Security & Threat Analysis", "Comprehensive STRIDE Threat Modeling Evaluation", "Speaker 4 · Min 22:00–29:00", 14)
    s_headers = ["STRIDE Threat", "Attack Vector", "Architectural Mitigation", "Residual Risk"]
    s_rows = [
        ["Spoofing", "Unauthorized voter impersonation", "Stateless cryptographically signed JWTs + password hashing", "Negligible (Protected by Auth)"],
        ["Tampering", "Altering ballot tally in database", "Public Hedera HCS sequence numbering + SHA-384 running hash", "Zero (Tamper-Evident Ledger)"],
        ["Repudiation", "Voter denies casting ballot", "Deterministic transaction ID receipt verified on HashScan explorer", "Zero (Cryptographic Proof)"],
        ["Information Disclosure", "Eavesdropping voter identities", "Zero PII stored on ledger; structural decoupling of ballot payload", "Zero (Decoupled Payload)"],
        ["Denial of Service", "Gateway flood attacks", "Express rate limiting (100 req/15m) + stateless gateway architecture", "Low (Scalable via Cloud Load Balancer)"],
        ["Elevation of Privilege", "Student escalates to admin", "Role-based authorization middleware enforcing strict permission gates", "Negligible (Strict RBAC)"]
    ]
    s_widths = [Inches(2.0), Inches(3.2), Inches(4.733), Inches(1.8)]
    add_table(s14, Inches(0.8), Inches(1.85), Inches(11.733), Inches(4.8), s_headers, s_rows, s_widths)

    # ----------------------------------------------------
    # SLIDE 15: Limitations & Future Roadmap
    # ----------------------------------------------------
    s15 = prs.slides.add_slide(blank)
    add_header(s15, "Technical Limitations & Roadmap", "Architectural Evolution: zk-SNARKs & Threshold Multi-Sig Governance", "Speaker 4 · Min 22:00–29:00", 15)
    add_card(s15, Inches(0.8), Inches(1.8), Inches(3.75), Inches(4.9), "Threshold Multi-Sig Keys", [
        "Current Limitation: Testnet uses a single institutional operator key to submit HCS messages.",
        "Roadmap Solution: Deploy Hedera multi-signature threshold accounts on mainnet.",
        "Governance Guardrail: Requires 3 out of 5 designated faculty election commissioners to co-sign the submission transaction."
    ], badge="MILESTONE 1: GOVERNANCE")
    add_card(s15, Inches(4.79), Inches(1.8), Inches(3.75), Inches(4.9), "Client-Side zk-SNARKs", [
        "Current Limitation: Database-level decoupling prevents public observer tracking, but a compromised DBA could correlate database timestamps.",
        "Roadmap Solution: Implement Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (zk-SNARKs).",
        "Mathematical Anonymity: Voter proves eligibility cryptographically in the browser with 0 correlation to cast ballot."
    ], badge="MILESTONE 2: PRIVACY")
    add_card(s15, Inches(8.78), Inches(1.8), Inches(3.75), Inches(4.9), "Decentralized Identity (DID)", [
        "Current Limitation: Relies on institutional username/password authentication.",
        "Roadmap Solution: Integrate W3C Verifiable Credentials and self-sovereign Decentralized Identifiers (DIDs).",
        "Decentralized Login: Students authenticate directly via digital identity wallets without centralized institutional ID databases."
    ], badge="MILESTONE 3: IDENTITY")

    # ----------------------------------------------------
    # SLIDE 16: Conclusion & Evaluator Defense
    # ----------------------------------------------------
    s16 = prs.slides.add_slide(blank)
    add_header(s16, "Project Conclusion & Panel Hand-Off", "Summary of Contributions & Open Technical Defense", "All Team Members · Evaluator Defense", 16)
    add_card(s16, Inches(0.8), Inches(1.8), Inches(5.74), Inches(4.9), "Key Technical Contributions", [
        "Decoupled Hybrid Architecture: Combines local database throughput with global Hedera Hashgraph aBFT consensus integrity.",
        "Sub-Second Finality: 3.82s deterministic finality with zero blockchain reorganization risk.",
        "Cost Sustainability: $0.0001 USD fixed transaction fee eliminates gas volatility.",
        "Race-Condition Freedom: Proven WiredTiger document-level locking eliminates double-voting entirely.",
        "Public Trustless Verification: 100% independent tally auditability via HashScan and public Mirror Node REST APIs."
    ], badge="DELIVERED CONTRIBUTIONS")
    add_card(s16, Inches(6.78), Inches(1.8), Inches(5.74), Inches(4.9), "Evaluator Defense Focus Areas", [
        "Q1: Operator Key Single Point of Failure -> Separation of submission rights from consensus ordering; Threshold Multi-sig migration.",
        "Q2: Race Condition Prevention -> MongoDB WiredTiger exclusive write locking on { voterId, hasVoted: false }.",
        "Q3: HCS vs Ethereum Rollups -> Fiat-pegged fee predictability ($1/10k votes) vs gas volatility; sub-4s deterministic aBFT finality.",
        "Q4: Voter Identity Privacy -> Structural decoupling; payload contains { candidateId, timestamp } with zero student PII.",
        "Q5: Non-Repudiation Proof -> Cryptographic Transaction IDs verified on public HashScan explorer."
    ], badge="PANEL DEFENSE READINESS")

    # Save presentation
    os.makedirs(os.path.dirname(OUTPUT_PPTX), exist_ok=True)
    prs.save(OUTPUT_PPTX)
    print(f"✅ Generated executive presentation deck at: {OUTPUT_PPTX}")
    print(f"📊 Slide count: {len(prs.slides)} slides (16:9 Widescreen)")

if __name__ == "__main__":
    build_all_slides()
