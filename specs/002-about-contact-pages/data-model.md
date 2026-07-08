# Data Model: TakiAway About and Contact Pages

## Entities

### ContactMessage
Represents a message sent by a user via the contact form.

- **Fields**:
    - `id`: UUID (Primary Key, auto-generated)
    - `nombre`: String (Required, non-empty)
    - `email`: String (Required, valid email format)
    - `mensaje`: Text (Required, non-empty)
    - `fecha_creacion`: DateTime (Auto-generated timestamp)

- **Validation Rules**:
    - `nombre`: Must not be empty or whitespace only.
    - `email`: Must match standard email regex.
    - `mensaje`: Must not be empty or whitespace only.

- **Relationships**:
    - None. This is a standalone table.
