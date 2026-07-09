# Implementation Plan: Admin Authentication

**Branch**: `003-admin-authentication` | **Spec**: `spec.md`

## Technical Context

**Backend**: FastAPI (existing), SQLAlchemy async + PostgreSQL (existing)
**Frontend**: React + TypeScript + Vite (existing), axios (existing)
**New backend dependencies**: passlib[bcrypt] (password hashing), python-jose[cryptography] (JWT signing/verification)
**New frontend dependencies**: none required (React Context + axios interceptor is enough)

## Architecture Overview

### JWT flow (explained, since this is new territory)

1. Admin submits email + password to POST /api/v1/auth/login.
2. Backend looks up the admin row by email, verifies the password against the stored bcrypt hash.
3. If valid, backend creates a JWT: a signed string with three parts (header, payload, signature). The payload carries the admin's email and an expiration timestamp (exp). The signature is created with a secret key (JWT_SECRET_KEY, env var) -- anyone can read the payload, but only the backend (who knows the secret) can produce a valid signature or verify one isn't tampered with.
4. Frontend receives the JWT and stores it (React state + sessionStorage as a fallback so a page refresh doesn't immediately log the admin out).
5. On every request to a protected endpoint, the frontend sends the JWT in the Authorization: Bearer <token> header.
6. Backend uses a FastAPI dependency (get_current_admin) that decodes the token with the same secret, checks exp hasn't passed, and rejects with 401 if anything is invalid -- this dependency is attached to GET /api/v1/contact-messages.

### Data Model

New table admin_users, columns: id (UUID, primary key), email (String, unique), hashed_password (String, bcrypt hash), created_at (DateTime).

Only one row will ever exist in this MVP, created by a seed script.

### Backend file structure (new/modified)

backend/src/models/admin_user.py - AdminUser model (new)
backend/src/schemas/auth.py - LoginRequest, TokenResponse (new)
backend/src/services/auth_service.py - verify_password, create_access_token, decode_token (new)
backend/src/api/auth.py - POST /api/v1/auth/login (new)
backend/src/api/contact.py - add GET /api/v1/contact-messages, protected (modified)
backend/src/core/security.py - get_current_admin dependency (new)
backend/seed_admin.py - idempotent seed script reading ADMIN_EMAIL/ADMIN_PASSWORD (new)

### Frontend file structure (new/modified)

frontend/src/context/AuthContext.tsx - holds token, login(), logout(), isAuthenticated (new)
frontend/src/services/authService.ts - login(email, password) returns token (new)
frontend/src/components/ProtectedRoute.tsx - wraps admin routes, redirects if not authenticated (new)
frontend/src/pages/admin/AdminLogin.tsx - login form (new)
frontend/src/pages/admin/AdminMessages.tsx - protected messages list (new)
frontend/src/App.tsx - add /admin/login, /admin/messages routes (modified)

## Security Decisions

- Secret storage: JWT_SECRET_KEY and ADMIN_EMAIL/ADMIN_PASSWORD are environment variables only, never committed. Locally via .env (gitignored), in production via Render's Environment tab, same pattern already used for CORS_ORIGINS.
- Token expiration: 2 hours (ACCESS_TOKEN_EXPIRE_MINUTES=120), configurable via env var.
- Token storage on frontend: sessionStorage (cleared when the browser tab closes) rather than localStorage, to reduce the window an admin session stays valid on a shared machine.
- No new public surface: the admin routes are not linked from the public Header nav (FR-008), reducing accidental discovery, though this is not a substitute for the auth check itself.

## Testing Strategy

- Backend contract tests: login with valid/invalid credentials; GET /api/v1/contact-messages with valid token, missing token, expired token, and malformed token.
- Backend integration test: seed script creates the admin exactly once even if run twice.
- Frontend component tests: AdminLogin shows validation and error states; ProtectedRoute redirects to /admin/login when no token is present.

## Complexity Tracking

No deviations from the existing stack's conventions; this reuses the same FastAPI + SQLAlchemy + React + axios patterns already established in 002-about-contact-pages.
