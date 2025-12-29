<?php
// Top players endpoint
$type = isset($_GET['type']) ? $_GET['type'] : 'points'; // 'points' or 'playtime'

// Validate type
if (!in_array($type, ['points', 'playtime'])) {
    $type = 'points';
}

// Build query based on type
if ($type === 'playtime') {
    $sql = "SELECT auth, name, playtime, lastlogin FROM users WHERE playtime > 0 ORDER BY playtime DESC LIMIT " . PLAYER_TOP_RANKING_LIMIT;
} else {
    $sql = "SELECT auth, name, points, lastlogin FROM users ORDER BY points DESC LIMIT " . PLAYER_TOP_RANKING_LIMIT;
}

$result = $conn->query($sql);
$data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    $response = ['status' => 'success', 'data' => $data];
} else {
    $response = ['status' => 'error', 'message' => $conn->error];
}
?>
