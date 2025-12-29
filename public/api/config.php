<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // Placeholder
define('DB_PASSWORD', ''); // Placeholder

// Database Names for the two servers
define('DB_NAME_100', 'bhoptimer_100t'); // Placeholder
define('DB_NAME_128', 'bhoptimer_128t'); // Placeholder

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
