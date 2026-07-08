# Tasks: TakiAway Catalog Platform

**Input**: Design documents from `/specs/001-catalog-platform/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan
- [x] T002 Initialize FastAPI backend and React frontend with Vite
- [x] T003 [P] Configure Docker Compose for db, backend, frontend, including PostgreSQL volume

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Setup PostgreSQL database with SQLAlchemy (async)
- [x] T005 Setup environment configuration management (e.g., .env)
- [x] T006 Setup backend API routing structure and CORS middleware
- [x] T007 Create base Artist and Video entities in backend/src/models/
- [x] T008 Implement seed script to populate database with curated artist data

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse Artist Catalog (Priority: P1) 🎯 MVP

**Goal**: Display artist catalog as responsive cards

**Independent Test**: Verify frontend displays artist cards with correct info (Name, Origin, Genre).

### Implementation for User Story 1

- [x] T009 [P] [US1] Create Artist Read Service in backend/src/services/artist_service.py
- [x] T010 [US1] Implement GET /api/v1/artists endpoint in backend/src/api/artists.py
- [x] T011 [P] [US1] Setup React frontend with Tailwind CSS
- [x] T012 [P] [US1] Create ArtistCard component in frontend/src/components/ArtistCard.tsx
- [x] T013 [P] [US1] Implement catalog page with API integration in frontend/src/pages/Catalog.tsx

**Checkpoint**: Catalog view is functional and testable independently.

---

## Phase 4: User Story 2 - Filter Artist Catalog (Priority: P2)

**Goal**: Enable genre-based filtering

**Independent Test**: Apply filter and verify catalog list updates correctly.

### Implementation for User Story 2

- [x] T014 [US2] Update GET /api/v1/artists to support genre filter in backend/src/api/artists.py
- [x] T015 [US2] Implement GenreFilter component in frontend/src/components/GenreFilter.tsx
- [x] T016 [US2] Update catalog page to use filter in frontend/src/pages/Catalog.tsx

**Checkpoint**: Filtering is functional.

---

## Phase 5: User Story 3 - View Artist Profile & Watch Videos (Priority: P2)

**Goal**: Artist detail view with embedded YouTube videos

**Independent Test**: Click card, verify detail page load with bio, milestone, and playable YouTube video.

### Implementation for User Story 3

- [x] T017 [US3] Implement GET /api/v1/artists/{id} endpoint in backend/src/api/artists.py
- [x] T018 [P] [US3] Create ArtistDetail page in frontend/src/pages/ArtistDetail.tsx
- [x] T019 [P] [US3] Create VideoPlayer component (using iframes) in frontend/src/components/VideoPlayer.tsx
- [x] T020 [US3] Integrate artist profile display and VideoPlayer in frontend/src/pages/ArtistDetail.tsx

**Checkpoint**: Detail view and video playback functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T021 [P] Implement responsive design adjustments for mobile/desktop
- [x] T022 [P] Configure basic error handling and logging
- [x] T023 [P] Final test run and validation per quickstart.md
