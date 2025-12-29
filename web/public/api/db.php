<?php
require_once 'config.php';

class Database {
    private $connection;
    private $error_message = '';

    public function __construct($server_tick) {
        $db_name = get_db_name($server_tick);
        try {
            $this->connection = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, $db_name);
            
            if ($this->connection->connect_error) {
                $this->error_message = "Connection failed: " . $this->connection->connect_error;
                $this->connection = null;
            } else {
                $this->connection->set_charset('utf8');
            }
        } catch (Exception $e) {
            $this->error_message = "Exception: " . $e->getMessage();
            $this->connection = null;
        }
    }

    public function getConnection() {
        return $this->connection;
    }
    
    public function getError() {
        return $this->error_message;
    }
    
    public function query($sql) {
        if (!$this->connection) return false;
        return $this->connection->query($sql);
    }
    
    public function prepare($sql) {
        if (!$this->connection) return false;
        return $this->connection->prepare($sql);
    }
}
?>
