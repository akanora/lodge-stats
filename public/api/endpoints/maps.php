<?php
// Maps list endpoint - returns all unique map names
$stmt = $conn->prepare("SELECT DISTINCT map FROM playertimes ORDER BY map ASC");
$stmt->execute();
$result = $stmt->get_result();

$maps = [];
while ($row = $result->fetch_assoc()) {
    $maps[] = $row['map'];
}

$response = ['status' => 'success', 'data' => $maps];
?>
