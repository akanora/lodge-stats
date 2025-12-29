<?php
// Debug endpoint to test Steam API avatar fetching
require_once '../config.php';

$steamid = isset($_GET['steamid']) ? $_GET['steamid'] : 'STEAM_1:0:40585178';

// Helper function to convert SteamID to SteamID64
function convertToSteamID64($steamid) {
    if (preg_match('/^STEAM_[0-1]:([0-1]):([0-9]+)$/', $steamid, $matches)) {
        return bcadd(bcadd(bcmul($matches[2], '2'), '76561197960265728'), $matches[1]);
    }
    return false;
}

$debug = [];
$debug['steamid'] = $steamid;
$debug['api_key_set'] = (defined('STEAM_API_KEY') && STEAM_API_KEY !== 'YOUR_STEAM_API_KEY_HERE');

$steamid64 = convertToSteamID64($steamid);
$debug['steamid64'] = $steamid64;

if ($steamid64 && $debug['api_key_set']) {
    $steamApiUrl = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" . STEAM_API_KEY . "&steamids=" . $steamid64;
    $debug['api_url'] = str_replace(STEAM_API_KEY, 'HIDDEN', $steamApiUrl);
    
    $steamData = @file_get_contents($steamApiUrl);
    $debug['api_response_received'] = ($steamData !== false);
    
    if ($steamData) {
        $steamJson = json_decode($steamData, true);
        $debug['json_decoded'] = ($steamJson !== null);
        $debug['response'] = $steamJson;
        
        if (isset($steamJson['response']['players'][0]['avatarfull'])) {
            $debug['avatar_url'] = $steamJson['response']['players'][0]['avatarfull'];
        } else {
            $debug['error'] = 'Avatar not found in response';
        }
    } else {
        $debug['error'] = 'Failed to fetch from Steam API';
    }
} else {
    $debug['error'] = 'Steam API key not set or invalid SteamID';
}

header('Content-Type: application/json');
echo json_encode($debug, JSON_PRETTY_PRINT);
?>
