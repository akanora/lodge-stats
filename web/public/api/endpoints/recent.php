<?php
// Logic adaptation from r.php

// Input validation
$type = isset($_GET['type']) ? $_GET['type'] : 'times';
$type = in_array($type, ['times', 'records']) ? $type : 'times';
$map = isset($_GET['map']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['map']) : null;

// Build Query
// Note: This is a simplified adaptation.
$sql = "";
if ($type == 'records') {
    // Records (WRs) logic
    // Simplified query
    $sql = "SELECT p.map, u.name, p.style, p.time, p.date, u.auth 
            FROM playertimes p 
            JOIN users u ON p.auth = u.auth 
            WHERE p.time = (
                SELECT MIN(t2.time) 
                FROM playertimes t2 
                WHERE t2.map = p.map AND t2.style = p.style AND t2.track = p.track
            )
            ORDER BY p.date DESC LIMIT " . RECORD_LIMIT_LATEST;
} else {
    // Recent Times logic
    $sql = "SELECT p.map, u.name, p.style, p.time, p.date, u.auth 
            FROM playertimes p 
            JOIN users u ON p.auth = u.auth 
            ORDER BY date DESC LIMIT " . RECORD_LIMIT_LATEST;
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
