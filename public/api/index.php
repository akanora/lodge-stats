<?php
// Security headers
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");

require_once 'config.php';
require_once 'db.php';

// Input validation and sanitization
$endpoint = isset($_GET['endpoint']) ? preg_replace('/[^a-z_]/', '', strtolower($_GET['endpoint'])) : '';
$server = isset($_GET['server']) ? preg_replace('/[^0-9]/', '', $_GET['server']) : '100';

// Validate server value
if (!in_array($server, ['100', '128'])) {
    $server = '100';
}

$response = ['status' => 'error', 'message' => 'Invalid endpoint'];

if ($endpoint) {
    $db = new Database($server);
    $conn = $db->getConnection();

    // If no DB connection (dev mode), return mock data or error
    if (!$conn) {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Database connection failed', 
            'code' => 'DB_CONN_ERR',
            'details' => $db->getError(),
            'server' => $server,
            'db_name' => get_db_name($server)
        ]);
        exit;
    }

    switch ($endpoint) {
        case 'recent':
            include 'endpoints/recent.php';
            break;
        case 'top':
            include 'endpoints/top.php';
            break;
        case 'search':
            include 'endpoints/search.php';
            break;
        case 'stats':
            include 'endpoints/stats.php';
            break;
        default:
            $response['message'] = 'Unknown endpoint';
            break;
    }
}

// Endpoints responsibilities are to set $response
echo json_encode($response);
?>
