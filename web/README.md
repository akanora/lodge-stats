# Lodge Stats

A modern, premium stats website for bhop servers built with React and PHP.

## Features

- **Real-time Player Counts** - Live player statistics from Source servers (excludes bots)
- **Recent Times & Records** - View latest completions and world records
- **Top Players Leaderboard** - Rankings by points
- **Server Tick Selection** - Toggle between 100-tick and 128-tick servers
- **Dark Premium Theme** - Modern UI with smooth animations
- **Auto-refresh** - Stats update every 30 seconds

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: PHP API with MySQLi
- **Styling**: Vanilla CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Installation

### Prerequisites
- Node.js 18+
- PHP 8.1+
- MySQL/MariaDB

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure database**
Edit `public/api/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_user');
define('DB_PASSWORD', 'your_password');
define('DB_NAME_100', 'bhoptimer_100t');
define('DB_NAME_128', 'bhoptimer_128t');
```

3. **Development**
```bash
npm run dev
```

4. **Production Build**
```bash
npm run build
```

## Deployment

1. Build the project: `npm run build`
2. Upload `dist/` contents to your web server (e.g., `/var/www/html/stats/`)
3. Ensure PHP has access to MySQL databases
4. Configure `vite.config.js` base path if deploying to subdirectory

## API Endpoints

- `GET /api/index.php?endpoint=recent&server=100&type=times` - Recent times
- `GET /api/index.php?endpoint=recent&server=100&type=records` - Recent records
- `GET /api/index.php?endpoint=top&server=100` - Top players
- `GET /api/index.php?endpoint=stats&server=100` - Live server stats
- `GET /api/index.php?endpoint=search&server=100&q=player` - Search players

## Configuration

### Server Addresses
Edit `public/api/server_query.php` to configure your Source server IPs:
```php
define('SERVER_100T', [
    '5.180.107.85:27015',
    // Add more servers...
]);
```

### Refresh Rate
Change auto-refresh interval in `src/pages/Home.jsx` (line 31):
```javascript
const interval = setInterval(fetchServerStats, 30000); // 30 seconds
```

## License

MIT

## Author

Lodge Gaming
