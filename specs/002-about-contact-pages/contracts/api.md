# API Contract: Contact Messages

## Endpoint: POST /api/v1/contact-messages

**Description**: Persists a contact message sent from the frontend form.

### Request

- **Content-Type**: `application/json`
- **Body**:
```json
{
  "nombre": "string",
  "email": "string",
  "mensaje": "string"
}
```

### Validation

- `nombre`: Required, non-empty string.
- `email`: Required, valid email format.
- `mensaje`: Required, non-empty string.

### Responses

#### 201 Created
- **Description**: Message successfully persisted.
- **Body**:
```json
{
  "status": "success",
  "message": "Mensaje enviado exitosamente"
}
```

#### 422 Unprocessable Entity
- **Description**: Validation failure (e.g., empty field or invalid email).
- **Body**:
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

#### 500 Internal Server Error
- **Description**: Database or server failure.
- **Body**:
```json
{
  "detail": "A database error occurred while processing your request."
}
```
