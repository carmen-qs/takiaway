# Tasks: Contact Message Management

## Phase 1: Backend

- [x] T001 Add `tipo` column to `ContactMessage` model in `backend/src/models/contact_message.py`
- [x] T002 Add `tipo` (Literal validation) to `ContactMessageCreate` and `ContactMessageOut` in `backend/src/schemas/contact.py`
- [x] T003 Update `create_contact_message` to accept `tipo`; add `delete_contact_message` in `backend/src/services/contact_service.py`
- [x] T004 Update `POST /contact-messages` to pass `tipo`; add `DELETE /contact-messages/{id}` in `backend/src/api/contact.py`
- [x] T005 [P] Contract tests for `tipo` validation (valid/invalid) and DELETE (success/404/401) in `backend/tests/contract/test_contact_api.py`

## Phase 2: Frontend

- [x] T006 [P] Add `tipo` to `ContactPayload` in `frontend/src/services/contactService.ts`
- [x] T007 Add "Tipo de mensaje" selector to `frontend/src/pages/Contact.tsx`
- [x] T008 [P] Add `tipo` to `ContactMessageOut`, add `deleteContactMessage` in `frontend/src/services/adminService.ts`
- [x] T009 Show `tipo` badge and delete action (with confirm) in `frontend/src/pages/admin/AdminMessages.tsx`
- [x] T010 [P] Update/add tests: `Contact.test.tsx`, `AdminMessages.test.tsx`, `adminService.test.ts`

## Phase 3: Data & Validation

- [x] T011 Re-run `seed.py` locally to pick up the new `tipo` column
- [x] T012 Re-run seed/table creation against production DB after deploying
- [x] T013 Manual end-to-end check: submit each `tipo` value, delete a message from the panel, confirm list updates without reload
