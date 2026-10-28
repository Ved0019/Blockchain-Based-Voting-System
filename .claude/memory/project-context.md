# Blockchain-Based-Voting-System - Project Context

## Project Overview
A blockchain-based voting system built with:
- **Backend**: Node.js/Express with Hedera SDK, MongoDB, JWT authentication
- **Frontend**: React/Vite with React Router

## Architecture

### Backend Structure
```
/backend
  /controllers    - Route handlers
  /models         - MongoDB models
  /lib            - Utility libraries (Hedera, crypto, etc.)
  /tests          - Test files
  server.js       - Main entry point
  package.json    - Dependencies
```

### Frontend Structure
```
/frontend
  /src
    /components   - React components
    /assets       - Static assets
    App.jsx       - Main app component
    main.jsx      - Entry point
  package.json    - Dependencies
  vite.config.mjs - Vite configuration
```

## Key Technologies
- **Hedera SDK**: Blockchain integration for vote recording
- **MongoDB**: Database for users, elections, votes
- **JWT**: Authentication and authorization
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server

## Development Commands
```bash
# Backend
cd backend && npm start        # Start server
cd backend && npm test         # Run tests

# Frontend
cd frontend && npm run dev     # Start dev server
cd frontend && npm run build   # Build for production
```

## ECC Configuration
- Architect: ecc:code-architect
- Coder: general-purpose
- Debugger: ecc:build-error-resolver
- Memory: Enabled (.claude/memory)