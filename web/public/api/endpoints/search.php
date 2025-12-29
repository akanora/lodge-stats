<?php
// Input validation
$query = isset($_GET['q']) ? trim($_GET['q']) : '';
$query = substr($query, 0, 100); // Limit length to prevent abuse

if (strlen($query) < 3 || strlen($query) > 100) {
    $response = ['status' => 'error', 'message' => 'Query must be between 3 and 100 characters'];
} else {
    // Search by SteamID or Name
    // Note: Use prepared statements here! based on sample pattern.
    $stmt = $conn->prepare("SELECT auth, name, lastlogin, points FROM users WHERE name LIKE ? OR auth LIKE ? LIMIT 20");
    $searchTerm = "%" . $query . "%";
    $stmt->bind_param("ss", $searchTerm, $searchTerm);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    $response = ['status' => 'success', 'data' => $data];
}
?>
