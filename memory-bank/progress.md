# Project Progress

## Completed Features

### Core Functionality
- ✅ Custom Lodge Gaming branding with logo and site title
- ✅ Server selection (100T/128T) with persistent state
- ✅ Recent Times and Recent Records pages with live data
- ✅ Top Players leaderboard with Points and Playtime rankings
- ✅ Player profile pages with detailed statistics
- ✅ Map records page with search and filtering
- ✅ SourceBans integration (conditional display)
- ✅ Live server stats (player count, records today)

### Statistics Display
- ✅ **Jumps** - Total jump count for each run
- ✅ **Strafes** - Total strafe count for each run
- ✅ **Sync** - Strafe synchronization percentage (1 decimal)
- ✅ **Points** - Points earned for the run (integer)
- ✅ Time formatting with 2 decimal precision
- ✅ Stats visible on all pages: Home, Player Profile, Map Records

### Search & Autocomplete
- ✅ Player search functionality (by name or SteamID)
- ✅ Custom styled map autocomplete dropdown
- ✅ Search bar relocated to Top Players page
- ✅ Map suggestions with dark theme styling

### UI/UX Improvements
- ✅ SteamID3 to SteamID2 conversion for display
- ✅ Steam avatar integration for player profiles
- ✅ Fixed dropdown readability (dark backgrounds)
- ✅ Improved Top Players layout (tabs left, search right)
- ✅ Fixed player profile links from Top Players
- ✅ Responsive design with dark theme
- ✅ Clean navigation with active states
- ✅ Consistent data formatting across all pages

### Technical Improvements
- ✅ Fixed 404 errors on profile page refreshes
- ✅ Added .htaccess for SPA routing
- ✅ Cleaned up debug files
- ✅ Production build optimization
- ✅ GitHub repository sync
- ✅ Type conversion for MySQL numeric strings (parseFloat for sync)
- ✅ Proper error handling for missing data

## Recent Updates

### 2025-12-30: Stats Fields Addition
**Backend Changes:**
- Updated `recent.php` to include jumps, strafes, sync, points in queries
- Updated `player.php` to include stats in player times
- Updated `map.php` to include stats in map records
- All SQL queries now fetch complete statistical data

**Frontend Changes:**
- Added formatTime() function to Home.jsx for consistent time display
- Updated all table headers to include new stat columns
- Added data cells for jumps, strafes, sync, points
- Implemented parseFloat() for sync values (handles MySQL string returns)
- Updated colSpan values for loading/empty states
- Applied Math.round() to points for integer display

**Bug Fixes:**
- Fixed `TypeError: sync.toFixed is not a function` by using parseFloat()
- Updated time precision from 3 to 2 decimal places
- Ensured points display as integers instead of floats

### 2025-12-29: Map Search & Playtime
**Map Search Autocomplete:**
- Implemented custom styled dropdown (replaced native datalist)
- Dark themed with red accent hover effects
- Shows up to 15 matching maps
- Positioned absolutely to avoid layout shifts
- Smooth animations and transitions

**Playtime Leaderboard:**
- Added "Top Playtime" tab to Top Players page
- Backend support for playtime queries
- Time formatting (hours and minutes)
- Dynamic table headers based on selected ranking type

**Layout & Styling:**
- Moved player search to Top Players page
- Fixed tabs and search bar alignment (space-between)
- Improved dropdown styling across all pages
- Added bonus tracks 4-8 support

## Table Structure

### Home Page (Recent Times/Records)
| Map | Player | Time | **Jumps** | **Strafes** | **Sync** | **Points** | Date |

### Player Profile
| Map | Time | **Jumps** | **Strafes** | **Sync** | **Points** | Style | Track | Date |

### Map Records
| Rank | Player | Time | **Jumps** | **Strafes** | **Sync** | **Points** | Date |

## Data Formatting Standards

```javascript
// Time: 2 decimal places
formatTime(seconds) => "1:23.45" or "45.67s"

// Jumps & Strafes: Integers
{row.jumps || 0}
{row.strafes || 0}

// Sync: Percentage with 1 decimal
{row.sync ? `${parseFloat(row.sync).toFixed(1)}%` : '0%'}

// Points: Rounded integers
{Math.round(row.points) || 0}
```

## Deployment Status
- Production build: ✅ Complete (2025-12-30)
- GitHub push: ✅ Complete
- Ready for server deployment

## Files Modified (Complete List)

### Backend (PHP)
1. `web/public/api/endpoints/recent.php`
2. `web/public/api/endpoints/player.php`
3. `web/public/api/endpoints/map.php`

### Frontend (React)
1. `web/src/services/api.js`
2. `web/src/pages/Home.jsx`
3. `web/src/pages/PlayerProfile.jsx`
4. `web/src/pages/MapRecords.jsx`

### Configuration
1. `web/src/App.jsx` (footer update)
2. `.gitignore` (merged conflicts)

## Next Steps
- User to upload `web/dist/` folder to server
- Verify all features working in production
- Monitor for any issues or feedback
- Ensure database has stats columns populated with data

## Known Limitations
- Stats only display if database has the data
- Sync percentage assumes 0-100 range
- Time formatting assumes MM:SS.ms format
- Points rounded to nearest integer
