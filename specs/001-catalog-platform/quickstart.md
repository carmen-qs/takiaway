# Quickstart Guide: TakiAway Catalog Platform

## Prerequisites

- Docker
- Docker Compose

## Setup & Running

1. **Start the application**:
   ```bash
   docker compose up --build
   ```

2. **Access the application**:
   - Frontend: `http://localhost:5173` (default Vite port)
   - Backend API: `http://localhost:8000`

## Validation Scenarios

1. **Browse Catalog**:
   - Open frontend in browser.
   - Verify artist cards are displayed with correct information (Name, Origin, Genre).

2. **Filter Catalog**:
   - Select a genre from the filter menu.
   - Verify that the card list updates to show only matching artists.

3. **View Detail & Play Video**:
   - Click on an artist card.
   - Verify that the profile page loads correctly with biography, milestone, and video.
   - Verify that the YouTube video plays directly in the embedded player.
