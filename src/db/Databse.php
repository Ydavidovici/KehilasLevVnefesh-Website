<?php
$db_host = 'localhost';
$db_name = 'myDatabase';
$db_user = 'eobrmgmy_209e_cg';
$db_pass = 'Ydavidovici35';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>