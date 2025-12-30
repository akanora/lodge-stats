# Active Context

## Current Status
**Project**: Lodge Gaming Bhop Stats Website  
**Status**: ✅ Production Ready  
**Last Updated**: 2025-12-30  
**Deployment**: Ready for server upload

## Recent Session Summary (2025-12-30)

### Latest Updates
1. ✅ Added Jumps, Strafes, Sync, Points columns to all record displays
2. ✅ Updated backend API endpoints to fetch new stats fields
3. ✅ Fixed sync data type issue (parseFloat for MySQL string values)
4. ✅ Updated time precision to 2 decimals (from 3)
5. ✅ Updated points display to integers (rounded)
6. ✅ Built and pushed to GitHub

### Previous Session (2025-12-29)
1. ✅ Added custom styled map autocomplete (dark themed)
2. ✅ Implemented playtime leaderboard with tab switcher
3. ✅ Moved player search to Top Players page
4. ✅ Fixed Top Players layout (tabs left, search right)
5. ✅ Fixed player profile link spacing issue
6. ✅ Cleaned up debug files

### Key Decisions Made
- **Stats Display**: Added Jumps, Strafes, Sync (%), Points to all tables
- **Data Formatting**: Time shows 2 decimals, Points as integers, Sync as percentage
- **Type Handling**: Used parseFloat() for sync values to handle MySQL string returns
- **Autocomplete**: Custom styled dropdown instead of native datalist
- **Search Placement**: Moved to Top Players page for better UX
- **Layout**: Space-between for tabs and search bar
- **Playtime**: Added as separate tab on Top Players page

## Current State

### Working Features
- ✅ All pages rendering correctly
- ✅ Server selection (100T/128T) working
- ✅ Player search with autocomplete
- ✅ Map search with custom dropdown
- ✅ Points and Playtime leaderboards
- ✅ Player profiles with Steam avatars
- ✅ Map records with style/track filtering
- ✅ **NEW**: Jumps, Strafes, Sync, Points stats on all records
- ✅ Live server stats
- ✅ SourceBans integration

### Data Display Format
- **Time**: 2 decimal places (e.g., `1:23.45` or `45.67s`)
- **Jumps**: Integer count
- **Strafes**: Integer count
- **Sync**: Percentage with 1 decimal (e.g., `92.5%`)
- **Points**: Integer (rounded)

### Known Issues
- None currently identified

### Pending User Actions
1. Upload `web/dist/` folder to production server
2. Verify `config.php` settings on server
3. Test all features in production environment
4. Post Discord announcement

## File Locations

### Production Build
- **Location**: `c:/Users/Nora/Documents/lodge stats/web/dist/`
- **Status**: Built and ready
- **Size**: ~254 KB (gzipped to 81 KB)

### Source Code
- **Location**: `c:/Users/Nora/Documents/lodge stats/web/src/`
- **Repository**: https://github.com/akanora/lodge-stats.git
- **Branch**: main
- **Last Commit**: "Merge remote changes and add stats features"

## Modified Files (Latest Session)

### Backend API
- `web/public/api/endpoints/recent.php` - Added stats fields to queries
- `web/public/api/endpoints/player.php` - Added stats to player times
- `web/public/api/endpoints/map.php` - Added stats to map records

### Frontend Components
- `web/src/services/api.js` - Updated mock data with stats
- `web/src/pages/Home.jsx` - Added stats columns, formatTime function
- `web/src/pages/PlayerProfile.jsx` - Added stats columns to recent times
- `web/src/pages/MapRecords.jsx` - Added stats columns to leaderboard

## Configuration Notes

### Required Server Setup
1. PHP 8.x with mysqli extension
2. MySQL database with bhoptimer tables (including jumps, strafes, sync, points columns)
3. Apache/Nginx with mod_rewrite
4. Steam Web API key in `config.php`
5. Server query ports accessible (UDP)

### Database Schema Requirements
The `playertimes` table must include:
- `jumps` (integer)
- `strafes` (integer)
- `sync` (float/decimal)
- `points` (integer/float)

### Environment Variables to Set
```php
STEAM_API_KEY = "your_steam_api_key_here"
SOURCEBANS_SITE = "your_sourcebans_url_here"
```

## Next Session Preparation

### If User Reports Issues
- Check browser console for errors
- Verify API endpoints returning data
- Check database connection
- Verify `.htaccess` routing
- Ensure database has stats columns populated

### Potential Future Enhancements
- Add more statistics/charts
- Implement player comparison
- Add world record tracking
- Mobile app version
- Admin dashboard
- Historical stats tracking
- Leaderboard filtering by date range

## Important Notes
- All code is in GitHub repository
- Production build is optimized and minified
- Custom autocomplete uses absolute positioning (no layout shift)
- SteamID conversion happens client-side
- Server selection persists in localStorage
- Sync values use parseFloat() to handle MySQL string returns
- Time formatting uses 2 decimals for consistency
- Points are rounded to integers for cleaner display
