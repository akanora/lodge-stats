<?php
// Player profile endpoint
$steamid = isset($_GET['steamid']) ? $_GET['steamid'] : '';
$filterStyle = isset($_GET['style']) ? intval($_GET['style']) : -1;
$filterTrack = isset($_GET['track']) ? intval($_GET['track']) : -1;

if (empty($steamid)) {
    $response = ['status' => 'error', 'message' => 'Steam ID required'];
} else {
    // Get player basic info
    $stmt = $conn->prepare("SELECT auth, name, points, lastlogin FROM users WHERE auth = ?");
    $stmt->bind_param("s", $steamid);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 0) {
        $response = ['status' => 'error', 'message' => 'Player not found'];
    } else {
        $player = $result->fetch_assoc();
        
        // Get Steam avatar using Steam API
        $steamAvatar = '';
        if (defined('STEAM_API_KEY') && STEAM_API_KEY !== 'YOUR_STEAM_API_KEY_HERE') {
            // Convert SteamID to SteamID64
            $steamid64 = convertToSteamID64($steamid);
            if ($steamid64) {
                $steamApiUrl = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" . STEAM_API_KEY . "&steamids=" . $steamid64;
                $steamData = @file_get_contents($steamApiUrl);
                if ($steamData) {
                    $steamJson = json_decode($steamData, true);
                    if (isset($steamJson['response']['players'][0]['avatarfull'])) {
                        $steamAvatar = $steamJson['response']['players'][0]['avatarfull'];
                    }
                }
            }
        }
        $player['avatar'] = $steamAvatar;
        
        // Build query for recent times with optional filters
        $timesQuery = "SELECT p.map, p.style, p.track, p.time, p.date FROM playertimes p WHERE p.auth = ?";
        $params = [$steamid];
        $types = "s";
        
        if ($filterStyle >= 0) {
            $timesQuery .= " AND p.style = ?";
            $params[] = $filterStyle;
            $types .= "i";
        }
        if ($filterTrack >= 0) {
            $timesQuery .= " AND p.track = ?";
            $params[] = $filterTrack;
            $types .= "i";
        }
        
        $timesQuery .= " ORDER BY p.date DESC LIMIT 50";
        
        $stmt = $conn->prepare($timesQuery);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $timesResult = $stmt->get_result();
        
        $recentTimes = [];
        while ($row = $timesResult->fetch_assoc()) {
            $recentTimes[] = $row;
        }
        
        // Get total map completions
        $stmt = $conn->prepare("SELECT COUNT(DISTINCT map) as maps_completed FROM playertimes WHERE auth = ?");
        $stmt->bind_param("s", $steamid);
        $stmt->execute();
        $mapsResult = $stmt->get_result();
        $mapsData = $mapsResult->fetch_assoc();
        
        // Get world records count
        $stmt = $conn->prepare("
            SELECT COUNT(*) as wr_count 
            FROM playertimes p1
            WHERE p1.auth = ? 
            AND p1.time = (
                SELECT MIN(p2.time) 
                FROM playertimes p2 
                WHERE p2.map = p1.map 
                AND p2.style = p1.style 
                AND p2.track = p1.track
            )
        ");
        $stmt->bind_param("s", $steamid);
        $stmt->execute();
        $wrResult = $stmt->get_result();
        $wrData = $wrResult->fetch_assoc();
        
        $response = [
            'status' => 'success',
            'data' => [
                'player' => $player,
                'recent_times' => $recentTimes,
                'maps_completed' => $mapsData['maps_completed'],
                'world_records' => $wrData['wr_count']
            ]
        ];
    }
}

// Helper function to convert SteamID to SteamID64
function convertToSteamID64($steamid) {
    // Check if it's already a numeric SteamID3 (account ID)
    if (is_numeric($steamid)) {
        // SteamID3 to SteamID64: add base constant
        return bcadd($steamid, '76561197960265728');
    }
    
    // Handle SteamID2 format: STEAM_X:Y:Z
    if (preg_match('/^STEAM_[0-1]:([0-1]):([0-9]+)$/', $steamid, $matches)) {
        return bcadd(bcadd(bcmul($matches[2], '2'), '76561197960265728'), $matches[1]);
    }
    
    return false;
}
?>
