# Project Overview

This is a full-stack web application with:

- Backend: Node.js + Express + Prisma + PostgreSQL + Redis
- Frontend: React + Tailwind (Vite)
- Database: PostgreSQL (via Docker)
- Cache: Redis (via Docker)

---

# Ports

- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5433
- Redis: localhost:6380

---

# Setup

1. Start infrastructure (Postgres + Redis):
   docker compose -f compose.dev.yaml up -d

2. Install backend dependencies:
   cd backend && npm install

3. Install frontend dependencies:
   cd frontend && npm install

4. Generate Prisma client
   cd backend && npx prisma generate

5. Run database migrations (development DB):
   cd backend && npm run db:migrate

---

# Development

## Backend
cd backend && npm run dev

## Frontend
cd frontend && npm run dev

---

# Testing

Run all backend tests:

cd backend && npm test # automatically resets and migrates test DB

---

# Database

## Reset development database
cd backend && npm run db:reset

## Open Prisma Studio
cd backend && npm run db:studio

---

# Test Database (important)

All tests run against a separate database using `.env.test`.

## Reset test database and run tests
cd backend && npm test

---

# Testing Guidelines (IMPORTANT)

---

## Backend

- Use **Jest + Supertest**
- Prefer **integration tests** (API + real Prisma database)
- Do NOT mock Prisma unless explicitly required
- Do NOT write unit tests for service logic — only API-level tests via Express
- Use `.env.test` database only
- Database is fully reset automatically before `npm test` using Prisma migrations
- Do NOT manually clean database in tests
- Each test assumes a fresh database state

### Backend Scope

Tests must focus on real user flows:

- authentication (signup, login, refresh, logout)
- CRUD operations
- permissions (ownership + access control)
- relationships (likes, follows, comments)

---

## Frontend

- Use **Vitest + React Testing Library**
- Use `jsdom` environment
- Use `@testing-library/user-event` for all interactions
- Use `@testing-library/jest-dom` for matchers
- Prefer **MSW (Mock Service Worker)** for API mocking when needed

### Frontend Scope

Tests must focus on user behavior:

- rendering UI correctly
- user interactions (click, type, navigation)
- conditional rendering based on state/data
- API-driven UI states (loading, error, success)

---

## Test Structure Rules

- Use `describe` per feature (auth, posts, UI components, etc.)
- Backend tests use **Supertest only**
- Frontend tests use **React Testing Library only**
- Use `afterAll` to disconnect Prisma (backend)
- Never start backend server manually (use Express app instance)
- Render components fresh per test (frontend)
- All tests must be **deterministic** (no randomness, timing dependency, or shared state)

---

## Test Quality Rules

Each test must assert:

- correct status codes (backend)
- correct UI rendering or response body (frontend/backend)

Every feature must include:

- happy path
- unauthorized access (401 where applicable)
- forbidden actions (403 where applicable)
- not found cases (404 where applicable)

Prefer:

- full backend flows (signup → login → action)
- user-centric frontend tests (not implementation details)

Avoid:

- testing Prisma directly (backend)
- testing React state directly (frontend)

---

## Testing Philosophy

- Test behavior, not implementation details
- Treat backend API as a black box
- Treat frontend as a user sees it
- Prefer real-world flows over isolated unit tests
- Tests must remain stable against internal refactors

# Notes

- Backend uses Prisma for database access
- Test environment uses isolated database (`snippet_test_db`)
- Docker is only used for PostgreSQL and Redis
- Node.js runs locally (not in Docker)