# Plan: Contact Message Management

## Approach

Extend the existing `ContactMessage` model with a `tipo` column
(non-nullable string, validated against a fixed set of values at the
Pydantic layer). Add a `DELETE` endpoint mirroring the existing `GET`
endpoint's admin protection. Update the frontend contact form to collect
`tipo`, and the admin panel to display it and offer a delete action.

## Backend Changes

- `src/models/contact_message.py`: add `tipo` column (`String`, not null).
- `src/schemas/contact.py`: add `tipo` to `ContactMessageCreate` (with
  `Literal` type for validation) and `ContactMessageOut`.
- `src/services/contact_service.py`: accept `tipo` in
  `create_contact_message`; add `delete_contact_message(db, message_id)`.
- `src/api/contact.py`: pass `tipo` through on create; add
  `DELETE /contact-messages/{id}` protected by `get_current_admin`.
- DB: existing rows won't have `tipo`. Since this project uses
  `Base.metadata.create_all()` via `seed.py` rather than migrations, the
  column will be added on the next full reseed. Document this in tasks.

## Frontend Changes

- `src/services/contactService.ts`: add `tipo` to `ContactPayload`.
- `src/pages/Contact.tsx`: add a `<select>` for "Tipo de mensaje"
  (required, no default blank option to avoid an extra validation state).
- `src/services/adminService.ts`: add `tipo` to `ContactMessageOut`; add
  `deleteContactMessage(token, id)`.
- `src/pages/admin/AdminMessages.tsx`: show `tipo` as a badge per message;
  add a delete button with a confirm step; remove the message from local
  state on success instead of refetching.

## Testing Strategy

- Backend: contract tests for `POST` with each valid `tipo` value and one
  invalid value (422); contract test for `DELETE` (success, 404, 401).
- Frontend: component test for `Contact.tsx` covering the new field;
  component test for `AdminMessages.tsx` covering delete flow (button →
  confirm → message removed from the list) and `adminService.test.ts`
  for the new `deleteContactMessage` call.

## Risks

- Existing seeded/local databases won't have the `tipo` column until
  reseeded — same class of issue as the earlier `foto_url` addition.
  Mitigation: re-run `seed.py` locally and re-run the seed step (or a
  fresh `create_all`) in production after deploying this change.
