<?php
// SourceBans configuration endpoint
// Config is already loaded by index.php

$response = [
    'enabled' => defined('SOURCEBANS_ENABLED') ? SOURCEBANS_ENABLED : 0,
    'url' => defined('SOURCEBANS_SITE') ? SOURCEBANS_SITE : ''
];
?>
