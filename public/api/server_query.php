<?php
// Server query configuration
define('SERVER_100T', [
    '5.180.107.85:27015',
    '5.180.107.85:27017',
    '5.180.107.85:27018',
    '5.180.107.85:27019'
]);

define('SERVER_128T', [
    '5.180.107.85:27016'
]);

// Query a Source engine server using A2S_INFO protocol
function querySourceServer($ip, $port) {
    $socket = @fsockopen("udp://$ip", $port, $errno, $errstr, 2);
    if (!$socket) {
        return ['error' => "Connection failed: $errstr ($errno)"];
    }
    
    stream_set_timeout($socket, 2);
    stream_set_blocking($socket, true);
    
    // A2S_INFO request
    $packet = pack('l', -1) . "TSource Engine Query\x00";
    fwrite($socket, $packet);
    
    $response = fread($socket, 4096);
    
    if (strlen($response) < 10) {
        // Check for challenge response (0x41)
        if (strlen($response) >= 5 && ord($response[4]) == 0x41) {
            $challenge = substr($response, 5, 4);
            
            // Resend with challenge on SAME socket
            $packet = pack('l', -1) . "TSource Engine Query\x00" . $challenge;
            fwrite($socket, $packet);
            $response = fread($socket, 4096);
        } else {
            fclose($socket);
            return ['error' => 'Invalid response length: ' . strlen($response)];
        }
    }
    
    fclose($socket);
    
    // Check for info response (0x49)
    if (strlen($response) < 10 || ord($response[4]) != 0x49) {
        return ['error' => 'Invalid response type'];
    }
    
    $pos = 5;
    $pos++; // Protocol version
    
    // Server name
    $nullPos = strpos($response, "\x00", $pos);
    if ($nullPos === false) return ['error' => 'Parse error'];
    $pos = $nullPos + 1;
    
    // Map name
    $nullPos = strpos($response, "\x00", $pos);
    if ($nullPos === false) return ['error' => 'Parse error'];
    $pos = $nullPos + 1;
    
    // Folder name
    $nullPos = strpos($response, "\x00", $pos);
    if ($nullPos === false) return ['error' => 'Parse error'];
    $pos = $nullPos + 1;
    
    // Game name
    $nullPos = strpos($response, "\x00", $pos);
    if ($nullPos === false) return ['error' => 'Parse error'];
    $pos = $nullPos + 1;
    
    // Steam App ID (2 bytes)
    if ($pos + 2 > strlen($response)) return ['error' => 'Parse error'];
    $pos += 2;
    
    // Players (1 byte)
    if ($pos >= strlen($response)) return ['error' => 'Parse error'];
    $players = ord($response[$pos]);
    $pos++;
    
    // Max players (1 byte)
    if ($pos >= strlen($response)) return ['error' => 'Parse error'];
    $maxPlayers = ord($response[$pos]);
    $pos++;
    
    // Bots (1 byte)
    if ($pos >= strlen($response)) return ['error' => 'Parse error'];
    $bots = ord($response[$pos]);
    $pos++;

    // Real players (humans only)
    $realPlayers = max(0, $players - $bots);    

    return [
        'players' => $realPlayers,
        'max_players' => $maxPlayers,
        'total_with_bots' => $players,
        'bots' => $bots
    ];
}

// Get combined stats for all servers
function getServerStats($serverType) {
    $servers = ($serverType === '128') ? SERVER_128T : SERVER_100T;
    
    $totalPlayers = 0;
    $totalMaxPlayers = 0;
    $errors = [];
    $successful = 0;
    
    foreach ($servers as $server) {
        list($ip, $port) = explode(':', $server);
        $info = querySourceServer($ip, (int)$port);
        
        if (isset($info['error'])) {
            $errors[] = "$server: " . $info['error'];
        } else {
            $totalPlayers += $info['players'];
            $totalMaxPlayers += $info['max_players'];
            $successful++;
        }
    }
    
    return [
        'players' => $totalPlayers,
        'max_players' => $totalMaxPlayers,
        'servers_queried' => count($servers),
        'servers_successful' => $successful
    ];
}
?>
