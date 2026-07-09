# Research: Admin Authentication

## Decision: JWT vs session cookies

Chosen: JWT (stateless bearer token).

Rationale: the existing stack has no session store (no Redis, no
server-side session middleware configured), and the frontend/backend are
deployed on separate origins (Vercel + Render), which makes cookie-based
sessions more complex to configure correctly (SameSite, credentials on
CORS). A bearer JWT sent via Authorization header sidesteps cross-origin
cookie complications entirely, consistent with how contactService.ts and
artistService already call the API with axios.

Alternatives considered: Flask-Login style server sessions -- rejected,
adds a stateful dependency (session store) for a single-admin use case
that doesn't need it.

## Decision: passlib + python-jose

Rationale: both are the de-facto standard libraries for password hashing
and JWT handling in the FastAPI ecosystem; well documented, actively
maintained, no reason to hand-roll either.

## Decision: single admin row, no registration endpoint

Rationale: spec explicitly scopes this to one admin (the site owner). A
public registration endpoint would be unnecessary attack surface for a
feature that only ever needs one account.
