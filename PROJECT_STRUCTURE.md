# Blockchain-Based-Voting-System - Project Structure Documentation

## Overview
This document describes the complete file structure and architecture of the Blockchain-Based-Voting-System.

## Root Directory
```
Blockchain-Based-Voting-System/
├── .claude/                    # ECC configuration and memory
│   ├── settings.json           # Project-specific ECC settings
│   └── memory/                 # Continuous memory tracking
│       ├── project-context.md  # Project overview and architecture
│       ├── progress.md         # Progress tracking across sessions
│       └── decisions.md        # Architectural decisions log
├── backend/                    # Node.js/Express backend
├── frontend/                   # React/Vite frontend
├── docker-compose.yml          # Docker orchestration
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```

## Backend Structure (`/backend`)

```
backend/
├── controllers/                # Route handlers
│   ├── authController.js       # Authentication routes
│   ├── electionController.js   # Election management
│   └── voteController.js       # Voting logic
├── lib/                        # Utility libraries
│   ├── hederaClient.js         # Hedera SDK client
│   ├── cryptoUtils.js          # Cryptographic utilities
│   └── jwtUtils.js             # JWT token handling
├── models/                     # MongoDB models
│   ├── User.js                 # User schema
│   ├── Election.js             # Election schema
│   ├── Vote.js                 # Vote schema
│   └── Candidate.js            # Candidate schema
├── tests/                      # Test files
│   ├── auth.test.js
│   ├── election.test.js
│   └── vote.test.js
├── server.js                   # Main entry point (Express app)
├── package.json                # Dependencies and scripts
├── package-lock.json           # Locked dependencies
├── Dockerfile                  # Docker configuration
├── .dockerignore               # Docker ignore rules
├── .gitignore                  # Git ignore rules
├── init.js                     # Database initialization
├── seedData.js                 # Seed data for development
├── createTopic.js              # Hedera topic creation
├── generatekey.js              # Key generation utility
├── compareKeys.js              # Key comparison utility
├── test-hedera.js              # Hedera integration tests
├── testKey.js                  # Key testing
├── testPrivate.js              # Private key testing
├── verifyKey.js                # Key verification
├── testdb.js                   # Database tests
└── testdb2.js                  # Additional database tests
```

### Key Backend Files

#### `server.js` - Main Entry Point
- Express application setup
- Middleware configuration (CORS, body-parser, JWT)
- Route registration
- MongoDB connection
- Hedera client initialization
- Server startup

#### `controllers/` - Route Handlers
- **authController.js**: User registration, login, token refresh
- **electionController.js**: CRUD for elections, candidate management
- **voteController.js**: Vote casting, verification, results

#### `models/` - MongoDB Schemas
- **User**: Authentication, roles, profile
- **Election**: Title, description, dates, status, candidates
- **Vote**: Voter reference, election reference, candidate, timestamp, blockchain txn ID
- **Candidate**: Name, party, election reference

#### `lib/` - Utilities
- **hederaClient.js**: Hedera network client, consensus service
- **cryptoUtils.js**: Encryption, hashing, key management
- **jwtUtils.js**: Token generation, verification, refresh

## Frontend Structure (`/frontend`)

```
frontend/
├── public/                     # Static assets
│   └── vite.svg               # Vite logo
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── Header.jsx          # Navigation header
│   │   ├── Footer.jsx          # Footer component
│   │   ├── Login.jsx           # Login form
│   │   ├── Register.jsx        # Registration form
│   │   ├── Dashboard.jsx       # User dashboard
│   │   ├── ElectionList.jsx    # Election listing
│   │   ├── ElectionDetail.jsx  # Election details
│   │   ├── VoteForm.jsx        # Voting interface
│   │   ├── Results.jsx         # Results display
│   │   └── ProtectedRoute.jsx  # Auth protection wrapper
│   ├── assets/                 # Images, icons, styles
│   │   └── react.svg
│   ├── App.jsx                 # Main app with routing
│   ├── App.css                 # Global styles
│   ├── index.css               # Base styles
│   └── main.jsx                # React entry point
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── package-lock.json           # Locked dependencies
├── vite.config.mjs             # Vite configuration
├── nginx.conf                  # Nginx configuration
├── Dockerfile                  # Docker configuration
├── .dockerignore               # Docker ignore rules
├── .gitignore                  # Git ignore rules
├── .oxlintrc.json              # Oxlint configuration
└── README.md                   # Frontend documentation (empty)
```

### Key Frontend Files

#### `main.jsx` - Entry Point
- React 18 createRoot
- BrowserRouter setup
- App component mounting

#### `App.jsx` - Main Application
- Route definitions
- Layout components
- Protected routes

#### `components/` - UI Components
- Authentication: Login, Register
- Dashboard: User dashboard with election access
- Elections: List, Detail, Voting form
- Results: Vote tally display
- Shared: Header, Footer, ProtectedRoute

## Docker Configuration

### `docker-compose.yml`
Orchestrates:
- Backend service (Node.js)
- Frontend service (Nginx + React build)
- MongoDB database
- Network configuration

## Development Workflow

### Backend Commands
```bash
cd backend
npm start          # Start development server
npm test           # Run test suite
npm run dev        # Start with nodemon (if configured)
```

### Frontend Commands
```bash
cd frontend
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
```

### Docker Commands
```bash
docker-compose up -d       # Start all services
docker-compose down        # Stop all services
docker-compose logs -f     # View logs
```

## ECC Integration

### Agents Configured
- **Architect**: `ecc:code-architect` - System design and file structure planning
- **Coder**: `general-purpose` - Node.js/React implementation
- **Debugger**: `ecc:build-error-resolver` - Build and type error fixing

### Memory System
- Location: `.claude/memory/`
- Files: project-context.md, progress.md, decisions.md
- Purpose: Continuous context across sessions

### Hooks
- Pre-commit: Code review via `ecc:code-review`
- Post-edit: Build fix via `ecc:build-fix`