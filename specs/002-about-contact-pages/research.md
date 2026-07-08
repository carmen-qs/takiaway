# Research: TakiAway About and Contact Pages

## Resolved Unknowns

### Testing Framework Selection
- **Decision**: Use `pytest` with `httpx` for FastAPI backend tests and `Vitest` with `React Testing Library` for frontend component tests.
- **Rationale**: These are the industry standard for the chosen stack (FastAPI/React). Since the `/tests` directory was empty, we have the flexibility to establish these as the project's testing standards.
- **Alternatives considered**: `unittest` (too verbose), `Jest` (Vitest is faster and more native to Vite).

### Contact Form Implementation Pattern
- **Decision**: Use a controlled component pattern with a simple state object for the form in React.
- **Rationale**: Sufficient for a small contact form; avoids adding heavy libraries like `formik` or `react-hook-form` to the MVP, keeping the bundle size small.
- **Alternatives considered**: `react-hook-form` (overkill for 3 fields).

### Backend Persistence Pattern
- **Decision**: Implement a `ContactService` class to handle DB operations, following the existing `ArtistService` pattern.
- **Rationale**: Maintains architectural consistency across the backend.
- **Alternatives considered**: Direct DB calls in the API router (violates separation of concerns).

## Best Practices & Patterns

### Form Validation
- **Frontend**: Implement immediate visual feedback using a regex for email and non-empty checks for name/message.
- **Backend**: Use Pydantic models for automatic request body validation (returns 422 Unprocessable Entity on failure).

### Database Schema
- **Decision**: Use `UUID` for the primary key of `contact_messages` to ensure global uniqueness and avoid predictable IDs.
- **Rationale**: Aligns with the existing `Artist` and `Video` models.

### Visual Identity
- **Decision**: Reuse existing CSS classes and Tailwind colors for consistency. Use the "Permanent Marker" font specifically for `<h1>` and `<h2>` tags on new pages.
