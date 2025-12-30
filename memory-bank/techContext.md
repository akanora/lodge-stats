# Technical Context

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Styling**: CSS Modules with custom properties
- **Build Tool**: Vite 7.3.0

### Backend
- **Language**: PHP 8.x
- **Database**: MySQL (via mysqli)
- **API**: RESTful endpoints
- **Server Query**: UDP socket for live stats

### Deployment
- **Web Server**: Apache/Nginx
- **SPA Routing**: .htaccess rewrite rules
- **Production**: Static build in `dist/` folder

## Project Structure

```
web/
├── public/
│   ├── api/
│   │   ├── config.php          # Database & API configuration
│   │   ├── db.php              # Database connection
│   │   ├── index.php           # API router
│   │   ├── server_query.php    # Live server stats
│   │   └── endpoints/
│   │       ├── recent.php      # Recent times/records
│   │       ├── top.php         # Top players (points/playtime)
│   │       ├── player.php      # Player profile data
│   │       ├── search.php      # Player search
│   │       ├── map.php         # Map records
│   │       ├── maps.php        # All maps list
│   │       ├── stats.php       # Live server stats
│   │       └── sourcebans.php  # SourceBans integration
│   ├── assets/
│   │   └── img/
│   │       ├── logo.png
│   │       └── favicon.png
│   └── .htaccess               # SPA routing rules
├── src/
│   ├── components/
│   │   └── Navbar.jsx          # Navigation component
│   ├── context/
│   │   └── ServerContext.jsx   # Server selection state
│   ├── pages/
│   │   ├── Home.jsx            # Recent times/records
│   │   ├── TopPlayers.jsx      # Leaderboards
│   │   ├── PlayerProfile.jsx   # Player details
│   │   └── MapRecords.jsx      # Map search & records
│   ├── services/
│   │   └── api.js              # API fetch utilities
│   ├── App.jsx                 # Main app & routing
│   └── index.css               # Global styles
└── dist/                       # Production build
```

## API Endpoints

### GET /api/index.php?endpoint=recent
Returns recent times or records
- Query params: `type` (times/records), `server` (100/128)

### GET /api/index.php?endpoint=top
Returns top players by points or playtime
- Query params: `type` (points/playtime), `server` (100/128)

### GET /api/index.php?endpoint=player
Returns player profile data
- Query params: `auth` (SteamID3), `server` (100/128)

### GET /api/index.php?endpoint=search
Searches players by name or SteamID
- Query params: `q` (search query), `server` (100/128)

### GET /api/index.php?endpoint=map
Returns map records by style and track
- Query params: `map` (map name), `server` (100/128)

### GET /api/index.php?endpoint=maps
Returns list of all unique map names
- Query params: `server` (100/128)

### GET /api/index.php?endpoint=stats
Returns live server statistics
- Query params: `server` (100/128)

### GET /api/index.php?endpoint=sourcebans
Returns SourceBans configuration
- No params required

## Database Schema

### Key Tables
- `users` - Player data (auth, name, points, playtime, lastlogin)
- `playertimes` - Time records (map, auth, style, track, time, date)

### Important Fields
- `auth` - SteamID3 format (numeric)
- `style` - Bhop style ID (0-28)
- `track` - Map track (0=Main, 1-8=Bonus)
- `time` - Completion time in seconds
- `points` - Player ranking points
- `playtime` - Total playtime in seconds

## Configuration

### Environment Variables (config.php)
- `DB_HOST` - Database host
- `DB_USER` - Database username
- `DB_PASS` - Database password
- `DB_NAME` - Database name
- `STEAM_API_KEY` - Steam Web API key
- `SOURCEBANS_ENABLED` - Enable/disable bans link
- `SOURCEBANS_SITE` - SourceBans URL
- `SERVER_IP_100T` - 100 tick server IP
- `SERVER_PORT_100T` - 100 tick server port
- `SERVER_IP_128T` - 128 tick server IP
- `SERVER_PORT_128T` - 128 tick server port

## Key Features Implementation

### SteamID Conversion
Converts SteamID3 (numeric) to SteamID2 format:
```javascript
const convertToSteamID2 = (steamid3) => {
    const accountId = parseInt(steamid3);
    const y = accountId % 2;
    const z = Math.floor(accountId / 2);
    return `STEAM_0:${y}:${z}`;
};
```

### Custom Autocomplete
- Uses filtered state with debounced input
- Absolutely positioned dropdown
- Custom dark theme styling
- Shows up to 15 suggestions

### Server Selection
- React Context for global state
- Persists to localStorage
- Affects all API calls

## Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
Output: `dist/` folder

### Deployment Steps
1. Build production bundle
2. Upload `dist/` contents to web root
3. Ensure `.htaccess` is in place
4. Configure `config.php` with credentials
5. Set proper file permissions

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support required
- CSS Grid and Flexbox support required
