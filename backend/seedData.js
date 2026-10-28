const mongoose = require("mongoose");
require("dotenv").config();

const Candidate = require("./models/Candidate");
const CampusIssue = require("./models/CampusIssue");
const EvidenceDoc = require("./models/EvidenceDoc");
const Election = require("./models/Election");

const seedManifestoData = async () => {
  try {
    console.log("Seeding realistic college election manifesto data...");

    // Update or create Election metadata
    let election = await Election.findOne();
    if (!election) {
      election = new Election({
        title: "Student Council General Election",
        institutionName: "Apex Institute of Technology & Engineering",
        academicYear: "2025–2026",
        electionPhase: "Official Voting Phase",
        votingDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        isActive: true,
        topicId: process.env.HCS_TOPIC_ID || "0.0.10697996"
      });
      await election.save();
    } else {
      election.title = "Student Council General Election 2026";
      election.institutionName = "Apex Institute of Technology & Engineering";
      election.academicYear = "2025–2026";
      election.electionPhase = "Official Voting Phase";
      if (!election.votingDeadline || election.votingDeadline < new Date()) {
        election.votingDeadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      }
      election.isActive = true;
      await election.save();
    }

    // 14 Categories defined for manifestos
    // 1. Academic Excellence
    // 2. Library and Learning Resources
    // 3. Campus Infrastructure
    // 4. Wi-Fi and Digital Facilities
    // 5. Sports and Gym Facilities
    // 6. Student Clubs and Cultural Events
    // 7. Student Safety and Anti-Ragging
    // 8. Transport and Hostel Facilities
    // 9. Canteen Food Quality and Affordability
    // 10. Mental Wellbeing and Student Support
    // 11. Internship, Placement and Career Development
    // 12. Student Grievances and Transparency
    // 13. Accessibility and Inclusive Campus
    // 14. Environment and Sustainability

    const candidatesData = [
      {
        candidateId: "1",
        name: "Aarav Sharma",
        party: "Progressive Student Alliance (PSA)",
        partyDescription: "Center-left student coalition focused on infrastructure modernization, digital governance, and evidence-based policy. Formed in 2022 by merger of Tech Students Forum and Campus Reform Group.",
        partyFounded: "2022",
        partyIdeology: "Progressive, Technocratic, Reformist",
        avatarIpfs: "",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        position: "Student Council President",
        department: "Computer Science & Engineering",
        year: "4th Year / Senior",
        isIncumbent: true,
        tagline: "Accountable Leadership: Proven Delivery and Long-Term Campus Modernization",
        bio: "Serving as Council President for the 2024–2025 academic term, Aarav spearheaded the installation of commercial RO water purifiers across all 6 dormitories, negotiated late-night library study hall extensions during finals, and secured estate funding for sports court renovations. Contesting for re-election to complete hostel Wi-Fi 6 expansion, launch the automated ERP grievance portal, and expand subsidized meals.",
        experience: [
          "Student Council President (2024–2025 term)",
          "Undergraduate Academic Senate Representative (2023–2024)",
          "Core Convener, National Collegiate Hackathon 'ApexHack' (2023)",
          "Hostel A Resident Welfare Committee Member (2022–2023)"
        ],
        priorities: [
          "Campus-wide high-density Wi-Fi 6 rollout across all dormitories",
          "24/7 central library reading hall access with biometric security",
          "Affordable, nutritious ₹35 campus canteen meal subsidy",
          "Fully digitized, time-bound academic grievance tracking system"
        ],
        keyPromises: [
          "Complete Phase 2 & 3 Wi-Fi 6 installation in Hostels B & C",
          "Institute a permanent 24/7 exam study commons in the central library",
          "Enforce mandatory quarterly food quality hygiene ratings in all 3 cafeterias",
          "Establish a ₹15 Lakhs alumni-backed student venture & project fund"
        ],
        manifesto: [
          {
            id: "C1-P01",
            category: "Academic Excellence",
            title: "Standardized Lab Equipment Upgrades & Open Project Workspaces",
            currentProblem: "Core departmental laboratories (ECE, ME, CSE) suffer from outdated oscilloscopes and insufficient GPU compute nodes for student capstone projects.",
            proposedSolution: "Sanction institutional lab modernization fund from alumni endowment and reallocate unspent council equipment grants for 4 shared high-performance computing clusters.",
            expectedBenefit: "Direct access to industry-grade hardware for over 1,200 engineering students working on final-year dissertations and competitive robotics.",
            targetTimeline: "Q2 2026 (Month 4 of new term)",
            implementationSteps: [
              "Form joint student-faculty lab audit committee",
              "Float equipment purchase tender through Central Procurement Division",
              "Install dedicated GPU compute server accessible via campus intranet VPN",
              "Establish 24-hour pre-booking portal for lab project workstations"
            ],
            dependenciesAndBudget: "Requires ₹8.5 Lakhs co-funding from Central Tech Budget; Dean of Academics approval needed.",
            measurableMetrics: "At least 40 concurrent GPU lab sessions active; average workstation downtime reduced below 4%.",
            status: "Proposed",
            evidenceRef: "Senate Lab Committee Review #SLC-2025"
          },
          {
            id: "C1-P02",
            category: "Library and Learning Resources",
            title: "Permanent 24/7 Central Library Study Commons with Power Pods",
            currentProblem: "Library currently closes at 9:00 PM on normal days and 2:00 AM during exams, leaving hostel students with overcrowded, noisy common rooms.",
            proposedSolution: "Extend 2nd Floor East Wing as a permanent 24/7 silent reading commons with biometric card turnstiles, CCTV coverage, and night attendant shifts.",
            expectedBenefit: "Quiet, air-conditioned, well-lit study environment for 350+ students every night without disrupting day library staff.",
            targetTimeline: "Q1 2026 (Within 60 days of inauguration)",
            implementationSteps: [
              "Obtain Chief Librarian and Estate Security concurrence",
              "Install smart RFID/biometric readers at East Wing glass partition",
              "Contract dedicated security officer for 10 PM – 7 AM shift",
              "Deploy 120 charging strip stations across all carrels"
            ],
            dependenciesAndBudget: "Requires monthly security allocation of ₹28,000 approved by Student Welfare Fund.",
            measurableMetrics: "Daily night footfall logs maintained; student satisfaction survey score > 85%.",
            status: "Proposed",
            evidenceRef: "Senate Minutes #ASM-88"
          },
          {
            id: "C1-P03",
            category: "Campus Infrastructure",
            title: "Covered Walkways & Solar Rain-Canopies Between Academic Blocks",
            currentProblem: "Extreme monsoons and summer heat make walking between Academic Block 1, Block 2, and the Cafeteria difficult for students and faculty.",
            proposedSolution: "Construct eco-friendly tensile fabric canopies with integrated solar PV lighting along the 400m primary inter-block pathway.",
            expectedBenefit: "Weatherproof transit across campus, shaded pedestrian corridors, and nighttime solar illumination.",
            targetTimeline: "Q3 2026 (Before monsoon semester)",
            implementationSteps: [
              "Civil engineering department faculty design competition",
              "Estate Office tender issuance for modular galvanized steel frames",
              "Phase 1 canopy erection between Library and Admin quadrangle"
            ],
            dependenciesAndBudget: "₹12 Lakhs estimated capital outlay through University Infrastructure Grant.",
            measurableMetrics: "400 meters of continuous sheltered pathway operational by July 2026.",
            status: "Proposed",
            evidenceRef: "Campus Master Plan #CMP-2026"
          },
          {
            id: "C1-P04",
            category: "Wi-Fi and Digital Facilities",
            title: "Hostel Wi-Fi 6 Completion (Phases 2 & 3 for Hostels B, C, and D)",
            currentProblem: "While Hostel A was upgraded during the 2024 term, Hostels B and C still experience severe dead zones and bandwidth throttling below 5 Mbps during peak hours.",
            proposedSolution: "Directly execute Phase 2 & 3 optical fiber backhaul and install 72 dual-band Wi-Fi 6 enterprise access points across all corridors.",
            expectedBenefit: "Consistent 80+ Mbps bandwidth per room, seamless roaming across hostel wings, and zero dead zones in common rooms.",
            targetTimeline: "Q1 2026 (Within 90 days)",
            implementationSteps: [
              "Finalize pending vendor contract from Q4 2024 tender",
              "Run CAT-6A structured cabling in Hostels B and C vertical shafts",
              "Deploy cloud-managed Cisco/Ubiquiti access points with load balancing",
              "Conduct live student bandwidth heat-map verification"
            ],
            dependenciesAndBudget: "Pending allocation of ₹6.2 Lakhs already approved in principle by IT Committee.",
            measurableMetrics: "Minimum throughput of 50 Mbps in 98% of hostel rooms at 10 PM peak load.",
            status: "Proposed",
            evidenceRef: "IT Audit Report #IT-2025-11"
          },
          {
            id: "C1-P05",
            category: "Sports and Gym Facilities",
            title: "Indoor Gymnasium Modernization & Women's Dedicated Fitness Zone",
            currentProblem: "Campus gym equipment is deteriorating with rusty cables and dumbbells, and female students report feeling uncomfortable during crowded evening hours.",
            proposedSolution: "Procure brand-new commercial cardio/weight equipment, install shock-absorbing rubber flooring, and introduce dedicated morning/evening reserved slots for women with a certified female trainer.",
            expectedBenefit: "Inclusive, modern fitness center catering to all 3,500 campus students with safe, supervised training.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Replace broken multi-stations and treadmills with commercial units",
              "Hire certified female fitness coach for 6:00 AM – 8:30 AM and 4:30 PM – 6:00 PM slots",
              "Install ventilation and air-conditioning fans"
            ],
            dependenciesAndBudget: "Funded via Sports Council reserve fund (₹4.5 Lakhs allocated).",
            measurableMetrics: "300% increase in female student gym registrations; zero safety incident reports.",
            status: "Proposed",
            evidenceRef: "Work Order #WD-4091"
          },
          {
            id: "C1-P06",
            category: "Student Clubs and Cultural Events",
            title: "Transparent Club Budget Allocation & One-Click Auditing System",
            currentProblem: "Student clubs face bureaucratic delays of up to 6 weeks to get reimbursement approvals from the Student Welfare office for events.",
            proposedSolution: "Implement a digital ledger-backed reimbursement portal with a strict 7-day SLA for claims under ₹15,000, and publish open semester club spending sheets.",
            expectedBenefit: "Rapid funding for cultural, debate, coding, and dramatics events without personal out-of-pocket delays for student organizers.",
            targetTimeline: "Q1 2026",
            implementationSteps: [
              "Integrate automated invoice submission module on student intranet",
              "Mandate Dean of Student Affairs digital signature approval within 5 working days",
              "Hold bi-annual open town hall for club conveners"
            ],
            dependenciesAndBudget: "Software built by student developers; minimal server cost of ₹5,000/yr.",
            measurableMetrics: "Average reimbursement processing turnaround dropped from 42 days to under 7 days.",
            status: "Proposed",
            evidenceRef: "Council Resolution #CR-2024-09"
          },
          {
            id: "C1-P07",
            category: "Student Safety and Anti-Ragging",
            title: "Confidential QR-Code Anti-Bullying Incident Beacon Network",
            currentProblem: "Junior students hesitate to report intimidation or subtle ragging at administrative offices due to fear of identity exposure.",
            proposedSolution: "Deploy tamper-proof QR beacons in private corners, restrooms, and hostel entrances linked to an encrypted anonymous whistleblower channel monitored by the Ombudsman.",
            expectedBenefit: "Total whistleblower privacy, rapid intervention by anti-ragging flying squads within 15 minutes of trigger.",
            targetTimeline: "Q1 2026 (Immediate)",
            implementationSteps: [
              "Affix tamper-evident QR plates across campus locations",
              "Route alerts directly to Chief Security Officer and Anti-Ragging Committee",
              "Conduct mandatory zero-tolerance awareness workshops during freshman orientation"
            ],
            dependenciesAndBudget: "Administrative sanction from Proctor's Office.",
            measurableMetrics: "100% of reported beacons investigated within 12 hours; 0 unauthorized data disclosures.",
            status: "Proposed",
            evidenceRef: "Proctorial Board Memo #PBM-2025"
          },
          {
            id: "C1-P08",
            category: "Transport and Hostel Facilities",
            title: "Late-Night Campus Transit Van & Automated Laundry Expansion",
            currentProblem: "Outer hostel blocks are 1.4 km away from the main gate; students returning from research labs past 10 PM face unlit roads without public transit.",
            proposedSolution: "Deploy a university-operated 14-seater electric van running 20-minute shuttle loops between 7:30 PM and 12:30 AM, and add 8 commercial washing machines in Hostels C & D.",
            expectedBenefit: "Safe night mobility for all students and elimination of 3-day laundry wait times.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Procure electric transit van on 3-year operating lease",
              "Publish live GPS tracking in the student campus mobile portal",
              "Install card-operated washing machines in dorm basements"
            ],
            dependenciesAndBudget: "Requires monthly fuel/driver budget of ₹32,000 from campus amenities fee.",
            measurableMetrics: "Shuttle punctuality > 92%; laundry queue times cut by 60%.",
            status: "Proposed",
            evidenceRef: "Dean Order #SWD-102"
          },
          {
            id: "C1-P09",
            category: "Canteen Food Quality and Affordability",
            title: "Subsidized ₹35 'Healthy Thali' & Mandatory Monthly Hygiene Scorecards",
            currentProblem: "Private cafeteria food prices have climbed 22% in two years, and greasy food options dominate while nutritional balance is neglected.",
            proposedSolution: "Enforce contract stipulation capping the standardized student thali (dal, rice, seasonal vegetable, 3 rotis, salad) at ₹35, accompanied by monthly independent microbiological food lab audits.",
            expectedBenefit: "Affordable, wholesome food for every student regardless of financial background; reduced incidences of food-borne illnesses.",
            targetTimeline: "Q1 2026",
            implementationSteps: [
              "Incorporate price ceiling into 2026 canteen vendor lease agreements",
              "Contract accredited food safety laboratory for unannounced monthly swab tests",
              "Display bold public hygiene scorecards (A/B/C/F) at counter entrances"
            ],
            dependenciesAndBudget: "Joint student-faculty Mess Monitoring Committee authorization.",
            measurableMetrics: "Zero hygiene audit scores below 80/100; minimum 600 subsidized plates served daily.",
            status: "Proposed",
            evidenceRef: "Canteen Report #CC-2025-Q3"
          },
          {
            id: "C1-P10",
            category: "Mental Wellbeing and Student Support",
            title: "Full-Time Licensed Clinical Psychologists & 24/7 Crisis Hotline",
            currentProblem: "Campus counseling currently operates on a part-time basis with only 4 hours of appointment availability per week, creating a 3-week waiting list during exam pressure.",
            proposedSolution: "Establish a permanent, dedicated Student Wellness Pavilion staffed by two full-time licensed psychologists with guaranteed same-week confidential appointments and an emergency 24/7 toll-free crisis helpline.",
            expectedBenefit: "Immediate, non-judgmental professional psychological care for students experiencing anxiety, depression, or academic distress.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Secure budget allocation for 2 full-time clinical counselor salaries",
              "Renovate quiet, private counseling suites away from administrative footfall",
              "Partner with certified tele-counseling provider for after-hours emergency calls"
            ],
            dependenciesAndBudget: "Requires ₹9.6 Lakhs annual institutional healthcare budget line.",
            measurableMetrics: "Counseling wait times reduced to < 48 hours; over 400 confidential sessions delivered.",
            status: "Proposed",
            evidenceRef: "Sanction Letter #SWD-102"
          },
          {
            id: "C1-P11",
            category: "Internship, Placement and Career Development",
            title: "Alumni-Led Mock Technical Interviews & Off-Campus Internship Stipend Fund",
            currentProblem: "Tier-2/3 branch students (Civil, Chemical, Biotech) face fewer on-campus placement drives and lack structured technical interview preparation.",
            proposedSolution: "Create a global alumni mentorship registry pairing each registered final-year student with an industry professional for 3 mock interviews, plus a council fund to sponsor conference travel and research internships.",
            expectedBenefit: "Enhanced interview confidence and placement conversion rate, particularly for non-software disciplines.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Launch digital mentorship matching portal with Alumni Relations Cell",
              "Conduct 6 domain-specific technical preparation bootcamps before placement season",
              "Disburse 20 micro-travel grants of ₹10,000 for students presenting research at national conferences"
            ],
            dependenciesAndBudget: "Co-sponsored with Apex Alumni Global Chapter.",
            measurableMetrics: "800+ mock interviews completed; 18% improvement in offer conversions for core engineering branches.",
            status: "Proposed",
            evidenceRef: "Placement Report #TPC-2025"
          },
          {
            id: "C1-P12",
            category: "Student Grievances and Transparency",
            title: "Decentralized Grievance SLA Tracker with Public Council Minutes",
            currentProblem: "Students submit formal complaints about hostel maintenance, grade anomalies, or scholarship disbursements that vanish into departmental inboxes with no accountability.",
            proposedSolution: "Deploy an open-source ticketing system assigning an immutable tracking ID to every petition, with a strict 7-day administrative resolution SLA and public monthly Council action logs.",
            expectedBenefit: "Complete transparency into institutional response times; students can escalate stalled issues directly to the Council Ombudsman.",
            targetTimeline: "Q1 2026",
            implementationSteps: [
              "Deploy self-hosted open ticketing software on campus intranet",
              "Conduct training session with departmental nodal officers",
              "Publish monthly accountability digest detailing opened, resolved, and overdue tickets"
            ],
            dependenciesAndBudget: "Internal software deployment; no extra licensing costs.",
            measurableMetrics: "Over 90% of tickets resolved within 7 calendar days; 0 unacknowledged grievances.",
            status: "Proposed",
            evidenceRef: "Council Resolution #CR-2024-09"
          },
          {
            id: "C1-P13",
            category: "Accessibility and Inclusive Campus",
            title: "Universal Wheelchair Ramps, Tactile Paving & Braille Signage",
            currentProblem: "Several academic block entrances and lecture halls feature steep concrete steps with non-standard wooden ramps, restricting students with mobility impairments.",
            proposedSolution: "Conduct a comprehensive accessibility audit and construct motorized accessible ramps, tactile paving paths connecting main gates to classrooms, and auditory lift alerts.",
            expectedBenefit: "Full dignity and independent mobility for differently-abled students, staff, and campus visitors.",
            targetTimeline: "Q3 2026",
            implementationSteps: [
              "Engage with differently-abled student representatives for user-experience mapping",
              "Construct certified gradient ramps at Lecture Hall Complex and Central Library",
              "Install tactile paving along main arterial corridors and install Braille room numbers"
            ],
            dependenciesAndBudget: "Funded under Central Equal Opportunities Commission budget (₹5 Lakhs).",
            measurableMetrics: "100% of ground floor classrooms fully wheelchair accessible; compliance verified by external accessibility auditor.",
            status: "Proposed",
            evidenceRef: "Campus Accessibility Audit #CAA-2025"
          },
          {
            id: "C1-P14",
            category: "Environment and Sustainability",
            title: "Zero-Single-Use-Plastic Campus & 50 kW Rooftop Solar Expansion",
            currentProblem: "Disposable plastic cups and food containers generate over 1.2 metric tons of non-biodegradable waste each month in campus eateries.",
            proposedSolution: "Institute a reusable stainless steel crockery deposit system across all cafeterias, set up 6 organic waste composting pits for hostel messes, and advocate for rooftop solar expansion.",
            expectedBenefit: "Elimination of 85% single-use plastic waste and reduced carbon footprint through campus-generated clean energy.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Provide reusable subsidized tumblers to all newly admitted students",
              "Ban single-use polythene and Styrofoam across campus retail stores",
              "Partner with organic waste management firm for mess food compost processing"
            ],
            dependenciesAndBudget: "Self-sustaining through minimal vendor plate deposit scheme.",
            measurableMetrics: "Monthly plastic waste tonnage reduced from 1,200 kg to under 150 kg.",
            status: "Proposed",
            evidenceRef: "Green Audit Report #SEC-2025"
          }
        ],
        performanceRecords: [
          {
            id: "C1-PERF-01",
            originalPromise: "Commercial Water Purifiers in All Hostels",
            category: "Campus Infrastructure",
            actionTaken: "Conducted water quality testing across all blocks, drafted procurement tender, and coordinated with Estate Office for installation.",
            actualOutcome: "Successfully installed 18 high-capacity commercial RO+UV purification systems across all 6 student dormitories with quarterly filter replacement contracts.",
            evidenceRef: "Council Resolution #CR-2025-04 & Municipal Lab Water Quality Certificate #MWQ-892",
            studentImpact: "Eliminated chronic water contamination complaints; over 2,800 hostellers now have guaranteed clean potable drinking water 24/7.",
            status: "Completed",
            remainingWork: "Regular ongoing filter servicing monitored by hostel wardens.",
            delayExplanation: "None. Completed ahead of schedule in Month 3 of tenure."
          },
          {
            id: "C1-PERF-02",
            originalPromise: "Late-Night Reading Room Access During Exam Months",
            category: "Library and Learning Resources",
            actionTaken: "Submitted petition with 1,840 student signatures to Academic Senate; negotiated security staffing arrangements with Dean.",
            actualOutcome: "Passed Senate Resolution extending Central Library 1st Floor reading rooms until 2:00 AM for the 3 weeks preceding Midterm and Endterm examinations.",
            evidenceRef: "Academic Senate Minutes #ASM-88 (Resolution passed Oct 14, 2024)",
            studentImpact: "Average nightly attendance of 450+ students during finals; study congestion in hostel common rooms reduced significantly.",
            status: "Completed",
            remainingWork: "Aiming to make 24/7 operation permanent year-round in next term.",
            delayExplanation: "Initial opposition from Library Staff Union resolved through hiring student night proctors."
          },
          {
            id: "C1-PERF-03",
            originalPromise: "Synthetic Sports Court Resurfacing & High-Mast LED Lighting",
            category: "Sports and Gym Facilities",
            actionTaken: "Secured special infrastructure grant of ₹6.8 Lakhs from University Executive Board and oversaw civil contractor execution.",
            actualOutcome: "Both outdoor basketball courts and tennis courts were completely resurfaced with shock-absorbent acrylic synthetic material, and 8 high-mast LED floodlights were activated.",
            evidenceRef: "Works & Estate Department Work Order #WD-4091 (Completed Jan 2025)",
            studentImpact: "Night sports playing hours extended from 6:30 PM to 10:00 PM; hosted 1st Inter-University Invitational Tournament in Feb 2025.",
            status: "Completed",
            remainingWork: "Gymnasium indoor equipment replacement remains pending for new term.",
            delayExplanation: "Work completed on time within allocated budget."
          },
          {
            id: "C1-PERF-04",
            originalPromise: "Dedicated On-Campus Emergency Medical Transport Van",
            category: "Transport and Hostel Facilities",
            actionTaken: "Partnered with Campus Health Center and local City Hospital; converted unused administrative utility vehicle into an emergency transport unit.",
            actualOutcome: "Stationed on-call driver 24/7 at Campus Clinic with basic life-support equipment, oxygen cylinder, and direct phone hotline.",
            evidenceRef: "Campus Health Center Order #SWD-102 & Incident Dispatch Log #EMT-2024",
            studentImpact: "Safely handled 42 emergency hospital transfers during 2024–2025 with average response time under 8 minutes.",
            status: "Completed",
            remainingWork: "Ongoing maintenance and fuel budget continuation.",
            delayExplanation: "None. System operational since August 2024."
          },
          {
            id: "C1-PERF-05",
            originalPromise: "High-Speed Hostel Wi-Fi Upgrade Across All Blocks",
            category: "Wi-Fi and Digital Facilities",
            actionTaken: "Secured central IT sanction for ₹14 Lakhs; completed optical fiber laying and installed 48 Wi-Fi 6 access points in Hostel Block A.",
            actualOutcome: "Hostel A achieved verified speeds exceeding 90 Mbps per room. However, installations in Hostels B, C, and D were paused mid-way.",
            evidenceRef: "IT Infrastructure Audit Report #IT-2025-11",
            studentImpact: "Hostel A residents experienced 10x speed improvement; Hostels B and C residents still face evening bandwidth congestion.",
            status: "Partially Completed",
            remainingWork: "Procurement and physical installation of remaining 72 access points in Hostels B, C, and D.",
            delayExplanation: "Administrative budget freeze by the Central Accounts Office in November 2024 delayed vendor payment release for Phase 2."
          },
          {
            id: "C1-PERF-06",
            originalPromise: "Canteen Food Quality Standards & Price Regulation",
            category: "Canteen Food Quality and Affordability",
            actionTaken: "Formed Mess Inspection Committee with student volunteers; conducted 4 unannounced surprise kitchen inspections; instituted price caps on 12 staples.",
            actualOutcome: "Breakfast and lunch prices stabilized; water filtration in kitchens verified. However, planned kitchen exhaust chimney upgrades were delayed.",
            evidenceRef: "Canteen Inspection Committee Report #CC-2025-Q3",
            studentImpact: "Basic meal prices held steady during inflation; hygiene improved, but dinner food variety remains a frequent student grievance.",
            status: "Partially Completed",
            remainingWork: "Complete commercial exhaust upgrade and establish permanent student taste testing committee.",
            delayExplanation: "Canteen contractor dispute regarding kitchen renovation expenses halted chimney replacement."
          },
          {
            id: "C1-PERF-07",
            originalPromise: "Automated Academic Grievance Portal & ERP Integration",
            category: "Student Grievances and Transparency",
            actionTaken: "Student developer team successfully coded the web portal, user interface, and ticket escalation workflow.",
            actualOutcome: "Working software prototype completed and audited. However, live deployment stalled awaiting Controller of Examinations data integration.",
            evidenceRef: "Software Audit & Deployment Request #SAD-2024-19",
            studentImpact: "Students still currently submit grievances manually via physical forms to departmental clerks.",
            status: "In Progress",
            remainingWork: "Secure administrative API access to the university registrar database and conduct security sign-off.",
            delayExplanation: "Controller of Examinations requested a formal cybersecurity penetration test before linking the portal with grade records."
          },
          {
            id: "C1-PERF-08",
            originalPromise: "Inter-Campus Electric Shuttle Golf Cart Transit",
            category: "Transport and Hostel Facilities",
            actionTaken: "Drafted project feasibility study, route map, and supplier quotes for two 8-seater electric campus golf carts.",
            actualOutcome: "Proposal was tabled at the November 2024 University Finance Committee meeting but failed to receive budget approval.",
            evidenceRef: "University Finance Committee Minutes #UFC-2024-11 (Section 7.3)",
            studentImpact: "Students still walk or use personal bicycles across the 80-acre campus; zero institutional shuttle support.",
            status: "Not Started",
            remainingWork: "Re-structure funding proposal through alumni sponsorship rather than university capital budget.",
            delayExplanation: "University prioritized central library HVAC overhaul over electric vehicle purchase due to restricted capital expenditure caps."
          }
        ],
        timelineMilestones: [
          {
            phase: "Past Term (2024)",
            title: "Hostel Water Purifiers & Health Van Deployed",
            description: "Installed 18 commercial purifiers and stationed emergency ambulance.",
            dateOrPeriod: "August 2024",
            status: "Completed"
          },
          {
            phase: "Past Term (2024)",
            title: "Extended Library Reading Room to 2 AM",
            description: "Passed Academic Senate resolution for exam period study commons.",
            dateOrPeriod: "October 2024",
            status: "Completed"
          },
          {
            phase: "Past Term (2025)",
            title: "Sports Synthetic Courts & Floodlights Opened",
            description: "Completed dual court resurfacing and high-mast LED installations.",
            dateOrPeriod: "January 2025",
            status: "Completed"
          },
          {
            phase: "Past Term (2025)",
            title: "Hostel A Wi-Fi 6 Pilot Launched",
            description: "Deployed 48 access points in Hostel A; prepared Phase 2 plans.",
            dateOrPeriod: "March 2025",
            status: "Completed"
          },
          {
            phase: "New Term (2026 Q1)",
            title: "Hostels B & C Wi-Fi Rollout & Library 24/7 Opening",
            description: "Unfreeze IT funds and open 24/7 biometric library reading wing.",
            dateOrPeriod: "Month 1–2",
            status: "Upcoming"
          },
          {
            phase: "New Term (2026 Q2)",
            title: "₹35 Subsidized Thali & Indoor Gym Renovation",
            description: "Enforce cafeteria price caps and overhaul indoor gym equipment.",
            dateOrPeriod: "Month 3–5",
            status: "Upcoming"
          },
          {
            phase: "New Term (2026 Q3)",
            title: "Covered Canopies & Full ERP Grievance Rollout",
            description: "Erect weather walkways and launch integrated digital grievance portal.",
            dateOrPeriod: "Month 6–8",
            status: "Upcoming"
          }
        ],

        // --- COMPREHENSIVE PROFILE FIELDS FOR CANDIDATE 1 (AARAV SHARMA) ---

        criticisms: [
          {
            category: "Governance",
            title: "Centralized Decision-Making Style",
            description: "Multiple council members and student representatives have criticized Aarav for bypassing consultative processes and making unilateral decisions on budget allocations without full council debate. The ₹6.8 Lakhs sports court resurfacing contract was approved via executive order rather than competitive tender.",
            severity: "Moderate",
            source: "Council Minutes & RTI Response #RTI-2025-047",
            evidenceRef: "Council Resolution #CR-2025-03 (Executive Order)",
            acknowledgedByCandidate: true,
            candidateResponse: "Acknowledged time pressure due to tournament deadline. Committed to full tender process for all future contracts > ₹5 Lakhs. See Council Minutes #CM-2025-11 for detailed response."
          },
          {
            category: "Transparency",
            title: "Incomplete Disclosure of Alumni Fund Utilization",
            description: "The ₹15 Lakhs alumni-backed venture fund announced in 2024 has only disbursed ₹3.2 Lakhs to date. No public ledger shows allocation criteria or recipient selection process. Student entrepreneurs allege favoritism toward CSE department peers.",
            severity: "Major",
            source: "RTI Response #RTI-2025-089 & Student Survey (n=1,240)",
            evidenceRef: "Alumni Fund Ledger (Partial) #AFL-2024",
            acknowledgedByCandidate: true,
            candidateResponse: "Disbursement delayed due to MOU negotiations with alumni chapter. Full ledger to be published by Q1 2026. Selection committee now includes cross-departmental representation."
          },
          {
            category: "Inclusivity",
            title: "Hostel A Priority Over Other Blocks",
            description: "Wi-Fi 6 Phase 1 exclusively covered Hostel A (where Aarav resided), while Hostels B, C, D with 62% dead zones were deferred. Critics allege residential bias in infrastructure prioritization.",
            severity: "Moderate",
            source: "IT Audit Report #IT-2025-11 & Hostel Warden Council Minutes",
            evidenceRef: "IT Audit Heatmaps showing Block A vs B/C disparity",
            acknowledgedByCandidate: true,
            candidateResponse: "Phase 1 was pilot to validate technology before scale-up. Budget freeze by Central Accounts Office (uncontrollable) delayed Phase 2. Committed to completing B, C, D within 90 days of new term."
          },
          {
            category: "Accountability",
            title: "Grievance Portal Deployment Failure",
            description: "Promised automated ERP grievance portal in 2024 manifesto. Software built but not deployed due to 'pending Controller of Examinations approval' - a dependency known since project inception. Seen as poor project management.",
            severity: "Moderate",
            source: "Software Audit #SAD-2024-19 & Student Grievance Cell Reports",
            evidenceRef: "Deployment Request #SAD-2024-19 (Stalled)",
            acknowledgedByCandidate: true,
            candidateResponse: "Technical build complete. Blocker is administrative (CoE cybersecurity sign-off). Have escalated to Dean Student Welfare for intervention. Will deploy within 30 days of clearance."
          },
          {
            category: "Financial",
            title: "Council Entertainment Budget Overspend",
            description: "Cultural fest 'Spandan 2024' exceeded allocated budget by ₹2.3 Lakhs (18% overrun). Additional funds sourced from contingency reserve without council vote. No post-event audit published.",
            severity: "Minor",
            source: "Council Financial Audit #CFA-2024-Q4",
            evidenceRef: "Spandan 2024 Expenditure Statement (Unaudited)",
            acknowledgedByCandidate: false,
            candidateResponse: "Overspend due to last-minute artist fee escalation. Contingency reserve exists for such emergencies. Post-event audit scheduled for January 2026."
          }
        ],

        controversies: [
          {
            caseId: "CONT-2025-001",
            title: "Alleged Favoritism in Hackathon Judging",
            description: "As Core Convener of ApexHack 2023, Aarav's close friend's team (CSE 3rd year) won 1st prize. No conflict of interest declaration filed. Complaint filed by 2nd place team alleging biased evaluation criteria.",
            status: "Resolved - Cleared",
            filedBy: "ApexHack 2023 Runner-up Team",
            filedDate: "March 15, 2023",
            hearingDate: "April 20, 2023",
            outcome: "Ethics Committee found no procedural violation. Judging was blind; friend's team scored highest on technical rubric. However, recommended mandatory COI declarations for future conveners.",
            penalty: "None. Advisory notice issued.",
            evidenceRef: "Ethics Committee Report #EC-2023-07",
            isActive: false
          },
          {
            caseId: "CONT-2025-002",
            title: "RTI Activist Complaint: Council Meeting Minutes Delay",
            description: "RTI activist alleged Council Meeting Minutes for Oct-Dec 2024 not published within mandated 30-day window. Information Commission notice issued. Minutes published 47 days late.",
            status: "Resolved - Penalty",
            filedBy: "Student RTI Forum",
            filedDate: "January 10, 2025",
            hearingDate: "February 15, 2025",
            outcome: "Information Commission upheld complaint. Council fined ₹10,000 (paid from council fund). Directed to implement automated minutes publication pipeline.",
            penalty: "₹10,000 fine + mandatory process fix",
            evidenceRef: "Information Commission Order #ICO-2025-03",
            isActive: false
          },
          {
            caseId: "CONT-2025-003",
            title: "Pending: Canteen Contractor Dispute - Exhaust Upgrade",
            description: "Canteen contractor filed grievance against Council for withholding ₹1.8 Lakhs for kitchen exhaust upgrade, claiming Council changed specifications mid-contract. Council claims contractor used substandard materials. Currently under arbitration.",
            status: "Pending Hearing",
            filedBy: "Canteen Contractor (M/s Annapurna Foods)",
            filedDate: "November 2024",
            hearingDate: "January 2026 (Scheduled)",
            outcome: "",
            penalty: "",
            evidenceRef: "Arbitration Notice #ARB-2025-12",
            isActive: true
          }
        ],

        financialDisclosures: [
          {
            year: "2024-2025",
            totalExpenditure: 2850000,
            totalIncome: 3200000,
            majorExpenses: [
              { category: "Water Purification Systems", amount: 540000, description: "18 RO+UV units across 6 hostels" },
              { category: "Sports Court Resurfacing", amount: 680000, description: "Acrylic synthetic courts + LED floodlights" },
              { category: "Hostel A Wi-Fi 6 Deployment", amount: 1400000, description: "48 access points + fiber backhaul" },
              { category: "Emergency Medical Van Conversion", amount: 120000, description: "Vehicle retrofit + medical equipment" },
              { category: "Spandan Cultural Fest 2024", amount: 110000, description: "Artist fees, venue, logistics (over budget)" }
            ],
            fundingSources: [
              { source: "University Student Welfare Fund", amount: 2500000, type: "University Grant" },
              { source: "Alumni Association Contribution", amount: 500000, type: "Donation" },
              { source: "Council Contingency Reserve", amount: 200000, type: "Party Fund" }
            ],
            auditStatus: "Audited",
            auditRef: "Council Financial Audit #CFA-2024-Q4"
          },
          {
            year: "2023-2024",
            totalExpenditure: 1950000,
            totalIncome: 2100000,
            majorExpenses: [
              { category: "ApexHack 2023 Organization", amount: 450000, description: "Venue, prizes, logistics" },
              { category: "Hostel Welfare Initiatives", amount: 300000, description: "Common room upgrades, water coolers" },
              { category: "Senate Representation Activities", amount: 200000, description: "Travel, documentation, outreach" },
              { category: "Miscellaneous Council Operations", amount: 1000000, description: "Stationery, communications, meetings" }
            ],
            fundingSources: [
              { source: "University Student Welfare Fund", amount: 1800000, type: "University Grant" },
              { source: "PSA Party Membership Fees", amount: 150000, type: "Party Fund" },
              { source: "Personal Contribution", amount: 150000, type: "Personal" }
            ],
            auditStatus: "Audited",
            auditRef: "Council Financial Audit #CFA-2023-Q4"
          }
        ],

        votingRecord: [
          {
            motionId: "MOT-2024-01",
            motionTitle: "Hostel Water Purification Capital Expenditure",
            date: "August 5, 2024",
            vote: "For",
            category: "Campus Infrastructure",
            controversyLevel: "None",
            notes: "Unanimous council support. Critical health need."
          },
          {
            motionId: "MOT-2024-02",
            motionTitle: "Library 24/7 Extension Trial",
            date: "September 12, 2024",
            vote: "For",
            category: "Library and Learning Resources",
            controversyLevel: "Low",
            notes: "Passed 7-2. Opposition cited security costs."
          },
          {
            motionId: "MOT-2024-03",
            motionTitle: "Sports Court Resurfacing Contract Award",
            date: "October 20, 2024",
            vote: "For",
            category: "Sports and Gym Facilities",
            controversyLevel: "Medium",
            notes: "Executive order bypassed tender. Voted for own motion as President. Criticized by opposition."
          },
          {
            motionId: "MOT-2024-04",
            motionTitle: "Canteen Price Cap Renewal",
            date: "November 8, 2024",
            vote: "For",
            category: "Canteen Food Quality and Affordability",
            controversyLevel: "Low",
            notes: "Passed unanimously. Contractor objected but complied."
          },
          {
            motionId: "MOT-2024-05",
            motionTitle: "Electric Shuttle Procurement",
            date: "November 25, 2024",
            vote: "For",
            category: "Transport and Hostel Facilities",
            controversyLevel: "High",
            notes: "Failed at Finance Committee (4-5). Aarav voted for but lacked numbers. Major campaign promise unfulfilled."
          },
          {
            motionId: "MOT-2024-06",
            motionTitle: "Mental Health Counselor Positions (2 FTE)",
            date: "December 15, 2024",
            vote: "For",
            category: "Mental Wellbeing and Student Support",
            controversyLevel: "Medium",
            notes: "Passed 6-3. Budget allocation pending Dean approval. Not yet implemented."
          },
          {
            motionId: "MOT-2024-07",
            motionTitle: "Grievance Portal Development Funding",
            date: "January 10, 2025",
            vote: "For",
            category: "Student Grievances and Transparency",
            controversyLevel: "None",
            notes: "Development funded. Deployment blocked by CoE (not council vote)."
          }
        ],

        attendanceRecord: [
          {
            sessionType: "Council Meeting",
            date: "2024-2025 Academic Year",
            attended: true,
            reasonIfAbsent: "",
            totalSessions: 24,
            sessionsAttended: 22
          },
          {
            sessionType: "Senate",
            date: "2024-2025 Academic Year",
            attended: true,
            reasonIfAbsent: "",
            totalSessions: 12,
            sessionsAttended: 10
          },
          {
            sessionType: "Committee",
            date: "2024-2025 Academic Year",
            attended: true,
            reasonIfAbsent: "",
            totalSessions: 36,
            sessionsAttended: 31
          },
          {
            sessionType: "Town Hall",
            date: "2024-2025 Academic Year",
            attended: true,
            reasonIfAbsent: "",
            totalSessions: 4,
            sessionsAttended: 3
          },
          {
            sessionType: "Emergency Session",
            date: "2024-2025 Academic Year",
            attended: true,
            reasonIfAbsent: "",
            totalSessions: 3,
            sessionsAttended: 3
          }
        ],

        publicFeedback: {
          overallRating: 3.7,
          totalReviews: 847,
          categoryRatings: [
            { category: "Infrastructure Delivery", rating: 4.2, reviewCount: 312 },
            { category: "Transparency", rating: 3.1, reviewCount: 289 },
            { category: "Responsiveness", rating: 3.5, reviewCount: 267 },
            { category: "Inclusivity", rating: 3.3, reviewCount: 245 },
            { category: "Fiscal Responsibility", rating: 3.4, reviewCount: 198 }
          ],
          sentimentBreakdown: {
            positive: 412,
            neutral: 234,
            negative: 201
          },
          topPraises: [
            "Water purifiers actually delivered - huge quality of life improvement",
            "Sports courts are genuinely world-class now",
            "Emergency medical van saved lives - literally",
            "Library 2 AM extension helped during finals"
          ],
          topComplaints: [
            "Wi-Fi only in Hostel A - what about the rest of us?",
            "Grievance portal promised but never launched",
            "Too centralized - doesn't listen to opposition",
            "Alumni fund opacity - where did the money go?"
          ],
          lastUpdated: "January 2026"
        },

        sources: [
          // Manifesto promises
          { claimType: "Manifesto Promise", claimRef: "C1-P01", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P02", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P03", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P04", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P05", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P06", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P07", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P08", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P09", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P10", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P11", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P12", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P13", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C1-P14", sourceType: "Official Document", sourceTitle: "PSA Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },

          // Performance records
          { claimType: "Performance Record", claimRef: "C1-PERF-01", sourceType: "Official Document", sourceTitle: "Council Resolution #CR-2025-04", sourceUrl: "", sourceDate: "August 2024", verificationStatus: "Verified", verifiedBy: "Dean Student Welfare" },
          { claimType: "Performance Record", claimRef: "C1-PERF-01", sourceType: "Third-Party Audit", sourceTitle: "Municipal Lab Water Quality Certificate #MWQ-892", sourceUrl: "", sourceDate: "September 2024", verificationStatus: "Verified", verifiedBy: "Public Health Lab" },
          { claimType: "Performance Record", claimRef: "C1-PERF-02", sourceType: "Official Document", sourceTitle: "Academic Senate Minutes #ASM-88", sourceUrl: "", sourceDate: "October 2024", verificationStatus: "Verified", verifiedBy: "Academic Senate" },
          { claimType: "Performance Record", claimRef: "C1-PERF-03", sourceType: "Official Document", sourceTitle: "Work Order #WD-4091", sourceUrl: "", sourceDate: "January 2025", verificationStatus: "Verified", verifiedBy: "Works & Estate Dept" },
          { claimType: "Performance Record", claimRef: "C1-PERF-04", sourceType: "Official Document", sourceTitle: "Campus Health Center Order #SWD-102", sourceUrl: "", sourceDate: "August 2024", verificationStatus: "Verified", verifiedBy: "Campus Health Center" },
          { claimType: "Performance Record", claimRef: "C1-PERF-05", sourceType: "Third-Party Audit", sourceTitle: "IT Infrastructure Audit Report #IT-2025-11", sourceUrl: "", sourceDate: "February 2025", verificationStatus: "Verified", verifiedBy: "Central Computer Centre" },
          { claimType: "Performance Record", claimRef: "C1-PERF-06", sourceType: "Official Document", sourceTitle: "Canteen Inspection Committee Report #CC-2025-Q3", sourceUrl: "", sourceDate: "January 2025", verificationStatus: "Verified", verifiedBy: "Mess Monitoring Committee" },
          { claimType: "Performance Record", claimRef: "C1-PERF-07", sourceType: "Official Document", sourceTitle: "Software Audit & Deployment Request #SAD-2024-19", sourceUrl: "", sourceDate: "December 2024", verificationStatus: "Verified", verifiedBy: "Student Developer Team" },
          { claimType: "Performance Record", claimRef: "C1-PERF-08", sourceType: "Official Document", sourceTitle: "University Finance Committee Minutes #UFC-2024-11", sourceUrl: "", sourceDate: "November 2024", verificationStatus: "Verified", verifiedBy: "Finance Committee" },

          // Criticisms
          { claimType: "Criticism", claimRef: "CRIT-C1-01", sourceType: "Official Document", sourceTitle: "Council Minutes #CM-2025-11 & RTI Response #RTI-2025-047", sourceUrl: "", sourceDate: "November 2025", verificationStatus: "Verified", verifiedBy: "RTI Cell" },
          { claimType: "Criticism", claimRef: "CRIT-C1-02", sourceType: "RTI Response", sourceTitle: "RTI Response #RTI-2025-089", sourceUrl: "", sourceDate: "December 2025", verificationStatus: "Verified", verifiedBy: "RTI Cell" },
          { claimType: "Criticism", claimRef: "CRIT-C1-02", sourceType: "Student Survey", sourceTitle: "Student Entrepreneur Survey (n=1,240)", sourceUrl: "", sourceDate: "December 2025", verificationStatus: "Verified", verifiedBy: "Independent Survey Team" },
          { claimType: "Criticism", claimRef: "CRIT-C1-03", sourceType: "Third-Party Audit", sourceTitle: "IT Audit Report #IT-2025-11", sourceUrl: "", sourceDate: "February 2025", verificationStatus: "Verified", verifiedBy: "Central Computer Centre" },
          { claimType: "Criticism", claimRef: "CRIT-C1-04", sourceType: "Official Document", sourceTitle: "Software Audit #SAD-2024-19", sourceUrl: "", sourceDate: "December 2024", verificationStatus: "Verified", verifiedBy: "Student Developer Team" },
          { claimType: "Criticism", claimRef: "CRIT-C1-05", sourceType: "Third-Party Audit", sourceTitle: "Council Financial Audit #CFA-2024-Q4", sourceUrl: "", sourceDate: "January 2025", verificationStatus: "Verified", verifiedBy: "Internal Audit Cell" },

          // Controversies
          { claimType: "Controversy", claimRef: "CONT-2025-001", sourceType: "Official Document", sourceTitle: "Ethics Committee Report #EC-2023-07", sourceUrl: "", sourceDate: "April 2023", verificationStatus: "Verified", verifiedBy: "Ethics Committee" },
          { claimType: "Controversy", claimRef: "CONT-2025-002", sourceType: "Official Document", sourceTitle: "Information Commission Order #ICO-2025-03", sourceUrl: "", sourceDate: "February 2025", verificationStatus: "Verified", verifiedBy: "Information Commission" },
          { claimType: "Controversy", claimRef: "CONT-2025-003", sourceType: "Official Document", sourceTitle: "Arbitration Notice #ARB-2025-12", sourceUrl: "", sourceDate: "November 2024", verificationStatus: "Partially Verified", verifiedBy: "Arbitration Tribunal" },

          // Financial
          { claimType: "Financial", claimRef: "FIN-C1-2024", sourceType: "Third-Party Audit", sourceTitle: "Council Financial Audit #CFA-2024-Q4", sourceUrl: "", sourceDate: "January 2025", verificationStatus: "Verified", verifiedBy: "Internal Audit Cell" },
          { claimType: "Financial", claimRef: "FIN-C1-2023", sourceType: "Third-Party Audit", sourceTitle: "Council Financial Audit #CFA-2023-Q4", sourceUrl: "", sourceDate: "January 2024", verificationStatus: "Verified", verifiedBy: "Internal Audit Cell" },

          // Voting Record
          { claimType: "Voting Record", claimRef: "MOT-2024-01", sourceType: "Official Document", sourceTitle: "Council Meeting Minutes - August 2024", sourceUrl: "", sourceDate: "August 2024", verificationStatus: "Verified", verifiedBy: "Council Secretary" },
          { claimType: "Voting Record", claimRef: "MOT-2024-02", sourceType: "Official Document", sourceTitle: "Council Meeting Minutes - September 2024", sourceUrl: "", sourceDate: "September 2024", verificationStatus: "Verified", verifiedBy: "Council Secretary" },
          { claimType: "Voting Record", claimRef: "MOT-2024-03", sourceType: "Official Document", sourceTitle: "Council Meeting Minutes - October 2024", sourceUrl: "", sourceDate: "October 2024", verificationStatus: "Verified", verifiedBy: "Council Secretary" },
          { claimType: "Voting Record", claimRef: "MOT-2024-04", sourceType: "Official Document", sourceTitle: "Council Meeting Minutes - November 2024", sourceUrl: "", sourceDate: "November 2024", verificationStatus: "Verified", verifiedBy: "Council Secretary" },
          { claimType: "Voting Record", claimRef: "MOT-2024-05", sourceType: "Official Document", sourceTitle: "Finance Committee Minutes #UFC-2024-11", sourceUrl: "", sourceDate: "November 2024", verificationStatus: "Verified", verifiedBy: "Finance Committee" },
          { claimType: "Voting Record", claimRef: "MOT-2024-06", sourceType: "Official Document", sourceTitle: "Council Meeting Minutes - December 2024", sourceUrl: "", sourceDate: "December 2024", verificationStatus: "Verified", verifiedBy: "Council Secretary" },
          { claimType: "Voting Record", claimRef: "MOT-2024-07", sourceType: "Official Document", sourceTitle: "Council Meeting Minutes - January 2025", sourceUrl: "", sourceDate: "January 2025", verificationStatus: "Verified", verifiedBy: "Council Secretary" },

          // Attendance
          { claimType: "Attendance", claimRef: "ATT-C1-2024", sourceType: "Official Document", sourceTitle: "Council Attendance Registers 2024-2025", sourceUrl: "", sourceDate: "March 2025", verificationStatus: "Verified", verifiedBy: "Council Secretariat" },

          // Feedback
          { claimType: "Feedback", claimRef: "FB-C1-2026", sourceType: "Student Survey", sourceTitle: "Comprehensive Candidate Feedback Survey (n=847)", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Independent Survey Team" }
        ],

        profileCompleteness: {
          manifestoComplete: true,
          performanceComplete: true,
          criticismsDocumented: true,
          controversiesDocumented: true,
          financialsDisclosed: true,
          votingRecordDisclosed: true,
          attendanceDisclosed: true,
          feedbackCollected: true,
          sourcesVerified: true,
          overallScore: 95
        }
      },
      {
        candidateId: "2",
        name: "Ananya Iyer",
        party: "Academic Reform & Digital Campus Initiative (ARDCI)",
        avatarIpfs: "",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        position: "Student Council President",
        department: "Electronics & Communication Engineering",
        year: "4th Year / Senior",
        isIncumbent: false,
        tagline: "Democratizing Campus Tech, Modernizing Academics, and Empowering Every Student",
        bio: "Chairperson of the IEEE Student Branch and former Department Academic Secretary, Ananya has a proven record of establishing peer tutoring networks and organizing inter-collegiate technical symposiums. Her campaign focuses on 24/7 library commons, high-speed open Wi-Fi, research project micro-grants, transparent grading portals, and equal placement training across all branches.",
        experience: [
          "Chairperson, IEEE Student Chapter (2024–2025)",
          "Department Academic Secretary, ECE (2023–2024)",
          "Founding Lead, Campus Peer Tutoring & Mentorship Network (2023)",
          "Organizer, Women in STEM National Conclave (2024)"
        ],
        priorities: [
          "24/7 continuous library digital commons with silent study pods",
          "Guaranteed undergraduate research micro-grants of ₹25,000 per project",
          "Universal high-speed Wi-Fi 6 rollout across all hostel rooms with zero dead zones",
          "Fully transparent digital exam re-evaluation tracking portal"
        ],
        keyPromises: [
          "Convert central library second floor into a 24/7 quiet study & power commons",
          "Deploy dual-band Wi-Fi access points in all hostel wings within 90 days",
          "Launch university research mini-grants matched by alumni tech founders",
          "Direct student feedback loop on course electives and evaluation rubrics"
        ],
        manifesto: [
          {
            id: "C2-P01",
            category: "Academic Excellence",
            title: "Undergraduate Research Grants & Peer-to-Peer Tutoring Network",
            currentProblem: "Students with innovative hardware or software capstone ideas lack seed funding for microcontrollers, cloud credits, and dataset licenses.",
            proposedSolution: "Create a dedicated ₹10 Lakhs Student Research Seed Fund providing ₹25,000 competitive micro-grants for 40 student projects annually, evaluated by an interdisciplinary panel.",
            expectedBenefit: "Empowers 40+ student research teams to publish in IEEE/ACM conferences and apply for patents before graduating.",
            targetTimeline: "Q1 2026 (Month 2)",
            implementationSteps: [
              "Form Research Grant Review Committee with faculty mentors",
              "Open online grant application portal with quarterly review cycles",
              "Partner with institutional Incubation Center for prototyping facilities"
            ],
            dependenciesAndBudget: "₹10 Lakhs annual seed fund matching from University Research Council.",
            measurableMetrics: "At least 30 peer-reviewed student papers submitted; 100% transparent grant disbursement ledger.",
            status: "Proposed",
            evidenceRef: "IEEE Branch Report #IBR-2024"
          },
          {
            id: "C2-P02",
            category: "Library and Learning Resources",
            title: "Full 24/7 Digital Commons with Free Printing & E-Journal Access",
            currentProblem: "Students must pay commercial photocopy shops ₹3/page for lab reports and thesis submissions, and digital paper access is locked to on-campus desktop IP addresses.",
            proposedSolution: "Transform Library Floor 2 into an always-open 24/7 Digital Commons with 3 high-speed network printers providing 100 free pages per student per semester, plus campus-wide EZproxy for off-campus journal access.",
            expectedBenefit: "Substantial out-of-pocket savings for 3,500 students and unrestricted access to IEEE/Springer/ScienceDirect from hostel rooms.",
            targetTimeline: "Q1 2026",
            implementationSteps: [
              "Deploy self-service networked print kiosks using student ID card swipe",
              "Configure institutional Shibboleth/EZproxy server for remote research authentication",
              "Designate acoustic quiet pods for group discussions"
            ],
            dependenciesAndBudget: "Requires ₹3.8 Lakhs setup cost for commercial laser printers and proxy server config.",
            measurableMetrics: "Over 250,000 pages printed seamlessly; zero proxy downtime reported.",
            status: "Proposed",
            evidenceRef: "Digital Campus Whitepaper #DCW-2025"
          },
          {
            id: "C2-P03",
            category: "Campus Infrastructure",
            title: "Smart Classroom Ergonomics & Laptop Charging Outlets at Every Desk",
            currentProblem: "Over 60% of desks in major lecture halls lack accessible AC power outlets, leading to dead laptops during 3-hour programming and simulation labs.",
            proposedSolution: "Retrofit all 24 lecture halls and 8 seminar auditoriums with under-desk modular power sockets (dual AC + USB-C fast charging).",
            expectedBenefit: "Students can take notes, compile code, and run simulations throughout long academic days without battling for perimeter wall sockets.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Electrical audit of main distribution panels in Academic Blocks 1 & 2",
              "Install surface-mounted fire-rated conduit channels under lecture benches",
              "Equip all podiums with HDMI + wireless Miracast/Airplay screen sharing"
            ],
            dependenciesAndBudget: "Estimated ₹5.2 Lakhs electrical rewiring budget from Estate maintenance.",
            measurableMetrics: "100% of seats in 24 major lecture halls equipped with functional power points.",
            status: "Proposed",
            evidenceRef: "Classroom Audit #CA-2025-08"
          },
          {
            id: "C2-P04",
            category: "Wi-Fi and Digital Facilities",
            title: "1 Gbps Symmetrical Fiber & Campus-Wide Open Wi-Fi 6 Network",
            currentProblem: "Campus Internet gateway throttles torrents and cloud services aggressively, with ping latency exceeding 180ms during evening hours.",
            proposedSolution: "Negotiate second redundant 1 Gbps lease line from national NKN grid and deploy dense Wi-Fi 6 mesh routers with automated QoS prioritization for academic and research domains.",
            expectedBenefit: "Ultra-fast low-latency internet (ping < 20ms) across all classrooms, hostels, and outdoor lawns.",
            targetTimeline: "Q1 2026 (Day 60)",
            implementationSteps: [
              "Activate secondary redundant ISP gateway connection",
              "Deploy dynamic bandwidth management prioritizing GitHub, Google Scholar, and Zoom",
              "Install outdoor weather-resistant access points in cafeteria garden and sports complex"
            ],
            dependenciesAndBudget: "Existing NKN connection upgrade subsidized under National Mission on Education.",
            measurableMetrics: "Average speed across all campus zones > 100 Mbps; latency < 25ms to major cloud nodes.",
            status: "Proposed",
            evidenceRef: "IT Audit Report #IT-2025-11"
          },
          {
            id: "C2-P05",
            category: "Sports and Gym Facilities",
            title: "Inter-Hostel E-Sports Arena & Athletic Gear Subsidy",
            currentProblem: "While traditional sports receive occasional attention, esports and casual athletics lack space, high-refresh displays, and subsidized sports equipment.",
            proposedSolution: "Convert the vacant Student Activity Center annex into a 20-seat high-performance Esports & Gaming Arena, and supply hostels with free loaner footballs, cricket kits, and badminton rackets.",
            expectedBenefit: "Modern recreational outlet for competitive gaming, fostering teamwork and inter-discipline friendships.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Fit SAC annex with gigabit Ethernet LAN and 144Hz monitors",
              "Host official Inter-Department Valorant, FIFA, and Chess tournaments",
              "Establish student-run equipment checkout desk at hostel security"
            ],
            dependenciesAndBudget: "Gaming PC sponsorship through corporate tech partner; ₹2 Lakhs gear fund.",
            measurableMetrics: "Over 500 students participating in organized seasonal esports leagues.",
            status: "Proposed",
            evidenceRef: "SAC Proposal #SAC-2025"
          },
          {
            id: "C2-P06",
            category: "Student Clubs and Cultural Events",
            title: "Unified Open Digital Event Calendar & Automated Hall Booking",
            currentProblem: "Clubs frequently double-book the Main Auditorium or struggle with paper approval forms signed by 5 different administrative deans.",
            proposedSolution: "Launch a Google Calendar-synced booking portal where verified club conveners can reserve halls, sound systems, and projectors in 60 seconds with automated Dean notification.",
            expectedBenefit: "Zero scheduling conflicts, transparent hall availability, and elimination of physical paper bureaucratic runarounds.",
            targetTimeline: "Q1 2026",
            implementationSteps: [
              "Deploy self-service reservation web app",
              "Implement conflict-detection algorithms for date/hall collisions",
              "Publish live campus event feed on student portal"
            ],
            dependenciesAndBudget: "Built internally by ARDCI tech team; ₹0 software license cost.",
            measurableMetrics: "100% of campus venues booked through digital calendar; 0 double-booking disputes.",
            status: "Proposed",
            evidenceRef: "Digital Campus Whitepaper #DCW-2025"
          },
          {
            id: "C2-P07",
            category: "Student Safety and Anti-Ragging",
            title: "Campus SafeWalk Companion Network & Emergency Blue-Light Call Towers",
            currentProblem: "Isolated pathways near the biomedical block and sports pavilion feel unsafe after dark, particularly for solo students walking back from late labs.",
            proposedSolution: "Establish a student volunteer 'SafeWalk' companion service and erect 6 solar-powered Blue-Light emergency poles equipped with instant 1-touch intercoms to campus security.",
            expectedBenefit: "Instant emergency connectivity anywhere on campus; peace of mind for female students and late-night researchers.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Install 6 emergency intercom towers along peripheral perimeter roads",
              "Integrate direct radio dispatch to security control room",
              "Organize trained student escort volunteer shifts between 9 PM and 1 AM"
            ],
            dependenciesAndBudget: "₹4.8 Lakhs capital cost approved by Campus Safety Council.",
            measurableMetrics: "Emergency call response time under 90 seconds anywhere on campus.",
            status: "Proposed",
            evidenceRef: "Campus Safety Review #CSR-2025"
          },
          {
            id: "C2-P08",
            category: "Transport and Hostel Facilities",
            title: "Smart App-Based Bicycle Share & Hostel Maintenance SLA",
            currentProblem: "Students waste 15–20 minutes walking between hostels and classes, and hostel plumbing/electrical complaints take 2 to 3 weeks to be attended to.",
            proposedSolution: "Deploy 80 geo-fenced smart bicycles with smartphone QR unlock at 6 dock stations, and mandate a 48-hour service level agreement (SLA) on all room repair tickets.",
            expectedBenefit: "Green, rapid 3-minute transit between hostels and classrooms; rapid resolution of leaky taps and broken lights.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Partner with app-based dockless micro-mobility bike vendor",
              "Install designated parking bays at hostels, library, and canteen",
              "Link maintenance staff performance bonuses to 48-hour SLA completion"
            ],
            dependenciesAndBudget: "Self-sustaining through nominal ₹2/ride subscription model.",
            measurableMetrics: "Over 1,200 daily bicycle trips; 95% of room maintenance tickets resolved in < 48 hrs.",
            status: "Proposed",
            evidenceRef: "Green Mobility Tender #GMT-2025"
          },
          {
            id: "C2-P09",
            category: "Canteen Food Quality and Affordability",
            title: "Digital Canteen Mobile Pre-Ordering & Independent Nutrition Audits",
            currentProblem: "Massive 25-minute queues during the 1:00 PM lunch rush force students to rush or skip meals between back-to-back classes.",
            proposedSolution: "Launch a mobile web app to pre-order and pay for meals 15 minutes ahead, with dedicated express pickup counters in all cafeterias, accompanied by published weekly nutritional calorie/protein charts.",
            expectedBenefit: "Zero wait time in lunch lines; students can pick up fresh hot food in under 2 minutes and sit down to eat comfortably.",
            targetTimeline: "Q1 2026",
            implementationSteps: [
              "Pilot pre-ordering app with Canteen 1 vendor",
              "Install dedicated pickup counter and barcode scanner",
              "Partner with home science/nutrition faculty for weekly macro nutrient display"
            ],
            dependenciesAndBudget: "App developed by student team; payment gateway integrated at 0% transaction surcharge.",
            measurableMetrics: "Average queue time reduced from 22 minutes to under 3 minutes.",
            status: "Proposed",
            evidenceRef: "Canteen Report #CC-2025-Q3"
          },
          {
            id: "C2-P10",
            category: "Mental Wellbeing and Student Support",
            title: "Anonymous Peer Support Hotline & Proactive Stress Relief Days",
            currentProblem: "High stigma prevents many students from walking into formal psychologist offices, leading to isolated suffering during placement and exam seasons.",
            proposedSolution: "Train 30 certified student peer mentors in active listening and crisis de-escalation, supported by an anonymous chat helpline and monthly therapy dog stress-relief sessions on campus lawns.",
            expectedBenefit: "Low-barrier, friendly emotional support that catches burnout early and builds a culture of mutual care.",
            targetTimeline: "Q1 2026",
            implementationSteps: [
              "Professional psychologist-led training bootcamp for student peer listeners",
              "Launch end-to-end encrypted anonymous web chat portal",
              "Host 'Paws on Campus' pet therapy days during Midterm and Endterm exam weeks"
            ],
            dependenciesAndBudget: "₹1.5 Lakhs allocated from Student Welfare activities budget.",
            measurableMetrics: "500+ anonymous support conversations conducted; 94% positive user feedback.",
            status: "Proposed",
            evidenceRef: "Mental Health Whitepaper #MHW-2025"
          },
          {
            id: "C2-P11",
            category: "Internship, Placement and Career Development",
            title: "Branch-Specific Core Company Outreach & Free DSA/GATE Bootcamps",
            currentProblem: "Placement cell primarily targets mass IT recruiters, neglecting specialized recruitment for Mechanical, Civil, Biotech, and Chemical branches.",
            proposedSolution: "Mandate equal placement coordinator representation from core branches, organize specialized Core Engineering Career Expos, and provide free semester-long coding and GATE prep bootcamps.",
            expectedBenefit: "Diversified placement opportunities with high-paying core engineering companies and premier public sector undertakings (PSUs).",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Appoint dedicated branch placement student ambassadors",
              "Compile database of 200+ core industrial employers and initiate HR outreach",
              "Host weekly mock technical coding rounds on HackerRank platform"
            ],
            dependenciesAndBudget: "Training & Placement Cell operational grant.",
            measurableMetrics: "35% increase in core company campus visits; 200+ students cleared for premier interviews.",
            status: "Proposed",
            evidenceRef: "Placement Report #TPC-2025"
          },
          {
            id: "C2-P12",
            category: "Student Grievances and Transparency",
            title: "Transparent Council Budget Dashboard & Open Senate Livestreams",
            currentProblem: "Students have no visibility into how their ₹2,500 annual council activity fee is spent or what decisions are debated in closed-door senate meetings.",
            proposedSolution: "Publish real-time financial ledger showing every council expenditure down to the rupee, and livestream all monthly Council Senate deliberations on YouTube.",
            expectedBenefit: "Unprecedented democratic accountability; complete eradication of financial misallocation rumors.",
            targetTimeline: "Q1 2026 (Immediate)",
            implementationSteps: [
              "Embed public spending spreadsheet on official council website",
              "Set up multi-camera livestream in Senate chamber with live student chat Q&A",
              "Require all council purchases > ₹10,000 to be published with vendor bills"
            ],
            dependenciesAndBudget: "Zero extra cost; utilizes existing audiovisual equipment.",
            measurableMetrics: "100% of council expenditures publicly itemized; average 800+ live views on senate streams.",
            status: "Proposed",
            evidenceRef: "Digital Campus Whitepaper #DCW-2025"
          },
          {
            id: "C2-P13",
            category: "Accessibility and Inclusive Campus",
            title: "Assistive Screen Reader Tech & Audio-Described Lecture Capture",
            currentProblem: "Visually impaired students struggle with non-accessible PDF course materials and uncaptioned online lecture recordings.",
            proposedSolution: "Equip library workstations with JAWS and NVDA assistive screen readers, and implement automated AI transcription on all recorded lecture videos.",
            expectedBenefit: "Full academic parity for neurodivergent and visually impaired students.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Purchase educational site licenses for screen-reading and speech-to-text software",
              "Integrate Whisper AI automated subtitling into university Moodle LMS",
              "Conduct accessibility usability audit with student stakeholders"
            ],
            dependenciesAndBudget: "₹2.2 Lakhs software allocation from Equal Opportunities Fund.",
            measurableMetrics: "100% of recorded university lectures subtitled; 8 specialized accessible lab terminals.",
            status: "Proposed",
            evidenceRef: "Campus Accessibility Audit #CAA-2025"
          },
          {
            id: "C2-P14",
            category: "Environment and Sustainability",
            title: "E-Waste Recycling Drives & Campus Carbon Neutrality Roadmap",
            currentProblem: "Discarded laptop batteries, cables, and old monitors accumulate in departmental basements without safe scientific disposal.",
            proposedSolution: "Install certified e-waste deposit bins in every academic block, partner with authorized green recyclers, and plant 500 indigenous fruit trees across the campus perimeter.",
            expectedBenefit: "Responsible recycling of toxic electronics and creation of shaded green biodiversity corridors on campus.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Place safe e-waste drop boxes in Academic Blocks and Hostels",
              "Schedule biannual collection drives with authorized e-waste recycling partner",
              "Organize community campus greening tree-planting drive on Earth Day"
            ],
            dependenciesAndBudget: "Funded through proceeds of recycled e-waste scrap.",
            measurableMetrics: "Over 800 kg of e-waste safely recycled; 500 trees planted with 90% survival rate.",
            status: "Proposed",
            evidenceRef: "Green Audit Report #SEC-2025"
          }
        ],
        performanceRecords: [],
        timelineMilestones: [
          {
            phase: "Q1 2026 (Launch)",
            title: "Open Senate Livestream & Research Micro-Grants Portal",
            description: "Launch public financial ledger and open application window for ₹25,000 project seed grants.",
            dateOrPeriod: "Month 1–2",
            status: "Upcoming"
          },
          {
            phase: "Q2 2026 (Execution)",
            title: "Hostel Wi-Fi 6 Completion & 24/7 Digital Commons",
            description: "Install 72 dense access points and equip library second floor with quiet power pods.",
            dateOrPeriod: "Month 3–5",
            status: "Upcoming"
          },
          {
            phase: "Q3 2026 (Expansion)",
            title: "SafeWalk Intercoms & Smart Bike Sharing",
            description: "Erect 6 blue-light emergency towers and deploy 80 dockless student bicycles.",
            dateOrPeriod: "Month 6–8",
            status: "Upcoming"
          },
          {
            phase: "Q4 2026 (Consolidation)",
            title: "Core Career Expo & Inclusive Classroom Audit",
            description: "Host specialized core engineering placement drive and complete accessibility retrofit.",
            dateOrPeriod: "Month 9–11",
            status: "Upcoming"
          }
        ],

        // --- COMPREHENSIVE PROFILE FIELDS FOR CANDIDATE 2 (ANANYA IYER) ---

        criticisms: [
          {
            category: "Governance",
            title: "Lack of Executive Experience",
            description: "Ananya has never held an elected executive position (President/VP level). Her roles have been departmental/academic (IEEE Chair, Academic Secretary). Critics question whether academic leadership translates to council governance with budget authority.",
            severity: "Moderate",
            source: "Student Survey (n=1,240) & Opposition Campaign Literature",
            evidenceRef: "Leadership Experience Comparison Chart #LEC-2026",
            acknowledgedByCandidate: true,
            candidateResponse: "Academic Secretary role involved managing ₹50L department budget and 200+ student coordination. IEEE Chair managed multi-college symposium with ₹12L corporate sponsorship. Governance is learned; fresh perspective is asset."
          },
          {
            category: "Transparency",
            title: "Research Grant Selection Criteria Opacity",
            description: "As IEEE Chair, Ananya oversaw a ₹3L student project fund. Allegations that grant recipients were disproportionately from ECE/IEEE members (78% of awards). No public scoring rubric published.",
            severity: "Major",
            source: "RTI Response #RTI-2025-112 & Student Survey",
            evidenceRef: "IEEE Project Fund Disbursement Records (Partial) #IPF-2024",
            acknowledgedByCandidate: true,
            candidateResponse: "Selection was merit-based by faculty panel. ECE students applied more due to IEEE chapter outreach. Committed to public rubric, cross-department panel, and blind review for Council Seed Fund."
          },
          {
            category: "Feasibility",
            title: "Over-Promising on Infrastructure Timelines",
            description: "Promises 1 Gbps NKN fiber upgrade in 60 days and Wi-Fi 6 in all hostels in 90 days. NKN lease line provisioning typically takes 6-12 months due to bureaucratic approvals. Network engineers call timelines 'unrealistic'.",
            severity: "Moderate",
            source: "IT Audit Report #IT-2025-11 & Network Engineer Interviews",
            evidenceRef: "NKN Provisioning Timeline Analysis #NKN-2025",
            acknowledgedByCandidate: false,
            candidateResponse: "NKN connection already exists; this is bandwidth upgrade, not new line. Have preliminary approval from NKN nodal officer. Will publish milestone tracker for accountability."
          },
          {
            category: "Inclusivity",
            title: "Esports Arena Excludes Non-Gamers",
            description: "Proposed 20-seat Esports Arena with high-end PCs (est. ₹15L) while general sports facilities remain underfunded. Critics say this serves niche demographic (mostly CSE/ECE male students) over broader student body.",
            severity: "Minor",
            source: "Student Survey & Sports Council Feedback",
            evidenceRef: "Sports Facility Utilization Survey #SFU-2025",
            acknowledgedByCandidate: true,
            candidateResponse: "Esports is growing globally; arena doubles as coding/hackathon space. Gear subsidy covers ALL sports (cricket, football, badminton). Not zero-sum - corporate sponsorship covers esports PCs."
          },
          {
            category: "Financial",
            title: "Uncosted Promises in Manifesto",
            description: "Several promises lack budget estimates: 'Free DSA/GATE Bootcamps', 'Branch-Specific Placement Ambassadors', 'Open Senate Livestream'. Independent analysis estimates ₹25L+ unfunded commitments.",
            severity: "Moderate",
            source: "Independent Fiscal Analysis #IFA-2026",
            evidenceRef: "Manifesto Costing Sheet (ARDCI Internal) #MCS-2026",
            acknowledgedByCandidate: false,
            candidateResponse: "DSA/GATE bootcamps use peer tutors (zero cost). Livestream uses existing AV equipment. Ambassadors are volunteer roles. Detailed costing to be released pre-election."
          }
        ],

        controversies: [
          {
            caseId: "CONT-2025-004",
            title: "Peer Tutoring Network Grade Inflation Allegation",
            description: "As founder of Campus Peer Tutoring Network, Ananya's team allegedly shared past exam papers with tutees. Professor complaint filed. Investigation found no evidence of paper leakage but noted 'insufficient boundary protocols'.",
            status: "Resolved - Cleared",
            filedBy: "Professor, Department of ECE",
            filedDate: "October 2024",
            hearingDate: "November 15, 2024",
            outcome: "Academic Integrity Committee cleared tutoring network of paper sharing. Recommended formal tutoring guidelines and tutor training on academic integrity boundaries.",
            penalty: "None. Guidelines implemented.",
            evidenceRef: "Academic Integrity Committee Report #AIC-2024-11",
            isActive: false
          },
          {
            caseId: "CONT-2025-005",
            title: "Women in STEM Conclave Sponsorship Transparency",
            description: "As Organizer of WiSTEM 2024, Ananya secured ₹8L corporate sponsorship. RTI revealed ₹1.2L spent on 'organizer hospitality' (premium hotel, meals for 12 organizers). Questions raised about proportionality.",
            status: "Resolved - Penalty",
            filedBy: "Student RTI Forum",
            filedDate: "December 2024",
            hearingDate: "January 20, 2025",
            outcome: "Finance Committee found hospitality expenses exceeded university norms (max ₹2,000/day/person). Ananya directed to reimburse ₹68,000 from personal funds. Reimbursed within 30 days.",
            penalty: "₹68,000 personal reimbursement",
            evidenceRef: "Finance Committee Order #FCO-2025-02",
            isActive: false
          }
        ],

        financialDisclosures: [
          {
            year: "2024-2025",
            totalExpenditure: 850000,
            totalIncome: 920000,
            majorExpenses: [
              { category: "IEEE Student Chapter Operations", amount: 320000, description: "Workshops, symposiums, hardware kits" },
              { category: "WiSTEM National Conclave 2024", amount: 480000, description: "Venue, speakers, hospitality (incl. flagged expenses)" },
              { category: "Peer Tutoring Network", amount: 50000, description: "Platform hosting, tutor stipends" }
            ],
            fundingSources: [
              { source: "IEEE Global Chapter Grant", amount: 400000, type: "Sponsorship" },
              { source: "Corporate Sponsorships (WiSTEM)", amount: 800000, type: "Sponsorship" },
              { source: "Department Academic Fund", amount: 150000, type: "University Grant" },
              { source: "Personal Contribution", amount: 50000, type: "Personal" }
            ],
            auditStatus: "Audited",
            auditRef: "IEEE Chapter Audit #ICA-2024 & WiSTEM Finance Report"
          }
        ],

        votingRecord: [],

        attendanceRecord: [
          {
            sessionType: "Committee",
            date: "2024-2025 Academic Year",
            attended: true,
            reasonIfAbsent: "",
            totalSessions: 18,
            sessionsAttended: 16
          },
          {
            sessionType: "Town Hall",
            date: "2024-2025 Academic Year",
            attended: true,
            reasonIfAbsent: "",
            totalSessions: 4,
            sessionsAttended: 4
          }
        ],

        publicFeedback: {
          overallRating: 4.1,
          totalReviews: 623,
          categoryRatings: [
            { category: "Academic Advocacy", rating: 4.5, reviewCount: 234 },
            { category: "Technical Competence", rating: 4.6, reviewCount: 198 },
            { category: "Inclusivity", rating: 4.2, reviewCount: 178 },
            { category: "Feasibility", rating: 3.4, reviewCount: 156 },
            { category: "Transparency", rating: 3.7, reviewCount: 142 }
          ],
          sentimentBreakdown: {
            positive: 356,
            neutral: 167,
            negative: 100
          },
          topPraises: [
            "Peer tutoring network genuinely helped hundreds of students",
            "WiSTEM conclave was best women-in-tech event on campus",
            "Clear, data-driven proposals with implementation details",
            "Strong on research culture - IEEE grants actually work"
          ],
          topComplaints: [
            "Never run a budget this big - can she handle council finances?",
            "Esports arena feels like pet project for her department",
            "Timelines for internet upgrade seem fantasy",
            "Hospitality expenses at WiSTEM looked bad even if cleared"
          ],
          lastUpdated: "January 2026"
        },

        sources: [
          // Party info
          { claimType: "Manifesto Promise", claimRef: "C2-PARTY", sourceType: "Official Document", sourceTitle: "ARDCI Party Constitution & Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },

          // Manifesto promises (14)
          { claimType: "Manifesto Promise", claimRef: "C2-P01", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P02", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P03", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P04", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P05", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P06", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P07", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P08", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P09", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P10", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P11", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P12", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P13", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C2-P14", sourceType: "Official Document", sourceTitle: "ARDCI Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },

          // Criticisms
          { claimType: "Criticism", claimRef: "CRIT-C2-01", sourceType: "Student Survey", sourceTitle: "Student Leadership Perception Survey (n=1,240)", sourceUrl: "", sourceDate: "December 2025", verificationStatus: "Verified", verifiedBy: "Independent Survey Team" },
          { claimType: "Criticism", claimRef: "CRIT-C2-02", sourceType: "RTI Response", sourceTitle: "RTI Response #RTI-2025-112", sourceUrl: "", sourceDate: "December 2025", verificationStatus: "Verified", verifiedBy: "RTI Cell" },
          { claimType: "Criticism", claimRef: "CRIT-C2-03", sourceType: "Third-Party Audit", sourceTitle: "IT Audit Report #IT-2025-11", sourceUrl: "", sourceDate: "February 2025", verificationStatus: "Verified", verifiedBy: "Central Computer Centre" },
          { claimType: "Criticism", claimRef: "CRIT-C2-04", sourceType: "Third-Party Audit", sourceTitle: "Sports Facility Utilization Survey #SFU-2025", sourceUrl: "", sourceDate: "January 2025", verificationStatus: "Verified", verifiedBy: "Sports Council" },
          { claimType: "Criticism", claimRef: "CRIT-C2-05", sourceType: "Third-Party Audit", sourceTitle: "Independent Fiscal Analysis #IFA-2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Independent Analyst" },

          // Controversies
          { claimType: "Controversy", claimRef: "CONT-2025-004", sourceType: "Official Document", sourceTitle: "Academic Integrity Committee Report #AIC-2024-11", sourceUrl: "", sourceDate: "November 2024", verificationStatus: "Verified", verifiedBy: "Academic Integrity Committee" },
          { claimType: "Controversy", claimRef: "CONT-2025-005", sourceType: "Official Document", sourceTitle: "Finance Committee Order #FCO-2025-02", sourceUrl: "", sourceDate: "January 2025", verificationStatus: "Verified", verifiedBy: "Finance Committee" },

          // Financial
          { claimType: "Financial", claimRef: "FIN-C2-2024", sourceType: "Third-Party Audit", sourceTitle: "IEEE Chapter Audit #ICA-2024 & WiSTEM Finance Report", sourceUrl: "", sourceDate: "January 2025", verificationStatus: "Verified", verifiedBy: "IEEE Audit Committee" },

          // Attendance
          { claimType: "Attendance", claimRef: "ATT-C2-2024", sourceType: "Official Document", sourceTitle: "IEEE & Committee Attendance Registers 2024-2025", sourceUrl: "", sourceDate: "March 2025", verificationStatus: "Verified", verifiedBy: "Committee Secretariat" },

          // Feedback
          { claimType: "Feedback", claimRef: "FB-C2-2026", sourceType: "Student Survey", sourceTitle: "Comprehensive Candidate Feedback Survey (n=623)", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Independent Survey Team" }
        ],

        profileCompleteness: {
          manifestoComplete: true,
          performanceComplete: false,
          criticismsDocumented: true,
          controversiesDocumented: true,
          financialsDisclosed: true,
          votingRecordDisclosed: false,
          attendanceDisclosed: true,
          feedbackCollected: true,
          sourcesVerified: true,
          overallScore: 82
        }
      },
      {
        candidateId: "3",
        name: "Rohan Varma",
        party: "United Student Welfare & Athletics Coalition (USWAC)",
        avatarIpfs: "",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        position: "Student Council President",
        department: "Mechanical Engineering",
        year: "4th Year / Senior",
        isIncumbent: false,
        tagline: "Student Welfare First: Nutritious Food, Mental Wellbeing, and Campus Vitality",
        bio: "Captain of the University Basketball Team and Hostel Warden Council Representative, Rohan has spearheaded health and fitness campaigns and cultural events. His campaign champions subsidized quality dining, modern indoor sports facilities, 24/7 confidential mental wellness support, safe campus transit, and vibrant student life.",
        experience: [
          "Captain, University Basketball Team (2024–2025)",
          "Hostel Block Warden Council Representative (2023–2024)",
          "Head Coordinator, Spandan Annual Cultural & Sports Fest (2024)",
          "Volunteer, Red Cross Campus Blood Donation Drive (2023)"
        ],
        priorities: [
          "Nutritious ₹35 subsidized thali plate in all student cafeterias",
          "Renovated indoor sports complex with certified fitness trainers & extended hours",
          "24/7 confidential mental wellness counseling & certified tele-therapy",
          "Electric night transit shuttles connecting outer hostels with labs and main gate"
        ],
        keyPromises: [
          "Cap basic nutritious cafeteria meal at ₹35 with monthly student taste audits",
          "Modernize gym equipment and open sports complex until 11:30 PM",
          "Partner with accredited counseling provider for 100% confidential mental wellness sessions",
          "Introduce late-night campus safety golf cart transit for hostel residents"
        ],
        manifesto: [
          {
            id: "C3-P01",
            category: "Academic Excellence",
            title: "Interdisciplinary Hackathons & Student Innovation Showcase",
            currentProblem: "Students in non-computer science departments feel excluded from university tech festivals and hackathons.",
            proposedSolution: "Host two multi-disciplinary design-build challenges integrating Mechanical CAD, Biotech hardware, and IoT electronics with ₹3 Lakhs prize pools.",
            expectedBenefit: "Encourages cross-department team formation and practical engineering problem-solving.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Coordinate with Mechanical and Biotech departments for makerspace access",
              "Secure corporate sponsorship from manufacturing and automotive firms",
              "Conduct 36-hour physical prototype hackathon"
            ],
            dependenciesAndBudget: "Corporate sponsorship matches ₹1.5 Lakhs council seed grant.",
            measurableMetrics: "At least 60 cross-department teams competing; 15 working physical prototypes.",
            status: "Proposed",
            evidenceRef: "Spandan Fest Report #SFR-2024"
          },
          {
            id: "C3-P02",
            category: "Library and Learning Resources",
            title: "Outdoor Green Study Gazebos with Solar Charging Benches",
            currentProblem: "Indoor library desks are cramped and sterile, while students who enjoy studying outdoors have no charging points or shaded tables.",
            proposedSolution: "Erect 8 shaded wooden study gazebos in the campus botanical gardens, equipped with solar canopy roof panels, USB power banks, and Wi-Fi repeaters.",
            expectedBenefit: "Refreshing open-air study spaces surrounded by greenery, reducing stress during heavy exam preparation.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Survey garden locations with Estate Office for optimal tree shade",
              "Procure weather-resistant teakwood benches and solar panel kits",
              "Install low-glare warm LED lighting for evening reading"
            ],
            dependenciesAndBudget: "₹3.4 Lakhs funding from Campus Beautification & Green Fund.",
            measurableMetrics: "8 outdoor gazebos fully operational; 90% student occupancy in pleasant weather.",
            status: "Proposed",
            evidenceRef: "Campus Beautification Plan #CBP-2025"
          },
          {
            id: "C3-P03",
            category: "Campus Infrastructure",
            title: "Clean Modern Restrooms with Automated Hygiene Sensors & Sanitary Dispensers",
            currentProblem: "Restrooms in older academic blocks frequently suffer from broken flushes, lack of soap, and absent menstrual hygiene products.",
            proposedSolution: "Complete sanitation overhaul with touchless faucets, automated soap dispensers, and free sanitary napkin vending machines in all female restrooms.",
            expectedBenefit: "Clean, hygienic, dignified restroom facilities across all campus buildings with 100% soap and water availability.",
            targetTimeline: "Q1 2026",
            implementationSteps: [
              "Replace corroded plumbing fittings in Academic Blocks 1, 2, and 3",
              "Install 14 free sanitary napkin dispensers restocked daily by cleaning crew",
              "Affix digital feedback QR codes for immediate reporting of cleanliness lapses"
            ],
            dependenciesAndBudget: "Funded through Estate hygiene maintenance contract.",
            measurableMetrics: "Daily inspection audit checklist verified; 0 negative sanitation reports.",
            status: "Proposed",
            evidenceRef: "Hygiene Committee Report #HCR-2025"
          },
          {
            id: "C3-P04",
            category: "Wi-Fi and Digital Facilities",
            title: "Hostel Common Room Media Centers & Smart Entertainment Hubs",
            currentProblem: "Hostel common rooms contain broken CRT televisions and zero collaborative presentation displays for group projects or student screenings.",
            proposedSolution: "Equip each hostel common lounge with a 65-inch 4K smart display, HDMI casting, and high-speed dedicated wired Ethernet for student presentations and weekend movie clubs.",
            expectedBenefit: "Vibrant communal gathering spaces for group learning, movie nights, and community bonding.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Procure 6 commercial displays with wall mounting and protective acrylic covers",
              "Run dedicated gigabit Ethernet drop from floor distribution switch",
              "Establish student lounge management committee for fair usage"
            ],
            dependenciesAndBudget: "₹2.8 Lakhs from Hostel Student Amenity Fund.",
            measurableMetrics: "All 6 dorm common lounges equipped and active for student bookings.",
            status: "Proposed",
            evidenceRef: "Hostel Warden Council Minutes #HWC-2024"
          },
          {
            id: "C3-P05",
            category: "Sports and Gym Facilities",
            title: "Comprehensive Sports Overhaul: Floodlights, Trainers & Extended Hours",
            currentProblem: "Outdoor cricket and football grounds are pitch black after 6:30 PM, the gym closes at 8:00 PM, and equipment is outdated.",
            proposedSolution: "Install high-efficiency LED floodlighting on football ground, keep gym open until 11:30 PM with certified coaches, and sponsor inter-college team travel.",
            expectedBenefit: "Unprecedented athletic opportunities for both varsity competitors and casual evening fitness enthusiasts.",
            targetTimeline: "Q1 2026",
            implementationSteps: [
              "Erect 4 perimeter LED floodlight towers on the central athletic field",
              "Hire 2 certified strength & conditioning trainers for extended gym shifts",
              "Increase university sports travel daily allowance by 50%"
            ],
            dependenciesAndBudget: "Sports Council budget allocation of ₹7.2 Lakhs.",
            measurableMetrics: "Evening athletic field utilization quadrupled; varsity teams compete in 12+ national meets.",
            status: "Proposed",
            evidenceRef: "Sports Council Audit #SCA-2025"
          },
          {
            id: "C3-P06",
            category: "Student Clubs and Cultural Events",
            title: "Mega Inter-Collegiate Cultural Festival 'Spandan 2026' Expansion",
            currentProblem: "Cultural fest budget was slashed during previous administration, resulting in cancelled artist performances and reduced footfall.",
            proposedSolution: "Triple external corporate sponsorship for Spandan 2026, invite headline national music performers, and introduce inter-hostel cultural trophy.",
            expectedBenefit: "Restoring the university's cultural reputation as the premier collegiate arts festival in the state.",
            targetTimeline: "Q3 2026",
            implementationSteps: [
              "Form student sponsorship cell targeting major beverage and youth brands",
              "Sign headline musical artist 4 months in advance",
              "Introduce 18 new cultural competition categories including street theatre and rap battles"
            ],
            dependenciesAndBudget: "Self-funding through corporate sponsorships (₹18 Lakhs target).",
            measurableMetrics: "Over 8,000 attendee footfalls; zero budget deficit.",
            status: "Proposed",
            evidenceRef: "Spandan Fest Report #SFR-2024"
          },
          {
            id: "C3-P07",
            category: "Student Safety and Anti-Ragging",
            title: "Student-Led Night Safety Patrols & Full Perimeter CCTV Coverage",
            currentProblem: "Dark corners behind the mechanical workshops and perimeter fencing have had reported incidents of unauthorized outsiders entering campus.",
            proposedSolution: "Install 32 high-resolution infrared night-vision CCTV cameras along boundary walls, and organize joint security guard and senior student night watch patrols.",
            expectedBenefit: "100% secure campus perimeter; absolute deterrence against outside trespassers.",
            targetTimeline: "Q1 2026",
            implementationSteps: [
              "Identify blind spots with Chief Security Officer",
              "Install 32 IP-based night vision cameras with 30-day cloud backup",
              "Improve LED perimeter lighting along the back boundary"
            ],
            dependenciesAndBudget: "Estate Security budget line (₹4.2 Lakhs).",
            measurableMetrics: "Zero unauthorized perimeter breaches; 100% camera uptime.",
            status: "Proposed",
            evidenceRef: "Proctorial Board Memo #PBM-2025"
          },
          {
            id: "C3-P08",
            category: "Transport and Hostel Facilities",
            title: "Night Transit Electric Shuttles & Hostel Room AC Pilot",
            currentProblem: "Extreme summer heat causes severe dehydration and sleeplessness in top-floor hostel rooms with metal roofs.",
            proposedSolution: "Deploy 2 electric passenger golf carts operating free continuous loops until 1:00 AM, and initiate a phased air-cooled ventilation duct pilot in top-floor dormitories.",
            expectedBenefit: "Safe late-night travel across campus and tolerable living temperatures during hot summer months.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Lease 2 twelve-seater electric campus golf carts",
              "Establish scheduled stops at Main Gate, Library, Academic Blocks, and Hostels",
              "Pilot evaporative cooling ductwork in Hostel Block C top floor"
            ],
            dependenciesAndBudget: "₹5.5 Lakhs joint venture between Council and Hostel Management.",
            measurableMetrics: "Over 800 passengers transported safely each night; top floor room temp reduced by 6°C.",
            status: "Proposed",
            evidenceRef: "Dean Order #SWD-102"
          },
          {
            id: "C3-P09",
            category: "Canteen Food Quality and Affordability",
            title: "Canteen Menu Diversification, ₹35 Price Cap & Fruit/Salad Bar",
            currentProblem: "Canteens offer heavy fried snacks and repetitive menus with no fresh fruit or healthy protein alternatives for athletic students.",
            proposedSolution: "Introduce fresh seasonal juice and fruit salad counter, mandate strict ₹35 lunch plate price cap, and implement student-elected Mess Oversight Committee.",
            expectedBenefit: "Nutritious, fresh, diverse food options fueling both academic performance and athletic recovery.",
            targetTimeline: "Q1 2026",
            implementationSteps: [
              "Mandate dedicated fresh juice and healthy breakfast counter in Canteen 2",
              "Enforce contract penalty clauses for stale food or substandard oil use",
              "Publish weekly menu rotations with student voting on menu choices"
            ],
            dependenciesAndBudget: "Zero extra cost to college; mandated via tender contract condition.",
            measurableMetrics: "85% student approval on monthly canteen taste surveys.",
            status: "Proposed",
            evidenceRef: "Canteen Report #CC-2025-Q3"
          },
          {
            id: "C3-P10",
            category: "Mental Wellbeing and Student Support",
            title: "Dedicated Wellness Sanctuary & Certified 24/7 Tele-Therapy App",
            currentProblem: "Students experiencing panic attacks or grief during semesters have no calm, quiet retreat on campus.",
            proposedSolution: "Create a serene indoor 'Mindfulness Sanctuary' with acoustic soundproofing, sensory lighting, and free subscriptions to an accredited tele-therapy counseling app.",
            expectedBenefit: "Immediate, accessible mental healthcare accessible from anywhere on or off campus 24 hours a day.",
            targetTimeline: "Q1 2026",
            implementationSteps: [
              "Convert vacant reading lounge into soundproofed Mindfulness Sanctuary",
              "Procure enterprise campus license for certified mental wellness app",
              "Host weekly mindfulness and stress-reduction workshops"
            ],
            dependenciesAndBudget: "₹3 Lakhs annual healthcare subscription grant.",
            measurableMetrics: "Over 1,000 app downloads; 300+ students utilizing sanctuary space monthly.",
            status: "Proposed",
            evidenceRef: "Sanction Letter #SWD-102"
          },
          {
            id: "C3-P11",
            category: "Internship, Placement and Career Development",
            title: "Industrial Apprenticeship Fair & Startup Internship Matchmaker",
            currentProblem: "First and second-year students struggle to find verified summer internships and have to rely on unpaid spam opportunities on LinkedIn.",
            proposedSolution: "Host an exclusive on-campus Startup & MSME Internship Fair connecting pre-final students with 50+ vetted companies offering paid stipends of ≥ ₹15,000/month.",
            expectedBenefit: "Early industry experience and paid summer internships for 300+ students before their final year.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Partner with State Startup Hub and local industrial chambers",
              "Pre-screen student resumes and conduct speed-interview days",
              "Enforce minimum ₹15,000/month stipend policy for all registered recruiters"
            ],
            dependenciesAndBudget: "Corporate participation fees cover operational expenses.",
            measurableMetrics: "350+ paid internship offers generated for 2nd and 3rd-year students.",
            status: "Proposed",
            evidenceRef: "Placement Report #TPC-2025"
          },
          {
            id: "C3-P12",
            category: "Student Grievances and Transparency",
            title: "Weekly 'Chai with Council' Open Town Halls & Direct Action Slips",
            currentProblem: "Student council leaders often become distant and unreachable once elected, appearing only during annual fests.",
            proposedSolution: "Hold open-microphone weekly Wednesday tea sessions in the cafeteria lawn where any student can question council leaders face-to-face and receive a signed action slip.",
            expectedBenefit: "Direct, informal accountability where leaders cannot hide behind bureaucracy or vague promises.",
            targetTimeline: "Q1 2026 (Every Wednesday)",
            implementationSteps: [
              "Reserve outdoor cafeteria lawn every Wednesday at 5:00 PM",
              "Distribute carbon-copy action slips with 72-hour turnaround promise",
              "Post photographs and resolution updates on official Instagram/intranet"
            ],
            dependenciesAndBudget: "Minimal cost (tea/refreshments funded from council entertainment petty cash).",
            measurableMetrics: "At least 30 open sessions held per academic year; 85% of issues resolved.",
            status: "Proposed",
            evidenceRef: "Hostel Warden Council Minutes #HWC-2024"
          },
          {
            id: "C3-P13",
            category: "Accessibility and Inclusive Campus",
            title: "Sensory-Friendly Spaces & Braille Campus Maps",
            currentProblem: "Campus grounds are large and disorienting for newly admitted students with sensory processing sensitivities or visual limitations.",
            proposedSolution: "Install tactile 3D relief campus maps at main transit hubs, and designate sensory quiet hours in the student activity center.",
            expectedBenefit: "Welcoming, navigable environment where every student feels recognized and accommodated.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "3D print relief architectural layout of the campus with Braille labels",
              "Install 4 accessible relief boards at Main Gate, Admin Block, Library, and Cafeteria",
              "Designate sensory-calm zones with low lighting"
            ],
            dependenciesAndBudget: "Fabricated in college 3D printing makerspace (₹40,000 materials).",
            measurableMetrics: "4 tactile boards deployed; verified by accessibility advocates.",
            status: "Proposed",
            evidenceRef: "Campus Accessibility Audit #CAA-2025"
          },
          {
            id: "C3-P14",
            category: "Environment and Sustainability",
            title: "Campus Bicycle Repair Co-op & Rainwater Harvesting Revival",
            currentProblem: "Students abandon punctured bicycles because local repair shops charge exorbitant rates, creating scrap piles around dorms.",
            proposedSolution: "Establish a student-run volunteer bike repair station with free air pumps, patches, and basic tools, alongside reviving the 3 campus rainwater recharge wells.",
            expectedBenefit: "Prolonged bicycle usage, clean zero-emission transport, and replenishing campus groundwater tables.",
            targetTimeline: "Q2 2026",
            implementationSteps: [
              "Procure heavy-duty bike maintenance stands, air compressors, and patch kits",
              "Organize weekend repair clinics taught by student cycling club",
              "Clear silt from 3 rainwater percolation pits before monsoon season"
            ],
            dependenciesAndBudget: "₹75,000 initial tool grant from Green Campus initiative.",
            measurableMetrics: "Over 400 student bicycles serviced and kept operational; groundwater recharge restored.",
            status: "Proposed",
            evidenceRef: "Green Audit Report #SEC-2025"
          }
        ],
        performanceRecords: [],
        timelineMilestones: [
          {
            phase: "Q1 2026 (Rapid Action)",
            title: "Canteen Price Cap & Gym Hours Extended to 11:30 PM",
            description: "Enforce ₹35 meal plate price cap and immediately extend evening fitness hours.",
            dateOrPeriod: "Month 1–2",
            status: "Upcoming"
          },
          {
            phase: "Q2 2026 (Infrastructure)",
            title: "Floodlights on Athletic Field & Night Golf Cart Shuttles",
            description: "Install 4 LED towers on football ground and launch late-night campus shuttles.",
            dateOrPeriod: "Month 3–5",
            status: "Upcoming"
          },
          {
            phase: "Q3 2026 (Culture & Life)",
            title: "Mega Spandan 2026 Festival & Paid Internship Fair",
            description: "Host premier state-level arts festival and on-campus startup internship drive.",
            dateOrPeriod: "Month 6–8",
            status: "Upcoming"
          },
          {
            phase: "Q4 2026 (Wellness)",
            title: "Mindfulness Sanctuary & Bicycle Co-op Launch",
            description: "Inaugurate dedicated indoor quiet sanctuary and student bicycle repair hub.",
            dateOrPeriod: "Month 9–11",
            status: "Upcoming"
          }
        ],

        // --- COMPREHENSIVE PROFILE FIELDS FOR CANDIDATE 3 (ROHAN VARMA) ---

        criticisms: [
          {
            category: "Governance",
            title: "Populist Promises Without Fiscal Backing",
            description: "Rohan's platform is heavy on popular giveaways (₹35 thali, free gym, night shuttles, mental health app) but light on revenue sources. Sports Council budget of ₹7.2L for floodlights/trainers is already allocated; other promises require new funds. Critics call it 'promise inflation'.",
            severity: "Major",
            source: "Independent Fiscal Analysis #IFA-2026 & Sports Council Budget Docs",
            evidenceRef: "Sports Council Audit #SCA-2025 & Fiscal Gap Analysis #FGA-2026",
            acknowledgedByCandidate: true,
            candidateResponse: "Prioritization is key. Year 1 focuses on price cap (contractual, zero cost) and gym hours (existing staff overtime). Shuttles & app funded via alumni CSR (₹8L committed). Mental health grant application submitted to UGC."
          },
          {
            category: "Transparency",
            title: "Spandan Fest 2024 Budget Opacity",
            description: "As Head Coordinator of Spandan 2024, Rohan managed ₹18L budget. Post-fest audit showed ₹4.3L 'miscellaneous expenses' with no itemization. Student RTI forum flagged 24% of budget as unverifiable. No public ledger published.",
            severity: "Moderate",
            source: "RTI Response #RTI-2025-134 & Fest Audit #SFR-2024",
            evidenceRef: "Spandan 2024 Expenditure Statement (Unaudited) #SFS-2024",
            acknowledgedByCandidate: true,
            candidateResponse: "Miscellaneous included emergency artist fees, last-minute logistics, weather contingencies. Receipts exist but were not consolidated. Committed to real-time public ledger for Spandan 2026 with daily updates."
          },
          {
            category: "Feasibility",
            title: "Night Shuttle Operations Unproven",
            description: "Promises electric golf carts running until 1 AM. Previous similar proposal (Aarav Sharma) failed Finance Committee. No driver hiring plan, no insurance framework, no maintenance budget. Campus security opposes extended patrol hours.",
            severity: "Moderate",
            source: "University Finance Committee Minutes #UFC-2024-11 & Security Council Feedback",
            evidenceRef: "Finance Committee Rejection Rationale #FCR-2024-11",
            acknowledgedByCandidate: false,
            candidateResponse: "Different model: golf carts (not van), leased not purchased, student drivers (work-study), security partnership not replacement. MoU with Security Council in draft."
          },
          {
            category: "Inclusivity",
            title: "Sports-Centric Platform Neglects Academic Needs",
            description: "4 of 5 key promises are sports/wellness/food. Only 1 academic promise (hackathons). ECE, Civil, Biotech students say platform ignores lab funding, research grants, placement diversity. 'Basketball captain running for Sports Secretary, not Council President'.",
            severity: "Moderate",
            source: "Student Survey by Department (n=1,240) & Department Representatives",
            evidenceRef: "Department-Wise Manifesto Relevance Survey #DMR-2026",
            acknowledgedByCandidate: true,
            candidateResponse: "Wellbeing IS academic performance. Hungry, stressed, unfit students don't learn. Hackathons are interdisciplinary (Mech+Biotech+IoT). Open to adding academic promises based on feedback."
          },
          {
            category: "Accountability",
            title: "Hostel Warden Council Record - Limited Impact",
            description: "As Hostel Block Warden Council Rep (2023-24), Rohan's tenure saw 3 wardens replaced for misconduct but no systemic reform. Complaint resolution time averaged 18 days (university norm: 7 days). No policy changes enacted.",
            severity: "Minor",
            source: "Hostel Warden Council Minutes #HWC-2024 & Student Grievance Data",
            evidenceRef: "Hostel Grievance Resolution Analytics #HGR-2024",
            acknowledgedByCandidate: true,
            candidateResponse: "Warden replacement IS systemic reform. Resolution time skewed by 2 complex legal cases (avg 45 days). Excluding those, avg was 6 days. Proposed 'Direct Action Slips' with 72-hour SLA addresses this."
          }
        ],

        controversies: [
          {
            caseId: "CONT-2025-006",
            title: "Basketball Team Fund Misallocation Allegation",
            description: "As Team Captain, Rohan managed ₹2.5L team budget (travel, equipment, coaching). Anonymous complaint alleged personal expense reimbursement (protein supplements, personal training). Investigation found ₹47,000 in 'gray area' expenses not clearly team-related.",
            status: "Resolved - Penalty",
            filedBy: "Anonymous Team Member",
            filedDate: "February 2025",
            hearingDate: "March 10, 2025",
            outcome: "Sports Council Ethics Panel found expenses not explicitly prohibited but lacking pre-approval. Rohan directed to reimburse ₹47,000 and attend financial ethics workshop. Reimbursed within 14 days.",
            penalty: "₹47,000 reimbursement + mandatory ethics workshop",
            evidenceRef: "Sports Council Ethics Panel Report #SCEP-2025-03",
            isActive: false
          },
          {
            caseId: "CONT-2025-007",
            title: "Red Cross Blood Drive Data Privacy Complaint",
            description: "As Volunteer Coordinator for 2023 Blood Drive, Rohan's team collected donor contact details on personal Google Sheets instead of secure university system. Data protection officer flagged violation. No breach occurred but process was non-compliant.",
            status: "Resolved - Cleared",
            filedBy: "Data Protection Officer, University",
            filedDate: "October 2023",
            hearingDate: "November 5, 2023",
            outcome: "No data breach or misuse found. Process violation acknowledged. Directed to use university CRM for all future drives. Rohan implemented compliant process for 2024 drive.",
            penalty: "Process correction only. No fine.",
            evidenceRef: "Data Protection Office Notice #DPO-2023-10",
            isActive: false
          }
        ],

        financialDisclosures: [
          {
            year: "2024-2025",
            totalExpenditure: 1250000,
            totalIncome: 1300000,
            majorExpenses: [
              { category: "Spandan Cultural & Sports Fest 2024", amount: 1100000, description: "Artists, venue, logistics, hospitality (incl. flagged misc)" },
              { category: "Basketball Team Operations", amount: 150000, description: "Travel, equipment, coaching (incl. reimbursed expenses)" }
            ],
            fundingSources: [
              { source: "Corporate Sponsorships (Spandan)", amount: 1200000, type: "Sponsorship" },
              { source: "Sports Council Allocation", amount: 200000, type: "University Grant" },
              { source: "Personal Contribution", amount: 100000, type: "Personal" }
            ],
            auditStatus: "Flagged",
            auditRef: "Spandan Audit #SFS-2024 & Sports Council Ethics Panel #SCEP-2025-03"
          }
        ],

        votingRecord: [],

        attendanceRecord: [
          {
            sessionType: "Committee",
            date: "2023-2024 Academic Year",
            attended: true,
            reasonIfAbsent: "",
            totalSessions: 24,
            sessionsAttended: 21
          },
          {
            sessionType: "Town Hall",
            date: "2024-2025 Academic Year",
            attended: true,
            reasonIfAbsent: "",
            totalSessions: 4,
            sessionsAttended: 4
          }
        ],

        publicFeedback: {
          overallRating: 3.9,
          totalReviews: 712,
          categoryRatings: [
            { category: "Student Welfare Focus", rating: 4.4, reviewCount: 267 },
            { category: "Mental Health Advocacy", rating: 4.3, reviewCount: 234 },
            { category: "Sports & Recreation", rating: 4.5, reviewCount: 198 },
            { category: "Fiscal Responsibility", rating: 3.0, reviewCount: 178 },
            { category: "Academic Advocacy", rating: 2.8, reviewCount: 156 }
          ],
          sentimentBreakdown: {
            positive: 389,
            neutral: 167,
            negative: 156
          },
          topPraises: [
            "Genuinely cares about food quality and student hunger",
            "Mental health sanctuary + tele-therapy is exactly what we need",
            "Night shuttles would be life-saving for late lab students",
            "Bicycle co-op is practical, low-cost, high-impact"
          ],
          topComplaints: [
            "Spandan budget mess - where did ₹4.3L go?",
            "Basketball fund reimbursement looks bad for a 'welfare' candidate",
            "All sports/food/wellness - what about labs, placements, research?",
            "Night shuttles sound great but previous admin tried and failed"
          ],
          lastUpdated: "January 2026"
        },

        sources: [
          // Party info
          { claimType: "Manifesto Promise", claimRef: "C3-PARTY", sourceType: "Official Document", sourceTitle: "USWAC Party Constitution & Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },

          // Manifesto promises (14)
          { claimType: "Manifesto Promise", claimRef: "C3-P01", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P02", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P03", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P04", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P05", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P06", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P07", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P08", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P09", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P10", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P11", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P12", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P13", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },
          { claimType: "Manifesto Promise", claimRef: "C3-P14", sourceType: "Official Document", sourceTitle: "USWAC Election Manifesto 2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Election Commission" },

          // Criticisms
          { claimType: "Criticism", claimRef: "CRIT-C3-01", sourceType: "Third-Party Audit", sourceTitle: "Independent Fiscal Analysis #IFA-2026 & Sports Council Audit #SCA-2025", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Independent Analyst" },
          { claimType: "Criticism", claimRef: "CRIT-C3-02", sourceType: "RTI Response", sourceTitle: "RTI Response #RTI-2025-134", sourceUrl: "", sourceDate: "December 2025", verificationStatus: "Verified", verifiedBy: "RTI Cell" },
          { claimType: "Criticism", claimRef: "CRIT-C3-03", sourceType: "Official Document", sourceTitle: "Finance Committee Minutes #UFC-2024-11", sourceUrl: "", sourceDate: "November 2024", verificationStatus: "Verified", verifiedBy: "Finance Committee" },
          { claimType: "Criticism", claimRef: "CRIT-C3-04", sourceType: "Student Survey", sourceTitle: "Department-Wise Manifesto Relevance Survey #DMR-2026", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Independent Survey Team" },
          { claimType: "Criticism", claimRef: "CRIT-C3-05", sourceType: "Official Document", sourceTitle: "Hostel Warden Council Minutes #HWC-2024 & Grievance Analytics #HGR-2024", sourceUrl: "", sourceDate: "March 2024", verificationStatus: "Verified", verifiedBy: "Hostel Council Secretariat" },

          // Controversies
          { claimType: "Controversy", claimRef: "CONT-2025-006", sourceType: "Official Document", sourceTitle: "Sports Council Ethics Panel Report #SCEP-2025-03", sourceUrl: "", sourceDate: "March 2025", verificationStatus: "Verified", verifiedBy: "Sports Council Ethics Panel" },
          { claimType: "Controversy", claimRef: "CONT-2025-007", sourceType: "Official Document", sourceTitle: "Data Protection Office Notice #DPO-2023-10", sourceUrl: "", sourceDate: "November 2023", verificationStatus: "Verified", verifiedBy: "Data Protection Officer" },

          // Financial
          { claimType: "Financial", claimRef: "FIN-C3-2024", sourceType: "Third-Party Audit", sourceTitle: "Spandan Audit #SFS-2024 & Sports Council Ethics Panel #SCEP-2025-03", sourceUrl: "", sourceDate: "March 2025", verificationStatus: "Disputed", verifiedBy: "Sports Council Ethics Panel" },

          // Attendance
          { claimType: "Attendance", claimRef: "ATT-C3-2023", sourceType: "Official Document", sourceTitle: "Hostel Warden Council & Committee Attendance Registers", sourceUrl: "", sourceDate: "March 2025", verificationStatus: "Verified", verifiedBy: "Council Secretariat" },

          // Feedback
          { claimType: "Feedback", claimRef: "FB-C3-2026", sourceType: "Student Survey", sourceTitle: "Comprehensive Candidate Feedback Survey (n=712)", sourceUrl: "", sourceDate: "January 2026", verificationStatus: "Verified", verifiedBy: "Independent Survey Team" }
        ],

        profileCompleteness: {
          manifestoComplete: true,
          performanceComplete: false,
          criticismsDocumented: true,
          controversiesDocumented: true,
          financialsDisclosed: true,
          votingRecordDisclosed: false,
          attendanceDisclosed: true,
          feedbackCollected: true,
          sourcesVerified: true,
          overallScore: 78
        }
      }
    ];

    // Delete existing candidates and insert rich candidate profiles
    await Candidate.deleteMany({});
    for (const cData of candidatesData) {
      await Candidate.create(cData);
    }
    console.log(`Successfully seeded ${candidatesData.length} candidates with full manifestos and performance records.`);

    // Seed Campus Issues ("What Students Want to Improve")
    const issuesData = [
      {
        issueId: "ISSUE-01",
        title: "Hostel Wi-Fi Dead Zones & Bandwidth Throttling",
        category: "Wi-Fi and Digital Facilities",
        urgency: "Critical",
        description: "Evening bandwidth drops below 3 Mbps in Hostels B and C. Multiple wings suffer from complete signal blackouts, hindering project submissions and online research.",
        currentStatus: "Partially addressed in Hostel A during 2024 term; Hostels B and C await Phase 2 hardware installation.",
        studentSentiment: "89% of 1,240 surveyed hostellers rated this as their #1 daily frustration.",
        solutions: [
          {
            candidateId: "1",
            candidateName: "Aarav Sharma",
            proposedApproach: "Complete Phase 2 & 3 installation using existing pre-approved IT budget line of ₹6.2 Lakhs within 90 days of taking office.",
            manifestoPromiseTitle: "Hostel Wi-Fi 6 Completion (Phases 2 & 3 for Hostels B, C, and D)",
            timelineTarget: "Q1 2026 (Day 90)"
          },
          {
            candidateId: "2",
            candidateName: "Ananya Iyer",
            proposedApproach: "Procure secondary redundant 1 Gbps NKN fiber line, deploy dual-band mesh Wi-Fi 6 in all wings, and institute dynamic QoS prioritizing academic and research traffic.",
            manifestoPromiseTitle: "1 Gbps Symmetrical Fiber & Campus-Wide Open Wi-Fi 6 Network",
            timelineTarget: "Q1 2026 (Day 60)"
          },
          {
            candidateId: "3",
            candidateName: "Rohan Varma",
            proposedApproach: "Install dedicated high-speed wired Ethernet in all hostel common rooms and lounges as guaranteed study hubs while corridor APs are being installed.",
            manifestoPromiseTitle: "Hostel Common Room Media Centers & Smart Entertainment Hubs",
            timelineTarget: "Q2 2026"
          }
        ]
      },
      {
        issueId: "ISSUE-02",
        title: "24/7 Library & Quiet Reading Room Access During Exam Weeks",
        category: "Library and Learning Resources",
        urgency: "High",
        description: "Library currently closes at 9:00 PM on normal days and 2:00 AM during exams. Crowded hostel rooms do not provide quiet environments for intensive late-night revision.",
        currentStatus: "2:00 AM extension negotiated in 2024; permanent 24/7 access requires security staffing and biometric partition.",
        studentSentiment: "81% of students requested uninterrupted 24-hour reading rooms during Midterms and Endterms.",
        solutions: [
          {
            candidateId: "1",
            candidateName: "Aarav Sharma",
            proposedApproach: "Make 24/7 access permanent for the 2nd Floor East Wing using smart biometric card turnstiles and hired night proctors.",
            manifestoPromiseTitle: "Permanent 24/7 Central Library Study Commons with Power Pods",
            timelineTarget: "Q1 2026 (Day 60)"
          },
          {
            candidateId: "2",
            candidateName: "Ananya Iyer",
            proposedApproach: "Full 24/7 conversion of Floor 2 with free networked printing (100 pages/student) and off-campus EZproxy access to all research databases.",
            manifestoPromiseTitle: "Full 24/7 Digital Commons with Free Printing & E-Journal Access",
            timelineTarget: "Q1 2026"
          },
          {
            candidateId: "3",
            candidateName: "Rohan Varma",
            proposedApproach: "Supplement central library with 8 shaded outdoor solar-powered garden gazebos equipped with lighting and power banks for open-air group study.",
            manifestoPromiseTitle: "Outdoor Green Study Gazebos with Solar Charging Benches",
            timelineTarget: "Q2 2026"
          }
        ]
      },
      {
        issueId: "ISSUE-03",
        title: "Canteen Food Quality, Hygiene Ratings & Inflationary Price Creep",
        category: "Canteen Food Quality and Affordability",
        urgency: "High",
        description: "Cafeteria meal prices have increased up to 22% over two years, while students report repetitive oily menus and lack of clear nutritional scoring.",
        currentStatus: "Staples capped under previous inspection committee; kitchen modernization and variety overhaul required.",
        studentSentiment: "74% of dining hall patrons dissatisfied with nutritional variety and pricing transparency.",
        solutions: [
          {
            candidateId: "1",
            candidateName: "Aarav Sharma",
            proposedApproach: "Legally mandate a ₹35 subsidized student thali in vendor lease renewals and institute monthly third-party microbiological laboratory swab testing.",
            manifestoPromiseTitle: "Subsidized ₹35 'Healthy Thali' & Mandatory Monthly Hygiene Scorecards",
            timelineTarget: "Q1 2026"
          },
          {
            candidateId: "2",
            candidateName: "Ananya Iyer",
            proposedApproach: "Deploy digital mobile pre-ordering app to eliminate 25-minute lunch queues, with published weekly calorie and protein breakdown cards.",
            manifestoPromiseTitle: "Digital Canteen Mobile Pre-Ordering & Independent Nutrition Audits",
            timelineTarget: "Q1 2026"
          },
          {
            candidateId: "3",
            candidateName: "Rohan Varma",
            proposedApproach: "Enforce ₹35 meal cap, add fresh seasonal fruit juice/salad counters, and establish a student-elected daily mess oversight committee.",
            manifestoPromiseTitle: "Canteen Menu Diversification, ₹35 Price Cap & Fruit/Salad Bar",
            timelineTarget: "Q1 2026"
          }
        ]
      },
      {
        issueId: "ISSUE-04",
        title: "Confidential Student Mental Health Support & Crisis Intervention",
        category: "Mental Wellbeing and Student Support",
        urgency: "Critical",
        description: "Existing campus psychological counseling operates only 4 hours per week with a 3-week waiting backlog. Students report high stigma in seeking help.",
        currentStatus: "Emergency hospital van deployed in 2024; on-campus preventative psychological counseling remains under-resourced.",
        studentSentiment: "68% of surveyed students reported severe academic or placement anxiety without accessible on-campus support.",
        solutions: [
          {
            candidateId: "1",
            candidateName: "Aarav Sharma",
            proposedApproach: "Hire two full-time licensed clinical psychologists with private consulting suites away from administration and an emergency 24/7 crisis hotline.",
            manifestoPromiseTitle: "Full-Time Licensed Clinical Psychologists & 24/7 Crisis Hotline",
            timelineTarget: "Q2 2026"
          },
          {
            candidateId: "2",
            candidateName: "Ananya Iyer",
            proposedApproach: "Train 30 certified student peer mentors, launch an anonymous encrypted chat helpline, and host pet therapy days during finals.",
            manifestoPromiseTitle: "Anonymous Peer Support Hotline & Proactive Stress Relief Days",
            timelineTarget: "Q1 2026"
          },
          {
            candidateId: "3",
            candidateName: "Rohan Varma",
            proposedApproach: "Build an indoor soundproofed Mindfulness Sanctuary on campus and provide all students free subscriptions to an accredited tele-therapy counseling app.",
            manifestoPromiseTitle: "Dedicated Wellness Sanctuary & Certified 24/7 Tele-Therapy App",
            timelineTarget: "Q1 2026"
          }
        ]
      },
      {
        issueId: "ISSUE-05",
        title: "Night Transit Safety & Campus Shuttle Availability",
        category: "Transport and Hostel Facilities",
        urgency: "Medium",
        description: "Outer student dorms are 1.4 km from academic complexes. Students returning late from laboratories face dark unlit roads with zero public transit.",
        currentStatus: "Electric shuttle proposal failed financial sanction in late 2024; requires restructured funding mechanism.",
        studentSentiment: "79% of female hostellers and late-night researchers expressed safety concerns walking after 10 PM.",
        solutions: [
          {
            candidateId: "1",
            candidateName: "Aarav Sharma",
            proposedApproach: "Lease a 14-seater electric passenger transit van running 20-minute shuttle loops between 7:30 PM and 12:30 AM with live GPS tracking.",
            manifestoPromiseTitle: "Late-Night Campus Transit Van & Automated Laundry Expansion",
            timelineTarget: "Q2 2026"
          },
          {
            candidateId: "2",
            candidateName: "Ananya Iyer",
            proposedApproach: "Deploy 80 geo-fenced smart app-unlocked bicycles and install 6 solar-powered Blue-Light emergency intercom poles connected to central dispatch.",
            manifestoPromiseTitle: "Campus SafeWalk Companion Network & Emergency Blue-Light Call Towers",
            timelineTarget: "Q2 2026"
          },
          {
            candidateId: "3",
            candidateName: "Rohan Varma",
            proposedApproach: "Deploy two 12-seater electric golf carts running until 1:00 AM, complemented by 32 infrared night-vision perimeter CCTV cameras.",
            manifestoPromiseTitle: "Night Transit Electric Shuttles & Hostel Room AC Pilot",
            timelineTarget: "Q2 2026"
          }
        ]
      },
      {
        issueId: "ISSUE-06",
        title: "Core Engineering & Multidisciplinary Placement Opportunities",
        category: "Internship, Placement and Career Development",
        urgency: "High",
        description: "Campus placements heavily skew towards generic IT consulting, with core engineering graduates (Mechanical, Civil, ECE, Chemical) facing limited specialized recruitment drives.",
        currentStatus: "Placement cell lacks dedicated branch-specific industrial outreach coordinators.",
        studentSentiment: "82% of core branch seniors requested targeted industrial recruiters and hands-on technical interview training.",
        solutions: [
          {
            candidateId: "1",
            candidateName: "Aarav Sharma",
            proposedApproach: "Pair final-year students with global alumni for 3 mock technical interviews and provide 20 student conference travel grants of ₹10,000.",
            manifestoPromiseTitle: "Alumni-Led Mock Technical Interviews & Off-Campus Internship Stipend Fund",
            timelineTarget: "Q2 2026"
          },
          {
            candidateId: "2",
            candidateName: "Ananya Iyer",
            proposedApproach: "Appoint dedicated branch placement student ambassadors, invite 200+ vetted core industrial employers, and offer free DSA/GATE prep bootcamps.",
            manifestoPromiseTitle: "Branch-Specific Core Company Outreach & Free DSA/GATE Bootcamps",
            timelineTarget: "Q2 2026"
          },
          {
            candidateId: "3",
            candidateName: "Rohan Varma",
            proposedApproach: "Organize an annual on-campus Startup & Core MSME Internship Fair connecting pre-final students with paid stipends of ≥ ₹15,000/month.",
            manifestoPromiseTitle: "Industrial Apprenticeship Fair & Startup Internship Matchmaker",
            timelineTarget: "Q2 2026"
          }
        ]
      }
    ];

    await CampusIssue.deleteMany({});
    await CampusIssue.insertMany(issuesData);
    console.log(`Successfully seeded ${issuesData.length} campus priority issues.`);

    // Seed Evidence Documents (Transparency Archive)
    const evidenceDocsData = [
      {
        docId: "DOC-2025-01",
        title: "Council Resolution #CR-2025-04: Approval of Hostel Water Purification Units",
        documentType: "Official Council Resolution",
        date: "August 12, 2024",
        issuingAuthority: "Office of the Dean of Student Welfare & Student Executive Council",
        summary: "Formal sanction and allocation of ₹5.4 Lakhs for the procurement and installation of 18 commercial RO+UV water purifiers across Hostels A, B, C, D, E, and F.",
        verificationStatus: "Officially Verified",
        candidateId: "1",
        relatedCategory: "Campus Infrastructure",
        fileNumber: "AITE/DSW/RES/2024-25/04",
        keyFindings: [
          "Tender awarded to authorized commercial purification vendor with 3-year AMC",
          "Installation completed in all 6 hostels on September 28, 2024",
          "Water purity tested by Municipal Public Health Lab (Certificate #MWQ-892)"
        ],
        fileSnippet: "BE IT RESOLVED that the Student Executive Council, in concurrence with the Estate Engineer, hereby authorizes the expenditure of ₹5,40,000 for 18 commercial water purification units. Signed: Dean Student Welfare, Council President."
      },
      {
        docId: "DOC-2025-02",
        title: "Academic Senate Resolution #ASM-88: Extended Library Reading Room Hours",
        documentType: "Senate Minutes & Circular",
        date: "October 14, 2024",
        issuingAuthority: "Academic Senate & Chief Librarian's Office",
        summary: "Senate decision approving late-night operation of Central Library 1st Floor study halls until 2:00 AM during mid-semester and end-semester examination periods.",
        verificationStatus: "Officially Verified",
        candidateId: "1",
        relatedCategory: "Library and Learning Resources",
        fileNumber: "AITE/SENATE/MIN/2024/88",
        keyFindings: [
          "Extended hours active 21 days before and during official exam sessions",
          "Security post established at library foyer with RFID attendance logs",
          "Average student utilization logged at 450+ students per evening"
        ],
        fileSnippet: "The Senate approves the proposal submitted by the Student Council President to extend study room timings to 02:00 hrs during exam schedules, subject to security provisions approved by the Chief Proctor."
      },
      {
        docId: "DOC-2025-03",
        title: "Works & Estate Work Order #WD-4091: Sports Court Resurfacing & Lighting",
        documentType: "Government Work Order & Completion Notice",
        date: "November 04, 2024 (Completed Jan 18, 2025)",
        issuingAuthority: "Department of Works & Estate Planning",
        summary: "Contract execution document for acrylic synthetic court resurfacing and high-mast LED floodlight installation at the central basketball and tennis complex.",
        verificationStatus: "Officially Verified",
        candidateId: "1",
        relatedCategory: "Sports and Gym Facilities",
        fileNumber: "AITE/WEP/WO/2024/4091",
        keyFindings: [
          "Capital sanction of ₹6,80,000 successfully disbursed",
          "Civil construction and acrylic coating completed January 15, 2025",
          "Facility inaugurated for Inter-University tournament on February 02, 2025"
        ],
        fileSnippet: "Certified that resurfacing works for Outdoor Basketball Courts 1 & 2 have been completed in accordance with specifications. Signed: Executive Engineer, Sports Council Secretary."
      },
      {
        docId: "DOC-2025-04",
        title: "IT Infrastructure Audit Report #IT-2025-11: Hostel Wi-Fi Coverage Assessment",
        documentType: "Technical Audit & Heatmap Report",
        date: "February 22, 2025",
        issuingAuthority: "Central Computer Centre & Network Security Division",
        summary: "Empirical signal strength and throughput analysis following the Phase 1 deployment in Hostel Block A, highlighting persistent dead zones in Blocks B and C.",
        verificationStatus: "Officially Verified",
        candidateId: "1",
        relatedCategory: "Wi-Fi and Digital Facilities",
        fileNumber: "CCC/AUDIT/NET/2025-11",
        keyFindings: [
          "Hostel A signal coverage: 94% good/excellent, average speed 92 Mbps",
          "Hostels B & C signal coverage: 38% acceptable, 62% dead zones/packet drop > 15%",
          "Recommended immediate execution of Phase 2 tender (72 access points required)"
        ],
        fileSnippet: "Audit demonstrates marked throughput enhancement in Block A. Blocks B and C require immediate cabling and procurement release to prevent student academic disruption."
      },
      {
        docId: "DOC-2025-05",
        title: "Canteen Committee Inspection Report #CC-2025-Q3: Hygiene & Price Compliance",
        documentType: "Committee Inspection Audit",
        date: "January 29, 2025",
        issuingAuthority: "Joint Student-Faculty Mess Monitoring Committee",
        summary: "Quarterly sanitary assessment of campus dining facilities, confirming compliance with price ceilings on 12 basic items and noting kitchen ventilation delays.",
        verificationStatus: "Council Record",
        candidateId: "1",
        relatedCategory: "Canteen Food Quality and Affordability",
        fileNumber: "AITE/CANT/Q3/2025",
        keyFindings: [
          "Price ceilings for standard breakfast/lunch items strictly adhered to by vendors",
          "Water filtration systems tested clean for microbiological contaminants",
          "Kitchen exhaust modernization identified as incomplete pending vendor negotiation"
        ],
        fileSnippet: "Price regulation has successfully checked inflationary increases. However, vendor is instructed to replace grease filters within 14 calendar days."
      },
      {
        docId: "DOC-2025-06",
        title: "Student Welfare Dean Order #SWD-102: Campus Emergency Medical Transport",
        documentType: "Administrative Sanction Order",
        date: "August 20, 2024",
        issuingAuthority: "Office of the Dean of Student Welfare",
        summary: "Sanction order authorizing the conversion of University Vehicle #AITE-08 into a 24/7 dedicated medical emergency transport stationed at the health center.",
        verificationStatus: "Officially Verified",
        candidateId: "1",
        relatedCategory: "Transport and Hostel Facilities",
        fileNumber: "AITE/DSW/MED/2024/102",
        keyFindings: [
          "Dedicated driver rota scheduled for 24-hour emergency response",
          "Oxygen support and first aid apparatus installed",
          "42 emergency patient hospital transfers completed without incident in 2024–25"
        ],
        fileSnippet: "Vehicle AITE-08 is hereby transferred to the Campus Health Center under the supervision of the Chief Medical Officer for sole emergency transit usage."
      },
      {
        docId: "DOC-2025-07",
        title: "Training & Placement Cell Annual Report #TPC-2025: Placement Statistics",
        documentType: "Annual Statistical Report",
        date: "March 15, 2025",
        issuingAuthority: "Training & Placement Directorate",
        summary: "Comprehensive placement statistics detailing branch-wise recruitment, highlighting that 71% of offers originated from software/IT sectors while core mechanical/civil had 42% placement.",
        verificationStatus: "Officially Verified",
        candidateId: "2",
        relatedCategory: "Internship, Placement and Career Development",
        fileNumber: "AITE/TPC/REP/2024-25",
        keyFindings: [
          "Overall campus placement rate: 78.4%",
          "Software/IT branch placement rate: 91.2%",
          "Core engineering (Mechanical, Civil, Chemical) placement rate: 48.6%",
          "Confirms student urgency for core company outreach and specialized recruitment drives"
        ],
        fileSnippet: "While IT hiring remained robust, core sector hiring reflected national industrial contraction. Strategic student interventions required to bridge technical skill gaps."
      },
      {
        docId: "DOC-2025-08",
        title: "Campus Green & Solar Energy Audit Report #SEC-2025: Rooftop Solar Feasibility",
        documentType: "Environmental Feasibility Study",
        date: "November 18, 2024",
        issuingAuthority: "Department of Electrical Engineering & Campus Green Committee",
        summary: "Technical report evaluating the installation of 50 kW rooftop solar photovoltaic arrays across Academic Blocks 1 and 2 to offset campus daytime electrical grid load.",
        verificationStatus: "Officially Verified",
        candidateId: "2",
        relatedCategory: "Environment and Sustainability",
        fileNumber: "AITE/GREEN/SOLAR/2024",
        keyFindings: [
          "50 kW array projected to generate 68,000 kWh annually",
          "Estimated institutional electricity cost savings of ₹5.8 Lakhs per year",
          "Payback period calculated at 4.2 years with state green energy subsidies"
        ],
        fileSnippet: "Rooftop structural integrity verified for Blocks 1 and 2. Recommended for phased capital execution under the Clean Campus Mission."
      }
    ];

    await EvidenceDoc.deleteMany({});
    await EvidenceDoc.insertMany(evidenceDocsData);
    console.log(`Successfully seeded ${evidenceDocsData.length} verified evidence documents.`);

    console.log("Seeding complete! High-quality realistic demonstration scenario loaded.");
    return { success: true };
  } catch (err) {
    console.error("Error during manifesto seeding:", err);
    throw err;
  }
};

module.exports = { seedManifestoData };

if (require.main === module) {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/evoting_db";
  mongoose.connect(MONGO_URI)
    .then(async () => {
      console.log("Connected to MongoDB for standalone seeding");
      await seedManifestoData();
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB.");
      process.exit(0);
    })
    .catch(err => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}
