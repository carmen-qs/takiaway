# Feature Specification: Admin Authentication

**Feature Branch**: `003-admin-authentication`
**Created**: 2026-07-09
**Status**: Draft
**Input**: Provide a secure admin-only login so the site owner can view contact
messages submitted through the public Contact form, without exposing this
data to public visitors.

## User Scenarios & Testing

### User Story 1 - Admin Login (Priority: P1) 🎯 MVP

As the site administrator, I want to log in with an email and password so
that I can access a protected area of the site not visible to the public.

**Independent Test**: Navigating to `/admin/login`, entering valid admin
credentials, and submitting redirects to `/admin/messages`. Entering invalid
credentials shows an error and does not grant access.

**Acceptance Scenarios**:
1. **Given** the login form is empty, **When** the admin submits, **Then**
   validation errors appear for required fields.
2. **Given** valid credentials, **When** the admin submits, **Then** the
   backend returns a JWT, the frontend stores it, and the admin is redirected
   to `/admin/messages`.
3. **Given** invalid credentials, **When** the admin submits, **Then** the
   backend responds `401 Unauthorized` and the frontend shows an error
   message without redirecting.

### User Story 2 - View Contact Messages (Priority: P1) 🎯 MVP

As the logged-in admin, I want to see every message submitted through the
public Contact form so that I can follow up with interested people.

**Independent Test**: While authenticated, visiting `/admin/messages` shows
a list of all contact messages (name, email, message, date), most recent
first. Visiting the same route without a valid token redirects to
`/admin/login`.

**Acceptance Scenarios**:
1. **Given** a valid session, **When** the admin opens `/admin/messages`,
   **Then** all persisted contact messages are listed.
2. **Given** no token or an expired/invalid token, **When** the admin (or
   anyone) requests `/admin/messages` or the underlying API, **Then** access
   is denied and the frontend redirects to `/admin/login`.

### User Story 3 - Session Expiry (Priority: P2)

As the admin, I want my session to expire after a period of inactivity so
that a forgotten open tab doesn't leave the panel exposed indefinitely.

**Acceptance Scenarios**:
1. **Given** a JWT older than its configured expiration, **When** any
   protected request is made, **Then** the backend rejects it with `401` and
   the frontend clears the stored token and redirects to login.

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a single admin account, provisioned via a
  backend seed script reading `ADMIN_EMAIL` / `ADMIN_PASSWORD` from
  environment variables; no public self-registration.
- **FR-002**: Passwords MUST be stored hashed (bcrypt), never in plain text.
- **FR-003**: System MUST expose `POST /api/v1/auth/login` accepting email +
  password, returning a signed JWT on success.
- **FR-004**: System MUST expose `GET /api/v1/contact-messages`, restricted
  to requests bearing a valid, unexpired JWT for the admin account.
- **FR-005**: JWTs MUST have a defined expiration (e.g., 2 hours).
- **FR-006**: Frontend MUST provide `/admin/login` (public) and
  `/admin/messages` (protected) routes.
- **FR-007**: Frontend MUST redirect unauthenticated or expired-session
  visitors away from `/admin/messages` to `/admin/login`.
- **FR-008**: Frontend MUST NOT expose any admin-only navigation link in the
  public-facing Header (no discoverability from the public site).

### Non-Functional Requirements

- **NFR-001**: The public Contact form and its existing tests/behavior MUST
  remain unaffected by this feature.
- **NFR-002**: No plaintext secrets committed to the repo; admin credentials
  only via environment variables (local `.env`, Render environment config in
  production).

## Out of Scope

- Artist self-service accounts/login.
- Password reset / "forgot password" flow.
- Multi-admin support or role management beyond a single admin.
- Editing or deleting contact messages from the admin panel (view-only for
  this iteration).
