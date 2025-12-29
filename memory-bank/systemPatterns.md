# System Patterns

## Architecture
- **Frontend**: Modern Web Application (likely Vite + React or Vanilla JS) for dynamic interactivity (SPA feel).
- **Backend/Data Layer**: Interface to the MySQL database containing `bhoptimer` data.
  - If using React, we may need a lightweight API (PHP or Node) to fetch data from the MySQL DB and serve it as JSON.
  - The sample project uses direct PHP-to-HTML rendering. We might modernize this by decoupling the data fetching.

## Database Schema (Inferred from Sample)
- **Tables**:
  - `playertimes` (Stores map times): `map`, `style`, `time`, `jumps`, `strafes`, `sync`, `auth` (steamid), `date`, `points`, `track`.
  - `users` (Stores player info): `auth`, `name`, `lastlogin`, `points`.
  - `stylepoints`: `auth`, `style`, `points`.

## Key Logic
- **Time Formatting**: Conversion of float seconds to `MM:SS.ms`.
- **SteamID Handling**: Parsing and formatting Steam IDs (Steam2, Steam3, Steam64).
- **Filtering**:
  - By Track (Main, Bonus, etc.)
  - By Style (Normal, Sideways, etc.)
  - By User (`u`)
  - By Map (`m`)
