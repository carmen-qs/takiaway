# Quickstart Validation Guide: Admin Authentication

## Prerequisites

- Application running via docker compose up.
- Backend env vars set: ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET_KEY.
- Seed script run once: docker compose exec backend python seed_admin.py

## Validation Scenarios

### 1. Successful Login

Steps:
1. Navigate to /admin/login.
2. Enter the ADMIN_EMAIL / ADMIN_PASSWORD configured in the environment.
3. Submit.

Expected: redirected to /admin/messages, message list loads.

### 2. Invalid Login

Steps:
1. Navigate to /admin/login.
2. Enter a wrong password.
3. Submit.

Expected: error message shown, no redirect, no token stored.

### 3. Protected Route Without Session

Steps:
1. Without logging in (or after clearing sessionStorage), navigate directly
   to /admin/messages.

Expected: immediately redirected to /admin/login.

### 4. Direct API Access Without Token

Steps:
1. curl -i https://\<backend-url\>/api/v1/contact-messages (no Authorization
   header).

Expected: 401 Unauthorized.

### 5. Token Expiration

Steps:
1. Log in successfully.
2. Manually edit the stored token in sessionStorage to an expired/invalid
   value (or wait past the configured expiration for a slower manual test).
3. Refresh /admin/messages.

Expected: redirected to /admin/login, expired token cleared from storage.

### 6. Seed Idempotency

Steps:
1. Run docker compose exec backend python seed_admin.py twice in a row.

Expected: second run does not create a duplicate row or error; confirms
via a printed message that the admin already exists.
