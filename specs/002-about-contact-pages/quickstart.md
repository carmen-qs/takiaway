# Quickstart Validation Guide: TakiAway About and Contact Pages

## Validation Scenarios

### 1. Navigation and Static Content
**Goal**: Verify that the "Nosotros" page is accessible and visually correct.

- **Steps**:
    1. Launch the application.
    2. Locate the "Nosotros" link in the Header.
    3. Click the link.
- **Expected Outcome**: 
    - URL changes to `/about`.
    - Page displays the TakiAway purpose statement.
    - Visual identity (dark theme, Permanent Marker font) is preserved.

### 2. Contact Form - Successful Submission
**Goal**: Verify the end-to-end flow from frontend form to database persistence.

- **Steps**:
    1. Navigate to `/contact`.
    2. Fill the form with valid data:
        - Name: "Test User"
        - Email: "test@example.com"
        - Message: "This is a test message."
    3. Submit the form.
- **Expected Outcome**:
    - Frontend displays a visual success message.
    - A new record appears in the `contact_messages` table in PostgreSQL with the provided data and a current timestamp.

### 3. Contact Form - Client-side Validation
**Goal**: Ensure invalid data is caught before reaching the server.

- **Steps**:
    1. Navigate to `/contact`.
    2. Leave the "Nombre" field empty.
    3. Enter an invalid email (e.g., "test@invalid").
    4. Attempt to submit.
- **Expected Outcome**:
    - Form is not submitted.
    - Visual alerts indicate errors in the Name and Email fields.

### 4. Contact Form - Server-side Validation
**Goal**: Ensure the API rejects invalid data that bypasses the frontend.

- **Steps**:
    1. Send a POST request to `/api/v1/contact-messages` using a tool like `curl` or Postman with an empty `mensaje` field.
- **Expected Outcome**:
    - Server responds with `422 Unprocessable Entity`.
    - Response body contains the validation error detail.

## Prerequisites
- Application running via `docker compose up`.
- Access to PostgreSQL database via `psql` or a database GUI to verify record insertion.
