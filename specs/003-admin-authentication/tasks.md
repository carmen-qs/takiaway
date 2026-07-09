# Tasks: Admin Authentication

Input: Design documents from specs/003-admin-authentication/
Prerequisites: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

## Phase 1: Setup

- [x] T001 [P] Add passlib[bcrypt] and python-jose[cryptography] to backend/requirements.txt
- [x] T002 [P] Add JWT_SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD, ACCESS_TOKEN_EXPIRE_MINUTES placeholders to backend/.env (local, gitignored)

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 Create AdminUser model in backend/src/models/admin_user.py
- [x] T004 Register AdminUser in backend/src/models/__init__.py
- [x] T005 Implement password hashing and JWT helpers in backend/src/services/auth_service.py (verify_password, get_password_hash, create_access_token, decode_token)
- [x] T006 Implement get_current_admin FastAPI dependency in backend/src/core/security.py
- [x] T007 Create idempotent seed script backend/seed_admin.py reading ADMIN_EMAIL/ADMIN_PASSWORD

Checkpoint: foundation ready for US1 and US2.

## Phase 3: User Story 1 - Admin Login (Priority: P1) MVP

### Tests for User Story 1

- [x] T008 [P] [US1] Contract test POST /api/v1/auth/login (valid credentials, invalid password, invalid email, missing fields) in backend/tests/contract/test_auth_api.py

### Implementation for User Story 1

- [x] T009 [P] [US1] Create LoginRequest and TokenResponse schemas in backend/src/schemas/auth.py
- [x] T010 [US1] Implement POST /api/v1/auth/login in backend/src/api/auth.py (depends on T009, T005)
- [x] T011 [US1] Register auth router in backend/main.py
- [x] T012 [P] [US1] Create authService.ts (login function) in frontend/src/services/authService.ts
- [x] T013 [P] [US1] Create AuthContext.tsx (token state, login, logout, isAuthenticated) in frontend/src/context/AuthContext.tsx
- [x] T014 [US1] Implement AdminLogin page in frontend/src/pages/admin/AdminLogin.tsx (depends on T012, T013)
- [x] T015 [P] [US1] Component test in frontend/src/pages/admin/AdminLogin.test.tsx
- [x] T016 [US1] Add /admin/login route in frontend/src/App.tsx, wrap app in AuthProvider

Checkpoint: admin can log in and receive/store a token.

## Phase 4: User Story 2 - View Contact Messages (Priority: P1) MVP

### Tests for User Story 2

- [ ] T017 [P] [US2] Contract test GET /api/v1/contact-messages with valid token, missing token, malformed token in backend/tests/contract/test_auth_api.py (extend)

### Implementation for User Story 2

- [ ] T018 [US2] Add GET /api/v1/contact-messages endpoint in backend/src/api/contact.py, protected via get_current_admin (depends on T006)
- [ ] T019 [P] [US2] Add getContactMessages function in frontend/src/services/authService.ts or a new adminService.ts
- [ ] T020 [P] [US2] Create ProtectedRoute component in frontend/src/components/ProtectedRoute.tsx
- [ ] T021 [US2] Implement AdminMessages page in frontend/src/pages/admin/AdminMessages.tsx (list, most recent first) (depends on T019)
- [ ] T022 [P] [US2] Component test in frontend/src/pages/admin/AdminMessages.test.tsx (renders list, redirects when unauthenticated)
- [ ] T023 [US2] Add /admin/messages route wrapped in ProtectedRoute in frontend/src/App.tsx (depends on T020, T021)

Checkpoint: admin can log in and view all contact messages; route is protected.

## Phase 5: User Story 3 - Session Expiry (Priority: P2)

- [ ] T024 [P] [US3] Contract test: expired JWT returns 401 in backend/tests/contract/test_auth_api.py (extend)
- [ ] T025 [US3] Axios response interceptor in frontend/src/services (or a shared axios instance) that clears the stored token and redirects to /admin/login on any 401
- [ ] T026 [P] [US3] Component/integration test verifying expired-token redirect behavior

Checkpoint: expired or invalid sessions are handled gracefully end to end.

## Phase N: Polish

- [ ] T027 [P] Run quickstart.md validation scenarios end-to-end (local)
- [ ] T028 [P] Add JWT_SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD to Render environment (production) and run seed_admin.py once via Render shell
- [ ] T029 [P] Confirm no admin links appear in the public Header (FR-008)
- [ ] T030 [P] Code cleanup and documentation updates

## Dependencies & Execution Order

- Setup (Phase 1) has no dependencies.
- Foundational (Phase 2) depends on Setup.
- US1 (Phase 3) and US2 (Phase 4) depend on Foundational; US2's protected
  endpoint also depends on get_current_admin from Phase 2.
- US3 (Phase 5) depends on US1 (needs a working login/token flow to test
  expiration against).
- Polish (Phase N) depends on all user stories being complete.

## Implementation Strategy

1. Complete Setup + Foundational.
2. Complete US1 (login) end to end, verify with quickstart scenarios 1-2.
3. Complete US2 (view messages) end to end, verify with quickstart scenario 3-4.
4. Complete US3 (session expiry), verify with quickstart scenario 5.
5. Polish: production env vars, seed on Render, final quickstart pass.
