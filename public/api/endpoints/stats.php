<?php
// Get server stats (players online) and records today count

require_once 'config.php';
require_once 'db.php';
require_once 'server_query.php';

$server = isset($_GET['server']) ? $_GET['server'] : '100';

$db = new Database($server);
$conn = $db->getConnection();

$response = ['status' => 'error', 'message' => 'Failed to fetch stats'];

// Get server player count
$serverStats = getServerStats($server);

// Get records today count
$recordsToday = 0;
if ($conn) {
    // Count records from today (Unix timestamp for start of today)
    $todayStart = strtotime('today');
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM playertimes WHERE date >= ?");
    $stmt->bind_param("i", $todayStart);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $recordsToday = (int)$row['count'];
    }
}

$response = [
    'status' => 'success',
    'data' => [
        'players_online' => $serverStats['players'],
        'max_players' => $serverStats['max_players'],
        'records_today' => $recordsToday
    ]
];
?>
