# Tasks: TakiAway About and Contact Pages

**Input**: Design documents from `/specs/002-about-contact-pages/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Tests are included as requested by the implementation plan (Pytest for backend, Vitest/RTL for frontend) to ensure the robustness of the contact form and API.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Create directory for new pages in `frontend/src/pages/`
- [x] T002 [P] Create directory for new backend services in `backend/src/services/`
- [x] T003 [P] Setup `Vitest` and `React Testing Library` in the frontend project

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T004 Create `ContactMessage` model in `backend/src/models/contact_message.py` (follows `Artist` model pattern)
- [x] T005 Implement `ContactService` for database persistence in `backend/src/services/contact_service.py` (depends on T004)
- [x] T006 Setup `pytest` and `httpx` for backend testing in `backend/tests/`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - About Page Navigation and Viewing (Priority: P1) 🎯 MVP

**Goal**: Provide a static "Nosotros" page explaining TakiAway's purpose and update the navigation menu.

**Independent Test**: Clicking "Nosotros" in the header opens `/about` and displays the purpose statement with correct visual identity.

### Tests for User Story 1

- [x] T007 [P] [US1] Create unit test for `About` page rendering in `frontend/src/pages/About.test.tsx`

### Implementation for User Story 1

- [x] T008 [P] [US1] Implement `About` page component in `frontend/src/pages/About.tsx` (static content, Permanent Marker font for titles)
- [x] T009 [US1] Update `Header` navigation links to replace "Música" with "Nosotros" (route `/about`) in `frontend/src/components/Header.tsx`
- [x] T010 [US1] Configure new route `/about` in `frontend/src/App.tsx`

**Checkpoint**: User Story 1 is fully functional and testable independently

---

## Phase 4: User Story 2 - Contact Information and Form Submission (Priority: P1) 🎯 MVP

**Goal**: Provide a "Contacto" page with a functional form that persists messages to the database.

**Independent Test**: Filling the contact form with valid data submits successfully and stores the message in PostgreSQL; invalid data is caught by client and server validation.

### Tests for User Story 2

- [x] T011 [P] [US2] Create contract test for `POST /api/v1/contact-messages` in `backend/tests/contract/test_contact_api.py`
- [x] T012 [P] [US2] Create integration test for contact form submission in `backend/tests/integration/test_contact_flow.py`
- [x] T013 [P] [US2] Create component tests for form validation in `frontend/src/pages/Contact.test.tsx`

### Implementation for User Story 2

- [x] T014 [P] [US2] Create Pydantic request model for contact messages in `backend/src/schemas/contact.py`
- [x] T015 [US2] Implement `POST /api/v1/contact-messages` endpoint in `backend/src/api/contact.py` (depends on T014, T005)
- [x] T016 [US2] Register contact API router in `backend/main.py`
- [x] T017 [P] [US2] Create API client service for contact messages in `frontend/src/services/contactService.ts`
- [x] T018 [P] [US2] Implement `Contact` page component with form and social links in `frontend/src/pages/Contact.tsx` (controlled component pattern)
- [x] T019 [US2] Implement client-side validation and success/error feedback in `frontend/src/pages/Contact.tsx` (depends on T018)
- [x] T020 [US2] Configure new route `/contact` in `frontend/src/App.tsx`

**Checkpoint**: User Story 2 is fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements and global verification

- [x] T021 [P] Run `quickstart.md` validation scenarios end-to-end
- [x] T022 [P] Final CSS audit to ensure consistency with TakiAway's visual identity across both new pages
- [x] T023 [P] Code cleanup and documentation updates

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3 & 4)**: Depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Independent.
- **User Story 2 (P1)**: Independent (though functionally depends on the Foundational DB work).

### Within Each User Story

- Tests must be defined and fail before implementation.
- Backend models/services before endpoints.
- API contracts before frontend integration.
- Form implementation before validation logic.

### Parallel Opportunities

- All Setup tasks (T001-T003) can run in parallel.
- Backend setup (T004-T006) and Frontend setup (T001-T003) can run in parallel.
- Once Phase 2 is done, US1 (T007-T010) and US2 (T011-T020) can be developed in parallel.
- Within US2, the API schema (T014) and the Page UI (T018) can be developed in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Nosotros)
4. Complete Phase 4: User Story 2 (Contacto)
5. **VALIDATE**: Run `quickstart.md` scenarios.

### Incremental Delivery

1. Setup + Foundational $
ightarrow$ Foundation ready.
2. User Story 1 $
ightarrow$ Test $
ightarrow$ Deploy.
3. User Story 2 $
ightarrow$ Test $
ightarrow$ Deploy.
