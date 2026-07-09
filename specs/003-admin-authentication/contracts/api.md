# API Contracts: Admin Authentication

## POST /api/v1/auth/login

Public endpoint. Exchanges admin credentials for a JWT.

Request body:
{
  "email": "admin@takiaway.com",
  "password": "plaintext-password"
}

Success response - 200 OK:
{
  "access_token": "<jwt string>",
  "token_type": "bearer"
}

Error response - 401 Unauthorized (wrong email or password):
{
  "detail": "Invalid credentials"
}

Error response - 422 Unprocessable Entity (missing/malformed fields):
standard FastAPI/Pydantic validation error body.

## GET /api/v1/contact-messages

Protected endpoint. Requires header:
Authorization: Bearer <jwt string>

Success response - 200 OK:
[
  {
    "id": "uuid",
    "nombre": "Carmen Test",
    "email": "carmen@example.com",
    "mensaje": "Hola, quiero saber mas sobre TakiAway.",
    "fecha_creacion": "2026-07-08T14:02:22.483487"
  }
]

Ordered by fecha_creacion descending (most recent first).

Error response - 401 Unauthorized (missing, malformed, or expired token):
{
  "detail": "Could not validate credentials"
}
