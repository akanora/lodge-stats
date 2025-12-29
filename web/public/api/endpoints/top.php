<?php
// Logic adaptation from t.php

$sql = "SELECT auth, name, lastlogin, points FROM users ORDER BY points DESC LIMIT " . PLAYER_TOP_RANKING_LIMIT;

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
