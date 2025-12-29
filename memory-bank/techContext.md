```
# Tech Context

## Architecture
- **Frontend**: React (Vite) Single Page Application (SPA).
  - Components: `Leaderboard`, `RecentTimes`, `ServerSelector`, `SearchBar`.
  - State Management: React Context or custom hooks for server selection (100t vs 128t).
- **Backend/API**:
  - `api/index.php`: Main entry point.
  - Accepts parameters: `endpoint` (e.g., `top`, `recent_records`), `server` (e.g., `100`, `128`).
  - Returns: JSON.

## Database Schema (Inferred from Sample)
- **Tables**:
  - `playertimes`: `map` (string), `style` (int), `time` (float), `auth` (string), `date` (int), `points` (float).
  - `users`: `auth` (string), `name` (string), `lastlogin` (int).
- **Multi-Database Strategy**:
  - The PHP API will select the database name based on the `server` parameter (e.g., `db_100t` vs `db_128t`) before executing queries.

## Development Setup
- **Frontend**: Node.js environment for building the React app.
- **API**: PHP scripts to serve JSON data.
- **Data Mocking**: During development, we will use mock JSON data to simulate the API response since we don't have live DB access.

## Constraints
- **Tick Rates**: 100t and 128t support.
- **Design**: Strict adherence to "premium" feel – no frameworks like Tailwind unless requested (user specified Vanilla CSS preference).
```
