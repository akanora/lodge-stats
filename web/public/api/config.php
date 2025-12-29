<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // Placeholder
define('DB_PASSWORD', ''); // Placeholder

// Database Names for the two servers
define('DB_NAME_100', 'bhoptimer_100t'); // Placeholder
define('DB_NAME_128', 'bhoptimer_128t'); // Placeholder

// Steam API Configuration
define('STEAM_API_KEY', 'YOUR_STEAM_API_KEY_HERE');

// Site Branding
define('HOMEPAGE_TITLE', 'Lodge Stats');
define('TOPLEFT_TITLE', 'Lodge Stats');

// SourceBans Integration
define('SOURCEBANS_ENABLED', 1); // Set to 1 to enable, 0 to disable
define('SOURCEBANS_SITE', 'https://lodgegaming.com.tr/sourcebans/');

// Style Definitions
define('STYLES', [
    0 => 'Normal', 1 => 'Sideways', 2 => 'W-Only', 3 => 'Scroll', 4 => '400 Velocity',
    5 => 'Half-Sideways', 6 => 'A/D-Only', 7 => 'Segmented', 8 => 'Low Gravity', 9 => 'Slow Motion',
    10 => 'TAS', 11 => 'Autostrafer', 12 => 'Parkour', 13 => 'Speedrun', 14 => 'Slow Speedrun',
    15 => 'Prespeed', 16 => 'Seg Low Gravity', 17 => 'Unreal', 18 => 'Backwards', 19 => 'Double Jump',
    20 => 'Spiderman', 21 => 'EzScroll', 22 => 'Stamina', 23 => 'KZ', 24 => 'TASNL',
    25 => 'Thanos', 26 => 'Parachute', 27 => 'Surf HSW', 28 => 'Speed Demon'
]);

// Track Definitions
define('TRACKS', [
    0 => 'Main',
    1 => 'Bonus 1',
    2 => 'Bonus 2',
    3 => 'Bonus 3',
    4 => 'Bonus 4',
    5 => 'Bonus 5',
    6 => 'Bonus 6',
    7 => 'Bonus 7',
    8 => 'Bonus 8',
]);

define('RECORD_LIMIT', 100);
define('RECORD_LIMIT_LATEST', 100);
define('PLAYER_TOP_RANKING_LIMIT', 100);

// Helper to determine active DB
function get_db_name($server_tick) {
    if ($server_tick == '128') {
        return DB_NAME_128;
    }
    return DB_NAME_100;
}
?>
