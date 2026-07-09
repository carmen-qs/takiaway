# Data Model: Admin Authentication

## AdminUser

Table: admin_users

| Field | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | primary key, default uuid4 | |
| email | String | unique, not null | login identifier, lowercase |
| hashed_password | String | not null | bcrypt hash via passlib |
| created_at | DateTime | default utcnow | |

Relationships: none. This table is intentionally isolated from the
existing Artist/ContactMessage models -- admin auth is a cross-cutting
concern, not part of the public content domain.

## JWT Payload Shape

Not a database table, but documented here since it is the other half of
the "data model" for this feature:

{
  "sub": "<admin email>",
  "exp": <unix timestamp>
}

- sub identifies the token owner (subject).
- exp is enforced by python-jose on decode; expired tokens raise an
  exception that the get_current_admin dependency turns into a 401.

## Validation Rules

- Email: valid email format (reuse Pydantic EmailStr, same as ContactMessage
  schema).
- Password (at seed time only, not user-facing registration): minimum 8
  characters, enforced by the seed script before hashing.
