# Active Context

## Current Focus
Initialization phase. analyzing the existing `bhoptimer-webstats-main` sample project to understand the database schema and query logic. Setting up the project structure and determining the technology stack details.

## Recent Changes
- Initialized Memory Bank.
- Analyzed `index.php`, `config.php`, `r.php`, and `t.php` of the sample project.

## Open Questions
- **Technology Stack**: Confirming preference for a modern frontend (e.g., React/Vite) vs. traditional PHP.
- **Data Source**: How are 100t and 128t servers distinguished in the database? (e.g., separate databases, table prefixes, or a `server_id` column?).
- **Database Access**: Do we have direct DB access or need to build an API layer?

## Next Steps
- Clarify requirements with the user.
- Read `functions.php` and `steamid.php` for deeper understanding of data helpers.
- Propose a technical architecture (likely a Vite frontend + simple backend API if standard PHP isn't desired).
