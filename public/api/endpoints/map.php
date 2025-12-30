<?php
// Map records endpoint
$map = isset($_GET['map']) ? trim($_GET['map']) : '';

if (empty($map)) {
    $response = ['status' => 'error', 'message' => 'Map name required'];
} else {
    // Get all records for this map
    $stmt = $conn->prepare("
        SELECT 
            p.style, 
            p.track, 
            p.time, 
            p.auth, 
            u.name,
            p.date
        FROM playertimes p
        JOIN users u ON p.auth = u.auth
        WHERE p.map = ?
        ORDER BY p.style, p.track, p.time ASC
        LIMIT 1000
    ");
    $stmt->bind_param("s", $map);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $records = [];
    $rankCounters = [];
    
    while ($row = $result->fetch_assoc()) {
        $key = $row['style'] . '_' . $row['track'];
        
        if (!isset($rankCounters[$key])) {
            $rankCounters[$key] = 0;
        }
        
        $rankCounters[$key]++;
        $row['rank'] = $rankCounters[$key];
        
        if (!isset($records[$key])) {
            $records[$key] = [];
        }
        
        // Only keep top 100 per style/track
        if (count($records[$key]) < 100) {
            $records[$key][] = $row;
        }
    }
    
    $response = [
        'status' => 'success',
        'data' => [
            'map' => $map,
            'records' => $records
        ]
    ];
}
?>
