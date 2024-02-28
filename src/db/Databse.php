<?php
$db_host = 'localhost';
$db_name = 'eobrmgmy_Database-1';
$db_user = 'eobrmgmy_user_1';
$db_pass = 'Ydavidovici35';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>