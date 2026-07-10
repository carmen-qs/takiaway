# Spec: Contact Message Management

**Feature ID**: 004-contact-message-management
**Status**: Draft

## Problem Statement

Currently, contact messages sent through `/contact` are stored without any
categorization, and administrators have no way to remove messages from the
inbox once they've been read or handled. As the volume of messages grows,
the admin panel becomes harder to scan and impossible to clean up.

## Goals

1. Let the person submitting a contact message classify it by type
   (sugerencia, reclamo, consulta, otro), visible only to admins.
2. Let admins delete a contact message from the panel.

## Non-Goals

- Editing/replying to messages from the panel (out of scope for this spec).
- Soft-delete / audit trail of deleted messages (hard delete is acceptable
  for this project's scope).

## User Stories

### US1 — Classify message by type (P1)
As a visitor filling out the contact form, I want to indicate what kind of
message I'm sending (suggestion, complaint, inquiry, other), so the admin
can triage messages faster.

**Acceptance criteria**:
- The contact form includes a required "Tipo de mensaje" selector with
  options: Sugerencia, Reclamo, Consulta, Otro.
- The selected type is persisted with the message.
- The type is visible in the admin panel as a badge, but not shown
  anywhere on the public-facing side after submission.

### US2 — Delete a contact message (P1)
As an admin, I want to delete a contact message from the panel, so I can
keep the inbox clean of messages I've already handled.

**Acceptance criteria**:
- Each message in the admin panel has a delete action.
- Deleting requires confirmation (avoid accidental clicks).
- Only authenticated admins can delete (same protection as viewing
  messages).
- After deletion, the message list updates without a full page reload.

## API Contract

### `POST /api/v1/contact-messages` (existing, updated)
Request body adds required field:
```json
{ "nombre": "...", "email": "...", "mensaje": "...", "tipo": "sugerencia" }
```
`tipo` must be one of: `sugerencia`, `reclamo`, `consulta`, `otro`.
Invalid/missing value → `422 Unprocessable Entity`.

### `GET /api/v1/contact-messages` (existing, updated)
Response items now include `tipo`.

### `DELETE /api/v1/contact-messages/{id}` (new)
- Requires admin bearer token (same as GET).
- `204 No Content` on success.
- `404 Not Found` if the message doesn't exist.
- `401/403` if not authenticated as admin.
